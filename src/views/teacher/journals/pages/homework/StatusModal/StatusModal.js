import message from 'modules/message'
import { Modal } from 'semantic-ui-react'
import { Col, Row } from 'react-bootstrap'
import React, { useEffect, useState } from 'react'
import CloseIcon from '@mui/icons-material/Close'
import secureLocalStorage from 'react-secure-storage'
import { translations } from 'utils/translations'
import { fetchRequest } from 'utils/fetchRequest'
import { NDropdown as Dropdown } from 'widgets/Dropdown'
// import { teacherOnlineLessonSubmit } from 'Utilities/url'
import StatusTable from './StatusTable'

const StatusModal = ({ onClose, title, locale, data }) => {

    const className = data?.className
    const studentCode = data?.studentCode
    const studentLastName = data?.studentLastName
    const studentFirstName = data?.studentFirstName
    const homeworkName = data?.homeworkName
    const score = data?.score
    const fileName = data?.fileName

    return (
        <Modal
            dimmer='blurring'
            open={true}
            onClose={onClose}
            className="react-modal overflow-modal d-flex"
            centered
        >
            <div className="header">
                {title}
            </div>
            <div className ='mt-5 mb-5'>
                <Row>
                    <Col className='text-right modal-list-font-td' style={{fontWeight: 'bold'}}>
                        {translations(locale)?.className}
                    </Col>
                    <Col className='text-left' style={{fontSize: '14px', fontWeight: 'bold'}}>
                        {className}
                    </Col>
                </Row>
                <Row >
                    <Col className='text-right modal-list-font-td' style={{fontWeight: 'bold'}}>
                        {translations(locale)?.studentCode}
                    </Col>
                    <Col className='text-left' style={{fontSize: '14px', fontWeight: 'bold'}}>
                        {studentCode}
                    </Col>
                </Row>
                <Row >
                    <Col className='text-right modal-list-font-td' style={{fontWeight: 'bold'}}>
                        {translations(locale)?.studentLastName}
                    </Col>
                    <Col className='text-left' style={{fontSize: '14px', fontWeight: 'bold'}}>
                        {studentLastName}
                    </Col>
                </Row>
                <Row >
                    <Col className='text-right modal-list-font-td' style={{fontWeight: 'bold'}}>
                        {translations(locale)?.studentFirstName}
                    </Col>
                    <Col className='text-left' style={{fontSize: '14px', fontWeight: 'bold'}}>
                        {studentFirstName}
                    </Col>
                </Row>
                <Row >
                    <Col className='text-right modal-list-font-td' style={{fontWeight: 'bold'}}>
                        {translations(locale)?.homework?.title}
                    </Col>
                    <Col className='text-left' style={{fontSize: '14px', fontWeight: 'bold'}}>
                        {homeworkName}
                    </Col>
                </Row>
                <Row >
                    <Col className='text-right modal-list-font-td' style={{fontWeight: 'bold'}}>
                        {translations(locale)?.homework?.score}
                    </Col>
                    <Col className='text-left' style={{fontSize: '14px', fontWeight: 'bold'}}>
                        {score}
                    </Col>
                </Row>
                <Row >
                    <Col className='text-right modal-list-font-td' style={{fontWeight: 'bold'}}>
                        {translations(locale)?.homework?.file}
                    </Col>
                    <Col className='text-left mt-1' style={{fontSize: '14px', fontWeight: '100'}}>
                        <div style={{backgroundColor: '#ddd', borderRadius: '5px', padding: '10px', display: 'inline-block'}}>
                            {fileName}
                        </div>
                    </Col>
                </Row>
                <StatusTable/>
            </div>
            <div className="actions modal-footer justify-content-center">
                <div className="text-center">
                    <button
                        onClick={onClose}
                        className="btn btn-outline-dark margin-right-5 text-uppercase"
                    >
                        {translations(locale)?.close}
                    </button>
                </div>
            </div>
        </Modal >
    )
}

export default StatusModal