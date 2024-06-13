import React, { useState, useEffect, useRef } from "react";
import { useHistory, useLocation } from "react-router-dom";
import HtmlHead from "components/html-head/HtmlHead";
import { Button, Col, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import ButtonOutline from "components/buttons/ButtonOutline";
import Checkbox from "modules/Form/Checkbox";
import message from 'modules/message';
import { fetchRequest } from 'utils/fetchRequest';
import {
    examQuestionCreate,
    examQuestionIndex
} from 'utils/fetchRequest/Urls';
import { cloneDeep } from "lodash";
import TestAnswer from '../common/testAnswer'
import MultiAnswer from '../common/multiAnswer'
import MatchAnswer from '../common/matchAnswer'
import QuestionAddOpen from '../common/openAnswer'
import QuestionInfo from "../common/questionInfo";
import MainInfo from "../common/filter";

const QuestionAdd = ({
    propSelectedCourseId = null,
    propIsCourse = false,
    propCourseExam = null,
    propBackUrl = false,
    propSelectedGrade = null,
    propSelectedSubject = null,
    propSelectedSyllabus = null,
    propGradeSubjects = [],
    onModalClose = {},
}) => {
    const { t } = useTranslation();
    const { selectedSchool } = useSelector(state => state.schoolData);
    const location = useLocation();
    const history = useHistory();
    const title = t("quiz.quizRegister");
    const description = "";
    const [loading, setLoading] = useState(false)
    const [grades, setGrades] = useState([])
    const [selectedQSchool, setSelectedQSchool] = useState(location?.state?.selectedQSchool || null)
    const [selectedGrade, setSelectedGrade] = useState(location?.state?.selectedGrade || null)
    const [selectedGradeName] = useState(location?.state?.selectedGradeName || null)
    const [subjects, setSubjects] = useState(location?.state?.subjects || [])
    const [selectedSyllabus, setSelectedSyllabus] = useState(location?.state?.selectedSyllabus || null)
    const [selectedSubject, setSelectedSubject] = useState(location?.state?.selectedSubject || null)
    const [parentTopics, setParentTopics] = useState(location?.state?.parentTopics || [])
    const [selectedParentTopic, setSelectedParentTopic] = useState(location?.state?.selectedParentTopic || null)
    const [childTopics, setChildTopics] = useState(location?.state?.childTopics || [])
    const [selectedChildTopic, setSelectedChildTopic] = useState(location?.state?.selectedParentTopic || null)
    const [qDifficulties, setQDifficulties] = useState(location?.state?.qDifficulties || [])
    const [selectedQDifficulty, setSelectedQDifficulty] = useState(location?.state?.selectedDifficulty || null)
    const [qTypes, setQTypes] = useState(location?.state?.qTypes || [])
    const [selectedQType, setSelectedQType] = useState(location?.state?.selectedType || null)
    const [questionScore, setQuestionScore] = useState('')
    const [addAgain, setAddAgain] = useState(false)
    const [clearQuestionData, setClearQuestionData] = useState(false)
    const [courseId, setCourseId] = useState(null)
    const inputRef = useRef([])

    const [questionAnswers, setQuestionAnswers] = useState([
        {
        },
        {
        },
        {
        },
        {
        },
        {
        }
    ])
    const [correctAnswerIndexes, setCorrectAnswerIndexes] = useState([0])

    const [questionData, setQuestionData] = useState({
        question: '',
        questionImage: null,
        questionAudio: null
    })

    const [questionMatchAnswers, setQuestionMatchAnswers] = useState([]);

    const [linkAnswers, setLinkAnswers] = useState(location?.state?.linkAnswers || [])
    const [linkValues, setLinkValues] = useState(location?.state?.linkValues || [])

    const [tmpLinkAnswers, setTmpLinkAnswers] = useState([])
    const [openAnswers, setOpenAnswers] = useState([])
    const [connectedAnswers, setConnectedAnswers] = useState([])

    const [updateView, setUpdateView] = useState(false)

    const [templateId] = useState(location?.state?.template || null)
    const [templateVariantId] = useState(location?.state?.templateVariant || null)
    const [examId] = useState(location?.state?.exam || null)
    const [examVariantId] = useState(location?.state?.examVariant || null)
    const [hasDescription, setHasDescription] = useState(false)
    const [hasShuffle, setHasShuffle] = useState(false)
    const [matchQuestionDefaultAnswers, setMatchQuestionDefaultAnswers] = useState([])
    // const [isTemplate] = useState(location?.state?.isTemplate || null)
    // const [backUrl] = useState(location?.state?.backUrl || null)
    // const [selectedTabIndex] = useState(location?.state?.selectedTabIndex || null)

    useEffect(() => {
        if (propSelectedCourseId) {
            setCourseId(propSelectedCourseId)
            setSelectedGrade(propSelectedGrade)
            setSelectedSubject(propSelectedSubject)
            setSelectedSyllabus(propSelectedSyllabus)
        }
    }, [propSelectedCourseId, propIsCourse, propBackUrl, propSelectedGrade, propSelectedSubject, propSelectedSyllabus])

    useEffect(() => {
        const list = [];
        if (linkAnswers && linkAnswers.length > 0) {
            for (let a = 0; a < linkAnswers.length; a++) {
                const answerValues = []
                if (linkValues && linkValues?.length > 0) {
                    for (let v = 0; v < linkValues?.length; v++) {
                        answerValues.push({
                            name: linkValues[v]?.name,
                            checked: false,
                            value: linkValues[v]?.id
                        })
                    }
                }
                list.push({
                    id: linkAnswers[a]?.id,
                    name: linkAnswers[a]?.name,
                    ordering: linkAnswers[a]?.ordering,
                    score: 0,
                    isConnect: false,
                    data: answerValues
                })
            }
        }
        setTmpLinkAnswers(list)
        setOpenAnswers(list)
    }, [linkAnswers, linkValues])

    useEffect(() => {
    }, [updateView])

    useEffect(() => {
        if (templateId || examId || courseId) {
            let params = {
                school: selectedSchool.id,
                grade: selectedGrade,
                subject: selectedSubject
            }

            const subjectIds = [];
            const gradeIds = [];
            if (propGradeSubjects && propGradeSubjects?.length > 0) {
                for (let gs = 0; gs < propGradeSubjects.length; gs++) {
                    const gradeSubjectObj = propGradeSubjects[gs];
                    if (gradeIds.indexOf(gradeSubjectObj.gradeId) > -1) {
                    } else {
                        gradeIds.push(gradeSubjectObj.gradeId)
                    }
                    if (subjectIds.indexOf(gradeSubjectObj.subjectId) > -1) {
                    } else {
                        subjectIds.push(gradeSubjectObj.subjectId)
                    }
                }
            }
            params['subjects'] = subjectIds;
            params['grades'] = gradeIds;

            loadData(params)
        }
    }, [templateId, examId, courseId])

    const saveButtonClick = () => {
        if (propGradeSubjects && propGradeSubjects?.length > 0) {

        } else {
            if (!selectedSubject) {
                message(t('questionBank.error.subjectEmpty'));
                return
            }
        }        
        // if (!selectedParentTopic) {
        //     message(t('questionBank.error.parentTopicEmpty'));
        //     return
        // }
        // if (!selectedChildTopic) {
        //     message(t('questionBank.error.childTopicEmpty'));
        //     return
        // }
        if (!selectedQDifficulty) {
            message(t('questionBank.error.questionDifficultyEmpty'));
            return
        }
        if (!selectedQType) {
            message(t('questionBank.error.questionTypeEmpty'));
            return
        }

        const qTypeCode = qTypes.find(qTypeObj => {
            return qTypeObj?.value === selectedQType
        })?.code;

        let parentTopicName = parentTopics.find(parentTopicObj => {
            return parentTopicObj?.value === selectedParentTopic
        })?.text;

        let childTopicName = '';
        if (selectedChildTopic) {
            if (childTopics && childTopics.length > 0) {
                childTopicName = childTopics.find(childTopicObj => {
                    return childTopicObj?.value === selectedChildTopic
                })?.text;
            }
        }

        if (qTypeCode === 'TEST') {
            if (!questionData?.question) {
                message(t('questionBank.error.questionEmpty'));
                return
            }

            if (questionAnswers.length > 0) {
                for(let i = 0; i < questionAnswers.length; i++){
                    if(questionAnswers[i].type == 'text' && !questionAnswers[i].value){
                        message(t('questionBank.error.answerEmpty'));
                        return
                    } else if (questionAnswers[i].type == 'image' && !questionAnswers[i].file){
                        message(t('questionBank.error.answerEmpty'));
                        return
                    } else if (questionAnswers[i].type == 'equation' && !questionAnswers[i].equation){
                        message(t('questionBank.error.answerEmpty'));
                        return
                    } else if (questionAnswers[i].type == 'mbscript' && !questionAnswers[i].equation){
                        message(t('questionBank.error.answerEmpty'));
                        return
                    }
                }

                if (correctAnswerIndexes?.length > 0) {
                    let hasCorrectAnswer = false;
                    for (let q = 0; q < questionAnswers.length; q++) {
                        if (q == correctAnswerIndexes[0]) {
                            questionAnswers[q].correct = 1;
                            hasCorrectAnswer = true;
                            break;
                        }
                    }
                    if (hasCorrectAnswer) {
                        const bodyParams = new FormData();

                        bodyParams.append('school', selectedSchool?.id)
                        bodyParams.append('subject', selectedSubject)
                        bodyParams.append('subjectName', subjects?.find(obj => {
                            return obj?.value == selectedSubject
                        })?.text || null)
                        bodyParams.append('grade', selectedGrade)
                        bodyParams.append('gradeName', selectedGradeName)
                        bodyParams.append('parentTopic', selectedParentTopic || '')
                        bodyParams.append('childTopic', selectedChildTopic || '')
                        bodyParams.append('difficulty', selectedQDifficulty || '')
                        bodyParams.append('parentTopicName', parentTopicName || '')
                        bodyParams.append('childTopicName', childTopicName || '')
                        bodyParams.append('hasDescription', hasDescription ? 1 : 0)
                        bodyParams.append('qType', selectedQType || '')
                        bodyParams.append('score', questionScore || '')
                        bodyParams.append('template', templateId || '')
                        bodyParams.append('templateVariant', templateVariantId || '')
                        bodyParams.append('exam', examId || '')
                        bodyParams.append('examVariant', examVariantId || '')
                        bodyParams.append('course', courseId || '')
                        bodyParams.append('courseExam', propCourseExam || '')
                        bodyParams.append('content', questionData?.question)
                        bodyParams.append('hasTradition', questionData?.hasTradition || 0)
                        bodyParams.append('file', questionData?.questionImage)
                        bodyParams.append('audio', questionData?.questionAudio)
                        bodyParams.append('syllabusId', selectedSyllabus || '')

                        for (let q = 0; q < questionAnswers.length; q++) {
                            bodyParams.append('answerValues[' + q + ']', questionAnswers[q]?.value)
                            bodyParams.append('answerFiles[' + q + ']', questionAnswers[q]?.file)
                            bodyParams.append('answerEquations[' + q + ']', questionAnswers[q]?.equation)
                            bodyParams.append('answerTypes[' + q + ']', questionAnswers[q]?.type)
                            bodyParams.append('answerCorrectAnswers[' + q + ']', questionAnswers[q]?.correct || 0)
                            bodyParams.append('answerDescription[' + q + ']', questionAnswers[q]?.description || '')
                        }

                        setLoading(true)
                        fetchRequest(examQuestionCreate, 'POST', bodyParams, true, true)
                            .then((res) => {
                                if (res.success) {
                                    message(t('questionBank.successFullyAdded'), true);
                                    if (addAgain) {
                                        setClearQuestionData(true)
                                        setHasDescription(false)
                                        setQuestionAnswers([
                                            {
                                            },
                                            {
                                            },
                                            {
                                            },
                                            {
                                            },
                                            {
                                            },
                                        ])
                                        setCorrectAnswerIndexes([0])
                                        setQuestionData({
                                            question: '',
                                            questionImage: null,
                                            questionAudio: null
                                        })
                                        setUpdateView(!updateView)
                                    } else {
                                        // if(backUrl){
                                        //     if(templateId){
                                        //         history.push({
                                        //             pathname: backUrl,
                                        //             state: {
                                        //                 id: templateId,
                                        //                 templateVariantId: templateVariantId,
                                        //                 selectedTabIndex: selectedTabIndex,
                                        //             }
                                        //         })
                                        //     } else if(examId) {
                                        //         history.push({
                                        //             pathname: backUrl,
                                        //             state: {
                                        //                 id: examId,
                                        //                 examVariantId: examVariantId,
                                        //                 selectedTabIndex: selectedTabIndex,
                                        //             }
                                        //         })
                                        //     }
                                        // } else {
                                        if (courseId) {
                                            onModalClose()
                                        } else {
                                            history.goBack()
                                        }
                                        // }
                                    }
                                } else {
                                    message(res.message)
                                }
                                setLoading(false)
                            })
                            .catch(() => {
                                message(t('errorMessage.title'));
                                setLoading(false)
                            })

                    } else {
                        message(t('questionBank.error.correctAnswerEmpty'));
                        return null
                    }
                } else {
                    message(t('questionBank.error.correctAnswerEmpty'));
                    return null
                }
            } else {
                message(t('questionBank.error.answerEmpty'));
                return null
            }
        } else if (qTypeCode === 'OPEN') {
            if (!questionScore) {
                message(t('questionBank.error.scoreEmpty'));
                return
            }

            if (!questionData?.question) {
                message(t('questionBank.error.questionEmpty'));
                return
            }

            const bodyParams = new FormData();

            bodyParams.append('school', selectedSchool?.id)
            bodyParams.append('subject', selectedSubject)
            bodyParams.append('subjectName', subjects?.find(obj => {
                return obj?.value == selectedSubject
            })?.text || null)
            bodyParams.append('grade', selectedGrade)
            bodyParams.append('gradeName', selectedGradeName)
            bodyParams.append('parentTopic', selectedParentTopic || '')
            bodyParams.append('childTopic', selectedChildTopic || '')
            bodyParams.append('difficulty', selectedQDifficulty || '')
            bodyParams.append('parentTopicName', parentTopicName || '')
            bodyParams.append('childTopicName', childTopicName || '')
            bodyParams.append('qType', selectedQType || '')
            bodyParams.append('score', questionScore || '')
            bodyParams.append('template', templateId || '')
            bodyParams.append('templateVariant', templateVariantId || '')
            bodyParams.append('exam', examId || '')
            bodyParams.append('examVariant', examVariantId || '')
            bodyParams.append('course', courseId || '')
            bodyParams.append('courseExam', propCourseExam || '')
            bodyParams.append('content', questionData?.question)
            bodyParams.append('hasTradition', questionData?.hasTradition || 0)
            bodyParams.append('file', questionData?.questionImage)
            bodyParams.append('audio', questionData?.questionAudio)
            bodyParams.append('syllabusId', selectedSyllabus || '')

            setLoading(true)
            fetchRequest(examQuestionCreate, 'POST', bodyParams, true, true)
                .then((res) => {
                    if (res.success) {
                        message(t('questionBank.successFullyAdded'), true);
                        if (addAgain) {
                            setClearQuestionData(true)
                            setHasDescription(false)
                            setQuestionAnswers([{
                            }])
                            setCorrectAnswerIndexes([0])
                            setQuestionData({
                                question: '',
                                questionImage: null,
                                questionAudio: null
                            })
                            setUpdateView(!updateView)
                        } else {
                            if (courseId) {
                                onModalClose()
                            } else {
                                history.goBack()
                            }
                        }
                    } else {
                        message(res.message)
                    }
                    setLoading(false)
                })
                .catch(() => {
                    message(t('errorMessage.title'));
                    setLoading(false)
                })
        } else if (qTypeCode === 'MULTI') {
            if (questionAnswers.length > 0) {
                for(let i = 0; i < questionAnswers.length; i++){
                    for(let i = 0; i < questionAnswers.length; i++){
                        if(questionAnswers[i].type == 'text' && !questionAnswers[i].value){
                            message(t('questionBank.error.answerEmpty'));
                            return
                        } else if (questionAnswers[i].type == 'image' && !questionAnswers[i].file){
                            message(t('questionBank.error.answerEmpty'));
                            return
                        } else if (questionAnswers[i].type == 'equation' && !questionAnswers[i].equation){
                            message(t('questionBank.error.answerEmpty'));
                            return
                        } else if (questionAnswers[i].type == 'mbscript' && !questionAnswers[i].equation){
                            message(t('questionBank.error.answerEmpty'));
                            return
                        }
                    }
                }

                if (correctAnswerIndexes?.length > 0) {
                    let hasCorrectAnswer = false;
                    let hasAnswerScore = true;
                    let hasAnswerValue = true;

                    if (!questionData?.question) {
                        message(t('questionBank.error.questionEmpty'));
                        return
                    }

                    for (let q = 0; q < questionAnswers.length; q++) {
                        if (questionAnswers[q].isChecked) {
                            hasCorrectAnswer = true;

                            if (!questionAnswers[q].score) {
                                hasAnswerScore = false
                            }
                        }

                        if (!questionAnswers[q].value) {
                            hasAnswerValue = false
                        }
                    }

                    if (hasCorrectAnswer && hasAnswerScore) {
                        const bodyParams = new FormData();

                        bodyParams.append('school', selectedSchool?.id)
                        bodyParams.append('subject', selectedSubject)
                        bodyParams.append('subjectName', subjects?.find(obj => {
                            return obj?.value == selectedSubject
                        })?.text || null)
                        bodyParams.append('grade', selectedGrade)
                        bodyParams.append('gradeName', selectedGradeName)
                        bodyParams.append('parentTopic', selectedParentTopic || '')
                        bodyParams.append('childTopic', selectedChildTopic || '')
                        bodyParams.append('difficulty', selectedQDifficulty || '')
                        bodyParams.append('qType', selectedQType || '')
                        bodyParams.append('parentTopicName', parentTopicName || '')
                        bodyParams.append('hasDescription', hasDescription ? 1 : 0)
                        bodyParams.append('childTopicName', childTopicName || '')
                        bodyParams.append('template', templateId || '')
                        bodyParams.append('templateVariant', templateVariantId || '')
                        bodyParams.append('exam', examId || '')
                        bodyParams.append('examVariant', examVariantId || '')
                        bodyParams.append('course', courseId || '')
                        bodyParams.append('courseExam', propCourseExam || '')
                        bodyParams.append('content', questionData?.question)
                        bodyParams.append('hasTradition', questionData?.hasTradition || 0)
                        bodyParams.append('file', questionData?.questionImage)
                        bodyParams.append('audio', questionData?.questionAudio)
                        bodyParams.append('syllabusId', selectedSyllabus || '')

                        for (let q = 0; q < questionAnswers.length; q++) {
                            bodyParams.append('answerValues[' + q + ']', questionAnswers[q]?.value)
                            bodyParams.append('answerFiles[' + q + ']', questionAnswers[q]?.file)
                            bodyParams.append('answerEquations[' + q + ']', questionAnswers[q]?.equation)
                            bodyParams.append('answerTypes[' + q + ']', questionAnswers[q]?.type)
                            bodyParams.append('answerCorrectAnswers[' + q + ']', questionAnswers[q]?.isChecked ? 1 : 0)
                            bodyParams.append('answerScore[' + q + ']', questionAnswers[q]?.score ? questionAnswers[q]?.score : 0)
                            bodyParams.append('answerDescription[' + q + ']', questionAnswers[q]?.description || '')
                        }

                        setLoading(true)
                        fetchRequest(examQuestionCreate, 'POST', bodyParams, true, true)
                            .then((res) => {
                                if (res.success) {
                                    message(t('questionBank.successFullyAdded'), true);
                                    if (addAgain) {
                                        setClearQuestionData(true)
                                        setHasDescription(false)
                                        setQuestionAnswers([
                                            {
                                            },
                                            {
                                            },
                                            {
                                            },
                                            {
                                            },
                                            {
                                            },
                                        ])
                                        setCorrectAnswerIndexes([0])
                                        setQuestionData({
                                            question: '',
                                            questionImage: null,
                                            questionAudio: null
                                        })
                                        setUpdateView(!updateView)
                                    } else {
                                        if (courseId) {
                                            onModalClose()
                                        } else {
                                            history.goBack()
                                        }
                                    }
                                } else {
                                    message(res.message)
                                }
                                setLoading(false)
                            })
                            .catch(() => {
                                message(t('errorMessage.title'));
                                setLoading(false)
                            })

                    } else {
                        // if(!hasAnswerValue){
                        //     message(t('questionBank.error.answerEmpty'));
                        // }
                        if (!hasCorrectAnswer) {
                            message(t('questionBank.error.correctAnswerEmpty'));
                        }
                        if (!hasAnswerScore) {
                            message(t('questionBank.error.scoreEmpty'));
                        }

                        return null
                    }
                } else {
                    message(t('questionBank.error.correctAnswerEmpty'));
                    return null
                }
            } else {
                message(t('questionBank.error.answerEmpty'));
                return null
            }
        } else if (qTypeCode === 'LINK') {
            if (questionAnswers.length > 0) {
                if (correctAnswerIndexes?.length > 0) {
                    let hasCorrectAnswer = true;
                    let hasAnswerScore = true;

                    if (!questionData?.question) {
                        message(t('questionBank.error.questionEmpty'));
                        return
                    }

                    // if (connectedAnswers && connectedAnswers.length == 0) {
                    //     message(t('questionBank.error.connectEmpty'));
                    //     return null
                    // }

                    // let connectedAnswersCounter = 0;
                    // for (let c = 0; c < connectedAnswers.length; c++) {
                    //     connectedAnswersCounter += connectedAnswers[c].length;
                    // }

                    // if (openAnswers.length != connectedAnswersCounter) {
                    //     message(t('questionBank.error.deleteNotUsedAnswer'));
                    //     return null
                    // }

                    let scoreCount = 0;
                    let checkedCount = 0
                    for (let q = 0; q < openAnswers.length; q++) {
                        if (openAnswers[q].data && openAnswers[q].data.length > 0) {
                            let answerData = openAnswers[q].data;
                            let isChecked = false;
                            for (let d = 0; d < answerData.length; d++) {
                                if (answerData[d].checked) {
                                    hasCorrectAnswer = false;
                                    isChecked = true
                                    if (!openAnswers[q].isConnect) {
                                        checkedCount += 1;
                                    }
                                    break
                                } else {
                                    hasCorrectAnswer = true;
                                }
                            }

                            if (isChecked) {
                                if (openAnswers[q].score && !openAnswers[q].isConnect) {
                                    scoreCount += 1
                                }
                            }
                        }
                    }

                    if (scoreCount > 0 && checkedCount > 0 && checkedCount == scoreCount) {
                        hasAnswerScore = false;
                    }

                    if (!hasCorrectAnswer && !hasAnswerScore) {
                        const bodyParams = new FormData();

                        bodyParams.append('school', selectedSchool?.id)
                        bodyParams.append('subject', selectedSubject)
                        bodyParams.append('subjectName', subjects?.find(obj => {
                            return obj?.value == selectedSubject
                        })?.text || null)
                        bodyParams.append('grade', selectedGrade)
                        bodyParams.append('gradeName', selectedGradeName)
                        bodyParams.append('parentTopic', selectedParentTopic || '')
                        bodyParams.append('childTopic', selectedChildTopic || '')
                        bodyParams.append('difficulty', selectedQDifficulty || '')
                        bodyParams.append('parentTopicName', parentTopicName || '')
                        bodyParams.append('childTopicName', childTopicName || '')
                        bodyParams.append('qType', selectedQType || '')
                        bodyParams.append('template', templateId || '')
                        bodyParams.append('templateVariant', templateVariantId || '')
                        bodyParams.append('exam', examId || '')
                        bodyParams.append('examVariant', examVariantId || '')
                        bodyParams.append('course', courseId || '')
                        bodyParams.append('courseExam', propCourseExam || '')
                        bodyParams.append('content', questionData?.question)
                        bodyParams.append('hasTradition', questionData?.hasTradition || 0)
                        bodyParams.append('file', questionData?.questionImage)
                        bodyParams.append('audio', questionData?.questionAudio)
                        bodyParams.append('answers', JSON.stringify(openAnswers))
                        bodyParams.append('connectedAnswers', JSON.stringify(connectedAnswers))
                        bodyParams.append('syllabusId', selectedSyllabus || '')

                        setLoading(true)
                        fetchRequest(examQuestionCreate, 'POST', bodyParams, true, true)
                            .then((res) => {
                                if (res.success) {
                                    message(t('questionBank.successFullyAdded'), true);
                                    if (addAgain) {
                                        for(let i = 0; i < tmpLinkAnswers.length; i++){
                                            tmpLinkAnswers[i].score = 0
                                            if(tmpLinkAnswers[i].data && tmpLinkAnswers[i].data.length > 0){
                                                let listData = tmpLinkAnswers[i].data;
                                                for(let d = 0; d < listData.length; d++){
                                                    listData[d].checked = false
                                                }
                                            }
                                        }
                                        setOpenAnswers(tmpLinkAnswers)
                                        setClearQuestionData(true)
                                        setHasDescription(false)
                                        setQuestionAnswers([{
                                        }])
                                        setCorrectAnswerIndexes([0])
                                        setQuestionData({
                                            question: '',
                                            questionImage: null,
                                            questionAudio: null
                                        })
                                        setUpdateView(!updateView)
                                    } else {
                                        if (courseId) {
                                            onModalClose()
                                        } else {
                                            history.goBack()
                                        }
                                    }
                                } else {
                                    message(res.message)
                                }
                                setLoading(false)
                            })
                            .catch(() => {
                                message(t('errorMessage.title'));
                                setLoading(false)
                            })
                    } else {
                        if (hasCorrectAnswer) {
                            message(t('questionBank.error.answerEmpty'));
                            return null
                        }

                        message(t('questionBank.error.answerScoreEmpty'));
                        return null
                    }
                } else {
                    message(t('questionBank.error.correctAnswerEmpty'));
                    return null
                }
            } else {
                message(t('questionBank.error.answerEmpty'));
                return null
            }
        } else if (qTypeCode === 'MATCH') {
            if (!questionData?.question) {
                message(t('questionBank.error.questionEmpty'));
                return
            }
            
            let dataList = [];
            if (questionMatchAnswers && questionMatchAnswers.length > 0) {
                for (let i = 0; i < questionMatchAnswers.length; i++) {

                    let answerArray = [];
                    if (questionMatchAnswers[i].data && questionMatchAnswers[i].data.length > 0) {
                        let answerData = questionMatchAnswers[i].data;


                        for (let d = 0; d < answerData.length; d++) {
                            answerArray.push(answerData[d])
                        }
                    }

                    dataList.push(answerArray)
                }
            }

            if(dataList.length == 0){
                message(t('questionBank.error.insertMatchQuestion'));
                return null
            }

            for(let i = 0; i < dataList.length; i++){
                let questionValues = dataList[i];

                if(questionValues && questionValues.length > 0){
                    for(let q = 0; q < questionValues.length; q++){
                    
                        if(questionValues[q].answer){
                            if(questionValues[q].answer.type == 'text' || questionValues[q].answer.type == 'mbscript'){
                                if(!questionValues[q].answer.value){
                                    message(t('questionBank.error.insertMatchQuestion'));
                                    return null
                                }
                            } else if (questionValues[q].answer.type == 'image'){
                                if(!questionValues[q].answer.file){
                                    message(t('questionBank.error.insertMatchQuestion'));
                                    return null
                                }
                            }
                        }
                        
                        if(questionValues[q].value){
                            if(questionValues[q].value.type == 'text' || questionValues[q].value.type == 'mbscript'){
                                if(!questionValues[q].value.value){
                                    message(t('questionBank.error.insertMatchQuestion'));
                                    return null
                                }
                            } else if(questionValues[q].value.type == 'image'){
                                if(!questionValues[q].value.file){
                                    message(t('questionBank.error.insertMatchQuestion'));
                                    return null
                                }
                            }

                            if(!questionValues[q].value.score){
                                message(t('questionBank.error.scoreEmpty'));
                                return null
                            }
                        }
                    }
                }
            }

            const bodyParams = new FormData();

            bodyParams.append('school', selectedSchool?.id)
            bodyParams.append('subject', selectedSubject)
            bodyParams.append('subjectName', subjects?.find(obj => {
                return obj?.value == selectedSubject
            })?.text || null)
            bodyParams.append('grade', selectedGrade)
            bodyParams.append('gradeName', selectedGradeName)
            bodyParams.append('parentTopic', selectedParentTopic || '')
            bodyParams.append('childTopic', selectedChildTopic || '')
            bodyParams.append('difficulty', selectedQDifficulty || '')
            bodyParams.append('parentTopicName', parentTopicName || '')
            bodyParams.append('childTopicName', childTopicName || '')
            bodyParams.append('hasShuffle', hasShuffle ? 1 : 0)
            bodyParams.append('qType', selectedQType || '')
            bodyParams.append('template', templateId || '')
            bodyParams.append('templateVariant', templateVariantId || '')
            bodyParams.append('exam', examId || '')
            bodyParams.append('examVariant', examVariantId || '')
            bodyParams.append('course', courseId || '')
            bodyParams.append('courseExam', propCourseExam || '')
            bodyParams.append('content', questionData?.question)
            bodyParams.append('hasTradition', questionData?.hasTradition || 0)
            bodyParams.append('syllabusId', selectedSyllabus || '')

            for (let q = 0; q < dataList.length; q++) {
                const mAnswerParams = dataList[q]

                let paramMAnswer = null;
                let paramMValue = null;

                if (mAnswerParams && mAnswerParams?.length > 0) {
                    for (let p = 0; p < mAnswerParams.length; p++) {
                        if (mAnswerParams[p].answer) {
                            paramMAnswer = mAnswerParams[p].answer;
                        } else if (mAnswerParams[p].value) {
                            paramMValue = mAnswerParams[p].value;
                        }
                    }
                }

                if (paramMAnswer && paramMValue) {
                    bodyParams.append('mAnswerValues[' + q + ']', paramMAnswer?.value)
                    bodyParams.append('mAnswerFiles[' + q + ']', paramMAnswer?.file)
                    bodyParams.append('mAnswerEquations[' + q + ']', paramMAnswer?.equation)
                    bodyParams.append('mAnswerTypes[' + q + ']', paramMAnswer?.type)

                    bodyParams.append('mValues[' + q + ']', paramMValue?.value)
                    bodyParams.append('mValueFiles[' + q + ']', paramMValue?.file)
                    bodyParams.append('mValueEquations[' + q + ']', paramMValue?.equation)
                    bodyParams.append('mValueTypes[' + q + ']', paramMValue?.type)
                    bodyParams.append('mValueScores[' + q + ']', paramMValue?.score)
                }
            }
            setLoading(true)
            fetchRequest(examQuestionCreate, 'POST', bodyParams, true, true)
                .then((res) => {
                    if (res.success) {
                        message(t('questionBank.successFullyAdded'), true);
                        if (addAgain) {
                            setClearQuestionData(true)
                            setHasDescription(false)
                            setQuestionAnswers([{
                            }])
                            setCorrectAnswerIndexes([0])
                            setQuestionData({
                                question: '',
                                questionImage: null,
                                questionAudio: null
                            })
                            setMatchQuestionDefaultAnswers([
                                {
                                    data: [
                                        {
                                            answer: {
                                                equation: null,
                                                file: null,
                                                score: null,
                                                type: "text",
                                                value: ""
                                            },
                                        },
                                        {
                                            value: {
                                                equation: null,
                                                file: null,
                                                score: null,
                                                type: "text",
                                                value: ""
                                            }
                                        },
                                    ]
                                }
                            ])
                            setUpdateView(!updateView)
                        } else {
                            if (courseId) {
                                onModalClose()
                            } else {
                                history.goBack()
                            }
                        }
                    } else {
                        message(res.message)
                    }
                    setLoading(false)
                })
                .catch(() => {
                    message(t('errorMessage.title'));
                    setLoading(false)
                })
        }
    }

    const loadData = (params) => {
        setLoading(true)
        fetchRequest(examQuestionIndex, 'POST', params)
            .then((res) => {
                if (res.success) {
                    setGrades(res?.grades?.map(gradeObj => {
                        return {
                            value: gradeObj?.value,
                            text: gradeObj?.text
                        }
                    }))
                    setSubjects(res?.subjects?.map(subjectObj => {
                        return {
                            value: subjectObj?.id,
                            text: subjectObj?.name
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

                    if(!selectedQType){
                        for(let i = 0; i < res?.qTypes.length; i++){
                            if(res?.qTypes[i].code == 'TEST'){
                                setSelectedQType(res?.qTypes[i].id)
                            }
                        }
                    }
                    
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
                            code: qDifficultyObj?.code,
                            text: qDifficultyObj?.name
                        }
                    }))

                    if (linkAnswers && linkAnswers.length == 0) {
                        let resLinkAnswers = res?.refAnswers
                        let resLinkValues = res?.refValues

                        setLinkAnswers(resLinkAnswers)
                        setLinkValues(resLinkValues)
                    }
                } else {
                    message(res.message)
                }
                setLoading(false)
            })
            .catch(() => {
                message(t('errorMessage.title'));
                setLoading(false)
            })
    }

    const onAnswerAdd = () => {
        const answerList = [...questionAnswers];
        answerList.push({})
        setQuestionAnswers(answerList)
    }

    const onAnswerSelect = (i, value) => {
        const qTypeCode = qTypes.find(qTypeObj => {
            return qTypeObj?.value === selectedQType
        })?.code;

        if (qTypeCode === 'TEST') {
            const answerArray = [];
            answerArray.push(i)
            setCorrectAnswerIndexes(answerArray)
        } else if (qTypeCode === 'MULTI') {
            const answerList = [...questionAnswers];
            answerList[i].isChecked = value;
            answerList[i].score = null;
            setQuestionAnswers(answerList);
        }
    }

    const onAnswerScore = (i, value) => {
        const qTypeCode = qTypes.find(qTypeObj => {
            return qTypeObj?.value === selectedQType
        })?.code;

        if (value && value.length > 0) {
            if (qTypeCode === 'MULTI') {
                const answerList = [...questionAnswers];
                let input = value
                if (input.match(/^([0-9]{1,})?(\.)?([0-9]{1,})?$/)) {
                    for (let a = 0; a < answerList.length; a++) {
                        if (a === i) {
                            answerList[a].score = value
                            break;
                        }
                    }
                }
                setQuestionAnswers(answerList);
            }
        } else {
            const answerList = [...questionAnswers];
            for (let a = 0; a < answerList.length; a++) {
                if (a === i) {
                    answerList[a].score = ''
                    break;
                }
            }
            setQuestionAnswers(answerList);
        }
    }

    const onAnswerRemove = (i) => {
        const cloneQuestionAnswers = [...questionAnswers];
        cloneQuestionAnswers.splice(i, 1);
        setQuestionAnswers(cloneQuestionAnswers)
    }

    const onQuestionChanged = (question, imageValue, audioValue, hasTradition) => {
        setQuestionData({
            question: question,
            questionImage: imageValue,
            questionAudio: audioValue,
            hasTradition: hasTradition
        })
        setClearQuestionData(false)
    }

    const onAnswerChanged = (i, answerType, answerValue, answerImage, answerEquation, answerMbScript, answerObj, descriptionValue) => {
        const answerList = [...questionAnswers];
        for (let a = 0; a < answerList.length; a++) {
            if (a === i) {
                answerList[a].type = answerType;
                switch (answerType) {
                    case 'text':
                        answerList[a].value = answerValue;
                        answerList[a].file = null;
                        answerList[a].equation = null;
                        answerList[a].isChecked = answerObj?.isChecked || false;
                        answerList[a].score = answerObj?.score || null;
                        answerList[a].description = descriptionValue || null;
                        break;
                    case 'image':
                        answerList[a].file = answerImage;
                        answerList[a].value = null;
                        answerList[a].equation = null;
                        answerList[a].isChecked = answerObj?.isChecked || false;
                        answerList[a].score = answerObj?.score || null;
                        answerList[a].description = descriptionValue || null;
                        break;
                    case 'equation':
                        answerList[a].value = null;
                        answerList[a].file = null;
                        answerList[a].equation = answerEquation;
                        answerList[a].isChecked = answerObj?.isChecked || false;
                        answerList[a].score = answerObj?.score || null;
                        answerList[a].description = descriptionValue || null;
                        break;
                    case 'mbscript':
                        answerList[a].value = null;
                        answerList[a].file = null;
                        answerList[a].equation = answerMbScript;
                        answerList[a].isChecked = answerObj?.isChecked || false;
                        answerList[a].score = answerObj?.score || null;
                        answerList[a].description = descriptionValue || null;
                        break;
                    default:
                        break;
                }
                break;
            }
        }
        setQuestionAnswers(answerList)
        setClearQuestionData(false)
    }

    const handlerLinkValues = (selectedAnswerId, connectedArray, score) => {
        let cloneAnswers = [...openAnswers];
        setConnectedAnswers(connectedArray)

        let selectedIds = [];
        if (connectedArray && connectedArray.length > 0) {
            for (let i = 0; i < connectedArray.length; i++) {
                if (connectedArray[i] && connectedArray[i].length > 0) {
                    let linkedArray = connectedArray[i];
                    for (let c = 0; c < linkedArray.length; c++) {
                        if (c != 0) {
                            selectedIds.push(linkedArray[c])
                        }
                    }
                }
            }
        }

        if (cloneAnswers && cloneAnswers.length > 0) {
            for (let i = 0; i < cloneAnswers.length; i++) {
                if (cloneAnswers[i].id == selectedAnswerId) {
                    cloneAnswers[i].score = score
                } else {
                    if (selectedIds && selectedIds.length > 0) {
                        for (let s = 0; s < selectedIds.length; s++) {
                            if (cloneAnswers[i].id == selectedIds[s]) {
                                cloneAnswers[i].score = 0
                                cloneAnswers[i].isConnect = true
                            }
                        }
                    }
                }
            }
        }

        setOpenAnswers(cloneAnswers)
    }

    const handlerRowValue = (answerList = [], connectedArray = []) => {
        setOpenAnswers(answerList)
    }

    const handlerLinkRemoveButton = (answerList, index) => {
        let cloneAnswers = cloneDeep([...answerList]);

        let allConnectedArray = []
        for (let ca = 0; ca < connectedAnswers.length; ca++) {
            let connectedArray = connectedAnswers[ca]
            if (connectedArray && connectedArray.length > 0) {
                allConnectedArray = allConnectedArray.concat(connectedArray)
            }
        }
        if (allConnectedArray && allConnectedArray.length > 0) {
            allConnectedArray = [...new Set(allConnectedArray)]
        }

        if (allConnectedArray && allConnectedArray.length > 0) {
            if (allConnectedArray.indexOf(cloneAnswers[index].id) > -1) {
                message(t('questionBank.error.connectedError'));
                return
            }
        }
        cloneAnswers.splice(index, 1)
        setOpenAnswers(cloneAnswers)
    }

    const resetOpenAnswers = () => {
        setOpenAnswers(tmpLinkAnswers)
    }

    const onResetConnection = (answer, connectedArray) => {
        let cloneAnswers = [...openAnswers];
        setConnectedAnswers(connectedArray)

        if (cloneAnswers && cloneAnswers.length > 0) {
            for (let i = 0; i < cloneAnswers.length; i++) {
                if (cloneAnswers[i].id == answer?.id) {
                    cloneAnswers[i].score = ''
                    break;
                }
            }
        }

        setOpenAnswers(cloneAnswers)
    }

    const matchQuestionSetData = (questionMatch) => {
        setQuestionMatchAnswers(questionMatch)
    }

    const onInputKeyDown = (e, index) => {
        if(e.which == 40){
            if(inputRef.current[index + 1]){
                inputRef.current[index + 1].focus()
            }
        }
        if(e.which == 38){
            if(inputRef.current[index - 1]){
                inputRef.current[index - 1].focus()
            }
        }
    }

    const renderAnswers = (qTypeId = null) => {
        const qTypeCode = qTypes.find(qTypeObj => {
            return qTypeObj?.value === qTypeId
        })?.code;

        switch (qTypeCode) {
            case 'TEST':
                return <div className="card-alternate">
                    {
                        questionAnswers?.map((qObj, i) => {
                            return <TestAnswer key={'answerIndex_' + i}
                                action={'add'}
                                inputRef={el => inputRef.current[i] = el}
                                rowIndex={i}
                                questionObj={qObj || null}
                                clearData={clearQuestionData}
                                onSelectRow={onAnswerSelect}
                                removeRow={onAnswerRemove}
                                selectedAnswerIndex={correctAnswerIndexes?.length > 0 ? correctAnswerIndexes[0] : 0}
                                onAnswerChanged={onAnswerChanged}
                                hasDescription={hasDescription}
                                onInputKeyDown={onInputKeyDown}
                            />
                        })
                    }
                    <div style={{ width: 150, position: 'relative', left: 177 }} className="mt-2">
                        <ButtonOutline text={t("quiz.addQuiz")} primary onClick={onAnswerAdd} />
                    </div>
                </div>
            case 'OPEN':
                return <div className="card-alternate">
                    {t('info.openQuestion')}
                </div>
            case 'LINK':
                return <div className="card-alternate">
                    <QuestionAddOpen
                        propIsCourse={propIsCourse}
                        openAnswers={openAnswers}
                        linkAnswers={linkAnswers}
                        linkValues={linkValues}
                        onChangeValues={handlerLinkValues}
                        onChangeAnswerValue={handlerRowValue}
                        onRemoveButton={handlerLinkRemoveButton}
                        onResetButtonAction={resetOpenAnswers}
                        onResetConnection={onResetConnection}
                    />
                </div>
            case 'MULTI':
                return <div className="card-alternate">
                    {
                        questionAnswers?.map((qObj, i) => {
                            return <MultiAnswer key={'answerIndex_' + i}
                                action={'add'}
                                inputRef={el => inputRef.current[i] = el}
                                rowIndex={i}
                                questionObject={qObj}
                                clearData={clearQuestionData}
                                onSelectRow={onAnswerSelect}
                                removeRow={onAnswerRemove}
                                selectedAnswerIndex={correctAnswerIndexes?.length > 0 ? correctAnswerIndexes[0] : 0}
                                onAnswerChanged={onAnswerChanged}
                                onInputScoreChange={onAnswerScore}
                                hasDescription={hasDescription}
                                onInputKeyDown={onInputKeyDown}
                            />
                        })
                    }
                    <div style={{ width: 150, position: 'relative', left: 184 }} className="mt-2">
                        <ButtonOutline text={t("quiz.addQuiz")} primary onClick={onAnswerAdd} />
                    </div>
                </div>
            case 'MATCH':
                return <MatchAnswer
                    onSelectRow={onAnswerSelect}
                    removeRow={onAnswerRemove}
                    onAnswerChanged={onAnswerChanged}
                    onInputScoreChange={onAnswerScore}
                    passData={matchQuestionSetData}
                    defaultAnswers={matchQuestionDefaultAnswers}
                />
            default:
                return <div>
                    Асуултын төрөл сонгоно уу
                </div>
        }
    }

    const onOptionChange = (data) => {
        const qType = qTypes.find(qTypeObj => {
            return qTypeObj?.value?.toString() === data?.type?.toString()
        });
        const qDifficulty = qDifficulties.find(qDifficultyObj => {
            return qDifficultyObj?.value?.toString() === data?.difficulty?.toString()
        })
        setSelectedQType(qType?.value)
        setSelectedQDifficulty(qDifficulty?.value)
        setSelectedParentTopic(data?.parentTopic)
        setSelectedChildTopic(data?.childTopic)
        if (data?.childTopics && data?.childTopics.length > 0) {
            setChildTopics(data?.childTopics)
        }
    }

    const onScoreChange = (score) => {
        setQuestionScore(score)
    }

    const onCheckboxChange = (value) => {
        setAddAgain(!value)
    }

    const onHandlerBackButton = () => {
        onModalClose(true)
    }

    const onHandlerHasDescription = (value) => {
        setHasDescription(value)
    }

    const onHandlerHasShuffle = (value) => {
        setHasShuffle(value)
    }

    return (
        <>
            <HtmlHead title={title} description={description} />

            <div className="screen-padding">
                <div className="layoutless-page">
                    <div className="header">
                        <span>{t('quiz.quizRegister')}</span>
                        {
                            courseId
                                ?
                                <span className="cursor-pointer back-button" onClick={() => onHandlerBackButton()}>
                                    {t('common.back')}
                                </span>
                                :
                                <span className="cursor-pointer back-button" onClick={history.goBack}>
                                    {t('common.back')}
                                </span>
                        }
                    </div>

                    <Row className="g-4 screen-padding">
                        <Col xl="4" xxl="3">
                            <MainInfo
                                data={{
                                    grades: grades,
                                    selectedGrade: selectedGrade,
                                    subjects: subjects,
                                    selectedSubject: selectedSubject,
                                    parentTopics: parentTopics,
                                    parentTopic: selectedParentTopic,
                                    childTopics: childTopics,
                                    childTopic: selectedChildTopic,
                                    difficulties: qDifficulties,
                                    difficulty: selectedQDifficulty,
                                    types: qTypes,
                                    type: selectedQType,
                                    propGradeSubjects
                                }}
                                onOptionsChange={onOptionChange}
                                onScoreChange={onScoreChange}
                            />
                        </Col>

                        <Col xl="8" xxl="9">
                            <QuestionInfo
                                clearData={clearQuestionData}
                                onQuestionChanged={onQuestionChanged}
                                onHandlerHasDescription={onHandlerHasDescription}
                                onHandlerHasShuffle={onHandlerHasShuffle}
                                selectedQTypeCode={
                                    selectedQType &&
                                    qTypes.find(qTypeObj => {
                                        return qTypeObj?.value === selectedQType
                                    })?.code
                                }
                            />
                            <h2 className="small-title mt-4">{t("common.answer")}</h2>
                            {
                                renderAnswers(selectedQType)
                            }
                        </Col>
                    </Row>

                    <div className="question-footer" style={{height: 83}}>
                        <div
                            className="d-flex flex-row justify-content-end align-items-center cursor-pointer"
                        >
                            <Checkbox
                                label={t('quiz.addMoreQuestions')}
                                checked={addAgain}
                                onChange={(e) => onCheckboxChange(e)}
                            />
                        </div>
                        <div className="d-flex align-items-center question-footer-center">
                            {
                                templateId
                                    ?
                                    <div
                                        onClick={history.goBack}
                                        className="cursor-pointer cancel-button pr-2"
                                    >
                                        {t('common.back')}
                                    </div>
                                    :
                                    <>
                                        {
                                            courseId
                                                ?
                                                <div
                                                    onClick={() => onHandlerBackButton()}
                                                    className="cursor-pointer cancel-button pr-2"
                                                >
                                                    {t('common.back')}
                                                </div>
                                                :
                                                <div
                                                    onClick={history.goBack}
                                                    className="cursor-pointer cancel-button pr-2"
                                                >
                                                    {t('common.cancel')}
                                                </div>
                                        }
                                    </>
                            }
                            <Button className="save-button ml-4" variant="empty" onClick={saveButtonClick}>
                                <span style={{ color: "#555555" }}>{t('common.save').toUpperCase()}</span>
                            </Button>
                        </div>
                    </div>
                </div>
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
        </>
    );
};

export default QuestionAdd;
