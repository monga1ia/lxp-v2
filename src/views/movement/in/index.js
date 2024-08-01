import React, { useEffect, useRef, useState } from 'react'
import { Row, Col, Card, Button } from 'react-bootstrap'
import secureLocalStorage from 'react-secure-storage'
import { NavLink, useLocation } from "react-router-dom"
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
import { movementInIndex, movementInCreate, movementInAvatar } from 'utils/fetchRequest/Urls'

const localStorageSelectedTree = 'movement_in_selected_tree_index'
const tableIndex = 'movement_in_table_index'

const index = () => {
    const locale = "mn"
    const { t } = useTranslation();
    const { selectedSchool } = useSelector(state => state.schoolData);

    const history = useHistory();

    const printRef = useRef()
    const printMultiRef = useRef()

    const [initLoaded, setInitLoaded] = useState(false)

    const [loading, setLoading] = useState(false)

    const [selectedTreeData, setSelectedTreeData] = useState(secureLocalStorage.getItem(localStorageSelectedTree) || [])

    const [tableData, setTableData] = useState([]);
    const [selectedTableData, setSelectedTableData] = useState({})

    const [schoolInfo, setSchoolInfo] = useState({})

    const [showAddModal, setShowAddModal] = useState(false)
    const [showExcelModal, setShowExcelModal] = useState(false)
    const [showImageModal, setShowImageModal] = useState(false)
    const [showRegistrationSheetModal, setShowRegistrationSheetModal] = useState(false)
    const [canMultiPrint, setCanMultiPrint] = useState(false)

    const [tableState, setTableState] = useState({
        filter: {},
        page: 1,
        pageSize: 50,
        search: '',
        sort: 'firstName',
        order: 'asc'
    })


    // const [page, setPage] = useState(secureLocalStorage?.getItem(tableIndex) ? secureLocalStorage?.getItem(tableIndex).page : 1);
    // const [pageSize, setPageSize] = useState(secureLocalStorage?.getItem(tableIndex) ? secureLocalStorage?.getItem(tableIndex).pageSize : 50);
    // const [search, setSearch] = useState(secureLocalStorage?.getItem(tableIndex) ? secureLocalStorage?.getItem(tableIndex).search : '');
    // const [order, setOrder] = useState(secureLocalStorage?.getItem(tableIndex) ? secureLocalStorage?.getItem(tableIndex).order : 'asc');
    // const [sort, setSort] = useState(secureLocalStorage?.getItem(tableIndex) ? secureLocalStorage?.getItem(tableIndex).sort : 'firstName');

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
            dataField: tableState?.sort || 'firstName',
            order: tableState?.order || 'asc'
        }],
        defaultPageOptions: {
            page: tableState?.page || 1,
            sizePerPage: tableState?.pageSize || 50,
            search: tableState?.search || '',
            sizePerPageList: [50, 100]
        }
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

    const [treeData, setTreeData] = useState([])

    const loadData = (treeId, pagination) => {
        setLoading(true)
        fetchRequest(movementInIndex, 'POST', {
            school: selectedSchool?.id,
            grade: treeId || selectedTreeData?.key,
            page: pagination?.page,
            pageSize: pagination?.pageSize,
            search: pagination?.search || '',
            sort: pagination?.sort,
            order: pagination?.order,
        })
            .then((res) => {
                if (res.success) {
                    setCanMultiPrint(res?.multiRegistrationSheet || false)
                    setSchoolInfo(res?.schoolInfo)
                    setTreeData(res?.grades)
                    setTableData(res?.movements)
                    setTotalCount(res?.totalCount)

                } else {
                    message(res.message)
                }
                setInitLoaded(true)
                setLoading(false)
            })
            .catch(() => {
                message(t('err.error_occurred'))
                setLoading(false)
            })
    }

    useEffect(() => {
        loadData(selectedTreeData, tableState)
    }, [])

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
        let updateParams = Object.assign(params, {
            school: selectedSchool?.id,
            grade: selectedTreeData,
            student: selectedTableData?.studentId
        })
        setLoading(true)
        fetchRequest(movementInAvatar, 'POST', updateParams)
            .then((res) => {
                if (res.success) {
                    const clone = [...tableData]
                    for (let c = 0; c < clone.length; c++) {
                        if (clone[c].studentId === res?.student) {
                            clone[c].avatar = res?.path;
                            break;
                        }
                    }
                    setTableData(clone)
                    closeModal()
                    message(res.message, res.success)
                } else {
                    message(res.message)
                }
                setLoading(false)
            })
            .catch(() => {
                message(t('err.error_occurred'))
                setLoading(false)
            })
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
                history.push('/class/student-book', {
                    id: student?.studentId,
                    classId: student?.classId,
                    className: student?.className,
                    urlData: {
                        backUrl: '/movement/in',
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

    const handleTreeChange = key => {
        setSelectedTreeData(key[0])
        secureLocalStorage.setItem(localStorageSelectedTree, key[0])
        const object = {
            page: 1,
            pageSize: tableState?.pageSize,
            search: tableState?.search,
            sort: tableState?.sort,
            order: tableState?.order
        }

        loadData(key[0], object)
    }

    const onUserInteraction = (state) => {
        if (initLoaded) {
            let page = state?.page
            if (tableState?.search !== state?.search) {
                page = 1;
            }

            let params = {
                page: page,
                pageSize: state?.pageSize,
                search: state?.search,
                sort: state?.sort,
                order: state?.order
            }

            setTableState(params)

            loadData(selectedTreeData, params)
        }
    };

    const onCheckedChange = (key, rowIndex, checked, id) => {
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

    const onMovementSubmit = (students = []) => {
        if (students && students?.length > 0) {
            setLoading(true)
            fetchRequest(movementInCreate, 'POST', {
                school: selectedSchool?.id,
                grade: selectedTreeData,
                listGrade: selectedTreeData,
                students: JSON.stringify(students)
            })
                .then((res) => {
                    if (res.success) {
                        setTableData(res?.movements)
                        setTotalCount(res?.totalCount)

                        setShowAddModal(false)
                    } else {
                        message(res.message)
                    }
                    setLoading(false)
                })
                .catch(() => {
                    message(t('err.error_occurred'))
                    setLoading(false)
                })
        }
    }

    return (
        <>
            <div className='d-none'>
                <PrintData
                    ref={printRef}
                    school={schoolInfo}
                    students={[selectedTableData]}
                />
                <PrintData
                    ref={printMultiRef}
                    school={schoolInfo}
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
                        <div className='m-portlet'>
                            <div className='m-portlet__body'>
                                <TreeView
                                    defaultExpandAll
                                    treeData={treeData}
                                    selectedNodes={[selectedTreeData]}
                                    onSelect={handleTreeChange}
                                />
                            </div>
                        </div>
                    </Col>

                    <Col xl="10" xxl="10">
                        <div className='d-flex gap-2'>
                            {/* { selectedTreeData?.key?.toString()?.startsWith('class') == 0 &&  */}
                            <button
                                onClick={() => setShowAddModal(true)}
                                disabled={!selectedTreeData?.toString()?.startsWith('class')}
                                className='btn btn-sm m-btn--pill btn-info m-btn--uppercase d-inline-flex mb-3'
                            >
                                <ControlPointIcon style={{ color: "white", marginRight: "4px" }} className='MuiSvg-customSize' />
                                {t('action.register')}
                            </button>
                            {/* } */}
                            {/* { ROOT CODE
                            selectedTreeData?.key?.toString()?.startsWith('class') &&
                            <Link
                                to='/movement/in/create'
                                state={{ grade: selectedTreeData?.key, isGenerateCode: school?.isGenerateCode }}
                                className='btn btn-sm m-btn--pill btn-info m-btn--uppercase d-inline-flex mb-3'
                            >
                                <AddCircleOutlineRoundedIcon className='MuiSvg-customSize'/>
                                <span className='ml-2'>{t('action.register')}</span>
                            </Link>
                            }*/}
                            {/* {
                                // secureLocalStorage?.getItem('personInfo')?.roles?.includes('ROLE_EXCEL_UPLOADER') && secureLocalStorage?.getItem('selectedSchool')?.value &&
                                <button
                                    onClick={() => setShowExcelModal(true)}
                                    className='btn btn-sm m-btn--pill btn-info m-btn--uppercase d-inline-flex align-items-center mb-3'
                                >
                                    <UploadFileRoundedIcon />
                                    <span className='ml-2'>{t('excel_import')}</span>
                                </button>
                            } */}
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
                        <div className='m-portlet'>
                            <div className='m-portlet__body'>
                                <DTable
                                    remote
                                    locale={locale}
                                    config={config}
                                    data={tableData}
                                    checkable={canMultiPrint}
                                    onCheckable={onCheckedChange}
                                    clickContextMenu
                                    columns={columns}
                                    currentPage={tableState?.page}
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
                            <circle className="path" cx="25" cy="25" r="20" fill="none" strokeWidth="5" />
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
                    onSubmit={onMovementSubmit}
                    generateCode={schoolInfo?.isGenerateCode}
                    grade={selectedTreeData}
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