import { useState } from 'react'
import message from 'modules/message'
import { Modal } from 'react-bootstrap'
import React, { useEffect, useRef } from 'react'
import ImageModal from 'utils/imageModal'
import ForceCreateModal from './forceCreate'
import secureLocalStorage from 'react-secure-storage'
import { NDropdown as Dropdown } from 'widgets/Dropdown'
import { useTranslation } from "react-i18next";
import Forms from 'modules/Form/Forms'

const AddTeacherModal = ({onClose, onSubmit, data}) => {

    const { t } = useTranslation();
    const formRef = useRef();

    const [loading, setLoading] = useState(false)
    const [viewImageModal, setViewImageModal] = useState(false)
    const [viewForceCreateModal, setViewForceCreateModal] = useState(false)

    const [teacher, setTeacher] = useState({})
    const [roleOptions, setRoleOptions] = useState([
        {value: "ID22", refId: "refId", gid: "2323", text: "text 1"},
        {value: "ID2", refId: "refId2", gid: "232", text: "text 2"},
        {value: "ID345", refId: "refId3", gid: "23", text: "text 3"},
    ])
    const [gradeOptions, setGradeOptions] = useState([])
    const [forceCreateMessage, setForceCreateMessage] = useState('')
    const [gradeSubjectOptions, setGradeSubjectOptions] = useState([{value: '11', text: '111'}, {value: '22', text: 'asdf'}])
    const [gradeRows, setGradeRows] = useState([{
        grade: null,
        subjects: [],
        subjectOptions: []
    }])
    const [genderOptions, setGenderOptions] = useState([
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
            required: true,
            errorMessage: t('auth.errorMessage.enterLoginName'),
            // placeholder: t('teacher.login_name'),
            className: "form-control",
            upperCase: true,
            formContainerClassName: 'form-group m-form__group row',
            fieldContainerClassName: 'col-8',
            labelClassName: "col-3 col-form-label text-right label-pinnacle-bold mr-0",
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
            labelClassName: "col-3 col-form-label text-right label-pinnacle-bold"
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
            labelClassName: "col-3 col-form-label text-right label-pinnacle-bold"
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
            labelClassName: "col-3 col-form-label text-right label-pinnacle-bold"
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
            labelClassName: "col-3 col-form-label text-right label-pinnacle-bold"
        },
        {
            key: 'loginName',
            label: `${t('teacher.login_name')}*`,
            labelBold: true,
            className: "form-control",
            fieldContainerClassName: 'col-8',
            value: '',
            type: 'text',
            required: true,
            errorMessage: t('auth.errorMessage.repeatNewLoginName'),
            formContainerClassName: 'form-group m-form__group row',
            placeholder: t('teacher.login_name'),
            labelClassName: "col-3 col-form-label text-right label-pinnacle-bold"
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
            labelClassName: "col-3 col-form-label text-right label-pinnacle-bold"
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
            labelClassName: "col-3 col-form-label text-right label-pinnacle-bold"
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
            labelClassName: "col-3 col-form-label text-right label-pinnacle-bold"
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
            labelClassName: "col-3 col-form-label text-right label-pinnacle-bold"
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
            labelClassName: "col-3 col-form-label text-right label-pinnacle-bold"
        },
    ]

    const handleSubmit = () => {
        const [formsValid, formValues] = formRef.current.validate();

        if (formsValid) {

            if (gradeRows.length == 1 && gradeRows?.[0]?.grade && !gradeRows?.[0]?.subjects.length) {
                return message(t('err.fill_all_fields'))
            } else if (gradeRows.length > 1 && !gradeRows.every(el => { return el.grade && el.subjects.length })){
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

        // console.log(dataCollectorArray)

        // if (formsValid) {
        // //     if (formValues[1].value !== formValues[2].value){
        // //         message(t('login_name_re_enter_mismatch'))
        // //     }
        // //     else {
        // //         setLoginNames({existingUsername: formValues[0].value, newUsername: formValues[1].value})
        // //         message('success')

        // //         // after success \/
        // //         // console.log(loginNames)
        // //         // setLoading(true)
        // //         // onClose()
        // //     }
        // // } else { 
        // //     message(t('err.fill_all_fields'))
        // // }

        // if (!teacher?.lastName || !teacher?.firstName || !teacher?.role || !teacher?.code || !teacher?.loginName || !teacher?.phoneNumber || !teacher?.gender || !teacher?.title || !teacher?.grade)
        //     return message(t('err.fill_all_fields'))
        // else if (gradeRows.length == 1 && gradeRows?.[0]?.grade && !gradeRows?.[0]?.subjects.length)
        //     return message(t('err.fill_all_fields'))
        // else if (gradeRows.length > 1 && !gradeRows.every(el => { return el.grade && el.subjects.length }))
        //     return message(t('err.fill_all_fields'))
        // else
        //     return true

        // if (validateFields()) {
            // setLoading(true)
            // const params = {
            //     ...teacher,
            //     subjects: JSON.stringify(gradeRows.map(el => ({ grade: el.grade, subjects: el.subjects }))),
            //     submit: 1,
            //     menu: 'teacher'
            // }
            // fetchRequest(schoolTeacherSubmit, 'POST', params)
            //     .then((res) => {
            //         if (res.success) {
            //             if (res.data.isForce) {
            //                 setViewForceCreateModal(true)
            //                 setForceCreateMessage(res.data.message)
            //             } else {
            //                 message(res.data.message, true)
            //                 onSubmit()
            //                 // console.log({...params, ...res.data.user})
            //                 onClose()
            //             }
            //         } else {
            //             message(res.data.message)
            //         }
            //         setLoading(false)
            //     })
            //     .catch(() => {
            //         message(t('err.error_occurred'))
            //         setLoading(false)
            //     })
        // }
    }

    // const handleForceCreate = () => {
    //     if (validateFields()) {
    //         setLoading(true)
    //         const params = {
    //             ...teacher,
    //             subjects: JSON.stringify(gradeRows.map(el => ({ grade: el.grade, subjects: el.subjects }))),
    //             submit: 1,
    //             forceSave: 1,
    //             menu: 'teacher'
    //         }
    //         fetchRequest(schoolTeacherSubmit, 'POST', params)
    //             .then((res) => {
    //                 if (res.success) {
    //                     message(res.data.message, true)
    //                     onSubmit()
    //                     onClose()
    //                 } else {
    //                     message(res.data.message)
    //                 }
    //                 setLoading(false)
    //             })
    //             .catch(() => {
    //                 message(t('err.error_occurred'))
    //                 setLoading(false)
    //             })
    //     }
    // }

    // const handleChange = (name, value) => {
    //     setTeacher({ ...teacher, [name]: value })
    // }

    const handleAvatarUpload = params => {
        setTeacher({ ...teacher, photo: params.image, fileType: params.imageType, })
    }

    const handleAvatarRemove = () => {
        setTeacher({ ...teacher, photo: undefined, fileType: undefined, })
    }

    const validateFields = () => {
        if (!teacher?.lastName || !teacher?.firstName || !teacher?.role || !teacher?.code || !teacher?.loginName || !teacher?.phoneNumber || !teacher?.gender || !teacher?.title || !teacher?.grade)
            return message(t('err.fill_all_fields'))
        else if (gradeRows.length == 1 && gradeRows?.[0]?.grade && !gradeRows?.[0]?.subjects.length)
            return message(t('err.fill_all_fields'))
        else if (gradeRows.length > 1 && !gradeRows.every(el => { return el.grade && el.subjects.length }))
            return message(t('err.fill_all_fields'))
        else
            return true
    }

    const handleRowGradeChange = (index, value, options) => {
        const rows = [...gradeRows]
        if (value) {
            const option = options?.find(option => option?.value == value)
            // option.disabled = true
            rows[index].subjectOptions = option?.subjects
            rows[index].grade = value
        } else {
            const option = options?.find(option => option?.value == rows[index]?.grade)
            delete option?.disabled
            rows[index].subjects = []
            rows[index].subjectOptions = []
            rows[index].grade = null
        }
        setGradeRows(rows)
    }

    const handleRowSubjectsChange = (index, value) => {
        const rows = [...gradeRows]
        rows[index].subjects = value
        setGradeRows(rows)
    }

    const addGradeRow = () => {
        if (gradeSubjectOptions?.length > gradeRows?.length) {
            setGradeRows([...gradeRows, {
                grade: null,
                subjects: [],
                subjectOptions: [],
            }])
        }
    }

    const removeGradeRow = index => {
        if (index != 0) {
            const rows = [...gradeRows]
            const option = gradeSubjectOptions?.find(option => option?.value == rows[index].grade)
            delete option?.disabled
            rows.splice(index, 1)
            setGradeRows(rows)
        }
    }

    return (
        <Modal
            dimmer='blurring'
            show={true}
            size="xl"
            aria-labelledby="contained-modal-title-vcenter"
            onHide={onClose}
            // className='react-modal overflow-modal'
            centered
        >
            <Modal.Header closeButton style={{padding: '1rem'}}>
                <Modal.Title className="modal-title d-flex flex-row justify-content-between w-100">
                    {t('teacher.add_teacher')}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="row mt-4">
                    <div className="col-3 d-flex flex-column align-items-center" style={{ gap: 10 }}>
                        <img
                            className="img-responsive img-circle"
                            src={teacher?.photo || '/img/profile/placeholder.jpg'}
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
                    <div className="col-8">
                        <div className="form-group m-form__group row">
                            <Forms
                                ref={formRef}
                                fields={addTeacherFields}
                            />
                        </div>
                        {
                            gradeRows?.map((el, index) => (
                                <div key={index} className="form-group m-form__group row">
                                    <label className="col-3 col-form-label text-right label-pinnacle-bold">
                                        {index == 0 && t('teacher.subjects')}
                                    </label>
                                    <div className="col-3">
                                        <Dropdown
                                            placeholder={'-' + t('err.select_class') + ' - '}
                                            fluid
                                            selection
                                            additionPosition='bottom'
                                            upward={false}
                                            closeOnChange
                                            clearable
                                            selectOnBlur={false}
                                            value={el?.grade}
                                            options={gradeSubjectOptions}
                                            onChange={(e, data) => handleRowGradeChange(index, data?.value, data?.options)}
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
                                            value={el?.subjects}
                                            options={el?.subjectOptions}
                                            onChange={(e, data) => handleRowSubjectsChange(index, data?.value)}
                                        />
                                        <div style={{ paddingRight: '0.71rem'}} className={index != 0 ? 'visible' : 'invisible'}>
                                            <button onClick={() => removeGradeRow(index)} className='btn btn-danger m-btn m-btn--icon btn-sm m-btn--icon-only m-btn--pill'>
                                                <i className="la la-close" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        }
                        {
                            gradeSubjectOptions?.length > gradeRows?.length &&
                            <div className="form-group m-form__group row">
                                <div className="col-11 d-flex justify-content-end align-items-center">
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
                <div className='doubleModal'>
                    <ImageModal
                        onClose={() => setViewImageModal(false)}
                        onSubmit={handleAvatarUpload}
                    />
                </div>
            }
            {
                viewForceCreateModal &&
                <ForceCreateModal
                    onClose={() => setViewForceCreateModal(false)}
                    onSubmit={handleForceCreate}
                    message={forceCreateMessage}
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

export default AddTeacherModal