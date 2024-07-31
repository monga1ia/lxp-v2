import message from 'modules/message'
import React, { useEffect, useState } from 'react'
import DTable from 'modules/DataTable/DTable'
import secureLocalStorage from 'react-secure-storage'
import { translations } from 'utils/translations'
import { Row, Col } from 'react-bootstrap'
import HomeworkProgressBar from './HomeworkBar'

const locale = secureLocalStorage?.getItem('selectedLang') || 'mn'

const Description = ({groupInfo}) => {
    return (
        <Row>
            <Col xs={3} style={{marginLeft: 80, fontSize: 14}}>
                <div className='mb-1'>
                    <span className='text-uppercase' style={{fontWeight: 'bold', color: '#868aa8'}}>{translations(locale)?.class_name}</span>
                </div>
                <div>
                    <span>{groupInfo?.subjectName || ''}</span>
                </div>
                <div>
                    <span style={{fontWeight: 'bold'}}>{groupInfo?.groupName || ''}</span>
                </div>
                <div>
                    <span style={{textDecoration: 'underline'}}>{groupInfo?.classes || ''}</span>
                </div>
            </Col>
            <Col xs={3}>
                <div className='mb-1'>
                    <span className='text-uppercase' style={{fontWeight: 'bold', color: '#868aa8'}}>{translations(locale)?.time}</span>
                </div>
                <div>
                    <span>{groupInfo?.seasonName || ''}</span>
                </div>
                <div>
                    <span>{groupInfo?.seasonStartDate || ''}</span>
                </div>
                <div>
                    <span>{groupInfo?.seasonEndDate || ''}</span>
                </div>
            </Col>
            <Col className='mr-5'>
                <div className='mb-1'>
                    <span style={{fontWeight: 'bold', color: '#868aa8'}}>{translations(locale)?.homework?.totalHomework}: {groupInfo?.homeworkTotal || 0}</span>
                </div>
                <div style={{ width: '70%' }}>
                    <HomeworkProgressBar totalHW={groupInfo?.homeworkTotal || 0} checkedHW={groupInfo?.isSavedCount || 0}/>
                    <div className="mt-2 d-flex justify-content-between">
                        <span>{translations(locale)?.checked}: {groupInfo?.isSavedCount || 0}</span>
                        <span>{translations(locale)?.homeworkReport?.notChecked}: {groupInfo?.isNotSavedCount || 0}</span>
                    </div>
                </div>
            </Col>
        </Row>
    )
}
export default Description