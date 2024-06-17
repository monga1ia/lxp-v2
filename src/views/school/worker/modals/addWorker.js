import { useState } from 'react'
import message from 'modules/message'
import { Modal } from 'react-bootstrap'
import React, { useEffect } from 'react'
import ImageModal from 'utils/imageModal'
import secureLocalStorage from 'react-secure-storage'
import { translations } from 'utils/translations'
import Select from 'modules/Form/Select'

const AddWorkerModal = ({onClose, onSubmit, data}) => {

    const locale = secureLocalStorage?.getItem('selectedLang') || 'mn'
    const [loading, setLoading] = useState(false)

    const [viewImageModal, setViewImageModal] = useState(false)

    const [staff, setStaff] = useState({})

    const [gradeSubjectOptions, setGradeSubjectOptions] = useState([{value: '11', text: '111'}, {value: '22', text: 'asdf'}])

    const [gradeRows, setGradeRows] = useState([{
        grade: null,
        subjects: [],
        subjectOptions: []
    }])
    const [genderOptions] = useState([
        {
            value: 'M',
            text: translations(locale).male,
        },
        {
            value: 'F',
            text: translations(locale).female,
        }
    ])

    const [selecterDummy, setSelecterDummy] = useState([
        {value: "1", refId: "refId", gid: "2323", text: "text 1"},
        {value: "2", refId: "refId2", gid: "232", text: "text 2"},
        {value: "3", refId: "refId3", gid: "23", text: "text 3"},
    ])

    const handleSubmit = () => {
        if (validateFields()) {
            console.log("success")
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
            //         message(translations(locale)?.err?.error_occurred)
            //         setLoading(false)
            //     })
        } else {
            console.log("error")
        }
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
        if (!staff?.lastName || !staff?.firstName || !staff?.role || !staff?.code || !staff?.loginName || !staff?.phoneNumber || !staff?.gender || !staff?.title || !staff?.grade)
            return message(translations(locale).err.fill_all_fields)
        else if (gradeRows.length == 1 && gradeRows?.[0]?.grade && !gradeRows?.[0]?.subjects.length)
            return message(translations(locale).err.fill_all_fields)
        else if (gradeRows.length > 1 && !gradeRows.every(el => { return el.grade && el.subjects.length }))
            return message(translations(locale).err.fill_all_fields)
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
                    {translations(locale)?.teacher?.add_teacher}
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
                            {translations(locale)?.teacher?.change_photo}
                        </button>
                        <button
                            onClick={handleAvatarRemove}
                            className="btn m-btn--pill btn-outline-danger "
                            style={{ width: 150 }}
                        >
                            {translations(locale)?.profile?.img_delete}
                        </button>
                    </div>
                    <div className="col-6">
                        <div className="form-group m-form__group row">
                            <label className="col-4 col-form-label text-right label-pinnacle-bold">
                                {translations(locale)?.role}*
                            </label>
                            <div className="col-8">
                                <Select
                                    clearable
                                    searchable
                                    value={staff?.role}
                                    options={selecterDummy}
                                    onChange={(e, data) => handleChange('role', e)}
                                />
                                {/* <Dropdown
                                    placeholder={'-' + translations(locale)?.select + '-'}
                                    fluid
                                    selection
                                    additionPosition='bottom'
                                    upward={false}
                                    closeOnChange
                                    selectOnBlur={false}
                                    value={teacher?.role}
                                    options={roleOptions}
                                    onChange={(e, data) => handleChange('role', data?.value)}
                                /> */}
                            </div>
                        </div>
                        <div className="form-group m-form__group row">
                            <label className="col-4 col-form-label text-right label-pinnacle-bold">
                                {translations(locale)?.staff?.code}*
                            </label>
                            <div className="col-8">
                                <input
                                    type="text"
                                    className="form-control"
                                    value={staff?.code || ''}
                                    placeholder={translations(locale)?.staff?.code}
                                    onChange={(e) => handleChange('code', e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="form-group m-form__group row">
                            <label className="col-4 col-form-label text-right label-pinnacle-bold">
                                {translations(locale)?.teacher?.new_lastname}*
                            </label>
                            <div className="col-8">
                                <input
                                    type="text"
                                    className="form-control"
                                    value={staff?.lastName || ''}
                                    placeholder={translations(locale)?.teacher?.new_lastname_placeholder}
                                    onChange={(e) => handleChange('lastName', e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="form-group m-form__group row">
                            <label className="col-4 col-form-label text-right label-pinnacle-bold">
                                {translations(locale)?.teacher?.new_name}*
                            </label>
                            <div className="col-8">
                                <input
                                    type="text"
                                    className="form-control"
                                    value={staff?.firstName || ''}
                                    placeholder={translations(locale)?.teacher?.new_name_placeholder}
                                    onChange={(e) => handleChange('firstName', e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="form-group m-form__group row">
                            <label className="col-4 col-form-label text-right label-pinnacle-bold">
                                {translations(locale)?.register_number}
                            </label>
                            <div className="col-8">
                                <input
                                    type="text"
                                    className="form-control"
                                    value={staff?.registrationNumber || ''}
                                    placeholder={translations(locale)?.register_number}
                                    onChange={(e) => handleChange('registrationNumber', e?.target?.value?.toString()?.toUpperCase()?.replace(/\s/g, ''))}
                                />
                            </div>
                        </div>
                        <div className="form-group m-form__group row">
                            <label className="col-4 col-form-label text-right label-pinnacle-bold">
                                {translations(locale)?.teacher?.login_name}*
                            </label>
                            <div className="col-8">
                                <input
                                    type="text"
                                    className="form-control"
                                    value={staff?.loginName || ''}
                                    placeholder={translations(locale)?.teacher?.login_name}
                                    onChange={(e) => handleChange('loginName', e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="form-group m-form__group row">
                            <label className="col-4 col-form-label text-right label-pinnacle-bold">
                                {translations(locale)?.studentBook?.email}
                            </label>
                            <div className="col-8">
                                <input
                                    type="email"
                                    className="form-control"
                                    value={staff?.email || ''}
                                    placeholder={translations(locale)?.e_mail}
                                    onChange={(e) => handleChange('email', e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="form-group m-form__group row">
                            <label className="col-4 col-form-label text-right label-pinnacle-bold">
                                {translations(locale)?.teacher?.phone_number}*
                            </label>
                            <div className="col-8">
                                <input
                                    type="number"
                                    max={99999999}
                                    className="form-control"
                                    value={staff?.phoneNumber || ''}
                                    placeholder={translations(locale)?.teacher?.phone_number}
                                    onChange={(e) => handleChange('phoneNumber', e.target.value)}
                                    inputMode="numeric"
                                />

                            </div>
                        </div>
                        <div className="form-group m-form__group row">
                            <label className="col-4 col-form-label text-right label-pinnacle-bold">
                                {translations(locale)?.teacher?.gender}*
                            </label>
                            <div className="col-8">
                                <Select
                                    clearable
                                    searchable
                                    value={staff?.gender}
                                    options={selecterDummy}
                                    onChange={(e, data) => handleChange('gender', e)}
                                />
                                {/* <Dropdown
                                    placeholder={'-' + translations(locale)?.teacher?.select_gender + '-'}
                                    fluid
                                    selection
                                    additionPosition='bottom'
                                    upward={false}
                                    closeOnChange
                                    selectOnBlur={false}
                                    value={teacher?.gender}
                                    options={genderOptions}
                                    onChange={(e, data) => handleChange('gender', data?.value)}
                                >
                                    <Dropdown.Toggle id="dropdown-basic" className='form-control'>
                                        Dropdown Button
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu className='form-control'>
                                        <Dropdown.Item href="#/action-1">Option 1</Dropdown.Item>
                                        <Dropdown.Item href="#/action-2">Option 2</Dropdown.Item>
                                        <Dropdown.Item href="#/action-3">Option 3</Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown> */}
                            </div>
                        </div>
                        <div className="form-group m-form__group row">
                            <label className="col-4 col-form-label text-right label-pinnacle-bold">
                                {translations(locale)?.teacher?.teacher_title}*
                            </label>
                            <div className="col-8">
                                <input
                                    type="text"
                                    className="form-control"
                                    value={staff?.title || ''}
                                    placeholder={translations(locale)?.teacher?.insert_teacher_title}
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
                    {translations(locale)?.back}        
                </button>
                <button
                    onClick={handleSubmit}
                    className="btn m-btn--pill btn-success text-uppercase"
                >
                    {translations(locale)?.save}
                </button>
            </Modal.Footer>
            {
                viewImageModal &&
                <ImageModal
                    onClose={() => setViewImageModal(false)}
                    onSubmit={handleAvatarUpload}
                />
            }
            {/* {
                viewForceCreateModal &&
                <ForceCreateModal
                    onClose={() => setViewForceCreateModal(false)}
                    onSubmit={handleForceCreate}
                    message={forceCreateMessage}
                />
            } */}
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