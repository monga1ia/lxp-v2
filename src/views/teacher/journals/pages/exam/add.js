import { useState, useRef } from 'react'
import message from 'modules/message'
import React, { useEffect } from 'react'
import { Col, Row } from 'react-bootstrap'
import { Checkbox } from 'semantic-ui-react'
import secureLocalStorage from 'react-secure-storage'
// import { fetchRequest } from 'utils/fetchRequest'
import { translations } from 'utils/translations'
// import { teacherJournalExamSubmit } from 'Utilities/url'
import { NDropdown as Dropdown } from 'widgets/Dropdown'
import DayPickerInput from 'react-day-picker/DayPickerInput'
import { Modal } from 'react-bootstrap'
import Forms from 'modules/Form/Forms'
import { useTranslation } from 'react-i18next'

const AddExam = ({onClose, data, show}) => {

    const { t } = useTranslation();

    const formRef = useRef();

    const decimalRegex = /^\d+(\.\d{1,2})?$/

    const locale = secureLocalStorage?.getItem('selectedLang') || 'mn'
    const [loading, setLoading] = useState(false)

    const [exam, setExam] = useState({})
    const [group, setGroup] = useState({})
    const [templateOptions, setTemplateOptions] = useState([])
    const [scoreTypeOptions, setScoreTypeOptions] = useState([])

    const createExamFields = [
        {
            key: 'examDate',
            type: 'dayPicker',
            label: `${t('exam.date')}`,
            labelBold: true,
            value: '',
            className: "form-control",
            placeholder: translations(locale)?.datePickerPlaceholder,
            formContainerClassName: 'form-group m-form__group row',
            labelClassName: "col-4 text-right label-pinnacle-bold mr-0",
            fieldContainerClassName: 'col-5',
            inputProps: { className: 'form-control' },
            classNames: { overlay: 'DayPickerInputOverlay', container: 'position-relative' }
        },
        {
            key: 'examTemplateTitle',
            type: 'nDropdown',
            label: `${t('exam_template.title')}`,
            labelBold: true,
            value: exam?.template || '',
            options: templateOptions,
            className: "form-control",
            placeholder: '-' + t('select') + '-',
            formContainerClassName: 'form-group m-form__group row',
            labelClassName: "col-4 text-right label-pinnacle-bold mr-0",
            fieldContainerClassName: 'col-5'
        },
        {
            key: 'examScoreType',
            type: 'nDropdown',
            label: `${t('score_type')}`,
            labelBold: true,
            value: exam?.scoreType || '',
            options: scoreTypeOptions,
            className: "form-control",
            placeholder: '-' + t('select') + '-',
            formContainerClassName: 'form-group m-form__group row',
            labelClassName: "col-4 text-right label-pinnacle-bold mr-0",
            fieldContainerClassName: 'col-5'
        },
        {
            // if (!exam?.template)
            key: 'examScoreType',
            type: 'number',
            label: `${t('score')}`,
            labelBold: true,
            value: exam?.score || '',
            className: "form-control",
            // placeholder: t('score'),
            formContainerClassName: 'form-group m-form__group row',
            labelClassName: "col-4 text-right label-pinnacle-bold mr-0",
            fieldContainerClassName: 'col-5'
        },
        {
            key: 'examName',
            type: 'text',
            label: `${t('exam.name')}`,
            labelBold: true,
            value: exam?.title || '',
            className: "form-control",
            placeholder: t('exam.name'),
            formContainerClassName: 'form-group m-form__group row',
            labelClassName: "col-4 text-right label-pinnacle-bold mr-0",
            fieldContainerClassName: 'col-5'
        },
        {
            key: 'examCalculateRank',
            type: 'checkbox',
            label: `${t('school_settings.is_ranked')}`,
            labelBold: true,
            value: exam?.isCalculateRank || false,
            className: "form-control",
            placeholder: '-' + t('select') + '-',
            formContainerClassName: 'form-group m-form__group row',
            labelClassName: "col-4 text-right label-pinnacle-bold mr-0",
            fieldContainerClassName: 'col-5'
        },
        {
            key: 'examPurpose',
            type: 'textArea',
            label: `${t('purpose')}`,
            labelBold: true,
            value: exam?.purpose || '',
            className: "form-control",
            placeholder: t('purpose'),
            formContainerClassName: 'form-group m-form__group row',
            labelClassName: "col-4 text-right label-pinnacle-bold mr-0",
            fieldContainerClassName: 'col-5'
        },
    ]

    // useEffect(() => {
    //     if (!location?.state?.id || !location?.state?.season || !location?.state?.type) {
    //         message(translations(locale)?.exam?.notFound)
    //         navigate(-1, { replace: true })
    //     }
    // }, [])

    // useEffect(() => {
    //     setLoading(true)
    //     fetchRequest(teacherJournalExamSubmit, 'POST', { group: location?.state?.id, season: location?.state?.season, type: location?.state?.type })
    //         .then((res) => {
    //             if (res.success) {
    //                 const { templates, scoreTypes, group } = res.data
    //                 setGroup(group || {})
    //                 setTemplateOptions(templates || [])
    //                 setScoreTypeOptions(scoreTypes || [])
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

    const handleSubmit = () => {
        console.log('handleSubmit')
        const [formsValid, formValues] = formRef.current.validate();
        console.log(formValues)
        // if (validateFields()) {
        //     setLoading(true)
        //     fetchRequest(teacherJournalExamSubmit, 'POST', {
        //         submit: 1,
        //         day: exam?.date,
        //         examName: exam?.title,
        //         examScore: exam?.score,
        //         template: exam?.template,
        //         group: location?.state?.id,
        //         scoreType: exam?.scoreType,
        //         description: exam?.purpose,
        //         type: location?.state?.type,
        //         season: location?.state?.season,
        //         isCalculateRank: exam?.isCalculateRank ? 1 : 0,
        //         scoreTypeName: scoreTypeOptions?.find(el => el?.value == exam?.scoreType)?.text,
        //     })
        //         .then((res) => {
        //             if (res.success) {
        //                 message(res.data.message, res.success)
        //                 navigate('/teacher/journals/exams/edit', { state: { id: res.data.examId } })
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
                    {`${group?.subjectName}, ${group?.groupName}, ${group?.classes}`}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className='m-portlet__body'>
                    <Row className='mt-4'>
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
                            <div className="form-group m-form__group row mb-0">
                                <Forms
                                    ref={formRef}
                                    fields={createExamFields}
                                />
                            </div>
                        </Col>
                    </Row>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <button 
                    className='btn m-btn--pill btn-link m-btn m-btn--custom'
                    onClick={onClose}
                >
                    {translations(locale)?.back}
                    {/* {translations(locale)?.back_to_list} */}
                </button>
                <button 
                    onClick={handleSubmit} 
                    className="btn m-btn--pill btn-publish text-uppercase"
                >
                    {translations(locale)?.exam?.insert_score}
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

export default AddExam