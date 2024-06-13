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
export default function ClassOrSchoolTab({ isGroup = false, classSchools = [], excelFileName = '' }) {

  const config = {
    showPagination: false,
    showFilter: true,
    showAllData: true,
    tableMarginLess: false,
    excelExport: true,
    excelFileName: excelFileName
  };

  const { t } = useTranslation()
  const [expanded, setExpanded] = React.useState("panel1");

  const columns = [
    {
      dataField: isGroup ? "name" : "className",
      text: isGroup ? t("menu.mainGroup") : t("menu.group"),
      sort: true
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
      text: t("menu.correctCount"),
      sort: true,
      formatter: (cell) => {
        return <div className="text-end">{cell}</div>;
      },
    },
    {
      dataField: "incorrect",
      text: t("menu.wrongCount"),
      sort: true,
      formatter: (cell) => {
        return <div className="text-end">{cell}</div>;
      },
    },
    {
      dataField: "noAnswer",
      text: t("menu.omittedCount"),
      sort: true,
      formatter: (cell, row) => {
        return <div className="text-end">{cell}</div>;
      },
    },
  ];

  const subColumns = [
    {
      dataField: "name",
      text: t('question.title'),
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
      text: t("menu.correctCount"),
      sort: true,
      formatter: (cell) => {
        return <div className="text-end">{cell}</div>;
      },
    },
    {
      dataField: "incorrect",
      text: t("menu.wrongCount"),
      sort: true,
      formatter: (cell) => {
        return <div className="text-end">{cell}</div>;
      },
    },
    {
      dataField: "noAnswer",
      text: t("menu.omittedCount"),
      sort: true,
      formatter: (cell, row) => {
        return <div className="text-end">{cell}</div>;
      },
    },
  ];

  return (
    <div className="p-4">
      <div className="card-alternate mb-3">
        <DTable config={config} columns={columns} data={classSchools} />
      </div>

      {
        classSchools?.map(classSchoolObj => {

          const total = classSchoolObj?.correct + classSchoolObj?.incorrect + classSchoolObj?.noAnswer
          const percentage = total > 0 ? parseFloat(100 * classSchoolObj?.correct / total)?.toFixed(1) : 0;

          const labels = [];
          const values = []

          if (classSchoolObj.details && classSchoolObj.details?.length > 0) {
            for (let d = 0; d < classSchoolObj.details?.length; d++) {
              labels.push(t("question.title") + ' ' + classSchoolObj.details[d].ordering)

              const dtlTotal = classSchoolObj.details[d].correct + classSchoolObj.details[d].incorrect + classSchoolObj.details[d].noAnswer;
              values.push(dtlTotal > 0 ? (100 * classSchoolObj.details[d].correct / dtlTotal) : 0)
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

          return <div className="mb-2" key={'class_school_' + classSchoolObj?.id}>
            <Accordion
              expanded={expanded === 'panel' + classSchoolObj?.id}
              onChange={() => {
                if (expanded === ("panel" + classSchoolObj?.id)) {
                  setExpanded(null);
                } else {
                  setExpanded("panel" + classSchoolObj?.id);
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
                <Typography>{classSchoolObj?.name}</Typography>
              </AccordionSummary>
              <AccordionDetails className="p-5">
                <Row className="mb-4">
                  <Col xl={3} className="d-flex flex-column align-items-center">
                    <CircularGraph
                      showFooter={false}
                      percentage={percentage}
                      totalCount={total}
                      studentCount={classSchoolObj?.correct}
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
                  columns={subColumns}
                  data={classSchoolObj?.details}
                />
              </AccordionDetails>
            </Accordion>
          </div>
        })
      }
    </div>
  );
}
