import { React, useState, useEffect } from 'react'
import { Row, Col, Card, Button } from 'react-bootstrap';
import secureLocalStorage from 'react-secure-storage'
import { useHistory } from 'react-router-dom';
import HtmlHead from 'components/html-head/HtmlHead';
import BreadcrumbList from 'components/breadcrumb-list/BreadcrumbList';
import DTable from 'modules/DataTable/DTable';
import {Tab} from "semantic-ui-react";
import { useTranslation } from "react-i18next";
import {dateFormat} from 'utils/Util';
import message from '../../../modules/message'
import {cloneDeep} from 'lodash';
import DayPickerInput from "react-day-picker/DayPickerInput";
import TimelineIcon from '@mui/icons-material/Timeline';
import {Link} from 'react-router-dom'
import {Dropdown, Modal} from 'semantic-ui-react'
import CloseIcon from '@mui/icons-material/Close'
import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded'
import { CleaningServices } from '@mui/icons-material';
import DownloadAttendanceModal from './modals/downloadAttendance'

const WEEKDAYS_LONG = {
    mn: {
        1: 'Даваа ',
        2: 'Мягмар',
        3: 'Лхагва',
        4: 'Пүрэв',
        5: 'Баасан',
        6: 'Бямба',
        0: 'Ням',
    },
    en: {
        1: 'Monday',
        2: 'Tuesday',
        3: 'Wednesday',
        4: 'Thursday',
        5: 'Friday',
        6: 'Saturday',
        0: 'Sunday',
    },
    ru: {
        1: 'Понедельник',
        2: 'Вторник',
        3: 'Среда',
        4: 'Четверг',
        5: 'Пятница',
        6: 'Суббота',
        0: 'Воскресенье',
    }
};

const baseButton = {
    fontFamily: 'MulishRegular',
    padding: "0.65rem 1rem",
    border: '1px solid',
    cursor: 'pointer',
    height: '35px',
    width: '35px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}

const index = () => {
    // const locale="mn";
    const locale = secureLocalStorage?.getItem('selectedLang') || 'mn'
    const localSchool = secureLocalStorage.getItem('selectedSchool')
    const { t } = useTranslation();
    const history = useHistory();
    const [loading, setLoading] = useState(false);

    // const { selectedSchool } = useSelector(state => state.schoolData);

    const title = t('class.attendance.title');
    const description = "E-learning";
    const breadcrumbs = [
        { to: "", text: "Home" },
        { to: "class/attendance", text: title }
    ];

    const [hdr, setHdr] = useState(null);
    const [types, setTypes] = useState([]);
    // const localSchool = secureLocalStorage.getItem('selectedSchool')

    const [tabIndex, setTabIndex] = useState(0)
    const [date, setDate] = useState(dateFormat(new Date()))
    const [dateTitle, setDateTitle] = useState(dateFormat(new Date()) + ' ' + WEEKDAYS_LONG[locale][(new Date()).getDay()])

    const [canLog, setCanLog] = useState(false)
    const [updateView, setUpdateView] = useState(false)

    const [seasonStart, setSeasonStart] = useState(null)
    const [seasonEnd, setSeasonEnd] = useState(null)

    const [students, setStudents] = useState([])
    const [reportStudents, setReportStudents] = useState([])

        const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [showTeacherLogModal, setShowTeacherLogModal] = useState(false)

    const [schoolShifts, setSchoolShifts] = useState([])
    const [selectedShift, setSelectedShift] = useState(null)
    const [selectedTimeTemplate, setSelectedTimeTemplate] = useState(null)
    const [selectedTeacherLog, setSelectedTeacherLog] = useState(null)

    const reportDefaultColumns = [
        {
            dataField: 'avatar',
            text: t('teacher.photo'),
            sort: false,
            align: 'center',
            headerStyle: () => {
                return {
                    width: 100,
                };
            },
            formatter: (cell, row) => 
                <img width={40} height={40}
                            className='img-responsive img-circle'
                            src={cell || '/images/avatar.png'}
                            alt={`Photo of ${row?.firstName}`}
                            onError={(e) => {
                                e.target.onError = null
                                e.target.src = '/images/avatar.png'
                            }}
                />
        },
        {
            dataField: 'code',
            text: t('studentCode'),
            sort: true,
        },
        {
            dataField: 'lastName',
            text: t('studentLastName'),
            sort: true,
        },
        {
            dataField: 'firstName',
            text: t('studentFirstName'),
            sort: true
        },
        {
            dataField: 'total',
            text: t('total'),
            sort: false,
            align: 'right'
        },
        {
            dataField: 'percentage',
            text: '%',
            sort: false,
            align: 'right',
            formatter: (cell) => cell + '%'
        }
    ]

    const [reportColumns, setReportColumns] = useState([])

    const [startDate, setStartDate] = useState(null)
    const [endDate, setEndDate] = useState(null)

    const [totalCount, setTotalCount] = useState(0);
    const [tableData, setTableData] = useState([
        {id: 11, code: 555, firstName: "john", lastName: 'eee'}, 
        {id: 12, code: 333, firstName: "joy", lastName: 'www'}, 
        {id: 13, code: 888, firstName: "julie", lastName: 'Mark'}, 
        {id: 14, code: 77, firstName: "julia", lastName: 'Mike'}, 
    ]);
    const [reportData, setReportData] = useState([
        {id: 11, code: 555, firstName: "john", lastName: 'eee', percentage: '80' }, 
        {id: 12, code: 333, firstName: "joy", lastName: 'www', percentage: '58'}, 
        {id: 13, code: 888, firstName: "julie", lastName: 'Mark', percentage: '90'}, 
        {id: 14, code: 77, firstName: "julia", lastName: 'Mike', percentage: '100'}, 
    ]);

    const config = {
        excelExport: false,
        printButton: false,
        columnButton: false,
        showPagination: false,
        defaultSort: [{
            dataField: 'firstName',
            order: 'asc'
        }]
    }

    const [selectedTableDataId, setSelectedTableDataId] = useState(null)
    const [selectedTabData, setSelectedTabData] = useState(0)

    
   

    // const [tableState, setTableState] = useState(
    //     selectedTabData?.code == 'ACTIVE'
    //         ?
    //         secureLocalStorage.getItem(localeActiveTableState)
    //             ?
    //             secureLocalStorage.getItem(localeActiveTableState)
    //             :
    //             {
    //                 filter: {},
    //                 page: 1,
    //                 pageSize: 10,
    //                 search: '',
    //                 sort: 'firstName',
    //                 order: 'asc'
    //             }
    //         :
    //         selectedTabData?.code == 'QUIT'
    //             ?
    //             secureLocalStorage.getItem(localeQuitTableState)
    //             :
    //             selectedTabData?.code == 'ABSENT'
    //                 ?
    //                 secureLocalStorage.getItem(localeAbsentTableState)
    //                 :
    //                 {
    //                     filter: {},
    //                     page: 1,
    //                     pageSize: 10,
    //                     search: '',
    //                     sort: 'firstName',
    //                     order: 'asc'
    //                 }
    // )
    // const onTypeChange = (rowTypeId = null, isEditing = false) => {
    //     const rowArray = rowTypeId?.split('_');
    //     if (rowArray?.length > 1) {
    //         submitLog({
    //             date,
    //             student: rowArray[0],
    //             type: rowArray[1]
    //         }, isEditing)
    //     }
    // }
     
    const columns = [
        {
            dataField: 'avatar',
            text: t('teacher.photo'),
            sort: false,
            width: 40,
            align: 'center',
            formatter: (cell) => 
                <img className='img-responsive img-circle'
                            src={cell || '/img/profile/placeholder.jpg'}
                            width={40} height={40} alt='profile picture'
                            onError={(e) => {
                                e.target.onError = null
                                e.target.src = '/img/profile/avatar.png'
                            }}
                />
        },
        {
            dataField: 'code',
            text: t('studentCode'),
            sort: true,
        },
        {
            dataField: 'lastName',
            text: t('studentLastName'),
            sort: true
        },
        {
            dataField: 'firstName',
            text: t('studentFirstName'),
            sort: true
        },
        {
            dataField: 'attendanceType',
            text: t('attendance.title'),
            sort: false,
            align: 'center',
            headerStyle: () => {
                return {
                    width: 300,
                };
            },
            formatter: (cell, row) => {
                let button = {}
                return <div className='container'>
                            <div className='row flex-row flex-nowrap px-3' style={{gap: 9}}>
                                <button style={{...baseButton, color: 'rgb(255, 255, 255)', borderColor: 'rgb(62, 191, 163)', backgroundColor: 'rgb(62, 191, 163)'}} type='button' className='br-08'>Т</button>
                                <button style={{...baseButton, color: 'rgb(244, 81, 107)', borderColor: 'rgb(244, 81, 107)', backgroundColor: 'rgb(255, 255, 255)'}} type='button' className='br-08'>Т</button>
                                <button style={{...baseButton, color: 'rgb(155, 155, 155)', borderColor: 'rgb(155, 155, 155)', backgroundColor: 'rgb(255, 255, 255)'}} type='button' className='br-08'>Х</button>
                                <button style={{...baseButton, color: 'rgb(144, 18, 254)', borderColor: 'rgb(144, 18, 254)', backgroundColor: 'rgb(255, 255, 255)'}} type='button' className='br-08'>Ө</button>
                                <button style={{...baseButton, color: 'rgb(255, 108, 0)', borderColor: 'rgb(255, 108, 0)', backgroundColor: 'rgb(255, 255, 255)'}} type='button' className='br-08'>Ч</button>
                            </div>
                        </div>
            }
        },
        // {
        //     dataField: 'attendanceType',
        //     text: t('attendance.title'),
        //     sort: false,
        //     headerStyle: () => {
        //         return {
        //             width: 300,
        //         };
        //     },
        //     formatter: (cell, row) => {
        //         let button = {}
        //         if (hdr) {
        //             if (row?.editing) {
        //                 return (
        //                     <div className='container'>
        //                         <div className='row flex-row flex-nowrap' style={{gap: 9}}>
        //                             {(types || []).map((type, key) => {
        //                                 if (cell == type.id) {
        //                                     button = {
        //                                         color: '#fff',
        //                                         borderColor: type.color,
        //                                         backgroundColor: type.color,
        //                                     }
        //                                 } else {
        //                                     button = {
        //                                         color: type.color,
        //                                         borderColor: type.color,
        //                                         backgroundColor: '#fff',
        //                                     }
        //                                 }
        //                                 return <button
        //                                     onClick={(e) => onTypeChange(row.id + '_' + type.id, row.editing)}
        //                                     style={{...baseButton, ...button}} key={key} className='br-08'
        //                                     type='button'>{type.shortName}</button>
        //                             })
        //                             }
        //                         </div>
        //                     </div>
        //                 )
        //             } else {
        //                 const selectedType = (types || []).find(obj => obj?.id === row?.attendanceType)

        //                 if (selectedType) {
        //                     button = {
        //                         color: '#fff',
        //                         borderColor: selectedType.color,
        //                         backgroundColor: selectedType.color,
        //                     }
        //                     return (
        //                         <div className='container'>
        //                             <div className='row flex-row flex-nowrap' style={{gap: 9}}>
        //                                 <button onClick={(e) => {
        //                                 }}
        //                                         style={{...baseButton, ...button}} className='br-08'
        //                                         type='button'>{selectedType.shortName}</button>
        //                             </div>
        //                         </div>
        //                     )
        //                 } else {
        //                     return null
        //                 }
        //             }
        //         } else {
        //             return (
        //                 <div className='container'>
        //                     <div className='row flex-row flex-nowrap' style={{gap: 9}}>
        //                         {(types || []).map((type, key) => {
        //                             if (cell == type.id) {
        //                                 button = {
        //                                     color: '#fff',
        //                                     borderColor: type.color,
        //                                     backgroundColor: type.color,
        //                                 }
        //                             } else {
        //                                 button = {
        //                                     color: type.color,
        //                                     borderColor: type.color,
        //                                     backgroundColor: '#fff',
        //                                 }
        //                             }
        //                             return <button onClick={(e) => onTypeChange(row.id + '_' + type.id)}
        //                                            style={{...baseButton, ...button}} key={key} className='br-08'
        //                                            type='button'>{type.shortName}</button>
        //                         })
        //                         }
        //                     </div>
        //                 </div>
        //             )
        //         }


        //     }
        // }
        
    ];
    
    // const loadData = (params = {}) => {
    //     setLoading(true)
    //     fetchRequest(classAttendanceInit, 'POST', params)
    //         .then(res => {
    //             if (res.success) {
    //                 if (res?.data?.viewType == 'REPORT') {
    //                     if (!startDate) {
    //                         setStartDate(res?.data?.reportStart)
    //                     }
    //                     if (!endDate) {
    //                         setEndDate(res?.data?.reportEnd)
    //                     }
    //                     setReportStudents(res?.data?.students || [])

    //                     const cols = reportDefaultColumns;
    //                     if (res?.data?.dates && res?.data?.dates?.length > 0) {
    //                         for (let d = 0; d < res?.data?.dates?.length; d++) {
    //                             cols.push({
    //                                 dataField: res?.data?.dates[d],
    //                                 text: res?.data?.dates[d],
    //                                 sort: false,
    //                                 colType: 'html',
    //                                 textValueKey: res?.data?.dates[d] + '_typeName',
    //                                 headerFormatter: (cell) => {
    //                                     return <span style={{
    //                                         width: 60,
    //                                         display: 'block'
    //                                     }}>{res?.data?.dates[d]}</span>
    //                                 },
    //                                 formatter: (cell, row, e, ev) => {
    //                                     if (cell) {
    //                                         let button = {
    //                                             color: '#fff',
    //                                             borderColor: row[res?.data?.dates[d] + '_typeColor'],
    //                                             backgroundColor: row[res?.data?.dates[d] + '_typeColor'],
    //                                         }
    //                                         return (
    //                                             <div className='container'>
    //                                                 <div className='flex-row flex-nowrap' style={{gap: 9}}>
    //                                                     <button onClick={(e) => {
    //                                                     }}
    //                                                             style={{...baseButton, ...button}} className='br-08'
    //                                                             type='button'>{row[(res?.data?.dates[d] + '_typeName')].substring(0, 1)}</button>
    //                                                 </div>
    //                                             </div>
    //                                         )
    //                                     } else {
    //                                         return <div className='container text-center'>
    //                                             <span>-</span>
    //                                         </div>
    //                                     }
    //                                 }
    //                             })
    //                         }
    //                     }
    //                     setReportColumns(cols)
    //                 } else {
    //                     if (!res?.data?.canLog) {
    //                         message(t('attendance.unable_to_log_date')
    //                     }
    //                     setCanLog(res?.data?.canLog || false)
    //                     setSeasonStart(res?.data?.seasonStart || null)
    //                     setSeasonEnd(res?.data?.seasonEnd || null)
    //                     setHdr(res?.data?.hdr)
    //                     setStudents(res?.data?.students || [])
    //                     setTypes(res?.data?.attendanceTypes || [])
    //                     setSchoolShifts(res?.data?.schoolShifts || [])
    //                 }
    //             } else {
    //                 message(res.data.message)
    //             }
    //             setLoading(false)
    //         })
    //         .catch(() => {
    //             message(t('err.error_occurred'))
    //             setLoading(false)
    //         })
    // }

    // const loadTeacherLog = (params = {}) => {
    //     setLoading(true)
    //     fetchRequest(classAttendanceTeacherLog, 'POST', params)
    //         .then(res => {
    //             if (res.success) {
    //                 if (params?.submit) {
    //                     setHdr(res?.data?.hdr)
    //                     setStudents(res?.data?.students || [])
    //                     onCloseTeacherLog()
    //                 } else {
    //                     setSelectedTeacherLog(res?.data?.teacherLog)
    //                 }
    //             } else {
    //                 message(res.data.message)
    //             }
    //             setLoading(false)
    //         })
    //         .catch(() => {
    //             message(t('err.error_occurred'))
    //             setLoading(false)
    //         })
    // }

    // useEffect(() => {
    //     setUpdateView(!updateView)
    // }, [dateTitle])

    // useEffect(() => {
    //     loadData()
    // }, [])
   

    // const submitLog = (params = {}, isEditing = false) => {
    //     setLoading(true)
    //     fetchRequest(classAttendanceLog, 'POST', params)
    //         .then(res => {
    //             if (res.success) {
    //                 const clone = [...students]
    //                 for (let c = 0; c < clone.length; c++) {
    //                     if (clone[c].id === res?.data?.student) {
    //                         clone[c].attendanceType = res?.data?.type;
    //                         break;
    //                     }
    //                 }
    //                 setStudents(clone)
    //                 let hdrObj = res?.data?.hdr
    //                 if (hdrObj) {
    //                     hdrObj.editing = isEditing

    //                     setHdr(hdrObj)
    //                 }
    //             } else {
    //                 message(res.data.message)
    //             }
    //             setLoading(false)
    //         })
    //         .catch((e) => {
    //             message(t('err.error_occurred'))
    //             setLoading(false)
    //         })
    // }

    // const sendLogs = () => {
    //     setLoading(true)
    //     fetchRequest(classAttendanceSend, 'POST', {
    //         date
    //     })
    //         .then(res => {
    //             if (res.success) {
    //                 if (res?.data?.isToday) {
    //                     const element = document.getElementById('btn_class_day_attendance');
    //                     if (element) {
    //                         element.className = "btn pinnacle-regular btn-light-green";
    //                         element.style.border = "solid 1px #3ebfa3";
    //                     }
    //                 }

    //                 setHdr(res?.data?.hdr)
    //                 message(t('success, true'))
    //             } else {
    //                 message(res.data.message)
    //             }
    //             setLoading(false)
    //         })
    //         .catch(() => {
    //             message(t('err.error_occurred'))
    //             setLoading(false)
    //         })
    // }

    // const handleTabChange = data => {
    //     setTabIndex(data?.activeIndex)

    //     loadData({
    //         date,
    //         viewType: data?.activeIndex === 0 ? 'ATTENDANCE' : "REPORT"
    //     })
    // }

    const onDayChange = (day) => {
        let selectedDay = dateFormat(new Date(day));

        let date1 = new Date(selectedDay).getTime();
        let unableToChangeToData = false
        if (seasonStart && seasonEnd) {
            let startDate = new Date(seasonStart).getTime();
            let endDate = new Date(seasonEnd).getTime();

            if (date1 >= startDate && date1 <= endDate) {
                unableToChangeToData = false;
            } else {
                unableToChangeToData = true;
            }
        }

        setDate(selectedDay)
        setDateTitle(selectedDay + ' ' + WEEKDAYS_LONG[locale][(new Date(day)).getDay()])

        if (unableToChangeToData) {
            setCanLog(false)
            message(t('attendance.unable_to_log_date'))
        } else {
            // loadData({
            //     date: selectedDay
            // })
        }
    }

    const reportConfig = {
        excelExport: true,
        excelFileName: `${localSchool?.classes?.find(el => el?.value == secureLocalStorage.getItem('selectedClassId'))?.text}-${t('class.attendance.title')}`,
        printButton: false,
        showAllData: true,
        showPagination: false,
        defaultSort: [{
            dataField: 'firstName',
            order: 'asc'
        }]
    }

    const getConfig = (hasHdr = false, ableToLog = false) => {       
        if (hasHdr) {
            return {
                excelExport: false,
                printButton: false,
                showAllData: true,
                showPagination: false,
                showLeftButton: false,
                showLeftText: true,
                leftText: (hdr?.teacherLog ? (t('attendance.download_timetable') + ' (' + hdr?.teacherLog + ') ') : '') + t('attendance.sent_time') + ': ' + hdr?.createdUser,
                leftTextStyle: {fontSize: 16, whiteSpace: 'nowrap', fontFamily: 'PinnacleRegular'},
                defaultSort: [{
                    dataField: 'firstName',
                    order: 'asc'
                }]
            }
        } else {
            return {
                excelExport: false,
                printButton: false,
                showAllData: true,
                showPagination: false,
                showLeftButton: true,
                leftButtonStyle: {position: 'relative', paddind: '0 0 10 0' ,bottom: '5px'},
                leftButtonClassName: 'btn btn-sm m-btn--pill btn-publish m-btn--uppercase m-btn--wide mr-2 d-inline-flex',
                leftButtonText: t('attendance.sent_attendance'),

                showSecondaryLeftButton: true,
                secondaryLeftButtonStyle: {position: 'relative', bottom: '5px'},
                secondaryLeftButtonClassName: 'btn btn-sm m-btn--pill btn-secondary-left m-btn--uppercase m-btn--wide d-inline-flex',
                secondaryLeftButtonText: t('attendance.download_attendance'),

                defaultSort: [{
                    dataField: 'firstName',
                    order: 'asc'
                }]
            }
        }
    }

    // const submitDelete = () => {
    //     setLoading(true)
    //     fetchRequest(classAttendanceDelete, 'POST', {
    //         date
    //     })
    //         .then(res => {
    //             if (res.success) {
    //                 const clone = [...students]

    //                 let cameTypeId = null;
    //                 for (let t = 0; t < types?.length; t++) {
    //                     if (types[t].code?.toUpperCase() === 'CAME') {
    //                         cameTypeId = types[t].id;
    //                         break;
    //                     }
    //                 }
    //                 for (let c = 0; c < clone.length; c++) {
    //                     clone[c].attendanceType = cameTypeId;
    //                     clone[c].editing = true;
    //                 }
    //                 setHdr(null)
    //                 setStudents(clone)
    //                 setShowDeleteModal(false)
    //                 message(t('success, true')
    //             } else {
    //                 message(res.data.message)
    //             }
    //             setLoading(false)
    //         })
    //         .catch(() => {
    //             message(t('err.error_occurred'))
    //             setLoading(false)
    //         })
    // }

    // const onCloseTeacherLog = () => {
    //     setSelectedShift(null)
    //     setSelectedTeacherLog(null)
    //     setShowTeacherLogModal(false)
    // }

    const clearDateRange = () => {
        setStartDate(null)
        setEndDate(null)
    }

    const dateRangeChange = (type, date) => {
        let selectedDay = dateFormat(new Date(date));

        let start = null;
        let end = null;
        if (type === 'start') {
            start = selectedDay;
            end = endDate;
            setStartDate(selectedDay);
                       
        } else if (type === 'end') {
            start = startDate;
            end = selectedDay;
            setEndDate(selectedDay);
        }
    }

    const closeModal = () => {
        // setShowAddTeacherModal(false)
        // setShowEditTeacherModal(false)
        // setShowDeleteModal(false)
        // setShowViewModal(false)
        // setShowDeleteModal(false)
        // setStatusChangeModal(false)
        setSelectedTableDataId(null)
        // setShowRoleChangeModal(false)
        // setShowInfoChangeModal(false)
        // setShowPasswordResetModal(false)
        // setShowLoginNameChangeModal(false)
    }

    const onCloseTeacherLog = () => {
        setShowTeacherLogModal(false)
    }

    const submitDownloadAttendance = () => {
        const tTemplate = (schoolShifts.find(obj => obj.id === selectedShift)?.timeTemplates || []).find(obj => obj.id === selectedTimeTemplate)
        if (tTemplate) {
            loadTeacherLog({
                date,
                submit: 1,
                shift: selectedShift,
                start: tTemplate?.start,
                end: tTemplate?.end,
            })
        }
    }

  
    
    const handleTabChange = (e, data) => {
        console.log( e, data.activeIndex)
        setSelectedTabData(data.activeIndex)
        // setSelectedTabData({...data?.panes?.[data?.activeIndex]})
        // secureLocalStorage.setItem(localeSelectedTab, data?.panes?.[data?.activeIndex])

        // let selectedTableState = null;
        // if (data?.panes?.[data?.activeIndex] && data?.panes?.[data?.activeIndex]?.code == 'ACTIVE') {
        //     setTableState(secureLocalStorage.getItem(localeActiveTableState))
        //     selectedTableState = secureLocalStorage.getItem(localeActiveTableState)
        // } else if (data?.panes?.[data?.activeIndex]?.code == 'QUIT') {
        //     setTableState(secureLocalStorage.getItem(localeQuitTableState))
        //     selectedTableState = secureLocalStorage.getItem(localeQuitTableState)
        // } else if (data?.panes?.[data?.activeIndex]?.code == 'ABSENT') {
        //     setTableState(secureLocalStorage.getItem(localeAbsentTableState))
        //     selectedTableState = secureLocalStorage.getItem(localeAbsentTableState)
        // }

        // init(selectedTableState, selectedTreeDataId, data?.panes?.[data?.activeIndex]?.code)
    }

    

    

    // useEffect(() => { ROOT CODE
    //     if (selectedTabData == 0) {
    //         tableData?.forEach(el => {
    //             el.contextMenuKeys = 'view, edit, delete, statusChange, loginNameChange, passwordReset, roleChange, infoChange'
    //         })
    //         setColumns(activeColumns)
    //         setContextMenus(activeContextMenus)
    //     } else {
    //         if (selectedTabData === 1) {
    //             tableData?.forEach(el => {
    //                 el.contextMenuKeys = 'view, statusChange'
    //             })
    //         } 
    //         // setColumns(otherColumns)
    //         // setContextMenus(otherContextMenus)
    //     }
    // }, [selectedTabData, tableData])

    // useEffect(() => {
    //     if (treeData.length && !selectedTreeDataId.length) {
    //         setSelectedTreeDataId(treeData?.[0]?.key)
    //     }
    // }, [treeData])

    // useEffect(() => {
    //     if (tabData.length && !selectedTabData?.id) {
    //         setSelectedTabData(tabData?.[0])

    //         tabData.forEach(element => {
    //             if (element.code == 'ACTIVE') {
    //                 if (!secureLocalStorage.getItem(localeActiveTableState)) {
    //                     secureLocalStorage.setItem(localeActiveTableState, {
    //                             filter: {},
    //                             page: 1,
    //                             pageSize: 10,
    //                             search: '',
    //                             sort: 'firstName',
    //                             order: 'asc'
    //                         }
    //                     )
    //                 }
    //             } else if (element.code == 'QUIT') {
    //                 if (!secureLocalStorage.getItem(localeQuitTableState)) {
    //                     secureLocalStorage.setItem(localeQuitTableState, {
    //                             filter: {},
    //                             page: 1,
    //                             pageSize: 10,
    //                             search: '',
    //                             sort: 'firstName',
    //                             order: 'asc'
    //                         }
    //                     )
    //                 }
    //             } else if (element.code == 'ABSENT') {
    //                 if (!secureLocalStorage.getItem(localeAbsentTableState)) {
    //                     secureLocalStorage.setItem(localeAbsentTableState, {
    //                             filter: {},
    //                             page: 1,
    //                             pageSize: 10,
    //                             search: '',
    //                             sort: 'firstName',
    //                             order: 'asc'
    //                         }
    //                     )
    //                 }
    //             }
    //         });
    //     }
    // }, [tabData])

    // const init = (pagination, gradeId, statusCode) => {
    //     setLoading(true)
    //     fetchRequest(schoolTeacherInit, 'POST', {
    //         status: statusCode,
    //         grade: gradeId,
    //         filter: pagination?.filter,
    //         order: pagination?.order,
    //         sort: pagination?.sort,
    //         page: pagination?.page,
    //         pageSize: pagination?.pageSize,
    //         search: pagination?.search,
    //     })
    //         .then((res) => {
    //             if (res.success) {
    //                 const {teachers, statuses, grades, totalCount} = res.data
    //                 setTreeData(grades || [])
    //                 setTableData(teachers || [])
    //                 setTabData(statuses?.map((el, index) => ({
    //                     index: index,
    //                     menuItem: el.name,
    //                     code: el.code,
    //                     id: el.id
    //                 })) || [])
    //                 setTotalCount(totalCount || 0)
    //                 if (!firstRender) setLoading(false)
    //             } else {
    //                 message(res.data.message)
    //             }
    //             setLoading(false)
    //         })
    //         .catch(() => {
    //             message(t('err.error_occurred'))
    //             setLoading(false)
    //         })
    // }

    

    return (
        <>
            <HtmlHead title={title} description={description} />

            <div className="page-title-container mb-2">
                <Col md="7" className='p-0'>
                    <h1 className="mb-0 pb-0 display-4 relative">{title}</h1>
                    <BreadcrumbList items={breadcrumbs} />
                </Col>
            </div>

            <div className='m-content'>
                <Row className=''>
                    <Col xl="12" xxl="12">
                        <div className='m-portlet tab br-12'>
                            <div className=''>
                                <Tab
                                    menu={{secondary: true, pointing: true, className: 'primaryColor m-0 h-4'}}
                                    onTabChange={(e, data) => handleTabChange(e, data)}
                                    className='m-portlet-header'
                                    panes={[
                                        {
                                            menuItem: t('class.attendance.log'),
                                            render: () => (
                                                <div className='m-portlet__body'>
                                                    <div className="d-flex align-items-center justify-content-start mb-5 mt-4">
                                                        <a href="#" style={{color: 'black'}} onClick={() => {
                                                            let selectedDay = date.substring(0, 10);
                                                            let selectedDate = new Date(selectedDay);
                                                            selectedDate.setDate(selectedDate.getDate() - 1);
                                                            onDayChange(dateFormat(selectedDate))
                                                        }}
                                                        className="d-flex align-items-center justify-content-center no-decoration">
                                                            <i className='la la-angle-left'/>
                                                        </a>
                                                        <div className="col-auto p-0 text-center pl-1">
                                                            <DayPickerInput
                                                                onDayChange={onDayChange}
                                                                value={dateTitle}
                                                                hideOnDayClick={true}
                                                                inputProps={{readOnly: true}}
                                                                placeholder={dateTitle}
                                                                dayPickerProps={{
                                                                    disabledDays: seasonStart && seasonEnd
                                                                        ? {
                                                                            before: new Date(seasonStart),
                                                                            after: new Date(seasonEnd)
                                                                        }
                                                                        :
                                                                        {}
                                                                }}
                                                                classNames={{
                                                                    overlay: 'DayPickerInputOverlay',
                                                                    container: 'myToday-DayPicker'
                                                                }}
                                                            />
                                                        </div>
                                                        <a href="#" style={{color: 'black'}} onClick={() => {
                                                            let selectedDay = date.substring(0, 10);
                                                            let selectedDate = new Date(selectedDay);
                                                            selectedDate.setDate(selectedDate.getDate() + 1);
                                                            onDayChange(dateFormat(selectedDate))
                                                        }}
                                                        className="d-flex align-items-center justify-content-center no-decoration">
                                                            <i className='la la-angle-right'/>
                                                        </a>
                                                </div>
                                            {/* {
                                                hdr && hdr?.reports && hdr?.reports?.length > 0 &&
                                                <div className={'text-right'} style={{flex: 1}}>
                                                    <Button
                                                    onClick={() => {
                                                            let clone = cloneDeep(hdr)
                                                            clone.editing = !clone.editing;
                                                            setHdr(clone)

                                                            const rows = [...students]
                                                            for (let st = 0; st < rows?.length; st++) {
                                                                rows[st].editing = clone.editing
                                                            }
                                                            setStudents(rows)

                                                            // if (!clone.editing) {
                                                            //     message(t('success, true')
                                                            // }
                                                            setShowTeacherLogModal(true)
                                                        }}
                                                                className={'btn btn-sm m-btn--pill btn-info m-btn--uppercase d-inline-flex mb-3' + (hdr?.editing ? 'btn-success' : 'btn-primary')}
                                                            >
                                                        {hdr?.editing ? t('save') : t('attendance.edit_attendance')}
                                                        {t('attendance.download_attendance')}
                                                    </Button>
                                                </div>
                                            } */}
                                                    <DTable
                                                        remote
                                                        config={getConfig((hdr?.id, canLog))}
                                                        // config={config}
                                                        selectMode={'radio'}
                                                        locale={locale}
                                                        data={tableData}
                                                        columns={columns}
                                                        onLeftButtonClick={() => sendLogs()}
                                                            onSecondaryLeftButtonClick={() => {
                                                                setShowTeacherLogModal(true)
                                                            }}
                                                    />
                                                    {/* <DTable
                                                            config={getConfig(hdr?.id, canLog)}
                                                            selectMode={'radio'}
                                                            columns={columns}
                                                            data={students}
                                                            onLeftButtonClick={() => sendLogs()}
                                                            onSecondaryLeftButtonClick={() => {
                                                                setShowTeacherLogModal(true)
                                                            }}
                                                            locale={locale}
                                                         /> */}
                                                </div>
                                            )

                                        },
                                        {
                                            menuItem: t('class.attendance.report'),
                                            render: () => (
                                                <div className='m-portlet__body'>
                                                <div className='d-flex justify-content-center'>
                                                    <div className={"text-right mr-4"}>
                                                        <label
                                                            className="col-form-label text-right label-pinnacle-bold">
                                                            {t('date')}
                                                        </label>
                                                    </div>
                                                    <DayPickerInput
                                                        onDayChange={(e) => dateRangeChange('start', e)}
                                                        style={{
                                                            width: 160
                                                        }}
                                                        // value={startDate}
                                                        hideOnDayClick={true}
                                                        inputProps={{className: 'form-control'}}
                                                        placeholder={t('err.select_date')}
                                                        dayPickerProps={{
                                                            disabledDays: seasonStart && seasonEnd
                                                                ? {
                                                                    before: new Date(seasonStart),
                                                                    after: new Date(seasonEnd)
                                                                }
                                                                :
                                                                {
                                                                    // before: new Date(startDate),
                                                                    // after: FormData(new Date()) 
                                                                }
                                                        }}
                                                        classNames={{
                                                            overlay: 'DayPickerInputOverlay',
                                                            container: 'position-relative'
                                                        }}
                                                    />
                                                    <div className="pickerSeparator"
                                                         style={{cursor: 'pointer',
                                                             padding: '8px 13px 2px',
                                                             lineHeight: '1em'}}
                                                         onClick={clearDateRange}>
                                                        <i className="la la-ellipsis-h"/>
                                                    </div>
                                                    <DayPickerInput
                                                        onDayChange={(e) => dateRangeChange('end', e)}
                                                        // value={endDate}
                                                        hideOnDayClick={true}
                                                        inputProps={{className: 'form-control'}}
                                                        placeholder={t('err.select_date')}
                                                        dayPickerProps={{
                                                            disabledDays: seasonStart && seasonEnd
                                                                ? {
                                                                    before: new Date(seasonStart),
                                                                    after: new Date(seasonEnd)
                                                                }
                                                                :
                                                                { 
                                                                    before: new Date(startDate),
                                                                    after: new Date(date)                                                                    
                                                                }
                                                        }}
                                                        classNames={{
                                                            overlay: 'DayPickerInputOverlay',
                                                            container: 'position-relative'
                                                        }}
                                                    />
                                                    <div
                                                        className="actions justify-content-center d-flex align-items-center ml-4">
                                                        <Button
                                                            className='btn btn-sm m-btn--pill m-btn--uppercase d-inline-flex'
                                                            style={{
                                                                borderRadius: '10px',
                                                                backgroundColor: '#41c5dc',
                                                                color: 'white',
                                                                borderColor: '#41c5dc'
                                                            }}
                                                            onClick={() => {
                                                                if (startDate && endDate) {
                                                                    loadData({
                                                                        start: startDate,
                                                                        end: endDate,
                                                                        viewType: 'REPORT'
                                                                    })
                                                                } else {
                                                                    message(t('err.select_date'))
                                                                }
                                                            }}
                                                        >
                                                                <TimelineIcon className='d-flex' style={{
                                                                    marginLeft: '0.5rem',
                                                                    marginRight: '0.5rem',
                                                                    padding: '0px'
                                                                }}/>
                                                                <span style={{
                                                                    marginLeft: '0.5rem',
                                                                    marginRight: '0.5rem'
                                                                }}>{t('view')}</span>
                                                        </Button>
                                                    </div>
                                                    
                                                </div>
                                                    <DTable
                                                        remote
                                                        config={reportConfig}
                                                        selectMode={'radio'}
                                                        columns={reportDefaultColumns}
                                                        // data={reportData}
                                                        locale={locale}
                                                    />
                                            
                                                </div>                                               
                                            )
                                        }
                                    ]}
                                />
                            </div>
                        </div>
                    </Col>
                </Row>
            </div>
            {
                showTeacherLogModal &&
                <DownloadAttendanceModal
                    selectedShift={selectedShift}
                    setSelectedShift={setSelectedShift}
                    schoolShifts={schoolShifts}
                    setSchoolShifts={setSchoolShifts}
                    selectedTimeTemplate={selectedTimeTemplate}
                    setSelectedTimeTemplate={setSelectedTimeTemplate}
                    onClose={onCloseTeacherLog}
                    onSubmit={submitDownloadAttendance}
                />
            }
            {
                loading &&
                <>
                    <div className='loader-container'>
                        <svg className="splash-spinner" viewBox="0 0 50 50">
                            <circle className="path" cx="25" cy="25" r="20" fill="none" strokeWidth="5" />
                        </svg>
                    </div>
                </>
            }
        </>
    )

    
}

export default index