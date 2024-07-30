import React, { useState, useEffect, useRef } from "react";
// import {connect} from 'react-redux';
import {translations} from "utils/translations";
// import * as actions from "Actions/action";
import {Modal, Tab, Dropdown, Checkbox} from 'semantic-ui-react'
import { Row, Col } from "react-bootstrap";
import {toast} from "react-toastify";
import DTable from "modules/DataTable/DTable";
import TimeField from 'react-simple-timefield';
import HtmlHead from 'components/html-head/HtmlHead';
import BreadcrumbList from 'components/breadcrumb-list/BreadcrumbList';
import PreviewTwoToneIcon from '@mui/icons-material/PreviewTwoTone';
import BorderColorTwoToneIcon from '@mui/icons-material/BorderColorTwoTone';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded';

import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx-js-style';
import secureLocalStorage from "react-secure-storage";
import { useTranslation } from "react-i18next";
import DeleteModal from "modules/DeleteModal";
import ViewModal from "./modals/view";
import EditClassGroup from "./modals/editClassGroup";
import EditTimetable from "./modals/editTimetable";
import AddNewSubject from "./modals/addNewSubject";
import SeasonEdit from "./modals/seasonEdit";
import SeasonAdd from "./modals/seasonAdd";

const locale = secureLocalStorage?.getItem('selectedLang') || 'mn'

// const index = () => {
//     return (
//         <div>
//             index
//         </div>
//     )
// }

// export default index

const index = () => {

    const { t } = useTranslation()

    const title = t('timetable.title');
    const description = "E-learning";
    const breadcrumbs = [
        { to: "", text: "Home" },
        { to: "teacher/timetable", text: title }
    ];

    const seasonRef = useRef([])
    // Init action
    
    const [message, setMessage]  = useState(null)
    const [modalMessage, setModalMessage] = useState('')
    const [messageSuccess, setMessageSuccess]  = useState(false)
    const [modalMessageSuccess, setModalMessageSuccess]  = useState(false)
    const [showLoader, setShowLoader]  = useState(false)
    const [tabActiveIndex, setTabActiveIndex]  = useState(0)
    const [seasons, setSeasons]  = useState([
        {
            code: "01",
            isCurrent: false,
            seasonId: "608",
            seasonName: "1-р улирал"
        },
        {
            code: "03",
            isCurrent: false,
            seasonId: "1154",
            seasonName: "3-р улирал"
        },
        {
            code: "02",
            isCurrent: false,
            seasonId: "1162",
            seasonName: "2-р улирал"
        },
        {
            code: "04",
            isCurrent: true,
            seasonId: "1358",
            seasonName: "4-р улирал"
        }
    ])
    const [classes, setClasses]  = useState([])
    const [teacherClasses, setTeacherClasses]  = useState([])
    const [modalAction, setModalAction]  = useState('')
    const [modalSize, setModalSize]  = useState('large')
    const [hasCustomDateAttendance, setHasCustomDateAttendance]  = useState(false)
    // New timetable action
    const [newSubjectTabIndex, setNewSubjectTabIndex]  = useState(0)
    const [activeModal, setActiveModal]  = useState(false)
    const [inactiveModal, setInactiveModal]  = useState(false)
    const [modalTitle, setModalTitle]  = useState(null)
    const [selectedGroupId, setSelectedGroupId]  = useState([])
    const [newSubjectLists, setNewSubjectLists]  = useState([])
    const [isClassSubjects, setIsClassSubjects]  = useState([])
    const [newSubjectRow, setNewSubjectRow] = useState([{
        subject: null,
        groups: [],
        optionClasses: []
    }])
    const [classesStudents, setClassesStudents]  = useState([])
    const [groupTotalStudents, setGroupTotalStudents]  = useState(0)
    // Edit timetable action
    const [contextMenuId, setContextMenuId]  = useState('my_timetable_menu')
    const contextMenus = [
        {
            key: 'VIEW',
            icon: <PreviewTwoToneIcon sx={{fontSize: '2rem !important', color: '#ff5b1d'}}/>,
            title: translations(locale).view || "",
        },
        {
            key: 'EDIT',
            icon: <BorderColorTwoToneIcon sx={{fontSize: '1.8rem !important', color: '#ff5b1d'}}/>,
            title: translations(locale).edit || ""
        },
        {
            key: 'DELETE',
            icon: <DeleteTwoToneIcon sx={{fontSize: '2rem !important', color: '#ff5b1d'}}/>,
            title: translations(locale).delete || ""
        },
    ]
    const [fetchEditSubject, setFetchEditSubject]  = useState(false)
    const [fetchEditSubjectSubmit, setFetchEditSubjectSubmit]  = useState(false)
    // View timatable student action
    const [fetchViewSubject, setFetchViewSubject]  = useState(false)
    const [modalGroup, setModalGroup]  = useState({})
    const [selectedTimeTableId, setSelectedTimeTableId]  = useState(null)
    // timetable action
    const [subjectLists, setSubjectLists]  = useState([
        {id: 123, groupName:'123', studentCount: '8288'},
        {id: 'second', groupName:'1232', studentCount: '82848'},
        {id: 'third' ,groupName:'12233', studentCount: '82488'},
        {id: '1231',groupName:'1223', studentCount: '82838'},
    ])
    const [seasonTimetableSubjectList, setSeasonTimetableSubjectList]  = useState([])
    const [timetableLists, setTimetableLists]  = useState([
        {
            seasonId: "608",
            shifts: []
        },
        {
            seasonId: "1154",
            shifts: []
        },
        {
            seasonId: "1162",
            shifts: []
        },
        {
            seasonId: "1358",
            shifts: []
        }
    ])
    const [dayLists, setDayLists]  = useState([
        {
            dayId: 1,
            orderNumber: 1,
            day: "Даваа"
        },
        {
            dayId: 2,
            orderNumber: 2,
            day: "Мягмар"
        },
        {
            dayId: 3,
            orderNumber: 3,
            day: "Лхагва"
        },
        {
            dayId: 4,
            orderNumber: 4,
            day: "Пүрэв"
        },
        {
            dayId: 5,
            orderNumber: 5,
            day: "Баасан"
        },
        {
            dayId: 6,
            orderNumber: 6,
            day: "Бямба"
        },
        {
            dayId: 7,
            orderNumber: 7,
            day: "Ням"
        }
    ])
    // timetable add new action
    const [shiftWithTime, setShiftWithTime]  = useState([])
    const [selectedTimeTableGroupId, setSelectedTimeTableGroupId]  = useState('')
    const [selectedTestId, setSelectedTestId]  = useState(null)
    // timetable delete season
    const [deleteSeasonDayId, setDeleteSeasonDayId]  = useState(null)
    // timetable edit season
    const [editTimetableDay, setEditTimetableDay]  = useState('1')
    // subject edit
    const [editSubjectGroup, setEditSubjectGroup]  = useState(null)
    const [editSubjectClasses, setEditSubjectClasses]  = useState([])
    const [tabPanes, setTabPanes]  = useState([])

    const [selectedTableId, setSelectedTableId] = useState(0)

    const [showEditSeason, setShowEditSeason] = useState(false)
    const [showEditClassGroup, setShowEditClassGroup] = useState(false)
    const [showSeasonModal, setShowSeasonModal] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [showEditTimetable, setShowEditTimetable] = useState(false)
    const [showAddTimetableModal, setShowAddTimetableModal] = useState(false)
    const [showSeasonAddModal, setShowSeasonAddModal] = useState(false)
    const [showViewModal, setShowViewModal] = useState(false)
    const [classOrGroup, setClassOrGroup]  = useState(null)

    const config = {
        showLeftButton: true,
        leftButtonClassName: 'btn btn-sm m-btn--pill btn-info m-btn--uppercase d-inline-flex align-items-center',
        leftButtonStyle: {},
        leftButtonText: translations(locale).add,
        leftButtonIcon: <AddCircleOutlineRoundedIcon/>,
        showAllData: true,
        showPagination: false,
        showFilter: true,
        defaultSort: [{
            dataField: 'groupName',
            order: 'asc'
        }]
    };

    const setSeasonRef = (node, id) => {
        if (node && id) {
            if (seasonRef.seasonId != id) {
                seasonRef = []
            }
            seasonRef.seasonId = id
            seasonRef.push(node)
        } else {
            seasonRef = []
        }
    }

    const column = [
        {
            dataField: "groupName",
            text: translations(locale).subject.title || "",
            sort: true,
            formatter: (cell, row) => {
                return (
                    <>
                        <span>{row.subjectName}</span>
                        <span className="d-block bolder">{cell}</span>
                        <span className="underline"
                                onClick={() => _onTdClick(row.groupId)}>{row.classes}</span>
                    </>
                )
            }
        },
        {
            dataField: "studentCount",
            text: translations(locale).students || "",
            align: "right",
            sort: true,
            formatter: (cell, row) => {
                return <span className="underline" onClick={() => _onTdClick(row.groupId)}>{cell}</span>
            }
        },
    ];
    
    const _renderTabPanes = () => {
        const activeTab = tabPanes[tabActiveIndex]
        console.log(tabPanes)
        if (activeTab) {
            if (activeTab.tabKey === 'subjects') {
                return (
                    <Tab.Pane>
                        {_renderSubjectTab()}
                    </Tab.Pane>
                )
            } else {
                let that = this;
                if (seasons) {
                    const index = seasons.findIndex(object => {
                        return object.seasonId === activeTab.tabKey
                    })
                    let seasonObj = seasons[index];
                    let seasonData = [];
                    for (let s = 0; s < timetableLists.length; s++) {
                        let timetableObj = timetableLists[s];
                        if (timetableObj.seasonId === seasonObj.seasonId) {
                            seasonData = timetableObj.shifts;
                            break;
                        }
                    }
                    return (
                        <Tab.Pane>
                            <div
                                className={`d-flex align-items-center ${seasonObj.isCurrent || hasCustomDateAttendance 
                                    ? 'justify-content-between' : 'justify-content-end'} `}>
                                {
                                    hasCustomDateAttendance
                                        ?
                                        <button
                                            className="btn btn-sm m-btn--pill btn-info m-btn--uppercase d-inline-flex align-items-center"
                                            onClick={() => _seasonAddTimetable(seasonObj.seasonId)}
                                        >
                                            <AddCircleOutlineRoundedIcon/>
                                            <span className="ml-2">
                                            {translations(locale).add || null}
                                        </span>
                                        </button>
                                        :
                                        <>
                                            {
                                                seasonObj.isCurrent &&
                                                <button
                                                    className="btn btn-sm m-btn--pill btn-info m-btn--uppercase d-inline-flex align-items-center"
                                                    onClick={() => _seasonAddTimetable(seasonObj.seasonId)}
                                                >
                                                    <AddCircleOutlineRoundedIcon/>
                                                    <span className="ml-2">
                                                        {translations(locale).add || null}
                                                    </span>
                                                </button>
                                            }
                                        </>
                                }

                                <button
                                    onClick={() => _toExcel(seasonObj.seasonName)}
                                    type="button"
                                    className="react-bs-table-csv-btn btn btn-default m-btn m-btn--icon m-btn--icon-only p-1 mx-2"
                                    style={{
                                        backgroundColor: '#ff5b1d',
                                        boxShadow: '0 2px 10px 0 #ff5b1d',
                                        border: 'none',
                                        height: '33px',
                                        alignItems: 'center'
                                    }}>
                                    <i className='la la-file-excel-o'
                                       style={{fontSize: '22px', color: 'rgb(255, 255, 255)'}}/>
                                </button>
                            </div>
                            {
                                seasonData?.length > 0 ?
                                    seasonData?.map(function (schoolShift, index) {
                                        return (
                                            <div ref={(node) => setSeasonRef(node, seasonObj.seasonId)}
                                                 key={'school_shift_' + seasonObj?.seasonId + '_' + schoolShift?.school_shift?.id}>
                                                <div className="bolder pb-2 pl-3 pt-4"
                                                     style={{color: '#ff2f19', fontSize: '14px'}}>
                                                    {schoolShift?.school_shift?.name}
                                                </div>
                                                <table className="table table-bordered myTimetable-timetable-datatable">
                                                    <thead>
                                                    <tr>
                                                        {_renderSeasonTab(seasonObj, schoolShift?.school_shift?.id)}
                                                    </tr>
                                                    </thead>
                                                    <tbody>
                                                    {_renderBody(schoolShift.times)}
                                                    </tbody>
                                                </table>
                                            </div>
                                        )
                                    })
                                    :
                                    <div
                                        className="text-center pt-4 pb-2">{translations(locale)?.timetable?.empty}</div>
                            }
                        </Tab.Pane>
                    )

                }
            }
        }
    }

    const _toExcel = (fileName) => {
        let datas = []
        const seasons = seasonRef
        seasons?.map(season => {
            const table = season.children[1]
            const [header] = table.tHead.rows
            const props = [...header.cells]?.map(h => h.textContent)
            const rows = [...table.rows].splice(1)?.map(r => {
                const entries = [...r.cells]?.map((c, i) => {
                    return [props[i], c.innerText]
                })
                return Object.fromEntries(entries)
            })
            datas.push({
                sheetData: rows,
                sheetName: season.children[0].innerText
            })
        })

        const workbook = XLSX.utils.book_new()

        datas?.map(data => {
            const worksheet = XLSX.utils.json_to_sheet(data.sheetData)

            let worksheetRows = [{hpx: 30}]
            data.sheetData?.map(() => {
                worksheetRows.push({hpx: 50})
            })
            worksheet['!rows'] = worksheetRows

            let worksheetCols = []
            Object.keys(data.sheetData[0])?.map(() => {
                worksheetCols.push({wch: 25})
            })
            worksheet['!cols'] = worksheetCols

            Object.keys(worksheet)?.map(key => {
                if (key != '!ref' && key != '!rows' && key != '!cols') {
                    worksheet[key].s = {
                        alignment: {
                            wrapText: true,
                            vertical: 'center',
                            horizontal: 'center',
                        }
                    }
                }
            })

            XLSX.utils.book_append_sheet(workbook, worksheet, data.sheetName)
        })
        const name = `${secureLocalStorage.getItem('selectedSchool')?.text}-${fileName}-${translations(locale)?.timetable?.title}`
        XLSX.writeFile(workbook, name + '.xlsx')
    }

    const _renderSubjectTab = () => {
        return (
            <DTable
                config={config}
                data={subjectLists}
                columns={column}
                contextMenus={contextMenus}
                onContextMenuItemClick={_contextMenuItemClick}
                locale={locale}
                onLeftButtonClick={myTimetableAddNewSubject}
            />
        );
    }

    // init handler start
    const _renderSeasonTab = (season, schoolShiftId) => {
        let rows = [];

        rows.push(
            <th width="10%" key={season?.seasonId + '_' + schoolShiftId + '_' + 0}></th>
        );

        let that = this;

        if (dayLists.length > 0) {
            console.log('yes')
            for (let i = 0; i < dayLists.length; i++) {
                let dayArray = dayLists[i];
                rows.push(
                    <th width={(90 / dayLists.length) + "%"}
                        key={season?.seasonId + '_' + schoolShiftId + '_day_' + dayArray.dayId}
                        className='pinnacle-bold text-capitalize p-3 text-center'
                    >{dayArray['day']}
                        {
                            season?.isCurrent && <>
                                <button
                                    className="btn btn-primary m-btn m-btn--icon btn-sm m-btn--icon-only m-btn--pill"
                                    onClick={() => {
                                        // edit timetable
                                        setShowEditSeason(true)
                                        setEditTimetableDay(dayArray.dayId)

                                        let params = {
                                            season: season?.seasonId,
                                            day: dayArray.dayId
                                        };

                                        // props.fetchMyTimetableSeasonEditRequest(params);
                                    }}>
                                    <i className="fa flaticon-edit-1"/>
                                </button>
                                <button
                                    className="btn btn-danger m-btn m-btn--icon btn-sm m-btn--icon-only m-btn--pill"
                                    onClick={() => {
                                        setModalAction('SEASON_DELETE'),
                                        setModalTitle(t('delete')),
                                        setModalSize('md'),
                                        setActiveModal(true),
                                        setDeleteSeasonDayId(dayArray.dayId)
                                    }}>
                                    <i className="fa flaticon-delete-1"/>
                                </button>
                            </>
                        }
                    </th>
                );
            }
        }

        return rows
    }

    const _renderBody = (shiftDatas) => {
        let rows = [];
        let dates = dayLists;
        if (shiftDatas) {

            for (let i = 0; i < shiftDatas.length; i++) {
                let timeObj = shiftDatas[i];

                let rowDates = [];

                for (let k = 0; k < dates.length; k++) {
                    let dateObj = dates[k];

                    let cellData = '';
                    if (timeObj.timetables && timeObj.timetables.length > 0) {

                        let cellTimetableObj = [];
                        let classes = '';
                        for (let t = 0; t < timeObj.timetables.length; t++) {
                            let timetableObj = timeObj.timetables[t];

                            if (timetableObj.dayId === dateObj.dayId) {
                                classes = '';
                                if (timetableObj.classes) {
                                    for (let row_cl = 0; row_cl < timetableObj.classes.length; row_cl++) {
                                        if (timetableObj.classes.length === (row_cl + 1)) {
                                            classes += timetableObj.classes[row_cl];
                                        } else {
                                            classes += timetableObj.classes[row_cl] + ', ';
                                        }
                                    }
                                }

                                cellTimetableObj.push(timetableObj);
                            }
                        }
                        if (cellTimetableObj && cellTimetableObj.length > 0) {
                            let timeTableRowData = [];
                            for (let c = 0; c < cellTimetableObj.length; c++) {
                                let separate = ',';
                                if (cellTimetableObj.length === (c + 1)) {
                                    separate = '';
                                }
                                timeTableRowData.push(
                                    <div
                                        key={'date_' + k + '_' + dateObj.dayId + '_' + cellTimetableObj[0].schoolShiftId + '_' + c}>
                                        <span className="title">{cellTimetableObj[c].subject}</span>
                                        <span className="d-block">{cellTimetableObj[c].group}</span>
                                        <span className="class"
                                              onClick={() => _handlerClassClick(cellTimetableObj[c].groupId)}>
                                            {cellTimetableObj[c]?.classes?.join()}
                                        </span>
                                    </div>
                                )
                            }
                            rowDates.push(<td
                                key={'date_' + k + '_' + dateObj.dayId + '_' + cellTimetableObj[0].schoolShiftId}>
                                {timeTableRowData}
                            </td>);
                        } else {
                            rowDates.push(<td
                                key={'date_' + k + '_' + dateObj.dayId + '_' + timeObj.schoolShiftId}></td>);
                        }
                    } else {
                        rowDates.push(<td key={'date_' + k + '_' + dateObj.dayId + '_' + timeObj.schoolShiftId}></td>);
                    }
                }

                rows.push(<tr key={'time_' + i + '_' + timeObj.time + '_' + timeObj.schoolShiftId}>
                    <td>{timeObj.time}</td>
                    {rowDates}
                </tr>);
            }
        }
        return rows;
    };

    const _tabChange = (e, data) => {
        if (tabActiveIndex != data.activeIndex) {
            setTabActiveIndex(data.activeIndex)
        }
    }

    const messageHandleDismiss = () => {
        setMessage(null)
    };

    const closeModal = () => {
        setActiveModal(false)
        setModalAction(null)
        setDeleteSeasonDayId(null)
        setShowDeleteModal(false)
        setEditSubjectGroup(null)
        setEditSubjectClasses([])
        setGroupTotalStudents(0)
        setNewSubjectRow([{
            subject: null,
            groups: [],
            optionClasses: []
        }])
        setModalMessage(null)
        setSelectedTableId(null)

        setShowEditTimetable(false)
        setShowEditSeason(false)
        setShowEditClassGroup(false)
        setShowSeasonAddModal(false)
        setShowAddTimetableModal(false)
        setShowViewModal(false)
        setShowEditTimetable(false)
    };

    const _onTdClick = (id) => {
        setShowViewModal(true)
        setFetchViewSubject(true)
        // setShowLoader(true)

        let params = {
            group: id
        };

        // props.fetchMyTimetableViewSubject(params)
    }

    const myTimetableAddNewSubject = () => {

        setShowAddTimetableModal(true)
        // setShowLoader(true)
        setGroupTotalStudents(0)
        let params = {
            id: 1
        };

        // props.fetchMyTimetableNewSubject(params)
    };

    const _contextMenuItemClick = (id, key) => {
        if (id && key) {
            setSelectedTimeTableId(id)
            if (key === 'VIEW') {
                setShowViewModal(true)
                // setState({
                //     fetchViewSubject: true,
                //     showLoader: true,
                // });
                let params = {
                    group: id
                };

                // props.fetchMyTimetableViewSubject(params)
            } else if (key === 'EDIT') {
                setShowEditClassGroup(true)
                // setState({
                //     fetchEditSubject: true,
                //     fetchEditSubjectSubmit: false,
                //     showLoader: true,
                // });
                let params = {
                    group: id
                };
                // props.fetchTeacherTimetableEditSubject(params)
            } else if (key === 'DELETE') {
                setShowDeleteModal(true)
            }
        }
    }

    const deleteSubjectSubmit = () => {
        // setState({
        //     fetchDeleteSubject: true,
        //     showLoader: true,
        // });

        let params = {
            group: selectedTimeTableId
        };

        // props.fetchTeacherTimetableDeleteSubject(params)
    }

    const deleteSeasonTimetableSubmit = () => {
        // setState({
        //     fetchDeleteSeasonTimetable: true,
        //     showLoader: true
        // });

        let seasonId = null;

        try {
            if (tabActiveIndex > 0 && typeof seasons[tabActiveIndex - 1] !== 'undefined') {
                seasonId = seasons[tabActiveIndex - 1].seasonId;
            }
        } catch (error) {
        }

        let bodyParams = {
            season: seasonId,
            day: deleteSeasonDayId
        };
        // props.fetchMyTimetableSeasonDeleteSubmit(bodyParams);
    }

    const deleteSeasonEditTimetableSubmit = () => {
        if (editTimetableDay) {
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
                submit: 1,
                day: editTimetableDay,
                shifts: JSON.stringify(shifts?.map(shift => ({
                    id: shift.id,
                    times: shift?.times?.map(time => ({
                        start: time.start,
                        end: time.end,
                        group: time.groupId,
                    }))
                })))
            }
            // setState({
            //     fetchEditTimetableSubmit: true,
            //     showLoader: true
            // });

            // props.fetchMyTimetableSeasonEditSubmit(params)
        } else {
            message(translations(locale).timetable.select_day)
        }
    }

    const _handlerClassClick = (groupId) => {
        // setState({
        //     fetchViewSubject: true,
        //     showLoader: true,
        // });

        let params = {
            group: groupId
        };

        // props.fetchMyTimetableViewSubject(params)
    }

    const _seasonAddTimetable = (seasonId) => {
        
        setShowSeasonAddModal(true)
        setShowSeasonModal(true)
        // setState({
        //     fetchAddTimetable: true,
        //     showLoader: true,
        //     selectedTimetableDayId: null
        // });

        let params = {
            season: seasonId
        };

        // props.fetchMyTimetableAddTimetable(params)
    }

    const _addTimetableGroupChange = (data, shiftId, timeIndex) => {
        if (data && timeIndex) {
            let swtClone = shiftWithTime;

            let selectedShiftObj = swtClone.find(function (obj) {
                return obj['id'] == timeIndex?.split('_')[0];
            });

            if (selectedShiftObj && selectedShiftObj['times']) {
                let selectedTimeObj = selectedShiftObj['times'].find(function (timeObj) {
                    return timeObj['index'] == timeIndex;
                });

                if (selectedTimeObj) {
                    selectedTimeObj['groupId'] = data.value;
                }
            }

            setShiftWithTime(swtClone)
        }
    };

    const addTimetableInputStartTimeHandler = (event, timeIndex) => {
        if (event.target.value && timeIndex) {
            let swtClone = shiftWithTime;

            let selectedShiftObj = swtClone.find(function (obj) {
                return obj['id'] == timeIndex?.split("_")[0];
            });

            if (selectedShiftObj && selectedShiftObj['times']) {
                let selectedTimeObj = selectedShiftObj['times'].find(function (timeObj) {
                    return timeObj['index'] == timeIndex;
                });

                if (selectedTimeObj) {
                    selectedTimeObj['start'] = event.target.value;
                }
            }

            setShiftWithTime(swtClone)
        }
    };

    const addTimetableInputEndTimeHandler = (event, timeIndex) => {
        if (event.target.value && timeIndex) {
            let swtClone = shiftWithTime;

            let selectedShiftObj = swtClone.find(function (obj) {
                return obj['id'] == timeIndex?.split("_")[0];
            });

            if (selectedShiftObj && selectedShiftObj['times']) {
                let selectedTimeObj = selectedShiftObj['times'].find(function (timeObj) {
                    return timeObj['index'] == timeIndex;
                });

                if (selectedTimeObj) {
                    selectedTimeObj['end'] = event.target.value;
                }
            }

            setShiftWithTime(swtClone)
        }
    };

    const excelExportStudent = () => {
        let records = [];
        let rowIndex = 1;
        for (let record of viewStudentLists) {
            let recordCol = {};
            let colIndex = 1;
            for (let column of studentModalColumn) {
                if (column.key === 'id') {
                    recordCol[column.text] = rowIndex;
                    colIndex++;
                } else if (column.key && column.key !== 'smallPhoto') {
                    recordCol[column.text] = record[column.key];
                    colIndex++;
                }
            }
            rowIndex++;
            records.push(recordCol);
        }

        let fileName = modalGroup.name + ' - сурагчид';

        if (props.config && props.config['excelFileName']) {
            fileName = props.config['excelFileName'];
        }

        const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
        const fileExtension = '.xlsx';


        const ws = XLSX.utils.json_to_sheet(records);
        const wb = {Sheets: {'data': ws}, SheetNames: ['data']};

        wb.Sheets.data.A2.s = {font: {bold: true}};
        const excelBuffer = XLSX.write(wb, {bookType: 'xlsx', type: 'array'});
        const data = new Blob([excelBuffer], {type: fileType});
        FileSaver.saveAs(data, props.filename || fileName + fileExtension);
    }

    useEffect(() => {
        let panes = [{
            menuItem: t('subject.title'),
            tabKey: 'subjects'
        }]
        seasons.map((season) => {
            panes.push({
                menuItem: season.seasonName,
                tabKey: season.seasonId,
            })
        })
        setTabPanes(panes)
    },[])

    return (
        <div className="m-grid__item m-grid__item--fluid m-wrapper">
            <HtmlHead title={title} description={description} />
            <div className="page-title-container">
                <Row>
                    <Col md="7">
                        <h1 className="mb-0 pb-0 display-4 relative">{title}</h1>
                        <BreadcrumbList items={breadcrumbs} />
                    </Col>
                </Row>
            </div>
            <div className="m-content">
                <div className="m-portlet br-12 tab">
                    <div className="m-portlet__head">
                        {
                            <Tab
                                menu={{secondary: true, pointing: true, className: 'primaryColor'}}
                                className="no-shadow"
                                onTabChange={_tabChange}
                                panes={tabPanes}
                            />
                        }
                    </div>
                    <div className="m-portlet__body">
                        {
                            _renderTabPanes()
                        }
                    </div>
                </div>
            </div>
            {
                showLoader &&
                <>
                    <div className='loader-container'>
                        <svg className="splash-spinner" viewBox="0 0 50 50">
                            <circle className="path" cx="25" cy="25" r="20" fill="none" strokeWidth="5" />
                        </svg>
                    </div>
                </>
            }
            {
                showSeasonAddModal &&
                <SeasonAdd
                    onClose={closeModal}
                    _addTimetableGroupChange={(data, times, times2) => _addTimetableGroupChange(data, times, times2)}
                />
            }
            {
                showEditSeason &&
                <SeasonEdit
                    onClose={closeModal}
                    editTimetableDay={editTimetableDay}
                    _addTimetableGroupChange={(data, times, times2) => _addTimetableGroupChange(data, times, times2)}
                />
            }
            {
                showEditClassGroup &&
                <EditClassGroup
                    onClose={closeModal}
                    selectedTableId={selectedTableId}
                    classOr
                />
            }
            {
                showAddTimetableModal &&
                <AddNewSubject
                    onClose={closeModal}
                />
            }
            {
                showViewModal &&
                <ViewModal
                    onClose={closeModal}
                    selectedTableId={selectedTableId}
                />
            }
            {
                showEditTimetable &&
                <EditTimetable
                    onClose={closeModal}
                    classOrGroup={classOrGroup}
                />
            }
            {
                showDeleteModal &&
                <DeleteModal
                    show={true}
                    onClose={closeModal}
                    onDelete={deleteSubjectSubmit}
                    title={t('warning.delete')}>
                    {t('delete_confirmation')}
                    <br />
                    <br />
                    {t('delete_confirmation_description')}
                </DeleteModal>
            }
        </div>
    )
}

export default index