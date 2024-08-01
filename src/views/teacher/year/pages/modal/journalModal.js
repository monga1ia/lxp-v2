import React from 'react'
import { Modal } from 'react-bootstrap'
import CloseIcon from '@mui/icons-material/Close'
import DTable from 'modules/DataTable/DTable'
import secureLocalStorage from 'react-secure-storage'
import { translations } from 'utils/translations'
import { TextArea } from 'semantic-ui-react'


const locale = secureLocalStorage?.getItem('selectedLang') || 'mn'

const JournalModal = ({ onClose, onSubmit, onChange, show, value }) => {

    return (
        <Modal
            show={show}
            size='md'
            onHide={onClose}
            dimmer='blurring'
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton style={{padding: '1rem'}}>
                <Modal.Title className="modal-title d-flex flex-row justify-content-between w-100">
                    {translations(locale)?.teacherToday?.journalNote}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body style={{color: '#212529'}}>
                <TextArea
                    className="form-control"
                    value={value || ''}
                    rows={5}
                    onChange={onChange}
                    spellCheck={false}
                />
            </Modal.Body>
            <Modal.Footer>
                <button
                    className="btn m-btn--pill btn-link margin-right-5"
                    onClick={onClose}
                >
                    {translations(locale)?.close || null}
                </button>
                <button
                    onClick={onSubmit}
                    className="btn m-btn--pill btn-success m-btn--wide"
                >
                    {translations(locale)?.save || null}
                </button>
            </Modal.Footer>
        </Modal>
    )
}

export default JournalModal