import React, {useState, useEffect} from 'react'
import {Col, Row} from 'react-bootstrap'
import DTable from 'modules/DataTable/DTable'
import secureLocalStorage from 'react-secure-storage'
import { useTranslation } from "react-i18next";
import {
    Chart as ChartJS,
    ArcElement,
    LinearScale,
    CategoryScale,
    BarElement,
    PointElement,
    LineElement,
    Tooltip,
    LineController,
    BarController,
    Title
} from 'chart.js'
import TreeView from 'modules/TreeView2'
import TimelineIcon from '@mui/icons-material/Timeline';
import {Bar} from 'react-chartjs-2'
import {studentBookSale} from 'utils/fetchRequest/Urls'
import {fetchRequest} from 'utils/fetchRequest'
import {dateFormat, priceFormat} from "utils/Util";
import DayPickerInput from "react-day-picker/DayPickerInput";
import message from "modules/message";

const sale = ({student, saleTypeCode}) => {
    const locale="mn"
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false)
    ChartJS.register(LinearScale, ArcElement, CategoryScale, BarElement, PointElement, LineElement, Tooltip, Title, LineController, BarController)
    ChartJS.defaults.font.family = 'MulishRegular'

    const [invoiceId, setInvoiceId] = useState(null)
    const [showPaymentModal, setShowPaymentModal] = useState(false)

    const [monthLabels, setMonthLabels] = useState([])
    const [months, setMonths] = useState([])
    const [outCounts, setOutCounts] = useState([])
    const [totalCount, setTotalCount] = useState(0)
    const [tableData, setTableData] = useState([])
    const [treeData, setTreeData] = useState([])
    const [seasonStart, setSeasonStart] = useState(null)
    const [seasonEnd, setSeasonEnd] = useState(null)
    const [selectedTreeData, setSelectedTreeData] = useState(null)

    const [startDate, setStartDate] = useState(null)
    const [endDate, setEndDate] = useState(null)

    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [search, setSearch] = useState('');
    const [order, setOrder] = useState('asc');
    const [sort, setSort] = useState('createdDate');

    const config = {
        excelExport: false,
        showPagination: true,
        showAllData: false,
        defaultPageOptions: {
            page: page,
            sizePerPage: pageSize,
            search: search,
        }
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

    const columns = saleTypeCode === 'FOOD' ? [
        {
            dataField: "usedDate",
            text: t('sale.usedFoodDate'),
            sort: true,
            formatter: (cell) => <span>{cell?.date?.substring(0, 10)}</span>
        },
        {
            dataField: "createdDate",
            text: t('created_date'),
            sort: true,
            formatter: (cell) => <span>{cell?.date?.substring(0, 19)}</span>
        },
        {
            dataField: 'type',
            text: t('sale.type'),
            sort: true,
        },
        {
            dataField: 'createdUser',
            text: t('created_user'),
            sort: true,
        }
    ] : [
        {
            dataField: "usedDate",
            text: t('sale.usedDate'),
            sort: true,
            formatter: (cell) => <span>{cell?.date?.substring(0, 10)}</span>
        },
        {
            dataField: "routeName",
            text: t('studentBook.route'),
            sort: true,
        },
        {
            dataField: "type",
            text: t('sale.type'),
            sort: true,
        },
        {
            dataField: "bus",
            text: t('studentBookNavs.bus'),
            sort: true
        },
        {
            dataField: 'createdUser',
            text: t('created_user'),
            sort: true,
            formatter: (cell, row) => <span>{row?.createdUser + ' - ' + row?.createdUsername}</span>
        }
    ]

    const loadData = (season = null, start = null, end = null, page = 1, pageSize = 10, search = null, sort = null, order = null) => {
        setLoading(true)
        // fetchRequest(studentBookSale, 'POST', {
        //     id: student?.id,
        //     saleTypeCode,
        //     season,
        //     start,
        //     end,
        //     page,
        //     pageSize,
        //     search,
        //     sort,
        //     order
        // })
        //     .then(res => {
        //         if (res.success) {
        //             const {details, detailCount, seasons, selectedSeason, start, end} = res.data

        //             const monthList = res.data.months;
        //             const labels = []
        //             const monthValues = []
        //             const outValues = []
        //             if (monthList && monthList.length > 0) {
        //                 for (let m = 0; m < monthList.length; m++) {
        //                     labels.push(monthList[m].month)
        //                     monthValues.push(monthList[m].count || 0)
        //                     outValues.push(monthList[m].outCount || 0)
        //                 }
        //             }
        //             setMonthLabels(labels)
        //             setMonths(monthValues)
        //             setOutCounts(outValues)
        //             setTableData(details || [])
        //             setTotalCount(detailCount)
        //             setTreeData(seasons || [])
        //             setSelectedTreeData(selectedSeason)
        //             setSeasonStart(start)
        //             setSeasonEnd(end)
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
        // loadData()
    }, [saleTypeCode])

    const handleTreeChange = (key) => {
        setSelectedTreeData(key)
        // loadData(key, startDate, endDate)
    }

    const getTitleBySaleType = (code) => {
        switch (code) {
            case 'FOOD':
                return t('studentBookNavs.food_title');
            case 'BUS':
                return t('studentBookNavs.bus_title');
            default:
                return ''
        }
    }

    const onUserInteraction = (params = null) => {
        if (params.page) {
            if(params.search) {
                setPage(1);
                setPageSize(10);
                setSearch(params.search);

                // loadData(selectedTreeData, startDate, endDate, 1, 10, params?.search, params?.sort, params?.order)
            } else {
                setPage(params.page);
                setPageSize(params.pageSize);
                setSearch(params.search);
                setSort(params.sort);
                setOrder(params.order);

                // loadData(selectedTreeData, startDate, endDate, params?.page, params?.pageSize, params?.search, params?.sort, params?.order)
            }
        }
    }

    return (
        <div className='m-portlet__body'>
            <Row>
                <Col md={3} className='col-form-label text-right'>
                    <div className='m-portlet__body border-orange br-08 ' style={{borderWidth: 4, textAlign: 'left'}}>
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
                    <div className='border-orange br-08 mt-2'>
                        <p style={{
                            padding: '10px 20px',
                            color: 'rgb(255, 91, 29)',
                            fontFamily: 'PinnacleBold',
                            borderBottom: '1px solid #e9ecef'
                        }}>{getTitleBySaleType(saleTypeCode)}</p>
                        <div style={{maxHeight: 300, paddingLeft: 50, paddingRight: 50}}>
                            <Bar
                                height={300}
                                options={{
                                    indexAxis: 'x',
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    plugins: {
                                        legend: {
                                            display: false
                                        },
                                    },
                                    scale: {
                                        yAxes: [{
                                            ticks: {
                                                beginAtZero: true,
                                                reverse: false,
                                                stepSize: 1
                                            },
                                        }]
                                    }
                                }}
                                data={{
                                    labels: monthLabels,
                                    datasets: saleTypeCode === 'BUS' ? [
                                        {
                                            label: t('busDashboard.in_count'),
                                            data: months,
                                            backgroundColor: '#36A3F7'
                                        },
                                        {
                                            label: t('busDashboard.out_count'),
                                            backgroundColor: '#f5a623',
                                            data: outCounts
                                        }
                                    ] : [
                                        {
                                            label: '',
                                            data: months,
                                            backgroundColor: '#36A3F7'
                                        }
                                    ]
                                }}
                            />
                        </div>
                    </div>
                    <div className='border-orange br-08 mt-2'>
                        <p style={{
                            padding: '10px 20px',
                            color: 'rgb(255, 91, 29)',
                            fontFamily: 'PinnacleBold',
                            borderBottom: '1px solid #e9ecef'
                        }}>{t('studentBook.learn_more')}</p>
                        <div className="actions justify-content-center d-flex align-items-center" style={{
                            paddingTop: 30,
                            paddingBottom: 30
                        }}>
                            <div className={'pinnacle-bold'}
                                 style={{marginRight: 20}}>{t('studentBook.date')}*
                            </div>
                            <DayPickerInput
                                value={startDate}
                                inputProps={{className: 'form-control h-100'}}
                                placeholder={t('datePickerPlaceholder')}
                                onDayChange={(day) => {
                                    setStartDate(dateFormat(new Date(day)))
                                }
                                }
                                classNames={{
                                    overlay: 'DayPickerInputOverlay',
                                    container: 'position-relative h-100'
                                }}
                                dayPickerProps={{
                                    firstDayOfWeek: 1,
                                    disabledDays: {
                                        after: new Date(seasonEnd),
                                        before: new Date(seasonStart)
                                    },
                                }}
                            />
                            <div className={'pinnacle-bold'} style={{margin: 10}}>-</div>
                            <DayPickerInput
                                value={endDate}
                                inputProps={{className: 'form-control h-100'}}
                                placeholder={t('datePickerPlaceholder')}
                                onDayChange={(day) => {
                                    setEndDate(dateFormat(new Date(day)))
                                }
                                }
                                classNames={{
                                    overlay: 'DayPickerInputOverlay',
                                    container: 'position-relative h-100'
                                }}
                                dayPickerProps={{
                                    firstDayOfWeek: 1,
                                    disabledDays: {
                                        after: new Date(seasonEnd),
                                        before: new Date(seasonStart)
                                    },
                                }}
                            />

                                <button
                                    className='btn btn-sm m-btn--pill m-btn--uppercase d-inline-flex br-8'
                                    style={{
                                        borderRadius: '10px',
                                        backgroundColor: '#41c5dc',
                                        color: 'white',
                                        borderColor: '#41c5dc',
                                        marginLeft: 20
                                    }}
                                    onClick={() => {
                                        if (startDate && endDate) {
                                            loadData(selectedTreeData, startDate, endDate)
                                        } else {
                                            message(t('err.select_date'))
                                        }
                                    }}
                                >
                                        <TimelineIcon className='d-flex' style={{
                                            marginLeft: '0.5rem',
                                            marginRight: '0.5rem',
                                            padding: '0px'
                                        }}/>
                                        <span style={{
                                            marginLeft: '0.5rem',
                                            marginRight: '0.5rem'
                                        }}>{t('view')}</span>
                                </button>
                        </div>
                    </div>
                    <div className='border-orange px-4 br-08 mt-2'>
                        <DTable
                            remote
                            totalDataSize={totalCount}
                            locale={locale}
                            config={config}
                            data={tableData}
                            columns={columns}
                            onInteraction={onUserInteraction}
                        />
                    </div>
                </Col>
            </Row>
            {
                loading &&
                <>
                    <div className='blockUI blockOverlay'/>
                    <div className='blockUI blockMsg blockPage'>
                        <div className='m-loader m-loader--brand m-loader--lg'/>
                    </div>
                </>
            }
        </div>
    )
}

export default sale