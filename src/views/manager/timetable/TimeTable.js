import React, {useState, useEffect, useRef} from 'react'
import {translations} from 'utils/translations'
import {Row, Col, Image} from 'react-bootstrap'
import {Tab} from 'semantic-ui-react'
import ViewModal from './modal/StudentViewModal'
import DeleteModal from './modal/DeleteModal'
import {useDispatch, useSelector} from 'react-redux'
// import {
//     fetchClubStudents as fetchStudent,
//     fetchClubTimetablePrevSeasonData as fetchPrev,
//     fetchClubTimetable as fetch
// } from 'Actions/action'
import popup from 'modules/message'
import * as FileSaver from 'file-saver'
import * as XLSX from 'xlsx'
import DTable from 'modules/DataTable/DTable'
import {isArray} from 'lodash'
import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded';
import secureLocalStorage from 'react-secure-storage'
import CloseIcon from '@mui/icons-material/Close';
import ReactToPrint from 'react-to-print';
import { useTranslation } from 'react-i18next'

const TimeTable = ({
                       lang,
                       customDateAttendance = false,
                       records = {},
                       seasons = [],
                       currentSeason,
                       onSeasonChange = () => {},
                       setGroup = () => {
                       },
                       toAdd = () => {
                       }
                   }) => {

    const printRef = useRef();
    const hideOnPrintRef = useRef([]);
    const styleOnPrintRef = useRef([]);
    const dispatch = useDispatch()

    const { t } = useTranslation()

    const loading = useSelector(state => state.clubStudents?.loading || false)
    const success = useSelector(state => state.clubStudents?.success || false)
    const studentList = useSelector(state => state.clubStudents?.data?.studentList || [])
    const title = useSelector(state => state.clubStudents?.data?.title || '')
    const message = useSelector(state => state.clubStudents?.data?.message || '')

    const prevLoading = useSelector(state => state.clubTimetablePrevSeasonData?.loading || false)
    const prevSuccess = useSelector(state => state.clubTimetablePrevSeasonData?.success || false)
    const prevMessage = useSelector(state => state.clubTimetablePrevSeasonData?.data?.message || '')

    const days = {
        mon: lang === 'mn' ? 'Даваа' : 'Monday',
        tue: lang === 'mn' ? 'Мягмар' : 'Tuesday',
        wed: lang === 'mn' ? 'Лхагва' : 'Wednesday',
        thur: lang === 'mn' ? 'Пүрэв' : 'Thursday',
        fri: lang === 'mn' ? 'Баасан' : 'Friday',
        sat: lang === 'mn' ? 'Бямба' : 'Saturday',
        sun: lang === 'mn' ? 'Ням' : 'Sunday',
    }

    const columns = [
        {
            key: 'club',
            text: translations(lang).club?.title
        },
        {
            key: '1',
            text: days.mon
        },
        {
            key: '2',
            text: days.tue
        },
        {
            key: '3',
            text: days.wed
        },
        {
            key: '4',
            text: days.thur
        },
        {
            key: '5',
            text: days.fri
        },
        {
            key: '6',
            text: days.sat
        },
        {
            key: '7',
            text: days.sun
        },
        {
            key: 'buttons',
        },
    ]

    const getCellData = (cell, row, col) => {
        const clubDataClone =   [...row?.clubs] || []
        return (clubDataClone.map((data, index) => {
            return(
            <div style={index===0 ? {borderBottom: '1px solid rgb(235, 237, 242)' } : {borderTop: '1px solid rgb(235, 237, 242)'}}>
                    <div className='pl-3'>
                        <img className='img-circle' src={data?.teacherAvatar || '/img/profile/avatar.png'} width={40}
                            height={40} alt='profile picture'
                            onError={(e) => {
                                e.target.onError = null
                                e.target.src = '/img/profile/avatar.png'
                            }}
                        />
                    </div>
                    <div className='d-flex flex-column justify-content-center pl-3'>
                        <span
                            className='bolder underline'
                            style={{color: '#5867dd'}}
                            onClick={() => callViewModal(data.groupId)}
                        >
                            {data?.groupName}
                        </span>
                        <span>{data?.teacherFirstName}</span>
                    </div>
                </div>  
            )
        }))
    }

    const getCellText = (cell, row, key) => {
        const clubDataClone =   [...row?.clubs] || []
        console.log(key)

        const length = clubDataClone.length
        const tempa = 3
        return (clubDataClone.map((data, index) => {
            if (data[key]){
                return (
                    <div style={index===0 ? {borderBottom: '1px solid rgb(235, 237, 242)' } : {borderTop: '1px solid rgb(235, 237, 242)'}}>
                        {data[key].map((dt, index) => {
                            return <React.Fragment key={index}>
                                <div className='text-center'>
                                    <span>{dt.time}</span>
                                </div>
                                <div className='text-center'>
                                    <span>{dt.room}</span>
                                </div>
                            </React.Fragment>
                        })}
                    </div>
                )
            } else {
                return (
                    <div style={index===0 ? {borderBottom: '1px solid rgb(235, 237, 242)', height: 86} : {borderTop: '1px solid rgb(235, 237, 242)', height:86}}>
                    </div>
                )
            }
              
        }))
    }
    
    const [tabKey, setTabKey] = useState(currentSeason)
    const [tabIndex, setTabIndex] = useState(null)
    const [tabPanes, setTabPanes] = useState(null)
    const [tableData, setTableData] = useState([])
    const [searchKey, setSearchKey] = useState('')
    const [viewModal, setViewModal] = useState(false)
    const [viewDeleteModal, setViewDeleteModal] = useState(false)
    const [tempId, setTempId] = useState(null)
    const [viewClicked, setViewClicked] = useState(false)
    const [prevClicked, setPrevClicked] = useState(false)

    const [updateView, setUpdateView] = useState(false)

    const onEdit = value => {
        setGroup(value)
        toAdd()
    }

    const onSearch = key => {
        setSearchKey(key)
        if (tableData) {
            if (key) {
                const tempList = []
                records[tabKey].map(record => {
                    let childFound = false;
                    if (record?.clubs && record?.clubs?.length > 0) {
                        for (let c = 0; c < record?.clubs?.length; c++) {
                            const clubObj = record?.clubs[c];
                            if (clubObj?.groupName?.toLowerCase().includes(key.toLowerCase()) ||
                                clubObj?.teacherFirstName?.toLowerCase().includes(key.toLowerCase()) ||
                                clubObj?.subjectName?.toLowerCase().includes(key.toLowerCase())) {
                                childFound = true;
                                break;
                            }
                        }
                    }
                    if (record?.subject?.toLowerCase().includes(key.toLowerCase()) ||
                        record?.groupName?.toLowerCase().includes(key.toLowerCase()) ||
                        record?.teacherFirstName?.toLowerCase().includes(key.toLowerCase()) ||
                        record?.subjectName?.toLowerCase().includes(key.toLowerCase()) ||
                        childFound) {
                        tempList.push(record)
                    }
                })
                setTableData(tempList)
            } else {
                setTableData(records[tabKey])
            }
        }
    }

    const callViewModal = id => {
        if (id) {
            const params = {
                group: id
            }
            // dispatch(fetchStudent(params))
            setViewClicked(true)
        }
    }

    const toExcel = () => {
        if (tableData) {
            let filterRecords = tableData;
            let excel = [];
            if (filterRecords) {
                filterRecords.map(data => {
                    const clubData = data.clubs
                    if (clubData) {
                        clubData.map(cd => {
                            let recordCol = {};
                            recordCol[translations(lang).subject?.title] = data.subject
                            columns.map(col => {
                                if (col.key === 'club' && cd) {
                                    recordCol[translations(lang).club?.title] = cd.groupName
                                    recordCol[translations(lang).teacher?.title] = cd.teacherFirstName
                                } else {
                                    if (col.text && cd) {
                                        if (isArray(cd[col.key])) {
                                            let tempText = ''
                                            cd[col.key].map(d => {
                                                if (tempText) {
                                                    tempText += ', ' + d.time + ' - ' + (d.room || '')
                                                } else {
                                                    tempText = d.time + ' - ' + (d.room || '')
                                                }
                                            })
                                            recordCol[col.text] = tempText
                                        } else {
                                            recordCol[col.text] = ''
                                        }
                                    }
                                }
                            })
                            excel.push(recordCol);
                        })
                    }
                })
            }

            let fileName = translations(lang).timetable?.club_title;

            const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
            const fileExtension = '.xlsx';
            const season = seasons.find(s => s.key === tabKey)
            let label = 'data'
            if (season) {
                label = season.text
            }
            const sheets = {}
            const ws = XLSX.utils.json_to_sheet(excel);
            sheets[label] = ws
            const wb = {
                Sheets: sheets,
                SheetNames: [label]
            };
            const excelBuffer = XLSX.write(wb, {bookType: 'xlsx', type: 'array'});
            const excelData = new Blob([excelBuffer], {type: fileType});
            FileSaver.saveAs(excelData, fileName + fileExtension);
        }
    }

    const onPrevSeasonData = () => {
        if (tabKey) {
            const params = {
                season: tabKey
            }
            // dispatch(fetchPrev(params))
            setPrevClicked(true)
        }
    }

    const renderTh = () => {
        return columns.map(col => {
            if (col.key === 'buttons') {
                if (currentSeason === tabKey) {
                    if (printRef.current) {
                        return <th
                            ref={ref => {
                                hideOnPrintRef.current.push(ref)
                            }}
                            key={col.key}></th>
                    }
                } else {
                    return null
                }
            }
            return <th style={{fontSize: '12px'}} className='bolder p-4' key={col.key}>{col.text}</th>
        })
    }

    const renderTr = () => {
        if (tableData) {
            return tableData.map((rec, tIndex) => {
                if (rec.clubs.length > 1) {
                    return <React.Fragment key={rec.id}>
                        <tr key={rec.id}>
                            <td rowSpan={rec.clubs.length} className='text-center vertical-inherit'>
                                <span style={{color: '#4a4a4a', fontSize: '14px'}}>{rec.subject}</span>
                            </td>
                            {renderTd(rec.clubs[0])}
                        </tr>
                        {
                            rec.clubs.map((club, index) => {
                                if (index > 0 && club?.id) {
                                    return (
                                        <tr key={club?.id + rec.id + 'childTr'}>
                                            {
                                                index === 0 &&
                                                <td rowSpan={rec.clubs.length} className='text-center vertical-inherit'>
                                                    <span style={{
                                                        color: '#4a4a4a',
                                                        fontSize: '14px'
                                                    }}>{rec.subject}</span>
                                                </td>
                                            }
                                            {renderTd(club, index)}
                                        </tr>
                                    )
                                } else {
                                    return null
                                }
                            })
                        }
                    </React.Fragment>
                } else {
                    return <tr key={rec.id}>
                        <td rowSpan={rec.clubs.length} className='text-center vertical-inherit'>
                            <span style={{color: '#4a4a4a', fontSize: '14px'}}>{rec.subject}</span>
                        </td>
                        {renderTd(rec.clubs[0])}
                    </tr>
                }
            })
        }
    }

    const renderTd = (data, index) => {
        if (data) {
            return columns.map(col => {
                if (col.key === 'club') {
                    return <td
                        ref={ref => {
                            styleOnPrintRef.current.push(ref)
                        }}
                        className='vertical-inherit' key={col.key}>
                        <Row>
                            <div className='pl-3'>
                                <img className='img-circle' src={data?.teacherAvatar || '/img/profile/avatar.png'} width={40}
                                     height={40} alt='profile picture'
                                     onError={(e) => {
                                         e.target.onError = null
                                         e.target.src = '/img/profile/avatar.png'
                                     }}
                                />
                            </div>
                            <div className='d-flex flex-column justify-content-center pl-3'>
                                <span
                                    className='bolder underline'
                                    style={{color: '#5867dd'}}
                                    onClick={() => callViewModal(data.groupId)}
                                >
                                    {data?.groupName}
                                </span>
                                <span>{data?.teacherFirstName}</span>
                            </div>
                        </Row>
                    </td>
                } else if (col.key === 'buttons') {
                    if (currentSeason === tabKey) {
                        return <td
                            ref={ref => {
                                hideOnPrintRef.current.push(ref)
                            }}
                            key={col.key}
                            className='text-center vertical-inherit'
                            width={100}>
                            <button
                                className='btn btn-primary m-btn m-btn--icon btn-sm m-btn--icon-only m-btn--pill d-inline-flex align-items-center justify-content-center mr-2'
                                style={{
                                    backgroundColor: '#716aca',
                                }}
                                onClick={() => onEdit(data?.id || null)}
                            >
                                <i className="flaticon-edit"/>
                            </button>
                            <button
                                className='btn btn-danger m-btn m-btn--icon btn-sm m-btn--icon-only m-btn--pill d-inline-flex align-items-center justify-content-center'
                                onClick={() => {
                                    setTempId(data?.id || null)
                                    setViewDeleteModal(true)
                                }}
                            >
                                <CloseIcon/>
                            </button>
                        </td>
                    } else {
                        return null
                    }
                } else {
                    if (isArray(data[col.key])) {
                        return <td
                            ref={ref => {
                                styleOnPrintRef.current.push(ref)
                            }}
                            className='vertical-inherit' key={col.key}>
                            {
                                data[col.key].map((dt, index) => {
                                    return <React.Fragment key={index}>
                                        <div className='text-center'>
                                            <span>{dt.time}</span>
                                        </div>
                                        <div className='text-center'>
                                            <span>{dt.room}</span>
                                        </div>
                                    </React.Fragment>
                                })
                            }
                        </td>
                    } else {
                        return <td
                            ref={ref => {
                                styleOnPrintRef.current.push(ref)
                            }}
                            key={col.key}></td>
                    }

                }
            })
        } else {
            return null
        }
    }

    const tabChange = (e, data) => {
        if (seasons.length && data.panes.length) {
            setTabKey(data.panes[data.activeIndex].tabKey)
            onSeasonChange(data.panes[data.activeIndex].tabKey)
        }
    }

    useEffect(() => {
        getSeasonTabIndex(tabKey)
    }, [tabKey])

    useEffect(() => {
        if (viewClicked && !loading) {
            if (success) {
                setViewModal(true)
            } else {
                popup(message)
            }
        }
    }, [loading])

    // useEffect(() => {
    //     if (prevClicked && !prevLoading) {
    //         if (prevSuccess) {
    //             dispatch(fetch())
    //         } else {
    //             popup(prevMessage)
    //         }
    //     }
    // }, [prevLoading])

    useEffect(() => {
        if (currentSeason) {
            if (seasons) {
                let t = []
                seasons.map((tab) => {
                    if (tab) {
                        t.push({menuItem: tab.text, tabKey: tab.key})
                    }
                })
                setTabPanes(t)
            }
            setTabKey(currentSeason)

            setUpdateView(!updateView)
        }
    }, [currentSeason, loading])

    useEffect(() => {
        if (records && tabKey) {
            setTableData(records[tabKey])

            setUpdateView(!updateView)
        }
    }, [tabKey, records])

    const prepareToPrint = () => {
        hideOnPrintRef.current.map(x => {
            if (x) {
                x.style.display = 'none'
            }
        })
        styleOnPrintRef.current.map(x => {
            if (x) {
                x.style.padding = '0.2rem'
            }
        })
        printRef.current.children[0].style.display = 'block'
    }

    const unPrepareToPrint = () => {
        hideOnPrintRef.current.map(x => {
            if (x) {
                x.style.display = 'table-cell'
            }
        })
        styleOnPrintRef.current.map(x => {
            if (x) {
                x.style.padding = '0.75rem'
            }
        })
        printRef.current.children[0].style.display = 'none'
    }

    const getSeasonTabIndex = (sId) => {
        let index = null;
        for (let s = 0; s < seasons?.length; s++) {
            if (seasons[s]?.key === sId) {
                index = s;
                break;
            }
        }
        setTabIndex(index)
    }

    return (
        <div className='m-portlet br-12 tab'>
            <div className='m-portlet__head'>
                {
                    tabIndex !== null && <Tab
                        menu={{secondary: true, pointing: true, className: 'primaryColor'}}
                        className="no-shadow"
                        defaultActiveIndex={tabIndex}
                        onTabChange={tabChange}
                        panes={tabPanes}
                    />
                }
            </div>
            <div className='m-portlet__body'>
                {
                    customDateAttendance
                        ?
                        <div className='mb-4'>
                            <button
                                className="btn btn-sm m-btn--pill btn-info m-btn--uppercase d-inline-flex align-items-center"
                                onClick={toAdd}
                            >
                                <AddCircleOutlineRoundedIcon className='MuiSvg-customSize'/>
                                <span className='ml-2'>{translations(lang).add.toLocaleUpperCase()}</span>
                            </button>
                        </div>
                        :
                        <>
                            {
                                currentSeason && currentSeason === tabKey
                                    ?
                                    <div className='mb-4'>
                                        <button
                                            className="btn btn-sm m-btn--pill btn-info m-btn--uppercase d-inline-flex align-items-center"
                                            onClick={toAdd}
                                        >
                                            <AddCircleOutlineRoundedIcon className='MuiSvg-customSize'/>
                                            <span className='ml-2'>{translations(lang).add.toLocaleUpperCase()}</span>
                                        </button>
                                        <button
                                            className='btn btn-sm m-btn--pill btn-outline-secondary m-btn--uppercase d-inline-flex ml-3'
                                            onClick={onPrevSeasonData}
                                        >
                                            {translations(lang).timetable?.download_last_season_timetable.toLocaleUpperCase()}
                                        </button>
                                    </div>
                                    : null
                            }
                        </>
                }

                <div className='d-flex justify-content-end mb-4'>
                    <button
                        onClick={toExcel}
                        type="button"
                        className="react-bs-table-csv-btn btn btn-default m-btn m-btn--icon m-btn--icon-only p-1 mx-2"
                        style={{
                            backgroundColor: '#ff5b1d',
                            boxShadow: '0 2px 10px 0 #ff5b1d',
                            border: 'none',
                            height: '33px',
                            alignItems: 'center'
                        }}>
                        <i className='la la-file-excel-o' style={{fontSize: '22px', color: 'rgb(255, 255, 255)'}}/>
                    </button>
                    <ReactToPrint
                        trigger={() => <button
                            className="btn m-btn m-btn--icon m-btn--icon-only"
                            style={{
                                backgroundColor: '#ff5b1d',
                                boxShadow: '0 2px 10px 0 #ff5b1d',
                                border: 'none',
                                width: '33px',
                                height: '33px',
                                alignItems: 'center',
                                marginRight: '0.5rem'
                            }}
                        >
                            <i
                                className="la la-print m-0 p-0"
                                style={{
                                    fontSize: '22px',
                                    color: '#ffffff',
                                }}
                            />
                        </button>
                        }
                        pageStyle='@page {margin: 0.2cm 1cm !important;}'
                        content={() => printRef.current}
                        onBeforeGetContent={() => prepareToPrint()}
                        onAfterPrint={() => unPrepareToPrint()}
                        suppressErrors={true}
                    />

                    <input
                        className='form-control'
                        placeholder={translations(lang).search}
                        style={{borderRadius: '8px', width: '200px'}}
                        value={searchKey}
                        onChange={e => onSearch(e.target.value)}
                    />
                </div>
                <div ref={printRef}>
                    <h4 className='text-center mb-3'
                        style={{display: 'none'}}>{translations(lang).timetable?.club_title}</h4>
                    <table className='table table-bordered'>
                        <thead>
                        <tr>
                            <th></th>
                            {renderTh()}
                        </tr>
                        </thead>
                        <tbody>
                        {renderTr()}
                        </tbody>
                    </table>
                </div>
                {
                    !tableData?.length
                    &&
                    <div className='text-center'>{translations(lang).empty}</div>
                }
            </div>
            {
                viewModal &&
                <ViewModal onClose={() => setViewModal(false)} students={studentList} title={title} lang={lang}/>
            }
            {
                viewDeleteModal &&
                <DeleteModal id={tempId} tab={'group'} onClose={() => setViewDeleteModal(false)} lang={lang}/>
            }
            {
                loading || prevLoading
                &&
                <div>
                    <div className="blockUI blockOverlay"/>
                    <div className="blockUI blockMsg blockPage">
                        <div className="m-loader m-loader--brand m-loader--lg"/>
                    </div>
                </div>
            }
        </div>
    )
}

export default TimeTable
