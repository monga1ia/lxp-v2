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
    data = {}
}) => {
    const { t } = useTranslation();
    const { selectedSchool } = useSelector(state => state.schoolData);

    const [loading, setLoading] = useState(false)

    const [subjects] = useState(data?.subjects || [])
    const [selectedSubject] = useState(data?.selectedSubject || null)
    const [parentTopics, setParentTopics] = useState(data?.parentTopics || [])
    const [childTopics, setChildTopics] = useState(data?.childTopics || [])
    const [qDifficulties, setQDifficulties] = useState(data?.difficulties || [])
    const [qTypes, setQTypes] = useState(data?.types || [])

    const [parentTopic, setParentTopic] = useState(data?.parentTopic || null)
    const [childTopic, setChildTopic] = useState(data?.childTopic || null)
    const [difficulty, setDifficulty] = useState(data?.difficulty || null)
    const [type, setType] = useState(data?.type || null)
    const [typeCode, setTypeCode] = useState(null)
    const [score, setScore] = useState('')

    const homeworkRef = useRef(null)
    const homeworkHandler = (event) => {
        if (event.key === 'Enter') {
            homeworkRef.current.blur();
        }
    }

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
            .catch((e) => {
                message(t('errorMessage.title'));
                setLoading(false)
            })
    }

    useEffect(() => {
        const qTypeCode = qTypes.find(qTypeObj => {
            return qTypeObj?.value === type
        })?.code;

        setTypeCode(qTypeCode)
    }, [type])

    useEffect(() => {
        onScoreChange(score)
    }, [score])

    const subjectDropdownChange = (value) => {
        
    }

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
        loadData({
            school: selectedSchool?.id,
            grade: data?.selectedGrade,
            subject: selectedSubject,
            parentTopic: value
        })
    }
    const onChildTopicChange = (value) => {
        setChildTopic(value)

        onOptionsChange({
            school: selectedSchool?.id,
            parentTopic: parentTopic,
            childTopic: value,
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
        setScore(event.target.value);
    }

    return (
        <>
            <h2 className="small-title">{t("menu.generalInformation")}</h2>

            <div className="card-alternate">
                <p className="mb-2 modal-select-title">{t("exam.subject")}</p>
                <Select
                    className="modal-select"
                    clearable={true}
                    disabled
                    options={subjects}
                    value={selectedSubject}
                    onChange={(value) => subjectDropdownChange(value)}
                />

                <p className="my-2 modal-select-title">{t("exam.content")}*</p>
                <Select
                    className="modal-select"
                    clearable={true}
                    options={parentTopics}
                    value={parentTopic}
                    onChange={(value) => onParentTopicChange(value)}
                />

                <p className="my-2 modal-select-title">{t("exam.subSubject")}*</p>
                <Select
                    className="modal-select"
                    clearable={true}
                    options={childTopics}
                    value={childTopic}
                    onChange={(value) => onChildTopicChange(value)}
                />

                <p className="my-2 modal-select-title">{t("exam.evaluation")}*</p>
                <Select
                    className="modal-select"
                    clearable={true}
                    options={qDifficulties}
                    value={difficulty}
                    onChange={(value) => onDifficultyChange(value)}
                />

                <p className="my-2 modal-select-title">{t("quiz.taskType")}*</p>
                <Select
                    className="modal-select"
                    clearable={true}
                    options={qTypes}
                    value={type}
                    onChange={(value) => onTypeChange(value)}
                />

                <p className="my-2 modal-select-title">{t("quiz.taskMark")}*</p>
                <input disabled={typeCode == 'MULTI' ? true : false} value={typeCode == 'MULTI' ? '' : score} className="modal-input" ref={homeworkRef} onKeyDown={homeworkHandler} onChange={assignmentMarkChange} />
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
