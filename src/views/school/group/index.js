import React, { useEffect, useState } from 'react'
import CloseIcon from '@mui/icons-material/Close';
import { Modal } from 'semantic-ui-react'
import message from 'modules/message';
// import ViewModal from './modal/view'
import HtmlHead from 'components/html-head/HtmlHead';
import BreadcrumbList from 'components/breadcrumb-list/BreadcrumbList';
import { Row, Col, Button } from 'react-bootstrap';
import EditGroupModal from './modals/edit';
import TreeView from 'modules/TreeView';
import DeleteModal from 'utils/deleteModal';
import DTable from 'modules/DataTable/DTable';
import secureLocalStorage from 'react-secure-storage'
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone'
import BorderColorTwoToneIcon from '@mui/icons-material/BorderColorTwoTone'
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import ViewModal from './modals/view'
import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded'
import { useTranslation } from "react-i18next";

const localStorageSelectedTree = 'school_classes_selected_tree_index'
const localeActiveTableState = 'school_classes_table_index'

const index = () => {
    
    const { t } = useTranslation();

    const title = t('group.title')
    const description = "E-learning";

    const breadcrumbs = [
        { to: "", text: "Home" },
        { to: "groups/index", text: title }
    ];

    const [loading, setLoading] = useState(false)

    const [treeData, setTreeData] = useState([])
    const [selectedTreeDataId, setSelectedTreeDataId] = useState(secureLocalStorage.getItem(localStorageSelectedTree) || null)

    const [tableData, setTableData] = useState([{id: 11, teacherLastName: "23232", teacherFirstName: "asdfsdf"}, {id: 12, teacherLastName: "2322", teacherFirstName: "asasdfsdf"}])
    const [totalCount, setTotalCount] = useState([])

    const [viewTeacherModal, setViewTeacherModal] = useState(false)
    const [viewDeleteModal, setViewDeleteModal] = useState(false)
    const [showEditModal, setShowEditModal] = useState(false)
    const [showCreateModal, setShowCreateModal] = useState(false)
    const [teacherInfo, setTeacherInfo] = useState([])
    const [classId, setClassId] = useState(false)

    const [tableState, setTableState] = useState(secureLocalStorage.getItem(localeActiveTableState) ||
    {
        filter: {},
        page: 1,
        pageSize: 10,
        search: '',
        sort: 'class',
        order: 'asc'
    }
    )

    const contextMenus = [
        {
            key: 'EDIT',
            icon: <BorderColorTwoToneIcon sx={{ fontSize: '1.8rem !important', color: '#ff5b1d' }} />,
            title: t('edit') || ""
        },
        {
            key: 'DELETE',
            icon: <DeleteTwoToneIcon sx={{ fontSize: '2rem !important', color: '#ff5b1d' }} />,
            title: t('delete') || ""
        },
        {
            key: 'ESIS_CLEAR',
            icon: <DeleteTwoToneIcon sx={{ fontSize: '2rem !important', color: '#ff5b1d' }} />,
            title: t('esis.clearClass') || ""
        },
    ]

    const config = {
        excelExport: true,
        printButton: true,
        columnButton: true,
        excelFileName: secureLocalStorage.getItem('selectedSchool')?.longname + ' - Бүгд',
        // excelFileRemote: true,
        // excelFileRemoteUrl: `/${schoolClassInit}?grade=${selectedTreeDataId}&excel=1&excelTotalCount=${totalCount}`,
        defaultSort: [
            {
                dataField: tableState?.sort || 'class',
                order: tableState?.order || 'asc'
            }
        ],
        defaultPageOptions: {
            page: 1,
            sizePerPage: 10,
            // search: tableState?.search,
        }
    };

    useEffect(() => {
        if (selectedTreeDataId) {
            init(tableState, selectedTreeDataId)
        } else {
            init(tableState)
        }
    }, [])

    const init = (pagination, grade) => {
        console.log('init')
        tableData?.forEach(el => {
            el.contextMenuKeys = 'EDIT, DELETE, ESIS_CLEAR'
        })
    }

    const onUserInteraction = (state) => {
        if (state.search) {
            let cloneData = {
                page: 1,
                pageSize: state.pageSize,
                search: state.search,
                filter: {
                    page: 1,
                    pageSize: state?.filter?.pageSize || 10
                }
            };

            setTableState(cloneData)
            secureLocalStorage.setItem(localeActiveTableState, cloneData)
            init(cloneData, selectedTreeDataId)
        } else {
            if (state.page) {
                setTableState(state)
                secureLocalStorage.setItem(localeActiveTableState, state)
                init(state, selectedTreeDataId)
            }
        }
    }

    const esisRemove = (classId) => {
        console.log('esisRemove')
    }

    const _contextMenuItemClick = (id, key) => {
        console.log(id,key)
        if (id && key) {
            if (key === 'EDIT') {
                console.log('edit')
                setShowEditModal(true)
                // navigate('/school/classes/edit', { replace: true, state: { id: id } })
            } else if (key === 'DELETE') {
                setViewDeleteModal(true)
                setClassId(id)
            } else if (key === 'ESIS_CLEAR') {
                esisRemove(id)
            }
        }
    }

    const closeModal = () => {
        setViewTeacherModal(false)
        setViewDeleteModal(false)
        setShowCreateModal(false)
        setShowEditModal(false)
    }

    const columns = [
        {
            dataField: "class",
            text: t('group.title') || "",
            sort: true,
        },
        {
            dataField: "teacherLastName",
            text: t('teacher.lastname') || "",
            sort: true
        },
        {
            dataField: "teacherFirstName",
            text: t('teacher.name') || "",
            sort: true,
            formatter: (cell, row) => {
                if (cell) {
                    return (
                        <span className="underline" onClick={() => _onTdClick(row.teacherId)}>{cell}</span>
                    )
                }
            },
        },
        {
            dataField: "studentCount",
            text: t('group.student_count') || "",
            sort: true,
            align: "right",
        },
        {
            dataField: "scoreType",
            text: t('group.score_type') || "",
            sort: true,
        },
        {
            dataField: "shift",
            text: t('group.school_shift') || "",
            sort: true,

        },
        {
            dataField: "room",
            text: t('group.classroom') || "",
            sort: true,
        },
        {
            dataField: "esisGroupId",
            text: t('esis.classCode') || "",
            hidden: true,
            sort: false,
        }
    ];

    const deleteClass = () => {
        console.log("deleteClass")
    }

    const handleTreeSelect = key => {
        if (key && key.length > 0) {
            setSelectedTreeDataId(key[0])
            secureLocalStorage.setItem(localStorageSelectedTree, key[0])

            let cloneData = {
                page: 1,
                pageSize: tableState.pageSize,
                search: tableState.search,
                sort: tableState.sort,
                order: tableState.order,
                filter: {
                    page: 1,
                    pageSize: tableState?.filter?.pageSize || 10
                }
            };

            setTableState(cloneData)
            secureLocalStorage.setItem(localeActiveTableState, cloneData)
            init(cloneData, key[0])
        }
    }

    const _onTdClick = (teacherId) => {
        console.log('_onTdClick')
    }

    return (
        <div className="m-grid__item m-grid__item--fluid m-wrapper">
            <HtmlHead title={title} description={description} />
            <div className="page-title-container">
                <Col md="7">
                    <h1 className="mb-0 pb-0 display-4 relative">{title}</h1>
                    <BreadcrumbList items={breadcrumbs} />
                </Col>
            </div>
            {/* <SubHeader
                locale={locale}
                title={t('group.title || null')}
            /> */}
            <div className="m-content">
                <div className="row">
                    <div className="col-3 pr-0">
                        <div className="">
                            <div className="mb-5 background-white br-16 padding-30">
                                <TreeView
                                    treeData={treeData}
                                    selectedNodes={[selectedTreeDataId]}
                                    onSelect={handleTreeSelect}
                                    defaultExpandAll
                                />
                            </div>
                        </div>
                    </div>
                    <div className="col-9">
                        <Button
                            onClick={() => setShowCreateModal(true)}
                            className='btn btn-sm m-btn--pill btn-info m-btn--uppercase d-inline-flex mb-3'
                        >
                            <AddCircleOutlineRoundedIcon/>
                            <span className='ml-2'>{t('action.register')}</span>
                        </Button>
                        {/* <Link to='/school/classes/create' className="btn m-btn--pill m-btn--uppercase btn-info d-inline-flex align-items-center mb-3 btn-sm">
                            <AddCircleOutlineRoundedIcon />
                            <span className="ml-2">{t('action.register || null}</span')>
                        </Link> */}
                        <div className="mb-5 background-white br-16">
                            <div className="padding-30">
                                <DTable
                                    remote
                                    locale={locale}
                                    config={config}
                                    data={tableData}
                                    columns={columns}
                                    individualContextMenus
                                    contextMenus={contextMenus}
                                    onContextMenuItemClick={_contextMenuItemClick}
                                    onInteraction={onUserInteraction}
                                    totalDataSize={totalCount}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {
                viewTeacherModal &&
                <ViewModal
                    onClose={closeModal}
                />
            }
            {
                showEditModal && 
                <EditGroupModal
                    onClose={closeModal}
                />
            }
            {
                viewDeleteModal &&
                <DeleteModal
                    show={viewDeleteModal}
                    onClose={closeModal}
                    onDelete={deleteClass}
                    locale={locale}
                    title={t('delete')}
                >
                    {t('delete_confirmation')}
                    <br />
                    <br />
                    {t('delete_confirmation_description')}
                </DeleteModal>
                    // <div className="content">
                    //     <p>
                    //         {t('delete_confirmation')}
                    //         <br />
                    //         <br />
                    //         {t('delete_confirmation_description')}
                    //     </p>
                    // </div>
            }
            {
                loading &&
                <>
                    <div className='blockUI blockOverlay' />
                    <div className='blockUI blockMsg blockPage'>
                        <div className='m-loader m-loader--brand m-loader--lg' />
                    </div>
                </>
            }
        </div>
    )
}

export default index