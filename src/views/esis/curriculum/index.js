import message from 'modules/message';
import secureLocalStorage from 'react-secure-storage'
import { translations } from 'utils/translations'
import React, {useEffect, useRef, useState} from 'react'
import {Tab} from "semantic-ui-react";
import { Row, Col } from 'react-bootstrap';
import DTable from 'modules/DataTable/DTable';
import TreeView from 'modules/TreeView';
import {fetchRequest} from 'utils/fetchRequest'
// import {
//     ESISCurriculums, ESISCurriculumLink, ESISCurriculumGrades, ESISCurriculumGradeLink,
//     ESISCurriculumUnlink, ESISCurriculumGradeUnlink,
//     ESISGradePlans, ESISGradePlanLink, ESISGradePlanUnlink,
//     ESISPlanSubjects, ESISPlanSubjectLink, ESISPlanSubjectUnlink
// } from 'utils/fetchRequest/Urls'
import HtmlHead from 'components/html-head/HtmlHead';
import BreadcrumbList from 'components/breadcrumb-list/BreadcrumbList';
import SyncRoundedIcon from '@mui/icons-material/SyncRounded'
import EditModal from "./modal/edit";
import { useTranslation } from 'react-i18next';


const locale = secureLocalStorage?.getItem('selectedLang') || 'mn'

const index = () => {

    const { t } = useTranslation()

    const title = t('esis.curriculum_and_plan')
    const description = "E-learning";
    const breadcrumbs = [
        { to: "", text: "Home" },
        { to: "esis/curriculum", text: title }
    ];
    const [loading, setLoading] = useState(false)

    const [tabIndex, setTabIndex] = useState(0)
    const [tabCode, setTabCode] = useState('curriculum')
    const [tableData, setTableData] = useState([
        {id: "31", programStudyId: "100001597773517", programStudyName: "Бага хөтөлбөр /ЕБС - Ердийн/", curriculumCode: "2", curriculumName: "ЕБС - Ердийн",
        educationLevelCode: "PRIMARY", educationLevelName: "Бага боловсрол", degreeId: null, degreeName: null, id: 100001597773542, name: "491+491+491+491+491 төлөвлөгөө", 
        programStudy: "100001597773517", stage: 100001597773522, type: "FOUNDATION", typeName: "Суурь", areaName: "Монгол хэл", eschoolCurriculumId: 12322},

        {id: "32", programStudyId: "100001597773531", programStudyName: "Суурь хөтөлбөр /ЕБС - Ердийн/", curriculumCode: "2", curriculumName: "ЕБС - Ердийн",
        educationLevelCode: "PRIMARY", educationLevelName: "Бага боловсрол", degreeId: null, degreeName: null, id: 100001597773545, name: "491+491+491+491+491 төлөвлөгөө", 
        programStudy: "100001597773517", stage: 100001597773522, type: "FOUNDATION", typeName: "Суурь", areaName: "Physics", eschoolCurriculumId: 23222},

        {id: "33", programStudyId: "100001597773539", programStudyName: "Yurdiin /ЕБС - Ердийн/", curriculumCode: "2", curriculumName: "ЕБС - Ердийн",
        educationLevelCode: "PRIMARY", educationLevelName: "Бага боловсрол",  degreeId: null, degreeName: null, id: 100001597773549, name: "491+491+491+491+491 төлөвлөгөө", 
        programStudy: "100001597773517", stage: 100001597773522, type: "FOUNDATION", typeName: "Суурь",  areaName: "Chemistry"},
    ])
    const [treeData, setTreeData] = useState([])
    const [selectedTreeDataId, setSelectedTreeDataId] = useState(null)

    const [selectedTableData, setSelectedTableData] = useState(null)

    const [columns, setColumns] = useState([
        {
            dataField: 'status',
            text: '',
            formatter: (cell, row) =>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <div className={`table-circle ${row?.eschoolCurriculumId ? "active": "inactive"}`} />
                </div>
            // formatter: (cell, row) => {
            //     return <i
            //         className='fas fa-circle'
            //         style={{color: row?.eschoolCurriculumId ? '#6dd400' : '#d8d8d8'}}
            //     />
            // }
        },
        {
            dataField: 'programStudyId',
            text: translations(locale)?.esis.curricula_code,
            sort: true
        },
        {
            dataField: 'programStudyName',
            text: translations(locale)?.esis.curricula_name,
            sort: true
        },
        {
            dataField: 'curriculumCode',
            text: translations(locale)?.esis.curricula_grade_code,
            sort: true
        },
        {
            dataField: 'curriculumName',
            text: translations(locale)?.esis.curricula_grade_name,
            sort: true
        },
        {
            dataField: 'educationLevelCode',
            text: translations(locale)?.esis.academic_grade_code,
            sort: true
        },
        {
            dataField: 'educationLevelName',
            text: translations(locale)?.esis.academic_grade_name,
            sort: true
        },
        {
            dataField: 'action',
            text: '',
            formatter: (cell, row) => {
                if (!row?.eschoolCurriculumId) {return (
                    <button
                        className='btn btn-primary m-btn--icon btn-sm m-btn--icon-only m-btn--pill'
                        onClick={() => openModal('edit', row, tabIndex)}
                    >
                        <i className='fa flaticon-edit'/>
                    </button>
                )} else
                return (
                    <button
                        className='btn btn-danger m-btn--icon btn-sm m-btn--icon-only m-btn--pill'
                        onClick={() => openModal('delete', row, 0)}
                    >
                        <i className='fa flaticon2-cross'/>
                    </button>
                )
            }
        }
    ])

    const [showEditModal, setShowEditModal] = useState(false)
    const [updateView, setUpdateView] = useState(false)

    const [eschoolProgramStudies, setEschoolProgramStudies] = useState([])
    const [eschoolProgramStages, setEschoolProgramStages] = useState([])
    const [eschoolNonConnectedGrades, setEschoolNonConnectedGrades] = useState([
        {value: '4943', text: '1-р анги'},
        {value: '4944', text: '2-р анги'},
        {value: '4945', text: '3-р анги'},
        {value: '4946', text: '4-р анги'},
        {value: '4947', text: '5-р анги'},
        {value: '4949', text: '6-р анги'},
        {value: '4950', text: '7-р анги'},
        {value: '4951', text: '8-р анги'},
        {value: '4952', text: '9-р анги'},
        {value: '4954', text: '10-р анги'},
        {value: '4955', text: '11-р анги'},
        {value: '4956', text: '12-р анги'}
    ])
    const [eschoolStagePlans, setEschoolStagePlans] = useState([])
    const [eschoolSubjects, setEschoolSubjects] = useState([])
    const [eschoolNonConnectedSubjects, setEschoolNonConnectedSubjects] = useState([
        {value: '4943', text: '1-р анги'},
        {value: '4944', text: '2-р анги'},
        {value: '4945', text: '3-р анги'},
        {value: '4946', text: '4-р анги'},
        {value: '4947', text: '5-р анги'},
        {value: '4949', text: '6-р анги'},
        {value: '4950', text: '7-р анги'},
        {value: '4951', text: '8-р анги'},
        {value: '4952', text: '9-р анги'},
        {value: '4954', text: '10-р анги'},
        {value: '4955', text: '11-р анги'},
        {value: '4956', text: '12-р анги'}
    ])

    const config = {
        showAllData: true,
        showPagination: false,
        showLeftButton: true,
        leftButtonStyle: {position: 'relative', bottom: '5px', backgroundColor: 'rgb(0, 156, 255)'},
        leftButtonClassName: 'btn btn-sm m-btn--pill m-btn--uppercase d-inline-flex text-white',
        leftButtonIcon: <SyncRoundedIcon/>,
        leftButtonText: translations(locale).esis.get,
        showFilter: true,
        excelExport: false,
        defaultSort: [{
            dataField: 'className',
            order: 'asc'
        }]
    }

    const submitRequest = (requestUrl, params, newTabIndex) => {
        console.log('submitRequest')
        // setLoading(true)
        // fetchRequest(requestUrl, 'POST', params)
        //     .then((res) => {
        //         setLoading(false)
        //         if (res.success) {
        //             if (newTabIndex === 0) {
        //                 const curriculums = res?.data?.curriculums;
        //                 const eschoolProgramStudies = res?.data?.eschoolProgramStudies;

        //                 if (eschoolProgramStudies && eschoolProgramStudies.length > 0) {
        //                     for (let c = 0; c < curriculums.length; c++) {
        //                         let eschoolProgramStudy = null;
        //                         for (let ec = 0; ec < eschoolProgramStudies.length; ec++) {
        //                             if (curriculums[c]?.programStudyId?.toString() === eschoolProgramStudies[ec]?.programOfStudyId) {
        //                                 eschoolProgramStudy = eschoolProgramStudies[ec];
        //                                 break;
        //                             }
        //                         }
        //                         if (eschoolProgramStudy) {
        //                             curriculums[c].eschoolCurriculumId = eschoolProgramStudy?.id;
        //                         }
        //                     }
        //                 }
        //                 setEschoolProgramStudies(eschoolProgramStudies)
        //                 setTableData(curriculums)
        //             } else if (newTabIndex === 1) {
        //                 const stages = res?.data?.stages;
        //                 const eschoolStages = res?.data?.eschoolProgramStages;

        //                 setEschoolNonConnectedGrades((res?.data?.grades || []).map(gradeObj => {
        //                     return {
        //                         value: gradeObj?.id,
        //                         text: gradeObj?.gradeName
        //                     }
        //                 }))

        //                 if (eschoolStages && eschoolStages.length > 0) {
        //                     for (let s = 0; s < stages.length; s++) {
        //                         let eschoolProgramStage = null;
        //                         for (let es = 0; es < eschoolStages.length; es++) {
        //                             if (stages[s]?.id?.toString() === eschoolStages[es]?.programStageId
        //                                 && eschoolStages[es]?.schoolGradeId) {
        //                                 eschoolProgramStage = eschoolStages[es];
        //                                 break;
        //                             }
        //                         }
        //                         if (eschoolProgramStage) {
        //                             stages[s].eschoolStageId = eschoolProgramStage?.id;
        //                         }
        //                     }
        //                 }
        //                 setEschoolProgramStages(eschoolStages)
        //                 setTableData(stages)

        //                 setShowEditModal(false)
        //                 setSelectedTableData(null)
        //             } else if (newTabIndex === 2) {
        //                 setSelectedTreeDataId(res?.data?.selectedStage)
        //                 setTreeData(res?.data?.curriculums)

        //                 const plans = res?.data?.plans;
        //                 const eschoolStagePlans = res?.data?.eschoolStagePlans;

        //                 if (eschoolStagePlans && eschoolStagePlans.length > 0) {
        //                     for (let p = 0; p < plans.length; p++) {
        //                         let eschoolStagePlan = null;
        //                         for (let sp = 0; sp < eschoolStagePlans.length; sp++) {
        //                             if (plans[p]?.id?.toString() === eschoolStagePlans[sp]?.programPlanId
        //                                 && plans[p]?.stage?.toString() === eschoolStagePlans[sp]?.programStageId) {
        //                                 eschoolStagePlan = eschoolProgramStudies[sp];
        //                                 break;
        //                             }
        //                         }
        //                         if (eschoolStagePlan) {
        //                             plans[p].eschoolPlanId = eschoolStagePlan?.id;
        //                         }
        //                     }
        //                 }
        //                 setEschoolStagePlans(eschoolStagePlans)
        //                 setTableData(plans)
        //             } else if (newTabIndex === 3) {
        //                 setSelectedTreeDataId(res?.data?.selectedPlan)
        //                 setTreeData(res?.data?.curriculums)

        //                 const subjects = res?.data?.subjects;
        //                 const eschoolSubjectList = res?.data?.eschoolSubjects;

        //                 setEschoolNonConnectedSubjects((res?.data?.nonConnectedSubjects || []).map(subjectObj => {
        //                     return {
        //                         value: subjectObj?.id,
        //                         text: subjectObj?.name + ' (' + subjectObj?.code + ')'
        //                     }
        //                 }))

        //                 if (eschoolSubjectList && eschoolSubjectList.length > 0) {
        //                     for (let s = 0; s < subjects.length; s++) {
        //                         let eschoolSubject = null;
        //                         for (let es = 0; es < eschoolSubjectList.length; es++) {
        //                             if (subjects[s]?.id?.toString() === eschoolSubjectList[es]?.courseId
        //                                 && subjects[s]?.stagePlan?.toString() === eschoolSubjectList[es]?.programPlanId
        //                                 && subjects[s]?.programStage?.toString() === eschoolSubjectList[es]?.programStageId
        //                                 && eschoolSubjectList[es]?.schoolSubjectId) {
        //                                 eschoolSubject = eschoolSubjectList[es];
        //                                 break;
        //                             }
        //                         }
        //                         if (eschoolSubject) {
        //                             subjects[s].eschoolSubjectId = eschoolSubject?.id;
        //                         }
        //                     }
        //                 }

        //                 setEschoolSubjects(eschoolSubjectList)
        //                 setTableData(subjects)

        //                 setShowEditModal(false)
        //                 setSelectedTableData(null)
        //             }
        //             setUpdateView(!updateView)
        //         } else {
        //             message(res.data.message)
        //         }
        //     })
        //     .catch((e) => {
        //         console.log('E', e)
        //         setLoading(false)
        //         message(translations(locale)?.err?.error_occurred)
        //     })
    }

    const openModal = (modal, row, newTabIndex) => {
        if (!modal || !row)
            return
        setSelectedTableData(row)
        if (modal === 'edit') {
            // if (newTabIndex === 0) {
            //     submitRequest(ESISCurriculumLink, row, newTabIndex)
            // } else 
            if (newTabIndex === 1) {
                setShowEditModal(true)
            } 
            // else if (newTabIndex === 2) {
            //     submitRequest(ESISGradePlanLink, row, newTabIndex)
            // } 
            else if (newTabIndex === 3) {
                setShowEditModal(true)
                // submitRequest(ESISPlanSubjectLink, row, newTabIndex)
            }
        } 
        else if (modal === 'delete') {
            console.log('delete')
            // if (newTabIndex === 0) {
            //     submitRequest(ESISCurriculumUnlink, row, newTabIndex)
            // } else if (newTabIndex === 1) {
            //     submitRequest(ESISCurriculumGradeUnlink, row, newTabIndex)
            // } else if (newTabIndex === 2) {
            //     submitRequest(ESISGradePlanUnlink, row, newTabIndex)
            // } else if (newTabIndex === 3) {
            //     submitRequest(ESISPlanSubjectUnlink, row, newTabIndex)
            // }
        }
    }

    const loadInit = (tabIndex = 0, params = {}) => {
        console.log('loadInit')
        // let url = null;
        // switch (tabIndex) {
        //     case 0:
        //         url = ESISCurriculums;
        //         break;
        //     case 1:
        //         url = ESISCurriculumGrades;
        //         break;
        //     case 2:
        //         url = ESISGradePlans;
        //         break;
        //     case 3:
        //         url = ESISPlanSubjects;
        //         break;
        // }
        // if (url) {
        //     setTableData([])
        //     setLoading(true)
        //     fetchRequest(url, 'POST', params)
        //         .then((res) => {
        //             setLoading(false)
        //             if (res.success) {
        //                 if (tabIndex === 0) {
        //                     const curriculums = res?.data?.curriculums;
        //                     const eschoolProgramStudies = res?.data?.eschoolProgramStudies;

        //                     if (eschoolProgramStudies && eschoolProgramStudies.length > 0) {
        //                         for (let c = 0; c < curriculums.length; c++) {
        //                             let eschoolProgramStudy = null;
        //                             for (let ec = 0; ec < eschoolProgramStudies.length; ec++) {
        //                                 if (curriculums[c]?.programStudyId?.toString() === eschoolProgramStudies[ec]?.programOfStudyId) {
        //                                     eschoolProgramStudy = eschoolProgramStudies[ec];
        //                                     break;
        //                                 }
        //                             }
        //                             if (eschoolProgramStudy) {
        //                                 curriculums[c].eschoolCurriculumId = eschoolProgramStudy?.id;
        //                             }
        //                         }
        //                     }
        //                     setEschoolProgramStudies(eschoolProgramStudies)
        //                     setTableData(curriculums)
        //                 } else if (tabIndex === 1) {
        //                     setSelectedTreeDataId(res?.data?.selectedCurriculum)
        //                     setEschoolNonConnectedGrades((res?.data?.grades || []).map(gradeObj => {
        //                         return {
        //                             value: gradeObj?.id,
        //                             text: gradeObj?.gradeName
        //                         }
        //                     }))
        //                     setTreeData(res?.data?.curriculums)

        //                     const stages = res?.data?.stages;
        //                     const eschoolStages = res?.data?.eschoolProgramStages;

        //                     if (eschoolStages && eschoolStages.length > 0) {
        //                         for (let s = 0; s < stages.length; s++) {
        //                             let eschoolProgramStage = null;

        //                             for (let es = 0; es < eschoolStages.length; es++) {
        //                                 if (stages[s]?.id?.toString() === eschoolStages[es]?.programStageId
        //                                     && eschoolStages[es]?.schoolGradeId) {
        //                                     eschoolProgramStage = eschoolStages[es];
        //                                     break;
        //                                 }
        //                             }
        //                             if (eschoolProgramStage) {
        //                                 stages[s].eschoolStageId = eschoolProgramStage?.id;
        //                             }
        //                         }
        //                     }
        //                     setEschoolProgramStages(eschoolStages)
        //                     setTableData(stages)
        //                 } else if (tabIndex === 2) {
        //                     setSelectedTreeDataId(res?.data?.selectedStage)
        //                     setTreeData(res?.data?.curriculums)

        //                     const plans = res?.data?.plans;
        //                     const eschoolStagePlans = res?.data?.eschoolStagePlans;

        //                     if (eschoolStagePlans && eschoolStagePlans.length > 0) {
        //                         for (let p = 0; p < plans.length; p++) {
        //                             let eschoolStagePlan = null;
        //                             for (let sp = 0; sp < eschoolStagePlans.length; sp++) {
        //                                 if (plans[p]?.id?.toString() === eschoolStagePlans[sp]?.programPlanId
        //                                     && plans[p]?.stage?.toString() === eschoolStagePlans[sp]?.programStageId) {
        //                                     eschoolStagePlan = eschoolProgramStudies[sp];
        //                                     break;
        //                                 }
        //                             }
        //                             if (eschoolStagePlan) {
        //                                 plans[p].eschoolPlanId = eschoolStagePlan?.id;
        //                             }
        //                         }
        //                     }
        //                     setEschoolStagePlans(eschoolStagePlans)
        //                     setTableData(plans)

        //                 } else if (tabIndex === 3) {
        //                     setSelectedTreeDataId(res?.data?.selectedPlan)
        //                     setTreeData(res?.data?.curriculums)

        //                     const subjects = res?.data?.subjects;
        //                     const eschoolSubjectList = res?.data?.eschoolSubjects;

        //                     setEschoolNonConnectedSubjects((res?.data?.nonConnectedSubjects || []).map(subjectObj => {
        //                         return {
        //                             value: subjectObj?.id,
        //                             text: subjectObj?.name + ' (' + subjectObj?.code + ')'
        //                         }
        //                     }))

        //                     if (eschoolSubjectList && eschoolSubjectList.length > 0) {
        //                         for (let s = 0; s < subjects.length; s++) {
        //                             let eschoolSubject = null;
        //                             for (let es = 0; es < eschoolSubjectList.length; es++) {
        //                                 if (subjects[s]?.id?.toString() === eschoolSubjectList[es]?.courseId
        //                                     && subjects[s]?.stagePlan?.toString() === eschoolSubjectList[es]?.programPlanId
        //                                     && subjects[s]?.programStage?.toString() === eschoolSubjectList[es]?.programStageId
        //                                     && eschoolSubjectList[es]?.schoolSubjectId) {
        //                                     eschoolSubject = eschoolSubjectList[es];
        //                                     break;
        //                                 }
        //                             }
        //                             if (eschoolSubject) {
        //                                 subjects[s].eschoolSubjectId = eschoolSubject?.id;
        //                             }
        //                         }
        //                     }

        //                     setEschoolSubjects(eschoolSubjectList)
        //                     setTableData(subjects)
        //                 }
        //                 setUpdateView(!updateView)
        //             } else {
        //                 message(res.data.message)
        //             }
        //         })
        //         .catch((e) => {
        //             console.log('e', e)
        //             setLoading(false)
        //             message(translations(locale)?.err?.error_occurred)
        //         })
        // }
    }

    useEffect(() => {
        loadInit(tabIndex)
    }, [])

    const onTabChange = (data) => {
        setTabIndex(data?.activeIndex)
        setTabCode(data?.panes?.[data?.activeIndex]?.code)
        setTreeData([])
        setSelectedTreeDataId(null)
        if (data?.panes?.[data?.activeIndex]?.code == 'curriculum') {
            setColumns([
                {
                    dataField: 'status',
                    text: '',
                    formatter: (cell, row) =>
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <div className={`table-circle ${row?.eschoolCurriculumId === true && "active"}`} />
                        </div>
                    // formatter: (cell, row) => {
                    //     return <i
                    //         className='fas fa-circle'
                    //         style={{color: row?.eschoolCurriculumId ? '#6dd400' : '#d8d8d8'}}
                    //     />
                    // }
                },
                {
                    dataField: 'programStudyId',
                    text: translations(locale)?.esis.curricula_code,
                    sort: true
                },
                {
                    dataField: 'programStudyName',
                    text: translations(locale)?.esis.curricula_name,
                    sort: true
                },
                {
                    dataField: 'curriculumCode',
                    text: translations(locale)?.esis.curricula_grade_code,
                    sort: true
                },
                {
                    dataField: 'curriculumName',
                    text: translations(locale)?.esis.curricula_grade_name,
                    sort: true
                },
                {
                    dataField: 'educationLevelCode',
                    text: translations(locale)?.esis.academic_grade_code,
                    sort: true
                },
                {
                    dataField: 'educationLevelName',
                    text: translations(locale)?.esis.academic_grade_name,
                    sort: true
                },
                {
                    dataField: 'action',
                    text: '',
                    formatter: (cell, row) => {
                        if (!row?.eschoolCurriculumId) {
                            return (
                                <button
                                    className='btn btn-primary m-btn--icon btn-sm m-btn--icon-only m-btn--pill'
                                    onClick={() => openModal('edit', row, 0)}
                                >
                                    <i className='fa flaticon-edit'/>
                                </button>
                            )
                        } else
                            return (
                                <button
                                    className='btn btn-danger m-btn--icon btn-sm m-btn--icon-only m-btn--pill'
                                    onClick={() => openModal('delete', row, 0)}
                                >
                                    <i className='fa flaticon2-cross'/>
                                </button>
                            )
                    }
                }
            ])
        } else if (data?.panes?.[data?.activeIndex]?.code == 'level') {
            setColumns([
                {
                    dataField: 'status',
                    text: '',
                    formatter: (cell, row) =>
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <div className={`table-circle ${row?.eschoolCurriculumId === true && "active"}`} />
                        </div>
                    // formatter: (cell, row) => {
                    //     return <i
                    //         className='fas fa-circle'
                    //         style={{color: row?.eschoolStageId ? '#6dd400' : '#d8d8d8'}}
                    //     />
                    // }
                },
                {
                    dataField: 'id',
                    text: translations(locale)?.esis.curricula_plan_grade_code,
                    sort: true
                },
                {
                    dataField: 'isLastGrade',
                    text: translations(locale)?.esis.curricula_grade_code,
                    sort: true
                },
                {
                    dataField: 'code',
                    text: translations(locale)?.group.code,
                    sort: true
                },
                {
                    dataField: 'name',
                    text: translations(locale)?.esis.curricula_plan_grade_name,
                    sort: true
                },
                {
                    dataField: 'action',
                    text: '',
                    formatter: (cell, row) => {
                        if (!row?.eschoolStageId) {
                            return (
                                <button
                                    className='btn btn-primary m-btn--icon btn-sm m-btn--icon-only m-btn--pill'
                                    onClick={() => openModal('edit', row, 1)}
                                >
                                    <i className='fa flaticon-edit'/>
                                </button>
                            )
                        } else
                            return (
                                <button
                                    className='btn btn-danger m-btn--icon btn-sm m-btn--icon-only m-btn--pill'
                                    onClick={() => openModal('delete', row, 1)}
                                >
                                    <i className='fa flaticon2-cross'/>
                                </button>
                            )
                    }
                }
            ])
        } else if (data?.panes?.[data?.activeIndex]?.code == 'plan') {
            setColumns([
                {
                    dataField: 'status',
                    text: '',
                    formatter: (cell, row) =>
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <div className={`table-circle ${row?.eschoolCurriculumId === true && "active"}`} />
                        </div>
                    // formatter: (cell, row) => {
                    //     return <i
                    //         className='fas fa-circle'
                    //         style={{color: row?.eschoolPlanId ? '#6dd400' : '#d8d8d8'}}
                    //     />
                    // }
                },
                {
                    dataField: 'id',
                    text: translations(locale)?.code,
                    sort: true
                },
                {
                    dataField: 'name',
                    text: translations(locale)?.esis.curricula_plan_name,
                    sort: true
                },
                {
                    dataField: 'type',
                    text: translations(locale)?.esis.curricula_plan_type,
                    sort: true
                },
                {
                    dataField: 'typeName',
                    text: translations(locale)?.esis.curricula_plan_type_name,
                    sort: true
                },
                {
                    dataField: 'degreeId',
                    text: translations(locale)?.esis.academic_level_code,
                    sort: true
                },
                {
                    dataField: 'degreeName',
                    text: translations(locale)?.esis.academic_level_name,
                    sort: true
                },
                {
                    dataField: 'action',
                    text: '',
                    formatter: (cell, row) => {
                        if (!row?.eschoolPlanId) {
                            return (
                                <button
                                    className='btn btn-primary m-btn--icon btn-sm m-btn--icon-only m-btn--pill'
                                    onClick={() => openModal('edit', row, 2)}
                                >
                                    <i className='fa flaticon-edit'/>
                                </button>
                            )
                        } else return (
                            <button
                                className='btn btn-danger m-btn--icon btn-sm m-btn--icon-only m-btn--pill'
                                onClick={() => openModal('delete', row, 2)}
                            >
                                <i className='fa flaticon2-cross'/>
                            </button>
                        )
                    }
                }
            ])
        } else if (data?.panes?.[data?.activeIndex]?.code == 'subject') {
            setColumns([
                {
                    dataField: 'status',
                    text: '',
                    formatter: (cell, row) =>
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <div className={`table-circle ${row?.eschoolCurriculumId === true && "active"}`} />
                        </div>
                    // formatter: (cell, row) => {
                    //     return <i
                    //         className='fas fa-circle'
                    //         style={{color: row?.eschoolSubjectId ? '#6dd400' : '#d8d8d8'}}
                    //     />
                    // }
                },
                {
                    dataField: 'id',
                    text: translations(locale)?.subject.code,
                    sort: true
                },
                {
                    dataField: 'name',
                    text: translations(locale)?.subject.name,
                    sort: true
                },
                {
                    dataField: 'categoryCode',
                    text: translations(locale)?.esis.studyTypeCode,
                    sort: true
                },
                {
                    dataField: 'categoryName',
                    text: translations(locale)?.esis.studyTypeName,
                    sort: true
                },
                {
                    dataField: 'elementId',
                    text: translations(locale)?.esis.curricula_element_code,
                    sort: true
                },
                {
                    dataField: 'areaId',
                    text: translations(locale)?.course.subjectCode,
                    sort: true
                },
                {
                    dataField: 'areaName',
                    text: translations(locale)?.course.subjectName,
                    sort: true
                },
                {
                    dataField: 'courseContactHours',
                    text: translations(locale)?.esis.elementCredit,
                    sort: true
                },
                {
                    dataField: 'avgContactHours',
                    text: translations(locale)?.esis.weekPerTime,
                    sort: true
                },
                {
                    dataField: 'gradingSchemeId',
                    text: translations(locale)?.esis.scoreSchemaCode,
                    sort: true
                },
                {
                    dataField: 'gradingSchemeName',
                    text: translations(locale)?.esis.scoreSchemaName,
                    sort: true
                },
                {
                    dataField: 'action',
                    text: '',
                    formatter: (cell, row) => {
                        if (!row?.eschoolSubjectId) {
                            return (
                                <button
                                    className='btn btn-primary m-btn--icon btn-sm m-btn--icon-only m-btn--pill'
                                    onClick={() => openModal('edit', row, 3)}
                                >
                                    <i className='fa flaticon-edit'/>
                                </button>
                            )
                        } else return (
                            <button
                                className='btn btn-danger m-btn--icon btn-sm m-btn--icon-only m-btn--pill'
                                onClick={() => openModal('delete', row, 3)}
                            >
                                <i className='fa flaticon2-cross'/>
                            </button>
                        )
                    }
                }
            ])
        }

        setUpdateView(!updateView)
        loadInit(data?.activeIndex)
    }

    const onSubmit = () => {
        console.log('get button', tabCode)
    }

    const handleTreeChange = treeId => {
        setSelectedTreeDataId(treeId);
        // secureLocalStorage?.setItem(tableIndex, object);

        let params = {}
        if (tabIndex === 1) {
            params = {
                programStudy: treeId
            }
        } else if (tabIndex === 2) {
            if (treeId) {
                if (treeId.includes("_")) {
                    // programStage selected
                    const postParams = treeId.split("_");
                    params = {
                        programStudy: postParams[0],
                        programStage: postParams[1]
                    }
                } else {
                    // programStudy selected
                    params = {
                        programStudy: treeId
                    }
                }
            }
        } else if (tabIndex === 3) {
            if (treeId) {
                if (treeId.includes("_")) {
                    const postParams = treeId.split("_");
                    if (postParams.length > 2) {
                        // programPlan selected
                        params = {
                            programStudy: postParams[0],
                            programStage: postParams[1],
                            programPlan: postParams[2]
                        }
                    } else {
                        // programStage selected
                        params = {
                            programStudy: postParams[0],
                            programStage: postParams[1]
                        }
                    }
                } else {
                    // programStudy selected
                    params = {
                        programStudy: treeId
                    }
                }
            }
        }
        loadInit(tabIndex, params)
    }

    const submitEdit = param => {
        console.log('submitEdit')
        // if (param?.tabIndex === 1) {
        //     submitRequest(ESISCurriculumGradeLink, param, param?.tabIndex)
        // } else if (param?.tabIndex === 3) {
        //     submitRequest(ESISPlanSubjectLink, param, param?.tabIndex)
        // }
    }

    const tabContent = () => {
        switch (tabIndex) {
            case 0:
                return <>
                    <div className='m-portlet br-12' style={{marginTop: 20}}>
                        <div className='m-portlet__body'>
                            <DTable
                                config={config}
                                data={tableData}
                                columns={columns}
                                locale={locale}
                                onLeftButtonClick={onSubmit}
                            />
                        </div>
                    </div>
                </>
            case 1:
                return <>
                    <div className='row' style={{marginTop: 20}}>
                        <div className='col-3 pr-0'>
                            <div className='m-portlet br-12'>
                                <div className='m-portlet__body'>
                                    <TreeView
                                        defaultExpandAll
                                        treeData={treeData}
                                        selectedNodes={[selectedTreeDataId]}
                                        onSelect={(key) => {
                                            handleTreeChange(key?.[0])
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className='col-9'>
                            <div className='m-portlet br-12'>
                                <div className='m-portlet__body'>
                                    <DTable
                                        config={config}
                                        data={tableData}
                                        columns={columns}
                                        locale={locale}
                                        onLeftButtonClick={onSubmit}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            case 2:
                return <>
                    <div className='row' style={{marginTop: 20}}>
                        <div className='col-3 pr-0'>
                            <div className='m-portlet br-12'>
                                <div className='m-portlet__body'>
                                    <TreeView
                                        defaultExpandAll
                                        treeData={treeData}
                                        selectedNodes={[selectedTreeDataId]}
                                        onSelect={(key) => handleTreeChange(key?.[0])}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className='col-9'>
                            <div className='m-portlet br-12'>
                                <div className='m-portlet__body'>
                                    <DTable
                                        config={config}
                                        data={tableData}
                                        columns={columns}
                                        locale={locale}
                                        onLeftButtonClick={onSubmit}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            case 3:
                return <>
                    <div className='row' style={{marginTop: 20}}>
                        <div className='col-3 pr-0'>
                            <div className='m-portlet br-12'>
                                <div className='m-portlet__body'>
                                    <TreeView
                                        defaultExpandAll
                                        treeData={treeData}
                                        selectedNodes={[selectedTreeDataId]}
                                        onSelect={(key) => handleTreeChange(key?.[0])}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className='col-9'>
                            <div className='m-portlet br-12'>
                                <div className='m-portlet__body'>
                                    <DTable
                                        config={config}
                                        data={tableData}
                                        columns={columns}
                                        locale={locale}
                                        onLeftButtonClick={onSubmit}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            default:
                return null;
        }
    }

    const closeModal = () => {
        setSelectedTableData(null)
        setShowEditModal(false)
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
                <div>
                    <Tab
                        activeIndex={tabIndex}
                        menu={{secondary: true, pointing: true, className: 'primaryColor'}}
                        className='no-shadow'
                        onTabChange={(e, data) => onTabChange(data)}
                        panes={[
                        {
                            index: 0,
                            code: 'curriculum',
                            menuItem: translations(locale)?.esis?.curricula,
                            id: 0
                        },
                        {
                            index: 1,
                            code: 'level',
                            menuItem: translations(locale)?.esis?.curriculaLevel,
                            id: 1
                        },
                        {
                            index: 2,
                            code: 'plan',
                            menuItem: translations(locale)?.esis?.curriculaPlan,
                            id: 2
                        },
                        {
                            index: 3,
                            code: 'subject',
                            menuItem: translations(locale)?.esis?.curriculaSubject,
                            id: 3
                        }]}
                    />
                </div>
                    {
                        tabContent()
                    }
            </div>
            {
                showEditModal && selectedTableData &&
                <EditModal
                    onClose={closeModal}
                    onSubmit={submitEdit}
                    title={tabIndex === 1 ? translations(locale)?.teacher?.select_school_grade : (tabIndex === 3 ? translations(locale)?.timetable?.select_subject : '')}
                    esisData={{...selectedTableData, ...{tabIndex: tabIndex}}}
                    options={tabIndex === 1 ? eschoolNonConnectedGrades : (tabIndex === 3 ? eschoolNonConnectedSubjects : [])}
                />
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