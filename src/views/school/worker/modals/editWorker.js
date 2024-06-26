import { useState } from 'react'
import message from 'modules/message'
import React, { useEffect } from 'react'
import { Modal } from 'react-bootstrap'
import ImageModal from 'utils/imageModal'
import secureLocalStorage from 'react-secure-storage'
import { NDropdown as Dropdown } from 'widgets/Dropdown'
import { useTranslation } from "react-i18next";

const EditWorkerModal = ({onClose, onSubmit, data}) => {

    const { t } = useTranslation();
    const [staffData, setStaffData] = useState(data)
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

    // useEffect(() => {
    //     if (!location?.state?.id) {
    //         message(translations(locale)?.staff?.select)
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
    //             message(translations(locale)?.err?.error_occurred)
    //             setLoading(false)
    //         })
    // }, [])


    const handleSubmit = () => {
        if (validateFields()) {
            console.log('success')
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
        } else{
            console.log('fail')
        }
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

    const validateFields = () => {
        if (!staff?.lastName || !staff?.firstName || !staff?.code || !staff?.phoneNumber || !staff?.gender || !staff?.title) {
            return message(translations(locale).err.fill_all_fields)
        }
        else {
            staff.isTeacher = 0
            if (staff?.avatar?.startsWith('data')) {
                staff.photo = staff.avatar
            }
            return true
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
                    {t('staff.title')}
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
                    <div className="col-6">
                        <div className="form-group m-form__group row">
                            <label className="col-4 col-form-label text-right label-pinnacle-bold">
                                {t('role')}*
                            </label>
                            <div className="col-8">
                                <Dropdown
                                    placeholder={'-' + t('select') + '-'}
                                    fluid
                                    selection
                                    additionPosition='bottom'
                                    upward={false}
                                    closeOnChange
                                    selectOnBlur={false}
                                    value={staff?.roleId}
                                    options={roleOptions}
                                    disabled
                                />
                            </div>
                        </div>
                        <div className="form-group m-form__group row">
                            <label className="col-4 col-form-label text-right label-pinnacle-bold">
                                {t('staff.code')}*
                            </label>
                            <div className="col-8">
                                <input
                                    type="text"
                                    className="form-control"
                                    value={staff?.code || ''}
                                    placeholder={t('staff.code')}
                                    onChange={(e) => handleChange('code', e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="form-group m-form__group row">
                            <label className="col-4 col-form-label text-right label-pinnacle-bold">
                                {t('teacher.new_lastname')}*
                            </label>
                            <div className="col-8">
                                <input
                                    type="text"
                                    className="form-control"
                                    value={staff?.lastName || ''}
                                    placeholder={t('teacher.new_lastname_placeholder')}
                                    onChange={(e) => handleChange('lastName', e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="form-group m-form__group row">
                            <label className="col-4 col-form-label text-right label-pinnacle-bold">
                                {t('teacher.new_name')}*
                            </label>
                            <div className="col-8">
                                <input
                                    type="text"
                                    className="form-control"
                                    value={staff?.firstName || ''}
                                    placeholder={t('teacher.new_name_placeholder')}
                                    onChange={(e) => handleChange('firstName', e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="form-group m-form__group row">
                            <label className="col-4 col-form-label text-right label-pinnacle-bold">
                                {t('register_number')}
                            </label>
                            <div className="col-8">
                                <input
                                    type="text"
                                    className="form-control"
                                    value={staff?.registrationNumber || ''}
                                    placeholder={t('register_number')}
                                    onChange={(e) => handleChange('registrationNumber', e?.target?.value?.toString()?.toUpperCase()?.replace(/\s/g, ''))}
                                />
                            </div>
                        </div>
                        <div className="form-group m-form__group row">
                            <label className="col-4 col-form-label text-right label-pinnacle-bold">
                                {t('teacher.login_name')}*
                            </label>
                            <div className="col-8">
                                <input
                                    type="text"
                                    className="form-control"
                                    value={staff?.loginName || ''}
                                    placeholder={t('teacher.login_name')}
                                    disabled
                                />
                            </div>
                        </div>
                        <div className="form-group m-form__group row">
                            <label className="col-4 col-form-label text-right label-pinnacle-bold">
                                {t('studentBook.email')}
                            </label>
                            <div className="col-8">
                                <input
                                    type="email"
                                    className="form-control"
                                    value={staff?.email || ''}
                                    placeholder={t('e_mail')}
                                    onChange={(e) => handleChange('email', e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="form-group m-form__group row">
                            <label className="col-4 col-form-label text-right label-pinnacle-bold">
                                {t('teacher.phone_number')}*
                            </label>
                            <div className="col-8">
                                <input
                                    type="number"
                                    max={99999999}
                                    className="form-control"
                                    value={staff?.phoneNumber || ''}
                                    placeholder={t('teacher.phone_number')}
                                    onChange={(e) => handleChange('phoneNumber', e.target.value)}
                                    inputMode="numeric"
                                />

                            </div>
                        </div>
                        <div className="form-group m-form__group row">
                            <label className="col-4 col-form-label text-right label-pinnacle-bold">
                                {t('teacher.gender')}*
                            </label>
                            <div className="col-8">
                                <Dropdown
                                    placeholder={'-' + t('teacher.select_gender') + '-'}
                                    fluid
                                    selection
                                    additionPosition='bottom'
                                    upward={false}
                                    closeOnChange
                                    selectOnBlur={false}
                                    value={staff?.gender}
                                    options={genderOptions}
                                    onChange={(e, data) => handleChange('gender', data?.value)}
                                />
                            </div>
                        </div>
                        <div className="form-group m-form__group row">
                            <label className="col-4 col-form-label text-right label-pinnacle-bold">
                                {t('teacher.teacher_title')}*
                            </label>
                            <div className="col-8">
                                <input
                                    type="text"
                                    className="form-control"
                                    value={staff?.title || ''}
                                    placeholder={t('teacher.insert_teacher_title')}
                                    onChange={(e) => handleChange('title', e.target.value)}
                                />
                            </div>
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