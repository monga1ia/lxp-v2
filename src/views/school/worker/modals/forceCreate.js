import React from 'react'
import { Modal } from 'react-bootstrap'
import secureLocalStorage from 'react-secure-storage'
import { useTranslation } from "react-i18next";

const forceCreate = ({ onClose, onSubmit, message }) => {
    
    const { t } = useTranslation();

    return (
        <Modal
            dimmer='blurring'
            show={true}
            size="sm"
            aria-labelledby="contained-modal-title-vcenter"
            onHide={onClose}
            className='doubleModal'
            centered
        >
            <Modal.Header closeButton style={{padding: '1rem'}}>
                <Modal.Title className="modal-title d-flex flex-row justify-content-between w-100">
                    {t('addRole')}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {
                    message
                }
            </Modal.Body>
            <Modal.Footer className="text-center">
                <div className="col-12 text-center">
                    <button
                        className="btn m-btn--pill btn-link m-btn m-btn--custom"
                        onClick={onClose}
                    >
                        {t('no')}
                    </button>
                    <button
                        className="btn m-btn--pill btn-success m-btn--wide"
                        onClick={onSubmit}
                    >
                        {t('yes')}
                    </button>
                </div>
            </Modal.Footer>
        </Modal >
    )
}

export default forceCreate