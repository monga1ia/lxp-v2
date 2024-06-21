import { useState } from 'react'
import message from 'modules/message'
import React, { useEffect } from 'react'
import { Modal } from 'react-bootstrap'
import ImageModal from 'utils/imageModal'
import secureLocalStorage from 'react-secure-storage'
import Select from 'modules/Form/Select'
import { useTranslation } from "react-i18next";

const EditWorkerModal = ({onClose, onSubmit, data}) => {

    const { t } = useTranslation();
    
    const staffId = data

    const locale = secureLocalStorage?.getItem('selectedLang') || 'mn'
    const [loading, setLoading] = useState(false)
    const [viewImageModal, setViewImageModal] = useState(false)

    const [staff, setStaff] = useState({})

    const [roleOptions, setRoleOptions] = useState([{value: '11', text: '111'}, {value: '22', text: 'asdf'}])
    const [gradeOptions, setGradeOptions] = useState([{value: '11', text: '111'}, {value: '22', text: 'asdf'}])
    const [gradeSubjectOptions, setGradeSubjectOptions] = useState([{value: '11', text: '111'}, {value: '22', text: 'asdf'}])

    const [updateView, setUpdateView] = useState(false)

    const [genderOptions] = useState([
        {
            value: 'M',
            text: t(locale).male,
        },
        {
            value: 'F',
            text: t(locale).female,
        }
    ])


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
            //         message(t(locale)?.err?.error_occurred)
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
        const list = gradeSubjectOptions;
        let hasError = false
        if (list?.length > 0) {
            for (let l = 0; l < list?.length; l++) {
                if (list[l].visible) {
                    if (list[l].value) {
                    } else {
                        hasError = true;
                        break;
                    }
                }
            }
        }
        if (!staff?.lastName || !staff?.firstName || !staff?.code || !staff?.phoneNumber || !staff?.gender || !staff?.title || !staff?.grade)
            return message(t(locale).err.fill_all_fields)
        else if (hasError)
            return message(t(locale).err.fill_all_fields)
        else
            return true
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
                    {t(locale)?.staff?.title}
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
                            {t(locale)?.teacher?.change_photo}
                        </button>
                        <button
                            onClick={handleAvatarRemove}
                            className="btn m-btn--pill btn-outline-danger "
                            style={{ width: 150 }}
                        >
                            {t(locale)?.profile?.img_delete}
                        </button>
                    </div>
                    <div className="col-6">
                        <div className="form-group m-form__group row">
                            <label className="col-4 col-form-label text-right label-pinnacle-bold">
                                {t(locale)?.role}*
                            </label>
                            <div className="col-8">
                                <Select
                                    clearable
                                    searchable
                                    options={roleOptions}
                                    disabled={true}
                                    value={staff?.roleId}
                                    // onChange={(e, data) => handleRowSubjectsChange(index, e)}
                                />
                                {/* <Dropdown
                                    placeholder={'-' + t(locale)?.select + '-'}
                                    fluid
                                    selection
                                    additionPosition='bottom'
                                    upward={false}
                                    closeOnChange
                                    selectOnBlur={false}
                                    value={teacher?.roleId}
                                    options={roleOptions}
                                    disabled
                                /> */}
                            </div>
                        </div>
                        <div className="form-group m-form__group row">
                            <label className="col-4 col-form-label text-right label-pinnacle-bold">
                                {t(locale)?.staff?.code}*
                            </label>
                            <div className="col-8">
                                <input
                                    type="text"
                                    className="form-control"
                                    value={staff?.code || ''}
                                    placeholder={t(locale)?.staff?.code}
                                    onChange={(e) => handleChange('code', e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="form-group m-form__group row">
                            <label className="col-4 col-form-label text-right label-pinnacle-bold">
                                {t(locale)?.teacher?.new_lastname}*
                            </label>
                            <div className="col-8">
                                <input
                                    type="text"
                                    className="form-control"
                                    value={staff?.lastName || ''}
                                    placeholder={t(locale)?.teacher?.new_lastname_placeholder}
                                    onChange={(e) => handleChange('lastName', e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="form-group m-form__group row">
                            <label className="col-4 col-form-label text-right label-pinnacle-bold">
                                {t(locale)?.teacher?.new_name}*
                            </label>
                            <div className="col-8">
                                <input
                                    type="text"
                                    className="form-control"
                                    value={staff?.firstName || ''}
                                    placeholder={t(locale)?.teacher?.new_name_placeholder}
                                    onChange={(e) => handleChange('firstName', e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="form-group m-form__group row">
                            <label className="col-4 col-form-label text-right label-pinnacle-bold">
                                {t(locale)?.register_number}
                            </label>
                            <div className="col-8">
                                <input
                                    type="text"
                                    className="form-control"
                                    value={staff?.registrationNumber || ''}
                                    placeholder={t(locale)?.register_number}
                                    onChange={(e) => handleChange('registrationNumber', e?.target?.value?.toString()?.toUpperCase()?.replace(/\s/g, ''))}
                                />
                            </div>
                        </div>
                        <div className="form-group m-form__group row">
                            <label className="col-4 col-form-label text-right label-pinnacle-bold">
                                {t(locale)?.teacher?.login_name}*
                            </label>
                            <div className="col-8">
                                <input
                                    type="text"
                                    className="form-control"
                                    value={staff?.loginName || ''}
                                    placeholder={t(locale)?.teacher?.login_name}
                                    disabled
                                />
                            </div>
                        </div>
                        <div className="form-group m-form__group row">
                            <label className="col-4 col-form-label text-right label-pinnacle-bold">
                                {t(locale)?.studentBook?.email}
                            </label>
                            <div className="col-8">
                                <input
                                    type="email"
                                    className="form-control"
                                    value={staff?.email || ''}
                                    placeholder={t(locale)?.e_mail}
                                    onChange={(e) => handleChange('email', e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="form-group m-form__group row">
                            <label className="col-4 col-form-label text-right label-pinnacle-bold">
                                {t(locale)?.teacher?.phone_number}*
                            </label>
                            <div className="col-8">
                                <input
                                    type="number"
                                    max={99999999}
                                    className="form-control"
                                    value={staff?.phoneNumber || ''}
                                    placeholder={t(locale)?.teacher?.phone_number}
                                    onChange={(e) => handleChange('phoneNumber', e.target.value)}
                                    inputMode="numeric"
                                />

                            </div>
                        </div>
                        <div className="form-group m-form__group row">
                            <label className="col-4 col-form-label text-right label-pinnacle-bold">
                                {t(locale)?.teacher?.gender}*
                            </label>
                            <div className="col-8">
                                <Select
                                    clearable
                                    searchable
                                    options={genderOptions}
                                    value={staff?.gender}
                                    onChange={(e, data) => handleChange('gender', e)}
                                />
                                {/* <Dropdown
                                    placeholder={'-' + t(locale)?.teacher?.select_gender + '-'}
                                    fluid
                                    selection
                                    additionPosition='bottom'
                                    upward={false}
                                    closeOnChange
                                    selectOnBlur={false}
                                    value={teacher?.gender}
                                    options={genderOptions}
                                    onChange={(e, data) => handleChange('gender', data?.value)}
                                /> */}
                            </div>
                        </div>
                        <div className="form-group m-form__group row">
                            <label className="col-4 col-form-label text-right label-pinnacle-bold">
                                {t(locale)?.teacher?.teacher_title}*
                            </label>
                            <div className="col-8">
                                <input
                                    type="text"
                                    className="form-control"
                                    value={staff?.title || ''}
                                    placeholder={t(locale)?.teacher?.insert_teacher_title}
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
                    className="btn m-btn--pill btn-link margin-right-5"
                >
                    {t(locale)?.back}
                </button>
                <button
                    onClick={handleSubmit}
                    className="btn m-btn--pill btn-success text-uppercase"
                >
                    {t(locale)?.save}
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