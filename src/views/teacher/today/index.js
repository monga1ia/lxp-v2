import React, { useRef, useState } from 'react'
import {connect} from 'react-redux';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import {Message, Checkbox, Tab, TextArea, Image, Placeholder, List} from 'semantic-ui-react'
import {NDropdown as Dropdown} from "widgets/Dropdown";
// import DataTable from 'widgets/datatable/DataTable'
import DataTable from 'modules/DataTable/DataTable';
import DTable from 'modules/DataTable/DTable';
// import * as actions from "Actions/action";
import {translations} from 'utils/translations'
import {dateFormat, htmlDecode, floatFormat, isLargerFile, hexToRgb} from 'utils/Util'
import {Editor} from 'react-draft-wysiwyg';
import message from 'modules/message';
// import { EditorState, ContentState, convertToRaw, convertFromHTML } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import Carousel from 'react-multi-carousel';
import ImageEditor from '@toast-ui/react-image-editor'
// import * as FileSaver from 'file-saver';
// import * as XLSX from 'xlsx';
import {toast} from "react-toastify";
import ReactPlayer from "react-player";
// import {getUrl} from 'Actions/promiseUtil'
// import myTodayOnlineLessonFileRemove from "Reducer/my/myTodayOnlineLessonFileRemove";
import HtmlHead from 'components/html-head/HtmlHead';
import BreadcrumbList from 'components/breadcrumb-list/BreadcrumbList';
import EmailIcon from '@mui/icons-material/Email';
import InsertInvitationIcon from '@mui/icons-material/InsertInvitation';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import secureLocalStorage from 'react-secure-storage';
import BehaviorModal from './modal/behavior'
import ApproveStudentModal from './modal/approveStudents'
import { useTranslation } from 'react-i18next';
import { Row, Col, Modal } from 'react-bootstrap';

import DeleteHWInfo from './modal/deleteHomework';

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

const HOMEWORK_TAB_PANES = ['homework_check', 'homework_assign'];

const responsive = {
    desktop: {
        breakpoint: {max: 3000, min: 1024},
        items: 5,
        slidesToSlide: 3 // optional, default to 1.
    },
    tablet: {
        breakpoint: {max: 1024, min: 464},
        items: 3,
        slidesToSlide: 2 // optional, default to 1.
    },
    mobile: {
        breakpoint: {max: 464, min: 0},
        items: 2,
        slidesToSlide: 1 // optional, default to 1.
    }
};

const CustomRightArrow = ({onClick, ...rest}) => {
    const {
        onMove,
        carouselState: {currentSlide, deviceType}
    } = rest;
    // onMove means if dragging or swiping in progress.
    return <button onClick={() => onClick()} aria-labelledby="Main"
                   className="react-multiple-carousel__arrow react-multiple-carousel__arrow--right"><span><i
        className="la la-angle-right"/></span></button>;
};
const CustomLeftArrow = ({onClick, ...rest}) => {
    const {
        onMove,
        carouselState: {currentSlide, deviceType}
    } = rest;
    // onMove means if dragging or swiping in progress.
    return <button onClick={() => onClick()} aria-labelledby="Main"
                   className="react-multiple-carousel__arrow react-multiple-carousel__arrow--left"><span><i
        className="la la-angle-left"/></span></button>;
};

const locale_mn = { // override default English locale to your custom
    'Undo': 'Буцах',
    'Redo': 'Өмнөх',
    'Reset': 'Дахин ачаалуулах',
    'Delete': 'Устгах',
    'DeleteAll': 'Бүгдийг устгах',
    'Draw': 'Зурах',
    'Shape': 'Дүрс оруулах',
    'Text': 'Текст оруулах',
};

const myTheme = {
    'common.bi.image': '',
    'common.bisize.width': '251px',
    'common.bisize.height': '21px',
    'common.backgroundImage': 'none',
    'common.backgroundColor': '#1e1e1e',
    'common.border': '0px',

    // header
    'header.backgroundImage': 'none',
    'header.backgroundColor': 'transparent',
    'header.border': '0px',
    'header.display': 'none',
    'header.height': 0,

    // load button
    'loadButton.backgroundColor': '#fff',
    'loadButton.border': '1px solid #ddd',
    'loadButton.color': '#222',
    'loadButton.fontFamily': 'NotoSans, sans-serif',
    'loadButton.fontSize': '12px',

    // download button
    'downloadButton.backgroundColor': '#fdba3b',
    'downloadButton.border': '1px solid #fdba3b',
    'downloadButton.color': '#fff',
    'downloadButton.fontFamily': 'NotoSans, sans-serif',
    'downloadButton.fontSize': '12px',

    // icons default
    'menu.normalIcon.color': '#8a8a8a',
    'menu.activeIcon.color': '#555555',
    'menu.disabledIcon.color': '#434343',
    'menu.hoverIcon.color': '#e9e9e9',
    'submenu.normalIcon.color': '#8a8a8a',
    'submenu.activeIcon.color': '#e9e9e9',

    'menu.iconSize.width': '24px',
    'menu.iconSize.height': '24px',
    'submenu.iconSize.width': '32px',
    'submenu.iconSize.height': '32px',

    // submenu primary color
    'submenu.backgroundColor': '#1e1e1e',
    'submenu.partition.color': '#858585',

    // submenu labels
    'submenu.normalLabel.color': '#858585',
    'submenu.normalLabel.fontWeight': 'lighter',
    'submenu.activeLabel.color': '#fff',
    'submenu.activeLabel.fontWeight': 'lighter',

    // checkbox style
    'checkbox.border': '1px solid #ccc',
    'checkbox.backgroundColor': '#fff',

    // rango style
    'range.pointer.color': '#fff',
    'range.bar.color': '#666',
    'range.subbar.color': '#d1d1d1',

    'range.disabledPointer.color': '#414141',
    'range.disabledBar.color': '#282828',
    'range.disabledSubbar.color': '#414141',

    'range.value.color': '#fff',
    'range.value.fontWeight': 'lighter',
    'range.value.fontSize': '11px',
    'range.value.border': '1px solid #353535',
    'range.value.backgroundColor': '#151515',
    'range.title.color': '#fff',
    'range.title.fontWeight': 'lighter',

    'draw.drawColorpicker.color': '#151515',

    // colorpicker style
    'colorpicker.button.border': '1px solid #1e1e1e',
    'colorpicker.title.color': '#fff'
};

const locale = secureLocalStorage?.getItem('selectedLang') || 'mn'

const index = () => {

    const { t } = useTranslation()

    const title = t('menu.teacher.today');
    const description = "E-learning";
    const breadcrumbs = [
        { to: "", text: "Home" },
        { to: "teacher/today", text: title }
    ];

    const [fetchInit, setFetchInit] = useState(false)

    const [selectedDay, setSelectedDay] = useState(dateFormat(new Date()))
    const [hasBehavior, setHasBehavior] = useState(false)
    const [currentSeason, setCurrentSeason] = useState(null)
    const [lists, setLists] = useState([
        {
            times: [
                [
                    {
                        subject: 'Math',
                        classes: [
                            'Science',
                            'History'
                          ]
                    },
                    {
                        group_id: 'Science'
                    }
                ],
                [
                    {
                        subject: 'English',
                        classes: [
                            'Science',
                            'History'
                          ],
                        groupApproved: true
                    },
                    {
                        group_id: 'Science'
                    }
                ]
            ],
            school_shift:
            [
                'a12i', 'asij'
            ]
          },
          {
            times: [
                [
                    {
                        subject: 'Math',
                        classes: [
                            'Science',
                            'History'
                          ]
                    },
                    {
                        group_id: 'Science'
                    }
                ],
                [
                    {
                        subject: 'English',
                        classes: [
                            'Science',
                            'History'
                          ]
                    },
                    {
                        group_id: 'Science'
                    }
                ]
            ],
            school_shift:
            [
                'a12i', 'asij'
            ]
          }
    ])

    const [message, setMessage] = useState(null)
    const [messageSuccess, setMessageSuccess] = useState(null)
    const [modalAction, setModalAction] = useState('')
    // Group students modal action
    const [fetchGroupStudentModal, setFetchGroupStudentModal] = useState(false)
    const [activeModal, setActiveModal] = useState(false)
    const [inactiveModal, setInactiveModal] = useState(false)
    const [modalTitle, setModalTitle] = useState('')
    const [modalGroup, setModalGroup] = useState({})
    const [studentList, setStudentList] = useState([])
    const [groupStudentList, setGroupStudentList] = useState([])
    const [homeworkCalendar, setHomeworkCalendar] = useState(null)
    const [textOrButton, setTextOrButton] = useState('button')
    const [homeworkDisableNew, setHomeworkDisableNew] = useState(false)
    const [selectedSchoolShiftId, setSelectedSchoolShiftId] = useState(null)
    const [selectedTimeTableId, setSelectedTimeTableId] = useState(null)
    // Attendance students modal action
    const [attendanceAble, setAttendanceAble] = useState(false)
    const [contextMenuId, setContextMenuId] = useState(null)
    const [attendanceAttTypes, setAttendanceAttTypes] = useState([])
    const [fetchAttendanceStudentModal, setFetchAttendanceStudentModal] = useState(false)
    const [attendanceStudentList, setAttendanceStudentList] = useState([])
    const [fetchAttendanceStudentDetail, setFetchAttendanceStudentDetail] = useState(false)
    const [fetchAttSend, setFetchAttSend] = useState(false)
    const [attendanceDate, setAttendanceDate] = useState('')
    const [attendanceTime, setAttendanceTime] = useState('')
    const [attendanceGroup, setAttendanceGroup] = useState({})
    const [existingAttendance, setExistingAttendance] = useState(false)
    const [attendanceTeacherLog, setAttendanceTeacherLog] = useState(false)
    const [attendanceReport, setAttendanceReport] = useState([])
    // Other attendance modal action
    const [fetchOtherAttSend, setFetchOtherAttSend] = useState(false)
    const [otherAttModal, setOtherAttModal] = useState(false)
    const [otherAttModalTitle, setOtherAttModalTitle] = useState('')
    const [otherTimeTableList, setOtherTimeTableList] = useState([])
    const [otherTimetableDescription, setOtherTimetableDescription] = useState('')
    const [selectedTimeTableIds, setSelectedTimeTableIds] = useState([])
    const [otherModalMessage, setOtherModalMessage] = useState(null)
    // Homework modal action
    const [fetchHomeworkStudentModal, setFetchHomeworkStudentModal] = useState(false)
    const [fetchHomeworkInfo, setFetchHomeworkInfo] = useState(false)
    const [studentFileClickModal, setStudentFileClickModal] = useState(false)
    const [homeworkTabActiveIndex, setHomeworkTabActiveIndex] = useState(0)
    const [homeworkTabName, setHomeworkTabName] = useState('homework_check')
    const [homeworkObj, setHomeworkObj] = useState(null)
    const [homeworkGroup, setHomeworkGroup] = useState({})
    const [homeworkGroups, setHomeworkGroups] = useState([])
    const [homeworkReport, setHomeworkReport] = useState([])
    const [homeworkFileLoading, setHomeworkFileLoading] = useState(false)
    const [selectedHomeworkGroupIds, setSelectedHomeworkGroupIds] = useState([])
    const [fileClickHomeworkInfo, setFileClickHomeworkInfo] = useState([])
    const [fileClickStudentInfo, setFileClickStudentInfo] = useState([])
    const [fileClickDetails, setFileClickDetails] = useState([])
    const [fileClickModalTitle, setFileClickModalTitle] = useState(null)
    const [homeworkSelectedDay, setHomeworkSelectedDay] = useState('')
    const [homeworkDescription, setHomeworkDescription] = useState('')
    const [homeworkAssignSelectedDay, setHomeworkAssignSelectedDay] = useState(dateFormat(new Date()))
    const [homeworkAssignDescription, setHomeworkAssignDescription] = useState('')
    const [homeworkAssignScore, setHomeworkAssignScore] = useState(100)
    const [homeworkLink, setHomeworkLink] = useState('')
    const [homeworkEditLink, setHomeworkEditLink] = useState('')
    const [inputViewOrEdit, setInputViewOrEdit] = useState('view')
    const [homeworkScore, setHomeworkScore] = useState(null)
    const [homeworkFile, setHomeworkFile] = useState(null)
    const [homeworkAssignFile, setHomeworkAssignFile] = useState(null)
    const [allRowChecked, setAllRowChecked] = useState(false)
    const [files, setFiles] = useState([])
    const [filesAssign, setFilesAssign] = useState([])
    const [fileSizeErrorAssign, setFileSizeErrorAssign] = useState(false)
    const [fileSizeError, setFileSizeError] = useState(false)
    const [removedFiles, setRemovedFiles] = useState([])
    const [removedFilesAssign, setRemovedFilesAssign] = useState([])
    const [newFileInputText, setNewFileInputText] = useState('')
    const [homeworkStudents, setHomeworkStudents] = useState([])
    const [homeworkTypes, setHomeworkTypes] = useState([])
    const [homeworkContextMenuId, setHomeworkContextMenuId] = useState(null)//'cm_homework'
    const [deleteHomeworkDetailModalShow, setDeleteHomeworkDetailModalShow] = useState(false)
    const [deleteHomeworkDetailStudentId, setDeleteHomeworkDetailStudentId] = useState(null)
    const [showLoaderDeleteModal, setShowLoaderDeleteModal] = useState(false)
    const [fetchHomeworkRemove, setFetchHomeworkRemove] = useState(false)
    const [removeMessage, setRemoveMessage] = useState(null)
    const [mainModalMessage, setMainModalMessage] = useState(null)
    const [fetchHomeworkSendAction, setFetchHomeworkSendAction] = useState(false)
    const [editorState, setEditorState] = useState('')
    const [homeworkEditDay, setHomeworkEditDay] = useState(null)
    const [homeworkEditEditorState, setHomeworkEditEditorState] = useState('')
    const [homeworkEditScore, setHomeworkEditScore] = useState(null)
    const [deleteHomeworkModalShow, setDeleteHomeworkModalShow] = useState(false)
    const [fetchDeleteHomework, setFetchDeleteHomework] = useState(false)
    // homework error messages
    const [errorGroupsMessage, setErrorGroupsMessage] = useState(null)
    const [errorDateMessage, setErrorDateMessage] = useState(null)
    const [errorHomeworkMessage, setErrorHomeworkMessage] = useState(null)
    const [successHomeworkMessage, setSuccessHomeworkMessage] = useState(null)
    const [errorHomeworkCheckMessage, setErrorHomeworkCheckMessage] = useState(null)
    const [errorEditMessage, setErrorEditMessage] = useState(null)
    // online lesson
    const [onlineLessonTabActiveIndex, setOnlineLessonTabActiveIndex] = useState(0)
    const [onlineLessonTabName, setOnlineLessonTabName] = useState('link')
    const [onlineLessonGroup, setOnlineLessonGroup] = useState([])
    const [linkInfo, setLinkInfo] = useState([])
    const [insertedOnlineLessonLink, setInsertedOnlineLessonLink] = useState('')
    const [onlineLessonLinkDescription, setOnlineLessonLinkDescription] = useState('')
    const [onlineLessonGoogleDriverDescription, setOnlineLessonGoogleDriverDescription] = useState('')
    const [onlineLessonVideoDescription, setOnlineLessonVideoDescription] = useState('')
    const [googleDriverFile, setGoogleDriverFile] = useState(null)
    const [videoFile, setVideoFile] = useState([])
    const [googleDriverNewFileInputText, setGoogleDriverNewFileInputText] = useState('')
    const [videoNewFileInputText, setVideoNewFileInputText] = useState('')
    const [onlineLessonAction, setOnlineLessonAction] = useState(null)
    const [googleDriverFiles, setGoogleDriverFiles] = useState([])
    const [videos, setVideos] = useState([])
    const [noneOrBlock, setNoneOrBlock] = useState('block')
    const [fileTest, setFileTest] = useState('')
    const [annotationData, setAnnotationData] = useState([])
    const [fileEditData, setFileEditData] = useState([])
    const [g_file_path, setG_file_path] = useState('')
    const [newImage, setNewImage] = useState('')
    const [editing, setEditing] = useState(false)
    // behavior
    const [fetchBehaviorStudentModal, setFetchBehaviorStudentModal] = useState(false)
    const [showBehaviorModal, setShowBehaviorModal] = useState(false)
    const [behaviorModalParam, setBehaviorModalParam] = useState(null)
    const [fetchSubmitBehavior, setFetchSubmitBehavior] = useState(false)
    const [attendanceCheckable, setAttendanceCheckable] = useState([])
    const [attendanceCheckEnabled, setAttendanceCheckEnabled] = useState(false)
    // approve student
    const [showApproveStudentModal, setShowApproveStudentModal] = useState(false)
    const [approveStudentModalParam, setApproveStudentModalParam] = useState(null)
    const [fetchApproveStudent, setFetchApproveStudent] = useState(false)
    const [fetchSubmitApproveStudent, setFetchSubmitApproveStudent] = useState(false)
    const[selectedHomeworkValue, setSelectedHomeworkValue] = useState('')

    const [showLoader, setShowLoader] = useState(false)
    const [showLoaderModal, setShowLoaderModal] = useState(false)
    const [fileUploadModal, setShowFileUploadModal] = useState(false)
    const [fileEditModal, setFileEditModal] = useState(false)

    const canvasReference = useRef()
    const fileUploader = useRef()

        const studentModalColumn = [
            {
                dataField: "avatar",
                text: translations(locale).photo || "",
                align: 'center',
                headerStyle: () => ({
                    width: 80,
                }),
                formatter: (cell, row) => {
                    return <img className='img-responsive img-circle' src={cell || '/images/avatar.png'} width={40}
                                height={40} alt={row.firstName}
                                onError={(e) => {
                                    e.target.onError = null
                                    e.target.src = '/images/avatar.png'
                                }}
                    />
                }
            },
            {
                dataField: "className",
                text: translations(locale).group.title || "",
                sort: true
            },
            {
                dataField: "studentCode",
                text: translations(locale).studentCode || "",
                sort: true,
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
        ];

        const studentModalConfig = {
            showAllData: true,
            showPagination: false,
            showFilter: true,
            excelExport: true,
            defaultSort: [{
                dataField: 'firstName',
                order: 'asc'
            }]
        };

        const attendanceColumns = [
            {
                dataField: "avatar",
                text: translations(locale).photo || "",
                align: "center",
                headerStyle: () => ({
                    width: 80,
                }),
                style: {
                    padding: '0.25rem',
                    verticalAlign: 'middle',
                },
                formatter: (cell, row) => {
                    return <img className='img-responsive img-circle' src={cell || '/images/avatar.png'} width={40}
                                height={40} alt={row.firstName}/>
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
                dataField: "radioTypeId",
                text: translations(locale).attendance.title || "",
                headerStyle: () => ({
                    width: 219
                }),
                style: {
                    padding: '0.25rem',
                    verticalAlign: 'middle',
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
                            <div className='row flex-row flex-nowrap' style={{gap: 9}}>
                                {
                                    attendanceAttTypes.map((type, key) => {
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
                                        return <button onClick={(e) => handleRadioChange(row.id + '_' + type.id)}
                                                       style={{...baseButton, ...button}} key={key} className='br-08'
                                                       type='button'>{type.shortName}</button>
                                    })
                                }
                            </div>
                        </div>
                    )
                }
            },
            {
                dataField: "comment",
                text: translations(locale).attendance.late || "",
                headerStyle: () => ({
                    width: 100
                }),
                style: {
                    padding: '0.25rem',
                    verticalAlign: 'middle',
                },
                formatter: (cell, row) => {
                    return (
                        <>
                            <input
                                onKeyUp={(e) => handleInlineEditChange(e.target.value, row.id, e.key)}
                                onBlur={(e) => handleInlineEditChange(e.target.value, row.id, "Enter")}
                                disabled={row.isDisabled} required type='number' min={1} max={99}
                                className='form-control' defaultValue={cell} list="defaultMinutes"/>
                            <datalist id="defaultMinutes">
                                <option value="5"/>
                                <option value="10"/>
                                <option value="15"/>
                                <option value="20"/>
                                <option value="25"/>
                                <option value="30"/>
                                <option value="35"/>
                                <option value="40"/>
                            </datalist>
                        </>
                    )
                }
            }
        ];

        const attendanceConfig = {
            showAllData: true,
            showPagination: false,
            showLeftButton: true,
            leftButtonStyle: {position: 'relative', bottom: '5px'},
            leftButtonClassName: 'btn m-btn--pill btn-publish m-btn--uppercase m-btn--wide',
            leftButtonText: translations(locale).attendance.sent_attendance,
            defaultSort: [{
                dataField: 'firstName',
                order: 'asc'
            }]
        };

        const homeworkColumns = [
            {
                dataField: "smallPhoto",
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
                    return <img className='img-responsive img-circle' src={cell || '/images/avatar.png'} width={40}
                                height={40} alt={row.firstName}/>
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
                                className='form-control' defaultValue={cell} list="defaultScores"/>
                            <datalist id="defaultScores">
                                <option value="10"/>
                                <option value="20"/>
                                <option value="30"/>
                                <option value="40"/>
                                <option value="50"/>
                                <option value="60"/>
                                <option value="80"/>
                                <option value="90"/>
                                <option value="100"/>
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
                            <div className='row flex-row flex-nowrap' style={{gap: 9}}>
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
                                        return <button onClick={(e) => homeworkRadioChange(row.id + '_' + type.id)}
                                                       style={{...baseButton, ...button}} key={key} className='br-08'
                                                       type='button'>{type.shortName}</button>
                                    })
                                }
                            </div>
                        </div>
                    )
                }
            },
            // {
            //     dataField: "studentDetail",
            //     text: translations(locale).my.sent_file || "",
            // },
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
                    return <input onBlur={(e) => homeworkInlineEditChange(e.target.value, row.id)} type='text'
                                  className='form-control' defaultValue={cell}/>

                }
            },
        ];

        const homeworkConfig = {
            showAllData: true,
            showPagination: false,
            showLeftButton: true,
            leftButtonClassName: 'btn m-btn--pill btn-publish m-btn--uppercase m-btn--wide',
            leftButtonText: translations(locale).send,
            defaultSort: [{
                dataField: 'firstName',
                order: 'asc'
            }]
        };

        const fileClickColumns = [
            {
                key: "id",
                text: "№",
                align: "left",
                width: 50,
                sortable: false,
            },
            {
                key: "status",
                text: translations(locale).status || "",
                sortable: false,
                align: "center",
                colType: 'html',
            },
            {
                key: "sentFile",
                text: translations(locale).my.sent_file || "",
                align: "left",
                sortable: false,
                clickableTd: true,
                tdClassName: 'underline',
            },
            {
                key: "score",
                text: translations(locale).score || "",
                sortable: true,
                align: "right",
            },
            {
                key: "createdDate",
                text: translations(locale).my.sent_date || "",
                sortable: true,
                align: "right"
            },
            {
                key: "checkedDate",
                text: translations(locale).my.checked_date || "",
                sortable: true,
                align: "right"
            },
            {
                key: "description",
                text: translations(locale).description || "",
                sortable: true,
                align: "left"
            },
            {
                key: "file_edit",
                text: translations(locale).description || "",
                sortable: true,
                align: "left",
                colType: 'html',
                clickableTd: true,
                tdClassName: 'underline',
            },
        ];

        const fileClickConfig = {
            show_all: true,
            show_info: false,
            show_pagination: false,
            show_filter: false,
            dynamic: true,
            button: false,
            sort: {
                column: 'createdDate',
                order: 'desc'
            }
        };

        // _handlerClassClick = _handlerClassClick.bind(;
        // _handlerAttendanceClick = _handlerAttendanceClick.bind(;
        // _handlerHomeworkAssignClick = _handlerHomeworkAssignClick.bind(;
        // _handlerHomeworkClick = _handlerHomeworkClick.bind(;
        // _handlerBehaviorClick = _handlerBehaviorClick.bind(;
        // _handlerApproveStudentClick = _handlerApproveStudentClick.bind(;
        // handleDayChange = handleDayChange.bind(;
        // closeModal = closeModal.bind(;
        // handleRadioChange = handleRadioChange.bind(;
        // handleInlineEditChange = handleInlineEditChange.bind(;
        // _sendAttendance = _sendAttendance.bind(;
        // messageHandleDismiss = messageHandleDismiss.bind(;
        // otherAttCloseModal = otherAttCloseModal.bind(;
        // fileUploadCloseModal = fileUploadCloseModal.bind(;
        // _otherAttSubmit = _otherAttSubmit.bind(;
        // handlerAttCheckbox = handlerAttCheckbox.bind(;
        // homeworkHandleDayChange = homeworkHandleDayChange.bind(;
        // inputChangedScoreHandler = inputChangedScoreHandler.bind(;
        // editInputChangedScoreHandler = editInputChangedScoreHandler.bind(;
        // inputChangedFileHandler = inputChangedFileHandler.bind(;
        // _removeFile = _removeFile.bind(;
        // _removeFileList = _removeFileList.bind(;
        // chooseFileClickHandler = chooseFileClickHandler.bind(;
        // homeworkSendButtonHandler = homeworkSendButtonHandler.bind(;
        // homeworkAllRowChange = homeworkAllRowChange.bind(;
        // homeworkRadioChange = homeworkRadioChange.bind(;
        // homeworkInlineEditChange = homeworkInlineEditChange.bind(;
        // homeworkCheckboxChange = homeworkCheckboxChange.bind(;
        // homeworkNumericInputChange = homeworkNumericInputChange.bind(;
        // homeworkInputUpOrDownPress = homeworkInputUpOrDownPress.bind(;
        // _onFocusOut = _onFocusOut.bind(;
        // homeworkInputEnterPress = homeworkInputEnterPress.bind(;
        // homeworkTdClickHandler = homeworkTdClickHandler.bind(;
        // fileClickTdClickHandler = fileClickTdClickHandler.bind(;
        // _saveHomeworkAssign = _saveHomeworkAssign.bind(;
        // onEditorStateChange = onEditorStateChange.bind(;
        // onHwEditorStateChange = onHwEditorStateChange.bind(;
        // toasterHandler = toasterHandler.bind(;
        // _closeStudentFileClickModal = _closeStudentFileClickModal.bind(;
        // // online lesson handler area
        // onlineLessonLinkInputHandler = onlineLessonLinkInputHandler.bind(;
        // onlineLessonLinkTextAreaHandler = onlineLessonLinkTextAreaHandler.bind(;
        // onlineLessonGoogleDriverFileCheckBoxHandler = onlineLessonGoogleDriverFileCheckBoxHandler.bind(;
        // onlineLessonVideoCheckBoxHandler = onlineLessonVideoCheckBoxHandler.bind(;
        // onlineLessonGoogleDriverTextAreaHandler = onlineLessonGoogleDriverTextAreaHandler.bind(;
        // onlineLessonVideoTextAreaHandler = onlineLessonVideoTextAreaHandler.bind(;
        // _saveOnlineLessonSaveButtonHandler = _saveOnlineLessonSaveButtonHandler.bind(;
        // submitBehavior = submitBehavior.bind(;
        // submitApproveStudent = submitApproveStudent.bind(;
        // googleDriverNewFileInputOnChange = googleDriverNewFileInputOnChange.bind(;
        // videoNewFileInputOnChange = videoNewFileInputOnChange.bind(;
        // insertFileEditButtonHandler = insertFileEditButtonHandler.bind(;
        // onlineLessonDeleteButtonHandler = onlineLessonDeleteButtonHandler.bind(;
        // onlineLessonEditButtonHandler = onlineLessonEditButtonHandler.bind(;
        // myTodayOnlineLessonLinkClick = myTodayOnlineLessonLinkClick.bind(;
        // onlineLessonFileClickHandler = onlineLessonFileClickHandler.bind(;
        // onlineLessonVideoClickHandler = onlineLessonVideoClickHandler.bind(;
        // annotationOnChange = annotationOnChange.bind(;
        // annotationOnSelect = annotationOnSelect.bind(;

    const _loadInit = () => {
        console.log('loadInit')
    }

    
    const onlineLessonLinkInputHandler = (e) => {
        setInsertedOnlineLessonLink(e.target.value)
    };

    const onlineLessonLinkTextAreaHandler = (e, data) => {
        setOnlineLessonLinkDescription(data.value)
    };

    const onlineLessonFileClickHandler = () => {
        onlineLessonFileUploader.current.click();
    }

    const onlineLessonVideoClickHandler = () => {
        onlineLessonVideoUploader.current.click();
    }

    const annotationOnChange = (data) => {
        setAnnotationData(data)
    }

    const annotationOnSelect = (selectedId) => {
        console.log(selectedId)
    }

    const onlineLessonGoogleDriverFileCheckBoxHandler = (e, data, index) => {
        let clone = googleDriverFiles;
        for (let i = 0; i < clone.length; i++) {
            if (i == index) {
                clone[i]['checked'] = data.checked;
            } else {
                clone[i]['checked'] = false;
            }
        }
        setGoogleDriverFiles(clone)
    }

    const onlineLessonVideoCheckBoxHandler = (e, data, index) => {
        let clone = videos;
        for (let i = 0; i < clone.length; i++) {
            if (i == index) {
                clone[i]['checked'] = data.checked;
            } else {
                clone[i]['checked'] = false;
            }
        }
        setVideos(clone)
    }

    const onlineLessonGoogleDriverTextAreaHandler = (e, data) => {
        setOnlineLessonGoogleDriverDescription(data.value)
    };

    const onlineLessonVideoTextAreaHandler = (e, data) => {
        setOnlineLessonVideoDescription(data.value)
    };

    const homeworkHandleDayChange = (day) => {
        const el = document.getElementsByClassName('my-homework-date-picker');
        let selectedDay = dateFormat(new Date(day));

        let errorDateMessage = null;
    
        if (homeworkTabName === 'homework_assign') {
            setHomeworkAssignSelectedDay(selectedDay)
            setErrorDateMessage(errorDateMessage)
        } else {
            setHomeworkEditDay(selectedDay)
            setErrorDateMessage(errorDateMessage)
        }
    }

    const inputChangedScoreHandler = (event) => {
        if (homeworkTabName === 'homework_assign') {
            setHomeworkAssignScore(event.target.value)
        } else {
            setHomeworkScore(event.target.value)
        }
    };

    const inputChangedLinkHandler = (event) => {
        setHomeworkLink(event.target.value)
    };

    const editInputChangedScoreHandler = (event) => {
        setHomeworkEditScore(event.target.value)
    };

    const editInputChangedLinkHandler = (event) => {
        setHomeworkEditLink(event.target.value)
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

        if (homeworkTabName === 'homework_assign') {
            files = filesAssign;
        } else {
            files = files;
        }

        for (let i = 0; i < addFiles.length; i++) {
            files.push(addFiles[i])
        }
        if (homeworkTabName === 'homework_assign') {
            setFilesAssign(files)
            setFileSizeErrorAssign(hasSizeError)
        } else {
            setFiles(files),
            setFileSizeError(hasSizeError)
        }
    };

    const chooseFileClickHandler = () => {
        fileUploader.current.click();
    };

    const _removeFile = (fileId) => {
        if (fileId) {
            let existingHomework = homeworkObj;

            let filterFiles = existingHomework['files'].filter(function (item) {
                return item['id'] !== fileId
            });

            removedFiles.push(fileId);

            existingHomework['files'] = filterFiles;

            setHomeworkObj(existingHomework)
        }
    };

    const _removeFileList = (event) => {
        if (event) {
            if (homeworkTabName === 'homework_assign') {
                let fileLists = filesAssign;

                fileLists = fileLists.filter(function (item) {
                    return item['lastModified'] !== event
                });

                setFilesAssign(fileLists)
            } else {
                let fileLists = files;

                fileLists = fileLists.filter(function (item) {
                    return item['lastModified'] !== event
                });

                setFiles(fileLists)
            }

        }
    };

    const homeworkHandlerEditButton = () => {
        let clone = homeworkEditDay;

        if (!clone) {
            clone = homeworkObj.dueDate;
        }

        setEditing(true)
        setInputViewOrEdit('edit')
        // homeworkEditEditorState: EditorState.createWithContent(
        //     ContentState.createFromBlockArray(
        //         convertFromHTML(htmlDecode(homeworkObj.description))
        //     )
        // ),
        setHomeworkEditEditorState(homeworkObj.description)
        setHomeworkEditScore(homeworkObj.totalScore)
        setHomeworkEditLink(homeworkObj.link)
        setRemovedFiles([])
        setHomeworkEditDay(clone)

        attendanceConfig.add_button_left = false;
    };

    const homeworkHandlerDeleteButton = () => {
        setDeleteHomeworkDetailModalShow(true)
    }

    const homeworkHandlerBackButton = () => {
        setInputViewOrEdit('view')
        setHomeworkEditDay(null)
        setFiles([])

        attendanceConfig.add_button_left = true;
    };

    const homeworkHandlerSaveButton = () => {

        console.log('homeworkHandlerSave')
        // let hasError = false;
        // let errorMessage = null;

        // if (hasError) {
        //     setState({
        //         errorMessage
        //     })
        // } else {
        //     if (homeworkObj) {
        //         if (!homeworkEditDay) {
        //             setState({
        //                 errorHomeworkCheckMessage: translations(locale).invalid_date || ""
        //             });
        //             return;
        //         }

        //         if (!homeworkEditScore) {
        //             setState({
        //                 errorHomeworkCheckMessage: translations(locale).homeworkReport.insert_score || ""
        //             });
        //             return;
        //         }

        //         let bodyParams = new FormData();
        //         bodyParams.append('homework', homeworkObj.id);
        //         bodyParams.append('date', homeworkEditDay);
        //         // bodyParams.append('description', draftToHtml(convertToRaw(homeworkEditEditorState.getCurrentContent())));
        //         bodyParams.append('description', homeworkEditEditorState);
        //         bodyParams.append('score', homeworkEditScore);
        //         bodyParams.append('link', homeworkEditLink);
        //         bodyParams.append('modalDay', selectedDay.substring(0, 10));

        //         for (let i = 0; i < files.length; i++) {
        //             bodyParams.append('files[]', files[i]);
        //         }

        //         for (let i = 0; i < removedFiles.length; i++) {
        //             bodyParams.append('removeFiles[]', removedFiles[i]);
        //         }


        //         setEditing(false)
        //         setFetchHomeworkCheckSave(true)
        //         // setshowloadermodal(true)
        //         setErrorHomeworkCheckMessage(null)

        //         props.fetchMyHomeworkCheckSave(bodyParams);
        //     } else {
        //         setState({
        //             errorHomeworkCheckMessage: translations(locale).homework.not_found || ""
        //         });
        //     }
        // }
    };

    const homeworkAllRowChange = (allRowChecked) => {
        let students = homeworkStudents;
        let score = homeworkObj ? homeworkObj.totalScore : null;

        let checkedStudents = [];
        let studentDescriptions = [];
        let studentTakenScore = [];

        if (allRowChecked) {
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
                }
            }
        }
        setHomeworkStudents(students)
        // setState({
        //     allRowChecked,
        //     homeworkStudents: students,
        //     // fetchHomeworkRow: true,
        //     // showLoaderModal: true,
        // });

        // let bodyParams = {
        //     season: currentSeason ? currentSeason.seasonId : null,
        //     class: selectedClassId,
        //     subject: selectedSubjectId,
        //     group: selectedGroupId,
        //     date: selectedDay,
        //     total_score: score,
        //     'students_type[]': checkedStudents,
        //     'student_descriptions[]': studentDescriptions,
        //     'student_taken_score[]': studentTakenScore
        // };
        //
        // props.fetchHomeworkRowSubmit(bodyParams);
    };

    const homeworkRadioChange = (value) => {
        if (value) {
            let studentHwTypeArray = value.split('_');

            if (studentHwTypeArray && studentHwTypeArray.length > 1) {
                let students = homeworkStudents;
                const score = homeworkObj ? homeworkObj.totalScore : null;
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

                    // for (let i = 0; i < homeworkTypes.length; i++) {
                    //     let hwType = homeworkTypes[i];
                    //     if (hwType.code.toLowerCase() == 'complete') {
                    //         if (parseInt(selectedTypeId) === parseInt(hwType.id)) {
                    //             studentObj[0]['takenScore'] = score;
                    //         }
                    //     }
                    //     if (hwType.code.toLowerCase() == 'incomplete') {
                    //         if (parseInt(selectedTypeId) === parseInt(hwType.id)) {
                    //             studentObj[0]['takenScore'] = (score / 2);
                    //         }
                    //     }
                    //     if (hwType.code.toLowerCase() == 'no_assignment') {
                    //         if (parseInt(selectedTypeId) === parseInt(hwType.id)) {
                    //             studentObj[0]['takenScore'] = 0;
                    //         }
                    //     }
                    // }

                    studentObj[0]['numericEditClassName'] = '';

                    let list = lists;
                    if (list && list.length > 0) {
                        let times = list[0]['times'];
                        if (times && times.length > 0) {
                            for (let t = 0; t < times.length; t++) {
                                if (times[t].length > 0 && times[t].length == 1) {
                                    if (times[t][0]['id'] == selectedTimeTableId && times[t][0]['schoolShiftId'] == selectedSchoolShiftId) {
                                        let counter = 0;
                                        for (let s = 0; s < students.length; s++) {
                                            if (students[s]['radioTypeId']) {
                                                counter += 1;
                                            }
                                        }

                                        times[t][0]['dtl_count'] = counter;
                                    }
                                } else {
                                    let otherTimes = times[t];
                                    for (let o = 0; o < otherTimes.length; o++) {
                                        if (otherTimes[o]['id'] == selectedTimeTableId && otherTimes[o]['schoolShiftId'] == selectedSchoolShiftId) {
                                            let counter = 0;
                                            for (let s = 0; s < students.length; s++) {
                                                if (students[s]['radioTypeId']) {
                                                    counter += 1;
                                                }
                                            }

                                            otherTimes[o]['dtl_count'] = counter;
                                        }
                                    }
                                }
                            }
                        }
                    }

                    setHomeworkStudents(students)
                    // // setshowloadermodal(true)
                    // setFetchStudent(true)

                    const bodyParams = {
                        homework: homeworkObj.id,
                        student: studentObj[0].id,
                        type: selectedTypeId,
                        comment: studentObj[0].comment,
                        score: studentObj[0]['takenScore']
                    };

                    props.fetchMyHomeworkStudentDetailSubmit(bodyParams);
                }
            }
        }
    }

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

                let list = lists;
                if (list && list.length > 0) {
                    let times = list[0]['times'];
                    if (times && times.length > 0) {
                        for (let t = 0; t < times.length; t++) {
                            if (times[t].length > 0 && times[t].length == 1) {
                                if (times[t][0]['id'] == selectedTimeTableId && times[t][0]['schoolShiftId'] == selectedSchoolShiftId) {
                                    let counter = 0;
                                    for (let s = 0; s < students.length; s++) {
                                        if (students[s]['radioTypeId']) {
                                            counter += 1;
                                        }
                                    }

                                    times[t][0]['dtl_count'] = counter;
                                }
                            } else {
                                let otherTimes = times[t];
                                for (let o = 0; o < otherTimes.length; o++) {
                                    if (otherTimes[o]['id'] == selectedTimeTableId && otherTimes[o]['schoolShiftId'] == selectedSchoolShiftId) {
                                        let counter = 0;
                                        for (let s = 0; s < students.length; s++) {
                                            if (students[s]['radioTypeId']) {
                                                counter += 1;
                                            }
                                        }

                                        otherTimes[o]['dtl_count'] = counter;
                                    }
                                }
                            }
                        }
                    }
                }

                if (updateStudent) {
                    setHomeworkStudents(students)
                    // setshowloadermodal(true)
                    // setFetchStudent(true)

                    let bodyParams = {
                        homework: homeworkObj.id,
                        student: studentObj[0].id,
                        type: studentObj[0].radioTypeId,
                        comment: studentObj[0].comment,
                        score: studentObj[0]['takenScore']
                    };

                    props.fetchMyHomeworkStudentDetailSubmit(bodyParams);
                } else {
                    setHomeworkStudents(students)
                }
            }
        }
    }

    const homeworkNumericInputChange = (data, id) => {
        let value = data.target.value;

        let totalScore = homeworkObj ? parseFloat(homeworkObj.totalScore) : 0;
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

                    setHomeworkStudents(students)
                    setFetchStudent(true)
                    // setshowloadermodal(true)

                    let bodyParams = {
                        homework: homeworkObj.id,
                        student: studentObj[0].id,
                        type: studentObj[0].radioTypeId,
                        comment: studentObj[0].comment,
                        score: studentObj[0]['takenScore']
                    };

                    props.fetchMyHomeworkStudentDetailSubmit(bodyParams);
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
                        studentObj[0]['takenScore'] = homeworkObj ? parseInt(homeworkObj.totalScore) : null;
                        studentObj[0]['radioTypeId'] = selectedTypeId;

                        setHomeworkStudents(students)
                        setFetchStudent(true)

                        let list = lists;
                        if (list && list.length > 0) {
                            let times = list[0]['times'];
                            if (times && times.length > 0) {
                                for (let t = 0; t < times.length; t++) {
                                    if (times[t].length > 0 && times[t].length == 1) {
                                        if (times[t][0]['id'] == selectedTimeTableId && times[t][0]['schoolShiftId'] == selectedSchoolShiftId) {
                                            let counter = 0;
                                            for (let s = 0; s < students.length; s++) {
                                                if (students[s]['radioTypeId']) {
                                                    counter += 1;
                                                }
                                            }

                                            times[t][0]['dtl_count'] = counter;
                                        }
                                    } else {
                                        let otherTimes = times[t];
                                        for (let o = 0; o < otherTimes.length; o++) {
                                            if (otherTimes[o]['id'] == selectedTimeTableId && otherTimes[o]['schoolShiftId'] == selectedSchoolShiftId) {
                                                let counter = 0;
                                                for (let s = 0; s < students.length; s++) {
                                                    if (students[s]['radioTypeId']) {
                                                        counter += 1;
                                                    }
                                                }

                                                otherTimes[o]['dtl_count'] = counter;
                                            }
                                        }
                                    }
                                }
                            }
                        }

                        let bodyParams = {
                            homework: homeworkObj.id,
                            student: studentObj[0].id,
                            type: selectedTypeId,
                            comment: studentObj[0].comment,
                            score: studentObj[0]['takenScore']
                        };

                        props.fetchMyHomeworkStudentDetailSubmit(bodyParams);
                    } else {

                        if (typeof studentObj[0].isAuto !== 'undefined') {

                            studentObj[0]['takenScore'] = null;
                            setDeleteHomeworkDetailModalShow(true),
                            setDeleteHomeworkDetailStudentId(studentObj[0].id)

                            // if (!studentObj[0].isAuto && studentObj[0].radioTypeId) {
                            //     studentObj[0]['takenScore'] = null;
                            //     setState({
                            //         deleteHomeworkDetailModalShow: true,
                            //         deleteHomeworkDetailStudentId: studentObj[0].id
                            //     })
                            // } else {
                            //     studentObj[0]['isChecked'] = 0;
                            //     studentObj[0]['radioTypeId'] = null;
                            //     studentObj[0]['takenScore'] = null;
                            //     setState({
                            //         homeworkStudents: students
                            //     })
                            // }
                        } else {
                            setDeleteHomeworkDetailModalShow(true),
                            setDeleteHomeworkDetailStudentId(studentObj[0].id)
                        }
                    }
                }
            }
        } else if (row === 'allCheck') {
            let students = homeworkStudents;
            let score = homeworkObj ? homeworkObj.totalScore : null;

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

                            // setshowloadermodal(true),
                            setFetchStudent()

                            const bodyParams = {
                                homework: homeworkObj.id,
                                student: studentObj.id,
                                type: studentObj.radioTypeId,
                                comment: studentObj.comment,
                                score: studentObj.takenScore
                            };

                            props.fetchMyHomeworkStudentDetailSubmit(bodyParams);
                        }
                    }
                }
            }

            setAllRowChecked(isChecked)
            setHomeworkStudents(students)

            // let bodyParams = {
            //     season: currentSeason ? currentSeason.seasonId : null,
            //     class: selectedClassId,
            //     subject: selectedSubjectId,
            //     group: selectedGroupId,
            //     date: selectedDay,
            //     total_score: score,
            //     'students_type[]': checkedStudents,
            //     'student_descriptions[]': studentDescriptions,
            //     'student_taken_score[]': studentTakenScore
            // };
            //
            // props.fetchHomeworkRowSubmit(bodyParams);
        }
    }

    const homeworkInputUpOrDownPress = (data, rowIndex, id, refs) => {
        if (data && data.key === 'ArrowDown') {
            if (refs.length > (rowIndex)) {
                refs[rowIndex].current.focus();
                // let count = 0;
                // if (refs[rowIndex + 1].current.props.value === null ||
                //     refs[rowIndex + 1].current.props.value === '' ||
                //     refs[rowIndex + 1].current.props.value === 0) {
                //     let index = rowIndex + 1;
                //     let length = refs.length;
                //     for (index; index < length; index++) {
                //         count++
                //         if (refs[index].current.props.value) {
                //             refs[rowIndex + count].current.focus();
                //             return
                //         }
                //     }
                // } else {
                //     refs[rowIndex].current.focus();
                // }
            }
        } else if (data && data.key === 'ArrowUp') {
            if ((rowIndex - 2) >= 0) {
                refs[rowIndex - 2].current.focus();
                // let count = 0;
                // if (refs[rowIndex - 1].current.props.value === null ||
                //     refs[rowIndex - 1].current.props.value === '' ||
                //     refs[rowIndex - 1].current.props.value === 0) {
                //     let index = rowIndex - 1;
                //     for (index; index >= 0; index--) {
                //         count++
                //         if (refs[index].current.props.value) {
                //             refs[rowIndex - count].current.focus();
                //             return
                //         }
                //     }
                // } else {
                //     refs[rowIndex - 1].current.focus();
                // }
            }
        }
    }

    const _onFocusOut = (data, rowIndex, id) => {
        let value = data.target.value;
        if (value >= 0) {
            let totalScore = homeworkObj ? parseFloat(homeworkObj.totalScore) : 0;
            let students = homeworkStudents;

            let selectedTypeId = null;
            let studentObj = students.filter(obj => {
                return parseInt(obj.id) === parseInt(id)
            });

            if (studentObj && studentObj.length === 1) {
                if (id && value <= totalScore) {

                    let percentage = parseInt(value) * 100 / totalScore;

                    if (parseInt(value) >= totalScore) {
                        for (let i = 0; i < homeworkTypes.length; i++) {
                            let hwType = homeworkTypes[i];
                            if (hwType.code.toLowerCase() == 'complete') {
                                selectedTypeId = hwType.id;
                                break;
                            }
                        }
                        if (typeof studentObj['checkable'] === 'undefined' || String(studentObj['checkable']) === '0') {
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
                        if (typeof studentObj['checkable'] === 'undefined' || String(studentObj['checkable']) === '0') {
                            studentObj[0]['checkable'] = true;
                        }
                        studentObj[0]['radioTypeId'] = selectedTypeId;
                    } else {
                        let selectedType = null;
                        for (let i = 0; i < homeworkTypes.length; i++) {
                            let hwType = homeworkTypes[i];

                            if (percentage >= hwType['minPercentage'] && percentage < hwType['maxPercentage']) {
                                selectedType = hwType;
                                break;
                            }
                        }

                        if (selectedType) {
                            if (typeof studentObj['checkable'] === 'undefined' || String(studentObj['checkable']) === '0') {
                                studentObj[0]['checkable'] = true;
                                studentObj[0]['isAuto'] = true;
                            }
                            studentObj[0]['radioTypeId'] = selectedType.id;
                        }
                    }

                    studentObj[0]['numericEditClassName'] = null;
                    studentObj[0]['takenScore'] = value ? value : null;
                    studentObj[0]['totalScore'] = totalScore ? totalScore : null;

                    setHomeworkStudents(students)
                    setFetchStudent(true)

                    let list = lists;
                    if (list && list.length > 0) {
                        let times = list[0]['times'];
                        if (times && times.length > 0) {
                            for (let t = 0; t < times.length; t++) {
                                if (times[t].length > 0 && times[t].length == 1) {
                                    if (times[t][0]['id'] == selectedTimeTableId && times[t][0]['schoolShiftId'] == selectedSchoolShiftId) {
                                        let counter = 0;
                                        for (let s = 0; s < students.length; s++) {
                                            if (students[s]['radioTypeId']) {
                                                counter += 1;
                                            }
                                        }

                                        times[t][0]['dtl_count'] = counter;
                                    }
                                } else {
                                    let otherTimes = times[t];
                                    for (let o = 0; o < otherTimes.length; o++) {
                                        if (otherTimes[o]['id'] == selectedTimeTableId && otherTimes[o]['schoolShiftId'] == selectedSchoolShiftId) {
                                            let counter = 0;
                                            for (let s = 0; s < students.length; s++) {
                                                if (students[s]['radioTypeId']) {
                                                    counter += 1;
                                                }
                                            }

                                            otherTimes[o]['dtl_count'] = counter;
                                        }
                                    }
                                }
                            }
                        }
                    }

                    let bodyParams = {
                        homework: homeworkObj.id,
                        student: studentObj[0].id,
                        type: studentObj[0].radioTypeId,
                        comment: studentObj[0].comment,
                        score: studentObj[0]['takenScore']
                    };

                    props.fetchMyHomeworkStudentDetailSubmit(bodyParams);
                } else {
                    studentObj[0]['numericEditClassName'] = 'error';
                    studentObj[0]['takenScore'] = value;
                    studentObj[0]['totalScore'] = totalScore;

                    setHomeworkStudents(students)
                }
            }
        }
    }

    const homeworkInputEnterPress = (data, rowIndex, id, refs) => {
        if (refs.length > (rowIndex + 1)) {
            let count = 0;
            if (refs[rowIndex + 1].current.props.value === null ||
                refs[rowIndex + 1].current.props.value === '' ||
                refs[rowIndex + 1].current.props.value === 0) {
                let index = rowIndex + 1;
                let length = refs.length;
                for (index; index < length; index++) {
                    count++
                    if (refs[index].current.props.value) {
                        refs[rowIndex + count].current.focus();
                        return
                    }
                }
            } else {
                refs[rowIndex + 1].current.focus();
            }
        }
    }

    const homeworkTdClickHandler = (columnKey, id) => {
        if (columnKey == 'studentDetail') {
            let params = {
                'student_id': id,
                'homework_id': homeworkObj.id
            };

            setFetchHomeworkFileClick(true)
            // setshowloadermodal(true)
            props.fetchMyHomeworkStudentFileClick(params);
        }
    }

    const fileClickTdClickHandler = (columnKey, id) => {
        if (columnKey === 'file_edit') {
            setMyTodayOnlineLessonFileEdit(true)
            // setshowloadermodal(true)

            let params = {
                id: id
            }
            props.fetchMyTodayOnlineLessonFileEdit(params)
        } else {
            let studentDetails = fileClickDetails;
            if (studentDetails && studentDetails.length > 0) {
                for (let i = 0; i < studentDetails.length; i++) {
                    if (studentDetails[i]['id'] == id) {
                        _showFile(studentDetails[i]['path']);
                    }
                }
            }
        }
    }

    const _closeDeleteModal = () => {
        setDeleteHomeworkDetailModalShow(false)
        setDeleteHomeworkDetailStudentId(null)
    };

    const _closeHomeworkDeleteModal = () => {
        setDeleteHomeworkModalShow(false)
    }

    const _closeStudentFileClickModal = () => {
        setStudentFileClickModal(false)
    }

    const _closeFileEditModal = () => {
        setFileEditModal(false)

        setMyTodayOnlineLessonFileRemove(true)
        // setshowloadermodal(true)

        let params = {
            id: fileEditData['id']
        };

        props.fetchMyTodayOnlineLessonFileRemove(params)
    }

    const _onlineLessonFileEditSaveButtonHandler = () => {
        let that = this
        let canvas = document.getElementsByClassName('lower-canvas');

        canvas[0].toBlob(function (blob) {
            let file = new File(
                [blob],
                fileEditData['file_name'],
                {
                    type: "image/png",
                    lastModified: new Date()
                }
            );

            let formData = new FormData();
            formData.append('id', fileEditData['id']);
            formData.append('dtl_id', fileEditData['student_dtl_id']);
            formData.append('file', file);

            setMyTodayOnlineLessonFileEditSubmit(true)
            // setshowloadermodal(true)

            props.fetchMyTodayOnlineLessonFileEditSubmit(formData)
        });
    }

    const _onDeleteSubmit = () => {
        if (deleteHomeworkDetailStudentId) {
            let students = homeworkStudents;

            var studentObj = students.filter(obj => {
                return parseInt(obj.id) === parseInt(deleteHomeworkDetailStudentId)
            });

            if (studentObj && studentObj.length === 1) {
                studentObj[0].checkable = 0;
                studentObj[0].comment = null;
                studentObj[0].radioTypeId = null;
                studentObj[0].isAuto = false;
                studentObj[0].takenScore = false;

                setFetchHomeworkRemove(true)
                setShowLoaderDeleteModal(true)
                setHomeworkStudents(students)

                let list = lists;
                if (list && list.length > 0) {
                    let times = list[0]['times'];
                    if (times && times.length > 0) {
                        for (let t = 0; t < times.length; t++) {
                            if (times[t].length > 0 && times[t].length == 1) {
                                if (times[t][0]['id'] == selectedTimeTableId && times[t][0]['schoolShiftId'] == selectedSchoolShiftId) {
                                    let counter = 0;
                                    for (let s = 0; s < students.length; s++) {
                                        if (students[s]['radioTypeId']) {
                                            counter += 1;
                                        }
                                    }

                                    times[t][0]['dtl_count'] = counter;
                                }
                            } else {
                                let otherTimes = times[t];
                                for (let o = 0; o < otherTimes.length; o++) {
                                    if (otherTimes[o]['id'] == selectedTimeTableId && otherTimes[o]['schoolShiftId'] == selectedSchoolShiftId) {
                                        let counter = 0;
                                        for (let s = 0; s < students.length; s++) {
                                            if (students[s]['radioTypeId']) {
                                                counter += 1;
                                            }
                                        }

                                        otherTimes[o]['dtl_count'] = counter;
                                    }
                                }
                            }
                        }
                    }
                }

                let bodyParams = {
                    homework: homeworkObj ? homeworkObj.id : null,
                    student: deleteHomeworkDetailStudentId
                };
                props.fetchMyHomeworkDetailRemove(bodyParams);
            }
        } else {
            setDeleteHomeworkDetailModalShow(false)
            errorMessage('No student found')
        }
    };

    const _onHomeworkDeleteSubmit = () => {
        if (homeworkObj) {
            let params = {
                'id': homeworkObj.id
            };

            setFetchDeleteHomework(true)
            setShowLoaderDeleteModal(true)
            props.fetchHomeworkDelete(params);
        } else {
            // setState({
            //     deleteHomeworkDetailModalShow: false,
            //     errorMessage: 'No student found'
            // })
        }
    }

    const homeworkSendButtonHandler = () => {
        let hasError = false;
        let errorMessage = null;

        if (homeworkObj && homeworkObj.id) {
            let bodyParams = {};

            let studentIds = [];
            let typeIds = [];
            let comments = [];
            let scores = [];

            for (let i = 0; i < homeworkStudents.length; i++) {
                let studentObj = homeworkStudents[i];
                studentObj.isAuto = false;

                if (String(studentObj.checkable) === '1' && Math.ceil(studentObj['takenScore']) > studentObj['totalScore']) {
                    hasError = true;
                    errorMessage = studentObj['firstName'] + ' ' + translations(locale).homework.score_higher_that_max_score;
                    break;
                }

                if (String(studentObj.checkable) === '1' && parseInt(studentObj['takenScore']) < 0) {
                    hasError = true;
                    errorMessage = studentObj['firstName'] + ' ' + translations(locale).homework.score_lower_that_max_score;
                    break;
                }

                if (String(studentObj.checkable) === '1' && (!$.isNumeric(studentObj['takenScore']) || studentObj['takenScore'] == null)) {
                    hasError = true;
                    errorMessage = studentObj['firstName'] + ' ' + translations(locale).homework.empty_score;
                    break;
                }

                if (String(studentObj.checkable) === '1' && !studentObj.radioTypeId) {
                    hasError = true;
                    errorMessage = translations(locale).homework.please_select_status;
                    break;
                } else {
                    if (String(studentObj.checkable) === '1' && studentObj.radioTypeId) {
                        studentIds.push(studentObj.id);
                        typeIds.push(studentObj.radioTypeId);
                        comments.push(studentObj.comment);
                        scores.push(studentObj.takenScore);
                    }
                }
            }

            bodyParams['students[]'] = studentIds;
            bodyParams['types[]'] = typeIds;
            bodyParams['comments[]'] = comments;
            bodyParams['scores[]'] = scores;
            bodyParams['group'] = homeworkGroup.id;
            bodyParams['date'] = selectedDay.substring(0, 10);
            bodyParams['homework'] = homeworkObj.id;

            if (hasError) {
                message(errorMessage, false);
            } else {
                setFetchHomeworkSendAction(true)
                // setshowloadermodal(true)
                props.fetchMyHomeworkSend(bodyParams);
            }
        } else {
            errorMessage = translations(locale).homework.not_found || "";

            // setErrorMessagerrorMessage
        }
    };

    const homeworkAssignSelectChange = (e, data) => {
        setSelectedHomeworkGroupIds(data.value)
        setErrorGroupsMessage(null)
    };

    const _saveHomeworkAssign = () => {
        let hasError = false;
        let errorHomeworkMessage = null;
        let errorDateMessage = null;
        let errorGroupsMessage = null;

        if (homeworkAssignScore) {

        } else {
            errorHomeworkMessage = translations(locale).homeworkReport.insert_score;
            hasError = true;
        }

        if (homeworkAssignSelectedDay) {

        } else {
            errorDateMessage = translations(locale).food.correctDataError;
            hasError = true;
        }

        if (selectedHomeworkGroupIds && selectedHomeworkGroupIds.length > 0) {

        } else {
            errorGroupsMessage = translations(locale).homeworkReport.insert_class_club;
            hasError = true;
        }

        if (hasError) {
            setMessageSuccess(false)
            // errorGroupsMessage,
            // errorDateMessage,
            // errorHomeworkMessage
        } else {
            let formData = new FormData();

            for (let i = 0; i < filesAssign.length; i++) {
                formData.append('files[]', filesAssign[i]);
            }

            for (let i = 0; i < removedFilesAssign.length; i++) {
                formData.append('removed_files[]', removedFilesAssign[i]);
            }

            for (let i = 0; i < selectedHomeworkGroupIds.length; i++) {
                formData.append('groupIds[]', selectedHomeworkGroupIds[i]);
            }

            formData.append('selectedDay', homeworkAssignSelectedDay);
            formData.append('modalDay', selectedDay.substring(0, 10));
            formData.append('modalGroup', homeworkGroup ? homeworkGroup.id : null);
            // formData.append('description', homeworkAssignDescription);
            // formData.append('description', draftToHtml(convertToRaw(editorState.getCurrentContent())));
            formData.append('description', editorState);
            formData.append('score', homeworkAssignScore);
            formData.append('link', homeworkLink);

            setFetchHomeworkAssign(true)
            // setshowloadermodal(true)

            props.fetchMyHomeworkAssignSubmit(formData);
        }
    };

    const _saveOnlineLessonSaveButtonHandler = () => {
        let params = []
        if (onlineLessonTabName === 'link') {
            let formData = new FormData();
            formData.append('date', selectedDay.substring(0, 10));
            formData.append('timetable_id', onlineLessonGroup['timetableId']);
            formData.append('type', onlineLessonTabName);
            formData.append('link', insertedOnlineLessonLink);
            formData.append('description', onlineLessonLinkDescription);

            props.fetchMyTodayOnlineLessonSaveButtonSubmit(formData);
        } else if (onlineLessonTabName === 'drive') {
            let googleDriverFiles = googleDriverFiles;

            let formData = new FormData();
            formData.append('date', selectedDay.substring(0, 10));
            formData.append('timetable_id', onlineLessonGroup['timetableId']);
            formData.append('type', onlineLessonTabName);
            formData.append('description', onlineLessonGoogleDriverDescription);
            formData.append('files', googleDriverFile);

            for (let i = 0; i < googleDriverFiles.length; i++) {
                if (googleDriverFiles[i]['checked']) {
                    formData.append('fileIds[]', googleDriverFiles[i]['id']);
                }
            }

            props.fetchMyTodayOnlineLessonSaveButtonSubmit(formData);
        } else if (onlineLessonTabName === 'video') {
            let videos = videos;

            let formData = new FormData();
            formData.append('date', selectedDay.substring(0, 10));
            formData.append('timetable_id', onlineLessonGroup['timetableId']);
            formData.append('type', onlineLessonTabName);
            formData.append('description', onlineLessonVideoDescription);

            for (let i = 0; i < videos.length; i++) {
                if (videos[i]['checked']) {
                    formData.append('videoIds[]', videos[i]['id']);
                }
            }

            formData.append('video', videoFile);

            props.fetchMyTodayOnlineLessonSaveButtonSubmit(formData);
        }

        setTodayOnlineLessonSaveButtonSubmit(true)
        // setshowloadermodal(true)
    }

    const submitBehavior = (params) => {
        setFetchSubmitBehavior(true)
        // setshowloader(true)
        props.fetchMyBehaviorSubmit(params);
    }

    const submitApproveStudent = () => {
        // setshowloader(true),
        setFetchInit(true),
        setShowApproveStudentModal(false),
        setApproveStudentModalParam(null),

        props.fetchMyTodayInit({
            date: selectedDay?.substring(0, 10),
        });
    }

    const googleDriverNewFileInputOnChange = () => {
        if (event.target.files && event.target.files[0]) {
            let files = event.target.files[0];
            const verified = verifyFile(files);

            if (verified) {
                setGoogleDriverFile(files),
                setGoogleDriverNewFileInputText(files.name)
            }
        }
    }

    const videoNewFileInputOnChange = () => {
        if (event.target.files && event.target.files[0]) {
            let files = event.target.files[0];
            const verified = verifyFileVideo(files);

            if (verified) {
                setVideoFile(files)
                setVideoNewFileInputText(files.name)
            }
        }
    }

    const insertFileEditButtonHandler = () => {
        let formData = new FormData();
        if (onlineLessonTabName === 'link') {
            formData.append('id', linkInfo && linkInfo.length > 0 ? linkInfo[0]['id'] : '');
            formData.append('date', selectedDay.substring(0, 10));
            formData.append('timetable_id', onlineLessonGroup['timetableId']);
            formData.append('type', onlineLessonTabName);
            formData.append('link', insertedOnlineLessonLink);
            formData.append('description', onlineLessonLinkDescription);
        } else if (onlineLessonTabName === 'drive') {
            formData.append('date', selectedDay.substring(0, 10));
            formData.append('timetable_id', onlineLessonGroup['timetableId']);
            formData.append('type', onlineLessonTabName);
            formData.append('id', linkInfo && linkInfo.length > 0 ? linkInfo[0]['id'] : '');
            formData.append('description', onlineLessonGoogleDriverDescription);
        } else if (onlineLessonTabName === 'video') {
            formData.append('date', selectedDay.substring(0, 10));
            formData.append('timetable_id', onlineLessonGroup['timetableId']);
            formData.append('type', onlineLessonTabName);
            formData.append('id', linkInfo && linkInfo.length > 0 ? linkInfo[0]['id'] : '');
            formData.append('description', onlineLessonVideoDescription);
        }

        setOnlineLessonEditSubmit(true),
        // setshowloadermodal(true)

        props.fetchMyTodayOnlineLessonEditSubmit(formData);
    }

    const onlineLessonDeleteButtonHandler = () => {
        setOnlineLessonDelete(true)
        // setshowloadermodal(true)

        let params = {
            timetable: onlineLessonGroup['timetableId'],
            date: selectedDay.substring(0, 10),
            type: linkInfo && linkInfo.length > 0 ? (linkInfo[0]['type']).toLowerCase() : '',
            id: linkInfo && linkInfo.length > 0 ? linkInfo[0]['id'] : ''
        }

        props.fetchMyTodayOnlineLessonDelete(params);
    }

    const myTodayOnlineLessonLinkClick = () => {
        if (linkInfo && linkInfo.length > 0) {
            window.open(linkInfo[0]['path']);
        }
    }

    const onlineLessonEditButtonHandler = () => {
        let linkInfo = linkInfo;
        if (linkInfo && linkInfo.length > 0) {
            if (linkInfo[0]['type'].toLowerCase() == 'link') {
                setOnlineLessonAction(0)
                setNoneOrBlock('none')
                setOnlineLessonTabActiveIndex(0)
                setOnlineLessonTabName('link')
                setInsertedOnlineLessonLink(linkInfo[0]['path'])
                setOnlineLessonLinkDescription(linkInfo[0]['description'])
            } else if (linkInfo[0]['type'].toLowerCase() == 'drive') {
                setOnlineLessonAction(0)
                setNoneOrBlock('none')
                setOnlineLessonTabActiveIndex(1)
                setOnlineLessonTabName('drive')
                setOnlineLessonGoogleDriverDescription(linkInfo[0]['description'])
            } else if (linkInfo[0]['type'].toLowerCase() == 'video') {
                setOnlineLessonAction(0)
                setNoneOrBlock('none')
                setOnlineLessonTabActiveIndex(2)
                setOnlineLessonTabName('video')
                setOnlineLessonVideoDescription(linkInfo[0]['description'])
            }
        }
    }

    const onEditorStateChange = (editorState) => {
        setEditorState(editorState)
    }

    const onHwEditorStateChange = (homeworkEditEditorState) => {
        setHomeworkEditEditorState(homeworkEditEditorState)
    }

    const handlerDayPickerShow = () => {
        // $('.m-body .m-wrapper').css('margin-bottom', '150px');
    }

    const handlerDayPickerHide = () => {
        // $('.m-body .m-wrapper').css('margin-bottom', '1rem');
    }

    const _showFile = (path) => {
        window.open(path);
    }

    const test = () => {
        let records = [];
        let rowIndex = 1;
        for (let record of studentList) {
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

        let fileName = modalGroup.groupName + ' - сурагчид';

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
    // homework handler end

    const verifyFile = file => {
        const acceptedType = [
            'image/x-png',
            'image/png',
            'image/jpg',
            'image/jpeg',
            'image/gif',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/vnd.openxmlformats-officedocument.presentationml.presentation',
            'application/vnd.openxmlformats-officedocument.presentationml.slideshow',
            'video/x-ms-wmv',
            'application/pdf',
            'audio/mpeg',
            'video/mpeg',
            'video/mp4',
            'video/quicktime',
            'video/x-ms-wmv',
        ];
        const acceptedSize = 52428800;

        if (file) {
            let imageSize = file.size;
            let imageType = file.type;
            if (imageSize > acceptedSize) {
                message(translations(locale).newsfeed.file_size_warning);
                return false;
            }
            if (!acceptedType.includes(imageType)) {
                message(translations(locale).filesDt.image_type_error);
                return false;
            }
            return true;
        }
    };

    const verifyFileVideo = file => {
        const acceptedType = [
            'video/mpeg',
            'video/mp4',
            'video/quicktime',
            'video/x-ms-wmv',
            'video/mov',
            'video/avi',
            'video/wmv',
        ];

        if (file) {
            let imageType = file.type;
            if (!acceptedType.includes(imageType)) {
                message(translations(locale).filesDt.image_type_video_error)
                return false;
            }
            return true;
        }
    };

    // init handler start
    const _renderBody = () => {
        let rows = [];
        if (lists) {

            for (let i = 0; i < lists.length; i++) {
                let shiftArray = lists[i];

                rows.push(<tr key={'shift_' + i} className="schoolShift">
                    <td colSpan={6}>{shiftArray['school_shift']['name']}</td>
                </tr>);

                for (let j = 0; j < shiftArray['times'].length; j++) {
                    let timeRows = shiftArray['times'][j];

                    if (timeRows.length > 0) {
                        for (let row = 0; row < timeRows.length; row++) {
                            let rowObject = timeRows[row];
                            let classes = '';
                            for (let row_cl = 0; row_cl < rowObject['classes'].length; row_cl++) {
                                if (rowObject['classes'].length === (row_cl + 1)) {
                                    classes += rowObject['classes'][row_cl];
                                } else {
                                    classes += rowObject['classes'][row_cl] + ', ';
                                }
                            }

                            let onlineLessonIcon = '';
                            if (rowObject['online_lesson'] === 1) {
                                onlineLessonIcon =
                                    <img className="myToday-icon-correct-green" src={'/images/correct-green.png'}/>;
                            } else if (rowObject['online_lesson'] === 0) {
                                onlineLessonIcon =
                                    <img className="myToday-icon-correct-gray" src={'/images/correct-gray.png'}/>;
                            } else if (rowObject['online_lesson'] === -1) {
                                onlineLessonIcon = <i className="fa fa-times-circle"> </i>;
                            }

                            let attendanceIcon = '';
                            if (rowObject['attendance'] === 1) {
                                attendanceIcon =
                                    <img className="myToday-icon-correct-green" src={'/images/correct-green.png'}/>;
                            } else if (rowObject['attendance'] === 0) {
                                attendanceIcon =
                                    <img className="myToday-icon-correct-gray" src={'/images/correct-gray.png'}/>;
                            } else if (rowObject['attendance'] === -1) {
                                attendanceIcon = <i className="fa fa-times-circle"> </i>;
                            }

                            let homeworkIcon = '';
                            if (rowObject['homework'] === 1) {
                                homeworkIcon = <span
                                    className="span-green">{rowObject['dtl_count']} | {rowObject['student_dtl_count']} | {rowObject['group_students']}</span>;
                                // <img className="myToday-icon-correct-green" src={'/images/correct-green.png'}/>;
                            } else if (rowObject['homework'] === 0) {
                                homeworkIcon = <span
                                    className="span-gray">{rowObject['dtl_count']} | {rowObject['student_dtl_count']} | {rowObject['group_students']}</span>;
                                // <img className="myToday-icon-correct-gray" src={'/images/correct-gray.png'}/>;
                            } else if (rowObject['homework'] === -1) {
                                homeworkIcon = <i className="fa fa-times-circle"> </i>;
                            }

                            let homeworkAssignIcon = '';
                            if (rowObject['homeworkAssign'] === 1) {
                                homeworkAssignIcon =
                                    <img className="myToday-icon-correct-green" src={'/images/correct-green.png'}/>;
                            } else if (rowObject['homeworkAssign'] === -1) {
                                homeworkAssignIcon = <i className="fa fa-times-circle"> </i>;
                            }

                            if (row === 0) {
                                rows.push(<tr key={'time_' + i + '_' + j + '_' + row}>
                                    <td>{rowObject.time}</td>
                                    <td rowSpan={timeRows.length}>
                                        {rowObject.subject}
                                        <br/>
                                        <span className="title">
                                            {rowObject.group}
                                        </span>
                                        <br/>
                                        <span className="class"
                                              onClick={() => _handlerClassClick(rowObject.group_id)}>
                                            {classes}
                                        </span>
                                    </td>
                                    <td rowSpan={timeRows.length} className="online-lesson"
                                        onClick={() => _handlerOnlineLessonClick(rowObject['id'], rowObject['online_lesson'])}>{onlineLessonIcon}</td>
                                    <td className="attendance"
                                        onClick={() => _handlerAttendanceClick(rowObject['id'])}>{attendanceIcon}</td>
                                    <td rowSpan={timeRows.length} className="homework"
                                        onClick={() => _handlerHomeworkAssignClick(rowObject['id'], rowObject['homeworkAssign'], timeRows[0]['schoolShiftId'])}>{homeworkAssignIcon}</td>
                                    <td rowSpan={timeRows.length} className="homework"
                                        onClick={() => _handlerHomeworkClick(rowObject['id'], rowObject['homework'], timeRows[0]['schoolShiftId'])}>{homeworkIcon}</td>
                                </tr>);
                            } else {
                                if (timeRows.length > 1) {
                                    rows.push(<tr key={'time_' + i + '_' + j + '_' + row}>
                                        <td>{rowObject.time}</td>
                                        <td className="attendance"
                                            onClick={() => _handlerAttendanceClick(rowObject['id'])}>{attendanceIcon}</td>
                                    </tr>);
                                } else {
                                    rows.push(<tr key={'time_' + i + '_' + j + '_' + row}>
                                        <td>{rowObject.time}</td>
                                        <td rowSpan={timeRows.length}>{rowObject.subject}</td>
                                        <td rowSpan={timeRows.length}
                                            onClick={() => _handlerOnlineLessonClick(rowObject['id'])}>{onlineLessonIcon}</td>
                                        <td className="attendance"
                                            onClick={() => _handlerAttendanceClick(rowObject['id'])}>{attendanceIcon}</td>
                                        <td rowSpan={timeRows.length}
                                            onClick={() => _handlerHomeworkAssignClick(rowObject['id'], rowObject['homework'], timeRows[0]['schoolShiftId'])}>{homeworkAssignIcon}</td>
                                        <td rowSpan={timeRows.length}
                                            onClick={() => _handlerHomeworkClick(rowObject['id'], rowObject['homework'], timeRows[0]['schoolShiftId'])}>{homeworkIcon}</td>
                                    </tr>);
                                }
                            }
                        }
                    }

                }
            }
        }
        return rows;
    };

    const _handlerClassClick = (id) => {
        // // setshowloader(true)
        setFetchGroupStudentModal(true)
        setActiveModal(true)
        setModalAction('group')
        // setSelectedClassId(id)

        // props.fetchMyTodayGroupStudent({
        //     group: id,
        // });
    }

    const _handlerOnlineLessonClick = (timetableId, isCreate) => {
        // setshowloader(true)
        setFetchOnlineLessonModal(true)
        setActiveModal(true)
        setModalAction('onlineLesson')
        setOnlineLessonAction(isCreate)

        if (isCreate == 1) {
            props.fetchMyTodayOnlineLesson({
                type: isCreate,
                timetable: timetableId,
                date: selectedDay.substring(0, 10)
            });
        } else {
            props.fetchMyTodayOnlineLesson({
                type: isCreate,
                timetable: timetableId,
                date: selectedDay.substring(0, 10)
            });
        }
    }

    const _handlerAttendanceClick = (timetableId) => {
        // // setshowloader(true)
        setFetchAttendanceStudentModal(true)
        setActiveModal(true)
        setModalAction('attendance')

        let param = {
            timetable: timetableId,
            date: selectedDay.substring(0, 10)
        }

        // props.fetchMyTodayAttendanceStudent({
        //     timetable: timetableId,
        //     date: selectedDay.substring(0, 10)
        // });
    }

    const enableAttendanceCheck = (e, data) => {
        setAttendanceCheckEnabled(data?.checked)
    }

    const _handlerHomeworkAssignClick = (id, homework, schoolShiftId) => {
        // setshowloader(true)
        setFetchHomeworkStudentModal(true)
        setActiveModal(true)
        setModalAction('homework')
        setHomeworkTabActiveIndex(1)
        setHomeworkTabName(HOMEWORK_TAB_PANES[1])
        setSelectedHomeworkValue(id)
        setInputViewOrEdit('view')
        setSelectedSchoolShiftId(schoolShiftId)
        setSelectedTimeTableId(id)

        let params = {
            timetable: id,
            assignDate: selectedDay ? selectedDay.substring(0, 10) : null,
        };

        // props.fetchMyHomeworkStudent(params);
    }

    const _handlerHomeworkClick = (id, isHomework, schoolShiftId) => {
        // setshowloader(true)
        setFetchHomeworkStudentModal(true)
        setActiveModal(true)
        setModalAction('homework')
        setHomeworkTabActiveIndex(0)
        setHomeworkTabName(HOMEWORK_TAB_PANES[0])
        setSelectedHomeworkValue(id)
        setInputViewOrEdit('view')
        setSelectedSchoolShiftId(schoolShiftId)
        setSelectedTimeTableId(id)

        let params = {
            timetable: id,
            date: selectedDay ? selectedDay.substring(0, 10) : null,
        };

        // props.fetchMyHomeworkStudent(params);
    }

    const _handlerBehaviorClick = (id) => {
        console.log('>>>', id)
        // setshowloader(true)
        setFetchBehaviorStudentModal(true)
        setActiveModal(true)
        setModalAction('behavior')
        setSelectedTimeTableId(id)

        let params = {
            timetable: id,
            date: selectedDay ? selectedDay.substring(0, 10) : null,
        };

        // props.fetchMyBehaviorStudent(params);
    }

    const _handlerApproveStudentClick = (id) => {
        // // setshowloader(true)
        setFetchApproveStudent(true)
        setShowApproveStudentModal(true)
        // setGroup(id)

        let params = {
            group: id,
        };

        console.log(params)
        // props.fetchApproveStudent(params);
    }

    const handleDayChange = (day) => {
        let clone = dateFormat(new Date(day));

        // // setshowloader(true)
        // setFetchInit(true)
        setHomeworkAssignSelectedDay(selectedDay)
        setSelectedDay(clone)

        let params = {
            date: selectedDay
        }

        // props.fetchMyTodayInit({
        //     date: selectedDay,
        // });
    }

    const closeModal = () => {
        setActiveModal(false)
        setModalGroup({})
        setStudentList([])
        setAttendanceReport([])
        setErrorHomeworkMessage(null)
        setSuccessHomeworkMessage(null)
        setMainModalMessage(null)
        setMessageSuccess(null)
        setFileSizeErrorAssign(false)
        setFileSizeError(false)
        setHomeworkDisableNew(false)
        setNoneOrBlock('block')
    }

    const otherAttCloseModal = () => {
        setOtherAttModal(false)
    }

    const fileUploadCloseModal = () => {
        setShowFileUploadModal(false)
    }

    const messageHandleDismiss = () => {
        setMessage(null)
    };
    // init handler end

    // attendance handler start
    const handleRadioChange = (value) => {
        if (value) {
            let studentHwTypeArray = value.split('_');

            if (studentHwTypeArray && studentHwTypeArray.length > 1) {
                let clone = attendanceStudentList;
                let studentObj = clone.filter(obj => {
                    return parseInt(obj.id) == parseInt(studentHwTypeArray[0])
                });

                if (studentObj && studentObj.length == 1) {

                    let selectedTypeId = parseInt(studentHwTypeArray[1]);

                    let attendanceAttTypes = attendanceAttTypes;
                    let attTypeObj = attendanceAttTypes.filter(obj => {
                        return parseInt(obj.id) == selectedTypeId
                    });

                    if (studentObj[0]['request_id'] || studentObj[0]['book_id']) {
                        if (attTypeObj[0]['code']?.toLowerCase() == 'came') {
                            studentObj[0]['radioTypeId'] = selectedTypeId;

                            if (selectedTypeId) {
                                studentObj[0]['checkable'] = true;
                            }

                            attendanceConfig.leftButtonClassName = 'btn m-btn--pill btn-publish m-btn--uppercase m-btn--wide'
                            attendanceConfig.leftButtonStyle = {position: 'relative', bottom: '5px'}
                            attendanceConfig.leftButtonText = translations(locale).attendance.sent_attendance

                            setAttendanceStudentList(clone)
                            setFetchAttendanceStudentDetail(true)
                            // setshowloadermodal(true)
                            setAttendanceReport(null)

                            let bodyParams = {
                                student: studentObj[0]['id'],
                                type: selectedTypeId,
                                lateMinute: studentObj[0].comment,
                                timetable: attendanceGroup.timetable || '',
                                date: attendanceGroup.date || ''
                            };
                            props.fetchAttendanceDetailSubmit(bodyParams);
                        } else {
                            let attTypeObjStudent = attendanceAttTypes.filter(obj => {
                                return parseInt(obj.id) == studentObj[0]['attendanceType']
                            });

                            message('"' + attTypeObjStudent[0]['name'] + '" ' + translations(locale).attendance.is_request, false)
                        }
                    } else {
                        if (attTypeObj[0]['code'].toLowerCase() == 'late') {
                            studentObj[0]['isDisabled'] = false;
                        } else {
                            studentObj[0]['isDisabled'] = true;
                            studentObj[0]['comment'] = '';
                        }

                        studentObj[0]['radioTypeId'] = selectedTypeId;

                        if (selectedTypeId) {
                            studentObj[0]['checkable'] = true;
                        }

                        attendanceConfig.leftButtonClassName = 'btn m-btn--pill btn-publish m-btn--uppercase m-btn--wide'
                        attendanceConfig.leftButtonStyle = {position: 'relative', bottom: '5px'}
                        attendanceConfig.leftButtonText = translations(locale).attendance.sent_attendance

                        setAttendanceStudentList(clone)
                        setFetchAttendanceStudentDetail(true)
                        // setshowloadermodal(true)
                        setAttendanceReport(null)

                        let bodyParams = {
                            student: studentObj[0]['id'],
                            type: selectedTypeId,
                            lateMinute: studentObj[0].comment,
                            timetable: attendanceGroup.timetable || '',
                            date: attendanceGroup.date || ''
                        };
                        props.fetchAttendanceDetailSubmit(bodyParams);
                    }
                }
            }
        }
    };

    const handleInlineEditChange = (data, id, key) => {
        if (id && data && key == "Enter") {
            let clone = attendanceStudentList;
            let studentObj = clone.filter(obj => {
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
                    setAttendanceStudentList(clone)
                    setFetchAttendanceStudentDetail(true)
                    // setshowloadermodal(true)

                    let bodyParams = {
                        student: studentObj[0]['id'],
                        type: studentObj[0]['radioTypeId'],
                        lateMinute: studentObj[0].comment,
                        timetable: attendanceGroup.timetable || '',
                        date: attendanceGroup.date || ''
                    };
                    props.fetchAttendanceDetailSubmit(bodyParams);
                } else {
                    setAttendanceStudentList(clone)
                }
            }
        }
    }

    const handlerAttCheckbox = (e, {value}) => {
        let timeTableArray = selectedTimeTableIds;
        let timeTableList = otherTimeTableList;

        let sameId = timeTableArray.find(function (val) {
            return val === value
        });

        let timeTable = timeTableList.find(function (val) {
            return val['id'] === value
        });

        // if(timeTable['checked'] == true){
        //
        // } else {
        //     timeTable['checked'] = true;
        // }

        if (sameId) {
            timeTable['checked'] = false;
            timeTableArray.splice($.inArray(sameId, timeTableArray), 1);

            setSelectedTimeTableIds(timeTableArray)
        } else {
            timeTable['checked'] = true;
            timeTableArray.push(value);

            setSelectedTimeTableIds(timeTableArray)
        }
    }

    const _sendAttendance = () => {
        let attendanceStudents = [];
        let attendanceTypes = [];
        let attendanceLateMinutes = [];
        for (var i = 0; i < attendanceStudentList.length; i++) {
            let studentObj = attendanceStudentList[i];

            if (attendanceCheckEnabled) {
                if (studentObj?.checkable) {
                    attendanceStudents.push(studentObj.id);
                    attendanceTypes.push(studentObj.radioTypeId);
                    attendanceLateMinutes.push(studentObj.comment);
                }
            } else {
                attendanceStudents.push(studentObj.id);
                attendanceTypes.push(studentObj.radioTypeId);
                attendanceLateMinutes.push(studentObj.comment);
            }
        }

        let bodyParams = {
            'students[]': attendanceStudents,
            'types[]': attendanceTypes,
            'lateMinutes[]': attendanceLateMinutes,
            timetable: attendanceGroup.timetable || '',
            date: attendanceGroup.date || ''
        };

        setFetchAttSend(true)
        // setshowloadermodal(true)
        setAttendanceReport([])

        props.fetchAttendanceSend(bodyParams);
    }

    const onAttendanceRowChecked = () => {

    }

    const _otherAttSubmit = () => {
        let selectedTimeTableIds = selectedTimeTableIds;


        if (selectedTimeTableIds && selectedTimeTableIds.length > 0) {
            // selectedTimeTableIds = selectedTimeTableIds.toString()

            let params = {
                'timetable': attendanceGroup ? attendanceGroup.timetable : null,
                'selectedTimeTableIds[]': selectedTimeTableIds,
                date: selectedDay ? selectedDay.substring(0, 10) : null,
            };
            setFetchOtherAttSend(true)
            // setshowloadermodal(true)
            setOtherModalMessage(null)

            props.fetchOtherAttendanceSend(params);
        } else {
            setOtherModalMessage(translations(locale).survey.select_time || null)
        }

    }

    // attendance handler end

    // online lesson
    const _onlineLessonTabChange = (e, data) => {
        setOnlineLessonTabActiveIndex(data.activeIndex)
        setOnlineLessonTabName(data['panes'][data.activeIndex]['menuName'])
    };

    // homework handler start
    const _homeworkTabChange = (e, data) => {
        let stateParam = {
            homeworkTabActiveIndex: data.activeIndex,
            homeworkTabName: HOMEWORK_TAB_PANES[data.activeIndex],
            errorHomeworkMessage: null,
            successHomeworkMessage: null,
            messageSuccess: null,
            mainModalMessage: null,
            fileSizeErrorAssign: false,
            fileSizeError: false
        }
        if (data.activeIndex === 0 && homeworkFileLoading) {
            stateParam['fetchHomeworkInfo'] = true;
        }
        setHomeworkTabActiveIndex(data.activeIndex)
        console.log('>>>', stateParam)
        if (data.activeIndex === 0 && homeworkFileLoading && homeworkObj) {
            let param = {
                id: homeworkObj.id
            }
            // props.fetchHomeworkInfo(param);
        }
    };

    const homeworkTabHeaderRender = () => {
        let date = null;
        if (selectedDay) {
            date = selectedDay.substring(0, 10);
        }
        return (
            <div className='pb-5' style={{fontSize: '1.2rem'}}>
                <div className='row'>
                    <div className="col text-right bolder" style={{color: '#868aa8'}}>{date}</div>
                    <div className="col" style={{color: '#575962'}}>{homeworkGroup?.subject}</div>
                </div>
                <div className='row'>
                    <div className="col text-right bolder"
                         style={{color: '#868aa8'}}>{date ? WEEKDAYS_LONG[locale][(new Date(date)).getDay()] : ''}</div>
                    <div className="col" style={{color: '#575962'}}>{homeworkGroup?.name}</div>
                </div>
                <div className='row'>
                    <div className="col text-right bolder" style={{color: '#868aa8'}}>{}</div>
                    <div className="col" style={{
                        color: '#575962',
                        textDecoration: 'underline'
                    }}>{homeworkGroup?.classes}</div>
                </div>
            </div>
        )
    };

    const onlineLessonLinkTabBodyRender = () => {
        return (
            <div>
                <div className="form-group m-form__group row">
                    <div className="col-12 displayFlex">
                        <label htmlFor="example-number-input" className="col-4 col-form-label online-lesson-label">
                            {translations(locale).my.link || null}
                        </label>
                        <div className="col-6">
                            <input
                                type="text"
                                className="form-control"
                                value={insertedOnlineLessonLink || ''}
                                onChange={onlineLessonLinkInputHandler}
                            />
                        </div>
                        <div className="col-2">
                        </div>
                    </div>
                </div>

                <div className="form-group m-form__group row">
                    <div className="col-md-12 displayFlex">
                        <label htmlFor="example-number-input"
                               className="col-md-4 col-form-label online-lesson-label">
                            {translations(locale).description || null}
                        </label>
                        <div className="col-md-7">
                            <TextArea
                                className="descriptionArea"
                                value={onlineLessonLinkDescription}
                                onChange={onlineLessonLinkTextAreaHandler}
                                spellCheck={false}
                            />
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    const onlineLessonGoogleDriverTabBodyRender = () => {
        let that = this
        return (
            <div>
                {
                    linkInfo && linkInfo.length > 0
                        ?
                        <div>
                            <div className="form-group m-form__group row">
                                <div className="col-12 displayFlex">
                                    <label htmlFor="example-number-input"
                                           className="col-4 col-form-label online-lesson-label">
                                        {translations(locale).my.link || null}
                                    </label>
                                    <div className="col-8">
                                        {
                                            <button
                                                className='link-button-style'
                                                onClick={myTodayOnlineLessonLinkClick}
                                            >
                                                {linkInfo && linkInfo.length > 0 ? linkInfo[0]['pathName'] : ''}
                                            </button>
                                        }
                                    </div>
                                </div>
                            </div>

                            <div className="form-group m-form__group row">
                                <div className="col-md-12 displayFlex">
                                    <label htmlFor="example-number-input"
                                           className="col-md-4 col-form-label online-lesson-label">
                                        {translations(locale).description || null}
                                    </label>
                                    <div className="col-md-7">
                                        <TextArea
                                            className="descriptionArea"
                                            value={onlineLessonGoogleDriverDescription}
                                            onChange={onlineLessonGoogleDriverTextAreaHandler}
                                            spellCheck={false}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        :
                        <div>
                            <div className="form-group m-form__group row">
                                <div className="col-12 displayFlex">
                                    <label htmlFor="example-number-input"
                                           className="col-4 col-form-label online-lesson-label">
                                        {translations(locale).filesDt.file || null}
                                    </label>
                                    <div className="col-4">
                                        <input
                                            ref={onlineLessonFileUploader}
                                            type="file"
                                            className="form-control m-input"
                                            value={''}
                                            onChange={googleDriverNewFileInputOnChange}
                                            style={{display: 'none'}}
                                        />
                                        <input type="text" className="form-control m-input"
                                               value={googleDriverNewFileInputText} readOnly/>
                                    </div>
                                    <div className="col-2" style={{paddingLeft: 0}}>
                                        <button type="button" onClick={onlineLessonFileClickHandler}
                                                style={{padding: '0.8rem 1rem'}}
                                                className="btn btn-outline-publish m-btn m-btn--icon m-btn--outline m-btn--pill">
                                            {translations(locale).homework.insert_file || null}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="form-group m-form__group row">
                                <div className="col-12 displayFlex">
                                    <div className="col-md-1" id="Main">
                                    </div>
                                    <div className="col-md-10 ">
                                        <Carousel
                                            ssr
                                            partialVisbile
                                            slidesToSlide={5}
                                            itemClass="image-item"
                                            responsive={responsive}
                                            customRightArrow={<CustomRightArrow/>}
                                            customLeftArrow={<CustomLeftArrow/>}
                                            arrows
                                            renderButtonGroupOutside={true}
                                        >
                                            {
                                                googleDriverFiles && googleDriverFiles.length > 0 && googleDriverFiles.map(function (file, index) {
                                                    return (
                                                        <div className="col-md-12" key={'file_' + index}>
                                                            <div className="m-portlet br-12">
                                                                <div className="m-portlet__head">
                                                                    <div className="m-portlet__head-caption">
                                                                    </div>
                                                                    <div className="m-portlet__head-tools">
                                                                        <Checkbox
                                                                            label=''
                                                                            checked={file['checked']}
                                                                            onChange={(e, data) => onlineLessonGoogleDriverFileCheckBoxHandler(e, data, index)}
                                                                        />
                                                                    </div>
                                                                </div>
                                                                <div className="m-portlet__body">
                                                                </div>
                                                                <div className="m-portlet__foot" style={{
                                                                    display: 'block',
                                                                    overflowWrap: 'anywhere'
                                                                }}>
                                                                    <div className="row align-items-center file-name">
                                                                        {file['fileName']}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                })
                                            }
                                        </Carousel>
                                    </div>
                                    <div className="col-md-1">
                                    </div>
                                </div>
                            </div>

                            <div className="form-group m-form__group row">
                                <div className="col-md-12 displayFlex">
                                    <label htmlFor="example-number-input"
                                           className="col-md-4 col-form-label online-lesson-label">
                                        {translations(locale).description || null}
                                    </label>
                                    <div className="col-md-7">
                                        <TextArea
                                            className="descriptionArea"
                                            value={onlineLessonGoogleDriverDescription}
                                            onChange={onlineLessonGoogleDriverTextAreaHandler}
                                            spellCheck={false}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                }
            </div>
        )
    }

    const onlineLessonVideoBodyTabRender = () => {
        let that = this
        return (
            <div>
                {
                    linkInfo && linkInfo.length > 0
                        ?
                        <div>
                            <div className="form-group m-form__group row">
                                <div className="col-md-12 displayFlex">
                                    <label htmlFor="example-number-input"
                                           className="col-md-4 col-form-label online-lesson-label">
                                        {translations(locale).my.video || null}
                                    </label>
                                    <div className="col-md-7">
                                        <ReactPlayer
                                            url={linkInfo[0]['path']}
                                            config={{
                                                youtube: {playerVars: {disablekb: 1}},
                                                file: {
                                                    attributes: {
                                                        onContextMenu: e => e.preventDefault()
                                                    },
                                                    hlsOptions: {
                                                        forceHLS: true,
                                                        debug: false,
                                                        xhrSetup: function (xhr, url) {
                                                            xhr.setRequestHeader('Authorization', "ya29.c.KpIB1gfmWj8OaZZflPiomP8fAznW-LJANJI5DdSFuuivuWO7CkO1xOFObxUP89jCZ9yDx_7lmsNjYCqHlCiDrkjSItezNNY5C2N7DGyXTzriMHmqReWArAEysuqxayUriurO8jyd_MsacoVAxrDPX7KNEAUcmr5BkwFyEv4zCno1t4NCwNyd1RxszWk0oB6l4cjawbc")
                                                            // if (needsAuth(url)) {
                                                            //
                                                            // }
                                                        },
                                                    },
                                                }
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="form-group m-form__group row">
                                <div className="col-md-12 displayFlex">
                                    <label htmlFor="example-number-input"
                                           className="col-md-4 col-form-label online-lesson-label">
                                        {translations(locale).description || null}
                                    </label>
                                    <div className="col-md-7">
                                        <TextArea
                                            className="descriptionArea"
                                            value={onlineLessonVideoDescription}
                                            onChange={onlineLessonVideoTextAreaHandler}
                                            spellCheck={false}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        :
                        <div>
                            <div className="form-group m-form__group row">
                                <div className="col-12 displayFlex">
                                    <label htmlFor="example-number-input"
                                           className="col-4 col-form-label online-lesson-label">
                                        {translations(locale).filesDt.file || null}
                                    </label>
                                    <div className="col-4">
                                        <input
                                            ref={onlineLessonVideoUploader}
                                            accept={'video/*'}
                                            type="file"
                                            className="form-control m-input"
                                            value={''}
                                            onChange={videoNewFileInputOnChange}
                                            style={{display: 'none'}}
                                        />
                                        <input type="text" className="form-control m-input"
                                               value={videoNewFileInputText} readOnly/>
                                    </div>
                                    <div className="col-2" style={{paddingLeft: 0}}>
                                        <button type="button" onClick={onlineLessonVideoClickHandler}
                                                style={{padding: '0.8rem 1rem'}}
                                                className="btn btn-outline-publish m-btn m-btn--icon m-btn--outline m-btn--pill">
                                            {translations(locale).homework.insert_file || null}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="form-group m-form__group row">
                                <div className="col-12 displayFlex">
                                    <div className="col-md-1" id="Main">
                                    </div>
                                    <div className="col-md-10">
                                        <Carousel
                                            ssr
                                            partialVisbile
                                            slidesToSlide={5}
                                            itemClass="image-item"
                                            responsive={responsive}
                                            customRightArrow={<CustomRightArrow/>}
                                            customLeftArrow={<CustomLeftArrow/>}
                                            arrows
                                            renderButtonGroupOutside={true}
                                        >
                                            {
                                                videos && videos.length > 0 && videos.map(function (file, index) {
                                                    return (
                                                        <div className="col-md-12" key={'file_' + index}>
                                                            <div className="m-portlet br-12">
                                                                <div className="m-portlet__head">
                                                                    <div className="m-portlet__head-caption">
                                                                    </div>
                                                                    <div className="m-portlet__head-tools">
                                                                        <Checkbox
                                                                            label=''
                                                                            checked={file['checked']}
                                                                            onChange={(e, data) => onlineLessonVideoCheckBoxHandler(e, data, index)}
                                                                        />
                                                                    </div>
                                                                </div>
                                                                <div className="m-portlet__body">
                                                                </div>
                                                                <div className="m-portlet__foot" style={{
                                                                    display: 'block',
                                                                    overflowWrap: 'anywhere'
                                                                }}>
                                                                    <div className="row align-items-center file-name">
                                                                        {file['linkName']}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                })
                                            }
                                        </Carousel>
                                    </div>
                                    <div className="col-md-1">
                                    </div>
                                </div>
                            </div>

                            <div className="form-group m-form__group row">
                                <div className="col-md-12 displayFlex">
                                    <label htmlFor="example-number-input"
                                           className="col-md-4 col-form-label online-lesson-label">
                                        {translations(locale).description || null}
                                    </label>
                                    <div className="col-md-7">
                                        <TextArea
                                            className="descriptionArea"
                                            value={onlineLessonVideoDescription}
                                            onChange={onlineLessonVideoTextAreaHandler}
                                            spellCheck={false}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                }
            </div>
        )
    }

    const homeworkTabBodyRender = () => {
        let that = this
        if (homeworkObj) {

            let startDate = null, endDate = null, disableWeekDays = [0, 1, 2, 3, 4, 5, 6];

            if (homeworkCalendar) {
                startDate = new Date(homeworkCalendar.before);
                endDate = new Date(homeworkCalendar.after);

                for (let j = 0; j < homeworkCalendar.weekdays.length; j++) {
                    let weekdayIndex = homeworkCalendar.weekdays[j];

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
                <>
                    {
                        inputViewOrEdit && inputViewOrEdit === 'view'
                        &&
                        <>
                            <div style={{fontSize: '1.2rem'}}>
                                <div className='row'>
                                    <div className="col text-right bolder"
                                         style={{color: '#868aa8'}}> {translations(locale).homework.homework_due_date}</div>
                                    <div className="col bolder"
                                         style={{color: '#575962'}}>{homeworkObj.dueDate}</div>
                                </div>
                                <div className='row'>
                                    <div className="col text-right bolder"
                                         style={{color: '#868aa8'}}> {translations(locale).homeworkReport.homework}</div>
                                    <div className="col bolder" style={{color: '#575962'}}
                                         dangerouslySetInnerHTML={{__html: htmlDecode(homeworkObj.description || '<p></p>')}}></div>
                                </div>
                                <div className='row'>
                                    <div className="col text-right bolder"
                                         style={{color: '#868aa8'}}>{translations(locale).homework.score}</div>
                                    <div className="col bolder"
                                         style={{color: '#575962'}}>{homeworkObj.totalScore}</div>
                                </div>
                                <div className='row'>
                                    <div className="col text-right bolder"
                                         style={{color: '#868aa8'}}>{translations(locale).link.link}</div>
                                    <div className="col bolder" style={{color: '#575962'}}><a
                                        href={homeworkObj.link}
                                        target='_blank'>{homeworkObj.link}</a></div>
                                </div>
                                <div className='row'>
                                    <div className="col text-right bolder"
                                         style={{color: '#868aa8'}}>{translations(locale).homework.file}</div>
                                    {
                                        homeworkFileLoading
                                            ?
                                            <div className='col'
                                                 style={{color: '#575962'}}>{translations(locale).homework.file_loading}</div>
                                            :
                                            homeworkObj && homeworkObj['files'] && homeworkObj['files'].length > 0
                                                ?
                                                <div className="col">
                                                    {
                                                        homeworkObj['files'].map(function (file) {
                                                            return (
                                                                <div
                                                                    onClick={() => window.open(file.path)}
                                                                    className="br-08 mb-2 d-flex align-items-center pointer p-2 pl-3"
                                                                    style={{
                                                                        minHeight: '3rem',
                                                                        width: '100%',
                                                                        backgroundColor: "rgba(227, 228, 238, 0.5)",
                                                                        overflowWrap: 'anywhere'
                                                                    }} key={file.id}>
                                                                    <p className="m-0">{file.name}</p>
                                                                </div>
                                                            )
                                                        })
                                                    }
                                                </div>
                                                :
                                                <div className='col'
                                                     style={{color: '#575962'}}>{translations(locale).homework.no_file}</div>
                                    }
                                </div>
                            </div>
                        </>
                    }
                    {
                        inputViewOrEdit && inputViewOrEdit === 'edit'
                        &&
                        <div className="container">
                            <div className="form-group m-form__group row">
                                <label className="col-md-4 col-form-label label-pinnacle-bold text-right">
                                    {translations(locale).homework.homework_due_date || null}
                                </label>
                                <div className="col-md-5">
                                    <DayPickerInput
                                        onDayChange={homeworkHandleDayChange}
                                        value={homeworkAssignSelectedDay}
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

                                </div>
                            </div>
                            <div className="form-group m-form__group row">
                                <label
                                    className="col-md-4 col-form-label label-pinnacle-bold text-right">
                                    {translations(locale).homework.title || null}
                                </label>
                                <div className="col-md-5">
                                    <textarea
                                        rows="5"
                                        className='form-control'
                                        value={homeworkEditEditorState}
                                        onChange={(e) => onHwEditorStateChange(e?.target?.value)}
                                    />
                                    {/* <Editor
                                        editorState={homeworkEditEditorState}
                                        wrapperClassName="demo-wrapper"
                                        editorClassName="demo-editor"
                                        onEditorStateChange={onHwEditorStateChange}
                                        toolbar={{
                                            inline: { className: 'editor-hide-icon' },
                                            list: { className: 'editor-hide-icon' },
                                            textAlign: { className: 'editor-hide-icon' },
                                            history: { className: 'editor-hide-icon' },
                                            blockType: { className: 'editor-hide-icon' },
                                            fontSize: { className: 'editor-hide-icon' },
                                            fontFamily: { className: 'editor-hide-icon' },
                                            colorPicker: { className: 'editor-hide-icon' },
                                            emoji: { className: 'editor-hide-icon' },
                                            embedded: { className: 'editor-hide-icon' },
                                            image: { className: 'editor-hide-icon' },
                                            remove: { className: 'editor-hide-icon' },
                                            link: { className: 'editor-hide-icon', },
                                        }}
                                        localization={{
                                            locale: 'mn',
                                        }}
                                    /> */}
                                </div>
                            </div>
                            <div className="form-group m-form__group row">
                                <label className="col-md-4 col-form-label label-pinnacle-bold text-right">
                                    {translations(locale).score + '*' || null}
                                </label>
                                <div className="col-5">
                                    <input
                                        type={"number"}
                                        className="form-control"
                                        placeholder={translations(locale).homework.score}
                                        value={homeworkEditScore || ''}
                                        max={100}
                                        min={0}
                                        onChange={(event) => editInputChangedScoreHandler(event)}
                                    />
                                    <div className="inputWarningMessage">
                                        <span>{translations(locale).homework.file_warning_message || null}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="form-group m-form__group row">
                                <label
                                    className="col-md-4 col-form-label label-pinnacle-bold text-right">
                                    {translations(locale).link.link || null}
                                </label>
                                <div className="col-5">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder={translations(locale).link.insert_link}
                                        value={homeworkEditLink || ''}
                                        onChange={(event) => editInputChangedLinkHandler(event)}
                                    />
                                </div>
                            </div>
                            <div className="form-group m-form__group row">
                                <div className="col d-flex flex-column justify-content-center align-items-center">
                                    <img onClick={chooseFileClickHandler} width={80} src="/img/upload.png"
                                         alt="upload image" className='py-2 pointer'/>
                                    <span className='bolder pb-2' style={{
                                        fontSize: '0.95rem',
                                        color: '#3c3f42'
                                    }}>{translations(locale).filesDt.upload}</span>
                                    <input
                                        ref={fileUploader}
                                        type="file"
                                        hidden
                                        multiple={true}
                                        value={homeworkFile || ''}
                                        onChange={(event) => inputChangedFileHandler(event)}
                                    />
                                    <span>{newFileInputText}</span>
                                    <span
                                        className={'span-warning'}>{translations(locale).filesDt.file_limit_with_video || null}</span>
                                </div>
                            </div>
                            <div className="form-group m-form__group row">
                                <div className="col d-flex flex-column justify-content-center align-items-center">
                                    {
                                        homeworkObj && homeworkObj['files'] && homeworkObj['files'].length > 0
                                        &&
                                        homeworkObj['files'].map(function (file, index) {
                                            return (
                                                <div
                                                    className='br-08 d-flex justify-content-between align-items-center p-2 my-1'
                                                    style={{
                                                        backgroundColor: 'rgba(227, 228, 238, 0.5)',
                                                        width: '27rem',
                                                        minHeight: '4rem',
                                                        overflowWrap: 'anywhere'
                                                    }} key={index}>
                                                    <div className="d-flex justify-content-start align-items-center">
                                                        <CheckCircleOutlineIcon sx={{color: '#a3f154', fontSize: 25}}/>
                                                        <p className='m-0 px-2'
                                                           style={{color: '#575962'}}>{file.name}</p>
                                                    </div>
                                                    <div className="d-flex justify-content-end align-items-center">
                                                        <i className="la la-times-circle pointer"
                                                           style={{color: '#979797', fontSize: 25}}
                                                           onClick={() => _removeFile(file.id)}
                                                        />
                                                    </div>
                                                </div>
                                            );
                                        })
                                    }
                                </div>
                            </div>
                            <div className="form-group m-form__group row">
                                <div className="col d-flex flex-column justify-content-center align-items-center">
                                    {
                                        files
                                        &&
                                        files.map(function (value, index) {
                                            let values = files[index];
                                            return (
                                                <div
                                                    className='br-08 d-flex justify-content-between align-items-center p-2 my-1'
                                                    style={{
                                                        backgroundColor: 'rgba(227, 228, 238, 0.5)',
                                                        width: '27rem',
                                                        minHeight: '4rem',
                                                        borderBottom: '3px solid #a3f154',
                                                        overflowWrap: 'anywhere'
                                                    }} key={index}>
                                                    <div className="d-flex justify-content-start align-items-center">
                                                        <CheckCircleOutlineIcon sx={{color: '#a3f154', fontSize: 25}}/>
                                                        <p className='m-0 px-2'
                                                           style={{color: '#575962'}}>{values.name}</p>
                                                    </div>
                                                    <div className="d-flex justify-content-end align-items-center">
                                                        <i className="la la-times-circle pointer"
                                                           style={{color: '#979797', fontSize: 25}}
                                                           onClick={() => _removeFileList(values.lastModified)}
                                                        />
                                                    </div>
                                                </div>
                                            );
                                        })
                                    }
                                </div>
                            </div>
                        </div>
                    }
                </>
            )
        } else {
            return (
                <div>
                    <div className="form-group m-form__group row">
                        <div className="col text-center">
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
                        <div className="row text-white" style={{gap: 20}}>
                            {
                                homeworkReport && homeworkReport.length > 0
                                &&
                                homeworkReport.map((report, key) =>
                                    <div key={key} className='col br-06 p-3' style={{
                                        backgroundColor: report?.color,
                                        boxShadow: '1px 1px 15px 0 rgba(87, 89, 98, 0.3)'
                                    }}>
                                        <div className="row">
                                            <div className='col-6 d-flex flex-column justify-content-between'>
                                                <h5>{report.name}</h5>
                                                <h5 className='bolder'
                                                    style={{fontFamily: 'MulishBlack'}}>{report.percentage}%</h5>
                                            </div>
                                            <div className='col-6 text-right'>
                                                <span className='bolder text-right' style={{
                                                    fontSize: '3.5rem',
                                                    fontFamily: 'MulishBlack'
                                                }}>{report.count}</span>
                                            </div>
                                        </div>
                                    </div>
                                )
                            }
                        </div>
                    </div>
                }
                {
                    homeworkObj && homeworkObj.ableToCheck
                        ?
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
                        :
                        <div className='m-portlet br-12'>
                            <div className='m-portlet__body text-center'>
                                {translations(locale).homework.homework_due_date_error}
                            </div>
                        </div>
                }
            </div>
        )
    };

    const homeworkTabAssignBodyRender = () => {
        let that = this

        let startDate = null, endDate = null, disableWeekDays = [0, 1, 2, 3, 4, 5, 6];

        if (homeworkCalendar) {
            startDate = new Date(homeworkCalendar.before);
            endDate = new Date(homeworkCalendar.after);

            for (let j = 0; j < homeworkCalendar.weekdays.length; j++) {
                let weekdayIndex = homeworkCalendar.weekdays[j];

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
                {
                    homeworkDisableNew
                        ?
                        <div>
                            <Message
                                negative={true}
                            >
                                {translations(locale).homework.homework_assigned_already || ""}
                            </Message>
                        </div>
                        :
                        <div className="container">
                            <div className="form-group m-form__group row">
                                <label
                                    className="col-md-4 col-form-label label-pinnacle-bold text-right">
                                    {translations(locale).group.title || null}
                                </label>
                                <div className="col-md-5 col-sm-6">
                                    {
                                        <Dropdown
                                            options={homeworkGroups}
                                            placeholder={translations(locale).group.title || null}
                                            fluid
                                            selection
                                            search
                                            additionPosition='bottom'
                                            upward={false}
                                            closeOnChange
                                            multiple={true}
                                            selectOnBlur={false}
                                            value={selectedHomeworkGroupIds}
                                            onChange={homeworkAssignSelectChange}
                                        />
                                    }
                                </div>
                            </div>

                            {
                                errorGroupsMessage && <Message
                                    negative={true}
                                >
                                    {errorGroupsMessage}
                                </Message>
                            }

                            <div className="form-group m-form__group row">
                                <label
                                    className="col-md-4 col-form-label label-pinnacle-bold text-right">
                                    {translations(locale).homework.homework_due_date || null}
                                </label>
                                <div className="col-md-5 col-sm-6">
                                    <DayPickerInput
                                        onDayChange={homeworkHandleDayChange}
                                        value={homeworkAssignSelectedDay}
                                        placeholder={translations(locale).datePickerPlaceholder}
                                        hideOnDayClick={true}
                                        inputProps={{readOnly: true}}
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
                                        classNames={{
                                            container: 'myToday-hw-DayPicker',
                                            overlay: 'DayPickerInputOverlay'
                                        }}
                                    />
                                </div>
                            </div>

                            {
                                errorDateMessage && <Message
                                    negative={true}
                                >
                                    {errorDateMessage}
                                </Message>
                            }

                            <div className="form-group m-form__group row">
                                <label
                                    className="col-md-4 col-form-label label-pinnacle-bold text-right">
                                    {translations(locale).homework.title || null}
                                </label>
                                <div className="col-md-5">
                                    <textarea
                                        rows="5"
                                        className='form-control'
                                        value={editorState}
                                        onChange={(e) => onEditorStateChange(e?.target?.value)}
                                    />
                                    {/* <Editor
                                        editorState={editorState}
                                        wrapperClassName="demo-wrapper"
                                        editorClassName="demo-editor"
                                        onEditorStateChange={onEditorStateChange}
                                        toolbar={{
                                            inline: { className: 'editor-hide-icon' },
                                            list: { className: 'editor-hide-icon' },
                                            textAlign: { className: 'editor-hide-icon' },
                                            history: { className: 'editor-hide-icon' },
                                            blockType: { className: 'editor-hide-icon' },
                                            fontSize: { className: 'editor-hide-icon' },
                                            fontFamily: { className: 'editor-hide-icon' },
                                            colorPicker: { className: 'editor-hide-icon' },
                                            emoji: { className: 'editor-hide-icon' },
                                            embedded: { className: 'editor-hide-icon' },
                                            image: { className: 'editor-hide-icon' },
                                            remove: { className: 'editor-hide-icon' },
                                            link: { className: 'editor-hide-icon', },
                                        }}
                                        localization={{
                                            locale: 'mn',
                                        }}
                                    /> */}
                                </div>
                            </div>

                            <div className="form-group m-form__group row">
                                <label
                                    className="col-md-4 col-form-label label-pinnacle-bold text-right">
                                    {translations(locale).score + '*' || null}
                                </label>
                                <div className="col-5">
                                    <input
                                        type={"number"}
                                        className="form-control"
                                        placeholder={translations(locale).homework.score}
                                        value={homeworkAssignScore || ''}
                                        max={100}
                                        min={0}
                                        onChange={(event) => inputChangedScoreHandler(event)}
                                    />
                                </div>
                            </div>

                            <div className="form-group m-form__group row">
                                <label
                                    className="col-md-4 col-form-label label-pinnacle-bold text-right">
                                    {translations(locale).link.link || null}
                                </label>
                                <div className="col-5">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder={translations(locale).link.insert_link}
                                        value={homeworkLink || ''}
                                        onChange={(event) => inputChangedLinkHandler(event)}
                                    />
                                </div>
                            </div>

                            <div className="form-group m-form__group row">
                                <div className="col d-flex flex-column justify-content-center align-items-center">
                                    <img onClick={chooseFileClickHandler} width={80} src="/img/upload.png"
                                         alt="upload image" className='py-2 pointer'/>
                                    <span className='bolder pb-2' style={{
                                        fontSize: '0.95rem',
                                        color: '#3c3f42'
                                    }}>{translations(locale).filesDt.upload}</span>
                                    <input
                                        ref={fileUploader}
                                        type="file"
                                        hidden
                                        multiple={true}
                                        value={homeworkAssignFile || ''}
                                        onChange={(event) => inputChangedFileHandler(event)}
                                    />
                                    <span>{newFileInputText}</span>
                                    <span
                                        className={'span-warning'}>{translations(locale).filesDt.file_limit_with_video || null}</span>
                                </div>
                            </div>
                            <div className="form-group m-form__group row">
                                <div className="col d-flex flex-column justify-content-center align-items-center">
                                    {
                                        filesAssign
                                        &&
                                        filesAssign.map(function (value, index) {
                                            let values = filesAssign[index];
                                            return (
                                                <div
                                                    className='br-08 d-flex justify-content-between align-items-center p-2 my-1'
                                                    style={{
                                                        backgroundColor: 'rgba(227, 228, 238, 0.5)',
                                                        width: '27rem',
                                                        minHeight: '4rem',
                                                        borderBottom: '3px solid #a3f154',
                                                        overflowWrap: 'anywhere'
                                                    }} key={index}>
                                                    <div className="d-flex justify-content-start align-items-center">
                                                        <CheckCircleOutlineIcon sx={{color: '#a3f154', fontSize: 25}}/>
                                                        <p className='m-0 px-2'
                                                           style={{color: '#575962'}}>{values.name}</p>
                                                    </div>
                                                    <div className="d-flex justify-content-end align-items-center">
                                                        <i className="la la-times-circle pointer"
                                                           style={{color: '#979797', fontSize: 25}}
                                                           onClick={() => _removeFileList(values.lastModified)}
                                                        />
                                                    </div>
                                                </div>
                                            );
                                        })
                                    }
                                </div>
                            </div>
                            {
                                errorHomeworkMessage && <Message
                                    negative={true}
                                >
                                    {errorHomeworkMessage}
                                </Message>
                            }

                            {
                                successHomeworkMessage && <Message
                                    positive={true}
                                >
                                    {successHomeworkMessage}
                                </Message>
                            }

                        </div>
                }

            </div>
        )
    };

    let dateObj = new Date();
    let datePickerTitle = dateFormat(new Date()) + ' ' + WEEKDAYS_LONG[locale][dateObj.getDay()];

    let startDate = null, endDate = null;

    if (currentSeason) {
        startDate = new Date(currentSeason.startDate);
        endDate = new Date(currentSeason.endDate);
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
            <div className="d-flex align-items-center justify-content-start ml-4 mb-3 mt-4">
                <a href="#" style={{color: 'black'}} onClick={() => {
                    let clone = (selectedDay).substring(0, 10);
                    let selectedDate = new Date(clone);
                    selectedDate.setDate(selectedDate.getDate() - 1);
                    handleDayChange(dateFormat(selectedDate));
                }}
                    className="d-flex align-items-center justify-content-center no-decoration">
                    <i className='la la-angle-left'/>
                </a>
                <div className="col-auto p-0 text-center pl-1">
                    <DayPickerInput
                        onDayChange={handleDayChange}
                        value={selectedDay}
                        hideOnDayClick={true}
                        inputProps={{readOnly: true}}
                        placeholder={datePickerTitle}
                        dayPickerProps={{
                            disabledDays: startDate && endDate
                                ? {
                                    before: new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate()),
                                    after: new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate())
                                }
                                :
                                {}
                        }}
                        classNames={{
                            container: 'myToday-DayPicker',
                            overlay: 'DayPickerInputOverlay'
                        }}
                        onDayPickerShow={() => handlerDayPickerShow()}
                        onDayPickerHide={() => handlerDayPickerHide()}
                    />
                </div>
                <a href="#" style={{color: 'black'}} onClick={() => {
                    let cloneOther = (selectedDay).substring(0, 10);
                    let selectedDate = new Date(cloneOther);
                    selectedDate.setDate(selectedDate.getDate() + 1);
                    handleDayChange(dateFormat(selectedDate));
                }} className="d-flex align-items-center justify-content-center no-decoration">
                    <i className='la la-angle-right'/>
                </a>
            </div>
            <div className="m-content">
                {/* <h5 className='bolder pl-3' style={{ color: '#ff5b1d', marginBottom: '0.7rem' }}>{translations(locale).teacherToday?.notification}</h5>
                <div className='m-portlet br-12'>
                    <div className='m-portlet__body text-center'>
                        <span>{translations(locale).teacherToday?.noNotification}</span>
                    </div>
                </div>

                <h5 className='bolder pl-3' style={{ color: '#ff5b1d', marginBottom: '0.7rem', marginTop: '1.5rem' }}>{translations(locale).teacherToday?.notification}</h5>
                <div className='m-portlet br-12'>
                    <div className='m-portlet__body' style={{ padding: '1rem 2rem' }}>
                        <div className='col'>
                            <div className='row align-items-center'>
                                <EmailIcon sx={{ color: '#ff5b1d', fontSize: '2.5rem', paddingRight: '0.7rem' }} />
                                <span className='bolder'>Мишээл</span>
                                <span>-с чөлөөний хүсэлт ирсэн байна.</span>
                            </div>
                            <div className='row align-items-center'>
                                <InsertInvitationIcon sx={{ color: '#ff5b1d', fontSize: '2.5rem', paddingRight: '0.7rem' }} />
                                <span>Өнөөдөр</span>
                                <span className='bolder'>&nbsp;Эцэг эхийн хурал&nbsp;</span>
                                <span>болно.</span>
                            </div>
                        </div>
                    </div>
                </div> */}
                {
                    lists && lists.length > 0 ? lists.map((list, key) =>
                            <div key={key}>
                                <h5 className='bolder pl-3' style={{
                                    color: '#ff5b1d',
                                    marginBottom: '0.7rem',
                                    marginTop: '1.5rem'
                                }}>{list.school_shift.name}</h5>
                                {
                                    list.times.map((time, key) => {
                                        return time.length > 1
                                            ?
                                            <div key={key} className='m-portlet br-12' style={{marginBottom: '0.5rem'}}>
                                                <div className='m-portlet__body' style={{
                                                    position: 'relative'
                                                }}>
                                                    <div className='row'>
                                                        <div className='col-md-3'>
                                                            <div className='row'>
                                                                <div className="col text-uppercase bolder pl-4" style={{
                                                                    color: '#696e92',
                                                                    fontSize: 12
                                                                }}>{translations(locale).period}</div>
                                                                <div className="col text-uppercase bolder pl-4" style={{
                                                                    color: '#696e92',
                                                                    fontSize: 12
                                                                }}>{translations(locale).class_name}</div>
                                                            </div>
                                                            <div className='row py-4'>
                                                                <div className="col">
                                                                    {
                                                                        time.map((x, key) =>
                                                                            <span key={key}
                                                                                    className='d-block py-1'>{x.time}</span>
                                                                        )
                                                                    }
                                                                </div>
                                                                <div className="col">
                                                                    <span>{time[0].subject}</span>
                                                                    <span
                                                                        className='d-block bolder'>{time[0].group}</span>
                                                                    <span
                                                                        onClick={() => _handlerClassClick(time[0].group_id)}
                                                                        className='underline'>
                                                                    {
                                                                        time[0].classes.map((x, i) =>
                                                                            time[0].classes.length - 1 != i ? x + ', ' : x
                                                                        )
                                                                    }
                                                                </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className='col-md-1'/>
                                                        <div className='col-md-8'>
                                                            <div className='row h-100' style={{gap: 4}}>
                                                                <div className='col border br-08 text-center p-4'
                                                                        style={{borderColor: '#dfe2ea', width: 100}}>
                                                                    <p className="text-uppercase bolder" style={{
                                                                        color: '#696e92',
                                                                        fontSize: 12
                                                                    }}>{translations(locale).attendance.title}</p>
                                                                    <div style={{
                                                                        display: 'grid',
                                                                        gap: 5,
                                                                        gridTemplateColumns: 'max-content max-content',
                                                                        justifyContent: 'center'
                                                                    }}>
                                                                        {
                                                                            time.map((x, key) =>
                                                                                <button
                                                                                    key={key}
                                                                                    disabled={!time[0].groupApproved}
                                                                                    type='button'
                                                                                    onClick={() => _handlerAttendanceClick(x.id)}
                                                                                    className={`btn ${x.attendance === -1 ? 'btn-danger' : x.attendance === 0 ? 'teacher-today-btn-grey' : 'teacher-today-btn-success'} m-btn m-btn--icon btn-sm m-btn--icon-only m-btn--pill d-inline-flex align-items-center justify-content-center`}>
                                                                                    {x.attendance === -1 ?
                                                                                        <CloseIcon/> : <CheckIcon/>}
                                                                                </button>
                                                                            )
                                                                        }
                                                                    </div>
                                                                </div>

                                                                <div className='col border br-08 text-center p-4'
                                                                        style={{borderColor: '#dfe2ea'}}>
                                                                    <p className="text-uppercase bolder" style={{
                                                                        color: '#696e92',
                                                                        fontSize: 12
                                                                    }}>{translations(locale).teacherToday.hw_assigned}</p>
                                                                    <button
                                                                        type='button'
                                                                        disabled={!time[0].groupApproved}
                                                                        onClick={() => _handlerHomeworkAssignClick(time[0].id, time[0].homeworkAssign, time[0].schoolShiftId)}
                                                                        className={`btn ${time[0].homeworkAssign === -1 ? 'btn-danger' : time[0].homeworkAssign === 0 ? 'teacher-today-btn-grey' : 'teacher-today-btn-success'} m-btn m-btn--icon btn-sm m-btn--icon-only m-btn--pill d-inline-flex align-items-center justify-content-center`}>
                                                                        {time[0].homeworkAssign === -1 ? <CloseIcon/> :
                                                                            <CheckIcon/>}
                                                                    </button>
                                                                </div>
                                                                <div className='col border br-08 text-center p-4'
                                                                        style={{borderColor: '#dfe2ea'}}>
                                                                    <p className="text-uppercase bolder" style={{
                                                                        color: '#696e92',
                                                                        fontSize: 12
                                                                    }}>{translations(locale).teacherToday.hw_reviewed}</p>
                                                                    <button
                                                                        type='button'
                                                                        disabled={!time[0].groupApproved}
                                                                        onClick={() => _handlerHomeworkClick(time[0].id, time[0].homework, time[0].schoolShiftId)}
                                                                        className={`btn ${time[0].homework === -1 ? 'btn-danger' : time[0].homework === 0 ? 'teacher-today-btn-grey' : 'teacher-today-btn-success'} m-btn m-btn--icon btn-sm m-btn--icon-only m-btn--pill d-inline-flex align-items-center justify-content-center`}>
                                                                        {time[0].homework === -1 ? <CloseIcon/> :
                                                                            <CheckIcon/>}
                                                                    </button>
                                                                </div>
                                                                {
                                                                    hasBehavior &&
                                                                    <div className='col border br-08 text-center p-4'
                                                                            style={{borderColor: '#dfe2ea'}}>
                                                                        <p className="text-uppercase bolder" style={{
                                                                            color: '#696e92',
                                                                            fontSize: 12
                                                                        }}>{translations(locale).teacherToday.behavior}</p>
                                                                        <button
                                                                            type='button'
                                                                            disabled={!time[0].groupApproved}
                                                                            onClick={() => {
                                                                                _handlerBehaviorClick(time[0].id)
                                                                            }}
                                                                            className={`btn ${time[0].behavior === -1 ? 'btn-danger' : time[0].behavior === 0 ? 'teacher-today-btn-grey' : 'teacher-today-btn-success'} m-btn m-btn--icon btn-sm m-btn--icon-only m-btn--pill d-inline-flex align-items-center justify-content-center`}>
                                                                            {time[0].behavior === -1 ? <CloseIcon/> :
                                                                                <CheckIcon/>}
                                                                        </button>
                                                                    </div>
                                                                }
                                                                {/* <div className='col border br-08 text-center p-4' style={{ borderColor: '#dfe2ea' }}>
                                                                <p className="text-uppercase bolder" style={{ color: '#696e92', fontSize: 12 }}>{translations(locale).teacherToday.active}</p>
                                                                <button type='button' className='btn teacher-today-btn-success m-btn m-btn--icon btn-sm m-btn--icon-only m-btn--pill d-inline-flex align-items-center justify-content-center'>
                                                                    <CheckIcon />
                                                                </button>
                                                            </div>
                                                            <div className='col border br-08 text-center p-4' style={{ borderColor: '#dfe2ea' }}>
                                                                <p className="text-uppercase bolder" style={{ color: '#696e92', fontSize: 12 }}>{translations(locale).exam.title}</p>
                                                                <button type='button' className='btn teacher-today-btn-grey m-btn m-btn--icon btn-sm m-btn--icon-only m-btn--pill d-inline-flex align-items-center justify-content-center'>
                                                                    <CheckIcon />
                                                                </button>
                                                            </div> */}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    {
                                                        !time[0].groupApproved && <div style={{
                                                            position: 'absolute',
                                                            top: 0,
                                                            bottom: 0,
                                                            left: 0,
                                                            right: 0,
                                                            backgroundColor: 'rgba(0, 0, 0, 0.6)',
                                                            display: 'flex',
                                                            justifyContent: 'center',
                                                            borderRadius: '12px',
                                                            alignItems: 'center'
                                                        }}>
                                                            <button
                                                                onClick={() => {
                                                                    _handlerApproveStudentClick(time[0]['group_id'])
                                                                }}
                                                                className="btn btn-info m-btn m-btn--pill d-inline-flex align-items-center justify-content-center"
                                                            >
                                                                <CheckCircleOutlineIcon/> <span style={{paddingLeft: 10}}>{translations(locale).group.approveStudents?.toUpperCase()}</span>
                                                            </button>
                                                        </div>
                                                    }
                                                </div>
                                            </div>
                                            :
                                            <div key={key} className='m-portlet br-12' style={{marginBottom: '0.5rem'}}>
                                                <div className='m-portlet__body' style={{
                                                    position: 'relative'
                                                }}>
                                                    <div className='row'>
                                                        <div className='col-md-3'>
                                                            <div className='row'>
                                                                <div className="col text-uppercase bolder pl-4" style={{
                                                                    color: '#696e92',
                                                                    fontSize: 12
                                                                }}>{translations(locale).period}</div>
                                                                <div className="col text-uppercase bolder pl-4" style={{
                                                                    color: '#696e92',
                                                                    fontSize: 12
                                                                }}>{translations(locale).class_name}</div>
                                                            </div>
                                                            <div className='row py-4'>
                                                                <div className="col">
                                                                    <span className='d-block'>{time[0].time}</span>
                                                                </div>
                                                                <div className="col">
                                                                    <span>{time[0].subject}</span>
                                                                    <span
                                                                        className='d-block bolder'>{time[0].group}</span>
                                                                    <span
                                                                        onClick={() => _handlerClassClick(time[0].group_id)}
                                                                        className='underline'>
                                                                    {
                                                                        time[0].classes.map((x, i) =>
                                                                            time[0].classes.length - 1 != i ? x + ', ' : x
                                                                        )
                                                                    }
                                                                </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className='col-md-1'/>
                                                        <div className='col-md-8'>
                                                            <div className='row h-100' style={{gap: 4}}>
                                                                {/* <div className='col border br-08 text-center p-4' style={{ borderColor: '#dfe2ea' }}>
                                                                <p className="text-uppercase bolder" style={{ color: '#696e92', fontSize: 12 }}>{translations(locale).teacherToday.regular}</p>
                                                                <button type='button' className="btn btn-danger m-btn m-btn--icon btn-sm m-btn--icon-only m-btn--pill d-inline-flex align-items-center justify-content-center">
                                                                    <CloseIcon />
                                                                </button>
                                                            </div> */}
                                                                {/* <div className='col border br-08 text-center p-4' style={{ borderColor: '#dfe2ea' }}>
                                                                <p className="text-uppercase bolder" style={{ color: '#696e92', fontSize: 12 }}>{translations(locale).exam.subject}</p>
                                                                <button
                                                                    type='button'
                                                                    onClick={() => _handlerOnlineLessonClick(time[0].id, time[0].online_lesson)}
                                                                    className={`btn ${time[0].online_lesson === -1 ? 'btn-danger' : time[0].online_lesson === 0 ? 'teacher-today-btn-grey' : 'teacher-today-btn-success'} m-btn m-btn--icon btn-sm m-btn--icon-only m-btn--pill d-inline-flex align-items-center justify-content-center`}>
                                                                    {time[0].online_lesson === -1 ? <CloseIcon /> : <CheckIcon />}
                                                                </button>
                                                            </div> */}
                                                                <div className='col border br-08 text-center p-4'
                                                                        style={{borderColor: '#dfe2ea', width: 100}}>
                                                                    <p className="text-uppercase bolder" style={{
                                                                        color: '#696e92',
                                                                        fontSize: 12
                                                                    }}>{translations(locale).attendance.title}</p>
                                                                    <button
                                                                        type='button'
                                                                        disabled={!time[0].groupApproved}
                                                                        onClick={() => _handlerAttendanceClick(time[0].id)}
                                                                        className={`btn ${time[0].attendance === -1 ? 'btn-danger' : time[0].attendance === 0 ? 'teacher-today-btn-grey' : 'teacher-today-btn-success'} m-btn m-btn--icon btn-sm m-btn--icon-only m-btn--pill d-inline-flex align-items-center justify-content-center`}>
                                                                        {time[0].attendance === -1 ? <CloseIcon/> :
                                                                            <CheckIcon/>}
                                                                    </button>
                                                                </div>
                                                                <div className='col border br-08 text-center p-4'
                                                                        style={{borderColor: '#dfe2ea'}}>
                                                                    <p className="text-uppercase bolder" style={{
                                                                        color: '#696e92',
                                                                        fontSize: 12
                                                                    }}>{translations(locale).teacherToday.hw_assigned}</p>
                                                                    <button
                                                                        type='button'
                                                                        disabled={!time[0].groupApproved}
                                                                        onClick={() => _handlerHomeworkAssignClick(time[0].id, time[0].homeworkAssign, time[0].schoolShiftId)}
                                                                        className={`btn ${time[0].homeworkAssign === -1 ? 'btn-danger' : time[0].homeworkAssign === 0 ? 'teacher-today-btn-grey' : 'teacher-today-btn-success'} m-btn m-btn--icon btn-sm m-btn--icon-only m-btn--pill d-inline-flex align-items-center justify-content-center`}>
                                                                        {time[0].homeworkAssign === -1 ? <CloseIcon/> :
                                                                            <CheckIcon/>}
                                                                    </button>
                                                                </div>
                                                                <div className='col border br-08 text-center p-4'
                                                                        style={{borderColor: '#dfe2ea'}}>
                                                                    <p className="text-uppercase bolder" style={{
                                                                        color: '#696e92',
                                                                        fontSize: 12
                                                                    }}>{translations(locale).teacherToday.hw_reviewed}</p>
                                                                    <button
                                                                        type='button'
                                                                        disabled={!time[0].groupApproved}
                                                                        onClick={() => _handlerHomeworkClick(time[0].id, time[0].homework, time[0].schoolShiftId)}
                                                                        className={`btn ${time[0].homework === -1 ? 'btn-danger' : time[0].homework === 0 ? 'teacher-today-btn-grey' : 'teacher-today-btn-success'} m-btn m-btn--icon btn-sm m-btn--icon-only m-btn--pill d-inline-flex align-items-center justify-content-center`}>
                                                                        {time[0].homework === -1 ? <CloseIcon/> :
                                                                            <CheckIcon/>}
                                                                    </button>
                                                                </div>
                                                                {
                                                                    hasBehavior &&
                                                                    <div className='col border br-08 text-center p-4'
                                                                            style={{borderColor: '#dfe2ea'}}>
                                                                        <p className="text-uppercase bolder" style={{
                                                                            color: '#696e92',
                                                                            fontSize: 12
                                                                        }}>{translations(locale).teacherToday.behavior}</p>
                                                                        <button
                                                                            type='button'
                                                                            disabled={!time[0].groupApproved}
                                                                            onClick={() => {
                                                                                _handlerBehaviorClick(time[0].id)
                                                                            }}
                                                                            className={`btn ${time[0].behavior === -1 ? 'btn-danger' : time[0].behavior === 0 ? 'teacher-today-btn-grey' : 'teacher-today-btn-success'} m-btn m-btn--icon btn-sm m-btn--icon-only m-btn--pill d-inline-flex align-items-center justify-content-center`}>
                                                                            {time[0].behavior === -1 ? <CloseIcon/> :
                                                                                <CheckIcon/>}
                                                                        </button>
                                                                    </div>
                                                                }
                                                                {/* <div className='col border br-08 text-center p-4' style={{ borderColor: '#dfe2ea' }}>
                                                                <p className="text-uppercase bolder" style={{ color: '#696e92', fontSize: 12 }}>{translations(locale)?.behavior?.title}</p>
                                                                <button
                                                                    type='button'
                                                                    onClick={() => handleShowBehaviorModal(time[0].id, time[0].homework, time[0].schoolShiftId)}
                                                                    className={`btn ${time[0].behavior === -1 ? 'btn-danger' : time[0].behavior === 0 ? 'teacher-today-btn-grey' : 'teacher-today-btn-success'} m-btn m-btn--icon btn-sm m-btn--icon-only m-btn--pill d-inline-flex align-items-center justify-content-center`}>
                                                                    {time[0].behavior === -1 ? <CloseIcon /> : <CheckIcon />}
                                                                </button>
                                                            </div> */}
                                                                {/* <div className='col border br-08 text-center p-4' style={{ borderColor: '#dfe2ea' }}>
                                                                <p className="text-uppercase bolder" style={{ color: '#696e92', fontSize: 12 }}>{translations(locale).teacherToday.active}</p>
                                                                <button type='button' className='btn teacher-today-btn-success m-btn m-btn--icon btn-sm m-btn--icon-only m-btn--pill d-inline-flex align-items-center justify-content-center'>
                                                                    <CheckIcon />
                                                                </button>
                                                            </div>
                                                            <div className='col border br-08 text-center p-4' style={{ borderColor: '#dfe2ea' }}>
                                                                <p className="text-uppercase bolder" style={{ color: '#696e92', fontSize: 12 }}>{translations(locale).exam.title}</p>
                                                                <button type='button' className='btn teacher-today-btn-grey m-btn m-btn--icon btn-sm m-btn--icon-only m-btn--pill d-inline-flex align-items-center justify-content-center'>
                                                                    <CheckIcon />
                                                                </button>
                                                            </div> */}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {
                                                        !time[0].groupApproved && <div style={{
                                                            position: 'absolute',
                                                            top: 0,
                                                            bottom: 0,
                                                            left: 0,
                                                            right: 0,
                                                            backgroundColor: 'rgba(0, 0, 0, 0.6)',
                                                            display: 'flex',
                                                            justifyContent: 'center',
                                                            borderRadius: '12px',
                                                            alignItems: 'center'
                                                        }}>
                                                            <button
                                                                onClick={() => {
                                                                    _handlerApproveStudentClick(time[0]['group_id'])
                                                                }}
                                                                className="btn btn-info m-btn m-btn--pill d-inline-flex align-items-center justify-content-center"
                                                            >
                                                                <CheckCircleOutlineIcon/> <span style={{paddingLeft: 10}}>{translations(locale).group.approveStudents?.toUpperCase()}</span>
                                                            </button>
                                                        </div>
                                                    }
                                                </div>
                                            </div>
                                    })
                                }
                            </div>
                        ) :
                        <div className='m-portlet br-12'>
                            <div className='m-portlet__body text-center'>
                                <span>{translations(locale).timetable?.empty_timetable}</span>
                            </div>
                        </div>
                }
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
                size={'xxl'}
                dimmer={'blurring'}
                show={activeModal}
                onHide={closeModal}
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton style={{padding: '1rem'}}>
                    <Modal.Title className="modal-title d-flex flex-row justify-content-between w-100">
                        {modalTitle}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {
                        mainModalMessage
                            ?
                            messageSuccess === true
                                ?
                                <Message
                                    success={true}
                                >
                                    {mainModalMessage}
                                </Message>
                                :
                                <Message
                                    negative={true}
                                >
                                    {mainModalMessage}
                                </Message>
                            : null

                    }
                    {
                        modalAction === 'group'
                        &&
                        <div style={{color: '#575962', padding: '0rem 1rem'}}>
                            <span>{modalGroup.subjectName}</span>
                            <span className='d-block bolder'>{modalGroup.name}</span>
                            <span className='d-block'
                                    style={{textDecoration: 'underline'}}>{modalGroup.classes}</span>
                            <span>{translations(locale).total}: {studentList.length}</span>
                            <DTable
                                config={{
                                    ...studentModalConfig,
                                    excelFileName: `${secureLocalStorage.getItem('selectedSchool')?.text}-${modalGroup.name}-${modalTitle}`
                                }}
                                data={studentList}
                                columns={studentModalColumn}
                                locale={locale}
                            />
                        </div>
                    }
                    {
                        modalAction === 'onlineLesson'
                            ?
                            <div className="myToday-attendance-student-modal-style">
                                <div className="m-portlet br-12">
                                    <div className="m-portlet__body">
                                        <div className="col-12">
                                            <div className="col-5">
                                                <div>{onlineLessonGroup.date || ''}</div>
                                                <div>{onlineLessonGroup.date ? WEEKDAYS_LONG[locale][(new Date(onlineLessonGroup.date)).getDay()] : ''}</div>
                                                <div>{onlineLessonGroup.time || ''}</div>
                                            </div>
                                            <div className="col-7">
                                                <div>{onlineLessonGroup.subjectName || ''}</div>
                                                <div>{onlineLessonGroup.groupName || ''}</div>
                                                <div>{onlineLessonGroup.classes || ''}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {
                                    onlineLessonAction === 1
                                        ?
                                        // online lesson view and edit
                                        <div className="m-portlet br-12">
                                            <div className="m-portlet__body">
                                                <div className="form-group m-form__group row">
                                                    <div className="col-12 displayFlex">
                                                        <label htmlFor="example-number-input"
                                                                className="col-4 col-form-label online-lesson-label m-btn--bolder">
                                                            {
                                                                linkInfo && linkInfo.length > 0
                                                                    ?
                                                                    (linkInfo[0]['type']).toLowerCase() === 'link'
                                                                        ?
                                                                        translations(locale).my.link || null
                                                                        :
                                                                        (linkInfo[0]['type']).toLowerCase() === 'drive'
                                                                            ?
                                                                            translations(locale).my.google_driver || null
                                                                            :
                                                                            (linkInfo[0]['type']).toLowerCase() === 'video'
                                                                                ?
                                                                                translations(locale).my.video || null
                                                                                :
                                                                                null
                                                                    :
                                                                    null
                                                            }
                                                        </label>
                                                    </div>
                                                </div>
                                                <div className="form-group m-form__group row">
                                                    {
                                                        linkInfo && linkInfo.length > 0
                                                            ?
                                                            (linkInfo[0]['type']).toLowerCase() === 'link'
                                                                ?
                                                                // view link area
                                                                <div className="col-12 displayFlex">
                                                                    <label htmlFor="example-number-input"
                                                                            className="col-4 col-form-label online-lesson-label">
                                                                        {translations(locale).my.link || null}
                                                                    </label>
                                                                    <div className="col-8">
                                                                        <button
                                                                            className='link-button-style'
                                                                            onClick={myTodayOnlineLessonLinkClick}
                                                                        >
                                                                            {linkInfo && linkInfo.length > 0 ? linkInfo[0]['path'] : ''}
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                                :
                                                                (linkInfo[0]['type']).toLowerCase() === 'drive'
                                                                    ?
                                                                    // view google drive area
                                                                    <div className="col-12 displayFlex">
                                                                        <label htmlFor="example-number-input"
                                                                                className="col-4 col-form-label online-lesson-label">
                                                                            {translations(locale).my.link || null}
                                                                        </label>
                                                                        <div className="col-8">
                                                                            <button
                                                                                className='link-button-style'
                                                                                onClick={myTodayOnlineLessonLinkClick}
                                                                            >
                                                                                {linkInfo && linkInfo.length > 0 ? linkInfo[0]['pathName'] : ''}
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                    :
                                                                    (linkInfo[0]['type']).toLowerCase() === 'video'
                                                                        ?
                                                                        // view video area
                                                                        linkInfo[0]['status']['isPlayable'] === true
                                                                            ?
                                                                            <div className="col-12 displayFlex">
                                                                                <label
                                                                                    htmlFor="example-number-input"
                                                                                    className="col-4 col-form-label online-lesson-label">
                                                                                    {translations(locale).my.video || null}
                                                                                </label>
                                                                                <div className="col-6">
                                                                                    <iframe
                                                                                        src={getUrl + '/common/vimeo?id=' + linkInfo[0]['videoId']}
                                                                                        style={{
                                                                                            maxWidth: 640,
                                                                                            minWidth: 450,
                                                                                            minHeight: 300,
                                                                                            maxHeight: 360
                                                                                        }}/>
                                                                                </div>
                                                                            </div>
                                                                            :
                                                                            linkInfo[0]['status']['status'] == 'in_progress'
                                                                                ?
                                                                                <div className="col-12 displayFlex">
                                                                                    <label
                                                                                        htmlFor="example-number-input"
                                                                                        className="col-4 col-form-label online-lesson-label">
                                                                                        {translations(locale).status || null}
                                                                                    </label>
                                                                                    <div className="col-8">
                                                                                        <span
                                                                                            className='m-badge m-badge--warning m-badge--wide'>
                                                                                            {translations(locale).my.in_progress || null}
                                                                                        </span>
                                                                                    </div>
                                                                                </div>
                                                                                :
                                                                                <div className="col-12 displayFlex">
                                                                                    <label
                                                                                        htmlFor="example-number-input"
                                                                                        className="col-4 col-form-label online-lesson-label">
                                                                                        {translations(locale).status || null}
                                                                                    </label>
                                                                                    <div className="col-8">
                                                                                        <span
                                                                                            className='m-badge m-badge--danger m-badge--wide'>
                                                                                            {translations(locale).err.error_occurred || null}
                                                                                        </span>
                                                                                    </div>
                                                                                </div>
                                                                        :
                                                                        null
                                                            :
                                                            null
                                                    }
                                                </div>
                                                <div className="form-group m-form__group row">
                                                    <div className="col-12 displayFlex">
                                                        <label htmlFor="example-number-input"
                                                                className="col-4 col-form-label online-lesson-label">
                                                            {translations(locale).description || null}
                                                        </label>
                                                        <div className="col-6">
                                                            {linkInfo && linkInfo.length > 0 ? linkInfo[0]['description'] : ''}
                                                        </div>
                                                        <div className="col-2">
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="m-portlet__foot">
                                                <div className="row align-items-center">
                                                    <div className="col-lg-12">
                                                        <button
                                                            onClick={onlineLessonDeleteButtonHandler}
                                                            className="btn btn-outline-danger m-btn m-btn--pill m-btn m-btn--custom"
                                                        >
                                                            {translations(locale).delete.toUpperCase()}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        :
                                        // online lesson create
                                        <div className="m-portlet br-12">
                                            <div className="m-portlet__body myToday-online-lesson-modal-style">
                                                <Tab
                                                    id={noneOrBlock === 'none' ? 'online-display-none' : 'online-display-block'}
                                                    onTabChange={_onlineLessonTabChange}
                                                    activeIndex={onlineLessonTabActiveIndex}
                                                    menu={{attached: false}}
                                                    panes={[
                                                        {
                                                            menuItem: translations(locale).my.link,
                                                            menuName: 'link',
                                                            render: () => <Tab.Pane>
                                                                {
                                                                    <div>
                                                                        {onlineLessonLinkTabBodyRender()}
                                                                    </div>
                                                                }
                                                            </Tab.Pane>
                                                        },
                                                        {
                                                            menuItem: translations(locale).my.google_driver,
                                                            menuName: 'drive',
                                                            render: () => <Tab.Pane>
                                                                {
                                                                    <div
                                                                        className="myToday-homework-student-modal-style">
                                                                        {onlineLessonGoogleDriverTabBodyRender()}
                                                                    </div>
                                                                }
                                                            </Tab.Pane>
                                                        },
                                                        {
                                                            menuItem: translations(locale).my.upload_video,
                                                            menuName: 'video',
                                                            render: () => <Tab.Pane>
                                                                {
                                                                    <div
                                                                        className="myToday-homework-student-modal-style">
                                                                        {onlineLessonVideoBodyTabRender()}
                                                                    </div>
                                                                }
                                                            </Tab.Pane>
                                                        },
                                                    ]}
                                                />
                                            </div>
                                        </div>
                                }


                            </div>
                            : null
                    }
                    {
                        modalAction === 'attendance'
                        &&
                        <>
                            <div style={{fontSize: '1.2rem'}} className='mb-5'>
                                <div className='row'>
                                    <div className="col text-right bolder"
                                            style={{color: '#868aa8'}}>{attendanceGroup.date}</div>
                                    <div className="col"
                                            style={{color: '#575962'}}>{attendanceGroup.subject}</div>
                                </div>
                                <div className='row'>
                                    <div className="col text-right bolder"
                                            style={{color: '#868aa8'}}>{attendanceGroup.date ? WEEKDAYS_LONG[locale][(new Date(attendanceGroup.date)).getDay()] : ''}</div>
                                    <div className="col"
                                            style={{color: '#575962'}}>{attendanceGroup.group}</div>
                                </div>
                                <div className='row'>
                                    <div className="col text-right bolder"
                                            style={{color: '#868aa8'}}>{attendanceGroup.time}</div>
                                    <div className="col" style={{
                                        color: '#575962',
                                        textDecoration: 'underline'
                                    }}>{attendanceGroup.classes}</div>
                                </div>
                                {
                                    attendanceCheckable &&
                                    <div className='row mt-3'>
                                        <div className="col text-right bolder" style={{color: '#868aa8'}}></div>
                                        <div className="col" style={{color: '#575962'}}>
                                            <Checkbox
                                                label={translations(locale)?.attendance?.checkable_description}
                                                onChange={(e, data) => enableAttendanceCheck(e, data)}
                                                checked={attendanceCheckEnabled}
                                                className='p-2'
                                            />
                                        </div>
                                    </div>
                                }
                            </div>
                            {
                                attendanceAble && attendanceReport && attendanceReport.length > 0
                                &&
                                <div className='container-fluid mb-5'>
                                    <div className="row text-white" style={{gap: 20}}>
                                        {
                                            attendanceReport?.map((el, key) => (
                                                <div className='col br-06 p-3' key={key} style={{
                                                    backgroundColor: el.color,
                                                    boxShadow: '1px 1px 15px 0 rgba(87, 89, 98, 0.3)'
                                                }}>
                                                    <div className="row">
                                                        <div
                                                            className='col-6 d-flex flex-column justify-content-between'>
                                                            <h5>{el.name}</h5>
                                                            <h5 className='bolder'
                                                                style={{fontFamily: 'MulishBlack'}}>{el.percentage}%</h5>
                                                        </div>
                                                        <div className='col-6 text-right'>
                                                            <span className='bolder text-right' style={{
                                                                fontSize: '3.5rem',
                                                                fontFamily: 'MulishBlack'
                                                            }}>{el.studentNumber}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        }
                                    </div>
                                </div>
                            }
                            {
                                attendanceStudentList && attendanceStudentList.length > 0
                                &&
                                <>
                                    <DTable
                                        config={attendanceConfig}
                                        data={attendanceStudentList}
                                        columns={attendanceColumns}
                                        locale={locale}
                                        checkable={attendanceCheckEnabled}
                                        onCheckable={onAttendanceRowChecked}
                                        onLeftButtonClick={_sendAttendance}
                                    />
                                </>
                            }
                        </>
                    }
                    {
                        modalAction === 'homework'
                            ?
                            <>
                                {homeworkTabHeaderRender()}
                                <div
                                    className={` ${homeworkTabActiveIndex === 0 && inputViewOrEdit && inputViewOrEdit === 'view' && 'm-portlet br-12'}`}>
                                    <div className='m-portlet__body myTimetable-addNewSubjectStyle'>
                                        {
                                            !editing &&
                                            <Tab
                                                onTabChange={_homeworkTabChange}
                                                activeIndex={homeworkTabActiveIndex}
                                                menu={{attached: false}}
                                                panes={[
                                                    {
                                                        menuItem: translations(locale).teacherToday.hw_review.toUpperCase(),
                                                        menuName: HOMEWORK_TAB_PANES[homeworkTabActiveIndex],
                                                    },
                                                    {
                                                        menuItem: translations(locale).teacherToday.hw_assign.toUpperCase(),
                                                        menuName: HOMEWORK_TAB_PANES[homeworkTabActiveIndex],
                                                    },
                                                ]}
                                            />
                                        }
                                        {
                                            homeworkTabActiveIndex == 0 ?
                                                <Tab.Pane>
                                                    {
                                                        <>
                                                            {homeworkTabBodyRender()}
                                                        </>
                                                    }
                                                </Tab.Pane>
                                                : null
                                        }
                                        {
                                            homeworkTabActiveIndex == 1 ?
                                                <Tab.Pane>
                                                    {
                                                        <>
                                                            {homeworkTabAssignBodyRender()}
                                                        </>
                                                    }
                                                </Tab.Pane>
                                                : null
                                        }
                                    </div>

                                    {
                                        errorHomeworkCheckMessage && <Message
                                            negative={true}
                                        >
                                            {errorHomeworkCheckMessage}
                                        </Message>
                                    }

                                    {
                                        homeworkTabName === 'homework_check'
                                            ?
                                            inputViewOrEdit === 'view'
                                                ?
                                                <div className="m-portlet__foot text-center">
                                                    {homeworkObj && <div className="align-items-center">
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
                                                    </div>
                                                    }
                                                </div>
                                                : null
                                            : null
                                    }
                                </div>
                                {
                                    homeworkObj && homeworkTabName === 'homework_check' && inputViewOrEdit === 'view'
                                    &&
                                    homeworkTabBodyDataTableRender()
                                }
                            </>
                            : null
                    }
                </Modal.Body>
                {
                    inputViewOrEdit === 'edit' && homeworkTabName === 'homework_check'
                    &&
                    <Modal.Footer className='text-center'>
                        <button
                            type="button"
                            onClick={homeworkHandlerBackButton}
                            className="btn m-btn--pill btn-outline-metal m-btn--wide mr-3 text-uppercase">
                            {translations(locale).close}
                        </button>
                        <button
                            type="button"
                            onClick={homeworkHandlerSaveButton}
                            className="btn m-btn--pill btn-success m-btn--wide text-uppercase">
                            {translations(locale).save}
                        </button>
                    </Modal.Footer>
                }
                {
                    modalAction === 'group'
                        ?
                        <Modal.Footer className='text-center'>
                            <button
                                className="btn m-btn--pill btn-outline-metal m-btn--uppercase"
                                disabled={inactiveModal}
                                onClick={closeModal}>{translations(locale).close || null}
                            </button>
                        </Modal.Footer>
                        :
                        modalAction === 'attendance'
                            ?
                            // <div className="actions modal-footer">
                            //     <div className={"col-12 text-center"}>
                            //         <button
                            //             className="btn m-btn--pill btn-outline-metal m-btn--uppercase margin-right-10"
                            //             disabled={inactiveModal}
                            //             onClick={closeModal}>{translations(locale).close || null}
                            //         </button>
                            //     </div>
                            // </div>
                            <></>
                            : modalAction === 'homework'
                            ?
                            homeworkTabName === 'homework_assign'
                                ?
                                <Modal.Footer className='text-center'>
                                    {!homeworkDisableNew && <div className={"col-12 text-center"}>
                                        <button type="button"
                                                className="btn m-btn--pill btn-outline-metal text-uppercase m-btn--wide mr-3"
                                                onClick={closeModal}
                                        >
                                            {translations(locale).close}
                                        </button>
                                        <button type="button"
                                                className="btn m-btn--pill btn-success m-btn--wide text-uppercase"
                                                onClick={_saveHomeworkAssign}
                                        >
                                            {translations(locale).save}
                                        </button>
                                    </div>
                                    }
                                </Modal.Footer>
                                : null
                            :
                            modalAction === 'onlineLesson'
                                ?
                                onlineLessonAction == 1
                                    ?
                                    <Modal.Footer className='text-center'>
                                        <button
                                            onClick={onlineLessonEditButtonHandler}
                                            className="btn btn-outline-brand m-btn m-btn--pill m-btn m-btn--custom margin-right-10"
                                        >
                                            {translations(locale).edit.toUpperCase()}
                                        </button>
                                        <button
                                            onClick={() => closeModal()}
                                            className="btn m-btn--pill btn-outline-metal m-btn m-btn--custom"
                                        >
                                            {translations(locale).close.toUpperCase() || null}
                                        </button>
                                    </Modal.Footer>
                                    :
                                    <Modal.Footer className='text-center'>
                                        {
                                            linkInfo && linkInfo.length > 0
                                                ?
                                                <button type="button"
                                                        className="btn m-btn--pill btn-warning m-btn--wide bolder"
                                                        onClick={insertFileEditButtonHandler}
                                                >
                                                    {translations(locale).save}
                                                </button>
                                                :
                                                <button type="button"
                                                        className="btn m-btn--pill btn-warning m-btn--wide bolder"
                                                        onClick={_saveOnlineLessonSaveButtonHandler}
                                                >
                                                    {translations(locale).save}
                                                </button>
                                        }
                                    </Modal.Footer>


                                : null
                }
                {
                    showLoaderModal
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
            </Modal>
            <Modal
                size='md'
                dimmer='blurring'
                show={otherAttModal}
                onHide={otherAttCloseModal}
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton style={{padding: '1rem'}}>
                    <Modal.Title className="modal-title d-flex flex-row justify-content-between w-100">
                        {otherAttModalTitle}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body style={{color: '#212529'}}>
                    {
                        otherModalMessage
                            ?
                            <Message
                                negative={true}
                            >
                                {otherModalMessage}
                            </Message>
                            : null
                    }
                    {/*{*/}
                    {/*otherTimetableDescription*/}
                    {/*?*/}
                    {/*<Message*/}
                    {/*>*/}
                    {/*{otherTimetableDescription}*/}
                    {/*</Message>*/}
                    {/*: null*/}
                    {/*}*/}
                    {
                        otherTimeTableList
                        &&
                        <div style={{color: '#575962'}}>
                            <p className='pl-2'>{otherTimetableDescription}</p>
                            {
                                otherTimeTableList.map(function (value, index) {
                                    {
                                        selectedTimeTableIds.find(function (val) {
                                            if (val === value['id']) {
                                                value['checked'] = true;
                                            }
                                        });
                                    }
                                    return (
                                        <div key={'otherTimeTable' + index} className="pl-5 ml-5">
                                            <Checkbox
                                                label={value.time + ' ' + value.subject}
                                                value={value['id']}
                                                onChange={handlerAttCheckbox}
                                                checked={value['checked'] ? value['checked'] : false}
                                                className='p-2'
                                            />
                                        </div>
                                    )
                                })
                            }
                        </div>
                    }
                </Modal.Body>
                <Modal.Footer className='text-center'>
                    <button className="btn m-btn--pill btn-link"
                            disabled={inactiveModal}
                            onClick={otherAttCloseModal}>{translations(locale).back || null}
                    </button>
                    <button
                        className="btn btn-publish m-btn--pill m-btn--uppercase m-btn--wide"
                        disabled={inactiveModal}
                        onClick={_otherAttSubmit}>{translations(locale).send || null}
                    </button>
                </Modal.Footer>
                {
                    showLoaderModal
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
            </Modal>

            {/* <Modal
                size='sm'
                dimmer='blurring'
                show={deleteHomeworkDetailModalShow}
                onHide={_closeDeleteModal}
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                 <Modal.Header closeButton style={{padding: '1rem'}}>
                    <Modal.Title className="modal-title d-flex flex-row justify-content-between w-100">
                        {t('homework.delete_homework_info')}
                    </Modal.Title>
                </Modal.Header>
                <div className="content">
                    {
                        removeMessage
                            ?
                            <Message
                                negative={true}
                            >
                                {removeMessage}
                            </Message>
                            : null
                    }
                    <p>{translations(locale).homework.delete_student_homework || null}?</p>
                    <p>{translations(locale).homework.delete_student_homework_description || null}</p>
                </div>
                <div className="actions modal-footer">
                    <div className='col text-center'>
                        <button className="btn m-btn--pill btn-outline-metal m-btn mr-2"
                                disabled={fetchHomeworkRemove}
                                onClick={_closeDeleteModal}>{translations(locale).cancel || null}
                        </button>
                        <button className="btn m-btn--pill btn-danger m-btn--wide"
                                disabled={fetchHomeworkRemove}
                                onClick={_onDeleteSubmit}>{translations(locale).delete || null}
                        </button>
                    </div>
                </div>
                {
                    showLoaderDeleteModal
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
            </Modal> */}
            {
                deleteHomeworkModalShow &&
                <DeleteHWInfo
                    onClose={_closeHomeworkDeleteModal}
                    onDelete={_onHomeworkDeleteSubmit}
                    disabled={fetchDeleteHomework}
                />
            }
            <Modal
                size='md'
                dimmer='blurring'
                show={fileUploadModal}
                onHide={fileUploadCloseModal}
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton style={{padding: '1rem'}}>
                    <Modal.Title className="modal-title d-flex flex-row justify-content-between w-100">
                        {t('my.attention')}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body style={{color: '#212529'}}>
                    <p>{translations(locale).my.description_text}</p>
                </Modal.Body>
                <Modal.Footer className='text-center'>
                    <div className={"col-12 text-center"}>
                        <button
                            className="btn btn-warning m-btn m-btn--icon m-btn--pill m-btn--uppercase m-btn--bolder"
                            disabled={inactiveModal}
                            style={{paddingLeft: '20px', paddingRight: '20px'}}
                            onClick={fileUploadCloseModal}>OK
                        </button>
                    </div>
                </Modal.Footer>
            </Modal>
            <Modal
                size='xl'
                dimmer='blurring'
                show={studentFileClickModal}
                onHide={_closeStudentFileClickModal}
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton style={{padding: '1rem'}}>
                    <Modal.Title className="modal-title d-flex flex-row justify-content-between w-100">
                        {fileClickModalTitle}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body style={{color: '#212529'}}>
                    <div className="form-group m-form__group row">
                        <div className="col-md-4 col-xs-12">
                            {
                                fileClickStudentInfo['photo']
                                    ?
                                    <img src={fileClickStudentInfo['photo']}
                                            className="img-responsive img-circle" style={{
                                        width: '100px',
                                        height: '100px',
                                        display: 'block',
                                        marginLeft: 'auto',
                                        objectFit: 'cover'
                                    }}/>
                                    :
                                    <img src={'/images/avatar.png'}
                                            className="img-responsive img-circle" style={{
                                        width: '100px',
                                        height: '100px',
                                        display: 'block',
                                        marginLeft: 'auto',
                                        objectFit: 'cover'
                                    }}/>
                            }
                        </div>
                        <div className="col-md-8 col-xs-12">
                            <div className="m-form__group row">
                                <label className="col-md-4 col-xs-12 text-right">
                                    {translations(locale).className || null}:
                                </label>
                                <div className="col-md-8 col-xs-12">
                                    <b>{fileClickStudentInfo['className']}</b>
                                </div>
                            </div>
                            <div className="m-form__group row">
                                <label className="col-md-4 col-xs-12 text-right">
                                    {translations(locale).student.student_code || null}
                                </label>
                                <div className="col-md-8 col-xs-12 ">
                                    <b>{fileClickStudentInfo['studentCode']}</b>
                                </div>
                            </div>
                            <div className="m-form__group row">
                                <label className="col-md-4 col-xs-12 text-right">
                                    {translations(locale).student.last_name || null}:
                                </label>
                                <div className="col-md-8 col-xs-12 ">
                                    <b>{fileClickStudentInfo['lastName']}</b>
                                </div>
                            </div>
                            <div className="m-form__group row">
                                <label className="col-md-4 col-xs-12 text-right">
                                    {translations(locale).student.first_name || null}:
                                </label>
                                <div className="col-md-8 col-xs-12">
                                    <b>{fileClickStudentInfo['firstName']}</b>
                                </div>
                            </div>
                            <div className="m-form__group row">
                                <label className="col-md-4 col-xs-12 text-right">
                                    {translations(locale).homeworkReport.homework || null}
                                </label>
                                <div className="col-md-8 col-xs-12 ">
                                    <div
                                        dangerouslySetInnerHTML={{__html: htmlDecode(fileClickHomeworkInfo['description'])}}
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
                                    <b>{fileClickHomeworkInfo['score']}</b>
                                </div>
                            </div>
                            <div className="m-form__group row">
                                <label className="col-md-4 col-xs-12 text-right">
                                    {translations(locale).homework.file || null}
                                </label>
                                <div className="col-md-8 col-xs-12 ">
                                    {
                                        fileClickHomeworkInfo['files'] && fileClickHomeworkInfo['files'].length > 0
                                            ?
                                            fileClickHomeworkInfo['files'].map(function (value, index) {
                                                return (
                                                    <div key={'modalFiles_' + index}
                                                            className="underline homeworkReportFilesLineHeight"
                                                            onClick={() => _showFile(value['path'])}>
                                                        <b style={{wordWrap: 'break-word'}}>{value['fileName']}</b><br/>
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
                            <DataTable
                                className="table table-bordered selectable"
                                config={fileClickConfig}
                                records={fileClickDetails}
                                columns={fileClickColumns}
                                locale={locale}
                                tdClick={fileClickTdClickHandler}
                            />

                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer className='text-center'>
                    <button className="btn m-btn--pill btn-outline-metal m-btn m-btn--custom"
                            onClick={_closeStudentFileClickModal}>{translations(locale).close || null}
                    </button>
                </Modal.Footer>
                {
                    showLoaderModal
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
            </Modal>
            <Modal
                size='xl'
                dimmer='blurring'
                show={fileEditModal}
                onHide={_closeFileEditModal}
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton style={{padding: '1rem'}}>
                    <Modal.Title className="modal-title d-flex flex-row justify-content-between w-100">
                        {fileClickModalTitle}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="content my-homework-file-submit-modal-style" style={{color: '#212529'}}>
                    {
                        fileEditData
                            ?
                            <div className="col-12"
                                    style={{height: fileEditData[1] + 250, overflow: 'auto'}}>
                                <ImageEditor
                                    id={'canvasTest'}
                                    ref={canvasReference}
                                    includeUI={{
                                        loadImage: {
                                            path: '/uploads/g_file/' + fileEditData['file_id'],
                                            name: 'SampleImage'
                                        },
                                        locale: locale_mn,
                                        theme: myTheme,
                                        menu: ['draw', 'shape', 'text'],
                                        initMenu: 'filter',
                                        uiSize: {
                                            width: '100%',
                                            height: '100%',
                                        },
                                        menuBarPosition: 'bottom',
                                    }}
                                    cssMaxWidth={fileEditData[0]}
                                    cssMaxHeight={fileEditData[1]}
                                    selectionStyle={{
                                        cornerSize: 20,
                                        rotatingPointOffset: 70
                                    }}
                                    usageStatistics={true}
                                />
                            </div>
                            : null
                    }
                </Modal.Body>
                <Modal.Footer className='text-center'>
                    <button
                        className="btn m-btn--pill btn-outline-metal m-btn m-btn--custom margin-right-5"
                        onClick={_closeFileEditModal}>{translations(locale).close || null}
                    </button>

                    <button type="button"
                            className="btn m-btn--pill btn-warning m-btn--wide bolder"
                            onClick={_onlineLessonFileEditSaveButtonHandler}
                    >
                        {translations(locale).save || 'Хадгалах'}
                    </button>
                </Modal.Footer>
                {
                    showLoaderModal
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
            </Modal>
            {
                showBehaviorModal &&
                <BehaviorModal
                    props={behaviorModalParam}
                    onClose={() => {
                        setShowBehaviorModal(false)
                        setBehaviorModalParam(null)
                    }}
                    onSubmit={submitBehavior}
                />
            }

            {
                showApproveStudentModal &&
                <ApproveStudentModal
                    props={approveStudentModalParam}
                    onClose={() => {
                        setShowApproveStudentModal(false)
                        setApproveStudentModalParam(null)
                    }}
                    onSubmit={submitApproveStudent}
                />
            }
        </div>
    )
}

export default index