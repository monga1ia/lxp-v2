import message from 'modules/message'
import React, { useEffect, useState, useRef } from 'react'
import { Modal } from 'react-bootstrap'
import ImageModal from 'utils/imageModal'
import { useSelector } from 'react-redux';
import secureLocalStorage from 'react-secure-storage'
import { NDropdown as Dropdown } from 'widgets/Dropdown'
import { useTranslation } from "react-i18next";
import Forms from 'modules/Form/Forms'
import { fetchRequest } from 'utils/fetchRequest';
import { schoolTeacherEdit } from 'utils/fetchRequest/Urls';

const EditTeacherModal = ({ onClose, onSubmit, teacherId }) => {

    const { t } = useTranslation();
    const { selectedSchool } = useSelector(state => state.schoolData);
    const formRef = useRef();

    const [loading, setLoading] = useState(false)
    const [updateView, setUpdateView] = useState(false)
    const [viewImageModal, setViewImageModal] = useState(false)

    const [teacher, setTeacher] = useState({})

    const [gradeOptions, setGradeOptions] = useState([])
    const [gradeSubjectOptions, setGradeSubjectOptions] = useState([])
    const [genderOptions] = useState([
        {
            value: 'M',
            text: t('male'),
        },
        {
            value: 'F',
            text: t('female'),
        }
    ])

    const teacherFields = (grades = [], teacherObj = {}) => {
        return [
            {
                key: 'code',
                label: `${t('teacher.code')}*`,
                className: "form-control",
                labelBold: true,
                value: teacherObj?.code,
                type: 'text',
                required: true,
                errorMessage: t('error.enterTeacherCode'),
                formContainerClassName: 'form-group m-form__group row',
                fieldContainerClassName: 'col-8',
                placeholder: t('teacher.code'),
                labelClassName: "col-3 text-right label-pinnacle-bold mr-0"
            },
            {
                key: 'lastName',
                label: `${t('teacher.new_lastname')}*`,
                labelBold: true,
                className: "form-control",
                fieldContainerClassName: 'col-8',
                value: teacherObj?.lastName,
                type: 'text',
                required: true,
                errorMessage: t('error.enterLastname'),
                formContainerClassName: 'form-group m-form__group row',
                placeholder: t('teacher.new_lastname_placeholder'),
                labelClassName: "col-3 text-right label-pinnacle-bold mr-0"
            },
            {
                key: 'firstName',
                label: `${t('teacher.new_name')}*`,
                labelBold: true,
                className: "form-control",
                fieldContainerClassName: 'col-8',
                value: teacherObj?.firstName,
                type: 'text',
                required: true,
                errorMessage: t('error.enterFirstname'),
                formContainerClassName: 'form-group m-form__group row',
                placeholder: t('teacher.new_name_placeholder'),
                labelClassName: "col-3 text-right label-pinnacle-bold mr-0"
            },
            {
                key: 'registerNumber',
                label: `${t('register_number')}`,
                labelBold: true,
                className: "form-control",
                fieldContainerClassName: 'col-8',
                value: teacherObj?.registrationNumber,
                type: 'textUppercase',
                formContainerClassName: 'form-group m-form__group row',
                placeholder: t('register_number'),
                labelClassName: "col-3 text-right label-pinnacle-bold mr-0"
            },
            {
                key: 'loginName',
                label: `${t('teacher.login_name')}*`,
                labelBold: true,
                className: "form-control",
                fieldContainerClassName: 'col-8',
                value: teacherObj?.loginName,
                type: 'text',
                required: true,
                errorMessage: t('error.enterLoginname'),
                formContainerClassName: 'form-group m-form__group row',
                placeholder: t('teacher.login_name'),
                labelClassName: "col-3 text-right label-pinnacle-bold mr-0"
            },
            {
                key: 'email',
                label: `${t('studentBook.email')}`,
                labelBold: true,
                className: "form-control",
                fieldContainerClassName: 'col-8',
                value: teacherObj?.email,
                type: 'text',
                formContainerClassName: 'form-group m-form__group row',
                placeholder: t('e_mail'),
                labelClassName: "col-3 text-right label-pinnacle-bold mr-0"
            },
            {
                key: 'phone',
                label: `${t('teacher.phone_number')}*`,
                labelBold: true,
                className: "form-control",
                fieldContainerClassName: 'col-8',
                value: teacherObj?.phoneNumber,
                type: 'number',
                required: true,
                errorMessage: t('error.enterPhone'),
                formContainerClassName: 'form-group m-form__group row',
                placeholder: t('teacher.phone_number'),
                labelClassName: "col-3 text-right label-pinnacle-bold mr-0"
            },
            {
                key: 'gender',
                label: `${t('teacher.gender')}*`,
                labelBold: true,
                className: "form-control",
                fieldContainerClassName: 'col-8',
                value: teacherObj?.gender,
                type: 'nDropdown',
                options: genderOptions,
                required: true,
                errorMessage: t('error.selectGender'),
                formContainerClassName: 'form-group m-form__group row',
                placeholder: '-' + t('teacher.select_gender') + '-',
                labelClassName: "col-3 text-right label-pinnacle-bold mr-0"
            },
            {
                key: 'grade',
                label: `${t('school')}*`,
                labelBold: true,
                className: "form-control",
                fieldContainerClassName: 'col-8',
                value: teacherObj?.grade,
                type: 'nDropdown',
                required: true,
                options: grades,
                errorMessage: t('error.enterTeachersSchool'),
                formContainerClassName: 'form-group m-form__group row',
                placeholder: '-' + t('teacher.select_school') + ' - ',
                labelClassName: "col-3 text-right label-pinnacle-bold mr-0"
            },
            {
                key: 'title',
                label: `${t('teacher.teacher_title')}*`,
                labelBold: true,
                className: "form-control",
                fieldContainerClassName: 'col-8',
                value: teacherObj?.title,
                type: 'text',
                required: true,
                errorMessage: t('error.enterTitle'),
                formContainerClassName: 'form-group m-form__group row',
                placeholder: t('teacher.insert_teacher_title'),
                labelClassName: "col-3 text-right label-pinnacle-bold mr-0"
            }
        ]
    }

    const loadData = (params = {}) => {
        setLoading(true)
        fetchRequest(schoolTeacherEdit, 'POST', params, false, true)
            .then((res) => {
                if (res.success) {
                    let selectedRole = null;
                    setGradeOptions(res?.grades || [])
                    setGradeSubjectOptions(res?.gradeWithSubjects || [])
                    setTeacher(res?.teacherData || {})
                    if (res?.roleLists?.length === 1) {
                        selectedRole = res?.roleLists[0]?.value;
                    }
                    formRef?.current?.updateFields && formRef.current?.updateFields(teacherFields(res?.grades, res?.teacherData));
                } else {
                    message(res.data.message)
                }
                setLoading(false)
            })
            .catch(() => {
                message(t('err.error_occurred'))
                setLoading(false)
            })
    }

    useEffect(() => {
        if (teacherId) {
            const formData = new FormData();
            formData.append('school', selectedSchool?.id)
            formData.append('teacher', teacherId)
            loadData(formData)
        } else {
            message(t('course_select_teacher'))
            onClose()
        }
    }, [])

    const handleSubmit = () => {
        const [formsValid, formValues] = formRef.current.validate();
        if (formsValid) {
            const formData = new FormData();
            formData.append('school', selectedSchool?.id)
            formData.append('subjects', JSON.stringify(gradeSubjectOptions.map(el => ({ grade: el.grade, subjects: el.teacherSubjects }))))
            formData.append('submit', 1)
            formData.append('menu', 'teacher')
            formData.append('teacher', teacherId)
            formData.append('photo', teacher?.photo)
            formData.append('fileType', teacher?.fileType)

            for (let x = 0; x < formValues.length; x++) {
                formData.append(formValues[x].key, formValues[x].value)
            }

            setLoading(true)
            fetchRequest(schoolTeacherEdit, 'POST', formData, true, true)
                .then((res) => {
                    if (res.success) {
                        message(res.message, true)
                        onClose(true)
                    } else {
                        message(res.message)
                    }
                    setLoading(false)
                })
                .catch(() => {
                    message(t('err.error_occured'))
                    setLoading(false)
                })
        }
        else {
            message(t('err.fill_all_fields'))
        }
    }

    const handleAvatarUpload = params => {
        setTeacher({ ...teacher, avatar: params.image, fileType: params.imageType, })
    }

    const handleAvatarRemove = () => {
        setTeacher({ ...teacher, avatar: undefined, fileType: undefined, })
    }

    const handleRowGradeChange = (index, value, options) => {
        const rows = [...gradeSubjectOptions]
        rows[index].visible = true;
        if (value) {
            rows[index].value = value
        } else {
            rows[index].value = null
            rows[index].teacherSubjects = []
        }
        setGradeSubjectOptions(rows)

        setUpdateView(!updateView)
    }

    const handleRowSubjectsChange = (index, value, list) => {
        const rows = [...gradeSubjectOptions]

        const selectedList = []
        for (let l = 0; l < list?.length; l++) {
            if (value.indexOf(list[l]?.value) > -1) {
                selectedList.push(list[l].subject)
            }
        }
        rows[index].teacherSubjects = selectedList
        setGradeSubjectOptions(rows)
    }

    const addGradeRow = () => {
        if (gradeSubjectOptions?.length > 0) {
            const clone = [...gradeSubjectOptions];
            let lastVisibleRow = -1;
            let nonVisiblePrevRow = -1;
            for (let g = 0; g < clone?.length; g++) {
                if (clone[g].visible) {
                    lastVisibleRow = g;
                } else {
                    if (nonVisiblePrevRow === -1) {
                        nonVisiblePrevRow = g;
                    }
                }
            }

            if (lastVisibleRow < gradeSubjectOptions.length - 1) {
                clone[lastVisibleRow + 1].visible = true;
            } else {
                if (nonVisiblePrevRow > -1) {
                    clone[nonVisiblePrevRow].visible = true;
                }
            }
            setGradeSubjectOptions(clone)
        }
    }

    const removeGradeRow = index => {
        if (index != 0) {
            const rows = [...gradeSubjectOptions]
            rows[index].visible = false
            rows[index].teacherSubjects = []
            setGradeSubjectOptions(rows)
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
            <Modal.Header closeButton style={{ padding: '1rem' }}>
                <Modal.Title className="modal-title d-flex flex-row justify-content-between w-100">
                    {t('action.edit')}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="row mt-4">
                    <div className="col-3 d-flex flex-column align-items-center" style={{ gap: 10 }}>
                        <img
                            className="img-responsive img-circle"
                            src={teacher?.avatar || '/img/profile/placeholder.jpg'}
                            onError={(e) => {
                                e.target.onError = null
                                e.target.src = '/img/profile/avatar.png'
                            }}
                            width={150}
                            height={150}
                        />
                        <button
                            onClick={() => setViewImageModal(true)}
                            className="btn m-btn--pill btn-outline-primary"
                            style={{ width: 150 }}
                        >
                            {t('teacher.change_photo')}
                        </button>
                        <button
                            onClick={handleAvatarRemove}
                            className="btn m-btn--pill btn-outline-danger "
                            style={{ width: 150 }}
                        >
                            {t('profile.img_delete')}
                        </button>
                    </div>
                    <div className="col-7">
                        <div className="form-group m-form__group row mb-0">
                            <Forms
                                ref={formRef}
                                fields={teacherFields(gradeOptions, teacher)}
                            />
                        </div>
                        {
                            gradeSubjectOptions?.map((gradeSubjectObj, s) => {
                                const renderRow = gradeSubjectObj?.visible || (gradeSubjectObj?.teacherSubjects?.length > 0);
                                return renderRow && <div key={s} className="form-group m-form__group row">
                                    <label className="col-3 col-form-label text-right label-pinnacle-bold">
                                        {s === 0 && t('teacher.subjects')}
                                    </label>
                                    <div className="col-3">
                                        <Dropdown
                                            placeholder={'-' + t('err.select_class') + ' - '}
                                            fluid
                                            selection
                                            additionPosition='bottom'
                                            upward={false}
                                            closeOnChange
                                            disabled={true}
                                            selectOnBlur={false}
                                            value={gradeSubjectObj?.value}
                                            options={gradeOptions}
                                            onChange={(e, data) => handleRowGradeChange(s, data?.value, data?.options)}
                                        />
                                    </div>
                                    <div className="col-5 d-flex p-0 align-items-center">
                                        <Dropdown
                                            placeholder={'-' + t('absent.select_subject') + ' - '}
                                            fluid
                                            selection
                                            additionPosition='bottom'
                                            upward={false}
                                            multiple={true}
                                            search
                                            className='mr-2'
                                            clearable
                                            selectOnBlur={false}
                                            value={gradeSubjectObj?.teacherSubjects?.map(obj => gradeSubjectObj?.value + '_s_' + obj) || []}
                                            options={gradeSubjectObj?.subjects}
                                            onChange={(e, data) => handleRowSubjectsChange(s, data?.value, gradeSubjectObj?.subjects)}
                                        />
                                        <div style={{ paddingRight: "0.71rem" }} className={s != 0 ? 'visible' : 'invisible'}>
                                            <button onClick={() => removeGradeRow(s)} className='btn btn-danger m-btn m-btn--icon btn-sm m-btn--icon-only m-btn--pill'>
                                                <i className="la la-close" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            })
                        }
                        {
                            gradeSubjectOptions?.length > 0 &&
                            <div className="form-group m-form__group row">
                                <div className="col-12s d-flex justify-content-end align-items-center">
                                    <button onClick={addGradeRow} className='btn btn-outline-info m-btn m-btn--icon btn-sm m-btn--icon-only m-btn--pill'>
                                        <i className="la la-plus" />
                                    </button>
                                </div>
                            </div>
                        }
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer className="text-center">
                <button
                    onClick={onClose}
                    className="btn m-btn--pill btn-link m-btn m-btn--custom"
                >
                    {t('back')}
                </button>
                <button
                    onClick={handleSubmit}
                    className="btn m-btn--pill btn-success text-uppercase"
                >
                    {t('save')}
                </button>
            </Modal.Footer>
            {
                viewImageModal &&
                <ImageModal
                    onClose={() => setViewImageModal(false)}
                    onSubmit={handleAvatarUpload}
                />
            }
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

export default EditTeacherModal