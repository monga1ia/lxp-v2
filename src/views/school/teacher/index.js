import { React, useState, useEffect } from 'react'
import { Row, Col, Card, Button } from 'react-bootstrap';
import secureLocalStorage from 'react-secure-storage'
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import TreeView from 'modules/TreeView';
import HtmlHead from 'components/html-head/HtmlHead';
import BreadcrumbList from 'components/breadcrumb-list/BreadcrumbList';
import AddTeacherModal from './modals/addTeacher';
// import EditTeacherModal from './modals/editTeacher';
import DeleteModal from 'modules/DeleteModal';
import TabComponent from 'components/tab/Tab';
import DTable from 'modules/DataTable/DTable';
import { useTranslation } from 'react-i18next';
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import ViewModal from 'views/adminQuestion/modal/ViewModal';
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

    const [showViewModal, setShowViewModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedGroupId, setSelectedGroupId] = useState(null);
    const [groupData, setGroupData] = useState(null);
    const [loading, setLoading] = useState(false);

    const [tableData, setTableData] = useState([{code: "23232", firstName: "asdfsdf"}]);
    const [totalCount, setTotalCount] = useState(0);

    const [showAddTeacherModal, setShowAddTeacherModal] = useState(false)
    const [showEditTeacherModal, setShowEditTeacherModal] = useState(false)
    const [selectedTabData, setSelectedTabData] = useState('active')


    const handleAddTeacher = () => {
        setShowAddTeacherModal(true)
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


    const closeModal = () => {
        setShowAddTeacherModal(false)
        setShowDeleteModal(false)
        setSelectedGroupId(null)
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
            icon: <BorderColorTwoToneIcon sx={{fontSize: '1.8rem !important', color: '#ff5b1d'}}/>,
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
            icon: <BorderColorTwoToneIcon sx={{fontSize: '1.8rem !important', color: '#ff5b1d'}}/>,
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
        if (id && key) {
            setSelectedTableDataId(id)
            if (key === 'view') {
                setShowViewModal(true)
            } else if (key === 'edit') {
                navigate('/school/teachers/edit', {state: {id}})
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
                el.contextMenuKeys = el.isMobile ? 'view, edit, delete, statusChange, loginNameChange, passwordReset, roleChange, infoChange' : 'view, edit, delete, statusChange, loginNameChange, roleChange, infoChange'
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

    return (
        <>
            <HtmlHead title={title} description={description} />

            <div className="page-title-container">
                <Col md="7">
                    <h1 className="mb-0 pb-0 display-4 relative">{title}</h1>
                    <BreadcrumbList items={breadcrumbs} />
                </Col>
            </div>
            
            <Row className="">
                <Col className="pr-0" xl="3" xxl="2">
                    <Card className="mb-5">
                        <Card.Body>
                            <TreeView
                            />
                        </Card.Body>
                    </Card>
                </Col>

                <Col xl="9" xxl="10">
                    <Button
                        onClick={handleAddTeacher}
                        variant="primary"
                        className="mb-2 add-button text-uppercase"
                    >
                        <ControlPointIcon style={{ color: "white", marginRight: "4px" }} />
                        {t('common.register')}
                    </Button>
                    <Card className="mb-5">
                        <Card.Body>
                            <TabComponent
                                onChange={(e, data) => handleTabChange(e, data)}
                                tabs={[
                                    {
                                        code: "active",
                                        title: "Ажиллаж байгаа",
                                        children: (
                                            <DTable
                                                remote
                                                config={config}
                                                locale={locale}
                                                data={tableData}
                                                columns={columns}
                                                individualContextMenus
                                                contextMenus={contextMenus}
                                                onContextMenuItemClick={handleContextMenuClick}
                                                // onInteraction={onUserInteraction}
                                                totalDataSize={totalCount}
                                            />
                                        )

                                    },
                                    {
                                        code: "absent",
                                        title: "Чөлөөтэй байгаа",
                                        children: (
                                            <DTable
                                                remote
                                                config={config}
                                                locale={locale}
                                                data={tableData}
                                                columns={columns}
                                                individualContextMenus
                                                contextMenus={contextMenus}
                                                onContextMenuItemClick={handleContextMenuClick}
                                                // onInteraction={onUserInteraction}
                                                totalDataSize={totalCount}
                                            />
                                        )
                                    },
                                    {
                                        code: "leave",
                                        title: "Ажлаас гарсан",
                                        children: (
                                            <DTable
                                                remote
                                                config={config}
                                                locale={locale}
                                                data={tableData}
                                                columns={columns}
                                                individualContextMenus
                                                contextMenus={contextMenus}
                                                onContextMenuItemClick={handleContextMenuClick}
                                                // onInteraction={onUserInteraction}
                                                totalDataSize={totalCount}
                                            />
                                        )
                                    },
                                    {
                                        code: "deleted",
                                        title: "Устгагдсан",
                                        children: (
                                            <DTable
                                                remote
                                                config={config}
                                                locale={locale}
                                                data={tableData}
                                                columns={columns}
                                                individualContextMenus
                                                contextMenus={contextMenus}
                                                onContextMenuItemClick={handleContextMenuClick}
                                                // onInteraction={onUserInteraction}
                                                totalDataSize={totalCount}
                                            />
                                        )
                                    }
                                ]}
                            />
                            {/* <GroupTable
                                tableData={tableData}
                                totalCount={totalCount}
                                onInteraction={onInteraction}
                                page={page}
                                pageSize={pageSize}
                                search={search}
                                onView={onView}
                                onDelete={onDelete}
                            /> */}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
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
                showViewModal && groupData &&
                <ViewModal
                    onClose={() => setShowViewModal(false)}
                    event={groupData}
                />
            }
            {
                showDeleteModal && selectedGroupId &&
                <DeleteModal
                    show={showDeleteModal}
                    onClose={closeModal}
                    onDelete={handleDelete}
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
        </>
    );
};

export default MainGroup;
