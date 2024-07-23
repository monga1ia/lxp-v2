import message from 'modules/message'
import React, { useState, useRef } from 'react'
import { Row } from 'react-bootstrap'
import { Modal } from 'react-bootstrap'
import secureLocalStorage from 'react-secure-storage'
import { useTranslation } from 'react-i18next'
import Forms from 'modules/Form/Forms'

const DownloadAttendanceModal = (
    { 
        onClose, 
        onSubmit, 
        selectedShift, 
        setSelectedShift, 
        schoolShifts, 
        setSchoolShifts,
        selectedTimeTemplate, 
        setSelectedTimeTemplate,
        selectedTeacherLog
    }) => {

    const { t } = useTranslation()
    const formRef = useRef();
    const locale = secureLocalStorage?.getItem('selectedLang') || 'mn'

    const [val, setVal] = useState('')

    const [schoolShiftsOptions, setschoolShiftsOptions] = useState(
        [{value:5, text:'1-р ээлж'}, {value:6, text:'2-р ээлж'}]
    )
    const [dashboardAttendenceHourOptions, setDashboardAttendenceHourOptions] = useState(
        [{value:8, text:'3-р пар'}, {value:9, text:'4-р пар'}]
    )

    

    const [downloadAttendanceFields, setDownloadAttendanceFields] = useState([
        {
            key: 'schoolShift',
            type: 'nDropdown',
            label: `${t('school_shift')}*`,
            labelBold: true,
            value: '',
            required: true,
            search: true,
            placeholder: `- ${t('err.select_school_shift')} -`, 
            errorMessage: `- ${t('err.select_school_shift')} -`, 
            className: "form-control",
            upperCase: true,
            formContainerClassName: 'form-group m-form__group row',
            labelClassName: "col-4 text-right label-pinnacle-bold mr-0",
            fieldContainerClassName: 'col-6',
            options:schoolShiftsOptions
        },
        {
            key: 'dashboardAttendenceHour',
            type: 'nDropdown',
            label: `${t('dashboardAttendence.hour')}*`,
            labelBold: true,
            value: '',
            required: true,
            search: true,
            placeholder: `- ${t('err.select_time')} -`, 
            errorMessage: `- ${t('err.select_time')} -`, 
            className: "form-control",
            upperCase: true,
            formContainerClassName: 'form-group m-form__group row',
            fieldContainerClassName: 'col-6',    
            labelClassName: "col-4 text-right label-pinnacle-bold mr-0",
            options: dashboardAttendenceHourOptions
        }
    ]);

    const handleSubmit = () => {
        const [formsValid, formValues] = formRef.current.validate();

        if (formsValid) {
        } 
        else{
            message(t('err.fill_all_fields'))
        } 
    }

    return (
        <Modal
            dimmer='blurring'
            show={true}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            onHide={onClose}
            centered
        >
            <Modal.Header closeButton style={{padding: '1rem'}}>
                <Modal.Title className="modal-title d-flex flex-row justify-content-between w-100">
                    {t('attendance.download_attendance')}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Row className='form-group'>
                    <Forms
                        ref={formRef}
                        fields={downloadAttendanceFields}
                    />
                </Row>
            </Modal.Body>
            <Modal.Footer className="text-center">
                <div className="col-12 text-center">
                    <button
                        className="btn m-btn--pill btn-link m-btn m-btn--custom"
                        onClick={onClose}
                    >
                        {t('back')}
                    </button>
                    <button
                        className="btn m-btn--pill btn-success text-uppercase"
                        disabled={!selectedTeacherLog}
                        onClick={handleSubmit}
                    >
                        {t('attendance.download')}
                    </button>
                </div>
            </Modal.Footer>
        </Modal>
    )
}

export default DownloadAttendanceModal;