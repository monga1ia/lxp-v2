import Select from "modules/Form/Select";
import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { fetchRequest } from 'utils/fetchRequest';
import message from 'modules/message'
import {
    examQuestionIndex
} from 'utils/fetchRequest/Urls';

const MainInfo = ({
    onOptionsChange = () => { },
    onScoreChange = () => { },
    data = {},
    questionObj = null,
    isQTypeDisabled = false
}) => {
    const { t } = useTranslation();
    const { selectedSchool } = useSelector(state => state.schoolData);
    const [loading, setLoading] = useState(false)
    const [subjects, setSubjects] = useState(data?.subjects || [])
    const [selectedSubject, setSelectedSubject] = useState(data?.selectedSubject || null)
    const [parentTopics, setParentTopics] = useState(data?.parentTopics || [])
    const [childTopics, setChildTopics] = useState(data?.childTopics || [])
    const [qDifficulties, setQDifficulties] = useState(data?.difficulties || [])
    const [qTypes, setQTypes] = useState(data?.types || [])

    const [parentTopic, setParentTopic] = useState(data?.parentTopic || null)
    const [childTopic, setChildTopic] = useState(data?.childTopic || null)
    const [difficulty, setDifficulty] = useState(data?.difficulty || null)
    const [type, setType] = useState(data?.type || null)
    const [typeCode, setTypeCode] = useState(null)
    const [score, setScore] = useState(data?.score || '')

    const [initDataLoaded, setInitDataLoaded] = useState(false)

    const homeworkRef = useRef(null)
    const homeworkHandler = (event) => {
        if (event.key === 'Enter') {
            homeworkRef.current.blur();
        }
    }

    useEffect(() => {
        if(data){
            setSubjects(data?.subjects || [])
            setSelectedSubject(data?.selectedSubject || null)
            setParentTopics(data?.parentTopics || [])
            setParentTopic(data?.parentTopic || null)
            setChildTopic(data?.childTopic || null)
            setChildTopics(data?.childTopics || [])
            setQDifficulties(data?.difficulties || [])
            setQTypes(data?.types || [])
            setType(data?.type || null)
            // setDifficulty(data?.difficulty || null)
            // setScore(data?.score || '')
        }
    }, [data])

    useEffect(() => {
        if(questionObj){
            setSelectedSubject(questionObj?.selectedSubject || null)
            setParentTopic(questionObj?.parentTopic || null)
            setChildTopic(questionObj?.childTopic || null)
            setType(questionObj?.type || null)
            setDifficulty(questionObj?.difficulty || null)
            setScore(questionObj?.score || '')
        }
    }, [questionObj])

    const loadData = (params) => {
        setLoading(true)
        fetchRequest(examQuestionIndex, 'POST', params)
            .then((res) => {
                if (res.success) {
                    setChildTopics(res?.childTopics?.map(topicObj => {
                        return {
                            value: topicObj?.id,
                            text: topicObj?.name
                        }
                    }))
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

    useEffect(() => {
        const qTypeCode = qTypes.find(qTypeObj => {
            return qTypeObj?.value == type
        })?.code;

        if(!questionObj){
            if(qTypeCode == 'TEST'){
                onScoreChange(1)
                if(!initDataLoaded){
                    setScore(1)
                    setInitDataLoaded(true)
                }
            } else {
                onScoreChange(score)
            }
        }

        setTypeCode(qTypeCode)
    }, [type, qTypes])

    useEffect(() => {
        onScoreChange(score)
    }, [score])

    const onParentTopicChange = (value) => {
        setParentTopic(value)
        setChildTopic(null)
        onOptionsChange({
            school: selectedSchool?.id,
            parentTopic: value,
            grade: data?.selectedGrade,
            subject: selectedSubject,
            difficulty: difficulty,
            type: type
        })

        let params = {
            school: selectedSchool?.id,
            grade: data?.selectedGrade,
            subject: selectedSubject,
            parentTopic: value
        }
        
        const subjectIds = [];
        const gradeIds = [];
        if (data?.propGradeSubjects && data?.propGradeSubjects?.length > 0) {
            for (let gs = 0; gs < data?.propGradeSubjects.length; gs++) {
                const gradeSubjectObj = data?.propGradeSubjects[gs];
                if (gradeIds.indexOf(gradeSubjectObj.gradeId) > -1) {
                } else {
                    gradeIds.push(gradeSubjectObj.gradeId)
                }
                if (subjectIds.indexOf(gradeSubjectObj.subjectId) > -1) {
                } else {
                    subjectIds.push(gradeSubjectObj.subjectId)
                }
            }
            params['subjects'] = subjectIds;
            params['grades'] = gradeIds;
        }

        loadData(params)
    }
    const onChildTopicChange = (value) => {
        setChildTopic(value)

        onOptionsChange({
            school: selectedSchool?.id,
            parentTopic: parentTopic,
            childTopic: value,
            childTopics: childTopics,
            grade: data?.selectedGrade,
            subject: selectedSubject,
            difficulty: difficulty,
            type: type
        })
    }
    const onDifficultyChange = (value) => {
        setDifficulty(value)

        onOptionsChange({
            school: selectedSchool?.id,
            parentTopic: parentTopic,
            childTopic: childTopic,
            grade: data?.selectedGrade,
            subject: selectedSubject,
            difficulty: value,
            type: type
        })
    }
    const onTypeChange = (value) => {
        setType(value)

        onOptionsChange({
            school: selectedSchool?.id,
            parentTopic: parentTopic,
            childTopic: childTopic,
            grade: data?.selectedGrade,
            subject: selectedSubject,
            difficulty: difficulty,
            type: value
        })
    }

    const assignmentMarkChange = (event) => {
        if (!(typeCode === 'MULTI' || typeCode === 'LINK' || typeCode === 'MATCH') && event.target.value !== "" && !isNaN(event.target.value) && parseFloat(event.target.value) >= 0)
        {
            if (event.target.value && event.target.value.length > 0) {
                let input = event.target.value
                if (input.match(/^([0-9]{1,})?(\.)?([0-9]{1,})?$/)) {
                    setScore(event.target.value);
                }
                else{
                    setScore('');
                }
            } else {
                setScore('');
            }
        }
        else{
            setScore('');
        }
    }

    return (
        <>
            <h2 className="small-title">{t("menu.generalInformation")}</h2>

            <div className="card-alternate">
                <p className="mb-2 modal-select-title">{t("exam.subject")}</p>
                <Select
                    className="modal-select"
                    clearable
                    disabled
                    options={subjects}
                    value={selectedSubject}
                />

                <p className="my-2 modal-select-title">{t("exam.content")}*</p>
                <Select
                    className="modal-select"
                    clearable
                    searchable
                    options={parentTopics}
                    value={parentTopic}
                    onChange={(value) => onParentTopicChange(value)}
                />

                <p className="my-2 modal-select-title">{t("exam.subSubject")}*</p>
                <Select
                    className="modal-select"
                    clearable
                    searchable
                    options={childTopics}
                    value={childTopic}
                    onChange={(value) => onChildTopicChange(value)}
                />

                <p className="my-2 modal-select-title">{t("exam.evaluation")}*</p>
                <Select
                    className="modal-select"
                    clearable
                    options={qDifficulties}
                    value={difficulty}
                    onChange={(value) => onDifficultyChange(value)}
                />

                <p className="my-2 modal-select-title">{t("quiz.taskType")}*</p>
                <Select
                    className="modal-select"
                    clearable
                    options={qTypes}
                    value={type}
                    onChange={(value) => onTypeChange(value)}
                    disabled={isQTypeDisabled}
                />

                <p className="my-2 modal-select-title">{t("quiz.taskMark")}*</p>
                <input 
                    ref={homeworkRef} 
                    type="te" 
                    disabled={typeCode == 'MULTI' || typeCode == 'LINK' || typeCode == 'MATCH' ? true : false} 
                    value={typeCode == 'MULTI' || typeCode == 'LINK' || typeCode == 'MATCH' ? '' : score} 
                    className="modal-input"
                    onKeyDown={homeworkHandler} 
                    onChange={assignmentMarkChange} 
                />
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
        </>
    );
};

export default MainInfo;
