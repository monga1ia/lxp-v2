import React, {useEffect, useState} from 'react'
import {Modal} from 'semantic-ui-react'
import CloseIcon from '@mui/icons-material/Close'
import DTable from 'modules/DataTable/DTable'
import { useTranslation } from "react-i18next";
import {Col, Row, Container} from 'react-bootstrap'
import {studentBookExamDetail} from 'utils/fetchRequest/Urls'
import {fetchRequest} from 'utils/fetchRequest'
import message from "modules/message";;

const examModal = ({onClose, studentId = null, detailId = null}) => {
    const locale="mn"
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false)

    const [exam, setExam] = useState([])
    const [tableData, setTableData] = useState([])

    const config = {
        showAllData: true,
        showPagination: false,
        showFilter: false,
        footer: true,
        footerStyle: {
            backgroundColor: '#dfe2ea',
        }
    }

    const columns = [
        {
            dataField: "name",
            text: t('exam_template.question'),
            sort: true,
            footer: '',
        },
        {
            dataField: "score",
            text: t('exam.exam_total_score'),
            align: 'right',
            sort: true,
            footer: '',
            footerType: 'sum',
            footerAlign: 'right',
        },
        {
            dataField: "takenScore",
            text: t('exam.taken_score'),
            sort: true,
            align: 'right',
            footer: '',
            footerType: 'sum',
            footerAlign: 'right',
            formatter: (cell, row) => {
                return <span style={{
                    padding: '5px 7px',
                    borderRadius: 3,
                    color: 'white',
                    backgroundColor: row?.isComplete ? '#6dd400' : (row?.takenScore === 0 ? '#ff2f19' : '#868aa8')
                }}>{cell}</span>
            }
        },
    ]

    useEffect(() => {
        setLoading(true)
        // fetchRequest(studentBookExamDetail, 'POST', {detail: detailId, student: studentId})
        //     .then(res => {
        //         if (res.success) {
        //             const {exam, questions} = res.data
        //             setExam(exam || [])
        //             setTableData(questions || [])
        //         } else {
        //             message(res.data.message)
        //         }
        //         setLoading(false)
        //     })
        //     .catch(() => {
        //         message(t('err.error_occurred'))
        //         setLoading(false)
        //     })
    }, [])

    return (
        <Modal
            dimmer='blurring'
            open={true}
            onClose={onClose}
            className="react-modal overflow-modal"
            centered
        >
            <div className="header">
                {exam?.name || t('exam.name')}
                <button type="button" className="close" aria-label="Close" onClick={onClose}>
                    <CloseIcon/>
                </button>
            </div>
            <div className="br-08 position-relative "
                 style={{border: '1px solid rgba(255, 91, 29, 0.1)', margin: 20, marginBottom: 10}}>
                <Container fluid className='py-3'>
                    <Row className='bolder'>
                        <Col lg={6} className='d-flex align-items-center justify-content-center'>
                            <table style={{color: '#4a4a4a'}}>
                                <tbody>
                                <tr>
                                    <td className='text-right py-1 pr-3 bolder'>{t('date')}</td>
                                    <td style={{color: '#ff5b1d'}}>{exam?.takenDate}</td>
                                </tr>
                                <tr>
                                    <td className='text-right py-1 pr-3 bolder'>{t('exam.subject')}</td>
                                    <td style={{color: '#ff5b1d'}}>{exam?.subjectName}</td>
                                </tr>
                                <tr>
                                    <td className='text-right py-1 pr-3 bolder'>{t('exam.name')}</td>
                                    <td style={{color: '#ff5b1d'}}>{exam?.name}</td>
                                </tr>
                                <tr>
                                    <td className='text-right py-1 pr-3 bolder'>{t('season_score.performance')}</td>
                                    <td style={{color: '#ff5b1d'}}>{exam?.studentScore}</td>
                                </tr>
                                <tr>
                                    <td className='text-right py-1 pr-3 bolder'>{t('exam.ranking')}</td>
                                    <td style={{color: '#ff5b1d'}}>{exam?.studentPlace}</td>
                                </tr>
                                </tbody>
                            </table>
                        </Col>
                        <Col lg={6} className='d-flex align-items-center justify-content-center'>
                            <table style={{color: '#4a4a4a'}}>
                                <tbody>
                                <tr>
                                    <td className='text-right py-1 pr-3 bolder'>{t('teacher_title')}</td>
                                    <td style={{color: '#ff5b1d'}}>{exam?.teacherName}</td>
                                </tr>
                                <tr>
                                    <td className='text-right py-1 pr-3 bolder'>{t('exam.max_score')}</td>
                                    <td style={{color: '#ff5b1d'}}>{exam?.maxScore}</td>
                                </tr>
                                <tr>
                                    <td className='text-right py-1 pr-3 bolder'>{t('studentBook.average')}</td>
                                    <td style={{color: '#ff5b1d'}}>{exam?.avgScore}</td>
                                </tr>
                                <tr>
                                    <td className='text-right py-1 pr-3 bolder'>{t('exam.min_score')}</td>
                                    <td style={{color: '#ff5b1d'}}>{exam?.minScore}</td>
                                </tr>
                                </tbody>
                            </table>
                        </Col>
                    </Row>
                </Container>
            </div>
            {/*{*/}
            {/*    questions && questions?.length > 0 &&*/}
                <div className="br-08 position-relative px-5"
                     style={{border: '1px solid rgba(255, 91, 29, 0.1)', margin: 20, marginTop: 0}}>
                    <DTable
                        locale={locale}
                        config={config}
                        columns={columns}
                        data={tableData}
                    />
                </div>
            {/*}*/}
            <div className="actions modal-footer ">
                <div className="col-12 text-center">
                    <button
                        onClick={onClose}
                        className="btn btn-outline-metal m-btn--pill"
                    >
                        {t('close')}
                    </button>
                </div>
            </div>
            {loading &&
            <>
                <div className='blockUI blockOverlay'/>
                <div className='blockUI blockMsg blockPage'>
                    <div className='m-loader m-loader--brand m-loader--lg'/>
                </div>
            </>
            }
        </Modal>
    )
}

export default examModal