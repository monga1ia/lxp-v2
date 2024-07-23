import React from 'react'
import { Modal } from 'react-bootstrap'
import { useTranslation } from "react-i18next";

const DeleteHdr = ({ onClose, onSubmit, selectedTab, children }) => {
    
    const { t } = useTranslation();

    return (
        <Modal
            size='md'
            dimmer='blurring'
            show={true}
            onHide={onClose}
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton style={{padding: '1rem'}}>
                <Modal.Title className="modal-title d-flex flex-row justify-content-between w-100">
                    {t('action.delete')}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body style={{color: '#212529'}}>
                <span>{t('newsfeedConfig.removeHdr')}</span>
            </Modal.Body>
            <Modal.Footer className='text-center'>
                <button
                    onClick={onClose}
                    className="btn m-btn--pill m-btn--air btn-outline-metal m-btn m-btn--custom"
                >
                    {t('close').toUpperCase()}
                </button>
                <button
                    onClick={onSubmit}
                    className="btn m-btn--pill m-btn--air btn-warning m-btn m-btn--custom"
                    style={{fontSize: '13px'}}
                >
                    {t('delete')}
                </button>
            </Modal.Footer>
        </Modal >
    )
}

export default DeleteHdr