import React from 'react'
import { Modal } from 'react-bootstrap'
import { Message } from 'semantic-ui-react'
import { useTranslation } from "react-i18next";

const DeleteHWInfo = ({ onClose, onDelete, disabled, className }) => {
    
    const { t } = useTranslation();

    return (
        <Modal
            size='sm'
            dimmer='blurring'
            show={true}
            onHide={onClose}
            className={className || ''}
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton style={{padding: '1rem'}}>
                <Modal.Title className="modal-title d-flex flex-row justify-content-between w-100">
                    {t('homework.delete_homework_info')}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body style={{color: '#212529'}}>
                {
                    this.state.removeMessage
                        ?
                        <Message
                            negative={true}
                        >
                            {that.state.removeMessage}
                        </Message>
                        : null
                }
                <p>{t('homework.delete_student_homework') || null}?</p>
                <p>{t('homework.delete_student_homework_description') || null}</p>
            </Modal.Body>
            <Modal.Footer className='text-center'>
                <button
                    onClick={onClose}
                    disabled={disabled}
                    className="btn m-btn--pill btn-link m-btn m-btn--custom"
                >
                    {t('cancel')}
                </button>
                <button
                    onClick={onDelete}
                    disabled={disabled}
                    className="btn m-btn--pill btn-danger"
                    style={{fontSize: '13px'}}
                >
                    {t('delete')}
                </button>
            </Modal.Footer>
        </Modal >
    )
}

export default DeleteHWInfo