import React, { useState, useRef, useEffect } from "react";
import { Col, Row, Button, Modal } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useBottomScrollListener } from 'react-bottom-scroll-listener';
import Checkbox from "modules/Form/Checkbox";
import Select from "modules/Form/Select";
import { fetchRequest } from "utils/fetchRequest";
import { examTemplateSelect, examQuestionIndex } from 'utils/fetchRequest/Urls';
import showMessage from "modules/message";
import FilterIcon from "cs-line-icons/custom/FilterIcon";
import Question from "../../../questions/question"

export default function QuestionBankModal({ 
    show, 
    onClose, 
    selectedSchool,
    templateId,
    variantId,
    selectedGradeId,
    selectedSubjectId,
    onDoneAction,
    modalAgainActionDone
}) {
    const { t } = useTranslation();
    const inputRef = useRef(null);
    const [loading, setLoading] = useState(false)

    const [addAgain, setAddAgain] = useState(false);

    const [totalCount, setTotalCount] = useState(0)
    const [list, setList] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    // const [hasMorePage, setHasMorePage] = useState(false)

    const [parentTopics, setParentTopics] = useState([])
    const [childTopics, setChildTopics] = useState([])
    const [qDifficulties, setQDifficulties] = useState([])
    const [qTypes, setQTypes] = useState([])
    const [selectedParentTopic, setSelectedParentTopic] = useState(null)
    const [selectedChildTopic, setSelectedChildTopic] = useState(null)
    const [selectedQDifficulty, setSelectedQDifficulty] = useState(null)
    const [selectedQType, setSelectedQType] = useState(null)
    const [score, setScore] = useState('')

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

    const init = (params) => {
        setLoading(true)
        fetchRequest(examQuestionIndex, 'POST', params)
            .then((res) => {
                setLoading(false)
                if (res.success) {
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
                    setQDifficulties(res?.qDifficulties?.map(qDifficultyObj => {
                        return {
                            value: qDifficultyObj?.id,
                            text: qDifficultyObj?.name
                        }
                    }))
                    setQTypes(res?.qTypes?.map(qTypeObj => {
                        return {
                            value: qTypeObj?.id,
                            code: qTypeObj?.code,
                            text: qTypeObj?.name
                        }
                    }))
                    if (params?.showQuestion) {
                        setCurrentPage(res?.page)
                        setTotalCount(res?.totalCount)
                        if (res?.page > 1) {
                            const newList = [...list, ...res?.list];
                            setList(uniqueList(newList))
                        } else {
                            setList(res?.list)
                        }
                        // setHasMorePage(res?.hasMorePage)
                    }
                } else {
                    showMessage(res.message)
                }
            })
            .catch(() => {
                showMessage(t('errorMessage.title'));
                setLoading(false)
            })
    }

    const callback = () => {
        if(variantId && !loading && totalCount > list.length){
            let params = {
                school: selectedSchool.id,
                template: templateId,
                examTemplateVariant: variantId,
                grade: selectedGradeId,
                subject: selectedSubjectId,
                showQuestion: 1,
                page: (parseInt(currentPage) + 1),
                parentTopic: selectedParentTopic,
                childTopic: selectedChildTopic,
                qDifficulty: selectedQDifficulty,
                qType: selectedQType,
                score: score
            }
    
            init(params, currentPage);
        }
    }

    const scrollRef = useBottomScrollListener(callback, 0, 200, undefined, true);

    useEffect(() => {
        let params = {
            school: selectedSchool.id,
            template: templateId,
            examTemplateVariant: variantId,
            grade: selectedGradeId,
            subject: selectedSubjectId,
            showQuestion: 1,
            qDifficulty: selectedQDifficulty,
            qType: selectedQType,
            score: score
        }

        init(params);
    }, []);

    const parentTopicChange = (value) => {
        setSelectedParentTopic(value)

        let params = {
            school: selectedSchool.id,
            template: templateId,
            examTemplateVariant: variantId,
            grade: selectedGradeId,
            subject: selectedSubjectId,
            parentTopic: value,
            showQuestion: 1,
            qDifficulty: selectedQDifficulty,
            qType: selectedQType,
            score: score
        }

        init(params);
    }

    const childTopicChange = (value) => {
        setSelectedChildTopic(value)
    }

    const difficultyChange = (value) => {
        setSelectedQDifficulty(value)
    }

    const qTypeChange = (value) => {
        setSelectedQType(value)
    }

    const assignmentMarkSubmit = (event) => {
        if (event.key === 'Enter') {
            inputRef.current.blur();
        }
    }

    const clearAll = () => {
        setSelectedParentTopic(null)
        setSelectedChildTopic(null)
        setSelectedQDifficulty(null)
        setSelectedQType(null)
        setScore('')
    }

    const handleInputChange = (event) => {
        setScore(event.target.value);
    };

    const handlerSearch = () => {
        let params = {
            school: selectedSchool.id,
            template: templateId,
            examTemplateVariant: variantId,
            grade: selectedGradeId,
            subject: selectedSubjectId,
            parentTopic: selectedParentTopic,
            childTopic: selectedChildTopic,
            showQuestion: 1,
            qDifficulty: selectedQDifficulty,
            qType: selectedQType,
            score: score
        }

        init(params);
    }

    const checkboxHandler = (value) => {
        setAddAgain(!value)
    }

    const handlerSelectedPasser = (id, value) => {
        let cloneList = [...list];

        if(cloneList && cloneList.length > 0){
            for(let i = 0; i < cloneList.length; i++){
                if(id == cloneList[i].id){
                    cloneList[i].isChecked = value
                }
            }
        }

        setList(cloneList)
    }

    const handleProceedButton = () => {
        let ids = [];
        // let cloneList = [...list]

        if(list && list.length > 0){
            for(let i = 0; i < list.length; i++){
                if(list[i].isChecked){
                    ids.push(list[i].id)
                }
            }
        }

        let params = {
            school: selectedSchool.id,
            template: templateId,
            variant: variantId,
            questions: JSON.stringify(ids)
        }

        setLoading(true)
        fetchRequest(examTemplateSelect, 'POST', params)
            .then((res) => {
                if (res.success) {
                    if(addAgain){
                        let cloneList = [...list]

                        if(cloneList && cloneList.length > 0){
                            for(let i = 0; i < cloneList.length; i++){
                                for(let d = 0; d < ids.length; d++){
                                    if(ids[d] == cloneList[i].id){
                                        cloneList.splice(i, 1);
                                    }
                                }
                            }
                        }

                        setList(cloneList)
                        modalAgainActionDone()
                    } else {
                        onDoneAction()
                    }
                    setLoading(false)
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

    return (
        <Modal
            show={show}
            onHide={onClose}
            size='xl'
            aria-labelledby="contained-modal-title-vcenter"
            centered
            scrollable
        >
            <Modal.Header className="p-3">
                <Modal.Title className="modal-title d-flex flex-row justify-content-between w-100">
                    {t("quiz.chooseFromQuestionBank")}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body ref={scrollRef} style={{minHeight: 500}}>
                <Row>
                    <Col xl="4" xxl="3">
                        <h2 className="small-title">{t("action.filter")}</h2>
                        <div className="card-alternate">
                            <p className="mb-2 modal-select-title">{t("exam.content")}*</p>
                            <Select
                                isClearable
                                multiple={false}
                                options={parentTopics}
                                value={selectedParentTopic}
                                searchable
                                onChange={(value) => parentTopicChange(value)}
                            />

                            <p className="my-2 modal-select-title">{t("exam.subSubject")}*</p>
                            <Select
                                isClearable
                                multiple={false}
                                options={childTopics}
                                value={selectedChildTopic}
                                searchable
                                onChange={(value) => childTopicChange(value)}
                            />

                            <p className="my-2 modal-select-title">{t("exam.evaluation")}*</p>
                            <Select
                                isClearable
                                multiple={false}
                                options={qDifficulties}
                                value={selectedQDifficulty}
                                searchable
                                onChange={(value) => difficultyChange(value)}
                            />

                            <p className="my-2 modal-select-title">{t("quiz.taskType")}*</p>
                            <Select
                                isClearable
                                multiple={false}
                                options={qTypes}
                                value={selectedQType}
                                searchable
                                onChange={(value) => qTypeChange(value)}
                            />

                            <p className="my-2 modal-select-title">{t("quiz.taskMark")}*</p>
                            <input
                                ref={inputRef} 
                                className="modal-input w-100"
                                value={score}
                                onKeyDown={assignmentMarkSubmit}
                                onChange={handleInputChange}
                            />

                            <Row>
                                <Button className='pinnacle-bold justify-content-center mt-3 clear-button' variant='link' onClick={clearAll}>
                                    {t("common.clear")}
                                </Button>
                            </Row>
                            <Row>
                                <Button className="d-flex flex-row justify-content-between filter-button mt-2 cursor-pointer" variant='empty' onClick={handlerSearch}>
                                    <FilterIcon />
                                    {t("common.search").toUpperCase()}
                                    <div style={{paddingLeft: 20}}/>
                                </Button>
                            </Row>
                        </div>
                    </Col>
                    <Col xl="8" xxl="9">
                        {
                            list && list.length > 0 && list.map((question, index) => {
                                return <Question
                                    key={index}
                                    question={question}
                                    allowSelect
                                    alternateBorder
                                    showCategory
                                    showState={false}
                                    showContextMenu={false}
                                    showExtras={false}
                                    selectedPasser={handlerSelectedPasser}
                                />
                            })
                        }
                    </Col>
                </Row>
            </Modal.Body>
            <Modal.Footer className="p-3">
                <div className="d-flex flex-row justify-content-between align-items-center w-100">
                    <div className="d-flex flex-row justify-content-start align-items-center cursor-pointer">
                        <Checkbox
                            label={t("quiz.selectMoreQuestions")}
                            checked={addAgain}
                            onChange={checkboxHandler}
                        />
                    </div>

                    <div className="d-flex align-items-center">
                        <Button className='cancel-button' variant='link' onClick={onClose}>
                            <span style={{ color: '#ff2f1a' }}>{t("common.cancel")}</span>
                        </Button>
                        <Button className='save-button ml-2 text-uppercase' variant='empty' onClick={handleProceedButton}>
                            <span style={{ color: '#000000' }}>{t("common.select")} </span>
                        </Button>
                    </div>
                    <div style={{paddingLeft: 200}} />
                </div>
            </Modal.Footer>
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
        </Modal>
    );
}
