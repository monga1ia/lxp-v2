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
    schoolSubjectIndex
} from 'utils/fetchRequest/Urls';

const MainGroup = () => {

    const locale = "mn"
    const { t } = useTranslation();
    const history = useHistory();
    const [loading, setLoading] = useState(false);

    const { selectedSchool } = useSelector(state => state.schoolData);

    const title = t('menu.teacher.subjects');
    const description = "E-learning";
    const breadcrumbs = [
        { to: "", text: "Home" },
        { to: "school/teacher", text: title }
    ];

    const [totalCount, setTotalCount] = useState(0);
    const [tableData, setTableData] = useState([]);
    const [treeData, setTreeData] = useState([])
    const [selectedTreeDataId, setSelectedTreeDataId] = useState(null)
    const [selectedCurriculumId, setSelectedCurriculumId] = useState(null)
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
            dataField: 'grade',
            text: t('subject.grade') || '',
            sort: true,
            align: "right",
        },
        {
            dataField: "teachers",
            text: t('subject.teacher') || "",
            sort: true,
            colType: 'array',
            colArrayField: 'name',
            formatter: (cell) => {
                return cell?.map((c, i) => (
                    <span key={i}
                        onClick={() => teacherNameClick(c?.id)}
                        className="underline">{c?.name}{cell?.length == i + 1 ? '' : ', '}</span>
                ))
            }
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

    const closeModal = () => {
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
            if (id?.startsWith('st_')) {
                const typeId = id?.split('st_')[1];

                const selectedCurriculum = treeData?.find(obj => {
                    const childFound = obj.subjectTypes.find(stObj => stObj.id === typeId);
                    return childFound ? obj : null
                })
                setSelectedCurriculumId(selectedCurriculum?.key)
                setSelectedSubjectTypeId(typeId)
            } else {
                setSelectedCurriculumId(id)
                setSelectedSubjectTypeId(null)
            }
        }
    }

    const handleAddSubject = () => {
        setShowAddSubjectModal(true)
    }

    const handleEditSubject = () => {
        console.log('edited')
    }

    const onUserInteraction = state => {
        console.log('onUserInteraction')
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
        console.log('delete')
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
                            onClick={() => setShowAddSubjectModal(true)}
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
                    id={selectedTableDataId}
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
                    data={selectedTableDataId}
                    onClose={closeModal}
                    onSubmit={handleAddSubject}
                />
            }
            {
                showEditSubjectModal &&
                <EditSubjectModal
                    data={selectedTableDataId}
                    onClose={closeModal}
                    onSubmit={handleEditSubject}
                />
            }
        </>
    );
};

export default MainGroup;
