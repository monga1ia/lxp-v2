import message from 'modules/message'
import EditModal from './modals/edit'
import Table from './components/table'
import DeleteModal from 'utils/deleteModal'
import InputTable from './components/inputTable'
import InputModal from './modals/inputModal'
import secureLocalStorage from 'react-secure-storage'
import { fetchRequest } from 'utils/fetchRequest'
import { Row, Col, Card } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import React, { useEffect, useRef, useState } from 'react'
import SyncRoundedIcon from '@mui/icons-material/SyncRounded'
import HtmlHead from 'components/html-head/HtmlHead';
import BreadcrumbList from 'components/breadcrumb-list/BreadcrumbList';
import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded'
// import { ESISEmployeeDelete, ESISEmployeeInit, ESISEmployeeLink, ESISEmployeeSubmit, ESISEmployeeSync } from 'utils/url'

const locale = secureLocalStorage?.getItem('selectedLang') || 'mn'

const index = () => {

    const { t } = useTranslation()
    const inputTableRef = useRef()
    const [loading, setLoading] = useState(false)

    const [roleId, setRoleId] = useState(null)
    const [roleName, setRoleName] = useState(null)

    const title = t('esis.title');
    const description = "E-learning";
    const breadcrumbs = [
        { to: "", text: "Home" },
        { to: "esis/employee", text: title }
    ];

    const [insertMode, setInsertMode] = useState(false)
    
    const [tableData, setTableData] = useState([
        {id: 9000000495636, esisId: 9000000495636, esisShortName: "Б.Золсайхан", esisLastName: "Базарсад", esisId: 90000004952636, esisLastName: "Базарсад", esisShortName: "Б.Золсайхан", esisTitle: "Ахлах  багш", eschoolUserId: 123123123},
        {id: 9000000305129, esisId: 9000000305129, esisShortName: "Д.Эрдэнэчимэг", esisLastName: "Даржаа", esisId: 90000004956346, esisLastName: "Базар", esisShortName: "Б.сайхан", esisTitle: "Ахлах ангийн цагийн багш"},
        {id: 9000000158302, esisId: 9000000158302, esisShortName: "М.Сансармаа", esisLastName: "Мухаршар", esisId: 90000004956326, esisLastName: "Бааза", esisShortName: "Б.Бааза", esisTitle: "цагийн ангийн цагийн багш"}
    ])
    const [selectedTableData, setSelectedTableData] = useState(null)

    const [showEditModal, setShowEditModal] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [showInputModal, setShowInputModal] = useState(false)

    const [updateTable, setUpdateTable] = useState(false)

    const loadInit = () => {
        console.log('init')
        // setLoading(true)
        // fetchRequest(ESISEmployeeInit, 'POST')
        //     .then((res) => {
        //         if (res.success) {
        //             const { teachers } = res.data
        //             setRoleId(res?.data?.roleId)
        //             setRoleName(res?.data?.roleName)
        //             setTableData(teachers || [])
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

    useEffect(() => {
        loadInit()
    }, [])

    const handleSubmit = newEmployees => {
        console.log('handleSubmit')
        // setLoading(true)
        // fetchRequest(ESISEmployeeSubmit, 'POST', { employees: newEmployees, roleId, roleName })
        //     .then((res) => {
        //         if (res.success) {
        //             message(res.data.message, res.success)
        //             setInsertMode(false)
        //             setUpdateTable(true)
        //             setTimeout(() => {
        //                 loadInit()
        //             }, 100)
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

    const handleDelete = () => {
        console.log('handleDelete')
        // setLoading(true)
        // fetchRequest(ESISEmployeeDelete, 'POST', { esisPersonId: selectedTableData?.id, user: selectedTableData?.eschoolUserId })
        //     .then((res) => {
        //         if (res.success) {
        //             const { esisPersonId } = res.data
        //             message(res.data.message, res.success)

        //             let users = [...tableData]

        //             for (let u = 0; u < users.length; u++) {
        //                 if (users[u].id.toString() === esisPersonId.toString()) {
        //                     users[u].eschoolUserId = null;
        //                     users[u].eschoolCode = null;
        //                     users[u].eschoolLastName = null;
        //                     users[u].eschoolFirstName = null;
        //                     users[u].eschoolTitle = null;
        //                     users[u].eschoolLoginName = null;
        //                     break;
        //                 }
        //             }
        //             setTableData(users)
        //             setUpdateTable(true)
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

    const handleEdit = param => {
        console.log('handleEdit')
        // setLoading(true)
        // fetchRequest(ESISEmployeeLink, 'POST', { ...param, submit: 1 })
        //     .then((res) => {
        //         if (res.success) {
        //             const { userId, esisPersonId, eschoolCode, eschoolTitle,
        //                 eschoolFirstName, eschoolLastName, eschoolLoginName } = res.data
        //             message(res.data.message, res.success)

        //             const users = [...tableData];
        //             for (let u = 0; u < users.length; u++) {
        //                 if (users[u].id.toString() === (esisPersonId || '').toString()) {
        //                     users[u].eschoolUserId = userId;
        //                     users[u].eschoolCode = eschoolCode;
        //                     users[u].eschoolTitle = eschoolTitle;
        //                     users[u].eschoolFirstName = eschoolFirstName;
        //                     users[u].eschoolLastName = eschoolLastName;
        //                     users[u].eschoolLoginName = eschoolLoginName;
        //                 }
        //             }
        //             setTableData(users);
        //             setUpdateTable(true)
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

    const openModal = (modal, row) => {
        if (!modal || !row)
            return
        setSelectedTableData(row)
        if (modal === 'delete')
            setShowDeleteModal(true)
        else if (modal === 'edit')
            setShowEditModal(true)
    }

    const inputModalHandle = (e, data) => {
        setShowInputModal(true)
    }

    const closeModal = () => {
        setShowEditModal(false)
        setShowInputModal(false)
        setShowDeleteModal(false)
        setSelectedTableData(null)
    }

    const filterNonEmployee = (list) => {
        return list.filter(obj => {
            return !obj.eschoolUserId || obj.eschoolUserId.length === 0
        })
    }

    const onTableRendered = () => {
        const clone = [...tableData];
        setTableData([])
        setTimeout(() => {
            setTableData(clone)
        }, 100)
        setUpdateTable(false)
    }

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

                <div className='d-flex justify-content-between align-items-center mb-3'>
                    <div>
                        {
                            filterNonEmployee(tableData).length > 0 && <button
                                className='btn btn-sm m-btn--pill btn-info m-btn--uppercase d-inline-flex'
                                onClick={() => inputModalHandle()}
                                // {/* onClick={() => inputTableRef?.current?.submit()} */}
                            >
                                <AddCircleOutlineRoundedIcon />
                                <span className='ml-2'>{t('esis.createUser')}</span>
                            </button>
                        }
                    </div>
                    <button
                        style={{ backgroundColor: '#009cff' }}
                        className='btn btn-sm m-btn--pill m-btn--uppercase d-inline-flex text-white'
                        onClick={loadInit}
                    >
                        <SyncRoundedIcon />
                        <span className='ml-2'>SYNC</span>
                    </button>
                </div>
                <div className='m-portlet br-12'>
                    <div className='m-portlet__body'>
                        {
                            insertMode
                                ? <InputTable
                                    data={filterNonEmployee(tableData)}
                                    ref={inputTableRef}
                                    onSubmit={handleSubmit}
                                />
                                : <Table
                                    data={tableData}
                                    openModal={openModal}
                                    updateTable={updateTable}
                                    onTableRender={onTableRendered}
                                />
                        }
                    </div>
                </div>
            </div>
            {
                showEditModal && selectedTableData?.id &&
                <EditModal
                    onClose={closeModal}
                    onSubmit={handleEdit}
                    data={filterNonEmployee(tableData)}
                    updateTable={updateTable}
                    esisUser={selectedTableData}
                />
            }
            {
                showInputModal &&
                <InputModal
                    onClose={closeModal}
                    onSubmit={handleEdit}
                    data={filterNonEmployee(tableData)}
                />
            }
            {
                showDeleteModal && selectedTableData?.id &&
                <DeleteModal
                    onClose={closeModal}
                    onDelete={handleDelete}
                    locale={locale}
                    title={t('delete')}
                >
                    {t('delete_confirmation')}
                    <br />
                    <br />
                    {t('delete_confirmation_description')}
                </DeleteModal>
            }
            {
                loading &&
                <>
                    <div className='blockUI blockOverlay' />
                    <div className='blockUI blockMsg blockPage'>
                        <div className='m-loader m-loader--brand m-loader--lg' />
                    </div>
                </>
            }
        </>
    )
}

export default index