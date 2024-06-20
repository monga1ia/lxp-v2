import { React, useState, useEffect } from 'react'
import { Row, Col, Card, Button } from 'react-bootstrap';
import secureLocalStorage from 'react-secure-storage'
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import TreeView from 'modules/TreeView';
import HtmlHead from 'components/html-head/HtmlHead';
import BreadcrumbList from 'components/breadcrumb-list/BreadcrumbList';
import TabComponent from 'components/tab/Tab';
import DTable from 'modules/DataTable/DTable';
import { useTranslation } from 'react-i18next';
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
import { translations } from 'utils/translations';
import message from '../../../modules/message'
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone'
import PreviewTwoToneIcon from '@mui/icons-material/PreviewTwoTone'
import LockResetTwoToneIcon from '@mui/icons-material/LockResetTwoTone'
import BorderColorTwoToneIcon from '@mui/icons-material/BorderColorTwoTone'
import DescriptionTwoToneIcon from '@mui/icons-material/DescriptionTwoTone'
import CameraFrontTwoToneIcon from '@mui/icons-material/CameraFrontTwoTone'
import ManageAccountsTwoToneIcon from '@mui/icons-material/ManageAccountsTwoTone'
import ImportContactsTwoToneIcon from '@mui/icons-material/ImportContactsTwoTone'
import SettingsApplicationsTwoToneIcon from '@mui/icons-material/SettingsApplicationsTwoTone'

const tableIndex = ['groups_index_table_index'];
const gradeIndex = ['groups_index_grade_index'];

const MainGroup = () => {
    const { t } = useTranslation();
    const history = useHistory();
    const { selectedSchool } = useSelector(state => state.schoolData);

    const locale="mn"

    const [loading, setLoading] = useState(false);

    const [tableData, setTableData] = useState([
        {id: 11, code: 2323, firstName: "asdfsdf"}, 
        {id: 12, code: 1232, firstName: "asasdfsdf"}
    ]);
    const [totalCount, setTotalCount] = useState(0);

    const handleTreeSelect = key => {
        if (key && key.length > 0) {
            setSelectedTreeDataId(key[0])
        }
    }

    const [treeData, setTreeData] = useState([{
        title: 'first level',
        value: '0-0',
        key: 1,
        selectable: true,
        children: [{
            title: 'second level',
            value: '0-0-0',
            key: 2,
            selectable: true,
            children: [
            {
                title: 'third level',
                value: '0-0-0-0',
                key: 31,
                selectable: true,
            },
            {
                title: 'third_2 level',
                value: '0-0-0-1',
                key: 32,
                selectable: true,
            },
            ],
        }]
    }])
    const [selectedTreeDataId, setSelectedTreeDataId] = useState([32])

    const [showAddTeacherModal, setShowAddTeacherModal] = useState(false)
    const [showEditTeacherModal, setShowEditTeacherModal] = useState(false)
    const [selectedTabData, setSelectedTabData] = useState('active')
    const [showViewModal, setShowViewModal] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [showRoleChangeModal, setShowRoleChangeModal] = useState(false)
    const [showInfoChangeModal, setShowInfoChangeModal] = useState(false)
    const [showStatusChangeModal, setStatusChangeModal] = useState(false)
    const [showPasswordResetModal, setShowPasswordResetModal] = useState(false)
    const [showLoginNameChangeModal, setShowLoginNameChangeModal] = useState(false)

    const [selectedTableDataId, setSelectedTableDataId] = useState(null)

    const handleAddTeacher = () => {
        setShowAddTeacherModal(true)
    }
    const handleEditTeacher = () => {
        console.log('edited')
    }
    const handleTabChange = (e, data) => {
        console.log( e, data)
        setSelectedTabData(data)
    }

    const title = t('teacher.title');
    const description = "E-learning";

    const breadcrumbs = [
        { to: "", text: "Home" },
        { to: "groups/index", text: title }
    ];

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


    const activeColumns = [
        {
            dataField: 'avatar',
            text: translations(locale)?.teacher?.photo,
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
            text: translations(locale)?.teacher?.code,
            sort: true
        },
        {
            dataField: 'lastName',
            text: translations(locale)?.teacher?.lastname,
            sort: true
        },
        {
            dataField: 'firstName',
            text: translations(locale)?.teacher?.name,
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
            text: translations(locale)?.teacher?.teacher_title,
            sort: true
        },
        {
            dataField: 'username',
            text: translations(locale)?.teacher?.login_name,
            sort: true
        },
        {
            dataField: 'contact',
            text: translations(locale)?.teacher?.phone_number,
            sort: true
        },
        {
            dataField: 'registrationNumber',
            text: translations(locale)?.register_number,
            sort: true
        },
        {
            dataField: 'subjectNames',
            text: translations(locale)?.teacher?.subjects,
            sort: false
        },
        {
            dataField: 'className',
            text: translations(locale)?.teacher?.teacher_class,
            sort: false
        },
    ]

    const otherColumns = [
        {
            dataField: 'avatar',
            text: translations(locale)?.teacher?.photo,
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
            text: translations(locale)?.teacher?.code,
            sort: true
        },
        {
            dataField: 'lastName',
            text: translations(locale)?.teacher?.lastname,
            sort: true
        },
        {
            dataField: 'firstName',
            text: translations(locale)?.teacher?.name,
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
            text: translations(locale)?.teacher?.teacher_title,
            sort: true
        },
        {
            dataField: 'username',
            text: translations(locale)?.teacher?.login_name,
            sort: true
        },
        {
            dataField: 'subjectNames',
            text: translations(locale)?.teacher?.subjects,
            sort: false
        },
        {
            dataField: 'className',
            text: translations(locale)?.teacher?.teacher_class,
            sort: false
        },
    ]

    const activeContextMenus = [
        {
            key: 'view',
            icon: <PreviewTwoToneIcon sx={{fontSize: '2rem !important', color: '#ff5b1d'}}/>,
            title: translations(locale)?.view,
        },
        {
            key: 'edit',
            icon: <BorderColorTwoToneIcon sx={{fontSize: '2rem !important', color: '#ff5b1d'}}/>,
            title: translations(locale)?.edit
        },
        {
            key: 'delete',
            icon: <DeleteTwoToneIcon sx={{fontSize: '2rem !important', color: '#ff5b1d'}}/>,
            title: translations(locale)?.delete
        },
        {
            key: 'statusChange',
            icon: <CameraFrontTwoToneIcon sx={{fontSize: '2rem !important', color: '#ff5b1d'}}/>,
            title: translations(locale)?.teacher?.change_status
        },
        {
            key: 'loginNameChange',
            icon: <SettingsApplicationsTwoToneIcon sx={{fontSize: '2rem !important', color: '#ff5b1d'}}/>,
            title: translations(locale)?.teacher?.change_login_name,
        },
        {
            key: 'passwordReset',
            icon: <LockResetTwoToneIcon sx={{fontSize: '2rem !important', color: '#ff5b1d'}}/>,
            title: translations(locale)?.teacher?.change_password,
        },
        {
            key: 'roleChange',
            icon: <ManageAccountsTwoToneIcon sx={{fontSize: '2rem !important', color: '#ff5b1d'}}/>,
            title: translations(locale)?.manage_roles,
        },
        {
            key: 'infoChange',
            icon: <ImportContactsTwoToneIcon sx={{fontSize: '2rem !important', color: '#ff5b1d'}}/>,
            title: translations(locale)?.insert_information,
        },
    ]

    const otherContextMenus = [
        {
            key: 'view',
            icon: <PreviewTwoToneIcon sx={{fontSize: '2rem !important', color: '#ff5b1d'}}/>,
            title: translations(locale)?.view,
        },
        {
            key: 'edit',
            icon: <BorderColorTwoToneIcon sx={{fontSize: '2rem !important', color: '#ff5b1d'}}/>,
            title: translations(locale)?.edit
        },
        {
            key: 'delete',
            icon: <DeleteTwoToneIcon sx={{fontSize: '2rem !important', color: '#ff5b1d'}}/>,
            title: translations(locale)?.delete
        },
        {
            key: 'statusChange',
            icon: <CameraFrontTwoToneIcon sx={{fontSize: '2rem !important', color: '#ff5b1d'}}/>,
            title: translations(locale)?.teacher?.change_status
        },
    ]

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

    const config = {
        excelExport: true,
        printButton: true,
        columnButton: true,
        excelFileName: `${secureLocalStorage.getItem('selectedSchool')?.text}-${translations(locale)?.teacher_title}`,
        defaultSort: [{
            dataField: 'firstName',
            order: 'asc'
        }],
        defaultPageOptions: {
            page: 1,
            sizePerPage: 10,
        }
    }
    const [columns, setColumns] = useState(activeColumns)
    const [contextMenus, setContextMenus] = useState(activeContextMenus)
    useEffect(() => {
        if (selectedTabData == 'active') {
            tableData?.forEach(el => {
                el.contextMenuKeys = 'view, edit, delete, statusChange, loginNameChange, passwordReset, roleChange, infoChange'
            })
            setColumns(activeColumns)
            setContextMenus(activeContextMenus)
        } else {
            if (selectedTabData === 'deleted') {
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

    const handleDelete = () => {
        console.log('delete')
    }

    const handleStatusChange = () => {
        console.log('statusChange')
    }

    const handleLoginNameChange = loginNames => {
        console.log('loginNameChange')
    }
    
    const handleRoleChange = roles => {
        console.log('roleChange')
    }

    const handleInfoChange = param => {
        console.log('infoChange')
    }

    const handlePasswordReset = (password, passwordRepeat) => {
        console.log('passwordReset')
    }

    return (
        <>
            <HtmlHead title={title} description={description} />

            <div className="page-title-container">
                <Col md="7">
                    <h1 className="mb-0 pb-0 display-4 relative">{title}</h1>
                    <BreadcrumbList items={breadcrumbs} />
                </Col>
            </div>

            <div className='m-content'>
                <Row className=''>
                    <Col className="pr-0" xl="3" xxl="2">
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

                    <Col xl="9" xxl="10">
                        <Button
                            onClick={() => setShowAddTeacherModal(true)}
                            className='btn btn-sm m-btn--pill btn-info m-btn--uppercase d-inline-flex mb-3'
                        >
                            <ControlPointIcon style={{ color: "white", marginRight: "4px" }} />
                            {t('common.register')}
                        </Button>
                        <div className='m-portlet tab'>
                            <div className=''>
                                <TabComponent
                                    onChange={(e, data) => handleTabChange(e, data)}
                                    className='m-portlet-header'
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
                                        {
                                            code: "deleted",
                                            title: "Устгасан",
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
