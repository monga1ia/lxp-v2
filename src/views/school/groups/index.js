import React, { useEffect, useState } from 'react'
import CloseIcon from '@mui/icons-material/Close';
import { Modal } from 'react-bootstrap'
import { toast } from "react-toastify";
import HtmlHead from 'components/html-head/HtmlHead';
import message from 'modules/message';
// import ViewModal from './modal/view'
import TreeView from 'modules/TreeView';
import DTable from 'modules/DataTable/DTable';
import DeleteModal from 'utils/deleteModal'
import InsertModal from './modals/insert'
import { Row, Col, Button, Card } from 'react-bootstrap';
import secureLocalStorage from 'react-secure-storage'
import { useTranslation } from "react-i18next";
import BreadcrumbList from 'components/breadcrumb-list/BreadcrumbList';
import BorderColorTwoToneIcon from '@mui/icons-material/BorderColorTwoTone'

const locale = secureLocalStorage?.getItem('selectedLang') || 'mn'
const localStorageSelectedTree = 'school_groups_selected_tree_index'
const localeActiveTableState = 'school_groups_table_index'

const index = () => {

    const { t } = useTranslation()

    const title = t('group.integratedGroup');
    const description = "E-learning";
    const breadcrumbs = [
        { to: "", text: "Home" },
        { to: "school/teacher", text: title }
    ];
    const [loading, setLoading] = useState(false)
    const localStorageSelectedRefId = 'school_groups_selected_ref_id_index'

    const [treeData, setTreeData] = useState([
        {key: "all", title: "Бүгд", children: [{key: "2117", refId: 5, gid: "2117", title: "1-р анги"}]},
    ])
    const [selectedTreeDataId, setSelectedTreeDataId] = useState(secureLocalStorage.getItem(localStorageSelectedTree) || 'all')
    const [selectedRefId, setSelectedRefId] = useState(secureLocalStorage.getItem(localStorageSelectedRefId) || 'all')

    const [tableData, setTableData] = useState([
        {id: "50", name: "English B1 Level", curriculumName: "Цөм хөтөлбөр", gradeId: "2126"},
        {id: "53", name: "English B1 Level", curriculumName: "Цахим хөтөлбөр", gradeId: "2126"}
    ])
    const [totalCount, setTotalCount] = useState([])
    const [selectedTableDataId, setSelectedTableDataId] = useState(null)
    const [showInsertModal, setShowInsertModal] = useState(false)

    const [tableState, setTableState] = useState(secureLocalStorage.getItem(localeActiveTableState) ||
    {
        filter: {},
        page: 1,
        pageSize: 10,
        search: '',
        sort: 'class',
        order: 'asc'
    }
    )

    const contextMenus = [
        {
            key: 'INSERT',
            icon: <BorderColorTwoToneIcon sx={{ fontSize: '26px !important', color: '#ff5b1d' }} />,
            title: t('student.register_student') || ""
        }
    ]

    const config = {
        excelExport: true,
        printButton: true,
        columnButton: true,
        excelFileName: secureLocalStorage.getItem('selectedSchool')?.longname + ' - Бүгд',
        defaultSort: [
            {
                dataField: tableState?.sort || 'class',
                order: tableState?.order || 'asc'
            }
        ],
        defaultPageOptions: {
            page: tableState?.page,
            sizePerPage: tableState?.pageSize,
            search: tableState?.search,
        }
    };

    const columns = [
        {
            dataField: "curriculumName",
            text: t('courseName'),
            sort: true,
        },
        {
            dataField: "gradeName",
            text: t('subject.grade'),
            sort: true,
        },
        {
            dataField: "subjectName",
            text: t('subject.title'),
            sort: true,
        },
        {
            dataField: "name",
            text: t('group.integratedGroupName'),
            sort: true,
        },
        {
            dataField: "totalStudentNumber",
            text: t('students'),
            sort: true,
            formatter: (cell) => {
                return (
                    <div
                        style={{
                            textAlign: "end",
                            color: "#4037D7",
                            textDecorationLine: "underline",
                            cursor: "pointer",
                        }}
                    >
                        {cell}
                    </div>
                );
            },
        },
        {
            dataField: "firstName",
            text: t('created_user'),
            sort: true,
        },
        {
            dataField: "createdDate",
            text: t('created_date'),
            sort: true,
            align: 'left',
            formatter: (cell) => cell?.date?.split('.')[0]
        }
    ];

    // useEffect(() => {
    //     if (selectedRefId) {
    //         init(tableState, selectedRefId)
    //     } else {
    //         init(tableState)
    //     }
    // }, [])

    // const init = (pagination, grade) => {
    //     setLoading(true)
    //     fetchRequest(schoolGroupInit, 'POST', {
    //         filter: pagination?.filter,
    //         order: pagination?.order,
    //         sort: pagination?.sort,
    //         page: pagination?.page,
    //         pageSize: pagination?.pageSize,
    //         search: pagination?.search,
    //         grade
    //     })
    //         .then((res) => {
    //             if (res.success) {
    //                 const { grades, groups, totalCount } = res.data
    //                 setTreeData(grades || [])
    //                 setTableData(groups || [])
    //                 setTotalCount(totalCount || 0)

    //                 // if (!selectedTreeDataId) {
    //                 //     if(gradeList.length){
    //                 //         setSelectedTreeDataId(gradeList[0].key)
    //                 //     }
    //                 // }
    //             } else {
    //                 message(res.data.message)
    //             }
    //             setLoading(false)
    //         })
    //         .catch((e) => {
    //             message(t(locale)?.err?.error_occurred)
    //             setLoading(false)
    //         })
    // }

    const onUserInteraction = (state) => {
        // if (state.search) {
        //     let cloneData = {
        //         page: 1,
        //         pageSize: state.pageSize,
        //         search: state.search,
        //         filter: {
        //             page: 1,
        //             pageSize: state?.filter?.pageSize || 10
        //         }
        //     };

        //     setTableState(cloneData)
        //     secureLocalStorage.setItem(localeActiveTableState, cloneData)
        //     init(cloneData, selectedRefId)
        // } else {
        //     if (state.page) {
        //         setTableState(state)
        //         secureLocalStorage.setItem(localeActiveTableState, state)
        //         init(state, selectedRefId)
        //     }
        // }
    }

    const _contextMenuItemClick = (id, key, row) => {
        if (id && key) {
            setSelectedTableDataId(id)
            if (key === 'INSERT') {
                setShowInsertModal(true)
                // navigate('/school/groups/edit', { replace: true, state: { group: row.id, grade: row.gradeId, gradeName: row.gradeName } })
            }
        }
    }

    const handleTreeSelect = key => {
        if (key && key.length > 0) {
            setSelectedTreeDataId(key[0])
        //     secureLocalStorage.setItem(localStorageSelectedTree, key[0])

        //     let cloneData = {
        //         page: 1,
        //         pageSize: tableState.pageSize,
        //         search: tableState.search,
        //         sort: tableState.sort,
        //         order: tableState.order,
        //         filter: {
        //             page: 1,
        //             pageSize: tableState?.filter?.pageSize || 10
        //         }
        //     };

        //     setTableState(cloneData)

        //     let selectedTreeData = null
        //     if (key[0] == 'all') {
        //         init(cloneData, 'all')
        //     } else {
        //         let children = treeData[0]['children'];
        //         if (children && children.length > 0) {
        //             selectedTreeData = children.find(child => child.key == key[0])

        //             if (selectedTreeData) {
        //                 init(cloneData, selectedTreeData.key)
        //             }
        //         }
        //     }
        //     secureLocalStorage.removeItem(localStorageSelectedRefId)
        //     secureLocalStorage.setItem(localStorageSelectedRefId, selectedTreeData?.key || null)
        }
    }

    const handleInsertGroup = () => {
        console.log('handleInsert')
    }
    
    const closeModal = () => {
        setShowInsertModal(false)
    }

    return (
        <div className="m-grid__item m-grid__item--fluid m-wrapper">

            <HtmlHead title={title} description={description} />

            <div className="page-title-container">
                <Col md="7" className='p-0'>
                    <h1 className="mb-0 pb-0 display-4 relative">{title}</h1>
                    <BreadcrumbList items={breadcrumbs} />
                </Col>
            </div>
            <div className="m-content">
                <Row className=''>
                    <Col xl="2" xxl="2">
                        <div className='m-portlet'>
                            <div className='m-portlet__body'>
                                <TreeView
                                    treeData={treeData}
                                    selectedNodes={[selectedTreeDataId]}
                                    onSelect={handleTreeSelect}
                                    defaultExpandAll
                                />
                            </div>
                        </div>
                    </Col>
                    <Col xl="10" xxl="10">
                        <div className="m-portlet">
                            <div className="m-portlet__body">
                                <DTable
                                    remote
                                    locale={locale}
                                    config={config}
                                    clickContextMenu
                                    data={tableData}
                                    columns={columns}
                                    contextMenus={contextMenus}
                                    onContextMenuItemClick={(id, key, row) => _contextMenuItemClick(id, key, row)}
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
                    <div className='blockUI blockOverlay' />
                    <div className='blockUI blockMsg blockPage'>
                        <div className='m-loader m-loader--brand m-loader--lg' />
                    </div>
                </>
            }
            {
                showInsertModal && selectedTableDataId &&
                <InsertModal
                    data={selectedTableDataId}
                    onClose={closeModal}
                    onSubmit={handleInsertGroup}
                />
            }
        </div>
    )
}

export default index;