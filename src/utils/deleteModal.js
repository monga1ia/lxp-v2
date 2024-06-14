import React from 'react'
import { Modal } from 'react-bootstrap'
import { translations } from './translations'

const deleteModal = ({ onClose, onDelete, title, locale, children }) => {

    return (
        <Modal
            size='sm'
            dimmer='blurring'
            show={true}
            onHide={onClose}
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton style={{padding: '1rem'}}>
                <Modal.Title className="modal-title d-flex flex-row justify-content-between w-100">
                    {title}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {children}
            </Modal.Body>
            <Modal.Footer className='text-center'>
                <button
                    onClick={onClose}
                    className="btn btn-link margin-right-5"
                >
                    {translations(locale)?.back}
                </button>
                <button
                    onClick={onDelete}
                    className="btn m-btn--pill btn-danger"
                >
                    {translations(locale)?.delete}
                </button>
            </Modal.Footer>
        </Modal >
    )
}

export default deleteModal