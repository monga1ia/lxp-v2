import React from 'react'
import { Modal } from 'semantic-ui-react'
import CloseIcon from '@mui/icons-material/Close'
import secureLocalStorage from 'react-secure-storage'
import { translations } from 'utils/translations'

const locale = secureLocalStorage?.getItem('selectedLang') || 'mn'

const deleteModal = ({ onClose, onSubmit }) => {

    return (
        <Modal
            size='sm'
            dimmer='blurring'
            show={true}
            onHide={onClose}
            className={'doubleModal'}
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton style={{padding: '1rem'}}>
                <Modal.Title className="modal-title d-flex flex-row justify-content-between w-100">
                    {translations(locale)?.action?.delete}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body style={{color: '#212529'}}>
                <span style={{ color: '#848691' }} className='fs-11'>
                    <p>{translations(locale)?.attendance?.delete_description}</p>
                </span>
            </Modal.Body>
            <Modal.Footer>
                <button
                    className='btn btn-link mr-2'
                    onClick={onClose}
                >
                    {translations(locale)?.back}
                </button>
                <button
                    className="btn m-btn--pill btn-danger text-uppercase"
                    onClick={onSubmit}
                >
                    {translations(locale)?.action?.delete}
                </button>
            </Modal.Footer>
        </Modal>
    )
}

export default deleteModal