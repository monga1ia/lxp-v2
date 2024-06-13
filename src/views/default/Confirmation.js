import React, { useRef, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { fetchRequest } from 'utils/fetchRequest';
import { studentRegisterVerify, studentRegisterVerificationResend } from '../../utils/fetchRequest/Urls';
import showMessage from "modules/message";
import { setColor } from "settings/settingsSlice";
import { setLoading, setAuth, setPersonInfo, setSchools, setSelectedSchool } from 'utils/redux/action';

const ConfirmationModal = ({
    show,
    setShow
}) => {
    const { t } = useTranslation();
    const formRef = useRef();
    const history = useHistory();
    const dispatch = useDispatch();
    const [email, setEmail] = useState('');
    const [selectedTabCode, setSelectedTabCode] = useState('PHONE');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [confirmCode, setConfirmCode] = useState('');
    const [errorConfirmCode, setErrorConfirmCode] = useState(false);
    const [errorPhoneNumber, setErrorPhoneNumber] = useState(false);
    const [errorEmail, setErrorEmail] = useState(false);

    const [ableToGetAgain, setAbleToGetAgain] = useState(true)

    const onHandlerPublishSubmit = () => {
        let username = ''

        if (selectedTabCode == 'PHONE') {
            if (!phoneNumber) {
                setErrorPhoneNumber(true)
                return
            } else {
                setErrorPhoneNumber(false)
            }

            username = phoneNumber
        } else if (selectedTabCode == 'EMAIL') {
            if (!email) {
                setErrorEmail(true)
                return
            } else {
                setErrorEmail(false)
            }

            username = email
        }

        if (!confirmCode) {
            setErrorConfirmCode(true)
            return
        } else {
            setErrorConfirmCode(false)
        }

        let params = {
            username: username,
            code: confirmCode,
            type: selectedTabCode,
        }

        dispatch(setLoading(true));
        fetchRequest(studentRegisterVerify, 'POST', params)
            .then(response => {
                const { message = '', success = false } = response
                if (response.success) {
                    showMessage(message, success)
                    const { token, eToken, person, schools, user } = response;

                    dispatch(setAuth(Object.assign({ token }, { eToken })));
                    dispatch(setPersonInfo(person));
                    dispatch(setColor("student-blue"));
                    if (schools.length === 1) {
                        dispatch(setSelectedSchool(schools[0]))
                    } else {
                        dispatch(setSelectedSchool(null))
                    }
                    dispatch(setSchools(schools))
                    history.push('/')
                } else {
                    showMessage(message || t('errorMessage.title'), success)
                }
                dispatch(setLoading(false));
            })
            .catch(() => {
                showMessage(t('errorMessage.title'))
                dispatch(setLoading(false));
            });
    }

    const getCodeAgain = () => {
        let username = ''

        if (selectedTabCode == 'PHONE') {
            if (!phoneNumber) {
                setErrorPhoneNumber(true)
                return
            } else {
                setErrorPhoneNumber(false)
            }

            username = phoneNumber
        } else if (selectedTabCode == 'EMAIL') {
            if (!email) {
                setErrorEmail(true)
                return
            } else {
                setErrorEmail(false)
            }

            username = email
        }

        let params = {
            username: username,
            type: selectedTabCode
        }

        dispatch(setLoading(true));
        fetchRequest(studentRegisterVerificationResend, 'POST', params)
            .then(response => {
                const { message = '', success = false } = response
                if (response.success) {
                    setAbleToGetAgain(true)
                    showMessage(message, success)
                } else {
                    showMessage(message || t('errorMessage.title'), success)
                }
                dispatch(setLoading(false));
            })
            .catch(() => {
                showMessage(t('errorMessage.title'))
                dispatch(setLoading(false));
            });
    }

    const onSelectTab = (code) => {
        setSelectedTabCode(code)
    }

    const onHandlerPhoneNumberChange = (e) => {
        setPhoneNumber(e.target.value)
    }

    const onHandlerEmailChange = (e) => {
        setEmail(e.target.value)
    }

    const onHandlerConfigChange = (e) => {
        setConfirmCode(e.target.value)
    }

    return (
        <Modal
            centered
            show={show}
            onHide={() => setShow(false)}
            size='lg'
        >
            <Modal.Header closeButton style={{ padding: '1rem 2rem' }}>
                <Modal.Title className='fs-16'>
                    {t('action.publish')}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className='px-0'>
                <div className="d-flex justify-content-center mb-3">
                    <div className="register-tab-container d-flex">
                        <span
                            onClick={() => {
                                onSelectTab('PHONE')
                            }}
                            className={`tab cursor-pointer  ${selectedTabCode == 'PHONE' && "active"}`}
                        >
                            {t('common.phoneNumber')}
                        </span>
                        <span
                            onClick={() => {
                                onSelectTab('EMAIL')
                            }}
                            className={`tab cursor-pointer ${selectedTabCode == 'EMAIL' && "active"}`}
                        >
                            {t('questionnaire.email')}
                        </span>
                    </div>
                </div>
                {
                    selectedTabCode && selectedTabCode == 'PHONE' &&
                    <div style={{ display: 'flex' }}>
                        <label
                            className="modal-select-title mr-2"
                            style={{
                                display: 'flex',
                                flex: 1,
                                justifyContent: 'flex-end',
                                alignItems: 'center',
                                marginBottom: 0,
                                width: 'auto',
                            }}
                        >{t("common.phoneNumber") + '*'}</label>
                        <div
                            style={{
                                display: 'flex',
                                flex: 1,
                                flexDirection: 'column',
                                width: 'auto',
                            }}
                        >
                            <input
                                required={true}
                                type='number'
                                onWheel={e => e?.target?.blur()}
                                placeholder={t("auth.errorMessage.registrationPhoneNumber")}
                                value={phoneNumber}
                                className={errorPhoneNumber ? "modal-input-lg form-control is-invalid" : "modal-input-lg"}
                                onChange={onHandlerPhoneNumberChange}
                            />
                            {
                                errorPhoneNumber &&
                                <span style={{ color: '#F64E60' }}>{t("auth.errorMessage.registrationPhoneNumber")}</span>
                            }
                        </div>
                        <div
                            style={{
                                display: 'flex',
                                flex: 0.8,
                                flexDirection: 'column',
                                marginLeft: 10,
                                width: 'auto',
                            }}
                        />
                    </div>
                }
                {
                    selectedTabCode && selectedTabCode == 'EMAIL' &&
                    <div style={{ display: 'flex' }}>
                        <label
                            className="modal-select-title mr-2"
                            style={{
                                display: 'flex',
                                flex: 1,
                                justifyContent: 'flex-end',
                                alignItems: 'center',
                                marginBottom: 0,
                                width: 'auto',
                            }}
                        >{t("questionnaire.email") + '*'}</label>
                        <div
                            style={{
                                display: 'flex',
                                flex: 1,
                                flexDirection: 'column',
                                width: 'auto',
                            }}
                        >
                            <input
                                type='email'
                                placeholder={t("auth.errorMessage.registrationEmail")}
                                value={email}
                                className={errorEmail ? "modal-input-lg form-control is-invalid" : "modal-input-lg"}
                                onChange={onHandlerEmailChange}
                            />
                            {
                                errorEmail &&
                                <span style={{ color: '#F64E60' }}>{t("auth.errorMessage.registrationEmail")}</span>
                            }
                        </div>
                        <div
                            style={{
                                display: 'flex',
                                flex: 0.8,
                                flexDirection: 'column',
                                marginLeft: 10,
                                width: 'auto',
                            }}
                        />
                    </div>
                }
                <div style={{ display: 'flex', marginTop: '0.8rem' }}>
                    <label
                        className="modal-select-title mr-2"
                        style={{
                            display: 'flex',
                            flex: 1,
                            justifyContent: 'flex-end',
                            alignItems: 'center',
                            marginBottom: 0,
                            width: 'auto',
                        }}
                    >{t("auth.verificationCode") + '*'}</label>
                    <div
                        style={{
                            display: 'flex',
                            flex: 1,
                            flexDirection: 'column',
                            width: 'auto',
                        }}
                    >
                        <input
                            type='text'
                            placeholder={t("auth.errorMessage.confirmationCode")}
                            value={confirmCode}
                            className={errorConfirmCode ? "modal-input-lg form-control is-invalid" : "modal-input-lg"}
                            onChange={onHandlerConfigChange}
                        />
                        {
                            errorConfirmCode &&
                            <span style={{ color: '#F64E60' }}>{t("auth.errorMessage.confirmationCode")}</span>
                        }
                    </div>
                    <div
                        style={{
                            display: 'flex',
                            flex: 0.8,
                            flexDirection: 'column',
                            marginLeft: 10,
                            width: 'auto',
                        }}
                    />
                </div>

                {ableToGetAgain && <div style={{ display: 'flex', marginTop: '1rem' }}>
                    <label
                        className="modal-select-title mr-2"
                        style={{
                            display: 'flex',
                            flex: 1,
                            justifyContent: 'flex-end',
                            alignItems: 'center',
                            marginBottom: 0,
                            width: 'auto',
                        }}
                    />
                    <div
                        style={{
                            display: 'flex',
                            flex: 1,
                            flexDirection: 'column',
                            width: 'auto',
                        }}
                    >
                        <span style={{
                            textDecoration: 'underline',
                            marginLeft: '1rem',
                            cursor: 'pointer',
                            maxWidth: 150
                        }} onClick={getCodeAgain}
                        >{t('auth.confirmationCodeGetAgian')}</span>
                        <input
                            type='text'
                            className={"modal-input-lg"}
                            style={{
                                visibility: 'hidden',
                                height: 1
                            }}
                        />
                    </div>
                    <div
                        style={{
                            display: 'flex',
                            flex: 0.8,
                            flexDirection: 'column',
                            marginLeft: 10,
                            width: 'auto',
                        }}
                    />
                </div>}
            </Modal.Body>
            <Modal.Footer className='d-flex justify-content-center' style={{ padding: '1rem 2rem' }}>
                <Button
                    onClick={() => setShow(false)}
                    variant="outline-dark"
                >
                    {t('common.close')}
                </Button>
                <Button
                    className='save-button secondary ml-3'
                    variant='empty'
                    onClick={onHandlerPublishSubmit}
                >
                    {t('action.publish')}
                </Button>
            </Modal.Footer>
        </Modal >
    );
};

export default ConfirmationModal;