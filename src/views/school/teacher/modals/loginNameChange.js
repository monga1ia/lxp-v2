import message from 'modules/message'
import React, { useState, useRef } from 'react'
import { Modal } from 'react-bootstrap'
import { Col, Row } from 'react-bootstrap'
import CloseIcon from '@mui/icons-material/Close'
import secureLocalStorage from 'react-secure-storage'
import { useTranslation } from "react-i18next";
import Forms from 'modules/Form/Forms'

const loginNameChange = ({ onClose, onSubmit }) => {
    
    const { t } = useTranslation();
    const formRef = useRef();

    const [loginNames, setLoginNames] = useState({})

    const handleInputChange = (name, value) => {
        setLoginNames({ ...loginNames, [name]: value })
    }

    const handleSave = () => {
        if (!loginNames?.loginName || !loginNames?.newLoginName || !loginNames?.newLoginNameRepeat) return message(t('err.fill_all_fields'))
        if (loginNames?.newLoginName !== loginNames?.newLoginNameRepeat) return message(t('login_name_re_enter_mismatch'))
        onSubmit({ existingUsername: loginNames?.loginName, newUsername: loginNames?.newLoginName })
    }

    // const newPasswordFields = [
    //     {
    //         key: 'confirmationCode',
    //         label: `${t('teacher.current_login_name')}*`,
    //         labelBold: true,
    //         value: '',
    //         type: 'nonCryllic',
    //         required: true,
    //         errorMessage: t('auth.confirmationCode'),
    //         placeHolder: 'safasdasdasd',
    //         className: "form-control",
    //         upperCase: true,
    //         labelStyle: {
    //             textAlign: 'right',
    //             fontFamily: 'PinnacleBold',
    //             color: '#575962 !important',
    //             fontSize: '12px !important',
    //             paddingTop: 'calc(.65rem + 1px)',
    //             paddingBottom: 'calc(.65rem + 1px)',
    //             marginBottom: '0',
    //             fontSize: 'inherit',
    //             lineHeight: '1.25'
    //         }
    //     },
    //     {
    //         key: 'newPassword',
    //         label: `${t('teacher.login_name')}*`,
    //         className: "form-control",
    //         labelBold: true,
    //         value: '',
    //         type: 'password',
    //         required: true,
    //         errorMessage: t('auth.errorMessage.enterNewPassword'),
    //         placeHolder: t('auth.errorMessage.enterNewPassword'),
    //         labelStyle: {
    //             textAlign: 'right',
    //             fontFamily: 'PinnacleBold',
    //             color: '#575962 !important',
    //             fontSize: '12px !important',
    //             paddingTop: 'calc(.65rem + 1px)',
    //             paddingBottom: 'calc(.65rem + 1px)',
    //             marginBottom: '0',
    //             fontSize: 'inherit',
    //             lineHeight: '1.25'
    //         }
    //     },
    //     {
    //         key: 'newPasswordRepeat',
    //         label: `${t('teacher.login_name')}*`,
    //         labelBold: true,
    //         className: "form-control",
    //         value: '',
    //         type: 'password',
    //         required: true,
    //         errorMessage: t('auth.repeatNewPassword'),
    //         placeHolder: t('auth.repeatNewPassword'),
    //         labelStyle: {
    //             textAlign: 'right',
    //             fontFamily: 'PinnacleBold',
    //             color: '#575962 !important',
    //             fontSize: '12px !important',
    //             paddingTop: 'calc(.65rem + 1px)',
    //             paddingBottom: 'calc(.65rem + 1px)',
    //             marginBottom: '0',
    //             fontSize: 'inherit',
    //             lineHeight: '1.25'
    //         }
    //     },
    // ];

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
                    {t('teacher.change_login_name')}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p style={{ color: '#848691'}} className='fs-11 pb-4 pl-4'>{t('teacher.change_login_name_description')}</p>
                <Row className='form-group'>
                    {/* <Forms 
                        ref={formRef} 
                        fields={newPasswordFields} 
                    /> */}
                    <Col className='text-right'>
                        <label className="text-right label-pinnacle-bold col-form-label">
                            {t('teacher.current_login_name')}*
                        </label>
                    </Col>
                    <Col>
                        <input
                            type="text"
                            className="form-control"
                            value={loginNames?.loginName || ''}
                            placeholder={t('teacher.login_name')}
                            onChange={(e) => handleInputChange('loginName', e.target.value)}
                        />
                    </Col>
                    <Col md={2} />
                </Row>
                <Row className='form-group'>
                    <Col className='text-right'>
                        <label className="text-right label-pinnacle-bold col-form-label">
                            {t('teacher.new_login_name')}*
                        </label>
                    </Col>
                    <Col>
                        <input
                            type="text"
                            className="form-control"
                            value={loginNames?.newLoginName || ''}
                            placeholder={t('teacher.login_name')}
                            onChange={(e) => handleInputChange('newLoginName', e.target.value)}
                        />
                    </Col>
                    <Col md={2} />
                </Row>
                <Row className='form-group'>
                    <Col className='text-right'>
                        <label className="text-right label-pinnacle-bold col-form-label">
                            {t('teacher.new_login_name_repeat')}*
                        </label>
                    </Col>
                    <Col>
                        <input
                            type="text"
                            className="form-control"
                            value={loginNames?.newLoginNameRepeat || ''}
                            placeholder={t('teacher.login_name')}
                            onChange={(e) => handleInputChange('newLoginNameRepeat', e.target.value)}
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
                    {t('back')}
                </button>
                <button
                    className="btn m-btn--pill btn-success m-btn--wide"
                    onClick={handleSave}
                >
                    {t('save')}
                </button>
            </Modal.Footer>
        </Modal>
    )
}

export default loginNameChange