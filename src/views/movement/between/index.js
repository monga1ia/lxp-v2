import { React, useState, useEffect } from 'react'
import { Row, Col, Card, Button } from 'react-bootstrap'
import BreadcrumbList from 'components/breadcrumb-list/BreadcrumbList'
import ControlPointIcon from '@mui/icons-material/ControlPoint'
import message from 'modules/message'
import ViewModal from './modals/view'
import AddModal from './modals/add'
import HtmlHead from 'components/html-head/HtmlHead'
import { Link } from 'react-router-dom'
import DTable from 'modules/DataTable/DTable'
import { movementBetweenInit } from 'utils/fetchRequest/Urls'
import secureLocalStorage from 'react-secure-storage'
import { fetchRequest } from 'utils/fetchRequest'
import { useTranslation } from "react-i18next"
import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded'

const tableIndex = 'movement_between_table_index';

const index = () => {
    const locale="mn"
    const { t } = useTranslation();

    const [loading, setLoading] = useState(false)

    const title = t('movement.between');
    const description = "E-learning";
    const breadcrumbs = [
        { to: "", text: "Home" },
        { to: "movement/between", text: title }
    ];

    const [selectedTableDataId, setSelectedTableDataId] = useState(null)
    const [showAddModal, setShowAddModal] = useState(false)
    const [showViewModal, setShowViewModal] = useState(false)

    const [page, setPage] = useState(secureLocalStorage?.getItem(tableIndex) ? secureLocalStorage?.getItem(tableIndex).page : 1);
    const [pageSize, setPageSize] = useState(secureLocalStorage?.getItem(tableIndex) ? secureLocalStorage?.getItem(tableIndex).pageSize : 10);
    const [search, setSearch] = useState(secureLocalStorage?.getItem(tableIndex) ? secureLocalStorage?.getItem(tableIndex).search : '');
    const [order, setOrder] = useState(secureLocalStorage?.getItem(tableIndex) ? secureLocalStorage?.getItem(tableIndex).order : 'desc');
    const [sort, setSort] = useState(secureLocalStorage?.getItem(tableIndex) ? secureLocalStorage?.getItem(tableIndex).sort : 'createdDate');

    const [totalCount, setTotalCount] = useState(0);

    const config = {
        excelExport: true,
        printButton: true,
        defaultSort: [{
            dataField: sort,
            order: order
        }],
        defaultPageOptions: {
            page: page,
            sizePerPage: pageSize,
            search: search,
        },
    }

    const [tableData, setTableData] = useState([
            {id: 1, studentCode: 2323, firstName: "Sondor", lastName: "Agar"}, 
            {id: 2, studentCode: 1232, firstName: "Suhee", lastName: "aa"},
            {id: 3, studentCode: 1232, firstName: "Sergelen", lastName: "Baatar"},
            {id: 4, studentCode: 1232, firstName: "Siilen", lastName: "Balgan"},
            {id: 5, studentCode: 1232, firstName: "Sunder", lastName: "Basa"}
    ])          

    const columns = [
        {
            dataField: "createdDate",
            text: t('date'),
            sort: true
        },
        {
            dataField: "fromClassName",
            text: t('movement.from_class'),
            sort: true
        },
        {
            dataField: "toClassName",
            text: t('movement.to_class'),
            sort: true
        },
        {
            dataField: "studentCode",
            text: t('studentCode'),
            sort: true,
        },
        {
            dataField: "lastName",
            text: t('studentLastName'),
            sort: true,
        },
        {
            dataField: "firstName",
            text: t('studentFirstName'),
            sort: true,
            formatter: (cell, row) => { return <span className="underline" onClick={() => showModal(row)}>{cell}</span> }
        },
        {
            dataField: "createdUserName",
            text: t('created_user'),
            sort: true,
        }
    ]

    useEffect(() => {
        // if(search){
        //     init({
        //         page: page,
        //         pageSize: pageSize,
        //         search: search,
        //         sort,
        //         order
        //     })
        // } else {
        //     init()
        // }
    }, [])

    const init = (pagination) => {
        // setLoading(true)
        // fetchRequest(movementBetweenInit, 'POST', {
        //     page: pagination?.page || page,
        //     pageSize: pagination?.pageSize || pageSize,
        //     search: pagination?.search || '',
        //     sort: pagination?.sort || sort,
        //     order: pagination?.order || order,
        // })
        //     .then(res => {
        //         if (res.success) {
        //             const { movements, totalCount } = res.data
        //             setTableData(movements || [])
        //             setTotalCount(totalCount || 0)
        //         } else {
        //             message(res.data.message)
        //         }
        //         setLoading(false)
        //     })
        //     .catch(() => {
        //         message(t(locale)?.err?.error_occurred)
        //         setLoading(false)
        //     })
    }

    const closeModal = () => {
        setShowAddModal(false)
        setShowViewModal(false)
        setSelectedTableDataId(null)
    }

    const showModal = id => {
        setShowViewModal(true)
        setSelectedTableDataId(id)
    }

    const onUserInteraction = (object) => {
        if(object.page){
            if(object.search){
                let cloneData = {
                    page: 1,
                    pageSize: object.pageSize,
                    search: object.search,
                    sort: object.sort,
                    order: object.order,
                }

                setPage(1);
                setPageSize(object.pageSize);
                setSearch(object.search);
        
                secureLocalStorage?.setItem(tableIndex, cloneData);

                init(cloneData)
            } else {
                setPage(object.page);
                setPageSize(object.pageSize);
                setSearch(object.search);
                setSort(object.sort);
                setOrder(object.order);
        
                secureLocalStorage?.setItem(tableIndex, object);

                init(object)
            }
        }
    };
    return (
        <> 
            <HtmlHead title={title} description={description} />

            <div className="page-title-container mb-2">
                <Col md="7" className='p-0'>
                    <h1 className="mb-0 pb-0 display-4 relative">{title}</h1>
                    <BreadcrumbList items={breadcrumbs} />
                </Col>
            </div>  

            <div className='m-content'>
                        <div className='d-flex gap-2'>
                            <Button
                                onClick={() => setShowAddModal(true)}
                                className='btn btn-sm m-btn--pill btn-info m-btn--uppercase d-inline-flex mb-3'
                            >
                                <ControlPointIcon style={{ color: "white", marginRight: "4px" }} />
                                {t('action.register')}
                            </Button>
                        </div>
                        <div className='m-portlet br-12'>
                            <div className='m-portlet__body'>
                                <DTable
                                    remote
                                    config={config}
                                    data={tableData}
                                    columns={columns}
                                    locale={locale}
                                    onInteraction={onUserInteraction}
                                    totalDataSize={totalCount}
                                />
                            </div>
                        </div>
            </div>
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
            {
                showAddModal && 
                <AddModal
                    onClose={closeModal}
                    // id={selectedTableDataId}
                />
            }          
            {
                showViewModal && selectedTableDataId &&
                <ViewModal
                    onClose={closeModal}
                    id={selectedTableDataId}
                />
            }          
        </>
    )
}

export default index