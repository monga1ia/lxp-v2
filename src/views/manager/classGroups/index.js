import React, {useEffect, useState} from "react";
import {translations} from "utils/translations";
// import * as actions from "Actions/action";
import {Checkbox, Dropdown, Modal, Tab} from 'semantic-ui-react'
import DTable from "modules/DataTable/DTable";
import { useTranslation } from "react-i18next";
import QueryStatsRoundedIcon from '@mui/icons-material/QueryStatsRounded'
import CloseIcon from '@mui/icons-material/Close'
import secureLocalStorage from "react-secure-storage";
import HtmlHead from 'components/html-head/HtmlHead';
import BreadcrumbList from 'components/breadcrumb-list/BreadcrumbList';
// import {fetchRequest} from 'utils/fetchRequest'
// import {managerClassGroups, managerClassGroupStudents} from 'Utilities/url'
import message from "modules/message";
import {Col, Row} from "react-bootstrap";
import ViewStudents from "./modal/view";

const locale = secureLocalStorage?.getItem('selectedLang') || 'mn'

const index = () => {

    const [loading, setLoading] = useState(false)
    const { t } = useTranslation()

    const title = t('manager.classGroups')
    const description = "E-learning";
    const breadcrumbs = [
        { to: "", text: "Home" },
        { to: "manager/groups", text: title }
    ];

    const [grades, setGrades] = useState([])
    const [selectedGrade, setSelectedGrade] = useState(null)
    const [subjects, setSubjects] = useState([])
    const [selectedSubject, setSelectedSubject] = useState(null)

    const [classes, setClasses] = useState([])
    const [columns, setColumns] = useState([])

    const [showStudentModal, setShowStudentModal] = useState(false)
    const [modalStudents, setModalStudents] = useState([
        {
            "id": 176980,
            "code": "N123",
            "avatar": null,
            "firstName": "sdf",
            "lastName": "dfg"
        },
        {
            "id": 176982,
            "code": "N1234",
            "avatar": null,
            "firstName": "sdf",
            "lastName": "dfg"
        },
        {
            "id": 176984,
            "code": "N12345",
            "avatar": null,
            "firstName": "sdf",
            "lastName": "dfg"
        }
    ])

    const defaultColumns = [
        {
            dataField: 'class',
            text: translations(locale)?.class_name,
            sort: true
        },
        {
            dataField: 'studentCount',
            text: translations(locale)?.totalStudent,
            sort: true,
        }
    ]

    const config = {
        showAllData: true,
        showPagination: false,
        excelExport: true,
        printButton: false,
        columnButton: false,
        excelFileName: `${translations(locale)?.manager?.classGroups}`,
    }

    useEffect(() => {
        loadIndex()
    }, [])

    const onClickStudentCount = (classId = null, groupId = null, subjectId = null) => {
        setShowStudentModal(true)
        console.log('onClickStudentCount')
        // setModalStudents([])
        // setLoading(true)
        // fetchRequest(managerClassGroupStudents, 'POST', {
        //     class: classId,
        //     group: groupId,
        //     subject: subjectId
        // })
        //     .then((res) => {
        //         if (res?.success) {
        //             setModalStudents(res?.data?.students)
        //         } else {
        //             message(res?.data?.message || translations(locale)?.err?.error_occurred)
        //         }
        //         setLoading(false)
        //     })
        //     .catch(() => {
        //         message(translations(locale)?.err?.error_occurred)
        //         setLoading(false)
        //     })
    }

    // const loadIndex = (grade = null, subject = null) => {
    //     console.log('loadIndex')
    //     // setLoading(true)
    //     // fetchRequest(managerClassGroups, 'POST', {
    //     //     grade,
    //     //     subject
    //     // })
    //     //     .then((res) => {
    //     //         if (res?.success) {
    //     //             if (subject) {
    //     //                 setClasses(res?.data?.classes)
    //     //                 const groupColumns = [];

    //     //                 if (res?.data?.groups && res?.data?.groups?.length > 0) {
    //     //                     for (let g = 0; g < res?.data?.groups.length; g++) {
    //     //                         const groupObj = res?.data?.groups[g]
    //     //                         groupColumns.push(
    //     //                             {
    //     //                                 dataField: 'group_' + groupObj?.id,
    //     //                                 text: groupObj?.teacherCode + '-' + groupObj?.teacherFirstname + ' ' + groupObj?.name,
    //     //                                 sort: true,
    //     //                                 align: 'right',
    //     //                                 formatter: (cell, row) => {
    //     //                                     return cell && parseInt(cell) > 0 ? <div className='underline'
    //     //                                                                              onClick={() => onClickStudentCount(row.id, groupObj.id)}>{cell}</div> : cell
    //     //                                 }
    //     //                             }
    //     //                         )
    //     //                     }
    //     //                 }

    //     //                 setColumns([...defaultColumns, ...groupColumns, ...[
    //     //                     {
    //     //                         dataField: 'noGroupCount',
    //     //                         text: translations(locale)?.manager?.noGroupTitle,
    //     //                         sort: true,
    //     //                         align: 'right',
    //     //                         formatter: (cell, row) => {
    //     //                             return cell && parseInt(cell) > 0 ? <div className='underline'
    //     //                                                                      onClick={() => onClickStudentCount(row.id, null, subject)}>{cell}</div> : cell
    //     //                         }
    //     //                     }
    //     //                 ]])
    //     //             } else {
    //     //                 setClasses([])
    //     //                 if (grade) {
    //     //                     setSubjects(res?.data?.subjects)
    //     //                 } else {
    //     //                     setGrades(res?.data?.grades)
    //     //                 }
    //     //             }
    //     //         } else {
    //     //             message(res?.data?.message || translations(locale)?.err?.error_occurred)
    //     //         }
    //     //         setLoading(false)
    //     //     })
    //     //     .catch(() => {
    //     //         message(translations(locale)?.err?.error_occurred)
    //     //         setLoading(false)
    //     //     })
    // }

    const loadIndex = (grade = null, subject = null) => {

        console.log('fronend testing')
        const res = {
            data: {
                classes: [
                    {
                        id: "5293",
                        class: "2A",
                        studentCount: 3,
                        noGroupCount: 3,
                        group_76328: 0
                    },
                    {
                        id: "10505",
                        class: "2а",
                        studentCount: 0,
                        noGroupCount: 0,
                        group_76328: 0
                    },
                    {
                        id: "5294",
                        class: "2в",
                        studentCount: 1,
                        noGroupCount: 1,
                        group_76328: 0
                    },
                    {
                        id: "5296",
                        class: "2В",
                        studentCount: 0,
                        noGroupCount: 0,
                        group_76328: 0
                    }
                ],
                groups: [
                    {
                        id: "76328",
                        name: "Англи хэл 2",
                        teacherCode: "N0010",
                        teacherFirstname: "Altanshagai"
                    }
                ],
                message: "Амжилттай"
            },
            success: true
        }

        setClasses(res?.data?.classes)
        const groupColumns = [];

        if (res?.data?.groups && res?.data?.groups?.length > 0) {
            for (let g = 0; g < res?.data?.groups.length; g++) {
                const groupObj = res?.data?.groups[g]
                console.log(groupObj)
                groupColumns.push(
                    {
                        dataField: 'group_' + groupObj?.id,
                        text: groupObj?.teacherCode + '-' + groupObj?.teacherFirstname + ' ' + groupObj?.name,
                        sort: true,
                        align: 'right',
                        formatter: (cell, row) => {
                            return cell && parseInt(cell) > 0 ? <div className='underline'
                                                                        onClick={() => onClickStudentCount(row.id, groupObj.id)}>{cell}</div> : cell
                        }
                    }
                )
            }
        }

        setColumns([...defaultColumns, ...groupColumns, ...[
            {
                dataField: 'noGroupCount',
                text: translations(locale)?.manager?.noGroupTitle,
                sort: true,
                align: 'right',
                formatter: (cell, row) => {
                    return cell && parseInt(cell) > 0 ? <div className='underline'
                                                                onClick={() => onClickStudentCount(row.id, null, subject)}>{cell}</div> : cell
                }
            }
        ]])
    }

    const onGradeChange = (grade) => {
        setSelectedGrade(grade)
        setSelectedSubject(null)
        setSubjects([])
        loadIndex(grade)
    }

    const onSubjectChange = (subject) => {
        setSelectedSubject(subject)
    }

    const onModalClose = () => {
        setModalStudents([])
        setShowStudentModal(false)
    }

    return (
        <div className="m-grid__item m-grid__item--fluid m-wrapper">
            <HtmlHead title={title} description={description} />

            <div className="page-title-container mb-2">
                <Col md="7" className='p-0'>
                    <h1 className="mb-0 pb-0 display-4 relative">{title}</h1>
                    <BreadcrumbList items={breadcrumbs} />
                </Col>
            </div>  
            <div className="m-content">
                <div className="m-portlet">
                    <div className="m-portlet__body">
                        <Row>
                            <Col>
                                <div className={'ml-5 d-flex py-4'} style={{
                                    textAlign: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <label className='d-flex modal-label mr-4' style={{
                                        fontWeight: 800,
                                        fontFamily: 'PinnacleBold',
                                        position: 'relative',
                                        top: 5,
                                    }}>
                                        {translations(locale)?.class.grade}*
                                    </label>
                                    <Dropdown
                                        style={{width: 250}}
                                        className='content-search-inputs'
                                        placeholder={'-' + translations(locale).select + '-' || ""}
                                        fluid
                                        selection
                                        clearable
                                        search
                                        additionPosition='bottom'
                                        upward={false}
                                        selectOnBlur={false}
                                        value={selectedGrade}
                                        options={grades?.map(gradeObj => {
                                            return {
                                                value: gradeObj?.key,
                                                text: gradeObj?.title
                                            }
                                        })}
                                        onChange={(e, data) => onGradeChange(data?.value)}
                                    />

                                    <label className='modal-label justify-content-start mr-4'
                                           style={{
                                               fontWeight: 800,
                                               fontFamily: 'PinnacleBold',
                                               position: 'relative',
                                               top: 5,
                                               marginLeft: 100
                                           }}>
                                        {translations(locale)?.course?.subject}*
                                    </label>
                                    <Dropdown
                                        style={{width: 250}}
                                        className='content-search-inputs'
                                        placeholder={'-' + translations(locale).select + '-' || ""}
                                        fluid
                                        selection
                                        clearable
                                        search
                                        additionPosition='bottom'
                                        upward={false}
                                        selectOnBlur={false}
                                        value={selectedSubject}
                                        options={subjects}
                                        onChange={(e, data) => onSubjectChange(data?.value)}
                                    />

                                    <div>
                                        <button
                                            className='btn btn-sm m-btn--pill text-uppercase d-inline-flex align-content-center justify-content-center'
                                            style={{
                                                backgroundColor: '#41c5dc', color: 'white',
                                                marginLeft: 100
                                            }}
                                            onClick={() => {
                                                if (selectedGrade && selectedSubject) {
                                                    loadIndex(selectedGrade, selectedSubject)
                                                } else {
                                                    message(translations(locale)?.err.fill_all_fields)
                                                }
                                            }}
                                        >
                                            <QueryStatsRoundedIcon/>
                                            <span className='ml-2'>{translations(locale)?.view}</span>
                                        </button>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </div>
                </div>

                <div className="m-portlet">
                    <div className="m-portlet__body">
                        <DTable
                            locale={locale}
                            columns={columns}
                            data={classes}
                            config={config}
                            // selectMode={'radio'}
                        />
                    </div>
                </div>
            </div>
            {
                loading &&
                <>
                    <div className='blockUI blockOverlay'/>
                    <div className='blockUI blockMsg blockPage'>
                        <div className='m-loader m-loader--brand m-loader--lg'/>
                    </div>
                </>
            }
            {
                showStudentModal && 
                <ViewStudents
                    onClose={onModalClose}
                    data={modalStudents}
                />
            }
        </div>
    )
}

export default index