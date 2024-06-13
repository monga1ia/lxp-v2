import CsLineIcons from "cs-line-icons/CsLineIcons";
import RestartIcon from "cs-line-icons/custom/RestartIcon";
import DTable from "modules/DataTable/DTable";
import React from "react";
import { Button } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";

const config = {
  showPagination: true,
  showFilter: true,
  showAllData: false,
  tableMarginLess: false,
};

const contextMenus = [
  {
    key: "reopen",
    icon: <RestartIcon />,
    title: "Дахин нээх",
  },
];

const getTag = (state) => {
  switch (state) {
    case "submitted":
      return {
        style: "active",
        title: "Илгээсэн",
      };
    case "inprogress":
      return {
        style: "info",
        title: "Бөглөж байгаа",
      };
    default:
      return {
        style: "",
        title: "Эхлээгүй",
      };
  }
};

export default function QuizReportTable({ list = [], onReopen = () => {}, onInteraction = () => {} }) {
  const history = useHistory();
  const { t } = useTranslation();

  const columns = [
    {
      dataField: "statusName",
      text: t("curriculum.state"),
      style: {
        textAlign: "center",
      },
      formatter: (cell, row) => {
        return cell
          ? <div className="tag" style={{ backgroundColor: row?.statusColor }}>{cell}</div>
          : <div className="tag" style={{ backgroundColor: '#575962' }}>{t("exam.notStarted")}</div>;
      },
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
    },
    {
      dataField: "variantName",
      text: t("common.variant"),
      sort: true,
      formatter: (cell, row) => {
        return cell ? (t("common.variant") + ' ' + cell) : '-';
      },
    },
    {
      dataField: "takenScore",
      text: t("assessment.takenScore"),
      sort: true,
      style: {
        textAlign: 'right'
      },
      formatter: (cell, row) => {
        return cell ? cell : '-';
      },
    },
    {
      dataField: "percentage",
      text: t("menu.performance"),
      sort: true,
      style: {
        textAlign: 'right'
      },
      formatter: (cell, row) => {
        return cell ? (cell + '%') : '-';
      },
    },
    {
      dataField: 'createdDate.date',
      text: t("common.startedDate"),
      sort: true,
      formatter: (cell) => cell ? cell?.slice(0, 19) : '-',
    },
    {
      dataField: 'endDate.date',
      text: t("common.submittedDate"),
      sort: true,
      formatter: (cell) => cell ? cell?.slice(0, 19) : '-',
    }
  ];

  const onContextMenuItemClick = (id, key) => {
    if (key === "reopen") {
      const selectedDetail = list.find(obj => {
        return obj.id === id
      })

      onReopen(selectedDetail)
    }
  };

  return (
    <DTable
      config={config}
      columns={columns}
      clickContextMenu={true}
      data={list}
      contextMenus={contextMenus}
      onContextMenuItemClick={onContextMenuItemClick}
      onInteraction={onInteraction}
      individualContextMenus
    />
  );
}
