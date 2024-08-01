import { React, useState, useEffect } from 'react'
import { Row, Col, Card, Button } from 'react-bootstrap';
import secureLocalStorage from 'react-secure-storage'
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import message from '../../../modules/message'
import TreeView from 'modules/TreeView';
import HtmlHead from 'components/html-head/HtmlHead';
import BreadcrumbList from 'components/breadcrumb-list/BreadcrumbList';
import DTable from 'modules/DataTable/DTable';
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import ViewModal from './modals/view'
import DeleteModal from 'utils/deleteModal';
import AddTeacherModal from './modals/addTeacher';
import EditTeacherModal from './modals/editTeacher';
import RoleChangeModal from './modals/roleChange'
import InfoChangeModal from './modals/infoChange';
import StatusChangeModal from './modals/statusChange'
import PasswordResetModal from './modals/passwordReset'
import LoginNameChangeModal from './modals/loginNameChange'
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone'
import PreviewTwoToneIcon from '@mui/icons-material/PreviewTwoTone'
import LockResetTwoToneIcon from '@mui/icons-material/LockResetTwoTone'
import BorderColorTwoToneIcon from '@mui/icons-material/BorderColorTwoTone'
import DescriptionTwoToneIcon from '@mui/icons-material/DescriptionTwoTone'
import CameraFrontTwoToneIcon from '@mui/icons-material/CameraFrontTwoTone'
import ManageAccountsTwoToneIcon from '@mui/icons-material/ManageAccountsTwoTone'
import ImportContactsTwoToneIcon from '@mui/icons-material/ImportContactsTwoTone'
import SettingsApplicationsTwoToneIcon from '@mui/icons-material/SettingsApplicationsTwoTone'
import { fetchRequest } from 'utils/fetchRequest';
import {
    schoolTeacherIndex, schoolTeacherDelete, schoolTeacherStatusChange,
    schoolTeacherChangeUsername, schoolTeacherChangePassword, schoolTeacherChangeRole, schoolTeacherInfo
} from 'utils/fetchRequest/Urls';

import { Tab } from "semantic-ui-react";
import {cloneDeep} from 'lodash'
import { useTranslation } from "react-i18next";

const MainGroup = () => {

    const locale = "mn"
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false);

    const { selectedSchool } = useSelector(state => state.schoolData);

    const title = t('teacher.title');
    const description = "E-learning";
    const breadcrumbs = [
        { to: "", text: "Home" },
        { to: "school/teacher", text: title }
    ];

    const [initLoaded, setInitLoaded] = useState(false)

    const [statuses, setStatuses] = useState([])
    const [totalCount, setTotalCount] = useState(0);
    const [tableData, setTableData] = useState([]);
    const [treeData, setTreeData] = useState([])
    const [selectedTableDataId, setSelectedTableDataId] = useState(null)
    const [selectedTreeDataId, setSelectedTreeDataId] = useState(null)
    const [selectedStatusCode, setSelectedStatusCode] = useState('ACTIVE')

    const [tableState, setTableState] = useState({
        filter: {},
        page: 1,
        pageSize: 10,
        search: '',
        sort: 'firstName',
        order: 'asc'
    })

    const [showViewModal, setShowViewModal] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [showRoleChangeModal, setShowRoleChangeModal] = useState(false)
    const [showInfoChangeModal, setShowInfoChangeModal] = useState(false)
    const [showStatusChangeModal, setStatusChangeModal] = useState(false)
    const [showAddTeacherModal, setShowAddTeacherModal] = useState(false)
    const [showEditTeacherModal, setShowEditTeacherModal] = useState(false)
    const [showPasswordResetModal, setShowPasswordResetModal] = useState(false)
    const [showLoginNameChangeModal, setShowLoginNameChangeModal] = useState(false)

    const config = {
        excelExport: true,
        printButton: true,
        columnButton: true,
        excelFileName: `${secureLocalStorage.getItem('selectedSchool')?.text}-${t('teacher_title')}`,
        defaultSort: [{
            dataField: tableState?.sort || 'firstName',
            order: tableState?.order || 'asc'
        }],
        defaultPageOptions: {
            page: tableState?.page || 1,
            sizePerPage: tableState?.pageSize || 10,
            search: tableState?.search || '',
        }
    }

    const activeColumns = [
        {
            dataField: 'avatar',
            text: t('teacher.photo'),
            sort: true,
            width: 40,
            align: 'center',
            formatter: (cell) =>
                <img className='img-responsive img-circle'
                    src={cell || '/img/profile/placeholder.jpg'}
                    width={40} height={40} alt='profile picture'
                    onError={(e) => {
                        e.target.onError = null
                        e.target.src = '/img/profile/avatar.png'
                    }}
                />
        },
        {
            dataField: 'code',
            text: t('teacher.code'),
            sort: true
        },
        {
            dataField: 'lastName',
            text: t('teacher.lastname'),
            sort: true
        },
        {
            dataField: 'firstName',
            text: t('teacher.name'),
            sort: true,
            formatter: (cell, row) =>
                <span
                    className='underline'
                    onClick={() => handleContextMenuClick(row?.id, 'view')}
                >
                    {cell}
                </span>
        },
        {
            dataField: 'title',
            text: t('teacher.teacher_title'),
            sort: true
        },
        {
            dataField: 'username',
            text: t('teacher.login_name'),
            sort: true
        },
        {
            dataField: 'contact',
            text: t('teacher.phone_number'),
            sort: true
        },
        {
            dataField: 'registrationNumber',
            text: t('register_number'),
            sort: true
        },
        {
            dataField: 'subjectNames',
            text: t('teacher.subjects'),
            sort: false
        },
        {
            dataField: 'className',
            text: t('teacher.teacher_class'),
            sort: false
        },
    ]

    const otherColumns = [
        {
            dataField: 'avatar',
            text: t('teacher.photo'),
            sort: false,
            width: 40,
            align: 'center',
            formatter: (cell) =>
                <img className='img-responsive img-circle'
                    src={cell || '/img/profile/placeholder.jpg'}
                    width={40} height={40} alt='profile picture'
                />
        },
        {
            dataField: 'code',
            text: t('teacher.code'),
            sort: true
        },
        {
            dataField: 'lastName',
            text: t('teacher.lastname'),
            sort: true
        },
        {
            dataField: 'firstName',
            text: t('teacher.name'),
            sort: true,
            formatter: (cell, row) =>
                <span
                    className='underline'
                    onClick={() => handleContextMenuClick(row?.id, 'view')}
                >
                    {cell}
                </span>
        },
        {
            dataField: 'title',
            text: t('teacher.teacher_title'),
            sort: true
        },
        {
            dataField: 'username',
            text: t('teacher.login_name'),
            sort: true
        },
        {
            dataField: 'subjectNames',
            text: t('teacher.subjects'),
            sort: false
        },
        {
            dataField: 'className',
            text: t('teacher.teacher_class'),
            sort: false
        },
    ]

    const activeContextMenus = [
        {
            key: 'view',
            icon: <PreviewTwoToneIcon sx={{ fontSize: '2rem !important', color: '#ff5b1d' }} />,
            title: t('view'),
        },
        {
            key: 'edit',
            icon: <BorderColorTwoToneIcon sx={{ fontSize: '2rem !important', color: '#ff5b1d' }} />,
            title: t('edit')
        },
        {
            key: 'delete',
            icon: <DeleteTwoToneIcon sx={{ fontSize: '2rem !important', color: '#ff5b1d' }} />,
            title: t('delete')
        },
        {
            key: 'statusChange',
            icon: <CameraFrontTwoToneIcon sx={{ fontSize: '2rem !important', color: '#ff5b1d' }} />,
            title: t('teacher.change_status')
        },
        {
            key: 'loginNameChange',
            icon: <SettingsApplicationsTwoToneIcon sx={{ fontSize: '2rem !important', color: '#ff5b1d' }} />,
            title: t('teacher.change_login_name'),
        },
        {
            key: 'passwordReset',
            icon: <LockResetTwoToneIcon sx={{ fontSize: '2rem !important', color: '#ff5b1d' }} />,
            title: t('teacher.change_password'),
        },
        {
            key: 'roleChange',
            icon: <ManageAccountsTwoToneIcon sx={{ fontSize: '2rem !important', color: '#ff5b1d' }} />,
            title: t('manage_roles'),
        },
        {
            key: 'infoChange',
            icon: <ImportContactsTwoToneIcon sx={{ fontSize: '2rem !important', color: '#ff5b1d' }} />,
            title: t('insert_information'),
        },
    ]

    const otherContextMenus = [
        {
            key: 'view',
            icon: <PreviewTwoToneIcon sx={{ fontSize: '2rem !important', color: '#ff5b1d' }} />,
            title: t('view'),
        },
        {
            key: 'edit',
            icon: <BorderColorTwoToneIcon sx={{ fontSize: '2rem !important', color: '#ff5b1d' }} />,
            title: t('edit')
        },
        {
            key: 'delete',
            icon: <DeleteTwoToneIcon sx={{ fontSize: '2rem !important', color: '#ff5b1d' }} />,
            title: t('delete')
        },
        {
            key: 'statusChange',
            icon: <CameraFrontTwoToneIcon sx={{ fontSize: '2rem !important', color: '#ff5b1d' }} />,
            title: t('teacher.change_status')
        },
    ]

    const [columns, setColumns] = useState(activeColumns)
    const [contextMenus, setContextMenus] = useState(activeContextMenus)

    const loadData = (params = {}) => {
        setLoading(true)
        setTableData([])
        setTotalCount(0)
        fetchRequest(schoolTeacherIndex, 'POST', params)
            .then((res) => {
                if (res?.success) {
                    setStatuses((res?.statuses || []).map((obj, index) => {
                        return {
                            index: index,
                            menuItem: obj.name,
                            code: obj.code,
                            id: obj.id
                        }
                    }))
                    setTreeData(res?.grades || [])
                    setTableData(res?.teachers || [])
                    setTotalCount(res?.totalCount || 0)

                    setInitLoaded(true)
                }
                setLoading(false)
            })
    }

    useEffect(() => {
        loadData({
            school: selectedSchool?.id,
            status: selectedStatusCode
        })
    }, [])

    const onListRefresh = () => {
        loadData({
            school: selectedSchool?.id,
            status: selectedStatusCode,
            grade: selectedTreeDataId,
            page: tableState?.page,
            pageSize: tableState?.pageSize,
            search: tableState?.search,
            sort: tableState?.sort,
            order: tableState?.order
        })
    }

    const closeModal = (isLoadData = false) => {
        if (isLoadData) {
            onListRefresh()
        }
        setShowAddTeacherModal(false)
        setShowEditTeacherModal(false)
        setShowDeleteModal(false)
        setShowViewModal(false)
        setStatusChangeModal(false)
        setSelectedTableDataId(null)
        setShowRoleChangeModal(false)
        setShowInfoChangeModal(false)
        setShowPasswordResetModal(false)
        setShowLoginNameChangeModal(false)
    }

    const handleTreeSelect = key => {
        if (key && key.length > 0) {
            setSelectedTreeDataId(key[0])

            const clone = cloneDeep(tableState)
            clone.page = 1;
            setTableState(clone)

            loadData({
                school: selectedSchool?.id,
                status: selectedStatusCode,
                grade: key[0],
                page: 1,
                pageSize: tableState?.pageSize,
                search: tableState?.search,
                sort: tableState?.sort,
                order: tableState?.order
            })
        }
    }

    const handleTabChange = (e, data) => {
        let code = statuses?.find(obj => obj?.index === data?.activeIndex)?.code || 'ACTIVE';
        setSelectedStatusCode(code)

        const clone = cloneDeep(tableState)
        clone.page = 1;
        setTableState(clone)

        loadData({
            school: selectedSchool?.id,
            status: code,
            grade: selectedTreeDataId,
            page: 1,
            pageSize: tableState?.pageSize,
            search: tableState?.search,
            sort: tableState?.sort,
            order: tableState?.order
        })
    }

    const onUserInteraction = state => {
        if (initLoaded) {
            let page = state?.page
            if (tableState?.search !== state?.search) {
                page = 1;
            }

            setTableState({
                page: page,
                pageSize: state?.pageSize,
                search: state?.search,
                sort: state?.sort,
                order: state?.order
            })
            loadData({
                school: selectedSchool?.id,
                status: selectedStatusCode,
                grade: selectedTreeDataId,
                page: page,
                pageSize: state?.pageSize,
                search: state?.search,
                sort: state?.sort,
                order: state?.order
            })
        }
    }

    const handleContextMenuClick = (id, key) => {
        if (id && key) {
            setSelectedTableDataId(id)
            if (key === 'view') {
                setShowViewModal(true)
            } else if (key === 'edit') {
                setShowEditTeacherModal(true)
            } else if (key === 'delete') {
                setShowDeleteModal(true)
            } else if (key === 'passwordReset') {
                setShowPasswordResetModal(true)
            } else if (key === 'statusChange') {
                setStatusChangeModal(true)
            } else if (key === 'loginNameChange') {
                setShowLoginNameChangeModal(true)
            } else if (key === 'roleChange') {
                setShowRoleChangeModal(true)
            } else if (key === 'infoChange') {
                setShowInfoChangeModal(true)
            }
        }
    }

    useEffect(() => {
        if (selectedStatusCode === 'ACTIVE') {
            tableData?.forEach(el => {
                el.contextMenuKeys = 'view, edit, delete, statusChange, loginNameChange, passwordReset, roleChange, infoChange'
            })
            setColumns(activeColumns)
            setContextMenus(activeContextMenus)
        } else {
            if (selectedStatusCode === 'QUIT') {
                tableData?.forEach(el => {
                    el.contextMenuKeys = 'view, edit, delete, statusChange'
                })
            } else if (selectedStatusCode === 'DELETED') {
                tableData?.forEach(el => {
                    el.contextMenuKeys = 'view, statusChange'
                })
            } else {
                tableData?.forEach(el => {
                    el.contextMenuKeys = 'view, edit, delete, statusChange'
                })
            }
            setColumns(otherColumns)
            setContextMenus(otherContextMenus)
        }
    }, [selectedStatusCode, tableData])

    const handleDelete = () => {
        setLoading(true)
        fetchRequest(schoolTeacherDelete, 'POST', {
            school: selectedSchool?.id,
            teacher: selectedTableDataId
        })
            .then((res) => {
                if (res?.success) {
                    if (res?.teachers) {
                        setTableData(res?.teachers || [])
                        setTotalCount(res?.totalCount || 0)
                    } else {
                        onListRefresh()
                    }
                    closeModal()
                    message(res?.message, true)
                } else {
                    message(res?.message)
                }
                setLoading(false)
            })
            .catch(e => {
                message(t('err.error_occurred'))
                setLoading(false)
            })
    }

    const handleStatusChange = (toStatus = null) => {
        setLoading(true)
        fetchRequest(schoolTeacherStatusChange, 'POST', {
            school: selectedSchool?.id,
            teacher: selectedTableDataId,
            to: toStatus,
            grade: selectedTreeDataId,
            page: tableState?.page,
            pageSize: tableState?.pageSize,
            search: tableState?.search,
            sort: tableState?.sort,
            order: tableState?.order,
            status: statuses?.find(obj => obj.code === selectedStatusCode)?.id
        })
            .then((res) => {
                if (res?.success) {
                    if (res?.teachers) {
                        setTableData(res?.teachers || [])
                        setTotalCount(res?.totalCount || 0)
                    } else {
                        onListRefresh()
                    }
                    closeModal()
                    message(res?.message, true)
                } else {
                    message(res?.message)
                }
                setLoading(false)
            })
            .catch(e => {
                message(t('err.error_occurred'))
                setLoading(false)
            })
        // setLoading(true)
        // fetchRequest(schoolTeacherStatusChange, 'POST', {
        //     teacher: selectedTableDataId,
        //     status,
        //     submit: 1,
        //     menu: 'teacher',
        //     tab: selectedTabData?.id,
        //     grade: selectedTreeDataId,
        //     filter: tableState?.filter,
        //     order: tableState?.order,
        //     sort: tableState?.sort,
        //     page: tableState?.page,
        //     pageSize: tableState?.pageSize,
        //     search: tableState?.search,
        // })
        //     .then((res) => {
        //         if (res.success) {
        //             message(res.data.message, res.success)
        //             const {teachers, totalCount} = res?.data
        //             setTableData(teachers || [])
        //             setTotalCount(totalCount || 0)
        //             closeModal()
        //         } else {
        //             message(res.data.message)
        //         }
        //         setLoading(false)
        //     })
        //     .catch(() => {
        //         message(t('err.error_occurred')
        //         setLoading(false)
        //     })
    }

    const handleLoginNameChange = params => {
        let updateParams = Object.assign(params, {
            school: selectedSchool?.id,
            status: selectedStatusCode,
            grade: selectedTreeDataId,
            page: tableState?.page,
            pageSize: tableState?.pageSize,
            search: tableState?.search,
            sort: tableState?.sort,
            order: tableState?.order
        })
        setLoading(true)
        fetchRequest(schoolTeacherChangeUsername, 'POST', updateParams)
            .then((res) => {
                if (res?.success) {
                    if (res?.teachers) {
                        setTableData(res?.teachers || [])
                        setTotalCount(res?.totalCount || 0)
                    } else {
                        onListRefresh()
                    }
                    closeModal()
                    message(res?.message, true)
                } else {
                    message(res?.message)
                }
                setLoading(false)
            })
            .catch(e => {
                message(t('err.error_occurred'))
                setLoading(false)
            })
    }

    const handleRoleChange = roles => {
        setLoading(true)
        fetchRequest(schoolTeacherChangeRole, 'POST', {
            school: selectedSchool?.id,
            teacher: selectedTableDataId,
            submit: 1,
            roles: JSON.stringify(roles)
        })
            .then((res) => {
                if (res?.success) {
                    closeModal()
                    message(res?.message, true)
                } else {
                    message(res?.message)
                }
                setLoading(false)
            })
            .catch(e => {
                message(t('err.error_occurred'))
                setLoading(false)
            })
    }

    const handleInfoChange = params => {
        let updateParams = Object.assign(params, {
            school: selectedSchool?.id,
            teacher: selectedTableDataId,
            submit: 1
        })
        setLoading(true)
        fetchRequest(schoolTeacherInfo, 'POST', updateParams)
            .then((res) => {
                if (res?.success) {
                    closeModal()
                    message(res?.message, true)
                } else {
                    message(res?.message)
                }
                setLoading(false)
            })
            .catch(() => {
                message(t('err.error_occurred'))
                setLoading(false)
            })

        // setLoading(true)
        // fetchRequest(schoolTeacherInfoChange, 'POST', {...param, teacher: selectedTableDataId, submit: 1})
        //     .then((res) => {
        //         if (res.success) {
        //             message(res.data.message, res.success)
        //             closeModal()
        //         } else {
        //             message(res.data.message)
        //         }
        //         setLoading(false)
        //     })
        //     .catch(() => {
        //         message(t('err.error_occurred'))
        //         setLoading(false)
        //     })
    }

    const handlePasswordReset = params => {
        let updateParams = Object.assign(params, {
            school: selectedSchool?.id
        })
        setLoading(true)
        fetchRequest(schoolTeacherChangePassword, 'POST', updateParams)
            .then((res) => {
                if (res?.success) {
                    closeModal()
                    message(res?.message, true)
                } else {
                    message(res?.message)
                }
                setLoading(false)
            })
            .catch(e => {
                message(t('err.error_occurred'))
                setLoading(false)
            })
    }

    return (
        <>
            <HtmlHead title={title} description={description} />

            <div className="page-title-container mb-2">
                <Col md="7" className='p-0'>
                    <h1 className="mb-0 pb-0 display-4 relative">{title}</h1>
                    <BreadcrumbList items={breadcrumbs} />
                </Col>
            </div>

            <div className='m-content'>
                <Row className=''>
                    <Col xl="2" xxl="2">
                        <div className='m-portlet'>
                            <div className='m-portlet__body'>
                                <TreeView
                                    treeData={treeData}
                                    selectedNodes={[selectedTreeDataId]}
                                    onSelect={handleTreeSelect}
                                    defaultExpandAll
                                />
                            </div>
                        </div>
                    </Col>

                    <Col xl="10" xxl="10">
                        <button
                            onClick={() => setShowAddTeacherModal(true)}
                            className='btn btn-sm m-btn--pill btn-info m-btn--uppercase d-inline-flex mb-3'
                        >
                            <ControlPointIcon style={{ color: "white", marginRight: "4px" }} className='MuiSvg-customSize'/>
                            {t('action.register')}
                        </button>
                        <div className='m-portlet tab'>
                            <div className=''>
                                <Tab
                                    menu={{ secondary: true, pointing: true, className: 'primaryColor m-0 h-4' }}
                                    onTabChange={(e, data) => handleTabChange(e, data)}
                                    className='m-portlet-header'
                                    panes={statuses?.map(statusObj => {
                                        return {
                                            menuItem: statusObj?.menuItem,
                                            render: () => (
                                                <div className='m-portlet__body'>
                                                    <DTable
                                                        remote
                                                        config={config}
                                                        locale={locale}
                                                        data={tableData}
                                                        columns={columns}
                                                        currentPage={tableState?.page || 1}
                                                        clickContextMenu
                                                        individualContextMenus
                                                        contextMenus={contextMenus}
                                                        onContextMenuItemClick={handleContextMenuClick}
                                                        onInteraction={onUserInteraction}
                                                        totalDataSize={totalCount}
                                                    />
                                                </div>
                                            )
                                        }
                                    })}
                                />
                            </div>
                        </div>
                    </Col>
                </Row>
            </div>
            {
                loading &&
                <>
                    <div className='loader-container'>
                        <svg className="splash-spinner" viewBox="0 0 50 50">
                            <circle className="path" cx="25" cy="25" r="20" fill="none" strokeWidth="5" />
                        </svg>
                    </div>
                </>
            }
            {
                showViewModal && selectedTableDataId &&
                <ViewModal
                    id={selectedTableDataId}
                    onClose={closeModal}
                />
            }
            {
                showPasswordResetModal && selectedTableDataId &&
                <PasswordResetModal
                    onClose={closeModal}
                    onSubmit={handlePasswordReset}
                    teacherId={selectedTableDataId}
                />
            }
            {
                showStatusChangeModal && selectedTableDataId &&
                <StatusChangeModal
                    onClose={closeModal}
                    onSubmit={handleStatusChange}
                    teacherId={selectedTableDataId}
                    statuses={statuses}
                />
            }
            {
                showLoginNameChangeModal && selectedTableDataId &&
                <LoginNameChangeModal
                    onClose={closeModal}
                    onSubmit={handleLoginNameChange}
                    teacherId={selectedTableDataId}
                    loginName={tableData?.find(obj => obj?.id === selectedTableDataId)?.username}
                />
            }
            {
                showRoleChangeModal && selectedTableDataId &&
                <RoleChangeModal
                    onClose={closeModal}
                    onSubmit={handleRoleChange}
                    teacherId={selectedTableDataId}
                />
            }
            {
                showInfoChangeModal && selectedTableDataId &&
                <InfoChangeModal
                    onClose={closeModal}
                    onSubmit={handleInfoChange}
                    teacherId={selectedTableDataId}
                />
            }
            {
                // selectedGroupId &&
                showDeleteModal &&
                <DeleteModal
                    show={showDeleteModal}
                    onClose={closeModal}
                    onDelete={handleDelete}
                    locale={locale}
                    title={t('warning.delete')}
                >
                    {t('warning.delete_confirmation')}
                    <br />
                    <br />
                    {t('warning.delete_confirmation_description')}
                </DeleteModal>
            }
            {
                showAddTeacherModal &&
                <AddTeacherModal
                    onClose={closeModal}
                />
            }
            {
                showEditTeacherModal && selectedTableDataId &&
                <EditTeacherModal
                    teacherId={selectedTableDataId}
                    onClose={closeModal}
                />
            }
        </>
    );
};

export default MainGroup;
