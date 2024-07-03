import message from 'modules/message'
import React, { useState, useRef } from 'react'
import { Modal } from 'react-bootstrap'
import { Col, Row } from 'react-bootstrap'
import secureLocalStorage from 'react-secure-storage'
import { useTranslation } from "react-i18next";
import Forms from 'modules/Form/Forms'

const loginNameChange = ({ onClose, onSubmit, id }) => {
    
    const { t } = useTranslation();
    const formRef = useRef();

    const [loginNames, setLoginNames] = useState({})
    const loginNameFields = [
        {
            key: 'loginName',
            label: `${t('teacher.current_login_name')}*`,
            labelBold: true,
            value: '',
            type: 'text',
            required: true,
            errorMessage: t('auth.errorMessage.enterLoginName'),
            placeholder: t('teacher.login_name'),
            className: "form-control",
            upperCase: true,
            formContainerClassName: 'form-group m-form__group row',
            labelClassName: "col text-right label-pinnacle-bold",
            fieldContainerClassName: 'col',
            whiteSpaceClassName: 'col-md-2',
        },
        {
            key: 'newLoginName',
            label: `${t('teacher.new_login_name')}*`,
            className: "form-control",
            labelBold: true,
            value: '',
            type: 'text',
            required: true,
            errorMessage: t('auth.errorMessage.enterNewLoginName'),
            placeholder: t('teacher.login_name'),
            formContainerClassName: 'form-group m-form__group row',
            labelClassName: "col text-right label-pinnacle-bold",
            fieldContainerClassName: 'col',
            whiteSpaceClassName: 'col-md-2',
        },
        {
            key: 'newLoginNameRepeat',
            label: `${t('teacher.new_login_name_repeat')}*`,
            labelBold: true,
            className: "form-control",
            value: '',
            type: 'text',
            required: true,
            errorMessage: t('auth.errorMessage.repeatNewLoginName'),
            placeholder: t('teacher.login_name'),
            formContainerClassName: 'form-group m-form__group row',
            labelClassName: "col text-right label-pinnacle-bold",
            fieldContainerClassName: 'col',
            whiteSpaceClassName: 'col-md-2',
        },
    ];
    
    // const handleInputChange = (name, value) => {
    //     setLoginNames({ ...loginNames, [name]: value })
    // }

    const handleSave = () => {
        const [formsValid, formValues] = formRef.current.validate();
        if (formsValid) {
            if (formValues[1].value !== formValues[2].value){
                return message(t('login_name_re_enter_mismatch'))
            }
            else {
                setLoginNames({existingUsername: formValues[0].value, newUsername: formValues[1].value})
                message('success')

                // after success \/
                // console.log(loginNames)
                // setLoading(true)
                // onClose()
            }
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
                    {t('teacher.change_login_name')}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p style={{ color: '#848691'}} className='fs-11 pb-4 pl-4'>{t('teacher.change_login_name_description')}</p>
                <Row className='form-group'>
                    <Forms 
                        ref={formRef} 
                        fields={loginNameFields} 
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
                    onClick={handleSave}
                >
                    {t('save')}
                </button>
            </Modal.Footer>
        </Modal>
    )
}

export default loginNameChange