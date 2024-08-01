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
import ResultInformation from './components/resultInformation'
import { Modal } from 'react-bootstrap'
// import { teacherJournalSeasonResultExamSubmit, teacherJournalSeasonResultSkillSubmit, teacherJournalSeasonResultEdit } from 'Utilities/url'

const locale = secureLocalStorage?.getItem('selectedLang') || 'mn'

const EditSeasonResult = ({onClose, data, show}) => {

    const [loading, setLoading] = useState(false)

    const [tabs, setTabs] = useState([])
    const [activeTab, setActiveTab] = useState(1)
    // const [urlData] = useState(location?.state?.urlData || null)

    const title = data?.title || ''

    // useEffect(() => {
    //     if (!location?.state?.exam || !location?.state?.group) {
    //         message(translations(locale)?.exam?.notFound)
    //         navigate(-1, { replace: true })
    //     }
    // }, [location])

    useEffect(() => { init() }, [])

    const init = () => {
        console.log('init')
        // setLoading(true)
        // fetchRequest(teacherJournalSeasonResultEdit, 'POST', { exam: location?.state?.exam, group: location?.state?.group })
        //     .then((res) => {
        //         if (res.success) {
        //             const { exam, examTypes, skills, hasTemplate, hasSkillTemplate, studentList, templateDetails } = res.data;

        //             const tabs = [
        //                 {
        //                     menuItem: translations(locale)?.general_info,
        //                     render: () =>
        //                         <ResultInformation
        //                             exam={exam}
        //                         />
        //                 },
        //                 {
        //                     menuItem: translations(locale)?.result_list,
        //                     render: () =>
        //                         <Scores
        //                             template={hasTemplate}
        //                             exam={exam}
        //                             items={templateDetails}
        //                             studentList={studentList}
        //                             onSubmit={handleScoreSubmit}
        //                             hasTestimonial={exam?.hasTestimonial}
        //                         />
        //                 }
        //             ]

        //             let skillTemplateTabIndex = 1
        //             let hasExamDetail = false
        //             if (hasTemplate) {
        //                 if (templateDetails && templateDetails.length > 0) {
        //                     for (let td = 0; td < templateDetails.length; td++) {
        //                         if (templateDetails[td].itemCode?.toLowerCase().includes('exam')) {
        //                             hasExamDetail = true
        //                             break
        //                         }
        //                     }
        //                 }
        //                 if (hasExamDetail) {
        //                     skillTemplateTabIndex = 2
        //                     tabs.splice(1, 0, {
        //                         menuItem: translations(locale)?.season_score?.chooseExam,
        //                         render: () =>
        //                             <ExamOptions
        //                                 exams={examTypes}
        //                                 onSubmit={handleExamSubmit}
        //                             />
        //                     })
        //                 } else {
        //                     skillTemplateTabIndex = 1
        //                 }
        //             } else {
        //                 skillTemplateTabIndex = 1
        //             }

        //             if (hasSkillTemplate)
        //                 tabs.splice(skillTemplateTabIndex, 0, {
        //                     menuItem: translations(locale)?.season_score?.skill,
        //                     render: () =>
        //                         <Skills
        //                             skillList={skills}
        //                             onSubmit={(skillIds) => handleSkillSubmit(skillIds, hasExamDetail)}
        //                         />
        //                 })

        //             setTabs(tabs || [])
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

    const handleExamSubmit = selectedExams => {
        console.log("handleExamSubmit")
        // setLoading(true)
        // fetchRequest(teacherJournalSeasonResultExamSubmit, 'POST', { selectedExams, exam: location?.state?.exam, group: location?.state?.group })
        //     .then((res) => {
        //         if (res.success) {
        //             init()
        //             message(res.data.message, res.success)
        //             setActiveTab(2)
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

    const handleSkillSubmit = (skillList, hasExamTab) => {

        console.log('handleSkillSubmit')
        // let selectedSkills = [];
        // if (skillList && skillList.length > 0) {
        //     for (let s = 0; s < skillList.length; s++) {
        //         if (skillList[s]?.checked) {
        //             selectedSkills.push(skillList[s]?.id)
        //         }
        //     }
        // }

        // setLoading(true)
        // fetchRequest(teacherJournalSeasonResultSkillSubmit, 'POST', { selectedSkills, exam: location?.state?.exam, group: location?.state?.group })
        //     .then((res) => {
        //         if (res.success) {
        //             message(res.data.message, res.success)
        //             if (hasExamTab) {
        //                 setActiveTab(3)
        //             } else {
        //                 setActiveTab(2)
        //             }
        //             init()
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

    const handleScoreSubmit = params => {
        console.log('handleScoreSubmit')
        // setLoading(true)
        // fetchRequest(teacherJournalSeasonResultEdit, 'POST', { ...params, submit: 1, exam: location?.state?.exam, group: location?.state?.group })
        //     .then((res) => {
        //         if (res.success) {
        //             message(res.data.message, res.success)
        //             if (params?.publish === 1) {
        //                 navigate('/teacher/journals')
        //             } else {

        //             }
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

    return (
        <Modal
            size='xl'
            dimmer='blurring'
            show={show}
            onHide={onClose}
            className='doubleModal'
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton style={{padding: '1rem'}}>
                <Modal.Title className="modal-title d-flex flex-row justify-content-between w-100">
                    {title}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Tab
                    panes={tabs}
                    activeIndex={activeTab}
                    // className='m-portlet-header'
                    onTabChange={(e, data) => setActiveTab(data?.activeIndex)}
                    menu={{ secondary: true, pointing: true, className: 'primaryColor m-0 h-4' }}
                />
            </Modal.Body>
            <Modal.Footer>
                <button
                    className='btn m-btn--pill btn-link m-btn m-btn--custom'
                    onClick={onClose}
                >
                    {translations(locale)?.back_to_list}
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
        </Modal>
    )
}

export default EditSeasonResult