import { React, useState, useEffect, useRef } from "react";
import { Modal, Button } from "react-bootstrap";
import Checkbox from '@mui/material/Checkbox';
import Select from "modules/Form/Select";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { fetchRequest } from 'utils/fetchRequest';
import message from 'modules/message'
import { curriculumTopicInit } from 'utils/fetchRequest/Urls';

const EndModal = ({
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

export default EndModal;
