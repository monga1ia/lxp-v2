import message from 'modules/message'
import {Tab} from 'semantic-ui-react'
import {Col, Row, Modal} from 'react-bootstrap'
import React, {useEffect, useState, useRef} from 'react'
import CloseIcon from '@mui/icons-material/Close'
import secureLocalStorage from 'react-secure-storage'
import {translations} from 'utils/translations'
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
// import {fetchRequest} from 'utils/fetchRequest'
import {NDropdown as Dropdown} from 'widgets/Dropdown'
// import {
//     teacherTodayApproveStudent,
//     teacherTodayApproveStudentSubmit,
//     teacherTodayApproveStudentRemove,
//     teacherTodayApproveStudentSave
// } from 'Utilities/url'
import DTable from 'modules/DataTable/DTable'
import DeleteModal from "utils/deleteModal";
import { useTranslation } from 'react-i18next'

const locale = secureLocalStorage?.getItem('selectedLang') || 'mn'

const approveStudents = ({onClose, onSubmit, props}) => {

    const { t } = useTranslation()

    const [loading, setLoading] = useState(false)
    const [initLoading, setInitLoading] = useState(false)
    const [deleteLoading, setDeleteLoading] = useState(false)

    const [name, setName] = useState('')
    const [classes, setClasses] = useState([])
    const [selectedClassId, setSelectedClassId] = useState(null)
    const [students, setStudents] = useState([{id: "1656", studentId: "1656", avatar: null, code: "26582", lastName: "Ганбаатар"}])
    const [initStudents, setInitStudents] = useState([])
    const [initClasses, setInitClasses] = useState([])
    const [initSelectedClassId, setInitSelectedClassId] = useState(null)

    const [showInitModal, setShowInitModal] = useState(false)
    const [initModalType, setInitModalType] = useState(null)

    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [deleteModalParam, setDeleteModalParam] = useState(null)
    const [deleteModalType, setDeleteModalType] = useState(null)

    const [tmpRemoveClasses, setTmpRemoveClasses] = useState([])
    const [tmpRemoveStudents, setTmpRemoveStudents] = useState([])

    const defaultColumns = [
        {
            dataField: 'avatar',
            text: translations(locale)?.photo,
            sort: true,
            align: 'center',
            formatter: (cell) =>
                <img
                    className='img-responsive img-circle'
                    src={cell || '/img/profile/avatar.png'}
                    width={40} height={40} alt='img'
                    onError={(e) => {
                        e.target.onError = null
                        e.target.src = '/img/profile/avatar.png'
                    }}
                />
        },
        {
            dataField: 'code',
            text: translations(locale)?.studentCode,
            sort: true,

        },
        {
            dataField: 'lastName',
            text: translations(locale)?.studentLastName,
            sort: true,
        },
        {
            dataField: 'firstName',
            text: translations(locale)?.studentFirstName,
            sort: true,
        }
    ]
    const [columns, setColumns] = useState([])

    const config = {
        showAllData: true,
        showPagination: false,
        showFilter: true,
        showLeftButton: true,
        leftButtonClassName: 'btn btn-info m-btn m-btn--pill d-inline-flex align-items-center justify-content-center',
        leftButtonStyle: {
            padding: '0.3rem 1rem',
            fontFamily: 'PinnacleRegular !important'
        },
        leftButtonIcon: <AddCircleOutlineOutlinedIcon/>,
        leftButtonText: translations(locale).group.addStudent
    }

    const initStudentConfig = {
        showAllData: true,
        showPagination: false,
        showFilter: true
    }

    const initStudentColumn = [
        {
            dataField: 'avatar',
            text: translations(locale)?.photo,
            sort: true,
            align: 'center',
            formatter: (cell) =>
                <img
                    className='img-responsive img-circle'
                    src={cell || '/img/profile/avatar.png'}
                    width={40} height={40} alt='img'
                    onError={(e) => {
                        e.target.onError = null
                        e.target.src = '/img/profile/avatar.png'
                    }}
                />
        },
        {
            dataField: 'code',
            text: translations(locale)?.studentCode,
            sort: true,

        },
        {
            dataField: 'lastName',
            text: translations(locale)?.studentLastName,
            sort: true,
        },
        {
            dataField: 'firstName',
            text: translations(locale)?.studentFirstName,
            sort: true,
        }
    ]

    useEffect(() => {
        setName(props?.name)
        setClasses(props?.classes || [])

        if (!props?.isClass) {
            setColumns([...defaultColumns, ...[
                {
                    dataField: 'action',
                    text: '',
                    sort: false,
                    formatter: (cell, row) => <button
                        className={"btn btn-danger btn-sm m-btn m-btn--icon m-btn--icon-only"}
                        onClick={() => {
                            setDeleteModalParam(row?.id)
                            setDeleteModalType("STUDENT")
                            setShowDeleteModal(true)
                        }}
                    >
                        <i className="la la-remove"/>
                    </button>
                }]])
        } else {
            setColumns(defaultColumns)
        }

        if (props?.classes?.length === 1) {
            setSelectedClassId(props?.classes[0]?.classId)
            loadData({
                group: props?.id,
                class: props?.classes[0]?.classId
            })
        }
    }, [props])

    const loadData = (params = {}) => {
        setShowInitModal(true)
        console.log('loadData')
        // setLoading(true)
        // fetchRequest(teacherTodayApproveStudent, 'POST', params)
        //     .then((res) => {
        //         if (res.success) {
        //             if (params?.initModal) {
        //                 if (params?.initDataType) {
        //                     if (params?.initDataType === 'STUDENT') {
        //                         const resStudents = res?.data?.students || [];
        //                         let initStudentList = [];
        //                         const selectedClassRow = classes?.find(obj => obj?.classId === params?.class)

        //                         if (selectedClassRow && selectedClassRow.students) {
        //                             if (resStudents?.length > 0) {
        //                                 for (let st = 0; st < resStudents?.length; st++) {
        //                                     const studentObj = resStudents[st];
        //                                     const existing = selectedClassRow?.students?.find(obj => obj?.id === studentObj?.id);
        //                                     if (!existing) {
        //                                         initStudentList.push(studentObj)
        //                                     }
        //                                 }
        //                             }
        //                         } else {
        //                             initStudentList = resStudents;
        //                         }

        //                         if ((tmpRemoveStudents || [])?.length > 0) {
        //                             const tmpRemoveClassStudents = tmpRemoveStudents.filter(obj => {
        //                                 return obj.classId === params?.class
        //                             })
        //                             initStudentList = [...initStudentList, ...tmpRemoveClassStudents]
        //                         }

        //                         setInitStudents(initStudentList);
        //                     } else {
        //                         const resClasses = res?.data?.nonUsedClasses || [];
        //                         let initClassList = [];
        //                         if (resClasses?.length > 0) {
        //                             if (classes && classes?.length > 0) {
        //                                 for (let c = 0; c < resClasses?.length; c++) {
        //                                     const classObj = resClasses[c];
        //                                     const existing = classes?.find(obj => obj?.classId === classObj?.id);
        //                                     if (!existing) {
        //                                         initClassList.push({
        //                                             classId: classObj?.id,
        //                                             className: classObj?.class,
        //                                             gradeId: classObj?.gradeId,
        //                                             gradeCode: classObj?.gradeCode,
        //                                             gradeName: classObj?.gradeName,
        //                                             studentCount: 0
        //                                         })
        //                                     }
        //                                 }
        //                             } else {
        //                                 initClassList = resClasses?.map(obj => {
        //                                     return {
        //                                         classId: obj?.id,
        //                                         className: obj?.class,
        //                                         gradeId: obj?.gradeId,
        //                                         gradeCode: obj?.gradeCode,
        //                                         gradeName: obj?.gradeName,
        //                                         studentCount: 0
        //                                     }
        //                                 });
        //                             }
        //                         }
        //                         if ((tmpRemoveClasses || [])?.length > 0) {
        //                             initClassList = [...initClassList, ...tmpRemoveClasses]
        //                         }
        //                         setInitClasses(initClassList);
        //                     }
        //                 } else {
        //                     setInitStudents(res?.data?.students);
        //                     setInitClasses(res?.data?.nonUsedClasses?.map(obj => {
        //                         return {
        //                             classId: obj?.id,
        //                             className: obj?.class,
        //                             gradeId: obj?.gradeId,
        //                             gradeCode: obj?.gradeCode,
        //                             gradeName: obj?.gradeName,
        //                             studentCount: 0
        //                         }
        //                     }));
        //                 }
        //                 setShowInitModal(true)
        //             } else {
        //                 setStudents(res?.data?.students)
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

    const handleSubmit = (approve = 0) => {
        console.log("handleSubmit")
        // const params = {
        //     class: selectedClassId,
        //     group: props?.id,
        //     classes: JSON.stringify(classes),
        //     name,
        //     approve
        // }
        // setLoading(true)
        // fetchRequest(teacherTodayApproveStudentSave, 'POST', params)
        //     .then((res) => {
        //         if (res.success) {
        //             onSubmit()
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

    const onClassSelect = (classId = null) => {
        setSelectedClassId(classId)

        const selectedClassRow = classes?.find(obj => obj?.classId === classId)
        let studentList = []
        if (selectedClassRow && selectedClassRow?.students) {
            studentList = selectedClassRow?.students || []
        }
        setStudents(studentList)
    }

    const onAddClass = () => {
        setInitModalType('CLASS')
        loadData({
            group: props?.id,
            class: selectedClassId,
            initModal: true,
            initDataType: 'CLASS'
        })
    }

    const onAddStudent = () => {
        // if (selectedClassId) {
            setInitModalType('STUDENT')
            loadData({
                group: props?.id,
                class: selectedClassId,
                nonGroup: 1,
                initModal: true,
                initDataType: 'STUDENT'
            })
        // } else {
        //     message(translations(locale)?.err?.select_class)
        // }
    }

    const onCheckedChange = (key, rowIndex, checked, id) => {
        const data = [...initStudents]
        if (key === 'allCheck') {
            for (let d = 0; d < data?.length; d++) {
                data[d].checkable = checked
            }
        } else if (key === 'row') {
            for (let d = 0; d < data?.length; d++) {
                if (data[d].id === id) {
                    data[d].checkable = checked
                    break;
                }
            }
        }
        setInitStudents(data)
    }

    const submitInitData = () => {
        if (initModalType === 'STUDENT') {
            const selectedStudentList = initStudents.filter(obj => {
                return obj?.checkable === true;
            })

            if (selectedStudentList && selectedStudentList?.length > 0) {
                const cloneData = [...classes]
                let selectedClassStudentList = []
                for (let c = 0; c < cloneData?.length; c++) {
                    if (cloneData[c]?.classId === selectedClassId) {
                        cloneData[c].students = [...(cloneData[c].students || []), ...selectedStudentList];
                        selectedClassStudentList = cloneData[c].students;
                        cloneData[c].studentCount = (cloneData[c].students || [])?.length;
                        break;
                    }
                }

                setInitStudents([])
                setShowInitModal(false)
                setStudents(selectedClassStudentList)
                setClasses(cloneData)

                // const params = {
                //     class: selectedClassId,
                //     group: props?.id,
                //     type: 'STUDENT',
                //     students: selectedStudentList.map(obj => obj?.id)
                // }
                // setInitLoading(true)
                // fetchRequest(teacherTodayApproveStudentSubmit, 'POST', params)
                //     .then((res) => {
                //         if (res.success) {
                //             setInitStudents([])
                //             setShowInitModal(false)
                //             setClasses(res?.data?.classes)
                //             setStudents(res?.data?.students)
                //         } else {
                //             message(res.data.message)
                //         }
                //         setInitLoading(false)
                //     })
                //     .catch(() => {
                //         message(translations(locale)?.err?.error_occurred)
                //         setInitLoading(false)
                //     })
            } else {
                message(translations(locale)?.err?.select_student)
            }
        } else {
            if (initSelectedClassId) {

                const selectedInitClassObj = initClasses.find(classObj => classObj.classId === initSelectedClassId);
                const cloneData = [...classes]
                cloneData.push({
                    classId: initSelectedClassId,
                    className: selectedInitClassObj?.className,
                    grade: selectedInitClassObj?.gradeId,
                    gradeCode: selectedInitClassObj?.gradeCode,
                    gradeName: selectedInitClassObj?.gradeName,
                    studentCount: 0,
                    students: [],
                    isTmp: true
                })
                setSelectedClassId(initSelectedClassId)
                setStudents([])
                setClasses(cloneData)

                setInitSelectedClassId(null)
                setShowInitModal(false)

                //
                // const params = {
                //     class: selectedClassId,
                //     group: props?.id,
                //     type: 'CLASS',
                //     selectedClass: initSelectedClassId,
                //     selectedClassName: selectedInitClassObj?.class,
                //     selectedClassGrade: selectedInitClassObj?.gradeId,
                //     selectedClassGradeCode: selectedInitClassObj?.gradeCode,
                //     selectedClassGradeName: selectedInitClassObj?.gradeName,
                // }
                // setInitLoading(true)
                // fetchRequest(teacherTodayApproveStudentSubmit, 'POST', params)
                //     .then((res) => {
                //         if (res.success) {
                //             setInitSelectedClassId(null)
                //             setShowInitModal(false)
                //             setClasses(res?.data?.classes)
                //             setStudents(res?.data?.students)
                //         } else {
                //             message(res.data.message)
                //         }
                //         setInitLoading(false)
                //     })
                //     .catch(() => {
                //         message(translations(locale)?.err?.error_occurred)
                //         setInitLoading(false)
                //     })
            } else {
                message(translations(locale)?.err?.select_class)
            }
        }
    }

    const submitRemove = (type = null, refId = null) => {
        if (type === 'STUDENT') {
            const cloneClasses = [...classes]
            const cloneTmpRemoveStudents = [...tmpRemoveStudents];
            let studentList = []
            for (let c = 0; c < cloneClasses?.length; c++) {
                const classObj = cloneClasses[c];
                if (classObj.classId === selectedClassId) {
                    const updateStudentList = [];
                    if (classObj?.students) {
                        for (let st = 0; st < classObj.students?.length; st++) {
                            if (classObj?.students[st]?.id === refId) {
                                cloneTmpRemoveStudents.push(Object.assign(classObj?.students[st], {
                                    classId: classObj.classId
                                }))
                            } else {
                                updateStudentList.push(classObj?.students[st])
                            }
                        }
                    }
                    studentList = updateStudentList;
                    classObj.students = updateStudentList;
                    break;
                }
            }
            setTmpRemoveStudents(cloneTmpRemoveStudents)
            setStudents(studentList)
            setClasses(cloneClasses)

            setDeleteModalParam(null)
            setShowDeleteModal(false)
        } else if (type === 'CLASS') {
            const cloneClasses = [...classes]
            const cloneTmpRemoveClasses = [...tmpRemoveClasses];

            const classList = []
            for (let c = 0; c < cloneClasses?.length; c++) {
                if (cloneClasses[c]?.classId === refId) {
                    cloneTmpRemoveClasses.push(cloneClasses[c])
                } else {
                    classList.push(cloneClasses[c])
                }
            }
            const existingSelectedClass = classList?.find(obj => obj?.classId === selectedClassId);

            if (existingSelectedClass) {
                setStudents(existingSelectedClass?.students || [])
            } else {
                setStudents([])
            }
            setTmpRemoveClasses(cloneTmpRemoveClasses)
            setClasses(classList)
            setDeleteModalParam(null)
            setShowDeleteModal(false)
        }
        // const params = {
        //     class: selectedClassId,
        //     group: props?.id,
        //     type,
        //     id: refId
        // }
        // setDeleteLoading(true)
        // fetchRequest(teacherTodayApproveStudentRemove, 'POST', params)
        //     .then((res) => {
        //         if (res.success) {
        //             setDeleteModalParam(null)
        //             setShowDeleteModal(false)
        //             setClasses(res?.data?.classes)
        //             const existingSelectedClass = res?.data?.classes?.find(obj => obj?.classId === selectedClassId);
        //             if (existingSelectedClass) {
        //                 setStudents(res?.data?.students)
        //             } else {
        //                 setStudents([])
        //             }
        //         } else {
        //             message(res.data.message)
        //         }
        //         setDeleteLoading(false)
        //     })
        //     .catch(() => {
        //         message(translations(locale)?.err?.error_occurred)
        //         setDeleteLoading(false)
        //     })
    }

    const getTotalCount = () => {
        let totalStudentCount = 0;
        classes.map(classObj => {
            totalStudentCount += (classObj?.students || [])?.length;
        })
        return totalStudentCount;
    }

    return (
        <>
            {
                !showInitModal && !showDeleteModal && 
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
                            {t('add')}
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body style={{color: '#212529'}}>
                        <div className="myTimetable-addNewSubjectStyle">
                            <Tab
                                menu={{attached: false}}
                                disabled={true}
                                activeIndex={props?.isClass ? 0 : 1}
                                onTabChange={(e) => {
                                    e.preventDefault();
                                }}
                                panes={[
                                    {
                                        menuItem: translations(locale).timetable.class_student?.toUpperCase(),
                                        menuName: 'class'
                                    },
                                    {
                                        menuItem: translations(locale).timetable.group_student?.toUpperCase(),
                                        menuName: 'group'
                                    },
                                ]}
                            />
                        </div>

                        <Row className='form-group mt-4'>
                            <label className="col-form-label col-md-5 col-sm-12 text-right label-pinnacle-bold">
                                {translations(locale).subject.title || null}
                            </label>
                            <div className="col-md-5 col-sm-12">
                                <input type="text" className="form-control m-input"
                                       placeholder={translations(locale).subject.title || null}
                                       value={props?.subjectName}
                                       disabled={true}
                                       onChange={(e) => {

                                       }}/>
                            </div>
                            <div className="col-md-2">
                            </div>
                        </Row>
                        <Row className='form-group'>
                            <label className="col-form-label col-md-5 col-sm-12 text-right label-pinnacle-bold">
                                {translations(locale).name || null}
                            </label>
                            <div className="col-md-5 col-sm-12">
                                <input type="text" className="form-control m-input"
                                       placeholder={translations(locale).name || null}
                                       value={name}
                                       onChange={(e) => {
                                           setName(e.target?.value)
                                       }}/>
                                <p className={'label-pinnacle-bold mt-2'}>{translations(locale).total || ''}: {getTotalCount()}</p>
                            </div>
                            <div className="col-md-2">
                            </div>
                        </Row>
                        {
                            !props?.isClass && <Row className='form-group'>
                                <Col md={3} xs={4}>
                                    <button
                                        onClick={() => {
                                            onAddClass()
                                        }}
                                        style={{
                                            padding: '0.3rem 1rem',
                                            fontFamily: 'PinnacleRegular !important'
                                        }}
                                        className="btn btn-info m-btn m-btn--pill d-inline-flex align-items-center justify-content-center"
                                    >
                                        <AddCircleOutlineOutlinedIcon/>
                                        <span style={{paddingLeft: 10}}>{translations(locale).group.addClass}</span>
                                    </button>
                                </Col>
                                <Col md={9} xs={8}>
                                </Col>
                            </Row>
                        }
                        <Row className='form-group'>
                            <Col md={3} xs={4}>
                                <div className='m-portlet'>
                                    <div className='m-portlet__body group-class-container'>
                                        {
                                            classes.map(classObj => {
                                                return <div key={'group_class_' + classObj?.classId}
                                                            className={selectedClassId === classObj?.classId ? 'group-class-row active' : 'group-class-row'}>
                                                <span className={'group-class-name'} onClick={() => {
                                                    onClassSelect(classObj?.classId)
                                                }}>{classObj?.className} <span
                                                    className={'group-class-student-count'}>{classObj?.students?.length || 0}</span></span>
                                                    {
                                                        classes?.length > 1 && !props?.isClass && <button
                                                            className={"btn btn-danger m-btn m-btn--icon m-btn--icon-only group-class-action"}
                                                            onClick={() => {
                                                                setDeleteModalParam(classObj?.classId)
                                                                setDeleteModalType('CLASS')
                                                                setShowDeleteModal(true)
                                                            }}
                                                        >
                                                            <i className="la la-remove"/>
                                                        </button>
                                                    }
                                                </div>
                                            })
                                        }
                                    </div>
                                </div>
                            </Col>
                            <Col md={9} xs={8}>
                                <DTable
                                    onLeftButtonClick={onAddStudent}
                                    config={config}
                                    columns={columns}
                                    data={students}
                                    locale={locale}
                                />
                            </Col>
                        </Row>
                    </Modal.Body>
                    <Modal.Footer className='text-center'>
                        <div className='d-flex justify-content-center gap-05'>
                            <button
                                className='btn btn-link m-btn m-btn--custom'
                                onClick={onClose}
                            >
                                {translations(locale)?.back}
                            </button>
                            <button
                                className='btn m-btn--pill btn-success m-btn--wide text-uppercase'
                                onClick={() => handleSubmit(0)}
                            >
                                {translations(locale)?.save}
                            </button>
                            {
                                getTotalCount() > 0 && <button
                                    className='btn m-btn--pill btn-success m-btn--wide text-uppercase'
                                    style={{
                                        backgroundColor: '#3ebfa3'
                                    }}
                                    onClick={() => handleSubmit(1)}
                                >
                                    {translations(locale)?.confirmation}
                                </button>
                            }
                        </div>
                    </Modal.Footer>
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
            }
            {
                showInitModal && 
                // initModalType && 
                <Modal
                    size='xl'
                    dimmer='blurring'
                    show={true}
                    onHide={() => setShowInitModal(false)}
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                >
                    <Modal.Header closeButton style={{padding: '1rem'}}>
                        <Modal.Title className="modal-title d-flex flex-row justify-content-between w-100">
                            {
                                initModalType === 'STUDENT' 
                                ? 
                                translations(locale)?.student?.title 
                                : 
                                (initModalType === 'CLASS' ? 
                                    translations(locale)?.class?.title : 
                                    translations(locale)?.add)
                            }
                        </Modal.Title>
                    </Modal.Header>
                    {
                        initModalType === "CLASS" &&
                        <Modal.Body style={{color: '#212529'}}>
                            <Row className='form-group mt-4'>
                                <label className="col-form-label col-md-5 col-sm-12 text-right label-pinnacle-bold">
                                    {translations(locale).class?.title || null}
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
                                        value={initSelectedClassId}
                                        options={(initClasses || [])?.map(classObj => {
                                            return {
                                                value: classObj?.classId,
                                                text: classObj?.className
                                            }
                                        })}
                                        onChange={(e, data) => {
                                            setInitSelectedClassId(data?.value)
                                        }}
                                    />
                                </div>
                                <div className="col-md-2">
                                </div>
                            </Row>
                        </Modal.Body>
                    }
                    {
                        initModalType === "STUDENT" && 
                        <Modal.Body style={{color: '#212529'}}>
                            <Row className='form-group mt-4'>
                                <label className="col-form-label col-md-5 col-sm-12 text-right label-pinnacle-bold">
                                    {translations(locale).class?.title || null}
                                </label>
                                <div className="col-md-5 col-sm-12">
                                    <input type="text" className="form-control m-input"
                                        placeholder={translations(locale).class?.title || null}
                                        // value={([...initClasses, ...props?.classes])?.find(obj => obj?.classId === selectedClassId)?.className}
                                        disabled={true}
                                        onChange={(e) => {
                                        }}/>
                                </div>
                                <div className="col-md-2">
                                </div>
                            </Row>
                            <DTable
                                config={initStudentConfig}
                                columns={initStudentColumn}
                                data={initStudents}
                                locale={locale}
                                checkable={true}
                                onCheckable={onCheckedChange}
                            />
                        </Modal.Body>
                    }
                    <Modal.Footer className='text-center'>
                        <div className='d-flex justify-content-center gap-05'>
                            <button
                                className='btn btn-link m-btn m-btn--custom'
                                onClick={() => {
                                    setShowInitModal(false)
                                }}
                            >
                                {translations(locale)?.back}
                            </button>
                            <button
                                className='btn m-btn--pill btn-success m-btn--wide text-uppercase'
                                onClick={submitInitData}
                            >
                                {translations(locale)?.select}
                            </button>
                        </div>
                    </Modal.Footer>

                    {
                        initLoading &&
                        <>
                            <div className='blockUI blockOverlay'/>
                            <div className='blockUI blockMsg blockPage'>
                                <div className='m-loader m-loader--brand m-loader--lg'/>
                            </div>
                        </>
                    }
                </Modal>
            }

            {
                showDeleteModal && deleteModalType && 
                <Modal
                    size='sm'
                    dimmer='blurring'
                    show={true}
                    onHide={() => {
                        setDeleteModalParam(null)
                        setShowDeleteModal(false)
                    }}
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                >
                    <Modal.Header closeButton style={{padding: '1rem'}}>
                        <Modal.Title className="modal-title d-flex flex-row justify-content-between w-100">
                            {
                                deleteModalType === 'STUDENT' 
                                ? 
                                translations(locale)?.student?.title
                                : 
                                (deleteModalType === 'CLASS' ? 
                                    translations(locale)?.class?.title : 
                                    translations(locale)?.remove)
                            }
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body style={{color: '#212529'}}>
                        {translations(locale)?.delete_confirmation}
                        <br/>
                        <br/>
                        {translations(locale)?.delete_confirmation_description}
                    </Modal.Body>
                    <Modal.Footer className='text-center'>
                        <div className='d-flex justify-content-center gap-05'>
                            <button
                                className='btn btn-link m-btn m-btn--custom'
                                onClick={() => {
                                    setDeleteModalParam(null)
                                    setShowDeleteModal(false)
                                }}
                            >
                                {translations(locale)?.back}
                            </button>
                            <button
                                className='btn m-btn--pill btn-danger m-btn--wide text-uppercase'
                                onClick={() => {
                                    submitRemove(deleteModalType, deleteModalParam)
                                }}
                            >
                                {translations(locale)?.remove}
                            </button>
                        </div>
                    </Modal.Footer>

                    {
                        deleteLoading &&
                        <>
                            <div className='blockUI blockOverlay'/>
                            <div className='blockUI blockMsg blockPage'>
                                <div className='m-loader m-loader--brand m-loader--lg'/>
                            </div>
                        </>
                    }
                </Modal>
            }
        </>
    )
}

export default approveStudents