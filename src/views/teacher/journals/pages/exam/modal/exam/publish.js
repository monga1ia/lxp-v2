import React from 'react'
import { Modal } from 'semantic-ui-react'
import CloseIcon from '@mui/icons-material/Close'
import secureLocalStorage from 'react-secure-storage'
import { translations } from 'utils/translations'

const publish = ({ onClose, onSubmit }) => {
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
                {translations(locale)?.action?.publish}
                <button type='button' className='close' aria-label='Close' onClick={onClose}>
                    <CloseIcon />
                </button>
            </div>
            <div className='content'>
                <span style={{ color: '#848691' }} className='fs-11'>
                    <p>{translations(locale)?.exam?.publish_title_season}</p>
                    <p>{translations(locale)?.exam?.publish_title_description}</p>
                </span>
            </div>
            <div className='actions modal-footer'>
                <div className='col-12 text-center'>
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
                </div>
            </div>
        </Modal>
    )
}

export default publish