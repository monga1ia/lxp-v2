import React, { useEffect, useState, useMemo } from "react";
import { useHistory, useLocation } from "react-router-dom";
import HtmlHead from "components/html-head/HtmlHead";
import { useSelector } from "react-redux";
import { Button, Modal, Col, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import TabComponent from "components/tab/Tab";
import DTable from "modules/DataTable/DTable";
import CheckIcon from "cs-line-icons/custom/CheckIcon";

import { fetchRequest } from "utils/fetchRequest";
import Checkbox from '@mui/material/Checkbox';
import { queryUrl, secondsToHms } from 'utils/utils'
import { courseReportSyllabus, courseReportUserOpen } from 'utils/fetchRequest/Urls';
import showMessage from "modules/message";
import TreeComponent from "views/groups/components/TreeComponent";

const syllabusDetail = () => {

    const location = useLocation();
    const { t } = useTranslation();
    const history = useHistory();
    const { i18n } = useTranslation();
    const urlParams = queryUrl(location?.search);
    const { selectedSchool } = useSelector(state => state.schoolData);

    const [id] = useState(location?.state?.id || null)
    const [syllabusDtlId] = useState(location?.state?.syllabusDtl || null)
    const [title] = useState(location?.state?.title || '')
    const [tabType, setTabType] = useState(location?.state?.type || 'END')

    const [loading, setLoading] = useState(false)
    const [syllabusObj, setSyllabusObj] = useState(null)

    const [selectedTabIndex, setSelectedTabIndex] = useState(0)

    const [totalCount, setTotalCount] = useState(0)
    const [tableData, setTableData] = useState([])
    const [isManualOpen, setIsManualOpen] = useState(false)
    const [hasContextMenu, setHasContextMenu] = useState(false)

    const [syllabuses, setSyllabuses] = useState([])

    const description = "";

    const contextMenus = useMemo(() => {
        return [
            {
                key: "openChapter",
                icon: <CheckIcon />,
                title: t('onlineLesson.openNextChapter'),
            }
        ]
    }, [i18n.language])

    const init = (params) => {
        setLoading(true)
        fetchRequest(courseReportSyllabus, 'POST', params)
            .then((res) => {
                if (res.success) {
                    setSyllabusObj(res?.syllabusDtl)
                    setTableData(res?.list || [])
                    setIsManualOpen(res?.isManualOpen || false)
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
            course: id,
            syllabusDtl: syllabusDtlId,
            type: tabType
        })
    }, [id, syllabusDtlId])

    useEffect(() => {
        switch (tabType) {
            case 'END':
                setSelectedTabIndex(0)
                break;
            case 'IN_PROGRESS':
                setSelectedTabIndex(1)
                break;
            case 'ACTIVE':
                setSelectedTabIndex(2)
                break;
            default:
                setSelectedTabIndex(0)
                break;
        }
        init({
            school: selectedSchool?.id,
            course: id,
            syllabusDtl: syllabusDtlId,
            type: tabType
        })
    }, [tabType])

    const userOpen = (params) => {
        setLoading(true)
        fetchRequest(courseReportUserOpen, 'POST', params)
            .then((res) => {
                if (res.success) {
                    const clone = [...tableData];
                    for (let c = 0; c < clone.length; c++) {
                        if (clone[c].userId === params?.user) {
                            clone[c].contextMenuKeys = '';
                            break;
                        }
                    }
                    setTableData(clone)
                    showMessage(res.message, true)
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

    const config = {
        showPagination: true,
        showFilter: true,
        showAllData: false,
        excelExport: true,
        excelFileName: title || ''
    };

    const getColumns = (tabCode = null) => {
        if (!tabCode) {
            tabCode = 'END'
        }
        switch (tabCode) {
            case 'END':
                if (syllabusObj?.componentTypeCode === 'ACTIVE_QUESTION'
                    || syllabusObj?.componentTypeCode === 'VIDEO') {
                    return [
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
                            dataField: "startDate",
                            text: t("common.startedDate"),
                            sort: true,
                        },
                        {
                            dataField: "endDate",
                            text: t("common.endedDate"),
                            sort: true,
                        },
                        {
                            dataField: "lastViewDate",
                            text: t("onlineLesson.lastViewDate"),
                            sort: true,
                        },
                        {
                            dataField: "viewCount",
                            text: t("onlineLesson.totalViewCount"),
                            sort: true,
                            style: {
                                textAlign: 'right'
                            }
                        },
                        {
                            dataField: "diff",
                            text: t("onlineLesson.totalUsageTime"),
                            sort: true,
                            formatter: (cell) => <span>{cell && cell > 0 ? secondsToHms(cell) : '-'}</span>
                        },
                        {
                            dataField: "performance",
                            text: t("common.performance"),
                            sort: true,
                            formatter: (cell) => cell ? (cell + '%') : '-'
                        }
                    ]
                } else {
                    return [
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
                            dataField: "startDate",
                            text: t("common.startedDate"),
                            sort: true,
                        },
                        {
                            dataField: "endDate",
                            text: t("common.endedDate"),
                            sort: true,
                        },
                        {
                            dataField: "viewCount",
                            text: t("onlineLesson.totalViewCount"),
                            sort: true,
                            style: {
                                textAlign: 'right'
                            }
                        },
                        {
                            dataField: "diff",
                            text: t("onlineLesson.totalUsageTime"),
                            sort: true,
                            formatter: (cell) => <span>{cell && cell > 0 ? secondsToHms(cell) : '-'}</span>
                        },
                        {
                            dataField: "performance",
                            text: t("common.performance"),
                            sort: true,
                            formatter: (cell) => cell ? (cell + '%') : '-'
                        }
                    ]
                }
            case 'IN_PROGRESS':
                return [
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
                        dataField: "startDate",
                        text: t("common.startedDate"),
                        sort: true,
                    }
                ]
            case 'ACTIVE':
                return [
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
                                    if (row.userId) {
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
                    }
                ]
        }
    }


    const onContextMenuItemClick = (rowId, key, row) => {
        if (key === "openChapter") {
            if (isManualOpen) {
                userOpen({
                    school: selectedSchool?.id,
                    course: id,
                    user: row?.userId
                })
            }
        }
    }

    const renderTabs = () => {
        return [
            {
                value: 'END',
                title: t('onlineLesson.status.ended'),
                children: <div>
                    <DTable
                        config={config}
                        columns={getColumns('END')}
                        data={tableData}
                        individualContextMenus
                        contextMenus={contextMenus}
                        onContextMenuItemClick={onContextMenuItemClick}
                    />
                </div>
            },
            {
                value: 'IN_PROGRESS',
                title: t('onlineLesson.status.inProgress'),
                children: <div>
                    <DTable
                        config={config}
                        columns={getColumns('IN_PROGRESS')}
                        data={tableData}
                    />
                </div>
            },
            {
                value: 'ACTIVE',
                title: t('onlineLesson.status.active'),
                children: <div>
                    <DTable
                        config={config}
                        columns={getColumns('ACTIVE')}
                        data={tableData}
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
                                history.goBack()
                            }}
                        >
                            {t("analysis.goBack")}
                        </span>
                    </div>

                    <Row className="p-5">
                        <Col>
                            <div className="card-alternate mt-2">
                                {
                                    syllabusObj?.title && <div className="text-semi-large text-dark ml-2" dangerouslySetInnerHTML={{ __html: syllabusObj?.title }} />
                                }
                                <div className='d-flex flex-row p-2 w-100'>
                                    {
                                        syllabusObj?.isTraditionDescription
                                            ?
                                            <div className='text-semi-large text-dark ml-2 tradition-text' dangerouslySetInnerHTML={{ __html: syllabusObj?.description }} style={{ height: 'auto' }} />
                                            :
                                            <div dangerouslySetInnerHTML={{ __html: syllabusObj?.description }} />
                                    }
                                </div>
                                <b className="mt-2 p-2">{t('question.type')}: {syllabusObj?.componentTypeName}</b>
                            </div>

                            <div className="card-alternate mt-2">
                                <TabComponent
                                    borderColor='#FF5B1D'
                                    indicatorColor='#FF5B1D'
                                    selectedTabIndex={selectedTabIndex}
                                    onChange={(tabIndex) => {
                                        setSelectedTabIndex(tabIndex)
                                        if (tabIndex === 0) {
                                            setTabType('END')
                                            const state = { ...history.location.state };
                                            state.type = 'END'
                                            history.replace({ ...history.location, state });
                                        } else if (tabIndex === 1) {
                                            setTabType('IN_PROGRESS')
                                            const state = { ...history.location.state };
                                            state.type = 'IN_PROGERSS'
                                            history.replace({ ...history.location, state });
                                        } else {
                                            setTabType('ACTIVE')
                                            const state = { ...history.location.state };
                                            state.type = 'ACTIVE'
                                            history.replace({ ...history.location, state });
                                        }
                                        // history.replace("#" + tabIndex)
                                    }}
                                    tabs={renderTabs()}
                                />
                            </div>
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

export default syllabusDetail;
