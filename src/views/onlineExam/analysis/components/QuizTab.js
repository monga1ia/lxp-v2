import React from "react";
import DTable from "modules/DataTable/DTable";
import { useTranslation } from "react-i18next";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Col, Row } from "react-bootstrap";
import CircularGraph from "views/onlineExam/quizReport/components/CircularGraph";

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
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);
ChartJS.defaults.datasets.bar.maxBarThickness = 50;

export default function QuizTab({ isGroup = false, questions = [], excelFileName = '' }) {

  const { t } = useTranslation()
  const [expanded, setExpanded] = React.useState("panel1");


  const config = {
    showPagination: false,
    showFilter: true,
    showAllData: true,
    tableMarginLess: false,
    excelExport: true,
    excelFileName: excelFileName
  };

  const columns = [
    {
      dataField: "name",
      text: t("question.title"),
      sort: true,
      formatter: (cell, row) => {
        return <span>{t("question.title") + ' ' + row?.ordering}</span>
      }
    },
    {
      dataField: "correctPercentage",
      text: t("menu.performance"),
      sort: true,
      formatter: (cell) => {
        return (
          <div
            className="text-end cursor-pointer"
          >{cell}%</div>
        );
      },
    },
    {
      dataField: "correct",
      text: t("menu.correctStudent"),
      sort: true,
      formatter: (cell) => {
        return <div className="text-end">{cell}</div>;
      },
    },
    {
      dataField: "incorrect",
      text: t("menu.wrongStudent"),
      sort: true,
      formatter: (cell) => {
        return <div className="text-end">{cell}</div>;
      },
    },
    {
      dataField: "noAnswer",
      text: t("menu.omittedStudent"),
      sort: true,
      formatter: (cell, row) => {
        return <div className="text-end">{cell}</div>;
      },
    },
  ];

  const childColumns = [
    {
      dataField: "name",
      text: isGroup ? t("menu.school") : t("menu.group"),
      sort: true,
    },
    {
      dataField: "execution",
      text: t("menu.performance"),
      sort: true,
      formatter: (cell, row) => {
        return (
          <div
            className="text-end cursor-pointer"
          >{cell}%</div>
        );
      },
    },
    {
      dataField: "correct",
      text: t("menu.correctStudent"),
      sort: true,
      formatter: (cell) => {
        return <div className="text-end">{cell}</div>;
      },
    },
    {
      dataField: "incorrect",
      text: t("menu.wrongStudent"),
      sort: true,
      formatter: (cell) => {
        return <div className="text-end">{cell}</div>;
      },
    },
    {
      dataField: "noAnswer",
      text: t("menu.omittedStudent"),
      sort: true,
      formatter: (cell, row) => {
        return <div className="text-end">{cell}</div>;
      },
    },
  ];

  return (
    <div className="p-4">
      <div className="card-alternate mb-3">
        <DTable config={config} columns={columns} data={questions} />
      </div>

      {
        questions && questions?.map(questionObj => {
          if (questionObj?.id) {
            const total = questionObj?.correct + questionObj?.incorrect + questionObj?.noAnswer
            const percentage = questionObj?.correctPercentage || (total > 0 ? parseFloat(100 * questionObj?.correct / total)?.toFixed(1) : 0);

            const labels = [];
            const values = []

            if (questionObj.details && questionObj.details?.length > 0) {
              for (let d = 0; d < questionObj.details?.length; d++) {
                labels.push(questionObj.details[d].name)

                const dtlTotal = questionObj.details[d].correct + questionObj.details[d].incorrect + questionObj.details[d].noAnswer;
                values.push(dtlTotal > 0 ? (100 * questionObj.details[d].correct / dtlTotal) : 0)
              }
            }

            const chartOptions = {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  display: false,
                  position: 'top'
                },
                title: {
                  display: false
                },
              },
              scales: {
                y: {
                  ticks: {
                    stepSize: 10
                  },
                  min: 0,
                  max: 100
                }
              }
            };

            return <div className="mb-2" key={'question_' + questionObj?.id}>
              <Accordion
                expanded={expanded === 'panel' + questionObj?.id}
                onChange={() => {
                  if (expanded === ("panel" + questionObj?.id)) {
                    setExpanded(null);
                  } else {
                    setExpanded("panel" + questionObj?.id);
                  }
                }}
                className="accordion-container"
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                  className="accordion-header"
                >
                  <Typography>
                    <span>{t("question.title") + ' ' + questionObj?.ordering}</span>
                  </Typography>
                </AccordionSummary>
                <AccordionDetails className="p-5">
                  <Row>
                    <Col md={12}>
                      {
                        questionObj?.content && <div dangerouslySetInnerHTML={{ __html: questionObj?.content.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&') }} />
                      }
                    </Col>
                  </Row>
                  <Row className="mb-4">
                    <Col xl={3} className="d-flex flex-column align-items-center">
                      <CircularGraph
                        percentage={percentage}
                        totalCount={total}
                        studentCount={questionObj?.correct}
                      />
                    </Col>

                    <Col xl={5}>
                      <div className="column-graph">
                        <Bar options={chartOptions}
                          height="200px"
                          data={{
                            labels,
                            datasets: [
                              {
                                label: t("menu.performance"),
                                data: values,
                                backgroundColor: '#36A3F7',
                              }
                            ],
                          }} />
                      </div>
                    </Col>
                  </Row>

                  <DTable
                    config={{
                      ...config,
                      excelExport: false,
                      showFilter: false,
                    }}
                    columns={childColumns}
                    data={questionObj?.details}
                  />
                </AccordionDetails>
              </Accordion>
            </div>
          }
        })
      }
    </div>
  );
}
