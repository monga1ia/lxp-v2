import { Modal } from 'react-bootstrap'
import message from 'modules/message'
import HtmlHead from 'components/html-head/HtmlHead';
import { Dropdown } from 'semantic-ui-react'
import { movementInSubmit } from 'utils/fetchRequest/Urls'
import React, { useEffect, useState } from 'react'
import secureLocalStorage from 'react-secure-storage'
import { useTranslation } from "react-i18next";
import { fetchRequest } from 'utils/fetchRequest'
import DayPickerInput from 'react-day-picker/DayPickerInput'
import { Link, useLocation } from 'react-router-dom'
import { useNavigate } from 'react-router'

// const locale = secureLocalStorage?.getItem('selectedLang') || 'mn'

const studentCodeRegex = /[A-Za-zА-Яа-яӨҮөүЁё0-9-]+$/
const nameRegex = /^[A-Za-zА-Яа-яӨҮөүЁё-]+$/



const AddStudentMovementIn = ({onClose}) => {
    const { t } = useTranslation();
    // const navigate = useNavigate()
    const location = useLocation()

    const [loading, setLoading] = useState(false)
    

    const isGenerateCode = location?.state?.isGenerateCode || false

    const [students, setStudents] = useState([{
        startDate: new Date()?.toISOString()?.split('T')?.[0],
        code: '',
        lastName: '',
        firstName: '',
        birthDate: null,
        gender: null,
        registerNumber: ''
    }])

    const genderOptions = [
        {
            value: 'M',
            text: t('studentBook.male')
        },
        {
            value: 'F',
            text: t('studentBook.female')
        }
    ]

    const [tableData, setTableData] = useState([
        {id: 123, esisId: '123', esisGradeName: 'Baa', esisClassName: 'asdf', esisLastName: 'asdf', esisFirstName: 'asdfe', esisBirthDay: 'asdfe', esisGender: 'asdf',
            eschoolClassName: 'asdf', eschoolStudentCode: '213', eschoolLastName: 'Mas', eschoolFirstName: '123', eschoolGender: 'M'},
        {id: 123, eschoolId: 123, esisId: '123', esisGradeName: 'Baa', esisClassName: 'asdf', esisLastName: 'asdf', esisFirstName: 'asdfe', esisBirthDay: 'asdfe', esisGender: 'asdf',
            eschoolClassName: 'asdf', eschoolStudentCode: '213', eschoolLastName: 'Mas', eschoolFirstName: '123', eschoolGender: 'M'},
        {id: 123, eschoolId: '', esisId: '123', esisGradeName: 'Baa', esisClassName: 'asdf', esisLastName: 'asdf', esisFirstName: 'asdfe', esisBirthDay: 'asdfe', esisGender: 'asdf',
            eschoolClassName: 'asdf', eschoolStudentCode: '213', eschoolLastName: 'Mas', eschoolFirstName: '123', eschoolGender: 'M'},
    ])

    // useEffect(() => {
    //     if (!location?.state?.grade || !location?.state?.grade?.toString()?.startsWith('class')) {
    //         message(t('finance.select_class'))
    //         navigate(-1, { replace: true })
    //     }
    // }, [])

    const handleSubmit = () => {
        if (!validateFields()) return
        setLoading(true)
        // fetchRequest(movementInSubmit, 'POST', { submit: 1, students: JSON.stringify(students), grade: location?.state?.grade })
        //     .then((res) => {
        //         if (res.success) {
        //             message(res.data.message, true)
        //             navigate('/movement/in', { replace: true })
        //         } else {
        //             message(res.data.message)
        //         }
        //         setLoading(false)
        //     })
        //     .catch(() => {
        //         message(t('err.error_occurred'))
        //         setLoading(false)
        //     })
    }

    const handleChange = (index, name, value) => {
        const clone = [...students]
        clone[index][name] = value
        setStudents(clone)
    }

    const addStudents = () => {
        setStudents([...students, {
            startDate: new Date()?.toISOString()?.split('T')?.[0],
            code: '',
            lastName: '',
            firstName: '',
            birthDate: null,
            gender: null,
            registerNumber: ''
        }])
    }

    const removeStudent = (index) => {
        const clone = [...students]
        clone?.splice(index, 1)
        setStudents(clone)
    }

    const validateFields = () => {
        if (isGenerateCode) {
            if (!students?.every(el => el?.startDate && el?.lastName && el?.firstName && el?.gender))
                return message(t('err.fill_all_fields'))
            else
                students?.forEach(el => delete el?.code)
        }
        else {
            if (!students?.every(el => el?.code && el?.startDate && el?.lastName && el?.firstName && el?.gender))
                return message(t('err.fill_all_fields'))
        }
        return true
    }

    return (
        <Modal
            centered
            show={true}
            onHide={onClose}
            size='xxl'
            dimmer='blurring'
            aria-labelledby="contained-modal-title-vcenter"
        >
            <Modal.Header closeButton style={{padding: '1rem'}}>
                <Modal.Title className="modal-title d-flex flex-row justify-content-between w-100">
                    {t('movement.add_student')}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="row mt-4">
                <div className='m-content'>
                <div className='m-portlet'>
                    <div className='m-portlet__body'>
                        <table className='table table-bordered react-bootstrap-table mt-3'>
                            <thead>
                                <tr>
                                    {
                                        !isGenerateCode &&
                                        <th className='bolder' width={'15%'}>{t('student.student_code')}*</th>
                                    }
                                    <th className='bolder' width={'10%'}>{t('student.entry_date')}*</th>
                                    <th className='bolder' width={'15%'}>{t('student.last_name')}*</th>
                                    <th className='bolder' width={'15%'}>{t('student.first_name')}*</th>
                                    <th className='bolder' width={'10%'}>{t('student.birth_date')}</th>
                                    <th className='bolder' width={'8%'}>{t('gender')}*</th>
                                    <th className='bolder' width={'10%'}>{t('register_number')}</th>
                                    <th className='bolder' width={'10%'}>{t('movement.from_school_name')}</th>
                                    <th className='bolder' width={'1%'}></th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    students.map((el, key) =>
                                        <tr key={key}>
                                            {
                                                !isGenerateCode &&
                                                <td className='p-1'>
                                                    <input
                                                        value={el?.code}
                                                        className='form-control'
                                                        placeholder={t('student.student_code')}
                                                        onKeyPress={(e) => !studentCodeRegex.test(e.key) && e.preventDefault()}
                                                        onChange={(e) => handleChange(key, 'code', e?.target?.value?.toString()?.toUpperCase()?.replace(/\s/g, ''))}
                                                    />
                                                </td>
                                            }
                                            <td className='p-1'>
                                                <DayPickerInput
                                                    value={el?.startDate}
                                                    inputProps={{ className: 'form-control' }}
                                                    dayPickerProps={{ firstDayOfWeek: 1, disabledDays: { after: new Date() } }}
                                                    classNames={{ overlay: 'DayPickerInputOverlay', container: 'position-relative' }}
                                                    onDayChange={(day) => handleChange(key, 'startDate', day?.toISOString()?.split('T')?.[0])}
                                                />
                                            </td>
                                            <td className='p-1'>
                                                <input
                                                    value={el?.lastName}
                                                    className='form-control'
                                                    placeholder={t('student.last_name')}
                                                    onKeyPress={(e) => !nameRegex.test(e.key) && e.preventDefault()}
                                                    onChange={(e) => handleChange(key, 'lastName', e?.target?.value)}
                                                />
                                            </td>
                                            <td className='p-1'>
                                                <input
                                                    value={el?.firstName}
                                                    className='form-control'
                                                    placeholder={t('student.first_name')}
                                                    onKeyPress={(e) => !nameRegex.test(e.key) && e.preventDefault()}
                                                    onChange={(e) => handleChange(key, 'firstName', e?.target?.value)}
                                                />
                                            </td>
                                            <td className='p-1'>
                                                <DayPickerInput
                                                    value={el?.birthDate}
                                                    inputProps={{ className: 'form-control' }}
                                                    placeholder={t('student.birth_date')}
                                                    dayPickerProps={{ firstDayOfWeek: 1, disabledDays: { after: new Date() } }}
                                                    classNames={{ overlay: 'DayPickerInputOverlay', container: 'position-relative' }}
                                                    onDayChange={(day) => handleChange(key, 'birthDate', day?.toISOString()?.split('T')?.[0])}
                                                />
                                            </td>
                                            <td className='p-1'>
                                                <Dropdown
                                                    fluid
                                                    selection
                                                    closeOnChange
                                                    value={el?.gender}
                                                    options={genderOptions}
                                                    placeholder={'-' + t('select') + '-'}
                                                    onChange={(e, data) => handleChange(key, 'gender', data?.value)}
                                                />
                                            </td>
                                            <td className='p-1'>
                                                <input
                                                    className='form-control'
                                                    value={el?.registerNumber}
                                                    placeholder={t('register_number')}
                                                    onChange={(e) => handleChange(key, 'registerNumber', e?.target?.value?.toString()?.toUpperCase())}
                                                />
                                            </td>
                                            <td className='p-1'>
                                                <input
                                                    className='form-control'
                                                    value={el?.fromSchool}
                                                    placeholder={t('movement.from_school_name')}
                                                    onChange={(e) => handleChange(key, 'fromSchool', e?.target?.value?.toString())}
                                                />
                                            </td>
                                            <td className='p-1 text-center'>
                                                {
                                                    key > 0 &&
                                                    <button
                                                        className='btn btn-danger m-btn--icon btn-sm m-btn--icon-only m-btn--pill'
                                                        onClick={() => removeStudent(key)}
                                                    >
                                                        <i className='la la-close' />
                                                    </button>
                                                }
                                            </td>
                                        </tr>
                                    )
                                }
                                <tr>
                                    <td colSpan={!isGenerateCode ? 8 : 7} style={{ borderBottomColor: 'white', borderLeftColor: 'white' }} />
                                    <td width={50} className='p-1 text-center'>
                                        <button
                                            className='btn btn-outline-info m-btn m-btn--icon btn-sm m-btn--icon-only m-btn--pill'
                                            onClick={addStudents}
                                        >
                                            <i className='la la-plus' />
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
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

export default AddStudentMovementIn