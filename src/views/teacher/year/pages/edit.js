import message from 'modules/message'
// import {Link} from 'react-router-dom'
import {Tab} from 'semantic-ui-react'
import React, {useEffect, useState} from 'react'
import SeasonScore from './components/seasonScore'
import Scores from './components/scores'
import ResultInformation from './components/resultInformation'
import secureLocalStorage from 'react-secure-storage'
import {fetchRequest} from 'utils/fetchRequest'
import {translations} from 'utils/translations'

// import {
//     teacherJournalExamEdit,
//     teacherJournalExamPublish,
//     teacherJournalSeasonResultEdit, teacherJournalSeasonResultExamSubmit, teacherJournalSeasonResultSkillSubmit,
//     teacherYearResultEdit
// } from 'Utilities/url'
import ExamOptions from "./components/examOptions";
import Skills from "./components/skill";
import { Modal } from 'react-bootstrap'

const locale = secureLocalStorage?.getItem('selectedLang') || 'mn'

const YearEdit = ({onClose, data, show}) => {

    const [loading, setLoading] = useState(false)

    const [activeTab, setActiveTab] = useState(1)
    const [students, setStudents] = useState([])
    const [exam, setExam] = useState([])

    const [tabs, setTabs] = useState([])

    const [updateView, setUpdateView] = useState(false)

    const title = data?.title || ''

    useEffect(() => {
    }, [data])

    useEffect(() => {
        init()
    }, [])

    const handleSkillSubmit = (skillList, hasExamTab) => {
        let selectedSkills = [];
        if (skillList && skillList.length > 0) {
            for (let s = 0; s < skillList.length; s++) {
                if (skillList[s]?.checked) {
                    selectedSkills.push(skillList[s]?.id)
                }
            }
        }

        console.log('handleSkillSubmit')

        // setLoading(true)
        // fetchRequest(teacherJournalSeasonResultSkillSubmit, 'POST', { selectedSkills, exam: data?.exam, group: data?.group })
        //     .then((res) => {
        //         if (res.success) {
        //             message(res.data.message, res.success)
        //             if (hasExamTab) {
        //                 setActiveTab(3)
        //             } else {
        //                 setActiveTab(2)
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

    const init = () => {
        console.log('init')
        // setLoading(true)
        // fetchRequest(teacherYearResultEdit, 'POST', {
        //     exam: data?.exam,
        //     group: data?.group,
        //     season: data?.season
        // })
        //     .then((res) => {
        //         if (res.success) {
        //             const { hasSkillTemplate = false, hasExamTemplate = false, examTypes = [], templateDetails = [] } = res.data;

        //             setExam(res?.data?.exam)
        //             setStudents(res?.data?.students)

        //             const tabList = [
        //                 {
        //                     menuItem: translations(locale)?.general_info,
        //                     render: () =>
        //                         // yamar neg utga zasahgvi gj bodood hiilee, zasahaar bol jiliin etsesiin dvn ustgaad dahin oruulna
        //                         <ResultInformation
        //                             exam={res?.data?.exam}
        //                         />
        //                 },
        //                 {
        //                     menuItem: translations(locale)?.result_list,
        //                     render: () =>
        //                         <Scores
        //                             items={templateDetails}
        //                             exam={res?.data?.exam}
        //                             group={data?.group}
        //                             season={data?.season}
        //                             onSubmit={handleScoreSubmit}
        //                             hasTestimonial={res?.data?.exam?.hasTestimonial}
        //                         />
        //                 }
        //             ]

        //             let skillTemplateTabIndex = 1
        //             if (hasExamTemplate) {
        //                 skillTemplateTabIndex = 2
        //                 tabList.splice(1, 0, {
        //                     menuItem: translations(locale)?.season_score?.chooseExam,
        //                     render: () =>
        //                         <ExamOptions
        //                             exams={examTypes}
        //                             onSubmit={handleExamSubmit}
        //                         />
        //                 })
        //             }

        //             if (hasSkillTemplate) {
        //                 tabList.splice(skillTemplateTabIndex, 0, {
        //                     menuItem: translations(locale)?.season_score?.skill,
        //                     render: () =>
        //                         <Skills
        //                             skillList={[]}
        //                             onSubmit={(skillIds) => {
        //                                 handleSkillSubmit(skillIds, hasExamTemplate)
        //                             }}
        //                         />
        //                 })
        //             }

        //             setTabs(tabList)
        //             setUpdateView(!updateView)
        //         } else {
        //             message(res.data.message)
        //         }
        //         setLoading(false)
        //     })
        //     .catch((e) => {
        //         console.log(e)
        //         message(translations(locale)?.err?.error_occurred)
        //         setLoading(false)
        //     })
    }

    const handleExamSubmit = params => {

        console.log('handleExamSubmit')
        // setLoading(true)
        // fetchRequest(teacherJournalSeasonResultExamSubmit, 'POST', { selectedExams: params, submit: 1, exam: data?.exam, group: data?.group })
        //     .then((res) => {
        //         if (res.success) {
        //             message(res.data.message, res.success)
        //             if (params?.publish === 1) {
        //                 navigate('/teacher/year')
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

    const handleScoreSubmit = params => {
        console.log('handleScoreSubmit')
        // setLoading(true)
        // fetchRequest(teacherJournalExamEdit, 'POST', {
        //     exam: exam?.id,
        //     submit: 1,
        //     ...params
        // })
        //     .then((res) => {
        //         if (res.success) {
        //             message(res.data.message, res.success)
        //             if (res?.data?.publish) {
        //                 handlePublish(res?.data?.exam)
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

    const handlePublish = (examId) => {
        console.log('handlePublish')
        // setLoading(true)
        // fetchRequest(teacherJournalExamPublish, 'POST', {exam: examId})
        //     .then((res) => {
        //         if (res.success) {
        //             navigate('/teacher/journals/exams/result', {
        //                 state: {
        //                     id: examId,
        //                     urlData: {backUrl: '/teacher/year'}
        //                 }, replace: true
        //             })
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
            show={show}
            size='xl'
            onHide={onClose}
            dimmer='blurring'
            className='doubleModal'
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton style={{padding: '1rem'}}>
                <Modal.Title className="modal-title d-flex flex-row justify-content-between w-100">
                    {title}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body style={{color: '#212529'}}>
                <Tab
                    panes={tabs}
                    activeIndex={activeTab}
                    onTabChange={(e, data) => setActiveTab(data?.activeIndex)}
                    menu={{secondary: true, pointing: true, className: 'primaryColor m-0 h-4'}}
                />
                {/*{*/}
                {/*    isSeason*/}
                {/*        ?*/}
                {/*        <div className='m-portlet__body'>*/}
                {/*            <SeasonScore*/}
                {/*                examObj={exam}*/}
                {/*                studentList={students}*/}
                {/*                scoreTypes={scoreTypes}*/}
                {/*                seasonDetails={seasonDetails}*/}
                {/*                onSubmit={handleExamSubmit}*/}
                {/*            />*/}
                {/*        </div>*/}
                {/*        :*/}
                {/*        */}
                {/*}*/}
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
                    <div className='blockUI blockOverlay'/>
                    <div className='blockUI blockMsg blockPage'>
                        <div className='m-loader m-loader--brand m-loader--lg'/>
                    </div>
                </>
            }
        </Modal>
    )
}

export default YearEdit