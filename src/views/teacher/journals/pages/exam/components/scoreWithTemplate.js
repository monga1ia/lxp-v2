import message from 'modules/message'
import AddModal from '../modal/score/add'
import EditModal from '../modal/score/edit'
import DeleteModal from 'utils/deleteModal'
import React, { useEffect, useState } from 'react'
import DTable from 'modules/DataTable/DTable'
import secureLocalStorage from 'react-secure-storage'
import { fetchRequest } from 'utils/fetchRequest'
import { translations } from 'utils/translations'
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone'
import BorderColorTwoToneIcon from '@mui/icons-material/BorderColorTwoTone'
import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded'
// import { teacherJournalExamScoreSubmit, teacherJournalExamScoreCalculate, teacherJournalExamScoreDelete } from 'Utilities/url'

const scoreWithTemplate = ({ students, questions, exam, isTemplate, onClose }) => {

    const locale = secureLocalStorage?.getItem('selectedLang') || 'mn'
    const [loading, setLoading] = useState(false)

    const [tableData, setTableData] = useState(students || [])
    const [selectedTableDataId, setSelectedTableDataId] = useState(null)

    const [showAddModal, setShowAddModal] = useState(false)
    const [showEditModal, setShowEditModal] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)

    const config = {
        showFilter: false,
        showAllData: true,
        showPagination: false,
        defaultSort: [{ dataField: 'firstName', order: 'asc' }],
    }

    const contextMenus = [
        {
            key: 'edit',
            icon: <BorderColorTwoToneIcon sx={{ fontSize: '1.8rem !important', color: '#ff5b1d' }} />,
            title: translations(locale)?.edit
        },
        {
            key: 'delete',
            icon: <DeleteTwoToneIcon sx={{ fontSize: '2rem !important', color: '#ff5b1d' }} />,
            title: translations(locale)?.delete
        },
    ]

    const [columns, setColumns] = useState([
        {
            dataField: 'className',
            text: translations(locale)?.class_name,
            sort: true
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
            sort: true
        },
        {
            dataField: 'takenScore',
            text: translations(locale)?.total,
            sort: true,
            align: 'right',
            formatter: (cell) => {
                if(cell){
                    return cell.toFixed(2)
                } 
            }
        },
    ])

    useEffect(() => {
        questions?.forEach(el => {
            el.text = el?.name
            el.dataField = el?.id
            el.sort = true
            el.align = 'right'
            el.style = (cell, row) => {
                const question = row?.scores?.find(score => score?.scoreId == el?.id)
                let backgroundColor = ''
                if (row?.hasScores) {
                    if (question?.isComplete) backgroundColor = '#3ebfa380'
                    else if (question?.takenScore == 0) backgroundColor = '#f4516b80'
                }
                return { backgroundColor }
            }
            el.formatter = (cell, row) => row?.scores?.find(score => score?.scoreId == el?.id)?.takenScore
        })
        const description = {
            dataField: 'description',
            text: translations(locale)?.exam?.exam_regard,
            sort: true,
        }
        setTableData(students || [])
        setColumns([...columns, ...questions, description] || [])
    }, [students, questions])

    useEffect(() => {
        if (tableData && tableData.length) {
            tableData?.forEach(el => el.contextMenuKeys = el.hasScores ? 'edit,delete' : '')
        }
    }, [tableData])

    const handleSubmit = () => {
        console.log('handleSubmit')
        // setLoading(true)
        // fetchRequest(teacherJournalExamScoreCalculate, 'POST', { exam })
        //     .then((res) => {
        //         if (res.success) {
        //             message(res.data.message, res.success)
        //             navigate('/teacher/journals/exams/result', { state: { id: exam, isTemplate }, replace: true })
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

    const handleAdd = student => {
        console.log('handleAdd')
        // setLoading(true)
        // fetchRequest(teacherJournalExamScoreSubmit, 'POST', { ...student, exam })
        //     .then((res) => {
        //         if (res.success) {
        //             closeModal()
        //             message(res.data.message, res.success)
        //             const clone = [...tableData]
        //             let reOpenModal = false
        //             clone?.splice(clone?.findIndex(el => el?.id == student?.id), 1, { ...student, scores: JSON.parse(student?.scores) })
        //             clone?.forEach(el => { if (!el?.hasScores) reOpenModal = true })
        //             setTableData(clone || [])
        //             if (reOpenModal) setTimeout(() => setShowAddModal(true), 100)
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

    const handleDelete = () => {
        console.log('handleDelete')
        // setLoading(true)
        // fetchRequest(teacherJournalExamScoreDelete, 'POST', { exam, student: selectedTableDataId })
        //     .then((res) => {
        //         if (res.success) {
        //             message(res.data.message, res.success)
        //             const clone = [...tableData]
        //             const index = clone?.findIndex(el => el?.id == selectedTableDataId)
        //             clone[index].takenScore = 0
        //             clone[index].hasScores = false
        //             clone[index].description = ''
        //             clone[index]?.scores?.forEach(el => el.takenScore = '')
        //             clone?.forEach(el => el.contextMenuKeys = el.hasScores ? 'edit,delete' : '')
        //             setTableData(clone || [])
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

    const handleContextMenuClick = (id, key) => {
        if (id && key) {
            setSelectedTableDataId(id)
            if (key === 'edit') {
                setShowEditModal(true)
            } else if (key === 'delete') {
                setShowDeleteModal(true)
            }
        }
    }

    const closeModal = () => {
        setShowAddModal(false)
        setShowEditModal(false)
        setShowDeleteModal(false)
        setSelectedTableDataId(null)
    }

    const handleRowStyle = row => {
        if (!row?.hasScores) return { backgroundColor: '#ebedf2' }
        return {}
    }

    return (
        <>
            <div className='m-portlet__body mx-4'>
                <button
                    className='btn btn-sm m-btn--pill btn-info m-btn--uppercase d-inline-flex'
                    onClick={() => setShowAddModal(true)}
                >
                    <AddCircleOutlineRoundedIcon />
                    <span className='ml-2'>{translations(locale)?.exam?.insert_score}</span>
                </button>
                <DTable
                    locale={locale}
                    config={config}
                    data={tableData}
                    columns={columns}
                    className={'table-striped'}
                    individualContextMenus
                    rowStyle={handleRowStyle}
                    clickContextMenu
                    contextMenus={contextMenus}
                    onContextMenuItemClick={handleContextMenuClick}
                />
            </div>
            <div className="modal-footer">
                <button
                    className='btn m-btn--pill btn-link m-btn m-btn--custom'
                    onClick={onClose}
                >
                    {translations(locale)?.back}
                </button>
                <button
                    className="btn m-btn--pill btn-publish text-uppercase"
                    onClick={handleSubmit}
                >
                    {translations(locale)?.exam?.calculate_generalization}
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
            {
                showAddModal &&
                <AddModal
                    onClose={closeModal}
                    onSubmit={handleAdd}
                    students={tableData?.filter(el => el.hasScores == false)}
                />
            }
            {
                showEditModal && selectedTableDataId &&
                <EditModal
                    onSubmit={handleAdd}
                    onClose={closeModal}
                    student={tableData?.find(el => el?.id == selectedTableDataId)}
                />
            }
        </>
    )
}

export default scoreWithTemplate