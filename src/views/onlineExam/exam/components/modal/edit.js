import { React, useState, useEffect, useRef } from "react";
import { Modal, Button } from "react-bootstrap";
import Checkbox from '@mui/material/Checkbox';
import Select from "modules/Form/Select";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

import { fetchRequest } from 'utils/fetchRequest';
import message from 'modules/message'

import { curriculumTopicInit } from 'utils/fetchRequest/Urls';

const edit = ({
    onClose = () => { },
    topicObj = {},
    grades = [],
    onSave = () => { },
    show = false,
    showBackButton = false,
    footerText = "Хадгалах",
    gradeId = null,
}) => {
    const { t } = useTranslation();
    const { selectedSchool } = useSelector(state => state?.schoolData);

    const descriptionRef = useRef(null);
    const [loading, setLoading] = useState(false);

    const [descriptionValue, setDescriptionValue] = useState(topicObj?.name)
    const [selectedGrade, setSelectedGrade] = useState(topicObj?.subjectGradeId || gradeId);
    const [subjectList, setSubjectList] = useState([])
    const [selectedSubject, setSelectedSubject] = useState(topicObj?.subjectId);
    const [isPrivate, setPrivate] = useState(topicObj?.isPrivate)


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
            grade: topicObj?.subjectGradeId || gradeId,
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
    const descriptionHandler = (event) => {
        if (event.key === 'Enter') {
            descriptionRef.current.blur();
        }
    }
    const descriptionInputChange = (event) => {
        setDescriptionValue(event.target.value);
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
                    Нэгж хичээл засах
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
                            onChange={(value) => gradeDropdownChange(value)}
                        />
                    </div>

                    <div className="d-flex flex-row justify-content-end align-items-center mb-3">
                        <span className="modal-select-title mr-4">{t("menu.subject")}</span>
                        <Select className='modal-select'
                            clearable={false}
                            options={subjectList}
                            value={selectedSubject}
                            onChange={(value) => subjectDropdownChange(value)}
                        />
                    </div>
                    <div className="d-flex flex-row justify-content-end align-items-center mb-3">
                        <span className="modal-select-title mr-4" style={{ marginBottom: '5rem' }}>{t("common.description")}</span>
                        <div className="d-flex flex-column">
                            <textarea className="modal-input text-area" rows={3}
                                ref={descriptionRef}
                                value={descriptionValue}
                                onKeyDown={descriptionHandler} onChange={descriptionInputChange} />
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <Checkbox
                                    style={{ paddingLeft: 0 }}
                                    sx={{
                                        '&.Mui-checked': {
                                            color: '#ff5b1d',
                                        },
                                    }}
                                    checked={isPrivate}
                                    onChange={(e, value) => {
                                        setPrivate(value)
                                    }}
                                />
                                Зөвхөн би ашиглана.
                            </div>
                        </div>
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer className="p-3 text-center">
                <div style={{ display: 'flex', flexDirection: 'row', display: 'inline-block' }}>
                    <Button className="cursor-pointer cancel-button pr-4" variant='link' onClick={onClose}>
                        <span style={{ color: '#ff2f1a' }}>{t("common.cancel")}</span>
                    </Button>
                    <Button className="cursor-pointer save-button" variant='empty' onClick={() => {
                        onSave({
                            topic: topicObj?.id,
                            school: selectedSchool?.id,
                            grade: selectedGrade,
                            subject: selectedSubject,
                            description: descriptionValue,
                            private: isPrivate ? 1 : 0
                        })
                    }}>
                        <span style={{ color: '#555555' }}>{footerText.toUpperCase()}</span>
                    </Button>
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

export default edit;
