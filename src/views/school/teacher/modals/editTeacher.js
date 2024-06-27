import { useState } from 'react'
import message from 'modules/message'
import React, { useEffect, useRef } from 'react'
import { Modal } from 'react-bootstrap'
import ImageModal from 'utils/imageModal'
import secureLocalStorage from 'react-secure-storage'
import { NDropdown as Dropdown } from 'widgets/Dropdown'
import { useTranslation } from "react-i18next";
import Forms from 'modules/Form/Forms'

const EditTeacherModal = ({onClose, onSubmit, data}) => {

    const { t } = useTranslation();
    const formRef = useRef();

    const teacherData = data

    const [loading, setLoading] = useState(false)
    const [updateView, setUpdateView] = useState(false)
    const [viewImageModal, setViewImageModal] = useState(false)

    const [teacher, setTeacher] = useState({})
    
    const [roleOptions, setRoleOptions] = useState([{value: '11', text: '111'}, {value: '22', text: 'asdf'}])
    const [gradeOptions, setGradeOptions] = useState([{value: '11', text: '111'}, {value: '22', text: 'asdf'}])
    const [gradeSubjectOptions, setGradeSubjectOptions] = useState([{value: '11', text: '111'}, {value: '22', text: 'asdf'}])
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

    const [schoolOptions, setSchoolOptions] = useState([
        {value: "ID22", refId: "refId", gid: "2323", text: "text 1"},
        {value: "ID2", refId: "refId2", gid: "232", text: "text 2"},
        {value: "ID345", refId: "refId3", gid: "23", text: "text 3"},
    ])

    const addTeacherFields = [
        {
            key: 'teacherRole',
            label: `${t('role')}*`,
            labelBold: true,
            value: '',
            type: 'dropdown',
            // placeholder: t('teacher.login_name'),
            className: "form-control",
            upperCase: true,
            disabled: true,
            formContainerClassName: 'form-group m-form__group row',
            fieldContainerClassName: 'col-8',
            labelClassName: "col-4 col-form-label text-right label-pinnacle-bold mr-0",
            options: roleOptions,
        },
        {
            key: 'teacherCode',
            label: `${t('teacher.code')}*`,
            className: "form-control",
            labelBold: true,
            value: '',
            type: 'text',
            required: true,
            fieldContainerClassName: 'col-8',
            errorMessage: t('auth.errorMessage.enterNewLoginName'),
            formContainerClassName: 'form-group m-form__group row',
            // whiteSpaceContainer
            placeholder: t('teacher.code'),
            labelClassName: "col-4 col-form-label text-right label-pinnacle-bold"
        },
        {
            key: 'teacherLastName',
            label: `${t('teacher.new_lastname')}*`,
            labelBold: true,
            className: "form-control",
            fieldContainerClassName: 'col-8',
            value: '',
            type: 'text',
            required: true,
            errorMessage: t('auth.errorMessage.repeatNewLoginName'),
            formContainerClassName: 'form-group m-form__group row',
            placeholder: t('teacher.new_lastname_placeholder'),
            labelClassName: "col-4 col-form-label text-right label-pinnacle-bold"
        },
        {
            key: 'teacherFirstName',
            label: `${t('teacher.new_name')}*`,
            labelBold: true,
            className: "form-control",
            fieldContainerClassName: 'col-8',
            value: '',
            type: 'text',
            required: true,
            errorMessage: t('auth.errorMessage.repeatNewLoginName'),
            formContainerClassName: 'form-group m-form__group row',
            placeholder: t('teacher.new_name_placeholder'),
            labelClassName: "col-4 col-form-label text-right label-pinnacle-bold"
        },
        {
            key: 'register_number',
            label: `${t('register_number')}`,
            labelBold: true,
            className: "form-control",
            fieldContainerClassName: 'col-8',
            value: '',
            type: 'nonCryllic',
            // required: true,
            // errorMessage: t('auth.errorMessage.repeatNewLoginName'),
            formContainerClassName: 'form-group m-form__group row',
            placeholder: t('register_number'),
            labelClassName: "col-4 col-form-label text-right label-pinnacle-bold"
        },
        {
            key: 'loginName',
            label: `${t('teacher.login_name')}*`,
            labelBold: true,
            className: "form-control",
            fieldContainerClassName: 'col-8',
            value: '',
            disabled: true,
            type: 'text',
            formContainerClassName: 'form-group m-form__group row',
            placeholder: t('teacher.login_name'),
            labelClassName: "col-4 col-form-label text-right label-pinnacle-bold"
        },
        {
            key: 'teacherEmail',
            label: `${t('studentBook.email')}`,
            labelBold: true,
            className: "form-control",
            fieldContainerClassName: 'col-8',
            value: '',
            type: 'text',
            // required: true,
            // errorMessage: t('auth.errorMessage.repeatNewLoginName'),
            formContainerClassName: 'form-group m-form__group row',
            placeholder: t('e_mail'),
            labelClassName: "col-4 col-form-label text-right label-pinnacle-bold"
        },
        {
            key: 'teacherPhone',
            label: `${t('teacher.phone_number')}*`,
            labelBold: true,
            className: "form-control",
            fieldContainerClassName: 'col-8',
            value: '',
            type: 'number',
            required: true,
            errorMessage: t('auth.errorMessage.repeatNewLoginName'),
            formContainerClassName: 'form-group m-form__group row',
            placeholder: t('teacher.phone_number'),
            labelClassName: "col-4 col-form-label text-right label-pinnacle-bold"
        },
        {
            key: 'teacherGender',
            label: `${t('teacher.gender')}*`,
            labelBold: true,
            className: "form-control",
            fieldContainerClassName: 'col-8',
            value: '',
            type: 'dropdown',
            options: genderOptions,
            required: true,
            errorMessage: t('auth.errorMessage.repeatNewLoginName'),
            formContainerClassName: 'form-group m-form__group row',
            placeholder: '-' + t('teacher.select_gender') + '-',
            labelClassName: "col-4 col-form-label text-right label-pinnacle-bold"
        },
        {
            key: 'teacherSchool',
            label: `${t('school')}*`,
            labelBold: true,
            className: "form-control",
            fieldContainerClassName: 'col-8',
            value: '',
            type: 'dropdown',
            required: true,
            options: schoolOptions,
            errorMessage: t('auth.errorMessage.repeatNewLoginName'),
            formContainerClassName: 'form-group m-form__group row',
            placeholder: '-' + t('teacher.select_school') + ' - ',
            labelClassName: "col-4 col-form-label text-right label-pinnacle-bold"
        },
        {
            key: 'teacherTitle',
            label: `${t('teacher.teacher_title')}*`,
            labelBold: true,
            className: "form-control",
            fieldContainerClassName: 'col-8',
            value: '',
            type: 'text',
            required: true,
            errorMessage: t('auth.errorMessage.repeatNewLoginName'),
            formContainerClassName: 'form-group m-form__group row',
            placeholder: t('teacher.insert_teacher_title'),
            labelClassName: "col-4 col-form-label text-right label-pinnacle-bold"
        },
    ]

    // useEffect(() => {
    //     if (!teacherData?.state?.id) {
    //         message(t('course_select_teacher'))
    //         navigate('/school/teachers', { replace: true })
    //     }
    // }, [])

    const handleSubmit = () => {
        const [formsValid, formValues] = formRef.current.validate();

        console.log(formValues[4].value)

        if (formsValid) {
            if (gradeSubjectOptions.length == 1 && gradeSubjectOptions?.[0]?.grade && !gradeSubjectOptions?.[0]?.subjects.length) {
                return message(t('err.fill_all_fields'))
            } else if (gradeSubjectOptions.length > 1 && !gradeSubjectOptions.every(el => { return el.grade && el.subjects.length })){
                return message(t('err.fill_all_fields'))
            } else {
                const dataCollectorArray = []
                for (let x=0;x<formValues.length;x++) {
                    dataCollectorArray.push({key: formValues[x].key, value: formValues[x].value, options: formValues[x].options})
                }
                message('success')
    
                // after success \/
                // onClose()
                // setLoading(true)
                // console.log(dataCollectorArray)
            }
        } 
        else{
            message(t('err.fill_all_fields'))
        } 

        // if (validateFields()) {
        //     console.log('success')
            // setLoading(true)
            // const subjectList = gradeSubjectOptions.map(el => {
            //     if (el && el.visible) {
            //         return { grade: el.value, subjects: el.teacherSubjects?.map(obj => el.value + '_s_' + obj) }
            //     }
            // });

            // const params = {
            //     ...teacher,
            //     subjects: JSON.stringify(subjectList),
            //     submit: 1,
            //     teacher: teacherData?.state?.id,
            //     photo: teacher?.avatar?.startsWith('data') ? teacher?.avatar : null
            // }
            // fetchRequest(schoolTeacherEdit, 'POST', params)
            //     .then((res) => {
            //         if (res.success) {
            //             message(res.data.message, true)
            //             onSubmit()
            //             onClose()
            //         } else {
            //             message(res.data.message)
            //         }
            //         setLoading(false)
            //     })
            //     .catch(() => {
            //         message(t('err.error_occurred'))
            //         setLoading(false)
            //     })
        // } else{
        //     console.log('fail')
        // }
    }

    // const handleChange = (name, value) => {
    //     console.log(teacher)
    //     setTeacher({ ...teacher, [name]: value })
    // }

    const handleAvatarUpload = params => {
        setTeacher({ ...teacher, avatar: params.image, fileType: params.imageType, })
    }

    const handleAvatarRemove = () => {
        setTeacher({ ...teacher, avatar: undefined, fileType: undefined, })
    }

    // const validateFields = () => {
    //     const list = gradeSubjectOptions;
    //     let hasError = false
    //     if (list?.length > 0) {
    //         for (let l = 0; l < list?.length; l++) {
    //             if (list[l].visible) {
    //                 if (list[l].value) {
    //                 } else {
    //                     hasError = true;
    //                     break;
    //                 }
    //             }
    //         }
    //     }
    //     if (!teacher?.lastName || !teacher?.firstName || !teacher?.code || !teacher?.phoneNumber || !teacher?.gender || !teacher?.title || !teacher?.grade)
    //         return message(t('err.fill_all_fields'))
    //     else if (hasError)
    //         return message(t('err.fill_all_fields'))
    //     else
    //         return true
    // }

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
            <Modal.Header closeButton style={{padding: '1rem'}}>
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
                        <div className="form-group m-form__group row">
                            <Forms
                                ref={formRef}
                                fields={addTeacherFields}
                            />
                        </div>
                        {
                            gradeSubjectOptions?.map((gradeSubjectObj, s) => {
                                const renderRow = gradeSubjectObj?.visible || (gradeSubjectObj?.teacherSubjects?.length > 0);
                                return renderRow && <div key={s} className="form-group m-form__group row">
                                    <label className="col-4 col-form-label text-right label-pinnacle-bold">
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
                                        <div style={{paddingRight: "0.71rem"}} className={s != 0 ? 'visible' : 'invisible'}>
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
                    <div className="blockUI blockOverlay" />
                    <div className="blockUI blockMsg blockPage">
                        <div className="m-loader m-loader--brand m-loader--lg" />
                    </div>
                </>
            }
        </Modal>
    )
}

export default EditTeacherModal