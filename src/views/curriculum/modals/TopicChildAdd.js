import { React, useState, useEffect, useRef } from "react";
import { Modal, Button } from "react-bootstrap";
import { useSelector } from "react-redux";
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Select from "modules/Form/Select";
import { useTranslation } from "react-i18next";
import { fetchRequest } from '../../../utils/fetchRequest';
import message from '../../../modules/message'
import { getWindowDimensions } from "utils/utils";

import { curriculumTopicInit } from '../../../utils/fetchRequest/Urls';

const TopicChildAdd = ({
    onClose = () => { },
    grades = [],
    parentTopics = [],
    parentTopic = null,
    grade = null,
    subject = null,
    onSave = () => { },
    show = false,
    showBackButton = false,
    footerText = "Хадгалах",
}) => {
    const { t } = useTranslation();
    const { selectedSchool } = useSelector(state => state?.schoolData);

    const descriptionRef = useRef(null);
    const purposeRef = useRef(null)
    const [loading, setLoading] = useState(false);

    const [descriptionValue, setDescriptionValue] = useState('')
    const [purposeValue, setPurposeValue] = useState('')
    const [selectedGrade, setSelectedGrade] = useState(grade || null);
    const [selectedSubject, setSelectedSubject] = useState(subject || null);

    const [subjectList, setSubjectList] = useState([])
    const [selectedParentTopic, setSelectedParentTopic] = useState(parentTopic || null)

    const [isPrivate, setPrivate] = useState(false)
    const [isAddAgain, setAddAgain] = useState(false)
    const { width } = getWindowDimensions();

    const init = (params) => {
        setLoading(true)
        fetchRequest(curriculumTopicInit, 'POST', params)
            .then((res) => {
                if (res.success) {
                    const { subjects = [] } = res
                    setSubjectList(subjects.map(subjectObj => {
                        return {
                            value: subjectObj?.id,
                            text: subjectObj?.name + ' (' + subjectObj?.code + ')'
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
        init({
            school: selectedSchool?.id,
            grade: selectedGrade
        })
    }, [])

    const gradeDropdownChange = (value) => {
        setSelectedGrade(value)

        if (value) {
            init({
                grade: value,
                school: selectedSchool?.id
            })
        } else {
            setSubjectList([])
        }
    }
    const subjectDropdownChange = (value) => {
        setSelectedSubject(value)
    }
    const parentTopicChange = (value) => {
        setSelectedParentTopic(value)
    }
    const descriptionHandler = (event) => {
        if (event.key === 'Enter') {
            descriptionRef.current.blur();
        }
    }
    const purposeHandler = (event) => {
        if (event.key === 'Enter') {
            purposeRef.current.blur()
        }
    }
    const descriptionInputChange = (event) => {
        setDescriptionValue(event.target.value);
    }

    const purposeInputChange = (event) => {
        setPurposeValue(event.target.value);
    }

    const onSubmit = () => {
        const params = {
            school: selectedSchool?.id,
            grade: selectedGrade,
            subject: selectedSubject,
            parentTopic: selectedParentTopic,
            description: descriptionValue,
            purpose: purposeValue,
            private: isPrivate ? 1 : 0,
            addAgain: isAddAgain
        }
        
        if(isAddAgain) {
            setSelectedGrade(grade)
            setSelectedSubject(subject)
            setSelectedParentTopic(parentTopic)
            setPurposeValue('')
            setDescriptionValue('')
            setPrivate(false)
            if(descriptionRef.current) {
                descriptionRef.current.value = ""
            }
        }
        onSave(params)
    }

    return (
        <Modal
            show={show}
            onHide={onClose}
            size="xl"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header className="p-3">
                <Modal.Title className="modal-title d-flex flex-row justify-content-between w-100" style={{ textTransform: 'none' }}>
                    {t('onlineLesson.topicAdd')}
                    {showBackButton && (
                        <div onClick={onClose} className="cursor-pointer back-button">
                            {t('common.back')}
                        </div>
                    )}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="w-100 flex-column d-flex justify-content-end modal-padding-right">
                    <div className="d-flex flex-row justify-content-end align-items-center mb-3">
                        <span className="modal-select-title mr-4">{t("exam.level")}</span>
                        <Select className='modal-select'
                            clearable={false}
                            options={grades}
                            value={selectedGrade}
                            disabled={true}
                            onChange={(value) => gradeDropdownChange(value)}
                        />
                    </div>

                    <div className="d-flex flex-row justify-content-end align-items-center mb-3">
                        <span className="modal-select-title mr-4">{t("subject.title")}</span>
                        <Select className='modal-select'
                            clearable={false}
                            options={subjectList}
                            value={selectedSubject}
                            disabled={true}
                            onChange={(value) => subjectDropdownChange(value)}
                        />
                    </div>
                    <div className="d-flex flex-row justify-content-end align-items-center mb-3">
                        <span className="modal-select-title mr-4">Нэгж хичээл</span>
                        <Select className='modal-select'
                            clearable={false}
                            options={parentTopics.map(obj => {
                                return {
                                    value: obj?.id,
                                    text: obj?.name
                                }
                            })}
                            disabled={true}
                            value={selectedParentTopic}
                            onChange={(value) => parentTopicChange(value)}
                        />
                    </div>
                    <div className="d-flex flex-row justify-content-end align-items-center mb-3">
                        <span className="modal-select-title mr-4" style={{ marginBottom: '3rem' }}>Ээлжит хичээл</span>
                        <div className="d-flex flex-column">
                            <textarea className="modal-input text-area" rows={3} value={descriptionValue} ref={descriptionRef} onKeyDown={descriptionHandler} onChange={descriptionInputChange} />
                        </div>
                    </div>
                    <div className="d-flex flex-row justify-content-end align-items-center mb-3">
                        <span className="modal-select-title mr-4" style={{ marginBottom: '5rem' }}>{t("common.description")}</span>
                        <div className="d-flex flex-column">
                            <textarea className="modal-input text-area" rows={3} value={purposeValue} ref={purposeRef} onKeyDown={purposeHandler} onChange={purposeInputChange} />
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <FormControlLabel
                                    control={<Checkbox
                                        sx={{
                                            '&.Mui-checked': {
                                                color: '#ff5b1d',
                                            },
                                        }}
                                        checked={isPrivate}
                                        onChange={(e, value) => setPrivate(value)} />}
                                    label="Зөвхөн би ашиглана."
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer className="p-3">
                <div style={{ display: 'flex', flexDirection: 'row' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'start' }}>
                        <FormControlLabel
                            control={<Checkbox
                                sx={{
                                    '&.Mui-checked': {
                                        color: '#ff5b1d',
                                    },
                                }}
                                checked={isAddAgain}
                                onChange={(e, value) => setAddAgain(value)} />}
                            label="Дахин утга оруулах"
                        />
                    </div>
                    <div className="ml-per-20" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <Button className="cursor-pointer cancel-button pr-4" variant='link' onClick={onClose}>
                            <span style={{ color: '#ff2f1a' }}>{t("common.cancel")}</span>
                        </Button>
                        <Button className="cursor-pointer save-button" variant='empty' onClick={onSubmit}>
                            <span style={{ color: '#000' }}>{footerText.toUpperCase()}</span>
                        </Button>
                    </div>
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
};

export default TopicChildAdd;
