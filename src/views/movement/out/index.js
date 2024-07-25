import { React, useState, useEffect } from 'react'
import { Row, Col, Button } from 'react-bootstrap'
import BreadcrumbList from 'components/breadcrumb-list/BreadcrumbList'
import ControlPointIcon from '@mui/icons-material/ControlPoint'
import message from 'modules/message'
import ViewModal from './modals/view'
import HtmlHead from 'components/html-head/HtmlHead'
import { Link } from 'react-router-dom'
import RestoreModal from './modals/restore'
import DTable from 'modules/DataTable/DTable'
import secureLocalStorage from 'react-secure-storage'
import { fetchRequest } from 'utils/fetchRequest'
import BadgeTwoToneIcon from '@mui/icons-material/BadgeTwoTone'
import { movementOutInit, movementOutRestore } from 'utils/fetchRequest/Urls'
import PreviewTwoToneIcon from '@mui/icons-material/PreviewTwoTone'
import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded'
import AddModal from './modals/add'
import { useTranslation } from "react-i18next"

const tableIndex = 'movement_out_table_index'

const index = () => {
    const locale = secureLocalStorage?.getItem('selectedLang') || 'mn'
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false)

    const [selectedTableDataId, setSelectedTableDataId] = useState(null)

    const [showAddModal, setShowAddModal] = useState(false) 
    const [showViewModal, setShowViewModal] = useState(false)
    const [showRestoreModal, setShowRestoreModal] = useState(false)

    const [page, setPage] = useState(secureLocalStorage?.getItem(tableIndex) ? secureLocalStorage?.getItem(tableIndex).page : 1);
    const [pageSize, setPageSize] = useState(secureLocalStorage?.getItem(tableIndex) ? secureLocalStorage?.getItem(tableIndex).pageSize : 10);
    const [search, setSearch] = useState(secureLocalStorage?.getItem(tableIndex) ? secureLocalStorage?.getItem(tableIndex).search : '');
    const [order, setOrder] = useState(secureLocalStorage?.getItem(tableIndex) ? secureLocalStorage?.getItem(tableIndex).order : 'desc');
    const [sort, setSort] = useState(secureLocalStorage?.getItem(tableIndex) ? secureLocalStorage?.getItem(tableIndex).sort : 'createdDate');

    const [totalCount, setTotalCount] = useState(0);

    const title = t('movement.out_title');
    const description = "E-learning";
    const breadcrumbs = [
        { to: "", text: "Home" },
        { to: "movement/out", text: title }
    ];

    const [tableData, setTableData] = useState([
        {id: 11, className: '5a', code: 2323, firstName: "Harry", lastName: "Meggi"}, 
        {id: 12, className: '11a', code: 1232, firstName: "Julia", lastName: "Julie"},
        {id: 13, className: '9a', code: 522, firstName: "Joe", lastName: "Joy"}
    ]);

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

    const contextMenus = [
        {
            key: 'view',
            icon: <PreviewTwoToneIcon sx={{ fontSize: '2rem !important', color: '#ff5b1d' }} />,
            title: t('view'),
        },
        {
            key: 'restore',
            icon: <BadgeTwoToneIcon sx={{ fontSize: '2rem !important', color: '#ff5b1d' }} />,
            title: t('student.registration_undo'),
        },
    ]

    const columns = [
        {
            dataField: 'createdDate',
            text: t('date'),
            sort: true
        },
        {
            dataField: 'className',
            text: t('className'),
            sort: true
        },
        {
            dataField: 'studentCode',
            text: t('studentCode'),
            sort: true,
        },
        {
            dataField: 'lastName',
            text: t('studentLastName'),
            sort: true,
        },
        {
            dataField: 'firstName',
            text: t('studentFirstName'),
            sort: true,
            formatter: (cell, row) => { return <span className='underline' onClick={() => handleContextMenuClick(row?.id, 'view')}>{cell}</span> }
        },
        {
            dataField: 'createdUserName',
            text: t('created_user'),
            sort: true,
        }
    ]

    // useEffect(() => {
    //     if(search){
    //         init({
    //             page: page,
    //             sizePerPage: pageSize,
    //             search: search,
    //             order,
    //             sort
    //         })
    //     } else {
    //         init()
    //     }
    // }, [])

    const init = (pagination) => {
        setLoading(true)
        // fetchRequest(movementOutInit, 'POST', {
        //     page: pagination?.page || page,
        //     pageSize: pagination?.pageSize || pageSize,
        //     search: pagination?.search || '',
        //     order: pagination?.order || order,
        //     sort: pagination?.sort || sort,
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
        //         message(t('err.error_occurred'))
        //         setLoading(false)
        //     })
    }

    const handleRestore = () => {
        setLoading(true)
        // fetchRequest(movementOutRestore, 'POST', { movement: selectedTableDataId })
        //     .then(res => {
        //         if (res.success) {
        //             message(res.data.message, res.success)
        //             const { movements } = res.data
        //             setTableData(movements || [])
        //             closeModal()
        //         } else {
        //             message(res.data.message)
        //         }
        //         setLoading(false)
        //     })
        //     .catch(() => {
        //         message(t('err.error_occurred'))
        //         setLoading(false)
        //     })
    }

    const closeModal = () => {
        setShowViewModal(false)
        setShowRestoreModal(false)
        setSelectedTableDataId(null)
        setShowAddModal(false)
    }
    const handleContextMenuClick = (id, key) => {
        if (id && key) {
            setSelectedTableDataId(id)
            if (key == 'view') {
                setShowViewModal(true)
            } else if (key == 'restore') {
                setShowRestoreModal(true)
            }
        }
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
                <Row className=''>
                    <Col xl="12" xxl="12">
                        <div className='d-flex gap-2'>
                            <button
                                onClick={() => setShowAddModal(true)}
                                className='btn btn-sm m-btn--pill btn-info m-btn--uppercase d-inline-flex mb-3'
                            >
                                <ControlPointIcon style={{ color: "white", marginRight: "4px" }} />
                                {t('action.register')}
                            </button>                        
                        </div>
                        <div className='m-portlet br-12'>
                            <div className='m-portlet__body'>
                                <DTable
                                    remote
                                    locale={locale}
                                    config={config}
                                    data={tableData}
                                    columns={columns}
                                    contextMenus={contextMenus}
                                    onContextMenuItemClick={handleContextMenuClick}
                                    onInteraction={onUserInteraction}
                                    totalDataSize={totalCount}
                                />
                            </div>
                        </div>
                    </Col>
                </Row>
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
                    />
            }
            {
                showViewModal && selectedTableDataId &&
                    <ViewModal
                        onClose={closeModal}
                        id={selectedTableDataId}
                    />
            }
            {
                showRestoreModal && selectedTableDataId &&
                    <RestoreModal
                        onClose={closeModal}
                        id={selectedTableDataId}
                        onSubmit={handleRestore}
                    />
            }             
        </>
    )
}

export default index