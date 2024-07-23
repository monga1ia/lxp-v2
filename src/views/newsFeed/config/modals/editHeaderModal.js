import React, { useState, useEffect, useRef } from 'react'
import { Modal } from 'react-bootstrap'
import { useTranslation } from "react-i18next";
import { translations } from 'utils/translations';
import message from 'modules/message';
import { NDropdown as Dropdown } from 'widgets/Dropdown';
import Forms from 'modules/Form/Forms';
import { Row, Col} from 'react-bootstrap';

const locale = 'mn'

const EditHeader = ({ onClose, createParams, clickedNode, isAdminOrSuper, dropdownOptions, selectedEditHdr }) => {

    const { t } = useTranslation();
    const formRef = useRef();

//test environment variables
    selectedEditHdr= [{1: '232', 2: '123414', 3: '81273'}]
    isAdminOrSuper = true

    const createHeaderFields = [
        {
            key: 'newHeaderName',
            label: `${t('newsfeedConfig.hdrName')}*`,
            labelBold: true,
            value: '',
            type: 'text',
            required: true,
            errorMessage: translations(locale).newsfeedConfig.insertNameError,
            placeholder: t('newsfeedConfig.hdrName'),
            className: "form-control",
            upperCase: true,
            formContainerClassName: 'form-group m-form__group row',
            labelClassName: "col-4 text-right label-pinnacle-bold mr-0",
            fieldContainerClassName: 'col-6',
        },
        {
            key: 'newHeadersParent',
            label: `${t('newsfeedConfig.parent_hdr')}*`,
            className: "form-control",
            labelBold: true,
            value: '',
            options: dropdownOptions?.allHeaders,
            type: 'nDropdown',
            required: true,
            search: true,
            errorMessage: translations(locale).newsfeedConfig.insertParentHdrError,
            placeholder: '-' + t('newsfeedConfig.parent_hdr') + ' - ',
            formContainerClassName: 'form-group m-form__group row',
            labelClassName: "col-4 text-right label-pinnacle-bold mr-0",
            fieldContainerClassName: 'col-6',
        },
        {
            key: 'newHeaderSchooldRole',
            label: `${t('newsfeedConfig.parent_hdr_type')}*`,
            className: "form-control",
            labelBold: true,
            value: '',
            options: dropdownOptions?.headerTypes,
            type: 'nDropdown',
            required: true,
            search: true,
            errorMessage: translations(locale).newsfeedConfig.insertHdrTypeError,
            placeholder: '-' + t('newsfeedConfig.parent_hdr_type') + ' - ',
            formContainerClassName: 'form-group m-form__group row',
            labelClassName: "col-4 text-right label-pinnacle-bold mr-0",
            fieldContainerClassName: 'col-6',
        },
        {
            key: 'newHeaderSchooldRole',
            label: `${t('newsfeedConfig.hdr_roles')}*`,
            className: "form-control",
            labelBold: true,
            value: [],
            options: dropdownOptions?.schoolRoles,
            type: 'nDropdown',
            required: true,
            multiple: true,
            search: true,
            errorMessage: translations(locale).newsfeedConfig.insertRolesError,
            placeholder: '-' + t('newsfeedConfig.hdr_roles') + ' - ',
            formContainerClassName: 'form-group m-form__group row',
            labelClassName: "col-4 text-right label-pinnacle-bold mr-0",
            fieldContainerClassName: 'col-6',
        },
    ]

    let secondCreateFields = []
    if ((!selectedEditHdr || selectedEditHdr.length===0) && !isAdminOrSuper) {
        secondCreateFields = [
            ...createHeaderFields.slice(0,1),
            ...createHeaderFields.slice(2,3)
        ]
    }

    else if ((selectedEditHdr || selectedEditHdr.length>0) && !isAdminOrSuper) {

        secondCreateFields = [
            ...createHeaderFields.slice(0,2),
            ...createHeaderFields.slice(3,4)
        ]
    }

    else if ((!selectedEditHdr || selectedEditHdr.length===0) && isAdminOrSuper) {
        secondCreateFields = [
            ...createHeaderFields.slice(0,1),
            ...createHeaderFields.slice(2,4),
            // ...createHeaderFields.slice(1, createHeaderFields.length)
        ]
    } 
    
    else {
        secondCreateFields = createHeaderFields
    }

    const submitHandler = () => {

        const [formsValid, formValues] = formRef.current.validate();

        if (formsValid){
            message('success', true)
            // after success \/
            // setLoading(true)
            // onClose()
            // console.log(formValues[0].value, formValues[1].value)
            // onSubmit(formValues[0].value, formValues[1].value)
        } else {
            message(t('err.fill_all_fields'))
            return
        }

        let bodyParams = {
            hdr: selectedEditHdr?.id || null ,
            name: formValues[0].value ? formValues[0].value : selectedEditHdr?.name || null,
            type: isAdminOrSuper ? formValues[1].value ? formValues[1].value : selectedEditHdr?.typeId || null : null,
            parentHdr: 
                isAdminOrSuper && selectedEditHdr ? 
                    formValues[2].value ?
                        formValues[2].value : 
                        selectedEditHdr?.parentHdrId || null 
                        
                : selectedEditHdr ?
                    formValues[1].value ? 
                        formValues[1].value : 
                        selectedEditHdr?.parentHdrId || null
                    : selectedEditHdr?.parentHdrId || null,

            roles: formValues[formValues.length-1].value ? JSON.stringify(formValues[formValues.length-1].value) : JSON.stringify(selectedEditHdr.roles) || null,
            submit: 1
        }

        createParams(bodyParams)
    }

    return (
        <Modal
            size='lg'
            dimmer='blurring'
            show={true}
            onHide={onClose}
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton style={{padding: '1rem'}}>
                <Modal.Title className="modal-title d-flex flex-row justify-content-between w-100">
                    {t('newsfeed.title')}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body style={{color: '#212529'}}>
                <div className="row mt-4">
                    <Row className='form-group'>
                        <Forms 
                            ref={formRef}
                            fields={secondCreateFields}
                        />
                    </Row>
                </div>
            </Modal.Body>
            <Modal.Footer className='text-center'>
                <button
                    className="btn m-btn--pill m-btn--air btn-outline-metal m-btn m-btn--custom"
                    onClick={onClose}
                >
                    {translations(locale).close.toUpperCase()}
                </button>
                <button
                    className="btn m-btn--pill m-btn--air btn-warning m-btn m-btn--custom"
                    style={{ marginLeft: 10 }}
                    onClick={submitHandler}
                >
                    {translations(locale).save.toUpperCase()}
                </button>
            </Modal.Footer>
        </Modal >
    )
}

export default EditHeader