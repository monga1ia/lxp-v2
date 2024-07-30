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
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded';

import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx-js-style';
import secureLocalStorage from "react-secure-storage";
import { useTranslation } from "react-i18next";

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
    const [messageSuccess, setMessageSuccess]  = useState(false)
    const [modalMessageSuccess, setModalMessageSuccess]  = useState(false)
    const [showLoader, setShowLoader]  = useState(false)
    const [tabActiveIndex, setTabActiveIndex]  = useState(0)
    const [seasons, setSeasons]  = useState([])
    const [classes, setClasses]  = useState([])
    const [teacherClasses, setTeacherClasses]  = useState([])
    const [modalAction, setModalAction]  = useState('')
    const [modalSize, setModalSize]  = useState('large')
    const [hasCustomDateAttendance, setHasCustomDateAttendance]  = useState(false)
    // New timetable action
    const [newSubjectTabIndex, setNewSubjectTabIndex]  = useState(0)
    const [newSubjectTabName, setNewSubjectTabName]  = useState('class')
    const [activeModal, setActiveModal]  = useState(false)
    const [fetchNewSubject, setFetchNewSubject]  = useState(false)
    const [inactiveModal, setInactiveModal]  = useState(false)
    const [modalTitle, setModalTitle]  = useState(null)
    const [selectedGroupId, setSelectedGroupId]  = useState([])
    const [fetchDeleteSubject, setFetchDeleteSubject]  = useState(false)
    const [newSubjectLists, setNewSubjectLists]  = useState([])
    const [isClassSubjects, setIsClassSubjects]  = useState([])
    const [isNonClassSubjects, setIsNonClassSubjects]  = useState([])
    const [selectedIsClassSubjectIds, setSelectedIsClassSubjectIds]  = useState([])
    const [newSubjectRow, setNewSubjectRow] = useState([{
        subject: null,
        groups: [],
        optionClasses: []
    }])
    const [newSubjectGroupRow, setNewSubjectGroupRow] = useState([{
        subject: null,
        groups: [],
        optionClasses: []
    }])
    const [selectedGroupSubjectId, setSelectedGroupSubjectId]  = useState(null)
    const [selectedGroupName, setSelectedGroupName]  = useState('')
    const [fetchNewSubjectSubmit, setFetchNewSubjectSubmit]  = useState(false)
    const [fetchClassId, setFetchClassId]  = useState(null)
    const [fetchClassStudent, setFetchClassStudent]  = useState(false)
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
    const [classOrGroup, setClassOrGroup]  = useState(null)
    // View timatable student action
    const [fetchViewSubject, setFetchViewSubject]  = useState(false)
    const [viewStudentLists, setViewStudentLists]  = useState([])
    const [modalGroup, setModalGroup]  = useState({})
    const [selectedTimeTableId, setSelectedTimeTableId]  = useState(null)
    // timetable action
    const [subjectLists, setSubjectLists]  = useState([])
    const [seasonTimetableSubjectList, setSeasonTimetableSubjectList]  = useState([])
    const [timetableLists, setTimetableLists]  = useState([])
    const [dayLists, setDayLists]  = useState([])
    // timetable add new action
    const [fetchAddTimetable, setFetchAddTimetable]  = useState(false)
    const [fetchAddTimetableSubmit, setFetchAddTimetableSubmit]  = useState(false)
    const [selectedTimetableDayId, setSelectedTimetableDayId]  = useState(null)
    const [addTimetableDays, setAddTimetableDays]  = useState(null)
    const [ableToAddTimetable, setAbleToAddTimetable]  = useState(true)
    const [shiftWithTime, setShiftWithTime]  = useState([])
    const [selectedTimeTableGroupId, setSelectedTimeTableGroupId]  = useState('')
    const [selectedTestId, setSelectedTestId]  = useState(null)
    // timetable delete season
    const [deleteSeasonDayId, setDeleteSeasonDayId]  = useState(null)
    const [fetchDeleteSeasonTimetable, setFetchDeleteSeasonTimetable]  = useState(false)
    // timetable edit season
    const [editTimetableDay, setEditTimetableDay]  = useState(null)
    const [fetchEditTimetableRequest, setFetchEditTimetableRequest]  = useState(false)
    const [fetchEditTimetableSubmit, setFetchEditTimetableSubmit]  = useState(false)
    // subject edit
    const [editSubjectGroup, setEditSubjectGroup]  = useState(null)
    const [editSubjectClasses, setEditSubjectClasses]  = useState([])
    const [tabPanes, setTabPanes]  = useState([])

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

    const studentModalConfig = {
        showLeftButton: true,
        leftButtonClassName: 'border-0 bg-white',
        leftButtonStyle: {color: '#62646e'},
        excelExport: true,
        showAllData: true,
        showPagination: false,
        showFilter: true,
        defaultSort: [{
            dataField: 'firstName',
            order: 'asc'
        }]
    };

    // this._renderSubjectTab = this._renderSubjectTab.bind(this);
    // this._renderSeasonTab = this._renderSeasonTab.bind(this);
    // this._tabChange = this._tabChange.bind(this);
    // this.closeModal = this.closeModal.bind(this);
    // this.myTimetableAddNewSubject = this.myTimetableAddNewSubject.bind(this);
    // this.newSubjectAddRow = this.newSubjectAddRow.bind(this);
    // this.newSubjectRemoveRow = this.newSubjectRemoveRow.bind(this);
    // this.newSubjectTabChange = this.newSubjectTabChange.bind(this);
    // this.newSubjectSubmit = this.newSubjectSubmit.bind(this);
    // this.newSubjectGroupSubjectChange = this.newSubjectGroupSubjectChange.bind(this);
    // this.newSubjectGroupNameChange = this.newSubjectGroupNameChange.bind(this);
    // this.newSubjectGroupAddRow = this.newSubjectGroupAddRow.bind(this);
    // this.newSubjectGroupRemoveRow = this.newSubjectGroupRemoveRow.bind(this);
    // this._contextMenuItemClick = this._contextMenuItemClick.bind(this);
    // this._onTdClick = this._onTdClick.bind(this);
    // this.deleteSubjectSubmit = this.deleteSubjectSubmit.bind(this);
    // this._handlerClassClick = this._handlerClassClick.bind(this);
    // this._seasonAddTimetable = this._seasonAddTimetable.bind(this);
    // this.deleteSeasonTimetableSubmit = this.deleteSeasonTimetableSubmit.bind(this);
    // this.deleteSeasonEditTimetableSubmit = this.deleteSeasonEditTimetableSubmit.bind(this);
    // this.excelExportStudent = this.excelExportStudent.bind(this);
    // this.onOpenDayDropdown = this.onOpenDayDropdown.bind(this);
    // this.onCloseDayDropdown = this.onCloseDayDropdown.bind(this);
    // this._toExcel = this._toExcel.bind(this);

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

    const setColumns = (locale) => {
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

        const studentModalColumn = [
            {
                dataField: "avatar",
                text: translations(locale).photo || "",
                headerStyle: () => ({
                    width: 80,
                }),
                formatter: (cell, row) => {
                    return <img className='img-responsive img-circle' src={cell || '/images/avatar.png'} width={50}
                                height={50} alt={row.firstName}/>
                },
            },
            {
                dataField: "className",
                text: translations(locale).group.title || "",
                sort: true
            },
            {
                dataField: "studentCode",
                text: translations(locale).student?.student_code || "",
                sort: true,
            },
            {
                dataField: "lastName",
                text: translations(locale).student?.last_name || "",
                sort: true,
            },
            {
                dataField: "firstName",
                text: translations(locale).student?.first_name || "",
                sort: true,
            },
        ];
    }

    setColumns(locale);
    
    const _renderTabPanes = () => {
        const activeTab = tabPanes[tabActiveIndex]
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
                data={subjectList}
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
                                        setState({
                                            fetchEditTimetableRequest: true,
                                            showLoader: true,
                                            editTimetableDay: dayArray.dayId
                                        });

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
                                        setState({
                                            modalAction: 'SEASON_DELETE',
                                            modalTitle: translations(locale).delete,
                                            modalSize: 'mini',
                                            activeModal: true,
                                            deleteSeasonDayId: dayArray.dayId
                                        })
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

    const _renderClassSubject = () => {
        return (
            <div>
                {
                    modalAction === 'EDIT'
                    &&
                    <div className="form-group m-form__group row">
                        <label className="col-form-label col-md-4 col-sm-12 text-right label-pinnacle-bold">
                            {translations(locale).first_name || null}
                        </label>
                        <div className="col-md-5 col-sm-12">
                            <input type="text" className="form-control m-input"
                                   placeholder={translations(locale).insert_first_name || null}
                                   value={selectedGroupName ? selectedGroupName : ''}
                                   onChange={newSubjectGroupNameChange}/>
                        </div>
                    </div>
                }

                {
                    modalAction === 'EDIT'
                        ?
                        <div className="form-group m-form__group row">
                            <div className="col-md-12 col-xs-12 text-center">
                                <label className="col-form-label" style={{color: '#62646e'}}>
                                    {
                                        locale === 'mn'
                                            ?
                                            (editSubjectGroup.className || '') + ' ' + translations(locale).timetable.class_all_students
                                            :
                                            translations(locale).timetable.class_all_students + ' ' + (editSubjectGroup.className || '')
                                    }
                                </label>
                            </div>
                        </div>
                        :
                        <div className="row">
                            <div className="col-md-2"/>
                            <div className="col-md-8">
                                <table className="table table-bordered"
                                       key={'newSubject_1'}
                                >
                                    <thead>
                                    <tr>
                                        <th className="bolder" width={300} style={{
                                            color: '#575962',
                                            fontSize: '11px',
                                            paddingLeft: '20px'
                                        }}>{translations(locale).timetable.subject || null}</th>
                                        <th className="bolder" width={300} style={{
                                            color: '#575962',
                                            fontSize: '11px',
                                            paddingLeft: '20px'
                                        }}>{translations(locale).group.title || null}</th>
                                        <th align="center" width={50}/>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {
                                        newSubjectRow?.map((obj, i) => {
                                            return (
                                                <tr key={'tr_' + i}>
                                                    <td className="p-1">
                                                        {
                                                            isClassSubjects
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
                                                                    disabled={modalAction === 'EDIT'}
                                                                    placeholder={translations(locale).survey.choose || null}
                                                                    options={isClassSubjects}
                                                                    value={newSubjectRow[i]['subject']}
                                                                    onChange={(e, data) => _onSubjectChange(e, data, i)}
                                                                />
                                                                : null
                                                        }
                                                    </td>
                                                    <td className="p-1">
                                                        {
                                                            classes
                                                                ?
                                                                <Dropdown
                                                                    search
                                                                    additionPosition='bottom'
                                                                    upward={false}
                                                                    selectOnBlur={false}
                                                                    fluid
                                                                    selection
                                                                    multiple={true}
                                                                    disabled={modalAction === 'EDIT'}
                                                                    placeholder={translations(locale).survey.choose || null}
                                                                    options={newSubjectRow[i]['optionClasses']}
                                                                    value={newSubjectRow[i]['groups']}
                                                                    onChange={(e, data) => {
                                                                        setState({
                                                                            selectedGroupId: data.value,
                                                                        });

                                                                        newSubjectRow[i]['groups'] = data.value;
                                                                    }}
                                                                />
                                                                : null
                                                        }
                                                    </td>
                                                    <td width={50} className='p-1 vertical-inherit text-center'>
                                                        {
                                                            i > 0
                                                                ?
                                                                <button
                                                                    onClick={() => newSubjectRemoveRow(i)}
                                                                    className="btn btn-danger m-btn m-btn--icon btn-sm m-btn--icon-only m-btn--pill d-inline-flex align-items-center justify-content-center">
                                                                    <CloseIcon sx={{fontSize: '1.2rem'}}/>
                                                                </button>
                                                                : null
                                                        }
                                                    </td>
                                                </tr>
                                            )
                                        })
                                    }
                                    <tr>
                                        <td className="border-white"/>
                                        <td style={{borderBottomColor: 'white'}}/>
                                        <td width={50} className='p-1 vertical-inherit text-center'>
                                            {
                                                newSubjectRow.length < isClassSubjects.length
                                                    ?
                                                    <button
                                                        onClick={newSubjectAddRow}
                                                        className="btn btn-outline-info m-btn m-btn--icon btn-sm m-btn--icon-only m-btn--pill d-inline-flex align-items-center justify-content-center"
                                                    >
                                                        <AddIcon/>
                                                    </button>
                                                    :
                                                    null
                                            }

                                        </td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div className="col-md-2">
                            </div>
                        </div>
                }
            </div>
        )
    };

    const _renderGroupSubject = () => {
        let that = this;
        return (
            <div>
                {
                    modalAction !== 'EDIT'
                    &&
                    <div className="form-group m-form__group row">
                        <label className="col-form-label col-md-4 col-sm-12 text-right label-pinnacle-bold">
                            {translations(locale).subject.title || null}
                        </label>
                        <div className="col-md-5 col-sm-12">
                            <Dropdown
                                placeholder={'-' + translations(locale).survey.choose + '-' || null}
                                fluid
                                selection
                                search
                                additionPosition='bottom'
                                upward={false}
                                closeOnChange
                                selectOnBlur={false}
                                value={selectedGroupSubjectId}
                                options={isNonClassSubjects}
                                onChange={newSubjectGroupSubjectChange}
                            />
                        </div>
                        <div className="col-md-4">
                        </div>
                    </div>
                }

                <div className="form-group m-form__group row">
                    <label className="col-form-label col-md-4 col-sm-12 text-right label-pinnacle-bold">
                        {translations(locale).first_name || null}
                    </label>
                    <div className="col-md-5 col-sm-12">
                        <input type="text" className="form-control m-input"
                               placeholder={translations(locale).insert_first_name || null}
                               value={selectedGroupName ? selectedGroupName : ''}
                               onChange={newSubjectGroupNameChange}/>
                    </div>
                    <div className="col-md-4">
                    </div>
                </div>

                <div className="form-group m-form__group row">
                    <div className="col-md-1">
                    </div>
                    <div className="col-md-10">
                        <table className="table newSubjectGroupDatatable">
                            <thead>
                            <tr>
                                <th className="text-right text-capitalize pb-4" style={{
                                    fontSize: 14,
                                    color: '#575962',
                                    fontWeight: 500
                                }}>{translations(locale).total + ':' || null} {groupTotalStudents}</th>
                            </tr>
                            </thead>
                            <tbody>
                            {
                                newSubjectGroupRow?.map(function (obj, i) {
                                    return (
                                        <tr key={'tr_group_' + i}>
                                            <td style={{verticalAlign: 'top'}} className="label-pinnacle-bold">
                                                {translations(locale).group.title || null}
                                            </td>
                                            <td className="p-1">
                                                <Dropdown
                                                    placeholder={'-' + translations(locale).survey.choose + '-' || null}
                                                    fluid
                                                    selection
                                                    search
                                                    additionPosition='bottom'
                                                    upward={false}
                                                    closeOnChange
                                                    selectOnBlur={false}
                                                    value={newSubjectGroupRow[i]['class']}
                                                    options={_getGroupSubjectClasses()}
                                                    onChange={(e, data) => {
                                                        setState({
                                                            fetchClassId: data.value,
                                                            showLoader: true,
                                                            fetchClassStudent: true
                                                        });

                                                        newSubjectGroupRow[i]['class'] = data.value;
                                                        newSubjectGroupRow[i]['group_student'] = [];
                                                        newSubjectGroupRow[i]['allStudents'] = [];
                                                        let params = {
                                                            class: data.value
                                                        };
                                                        // props.fetchClassStudents(params);
                                                    }}
                                                />
                                            </td>
                                            <td className="p-1">
                                                <Dropdown
                                                    placeholder={'-' + translations(locale).survey.choose + '-' || null}
                                                    fluid
                                                    selection
                                                    search
                                                    additionPosition='bottom'
                                                    upward={false}
                                                    selectOnBlur={false}
                                                    multiple={true}
                                                    value={newSubjectGroupRow[i]['group_student']}
                                                    options={newSubjectGroupRow[i]['allStudents']}
                                                    onChange={(e, data) => {

                                                        let count = 0;
                                                        let newSubjectGroupRow = newSubjectGroupRow;
                                                        for (let k = 0; k < newSubjectGroupRow.length; k++) {
                                                            let rowObj = newSubjectGroupRow[k];

                                                            if (k === i) {
                                                                rowObj['group_student'] = data.value;
                                                                count = count + data.value.length;
                                                            } else {
                                                                count = count + rowObj['group_student'].length;
                                                            }
                                                        }

                                                        setState({
                                                            newSubjectGroupRow,
                                                            groupTotalStudents: count
                                                        });

                                                        // newSubjectGroupRow[i]['group_student'] = data.value;
                                                    }}
                                                />
                                            </td>
                                            <td className="py-1" width={100}>
                                                {
                                                    i > 0
                                                        ?
                                                        <button
                                                            onClick={() => newSubjectGroupRemoveRow(i)}
                                                            className="btn btn-danger m-btn m-btn--icon btn-sm m-btn--icon-only m-btn--pill d-inline-flex align-items-center justify-content-center">
                                                            <CloseIcon sx={{fontSize: '1.2rem'}}/>
                                                        </button>
                                                        : null
                                                }
                                            </td>
                                        </tr>
                                    )
                                })
                            }
                            <tr>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td className="py-1" width={100}>
                                    <button onClick={newSubjectGroupAddRow}
                                            className="btn btn-outline-info m-btn m-btn--icon btn-sm m-btn--icon-only m-btn--pill d-inline-flex align-items-center justify-content-center"
                                    >
                                        <AddIcon/>
                                    </button>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="col-md-1">
                    </div>
                </div>
            </div>
        )
    };

    const _tabChange = (e, data) => {
        if (tabActiveIndex != data.activeIndex) {
            setState({
                tabActiveIndex: data.activeIndex
            })
        }
    }

    const messageHandleDismiss = () => {
        setState({
            message: null
        });
    };

    const closeModal = () => {
        setState({
            activeModal: false,
            modalAction: null,
            deleteSeasonDayId: null,
            selectedGroupSubjectId: null,
            editSubjectGroup: null,
            editSubjectClasses: [],
            isNonClassSubjects: [],
            selectedGroupName: '',
            newSubjectTabName: 'class',
            groupTotalStudents: 0,
            newSubjectRow: [{
                subject: null,
                groups: [],
                optionClasses: []
            }],
            newSubjectGroupRow: [{
                class: null,
                allStudents: [],
                group_student: []
            }],
            modalMessage: null,
        })
    };

    const _onTdClick = (id) => {
        setState({
            fetchViewSubject: true,
            showLoader: true,
        });

        let params = {
            group: id
        };

        // props.fetchMyTimetableViewSubject(params)
    }

    const newSubjectTabChange = (e, data) => {
        setState({
            newSubjectTabName: data.panes[data.activeIndex].menuName
        })
    }

    const myTimetableAddNewSubject = () => {
        setState({
            fetchNewSubject: true,
            showLoader: true,
            groupTotalStudents: 0
        });

        let params = {
            id: 1
        };

        // props.fetchMyTimetableNewSubject(params)
    };

    const newSubjectAddRow = () => {
        let newSubjectRow = newSubjectRow;
        newSubjectRow.push({
            subject: null,
            groups: [],
            optionClasses: []
        });

        setState({
            newSubjectRow,
        });
    }

    const newSubjectRemoveRow = (index) => {
        let newSubjectRow = newSubjectRow;
        let subjectId = newSubjectRow[index].subject;

        let selectedIsClassSubjectIds = selectedIsClassSubjectIds;
        selectedIsClassSubjectIds.splice(selectedIsClassSubjectIds.indexOf(subjectId), 1);

        let isClassSubjects = isClassSubjects;
        for (let i = 0; i < isClassSubjects.length; i++) {
            let subject = isClassSubjects[i];
            if (subject.value === subjectId) {
                subject['disabled'] = false;
                break;
            }
        }

        newSubjectRow.splice(index, 1);

        setState({
            newSubjectRow,
            isClassSubjects,
            selectedIsClassSubjectIds
        });
    }

    const newSubjectGroupAddRow = () => {
        let newSubjectGroupRow = newSubjectGroupRow;
        newSubjectGroupRow.push({
            class: null,
            allStudents: [],
            group_student: []
        });

        setState({
            newSubjectGroupRow,
        });
    }

    const newSubjectGroupRemoveRow = (index) => {
        let newSubjectGroupRow = newSubjectGroupRow;
        newSubjectGroupRow.splice(index, 1);

        let groupTotalStudents = 0;
        for (let i = 0; i < newSubjectGroupRow.length; i++) {
            groupTotalStudents = groupTotalStudents + newSubjectGroupRow[i].group_student.length;
        }

        setState({
            newSubjectGroupRow,
            groupTotalStudents
        });
    }

    const newSubjectSubmit = () => {
        if (modalAction === 'EDIT') {
            let params = {}
            if (editSubjectGroup?.isClass) {
                params = {
                    name: selectedGroupName,
                    submit: 1,
                    type: 'all',
                    group: editSubjectGroup?.id,

                }
            } else {
                const details = state?.newSubjectGroupRow?.map(el => ({
                    class: el.class,
                    students: el.group_student,
                }))
                params = {
                    group: editSubjectGroup?.id,
                    subject: selectedGroupSubjectId,
                    name: selectedGroupName,
                    type: 'group',
                    submit: 1,
                    details: JSON.stringify(details),
                }
            }
            setState({
                fetchEditSubject: true,
                fetchEditSubjectSubmit: true,
                showLoader: true,
            });
            // props.fetchTeacherTimetableEditSubjectSubmit(params);
        } else {
            if (newSubjectTabName === 'class') {
                let errorSubject = false;
                let errorGroup = false;

                for (var i = 0; i < newSubjectRow.length; i++) {
                    let subjectRow = newSubjectRow[i];
                    if (subjectRow.subject == null) {
                        errorSubject = true
                    } else if (subjectRow.groups.length < 1) {
                        errorGroup = true
                    }
                }

                if (errorSubject) {
                    _addMsg(translations(locale).timetable.select_subject)
                } else if (errorGroup) {
                    _addMsg(translations(locale).timetable.select_class)
                } else {
                    setState({
                        fetchNewSubjectSubmit: true,
                        showLoader: true
                    });

                    let details = newSubjectRow?.map(el => ({
                        subject: el.subject,
                        classes: el.groups,
                    }))

                    const params = {
                        submit: 1,
                        type: 'all',
                        details: JSON.stringify(details),

                    }

                    // props.fetchMyTimetableNewSubjectSubmit(params)
                }
            } else if (newSubjectTabName === 'group') {
                let error = false;

                if (!selectedGroupSubjectId) {
                    setState({
                        modalMessageSuccess: false,
                        modalMessage: translations(locale).timetable.select_subject || null
                    })
                    _addMsg(translations(locale).timetable.select_subject)

                } else if (!selectedGroupName) {
                    setState({
                        modalMessageSuccess: false,
                        modalMessage: translations(locale).teacher.new_name_placeholder || null
                    })
                    _addMsg(translations(locale).teacher.new_name_placeholder)
                } else {


                    if (newSubjectGroupRow.length > 0) {
                        for (let i = 0; i < newSubjectGroupRow.length; i++) {
                            let groupRow = newSubjectGroupRow[i];

                            if (groupRow['class'] == null || groupRow['group_student'].length < 1) {
                                error = true;
                            }
                        }
                    }

                    if (error === false) {
                        const details = state?.newSubjectGroupRow?.map(el => ({
                            class: el.class,
                            students: el.group_student,
                        }))

                        const params = {
                            subject: selectedGroupSubjectId,
                            name: selectedGroupName,
                            type: 'group',
                            submit: 1,
                            details: JSON.stringify(details),
                        }
                        setState({
                            fetchNewSubjectSubmit: true,
                            showLoader: true
                        });
                        // props.fetchMyTimetableNewSubjectSubmit(params)
                    } else {
                        setState({
                            modalMessageSuccess: false,
                            modalMessage: translations(locale).timetable.check_group_info || null
                        })
                        _addMsg(translations(locale).timetable.check_group_info)
                    }
                }
            }
        }
    }

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
                return _addMsg(translations(locale).err.fill_all_fields)
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

            setState({
                fetchAddTimetableSubmit: true,
                showLoader: true
            });
            // props.fetchMyTimetableAddTimetableSubmit(params)
        } else {
            _addMsg(translations(locale).timetable.select_day)
        }

    };

    const newSubjectGroupSubjectChange = (e, data) => {
        setState({
            selectedGroupSubjectId: data.value
        })
    }

    const newSubjectGroupNameChange = (e) => {
        setState({
            selectedGroupName: e.target.value
        })
    }

    const _contextMenuItemClick = (id, key) => {
        if (id && key) {
            if (key === 'VIEW') {
                setState({
                    fetchViewSubject: true,
                    showLoader: true,
                });

                let params = {
                    group: id
                };

                // props.fetchMyTimetableViewSubject(params)
            } else if (key === 'EDIT') {
                setState({
                    fetchEditSubject: true,
                    fetchEditSubjectSubmit: false,
                    showLoader: true,
                });

                let params = {
                    group: id
                };

                // props.fetchTeacherTimetableEditSubject(params)
            } else if (key === 'DELETE') {
                setState({
                    modalAction: 'DELETE',
                    modalSize: 'mini',
                    modalTitle: translations(locale).delete,
                    activeModal: true,
                    selectedTimeTableId: id
                });
            }
        }
    }

    const deleteSubjectSubmit = () => {
        setState({
            fetchDeleteSubject: true,
            showLoader: true,
        });

        let params = {
            group: selectedTimeTableId
        };

        // props.fetchTeacherTimetableDeleteSubject(params)
    }

    const deleteSeasonTimetableSubmit = () => {
        setState({
            fetchDeleteSeasonTimetable: true,
            showLoader: true
        });

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
                return _addMsg(translations(locale).err.fill_all_fields)
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
            setState({
                fetchEditTimetableSubmit: true,
                showLoader: true
            });

            // props.fetchMyTimetableSeasonEditSubmit(params)
        } else {
            _addMsg(translations(locale).timetable.select_day)
        }
    }

    const _handlerClassClick = (groupId) => {
        setState({
            fetchViewSubject: true,
            showLoader: true,
        });

        let params = {
            group: groupId
        };

        // props.fetchMyTimetableViewSubject(params)
    }

    const _seasonAddTimetable = (seasonId) => {
        setState({
            fetchAddTimetable: true,
            showLoader: true,
            selectedTimetableDayId: null
        });

        let params = {
            season: seasonId
        };

        // props.fetchMyTimetableAddTimetable(params)
    }

    const addTimetableRow = (shift_id) => {
        if (shift_id) {
            let shiftWithTime = shiftWithTime;
            let selectedShiftObj = shiftWithTime.find(function (obj) {
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

            setState({
                shiftWithTime
            })
        }
    };

    const addTimetableRemoveRow = (value) => {
        if (value) {
            let indexArray = value.split("_");
            if (indexArray && indexArray.length > 0) {
                let schoolShiftId = indexArray[0];
                let timesIndex = indexArray[1];

                let shiftWithTime = shiftWithTime;

                let selectedShiftObj = shiftWithTime.find(function (obj) {
                    return parseInt(obj['id']) === parseInt(schoolShiftId);
                });
                if (selectedShiftObj) {
                    selectedShiftObj['times'].splice(timesIndex, 1);

                    setState({
                        shiftWithTime
                    })
                }
            }
        }
    };

    const handlerTimetableCheckbox = (e, {value}) => {
        let valueArray = value.split("_");
        let schoolShiftId = 0;
        let timesIndex = -1;

        if (valueArray && valueArray.length > 1) {
            schoolShiftId = valueArray[0];
            timesIndex = valueArray[1];
        }

        let shiftWithTime = shiftWithTime;

        let schoolShift = shiftWithTime.find(function (val) {
            return parseInt(val['id']) === parseInt(schoolShiftId)
        });

        if (schoolShift && timesIndex > -1) {
            let times = schoolShift['times'][timesIndex];
            if (times) {
                if (times['isChecked'] === false || typeof times['isChecked'] === 'undefined') {
                    times['isChecked'] = true;
                } else {
                    times['groupId'] = null;
                    times['isChecked'] = false;
                }

            }
        }

        setState({
            shiftWithTime
        });
    };

    const _addTimetableGroupChange = (data, shiftId, timeIndex) => {
        if (data && timeIndex) {
            let shiftWithTime = shiftWithTime;

            let selectedShiftObj = shiftWithTime.find(function (obj) {
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

            setState({
                shiftWithTime
            })
        }
    };

    const _addTimetableDayChange = (e, data) => {
        let selectedOption = data.options.filter(day => {
            return day.value === data.value;
        });

        if (selectedOption && selectedOption.length > 0 && selectedOption[0].timetable > 0) {
            setState({
                selectedTimetableDayId: data.value,
                ableToAddTimetable: false
            })
        } else {
            setState({
                selectedTimetableDayId: data.value,
                ableToAddTimetable: true
            })
        }
    };

    const onOpenDayDropdown = (e) => {
        // if ($(e.target).hasClass('text') || $(e.target).hasClass('icon') || $(e.target).hasClass('search')) {
        //     let increaseHeight = parseInt($('.modal .content').innerHeight()) + parseInt($(e.target).parent().find('div.transition').innerHeight()) - 60;
        //     $('.modal .content').css('height', increaseHeight)
        // } else {
        //     let increaseHeight = $('.modal .content').innerHeight() + $(e.target).find('div.transition').height() - 60;
        //     $('.modal .content').css('height', increaseHeight)
        // }
    }

    const onCloseDayDropdown = () => {
        // $('.modal .content').css('height', 'auto')
    }

    const addTimetableInputStartTimeHandler = (event, timeIndex) => {
        if (event.target.value && timeIndex) {
            let shiftWithTime = shiftWithTime;

            let selectedShiftObj = shiftWithTime.find(function (obj) {
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

            setState({
                shiftWithTime
            })
        }
    };

    const addTimetableInputEndTimeHandler = (event, timeIndex) => {
        if (event.target.value && timeIndex) {
            let shiftWithTime = shiftWithTime;

            let selectedShiftObj = shiftWithTime.find(function (obj) {
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

            setState({
                shiftWithTime
            })
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

    // Add new subject end

    const _onSubjectChange = (e, data, i) => {
        const isClassSubjects = [...isClassSubjects];
        let newSubjectRow = [...newSubjectRow];
        newSubjectRow[i]['subject'] = data.value;

        const selectedIsClassSubjectIds = [];

        for (const row of newSubjectRow) {
            if (row.subject) {
                selectedIsClassSubjectIds.push(row.subject)
            }
        }

        for (const subject of isClassSubjects) {
            subject.disabled = selectedIsClassSubjectIds.indexOf(subject.value) > -1;
        }

        const selected = data.options.find(subject => subject.value === data.value);

        const allClasses = [...classes];
        let rowClassOptions = [];
        if (selected && selected.gradeIds) {
            rowClassOptions = allClasses.filter(classObj => selected.gradeIds.indexOf(classObj.gradeId) > -1);
        }
        const filteredClasses = rowClassOptions.filter(item => {
            return selected?.classes?.indexOf(item.id) === -1
        });
        newSubjectRow[i]['optionClasses'] = filteredClasses;
        setState({
            isClassSubjects,
            newSubjectRow,
            selectedIsClassSubjectIds
        });
    }

    const _getGroupSubjectClasses = () => {
        let subjectClasses = [];
        const classes = [...classes];
        const subjects = [...isNonClassSubjects];
        if (selectedGroupSubjectId && classes.length) {
            const selectedSubject = subjects.find(subject => subject.value === selectedGroupSubjectId);
            if (selectedSubject && selectedSubject.gradeIds) {
                subjectClasses = classes.filter(classObj => selectedSubject.gradeIds.indexOf(classObj.gradeId) > -1);
            }
        }
        return subjectClasses;
    }

    const _addMsg = (message, success) => {
        if (message) {
            if (success) {
                toast.success(message, {
                    position: "top-right",
                    autoClose: 8000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            } else {
                toast.error(message, {
                    position: "top-right",
                    autoClose: 8000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            }
        }
    }
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
                <div className="m-portlet  tab">
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
                showLoader
                    ?
                    <div>
                        <div className="blockUI blockOverlay">
                        </div>
                        <div className="blockUI blockMsg blockPage">
                            <div className="m-loader m-loader--brand m-loader--lg">
                            </div>
                        </div>
                    </div>
                    :
                    null
            }
            <Modal
                size={modalSize}
                dimmer={'blurring'}
                open={activeModal}
                // onClose={closeModal}
                className="react-modal"
            >
                <div className="header">{modalTitle}
                    <button type="button" className="close" aria-label="Close" onClick={closeModal}>
                        <CloseIcon/>
                    </button>
                </div>
                <div className="content">
                    <div className="myTimetable-addNewSubjectStyle">
                        {
                            modalAction === 'NEW'
                                ?
                                <Tab
                                    menu={{attached: false}}
                                    onTabChange={newSubjectTabChange}
                                    panes={[
                                        {
                                            menuItem: translations(locale).timetable.class_student?.toUpperCase(),
                                            menuName: 'class',
                                            render: () => <Tab.Pane>
                                                {
                                                    _renderClassSubject()
                                                }
                                            </Tab.Pane>
                                        },
                                        {
                                            menuItem: translations(locale).timetable.group_student?.toUpperCase(),
                                            menuName: 'group',
                                            render: () => <Tab.Pane>
                                                {
                                                    _renderGroupSubject()
                                                }
                                            </Tab.Pane>
                                        },
                                    ]}
                                />
                                : modalAction === 'EDIT'
                                ?
                                classOrGroup === 'CLASS'
                                    ?
                                    _renderClassSubject()
                                    :
                                    classOrGroup === 'GROUP'
                                        ?
                                        _renderGroupSubject()
                                        : null
                                : modalAction === 'VIEW'
                                    ?
                                    <DTable
                                        config={studentModalConfig}
                                        data={viewStudentLists}
                                        columns={studentModalColumn}
                                        locale={locale}
                                    />
                                    : modalAction === 'DELETE'
                                        ?
                                        <div>
                                            <p>{translations(locale).delete_confirmation || null}</p>
                                            <p>{translations(locale).delete_confirmation_description || null}</p>
                                        </div>
                                        : modalAction === 'SEASON_ADD'
                                            ?
                                            <div>
                                                <div className="form-group m-form__group row">
                                                    <div className="col-md-12 displayFlex">
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
                                                                    onOpen={onOpenDayDropdown}
                                                                    onClose={onCloseDayDropdown}
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
                                                                                                        <Checkbox
                                                                                                            className="myTimetable-checkBoxStyle pl-1"
                                                                                                            defaultChecked={times['isChecked'] === true ? true : false}
                                                                                                            value={times['index']}
                                                                                                            onChange={handlerTimetableCheckbox}
                                                                                                        />
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
                                            : modalAction === 'SEASON_DELETE'
                                                ?
                                                <div>
                                                    <p>{translations(locale).delete_confirmation || null}</p>
                                                    <p>{translations(locale).delete_confirmation_description || null}</p>
                                                </div>
                                                :
                                                modalAction === 'SEASON_EDIT'
                                                    ?
                                                    editTimetableDay
                                                        ?
                                                        <div>
                                                            <div className="form-group m-form__group row">
                                                                <div className="col-md-12 displayFlex">
                                                                    <label htmlFor="example-number-input"
                                                                            className="col-md-4 col-form-label label-pinnacle-bold text-right">
                                                                        {translations(locale).timetable.day || null}
                                                                    </label>
                                                                    <div className="col-md-5">
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
                                                                            value={editTimetableDay}
                                                                            disabled={true}
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            {
                                                                shiftWithTime?.map(function (schoolShift, index) {
                                                                    return (
                                                                        <div
                                                                            key={'school_shift_' + schoolShift['id']}
                                                                            className="myTimetable-add-timetable">
                                                                            <div
                                                                                className="bolder pb-2 pl-3"
                                                                                style={{color: '#ff2f19'}}>
                                                                                {schoolShift['name']}
                                                                            </div>

                                                                            <table className="table table-bordered"
                                                                                    key={'newSubject_' + index}>
                                                                                <thead>
                                                                                <tr>
                                                                                    <th className="bolder pl-4"
                                                                                        style={{
                                                                                            color: '#575962',
                                                                                            fontSize: '11px'
                                                                                        }}
                                                                                        colSpan={2}>{translations(locale).timetable.time || null}</th>
                                                                                    <th className="bolder pl-4"
                                                                                        style={{
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
                                                                                                    <td className="p-1 text-center vertical-inherit">
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
                                                                                                    <td className="p-1 text-center vertical-inherit">
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
                                                                                                            style={{display: 'flex'}}>
                                                                                                            <Checkbox
                                                                                                                className="myTimetable-checkBoxStyle pl-1"
                                                                                                                defaultChecked={times['isChecked'] === true ? true : false}
                                                                                                                value={times['index']}
                                                                                                                onChange={handlerTimetableCheckbox}
                                                                                                            />
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
                                                                                                                        placeholder={translations(locale).survey.choose || null}
                                                                                                                        options={seasonTimetableSubjectList}
                                                                                                                        value={times['groupId'] || null}
                                                                                                                        onChange={(e, data) => _addTimetableGroupChange(data, times['id'], times['index'])}
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
                                                            }
                                                        </div>
                                                        :
                                                        <div className="form-group m-form__group row">
                                                            <div className="col-md-12 text-center">
                                                                {translations(locale).timetable.choose_day || null}
                                                            </div>
                                                        </div>
                                                    :
                                                    null
                        }

                    </div>
                </div>
                <div className="actions modal-footer">
                    {
                        modalAction === 'VIEW'
                            ?
                            <div className={"col-12 text-center"}>
                                <button
                                    className="btn m-btn--pill btn-outline-metal m-btn--uppercase"
                                    onClick={closeModal}
                                >
                                    {translations(locale).close || null}
                                </button>
                            </div>

                            : modalAction === 'NEW' || modalAction === 'EDIT'
                            ?
                            <div className={"col-12 text-center"}>
                                <button className="btn m-btn--pill btn-link margin-right-5"
                                        onClick={closeModal}>{translations(locale).back || null}
                                </button>
                                <button
                                    className="btn btn-success m-btn m-btn--icon m-btn--pill m-btn--uppercase"
                                    onClick={newSubjectSubmit}>{translations(locale).save || null}
                                </button>
                            </div>
                            : modalAction === 'DELETE'
                                ?
                                <div className={"col-12 text-center"}>
                                    <button className="btn m-btn--pill btn-link"
                                            onClick={closeModal}>{translations(locale).back || null}
                                    </button>
                                    <button
                                        className="btn btn-danger m-btn--pill m-btn--uppercase"
                                        onClick={deleteSubjectSubmit}>{translations(locale).delete || null}
                                    </button>
                                </div>
                                : modalAction === 'SEASON_ADD'
                                    ?
                                    <div className={"col-12 text-center"}>
                                        <button className="btn m-btn--pill btn-link margin-right-5"
                                                onClick={closeModal}>{translations(locale).back || null}
                                        </button>
                                        <button
                                            className="btn btn-success m-btn m-btn--icon m-btn--pill m-btn--uppercase"
                                            onClick={addNewTimetableSubmit}>{translations(locale).save || null}
                                        </button>
                                    </div>
                                    : modalAction === 'SEASON_DELETE'
                                        ?
                                        <div className={"col-12 text-center"}>
                                            <button className="btn m-btn--pill btn-link margin-right-5"
                                                    onClick={closeModal}>{translations(locale).back || null}
                                            </button>
                                            <button
                                                className="btn btn-danger m-btn m-btn--icon m-btn--pill m-btn--uppercase"
                                                onClick={deleteSeasonTimetableSubmit}>{translations(locale).delete || null}
                                            </button>
                                        </div>
                                        :
                                        modalAction === 'SEASON_EDIT'
                                            ?
                                            <div className={"col-12 text-center"}>
                                                <button className="btn m-btn--pill btn-link margin-right-5"
                                                        onClick={closeModal}>{translations(locale).back || null}
                                                </button>
                                                <button
                                                    className="btn btn-success m-btn m-btn--icon m-btn--pill m-btn--uppercase"
                                                    onClick={deleteSeasonEditTimetableSubmit}>{translations(locale).save || null}
                                                </button>
                                            </div>
                                            :
                                            null
                    }
                </div>
            </Modal>
        </div>
    )
}

export default index