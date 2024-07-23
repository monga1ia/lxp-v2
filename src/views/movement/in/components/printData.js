import React from 'react'
import {QRCodeSVG} from 'qrcode.react'
import {Col, Row} from 'react-bootstrap'
import secureLocalStorage from 'react-secure-storage'
import { useTranslation } from "react-i18next";

const printData = React.forwardRef((props, ref) => {
    const locale="mn"
    const { t } = useTranslation();
    const {school, student, students = []} = props

    return (
        <div ref={ref}>
            {
                students.map(student => {
                    return <div key={'student_' + student?.id} style={{breakAfter: 'page'}}
                                className='d-flex flex-column align-items-center justify-content-between p-5 w-100 text-black'>
                        <div className='d-flex flex-column align-items-center fs-18'>
                            <div style={{
                                height: 170
                            }}>
                                {
                                    school?.horizontalLogo
                                        ? <img height={165} src={school?.horizontalLogo} alt={school?.longName}/>
                                        : <h1 className='text-center'>{school?.longName}</h1>
                                }
                            </div>
                            <div style={{
                                overflow: 'hidden',
                                height: 130
                            }}
                                 className='d-flex flex-column align-items-center'
                            >
                            <span
                                className='mt-4'>{locale?.toLowerCase() == 'mn' ? school?.addressMn : school?.addressEn}</span>
                                <span>{t('invoice_form.contact')}: {school?.contact}</span>
                                <span>{t('website')}: {school?.website}</span>
                            </div>
                        </div>

                        <h1 className='bolder text-uppercase my-5 fs-25 text-center'>{t('movement.register_sheet')}</h1>

                        <div className='fs-20 w-100'>
                            <Row>
                                <Col className='text-right pb-2'>{t('group.name')}: </Col>
                                <Col className='bolder'>{student?.className || '-'}</Col>
                            </Row>
                            <Row>
                                <Col className='text-right pb-2'>{t('studentCode')}: </Col>
                                <Col className='bolder'>{student?.studentCode || '-'}</Col>
                            </Row>
                            <Row>
                                <Col className='text-right pb-2'>{t('last_name')}: </Col>
                                <Col className='bolder'>{student?.lastName || '-'}</Col>
                            </Row>
                            <Row>
                                <Col className='text-right pb-2'>{t('first_name')}: </Col>
                                <Col className='bolder'>{student?.firstName || '-'}</Col>
                            </Row>
                            <Row className='mt-5'>
                                <Col className='text-right pb-2'>{t('created_user')}: </Col>
                                <Col className='bolder'>{student?.createdUserName || '-'}</Col>
                            </Row>
                            <Row>
                                <Col className='text-right pb-2'>{t('created_date')}: </Col>
                                <Col className='bolder'>{student?.createdDate?.date?.split('.')?.[0] || '-'}</Col>
                            </Row>
                        </div>

                        <QRCodeSVG
                            value={school?.code + '_' + student?.studentCode}
                            size={400}
                            style={{
                                marginTop: 20,
                                marginBottom: 30
                            }}
                        />

                        <Row className='d-flex align-items-center justify-content-center'>
                            <div className='col-3 text-right'>
                                <QRCodeSVG
                                    value={"https://eschool.mn/app.html"}
                                    size={120}
                                />
                            </div>
                            <Col className='d-flex flex-column'>
                                <span className='fs-15'>{t('movement.qr_1')}</span>
                                <span className='fs-15'>{t('movement.qr_2')}</span>
                                <span className='fs-15'>{t('movement.qr_3')}</span>
                            </Col>
                        </Row>
                    </div>
                })
            }
        </div>
    )
})

export default printData