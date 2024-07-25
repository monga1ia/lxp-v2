import { useState } from 'react'
import message from 'modules/message'
import { Modal, Row, Col } from 'react-bootstrap'
import React, { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux';
import ImageModal from 'utils/imageModal'
import ForceCreateModal from './forceCreate'
import secureLocalStorage from 'react-secure-storage'
import { NDropdown as Dropdown } from 'widgets/Dropdown'
import { useTranslation } from "react-i18next";
import Forms from 'modules/Form/Forms'
import { fetchRequest } from 'utils/fetchRequest';
import { schoolTeacherCreate } from 'utils/fetchRequest/Urls';

const AddTeacherModal = ({ onClose, onSubmit, data }) => {

    const { t } = useTranslation();
    const { selectedSchool } = useSelector(state => state.schoolData);
    const formRef = useRef();

    const [loading, setLoading] = useState(false)
    const [viewImageModal, setViewImageModal] = useState(false)
    const [viewForceCreateModal, setViewForceCreateModal] = useState(false)

    const [teacher, setTeacher] = useState({})
    const [roleOptions, setRoleOptions] = useState([])
    const [gradeOptions, setGradeOptions] = useState([])
    const [forceCreateMessage, setForceCreateMessage] = useState('')
    const [gradeSubjectOptions, setGradeSubjectOptions] = useState([])
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

    const teacherFields = (roles = [], selectedRole = null, grades = []) => {
        return [
            {
                key: 'role',
                label: `${t('role')}*`,
                labelBold: true,
                value: selectedRole,
                type: 'nDropdown',
                required: true,
                errorMessage: t('error.selectRole'),
                className: "form-control",
                upperCase: true,
                formContainerClassName: 'form-group m-form__group row',
                fieldContainerClassName: 'col-8',
                labelClassName: "col-3 text-right label-pinnacle-bold mr-0",
                options: roles,
            },
            {
                key: 'code',
                label: `${t('teacher.code')}*`,
                className: "form-control",
                labelBold: true,
                value: '',
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
                value: '',
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
                value: '',
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
                value: '',
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
                value: '',
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
                value: '',
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
                value: '',
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
                key: 'grade',
                label: `${t('school')}*`,
                labelBold: true,
                className: "form-control",
                fieldContainerClassName: 'col-8',
                value: '',
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
                value: '',
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
        fetchRequest(schoolTeacherCreate, 'POST', params, false, true)
            .then((res) => {
                if (res.success) {
                    let selectedRole = null;
                    setRoleOptions(res?.roleLists || [])
                    setGradeOptions(res?.grades || [])
                    setGradeSubjectOptions(res?.gradeWithSubjects || [])
                    if (res?.roleLists?.length === 1) {
                        selectedRole = res?.roleLists[0]?.value;
                    }
                    formRef?.current?.updateFields && formRef.current?.updateFields(teacherFields(res?.roleLists, selectedRole, res?.grades));
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
        const formData = new FormData();
        formData.append('school', selectedSchool?.id)
        loadData(formData)
    }, [])

    const handleSubmit = () => {
        const [formsValid, formValues] = formRef.current.validate();

        if (formsValid) {
            if (gradeRows.length == 1 && gradeRows?.[0]?.grade && !gradeRows?.[0]?.subjects.length) {
                return message(t('err.fill_all_fields'))
            } else if (gradeRows.length > 1 && !gradeRows.every(el => { return el.grade && el.subjects.length })) {
                return message(t('err.fill_all_fields'))
            } else {
                const formData = new FormData();
                formData.append('school', selectedSchool?.id)
                formData.append('subjects', JSON.stringify(gradeRows.map(el => ({ grade: el.grade, subjects: el.subjects }))))
                formData.append('submit', 1)
                formData.append('menu', 'teacher')
                formData.append('photo', teacher?.photo)
                formData.append('fileType', teacher?.fileType)

                const params = {
                    ...teacher,
                    subjects: JSON.stringify(gradeRows.map(el => ({ grade: el.grade, subjects: el.subjects }))),
                    submit: 1,
                    menu: 'teacher'
                }

                let roleName = '';
                for (let x = 0; x < formValues.length; x++) {
                    if (formValues[x].key == 'role') {
                        roleName = formValues[x]?.options?.find(obj => obj?.value === formValues[x].value)?.text;
                    }
                    formData.append(formValues[x].key, formValues[x].value)
                    params[formValues[x].key] = formValues[x].value
                }

                formData.append('roleName', roleName)
                params.roleName = roleName;

                setLoading(true)
                fetchRequest(schoolTeacherCreate, 'POST', formData, true, true)
                    .then((res) => {
                        if (res.success) {
                            if (res.isForce) {
                                setViewForceCreateModal(true)
                                setForceCreateMessage(res.message)
                            } else {
                                message(res.message, true)
                                onClose(true)
                            }
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
        }
        else {
            message(t('err.fill_all_fields'))
        }
    }

    const handleForceCreate = () => {

        const [formsValid, formValues] = formRef.current.validate();

        if (formsValid) {
            if (gradeRows.length == 1 && gradeRows?.[0]?.grade && !gradeRows?.[0]?.subjects.length) {
                return message(t('err.fill_all_fields'))
            } else if (gradeRows.length > 1 && !gradeRows.every(el => { return el.grade && el.subjects.length })) {
                return message(t('err.fill_all_fields'))
            } else {
                const formData = new FormData();
                formData.append('school', selectedSchool?.id)
                formData.append('subjects', JSON.stringify(gradeRows.map(el => ({ grade: el.grade, subjects: el.subjects }))))
                formData.append('submit', 1)
                formData.append('forceSave', 1)
                formData.append('menu', 'teacher')
                formData.append('photo', teacher?.photo)
                formData.append('fileType', teacher?.fileType)


                let roleName = '';
                for (let x = 0; x < formValues.length; x++) {
                    if (formValues[x].key == 'role') {
                        roleName = formValues[x]?.options?.find(obj => obj?.value === formValues[x].value)?.text;
                    }
                    formData.append(formValues[x].key, formValues[x].value)
                }

                formData.append('roleName', roleName)
                setLoading(true)
                fetchRequest(schoolTeacherCreate, 'POST', formData, true, true)
                    .then((res) => {
                        if (res.success) {
                            if (res.isForce) {
                                setViewForceCreateModal(true)
                                setForceCreateMessage(res.message)

                                onClose(true)
                            } else {
                                message(res.message, true)
                                window.location.reload()
                            }
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
        }
    }

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
            onHide={() => onClose()}
            centered
        >
            <Modal.Header closeButton style={{ padding: '1rem' }}>
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
                        <div className="form-group m-form__group row mb-0">
                            <Forms
                                ref={formRef}
                                fields={teacherFields(roleOptions)}
                            />
                        </div>

                        <div className="form-group m-form__group row mb-0">
                            <div>
                                <form>
                                    {
                                        gradeRows?.map((el, index) => (
                                            <div key={index} className="form-group m-form__group row" style={{
                                                display: 'flex'
                                            }}>
                                                <label className="col-form-label col-3 text-right label-pinnacle-bold mr-0" style={{
                                                    display: 'flex',
                                                    flex: '1 1 0%',
                                                    justifyContent: 'flex-end',
                                                    alignItems: 'center',
                                                    marginRight: 10,
                                                    marginBottom: 0,
                                                    width: 'auto'
                                                }}>
                                                    {index == 0 && t('teacher.subjects')}
                                                </label>
                                                <div class="col-form-field-container col-8" style={{
                                                    display: 'flex',
                                                    flex: '1 1 0%',
                                                    flexDirection: 'column',
                                                    marginLeft: 10,
                                                    width: 'auto'
                                                }}>
                                                    <Row className='m-0'>
                                                        <Col md={5} style={{
                                                            paddingLeft: 0,
                                                            paddingRight: 10
                                                        }}>
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
                                                        </Col>
                                                        <Col md={7} className='d-flex p-0 align-items-center'>
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
                                                            <div style={{ paddingRight: '0.71rem' }} className={index != 0 ? 'visible' : 'invisible'}>
                                                                <button onClick={() => removeGradeRow(index)} className='btn btn-danger m-btn m-btn--icon btn-sm m-btn--icon-only m-btn--pill'>
                                                                    <i className="la la-close" />
                                                                </button>
                                                            </div>
                                                        </Col>
                                                    </Row>
                                                </div>
                                            </div>
                                        ))
                                    }
                                    {
                                        gradeSubjectOptions?.length > gradeRows?.length &&
                                        <div className="form-group m-form__group row" style={{
                                            display: 'flex'
                                        }}>

                                            <label className="col-form-label col-3 text-right label-pinnacle-bold mr-0" style={{
                                                display: 'flex',
                                                flex: '1 1 0%',
                                                justifyContent: 'flex-end',
                                                alignItems: 'center',
                                                marginRight: 10,
                                                marginBottom: 0,
                                                width: 'auto'
                                            }}></label>

                                            <div class="col-form-field-container col-8" style={{
                                                display: 'flex',
                                                flex: '1 1 0%',
                                                flexDirection: 'column',
                                                marginLeft: 10,
                                                width: 'auto'
                                            }}>
                                                <Row>
                                                    <Col md={5} style={{
                                                        paddingLeft: 0,
                                                        paddingRight: 10
                                                    }}></Col>
                                                    <Col md={7} className='d-flex p-0 justify-content-end'>
                                                        <div style={{ paddingRight: '0.71rem' }}>
                                                            <button onClick={() => addGradeRow()}
                                                                type='button'
                                                                className='btn btn-outline-info m-btn m-btn--icon btn-sm m-btn--icon-only m-btn--pill'>
                                                                <i className="la la-plus" />
                                                            </button>
                                                        </div>
                                                    </Col>
                                                </Row>
                                            </div>
                                        </div>
                                    }
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer className="text-center">
                <button
                    onClick={() => onClose()}
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

export default AddTeacherModal