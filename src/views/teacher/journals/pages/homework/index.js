import message from 'modules/message'
import React, { useEffect, useRef, useState } from 'react'
import DTable from 'modules/DataTable/DTable'
import secureLocalStorage from 'react-secure-storage'
import { Modal as NModal } from 'react-bootstrap'
import { fetchRequest } from 'utils/fetchRequest'
import { translations } from 'utils/translations'
// import { useLocation, useNavigate } from 'react-router'
import { dummyTableDataStudent } from './components/StudentTable/byStudentData'
import { Modal, Tab } from 'semantic-ui-react'
import InfoModal from './components/infoModal'
import StudentModal from './StudentModal/StudentModal'
import StatusModal from './StatusModal/StatusModal'
import IconComplete from './components/icons/Complete'
import IconIncomplete from './components/icons/Incomplete'
import IconMissing from './components/icons/Missing'
import Description from './components/description'
// import { 
//     teacherJournalHomeworkInit, 
//     teacherJournalHomework, 
//     teacherJournalHomeworkDetailView, 
//     teacherHomeworkSave, 
//     teacherHomeworkDelete, 
//     teacherHomeworkStudentDetailSubmit, 
//     teacherHomeworkStudentDetailRemove, 
//     teacherHomeworkSend, 
//     teacherJournalHomeworkStudentHomeworksView, 
//     teacherJournalHomeworkStudentHomeworkDetailView,
//     settingsSchoolScoreTemplateDelete
// } from 'utils/url'
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { dateFormat, hexToRgb, htmlDecode, isLargerFile } from 'utils/Util'
import DayPickerInput from 'react-day-picker/DayPickerInput';

const locale = secureLocalStorage?.getItem('selectedLang') || 'mn'

const WEEKDAYS_LONG = {
    mn: {
        1: 'Даваа ',
        2: 'Мягмар',
        3: 'Лхагва',
        4: 'Пүрэв',
        5: 'Баасан',
        6: 'Бямба',
        7: 'Ням',
    },
    en: {
        1: 'Monday',
        2: 'Tuesday',
        3: 'Wednesday',
        4: 'Thursday',
        5: 'Friday',
        6: 'Saturday',
        7: 'Sunday',
    },
    ru: {
        1: 'Понедельник',
        2: 'Вторник',
        3: 'Среда',
        4: 'Четверг',
        5: 'Пятница',
        6: 'Суббота',
        7: 'Воскресенье',
    }
};

const HomeworkModal = ({onClose, data}) => {
    // const location = useLocation()
    // const navigate = useNavigate()

    const fileUploader = useRef();

    const [loading, setLoading] = useState(false)
    const [showInfoModal, setShowInfoModal] = useState(false)
    const [showStudentModal, setShowStudentModal] = useState(false)
    const [showStatusModal, setShowStatusModal] = useState(false)
    const [homeworkModal, setHomeworkModal] = useState(false)
    const [deleteHomeworkModalShow, setDeleteHomeworkModalShow] = useState(false)
    const [deleteHomeworkDetailModalShow, setDeleteHomeworkDetailModalShow] = useState(false)
    const [studentHomeworkDetailModal, setStudentHomeworkDetailModal] = useState(false)
    const [studentHomeworksModal, setStudentHomeworksModal] = useState(false)

    const [selectedDate, setSelectedDate] = useState()
    const [selectedStudent, setSelectedStudent] = useState()
    const [selectedStatus, setSelectedStatus] = useState()
    const [groupInfo, setGroupInfo] = useState(null)
    const [homeworkInfo, setHomeworkInfo] = useState(null)
    const [homeworkDetail, setHomeworkDetail] = useState(null)
    const [selectedGroupId, setSelectedGroupId] = useState(null)
    const [selectedAssignDate, setSelectedAssignDate] = useState(null)
    const [homeworkCalendarDays, setHomeworkCalendarDays] = useState(null)
    const [inputViewOrEdit, setInputViewOrEdit] = useState('view')
    const [deleteHomeworkDetailStudentId, setDeleteHomeworkDetailStudentId] = useState(null)
    const [selectedTabData, setSelectedTabData] = useState(null)
    const [studentHomeworks, setStudentHomeworks] = useState(null)
    const [studentInfo, setStudentInfo] = useState(null)

    const [columns, setColumns] = useState([])
    const [byDayData, setByDayData] = useState([])
    const [byStudentData, setByStudentData] = useState([])
    const [homeworkStudents, setHomeworkStudents] = useState([])
    const [homeworkTypes, setHomeworkTypes] = useState([])
    const [homeworkReport, setHomeworkReport] = useState([])
    const [newFiles, setNewFiles] = useState([])
    const [removedFiles, setRemovedFiles] = useState([])

    const [editHomeworkInfo, setEditHomeworkInfo] = useState(null)
    
    const [homeworkConfig, setHomeworkConfig] = useState(null);

    const homeworkDefaultConfig = {
        showAllData: true,
        showPagination: false,
        showLeftButton: true,
        leftButtonClassName: 'btn m-btn--pill btn-publish m-btn--uppercase m-btn--wide',
        leftButtonText: translations(locale).send,
        defaultSort: [{
            dataField: 'firstName',
            order: 'asc'
        }]
    }

    const homeworkColumns = [
        {
            dataField: "avatar",
            text: translations(locale).photo || "",
            align: "center",
            headerStyle: () => ({
                width: 80
            }),
            style: {
                verticalAlign: 'middle',
                padding: '0.25rem',
            },
            formatter: (cell, row) => {
                return <img className='img-responsive img-circle' src={cell || '/images/avatar.png'} width={40} height={40} alt={row.firstName} />
            }
        },
        {
            dataField: "studentCode",
            text: translations(locale).code || "",
            sort: true
        },
        {
            dataField: "lastName",
            text: translations(locale).studentLastName || "",
            sort: true,
        },
        {
            dataField: "firstName",
            text: translations(locale).studentFirstName || "",
            sort: true,
        },
        {
            dataField: "takenScore",
            text: translations(locale).homeworkReport.score || "",
            headerStyle: () => ({
                width: 150
            }),
            style: {
                verticalAlign: 'middle',
                padding: '0.25rem',
            },
            formatter: (cell, row) => {
                return (
                    <>
                        <input
                            onBlur={(e) => homeworkNumericInputChange(e, row.id)}
                            disabled={row.isDisabled} required type='number' min={0} max={100}
                            className='form-control' defaultValue={cell} list="defaultScores" />
                        <datalist id="defaultScores">
                            <option value="10" />
                            <option value="20" />
                            <option value="30" />
                            <option value="40" />
                            <option value="50" />
                            <option value="60" />
                            <option value="80" />
                            <option value="90" />
                            <option value="100" />
                        </datalist>
                    </>
                )
            }
        },
        {
            dataField: "radioTypeId",
            text: translations(locale).homeworkReport.homework || "",
            headerStyle: () => ({
                width: 131
            }),
            style: {
                verticalAlign: 'middle',
                padding: '0.25rem',
            },
            formatter: (cell, row) => {
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

                let button = {}

                return (
                    <div className='container'>
                        <div className='row flex-row flex-nowrap' style={{ gap: 9 }}>
                            {
                                homeworkTypes.map((type, key) => {
                                    if (cell == type.id) {
                                        button = {
                                            color: '#fff',
                                            borderColor: type.color,
                                            backgroundColor: type.color,
                                        }
                                    } else {
                                        button = {
                                            color: type.color,
                                            borderColor: type.color,
                                            backgroundColor: '#fff',
                                        }
                                    }
                                    return <button onClick={(e) => homeworkRadioChange(row.id + '_' + type.id)} style={{ ...baseButton, ...button }} key={key} className='br-08' type='button'>{type.shortName}</button>
                                })
                            }
                        </div>
                    </div >
                )
            }
        },
        {
            dataField: "comment",
            text: translations(locale).description || "",
            headerStyle: () => ({
                width: 250
            }),
            style: {
                verticalAlign: 'middle',
                padding: '0.25rem',
            },
            formatter: (cell, row) => {
                return <input onBlur={(e) => homeworkInlineEditChange(e.target.value, row.id)} type='text' className='form-control' defaultValue={cell} />

            }
        },
    ];

    const homeworkRadioChange = (value) => {
        if (value) {
            let studentHwTypeArray = value.split('_');

            if (studentHwTypeArray && studentHwTypeArray.length > 1) {
                let students = homeworkStudents;
                const score = homeworkInfo ? homeworkInfo.totalScore : null;
                var studentObj = students.filter(obj => {
                    return parseInt(obj.id) === parseInt(studentHwTypeArray[0])
                });

                if (studentObj && studentObj.length === 1) {
                    let selectedTypeId = parseInt(studentHwTypeArray[1]);

                    studentObj[0]['radioTypeId'] = selectedTypeId;
                    if (selectedTypeId) {
                        studentObj[0]['checkable'] = true;
                        studentObj[0]['isAuto'] = false;
                    }

                    const selectedType = homeworkTypes.find(type => type.id.toString() === selectedTypeId.toString());

                    if (selectedType && selectedType.maxPercentage && !isNaN(selectedType.maxPercentage)) {
                        studentObj[0]['takenScore'] = Number(score) * Number(selectedType.maxPercentage) / 100;
                    }

                    studentObj[0]['numericEditClassName'] = '';

                    const bodyParams = {
                        homework: homeworkInfo.id,
                        student: studentObj[0].id,
                        type: selectedTypeId,
                        comment: studentObj[0].comment,
                        score: studentObj[0]['takenScore']
                    };

                    studentDetailSubmit(bodyParams)
                }
            }
        }
    }
    
    const byDayColumns = [
        {
            dataField: 'assignDate',
            text: translations(locale)?.homework?.assign_date,
            sort: true,
            formatter: (cell, row) => {
                return (
                    <>
                        <span className="underline" onClick={() => dateClickHandler(row)}>{cell}</span>
                    </>
                )
            },
            align: "right",
        },
        {
            dataField: 'dueDate',
            text: translations(locale)?.homework?.homework_due_date,
            sort: true,
            align: "right",
        },
        {
            dataField: 'createdDate',
            text: translations(locale)?.created_date,
            sort: true,
            align: "right",
        },
        {
            dataField: 'total',
            text: translations(locale)?.totalStudent,
            sort: true,
            align: "right",
        }
    ]

    const byStudentColumns = [
        {
            dataField: "className",
            text: translations(locale).homeworkDashboardDtClass.class_name || "",
            width: 100,
            align: "left",
            sort: true,
        },
        {
            dataField: "studentCode",
            text: translations(locale).studentCode || "",
            width: 100,
            align: "left",
            sort: true,
        },
        {
            dataField: "lastName",
            text: translations(locale).studentLastName || "",
            width: 120,
            align: "left",
            sort: true,
        },
        {
            dataField: "firstName",
            text: translations(locale).studentFirstName || "",
            width: 120,
            align: "left",
            sort: true,
        },
        {
            dataField: "totalCount",
            text: translations(locale).total || "",
            width: 70,
            align: "right",
            sort: true,
            formatter: (cell, row) => <span className='underline' onClick={() => _handleHomeworkCountClick('totalCount', row)}>{cell}</span>
        },
        {
            dataField: "checkedCount",
            text: translations(locale).homework.checkedHomework || "",
            width: 70,
            align: "right",
            sort: true,
            formatter: (cell, row) => <span className='underline' onClick={() => _handleHomeworkCountClick('checked', row)}>{cell}</span>
        }
    ];
    
    const dates = {
        startDate: new Date(new Date().setDate(new Date().getDate() - 7)).toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0],
    }

    const config = {
        excelExport: true,
        showAllData: true,
        showPagination: false,
        defaultSort: [{ dataField: 'studentFirstName', order: 'asc' }],
        excelFileName: `${secureLocalStorage.getItem('selectedSchool')?.text}-${translations(locale)?.homework?.title}`,
    }

    // useEffect(() => {
    //     if (!location?.state?.group || !location?.state?.season) {
    //         message(translations(locale)?.group?.group_not_found)
    //         navigate('/teacher/journals', { replace: true })
    //     }
    //     init()
    // }, [])

    const init = (tabName) => {
        console.log('init')
        // setLoading(true)
        // fetchRequest(teacherJournalHomework, 'POST', { 
        //     ...dates, 
        //     group: location?.state?.group, 
        //     season: location?.state?.season,
        //     tab: tabName || null
        // })
        //     .then((res) => {
        //         if (res.success) {
        //             setGroupInfo(res?.data?.groupInfo || null)
        //             setByDayData(res?.data?.by_day_homework_lists || [])
        //             let homeworkTypes = res?.data?.homeworkTypes || [];
        //             let dateRange = res?.data?.dateRange || [];

        //             let newColumns = [];
        //             if(res.data.tabName == 'by_day')
        //             {
        //                 if (homeworkTypes) {
        //                     for (let i = 0; i < homeworkTypes.length; i++) {
        //                         let hwType = homeworkTypes[i];
        //                         newColumns.push({
        //                             dataField: "type_" + hwType.id,
        //                             text: hwType.name,
        //                             width: 30,
        //                             align: "right",
        //                             sort: true,
        //                         })
        //                     }
        //                 }

        //                 newColumns.push({
        //                     dataField: "notCheckedCount",
        //                     text: translations(locale).homeworkReport.notChecked || "",
        //                     width: 30,
        //                     align: "right",
        //                     sort: true,
        //                 });

        //                 setColumns([...byDayColumns, ...newColumns])
        //             }
        //             else if(res.data.tabName == 'by_student')
        //             {
        //                 if(homeworkTypes && homeworkTypes.length > 0)
        //                 {
        //                     for (let i = 0; i < homeworkTypes.length; i++) {
        //                         newColumns.push({
        //                             dataField: 'type_' + homeworkTypes[i].id,
        //                             text: homeworkTypes[i].shortName,
        //                             width: 50,
        //                             align: "right",
        //                             sort: true,
        //                         })
        //                     }
        //                 }

        //                 if(dateRange && dateRange.length > 0)
        //                 {
        //                     for (let i = 0; i < dateRange.length; i++) {
        //                         if(dateRange[i].view){
        //                             newColumns.push({
        //                                 dataField: dateRange[i].date,
        //                                 text: dateRange[i].date,
        //                                 className: 'rotate90-container',
        //                                 width: 100,
        //                                 align: "right",
        //                                 sort: false,
        //                                 headerFormatter: () => <span className='underline' onClick={() => _handleHomeworkDateClick(dateRange[i].date)}>{dateRange[i].date}</span>
        //                             })
        //                         } else {
        //                             newColumns.push({
        //                                 dataField: dateRange[i].date,
        //                                 text: dateRange[i].date,
        //                                 className: 'rotate90-container',
        //                                 width: 100,
        //                                 align: "right",
        //                                 sort: false,
        //                                 padding: 3
        //                             })
        //                         }
        //                     }
        //                 }

        //                 let byStudentHomework = res.data.by_student_homework_lists;

        //                 if(byStudentHomework && byStudentHomework.length > 0){
        //                     for (let i = 0; i < byStudentHomework.length; i++)
        //                     {
        //                         let report = byStudentHomework[i];
        //                         let dateFound = false;
        //                         let html = '';
        //                         let clickableCell = false;
        //                         for (let d = 0; d < dateRange.length; d++) {
        //                             let dateString = dateRange[d].date;
        //                             if (dateString in report) {
        //                                 dateFound = true;
        //                                 if (report[dateString].typeId) {
        //                                     let hwTypeSelected = null;

        //                                     for (let t = 0; t < homeworkTypes.length; t++) {
        //                                         if (report[dateString].typeId === homeworkTypes[t].id) {
        //                                             hwTypeSelected = homeworkTypes[t];
        //                                             break;
        //                                         }
        //                                     }

        //                                     if (hwTypeSelected) {
        //                                         var multipleHtml = <div
        //                                             onClick={() => _handleHomeworkTypeClick(dateString, byStudentHomework[i].id)}
        //                                             data={hwTypeSelected.shortName}
        //                                             className="ui checked radio checkbox"
        //                                             style={{
        //                                                 color: 'white',
        //                                                 backgroundColor: hwTypeSelected.color,
        //                                                 border: '1px solid ' + hwTypeSelected.color,
        //                                                 boxShadow: 'rgba(' + hexToRgb(hwTypeSelected.color).r + ', ' + hexToRgb(hwTypeSelected.color).g + ', ' + hexToRgb(hwTypeSelected.color).b + ', 0.19) 0px 5px 10px 2px',
        //                                                 width: 35,
        //                                                 height: 35,
        //                                                 borderRadius: '25%',
        //                                                 display: 'flex'
        //                                             }} dangerouslySetInnerHTML={{
        //                                             __html: '<span style="margin: auto; align-self: center">' + hwTypeSelected.shortName + '</span>'
        //                                         }}></div>;

        //                                         var singleHtml = <div className="ui checked radio checkbox"
        //                                             onClick={() => _handleHomeworkTypeClick(dateString, byStudentHomework[i].id)}
        //                                             data={hwTypeSelected.shortName}
        //                                             style={{
        //                                                 color: hwTypeSelected.color,
        //                                                 backgroundColor: 'white',
        //                                                 border: '1px solid ' + hwTypeSelected.color,
        //                                                 boxShadow: 'rgba(' + hexToRgb(hwTypeSelected.color).r + ', ' + hexToRgb(hwTypeSelected.color).g + ', ' + hexToRgb(hwTypeSelected.color).b + ', 0.19) 0px 5px 10px 2px',
        //                                                 width: 35,
        //                                                 height: 35,
        //                                                 borderRadius: '25%',
        //                                                 display: 'flex'
        //                                             }}
        //                                             dangerouslySetInnerHTML={{
        //                                                 __html: '<span style="margin: auto; align-self: center">' + hwTypeSelected.shortName + '</span>'
        //                                             }}></div>;

        //                                         html = report[dateString].multiple ? multipleHtml : singleHtml;
        //                                         clickableCell = true;
        //                                     } else {
        //                                         html = report[dateString].homework ? '-' : '';
        //                                     }
        //                                 } else {
        //                                     html = report[dateString].homework ? '-' : '';
        //                                 }
        //                                 report[dateString] = html;
        //                             }
        //                         }

        //                         report.clickable = clickableCell;
        //                     }
        //                 }

        //                 setByStudentData(byStudentHomework)
        //                 setColumns([...byStudentColumns, ...newColumns])
        //             }
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

    const studentDetailSubmit = (bodyParams) => {
        console.log('studentDetailSubmit')
        // setLoading(true)
        // fetchRequest(teacherHomeworkStudentDetailSubmit, 'POST', bodyParams)
        //     .then((res) => {
        //         if (res.success) {
        //             let reports = res.data.reports;
        //             let totalStudentCount = res.data.totalStudentCount;

        //             if (reports && reports.length > 0) {
        //                 let totalCounted = 0;
        //                 let percentage = 0;
        //                 for (let i = 0; i < reports.length; i++) {
        //                     totalCounted = totalCounted + reports[i].count;
        //                 }

        //                 if (totalStudentCount > 0) {
        //                     percentage = 100 * (totalStudentCount - totalCounted) / totalStudentCount;
        //                 }

        //                 reports.push({
        //                     id: 'not_checked',
        //                     code: 'not_checked',
        //                     name: translations(locale).homeworkReport.notChecked || "",
        //                     shortName: translations(locale).homeworkReport.notChecked || "",
        //                     color: '#575962',
        //                     count: totalStudentCount - totalCounted,
        //                     percentage: parseInt(percentage)
        //                 });
        //             } else {
        //                 reports = [];
        //             }

        //             message(res.data.message, true)

        //             setHomeworkReport(reports)
        //             init()
        //         } else {
        //             message(res.data.message)
        //         }
        //         setLoading(false)
        //     })
        //     .catch((e) => {
        //         message(translations(locale)?.err?.error_occurred)
        //         setLoading(false)
        //     })
    }

    const dateClickHandler = (row) => {
        console.log('dateClickHandler')

        setShowInfoModal(true)

        // setLoading(true)
        // fetchRequest(teacherJournalHomeworkDetailView, 'GET', { 
        //     date: row.assignDate,
        //     group: row.groupId, 
        //     type: 'group', 
        //     column: 'assignDate',
        //     season: location?.state?.season 
        // })
        //     .then((res) => {
        //         if (res.success) {
        //             const {homeworkInfo} = res.data
        //             setShowInfoModal(true)
        //             setSelectedDate(row.dueDate)
        //             setSelectedGroupId(row.groupId)
        //             setSelectedAssignDate(row.assignDate)
        //             setHomeworkDetail(homeworkInfo)
        //         } else {
        //             message(res.data.message)
        //         }
        //         setLoading(false)
        //     })
        //     .catch((e) => {
        //         message(translations(locale)?.err?.error_occurred)
        //         setLoading(false)
        //     })
    }

    const checkModal = () => {

        console.log ('checkModal')

        setShowInfoModal(false)
        setHomeworkModal(true)

        // setLoading(true)
        // fetchRequest(teacherJournalHomeworkInit, 'GET', { 
        //     group: selectedGroupId ? selectedGroupId : location?.state?.group,
        //     assignDate: selectedAssignDate,
        // })
        //     .then((res) => {
        //         if (res.success) {
        //             const {homeworkStudents, homeworkTypes, homework, group, calendarDays} = res.data
        //             setShowInfoModal(false)
        //             setHomeworkModal(true)
        //             setHomeworkStudents(homeworkStudents)
        //             setHomeworkTypes(homeworkTypes)
        //             setGroupInfo(group)
        //             setHomeworkInfo(homework)
        //             setHomeworkCalendarDays(calendarDays)

        //             let report = homework.reports;
        //             let defaultConfig = {...homeworkDefaultConfig};

        //             let unCheckedCounted = 0;
        //             let percentage = 0;
        //             for (let i = 0; i < homeworkStudents.length; i++) {
        //                 if(!homeworkStudents[i].isChecked){
        //                     unCheckedCounted = unCheckedCounted + 1
        //                 }
        //             }

        //             if (homeworkStudents && homeworkStudents.length > 0 && unCheckedCounted > 0) {
        //                 percentage = 100 * unCheckedCounted / homeworkStudents.length;
        //             }

        //             if(report && report.length > 0){
        //                 defaultConfig.showLeftButton = false;

        //                 report.push({
        //                     id: 'not_checked',
        //                     code: 'not_checked',
        //                     name: translations(locale).homeworkReport.notChecked || "",
        //                     shortName: translations(locale).homeworkReport.notChecked || "",
        //                     color: '#575962',
        //                     count: unCheckedCounted,
        //                     percentage: parseInt(percentage)
        //                 });
        //             }

        //             setHomeworkConfig(defaultConfig)
        //             setHomeworkReport(report)
        //             // homeworkGroups: nextProps.homeworkGroups,
        //             // homeworkReport,
        //             // homeworkDisableNew: nextProps.homeworkDisableNew
        //         } else {
        //             message(res.data.message)
        //         }
        //         setLoading(false)
        //     })
        //     .catch((e) => {
        //         message(translations(locale)?.err?.error_occurred)
        //         setLoading(false)
        //     })
    }

    const homeworkSendButtonHandler = () => {

        console.log('homeworkSendButtonhandler')

        // let hasError = false;
        // let errorMessage = null;

        // if (homeworkInfo && homeworkInfo.id) {
        //     let bodyParams = {};

        //     let studentIds = [];
        //     let typeIds = [];
        //     let comments = [];
        //     let scores = [];

        //     for (let i = 0; i < homeworkStudents.length; i++) {
        //         let studentObj = homeworkStudents[i];
        //         studentObj.isAuto = false;

        //         if (String(studentObj.checkable) === '1' && Math.ceil(studentObj['takenScore']) > studentObj['totalScore']) {
        //             hasError = true;
        //             errorMessage = studentObj['firstName'] + ' ' + translations(locale).homework.score_higher_that_max_score;
        //             break;
        //         }

        //         if (String(studentObj.checkable) === '1' && parseInt(studentObj['takenScore']) < 0) {
        //             hasError = true;
        //             errorMessage = studentObj['firstName'] + ' ' + translations(locale).homework.score_lower_that_max_score;
        //             break;
        //         }

        //         if (String(studentObj.checkable) === '1' && (!$.isNumeric(studentObj['takenScore']) || studentObj['takenScore'] == null)) {
        //             hasError = true;
        //             errorMessage = studentObj['firstName'] + ' ' + translations(locale).homework.empty_score;
        //             break;
        //         }

        //         if (String(studentObj.checkable) === '1' && !studentObj.radioTypeId) {
        //             hasError = true;
        //             errorMessage = translations(locale).homework.please_select_status;
        //             break;
        //         } else {
        //             if (String(studentObj.checkable) === '1' && studentObj.radioTypeId) {
        //                 studentIds.push(studentObj.id);
        //                 typeIds.push(studentObj.radioTypeId);
        //                 comments.push(studentObj.comment);
        //                 scores.push(studentObj.takenScore);
        //             }
        //         }
        //     }

        //     bodyParams['students[]'] = studentIds;
        //     bodyParams['types[]'] = typeIds;
        //     bodyParams['comments[]'] = comments;
        //     bodyParams['scores[]'] = scores;
        //     bodyParams['group'] = location?.state?.group;
        //     bodyParams['date'] = selectedDate.substring(0, 10);
        //     bodyParams['homework'] = homeworkInfo.id;

        //     if (hasError) {
        //         message(errorMessage, false);
        //     } else {
        //         setLoading(true)
        //         fetchRequest(teacherHomeworkSend, 'GET', bodyParams)
        //             .then((res) => {
        //                 if (res.success) {
        //                     let reports = res.data.reports;
        //                     let totalStudentCount = res.data.totalStudents;

        //                     if (reports && reports.length > 0) {
        //                         let totalCounted = 0;
        //                         let percentage = 0;
        //                         for (let i = 0; i < reports.length; i++) {
        //                             totalCounted = totalCounted + reports[i].count;
        //                         }

        //                         if (totalStudentCount > 0) {
        //                             percentage = 100 * (totalStudentCount - totalCounted) / totalStudentCount;
        //                         }

        //                         reports.push({
        //                             id: 'not_checked',
        //                             code: 'not_checked',
        //                             name: translations(locale).homeworkReport.notChecked || "",
        //                             shortName: translations(locale).homeworkReport.notChecked || "",
        //                             color: '#575962',
        //                             count: totalStudentCount - totalCounted,
        //                             percentage: parseInt(percentage)
        //                         });
        //                     } else {
        //                         reports = [];
        //                     }

        //                     setHomeworkReport(reports)
        //                     init()
        //                 } else {
        //                     message(res.data.message)
        //                 }
        //                 setLoading(false)
        //             })
        //             .catch((e) => {
        //                 message(translations(locale)?.err?.error_occurred)
        //                 setLoading(false)
        //             })
        //     }
        // } else {
        //     message(translations(locale).homework.not_found || "");
        // }
    };

    const homeworkHandlerEditButton = () => {
        setEditHomeworkInfo({
            dueDate: homeworkInfo.dueDate,
            description: homeworkInfo.description,
            totalScore: homeworkInfo.totalScore,
            link: homeworkInfo.link,
        });

        setInputViewOrEdit('edit')
        homeworkConfig.add_button_left = false;
    };

    const homeworkHandlerDeleteButton = () => {
        setDeleteHomeworkModalShow(true) 
    }

    const homeworkHandlerCancelButton = () => {
        setEditHomeworkInfo({
            dueDate: homeworkInfo.dueDate,
            description: homeworkInfo.description,
            totalScore: homeworkInfo.totalScore,
            link: homeworkInfo.link,
        });

        setInputViewOrEdit('view')
        homeworkConfig.add_button_left = true;
    }

    const homeworkHandlerSaveButton = () => {

        console.log('homeworkHandlerSave')

        // let hasError = false;
        // let errorMessage = null;

        // if (hasError) {
        //     setErrorMessage(true)
        // } else {
        //     if (homeworkInfo) {
        //         if (!editHomeworkInfo.dueDate) {
        //             message(translations(locale).invalid_date || "") 
        //             return;
        //         }

        //         if (!editHomeworkInfo.totalScore) {
        //             message(translations(locale).homeworkReport.insert_score || "")
        //             return;
        //         }

        //         let bodyParams = new FormData();
        //         bodyParams.append('homework', homeworkInfo.id);
        //         bodyParams.append('date', editHomeworkInfo.dueDate);
        //         bodyParams.append('description', editHomeworkInfo.description);
        //         bodyParams.append('score', editHomeworkInfo.totalScore);
        //         bodyParams.append('link', editHomeworkInfo.link);
        //         bodyParams.append('modalDay', selectedAssignDate.substring(0, 10));

        //         for (let i = 0; i < newFiles.length; i++) {
        //             bodyParams.append('files[]', newFiles[i]);
        //         }

        //         for (let i = 0; i < removedFiles.length; i++) {
        //             bodyParams.append('removeFiles[]', removedFiles[i]);
        //         }

        //         setLoading(true)
        //         fetchRequest(teacherHomeworkSave, 'POST', bodyParams, false, true)
        //             .then((res) => {
        //                 if (res.success) {
        //                     let homework = res.data.homework;
        //                     setNewFiles([])
        //                     setHomeworkInfo({...homeworkInfo, ...homework})
        //                     setInputViewOrEdit('view')
        //                 } else {
        //                     message(res.data.message)
        //                 }
        //                 setLoading(false)
        //             })
        //             .catch(() => {
        //                 message(translations(locale)?.err?.error_occurred)
        //                 setLoading(false)
        //             })
        //     } else {
        //         message(translations(locale).homework.not_found || "") 
        //     }
        // }
    };

    const homeworkInlineEditChange = (data, id) => {
        if (id) {
            let students = homeworkStudents;
            var studentObj = students.filter(obj => {
                return parseInt(obj.id) === parseInt(id)
            });

            if (studentObj && studentObj.length === 1) {
                let updateStudent = false;

                if (studentObj[0]['comment'] !== data) {
                    studentObj[0]['comment'] = data;

                    if (studentObj[0].radioTypeId) {
                        updateStudent = true;
                    }
                }

                if (updateStudent) {
                    let bodyParams = {
                        homework: homeworkInfo.id,
                        student: studentObj[0].id,
                        type: studentObj[0].radioTypeId,
                        comment: studentObj[0].comment,
                        score: studentObj[0]['takenScore']
                    };

                    studentDetailSubmit(bodyParams)
                } else {
                    setHomeworkStudents(students)
                }
            }
        }
    }

    const closeModal = () => {
        setShowInfoModal(false)
        setShowStatusModal(false)
        setShowStudentModal(false)
    }

    const homeworkTabHeaderRender = () => {
        let date = null;
        if (selectedAssignDate) {
            date = selectedAssignDate.substring(0, 10);
        }
        return (
            <div className='pb-5' style={{ fontSize: '1.2rem' }}>
                <div className='row'>
                    <div className="col text-right bolder" style={{ color: '#868aa8' }}>{date}</div>
                    <div className="col" style={{ color: '#575962' }}>{groupInfo?.subject}</div>
                </div>
                <div className='row'>
                    <div className="col text-right bolder" style={{ color: '#868aa8' }}>{date ? WEEKDAYS_LONG[locale][(new Date(date)).getDay()] : ''}</div>
                    <div className="col" style={{ color: '#575962' }}>{groupInfo?.name}</div>
                </div>
                <div className='row'>
                    <div className="col text-right bolder" style={{ color: '#868aa8' }}>{ }</div>
                    <div className="col" style={{ color: '#575962', textDecoration: 'underline' }}>{groupInfo?.classes}</div>
                </div>
            </div>
        )
    };

    const closeHomeworkModal = () => {
        setHomeworkModal(false);
    }

    const homeworkTabBodyRender = () => {
        if (homeworkInfo) {
            let startDate = null, endDate = null, disableWeekDays = [0, 1, 2, 3, 4, 5, 6];

            if (homeworkCalendarDays) {
                startDate = new Date(homeworkCalendarDays.before);
                endDate = new Date(homeworkCalendarDays.after);

                for (let j = 0; j < homeworkCalendarDays.weekdays.length; j++) {
                    let weekdayIndex = homeworkCalendarDays.weekdays[j];

                    if (weekdayIndex === 7) {
                        if (disableWeekDays.indexOf(0) > -1) {
                            disableWeekDays.splice(disableWeekDays.indexOf(0), 1);
                        }
                    } else {
                        if (disableWeekDays.indexOf(weekdayIndex) > -1) {
                            disableWeekDays.splice(disableWeekDays.indexOf(weekdayIndex), 1);
                        }
                    }
                }
            }

            return (
                <div>
                    <div className="form-group m-form__group row">
                        <div className="col-md-12 displayFlex">
                            <label 
                                htmlFor="example-number-input" 
                                className="col-md-4 col-form-label homeworkLabels" 
                                style={{fontWeight: "bold", color: '#868aa8'}}
                            >
                                {translations(locale).homework.homework_due_date || null}
                            </label>
                            <div className="col-md-4">
                                {
                                    inputViewOrEdit && inputViewOrEdit === 'view'
                                        ?
                                        <div className="col-md-12 homeworkDatepicker">
                                            {
                                                homeworkInfo.dueDate || null
                                            }
                                        </div>
                                        :
                                        <DayPickerInput
                                            onDayChange={homeworkHandleDayChange}
                                            value={editHomeworkInfo.dueDate}
                                            placeholder={translations(locale).datePickerPlaceholder}
                                            hideOnDayClick={true}
                                            inputProps={{readOnly: true}}
                                            classNames={{
                                                container: 'myToday-hw-DayPicker',
                                                overlay: 'DayPickerInputOverlay'
                                            }}
                                            dayPickerProps={{
                                                disabledDays: [
                                                    startDate && endDate
                                                        ? {
                                                            before: new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate()),
                                                            after: new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate()),
                                                        }
                                                        :
                                                        {},
                                                    {
                                                        daysOfWeek: disableWeekDays
                                                    }
                                                ]
                                            }}
                                        />
                                }
                            </div>
                            <div className="col-4"/>
                        </div>
                    </div>

                    <div className="form-group m-form__group row myToday-addHomeworkEditorArea">
                        <div className="col-md-12 displayFlex">
                            <label
                                htmlFor="example-number-input"
                                className="col-md-4 col-form-label homeworkLabels"
                                style={{fontWeight: "bold", color: '#868aa8'}}
                            >
                                {translations(locale).homeworkReport.homework || null}
                            </label>
                            <div className="col-md-6">
                                {
                                    inputViewOrEdit && inputViewOrEdit === 'view'
                                        ?
                                        <div className="col-md-12 homeworkTextAreaDesc">
                                            {
                                                homeworkInfo.description
                                                    ?
                                                    <div
                                                        dangerouslySetInnerHTML={{__html: htmlDecode(homeworkInfo.description)}}
                                                        onClick={(e) => {
                                                            const el = e.target.closest("A");

                                                            if (el && e.currentTarget.contains(el)) {
                                                                window.open('' + el, '_blank');
                                                                e.preventDefault();
                                                            }
                                                        }}/>
                                                    :
                                                    null
                                            }
                                        </div>
                                        :
                                        <textarea
                                            rows="5"
                                            className='form-control'
                                            value={editHomeworkInfo.description}
                                            onChange={(e) => onHwEditorStateChange(e?.target?.value)}
                                        />
                                }
                            </div>
                            <div className="col-md-2"/>
                        </div>
                    </div>

                    <div className="form-group m-form__group row">
                        <div className="col-12 displayFlex">
                            <label 
                                htmlFor="example-number-input" 
                                className="col-4 col-form-label homeworkLabels"
                                style={{fontWeight: "bold", color: '#868aa8'}}
                            >
                                {translations(locale).homework.score + '*' || null}
                            </label>
                            <div className="col-6">
                                {
                                    inputViewOrEdit && inputViewOrEdit === 'view'
                                        ?
                                        <div className="col-md-12 homeworkInputTotalScore">
                                            {
                                                homeworkInfo.totalScore || null
                                            }
                                        </div>
                                        :
                                        <div>
                                            <input
                                                type={"number"}
                                                className="form-control homeworkInputScore"
                                                placeholder="Оноо"
                                                value={editHomeworkInfo.totalScore || ''}
                                                max={100}
                                                min={0}
                                                onChange={(event) => editInputChangedScoreHandler(event)}
                                            />
                                            <div className="inputWarningMessage">
                                                <span>{translations(locale).homework.file_warning_message || null}</span>
                                            </div>
                                        </div>
                                }
                            </div>
                            <div className="col-2">
                            </div>
                        </div>
                    </div>

                    <div className="form-group m-form__group row">
                        <label
                            className="col-4 col-form-label homeworkLabels "
                            style={{fontWeight: "bold", color: '#868aa8'}}
                        >
                            {translations(locale).link.link || null}
                        </label>
                        <div className="col-8">
                            {
                                inputViewOrEdit && inputViewOrEdit === 'view'
                                ?
                                    <div className="col-md-12 homeworkInputTotalScore">
                                        {
                                            homeworkInfo.link || null
                                        }
                                    </div>
                                :
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder={translations(locale).link.insert_link}
                                        value={editHomeworkInfo.link || ''}
                                        onChange={(event) => editInputChangedLinkHandler(event)}
                                    />
                            }
                        </div>
                    </div>

                    <div className="form-group m-form__group row">
                        <div className="col-md-12 displayFlex">
                            <label 
                                htmlFor="example-number-input" 
                                className="col-md-4 col-form-label homeworkLabels" 
                                style={{fontWeight: "bold", color: '#868aa8'}}
                            >
                                {translations(locale).homework.file || null}
                            </label>
                            <div className="col-md-8">
                                {
                                    inputViewOrEdit && inputViewOrEdit === 'view'
                                        ?
                                            homeworkInfo && homeworkInfo['files'] && homeworkInfo['files'].length > 0
                                                ?
                                                <div className="">
                                                    {
                                                        homeworkInfo['files'].map(function (file) {
                                                            return (
                                                                <div className="homeworkFileLists" key={'file_' + file['id']}>
                                                                    <div className="fileLink col-md-10 br-08 mb-2 d-flex align-items-center pointer p-2 pl-3" onClick={() => window.open(file['path'])}>{file['name']}</div>
                                                                </div>
                                                            )
                                                        })
                                                    }
                                                </div>
                                                :
                                                <div className="col-md-12 noFileMessage">{translations(locale).homework.no_file || null}</div>
                                        :
                                            <div className="row col-md-6 d-flex flex-column justify-content-center align-items-center">
                                                <img 
                                                    onClick={chooseFileClickHandler} 
                                                    width={80} 
                                                    src="/images/upload.png" 
                                                    alt="upload image" 
                                                    className='py-2 pointer' 
                                                />
                                                <span className='bolder pb-2' style={{ fontSize: '0.95rem', color: '#3c3f42' }}>{translations(locale).filesDt.upload}</span>
                                                <input
                                                    ref={fileUploader}
                                                    type="file"
                                                    hidden
                                                    multiple={true}
                                                    value={''}
                                                    onChange={(event) => inputChangedFileHandler(event)}
                                                />
                                                <span className={'span-warning'}>{translations(locale).filesDt.file_limit_with_video || null}</span>
                                                {
                                                    homeworkInfo && homeworkInfo['files'] && homeworkInfo['files'].length > 0
                                                        ?
                                                        homeworkInfo['files'].map(function (file, index) {
                                                            return (
                                                                <div className='br-08 d-flex justify-content-between align-items-center p-2 my-1' style={{ backgroundColor: 'rgba(227, 228, 238, 0.5)', width: '27rem', minHeight: '4rem', overflowWrap: 'anywhere' }} key={index}>
                                                                    <div className="d-flex justify-content-start align-items-center">
                                                                        <CheckCircleOutlineIcon sx={{ color: '#a3f154', fontSize: 25 }} />
                                                                        <p className='m-0 px-2' style={{ color: '#575962' }}>{file.name}</p>
                                                                    </div>
                                                                    <div className="d-flex justify-content-end align-items-center">
                                                                        <i className="la la-times-circle pointer"
                                                                            style={{ color: '#979797', fontSize: 25 }}
                                                                            onClick={() => _removeFile(file.id)}
                                                                        />
                                                                    </div>
                                                                </div>
                                                            );
                                                        })
                                                        : null
                                                }
                                            </div>
                                }
                                {
                                    newFiles
                                        ?
                                        newFiles.map(function (value, index) {
                                            return (
                                                <div className='br-08 d-flex justify-content-between align-items-center p-2 my-1' style={{ backgroundColor: 'rgba(227, 228, 238, 0.5)', width: '27rem', minHeight: '4rem', borderBottom: '3px solid #a3f154', overflowWrap: 'anywhere' }} key={index}>
                                                    <div className="d-flex justify-content-start align-items-center">
                                                        <CheckCircleOutlineIcon sx={{ color: '#a3f154', fontSize: 25 }} />
                                                        <p className='m-0 px-2' style={{ color: '#575962' }}>{value.name}</p>
                                                    </div>
                                                    <div className="d-flex justify-content-end align-items-center">
                                                        <i className="la la-times-circle pointer"
                                                            style={{ color: '#979797', fontSize: 25 }}
                                                            onClick={() => _removeFileList(value.lastModified)}
                                                        />
                                                    </div>
                                                </div>
                                            );
                                        })
                                        : null
                                }
                            </div>
                        </div>
                    </div>
                </div>
            )
        } else {
            return (
                <div>
                    <div className="form-group m-form__group row">
                        <div className="col-md-12 displayFlex" style={{ paddingTop: '2rem', paddingLeft: '3rem', paddingBottom: '1rem', }}>
                            {translations(locale).homework.not_found}
                        </div>
                    </div>
                </div>
            )
        }
    };

    const homeworkTabBodyDataTableRender = () => {
        return (
            <div>
                {
                    homeworkReport && homeworkReport.length > 0
                    &&
                    <div className='container-fluid my-5'>
                        <div className="row text-white" style={{ gap: 20 }}>
                            {
                                homeworkReport && homeworkReport.length > 0
                                &&
                                homeworkReport.map((report, key) =>
                                    <div key={key} className='col br-06 p-3' style={{ backgroundColor: report?.color, boxShadow: '1px 1px 15px 0 rgba(87, 89, 98, 0.3)' }}>
                                        <div className="row">
                                            <div className='col-6 d-flex flex-column justify-content-between'>
                                                <h5>{report.name}</h5>
                                                <h5 className='bolder' style={{ fontFamily: 'MulishBlack' }}>{report.percentage}%</h5>
                                            </div>
                                            <div className='col-6 text-right'>
                                                <span className='bolder text-right' style={{ fontSize: '3.5rem', fontFamily: 'MulishBlack' }}>{report.count}</span>
                                            </div>
                                        </div>
                                    </div>
                                )
                            }
                        </div>
                    </div>
                }
                {
                    homeworkStudents && homeworkStudents.length > 0 &&
                        <DTable
                            config={homeworkConfig}
                            data={homeworkStudents}
                            columns={homeworkColumns}
                            locale={locale}
                            checkable
                            onLeftButtonClick={homeworkSendButtonHandler}
                            onCheckable={homeworkCheckboxChange}
                        />
                }
            </div>
        )
    };

    const homeworkNumericInputChange = (data, id) => {
        let value = data.target.value;

        let totalScore = homeworkInfo ? parseFloat(homeworkInfo.totalScore) : 0;
        let students = homeworkStudents;

        let selectedTypeId = null;
        let studentObj = students.filter(obj => {
            return parseInt(obj.id) === parseInt(id)
        });

        if (studentObj && studentObj.length === 1) {
            if (value) {
                if (id) {
                    let percentage = parseInt(value) * 100 / parseInt(totalScore);
                    if (parseInt(value) > parseInt(totalScore)) {
                        return message(translations(locale)?.homework?.total_score_error)
                    } else if (parseInt(value) == parseInt(totalScore)) {
                        for (let i = 0; i < homeworkTypes.length; i++) {
                            let hwType = homeworkTypes[i];
                            if (hwType.code.toLowerCase() == 'complete') {
                                selectedTypeId = hwType.id;
                                break;
                            }
                        }
                        if (typeof studentObj['checkable'] === 'undefined' || studentObj['checkable'] === false) {
                            studentObj[0]['checkable'] = true;
                        }
                        studentObj[0]['radioTypeId'] = selectedTypeId;

                    } else if (parseInt(value) === 0) {
                        for (let i = 0; i < homeworkTypes.length; i++) {
                            let hwType = homeworkTypes[i];
                            if (hwType.code.toLowerCase() == 'no_assignment') {
                                selectedTypeId = hwType.id;
                                break;
                            }
                        }
                        if (typeof studentObj['checkable'] === 'undefined' || studentObj['checkable'] === false) {
                            studentObj[0]['checkable'] = true;
                        }
                        studentObj[0]['radioTypeId'] = selectedTypeId;
                    } else {
                        let selectedType = null;
                        for (let i = 0; i < homeworkTypes.length; i++) {
                            let hwType = homeworkTypes[i];

                            if (percentage >= hwType.minPercentage && percentage < hwType.maxPercentage) {
                                selectedType = hwType;
                                break;
                            }
                        }

                        if (selectedType) {
                            if (typeof studentObj['checkable'] === 'undefined' || studentObj['checkable'] === false) {
                                studentObj[0]['checkable'] = true;
                            }
                            studentObj[0]['radioTypeId'] = selectedType.id;
                        }
                    }
                    studentObj[0]['takenScore'] = value;
                    studentObj[0]['totalScore'] = totalScore;

                    let bodyParams = {
                        homework: homeworkInfo.id,
                        student: studentObj[0].id,
                        type: studentObj[0].radioTypeId,
                        comment: studentObj[0].comment,
                        score: studentObj[0]['takenScore']
                    };

                    studentDetailSubmit(bodyParams)
                }
            } else {
                studentObj[0]['numericEditClassName'] = 'error';
                studentObj[0]['takenScore'] = value;
                studentObj[0]['totalScore'] = totalScore;

                setHomeworkStudents(students)
            }
        }
    }

    const homeworkCheckboxChange = (row, index, isChecked, id) => {
        if (row === 'row') {
            if (id) {
                let selectedTypeId = null;
                let students = homeworkStudents;

                var studentObj = students.filter(obj => {
                    return parseInt(obj.id) === parseInt(id)
                });

                if (studentObj && studentObj.length === 1) {
                    if (isChecked) {
                        for (let i = 0; i < homeworkTypes.length; i++) {
                            let hwType = homeworkTypes[i];

                            if (hwType.code.toLowerCase() == 'complete') {
                                selectedTypeId = hwType.id;
                            }
                        }

                        studentObj[0]['checkable'] = true;
                        studentObj[0]['isAuto'] = false;
                        studentObj[0]['takenScore'] = homeworkInfo ? parseInt(homeworkInfo.totalScore) : null;
                        studentObj[0]['radioTypeId'] = selectedTypeId;

                        let bodyParams = {
                            homework: homeworkInfo.id,
                            student: studentObj[0].id,
                            type: selectedTypeId,
                            comment: studentObj[0].comment,
                            score: studentObj[0]['takenScore']
                        };

                        studentDetailSubmit(bodyParams)
                    } else {
                        if (typeof studentObj[0].isAuto !== 'undefined') {
                            studentObj[0]['takenScore'] = null;
                            setDeleteHomeworkDetailModalShow(true)
                            setDeleteHomeworkDetailStudentId(studentObj[0].id)
                        } else {
                            setDeleteHomeworkDetailModalShow(true)
                            setDeleteHomeworkDetailStudentId(studentObj[0].id)
                        }
                    }
                }
            }
        } else if (row === 'allCheck') {
            let students = homeworkStudents;
            let score = homeworkInfo ? homeworkInfo.totalScore : null;

            let checkedStudents = [];
            let studentDescriptions = [];
            let studentTakenScore = [];

            if (isChecked) {
                let selectedTypeId = null;

                for (let i = 0; i < homeworkTypes.length; i++) {
                    let hwType = homeworkTypes[i];
                    if (hwType.code.toLowerCase() == 'complete') {
                        selectedTypeId = hwType.id;
                    }
                }

                for (let i = 0; i < students.length; i++) {
                    let studentObj = students[i];

                    if (typeof studentObj['checkable'] === 'undefined' || String(studentObj['checkable']) === '0' || studentObj['checkable'] === false) {
                        studentObj['checkable'] = true;
                        studentObj['isAuto'] = true;
                        studentObj['radioTypeId'] = selectedTypeId;
                        studentObj['takenScore'] = score;

                        if (studentObj.checkable === true && studentObj.radioTypeId) {
                            checkedStudents.push(studentObj.id + "_" + studentObj.radioTypeId);
                            studentDescriptions.push(studentObj.comment);
                            studentTakenScore.push(studentObj.takenScore)
                        }

                        let bodyParams = {
                            homework: homeworkInfo.id,
                            student: studentObj.id,
                            type: selectedTypeId,
                            comment: studentObj.comment,
                            score: studentObj['takenScore']
                        };

                        studentDetailSubmit(bodyParams)
                    }
                }
            }
        }
    }

    const homeworkHandleDayChange = (day) => {
        let selectedDay = dateFormat(new Date(day));

        setEditHomeworkInfo({
            ...editHomeworkInfo,
            dueDate: selectedDay
        })
    }

    const onHwEditorStateChange = (homeworkEditEditorState) => {
        setEditHomeworkInfo({
            ...editHomeworkInfo,
            description: homeworkEditEditorState
        })
    }

    const editInputChangedScoreHandler = (event) => {
        setEditHomeworkInfo({
            ...editHomeworkInfo,
            totalScore: event.target.value
        })
    };

    const editInputChangedLinkHandler = (event) => {
        setEditHomeworkInfo({
            ...editHomeworkInfo,
            link: event.target.value
        })
    };

    const inputChangedFileHandler = (event) => {
        let files = [];
        let targetFiles = event.target.files;
        let addFiles = [];
        let hasSizeError = false;

        if (targetFiles) {
            for (let i = 0; i < targetFiles.length; i++) {
                let addFile = targetFiles[i];

                if (addFile['type'].indexOf("video") >= 0) {
                    if (addFile['size'] <= 52428800) {
                        addFiles.push(addFile);
                    } else {
                        hasSizeError = true;
                    }
                } else {
                    if (!isLargerFile(addFile.size)) {
                        addFiles.push(addFile);
                    } else {
                        hasSizeError = true;
                    }
                }
            }
        }

        for (let i = 0; i < addFiles.length; i++) {
            files.push(addFiles[i])
        }
        setNewFiles(files)
    };

    const chooseFileClickHandler = () => {
        fileUploader.current.click();
    };

    const _removeFile = (fileId) => {
        if (fileId) {
            let existingHomework = homeworkInfo;

            let filterFiles = existingHomework['files'].filter(function (item) {
                return item['id'] !== fileId
            });

            let cloneRemovedFiles = [...removedFiles];

            cloneRemovedFiles.push(fileId);

            existingHomework['files'] = filterFiles;

            setRemovedFiles(cloneRemovedFiles)
            setHomeworkInfo(existingHomework) 
        }
    };

    const _removeFileList = (event) => {
        if (event) {
            let fileLists = files;

            fileLists = fileLists.filter(function (item) {
                return item['lastModified'] !== event
            });

            setNewFiles(fileLists) 
        }
    };

    const _closeHomeworkDeleteModal = () => {
        setDeleteHomeworkModalShow(false) 
    }

    const _onHomeworkDeleteSubmit = () => {

        console.log('_onHWDeleteSubmit')

        // if (homeworkInfo) {
        //     setLoading(true)
        //     fetchRequest(teacherHomeworkDelete, 'POST', { 
        //         id: homeworkInfo.id,
        //     })
        //     .then((res) => {
        //         if (res.success) {
        //             setDeleteHomeworkModalShow(false) 
        //             setHomeworkModal(false);
        //             message(res.data.message, res.success)    
        //             init()                
        //         } else {
        //             message(res.data.message)
        //         }
        //         setLoading(false)
        //     })
        //     .catch((e) => {
        //         message(translations(locale)?.err?.error_occurred)
        //         setLoading(false)
        //     })
        // }
    }

    const _closeDeleteModal = () => {
        setDeleteHomeworkDetailModalShow(false)
        setDeleteHomeworkDetailStudentId(null) 
    };

    const _onDeleteSubmit = () => {

        console.log('_onDeleteSubmit')

        // if (deleteHomeworkDetailStudentId) {
        //     let students = homeworkStudents;

        //     var studentObj = students.filter(obj => {
        //         return parseInt(obj.id) === parseInt(deleteHomeworkDetailStudentId)
        //     });

        //     if (studentObj && studentObj.length === 1) {
        //         studentObj[0].checkable = 0;
        //         studentObj[0].comment = null;
        //         studentObj[0].radioTypeId = null;
        //         studentObj[0].isAuto = false;
        //         studentObj[0].takenScore = false;

        //         let bodyParams = {
        //             homework: homeworkInfo ? homeworkInfo.id : null,
        //             student: deleteHomeworkDetailStudentId
        //         };

        //         setLoading(true)
        //         fetchRequest(teacherHomeworkStudentDetailRemove, 'POST', bodyParams)
        //             .then((res) => {
        //                 if (res.success) {
        //                     let reports = res.data.reports;
        //                     let totalStudentCount = res.data.totalStudentCount;

        //                     if (reports && reports.length > 0) {
        //                         let totalCounted = 0;
        //                         let percentage = 0;
        //                         for (let i = 0; i < reports.length; i++) {
        //                             totalCounted = totalCounted + reports[i].count;
        //                         }

        //                         if (totalStudentCount > 0) {
        //                             percentage = 100 * (totalStudentCount - totalCounted) / totalStudentCount;
        //                         }

        //                         reports.push({
        //                             id: 'not_checked',
        //                             code: 'not_checked',
        //                             name: translations(locale).homeworkReport.notChecked || "",
        //                             shortName: translations(locale).homeworkReport.notChecked || "",
        //                             color: '#575962',
        //                             count: totalStudentCount - totalCounted,
        //                             percentage: parseInt(percentage)
        //                         });
        //                     } else {
        //                         reports = [];
        //                     }

        //                     setHomeworkReport(reports)
        //                     message(res.data.message, res.success)
        //                     _closeDeleteModal()
        //                     init()
        //                 } else {
        //                     message(res.data.message)
        //                 }
        //                 setLoading(false)
        //             })
        //             .catch(() => {
        //                 message(translations(locale)?.err?.error_occurred)
        //                 setLoading(false)
        //             })
        //     }
        // } else {
        //     this.setState({
        //         deleteHomeworkDetailModalShow: false,
        //         errorMessage: 'No student found'
        //     })
        // }
    };

    const _handlerTab = (data) => {
        setColumns([])
        setSelectedTabData(data?.panes[data?.activeIndex])
        init(data?.panes[data?.activeIndex].menuName)
    }

    const _handleHomeworkCountClick = (type, row) => {

        setStudentHomeworksModal(true)

        // let params = {
        //     group: groupInfo.id,
        //     column: type,
        //     student: row.id,
        //     season: location?.state?.season
        // }

        // setLoading(true)
        // fetchRequest(teacherJournalHomeworkStudentHomeworksView, 'POST', params)
        //     .then((res) => {
        //         if (res.success) {
        //             const {data} = res;
        //             setStudentInfo(data?.studentInfo || null)
        //             setStudentHomeworks(data?.homeworkList || [])
        //             setStudentHomeworksModal(true)
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

    const _handleHomeworkTypeClick = (date, studentId) => {

        setStudentHomeworkDetailModal(true)

        // let params = {
        //     group: groupInfo.id,
        //     date: date,
        //     student: studentId,
        //     season: location?.state?.season
        // }

        // setLoading(true)
        // fetchRequest(teacherJournalHomeworkStudentHomeworkDetailView, 'POST', params)
        //     .then((res) => {
        //         if (res.success) {
        //             const {data} = res;
        //             setStudentInfo(data?.student || null)
        //             setHomeworkInfo(data?.homework || null)
        //             setHomeworkDetail(data?.details || [])
        //             setStudentHomeworkDetailModal(true)
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

    const _handleHomeworkDateClick = (date) => {

        setShowStudentModal(true)

        // let params = {
        //     group: groupInfo.id,
        //     date: date,
        //     type: 'group',
        //     season: location?.state?.season
        // }

        // setLoading(true)
        // fetchRequest(teacherJournalHomeworkDetailView, 'POST', params)
        //     .then((res) => {
        //         if (res.success) {
        //             const {data} = res;
        //             setHomeworkDetail(data?.homeworkInfo || null)
        //             setSelectedDate(date)
        //             setShowStudentModal(true)
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

    const _closeStudentHomeworksModal = () => {
        setStudentHomeworksModal(false)
    }

    const _closeStudentHomeworkDetailModal = () => {
        setStudentHomeworkDetailModal(false)
    }

    return (
        <NModal
            size='xl'
            dimmer='blurring'
            show={true}
            onHide={onClose}
            // className={className || ''}
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <NModal.Header closeButton style={{padding: '1rem'}}>
                <NModal.Title className="modal-title d-flex flex-row justify-content-between w-100">
                    {translations(locale)?.homework?.title}
                </NModal.Title>
            </NModal.Header>
            <NModal.Body style={{color: '#212529'}}>
                <div className='m-portlet'>
                    <div className='m-portlet__body'>
                    <Description
                        groupInfo={groupInfo}
                    />
                    </div>
                </div>
                <div className='m-portlet tab'>
                    <Tab
                        menu={{ secondary: true, pointing: true, className: 'primaryColor m-0 h-4' }}
                        onTabChange={(e, data) => _handlerTab(data)}
                        panes={[
                            {
                                menuItem: translations(locale)?.by_day,
                                menuName: 'by_day',
                                render: () =>
                                    <div className='m-portlet__body'>
                                        <DTable
                                            locale={locale}
                                            config={config}
                                            data={byDayData}
                                            columns={columns}
                                        />
                                    </div>,
                            },
                            {
                                menuItem: translations(locale)?.busDashboard?.by_student,
                                menuName: 'by_student',
                                render: () =>
                                    <div className='m-portlet__body'>
                                        <DTable
                                            locale={locale}
                                            config={config}
                                            data={byStudentData}
                                            columns={columns}
                                        />
                                    </div>,
                            }
                        ]}
                    />
                </div>
            </NModal.Body>
            <NModal.Footer>
                <button 
                    className='btn m-btn--pill btn-link m-btn m-btn--custom'
                    onClick={onClose}
                >
                    {translations(locale)?.back}
                </button>
            </NModal.Footer>
            {
                loading &&
                <>
                    <div className='blockUI blockOverlay' />
                    <div className='blockUI blockMsg blockPage'>
                        <div className='m-loader m-loader--brand m-loader--lg' />
                    </div>
                </>
            }
            {
                showInfoModal && 
                <InfoModal
                    onClose={closeModal}
                    onSave={checkModal}
                    title={selectedDate}
                    locale={locale}
                    data={homeworkDetail}
                />
            }
            {
                showStudentModal && 
                <StudentModal
                    onClose={closeModal}
                    title={selectedDate}
                    locale={locale}
                    data={homeworkDetail}
                />
            }
            {
                showStatusModal && 
                <StatusModal
                    onClose={closeModal}
                    title={selectedStatus}
                    locale={locale}
                    data={statusData}
                />
            }
            <Modal
                size={'fullscreen'}
                dimmer={'blurring'}
                open={homeworkModal}
                onClose={closeHomeworkModal}
                className="react-modal"
                centered
            >
                <div className="header">{translations(locale)?.homework.title}
                    <button type="button" className="close" aria-label="Close" onClick={closeHomeworkModal} >
                        <CloseIcon />
                    </button>
                </div>
                <div className="content">
                    <>
                        {homeworkTabHeaderRender()}
                        <div className='m-portlet'>
                            <div className='m-portlet__body myTimetable-addNewSubjectStyle'>
                                <>
                                    {homeworkTabBodyRender()}
                                </>
                            </div>
                            {
                                homeworkInfo && 
                                <div className="m-portlet__foot text-center">
                                    <div className="align-items-center">
                                        {
                                            inputViewOrEdit == 'view'
                                            ?
                                                <>
                                                    <button
                                                        type="button"
                                                        onClick={homeworkHandlerDeleteButton}
                                                        className="btn m-btn--pill btn-danger m-btn--uppercase mr-2">
                                                        {translations(locale).delete}
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={homeworkHandlerEditButton}
                                                        className="btn m-btn--pill btn-primary m-btn--uppercase ">
                                                        {translations(locale).edit}
                                                    </button>
                                                </>
                                            :
                                                <>
                                                    <button
                                                        type="button"
                                                        onClick={homeworkHandlerCancelButton}
                                                        className="btn m-btn--pill btn-outline-metal m-btn--wide mr-3 text-uppercase">
                                                        {translations(locale).cancel}
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={homeworkHandlerSaveButton}
                                                        className="btn m-btn--pill btn-success m-btn--wide text-uppercase">
                                                        {translations(locale).save}
                                                    </button>
                                                </>
                                        }
                                    </div>
                                </div>
                            }
                        </div>
                        {
                            homeworkInfo
                            ?   <div className="m-portlet">
                                    <div className="m-portlet__body">
                                        {homeworkTabBodyDataTableRender()}
                                    </div>
                                </div>
                            :   null
                        }
                    </>
                </div>
                <div className="actions modal-footer">
                    <div className="col-12 text-center">
                        <button
                            type="button"
                            onClick={closeHomeworkModal}
                            className="btn m-btn--pill btn-outline-metal m-btn--wide mr-3 text-uppercase">
                            {translations(locale).close}
                        </button>
                    </div>
                </div>
            </Modal>
            <Modal
                size={'mini'}
                dimmer={'blurring'}
                centered={true}
                open={deleteHomeworkModalShow}
                onClose={_closeHomeworkDeleteModal}
                className="react-modal"
            >
                <div className="header">{translations(locale).homework.delete_homework_info || null}?
                    <button type="button" className="close" onClick={_closeHomeworkDeleteModal}>
                        <CloseIcon />
                    </button>
                </div>
                <div className="content">
                    <p>{translations(locale).homework.delete_homework || null}?</p>
                    <p>{translations(locale).homework.delete_homework_description || null}</p>
                </div>
                <div className="actions modal-footer text-center">
                    <button className="btn m-btn--pill btn-link btn-outline-metal"
                        onClick={_closeHomeworkDeleteModal}>{translations(locale).cancel || null}
                    </button>
                    <button className="btn m-btn--pill btn-danger m-btn--wide"
                        onClick={_onHomeworkDeleteSubmit}>{translations(locale).delete || null}
                    </button>
                </div>
            </Modal>
            <Modal
                size={'mini'}
                dimmer={'blurring'}
                open={deleteHomeworkDetailModalShow}
                onClose={_closeDeleteModal}
                className="react-modal"
                centered={true}
            >
                <div className="header">{translations(locale).homework.delete_homework_info || null}?
                    <button type="button" className="close" onClick={_closeDeleteModal}>
                        <CloseIcon />
                    </button>
                </div>
                <div className="content">
                    <p>{translations(locale).homework.delete_student_homework || null}?</p>
                    <p>{translations(locale).homework.delete_student_homework_description || null}</p>
                </div>
                <div className="actions modal-footer">
                    <div className='col text-center'>
                        <button className="btn m-btn--pill btn-outline-metal m-btn mr-2"
                            onClick={_closeDeleteModal}>{translations(locale).cancel || null}
                        </button>
                        <button className="btn m-btn--pill btn-danger m-btn--wide"
                            onClick={_onDeleteSubmit}>{translations(locale).delete || null}
                        </button>
                    </div>
                </div>
            </Modal>
            <Modal
                size={'large'}
                dimmer={'blurring'}
                open={studentHomeworkDetailModal}
                onClose={_closeStudentHomeworkDetailModal}
                className="react-modal"
            >
                <div className="header">
                    {studentInfo ? studentInfo.firstName : ''}
                    <button type="button" className="close" onClick={_closeStudentHomeworkDetailModal}>
                        <CloseIcon />
                    </button>
                </div>
                <div className="content">
                    <div className="form-group m-form__group row">
                        <div className="col-md-4 col-xs-12">
                            <img 
                                src={studentInfo?.avatar || '/images/avatar.png'}
                                className="img-responsive img-circle" 
                                style={{
                                    width: '100px',
                                    height: '100px',
                                    display: 'block',
                                    marginLeft: 'auto',
                                    objectFit: 'cover'
                                }}
                            />
                        </div>
                        <div className="col-md-8 col-xs-12">
                            <div className="m-form__group row">
                                <label className="col-md-4 col-xs-12 text-right">
                                    {translations(locale).className || null}:
                                </label>
                                <div className="col-md-8 col-xs-12">
                                    <b>{studentInfo?.className || ''}</b>
                                </div>
                            </div>
                            <div className="m-form__group row">
                                <label className="col-md-4 col-xs-12 text-right">
                                    {translations(locale).student.student_code || null}
                                </label>
                                <div className="col-md-8 col-xs-12 ">
                                    <b>{studentInfo?.studentCode || ''}</b>
                                </div>
                            </div>
                            <div className="m-form__group row">
                                <label className="col-md-4 col-xs-12 text-right">
                                    {translations(locale).student.last_name || null}:
                                </label>
                                <div className="col-md-4 col-xs-12 ">
                                    <b>{studentInfo?.lastName || ''}</b>
                                </div>
                            </div>
                            <div className="m-form__group row">
                                <label className="col-md-4 col-xs-12 text-right">
                                    {translations(locale).student.first_name || null}:
                                </label>
                                <div className="col-md-8 col-xs-12">
                                    <b>{studentInfo?.firstName || ''}</b>
                                </div>
                            </div>
                            <div className="m-form__group row">
                                <label className="col-md-4 col-xs-12 text-right">
                                    {translations(locale).homeworkReport.homework || null}
                                </label>
                                <div className="col-md-8 col-xs-12 ">
                                    <div
                                        dangerouslySetInnerHTML={{__html: htmlDecode(homeworkInfo?.description || '')}}
                                        onClick={(e) => {
                                            const el = e.target.closest("A");

                                            if (el && e.currentTarget.contains(el)) {
                                                window.open('' + el, '_blank');
                                                e.preventDefault();
                                            }
                                        }}/>
                                </div>
                            </div>
                            <div className="m-form__group row">
                                <label className="col-md-4 col-xs-12 text-right">
                                    {translations(locale).homework.score || null}
                                </label>
                                <div className="col-md-8 col-xs-12 ">
                                    <b>{homeworkInfo?.score || null}</b>
                                </div>
                            </div>
                            <div className="m-form__group row">
                                <label className="col-md-4 col-xs-12 text-right">
                                    {translations(locale).homework.file || null}
                                </label>
                                <div className="col-md-8 col-xs-12 ">
                                    {
                                        homeworkInfo && homeworkInfo.files && homeworkInfo.files.length > 0
                                            ?
                                            homeworkInfo.files.map(function (file, i) {
                                                return (
                                                    <div key={'modalFiles__' + i} className='mb-2' style={{backgroundColor: '#ddd', borderRadius: '5px', padding: '10px', display: 'block'}}>
                                                        <a style={{color: '#44464e'}} href={file.path} target={"_blank"}>{file.fileName}</a>
                                                    </div>
                                                )

                                            })
                                            : <b>{translations(locale).homework.no_file}</b>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="m-form__group row">
                        <div className="col-12">
                            <div className="table-responsive">
                                <table className="table table-bordered react-datatable table-head-bolder">
                                    <thead>
                                    <tr>
                                        <th>{translations(locale).status || null}</th>
                                        <th>{translations(locale).created_date || null}</th>
                                        <th>{translations(locale).created_user || null}</th>
                                        <th>{translations(locale).homeworkReport.takenScore || null}</th>
                                        <th>{translations(locale).description || null}</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {
                                        homeworkDetail && homeworkDetail.length > 0 && homeworkDetail.map(function (obj, i) {
                                            let typeStyle = i === 0
                                                ?
                                                {
                                                    color: 'white',
                                                    backgroundColor: obj.color,
                                                    border: '1px solid ' + obj.color,
                                                    boxShadow: 'rgba(' + hexToRgb(obj.color).r + ', ' + hexToRgb(obj.color).g + ', ' + hexToRgb(obj.color).b + ', 0.19) 0px 5px 10px 2px'
                                                }
                                                :
                                                {
                                                    color: obj.color,
                                                    backgroundColor: 'white',
                                                    border: '1px solid #' + obj.color,
                                                    boxShadow: 'rgba(' + hexToRgb(obj.color).r + ', ' + hexToRgb(obj.color).g + ', ' + hexToRgb(obj.color).b + ', 0.19) 0px 5px 10px 2px',
                                                };

                                            var typeHtml = <div
                                                className="ui checked radio checkbox circle-item"
                                                style={typeStyle}
                                                dangerouslySetInnerHTML={{
                                                    __html: '<label>' + obj.shortName + '</label>'
                                                }}></div>;

                                            return (
                                                <tr key={i}>
                                                    <td className={'trigger-inner-container text-center'}>
                                                        {typeHtml}
                                                    </td>
                                                    <td className={'trigger-inner-container'}>{obj.checkedDate}</td>
                                                    <td className={'trigger-inner-container'}>{obj.firstname}</td>
                                                    <td className={'trigger-inner-container'}>{obj.takenScore}</td>
                                                    <td className={'trigger-inner-container'}>{obj.comment}</td>
                                                </tr>
                                            )
                                        })
                                    }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="actions modal-footer">
                    <div className="col-12 text-center">
                        <button className="btn m-btn--pill m-btn--air btn-outline-metal m-btn m-btn--custom"
                            onClick={_closeStudentHomeworkDetailModal}>{translations(locale).close || null}
                        </button>
                    </div>
                </div>
            </Modal>
            <Modal
                size={'fullscreen'}
                dimmer={'blurring'}
                open={studentHomeworksModal}
                onClose={_closeStudentHomeworksModal}
                className="react-modal"
            >
                <div className="header">
                    {studentInfo?.firstName || ''}
                    <button type="button" className="close" onClick={_closeStudentHomeworksModal}>
                        <CloseIcon />
                    </button>
                </div>
                <div className="content">
                    <div className="form-group m-form__group row">
                        <div className="col-md-4 col-xs-12">
                            <img 
                                src={studentInfo?.avatar || null}
                                className="img-responsive img-circle" 
                                style={{
                                    width: '100px',
                                    height: '100px',
                                    display: 'block',
                                    marginLeft: 'auto',
                                    objectFit: 'cover'
                                }}
                            />
                        </div>
                        <div className="col-md-8 col-xs-12">
                            <div className="m-form__group row">
                                <label className="col-md-4 col-xs-12 text-right">
                                    {translations(locale).className || null}:
                                </label>
                                <div className="col-md-8 col-xs-12">
                                    <b>{studentInfo?.className || null}</b>
                                </div>
                            </div>
                            <div className="m-form__group row">
                                <label className="col-md-4 col-xs-12 text-right">
                                    {translations(locale).student.student_code || null}
                                </label>
                                <div className="col-md-8 col-xs-12 ">
                                    <b>{studentInfo?.studentCode || null}</b>
                                </div>
                            </div>
                            <div className="m-form__group row">
                                <label className="col-md-4 col-xs-12 text-right">
                                    {translations(locale).student.last_name || null}:
                                </label>
                                <div className="col-md-4 col-xs-12 ">
                                    <b>{studentInfo?.lastName || null}</b>
                                </div>
                            </div>
                            <div className="m-form__group row">
                                <label className="col-md-4 col-xs-12 text-right">
                                    {translations(locale).student.first_name || null}:
                                </label>
                                <div className="col-md-8 col-xs-12">
                                    <b>{studentInfo?.firstName || null}</b>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="m-form__group row">
                        <div className="col-12">
                            <div className="table-responsive">
                                <table className="table table-bordered react-datatable table-head-bolder">
                                    <thead>
                                    <tr>
                                        <th>№</th>
                                        <th>{translations(locale).exam_template.created_date || null}</th>
                                        <th>{translations(locale).homework.title || null}</th>
                                        <th>{translations(locale).status || null}</th>
                                        <th></th>
                                        <th>{translations(locale).created_date || null}</th>
                                        <th>{translations(locale).homework.score || null}</th>
                                        <th>{translations(locale).homeworkReport.takenScore || null}</th>
                                        <th>{translations(locale).description || null}</th>
                                        <th>{translations(locale).exam_template.created_user || null}</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            studentHomeworks && studentHomeworks.length > 0 && studentHomeworks.map(function (obj, i) {
                                                let typeHtml = '-'
                                                let isSavedText = '';
                                                if(obj['isSaved'] == 1 && obj['takenScore'] >= 0 && obj['dtlCreatedDate']){
                                                    isSavedText = <div
                                                        className="homework-sent"
                                                        dangerouslySetInnerHTML={{
                                                            __html: '<span style="cursor: pointer">' + translations(locale).homework.homework_sent + '</span>'
                                                        }}></div>;
                                                } else if (!obj['dtlCreatedDate'] && !obj['takenScore']){
                                                    isSavedText = <div
                                                        className="homework-uncheck"
                                                        dangerouslySetInnerHTML={{
                                                            __html: '<span style="cursor: pointer">' + translations(locale).homeworkReport.notChecked + '</span>'
                                                        }}></div>;
                                                } else {
                                                    isSavedText = <div
                                                        className="homework-not-sent"
                                                        dangerouslySetInnerHTML={{
                                                            __html: '<span style="cursor: pointer">' + translations(locale).homework.homework_not_sent + '</span>'
                                                        }}></div>;
                                                }
                                                if(obj.color && obj.shortName){
                                                    let typeStyle = [];
                                                    if(parseInt(obj['dtlCount']) == 1){
                                                        typeStyle = {
                                                            color: obj.color,
                                                            backgroundColor: 'white',
                                                            border: '1px solid ' + obj.color,
                                                            boxShadow: 'rgba(' + hexToRgb(obj.color).r + ', ' + hexToRgb(obj.color).g + ', ' + hexToRgb(obj.color).b + ', 0.19) 0px 5px 10px 2px',
                                                            cursor: 'pointer'
                                                        }
                                                    } else {
                                                        typeStyle = {
                                                            color: 'white',
                                                            backgroundColor: obj.color,
                                                            border: '1px solid ' + obj.color,
                                                            boxShadow: 'rgba(' + hexToRgb(obj.color).r + ', ' + hexToRgb(obj.color).g + ', ' + hexToRgb(obj.color).b + ', 0.19) 0px 5px 10px 2px',
                                                            cursor: 'pointer'
                                                        }
                                                    }

                                                    typeHtml = <div
                                                        className="ui checked radio checkbox circle-item"
                                                        style={typeStyle}
                                                        dangerouslySetInnerHTML={{
                                                            __html: '<label style="cursor: pointer">' + obj.shortName + '</label>'
                                                        }}></div>;
                                                }

                                                return (
                                                    <tr key={i}>
                                                        <td className={'trigger-inner-container'}>{i + 1}</td>
                                                        <td className={'trigger-inner-container'}>{obj.createdDate ? obj.createdDate : '-'}</td>
                                                        <td className={'trigger-inner-container'}> <div dangerouslySetInnerHTML={{__html: obj.description ? htmlDecode(obj.description) : ''}}></div></td>
                                                        <td className={'trigger-inner-container'}>{isSavedText}</td>
                                                        <td className={'trigger-inner-container text-center'} onClick={() => _handleHomeworkTypeClick(obj.createdDate, obj.studentId)} style={{cursor: 'pointer'}}>{typeHtml}</td>
                                                        <td className={'trigger-inner-container'}>{obj['dtlCreatedDate'] ? obj['dtlCreatedDate'] : '-'}</td>
                                                        <td className={'trigger-inner-container'}>{obj.totalScore ? obj.totalScore : '-'}</td>
                                                        <td className={'trigger-inner-container'}>{obj.takenScore ? obj.takenScore : '-'}</td>
                                                        <td className={'trigger-inner-container'}>{obj.comment ? obj.comment : ''}</td>
                                                        <td className={'trigger-inner-container'}>{obj.firstName ? obj.firstName : '-'}</td>
                                                    </tr>
                                                )
                                            })
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="actions modal-footer">
                    <div className="col-12 text-center">
                        <button className="btn m-btn--pill m-btn--air btn-outline-metal m-btn m-btn--custom"
                                onClick={_closeStudentHomeworksModal}>{translations(locale).close || null}
                        </button>
                    </div>
                </div>
            </Modal>
        </NModal >
    )
}

export default HomeworkModal