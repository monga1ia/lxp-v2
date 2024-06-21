import message from 'modules/message'
import React, { useState } from 'react'
import { Modal } from 'react-bootstrap'
import { Col, Row } from 'react-bootstrap'
import CloseIcon from '@mui/icons-material/Close'
import secureLocalStorage from 'react-secure-storage'
import { useTranslation } from "react-i18next";

const loginNameChange = ({ onClose, onSubmit }) => {
    
    const { t } = useTranslation();

    const locale = secureLocalStorage?.getItem('selectedLang') || 'mn'

    const [loginNames, setLoginNames] = useState({})

    const handleInputChange = (name, value) => {
        setLoginNames({ ...loginNames, [name]: value })
    }

    const handleSave = () => {
        if (!loginNames?.loginName || !loginNames?.newLoginName || !loginNames?.newLoginNameRepeat) return message(t(locale)?.err?.fill_all_fields)
        if (loginNames?.newLoginName !== loginNames?.newLoginNameRepeat) return message(t(locale)?.login_name_re_enter_mismatch)
        onSubmit({ existingUsername: loginNames?.loginName, newUsername: loginNames?.newLoginName })
    }

    return (
        <Modal
            centered
            show={true}
            onHide={onClose}
            size='xl'
            dimmer='blurring'
            aria-labelledby="contained-modal-title-vcenter"
        >
            <Modal.Header closeButton style={{padding: '1rem'}}>
                <Modal.Title className="modal-title d-flex flex-row justify-content-between w-100">
                    {t(locale)?.teacher?.change_login_name}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p style={{ color: '#848691'}} className='fs-11 pb-4 pl-4'>{t(locale)?.teacher?.change_login_name_description}</p>
                <Row className='form-group'>
                    <Col className='text-right'>
                        <label className="text-right label-pinnacle-bold col-form-label">
                            {t(locale)?.teacher?.current_login_name}*
                        </label>
                    </Col>
                    <Col>
                        <input
                            type="text"
                            className="form-control"
                            value={loginNames?.loginName || ''}
                            placeholder={t(locale)?.teacher?.login_name}
                            onChange={(e) => handleInputChange('loginName', e.target.value)}
                        />
                    </Col>
                    <Col md={2} />
                </Row>
                <Row className='form-group'>
                    <Col className='text-right'>
                        <label className="text-right label-pinnacle-bold col-form-label">
                            {t(locale)?.teacher?.new_login_name}*
                        </label>
                    </Col>
                    <Col>
                        <input
                            type="text"
                            className="form-control"
                            value={loginNames?.newLoginName || ''}
                            placeholder={t(locale)?.teacher?.login_name}
                            onChange={(e) => handleInputChange('newLoginName', e.target.value)}
                        />
                    </Col>
                    <Col md={2} />
                </Row>
                <Row className='form-group'>
                    <Col className='text-right'>
                        <label className="text-right label-pinnacle-bold col-form-label">
                            {t(locale)?.teacher?.new_login_name_repeat}*
                        </label>
                    </Col>
                    <Col>
                        <input
                            type="text"
                            className="form-control"
                            value={loginNames?.newLoginNameRepeat || ''}
                            placeholder={t(locale)?.teacher?.login_name}
                            onChange={(e) => handleInputChange('newLoginNameRepeat', e.target.value)}
                        />
                    </Col>
                    <Col md={2} />
                </Row>
            </Modal.Body>
            <Modal.Footer className="text-center">
                <div className="col-12 text-center">
                    <button
                        className="btn m-btn--pill btn-link m-btn m-btn--custom"
                        onClick={onClose}
                    >
                        {t(locale)?.back}
                    </button>
                    <button
                        className="btn m-btn--pill btn-success m-btn--wide"
                        onClick={handleSave}
                    >
                        {t(locale)?.save}
                    </button>
                </div>
            </Modal.Footer>
        </Modal>
    )
}

export default loginNameChange