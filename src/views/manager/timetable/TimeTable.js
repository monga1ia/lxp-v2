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
    
    // const prepareToPrint = () => {
    //     hideOnPrintRef.current.map(x => {
    //         if (x) {
    //             x.style.display = 'none'
    //         }
    //     })
    //     styleOnPrintRef.current.map(x => {
    //         if (x) {
    //             x.style.padding = '0.2rem'
    //         }
    //     })
    //     printRef.current.children[0].style.display = 'block'
    // }

    // const unPrepareToPrint = () => {
    //     hideOnPrintRef.current.map(x => {
    //         if (x) {
    //             x.style.display = 'table-cell'
    //         }
    //     })
    //     styleOnPrintRef.current.map(x => {
    //         if (x) {
    //             x.style.padding = '0.75rem'
    //         }
    //     })
    //     printRef.current.children[0].style.display = 'none'
    // }
    
    const config = {
        excelExport: true,
        printButton: true,
        columnButton: true,
        isTableStriped: false,
        // onBeforePrint: prepareToPrint(),
        // onAfterPrint: unPrepareToPrint()
        // excelFileName: `${secureLocalStorage.getItem('selectedSchool')?.text}-${t('teacher_title')}`,
        // defaultSort: [{
        //     dataField: tableState?.sort || 'firstName',
        //     order: tableState?.order || 'asc'
        // }],
        // defaultPageOptions: {
        //     page: tableState?.page || 1,
        //     sizePerPage: tableState?.pageSize || 10,
        //     search: tableState?.search || '',
        // }
    }

    const days = {
        mon: lang === 'mn' ? 'Даваа' : 'Monday',
        tue: lang === 'mn' ? 'Мягмар' : 'Tuesday',
        wed: lang === 'mn' ? 'Лхагва' : 'Wednesday',
        thur: lang === 'mn' ? 'Пүрэв' : 'Thursday',
        fri: lang === 'mn' ? 'Баасан' : 'Friday',
        sat: lang === 'mn' ? 'Бямба' : 'Saturday',
        sun: lang === 'mn' ? 'Ням' : 'Sunday',
    }

    const getCellData = (cell, row, col) => {
        const clubDataClone =   [...row?.clubs] || []

        return (clubDataClone.map((data, index) => {
            return(
                <div className='clubTableCell d-flex' style={index>0 ? {borderTop: '1px solid rgb(235, 237, 242)' } : {}}>
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

        return (clubDataClone.map((data, index) => {
            if (data[key]){
                return (
                    <div className='clubTableCell d-flex' style={index>0 ? {borderTop: '1px solid rgb(235, 237, 242)'} : {}}>
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
                    <div className='clubTableCell d-flex' style={index>0 ? {borderTop: '1px solid rgb(235, 237, 242)', height: 86} : {}}>
                    </div>
                )
            }
        }))
    }

    const getCellButton = (cell, row) => {
        const clubDataClone =   [...row?.clubs] || []

        return clubDataClone.map((data, index) => {
            if (currentSeason === tabKey) {
                return (
                <div ref={ref => {
                    hideOnPrintRef.current.push(ref)
                }}>
                    <div className='clubTableCell' style={index>0 ? {borderTop: '1px solid rgb(235, 237, 242)'} : {}}>
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
                                setDeleteId(data?.id || null)
                                setViewDeleteModal(true)
                            }}
                        >
                            <CloseIcon/>
                        </button>
                    </div>
                </div>
                )
            } else {
                return null
            }
        })
    }
    const column = [
        {
            key: 'subject',
            dataField: 'subject',
            text: '',
            // rowStyle: styles.green,
        },
        {
            key: 'club',
            dataField: 'club',
            text: translations(lang).club?.title,
            style: {padding: 0},
            formatter: (cell, row, col) => {
                return getCellData(cell, row, col)
            }
        },
        {
            key: '1',
            dataField: '1',
            text: days.mon,
            style: {padding: 0},
            formatter: (cell, row, col) => {
                return getCellText(cell, row, 1)
            }
        },
        {
            key: '2',
            dataField: '2',
            text: days.tue,
            style: {padding: 0},
            formatter: (cell, row, col) => {
                return getCellText(cell, row, 2)
            }
        },
        {
            key: '3',
            dataField: '3',
            text: days.wed,
            style: {padding: 0},
            formatter: (cell, row, col) => {
                return getCellText(cell, row, 3)
            }
        },
        {
            key: '4',
            dataField: '4',
            text: days.thur,
            style: {padding: 0},
            formatter: (cell, row, col) => {
                return getCellText(cell, row, 4)
            }
        },
        {
            key: '5',
            dataField: '5',
            text: days.fri,
            style: {padding: 0},
            formatter: (cell, row, col) => {
                return getCellText(cell, row, 5)
            }
        },
        {
            key: '6',
            dataField: '6',
            text: days.sat,
            style: {padding: 0},
            formatter: (cell, row, col) => {
                return getCellText(cell, row, 6)
            }
        },
        {
            key: '7',
            dataField: '7',
            text: days.sun,
            style: {padding: 0},
            formatter: (cell, row, col) => {
                return getCellText(cell, row, 7)
            }
        },
        {
            key: 'buttons',
            dataField: 'action',
            text: '',
            style: {padding: 0},
            formatter: (cell, row) => {
                return getCellButton(cell, row)
            }
        },
    ]
    const [tabKey, setTabKey] = useState(currentSeason)
    const [tabIndex, setTabIndex] = useState(null)
    const [tabPanes, setTabPanes] = useState(null)
    const [tableData, setTableData] = useState([])
    const [searchKey, setSearchKey] = useState('')
    const [viewModal, setViewModal] = useState(false)
    const [viewDeleteModal, setViewDeleteModal] = useState(false)
    const [deleteId, setDeleteId] = useState(null)
    const [viewClicked, setViewClicked] = useState(false)
    const [prevClicked, setPrevClicked] = useState(false)

    const [updateView, setUpdateView] = useState(false)

    const onEdit = value => {
        console.log(value)
        setGroup(value)
        toAdd()
    }

    // const onSearch = key => {
    //     setSearchKey(key)
    //     if (tableData) {
    //         if (key) {
    //             const tempList = []
    //             records[tabKey].map(record => {
    //                 let childFound = false;
    //                 if (record?.clubs && record?.clubs?.length > 0) {
    //                     for (let c = 0; c < record?.clubs?.length; c++) {
    //                         const clubObj = record?.clubs[c];
    //                         if (clubObj?.groupName?.toLowerCase().includes(key.toLowerCase()) ||
    //                             clubObj?.teacherFirstName?.toLowerCase().includes(key.toLowerCase()) ||
    //                             clubObj?.subjectName?.toLowerCase().includes(key.toLowerCase())) {
    //                             childFound = true;
    //                             break;
    //                         }
    //                     }
    //                 }
    //                 if (record?.subject?.toLowerCase().includes(key.toLowerCase()) ||
    //                     record?.groupName?.toLowerCase().includes(key.toLowerCase()) ||
    //                     record?.teacherFirstName?.toLowerCase().includes(key.toLowerCase()) ||
    //                     record?.subjectName?.toLowerCase().includes(key.toLowerCase()) ||
    //                     childFound) {
    //                     tempList.push(record)
    //                 }
    //             })
    //             setTableData(tempList)
    //         } else {
    //             setTableData(records[tabKey])
    //         }
    //     }
    // }

    const callViewModal = id => {
        if (id) {
            const params = {
                group: id
            }
            // dispatch(fetchStudent(params))
            setViewClicked(true)
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
                                <AddCircleOutlineRoundedIcon/>
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
                                            <AddCircleOutlineRoundedIcon/>
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
                <DTable
                    remote
                    config={config}
                    // locale={locale}
                    data={tableData}
                    columns={column}
                    individualContextMenus
                    showOrdering={false}
                    // contextMenus={contextMenus}
                    // onContextMenuItemClick={handleContextMenuClick}
                    // onInteraction={onUserInteraction}
                    // totalDataSize={totalCount}
                />
            </div>
            {
                viewModal &&
                <ViewModal onClose={() => setViewModal(false)} students={studentList} title={title} lang={lang}/>
            }
            {
                viewDeleteModal &&
                <DeleteModal id={deleteId} tab={'group'} onClose={() => setViewDeleteModal(false)} lang={lang}/>
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
