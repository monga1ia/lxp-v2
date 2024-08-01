import React from 'react'
import { Modal } from 'semantic-ui-react'
import CloseIcon from '@mui/icons-material/Close'
import secureLocalStorage from 'react-secure-storage'
import { translations } from 'utils/translations'

const examView = ({ onClose }) => {
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
                    {translations(locale)?.action?.view}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body style={{color: '#212529'}}>
                <span style={{ color: '#848691' }} className='fs-11'>
                    ene deer iu baihiin ve

                    ene text baisn shuu - Tsenguun
                </span>
            </Modal.Body>
            <Modal.Footer className='text-center'>
                <button 
                    className='btn m-btn--pill btn-outline-metal text-uppercase'
                    onClick={onClose}
                >
                    {translations(locale)?.close}
                </button>
            </Modal.Footer>
        </Modal>
    )
}

export default examView