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
import SubjectViewModal from './modals/subjectView'
import TeacherViewModal from './modals/teacherView'
import DeleteModal from 'utils/deleteModal';
import AddSubjectModal from './modals/addSubject';
import EditSubjectModal from './modals/editSubject';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone'
import PreviewTwoToneIcon from '@mui/icons-material/PreviewTwoTone'
import LockResetTwoToneIcon from '@mui/icons-material/LockResetTwoTone'
import BorderColorTwoToneIcon from '@mui/icons-material/BorderColorTwoTone'
import { Tab } from "semantic-ui-react";
import { useTranslation } from "react-i18next";
import { fetchRequest } from 'utils/fetchRequest';
import {
    schoolSubjectIndex,
    schoolSubjectDelete
} from 'utils/fetchRequest/Urls';

const MainGroup = () => {

    const locale = "mn"
    const { t } = useTranslation();
    const history = useHistory();
    const [loading, setLoading] = useState(false);

    const { selectedSchool } = useSelector(state => state.schoolData);

    const selectedSubjectTypeKey = 'selectedSubjectTypeKey_' + selectedSchool?.id

    const title = t('menu.teacher.subjects');
    const description = "E-learning";
    const breadcrumbs = [
        { to: "", text: "Home" },
        { to: "school/subjects", text: title }
    ];

    const [totalCount, setTotalCount] = useState(0);
    const [tableData, setTableData] = useState([]);
    const [treeData, setTreeData] = useState([])
    const [selectedTreeDataId, setSelectedTreeDataId] = useState(secureLocalStorage.getItem(selectedSubjectTypeKey) || null)

    const [selectedCurriculumId, setSelectedCurriculumId] = useState(null)
    const [selectedCurriculumName, setSelectedCurriculumName] = useState(null)
    const [selectedSubjectTypeId, setSelectedSubjectTypeId] = useState(null)

    const [selectedTableDataId, setSelectedTableDataId] = useState(null)

    const [showTeacherViewModal, setShowTeacherViewModal] = useState(false)
    const [showSubjectViewModal, setShowSubjectViewModal] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [showAddSubjectModal, setShowAddSubjectModal] = useState(false)
    const [showEditSubjectModal, setShowEditSubjectModal] = useState(false)
    // const [excelName, setExcelName] = useState('')

    // useEffect(()=> {
    //     setExcelName(secureLocalStorage.getItem('selectedSchool'))
    // }, [secureLocalStorage])
    // console.log(secureLocalStorage.getItem('selectedSchool'))

    const [tableState, setTableState] = useState({
        filter: {},
        page: 1,
        pageSize: 10,
        search: '',
        sort: 'firstName',
        order: 'asc'
    })

    const config = {
        excelExport: true,
        printButton: true,
        columnButton: true,
        excelFileName: `${secureLocalStorage.getItem('selectedSchool')?.text}-${t('subject.subjects')}`,
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

    const activeColumns = [
        {
            dataField: "code",
            text: t('subject.index') || "",
            sort: true,
        },
        {
            dataField: "name",
            text: t('subject.name') || "",
            sort: true
        },
        {
            dataField: 'credit',
            text: t('subject.credit') || '',
            sort: true,
            align: "right",
        },
        {
            dataField: 'grades',
            text: t('subject.grade') || '',
            sort: true
        },
        {
            dataField: "teachers",
            text: t('subject.teacher') || "",
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
    ]

    const [columns, setColumns] = useState(activeColumns)
    const [contextMenus, setContextMenus] = useState(activeContextMenus)

    const loadData = (params = {}) => {
        setLoading(true)
        setTableData([])
        setTotalCount(0)
        fetchRequest(schoolSubjectIndex, 'POST', params)
            .then((res) => {
                if (res?.success) {
                    const curriculums = res?.curriculums || []
                    for (let c = 0; c < curriculums.length; c++) {
                        const subjectTypes = [];
                        for (let st = 0; st < (curriculums[c]?.subjectTypes || [])?.length; st++) {
                            let cst = curriculums[c]?.subjectTypes[st]
                            subjectTypes.push({
                                key: 'st_' + cst?.id,
                                title: cst?.name
                            })
                        }
                        curriculums[c].key = curriculums[c].id;
                        curriculums[c].title = curriculums[c].name;
                        curriculums[c].children = subjectTypes;
                    }
                    setTreeData(curriculums)
                    setTotalCount(res?.totalCount)
                    setTableData(res?.subjects || [])
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

    useEffect(() => {
        if (treeData && treeData?.length > 0 && !selectedSubjectTypeId) {
            if (selectedTreeDataId) {
                if (selectedTreeDataId?.startsWith('st_')) {
                    const typeId = selectedTreeDataId?.split('st_')[1];
                    const selectedCurriculum = treeData?.find(obj => {
                        const childFound = obj.subjectTypes.find(stObj => stObj.id === typeId);
                        return childFound ? obj : null
                    })
                    setSelectedCurriculumId(selectedCurriculum?.key)
                    setSelectedCurriculumName(selectedCurriculum?.title)
                    setSelectedSubjectTypeId(typeId)
                } else {
                    setSelectedCurriculumId(selectedTreeDataId)
                    setSelectedCurriculumName(treeData.find(obj => obj?.id === selectedTreeDataId)?.name)
                    setSelectedSubjectTypeId(null)
                }
            }
        } 
    }, [treeData])

    useEffect(() => {
        loadData({
            school: selectedSchool?.id,
            curriculum: selectedCurriculumId,
            type: selectedSubjectTypeId,
            page: tableState?.page,
            pageSize: tableState?.pageSize,
            search: tableState?.search,
            sort: tableState?.sort,
            order: tableState?.order
        })
    }, [selectedCurriculumId, selectedSubjectTypeId])

    const onListRefresh = () => {
        loadData({
            school: selectedSchool?.id,
            curriculum: selectedCurriculumId,
            type: selectedSubjectTypeId,
            page: tableState?.page,
            pageSize: tableState?.pageSize,
            search: tableState?.search,
            sort: tableState?.sort,
            order: tableState?.order
        })
    }

    const closeModal = (isLoadData = false) => {
        if (isLoadData) {
            onListRefresh()
        }
        setShowAddSubjectModal(false)
        setShowEditSubjectModal(false)
        setShowDeleteModal(false)
        setShowTeacherViewModal(false)
        setShowSubjectViewModal(false)
        setSelectedTableDataId(null)
    }

    const handleTreeSelect = key => {
        if (key && key.length > 0) {
            let id = key[0]
            setSelectedTreeDataId(id)
            secureLocalStorage.setItem(selectedSubjectTypeKey, id)
            if (id?.startsWith('st_')) {
                const typeId = id?.split('st_')[1];

                const selectedCurriculum = treeData?.find(obj => {
                    const childFound = obj.subjectTypes.find(stObj => stObj.id === typeId);
                    return childFound ? obj : null
                })
                setSelectedCurriculumId(selectedCurriculum?.key)
                setSelectedCurriculumName(selectedCurriculum?.title)
                setSelectedSubjectTypeId(typeId)
            } else {
                setSelectedCurriculumId(id)
                setSelectedCurriculumName(treeData.find(obj => obj?.id === id)?.name)
                setSelectedSubjectTypeId(null)
            }
        }
    }

    const onSubmitSubject = (params) => {
        console.log('params', params)
    }

    const handleEditSubject = () => {
        console.log('edited')
    }

    const onUserInteraction = state => {
        let page = state?.page
        if (tableState?.search !== state?.search) {
            page = 1;
        }

        let newState = {
            page: page,
            pageSize: state?.pageSize,
            search: state?.search,
            sort: state?.sort,
            order: state?.order
        }

        setTableState(newState)
        loadData({
            school: selectedSchool?.id,
            curriculum: selectedCurriculumId,
            type: selectedSubjectTypeId,
            page: page,
            pageSize: state?.pageSize,
            search: state?.search,
            sort: state?.sort,
            order: state?.order
        })
    }

    const handleContextMenuClick = (id, key) => {
        if (id && key) {
            setSelectedTableDataId(id)
            if (key === 'view') {
                setShowSubjectViewModal(true)
            } else if (key === 'edit') {
                setShowEditSubjectModal(true)
            } else if (key === 'delete') {
                setShowDeleteModal(true)
            }
        }
    }

    // useEffect(() => {
    //     if (treeData.length && !selectedTreeDataId.length) {
    //         setSelectedTreeDataId(treeData?.[0]?.key)
    //     }
    // }, [treeData])

    const handleDelete = () => {
        setLoading(true)
        fetchRequest(schoolSubjectDelete, 'POST', {
            school: selectedSchool?.id,
            curriculum: selectedCurriculumId,
            type: selectedSubjectTypeId,
            subject: selectedTableDataId,
            page: tableState?.page,
            pageSize: tableState?.pageSize,
            search: tableState?.search,
            sort: tableState?.sort,
            order: tableState?.order
        })
            .then((res) => {
                if (res?.success) {
                    const curriculums = res?.curriculums || []
                    for (let c = 0; c < curriculums.length; c++) {
                        const subjectTypes = [];
                        for (let st = 0; st < (curriculums[c]?.subjectTypes || [])?.length; st++) {
                            let cst = curriculums[c]?.subjectTypes[st]
                            subjectTypes.push({
                                key: 'st_' + cst?.id,
                                title: cst?.name
                            })
                        }
                        curriculums[c].key = curriculums[c].id;
                        curriculums[c].title = curriculums[c].name;
                        curriculums[c].children = subjectTypes;
                    }
                    setTreeData(curriculums)
                    setTotalCount(res?.totalCount)
                    setTableData(res?.subjects || [])

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

    const teacherNameClick = (data, e) => {
        setShowTeacherViewModal(true)
        setSelectedTableDataId(data)
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
                        <button
                            onClick={() => {
                                if (selectedCurriculumId) {
                                    setShowAddSubjectModal(true)
                                } else {
                                    message(t('err.select_curriculum'))
                                }
                            }}
                            className='btn btn-sm m-btn--pill btn-info m-btn--uppercase d-inline-flex mb-3'
                        >
                            <ControlPointIcon style={{ color: "white", marginRight: "4px" }} />
                            {t('action.register')}
                        </button>
                        <div className='m-portlet tab br-12'>
                            <div className=''>
                                <div className='m-portlet__body'>
                                    <DTable
                                        remote
                                        config={config}
                                        locale={locale}
                                        data={tableData}
                                        columns={columns}
                                        currentPage={tableState?.page || 1}
                                        clickContextMenu
                                        contextMenus={contextMenus}
                                        onContextMenuItemClick={handleContextMenuClick}
                                        onInteraction={onUserInteraction}
                                        totalDataSize={totalCount}
                                    />
                                </div>
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
                showSubjectViewModal && selectedTableDataId &&
                <SubjectViewModal
                    subject={tableData?.find(obj => obj.id === selectedTableDataId)}
                    onClose={closeModal}
                />
            }
            {
                showTeacherViewModal && selectedTableDataId &&
                <TeacherViewModal
                    id={selectedTableDataId}
                    onClose={closeModal}
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
                showAddSubjectModal &&
                <AddSubjectModal
                    curriculumId={selectedCurriculumId}
                    curriculumName={selectedCurriculumName}
                    onClose={closeModal}
                    onSubmit={onSubmitSubject}
                />
            }
            {
                showEditSubjectModal &&
                <EditSubjectModal
                    curriculumId={selectedCurriculumId}
                    curriculumName={selectedCurriculumName}
                    subjectId={selectedTableDataId}
                    onClose={closeModal}
                    onSubmit={handleEditSubject}
                />
            }
        </>
    );
};

export default MainGroup;
