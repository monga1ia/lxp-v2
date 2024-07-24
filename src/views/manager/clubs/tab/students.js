import { useState } from 'react'
import message from 'modules/message'
import React, { useEffect } from 'react'
import DTable from 'modules/DataTable/DTable'
import DeleteModal from 'utils/deleteModal'
import StudentAddModal from '../modal/studentAdd'
import CloseIcon from '@mui/icons-material/Close'
import secureLocalStorage from 'react-secure-storage'
import { translations } from 'utils/translations'
// import { fetchRequest } from 'utils/fetchRequest'
import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded'
// import { managerClubStudentAdd, managerClubStudentRemove, managerClubStudents } from 'utils/url'

export const students = ({ group }) => {
    const locale = secureLocalStorage?.getItem('selectedLang') || 'mn'
    const [loading, setLoading] = useState(false)

    const [tableData, setTableData] = useState([])
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [selectedTableDataId, setSelectedTableDataId] = useState(null)

    const [showStudentAddModal, setShowStudentAddModal] = useState(false)

    const columns = [
        {
            dataField: 'className',
            text: translations(locale)?.class_name,
            sort: true,
        },
        {
            dataField: 'studentCode',
            text: translations(locale)?.studentCode,
            sort: true
        },
        {
            dataField: 'lastName',
            text: translations(locale)?.studentLastName,
            sort: true
        },
        {
            dataField: 'firstName',
            text: translations(locale)?.studentFirstName,
            sort: true,
        },
        {
            dataField: 'action',
            text: '',
            align: 'center',
            headerStyle: { width: 50 },
            formatter: (cell, row) => <button onClick={() => { setSelectedTableDataId(row?.id), setShowDeleteModal(true) }}
                className='btn btn-danger m-btn--icon btn-sm m-btn--icon-only m-btn--pill d-inline-flex justify-content-center align-items-center'>
                <CloseIcon />
            </button>
        },
    ]

    const config = {
        showAllData: true,
        showPagination: false,
    }

    // useEffect(() => {
    //     setLoading(true)
    //     fetchRequest(managerClubStudents, 'POST', { group })
    //         .then((res) => {
    //             if (res.success) {
    //                 const { groupStudentList } = res.data
    //                 setTableData(groupStudentList || [])
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

    const handleRemove = () => {
        console.log('handleRemove')
        // setLoading(true)
        // fetchRequest(managerClubStudentRemove, 'POST', { student: selectedTableDataId, group })
        //     .then((res) => {
        //         if (res.success) {
        //             message(res.data.message, res.success)
        //             const { groupStudentList } = res.data
        //             setTableData(groupStudentList || [])
        //             closeModal()
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

    const handleSubmit = param => {
        console.log('handleSubmit')
        // setLoading(true)
        // fetchRequest(managerClubStudentAdd, 'POST', { details: JSON.stringify(param), group, submit: 1 })
        //     .then((res) => {
        //         if (res.success) {
        //             message(res.data.message, res.success)
        //             const { groupStudentList } = res.data
        //             setTableData(groupStudentList || [])
        //             closeModal()
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

    const closeModal = () => {
        setShowDeleteModal(false)
        setSelectedTableDataId(null)
        setShowStudentAddModal(false)
    }

    return (
        <>
            <div className='m-portlet__body'>
                <button
                    className='btn btn-sm m-btn--pill btn-info m-btn--uppercase d-inline-flex mb-3'
                    onClick={() => setShowStudentAddModal(true)}
                >
                    <AddCircleOutlineRoundedIcon />
                    <span className='ml-2'>{translations(locale)?.movement?.add}</span>
                </button>
                <DTable
                    config={config}
                    locale={locale}
                    data={tableData}
                    columns={columns}
                />
            </div>
            <div className='m-portlet__foot text-center'>
                {/* <Link
                    to='/manager/clubs'
                    className='btn m-btn--pill btn-link margin-right-5'
                >
                    {translations(locale)?.back_to_list}
                </Link> */}
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
            {
                showDeleteModal && selectedTableDataId &&
                <DeleteModal
                    onClose={closeModal}
                    onDelete={handleRemove}
                    locale={locale}
                    title={translations(locale)?.delete}
                >
                    {translations(locale)?.delete_confirmation}
                    <br />
                    <br />
                    {translations(locale)?.delete_confirmation_description}
                </DeleteModal>

            }
            {
                showStudentAddModal &&
                <StudentAddModal
                    group={group}
                    onClose={closeModal}
                    onSubmit={handleSubmit}
                />
            }
        </>
    )
}

export default students