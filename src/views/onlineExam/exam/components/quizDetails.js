import React, { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import { Button } from "react-bootstrap";
import secureLocalStorage from 'react-secure-storage'
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import HtmlHead from "components/html-head/HtmlHead";
import TabComponent from "components/tab/Tab";
import ButtonOutline from "components/buttons/ButtonOutline";
import CloseButton from "components/buttons/CloseButton";
import SaveButton from "components/buttons/SaveButton";
import { fetchRequest } from "utils/fetchRequest";
import { examQuestions, examCreateFromBluePrint, examRemoveFromBluePrint, examPublish } from 'utils/fetchRequest/Urls';
import { toDropdownData, getWindowDimensions } from "utils/utils";
import showMessage from "modules/message";
import Select from "modules/Form/Select";
import DeleteModal from "modules/DeleteModal";
import DTable from "modules/DataTable/DTable";
import QuizVariant from "./quizVariant";

export default function QuizDetails({
    id,
    tabCode,
}) {
    const { t } = useTranslation();
    const history = useHistory();
    const examTabIndex = ['online_exam_edit_tab']
    const { selectedSchool } = useSelector(state => state.schoolData);

    const [loading, setLoading] = useState(false)
    const [method, setMethod] = useState(null)
    const [variants, setVariants] = useState([])
    const [blueprintList, setBlueprintList] = useState([])
    const [selectedVariantId, setSelectedVariantId] = useState(null);
    const [selectedIndex, setSelectedIndex] = useState(null);
    const [templateId, setTemplateId] = useState(null)
    const [questions, setQuestions] = useState([])
    const [attributes, setAttributes] = useState([])
    const [parentTopicOptions, setParentTopicOptions] = useState([])
    const [qDifficultyOptions, setQDifficultyOptions] = useState([])
    const [qTypeOptions, setQTypeOptions] = useState([])
    const [totalCount, setTotalCount] = useState()
    const [currentPage, setCurrentPage] = useState(1)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    // const [isQuestion, setIsQuestion] = useState(false)
    const [isPublish, setIsPublish] = useState(false)
    const [expanded, setExpanded] = useState(true)
    const [accordionValue, setAccordionValue] = useState(true)
    const [initLoader, setInitLoader] = useState(true)
    const [selectedTabIndex, setSelectedTabIndex] = useState(location?.state?.selectedTabIndex || 0)

    const [hasBUTQuestion, setHasBUTQuestion] = useState(false)

    const { height } = getWindowDimensions();

    const [questionRows, setQuestionRows] = useState([
        {
            id: null,
            index: 1,
            parentTopics: [],
            childTopics: [],
            qDifficulties: [],
            qTypes: [],
            parentTopicId: null,
            childTopicId: null,
            qDifficultyId: null,
            qTypeId: null,
            qNumber: '',
            score: ''
        }
    ]);

    const title = t('examTemplate.create');
    const description = "";

    const config = {
        showPagination: false,
        showFilter: false,
        showAllData: true,
        tableMarginLess: true,
    };

    const columns = [
        {
            dataField: "parentTopicName",
            text: t("question.topic"),
            sort: true,
        },
        {
            dataField: "childTopicName",
            text: t("question.childTopic"),
            sort: true,
        },
        {
            dataField: "difficultyName",
            text: t("exam.evaluation"),
            sort: true,
        },
        {
            dataField: "qTypeName",
            text: t("question.type"),
            sort: true,
        },
        {
            dataField: "questionCount",
            text: t("quiz.taskNumber"),
            sort: true,
        },
        {
            dataField: "totalScore",
            text: t("quiz.taskMark"),
            sort: true,
        },
    ];

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

    const init = (params, variantId = null, isChildTopic = false, index) => {
        setLoading(true)
        fetchRequest(examQuestions, 'POST', params)
            .then((res) => {
                if (res.success) {
                    const { method, variants = [], parentTopics = [], childTopics = [], difficulties = [], qTypes = [], blueprints = [], attributes = [], isPublish = false, template = null } = res

                    setHasBUTQuestion(res?.hasBUTQuestions || false)
                    setInitLoader(false);
                    if (isChildTopic) {
                        let cloneQuestionRows = [...questionRows];
                        cloneQuestionRows[index].childTopics = toDropdownData(childTopics, 'id', 'name')
                        setQuestionRows(cloneQuestionRows)
                    } else {
                        if (variants && variants.length > 0) {
                            let isQuestion = false;
                            for (let i = 0; i < variants.length; i++) {
                                // variants[i].gradeId = gradeId;
                                // variants[i].subjectId = subjectId;

                                if (variants[i].attributes && variants[i].attributes.questionCount > 0) {
                                    isQuestion = true
                                }
                            }
                            // setIsQuestion(isQuestion)
                        }

                        if (variantId == selectedVariantId) {
                            if (questions && questions.length > 0) {
                                if (res.questions && res.questions.length > 0) {
                                    if (questions && questions.length > 0 && res.questions && res?.questions.length > 0) {
                                        for (let i = 0; i < questions.length; i++) {
                                            for (let q = 0; q < res.questions.length; q++) {
                                                if (questions[i].id == res.questions[q].id) {
                                                    if (res.questions[q].parentQuestion) {
                                                        questions[i].parentQuestion = res.questions[q].parentQuestion;
                                                    }
                                                }
                                            }
                                        }
                                    }

                                    const newList = [...questions, ...res?.questions];
                                    setQuestions(uniqueList(newList))
                                }
                            } else {
                                setQuestions(res.questions)
                            }
                        } else {
                            setQuestions(res.questions)
                        }

                        // setSelectedGradeId(gradeId)
                        // setSelectedSubjectId(subjectId)

                        if (method == 'BLUEPRINT') {
                            let cloneQuestionRows = [];
                            if (blueprints && blueprints.length > 0) {
                                for (let b = 0; b < blueprints.length; b++) {
                                    cloneQuestionRows.push({
                                        id: blueprints[b].id || null,
                                        index: blueprints[b].ordering || null,
                                        parentTopics: toDropdownData(parentTopics, 'id', 'name'),
                                        childTopics: toDropdownData(blueprints[b].childTopics, 'id', 'name'),
                                        qDifficulties: toDropdownData(difficulties, 'id', 'name'),
                                        qTypes: toDropdownData(qTypes, 'id', 'name'),
                                        parentTopicId: blueprints[b].parentTopicId || null,
                                        childTopicId: blueprints[b].childTopicId || null,
                                        qDifficultyId: blueprints[b].difficultyId || null,
                                        qTypeId: blueprints[b]?.typeId || null,
                                        qNumber: blueprints[b]?.questionCount || '',
                                        score: blueprints[b]?.totalScore || '',
                                    })
                                }
                            } else {
                                cloneQuestionRows = [...questionRows];

                                if (cloneQuestionRows && cloneQuestionRows.length > 0) {
                                    for (let i = 0; i < cloneQuestionRows.length; i++) {
                                        cloneQuestionRows[i].parentTopics = toDropdownData(parentTopics, 'id', 'name')
                                        cloneQuestionRows[i].childTopics = toDropdownData(childTopics, 'id', 'name')
                                        cloneQuestionRows[i].qDifficulties = toDropdownData(difficulties, 'id', 'name')
                                        cloneQuestionRows[i].qTypes = toDropdownData(qTypes, 'id', 'name')
                                    }
                                }
                            }

                            setParentTopicOptions(toDropdownData(parentTopics, 'id', 'name'))
                            setQDifficultyOptions(toDropdownData(difficulties, 'id', 'name'))
                            setQTypeOptions(toDropdownData(qTypes, 'id', 'name'))
                            setAttributes(attributes)
                            setQuestionRows(cloneQuestionRows)
                            setBlueprintList(blueprints)
                        } else {
                            if (variants && variants.length > 0) {
                                if (!selectedVariantId && !params.variant) {
                                    setSelectedVariantId(variants[0].id)
                                } else if (params.variant) {
                                    let selectedTabIndexId = null;
                                    if (variants && variants.length > 0) {
                                        for (let i = 0; i < variants.length; i++) {
                                            if (variants[i].id == params.variant) {
                                                selectedTabIndexId = i
                                            }
                                        }
                                    }

                                    setSelectedTabIndex(selectedTabIndexId)
                                    setSelectedVariantId(params.variant)
                                }
                            }

                            setQDifficultyOptions(toDropdownData(difficulties, 'id', 'name'))
                            setQTypeOptions(toDropdownData(qTypes, 'id', 'name', true))
                        }

                        if (template) {
                            setTemplateId(template.id)
                        }

                        setIsPublish(isPublish)
                        setCurrentPage(res?.page || 1)
                        setTotalCount(res?.totalCount || 0)
                        setMethod(method)
                        setVariants(variants)
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

    const getVariantIdAndTabIndex = () => {
        let examVariantStrings = secureLocalStorage.getItem(examTabIndex)

        if (examVariantStrings) {
            let textVariantArray = examVariantStrings.split('_');
            if (textVariantArray && textVariantArray.length > 0) {
                let selectedTemplateId = textVariantArray[1]
                let selectedTemplateVariantId = textVariantArray[3]

                if (selectedTemplateId && selectedTemplateVariantId && selectedTemplateId == id) {
                    let selectedTabIndexId = null;

                    if (variants && variants.length > 0) {
                        for (let i = 0; i < variants.length; i++) {
                            if (variants[i].id == selectedTemplateVariantId) {
                                selectedTabIndexId = i
                            }
                        }
                    }

                    return {
                        variantId: selectedTemplateVariantId,
                        tabIndex: selectedTabIndexId
                    }
                }
            }
        }

        secureLocalStorage.removeItem(examTabIndex)
    }

    useEffect(() => {
        if (initLoader) {
            let params = {
                school: selectedSchool.id,
                exam: id,
            }

            let variantObj = null;
            if (!params.variant) {
                variantObj = getVariantIdAndTabIndex()

                if (variantObj) {
                    params.variant = variantObj.variantId
                }
            }

            if (tabCode == 'DETAIL') {
                init(params, (variantObj?.variantId || null));
            }
        }
    }, [selectedVariantId]);

    // useEffect(() => {
    //     if(initLoader){
    //         let params = {
    //             school: selectedSchool.id,
    //             template: id,
    //             variant: selectedVariantId,
    //         }

    //         if(!params.variant){
    //             let variantObj = getVariantIdAndTabIndex()

    //             if(variantObj){
    //                 params.variant = variantObj.variantId
    //             }
    //         }

    //         if (tabCode == 'DETAIL') {
    //             init(params);
    //         }
    //     }
    // }, [selectedVariantId]);

    const cancelButtonHandler = () => {
        secureLocalStorage.removeItem(examTabIndex)
        history.push('/online-exam/exam')
    }

    const publishButtonHandler = () => {
        let error = false;

        if (method == 'BLUEPRINT') {
            if (questionRows && questionRows.length > 0) {
                for (let i = 0; i < questionRows.length; i++) {
                    if (!questionRows[i].id) {
                        error = true
                    }
                }
            }

            if (error) {
                showMessage(t('errorMessage.notSavedBluePrint'), false)

                return
            }
        } else {
            // variant ved shalgah
        }

        let params = {
            school: selectedSchool.id,
            exam: id
        }

        setLoading(true)
        fetchRequest(examPublish, 'POST', params)
            .then((res) => {
                if (res.success) {
                    const { isPublish = false } = res

                    setIsPublish(isPublish)
                    history.push({
                        pathname: '/online-exam/exam',
                    })
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

    const callVariantInit = (variantId, page) => {
        if (page) {
            let params = {
                school: selectedSchool.id,
                exam: id,
                variant: variantId,
                page: page + 1
            }

            init(params, variantId)
        } else {
            let params = {
                school: selectedSchool.id,
                exam: id,
                variant: variantId,
            }

            init(params, variantId)
        }
    }

    const changeExpanded = (value) => {
        setExpanded(value)
    }

    const renderTabs = (list) => {
        let tabs = [];

        if (list && list.length > 0) {
            for (let i = 0; i < list.length; i++) {
                tabs.push({
                    id: list[i].id,
                    title: t('quiz.variant') + ' ' + (i + 1),
                    children: <QuizVariant
                        hasBUTQuestion={hasBUTQuestion}
                        questions={questions}
                        examId={id}
                        templateId={templateId}
                        variantId={list[i].id}
                        selectedGradeId={list[i].gradeId}
                        selectedSubjectId={list[i].subjectId}
                        selectedSchool={selectedSchool}
                        attributes={list[i].attributes}
                        variants={list}
                        currentPage={currentPage}
                        totalCount={totalCount}
                        callInit={callVariantInit}
                        qDifficultyOptions={qDifficultyOptions}
                        qTypeOptions={qTypeOptions}
                        changeExpanded={changeExpanded}
                        expanded={expanded}
                        questionRows={questionRows}
                    />
                })
            }
        }

        return tabs
    }

    const onTabChange = (index, data) => {
        if (data.id != selectedVariantId) {
            setSelectedVariantId(data.id)
            setSelectedTabIndex(index)
            setExpanded(true)
            let params = {
                school: selectedSchool.id,
                exam: id,
                variant: data.id
            }

            secureLocalStorage.setItem(examTabIndex, 'exam_' + id + '_variant_' + data.id)
            init(params, data.id)
        }
    }

    // blueprint handlers
    const parentTopicChange = (index, value) => {
        let cloneQuestionRows = [...questionRows]
        cloneQuestionRows[index].parentTopicId = value
        setQuestionRows(cloneQuestionRows)

        let params = {
            school: selectedSchool.id,
            exam: id,
            parentTopic: value,
        }

        init(params, null, true, index);
    }

    const childTopicChange = (index, value) => {
        let cloneQuestionRows = [...questionRows]
        cloneQuestionRows[index].childTopicId = value
        setQuestionRows(cloneQuestionRows)
    }

    const difficultyChange = (index, value) => {
        let cloneQuestionRows = [...questionRows]
        cloneQuestionRows[index].qDifficultyId = value
        setQuestionRows(cloneQuestionRows)
    }

    const qTypeChange = (index, value) => {
        let cloneQuestionRows = [...questionRows]
        cloneQuestionRows[index].qTypeId = value
        setQuestionRows(cloneQuestionRows)
    }

    const onChangeQNumber = (index, e) => {
        let input = e.target.value;

        let cloneQuestionRows = [...questionRows]
        if (cloneQuestionRows[index].qNumber == '') {
            if (input != 0) {
                if (input.match(/^([0-9]{1,})?(\.)?([0-9]{1,})?$/)) {
                    cloneQuestionRows[index].qNumber = e.target.value
                    setQuestionRows(cloneQuestionRows)
                }
            }
        }
        else {
            if (input.match(/^([0-9]{1,})?(\.)?([0-9]{1,})?$/)) {
                cloneQuestionRows[index].qNumber = e.target.value
                setQuestionRows(cloneQuestionRows)
            }
        }
    }

    const addQuestionRow = (rowLength, rows) => {
        let cloneQuestionRows = [...questionRows]

        if (cloneQuestionRows && cloneQuestionRows.length > 0) {
            let maxIndex = 0
            if (rows && rows.length > 0) {
                for (let i = 0; i < rows.length; i++) {
                    if (maxIndex < rows[i].index) {
                        maxIndex = rows[i].index;
                    }
                }
            }

            cloneQuestionRows.push({
                index: maxIndex + 1,
                parentTopics: cloneQuestionRows[0].parentTopics,
                childTopics: [],
                qDifficulties: cloneQuestionRows[0].qDifficulties,
                qTypes: cloneQuestionRows[0].qTypes,
                parentTopicId: null,
                childTopicId: null,
                qDifficultyId: null,
                qTypeId: null,
                qNumber: '',
                score: ''
            })
        } else {
            cloneQuestionRows.push({
                id: null,
                index: 1,
                parentTopics: parentTopicOptions,
                childTopics: [],
                qDifficulties: qDifficultyOptions,
                qTypes: qTypeOptions,
                parentTopicId: null,
                childTopicId: null,
                qDifficultyId: null,
                qTypeId: null,
                qNumber: '',
                score: ''
            })
        }
        setQuestionRows(cloneQuestionRows)
    }

    const saveQuestionRow = (index) => {
        let params = {
            school: selectedSchool.id,
            exam: id,
            ordering: questionRows[index].index,
            parentTopic: questionRows[index].parentTopicId,
            childTopic: questionRows[index].childTopicId,
            difficulty: questionRows[index].qDifficultyId,
            qType: questionRows[index].qTypeId,
            questionCount: questionRows[index].qNumber,
        }

        setLoading(true)
        fetchRequest(examCreateFromBluePrint, 'POST', params)
            .then((res) => {
                if (res.success) {
                    const { id = null, score = 0, attributes = [] } = res

                    let cloneQuestionRows = [...questionRows]

                    cloneQuestionRows[index].id = id
                    cloneQuestionRows[index].score = score

                    setAttributes(attributes)
                    setQuestionRows(cloneQuestionRows)
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

    const removeQuestionRow = (i, row) => {
        if (row.id) {
            setShowDeleteModal(true)
            setSelectedIndex(i)
        } else {
            const cloneQuestionRows = [...questionRows];
            cloneQuestionRows.splice(i, 1);
            setQuestionRows(cloneQuestionRows)
        }
    }

    const onDelete = () => {
        let params = {
            school: selectedSchool.id,
            exam: id,
            ordering: questionRows[selectedIndex].index,
        }

        setLoading(true)
        fetchRequest(examRemoveFromBluePrint, 'POST', params)
            .then((res) => {
                if (res.success) {
                    const { attributes } = res

                    const cloneQuestionRows = [...questionRows];
                    cloneQuestionRows.splice(selectedIndex, 1);

                    if (attributes) {
                        setAttributes(attributes)
                    }

                    setQuestionRows(cloneQuestionRows)
                    setShowDeleteModal(false)
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

    const onModalClose = () => {
        setShowDeleteModal(false)
    }

    const renderTable = () => {
        let tr = []

        for (let r = 0; r < attributes?.topics?.length; r++) {
            const parentTopicRow = attributes?.topics[r]

            if (parentTopicRow?.children?.length > 0) {
                for (let c = 0; c < parentTopicRow?.children?.length; c++) {
                    const childTopicRow = parentTopicRow?.children[c]
                    tr.push(<tr key={'row_' + r + '_c_' + c}>
                        {
                            c === 0 &&
                            <td rowSpan={parentTopicRow?.children?.length}>{parentTopicRow?.name}</td>
                        }
                        <td>{childTopicRow?.name}</td>
                        <td>{childTopicRow?.questionCount}</td>
                    </tr>)
                }
            } else {
                tr.push(<tr key={'row_' + r}>
                    <td>{parentTopicRow?.name}</td>
                    <td />
                    <td />
                </tr>)
            }
        }

        return (
            <table className="table table-bordered mt-2">
                <tbody>
                    {tr}
                </tbody>
            </table>
        )
    }

    const handlerAccordion = (value) => {
        setAccordionValue(value)
    }

    return (
        <>
            <HtmlHead title={title} description={description} />

            <div style={{ float: 'right', position: 'relative', bottom: 40, right: 10 }}>
                <Button
                    className='cancel-button pr-2'
                    variant='link'
                    onClick={cancelButtonHandler}
                >
                    <span style={{ color: '#ff2f1a' }}>{t("common.back_to_list")}</span>
                </Button>
            </div>
            {
                method == 'VARIANT' &&
                <TabComponent
                    selectedTabIndex={selectedTabIndex}
                    tabs={renderTabs(variants)}
                    onChange={(value, data) => onTabChange(value, data)}
                />
            }
            {
                method == 'BLUEPRINT' &&
                <div className="screen-padding" style={{ height: height / 1.24, overflowY: 'auto', width: '100%', paddingTop: 0 }}>
                    <div
                        className="card-alternate"
                        style={{ padding: 0 }}
                    >
                        <Accordion
                            expanded={accordionValue}
                            onChange={() => handlerAccordion(!accordionValue)}
                            className="accordion-container-regular br-20"
                        >
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon sx={{ color: '#ff5b1d' }} />}
                                aria-controls="panel1a-content"
                                id="panel1a-header"
                                className="accordion-header"
                            >
                                <h2 className="small-title d-flex align-items-center">{t('common.total')}</h2>
                            </AccordionSummary>
                            <AccordionDetails className="p-5 pt-0">
                                <div className="d-flex flex-row">
                                    <div className="text-end">
                                        <div className="modal-select-title icon-14">{t('question.title')}</div>
                                        <div className="modal-select-title icon-14 mb-1">{t('question.score')}</div>
                                        <div className="modal-select-title icon-14 mb-1">
                                            {t('exam.evaluation')}
                                        </div>
                                        <div className="modal-select-title icon-14 mb-1">
                                            {t('question.type')}
                                        </div>
                                        <div className="modal-select-title icon-14">{t('question.topic')}</div>
                                    </div>

                                    <div className="ml-4">
                                        <div className="text-primary icon-14 font-heading font-bold">
                                            {attributes.questionCount || 0}
                                        </div>
                                        <div className="text-primary icon-14 font-heading font-bold">
                                            {attributes.totalScore || 0}
                                        </div>
                                        <div className="d-flex flex-row mb-1">
                                            {
                                                attributes.difficulties && attributes.difficulties.length > 0 &&
                                                attributes.difficulties.map((difficulty, index) => {
                                                    return (
                                                        <div key={'difficulty_' + index} className="tag" style={{ background: difficulty.color }}>{difficulty.name + ': ' + difficulty.questionCount}</div>
                                                    )
                                                })
                                            }
                                        </div>
                                        <div className="d-flex flex-row">
                                            {
                                                attributes.qTypes && attributes.qTypes.length > 0 &&
                                                attributes.qTypes.map((qType, index) => {
                                                    return (
                                                        <div key={'qType_' + index} className="tag">{qType.name + ': ' + qType.questionCount}</div>
                                                    )
                                                })
                                            }
                                        </div>
                                        {
                                            attributes.topics && attributes.topics.length > 0 &&
                                            renderTable(attributes.topics)
                                        }
                                    </div>
                                </div>
                            </AccordionDetails>
                        </Accordion>
                    </div>

                    <h2 className="small-title mt-4">{t('menu.tasks')}</h2>

                    <div className="card-alternate">
                        {
                            templateId &&
                            <div>
                                <DTable
                                    config={config}
                                    columns={columns}
                                    data={blueprintList}
                                />
                            </div>
                        }
                        {
                            !templateId && questionRows && questionRows.length > 0 &&
                            questionRows.map((row, i) => {
                                return (
                                    <div key={'row_' + i}>
                                        <div className='row'>
                                            <div className="col">
                                                <div className="modal-select-title mb-3">{t('question.topic')}</div>
                                                <Select
                                                    className="modal-select quiz w-100"
                                                    isClearable
                                                    multiple={false}
                                                    disabled={row.id ? true : false}
                                                    options={row.parentTopics}
                                                    value={row.parentTopicId}
                                                    searchable
                                                    onChange={(value) => parentTopicChange(i, value)}
                                                />
                                            </div>
                                            <div className="col">
                                                <div className="modal-select-title mb-3">{t('question.childTopic')}</div>
                                                <Select
                                                    className="modal-select quiz w-100"
                                                    isClearable
                                                    multiple={false}
                                                    disabled={row.id ? true : false}
                                                    options={row.childTopics}
                                                    value={row.childTopicId}
                                                    searchable
                                                    onChange={(value) => childTopicChange(i, value)}
                                                />
                                            </div>
                                            <div className="col">
                                                <div className="modal-select-title mb-3">{t('exam.evaluation')}</div>
                                                <Select
                                                    className="modal-select quiz w-100"
                                                    isClearable
                                                    multiple={false}
                                                    disabled={row.id ? true : false}
                                                    options={row.qDifficulties}
                                                    value={row.qDifficultyId}
                                                    searchable
                                                    onChange={(value) => difficultyChange(i, value)}
                                                />
                                            </div>
                                            <div className="col">
                                                <div className="modal-select-title mb-3">{t('question.type')}</div>
                                                <Select
                                                    className="modal-select quiz w-100"
                                                    isClearable
                                                    multiple={false}
                                                    disabled={row.id ? true : false}
                                                    options={row.qTypes}
                                                    value={row.qTypeId}
                                                    searchable
                                                    onChange={(value) => qTypeChange(i, value)}
                                                />
                                            </div>
                                            <div className="col">
                                                <div className="modal-select-title mb-3">{t('quiz.taskNumber')}</div>
                                                <input
                                                    value={row.qNumber}
                                                    disabled={row.id ? true : false}
                                                    className="modal-input quiz w-100"
                                                    onChange={(e) => onChangeQNumber(i, e)}
                                                />
                                            </div>
                                            <div className="col">
                                                <div className="modal-select-title mb-3">{t('onlineLesson.score')}</div>
                                                <div className="d-flex flex-row">
                                                    <input
                                                        disabled
                                                        className="modal-input quiz w-100 mr-2"
                                                        value={row.score}
                                                    />
                                                    {
                                                        row.id
                                                            ?
                                                            <CloseButton onClick={() => removeQuestionRow(i, row)} />
                                                            :
                                                            <SaveButton className='mr-2' onClick={() => saveQuestionRow(i, row)} />
                                                    }
                                                    {
                                                        i != 0 && !row.id &&
                                                        <CloseButton onClick={() => removeQuestionRow(i, row)} />
                                                    }
                                                </div>
                                            </div>

                                        </div>
                                        {
                                            questionRows.length != (i + 1) &&
                                            <div key='separator' className="separator separator-dashed my-3" />
                                        }
                                    </div>
                                )
                            })
                        }
                        {
                            !templateId &&
                            <div style={{ width: 150 }} className="mt-4">
                                <ButtonOutline text="Шинээр нэмэх" primary onClick={() => addQuestionRow(questionRows.length, questionRows)} />
                            </div>
                        }
                    </div>

                </div>
            }
            <div className="text-center" style={{ borderTop: '1px solid #d8d8d8', padding: 24 }}>
                <Button
                    className='cancel-button pr-2'
                    variant='link'
                    onClick={cancelButtonHandler}
                >
                    <span style={{ color: '#ff2f1a' }}>{t("common.back_to_list")}</span>
                </Button>
                {/* <Button
                    className='save-button ml-3'
                    variant='empty'
                    onClick={saveButtonHandler}
                >
                    <span style={{ color: '#555555' }}>{t("common.save")}</span>
                </Button> */}
                {
                    !isPublish &&
                    <Button
                        className='save-button secondary ml-3'
                        variant='empty'
                        onClick={publishButtonHandler}
                    >
                        <span style={{ color: '#555555' }}>{t("action.publish")}</span>
                    </Button>
                }
            </div>
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
}
