import {useState} from 'react'
import message from 'modules/message'
import React, {useEffect} from 'react'
import secureLocalStorage from 'react-secure-storage'
import { Modal } from 'react-bootstrap'
// import {fetchRequest} from 'utils/fetchRequest'
import {translations} from 'utils/translations'
import {useLocation, useNavigate} from 'react-router'
// import {teacherJournalAttendance, teacherJournalAttendanceDelete} from 'utils/url'
import DayPickerInput from 'react-day-picker/DayPickerInput'
import {Col} from 'react-bootstrap'
import DeleteModal from './modal/delete'

const locale = secureLocalStorage?.getItem('selectedLang') || 'mn'

const AttendanceModal = ({onClose, data}) => {
    // const location = useLocation()
    // const navigate = useNavigate()

    const [loading, setLoading] = useState(false)

    const [title, setTitle] = useState('')
    const [dateRange, setDateRange] = useState([])
    const [reportLists, setReportLists] = useState([])
    const [filteredStudentsData, setFilteredStudentsData] = useState([])
    const [canDelete, setCanDelete] = useState(false)

    const [deleteParams, setDeleteParams] = useState(null)
    const [showDeleteModal, setShowDeleteModal] = useState(false)

    const [dates, setDates] = useState({
        startDate: null,
        endDate: null,
    })

    const init = (startDate, endDate) => {
        console.log('init')
        // setLoading(true)
        // fetchRequest(teacherJournalAttendance, 'POST', {
        //     startDate,
        //     endDate,
        //     group: location?.state?.group,
        //     season: location?.state?.season
        // })
        //     .then((res) => {
        //         if (res.success) {
        //             const {dateRange, reportLists, group} = res.data
        //             if (!res?.data?.canDelete) {
        //                 message(translations(locale)?.attendance?.unable_to_delete)
        //             }
        //             setCanDelete(res?.data?.canDelete)
        //             setDateRange(dateRange)
        //             setReportLists(reportLists)
        //             setFilteredStudentsData(reportLists)
        //             if (res.data?.reportLists && res.data?.reportLists.length > 0) {
        //                 setDates({
        //                     startDate: res.data?.dateRange[0]?.date || null,
        //                     endDate: res.data?.dateRange[res.data?.dateRange.length - 1]?.date || null
        //                 })
        //             }
        //             setTitle(`${group?.seasonName}, ${group?.subjectName}, ${group?.classes}, ${translations(locale)?.attendance.title}` || '')
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

    const attendanceTableBodyRender = () => {
        let rows = [];

        if (filteredStudentsData && filteredStudentsData.length > 0) {
            for (let i = 0; i < filteredStudentsData.length; i++) {
                let report = filteredStudentsData[i];
                let columns = [];

                if (dateRange && dateRange.length > 0) {
                    for (let m = 0; m < dateRange.length; m++) {
                        let rangeDate = dateRange[m];
                        let dateObj = null;

                        for (let n = 0; n < report['date'].length; n++) {
                            let reportDateObj = report['date'][n];
                            let reportDate = reportDateObj['date'];

                            if (rangeDate.date.toString() === reportDate.toString()) {
                                dateObj = reportDateObj;
                                break;
                            }
                        }

                        if (dateObj) {

                            for (let c = 0; c < rangeDate.colCount; c++) {
                                if (dateObj.logs.length > 0) {
                                    if (c < dateObj.logs.length) {
                                        let logObj = dateObj.logs[c];

                                        let reportValue = logObj['value'] ? logObj['value'].substring(0, 1) : null;
                                        let reportColor = logObj['color'];

                                        if (reportValue) {
                                            columns.push(
                                                <td key={'range_' + i + '_' + m + '_log_' + c} style={{padding: 3}}>
                                                    <div style={{
                                                        border: '1px solid ' + reportColor,
                                                        width: '30px',
                                                        height: '30px',
                                                        borderRadius: '25%',
                                                        textAlign: 'center',
                                                        backgroundColor: reportColor
                                                    }}>
                                                        <span style={{
                                                            color: 'white',
                                                            verticalAlign: 'middle',
                                                            fontSize: 18
                                                        }}>{reportValue}</span>
                                                    </div>
                                                </td>
                                            )
                                        } else {
                                            columns.push(
                                                <td key={'range_' + m + '_log_' + c}>
                                                </td>
                                            )
                                        }
                                    }

                                    for (let l = 0; l < dateObj.logs.length; l++) {

                                    }
                                } else {
                                    columns.push(
                                        <td key={i + '_range_' + m + '_col_' + c}>
                                        </td>
                                    )
                                }
                            }
                        } else {
                            for (let c = 0; c < rangeDate.colCount; c++) {
                                columns.push(
                                    <td key={'range_' + i + '_m_' + m + '_c_' + c}>
                                    </td>
                                )
                            }
                        }
                    }
                }

                rows.push(<tr key={'report_show_' + i}>
                    <td>{i + 1}</td>
                    <td>{report['studentCode']}</td>
                    <td>{report['studentLastName']}</td>
                    <td>{report['studentFirstName']}</td>
                    <td>{report['came']}</td>
                    <td>{report['percent']}%</td>
                    {columns}
                </tr>);
            }
        }

        return rows;
    };

    const handleSearch = keyword => {
        if (keyword)
            setFilteredStudentsData(reportLists?.filter(student =>
                student?.studentCode?.toLowerCase()?.includes(keyword) ||
                student?.studentFirstName?.toLowerCase()?.includes(keyword) ||
                student?.studentLastName?.toLowerCase()?.includes(keyword)
            ) || [])
        else
            setFilteredStudentsData(reportLists || [])
    }

    const _handlerStartDate = (day) => {
        let startDate = day?.toISOString()?.split('T')?.[0]
        init(startDate, dates.endDate)
    }

    const _handlerEndDate = (day) => {
        let endDate = day?.toISOString()?.split('T')?.[0]
        init(dates.startDate, endDate)
    }

    const excelDownload = () => {
        const header = [
            {value: translations(locale).student.student_code},
            {value: translations(locale).studentLastName},
            {value: translations(locale).studentFirstName},
            {value: translations(locale).foodDashboard.cameStudent},
            {value: translations(locale).percent},
        ];

        if (dateRange && dateRange.length) {
            for (const dateObj of dateRange) {
                header.push({
                    value: dateObj.name || dateObj.date,
                    width: dateObj.colCount && typeof dateObj.colCount === 'number' ? dateObj.colCount : 1,
                    vertical: true,
                })
            }
        }

        const records = [header];

        if (reportLists && reportLists.length) {
            for (const report of reportLists) {
                const row = [
                    {value: report.studentCode ? report.studentCode : null},
                    {value: report.studentLastName ? report.studentLastName : null},
                    {value: report.studentFirstName ? report.studentFirstName : null},
                    {value: report.came ? report.came : 0},
                    {value: report.percent ? `${report.percent}%` : '0%'},
                ];
                const {date} = report;
                if (dateRange && dateRange.length) {
                    for (const dateObj of dateRange) {
                        const {colCount} = dateObj;
                        if (colCount && typeof colCount === 'number') { // should be number type
                            if (date && date.length) {
                                const matchedDate = date.find(obj => obj.date === dateObj.date);
                                if (matchedDate && matchedDate.logs && matchedDate.logs.length) {
                                    for (const log of matchedDate.logs) {
                                        row.push({value: log.value, backgroundColor: log.color ? log.color : null});
                                    }
                                } else {
                                    for (let i = 0; i < colCount; i++) {
                                        row.push({value: null});
                                    }
                                }
                            } else {
                                row.push({value: null});
                            }
                        } else {
                            row.push({value: null});
                        }
                    }
                }
                records.push(row);
            }
        }

        const form = document.createElement('form');

        form.method = "POST";
        form.action = "/api/journal/attendance-excel-download";
        form.target = "_blank";
        form.id = 'myHomeworkReportExcelForm';

        const fileName = title;

        const fileNameEl = document.createElement('input');
        fileNameEl.type = 'hidden';
        fileNameEl.name = 'excelFileName';
        fileNameEl.value = fileName;

        const recordsEl = document.createElement('input');
        recordsEl.type = 'hidden';
        recordsEl.name = 'records';
        recordsEl.value = JSON.stringify(records);

        form.appendChild(fileNameEl);
        form.appendChild(recordsEl);

        document.body.appendChild(form);

        form.submit();
    }

    const getAttendanceIds = (date, i) => {
        let attIds = [];
        if (filteredStudentsData && filteredStudentsData.length > 0) {
            for (let st = 0; st < filteredStudentsData?.length; st++) {
                const studentRow = filteredStudentsData[st]

                if (studentRow?.date && studentRow?.date?.length > 0) {
                    const selectedDateObj = studentRow?.date?.find(obj => obj?.date === date)

                    if (selectedDateObj && selectedDateObj?.logs && selectedDateObj?.logs?.length > 0) {
                        for (let l = 0; l < selectedDateObj?.logs.length; l++) {
                            if (i === l) {
                                attIds.push(selectedDateObj?.logs[l]?.attId);
                            }
                        }
                    }
                }
            }
        }
        return attIds
    }

    const closeModal = () => {
        setDeleteParams(null)
        setShowDeleteModal(false)
    }

    const submitDelete = (params) => {
        console.log('submitDelete')
        // setLoading(true)
        // fetchRequest(teacherJournalAttendanceDelete, 'POST', params)
        //     .then((res) => {
        //         if (res.success) {
        //             init(dates?.startDate, dates?.endDate)
        //         } else {
        //             message(res.data.message)
        //             setLoading(false)
        //         }
        //         closeModal()
        //     })
        //     .catch(() => {
        //         message(translations(locale)?.err?.error_occurred)
        //         setLoading(false)
        //         closeModal()
        //     })
    }

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
                    {title}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className='m-portlet'>
                    <div className='m-portlet__body'>
                        <div className="row myReport-reportShowArea">
                            <div className='col-md-12'>
                                <div className='d-flex gap-05 justify-content-between align-items-center mb-2'>
                                    <div>
                                        <Col className='d-flex'>
                                            <div className='d-flex' style={{top: 17}}>
                                                <label className='modal-label mr-2' style={{
                                                    fontWeight: 800,
                                                    fontFamily: 'PinnacleBold',
                                                    position: 'relative',
                                                    top: 5
                                                }}>
                                                    {translations(locale)?.date}
                                                </label>
                                                <div className='pr-0'>
                                                    <DayPickerInput
                                                        value={dates?.startDate}
                                                        inputProps={{className: 'form-control'}}
                                                        placeholder={translations(locale)?.datePickerPlaceholder}
                                                        dayPickerProps={{disabledDays: {after: new Date(dates?.endDate)}}}
                                                        classNames={{
                                                            overlay: 'DayPickerInputOverlay',
                                                            container: 'position-relative'
                                                        }}
                                                        onDayChange={(day) => _handlerStartDate(day)}
                                                    />
                                                </div>
                                                <div className='pickerSeparator justify-content-center'
                                                     style={{height: 33}}>
                                                    <i className='la la-ellipsis-h'/>
                                                </div>
                                                <div className='pl-0'>
                                                    <DayPickerInput
                                                        value={dates?.endDate}
                                                        inputProps={{className: 'form-control'}}
                                                        placeholder={translations(locale)?.datePickerPlaceholder}
                                                        dayPickerProps={{disabledDays: {before: new Date(dates?.startDate)}}}
                                                        classNames={{
                                                            overlay: 'DayPickerInputOverlay',
                                                            container: 'position-relative'
                                                        }}
                                                        onDayChange={(day) => _handlerEndDate(day)}
                                                    />
                                                </div>
                                            </div>
                                        </Col>
                                    </div>
                                    <div className='d-flex'>
                                        <button
                                            style={{height: 33, width: 33}}
                                            className='btn m-btn--icon m-btn--icon-only btn-info br-03 mx-1'
                                            onClick={() => excelDownload()}
                                        >
                                            <i className='la la-file-excel-o' style={{fontSize: 22, color: 'white'}}/>
                                        </button>
                                        <input
                                            type='text'
                                            style={{width: '15rem'}}
                                            className='form-control br-08'
                                            placeholder={translations(locale)?.search}
                                            onChange={(e) => handleSearch(e?.target?.value?.toLowerCase())}
                                        />
                                    </div>
                                </div>
                                <div className="table-responsive">
                                    <table className="table table-bordered attendance">
                                        <thead>
                                        <tr>
                                            <th rowSpan={canDelete ? 2 : 1}>№</th>
                                            <th rowSpan={canDelete ? 2 : 1}>{translations(locale).student.student_code || null}</th>
                                            <th rowSpan={canDelete ? 2 : 1}>{translations(locale).studentLastName || null}</th>
                                            <th rowSpan={canDelete ? 2 : 1}>{translations(locale).studentFirstName || null}</th>
                                            <th rowSpan={canDelete ? 2 : 1}>{translations(locale).foodDashboard.cameStudent || null}</th>
                                            <th rowSpan={canDelete ? 2 : 1}>{translations(locale).percent || null}</th>
                                            {
                                                dateRange && dateRange.length > 0
                                                    ?
                                                    dateRange.map(function (date, index) {
                                                        return (
                                                            <th key={'thead_' + index} className="rotate"
                                                                colSpan={date.colCount}>
                                                                <div><span>{date.name}</span></div>
                                                            </th>
                                                        )
                                                    })
                                                    : null
                                            }
                                        </tr>
                                        {
                                            canDelete && <tr>
                                                {
                                                    dateRange && dateRange.length > 0
                                                        ?
                                                        dateRange.map(function (date, index) {
                                                            const thList = []
                                                            for (let i = 0; i < date?.colCount; i++) {
                                                                thList.push(<th key={'thead_' + index + '_' + i}>
                                                                    <div>
                                                                        <button
                                                                            onClick={() => {
                                                                                const params = {
                                                                                    attendances: getAttendanceIds(date?.date, i),
                                                                                    date: date?.date,
                                                                                    // group: location?.state?.group,
                                                                                    // season: location?.state?.season
                                                                                }
                                                                                setDeleteParams(params)
                                                                                setShowDeleteModal(true)
                                                                            }}
                                                                            className="btn btn-danger m-btn m-btn--icon btn-sm m-btn--icon-only m-btn--pill d-inline-flex align-items-center justify-content-center">
                                                                            <i className={'la la-trash la-2x'}/>
                                                                        </button>
                                                                    </div>
                                                                </th>)
                                                            }
                                                            return thList
                                                        })
                                                        : null
                                                }
                                            </tr>
                                        }
                                        </thead>
                                        <tbody>
                                        {attendanceTableBodyRender()}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <button className='btn m-btn--pill btn-outline-metal text-uppercase' onClick={onClose}>
                    {translations(locale)?.back}
                </button>
                {/* <div className='m-portlet__head justify-content-between align-items-center pr-0 pl-4'>
                    <span className='fs-13 pinnacle-bold' style={{ color: '#ff5b1d' }}>{title}</span>
                    <button className='btn m-btn--pill btn-link m-btn m-btn--custom' onClick={() => navigate(-1)}>
                        {translations(locale)?.back}
                    </button>
                </div> */}
            </Modal.Footer>
            {
                showDeleteModal &&
                <DeleteModal
                    onSubmit={() => {
                        submitDelete(deleteParams)
                    }}
                    onClose={closeModal}
                />
            }
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

export default AttendanceModal