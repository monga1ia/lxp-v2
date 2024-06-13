import React, {useState} from "react";
import DTable from "modules/DataTable/DTable";
import { Col, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import CloseButton from "components/buttons/CloseButton";
import TreeView from "modules/TreeView";
import { groupDeleteStudent, groupEdit } from "utils/fetchRequest/Urls";
import { fetchRequest } from 'utils/fetchRequest';
import message from 'modules/message' 
import DeleteModal from 'modules/DeleteModal';

const StudentsTab = ({
    groupId = null,
    treeData = [], 
    tableData = [],
    totalCount = 0,
    tableState,
    changeTableData,
    changeTreeData,
    setTableState,
    setTotalCount,
    setGroupData
}) => {
    const { t } = useTranslation();

    const [loading, setLoading] = useState()
    const [selectedTreeId, setSelectedTreeId] = useState(null);
    const [selectedSchoolId, setSelectedSchoolId] = useState(null);
    const [selectedStudentId, setSelectedStudentId] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(null);

    const config = {
        showPagination: true,
        showFilter: true,
        showAllData: false,
        tableMarginLess: true,
        defaultSort: [{
            dataField: tableState.sort,
            order: tableState.order
        }],
        defaultPageOptions: {
            page: tableState.page,
            sizePerPage: tableState.pageSize,
            search: tableState.search,
        }
    };

    const columns = [
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
            text: t("menu.studentLN"),
            sort: true,
        },
        {
            dataField: "firstName",
            text: t("menu.studentName"),
            sort: true,
        },
        {
            dataField: "delete",
            text: "",
            headerStyle: () => ({
                width: 70,
            }),
            formatter: (cell, row) => {
                return <CloseButton onClick={() => handlerUserDelete(row)}/>;
            },
        },
    ];

    const handlerChangeTree = (treeId) => {
        setSelectedTreeId(treeId)

        let params = {
            group: groupId,
            school: treeId && treeId.length > 0 ? treeId[0] : null,
            type: 'students',
            page: 1,
            pageSize: tableState.pageSize,
            search: tableState.search,
            order: tableState.order,
            sort: tableState.sort,
        }

        let cloneTableState = {
            page: 1,
            pageSize: tableState.pageSize,
            search: tableState.search,
            order: tableState.order,
            sort: tableState.sort,
        }

        setTableState(cloneTableState)

        setLoading(true)
        fetchRequest(groupEdit, 'POST', params)
            .then((res) => {
                if (res.success) {
                    changeTableData(res?.students || [])
                    setSelectedSchoolId(params.school)
                    setTotalCount(res?.totalCount || 0)
                    setLoading(false)
                } else {
                    message(res.message)
                    setLoading(false)
                }
            })
            .catch(() => {
                message(t('errorMessage.title'));
                setLoading(false)
            })
    }

    const handlerUserDelete = (row) => {
        setSelectedStudentId(row.id)
        setShowDeleteModal(true)
    }

    const closeModal = () => {
        setSelectedStudentId(null)
        setShowDeleteModal(false)
    }

    const onUserInteraction = (object) => {
        object.school = selectedSchoolId;

        setTableState(object)
    };

    const submitDelete = () => {
        setLoading(true)
        let params = {
            group: groupId,
            school: selectedSchoolId,
            student: selectedStudentId,
            type: 'students',
            page: tableState.page,
            pageSize: tableState.pageSize,
            search: tableState.search,
            order: tableState.order,
            sort: tableState.sort,
        }

        fetchRequest(groupDeleteStudent, 'POST', params)
            .then((res) => {
                if (res.success) {
                    closeModal()
                    changeTableData(res?.students || [])
                    changeTreeData(res?.schoolList || [])
                    setTotalCount(res?.totalCount || [])
                    setGroupData(res?.groupData || [])
                    setLoading(false)
                } else {
                    message(res.message)
                    setLoading(false)
                }
            })
            .catch(() => {
                message(t('errorMessage.title'));
                setLoading(false)
            })
    }

    return (
        <Row className="p-4">
            <Col xl="4" xxl="3" className="mb-4">
                <div className="p-4 tree-wrapper">
                    <div className="d-flex flex-row">
                        <TreeView
                            defaultExpandAll
                            treeData={treeData}
                            selectedNodes={selectedTreeId}
                            onSelect={handlerChangeTree}
                        />
                    </div>
                </div>
            </Col>
            <Col xl="8" xxl="9">
                <DTable
                    remote
                    config={config}
                    columns={columns}
                    data={tableData}
                    selectMode="radio"
                    totalDataSize={totalCount}
                    onInteraction={onUserInteraction}
                    currentPage={tableState.page}
                />
            </Col>
            {
                showDeleteModal && selectedStudentId &&
                <DeleteModal
                    show={showDeleteModal}
                    onClose={closeModal}
                    onDelete={submitDelete}
                    title={t('warning.delete')}
                >
                    {t('warning.delete_confirmation')}
                    <br />
                    <br />
                    {t('warning.delete_confirmation_description')}
                </DeleteModal>
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
        </Row>
    );
};

export default StudentsTab;
