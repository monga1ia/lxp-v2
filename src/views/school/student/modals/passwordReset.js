import message from 'modules/message'
import React, { useState, useRef } from 'react'
import { Col, Row, Modal } from 'react-bootstrap'
import CloseIcon from '@mui/icons-material/Close'
import secureLocalStorage from 'react-secure-storage'
import { translations } from 'utils/translations'
import { useTranslation } from 'react-i18next'
import Forms from 'modules/Form/Forms'

const locale = secureLocalStorage?.getItem('selectedLang') || 'mn'

const passwordReset = ({ onClose, onSubmit }) => {

    const { t } = useTranslation()
    const formRef = useRef();

    const [password, setPassword] = useState({})
    const passwordFields = [
        {
            key: 'password',
            label: `${t('new_password')}*`,
            labelBold: true,
            value: '',
            type: 'password',
            required: true,
            errorMessage: t('error.enterNewPassword'),
            placeholder: t('password'),
            className: "form-control",
            upperCase: true,
            formContainerClassName: 'form-group m-form__group row',
            labelClassName: "col text-right label-pinnacle-bold col-form-label",
            fieldContainerClassName: 'col',
            whiteSpaceClassName: 'col-md-2',
        },
        {
            key: 'newPassword',
            label: `${t('re_enter_new_password')}*`,
            className: "form-control",
            labelBold: true,
            value: '',
            type: 'password',
            required: true,
            errorMessage: t('error.repeatNewPassword'),
            placeholder: t('password'),
            formContainerClassName: 'form-group m-form__group row',
            labelClassName: "col text-right label-pinnacle-bold col-form-label",
            fieldContainerClassName: 'col',
            whiteSpaceClassName: 'col-md-2',
        },
    ]

    const handleInputChange = (name, value) =>
        setPassword({ ...password, [name]: value })

    const handleSave = () => {
        const [formsValid, formValues] = formRef.current.validate();
        if (formsValid){
            if (formValues[0].value.length < 4) {
                return message(t('password_length_error'))
            } else if (formValues[0].value !== formValues[1].value) {
                return message(t('password_re_enter_mismatch'))
            } else {
                message('success', true)
            }

            // after success \/
            // setLoading(true)
            // onClose()
            // console.log(formValues[0].value, formValues[1].value)
            // onSubmit(formValues[0].value, formValues[1].value)
        } else {
            message(t('err.fill_all_fields'))
        }
        // if (!password?.new || !password?.repeat)
        //     return message(translations(locale)?.err?.fill_all_fields)
        // else if (password?.new.length < 4)
        //     return message(translations(locale)?.password_length_error)
        // else if (password?.new !== password?.repeat)
        //     return message(translations(locale)?.password_re_enter_mismatch)
        // onSubmit({
        //     password: password.new,
        //     passwordRepeat: password.repeat
        // })
    }

    return (
        <Modal
            dimmer='blurring'
            show={true}
            size="xl"
            aria-labelledby="contained-modal-title-vcenter"
            onHide={onClose}
            // className='react-modal overflow-modal'
            centered
        >
            <Modal.Header closeButton style={{padding: '1rem'}}>
                <Modal.Title className="modal-title d-flex flex-row justify-content-between w-100">
                    {t('change_password')}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p style={{ color: '#848691' }} className='fs-11 pb-4 pl-4'>
                    {t('change_password_description')}
                </p>
                <Row className='form-group'>
                    <Forms 
                        ref={formRef} 
                        fields={passwordFields}
                    />
                </Row>
            </Modal.Body>
            <Modal.Footer>
                <div className='col-12 text-center'>
                    <button
                        className='btn m-btn--pill btn-link m-btn m-btn--custom'
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
            </Modal.Footer>
        </Modal>
    )
}

export default passwordReset