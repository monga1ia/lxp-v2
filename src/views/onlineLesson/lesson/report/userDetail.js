import React, { useEffect, useState, useMemo } from "react";
import { useHistory, useLocation } from "react-router-dom";
import HtmlHead from "components/html-head/HtmlHead";
import { useSelector } from "react-redux";
import { Button, Modal, Col, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import DTable from "modules/DataTable/DTable";
import CheckIcon from "cs-line-icons/custom/CheckIcon";

import { fetchRequest } from "utils/fetchRequest";
import { queryUrl, getAdminUrl, secondsToHms } from 'utils/utils'
import { courseReportUser, courseReportUserOpen } from 'utils/fetchRequest/Urls';
import showMessage from "modules/message";

const userDetail = () => {

    const location = useLocation();
    const { t } = useTranslation();
    const { i18n } = useTranslation();
    const history = useHistory();
    const urlParams = queryUrl(location?.search);
    const { eToken } = useSelector(state => state.auth);
    const { selectedSchool } = useSelector(state => state.schoolData);

    const [id] = useState(location?.state?.id || null)
    const [userId] = useState(location?.state?.user || null)
    const [title] = useState(location?.state?.title || '')

    const [loading, setLoading] = useState(false)

    const [userObj, setUserObj] = useState(null)

    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [tableData, setTableData] = useState([])
    const [statuses, setStatuses] = useState([])
    const [isManualOpen, setIsManualOpen] = useState(false)

    const description = "";

    const init = (params) => {
        setLoading(true)
        fetchRequest(courseReportUser, 'POST', params)
            .then((res) => {
                if (res.success) {
                    setIsManualOpen(res?.isManualOpen || false)
                    setUserObj(res?.user || {})
                    setTableData(res?.details || [])
                    setStatuses(res?.statuses || [])
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

    const userOpen = (params) => {
        setLoading(true)
        fetchRequest(courseReportUserOpen, 'POST', params)
            .then((res) => {
                if (res.success) {
                    setTableData(res?.syllabuses || [])
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
            user: userId
        })
    }, [id, userId])

    const config = {
        showPagination: true,
        showFilter: true,
        showAllData: false,
        excelExport: true,
        excelFileName: title || '',
        defaultPageOptions: {
            page: page,
            sizePerPage: pageSize
        }
    };

    const detailConfig = {
        showPagination: false,
        showFilter: false,
        excelExport: false,
        showAllData: true
    }

    const columns = [
        {
            dataField: "statusName",
            text: t("common.status"),
            sort: false,
            style: {
                textAlign: 'center'
            },
            formatter: (cell, row) => {
                const selectedStatus = statuses.find(obj => obj?.code === row?.statusCode)
                return <div style={{
                    width: 120
                }}>
                    <span style={{ color: 'white', backgroundColor: selectedStatus?.color, borderRadius: 5, padding: 5 }}>{selectedStatus?.name || ''}</span>
                </div>
            }
        },
        {
            dataField: "parentTopicName",
            text: t("curriculum.unitSubject"),
            sort: true,
        },
        {
            dataField: "topicName",
            text: t("school.regularSubject"),
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
        },
        {
            dataField: "totalDuration",
            text: t("onlineLesson.totalUsageTime"),
            sort: true,
            colType: 'html',
            textValueKey: 'totalDurationFormat',
            formatter: (cell) => cell && cell > 0 ? secondsToHms(cell) : '-'
        },
        {
            dataField: "performance",
            text: t("common.performance"),
            sort: true,
        },
        {
            dataField: "",
            text: "",
            sort: false,
            formatter: (cell, row) => {
                return row?.statusCode === 'PENDING' ? <button className="btn btn-outline-info"
                    onClick={() => {
                        if (isManualOpen) {
                            userOpen({
                                school: selectedSchool?.id,
                                course: id,
                                user: userId
                            })
                        }
                    }}
                >
                    {t("onlineExam.reopen")}
                </button> : null
            }
        }
    ];

    const detailColumns = [
        {
            dataField: "statusName",
            text: t("common.status"),
            sort: false,
            style: {
                textAlign: 'center'
            },
            formatter: (cell, row) => {
                const selectedStatus = statuses.find(obj => obj?.code === row?.statusCode)
                return <div style={{
                    width: 120
                }}>
                    <span style={{ color: 'white', backgroundColor: selectedStatus?.color, borderRadius: 5, padding: 5 }}>{selectedStatus?.name || ''}</span>
                </div>
            }
        },
        {
            dataField: "typeName",
            text: t("question.topic"),
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
        },
        {
            dataField: "totalDuration",
            text: t("onlineLesson.totalUsageTime"),
            sort: true,
        },
        {
            dataField: "performance",
            text: t("common.performance"),
            sort: true,
        }
    ];

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
                        <Col xl="4" xxl="3">
                            <div className="card-alternate mt-2 text-center">
                                <img src={userObj?.avatar || `${getAdminUrl(window.location.host)}/main/profile?u=${userObj?.userId}&t=${eToken}`}
                                    style={{
                                        width: 100,
                                        height: 100,
                                        borderRadius: '50%'
                                    }}
                                    onError={(e) => {
                                        e.target.onError = null,
                                            e.target.src = '/img/profile/avatar.png'
                                    }}
                                />
                                <p className="mt-2 mb-0">{userObj?.className || '-'}</p>
                                <p className="mb-0">{userObj?.code || '-'}</p>
                                <p className="mb-0">{userObj?.lastName || '-'}</p>
                                <b className="mb-0">{userObj?.firstName?.toUpperCase() || '-'}</b>
                                <p className="mt-2 pinnacle-regular" style={{
                                    color: '#3EBFA3',
                                    fontSize: '1.5rem'
                                }}>{userObj?.percentage}%</p>
                                <p className="mt-2 pinnacle-regular">{userObj?.actionCount + ' | ' + userObj?.detailCount}</p>
                            </div>
                        </Col>

                        <Col xl="8" xxl="9">
                            <div className="card-alternate mt-2">
                                <DTable
                                    config={config}
                                    detailConfig={detailConfig}
                                    columns={columns}
                                    detailColumns={detailColumns}
                                    data={tableData}
                                    expandable={isManualOpen}
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

export default userDetail;
