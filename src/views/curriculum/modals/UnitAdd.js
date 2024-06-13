import { React, useState, useEffect, useRef } from "react";
import { Modal, Button } from "react-bootstrap";
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Select from "modules/Form/Select";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

import { fetchRequest } from '../../../utils/fetchRequest';
import message from '../../../modules/message'

import { curriculumTopicInit } from '../../../utils/fetchRequest/Urls';

const UnitAdd = ({
    onClose = () => { },
    grades = [],
    onSave = () => { },
    show = false,
    showBackButton = false,
    footerText = "Хадгалах",
    gradeId,
    subjectId
}) => {
    const { t } = useTranslation();
    const { selectedSchool } = useSelector(state => state?.schoolData);

    const descriptionRef = useRef(null);
    const [loading, setLoading] = useState(false);

    const [descriptionValue, setDescriptionValue] = useState('')
    const [selectedGrade, setSelectedGrade] = useState(gradeId || null);
    const [subjectList, setSubjectList] = useState([])
    const [selectedSubject, setSelectedSubject] = useState(subjectId || null);
    const [isPrivate, setPrivate] = useState(false)
    const [isAddAgain, setAddAgain] = useState(false)


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
    const descriptionHandler = (event) => {
        if (event.key === 'Enter') {
            descriptionRef.current.blur();
        }
    }
    const descriptionInputChange = (event) => {
        setDescriptionValue(event.target.value);
    }

    const onSubmit = () => {
        const params = {
            school: selectedSchool?.id,
            grade: selectedGrade,
            subject: selectedSubject,
            description: descriptionValue,
            private: isPrivate ? 1 : 0,
            addAgain: isAddAgain,
            isNewTopic: 1
        }

        if(isAddAgain) {
            setSelectedGrade(gradeId)
            setSelectedSubject(subjectId)
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
                    Нэгж хичээл нэмэх
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
                        <span className="modal-select-title mr-4">{t("menu.subject")}</span>
                        <Select className='modal-select'
                            clearable={false}
                            options={subjectList}
                            value={selectedSubject}
                            disabled={true}
                            onChange={(value) => subjectDropdownChange(value)}
                        />
                    </div>
                    <div className="d-flex flex-row justify-content-end align-items-center mb-3">
                        <span className="modal-select-title mr-4" style={{ marginBottom: '5rem' }}>{t("curriculum.unitSubject")}</span>
                        <div className="d-flex flex-column">
                            <textarea className="modal-input text-area" rows={3} ref={descriptionRef} onKeyDown={descriptionHandler} onChange={descriptionInputChange} />
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <FormControlLabel
                                    control={<Checkbox
                                        sx={{
                                            '&.Mui-checked': {
                                                color: '#ff5b1d',
                                            },
                                        }}
                                        checked={isPrivate}
                                        onChange={(e, value) => setPrivate(value)} />
                                    }
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
                                style={{ paddingLeft: 0 }}
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

export default UnitAdd;
