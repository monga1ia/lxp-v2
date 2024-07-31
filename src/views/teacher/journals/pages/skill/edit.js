import message from 'modules/message'
import { Tab } from 'semantic-ui-react'
import React, { useEffect, useState } from 'react'
import secureLocalStorage from 'react-secure-storage'
import { fetchRequest } from 'utils/fetchRequest'
import { translations } from 'utils/translations'
import { useLocation, useNavigate } from 'react-router'
import AssessmentList from './components/assessmentList'
import GeneralInformation from './components/generalInformation'
import { teacherJournalSkillView, teacherJournalSkillSubmit } from 'Utilities/url'

const edit = () => {
    const location = useLocation()
    const navigate = useNavigate()

    const locale = secureLocalStorage?.getItem('selectedLang') || 'mn'
    const [loading, setLoading] = useState(false)

    const [skill, setSkill] = useState({})
    const [students, setStudents] = useState([])
    const [templateDetails, setTemplateDetails] = useState([])

    useEffect(() => {
        if (!location?.state?.skill) {
            message(translations(locale)?.skill?.notFound)
            navigate(-1, { replace: true })
        }
    }, [location])

    useEffect(() => { init() }, [])

    const init = () => {
        setLoading(true)
        fetchRequest(teacherJournalSkillView, 'POST', { skill: location?.state?.skill })
            .then((res) => {
                if (res.success) {
                    const { skill, students, templateDetails, } = res?.data
                    setSkill(skill || {})
                    setStudents(students || [])
                    setTemplateDetails(templateDetails || [])
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
                    <span className='fs-11 pinnacle-bold' style={{ color: '#ff5b1d' }}>
                        {`${skill?.groupName}, ${skill?.className}, ${skill?.subjectName}`}
                    </span>
                    <button className='btn m-btn--pill btn-link m-btn m-btn--custom' onClick={() => navigate('/teacher/journals', { replace: true })}>
                        {translations(locale)?.back_to_list}
                    </button>
                </div>
                <Tab
                    defaultActiveIndex={1}
                    menu={{ secondary: true, pointing: true, className: 'primaryColor m-0 h-4' }}
                    panes={[
                        {
                            menuItem: translations(locale)?.general_info,
                            render: () => <GeneralInformation group={skill} />
                        },
                        {
                            menuItem: translations(locale)?.skill?.assessmentList,
                            render: () => <AssessmentList skill={skill} students={students} templateDetails={templateDetails} />
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