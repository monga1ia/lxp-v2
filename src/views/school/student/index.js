import {useState} from 'react'
import message from 'modules/message'
import React, {useEffect} from 'react'
import TreeView from 'modules/TreeView'
import DTable from 'modules/DataTable/DTable'
// import ExcelUploadModal from './modals/excelUpload'
import secureLocalStorage from 'react-secure-storage'
import {fetchRequest} from 'utils/fetchRequest'
import {translations} from 'utils/translations'
import { useTranslation } from 'react-i18next'
import HtmlHead from 'components/html-head/HtmlHead';
import BreadcrumbList from 'components/breadcrumb-list/BreadcrumbList';
import PasswordResetModal from './modals/passwordReset'
import LoginNameChangeModal from './modals/loginNameChange'
import ClearUserModal from './modals/clearUser'
import InsertModal from './modals/insertModal'
import LockResetRoundedIcon from '@mui/icons-material/LockResetRounded'
import HighlightOffRoundedIcon from '@mui/icons-material/HighlightOffRounded'
import ManageAccountsRoundedIcon from '@mui/icons-material/ManageAccountsRounded'
import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded'
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded'
import PersonRemoveIcon from '@mui/icons-material/PersonRemove'
import CloseIcon from '@mui/icons-material/Close'   
// import {
//     schoolStudentInit,
//     schoolStudentClearUser,
//     schoolStudentSetActive,
//     schoolStudentChangeUserName,
//     schoolStudentChangePassword,
//     schoolStudentExcelUpload
// } from 'utils/url'
import {Col, Row, Button} from "react-bootstrap";
import {Modal} from "semantic-ui-react";

const locale = secureLocalStorage?.getItem('selectedLang') || 'mn'
const localSelectedTree = 'school_students_selected_tree_data'
const localTableState = 'school_students_table_state'

const columns = [
    {
        dataField: 'isActive',
        text: '',
        align: 'center',
        headerStyle: {width: 50},
        formatter: (cell) =>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <div className={`table-circle ${cell === true && "active"}`} />
            </div>
    },
    {
        dataField: 'className',
        text: translations(locale)?.className,
        sort: true
    },
    {
        dataField: 'code',
        text: translations(locale)?.studentCode,
        sort: true
    },
    {
        dataField: 'lastName',
        text: translations(locale)?.studentLastName,
        sort: true
    },
    {
        dataField: 'firstName',
        text: translations(locale)?.studentFirstName,
        sort: true
    },
    {
        dataField: 'username',
        text: translations(locale)?.teacher?.login_name,
        sort: true,
    },
]

const contextMenus = [
    {
        key: 'loginNameChange',
        icon: <ManageAccountsRoundedIcon sx={{fontSize: '2rem !important', color: '#ff5b1d'}}/>,
        title: translations(locale)?.change_login_name,
    },
    {
        key: 'passwordReset',
        icon: <LockResetRoundedIcon sx={{fontSize: '2rem !important', color: '#ff5b1d'}}/>,
        title: translations(locale)?.change_password,
    },
    {
        key: 'disable',
        icon: <HighlightOffRoundedIcon sx={{fontSize: '2rem !important', color: '#ff5b1d'}}/>,
        title: translations(locale)?.disable,
    },
    {
        key: 'enable',
        icon: <CheckCircleOutlineRoundedIcon sx={{fontSize: '2rem !important', color: '#ff5b1d'}}/>,
        title: translations(locale)?.enable,
    },
    {
        key: 'clearUser',
        icon: <PersonRemoveIcon sx={{fontSize: '2rem !important', color: '#ff5b1d'}}/>,
        title: translations(locale)?.clear_login_name,
    },
]

const index = () => {

    const { t } = useTranslation();
    
    const title = t('students');
    const description = "E-learning";
    const breadcrumbs = [
        { to: "", text: "Home" },
        { to: "school/teacher", text: title }
    ];

    const [loading, setLoading] = useState(false)

    const [treeData, setTreeData] = useState([{
        title: 'first level',
        value: '0-0',
        key: 'asdfasdf',
        id: 'class_123123',
        selectable: true,
        children: [{
            title: 'second level',
            value: '0-0-0',
            key: 'asdij',
            id: 'class_123',
            selectable: true,
        }]
    }])
    const [selectedTreeData, setSelectedTreeData] = useState(secureLocalStorage.getItem(localSelectedTree) || {})

    const [hasStudentRole, setHasStudentRole] = useState(false)

    const [tableData, setTableData] = useState([
        {userId: 11, isActive: false, class: 2323, lastName: "asdfsdf", firstName: 'Jack' }, 
        {userId: 12, isActive: true, class: 1232, lastName: "asasdfsdf", firstName: "Joe" },
    ])
    const [tableDataTotalSize, setTableDataTotalSize] = useState(0)
    const [selectedTableDataId, setSelectedTableDataId] = useState(null)
    const [tableState, setTableState] = useState(secureLocalStorage.getItem(localTableState) || {})

    const [showExcelUploadModal, setShowExcelUploadModal] = useState(false)
    const [showPasswordResetModal, setShowPasswordResetModal] = useState(false)
    const [showLoginNameChangeModal, setShowLoginNameChangeModal] = useState(false)
    const [showClearUserModal, setShowClearUserModal] = useState(false)

    const [showInsertModal, setShowInsertModal] = useState(false)

    const config = {
        excelExport: true,
        printButton: true,
        excelFileName: `${secureLocalStorage.getItem('selectedSchool')?.text}-${translations(locale)?.students}`,
        defaultSort: [
            {
                dataField: tableState?.sort || 'className',
                order: tableState?.order || 'asc'
            }
        ],
    }

    useEffect(() => {
        // init()
        secureLocalStorage.setItem(localTableState, tableState)
        secureLocalStorage.setItem(localSelectedTree, selectedTreeData)
    }, [selectedTreeData, tableState])

    useEffect(() => {
        if (tableData.length)
            tableData?.forEach(el => {
                el.contextMenuKeys = el?.isActive ? 'disable,loginNameChange,passwordReset' : 'enable,clearUser'
            })
    }, [tableData])

    // const init = () => {
    //     setLoading(true)
    //     fetchRequest(schoolStudentInit, 'POST', {grade: selectedTreeData?.key, ...tableState})
    //         .then((res) => {
    //             if (res.success) {
    //                 const {grades, students, totalCount} = res.data
    //                 setHasStudentRole(res?.data?.hasStudentRole)
    //                 setTreeData(grades || [])
    //                 setTableData(students || [])
    //                 setTableDataTotalSize(totalCount || 0)
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

    const handleExcelUpload = students => {
        console.log('handleExcelUpload')
        // setLoading(true)
        // fetchRequest(schoolStudentExcelUpload, 'POST', {students, submit: 1})
        //     .then((res) => {
        //         if (res.success) {
        //             init()
        //             closeModal()
        //             message(res.data.message, res.data.success)
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

    const onSubmitInsert = () => {
        setShowInsertModal(false)
        // init()
    }

    const handlePasswordReset = passwords => {
        console.log('passReset')
        // setLoading(true)
        // fetchRequest(schoolStudentChangePassword, 'POST', {...passwords, user: selectedTableDataId})
        //     .then((res) => {
        //         if (res.success) {
        //             init()
        //             closeModal()
        //             message(res.data.message, res.data.success)
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
        // fetchRequest(schoolStudentChangeUserName, 'POST', {...loginNames, user: selectedTableDataId})
        //     .then((res) => {
        //         if (res.success) {
        //             init()
        //             closeModal()
        //             message(res.data.message, res.success)
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

    const handleActive = (user, active) => {
        console.log('handleActive')
        // setLoading(true)
        // fetchRequest(schoolStudentSetActive, 'POST', {user, active})
        //     .then((res) => {
        //         if (res.success) {
        //             init()
        //             closeModal()
        //             message(res.data.message, res.success)
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

    const submitClearUser = () => {
        console.log('submitClearUser')
        // setLoading(true)
        // fetchRequest(schoolStudentClearUser, 'POST', {user: selectedTableDataId})
        //     .then((res) => {
        //         if (res.success) {
        //             init()
        //             closeModal()
        //             message(res.data.message, res.success)
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
            if (key === 'disable')
                handleActive(id, 0)
            else if (key === 'enable')
                handleActive(id, 1)
            else if (key === 'passwordReset')
                setShowPasswordResetModal(true)
            else if (key === 'loginNameChange')
                setShowLoginNameChangeModal(true)
            else if (key === 'clearUser')
                setShowClearUserModal(true)
        }
    }

    const closeModal = () => {
        setSelectedTableDataId(null)
        setShowExcelUploadModal(false)
        setShowPasswordResetModal(false)
        setShowLoginNameChangeModal(false)
        setShowClearUserModal(false)
        setShowInsertModal(false)
    }

    const handleTreeChange = data => {
        setSelectedTreeData(data)
        setTableState({...tableState, page: 1})
    }

    const handleInteraction = (object) => {
        if (object.page) {
            setTableState(object)
        }
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
                        <div className="m-portlet br-12">
                            <div className="m-portlet__body">
                                <TreeView
                                    defaultExpandAll
                                    treeData={treeData}
                                    selectedNodes={[selectedTreeData?.key]}
                                    onSelect={(params, info) => handleTreeChange(info?.node)}
                                />
                            </div>
                        </div>
                    </Col>
                    <Col xl="10" xxl="10">
                        <Button
                            className='btn btn-sm m-btn--pill btn-info m-btn--uppercase d-inline-flex mb-3'
                            onClick={() => console.log('excelImportModal')}
                        >
                            <AddCircleOutlineRoundedIcon/>
                            <span className='ml-2'>{translations(locale)?.excel_import}</span>
                        </Button>
                        <Button
                            className='btn btn-sm m-btn--pill btn-info m-btn--uppercase d-inline-flex mb-3 ml-3'
                            onClick={() => setShowInsertModal(true)}
                        >
                            <span className='ml-2'>{translations(locale)?.student?.create_user}</span>
                        </Button>
                        {
                            // hasStudentRole
                            //     ?
                            //     <>
                            //     <button
                            //         className='btn btn-sm m-btn--pill btn-info m-btn--uppercase d-inline-flex mb-3'
                            //         onClick={() => setShowExcelUploadModal(true)}
                            //     >
                            //         <AddCircleOutlineRoundedIcon/>
                            //         <span className='ml-2'>{translations(locale)?.excel_import}</span>
                            //     </button>
                            //         <button
                            //             className='btn btn-sm m-btn--pill btn-info m-btn--uppercase d-inline-flex mb-3 ml-3'
                            //             onClick={() => setShowInsertModal(true)}
                            //         >
                            //             <span className='ml-2'>{translations(locale)?.student?.create_user}</span>
                            //         </button>
                            //     </>
                            //     :
                            //     <p className={'ml-2'}>{translations(locale)?.student?.userRoleNotFound}</p>
                        }
                        <div className='m-portlet br-12'>
                            <div className='m-portlet__body'>
                                {
                                    console.log('>>>', tableData)
                                }
                                <DTable
                                    remote
                                    locale={locale}
                                    config={{
                                        ...config,
                                        defaultPageOptions: {
                                            ...tableState
                                        }
                                    }}
                                    data={tableData}
                                    columns={columns}
                                    individualContextMenus
                                    contextMenus={contextMenus}
                                    totalDataSize={tableDataTotalSize}
                                    onInteraction={handleInteraction}
                                    // onInteraction={(state) => setTableState({ ...tableState, ...state })}
                                    onContextMenuItemClick={(id, key, row) => handleContextMenuClick(row?.userId, key)}
                                />
                            </div>
                        </div>
                    </Col>
                </Row>
            </div>
            {
                loading &&
                <>
                    <div className='blockUI blockOverlay'/>
                    <div className='blockUI blockMsg blockPage'>
                        <div className='m-loader m-loader--brand m-loader--lg'/>
                    </div>
                </>
            }
            {
                showPasswordResetModal && selectedTableDataId &&
                <PasswordResetModal
                    onClose={closeModal}
                    onSubmit={handlePasswordReset}
                />
            }
            {
                showLoginNameChangeModal && selectedTableDataId &&
                <LoginNameChangeModal
                    onClose={closeModal}
                    onSubmit={handleLoginNameChange}
                />
            }
            {/* {
                showExcelUploadModal &&
                <ExcelUploadModal
                    onClose={closeModal}
                    open={showExcelUploadModal}
                    onSubmit={handleExcelUpload}
                />
            } */}
            {
                showInsertModal &&
                <InsertModal
                    onClose={closeModal}
                    gradeKey={selectedTreeData?.key}
                    open={showInsertModal}
                    onSubmit={onSubmitInsert}
                />
            }
            {
                showClearUserModal && 
                    
                <ClearUserModal
                    show={showClearUserModal}
                    onClose={closeModal}
                    onDelete={submitClearUser}
                    title={t('warning.delete')}>
                    {t('clear_login_name_description')}
                    <br />
                    <br />
                    {t('clear_login_name_description_1')}
                </ClearUserModal>
            }
        </>
    )
}

export default index