import DTable from "modules/DataTable/DTable";
import React, { useState } from "react";
import { Button, Col, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { groupAddUser, groupDeleteUser, groupEdit } from "utils/fetchRequest/Urls";
import { fetchRequest } from 'utils/fetchRequest';
import message from 'modules/message' 
import DeleteModal from 'modules/DeleteModal';
import CloseButton from "components/buttons/CloseButton";
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import GroupUserAddModal from "./GroupUserAddModal";
import TreeComponent from "./TreeComponent";

const TeachersTab = ({ 
    groupId = null,
    treeData = [],
    totalCount = 0,
    tableData = [],
    changeTableData,
    changeTreeData,
    tableState,
    setTableState,
    setTotalCount
}) => {
    const { t } = useTranslation();

    const [showModal, setShowModal] = useState();
    const [loading, setLoading] = useState()
    const [users, setUsers] = useState([]);
    const [schools, setSchools] = useState([]);
    const [selectedTreeId, setSelectedTreeId] = useState(null);
    const [selectedSchoolId, setSelectedSchoolId] = useState(null);
    const [selectedUserId, setSelectedUserId] = useState(null);
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
            dataField: "title",
            text: t("menu.roles"),
            sort: true,
        },
        {
            dataField: "code",
            text: t("common.code"),
            sort: true,
        },
        {
            dataField: "lastName",
            text: t("common.lastName"),
            sort: true,
        },
        {
            dataField: "firstName",
            text: t("common.firstName"),
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

    const init = (params) => {
        setLoading(true)
        fetchRequest(groupAddUser, 'POST', params)
            .then((res) => {
                if (res.success) {
                    setShowModal(true)

                    if(tableData && tableData.length > 0){
                        let userList = res?.userList || [];
                        let filterUserList = [];
                        if(userList && userList.length > 0){
                            for(let i = 0; i < userList.length; i++){
                                
                                let existingUser = tableData.find(data => data.id == userList[i].id)
    
                                if(!existingUser){
                                    filterUserList.push(userList[i])
                                }
                            }
                        }

                        setUsers(filterUserList)
                    } else {
                        setUsers(res?.userList || [])
                    }

                    setSchools(res?.schoolList || [])
                    setSelectedSchoolId(params.school)
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

    const handlerAddUser = () => {
        let params = {}
        if(selectedSchoolId){
            params = {
                group: groupId,
                school: selectedSchoolId, 
                submit: 0
            }
        } else {
            params = {
                group: groupId,
                school: selectedTreeId && selectedTreeId.length > 0 ? selectedTreeId[0] : null, 
                submit: 0
            }
        }
        setUsers([]);
        init(params)
    }

    const submitDelete = () => {
        setLoading(true)
        let params = {
            group: groupId,
            school: selectedSchoolId,
            user: selectedUserId,
            type: 'teachers',
            page: tableState.page,
            pageSize: tableState.pageSize,
            search: tableState.search,
            order: tableState.order,
            sort: tableState.sort,
        }

        fetchRequest(groupDeleteUser, 'POST', params)
            .then((res) => {
                if (res.success) {
                    closeModal()
                    changeTableData(res?.userList || [])
                    changeTreeData(res?.schoolList || [])
                    setTotalCount(res?.totalCount || [])
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
        setSelectedUserId(row.userId)
        setShowDeleteModal(true)
    }

    const closeModal = () => {
        setSelectedUserId(null)
        setShowDeleteModal(false)
    }

    const handlerChangeTree = (treeId) => {
        setSelectedTreeId(treeId)

        let params = {
            group: groupId,
            school: treeId && treeId.length > 0 ? treeId[0] : null,
            type: 'teachers',
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
                    setShowModal(false)
                    changeTableData(res?.userList || [])
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

    const handlerChangeSchool = (schoolId) => {
        if(schoolId){
            let params = {
                group: groupId,
                school: schoolId,
                submit: 0
            }

            init(params)
        } else {
            setUsers([])
        }
    }

    const onChangeCheck = (type, rowIndex, value) => {
        if(type == 'allCheck'){
            let cloneUsers = [...users];

            if(cloneUsers && cloneUsers.length > 0){
                for(let i = 0; i < cloneUsers.length; i++){
                    cloneUsers[i].checkable = value
                }

                setUsers(cloneUsers)
            }
        } else if(type == 'row'){
            let cloneUsers = [...users];

            if(cloneUsers && cloneUsers.length > 0){
                for(let i = 0; i < cloneUsers.length; i++){
                    if(i == rowIndex){
                        cloneUsers[i].checkable = value
                    }
                }

                setUsers(cloneUsers)
            }
        }
    }

    const submitUsers = () => {
        let userList = [];
        if(users && users.length > 0){
            for(let i = 0; i < users.length; i++){
                if(users[i].checkable){
                    userList.push(users[i]) 
                }
            }
        }

        if(userList && userList.length > 0){
            let params = {
                school: selectedSchoolId,
                group: groupId,
                users: JSON.stringify(userList),
                submit: 1,
                type: 'teachers',
                page: tableState.page,
                pageSize: tableState.pageSize,
                search: tableState.search,
                order: tableState.order,
                sort: tableState.sort,
            }

            setLoading(true)
            fetchRequest(groupAddUser, 'POST', params)
                .then((res) => {
                    if (res.success) {
                        setShowModal(false)
                        changeTableData(res?.userList || [])
                        changeTreeData(res?.schoolList || [])
                        setTotalCount(res?.totalCount || [])
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
        } else {
            message('Хэрэглэгч сонгоно уу')
        }
    }

    const onUserInteraction = (object) => {
        object.school = selectedSchoolId;

        setTableState(object)
    };

    return (
        <Row className="p-4">
            <Col xl="4" xxl="3" className="mb-4">
                <div className="p-4 tree-wrapper">
                    <TreeComponent
                        data={treeData}
                        selectedNodes={selectedTreeId}
                        onChange={handlerChangeTree}
                    />
                </div>
            </Col>
            <Col xl="8" xxl="9">
                <Button
                    onClick={() => handlerAddUser()}
                    variant="primary"
                    className="mb-3 add-button text-uppercase"
                >
                    <ControlPointIcon style={{ color: "white", marginRight: "4px" }} className='MuiSvg-customSize'/>
                    Хэрэглэгч нэмэх
                </Button>

                <DTable
                    remote
                    config={config}
                    columns={columns}
                    data={tableData}
                    totalDataSize={totalCount}
                    selectMode="radio"
                    onInteraction={onUserInteraction}
                    currentPage={tableState.page}
                />
            </Col>
            <GroupUserAddModal
                show={showModal} 
                onClose={() => setShowModal(false)} 
                schools={schools}
                users={users}
                onChangeSchool={handlerChangeSchool}
                selectedSchoolId={selectedTreeId && selectedTreeId.length > 0 ? selectedTreeId[0] : null}
                onChangeCheck={onChangeCheck}
                onSubmit={submitUsers}
            />
            {
                showDeleteModal && selectedUserId &&
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

export default TeachersTab;