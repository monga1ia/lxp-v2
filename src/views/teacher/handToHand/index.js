import {React, useState, useEffect} from 'react'
import HtmlHead from 'components/html-head/HtmlHead'
import BreadcrumbList from 'components/breadcrumb-list/BreadcrumbList'
import {Tab} from 'semantic-ui-react'
import DTable from 'modules/DataTable/DTable'
import secureLocalStorage from 'react-secure-storage'
import {Col, Container, Row, Modal} from 'react-bootstrap'
import {fetchRequest} from 'utils/fetchRequest'
import { useTranslation } from "react-i18next"
import {translations} from 'utils/translations'
import DayPickerInput from 'react-day-picker/DayPickerInput'
import { NDropdown as Dropdown } from 'widgets/Dropdown'
import message from 'modules/message'
import {
    teacherHandToHand,
    teacherHandToHandDismiss,
    teacherHandToHandDelete,
    teacherHandToHandReply,
    teacherHandToHandExcelReport,
} from 'utils/fetchRequest/Urls'
import {dateFormat} from "utils/Util";
import AirplaneTicketIcon from '@mui/icons-material/AirplaneTicket';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone'

const styles = {
    green: {
        backgroundColor: '#c5ebe3',
    },
    grey: {
        backgroundColor: '#f4f5f8',
    },
    white: {
        backgroundColor: 'white',
    },
    yellow: {
        backgroundColor: '#fcd890',
    },
}

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

const index = () => {
    const locale="mn";
    const localSchool = secureLocalStorage.getItem('selectedSchool')
    const { t } = useTranslation();

    const title = t('handToHand.title');
    const description = "E-learning";
    const breadcrumbs = [
        { to: "", text: "Home" },
        { to: "teacher/hand-to-hand", text: title }
    ];

    const [activeIndex, setActiveIndex] = useState(0)
    const [loading, setLoading] = useState(false)
    const [tmpLoading, setTmpLoading] = useState(false)

    const [selectedDate, setSelectedDate] = useState(null)
    const [weekdayIndex, setWeekdayIndex] = useState(null)
    const [students, setStudents] = useState([])

    const [selectedClass, setSelectedClass] = useState(null)

    const [seasonStart, setSeasonStart] = useState(null)
    const [seasonEnd, setSeasonEnd] = useState(null)
    const [startDate, setStartDate] = useState(null)
    const [endDate, setEndDate] = useState(null)

    const [studentReports, setStudentReports] = useState([])
    const [selectedStudent, setSelectedStudent] = useState(null)

    const [tmpDescription, setTmpDescription] = useState('')
    const [tmpDismiss, setTmpDismiss] = useState(null)
    const [showDismissModal, setShowDismissModal] = useState(false)

    const [updateView, setUpdateView] = useState(false)

    const [tableData, setTableData] = useState([
        {id: 11, code: 555, firstName: "john", lastName: "snow"}, 
        {id: 12, code: 333, firstName: "joy", lastName: "summer"}, 
        {id: 13, code: 888, firstName: "julie", lastName: "spring"}, 
        {id: 14, code: 77, firstName: "julia", lastName: "winter"}, 
    ]);
    
    const getCheckedStudents = () => {
        const checkedStudents = [];
        for (let s = 0; s < students?.length; s++) {
            if (students[s]?.checkable) {
                checkedStudents.push(students[s]);
            }
        }
        return checkedStudents;
    }

    const dayConfig = {
        showAllData: true,
        showPagination: false,
        excelFileName: (t('handToHand.title') + ' ' + t('by_day') + ' ' + (selectedClass || {})?.name),
        excelExport: true,
        showLeftButton: getCheckedStudents().length > 0,
        leftButtonClassName: 'btn btn-info btn-sm m-btn--pill m-btn--uppercase d-inline-flex text-white',
        leftButtonText: t('handToHand.reply')
    }

    const reportConfig = {
        showAllData: true,
        showPagination: false,
        excelExport: true,
        excelFileRemote: true,
        // excelFileRemoteUrl: `/${teacherHandToHandExcelReport}?start=${startDate}&end=${endDate}`
    }

    const studentConfig = {
        showAllData: true,
        showPagination: false,
        excelFileName: (t('handToHand.title') + ' ' + t('by_student') + ' ' + (selectedClass || {})?.name),
        excelExport: true
    }

    const dayColumns = [
        {
            dataField: 'avatar',
            text: t('photo'),
            sort: false,
            width: 40,
            align: 'center',
            formatter: (cell) => <img
                    className='img-responsive img-circle'
                    src={cell || '/images/profile/avatar.png'}
                    width={40} height={40} alt='profile picture'
                    onError={(e) => {
                        e.target.onError = null
                        e.target.src = '/img/profile/avatar.png'
                    }}
                />
        },
        {
            dataField: 'code',
            text: t('student.student_code'),
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
            sort: true,
        },
        {
            dataField: 'requestDate',
            text: t('handToHand.requestDate'),
            sort: true,
        },
        {
            dataField: 'requestUser',
            text: t('handToHand.requestUser'),
            sort: true,
        },
    ]

    const reportInitialColumns = [
        {
            dataField: 'avatar',
            text: t('photo'),
            sort: false,
            width: 40,
            align: 'center',
            formatter: (cell) => <img
                    className='img-responsive img-circle'
                    src={cell || '/images/profile/avatar.png'}
                    width={40} height={40} alt='profile picture'
                    onError={(e) => {
                        e.target.onError = null
                        e.target.src = '/img/profile/avatar.png'
                    }}
                />
        },
        {
            dataField: 'code',
            text: t('student.student_code'),
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
            sort: true,
        }
    ]
    const [reportColumns, setReportColumns] = useState(reportInitialColumns)

    const studentColumns = [
        {
            dataField: 'date',
            text: t('date'),
            sort: true,
        },
        {
            dataField: 'requestDate',
            text: t('handToHand.requestDate'),
            sort: true,
        },
        {
            dataField: 'relationType',
            text: t('handToHand.requestRelationType'),
            sort: true,
        },
        {
            dataField: 'requestUser',
            text: t('handToHand.requestUser'),
            sort: true,
        },
    ]

    const contextMenus = [
        {
            key: 'dismiss',
            icon: <AirplaneTicketIcon sx={{ fontSize: '2rem !important', color: '#ff5b1d' }} />,
            title: t('handToHand.dismiss') || "",
        },
        {
            key: 'delete',
            icon: <DeleteTwoToneIcon sx={{ fontSize: '2rem !important', color: '#ff5b1d' }} />,
            title: t('action.delete') || "",
        }
    ]

    const loadData = (date = null, startDate = null, endDate = null, student = null) => {
        const params = {
            viewType: activeIndex === 0 ? 'DAY' : (activeIndex === 1 ? 'REPORT' : 'STUDENT'),
            date,
            student,
            start: startDate,
            end: endDate
        }
        setLoading(true)
        // fetchRequest(teacherHandToHand, 'POST', params)
        //     .then((res) => {
        //         if (res.success) {
        //             setSelectedClass(res?.data?.class)
        //             setWeekdayIndex(parseInt(res?.data?.weekdayIndex, 10))
        //             setSelectedDate(res?.data?.date)
        //             setSeasonStart(res?.data?.seasonStart)
        //             setSeasonEnd(res?.data?.seasonEnd)

        //             if (activeIndex === 1) {
        //                 if (res?.data?.dateRanges && res?.data?.dateRanges?.length > 0) {
        //                     const newReportColumns = reportInitialColumns;
        //                     for (let d = 0; d < res?.data?.dateRanges?.length; d++) {
        //                         const dateStr = res?.data?.dateRanges[d];
        //                         newReportColumns.push({
        //                             dataField: dateStr,
        //                             text: dateStr,
        //                             sort: true,
        //                             style: (cell, row) => {
        //                                 return {
        //                                     textAlign: 'center',
        //                                     backgroundColor: (!cell?.requested && !cell?.canReply) ? '#f9a8B5' : (cell?.dismissed ? '#f9b822': 'white')
        //                                 }
        //                             },
        //                             formatter: (cell, row) => {
        //                                 if (cell?.requested) {
        //                                     if (!cell?.canReply) {
        //                                         return <i className='fas fa-circle' style={{color: '#6dd400'}}/>
        //                                     } else {
        //                                         return <i className='fas fa-circle' style={{color: '#d8d8d8'}}/>
        //                                     }
        //                                 } else
        //                                     return <i className='fas fa-circle' style={{color: '#d8d8d8'}}/>
        //                             }
        //                         })
        //                     }
        //                     setReportColumns(newReportColumns)
        //                 }
        //             } else if (activeIndex === 2) {
        //                 setStudentReports(res?.data?.dateRanges)
        //             }

        //             setStudents(res?.data?.students)
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

    useEffect(() => {
        tableData?.forEach(el => {
            el.contextMenuKeys = 'dismiss, delete'
        })
        
    }, [tableData])

    // useEffect(() => {
    //     loadData(selectedDate, startDate, endDate, selectedStudent)
    // }, [activeIndex])

    const onTabChange = (data) => {
        setActiveIndex(data?.activeIndex);
    }

    const onDayChange = (day) => {
        let selectedDay = dateFormat(new Date(day));
        setSelectedDate(selectedDay)
        loadData(selectedDay)
    }

    const dateChange = (type, date) => {
        let selectedDay = dateFormat(new Date(date));

        let start = null;
        let end = null;
        if (type === 'start') {
            start = selectedDay;
            end = endDate;
            setStartDate(selectedDay)
        } else if (type === 'end') {
            start = startDate;
            end = selectedDay;
            setEndDate(selectedDay)
        }
        if (start && end) {
            if (activeIndex === 1) {
                loadData(null, start, end)
            } else if (activeIndex === 2) {
                if (selectedStudent) {
                    loadData(null, start, end, selectedStudent)
                }

            }
        }
    }

    const handlerDayPickerShow = () => {
        // $('.m-body .m-wrapper').css('margin-bottom', '150px');
    }

    const handlerDayPickerHide = () => {
        // $('.m-body .m-wrapper').css('margin-bottom', '1rem');
    }

    const onCheckChange = (key, rowIndex, checked, id) => {
        const list = [...students]
        if (key === 'allCheck') {
            for (let s = 0; s < list?.length; s++) {
                if (list[s]?.canReply) {
                    list[s].checkable = checked;
                }
            }
        } else {
            for (let s = 0; s < list?.length; s++) {
                if (list[s]?.canReply && list[s]?.id === id) {
                    list[s].checkable = checked;
                    break;
                }
            }
        }
        setStudents(list)
        setUpdateView(!updateView)
    }

    const onReply = () => {
        if (getCheckedStudents().length > 0) {
            const studentIds = [];
            for (let st = 0; st < getCheckedStudents()?.length; st++) {
                studentIds.push(getCheckedStudents()[st]?.id)
            }

            const params = {
                date: selectedDate,
                students: studentIds
            }
            setLoading(true)
            // fetchRequest(teacherHandToHandReply, 'POST', params)
            //     .then((res) => {
            //         if (res.success) {
            //             setStudents(res?.data?.students)
            //         } else {
            //             message(res.data.message)
            //         }
            //         setLoading(false)
            //     })
            //     .catch(() => {
            //         message(t('err.error_occurred'))
            //         setLoading(false)
            //     })

        } else {
            message(t('handToHand.replyEmpty'))
        }
    }

    const onDailyInteraction = (params) => {
        console.log('Params', params)
    }

    const onReportInteraction = (params) => {
        console.log('pa', params)
    }

    const onStudentChange = (studentId) => {
        setSelectedStudent(studentId)

        if (startDate && endDate) {
            loadData(null, startDate, endDate, studentId)
        }
    }

    const handleRowStyle = row => {
        if (row?.requested) {
            if (row?.canReply) {
                return styles?.white
            } else {
                if (row?.dismissed) {
                    return styles?.yellow
                } else {
                    return styles?.green
                }
            }
        } else {
            return styles?.grey
        }
    }

    const clearDateRange = () => {
        setStartDate(null)
        setEndDate(null)
    }

    const onContextMenuClick = (id, key) => {
        console.log('id is', id, 'key is', key);
        if (id && key) {
            const selectedStudent = students?.find(obj => {
                return obj?.id === id
            });
            if (key === 'dismiss') {
                setTmpDismiss(selectedStudent)
                setShowDismissModal(true)
            } else if (key === 'delete') {
                submitDelete(selectedStudent)
            }
        }
    }

    const closeDismissModal = () => {
        setTmpDismiss(null)
        setShowDismissModal(false)
    }

    const submitDismiss = () => {
        if (tmpDismiss && tmpDescription && tmpDescription?.length > 0) {
            const params = {
                date: selectedDate,
                student: tmpDismiss?.id,
                description: tmpDescription
            }
            setTmpLoading(true)
            // fetchRequest(teacherHandToHandDismiss, 'POST', params)
            //     .then((res) => {
            //         if (res.success) {
            //             setStudents(res?.data?.students)
            //             closeDismissModal()
            //         } else {
            //             message(res.data.message)
            //         }
            //         setTmpLoading(false)
            //     })
            //     .catch(() => {
            //         message(t('err.error_occurred'))
            //         setTmpLoading(false)
            //     })
        }
    }

    const submitDelete = (studentObj = null) => {
        if (studentObj) {
            const params = {
                date: selectedDate,
                student: studentObj?.id
            }
            setLoading(true)
            // fetchRequest(teacherHandToHandDelete, 'POST', params)
            //     .then((res) => {
            //         if (res.success) {
            //             setStudents(res?.data?.students)
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
                                    activeIndex={activeIndex}
                                    renderActiveOnly
                                    menu={{secondary: true, pointing: true, className: 'primaryColor m-0 h-4'}}
                                    onTabChange={(e, data) => onTabChange(data)}
                                    className='m-portlet-header'
                                    panes={[
                                        {
                                            menuItem: t('by_day'),
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
                                                                value={`${selectedDate ? selectedDate : ''} ${selectedDate && weekdayIndex ? WEEKDAYS_LONG[locale][weekdayIndex] : ''}`}
                                                                hideOnDayClick={true}
                                                                inputProps={{readOnly: true}}
                                                                placeholder={t('datePickerPlaceholder')}
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
                                                                    container: 'myToday-DayPicker',
                                                                    overlay: 'DayPickerInputOverlay'
                                                                }}
                                                                onDayPickerShow={handlerDayPickerShow}
                                                                onDayPickerHide={handlerDayPickerHide}
                                                            />
                                                        </div>
                                                        <a href="#" style={{color: 'black'}} onClick={() => {
                                                            let selectedDay = selectedDate.substring(0, 10);
                                                            let date = new Date(selectedDay);
                                                            date.setDate(date.getDate() + 1);
                                                            onDayChange(dateFormat(date));
                                                        }}
                                                        className="d-flex align-items-center justify-content-center no-decoration">
                                                            <i className='la la-angle-right'/>
                                                        </a>
                                                </div>
                                                    <DTable
                                                        checkable
                                                        onCheckable={onCheckChange}
                                                        clickContextMenu
                                                        locale={locale}
                                                        config={dayConfig}
                                                        data={tableData}
                                                        rowStyle={handleRowStyle}
                                                        columns={dayColumns}
                                                        individualContextMenus={true}
                                                        contextMenus={contextMenus}
                                                        onContextMenuItemClick={(id, key, row) => onContextMenuClick(id, key)}
                                                        onInteraction={onDailyInteraction}
                                                        totalDataSize={students?.length}
                                                        onLeftButtonClick={onReply}
                                                    />
                                                </div>
                                            )

                                        },
                                        {
                                            menuItem: t('handToHand.report'),
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
                                                        onDayChange={(e) => dateChange('start', e)}
                                                        value={startDate}
                                                        hideOnDayClick={true}
                                                        inputProps={{className: 'form-control'}}
                                                        placeholder={t('datePickerPlaceholder')}
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
                                                        onDayChange={(e) => dateChange('end', e)}
                                                        value={endDate}
                                                        hideOnDayClick={true}
                                                        inputProps={{className: 'form-control'}}
                                                        placeholder={t('datePickerPlaceholder')}
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
                                                            container: 'position-relative'
                                                        }}
                                                    />                                                    
                                                </div>
                                                    <DTable
                                                        locale={locale}
                                                        config={reportConfig}
                                                        data={tableData}
                                                        columns={reportColumns}
                                                        onInteraction={onReportInteraction}
                                                        totalDataSize={students?.length}
                                                    />
                                                </div>                                               
                                            )
                                        },
                                        {
                                            menuItem: t('by_student'),
                                            render: () => (
                                                <div className='m-portlet__body'>
                                                    <div className='d-flex justify-content-center'>
                                                        <Row>
                                                            <Col>
                                                            <div className='d-flex justify-content-center gap-3'>
                                                            <label
                                                                    className="col-form-label text-right label-pinnacle-bold">
                                                                    {translations(locale)?.student?.title}*
                                                                </label>
                                                                <Dropdown
                                                                    fluid
                                                                    clearable
                                                                    selection
                                                                    value={selectedStudent}
                                                                    closeOnChange
                                                                    options={(students || []).map(studentObj => {
                                                                        return {
                                                                            value: studentObj?.id,
                                                                            text: studentObj?.code + ' ' + studentObj?.firstName + ' (' + studentObj?.lastName + ')'
                                                                        }
                                                                    })}
                                                                    placeholder={'-' + translations(locale)?.select + '-'}
                                                                    onChange={(e, data) => onStudentChange(data?.value)}
                                                                /> 
                                                            </div>
                                                                                                                           
                                                            </Col>
                                                            <Col>
                                                            <div className='d-flex justify-content-center'>
                                                                <DayPickerInput
                                                                        onDayChange={(e) => dateChange('start', e)}
                                                                        value={startDate}
                                                                        hideOnDayClick={true}
                                                                        inputProps={{className: 'form-control'}}
                                                                        placeholder={t('datePickerPlaceholder')}
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
                                                                        onDayChange={(e) => dateChange('end', e)}
                                                                        value={endDate}
                                                                        hideOnDayClick={true}
                                                                        inputProps={{className: 'form-control'}}
                                                                        placeholder={t('datePickerPlaceholder')}
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
                                                                            container: 'position-relative'
                                                                        }}
                                                                    />
                                                            </div>
                                                            </Col>
                                                        </Row>
                                                    </div>
                                                        <DTable
                                                            locale={locale}
                                                            config={studentConfig}
                                                            data={studentReports}
                                                            columns={studentColumns}
                                                            totalDataSize={studentReports?.length}
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
            {/* tmpDismiss && */}
            {
                showDismissModal &&  
                <Modal
                    centered
                    show={true}
                    size='lg'
                    onHide={closeDismissModal}
                    dimmer='blurring'
                    aria-labelledby="contained-modal-title-vcenter"
                >
                    <Modal.Header closeButton style={{padding: '1rem'}}>
                        <Modal.Title className="modal-title d-flex flex-row justify-content-between w-100">
                            {t('handToHand.dismiss')}
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className='content'>
                            <Row className={'mb-4'}>
                                <Col md={3} className={"text-right"}>
                                    <img src={tmpDismiss?.avatar || '/images/avatar.png'}
                                        className="m--img-rounded m--marginless m--img-centered"
                                        width={80}
                                        height={80}
                                        alt="avatar" />
                                </Col>
                                <Col md={9}>
                                    <Row className='form-group m-0'>
                                        <Col className='text-right' md={4}>
                                            <label className="text-right">
                                                {t('className')}
                                            </label>
                                        </Col>
                                        <Col>
                                            <label className="label-pinnacle-bold">
                                                {tmpDismiss?.className}
                                            </label>
                                        </Col>
                                    </Row>
                                    <Row className='form-group m-0'>
                                        <Col className='text-right' md={4}>
                                            <label className="text-right">
                                                {t('studentCode')}
                                            </label>
                                        </Col>
                                        <Col>
                                            <label className="label-pinnacle-bold">
                                                {tmpDismiss?.code}
                                            </label>
                                        </Col>
                                    </Row>
                                    <Row className='form-group m-0'>
                                        <Col className='text-right' md={4}>
                                            <label className="text-right">
                                                {t('studentLastName')}
                                            </label>
                                        </Col>
                                        <Col>
                                            <label className="label-pinnacle-bold">
                                                {tmpDismiss?.lastName}
                                            </label>
                                        </Col>
                                    </Row>
                                    <Row className='form-group m-0'>
                                        <Col className='text-right' md={4}>
                                            <label className="text-right">
                                                {t('studentFirstName')}
                                            </label>
                                        </Col>
                                        <Col>
                                            <label className="label-pinnacle-bold">
                                                {tmpDismiss?.firstName}
                                            </label>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                            <Row>
                                <Col md={2} />
                                <Col md={2} className="text-right">
                                    <label className="label-pinnacle-bold">
                                        {t('description')}*
                                    </label>
                                </Col>
                                <Col md={6}>
                                    <textarea
                                        className="form-control m-input"
                                        placeholder={t('insert_description')}
                                        value={tmpDescription}
                                        style={{
                                            minHeight: 100
                                        }}
                                        onChange={(e) => setTmpDescription(e.target.value)}
                                    />
                                </Col>
                            </Row>
                        </div>
                    </Modal.Body>
                    <Modal.Footer className="text-center">
                        <button 
                            onClick={closeDismissModal}
                            className="btn m-btn--pill btn-outline-metal text-uppercase"
                        >
                            {t('close')}        
                        </button>
                        <button
                            onClick={submitDismiss}
                            className="btn m-btn--pill btn-success text-uppercase ml-3"
                        >
                            {t('save')}
                        </button>
                    </Modal.Footer>
                    {
                        tmpLoading &&
                        <>
                            <div className="blockUI blockOverlay"/>
                            <div className="blockUI blockMsg blockPage">
                                <div className="m-loader m-loader--brand m-loader--lg"/>
                            </div>
                        </>
                    }
                </Modal>
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