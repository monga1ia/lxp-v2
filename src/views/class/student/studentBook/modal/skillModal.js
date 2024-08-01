import React, { useState, useEffect } from 'react'
import { Modal } from 'react-bootstrap'
import DTable from 'modules/DataTable/DTable'
import { useTranslation } from "react-i18next";
import { Col, Row, Container } from 'react-bootstrap'
import { studentBookSkillDetail } from 'utils/fetchRequest/Urls'
import { fetchRequest } from 'utils/fetchRequest/index'
import message from "modules/message";

const skill = ({ onClose, skill, studentId }) => {
    const locale="mn"
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false)

    const [skillInfo, setSkillInfo] = useState([])
    const [tableData, setTableData] = useState([])

    const config = {
        showAllData: true,
        showPagination: false,
        showFilter: false
    }

    const columns = [
        {
            dataField: "detail",
            text: t('skill.name'),
            sort: true
        },
        {
            dataField: "result",
            text: t('result'),
            sort: true,
            formatter: (cell, row) => <span>{cell} ({row?.score})</span>
        },
    ]

    useEffect(() => {
        // setLoading(true)
        // fetchRequest(studentBookSkillDetail, 'POST', { skill, student: studentId })
        //     .then(res => {
        //         if (res.success) {
        //             setSkillInfo(res?.data?.skill)
        //             setTableData(res?.data?.list)
        //         } else {
        //             message(res.data.message)
        //         }
        //         setLoading(false)
        //     })
        //     .catch(() => {
        //         message(t('err.error_occurred'))
        //         setLoading(false)
        //     })
    }, [skill, studentId])

    return (
        <Modal
            dimmer='blurring'
            show={true}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            onHide={() => onClose()}
            centered
        >
            <Modal.Header closeButton style={{ padding: '1rem' }}>
                <Modal.Title className="modal-title d-flex flex-row justify-content-between w-100">
                    {skillInfo?.template || t('skill.assessmentTemplate')}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="br-08 position-relative margin-bottom-0" style={{ border: '1px solid rgba(255, 91, 29, 0.1)', margin: 20, marginBottom: 10 }}>
                    <Container fluid className='py-3'>
                        <Row className='bolder'>
                            <Col lg={12} className='d-flex align-items-center justify-content-center'>
                                <table style={{ color: '#4a4a4a' }}>
                                    <tbody>
                                        <tr>
                                            <td className='text-right py-1 pr-3 bolder'>{t('date')}</td>
                                            <td style={{ color: '#ff5b1d' }}>{skillInfo?.createdDate}</td>
                                        </tr>
                                        <tr>
                                            <td className='text-right py-1 pr-3 bolder'>{t('exam.subject')}</td>
                                            <td style={{ color: '#ff5b1d' }}>{skillInfo?.subjectName}</td>
                                        </tr>
                                        <tr>
                                            <td className='text-right py-1 pr-3 bolder'>{t('teacher_title')}</td>
                                            <td style={{ color: '#ff5b1d' }}>{skillInfo?.teacherName}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </Col>
                        </Row>
                    </Container>
                </div>
                <div className="br-08 position-relative px-5" style={{ border: '1px solid rgba(255, 91, 29, 0.1)', margin: 20, marginTop: 0 }}>
                    <DTable
                        locale={locale}
                        config={config}
                        columns={columns}
                        data={tableData}
                    />
                </div>
            </Modal.Body>
            <Modal.Footer className="text-center">
                <button
                    onClick={onClose}
                    className="btn btn-outline-metal m-btn--pill"
                >
                    {t('close')}
                </button>
            </Modal.Footer>
            {
                loading &&
                <>
                    <div className="blockUI blockOverlay">
                        <div className="blockUI blockMsg blockPage">
                            <div className="m-loader m-loader--brand m-loader--lg" />
                        </div>
                    </div>
                </>
            }
        </Modal>
    )
}

export default skill