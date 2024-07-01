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

const AddWorkerModal = ({onClose, onSubmit, data}) => {

    const { t } = useTranslation();
    const formRef = useRef();

    const [loading, setLoading] = useState(false)
    const [viewImageModal, setViewImageModal] = useState(false)
    const [viewForceCreateModal, setViewForceCreateModal] = useState(false)
    const [forceCreateMessage, setForceCreateMessage] = useState('')

    const [staff, setStaff] = useState({})

    const [roleOptions, setRoleOptions] = useState([{value: '11', text: '111'}, {value: '22', text: 'asdf'}])
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

    const addWorkerFields = [
        {
            key: 'workerRole',
            label: `${t('role')}*`,
            labelBold: true,
            value: '',
            type: 'nDropdown',
            required: true,
            errorMessage: t('error.selectRole'),
            className: "form-control",
            upperCase: true,
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
            type: 'nonCryllic',
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
            required: true,
            errorMessage: t('error.enterLoginname'),
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
    //     setLoading(true)
    //     fetchRequest(schoolStaffSubmit, 'POST')
    //         .then((res) => {
    //             if (res.success) {
    //                 const { roleLists } = res.data
    //                 setRoleOptions(roleLists)
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
            message('success')

            // after success \/
            // onClose()
            // setLoading(true)
            // console.log(dataCollectorArray)
        } 
        else{
            message(t('err.fill_all_fields'))
        } 
        // if (validateFields()) {
        //     console.log("success")
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
        // } else {
        //     console.log("error")
        // }
    }

    const handleForceCreate = () => {
        console.log('handleForceCreate')
        // if (validateFields()) {
        //     setLoading(true)
        //     fetchRequest(schoolStaffSubmit, 'POST', { ...staff, submit: 1, forceSave: 1, menu: 'staff' })
        //         .then((res) => {
        //             if (res.success) {
        //                 message(res.data.message, true)
        //                 navigate('/school/staffs')
        //             } else {
        //                 message(res.data.message)
        //             }
        //             setLoading(false)
        //         })
        //         .catch(() => {
        //             message(t('err.error_occurred'))
        //             setLoading(false)
        //         })
        // }
    }

    const handleChange = (name, value) => {
        setStaff({ ...staff, [name]: value })
    }

    const handleAvatarUpload = params => {
        setStaff({ ...staff, photo: params.image, fileType: params.imageType, })
    }

    const handleAvatarRemove = () => {
        setStaff({ ...staff, photo: undefined, fileType: undefined, })
    }

    const validateFields = () => {
        if (!staff?.lastName || !staff?.firstName || !staff?.role || !staff?.code || !staff?.loginName || !staff?.phoneNumber || !staff?.gender || !staff?.title)
            return message(t('err.fill_all_fields'))
        else
            return true
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
                    {t('action.register')}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="row mt-4">
                    <div className="col-3 d-flex flex-column align-items-center" style={{ gap: 10 }}>
                        <img
                            className="img-responsive img-circle"
                            src={staff?.photo || '/img/profile/placeholder.jpg'}
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
                                fields={addWorkerFields}
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

export default AddWorkerModal