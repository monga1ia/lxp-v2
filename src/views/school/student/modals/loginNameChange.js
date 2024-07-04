import message from 'modules/message'
import React, { useState, useRef } from 'react'
import { Col, Row, Modal } from 'react-bootstrap'
import CloseIcon from '@mui/icons-material/Close'
import secureLocalStorage from 'react-secure-storage'
import { translations } from 'utils/translations'
import { useTranslation } from 'react-i18next'
import Forms from 'modules/Form/Forms'

const locale = secureLocalStorage?.getItem('selectedLang') || 'mn'

const loginNameChange = ({ onClose, onSubmit }) => {

    const { t } = useTranslation()
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

    const handleInputChange = (name, value) =>
        setLoginNames({ ...loginNames, [name]: value })

    const handleSave = () => {
        const [formsValid, formValues] = formRef.current.validate();
        if (formsValid) {
            if (formValues[1].value !== formValues[2].value){
                return message(t('login_name_re_enter_mismatch'))
            }
            else {
                setLoginNames({existingUsername: formValues[0].value, newUsername: formValues[1].value})
                message('success', true)

                // after success \/
                // console.log(loginNames)
                // setLoading(true)
                // onClose()
            }
        } else { 
            message(t('err.fill_all_fields'))
        }
        // if (!loginNames?.loginName || !loginNames?.newLoginName || !loginNames?.newLoginNameRepeat)
        //     return message(translations(locale)?.err?.fill_all_fields)
        // if (loginNames?.newLoginName !== loginNames?.newLoginNameRepeat)
        //     return message(translations(locale)?.login_name_re_enter_mismatch)
        // onSubmit({
        //     oldUsername: loginNames?.loginName,
        //     newUsername: loginNames?.newLoginName
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
                    {t('teacher.login_name')}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p style={{ color: '#848691' }} className='fs-11 pb-4 pl-4'>
                    {translations(locale)?.change_login_name_description}
                </p>
                <Row className='form-group'>
                    <Forms 
                        ref={formRef} 
                        fields={loginNameFields} 
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

export default loginNameChange