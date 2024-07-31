import message from 'modules/message'
import { Link } from 'react-router-dom'
import { Tab } from 'semantic-ui-react'
import Scores from './components/scores'
import React, { useEffect, useState } from 'react'
import ExamOptions from './components/examOptions'
import Skills from './components/skill'
import secureLocalStorage from 'react-secure-storage'
import { fetchRequest } from 'utils/fetchRequest'
import { translations } from 'utils/translations'
import { useLocation, useNavigate } from 'react-router'
import ResultInformation from './components/resultInformation'
import { teacherJournalSeasonResultExamSubmit, teacherJournalSeasonResultSkillSubmit, teacherJournalSeasonResultEdit } from 'Utilities/url'

const locale = secureLocalStorage?.getItem('selectedLang') || 'mn'

const edit = () => {
    const location = useLocation()
    const navigate = useNavigate()

    const [loading, setLoading] = useState(false)

    const [tabs, setTabs] = useState([])
    const [activeTab, setActiveTab] = useState(1)
    const [urlData] = useState(location?.state?.urlData || null)

    const title = location?.state?.title || ''

    useEffect(() => {
        if (!location?.state?.exam || !location?.state?.group) {
            message(translations(locale)?.exam?.notFound)
            navigate(-1, { replace: true })
        }
    }, [location])

    useEffect(() => { init() }, [])

    const init = () => {
        setLoading(true)
        fetchRequest(teacherJournalSeasonResultEdit, 'POST', { exam: location?.state?.exam, group: location?.state?.group })
            .then((res) => {
                if (res.success) {
                    const { exam, examTypes, skills, hasTemplate, hasSkillTemplate, studentList, templateDetails } = res.data;

                    const tabs = [
                        {
                            menuItem: translations(locale)?.general_info,
                            render: () =>
                                <ResultInformation
                                    exam={exam}
                                />
                        },
                        {
                            menuItem: translations(locale)?.result_list,
                            render: () =>
                                <Scores
                                    template={hasTemplate}
                                    exam={exam}
                                    items={templateDetails}
                                    studentList={studentList}
                                    onSubmit={handleScoreSubmit}
                                    hasTestimonial={exam?.hasTestimonial}
                                />
                        }
                    ]

                    let skillTemplateTabIndex = 1
                    let hasExamDetail = false
                    if (hasTemplate) {
                        if (templateDetails && templateDetails.length > 0) {
                            for (let td = 0; td < templateDetails.length; td++) {
                                if (templateDetails[td].itemCode?.toLowerCase().includes('exam')) {
                                    hasExamDetail = true
                                    break
                                }
                            }
                        }
                        if (hasExamDetail) {
                            skillTemplateTabIndex = 2
                            tabs.splice(1, 0, {
                                menuItem: translations(locale)?.season_score?.chooseExam,
                                render: () =>
                                    <ExamOptions
                                        exams={examTypes}
                                        onSubmit={handleExamSubmit}
                                    />
                            })
                        } else {
                            skillTemplateTabIndex = 1
                        }
                    } else {
                        skillTemplateTabIndex = 1
                    }

                    if (hasSkillTemplate)
                        tabs.splice(skillTemplateTabIndex, 0, {
                            menuItem: translations(locale)?.season_score?.skill,
                            render: () =>
                                <Skills
                                    skillList={skills}
                                    onSubmit={(skillIds) => handleSkillSubmit(skillIds, hasExamDetail)}
                                />
                        })

                    setTabs(tabs || [])
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

    const handleExamSubmit = selectedExams => {
        setLoading(true)
        fetchRequest(teacherJournalSeasonResultExamSubmit, 'POST', { selectedExams, exam: location?.state?.exam, group: location?.state?.group })
            .then((res) => {
                if (res.success) {
                    init()
                    message(res.data.message, res.success)
                    setActiveTab(2)
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

    const handleSkillSubmit = (skillList, hasExamTab) => {
        let selectedSkills = [];
        if (skillList && skillList.length > 0) {
            for (let s = 0; s < skillList.length; s++) {
                if (skillList[s]?.checked) {
                    selectedSkills.push(skillList[s]?.id)
                }
            }
        }

        setLoading(true)
        fetchRequest(teacherJournalSeasonResultSkillSubmit, 'POST', { selectedSkills, exam: location?.state?.exam, group: location?.state?.group })
            .then((res) => {
                if (res.success) {
                    message(res.data.message, res.success)
                    if (hasExamTab) {
                        setActiveTab(3)
                    } else {
                        setActiveTab(2)
                    }
                    init()
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

    const handleScoreSubmit = params => {

        setLoading(true)
        fetchRequest(teacherJournalSeasonResultEdit, 'POST', { ...params, submit: 1, exam: location?.state?.exam, group: location?.state?.group })
            .then((res) => {
                if (res.success) {
                    message(res.data.message, res.success)
                    if (params?.publish === 1) {
                        navigate('/teacher/journals')
                    } else {

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

    return (
        <div className='m-grid__item m-grid__item--fluid m-wrapper'>
            <div className='m-portlet'>
                <div className='m-portlet__head justify-content-between align-items-center pr-0 pl-4'>
                    <span className='fs-11 pinnacle-bold' style={{ color: '#ff5b1d' }}>{title}</span>
                    <Link
                        to='/teacher/journals'
                        className='btn m-btn--pill btn-link m-btn m-btn--custom'
                    >
                        {translations(locale)?.back_to_list}
                    </Link>
                </div>
                <Tab
                    panes={tabs}
                    activeIndex={activeTab}
                    onTabChange={(e, data) => setActiveTab(data?.activeIndex)}
                    menu={{ secondary: true, pointing: true, className: 'primaryColor m-0 h-4' }}
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