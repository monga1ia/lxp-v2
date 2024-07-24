import React, { useEffect, useRef, useState } from 'react'
import { Row, Col, Card, Button } from 'react-bootstrap'
import secureLocalStorage from 'react-secure-storage'
import { NavLink, useLocation } from "react-router-dom"
import { useNavigate } from 'react-router'
// import { Link, useNavigate } from 'react-router-dom'
import { useHistory } from 'react-router-dom'
import { useSelector } from 'react-redux'
import message from 'modules/message'
import TreeView from 'modules/TreeView'
import HtmlHead from 'components/html-head/HtmlHead'
import BreadcrumbList from 'components/breadcrumb-list/BreadcrumbList'
import DTable from 'modules/DataTable/DTable'
import ControlPointIcon from '@mui/icons-material/ControlPoint'
import AddModal from './modals/add'
import RegistrationSheetModal from './modals/registrationSheet'
import ImageModal from 'utils/imageModal'
import PrintData from './components/printData'
import { useReactToPrint } from 'react-to-print'
import { useTranslation } from "react-i18next"
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto'
import FactCheckOutlinedIcon from '@mui/icons-material/FactCheckOutlined'
import FolderSharedIcon from '@mui/icons-material/FolderShared'
import DayPickerInput from "react-day-picker/DayPickerInput"
import ExcelModal from './modals/excel'
import { fetchRequest } from 'utils/fetchRequest'
import UploadFileRoundedIcon from '@mui/icons-material/UploadFileRounded'
import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded'
import { movementInExcelUpload, movementInInit, movementInSubmitAvatar } from 'utils/fetchRequest/Urls'

const localStorageSelectedTree = 'movement_in_selected_tree_index'
const tableIndex = 'movement_in_table_index'

const index = () => {
    const locale="mn"
    const { t } = useTranslation();
    // const navigate = useNavigate()
    const printRef = useRef()
    const printMultiRef = useRef()

    const [loading, setLoading] = useState(false)

    // const [treeData, setTreeData] = useState([])
    const [selectedTreeData, setSelectedTreeData] = useState(secureLocalStorage.getItem(localStorageSelectedTree) || {})

    const [tableData, setTableData] = useState([
        {id: 11, className: '3a', code: 2323, firstName: "AAA", lastName: "SS"}, 
        {id: 12, className: '11a', code: 1232, firstName: "Julia", lastName: "Julie"}
    ]);
    const [selectedTableData, setSelectedTableData] = useState({})

    const [school, setSchool] = useState({})

    
    const [showAddModal, setShowAddModal] = useState(false)    
    const [showExcelModal, setShowExcelModal] = useState(false)
    const [showImageModal, setShowImageModal] = useState(false)
    const [showRegistrationSheetModal, setShowRegistrationSheetModal] = useState(false)
    const [canMultiPrint, setCanMultiPrint] = useState(true)

    const [page, setPage] = useState(secureLocalStorage?.getItem(tableIndex) ? secureLocalStorage?.getItem(tableIndex).page : 1);
    const [pageSize, setPageSize] = useState(secureLocalStorage?.getItem(tableIndex) ? secureLocalStorage?.getItem(tableIndex).pageSize : 50);
    const [search, setSearch] = useState(secureLocalStorage?.getItem(tableIndex) ? secureLocalStorage?.getItem(tableIndex).search : '');
    const [order, setOrder] = useState(secureLocalStorage?.getItem(tableIndex) ? secureLocalStorage?.getItem(tableIndex).order : 'asc');
    const [sort, setSort] = useState(secureLocalStorage?.getItem(tableIndex) ? secureLocalStorage?.getItem(tableIndex).sort : 'firstName');

    const [totalCount, setTotalCount] = useState(0);

    const title = t('movement.in');
    const description = "E-learning";
    const breadcrumbs = [
        { to: "", text: "Home" },
        { to: "movement/in", text: title }
    ];

    const config = {
        excelExport: true,
        printButton: true,
        excelFileName: `${secureLocalStorage.getItem('selectedSchool')?.text}-${t('movement.in')}`,
        defaultSort: [{
            dataField: 'firstName',
            order: 'asc'
        }],
        defaultPageOptions: {
            page: 1,
            sizePerPage: 10,
        }
        // defaultPageOptions: {
        //     page: page,
        //     sizePerPage: pageSize,
        //     search: search,
        //     sizePerPageList: [50, 100]
        // },
    }

    const columns = [
        {
            dataField: 'startDate',
            text: t('student.entry_date'),
            sort: true,
            formatter: (cell) => cell?.date?.split(' ')[0]
        },
        {
            dataField: 'className',
            text: t('className'),
            sort: true,
        },
        {
            dataField: 'avatar',
            text: t('photo'),
            sort: true,
            width: 40,
            align: 'center',
            formatter: (cell) =>
                <img className='img-responsive img-circle'
                     src={cell || '/img/profile/avatar.png'}
                     width={40} height={40} alt='profile picture'
                     onError={(e) => {
                         e.target.onError = null
                         e.target.src = '/img/profile/avatar.png'
                     }}
                />
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
            align: 'left',
        },
        {
            dataField: 'firstName',
            text: t('studentFirstName'),
            sort: true,
            align: 'left',
            formatter: (cell, row) =>
                <span
                    className='underline'
                    onClick={() => handleContextMenuClick(row, 'studentBook')}
                >
                    {cell}
                </span>
        },
        {
            dataField: 'createdUserName',
            text: t('created_user'),
            sort: true,
            align: 'left',
        },
        {
            dataField: 'createdDate',
            text: t('created_date'),
            sort: true,
            align: 'left',
            formatter: (cell) => cell?.date?.split('.')[0]
        },
        {
            dataField: 'esisPersonId',
            text: t('esis.title'),
            sort: true,
            hidden: true,
            align: 'right',
        },
    ]

    const contextMenus = [
        {
            key: 'avatar',
            icon: <AddAPhotoIcon sx={{ fontSize: '2rem !important', color: '#ff5b1d' }} />,
            title: t('insert_photo')
        },
        {
            key: 'sheet',
            icon: <FactCheckOutlinedIcon sx={{ fontSize: '2rem !important', color: '#ff5b1d' }} />,
            title: t('movement.register_sheet')
        },
        {
            key: 'studentBook',
            icon: <FolderSharedIcon sx={{ fontSize: '2rem !important', color: '#ff5b1d' }} />,
            title: t('student.book_title')
        }
    ]

const [treeData, setTreeData] = useState([{
    title: 'first level',
    value: '0-0',
    key: 1,
    selectable: true,
    children: [{
            title: 'second level',
            value: '0-0',
            key: 2,
            selectable: true,
            children: [
                {
                    title: 'third level',
                    value: '0-0-0-0',
                    key: 3,
                    selectable: true,
                },{
                    title: 'third level',
                    value: '0-0-0-0',
                    key: 4,
                    selectable: true,
                },
            ]
        },]
    }])

   
// useEffect(() => {
//     if (selectedTreeData) {
//         init(selectedTreeData.key, {
//             page: page,
//             sizePerPage: pageSize,
//             search: search,
//             sort,
//             order
//         })
//     } else {
//         init()
//     }

// }, [selectedTreeData])

const init = (treeId, pagination) => {
    setLoading(true)
    // fetchRequest(movementInInit, 'POST', {
    //     grade: treeId || selectedTreeData?.key,
    //     page: pagination?.page || page,
    //     pageSize: pagination?.pageSize || pageSize,
    //     search: pagination?.search || '',
    //     sort: pagination?.sort,
    //     order: pagination?.order,
    // })
        // .then((res) => {
        //     if (res.success) {
        //         const { grades, school, movements, totalCount, multiRegistrationSheet } = res.data
        //         setSchool(school || [])
        //         setTreeData(grades || [])
        //         setTableData(movements || [])
        //         setTotalCount(totalCount)
        //         setCanMultiPrint(multiRegistrationSheet)
        //         if (Object.keys(selectedTreeData).length === 0) {
        //             if (grades && grades.length > 0) {
        //                 setSelectedTreeData({
        //                     key: grades[0].key
        //                 })
        //             }
        //         }
        //     } else {
        //         message(res.data.message)
        //     }
        //     setLoading(false)
        // })
        // .catch(() => {
        //     message(t('err.error_occurred'))
        //     setLoading(false)
        // })
}

const handleExcelUpload = data => {
    setLoading(true)
    // fetchRequest(movementInExcelUpload, 'POST', { details: JSON.stringify(data), submit: 1 })
    //     .then((res) => {
    //         if (res.success) {
    //             init()
    //             closeModal()
    //             message(res.data.message, res.success)
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

const handleAvatarUpload = params => {
    setLoading(true)
    // fetchRequest(movementInSubmitAvatar, 'POST', { photo: params?.image, student: selectedTableData?.studentId })
    //     .then((res) => {
    //         if (res.success) {
    //             init()
    //             closeModal()
    //             message(res.data.message, res.success)
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

const getCheckedStudents = () => {
    const data = [...tableData]
    const checkedStudents = []
    for (let d = 0; d < data?.length; d++) {
        if (data[d].checkable) {
            checkedStudents.push(data[d])
        }
    }
    return checkedStudents
}

const handlePrint = useReactToPrint({
    suppressErrors: true,
    content: () => printRef.current,
    onPrintError: () => { message(t('err.error_occurred')) },
    pageStyle: '@page{size: auto!important; margin: 0cm 1cm!important}',
    documentTitle: `${selectedTableData ? (selectedTableData?.firstName + ' - ') : ''}${t('movement.register_sheet')}`,
})

const handleMultiPrint = useReactToPrint({
    suppressErrors: true,
    content: () => printMultiRef.current,
    onPrintError: () => { message(t('err.error_occurred')) },
    pageStyle: '@page{size: auto!important; margin: 0cm 1cm!important}',
    documentTitle: `${getCheckedStudents()?.length === 1 ? (getCheckedStudents()[0]?.firstName + ' - ') : ''}${t('movement.register_sheet')}`,
})

const handleContextMenuClick = (student, key) => {
    if (student?.id && key) {
        setSelectedTableData(student)
        if (key === 'avatar') {
            setShowImageModal(true)
        } else if (key === 'sheet') {
            setShowRegistrationSheetModal(true)
        } else if (key === 'studentBook') {
            navigate('/student/book', {
                state: {
                    id: student?.studentId,
                    urlData: {
                        backUrl: '/movement/in',
                    }
                }
            })
        }
    }
}

const closeModal = () => {
    setShowExcelModal(false)
    setShowAddModal(false)
    setShowImageModal(false)
    setSelectedTableData({})
    setShowRegistrationSheetModal(false)
}

const handleTreeChange = node => {
    setPage(1);

    let object = {
        page: 1,
        pageSize: pageSize,
        search: search,
        sort: sort,
        order: order
    }

    setSelectedTreeData(node)
    secureLocalStorage?.setItem(localStorageSelectedTree, node);
    secureLocalStorage?.setItem(tableIndex, object);
}

const onUserInteraction = (object) => {
    if (object.page) {
        if (object.search) {
            let cloneData = {
                page: 1,
                pageSize: object.pageSize,
                search: object.search,
                sort: object.sort,
                order: object.order
            }

            setPage(1);
            setPageSize(object.pageSize);
            setSearch(object.search);
            setOrder(object.order);
            setSort(object.sort);

            secureLocalStorage?.setItem(tableIndex, cloneData);

            init(selectedTreeData.key, cloneData)
        } else {
            setPage(object.page);
            setPageSize(object.pageSize);
            setSearch(object.search);
            setOrder(object.order);
            setSort(object.sort);

            secureLocalStorage?.setItem(tableIndex, object);

            init(selectedTreeData.key, object)
        }
    }
};

const onCheckedChange = (key, rowIndex, checked, id) => {
    console.log('key', key, "rowIndex", rowIndex, "checked", checked, "id",id);
    const data = [...tableData]
    if (key === 'allCheck') {
        for (let d = 0; d < data?.length; d++) {
            data[d].checkable = checked
        }
    } else if (key === 'row') {
        for (let d = 0; d < data?.length; d++) {
            if (data[d].id === id) {
                data[d].checkable = checked
                break;
            }
        }
    }
    setTableData(data)
}
    return (
        <>
                <div className='d-none'>
                    <PrintData
                        ref={printRef}
                        school={school}
                        students={[selectedTableData]}
                    />
                    <PrintData
                        ref={printMultiRef}
                        school={school}
                        students={getCheckedStudents()}
                    />
                </div>  
            <HtmlHead title={title} description={description} />

            <div className="page-title-container mb-2">
                <Col md="7" className='p-0'>
                    <h1 className="mb-0 pb-0 display-4 relative">{title}</h1>
                    <BreadcrumbList items={breadcrumbs} />
                </Col>
            </div>  

            <div className='m-content'>
                <Row className=''>
                    <Col xl="2" xxl="2">
                        <div className='m-portlet br-12'>
                            <div className='m-portlet__body'>
                                <TreeView
                                        defaultExpandAll
                                        treeData={treeData}
                                        selectedNodes={[selectedTreeData?.key]}
                                        onSelect={(key, info) => handleTreeChange(info?.node)}
                                    />
                            </div>
                        </div>
                    </Col>

                    <Col xl="10" xxl="10">
                        <div className='d-flex gap-2'>
                            {/* { selectedTreeData?.key?.toString()?.startsWith('class') == 0 &&  */}
                            <Button
                                onClick={() => setShowAddModal(true)}
                                className='btn btn-sm m-btn--pill btn-info m-btn--uppercase d-inline-flex mb-3'
                            >
                                <ControlPointIcon style={{ color: "white", marginRight: "4px" }} />
                                {t('action.register')}
                            </Button>
                        {/* } */}
                        {/* { ROOT CODE
                            selectedTreeData?.key?.toString()?.startsWith('class') &&
                            <Link
                                to='/movement/in/create'
                                state={{ grade: selectedTreeData?.key, isGenerateCode: school?.isGenerateCode }}
                                className='btn btn-sm m-btn--pill btn-info m-btn--uppercase d-inline-flex mb-3'
                            >
                                <AddCircleOutlineRoundedIcon />
                                <span className='ml-2'>{t('action.register')}</span>
                            </Link>
                            }*/}
                            {
                                    // secureLocalStorage?.getItem('personInfo')?.roles?.includes('ROLE_EXCEL_UPLOADER') && secureLocalStorage?.getItem('selectedSchool')?.value &&
                                    <button
                                        onClick={() => setShowExcelModal(true)}
                                        className='btn btn-sm m-btn--pill btn-info m-btn--uppercase d-inline-flex align-items-center mb-3'
                                    >
                                        <UploadFileRoundedIcon />
                                        <span className='ml-2'>{t('excel_import')}</span>
                                    </button>
                                }
                                {
                                    getCheckedStudents() && getCheckedStudents()?.length > 0 &&
                                    <button
                                        onClick={handleMultiPrint}
                                        className='btn btn-sm m-btn--pill btn-info m-btn--uppercase d-inline-flex align-items-center mb-3'
                                    >
                                        <span className='ml-2'>{t('movement.print_register_sheet')}</span>
                                    </button>
                                }
                        </div>
                        <div className='m-portlet br-12'>
                            <div className='m-portlet__body'>
                                <DTable
                                    remote
                                    locale={locale}
                                    config={config}
                                    data={tableData}
                                    checkable={canMultiPrint}
                                    onCheckable={onCheckedChange}
                                    columns={columns}
                                    contextMenus={contextMenus}
                                    onContextMenuItemClick={(id, key, row) => handleContextMenuClick(row, key)}
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
            {/* {
                showExcelModal &&
                <ExcelModal
                    onClose={closeModal}
                    open={showExcelModal}
                    onSubmit={handleExcelUpload}
                />
            } */}
            {
                showAddModal && 
                    <AddModal
                        onClose={closeModal}
                    />
            }
            {
                showImageModal && selectedTableData?.id &&
                <ImageModal
                    onClose={closeModal}
                    onSubmit={handleAvatarUpload}
                /> 
            }
            {
                showRegistrationSheetModal && selectedTableData?.id &&
                <RegistrationSheetModal
                    onClose={closeModal}
                    onSubmit={handlePrint}
                />
            }             
        </>
    );
}

export default index;