import React from 'react'
import { Modal } from 'semantic-ui-react'
import CloseIcon from '@mui/icons-material/Close'
import secureLocalStorage from 'react-secure-storage'
import { translations } from 'utils/translations'

const forceCreate = ({ onClose, onSubmit, message }) => {
    const locale = secureLocalStorage?.getItem('selectedLang') || 'mn'
    return (
        <Modal
            size='small'
            dimmer='blurring'
            open={true}
            onClose={onClose}
            className="react-modal overflow-modal"
            centered
        >
            <div className="header">
                {translations(locale)?.addRole}
                <button type="button" className="close" aria-label="Close" onClick={onClose} >
                    <CloseIcon />
                </button>
            </div>
            <div className="content">
                {
                    message
                }
            </div>
            <div className="actions modal-footer ">
                <div className="col-12 text-center">
                    <button
                        className="btn m-btn--pill btn-link m-btn m-btn--custom"
                        onClick={onClose}
                    >
                        {translations(locale)?.no}
                    </button>
                    <button
                        className="btn m-btn--pill btn-success m-btn--wide"
                        onClick={onSubmit}
                    >
                        {translations(locale)?.yes}
                    </button>
                </div>
            </div>
        </Modal >
    )
}

export default forceCreate