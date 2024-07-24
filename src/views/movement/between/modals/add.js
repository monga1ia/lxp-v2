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
import { getStudentsByClass, movementOutSubmit, movementBetweenSubmit } from 'utils/fetchRequest/Urls'
import { useTranslation } from "react-i18next"

const add = ({onClose}) => {
    const { t } = useTranslation()
    const locale = 'mn'
    const [loading, setLoading] = useState(false)

    const [movementData, setMovementData] = useState({})
    const [fromClassOptions, setFromClassOptions] = useState([])
    const [studentOptions, setStudentOptions] = useState([])
    const [toClassOptions, setToClassOptions] = useState([])

    useEffect(() => {
        // setLoading(true)
        // fetchRequest(movementBetweenSubmit, 'POST')
        //     .then(res => {
        //         if (res.success) {
        //             const { classes } = res.data
        //             setFromClassOptions(classes || [])
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
            // setLoading(true)
            // fetchRequest(movementBetweenSubmit, 'POST', { ...movementData, students: JSON.stringify(movementData?.students), submit: 1 })
            //     .then(res => {
            //         if (res.success) {
            //             message(res.data.message, res.success)
            //             navigate('/movement/between')
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
    }

    const handleFromClassChange = data => {
        setLoading(true)
        // taking of filter for now
        // const { value, options } = data
        // options?.forEach(el => delete el?.disabled)
        // const currentClass = options?.find(option => option?.value == value)
        // currentClass.disabled = true
        // const classes = options?.filter(option => option?.gradeId == currentClass?.gradeId)
        // setMovementData({ ...movementData, fromClass: value, students: [], toClass: null })
        // setToClassOptions(classes)

        // applying no filter for now
        const { value, options } = data
        options?.forEach(el => delete el?.disabled)
        const currentClass = options?.find(option => option?.value == value)
        currentClass.disabled = true
        // const classes = options?.filter(option => option?.gradeId == currentClass?.gradeId)
        setMovementData({ ...movementData, fromClass: value, students: [], toClass: null })
        setToClassOptions(options)

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

    const handleChange = (name, value) => {
        setMovementData({ ...movementData, [name]: value })
    }

    const validateFields = () => {
        if (!movementData?.fromClass || !movementData?.toClass || !movementData?.students.length)
            return message(t('err.fill_all_fields'))
        return true
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
                    {t('movement.between')}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {/* <div className="m-content">
                    <div className="m-portlet">
                        <div className="m-portlet__body"> */}
                            <div className='form-group m-form__group row mt-3'>
                                <label className="col-form-label col-sm-4 text-right label-pinnacle-bold">
                                    {t('className')}*
                                </label>
                                <div className="col-md-4 col-sm-12">
                                    <Dropdown
                                        className={'form-control m-input'}
                                        placeholder={'-' + t('err.select_class') + '-'}
                                        fluid
                                        selection
                                        search
                                        additionPosition='bottom'
                                        upward={false}
                                        closeOnChange
                                        selectOnBlur={false}
                                        value={movementData?.fromClass}
                                        options={fromClassOptions}
                                        onChange={(e, data) => handleFromClassChange(data)}
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
                                        className={'form-control m-input'}
                                        placeholder={'-' + t('err.select_student') + '-'}
                                        fluid
                                        selection
                                        search
                                        additionPosition='bottom'
                                        upward={false}
                                        multiple={true}
                                        selectOnBlur={false}
                                        value={movementData?.students || []}
                                        options={studentOptions}
                                        onChange={(e, data) => handleChange('students', data?.value)}
                                    />
                                </div>
                                <div className='col-3' />
                            </div>
                            <div className={'form-group m-form__group row'}>
                                <label className="col-form-label col-md-4 col-sm-12 text-right label-pinnacle-bold">
                                    {t('movement.to_class_title')}*
                                </label>
                                <div className="col-md-4 col-sm-12">
                                    <Dropdown
                                        className={'form-control m-input'}
                                        placeholder={'-' + t('err.select_class') + '-'}
                                        fluid
                                        selection
                                        search
                                        additionPosition='bottom'
                                        upward={false}
                                        closeOnChange
                                        selectOnBlur={false}
                                        value={movementData?.toClass}
                                        options={toClassOptions}
                                        onChange={(e, data) => handleChange('toClass', data?.value)}
                                    />
                                </div>
                            </div>
                            <div className={'form-group m-form__group row'}>
                                <label className="col-form-label col-md-4 col-sm-12 text-right label-pinnacle-bold">
                                    {t('description')}
                                </label>
                                <div className="col-md-4 col-sm-12">
                                    <textarea
                                        className="form-control m-input"
                                        placeholder={t('insert_description')}
                                        value={movementData?.description}
                                        onChange={(e) => handleChange('description', e.target.value)}
                                    />
                                </div>
                            </div>
                        {/* </div>
                    </div>
                </div> */}
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

export default add