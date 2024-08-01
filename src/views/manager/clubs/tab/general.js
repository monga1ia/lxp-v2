import message from 'modules/message'
import React, { useEffect, useState } from 'react'
import secureLocalStorage from 'react-secure-storage'
// import { fetchRequest } from 'utils/fetchRequest'
import { translations } from 'utils/translations'
import { NDropdown as Dropdown } from 'widgets/Dropdown'
// import { getTeachersBySubject, managerClubEdit } from 'Utilities/url'

const general = ({ group }) => {

    const locale = secureLocalStorage?.getItem('selectedLang') || 'mn'
    const [loading, setLoading] = useState(false)

    const [club, setClub] = useState({})
    const [teacherOptions, setTeacherOptions] = useState([])

    // useEffect(() => {
    //     setLoading(true)
    //     fetchRequest(managerClubEdit, 'POST', { group })
    //         .then((res) => {
    //             if (res.success) {
    //                 const { groupData } = res.data
    //                 setClub(groupData || {})
    //                 fetchRequest(getTeachersBySubject, 'POST', { subject: groupData?.subjectId })
    //                     .then((res) => {
    //                         if (res.success) {
    //                             const { teachers } = res.data
    //                             setTeacherOptions(teachers?.map(el => ({ value: el?.teacherId, text: `${el?.firstName} (${el?.lastName}) - ${el?.teacherCode}` })) || [])
    //                         } else {
    //                             message(res.data.message)
    //                         }
    //                         setLoading(false)
    //                     })
    //                     .catch(() => {
    //                         message(translations(locale)?.err?.error_occurred)
    //                         setLoading(false)
    //                     })
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

    const handleEdit = () => {
        console.log('handleEdit')
        // setLoading(true)
        // fetchRequest(managerClubEdit, 'POST', { ...club, submit: 1, group })
        //     .then((res) => {
        //         if (res.success) {
        //             message(res.data.message, res.success)
        //             navigate('/manager/clubs/edit', { state: { id: club?.id, tab: 1 }, replace: true })
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

    const handleChange = (name, value) => {
        setClub({ ...club, [name]: value })
    }

    return (
        <>
            <div className='m-portlet__body'>
                <div className='form-group m-form__group row'>
                    <label className='col-5 col-form-label text-right label-pinnacle-bold'>
                        {translations(locale)?.subject?.type}
                    </label>
                    <div className='col-4 col-form-label'>
                        {club?.type}
                    </div>
                </div>
                <div className='form-group m-form__group row'>
                    <label className='col-5 col-form-label text-right label-pinnacle-bold'>
                        {translations(locale)?.club?.title}
                    </label>
                    <div className='col-4 col-form-label'>
                        {club?.subjectName}
                    </div>
                </div>
                <div className='form-group m-form__group row'>
                    <label className='col-5 col-form-label text-right label-pinnacle-bold'>
                        {translations(locale)?.teacher_title}*
                    </label>
                    <div className='col-4'>
                        <Dropdown
                            fluid
                            search
                            selection
                            closeOnChange
                            options={teacherOptions}
                            value={club?.teacherId?.toString()}
                            placeholder={'-' + translations(locale)?.select + '-'}
                            onChange={(e, data) => handleChange('teacherId', data?.value)}
                        />
                    </div>
                </div>
                <div className='form-group m-form__group row'>
                    <label className='col-5 col-form-label text-right label-pinnacle-bold'>
                        {translations(locale)?.club?.name}*
                    </label>
                    <div className='col-4'>
                        <input
                            value={club?.name || ''}
                            type='text' className='form-control'
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
                    onClick={handleEdit}
                    className='btn m-btn--pill btn-publish text-uppercase'
                >
                    {translations(locale)?.club?.register_student}
                </button>
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
        </>
    )
}

export default general