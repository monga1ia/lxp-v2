import message from 'modules/message'
import { useNavigate } from 'react-router'
import Checkbox from '@mui/material/Checkbox'
import DeleteModal from 'utils/deleteModal'
import React, { useEffect, useState } from 'react'
import DTable from 'modules/DataTable/DTable'
import secureLocalStorage from 'react-secure-storage'
import { fetchRequest } from 'utils/fetchRequest'
import { translations } from 'utils/translations'
import AddAssessmentModal from '../modal/addAssessment'
import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded'
import { teacherJournalSetStatus, teacherJournalSkillSubmit, teacherJournalSkillView, teacherJournalSkillRemove } from 'Utilities/url'

const locale = secureLocalStorage?.getItem('selectedLang') || 'mn'

const config = {
    showFilter: false,
    showAllData: true,
    showPagination: false,
    defaultSort: [{ dataField: 'firstName', order: 'asc' }],
}

const assessmentList = ({ students, templateDetails, skill }) => {
    const navigate = useNavigate()

    const [loading, setLoading] = useState(false)

    const [skillTemplateDetails, setSkillTemplateDetails] = useState(templateDetails)

    const [tableData, setTableData] = useState(students || [])
    const [selectedTableDataId, setSelectedTableDataId] = useState(null)
    const [selectedStudentId, setSelectedStudentId] = useState(null);

    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [showAddAssessmentModal, setShowAddAssessmentModal] = useState(false)

    const [columns, setColumns] = useState([
        {
            dataField: 'checked',
            text: '',
            formatter: (cell, row) =>
                <Checkbox
                    checked={cell}
                    onChange={() => handleCheckBoxChange(row)}
                />
        },
        {
            dataField: 'className',
            text: translations(locale)?.class_name,
            sort: true
        },
        {
            dataField: 'code',
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
    ])

    useEffect(() => {
        setTableData(students);
        if (filterNonResultData(students).length > 0) {
            setShowAddAssessmentModal(true)
        }
    }, [students])

    useEffect(() => {
        setSkillTemplateDetails(templateDetails)
    }, [templateDetails])

    useEffect(() => {
        let cols = [...columns]

        let hasScore = false;

        if (templateDetails && templateDetails.length > 0) {
            for (let td = 0; td < templateDetails.length; td++) {
                if (templateDetails[td]?.hasScore) {
                    hasScore = true;
                }

                cols.push(
                    {
                        dataField: 'detail_' + templateDetails[td]?.id,
                        text: templateDetails[td]?.title,
                        sort: false
                    })
            }
        }

        if (hasScore)
            cols.splice(4, 0, {
                dataField: 'takenScore',
                text: translations(locale)?.score,
                sort: true
            })

        setColumns(cols)
    }, [templateDetails])

    const init = () => {
        setLoading(true)
        fetchRequest(teacherJournalSkillView, 'POST', { skill: skill?.id })
            .then((res) => {
                if (res.success) {
                    setTableData(res?.data?.students)
                } else {
                    message(res.data.message)
                }
                setLoading(false)
            })
            .catch(() => {
                message(translations(locale)?.err?.error_occurred)
                setLoading(false)
            })
    }

    const handleSubmit = () => {
        setLoading(true)
        fetchRequest(teacherJournalSetStatus, 'POST', { skill: skill?.id, publish: 1 })
            .then((res) => {
                if (res.success) {
                    message(res.data.message, res.success)
                    navigate('/teacher/journals', { replace: true })
                } else {
                    message(res.data.message)
                }
                setLoading(false)
            })
            .catch(() => {
                message(translations(locale)?.err?.error_occurred)
                setLoading(false)
            })
    }

    const handleAdd = bodyParams => {
        setLoading(true)
        fetchRequest(teacherJournalSkillSubmit, 'POST', { skill: skill?.id, ...bodyParams })
            .then((res) => {
                if (res.success) {
                    closeModal(false)
                    message(res.data.message, res.success)
                    setTableData(res?.data?.students)

                    if (filterNonResultData(res?.data?.students).length > 0) {
                        setTimeout(() => setShowAddAssessmentModal(true), 100)
                    }
                } else {
                    message(res.data.message)
                }
                setLoading(false)
            })
            .catch(() => {
                message(translations(locale)?.err?.error_occurred)
                setLoading(false)
            })
    }

    const handleRemove = () => {
        setLoading(true)
        fetchRequest(teacherJournalSkillRemove, 'POST', { skill: skill?.id, student: selectedTableDataId })
            .then((res) => {
                if (res.success) {
                    closeModal()
                    message(res.data.message, res.success)
                } else {
                    message(res.data.message)
                }
                setLoading(false)
            })
            .catch(() => {
                message(translations(locale)?.err?.error_occurred)
                setLoading(false)
            })
    }

    const refreshDetails = () => {
        if (skillTemplateDetails && skillTemplateDetails.length > 0) {
            let clone = [...skillTemplateDetails];
            for (let c = 0; c < clone.length; c++) {
                if (clone[c].options && clone[c].options.length > 0) {
                    let cloneOptions = [];
                    for (let o = 0; o < clone[c].options.length; o++) {
                        cloneOptions.push({ ...clone[c].options[o], ...{ checked: false } })
                    }
                    clone[c].options = cloneOptions;
                } else {
                    clone[c].value = null;
                }
            }
            setSkillTemplateDetails(clone);
        }
    }

    const closeModal = (loadInit = true) => {
        refreshDetails()
        setShowAddAssessmentModal(false)
        setShowDeleteModal(false)
        setSelectedStudentId(null)
        setSelectedTableDataId(null)
        if (loadInit) {
            init();
        }
    }

    const handleCheckBoxChange = row => {
        if (!row?.checked) {
            setSelectedStudentId(row?.id);
            setShowAddAssessmentModal(true)
        } else {
            setShowDeleteModal(true)
            setSelectedTableDataId(row?.id)
        }
    }

    const handleCloseDeleteModal = () => {
        setShowDeleteModal(false)
        setSelectedTableDataId(null)
    }

    const filterNonResultData = (allList) => {
        let dropdownStudents = [];
        for (let st = 0; st < allList.length; st++) {
            if (!allList[st].checked) {
                dropdownStudents.push(allList[st]);
            } else {
                if (allList[st]?.id === selectedStudentId) {
                    dropdownStudents.push(allList[st]);
                }
            }
        }
        return dropdownStudents;
    }

    return (
        <>
            <div className='m-portlet__body'>
                <button
                    className='btn btn-sm m-btn--pill btn-info m-btn--uppercase d-inline-flex'
                    onClick={() => setShowAddAssessmentModal(true)}
                >
                    <AddCircleOutlineRoundedIcon />
                    <span className='ml-2'>{translations(locale)?.skill?.addAssessment}</span>
                </button>
                <DTable
                    locale={locale}
                    config={config}
                    data={tableData}
                    columns={columns}
                />
            </div>
            <div className="m-portlet__foot d-flex justify-content-center gap-05">
                <button
                    className="btn m-btn--pill btn-publish text-uppercase"
                    onClick={handleSubmit}
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
                showAddAssessmentModal &&
                <AddAssessmentModal
                    onClose={() => closeModal(true)}
                    onSubmit={handleAdd}
                    onStudentChange={refreshDetails}
                    studentId={selectedStudentId}
                    students={filterNonResultData(tableData)}
                    templateDetails={skillTemplateDetails}
                />
            }
            {
                showDeleteModal && selectedTableDataId &&
                <DeleteModal
                    onClose={handleCloseDeleteModal}
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
        </>
    )
}

export default assessmentList