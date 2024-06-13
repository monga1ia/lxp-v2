import React, { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import HtmlHead from "components/html-head/HtmlHead";
import { useSelector } from "react-redux";
import { Button, Modal, Col, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { fetchRequest } from "utils/fetchRequest";
import Checkbox from '@mui/material/Checkbox';
import { queryUrl } from 'utils/utils'
import { examReport, examCalculateResult, examReopen } from 'utils/fetchRequest/Urls';
import showMessage from "modules/message";
import TreeComponent from "views/groups/components/TreeComponent";
import CircularGraph from "./components/CircularGraph";
import QuizProgress from "./components/QuizProgress";
import QuizReportTable from "./components/QuizReportTable";

const QuizReport = () => {

  const location = useLocation();
  const { t } = useTranslation();
  const history = useHistory();
  const urlParams = queryUrl(location?.search);
  const { selectedSchool } = useSelector(state => state.schoolData);

  const [id] = useState(urlParams?.id || null)

  const [loading, setLoading] = useState(false)

  const [title, setTitle] = useState('');
  const [examInfo, setExamInfo] = useState(null)
  const [treeData, setTreeData] = useState([])
  const [selectedTreeId, setSelectedTreeId] = useState(null)
  const [statuses, setStatuses] = useState([])
  const [colors, setColors] = useState([])
  const [chartData, setChartData] = useState([])
  const [tableData, setTableData] = useState([])
  const [removePrevDetail, setRemovePrevDetail] = useState(false)

  const [showReopenModal, setShowReopenModal] = useState(false)
  const [reopenDuration, setReopenDuration] = useState('')
  const [reopenTmpDtl, setReopenTmpDtl] = useState(null)

  const description = "";


  const formatDataColors = (data = []) => {
    const colorList = [];
    for (let d = 0; d < data?.length; d++) {
      colorList.push('#' + Math.floor(Math.random() * 16777215).toString(16));
    }
    setColors(colorList)
    setChartData(data)
  }

  const init = (params) => {
    setLoading(true)
    fetchRequest(examReport, 'POST', params)
      .then((res) => {
        if (res.success) {
          if (params?.treeId) {
            setTableData(res?.list)
          } else {
            setExamInfo({
              totalCount: res?.totalStudentCount,
              studentCount: res?.detailCount
            })
            setTitle(res?.title)
            setTreeData(res?.treeData)
            setStatuses(res?.statuses)
            formatDataColors(res?.chartData);
          }
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

  const calculateResult = () => {
    const params = {
      school: selectedSchool?.id,
      treeId: selectedTreeId,
      exam: id
    }
    setLoading(true)
    fetchRequest(examCalculateResult, 'POST', params)
      .then((res) => {
        if (res.success) {
          if (params?.treeId) {
            setTableData(res?.list)
          } else {
            setTreeData(res?.treeData)
            setStatuses(res?.statuses)
            formatDataColors(res?.chartData);
          }
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

  const submitReopen = (dtl = {}, duration = '', clear = 0) => {
    const params = {
      school: selectedSchool?.id,
      examDtl: dtl?.detailId,
      duration,
      clearDtl: clear ? 1 : 0
    }
    setLoading(true)
    fetchRequest(examReopen, 'POST', params)
      .then((res) => {
        if (res.success) {
          const newRows = [];
          for (let r = 0; r < tableData?.length; r++) {
            let rowObj = tableData[r]
            if (tableData.detailId === res?.oldDetailId) {
              rowObj = { ...rowObj, ...res?.detailData }
            }
            newRows.push(rowObj)
          }
          setTableData(newRows)

          setReopenTmpDtl(null)
          setReopenDuration('')
          setRemovePrevDetail(false)
          setShowReopenModal(false)
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
      exam: id
    })
  }, [])

  const onTreeChange = (treeIds = []) => {
    if (treeIds && treeIds.length > 0) {
      setSelectedTreeId(treeIds[0])
      init({
        school: selectedSchool?.id,
        exam: id,
        treeId: treeIds[0]
      })
    } else {
      setSelectedTreeId(null)
    }
  }

  const onReopen = (dtl = null) => {
    setReopenTmpDtl(dtl)
    setShowReopenModal(true)
  }

  const onInteraction = (params) => {
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
                  pathname: "/online-exam/exam"
                })
              }}
            >
              {t("analysis.goBack")}
            </span>
          </div>

          <Row className="p-5">
            <Col xl="4" xxl="3">
              <h2 className="small-title">{t("analysis.exameeStudents")}</h2>

              <div className="card-alternate mt-2 d-flex flex-column align-items-center">
                <CircularGraph
                  percentage={examInfo?.totalCount > 0 ? parseFloat(100 * examInfo?.studentCount / examInfo?.totalCount)?.toFixed(2) : 0}
                  totalCount={examInfo?.totalCount}
                  studentCount={examInfo?.studentCount}
                />
              </div>

              <div className="card-alternate mt-2">
                {
                  treeData && treeData?.length > 0 && <TreeComponent selectedNodes={[selectedTreeId]} data={treeData} onChange={onTreeChange} />
                }
              </div>
            </Col>

            <Col xl="8" xxl="9">
              <h2 className="small-title">{t("analysis.examProgress")}</h2>

              <div className="card-alternate mt-2" style={{padding: "38px"}}>
                <QuizProgress data={chartData} colors={colors} statuses={statuses} />
              </div>
              <Button
                className='save-button secondary mt-3'
                variant='empty'
                onClick={calculateResult}
              >
                <span style={{ color: '#555555' }}>{t("onlineExam.calculateResult")}</span>
              </Button>
              <QuizReportTable list={tableData} onReopen={onReopen} onInteraction={onInteraction}/>
            </Col>
          </Row>
        </div>

        {
          showReopenModal && <Modal
            show={showReopenModal}
            onHide={() => {
              setReopenTmpDtl(null)
              setReopenDuration('')
              setRemovePrevDetail(false)
              setShowReopenModal(false)
            }}
            size="xl"
            aria-labelledby="contained-modal-title-vcenter"
            centered
          >
            <Modal.Header className="p-3">
              <Modal.Title className="modal-title d-flex flex-row justify-content-between w-100" style={{ textTransform: 'none' }}>
                {t("onlineExam.reopenTitle")}
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>

              <Row>
                <Col md={3} />
                <Col md={6}>
                  <div className="d-flex flex-row justify-content-end align-items-center mb-3">
                    <span className="modal-select-title mr-4" style={{ width: 280, textAlign: 'right' }}>{t("menu.examLength")}*</span>
                    <input
                      className="form-control"
                      value={reopenDuration}
                      onChange={(e) => {
                        setReopenDuration(e?.target?.value)
                      }}
                    />
                  </div>
                </Col>
              </Row>
              <Row>
                <Col md={5} />
                <Col md={7}>
                  <div className="d-flex flex-row align-items-center mb-3">
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <Checkbox
                        style={{ paddingLeft: 0 }}
                        sx={{
                          '&.Mui-checked': {
                            color: '#ff5b1d',
                          },
                        }}
                        checked={removePrevDetail}
                        onChange={(e, value) => {
                          setRemovePrevDetail(value)
                        }}
                      />
                      {t("onlineExam.deleteDtl")}
                    </div>
                  </div>
                </Col>
              </Row>

            </Modal.Body>
            <Modal.Footer className="p-3 text-center">
              <div style={{ display: 'flex', flexDirection: 'row', display: 'inline-block' }}>
                <Button className="cursor-pointer cancel-button pr-4" variant='link' onClick={() => {
                  setReopenTmpDtl(null)
                  setReopenDuration('')
                  setRemovePrevDetail(false)
                  setShowReopenModal(false)
                }}>
                  <span style={{ color: '#ff2f1a' }}>{t("common.cancel")}</span>
                </Button>
                <Button className="cursor-pointer save-button" variant='empty' onClick={() => {
                  submitReopen(reopenTmpDtl, reopenDuration, removePrevDetail)
                }}>
                  <span style={{ color: '#555555' }}>{t("onlineExam.reopen")}</span>
                </Button>
              </div>
            </Modal.Footer>
          </Modal>
        }

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

export default QuizReport;
