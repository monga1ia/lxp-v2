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
import {Tab} from "semantic-ui-react";
import { useTranslation } from "react-i18next";


const tableIndex = ['groups_index_table_index'];
const gradeIndex = ['groups_index_grade_index'];

const MainGroup = () => {

    const locale="mn"
    const { t } = useTranslation();
    const history = useHistory();
    const [loading, setLoading] = useState(false);

    const { selectedSchool } = useSelector(state => state.schoolData);

    const title = t('teacher.title');
    const description = "E-learning";
    const breadcrumbs = [
        { to: "", text: "Home" },
        { to: "school/teacher", text: title }
    ];

    const [totalCount, setTotalCount] = useState(0);
    const [tableData, setTableData] = useState([
        {id: 11, code: 2323, firstName: "asdfsdf"}, 
        {id: 12, code: 1232, firstName: "asasdfsdf"}
    ]);
    const [treeData, setTreeData] = useState([{
        title: 'first level',
        value: '0-0',
        key: 1,
        selectable: true,
        children: [{
                title: 'second level',
                value: '0-0',
                key: 2,
                selectable: true,
                children: [
                    {
                        title: 'third level',
                        value: '0-0-0-0',
                        key: 3,
                        selectable: true,
                    },{
                        title: 'third level',
                        value: '0-0-0-0',
                        key: 4,
                        selectable: true,
                    },
                ]
            },]
        }])
    const [selectedTableDataId, setSelectedTableDataId] = useState(null)
    const [selectedTreeDataId, setSelectedTreeDataId] = useState([32])
    const [selectedTabData, setSelectedTabData] = useState(0)

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
            dataField: 'firstName',
            order: 'asc'
        }],
        defaultPageOptions: {
            page: 1,
            sizePerPage: 10,
        }
    }

    const [tableState, setTableState] = useState(
        selectedTabData?.code == 'ACTIVE'
            ?
            secureLocalStorage.getItem(localeActiveTableState)
                ?
                secureLocalStorage.getItem(localeActiveTableState)
                :
                {
                    filter: {},
                    page: 1,
                    pageSize: 10,
                    search: '',
                    sort: 'firstName',
                    order: 'asc'
                }
            :
            selectedTabData?.code == 'QUIT'
                ?
                secureLocalStorage.getItem(localeQuitTableState)
                :
                selectedTabData?.code == 'ABSENT'
                    ?
                    secureLocalStorage.getItem(localeAbsentTableState)
                    :
                    {
                        filter: {},
                        page: 1,
                        pageSize: 10,
                        search: '',
                        sort: 'firstName',
                        order: 'asc'
                    }
    )
    
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
            icon: <PreviewTwoToneIcon sx={{fontSize: '2rem !important', color: '#ff5b1d'}}/>,
            title: t('view'),
        },
        {
            key: 'edit',
            icon: <BorderColorTwoToneIcon sx={{fontSize: '2rem !important', color: '#ff5b1d'}}/>,
            title: t('edit')
        },
        {
            key: 'delete',
            icon: <DeleteTwoToneIcon sx={{fontSize: '2rem !important', color: '#ff5b1d'}}/>,
            title: t('delete')
        },
        {
            key: 'statusChange',
            icon: <CameraFrontTwoToneIcon sx={{fontSize: '2rem !important', color: '#ff5b1d'}}/>,
            title: t('teacher.change_status')
        },
        {
            key: 'loginNameChange',
            icon: <SettingsApplicationsTwoToneIcon sx={{fontSize: '2rem !important', color: '#ff5b1d'}}/>,
            title: t('teacher.change_login_name'),
        },
        {
            key: 'passwordReset',
            icon: <LockResetTwoToneIcon sx={{fontSize: '2rem !important', color: '#ff5b1d'}}/>,
            title: t('teacher.change_password'),
        },
        {
            key: 'roleChange',
            icon: <ManageAccountsTwoToneIcon sx={{fontSize: '2rem !important', color: '#ff5b1d'}}/>,
            title: t('manage_roles'),
        },
        {
            key: 'infoChange',
            icon: <ImportContactsTwoToneIcon sx={{fontSize: '2rem !important', color: '#ff5b1d'}}/>,
            title: t('insert_information'),
        },
    ]

    const otherContextMenus = [
        {
            key: 'view',
            icon: <PreviewTwoToneIcon sx={{fontSize: '2rem !important', color: '#ff5b1d'}}/>,
            title: t('view'),
        },
        {
            key: 'edit',
            icon: <BorderColorTwoToneIcon sx={{fontSize: '2rem !important', color: '#ff5b1d'}}/>,
            title: t('edit')
        },
        {
            key: 'delete',
            icon: <DeleteTwoToneIcon sx={{fontSize: '2rem !important', color: '#ff5b1d'}}/>,
            title: t('delete')
        },
        {
            key: 'statusChange',
            icon: <CameraFrontTwoToneIcon sx={{fontSize: '2rem !important', color: '#ff5b1d'}}/>,
            title: t('teacher.change_status')
        },
    ]

    const [columns, setColumns] = useState(activeColumns)
    const [contextMenus, setContextMenus] = useState(activeContextMenus)

    const closeModal = () => {
        setShowAddTeacherModal(false)
        setShowEditTeacherModal(false)
        setShowDeleteModal(false)
        setShowViewModal(false)
        setShowDeleteModal(false)
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
            // secureLocalStorage.setItem(localStorageSelectedTree, key[0])

            // let cloneData = {
            //     page: 1,
            //     pageSize: tableState.pageSize,
            //     search: tableState.search,
            //     order: tableState?.order,
            //     sort: tableState?.sort,
            //     filter: {
            //         page: 1,
            //         pageSize: tableState?.filter?.pageSize || 10
            //     }
            // };

            // if (selectedTabData && selectedTabData.code == 'ACTIVE') {
            //     secureLocalStorage.setItem(localeActiveTableState, cloneData)
            // } else if (selectedTabData && selectedTabData.code == 'QUIT') {
            //     secureLocalStorage.setItem(localeQuitTableState, cloneData)
            // } else if (selectedTabData && selectedTabData.code == 'ABSENT') {
            //     secureLocalStorage.setItem(localeAbsentTableState, cloneData)
            // }

            // setTableState(cloneData)

            // init(cloneData, key[0], selectedTabData.code)
        }
    }
    
    const handleTabChange = (e, data) => {
        console.log( e, data.activeIndex)
        setSelectedTabData(data.activeIndex)
        // setSelectedTabData({...data?.panes?.[data?.activeIndex]})
        // secureLocalStorage.setItem(localeSelectedTab, data?.panes?.[data?.activeIndex])

        // let selectedTableState = null;
        // if (data?.panes?.[data?.activeIndex] && data?.panes?.[data?.activeIndex]?.code == 'ACTIVE') {
        //     setTableState(secureLocalStorage.getItem(localeActiveTableState))
        //     selectedTableState = secureLocalStorage.getItem(localeActiveTableState)
        // } else if (data?.panes?.[data?.activeIndex]?.code == 'QUIT') {
        //     setTableState(secureLocalStorage.getItem(localeQuitTableState))
        //     selectedTableState = secureLocalStorage.getItem(localeQuitTableState)
        // } else if (data?.panes?.[data?.activeIndex]?.code == 'ABSENT') {
        //     setTableState(secureLocalStorage.getItem(localeAbsentTableState))
        //     selectedTableState = secureLocalStorage.getItem(localeAbsentTableState)
        // }

        // init(selectedTableState, selectedTreeDataId, data?.panes?.[data?.activeIndex]?.code)
    }

    const handleAddTeacher = () => {
        setShowAddTeacherModal(true)
    }

    const handleEditTeacher = () => {
        console.log('edited')
    }

    const onUserInteraction = state => {
        console.log('onUserInteraction')
        // if (state.page && !secondRender) {
        //     if (state.search != tableState.search) {
        //         let cloneData = {
        //             page: 1,
        //             pageSize: state.pageSize,
        //             search: state.search,
        //             sort: state.sort,
        //             order: state.order,
        //             filter: {
        //                 page: 1,
        //                 pageSize: state?.filter?.pageSize || 10
        //             }
        //         };

        //         setTableState(cloneData)

        //         if (selectedTabData && selectedTabData.code == 'ACTIVE') {
        //             secureLocalStorage.setItem(localeActiveTableState, cloneData)
        //         } else if (selectedTabData && selectedTabData.code == 'QUIT') {
        //             secureLocalStorage.setItem(localeQuitTableState, cloneData)
        //         } else if (selectedTabData && selectedTabData.code == 'ABSENT') {
        //             secureLocalStorage.setItem(localeAbsentTableState, cloneData)
        //         }

        //         init(cloneData, selectedTreeDataId, selectedTabData.code)
        //     } else {
        //         setTableState(state)

        //         if (selectedTabData && selectedTabData.code == 'ACTIVE') {
        //             secureLocalStorage.setItem(localeActiveTableState, state)
        //         } else if (selectedTabData && selectedTabData.code == 'QUIT') {
        //             secureLocalStorage.setItem(localeQuitTableState, state)
        //         } else if (selectedTabData && selectedTabData.code == 'ABSENT') {
        //             secureLocalStorage.setItem(localeAbsentTableState, state)
        //         }

        //         init(state, selectedTreeDataId, selectedTabData.code)
        //     }
        // } else {
        //     setSecondRender(false)
        // }
    }

    const handleContextMenuClick = (id, key) => {
        console.log(id, key)
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
        if (selectedTabData == 0) {
            tableData?.forEach(el => {
                el.contextMenuKeys = 'view, edit, delete, statusChange, loginNameChange, passwordReset, roleChange, infoChange'
            })
            setColumns(activeColumns)
            setContextMenus(activeContextMenus)
        } else {
            if (selectedTabData === 3) {
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
    }, [selectedTabData, tableData])

    // useEffect(() => {
    //     if (treeData.length && !selectedTreeDataId.length) {
    //         setSelectedTreeDataId(treeData?.[0]?.key)
    //     }
    // }, [treeData])

    // useEffect(() => {
    //     if (tabData.length && !selectedTabData?.id) {
    //         setSelectedTabData(tabData?.[0])

    //         tabData.forEach(element => {
    //             if (element.code == 'ACTIVE') {
    //                 if (!secureLocalStorage.getItem(localeActiveTableState)) {
    //                     secureLocalStorage.setItem(localeActiveTableState, {
    //                             filter: {},
    //                             page: 1,
    //                             pageSize: 10,
    //                             search: '',
    //                             sort: 'firstName',
    //                             order: 'asc'
    //                         }
    //                     )
    //                 }
    //             } else if (element.code == 'QUIT') {
    //                 if (!secureLocalStorage.getItem(localeQuitTableState)) {
    //                     secureLocalStorage.setItem(localeQuitTableState, {
    //                             filter: {},
    //                             page: 1,
    //                             pageSize: 10,
    //                             search: '',
    //                             sort: 'firstName',
    //                             order: 'asc'
    //                         }
    //                     )
    //                 }
    //             } else if (element.code == 'ABSENT') {
    //                 if (!secureLocalStorage.getItem(localeAbsentTableState)) {
    //                     secureLocalStorage.setItem(localeAbsentTableState, {
    //                             filter: {},
    //                             page: 1,
    //                             pageSize: 10,
    //                             search: '',
    //                             sort: 'firstName',
    //                             order: 'asc'
    //                         }
    //                     )
    //                 }
    //             }
    //         });
    //     }
    // }, [tabData])

    // const init = (pagination, gradeId, statusCode) => {
    //     setLoading(true)
    //     fetchRequest(schoolTeacherInit, 'POST', {
    //         status: statusCode,
    //         grade: gradeId,
    //         filter: pagination?.filter,
    //         order: pagination?.order,
    //         sort: pagination?.sort,
    //         page: pagination?.page,
    //         pageSize: pagination?.pageSize,
    //         search: pagination?.search,
    //     })
    //         .then((res) => {
    //             if (res.success) {
    //                 const {teachers, statuses, grades, totalCount} = res.data
    //                 setTreeData(grades || [])
    //                 setTableData(teachers || [])
    //                 setTabData(statuses?.map((el, index) => ({
    //                     index: index,
    //                     menuItem: el.name,
    //                     code: el.code,
    //                     id: el.id
    //                 })) || [])
    //                 setTotalCount(totalCount || 0)
    //                 if (!firstRender) setLoading(false)
    //             } else {
    //                 message(res.data.message)
    //             }
    //             setLoading(false)
    //         })
    //         .catch(() => {
    //             message(translations(locale)?.err?.error_occurred)
    //             setLoading(false)
    //         })
    // }

    const handleDelete = () => {
        console.log('delete')
        // setLoading(true)
        // fetchRequest(schoolTeacherDelete, 'POST', {
        //     teacher: selectedTableDataId,
        //     grade: selectedTreeDataId,
        //     status: selectedTabData?.code,
        //     filter: tableState?.filter,
        //     order: tableState?.order,
        //     sort: tableState?.sort,
        //     page: tableState?.page,
        //     pageSize: tableState?.pageSize,
        //     search: tableState?.search,
        // })
        //     .then((res) => {
        //         if (res.success) {
        //             message(res.data.message, res.data.success)
        //             const {teachers, totalCount} = res.data
        //             setTableData(teachers || [])
        //             setTotalCount(totalCount || 0)
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

    const handleStatusChange = () => {
        console.log('statusChange')
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
        //         message(translations(locale)?.err?.error_occurred)
        //         setLoading(false)
        //     })
    }

    const handleLoginNameChange = loginNames => {
        console.log('loginNameChange')
        // setLoading(true)
        // fetchRequest(schoolTeacherLoginNameChange, 'POST', {
        //     ...loginNames,
        //     teacher: selectedTableDataId,
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
        //         message(translations(locale)?.err?.error_occurred)
        //         setLoading(false)
        //     })
    }
    
    const handleRoleChange = roles => {
        console.log('roleChange')
        // setLoading(true)
        // fetchRequest(schoolTeacherRoleChange, 'POST', {
        //     teacher: selectedTableDataId,
        //     roles: JSON.stringify(roles),
        //     submit: 1
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

    const handleInfoChange = param => {
        console.log('infoChange')
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
        //         message(translations(locale)?.err?.error_occurred)
        //         setLoading(false)
        //     })
    }

    const handlePasswordReset = (password, passwordRepeat) => {
        console.log('passwordReset')
        // setLoading(true)
        // fetchRequest(schoolTeacherPasswordReset, 'POST', {teacher: selectedTableDataId, password, passwordRepeat})
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
                        <div className='m-portlet br-12'>
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
                        <Button
                            onClick={() => setShowAddTeacherModal(true)}
                            className='btn btn-sm m-btn--pill btn-info m-btn--uppercase d-inline-flex mb-3'
                        >
                            <ControlPointIcon style={{ color: "white", marginRight: "4px" }} />
                            {t('action.register')}
                        </Button>
                        <div className='m-portlet tab br-12'>
                            <div className=''>
                                <Tab
                                    menu={{secondary: true, pointing: true, className: 'primaryColor m-0 h-4'}}
                                    onTabChange={(e, data) => handleTabChange(e, data)}
                                    className='m-portlet-header'
                                    panes={[
                                        {
                                            menuItem: t('teacher.working'),
                                            render: () => (
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
                                            menuItem: t('teacher.absent'),
                                            render: () => (
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
                                            menuItem: t('teacher.not_working'),
                                            render: () => (
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
                                            menuItem: t('teacher.deleted'),
                                            render:() => (
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
                                        }
                                    ]}
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
                />
            }
            {
                showStatusChangeModal && selectedTableDataId && 
                <StatusChangeModal
                    onClose={closeModal}
                    onSubmit={handleStatusChange}
                    teacher={selectedTableDataId}
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
                />
            }
            {
                showInfoChangeModal && selectedTableDataId &&
                <InfoChangeModal
                    onClose={closeModal}
                    onSubmit={handleInfoChange}
                    teacher={selectedTableDataId}
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
                    onSubmit={handleAddTeacher}
                />
            }
            {
                showEditTeacherModal &&
                <EditTeacherModal
                    onClose={closeModal}
                    onSubmit={handleEditTeacher}
                />
            }
        </>
    );
};

export default MainGroup;
