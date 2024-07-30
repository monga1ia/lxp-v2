import { useState } from 'react'
import message from 'modules/message'
import { Modal } from 'react-bootstrap'
import React, { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux';
import ImageModal from 'utils/imageModal'
import secureLocalStorage from 'react-secure-storage'
import { NDropdown as Dropdown } from 'widgets/Dropdown'
import { useTranslation } from "react-i18next";
import Forms from 'modules/Form/Forms'
import { fetchRequest } from 'utils/fetchRequest';
import { schoolTeacherCreate } from 'utils/fetchRequest/Urls';

const AddStudentModal = ({ onClose, onSubmit, data }) => {

    const { t } = useTranslation();
    const localSchool = secureLocalStorage.getItem('selectedSchool')
    // const [selectedClass, setSelectedClass] = useSelector(state => state.classData);
    const [selectedClass, setSelectedClass] = useState({});
    const formRef = useRef();

    const [loading, setLoading] = useState(false)
    const [viewImageModal, setViewImageModal] = useState(false)
    // const [viewForceCreateModal, setViewForceCreateModal] = useState(false)

    const [student, setStudent] = useState({})
    // const [roleOptions, setRoleOptions] = useState([])
    // const [gradeOptions, setGradeOptions] = useState([])
    // const [forceCreateMessage, setForceCreateMessage] = useState('')
    // const [gradeSubjectOptions, setGradeSubjectOptions] = useState([])
    // const [gradeRows, setGradeRows] = useState([{
    //     grade: null,
    //     subjects: [],
    //     subjectOptions: []
    // }])
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

    const studentFields = () => {
        return [
            {
                key: 'code',
                label: `${t('student.student_code')}*`,
                className: "form-control",
                labelBold: true,
                value: '',
                type: 'text',
                required: true,
                errorMessage: t('error.enterStudentCode'),
                formContainerClassName: 'form-group m-form__group row',
                fieldContainerClassName: 'col-8',
                placeholder: t('student.enter_student_code'),
                labelClassName: "col-3 text-right label-pinnacle-bold mr-0"
            },
            {
                key: 'lastName',
                label: `${t('student.last_name')}*`,
                labelBold: true,
                className: "form-control",
                fieldContainerClassName: 'col-8',
                value: '',
                type: 'text',
                required: true,
                errorMessage: t('error.enterLastname'),
                formContainerClassName: 'form-group m-form__group row',
                placeholder: t('student.enter_last_name'),
                labelClassName: "col-3 text-right label-pinnacle-bold mr-0"
            },
            {
                key: 'firstName',
                label: `${t('student.first_name')}*`,
                labelBold: true,
                className: "form-control",
                fieldContainerClassName: 'col-8',
                value: '',
                type: 'text',
                required: true,
                errorMessage: t('error.enterFirstname'),
                formContainerClassName: 'form-group m-form__group row',
                placeholder: t('student.enter_first_name'),
                labelClassName: "col-3 text-right label-pinnacle-bold mr-0"
            },
            {
                key: 'gender',
                label: `${t('student.gender')}*`,
                labelBold: true,
                className: "form-control",
                fieldContainerClassName: 'col-8',
                value: '',
                type: 'nDropdown',
                options: genderOptions,
                required: true,
                errorMessage: t('error.selectGender'),
                formContainerClassName: 'form-group m-form__group row',
                placeholder: '-' + t('student.enter_gender') + '-',
                labelClassName: "col-3 text-right label-pinnacle-bold mr-0"
            },
            {
                key: 'contact',
                label: `${t('student.phone_number')}*`,
                labelBold: true,
                className: "form-control",
                fieldContainerClassName: 'col-8',
                value: '',
                type: 'number',
                required: true,
                errorMessage: t('error.enterPhone'),
                formContainerClassName: 'form-group m-form__group row',
                placeholder: t('student.enter_phone_number'),
                labelClassName: "col-3 text-right label-pinnacle-bold mr-0"
            },
            {
                key: 'registrationNumber',
                label: `${t('student.register_number')}`,
                labelBold: true,
                className: "form-control",
                fieldContainerClassName: 'col-8',
                value: '',
                required: true,
                errorMessage: t('error.register_number'),
                type: 'textUppercase',
                formContainerClassName: 'form-group m-form__group row',
                placeholder: t('student.enter_register_number'),
                labelClassName: "col-3 text-right label-pinnacle-bold mr-0"
            },
            {
                key: 'birthDate',
                label: `${t('student.birth_date')}*`,
                labelBold: true,
                className: "form-control",
                fieldContainerClassName: 'col-8',
                value: '',
                type: 'text',
                required: true,
                errorMessage: t('error.enterBirthDate'),
                formContainerClassName: 'form-group m-form__group row',
                placeholder: t('student.enter_birth_date'),
                labelClassName: "col-3 text-right label-pinnacle-bold mr-0"
            },
            {
                key: 'startDate',
                label: `${t('student.entry_date')}`,
                labelBold: true,
                className: "form-control",
                fieldContainerClassName: 'col-8',
                value: '',
                type: 'text',
                formContainerClassName: 'form-group m-form__group row',
                placeholder: t('student.enter_entry_date'),
                labelClassName: "col-3 text-right label-pinnacle-bold mr-0"
            },
        ]
    }

    const loadData = (params = {}) => {
        setLoading(true)
        
    }

    useEffect(() => {
        const formData = new FormData();
        formData.append('class', selectedClass?.id)
        // loadData(formData)
    }, [])

    const handleSubmit = () => {
        
       
    }

    

    const handleAvatarUpload = params => {
        setStudent({ ...student, photo: params.image, fileType: params.imageType})
    }

    const handleAvatarRemove = () => {
        setStudent({ ...student, photo: undefined, fileType: undefined, })
    }

    const validateFields = () => {
        if (!student?.lastName || !student?.firstName || !student?.code || !student?.phoneNumber || !student?.gender || !student?.contact || !student?.registrationNumber || !student?.birthDate || !student?.startDate)
            return message(t('err.fill_all_fields'))
        
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
                    {t('student.register_student')}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="row mt-4">
                    <div className="col-3 d-flex flex-column align-items-center" style={{ gap: 10 }}>
                        <img
                            className="img-responsive img-circle"
                            src={student?.photo || '/img/profile/placeholder.jpg'}
                            onError={(e) => {
                                e.student.onError = null
                                e.student.src = '/img/profile/avatar.png'
                            }}
                            width={150}
                            height={150}
                        />
                        <button
                            onClick={() => setViewImageModal(true)}
                            className="btn m-btn--pill btn-outline-primary"
                            style={{ width: 150 }}
                        >
                            {t('student.insert_photo')}
                        </button>
                        <button
                            onClick={handleAvatarRemove}
                            className="btn m-btn--pill btn-outline-danger"
                            style={{ width: 150 }}
                        >
                            {t('profile.img_delete')}
                        </button>
                    </div>
                    <div className="col-8">
                        <div className="form-group m-form__group row mb-0">
                            <Forms
                                ref={formRef}
                                fields={studentFields()}
                            />
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

export default AddStudentModal