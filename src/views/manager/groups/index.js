import React, { useEffect, useState } from "react";
import { connect } from 'react-redux';
import { translations } from "utils/translations";
// import * as actions from "Actions/action";
import { Checkbox, Dropdown, Modal, Tab } from 'semantic-ui-react'
import DTable from "modules/DataTable/DTable";
import TreeView from "modules/TreeView";
import { sessionService } from 'redux-react-session';
import { Row, Col, Button } from "react-bootstrap";
import HtmlHead from 'components/html-head/HtmlHead';
import BreadcrumbList from 'components/breadcrumb-list/BreadcrumbList';
import message from "modules/message";
import BorderColorTwoToneIcon from '@mui/icons-material/BorderColorTwoTone';
import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import CloseIcon from '@mui/icons-material/Close';
import secureLocalStorage from "react-secure-storage";
import { useTranslation } from "react-i18next";

import ViewStudent from "./modals/view";
import AddGroup from "./modals/addGroup";
import EditModal from "./modals/editModal";
import DeleteModal from 'utils/deleteModal';


const locale = secureLocalStorage?.getItem('selectedLang') || 'mn'

const index = () => {





    // index нь class, props байсан, back-аас data орж ирж байгаа нь шал өөр юм бн. эхлээд editModal ороод үзээрэй

    // LXP v1 location: lxp\assets\src\Components\manager\group




    
    const treeIndex = 'manager_group_tree_index';
    const { t } = useTranslation()

    const title = t('omr_exam_template.subject_group');
    const description = "E-learning";
    const breadcrumbs = [
        { to: "", text: "Home" },
        { to: "school/teacher", text: title }
    ];

    const [editSubjectGroup, setEditSubjectGroup] = useState([''])
    const [selectedTableDataId, setSelectedTableDataId] = useState(null)
    const [showLoader, setShowLoader] = useState(false)

    const [showModalError, setShowModalError] = useState(false)
    const [showStudentModal, setShowStudentModal] = useState(false)
    const [treeData, setTreeData] = useState([{
        id: "2116",
        gradeId: 2,
        name: "Бага анги",
        ordering: 1,
        children: [
            {
                id: "2117",
                gradeId: 5,
                name: "1-р анги",
                ordering: 1,
                children: [],
                key: "2117",
                title: "1-р анги"
            },
            {
                id: "2118",
                gradeId: 6,
                name: "2-р анги",
                ordering: 2,
                children: [],
                key: "2118",
                title: "2-р анги"
            },
        ],
        key: "2116",
        title: "Бага анги"
    }])
    const [sessionObj, setSessionObj] = useState({})
    const [existingTrees, setExistingTrees] = useState([])
    const [selectedTreeId, setSelectedTreeId] = useState(secureLocalStorage?.getItem(treeIndex) || [])
    const [treeSelectedGradeId, setTreeSelectedGradeId] = useState(null)
    const [subjects, setSubjects] = useState([])
    // useState([
    //     {
    //         text: "АХЛ0801 - Англи хэл",
    //         value: 66923,
    //         gradeIds: [
    //             "2775"
    //         ],
    //         isAll: false
    //     },
    //     {
    //         text: "АХЛ0901 - Англи хэл",
    //         value: 66941,
    //         gradeIds: [
    //             "2784"
    //         ],
    //         isAll: true
    //     },
    //     {
    //         text: "БИО1001 - Биологи",
    //         value: 66960,
    //         gradeIds: [],
    //         isAll: false
    //     }
    // ])
    const [classes, setClasses] = useState([
        {
            id: "6978",
            class: "2A",
            teacherId: "318",
            teacherFirstName: "Baatar",
            teacherLastName: "Bayarbat",
            mdGradeId: 6,
            parentGradeCode: "PRIMARY",
            scoreType: "I-VIII",
            shiftId: 68,
            shift: "1-р ээлж",
            room: "200",
            roomNumber: "200",
            gradeId: "2776",
            gradeCode: "2",
            gradeName: "2-р анги",
            value: "6978",
            text: "2A",
            esisGroupId: null,
            esisAcademicLevel: null,
            esisAcademicLevelName: null,
            esisProgramOfStudyId: null,
            esisProgramStageId: null,
            esisStudentGroupName: null,
            esisTeacherId: null,
            esisTeacherName: null,
            scoreTypeId: 77,
            scoreTypeName: "I-VIII",
            studentCount: 20
        },
    ])

    const [groupSubjectTeachers, setgroupSubjectTeachers] = useState([])
    const [selectedGroupTeacherId, setSelectedGroupTeacherId] = useState(null)
    const [list, setList] = useState([
        {
            id: "129579",
            grade: "1-р анги",
            subjectCode: "PHY0101",
            subjectName: "Physics",
            subject: "<b>PHY0101 - Physics</b><br/>Physics | 1А<br/> <span class=\"underline\">1А</span>",
            groupName: "Physics | 1А",
            classes: "1А",
            names: "Physics | 1А<br/> <span class=\"underline\">1А</span>",
            teacher: "0000 - Erdenejargal",
            students: 3
        },
        {
            id: "71574",
            grade: "5-р анги",
            subjectCode: "АХ05001",
            subjectName: "Англи хэл",
            subject: "<b>АХ05001 - Англи хэл</b><br/>Англи хэл | 5А<br/> <span class=\"underline\">5А</span>",
            groupName: "Англи хэл | 5А",
            classes: "5А",
            names: "Англи хэл | 5А<br/> <span class=\"underline\">5А</span>",
            teacher: "Т1111 - Elbegzaya",
            students: 36
        },
        {
            id: "90652",
            grade: "5-р анги",
            subjectCode: "АХЛ0501",
            subjectName: "Англи хэл",
            subject: "<b>АХЛ0501 - Англи хэл</b><br/>Англи хэл | Buyanbadrakh<br/> <span class=\"underline\">5А</span>",
            groupName: "Англи хэл | Buyanbadrakh",
            classes: "5А",
            names: "Англи хэл | Buyanbadrakh<br/> <span class=\"underline\">5А</span>",
            teacher: "00001 - Buyanbadrakh",
            students: 1
        },
        {
            id: "76328",
            grade: "2-р анги",
            subjectCode: "АХ0201",
            subjectName: "Англи хэл",
            subject: "<b>АХ0201 - Англи хэл</b><br/>Англи хэл 2<br/> <span class=\"underline\">2A</span>",
            groupName: "Англи хэл 2",
            classes: "2A",
            names: "Англи хэл 2<br/> <span class=\"underline\">2A</span>",
            teacher: "N0010 - Altanshagai",
            students: 2
        },
    ])
    const [showAddGroupModal, setShowAddGroupModal] = useState(false)
    const [modalTitle, setModalTitle] = useState(null)
    const [newSubjectGroupRow, setNewSubjectGroupRow] = useState([{
        class: null,
        allStudents: [],
        group_student: []
    }])
    const [selectedGroupSubjectId, setSelectedGroupSubjectId] = useState(null)
    const [selectedGroupName, setSelectedGroupName] = useState('')
    const contextMenus = [
        {
            key: 'EDIT',
            icon: <BorderColorTwoToneIcon sx={{ fontSize: '2rem !important', color: '#ff5b1d' }} />,
            title: translations(locale).edit || ""
        },
        {
            key: 'DELETE',
            icon: <DeleteTwoToneIcon sx={{ fontSize: '2rem !important', color: '#ff5b1d' }} />,
            title: translations(locale).delete || ""
        },
    ]
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [deleteGroupId, setDeleteGroupId] = useState(null)
    const [viewStudentLists, setViewStudentLists] = useState([])
    const [modalViewTitle, setModalViewTitle] = useState(null)
    const [showEditModal, setShowEditModal] = useState(false)
    const [editGroupIsClass, setEditGroupIsClass] = useState(false)
    const [modalTabIndex, setModalTabIndex] = useState(0)
    const [tableState, setTableState] = useState({
        page: 1,
        pageSize: 10,
        search: '',
        sort: 'subjectName',
        order: 'asc'
    })
    const [tableConfig, setTableConfig] = useState({
        excelExport: true,
        printButton: true,
        defaultSort: [{
            dataField: 'subjectName',
            order: 'asc'
        }],
        defaultPageOptions: {
            page: 1,
            sizePerPage: 10,
            search: '',
        }
    })
    const [editGroupTeacherId, setEditGroupTeacherId] = useState(null)
    const [isSaved, setIsSaved] = useState(false)
    const [totalCount, setTotalCount] = useState(0)

    const treeViewKey = 'my_subject_index';
    
    // const newSubjectRemoveRow = this.newSubjectRemoveRow.bind(this);
    // this.newSubjectGroupNameChange = this.newSubjectGroupNameChange.bind(this);
    // this._contextMenuItemClick = this._contextMenuItemClick.bind(this);
    // this._onCustomSort = this._onCustomSort.bind(this);
    // this.handleTreeChange = this.handleTreeChange.bind(this);
    // this.setColumns(locale);


    const tableColumns = [
        {
            dataField: "grade",
            text: translations(locale).grade || "",
            sort: true
        },
        {
            dataField: "subjectName",
            text: translations(locale).timetable.subject || "",
            sort: true,
            formatter: (cell, row) => {
                return row.subjectCode + ' - ' + row.subjectName
            },
        },
        {
            dataField: "groupName",
            text: translations(locale).omr_exam_template.subject_group || "",
            sort: true,
        },
        {
            dataField: "classes",
            text: translations(locale).group.title || "",
            sort: true,
            formatter: (cell, row) => {
                return <div className="pointer underline" onClick={() => showStudents(row.id)}>{cell}</div>
            },
        },
        {
            dataField: "teacher",
            text: translations(locale).timetable.teacher || "",
            sort: true
        },
        {
            dataField: "students",
            text: translations(locale).students || "",
            sort: false,
            formatter: (cell, row) => {
                return <span onClick={() => showStudents(row.id)} className="underline">{cell}</span>
            },
        }
    ];

    // useEffect(() => {
    //     setNewSubjectGroupRow(subjects)
    // },[])

    const closeViewModal = () => {
        setShowStudentModal(false)
        setViewStudentLists([])
    };

    const showStudents = (id) => {
        setSelectedTableDataId(id)
        setShowStudentModal(true)
    };

    const closeModal = () => {
        setShowAddGroupModal(false)
        setModalTitle(null)
        setNewSubjectGroupRow([{
            class: null,
            allStudents: [],
            group_student: []
        }])
        setSelectedGroupSubjectId(null)
        setSelectedGroupTeacherId(null)
        setSelectedGroupName(null)

        if (isSaved) {
            console.log('isSaved')
            // this.initActionHandler();
        }
    };

    const closeEditModal = () => {
        setShowEditModal(false)
        // this.setState({
        //     editModal: false,
        //     selectedGroupName: '',
        //     showLoader: false,
        //     selectedGroupSubjectId: null,
        //     editGroupTeacherId: null,
        //     editGroupTeachers: [],
        //     newSubjectGroupRow: [{
        //         class: null,
        //         allStudents: [],
        //         group_student: []
        //     }],
        //     // modalTabIndex: 0,
        // })

        // this.initActionHandler();
    };

    const closeDeleteModal = () => {
        setShowDeleteModal(false)
    };
    
    const initActionHandler = () => {
        // let that = this;
        // sessionService.loadSession().then(session => {
        //     let sessionObj = session;
        //     let existingTrees = sessionObj.treeViews || [];

        //     let tree = existingTrees.find(treeObj => treeObj.key === this.treeViewKey);

        //     let selectedTreeId = [],
        //         treeSelectedGradeId = null,
        //         treeSelectedType = null;

        //     if (tree) {
        //         let selectedTreeValues = tree.value.split('_');
        //         treeSelectedGradeId = selectedTreeValues.length > 0 ? selectedTreeValues[0] : null;
        //         treeSelectedType = selectedTreeValues.length > 0 ? selectedTreeValues[1] : null;
        //     }

        //     if (treeSelectedGradeId) {
        //         selectedTreeId[0] = parseInt(treeSelectedGradeId);
        //     }

        //     if (selectedTreeId.length > 0 && treeSelectedGradeId) {
        //         setState({
        //             sessionObj,
        //             existingTrees,
        //             selectedTreeId,
        //             treeSelectedGradeId,
        //             fetchInit: true,
        //             showLoader: true,
        //         });

        

        //         props.fetchMySchoolTimetableInit(params);
        //     } else {
        //         setState({
        //             sessionObj,
        //             existingTrees,
        //             fetchInit: true,
        //             showLoader: true,
        //         });

        //         props.fetchMySchoolTimetableInit();
        //     }

        if(selectedTreeId){
            let params = {
                grade: selectedTreeId
            };

            this.setState({
                fetchInit: true,
                showLoader: true
            });
            this.props.fetchMySchoolTimetableInit(params);
        } else {
            this.setState({
                fetchInit: true,
                showLoader: true
            });
            this.props.fetchMySchoolTimetableInit();
        }
    }

    const _onSubmit = () => {
        if (modalTabIndex === 0) {
            let clone = newSubjectRow;
            let hasError = false;
            let subjectIds = [], teacherIds = [], classIds = [];
            for (let i = 0; i < clone.length; i++) {
                let rowObj = clone[i];
                if (rowObj.subject && rowObj.teacher && rowObj.classes.length > 0) {
                    subjectIds.push(rowObj.subject)
                    teacherIds.push(rowObj.teacher)
                    classIds.push(rowObj.classes.join())
                } else {
                    hasError = true;
                    break;
                }
            }
            if (hasError) {
                message(translations(locale).err.fill_all_fields)
                setShowModalError(true)
            } else {

                const details = clone.map(el => ({
                    subject: el.subject,
                    teacher: el.teacher,
                    classes: el.classes,
                }))

                const params = {
                    details: JSON.stringify(details),
                    type: 'all',
                    submit: 1,
                    grade: selectedTreeId[0],
                    page: tableState.page,
                    pageSize: tableState.pageSize,
                    search: tableState.search,
                    order: tableState.order,
                    sort: tableState.sort,
                }
                console.log(params)
                // setShowModalError(false)
                // setShowLoader(true)
                // setIsSaved(true)
                // this.props.fetchMySchoolTimetableSubmit(params)
            }
        } else {
            let hasError = false;
            if (!selectedGroupSubjectId) {
                hasError = true;
            }

            if (!selectedGroupTeacherId) {
                hasError = true;
            }
            if (selectedGroupName?.length === 0) {
                hasError = true;
            }

            let clone = newSubjectGroupRow;
            for (let i = 0; i < clone.length; i++) {
                let groupObj = clone[i];
                if (!groupObj['class'] || !groupObj['group_student']?.length) {
                    hasError = true;
                    break;
                }
            }

            if (hasError) {
                message(translations(locale).err.fill_all_fields)
                setShowModalError(true)
            } else {

                const details = newSubjectGroupRow.map(el => ({
                    class: el.class,
                    students: el.group_student,
                }))

                let bodyParams = {
                    subject: selectedGroupSubjectId,
                    teacher: selectedGroupTeacherId,
                    name: selectedGroupName,
                    type: 'group',
                    details: JSON.stringify(details),
                    grade: selectedTreeId[0]
                }
                setShowModalError(false)
                setIsSaved(true)

                // this.setState({
                //     showModalError: false,
                //     fetchGroupSubmit: true,
                //     showLoader: true,
                //     isSaved: true
                // })

                // this.props.fetchMySchoolTimetableSubmit(bodyParams)
            }
        }
    }

    const _onEditSubmit = () => {
        let bodyParams;

        if (!selectedGroupName) {
            message(translations(locale).insert_name)
        } else if (!selectedGroupSubjectId) {
            message(translations(locale).select_subject)
        } else if (!editGroupTeacherId) {
            message(translations(locale).err.select_teacher)
        } else {
            if (editGroupIsClass) {

                bodyParams = {
                    'name': selectedGroupName,
                    'group': editSubjectGroup ? editSubjectGroup.id : null,
                    'grade': selectedTreeId[0],
                    'subject': selectedGroupSubjectId,
                    'teacher': editGroupTeacherId,
                    'type': 'all',
                    'submit': 1,
                    'page': tableState.page,
                    'pageSize': tableState.pageSize,
                    'search': tableState.search,
                    'sort': tableState.sort,
                    'order': tableState.order
                };

                // this.setState({
                //     fetchEditSubject: true,
                //     fetchEditSubjectSubmit: true,
                //     showLoader: true,
                // });
            } else {
                let hasError = false
                let newSubjectGroupRow = newSubjectGroupRow;
                for (let i = 0; i < newSubjectGroupRow.length; i++) {
                    let groupObj = newSubjectGroupRow[i];
                    if (!groupObj['class'] || !groupObj['group_student']?.length) {
                        hasError = true;
                        break;
                    }
                }


                if (hasError) {
                    setShowModalError(true)
                    return message(translations(locale).err.fill_all_fields)
                } else {
                    const details = newSubjectGroupRow.map(el => ({
                        class: el.class,
                        students: el.group_student,
                    }))

                    bodyParams = {
                        'details': JSON.stringify(details),
                        'group': editSubjectGroup ? editSubjectGroup.id : null,
                        'name': selectedGroupName,
                        'grade': selectedTreeId[0],
                        'subject': selectedGroupSubjectId,
                        'teacher': editGroupTeacherId,
                        'submit': 1,
                        'type': 'group',
                        'page': tableState.page,
                        'pageSize': tableState.pageSize,
                        'search': tableState.search,
                        'sort': tableState.sort,
                        'order': tableState.order
                    };
                    setShowModalError(false)

                    // this.setState({
                    //     showModalError: false,
                    //     fetchEditSubject: true,
                    //     fetchEditSubjectSubmit: true,
                    //     showLoader: true,
                    // });
                }
            }

            // this.props.fetchMyTimetableEditSubjectSubmit(bodyParams);
        }
    }

    const _onSubmitDelete = () => {
        let params = {
            group: deleteGroupId,
            grade: selectedTreeId[0],
            page: tableState.page,
            pageSize: tableState.pageSize,
            search: tableState.search,
            order: tableState.order,
            sort: tableState.sort,
        };
        // this.setState({
        //     fetchDeleteGroup: true
        // });
        // this.props.fetchMyTimetableDeleteSubject(params);
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
        }
    }

    const handleTreeChange = (idArray) => {
        if (idArray && idArray.length > 0) {
            let clone = {
                page: 1,
                pageSize: tableState.pageSize,
                search: tableState.search,
                order: tableState.order,
                sort: tableState.sort,
            }

            let params = {
                grade: idArray[0],
                page: 1,
                pageSize: tableState.pageSize,
                search: tableState.search,
                order: tableState.order,
                sort: tableState.sort,
            };
                        
            setTableState(clone)
            setSelectedTreeId(idArray)

            secureLocalStorage?.setItem(treeIndex, idArray);
            // this.props.fetchMySchoolTimetableInit(params)
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

    const handleInteraction = state => {
        if(state.page){
            if(state.search){
                let tableStateClone = {
                    page: 1,
                    pageSize: state.pageSize,
                    search: state.search,
                    sort: state.sort,
                    order: state.order
                }
                setTableState(tableStateClone)
        
                let params = {
                    grade: selectedTreeId,
                    page: 1,
                    pageSize: state.pageSize,
                    search: state.search,
                    sort: state.sort,
                    order: state.order,
                };
        
                // this.props.fetchMySchoolTimetableInit(params);
            } else {
                setTableState(state)

                let params = {
                    grade: selectedTreeId,
                    page: state.page,
                    pageSize: state.pageSize,
                    search: state.search,
                    sort: state.sort,
                    order: state.order,
                };
        
                // this.props.fetchMySchoolTimetableInit(params);
            }
        }
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
                                        selectedNodes={selectedTreeId}
                                        onSelect={handleTreeChange}
                                        defaultExpandAll
                                    />
                                }
                            </div>
                        </div>
                    </Col>
                    <Col xl="10" xxl="10">
                        {
                            // selectedTreeId.length > 0 &&
                            <button
                                type="button"
                                onClick={() => setShowAddGroupModal(true)}
                                className="btn btn-sm m-btn--pill btn-info m-btn--uppercase d-inline-flex mb-3"
                            >
                                <AddCircleOutlineRoundedIcon className='MuiSvg-customSize'/>
                                <span className='ml-2'>{translations(locale).add || null}</span>
                            </button>
                        }
                        <div className="m-portlet br-12">
                            <div className="m-portlet__body">
                                <DTable
                                    remote
                                    config={tableConfig}
                                    data={list}
                                    columns={tableColumns}
                                    locale={locale}
                                    clickContextMenu
                                    contextMenus={contextMenus}
                                    onContextMenuItemClick={_contextMenuItemClick}
                                    onInteraction={handleInteraction}
                                    totalDataSize={totalCount}
                                />
                            </div>
                        </div>
                    </Col>
                </div>
            </div>
            {
                showLoader &&
                <div>
                    <div className="blockUI blockOverlay">
                    </div>
                    <div className="blockUI blockMsg blockPage">
                        <div className="m-loader m-loader--brand m-loader--lg">
                        </div>
                    </div>
                </div>
            }
            { 
                showAddGroupModal &&        
                <AddGroup
                    onClose={closeModal}
                    onSubmit={_onSubmit}
                    modalTabI={(data) => setModalTabIndex(data)}
                    data={{ newSubjectGroupRow, showModalError, selectedTreeId, classes}}
                />
            }
            {
                showEditModal &&
                <EditModal
                    onClose={closeEditModal}
                    onSubmit={_onEditSubmit}
                    selectedTableId={selectedTableDataId}
                    data={{newSubjectGroupRow, editGroupIsClass}}
                />
            }
            {
                showStudentModal &&
                <ViewStudent
                    onClose={closeViewModal}
                    title={modalViewTitle}
                    selectedId={selectedTableDataId}
                />
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
                                <p>{translations(locale).delete_confirmation || null}</p>
                                <p>{translations(locale).delete_confirmation_description || null}</p>
                            </div>
                        </div>
                    </div>
                </DeleteModal>
            }

        </div>
    )
}

export default index