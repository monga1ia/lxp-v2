import message from 'modules/message'
import React, { useState } from 'react'
import { Modal } from 'semantic-ui-react'
import { Col, Row } from 'react-bootstrap'
import CloseIcon from '@mui/icons-material/Close'
import secureLocalStorage from 'react-secure-storage'
import { translations } from 'utils/translations'

const locale = secureLocalStorage?.getItem('selectedLang') || 'mn'

const passwordReset = ({ onClose, onSubmit }) => {
    const [password, setPassword] = useState({})

    const handleInputChange = (name, value) =>
        setPassword({ ...password, [name]: value })

    const handleSave = () => {
        if (!password?.new || !password?.repeat)
            return message(translations(locale)?.err?.fill_all_fields)
        else if (password?.new.length < 4)
            return message(translations(locale)?.password_length_error)
        else if (password?.new !== password?.repeat)
            return message(translations(locale)?.password_re_enter_mismatch)
        onSubmit({
            password: password.new,
            passwordRepeat: password.repeat
        })
    }

    return (
        <Modal
            centered
            open={true}
            onClose={onClose}
            className='react-modal overflow-modal'
        >
            <div className='header'>
                {translations(locale)?.change_password}
                <button type='button' className='close' aria-label='Close' onClick={onClose} >
                    <CloseIcon />
                </button>
            </div>
            <div className='content'>
                <p style={{ color: '#848691' }} className='fs-11 pb-4 pl-4'>
                    {translations(locale)?.change_password_description}
                </p>
                <Row className='form-group'>
                    <Col className='text-right'>
                        <label className='text-right label-pinnacle-bold col-form-label'>
                            {translations(locale)?.new_password}*
                        </label>
                    </Col>
                    <Col>
                        <input
                            type='password'
                            className='form-control'
                            value={password?.new || ''}
                            autoComplete='new-password'
                            placeholder={translations(locale)?.password}
                            onChange={(e) => handleInputChange('new', e.target.value)}
                        />
                    </Col>
                    <Col md={2} />
                </Row>
                <Row className='form-group'>
                    <Col className='text-right'>
                        <label className='text-right label-pinnacle-bold col-form-label'>
                            {translations(locale)?.re_enter_new_password}*
                        </label>
                    </Col>
                    <Col>
                        <input
                            type='password'
                            className='form-control'
                            autoComplete='new-password'
                            value={password?.repeat || ''}
                            placeholder={translations(locale)?.password}
                            onChange={(e) => handleInputChange('repeat', e.target.value)}
                        />
                    </Col>
                    <Col md={2} />
                </Row>
            </div>
            <div className='actions modal-footer '>
                <div className='col-12 text-center'>
                    <button
                        className='btn m-btn--pill btn-link m-btn'
                        onClick={onClose}
                    >
                        {translations(locale)?.back}
                    </button>
                    <button
                        className='btn m-btn--pill btn-success m-btn--wide'
                        onClick={handleSave}
                    >
                        {translations(locale)?.save}
                    </button>
                </div>
            </div>
        </Modal>
    )
}

export default passwordReset