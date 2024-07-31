import React, { useState, useEffect } from 'react'
import { Modal } from 'react-bootstrap'
import { useTranslation } from "react-i18next";
import { Tab, Checkbox } from 'semantic-ui-react';
import AddIcon from '@mui/icons-material/Add';
import { NDropdown as Dropdown } from 'widgets/Dropdown';
import CloseIcon from '@mui/icons-material/Close';
import { translations } from 'utils/translations';
import secureLocalStorage from "react-secure-storage";
import message from "modules/message";
import { useSelector } from 'react-redux'
import { fetchRequest } from 'utils/fetchRequest'
import { managerGroupEdit, schoolClassStudents } from 'utils/fetchRequest/Urls'

const locale = secureLocalStorage?.getItem('selectedLang') || 'mn'

const EditModal = ({ onClose, groupId }) => {

    const { t } = useTranslation();
    const { selectedSchool } = useSelector(state => state.schoolData);

    const [loading, setLoading] = useState(false)

    const [isAll, setIsAll] = useState(false)
    const [groupObj, setGroupObj] = useState(null)
    const [showModalError, setShowModalError] = useState(false)
    const [teachers, setTeachers] = useState([])
    const [selectedTeacherId, setSelectedTeacherId] = useState(null)
    const [selectedGroupName, setSelectedGroupName] = useState('')

    const [groupClassRows, setGroupClassRows] = useState([])
    const [allClasses, setAllClasses] = useState([])

    const [groupTotalStudentCount, setGroupTotalStudentCount] = useState(0)
    const [updateView, setUpdateView] = useState(false)

    const loadData = (params) => {
        setLoading(true)
        fetchRequest(managerGroupEdit, 'POST', params)
            .then((res) => {
                if (res.success) {
                    setGroupObj(res?.group || {})
                    setSelectedGroupName(res?.group?.name || '')
                    setIsAll(res?.group?.isClass)
                    setTeachers(res?.teachers || [])
                    setSelectedTeacherId(res?.group?.teacherId)
                    setGroupClassRows(res?.classes || [])
                    calculateStudentCount(res?.classes || [])
                    setAllClasses(res?.allClasses || [])
                } else {
                    message(res.message)
                }
                setLoading(false)
            })
            .catch(() => {
                message(t('err.error_occurred'))
                setLoading(false)
            })
    }

    useEffect(() => {
        loadData({
            school: selectedSchool?.id,
            group: groupId
        })
    }, [groupId])

    const classRowAdd = () => {
        setGroupClassRows([...groupClassRows, {
            class: null,
            allStudents: [],
            students: []
        }])
    };

    const classRowRemove = (index) => {
        if (index != 0) {
            const rows = [...groupClassRows]
            rows.splice(index, 1)
            calculateStudentCount(rows)
            setGroupClassRows(rows)
        }
    }

    const onNameChange = (e) => {
        setSelectedGroupName(e.target.value)
    }

    const getGroupClasses = (rowClassId = null) => {
        const selectedClassIds = groupClassRows?.filter(obj => obj?.class)?.map(obj => obj?.class?.id)
        return allClasses?.filter(obj => {
            if (selectedClassIds?.length > 0) {
                return groupObj?.gradeIds.indexOf(obj?.gradeId) > -1 && (rowClassId === obj?.id || selectedClassIds?.indexOf(obj?.id) < 0)
            } else {
                return groupObj?.gradeIds.indexOf(obj?.gradeId) > -1
            }
        })
    }

    const onTeacherChange = (e, data) => {
        setSelectedTeacherId(data.value)
    }

    const calculateStudentCount = (rows = []) => {
        let totalStudentCount = 0;
        for (let i = 0; i < rows.length; i++) {
            totalStudentCount = totalStudentCount + rows[i].students?.length;
        }
        setGroupTotalStudentCount(totalStudentCount)
    }

    const loadClassStudents = (index, classId = null) => {
        const params = {
            school: selectedSchool?.id,
            class: classId
        }
        const clone = [...groupClassRows]
        clone[index].class = {
            id: classId,
            name: getGroupClasses()?.find(obj => obj?.value === classId)?.text,
            gradeId: getGroupClasses()?.find(obj => obj?.value === classId)?.gradeId,
            gradeName: getGroupClasses()?.find(obj => obj?.value === classId)?.gradeName,
        }
        clone[index].allStudents = []
        clone[index].students = []

        setLoading(true)
        fetchRequest(schoolClassStudents, 'POST', params)
            .then((res) => {
                if (res.success) {
                    clone[index].allStudents = res?.students;
                    setGroupClassRows(clone)

                    setUpdateView(!updateView)
                } else {
                    setGroupClassRows(clone)
                    message(res.message)
                }
                setLoading(false)
            })
            .catch((e) => {
                setGroupClassRows(clone)
                message(t('err.error_occurred'))
                setLoading(false)
            })
    };

    const onClickSubmit = () => {
        let hasError = false;
        let params = {
            school: selectedSchool?.id,
            submit: 1,
            type: isAll ? 'class' : 'group',
            group: groupId
        }
        if (!selectedTeacherId) {
            hasError = true;
        }
        if (!selectedGroupName || selectedGroupName?.length === 0) {
            hasError = true;
        }
        params['teacher'] = selectedTeacherId;
        params['groupName'] = selectedGroupName;

        if (!isAll) {
            // group 
            const rows = [...groupClassRows]
            const groupParams = []
            for (let r = 0; r < rows?.length; r++) {
                const rowObj = rows[r]
                if (!rowObj.class) {
                    hasError = true;
                    break;
                }
                if (!rowObj?.students || rowObj?.students?.length === 0) {
                    hasError = true;
                    break;
                }
                groupParams.push({
                    class: rowObj?.class,
                    students: rowObj?.students
                })
            }

            params['classes'] = groupParams;
        }
        if (hasError) {
            setShowModalError(true)
            message(t('err.fill_all_fields'))
        } else {
            setLoading(true)
            fetchRequest(managerGroupEdit, 'POST', params)
                .then((res) => {
                    if (res.success) {
                        message(res.message, true)
                        onClose(true)
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
            onHide={() => onClose()}
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton style={{ padding: '1rem' }}>
                <Modal.Title className="modal-title d-flex flex-row justify-content-between w-100">
                    {t('edit')}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {
                    groupObj && <div className="my-4">
                        <div className="form-group m-form__group row vertical-align-middle d-flex">
                            <div className='col-4 text-right'>
                                <label className="label-pinnacle-bold">
                                    {translations(locale).type}
                                </label>
                            </div>
                            <div className='col-5'>
                                <label style={{ color: '#575962', fontSize: '14px' }}>
                                    {isAll ? translations(locale).timetable.class_student : translations(locale).timetable.group_student}
                                </label>
                            </div>
                        </div>
                        <div className="form-group m-form__group row vertical-align-middle d-flex">
                            <div className='col-4 text-right'>
                                <label className="label-pinnacle-bold">
                                    {translations(locale).grade}
                                </label>
                            </div>
                            <div className='col-5'>
                                <label style={{ color: '#575962', fontSize: '14px' }}>
                                    {groupObj?.gradeNames?.toString()}
                                </label>
                            </div>
                        </div>
                        <div className="form-group m-form__group row align-items-baseline">
                            <label className="col-4 text-right label-pinnacle-bold">
                                {translations(locale).name || null}*
                            </label>
                            <div className="col-md-5 col-sm-12">
                                <input type="text"
                                    className={showModalError && selectedGroupName?.length === 0 ? "form-control m-input has-error" : "form-control m-input"}
                                    placeholder={translations(locale).insert_first_name || null}
                                    value={selectedGroupName ? selectedGroupName : ''}
                                    onChange={onNameChange} />
                            </div>
                        </div>
                        <div className="form-group m-form__group row align-items-baseline">
                            <label className="col-4 text-right label-pinnacle-bold">
                                {translations(locale).subject.title || null}
                            </label>
                            <div className="col-5">
                                <Dropdown
                                    selectOnNavigation={false}
                                    placeholder={'-' + translations(locale).survey.choose + '-' || null}
                                    fluid
                                    selection
                                    search
                                    additionPosition='bottom'
                                    upward={false}
                                    closeOnChange
                                    selectOnBlur={false}
                                    disabled={true}
                                    value={groupObj?.subjectId || null}
                                    options={[
                                        {
                                            value: groupObj?.subjectId,
                                            text: groupObj?.subjectName
                                        }
                                    ]}
                                />
                            </div>
                        </div>
                        <div className="form-group m-form__group row align-items-baseline">
                            <label className="col-4 text-right label-pinnacle-bold">
                                {translations(locale).teacher_title || null}*
                            </label>
                            <div className="col-5">
                                <Dropdown
                                    selectOnNavigation={false}
                                    placeholder={'-' + translations(locale).survey.choose + '-' || null}
                                    fluid
                                    selection
                                    className={showModalError && !selectedTeacherId ? "has-error" : ""}
                                    search
                                    additionPosition='bottom'
                                    upward={false}
                                    closeOnChange
                                    selectOnBlur={false}
                                    value={selectedTeacherId}
                                    options={teachers?.map(obj => {
                                        return {
                                            value: obj?.teacherId,
                                            text: obj?.firstName + ' (' + obj?.lastName + ')-' + obj?.teacherCode
                                        }
                                    })}
                                    onChange={onTeacherChange}
                                />
                            </div>
                        </div>

                        {
                            !isAll && <div className="form-group m-form__group row">
                                <div className="col-md-1" />
                                <div className="col-md-10">
                                    <table className="table table-borderless">
                                        <thead>
                                            <tr>
                                                <th className="text-right bolder pb-4" style={{ fontSize: '14px', color: '#575962' }}>{translations(locale).total + ':' || null}&nbsp;{groupTotalStudentCount}</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                groupClassRows.map(function (obj, i) {
                                                    return (
                                                        <tr key={'tr_group_' + i}>
                                                            <td width={120} className="text-right label-pinnacle-bold vertical-align-middle">
                                                                {translations(locale).group.title || null}
                                                            </td>
                                                            <td width={300} className="p-2 vertical-align-middle">
                                                                <Dropdown
                                                                    selectOnNavigation={false}
                                                                    placeholder={'-' + translations(locale).survey.choose + '-' || null}
                                                                    fluid
                                                                    selection
                                                                    search
                                                                    additionPosition='bottom'
                                                                    upward={false}
                                                                    closeOnChange
                                                                    selectOnBlur={false}
                                                                    className={showModalError && !obj['class']?.id ? "has-error" : ""}
                                                                    value={obj['class']?.id}
                                                                    options={getGroupClasses(obj.class?.id)?.map(obj => {
                                                                        return {
                                                                            value: obj?.value,
                                                                            text: obj?.text
                                                                        }
                                                                    })}
                                                                    onChange={(e, data) => {
                                                                        if (data?.value) {
                                                                            loadClassStudents(i, data?.value)
                                                                        } else {
                                                                            const clone = [...groupSubjectRows]
                                                                            clone[i].students = []
                                                                            clone[i].class = null
                                                                            clone[i].selectedStudents = []

                                                                            setGroupSubjectRows(clone)
                                                                        }
                                                                    }}
                                                                />
                                                            </td>
                                                            <td className="p-2 vertical-align-middle">
                                                                <Dropdown
                                                                    selectOnNavigation={false}
                                                                    placeholder={'-' + translations(locale).survey.choose + '-' || null}
                                                                    fluid
                                                                    className={showModalError && !obj['students'].length ? "has-error" : ""}
                                                                    selection
                                                                    search
                                                                    additionPosition='bottom'
                                                                    upward={false}
                                                                    selectOnBlur={false}
                                                                    multiple={true}
                                                                    value={obj['students']}
                                                                    options={obj['allStudents']?.map(obj => {
                                                                        return {
                                                                            value: obj?.value,
                                                                            text: obj?.text
                                                                        }
                                                                    })}
                                                                    onChange={(e, data) => {
                                                                        let clone = [...groupClassRows];
                                                                        for (let k = 0; k < clone.length; k++) {
                                                                            let rowObj = clone[k];
                                                                            if (k === i) {
                                                                                rowObj['students'] = data.value;
                                                                            }
                                                                        }
                                                                        setGroupClassRows(clone)
                                                                        calculateStudentCount(clone)
                                                                        setShowModalError(false)
                                                                    }}
                                                                />
                                                            </td>
                                                            <td width={100} className="p-2 vertical-inherit">
                                                                {
                                                                    i > 0
                                                                        ?
                                                                        <button
                                                                            onClick={() => classRowRemove(i)}
                                                                            className="btn btn-danger m-btn m-btn--icon btn-sm m-btn--icon-only m-btn--pill d-inline-flex align-items-center justify-content-center">
                                                                            <CloseIcon />
                                                                        </button>
                                                                        : null
                                                                }
                                                            </td>
                                                        </tr>
                                                    )
                                                })
                                            }
                                            <tr>
                                                <td />
                                                <td />
                                                <td />
                                                <td width={100} className="p-2">
                                                    <button onClick={classRowAdd}
                                                        className="btn btn-outline-info m-btn m-btn--icon btn-sm m-btn--icon-only m-btn--pill d-inline-flex align-items-center justify-content-center"
                                                    >
                                                        <AddIcon />
                                                    </button>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <div className="col-md-1" />
                            </div>
                        }
                    </div>
                }
            </Modal.Body>
            <Modal.Footer className='text-center'>
                <button
                    className="btn m-btn--pill btn-link m-btn m-btn--custom margin-right-5"
                    onClick={() => onClose()}
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
        </Modal >
    )
}

export default EditModal