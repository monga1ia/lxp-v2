import React, { useEffect, useState } from "react";
import { connect } from 'react-redux';
// import * as actions from "Actions/action";
import { Checkbox, Dropdown, Modal, Tab } from 'semantic-ui-react'
import DTable from "modules/DataTable/DTable";
import TreeView from "modules/TreeView";
import { useSelector } from 'react-redux'
import { sessionService } from 'redux-react-session';
import { Row, Col, Button } from "react-bootstrap";
import HtmlHead from 'components/html-head/HtmlHead';
import BreadcrumbList from 'components/breadcrumb-list/BreadcrumbList';
import message from "modules/message";
import BorderColorTwoToneIcon from '@mui/icons-material/BorderColorTwoTone';
import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import LinkIcon from '@mui/icons-material/Link';
import LinkOffIcon from '@mui/icons-material/LinkOff';
import GroupsIcon from '@mui/icons-material/Groups';
import CloseIcon from '@mui/icons-material/Close';
import secureLocalStorage from "react-secure-storage";
import { useTranslation } from "react-i18next";

import { fetchRequest } from 'utils/fetchRequest'
import { managerGroupIndex, managerGroupDelete, managerGroupClassroomLink } from 'utils/fetchRequest/Urls'

import ViewStudent from "./modals/view";
import ClassRoomLink from "./modals/classRoomLink";
import AddGroup from "./modals/addGroup";
import EditModal from "./modals/editModal";
import DeleteModal from 'utils/deleteModal';


const locale = secureLocalStorage?.getItem('selectedLang') || 'mn'

const index = () => {

    // index нь class, props байсан, back-аас data орж ирж байгаа нь шал өөр юм бн. эхлээд editModal ороод үзээрэй
    // LXP v1 location: lxp\assets\src\Components\manager\group

    const { t } = useTranslation()
    const { selectedSchool } = useSelector(state => state.schoolData);
    const treeIndex = 'manager_group_tree_index_' + selectedSchool?.id;

    const title = t('omr_exam_template.subject_group');
    const description = t('omr_exam_template.subject_group');
    const breadcrumbs = [
        { to: "", text: "Home" },
        { to: "manager/groups", text: title }
    ];

    const [loading, setLoading] = useState(false)
    const [initLoaded, setInitLoaded] = useState(false)

    const [hasGoogleClassRoom, setHasGoogleClassRoom] = useState(false)

    const [selectedTreeId, setSelectedTreeId] = useState(secureLocalStorage?.getItem(treeIndex) || null)
    const [treeData, setTreeData] = useState([])
    const [totalCount, setTotalCount] = useState(0)
    const [list, setList] = useState([])

    const [subjects, setSubjects] = useState([])
    const [classes, setClasses] = useState([])

    const [selectedTableDataId, setSelectedTableDataId] = useState(null)

    const [showClassroomLink, setShowClassroomLink] = useState(false)

    const [showStudentModal, setShowStudentModal] = useState(false)
    const [modalViewTitle, setModalViewTitle] = useState(null)

    const [showAddGroupModal, setShowAddGroupModal] = useState(false)

    const getContextMenus = (showClassRoom = false) => {
        const cm = [
            {
                key: 'EDIT',
                icon: <BorderColorTwoToneIcon sx={{ fontSize: '2rem !important', color: '#ff5b1d' }} />,
                title: t('common.edit')
            },
            {
                key: 'DELETE',
                icon: <DeleteTwoToneIcon sx={{ fontSize: '2rem !important', color: '#ff5b1d' }} />,
                title: t('common.delete')
            }
        ]
        if (showClassRoom) {
            cm.push({
                key: 'CLASSROOM',
                icon: <GroupsIcon sx={{ fontSize: '2rem !important', color: '#ff5b1d' }} />,
                title: t('group.classRoomLink')
            })
        }
        return cm;
    }

    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [showEditModal, setShowEditModal] = useState(false)

    const [updateView, setUpdateView] = useState(false)

    const [tableState, setTableState] = useState({
        page: 1,
        pageSize: 10,
        search: '',
        sort: 'subjectName',
        order: 'asc'
    })

    const config = {
        excelExport: true,
        printButton: true,
        defaultSort: [{
            dataField: tableState?.sort || 'subjectName',
            order: tableState?.order || 'asc'
        }],
        defaultPageOptions: {
            page: tableState?.page || 1,
            sizePerPage: tableState?.pageSize || 10,
            search: tableState?.search || '',
        }
    }

    const getColumns = (showClassRoom = false) => {
        const columns = [
            {
                dataField: "grade",
                text: t('group.grade'),
                sort: true
            },
            {
                dataField: "subjectName",
                text: t('subject.title'),
                sort: true,
                formatter: (cell, row) => {
                    return row.subjectCode + ' - ' + row.subjectName
                },
            },
            {
                dataField: "groupName",
                text: t('manager.groups'),
                sort: true,
            },
            {
                dataField: "classes",
                text: t('group.title'),
                sort: true,
                formatter: (cell, row) => {
                    return <div className="pointer underline" onClick={() => {
                        setModalViewTitle(row?.groupName)
                        showStudents(row.id)
                    }}>{cell}</div>
                },
            },
            {
                dataField: "teacher",
                text: t('teacher_title'),
                sort: true
            },
            {
                dataField: "students",
                text: t('menu.student'),
                sort: false,
                formatter: (cell, row) => {
                    return <span onClick={() => {
                        setModalViewTitle(row?.groupName)
                        showStudents(row.id)
                    }} className="underline">{cell}</span>
                },
            }
        ];
        if (showClassRoom) {
            columns.unshift({
                dataField: "classRoomLink",
                text: "",
                sort: true,
                formatter: (cell, row) => {
                    if (cell) {
                        return <LinkIcon className='classroom-link' title='Google classroom' onClick={() => {
                            window.open(cell, '_blank')
                        }} />
                    } else {
                        return <LinkOffIcon className='classroom-linkoff' title='Google classroom' />
                    }
                }
            })
        }
        return columns;
    }

    const loadData = (params = {}) => {
        setLoading(true)
        fetchRequest(managerGroupIndex, 'POST', params)
            .then((res) => {
                if (res.success) {
                    setHasGoogleClassRoom(res?.googleClassRoom || false)
                    setTreeData(res?.grades || [])
                    setTotalCount(res?.totalCount || 0)
                    setList(res?.groups || [])
                    setSubjects(res?.subjects || [])
                    setClasses(res?.classes || [])
                } else {
                    message(res.message)
                }
                setInitLoaded(true)
                setLoading(false)
            })
            .catch(() => {
                message(t('err.error_occurred'))
                setLoading(false)
            })
    }

    useEffect(() => {
        loadData({
            school: selectedSchool?.id,
            grade: selectedTreeId
        })
    }, [])

    const closeViewModal = () => {
        setSelectedTableDataId(null)
        setShowStudentModal(false)
    };

    const closeClassroomModal = () => {
        setSelectedTableDataId(null)
        setShowClassroomLink(false)
    }

    const showStudents = (id) => {
        setSelectedTableDataId(id)
        setShowStudentModal(true)
    };

    const closeModal = (reloadData = false) => {
        setShowAddGroupModal(false)
        if (reloadData) {
            loadData({
                school: selectedSchool?.id,
                grade: selectedTreeId,
                page: tableState?.page,
                pageSize: tableState?.pageSize,
                search: tableState?.search,
                sort: tableState?.sort,
                order: tableState?.order
            })
        }
    };

    const closeEditModal = (reloadData = false) => {
        setShowEditModal(false)
        setSelectedTableDataId(null)

        if (reloadData) {
            loadData({
                school: selectedSchool?.id,
                grade: selectedTreeId,
                page: tableState?.page,
                pageSize: tableState?.pageSize,
                search: tableState?.search,
                sort: tableState?.sort,
                order: tableState?.order
            })
        }
    };

    const closeDeleteModal = () => {
        setSelectedTableDataId(null)
        setShowDeleteModal(false)
    };

    const submitClassroom = (params) => {
        setLoading(true)
        fetchRequest(managerGroupClassroomLink, 'POST', params)
            .then((res) => {
                if (res.success) {
                    const clone = [...list]
                    for (let c = 0; c < clone.length; c++) {
                        if (clone[c].id?.toString() === res?.id?.toString()) {
                            clone[c].classRoomLink = res?.classRoomLink;
                            break;
                        }
                    }
                    setList(clone)
                    setUpdateView(!updateView)
                    closeClassroomModal()
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

    const _onSubmitDelete = () => {
        let params = {
            school: selectedSchool?.id,
            group: selectedTableDataId,
            grade: selectedTreeId,
            page: tableState.page,
            pageSize: tableState.pageSize,
            search: tableState.search,
            order: tableState.order,
            sort: tableState.sort,
        };

        setLoading(true)
        fetchRequest(managerGroupDelete, 'POST', params)
            .then((res) => {
                if (res.success) {
                    setTotalCount(res?.totalCount || 0)
                    setList(res?.groups || [])

                    closeDeleteModal()
                } else {
                    message(res.message)
                }
                setLoading(false)
            })
            .catch(() => {
                message(t('err.error_occurred'))
                setLoading(false)
            })
    };

    const _contextMenuItemClick = (id, key) => {
        if (id && key) {
            setSelectedTableDataId(id)
            if (key === 'EDIT') {
                setShowEditModal(true)
            }
            if (key === 'DELETE') {
                setShowDeleteModal(true)
            }
            if (key === 'CLASSROOM') {
                setShowClassroomLink(true)
            }
        }
    }

    const handleTreeChange = (idArray) => {
        if (idArray && idArray.length > 0) {
            setSelectedTreeId(idArray[0])
            secureLocalStorage?.setItem(treeIndex, idArray[0]);
            loadData({
                school: selectedSchool?.id,
                grade: idArray[0],
                page: 1,
                pageSize: tableState?.pageSize,
                search: tableState?.search,
                sort: tableState?.sort,
                order: tableState?.order
            })
        }
    };

    // const _saveTreeSelectedId = (id, type) => {
    //     let sessionObj = sessionObj;
    //     let treeViews = existingTrees;

    //     let existingSessionTree = treeViews.find(treeObj => treeObj.key === this.treeViewKey);

    //     if (existingSessionTree) {
    //         existingSessionTree.value = id + '_' + type;
    //     } else {
    //         treeViews.push({
    //             key: this.treeViewKey,
    //             value: id + '_' + type,
    //         })
    //     }

    //     if (sessionObj) {
    //         sessionObj.treeViews = treeViews;
    //         sessionService.saveSession(sessionObj);
    //     }
    // }

    const onUserInteraction = state => {

        if (initLoaded) {
            let page = state?.page
            if (tableState?.search !== state?.search) {
                page = 1;
            }

            let params = {
                page: page,
                pageSize: state?.pageSize,
                search: state?.search,
                sort: state?.sort,
                order: state?.order
            }

            setTableState(params)
            loadData({
                school: selectedSchool?.id,
                grade: selectedTreeId,
                page: page,
                pageSize: state?.pageSize,
                search: state?.search,
                sort: state?.sort,
                order: state?.order
            })
        }
    }

    const getGradeSubjects = (subjectList = [], gradeId = null) => {
        let filterGradeIds = []
        if (gradeId) {
            filterGradeIds.push(gradeId)
        }
        const selectedGrade = treeData?.find(obj => obj.key === gradeId)
        if (selectedGrade && selectedGrade?.children?.length > 0) {
            filterGradeIds = filterGradeIds.concat(selectedGrade?.children?.map(obj => obj?.id))
        }
        return subjectList.filter(obj => {
            let exist = false
            if (filterGradeIds?.length > 0) {
                for (let g = 0; g < filterGradeIds?.length; g++) {
                    if (obj?.gradeIds.indexOf(filterGradeIds[g]) > -1) {
                        exist = true;
                        break;
                    }
                }
            }
            return exist
        })
    }

    const getGradeClasses = (classList = [], gradeId = null) => {
        // check if gradeId is parent gradeId
        let filterGradeIds = []
        if (gradeId) {
            filterGradeIds.push(gradeId)
        }
        const selectedGrade = treeData?.find(obj => obj.key === gradeId)
        if (selectedGrade && selectedGrade?.children?.length > 0) {
            filterGradeIds = filterGradeIds.concat(selectedGrade?.children?.map(obj => obj?.id))
        }
        return classList.filter(obj => filterGradeIds.indexOf(obj.gradeId) > -1)
    }

    return (
        <div className="m-grid__item m-grid__item--fluid m-wrapper">
            <HtmlHead title={title} description={description} />

            <div className="page-title-container mb-2">
                <Col md="7" className='p-0'>
                    <h1 className="mb-0 pb-0 display-4 relative">{title}</h1>
                    <BreadcrumbList items={breadcrumbs} />
                </Col>
            </div>
            <div className="m-content">
                <div className={"row myTimetable-IndexStyle"}>
                    <Col xl="2" xxl="2">
                        <div className="m-portlet br-12">
                            <div className="m-portlet__body">
                                {
                                    <TreeView
                                        treeData={treeData}
                                        selectedNodes={[selectedTreeId]}
                                        onSelect={handleTreeChange}
                                        defaultExpandAll
                                    />
                                }
                            </div>
                        </div>
                    </Col>
                    <Col xl="10" xxl="10">
                        {
                            selectedTreeId &&
                            <button
                                type="button"
                                onClick={() => setShowAddGroupModal(true)}
                                className="btn btn-sm m-btn--pill btn-info m-btn--uppercase d-inline-flex mb-3"
                            >
                                <AddCircleOutlineRoundedIcon className='MuiSvg-customSize' />
                                <span className='ml-2'>{t('common.register')}</span>
                            </button>
                        }
                        <div className="m-portlet br-12">
                            <div className="m-portlet__body">
                                <DTable
                                    remote
                                    config={config}
                                    data={list}
                                    columns={getColumns(hasGoogleClassRoom)}
                                    locale={locale}
                                    clickContextMenu
                                    contextMenus={getContextMenus(hasGoogleClassRoom)}
                                    currentPage={tableState?.page}
                                    onContextMenuItemClick={_contextMenuItemClick}
                                    onInteraction={onUserInteraction}
                                    totalDataSize={totalCount}
                                />
                            </div>
                        </div>
                    </Col>
                </div>
            </div>
            {
                loading &&
                <div className='loader-container'>
                    <svg className="splash-spinner" viewBox="0 0 50 50">
                        <circle className="path" cx="25" cy="25" r="20" fill="none" strokeWidth="5" />
                    </svg>
                </div>
            }
            {
                showAddGroupModal &&
                <AddGroup
                    onClose={closeModal}
                    subjectList={getGradeSubjects(subjects, selectedTreeId)}
                    classList={getGradeClasses(classes, selectedTreeId)}
                />
            }
            {
                showEditModal &&
                <EditModal
                    onClose={closeEditModal}
                    groupId={selectedTableDataId}
                />
            }
            {
                showStudentModal &&
                <ViewStudent
                    onClose={closeViewModal}
                    title={modalViewTitle}
                    groupId={selectedTableDataId}
                />
            }
            {
                showClassroomLink && <ClassRoomLink
                    onClose={closeClassroomModal}
                    onSubmit={submitClassroom}
                    oldLink={list?.find(obj => obj?.id === selectedTableDataId)?.classRoomLink}
                    groupId={selectedTableDataId} />
            }
            {
                showDeleteModal &&
                <DeleteModal
                    show={showDeleteModal}
                    onClose={closeDeleteModal}
                    onDelete={_onSubmitDelete}
                    locale={locale}
                    title={t('delete')}
                >
                    <div className="row">
                        <div className="col-md-12">
                            <div>
                                <p>{t('warning.delete_confirmation')}</p>
                                <p>{t('warning.delete_confirmation_description')}</p>
                            </div>
                        </div>
                    </div>
                </DeleteModal>
            }

        </div>
    )
}

export default index