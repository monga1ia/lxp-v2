import { React, useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import { useSelector } from "react-redux";
import Select from "modules/Form/Select";
import Checkbox from '@mui/material/Checkbox';
import { useTranslation } from "react-i18next";
import { fetchRequest } from 'utils/fetchRequest';
import message from 'modules/message'

import {
    curriculumParentTopics
} from 'utils/fetchRequest/Urls';

const UnitAddMedle = ({
    parentTopic = null,
    onClose = () => { },
    grades = [],
    selectedGrade = null,
    subjects = [],
    selectedSubject = null,
    selectedTeacher = null,
    onSave = () => { },
    show = false,
    showBackButton = false,
    showFooter = true,
    footerText = "Хадгалах",
}) => {
    const { t } = useTranslation();

    const { selectedSchool } = useSelector(state => state?.schoolData);
    const [gradeValue, setGradeValue] = useState(selectedGrade)
    const [subjectValue, setSubjectValue] = useState(selectedSubject)

    const [selectedTopics, setSelectedTopics] = useState([])
    const [topics, setTopics] = useState([])

    const [loading, setLoading] = useState(false);

    const gradeDropdownChange = (value) => {
        setGradeValue(value)
    }
    const subjectDropdownChange = (value) => {
        setSubjectValue(value)
    }

    const topicDropdownChange = () => {
    }

    const handleCheckboxChange = (topicId = null) => {
        if (topicId) {
            const topicIds = [...selectedTopics];
            if (topicIds.indexOf(topicId) > -1) {
                topicIds.splice(topicIds.indexOf(topicId), 1);
            } else {
                topicIds.push(topicId)
            }
            setSelectedTopics(topicIds)
        }
    };
    const allCheckboxHandler = (value) => {
        if (value) {
            const topicIds = [];
            for (let t = 0; t < topics.length; t++) {
                topicIds.push(topics[t].id)
            }
            setSelectedTopics(topicIds)
        } else {
            setSelectedTopics([])
        }
    };

    const init = (params) => {
        setLoading(true)
        fetchRequest(curriculumParentTopics, 'POST', params)
            .then((res) => {
                if (res.success) {
                    setTopics(res?.topics || [])
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
            subject: selectedSubject,
            grade: selectedGrade,
            parentTopic: parentTopic?.id || null,
            teacher: selectedTeacher
        })
    }, [selectedGrade, selectedSubject])

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
                    MEDLE-с татах
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
                        <Select
                            className='modal-select'
                            clearable={false}
                            options={grades}
                            disabled
                            value={gradeValue}
                            onChange={(value) => gradeDropdownChange(value)}
                        />
                    </div>

                    <div className="d-flex flex-row justify-content-end align-items-center mb-3">
                        <span className="modal-select-title mr-4">{t("exam.subject")}</span>
                        <Select
                            className='modal-select'
                            clearable={false}
                            disabled
                            options={subjects}
                            value={selectedSubject}
                            onChange={(value) => subjectDropdownChange(value)}
                        />
                    </div>
                    {
                        parentTopic && <div className="d-flex flex-row justify-content-end align-items-center mb-3">
                            <span className="modal-select-title mr-4">Нэгж хичээл</span>
                            <Select
                                className='modal-select'
                                clearable={false}
                                disabled
                                options={[{ value: parentTopic?.id, text: parentTopic?.name }]}
                                value={parentTopic?.id}
                                onChange={(value) => topicDropdownChange(value)}
                            />
                        </div>
                    }
                    {
                        topics && topics?.length > 0 && <div style={{ display: 'flex', alignItems: 'center', marginTop: '0.5rem' }}>
                            <Checkbox
                                sx={{
                                    '&.Mui-checked': {
                                        color: '#ff5b1d',
                                    },
                                }}
                                style={{ pading: 0 }} onChange={(e, value) => allCheckboxHandler(value)} />
                            {t('common.selectAll')}
                        </div>
                    }
                    {topics?.map((topicObj, index) => (
                        <div key={index} style={{ marginTop: '1rem', marginLeft: '2rem' }}>
                            <Checkbox
                                checked={selectedTopics.indexOf(topicObj?.id) > -1}
                                sx={{
                                    '&.Mui-checked': {
                                        color: '#ff5b1d',
                                    },
                                }}
                                style={{ padding: 0 }}
                                onChange={() => handleCheckboxChange(topicObj?.id)}
                            />
                            {topicObj?.name || ''}
                        </div>
                    ))}
                </div>
            </Modal.Body>
            {showFooter && (
                <Modal.Footer className="p-3">
                    <div className="d-flex flex-row justify-content-center align-items-center w-100">
                        <Button className="cursor-pointer cancel-button pr-4" variant='link' onClick={onClose}>
                            <span style={{ color: '#ff2f1a' }}>{t("common.cancel")}</span>
                        </Button>
                        <Button className="cursor-pointer save-button" variant='empty' onClick={() => onSave(selectedGrade, selectedSubject, selectedTopics, parentTopic)}>
                            <span style={{ color: '#555555' }}>{footerText.toUpperCase()}</span>
                        </Button>
                    </div>
                </Modal.Footer>
            )}

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

export default UnitAddMedle;
