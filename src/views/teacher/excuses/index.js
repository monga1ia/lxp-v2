import { useState } from 'react'
import message from 'modules/message'
import ViewModal from './modal/view'
import React, { useEffect } from 'react'
import { Tab } from 'semantic-ui-react'
import TreeView from 'modules/TreeView'
import ResponseModal from './modal/response'
import RegisterModal from './modal/register'
import DTable from 'modules/DataTable/DTable'
import secureLocalStorage from 'react-secure-storage'
import { Col, Container, Row } from 'react-bootstrap'
import { fetchRequest } from 'utils/fetchRequest'
import { translations } from 'utils/translations'
import DayPickerInput from 'react-day-picker/DayPickerInput'
import CancelTwoToneIcon from '@mui/icons-material/CancelTwoTone'
import PreviewTwoToneIcon from '@mui/icons-material/PreviewTwoTone'
import CheckCircleTwoToneIcon from '@mui/icons-material/CheckCircleTwoTone'
import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded'

import BreadcrumbList from 'components/breadcrumb-list/BreadcrumbList'
import HtmlHead from 'components/html-head/HtmlHead'
import { useTranslation } from 'react-i18next'
// import {
//     teacherExcuseReasonInit,
//     teacherExcuseReasonSubmit,
//     teacherExcuseRequestExcel,
//     teacherExcuseRequestInit,
//     teacherExcuseRequestSubmit
// } from 'Utilities/url'

const index = () => {

    const { t } = useTranslation()
    const locale = secureLocalStorage?.getItem('selectedLang') || 'mn'

    const title = t('menu.teacher.excuses');
    const description = "E-learning";
    const breadcrumbs = [
        { to: "", text: "Home" },
        { to: "teacher/excuses", text: title }
    ];

    const treeIndex = ['teacher_excuses_tree_index'];
    const tabIndex = ['teacher_excuses_tab_index'];
    const requestTableIndex = ['teacher_excuses_request_table_index'];
    const reasonTableIndex = ['teacher_excuses_reason_table_index'];

    const [loading, setLoading] = useState(false)

    const [pdfExported, setPdfExported] = useState(false)

    const [treeData, setTreeData] = useState([])
    const [selectedTreeData, setSelectedTreeData] = useState(secureLocalStorage?.getItem(treeIndex) || [])

    const [columns, setColumns] = useState([])
    const [tableData, setTableData] = useState([
        {
            id: '123',
            statusCode: '12312',
            date: '123',
            statusUser: '123222',
        },
        {
            id: 'id`1',
            statusCode: '12312',
            date: '123',
            statusUser: '123222',
        },
        {
            id: 'second',
            statusCode: '12312',
            date: '123',
            statusUser: '123222',
        },
    ])
    const [totalCount, setTotalCount] = useState([])
    const [selectedTableDataId, setSelectedTableDataId] = useState([])

    const [selectedTab, setSelectedTab] = useState(secureLocalStorage?.getItem(tabIndex) ? secureLocalStorage?.getItem(tabIndex).tab : 'request')
    const [activeIndex, setActiveIndex] = useState(secureLocalStorage?.getItem(tabIndex) ? secureLocalStorage?.getItem(tabIndex).index : 0)

    const [showViewModal, setShowViewModal] = useState(false)
    const [responseStatus, setResponseStatus] = useState(null)
    const [showResponseModal, setShowResponseModal] = useState(false)
    const [showRegisterModal, setShowRegisterModal] = useState(false)

    const [statuses, setStatuses] = useState([])
    const [dates, setDates] = useState({})
    const [statusCode, setStatusCode] = useState(null)

    const [page, setPage] = useState(secureLocalStorage?.getItem(requestTableIndex) ? secureLocalStorage?.getItem(requestTableIndex).page : 1);
    const [pageSize, setPageSize] = useState(secureLocalStorage?.getItem(requestTableIndex) ? secureLocalStorage?.getItem(requestTableIndex).pageSize : 10);
    const [search, setSearch] = useState(secureLocalStorage?.getItem(requestTableIndex) ? secureLocalStorage?.getItem(requestTableIndex).search : '');

    const [regPage, setRegPage] = useState(secureLocalStorage?.getItem(reasonTableIndex) ? secureLocalStorage?.getItem(reasonTableIndex).page : 1);
    const [regPageSize, setRegPageSize] = useState(secureLocalStorage?.getItem(reasonTableIndex) ? secureLocalStorage?.getItem(reasonTableIndex).pageSize : 10);
    const [regSearch, setRegSearch] = useState(secureLocalStorage?.getItem(reasonTableIndex) ? secureLocalStorage?.getItem(reasonTableIndex).search : '');

    const [isStatus, setIsStatus] = useState(false);
    const [isSeason, setIsSeason] = useState(false);

    const config = {
        excelExport: true,
        excelFileRemote: true,
        excelFileRemoteUrl: `/${'teacherExcuseRequestExcel'}?type=${selectedTab}&season=${selectedTreeData?.id}&menu=teacher&startDate=${dates?.startDate}&endDate=${dates?.endDate}`,
        defaultPageOptions: {
            page: selectedTab == 'request' ? page : regPage,
            sizePerPage: selectedTab == 'request' ? pageSize : regPageSize,
            search: selectedTab == 'request' ? search : regSearch,
        },
    }

    const requestColumns = [
        {
            dataField: "statusCode",
            text: '',
            align: 'center',
            formatter: (cell, row) => {
                if (cell) return (
                    <div className='br-12 d-flex align-items-center justify-content-center'
                        style={{ backgroundColor: row?.statusColor, height: 25, width: 40, }}>
                        <i className='flaticon-mail-1 fs-19' style={{ color: 'white' }} />
                    </div>
                )
            }
        },
        {
            dataField: "date",
            text: translations(locale)?.date,
            sort: true,
            formatter: (cell, row) => { return <span className='underline' onClick={() => handleContextMenuClick(row?.id, 'view')}>{cell}</span> },
        },
        {
            dataField: "className",
            text: translations(locale)?.className,
            sort: true
        },
        {
            dataField: "code",
            text: translations(locale)?.studentCode,
            sort: true,
        },
        {
            dataField: "lastName",
            text: translations(locale)?.studentLastName,
            sort: true
        },
        {
            dataField: "firstName",
            text: translations(locale)?.studentFirstName,
            sort: true
        },
        {
            dataField: "timetableCount",
            text: translations(locale)?.period,
            sort: true,
            align: 'right',
        },
        {
            dataField: "statusUser",
            text: translations(locale)?.absent?.respondedUser,
            sort: true
        },
    ]

    const registrationColumns = [
        {
            dataField: "date",
            text: translations(locale)?.date,
            sort: true,
            formatter: (cell, row) => { return <span className='underline' onClick={() => handleContextMenuClick(row?.id, 'view')}>{cell}</span> },
        },
        {
            dataField: "className",
            text: translations(locale)?.className,
            sort: true
        },
        {
            dataField: "code",
            text: translations(locale)?.studentCode,
            sort: true,
        },
        {
            dataField: "lastName",
            text: translations(locale)?.studentLastName,
            sort: true
        },
        {
            dataField: "firstName",
            text: translations(locale)?.studentFirstName,
            sort: true
        },
        {
            dataField: "hours",
            text: translations(locale)?.period,
            sort: true,
            align: 'right',
        },
    ]

    const contextMenus = [
        {
            key: 'accept',
            icon: <CheckCircleTwoToneIcon sx={{ fontSize: '2rem !important', color: '#ff5b1d' }} />,
            title: translations(locale)?.approve,
        },
        {
            key: 'decline',
            icon: <CancelTwoToneIcon sx={{ fontSize: '2rem !important', color: '#ff5b1d' }} />,
            title: translations(locale)?.decline,
        },
        {
            key: 'view',
            icon: <PreviewTwoToneIcon sx={{ fontSize: '2rem !important', color: '#ff5b1d' }} />,
            title: translations(locale)?.view,
        },
    ]

    // useEffect(() => {
    //     setLoading(true)
    //     if (selectedTab == 'request') {
    //         fetchRequest(teacherExcuseRequestInit, 'POST', {
    //             season: selectedTreeData?.id,
    //             menu: 'teacher',
    //             ...dates,
    //             page: page,
    //             pageSize: pageSize,
    //             search: search,
    //             code: statusCode,
    //         })
    //             .then((res) => {
    //                 if (res.success) {
    //                     const { requests, seasons, seasonId, statuses, totalCount } = res.data
    //                     if (!isStatus || isSeason) {
    //                         setStatuses(statuses || [])
    //                         setIsStatus(true)
    //                         setIsSeason(false)
    //                     }

    //                     setPdfExported(res?.data?.pdfExported || false)
    //                     setTreeData(seasons || [])
    //                     setTableData(requests || [])
    //                     setTotalCount(totalCount || [])
    //                     if (!selectedTreeData?.id) {
    //                         const season = seasons?.find(el => el?.id == seasonId)
    //                         setSelectedTreeData({ id: season?.id, isCurrent: season?.isCurrent })
    //                     }
    //                 } else {
    //                     message(res.data.message)
    //                 }
    //                 setLoading(false)
    //             })
    //             .catch(() => {
    //                 message(translations(locale)?.err?.error_occurred)
    //                 setLoading(false)
    //             })
    //     } else {
    //         fetchRequest(teacherExcuseReasonInit, 'POST', {
    //             season: selectedTreeData?.id,
    //             menu: 'teacher',
    //             code: statusCode,
    //             page: regPage,
    //             pageSize: regPageSize,
    //             search: regSearch,
    //         })
    //             .then((res) => {
    //                 if (res.success) {
    //                     const { requests, seasons, seasonId, totalCount } = res.data
    //                     setPdfExported(res?.data?.pdfExported || false)
    //                     setTableData(requests || [])
    //                     setTreeData(seasons || [])
    //                     setTableData(requests || [])
    //                     setTotalCount(totalCount || [])
    //                 } else {
    //                     message(res.data.message)
    //                 }
    //                 setLoading(false)
    //             })
    //             .catch(() => {
    //                 message(translations(locale)?.err?.error_occurred)
    //                 setLoading(false)
    //             })
    //     }
    // }, [selectedTab, selectedTreeData, dates, page, pageSize, search, regPage, regPageSize, regSearch])

    useEffect(() => {
        if (selectedTab == 'request') {
            tableData?.forEach(el => el.contextMenuKeys = !selectedTreeData?.isCurrent ? 'view' : (!el?.statusCode ? 'accept, decline' : 'view'))
            setColumns(requestColumns || [])
        } else {
            tableData?.forEach(el => el.contextMenuKeys = 'view')
            setColumns(registrationColumns || [])
        }
    }, [tableData])

    const handleRegister = params => {

        console.log('handleRegister')
        // setLoading(true)
        // fetchRequest(teacherExcuseReasonSubmit, 'POST', {
        //     ...params,
        //     submit: 1,
        //     menu: 'teacher'
        // })
        //     .then((res) => {
        //         if (res.success) {
        //             message(res.data.message, res.success)
        //             const { requests } = res.data
        //             setTableData(requests || [])
        //             closeModal()
        //         } else {
        //             message(res.data.message)
        //         }
        //         setLoading(false)
        //     })
        //     .catch(() => {
        //         message(translations(locale)?.err?.error_occurred)
        //         setLoading(false)
        //     })
    }

    const handleResponse = response => {

        console.log('handleResponse')

        // setLoading(true)
        // setStatusCode(null)
        // fetchRequest(teacherExcuseRequestSubmit, 'POST', {
        //     ...response,
        //     request: selectedTableDataId,
        //     season: selectedTreeData?.id,
        //     menu: 'teacher',
        //     ...dates
        // })
        //     .then((res) => {
        //         if (res.success) {
        //             message(res.data.message, res.success)
        //             const { requests } = res.data
        //             setTableData(requests || [])
        //             closeModal()
        //         } else {
        //             message(res.data.message)
        //         }
        //         setLoading(false)
        //     })
        //     .catch(() => {
        //         message(translations(locale)?.err?.error_occurred)
        //         setLoading(false)
        //     })
    }

    const handleDateChange = (name, value) => {
        setDates({ ...dates, [name]: value })
    }

    const handleContextMenuClick = (id, key) => {
        if (id && key) {
            setSelectedTableDataId(id)
            if (key === 'view') {
                setShowViewModal(true)
            } else if (key === 'accept') {
                if (pdfExported) {
                    message(translations(locale)?.class?.journalDownloadedDescription)
                } else {
                    setResponseStatus('accepted')
                    setShowResponseModal(true)
                }
            } else if (key === 'decline') {
                if (pdfExported) {
                    message(translations(locale)?.class?.journalDownloadedDescription)
                } else {
                    setResponseStatus('denied')
                    setShowResponseModal(true)
                }
            }
        }
    }

    const closeModal = () => {
        setResponseStatus(null)
        setShowViewModal(false)
        setShowResponseModal(false)
        setShowRegisterModal(false)
        setSelectedTableDataId(null)
    }

    const handleTreeChange = node => {
        setIsSeason(true);

        let object = {};

        if (selectedTab == 'request') {
            setPage(1);

            object = {
                page: 1,
                pageSize: pageSize,
                search: search
            }

            secureLocalStorage?.setItem(requestTableIndex, object);
        } else if (selectedTab == 'registration') {
            setRegPage(1);

            object = {
                page: 1,
                pageSize: regPageSize,
                search: regSearch
            }

            secureLocalStorage?.setItem(reasonTableIndex, object);
        }

        setSelectedTreeData({ isCurrent: node?.isCurrent, id: node?.key });
        secureLocalStorage?.setItem(treeIndex, { isCurrent: node?.isCurrent, id: node?.key });
    }

    const onReportClick = (code) => {

        console.log('onReportClick')
        setStatusCode(code)
        // setLoading(true)
        // fetchRequest(teacherExcuseRequestInit, 'POST', {
        //     season: selectedTreeData?.id,
        //     menu: 'teacher',
        //     ...dates,
        //     code: code,
        //     page: 1,
        //     pageSize: pageSize,
        //     search: search,
        // })
        //     .then((res) => {
        //         if (res.success) {
        //             const { requests, seasons, seasonId, totalCount } = res.data
        //             setTreeData(seasons || [])
        //             setTableData(requests || [])
        //             setTotalCount(totalCount || [])
        //             setPage(1)
        //             if (!selectedTreeData?.id) {
        //                 const season = seasons?.find(el => el?.id == seasonId)
        //                 setSelectedTreeData({ id: season?.id, isCurrent: season?.isCurrent })
        //             }
        //         } else {
        //             message(res.data.message)
        //         }
        //         setLoading(false)
        //     })
        //     .catch(() => {
        //         message(translations(locale)?.err?.error_occurred)
        //         setLoading(false)
        //     })
    }

    const onTabChange = (data) => {
        let tabData = {
            index: String(data?.activeIndex),
            tab: data?.panes[data?.activeIndex]?.code
        }

        setSelectedTab(data?.panes[data?.activeIndex]?.code);
        setActiveIndex(data?.activeIndex);

        setSearch('');
        setRegSearch('');

        secureLocalStorage?.setItem(tabIndex, tabData);
    }

    const onUserInteraction = (object) => {
        if (selectedTab == 'request') {
            setPage(object.page);
            setPageSize(object.pageSize);
            setSearch(object.search);

            secureLocalStorage?.setItem(requestTableIndex, object);
        } else if (selectedTab == 'registration') {
            setRegPage(object.page);
            setRegPageSize(object.pageSize);
            setRegSearch(object.search);

            secureLocalStorage?.setItem(reasonTableIndex, object);
        }
    };

    return (
        <div className="m-grid__item m-grid__item--fluid m-wrapper">
            {/* <SubHeader
                locale={locale}
                title={translations(locale)?.absent?.registration}
            /> */}
            <HtmlHead title={title} description={description} />

            <div className="page-title-container mb-2">
                <Col md="7" className='p-0'>
                    <h1 className="mb-0 pb-0 display-4 relative">{title}</h1>
                    <BreadcrumbList items={breadcrumbs} />
                </Col>
            </div>

            <div className="m-content">
                <Row className=''>
                    <Col xl="2" xxl="2">
                        <div className="m-portlet">
                            <div className="m-portlet__body">
                                <TreeView
                                    defaultExpandAll
                                    treeData={treeData}
                                    selectedNodes={[selectedTreeData?.id]}
                                    onSelect={(params, info) => handleTreeChange(info?.node)}
                                />
                            </div>
                        </div>
                    </Col>
                    <Col xl="10" xxl="10">
                        {
                            selectedTab == 'registration' && 
                            // selectedTreeData?.isCurrent &&
                            <button
                                className="btn btn-sm m-btn--pill btn-info m-btn--uppercase d-inline-flex mb-3"
                                disabled={pdfExported}
                                onClick={() => setShowRegisterModal(true)}
                            >
                                <AddCircleOutlineRoundedIcon />
                                <span className='ml-2'>{translations(locale)?.absent?.register}</span>
                            </button>
                        }
                        <div className="m-portlet tab">
                            <Tab
                                activeIndex={activeIndex}
                                renderActiveOnly
                                menu={{ secondary: true, pointing: true, className: 'primaryColor m-0 h-4' }}
                                onTabChange={(e, data) => onTabChange(data)}
                                className='m-portlet-header'
                                // onTabChange={(e, data) => setSelectedTab(data?.panes[data?.activeIndex]?.code)}
                                panes={[
                                    {
                                        code: 'request',
                                        menuItem: translations(locale)?.absent?.request,
                                    },
                                    {
                                        code: 'registration',
                                        menuItem: translations(locale)?.absent?.registration,
                                    },
                                ]}
                            />
                            <div className='m-portlet__body'>
                                {
                                    selectedTab == 'request' &&
                                    <Container fluid>
                                        <Row className='d-flex gap-05'>
                                            {
                                                statuses?.map((el, key) =>
                                                    <Col key={key} onClick={() => onReportClick(el.code)} className='br-06 p-3 text-white d-flex flex-column' style={{ backgroundColor: el?.color }}>
                                                        <span className='fs-12' style={{ fontFamily: 'MulishMedium' }}>{el?.name}</span>
                                                        <span className='text-right fs-25' style={{ fontFamily: 'MulishBlack' }}>{el?.count}</span>
                                                    </Col>
                                                )
                                            }
                                        </Row>
                                    </Container>
                                }
                                {
                                    selectedTab == 'request' &&
                                    <div className='d-flex justify-content-center'>
                                        <div className='w-50 position-relative' style={{ left: -55 }}>
                                            <Row className='position-absolute' style={{ top: 16 }}>
                                                <Col sm={4} className='col-form-label text-md-right label-pinnacle-bold'>
                                                    {translations(locale)?.absent?.requestDate}
                                                </Col>
                                                <Col>
                                                    <Row>
                                                        <Col className='pr-0'>
                                                            <DayPickerInput
                                                                value={dates?.startDate}
                                                                inputProps={{ className: 'form-control h-100' }}
                                                                placeholder={translations(locale)?.datePickerPlaceholder}
                                                                onDayChange={(day, modifier, input) => handleDateChange('startDate', input?.state?.value)}
                                                                classNames={{ overlay: 'DayPickerInputOverlay', container: 'position-relative h-100' }}
                                                                dayPickerProps={{
                                                                    firstDayOfWeek: 1,
                                                                    disabledDays: { after: new Date(dates?.endDate) },
                                                                }}
                                                            />
                                                        </Col>
                                                        <div className="pickerSeparator">
                                                            <i className="la la-ellipsis-h" />
                                                        </div>
                                                        <Col className='pl-0'>
                                                            <DayPickerInput
                                                                value={dates?.endDate}
                                                                inputProps={{ className: 'form-control h-100' }}
                                                                placeholder={translations(locale)?.datePickerPlaceholder}
                                                                onDayChange={(day, modifier, input) => handleDateChange('endDate', input?.state?.value)}
                                                                classNames={{ overlay: 'DayPickerInputOverlay', container: 'position-relative h-100' }}
                                                                dayPickerProps={{
                                                                    firstDayOfWeek: 1,
                                                                    disabledDays: { before: new Date(dates?.startDate) },
                                                                }}
                                                            />
                                                        </Col>
                                                    </Row>
                                                </Col>
                                            </Row>
                                        </div>
                                    </div>
                                }
                                <DTable
                                    remote
                                    locale={locale}
                                    config={config}
                                    data={tableData}
                                    columns={columns}
                                    // individualContextMenus
                                    clickContextMenu
                                    contextMenus={contextMenus}
                                    onContextMenuItemClick={handleContextMenuClick}
                                    onInteraction={onUserInteraction}
                                    totalDataSize={totalCount}
                                />
                            </div>
                        </div>
                    </Col>
                </Row>
            </div>
            {
                loading &&
                <>
                    <div className="blockUI blockOverlay" />
                    <div className="blockUI blockMsg blockPage">
                        <div className="m-loader m-loader--brand m-loader--lg" />
                    </div>
                </>
            }
            {
                showRegisterModal &&
                <RegisterModal
                    onClose={closeModal}
                    onSubmit={handleRegister}
                />
            }
            {
                showViewModal && selectedTableDataId &&
                <ViewModal
                    type={selectedTab}
                    onClose={closeModal}
                    id={selectedTableDataId}
                />
            }
            {
                showResponseModal && selectedTableDataId && responseStatus &&
                <ResponseModal
                    onClose={closeModal}
                    status={responseStatus}
                    id={selectedTableDataId}
                    onSubmit={handleResponse}
                />
            }
        </div>
    )
}

export default index