import { useState } from 'react'
import message from 'modules/message'
import ViewModal from './modals/view'
import React, { useEffect } from 'react'
import { Tab } from 'semantic-ui-react'
import HtmlHead from 'components/html-head/HtmlHead';
import TabComponent from 'components/tab/Tab';
import DTable from 'modules/DataTable/DTable'
import DeleteModal from 'utils/deleteModal'
import RoleChangeModal from './modals/roleChange'
import StatusChangeModal from './modals/statusChange'
import SetTeacherModal from './modals/setTeacher'
// import { Link, useNavigate } from 'react-router-dom'
import secureLocalStorage from 'react-secure-storage'
import { Row, Col, Card, Button } from 'react-bootstrap';
import PasswordResetModal from './modals/passwordReset'
import LoginNameChangeModal from './modals/loginNameChange'
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone'
import PreviewTwoToneIcon from '@mui/icons-material/PreviewTwoTone'
import LockResetTwoToneIcon from '@mui/icons-material/LockResetTwoTone'
import BorderColorTwoToneIcon from '@mui/icons-material/BorderColorTwoTone'
import CameraFrontTwoToneIcon from '@mui/icons-material/CameraFrontTwoTone'
import ManageAccountsTwoToneIcon from '@mui/icons-material/ManageAccountsTwoTone'
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import BreadcrumbList from 'components/breadcrumb-list/BreadcrumbList';
import SchoolIcon from '@mui/icons-material/School'
import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded'
import SettingsApplicationsTwoToneIcon from '@mui/icons-material/SettingsApplicationsTwoTone'
// import { schoolStaffDelete, schoolStaffIndex, schoolStaffLoginNameChange, schoolStaffPasswordReset, schoolStaffRoleChange, schoolStaffStatusChange } from 'Utilities/url'
import EditWorkerModal from './modals/editWorker'
import AddWorkerModal from './modals/addWorker'
import { useTranslation } from "react-i18next";

const locale = secureLocalStorage?.getItem('selectedLang') || 'mn'
const tableIndex = 'school_employee_table_index';
const localeSelectedTab = 'school_employee_tab_data';

const index = () => {

    const { t } = useTranslation();
    
    const title = t('staff.title')
    const description = "E-learning";
    const breadcrumbs = [
        { to: "", text: "Home" },
        { to: "school/worker", text: title }
    ];

    const [loading, setLoading] = useState(false)

    const [tabData, setTabData] = useState([])
    const [selectedTabData, setSelectedTabData] = useState(secureLocalStorage?.getItem(localeSelectedTab) || 'active')

    const [columns, setColumns] = useState([])
    const [tableData, setTableData] = useState([{id: 11, code: "23232", firstName: "asdfsdf"}, {id: 12, code: "2322", firstName: "asasdfsdf"}])
    const [totalCount, setTotalCount] = useState(0);
    const [contextMenus, setContextMenus] = useState([])
    const [selectedTableDataId, setSelectedTableDataId] = useState(null)
    const [firstRender, setFirstRender] = useState(false);

    const [showViewModal, setShowViewModal] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [showRoleChangeModal, setShowRoleChangeModal] = useState(false)
    const [showAddWorkerModal, setShowAddWorkerModal] = useState(false)
    const [showEditWorkerModal, setShowEditWorkerModal] = useState(false)
    const [showSetTeacherModal, setShowSetTeacherModal] = useState(false)
    const [showStatusChangeModal, setStatusChangeModal] = useState(false)
    const [showPasswordResetModal, setShowPasswordResetModal] = useState(false)
    const [showLoginNameChangeModal, setShowLoginNameChangeModal] = useState(false)

    const [tableState, setTableState] = useState(
        secureLocalStorage?.getItem(tableIndex) ||
        {
            page: 1,
            pageSize: 10,
            search: '',
            sort: 'firstName',
            order: 'asc',
        }
    );
    
    const activeColumns = [
        {
            dataField: "avatar",
            text: t('teacher.photo'),
            sort: true,
            width: 40,
            align: 'center',
            formatter: (cell) =>
                <img
                    className='img-responsive img-circle'
                    src={cell || '/img/profile/avatar.png'}
                    width={40} height={40} alt='profile picture'
                    onError={(e) => {
                        e.target.onError = null
                        e.target.src = '/img/profile/avatar.png'
                    }}
                />
        },
        {
            dataField: "code",
            text: t('staff.code'),
            sort: true
        },
        {
            dataField: "lastName",
            text: t('staff.lastName'),
            sort: true
        },
        {
            dataField: "firstName",
            text: t('staff.firstName'),
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
            dataField: "title",
            text: t('teacher.teacher_title'),
            sort: true
        },
        {
            dataField: "username",
            text: t('teacher.login_name'),
            sort: true
        },
        {
            dataField: "contact",
            text: t('phoneNumber'),
            sort: true,
        },
        {
            dataField: 'registrationNumber',
            text: t('register_number'),
            sort: true
        },
    ]

    const otherColumns = [
        {
            dataField: "avatar",
            text: t('teacher.photo'),
            sort: true,
            width: 40,
            align: 'center',
            formatter: (cell) =>
                <img
                    className='img-responsive img-circle'
                    src={cell || '/img/profile/avatar.png'}
                    width={40} height={40} alt='profile picture'
                    onError={(e) => {
                        e.target.onError = null
                        e.target.src = '/img/profile/avatar.png'
                    }}
                />
        },
        {
            dataField: "code",
            text: t('staff.code'),
            sort: true
        },
        {
            dataField: "lastName",
            text: t('staff.lastName'),
            sort: true
        },
        {
            dataField: "firstName",
            text: t('staff.firstName'),
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
            dataField: "title",
            text: t('teacher.teacher_title'),
            sort: true
        },
        {
            dataField: "username",
            text: t('teacher.login_name'),
            sort: true
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
            title: t('teacher.change_status_staff')
        },
        {
            key: 'loginNameChange',
            icon: <SettingsApplicationsTwoToneIcon sx={{ fontSize: '2rem !important', color: '#ff5b1d' }} />,
            title: t('teacher.change_login_name_staff'),
        },
        {
            key: 'passwordReset',
            icon: <LockResetTwoToneIcon sx={{ fontSize: '2rem !important', color: '#ff5b1d' }} />,
            title: t('teacher.change_password_staff'),
        },
        {
            key: 'roleChange',
            icon: <ManageAccountsTwoToneIcon sx={{ fontSize: '2rem !important', color: '#ff5b1d' }} />,
            title: t('manage_roles'),
        },
        {
            key: 'setTeacher',
            icon: <SchoolIcon sx={{ fontSize: '2rem !important', color: '#ff5b1d' }} />,
            title: t('add_teacher_role'),
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
            title: t('teacher.change_status_staff')
        },
    ]

    const config = {
        excelExport: true,
        printButton: true,
        columnButton: true,
        excelFileName: `${secureLocalStorage.getItem('selectedSchool')?.text}-${t('staff.title')}`,
        defaultSort: [{
            dataField: tableState?.sort || 'firstName',
            order: tableState?.order || 'asc'
        }],
        defaultPageOptions: {
            page: tableState?.page || 1,
            sizePerPage: tableState?.pageSize || 10,
            search: tableState?.search || '',
        },
    }

    const init = (tabObj, tableState) => {
        console.log('init')
        // setLoading(true)
        // fetchRequest(schoolStaffIndex, 'POST', { 
        //     status: tabObj?.code || 'ACTIVE',
        //     page: tableState?.page || 1,
        //     pageSize: tableState?.pageSize || 10,
        //     search: tableState?.search || '',
        //     sort: tableState?.sort || 'firstName',
        //     order: tableState?.order || 'asc',
        // })
        //     .then((res) => {
        //         if (res.success) {
        //             const { employees, statuses, totalCount } = res.data
        //             setTableData(employees || [])
        //             setTotalCount(totalCount);
        //             setTabData(statuses?.map((el, index) => ({ 
        //                 index: index,
        //                 menuItem: el.name, 
        //                 code: el.code, 
        //                 id: el.id 
        //             })) || [])
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

    useEffect(() => {
        init(selectedTabData, tableState)
    }, [])

    useEffect(() => {
        if (tabData.length && !selectedTabData?.id) setSelectedTabData(tabData?.[0])
    }, [tabData])

    useEffect(() => {
        console.log(selectedTabData)
        if (selectedTabData == 'active') {
            tableData?.forEach(el => { el.contextMenuKeys = el.isMobile ? 'view, edit, delete, statusChange, loginNameChange, passwordReset, roleChange, setTeacher' : 'view, edit, delete, statusChange, passwordReset, loginNameChange, roleChange, setTeacher' })
            setColumns(activeColumns)
            setContextMenus(activeContextMenus)
        } else {
            tableData?.forEach(el => { el.contextMenuKeys = 'view, edit, delete, statusChange' })
            setColumns(otherColumns)
            setContextMenus(otherContextMenus)
        }
    }, [selectedTabData, tableData])

    const handleDelete = () => {
        console.log('delete')
        // setLoading(true)
        // fetchRequest(schoolStaffDelete, 'POST', { 
        //     employee: selectedTableDataId, 
        //     status: selectedTabData?.id,
        //     page: tableState?.page || 1,
        //     pageSize: tableState?.pageSize || 10,
        //     search: tableState?.search || '',
        //     sort: tableState?.sort || 'firstName',
        //     order: tableState?.order || 'asc',
        // })
        //     .then((res) => {
        //         if (res.success) {
        //             const { employees, totalCount } = res.data
        //             setTableData(employees || [])
        //             setTotalCount(totalCount)
        //             message(res.data.message, res.data.success)
        //             closeModal()
        //         } else {
        //             message(res.data.message)
        //         }
        //         setLoading(false)
        //     })
        //     .catch(() => {
        //         message(translations(locale)?.err?.error_occurred)
        //         setLoading(false)
        //     })
    }

    const handlePasswordReset = (password, passwordRepeat) => {
        console.log('handlePassReset')
        // setLoading(true)
        // fetchRequest(schoolStaffPasswordReset, 'POST', { 
        //     employee: selectedTableDataId, 
        //     password, passwordRepeat 
        // })
        //     .then((res) => {
        //         if (res.success) {
        //             message(res.data.message, res.data.success)
        //             closeModal()
        //         } else {
        //             message(res.data.message)
        //         }
        //         setLoading(false)
        //     })
        //     .catch(() => {
        //         message(translations(locale)?.err?.error_occurred)
        //         setLoading(false)
        //     })
    }

    const handleStatusChange = status => {
        console.log('statusChangeHandler')
        // setLoading(true)
        // fetchRequest(schoolStaffStatusChange, 'POST', { 
        //     employee: selectedTableDataId, 
        //     status, 
        //     submit: 1, 
        //     menu: 'staff', 
        //     tab: selectedTabData?.id,
        //     page: tableState?.page || 1,
        //     pageSize: tableState?.pageSize || 10,
        //     search: tableState?.search || '',
        //     sort: tableState?.sort || 'firstName',
        //     order: tableState?.order || 'asc',
        // })
        //     .then((res) => {
        //         if (res.success) {
        //             message(res.data.message, res.success)
        //             const { employees, totalCount } = res?.data
        //             setTableData(employees)
        //             setTotalCount(totalCount)
        //             closeModal()
        //         } else {
        //             message(res.data.message)
        //         }
        //         setLoading(false)
        //     })
        //     .catch(() => {
        //         message(translations(locale)?.err?.error_occurred)
        //         setLoading(false)
        //     })
    }

    const handleRoleChange = roles => {
        console.log('handleRoleChange')
        // setLoading(true)
        // fetchRequest(schoolStaffRoleChange, 'POST', { 
        //     employee: selectedTableDataId, 
        //     roles: JSON.stringify(roles), submit: 1 
        // })
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
        //         message(translations(locale)?.err?.error_occurred)
        //         setLoading(false)
        //     })
    }

    const handleLoginNameChange = loginNames => {
        console.log('handleLoginNameChange')
        // setLoading(true)
        // fetchRequest(schoolStaffLoginNameChange, 'POST', { 
        //     ...loginNames, 
        //     employee: selectedTableDataId,
        //     tab: selectedTabData?.id,
        //     page: tableState?.page || 1,
        //     pageSize: tableState?.pageSize || 10,
        //     search: tableState?.search || '',
        //     sort: tableState?.sort || 'firstName',
        //     order: tableState?.order || 'asc',
        // })
        //     .then((res) => {
        //         if (res.success) {
        //             message(res.data.message, res.success)
        //             const { employees, totalCount } = res?.data
        //             setTableData(employees)
        //             setTotalCount(totalCount)
        //             closeModal()
        //         } else {
        //             message(res.data.message)
        //         }
        //         setLoading(false)
        //     })
        //     .catch(() => {
        //         message(translations(locale)?.err?.error_occurred)
        //         setLoading(false)
        //     })
    }

    const handleContextMenuClick = (id, key) => {
        console.log(id, key)
        if (id && key) {
            setSelectedTableDataId(id)
            if (key === 'view') {
                setShowViewModal(true)
            } else if (key === 'edit') {
                setShowEditWorkerModal(true)
                // navigate('/school/staffs/edit', { state: { id } })
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
            } else if (key === 'setTeacher') {
                setShowSetTeacherModal(true)
            }
        }
    }

    const handleTabChange = (e, data) => {
        const newTableState = {
            page: 1,
            search: '',
            pageSize: tableState.pageSize,
            sort: tableState.sort,
            order: tableState.order
        }
        // console.log(data)
        setSelectedTabData(data)
        setTableState(newTableState)
        // setTableData([]);
        secureLocalStorage.setItem(localeSelectedTab, data?.panes?.[data?.activeIndex])
        secureLocalStorage?.setItem(tableIndex, newTableState);
        
        init(data?.panes?.[data?.activeIndex], newTableState)
    }

    const closeModal = () => {
        setShowViewModal(false)
        setShowDeleteModal(false)
        setStatusChangeModal(false)
        setSelectedTableDataId(null)
        setShowSetTeacherModal(false)
        setShowRoleChangeModal(false)
        setShowAddWorkerModal(false)
        setShowEditWorkerModal(false)
        setShowPasswordResetModal(false)
        setShowLoginNameChangeModal(false)
    }

    const onUserInteraction = (object) => {
        console.log('onUserInteraction')
        // if(object.page){
        //     if(!firstRender){
        //         setFirstRender(true);
        //     } else {
        //         if(object.search){
        //             let cloneData = {
        //                 page: 1,
        //                 pageSize: object.pageSize,
        //                 search: object.search,
        //                 sort: object.sort,
        //                 order: object.order,
        //             }
    
        //             secureLocalStorage?.setItem(tableIndex, cloneData);
        //             setTableState(cloneData);
        //             init(selectedTabData, cloneData)
        //         } else {
        //             secureLocalStorage?.setItem(tableIndex, object);
        //             setTableState(object);
        //             init(selectedTabData, object)
        //         }
        //     }
        // }
    };

    return (
        <div className="m-grid__item m-grid__item--fluid m-wrapper">
            <HtmlHead title={title} description={description} />

            <div className="page-title-container">
                <Col md="7">
                    <h1 className="mb-0 pb-0 display-4 relative">{title}</h1>
                    <BreadcrumbList items={breadcrumbs} />
                </Col>
            </div>
            <div className="m-content">
                <div className="row">
                    <div className="col">
                        <Button
                            onClick={()=>setShowAddWorkerModal(true)}
                            className='btn btn-sm m-btn--pill btn-info m-btn--uppercase d-inline-flex mb-3'
                        >
                            <ControlPointIcon style={{ color: "white", marginRight: "4px" }} />
                            {t('action.register')}
                        </Button>
                        <div className='m-portlet tab'>
                            <div className=''>
                                <TabComponent
                                    onChange={(e, data) => handleTabChange(e, data)}
                                    className='m-portlet-header'
                                    style={{color: 'red'}}
                                    tabs={[
                                        {
                                            code: "active",
                                            title: "Ажиллаж байгаа",
                                            children: (
                                                <div className='m-portlet__body'>
                                                    <DTable
                                                        remote
                                                        config={config}
                                                        locale={locale}
                                                        data={tableData}
                                                        columns={columns}
                                                        individualContextMenus
                                                        contextMenus={contextMenus}
                                                        onContextMenuItemClick={handleContextMenuClick}
                                                        onInteraction={onUserInteraction}
                                                        totalDataSize={totalCount}
                                                    />
                                                </div>
                                            )

                                        },
                                        {
                                            code: "absent",
                                            title: "Чөлөөтэй байгаа",
                                            children: (
                                                <div className='m-portlet__body'>
                                                    <DTable
                                                        remote
                                                        config={config}
                                                        locale={locale}
                                                        data={tableData}
                                                        columns={columns}
                                                        individualContextMenus
                                                        contextMenus={contextMenus}
                                                        onContextMenuItemClick={handleContextMenuClick}
                                                        onInteraction={onUserInteraction}
                                                        totalDataSize={totalCount}
                                                    />
                                                </div>
                                            )
                                        },
                                        {
                                            code: "leave",
                                            title: "Ажлаас гарсан",
                                            children: (
                                                <div className='m-portlet__body'>
                                                    <DTable
                                                        remote
                                                        config={config}
                                                        locale={locale}
                                                        data={tableData}
                                                        columns={columns}
                                                        individualContextMenus
                                                        contextMenus={contextMenus}
                                                        onContextMenuItemClick={handleContextMenuClick}
                                                        onInteraction={onUserInteraction}
                                                        totalDataSize={totalCount}
                                                    />
                                                </div>
                                            )
                                        },
                                    ]}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {
                loading &&
                <>
                    <div className="blockUI blockOverlay" />
                    <div className="blockUI blockMsg blockPage">
                        <div className="m-loader m-loader--brand m-loader--lg" />
                    </div>
                </>
            }
            {
                showDeleteModal && selectedTableDataId &&
                <DeleteModal
                    onClose={closeModal}
                    onDelete={handleDelete}
                    locale={locale}
                    title={t('delete')}
                >
                    {t('delete_confirmation')}
                    <br />
                    <br />
                    {t('delete_confirmation_description')}
                </DeleteModal>
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
                />
            }
            {
                showStatusChangeModal && selectedTableDataId &&
                <StatusChangeModal
                    onClose={closeModal}
                    onSubmit={handleStatusChange}
                    teacher={selectedTableDataId}
                    tableState={tableState}
                />
            }
            {
                showLoginNameChangeModal && selectedTableDataId &&
                <LoginNameChangeModal
                    onClose={closeModal}
                    onSubmit={handleLoginNameChange}
                />
            }
            {
                showRoleChangeModal && selectedTableDataId &&
                <RoleChangeModal
                    onClose={closeModal}
                    onSubmit={handleRoleChange}
                    teacher={selectedTableDataId}
                    tableState={tableState}
                />
            }
            {
                showSetTeacherModal && selectedTableDataId &&
                <SetTeacherModal
                    onClose={closeModal}
                    onSubmit={handleRoleChange}
                    user={selectedTableDataId}
                />
            }
            {
                showAddWorkerModal &&
                <AddWorkerModal
                    onClose={closeModal}

                />
            }
            {
                showEditWorkerModal && selectedTableDataId &&
                <EditWorkerModal
                    onClose={closeModal}
                />
            }
        </div>
    )
}

export default index