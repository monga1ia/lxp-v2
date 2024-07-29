import message from 'modules/message'
import React, { useState, useRef } from 'react'
import { Row, Col, Modal } from 'react-bootstrap'
import secureLocalStorage from 'react-secure-storage'
import { Checkbox } from 'semantic-ui-react'
import { useTranslation } from 'react-i18next'
import { translations } from 'utils/translations'
import CustomTimePicker from 'modules/CustomTimePicker'
import DayPickerInput from 'react-day-picker/DayPickerInput'

const add = ({ onClose, onSubmit }) => {

    const { t } = useTranslation()
    const formRef = useRef();
    const locale = secureLocalStorage?.getItem('selectedLang') || 'mn'

    const [event, setEvent] = useState({ color: '#ff5b1d' })
    const [startTime, setStartTime] = useState(null)
    const [endTime, setEndTime] = useState(null)

    const [first, setFirst] = useState(true)

    const handleSave = () => {
        if (!event?.title || !event?.start || !event?.end) return message(translations(locale)?.err?.fill_all_fields)
        if (!event?.allDay && (!startTime || !endTime)) return message(translations(locale)?.err?.fill_all_fields)
        if (!event?.allDay && (startTime == endTime)) return message(translations(locale)?.calendar?.time_duplicate)
        onSubmit({ ...event, startTime, endTime, allDay: event?.allDay ? 1 : 0 })
    }

    const handleChange = (name, value) => {
        const values = { [name]: value }
        if (name == 'allDay' && value == true) {
            setStartTime(null)
            setEndTime(null)
        }
        if (name == 'start' && first) {
            setFirst(false)
            values.end = value
        }
        setEvent({ ...event, ...values })
    }

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
                    <Col className='text-right'>
                        <label className="text-right label-pinnacle-bold col-form-label">
                            {translations(locale)?.calendar?.activity_name}*
                        </label>
                    </Col>
                    <Col>
                        <input
                            type="text"
                            className="form-control"
                            value={event?.title || ''}
                            placeholder={translations(locale)?.calendar?.activity_name}
                            onChange={(e) => handleChange('title', e.target.value)}
                        />
                    </Col>
                    <Col md={2} />
                </Row>
                <Row className='form-group'>
                    <Col className='text-right'>
                        <label className="text-right label-pinnacle-bold col-form-label">
                            {translations(locale)?.calendar?.color}
                        </label>
                    </Col>
                    <Col>
                        <input
                            type="color"
                            value={event?.color}
                            onChange={(e) => handleChange('color', e.target.value)}
                        />
                    </Col>
                    <Col md={2} />
                </Row>
                <Row className='form-group'>
                    <Col className='text-right'>
                        <label className="text-right label-pinnacle-bold col-form-label">
                            {translations(locale)?.date}*
                        </label>
                    </Col>
                    <Col>
                        <Row>
                            <Col className='pr-0'>
                                <DayPickerInput
                                    value={event?.start}
                                    inputProps={{ className: 'form-control' }}
                                    placeholder={translations(locale)?.datePickerPlaceholder}
                                    dayPickerProps={{ disabledDays: { after: new Date(event?.end) } }}
                                    onDayChange={(day) => handleChange('start', day?.toISOString()?.split('T')?.[0])}
                                    classNames={{ overlay: 'DayPickerInputOverlay', container: 'position-relative' }}
                                />
                            </Col>
                            <div className="pickerSeparator">
                                <i className="la la-ellipsis-h" />
                            </div>
                            <Col className='pl-0'>
                                <DayPickerInput
                                    value={event?.end}
                                    inputProps={{ className: 'form-control' }}
                                    placeholder={translations(locale)?.datePickerPlaceholder}
                                    dayPickerProps={{ disabledDays: { before: new Date(event?.start) } }}
                                    onDayChange={(day) => handleChange('end', day?.toISOString()?.split('T')?.[0])}
                                    classNames={{ overlay: 'DayPickerInputOverlay', container: 'position-relative' }}
                                />
                            </Col>
                        </Row>
                    </Col>
                    <Col md={2} />
                </Row>
                <Row className='form-group'>
                    <Col />
                        <Col style={{color: '#575962'}}>
                            <Checkbox
                                checked={event?.allDay}
                                onChange={(e, data) => handleChange('allDay', data?.checked)}
                                label={translations(locale)?.calendar?.is_full_day}
                            />
                        </Col>
                    <Col md={2} />
                </Row>
                {
                    !event?.allDay &&
                    <Row className='form-group'>
                        <Col className='text-right'>
                            <label className="text-right label-pinnacle-bold col-form-label">
                                {translations(locale)?.calendar?.length}*
                            </label>
                        </Col>
                        <Col>
                            <Row>
                                <Col className='pr-0'>
                                    <CustomTimePicker
                                        onChange={setStartTime}
                                    />
                                </Col>
                                <div className="pickerSeparator">
                                    <i className="la la-ellipsis-h" />
                                </div>
                                <Col className='pl-0'>
                                    <CustomTimePicker
                                        onChange={setEndTime}
                                    />
                                </Col>
                            </Row>
                        </Col>
                        <Col md={2} />
                    </Row>
                }
                <Row className='form-group'>
                    <Col className='text-right'>
                        <label className="text-right label-pinnacle-bold col-form-label">
                            {translations(locale)?.description}
                        </label>
                    </Col>
                    <Col>
                        <textarea
                            rows={5}
                            className="form-control"
                            value={event?.description}
                            placeholder={translations(locale)?.description}
                            onChange={(e) => handleChange('description', e.target.value)}
                        />
                    </Col>
                    <Col md={2} />
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
                        className="btn m-btn--pill btn-success m-btn--wide"
                        onClick={handleSave}
                    >
                        {t('save')}
                    </button>
                </div>
            </Modal.Footer>
        </Modal>
    )
}

export default add