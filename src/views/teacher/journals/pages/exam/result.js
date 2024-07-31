import { useState } from 'react'
import message from 'modules/message'
import React, { useEffect } from 'react'
import secureLocalStorage from 'react-secure-storage'
import { fetchRequest } from 'utils/fetchRequest'
import { translations } from 'utils/translations'
import { Modal } from 'react-bootstrap'
import ResultWithTemplate from './components/resultWithTemplate'
import ResultWithoutTemplate from './components/resultWithoutTemplate'
// import { teacherJournalExamResult, teacherJournalExamTemplateResult } from 'Utilities/url'

const ResultExam = ({onClose, data, show}) => {

    const locale = secureLocalStorage?.getItem('selectedLang') || 'mn'
    const [loading, setLoading] = useState(false)

    const [title, setTitle] = useState('')
    const [classData, setClassData] = useState([])
    const [studentsData, setStudentsData] = useState([])

    const [exam, setExam] = useState({})
    const [questionsData, setQuestionsData] = useState([])
    const [scoreTypesData, setScoreTypesData] = useState([])
    const [urlData] = useState(data?.urlData || null)

    // useEffect(() => {
    //     if (!data?.id) {
    //         message(translations(locale)?.exam?.notFound)
    //         navigate(urlData ? urlData.backUrl : -1, { replace: true })
    //     }
    // }, [])

    // useEffect(() => {
    //     setLoading(true)
    //     if (data?.isTemplate) {
    //         fetchRequest(teacherJournalExamTemplateResult, 'POST', { exam: data?.id })
    //             .then((res) => {
    //                 if (res.success) {
    //                     const { title, exam, questionResults, scoreTypes, studentScores } = res.data
    //                     setExam(exam || {})
    //                     setTitle(title || '')
    //                     setScoreTypesData(scoreTypes || [])
    //                     setStudentsData(studentScores || [])
    //                     setQuestionsData(questionResults || [])
    //                 } else {
    //                     message(res.data.message)
    //                 }
    //                 setLoading(false)
    //             })
    //             .catch(() => {
    //                 message(translations(locale)?.err?.error_occurred)
    //                 setLoading(false)
    //             })
    //     } else {
    //         fetchRequest(teacherJournalExamResult, 'POST', { exam: data?.id })
    //             .then((res) => {
    //                 if (res.success) {
    //                     const { exam, title, studentList, examList } = res.data
    //                     setExam(exam || {})
    //                     setTitle(title || '')
    //                     setClassData(examList || [])
    //                     setStudentsData(studentList || [])
    //                 } else {
    //                     message(res.data.message)
    //                 }
    //                 setLoading(false)
    //             })
    //             .catch(() => {
    //                 message(translations(locale)?.err?.error_occurred)
    //                 setLoading(false)
    //             })
    //     }
    // }, [])

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
                {
                    data?.isTemplate
                        ? <ResultWithTemplate exam={exam} scoreTypesData={scoreTypesData} studentsData={studentsData} questionsData={questionsData} urlData={urlData} onClose={onClose}/>
                        : <ResultWithoutTemplate classData={classData} studentsData={studentsData} exam={exam} urlData={urlData} onClose={onClose}/>
                }
            </Modal.Body>
            {/* <Modal.Footer>
                <button 
                    className='btn m-btn--pill btn-link m-btn m-btn--custom' 
                    onClick={onClose}
                    // onClick={() => navigate(urlData ? urlData.backUrl :'/teacher/journals', { replace: true,  state: {parameters: urlData?.parameters, group: urlData?.group} })}
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

export default ResultExam