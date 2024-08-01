import { useState } from 'react'
import message from 'modules/message'
import React, { useEffect } from 'react'
import { Tab } from 'semantic-ui-react'
import secureLocalStorage from 'react-secure-storage'
import { fetchRequest } from 'utils/fetchRequest'
import { translations } from 'utils/translations'
import { Modal } from 'react-bootstrap'
import ExamInformation from './components/examInformation'
import ScoreWithTemplate from './components/scoreWithTemplate'
import ScoreWithoutTemplate from './components/scoreWithoutTemplate'
// import { teacherJournalExamEdit, teacherJournalExamInfoEdit } from 'Utilities/url'

const EditExam = ({onClose, data, show}) => {

    const location = data

    const locale = secureLocalStorage?.getItem('selectedLang') || 'mn'
    const [loading, setLoading] = useState(false)

    const [activeTab, setActiveTab] = useState(1)

    const [exam, setExam] = useState({})
    const [title, setTitle] = useState('')
    const [students, setStudents] = useState([])

    // useEffect(() => {
    //     if (!location?.state?.id) {
    //         message(translations(locale)?.exam?.notFound)
    //         navigate(-1, { replace: true })
    //     } else {
    //         setActiveTab(1)
    //     }
    // }, [location])

    useEffect(() => { init() }, [])

    const init = () => {
        console.log('init')
        // setLoading(true)
        // fetchRequest(teacherJournalExamEdit, 'POST', { exam: location?.state?.id })
        //     .then((res) => {
        //         if (res.success) {
        //             const { students, title, exam, isTemplate } = res.data
        //             setTitle(title || '')
        //             setStudents(students || [])
        //             setExam({ ...exam, isTemplate, examScore: parseInt(exam?.examScore, 10) } || {})
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

    const handleSubmit = exam => {
        console.log('handleSubmit')
        // setLoading(true)
        // fetchRequest(teacherJournalExamInfoEdit, 'POST', { ...exam })
        //     .then((res) => {
        //         if (res.success) {
        //             init()
        //             setActiveTab(1)
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
            aria-labelledby="contained-modal-title-vcenter"
            className='doubleModal'
            centered
        >
            <Modal.Header closeButton style={{padding: '1rem'}}>
                <Modal.Title className="modal-title d-flex flex-row justify-content-between w-100">
                    {title}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className='pr-0 pl-0 pb-0'>
                <Tab
                    activeIndex={activeTab}
                    onTabChange={(e, data) => setActiveTab(data?.activeIndex)}
                    menu={{ secondary: true, pointing: true, className: 'primaryColor m-0 h-4' }}
                    panes={[
                        {
                            menuItem: translations(locale)?.general_info,
                            render: () => <ExamInformation exam={exam} title={title} onSubmit={handleSubmit} onClose={onClose}/>
                        },
                        {
                            menuItem: translations(locale)?.result_list,
                            render: () =>
                                exam?.isTemplate
                                    ? <ScoreWithTemplate students={students} questions={exam?.exTemplateQuestions} exam={location?.state?.id} isTemplate={exam?.isTemplate} onClose={onClose}/>
                                    : <ScoreWithoutTemplate students={students} examMaxScore={exam?.examScore} exam={location?.state?.id} isTemplate={exam?.isTemplate} onClose={onClose}/>
                        }
                    ]}
                />
            </Modal.Body>
            {/* <Modal.Footer>
                <button 
                    className='btn m-btn--pill btn-link m-btn m-btn--custom'
                    onClick={onClose}
                >
                    {translations(locale)?.back_to_list}
                </button>
            </Modal.Footer> */}
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

export default EditExam