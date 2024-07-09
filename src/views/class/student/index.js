import React, { useEffect, useRef, useState } from 'react'
import { Row, Col, Card, Button } from 'react-bootstrap';
import secureLocalStorage from 'react-secure-storage'
// import { useNavigate } from 'react-router'
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import message from '../../../modules/message'
import TreeView from 'modules/TreeView';
import HtmlHead from 'components/html-head/HtmlHead';
import BreadcrumbList from 'components/breadcrumb-list/BreadcrumbList';
import DTable from 'modules/DataTable/DTable';
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import ImageModal from '../../../utils/imageModal'
import {Tab} from "semantic-ui-react";
import { useTranslation } from "react-i18next";
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto'
import FactCheckOutlinedIcon from '@mui/icons-material/FactCheckOutlined'
import FolderSharedIcon from '@mui/icons-material/FolderShared'

const index = () => {
    const locale="mn"
    const { t } = useTranslation();
    const history = useHistory();
    const [loading, setLoading] = useState(false);
    // const navigate = useNavigate()
    const printRef = useRef()

    const [selectedStudent, setSelectedStudent] = useState(null)

    const [showImageModal, setShowImageModal] = useState(false)
    const [showRegistrationSheetModal, setShowRegistrationSheetModal] = useState(false)

    const [school, setSchool] = useState({})

    const localSchool = secureLocalStorage.getItem('selectedSchool')

    const title = t('students');
    const description = "E-learning";
    const breadcrumbs = [
        { to: "", text: "Home" },
        { to: "class/student", text: title }
    ];

   const [tableData, setTableData] = useState([
        {id: 11, code: 2323, firstName: "Sondor"}, 
        {id: 12, code: 1232, firstName: "Suhee"}
    ]);
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
    const [selectedTableDataId, setSelectedTableDataId] = useState(null)
    const [selectedTreeDataId, setSelectedTreeDataId] = useState([32])
    const [selectedTabData, setSelectedTabData] = useState(0)

    const config = {
        excelExport: true,
        printButton: true,
        columnButton: true,
        showAllData: true,
        showPagination: false,
        excelFileName: `${localSchool?.text}-${localSchool?.classes?.find(el => el?.value == secureLocalStorage.getItem('selectedClassId'))?.text}-${t('students')}`,
        defaultSort: [{
            dataField: 'firstName',
            order: 'asc'
        }]
    }
    
    const columns = [
        {
            dataField: 'avatar',
            text: t('teacher.photo'),
            sort: true,
            width: 40,
            align: 'center',
            formatter: (cell) =>
                <img className='img-responsive img-circle'
                     src={cell || '/img/profile/placeholder.jpg'}
                     width={40} height={40} alt='profile picture'
                     onError={(e) => {
                         e.target.onError = null
                         e.target.src = '/img/profile/avatar.png'
                     }}
                />
        },
        {
            dataField: 'code',
            text: t('studentCode'),
            sort: true
        },
        {
            dataField: 'lastName',
            text: t('studentLastName'),
            sort: true
        },
        {
            dataField: 'firstName',
            text: t('studentFirstName'),
            sort: true,
            formatter: (cell, row) =>
                <span
                    className='underline'
                    onClick={() => handleContextMenuClick(row?.id, 'view')}
                >
                    {cell}
                </span>,
            // formatter: (cell, row) => { return <span className='underline' onClick={() => onClickName(row)}>{cell}</span> }
        },
        {
            dataField: 'gender',
            text: t('gender'),
            sort: true,
            formatter: (cell) => {
                switch (cell?.toLowerCase()) {
                    case 'm':
                        return t('male')
                    case 'f':
                        return t('female')
                    default:
                        return '-'
                }
            }
        },
        {
            dataField: 'contact',
            text: t('studentBook.phone'),
            sort: true
        },
        {
            dataField: 'registrationNumber',
            text: t('register_number'),
            sort: true
        },
        {
            dataField: 'birthDate',
            text: t('student.birth_date'),
            sort: true
        },
        {
            dataField: 'startDate',
            text: t('student.entry_date'),
            sort: true
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
    ];

    const handleAvatar = params => {
        setLoading(true)
        // fetchRequest(classStudentSubmitPhoto, 'POST', { student: selectedStudent?.id, photo: params.image, photoType: params.imageType })
        //     .then(res => {
        //         if (res.success) {
        //             const { students } = res.data
        //             setTableData(students || [])
        //             message(res.data.message, res.success)
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

    const closeModal = () => {
        // setShowAddStudentModal(false)
        setSelectedStudent(null)
        setShowImageModal(false)
        setShowRegistrationSheetModal(false)
    }
    
    const handleTreeSelect = key => {
        if (key && key.length > 0) {
            setSelectedTreeDataId(key[0])
        }
    }
    
    const handleTabChange = (e, data) => {
        setSelectedTabData(data.activeIndex)
    }

    const handleAddStudent = () => {
        setShowAddStudentModal(true)
    }
    

    const handleContextMenuClick = (row, key) => {
        console.log(row, key)
        if (row && key) {
            // setSelectedTableDataId(id)
            setSelectedStudent(row)
            if (key === 'avatar') {
                setShowImageModal(true)
            } else if (key === 'sheet') {
                setShowRegistrationSheetModal(true)
            } else if (key === 'studentBook') {
                onClickName(row)
            } 
        }
    }

    useEffect(() => {
        tableData?.forEach(el => {
            el.contextMenuKeys = 'avatar, studentBook, sheet'
        })
        
    }, [tableData])

    // useEffect(() => {
    //     if (treeData.length && !selectedTreeDataId.length) {
    //         setSelectedTreeDataId(treeData?.[0]?.key)
    //     }
    // }, [treeData])

    const onClickName = (row) => {
        // navigate('/student/book', { state: {
        //     id: row?.id,
        //     urlData: {
        //         backUrl: '/class/students',
        //     }
        // }});
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
                <Row className=''>
                    <Col xl="2" xxl="2">
                        <div className='m-portlet br-12'>
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
                    { selectedTabData == 0 && 
                        <Button
                            onClick={() => setShowAddStudentModal(true)}
                            className='btn btn-sm m-btn--pill btn-info m-btn--uppercase d-inline-flex mb-3'
                        >
                            <ControlPointIcon style={{ color: "white", marginRight: "4px" }} />
                            {t('action.register')}
                        </Button>
                    }
                        
                        <div className='m-portlet tab br-12'>
                            <div className=''>
                                <Tab
                                    menu={{secondary: true, pointing: true, className: 'primaryColor m-0 h-4'}}
                                    onTabChange={(e, data) => handleTabChange(e, data)}
                                    className='m-portlet-header'
                                    panes={[
                                        {
                                            menuItem: t('studentBook.studying'),
                                            render: () => (
                                                <div className='m-portlet__body'>
                                                    <DTable
                                                        config={config}
                                                        locale={locale}
                                                        data={tableData}
                                                        columns={columns}
                                                        individualContextMenus
                                                        contextMenus={contextMenus}
                                                        onContextMenuItemClick={handleContextMenuClick}
                                                    />
                                                </div>
                                            )

                                        },
                                        {
                                            menuItem: t('studentBook.graduated'),
                                            render: () => (
                                                <div className='m-portlet__body'>
                                                    <DTable
                                                        config={config}
                                                        locale={locale}
                                                        data={tableData}
                                                        columns={columns}
                                                        individualContextMenus
                                                        contextMenus={contextMenus}
                                                        onContextMenuItemClick={handleContextMenuClick}
                                                    />
                                                </div>
                                            )
                                        },
                                        
                                    ]}
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
            {
                showImageModal && selectedStudent &&
                <ImageModal
                    onClose={closeModal}
                    onSubmit={handleAvatar}
                />
            }
        </>
    );
}

export default index