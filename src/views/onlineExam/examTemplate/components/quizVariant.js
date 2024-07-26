import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import { useBottomScrollListener } from 'react-bottom-scroll-listener';
import { useHistory } from "react-router-dom";
import OrderIcon from "cs-line-icons/custom/OrderIcon";
import TrashIcon from "cs-line-icons/custom/Trash";
import EditIcon from "cs-line-icons/custom/EditIcon";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useTranslation } from "react-i18next";
import secureLocalStorage from 'react-secure-storage'
import { fetchRequest } from 'utils/fetchRequest';
import { examTemplateQuestions, examTemplateQuestionChangeOrder, examTemplateQuestionRemove } from 'utils/fetchRequest/Urls';
import { getWindowDimensions } from "utils/utils";
import showMessage from 'modules/message'
import GroupQuestionsModal from "./modal/groupQuestionsModal";
import QuestionBankModal from "./modal/questionBankModal";
import VariantModal from "./modal/variantModal";
import ChangeQuestionOrderModal from "./modal/changeQuestionOrderModal";
import Question from "../../questions/question"

export default function QuizVariant({
    selectedSchool,
    templateId,
    variantId,
    selectedGradeId,
    selectedSubjectId,
    attributes = [],
    questions = [],
    variants = [],
    totalCount = 0,
    currentPage = 1,
    selectedTabIndex = null,
    qDifficultyOptions = [],
    qTypeOptions = [],
    examCount = 0,
    callInit,
    changeExpanded,
    expanded
}) {
    const { t } = useTranslation();
    const history = useHistory();
    const examTemplateTabIndex = ['online_exam_template_edit_tab']

    const [loading, setLoading] = useState()
    const { height } = getWindowDimensions()

    const [selectedId, setSelectedId] = useState(null)
    const [selectedQuestionObj, setSelectedQuestionObj] = useState(null)
    const [showChangeOrderModal, setShowChangeOrderModal] = useState(false)
    const [value, setValue] = useState(true)
    const [questionList, setQuestionList] = useState([]);
    const [attributesList, setAttributesList] = useState([]);
    const [selectedQType, setSelectedQType] = useState(null)
    const [selectedQDifficulty, setSelectedQDifficulty] = useState(null)
    const [grades, setGrades] = useState([])
    const [subjects, setSubjects] = useState([])

    const callback = () => {
        if (!loading && totalCount > questions.length) {
            callInit(variantId, currentPage, selectedTabIndex)
        }
    }

    const calculateContextMenu = (list) => {
        if(list && list.length > 0){
            for(let i = 0; i < list.length; i++){
                if(list[i].categoryCode == 'EXAM_TEMPLATE'){
                    list[i].contextMenuKeys = ['order', 'edit', 'delete']
                } else {
                    list[i].contextMenuKeys = ['order', 'delete']
                }
            }
        }

        setQuestionList(list);
    }

    useEffect(() => {
        calculateContextMenu(questions)
        setAttributesList(attributes)
    }, [questions, attributes]);

    useEffect(() => {
        setValue(expanded)
    }, [expanded]);

    const scrollRef = useBottomScrollListener(callback, 0, 200, undefined, true);

    const contextMenus = [
        {
            key: "order",
            icon: <OrderIcon />,
            title: t('action.order'),
        },
        {
            key: "edit",
            icon: <EditIcon />,
            title: t('action.edit'),
        },
        {
            key: "delete",
            icon: <TrashIcon />,
            title: "Хасах",
        },
    ];

    const [show, setShow] = useState(false);
    const [showBank, setShowBank] = useState(false);
    const [showVariant, setShowVariant] = useState(false);

    const linkedButton = () => {
        setShow(true)
    }

    const bankButton = () => {
        setShowBank(true)
    }

    const importButton = () => {
        setShowVariant(true)
    }

    const onHandlerNewQuestion = () => {
        history.push({
            pathname: '/question-add',
            state: {
                template: templateId,
                templateVariant: variantId,
                isTemplate: 1,
                backUrl: '/online-exam/template-edit',
                selectedGrade: selectedGradeId,
                selectedSubject: selectedSubjectId,
                selectedTabIndex: selectedTabIndex,
            }
        })
    }

    const modalActionDone = () => {
        setShow(false)
        setShowBank(false)
        setShowVariant(false)
        callInit(variantId, 0, selectedTabIndex)
    }

    const modalAgainActionDone = () => {
        callInit(variantId, 0, selectedTabIndex)
    }

    const renderTable = (list) => {
        let tr = []

        for (let r = 0; r < list?.length; r++) {
            const parentTopicRow = list[r]

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

    const onContextMenuItemClick = (key, question, type) => {
        setSelectedId(question.questionId)
        setSelectedQuestionObj(question)
        if (key === "edit") {
            if(examCount > 0){
                showMessage(t('examTemplate.errorMessage.templateUsed'), false)
                return
            }

            if(type == 'parentQuestion'){
                setShow(true)
            } else {
                secureLocalStorage.setItem(examTemplateTabIndex, 'template_' + templateId + '_variant_' + variantId)
                history.push({
                    pathname: "/question-edit",
                    state: {
                        id: question.questionId,
                        qTypes: qTypeOptions,
                        selectedType: question?.qTypeId || null,
                        selectedGrade: selectedGradeId,
                        qDifficulties: qDifficultyOptions,
                        selectedDifficulty: selectedQDifficulty,
                        subjects: subjects,
                        selectedSubject: selectedSubjectId,
                    }
                })
            }
        }
        if (key === "delete") {
            if(examCount > 0){
                showMessage(t('examTemplate.errorMessage.templateUsed'), false)
                return
            }

            setLoading(true)
            fetchRequest(examTemplateQuestionRemove, 'POST', {
                id: question.questionId,
                template: templateId,
                school: selectedSchool?.id,
                type: type,
                variant: variantId,
            })
            .then((res) => {
                setLoading(false)
                if (res.success) {
                    const clone = [...questionList]
                    const newList = [];
                        for (let c = 0; c < clone?.length; c++) {
                            if(type == 'parentQuestion'){
                                if (clone[c]?.questionId == question.questionId) {
                                    clone[c].parentQuestion = null
                                    newList.push(clone[c])
                                } else {
                                    newList.push(clone[c])
                                }
                            } else {
                                if (clone[c]?.questionId != question.questionId) {
                                    newList.push(clone[c])
                                }
                            }
                        }
                        setSelectedQuestionObj(null)
                        calculateContextMenu(newList)
                        setAttributesList(res.attributes)
                        showMessage(res.message, true)
                    } else {
                        showMessage(res.message)
                    }
                })
                .catch(() => {
                    showMessage(t('errorMessage.title'));
                    setLoading(false)
                })
        }
        if (key === "inactive") {
            if(examCount > 0){
                showMessage(t('examTemplate.errorMessage.templateUsed'), false)
                return
            }

            setShowInactiveModal(true)
        }
        if (key === 'active') {
            if(examCount > 0){
                showMessage(t('examTemplate.errorMessage.templateUsed'), false)
                return
            }

            setShowActiveModal(true)
        } else if (key === 'order') {
            if(examCount > 0){
                showMessage(t('examTemplate.errorMessage.templateUsed'), false)
                return
            }

            setShowChangeOrderModal(true);
        }
    }

    const onChangeOrderSubmit = async (params) => {
        setLoading(true)
        fetchRequest(examTemplateQuestionChangeOrder, 'POST', params)
            .then(res => {
                if (!res.success) {
                    showMessage(res.message);
                } else {
                    showMessage(res.message, true);
                    calculateContextMenu(res.questions);
                    // setContextMenuData(null)
                    setShowChangeOrderModal(false)
                }
            })
            .catch(e => {
                showMessage(t('errorMessage.title'));
            })
            .finally(() => {
                setLoading(false);
            })
    }

    const handlerAccordion = (value) => {
        changeExpanded(value)
    }

    return (
        <div className="screen-padding"> 
            <div className="d-flex flex-row mb-4 flex-wrap">
                {
                    !selectedSchool.inOrganization &&
                    <Button
                        onClick={() => onHandlerNewQuestion()}
                        variant="primary"
                        className="btn-sm"
                    >
                        <ControlPointIcon style={{ color: "white", marginRight: "4px" }} className='MuiSvg-customSize'/>
                        Шинэ даалгавар
                    </Button>
                }
                <Button
                    onClick={() => linkedButton()}
                    variant="primary"
                    className="btn-sm ml-2"
                >
                    <svg
                        className="mr-1"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M9.0666 20.1701C9.61889 20.1701 10.0666 19.7223 10.0666 19.1701C10.0666 18.6178 9.61889 18.1701 9.0666 18.1701V20.1701ZM4.26718 15.9702L3.26718 15.9702L4.26718 15.9702ZM5.2666 2.39998C5.26658 1.8477 4.81884 1.4 4.26656 1.40002C3.71427 1.40005 3.26658 1.84778 3.2666 2.40007L5.2666 2.39998ZM9.0666 8.31689C9.61889 8.31689 10.0666 7.86918 10.0666 7.31689C10.0666 6.76461 9.61889 6.31689 9.0666 6.31689V8.31689ZM18.6666 9.86669L18.6666 8.86669L18.6666 9.86669ZM13.8666 9.86667L13.8666 10.8667H13.8666L13.8666 9.86667ZM19.7334 2.40002L20.7334 2.40005C20.7334 2.13483 20.6281 1.88047 20.4405 1.69293C20.253 1.50538 19.9987 1.40002 19.7334 1.40002V2.40002ZM19.7333 8.80005L20.7333 8.80007V8.80007L19.7333 8.80005ZM12.7999 8.8L11.7999 8.79999V8.79999L12.7999 8.8ZM12.8 4.53336L12.1356 3.78595C11.9221 3.97572 11.8 4.24772 11.8 4.53335L12.8 4.53336ZM15.1999 2.40002V1.40002C14.955 1.40002 14.7186 1.4899 14.5356 1.65262L15.1999 2.40002ZM18.6666 21.6L18.6666 20.6L18.6666 21.6ZM13.8666 21.6L13.8666 22.6L13.8666 21.6ZM19.7334 14.1334L20.7334 14.1334C20.7334 13.8682 20.6281 13.6138 20.4405 13.4263C20.253 13.2387 19.9987 13.1334 19.7334 13.1334V14.1334ZM19.7333 20.5334L20.7333 20.5334V20.5334L19.7333 20.5334ZM12.7999 20.5333L11.7999 20.5333V20.5333L12.7999 20.5333ZM12.8 16.2667L12.1356 15.5193C11.9221 15.7091 11.8 15.981 11.8 16.2667L12.8 16.2667ZM15.1999 14.1334V13.1334C14.955 13.1334 14.7186 13.2232 14.5356 13.386L15.1999 14.1334ZM9.0666 18.1701H7.46718V20.1701H9.0666V18.1701ZM5.26718 15.9702L5.26681 7.31685L3.26681 7.31694L3.26718 15.9702L5.26718 15.9702ZM5.26681 7.31685L5.2666 2.39998L3.2666 2.40007L3.26681 7.31694L5.26681 7.31685ZM9.0666 6.31689H4.26681V8.31689H9.0666V6.31689ZM7.46718 18.1701C6.25219 18.1701 5.26724 17.1851 5.26718 15.9702L3.26718 15.9702C3.26728 18.2898 5.14766 20.1701 7.46718 20.1701V18.1701ZM18.6666 8.86669L13.8666 8.86667L13.8666 10.8667L18.6666 10.8667L18.6666 8.86669ZM18.7334 2.4L18.7333 8.80003L20.7333 8.80007L20.7334 2.40005L18.7334 2.4ZM18.6666 10.8667C19.808 10.8667 20.7333 9.94145 20.7333 8.80007L18.7333 8.80002C18.7333 8.83684 18.7034 8.86669 18.6666 8.86669L18.6666 10.8667ZM11.7999 8.79999C11.7999 9.94138 12.7252 10.8667 13.8666 10.8667L13.8666 8.86667C13.8298 8.86667 13.7999 8.83682 13.7999 8.8L11.7999 8.79999ZM13.7999 8.8L13.8 4.53337L11.8 4.53335L11.7999 8.79999L13.7999 8.8ZM15.1999 3.40002H19.7334V1.40002H15.1999V3.40002ZM14.5356 1.65262L12.1356 3.78595L13.4643 5.28076L15.8643 3.14743L14.5356 1.65262ZM18.6666 20.6L13.8666 20.6L13.8666 22.6L18.6666 22.6L18.6666 20.6ZM18.7334 14.1333L18.7333 20.5334L20.7333 20.5334L20.7334 14.1334L18.7334 14.1333ZM18.6666 22.6C19.808 22.6 20.7333 21.6748 20.7333 20.5334L18.7333 20.5334C18.7333 20.5702 18.7034 20.6 18.6666 20.6L18.6666 22.6ZM11.7999 20.5333C11.7999 21.6747 12.7252 22.6 13.8666 22.6L13.8666 20.6C13.8298 20.6 13.7999 20.5702 13.7999 20.5333L11.7999 20.5333ZM13.7999 20.5333L13.8 16.2667L11.8 16.2667L11.7999 20.5333L13.7999 20.5333ZM15.1999 15.1334H19.7334V13.1334H15.1999V15.1334ZM14.5356 13.386L12.1356 15.5193L13.4643 17.0141L15.8643 14.8808L14.5356 13.386Z"
                            fill="white"
                        />
                    </svg>
                    Бүлэг даалгавар
                </Button>
                <Button
                    onClick={() => bankButton()}
                    variant="primary"
                    className="btn-sm ml-2"
                >
                    <UploadFileIcon style={{ color: "white", marginRight: "4px" }} />
                    Даалгаврын сангаас сонгох
                </Button>

                {
                    variants && variants.length > 1 &&
                    <Button
                        onClick={() => importButton()}
                        variant="primary"
                        className="add-button import ml-2"
                    >
                        <svg
                            className="mr-1"
                            width="22"
                            height="23"
                            viewBox="0 0 22 23"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M9.6248 20.6068H4.1248C2.90977 20.6068 1.9248 19.6218 1.9248 18.4068L1.92489 5.20682C1.9249 3.9918 2.90987 3.00684 4.12489 3.00684H14.0251C15.2402 3.00684 16.2251 3.99181 16.2251 5.20684V9.60683M5.77515 7.40684H12.3751M5.77515 10.7068H12.3751M5.77515 14.0068H9.07515M14.0642 19.5068L11.8251 17.2571M11.8251 17.2571L13.963 15.1068M11.8251 17.2571H18.45C19.3476 17.2571 20.0751 16.5295 20.0751 15.632C20.0751 14.7344 19.3476 14.0068 18.45 14.0068H16.2251"
                                stroke="white"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                        Импорт
                    </Button>
                }
            </div>

            <div ref={scrollRef} style={{height: height / 1.45, overflowY: 'auto'}}>
                <div 
                    className="card-alternate" 
                    style={{padding: 0}}
                >
                    <Accordion
                        expanded={value}
                        onChange={() => handlerAccordion(!value)}
                        className="accordion-container-regular br-20"
                    >
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon sx={{ color: '#ff5b1d' }}/>}
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
                                        {attributesList.questionCount || 0}
                                    </div>
                                    <div className="text-primary icon-14 font-heading font-bold">
                                        {attributesList.totalScore || 0}
                                    </div>
                                    <div className="d-flex flex-row mb-1">
                                        {
                                            attributesList.difficulties && attributesList.difficulties.length > 0 &&
                                            attributesList.difficulties.map((difficulty, index) => {
                                                return (
                                                    <div key={'difficulty_' + index} className="tag" style={{ background: difficulty.color }}>{difficulty.name + ': ' + difficulty.questionCount}</div>
                                                )
                                            })
                                        }
                                    </div>
                                    <div className="d-flex flex-row">
                                        {
                                            attributesList.qTypes && attributesList.qTypes.length > 0 &&
                                            attributesList.qTypes.map((qType, index) => {
                                                return (
                                                    <div key={'qType_' + index} className="tag">{qType.name + ': ' + qType.questionCount}</div>
                                                )
                                            })
                                        }
                                    </div>
                                    {
                                        attributesList.topics && attributesList.topics.length > 0 &&
                                        renderTable(attributesList.topics)
                                    }
                                </div>
                            </div>
                        </AccordionDetails>
                    </Accordion>
                </div>

                <h2 className="small-title mt-4">Даалгаврууд</h2>
                <div>
                    {
                        questionList && questionList.length > 0 && questionList.map((question, index) => {
                            return <Question
                                key={index}
                                alternateBorder
                                showExtras={false}
                                showCategory
                                showState={false}
                                question={question}
                                questions={questionList}
                                contextMenus={contextMenus}
                                isCheckParentQuestion
                                onContextMenuItemClick={(key, qObj, type) => onContextMenuItemClick?.(key, question, type)}
                                individualContextMenus={true}
                            />
                        })
                    }
                </div>
            </div>
            {
                show &&
                <GroupQuestionsModal
                    show={show}
                    onClose={() => {
                        setShow(false)
                        setSelectedQuestionObj(null)
                    }}
                    selectedSchool={selectedSchool}
                    templateId={templateId}
                    variantId={variantId}
                    onDoneAction={modalActionDone}
                    question={selectedQuestionObj}
                />
            }
            {
                showBank &&
                <QuestionBankModal
                    show={showBank}
                    onClose={() => setShowBank(false)}
                    selectedSchool={selectedSchool}
                    templateId={templateId}
                    variantId={variantId}
                    selectedGradeId={selectedGradeId}
                    selectedSubjectId={selectedSubjectId}
                    onDoneAction={modalActionDone}
                    modalAgainActionDone={modalAgainActionDone}
                />
            }
            {
                showVariant &&
                <VariantModal
                    show={showVariant}
                    onClose={() => setShowVariant(false)}
                    selectedSchool={selectedSchool}
                    templateId={templateId}
                    variantId={variantId}
                    variants={variants}
                    onDoneAction={modalActionDone}
                />
            }
             {
                showChangeOrderModal &&
                <ChangeQuestionOrderModal
                    show={showChangeOrderModal}
                    // topicObj={contextMenuData}
                    selectedSchool={selectedSchool}
                    variantId={variantId}
                    onClose={() => {
                        // setContextMenuData(null)
                        setShowChangeOrderModal(false)
                    }}
                    templateId={templateId}
                    questions={questionList}
                    onSubmit={onChangeOrderSubmit}
                />
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
        </div>
    );
}
