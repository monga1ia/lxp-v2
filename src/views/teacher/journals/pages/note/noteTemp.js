import { useState } from 'react'
import message from 'modules/message'
import { Modal } from 'react-bootstrap'
import React, { useEffect } from 'react'
import secureLocalStorage from 'react-secure-storage'
// import { fetchRequest } from 'utils/fetchRequest'
import { translations } from 'utils/translations'
// import { teacherJournalNoteIndex, teacherJournalNoteSubmit, teacherJournalNoteDelete } from 'utils/url'
import EditIcon from '@mui/icons-material/Edit';
import ClearIcon from '@mui/icons-material/Clear';
import CheckIcon from '@mui/icons-material/Check';
import { cloneDeep } from 'lodash'
import * as XLSX from 'xlsx-js-style'
import { Checkbox } from 'semantic-ui-react'

const locale = secureLocalStorage?.getItem('selectedLang') || 'mn'

const buttonContainerStyle = {
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0.5rem',
    paddingRight: '0',
    paddingLeft: '0.5rem'
}

const buttonStyle = {
    height: '2.2rem',
    width: '2.2rem',
    alignItems: 'center',
    justifyContent: 'center'
}

const NoteModal = ({onClose, data}) => {

    const [loading, setLoading] = useState(false)

    console.log(data)

    const [title, setTitle] = useState('')
    const [initialList, setInitialList] = useState([])
    const [list, setList] = useState([
        {}
    ])
    const [query, setQuery] = useState('')
    const [file, setFile] = useState(null)
    const [allChecked, setAllChecked] = useState(false)

    const [updateView, setUpdateView] = useState(false)

    const init = () => {
        console.log('init')
        // setLoading(true)
        // fetchRequest(teacherJournalNoteIndex, 'POST', {
        //     group: location?.state?.group,
        //     season: location?.state?.season
        // })
        //     .then((res) => {
        //         if (res.success) {
        //             const { days = [], seasonName = null, groupName = null } = res.data
        //             setInitialList(days)
        //             setList(days)
        //             setTitle(`${seasonName || ''}, ${groupName || ''}`)
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

    const onRowEditClick = (index) => {
        const clone = [...list]
        for (let i = 0; i < clone.length; i++) {
            if (i === index) {
                clone[i].tmpTopic = clone[i].topic;
                clone[i].tmpActivity = clone[i].activity;
                clone[i].tmpConclusion = clone[i].conclusion;
                clone[i].edit = true;
                break;
            }
        }
        setList(clone)
    }

    const onRowCancelClick = (index) => {
        const clone = [...list]
        for (let i = 0; i < clone.length; i++) {
            if (i === index) {
                clone[i].tmpTopic = null;
                clone[i].tmpActivity = null;
                clone[i].tmpConclusion = null;
                clone[i].edit = false;
                break;
            }
        }
        setList(clone)
    }

    const onRowSaveClick = (index) => {
        const clone = [...list]
        for (let i = 0; i < clone.length; i++) {
            if (i === index) {
                clone[i].topic = clone[i].tmpTopic;
                clone[i].activity = clone[i].tmpActivity;
                clone[i].conclusion = clone[i].tmpConclusion;
                clone[i].edit = false;

                const rowData = [];
                rowData.push(clone[i]);
                submit(JSON.stringify(rowData), false)
                break;
            }
        }
        setList(clone)
    }

    const onRowClearClick = (index) => {
        const clone = [...list]
        for (let i = 0; i < clone.length; i++) {
            if (i === index) {
                clone[i].tmpTopic = null;
                clone[i].topic = null;
                clone[i].tmpActivity = null;
                clone[i].activity = null;
                clone[i].tmpConclusion = null;
                clone[i].conclusion = null;
                clone[i].edit = false;

                const rowData = [];
                rowData.push(clone[i]);
                deleteRow(JSON.stringify(rowData))

                break;
            }
        }
        setList(clone)
    }

    const noteTableBodyRender = () => {
        let rows = [];
        let rowId = 1;

        let cloneData = [...list]

        if (cloneData && cloneData.length > 0) {
            for (let i = 0; i < cloneData.length; i++) {
                let dayObj = cloneData[i];
                let queryFound = true;
                if (query && query.length > 0) {
                    if (dayObj?.topic?.toLowerCase()?.includes(query.toLowerCase())
                        || dayObj?.activity?.toLowerCase()?.includes(query.toLowerCase())
                        || dayObj?.conclusion?.toLowerCase()?.includes(query.toLowerCase())) {
                        queryFound = true;
                    } else {
                        queryFound = false;
                    }
                }

                if (queryFound) {
                    rows.push(
                        <tr key={'day_' + dayObj?.date + "_" + rowId}>
                            <td>{rowId}</td>
                            {
                                file && <td>
                                    <Checkbox
                                        checked={dayObj?.checked || false}
                                        onChange={(e, data) => onCheckboxHandler(data.checked, null, i)}
                                    />
                                </td>
                            }
                            <td>{dayObj?.date}</td>
                            <td>{dayObj?.timetable}</td>
                            <td>{dayObj?.edit === true
                                ? <input
                                    className="form-control"
                                    value={dayObj.tmpTopic || ''}
                                    onChange={(e) => onInputChange(e, 'tmpTopic', i)}
                                />
                                : dayObj?.topic}</td>
                            <td>{dayObj?.edit === true
                                ? <input
                                    className="form-control"
                                    value={dayObj.tmpActivity || ''}
                                    onChange={(e) => onInputChange(e, 'tmpActivity', i)}
                                />
                                : dayObj?.activity}</td>
                            <td>{dayObj?.edit === true
                                ? <input
                                    className="form-control"
                                    value={dayObj.tmpConclusion || ''}
                                    onChange={(e) => onInputChange(e, 'tmpConclusion', i)}
                                />
                                : dayObj?.conclusion}</td>
                            <td>
                                {
                                    dayObj?.edit === true
                                        ?
                                        <div className='d-flex'>
                                            <div className='d-flex' style={buttonContainerStyle}>
                                                <button className='d-flex btn m-btn--pill'
                                                    title={translations(locale)?.action?.register}
                                                    style={{ backgroundColor: '#3ebfa3', ...buttonStyle }}
                                                    onClick={() => {
                                                        onRowSaveClick(i)
                                                    }}>
                                                    <CheckIcon sx={{ fontSize: '1.4rem !important', color: 'white' }} />
                                                </button>
                                            </div>
                                            <div className='d-flex ' style={buttonContainerStyle}>
                                                <button className='d-flex btn m-btn--pill'
                                                    title={translations(locale)?.cancel}
                                                    style={{ backgroundColor: '#1d5383', ...buttonStyle }}
                                                    onClick={() => {
                                                        onRowCancelClick(i)
                                                    }}>
                                                    <ClearIcon sx={{ fontSize: '1.4rem !important', color: 'white' }} />
                                                </button>
                                            </div>
                                        </div>
                                        :
                                        <div className='d-flex'>
                                            <div className='d-flex' style={buttonContainerStyle}>
                                                <button className='d-flex btn m-btn--pill'
                                                    title={translations(locale)?.action?.edit}
                                                    style={{ backgroundColor: '#716aca', ...buttonStyle }}
                                                    onClick={() => {
                                                        onRowEditClick(i)
                                                    }}>
                                                    <i className='fa flaticon-edit-1'
                                                        style={{ color: 'white' }} />
                                                </button>
                                            </div>
                                            <div className='d-flex ' style={buttonContainerStyle}>
                                                <button className='d-flex btn m-btn--pill'
                                                    title={translations(locale)?.action?.delete}
                                                    style={{ backgroundColor: '#f4516b', ...buttonStyle }}
                                                    onClick={() => {
                                                        onRowClearClick(i)
                                                    }}>
                                                    <ClearIcon sx={{ fontSize: '1.4rem !important', color: 'white' }} />
                                                </button>
                                            </div>
                                        </div>
                                }
                            </td>
                        </tr>
                    )
                    rowId++;
                }
            }
        }
        return rows;
    };

    const submit = (notes = '', goBack = true) => {
        console.log('submit')
        // setLoading(true)
        // fetchRequest(teacherJournalNoteSubmit, 'POST', {
        //     group: location?.state?.group,
        //     season: location?.state?.season,
        //     notes
        // })
        //     .then((res) => {
        //         if (res.success) {
        //             if (file) {
        //                 setFile(null)
        //             }
        //             const cloneData = [...list];
        //             for (let c = 0; c < cloneData.length; c++) {
        //                 cloneData[c].checked = false
        //                 cloneData[c].edit = false
        //             }
        //             setList(cloneData)
        //             setUpdateView(!updateView)
        //             if (goBack) {
        //                 window.location.href = '/teacher/journals'
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

    const deleteRow = (notes = '') => {
        console.log('deleteRow')
        // setLoading(true)
        // fetchRequest(teacherJournalNoteDelete, 'POST', {
        //     group: location?.state?.group,
        //     season: location?.state?.season,
        //     notes
        // })
        //     .then((res) => {
        //         if (res.success) {

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

    const onInputChange = (e, field, index) => {
        let cloneData = [...list]
        if (cloneData && cloneData.length > 0) {
            for (let i = 0; i < cloneData.length; i++) {

                if (i === index) {
                    cloneData[i][field] = e.target.value
                    break;
                }
            }
        }
        setList(cloneData)
        setUpdateView(!updateView)
    }

    const handleSearch = keyword => {
        if (keyword) {
            setQuery(keyword)
        } else {
            setQuery('')
        }
    }

    const excelDownload = () => {
        const excelData = []
        excelData[0] = {
            '№': '',
            [translations(locale).ecourse?.topic_name?.toUpperCase()]: '',
            [translations(locale).subject?.courseActivities?.toUpperCase()]: '',
            [translations(locale).teacher?.onlineLesson?.conclusion?.toUpperCase()]: '',
            [translations(locale).class_date?.toUpperCase()]: '',
            [translations(locale).dashboardAttendence?.hour?.toUpperCase()]: '',
        }
        let index = 1;
        list.forEach((el, i) => {
            if (el?.timetable) {
                excelData[index - 1] = {
                    '№': index,
                    [(translations(locale).ecourse?.topic_name || '').toUpperCase()]: el?.topic,
                    [(translations(locale).subject?.courseActivities || '').toUpperCase()]: (el?.activity || ''),
                    [(translations(locale).teacher?.onlineLesson?.conclusion || '').toUpperCase()]: (el?.conclusion || ''),
                    [(translations(locale).class_date || '').toUpperCase()]: el?.date,
                    [(translations(locale).dashboardAttendence?.hour || '').toUpperCase()]: el?.timetable,
                }
                index++;
            }
        })

        const workbook = XLSX.utils.book_new()
        const worksheet = XLSX.utils.json_to_sheet(excelData)
        XLSX.utils.book_append_sheet(workbook, worksheet)
        XLSX.writeFile(workbook, `Багшийн тэмдэглэл` + '.xlsx')
    }

    const onSaveHandler = () => {
        const checkedList = list.filter(obj => {
            return obj?.checked === true;
        })

        if (checkedList && checkedList.length > 0) {
            if (file) {
                for (let c = 0; c < checkedList.length; c++) {
                    checkedList[c].topic = checkedList[c].tmpTopic || checkedList[c].topic;
                    checkedList[c].activity = checkedList[c].tmpActivity || checkedList[c].activity;
                    checkedList[c].conclusion = checkedList[c].tmpConclusion || checkedList[c].conclusion;
                }
            }
            submit(JSON.stringify(checkedList))
        } else {
            message(translations(locale)?.teacher?.journalNoteEmpty)
        }
    }

    const onCancelHandler = () => {
        setFile(null)
        setList(initialList)
    }

    const onCheckboxHandler = (value, type = null, index = null) => {
        let cloneData = [...list]
        if (type === 'all') {
            if (cloneData && cloneData.length > 0) {
                for (let i = 0; i < cloneData.length; i++) {
                    cloneData[i].checked = value;
                }
            }
            setAllChecked(value);
        } else {
            if (cloneData && cloneData.length > 0) {
                for (let i = 0; i < cloneData.length; i++) {
                    if (cloneData[i].timetable && index === i) {
                        cloneData[i].checked = value
                        break;
                    }
                }
            }
        }
        setList(cloneData)
    }

    const uploadFile = async e => {
        e.persist();
        if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0]);
            readFile(e.target.files[0])
        }

        // Had to use this one before. Because uploading same file again was not working.
        e.target.value = null;
    }

    const readFile = async (excelFile = null) => {
        if (excelFile) {
            const fileReader = await new FileReader()
            fileReader.readAsArrayBuffer(excelFile)

            fileReader.onload = (e) => {
                const bufferArray = e?.target.result
                const wb = XLSX.read(bufferArray, { type: "buffer" })
                const wsname = wb.SheetNames[0]
                const ws = wb.Sheets[wsname]

                const data = XLSX.utils.sheet_to_json(ws)
                const fileName = excelFile.name.split(".")[0]

                const clone = [...list]

                if (clone && clone?.length > 0) {
                    for (let i = 0; i < clone.length; i++) {
                        let dayObj = clone[i]
                        console.log('DATA', data)
                        console.log('DAY', data[i])
                        if (data && data?.length > 0
                            && typeof data[i] !== 'undefined') {
                            dayObj.topic = data[i][(translations(locale).ecourse?.topic_name || '').toUpperCase()];
                            dayObj.activity = data[i][(translations(locale).subject?.courseActivities || '').toUpperCase()];
                            dayObj.conclusion = data[i][(translations(locale).teacher?.onlineLesson?.conclusion || '').toUpperCase()]
                        }
                    }
                }
                setList(clone)
            }
        }
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
                <div className='m-portlet__body mx-4'>
                    <div className="row">
                        <div className='col-md-12'>
                            <div className='d-flex gap-05 justify-content-between align-items-center mb-2'>
                                {
                                    file
                                        ?
                                        <>
                                            <div className='d-flex'>
                                                <button type='button' onClick={() => onSaveHandler()}
                                                    className='btn m-btn--pill  btn-success d-flex align-items-center justify-content-center btn-sm text-uppercase'>
                                                    {translations(locale)?.save}
                                                </button>
                                                <button type='button' onClick={() => onCancelHandler()}
                                                    className='btn m-btn--pill  btn-link d-flex align-items-center justify-content-center btn-sm text-uppercase'>
                                                    {translations(locale)?.cancel}
                                                </button>
                                            </div>
                                        </>
                                        :
                                        <div className='d-flex'>
                                            <label
                                                htmlFor='fileInput'
                                                style={{ marginBottom: 0 }}
                                                className='btn m-btn--pill  btn-primary d-flex align-items-center justify-content-center btn-sm text-uppercase'
                                            >
                                                {translations(locale)?.excel_import}
                                            </label>
                                            <input
                                                style={{ display: 'none' }}
                                                accept=".xls, .xlsx, application/excel, application/vnd.msexcel, text/anytext, application/vnd. ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                                                id="fileInput"
                                                onChange={uploadFile}
                                                type="file"
                                                multiple
                                            />

                                            <button type='button'
                                                style={{ marginLeft: 10 }}
                                                onClick={excelDownload}
                                                className='btn m-btn--pill  btn-info d-flex align-items-center justify-content-center btn-sm text-uppercase'>
                                                {translations(locale)?.teacher?.journalExcelTemplate}
                                            </button>
                                        </div>
                                }
                                <div className='d-flex'>
                                    <button
                                        style={{ height: 33 }}
                                        className='btn btn-info br-03 mx-1'
                                        onClick={excelDownload}
                                    >
                                        <i className='la la-file-excel-o' style={{
                                            fontSize: 22,
                                            color: 'white'
                                        }} />
                                    </button>
                                    <input
                                        type='text'
                                        style={{ width: '15rem' }}
                                        className='form-control br-08'
                                        value={query}
                                        placeholder={translations(locale)?.search}
                                        onChange={(e) => handleSearch(e?.target?.value?.toLowerCase())}
                                    />
                                </div>
                            </div>
                            <div className="table-responsive">
                                <table className="table table-bordered attendance">
                                    <thead>
                                        <tr>
                                            <th width={'5%'}>№</th>
                                            {
                                                file && <th width={'5%'}>
                                                    <Checkbox
                                                        checked={allChecked}
                                                        onChange={(e, data) => onCheckboxHandler(data.checked, 'all')}
                                                    />
                                                </th>
                                            }
                                            <th width={'15%'}>{translations(locale).class_date || null}</th>
                                            <th width={'10%'}>{translations(locale).dashboardAttendence?.hour || null}</th>
                                            <th width={'20%'}>{translations(locale).ecourse?.topic_name || null}</th>
                                            <th width={'20%'}>{translations(locale).subject?.courseActivities || null}</th>
                                            <th width={'20%'}>{translations(locale).teacher?.onlineLesson?.conclusion || null}</th>
                                            <th width={'5%'}></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {noteTableBodyRender()}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <button className='btn m-btn--pill btn-outline-metal text-uppercase' onClick={onClose}>
                    {translations(locale)?.back}
                </button>
            </Modal.Footer>
            {
                loading &&
                <>
                    <div className='blockUI blockOverlay' />
                    <div className='blockUI blockMsg blockPage'>
                        <div className='m-loader m-loader--brand m-loader--lg' />
                    </div>
                </>
            }
        </Modal>
    )
}

export default NoteModal