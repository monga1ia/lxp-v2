import message from 'modules/message'
import React, { useState, useRef } from 'react'
import { Modal } from 'react-bootstrap'
import { Col, Row } from 'react-bootstrap'
import secureLocalStorage from 'react-secure-storage'
import { useTranslation } from "react-i18next";
import Forms from 'modules/Form/Forms'


const passwordReset = ({ onClose, onSubmit }) => {

    const { t } = useTranslation();
    const formRef = useRef();
    
    // const [password, setPassword] = useState({})

    const passwordFields = [
        {
            key: 'password',
            label: `${t('new_password')}*`,
            labelBold: true,
            value: '',
            type: 'password',
            required: true,
            errorMessage: t('auth.errorMessage.enterLoginName'),
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
            errorMessage: t('auth.errorMessage.enterNewLoginName'),
            placeholder: t('password'),
            formContainerClassName: 'form-group m-form__group row',
            labelClassName: "col text-right label-pinnacle-bold col-form-label",
            fieldContainerClassName: 'col',
            whiteSpaceClassName: 'col-md-2',
        },
    ]

    // const handleInputChange = (name, value) => {
    //     setPassword({ ...password, [name]: value })
    // }

    const handleSubmit = () => {
        const [formsValid, formValues] = formRef.current.validate();
        if (formsValid){
            if (formValues[0].value.length < 4) {
                return message(t('password_length_error'))
            } else if (formValues[0].value !== formValues[1].value) {
                return message(t('password_re_enter_mismatch'))
            }

            // after success \/
            // setLoading(true)
            // onClose()
            // console.log(formValues[0].value, formValues[1].value)
            // onSubmit(formValues[0].value, formValues[1].value)
        } else {
            message(t('err.fill_all_fields'))
        }
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
                    {t('teacher.change_password')}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p style={{ color: '#848691' }} className='fs-11 pb-4 pl-4'>{t('teacher.change_password_description')}</p>
                <Row className='form-group'>
                    <Forms 
                        ref={formRef} 
                        fields={passwordFields}
                    />
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
                    onClick={handleSubmit}
                >
                    {t('save')}
                </button>
            </Modal.Footer>
        </Modal>
    )
}

export default passwordReset