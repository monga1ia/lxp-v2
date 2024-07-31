import message from 'modules/message'
import { Col, Row } from 'react-bootstrap'
import CloseIcon from '@mui/icons-material/Close'
import { Checkbox, Modal } from 'semantic-ui-react'
import secureLocalStorage from 'react-secure-storage'
import { translations } from 'utils/translations'
import { NDropdown as Dropdown } from 'widgets/Dropdown'
import React, { useState, useEffect, useRef } from 'react'

const add = ({ onClose, onSubmit, students }) => {
    const locale = secureLocalStorage?.getItem('selectedLang') || 'mn'
    const decimalRegex = /^\d+(\.\d{1,2})?$/

    const inputRefs = useRef([])
    const [questions, setQuestions] = useState([])
    const [selectedStudent, setSelectedStudent] = useState({})

    useEffect(() => {
        let takenScore = 0
        let totalQuestionScore = 0
        questions?.forEach(el => {
            takenScore += parseFloat(el?.takenScore, 10) || 0
            totalQuestionScore += parseFloat(el?.score, 10) || 0
        })
        const studentScore = +((takenScore * 100) / totalQuestionScore).toFixed(2)
        setSelectedStudent({ ...selectedStudent, takenScore, studentScore })
    }, [questions])

    useEffect(() => {
        const handleKeyDown = e => handleKeyPress(e.key)
        document.addEventListener('keydown', handleKeyDown)
        return () => { document.removeEventListener('keydown', handleKeyDown) }
    }, [questions])

    const validateFields = () => {
        if (!selectedStudent?.value)
            return message(translations(locale)?.err?.fill_all_fields)
        if (!questions?.every(el => el.takenScore !== '' && el.takenScore >= 0))
            return message(translations(locale)?.err?.fill_all_fields)
        return true
    }

    const handleSubmit = () => {
        if (validateFields()) onSubmit({ ...selectedStudent, hasScores: true, scores: JSON.stringify(questions) })
    }

    const handleDropDownChange = student => {
        if (selectedStudent?.value) {
            selectedStudent.isFullScore = false
            selectedStudent.description = ''
            selectedStudent.studentScore = ''
            selectedStudent.takenScore = ''
            selectedStudent?.scores?.forEach(el => {
                el.takenScore = ''
                el.isComplete = false
            })
        }
        setSelectedStudent(student)
        setQuestions(student?.scores)
    }

    const handleDescriptionChange = description => setSelectedStudent({ ...selectedStudent, description })

    const handleScoreChange = (index, takenScore) => {
        if (!decimalRegex.test(takenScore)) {
            if (takenScore?.length > 1 && takenScore?.split('')?.filter(x => x == '.')?.length == 1 && takenScore?.endsWith('.')) { }
            else return
        }
        const clone = [...questions]
        const question = clone?.[index]
        const score = parseFloat(question?.score, 10) || 0
        if (score < takenScore) return
        question.takenScore = takenScore
        question.isComplete = score == takenScore ? true : false
        setQuestions(clone)
    }

    const handleCheckboxChange = isFullScore => {
        if (isFullScore) {
            const clone = [...questions]
            clone?.forEach(el => {
                el.takenScore = el?.score
                el.isComplete = true
            })
            setQuestions(clone)
        }
        setSelectedStudent({ ...selectedStudent, isFullScore })
    }

    const addToRefs = ref => {
        if (ref) {
            if (!inputRefs.current.length)
                ref.focus()
            const key = ref.getAttribute('element-key')
            const index = inputRefs.current.findIndex(el => el.getAttribute('element-key') === key)
            if (index > -1)
                inputRefs.current.splice(index, 1, ref)
            else
                inputRefs.current.push(ref)
        }
    }

    const handleKeyPress = key => {
        const activeElement = document.activeElement
        if (activeElement.tagName.toLowerCase() == 'input') {
            const index = inputRefs.current.findIndex(el => el == activeElement)
            if (key === 'ArrowUp' && index > 0)
                inputRefs.current[index - 1].focus()
            else if (key === 'ArrowDown' && index < inputRefs.current.length - 1)
                inputRefs.current[index + 1].focus()
            else if (key === 'Enter' && index == inputRefs.current.length - 1)
                handleSubmit()
        }
    }

    return (
        <Modal
            centered
            open={true}
            size='large'
            onClose={onClose}
            className='react-modal overflow-modal'
        >
            <div className='header'>
                {translations(locale)?.exam?.insert_score}
                <button type='button' className='close' aria-label='Close' onClick={onClose} >
                    <CloseIcon />
                </button>
            </div>
            <div className='content'>
                <Row className='mt-4'>
                    <Col md={2} />
                    <Col>
                        <Row className='form-group'>
                            <Col md={4} className='col-form-label text-right label-pinnacle-bold'>
                                {translations(locale)?.student?.title}*
                            </Col>
                            <Col md={8}>
                                <Dropdown
                                    fluid
                                    search
                                    selection
                                    closeOnChange
                                    options={students}
                                    selectOnBlur={false}
                                    value={selectedStudent?.value}
                                    placeholder={'-' + translations(locale)?.select + '-'}
                                    onChange={(e, data) => handleDropDownChange(data?.options?.find(el => el?.value == data?.value))}
                                />
                            </Col>
                        </Row>
                        {
                            selectedStudent?.value &&
                            <Row>
                                <Col md={5} className='d-flex justify-content-end align-items-center'>
                                    <img src={selectedStudent?.avatar || '/images/avatar.png'}
                                        alt={`photo of ${selectedStudent?.firstName}`}
                                        className='img-circle'
                                        width={100} height={100}
                                        onError={(e) => {
                                            e.target.onError = null
                                            e.target.src = '/images/avatar.png'
                                        }}
                                    />
                                </Col>
                                <Col>
                                    <table>
                                        <tbody>
                                            <tr>
                                                <td className='text-right pr-3' style={{ color: '#868aa8' }}>{translations(locale)?.className}:</td>
                                                <td className='bolder' style={{ color: '#3c3f42' }}>{selectedStudent?.className || '-'}</td>
                                            </tr>
                                            <tr>
                                                <td className='text-right pr-3' style={{ color: '#868aa8' }}>{translations(locale)?.studentCode}:</td>
                                                <td className='bolder' style={{ color: '#3c3f42' }}>{selectedStudent?.studentCode || '-'}</td>
                                            </tr>
                                            <tr>
                                                <td className='text-right pr-3' style={{ color: '#868aa8' }}>{translations(locale)?.studentLastName}:</td>
                                                <td className='bolder' style={{ color: '#3c3f42' }}>{selectedStudent?.lastName || '-'}</td>
                                            </tr>
                                            <tr>
                                                <td className='text-right pr-3' style={{ color: '#868aa8' }}>{translations(locale)?.studentFirstName}:</td>
                                                <td className='bolder' style={{ color: '#3c3f42' }}>{selectedStudent?.firstName || '-'}</td>
                                            </tr>
                                            <tr>
                                                <td className='text-right pr-3' style={{ color: '#868aa8' }}>{translations(locale)?.total_taken_score}:</td>
                                                <td className='bolder' style={{ color: '#3c3f42' }}>{selectedStudent.takenScore ? selectedStudent.takenScore.toFixed(2) : 0}</td>
                                            </tr>
                                            <tr>
                                                <td className='text-right pr-3' style={{ color: '#868aa8' }}>{translations(locale)?.season_score?.performance}:</td>
                                                <td className='bolder' style={{ color: '#3c3f42' }}>{selectedStudent?.studentScore}%</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </Col>
                            </Row>
                        }
                    </Col>
                    <Col md={3} />
                </Row>
                {
                    selectedStudent?.value &&
                    <div className='m-portlet mt-5'>
                        <div className='m-portlet__body'>
                            <div className='d-flex justify-content-end mb-3'>
                                <Checkbox
                                    checked={selectedStudent?.isFullScore}
                                    label={translations(locale)?.exam?.full_score}
                                    onChange={(e, data) => handleCheckboxChange(data?.checked)}
                                />
                            </div>
                            <table className='table table-bordered react-bootstrap-table'>
                                <thead>
                                    <tr>
                                        <th>{translations(locale)?.exam_template?.question}</th>
                                        <th className='no-wrap'>{translations(locale)?.exam_template?.total_score}</th>
                                        <th>{translations(locale)?.exam?.taken_score}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        questions?.map((el, key) => (
                                            <tr key={key}>
                                                <td>{el?.scoreName}</td>
                                                <td className='text-right'>{el?.score}</td>
                                                <td width={200}>
                                                    <input
                                                        type='text'
                                                        ref={addToRefs}
                                                        element-key={key}
                                                        value={el?.takenScore}
                                                        className='form-control'
                                                        placeholder={translations(locale)?.score}
                                                        onChange={(e) => handleScoreChange(key, e.target.value || 0)}
                                                    />
                                                </td>
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </table>
                            <Row className='form-group'>
                                <Col md={2} />
                                <Col>
                                    <Row>
                                        <Col md={4} className='col-form-label text-right label-pinnacle-bold'>
                                            {translations(locale)?.description}
                                        </Col>
                                        <Col md={8}>
                                            <textarea
                                                rows="5"
                                                className='form-control'
                                                value={selectedStudent?.description}
                                                onChange={(e) => handleDescriptionChange(e.target.value)}
                                            />
                                        </Col>
                                    </Row>
                                </Col>
                                <Col md={2} />
                            </Row>
                        </div>
                    </div>
                }
            </div>
            <div className='actions modal-footer'>
                <div className='text-center w-100'>
                    <button
                        className='btn m-btn--pill btn-outline-metal m-btn--wide mr-3'
                        onClick={onClose}
                    >
                        {translations(locale)?.close}
                    </button>
                    <button
                        className='btn m-btn--pill btn-success m-btn--wide'
                        onClick={handleSubmit}
                    >
                        {translations(locale)?.save}
                    </button>
                </div>
            </div>
        </Modal>
    )
}

export default add