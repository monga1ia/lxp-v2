import React from 'react'
import { Modal } from 'react-bootstrap'
import CloseIcon from '@mui/icons-material/Close'
import secureLocalStorage from 'react-secure-storage'
import { translations } from 'utils/translations'
import { useTranslation } from 'react-i18next'

const locale = secureLocalStorage?.getItem('selectedLang') || 'mn'

const deleteModal = ({ onClose, onSubmit }) => {

    const { t } = useTranslation()

    return (
        <Modal
            dimmer='blurring'
            show={true}
            size="sm"
            aria-labelledby="contained-modal-title-vcenter"
            onHide={() => onClose()}
            centered
        >
            <Modal.Header closeButton style={{ padding: '1rem' }}>
                <Modal.Title className="modal-title d-flex flex-row justify-content-between w-100">
                    {t('action.delete')}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <span style={{ color: '#848691' }} className='fs-11'>
                    <p>{translations(locale)?.manager?.detention_delete_description}</p>
                </span>
            </Modal.Body>
            <Modal.Footer className="text-center">
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