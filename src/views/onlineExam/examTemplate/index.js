import React, { useEffect, useState } from "react";
import { Row, Col, Card, Button } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { Link, useHistory } from "react-router-dom";
import { fetchRequest } from "utils/fetchRequest";
import { examTemplateIndex, examTemplateDelete, examTemplateUnPublish } from 'utils/fetchRequest/Urls';
import { useSelector } from "react-redux";
import secureLocalStorage from 'react-secure-storage'
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import ReportIcon from "cs-line-icons/custom/ReportIcon";
import InactiveIcon from "cs-line-icons/custom/InactiveIcon";
import EditIcon from "cs-line-icons/custom/EditIcon";
import TrashIcon from "cs-line-icons/custom/Trash";
import showMessage from "modules/message";
import DeleteModal from "modules/DeleteModal";
import DTable from "modules/DataTable/DTable";
import HtmlHead from "components/html-head/HtmlHead";
import BreadcrumbList from "components/breadcrumb-list/BreadcrumbList";
import ActiveModal from "./components/modal/activeModal";

const ExamTemplate = () => {
    const { t } = useTranslation();
    const history = useHistory();
    const { selectedSchool } = useSelector(state => state.schoolData);

    const [tableData, setTableData] = useState([])
    const [totalCount, setTotalCount] = useState(0);
    const [selectedId, setSelectedId] = useState(null)
    const [loading, setLoading] = useState(false)
    const [showInactiveModal, setShowInactiveModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [initLoader, setInitLoader] = useState(true)

    const tableIndex = ['exam_template_table_index']
    const title = t('examTemplate.title');
    const description = t('examTemplate.title');

    const breadcrumbs = [
        { to: "", text: "Home" },
        { to: "online-exam/template", text: title },
    ];

    const [tableState, setTableState] = useState(JSON.parse(secureLocalStorage.getItem(tableIndex)) ||
        {
            page: 1,
            pageSize: 10,
            search: '',
            sort: 'firstName',
            order: 'asc'
        }
    )

    const config = {
        showPagination: true,
        showFilter: true,
        showAllData: false,
        tableMarginLess: true,
        defaultSort: [{
            dataField: tableState?.sort || 'createdDate',
            order: tableState?.order || 'desc'
        }],
        defaultPageOptions: {
            page: tableState?.page || 1,
            sizePerPage: tableState?.pageSize || 10,
            search: tableState?.search || '',
        }
    };
    
    const contextMenus = [
        // {
        //     key: "view",
        //     icon: <ReportIcon />,
        //     title: t('action.view'),
        // },
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
        {
            key: "inactive",
            icon: <InactiveIcon />,
            title: t('action.setInactive'),
        },
    ];

    const init = (params) => {
        setLoading(true)
        fetchRequest(examTemplateIndex, 'POST', params)
            .then((res) => {
                if (res.success) {
                    const { templates = [], totalCount = 0 } = res

                    if(templates && templates.length > 0){
                        for(let i = 0; i < templates.length; i++){
                            if(templates[i].createdDate){
                                templates[i].createdDate = templates[i].createdDate.date.substring(0, 19)
                            }

                            if(templates[i].isPublish){
                                templates[i].contextMenuKeys = ['inactive']
                            } else {
                                templates[i].contextMenuKeys = ['view', 'delete', 'edit']
                            }
                        }
                    }

                    setTableData(templates || [])
                    setTotalCount(totalCount || 0)
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
        let params = {
            ...tableState,
            school: selectedSchool.id,
        }

        setInitLoader(false)
        init(params);
    }, []);

    const onContextMenuItemClick = (id, key) => {
        if (key === "report") {
            // history.push("/quiz-report")
        } else if (key === "edit") {
            history.push({
                pathname: '/online-exam/template-edit',
                state: {
                    id
                }
            })
        } else if (key === "delete") {
            setShowDeleteModal(true)
            setSelectedId(id)
        } else if (key === "inactive") {
            setShowInactiveModal(true)
            setSelectedId(id)
        }
    }
    
    const columns = [
        {
            dataField: "isPublish",
            text: t("menu.state"),
            headerStyle: () => ({
                width: 30,
            }),
            style: {
                textAlign: "center",
            },
            formatter: (cell) => {
                return (
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <div className={`table-circle ${cell === true && "active"}`} />
                    </div>
                )
            },
        },
        {
            dataField: "subjectName",
            text: t("menu.curriculumSubject"),
            sort: true,
        },
        {
            dataField: "name",
            text: t("menu.modelName"),
            sort: true,
            formatter: (cell) => {
                return (
                    <div
                        style={{
                            color: "#4037D7",
                            textDecorationLine: "underline",
                            cursor: "pointer",
                        }}
                    >
                        {cell}
                    </div>
                );
            },
        },
        {
            dataField: "createdUser",
            text: t("common.createdUser"),
            sort: true,
        },
        {
            dataField: "createdDate",
            text: t("common.createdDate"),
            sort: true,
        },
    ];

    const onUserInteraction = (object) => {
        if (!initLoader) {
            if (object.search) {
                let cloneData = {
                    school: selectedSchool.id,
                    page: tableState.search == object.search ? object.page : 1,
                    pageSize: object.pageSize,
                    search: object.search,
                    sort: object.sort,
                    order: object.order,
                };

                setTableState(cloneData)
                secureLocalStorage.setItem(tableIndex, JSON.stringify(cloneData));

                init(cloneData)
            } else {
                if (object.page) {
                    let cloneData = {
                        school: selectedSchool.id,
                        page: object.page,
                        pageSize: object.pageSize,
                        search: object.search,
                        sort: object.sort,
                        order: object.order,
                    };

                    setTableState(object)
                    secureLocalStorage.setItem(tableIndex, JSON.stringify(cloneData));

                    init(cloneData)
                }
            }
        }
    };

    const onDelete = () => {
        let params = {
            school: selectedSchool.id,
            template: selectedId,
        }

        setLoading(true)
        fetchRequest(examTemplateDelete, 'POST', params)
            .then((res) => {
                if (res.success) {
                    let params = {
                        school: selectedSchool.id,
                        ...tableState
                    }
            
                    init(params)
                    showMessage(res.message, true)
                    setShowDeleteModal(false);
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

    const activeSubmit = () => {
        let params = {
            school: selectedSchool.id,
            template: selectedId,
        }

        setLoading(true)
        fetchRequest(examTemplateUnPublish, 'POST', params)
            .then((res) => {
                if (res.success) {
                    const { id = null, isPublish = false } = res;

                    let cloneTableData = [...tableData]
                    let existingTableData = cloneTableData.find(data => data.id == id)

                    existingTableData.isPublish = isPublish;
                    existingTableData.contextMenuKeys = ['view', 'delete', 'edit']

                    setTableData(cloneTableData)
                    setShowInactiveModal(false);
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

    const onModalClose = () => {
        setShowDeleteModal(false)
    }

    return (
        <>
            <HtmlHead title={title} description={description} />
            <div className="page-title-container">
                <Row>
                    <Col md="7">
                        <h1 className="mb-0 pb-0 display-4 relative">{title}</h1>
                        <BreadcrumbList items={breadcrumbs} />
                    </Col>
                </Row>
            </div>

            <div className="mb-3">
                <Link to="/online-exam/template-add">
                    <Button variant="primary" className="add-button text-uppercase">
                        <ControlPointIcon
                            style={{ color: "white", marginRight: "4px" }}
                        />
                        Шинэ загвар үүсгэх
                    </Button>
                </Link>
            </div>
            <Card>
                <Card.Body>
                    <DTable
                        remote
                        config={config}
                        columns={columns}
                        data={tableData}
                        selectMode="radio"
                        clickContextMenu
                        onContextMenuItemClick={onContextMenuItemClick}
                        contextMenus={contextMenus}
                        totalDataSize={totalCount}
                        onInteraction={onUserInteraction}
                        individualContextMenus
                        currentPage={tableState?.page}
                    />
                </Card.Body>
            </Card>
            {
                showDeleteModal &&
                <DeleteModal
                    show={showDeleteModal}
                    onClose={onModalClose}
                    onDelete={onDelete}
                    title={t('warning.delete')}>
                    {t('warning.delete_confirmation')}
                    <br />
                    <br />
                    {t('warning.delete_confirmation_description')}
                </DeleteModal>
            }
            {
                showInactiveModal &&
                <ActiveModal
                    show={showInactiveModal}
                    onClose={() => setShowInactiveModal(false)}
                    onSave={() => activeSubmit()}
                />
            }
            {
                loading &&
                <>
                    <div className='loader-container'>
                        <svg className="splash-spinner" viewBox="0 0 50 50">
                            <circle className="path" cx="25" cy="25" r="20" fill="none" strokeWidth="5"/>
                        </svg>
                    </div>
                </>
            }
        </>
    );
};

export default ExamTemplate;
