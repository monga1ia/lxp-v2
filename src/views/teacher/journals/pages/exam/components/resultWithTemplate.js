import message from 'modules/message'
import { useNavigate } from 'react-router'
import { Col, Row } from 'react-bootstrap'
import React, { useEffect, useState } from 'react'
import DTable from 'modules/DataTable/DTable'
import secureLocalStorage from 'react-secure-storage'
import { translations } from 'utils/translations'
import { fetchRequest } from 'utils/fetchRequest'
import { teacherJournalExamTemplateResult } from 'Utilities/url'

const resultWithTemplate = ({ studentsData, scoreTypesData, questionsData, exam, urlData }) => {
    const navigate = useNavigate()

    const locale = secureLocalStorage?.getItem('selectedLang') || 'mn'
    const [loading, setLoading] = useState(false)

    const [isPublished, setIsPublished] = useState(true)
    const [totalTakenScore, setTotalTakenScore] = useState(0)
    const [totalAvailableScore, setTotalAvailableScore] = useState(0)
    const [filteredStudentsData, setFilteredStudentsData] = useState([])

    const questionConfig = {
        showFilter: false,
        showAllData: true,
        showPagination: false,
        excelExport: false,
        defaultSort: [{ dataField: 'firstName', order: 'asc' }],
    }

    const questionColumns = [
        {
            dataField: 'name',
            text: translations(locale)?.exam_template?.question,
            sort: true
        },
        {
            dataField: 'totalScore',
            text: translations(locale)?.exam_template?.total_score,
            sort: true,
            align: 'right',
        },
        {
            dataField: 'takenScore',
            text: translations(locale)?.exam?.taken_score,
            sort: true,
            align: 'right',
        },
        {
            dataField: 'percentage',
            text: translations(locale)?.season_score?.performance,
            sort: true,
            align: 'right',
        },
        {
            dataField: 'completeStudent',
            text: translations(locale)?.exam?.exam_complete,
            sort: true,
            align: 'right',
            headerAttrs: { 'colSpan': 2 }
        },
        {
            dataField: 'completePer',
            text: translations(locale)?.exam?.exam_complete,
            sort: true,
            align: 'right',
            formatter: (cell) => cell + '%',
            headerStyle: { display: 'none' }
        },
        {
            dataField: 'incompleteStudent',
            text: translations(locale)?.exam?.exam_incomplete,
            sort: true,
            align: 'right',
            headerAttrs: { 'colSpan': 2 }
        },
        {
            dataField: 'incompletePer',
            text: translations(locale)?.exam?.exam_incomplete,
            sort: true,
            align: 'right',
            formatter: (cell) => cell + '%',
            headerStyle: { display: 'none' }
        },
        {
            dataField: 'zeroStudent',
            text: translations(locale)?.exam?.exam_no_score,
            sort: true,
            align: 'right',
            headerAttrs: { 'colSpan': 2 }
        },
        {
            dataField: 'zeroPer',
            text: translations(locale)?.exam?.exam_no_score,
            sort: true,
            align: 'right',
            formatter: (cell) => cell + '%',
            headerStyle: { display: 'none' }
        }
    ]

    useEffect(() => setIsPublished(exam?.published), [exam])

    useEffect(() => {
        let totalScore = 0
        let takenScore = 0
        studentsData?.forEach(el => takenScore += parseFloat(el?.totalScore, 10) || 0)
        exam?.exTemplateQuestions?.forEach(el => totalScore += parseFloat(el?.score, 10) || 0)
        setTotalTakenScore(takenScore || 0)
        setTotalAvailableScore((totalScore * studentsData?.length) || 0)
        setFilteredStudentsData(studentsData || [])
    }, [studentsData])

    const handlePublish = () => {
        setLoading(true)
        fetchRequest(teacherJournalExamTemplateResult, 'POST', { exam: exam?.id, submit: 1 })
            .then((res) => {
                if (res.success) {
                    message(res.data.publish_message, true)
                    setIsPublished(res.data?.exam?.published || false)
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

    const handleSearch = value => {
        if (value) {
            const searchValue = value?.toLowerCase()
            setFilteredStudentsData(studentsData?.filter(student =>
                student?.className?.toLowerCase()?.includes(searchValue) ||
                student?.studentCode?.toLowerCase()?.includes(searchValue) ||
                student?.lastName?.toLowerCase()?.includes(searchValue) ||
                student?.firstName?.toLowerCase()?.includes(searchValue) ||
                student?.totalPercent?.toLowerCase()?.includes(searchValue) ||
                student?.scoreType?.toLowerCase()?.includes(searchValue) ||
                student?.studentPlace?.toLowerCase()?.includes(searchValue) ||
                student?.description?.toLowerCase()?.includes(searchValue)
            ) || [])
        } else {
            setFilteredStudentsData(studentsData || [])
        }
    }

    return (
        <>
            <div className='m-portlet__body'>
                <div className='table-responsive mt-3'>
                    <div className='d-flex justify-content-end align-items-center mb-2'>
                        <button
                            style={{ height: '33px', width: '33px' }}
                            className='btn m-btn--icon m-btn--icon-only btn-info br-03 mx-1'
                            onClick={() => window.open(`/api/exam/result-export?exam=${exam?.id}`, '_blank')}
                        >
                            <i className='la la-file-excel-o' style={{ fontSize: '22px', color: 'white' }} />
                        </button>
                        <input
                            type='text'
                            style={{ width: '13rem' }}
                            className='form-control br-08'
                            placeholder={translations(locale)?.search}
                            onChange={(e) => handleSearch(e?.target?.value)}
                        />
                    </div>
                    <table className='table table-bordered react-bootstrap-table'>
                        <thead>
                            <tr>
                                <th rowSpan={2}>№</th>
                                <th rowSpan={2}>{translations(locale)?.class_name}</th>
                                <th rowSpan={2}>{translations(locale)?.studentCode}</th>
                                <th rowSpan={2}>{translations(locale)?.studentLastName}</th>
                                <th rowSpan={2}>{translations(locale)?.studentFirstName}</th>
                                {
                                    exam?.exTemplateQuestions?.map((el, key) => <th key={key} className='text-vertical'>{el?.name}</th>)
                                }
                                <th className='text-vertical'>{translations(locale)?.total}</th>
                                <th rowSpan={2}>{translations(locale)?.season_score?.performance}</th>
                                <th rowSpan={2}>{translations(locale)?.exam?.score}</th>
                                <th rowSpan={2}>{translations(locale)?.exam?.ranking}</th>
                                <th rowSpan={2}>{translations(locale)?.exam?.exam_regard}</th>
                            </tr>
                            <tr>
                                {
                                    exam?.exTemplateQuestions?.map((el, key) => <td className='text-right' key={key}>{el?.score}</td>)
                                }
                                <td className='text-right'>{exam?.templateScore}</td>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                filteredStudentsData?.length > 0
                                    ? filteredStudentsData?.map((el, key) => (
                                        <tr key={key}>
                                            <td className='text-right'>{key + 1}</td>
                                            <td>{el?.className}</td>
                                            <td>{el?.studentCode}</td>
                                            <td>{el?.lastName}</td>
                                            <td>{el?.firstName}</td>
                                            {
                                                exam?.exTemplateQuestions?.map((item, index) => <td className='text-right' key={index}>{el?.scores?.find(score => score?.id == item?.id)?.score}</td>)
                                            }
                                            <td className='text-right'>{el.totalScore ? el.totalScore : null}</td>
                                            <td className='text-right'>{el?.totalPercent}</td>
                                            <td>{el?.scoreType}</td>
                                            <td className='text-right'>{el?.studentPlace}</td>
                                            <td>{el?.description}</td>
                                        </tr>
                                    ))
                                    : <tr><td className='text-center' colSpan={(exam?.exTemplateQuestions?.length || 0) + 10}>{translations(locale)?.action?.emptyTable}</td></tr>
                            }
                        </tbody>
                        <tfoot>
                            <tr style={{ backgroundColor: '#dfe2ea' }}>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                {
                                    exam?.exTemplateQuestions?.map((el, key) => {
                                        let score = 0
                                        filteredStudentsData?.forEach((student) =>
                                            student?.scores?.forEach(question => {
                                                if (question?.id == el?.id) score += parseFloat(question?.score) || 0
                                            })
                                        )
                                        return <td key={key} className='text-right'>{filteredStudentsData?.length > 0 ? (score / filteredStudentsData?.length)?.toFixed(2) : 0}</td>
                                    })
                                }
                                {
                                    [0]?.map((el, key) => {
                                        let total = 0
                                        filteredStudentsData?.forEach(student => total += parseFloat(student?.totalScore) || 0)
                                        return <td key={key} className='text-right'>{filteredStudentsData?.length > 0 ? (total / filteredStudentsData?.length)?.toFixed(2) : 0}</td>
                                    })
                                }
                                {
                                    [0]?.map((el, key) => {
                                        let total = 0
                                        filteredStudentsData?.forEach(student => total += parseFloat(student?.totalPercent) || 0)
                                        return <td key={key} className='text-right'>{filteredStudentsData?.length > 0 ? (total / filteredStudentsData?.length)?.toFixed(2) : 0}</td>
                                    })
                                }
                                <td></td>
                                <td></td>
                                <td></td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
            <div className='m-portlet mx-5'>
                <div className='m-portlet__body'>
                    <div className='br-08 p-4 mb-2'>
                        <Row>
                            <Col md={3} />
                            <Col>
                                <table className='table table-bordered react-bootstrap-table'>
                                    <tbody>
                                        {
                                            exam?.id
                                                ? <>
                                                    <tr>
                                                        <td>{translations(locale)?.exam?.exam_all_student_count_title}</td>
                                                        <td className='text-right'>{exam?.examStudentCount}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>{translations(locale)?.exam?.exam_student_count_title}</td>
                                                        <td className='text-right'>{exam?.totalStudentNumber}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>{translations(locale)?.studentBook?.max_point}</td>
                                                        <td className='text-right'>{exam?.maxScore}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>{translations(locale)?.studentBook?.min_point}</td>
                                                        <td className='text-right'>{exam?.minScore}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>{translations(locale)?.season_score?.quality}</td>
                                                        <td className='text-right'>{exam?.quality}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>{translations(locale)?.season_score?.success}</td>
                                                        <td className='text-right'>{exam?.success}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>{translations(locale)?.season_score?.performance}</td>
                                                        <td className='text-right'>{exam?.averageScore}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>{translations(locale)?.homework?.score}</td>
                                                        <td className='text-right'>{totalAvailableScore ? totalAvailableScore.toFixed(2) : null}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>{translations(locale)?.studentBook?.point_took}</td>
                                                        <td className='text-right'>{totalTakenScore ? totalTakenScore.toFixed(2) : null}</td>
                                                    </tr>
                                                    {
                                                        scoreTypesData?.map((el, key) => (
                                                            <tr key={key}>
                                                                <td>{el?.scoreTypeName}</td>
                                                                <td className='align-right'>
                                                                    {el?.studentCount}
                                                                </td>
                                                            </tr>
                                                        ))
                                                    }
                                                </>
                                                : <tr><td colSpan={4} className='text-center'>{translations(locale)?.action?.emptyTable}</td></tr>
                                        }
                                    </tbody>
                                </table>
                            </Col>
                            <Col md={3} />
                        </Row>
                    </div>
                </div>
            </div>
            <div className='m-portlet mx-5'>
                <div className='m-portlet__body'>
                    <DTable
                        locale={locale}
                        data={questionsData}
                        config={questionConfig}
                        className={'table-striped'}
                        columns={questionColumns}
                    />
                </div>
            </div>
            <div className='m-portlet__foot d-flex justify-content-center gap-05'>
                {/* <button
                    className='btn m-btn--pill btn-outline-metal text-uppercase'
                    onClick={() => navigate('/teacher/journals', { replace: true })}
                >
                    {translations(locale)?.close}
                </button> */}
                <button className='btn m-btn--pill btn-link m-btn m-btn--custom' onClick={() => navigate(urlData ? urlData.backUrl :'/teacher/journals', { replace: true,  state: {parameters: urlData?.parameters, group: urlData?.group} })}>
                    {translations(locale)?.back_to_list}
                </button>
                {
                    !isPublished &&
                    <button
                        className='btn m-btn--pill btn-publish text-uppercase'
                        onClick={handlePublish}
                    >
                        {translations(locale)?.action?.publish}
                    </button>
                }
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

export default resultWithTemplate