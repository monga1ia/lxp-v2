import message from 'modules/message'
import { Checkbox } from 'semantic-ui-react'
import PublishModal from '../modal/exam/publish'
import DTable from 'modules/DataTable/DTable'
import secureLocalStorage from 'react-secure-storage'
import { fetchRequest } from 'utils/fetchRequest'
import { translations } from 'utils/translations'
import React, { useEffect, useRef, useState } from 'react'
// import { teacherJournalExamEdit, teacherJournalExamPublish } from 'Utilities/url'

const scoreWithoutTemplate = ({ students, examMaxScore, exam, isTemplate, onClose }) => {
    const decimalRegex = /^\d+(\.\d{1,2})?$/

    const locale = secureLocalStorage?.getItem('selectedLang') || 'mn'
    const [loading, setLoading] = useState(false)

    const inputRefs = useRef([])
    const [tableData, setTableData] = useState(students || [])

    const [showPublishModal, setShowPublishModal] = useState(false)

    const config = {
        showFilter: false,
        showAllData: true,
        showPagination: false,
        defaultSort: [{ dataField: 'firstName', order: 'asc' }],
    }

    const columns = [
        {
            dataField: 'className',
            text: translations(locale)?.class_name,
            sort: true
        },
        {
            dataField: 'checked',
            text: '',
            align: 'center',
            formatter: (cell, row) =>
                <Checkbox
                    checked={cell}
                    onChange={(e, data) => handleCheckboxChange(row?.id, data?.checked)}
                />
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
            text: translations(locale)?.amount,
            sort: true,
            style: { padding: 3, width: 100 },
            formatter: (cell, row) => {
                if (row?.checked)
                    return (
                        <input
                            autoFocus
                            type='text'
                            ref={addToRefs}
                            value={cell || ''}
                            element-key={row?.id}
                            className='form-control'
                            placeholder={translations(locale)?.score}
                            onChange={(e) => handleInputChange(row?.id, e.target.value || 0)}
                        />
                    )
            }
        },
        {
            dataField: 'studentScore',
            text: translations(locale)?.percent,
            sort: true,
            align: 'right',
            formatter: (cell) => cell && `${cell}%`
        }
    ]

    useEffect(() => setTableData(students || []), [students])

    useEffect(() => {
        const handleKeyDown = e => handleKeyPress(e.key)
        document.addEventListener('keydown', handleKeyDown)
        return () => { document.removeEventListener('keydown', handleKeyDown) }
    }, [tableData])

    const handleSubmit = publish => {
        console.log('handleSubmit')
        // if (publish && !validateFields()) return
        // setLoading(true)
        // fetchRequest(teacherJournalExamEdit, 'POST', {
        //     exam,
        //     submit: 1,
        //     students: JSON.stringify(tableData?.filter(el => el?.checked == true)),
        // })
        //     .then((res) => {
        //         if (res.success) {
        //             message(res.data.message, res.success)
        //             if (publish) setShowPublishModal(true)
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

    const handlePublish = () => {
        console.log('handlePublish')
        // setLoading(true)
        // fetchRequest(teacherJournalExamPublish, 'POST', { exam })
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

    const validateFields = () => {
        for (const data of tableData) { if (data?.checked && !data?.takenScore) return message(translations(locale)?.err?.fill_all_fields) }
        return true
    }

    const handleCheckboxChange = (id, value) => {
        const clone = [...tableData]
        const index = clone?.findIndex(el => el?.id == id)
        clone[index].checked = value
        setTableData(clone)
    }

    const handleInputChange = (id, value) => {
        if (!decimalRegex.test(value)) {
            if (value?.length > 1 && value?.split('')?.filter(x => x == '.')?.length == 1 && value?.endsWith('.')) { }
            else return
        }
        if (value < 0 || value > examMaxScore) return
        const clone = [...tableData]
        const index = clone?.findIndex(el => el?.id == id)
        clone[index].takenScore = value
        clone[index].studentScore = +((value * 100) / examMaxScore).toFixed(2) || 0
        setTableData(clone)
    }

    const addToRefs = ref => {
        if (ref) {
            const key = ref.getAttribute('element-key')
            const index = inputRefs.current.findIndex(el => el.getAttribute('element-key') === key)
            if (index > -1)
                inputRefs.current.splice(index, 1, ref)
            else
                inputRefs.current.push(ref)
        }
    }

    const handleKeyPress = key => {
        const activeElement = document.activeElement
        if (activeElement.tagName.toLowerCase() == 'input') {
            const index = inputRefs.current.findIndex(el => el == activeElement)
            if (key === 'ArrowUp' && index > 0)
                inputRefs.current[index - 1].focus()
            else if (key === 'ArrowDown' && index < inputRefs.current.length - 1)
                inputRefs.current[index + 1].focus()
            else if (key === 'Enter' && index == inputRefs.current.length - 1)
                handleSubmit(false)
        }
    }

    return (
        <>
            <div className='m-portlet__body mx-4'>
                <DTable
                    locale={locale}
                    config={config}
                    data={tableData}
                    className={'table-striped'}
                    columns={columns}
                />
            </div>
            <div className="modal-footer">
                <button
                    className='btn m-btn--pill btn-link m-btn m-btn--custom'
                    onClick={onClose}
                    // onClick={() => navigate(-1, { replace: true })}
                >
                    {translations(locale)?.back}
                </button>
                <button
                    className="btn m-btn--pill btn-success text-uppercase"
                    onClick={() => handleSubmit(false)}
                >
                    {translations(locale)?.save}
                </button>
                <button
                    className="btn m-btn--pill btn-publish text-uppercase"
                    onClick={() => handleSubmit(true)}
                >
                    {translations(locale)?.action?.publish}
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
                showPublishModal &&
                <PublishModal
                    onSubmit={handlePublish}
                    onClose={() => setShowPublishModal(false)}
                />
            }
        </>
    )
}

export default scoreWithoutTemplate