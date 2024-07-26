import React, { useEffect, useState } from "react";
import { Row, Col, Card, Button } from "react-bootstrap";
import HtmlHead from "components/html-head/HtmlHead";
import BreadcrumbList from "components/breadcrumb-list/BreadcrumbList";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import Select from "modules/Form/Select";
import { BottomScrollListener } from 'react-bottom-scroll-listener';
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import FilterIcon from "cs-line-icons/custom/FilterIcon";
import { useHistory } from "react-router-dom";
import DatePickerRange from "modules/Form/DatePickerRange";
import EditIcon from "cs-line-icons/custom/EditIcon";
import CsLineIcons from "cs-line-icons/CsLineIcons";
import TrashIcon from "cs-line-icons/custom/Trash";
import ActiveIcon from "cs-line-icons/custom/RestartIcon";
import InactiveIcon from "cs-line-icons/custom/InactiveIcon";
import DeleteModal from "modules/DeleteModal";
import InactiveModal from "./modal/activeModal";
import Question from "./question";
import { fetchRequest } from 'utils/fetchRequest';
import message from 'modules/message'
import {
    examQuestionIndex,
    examQuestionToggleStatus,
    examQuestionDelete,
    examQuestionSetApproval
} from 'utils/fetchRequest/Urls';

const TaskBase = () => {
    const { t } = useTranslation()
    const { selectedSchool, schools } = useSelector(state => state.schoolData);
    const { isOrganizationUser } = useSelector(state => state.person)

    const history = useHistory();
    const title = t("adminQuestion.questionBank")
    const description = t("adminQuestion.questionBank");

    const [grades, setGrades] = useState([])
    const [subjects, setSubjects] = useState([])
    const [parentTopics, setParentTopics] = useState([])
    const [childTopics, setChildTopics] = useState([])
    const [qDifficulties, setQDifficulties] = useState([])
    const [qTypes, setQTypes] = useState([])
    const [qSchools, setQSchools] = useState([])
    const [linkAnswers, setLinkAnswers] = useState([])
    const [linkValues, setLinkValues] = useState([])
    const [userList, setUserList] = useState([])
    const [list, setList] = useState([])
    const [qStatus, setQStatus] = useState([
        {
            value: 1,
            text: t('webinar.active')
        },
        {
            value: 2,
            text: t('webinar.inActive')
        }
    ])

    const [selectedUser, setSelectedUser] = useState(null)
    const [selectedGrade, setSelectedGrade] = useState(null)
    const [selectedSubject, setSelectedSubject] = useState(null)
    const [selectedParentTopic, setSelectedParentTopic] = useState(null)
    const [selectedChildTopic, setSelectedChildTopic] = useState(null)
    const [selectedQDifficulty, setSelectedQDifficulty] = useState(null)
    const [selectedQType, setSelectedQType] = useState(null)
    const [selectedQSchool, setSelectedQSchool] = useState(null)
    const [selectedStartDate, setSelectedStartDate] = useState(null)
    const [selectedEndDate, setSelectedEndDate] = useState(null)
    const [selectedQStatus, setSelectedQStatus] = useState(null)
    const [activeButtonCode, setActiveButtonCode] = useState("NOT_APPROVED")

    const [totalCount, setTotalCount] = useState(0)
    const [currentPage, setCurrentPage] = useState(1)
    const [searchValue, setSearchValue] = useState('')

    const [hasMorePage, setHasMorePage] = useState(false)
    const [loading, setLoading] = useState(false)
    const [showInactiveModal, setShowInactiveModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [showActiveModal, setShowActiveModal] = useState(false)

    const [updateView, setUpdateView] = useState(false)

    // const contextMenus = [
    //     {
    //         key: "edit",
    //         icon: <EditIcon />,
    //         title: t('action.edit'),
    //     },
    //     {
    //         key: "delete",
    //         icon: <TrashIcon />,
    //         title: t('action.delete'),
    //     },
    //     {
    //         key: "inactive",
    //         icon: <InactiveIcon />,
    //         title: t('action.setInactive'),
    //     },
    // ];

    const [selectedId, setSelectedId] = useState()

    const onContextMenuItemClick = (key, value) => {
        if (key === "edit") {
            history.push({
                pathname: "/question-edit",
                state: {
                    id: value,
                    qTypes: qTypes,
                    selectedType: selectedQType,
                    selectedGrade: selectedGrade,
                    qDifficulties: qDifficulties,
                    selectedDifficulty: selectedQDifficulty,
                    subjects: subjects,
                    selectedSubject: selectedSubject,
                    parentTopics: parentTopics,
                    selectedParentTopic: selectedParentTopic,
                    childTopics: childTopics,
                    selectedChildTopic: selectedChildTopic,
                    linkAnswers,
                    linkValues
                }
            })
        }
        setSelectedId(value)
        if (key === "delete") {
            setShowDeleteModal(true)
        }
        if (key === "inactive") {
            setShowInactiveModal(true)
        }
        if (key === 'active') {
            setShowActiveModal(true)
        }
    }

    const uniqueList = (qList = []) => {
        const existingIds = [];
        const newList = [];
        for (let q = 0; q < qList.length; q++) {
            const qObj = qList[q];
            if (existingIds.indexOf(qObj?.id) > -1) {
                // exists in array
            } else {
                existingIds.push(qObj?.id)
                newList.push(qObj)
            }
        }
        return newList
    }

    const loadData = (params) => {
        setLoading(true)
        fetchRequest(examQuestionIndex, 'POST', params)
            .then((res) => {
                setLoading(false)
                if (res.success) {
                    setLinkAnswers(res?.refAnswers)
                    setLinkValues(res?.refValues)

                    setGrades(res?.grades?.map(gradeObj => {
                        return {
                            value: gradeObj?.value,
                            text: gradeObj?.text
                        }
                    }))
                    setSubjects(res?.subjects?.map(subjectObj => {
                        return {
                            value: subjectObj?.id,
                            text: subjectObj?.name + ' (' + subjectObj?.code + ')'
                        }
                    }))
                    setParentTopics(res?.parentTopics?.map(topicObj => {
                        return {
                            value: topicObj?.id,
                            text: topicObj?.name
                        }
                    }))
                    setChildTopics(res?.childTopics?.map(topicObj => {
                        return {
                            value: topicObj?.id,
                            text: topicObj?.name
                        }
                    }))
                    setQTypes(res?.qTypes?.map(qTypeObj => {
                        return {
                            value: qTypeObj?.id,
                            code: qTypeObj?.code,
                            text: qTypeObj?.name
                        }
                    }))
                    setQDifficulties(res?.qDifficulties?.map(qDifficultyObj => {
                        return {
                            value: qDifficultyObj?.id,
                            text: qDifficultyObj?.name
                        }
                    }))
                    setUserList(res?.userList)

                    if (params?.showQuestion) {
                        setCurrentPage(res?.page)
                        setTotalCount(res?.totalCount)
                        if (res?.page > 1) {
                            const newList = [...list, ...res?.list];
                            setList(uniqueList(newList))
                        } else {
                            setList(res?.list)
                        }
                        setHasMorePage(res?.hasMorePage)
                    }
                } else {
                    message(res.message)
                }
            })
            .catch(() => {
                message(t('errorMessage.title'));
                setLoading(false)
            })
    }

    const setActive = () => {
        setLoading(true)
        fetchRequest(examQuestionToggleStatus, 'POST', {
            question: selectedId,
            school: selectedSchool?.id,
            selectedSchool: selectedQSchool,
        })
            .then((res) => {
                setLoading(false)
                if (res.success) {
                    const clone = [...list]
                    for (let c = 0; c < clone?.length; c++) {
                        if (clone[c]?.id === res?.id) {
                            clone[c].isActive = !clone[c].isActive
                            break;
                        }
                    }
                    setList(clone)
                    setSelectedId(null)
                    setShowActiveModal(false)
                } else {
                    message(res.message)
                }
            })
            .catch(() => {
                message(t('errorMessage.title'));
                setLoading(false)
            })
    }

    const setInactive = () => {
        setLoading(true)
        fetchRequest(examQuestionToggleStatus, 'POST', {
            question: selectedId,
            school: selectedSchool?.id,
            selectedSchool: selectedQSchool,
        })
            .then((res) => {
                setLoading(false)
                if (res.success) {
                    const clone = [...list]
                    for (let c = 0; c < clone?.length; c++) {
                        if (clone[c]?.id === res?.id) {
                            clone[c].isActive = !clone[c].isActive
                            break;
                        }
                    }
                    setList(clone)
                    setSelectedId(null)
                    setShowInactiveModal(false)
                } else {
                    message(res.message)
                }
            })
            .catch(() => {
                message(t('errorMessage.title'));
                setLoading(false)
            })
    }

    const submitDelete = () => {
        setLoading(true)
        fetchRequest(examQuestionDelete, 'POST', {
            question: selectedId,
            school: selectedSchool?.id,
            selectedSchool: selectedQSchool,
        })
            .then((res) => {
                setLoading(false)
                if (res.success) {
                    const clone = [...list]
                    const newList = [];
                    for (let c = 0; c < clone?.length; c++) {
                        if (clone[c]?.id !== res?.id) {
                            newList.push(clone[c])
                        }
                    }
                    setList(newList)
                    setSelectedId(null)
                    setShowDeleteModal(false)

                    setUpdateView(!updateView)
                } else {
                    message(res.message)
                }
            })
            .catch(() => {
                message(t('errorMessage.title'));
                setLoading(false)
            })
    }

    const breadcrumbs = [
        { to: "", text: "Home" },
        { to: "online-exam/questions", text: title },
    ];

    const searchButtonHandler = () => {
        setList([]);
        const params = {
            school: selectedSchool?.id,
            selectedSchool: selectedQSchool,
            grade: selectedGrade,
            subject: selectedSubject,
            parentTopic: selectedParentTopic,
            childTopic: selectedChildTopic,
            qType: selectedQType,
            qDifficulty: selectedQDifficulty,
            showQuestion: 1,
            statusCode: activeButtonCode,
            active: selectedQStatus
        }
        loadData(params)
    }

    const listSpliceById = (spliceId = null, activeList = []) => {
        if (spliceId) {
            let cloneList = [...activeList]

            if (cloneList.length <= 10) {
                const params = {
                    school: selectedSchool?.id,
                    selectedSchool: selectedQSchool,
                    grade: selectedGrade,
                    subject: selectedSubject,
                    parentTopic: selectedParentTopic,
                    childTopic: selectedChildTopic,
                    qType: selectedQType,
                    qDifficulty: selectedQDifficulty,
                    showQuestion: 1,
                    search: searchValue,
                    createdUser: selectedUser || '',
                    start: selectedStartDate || '',
                    end: selectedEndDate || '',
                    statusCode: activeButtonCode,
                    active: selectedQStatus
                }

                loadData(params)
            } else if (cloneList.length > 10) {
                if (cloneList && cloneList.length > 0) {
                    for (let i = 0; i < cloneList.length; i++) {
                        if (spliceId == cloneList[i].id) {
                            cloneList.splice(i, 1);
                        }
                    }
                }

                setList(cloneList)
                setTotalCount(totalCount - 1)
                setTimeout(() => {
                    setLoading(false)
                }, 1000);
            }
        }
    }

    useEffect(() => {
        loadData({
            showQuestion: 1,
            school: selectedSchool?.id
        })

        let schoolList = []

        if (isOrganizationUser) {
            if (schools && schools.length > 0) {
                for (let i = 0; i < schools.length; i++) {
                    if (schools[i].subSchools && schools[i].subSchools.length > 0) {
                        let subSchools = schools[i].subSchools

                        for (let s = 0; s < subSchools.length; s++) {
                            schoolList.push({
                                value: subSchools[s].id,
                                text: subSchools[s].name,
                            })
                        }
                    }
                }
            }
        } else {
            if (schools && schools.length > 0) {
                for (let i = 0; i < schools.length; i++) {
                    schoolList.push({
                        value: schools[i].id,
                        text: schools[i].name,
                    })
                }
            }
        }

        setQSchools(schoolList)
    }, [])

    const onQSchoolChange = (value) => {
        setSelectedQSchool(value)
        setList([])
        setLinkAnswers([])
        setLinkValues([])
        setGrades([])
        setSubjects([])
        setParentTopics([])
        setChildTopics([])
        setQTypes([])
        setQDifficulties([])

        setSelectedGrade(null)
        setSelectedSubject(null)
        setSelectedParentTopic(null)
        setSelectedChildTopic(null)
        setSelectedQType(null)
        setSelectedQDifficulty(null)

        const params = {
            school: selectedSchool?.id,
            selectedSchool: value,
        }
        loadData(params)
    }

    const onGradeChange = (value) => {
        setSelectedGrade(value)
        setList([])
        loadData({
            school: selectedSchool?.id,
            selectedSchool: selectedQSchool,
            grade: value,
            showQuestion: 1,
            statusCode: activeButtonCode
        })
    }

    const onSubjectChange = (value) => {
        setSelectedSubject(value)
        setList([])
        loadData({
            school: selectedSchool?.id,
            selectedSchool: selectedQSchool,
            grade: selectedGrade,
            subject: value,
            showQuestion: 1,
            statusCode: activeButtonCode
        })
    }

    const onParentTopicChange = (value) => {
        setSelectedParentTopic(value)
        setList([])
        loadData({
            school: selectedSchool?.id,
            selectedSchool: selectedQSchool,
            grade: selectedGrade,
            subject: selectedSubject,
            parentTopic: value,
            showQuestion: 1,
            statusCode: activeButtonCode
        })
    }

    const onChildTopicChange = (value) => {
        setSelectedChildTopic(value)
    }

    const onQTypeChange = (value) => {
        setSelectedQType(value)
    }

    const onQStatusChange = (value) => {
        setSelectedQStatus(value)
    }

    const onQDifficultyChange = (value) => {
        setSelectedQDifficulty(value)
    }

    const onInputChange = (e) => {
        setSearchValue(e.target.value)
    }

    const clearSearch = () => {
        setSelectedQSchool(null)
        setSelectedGrade(null)
        setSelectedSubject(null)
        setSelectedParentTopic(null)
        setSelectedChildTopic(null)
        setSelectedQType(null)
        setSelectedQDifficulty(null)
        setSelectedQStatus(null)

        loadData({
            showQuestion: 1,
            school: selectedSchool?.id,
            statusCode: activeButtonCode
        })
    }

    const onBottomReached = (e, data1, data2) => {
        if (hasMorePage && !loading) {
            const params = {
                school: selectedSchool?.id,
                selectedSchool: selectedQSchool,
                grade: selectedGrade,
                subject: selectedSubject,
                parentTopic: selectedParentTopic,
                childTopic: selectedChildTopic,
                qType: selectedQType,
                qDifficulty: selectedQDifficulty,
                showQuestion: 1,
                page: currentPage + 1,
                start: selectedStartDate || '',
                end: selectedEndDate || '',
                statusCode: activeButtonCode,
                search: searchValue,
                active: selectedQStatus
            }
            loadData(params)
        }
    }

    const onModalClose = () => {
        setShowDeleteModal(false)
    }

    const getContextMenus = (questionObj) => {
        if (isOrganizationUser) {
            return []
        } else {
            if (questionObj.isApproved) {
                if (questionObj.isActive) {
                    return [
                        {
                            key: "inactive",
                            icon: <InactiveIcon />,
                            title: t('action.setInactive'),
                        }
                    ]
                } else {
                    return [
                        {
                            key: "active",
                            icon: <ActiveIcon />,
                            title: t('action.setActive'),
                        },
                        {
                            key: "edit",
                            icon: <EditIcon />,
                            title: t('action.edit'),
                        }
                    ]
                }
            } else if (questionObj.isDeclined) {
                return [
                    {
                        key: "edit",
                        icon: <EditIcon />,
                        title: t('action.edit'),
                    },
                    {
                        key: "delete",
                        icon: <TrashIcon />,
                        title: t('action.delete'),
                    }
                ]
            } else {
                if (!questionObj.isActive) {
                    return [
                        {
                            key: "edit",
                            icon: <EditIcon />,
                            title: t('action.edit'),
                        }
                    ]
                } else {
                    return []
                }
            }
        }
    }

    const onHandlerSearch = () => {
        const params = {
            school: selectedSchool?.id,
            selectedSchool: selectedQSchool,
            grade: selectedGrade,
            subject: selectedSubject,
            parentTopic: selectedParentTopic,
            childTopic: selectedChildTopic,
            qType: selectedQType,
            qDifficulty: selectedQDifficulty,
            showQuestion: 1,
            search: searchValue,
            createdUser: selectedUser || '',
            start: selectedStartDate || '',
            end: selectedEndDate || '',
            statusCode: activeButtonCode,
            search: searchValue,
            active: selectedQStatus
        }
        loadData(params)
    }

    const onHandlerDateRangePicker = (value) => {
        setSelectedStartDate(value[0].startDate)
        setSelectedEndDate(value[0].endDate)

        if (value[0].startDate && value[0].endDate) {
            if (new Date(value[0].startDate) > new Date(value[0].endDate)) {
                return message(t('questionBank.error.dateError'))
            }

            const params = {
                school: selectedSchool?.id,
                selectedSchool: selectedQSchool,
                grade: selectedGrade,
                subject: selectedSubject,
                parentTopic: selectedParentTopic,
                childTopic: selectedChildTopic,
                qType: selectedQType,
                qDifficulty: selectedQDifficulty,
                showQuestion: 1,
                search: searchValue || '',
                createdUser: selectedUser || '',
                start: value[0].startDate,
                end: value[0].endDate,
                statusCode: activeButtonCode,
                search: searchValue,
                active: selectedQStatus
            }
            loadData(params)
        }
    }

    const handlerActiveButton = (code) => {
        setList([])
        setActiveButtonCode(code)

        const params = {
            school: selectedSchool?.id,
            selectedSchool: selectedQSchool,
            grade: selectedGrade,
            subject: selectedSubject,
            parentTopic: selectedParentTopic,
            childTopic: selectedChildTopic,
            qType: selectedQType,
            qDifficulty: selectedQDifficulty,
            showQuestion: 1,
            search: searchValue,
            createdUser: selectedUser || '',
            start: selectedStartDate || '',
            end: selectedEndDate || '',
            statusCode: code,
            search: searchValue,
            active: selectedQStatus
        }

        loadData(params)
    }

    const onQuestionApproval = (params, activeList) => {
        setLoading(true)
        fetchRequest(examQuestionSetApproval, 'POST', params)
            .then((res) => {
                if (res.success) {
                    listSpliceById(res.id, activeList)
                    message(res.message, true)
                } else {
                    message(res.message)
                    setLoading(false)
                }
            })
            .catch(() => {
                message(t('errorMessage.title'));
                setLoading(false)
            })
    }

    const checkShowContextMenu = () => {
        if (!isOrganizationUser) {
            // if (activeButtonCode == "APPROVED") {
            //     return false
            // }

            return true
        } else {
            return false
        }
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
                <Col xl="12 mb-4">
                    <Button variant="primary" className={activeButtonCode == "NOT_APPROVED" ? "" : "main-orange main-background-20"} onClick={() => handlerActiveButton("NOT_APPROVED")}>
                        {t('adminQuestion.label.unpublished')}
                    </Button>
                    <Button variant="primary" className={activeButtonCode == "DECLINED" ? "ml-2" : "main-orange main-background-20 ml-2 "} onClick={() => handlerActiveButton("DECLINED")}>
                        {t('adminQuestion.label.returned')}
                    </Button>
                    <Button variant="primary" className={activeButtonCode == "APPROVED" ? "ml-2" : "main-orange main-background-20 ml-2"} onClick={() => handlerActiveButton("APPROVED")}>
                        {t('adminQuestion.label.published')}
                    </Button>
                </Col>
                <Col xl="4" xxl="3">
                    <h2 className="small-title">{t("exam.filter")}</h2>
                    <Card className="mb-2">
                        <Card.Body className="p-3">
                            {
                                (!selectedGrade || !selectedSubject) && !isOrganizationUser &&
                                <p className="label-orange fs-12 font-weight-bold mb-1">{t('question.remark.selectGradeAndSubject')}</p>
                            }
                            {
                                isOrganizationUser &&
                                <>
                                    <p className="mb-2 modal-select-title">{t("adminQuestion.createdSchool")}</p>
                                    <Select
                                        clearable
                                        options={qSchools}
                                        searchable
                                        value={selectedQSchool}
                                        onChange={(value) => onQSchoolChange(value)}
                                    />
                                </>
                            }
                            <p className="mb-2 mt-2 modal-select-title">{t("curriculum.grade")}</p>
                            <Select
                                clearable
                                options={grades}
                                searchable
                                value={selectedGrade}
                                onChange={(value) => onGradeChange(value)}
                            />

                            <p className="my-2 modal-select-title">{t("exam.subject")}</p>
                            <Select
                                clearable
                                options={subjects}
                                searchable
                                value={selectedSubject}
                                onChange={(value) => onSubjectChange(value)}
                            />

                            <p className="my-2 modal-select-title">{t("exam.content")}</p>
                            <Select
                                clearable
                                options={parentTopics}
                                searchable
                                value={selectedParentTopic}
                                onChange={(value) => onParentTopicChange(value)}
                            />

                            <p className="my-2 modal-select-title">{t("exam.subSubject")}</p>
                            <Select
                                clearable
                                options={childTopics}
                                searchable
                                value={selectedChildTopic}
                                onChange={(value) => onChildTopicChange(value)}
                            />

                            <p className="my-2 modal-select-title">{t("exam.evaluation")}</p>
                            <Select
                                clearable
                                options={qDifficulties}
                                searchable
                                value={selectedQDifficulty}
                                onChange={(value) => onQDifficultyChange(value)}
                            />

                            <p className="my-2 modal-select-title">{t("quiz.taskType")}</p>
                            <Select
                                clearable
                                options={qTypes}
                                searchable
                                value={selectedQType}
                                onChange={(value) => onQTypeChange(value)}
                            />

                            <p className="my-2 modal-select-title">{t("quiz.taskStatus")}</p>
                            <Select
                                clearable
                                options={qStatus}
                                searchable
                                value={selectedQStatus}
                                onChange={(value) => onQStatusChange(value)}
                            />

                            <Row className="m-0">
                                <Button className='btn btn-link clear-button cursor-pointer' variant='link' onClick={clearSearch}>
                                    {t("common.clear").toUpperCase()}
                                </Button>
                            </Row>
                            <Row className="m-0">
                                <Button className="d-flex flex-row justify-content-between filter-button mt-2 cursor-pointer" variant='empty' onClick={() => searchButtonHandler()}>
                                    <FilterIcon />
                                    {t("common.search").toUpperCase()}
                                    <div style={{ paddingLeft: 15 }} />
                                </Button>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>

                <Col xl="8" xxl="9">
                    {
                        selectedSubject && !isOrganizationUser && activeButtonCode == "NOT_APPROVED" && <Button
                            onClick={() => history.push({
                                pathname: "/question-add",
                                state: {
                                    qTypes: qTypes,
                                    selectedType: selectedQType ? selectedQType : qTypes.find(qTypeObj => {
                                        return qTypeObj?.code === 'TEST'
                                    })?.value,
                                    selectedGrade: selectedGrade,
                                    selectedGradeName: grades?.find(obj => {
                                        return obj?.value == selectedGrade
                                    })?.text || null,
                                    qDifficulties: qDifficulties,
                                    selectedDifficulty: selectedQDifficulty,
                                    subjects: subjects,
                                    selectedSubject: selectedSubject,
                                    parentTopics: parentTopics,
                                    selectedParentTopic: selectedParentTopic,
                                    childTopics: childTopics,
                                    selectedChildTopic: selectedChildTopic,
                                    linkAnswers,
                                    linkValues
                                }
                            })}
                            variant="primary"
                            className="mb-2 add-button text-uppercase"
                        >
                            <ControlPointIcon style={{ color: "white", marginRight: "4px" }} className='MuiSvg-customSize'/>
                            {t('onlineLesson.newQuestionAdd')}
                        </Button>
                    }
                    <h2 className={`small-title ${selectedSubject ? 'mt-4' : ''}`}>{t("action.toSearch")}</h2>

                    <Card className="mb-3">
                        <Card.Body className="d-flex flex-row flex-wrap p-3">
                            <div className="mr-2">
                                <p className="my-2 modal-select-title">{t("quiz.task")}</p>
                                <div className="input-group h-38">
                                    <input type="text" className="form-control" onChange={(e) => onInputChange(e)}
                                        onKeyDown={(e) => {
                                            if (e.code?.toLowerCase() === 'enter') {
                                                onHandlerSearch()
                                            }
                                        }} />
                                    <button className="input-group-text btn-icon btn-icon-only btn btn-custom-search-style h-38" id="btnGroupAddon" type="button" onClick={() => onHandlerSearch()}>
                                        <CsLineIcons icon='search' stroke='black' />
                                    </button>
                                </div>
                            </div>
                            <div>
                                <p className="my-2 modal-select-title">{t("common.createdDate")}</p>
                                <DatePickerRange
                                    selectedStartDate={selectedStartDate}
                                    selectedEndDate={selectedEndDate}
                                    onChange={(array) => onHandlerDateRangePicker(array)}
                                />
                            </div>
                        </Card.Body>
                    </Card>

                    <div className="d-flex flex-row justify-content-between">
                        <h2 className="small-title">{t("menu.tasks")}</h2>
                        <div className="font-bold font-heading icon-14">
                            {t("quiz.totalTasks")}: {totalCount}
                        </div>
                    </div>

                    <BottomScrollListener
                        onBottom={(e, data1, data2) => onBottomReached(e, data1, data2)}
                        offset={200}>
                        {list && list.length > 0 && list.map((question, index) => {
                            return <Question
                                key={index}
                                question={question}
                                showContextMenu={checkShowContextMenu()}
                                contextMenus={getContextMenus(question)}
                                onContextMenuItemClick={(key) => onContextMenuItemClick?.(key, question.id)}
                                isOrganizationUser={isOrganizationUser}
                                activeButtonCode={activeButtonCode}
                                selectedQSchool={selectedQSchool}
                                questionObj={question}
                                list={list}
                                onApprovalHandler={onQuestionApproval}
                            />
                        })}
                    </BottomScrollListener>
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
                </Col>
            </Row>
            {
                showDeleteModal &&
                <DeleteModal
                    show={showDeleteModal}
                    onClose={onModalClose}
                    onDelete={submitDelete}
                    title={t('warning.delete')}>
                    {t('warning.delete_confirmation')}
                    <br />
                    <br />
                    {t('warning.delete_confirmation_description')}
                </DeleteModal>
            }
            {
                showInactiveModal && selectedId && <InactiveModal
                    show={showInactiveModal}
                    question={selectedId}
                    onClose={() => setShowInactiveModal(false)}
                    onSave={() => setInactive()}
                    content={<div>
                        <p>Та идэвхгүй болгохдоо итгэлтэй байна уу?</p>
                        <p>Та асуултыг идэвхгүй төлөв рүү шилжүүлснээр сурагчдад харагдахгүй болно.</p>
                    </div>}
                />
            }
            {
                showActiveModal && selectedId && <InactiveModal
                    show={showActiveModal}
                    question={selectedId}
                    onClose={() => setShowActiveModal(false)}
                    onSave={() => setActive()}
                    title={t('action.setActive')}
                    content={<div>
                        <p>Асуултын идэвхтэй болгох уу?</p>
                        <p>Та асуултыг идэвхтэй төлөв рүү шилжүүлснээр сурагчдад харагдах болно.</p>
                    </div>}
                />
            }
        </>
    );
};

export default TaskBase;
