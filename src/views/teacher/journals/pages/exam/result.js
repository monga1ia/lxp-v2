import { useState } from 'react'
import message from 'modules/message'
import React, { useEffect } from 'react'
import secureLocalStorage from 'react-secure-storage'
import { fetchRequest } from 'utils/fetchRequest'
import { translations } from 'utils/translations'
import { useLocation, useNavigate } from 'react-router'
import ResultWithTemplate from './components/resultWithTemplate'
import ResultWithoutTemplate from './components/resultWithoutTemplate'
import { teacherJournalExamResult, teacherJournalExamTemplateResult } from 'Utilities/url'

const result = () => {
    const location = useLocation()
    const navigate = useNavigate()

    const locale = secureLocalStorage?.getItem('selectedLang') || 'mn'
    const [loading, setLoading] = useState(false)

    const [title, setTitle] = useState('')
    const [classData, setClassData] = useState([])
    const [studentsData, setStudentsData] = useState([])

    const [exam, setExam] = useState({})
    const [questionsData, setQuestionsData] = useState([])
    const [scoreTypesData, setScoreTypesData] = useState([])
    const [urlData] = useState(location?.state?.urlData || null)

    useEffect(() => {
        if (!location?.state?.id) {
            message(translations(locale)?.exam?.notFound)
            navigate(urlData ? urlData.backUrl : -1, { replace: true })
        }
    }, [])

    useEffect(() => {
        setLoading(true)
        if (location?.state?.isTemplate) {
            fetchRequest(teacherJournalExamTemplateResult, 'POST', { exam: location?.state?.id })
                .then((res) => {
                    if (res.success) {
                        const { title, exam, questionResults, scoreTypes, studentScores } = res.data
                        setExam(exam || {})
                        setTitle(title || '')
                        setScoreTypesData(scoreTypes || [])
                        setStudentsData(studentScores || [])
                        setQuestionsData(questionResults || [])
                    } else {
                        message(res.data.message)
                    }
                    setLoading(false)
                })
                .catch(() => {
                    message(translations(locale)?.err?.error_occurred)
                    setLoading(false)
                })
        } else {
            fetchRequest(teacherJournalExamResult, 'POST', { exam: location?.state?.id })
                .then((res) => {
                    if (res.success) {
                        const { exam, title, studentList, examList } = res.data
                        setExam(exam || {})
                        setTitle(title || '')
                        setClassData(examList || [])
                        setStudentsData(studentList || [])
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
    }, [])

    return (
        <div className='m-grid__item m-grid__item--fluid m-wrapper'>
            <div className='m-portlet'>
                <div className='m-portlet__head justify-content-between align-items-center pr-0 pl-4'>
                    <span className='fs-11 pinnacle-bold' style={{ color: '#ff5b1d' }}>{title}</span>
                    <button className='btn m-btn--pill btn-link m-btn m-btn--custom' onClick={() => navigate(urlData ? urlData.backUrl :'/teacher/journals', { replace: true,  state: {parameters: urlData?.parameters, group: urlData?.group} })}>
                        {translations(locale)?.back_to_list}
                    </button>
                </div>
                {
                    location?.state?.isTemplate
                        ? <ResultWithTemplate exam={exam} scoreTypesData={scoreTypesData} studentsData={studentsData} questionsData={questionsData} urlData={urlData}/>
                        : <ResultWithoutTemplate classData={classData} studentsData={studentsData} exam={exam} urlData={urlData}/>
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
        </div>
    )
}

export default result