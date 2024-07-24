import { useState } from 'react'
import message from 'modules/message'
import ViewModal from './modal/view'
import HtmlHead from 'components/html-head/HtmlHead';
import BreadcrumbList from 'components/breadcrumb-list/BreadcrumbList';
import React, { useEffect } from 'react'
import TreeView from 'modules/TreeView';
import DTable from 'modules/DataTable/DTable';
import DeleteModal from 'utils/deleteModal'
import secureLocalStorage from 'react-secure-storage'
import { Row, Col, Button } from 'react-bootstrap';
import { fetchRequest } from 'utils/fetchRequest'
import { translations } from 'utils/translations'
import { useTranslation } from 'react-i18next';
import PublicRoundedIcon from '@mui/icons-material/PublicRounded'
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone'
import PreviewTwoToneIcon from '@mui/icons-material/PreviewTwoTone'
import PublicOffRoundedIcon from '@mui/icons-material/PublicOffRounded'
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded'
import BorderColorTwoToneIcon from '@mui/icons-material/BorderColorTwoTone'
import HighlightOffRoundedIcon from '@mui/icons-material/HighlightOffRounded'
import VisibilityOffRoundedIcon from '@mui/icons-material/VisibilityOffRounded'
import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded'
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import AddTemplate from './add';
import EditTemplate from './edit';

// import { templateExamDelete, templateExamInit, templateExamSetPublic, templateExamSetUnPublish } from 'utils/url'

const index = () => {

    const localStorageSelectedTree = 'template_exam_selected_tree_data'
    const locale = secureLocalStorage?.getItem('selectedLang') || 'mn'
    const { t } = useTranslation()
    const [loading, setLoading] = useState(false)

    const title = t('exam_template.title');
    const description = "E-learning";
    const breadcrumbs = [
        { to: "", text: "Home" },
        { to: "template/exams", text: title }
    ];

    const [treeData, setTreeData] = useState(
        [
            {
                key: "#",
                title: "Бүгд",
                children: [
                    {
                        key: "2117",
                        title: "1-р анги"
                    },
                    {
                        key: "2118",
                        title: "2-р анги"
                    },
                    {
                        key: "2119",
                        title: "3-р анги"
                    },
                    {
                        key: "2120",
                        title: "4-р анги"
                    },
                    {
                        key: "2121",
                        title: "5-р анги"
                    },
                    {
                        key: "2123",
                        title: "6-р анги"
                    },
                    {
                        key: "2124",
                        title: "7-р анги"
                    },
                    {
                        key: "2125",
                        title: "8-р анги"
                    },
                    {
                        key: "2126",
                        title: "9-р анги"
                    },
                    {
                        key: "2128",
                        title: "10-р анги"
                    },
                    {
                        key: "2129",
                        title: "11-р анги"
                    },
                    {
                        key: "2130",
                        title: "12-р анги"
                    },
                    {
                        key: "3986",
                        title: "Ахлах бүлэг"
                    },
                    {
                        key: "3987",
                        title: "Бага бүлэг"
                    }
                ]
            }
        ]
    )
    const [selectedTreeData, setSelectedTreeData] = useState(secureLocalStorage?.getItem(localStorageSelectedTree) || [])
    const [showCreateTemplateModal, setShowCreateTemplateModal] = useState(false)
    const [showEditModal, setShowEditModal] = useState(false)

    const [tableData, setTableData] = useState([
        {
            id: "8498",
            code: "20232024000",
            name: "Тест",
            totalScore: "100.00",
            totalQuestionCount: 0,
            createdDate: "2024-04-26 12:12:17",
            publishedDate: "2024-06-07 12:41:23",
            createdUser: "Цэрэнсодном",
            createdUserId: "11730",
            isEdit: true,
            isManager: true,
            isPublish: true,
            isPublic: true,
            examTypeId: "52",
            examTypeName: "Сэдвийн шалгалт",
            subjectName: "202-Түүх"
        },
        {
            id: "8448",
            code: "20232024000",
            name: "gar",
            totalScore: "10.00",
            totalQuestionCount: 1,
            createdDate: "2024-04-20 23:55:52",
            publishedDate: "2024-04-20 23:55:52",
            createdUser: "Цэрэнсодном",
            createdUserId: "11730",
            isEdit: true,
            isManager: true,
            isPublish: true,
            isPublic: false,
            examTypeId: "52",
            examTypeName: "Сэдвийн шалгалт",
            subjectName: "МОН0301-Монгол хэл"
        },
        {
            id: "7286",
            code: "20232024000",
            name: "Тест",
            totalScore: "30.00",
            totalQuestionCount: 3,
            createdDate: "2024-03-22 12:30:51",
            publishedDate: null,
            createdUser: "Нарантуяа",
            createdUserId: "7926",
            isEdit: true,
            isManager: true,
            isPublish: false,
            isPublic: true,
            examTypeId: "53",
            examTypeName: "Улирлын шалгалт",
            subjectName: "МАТ0801-Математик"
        }
    ])
    const [selectedTableDataId, setSelectedTableDataId] = useState(null)

    const [showViewModal, setShowViewModal] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)

    const columns = [
        {
            dataField: 'isPublish',
            text: translations(locale)?.status,
            align: 'center',
            style: { verticalAlign: 'middle' },
            formatter: (cell) => 
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <div className={`table-circle ${cell ? "active": "inactive"}`} />
                </div>
            // <i className='fas fa-circle' style={{ color: cell ? '#6dd400' : '#d8d8d8' }} />
        },
        {
            dataField: 'isPublic',
            text: '',
            align: 'center',
            style: {verticalAlign: 'middle'},
            formatter: (cell) => {
                return cell
                    ? <VisibilityRoundedIcon sx={{ fontSize: '2rem !important', color: '#6dd400' }} />
                    : <VisibilityOffRoundedIcon sx={{ fontSize: '2rem !important', color: '#868aa8' }} />
            }
        },
        {
            dataField: 'name',
            text: translations(locale)?.exam?.template_name,
            sort: true,
            formatter: (cell, row) => { return <span className='underline' onClick={() => handleContextMenuClick(row?.id, 'view')}>{cell}</span> }
        },
        {
            dataField: 'examTypeName',
            text: translations(locale)?.exam_template?.exam_type,
            sort: true
        },
        {
            dataField: 'subjectName',
            text: translations(locale)?.exam_template?.subject,
            sort: true,
        },
        {
            dataField: 'createdDate',
            text: translations(locale)?.exam_template?.created_date,
            sort: true
        },
        {
            dataField: 'createdUser',
            text: translations(locale)?.exam_template?.created_user,
            sort: true
        },
    ]

    const contextMenus = [
        {
            key: 'view',
            icon: <PreviewTwoToneIcon sx={{ fontSize: '2rem !important', color: '#ff5b1d' }} />,
            title: translations(locale)?.view,
        },
        {
            key: 'edit',
            icon: <BorderColorTwoToneIcon sx={{ fontSize: '1.8rem !important', color: '#ff5b1d' }} />,
            title: translations(locale)?.edit
        },
        {
            key: 'delete',
            icon: <DeleteTwoToneIcon sx={{ fontSize: '2rem !important', color: '#ff5b1d' }} />,
            title: translations(locale)?.delete
        },
        {
            key: 'setUnPublish',
            icon: <HighlightOffRoundedIcon sx={{ fontSize: '2rem !important', color: '#ff5b1d' }} />,
            title: translations(locale)?.action?.setInactive
        },
        {
            key: 'setPublic',
            icon: <PublicRoundedIcon sx={{ fontSize: '2rem !important', color: '#ff5b1d' }} />,
            title: translations(locale)?.exam_template?.not_only_me
        },
        {
            key: 'setUnPublic',
            icon: <PublicOffRoundedIcon sx={{ fontSize: '2rem !important', color: '#ff5b1d' }} />,
            title: translations(locale)?.exam_template?.only_me
        },
    ]

    const config = {
        excelExport: true,
        printButton: true,
        columnButton: true,
        excelFileName: `${secureLocalStorage.getItem('selectedSchool')?.text}-${selectedTreeData?.title}-${translations(locale)?.exam_template?.title}`,
        defaultSort: [{
            dataField: 'firstName',
            order: 'asc'
        }]
    }

    // useEffect(() => {
    //     setLoading(true)
    //     secureLocalStorage.setItem(localStorageSelectedTree, selectedTreeData)
    //     fetchRequest(templateExamInit, 'POST', { grade: selectedTreeData?.key })
    //         .then((res) => {
    //             if (res.success) {
    //                 const { treeData, templates } = res.data
    //                 setTreeData(treeData || [])
    //                 setTableData(templates || [])
    //             } else {
    //                 message(res.data.message)
    //             }
    //             setLoading(false)
    //         })
    //         .catch(() => {
    //             message(translations(locale)?.err?.error_occurred)
    //             setLoading(false)
    //         })
    // }, [selectedTreeData])

    useEffect(() => {
        if (treeData.length && !selectedTreeData?.key) setSelectedTreeData(treeData?.[0])
    }, [treeData])

    useEffect(() => {
        tableData?.forEach(el => {
            if (el?.isManager) {
                if (el?.isPublish) {
                    if (el?.isPublic) {
                        el.contextMenuKeys = 'view,setUnPublic,setUnPublish'
                    } else {
                        el.contextMenuKeys = 'view,setPublic,setUnPublish'
                    }
                } else {
                    if (el?.isPublic) {
                        el.contextMenuKeys = 'view,setUnPublic,edit,delete'
                    } else {
                        el.contextMenuKeys = 'view,setPublic,edit,delete'
                    }
                }
            } else {
                if (el?.isPublish) {
                    if (el?.isPublic) {
                        if (el?.isEdit) {
                            el.contextMenuKeys = 'view,setUnPublic,setUnPublish'
                        } else {
                            el.contextMenuKeys = 'view'
                        }
                    } else {
                        if (el?.isEdit) {
                            el.contextMenuKeys = 'view,setPublic,setUnPublish'
                        } else {
                            el.contextMenuKeys = 'view'
                        }
                    }
                } else {
                    if (el?.isPublic) {
                        if (el?.isEdit) {
                            el.contextMenuKeys = 'view,setUnPublic,edit,delete'
                        } else {
                            el.contextMenuKeys = 'view'
                        }
                    } else {
                        if (el?.isEdit) {
                            el.contextMenuKeys = 'view,setPublic,edit,delete'
                        } else {
                            el.contextMenuKeys = 'view'
                        }
                    }
                }
            }
        })
    }, [tableData])

    const handleDelete = () => {
        console.log('handleDelete')
        // setLoading(true)
        // fetchRequest(templateExamDelete, 'POST', { template: selectedTableDataId, grade: selectedTreeData?.key })
        //     .then((res) => {
        //         if (res.success) {
        //             message(res.data.message, res.success)
        //             const { templates } = res.data
        //             setTableData(templates || [])
        //             closeModal()
        //         } else {
        //             message(res.data.message)
        //         }
        //         setLoading(false)
        //     })
        //     .catch(() => {
        //         message(translations(locale)?.err?.error_occurred)
        //         setLoading(false)
        //     })
    }

    const handleSetPublic = (isPublic, template) => {
        console.log('handleSetPublic')
        // setLoading(true)
        // fetchRequest(templateExamSetPublic, 'POST', { template, grade: selectedTreeData?.key, public: isPublic })
        //     .then((res) => {
        //         if (res.success) {
        //             message(res.data.message, res.success)
        //             setTableData(res.data?.templates || [])
        //         } else {
        //             message(res.data.message)
        //         }
        //         setLoading(false)
        //     })
        //     .catch(() => {
        //         message(translations(locale)?.err?.error_occurred)
        //         setLoading(false)
        //     })
    }

    const handleSetUnPublish = template => {
        console.log('handleSetUnpublish')
        // setLoading(true)
        // fetchRequest(templateExamSetUnPublish, 'POST', { template, grade: selectedTreeData?.key })
        //     .then((res) => {
        //         if (res.success) {
        //             message(res.data.message, res.success)
        //             setTableData(res.data?.templates || [])
        //         } else {
        //             message(res.data.message)
        //         }
        //         setLoading(false)
        //     })
        //     .catch(() => {
        //         message(translations(locale)?.err?.error_occurred)
        //         setLoading(false)
        //     })
    }

    const handleContextMenuClick = (id, key) => {
        if (id && key) {
            setSelectedTableDataId(id)
            if (key === 'view') {
                setShowViewModal(true)
            } else if (key === 'edit') {
                // navigate('/template/exams/edit', { state: { id } })
                // console.log('editThus')
                setShowEditModal(true)
            } else if (key === 'delete') {
                setShowDeleteModal(true)
            } else if (key === 'setPublic') {
                handleSetPublic(1, id)
            } else if (key === 'setUnPublic') {
                handleSetPublic(0, id)
            } else if (key === 'setUnPublish') {
                handleSetUnPublish(id)
            }
        }
    }

    const closeModal = () => {
        setShowViewModal(false)
        setShowDeleteModal(false)
        setSelectedTableDataId(null)
        setShowCreateTemplateModal(false)
        setShowEditModal(false)
    }

    return (
        <>
            <HtmlHead title={title} description={description} />

            <div className="page-title-container">
                <Col md="7">
                    <h1 className="mb-0 pb-0 display-4 relative">{title}</h1>
                    <BreadcrumbList items={breadcrumbs} />
                </Col>
            </div>

            <div className='m-content'>
                <div className='row'>
                    <Col xl="2" xxl="2">
                        <div className='m-portlet br-12'>
                            <div className='m-portlet__body'>
                                <TreeView
                                    defaultExpandAll
                                    treeData={treeData}
                                    selectedNodes={[selectedTreeData?.key]}
                                    onSelect={(key, info) => setSelectedTreeData(info?.node)}
                                />
                            </div>
                        </div>
                    </Col>
                    <Col xl="10" xxl="10">
                        <button
                            onClick={() => setShowCreateTemplateModal(true)}
                            className='btn btn-sm m-btn--pill btn-info m-btn--uppercase d-inline-flex mb-3'
                        >
                            <ControlPointIcon style={{ color: "white", marginRight: "4px" }} />
                            {t('add')}
                        </button>
                        <div className='m-portlet br-12'>
                            <div className='m-portlet__body'>
                                <DTable
                                    locale={locale}
                                    config={config}
                                    data={tableData}
                                    columns={columns}
                                    individualContextMenus
                                    contextMenus={contextMenus}
                                    onContextMenuItemClick={handleContextMenuClick}
                                />
                            </div>
                        </div>
                    </Col>
                </div>
            </div>
            {
                loading &&
                <>
                    <div className='blockUI blockOverlay' />
                    <div className='blockUI blockMsg blockPage'>
                        <div className='m-loader m-loader--brand m-loader--lg' />
                    </div>
                </>
            }
            {
                showDeleteModal && selectedTableDataId &&
                <DeleteModal
                    onClose={closeModal}
                    onDelete={handleDelete}
                    locale={locale}
                    title={translations(locale)?.delete}
                >
                    {translations(locale)?.delete_confirmation}
                    <br />
                    <br />
                    {translations(locale)?.delete_confirmation_description}
                </DeleteModal>
            }
            {
                showViewModal && selectedTableDataId &&
                <ViewModal
                    onClose={closeModal}
                    id={selectedTableDataId}
                />
            }
            {
                showCreateTemplateModal &&
                <AddTemplate
                    onClose={closeModal}
                />
            }
            {
                showEditModal &&
                <EditTemplate
                    onClose={closeModal}
                />
            }
        </>
    )
}

export default index