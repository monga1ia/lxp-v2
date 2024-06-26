import React, { useEffect, useState } from 'react'
import message from 'modules/message';
import TreeView from 'modules/TreeView';
import DTable from 'modules/DataTable/DTable';
import { Row, Col, Card, Button } from 'react-bootstrap';
import secureLocalStorage from 'react-secure-storage'
import { useTranslation } from "react-i18next";
import HtmlHead from 'components/html-head/HtmlHead';
import BreadcrumbList from 'components/breadcrumb-list/BreadcrumbList';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone'
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import BorderColorTwoToneIcon from '@mui/icons-material/BorderColorTwoTone'
import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded'

const locale = secureLocalStorage?.getItem('selectedLang') || 'mn'
const localStorageSelectedTree = 'school_classes_selected_tree_index'
const localeActiveTableState = 'school_classes_table_index'

const index = () => {

    const { t } = useTranslation();

    const title = t('teacher.title');
    const description = "E-learning";
    const breadcrumbs = [
        { to: "", text: "Home" },
        { to: "school/teacher", text: title }
    ];

    const [loading, setLoading] = useState(false)

    const [treeData, setTreeData] = useState([{
        title: 'first level',
        value: '0-0',
        key: 1,
        selectable: true,
        children: [{
            title: 'second level',
            value: '0-0-0',
            key: 2,
            selectable: true,
        }]
    }])
    const [selectedTreeDataId, setSelectedTreeDataId] = useState(secureLocalStorage.getItem(localStorageSelectedTree) || null)

    const [tableData, setTableData] = useState([
        {id: 11, class: 2323, teacherLastName: "asdfsdf"}, 
        {id: 12, class: 1232, teacherLastName: "asasdfsdf"},
    ])
    const [totalCount, setTotalCount] = useState([])

    const [viewTeacherModal, setViewTeacherModal] = useState(false)
    const [viewDeleteModal, setViewDeleteModal] = useState(false)
    const [teacherInfo, setTeacherInfo] = useState([])
    const [classId, setClassId] = useState(false)

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
            key: 'EDIT',
            icon: <BorderColorTwoToneIcon sx={{ fontSize: '2rem !important', color: '#ff5b1d' }} />,
            title: t('edit') || ""
        },
        {
            key: 'DELETE',
            icon: <DeleteTwoToneIcon sx={{ fontSize: '2rem !important', color: '#ff5b1d' }} />,
            title: t('delete') || ""
        },
        {
            key: 'ESIS_CLEAR',
            icon: <DeleteTwoToneIcon sx={{ fontSize: '2rem !important', color: '#ff5b1d' }} />,
            title: t('esis.clearClass') || ""
        },
    ]

    const config = {
        excelExport: true,
        printButton: true,
        columnButton: true,
        excelFileName: secureLocalStorage.getItem('selectedSchool')?.longname + ' - Бүгд',
        // excelFileRemote: true,
        // excelFileRemoteUrl: `/${schoolClassInit}?grade=${selectedTreeDataId}&excel=1&excelTotalCount=${totalCount}`,
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

    useEffect(() => {
        const classes = tableData
        if (classes && classes.length > 0) {
            for (let c = 0; c < classes?.length; c++) {
                if (classes[c].esisGroupId) {
                    classes[c].contextMenuKeys = ['EDIT', 'DELETE', 'ESIS_CLEAR']
                } else {
                    classes[c].contextMenuKeys = ['EDIT', 'DELETE']
                }
            }
        }
    })

    // useEffect(() => {
    //     if (selectedTreeDataId) {
    //         init(tableState, selectedTreeDataId)
    //     } else {
    //         init(tableState)
    //     }
    // }, [])

    // const init = (pagination, grade) => {
    //     setLoading(true)
    //     fetchRequest(schoolClassInit, 'POST', {
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
    //                 const { gradeList, classes, totalCount } = res.data
    //                 setTreeData(gradeList || [])
    //                 if (classes && classes.length > 0) {
    //                     for (let c = 0; c < classes?.length; c++) {
    //                         if (classes[c].esisGroupId) {
    //                             classes[c].contextMenuKeys = ['EDIT', 'DELETE', 'ESIS_CLEAR']
    //                         } else {
    //                             classes[c].contextMenuKeys = ['EDIT', 'DELETE']
    //                         }
    //                     }
    //                 }
    //                 setTableData(classes)
    //                 setTotalCount(totalCount || 0)

    //                 if (!selectedTreeDataId) {
    //                     if (gradeList.length) {
    //                         setSelectedTreeDataId(gradeList[0].key)
    //                     }
    //                 }
    //             } else {
    //                 message(res.data.message)
    //             }
    //             setLoading(false)
    //         })
    //         .catch(() => {
    //             message(t('.err?.error_occurred'))
    //             setLoading(false)
    //         })
    // }

    const onUserInteraction = (state) => {
        console.log('onUserInteraction')
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
        //     init(cloneData, selectedTreeDataId)
        // } else {
        //     if (state.page) {
        //         setTableState(state)
        //         secureLocalStorage.setItem(localeActiveTableState, state)
        //         init(state, selectedTreeDataId)
        //     }
        // }
    }

    const esisRemove = (classId) => {
        console.log('esisRemove')
        // setLoading(true)
        // fetchRequest(schoolClassEsisClear, 'POST', {
        //     class: classId
        // })
        //     .then((res) => {
        //         if (res.success) {
        //             const { classes } = res.data
        //             if (classes && classes.length > 0) {
        //                 for (let c = 0; c < classes?.length; c++) {
        //                     if (classes[c].esisGroupId) {
        //                         classes[c].contextMenuKeys = ['EDIT', 'DELETE', 'ESIS_CLEAR']
        //                     } else {
        //                         classes[c].contextMenuKeys = ['EDIT', 'DELETE']
        //                     }
        //                 }
        //             }
        //             setTableData(classes)
        //         } else {
        //             message(res.data.message)
        //         }
        //         setLoading(false)
        //     })
        //     .catch(() => {
        //         message(t('.err?.error_occurred'))
        //         setLoading(false)
        //     })
    }

    const _contextMenuItemClick = (id, key) => {
        if (id && key) {
            if (key === 'EDIT') {
                console.log('editModal')
                // navigate('/school/classes/edit', { replace: true, state: { id: id } })
            } else if (key === 'DELETE') {
                setViewDeleteModal(true)
                setClassId(id)
            } else if (key === 'ESIS_CLEAR') {
                esisRemove(id)
            }
        }
    }

    const closeModal = () => {
        setViewTeacherModal(false)
        setViewDeleteModal(false)
    }

    const columns = [
        {
            dataField: "class",
            text: t('group.title') || "",
            sort: true,
        },
        {
            dataField: "teacherLastName",
            text: t('teacher.lastname') || "",
            sort: true
        },
        {
            dataField: "teacherFirstName",
            text: t('teacher.name') || "",
            sort: true,
            formatter: (cell, row) => {
                if (cell) {
                    return (
                        <span className="underline" onClick={() => _onTdClick(row.teacherId)}>{cell}</span>
                    )
                }
            },
        },
        {
            dataField: "studentCount",
            text: t('group.student_count') || "",
            sort: true,
            align: "right",
        },
        {
            dataField: "scoreType",
            text: t('group.score_type') || "",
            sort: true,
        },
        {
            dataField: "shift",
            text: t('group.school_shift') || "",
            sort: true,

        },
        {
            dataField: "room",
            text: t('group.classroom') || "",
            sort: true,
        },
        {
            dataField: "esisGroupId",
            text: t('esis.classCode') || "",
            hidden: true,
            sort: false,
        }
    ];

    const deleteClass = () => {
        console.log("deleteClass")
        // setLoading(true)
        // fetchRequest(schoolClassDelete, 'POST', {
        //     class: classId,
        //     grade: selectedTreeDataId,
        //     filter: tableState?.filter,
        //     order: tableState?.order,
        //     sort: tableState?.sort,
        //     page: tableState?.page,
        //     pageSize: tableState?.pageSize,
        //     search: tableState?.search,
        // })
        //     .then((res) => {
        //         if (res.success) {
        //             const { classes, totalCount } = res.data

        //             if (classes && classes.length > 0) {
        //                 for (let c = 0; c < classes?.length; c++) {
        //                     if (classes[c].esisGroupId) {
        //                         classes[c].contextMenuKeys = ['EDIT', 'DELETE', 'ESIS_CLEAR']
        //                     } else {
        //                         classes[c].contextMenuKeys = ['EDIT', 'DELETE']
        //                     }
        //                 }
        //             }
        //             setTableData(classes || [])
        //             setTotalCount(totalCount || 0)
        //             setViewDeleteModal(false)
        //         } else {
        //             message(res.data.message)
        //         }
        //         setLoading(false)
        //     })
        //     .catch(() => {
        //         message(t('.err?.error_occurred'))
        //         setLoading(false)
        //     })
    }

    const handleTreeSelect = key => {
        if (key && key.length > 0) {
            setSelectedTreeDataId(key[0])
            // secureLocalStorage.setItem(localStorageSelectedTree, key[0])

            // let cloneData = {
            //     page: 1,
            //     pageSize: tableState.pageSize,
            //     search: tableState.search,
            //     sort: tableState.sort,
            //     order: tableState.order,
            //     filter: {
            //         page: 1,
            //         pageSize: tableState?.filter?.pageSize || 10
            //     }
            // };

            // setTableState(cloneData)
            // secureLocalStorage.setItem(localeActiveTableState, cloneData)
            // init(cloneData, key[0])
        }
    }

    const _onTdClick = (teacherId) => {
        setLoading(true)
        console.log('_onTdClcik')
        // fetchRequest(schoolTeacherView, 'POST', { teacher: teacherId })
        //     .then((res) => {
        //         if (res.success) {
        //             const { teacherData } = res.data
        //             setViewTeacherModal(true);
        //             setTeacherInfo(teacherData)
        //         } else {
        //             message(res.data.message)
        //         }
        //         setLoading(false)
        //     })
        //     .catch(() => {
        //         message(t('.err?.error_occurred'))
        //         setLoading(false)
        //     })
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
                        <div className="m-portlet br-12">
                            <div className="m-portlet__body">
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
                        <Button
                            onClick={() => setShowAddTeacherModal(true)}
                            className='btn btn-sm m-btn--pill btn-info m-btn--uppercase d-inline-flex mb-3'
                        >
                            <ControlPointIcon style={{ color: "white", marginRight: "4px" }} />
                            {t('action.register')}
                        </Button>
                        <div className="m-portlet br-12">
                            <div className="m-portlet__body">
                                <DTable
                                    remote
                                    locale={locale}
                                    config={config}
                                    data={tableData}
                                    columns={columns}
                                    individualContextMenus
                                    contextMenus={contextMenus}
                                    onContextMenuItemClick={_contextMenuItemClick}
                                    onInteraction={onUserInteraction}
                                    totalDataSize={totalCount}
                                />
                            </div>
                        </div>
                    </Col>
                </Row>
            </div>
            {/* {
                viewTeacherModal &&
                <Modal
                    size='small'
                    dimmer='blurring'
                    open={viewTeacherModal}
                    onClose={closeModal}
                    className="react-modal overflow-modal"
                >
                    <div className="header">{translations(locale).teacher.view}</div>
                    <div className="content">
                        {
                            teacherInfo
                                ?
                                <div className="viewTeacherModal">
                                    <div className="row form-group">
                                        <div className="col-4">
                                            <img
                                                src={teacherInfo?.avatar || '/images/avatar.png'}
                                                alt={`photo of ${teacherInfo?.firstName}`}
                                                onError={(e) => {
                                                    e.target.onError = null
                                                    e.target.src = '/images/avatar.png'
                                                }}
                                            />
                                        </div>
                                        <div className="col-8">
                                            <table>
                                                <tbody>
                                                    <tr>
                                                        <td>{translations(locale).status}:</td>
                                                        <th>{teacherInfo?.status || '-'}</th>
                                                    </tr>
                                                    <tr>
                                                        <td>{translations(locale).role}:</td>
                                                        <th>{teacherInfo?.role || '-'}</th>
                                                    </tr>
                                                    <tr>
                                                        <td>{translations(locale).school}:</td>
                                                        <th>{teacherInfo?.grade || '-'}</th>
                                                    </tr>
                                                    <tr>
                                                        <td>{translations(locale).teacher.code}:</td>
                                                        <th>{teacherInfo?.code || '-'}</th>
                                                    </tr>
                                                    <tr>
                                                        <td>{translations(locale).teacher.new_lastname}:</td>
                                                        <th>{teacherInfo?.lastName || '-'}</th>
                                                    </tr>
                                                    <tr>
                                                        <td>{translations(locale).teacher.new_name}:</td>
                                                        <th>{teacherInfo?.firstName}</th>
                                                    </tr>
                                                    <tr>
                                                        <td>{translations(locale).teacher.teacher_class}:</td>
                                                        <th>{teacherInfo?.classes || '-'}</th>
                                                    </tr>
                                                    <tr>
                                                        <td>{translations(locale).teacher.phone_number}:</td>
                                                        <th>{teacherInfo?.contacts || '-'}</th>
                                                    </tr>
                                                    <tr>
                                                        <td className="vertical">{translations(locale).teacher.subjects}:</td>
                                                        <th>{teacherInfo?.subjects || '-'}</th>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                                : null
                        }
                    </div>
                    <div className="actions modal-footer">
                        <div className='col-12 text-center'>
                            <button
                                className="btn m-btn--pill btn-outline-metal"
                                onClick={closeModal}
                            >
                                {t('close.toUpperCase')()}
                            </button>
                        </div>
                    </div>
                </Modal>
            }
            {
                viewDeleteModal &&
                <Modal
                    size='mini'
                    dimmer='blurring'
                    open={viewDeleteModal}
                    onClose={closeModal}
                    className="react-modal overflow-modal"
                >
                    <div className="header">
                        {t('delete')}
                        <button type="button" className="close" aria-label="Close" onClick={closeModal} >
                            <CloseIcon />
                        </button>
                    </div>
                    <div className="content">
                        <p>
                            {t('delete_confirmation')}
                            <br />
                            <br />
                            {t('delete_confirmation_description')}
                        </p>
                    </div>
                    <div className="actions modal-footer ">
                        <div className="col-12 text-center">
                            <button
                                className="btn m-btn--pill btn-link m-btn m-btn--custom"
                                onClick={closeModal}
                            >
                                {translations(locale).back || null}
                            </button>
                            <button
                                onClick={deleteClass}
                                className="btn m-btn--pill btn-danger m-btn--wide"
                            >
                                {translations(locale).delete || null}
                            </button>
                        </div>
                    </div>
                </Modal>
            } */}
            {
                loading &&
                <>
                    <div className='blockUI blockOverlay' />
                    <div className='blockUI blockMsg blockPage'>
                        <div className='m-loader m-loader--brand m-loader--lg' />
                    </div>
                </>
            }
        </div>
    )
}

export default index;