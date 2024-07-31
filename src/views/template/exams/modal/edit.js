import message from 'modules/message'
import { Col, Row, Modal } from 'react-bootstrap'
import { Checkbox } from 'semantic-ui-react'
import React, { useEffect, useState } from 'react'
import secureLocalStorage from 'react-secure-storage'
import { fetchRequest } from 'utils/fetchRequest'
import { translations } from 'utils/translations'
import { NDropdown as Dropdown } from 'widgets/Dropdown'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import { useTranslation } from 'react-i18next';
import { Link, useLocation, useNavigate } from 'react-router-dom'
// import { getSubjectsByGrade, templateExamEdit } from 'utils/fetchRequest/Urls'
import ArrowUpwardRoundedIcon from '@mui/icons-material/ArrowUpwardRounded'
import ArrowDownwardRoundedIcon from '@mui/icons-material/ArrowDownwardRounded'

const EditTemplate = ({onClose}) => {
    // const navigate = useNavigate()
    // const location = useLocation()

    const locale = secureLocalStorage?.getItem('selectedLang') || 'mn'
    const { t } = useTranslation()
    const [loading, setLoading] = useState(false)

    const [template, setTemplate] = useState({})
    const [details, setDetails] = useState([])

    const [gradeOptions, setGradeOptions] = useState([])
    const [typeOptions, setTypeOptions] = useState([])
    const [subjectOptions, setSubjectOptions] = useState([])

    // useEffect(() => {
    //     if (!location?.state?.id) {
    //         message(translations(locale)?.exam_template?.select)
    //         navigate('/template/exams', { replace: true })
    //     }
    // }, [])

    // useEffect(() => {
    //     setLoading(true)
    //     fetchRequest(templateExamEdit, 'POST', { template: location?.state?.id })
    //         .then((res) => {
    //             if (res.success) {
    //                 const { examTypes, grades, templateData, message: msg } = res.data
    //                 setGradeOptions(grades || [])
    //                 setTypeOptions(examTypes || [])
    //                 setDetails(templateData?.details?.length ? templateData?.details : [{ name: '', score: 0, }])
    //                 handleGradeChange(templateData?.gradeId)
    //                 setTemplate({
    //                     name: templateData?.name,
    //                     type: templateData?.examTypeId,
    //                     subject: templateData?.subjectId,
    //                     grade: templateData?.gradeId,
    //                     isOnlyMe: templateData?.isPublic,
    //                     isDisabled: templateData?.examCount > 0 ? true : false,
    //                 } || {})
    //                 if (templateData?.examCount > 0) message(msg)
    //             } else {
    //                 message(res.data.message)
    //             }
    //             setLoading(false)
    //         })
    //         .catch(() => {
    //             message(translations(locale)?.err?.error_occurred)
    //             setLoading(false)
    //         })
    // }, [])

    useEffect(() => {
        let totalScore = 0
        details?.forEach(el => totalScore += (parseFloat(el?.score)) || 0)
        setTemplate({ ...template, totalScore })
    }, [details])

    const handleGradeChange = grade => {
        console.log('handleGradeChange')
        // setLoading(true)
        // setTemplate({ ...template, grade, subject: null })
        // fetchRequest(getSubjectsByGrade, 'POST', { grade })
        //     .then((res) => {
        //         if (res.success) {
        //             const { subjects } = res.data
        //             setSubjectOptions(subjects || [])
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

    const handleSubmit = publish => {
        console.log('handleSubmit')
        // if (validateFields()) {
        //     setLoading(true)
        //     const subject = subjectOptions?.find(el => el?.value == template?.subject)
        //     const grade = gradeOptions?.find(el => el?.value == template?.grade)
        //     fetchRequest(templateExamEdit, 'POST', {
        //         ...template,
        //         subjectCode: subject?.code,
        //         subjectName: subject?.text,
        //         gradeName: grade?.text,
        //         me: template?.isOnlyMe ? 1 : 0,
        //         details: JSON.stringify(details),
        //         submit: 1,
        //         publish,
        //         template: location?.state?.id,
        //     })
        //         .then((res) => {
        //             if (res.success) {
        //                 message(res.data.message, res.success)
        //                 navigate('/template/exams')
        //             } else {
        //                 message(res.data.message)
        //             }
        //             setLoading(false)
        //         })
        //         .catch(() => {
        //             message(translations(locale)?.err?.error_occurred)
        //             setLoading(false)
        //         })
        // }
    }

    const handleChange = (name, value) => {
        setTemplate({ ...template, [name]: value })
    }

    const validateFields = () => {
        if (!template?.name || !template?.grade || !template?.subject || !template?.type)
            return message(translations(locale).err.fill_all_fields)
        else if (!details.every(el => { return el.name && el.score }))
            return message(translations(locale).err.fill_all_fields)
        else
            return true
    }

    const addDetails = () => {
        setDetails([...details, {
            name: '',
            score: 0,
        }])
    }

    const removeDetails = index => {
        if (details?.length > 1) {
            const clone = [...details]
            clone.splice(index, 1)
            setDetails(clone)
        }
    }

    const swap = (from, to) => {
        const clone = [...details]
        const temp = clone[to]
        clone[to] = clone[from]
        clone[from] = temp
        setDetails(clone)
    }

    const moveDown = index => {
        if (index !== details?.length - 1) swap(index, index + 1)
    }

    const moveUp = index => {
        if (index !== 0) swap(index, index - 1)
    }

    const handleDetailsChange = (index, name, value) => {
        const clone = [...details]
        clone[index][name] = value
        setDetails(clone)
    }

    return (
        <Modal
            dimmer='blurring'
            show={true}
            size="xl"
            aria-labelledby="contained-modal-title-vcenter"
            onHide={onClose}
            centered
        >
            <Modal.Header closeButton style={{padding: '1rem'}}>
                <Modal.Title className="modal-title d-flex flex-row justify-content-between w-100">
                    {t('exam_template.edit')}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Row className='mt-4'>
                    <Col md={2} />
                    <Col>
                        <Row className='form-group'>
                            <Col md={4} className='col-form-label text-right label-pinnacle-bold'>
                                {translations(locale)?.exam_template?.name}*
                            </Col>
                            <Col md={8}>
                                <input
                                    type='text'
                                    className='form-control'
                                    value={template?.name || ''}
                                    placeholder={translations(locale)?.exam_template?.name}
                                    onChange={(e) => handleChange('name', e.target.value)}
                                />
                            </Col>
                        </Row>
                        <Row className='form-group'>
                            <Col md={4} className='col-form-label text-right label-pinnacle-bold'>
                                {translations(locale)?.grade}*
                            </Col>
                            <Col md={8}>
                                <Dropdown
                                    fluid
                                    selection
                                    closeOnChange
                                    options={gradeOptions}
                                    value={template?.grade}
                                    disabled={template?.isDisabled}
                                    placeholder={'-' + translations(locale)?.select + '-'}
                                    onChange={(e, data) => !template?.isDisabled && handleGradeChange(data?.value)}
                                />
                            </Col>
                        </Row>
                        <Row className='form-group'>
                            <Col md={4} className='col-form-label text-right label-pinnacle-bold'>
                                {translations(locale)?.course_lesson}*
                            </Col>
                            <Col md={8}>
                                <Dropdown
                                    fluid
                                    selection
                                    closeOnChange
                                    options={subjectOptions}
                                    value={template?.subject}
                                    disabled={template?.isDisabled}
                                    placeholder={'-' + translations(locale)?.select + '-'}
                                    onChange={(e, data) => !template?.isDisabled && handleChange('subject', data?.value)}
                                />
                            </Col>
                        </Row>
                        <Row className='form-group'>
                            <Col md={4} className='col-form-label text-right label-pinnacle-bold'>
                                {translations(locale)?.exam_template?.exam_type}*
                            </Col>
                            <Col md={8}>
                                <Dropdown
                                    fluid
                                    selection
                                    closeOnChange
                                    options={typeOptions}
                                    value={template?.type}
                                    disabled={template?.isDisabled}
                                    placeholder={'-' + translations(locale)?.select + '-'}
                                    onChange={(e, data) => !template?.isDisabled && handleChange('type', data?.value)}
                                />
                            </Col>
                        </Row>
                        <Row className='form-group'>
                            <Col md={4} className='col-form-label text-right label-pinnacle-bold'>
                            </Col>
                            <Col md={8} style={{color: '#575962'}}>
                                <Checkbox
                                    checked={template?.isOnlyMe}
                                    label={translations(locale)?.exam_template?.only_me}
                                    onChange={(e, data) => handleChange('isOnlyMe', data?.checked)}
                                />
                            </Col>
                        </Row>
                        <Row className='form-group'>
                            <Col md={4} className='col-form-label text-right label-pinnacle-bold'>
                                {translations(locale)?.total_score}
                            </Col>
                            <Col md={8} className='col-form-label label-pinnacle-bold'>
                                {template.totalScore ? template.totalScore.toFixed(2) : 0}
                            </Col>
                        </Row>
                    </Col>
                    <Col md={3} />
                </Row>
                {
                    details?.map((el, index) => (
                        <div key={index}>
                            <Row className='mt-2'>
                                <Col md={2} />
                                <Col>
                                    <label className='label-pinnacle-bold'>
                                        {translations(locale)?.exam_template?.task}
                                    </label>
                                </Col>
                                <Col>
                                    <label className='label-pinnacle-bold'>
                                        {translations(locale)?.score}
                                    </label>
                                </Col>
                                <Col md={3} />
                            </Row>
                            <Row>
                                <Col md={2} />
                                <Col>
                                    <input
                                        type='text'
                                        value={el?.name || ''}
                                        disabled={template?.isDisabled}
                                        placeholder={translations(locale)?.exam_template?.task}
                                        className={`${template?.isDisabled && 'cursor-not-allowed'} form-control`}
                                        onChange={(e) => !template?.isDisabled && handleDetailsChange(index, 'name', e.target.value)}
                                    />
                                </Col>
                                <Col>
                                    <input
                                        type='number'
                                        value={el?.score || ''}
                                        disabled={template?.isDisabled}
                                        placeholder={translations(locale)?.score}
                                        onWheel={(e) => e.target.blur()}
                                        onKeyPress={(e) => !/[0-9.]/.test(e.key) && e.preventDefault()}
                                        className={`${template?.isDisabled && 'cursor-not-allowed'} form-control`}
                                        onChange={(e) => !template?.isDisabled && handleDetailsChange(index, 'score', e.target.value)}
                                    />
                                </Col>
                                <Col md={2} className='d-flex align-items-center'>
                                    {
                                        !template?.isDisabled &&
                                        <>
                                            <button
                                                onClick={() => !template?.isDisabled && removeDetails(index)}
                                                className={`${details?.length > 1 ? 'visible' : 'invisible'} btn btn-danger m-btn--icon btn-sm m-btn--icon-only m-btn--pill d-inline-flex justify-content-center align-items-center`}
                                            >
                                                <CloseRoundedIcon />
                                            </button>
                                            <div className='d-flex gap-03 pl-4'>
                                                <button
                                                    style={{ border: '1px solid #ebedf2' }}
                                                    onClick={() => !template?.isDisabled && moveUp(index)}
                                                    className={`${index != 0 ? 'visible' : 'invisible'} btn m-btn--icon btn-sm m-btn--icon-only br-04 bg-white d-inline-flex justify-content-center align-items-center`}
                                                >
                                                    <ArrowUpwardRoundedIcon />
                                                </button>
                                                <button
                                                    style={{ border: '1px solid #ebedf2' }}
                                                    onClick={() => !template?.isDisabled && moveDown(index)}
                                                    className={`${details?.length != index + 1 ? 'visible' : 'invisible'} btn m-btn--icon btn-sm m-btn--icon-only br-04 bg-white d-inline-flex justify-content-center align-items-center`}
                                                >
                                                    <ArrowDownwardRoundedIcon />
                                                </button>
                                            </div>
                                        </>
                                    }
                                </Col>
                                <Col md={1} />
                            </Row>
                            <Row>
                                <Col md={2} />
                                <Col className='mt-3'>
                                    {
                                        details?.length == index + 1 && !template?.isDisabled &&
                                        <button
                                            onClick={addDetails}
                                            className='btn btn-outline-secondary text-uppercase m-btn--pill'
                                        >
                                            {translations(locale)?.add}
                                        </button>
                                    }
                                </Col>
                            </Row>
                        </div>
                    ))
                }
            </Modal.Body>
            <Modal.Footer>
                <div className='m-portlet__foot d-flex justify-content-center gap-10'>
                    {/* <Link
                        to='/template/exams'
                        className='btn m-btn--pill btn-link'
                    >
                        {translations(locale)?.back}
                    </Link> */}
                    <button 
                        onClick={onClose}
                        className="btn m-btn--pill btn-link m-btn m-btn--custom"
                    >
                        {t('back')}        
                    </button>
                    <button
                        onClick={() => handleSubmit(0)}
                        className='btn m-btn--pill btn-success text-uppercase'
                    >
                        {translations(locale)?.save}
                    </button>
                    <button
                        onClick={() => handleSubmit(1)}
                        className='btn m-btn--pill btn-publish text-uppercase'
                    >
                        {translations(locale)?.action?.publish}
                    </button>
                </div>
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

export default EditTemplate