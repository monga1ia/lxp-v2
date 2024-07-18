import React, { useState, useEffect } from 'react'
import { Col, Row } from 'react-bootstrap'
import DTable from 'modules/DataTable/DTable'
import { useTranslation } from "react-i18next";
import { Chart as ChartJS, ArcElement, LinearScale, CategoryScale, BarElement, PointElement, LineElement, Tooltip, LineController, BarController, Title } from 'chart.js'
import TreeView from 'modules/TreeView2'
import PaymentModal from '../modal/paymentModal'
import {studentBookPayment} from 'utils/fetchRequest/Urls'
import { fetchRequest } from 'utils/fetchRequest'
import {priceFormat} from "utils/Util";
import message from "modules/message";
import PreviewTwoToneIcon from '@mui/icons-material/PreviewTwoTone'

const payment = ({student}) => {
    const locale="mn"
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false)
    ChartJS.register(LinearScale, ArcElement, CategoryScale, BarElement, PointElement, LineElement, Tooltip, Title, LineController, BarController)
    ChartJS.defaults.font.family = 'MulishRegular'

    const contextMenus = [
        {
            key: 'view',
            icon: <PreviewTwoToneIcon sx={{fontSize: '2rem !important', color: '#ff5b1d'}}/>,
            title: t('view'),
        }
    ]

    const [selectedInvoiceObj, setSelectedInvoiceObj] = useState(null)
    const [showPaymentModal, setShowPaymentModal] = useState(false)

    const [tableData, setTableData] = useState([])
    const [treeData, setTreeData] = useState([])
    const [selectedTreeData, setSelectedTreeData] = useState(null)

    const config = {
        excelExport: true,
        excelFileName: `${student?.studentCode}-${t('student.book_title')}-${t('finance.invoice')}`,
        defaultSort: [{
            dataField: 'firstName',
            order: 'asc'
        }]
    }

    const styles = {
        colors: {
            red: '#e02020',
            lightRed: 'rgba(244, 81, 107, 0.5)',
            green: '#6dd400',
            lightGreen: 'rgba(62, 191, 163, 0.5)',
            blue: 'rgba(54, 163, 247, 0.8)',
            teal: '#41c5dc'
        }
    }

    const columns = [
        {
            dataField: "status",
            text: t('status'),
            sort: true,
        },
        {
            dataField: "type",
            text: t('course_type'),
            sort: true,
        },
        {
            dataField: 'dueDates[0].dueDate.date',
            text: t('studentBook.pay_date'),
            sort: true,
            formatter: (cell) => <span>{cell?.substring(0, 10)}</span>
        },
        {
            dataField: 'number',
            text: t('finance.invoice_number'),
            sort: true,
        },
        {
            dataField: 'name',
            text: t('finance.invoice_name'),
            sort: true,
            formatter: (cell, row) => <span onClick={() => handleCellClick(row)} className='underline' > {cell || 0}</span>
        },
        {
            dataField: 'invoiceAmount',
            text: t('amount'),
            align: 'right',
            sort: true,
            formatter: (cell) => <span>{priceFormat(cell)}</span>
        },
        {
            dataField: 'paidAmount',
            text: t('paid_amount'),
            align: 'right',
            sort: true,
            formatter: (cell) => <span>{priceFormat(cell)}</span>
        },
        {
            dataField: 'unpaidAmount',
            text: t('studentBook.remain'),
            align: 'right',
            sort: true,
            formatter: (cell) => <span>{priceFormat(cell)}</span>
        },
    ]

    const loadData = (season = null) => {
        setLoading(true)
        // fetchRequest(studentBookPayment, 'POST', { id: student?.id, season })
        //     .then(res => {
        //         if (res.success) {
        //             const { invoices, seasons, selectedSeason } = res.data
        //             setTableData(invoices || [])
        //             setTreeData(seasons || [])
        //             setSelectedTreeData(selectedSeason)
        //         } else {
        //             message(res.data.message)
        //         }
        //         setLoading(false)
        //     })
        //     .catch(() => {
        //         message(t('err.error_occurred'))
        //         setLoading(false)
        //     })
    }

    useEffect(() => {
        loadData()
    }, [])

    const handleCellClick = (row) => {
        setSelectedInvoiceObj(row)
        setShowPaymentModal(true)
    }

    const closeModal = () => {
        setSelectedInvoiceObj(null)
        setShowPaymentModal(false)
    }

    const handleTreeChange = (key) => {
        setSelectedTreeData(key)
        loadData(key)
    }

    const onContextMenuClick = (id, key) => {
        if (id && key) {
            if (key === 'view') {
                handleCellClick(tableData?.find(obj => obj?.id === id))
            }
        }
    }

    return (
        <div className='m-portlet__body'>
            <Row>
                <Col md={3} className='col-form-label text-right'>
                    <div className='m-portlet__body border-orange br-08 ' style={{ borderWidth: 4, textAlign: 'left' }}>
                        <TreeView
                            defaultExpandAll
                            treeData={treeData}
                            selectedNodes={[selectedTreeData]}
                            onSelect={(key) => {
                                handleTreeChange(key?.[0])
                            }}
                        />
                    </div>
                </Col>
                <Col md={9}>
                    <div className='border-orange px-4 br-08 mt-2' >
                        <DTable
                            totalDataSize={tableData?.length}
                            locale={locale}
                            config={config}
                            data={tableData}
                            columns={columns}
                            contextMenus={contextMenus}
                            onContextMenuItemClick={onContextMenuClick}
                        />
                    </div>
                </Col>
            </Row>
            {
                loading &&
                <>
                    <div className='blockUI blockOverlay' />
                    <div className='blockUI blockMsg blockPage'>
                        <div className='m-loader m-loader--brand m-loader--lg' />
                    </div>
                </>
            }
            {showPaymentModal &&
                <PaymentModal
                    onClose={closeModal}
                    student={student}
                    invoice={selectedInvoiceObj}
                />
            }
        </div>
    )
}

export default payment