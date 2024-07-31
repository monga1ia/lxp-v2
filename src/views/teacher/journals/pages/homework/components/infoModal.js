import message from 'modules/message'
import { Modal } from 'semantic-ui-react'
import { Col, Row } from 'react-bootstrap'
import React, { useEffect, useState } from 'react'
import CloseIcon from '@mui/icons-material/Close'
import { translations } from 'utils/translations'
import { fetchRequest } from 'utils/fetchRequest'
import { NDropdown as Dropdown } from 'widgets/Dropdown'
// import { teacherOnlineLessonSubmit } from 'Utilities/url'
import { htmlDecode } from 'utils/Util'

const InfoModal = ({ onClose, onSave, title, locale, data }) => {
    const assignedDate = data?.assignDate
    const dueDate = data?.dueDate
    const createDate = data?.createdDate
    const homeworkName = data?.description
    const score = data?.totalScore
    const link = data?.link
    const files = data?.files

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
                <button type="button" className="close" onClick={onClose}>
                    <CloseIcon />
                </button>
            </div>
            <div className ='mt-5 mb-5' style={{color: '#44464e', padding: '0 30px'}}>
                <Row className='mb-2'>
                    <Col className='text-right modal-list-font-td' style={{fontWeight: 'bold'}}>
                        {translations(locale)?.homework?.assign_date}
                    </Col>
                    <Col className='text-left' style={{fontSize: '14px', fontWeight: 'bold'}}>
                        {assignedDate}
                    </Col>
                </Row>
                <Row className='mb-2'>
                    <Col className='text-right modal-list-font-td' style={{fontWeight: 'bold'}}>
                        {translations(locale)?.homework?.homework_due_date}
                    </Col>
                    <Col className='text-left' style={{fontSize: '14px', fontWeight: 'bold'}}>
                        {dueDate}
                    </Col>
                </Row>
                <Row className='mb-2'>
                    <Col className='text-right modal-list-font-td' style={{fontWeight: 'bold'}}>
                        {translations(locale)?.created_date}
                    </Col>
                    <Col className='text-left' style={{fontSize: '14px', fontWeight: 'bold'}}>
                        {createDate}
                    </Col>
                </Row>
                <Row className='mb-2'>
                    <Col className='text-right modal-list-font-td' style={{fontWeight: 'bold'}}>
                        {translations(locale)?.homework?.title}
                    </Col>
                    <Col className='text-left' style={{fontSize: '14px', fontWeight: 'bold'}}>
                        {
                            homeworkName && 
                            <div
                                dangerouslySetInnerHTML={{__html: htmlDecode(homeworkName)}}
                                onClick={(e) => {
                                    const el = e.target.closest("A");

                                    if (el && e.currentTarget.contains(el)) {
                                        window.open('' + el, '_blank');
                                        e.preventDefault();
                                    }
                                }}
                            />
                        }
                    </Col>
                </Row>
                <Row className='mb-2'>
                    <Col className='text-right modal-list-font-td' style={{fontWeight: 'bold'}}>
                        {translations(locale)?.homework?.score}
                    </Col>
                    <Col className='text-left' style={{fontSize: '14px', fontWeight: 'bold'}}>
                        {score}
                    </Col>
                </Row>
                {
                    link &&
                    <Row className='mb-2'>
                        <Col className='text-right modal-list-font-td' style={{fontWeight: 'bold'}}>
                            {translations(locale)?.link?.link}
                        </Col>
                        <Col className='text-left' style={{fontSize: '14px', fontWeight: 'bold'}}>
                            <a style={{color: '#44464e'}} href={link} target={"_blank"}>{link}</a>
                        </Col>
                    </Row>
                }
                <Row className='mb-2'>
                    <Col className='text-right modal-list-font-td' style={{fontWeight: 'bold'}}>
                        {translations(locale)?.homework?.file}
                    </Col>
                    <Col className='text-left mt-1' style={{fontSize: '14px', fontWeight: '100'}}>
                        {
                            files && files.length > 0 && 
                            <div>
                                {files.map(function (file, i) {
                                    return (
                                        <div key={'byDayFiles_' + i} className='mb-2' style={{backgroundColor: '#ddd', borderRadius: '5px', padding: '10px', display: 'block'}}>
                                            <a style={{color: '#44464e'}} href={file.path} target={"_blank"}>{file.name}</a>
                                        </div>
                                    )
                                })}
                            </div>
                        }
                    </Col>
                </Row>
            </div>
            <div className="actions modal-footer justify-content-center">
                <div className="text-center">
                    <button
                        onClick={onClose}
                        className="btn m-btn--pill btn-outline-metal text-uppercase"
                    >
                        {translations(locale)?.close}
                    </button>
                    <button
                        onClick={onSave}
                        className="btn m-btn--pill btn-primary ml-4 text-uppercase"
                    >
                        {translations(locale)?.homework?.homework_check}
                    </button>
                </div>
            </div>
        </Modal >
    )
}

export default InfoModal