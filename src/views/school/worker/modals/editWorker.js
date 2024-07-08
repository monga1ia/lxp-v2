import { useState } from 'react'
import message from 'modules/message'
import React, { useEffect, useRef } from 'react'
import { Modal } from 'react-bootstrap'
import ImageModal from 'utils/imageModal'
import secureLocalStorage from 'react-secure-storage'
import { NDropdown as Dropdown } from 'widgets/Dropdown'
import { useTranslation } from "react-i18next";
import Forms from 'modules/Form/Forms'

const EditWorkerModal = ({onClose, onSubmit, id}) => {

    const { t } = useTranslation();
    const formRef = useRef();

    const [staffId, setStaffId] = useState(id)
    const [loading, setLoading] = useState(false)
    const [updateView, setUpdateView] = useState(false)
    const [viewImageModal, setViewImageModal] = useState(false)

    const [staff, setStaff] = useState({})

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

    const editWorkerFields = [
        {
            key: 'workerRole',
            label: `${t('role')}*`,
            labelBold: true,
            value: '',
            type: 'nDropdown',
            className: "form-control",
            upperCase: true,
            disabled: true,
            formContainerClassName: 'form-group m-form__group row',
            fieldContainerClassName: 'col-8',
            labelClassName: "col-3 text-right label-pinnacle-bold mr-0",
            options: roleOptions,
        },
        {
            key: 'workerCode',
            label: `${t('staff.code')}*`,
            className: "form-control",
            labelBold: true,
            value: '',
            type: 'text',
            required: true,
            errorMessage: t('error.enterStaffCode'),
            formContainerClassName: 'form-group m-form__group row',
            fieldContainerClassName: 'col-8',
            placeholder: t('staff.code'),
            labelClassName: "col-3 text-right label-pinnacle-bold mr-0"
        },
        {
            key: 'workerLastName',
            label: `${t('teacher.new_lastname')}*`,
            labelBold: true,
            className: "form-control",
            fieldContainerClassName: 'col-8',
            value: '',
            type: 'text',
            required: true,
            errorMessage: t('error.enterLastname'),
            formContainerClassName: 'form-group m-form__group row',
            placeholder: t('teacher.new_lastname_placeholder'),
            labelClassName: "col-3 text-right label-pinnacle-bold mr-0"
        },
        {
            key: 'workerFirstName',
            label: `${t('teacher.new_name')}*`,
            labelBold: true,
            className: "form-control",
            fieldContainerClassName: 'col-8',
            value: '',
            type: 'text',
            required: true,
            errorMessage: t('error.enterFirstname'),
            formContainerClassName: 'form-group m-form__group row',
            placeholder: t('teacher.new_name_placeholder'),
            labelClassName: "col-3 text-right label-pinnacle-bold mr-0"
        },
        {
            key: 'register_number',
            label: `${t('register_number')}`,
            labelBold: true,
            className: "form-control",
            fieldContainerClassName: 'col-8',
            value: '',
            type: 'textUppercase',
            formContainerClassName: 'form-group m-form__group row',
            placeholder: t('register_number'),
            labelClassName: "col-3 text-right label-pinnacle-bold mr-0"
        },
        {
            key: 'workerLoginName',
            label: `${t('teacher.login_name')}*`,
            labelBold: true,
            className: "form-control",
            fieldContainerClassName: 'col-8',
            value: '',
            type: 'text',
            disabled: true,
            formContainerClassName: 'form-group m-form__group row',
            placeholder: t('teacher.login_name'),
            labelClassName: "col-3 text-right label-pinnacle-bold mr-0"
        },
        {
            key: 'workerEmail',
            label: `${t('studentBook.email')}`,
            labelBold: true,
            className: "form-control",
            fieldContainerClassName: 'col-8',
            value: '',
            type: 'text',
            formContainerClassName: 'form-group m-form__group row',
            placeholder: t('e_mail'),
            labelClassName: "col-3 text-right label-pinnacle-bold mr-0"
        },
        {
            key: 'workerPhone',
            label: `${t('teacher.phone_number')}*`,
            labelBold: true,
            className: "form-control",
            fieldContainerClassName: 'col-8',
            value: '',
            type: 'number',
            required: true,
            errorMessage: t('error.enterPhone'),
            formContainerClassName: 'form-group m-form__group row',
            placeholder: t('teacher.phone_number'),
            labelClassName: "col-3 text-right label-pinnacle-bold mr-0"
        },
        {
            key: 'workerGender',
            label: `${t('teacher.gender')}*`,
            labelBold: true,
            className: "form-control",
            fieldContainerClassName: 'col-8',
            value: '',
            type: 'nDropdown',
            options: genderOptions,
            required: true,
            errorMessage: t('error.selectGender'),
            formContainerClassName: 'form-group m-form__group row',
            placeholder: '-' + t('teacher.select_gender') + '-',
            labelClassName: "col-3 text-right label-pinnacle-bold mr-0"
        },
        {
            key: 'workerTitle',
            label: `${t('teacher.teacher_title')}*`,
            labelBold: true,
            className: "form-control",
            fieldContainerClassName: 'col-8',
            value: '',
            type: 'text',
            required: true,
            errorMessage: t('error.enterTitle'),
            formContainerClassName: 'form-group m-form__group row',
            placeholder: t('teacher.insert_teacher_title'),
            labelClassName: "col-3 text-right label-pinnacle-bold mr-0"
        },
    ]

    // useEffect(() => {
    //     if (!location?.state?.id) {
    //         message(t('staff.select'))
    //         navigate('/school/staffs', { replace: true })
    //     }
    // }, [])

    // useEffect(() => {
    //     setLoading(true)
    //     fetchRequest(schoolStaffEdit, 'POST', { teacher: location?.state?.id, menu: 'staff' })
    //         .then((res) => {
    //             if (res.success) {
    //                 const { roleLists, teacherData } = res.data
    //                 setRoleOptions(roleLists || [])
    //                 setStaff(teacherData || {})
    //             } else {
    //                 message(res.data.message)
    //             }
    //             setLoading(false)
    //         })
    //         .catch(() => {
    //             message(t('err.error_occurred'))
    //             setLoading(false)
    //         })
    // }, [])


    const handleSubmit = () => {

        const [formsValid, formValues] = formRef.current.validate();

        if (formsValid) {
            const dataCollectorArray = []
            for (let x=0;x<formValues.length;x++) {
                dataCollectorArray.push({key: formValues[x].key, value: formValues[x].value, options: formValues[x].options})
            }
            message('success', true)

            // after success \/
            // onClose()
            // setLoading(true)
            // console.log(dataCollectorArray)
        } 
        else{
            message(t('err.fill_all_fields'))
        } 

        // if (validateFields()) {
        //     console.log('success')
            // setLoading(true)
            // fetchRequest(schoolStaffEdit, 'POST', { ...staff, submit: 1, teacher: location?.state?.id })
            //     .then((res) => {
            //         if (res.success) {
            //             message(res.data.message, true)
            //             navigate('/school/staffs')
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

    const handleChange = (name, value) => {
        console.log(staff)
        setStaff({ ...staff, [name]: value })
    }

    const handleAvatarUpload = params => {
        setStaff({ ...staff, avatar: params.image, fileType: params.imageType, })
    }

    const handleAvatarRemove = () => {
        setStaff({ ...staff, avatar: undefined, fileType: undefined, })
    }

    // const validateFields = () => {
    //     if (!staff?.lastName || !staff?.firstName || !staff?.code || !staff?.phoneNumber || !staff?.gender || !staff?.title) {
    //         return message(t('err.fill_all_fields)')
    //     }
    //     else {
    //         staff.isTeacher = 0
    //         if (staff?.avatar?.startsWith('data')) {
    //             staff.photo = staff.avatar
    //         }
    //         return true
    //     }
    // }

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
                            src={staff?.avatar || '/img/profile/placeholder.jpg'}
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
                                fields={editWorkerFields}
                            />
                        </div>
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

export default EditWorkerModal