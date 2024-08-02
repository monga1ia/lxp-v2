import React, { useState, useRef } from 'react'
import { Modal } from 'react-bootstrap'
import { useTranslation } from "react-i18next";
import { Tab, Checkbox } from 'semantic-ui-react';
import { useSelector } from 'react-redux'
import message from "modules/message";
import AddIcon from '@mui/icons-material/Add';
import { NDropdown as Dropdown } from 'widgets/Dropdown';
import CloseIcon from '@mui/icons-material/Close';
import Forms from 'modules/Form/Forms';
import { fetchRequest } from 'utils/fetchRequest'
import { schoolSubjectTeacher, schoolClassStudents, managerGroupCreate } from 'utils/fetchRequest/Urls'
import secureLocalStorage from 'react-secure-storage';
const locale = secureLocalStorage?.getItem('selectedLang') || 'mn'

const AddModal = ({ onClose, subjectList = [], classList = [] }) => {
    const { t } = useTranslation();
    const formRef = useRef();

    const { selectedSchool } = useSelector(state => state.schoolData);
    const [loading, setLoading] = useState(false)
    const [showModalError, setShowModalError] = useState(false)
    const [addAgain, setAddAgain] = useState(false)
    const [closeWithReload, setCloseWithReload] = useState(false)
    const [updateView, setUpdateView] = useState(false)
    const [groupSubjectId, setGroupSubjectId] = useState(null)
    const [groupTeacherId, setGroupTeacherId] = useState(null)
    const [modalTabIndex, setModalTabIndex] = useState(0)
    const [groupTotalStudentCount, setGroupTotalStudentCount] = useState(0)
    const [groupName, setGroupName] = useState('')
    const [groupTeachers, setGroupTeachers] = useState([])
    const [classSubjectRows, setClassSubjectRows] = useState([
        {
            subject: null,
            classes: [],
            selectedClasses: [],
            teachers: [],
            teacher: null
        }
    ])
    const [groupSubjectRows, setGroupSubjectRows] = useState([{
        class: null,
        students: [],
        selectedStudents: []
    }])

    const onClassSubjectChange = (subjectId, rowIndex) => {
        let subjectRows = [...classSubjectRows];

        const selectedSubject = subjectList.find(obj => obj?.value === subjectId)

        subjectRows[rowIndex]['subject'] = subjectId;
        subjectRows[rowIndex]['classes'] = classList.filter(obj => {
            return selectedSubject?.gradeIds.indexOf(obj?.gradeId) > -1
        });
        subjectRows[rowIndex]['teacher'] = null;
        const params = {
            school: selectedSchool?.id,
            subject: subjectId
        }
        setLoading(true)
        fetchRequest(schoolSubjectTeacher, 'POST', params)
            .then((res) => {
                if (res.success) {
                    subjectRows[rowIndex]['teachers'] = res?.teachers || [];
                    setClassSubjectRows(subjectRows)
                } else {
                    message(res.message)
                }
                setLoading(false)
            })
            .catch(() => {
                message(t('err.error_occurred'))
                setLoading(false)
            })
    };

    const _onTabChange = (e, data) => {
        setModalTabIndex(data.activeIndex)
        setShowModalError(false)
    };

    const addClassSubjectRow = () => {
        setShowModalError(false)
        setClassSubjectRows([...classSubjectRows, {
            subject: null,
            classes: [],
            selectedClasses: [],
            teachers: [],
            teacher: null
        }])
    };

    const removeClassSubjectRow = (index) => {
        if (index != 0) {
            const rows = [...classSubjectRows]
            rows.splice(index, 1)
            setClassSubjectRows(rows)
        }
    }

    const onGroupSubjectChange = (e, data) => {
        const params = {
            school: selectedSchool?.id,
            subject: data?.value
        }
        setGroupSubjectId(data?.value)
        setGroupTeacherId(null)
        setGroupName('')
        setLoading(true)
        fetchRequest(schoolSubjectTeacher, 'POST', params)
            .then((res) => {
                if (res.success) {
                    setGroupTeachers(res?.teachers || [])
                } else {
                    message(res.message)
                }
                setLoading(false)
            })
            .catch((e) => {
                message(t('err.error_occurred'))
                setLoading(false)
            })
    };

    const loadClassStudents = (index, classId = null) => {
        const params = {
            school: selectedSchool?.id,
            class: classId
        }
        const clone = [...groupSubjectRows]
        clone[index].class = classId
        clone[index].students = []
        clone[index].selectedStudents = []

        setLoading(true)
        fetchRequest(schoolClassStudents, 'POST', params)
            .then((res) => {
                if (res.success) {
                    clone[index].students = res?.students;
                    setGroupSubjectRows(clone)

                    setUpdateView(!updateView)
                } else {
                    setGroupSubjectRows(clone)
                    message(res.message)
                }
                setLoading(false)
            })
            .catch((e) => {
                setGroupSubjectRows(clone)
                message(t('err.error_occurred'))
                setLoading(false)
            })
    };

    const onGroupTeacherChange = (e, data) => {
        const subjectName = getSubjects(false)?.find(el => el?.value == groupSubjectId)?.text?.split(' - ')[1]
        const teacherName = data?.options?.find(el => el?.value == data?.value)?.text?.split(' ( ')[0]
        setGroupTeacherId(data.value)
        setGroupName(subjectName + ' | ' + teacherName)
    }

    const addGroupSubjectRow = () => {
        setGroupSubjectRows([...groupSubjectRows, {
            class: null,
            allStudents: [],
            group_student: []
        }])
    }

    const calculateStudentCount = (rows = []) => {
        if (modalTabIndex === 1) {
            let totalStudentCount = 0;
            for (let i = 0; i < rows.length; i++) {
                totalStudentCount = totalStudentCount + rows[i].selectedStudents?.length;
            }
            setGroupTotalStudentCount(totalStudentCount)
        }
    }

    const removeGroupSubjectRow = (index) => {
        const rows = [...groupSubjectRows]
        rows.splice(index, 1)
        calculateStudentCount(rows)
        setGroupSubjectRows(rows)
    }

    const getGroupClasses = (rowClassId = null) => {
        const selectedSubject = subjectList.find(subject => subject.value == groupSubjectId);

        if (selectedSubject && selectedSubject.gradeIds) {
            const selectedClassIds = groupSubjectRows?.filter(obj => obj?.class)?.map(obj => obj?.class)

            return classList.filter(obj => {
                if (selectedClassIds?.length > 0) {
                    return selectedSubject?.gradeIds.indexOf(obj?.gradeId) > -1 && (rowClassId === obj?.id || selectedClassIds?.indexOf(obj?.id) < 0)
                } else {
                    return selectedSubject?.gradeIds.indexOf(obj?.gradeId) > -1
                }
            })?.map(obj => {
                return {
                    value: obj?.value,
                    text: obj?.text
                }
            })
        } else {
            return []
        }
    }

    const getSubjects = (isAll = false, rowSubjectId = null) => {
        let selectedSubjects = []
        if (isAll) {
            selectedSubjects = classSubjectRows?.filter(obj => obj?.subject)?.map(obj => obj?.subject)
        }
        return subjectList.filter(obj => {
            if (selectedSubjects?.length > 0) {
                return obj?.isAll === isAll && (rowSubjectId === obj?.value || selectedSubjects?.indexOf(obj?.value) < 0)
            } else {
                return obj?.isAll === isAll
            }
        })?.map(obj => {
            return {
                value: obj?.value,
                text: obj?.text
            }
        })
    }

    const fields = [
        {
            key: 'curriculum',
            label: t('curriculum.title') + '*',
            value: null,
            type: 'dropdown',
            options: [],
            multiple: false,
            disabled: true,
            errorMessage: t('errorMessage.selectCurriculum'),
            labelStyle: {
                fontFamily: 'PinnacleDemiBold',
                fontSize: 12,
                fontWeight: 800,
                color: '#575962',
            },
        },
        {
            key: 'grade',
            label: t('curriculum.grade') + '*',
            value: null,
            type: 'dropdown',
            options: [],
            required: true,
            multiple: false,
            disabled: true,
            errorMessage: t('errorMessage.selectGrade'),
            labelStyle: {
                fontFamily: 'PinnacleDemiBold',
                fontSize: 12,
                fontWeight: 800,
                color: '#575962',
            },
        },
        {
            key: 'subject',
            label: `${t('menu.curriculumSubject')}*`,
            value: null,
            type: 'dropdown',
            clearable: true,
            searchable: true,
            options: [],
            required: true,
            multiple: false,
            errorMessage: t('errorMessage.selectSubject'),
            labelStyle: {
                fontFamily: 'PinnacleDemiBold',
                fontSize: 12,
                fontWeight: 800,
                color: '#575962',
            },
        },
        {
            key: 'schools',
            label: `${t('menu.school')}*`,
            value: [],
            type: 'dropdown',
            clearable: true,
            searchable: true,
            options: [],
            required: true,
            multiple: true,
            errorMessage: t('errorMessage.selectSchool'),
            labelStyle: {
                fontFamily: 'PinnacleDemiBold',
                fontSize: 12,
                fontWeight: 800,
                color: '#575962',
            },
        },
        {
            key: 'name',
            label: t('menu.groupName') + '*',
            value: '',
            type: 'text',
            required: true,
            errorMessage: t('errorMessage.enterName'),
            labelStyle: {
                fontFamily: 'PinnacleDemiBold',
                fontSize: 12,
                fontWeight: 800,
                color: '#575962',
            },
        },
        {
            key: 'isActive',
            label: t('menu.isActive'),
            value: false,
            type: 'checkbox',
        },
    ];

    const _renderGroup = () => {
        return (
            <>
                <Forms 
                    ref={formRef}
                    fields={fields}
                />
                {
                    <Tab
                        renderActiveOnly
                        menu={{ secondary: true, pointing: true, className: 'primaryColor m-0 h-3' }}
                        panes={[
                            {
                                menuItem: t('studentBookNavs.personal_info'),
                                render: () => <div>1</div>,
                            },
                            {
                                menuItem: t('studentBookNavs.grade'),
                                render: () => <div>2</div>,
                            },
                            {
                                menuItem: t('studentBook.activity'),
                                render: () => <div>3</div>,
                            },
                        ]}
                    />
                }
            </>
        )
    }

    const onClickSubmit = () => {
        let hasError = false;
        let params = {
            school: selectedSchool?.id,
            isAll: modalTabIndex === 0
        }
        if (modalTabIndex === 0) {
            // class group
            const rows = [...classSubjectRows]
            const classParams = []
            for (let r = 0; r < rows?.length; r++) {
                const rowObj = rows[r]
                if (!rowObj.subject) {
                    hasError = true;
                    break;
                }
                if (!rowObj?.selectedClasses || rowObj?.selectedClasses?.length === 0) {
                    hasError = true;
                    break;
                }
                if (!rowObj.teacher) {
                    hasError = true;
                    break;
                }
                classParams.push({
                    subject: rowObj?.subject,
                    classes: rowObj?.selectedClasses,
                    teacher: rowObj?.teacher
                })
            }
            params['classes'] = classParams;
        } else {
            // group 
            if (!groupSubjectId) {
                hasError = true;
            }
            if (!groupTeacherId) {
                hasError = true;
            }
            if (!groupName || groupName?.length === 0) {
                hasError = true;
            }

            const rows = [...groupSubjectRows]
            const groupParams = []
            for (let r = 0; r < rows?.length; r++) {
                const rowObj = rows[r]
                if (!rowObj.class) {
                    hasError = true;
                    break;
                }
                if (!rowObj?.selectedStudents || rowObj?.selectedStudents?.length === 0) {
                    hasError = true;
                    break;
                }
                groupParams.push({
                    class: rowObj?.class,
                    students: rowObj?.selectedStudents
                })
            }

            params['subject'] = groupSubjectId;
            params['teacher'] = groupTeacherId;
            params['groupName'] = groupName;
            params['classes'] = groupParams;
        }
        if (hasError) {
            setShowModalError(true)
            message(t('err.fill_all_fields'))
        } else {
            setLoading(true)
            fetchRequest(managerGroupCreate, 'POST', params)
                .then((res) => {
                    if (res.success) {
                        message(res.message, true)
                        if (modalTabIndex === 1 && addAgain) {
                            setCloseWithReload(true)
                            setGroupSubjectId(null)
                            setGroupTeacherId(null)
                            setGroupName('')
                            setGroupSubjectRows([
                                {
                                    class: null,
                                    students: [],
                                    selectedStudents: []
                                }
                            ])
                            setGroupTotalStudentCount(0)
                        } else {
                            onClose(true)
                        }
                    } else {
                        message(res.message)
                    }
                    setLoading(false)
                })
                .catch((e) => {
                    message(t('err.error_occurred'))
                    setLoading(false)
                });
        }
    }

    return (
        <Modal
            size='xl'
            dimmer='blurring'
            show={true}
            onHide={() => onClose(closeWithReload)}
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton style={{ padding: '1rem' }}>
                <Modal.Title className="modal-title d-flex flex-row justify-content-between w-100">
                    {t('add')}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div>
                    <Forms 
                        ref={formRef}
                        fields={fields}
                    />
                </div>
                <div className="myTimetable-addNewSubjectStyle">
                    {/* <Tab
                        onTabChange={_onTabChange}
                        activeIndex={modalTabIndex}
                        menu={{ attached: false }}
                        panes={[
                            {
                                menuItem: t('calendar.activity').toUpperCase(),
                                render: () => <Tab.Pane>
                                    {
                                        <div>
                                            {
                                                _renderGroup()
                                            }
                                        </div>
                                    }
                                </Tab.Pane>
                            },
                            {
                                menuItem: t('calendar.exam').toUpperCase(),
                                render: () => <Tab.Pane>
                                    {
                                        <div>
                                            {
                                                _renderGroup()
                                            }
                                        </div>
                                    }
                                </Tab.Pane>
                            },
                            {
                                menuItem: t('calendar.event').toUpperCase(),
                                render: () => <Tab.Pane>
                                    {
                                        <div>
                                            {
                                                _renderGroup()
                                            }
                                        </div>
                                    }
                                </Tab.Pane>
                            }
                        ]}
                    /> */}
                </div>
            </Modal.Body>
            <Modal.Footer className='text-center'>
                {
                    modalTabIndex == 1 &&
                    <div className='align-center align-items-center' style={{ marginLeft: '17px', position: 'absolute', left: '1.5rem', bottom: '1.6rem' }}>
                        <label className="form-check-label font-mulish" htmlFor="reAdd" style={{ color: '#575962', fontSize: '14px', fontWeight: '400' }}>
                            <input
                                className="form-check-input modal-position form-modal-check mt-0"
                                id='reAdd'
                                type="checkbox"
                                style={{ borderRadius: '4px', fontSize: '18px' }}
                                value={addAgain}
                                onChange={(e, data) => setAddAgain(e?.target?.checked)}
                            />&nbsp;&nbsp;{t('group.addAgain')}
                        </label>
                    </div>
                }
                <button
                    className="btn m-btn--pill btn-link m-btn margin-right-5"
                    onClick={() => onClose(closeWithReload)}
                >
                    {t('back') || null}
                </button>
                <button
                    onClick={onClickSubmit}
                    className="btn m-btn--pill btn-success m-btn--wide m-btn--uppercase"
                >
                    {t('save') || null}
                </button>
            </Modal.Footer>

            {
                loading &&
                <>
                    <div className="blockUI blockOverlay">
                        <div className="blockUI blockMsg blockPage">
                            <div className="m-loader m-loader--brand m-loader--lg" />
                        </div>
                    </div>
                </>
            }
        </Modal>
    )
}

export default AddModal