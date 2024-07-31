import message from 'modules/message'
import { Link } from 'react-router-dom'
// import { useNavigate } from 'react-router'
import { Modal } from 'react-bootstrap'
import DeleteModal from 'utils/deleteModal'
import React, { useEffect, useState } from 'react'
import CloseIcon from '@mui/icons-material/Close'
import DTable from 'modules/DataTable/DTable'
import secureLocalStorage from 'react-secure-storage'
import { translations } from 'utils/translations'
// import { fetchRequest } from 'utils/fetchRequest'
// import { teacherJournalExamDelete, teacherJournalExamInit } from 'utils/fetchRequest/Urls'
import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded'

const exam = ({ onClose, group, rerender }) => {
    // const navigate = useNavigate()

    const locale = secureLocalStorage?.getItem('selectedLang') || 'mn'
    const [loading, setLoading] = useState(false)

    const [title, setTitle] = useState('')
    const [tableData, setTableData] = useState([])
    const [selectedTableDataId, setSelectedTableDataId] = useState(null)

    const [showDeleteModal, setShowDeleteModal] = useState(false)

    const config = {
        showFilter: false,
        showAllData: true,
        showPagination: false,
        defaultSort: [{ dataField: 'name', order: 'asc' }],
    }

    const columns = [
        {
            dataField: 'isPublish',
            text: translations(locale)?.status,
            align: 'center',
            style: { verticalAlign: 'middle' },
            formatter: cell => <i className='fas fa-circle' style={{ color: cell ? '#6dd400' : '#d8d8d8' }} />
        },
        {
            dataField: 'takenDate',
            text: translations(locale)?.exam?.date,
            sort: true
        },
        {
            dataField: 'name',
            text: translations(locale)?.exam?.name,
            sort: true,
            formatter: (cell, row) =>
                <span
                    className='underline'
                    // onClick={() => navigate(row?.isPublish ? '/teacher/journals/exams/result' : '/teacher/journals/exams/edit', { state: { id: row?.id, isTemplate: row?.isTemplate } })}
                >
                    {cell}
                </span>
        },
        {
            dataField: 'templateName',
            text: translations(locale)?.exam?.template_name,
            sort: true,
        },
        {
            dataField: 'action',
            text: '',
            align: 'center',
            style: { verticalAlign: 'middle' },
            headerStyle: { width: 100 },
            formatter: (cell, row) => {
                if (!row?.isPublish) return (
                    <div>
                        <button
                            className='btn btn-primary m-btn--icon btn-sm m-btn--icon-only m-btn--pill mr-2'
                            // onClick={() => navigate('/teacher/journals/exams/edit', { state: { id: row?.id } })}
                        >
                            <i className='fa flaticon-edit-1' />
                        </button>
                        <button
                            className='btn btn-danger m-btn--icon btn-sm m-btn--icon-only m-btn--pill'
                            onClick={() => handleDeleteButtonClick(row?.id)}
                        >
                            <i className='fa flaticon-delete-1' />
                        </button>
                    </div>
                )
                else return (
                    <button
                        className='btn btn-secondary m-btn--icon btn-sm m-btn--icon-only m-btn--pill'
                        // onClick={() => navigate('/teacher/journals/exams/result', { state: { id: row?.id, isTemplate: row?.isTemplate } })}
                    >
                        <i className='fa flaticon-eye text-white' />
                    </button>
                )
            }
        },
    ]

    // useEffect(() => {
    //     setLoading(true)
    //     fetchRequest(teacherJournalExamInit, 'POST', { ...group, group: group?.id })
    //         .then((res) => {
    //             if (res.success) {
    //                 const { title, examLists } = res.data
    //                 setTitle(title || '')
    //                 setTableData(examLists || [])
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

    const handleDelete = () => {
        console.log('handleDelete')
        // setLoading(true)
        // fetchRequest(teacherJournalExamDelete, 'POST', { ...group, group: group?.id, exam: selectedTableDataId })
        //     .then((res) => {
        //         if (res.success) {
        //             message(res.data.message, res.success)
        //             setTableData(res.data?.examLists || [])
        //             closeModal()
        //             rerender()
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

    const handleDeleteButtonClick = id => {
        setSelectedTableDataId(id)
        setShowDeleteModal(true)
    }

    const closeModal = () => {
        setSelectedTableDataId(null)
        setShowDeleteModal(false)
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
                    {title}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Link
                    state={group}
                    to='/teacher/journals/exams/create'
                    className='btn btn-sm m-btn--pill btn-info m-btn--uppercase d-inline-flex'
                >
                    <AddCircleOutlineRoundedIcon />
                    <span className='ml-2'>{translations(locale)?.exam?.create}</span>
                </Link>
                <DTable
                    locale={locale}
                    config={config}
                    data={tableData}
                    columns={columns}
                />
            </Modal.Body>
            <Modal.Footer className='text-center'>
                <button className='btn m-btn--pill btn-outline-metal text-uppercase' onClick={onClose}>
                    {translations(locale)?.close}
                </button>
            </Modal.Footer>
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
                    onDelete={handleDelete}
                    locale={locale}
                    title={translations(locale)?.delete}
                >
                    {translations(locale)?.delete_confirmation}
                    <br />
                    <br />
                    {translations(locale)?.delete_confirmation_description}
                </DeleteModal>
            }
        </Modal>
    )
}

export default exam