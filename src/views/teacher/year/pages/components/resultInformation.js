import React from 'react'
// import { Link } from 'react-router-dom'
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
                                <span>{exam?.group?.subjectName}</span>
                                <span className='bolder'>{exam?.group?.groupName}</span>
                                <span style={{ textDecoration: 'underline' }}>{exam?.group?.classes}</span>
                            </Col>
                        </Row>
                        <Row className='form-group'>
                            <Col md={4} className='col-form-label text-right label-pinnacle-bold'>
                                {translations(locale)?.score_type}*
                            </Col>
                            <Col md={8}>
                                <input
                                    disabled
                                    value={exam?.scoreType}
                                    className='form-control'
                                />
                            </Col>
                        </Row>
                        <Row className='form-group'>
                            <Col md={4} className='col-form-label text-right label-pinnacle-bold'>
                                {translations(locale)?.season_score?.method}
                            </Col>
                            <Col md={8}>
                                <input
                                    disabled
                                    value={exam?.calc}
                                    className='form-control'
                                />
                            </Col>
                        </Row>
                        {
                            exam?.weights && exam?.weights.length > 0 &&
                            <Row className='form-group'>
                                <Col md={4} className='col-form-label text-right label-pinnacle-bold'>
                                </Col>
                                <Col md={8}>
                                    {
                                        exam.weights.map((weightObj, i) => {
                                            return <Row key={'season_' + i} className='form-group'>
                                                <Col className={'col-form-label text-right'}>{weightObj?.seasonName}</Col>
                                                <Col>
                                                    <input
                                                        type='number'
                                                        disabled={true}
                                                        className='form-control'
                                                        value={weightObj?.weight}
                                                        placeholder={translations(locale)?.school_settings?.weight}
                                                        onChange={() => {}}
                                                    />
                                                </Col>
                                                <Col></Col>
                                            </Row>
                                        })
                                    }
                                </Col>
                            </Row>
                        }
                        <Row className='form-group'>
                            <Col md={4} className='col-form-label text-right label-pinnacle-bold'/>
                            <Col md={8}>
                                <Checkbox
                                    disabled={true}
                                    checked={exam?.rank}
                                    label={translations(locale)?.school_settings?.is_ranked}
                                    onChange={() => {}}
                                />
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4} />
                </Row>
            </div>
            <div className="m-portlet__foot d-flex justify-content-center gap-05">
                {/* <Link
                    className='btn btn-link'
                    to='/teacher/year'
                >
                    {translations(locale)?.back_to_list}
                </Link> */}
            </div>
        </>
    )
}

export default resultInformation