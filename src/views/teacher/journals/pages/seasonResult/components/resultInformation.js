import React from 'react'
import { Link } from 'react-router-dom'
import { Col, Row } from 'react-bootstrap'
import { Checkbox } from 'semantic-ui-react'
import secureLocalStorage from 'react-secure-storage'
import { translations } from 'utils/translations'

const locale = secureLocalStorage?.getItem('selectedLang') || 'mn'

const resultInformation = ({ exam }) => {
    return (
        <>
            <div className='m-portlet__body'>
                <Row className='mt-4'>
                    <Col md={2} />
                    <Col>
                        <Row className='form-group'>
                            <Col md={4} className='text-right label-pinnacle-bold'>
                                {translations(locale)?.class_name}
                            </Col>
                            <Col md={8} className='d-flex flex-column'>
                                <span>{exam?.subjectName}</span>
                                <span className='bolder'>{exam?.groupName}</span>
                                <span style={{ textDecoration: 'underline' }}>{exam?.classes}</span>
                            </Col>
                        </Row>
                        <Row className='form-group'>
                            <Col md={4} className='col-form-label text-right label-pinnacle-bold'>
                                {translations(locale)?.score_type}*
                            </Col>
                            <Col md={8}>
                                <input
                                    disabled
                                    value={exam?.scoreTypeName}
                                    className='form-control'
                                />
                            </Col>
                        </Row>
                        <Row className='form-group'>
                            <Col md={4} className='col-form-label text-right label-pinnacle-bold'>
                                {translations(locale)?.season_score?.score_template}
                            </Col>
                            <Col md={8}>
                                <input
                                    disabled
                                    value={exam?.stTemplateName}
                                    className='form-control'
                                />
                            </Col>
                        </Row>
                        <Row className='form-group'>
                            <Col md={4} className='col-form-label text-right label-pinnacle-bold' />
                            <Col md={8}>
                                <Checkbox
                                    disabled
                                    checked={exam?.isRank}
                                    label={translations(locale)?.school_settings?.is_ranked}
                                />
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4} />
                </Row>
            </div>
            <div className="m-portlet__foot d-flex justify-content-center gap-05">
                <Link
                    className='btn btn-link'
                    to='/teacher/journals'
                >
                    {translations(locale)?.back}
                </Link>
            </div>
        </>
    )
}

export default resultInformation