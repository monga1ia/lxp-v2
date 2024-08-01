import React, {useEffect, useState} from 'react'
import {Modal} from 'react-bootstrap'
import CloseIcon from '@mui/icons-material/Close'
import DTable from 'modules/DataTable/DTable'
import secureLocalStorage from 'react-secure-storage'
import { useTranslation } from "react-i18next";
import {Col, Row, Container} from 'react-bootstrap'
import {studentBookPaymentDetail} from 'utils/fetchRequest/Urls'
import {fetchRequest} from 'utils/fetchRequest'
import message from "modules/message";;
import {priceFormat} from "utils/Util";

const payment = ({onClose, student, invoice}) => {
    const locale="mn"
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false)

    const [invoiceObj, setInvoiceObj] = useState(null)
    const [payments, setPayments] = useState([])
    const [otherInvoices, setOtherInvoices] = useState([])

    const config = {
        showAllData: true,
        showPagination: false,
        showFilter: false,
        defaultSort: [{
            dataField: 'firstName',
            order: 'asc',
        }]
    }

    const columns1 = [
        {
            dataField: "isComplete",
            text: t('status'),
            sort: true,
            formatter: (cell, row) => row?.isComplete
                ? <span style={{
                    padding: '3px 7px',
                    backgroundColor: '#65ccb5',
                    color: 'white',
                    borderRadius: 10
                }}>{t('finance.paid')}</span>
                : (parseInt(row?.paidAmount) > 0
                    ? <span style={{
                        padding: '3px 7px',
                        color: 'white',
                        backgroundColor: '#716aca',
                        borderRadius: 10
                    }}>{t('finance.incomplete')}</span>
                    : <span style={{
                        padding: '3px 7px',
                        color: 'white',
                        backgroundColor: '#f4516b',
                        borderRadius: 10
                    }}>{t('finance.unpaid')}</span>)
        },
        {
            dataField: "dueDate.date",
            text: t('studentBook.pay_date'),
            sort: true,
            formatter: (cell) => <span>{cell?.substring(0, 10)}</span>
        },
        {
            dataField: "unpaidAmount",
            text: t('studentBook.pay'),
            sort: true,
            align: 'right',
            formatter: (cell) => priceFormat(cell)
        },
    ]

    const columns2 = [
        {
            dataField: "connectedType",
            text: t('studentBook.paid_type'),
            sort: true
        },
        {
            dataField: "transactionDate",
            text: t('studentBook.paid_date'),
            sort: true,
            formatter: (cell) => cell?.date?.substring(0, 10)
        },
        {
            dataField: "paidAmount",
            text: t('studentBook.paid'),
            sort: true,
            align: 'right',
            formatter: (cell) => priceFormat(cell)
        },
        {
            dataField: "createdDate.date",
            text: t('studentBook.registered_date'),
            sort: true,
            formatter: (cell) => cell?.substring(0, 19)
        },
    ]

    useEffect(() => {
        // setLoading(true)
        // fetchRequest(studentBookPaymentDetail, 'POST', {id: student?.id, invoice: invoice?.id})
        //     .then(res => {
        //         if (res.success) {
        //             const {invoice, payments} = res.data
        //             setInvoiceObj(invoice || null)
        //             setPayments(payments || [])
        //         } else {
        //             message(res.data.message)
        //         }
        //         setLoading(false)
        //     })
        //     .catch(() => {
        //         message(t('err.error_occurred'))
        //         setLoading(false)
        //     })
    }, [invoice, student])

    return (
        <Modal
            dimmer='blurring'
            show={true}
            size="xl"
            aria-labelledby="contained-modal-title-vcenter"
            onHide={() => onClose()}
            centered
        >
            <Modal.Header closeButton style={{ padding: '1rem' }}>
                <Modal.Title className="modal-title d-flex flex-row justify-content-between w-100">
                    {invoice?.name}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="br-08 position-relative "
                    style={{border: '1px solid rgba(255, 91, 29, 0.1)', margin: 20, marginBottom: 10}}>
                    <Container fluid className='py-3'>
                        {/* {invoices?.map((item, index) => ( */}
                        <Row className='bolder'>
                            <Col lg={6} className='d-flex align-items-center justify-content-center'>
                                <table style={{color: '#4a4a4a'}}>
                                    <tbody>
                                    <tr>
                                        <td className='text-right py-1 pr-3 bolder'>{toString('studentBook.payment_num')}</td>
                                        <td style={{color: '#ff5b1d'}}>{invoice?.number}</td>
                                    </tr>
                                    <tr>
                                        <td className='text-right py-1 pr-3 bolder'>{t('studentBook.state')}</td>
                                        <td style={{color: '#ff5b1d'}}>{invoice?.status}</td>
                                    </tr>
                                    <tr>
                                        <td className='text-right py-1 pr-3 bolder'>{t('studentBook.student_code')}</td>
                                        <td style={{color: '#ff5b1d'}}>{student?.studentCode}</td>
                                    </tr>
                                    <tr>
                                        <td className='text-right py-1 pr-3 bolder'>{t('studentFirstName')}</td>
                                        <td style={{color: '#ff5b1d'}}>{student?.firstName}</td>
                                    </tr>
                                    <tr>
                                        <td className='text-right py-1 pr-3 bolder'>{t('studentBook.class')}</td>
                                        <td style={{color: '#ff5b1d'}}>{student?.className}</td>
                                    </tr>
                                    </tbody>
                                </table>
                            </Col>
                            <Col lg={6} className='d-flex align-items-center justify-content-center'>
                                <table style={{color: '#4a4a4a'}}>
                                    <tbody>
                                    <tr>
                                        <td className='text-right py-1 pr-3 bolder'>{t('studentBook.uploaded_date')}</td>
                                        <td style={{color: '#ff5b1d'}}>{invoice?.createdDate}</td>
                                    </tr>
                                    <tr>
                                        <td className='text-right py-1 pr-3 bolder'>{t('studentBook.pay')}</td>
                                        <td style={{color: '#ff5b1d'}}>{priceFormat(invoice?.amount)}</td>
                                    </tr>
                                    <tr>
                                        <td className='text-right py-1 pr-3 bolder'>{t('studentBook.paid')}</td>
                                        <td style={{color: '#ff5b1d'}}>{priceFormat(invoice?.paidAmount)}</td>
                                    </tr>
                                    <tr>
                                        <td className='text-right py-1 pr-3 bolder'>{t('studentBook.remain')}</td>
                                        <td style={{color: '#ff5b1d'}}>{priceFormat(invoice?.unpaidAmount)}</td>
                                    </tr>
                                    <tr>
                                        <td className='text-right py-1 pr-3 bolder'>{t('studentBook.e_barimt')}</td>
                                        <td style={{color: '#ff5b1d'}}>{invoice?.hasEbarimt ? t('finance.ebarimtCreated') : t('finance.ebarimtNotCreated')}</td>
                                    </tr>
                                    </tbody>
                                </table>
                            </Col>
                        </Row>
                        {/* ))} */}

                    </Container>
                </div>

                <div className="br-08 position-relative px-5"
                    style={{border: '1px solid rgba(255, 91, 29, 0.1)', margin: 20, marginTop: 0}}>
                    <Row>
                        <Col md={12}>
                            <div style={{marginTop: 15, color: '#ff5b1d', fontWeight: 'bold'}}>
                                {t('finance.payment_graph')}
                            </div>
                            <DTable
                                locale={locale}
                                config={config}
                                columns={columns1}
                                data={invoice?.dueDates}
                            />
                        </Col>
                    </Row>
                </div>

                <div className="br-08 position-relative px-5"
                    style={{border: '1px solid rgba(255, 91, 29, 0.1)', margin: 20, marginTop: 0}}>
                    <Row>
                        <Col md={12}>
                            <div style={{marginTop: 15, color: '#ff5b1d', fontWeight: 'bold'}}>
                                {t('finance.payment_history')}
                            </div>
                            <DTable
                                locale={locale}
                                config={config}
                                columns={columns2}
                                data={payments}
                            />
                        </Col>
                    </Row>
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

export default payment