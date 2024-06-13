import { ArrowDownward, ArrowUpward, CancelOutlined, CheckOutlined, ControlPoint } from '@mui/icons-material';
import TabComponent from 'components/tab/Tab';
import Forms from 'modules/Form/Forms';
import message from 'modules/message';
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Button, Card, Col, Image, Row } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { Link, useHistory, useLocation } from "react-router-dom";
import { fetchRequest } from 'utils/fetchRequest';
import { toDropdownArray, toTreeData, dateObjectFormat, listToCrosswordObj } from 'utils/utils';
import TreeView from "modules/TreeView";
import { BottomScrollListener } from 'react-bottom-scroll-listener';
import AudioPlayer from "react-h5-audio-player";
import ImportIcon from 'cs-line-icons/custom/ImportIcon';
import EditIcon from 'cs-line-icons/custom/EditIcon';
import TrashIcon from 'cs-line-icons/custom/Trash';
import DeleteModal from 'modules/DeleteModal';
import "react-h5-audio-player/lib/styles.css";
import { useSelector } from 'react-redux';
import { getIcon } from 'views/onlineExam/questions/question';
import RadioButton from 'components/buttons/RadioButton';
import SchoolTab from 'views/onlineExam/exam/components/tabComponent';
import DialogCards from 'modules/DialogCards';
import ContextMenu from '../component/ContextMenu';
import ContentSubmit from './modal/ContentSubmit';
import QuestionBankModal from './modal/QuestionBank';
import AddQuestion from './modal/AddQuestion';
import EditQuestion from './modal/EditQuestion';
import UnitAdd from './modal/UnitAdd';
import RegularAdd from './modal/RegularAdd';
import ImportTopicModal from './modal/ImportTopic'
import { examQuestionIndex } from 'utils/fetchRequest/Urls';
import OrderIcon from "cs-line-icons/custom/OrderIcon";
import CrossWordComponent from 'modules/CrossWord';
import Checkbox from 'modules/Form/Checkbox'
import Select from 'modules/Form/Select'
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from "ckeditor5-build-classic-mathtype";
import ReactAudioPlayer from 'react-audio-player';
import "../../../modules/DataTable/datatable.scss";
import { Tooltip } from '@material-ui/core';
import LiveHelpIcon from '@mui/icons-material/LiveHelp';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ViewModal from "./modal/ViewModal";
import { cloneDeep, isEmpty, toInteger } from 'lodash';

const DetailSubmit = () => {
    const { t, i18n } = useTranslation()
    const { id } = useLocation()?.state || {}
    const fileUploaderRef = useRef()
    const history = useHistory()

    const { selectedSchool } = useSelector(state => state.schoolData) || {}

    const [tabIndex, setTabIndex] = useState(1)

    const [item, setItem] = useState(null)
    const [courseExamId, setCourseExamId] = useState(null)

    const [unitSubjectList, setUnitSubjectList] = useState([])
    const [subjectList, setSubjectList] = useState([])
    const [components, setComponents] = useState([])

    const [selectedCourseTopic, setSelectedCourseTopic] = useState(null)
    const [treeNode, setTreeNode] = useState(null)
    const [subjectContent, setSubjectContent] = useState([])

    
    const [isManualOpen, setIsManualOpen] = useState(false)

    const [loading, setLoading] = useState(false)

    const [contentModal, setContentModal] = useState(false)
    const [openFrom, setOpenFrom] = useState(null)
    const [questionBankModal, setQuestionBankModal] = useState(false)
    const [questionAddModal, setQuestionAddModal] = useState(false)
    const [questionEditModal, setQuestionEditModal] = useState(false)
    const [selectedQuestions, setSelectedQuestions] = useState([])
    const [questionId, setQuestionId] = useState([])

    const [unitModal, setUnitModal] = useState(false)
    const [topicModal, setTopicModal] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [tmpTopic, setTmpTopic] = useState(null)
    const [tempId, setTempId] = useState(null)
    const [syllabusId, setSyllabusId] = useState(null)
    const [gradeSubjects, setGradeSubjects] = useState([])
    const [selectedGrade, setSelectedGrade] = useState(null)
    const [selectedSubject, setSelectedSubject] = useState(null)
    const [selectedGradeName, setSelectedGradeName] = useState(null)
    const [selectedSubjectName, setSelectedSubjectName] = useState(null)

    const [grades, setGrades] = useState([])
    const [subjects, setSubjects] = useState([])
    const [parentTopics, setParentTopics] = useState([])
    const [childTopics, setChildTopics] = useState([])
    const [qDifficulties, setQDifficulties] = useState([])
    const [qTypes, setQTypes] = useState([])
    const [linkAnswers, setLinkAnswers] = useState([])
    const [linkValues, setLinkValues] = useState([])
    const [userList, setUserList] = useState([])
    const [list, setList] = useState([])

    const [childTopic, setChildTopic] = useState(null)
    const [childName, setChildName] = useState(null)

    const [usedMdTopics, setUsedMdTopics] = useState([])
    const [isMdGrade, setIsMdGrade] = useState(0)
    const [importTopicParent, setImportTopicParent] = useState(false)
    const [showImportTopicModal, setShowImportTopicModal] = useState(false)
    const [selectedPath, setSelectedPath] = useState(null)
    const [selectedRow, setSelectedRow] = useState(null)
    const [showModal, setShowModal] = useState(false)
    const [onclosed, setOnclosed] = useState(false)

    const fetchInit = (callToGeneralData) => {
        const params = {
            school: selectedSchool?.id,
            id,
        }
        setLoading(true)
        fetchRequest('api/course/detail', 'POST', params)
            .then(res => {
                if (res.success) {
                    setIsManualOpen(res?.isManualOpen || false)
                    setItem(res)
                    console.log(res)
                    if (callToGeneralData) {
                        submitGeneralData(res)
                    }
                } else {
                    message(res.message)
                }
            })
            .catch(e => {
                message(t('errorMessage.title'));
            })
            .finally(() => {
                setLoading(false)
            })
    }

    const fetchTopics = () => {
        const params = {
            school: selectedSchool?.id,
            id
        }
        setLoading(true)
        fetchRequest('api/course/topics', 'POST', params)
            .then(res => {
                if (res.success) {
                    const parentTopics = res?.parentTopics || []
                    setUnitSubjectList(parentTopics)

                    if (selectedCourseTopic) {
                        for (let pt = 0; pt < parentTopics?.length; pt++) {
                            if (parentTopics[pt]?.id === selectedCourseTopic?.id) {
                                setSubjectList(parentTopics[pt]?.children)
                                break;
                            }
                        }
                    }

                    setUsedMdTopics(res?.existingMdTopics)
                    setIsMdGrade(res?.mdGrade)
                    setGradeSubjects(res?.gradeSubjects)
                    setSelectedSubject(res?.gradeSubjects[0]?.subjectId)
                    setSelectedSubjectName(res?.gradeSubjects[0]?.subjectName)
                    setSelectedGrade(res?.gradeSubjects[0]?.gradeId)
                    setSelectedGradeName(res?.gradeSubjects[0]?.gradeName)
                } else {
                    message(res.message)
                }
            })
            .catch(e => {
                message(t('errorMessage.title'));
            })
            .finally(() => {
                setLoading(false)
            })
    }

    const fetchContent = (topic = null) => {
        const params = {
            id,
            school: selectedSchool?.id,
            topic
        }
        setLoading(true)
        fetchRequest('api/course/syllabuses', 'POST', params)
            .then(res => {
                if (res.success) {
                    setComponents(res.components)
                    setSubjectContent(res.syllabusDetails)
                } else {
                    message(res.message)
                }
            })
            .catch(e => {
                message(t('errorMessage.title'));
            })
            .finally(() => {
                setLoading(false)
            })
    }

    const getCourseQuestions = (exam = null) => {
        const params = {
            school: selectedSchool?.id,
            exam: exam,
            id
        }
        setLoading(true)
        fetchRequest('api/course/exam/questions', 'POST', params)
            .then(res => {
                if (res.success) {
                    setSelectedQuestions(res?.questions)
                } else {
                    message(res.message)
                }
            })
            .catch(e => {
                message(t('errorMessage.title'));
            })
            .finally(() => {
                setLoading(false)
            })
    }

    useEffect(() => {
        const listener = new AbortController()
        if (!listener.signal?.aborted) {
            fetchTopics()
        }
        return () => {
            listener.abort()
        }
    }, [])

    useEffect(() => {
    }, [item])

    const submitGeneralData = (selectedItem) => {
        const formParams = new FormData()
        formParams.append('school', selectedSchool?.id)
        formParams.append('id', id)
        formParams.append('name', item?.name)
        formParams.append('manualOpen', isManualOpen ? 1 : 0)
        formParams.append('price', toInteger(item?.price))
        formParams.append('isSell', item?.isSell ? 1 : 0)
        formParams.append('description', item?.description)
        formParams.append('coverFile', item?.coverFile && item?.coverFile?.files?.length > 0 ? item?.coverFile?.files[0] : null)
        if (item?.removeCoverFile) {
            formParams.append('removeCoverFile', 1)
        }

        const classes = item?.classes || []
        const classArray = []

        if (item && item?.isOpen) {

        } else if (selectedItem && selectedItem?.isOpen) {

        } else {
            if (item?.viewType === 'SCHOOL') {
                if (item?.selectedClasses?.length > 0) {
                    classes.forEach(obj => {
                        if (item.selectedClasses?.includes(obj?.id)) {
                            classArray.push({
                                id: obj?.id,
                                name: obj?.name
                            })
                        }
                    })
                } else {
                    message(t('errorMessage.selectClass'));
                    return
                }
                formParams.append('classes', JSON.stringify(classArray))
            } else {
                if (item?.selectedGroups?.length > 0) {
                    formParams.append('groups', JSON.stringify(item?.selectedGroups))
                } else {
                    message(t('errorMessage.selectGroups'));
                    return
                }
            }
        }

        setLoading(true)
        fetchRequest('api/course/edit', 'POST', formParams, true, true)
            .then(res => {
                if (!res.success) {
                    message(res.message)
                } else {
                    if (tabs.length <= tabIndex + 1) {
                        setTabIndex(0)
                    } else {
                        setTabIndex(tabIndex + 1)
                    }
                }
            })
            .catch(e => {
                message(t('errorMessage.title'));
            })
            .finally(() => setLoading(false))
    }

    const onSubmit = () => {
        if (tabIndex == 0) {
            submitGeneralData()
        } else {
            if (tabs.length <= tabIndex + 1) {
                if (!item) {
                    fetchInit(true)
                }
                setTabIndex(0)
            } else {
                setTabIndex(tabIndex + 1)
            }
        }
    }

    const onPublish = () => {
        const params = {
            id,
            school: selectedSchool?.id
        }

        setLoading(true)
        fetchRequest('api/course/publish', 'POST', params)
            .then(res => {
                if (res.success) {
                    history.push('/onlineLesson/lesson')
                    // history.goBack()
                } else {
                    message(res.message)
                }
            })
            .catch(() => {
                message(t('errorMessage.title'));
            })
            .finally(() => {
                setLoading(false)
            })
    }

    const toggleTopicStatus = (topic, isActive = false, isChild = false) => {
        const params = {
            course: id,
            topic,
            school: selectedSchool?.id,
            parent: isChild ? selectedCourseTopic?.id : '',
            status: isActive ? 0 : 1
        }

        setLoading(true)
        fetchRequest('api/course/topic-toggle-status', 'POST', params)
            .then(res => {
                if (res.success) {
                    const parentTopics = res?.parentTopics || []
                    setUnitSubjectList(parentTopics)
                    if (isChild && selectedCourseTopic) {
                        for (let pt = 0; pt < parentTopics?.length; pt++) {
                            if (parentTopics[pt]?.id === selectedCourseTopic?.id) {
                                setSubjectList(parentTopics[pt]?.children)
                                break;
                            }
                        }
                    }
                } else {
                    message(res.message)
                }
            })
            .catch(e => {
                message(t('errorMessage.title'));
            })
            .finally(() => {
                setLoading(false)
            })
    }

    const onTabChange = (index, value) => {
        setTabIndex(index)
        if (index == 0) {
            fetchInit()
        } else if (index == 2) {
            fetchContent()
        } else {
            fetchTopics()
        }
    }

    const onTopicContextMenuClick = (key, row, event) => {
        if (key == 'edit') {
            setTmpTopic(row)
            setTopicModal(true)
        } else if (key == 'delete') {
            setTmpTopic(row)
            setShowDeleteModal(true)
        } else if (key == 'inactive' || key == 'setActive') {
            toggleTopicStatus(row?.id, row?.isActive, true)
        }
    }

    const onUnitContextMenuClick = (key, row, event) => {
        if (key == 'edit') {
            setTmpTopic(row)
            setUnitModal(true)
        } else if (key == 'delete') {
            setTmpTopic(row)
            setShowDeleteModal(true)
        } else if (key == 'inactive' || key == 'setActive') {
            toggleTopicStatus(row?.id, row?.isActive, true)
        }
    }

    const onContentContextMenuClick = (key, row, event) => {
        if (key == 'edit') {
            setContentModal(true)
            setTempId(row.id)
            setCourseExamId(row.examId)
            setSelectedRow(row)
            setSyllabusId(row.syllabusId)
        } else if (key == 'delete') {
            setTempId(row.id + '@content')
            setShowDeleteModal(true)
        }
    }

    const deleteTopic = (topic) => {
        const params = {
            topic,
            course: id,
            school: selectedSchool?.id
        }

        onDeleteModalClose()
        setLoading(true)
        fetchRequest('api/course/topic-delete', 'POST', params)
            .then(res => {
                if (res.success) {
                    const parentTopics = res?.parentTopics;
                    setUsedMdTopics(res?.existingMdTopics)
                    setUnitSubjectList(parentTopics)
                    setTmpTopic(null)
                    if (selectedCourseTopic) {
                        if (selectedCourseTopic?.id == topic) {
                            setSubjectList([])
                        } else {
                            for (let pt = 0; pt < parentTopics?.length; pt++) {
                                if (parentTopics[pt]?.id === selectedCourseTopic?.id) {
                                    setSubjectList(parentTopics[pt]?.children)
                                    break;
                                }
                            }
                        }
                    } else {
                        setSubjectList([])
                    }
                } else {
                    message(res.message)
                }
            })
            .catch(e => {
                message(t('errorMessage.title'));
            })
            .finally(() => {
                setLoading(false)
            })
    }

    const deleteContent = (detail) => {
        const params = {
            detail,
            id,
            school: selectedSchool?.id
        }

        onDeleteModalClose()
        setLoading(true)
        fetchRequest('api/course/syllabus-delete', 'POST', params)
            .then(res => {
                if (res.success) {
                    fetchContent(childTopic)
                    message(res.message, true)
                } else {
                    message(res.message)
                }
            })
            .catch(e => {
                message(t('errorMessage.title'));
            })
            .finally(() => {
                setLoading(false)
            })
    }

    const onDelete = () => {
        if (tmpTopic) {
            deleteTopic(tmpTopic?.id)
        } else {
            const topic = tempId.split('@')

            if (topic.length == 1) {
                deleteLesson(topic[0], true)
            } else {
                if (topic[1] == 'topicChild') {
                    deleteLesson(topic[0], false)
                } else if (topic[1] == 'content') {
                    deleteContent(topic[0])
                }
            }
        }
    }

    const orderContent = (detail, orderDown) => {
        setSubjectContent([])
        const params = {
            id,
            detail,
            orderDown,
            school: selectedSchool?.id
        }

        setLoading(true)
        fetchRequest('api/course/syllabus-ordering', 'POST', params)
            .then(res => {
                if (res.success) {
                    setSubjectContent(res.syllabusDetails)
                } else {
                    message(res.message)
                }
            })
            .catch(e => {
                message(t('errorMessage.title'));
            })
            .finally(() => {
                setLoading(false)
            })

    }

    const unitSelect = (value) => {
        const tempUnit = unitSubjectList.find(obj => obj.id == value)
        setSelectedCourseTopic(tempUnit)
        if (tempUnit.children) {
            setSubjectList(tempUnit?.children)
        } else {
            setSubjectList([])
        }
    }

    const onTreeSelect = (node) => {
        setTreeNode(node)
        const values = node[0]?.split('@')

        if (values && values.length > 1) {
            const childArray = unitSubjectList?.find(obj => obj.id == values[1])?.children || []

            if (childArray.length > 0) {
                setChildTopic(values[0])
                setChildName(childArray.find(obj => obj.id == values[0])?.name)
                fetchContent(values[0])
            }
        }
    }

    const loadData = () => {
        let params = {
            showQuestion: 1,
            school: selectedSchool?.id
        }
        setLoading(true)
        fetchRequest(examQuestionIndex, 'POST', params)
            .then((res) => {
                setLoading(false)
                if (res.success) {
                    setLinkAnswers(res?.refAnswers)
                    setLinkValues(res?.refValues)

                    setGrades(res?.grades?.map(gradeObj => {
                        return {
                            value: gradeObj?.value,
                            text: gradeObj?.text
                        }
                    }))
                    setSubjects(res?.subjects?.map(subjectObj => {
                        return {
                            value: subjectObj?.id,
                            text: subjectObj?.name
                        }
                    }))
                    setParentTopics(res?.parentTopics?.map(topicObj => {
                        return {
                            value: topicObj?.id,
                            text: topicObj?.name
                        }
                    }))
                    setChildTopics(res?.childTopics?.map(topicObj => {
                        return {
                            value: topicObj?.id,
                            text: topicObj?.name
                        }
                    }))
                    setQTypes(res?.qTypes?.map(qTypeObj => {
                        return {
                            value: qTypeObj?.id,
                            code: qTypeObj?.code,
                            text: qTypeObj?.name
                        }
                    }))
                    setQDifficulties(res?.qDifficulties?.map(qDifficultyObj => {
                        return {
                            value: qDifficultyObj?.id,
                            text: qDifficultyObj?.name
                        }
                    }))
                    setUserList(res?.userList)

                    if (params?.showQuestion) {
                        setCurrentPage(res?.page)
                        setTotalCount(res?.totalCount)
                        if (res?.page > 1) {
                            const newList = [...list, ...res?.list];
                            setList(uniqueList(newList))
                        } else {
                            setList(res?.list)
                        }
                        setHasMorePage(res?.hasMorePage)
                    }
                }
            })
            .catch(() => {
            })
    }

    const onContentClose = () => {
        setContentModal(false)
        setTempId(null)
        setSyllabusId(null)
        setOpenFrom(null)
        fetchContent(childTopic)
        setSelectedQuestions([])
        setOnclosed(false)
        setSelectedRow(null)
    }

    const onQuestionBankClose = () => {
        setQuestionBankModal(false)
    }

    const onQuestionBankOpen = (key, examId) => {
        setQuestionBankModal(true)
        setCourseExamId(examId)
        setOpenFrom(key)
    }

    const onQuestionAddClose = () => {
        setQuestionAddModal(false)
        getCourseQuestions()
    }

    const onQuestionEditClose = (examId) => {
        setQuestionEditModal(false)
        getCourseQuestions(examId)
        setOnclosed(true)
    }

    const onQuestionEditOpen = (key, examId, row) => {
        setQuestionId(row.id)
        loadData()
        setQuestionEditModal(true)
        setOpenFrom(key)
        setCourseExamId(examId)
    }

    const onQuestionAddOpen = (key, examId, syllabusId) => {
        setQuestionAddModal(true)
        setOpenFrom(key)
        setCourseExamId(examId)
    }

    const onDeleteModalClose = () => {
        setShowDeleteModal(false)
        setTempId(null)
        setSyllabusId(null)
    }

    const onImportModalClose = () => {
        setShowImportTopicModal(false)
    }

    const onImportSubmit = (topics = []) => {
        const params = {
            school: selectedSchool?.id,
            course: id,
            parent: importTopicParent ? null : selectedCourseTopic?.id,
            topicJson: JSON.stringify(topics?.filter(obj => obj.checked))
        }

        setLoading(true)
        fetchRequest('api/course/topic-create', 'POST', params)
            .then(res => {
                if (!res.success) {
                    message(res.message)
                } else {
                    setUsedMdTopics(res?.existingMdTopics)
                    setShowImportTopicModal(false)

                    const parentTopics = res?.parentTopics || []
                    setUnitSubjectList(parentTopics)

                    if (selectedCourseTopic) {
                        for (let pt = 0; pt < parentTopics?.length; pt++) {
                            if (parentTopics[pt]?.id === selectedCourseTopic?.id) {
                                setSubjectList(parentTopics[pt]?.children)
                                break;
                            }
                        }
                    }
                }
            })
            .catch(() => {
                message(t('errorMessage.title'));
            })
            .finally(() => {
                setLoading(false)
            })
    }

    const onTopicClose = () => {
        setTopicModal(false)
        setUnitModal(false)
        setTmpTopic(null)
        setTempId(null)
        setSyllabusId(null)
        fetchTopics()
    }

    const Status = ({ text = t('menu.active'), color = "#3EBFA3CC", isDarkText = false, isBold = true }) => {
        return <div
            style={{
                backgroundColor: color,
                borderRadius: '6px',
                padding: '4px 8px',
                marginRight: '4px'
            }}
        >
            <span style={{ color: isDarkText ? 'black' : 'white' }} className={isBold ? 'font-bold' : ''} >{text}</span>
        </div>
    }

    const topicsContextMenu = (isActive = false, topicId = null) => {

        if (topicId && isActive == false) {
            return [
                {
                    key: "setActive",
                    icon: <CheckOutlined style={{ color: '#ff5b1d' }} />,
                    title: t("action.setActive"),
                },
                {
                    key: "delete",
                    icon: <TrashIcon />,
                    title: t('action.delete')
                }
            ]
        }

        if (isActive) {
            return [
                {
                    key: "inactive",
                    icon: <CancelOutlined style={{ color: '#ff5b1d' }} />,
                    title: t("action.setInactive"),
                },
                {
                    key: "edit",
                    icon: <EditIcon />,
                    title: t('action.edit'),
                }
            ]
        }

        return [
            {
                key: "setActive",
                icon: <CheckOutlined style={{ color: '#ff5b1d' }} />,
                title: t("action.setActive"),
            },
            {
                key: "edit",
                icon: <EditIcon />,
                title: t('action.edit'),
            },
            {
                key: "delete",
                icon: <TrashIcon />,
                title: t('action.delete')
            }
        ]
    }

    const handlerUnitSubjectOrder = (parentTopic, type, index) => {
        let replaceTopicId = null
        if (type == 'DOWN') {
            replaceTopicId = parentTopic[index + 1].id
        } else if (type == 'UP') {
            replaceTopicId = parentTopic[index - 1].id
        }

        const params = {
            school: selectedSchool?.id,
            course: id,
            topic: parentTopic[index].id,
            replaceTopic: replaceTopicId,
            orderingType: type,
            parent: 1
        }

        setLoading(true)
        fetchRequest('api/course/topic-order', 'POST', params)
            .then(res => {
                if (!res.success) {
                    message(res.message)
                } else {
                    setUsedMdTopics(res?.existingMdTopics)
                    setShowImportTopicModal(false)

                    const parentTopics = res?.parentTopics || []
                    setUnitSubjectList(parentTopics)

                    if (parentTopic[index].id) {
                        const tempUnit = unitSubjectList.find(obj => obj.id == parentTopic[index].id)
                        setSelectedCourseTopic(tempUnit)
                        for (let pt = 0; pt < parentTopics?.length; pt++) {
                            if (parentTopics[pt]?.id === parentTopic[index].id?.id) {
                                setSubjectList(parentTopics[pt]?.children)
                                break;
                            }
                        }
                    }
                }
            })
            .catch(() => {
                message(t('errorMessage.title'));
            })
            .finally(() => {
                setLoading(false)
            })
    }

    const handlerRegularSubjectOrder = (childTopic, type, index) => {
        let replaceTopicId = null
        if (type == 'DOWN') {
            replaceTopicId = childTopic[index + 1].id
        } else if (type == 'UP') {
            replaceTopicId = childTopic[index - 1].id
        }

        const params = {
            school: selectedSchool?.id,
            course: id,
            topic: childTopic[index].id,
            replaceTopic: replaceTopicId,
            orderingType: type,
            parent: 0,
        }

        setLoading(true)
        fetchRequest('api/course/topic-order', 'POST', params)
            .then(res => {
                if (!res.success) {
                    message(res.message)
                } else {
                    setUsedMdTopics(res?.existingMdTopics)
                    setShowImportTopicModal(false)

                    const parentTopics = res?.parentTopics || []
                    setUnitSubjectList(parentTopics)

                    if (selectedCourseTopic) {
                        for (let pt = 0; pt < parentTopics?.length; pt++) {
                            if (parentTopics[pt]?.id === selectedCourseTopic?.id) {
                                setSubjectList(parentTopics[pt]?.children)
                                break;
                            }
                        }
                    }
                }
            })
            .catch(() => {
                message(t('errorMessage.title'));
            })
            .finally(() => {
                setLoading(false)
            })
    }

    const UnitSubjects = ({ selected, list = [] }) => {
        if (list?.length > 0) {
            return list.map((obj, index) => {
                return (
                    <div key={index} style={{ position: 'relative' }} >
                        <div style={{ position: 'absolute', right: '24px', top: '24px' }} >
                            <ContextMenu contextMenus={topicsContextMenu(obj.isActive, obj.topicId)} row={obj} onContextMenuItemClick={onUnitContextMenuClick} left={165} />
                        </div>
                        <div className="card-alternate mb-2 cursor-pointer"
                            onClick={() => unitSelect(obj.id)}
                            style={{ backgroundColor: selected == obj.id ? '#FF5B1D1A' : 'white' }}>
                            <div className='d-flex' style={{ marginRight: '48px' }}>
                                <span>{obj.name}</span>
                            </div>
                            <div className='d-flex flex-row justify-content-between align-items-center mt-4'>
                                <div className='d-flex flex-row align-items-center'>
                                    <Status text={obj.isActive ? t('menu.active') : t('menu.inActive')} color={obj.isActive ? "#3EBFA3CC" : "#575962"} />
                                    {obj.isPrivate ? <UserIcon /> : null}
                                    <span className='ml-2' style={{ color: '#979797' }}>{obj.createdUser} | {dateObjectFormat(obj.createdDate, true)}</span>
                                </div>
                                <div className='d-flex flex-row align-items-center justify-content-end col-md-2'>
                                    {
                                        index + 1 !== list?.length
                                            ?
                                            <Button variant='outline-dark' className="btn-icon btn-icon-only ml-2 p-0" onClick={() => handlerUnitSubjectOrder(list, 'DOWN', index)}>
                                                <ArrowDownward />
                                            </Button>
                                            : null
                                    }
                                    {
                                        index !== 0
                                            ?
                                            <Button variant='outline-dark' className="btn-icon btn-icon-only ml-2 p-0" onClick={() => handlerUnitSubjectOrder(list, 'UP', index)}>
                                                <ArrowUpward />
                                            </Button>
                                            : null
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                )
            })
        }
        return null
    }

    const RegularSubjects = ({ list = [] }) => {
        if (list?.length > 0) {
            return list.map((obj, index) => {
                return <div key={index} className="card-alternate mb-2" style={{ backgroundColor: 'white' }}>
                    <div className='d-flex justify-content-between'>
                        <span>{obj.name}</span>
                        <ContextMenu row={obj} contextMenus={topicsContextMenu(obj.isActive, obj.topicId)} onContextMenuItemClick={onTopicContextMenuClick} left={165} />
                    </div>
                    <Row className='d-flex justify-content-between'>
                        <Col md={9}>
                            <span>{obj.description}</span>
                        </Col>
                    </Row>
                    <div className='d-flex flex-row justify-content-between align-items-center mt-4'>
                        <div className='d-flex flex-row align-items-center'>
                            <Status text={obj.isActive ? t('menu.active') : t('menu.inActive')} color={obj.isActive ? "#3EBFA3CC" : "#575962"} />
                            {obj.isPrivate ? <UserIcon /> : null}

                            <span className='ml-2' style={{ color: '#979797' }}>{obj.createdUser} | {dateObjectFormat(obj.createdDate, true)}</span>
                        </div>
                        <div className='d-flex flex-row align-items-center justify-content-end col-md-2'>
                            {
                                index + 1 !== list?.length
                                    ?
                                    <Button variant='outline-dark' className="btn-icon btn-icon-only ml-2 p-0" onClick={() => handlerRegularSubjectOrder(list, 'DOWN', index, 'CHILD')}>
                                        <ArrowDownward />
                                    </Button>
                                    : null
                            }
                            {
                                index !== 0
                                    ?
                                    <Button variant='outline-dark' className="btn-icon btn-icon-only ml-2 p-0" onClick={() => handlerRegularSubjectOrder(list, 'UP', index, 'CHILD')}>
                                        <ArrowUpward />
                                    </Button>
                                    : null
                            }
                        </div>
                    </div>
                </div>
            })
        }

        return null
    }

    const Category = () => {
        return <>
            <Row className='mt-3 justify-content-center' style={{ padding: '15px 25px' }}>
                <Col md={5}>
                    <div className='d-flex flex-row'>
                        <div>
                            <Button
                                variant="primary"
                                className="mb-4 add-button text-uppercase"
                                onClick={() => setUnitModal(true)}
                            >
                                <ControlPoint style={{ color: "white", marginRight: "4px" }} />
                                {t('onlineLesson.unitAdd')}
                            </Button>
                        </div>
                        <div className='ml-3'>
                            <Button
                                variant="info"
                                className="mb-4 add-button text-uppercase"
                                onClick={() => {
                                    setImportTopicParent(true)
                                    setShowImportTopicModal(true)
                                }}
                                style={{ backgroundColor: "#36A3F7", height: 32 }}
                            >
                                <ImportIcon />
                                <div style={{ marginRight: '4px' }} />
                                {t('onlineLesson.import')}
                            </Button>
                        </div>
                    </div>
                    <div className='d-flex flex-row justify-content-between'>
                        <div>
                            <p className="small-title">{t('curriculum.unitSubject')}</p>
                        </div>
                        <div className='ml-3'>
                            <p className="small-title" style={{ color: '#505050' }}>{t('common.total')}: {unitSubjectList?.length}</p>
                        </div>
                    </div>
                    <BottomScrollListener
                        onBottom={() => { }}
                        offset={500}
                    >
                        <UnitSubjects selected={selectedCourseTopic?.id} list={unitSubjectList} />
                    </BottomScrollListener>
                </Col>
                <Col md={7}>
                    {
                        selectedCourseTopic && <div className='d-flex flex-row'>
                            <div>
                                <Button
                                    variant="primary"
                                    className="mb-4 add-button text-uppercase"
                                    onClick={() => setTopicModal(true)}
                                >
                                    <ControlPoint style={{ color: "white", marginRight: "4px" }} />
                                    {t('onlineLesson.regularAdd')}
                                </Button>
                            </div>
                            <div className='ml-3'>
                                {
                                    selectedCourseTopic?.topicId && <Button
                                        variant="info"
                                        className="mb-4 add-button text-uppercase"
                                        onClick={() => {
                                            setImportTopicParent(false)
                                            setShowImportTopicModal(true)
                                        }}
                                        style={{ backgroundColor: "#36A3F7", height: 32 }}
                                    >
                                        <ImportIcon />
                                        <div style={{ marginRight: '4px' }} />
                                        {t('onlineLesson.import')}
                                    </Button>
                                }
                            </div>
                        </div>
                    }

                    <div className='d-flex flex-row justify-content-between'>
                        <div>
                            <p className="small-title">{t('school.regularSubject')}</p>
                        </div>
                        <div className='ml-3'>
                            <p className="small-title" style={{ color: '#505050' }}>{t('common.total')}: {subjectList?.length}</p>
                        </div>
                    </div>

                    <BottomScrollListener
                        onBottom={() => { }}
                        offset={500}
                    >
                        <RegularSubjects list={subjectList} />
                    </BottomScrollListener>
                </Col>
            </Row>
        </>
    }

    const OnlyContent = ({ obj = {} }) => {
        return <div
            className='d-flex flex-column w-100'
            style={{ border: `1px solid ${obj.color}`, borderRadius: '12px', overflow: 'hidden' }}
        >
            <div className='d-flex flex-row p-2 w-100 align-item-center' style={{ backgroundColor: obj.color }}>
                <span className="small-title text-white" >{obj.name}</span>
            </div>
            <div className='d-flex flex-row p-2 w-100' >
                {
                    obj?.isTraditionDescription
                        ?
                        <div className='text-semi-large text-dark ml-2 tradition-text' dangerouslySetInnerHTML={{ __html: obj?.description }} style={{ height: 'auto' }} />
                        :
                        <div dangerouslySetInnerHTML={{ __html: obj?.description }} />
                }
            </div>
        </div>
    }

    const KeyWords = ({ obj = {} }) => {
        return <div
            className='d-flex flex-column w-100'
            style={{ border: `1px solid ${obj.color}`, borderRadius: '12px', overflow: 'hidden' }}
        >
            <div className='d-flex flex-row p-2 w-100 align-item-center' style={{ backgroundColor: obj.color }}>
                <span className="small-title text-white" >{obj.name}</span>
            </div>
            <div className='d-flex flex-row p-2 w-100'>
                <div className='d-flex flex-column'>
                    {
                        obj?.isTraditionKeyword
                            ?
                            <div className='text-semi-large text-dark ml-2 tradition-text' dangerouslySetInnerHTML={{ __html: obj?.keyword }} style={{ height: 'auto' }} />
                            :
                            <div dangerouslySetInnerHTML={{ __html: obj.keyword }} />
                    }
                </div>
                <div className='d-flex flex-column ml-2'>
                    {
                        obj?.isTraditionDescription
                            ?
                            <div className='text-semi-large text-dark ml-2 tradition-text' dangerouslySetInnerHTML={{ __html: obj?.description }} style={{ height: 'auto' }} />
                            :
                            <div dangerouslySetInnerHTML={{ __html: obj.description }} />
                    }
                </div>
            </div>
        </div>
    }

    const ImageContent = ({ obj = {} }) => {
        return <div className='d-flex flex-column w-100'>
            <div className='d-flex flex-row p-2 w-100 align-item-center'>
                <span className="small-title text-dark" >{obj.title}</span>
            </div>
            <div className='d-flex flex-row p-2 w-100' >
                {
                    obj?.isTraditionDescription
                        ?
                        <div className='text-semi-large text-dark ml-2 tradition-text' dangerouslySetInnerHTML={{ __html: obj?.description }} style={{ height: 'auto' }} />
                        :
                        <div dangerouslySetInnerHTML={{ __html: obj.description }} />
                }
            </div>
            <div className='d-flex flex-row p-2 w-100' >
                {
                    obj.photoPath
                        ? <Image src={obj.photoPath} style={{ resize: 'block', height: '120px' }} />
                        : null
                }
            </div>
        </div>
    }

    const Audio = ({ obj = {} }) => {
        return <div className='d-flex flex-column w-100'>
            <div className='d-flex flex-row p-2 w-100 align-item-center'>
                {
                    obj?.isTraditionDescription
                        ?
                        <div className='text-semi-large text-dark ml-2 tradition-text' dangerouslySetInnerHTML={{ __html: obj?.title }} style={{ height: 'auto' }} />
                        :
                        // <span className="small-title text-dark" >{obj.title}</span>
                        <div className="small-title text-dark pinnacle-demi-bold" dangerouslySetInnerHTML={{ __html: obj?.title }} style={{ height: 'auto' }} />
                }
            </div>
            <div className='d-flex flex-row p-2 w-100 justify-content-center'>
                {
                    obj.photoPath
                        ?
                        <>
                            <Image src={obj.photoPath} style={{ resize: 'block', height: '120px' }} />
                            <VisibilityIcon fontSize='small cursor' style={{ position: 'relative', bottom: 5, right: 5 }} onClick={() => onViewHandler(obj.photoPath)} />
                        </>
                        : null
                }
            </div>
            <div className='d-flex flex-row p-2 w-100 justify-content-center'>
                <AudioPlayer src={obj.audioPath} />
            </div>
        </div>
    }

    const Video = ({ obj = {} }) => {
        if (obj && obj.videoPath) {
            if (obj.videoStatus) {
                if (obj.videoStatus?.isPlayable) {
                    return (
                        <div className='col d-flex justify-content-center auto-width-iframe'>
                            <iframe
                                style={{ padding: '1.8rem 4rem 1.8rem 1.8rem' }}
                                // src={`https://player.vimeo.com/video/${obj?.videoPath.split('/').at(-1)}`}
                                src={`/adminPlayer/${obj?.videoPath.split('/').at(-1)}`}
                                width="400"
                                height="300"
                                allow="autoplay; fullscreen; picture-in-picture"
                                title="Untitled"
                            />
                        </div>
                    )
                } else {
                    return <div className="w-100 py-4 text-center">
                        <VideoTranscodeImage />
                        <h5 className="mt-4">{t('onlineLesson.videoInTranscode')}</h5>
                    </div>
                }
            } else {
                return (
                    <div className='d-flex justify-content-center auto-width-iframe'>
                        <iframe
                            style={{ padding: '1.8rem 4rem 1.8rem 1.8rem' }}
                            // src={`https://player.vimeo.com/video/${obj?.videoPath.split('/').at(-1)}`}
                            src={`/adminPlayer/${obj?.videoPath.split('/').at(-1)}`}
                            width="400"
                            height="300"
                            allow="autoplay; fullscreen; picture-in-picture"
                            title="Untitled"
                        />
                    </div>
                )
            }
        } else {
            return <div />
        }
    }

    const DialogCard = ({ obj = {}, index = 0 }) => {
        if (obj) {
            return <div className='d-flex flex-column' style={{ width: '95%' }}>
                <div className='d-flex flex-row p-2 w-100 align-item-center'>
                    <span className="small-title text-black" >{obj.title}</span>
                </div>

                <DialogCards children={obj?.dialogCards} index={index} />
            </div>
        } else {
            return <div />
        }
    }

    const Crossword = ({crosswords, obj}) => {
        if(crosswords && crosswords.length > 0){
            return crosswords.map((crossword, index) => {
                let crossData = {
                    across: {},
                    down: {}
                }

                if(crossword.list && crossword.list.length > 0){
                    crossData = listToCrosswordObj(crossword.list)
                }

                return (
                    <div key={'crossword_' + index} className='w-100'>
                        <div className='d-flex flex-row align-items-center p-2'>
                            <Status text={t('common.score') + ': ' + crossword.totalScore} color={"#575962"} />
                        </div>
                        <div className='card-alternate'>
                            <div className='d-flex flex-row align-items-center mb-2'>
                                <Status text={obj.typeName} color={"#3EBFA3CC"} />
                            </div>
                            <div className='mb-1'>
                                {t('common.name') + ': '} <b>{crossword.title}</b>
                            </div>
                            <div className='mb-3'>
                                {t('common.description') + ': ' } <b>{crossword.description}</b>
                            </div>
                            <CrossWordComponent 
                                acrossLabel={t('crossWord.acrossLabel')}
                                downLabel={t('crossWord.downLabel')}
                                data={crossData}
                                isDisabled={true}
                            />
                        </div>
                    </div>
                )
            })
        } else {
            return <div />
        }
    }

    const onViewHandler = (image) => {
        setSelectedPath(image)
        setShowModal(true)
    }

    const renderMatchQuestion = (answer, values) => {
        if (answer.answerType == 'text' || answer.answerType == 'mbscript') {
            return (
                <div className="d-flex flex-row justify-content-between">
                    {
                        answer.answerType == 'text' &&
                        <div>
                            {answer.answer}
                        </div>
                    }
                    {
                        answer.answerType == 'mbscript' &&
                        <div>
                            <div className='text-semi-large text-dark ml-2 tradition-text tradition-text-student' dangerouslySetInnerHTML={{ __html: answer.answer }} />
                        </div>
                    }
                    <div>
                        {
                            values.map((value, vIndex) => {
                                if (answer.valueId == value.id) {
                                    if (value.valueType == 'text') {
                                        return (
                                            <div key={'answer_' + vIndex} className='d-flex'>
                                                {value.value}
                                            </div>
                                        )
                                    } else if (value.valueType == 'equation') {
                                        return (
                                            <div key={'answer_' + vIndex} className='d-flex'>
                                                <div className='d-flex' dangerouslySetInnerHTML={{ __html: value.value }} />
                                            </div>
                                        )
                                    } else if (value.valueType == 'mbscript') {
                                        return (
                                            <div key={'answer_' + vIndex} className='d-flex'>
                                                <div className='text-semi-large text-dark ml-2 tradition-text tradition-text-student' dangerouslySetInnerHTML={{ __html: value.value }} />
                                            </div>
                                        )
                                    } else if (value.valueType == 'image') {
                                        return (
                                            <div key={'answer_' + vIndex}>
                                                <img className='drag-list-path-style' src={value.filePath} height={80} width={80} />
                                                <VisibilityIcon fontSize='small cursor' style={{ position: 'relative', bottom: 40, right: 10 }} onClick={() => onViewHandler(value.filePath)} />
                                            </div>
                                        )
                                    }
                                }
                            })
                        }
                    </div>
                </div>
            )
        } else if (answer.answerType == 'equation') {
            return (
                <div className="d-flex flex-row justify-content-between">
                    <div>
                        <div className='d-flex' dangerouslySetInnerHTML={{ __html: answer.answer }} />
                    </div>
                    <div>
                        {
                            values.map((value, vIndex) => {
                                if (answer.valueId == value.id) {
                                    if (value.valueType == 'text') {
                                        return (
                                            <div key={'answer_' + vIndex} className='d-flex'>
                                                {value.value}
                                            </div>
                                        )
                                    } else if (value.valueType == 'equation') {
                                        return (
                                            <div key={'answer_' + vIndex} className='d-flex'>
                                                <div className='d-flex' dangerouslySetInnerHTML={{ __html: value.value }} />
                                            </div>
                                        )
                                    } else if (value.valueType == 'mbscript') {
                                        return (
                                            <div key={'answer_' + vIndex} className='d-flex'>
                                                <div className='text-semi-large text-dark ml-2 tradition-text tradition-text-student' dangerouslySetInnerHTML={{ __html: value.value }} />
                                            </div>
                                        )
                                    } else if (value.valueType == 'image') {
                                        return (
                                            <div key={'answer_' + vIndex}>
                                                <img className='drag-list-path-style' src={value.filePath} height={80} width={80} />
                                                <VisibilityIcon fontSize='small cursor' style={{ position: 'relative', bottom: 40, right: 10 }} onClick={() => onViewHandler(value.filePath)} />
                                            </div>
                                        )
                                    }
                                }
                            })
                        }
                    </div>
                </div>
            )
        } else if (answer.answerType == 'image') {
            return (
                <div className="d-flex flex-row justify-content-between">
                    <div>
                        <img className='drag-list-path-style' src={answer.filePath} height={80} width={80} />
                        <VisibilityIcon fontSize='small cursor' style={{ position: 'relative', bottom: 40, right: 10 }} onClick={() => onViewHandler(answer.filePath)} />
                    </div>
                    <div>
                        {
                            values.map((value, vIndex) => {
                                if (answer.valueId == value.id) {
                                    if (value.valueType == 'text') {
                                        return (
                                            <div key={'answer_' + vIndex} className='d-flex'>
                                                {value.value}
                                            </div>
                                        )
                                    } else if (value.valueType == 'equation') {
                                        return (
                                            <div key={'answer_' + vIndex} className='d-flex'>
                                                <div className='d-flex' dangerouslySetInnerHTML={{ __html: value.value }} />
                                            </div>
                                        )
                                    } else if (value.valueType == 'mbscript') {
                                        return (
                                            <div key={'answer_' + vIndex} className='d-flex'>
                                                <div className='text-semi-large text-dark ml-2 tradition-text tradition-text-student' dangerouslySetInnerHTML={{ __html: value.value }} />
                                            </div>
                                        )
                                    } else if (value.valueType == 'image') {
                                        return (
                                            <div key={'answer_' + vIndex}>
                                                <img className='drag-list-path-style' src={value.filePath} height={80} width={80} />
                                                <VisibilityIcon fontSize='small cursor' style={{ position: 'relative', bottom: 40, right: 10 }} onClick={() => onViewHandler(value.filePath)} />
                                            </div>
                                        )
                                    }
                                }
                            })
                        }
                    </div>
                </div>
            )
        }
    }

    const renderAnswer = (answer) => {
        if (answer) {
            if (answer.answerType == 'text') {
                return (
                    <div>
                        {/* {(index + 1) + '.' + answer.answer} */}
                        {answer.answer}
                    </div>
                )
            } else if (answer.answerType == 'image') {
                return (
                    <div className='d-flex mt-1 mb-1'>
                        {/* <div>
                            {(index + 1) + '.'}
                        </div> */}
                        <img src={answer.filePath} height={80} width={80} style={{ borderRadius: 6 }} />
                        <VisibilityIcon fontSize='small cursor' style={{ position: 'relative', bottom: 6, right: 6 }} onClick={() => onViewHandler(answer.filePath)} />
                    </div>
                )
            } else if (answer.answerType == 'equation') {
                return (
                    // <div className='d-flex' dangerouslySetInnerHTML={{ __html: (index + 1) + '.' + answer.answer }}/>
                    <div className='d-flex' dangerouslySetInnerHTML={{ __html: answer.answer }} />
                )
            } else if (answer.answerType == 'mbscript') {
                return (
                    // <div className='text-semi-large text-dark ml-2 tradition-text tradition-text-student' dangerouslySetInnerHTML={{ __html: (index + 1) + '.' + answer.answer }}/>
                    <div className='text-semi-large text-dark ml-2 tradition-text tradition-text-student' dangerouslySetInnerHTML={{ __html: answer.answer }} />
                )
            }
        }
    }

    const Answers = ({ typeCode = null, obj = {} }) => {
        if ((typeCode == 'TEST' || typeCode == 'MULTI') && obj.answers?.length > 0) {
            return obj.answers.map((item, index) => {
                return (
                    <div key={index} className='d-flex flex-row align-content-center align-items-center position-relative mb-3'>
                        <div className="ml-4 mr-3" style={obj.hasDescription ? { marginBottom: 'auto', position: 'relative', top: 2 } : {}}>
                            <RadioButton checked={item.isCorrect} />
                        </div>
                        {/* <RadioButton className='mr-3' checked={item.isCorrect} /> */}
                        <div className='d-flex flex-column align-items-center justify-content-center'>
                            <span>
                                {renderAnswer(item)}
                                {/* {
                                    item.answerType == 'mbscript'
                                    ?
                                        <div className='text-semi-large text-dark ml-2 tradition-text' dangerouslySetInnerHTML={{ __html: item?.answer.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&') }} style={{height: 'auto'}}/>
                                    :
                                        <div className='w-100' dangerouslySetInnerHTML={{ __html: item.answer }} />
                                } */}
                                {/* <div dangerouslySetInnerHTML={{ __html: item.answer }} /> */}
                                {
                                    obj.hasDescription &&
                                    <div style={{ color: '#868AA8', borderRadius: 6, width: '100%', padding: '5px 12px', marginTop: 4 }}>
                                        {/* {item?.description || ''} */}
                                        <div dangerouslySetInnerHTML={{ __html: item?.description || '' }} />
                                    </div>
                                    // <Tooltip title={item.description}>
                                    // <LiveHelpIcon className='ml-3' fontSize='small' sx={{ color: '#ff5b1d' }}/>
                                    // </Tooltip>
                                }
                            </span>
                            {
                                item.file
                                    ? <Image src={item.file} style={{ resize: 'block', height: '120px' }} />
                                    : null
                            }
                            {
                                item.content
                                    ? <div dangerouslySetInnerHTML={{ __html: item.content }} />
                                    : null
                            }
                        </div>
                    </div>
                )
            })
        } else if (typeCode == 'LINK') {
            return obj.answers.map((answerObj, index) => {
                return <div
                    key={index}
                    className="d-flex flex-row align-content-center align-items-center position-relative mt-2"
                >
                    <div style={{ minWidth: 40 }}>{answerObj.score > 0 ? answerObj.score : ''}</div>
                    {
                        answerObj.score > 0
                            ?

                            <div style={{ minWidth: 30 }} className={obj.answers[index + 1] && obj.answers[index + 1].score == 0 ? "open-tag ml-4" : "open-tag ml-4 success"}>{obj.answers[index + 1] && obj.answers[index + 1].score == 0 ? getIcon('') : getIcon('success')}</div>
                            :
                            <div style={{ minWidth: 30 }} className="ml-4" />
                    }
                    <div className="ml-3" style={{ width: 20 }}>{answerObj.name}</div>
                    {
                        answerObj.values.map((value, vIndex) => {
                            return (
                                <div key={'answer_' + index + '_value_' + vIndex} className='d-flex flex-row align-content-center align-items-center'>
                                    {
                                        index == 0
                                            ?
                                            <div className="d-block" style={{ position: 'relative', left: 29, bottom: 25 }}>{value.name}</div>
                                            :
                                            <div className="d-block" style={{ position: 'relative', left: 29, bottom: 25, color: '#FFF', zIndex: -1 }}>{value.name}</div>
                                    }
                                    {
                                        vIndex
                                            ?
                                            <RadioButton className='ml-3' checked={value.id == answerObj.correctValue} />
                                            :
                                            <RadioButton className='ml-4' checked={value.id == answerObj.correctValue} />
                                    }
                                </div>
                            )
                        })
                    }
                </div>
            })
        } else if (typeCode == 'FILL') {
            return <div className='d-flex flex-row p-2 w-100 align-item-center'>
                <span>{obj.answerText}</span>
            </div>
        } else if (typeCode == 'MATCH' && obj.answers?.length > 0) {
            return obj.answers.map((answerObj, index) => {
                return (
                    <div key={'match_' + index} className='card-alternate mb-2 render-match-question' style={{ padding: '12px 24px' }}>
                        {renderMatchQuestion(answerObj, obj.values)}
                    </div>
                )
            })
            // return <div className='d-flex flex-row p-2 w-100 align-item-center'>
            //     {
            //         obj.answers.map((item, index) => {
            //             return <Status key={index} color='#FF5B1D33' text={item.text} isDarkText isBold={false} />
            //         })
            //     }
            // </div>
        } else if (typeCode == 'ORDER' && obj.answers?.length > 0) {
            return obj.answers.map((item, index) => {
                return <div key={index} className='d-flex flex-row p-2 w-100 align-item-center'>
                    <div className='d-flex flex-column align-items-end col-md-4'>
                        <span>
                            {item.text}
                        </span>
                        {
                            item.image
                                ? <Image src={item.image} style={{ resize: 'block', height: '120px' }} />
                                : null
                        }
                        {
                            item.content
                                ? <div dangerouslySetInnerHTML={{ __html: item.content }} />
                                : null
                        }
                    </div>
                    <div className='d-flex flex-row align-items-center justify-content-end col-md-2'>
                        {
                            index + 1 !== obj.answers?.length
                                ?
                                <Button disabled variant='outline-dark' className="btn-icon btn-icon-only ml-2 p-0" >
                                    <ArrowDownward />
                                </Button>
                                : null
                        }
                        {
                            index !== 0
                                ?
                                <Button disabled variant='outline-dark' className="btn-icon btn-icon-only ml-2 p-0" >
                                    <ArrowUpward />
                                </Button>
                                : null
                        }
                    </div>
                </div>
            })
        }

        return null
    }

    const Question = ({ obj = {} }) => {
        return <div className='d-flex flex-column w-100 question-table-style'>
            <div className='d-flex flex-row p-2 w-100 align-item-center'>
                <Status text={t('common.score') + ': ' + (obj.score || 0)} color="#575962" />
                <Status text={t('onlineLesson.isRepeatAble') + ': ' + (obj.isRepeatAble ? t('common.yes') : t('common.no'))} color="#575962" />
                <Status text={t('common.duration') + ': ' + (obj.duration || '-')} color="#575962" />
            </div>
            {
                obj.questions && obj.questions.length > 0
                    ?
                    obj.questions.map((q, i) => {
                        return <div key={i} className='d-flex card-alternate mb-2 flex-column w-100'>
                            {
                                q.difficultyName
                                    ?
                                    <div className='d-flex flex-row align-items-center'>
                                        {/* <Status text={t('common.score') + ': ' + (q.score || 0)} color="#575962" /> */}
                                        <Status text={q.difficultyName} color={q.difficultyColor || "#3EBFA3CC"} />
                                    </div>
                                    : null
                            }
                            {
                                q.files && q.files.length > 0
                                    ?
                                    <div className='col-12 text-center'>
                                        {
                                            q.files.map((file, index) => {
                                                if (file.type == "QUESTION_IMAGE") {
                                                    return (
                                                        <div key={'image_' + index} className="col-12">
                                                            <img src={file.path} height={100} width={100} />
                                                            <VisibilityIcon fontSize='small cursor' style={{ position: 'relative', bottom: 50, right: 7 }} onClick={() => onViewHandler(file.path)} />
                                                        </div>
                                                    )
                                                } else if (file.type == "QUESTION_AUDIO") {
                                                    return (
                                                        <div key={'audio_' + index} className="col-12 mt-3">
                                                            <ReactAudioPlayer
                                                                controls
                                                                src={file.path}
                                                            />
                                                        </div>
                                                    )
                                                }

                                                return null
                                            })
                                        }
                                    </div>
                                    : null
                            }
                            <div className='d-flex flex-row p-2 w-100' >
                                {
                                    q.hasTradition
                                        ?
                                        <div className='text-semi-large text-dark ml-2 tradition-text' dangerouslySetInnerHTML={{ __html: q.content }} style={{ height: 'auto' }} />
                                        :
                                        <div className='w-100' dangerouslySetInnerHTML={{ __html: q.content }} />
                                }
                            </div>
                            <div className='d-flex flex-column p-2 w-100' >
                                <Answers typeCode={q.qTypeCode} obj={q} />
                            </div>
                        </div>
                    })
                    : null
            }
        </div>
    }

    const TabButtons = ({ tabKey = "INTEGRATED" }) => {
        return <div className="d-flex justify-content-center mb-3 mt-2">
            <SchoolTab selectedTabIndex={tabKey == 'INTEGRATED' ? 0 : 1} disabled />
        </div>
    }

    const SubjectContents = ({ list = [] }) => {
        return list.map((obj, index) => {
            return <Card key={index} className='mt-2' style={obj.typeCode == "VIDEO" ? { height: 500 } : {}}>
                <Card.Body
                    // className='p-3'
                    style={{ padding: '1.8rem 1rem 1rem 1.8rem' }}
                >
                    <div className='d-flex flex-row justify-content-between align-items-start'>
                        {
                            obj.typeCode == 'INFORMATION_ONLY'
                                ?
                                <OnlyContent obj={obj} />
                                : null
                        }
                        {
                            obj.typeCode == 'DESC_INFO_IMAGE'
                                ?
                                <ImageContent obj={obj} />
                                : null
                        }
                        {
                            obj.typeCode == "KEYWORD"
                                ? <KeyWords obj={obj} />
                                : null
                        }
                        {
                            obj.typeCode == "ACTIVE_QUESTION"
                                ? <Question obj={obj} />
                                : null
                        }
                        {
                            obj.typeCode == "AUDIO_IMAGE"
                                ? <Audio obj={obj} />
                                : null
                        }
                        {
                            obj.typeCode == "VIDEO"
                                ?
                                <Video obj={obj} />
                                : null
                        }
                        {
                            obj?.typeCode === 'DIALOG_CARD' && <DialogCard obj={obj} index={index} />
                        }
                        {
                            obj?.typeCode === 'CROSSWORD' && <Crossword crosswords={obj.crosswords} obj={obj} index={index} />
                        }
                        <ContextMenu row={obj} contextMenus={[
                            {
                                key: "edit",
                                icon: <EditIcon />,
                                title: t('action.edit'),
                            },
                            {
                                key: "delete",
                                icon: <TrashIcon />,
                                title: t('action.delete')
                            }
                        ]} onContextMenuItemClick={onContentContextMenuClick} />
                    </div>
                    <div className='d-flex flex-row align-items-center justify-content-end mt-3' style={obj.typeCode == "VIDEO" ? { position: 'absolute', bottom: 0, right: 0, marginRight: '1rem', marginBottom: '1rem' } : {}}>
                        {
                            index + 1 !== list.length
                                ?
                                <Button onClick={() => orderContent(obj.id, 1)} variant='outline-dark' className="btn-icon btn-icon-only ml-2" >
                                    <ArrowDownward />
                                </Button>
                                : null
                        }
                        {
                            index !== 0
                                ?
                                <Button onClick={() => orderContent(obj.id, 0)} variant='outline-dark' className="btn-icon btn-icon-only ml-2">
                                    <ArrowUpward />
                                </Button>
                                : null
                        }
                    </div>
                </Card.Body>
            </Card>
        })
    }

    const Subject = () => {
        return <>
            <Row className='mt-3 ml-2 mr-2'>
                <Col md={3}>
                    <Card>
                        <Card.Body>
                            <TreeView
                                defaultExpandAll
                                treeData={toTreeData(unitSubjectList, 'id', 'name')}
                                selectedNodes={treeNode}
                                onSelect={onTreeSelect}
                            />
                        </Card.Body>
                    </Card>
                </Col>
                {
                    childTopic
                        ?
                        <Col md={9}>
                            <Button
                                variant="primary"
                                className="mb-3 add-button text-uppercase"
                                onClick={() => setContentModal(true)}
                            >
                                <ControlPoint style={{ color: "white", marginRight: "4px" }} />
                                {t('common.add')}
                            </Button>

                            <SubjectContents list={subjectContent} />
                        </Col>
                        : null
                }
            </Row>
        </>
    }

    const verifyFile = (files) => {
        const acceptedType = [
            'image/x-png',
            'image/png',
            'image/jpg',
            'image/jpeg',
            'image/gif',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/vnd.openxmlformats-officedocument.presentationml.presentation',
            'application/vnd.openxmlformats-officedocument.presentationml.slideshow',
            'video/x-ms-wmv',
            'application/pdf',
            'audio/mpeg',
            'video/mpeg',
            'video/mp4',
            'video/quicktime',
            'video/x-ms-wmv',
        ];
        const acceptedSize = 20 * 52428800;

        if (files && files.length > 0) {
            let isFalse = true;
            for (let i = 0; i < files.length; i++) {
                let imageSize = files[i].size;
                let imageType = files[i].type;
                if (imageSize > acceptedSize) {
                    coverFile.showErrorMessage = true;
                    coverFile.errorMessage = t('newsfeed.fileSizeWarning');
                    isFalse = false;
                }

                if (!acceptedType.includes(imageType)) {
                    coverFile.showErrorMessage = true;
                    coverFile.errorMessage = t('newsfeed.imageTypeError');
                    isFalse = false;
                }
            }
            return isFalse;
        }
    };

    const tabs = [
        {
            value: 'general',
            code: 'general',
            title: t('onlineLesson.generalInfo'),
            component: item && <Card className='m-2'>
                <Card.Body>
                    <Row style={{ display: 'flex', marginTop: '0.8rem' }}>
                        <label
                            style={{
                                display: 'flex',
                                flex: '1 1 0%',
                                justifyContent: 'flex-end',
                                alignItems: 'center',
                                marginRight: 10,
                                marginBottom: 0,
                                width: 'auto',
                                fontWeight: 'bold'
                            }}
                        >
                            {t('common.name') + "*"}
                        </label>
                        <div
                            style={{
                                display: 'flex',
                                flex: 1,
                                flexDirection: 'column',
                                marginLeft: 10,
                                width: 'auto',
                            }}
                        >
                            <input
                                className={'form-control'}
                                type='text'
                                onChange={(e) => {
                                    const clone = cloneDeep(item)
                                    clone.name = e.target.value
                                    setItem(clone)
                                }}
                                value={item?.name || ''}
                            />
                        </div>
                        <div
                            style={{
                                display: 'flex',
                                flex: 0.8,
                                flexDirection: 'column',
                                marginLeft: 10,
                                width: 'auto',
                            }}
                        />
                    </Row>
                    <Row style={{ marginTop: '0.8rem' }}>
                        <label
                            style={{
                                display: 'flex',
                                flex: '1 1 0%',
                                justifyContent: 'flex-end',
                                alignItems: 'center',
                                marginRight: 10,
                                marginBottom: 0,
                                width: 'auto',
                                fontWeight: 'bold'
                            }}
                        >
                        </label>
                        <div
                            style={{
                                display: 'flex',
                                flex: 1,
                                flexDirection: 'column',
                                marginLeft: 10,
                                width: 'auto',
                            }}
                        >
                            <Checkbox
                                className='custom-cbox eschool-checkbox'
                                checked={item?.isOpen}
                                disabled
                                onChange={() => {
                                }}
                                label={t('onlineLesson.isOpen')}
                            />
                        </div>
                        <div
                            style={{
                                display: 'flex',
                                flex: 0.8,
                                flexDirection: 'column',
                                marginLeft: 10,
                                width: 'auto',
                            }}
                        />
                    </Row>
                    {
                        !item?.isOpen &&
                        <Row style={{ marginTop: '0.8rem' }}>
                            <TabButtons key="tabs" tabKey={item?.viewType} />
                        </Row>
                    }
                    {
                        item?.viewType === 'SCHOOL' && !item?.isOpen && <Row style={{ marginTop: '0.8rem' }}>
                            <label
                                style={{
                                    display: 'flex',
                                    flex: '1 1 0%',
                                    justifyContent: 'flex-end',
                                    alignItems: 'center',
                                    marginRight: 10,
                                    marginBottom: 0,
                                    width: 'auto',
                                    fontWeight: 'bold'
                                }}
                            >
                                {t('school.title') + "*"}
                            </label>
                            <div
                                style={{
                                    display: 'flex',
                                    flex: 1,
                                    flexDirection: 'column',
                                    marginLeft: 10,
                                    width: 'auto',
                                }}
                            >
                                <Select
                                    value={item?.schools && item?.schools?.length > 0 ? item?.schools[0]?.value : null}
                                    searchable={true}
                                    disabled={true}
                                    clearable={true}
                                    options={item?.schools}
                                />
                            </div>
                            <div
                                style={{
                                    display: 'flex',
                                    flex: 0.8,
                                    flexDirection: 'column',
                                    marginLeft: 10,
                                    width: 'auto',
                                }}
                            />
                        </Row>
                    }
                    {
                        item?.grades && item?.grades?.length > 0 && item?.grades.map((gradeRowObj, gI) => {
                            return <Row key={'grade_row_' + gI}
                                style={{ marginTop: '0.8rem' }}>
                                <label
                                    style={{
                                        display: 'flex',
                                        flex: '1 1 0%',
                                        justifyContent: 'flex-end',
                                        alignItems: 'center',
                                        marginRight: 10,
                                        marginBottom: 0,
                                        width: 'auto',
                                        fontWeight: 'bold'
                                    }}
                                >
                                    {
                                        gI === 0 && t('curriculum.grade') + "*"
                                    }
                                </label>
                                <div
                                    style={{
                                        display: 'flex',
                                        flex: 0.7,
                                        flexDirection: 'column',
                                        width: 'auto',
                                        marginLeft: 10
                                    }}
                                >
                                    <Select
                                        className={''}
                                        value={gradeRowObj.value}
                                        searchable={true}
                                        disabled={true}
                                        clearable={true}
                                        options={item?.grades?.map(obj => {
                                            return {
                                                value: obj?.value,
                                                text: obj?.text
                                            }
                                        })}
                                    />
                                </div>
                                <div
                                    style={{
                                        display: 'flex',
                                        flex: 1.1,
                                        flexDirection: 'column',
                                        width: 'auto',
                                        marginLeft: 10
                                    }}
                                >
                                    <Row>
                                        <div
                                            style={{
                                                display: 'flex',
                                                flex: 0.9,
                                                flexDirection: 'column',
                                                width: 'auto'
                                            }}
                                        >
                                            <Select
                                                className={''}
                                                value={gradeRowObj?.selectedSubjects}
                                                multiple={true}
                                                searchable={true}
                                                disabled={true}
                                                clearable={true}
                                                options={gradeRowObj?.subjects}
                                            />
                                        </div>
                                        <div
                                            style={{
                                                display: 'flex',
                                                flex: 0.5,
                                                flexDirection: 'column',
                                                width: 'auto'
                                            }}
                                        >
                                        </div>
                                    </Row>
                                </div>
                            </Row>
                        })
                    }
                    {
                        item?.viewType === 'SCHOOL' && !item?.isOpen && <Row style={{ marginTop: '0.8rem' }}>
                            <label
                                style={{
                                    display: 'flex',
                                    flex: '1 1 0%',
                                    justifyContent: 'flex-end',
                                    alignItems: 'center',
                                    marginRight: 10,
                                    marginBottom: 0,
                                    width: 'auto',
                                    fontWeight: 'bold'
                                }}
                            >
                                {t('menu.group') + "*"}
                            </label>
                            <div
                                style={{
                                    display: 'flex',
                                    flex: 1,
                                    flexDirection: 'column',
                                    marginLeft: 10,
                                    width: 'auto',
                                }}
                            >
                                <Select
                                    className={''}
                                    onChange={(value, evt) => {
                                        const clone = cloneDeep(item)
                                        clone.selectedClasses = value
                                        setItem(clone)
                                    }}
                                    value={item?.selectedClasses}
                                    multiple={true}
                                    searchable={true}
                                    disabled={false}
                                    clearable={true}
                                    options={item?.classes?.map(classObj => {
                                        return {
                                            value: classObj?.id,
                                            text: classObj?.name
                                        }
                                    })}
                                />
                            </div>
                            <div
                                style={{
                                    display: 'flex',
                                    flex: 0.8,
                                    flexDirection: 'column',
                                    marginLeft: 10,
                                    width: 'auto',
                                }}
                            />
                        </Row>
                    }
                    {
                        item?.viewType !== 'SCHOOL' && !item?.isOpen &&
                        <Row style={{ marginTop: '0.8rem' }}>
                            <label
                                style={{
                                    display: 'flex',
                                    flex: '1 1 0%',
                                    justifyContent: 'flex-end',
                                    alignItems: 'center',
                                    marginRight: 10,
                                    marginBottom: 0,
                                    width: 'auto',
                                    fontWeight: 'bold'
                                }}
                            >
                                {t('menu.mainGroup') + "*"}
                            </label>
                            <div
                                style={{
                                    display: 'flex',
                                    flex: 1,
                                    flexDirection: 'column',
                                    marginLeft: 10,
                                    width: 'auto',
                                }}
                            >
                                <Select
                                    className={''}
                                    onChange={(value) => {
                                        const clone = cloneDeep(item)
                                        clone.selectedGroups = value
                                        setItem(clone)
                                    }}
                                    value={item?.selectedGroups}
                                    multiple={true}
                                    searchable={true}
                                    disabled={false}
                                    clearable={true}
                                    options={item?.groups?.map(obj => {
                                        return {
                                            value: obj?.id,
                                            text: obj?.name
                                        }
                                    })}
                                />
                            </div>
                            <div
                                style={{
                                    display: 'flex',
                                    flex: 0.8,
                                    flexDirection: 'column',
                                    marginLeft: 10,
                                    width: 'auto',
                                }}
                            />
                        </Row>
                    }
                    <Row style={{ marginTop: '0.8rem' }}>
                        <label
                            style={{
                                display: 'flex',
                                flex: '1 1 0%',
                                justifyContent: 'flex-end',
                                alignItems: 'center',
                                marginRight: 10,
                                marginBottom: 0,
                                width: 'auto',
                                fontWeight: 'bold'
                            }}
                        >
                        </label>
                        <div
                            style={{
                                display: 'flex',
                                flex: 1,
                                flexDirection: 'column',
                                marginLeft: 10,
                                width: 'auto',
                            }}
                        >
                            <Checkbox
                                className='custom-cbox eschool-checkbox'
                                checked={!!item?.isSell}
                                onChange={(e) => {
                                    const clone = cloneDeep(item)
                                    clone.isSell = !clone.isSell
                                    setItem(clone)
                                }}
                                label={t('onlineLesson.isSell')}
                            />
                        </div>
                        <div
                            style={{
                                display: 'flex',
                                flex: 0.8,
                                flexDirection: 'column',
                                marginLeft: 10,
                                width: 'auto',
                            }}
                        />
                    </Row>
                    {
                        item?.isSell && 
                        <Row style={{ display: 'flex', marginTop: '0.8rem' }}>
                            <label
                                style={{
                                    display: 'flex',
                                    flex: '1 1 0%',
                                    justifyContent: 'flex-end',
                                    alignItems: 'center',
                                    marginRight: 10,
                                    marginBottom: 0,
                                    width: 'auto',
                                    fontWeight: 'bold'
                                }}
                            >
                                {t('onlineLesson.price') + "*"}
                            </label>
                            <div
                                style={{
                                    display: 'flex',
                                    flex: 1,
                                    flexDirection: 'column',
                                    marginLeft: 10,
                                    width: 'auto',
                                }}
                            >
                                <input
                                    className={'form-control'}
                                    type='text'
                                    onChange={(e) => {
                                        const clone = cloneDeep(item)
                                        clone.price = e.target.value.replace(/[^\d.-]/g, '')
    
                                        setItem(clone)

                                    }}
                                    value={item.price}
                                />
                            </div>
                            <div
                                style={{
                                    display: 'flex',
                                    flex: 0.8,
                                    flexDirection: 'column',
                                    marginLeft: 10,
                                    width: 'auto',
                                }}
                            />
                        </Row>
                    }
                    <Row style={{ marginTop: '0.8rem' }}>
                        <label
                            style={{
                                display: 'flex',
                                flex: '1 1 0%',
                                justifyContent: 'flex-end',
                                alignItems: 'center',
                                marginRight: 10,
                                marginBottom: 0,
                                width: 'auto',
                                fontWeight: 'bold'
                            }}
                        >
                            {t('onlineLesson.description') + "*"}
                        </label>
                        <div
                            style={{
                                display: 'flex',
                                flex: 1,
                                flexDirection: 'column',
                                marginLeft: 10,
                                width: 'auto',
                                zIndex: 0,
                                overflow: 'auto'
                            }}
                        >
                            <CKEditor
                                editor={ClassicEditor}
                                data={item?.description}
                                config={{
                                    placeholder: '',
                                    width: '100%',
                                    toolbar: {
                                        items: [
                                            'heading',
                                            'MathType',
                                            'ChemType',
                                            '|',
                                            'bold',
                                            'italic',
                                            'link',
                                            'bulletedList',
                                            'numberedList',
                                            'insertTable',
                                            'blockQuote',
                                            'undo',
                                            'redo',
                                        ],
                                    },
                                }}
                                style={{
                                    width: '100%',
                                    maxWidth: '100%'
                                }}
                                onChange={(e, editor) => {
                                    const clone = cloneDeep(item)
                                    clone.description = editor.getData()
                                    setItem(clone)
                                }}
                            />
                        </div>
                        <div
                            style={{
                                display: 'flex',
                                flex: 0.8,
                                flexDirection: 'column',
                                marginLeft: 10,
                                width: 'auto',
                            }}
                        />
                    </Row>
                    <Row style={{ marginTop: '0.8rem' }}>
                        <label
                            style={{
                                display: 'flex',
                                flex: '1 1 0%',
                                justifyContent: 'flex-end',
                                alignItems: 'center',
                                marginRight: 10,
                                marginBottom: 0,
                                width: 'auto',
                                fontWeight: 'bold'
                            }}
                        >
                            {t('onlineLesson.frontPicture')}
                        </label>
                        <div
                            style={{
                                display: 'flex',
                                flex: 1,
                                flexDirection: 'column',
                                marginLeft: 10,
                                width: 'auto',
                            }}
                        >
                            <input
                                ref={fileUploaderRef}
                                style={{ display: 'none' }}
                                type='file'
                                accept={'image/png, image/jpeg'}
                                multiple={false}
                                placeholder={'Файл оруулна уу'}
                                onChange={(e) => {
                                    if (e.target.files && e.target.files) {
                                        let files = e.target.files;
                                        const verified = verifyFile(files);
                                        if (verified) {
                                            let fileNames = '';
                                            for (let i = 0; i < files.length; i++) {
                                                if (files.length == 1) {
                                                    fileNames = files[i].name;
                                                } else if (files.length == i + 1) {
                                                    fileNames = fileNames + files[i].name;
                                                } else if (files.length > 1) {
                                                    fileNames = fileNames + files[i].name + ', ';
                                                }
                                            }

                                            const clone = cloneDeep(item)
                                            clone.coverFile = {
                                                fileNames: fileNames,
                                                showErrorMessage: false,
                                                files: files
                                            }
                                            setItem(clone)
                                        }
                                    }
                                }}
                            />
                            <input
                                disabled={true}
                                className={'form-control'}
                                value={item?.coverFile?.fileNames || ''}
                            />
                        </div>
                        <div
                            style={{
                                display: 'flex',
                                flex: 0.8,
                                flexDirection: 'column',
                                marginLeft: 10,
                                width: 'auto',
                            }}
                        >
                            {
                                item?.coverFile
                                    ?
                                    <div>
                                        <Button onClick={() => {
                                            const clone = cloneDeep(item)
                                            clone.coverFile = null
                                            clone.removeCoverFile = true
                                            setItem(clone)
                                        }} className="btn btn-danger m-btn m-btn--icon m-btn--icon-only m-btn--circle-28 ms-2">
                                            <i className="flaticon2-cross"> </i>
                                        </Button>
                                    </div>
                                    :
                                    <button className={'btn btn-outline-info ml-2 w-50'}
                                        onClick={() => {
                                            if (fileUploaderRef && fileUploaderRef?.current) {
                                                fileUploaderRef.current.click();
                                            }
                                        }}>{'Файл сонгох'}</button>
                            }

                        </div>
                    </Row>

                    {
                        !item?.isOpen && <Row style={{ marginTop: '1rem' }}>
                            <label
                                style={{
                                    display: 'flex',
                                    flex: '1 1 0%',
                                    justifyContent: 'flex-end',
                                    alignItems: 'center',
                                    marginRight: 10,
                                    marginBottom: 0,
                                    width: 'auto',
                                    fontWeight: 'bold'
                                }}
                            >
                            </label>
                            <div
                                style={{
                                    display: 'flex',
                                    flex: 1,
                                    flexDirection: 'column',
                                    marginLeft: 10,
                                    width: 'auto',
                                }}
                            >
                                <Checkbox
                                    className='custom-cbox eschool-checkbox'
                                    checked={!!isManualOpen}
                                    onChange={() => {
                                        setIsManualOpen(!isManualOpen)
                                    }}
                                    label={t('onlineLesson.isManualOpen')}
                                />
                            </div>
                            <div
                                style={{
                                    display: 'flex',
                                    flex: 0.8,
                                    flexDirection: 'column',
                                    marginLeft: 10,
                                    width: 'auto',
                                }}
                            />
                        </Row>
                    }
                </Card.Body>
            </Card>
        },
        {
            value: 'category',
            code: 'category',
            title: t('onlineLesson.subCategory'),
            component: <Category />
        },
        {
            value: 'subject',
            code: 'subject',
            title: t('subject.title'),
            component: <Subject />
        }
    ]

    const modalActionDone = () => {
        setQuestionBankModal(false)
        getCourseQuestions()
    }

    const onQuestionTypeSelected = (courseExam) => {
        getCourseQuestions(courseExam)
    }

    return (
        <>
            <Card className='m-2'>
                <Card.Body className="d-flex justify-content-between align-items-center p-0 pb-3 pt-3">
                    <TabComponent
                        tabs={tabs}
                        onChange={(i, value) => onTabChange(i, value)}
                        selectedTabIndex={tabIndex}
                    />
                    <Link to="/onlineLesson/lesson">
                        <Row className="btn btn-link cursor-pointer d-flex rounded-0 p-3 mr-0 ml-0" style={{ borderBottom: '1px solid rgba(255, 91, 29, 0.5)' }}>
                            <span className='text-semi-large' style={{ color: '#ff2f1a' }}>{t("action.goBack")}</span>
                        </Row>
                    </Link>
                </Card.Body>
            </Card>
            {tabs[tabIndex].component || null}
            <Row className='d-flex justify-content-between border-top mt-4 pt-4 mr-2 ml-2 mb-4'>
                <Col md={3} />
                <Col md={6} className='d-flex justify-content-center'>
                    <Link to="/onlineLesson/lesson">
                        <Button className="cursor-pointer cancel-button pr-4" variant='link'>
                            <span style={{ color: '#ff2f1a' }}>{t("common.cancel")}</span>
                        </Button>
                    </Link>
                    <Button className='proceed-button' variant='empty' onClick={onSubmit}>
                        <span style={{ color: '#000000' }}>{t('action.next').toUpperCase()}</span>
                    </Button>
                </Col>
                <Col md={3} className='d-flex justify-content-center align-items-end'>
                    {
                        tabIndex !== 0 &&
                        <Button
                            className='save-button secondary ml-3'
                            variant='empty'
                            onClick={onPublish}
                        >
                            <span>{t("action.publish").toLocaleUpperCase()}</span>
                        </Button>
                    }
                </Col>
            </Row>
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
                contentModal &&
                <ContentSubmit
                    open={contentModal}
                    course={id}
                    courseExam={courseExamId}
                    topic={childTopic}
                    id={tempId}
                    syllabusId={syllabusId}
                    school={selectedSchool?.id}
                    types={components}
                    topicName={childName}
                    onClose={onContentClose}
                    onQuestionBank={onQuestionBankOpen}
                    questionChanged={!questionBankModal && !questionAddModal}
                    from={openFrom}
                    questions={selectedQuestions}
                    onQuestionAdd={onQuestionAddOpen}
                    onQuestionEdit={onQuestionEditOpen}
                    onQuestionTypeSelected={onQuestionTypeSelected}
                    closed={onclosed}
                    selectedRow={selectedRow}
                />
            }
            {
                questionBankModal &&
                <QuestionBankModal
                    courseId={id}
                    courseExam={courseExamId}
                    gradeSubjects={gradeSubjects}
                    // selectedGradeId={selectedGrade}
                    // selectedSubjectId={selectedSubject}
                    selectedSchool={selectedSchool}
                    onClose={onQuestionBankClose}
                    show={questionBankModal}
                    onDoneAction={modalActionDone}
                />
            }
            {
                questionAddModal &&
                <AddQuestion
                    course={id}
                    courseExam={courseExamId}
                    selectedSchool={selectedSchool}
                    onClose={onQuestionAddClose}
                    open={questionAddModal}
                    gradeSubjects={gradeSubjects}
                    selectedGradeId={selectedGrade}
                    selectedSubjectId={selectedSubject}
                    selectedSyllabusId={syllabusId}
                />
            }
            {
                questionEditModal &&
                <EditQuestion
                    open={questionEditModal}
                    id={questionId}
                    qTypes={qTypes}
                    qDifficulties={qDifficulties}
                    onClose={onQuestionEditClose}
                    linkAnswers={linkAnswers}
                    linkValues={linkValues}
                />
            }
            {
                unitModal && <UnitAdd
                    onClose={onTopicClose}
                    open={unitModal}
                    course={id}
                    tmpTopic={tmpTopic}
                    school={selectedSchool?.id}
                />
            }
            {
                topicModal && <RegularAdd
                    onClose={onTopicClose}
                    open={topicModal}
                    parentTopic={selectedCourseTopic?.id}
                    parentTopics={unitSubjectList}
                    course={id}
                    tmpTopic={tmpTopic}
                    school={selectedSchool?.id}
                    unitValue={selectedCourseTopic?.id}
                />
            }
            {
                showDeleteModal &&
                <DeleteModal
                    show={showDeleteModal}
                    onClose={onDeleteModalClose}
                    onDelete={onDelete}
                    title={t('warning.delete')}>
                    {t('warning.delete_confirmation')}
                    <br />
                    <br />
                    {t('warning.delete_confirmation_description')}
                </DeleteModal>
            }
            {
                showImportTopicModal
                && <ImportTopicModal
                    course={id}
                    existingTopics={usedMdTopics}
                    selectedSchool={selectedSchool}
                    show={showImportTopicModal}
                    isParent={importTopicParent}
                    isMdGrade={isMdGrade}
                    onClose={onImportModalClose}
                    onSubmit={onImportSubmit}
                    gradeSubjects={gradeSubjects}
                    // grade={selectedGrade}
                    // gradeName={selectedGradeName}
                    // subject={selectedSubject}
                    // subjectName={selectedSubjectName}
                    parentTopic={selectedCourseTopic?.topicId}
                    parentTopicName={selectedCourseTopic?.name}
                />
            }
            {
                showModal &&
                <ViewModal
                    show={showModal}
                    onClose={() => {
                        setShowModal(false)
                    }}
                    path={selectedPath}
                />
            }
        </>
    )
}

export default DetailSubmit

const UserIcon = () => {
    return <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M1 16.0937C1 12.9474 3.62857 10.3968 9 10.3968C14.3714 
            10.3968 17 12.9474 17 16.0937C17 16.5942 16.6348 17 16.1843 
            17H1.81569C1.3652 17 1 16.5942 1 16.0937Z" stroke="#FF4900" strokeWidth="2"
        />
        <path d="M12 4C12 5.65685 10.6569 7 9 7C7.34314 7 6 5.65685 6 4C6 
            2.34315 7.34314 1 9 1C10.6569 1 12 2.34315 12 4Z" stroke="#FF4900" strokeWidth="2"
        />
    </svg>
}

const VideoTranscodeImage = () => {
    return <svg width="76" height="103" viewBox="0 0 76 103" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M48.2227 82.5577L46.8866 88.0452L46.724 88.7246C46.3069 90.452 45.3031 92.0585 43.8397 93.3541L38.87 97.759L38.0357 98.5018C37.9226 98.5997 37.8873 98.7436 37.9438 98.8703C38.2125 99.4461 39.1315 101.041 41.4149 101.646C41.9805 101.795 41.9663 102.446 41.3937 102.573C38.672 103.154 33.773 102.849 30.4009 99.0546L33.2498 95.8473L35.5615 93.2447C37.1733 91.4597 38.3539 89.4444 39.0538 87.3139C39.2376 86.7727 39.379 86.2199 39.4991 85.6671L40.2626 81.9531L48.2227 82.552V82.5577Z" fill="#F54E65" />
        <path d="M35.9007 83.9512L33.6032 86.8188L25.1624 97.3675L24.4908 98.2081L24.816 101.669C24.8726 102.268 24.0313 102.625 23.4587 102.25L15.5269 97.0393C16.3681 95.8531 17.2942 94.5345 18.2485 93.1871C20.0936 90.5845 22.0095 87.884 23.4375 85.8744C24.7948 83.9628 25.7138 82.6729 25.7138 82.6729L35.9007 83.9512Z" fill="#F54E65" />
        <path d="M25.7136 82.6729L35.9004 83.9512L33.6029 86.8188L23.4302 85.8744C24.7875 83.9628 25.7065 82.6729 25.7065 82.6729" fill="#3A2842" />
        <path d="M48.2224 82.5578L46.8863 88.0452L39.0464 87.3197C39.2302 86.7784 39.3716 86.2257 39.4918 85.6729L40.2552 81.9589L48.2153 82.5578H48.2224Z" fill="#3A2842" />
        <path d="M22.2779 12.6377L23.3383 0.482433C18.2766 -0.818887 13.0029 0.787599 9.97012 2.05437C8.50676 2.66473 7.94118 4.1273 8.6976 5.31921L13.837 13.3805L22.2779 12.6434V12.6377Z" fill="#4E7BDE" />
        <path d="M22.469 11.1521C22.2923 11.1521 22.1085 11.106 21.9529 11.0139C21.5641 10.7836 21.4864 10.3402 21.7691 10.0236L23.6921 7.90456L19.5282 4.17335L17.4639 6.0159L19.7191 7.93338C20.0514 8.21552 20.0372 8.66464 19.6908 8.93527C19.3444 9.2059 18.793 9.19436 18.4607 8.91222L15.6471 6.51685C15.329 6.24622 15.329 5.82592 15.633 5.54953L18.8849 2.64745C19.0475 2.49774 19.2808 2.41711 19.5282 2.41711C19.7756 2.41711 20.0089 2.5035 20.1715 2.64745L25.4594 7.38055C25.7351 7.62815 25.7634 8.00245 25.5159 8.27308L23.1759 10.8584C23.0063 11.0485 22.7447 11.1463 22.4761 11.1463" fill="#3A2842" />
        <path d="M72.0674 73.1548L70.8798 80.1797H65.7686V73.5521L72.0674 73.1548Z" fill="#3455BA" />
        <path d="M65.2104 44.1688C72.9231 52.9671 75.1995 68.2029 75.7367 72.9015C75.8216 73.6846 75.1146 74.3813 74.1532 74.4504L67.0768 74.9859L65.2104 44.1688Z" fill="#3455BA" />
        <path d="M74.4146 69.6424H67.225C66.7443 69.6424 66.3555 69.3257 66.3555 68.9342C66.3555 68.5426 66.7443 68.226 67.225 68.226H74.4146C74.8953 68.226 75.2841 68.5426 75.2841 68.9342C75.2841 69.3257 74.8953 69.6424 74.4146 69.6424Z" fill="#3A2842" />
        <path d="M68.4621 72.579C67.6774 77.7325 65.8252 81.8035 62.5168 83.4215C60.3465 84.481 56.4937 84.9934 51.7289 85.0971C34.1333 85.4829 4.13801 80.3179 0.935586 76.6442C-1.60938 73.7249 1.49412 64.4487 4.78844 55.1839C6.76079 49.6332 8.80375 44.0882 9.74398 39.902C12.2465 28.7372 7.9343 16.0349 9.46835 14.4457C10.9953 12.8622 21.1611 11.7279 31.037 12.7471C31.037 12.7471 31.0369 18.4188 31.454 25.6681C45.9321 23.1749 57.0663 27.3668 63.0753 38.8195C65.804 44.0191 68.0309 52.6562 68.7024 61.0111C69.0347 65.082 68.9923 69.0781 68.4621 72.579Z" fill="#4E7BDE" />
        <path d="M68.4622 72.579C67.6775 77.7325 65.8253 81.8034 62.5169 83.4215C60.3466 84.4809 56.4938 84.9934 51.729 85.0971C41.4502 83.4503 34.2465 80.4964 36.8198 75.2796C43.1681 62.4103 60.9051 75.101 68.7026 61.0168C69.0348 65.0878 68.9924 69.0839 68.4622 72.5848" fill="#3455BA" />
        <path d="M68.4622 72.579C67.6775 77.7325 65.8253 81.8035 62.5169 83.4215C60.389 84.4579 56.6422 84.9704 51.9977 85.0913C43.5781 85.3044 32.2389 84.2161 22.363 82.6269C11.6246 80.8937 2.61823 78.5617 0.942788 76.6442C-1.07905 74.3237 0.46211 67.9841 2.83741 60.8269C3.43124 59.0361 4.0745 57.1935 4.73195 55.351C4.75316 55.2934 4.77435 55.2415 4.79555 55.184C5.63681 55.7022 6.4922 56.2031 7.36173 56.6868C9.32701 57.7924 11.356 58.8173 13.4273 59.7731C38.0499 71.1568 68.4622 72.5733 68.4622 72.5733" fill="#F54E65" />
        <path d="M68.4622 73.2873C68.4622 73.2873 68.4269 73.2873 68.4127 73.2873C68.3138 73.2873 58.2611 72.7921 45.2323 70.2873C33.1932 67.9726 16.05 63.4064 2.802 54.8269C2.42732 54.5851 2.36373 54.1417 2.66064 53.8308C2.95756 53.5256 3.50188 53.4738 3.87655 53.7157C28.7819 69.844 68.1158 71.8535 68.5046 71.8708C68.9854 71.8938 69.3458 72.2278 69.3246 72.6193C69.2964 72.9936 68.9146 73.2873 68.4622 73.2873Z" fill="#3A2842" />
        <path d="M31.7865 36.3609C31.32 36.3609 30.9312 36.0557 30.917 35.6699L30.1747 11.9698C30.1606 11.5783 30.5424 11.2558 31.0231 11.2443C31.5109 11.2385 31.8997 11.5437 31.9138 11.9352L32.656 35.6354C32.6702 36.0269 32.2885 36.3494 31.8078 36.3609H31.7865Z" fill="#3A2842" />
        <path d="M59.0101 42.2975C58.8263 42.2975 58.6355 42.2399 58.4941 42.1248C58.4234 42.0672 51.2763 36.3034 42.6022 38.169C42.2134 38.2496 41.8175 38.0653 41.7185 37.7486C41.6195 37.4319 41.8457 37.1094 42.2346 37.0288C51.7287 34.9905 59.2081 41.0364 59.5262 41.2956C59.809 41.5259 59.8019 41.9001 59.5262 42.1304C59.3848 42.2456 59.201 42.3032 59.0172 42.3032" fill="#2B253D" />
        <path d="M36.7138 25.0578C32.3662 20.152 35.5756 19.5473 38.9972 23.8025C54.9457 15.7701 58.3531 25.2824 61.3717 29.0251C64.3904 32.7679 71.9334 31.1096 71.9334 31.1096C70.0317 41.5316 54.9811 37.8407 49.5447 30.6835C44.1084 23.5204 36.7138 25.0578 36.7138 25.0578Z" fill="#3A2842" />
        <path d="M9.4682 15.1597C9.16421 15.1597 8.86725 15.0273 8.71173 14.7969C8.47844 14.4572 8.62688 14.0254 9.05104 13.8354C12.3242 12.3556 17.0253 11.6013 23.0201 11.6013H23.1191C27.5728 11.6013 31.0368 12.0331 31.1782 12.0503C31.6518 12.1079 31.977 12.4707 31.9063 12.8565C31.8356 13.2423 31.3902 13.5072 30.9166 13.4496C30.7823 13.4323 17.1596 11.7797 9.89942 15.0675C9.7651 15.1309 9.62373 15.1597 9.47527 15.1597" fill="#3A2842" />
        <path d="M65.4647 79.4369C64.885 79.4369 63.0187 79.3448 61.7179 78.1874C60.6151 77.2143 60.2263 75.792 60.5515 73.9552C60.6222 73.5694 61.0604 73.2988 61.5341 73.3564C62.0077 73.414 62.34 73.771 62.2693 74.1568C62.0219 75.5445 62.2623 76.5751 62.9833 77.2143C63.9448 78.0722 65.5212 78.0147 65.5354 78.0147C66.009 77.9974 66.4261 78.2911 66.4473 78.6769C66.4756 79.0626 66.1151 79.3966 65.6343 79.4254C65.6202 79.4254 65.5566 79.4254 65.4576 79.4254" fill="#3A2842" />
        <path d="M14.4454 70.4716C10.7623 70.4716 7.53863 68.7327 7.37603 68.6463C6.98015 68.4275 6.87414 67.9899 7.14277 67.6675C7.41141 67.345 7.94865 67.2586 8.34453 67.4717C8.38695 67.4947 12.4872 69.6885 16.2198 68.8709C18.1073 68.4563 19.6202 67.3278 20.7159 65.5082C20.928 65.157 21.4511 65.013 21.8753 65.1857C22.3065 65.3585 22.4833 65.7788 22.2712 66.1301C20.9422 68.3354 19.0546 69.7173 16.6581 70.2413C15.9158 70.4025 15.1665 70.4716 14.4383 70.4716" fill="#3A2842" />
        <path d="M13.4273 59.7789L2.8374 60.8269C3.43123 59.0361 4.07449 57.1935 4.73194 55.351L7.35473 56.6868L13.4202 59.7731L13.4273 59.7789Z" fill="#3A2842" />
        <path d="M24.4908 98.2081L24.816 101.669C24.8726 102.268 24.0313 102.625 23.4587 102.25L15.5269 97.0393C16.3681 95.8532 17.2942 94.5345 18.2485 93.1871L25.1624 97.3617L24.4908 98.2024V98.2081Z" fill="#3A2842" />
        <path d="M41.4005 102.584C38.6788 103.166 33.7798 102.861 30.4077 99.0661L33.2566 95.8589L38.8839 97.7705L38.0496 98.5133C37.9365 98.6112 37.9012 98.7552 37.9577 98.8819C38.2264 99.4577 39.1454 101.053 41.4288 101.657C41.9944 101.807 41.9873 102.458 41.4076 102.584" fill="#3A2842" />
        <path d="M38.5729 40.6161C37.4701 41.8368 35.1654 41.6295 34.4161 40.2419C33.6667 38.8542 35.0453 37.3283 36.8904 37.4952C38.7355 37.6622 39.6757 39.3954 38.5729 40.6104" fill="#F54E65" />
        <path d="M41.2242 20.578C41.2242 21.626 40.1921 22.2824 39.365 21.7584C38.5379 21.2345 38.5379 19.9216 39.365 19.3976C40.1921 18.8736 41.2242 19.53 41.2242 20.578Z" fill="#3A2842" />
        <path d="M45.2461 37.1785C49.2827 32.3705 50.7107 37.4895 50.7107 37.4895L45.2461 37.1785Z" fill="#3A2842" />
        <path d="M54.3589 39.1709C59.4418 36.0846 58.4096 40.7889 58.4096 40.7889L54.3589 39.1709Z" fill="#3A2842" />
        <path d="M47.636 44.0017C47.5723 44.0017 47.5087 43.996 47.4451 43.9845L40.8705 42.545C40.4817 42.4586 40.2555 42.1362 40.3616 41.8252C40.4676 41.5086 40.8635 41.3242 41.2452 41.4106L47.8198 42.8444C48.2086 42.9308 48.4348 43.2533 48.3287 43.5642C48.2439 43.8291 47.947 44.0017 47.6289 44.0017" fill="#2B253D" />
    </svg>
}