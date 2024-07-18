import React, { useState } from 'react'
import { Col, Row } from 'react-bootstrap'
import { useTranslation } from "react-i18next";
import { Chart as ChartJS, ArcElement, LinearScale, CategoryScale, BarElement, PointElement, LineElement, Tooltip, LineController, BarController, Title } from 'chart.js'
import TreeView from 'modules/TreeView2'

// const locale = secureLocalStorage?.getItem('selectedLang') || 'mn'

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

const others = () => {

    const locale="mn"
    const { t } = useTranslation();    
    ChartJS.register(LinearScale, ArcElement, CategoryScale, BarElement, PointElement, LineElement, Tooltip, Title, LineController, BarController)
    ChartJS.defaults.font.family = 'MulishRegular'

    const [loading, setLoading] = useState(false)
    const [treeData, setTreeData] = useState([])

    const config = {
        excelExport: true,
        defaultSort: [{
            dataField: 'firstName',
            order: 'asc'
        }]
    }

    const columns = [
        {
            dataField: "status",
            text: t('status'),
        },
        {
            dataField: "groupType",
            text: t('course_type'),
        },
        {
            dataField: 'payDate',
            text: t('studentBook.pay_date'),
        },
        {
            dataField: 'invoiceNumber',
            text: t('finance.invoice_number'),
        },
    ]

    const handleTreeSelect = () => {

    }

    return (
        <div className='m-portlet__body'>
            <Row>
                <Col md={3}>
                    <div className='border-orange br-08' style={{ borderWidth: 4 }}>
                        <TreeView
                            treeData={treeData}
                            onSelect={handleTreeSelect}
                        />
                    </div>
                </Col>
                <Col md={9}>
                    Testtt
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
        </div>
    )
}

export default others