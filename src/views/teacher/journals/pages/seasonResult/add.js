import {useState} from 'react'
import message from 'modules/message'
import React, {useEffect} from 'react'
import {Col, Row} from 'react-bootstrap'
import {Checkbox} from 'semantic-ui-react'
import secureLocalStorage from 'react-secure-storage'
import {fetchRequest} from 'utils/fetchRequest'
import {translations} from 'utils/translations'
import {NDropdown as Dropdown} from 'widgets/Dropdown'
// import {teacherJournalSeasonResultSubmit} from 'Utilities/url'
import { Modal } from 'react-bootstrap'

const locale = secureLocalStorage?.getItem('selectedLang') || 'mn'

const CreateSeasonResult = ({onClose, data, show}) => {

    const [loading, setLoading] = useState(false)

    const [title, setTitle] = useState('')
    const [group, setGroup] = useState({})
    const [result, setResult] = useState({})
    const [templateOptions, setTemplateOptions] = useState([])
    const [scoreTypeOptions, setScoreTypeOptions] = useState([])

    const [hasTestimonial, setHasTestimonial] = useState(false)

    // useEffect(() => {
    //     if (!location?.state?.group || !location?.state?.season) {
    //         message(translations(locale)?.exam?.notFound)
    //         navigate(-1, {replace: true})
    //     }
    // }, [])

    // useEffect(() => {
    //     setLoading(true)
    //     fetchRequest(teacherJournalSeasonResultSubmit, 'POST', {
    //         group: location?.state?.group,
    //         season: location?.state?.season
    //     })
    //         .then((res) => {
    //             if (res.success) {
    //                 const {templates, scoreTypes, group} = res.data
    //                 setGroup(group || {})
    //                 setScoreTypeOptions(scoreTypes || [])
    //                 setTemplateOptions(templates?.map(el => ({value: el?.id, text: el?.name})) || [])
    //                 setTitle(`${group?.subjectName}, ${group?.name}, ${group?.classes?.map(el => el?.name)?.join(', ')}` || '')
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
        // if (validateFields()) {
        //     setLoading(true)
        //     fetchRequest(teacherJournalSeasonResultSubmit, 'POST', {
        //         submit: 1,
        //         scoreType: result?.scoreType,
        //         stTemplate: result?.template,
        //         group: location?.state?.group,
        //         season: location?.state?.season,
        //         rank: result?.isCalculateRank ? 1 : 0,
        //         testimonial: hasTestimonial ? 1 : 0
        //     })
        //         .then((res) => {
        //             if (res.success) {
        //                 message(res.data.message, res.success)
        //                 navigate('/teacher/journals/season-result/edit', {
        //                     state: {
        //                         exam: res.data.exam,
        //                         group: location?.state?.group,
        //                         title
        //                     }
        //                 })
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
        if (!result?.scoreType)
            return message(translations(locale)?.err?.fill_all_fields)
        return true
    }

    const handleChange = (name, value) => setResult({...result, [name]: value})

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
                <div className='m-portlet__body'>
                    <Row className='mt-4'>
                        <Col md={2}/>
                        <Col>
                            <Row className='form-group'>
                                <Col md={4} className='text-right label-pinnacle-bold'>
                                    {translations(locale)?.class_name}
                                </Col>
                                <Col md={8} className='d-flex flex-column'>
                                    <span>{group?.subjectName}</span>
                                    <span className='bolder'>{group?.name}</span>
                                    <span
                                        style={{textDecoration: 'underline'}}>{group?.classes?.map(el => el?.name)?.join(', ')}</span>
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
                                        options={scoreTypeOptions}
                                        value={result?.scoreType}
                                        placeholder={'-' + translations(locale)?.select + '-'}
                                        onChange={(e, data) => handleChange('scoreType', data?.value)}
                                    />
                                </Col>
                            </Row>
                            {
                                scoreTypeOptions.find(obj => {
                                    return obj?.value === result?.scoreType
                                })?.code !== 'PRIMARY' &&
                                <Row className='form-group'>
                                    <Col md={4} className='col-form-label text-right label-pinnacle-bold'>
                                        {translations(locale)?.season_score?.score_template}
                                    </Col>
                                    <Col md={8}>
                                        <Dropdown
                                            fluid
                                            selection
                                            clearable
                                            closeOnChange
                                            options={templateOptions}
                                            value={result?.template}
                                            placeholder={'-' + translations(locale)?.select + '-'}
                                            onChange={(e, data) => handleChange('template', data?.value)}
                                        />
                                    </Col>
                                </Row>
                            }

                            {
                                scoreTypeOptions.find(obj => {
                                    return obj?.value === result?.scoreType
                                })?.code === 'PRIMARY' && <Row className='form-group'>
                                    <Col md={4} className='col-form-label text-right label-pinnacle-bold'>
                                    </Col>
                                    <Col md={8}>
                                        <Checkbox
                                            checked={hasTestimonial}
                                            label={translations(locale)?.studentTranscript?.title}
                                            onChange={(e, data) => setHasTestimonial(data?.checked)}
                                        />
                                    </Col>
                                </Row>
                            }

                            <Row className='form-group'>
                                <Col md={4} className='col-form-label text-right label-pinnacle-bold'/>
                                <Col md={8}>
                                    <Checkbox
                                        checked={result?.isCalculateRank}
                                        label={translations(locale)?.school_settings?.is_ranked}
                                        onChange={(e, data) => handleChange('isCalculateRank', data?.checked)}
                                    />
                                </Col>
                            </Row>
                        </Col>
                        <Col md={4}/>
                    </Row>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <button 
                    className='btn btn-link'
                    onClick={onClose}
                >
                    {translations(locale)?.back}
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
                    <div className='blockUI blockOverlay'/>
                    <div className='blockUI blockMsg blockPage'>
                        <div className='m-loader m-loader--brand m-loader--lg'/>
                    </div>
                </>
            }
        </Modal>
    )
}

export default CreateSeasonResult