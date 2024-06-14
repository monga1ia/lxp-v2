import message from 'Src/message'
import React, { useState } from 'react'
import { Modal } from 'semantic-ui-react'
import { Col, Row } from 'react-bootstrap'
import CloseIcon from '@mui/icons-material/Close'
import secureLocalStorage from 'react-secure-storage'
import { translations } from 'Utilities/translations'

const loginNameChange = ({ onClose, onSubmit }) => {
    const locale = secureLocalStorage?.getItem('selectedLang') || 'mn'

    const [loginNames, setLoginNames] = useState({})

    const handleInputChange = (name, value) => {
        setLoginNames({ ...loginNames, [name]: value })
    }

    const handleSave = () => {
        if (!loginNames?.loginName || !loginNames?.newLoginName || !loginNames?.newLoginNameRepeat) return message(translations(locale)?.err?.fill_all_fields)
        if (loginNames?.newLoginName !== loginNames?.newLoginNameRepeat) return message(translations(locale)?.login_name_re_enter_mismatch)
        onSubmit({ existingUsername: loginNames?.loginName, newUsername: loginNames?.newLoginName })
    }

    return (
        <Modal
            centered
            open={true}
            onClose={onClose}
            dimmer='blurring'
            className="react-modal overflow-modal"
        >
            <div className="header">
                {translations(locale)?.teacher?.change_login_name}
                <button type="button" className="close" aria-label="Close" onClick={onClose} >
                    <CloseIcon />
                </button>
            </div>
            <div className="content">
                <p style={{ color: '#848691' }} className='fs-11 pb-4 pl-4'>{translations(locale)?.teacher?.change_login_name_description}</p>
                <Row className='form-group'>
                    <Col className='text-right'>
                        <label className="text-right label-pinnacle-bold col-form-label">
                            {translations(locale)?.teacher?.current_login_name}*
                        </label>
                    </Col>
                    <Col>
                        <input
                            type="text"
                            className="form-control"
                            value={loginNames?.loginName || ''}
                            placeholder={translations(locale)?.teacher?.login_name}
                            onChange={(e) => handleInputChange('loginName', e.target.value)}
                        />
                    </Col>
                    <Col md={2} />
                </Row>
                <Row className='form-group'>
                    <Col className='text-right'>
                        <label className="text-right label-pinnacle-bold col-form-label">
                            {translations(locale)?.teacher?.new_login_name}*
                        </label>
                    </Col>
                    <Col>
                        <input
                            type="text"
                            className="form-control"
                            value={loginNames?.newLoginName || ''}
                            placeholder={translations(locale)?.teacher?.login_name}
                            onChange={(e) => handleInputChange('newLoginName', e.target.value)}
                        />
                    </Col>
                    <Col md={2} />
                </Row>
                <Row className='form-group'>
                    <Col className='text-right'>
                        <label className="text-right label-pinnacle-bold col-form-label">
                            {translations(locale)?.teacher?.new_login_name_repeat}*
                        </label>
                    </Col>
                    <Col>
                        <input
                            type="text"
                            className="form-control"
                            value={loginNames?.newLoginNameRepeat || ''}
                            placeholder={translations(locale)?.teacher?.login_name}
                            onChange={(e) => handleInputChange('newLoginNameRepeat', e.target.value)}
                        />
                    </Col>
                    <Col md={2} />
                </Row>
            </div>
            <div className="actions modal-footer ">
                <div className="col-12 text-center">
                    <button
                        className="btn m-btn--pill btn-link m-btn m-btn--custom"
                        onClick={onClose}
                    >
                        {translations(locale)?.back}
                    </button>
                    <button
                        className="btn m-btn--pill btn-success m-btn--wide"
                        onClick={handleSave}
                    >
                        {translations(locale)?.save}
                    </button>
                </div>
            </div>
        </Modal>
    )
}

export default loginNameChange