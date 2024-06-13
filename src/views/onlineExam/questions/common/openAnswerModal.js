import React, { useState } from "react";
import Select from "modules/Form/Select";
import { t } from "i18next";
import { Button, Modal } from "react-bootstrap";
import message from "modules/message";

export default function QuestionConnectModal({
    propIsCourse = false,
    show,
    onClose,
    onSave,
    connectedAnswers = [],
    selectedAnswer,
    answers
}) {
    const [answerIds, setAnswerIds] = useState([]);
    const [score, setScore] = useState('');

    const [minIndex, setMinIndex] = useState(selectedAnswer?.ordering)
    const [maxIndex, setMaxIndex] = useState(selectedAnswer?.ordering)

    const [updateView, setUpdateView] = useState(false)

    const onHandlerSelect = (value) => {
        if (value && value?.length > 0) {
            const list = getAnswerOptions()
            let minValue = minIndex;
            let maxValue = maxIndex;

            for (let i = 0; i < list.length; i++) {
                const obj = list[i]
                if (value.indexOf(obj.value) > -1) {
                    if (obj.ordering < minIndex) {
                        minValue = obj.ordering;
                    }
                    if (obj.ordering > maxIndex) {
                        maxValue = obj.ordering;
                    }
                }
            }

            setMinIndex(minValue)
            setMaxIndex(maxValue)
            setAnswerIds(value);
        } else {
            setMinIndex(selectedAnswer?.ordering)
            setMaxIndex(selectedAnswer?.ordering)
            setAnswerIds([]);
        }

        setUpdateView(!updateView)
    }

    const onHandlerInput = (e) => {
        setScore(e.target.value)
    }

    const onSubmit = () => {
        if (answerIds.length == 0) {
            message(t('errorMessage.enterConnectAnswer'), false)
            return
        }
        if (score == 0 || !score) {
            message(t('errorMessage.enterScore'), false)
            return
        }

        onSave(selectedAnswer?.id, answerIds, score)
        setAnswerIds([])
        setScore('')
        onClose()
    }

    const getAnswerOptions = () => {
        let rawConnectedAnswers = [];
        if (connectedAnswers && connectedAnswers.length > 0) {
            for (let ca = 0; ca < connectedAnswers.length; ca++) {
                rawConnectedAnswers = rawConnectedAnswers.concat(connectedAnswers[ca])
            }
        }
        const list = []
        for (let a = 0; a < answers?.length; a++) {
            const answerObj = answers[a]
            if (rawConnectedAnswers.length > 0) {
                if (rawConnectedAnswers.indexOf(answerObj.id) === -1
                    && selectedAnswer?.id !== answerObj?.id) {
                    let isDisabled = true

                    if (answerObj?.ordering === (minIndex - 1) || answerObj?.ordering === (maxIndex + 1)) {
                        isDisabled = false;
                    }
                    list.push({
                        value: answerObj?.id,
                        text: answerObj?.name,
                        ordering: answerObj?.ordering,
                        isDisabled: isDisabled
                    })
                }
            } else {
                if (selectedAnswer?.id !== answerObj?.id) {
                    let isDisabled = true

                    if (answerObj?.ordering === (minIndex - 1) || answerObj?.ordering === (maxIndex + 1)) {
                        isDisabled = false;
                    }
                    list.push({
                        value: answerObj?.id,
                        text: answerObj?.name,
                        ordering: answerObj?.ordering,
                        isDisabled: isDisabled
                    })
                }
            }
        }
        return list;
    }

    return (
        <Modal
            show={show}
            onHide={onClose}
            style={propIsCourse ? {
                zIndex: 2000,
                backgroundColor: 'rgba(0, 0, 0, 0.5)'
            } : {}}
            size='lg'
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header className="p-3">
                <Modal.Title className="modal-title d-flex flex-row justify-content-between w-100">
                    {t('questionBank.connectTitle')}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="row">
                    <div className="col-12 d-flex">
                        <div className="col-1" />
                        <div className="col-8">
                            <div className="flex-column d-flex">
                                <div className="d-flex flex-row justify-content-end align-items-center mb-3">
                                    <span className="modal-select-title mr-4">Хариулт</span>
                                    <input
                                        value={selectedAnswer?.name}
                                        placeholder="selectedChar"
                                        className="modal-input"
                                        disabled
                                    />
                                </div>
                                <div className="d-flex flex-row justify-content-end align-items-center mb-3">
                                    <span className="modal-select-title mr-4">Холбох хариултууд*</span>
                                    <Select
                                        className="modal-select"
                                        multiple
                                        searchable
                                        value={answerIds}
                                        options={getAnswerOptions()}
                                        onChange={onHandlerSelect}
                                    />
                                </div>
                                <div className="d-flex flex-row justify-content-end align-items-center mb-3">
                                    <span className="modal-select-title mr-4">Оноо*</span>
                                    <input
                                        type='number'
                                        value={score}
                                        className="modal-input"
                                        placeholder={t('errorMessage.enterScore')}
                                        onChange={onHandlerInput}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="col-3" />
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer className="p-3">
                <div className="d-flex flex-row justify-content-center align-items-center w-100">
                    <Button className="cursor-pointer cancel-button pr-4" variant='link' onClick={onClose}>
                        <span style={{ color: '#ff2f1a' }}>{t("common.cancel")}</span>
                    </Button>
                    <Button className='cursor-pointer save-button' variant='empty' onClick={onSubmit}>
                        <span style={{ color: '#555555' }}>{t('common.save').toUpperCase()}</span>
                    </Button>
                </div>
            </Modal.Footer>
        </Modal>
    );
}
