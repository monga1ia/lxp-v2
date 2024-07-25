import React, { useEffect, useState } from 'react'
import message from 'modules/message';
import TreeView from 'modules/TreeView';
import DTable from 'modules/DataTable/DTable';
import { Row, Col, Card, Button } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import secureLocalStorage from 'react-secure-storage'
import { useTranslation } from "react-i18next";
import HtmlHead from 'components/html-head/HtmlHead';
import BreadcrumbList from 'components/breadcrumb-list/BreadcrumbList';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone'
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import BorderColorTwoToneIcon from '@mui/icons-material/BorderColorTwoTone'
import AddClassModal from './modals/add'
import AddToNewYearModal from './modals/newYearAdd';
import ViewClassModal from './modals/view'
import EditClassModal from './modals/edit';
import DeleteModal from 'utils/deleteModal';
import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded'
import { Tab } from "semantic-ui-react";
import { CheckBox } from '@mui/icons-material';
import { fetchRequest } from 'utils/fetchRequest';
import {
    schoolClassIndex,
    schoolClassDelete
} from 'utils/fetchRequest/Urls';


const locale = secureLocalStorage?.getItem('selectedLang') || 'mn'
const localStorageSelectedTree = 'school_classes_selected_tree_index'
const localeActiveTableState = 'school_classes_table_index'

const index = () => {

    const { t } = useTranslation();
    const { selectedSchool } = useSelector(state => state.schoolData);

    const title = t('class_name');
    const description = "E-learning";
    const breadcrumbs = [
        { to: "", text: "Home" },
        { to: "school/classes", text: title }
    ];

    const [loading, setLoading] = useState(false)
    const [isNewYear, setIsNewYear] = useState(false)

    const [treeData, setTreeData] = useState([])
    const [selectedTreeDataId, setSelectedTreeDataId] = useState(secureLocalStorage.getItem(localStorageSelectedTree) || null)

    const [tableData, setTableData] = useState([])
    const [totalCount, setTotalCount] = useState([])
    const [selectedTabData, setSelectedTabData] = useState(0)

    const [hasNextYear, setHasNextYear] = useState(false)
    const [addAgain, setAddAgain] = useState(false)
    const [showAddClassModal, setShowAddClassModal] = useState(false)
    const [showViewModal, setShowViewModal] = useState(false)
    const [showEditClassModal, setShowEditClassModal] = useState(false)
    const [showAddToNewYear, setShowAddToNewYear] = useState(false)
    const [selectedTableDataId, setSelectedTableDataId] = useState(null)
    const [viewDeleteModal, setViewDeleteModal] = useState(false)
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
            icon: <BorderColorTwoToneIcon sx={{ fontSize: '2rem !important', color: '#ff5b1d' }} />,
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
        excelFileName: secureLocalStorage.getItem('selectedSchool')?.longname + ' - ' + t('class.class_list'),
        defaultSort: [
            {
                dataField: tableState?.sort || 'class',
                order: tableState?.order || 'asc'
            }
        ],
        defaultPageOptions: {
            page: tableState?.page,
            sizePerPage: tableState?.pageSize,
            search: tableState?.search,
        }
    };

    useEffect(() => {
        const classes = tableData
        if (classes && classes.length > 0) {
            for (let c = 0; c < classes?.length; c++) {
                if (classes[c].esisGroupId) {
                    classes[c].contextMenuKeys = ['EDIT', 'DELETE', 'ESIS_CLEAR']
                } else {
                    classes[c].contextMenuKeys = ['EDIT', 'DELETE']
                }
            }
        }
    }, [])

    const loadData = (pagination, grade) => {
        setLoading(true)
        fetchRequest(schoolClassIndex, 'POST', {
            school: selectedSchool?.id,
            filter: pagination?.filter,
            order: pagination?.order,
            sort: pagination?.sort,
            page: pagination?.page,
            pageSize: pagination?.pageSize,
            search: pagination?.search,
            grade
        })
            .then((res) => {
                if (res.success) {
                    setHasNextYear(res?.hasNextYear)
                    setTreeData(res?.gradeList || [])
                    let classes = res?.classes;
                    if (classes && classes.length > 0) {
                        for (let c = 0; c < classes?.length; c++) {
                            if (classes[c].esisGroupId) {
                                classes[c].contextMenuKeys = ['EDIT', 'DELETE', 'ESIS_CLEAR']
                            } else {
                                classes[c].contextMenuKeys = ['EDIT', 'DELETE']
                            }
                        }
                    }
                    setTableData(classes)
                    setTotalCount(res?.totalCount || 0)

                    if (!selectedTreeDataId) {
                        if (res?.gradeList?.length) {
                            setSelectedTreeDataId(res?.gradeList[0].key)
                        }
                    }
                } else {
                    message(res.data.message)
                }
                setLoading(false)
            })
            .catch(() => {
                message(t('err.error_occurred'))
                setLoading(false)
            })
    }

    useEffect(() => {
        loadData(tableState, selectedTreeDataId)
    }, [])


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
            loadData(cloneData, selectedTreeDataId)
        } else {
            if (state.page) {
                setTableState(state)
                secureLocalStorage.setItem(localeActiveTableState, state)
                loadData(state, selectedTreeDataId)
            }
        }
    }

    const esisRemove = (classId) => {
        console.log('esisRemove')
        // setLoading(true)
        // fetchRequest(schoolClassEsisClear, 'POST', {
        //     class: classId
        // })
        //     .then((res) => {
        //         if (res.success) {
        //             const { classes } = res.data
        //             if (classes && classes.length > 0) {
        //                 for (let c = 0; c < classes?.length; c++) {
        //                     if (classes[c].esisGroupId) {
        //                         classes[c].contextMenuKeys = ['EDIT', 'DELETE', 'ESIS_CLEAR']
        //                     } else {
        //                         classes[c].contextMenuKeys = ['EDIT', 'DELETE']
        //                     }
        //                 }
        //             }
        //             setTableData(classes)
        //         } else {
        //             message(res.data.message)
        //         }
        //         setLoading(false)
        //     })
        //     .catch(() => {
        //         message(t('.err.error_occurred'))
        //         setLoading(false)
        //     })
    }

    const _contextMenuItemClick = (id, key) => {
        if (id && key) {
            setSelectedTableDataId(id)
            if (key === 'EDIT') {
                // console.log('editModal')
                setShowEditClassModal(true)
                // navigate('/school/classes/edit', { replace: true, state: { id: id } })
            } else if (key === 'DELETE') {
                setViewDeleteModal(true)
                setClassId(id)
            } else if (key === 'ESIS_CLEAR') {
                esisRemove(id)
            }
        }
    }

    const closeModal = (reloadData = false) => {
        if (reloadData) {
            loadData(tableState, selectedTreeDataId)
        }
        setShowAddClassModal(false)
        setShowViewModal(false)
        setShowAddToNewYear(false)
        setShowEditClassModal(false)
        setViewDeleteModal(false)
        setSelectedTableDataId(null)
    }

    const getColumns = () => {
        if (selectedSchool?.isOnlineSchool) {
            return [
                {
                    dataField: "class",
                    text: t('group.group_name') || "",
                    sort: true,
                },
                {
                    dataField: "curriculumName",
                    text: t('group.curriculum') || "",
                    sort: true,
                },
                {
                    dataField: "studentCount",
                    text: t('group.student_count') || "",
                    sort: true,
                    align: "right",
                },
                {
                    dataField: "shift",
                    text: t('group.school_shift') || "",
                    sort: true,

                }
            ]
        } else {
            return [
                {
                    dataField: "class",
                    text: t('group.group_name') || "",
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
                    dataField: "classCurriculum",
                    text: t('group.curriculum') || "",
                    sort: true,
                    align: "right",
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
            ]
        }
    }

    const deleteClass = () => {
        setLoading(true)
        fetchRequest(schoolClassDelete, 'POST', {
            school: selectedSchool?.id,
            class: selectedTableDataId,
            grade: selectedTreeDataId,
            filter: tableState?.filter,
            order: tableState?.order,
            sort: tableState?.sort,
            page: tableState?.page,
            pageSize: tableState?.pageSize,
            search: tableState?.search,
        })
            .then((res) => {
                if (res.success) {
                    setHasNextYear(res?.hasNextYear)
                    setTreeData(res?.gradeList || [])
                    let classes = res?.classes;
                    if (classes && classes.length > 0) {
                        for (let c = 0; c < classes?.length; c++) {
                            if (classes[c].esisGroupId) {
                                classes[c].contextMenuKeys = ['EDIT', 'DELETE', 'ESIS_CLEAR']
                            } else {
                                classes[c].contextMenuKeys = ['EDIT', 'DELETE']
                            }
                        }
                    }
                    setTableData(classes)
                    setTotalCount(res?.totalCount || 0)

                    if (!selectedTreeDataId) {
                        if (res?.gradeList?.length) {
                            setSelectedTreeDataId(res?.gradeList[0].key)
                        }
                    }
                    message(res.message, true)
                    closeModal()
                } else {
                    message(res.message)
                }
                setLoading(false)
            })
            .catch(() => {
                message(t('err.error_occurred'))
                setLoading(false)
            })
    }

    const handleTreeSelect = key => {
        if (key && key.length > 0) {
            setSelectedTreeDataId(key[0])
            secureLocalStorage.setItem(localStorageSelectedTree, key[0])
            loadData(tableState, key[0])
        }
    }

    const _onTdClick = (teacherId) => {
        // setLoading(true)
        console.log('_onTdClcik')
        setShowViewModal(true);

        // fetchRequest(schoolTeacherView, 'POST', { teacher: teacherId })
        //     .then((res) => {
        //         if (res.success) {
        //             const { teacherData } = res.data
        //             setViewTeacherModal(true);
        //             setTeacherInfo(teacherData)
        //         } else {
        //             message(res.data.message)
        //         }
        //         setLoading(false)
        //     })
        //     .catch(() => {
        //         message(t('.err.error_occurred'))
        //         setLoading(false)
        //     })
    }

    const handleTabChange = (e, data) => {
        console.log(e, data.activeIndex)
        setSelectedTabData(data.activeIndex)
    }

    const handleCheckbox = () => {
        setIsNewYear(!isNewYear)
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
            <div className="m-content">
                <Row className=''>
                    <Col xl="2" xxl="2">
                        <div className="m-portlet br-12">
                            <div className="m-portlet__body">
                                {
                                    hasNextYear && <div className='align-center align-items-center' style={{ marginLeft: '17px', marginBottom: 15 }}>
                                        <input
                                            className="form-check-input modal-position form-modal-check mt-0"
                                            id='newYear'
                                            type="checkbox"
                                            style={{ borderRadius: '4px', fontSize: '18px' }}
                                            value={addAgain}
                                            onChange={handleCheckbox}
                                        />
                                        <label className="form-check-label font-mulish" htmlFor="subjectIsResult" style={{ color: '#575962', fontSize: '14px', marginLeft: '0.5rem', fontWeight: '400' }}>
                                            {t('newYear')}
                                        </label>
                                    </div>
                                }
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
                        <div>
                            <button
                                onClick={() => setShowAddClassModal(true)}
                                className='btn btn-sm m-btn--pill btn-info m-btn--uppercase d-inline-flex mb-3'
                            >
                                <ControlPointIcon style={{ color: "white", marginRight: "4px" }} />
                                {t('action.register')}
                            </button>
                            {
                                hasNextYear && <button
                                    onClick={() => setShowAddToNewYear(true)}
                                    className='btn btn-sm m-btn--pill btn-info m-btn--uppercase d-inline-flex mb-3 ml-2'
                                >
                                    <ControlPointIcon style={{ color: "white", marginRight: "4px" }} />
                                    {t('action.addToNewYear')}
                                </button>
                            }
                        </div>
                        <div className="m-portlet tab br-12">
                            <div className="">
                                <Tab
                                    menu={{ secondary: true, pointing: true, className: 'primaryColor m-0 h-4' }}
                                    onTabChange={(e, data) => handleTabChange(e, data)}
                                    className='m-portlet-header'
                                    panes={[
                                        {
                                            menuItem: t('active'),
                                            render: () => (
                                                <div className='m-portlet__body'>
                                                    <DTable
                                                        remote
                                                        locale={locale}
                                                        config={config}
                                                        currentPage={tableState?.page || 1}
                                                        defaultPageSize={tableState?.pageSize || 10}
                                                        data={tableData}
                                                        columns={getColumns()}
                                                        individualContextMenus
                                                        clickContextMenu={true}
                                                        contextMenus={contextMenus}
                                                        onContextMenuItemClick={_contextMenuItemClick}
                                                        onInteraction={onUserInteraction}
                                                        totalDataSize={totalCount}
                                                    />
                                                </div>
                                            )
                                        },
                                        {
                                            menuItem: t('studentBook.graduated'),
                                            render: () => (
                                                <div className='m-portlet__body'>
                                                    <DTable
                                                        remote
                                                        locale={locale}
                                                        config={config}
                                                        currentPage={tableState?.page || 1}
                                                        defaultPageSize={tableState?.pageSize || 10}
                                                        data={tableData}
                                                        columns={getColumns()}
                                                        individualContextMenus
                                                        clickContextMenu={true}
                                                        contextMenus={contextMenus}
                                                        onContextMenuItemClick={_contextMenuItemClick}
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
                    </Col>
                </Row>
            </div>
            {/*{
                viewDeleteModal &&
                <Modal
                    size='mini'
                    dimmer='blurring'
                    open={viewDeleteModal}
                    onClose={closeModal}
                    className="react-modal overflow-modal"
                >
                    <div className="header">
                        {t('delete')}
                        <button type="button" className="close" aria-label="Close" onClick={closeModal} >
                            <CloseIcon />
                        </button>
                    </div>
                    <div className="content">
                        <p>
                            {t('delete_confirmation')}
                            <br />
                            <br />
                            {t('delete_confirmation_description')}
                        </p>
                    </div>
                    <div className="actions modal-footer ">
                        <div className="col-12 text-center">
                            <button
                                className="btn m-btn--pill btn-link m-btn m-btn--custom"
                                onClick={closeModal}
                            >
                                {t('back') || null}
                            </button>
                            <button
                                onClick={deleteClass}
                                className="btn m-btn--pill btn-danger m-btn--wide"
                            >
                                {t('delete') || null}
                            </button>
                        </div>
                    </div>
                </Modal>
            } */}
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
                showAddClassModal &&
                <AddClassModal
                    onClose={closeModal}
                />
            }
            {
                showViewModal &&
                <ViewClassModal
                    data={selectedTableDataId}
                    onClose={closeModal}
                />
            }
            {
                showEditClassModal &&
                <EditClassModal
                    classId={selectedTableDataId}
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
                    title={t('warning.delete')}
                >
                    {t('warning.delete_confirmation')}
                    <br />
                    <br />
                    {t('warning.delete_confirmation_description')}
                </DeleteModal>
            }
            {
                showAddToNewYear &&
                <AddToNewYearModal
                    onClose={closeModal}
                    onSubmit={console.log('submitted new year')}
                />
            }
        </>
    )
}

export default index;