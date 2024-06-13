import React, { useEffect, useRef, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { fetchRequest } from 'utils/fetchRequest';
import { toDropdownArray } from 'utils/utils';
import { authInit, studentAuthRegister, studentRegisterVerify, studentRegisterVerificationResend } from '../../utils/fetchRequest/Urls';
import showMessage from "modules/message";
import { setColor } from "settings/settingsSlice";
import { setLoading, setAuth, setPersonInfo, setSchools, setSelectedSchool } from 'utils/redux/action';
import Select from "modules/Form/Select";
import DatePicker from "react-datepicker";
import CustomHeader from "modules/Form/DatePickerRange/CustomHeader";
import mn from "date-fns/locale/mn";
import format from "date-fns/format";

const RegistrationModal = ({
    show,
    setShow
}) => {
    const { t } = useTranslation();
    const formRef = useRef();
    const history = useHistory();
    const dispatch = useDispatch();
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [confirmCode, setConfirmCode] = useState('');
    const [lastName, setLastName] = useState('');
    const [firstName, setFirstName] = useState('');
    const [schoolName, setSchoolName] = useState('');
    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const [selectedTabCode, setSelectedTabCode] = useState('PHONE');
    const [signUpSubmit, setSignUpSubmit] = useState(false);
    const [errorPhoneNumber, setErrorPhoneNumber] = useState(false);
    const [errorEmail, setErrorEmail] = useState(false);
    const [errorLastName, setErrorLastName] = useState(false);
    const [errorFirstName, setErrorFirstName] = useState(false);
    const [errorGender, setErrorGender] = useState(false);
    const [errorDate, setErrorDate] = useState(false);
    const [errorProvince, setErrorProvince] = useState(false);
    const [errorSchoolName, setErrorSchoolName] = useState(false);
    const [errorGrade, setErrorGrade] = useState(false);
    const [errorClassName, setErrorClassName] = useState(false);
    const [errorPassword, setErrorPassword] = useState(false);
    const [errorRepeatPassword, setErrorRepeatPassword] = useState(false);
    const [errorConfirmCode, setErrorConfirmCode] = useState(false);
    const [genderId, setGenderId] = useState(null)
    const [date, setDate] = useState('')
    const [className, setClassName] = useState('')
    const [provinceId, setProvinceId] = useState(null)
    const [gradeId, setGradeId] = useState(null)
    const [genderOptions, setGenderOptions] = useState([
        {
            value: 'M',
            text: 'Эрэгтэй'
        },
        {
            value: 'F',
            text: 'Эмэгтэй'
        },
    ]);
    const [provinceOptions, setProvinceOptions] = useState([]);
    const [gradeOptions, setGradeOptions] = useState([]);

    const init = (params = {}) => {
        setLoading(true)
        fetchRequest(authInit, 'POST', params)
            .then((res) => {
                if (res.success) {
                    setGradeOptions(toDropdownArray(res?.grades, 'id', 'name'))
                    setProvinceOptions(toDropdownArray(res?.aimags, 'value', 'title'))
                } else {
                    showMessage(res.message)
                }
                setLoading(false)
            })
            .catch(() => {
                showMessage(t('errorMessage.title'));
                setLoading(false)
            })
    }

    useEffect(() => {
        init();
    }, []);

    const onHandlerSignUpSubmit = () => {
        let error = false;

        if (selectedTabCode == 'PHONE') {
            if (!phoneNumber) {
                error = true
                setErrorPhoneNumber(true)
                return
            } else {
                error = false
                setErrorPhoneNumber(false)
            }
        }

        if (selectedTabCode == 'EMAIL') {
            if (!email) {
                error = true
                setErrorEmail(true)
                return
            } else {
                error = false
                setErrorEmail(false)
            }
        }

        if (!lastName) {
            error = true
            setErrorLastName(true)
            return
        } else {
            error = false
            setErrorLastName(false)
        }

        if (!firstName) {
            error = true
            setErrorFirstName(true)
            return
        } else {
            error = false
            setErrorFirstName(false)
        }

        if (!genderId) {
            error = true
            setErrorGender(true)
            return
        } else {
            error = false
            setErrorGender(false)
        }

        if (!date) {
            error = true
            setErrorDate(true)
            return
        } else {
            error = false
            setErrorDate(false)
        }

        if (!provinceId) {
            error = true
            setErrorProvince(true)
            return
        } else {
            error = false
            setErrorProvince(false)
        }

        if (!schoolName) {
            error = true
            setErrorSchoolName(true)
            return
        } else {
            error = false
            setErrorSchoolName(false)
        }

        if (!gradeId) {
            error = true
            setErrorGrade(true)
            return
        } else {
            error = false
            setErrorGrade(false)
        }

        if (!className) {
            error = true
            setErrorClassName(true)
            return
        } else {
            error = false
            setErrorClassName(false)
        }

        if (!password) {
            error = true
            setErrorPassword(true)
            return
        } else {
            error = false
            setErrorPassword(false)
        }

        if (!repeatPassword) {
            error = true
            setErrorRepeatPassword(true)
            return
        } else {
            error = false
            setErrorRepeatPassword(false)
        }

        if (password.length < 4) {
            showMessage(t('auth.errorMessage.enterAtLeastFourCharacter'), false)
            return
        }

        if (password != repeatPassword) {
            showMessage(t('auth.errorMessage.passwordRepeatNotMatch'), false)
            return
        }

        if (!error) {
            let existingProvince = provinceOptions.find(data => data.value == provinceId)

            if (selectedTabCode == 'PHONE') {
                const postData = {
                    username: phoneNumber,
                    type: selectedTabCode,
                    lastName: lastName,
                    firstName: firstName,
                    gender: genderId,
                    date: format(date, "yyyy-MM-dd"),
                    province: existingProvince?.value || '',
                    provinceName: existingProvince?.text || '',
                    schoolName: schoolName,
                    grade: gradeId,
                    class: className,
                    password: password,
                    repeatPassword: repeatPassword
                }

                dispatch(setLoading(true));
                fetchRequest(studentAuthRegister, 'POST', postData)
                    .then(response => {
                        const { message = '', success = false } = response
                        if (response.success) {
                            setSignUpSubmit(true)
                            showMessage(message, success)
                        } else {
                            showMessage(message || t('errorMessage.title'), success)
                        }
                        dispatch(setLoading(false));
                    })
                    .catch((e) => {
                        showMessage(t('errorMessage.title'))
                        dispatch(setLoading(false));
                    });
            } else if (selectedTabCode == 'EMAIL') {
                const postData = {
                    username: email,
                    type: selectedTabCode,
                    lastName: lastName,
                    firstName: firstName,
                    gender: genderId,
                    date: format(date, "yyyy-MM-dd"),
                    province: existingProvince?.value || '',
                    provinceName: existingProvince?.text || '',
                    schoolName: schoolName,
                    grade: gradeId,
                    class: className,
                    password: password,
                    repeatPassword: repeatPassword
                }

                dispatch(setLoading(true));
                fetchRequest(studentAuthRegister, 'POST', postData)
                    .then(response => {
                        const { message = '', success = false } = response
                        if (response.success) {
                            setSignUpSubmit(true)
                            showMessage(message, success)
                        } else {
                            showMessage(message || t('errorMessage.title'), success)
                        }
                        dispatch(setLoading(false));
                    })
                    .catch((e) => {
                        showMessage(t('errorMessage.title'))
                        dispatch(setLoading(false));
                    });
            }
        }
    };

    const onHandlerPublishSubmit = () => {
        let username = ''

        if (selectedTabCode == 'PHONE') {
            username = phoneNumber
        } else if (selectedTabCode == 'EMAIL') {
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
            type: selectedTabCode,
            code: confirmCode
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
            .catch((e) => {
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

    const onHandlerLastNameChange = (e) => {
        setLastName(e.target.value)
    }

    const onHandlerFirstNameChange = (e) => {
        setFirstName(e.target.value)
    }

    const genderDropdownChange = (value) => {
        setGenderId(value)
    }

    const handleDateChange = (value) => {
        setDate(value)
    }

    const handleProvinceChange = (value) => {
        setProvinceId(value)
    }

    const onHandlerSchoolChange = (e) => {
        setSchoolName(e.target.value)
    }

    const handleGradeChange = (value) => {
        setGradeId(value)
    }

    const onHandlerClassNameChange = (e) => {
        setClassName(e.target.value)
    }

    const onHandlerPasswordChange = (e) => {
        setPassword(e.target.value)
    }

    const onHandlerRepeatPasswordChange = (e) => {
        setRepeatPassword(e.target.value)
    }

    const getCodeAgain = () => {
        let username = ''

        if (selectedTabCode == 'PHONE') {
            username = phoneNumber
        } else if (selectedTabCode == 'EMAIL') {
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

    return (
        <Modal
            centered
            show={show}
            onHide={() => setShow(false)}
            size='lg'
        >
            <Modal.Header closeButton style={{ padding: '1rem 2rem' }}>
                <Modal.Title className='fs-16'>
                    {t('auth.signUp')}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className='px-0'>
                {
                    signUpSubmit
                        ?
                        <>
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
                            <div style={{ display: 'flex', marginTop: '1rem' }}>
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
                            </div>
                        </>
                        :
                        <>
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
                                    >{t('common.phoneNumber')}*</label>
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
                                >{t("person.lastName") + '*'}</label>
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
                                        placeholder={t("errorMessage.enterPersonLastName")}
                                        value={lastName}
                                        className={errorLastName ? "modal-input-lg form-control is-invalid" : "modal-input-lg"}
                                        onChange={onHandlerLastNameChange}
                                    />
                                    {
                                        errorLastName &&
                                        <span style={{ color: '#F64E60' }}>{t("errorMessage.enterPersonLastName")}</span>
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
                                >{t("common.name") + '*'}</label>
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
                                        placeholder={t("errorMessage.enterName")}
                                        value={firstName}
                                        className={errorFirstName ? "modal-input-lg form-control is-invalid" : "modal-input-lg"}
                                        onChange={onHandlerFirstNameChange}
                                    />
                                    {
                                        errorFirstName &&
                                        <span style={{ color: '#F64E60' }}>{t("errorMessage.enterPersonLastName")}</span>
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
                                >{t("common.gender") + '*'}</label>
                                <div
                                    style={{
                                        display: 'flex',
                                        flex: 1,
                                        flexDirection: 'column',
                                        width: 'auto',
                                    }}
                                >
                                    <Select
                                        className={errorGender ? "modal-select-lg is-invalid" : "modal-select-lg"}
                                        clearable
                                        searchable
                                        options={genderOptions || []}
                                        value={genderId || null}
                                        onChange={(value) => genderDropdownChange(value)}
                                    />
                                    {
                                        errorGender &&
                                        <span style={{ display: 'block', color: '#F64E60' }}>{t("errorMessage.selectGender")}</span>
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
                                >{t("person.birthdate") + '*'}</label>
                                <div
                                    style={{
                                        display: 'flex',
                                        flex: 1,
                                        flexDirection: 'column',
                                        width: 'auto',
                                    }}
                                >
                                    <DatePicker
                                        locale={mn}
                                        className={errorDate ? 'w-350 h-38 is-invalid' : 'w-350 border-gray h-38'}
                                        selected={date}
                                        maxDate={new Date()}
                                        dateFormat={"yyyy-MM-dd"}
                                        onChange={handleDateChange}
                                        renderCustomHeader={CustomHeader}
                                    />
                                    {
                                        errorDate &&
                                        <span style={{ display: 'block', color: '#F64E60' }}>{t("person.errorMessage.selectBirthDate")}</span>
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
                                >{t("setting.addressSegment.province") + '*'}</label>
                                <div
                                    style={{
                                        display: 'flex',
                                        flex: 1,
                                        flexDirection: 'column',
                                        width: 'auto',
                                    }}
                                >
                                    <Select
                                        className={errorProvince ? 'modal-select-lg is-invalid' : 'modal-select-lg'}
                                        clearable
                                        searchable
                                        options={provinceOptions || []}
                                        value={provinceId || null}
                                        onChange={(value) => handleProvinceChange(value)}
                                    />
                                    {
                                        errorProvince &&
                                        <span style={{ display: 'block', color: '#F64E60' }}>{t("errorMessage.enterProvince")}</span>
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
                                >{t("school.title") + '*'}</label>
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
                                        placeholder={t("school.errorMessage.enterSchool")}
                                        value={schoolName}
                                        className={errorSchoolName ? "modal-input-lg is-invalid" : "modal-input-lg"}
                                        onChange={onHandlerSchoolChange}
                                    />
                                    {
                                        errorSchoolName &&
                                        <span style={{ display: 'block', color: '#F64E60' }}>{t("school.errorMessage.enterSchool")}</span>
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
                            <div style={{ display: 'flex', marginTop: '0.8rem' }}>
                                <label
                                    className='modal-select-title mr-2'
                                    style={{
                                        display: 'flex',
                                        flex: 1,
                                        justifyContent: 'flex-end',
                                        alignItems: 'center',
                                        marginBottom: 0,
                                        width: 'auto',
                                    }}
                                >{t("curriculum.grade") + '*'}</label>
                                <div
                                    style={{
                                        display: 'flex',
                                        flex: 1,
                                        flexDirection: 'column',
                                        width: 'auto',
                                    }}
                                >
                                    <Select
                                        className={errorGrade ? 'modal-select-lg is-invalid' : 'modal-select-lg'}
                                        clearable
                                        searchable
                                        options={gradeOptions || []}
                                        value={gradeId || null}
                                        onChange={(value) => handleGradeChange(value)}
                                    />
                                    {
                                        errorGrade &&
                                        <span style={{ display: 'block', color: '#F64E60' }}>{t("errorMessage.selectGrade")}</span>
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
                            <div style={{ display: 'flex', marginTop: '0.8rem' }}>
                                <label
                                    className='modal-select-title mr-2'
                                    style={{
                                        display: 'flex',
                                        flex: 1,
                                        justifyContent: 'flex-end',
                                        alignItems: 'center',
                                        marginBottom: 0,
                                        width: 'auto',
                                    }}
                                >{t("common.className") + '*'}</label>
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
                                        placeholder={t("errorMessage.enterClassName")}
                                        value={className}
                                        className={errorClassName ? "modal-input-lg is-invalid" : "modal-input-lg"}
                                        onChange={onHandlerClassNameChange}
                                    />
                                    {
                                        errorClassName &&
                                        <span style={{ display: 'block', color: '#F64E60' }}>{t("errorMessage.enterClassName")}</span>
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
                            <div style={{ display: 'flex', marginTop: '0.8rem' }}>
                                <label
                                    className='modal-select-title mr-2'
                                    style={{
                                        display: 'flex',
                                        flex: 1,
                                        justifyContent: 'flex-end',
                                        alignItems: 'center',
                                        marginBottom: 0,
                                        width: 'auto',
                                    }}
                                >{t("auth.password") + '*'}</label>
                                <div
                                    style={{
                                        display: 'flex',
                                        flex: 1,
                                        flexDirection: 'column',
                                        width: 'auto',
                                    }}
                                >
                                    <input
                                        type='password'
                                        placeholder={t("auth.errorMessage.enterNewPassword")}
                                        value={password}
                                        className={errorPassword ? "modal-input-lg form-control is-invalid" : "modal-input-lg"}
                                        onChange={onHandlerPasswordChange}
                                    />
                                    {
                                        errorPassword &&
                                        <span style={{ display: 'block', color: '#F64E60' }}>{t("auth.errorMessage.enterNewPassword")}</span>
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
                            <div style={{ display: 'flex', marginTop: '0.8rem' }}>
                                <label
                                    className='modal-select-title mr-2'
                                    style={{
                                        display: 'flex',
                                        flex: 1,
                                        justifyContent: 'flex-end',
                                        alignItems: 'center',
                                        marginBottom: 0,
                                        width: 'auto',
                                    }}
                                >{t("auth.repeatNewPassword") + '*'}</label>
                                <div
                                    style={{
                                        display: 'flex',
                                        flex: 1,
                                        flexDirection: 'column',
                                        width: 'auto',
                                    }}
                                >
                                    <input
                                        type='password'
                                        placeholder={t("auth.errorMessage.enterNewPasswordRepeat")}
                                        value={repeatPassword}
                                        className={errorRepeatPassword ? "modal-input-lg form-control is-invalid" : "modal-input-lg"}
                                        onChange={onHandlerRepeatPasswordChange}
                                    />
                                    {
                                        errorRepeatPassword &&
                                        <span style={{ display: 'block', color: '#F64E60' }}>{t("auth.errorMessage.enterNewPasswordRepeat")}</span>
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
                        </>
                }
            </Modal.Body>
            <Modal.Footer className='d-flex justify-content-center' style={{ padding: '1rem 2rem' }}>
                <Button
                    onClick={() => setShow(false)}
                    variant="outline-dark"
                >
                    {t('common.close')}
                </Button>
                {
                    signUpSubmit
                        ?
                        <Button
                            className='save-button secondary ml-3'
                            variant='empty'
                            onClick={onHandlerPublishSubmit}
                        >
                            {t('action.publish')}
                        </Button>
                        :
                        <Button
                            variant="success"
                            className='text-uppercase fs-12 br-8 ps-4 pe-4'
                            onClick={onHandlerSignUpSubmit}
                        >
                            {t('auth.signUp')}
                        </Button>
                }
            </Modal.Footer>
        </Modal >
    );
};

export default RegistrationModal;