import { Modal } from 'react-bootstrap'
import message from 'modules/message'
import HtmlHead from 'components/html-head/HtmlHead';
import { Col, Row } from 'react-bootstrap'
import { priceFormat } from 'utils/Util'
import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import secureLocalStorage from 'react-secure-storage'
import { fetchRequest } from 'utils/fetchRequest'
import { Checkbox, Dropdown } from 'semantic-ui-react'
import { getStudentsByClass, movementOutSubmit } from 'utils/fetchRequest/Urls'

import { useTranslation } from 'react-i18next'
import DayPickerInput from 'react-day-picker/DayPickerInput'
import { useNavigate } from 'react-router'

const AddStudentMovementOut = ({onClose}) => {
    // const navigate = useNavigate()

    const { t } = useTranslation()
    const [loading, setLoading] = useState(false)

    const isGenerateCode = location?.state?.isGenerateCode || false

    const [movementData, setMovementData] = useState({})
    const [classOptions, setClassOptions] = useState([])
    const [studentOptions, setStudentOptions] = useState([])

    const [sales, setSales] = useState([])
    const [invoices, setInvoices] = useState([])
    const [forceSave, setForceSave] = useState(false)
    const [createAgain, setCreateAgain] = useState(false)

    const [students, setStudents] = useState([{
        class: '',
        personalInformation: '',
        description: ''
    }])

    useEffect(() => {
        // setLoading(true)
        // fetchRequest(movementOutSubmit, 'POST')
        //     .then(res => {
        //         if (res.success) {
        //             const { classes } = res.data
        //             setClassOptions(classes || [])
        //         } else {
        //             message(res.data.message)
        //         }
        //         setLoading(false)
        //     })
        //     .catch(() => {
        //         message(t('err.error_occurred'))
        //         setLoading(false)
        //     })
    }, [])

    const handleSubmit = () => {
        if (validateFields()) {
            setLoading(true)
            // fetchRequest(movementOutSubmit, 'POST', { ...movementData, student: movementData?.student?.value, submit: 1, force: forceSave ? 1 : 0 })
            //     .then(res => {
            //         if (res.success) {
            //             message(res.data.message, res.success)
            //             if (createAgain) {
            //                 const movementObj = {
            //                     class: movementData?.class,
            //                     student: null
            //                 };
            //                 setStudentOptions([])
            //                 setMovementData(movementObj)
            //                 handleClassChange(movementObj, movementData?.class)
            //                 setInvoices([])
            //                 setSales([])
            //             } else {
            //                 navigate('/movement/out')
            //             }
            //         } else {
            //             message(res.data.message)
            //             const { invoices, sales } = res?.data
            //             setInvoices(invoices || [])
            //             setSales(sales || [])
            //         }
            //         setLoading(false)
            //     })
            //     .catch(() => {
            //         message(t('err.error_occurred'))
            //         setLoading(false)
            //     })
        }
    }

    const handleClassChange = (movementObj, value) => {
        setLoading(true)
        setMovementData({ ...movementObj, class: value, student: null })
        // fetchRequest(getStudentsByClass, 'POST', { class: value })
        //     .then(res => {
        //         if (res.success) {
        //             const { students } = res.data
        //             setStudentOptions(students || [])
        //         } else {
        //             message(res.data.message)
        //         }
        //         setLoading(false)
        //     })
        //     .catch(() => {
        //         message(t('err.error_occurred'))
        //         setLoading(false)
        //     })
    }

    const handleStudentChange = (movementObj, data) => {
        const { value, options } = data
        setMovementData({ ...movementObj, student: options?.find(option => option?.value == value) })
    }

    const handleDescriptionChange = (movementObj, value) => {
        setMovementData({ ...movementObj, description: value })
    }

    const validateFields = () => {
        if (!movementData?.class || !movementData?.student?.value) return message(t('err.fill_all_fields'))
        return true
    }

    const addStudents = () => {
        setStudents([...students, {
            class: '',
            personalInformation: '',
            description: ''
        }])
    }

    const removeStudent = (index) => {
        const clone = [...students]
        clone?.splice(index, 1)
        setStudents(clone)
    }

    const handleCheckboxChange = (checked) => {
        setCreateAgain(checked)
    }

    return (
        <Modal
            centered
            show={true}
            onHide={onClose}
            size='lg'
            dimmer='blurring'
            aria-labelledby="contained-modal-title-vcenter"
        >
            <Modal.Header closeButton style={{padding: '1rem'}}>
                <Modal.Title className="modal-title d-flex flex-row justify-content-between w-100">
                    {t('movement.out_title')}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                            <div className='form-group m-form__group row mt-3'>
                                <label className="col-form-label col-sm-4 text-right label-pinnacle-bold">
                                    {t('className')}*
                                </label>
                                <div className="col-md-4 col-sm-12">
                                    <Dropdown
                                        fluid
                                        search
                                        selection
                                        closeOnChange
                                        options={classOptions}
                                        className='form-control'
                                        value={movementData?.class}
                                        onChange={(e, data) => handleClassChange(movementData, data?.value)}
                                        placeholder={'-' + t('err.select_class') + '-'}
                                    />
                                </div>
                                <div className='col-3' />
                            </div>
                            <div className={'form-group m-form__group row'}>
                                <label className="col-form-label col-md-4 col-sm-12 text-right label-pinnacle-bold">
                                    {t('student.title')}*
                                </label>
                                <div className="col-md-4 col-sm-12">
                                    <Dropdown
                                        fluid
                                        search
                                        selection
                                        closeOnChange
                                        options={studentOptions}
                                        className='form-control'
                                        value={movementData?.student?.value || null}
                                        onChange={(e, data) => handleStudentChange(movementData, data)}
                                        placeholder={'-' + t('err.select_student') + '-'}
                                    />
                                </div>
                                <div className='col-3' />
                            </div>
                            {
                                movementData?.student?.value &&
                                <div className='form-group m-form__group row'>
                                    <div className='col-form-label col-md-4 col-sm-12' />
                                    <div className="col-md-4 col-sm-12">
                                        <div className='row'>
                                            <div className='col px-2 text-right'>
                                                {t('studentCode')}:
                                            </div>
                                            <div className='col px-2 bolder'>
                                                {movementData?.student?.code}
                                            </div>
                                        </div>
                                        <div className='row'>
                                            <div className='col px-2 text-right'>
                                                {t('studentLastName')}:
                                            </div>
                                            <div className='col px-2 bolder'>
                                                {movementData?.student?.lastName}
                                            </div>
                                        </div>
                                        <div className='row'>
                                            <div className='col px-2 text-right'>
                                                {t('studentFirstName')}:
                                            </div>
                                            <div className='col px-2 bolder'>
                                                {movementData?.student?.firstName}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            }
                            <div className={'form-group m-form__group row'}>
                                <label className="col-form-label col-md-4 col-sm-12 text-right label-pinnacle-bold">
                                    {t('description')}
                                </label>
                                <div className="col-md-4 col-sm-12">
                                    {
                                        console.log('>>>', movementData)
                                    }
                                    <textarea
                                        rows={5}
                                        className='form-control'
                                        value={movementData?.description || ''}
                                        placeholder={t('insert_description')}
                                        onChange={(e) => handleDescriptionChange(movementData, e.target.value)}
                                    />
                                </div>
                            </div>
                            {
                                invoices?.length > 0 &&
                                <div className='form-group m-form__group row'>
                                    <label className='col-form-label col-md-4 col-sm-12 text-right label-pinnacle-bold'>
                                        {t('finance.invoice')}
                                    </label>
                                    <div className="col-md-4 col-sm-12">
                                        {
                                            invoices?.map((el, key) => (
                                                <div key={key} className='m-portlet'>
                                                    <div className='m-portlet__body d-flex flex-column'>
                                                        <b>{el?.name} ({el?.season})</b>
                                                        <span>{t('finance.pay_amount')}: {priceFormat(el?.unpaidAmount)}₮</span>
                                                    </div>
                                                </div>
                                            ))
                                        }
                                    </div>
                                </div>
                            }
                            {
                                sales?.length > 0 &&
                                <div className='form-group m-form__group row'>
                                    <label className='col-form-label col-md-4 col-sm-12 text-right label-pinnacle-bold'>
                                        {t('sale.title')}
                                    </label>
                                    <div className="col-md-4 col-sm-12">
                                        {
                                            sales?.map((el, key) => (
                                                <div key={key} className='m-portlet'>
                                                    <div className='m-portlet__body d-flex flex-column'>
                                                        <b>{el?.name} ({el?.itemType}) ({el?.season})</b>
                                                        <span>{el?.status}: {priceFormat(el?.balance)}₮</span>
                                                    </div>
                                                </div>
                                            ))
                                        }
                                    </div>
                                </div>
                            }
                            {
                                sales?.length > 0 || invoices?.length > 0 &&
                                <div className='form-group m-form__group row'>
                                    <label className='col-form-label col-md-4 col-sm-12 text-right label-pinnacle-bold'></label>
                                    <div className="col-md-4 col-sm-12">
                                        <Checkbox
                                            checked={forceSave}
                                            onChange={(e, data) => setForceSave(data?.checked)}
                                            label={t('movement.force_movement')}
                                        />
                                    </div>
                                </div>
                            }
            </Modal.Body>
            <Modal.Footer className="text-center">
                <button 
                        onClick={onClose}
                        className="btn m-btn--pill btn-link m-btn m-btn--custom"
                    >
                        {t('back')}        
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="btn m-btn--pill btn-success text-uppercase"
                    >
                        {t('save')}
                </button>               
            </Modal.Footer>
            {
                loading &&
                <>
                    <div className="blockUI blockOverlay" />
                    <div className="blockUI blockMsg blockPage">
                        <div className="m-loader m-loader--brand m-loader--lg" />
                    </div>
                </>
            }
            </Modal>
    )
}

export default AddStudentMovementOut