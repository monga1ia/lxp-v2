import { useState } from 'react'
import message from 'modules/message'
import React, { useEffect } from 'react'
import { Col, Row } from 'react-bootstrap'
import secureLocalStorage from 'react-secure-storage'
// import { fetchRequest } from 'utils/fetchRequest'
import { translations } from 'utils/translations'
import { NDropdown as Dropdown } from 'widgets/Dropdown'
// import { teacherJournalSkillCreate } from 'Utilities/url'
import { Modal } from 'react-bootstrap'

const locale = secureLocalStorage?.getItem('selectedLang') || 'mn'

const AddSkill = ({onClose, data, show}) => {

    const [loading, setLoading] = useState(false)

    const [title, setTitle] = useState('')
    const [group, setGroup] = useState({})
    const [skill, setSkill] = useState({})
    const [templateOptions, setTemplateOptions] = useState([])

    // useEffect(() => {
    //     if (!location?.state?.group || !location?.state?.season) {
    //         message(translations(locale)?.exam?.notFound)
    //         navigate(-1, { replace: true })
    //     }
    // }, [])

    // useEffect(() => {
    //     setLoading(true)
    //     fetchRequest(teacherJournalSkillCreate, 'POST', { group: location?.state?.group, season: location?.state?.season })
    //         .then((res) => {
    //             if (res.success) {
    //                 const { templates, group } = res.data
    //                 setGroup(group || {})
    //                 setTemplateOptions(templates?.map(el => ({ value: el?.id, text: el?.name })) || [])
                    // setTitle(`${group?.subjectName}, ${group?.name}, ${group?.className}` || '')
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
        // if (!validateFields())
        //     return
        // setLoading(true)
        // fetchRequest(teacherJournalSkillCreate, 'POST', {
        //     ...skill,
        //     submit: 1,
        //     group: location?.state?.group,
        //     season: location?.state?.season,
        // })
        //     .then((res) => {
        //         if (res.success) {
        //             message(res.data.message, res.success)
        //             navigate('/teacher/journals/skill/edit', { state: { skill: res.data?.id, group: location?.state?.group, title } })
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

    const validateFields = () => {
        if (!skill?.template)
            return message(translations(locale)?.err?.fill_all_fields)
        return true
    }

    const handleChange = (name, value) =>
        setSkill({ ...skill, [name]: value })

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
            <Modal.Body style={{color: '#212529'}}>
                <div className='m-portlet__body'>
                    <Row className='mt-4'>
                        <Col md={2} />
                        <Col>
                            <Row className='form-group'>
                                <Col md={4} className='text-right label-pinnacle-bold'>
                                    {translations(locale)?.class_name}
                                </Col>
                                <Col md={8} className='d-flex flex-column'>
                                    <span>{group?.subjectName}</span>
                                    <span className='bolder'>{group?.name}</span>
                                    <span style={{ textDecoration: 'underline' }}>{group?.classes?.map(el => el?.name)?.join(', ')}</span>
                                </Col>
                            </Row>
                            <Row className='form-group'>
                                <Col md={4} className='col-form-label text-right label-pinnacle-bold'>
                                    {translations(locale)?.skill?.selectTemplate}*
                                </Col>
                                <Col md={8}>
                                    <Dropdown
                                        fluid
                                        search
                                        selection
                                        closeOnChange
                                        value={skill?.template}
                                        options={templateOptions}
                                        placeholder={'-' + translations(locale)?.select + '-'}
                                        onChange={(e, data) => handleChange('template', data?.value)}
                                    />
                                </Col>
                            </Row>
                        </Col>
                        <Col md={4} />
                    </Row>
                </div>
                <Modal.Footer className='text-center'>
                    <button
                        onClick={onClose}
                        className="btn m-btn--pill btn-link m-btn m-btn--custom"
                    >
                        {translations(locale)?.back}
                    </button>
                    <button 
                        onClick={handleSubmit} 
                        className="btn m-btn--pill btn-publish text-uppercase"
                    >
                        {translations(locale)?.skill?.addAssessment}
                    </button>
                </Modal.Footer>
            </Modal.Body>
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

export default AddSkill