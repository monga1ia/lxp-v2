import { React, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Row, Col, Card, Button, } from 'react-bootstrap';
import { useTranslation } from "react-i18next";
import localStorage from 'redux-persist/es/storage';
import FilterIcon from 'cs-line-icons/custom/FilterIcon';
import ReactDOM from "react-dom";
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { deepOrange } from '@mui/material/colors';
import CancelOutlined from "@mui/icons-material/CancelOutlined";
import CheckOutlined from "@mui/icons-material/CheckCircleOutlined";
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import EditIcon from "cs-line-icons/custom/EditIcon";
import TrashIcon from "cs-line-icons/custom/Trash";
import CsLineIcons from "cs-line-icons/CsLineIcons";
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { ClickAwayListener } from "@mui/material";
import BreadcrumbList from 'components/breadcrumb-list/BreadcrumbList';
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import Select from 'modules/Form/Select'
import UnitAdd from "./modals/UnitAdd";
import UnitAddMedle from "./modals/UnitAddMedle";
import TopicChildAdd from "./modals/TopicChildAdd";
import InactiveModal from "./modals/inactive";
import ActiveModal from "./modals/active";
import DeleteModal from "./modals/delete";
import ParentTopicEditModal from "./modals/edit";
import ChildTopicEditModal from "./modals/childEdit";


import { fetchRequest } from '../../utils/fetchRequest';
import message from '../../modules/message'

import {
    curriculumPlan, curriculumTopicSubmit, curriculumTopicEdit, curriculumTopicDelete,
    curriculumTopicOrdering, curriculumTopicToggleStatus, curriculumParentTopicSubmit
} from '../../utils/fetchRequest/Urls';


const plan = () => {
    const { t } = useTranslation();

    const stateKey = "curriculum_plan_"
    const title = t("curriculum.subject.plan")
    const { selectedSchool } = useSelector(state => state?.schoolData);

    const breadcrumbs = [
        { to: "", text: "Home" },
        { to: "curriculum/dashboard/plan", text: title }
    ];

    const [loading, setLoading] = useState(false);
    const [gradeList, setGradeList] = useState([])
    const [subjectList, setSubjectList] = useState([])
    const [teacherList, setTeacherList] = useState([])
    const [selectedGrade, setSelectedGrade] = useState(null)
    const [selectedSubject, setSelectedSubject] = useState(null)
    const [newSelectedGrade, setNewSelectedGrade] = useState(null)
    const [newSelectedSubject, setNewSelectedSubject] = useState(null)
    const [selectedTeacher, setSelectedTeacher] = useState(null)
    const [mdSubjectId, setMdSubjectId] = useState(null)
    const [onlyActive, setOnlyActive] = useState(true)

    const [parentTopics, setParentTopics] = useState([])
    const [selectedParentTopic, setSelectedParentTopic] = useState(null)
    const [childTopics, setChildTopics] = useState([])

    const [showNewTopic, setShowNewTopic] = useState(false)
    const [showEditTopic, setShowEditTopic] = useState(false)
    const [showEditChildTopic, setShowEditChildTopic] = useState(false)
    const [showNewUnitMedle, setShowNewUnitMedle] = useState(false)
    const [showNewChildTopic, setShowNewChildTopic] = useState(false)
    const [showNewRepeatMedle, setShowNewRepeatMedle] = useState(false)
    const [contextMenuData, setContextMenuData] = useState(null)
    const [showInactiveModal, setShowInactiveModal] = useState(false)
    const [showActiveModal, setShowActiveModal] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [isParentTopic, setIsParentTopic] = useState(false)

    const init = (params) => {
        if (params?.grade && params?.subject) {
            params.topicResult = 1
        }
        setLoading(true)
        fetchRequest(curriculumPlan, 'POST', params)
            .then((res) => {
                if (res.success) {
                    const { grades = [], subjects = [], teachers = [] } = res

                    setGradeList(grades)
                    setSubjectList(subjects.map(subjectObj => {
                        return {
                            value: subjectObj?.id,
                            text: subjectObj?.name + ' (' + subjectObj?.code + ')',
                            mdSubjectId: subjectObj?.mdSubjectId
                        }
                    }))
                    setTeacherList(teachers.map(teacherObj => {
                        return {
                            value: teacherObj?.id,
                            text: teacherObj?.firstName + ' ' + teacherObj?.lastName + ' (' + teacherObj?.code + ')'
                        }
                    }))

                    if (params?.topicResult) {
                        if (params?.parentTopic) {
                            setChildTopics(res?.childTopics)
                        } else {
                            setParentTopics(res?.parentTopics)
                        }
                    }
                } else {
                    message(res.message)
                }
                setLoading(false)
            })
            .catch(() => {
                message(t('errorMessage.title'));
                setLoading(false)
            })
    }

    const getFilteredState = async () => {
        try {
            const storeData = await localStorage.getItem(stateKey + selectedSchool?.id)
            let params = {
                school: selectedSchool?.id
            }
            if (storeData) {
                params = {
                    school: selectedSchool?.id,
                    ...JSON.parse(storeData)
                }

                if (params.grade) setSelectedGrade(params.grade)
                if (params.subject) setSelectedSubject(params.subject)
                if (params.teacher) setSelectedTeacher(params.teacher)
                if (params.active) setOnlyActive(params.active + '' == '1')
            }
            init(params)
        } catch (error) {
        }
    }
    useEffect(() => {
        if(subjectList && subjectList.length > 0){
            for(let i = 0; i < subjectList.length; i++){
                if(subjectList[i].value == selectedSubject){
                    setMdSubjectId(subjectList[i]?.mdSubjectId || null)
                }
            }
        }
    }, [selectedSubject, subjectList])

    useEffect(() => {
        getFilteredState()
        init({
            school: selectedSchool?.id
        })
    }, [])

    const onGradeChange = (value) => {
        setSelectedGrade(value)

        setParentTopics([])
        setChildTopics([])

        const data = {
            grade: value,
            active: onlyActive ? 1 : 0
        }
        localStorage.setItem(stateKey + selectedSchool?.id, JSON.stringify(data))
        init({
            school: selectedSchool?.id,
            grade: value
        })

        if (!value) {
            setSubjectList([])
            setTeacherList([])
            setSelectedSubject(null)
            setSelectedTeacher(null)
        }
    }
    const onSubjectChange = (value) => {
        setSelectedSubject(value)

        setChildTopics([])

        let subjectObj = subjectList.find(subjectData => subjectData.value == value)

        if(subjectObj){
            setMdSubjectId(subjectObj.mdSubjectId)
        }

        const data = {
            grade: selectedGrade,
            subject: value,
            active: onlyActive ? 1 : 0
        }
        localStorage.setItem(stateKey + selectedSchool?.id, JSON.stringify(data))

        if (!value) {
            setTeacherList([])
            setSelectedTeacher(null)
        }

        init({
            school: selectedSchool?.id,
            grade: selectedGrade,
            subject: value
        })
    }
    const onTeacherChange = (value) => {
        setSelectedTeacher(value)

        const data = {
            grade: selectedGrade,
            subject: selectedSubject,
            teacher: value,
            active: onlyActive ? 1 : 0
        }
        localStorage.setItem(stateKey + selectedSchool?.id, JSON.stringify(data))
    }
    const searchHandler = () => {
        if (!selectedGrade) {
            message(t('errorMessage.selectGrade'))
            return
        }
        if (!selectedSubject) {
            message(t('errorMessage.selectSubject'))
            return
        }

        setParentTopics([])
        setChildTopics([])

        init({
            school: selectedSchool?.id,
            grade: selectedGrade,
            subject: selectedSubject,
            teacher: selectedTeacher,
            active: onlyActive ? 1 : 0,
            topicResult: 1
        })
    }

    const individualContextMenus = true

    const unMountContextMenus = () => {
        const wrapper = getWrapper();
        if (wrapper) {
            ReactDOM.unmountComponentAtNode(wrapper);
        }
    };

    const contextMenus = [
        {
            key: "inactive",
            icon: <CancelOutlined />,
            title: "Идэвхгүй болгох",
        },
        {
            key: "setactive",
            icon: <CheckOutlined viewBox="2 2 24 24" style={{width: '22px', height: '22px'}}/>,
            title: "Идэвхтэй болгох",
        },
        {
            key: "edit",
            icon: <EditIcon />,
            title: t('action.edit'),
        },
        {
            key: "delete",
            icon: <TrashIcon />,
            title: t('action.delete'),
        },
    ];

    const onContextMenuItemClick = (key, row, e, isParent) => {
        if (row) {
            if (key === 'inactive') {
                setContextMenuData(row)
                setShowInactiveModal(true)
            } else if (key === 'setactive') {
                setContextMenuData(row)
                setShowActiveModal(true)
            } else if (key === 'edit') {
                setContextMenuData(row)
                if (row?.parentTopicId) {
                    setShowEditChildTopic(true)
                } else {
                    setShowEditTopic(true)
                }

            } else if (key === 'delete') {
                setContextMenuData(row)
                setIsParentTopic(isParent)
                setShowDeleteModal(true)
            }
        }
    }

    const getWrapper = () => {
        const id = "datatable-contextmenu-wrapper";
        const cmWrapper = document.getElementById(id);
        if (cmWrapper) {
            return cmWrapper;
        } else {
            const cmWrapper = document.createElement("div");
            cmWrapper.id = id;
            document.body.appendChild(cmWrapper);
            return cmWrapper;
        }
    };

    const onContextMenu = (e, row, isParent) => {
        e.preventDefault();

        unMountContextMenus();

        let availableContextMenus = [];

        if (individualContextMenus) {
            if (contextMenus.length && row.contextMenuKeys?.length) {
                for (const menu of contextMenus) {
                    if (row.contextMenuKeys.includes(menu.key)) {
                        // medle-s tatsan topic context menu nuuh ni comment hiiv
                        // if(!row.schoolId){
                        //     if(menu.key == 'inactive' || menu.key == 'delete'){
                        //         availableContextMenus.push(menu);
                        //     }
                        // } else {
                            availableContextMenus.push(menu);
                        // }
                    }
                }
            }
        } else {
            availableContextMenus = contextMenus;
        }

        if (availableContextMenus.length) {
            const wrapper = getWrapper();
            const menu = (
                <ClickAwayListener onClickAway={unMountContextMenus}>
                    <div className="dt-cm-wrapper" style={{
                        top: e.pageY,
                        left: e.pageX - 125,
                        position: 'absolute',
                        zIndex: 1000,
                        maxWidth: 300,
                        paddingTop: 7,
                        paddingBottom: 7,
                        backgroundColor: 'white',
                        borderRadius: 10,
                        boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
                    }}>
                        {availableContextMenus.map((menu) => {
                            return (
                                <div
                                    className="dt-cm-item custom-cm-item"
                                    onClick={(event) => {
                                        event.stopPropagation();
                                        unMountContextMenus();
                                        onContextMenuItemClick?.(menu.key, row, event, isParent);
                                    }}
                                    style={{
                                        cursor: 'pointer',
                                        padding: '7px 15px'
                                    }}
                                    key={menu.key}
                                >
                                    <div className="mr-2" 
                                        style={{ 
                                            display: 'inline-block', 
                                            color: '#FF5B1D',
                                            width: '25px',
                                            alignItems: 'center',
                                            position: 'relative',
                                            right: menu.key == 'inactive' ? 2 : (menu.key == 'delete' ? 1 : 0),
                                        }}
                                    >{menu.icon ? menu.icon : null}</div>
                                    <span className="black-color">{menu.title}</span>
                                </div>
                            );
                        })}
                    </div>
                </ClickAwayListener >
            );
            ReactDOM.render(menu, wrapper);
        }
    }

    const checkboxHandler = (value) => {
        setOnlyActive(value)
    }

    const clearFilter = () => {
        setSelectedGrade(null)
        setSelectedSubject(null)
        setSelectedTeacher(null)
        setOnlyActive(true)

        setParentTopics([])
        setChildTopics([])
    }

    const changeOrdering = (topicId = null, otherTopicId = null) => {
        const params = {
            school: selectedSchool?.id,
            topic: topicId,
            otherTopic: otherTopicId,
            grade: selectedGrade,
            subject: selectedSubject,
            teacher: selectedTeacher,
            active: onlyActive ? 1 : 0
        }
        setLoading(true)
        fetchRequest(curriculumTopicOrdering, 'POST', params)
            .then((res) => {
                if (res.success) {
                    setParentTopics(res?.parentTopics || [])
                    if (selectedParentTopic) {
                        init({
                            school: selectedSchool?.id,
                            grade: selectedGrade,
                            subject: selectedSubject,
                            teacher: selectedTeacher,
                            active: onlyActive ? 1 : 0,
                            topicResult: 1,
                            parentTopic: selectedParentTopic?.id
                        })
                    }
                } else {
                    message(res.message)
                }
                setLoading(false)
            })
            .catch(() => {
                message(t('errorMessage.title'));
                setLoading(false)
            })
    }

    const topicRow = (topics = [], isParent = false) => {
        const topicRows = []

        for (let t = 0; t < topics.length; t++) {
            const topicObj = topics[t]
            topicRows.push(
                <Row key={'topic_' + topicObj?.id} style={{ backgroundColor: 'transparent' }} className="m-0">
                    <Card className="mb-3" style={isParent && topicObj?.id === selectedParentTopic?.id ? {
                        border: '1px solid #FF5B1D',
                        backgroundColor: '#FAE9E3'
                    } : {}}>
                        <Card.Body 
                            style={{ paddingTop: '1rem', paddingBottom: '1rem', cursor: 'pointer' }}
                            onContextMenu={e=>{
                                e.stopPropagation()
                                onContextMenu(e, topicObj, isParent)
                            }}
                            onClick={(e) => {
                                if (isParent) {
                                    setSelectedParentTopic(topicObj)

                                    init({
                                        school: selectedSchool?.id,
                                        grade: selectedGrade,
                                        subject: selectedSubject,
                                        teacher: selectedTeacher,
                                        active: onlyActive ? 1 : 0,
                                        topicResult: 1,
                                        parentTopic: topicObj?.id
                                    })
                                }
                            }}
                        >
                            <div>
                                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <div style={{ maxWidth: '70%' }}>
                                        <p>
                                            {topicObj.name}
                                        </p>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                        <Button
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                onContextMenu(e, topicObj, isParent)
                                            }}
                                            variant="outline-primary"
                                            className="btn-icon btn-icon-only position-relative"
                                            size="sm"
                                        >
                                            <CsLineIcons icon="more-vertical" />
                                        </Button>
                                    </div>
                                </div>
                                {
                                    !isParent && <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
                                        <div style={{
                                            display: 'block',
                                            textOverflow: 'ellipsis',
                                            wordWrap: 'break-word',
                                            overflow: 'hidden',
                                            maxHeight: '3em',
                                            lineHeight: '1.5em'
                                        }}>{topicObj.purpose}</div>
                                    </div>
                                }
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <div style={{ marginRight: '0.5rem' }}>
                                            {
                                                topicObj?.isActive
                                                    ?
                                                    <Button
                                                        variant="primary"
                                                        className="add-button text-uppercase"
                                                        style={{ backgroundColor: '#65ccb5' }}
                                                    >
                                                        Идэвхтэй
                                                    </Button>
                                                    :
                                                    <Button
                                                        variant="primary"
                                                        className="add-button text-uppercase"
                                                    >
                                                        Идэвхгүй
                                                    </Button>
                                            }
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', color: '#979797' }}>
                                            {topicObj?.isPrivate && <PersonOutlineOutlinedIcon sx={{ color: deepOrange[500] }} style={{ marginRight: 3 }} />} {topicObj?.createdUser + ' | ' + topicObj?.createdDate?.date.substring(0, 19)}
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', position: 'relative', left: 1 }}>
                                        {
                                            t > 0 &&
                                            <Button
                                                variant="outline-dark"
                                                className="btn-icon btn-icon-only"
                                                // size="sm"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    changeOrdering(topicObj?.id, topics[t - 1]?.id)
                                                }}
                                            >
                                                <ArrowUpwardIcon />
                                            </Button>
                                        }
                                        {
                                            t < (topics.length - 1) && <Button
                                                variant="outline-dark"
                                                style={{ marginLeft: '0.5rem' }}
                                                className="btn-icon btn-icon-only"
                                                // size="sm"
                                                onClick={(e) => {
                                                    e.stopPropagation()

                                                    changeOrdering(topicObj?.id, topics[t + 1]?.id)
                                                }}
                                            >
                                                <ArrowDownwardIcon />
                                            </Button>
                                        }
                                    </div>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Row >
            )
        }
        return topicRows
    }


    const newUnitHandler = () => {
        setShowNewTopic(true)
    }

    const newUnitMedleHandler = () => {
        setShowNewUnitMedle(true)
    }

    const newChildTopicHandler = () => {
        setShowNewChildTopic(true)
    }

    const newRepeatMedleHandler = () => {
        setShowNewRepeatMedle(true)
    }

    const submitTopic = (params) => {
        let paramObj = {
            ...params, ...{
                teacher: selectedTeacher,
                active: onlyActive ? 1 : 0
            }
        }
        setLoading(true)
        fetchRequest(curriculumTopicSubmit, 'POST', paramObj)
            .then((res) => {
                if (res.success) {
                    message(t('common.success'), true)

                    setParentTopics(res?.parentTopics || [])
                    if (selectedParentTopic && !params.isNewTopic) {
                        init({
                            school: selectedSchool?.id,
                            grade: selectedGrade,
                            subject: selectedSubject,
                            teacher: selectedTeacher,
                            active: onlyActive ? 1 : 0,
                            topicResult: 1,
                            parentTopic: selectedParentTopic?.id
                        })
                    } else {
                        if(res?.parentTopics && res?.parentTopics.length > 0){
                            setSelectedParentTopic(res?.parentTopics[res?.parentTopics.length - 1])
                        }
                    }
                    
                    setNewSelectedGrade(params.grade)
                    setNewSelectedSubject(params.subject)

                    if (!params?.addAgain) {
                        setShowNewTopic(false)
                        setShowNewChildTopic(false)
                    }
                } else {
                    message(res.message)
                }

                setLoading(false)
            })
            .catch(() => {
                message(t('errorMessage.title'));
                setLoading(false)
            })
    }

    const submitEditTopic = (params) => {
        let paramObj = {
            ...params, ...{
                teacher: selectedTeacher,
                active: onlyActive ? 1 : 0
            }
        }
        setLoading(true)
        fetchRequest(curriculumTopicEdit, 'POST', paramObj)
            .then((res) => {
                if (res.success) {
                    message(t('common.success'), true)
                    setShowEditTopic(false)
                    setShowEditChildTopic(false)
                    // showNewChildTopic(false)

                    setParentTopics(res?.parentTopics || [])
                    if (selectedParentTopic) {
                        init({
                            school: selectedSchool?.id,
                            grade: selectedGrade,
                            subject: selectedSubject,
                            teacher: selectedTeacher,
                            active: onlyActive ? 1 : 0,
                            topicResult: 1,
                            parentTopic: selectedParentTopic?.id
                        })
                    }

                    if (params?.addAgain) {
                        if (params?.parentTopic) {
                            setShowEditChildTopic(true)
                        } else {
                            setShowEditTopic(true)
                        }
                    }
                } else {
                    message(res.message)
                }

                setLoading(false)
            })
            .catch(() => {
                message(t('errorMessage.title'));
                setLoading(false)
            })
    }

    const setToggleActive = () => {
        if (contextMenuData) {
            const params = {
                school: selectedSchool?.id,
                topic: contextMenuData?.id,
                subject: selectedSubject,
                grade: selectedGrade,
                teacher: selectedTeacher,
                active: onlyActive ? 1 : 0,
            }
            setLoading(true)
            fetchRequest(curriculumTopicToggleStatus, 'POST', params)
                .then((res) => {
                    if (res.success) {
                        const pTopics = res?.parentTopics || [];

                        setParentTopics(pTopics)

                        if (pTopics.length > 0) {
                            if (selectedParentTopic) {
                                let parentFound = false;
                                for (let t = 0; t < pTopics.length; t++) {
                                    if (pTopics[t]?.id === selectedParentTopic?.id) {
                                        parentFound = true;
                                        break;
                                    }
                                }
                                if (parentFound) {
                                    init({
                                        school: selectedSchool?.id,
                                        grade: selectedGrade,
                                        subject: selectedSubject,
                                        teacher: selectedTeacher,
                                        active: onlyActive ? 1 : 0,
                                        topicResult: 1,
                                        parentTopic: selectedParentTopic?.id
                                    })
                                } else {
                                    setSelectedParentTopic(null)
                                }
                            }
                        } else {
                            setSelectedParentTopic(null)
                        }

                        setShowInactiveModal(false)
                        setShowActiveModal(false)

                    } else {
                        message(res.message)
                    }

                    setLoading(false)
                })
                .catch(() => {
                    message(t('errorMessage.title'));
                    setLoading(false)
                })
        }
    }

    const deleteTopic = () => {
        if (contextMenuData) {
            const params = {
                school: selectedSchool?.id,
                topic: contextMenuData?.id,
                subject: selectedSubject,
                grade: selectedGrade,
                teacher: selectedTeacher,
                active: onlyActive ? 1 : 0,
                parent: isParentTopic ? 1 : 0
            }

            setLoading(true)
            fetchRequest(curriculumTopicDelete, 'POST', params)
                .then((res) => {
                    if (res.success) {
                        message(t('common.success'), true)

                        setParentTopics(res?.parentTopics || [])
                        if (selectedParentTopic) {
                            init({
                                school: selectedSchool?.id,
                                grade: selectedGrade,
                                subject: selectedSubject,
                                teacher: selectedTeacher,
                                active: onlyActive ? 1 : 0,
                                topicResult: 1,
                                parentTopic: selectedParentTopic?.id
                            })
                        }
                        setShowDeleteModal(false)
                    } else {
                        message(res.message)
                    }

                    setLoading(false)
                })
                .catch(() => {
                    message(t('errorMessage.title'));
                    setLoading(false)
                })
        }
    }

    const onMedleSubmit = (grade = null, subject = null, topicIds = [], parenTopic = null) => {
        if (topicIds?.length > 0) {
            const params = {
                school: selectedSchool?.id,
                subject,
                parentTopic: parenTopic?.id,
                topics: topicIds,
            }

            setLoading(true)
            fetchRequest(curriculumParentTopicSubmit, 'POST', params)
                .then((res) => {
                    if (res.success) {
                        let params = {
                            school: selectedSchool?.id,
                            grade: selectedGrade,
                            subject: selectedSubject,
                            parentTopic: parenTopic?.id
                        }
                        init(params)
                        setShowNewUnitMedle(false)
                        setShowNewRepeatMedle(false)
                    } else {
                        message(res.message)
                    }
                    setLoading(false)
                })
                .catch(() => {
                    message(t('errorMessage.title'));
                    setLoading(false)
                })

        } else {
            message(t('curriculum.empty'));
        }
    }

    return (
        <>
            <div>
                <div className="page-title-container">
                    <Row>
                        <Col md="7">
                            <h1 className="mb-0 pb-0 display-4 relative">{title}</h1>
                            <BreadcrumbList items={breadcrumbs} />
                        </Col>
                    </Row>
                </div>
                <Col style={{ backgroundColor: 'transparent' }}>
                    <h2 className="small-title">{t('exam.filter')}</h2>
                    <Card className="mb-5">
                        <Card.Body>
                            <Row className="bs-gutter-x-0">
                                <div className="plan-filter">
                                    <p className="modal-select-title mb-2">{t('exam.level')}*</p>
                                    <Select
                                        options={gradeList}
                                        disableClearable
                                        searchable
                                        value={selectedGrade}
                                        onChange={(value) => onGradeChange(value)}
                                    />
                                    <div style={{ display: 'flex', alignItems: 'center', marginTop: '0.5rem', textWrap: 'nowrap' }}>
                                        <FormControlLabel
                                            control={<Checkbox
                                                sx={{ '&.Mui-checked': { color: '#ff5b1d' }, '&:not(.Mui-checked)': { color: "#dddddd" } }}
                                                checked={onlyActive}
                                                onChange={(e, value) => checkboxHandler(value)} />}
                                            label="Зөвхөн идэвхтэйг харуулах"
                                        />
                                    </div>
                                </div>
                                <div className="plan-filter">
                                    <p className="modal-select-title mb-2">Судлагдахуун*</p>
                                    <Select
                                        options={subjectList}
                                        disableClearable
                                        searchable
                                        value={selectedSubject}
                                        onChange={(value) => onSubjectChange(value)}
                                    />
                                </div>
                                <div className="plan-filter">
                                    <p className="modal-select-title mb-2">Багш</p>
                                    <Select
                                        options={teacherList}
                                        disableClearable
                                        searchable
                                        value={selectedTeacher}
                                        onChange={(value) => onTeacherChange(value)}
                                    />
                                </div>
                                <div className="plan-filter">
                                    <div>
                                        <button type='button' className='btn filter-button' onClick={searchHandler} style={{ paddingLeft: 20, paddingRight: 30, marginTop: '1.6rem', width: 145, height: 38}}>
                                            <div className="d-flex flex-raw">
                                                <div style={{ position: 'relative', right: 12 }}>
                                                    <FilterIcon />
                                                </div>
                                                <div style={{ position: 'relative', margin: 'auto', right: 7}}>
                                                    {t('common.search').toUpperCase()}
                                                </div>
                                            </div>
                                        </button>
                                    </div>
                                    <div>
                                        <button
                                            type='button'
                                            onClick={clearFilter}
                                            className="btn btn-link back-button cursor-pointer mt-3 ml-2">
                                                {t('common.clear').toUpperCase()}  
                                        </button>
                                    </div>
                                </div>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
                <Row className='mt-3 mr-0 ml-0'>
                    <Col className='pl-0'>
                        <Row style={{ backgroundColor: 'transparent' }}>
                            <Col style={{
                                display: 'inline-flex'
                            }}>
                                <Button
                                    variant="primary"
                                    className="mb-2 add-button text-uppercase"
                                    onClick={() => newUnitHandler()}
                                >
                                    <ControlPointIcon style={{ color: "white", marginRight: "4px" }} />
                                    Шинэ нэгж бүртгэх
                                </Button>
                                {
                                    selectedGrade && selectedSubject && mdSubjectId && <Button
                                        variant="primary"
                                        className="mb-2 ml-2 add-button text-uppercase"
                                        style={{ backgroundColor: '#36A3F7' }}
                                        onClick={() => newUnitMedleHandler()}
                                    >
                                        <ControlPointIcon style={{ color: "white", marginRight: "4px" }} />
                                        MEDLE-с татах
                                    </Button>
                                }
                            </Col>
                        </Row>
                        <Row style={{ backgroundColor: 'transparent' }} className='mt-4'>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <h2 className="small-title">Нэгж хичээл</h2>
                                <h2 className="small-title">Нийт: {parentTopics?.length}</h2>
                            </div>
                            {topicRow(parentTopics, true)}
                        </Row>
                    </Col>
                    <Col className='ml-2 pr-0'>
                        {
                            selectedParentTopic && <>
                                <Row style={{ backgroundColor: 'transparent' }}>
                                    <Col style={{
                                        display: 'inline-flex'
                                    }}>
                                        <Button
                                            variant="primary"
                                            className="mb-2 mr-2 add-button text-uppercase"
                                            onClick={() => newChildTopicHandler()}
                                        >
                                            <ControlPointIcon style={{ color: "white", marginRight: "4px" }} />
                                            Шинэ ээлжит бүртгэх
                                        </Button>
                                        {
                                            selectedGrade && selectedSubject && mdSubjectId &&
                                            <Button
                                                variant="primary"
                                                className="mb-2 add-button text-uppercase"
                                                style={{ backgroundColor: '#36a3f7' }}
                                                onClick={() => newRepeatMedleHandler()}
                                            >
                                                <ControlPointIcon style={{ color: "white", marginRight: "4px" }} />
                                                MEDLE-с татах
                                            </Button>
                                        }
                                    </Col>
                                </Row>
                                <Row style={{ backgroundColor: 'transparent' }} className='mt-4'>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <h2 className="small-title">Ээлжит хичээл</h2>
                                        <h2 className="small-title">Нийт: {childTopics?.length}</h2>
                                    </div>
                                    {topicRow(childTopics)}
                                </Row>
                            </>
                        }

                    </Col>
                </Row>
                {
                    showNewTopic &&
                    <UnitAdd
                        show={showNewTopic}
                        onClose={() => setShowNewTopic(false)}
                        grades={gradeList}
                        gradeId={selectedGrade}
                        subjectId={selectedSubject}
                        onSave={submitTopic}
                    />
                }
                {
                    showEditTopic &&
                    <ParentTopicEditModal
                        show={showEditTopic}
                        topicObj={contextMenuData}
                        onClose={() => {
                            setContextMenuData(null)
                            setShowEditTopic(false)
                        }}
                        gradeId={selectedGrade}
                        grades={gradeList}
                        onSave={submitEditTopic}
                    />
                }
                {
                    showEditChildTopic &&
                    <ChildTopicEditModal
                        show={showEditChildTopic}
                        topicObj={contextMenuData}
                        onClose={() => {
                            setContextMenuData(null)
                            setShowEditChildTopic(false)
                        }}
                        gradeId={selectedGrade}
                        grades={gradeList}
                        parentTopics={parentTopics}
                        onSave={submitEditTopic}
                    />
                }
                {
                    showNewChildTopic &&
                    <TopicChildAdd
                        show={showNewChildTopic}
                        onClose={() => setShowNewChildTopic(false)}
                        grades={gradeList}
                        parentTopics={parentTopics}
                        parentTopic={selectedParentTopic?.id}
                        grade={selectedGrade || newSelectedGrade}
                        subject={selectedSubject || newSelectedSubject}
                        onSave={submitTopic}
                    />
                }
                {showNewUnitMedle &&
                    <UnitAddMedle
                        grades={gradeList}
                        selectedGrade={selectedGrade}
                        subjects={subjectList}
                        selectedSubject={selectedSubject}
                        selectedTeacher={selectedTeacher}
                        show={showNewUnitMedle}
                        onClose={() => setShowNewUnitMedle(false)}
                        onSave={onMedleSubmit} />}
                {
                    showNewRepeatMedle &&
                    <UnitAddMedle
                        parentTopic={selectedParentTopic}
                        grades={gradeList}
                        selectedGrade={selectedGrade}
                        subjects={subjectList}
                        selectedSubject={selectedSubject}
                        show={showNewRepeatMedle}
                        onClose={() => setShowNewRepeatMedle(false)}
                        onSave={onMedleSubmit}
                    />
                }
                {
                    showInactiveModal &&
                    <InactiveModal
                        show={showInactiveModal}
                        onClose={() => {
                            setContextMenuData(null)
                            setShowInactiveModal(false)
                        }}
                        onSave={() => setToggleActive()}
                    />
                }
                {
                    showActiveModal &&
                    <ActiveModal
                        show={showActiveModal}
                        onClose={() => {
                            setContextMenuData(null)
                            setShowActiveModal(false)
                        }}
                        onSave={() => setToggleActive()}
                    />
                }
                {
                    showDeleteModal &&
                    <DeleteModal
                        show={showDeleteModal}
                        onClose={() => {
                            setContextMenuData(null)
                            setShowDeleteModal(false)
                        }}
                        onSave={() => deleteTopic()}
                    />
                }
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
            </div>
        </>
    );
};

export default plan;
