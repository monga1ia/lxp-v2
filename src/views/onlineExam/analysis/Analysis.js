import HtmlHead from "components/html-head/HtmlHead";
import TabComponent from "components/tab/Tab";
import React, { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Col, Row } from "react-bootstrap";
import { queryUrl } from 'utils/utils'

import { fetchRequest } from "utils/fetchRequest";
import { examAnalysis } from 'utils/fetchRequest/Urls';
import showMessage from "modules/message";

import CircularGraph from "../quizReport/components/CircularGraph";
import ContentTab from "./components/ContentTab";
import LineGraphSingle from "./components/LineGraphSingle";
import QuizTab from "./components/QuizTab";
import ClassOrSchoolTab from "./components/ClassOrSchoolTab";

export default function Analysis() {

  const location = useLocation();
  const { t } = useTranslation();
  const history = useHistory();

  const urlParams = queryUrl(location?.search);

  const { selectedSchool } = useSelector(state => state.schoolData);
  const [id] = useState(urlParams?.id || null)

  const [loading, setLoading] = useState(false)

  const [title, setTitle] = useState('');
  const [examInfo, setExamInfo] = useState(null)
  const [viewType, setViewType] = useState(null)
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(null)
  const [topQuestions, setTopQuestions] = useState([])
  const [worstQuestions, setWorstQuestions] = useState([])
  const [variantParams, setVariantParams] = useState(null)

  const [topics, setTopics] = useState([])
  const [questions, setQuestions] = useState([])
  const [classSchools, setClassSchools] = useState([])

  const init = (params) => {
    setLoading(true)
    fetchRequest(examAnalysis, 'POST', params)
      .then((res) => {
        if (res.success) {
          setTopQuestions(res?.topQuestions)
          setWorstQuestions(res?.worstQuestions)
          if (res?.exam?.hasVariant && res?.exam?.variantCount > 1) {
            setVariantParams(res?.variantParams)
          } else {
            setVariantParams(null)
          }

          setExamInfo(res?.exam)
          setTitle(res?.title)
          setViewType(res?.viewType)
          setTopics(res?.topics)
          setQuestions(res?.questions)
          setClassSchools(res?.classSchools)
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

  useEffect(() => {

  }, [selectedVariantIndex])

  const description = "";

  const onTabChange = (index) => {
    const selectedVariant = examInfo?.variants?.find((obj, i) => i === selectedVariantIndex)

    let tabViewType = 'TOPIC';
    switch (index) {
      case 0:
        tabViewType = 'TOPIC';
        break;
      case 1:
        tabViewType = 'QUESTION';
        break;
      case 2:
        tabViewType = 'DETAIL';
        break;
    }

    if (selectedVariant) {
      init({
        school: selectedSchool?.id,
        exam: id,
        viewType: tabViewType,
        variant: selectedVariant?.id
      })
    } else {
      init({
        school: selectedSchool?.id,
        exam: id,
        viewType: tabViewType
      })
    }
  }

  const onVariantTabChange = (index) => {
    setSelectedVariantIndex(index)

    const selectedVariant = examInfo?.variants?.find((obj, i) => i === index)
    if (selectedVariant) {
      init({
        school: selectedSchool?.id,
        exam: id,
        variant: selectedVariant?.id,
        viewType
      })
    }
  }

  const getVariantTab = () => {
    const variants = []
    for (let v = 1; v <= examInfo?.variants?.length; v++) {
      variants.push({
        title: 'Хувилбар ' + v,
        children: null
      })
    }
    return variants
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

          <Row className="p-4">
            <Col xl="2" className="mb-2">
              <h2 className="small-title">{t("menu.generalPerformance")}</h2>
              <div className="card-alternate d-flex flex-column justify-content-center align-items-center">
                <CircularGraph
                  percentage={examInfo?.performance}
                  totalCount={examInfo?.totalCount}
                  studentCount={examInfo?.dtlCount}
                />
              </div>
            </Col>

            {
              examInfo
                ?
                examInfo?.hasVariant && examInfo?.variants?.length > 1
                  ?
                  <Col xl="10" className="mb-2">
                    <h2 className="small-title">{t("menu.performance")}</h2>

                    <div className="card-alternate d-flex flex-column p-4">
                      <Row>
                        <Col md={2} />
                        <Col md={8}>
                          {
                            examInfo?.variants?.map((variantObj, i) => {
                              return <LineGraphSingle
                                key={'variant_chart_' + variantObj?.id}
                                className="mb-2"
                                title={t("quiz.variant") + ' ' + (i + 1)}
                                value={variantObj?.performance || 0}
                              />
                            })
                          }
                        </Col>
                      </Row>
                    </div>
                  </Col>
                  :
                  <>
                    <Col xl="5" className="mb-2">
                      <h2 className="small-title">
                        {t("analysis.bestPerformanceTask")}
                      </h2>

                      <div className="card-alternate d-flex flex-column p-4">
                        {
                          topQuestions && topQuestions?.length > 0 && topQuestions?.map(topQuestionObj => {
                            return <LineGraphSingle
                              key={'top_question_' + topQuestionObj?.id}
                              className="mb-2"
                              title={topQuestionObj?.content}
                              value={parseInt(topQuestionObj?.percentage || 0)}
                            />
                          })
                        }
                      </div>
                    </Col>

                    <Col xl="5" className="mb-2">
                      <h2 className="small-title">
                        {t("analysis.worstPerformanceTask")}
                      </h2>
                      <div className="card-alternate d-flex flex-column p-4">
                        {
                          worstQuestions && worstQuestions?.length > 0 && worstQuestions?.map(worstQuestionObj => {
                            return <LineGraphSingle
                              key={'worst_question_' + worstQuestionObj?.id}
                              className="mb-2"
                              title={worstQuestionObj?.content}
                              value={parseInt(worstQuestionObj?.percentage || 0)}
                            />
                          })
                        }
                      </div>
                    </Col>
                  </>
                :
                null
            }

          </Row>
          {
            examInfo?.hasVariant && examInfo?.variants?.length > 1 &&
            <>
              <TabComponent
                onChange={onVariantTabChange}
                tabs={getVariantTab() || []}
              />

              {
                variantParams && <Row className="p-4">
                  <Col xl="2" className="mb-2">
                    <h2 className="small-title">{t("menu.performance")}</h2>

                    <div className="card-alternate d-flex flex-column justify-content-center align-items-center">
                      <CircularGraph
                        percentage={variantParams?.performance}
                        totalCount={variantParams?.totalCount}
                        studentCount={variantParams?.dtlCount}
                      />
                    </div>
                  </Col>
                  <Col xl="5" className="mb-2">
                    <h2 className="small-title">
                      {t("analysis.bestPerformanceTask")}
                    </h2>

                    <div className="card-alternate d-flex flex-column p-4">
                      {
                        topQuestions && topQuestions?.length > 0 && topQuestions?.map(topQuestionObj => {
                          return <LineGraphSingle
                            key={'top_question_' + topQuestionObj?.id}
                            className="mb-2"
                            title={t("question.title") + ' ' + topQuestionObj?.ordering}
                            value={parseInt(topQuestionObj?.percentage || 0)}
                          />
                        })
                      }
                    </div>
                  </Col>

                  <Col xl="5" className="mb-2">
                    <h2 className="small-title">
                      {t("analysis.worstPerformanceTask")}
                    </h2>

                    <div className="card-alternate d-flex flex-column p-4">
                      {
                        worstQuestions && worstQuestions?.length > 0
                        && worstQuestions?.map(worstQuestionObj => {
                          return <LineGraphSingle
                            key={'worst_question_' + worstQuestionObj?.id}
                            className="mb-2"
                            title={t("question.title") + ' ' + worstQuestionObj?.ordering}
                            value={parseInt(worstQuestionObj?.percentage || 0)}
                          />
                        })
                      }
                    </div>
                  </Col>
                </Row>
              }
            </>
          }
          <TabComponent
            onChange={onTabChange}
            tabs={[
              {
                title: t("analysis.byContent"),
                children: <ContentTab topics={topics} isGroup={viewType === 'INTEGRATED'} excelFileName={title + ' ' + t("analysis.byContent")} />,
              },
              {
                title: t("analysis.byTask"),
                children: <QuizTab questions={questions} isGroup={viewType === 'INTEGRATED'} excelFileName={title + ' ' + t("analysis.byTask")} />,
              },
              {
                title: examInfo?.viewType === 'INTEGRATED' ? t("analysis.byGroup") : t("selection.byClass"),
                children: <ClassOrSchoolTab classSchools={classSchools} isGroup={examInfo?.viewType === 'INTEGRATED'} excelFileName={title + ' ' + (examInfo?.viewType === 'INTEGRATED' ? t("analysis.byGroup") : t("selection.byClass"))} />,
              },
            ]}
          />
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
}