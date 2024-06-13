import React from "react";
import DTable from "modules/DataTable/DTable";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import ViewIcon from "cs-line-icons/custom/ViewIcon";
import EditIcon from "cs-line-icons/custom/EditIcon";
import TrashIcon from "cs-line-icons/custom/Trash";

const GroupTable = ({ 
    tableData, 
    totalCount, 
    onInteraction, 
    page, 
    pageSize, 
    search,
    onView,
    onDelete
}) => {
    const { t } = useTranslation();
    const history = useHistory();

    const config = {
        showPagination: true,
        showFilter: true,
        showAllData: false,
        tableMarginLess: true,
        defaultPageOptions: {
            page: page,
            sizePerPage: pageSize,
            search: search,
        }
    };

    const contextMenus = [
        {
            key: "view",
            icon: <ViewIcon />,
            title: "Харах",
        },
        {
            key: "edit",
            icon: <EditIcon />,
            title: t('action.edit'),
        },
        {
            key: "delete",
            icon: <TrashIcon />,
            title: t('action.delete'),
        },
    ];

    const columns = [
        {
            dataField: "isActive",
            text: "",
            headerStyle: () => ({
                width: 30,
            }),
            style: {
                textAlign: "center",
            },
            formatter: (cell) => {
                return <div className={`table-circle ${cell === true && "active"}`} />;
            },
        },
        {
            dataField: "gradeName",
            text: t("curriculum.grade"),
            sort: true,
        },
        {
            dataField: "subjectName",
            text: t("menu.curriculumSubject"),
            sort: true,
        },
        {
            dataField: "name",
            text: t("menu.groupName"),
            sort: true,
        },
        {
            dataField: "totalStudentNumber",
            text: t("common.users"),
            sort: true,
            formatter: (cell, row) => {
                return (
                    <div
                        style={{
                            textAlign: "end",
                            color: "#4037D7",
                            textDecorationLine: "underline",
                            cursor: "pointer",
                        }}
                        onClick={() => onContextMenuItemClick(row?.id, 'edit')}
                    >
                        {cell}
                    </div>
                );
            },
        },
        {
            dataField: "firstName",
            text: t("common.createdUser"),
            sort: true,
        },
        {
            dataField: "createdDate",
            text: t("common.createdDate"),
            sort: true,
            align: 'left',
            formatter: (cell) => cell?.date?.split('.')[0]
        },
    ];

    const onContextMenuItemClick = (id, key) => {
        if (key === "view") {
            onView(id)
        }
        if (key === "edit") {
            history.push({
                pathname: '/groups/edit',
                state: {
                    id,
                }
            })
        }
        if (key === "delete") {
            onDelete(id)
        }
    };

    const onUserInteraction = (object) => {
        onInteraction(object)
    };

    return (
        <DTable
            remote
            config={config}
            columns={columns}
            data={tableData}
            totalDataSize={totalCount}
            clickContextMenu
            contextMenus={contextMenus}
            onContextMenuItemClick={onContextMenuItemClick}
            onInteraction={onUserInteraction}
            currentPage={page}
        />
    );
}

export default GroupTable
