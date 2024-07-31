import { useState } from 'react'
import message from 'modules/message'
import React, { useEffect } from 'react'
import { Col, Row } from 'react-bootstrap'
import { Checkbox } from 'semantic-ui-react'
import secureLocalStorage from 'react-secure-storage'
import { fetchRequest } from 'utils/fetchRequest'
import { translations } from 'utils/translations'
import { useLocation, useNavigate } from 'react-router'
import { teacherJournalExamSubmit } from 'Utilities/url'
import { NDropdown as Dropdown } from 'widgets/Dropdown'
import DayPickerInput from 'react-day-picker/DayPickerInput'

const add = () => {
    const location = useLocation()
    const navigate = useNavigate()
    const decimalRegex = /^\d+(\.\d{1,2})?$/

    const locale = secureLocalStorage?.getItem('selectedLang') || 'mn'
    const [loading, setLoading] = useState(false)

    const [exam, setExam] = useState({})
    const [group, setGroup] = useState({})
    const [templateOptions, setTemplateOptions] = useState([])
    const [scoreTypeOptions, setScoreTypeOptions] = useState([])

    useEffect(() => {
        if (!location?.state?.id || !location?.state?.season || !location?.state?.type) {
            message(translations(locale)?.exam?.notFound)
            navigate(-1, { replace: true })
        }
    }, [])

    useEffect(() => {
        setLoading(true)
        fetchRequest(teacherJournalExamSubmit, 'POST', { group: location?.state?.id, season: location?.state?.season, type: location?.state?.type })
            .then((res) => {
                if (res.success) {
                    const { templates, scoreTypes, group } = res.data
                    setGroup(group || {})
                    setTemplateOptions(templates || [])
                    setScoreTypeOptions(scoreTypes || [])
                } else {
                    message(res.data.message)
                }
                setLoading(false)
            })
            .catch(() => {
                message(translations(locale)?.err?.error_occurred)
                setLoading(false)
            })
    }, [])

    const handleSubmit = () => {
        if (validateFields()) {
            setLoading(true)
            fetchRequest(teacherJournalExamSubmit, 'POST', {
                submit: 1,
                day: exam?.date,
                examName: exam?.title,
                examScore: exam?.score,
                template: exam?.template,
                group: location?.state?.id,
                scoreType: exam?.scoreType,
                description: exam?.purpose,
                type: location?.state?.type,
                season: location?.state?.season,
                isCalculateRank: exam?.isCalculateRank ? 1 : 0,
                scoreTypeName: scoreTypeOptions?.find(el => el?.value == exam?.scoreType)?.text,
            })
                .then((res) => {
                    if (res.success) {
                        message(res.data.message, res.success)
                        navigate('/teacher/journals/exams/edit', { state: { id: res.data.examId } })
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
    }

    const validateFields = () => {
        if (!exam?.date || !exam?.scoreType || !exam?.title) return message(translations(locale)?.err?.fill_all_fields)
        if (!exam?.template && !exam?.score) return message(translations(locale)?.err?.fill_all_fields)
        return true
    }

    const handleChange = (name, value) => setExam({ ...exam, [name]: value })

    const handleScoreChange = score => {
        if (!decimalRegex.test(score)) {
            if (score?.length > 1 && score?.split('')?.filter(x => x == '.')?.length == 1 && score?.endsWith('.')) { }
            else return
        }
        setExam({ ...exam, score })
    }

    return (
        <div className='m-grid__item m-grid__item--fluid m-wrapper'>
            <div className='m-portlet'>
                <div className='m-portlet__head justify-content-between align-items-center pr-0 pl-4'>
                    <span className='fs-11 pinnacle-bold' style={{ color: '#ff5b1d' }}>
                        {`${group?.subjectName}, ${group?.groupName}, ${group?.classes}`}
                    </span>
                    <button className='btn m-btn--pill btn-link m-btn m-btn--custom' onClick={() => navigate('/teacher/journals', { replace: true })}>
                        {translations(locale)?.back_to_list}
                    </button>
                </div>
                <div className='m-portlet__body'>
                    <Row className='mt-4'>
                        <Col md={2} />
                        <Col>
                            <Row className='form-group'>
                                <Col md={4} className='text-right label-pinnacle-bold'>
                                    {translations(locale)?.teacher?.classThatWillTakeExam}
                                </Col>
                                <Col md={8} className='d-flex flex-column'>
                                    <span>{group?.subjectName}</span>
                                    <span className='bolder'>{group?.groupName}</span>
                                    <span style={{ textDecoration: 'underline' }}>{group?.classes}</span>
                                </Col>
                            </Row>
                            <Row className='form-group'>
                                <Col md={4} className='col-form-label text-right label-pinnacle-bold'>
                                    {translations(locale)?.exam?.date}*
                                </Col>
                                <Col md={8}>
                                    <DayPickerInput
                                        value={exam?.date}
                                        inputProps={{ className: 'form-control' }}
                                        placeholder={translations(locale)?.datePickerPlaceholder}
                                        onDayChange={(day) => handleChange('date', day?.toISOString()?.split('T')?.[0])}
                                        classNames={{ overlay: 'DayPickerInputOverlay', container: 'position-relative' }}
                                    />
                                </Col>
                            </Row>
                            <Row className='form-group'>
                                <Col md={4} className='col-form-label text-right label-pinnacle-bold'>
                                    {translations(locale)?.exam_template?.title}
                                </Col>
                                <Col md={8}>
                                    <Dropdown
                                        fluid
                                        selection
                                        clearable
                                        closeOnChange
                                        value={exam?.template}
                                        options={templateOptions}
                                        placeholder={'-' + translations(locale)?.select + '-'}
                                        onChange={(e, data) => handleChange('template', data?.value)}
                                    />
                                </Col>
                            </Row>
                            <Row className='form-group'>
                                <Col md={4} className='col-form-label text-right label-pinnacle-bold'>
                                    {translations(locale)?.score_type}*
                                </Col>
                                <Col md={8}>
                                    <Dropdown
                                        fluid
                                        selection
                                        closeOnChange
                                        value={exam?.scoreType}
                                        options={scoreTypeOptions}
                                        placeholder={'-' + translations(locale)?.select + '-'}
                                        onChange={(e, data) => handleChange('scoreType', data?.value)}
                                    />
                                </Col>
                            </Row>
                            {
                                !exam?.template &&
                                <Row className='form-group'>
                                    <Col md={4} className='col-form-label text-right label-pinnacle-bold'>
                                        {translations(locale)?.score}*
                                    </Col>
                                    <Col md={8}>
                                        <input
                                            type='number'
                                            className='form-control'
                                            value={exam?.score || ''}
                                            placeholder={translations(locale)?.score}
                                            onChange={(e) => handleScoreChange(e.target.value || 0)}
                                        />
                                    </Col>
                                </Row>
                            }
                            <Row className='form-group'>
                                <Col md={4} className='col-form-label text-right label-pinnacle-bold'>
                                    {translations(locale)?.exam?.name}*
                                </Col>
                                <Col md={8}>
                                    <input
                                        type='text'
                                        className='form-control'
                                        value={exam?.title || ''}
                                        placeholder={translations(locale)?.exam?.name}
                                        onChange={(e) => handleChange('title', e.target.value)}
                                    />
                                </Col>
                            </Row>
                            <Row className='form-group'>
                                <Col md={4} className='col-form-label text-right label-pinnacle-bold'>
                                </Col>
                                <Col md={8}>
                                    <Checkbox
                                        checked={exam?.isCalculateRank}
                                        label={translations(locale)?.school_settings?.is_ranked}
                                        onChange={(e, data) => handleChange('isCalculateRank', data?.checked)}
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
                                        value={exam?.purpose}
                                        placeholder={translations(locale)?.purpose}
                                        onChange={(e) => handleChange('purpose', e.target.value)}
                                    />
                                </Col>
                            </Row>
                        </Col>
                        <Col md={4} />
                    </Row>
                </div>
                <div className="m-portlet__foot d-flex justify-content-center">
                    <button className='btn btn-link' onClick={() => navigate(-1)}>
                        {translations(locale)?.back}
                    </button>
                    <button onClick={handleSubmit} className="btn m-btn--pill btn-publish text-uppercase">
                        {translations(locale)?.exam?.insert_score}
                    </button>
                </div>
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

export default add