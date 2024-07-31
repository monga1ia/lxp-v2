import React from 'react'
import { Modal } from 'semantic-ui-react'
import CloseIcon from '@mui/icons-material/Close'
import secureLocalStorage from 'react-secure-storage'
import { translations } from 'utils/translations'

const examView = ({ onClose }) => {
    const locale = secureLocalStorage?.getItem('selectedLang') || 'mn'

    return (
        <Modal
            centered
            open={true}
            size='tiny'
            onClose={onClose}
            dimmer='blurring'
            className='react-modal overflow-modal'
        >
            <div className='header'>
                {translations(locale)?.action?.view}
                <button type='button' className='close' aria-label='Close' onClick={onClose}>
                    <CloseIcon />
                </button>
            </div>
            <div className='content'>
                <span style={{ color: '#848691' }} className='fs-11'>
                    ene deer iu baihiin ve
                </span>
            </div>
            <div className='actions modal-footer'>
                <div className='col text-center'>
                    <button className='btn m-btn--pill btn-outline-metal text-uppercase' onClick={onClose}>
                        {translations(locale)?.close}
                    </button>
                </div>
            </div>
        </Modal>
    )
}

export default examView