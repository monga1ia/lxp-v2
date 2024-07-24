import { useState } from 'react'
import message from 'modules/message'
import React, { useEffect } from 'react'
import secureLocalStorage from 'react-secure-storage'
// import { fetchRequest } from 'utils/fetchRequest'
import { translations } from 'utils/translations'
import { NDropdown as Dropdown } from 'widgets/Dropdown'
// import { getTeachersBySubject, managerClubSubmit } from 'Utilities/url'

const add = () => {

    const locale = secureLocalStorage?.getItem('selectedLang') || 'mn'
    const [loading, setLoading] = useState(false)

    const [club, setClub] = useState({})

    const [typeOptions, setTypeOptions] = useState([])
    const [teacherOptions, setTeacherOptions] = useState([])
    const [subjectOptions, setSubjectOptions] = useState([])

    // useEffect(() => {
    //     setLoading(true)
    //     fetchRequest(managerClubSubmit, 'POST')
    //         .then((res) => {
    //             if (res.success) {
    //                 const { types, subjects } = res.data
    //                 setTypeOptions(types || [])
    //                 setSubjectOptions(subjects || [])
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
        console.log('handleSubmit')
        // if (validateFields()) {
        //     setLoading(true)
        //     fetchRequest(managerClubSubmit, 'POST', { submit: 1, ...club })
        //         .then((res) => {
        //             if (res.success) {
        //                 message(res.data.message, res.success)
        //                 const { groupId } = res.data
        //                 navigate('/manager/clubs/edit', { state: { id: groupId, tab: 1 } })
        //             } else {
        //                 message(res.data.message)
        //             }
        //             setLoading(false)
        //         })
        //         .catch(() => {
        //             message(translations(locale)?.err?.error_occurred)
        //             setLoading(false)
        //         })
        // }
    }

    const handleSubjectChange = subject => {
        console.log('handleSubjectChange')
        // setLoading(true)
        // setClub({ ...club, subject, teacher: null })
        // fetchRequest(getTeachersBySubject, 'POST', { subject })
        //     .then((res) => {
        //         if (res.success) {
        //             const { teachers } = res.data
        //             setTeacherOptions(teachers?.map(el => ({ value: el?.teacherId, text: `${el?.firstName} (${el?.lastName}) - ${el?.teacherCode}` })) || [])
        //         } else {
        //             message(res.data.message)
        //         }
        //         setLoading(false)
        //     })
        //     .catch(() => {
        //         message(translations(locale)?.err?.error_occurred)
        //         setLoading(false)
        //     })
    }

    const validateFields = () => {
        if (!club?.type || !club?.subject || !club?.teacher || !club?.name) return message(translations(locale).err.fill_all_fields)
        else return true
    }

    const handleChange = (name, value) => {
        setClub({ ...club, [name]: value })
    }

    return (
        <div className='m-grid__item m-grid__item--fluid m-wrapper'>
            {/* <SubHeader
                locale={locale}
                title={translations(locale)?.club?.title}
            /> */}
            <div className='m-content'>
                <div className='m-portlet'>
                    <div className='m-portlet__body'>
                        <div className='form-group m-form__group row'>
                            <label className='col-4 col-form-label text-right label-pinnacle-bold'>
                                {translations(locale)?.subject?.type}*
                            </label>
                            <div className='col-4'>
                                <Dropdown
                                    fluid
                                    search
                                    selection
                                    closeOnChange
                                    value={club?.type}
                                    options={typeOptions}
                                    placeholder={'-' + translations(locale)?.select + '-'}
                                    onChange={(e, data) => handleChange('type', data?.value)}
                                />
                            </div>
                        </div>
                        <div className='form-group m-form__group row'>
                            <label className='col-4 col-form-label text-right label-pinnacle-bold'>
                                {translations(locale)?.club?.title}*
                            </label>
                            <div className='col-4'>
                                <Dropdown
                                    fluid
                                    search
                                    selection
                                    closeOnChange
                                    value={club?.subject}
                                    options={subjectOptions}
                                    placeholder={'-' + translations(locale)?.select + '-'}
                                    onChange={(e, data) => handleSubjectChange(data?.value)}
                                />
                            </div>
                        </div>
                        <div className='form-group m-form__group row'>
                            <label className='col-4 col-form-label text-right label-pinnacle-bold'>
                                {translations(locale)?.teacher_title}*
                            </label>
                            <div className='col-4'>
                                <Dropdown
                                    fluid
                                    search
                                    selection
                                    closeOnChange
                                    value={club?.teacher}
                                    options={teacherOptions}
                                    placeholder={'-' + translations(locale)?.select + '-'}
                                    onChange={(e, data) => handleChange('teacher', data?.value)}
                                />
                            </div>
                        </div>
                        <div className='form-group m-form__group row'>
                            <label className='col-4 col-form-label text-right label-pinnacle-bold'>
                                {translations(locale)?.club?.name}*
                            </label>
                            <div className='col-4'>
                                <input type='text' className='form-control'
                                    placeholder={translations(locale)?.club?.name}
                                    onChange={(e) => handleChange('name', e?.target?.value)}
                                />
                            </div>
                        </div>
                    </div>
                    <div className='m-portlet__foot text-center'>
                        {/* <Link
                            to='/manager/clubs'
                            className='btn m-btn--pill btn-link margin-right-5'
                        >
                            {translations(locale)?.back}
                        </Link> */}
                        <button
                            onClick={handleSubmit}
                            className='btn m-btn--pill btn-publish text-uppercase'
                        >
                            {translations(locale)?.club?.register_student}
                        </button>
                    </div>
                </div>
            </div>
            {
                loading &&
                <>
                    <div className='blockUI blockOverlay' />
                    <div className='blockUI blockMsg blockPage'>
                        <div className='m-loader m-loader--brand m-loader--lg' />
                    </div>
                </>
            }
        </div>
    )
}

export default add