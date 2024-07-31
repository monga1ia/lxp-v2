import message from 'modules/message'
import {Modal} from 'semantic-ui-react'
import {Col, Row} from 'react-bootstrap'
import React, {useEffect, useState, useRef} from 'react'
import CloseIcon from '@mui/icons-material/Close'
import secureLocalStorage from 'react-secure-storage'
import {translations} from 'utils/translations'
// import {fetchRequest} from 'utils/fetchRequest'
import {NDropdown as Dropdown} from 'widgets/Dropdown'
// import {teacherTodayBehaviorSubmit} from 'Utilities/url'
import DayPickerInput from 'react-day-picker/DayPickerInput'

const locale = secureLocalStorage?.getItem('selectedLang') || 'mn'

const behavior = ({onClose, onSubmit, props}) => {
    const [loading, setLoading] = useState(false)

    const [studentOptions] = useState(props?.students || [])
    const [stickers] = useState(props?.types || [])
    const [selectedSticker, setSelectedSticker] = useState(null)

    const [hasOverflow, setHasOverflow] = useState(false)

    const stickerContainerRef = useRef();

    const [behavior, setBehavior] = useState({
        score: '',
        students: [],
        behavior: null,
        description: '',
        date: props?.date,
    })

    useEffect(() => {
        setHasOverflow(stickerContainerRef?.current?.clientWidth < stickers?.length * 115)
    }, [props])

    const handleSubmit = () => {
        if (validateFields()) {
            onSubmit({...behavior, ...{type: selectedSticker, timetable: props?.timetable?.id, students: JSON.stringify(behavior?.students)}})
        }
    }

    const validateFields = () => {
        if (!behavior?.students?.length || !selectedSticker || !behavior?.date || !behavior?.score)
            return message(translations(locale)?.err?.fill_all_fields)
        return true
    }

    const onStickerChange = (value) => {
        const selectedStickerObj = stickers.find(obj => obj.id === value)
        setSelectedSticker(value)
        if (selectedStickerObj) {
            setBehavior({...behavior, ['score']: selectedStickerObj?.score})
        } else {
            setBehavior({...behavior, ['score']: ''})
        }
    }

    const handleChange = (name, value) =>
        setBehavior({...behavior, [name]: value})

    return (
        <Modal
            centered
            open={true}
            onClose={onClose}
            className='react-modal overflow-modal'
        >
            <div className='header'>
                {translations(locale)?.behavior?.title}
                <button type='button' className='close' aria-label='Close' onClick={onClose}>
                    <CloseIcon/>
                </button>
            </div>
            <div className='content'>
                <div className='fs-11 mb-3'>
                    <Row>
                        <Col className='px-2 bolder text-right' style={{color: '#868aa8'}}>{props?.date || ''}</Col>
                        <Col className='px-2' style={{color: '#575962'}}>{props?.group?.subject || ''}</Col>
                    </Row>
                    <Row>
                        <Col className='px-2 bolder text-right'
                             style={{color: '#868aa8'}}>{props?.timetable?.dayName || ''}</Col>
                        <Col className='px-2' style={{color: '#575962'}}>{props?.group?.name || ''}</Col>
                    </Row>
                    <Row>
                        <Col className='px-2 bolder text-right'
                             style={{color: '#868aa8'}}>{props?.timetable?.time || ''}</Col>
                        <Col className='px-2' style={{color: '#575962'}}>{props?.group?.classes || ''}</Col>
                    </Row>
                </div>
                <Row className='form-group'>
                    <Col className='text-right'>
                        <label className='text-right label-pinnacle-bold col-form-label'>
                            {translations(locale)?.student?.title}
                        </label>
                    </Col>
                    <Col>
                        <Dropdown
                            fluid
                            search
                            multiple
                            selection
                            closeOnChange
                            options={studentOptions?.map(studentObj => {
                                return {
                                    value: studentObj?.id,
                                    text: studentObj?.firstName + ' ' + studentObj?.lastName + ' (' + studentObj?.studentCode + ')'
                                }
                            })}
                            value={behavior?.students}
                            placeholder={'-' + translations(locale)?.select + '-'}
                            onChange={(e, data) => handleChange('students', data?.value)}
                        />
                    </Col>
                    <Col md={3}/>
                </Row>
                <Row
                    ref={stickerContainerRef}
                    className='form-group'>
                    <Col className={'w-100'}>
                        <div className={hasOverflow ? 'd-flex align-items-center' : 'd-flex justify-content-center align-items-center'} style={{
                            overflow: 'auto',
                            color: '#696e92'
                        }}>
                            {
                                stickers?.map(el =>
                                    <div
                                        key={el?.id}
                                        className='br-12 p-2 mr-1 ml-1 pointer text-center'
                                        style={{
                                            border: `1px solid ${selectedSticker === el?.id ? '#ff5b1d' : 'white'}`,
                                            maxWidth: 'min-content'
                                        }}
                                        onClick={() => onStickerChange(el?.id)}
                                    >
                                        <img width={80} height={80} src={el?.path} style={{
                                            objectFit: 'contain'
                                        }}/>
                                        <span className='text-center'>{el?.name}</span>
                                    </div>
                                )
                            }
                        </div>
                    </Col>
                </Row>
                <Row className='form-group'>
                    <Col className='text-right'>
                        <label className='text-right label-pinnacle-bold col-form-label'>
                            {translations(locale)?.date}
                        </label>
                    </Col>
                    <Col>
                        <DayPickerInput
                            value={behavior?.date}
                            inputProps={{className: 'form-control'}}
                            dayPickerProps={{
                                firstDayOfWeek: 1, disabledDays: props?.calendarDays
                                    ? {
                                        before: new Date(props?.calendarDays?.before),
                                        after: new Date(props?.calendarDays?.after)
                                    }
                                    :
                                    {}
                            }}
                            onDayChange={(day) => handleChange('date', day?.toISOString()?.split('T')?.[0])}
                            classNames={{overlay: 'DayPickerInputOverlay', container: 'position-relative'}}
                        />
                    </Col>
                    <Col md={3}/>
                </Row>
                <Row className='form-group'>
                    <Col className='text-right'>
                        <label className='text-right label-pinnacle-bold col-form-label'>
                            {translations(locale)?.description}
                        </label>
                    </Col>
                    <Col>
                        <textarea
                            rows={5}
                            className='form-control'
                            value={behavior?.description}
                            placeholder={translations(locale)?.description}
                            onChange={(e) => handleChange('description', e.target.value)}
                        />
                    </Col>
                    <Col md={3}/>
                </Row>
                <Row className='form-group'>
                    <Col className='text-right'>
                        <label className='text-right label-pinnacle-bold col-form-label'>
                            {translations(locale)?.score}*
                        </label>
                    </Col>
                    <Col>
                        <input
                            type='number'
                            className='form-control'
                            disabled={true}
                            value={behavior?.score}
                            placeholder={translations(locale)?.score}
                            onChange={(e) => handleChange('score', e.target.value)}
                        />
                    </Col>
                    <Col md={3}/>
                </Row>
            </div>
            <div className='actions'>
                <div className='d-flex justify-content-center gap-05'>
                    <button
                        className='btn m-btn--pill btn-outline-metal m-btn--wide text-uppercase'
                        onClick={onClose}
                    >
                        {translations(locale)?.close}
                    </button>
                    <button
                        className='btn m-btn--pill btn-success m-btn--wide text-uppercase'
                        onClick={handleSubmit}
                    >
                        {translations(locale)?.save}
                    </button>
                </div>
            </div>
            {
                loading &&
                <>
                    <div className='blockUI blockOverlay'/>
                    <div className='blockUI blockMsg blockPage'>
                        <div className='m-loader m-loader--brand m-loader--lg'/>
                    </div>
                </>
            }
        </Modal>
    )
}

export default behavior