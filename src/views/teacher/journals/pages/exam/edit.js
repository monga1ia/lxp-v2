import { useState } from 'react'
import message from 'modules/message'
import React, { useEffect } from 'react'
import { Tab } from 'semantic-ui-react'
import secureLocalStorage from 'react-secure-storage'
import { fetchRequest } from 'utils/fetchRequest'
import { translations } from 'utils/translations'
import { useLocation, useNavigate } from 'react-router'
import ExamInformation from './components/examInformation'
import ScoreWithTemplate from './components/scoreWithTemplate'
import ScoreWithoutTemplate from './components/scoreWithoutTemplate'
import { teacherJournalExamEdit, teacherJournalExamInfoEdit } from 'Utilities/url'

const edit = () => {
    const location = useLocation()
    const navigate = useNavigate()

    const locale = secureLocalStorage?.getItem('selectedLang') || 'mn'
    const [loading, setLoading] = useState(false)

    const [activeTab, setActiveTab] = useState(1)

    const [exam, setExam] = useState({})
    const [title, setTitle] = useState('')
    const [students, setStudents] = useState([])

    useEffect(() => {
        if (!location?.state?.id) {
            message(translations(locale)?.exam?.notFound)
            navigate(-1, { replace: true })
        } else {
            setActiveTab(1)
        }
    }, [location])

    useEffect(() => { init() }, [])

    const init = () => {
        setLoading(true)
        fetchRequest(teacherJournalExamEdit, 'POST', { exam: location?.state?.id })
            .then((res) => {
                if (res.success) {
                    const { students, title, exam, isTemplate } = res.data
                    setTitle(title || '')
                    setStudents(students || [])
                    setExam({ ...exam, isTemplate, examScore: parseInt(exam?.examScore, 10) } || {})
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

    const handleSubmit = exam => {
        setLoading(true)
        fetchRequest(teacherJournalExamInfoEdit, 'POST', { ...exam })
            .then((res) => {
                if (res.success) {
                    init()
                    setActiveTab(1)
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

    return (
        <div className='m-grid__item m-grid__item--fluid m-wrapper'>
            <div className='m-portlet'>
                <div className='m-portlet__head justify-content-between align-items-center pr-0 pl-4'>
                    <span className='fs-11 pinnacle-bold' style={{ color: '#ff5b1d' }}>{title}</span>
                    <button className='btn m-btn--pill btn-link m-btn m-btn--custom' onClick={() => navigate('/teacher/journals', { replace: true })}>
                        {translations(locale)?.back_to_list}
                    </button>
                </div>
                <Tab
                    activeIndex={activeTab}
                    onTabChange={(e, data) => setActiveTab(data?.activeIndex)}
                    menu={{ secondary: true, pointing: true, className: 'primaryColor m-0 h-4' }}
                    panes={[
                        {
                            menuItem: translations(locale)?.general_info,
                            render: () => <ExamInformation exam={exam} title={title} onSubmit={handleSubmit} />
                        },
                        {
                            menuItem: translations(locale)?.result_list,
                            render: () =>
                                exam?.isTemplate
                                    ? <ScoreWithTemplate students={students} questions={exam?.exTemplateQuestions} exam={location?.state?.id} isTemplate={exam?.isTemplate} />
                                    : <ScoreWithoutTemplate students={students} examMaxScore={exam?.examScore} exam={location?.state?.id} isTemplate={exam?.isTemplate} />
                        }
                    ]}
                />
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

export default edit