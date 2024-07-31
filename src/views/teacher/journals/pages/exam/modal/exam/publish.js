import React from 'react'
import { Modal } from 'semantic-ui-react'
import CloseIcon from '@mui/icons-material/Close'
import secureLocalStorage from 'react-secure-storage'
import { translations } from 'utils/translations'

const publish = ({ onClose, onSubmit }) => {
    const locale = secureLocalStorage?.getItem('selectedLang') || 'mn'

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
                    {translations(locale)?.action?.publish}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body style={{color: '#212529'}}>
                <span style={{ color: '#848691' }} className='fs-11'>
                    <p>{translations(locale)?.exam?.publish_title_season}</p>
                    <p>{translations(locale)?.exam?.publish_title_description}</p>
                </span>
            </Modal.Body>
            <Modal.Footer className='text-center'>
                <button
                    className='btn btn-link mr-2'
                    onClick={onClose}
                >
                    {translations(locale)?.back}
                </button>
                <button
                    className="btn m-btn--pill btn-publish text-uppercase"
                    onClick={onSubmit}
                >
                    {translations(locale)?.action?.publish}
                </button>
            </Modal.Footer>
        </Modal>
    )
}

export default publish