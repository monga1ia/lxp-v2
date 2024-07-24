import React, {useState, useEffect} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {Row, Col} from 'react-bootstrap'
import {translations} from 'utils/translations'
import {NDropdown} from 'widgets/Dropdown'
import TimeField from 'react-simple-timefield';
import {Checkbox} from 'semantic-ui-react'
import popup from 'modules/message'
import { Modal } from 'react-bootstrap'
// import {
//     fetchClubTimetableAdd as fetchAdd,
//     fetchClubTimetableOptions as fetchOptions
// } from 'Actions/action';
import DeleteModal from './modal/DeleteModal'
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import { useTranslation } from 'react-i18next'

const AddTimeTable = ({
                          lang = 'mn',
                          clubs = [],
                          schoolShifts = [],
                          customDateAttendance = false,
                          season = null,
                          timeTemplates = {},
                          toMain = () => {
                          },
                          clubData,
                          onClose
                      }) => {

    const dispatch = useDispatch()
    const { t } = useTranslation()

    const loading = useSelector(state => state.clubTimetableAdd?.loading || false)
    const success = useSelector(state => state.clubTimetableAdd?.success || false)
    const message = useSelector(state => state.clubTimetableAdd?.data?.message || '')

    const days = [
        {
            value: 1,
            text: lang === 'mn' ? 'Даваа' : 'Monday',
        },
        {
            value: 2,
            text: lang === 'mn' ? 'Мягмар' : 'Tuesday',
        },
        {
            value: 3,
            text: lang === 'mn' ? 'Лхагва' : 'Wednesday',
        },
        {
            value: 4,
            text: lang === 'mn' ? 'Пүрэв' : 'Thursday',
        },
        {
            value: 5,
            text: lang === 'mn' ? 'Баасан' : 'Friday',
        },
        {
            value: 6,
            text: lang === 'mn' ? 'Бямба' : 'Saturday',
        },
        {
            value: 7,
            text: lang === 'mn' ? 'Ням' : 'Sunday',
        }
    ]

    const [club, setClub] = useState(null)
    const [schoolShift, setSchoolShift] = useState(null)
    const [schoolShiftName, setSchoolShiftName] = useState('')
    const [timetableData, setTimetableData] = useState([
        {
            id: null,
            day: null,
            startTime: '',
            endTime: '',
            isShift: false,
            room: '',
            time: null,
        }
    ])
    const [errors, setErrors] = useState([])
    const [rowErrors, setRowErrors] = useState({})
    const [saveClicked, setSaveClicked] = useState(false)
    const [viewDeleteModal, setViewDeleteModal] = useState(false)
    const [tempId, setTempId] = useState(null)

    const emptyTimetable = () => {
        setTimetableData([
            {
                id: null,
                day: null,
                startTime: '',
                endTime: '',
                isShift: false,
                room: '',
                time: null,
            }
        ])
    }

    const errorHandler = name => {
        const error = errors.find(err => err === name)
        if (error) {
            return true
        }
        return false
    }

    const addRow = () => {
        const tempData = [...timetableData]
        tempData.push({
            day: null,
            startTime: '',
            endTime: '',
            isShift: false,
            room: '',
            time: null,
        })
        setTimetableData(tempData)
    }

    const deleteTimetable = (index, id) => {
        if (id) {
            setTempId(id)
            setViewDeleteModal(true)
        } else {
            if (index) {
                removeRow(index)
            }
        }
    }

    const removeRow = index => {
        if (index === 0 || index) {
            const tempData = timetableData.filter((data, idx) => idx !== index)
            if (timetableData.length > 1) {
                setTimetableData(tempData)
            }
        }
    }

    const rowErrorHandler = (index, name) => {
        if (rowErrors[index]) {
            const error = rowErrors[index].find(err => err === name)
            if (error) {
                return true
            }
            return false
        } else {
            return false
        }
    }

    const errorRemove = name => {
        const error = errors.filter(el => el !== name)
        setErrors(error)
    }

    const rowErrorRemove = (index, name) => {
        const rowErr = {...rowErrors}
        if (rowErr[index]) {
            rowErr[index] = rowErr[index].filter(el => el !== name)
        }
        setRowErrors(rowErr)
    }

    const onChange = (index, name, value) => {
        const tempData = [...timetableData]
        if (name === 'isShift') {
            tempData[index]['endTime'] = ''
            tempData[index]['startTime'] = ''
            tempData[index]['time'] = null
        }
        if (name === 'endTime' || name === 'startTime') {
            rowErrorRemove(index, 'time')
        } else {
            rowErrorRemove(index, name)
        }
        tempData[index][name] = value
        setTimetableData(tempData)
    }

    const handleTimeChange = (index, name, {value, options} = data) => {
        const tempData = [...timetableData]
        const time = options?.find(el => el?.value == value)
        tempData[index]['startTime'] = time?.start
        tempData[index]['endTime'] = time?.end
        tempData[index][name] = value
        setTimetableData(tempData)
    }

    const checkIfEmpty = () => {
        let error = []
        timetableData.map((data, index) => {
            error.push([])
            if (!data.day) {
                error[index].push('day')
            }
            if (data.isShift && !data.time) {
                error[index].push('time')
            }
            if (!data.time && (!data.startTime || !data.endTime)) {
                error[index].push('time')
            }
        })

        const tempError = []
        if (!club) {
            tempError.push('club')
        }
        if (!schoolShift) {
            tempError.push('schoolShift')
        }

        let valid = true
        if (tempError.length) {
            valid = false
        }
        error.map(data => {
            if (data.length) {
                valid = false
            }
        })

        if (!valid) {
            setRowErrors(error)
            setErrors(tempError)
        }

        return valid
    }

    const checkIfTimeOverlaps = () => {
        // const days = []
        // timetableData.map(data => {
        //     days.push(data.day)
        // })
        // console.log('timetableData', timetableData)

        if (timetableData?.every(el => el?.startTime != el?.endTime))
            return false
        else
            return true

        // const day = days.find((el, idx, arr) => arr.indexOf(el) != idx)
        // if (day) {
        //     const dayIndex = days.findIndex((el, idx, arr) => arr.indexOf(el) != idx)
        //     const orginalIndex = days.findIndex((el, idx, arr) => arr.indexOf(el) == idx && el === day)
        //     const original = timetableData[orginalIndex]
        //     const dup = timetableData[dayIndex]
        //     if (original.isShift && dup.isShift) {
        //         if (original.time !== dup.time) {
        //             return false
        //         } else {
        //             let error = []
        //             error[dayIndex] = []
        //             error[dayIndex].push('time')
        //             setRowErrors(error)
        //             return true
        //         }
        //     } else {
        //         if (original.isShift) {
        //             const timeStr = timeTemplates[schoolShift].find(data => data.value === original.time).text

        //             if (timeStr) {
        //                 const orStart = new Date(`2022-01-21 ${timeStr.substring(0, 5)}:00`)
        //                 const orEnd = new Date(`2022-01-21 ${timeStr.substring(8, 13)}:00`)
        //                 const end = new Date(`2022-01-21 ${dup.endTime}:00`)
        //                 const start = new Date(`2022-01-21 ${dup.startTime}:00`)
        //                 if ((start >= orStart && start < orEnd) || (end <= orEnd && end > orStart)) {
        //                     let error = []
        //                     error[dayIndex] = []
        //                     error[dayIndex].push('time')
        //                     setRowErrors(error)
        //                     return true
        //                 } else {
        //                     return false
        //                 }
        //             } else {
        //                 return false
        //             }
        //         } else if (dup.isShift) {
        //             const timeStr = timeTemplates[schoolShift].find(data => data.value === dup.time).text
        //             if (timeStr) {
        //                 const orStart = new Date(`2022-01-21 ${timeStr.substring(0, 5)}:00`)
        //                 const orEnd = new Date(`2022-01-21 ${timeStr.substring(8, 13)}:00`)
        //                 const end = new Date(`2022-01-21 ${original.endTime}:00`)
        //                 const start = new Date(`2022-01-21 ${original.startTime}:00`)
        //                 if ((start >= orStart && start < orEnd) || (end <= orEnd && end > orStart)) {
        //                     let error = []
        //                     error[dayIndex] = []
        //                     error[dayIndex].push('time')
        //                     setRowErrors(error)
        //                     return true
        //                 } else {
        //                     return false
        //                 }
        //             } else {
        //                 return false
        //             }
        //         } else {
        //             const orStart = new Date(`2022-01-21 ${original.startTime}:00`)
        //             const orEnd = new Date(`2022-01-21 ${original.endTime}:00`)
        //             const end = new Date(`2022-01-21 ${dup.endTime}:00`)
        //             const start = new Date(`2022-01-21 ${dup.startTime}:00`)
        //             if ((start >= orStart && start < orEnd) || (end <= orEnd && end > orStart)) {
        //                 let error = []
        //                 error[dayIndex] = []
        //                 error[dayIndex].push('time')
        //                 setRowErrors(error)
        //                 return true
        //             } else {
        //                 return false
        //             }
        //         }
        //     }
        // }
        // return false
    }

    const onSave = () => {
        if (checkIfEmpty() && !checkIfTimeOverlaps()) {
            const params = {
                group: club,
                season,
                schoolShift,
                schoolShiftName,
                submit: 1,
                timetables: JSON.stringify(timetableData)
            }
            // dispatch(fetchAdd(params))
            setSaveClicked(true)
        } else {
            if (!checkIfEmpty()) {
                return popup(translations(lang).err?.fill_all_fields)
            }
            if (checkIfTimeOverlaps) {
                return popup(translations(lang).timetable?.time_not_empty)
            }
        }
    }

    const renderTr = () => {
        return timetableData.map((data, index) => {
            return (
                <tr key={index}>
                    <td className='p-1'>
                        <NDropdown
                            className={`${rowErrorHandler(index, 'day') ? 'error-border' : ''}`}
                            placeholder={'-' + translations(lang).select + '-' || ""}
                            fluid
                            selection
                            search={true}
                            additionPosition='bottom'
                            upward={false}
                            selectOnBlur={false}
                            value={data.day}
                            options={days}
                            onChange={(e, data) => onChange(index, "day", data.value)}
                        />
                    </td>
                    <td width={44} className='text-center'>
                        <Checkbox
                            type='checkbox'
                            checked={data.isShift}
                            onClick={(e, data) => onChange(index, "isShift", data.checked)}
                        />
                    </td>
                    {
                        !data.isShift
                            ?
                            <React.Fragment>
                                <td className='p-1'>
                                    <TimeField
                                        value={data.startTime}
                                        onChange={(e) => onChange(index, 'startTime', e.target.value)}
                                        className={`form-control w-100 ${rowErrorHandler(index, 'time') ? 'error-border' : ''}`}
                                    />
                                </td>
                                <td className='p-1'>
                                    <TimeField
                                        value={data.endTime}
                                        onChange={(e) => onChange(index, 'endTime', e.target.value)}
                                        className={`form-control w-100 ${rowErrorHandler(index, 'time') ? 'error-border' : ''}`}
                                    />
                                </td>
                            </React.Fragment>
                            :
                            <td colSpan={2} className='p-1'>
                                <NDropdown
                                    className={`form-control ${rowErrorHandler(index, 'time') ? 'error-border' : ''}`}
                                    placeholder={'-' + translations(lang).select + '-' || ""}
                                    fluid
                                    selection
                                    search={true}
                                    additionPosition='bottom'
                                    upward={false}
                                    selectOnBlur={false}
                                    value={data.time}
                                    options={schoolShifts?.find(el => el?.value == schoolShift)?.times || []}
                                    onChange={(e, data) => handleTimeChange(index, "time", data)}
                                />
                            </td>
                    }
                    <td className='p-1'>
                        <input
                            value={data.room}
                            className={`form-control ${rowErrorHandler(index, 'room') ? 'error-border' : ''}`}
                            onChange={e => onChange(index, "room", e.target.value)}
                        />
                    </td>
                    <td className='p-1 text-center vertical-inherit'>
                        <button
                            className='btn btn-danger m-btn m-btn--icon btn-sm m-btn--icon-only m-btn--pill d-inline-flex align-items-center justify-content-center'
                            onClick={() => deleteTimetable(index, data.id)}
                        >
                            <CloseIcon/>
                        </button>
                    </td>
                </tr>
            )
        })
    }

    useEffect(() => {
        if (saveClicked && !loading) {
            setSaveClicked(false)
            if (success) {
                toMain(season || null)
                emptyTimetable()
                setClub(null)
                setSchoolShift(null)
                setSchoolShiftName('')
            }
            popup(message, success)
        }
    }, [loading])

    useEffect(() => {
        if (clubData) {
            setClub(clubData.id)
            setSchoolShift(clubData.shiftId)
            setSchoolShiftName(schoolShifts?.find(el => el?.value == clubData?.shiftId)?.text)
            if (clubData.timetables && clubData.timetables.length) {
                const tempTimetableData = []
                clubData.timetables.map(data => {
                    tempTimetableData.push({
                        id: data.id,
                        day: data.day,
                        startTime: data.startTime,
                        endTime: data.endTime,
                        isShift: false,
                        room: data.room,
                        time: null,
                    })
                })
                setTimetableData(tempTimetableData)
            } else {
                emptyTimetable()
            }
        } else {
            emptyTimetable()
            setClub(null)
            setSchoolShift(null)
            setSchoolShiftName('')
        }
    }, [clubData])

    useEffect(() => {
        if (clubData && clubData.shiftId === schoolShift) {
            if (clubData.timetables && clubData.timetables.length) {
                const tempTimetableData = []
                clubData.timetables.map(data => {
                    tempTimetableData.push({
                        id: data.id,
                        day: data.day,
                        startTime: data.startTime,
                        endTime: data.endTime,
                        isShift: false,
                        room: data.room,
                        time: null,
                    })
                })
                setTimetableData(tempTimetableData)
            }
        }
    }, [schoolShift])

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
                    {t('add')}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className='m-portlet__body'>
                <Row className='align-items-center'>
                    <Col className='text-right' md={5}>
                        <label className='label-pinnacle-bold'>{translations(lang).club?.title + '*'}</label>
                    </Col>
                    <Col>
                        {
                            clubData?.name
                                ?
                                <label>{clubData.name}</label>
                                :
                                <NDropdown
                                    className={`form-control ${errorHandler('club') ? 'error-border' : ''}`}
                                    placeholder={'-' + translations(lang).select + '-' || ""}
                                    fluid
                                    selection
                                    search={true}
                                    additionPosition='bottom'
                                    upward={false}
                                    selectOnBlur={false}
                                    value={club}
                                    options={clubs}
                                    onChange={(e, data) => {
                                        const params = {
                                            group: data.value
                                        }
                                        // dispatch(fetchOptions(params))
                                        setClub(data.value)
                                        errorRemove('club')
                                    }}
                                    style={{maxWidth: '260px'}}
                                />
                        }

                    </Col>
                </Row>
                <Row className='align-items-center my-3'>
                    <Col className='text-right' md={5}>
                        <label
                            className='label-pinnacle-bold'>{translations(lang).school_settings?.school_shift + '*'}</label>
                    </Col>
                    <Col>
                        <NDropdown
                            className={`form-control ${errorHandler('schoolShift') ? 'error-border' : ''}`}
                            placeholder={'-' + translations(lang).select + '-' || ""}
                            fluid
                            selection
                            additionPosition='bottom'
                            upward={false}
                            selectOnBlur={false}
                            value={schoolShift}
                            options={schoolShifts}
                            onChange={(e, data) => {
                                setSchoolShift(data.value)
                                setSchoolShiftName(data?.options?.find(el => el?.value == data?.value)?.text)
                                errorRemove('schoolShift')
                                emptyTimetable()
                            }}
                            style={{maxWidth: '260px'}}
                        />
                    </Col>
                </Row>
                <Row className='justify-content-center my-4'>
                    <Col md={9}>
                        <table className='table table-bordered'>
                            <thead>
                            <tr>
                                <th width={300} className='pl-4 bolder'
                                    style={{fontSize: '12px'}}>{translations(lang).days}</th>
                                <th className='pl-4 bolder' style={{fontSize: '12px'}}
                                    colSpan={3}>{translations(lang).timetable?.time}</th>
                                <th width={300} className='pl-4 bolder'
                                    style={{fontSize: '12px'}}>{translations(lang).timetable?.room}</th>
                                <th width={35}></th>
                            </tr>
                            </thead>
                            <tbody>
                            {renderTr()}
                            <tr>
                                <td style={{borderColor: 'white'}}></td>
                                <td style={{borderColor: 'white'}} colSpan={3}></td>
                                <td style={{borderBottomColor: 'white'}}></td>
                                <td className='text-center p-1'>
                                    <button
                                        className='btn btn-outline-info m-btn m-btn--icon btn-sm m-btn--icon-only m-btn--pill d-inline-flex align-items-center justify-content-center'
                                        onClick={addRow}
                                    >
                                        <AddIcon/>
                                    </button>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </Col>
                </Row>
            </Modal.Body>
            <Modal.Footer className="m-portlet__foot text-center">
                <button
                    type="button"
                    onClick={() => {
                        emptyTimetable()
                        setClub(null)
                        setSchoolShift(null)
                        toMain()
                    }}
                    className='btn m-btn--pill btn-link m-btn m-btn--custom'
                >
                    {translations(lang).back}
                </button>
                <button
                    type="button"
                    className="btn m-btn--pill btn-success m-btn--wide m-btn--uppercase ml-2"
                    onClick={onSave}
                >
                    {translations(lang).save}
                </button>
            </Modal.Footer>
            {
                viewDeleteModal
                    ?
                    <DeleteModal id={tempId} tab={'timetable'} onClose={() => setViewDeleteModal(false)} lang={lang}
                                 club={club}/>
                    : null
            }
            {
                loading
                    ?
                    <div>
                        <div className="blockUI blockOverlay"/>
                        <div className="blockUI blockMsg blockPage">
                            <div className="m-loader m-loader--brand m-loader--lg"/>
                        </div>
                    </div>
                    : null
            }
        </Modal>
    )
}

export default AddTimeTable
