import { useState } from 'react'
import message from 'modules/message'
import ViewModal from './modals/view'
import React, { useEffect } from 'react'
import { Tab } from 'semantic-ui-react'
import HtmlHead from 'components/html-head/HtmlHead';
import DTable from 'modules/DataTable/DTable'
// import DeleteModal from 'Utilities/deleteModal'
// import RoleChangeModal from './modal/roleChange'
// import StatusChangeModal from './modal/statusChange'
// import SetTeacherModal from './modal/setTeacher'
// import { Link, useNavigate } from 'react-router-dom'
import secureLocalStorage from 'react-secure-storage'
import { Row, Col, Card, Button } from 'react-bootstrap';
import { translations } from 'utils/translations'
// import PasswordResetModal from './modal/passwordReset'
// import LoginNameChangeModal from './modal/loginNameChange'
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone'
import PreviewTwoToneIcon from '@mui/icons-material/PreviewTwoTone'
import LockResetTwoToneIcon from '@mui/icons-material/LockResetTwoTone'
import BorderColorTwoToneIcon from '@mui/icons-material/BorderColorTwoTone'
import CameraFrontTwoToneIcon from '@mui/icons-material/CameraFrontTwoTone'
import ManageAccountsTwoToneIcon from '@mui/icons-material/ManageAccountsTwoTone'
import BreadcrumbList from 'components/breadcrumb-list/BreadcrumbList';
import SchoolIcon from '@mui/icons-material/School'
import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded'
import SettingsApplicationsTwoToneIcon from '@mui/icons-material/SettingsApplicationsTwoTone'
// import { schoolStaffDelete, schoolStaffIndex, schoolStaffLoginNameChange, schoolStaffPasswordReset, schoolStaffRoleChange, schoolStaffStatusChange } from 'Utilities/url'
import EditTeacherModal from '../teacher/modals/editTeacher'

const locale = secureLocalStorage?.getItem('selectedLang') || 'mn'
const tableIndex = 'school_employee_table_index';
const localeSelectedTab = 'school_employee_tab_data';

const index = () => {

    const title = translations('staff.title')
    const description = "E-learning";

    const [loading, setLoading] = useState(false)

    const [tabData, setTabData] = useState([])
    const [selectedTabData, setSelectedTabData] = useState(secureLocalStorage?.getItem(localeSelectedTab) || {})

    const [columns, setColumns] = useState([])
    const [tableData, setTableData] = useState([])
    const [totalCount, setTotalCount] = useState(0);
    const [contextMenus, setContextMenus] = useState([])
    const [selectedTableDataId, setSelectedTableDataId] = useState(null)
    const [firstRender, setFirstRender] = useState(false);

    const [showViewModal, setShowViewModal] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [showRoleChangeModal, setShowRoleChangeModal] = useState(false)
    const [showEditTeacherModal, setShowEditTeacherModal] = useState(false)
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

    const breadcrumbs = [
        { to: "", text: "Home" },
        { to: "groups/index", text: title }
    ];
    
    const activeColumns = [
        {
            dataField: "avatar",
            text: translations(locale)?.teacher?.photo,
            sort: true,
            width: 40,
            align: 'center',
            formatter: (cell) =>
                <img
                    className='img-responsive img-circle'
                    src={cell || '/images/avatar.png'}
                    width={40} height={40} alt='profile picture'
                    onError={(e) => {
                        e.target.onError = null
                        e.target.src = '/images/avatar.png'
                    }}
                />
        },
        {
            dataField: "code",
            text: translations(locale)?.staff?.code,
            sort: true
        },
        {
            dataField: "lastName",
            text: translations(locale)?.staff?.lastName,
            sort: true
        },
        {
            dataField: "firstName",
            text: translations(locale)?.staff?.firstName,
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
            text: translations(locale)?.teacher?.teacher_title,
            sort: true
        },
        {
            dataField: "username",
            text: translations(locale)?.teacher?.login_name,
            sort: true
        },
        {
            dataField: "contact",
            text: translations(locale)?.phoneNumber,
            sort: true,
        },
        {
            dataField: 'registrationNumber',
            text: translations(locale)?.register_number,
            sort: true
        },
    ]

    const otherColumns = [
        {
            dataField: "avatar",
            text: translations(locale)?.teacher?.photo,
            sort: true,
            width: 40,
            align: 'center',
            formatter: (cell) =>
                <img
                    className='img-responsive img-circle'
                    src={cell || '/images/avatar.png'}
                    width={40} height={40} alt='profile picture'
                    onError={(e) => {
                        e.target.onError = null
                        e.target.src = '/images/avatar.png'
                    }}
                />
        },
        {
            dataField: "code",
            text: translations(locale)?.staff?.code,
            sort: true
        },
        {
            dataField: "lastName",
            text: translations(locale)?.staff?.lastName,
            sort: true
        },
        {
            dataField: "firstName",
            text: translations(locale)?.staff?.firstName,
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
            text: translations(locale)?.teacher?.teacher_title,
            sort: true
        },
        {
            dataField: "username",
            text: translations(locale)?.teacher?.login_name,
            sort: true
        },
    ]

    const activeContextMenus = [
        {
            key: 'view',
            icon: <PreviewTwoToneIcon sx={{ fontSize: '2rem !important', color: '#ff5b1d' }} />,
            title: translations(locale)?.view,
        },
        {
            key: 'edit',
            icon: <BorderColorTwoToneIcon sx={{ fontSize: '1.8rem !important', color: '#ff5b1d' }} />,
            title: translations(locale)?.edit
        },
        {
            key: 'delete',
            icon: <DeleteTwoToneIcon sx={{ fontSize: '2rem !important', color: '#ff5b1d' }} />,
            title: translations(locale)?.delete
        },
        {
            key: 'statusChange',
            icon: <CameraFrontTwoToneIcon sx={{ fontSize: '2rem !important', color: '#ff5b1d' }} />,
            title: translations(locale)?.teacher?.change_status_staff
        },
        {
            key: 'loginNameChange',
            icon: <SettingsApplicationsTwoToneIcon sx={{ fontSize: '2rem !important', color: '#ff5b1d' }} />,
            title: translations(locale)?.teacher?.change_login_name_staff,
        },
        {
            key: 'passwordReset',
            icon: <LockResetTwoToneIcon sx={{ fontSize: '2rem !important', color: '#ff5b1d' }} />,
            title: translations(locale)?.teacher?.change_password_staff,
        },
        {
            key: 'roleChange',
            icon: <ManageAccountsTwoToneIcon sx={{ fontSize: '2rem !important', color: '#ff5b1d' }} />,
            title: translations(locale)?.manage_roles,
        },
        {
            key: 'setTeacher',
            icon: <SchoolIcon sx={{ fontSize: '2rem !important', color: '#ff5b1d' }} />,
            title: translations(locale)?.add_teacher_role,
        },
    ]

    const otherContextMenus = [
        {
            key: 'view',
            icon: <PreviewTwoToneIcon sx={{ fontSize: '2rem !important', color: '#ff5b1d' }} />,
            title: translations(locale)?.view,
        },
        {
            key: 'edit',
            icon: <BorderColorTwoToneIcon sx={{ fontSize: '1.8rem !important', color: '#ff5b1d' }} />,
            title: translations(locale)?.edit
        },
        {
            key: 'delete',
            icon: <DeleteTwoToneIcon sx={{ fontSize: '2rem !important', color: '#ff5b1d' }} />,
            title: translations(locale)?.delete
        },
        {
            key: 'statusChange',
            icon: <CameraFrontTwoToneIcon sx={{ fontSize: '2rem !important', color: '#ff5b1d' }} />,
            title: translations(locale)?.teacher?.change_status_staff
        },
    ]

    const config = {
        excelExport: true,
        printButton: true,
        columnButton: true,
        excelFileName: `${secureLocalStorage.getItem('selectedSchool')?.text}-${translations(locale)?.staff?.title}`,
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
        //         message(translations(locale)?.err?.error_occurred)
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
        if (selectedTabData?.code?.toLowerCase() == 'active') {
            tableData?.forEach(el => { el.contextMenuKeys = el.isMobile ? 'view, edit, delete, statusChange, loginNameChange, passwordReset, roleChange, setTeacher' : 'view, edit, delete, statusChange, loginNameChange, roleChange, setTeacher' })
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
    }

    const handlePasswordReset = (password, passwordRepeat) => {
        console.log('handlePassReset')
    }

    const handleStatusChange = status => {
        console.log('statusChangeHandler')
    }

    const handleRoleChange = roles => {
        console.log('handleRoleChange')
    }

    const handleLoginNameChange = loginNames => {
        console.log('handleLoginNameChange')
    }

    const handleContextMenuClick = (id, key) => {
        if (id && key) {
            setSelectedTableDataId(id)
            if (key === 'view') {
                setShowViewModal(true)
            } else if (key === 'edit') {
                setShowEditTeacherModal(true)
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

    const handleTabChange = data => {
        const newTableState = {
            page: 1,
            search: '',
            pageSize: tableState.pageSize,
            sort: tableState.sort,
            order: tableState.order
        }

        setSelectedTabData({ ...data?.panes?.[data?.activeIndex] })
        setTableState(newTableState)
        setTableData([]);
        secureLocalStorage.setItem(localeSelectedTab, data?.panes?.[data?.activeIndex])
        secureLocalStorage?.setItem(tableIndex, newTableState);
        
        init(data?.panes?.[data?.activeIndex], newTableState)
    }

    const closeModal = () => {
        setShowViewModal(false)
        setShowDeleteModal(false)
        setStatusChangeModal(false)
        setSelectedTableDataId(null)
        setShowRoleChangeModal(false)
        setShowEditTeacherModal(false)
        setShowPasswordResetModal(false)
        setShowLoginNameChangeModal(false)
    }

    const onUserInteraction = (object) => {
        if(object.page){
            if(!firstRender){
                setFirstRender(true);
            } else {
                if(object.search){
                    let cloneData = {
                        page: 1,
                        pageSize: object.pageSize,
                        search: object.search,
                        sort: object.sort,
                        order: object.order,
                    }
    
                    secureLocalStorage?.setItem(tableIndex, cloneData);
                    setTableState(cloneData);
                    init(selectedTabData, cloneData)
                } else {
                    secureLocalStorage?.setItem(tableIndex, object);
                    setTableState(object);
                    init(selectedTabData, object)
                }
            }
        }
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
                        <button
                            onClick={()=>setShowEditTeacherModal(true)}
                            className="btn btn-sm m-btn--pill btn-info m-btn--uppercase d-inline-flex mb-3"
                        >
                            <AddCircleOutlineRoundedIcon />
                            <span className='ml-2'>{translations(locale)?.action?.register}</span>
                        </button>
                        {/* <Link
                            to='/school/staffs/create'
                            className="btn btn-sm m-btn--pill btn-info m-btn--uppercase d-inline-flex mb-3"
                        >
                            <AddCircleOutlineRoundedIcon />
                            <span className='ml-2'>{translations(locale)?.action?.register}</span>
                        </Link> */}
                        <div className="m-portlet tab ">
                            <div className='m-portlet__head'>
                                <Tab
                                    activeIndex={selectedTabData?.index}
                                    renderActiveOnly
                                    menu={{ secondary: true, pointing: true, className: 'primaryColor' }}
                                    className="no-shadow"
                                    onTabChange={(e, data) => handleTabChange(data)}
                                    panes={tabData}
                                />
                            </div>
                            <div className="m-portlet__body">
                                <Tab.Pane attached={false}>
                                    <DTable
                                        remote
                                        locale={locale}
                                        config={config}
                                        data={tableData}
                                        columns={columns}
                                        individualContextMenus
                                        contextMenus={contextMenus}
                                        onContextMenuItemClick={handleContextMenuClick}
                                        onInteraction={onUserInteraction}
                                        totalDataSize={totalCount}
                                    />
                                </Tab.Pane>
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
                    title={translations(locale).delete}
                >
                    {translations(locale).delete_confirmation}
                    <br />
                    <br />
                    {translations(locale).delete_confirmation_description}
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
            {/* {
                showEditTeacherModal && selectedTableDataId &&
                <EditTeacherModal
                    onClose={closeModal}
                />
            } */}
        </div>
    )
}

export default index