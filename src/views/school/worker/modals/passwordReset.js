import message from 'modules/message'
import React, { useState } from 'react'
import { Modal } from 'react-bootstrap'
import { Col, Row } from 'react-bootstrap'
import CloseIcon from '@mui/icons-material/Close'
import secureLocalStorage from 'react-secure-storage'
import { useTranslation } from "react-i18next";

const passwordReset = ({ onClose, onSubmit }) => {

    const { t } = useTranslation();
    
    const locale = secureLocalStorage?.getItem('selectedLang') || 'mn'
    const [password, setPassword] = useState({})

    const handleInputChange = (name, value) => {
        setPassword({ ...password, [name]: value })
    }

    const handleClick = () => {
        if (!password?.new || !password?.repeat) {
            return message(t(locale)?.err?.fill_all_fields)
        } else if (password?.new.length < 4) {
            return message(t(locale)?.password_length_error)
        } else if (password?.new !== password?.repeat) {
            return message(t(locale)?.password_re_enter_mismatch)
        }
        onSubmit(password.new, password.repeat)
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
                    {t(locale)?.teacher?.change_password_staff}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p style={{ color: '#848691', fontSize: '0.8937rem'  }} className='pb-4 pl-4'>{t(locale)?.teacher?.change_password_description_staff}</p>
                <Row className='form-group'>
                    <Col className='text-right'>
                        <label className="text-right label-pinnacle-bold col-form-label">
                            {t(locale)?.new_password}*
                        </label>
                    </Col>
                    <Col>
                        <input
                            type="password"
                            className="form-control"
                            value={password?.new || ''}
                            name='new'
                            placeholder={t(locale)?.password}
                            onChange={(e) => handleInputChange(e.target.name, e.target.value)}
                            autoComplete='new-password'
                        />
                    </Col>
                    <Col md={2} />
                </Row>
                <Row className='form-group'>
                    <Col className='text-right'>
                        <label className="text-right label-pinnacle-bold col-form-label">
                            {t(locale)?.re_enter_new_password}*
                        </label>
                    </Col>
                    <Col>
                        <input
                            type="password"
                            className="form-control"
                            value={password?.repeat || ''}
                            name='repeat'
                            placeholder={t(locale)?.password}
                            onChange={(e) => handleInputChange(e.target.name, e.target.value)}
                            autoComplete='new-password'
                        />
                    </Col>
                    <Col md={2} />
                </Row>
            </Modal.Body>
            <Modal.Footer className="text-center">
                <button
                    className="btn m-btn--pill btn-link m-btn m-btn--custom"
                    onClick={onClose}
                >
                    {t(locale)?.back}
                </button>
                <button
                    className="btn m-btn--pill btn-success m-btn--wide"
                    onClick={handleClick}
                >
                    {t(locale)?.save}
                </button>
            </Modal.Footer>
        </Modal>
    )
}

export default passwordReset