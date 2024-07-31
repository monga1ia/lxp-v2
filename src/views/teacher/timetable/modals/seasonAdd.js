import React, { useEffect, useState } from 'react'
import { Modal } from 'react-bootstrap'
import { useTranslation } from "react-i18next";
import { translations } from 'utils/translations';
import message from 'modules/message';
import { NDropdown as Dropdown } from 'widgets/Dropdown';
import TimeField from 'react-simple-timefield';
import { Checkbox } from 'semantic-ui-react';
import CloseIcon from '@mui/icons-material/Close';
import secureLocalStorage from 'react-secure-storage';
import AddIcon from '@mui/icons-material/Add';

const locale = secureLocalStorage?.getItem('selectedLang') || 'mn'

const SeasonAdd = ({ onClose, onSubmit, _addTimetableGroupChange }) => {
    
    const { t } = useTranslation();

    const [seasonTimetableSubjectList, setSeasonTimetableSubjectList]  = useState([])
    const [selectedTimetableDayId, setSelectedTimetableDayId]  = useState(null)
    const [ableToAddTimetable, setAbleToAddTimetable]  = useState(true)
    const [addTimetableDays, setAddTimetableDays]  = useState([
        {
            value: 1,
            text: "Даваа",
            timetable: 0
        },
        {
            value: 2,
            text: "Мягмар",
            timetable: 0
        },
        {
            value: 3,
            text: "Лхагва",
            timetable: 0
        }
    ])
    const [shiftWithTime, setShiftWithTime] = useState([
        {
            id: 31,
            name: "тест",
            isActive: true,
            startTime: "08:00",
            endTime: "15:00",
            times: [
                {
                    id: 98,
                    name: "1",
                    start: "05:00",
                    end: "05:00",
                    ordering: null,
                    isActive: true
                }
            ]
        },
        {
            id: 35,
            name: "1-р ээлжийн мэдээлэл",
            isActive: true,
            startTime: "08:00",
            endTime: "13:15",
            times: [
                {
                    id: 2861,
                    name: "1-р цаг",
                    start: "00:00",
                    end: "08:40",
                    ordering: null,
                    isActive: true
                },
                {
                    id: 2862,
                    name: "Бямбаа",
                    start: "08:45",
                    end: "09:25",
                    ordering: null,
                    isActive: true
                }
            ]
        },
        {
            id: 68,
            name: "1-р ээлж",
            isActive: true,
            startTime: "08:00",
            endTime: "13:00",
            times: [
                {
                    id: 2569,
                    name: "1-р цаг",
                    start: "08:00",
                    end: "08:40",
                    ordering: null,
                    isActive: true
                },
                {
                    id: 2570,
                    name: "2-р цаг",
                    start: "08:45",
                    end: "09:25",
                    ordering: null,
                    isActive: true
                },
                {
                    id: 2571,
                    name: "3-р цаг",
                    start: "09:30",
                    end: "10:10",
                    ordering: null,
                    isActive: true
                },
                {
                    id: 2572,
                    name: "4-р цаг",
                    start: "10:20",
                    end: "11:00",
                    ordering: null,
                    isActive: true
                },
                {
                    id: 2573,
                    name: "5-р цаг",
                    start: "11:05",
                    end: "11:45",
                    ordering: null,
                    isActive: true
                },
                {
                    id: 2574,
                    name: "6-р цаг",
                    start: "11:50",
                    end: "12:30",
                    ordering: null,
                    isActive: true
                }
            ]
        },
        {
            id: 78,
            name: "1-р ээлж",
            isActive: true,
            startTime: "08:00",
            endTime: "13:05",
            times: [
                {
                    id: 1505,
                    name: "1-р цаг",
                    start: "07:45",
                    end: "08:25",
                    ordering: null,
                    isActive: true
                }
            ]
        },
        {
            id: 366,
            name: "Test",
            isActive: true,
            startTime: "08:00",
            endTime: "12:00",
            times: [
                {
                    id: 2577,
                    name: "1-р цаг",
                    start: "09:00",
                    end: "10:00",
                    ordering: null,
                    isActive: true
                }
            ]
        },
        {
            id: 30,
            name: "Үндсэн ээлж",
            isActive: true,
            startTime: "08:15",
            endTime: "16:45",
            times: [
                {
                    id: 1506,
                    name: "1-р цаг",
                    start: "08:40",
                    end: "09:20",
                    ordering: null,
                    isActive: true
                }
            ]
        },
        {
            id: 36,
            name: "2-р ээлж",
            isActive: true,
            startTime: "13:10",
            endTime: "18:55",
            times: [
                {
                    id: 1507,
                    name: "1-р цаг",
                    start: "13:10",
                    end: "14:00",
                    ordering: null,
                    isActive: true
                }
            ]
        }
    ])

    // useEffect(() => {
    //     this.setState({
    //         fetchAddTimetable: false,
    //         showLoader: false,
    //         activeModal: true,
    //         modalTitle: translations(locale).add,
    //         modalAction: "SEASON_ADD",
    //         modalSize: 'large',
    //         addTimetableDays: nextProps.addTimetableDays,
    //         shiftWithTime: shiftWithTime,
    //         seasonTimetableSubjectList: nextProps.subjects
    //     });
    // })

    const handlerTimetableCheckbox = (value, id) => {
        // setShiftWithTime(clone)
        // let valueArray = value.split("_");
        // let schoolShiftId = 0;
        // let timesIndex = -1; 

        // if (valueArray && valueArray.length > 1) {
        //     schoolShiftId = valueArray[0];
        //     timesIndex = valueArray[1];
        // }

        // let schoolShift = swtClone.find(function (val) {
        //     return parseInt(val['id']) === parseInt(schoolShiftId)
        // });

        // if (schoolShift && timesIndex > -1) {
        //     let times = schoolShift['times'][timesIndex];
        //     if (times) {
        //         if (times['isChecked'] === false || typeof times['isChecked'] === 'undefined') {
        //             times['isChecked'] = true;
        //         } else {
        //             times['groupId'] = null;
        //             times['isChecked'] = false;
        //         }

        //     }
        // }

        // setShiftWithTime(swtClone)
    };


    const _addTimetableDayChange = (e, data) => {
        let selectedOption = data.options.filter(day => {
            return day.value === data.value;
        });

        if (selectedOption && selectedOption.length > 0 && selectedOption[0].timetable > 0) {
            setSelectedTimetableDayId(data.value)
            setAbleToAddTimetable(false)
        } else {
            setSelectedTimetableDayId(data.value)
            setAbleToAddTimetable(true)
        }
    };

    const addNewTimetableSubmit = () => {
        if (selectedTimetableDayId) {
            const shifts = [...shiftWithTime]
            let error = false
            shifts?.forEach(shift => {
                shift?.times?.forEach(time => {
                    if (time?.isChecked) {
                        if (time.end == '00:00' || time.start == '00:00' || !time.groupId) {
                            error = true
                        }
                    }
                })
            })
            if (error) {
                return message(translations(locale).err.fill_all_fields)
            }

            const params = {
                selectedDay: selectedTimetableDayId,
                shifts: JSON.stringify(shifts?.map(shift => ({
                    id: shift.id,
                    times: shift?.times?.map(time => ({
                        start: time.start,
                        end: time.end,
                        group: time.groupId,
                    }))
                })))
            }

            if (hasCustomDateAttendance) {
                params.season = tabPanes[tabActiveIndex]?.tabKey;
            }

            // setState({
            //     fetchAddTimetableSubmit: true,
            //     showLoader: true
            // });
            // props.fetchMyTimetableAddTimetableSubmit(params)
        } else {
            message(translations(locale).timetable.select_day)
        }
    };

    const addTimetableRemoveRow = (value) => {
        if (value) {
            let indexArray = value.split("_");
            if (indexArray && indexArray.length > 0) {
                let schoolShiftId = indexArray[0];
                let timesIndex = indexArray[1];

                let swtClone = [...shiftWithTime];

                let selectedShiftObj = swtClone.find(function (obj) {
                    return parseInt(obj['id']) === parseInt(schoolShiftId);
                });
                if (selectedShiftObj) {
                    selectedShiftObj['times'].splice(timesIndex, 1);

                    setShiftWithTime(swtClone)
                }
            }
        }
    };

    const addTimetableRow = (shift_id) => {
        if (shift_id) {
            let swtClone = shiftWithTime;
            let selectedShiftObj = swtClone.find(function (obj) {
                return obj['id'] === shift_id
            });

            if (selectedShiftObj) {
                // let timeIndex = selectedShiftObj['times'] && selectedShiftObj['times'].length || 0;

                selectedShiftObj['times'].push({
                    id: null,
                    name: null,
                    start: "00:00",
                    end: "00:00",
                    schoolShiftId: shift_id,
                    order_number: null,
                    schoolShiftCode: null,
                    schoolShiftName: selectedShiftObj['schoolShiftName'],
                    parent_id: null,
                    isChecked: true,
                    groupId: null,
                    index: shift_id + "_" + (selectedShiftObj['times'] ? selectedShiftObj['times'].length : 0)
                });
            }

            setShiftWithTime([...swtClone])
        }
    };

    return (
        <Modal
            size='xl'
            dimmer='blurring'
            show={true}
            onHide={onClose}
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton style={{padding: '1rem'}}>
                <Modal.Title className="modal-title d-flex flex-row justify-content-between w-100">
                    {t('add')}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body style={{color: '#212529'}}>
                <div className="">
                    <div className="form-group m-form__group row">
                        <div className="col-md-12 d-flex">
                            <label htmlFor="example-number-input"
                                    className="col-md-4 col-form-label label-pinnacle-bold text-right">
                                {translations(locale).timetable.day || null}
                            </label>
                            <div className="col-md-5">
                                {
                                    <Dropdown
                                        options={addTimetableDays}
                                        placeholder={translations(locale).survey.choose || null}
                                        fluid
                                        selection
                                        search
                                        additionPosition='bottom'
                                        upward={false}
                                        closeOnChange
                                        multiple={false}
                                        selectOnBlur={false}
                                        value={selectedTimetableDayId}
                                        onChange={_addTimetableDayChange}
                                    />
                                }
                            </div>
                        </div>
                    </div>
                    {
                        selectedTimetableDayId
                            ?
                            ableToAddTimetable
                                ?
                                shiftWithTime?.map(function (schoolShift, index) {
                                    return (
                                        <div
                                            key={'school_shift_' + schoolShift['id']}
                                            className="myTimetable-add-timetable">
                                            <div className="bolder pb-2 pl-3"
                                                    style={{color: '#ff2f19'}}>
                                                {schoolShift['name']}
                                            </div>

                                            <table className="table table-bordered"
                                                    key={'newSubject_1'}>
                                                <thead>
                                                <tr>
                                                    <th className="bolder pl-4" style={{
                                                        color: '#575962',
                                                        fontSize: '11px'
                                                    }}
                                                        colSpan={2}>{translations(locale).timetable.time || null}</th>
                                                    <th className="bolder pl-4" style={{
                                                        color: '#575962',
                                                        fontSize: '11px'
                                                    }}>{`${translations(locale).subject.title} | ${translations(locale).class.title}`}</th>
                                                    <th></th>
                                                </tr>
                                                </thead>
                                                <tbody>
                                                {
                                                    schoolShift['times'] && schoolShift['times'].length > 0
                                                        ?
                                                        schoolShift['times']?.map(function (times, i) {
                                                            return (
                                                                <tr key={'tr_' + i}>
                                                                    <td className="p-1 vertical-inherit text-center">
                                                                        <div>
                                                                            {
                                                                                times['id'] === null
                                                                                    ?
                                                                                    <TimeField
                                                                                        value={times['start']}
                                                                                        onChange={(event) => addTimetableInputStartTimeHandler(event, times['index'])}
                                                                                        style={{
                                                                                            width: '100%',
                                                                                            borderRadius: '.25rem',
                                                                                            color: '#575962',
                                                                                            padding: '.65rem 1rem',
                                                                                            fontSize: '1rem',
                                                                                            border: '1px solid #ced4da',
                                                                                            borderColor: '#ebedf2'
                                                                                        }}
                                                                                    />
                                                                                    :
                                                                                    <TimeField
                                                                                        value={times['start']}
                                                                                        disabled
                                                                                        style={{
                                                                                            width: '100%',
                                                                                            borderRadius: '.25rem',
                                                                                            color: '#575962',
                                                                                            padding: '.65rem 1rem',
                                                                                            fontSize: '1rem',
                                                                                            border: '1px solid #f4f5f8',
                                                                                            borderColor: '#ebedf2',
                                                                                            backgroundColor: '#f4f5f8'
                                                                                        }}
                                                                                    />
                                                                            }
                                                                        </div>
                                                                    </td>
                                                                    <td className="p-1 vertical-inherit text-center">
                                                                        <div>
                                                                            {
                                                                                times['id'] === null
                                                                                    ?
                                                                                    <TimeField
                                                                                        value={times['end']}
                                                                                        onChange={(event) => addTimetableInputEndTimeHandler(event, times['index'])}
                                                                                        style={{
                                                                                            width: '100%',
                                                                                            borderRadius: '.25rem',
                                                                                            color: '#575962',
                                                                                            padding: '.65rem 1rem',
                                                                                            fontSize: '1rem',
                                                                                            border: '1px solid #ced4da',
                                                                                            borderColor: '#ebedf2'
                                                                                        }}
                                                                                    />
                                                                                    :
                                                                                    <TimeField
                                                                                        value={times['end']}
                                                                                        disabled
                                                                                        style={{
                                                                                            width: '100%',
                                                                                            borderRadius: '.25rem',
                                                                                            color: '#575962',
                                                                                            padding: '.65rem 1rem',
                                                                                            fontSize: '1rem',
                                                                                            border: '1px solid #f4f5f8',
                                                                                            borderColor: '#ebedf2',
                                                                                            backgroundColor: '#f4f5f8'
                                                                                        }}
                                                                                    />
                                                                            }
                                                                        </div>
                                                                    </td>
                                                                    <td className="p-1 text-center">
                                                                        <div
                                                                            className="d-flex"
                                                                        >
                                                                            <input 
                                                                                className="form-check-input modal-position col-form-label myTimetable-checkBoxStyle ml-2" 
                                                                                id='cellCheckbox' type="checkbox" 
                                                                                value={times['index']} 
                                                                                defaultChecked={times['isChecked'] === true ? true : false}
                                                                                onChange={(e, data) => handlerTimetableCheckbox(e.target.checked, i)}
                                                                                style={{ borderRadius: '4px', height: '18px', width: '18px'}} 
                                                                            />
                                                                            {/* <Checkbox
                                                                                className="myTimetable-checkBoxStyle pl-1"
                                                                                defaultChecked={times['isChecked'] === true ? true : false}
                                                                                value={times['index']}
                                                                                onChange={(e,data) => handlerTimetableCheckbox(e, data)}
                                                                            /> */}
                                                                            {
                                                                                times['isChecked'] === true
                                                                                    ?
                                                                                    <Dropdown
                                                                                        search
                                                                                        additionPosition='bottom'
                                                                                        upward={false}
                                                                                        closeOnChange
                                                                                        selectOnBlur={false}
                                                                                        fluid
                                                                                        selection
                                                                                        multiple={false}
                                                                                        style={{marginLeft: '2.5rem'}}
                                                                                        placeholder={translations(locale).survey.choose || null}
                                                                                        options={seasonTimetableSubjectList}
                                                                                        value={times['groupId'] || null}
                                                                                        onChange={(e, data) => _addTimetableGroupChange(data, times['schoolShiftId'], times['index'])}
                                                                                    />
                                                                                    : null
                                                                            }
                                                                        </div>
                                                                    </td>
                                                                    <td className="p-1 vertical-inherit text-center">
                                                                        {
                                                                            times['id'] === null
                                                                                ?
                                                                                <button
                                                                                    onClick={() => addTimetableRemoveRow(schoolShift['id'] + '_' + i)}
                                                                                    className="btn btn-danger m-btn m-btn--icon btn-sm m-btn--icon-only m-btn--pill d-inline-flex align-items-center justify-content-center">
                                                                                    <CloseIcon
                                                                                        sx={{fontSize: '1.2rem'}}/>
                                                                                </button>
                                                                                : null
                                                                        }
                                                                    </td>
                                                                </tr>
                                                            )
                                                        })
                                                        : null
                                                }
                                                <tr>
                                                    <td className="border-white"></td>
                                                    <td className="border-white"></td>
                                                    <td style={{borderBottomColor: 'white'}}></td>
                                                    <td className="p-1 vertical-inherit text-center">
                                                        <button
                                                            onClick={() => addTimetableRow(schoolShift['id'])}
                                                            className="btn btn-outline-info m-btn m-btn--icon btn-sm m-btn--icon-only m-btn--pill d-inline-flex align-items-center justify-content-center"
                                                        >
                                                            <AddIcon/>
                                                        </button>
                                                    </td>
                                                </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    )
                                })
                                :
                                <div
                                    className="form-group m-form__group row text-center">
                                    <div className="col-md-12">
                                        {translations(locale).timetable.day_not_empty || null}
                                    </div>
                                </div>
                            :
                            <div className="form-group m-form__group row">
                                <div className="col-md-12 text-center">
                                    {translations(locale).timetable.choose_day || null}
                                </div>
                            </div>
                    }
                </div>
            </Modal.Body>
            <Modal.Footer className='text-center'>
                <button className="btn m-btn--pill btn-link m-btn--custom"
                        onClick={onClose}>{translations(locale).back || null}
                </button>
                <button
                    className="btn btn-success m-btn m-btn--icon m-btn--pill m-btn--uppercase"
                    onClick={addNewTimetableSubmit}>{translations(locale).save || null}
                </button>
            </Modal.Footer>
        </Modal >
    )
}

export default SeasonAdd