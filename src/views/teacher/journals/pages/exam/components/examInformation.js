import message from 'modules/message'
import React, { useState } from 'react'
import { useNavigate } from 'react-router'
import { Col, Row } from 'react-bootstrap'
import { Checkbox } from 'semantic-ui-react'
import secureLocalStorage from 'react-secure-storage'
import { translations } from 'utils/translations'
import DayPickerInput from 'react-day-picker/DayPickerInput'

const examInformation = ({ exam, title, onSubmit }) => {
    const navigate = useNavigate()
    const decimalRegex = /^\d+(\.\d{1,2})?$/

    const locale = secureLocalStorage?.getItem('selectedLang') || 'mn'

    const [editedExam, setEditedExam] = useState(exam || {})

    const handleChange = (name, value) => setEditedExam({ ...editedExam, [name]: value })

    const handleSubmit = () => {
        if (validateFields()) onSubmit({
            ...editedExam,
            calculateScore: editedExam?.calculateScore ? 1 : 0,
            calculatePercentage: editedExam?.calculatePercentage ? 1 : (editedExam?.calculateScore ? 0 : 1),
            calculate: editedExam?.calculateScore ? 'score' : (editedExam?.calculatePercentage ? 'percentage' : 'percentage'),
        })
    }

    const validateFields = () => {
        if (!editedExam?.takenDate || !editedExam?.scoreType || !editedExam?.name) return message(translations(locale)?.err?.fill_all_fields)
        if (!editedExam?.isTemplate && !editedExam?.examScore) return message(translations(locale)?.err?.fill_all_fields)
        return true
    }

    const handleCheckBoxChange = (name, checked) => {
        let calculateScore = false
        let calculatePercentage = false
        if (name === 'calculateScore') {
            calculateScore = checked
            calculatePercentage = !checked
        } else {
            calculatePercentage = checked
            calculateScore = !checked
        }
        setEditedExam({ ...editedExam, calculateScore, calculatePercentage })
    }

    const handleScoreChange = examScore => {
        if (!decimalRegex.test(examScore)) {
            if (examScore?.length > 1 && examScore?.split('')?.filter(x => x == '.')?.length == 1 && examScore?.endsWith('.')) { }
            else return
        }
        setEditedExam({ ...editedExam, examScore })
    }

    return (
        <>
            <div className='m-portlet__body'>
                <Row className='mt-4'>
                    <Col md={2} />
                    <Col>
                        <Row className='form-group'>
                            <Col md={4} className='text-right label-pinnacle-bold'>
                                {translations(locale)?.to_take}
                            </Col>
                            <Col md={8} className='d-flex flex-column'>
                                {title}
                            </Col>
                        </Row>
                        <Row className='form-group'>
                            <Col md={4} className='col-form-label text-right label-pinnacle-bold'>
                                {translations(locale)?.exam?.date}*
                            </Col>
                            <Col md={8}>
                                <DayPickerInput
                                    value={editedExam?.takenDate}
                                    inputProps={{ className: 'form-control' }}
                                    placeholder={translations(locale)?.datePickerPlaceholder}
                                    onDayChange={(day) => handleChange('takenDate', day?.toISOString()?.split('T')?.[0])}
                                    classNames={{ overlay: 'DayPickerInputOverlay', container: 'position-relative' }}
                                />
                            </Col>
                        </Row>
                        <Row className='form-group'>
                            <Col md={4} className='col-form-label text-right label-pinnacle-bold'>
                                {translations(locale)?.exam_template?.title}
                            </Col>
                            <Col md={8}>
                                <input
                                    disabled
                                    type='text'
                                    value={editedExam?.exTemplate || '-'}
                                    className='form-control cursor-not-allowed'
                                />
                            </Col>
                        </Row>
                        <Row className='form-group'>
                            <Col md={4} className='col-form-label text-right label-pinnacle-bold'>
                                {translations(locale)?.score_type}
                            </Col>
                            <Col md={8}>
                                <input
                                    disabled
                                    type='text'
                                    value={editedExam?.scoreTypeName || '-'}
                                    className='form-control cursor-not-allowed'
                                />
                            </Col>
                        </Row>
                        {
                            !editedExam?.isTemplate &&
                            <>
                                <Row className='form-group'>
                                    <Col md={4} className='col-form-label text-right label-pinnacle-bold'>
                                        {translations(locale)?.score}*
                                    </Col>
                                    <Col md={8}>
                                        <input
                                            type='number'
                                            className='form-control'
                                            value={editedExam?.examScore || ''}
                                            placeholder={translations(locale)?.score}
                                            onChange={(e) => handleScoreChange(e.target.value || 0)}
                                        />
                                        <span className='fs-09' style={{ color: '#f4516c' }}>{translations(locale)?.exam?.warning_message}</span>
                                    </Col>
                                </Row>
                                <Row className='form-group'>
                                    <Col md={4} className='col-form-label text-right label-pinnacle-bold'></Col>
                                    <Col md={8} className='d-flex flex-column mt-1'>
                                        <Checkbox
                                            defaultChecked
                                            checked={editedExam?.calculatePercentage}
                                            label={translations(locale)?.exam?.changePercentage}
                                            onChange={(e, data) => handleCheckBoxChange('calculatePercentage', data?.checked)}
                                        />
                                        <Checkbox
                                            checked={editedExam?.calculateScore}
                                            label={translations(locale)?.exam?.changeScore}
                                            onChange={(e, data) => handleCheckBoxChange('calculateScore', data?.checked)}
                                        />
                                    </Col>
                                </Row>
                            </>
                        }
                        <Row className='form-group'>
                            <Col md={4} className='col-form-label text-right label-pinnacle-bold'>
                                {translations(locale)?.exam?.name}*
                            </Col>
                            <Col md={8}>
                                <input
                                    type='text'
                                    className='form-control'
                                    value={editedExam?.name || ''}
                                    placeholder={translations(locale)?.exam?.name}
                                    onChange={(e) => handleChange('name', e.target.value)}
                                />
                            </Col>
                        </Row>
                        <Row className='form-group'>
                            <Col md={4} className='col-form-label text-right label-pinnacle-bold'>
                                {translations(locale)?.purpose}
                            </Col>
                            <Col md={8}>
                                <textarea
                                    rows={5}
                                    className="form-control"
                                    value={editedExam?.description}
                                    placeholder={translations(locale)?.purpose}
                                    onChange={(e) => handleChange('description', e.target.value)}
                                />
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4} />
                </Row>
            </div>
            <div className="m-portlet__foot d-flex justify-content-center gap-05">
                <button
                    className='btn btn-link'
                    onClick={() => navigate(-1, { replace: true })}
                >
                    {translations(locale)?.back}
                </button>
                <button
                    className="btn m-btn--pill btn-publish text-uppercase"
                    onClick={handleSubmit}
                >
                    {translations(locale)?.exam?.insert_score}
                </button>
            </div>
        </>
    )
}

export default examInformation