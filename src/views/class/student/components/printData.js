import React from 'react'
import { Col, Row } from 'react-bootstrap'
import secureLocalStorage from 'react-secure-storage'
import { useTranslation } from "react-i18next";

const printData = React.forwardRef((props, ref) => {
    const { school, student } = props
    const locale="mn"
    const { t } = useTranslation();

    return (
        <div ref={ref} className='d-flex flex-column align-items-center justify-content-between w-100 h-100 p-5 text-black'>

            <div className='d-flex flex-column align-items-center fs-18'>
                {
                    school?.horizontalLogo
                        ? <img width={350} src={school?.horizontalLogo} alt={school?.longName} />
                        : <h1>{school?.longName}</h1>
                }
                <span className='mt-4'>{locale?.toLowerCase() == 'mn' ? school?.addressMn : school?.addressEn}</span>
                <span>{t('invoice_form.contact')}: {school?.contact}</span>
                <span>{t('website')}: {school?.website}</span>
            </div>

            <h1 className='bolder text-uppercase my-5 fs-25 text-center'>{t('movement.register_sheet')}</h1>

            <div className='fs-20 w-100'>
                <Row>
                    <Col className='text-right pb-2'>{t('group.name')}: </Col>
                    <Col className='bolder'>{student?.className || '-'}</Col>
                </Row>
                <Row>
                    <Col className='text-right pb-2'>{t('studentCode')}: </Col>
                    <Col className='bolder'>{student?.code || '-'}</Col>
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
                    <Col className='bolder'>{student?.createdDate || '-'}</Col>
                </Row>
            </div>

            <img height={400} width={400} src={student?.qr} alt="qr" />

            <Row className='d-flex align-items-center justify-content-center'>
                <div className='col-3 text-right'>
                    <img width={120} height={120} src={student?.qr} alt="qr" />
                </div>
                <Col className='d-flex flex-column'>
                    <span className='fs-15'>{t('movement.qr_1')}</span>
                    <span className='fs-15'>{t('movement.qr_2')}</span>
                    <span className='fs-15'>{t('movement.qr_3')}</span>
                </Col>
            </Row>
        </div>
    )
})

export default printData