import message from 'modules/message'
import React, { useState, useRef } from 'react'
import { Col, Row, Modal} from 'react-bootstrap'
import secureLocalStorage from 'react-secure-storage'
import { useTranslation } from 'react-i18next'
import Forms from 'modules/Form/Forms'

const edit = ({ onClose, onSubmit, eventData }) => {

    const { t } = useTranslation()
    const formRef = useRef();
    const locale = secureLocalStorage?.getItem('selectedLang') || 'mn'

    const start = new Date(eventData?.start)
    const end = new Date(eventData?.end)
    if (eventData?.allDay) end.setDate(end.getDate() - 1)

    const [event, setEvent] = useState({ ...eventData, start: start?.toLocaleDateString('en-CA'), end: end?.toLocaleDateString('en-CA') })
    const [endTime, setEndTime] = useState(end?.getHours()?.toString()?.padStart(2, 0) + ':' + end?.getMinutes()?.toString()?.padStart(2, 0) || null)
    const [startTime, setStartTime] = useState(start?.getHours()?.toString()?.padStart(2, 0) + ':' + start?.getMinutes()?.toString()?.padStart(2, 0) || null)
    const [fullDay, setFullDay] = useState(false)
    
    const isFullDay = (value, id) => {
        setFullDay(value)
        editCalendarFields[4].hidden = value
    }

    const setTime = (value) => {
        setStartTime(value[0].startTime)
        setEndTime(value[0].endTime)
    }

    const handleSave = () => {
                
        const [formsValid, formValues] = formRef.current.validate();

        if (formsValid) {
            if (fullDay && startTime == endTime) {
                message(t('calendar.time_duplicate'))
            } else {
                const dataCollectorArray = []
                for (let x=0;x<formValues.length;x++) {
                    dataCollectorArray.push({key: formValues[x].key, value: formValues[x].value})
                }
                message('success', true)

                // after success \/
                // onClose()
                // setLoading(true)
                console.log(dataCollectorArray)
            }
        } 
        else{
            message(t('err.fill_all_fields'))
        } 
        // if (!event?.title || !event?.start || !event?.end) return message(translations(locale)?.err?.fill_all_fields)
        // if (!event?.allDay && (!startTime || !endTime)) return message(translations(locale)?.err?.fill_all_fields)
        // if (!event?.allDay && (startTime == endTime)) return message(translations(locale)?.calendar?.time_duplicate)
        // onSubmit({ ...event, startTime, endTime, allDay: event?.allDay ? 1 : 0 })
    }

    const handleChange = (name, value) => {
        setEvent({ ...event, [name]: value })
        if (name == 'allDay' && value == true) {
            setStartTime(null)
            setEndTime(null)
        }
    }

    const [editCalendarFields, setEditCalendarFields] = useState([
        {
            key: 'calendarEventName',
            label: `${t('calendar.activity_name')}*`,
            labelBold: true,
            value: event.title,
            type: 'text',
            required: true,
            errorMessage: t('error.enterEventName'),
            placeholder: t('calendar.activity_name'),
            className: "form-control",
            upperCase: true,
            formContainerClassName: 'form-group m-form__group row',
            fieldContainerClassName: 'col-5',
            labelClassName: "col-5 text-right label-pinnacle-bold mr-0",
        },
        {
            key: 'calendarEventColor',
            label: `${t('calendar.color')}*`,
            labelBold: true,
            value: event.color,
            type: 'color',
            className: "form-control",
            upperCase: true,
            formContainerClassName: 'form-group m-form__group row',
            fieldContainerClassName: 'col-5',
            labelClassName: "col-5 text-right label-pinnacle-bold mr-0",
        },
        {
            key: 'calendarEventDate',
            label: `${t('date')}*`,
            labelBold: true,
            value: '',
            type: 'daterange',
            firstPlaceHolder: t('datePickerPlaceholder'),
            lastPlaceHolder: t('datePickerPlaceholder'),
            selectedStartDate: event.start,
            selectedEndDate: event.end,
            className: "form-control",
            upperCase: true,
            formContainerClassName: 'form-group m-form__group row',
            fieldContainerClassName: 'col-5',
            labelClassName: "col-5 text-right label-pinnacle-bold mr-0",
        },
        {
            key: 'calendarFullDay',
            label: `${t('calendar.is_full_day')}*`,
            labelBold: true,
            value: fullDay,
            type: 'checkbox',
            onChange: isFullDay,
            // className: "form-control",
            upperCase: true,
            formContainerClassName: 'form-group m-form__group row',
            fieldContainerClassName: 'col-5',
            labelClassName: "col-5 text-right label-pinnacle-bold mr-0",
        },
        {
            key: 'calendarEventTime',
            label: `${t('calendar.length')}*`,
            labelBold: true,
            value: '',
            type: 'timerange',
            selectedStartTime: startTime,
            selectedEndTime: endTime,
            onChange: setTime,
            className: "form-control",
            upperCase: true,
            formContainerClassName: 'form-group m-form__group row',
            fieldContainerClassName: fullDay ? "w-0" : 'col-5',
            labelClassName: "col-5 text-right label-pinnacle-bold mr-0",
            hidden: fullDay,
        },
        {
            key: 'calendarEventDescription',
            label: `${t('description')}`,
            labelBold: true,
            value: event.description,
            type: 'textArea',
            className: "form-control",
            placeholder: t('description'),
            upperCase: true,
            formContainerClassName: 'form-group m-form__group row',
            fieldContainerClassName: 'col-5',
            labelClassName: "col-5 text-right label-pinnacle-bold mr-0 align-items-start",
        },
    ])

    return (
        <Modal
            dimmer='blurring'
            show={true}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            onHide={onClose}
            // className='react-modal overflow-modal'
            centered
        >
            <Modal.Header closeButton style={{padding: '1rem'}}>
                <Modal.Title className="modal-title d-flex flex-row justify-content-between w-100">
                    {t('calendar.activity')}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Row className='form-group'>
                    <Forms
                        ref={formRef}
                        fields={editCalendarFields}
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

export default edit