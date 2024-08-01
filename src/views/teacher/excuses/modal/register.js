import message from 'modules/message'
import { Col, Row } from 'react-bootstrap'
import { Tab } from 'semantic-ui-react'
import { Modal } from 'react-bootstrap'
import React, { useState, useEffect } from 'react'
import CloseIcon from '@mui/icons-material/Close'
import secureLocalStorage from 'react-secure-storage'
import { fetchRequest } from 'utils/fetchRequest'
import { translations } from 'utils/translations'
import { NDropdown as Dropdown } from 'widgets/Dropdown'
// import { teacherExcuseReasonSubmit } from 'Utilities/url'
import DayPickerInput from 'react-day-picker/DayPickerInput'

const register = ({ onClose, onSubmit }) => {
    const locale = secureLocalStorage?.getItem('selectedLang') || 'mn'
    const [loading, setLoading] = useState(false)

    const [excuse, setExcuse] = useState({ type: 'day' })
    const [season, setSeason] = useState({})

    const [reasons, setReasons] = useState([])
    const [subjects, setSubjects] = useState([])

    const [classOptions, setClassOptions] = useState([])
    const [studentOptions, setStudentOptions] = useState([])
    const [subjectOptions, setSubjectOptions] = useState([])

    // useEffect(() => {
    //     setLoading(true)
    //     fetchRequest(teacherExcuseReasonSubmit, 'POST', { menu: 'teacher' })
    //         .then((res) => {
    //             if (res.success) {
    //                 const { classes, types } = res?.data
    //                 setClassOptions(classes || [])
    //                 setReasons(types || [])
    //             } else {
    //                 message(res.data.message)
    //             }
    //             setLoading(false)
    //         })
    //         .catch(() => {
    //             message(translations(locale)?.err?.error_occurred)
    //             setLoading(false)
    //         })
    // }, [])

    const handleClassChange = value => {
        console.log('handleclassChange')
        // setLoading(true)
        // setExcuse({ ...excuse, class: value, student: null, day: null, subjects: [] })
        // fetchRequest(teacherExcuseReasonSubmit, 'POST', { class: value, menu: 'teacher' })
        //     .then((res) => {
        //         if (res.success) {
        //             const { students } = res?.data
        //             setStudentOptions(students || [])
        //         } else {
        //             message(res.data.message)
        //         }
        //         setLoading(false)
        //     })
        //     .catch(() => {
        //         message(translations(locale)?.err?.error_occurred)
        //         setLoading(false)
        //     })
    }

    const handleStudentChange = value => {
        console.log('handleStudentChange')
        // setLoading(true)
        // setExcuse({ ...excuse, student: value, day: null, startDate: null, endDate: null, subjects: [] })
        // fetchRequest(teacherExcuseReasonSubmit, 'POST', { student: value, menu: 'teacher' })
        //     .then((res) => {
        //         if (res.success) {
        //             const { currentSeason, timetables } = res?.data
        //             setSeason({ start: currentSeason?.startDate?.date, end: currentSeason?.endDate?.date })
        //             setSubjects(timetables || [])
        //         } else {
        //             message(res.data.message)
        //         }
        //         setLoading(false)
        //     })
        //     .catch(() => {
        //         message(translations(locale)?.err?.error_occurred)
        //         setLoading(false)
        //     })
    }

    const handleDayChange = value => {
        setSubjectOptions(subjects?.filter(el => el?.day == new Date(value)?.getDay()) || [])
        setExcuse({ ...excuse, day: value, subjects: [] })
    }

    const validateFields = () => {
        if (!excuse?.class || !excuse?.student) return message(translations(locale)?.err?.fill_all_fields)
        if (!excuse?.reason) return message(translations(locale)?.absent?.select_type)
        if (excuse?.type == 'hour') {
            if (!excuse?.day || !excuse?.subjects?.length) return message(translations(locale)?.err?.fill_all_fields)
        }
        else {
            if (!excuse?.startDate || !excuse?.endDate) return message(translations(locale)?.err?.fill_all_fields)
            if (new Date(excuse?.startDate) > new Date(excuse?.endDate)) return message(translations(locale)?.absent?.dateError)
        }
        return true
    }

    const handleTabChange = code => {
        if (code == 'hour') { setExcuse({ ...excuse, startDate: null, endDate: null, type: 'hour' }) }
        else { setExcuse({ ...excuse, day: null, subjects: [], type: 'day' }) }
    }

    const handleSave = () => {
        if (validateFields()) {
            onSubmit({ ...excuse, subjects: JSON.stringify(excuse?.subjects) })
        }
    }

    const handleChange = (name, value) => {
        setExcuse({ ...excuse, [name]: value })
    }

    return (
        <Modal
            dimmer='blurring'
            show={true}
            size="xl"
            aria-labelledby="contained-modal-title-vcenter"
            onHide={onClose}
            centered
        >
            <Modal.Header closeButton style={{ padding: '1rem' }}>
                <Modal.Title className="modal-title d-flex flex-row justify-content-between w-100">
                    {translations(locale)?.absent?.register}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Row className='form-group'>
                    <Col md={4} className='col-form-label text-md-right label-pinnacle-bold'>
                        {translations(locale)?.className}*
                    </Col>
                    <Col md={5}>
                        <Dropdown
                            fluid
                            search
                            selection
                            closeOnChange
                            options={classOptions}
                            value={excuse?.class}
                            placeholder={'-' + translations(locale)?.select + '-'}
                            onChange={(e, data) => handleClassChange(data?.value)}
                        />
                    </Col>
                </Row>
                <Row className='form-group'>
                    <Col md={4} className='col-form-label text-md-right label-pinnacle-bold'>
                        {translations(locale)?.student?.title}*
                    </Col>
                    <Col md={5}>
                        <Dropdown
                            fluid
                            search
                            selection
                            closeOnChange
                            options={studentOptions}
                            value={excuse?.student}
                            placeholder={'-' + translations(locale)?.select + '-'}
                            onChange={(e, data) => handleStudentChange(data?.value)}
                        />
                    </Col>
                </Row>
                <Row className='form-group'>
                    <Col md={4} />
                    <Col md={5} className='d-flex justify-content-center gap-05'>
                        {
                            reasons?.map((el, key) => (
                                <button key={key}
                                    className='br-08 p-2 px-4 d-flex align-items-center pointer fs-12'
                                    onClick={() => handleChange('reason', el?.id)}
                                    style={
                                        excuse?.reason == el?.id ?
                                            { color: 'white', border: `1px solid ${el?.color}`, backgroundColor: el?.color }
                                            :
                                            { color: el?.color, border: `1px solid ${el?.color}`, backgroundColor: 'white' }
                                    }
                                >
                                    {el?.name}
                                </button>
                            ))
                        }
                    </Col>
                </Row>
                <Row className='form-group'>
                    <Col md={4} />
                    <Col md={5} className='d-flex justify-content-center'>
                        <Tab
                            menu={{ attached: false, borderless: true, className: 'unattached-tab' }}
                            onTabChange={(e, data) => handleTabChange(data?.panes[data?.activeIndex]?.code)}
                            panes={[
                                {
                                    menuItem: translations(locale)?.calendar?.day,
                                    code: 'day',
                                },
                                {
                                    menuItem: translations(locale)?.period,
                                    code: 'hour',
                                }
                            ]}
                        />
                    </Col>
                </Row>
                {
                    excuse?.type == 'day' ?
                        <Row className='form-group'>
                            <Col md={4} className='col-form-label text-md-right label-pinnacle-bold'>
                                {translations(locale)?.date}*
                            </Col>
                            <Col md={5}>
                                <Row>
                                    <Col className='pr-0'>
                                        <DayPickerInput
                                            value={excuse?.startDate}
                                            inputProps={{ className: 'form-control h-100' }}
                                            placeholder={translations(locale)?.datePickerPlaceholder}
                                            onDayChange={(day, modifier, input) => handleChange('startDate', input?.state?.value)}
                                            classNames={{ overlay: 'DayPickerInputOverlay', container: 'position-relative h-100' }}
                                            dayPickerProps={{
                                                firstDayOfWeek: 1,
                                                disabledDays: {
                                                    after: new Date(excuse?.endDate || season?.end),
                                                    before: new Date(season?.start)
                                                },
                                            }}
                                        />
                                    </Col>
                                    <div className="pickerSeparator">
                                        <i className="la la-ellipsis-h" />
                                    </div>
                                    <Col className='pl-0'>
                                        <DayPickerInput
                                            value={excuse?.endDate}
                                            inputProps={{ className: 'form-control h-100' }}
                                            placeholder={translations(locale)?.datePickerPlaceholder}
                                            onDayChange={(day, modifier, input) => handleChange('endDate', input?.state?.value)}
                                            classNames={{ overlay: 'DayPickerInputOverlay', container: 'position-relative h-100' }}
                                            dayPickerProps={{
                                                firstDayOfWeek: 1,
                                                disabledDays: {
                                                    after: new Date(season?.end),
                                                    before: new Date(excuse?.startDate || season?.start)
                                                },
                                            }}
                                        />
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                        :
                        <>
                            <Row className='form-group'>
                                <Col md={4} className='col-form-label text-md-right label-pinnacle-bold'>
                                    {translations(locale)?.calendar?.day}*
                                </Col>
                                <Col md={5}>
                                    <DayPickerInput
                                        value={excuse?.day}
                                        inputProps={{ className: 'form-control' }}
                                        classNames={{ overlay: 'DayPickerInputOverlay' }}
                                        placeholder={translations(locale)?.datePickerPlaceholder}
                                        onDayChange={(day, modifier, input) => handleDayChange(input?.state?.value)}
                                        dayPickerProps={{
                                            firstDayOfWeek: 1,
                                            disabledDays: { after: new Date(season?.end), before: new Date(season?.start) },
                                        }}
                                    />
                                </Col>
                            </Row>
                            <Row className='form-group'>
                                <Col md={4} className='col-form-label text-md-right label-pinnacle-bold'>
                                    {translations(locale)?.subject?.title}*
                                </Col>
                                <Col md={5}>
                                    <Dropdown
                                        fluid
                                        search
                                        multiple
                                        selection
                                        options={subjectOptions}
                                        value={excuse?.subjects || []}
                                        placeholder={'-' + translations(locale)?.select + '-'}
                                        onChange={(e, data) => handleChange('subjects', data?.value)}
                                    />
                                </Col>
                            </Row>
                        </>
                }
                <Row className='form-group'>
                    <Col md={4} className='col-form-label text-md-right label-pinnacle-bold'>
                        {translations(locale)?.description}
                    </Col>
                    <Col md={5}>
                        <textarea
                            rows="5"
                            className='form-control'
                            value={excuse?.description}
                            onChange={(e) => handleChange('description', e.target.value)}
                        />
                    </Col>
                </Row>
            </Modal.Body>
            <Modal.Footer className="text-center">
                <button
                    className="btn m-btn--pill btn-link m-btn m-btn--custom"
                    onClick={onClose}
                >
                    {translations(locale)?.back}
                </button>
                <button
                    className="btn m-btn--pill btn-success m-btn--wide"
                    onClick={handleSave}
                >
                    {translations(locale)?.save}
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

export default register