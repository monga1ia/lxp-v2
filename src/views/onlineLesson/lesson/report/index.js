import React, { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import HtmlHead from "components/html-head/HtmlHead";
import { useSelector } from "react-redux";
import { Button, Modal, Col, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import TabComponent from "components/tab/Tab";
import DTable from "modules/DataTable/DTable";

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

import { fetchRequest } from "utils/fetchRequest";
import Checkbox from '@mui/material/Checkbox';
import { queryUrl, secondsToHms } from 'utils/utils'
import { courseReport } from 'utils/fetchRequest/Urls';
import showMessage from "modules/message";
import TreeComponent from "views/groups/components/TreeComponent";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const index = () => {

    const location = useLocation();
    const { t } = useTranslation();
    const history = useHistory();
    const urlParams = queryUrl(location?.search);
    const { selectedSchool } = useSelector(state => state.schoolData);

    const [id] = useState(urlParams?.id || null)

    const [loading, setLoading] = useState(false)

    const [title, setTitle] = useState('');
    const [courseObj, setCourseObj] = useState(null)
    const [treeData, setTreeData] = useState([])
    const [selectedTreeId, setSelectedTreeId] = useState(null)

    const [selectedTabIndex, setSelectedTabIndex] = useState(0)

    const [totalCount, setTotalCount] = useState(0)
    const [isRemoteTable, setIsRemoteTable] = useState(true)
    const [tableData, setTableData] = useState([])
    const [hasContextMenu, setHasContextMenu] = useState(false)

    const [syllabuses, setSyllabuses] = useState([])
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [search, setSearch] = useState('')

    const description = "";

    const init = (params) => {
        setLoading(true)
        fetchRequest(courseReport, 'POST', params)
            .then((res) => {
                if (res.success) {
                    if (res?.course) {
                        setCourseObj(res?.course)
                        setTitle(res?.course?.subjectName + ' | ' + res?.course?.name)
                    }
                    setIsRemoteTable(res?.isRemote)
                    setTreeData(res?.treeData)
                    setTotalCount(res?.totalCount || 0)
                    setTableData(res?.list || [])
                    setHasContextMenu(res?.contextMenu || false)

                    setSyllabuses(res?.syllabuses || [])
                    // if (params?.treeId) {
                    //     setTableData(res?.list)
                    // } else {
                    //     setExamInfo({
                    //         totalCount: res?.totalStudentCount,
                    //         studentCount: res?.detailCount
                    //     })
                    //     setTitle(res?.title)
                    //     setTreeData(res?.treeData)
                    //     setStatuses(res?.statuses)
                    //     formatDataColors(res?.chartData);
                    // }
                } else {
                    showMessage(res.message)
                }
                setLoading(false)
            })
            .catch(() => {
                showMessage(t('errorMessage.title'));
                setLoading(false)
            })
    }

    useEffect(() => {
        init({
            school: selectedSchool?.id,
            course: id
        })
        if (location?.hash) {
            const hashArray = location?.hash?.split('#')
            if (hashArray && hashArray?.length > 0) {
                setSelectedTabIndex(parseInt(hashArray[1]))
            }
        }
    }, [id])

    const onTreeChange = (treeIds = []) => {
        if (treeIds && treeIds.length > 0) {
            setSelectedTreeId(treeIds[0])
            init({
                school: selectedSchool?.id,
                course: id,
                tree: treeIds[0]
            })
        } else {
            setSelectedTreeId(null)
        }
    }

    const config = {
        showPagination: true,
        showFilter: true,
        showAllData: false,
        excelExport: true,
        excelFileName: title || '',
        defaultPageOptions: {
            page: page,
            sizePerPage: pageSize,
            search: search,
        }
    };

    const columns = [
        {
            dataField: "statusName",
            text: t("common.status"),
            sort: false,
            style: {
                textAlign: 'center'
            },
            formatter: (cell, row) => {
                return <div style={{
                    width: 120
                }}>
                    <span style={{ color: 'white', backgroundColor: row?.statusColor, borderRadius: 5, padding: 5 }}>{cell}</span>
                </div>
            }
        },
        {
            dataField: "className",
            text: t("menu.group"),
            sort: true,
        },
        {
            dataField: "code",
            text: t("menu.studentCode"),
            sort: true,
        },
        {
            dataField: "lastName",
            text: t("person.lastName"),
            sort: true,
        },
        {
            dataField: "firstName",
            text: t("person.firstName"),
            sort: true,
            formatter: (cell, row) => {
                return <div
                    style={{
                        color: "#4037D7",
                        textDecorationLine: "underline",
                        cursor: "pointer",
                    }}
                    onClick={() => {
                        if (row?.userId) {
                            history.push({
                                pathname: '/onlineLesson/report-user',
                                state: {
                                    id,
                                    title,
                                    user: row?.userId
                                }
                            })
                        } else {
                            showMessage(t("student.userNotFound"))
                        }                        
                    }}
                >
                    {cell}
                </div>
            }
        },
        {
            dataField: "minDate",
            text: t("common.startedDate"),
            sort: true,
        },
        {
            dataField: "endDate",
            text: t("common.endedDate"),
            sort: true,
        },
        {
            dataField: "maxDate",
            text: t("onlineLesson.lastViewDate"),
            sort: true,
        },
        {
            dataField: "totalDuration",
            text: t("onlineLesson.totalUsageTime"),
            sort: true,
            colType: 'html',
            textValueKey: 'totalDurationFormat',
            formatter: (cell) => cell ? secondsToHms(cell) : '-'
        },
    ];

    const syllabusColumns = [
        {
            dataField: "topicName",
            text: t("teacher.topic"),
            sort: false
        },
        {
            dataField: "typeName",
            text: t("onlineLesson.content"),
            sort: false,
            formatter: (cell, row) => {
                return <div
                    style={{
                        color: "#4037D7",
                        textDecorationLine: "underline",
                        cursor: "pointer",
                    }}
                    onClick={() => {
                        history.push({
                            pathname: '/onlineLesson/report-syllabus',
                            state: {
                                id,
                                title,
                                syllabusDtl: row?.id
                            }
                        })
                    }}
                >
                    {cell}
                </div>
            }
        },
        {
            dataField: "mustViewCount",
            text: t("onlineLesson.mustViewCount"),
            sort: false,
            style: {
                textAlign: "right",
            },
        },
        {
            dataField: "viewCount",
            text: t("onlineLesson.viewCount"),
            sort: true,
            formatter: (cell, row) => {
                return <span style={{
                    color: "#4037D7",
                    textDecorationLine: "underline",
                    cursor: "pointer",
                }} onClick={() => {
                    history.push({
                        pathname: '/onlineLesson/report-syllabus',
                        state: {
                            id,
                            title,
                            type: 'END',
                            syllabusDtl: row?.id
                        }
                    })
                }}>{cell} | {row?.viewPercentage}%</span>
            }
        },
        {
            dataField: "inProgressCount",
            text: t("onlineLesson.inProgressCount"),
            sort: true,
            formatter: (cell, row) => {
                return <span style={{
                    color: "#4037D7",
                    textDecorationLine: "underline",
                    cursor: "pointer",
                }} onClick={() => {
                    history.push({
                        pathname: '/onlineLesson/report-syllabus',
                        state: {
                            id,
                            title,
                            type: 'IN_PROGRESS',
                            syllabusDtl: row?.id
                        }
                    })
                }}>{cell} | {row?.inProgressPercentage}%</span>
            }
        },
        {
            dataField: "notViewCount",
            text: t("onlineLesson.notViewedCount"),
            sort: true,
            formatter: (cell, row) => {
                return <span style={{
                    color: "#4037D7",
                    textDecorationLine: "underline",
                    cursor: "pointer",
                }} onClick={() => {
                    history.push({
                        pathname: '/onlineLesson/report-syllabus',
                        state: {
                            id,
                            title,
                            type: 'ACTIVE',
                            syllabusDtl: row?.id
                        }
                    })
                }}>{cell} | {row?.notViewPercentage}%</span>
            }
        },
        {
            dataField: "totalViewCount",
            text: t("onlineLesson.totalViewCount"),
            sort: true,
            style: {
                textAlign: "right",
            },
        },
        {
            dataField: "totalDuration",
            text: t("onlineLesson.totalUsageTime"),
            sort: true,
            colType: 'html',
            textValueKey: 'totalDurationFormat',
            formatter: (cell) => cell ? secondsToHms(cell) : '-'
        }
    ];

    const onInteraction = (params) => {
        if (selectedTabIndex === 0) {

            const pageParams = params;
            if (params?.search?.length > 0) {
                pageParams.page = 1;
                setPage(1)
            } else {
                setPage(params?.page)
            }
            setPageSize(params?.pageSize)
            setSearch(params?.search || '')

            init(Object.assign({
                school: selectedSchool?.id,
                course: id,
                tree: selectedTreeId
            }, pageParams))
        } else {
            //
        }
    }

    const renderTabs = () => {
        return [
            {
                value: 'student',
                title: t('analysis.byStudent'),
                children: <div className="card-alternate mt-2">
                    <DTable
                        remote={isRemoteTable}
                        config={config}
                        columns={columns}
                        data={tableData}
                        clickContextMenu={hasContextMenu}
                        totalDataSize={totalCount}
                        onInteraction={onInteraction}
                        currentPage={page}
                    />
                </div>
            },
            {
                value: 'content',
                title: t('analysis.byContent'),
                children: <div className="card-alternate mt-2">
                    <DTable
                        config={config}
                        columns={syllabusColumns}
                        data={syllabuses}
                        totalDataSize={syllabuses?.length}
                    />
                </div>
            }
        ]
    }


    return (
        <>
            <HtmlHead title={title} description={description} />

            <div className="screen-padding">
                <div className="layoutless-page">
                    <div className="header">
                        <span>{title}</span>
                        <span
                            className="cursor-pointer back-button"
                            onClick={() => {
                                history.replace({
                                    pathname: "/onlineLesson/lesson"
                                })
                            }}
                        >
                            {t("analysis.goBack")}
                        </span>
                    </div>

                    <Row className="p-5">
                        <Col xl="4" xxl="3">
                            <div className="card-alternate">
                                {
                                    treeData && treeData?.length > 0 && <TreeComponent selectedNodes={[selectedTreeId]} data={treeData} onChange={onTreeChange} />
                                }
                            </div>
                        </Col>

                        <Col xl="8" xxl="9">
                            <h2 className="small-title">{t("onlineLesson.progressTitle")}</h2>

                            <div className="card-alternate mt-2 mb-4" style={{ padding: "38px", height: 300 }}>
                                {
                                    courseObj && courseObj?.statuses && <Bar
                                        options={{
                                            indexAxis: 'y',
                                            elements: {
                                                bar: {
                                                    borderWidth: 2,
                                                },
                                            },
                                            responsive: true,
                                            maintainAspectRatio: false,
                                            plugins: {
                                                legend: {
                                                    display: false
                                                },
                                                title: {
                                                    display: false
                                                },
                                                tooltip: {
                                                    titleFont: {
                                                        family: 'Mulish'
                                                    },
                                                    bodyFont: {
                                                        family: 'Mulish'
                                                    }
                                                }
                                            },
                                            scales: {
                                                x: {
                                                    beginAtZero: true,
                                                    min: 0,
                                                    max: 100,
                                                    ticks: {
                                                        stepSize: 5,
                                                        font: {
                                                            family: 'Mulish',
                                                            color: '#f00',
                                                            size: 9
                                                        }
                                                    }
                                                },
                                                y: {
                                                    ticks: {
                                                        color: '#000',
                                                        font: {
                                                            family: 'Mulish',
                                                            size: 11
                                                        }
                                                    }
                                                }
                                            }
                                        }}
                                        data={{
                                            labels: courseObj?.statuses?.map(obj => obj?.name),
                                            datasets: [
                                                {
                                                    label: t("onlineLesson.userCount"),
                                                    data: courseObj?.statuses?.map(obj => obj?.count),
                                                    borderColor: 'transparent',
                                                    backgroundColor: courseObj?.statuses?.map(obj => obj?.color) //'rgba(255, 99, 132, 0.5)',
                                                }
                                            ],
                                        }} />
                                }
                            </div>

                            {
                                courseObj && <TabComponent
                                    borderColor='#FF5B1D'
                                    indicatorColor='#FF5B1D'
                                    selectedTabIndex={selectedTabIndex}
                                    onChange={(tabIndex) => {
                                        setSelectedTabIndex(tabIndex)
                                        history.replace("?id=" + id + "#" + tabIndex)
                                    }}
                                    tabs={renderTabs()}
                                />
                            }
                        </Col>
                    </Row>
                </div>

                {
                    loading &&
                    <>
                        <div className='loader-container'>
                            <svg className="splash-spinner" viewBox="0 0 50 50">
                                <circle className="path" cx="25" cy="25" r="20" fill="none" strokeWidth="5" />
                            </svg>
                        </div>
                    </>
                }
            </div>
        </>
    );
};

export default index;
