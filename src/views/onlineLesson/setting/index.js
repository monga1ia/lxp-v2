import BreadcrumbList from 'components/breadcrumb-list/BreadcrumbList';
import React, { useEffect, useMemo, useState } from 'react'
import { Button, Col, Row } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { ControlPoint } from '@mui/icons-material';
import DTable from "modules/DataTable/DTable";
import EditIcon from 'cs-line-icons/custom/EditIcon';
import TrashIcon from 'cs-line-icons/custom/Trash';
import InactiveIcon from 'cs-line-icons/custom/InactiveIcon';
import { fetchRequest } from 'utils/fetchRequest';
import localStorage from 'redux-persist/es/storage';
import message from 'modules/message';
import DeleteModal from 'modules/DeleteModal';

import Body from '../component/Body';
import SubmitModal from './modal/SubmitModal';

const tableStateKey = "onlineLesson_settings"

const Setting = () => {
    const { t, i18n } = useTranslation()

    const { selectedSchool } = useSelector(state=>state.schoolData) || {}

    const [list, setList] = useState([])
    const [tempComponent,setTempComponent] = useState(null)
    const [types,setTypes] = useState([])
    const [viewModal, setViewModal] = useState(false)
    const [deleteModal,setDeleteModal] = useState(false)
    const [tableState,setTableState] = useState({})

    const [loading,setLoading] = useState(false)

    const onContextMenuItemClick = (id, key, row) => {
        if (key == 'edit') {
            setTempComponent(row)
            setViewModal(true)
        } else if(key == 'delete') {
            setTempComponent(row)
            setDeleteModal(true)
        } else if(key == 'inactive') {
            onDisable(id)
        }
    }

    const onInteraction = (data) => {
        setTableState(data)
        localStorage.setItem(tableStateKey, JSON.stringify(data))
        fetchInit(data)
    }

    const onModalClose = () => {
        setTempComponent(null)
        setViewModal(false)
        setDeleteModal(false)
        fetchInit(tableState)
    }

    const onDisable = (id) => {
        const params = {
            component: id,
            school: selectedSchool?.id
        }
        setLoading(true)
        fetchRequest("api/course/component/set-inactive", "POST", params)
            .then(res=>{
                if (res.success) {
                    fetchInit(tableState)
                } else {
                    message(res.message)
                }
            })
            .catch(e=>{
                message(t('errorMessage.title'));
            })
            .finally(()=>{
                setLoading(false)
            })
    }

    const onDelete = () => {
        onModalClose()

        const params = {
            component: tempComponent?.id,
            school: selectedSchool?.id
        }
        setLoading(true)
        fetchRequest("api/course/component/delete", "POST", params)
            .then(res=>{
                if (res.success) {
                    fetchInit(tableState)
                } else {
                    message(res.message)
                }
            })
            .catch(e=>{
                message(t('errorMessage.title'));
            })
            .finally(()=>{
                setLoading(false)
            })
    }

    const fetchInit = (tableState = {}) => {
        const params = {
            ...tableState,
            school: selectedSchool?.id
        }
        setLoading(true)
        fetchRequest("api/course/component/index", "POST", params)
            .then(res=>{
                if (res.success) {
                    setList(res.components?.map(obj=>{
                        let contextMenuKeys = ['inactive']

                        if(!obj.isActive) {
                            contextMenuKeys = ['delete','edit']
                        }

                        return {
                            ...obj,
                            contextMenuKeys
                        }
                    }))
                    setTypes(res.componentTypes)
                } else {
                    message(res.message)
                }
            })
            .catch(e=>{
                message(t('errorMessage.title'));
            })
            .finally(()=>{
                setLoading(false)
            })
    }

    const getTableState = async () => {
        try {
            const storeData = await localStorage.getItem(tableStateKey)
            let params = {
                page: 1,
                pageSize: 10,
                search: "",
                sort: "",
                order: "asc",
            }
            if(storeData) {
                params = JSON.parse(storeData)
            }
            setTableState(params)
            fetchInit(params)
        } catch (e) {
            //
        }
    }

    useEffect(()=>{
        getTableState()
    },[])

    const breadcrumbs = useMemo(() => [
        { to: "", text: "Home" },
        { to: "onlineLesson/setting", text: t('onlineLesson.setting') }
    ], [])

    const config = useMemo(() => {
        return {
            showPagination: false,
            showFilter: false,
            showAllData: true, // optional
            tableMarginLess: true, // optional
            defaultSort: [{
                dataField: tableState?.sort || 'takenDate',
                order: tableState?.order || 'desc'
            }],
            defaultPageOptions: {
                page: tableState?.page || 1,
                sizePerPage: tableState?.pageSize || 10,
                search: tableState?.search || '',
            },
        }
    }, [])

    const columns = useMemo(() => {
        return [
            {
                dataField: "isActive",
                text: "",
                headerStyle: () => ({
                    width: 40,
                }),
                style: {
                    alignItems: "center",
                    justifyContent: 'center'
                },
                formatter: (cell) => {
                    return <div className={`table-circle ${cell === true && "active"}`} />;
                },
            },
            {
                dataField: "name",
                text: 'Бүрдэл',
                sort: true,
            },
            {
                dataField: "typeName",
                text: t("common.type"),
                sort: true,
            }
        ]
    }, [i18n.language])

    const contextMenus = useMemo(() => {
        return [
            {
                key: "edit",
                icon: <EditIcon />,
                title: t('action.edit'),
            },
            {
                key: "delete",
                icon: <TrashIcon />,
                title: t('action.delete')
            },
            {
                key: "inactive",
                icon: <InactiveIcon />,
                title: t('action.setInactive')
            }
        ]
    }, [i18n.language])

    return (
        <>
            <div className="page-title-container">
                <Row>
                    <Col md="7">
                        <h1 className="mb-0 pb-0 display-4">{t('onlineLesson.setting')}</h1>
                        <BreadcrumbList items={breadcrumbs} />
                    </Col>
                </Row>
            </div>

            <Button
                variant="primary add-button"
                className="mb-3 text-uppercase"
                onClick={() => setViewModal(true)}
            >
                <ControlPoint style={{ color: "white", marginRight: "4px" }} />
                {t('onlineLesson.addSetting')}
            </Button>

            <Body>
                <DTable
                    remote={true}
                    config={config}
                    columns={columns}
                    data={list}
                    contextMenus={contextMenus}
                    onContextMenuItemClick={onContextMenuItemClick}
                    onInteraction={onInteraction}
                    individualContextMenus
                    currentPage={tableState.page}
                />
            </Body>

            <SubmitModal onClose={onModalClose} component={tempComponent} open={viewModal} types={types}/>
            <DeleteModal
                show={deleteModal}
                onClose={onModalClose}
                onDelete={onDelete}
                title={t('warning.delete')}
            >
                {t('warning.delete_confirmation')}
                <br />
                <br />
                {t('warning.delete_confirmation_description')}
            </DeleteModal>

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
        </>
    )
}

export default Setting
