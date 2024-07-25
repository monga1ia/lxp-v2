import React, {useEffect, useState} from "react";
import {translations} from "utils/translations";
import {Row, Col} from 'react-bootstrap'
import DTable from "modules/DataTable/DTable";
import HtmlHead from "components/html-head/HtmlHead";
import BreadcrumbList from "components/breadcrumb-list/BreadcrumbList";
import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded';
import secureLocalStorage from "react-secure-storage";
// import {fetchRequest} from 'utils/fetchRequest'
// import {
//     managerDetention,
//     managerDetentionDelete,
//     managerDetentionEdit,
//     managerDetentionStudentSubmit
// } from 'utils/url'
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone'
import BorderColorTwoToneIcon from '@mui/icons-material/BorderColorTwoTone'
import message from "modules/message";
import TreeView from "modules/TreeView";

import CreateModal from './modal/create'
import ViewModal from './modal/view'
import DeleteModal from './modal/delete'
import EditModal from './modal/edit'
import { useTranslation } from "react-i18next";

const locale = secureLocalStorage?.getItem('selectedLang') || 'mn'

const contextMenus = [
    {
        key: 'edit',
        icon: <BorderColorTwoToneIcon sx={{fontSize: '2rem !important', color: '#ff5b1d'}}/>,
        title: translations(locale)?.action?.edit
    },
    {
        key: 'delete',
        icon: <DeleteTwoToneIcon sx={{fontSize: '2rem !important', color: '#ff5b1d'}}/>,
        title: translations(locale)?.action?.delete
    }
]

const index = () => {
    
    const treeIndex = 'manager_detention_index'
    const [treeData, setTreeData] = useState([])
    const [selectedTreeData, setSelectedTreeData] = useState(secureLocalStorage?.getItem(treeIndex) || [])
    const { t } = useTranslation()

    const title = t('manager.detention');
    const description = "E-learning";
    const breadcrumbs = [
        { to: "", text: "Home" },
        { to: "school/teacher", text: title }
    ];

    const [showModal, setShowModal] = useState(false)
    const [showEditModal, setShowEditModal] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [showDetailModal, setShowDetailModal] = useState(false)

    const [detailId, setDetailId] = useState(null)
    const [loading, setLoading] = useState(false)
    const [totalCount, setTotalCount] = useState(0)
    const [detentions, setDetentions] = useState([])

    const [classes, setClasses] = useState([])
    const [types, setTypes] = useState([])

    const [tableState, setTableState] = useState({
        page: 1,
        pageSize: 10,
        search: null,
        order: null,
        sort: null,
    })

    const config = {
        excelExport: true,
        excelFileName: `${translations(locale)?.school_settings?.detention}`,
        printButton: false,
        columnButton: false,
        defaultPageOptions: tableState
    }

    const columns = [
        {
            dataField: 'createdDate',
            text: translations(locale)?.date,
            sort: true,
            formatter: (cell, row) => {
                return <span className={'underline'} onClick={() => loadDetentionDetail(row?.id)}>{cell}</span>
            }
        },
        {
            dataField: 'typeName',
            text: translations(locale)?.type,
            sort: true
        },
        {
            dataField: 'className',
            text: translations(locale)?.class_name,
            sort: true
        },
        {
            dataField: 'code',
            text: translations(locale)?.studentCode,
            sort: true,
        },
        {
            dataField: 'lastName',
            text: translations(locale)?.studentLastName,
            sort: true
        },
        {
            dataField: 'firstName',
            text: translations(locale)?.studentFirstName,
            sort: true
        },
        {
            dataField: 'createdUser',
            text: translations(locale)?.created_by,
            sort: true,
            formatter: (cell, row) => {
                return row?.username + ' - ' + cell
            }
        },
    ]

    const onClose = () => {
        setDetailId(null)
        setShowModal(false)
        setShowDetailModal(false)
        setShowEditModal(false)
    }

    const onDeleteClose = () => {
        setDetailId(null)
        setShowDeleteModal(false)
    }

    useEffect(() => {
        loadIndex()
    }, [])

    const loadDetentionDetail = (id) => {
        setDetailId(id)
        setShowDetailModal(true)
    }

    // const loadIndex = (season = null, page = 1, pageSize = 10, search = null, sort = null, order = null) => {
    //     console.log('loadIndex')
    //     setLoading(true)
    //     fetchRequest(managerDetention, 'POST', {
    //         season,
    //         page,
    //         pageSize,
    //         search,
    //         sort,
    //         order
    //     })
    //         .then((res) => {
    //             if (res?.success) {

    //                 setSelectedTreeData({ isCurrent: true, id: res?.data?.selectedSeason })
    //                 secureLocalStorage?.setItem(treeIndex, { isCurrent: true, id: res?.data?.selectedSeason });

    //                 setClasses(res?.data?.classes)
    //                 setTypes(res?.data?.types)
    //                 setTreeData((res?.data?.seasons || [])?.map(obj => {
    //                     return {
    //                         key: obj?.id,
    //                         title: obj?.name
    //                     }
    //                 }))
    //                 setDetentions(res?.data?.list)
    //                 setTotalCount(res?.data?.totalCount)
    //             } else {
    //                 message(res?.data?.message || translations(locale)?.err?.error_occurred)
    //             }
    //             setLoading(false)
    //         })
    //         .catch(() => {
    //             message(translations(locale)?.err?.error_occurred)
    //             setLoading(false)
    //         })
    // }

    const loadIndex = (season = null, page = 1, pageSize = 10, search = null, sort = null, order = null) => {
        console.log('frontend testing data')

        const res = {
            data: {
                selectedSeason: "1176",
                classes: [
                    {
                        id: "11715",
                        class: "h",
                        teacherId: "410",
                        teacherFirstName: "galaa real",
                        teacherLastName: "ts",
                        mdGradeId: 5,
                        parentGradeCode: "PRIMARY",
                        scoreType: "I-VIII",
                        shiftId: 32,
                        shift: "1-р ээлж",
                        room: "101",
                        roomNumber: "101",
                        gradeId: "2117",
                        gradeCode: "1",
                        gradeName: "1-р анги",
                        value: "11715",
                        text: "h",
                        esisGroupId: null,
                        esisAcademicLevel: null,
                        esisAcademicLevelName: null,
                        esisProgramOfStudyId: null,
                        esisProgramStageId: null,
                        esisStudentGroupName: null,
                        esisTeacherId: null,
                        esisTeacherName: null,
                        scoreTypeId: 77,
                        scoreTypeName: "I-VIII",
                        studentCount: 1
                    },
                    {
                        id: "11822",
                        class: "ENGLISH",
                        teacherId: "14534",
                        teacherFirstName: "Haws",
                        teacherLastName: "Tom",
                        mdGradeId: 49,
                        parentGradeCode: "KINDERGARTEN",
                        scoreType: "Тооцов",
                        shiftId: 32,
                        shift: "1-р ээлж",
                        room: "309",
                        roomNumber: "309",
                        gradeId: "3986",
                        gradeCode: "KINDER_HIGH",
                        gradeName: "Ахлах бүлэг",
                        value: "11822",
                        text: "ENGLISH",
                        esisGroupId: null,
                        esisAcademicLevel: null,
                        esisAcademicLevelName: null,
                        esisProgramOfStudyId: null,
                        esisProgramStageId: null,
                        esisStudentGroupName: null,
                        esisTeacherId: null,
                        esisTeacherName: null,
                        scoreTypeId: 67,
                        scoreTypeName: "Тооцов",
                        studentCount: 0
                    },
                    {
                        id: "11306",
                        class: "Баянхонгор",
                        teacherId: "11090",
                        teacherFirstName: "Altanshagai",
                        teacherLastName: "Byambasuren",
                        mdGradeId: 47,
                        parentGradeCode: "HIGH",
                        scoreType: "I-VIII",
                        shiftId: 32,
                        shift: "1-р ээлж",
                        room: null,
                        roomNumber: null,
                        gradeId: "2130",
                        gradeCode: "12",
                        gradeName: "12-р анги",
                        value: "11306",
                        text: "Баянхонгор",
                        esisGroupId: null,
                        esisAcademicLevel: null,
                        esisAcademicLevelName: null,
                        esisProgramOfStudyId: null,
                        esisProgramStageId: null,
                        esisStudentGroupName: null,
                        esisTeacherId: null,
                        esisTeacherName: null,
                        scoreTypeId: 77,
                        scoreTypeName: "I-VIII",
                        studentCount: 30
                    },
                    {
                        id: "11593",
                        class: "Testiin buleg",
                        teacherId: "11090",
                        teacherFirstName: "Altanshagai",
                        teacherLastName: "Byambasuren",
                        mdGradeId: 47,
                        parentGradeCode: "HIGH",
                        scoreType: "GPA үнэлгээ",
                        shiftId: 32,
                        shift: "1-р ээлж",
                        room: null,
                        roomNumber: null,
                        gradeId: "2130",
                        gradeCode: "12",
                        gradeName: "12-р анги",
                        value: "11593",
                        text: "Testiin buleg",
                        esisGroupId: null,
                        esisAcademicLevel: null,
                        esisAcademicLevelName: null,
                        esisProgramOfStudyId: null,
                        esisProgramStageId: null,
                        esisStudentGroupName: null,
                        esisTeacherId: null,
                        esisTeacherName: null,
                        scoreTypeId: 86,
                        scoreTypeName: "GPA үнэлгээ",
                        studentCount: 1
                    },
                    {
                        id: "12527",
                        class: "1B",
                        teacherId: null,
                        teacherFirstName: null,
                        teacherLastName: null,
                        mdGradeId: 5,
                        parentGradeCode: "PRIMARY",
                        scoreType: "Тооцов",
                        shiftId: 32,
                        shift: "1-р ээлж",
                        room: null,
                        roomNumber: null,
                        gradeId: "4943",
                        gradeCode: "1",
                        gradeName: "1-р анги",
                        value: "12527",
                        text: "1B",
                        esisGroupId: null,
                        esisAcademicLevel: null,
                        esisAcademicLevelName: null,
                        esisProgramOfStudyId: null,
                        esisProgramStageId: null,
                        esisStudentGroupName: null,
                        esisTeacherId: null,
                        esisTeacherName: null,
                        scoreTypeId: 67,
                        scoreTypeName: "Тооцов",
                        studentCount: 0
                    },
                    {
                        id: "9974",
                        class: "1А",
                        teacherId: "1587",
                        teacherFirstName: "Baatar",
                        teacherLastName: "Bayarbat",
                        mdGradeId: 5,
                        parentGradeCode: "PRIMARY",
                        scoreType: "Тооцов",
                        shiftId: 33,
                        shift: "2-р ээлж",
                        room: "102",
                        roomNumber: "102",
                        gradeId: "2117",
                        gradeCode: "1",
                        gradeName: "1-р анги",
                        value: "9974",
                        text: "1А",
                        esisGroupId: null,
                        esisAcademicLevel: null,
                        esisAcademicLevelName: null,
                        esisProgramOfStudyId: null,
                        esisProgramStageId: null,
                        esisStudentGroupName: null,
                        esisTeacherId: null,
                        esisTeacherName: null,
                        scoreTypeId: 67,
                        scoreTypeName: "Тооцов",
                        studentCount: 0
                    },
                    {
                        id: "5303",
                        class: "1В",
                        teacherId: "11163",
                        teacherFirstName: "Цэрэнсодном",
                        teacherLastName: "Бямбадорж",
                        mdGradeId: 5,
                        parentGradeCode: "PRIMARY",
                        scoreType: "I-VIII",
                        shiftId: 32,
                        shift: "1-р ээлж",
                        room: "101",
                        roomNumber: "101",
                        gradeId: "2117",
                        gradeCode: "1",
                        gradeName: "1-р анги",
                        value: "5303",
                        text: "1В",
                        esisGroupId: null,
                        esisAcademicLevel: null,
                        esisAcademicLevelName: null,
                        esisProgramOfStudyId: null,
                        esisProgramStageId: null,
                        esisStudentGroupName: null,
                        esisTeacherId: null,
                        esisTeacherName: null,
                        scoreTypeId: 77,
                        scoreTypeName: "I-VIII",
                        studentCount: 0
                    },
                    {
                        id: "11309",
                        class: "1с",
                        teacherId: "11698",
                        teacherFirstName: "Саруул",
                        teacherLastName: "У",
                        mdGradeId: 5,
                        parentGradeCode: "PRIMARY",
                        scoreType: "I-VIII",
                        shiftId: 32,
                        shift: "1-р ээлж",
                        room: null,
                        roomNumber: null,
                        gradeId: "2117",
                        gradeCode: "1",
                        gradeName: "1-р анги",
                        value: "11309",
                        text: "1с",
                        esisGroupId: null,
                        esisAcademicLevel: null,
                        esisAcademicLevelName: null,
                        esisProgramOfStudyId: null,
                        esisProgramStageId: null,
                        esisStudentGroupName: null,
                        esisTeacherId: null,
                        esisTeacherName: null,
                        scoreTypeId: 77,
                        scoreTypeName: "I-VIII",
                        studentCount: 0
                    },
                    {
                        id: "5293",
                        class: "2A",
                        teacherId: "15577",
                        teacherFirstName: "Naranzul",
                        teacherLastName: "Togtokh",
                        mdGradeId: 6,
                        parentGradeCode: "PRIMARY",
                        scoreType: "I-VIII",
                        shiftId: 32,
                        shift: "1-р ээлж",
                        room: null,
                        roomNumber: null,
                        gradeId: "2118",
                        gradeCode: "2",
                        gradeName: "2-р анги",
                        value: "5293",
                        text: "2A",
                        esisGroupId: null,
                        esisAcademicLevel: null,
                        esisAcademicLevelName: null,
                        esisProgramOfStudyId: null,
                        esisProgramStageId: null,
                        esisStudentGroupName: null,
                        esisTeacherId: null,
                        esisTeacherName: null,
                        scoreTypeId: 77,
                        scoreTypeName: "I-VIII",
                        studentCount: 3
                    },
                    {
                        id: "12528",
                        class: "2B",
                        teacherId: null,
                        teacherFirstName: null,
                        teacherLastName: null,
                        mdGradeId: 6,
                        parentGradeCode: "PRIMARY",
                        scoreType: "Тооцов",
                        shiftId: 32,
                        shift: "1-р ээлж",
                        room: null,
                        roomNumber: null,
                        gradeId: "4944",
                        gradeCode: "2",
                        gradeName: "2-р анги",
                        value: "12528",
                        text: "2B",
                        esisGroupId: null,
                        esisAcademicLevel: null,
                        esisAcademicLevelName: null,
                        esisProgramOfStudyId: null,
                        esisProgramStageId: null,
                        esisStudentGroupName: null,
                        esisTeacherId: null,
                        esisTeacherName: null,
                        scoreTypeId: 67,
                        scoreTypeName: "Тооцов",
                        studentCount: 0
                    },
                    {
                        id: "10505",
                        class: "2а",
                        teacherId: "474",
                        teacherFirstName: "Admin",
                        teacherLastName: "eSchool",
                        mdGradeId: 6,
                        parentGradeCode: "PRIMARY",
                        scoreType: "Тооцов",
                        shiftId: 32,
                        shift: "1-р ээлж",
                        room: null,
                        roomNumber: null,
                        gradeId: "2118",
                        gradeCode: "2",
                        gradeName: "2-р анги",
                        value: "10505",
                        text: "2а",
                        esisGroupId: null,
                        esisAcademicLevel: null,
                        esisAcademicLevelName: null,
                        esisProgramOfStudyId: null,
                        esisProgramStageId: null,
                        esisStudentGroupName: null,
                        esisTeacherId: null,
                        esisTeacherName: null,
                        scoreTypeId: 67,
                        scoreTypeName: "Тооцов",
                        studentCount: 0
                    },
                    {
                        id: "5294",
                        class: "2в",
                        teacherId: "6702",
                        teacherFirstName: "Enkhdelger",
                        teacherLastName: "Ankhbayar",
                        mdGradeId: 6,
                        parentGradeCode: "PRIMARY",
                        scoreType: "Тооцов",
                        shiftId: 32,
                        shift: "1-р ээлж",
                        room: null,
                        roomNumber: null,
                        gradeId: "2118",
                        gradeCode: "2",
                        gradeName: "2-р анги",
                        value: "5294",
                        text: "2в",
                        esisGroupId: null,
                        esisAcademicLevel: null,
                        esisAcademicLevelName: null,
                        esisProgramOfStudyId: null,
                        esisProgramStageId: null,
                        esisStudentGroupName: null,
                        esisTeacherId: null,
                        esisTeacherName: null,
                        scoreTypeId: 67,
                        scoreTypeName: "Тооцов",
                        studentCount: 1
                    },
                    {
                        id: "5296",
                        class: "2В",
                        teacherId: "14090",
                        teacherFirstName: "Индра",
                        teacherLastName: "Од",
                        mdGradeId: 6,
                        parentGradeCode: "PRIMARY",
                        scoreType: "I-VIII",
                        shiftId: 32,
                        shift: "1-р ээлж",
                        room: null,
                        roomNumber: null,
                        gradeId: "2118",
                        gradeCode: "2",
                        gradeName: "2-р анги",
                        value: "5296",
                        text: "2В",
                        esisGroupId: null,
                        esisAcademicLevel: null,
                        esisAcademicLevelName: null,
                        esisProgramOfStudyId: null,
                        esisProgramStageId: null,
                        esisStudentGroupName: null,
                        esisTeacherId: null,
                        esisTeacherName: null,
                        scoreTypeId: 77,
                        scoreTypeName: "I-VIII",
                        studentCount: 0
                    },
                    {
                        id: "8937",
                        class: "3а",
                        teacherId: "11163",
                        teacherFirstName: "Цэрэнсодном",
                        teacherLastName: "Бямбадорж",
                        mdGradeId: 39,
                        parentGradeCode: "PRIMARY",
                        scoreType: "I-VIII",
                        shiftId: 32,
                        shift: "1-р ээлж",
                        room: "103",
                        roomNumber: "103",
                        gradeId: "2119",
                        gradeCode: "03",
                        gradeName: "3-р анги",
                        value: "8937",
                        text: "3а",
                        esisGroupId: null,
                        esisAcademicLevel: null,
                        esisAcademicLevelName: null,
                        esisProgramOfStudyId: null,
                        esisProgramStageId: null,
                        esisStudentGroupName: null,
                        esisTeacherId: null,
                        esisTeacherName: null,
                        scoreTypeId: 77,
                        scoreTypeName: "I-VIII",
                        studentCount: 0
                    },
                    {
                        id: "5295",
                        class: "4А",
                        teacherId: "11841",
                        teacherFirstName: "Болдмаа",
                        teacherLastName: "Дорж",
                        mdGradeId: 43,
                        parentGradeCode: "PRIMARY",
                        scoreType: "I-VIII",
                        shiftId: 32,
                        shift: "1-р ээлж",
                        room: null,
                        roomNumber: null,
                        gradeId: "2120",
                        gradeCode: "04",
                        gradeName: "4-р анги",
                        value: "5295",
                        text: "4А",
                        esisGroupId: null,
                        esisAcademicLevel: null,
                        esisAcademicLevelName: null,
                        esisProgramOfStudyId: null,
                        esisProgramStageId: null,
                        esisStudentGroupName: null,
                        esisTeacherId: null,
                        esisTeacherName: null,
                        scoreTypeId: 77,
                        scoreTypeName: "I-VIII",
                        studentCount: 0
                    },
                    {
                        id: "5302",
                        class: "5А",
                        teacherId: "6963",
                        teacherFirstName: "Батболд",
                        teacherLastName: "Тэгшээ",
                        mdGradeId: 44,
                        parentGradeCode: "PRIMARY",
                        scoreType: "I-VIII",
                        shiftId: 32,
                        shift: "1-р ээлж",
                        room: null,
                        roomNumber: null,
                        gradeId: "2121",
                        gradeCode: "05",
                        gradeName: "5-р анги",
                        value: "5302",
                        text: "5А",
                        esisGroupId: null,
                        esisAcademicLevel: null,
                        esisAcademicLevelName: null,
                        esisProgramOfStudyId: null,
                        esisProgramStageId: null,
                        esisStudentGroupName: null,
                        esisTeacherId: null,
                        esisTeacherName: null,
                        scoreTypeId: 77,
                        scoreTypeName: "I-VIII",
                        studentCount: 0
                    },
                    {
                        id: "11756",
                        class: "6А",
                        teacherId: "11820",
                        teacherFirstName: "Ерөнхий Боловсролын Орчлон Сургууль",
                        teacherLastName: "eSchool",
                        mdGradeId: 40,
                        parentGradeCode: "GRAMMAR",
                        scoreType: "I-VIII",
                        shiftId: 32,
                        shift: "1-р ээлж",
                        room: null,
                        roomNumber: null,
                        gradeId: "2123",
                        gradeCode: "6",
                        gradeName: "6-р анги",
                        value: "11756",
                        text: "6А",
                        esisGroupId: null,
                        esisAcademicLevel: null,
                        esisAcademicLevelName: null,
                        esisProgramOfStudyId: null,
                        esisProgramStageId: null,
                        esisStudentGroupName: null,
                        esisTeacherId: null,
                        esisTeacherName: null,
                        scoreTypeId: 77,
                        scoreTypeName: "I-VIII",
                        studentCount: 0
                    },
                    {
                        id: "5299",
                        class: "7А",
                        teacherId: "6702",
                        teacherFirstName: "Enkhdelger",
                        teacherLastName: "Ankhbayar",
                        mdGradeId: 36,
                        parentGradeCode: "GRAMMAR",
                        scoreType: "I-VIII",
                        shiftId: 32,
                        shift: "1-р ээлж",
                        room: null,
                        roomNumber: null,
                        gradeId: "2124",
                        gradeCode: "7",
                        gradeName: "7-р анги",
                        value: "5299",
                        text: "7А",
                        esisGroupId: null,
                        esisAcademicLevel: null,
                        esisAcademicLevelName: null,
                        esisProgramOfStudyId: null,
                        esisProgramStageId: null,
                        esisStudentGroupName: null,
                        esisTeacherId: null,
                        esisTeacherName: null,
                        scoreTypeId: 77,
                        scoreTypeName: "I-VIII",
                        studentCount: 0
                    },
                    {
                        id: "5301",
                        class: "7Б",
                        teacherId: "11163",
                        teacherFirstName: "Цэрэнсодном",
                        teacherLastName: "Бямбадорж",
                        mdGradeId: 36,
                        parentGradeCode: "GRAMMAR",
                        scoreType: "I-VIII",
                        shiftId: 32,
                        shift: "1-р ээлж",
                        room: null,
                        roomNumber: null,
                        gradeId: "2124",
                        gradeCode: "7",
                        gradeName: "7-р анги",
                        value: "5301",
                        text: "7Б",
                        esisGroupId: null,
                        esisAcademicLevel: null,
                        esisAcademicLevelName: null,
                        esisProgramOfStudyId: null,
                        esisProgramStageId: null,
                        esisStudentGroupName: null,
                        esisTeacherId: null,
                        esisTeacherName: null,
                        scoreTypeId: 77,
                        scoreTypeName: "I-VIII",
                        studentCount: 2
                    },
                    {
                        id: "5300",
                        class: "8А",
                        teacherId: "6702",
                        teacherFirstName: "Enkhdelger",
                        teacherLastName: "Ankhbayar",
                        mdGradeId: 32,
                        parentGradeCode: "GRAMMAR",
                        scoreType: "I-VIII",
                        shiftId: 32,
                        shift: "1-р ээлж",
                        room: null,
                        roomNumber: null,
                        gradeId: "2125",
                        gradeCode: "8",
                        gradeName: "8-р анги",
                        value: "5300",
                        text: "8А",
                        esisGroupId: null,
                        esisAcademicLevel: null,
                        esisAcademicLevelName: null,
                        esisProgramOfStudyId: null,
                        esisProgramStageId: null,
                        esisStudentGroupName: null,
                        esisTeacherId: null,
                        esisTeacherName: null,
                        scoreTypeId: 77,
                        scoreTypeName: "I-VIII",
                        studentCount: 0
                    },
                    {
                        id: "9947",
                        class: "8Б",
                        teacherId: "6735",
                        teacherFirstName: "Ganaa",
                        teacherLastName: "B.",
                        mdGradeId: 32,
                        parentGradeCode: "GRAMMAR",
                        scoreType: "Тооцов",
                        shiftId: 33,
                        shift: "2-р ээлж",
                        room: null,
                        roomNumber: null,
                        gradeId: "2125",
                        gradeCode: "8",
                        gradeName: "8-р анги",
                        value: "9947",
                        text: "8Б",
                        esisGroupId: null,
                        esisAcademicLevel: null,
                        esisAcademicLevelName: null,
                        esisProgramOfStudyId: null,
                        esisProgramStageId: null,
                        esisStudentGroupName: null,
                        esisTeacherId: null,
                        esisTeacherName: null,
                        scoreTypeId: 67,
                        scoreTypeName: "Тооцов",
                        studentCount: 8
                    },
                    {
                        id: "10104",
                        class: "8Д",
                        teacherId: "11163",
                        teacherFirstName: "Цэрэнсодном",
                        teacherLastName: "Бямбадорж",
                        mdGradeId: 32,
                        parentGradeCode: "GRAMMAR",
                        scoreType: "I-VIII",
                        shiftId: 32,
                        shift: "1-р ээлж",
                        room: null,
                        roomNumber: null,
                        gradeId: "2125",
                        gradeCode: "8",
                        gradeName: "8-р анги",
                        value: "10104",
                        text: "8Д",
                        esisGroupId: null,
                        esisAcademicLevel: null,
                        esisAcademicLevelName: null,
                        esisProgramOfStudyId: null,
                        esisProgramStageId: null,
                        esisStudentGroupName: null,
                        esisTeacherId: null,
                        esisTeacherName: null,
                        scoreTypeId: 77,
                        scoreTypeName: "I-VIII",
                        studentCount: 4
                    },
                    {
                        id: "11312",
                        class: "8gg",
                        teacherId: null,
                        teacherFirstName: null,
                        teacherLastName: null,
                        mdGradeId: 32,
                        parentGradeCode: "GRAMMAR",
                        scoreType: "I-VIII",
                        shiftId: 32,
                        shift: "1-р ээлж",
                        room: null,
                        roomNumber: null,
                        gradeId: "2125",
                        gradeCode: "8",
                        gradeName: "8-р анги",
                        value: "11312",
                        text: "8gg",
                        esisGroupId: null,
                        esisAcademicLevel: null,
                        esisAcademicLevelName: null,
                        esisProgramOfStudyId: null,
                        esisProgramStageId: null,
                        esisStudentGroupName: null,
                        esisTeacherId: null,
                        esisTeacherName: null,
                        scoreTypeId: 77,
                        scoreTypeName: "I-VIII",
                        studentCount: 0
                    },
                    {
                        id: "11789",
                        class: "9А",
                        teacherId: "11820",
                        teacherFirstName: "Ерөнхий Боловсролын Орчлон Сургууль",
                        teacherLastName: "eSchool",
                        mdGradeId: 41,
                        parentGradeCode: "GRAMMAR",
                        scoreType: "I-VIII",
                        shiftId: 32,
                        shift: "1-р ээлж",
                        room: null,
                        roomNumber: null,
                        gradeId: "2126",
                        gradeCode: "9",
                        gradeName: "9-р анги",
                        value: "11789",
                        text: "9А",
                        esisGroupId: null,
                        esisAcademicLevel: null,
                        esisAcademicLevelName: null,
                        esisProgramOfStudyId: null,
                        esisProgramStageId: null,
                        esisStudentGroupName: null,
                        esisTeacherId: null,
                        esisTeacherName: null,
                        scoreTypeId: 77,
                        scoreTypeName: "I-VIII",
                        studentCount: 0
                    },
                    {
                        id: "10255",
                        class: "10А",
                        teacherId: "474",
                        teacherFirstName: "Admin",
                        teacherLastName: "eSchool",
                        mdGradeId: 45,
                        parentGradeCode: "HIGH",
                        scoreType: "I-VIII",
                        shiftId: 32,
                        shift: "1-р ээлж",
                        room: "103",
                        roomNumber: "103",
                        gradeId: "2128",
                        gradeCode: "10",
                        gradeName: "10-р анги",
                        value: "10255",
                        text: "10А",
                        esisGroupId: null,
                        esisAcademicLevel: null,
                        esisAcademicLevelName: null,
                        esisProgramOfStudyId: null,
                        esisProgramStageId: null,
                        esisStudentGroupName: null,
                        esisTeacherId: null,
                        esisTeacherName: null,
                        scoreTypeId: 77,
                        scoreTypeName: "I-VIII",
                        studentCount: 0
                    },
                    {
                        id: "10346",
                        class: "11А",
                        teacherId: "14537",
                        teacherFirstName: "carter",
                        teacherLastName: "john",
                        mdGradeId: 46,
                        parentGradeCode: "HIGH",
                        scoreType: "I-VIII",
                        shiftId: 32,
                        shift: "1-р ээлж",
                        room: null,
                        roomNumber: null,
                        gradeId: "2129",
                        gradeCode: "11",
                        gradeName: "11-р анги",
                        value: "10346",
                        text: "11А",
                        esisGroupId: null,
                        esisAcademicLevel: null,
                        esisAcademicLevelName: null,
                        esisProgramOfStudyId: null,
                        esisProgramStageId: null,
                        esisStudentGroupName: null,
                        esisTeacherId: null,
                        esisTeacherName: null,
                        scoreTypeId: 77,
                        scoreTypeName: "I-VIII",
                        studentCount: 0
                    },
                    {
                        id: "10347",
                        class: "11Б",
                        teacherId: "11163",
                        teacherFirstName: "Цэрэнсодном",
                        teacherLastName: "Бямбадорж",
                        mdGradeId: 46,
                        parentGradeCode: "HIGH",
                        scoreType: "I-VIII",
                        shiftId: 32,
                        shift: "1-р ээлж",
                        room: null,
                        roomNumber: null,
                        gradeId: "2129",
                        gradeCode: "11",
                        gradeName: "11-р анги",
                        value: "10347",
                        text: "11Б",
                        esisGroupId: null,
                        esisAcademicLevel: null,
                        esisAcademicLevelName: null,
                        esisProgramOfStudyId: null,
                        esisProgramStageId: null,
                        esisStudentGroupName: null,
                        esisTeacherId: null,
                        esisTeacherName: null,
                        scoreTypeId: 77,
                        scoreTypeName: "I-VIII",
                        studentCount: 0
                    },
                    {
                        id: "11828",
                        class: "12C",
                        teacherId: "11841",
                        teacherFirstName: "Болдмаа",
                        teacherLastName: "Дорж",
                        mdGradeId: 47,
                        parentGradeCode: "HIGH",
                        scoreType: "Тооцов",
                        shiftId: 32,
                        shift: "1-р ээлж",
                        room: "309",
                        roomNumber: "309",
                        gradeId: "2130",
                        gradeCode: "12",
                        gradeName: "12-р анги",
                        value: "11828",
                        text: "12C",
                        esisGroupId: null,
                        esisAcademicLevel: null,
                        esisAcademicLevelName: null,
                        esisProgramOfStudyId: null,
                        esisProgramStageId: null,
                        esisStudentGroupName: null,
                        esisTeacherId: null,
                        esisTeacherName: null,
                        scoreTypeId: 67,
                        scoreTypeName: "Тооцов",
                        studentCount: 1
                    },
                    {
                        id: "9979",
                        class: "12А",
                        teacherId: "15577",
                        teacherFirstName: "Naranzul",
                        teacherLastName: "Togtokh",
                        mdGradeId: 47,
                        parentGradeCode: "HIGH",
                        scoreType: "I-VIII",
                        shiftId: 32,
                        shift: "1-р ээлж",
                        room: "101",
                        roomNumber: "101",
                        gradeId: "2130",
                        gradeCode: "12",
                        gradeName: "12-р анги",
                        value: "9979",
                        text: "12А",
                        esisGroupId: null,
                        esisAcademicLevel: null,
                        esisAcademicLevelName: null,
                        esisProgramOfStudyId: null,
                        esisProgramStageId: null,
                        esisStudentGroupName: null,
                        esisTeacherId: null,
                        esisTeacherName: null,
                        scoreTypeId: 77,
                        scoreTypeName: "I-VIII",
                        studentCount: 12
                    },
                    {
                        id: "11753",
                        class: "12Б Тони",
                        teacherId: "13540",
                        teacherFirstName: "Otgontsetseg",
                        teacherLastName: "Мөнх-Эрдэнэ",
                        mdGradeId: 47,
                        parentGradeCode: "HIGH",
                        scoreType: "I-VIII",
                        shiftId: 32,
                        shift: "1-р ээлж",
                        room: null,
                        roomNumber: null,
                        gradeId: "2130",
                        gradeCode: "12",
                        gradeName: "12-р анги",
                        value: "11753",
                        text: "12Б Тони",
                        esisGroupId: null,
                        esisAcademicLevel: null,
                        esisAcademicLevelName: null,
                        esisProgramOfStudyId: null,
                        esisProgramStageId: null,
                        esisStudentGroupName: null,
                        esisTeacherId: null,
                        esisTeacherName: null,
                        scoreTypeId: 77,
                        scoreTypeName: "I-VIII",
                        studentCount: 6
                    },
                    {
                        id: "11794",
                        class: "2651",
                        teacherId: "474",
                        teacherFirstName: "Admin",
                        teacherLastName: "eSchool",
                        mdGradeId: 5,
                        parentGradeCode: "PRIMARY",
                        scoreType: "Тооцов",
                        shiftId: 32,
                        shift: "1-р ээлж",
                        room: null,
                        roomNumber: null,
                        gradeId: "2117",
                        gradeCode: "1",
                        gradeName: "1-р анги",
                        value: "11794",
                        text: "2651",
                        esisGroupId: null,
                        esisAcademicLevel: null,
                        esisAcademicLevelName: null,
                        esisProgramOfStudyId: null,
                        esisProgramStageId: null,
                        esisStudentGroupName: null,
                        esisTeacherId: null,
                        esisTeacherName: null,
                        scoreTypeId: 67,
                        scoreTypeName: "Тооцов",
                        studentCount: 0
                    }
                ],
                seasons: [
                    {
                        id: "518",
                        code: "01",
                        name: "1-р улирал",
                        startDate: {
                            date: "2023-08-01 00:00:00.000000",
                            timezone_type: 3,
                            timezone: "Asia/Ulaanbaatar"
                        },
                        endDate: {
                            date: "2023-11-03 00:00:00.000000",
                            timezone_type: 3,
                            timezone: "Asia/Ulaanbaatar"
                        },
                        previousId: null,
                        previousName: null,
                        isCurrent: false
                    },
                    {
                        id: "520",
                        code: "02",
                        name: "2-р улирал",
                        startDate: {
                            date: "2023-11-09 00:00:00.000000",
                            timezone_type: 3,
                            timezone: "Asia/Ulaanbaatar"
                        },
                        endDate: {
                            date: "2024-01-28 00:00:00.000000",
                            timezone_type: 3,
                            timezone: "Asia/Ulaanbaatar"
                        },
                        previousId: null,
                        previousName: null,
                        isCurrent: false
                    },
                    {
                        id: "1138",
                        code: "03",
                        name: "3-р улирал",
                        startDate: {
                            date: "2024-01-29 00:00:00.000000",
                            timezone_type: 3,
                            timezone: "Asia/Ulaanbaatar"
                        },
                        endDate: {
                            date: "2024-04-07 00:00:00.000000",
                            timezone_type: 3,
                            timezone: "Asia/Ulaanbaatar"
                        },
                        previousId: null,
                        previousName: null,
                        isCurrent: false
                    },
                    {
                        id: "1176",
                        code: "04",
                        name: "4-р улирал",
                        startDate: {
                            date: "2024-04-08 00:00:00.000000",
                            timezone_type: 3,
                            timezone: "Asia/Ulaanbaatar"
                        },
                        endDate: {
                            date: "2024-07-14 00:00:00.000000",
                            timezone_type: 3,
                            timezone: "Asia/Ulaanbaatar"
                        },
                        previousId: null,
                        previousName: null,
                        isCurrent: true
                    }
                ],
                totalCount: 2,
                list: [
                    {
                        id: "12",
                        description: "",
                        createdDate: "2024-04-26",
                        typeId: "21",
                        typeName: "Хичээлд суухгүйгээр гадаа зогсох",
                        typeDescription: "Хичээл дээр үймүүлж, ангийнхандаа төвөг учруулсан.",
                        avatar: "https://lxp-cdn.eschool.mn/u/6634561882dd2.png",
                        code: "TST23080024",
                        firstName: "Аригун",
                        lastName: "Ганбаатар",
                        className: "9A",
                        username: "99155573",
                        createdUser: "dev"
                    },
                    {
                        id: "11",
                        description: "",
                        createdDate: "2024-04-25",
                        typeId: "2",
                        typeName: "Шийтгэл 1",
                        typeDescription: "Сахилгын өрөөнд 2 цаг сууна",
                        avatar: "https://lxp-cdn.eschool.mn/u/6634561882dd2.png",
                        code: "TST23080024",
                        firstName: "Аригун",
                        lastName: "Ганбаатар",
                        className: "9A",
                        username: "89896189",
                        createdUser: "Ариунжаргал"
                    }
                ],
                types: [
                    {
                        id: "3",
                        schoolId: 195,
                        isActive: true,
                        title: "10 минут гараа өргөж зогсох",
                        description: "Найзыгаа дээрэлхсэн"
                    },
                    {
                        id: "2",
                        schoolId: 195,
                        isActive: true,
                        title: "Шийтгэл 1",
                        description: "Сахилгын өрөөнд 2 цаг сууна"
                    }
                ],
                message: "Амжилттай"
            },
            success: true
        }

        setSelectedTreeData({ isCurrent: true, id: res?.data?.selectedSeason })
        secureLocalStorage?.setItem(treeIndex, { isCurrent: true, id: res?.data?.selectedSeason });

        setClasses(res?.data?.classes)
        setTypes(res?.data?.types)
        setTreeData((res?.data?.seasons || [])?.map(obj => {
            return {
                key: obj?.id,
                title: obj?.name
            }
        }))
        setDetentions(res?.data?.list)
        setTotalCount(res?.data?.totalCount)
    }

    const onUserInteraction = (state) => {
        let page = state?.page;
        let pageSize = state?.pageSize;
        let sort = state?.sort;
        let order = state?.order;

        if (state?.search) {
            page = 1;
            pageSize = 10;
        }
        setTableState({
            page: page,
            pageSize: pageSize,
            search: state?.search,
            order: order,
            sort: sort
        })
        loadIndex(selectedTreeData?.id, page, pageSize, state?.search, sort, order)
    }

    const handleTreeChange = node => {
        setSelectedTreeData({ isCurrent: node?.isCurrent, id: node?.key })
        secureLocalStorage?.setItem(treeIndex, { isCurrent: node?.isCurrent, id: node?.key });

        loadIndex(node?.key)
    }

    const onSubmit = (classRows = [], selectedType = {}, description = null) => {
        console.log('onSubmit')
        // let studentIds = [];
        // for (let c = 0; c < classRows.length; c++) {
        //     studentIds = studentIds.concat(classRows[c].selectedStudents)
        // }
        // const params = {
        //     students: studentIds,
        //     type: selectedType?.id,
        //     description
        // }
        // setLoading(true)
        // fetchRequest(managerDetentionStudentSubmit, 'POST', params)
        //     .then((res) => {
        //         if (res?.success) {
        //             setShowModal(false)

        //             setSelectedTreeData({ isCurrent: true, id: res?.data?.season })
        //             secureLocalStorage?.setItem(treeIndex, { isCurrent: true, id: res?.data?.season });

        //             setDetentions(res?.data?.list)
        //             setTotalCount(res?.data?.totalCount)

        //             message(res?.data?.message, true);
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

    const onEditSubmit = (params = {}) => {
        console.log('onEditSubmit')
        // setLoading(true)
        // fetchRequest(managerDetentionEdit, 'POST', params)
        //     .then((res) => {
        //         if (res?.success) {

        //             const clone = [...detentions]
        //             for (let c = 0; c < clone?.length; c++) {
        //                 if (clone[c].id === res?.data?.id) {
        //                     clone[c].typeId = res?.data?.typeId;
        //                     clone[c].typeName = res?.data?.typeName;
        //                     clone[c].typeDescription = res?.data?.typeDescription;
        //                     clone[c].description = res?.data?.description;
        //                     break;
        //                 }
        //             }

        //             setDetentions(clone)
        //             onClose();
        //             message(res?.data?.message, true);
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

    const onDeleteSubmit = () => {
        console.log('onDeleteSubmit')
        // if (detailId) {
        //     const params = {
        //         id: detailId
        //     }
        //     setLoading(true)
        //     fetchRequest(managerDetentionDelete, 'POST', params)
        //         .then((res) => {
        //             if (res?.success) {

        //                 setDetentions(res?.data?.list)
        //                 setTotalCount(res?.data?.totalCount)

        //                 onDeleteClose()

        //                 message(res?.data?.message, true);
        //             } else {
        //                 message(res?.data?.message || translations(locale)?.err?.error_occurred)
        //             }
        //             setLoading(false)
        //         })
        //         .catch(() => {
        //             message(translations(locale)?.err?.error_occurred)
        //             setLoading(false)
        //         })
        // }
    }

    const handleContextMenuClick = (row, key) => {
        if (key === 'edit') {
            setDetailId(row?.id)
            setShowEditModal(true)
        } else if (key === 'delete') {
            setDetailId(row?.id)
            setShowDeleteModal(true)
        }
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
                <Row>
                    <Col xl="2" xxl="2">
                        <div className="m-portlet br-12">
                            <div className="m-portlet__body">
                                <TreeView
                                    defaultExpandAll
                                    treeData={treeData}
                                    selectedNodes={[selectedTreeData?.id]}
                                    onSelect={(params, info) => handleTreeChange(info?.node)}
                                />
                            </div>
                        </div>
                    </Col>
                    <Col xl="10" xxl="10">
                        <div className={'d-flex'}>
                            <button
                                type="button"
                                onClick={() => {
                                    setShowModal(true)
                                }}
                                className="btn btn-sm m-btn--pill btn-info m-btn--uppercase d-inline-flex mb-3"
                            >
                                <AddCircleOutlineRoundedIcon/>
                                <span className='ml-2'>{translations(locale)?.action?.register}</span>
                            </button>
                        </div>

                        <div className="m-portlet br-12">
                            <div className="m-portlet__body">
                                <DTable
                                    remote
                                    locale={locale}
                                    columns={columns}
                                    data={detentions}
                                    totalDataSize={totalCount}
                                    onInteraction={onUserInteraction}
                                    clickContextMenu
                                    config={config}
                                    // selectMode={'radio'}
                                    contextMenus={contextMenus}
                                    onContextMenuItemClick={(id, key, row) => handleContextMenuClick(row, key)}
                                />
                            </div>
                        </div>
                    </Col>
                </Row>
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
                showModal &&
                <CreateModal
                    classes={classes}
                    types={types}
                    onClose={onClose}
                    onSubmit={onSubmit}
                />
            }
            {
                showDetailModal &&
                <ViewModal
                    detentionId={detailId}
                    onClose={onClose}
                />
            }
            {
                showDeleteModal &&
                <DeleteModal
                    onClose={onDeleteClose}
                    onSubmit={onDeleteSubmit}
                />
            }
            {
                showEditModal &&
                <EditModal
                    detention={detentions.find(obj => obj?.id === detailId)}
                    types={types}
                    onClose={onClose}
                    onSubmit={onEditSubmit}
                />
            }
        </div>
    )
}

export default index