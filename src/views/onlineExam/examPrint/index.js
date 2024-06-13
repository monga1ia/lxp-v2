import React, { useState, useEffect } from "react";
import { Row, Col, Card, Button } from "react-bootstrap";
import { useSelector } from "react-redux";
import HtmlHead from "components/html-head/HtmlHead";
import BreadcrumbList from "components/breadcrumb-list/BreadcrumbList";
import Select from "modules/Form/Select";
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import { Link, useHistory } from "react-router-dom";
import DTable from "modules/DataTable/DTable";
import { useTranslation } from "react-i18next";
import FilterIcon from "cs-line-icons/custom/FilterIcon";
import ViewIcon from "cs-line-icons/custom/ViewIcon";
import { Printer } from 'lucide-react';
import TrashIcon from "cs-line-icons/custom/Trash";
import showMessage from "modules/message";
import { ROOT_URL, fetchRequest } from "utils/fetchRequest";
import { toDropdownData } from "utils/utils";
import { examTemplateGradeSubject, examPrintIndex, examDelete, examCheckCorrectAnswer, examGetCorrectAnswer, examCheckExamPdf, examGetExamPdf } from 'utils/fetchRequest/Urls';
import DeleteModal from "modules/DeleteModal";
import secureLocalStorage from 'react-secure-storage'
import SeeIcon from "cs-line-icons/custom/SeeIcon";
import Print from './components/modal/print';

const Exam = () => {
    const { t } = useTranslation();
    const history = useHistory();

    const tableIndex = ['exam_print_table_index']
    const gradeIndex = ['exam_print_grade_index']
    const subjectIndex = ['exam_print_subject_index']

    const { selectedSchool } = useSelector(state => state.schoolData);

    const [tableData, setTableData] = useState([])
    const [gradeOptions, setGradeOptions] = useState([])
    const [statusOptions, setStatusOptions] = useState([])
    const [subjectOptions, setSubjectOptions] = useState([])
    const [selectedGradeId, setSelectedGradeId] = useState(secureLocalStorage.getItem(gradeIndex) || null);
    const [selectedSubjectId, setSelectedSubjectId] = useState(secureLocalStorage.getItem(subjectIndex) || null)
    const [selectedStatusId, setSelectedStatusId] = useState(null)
    const [selectedStartDate, setSelectedStartDate] = useState(null)
    const [selectedEndDate, setSelectedEndDate] = useState(null)
    const [selectedId, setSelectedId] = useState(null)
    const [selectedRow, setSelectedRow] = useState(null)
    const [examData, setExamData] = useState(null)
    const [totalCount, setTotalCount] = useState(0)

    const [loading, setLoading] = useState(false)
    const [showChangeTimeModal, setShowChangeTimeModal] = useState(false)
    const [showInactiveModal, setShowInactiveModal] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [showPrintModal, setShowPrintModal] = useState(false)
    const [initLoader, setInitLoader] = useState(true)
    const [isCorrect, setIsCorrect] = useState(false)
    const [pageNumber, setPageNumber] = useState(1)
    const [questions, setQuestions] = useState([])
    const [charArray, setCharArray] = useState([])

    const title = t('onlineExam.examPrint');
    const description = "";

    const [tableState, setTableState] = useState(JSON.parse(secureLocalStorage.getItem(tableIndex)) ||
    {
        page: 1,
        pageSize: 10,
        search: '',
        sort: 'firstName',
        order: 'asc'
    }
    )

    const breadcrumbs = [
        { to: "", text: "Home" },
        { to: "online-exam/print-exam", text: title },
    ];

    const config = {
        showPagination: true,
        showFilter: true,
        showAllData: false,
        tableMarginLess: true,
        excelExport: true,
        excelFileName: title || '',
        defaultSort: [{
            dataField: tableState?.sort || 'createdDate',
            order: tableState?.order || 'desc'
        }],
        defaultPageOptions: {
            page: tableState?.page || 1,
            sizePerPage: tableState?.pageSize || 10,
            search: tableState?.search || '',
        }
    };

    const contextMenus = [
        {
            key: "view",
            icon: <SeeIcon />,
            style: {position: 'relative', left: 3},
            title: t('common.see'),
        },
        {
            key: "print",
            icon: <Printer color="#ff5b1d" />,
            title: t('common.print'),
        },
        {
            key: "delete",
            icon: <TrashIcon />,
            title: t("action.delete"),
        },
        {
            key: "correct",
            icon: <ViewIcon />,
            title: t('onlineExam.correctAnswer'),
        }
    ];

    const init = (params) => {
        setLoading(true)
        fetchRequest(examTemplateGradeSubject, 'POST', params)
            .then((res) => {
                if (res.success) {
                    const { grades = [], subjects = [] } = res;

                    if (params.grade) {
                        if(subjects && subjects.length > 0){
                            for(let i = 0; i < subjects.length; i++){
                                subjects[i]['text'] = subjects[i]['text'] + ' (' + subjects[i]['code'] + ')'
                            }
                        }

                        setSubjectOptions(subjects);

                        if(grades && grades.length > 0){
                            setGradeOptions(grades);    
                        }
                    } else {
                        setGradeOptions(grades);
                    }
                } else {
                    showMessage(res.message)
                }
                setLoading(false)
            })
            .catch(() => {
                showMessage(t('errorMessage.title'));
                setLoading(false)
            })
    }

    const getList = (params) => {
        setLoading(true)
        fetchRequest(examPrintIndex, 'POST', params)
            .then((res) => {
                if (res.success) {
                    const { exams = [], statuses = [], totalCount = 0 } = res;

                    setTableData(exams?.map(obj => {
                        if(obj.startDate){
                            obj.startDate = obj.startDate.date?.split('.')[0]
                        }

                        if(obj.endDate){
                            obj.endDate = obj.endDate.date?.split('.')[0]
                        }

                        return {
                            ...obj,
                        }
                    }))
                    setTotalCount(totalCount);
                    setStatusOptions(toDropdownData(statuses, 'id', 'name'));
                } else {
                    showMessage(res.message)
                }
                setLoading(false)
            })
            .catch(() => {
                showMessage(t('errorMessage.title'));
                setLoading(false)
            })
    }

    useEffect(() => {
        let params = {
            school: selectedSchool.id,
            grade: selectedGradeId || '',
            isGradeFlat: 1
        }

        let listParams = {
            school: selectedSchool.id,
            grade: selectedGradeId || '',
            page: tableState.page,
            pageSize: tableState.pageSize,
            search: tableState.search,
            sort: tableState.sort,
            order: tableState.order,
            subject: selectedSubjectId,
            status: selectedStatusId,
            start: selectedStartDate,
            end: selectedEndDate
        }

        setInitLoader(false)
        init(params);
        getList(listParams)
    }, []);

    const onContextMenuItemClick = (id, key, row) => {
        if (key === "view") {
            history.push({
                pathname: '/online-exam/exam-print-edit',
                state: {
                    id
                }
            })
        } else if (key === "delete") {
            setShowDeleteModal(true)
        } else if (key === 'correct') {
            let params = {
                school: selectedSchool.id,
                exam: id,
            }

            setLoading(true)
            fetchRequest(examCheckCorrectAnswer, 'GET', params)
                .then((res) => {
                    if (res.success) {
                        setQuestions(res.questions || [])
                        setCharArray(res.charArray || [])
                        setExamData(res.examData || null)
                        setIsCorrect(true)
                        setShowPrintModal(true)
                        // window.open(ROOT_URL + examGetCorrectAnswer + '?school=' + params.school + '&exam=' + params.exam, "_blank", "noreferrer");
                    } else {
                        showMessage(res.message)
                    }
                    setLoading(false)
                })
                .catch(() => {
                    showMessage(t('errorMessage.title'));
                    setLoading(false)
                })
        } else if (key === "print") {
            let params = {
                school: selectedSchool.id,
                exam: id,
            }

            setLoading(true)
            fetchRequest(examCheckExamPdf, 'POST', params)
                .then((res) => {
                    if (res.success) {
                        setQuestions(res.questions || [])
                        setCharArray(res.charArray || [])
                        setExamData(res.examData || null)
                        setIsCorrect(false)
                        setShowPrintModal(true)
                    } else {
                        showMessage(res.message)
                    }
                    setLoading(false)
                })
                .catch(() => {
                    showMessage(t('errorMessage.title'));
                    setLoading(false)
                })
        }

        setSelectedId(id)
    }

    const columns = [
        {
            dataField: "gradeName",
            text: t("curriculum.grade"),
            sort: true,
        },
        {
            dataField: "subjectName",
            text: t("menu.curriculumSubject"),
            sort: true,
        },
        {
            dataField: "name",
            text: t("menu.examName"),
            sort: true,
            formatter: (cell) => {
                return (
                    <div
                        style={{
                            color: "#4037D7",
                            textDecorationLine: "underline",
                            cursor: "pointer",
                        }}
                    >
                        {cell}
                    </div>
                );
            },
        },
        {
            dataField: "studentCount",
            text: t("common.students"),
            sort: true,
            formatter: (cell) => {
                return <div className="text-end">{cell}</div>;
            },
        },
        {
            dataField: "createdUser",
            text: t("common.createdUser"),
            sort: true,
        },
        {
            dataField: "createdDate",
            text: t("common.createdDate"),
            sort: true,
            formatter: (cell) => cell?.date?.split('.')[0]
        },
    ];

    const gradeDropdownChange = (value) => {
        setSelectedGradeId(value)
        setSelectedSubjectId(null)
        secureLocalStorage.setItem(gradeIndex, value);

        let params = {
            school: selectedSchool.id,
            grade: value,
            isGradeFlat: 1
        }

        let listParams = {
            school: selectedSchool.id,
            grade: value,
        }

        init(params);
        getList(listParams)
    }

    const subjectDropdownChange = (value) => {
        setSelectedSubjectId(value)
        secureLocalStorage.setItem(subjectIndex, value);
    }

    const handleReset = () => {
        setSelectedGradeId(null)
        setSelectedSubjectId([])
        setSelectedStatusId([])
        setSelectedStartDate(null)
        setSelectedEndDate(null)
    }

    const searchDataTable = () => {
        let params = {
            school: selectedSchool.id,
            grade: selectedGradeId,
            subject: selectedSubjectId,
            status: selectedStatusId,
            start: selectedStartDate,
            end: selectedEndDate
        }

        getList(params)
    }

    const onUserInteraction = (object) => {
        if (!initLoader) {
            if (object.search) {
                let cloneData = {
                    school: selectedSchool.id,
                    page: tableState.search == object.search ? object.page : 1,
                    pageSize: object.pageSize,
                    search: object.search,
                    sort: object.sort,
                    order: object.order,
                    grade: selectedGradeId,
                    subject: selectedSubjectId,
                    status: selectedStatusId,
                    start: selectedStartDate,
                    end: selectedEndDate
                };

                setTableState(cloneData)
                secureLocalStorage.setItem(tableIndex, JSON.stringify(cloneData));

                getList(cloneData)
            } else {
                if (object.page) {
                    let cloneData = {
                        school: selectedSchool.id,
                        page: object.page,
                        pageSize: object.pageSize,
                        search: object.search,
                        sort: object.sort,
                        order: object.order,
                        grade: selectedGradeId,
                        subject: selectedSubjectId,
                        status: selectedStatusId,
                        start: selectedStartDate,
                        end: selectedEndDate
                    };

                    setTableState(object)
                    secureLocalStorage.setItem(tableIndex, JSON.stringify(cloneData));

                    getList(cloneData)
                }
            }
        }
    };

    const onDelete = () => {
        let params = {
            school: selectedSchool.id,
            exam: selectedId,
        }

        setLoading(true)
        fetchRequest(examDelete, 'POST', params)
            .then((res) => {
                if (res.success) {
                    let listParams = {
                        school: selectedSchool.id,
                        page: tableState.page,
                        pageSize: tableState.pageSize,
                        search: tableState.search,
                        sort: tableState.sort,
                        order: tableState.order,
                        grade: selectedGradeId,
                        subject: selectedSubjectId,
                    }
            
                    getList(listParams)
                    setShowDeleteModal(false);
                } else {
                    showMessage(res.message)
                    setLoading(false)
                }
            })
            .catch(() => {
                showMessage(t('errorMessage.title'));
                setLoading(false)
            })
    }

    const onModalClose = () => {
        setShowDeleteModal(false)
        setShowPrintModal(false)
        setIsCorrect(false)
    }

    return (
        <>
            <HtmlHead title={title} description={description} />
            <div className="page-title-container">
                <Row>
                    <Col md="7">
                        <h1 className="mb-0 pb-0 display-4 relative">{title}</h1>
                        <BreadcrumbList items={breadcrumbs} />
                    </Col>
                </Row>
            </div>

            <Row className="">
                <Col xl="4" xxl="3">
                    <h2 className="small-title">{t("exam.filter")}</h2>
                    <Card className="mb-5">
                        <Card.Body>
                            <p className="mb-2 modal-select-title">{t("exam.level")}*</p>
                            <Select
                                multiple={false}
                                options={gradeOptions}
                                value={selectedGradeId}
                                isClearable
                                searchable
                                onChange={(value) => gradeDropdownChange(value)}
                            />
                            <p className="my-2 modal-select-title">{t("exam.subject")}</p>
                            <Select
                                multiple={false}
                                isClearable
                                options={subjectOptions}
                                value={selectedSubjectId}
                                searchable
                                onChange={(value) => subjectDropdownChange(value)}
                            />
                            <Row>
                                <button className='btn btn-link pinnacle-bold justify-content-center mt-5 clear-button text-uppercase' variant='link' onClick={handleReset}>
                                    {t("common.clear")}
                                </button>
                            </Row>
                            <Row>
                                <Button className='pinnacle-bold filter-button mt-2 text-center text-uppercase' variant='empty' onClick={searchDataTable}>
                                    <div className="d-inline" style={{ float: 'left' }}>
                                        <FilterIcon />
                                    </div>
                                    <span style={{ position: 'relative', top: 5, right: 10 }}>{t("common.search")} </span>
                                </Button>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>

                <Col xl="8" xxl="9">
                    <div className="d-flex flex-row">
                        <Link to="/online-exam/exam-print-add">
                            <Button variant="primary" className="mb-2 add-button">
                                <ControlPointIcon
                                    style={{ color: "white", marginRight: 4 }}
                                />
                                {t("exam.createNewExam").toUpperCase()}
                            </Button>
                        </Link>
                    </div>

                    <Card className="mt-3">
                        <Card.Body>
                            <DTable
                                clickContextMenu={true}
                                remote
                                config={config}
                                columns={columns}
                                data={tableData}
                                totalDataSize={totalCount}
                                contextMenus={contextMenus}
                                onContextMenuItemClick={onContextMenuItemClick}
                                onInteraction={onUserInteraction}
                                currentPage={tableState.page}
                            />
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            {
                showPrintModal &&
                <Print
                    show={showPrintModal}
                    onClose={onModalClose}
                    questions={questions}
                    examData={examData}
                    charArray={charArray}
                    isCorrect={isCorrect}
                />
            }
            {
                showDeleteModal &&
                <DeleteModal
                    show={showDeleteModal}
                    onClose={onModalClose}
                    onDelete={onDelete}
                    title={t('warning.delete')}>
                    {t('warning.delete_confirmation')}
                    <br />
                    <br />
                    {t('warning.delete_confirmation_description')}
                </DeleteModal>
            }
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
        </>
    );
};

export default Exam;
