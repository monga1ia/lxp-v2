import React from 'react'
import { Col, Row } from 'react-bootstrap'
import secureLocalStorage from 'react-secure-storage'
import { translations } from 'utils/translations'

const locale = secureLocalStorage?.getItem('selectedLang') || 'mn'

const generalInformation = ({ group }) => {
    return (
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
                            <span className='bolder'>{group?.groupName}</span>
                            <span style={{ textDecoration: 'underline' }}>{group?.className}</span>
                        </Col>
                    </Row>
                    <Row className='form-group'>
                        <Col md={4} className='col-form-label text-right label-pinnacle-bold'>
                            {translations(locale)?.template}
                        </Col>
                        <Col md={8}>
                            <input
                                disabled
                                type='text'
                                className='form-control'
                                value={group?.template}
                            />
                        </Col>
                    </Row>
                </Col>
                <Col md={4} />
            </Row>
        </div>
    )
}

export default generalInformation