import { React, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import message from 'modules/message'

const ReturnModal = ({
    onClose = () => { },
    show = false,
    onSave
}) => {
    const { t } = useTranslation();

    const [description, setDescription] = useState('')

    const descriptionInputChange = (event) => {
        setDescription(event.target.value);
    }

    const onSubmit = () => {
        // if(!description){
        //     message(t('adminQuestion.errorMessage.insertDescription'))
        //     return
        // }

        let params = {
            description
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
                    {t('adminQuestion.label.return')}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className="text-center">
                <div className="d-flex flex-row justify-content-center align-items-center">
                    <span className="modal-select-title align-self-start mr-4">{t('common.description')}</span>
                    <div className="d-flex flex-column">
                        <textarea 
                            style={{width: 350}}
                            className="modal-input text-area resize-vertical"
                            rows={5}
                            value={description}
                            onChange={descriptionInputChange} 
                        />
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer className="p-3 text-center">
                <div style={{ display: 'flex', flexDirection: 'row', display: 'inline-block' }}>
                    <Button className="cursor-pointer cancel-button pr-4" variant='link' onClick={onClose}>
                        <span style={{ color: '#ff2f1a' }}>{t("common.back")}</span>
                    </Button>
                    <Button className="cursor-pointer save-button" variant='empty' onClick={onSubmit}>
                        <span style={{ color: '#000' }}>{t('common.save').toUpperCase()}</span>
                    </Button>
                </div>
            </Modal.Footer>
        </Modal>
    );
};

export default ReturnModal;
