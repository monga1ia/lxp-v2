import message from 'modules/message'
import EditModal from './modals/edit'
import Table from './components/table'
import DeleteModal from 'utils/deleteModal'
import InputTable from './components/inputTable'
import secureLocalStorage from 'react-secure-storage'
import {fetchRequest} from 'utils/fetchRequest'
import { Row, Col } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import HtmlHead from 'components/html-head/HtmlHead';
import BreadcrumbList from 'components/breadcrumb-list/BreadcrumbList';
import CreateClassModal from './modals/createModal'
import React, {useEffect, useRef, useState} from 'react'
import SyncRoundedIcon from '@mui/icons-material/SyncRounded'
import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded'
// import {ESISClassDelete, ESISClassInit, ESISClassLink, ESISClassSubmit, ESISClassSync} from 'utils/fetchRequest/Urls'

const locale = secureLocalStorage?.getItem('selectedLang') || 'mn'

const index = () => {

    const { t } = useTranslation()
    const inputTableRef = useRef()
    const [loading, setLoading] = useState(false)
    
    const title = t('menu.esis.class');
    const description = "E-learning";
    const breadcrumbs = [
        { to: "", text: "Home" },
        { to: "esis/class", text: title }
    ];

    const [insertMode, setInsertMode] = useState(false)

    const [tableData, setTableData] = useState([
        {id: 123, eschoolClassId: 123123, esisGradeName: 9000000495636, esisClassCode: 9000000495636, esisClassName: "Б.Золсайхан", esisClassTeacher: "Базарсад", eschoolClassName: 90000004952636, eschoolTeacher: "Базарсад", eschoolShift: "Б.Золсайхан", eschoolScoreType: "Ахлах  багш", eschoolUserId: 123123123},
        {id: 232, eschoolClassId: 372432, esisGradeName: 9000000305129, esisClassCode: 9000000305129, esisClassName: "Д.Эрдэнэчимэг", esisClassTeacher: "Даржаа", eschoolClassName: 90000004956346, eschoolTeacher: "Базар", eschoolShift: "Б.сайхан", eschoolScoreType: "Ахлах ангийн цагийн багш"},
        {id: 293,  esisGradeName: 9000000158302, esisClassCode: 9000000158302, esisClassName: "М.Сансармаа", esisClassTeacher: "Мухаршар", eschoolClassName: 90000004956326, eschoolTeacher: "Бааза", eschoolShift: "Б.Бааза", eschoolScoreType: "цагийн ангийн цагийн багш"}
    ])
    const [selectedTableData, setSelectedTableData] = useState(null)

    const [showEditModal, setShowEditModal] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [updateTableView, setUpdateTableView] = useState(false)
    const [showCreateClassModal, setShowCreateClassModal] = useState(false)

    const loadInit = () => {
        console.log('initialize')
        // setLoading(true)
        // fetchRequest(ESISClassInit, 'POST')
        //     .then((res) => {
        //         if (res.success) {
        //             const {classes} = res.data
        //             setTableData(classes || [])
        //         } else {
        //             message(res.data.message)
        //         }
        //         setLoading(false)
        //     })
        //     .catch(() => {
        //         message(t('err.error_occurred)')
        //         setLoading(false)
        //     })
    }

    // useEffect(() => {

    // }, [updateTableView])

    // useEffect(() => {
    //     loadInit()
    // }, [])

    const handleSubmit = classes => {
        console.log('handleSubmit', inputTableRef?.current?.submit())
        // setLoading(true)
        // fetchRequest(ESISClassSubmit, 'POST', {classes})
        //     .then((res) => {
        //         if (res.success) {
        //             message(res.data.message, res.success)
        //             setInsertMode(false)

        //             setTimeout(() => {
        //                 loadInit()
        //             }, 100)
        //         } else {
        //             message(res.data.message)
        //         }
        //         setLoading(false)
        //     })
        //     .catch(() => {
        //         message(t('err.error_occurred))
        //         setLoading(false)
        //     })
    }

    const handleDelete = () => {
        console.log('handle Delete')
        // setLoading(true)
        // fetchRequest(ESISClassDelete, 'POST', {class: selectedTableData?.eschoolClassId})
        //     .then((res) => {
        //         if (res.success) {
        //             message(res.data.message, res.success)
        //             loadInit()
        //             closeModal()
        //         } else {
        //             message(res.data.message)
        //         }
        //         setLoading(false)
        //     })
        //     .catch(() => {
        //         message(t('err.error_occurred))
        //         setLoading(false)
        //     })
    }

    const handleEdit = param => {
        console.log('handleEdit')
        // setLoading(true)
        // fetchRequest(ESISClassLink, 'POST', {...param, submit: 1})
        //     .then((res) => {
        //         if (res.success) {
        //             loadInit()
        //             closeModal()
        //         } else {
        //             message(res.data.message)
        //         }
        //         setLoading(false)
        //     })
        //     .catch(() => {
        //         message(t('err.error_occurred))
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

    const closeModal = () => {
        setShowEditModal(false)
        setShowDeleteModal(false)
        setSelectedTableData(null)
        setShowCreateClassModal(false)
    }

    const filterNonEmployee = (list) => {
        return list.filter(obj => {
            return !obj.eschoolClassId || obj.eschoolClassId.length === 0
        })
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
                                onClick={() => setShowCreateClassModal(true)}
                            >
                                <AddCircleOutlineRoundedIcon className='MuiSvg-customSize'/>
                                <span className='ml-2'>{t('esis.createClass')}</span>
                            </button>
                        }
                    </div>
                    <button
                        style={{backgroundColor: '#009cff'}}
                        className='btn btn-sm m-btn--pill m-btn--uppercase d-inline-flex text-white'
                        onClick={loadInit}
                    >
                        <SyncRoundedIcon/>
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
                                    update={updateTableView}
                                    openModal={openModal}
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
                    esisClass={selectedTableData}
                />
            }
            {
                showCreateClassModal &&
                <CreateClassModal
                    onClose={closeModal}
                    onSubmit={handleSubmit}
                    ref={inputTableRef}
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
                    <br/>
                    <br/>
                    {t('delete_confirmation_description')}
                </DeleteModal>
            }
            {
                loading &&
                <>
                    <div className='blockUI blockOverlay'/>
                    <div className='blockUI blockMsg blockPage'>
                        <div className='m-loader m-loader--brand m-loader--lg'/>
                    </div>
                </>
            }
        </>
    )
}

export default index