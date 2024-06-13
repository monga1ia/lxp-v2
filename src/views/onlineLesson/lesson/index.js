import { Checkbox, FormControlLabel } from '@mui/material';
import { Grid } from '@material-ui/core'
import BreadcrumbList from 'components/breadcrumb-list/BreadcrumbList';
import Select from 'modules/Form/Select';
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Button, Card, Col, Image, Row } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { ControlPoint } from '@mui/icons-material';

import ChangeTimeIcon from 'cs-line-icons/custom/ChangeTimeIcon';
import BookIcon from 'cs-line-icons/custom/BookIcon';
import ListIcon from 'cs-line-icons/custom/ListIcon';
import CheckIcon from 'cs-line-icons/custom/CheckIcon';
import CalendarIcon from 'cs-line-icons/custom/CalendarIcon';
import UserProfileIcon from 'cs-line-icons/custom/UserProfileIcon';
import { BottomScrollListener } from 'react-bottom-scroll-listener';
import { Link, useHistory } from "react-router-dom";
import { fetchRequest } from 'utils/fetchRequest';
import message from 'modules/message';
import { toDropdownArray } from 'utils/utils';
import { useSelector } from 'react-redux';
import InactiveIcon from 'cs-line-icons/custom/InactiveIcon';
import ChartIcon from 'cs-line-icons/custom/ChartIcon';
import EditIcon from 'cs-line-icons/custom/EditIcon';
import TrashIcon from 'cs-line-icons/custom/Trash';
import DeleteModal from 'modules/DeleteModal';
import Search from 'modules/DataTable/Search'
import FilterIcon from 'cs-line-icons/custom/FilterIcon';

import Body from '../component/Body';
import ContextMenu from '../component/ContextMenu';

const Lesson = () => {
    const { t, i18n } = useTranslation()
    const history = useHistory()

    const breadcrumbs = useMemo(() => [
        { to: "", text: "Home" },
        { to: "onlineLesson/lesson", text: t('menu.onlineLesson') }
    ], [])

    const { selectedSchool } = useSelector(state => state.schoolData) || {}

    const [filterParams, setFilterParams] = useState({})

    const [gradeList, setGradeList] = useState([])
    const [subjectList, setSubjectList] = useState([])
    const [teacherList, setTeacherList] = useState([])

    const [totalCount, setTotalCount] = useState(0)
    const [page, setPage] = useState(1)
    const [morePage, setMorePage] = useState(false)

    const [filteredList, setFilteredList] = useState([])

    const [loading, setLoading] = useState(false)

    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [tempId, setTempId] = useState(null)

    const onFilterChange = (key, value) => {
        const params = { ...filterParams }

        params[key] = value

        setPage(1)
        fetchInit(params, 1, true)
        setFilterParams(params)
    }

    const filterByText = (value = '') => {
        const params = { ...filterParams }

        params.search = value

        setFilterParams(params)
    }

    const filterClear = () => {
        setFilterParams({})
        fetchInit({}, 1)
    }

    const onFilter = () => {
        setPage(1)
        fetchInit(filterParams, 1, true)
    }

    const onContextMenuItemClick = (key, row, event) => {
        if (key == 'edit') {
            history.push({
                pathname: "/onlineLesson/lesson-detail-submit",
                state: {
                    id: row.id,
                }
            })
        } else if (key === 'report') {
            window.open('/onlineLesson/report?id='+ row?.id, '_blank')
        } else if (key == 'delete') {
            setShowDeleteModal(true)
            setTempId(row.id)
        } else if (key == 'inactive') {
            setInactive(row.id)
        }
    }

    const onModalClose = () => {
        setShowDeleteModal(false)
        setTempId(false)
    }

    const activeContextMenu = useMemo(() => {
        return [
            {
                key: "inactive",
                icon: <InactiveIcon />,
                title: t('action.setInactive')
            },
            {
                key: "report",
                icon: <ChartIcon />,
                title: t('action.viewReport')
            }
        ]
    })

    const inActiveContextMenu = useMemo(() => {
        return [
            {
                key: "edit",
                icon: <EditIcon />,
                title: t('action.edit'),
            },
            {
                key: "report",
                icon: <ChartIcon />,
                title: t('action.viewReport')
            },
            {
                key: "delete",
                icon: <TrashIcon />,
                title: t('action.delete')
            }
        ]
    })

    const onDelete = () => {
        const params = {
            school: selectedSchool?.id,
            id: tempId
        }
        setLoading(true)
        fetchRequest('api/course/delete', "POST", params)
            .then(res => {
                if (res.success) {
                    onModalClose()
                    fetchInit(filterParams, page, true)
                } else {
                    message(res.message)
                    setLoading(false)
                }
            })
            .catch(e => {
                message(t('errorMessage.title'));
                setLoading(false)
            })
    }

    const setInactive = (id) => {
        const params = {
            school: selectedSchool?.id,
            course: id,
            status: 0
        }
        setLoading(true)
        fetchRequest('api/course/update_publish', "POST", params)
            .then(res => {
                if (res.success) {
                    let cloneFilteredList = [...filteredList]
                    if(cloneFilteredList && cloneFilteredList.length > 0){
                        for(let i = 0; i < cloneFilteredList.length; i++){
                            if(id == cloneFilteredList[i].id){
                                cloneFilteredList[i].isPublish = false;
                            }
                        }
                    }

                    setFilteredList(cloneFilteredList)
                    fetchInit(filterParams, page, true)
                } else {
                    message(res.message)
                    setLoading(false)
                }
            })
            .catch(e => {
                message(t('errorMessage.title'));
                setLoading(false)
            })
    }

    const fetchInit = (filterParams = {}, page = 1, isFilter = false) => {
        const params = {
            ...filterParams,
            school: selectedSchool?.id,
            page
        }
        setLoading(true)
        fetchRequest('api/course/index', "POST", params)
            .then(res => {
                if (res.success) {
                    const { courses, grades, subjects, teachers, totalCount } = res
                    if (isFilter || page > 1) {
                        if (page > 1) {
                            setPage(page)
                            let cloneFilteredList = [...filteredList]

                            if(courses && courses.length > 0){
                                for(let i = 0; i < courses.length; i++){
                                    let existing = cloneFilteredList.find(data => data.id == courses[i].id)

                                    if(!existing){
                                        cloneFilteredList.push(courses[i])
                                    }
                                }
                            }
                            setFilteredList(cloneFilteredList)
                            // setFilteredList(prev => [...prev, ...courses])
                        } else {
                            setFilteredList(courses)
                        }

                        setTotalCount(totalCount)
                        setMorePage(totalCount > (filteredList.length + courses.length))
                    }

                    setGradeList(grades)
                    setSubjectList(toDropdownArray(subjects, 'id', 'name'))
                    setTeacherList(teachers.map(obj => {
                        return {
                            value: obj.id,
                            text: obj.code + '-' + obj.firstName
                        }
                    }))

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

    const onEndReached = () => {
        if (morePage && !loading && totalCount > filteredList.length) {
            fetchInit(filterParams, page + 1)
        }
    }

    useEffect(() => {
        const listener = new AbortController()
        if (!listener.signal?.aborted) {
            fetchInit({}, 1, true)
        }
        return () => {
            listener.abort()
        }
    }, [])

    const filterList = useMemo(() => [
        {
            key: 'grade',
            value: filterParams.grade,
            text: t('curriculum.grade'),
            options: gradeList
        },
        {
            key: 'subject',
            value: filterParams.subject,
            text: t('exam.subject'),
            options: subjectList
        },
        {
            key: 'teacher',
            value: filterParams.teacher,
            text: t('teacher.title'),
            options: teacherList
        },
        {
            isButton: true,
            key: 'search',
            text: t('action.toSearch').toLocaleUpperCase(),
            onPress: onFilter,
            className: "btn filter-button d-flex justify-content-between align-items-center w-100",
            icon: <FilterIcon />
        }
    ], [
        i18n.language,
        gradeList,
        filterParams,
        teacherList,
        subjectList
    ])

    const additionalFilterList = useMemo(() => [
        {
            isCheckBox: true,
            key: 'isPublish',
            value: filterParams.isPublish,
            text: "Зөвхөн идэвхтэйг харуулах"
        },
        {
            empty: 'empty',
        },
        {
            empty: 'empty',
        },
        {
            isButton: true,
            key: 'clear',
            text: t('action.clear').toLocaleUpperCase(),
            onPress: filterClear,
            className: "btn btn-link back-button d-flex justify-content-between w-100 align-items-center m-0"
        }
    ], [
        i18n.language,
        filterParams
    ])

    const Selection = ({ obj = {} }) => {
        return <div className='d-flex flex-column md-3 p-0 mr-2 w-100'>
            <p className="modal-select-title mb-2">{obj.text}</p>
            <Select
                options={obj.options}
                disableClearable={true}
                value={obj.value}
                onChange={(value) => onFilterChange(obj.key, value)}
            />
        </div>
    }

    const FilterButton = ({ button = {} }) => {
        return <div className='d-flex flex-column md-3 p-0 mr-2 w-100'>
            <button key={button.key} type='button' className={button.className} onClick={button.onPress}>
                {button.icon ? button.icon : <div style={{ width: 24 }} />}
                {button.text}
                <div style={{ width: 24 }} />
            </button>
        </div>
    }

    const FilterCheckBox = ({ obj = {} }) => {
        return <div className='d-flex flex-column md-3 p-0 mr-2 w-100'>
            <FormControlLabel
                className='m-0'
                control={
                    <Checkbox
                        sx={{ '&.Mui-checked': { color: '#ff5b1d' }, '&:not(.Mui-checked)': { color: "#dddddd" } }}
                        checked={!!obj.value}
                        style={{ pading: 0, marginRight: '.7rem' }}
                        onChange={(e, value) => onFilterChange(obj.key, value ? 1 : 0)}
                    />
                }
                label={obj.text}
            />
        </div>
    }

    const RenderFilterList = ({ list = [] }) => {
        return list.map((obj, index) => {
            if (obj.isButton) {
                return <FilterButton button={obj} key={obj.key} />
            }

            if (obj.empty) {
                return <div key={index} className='d-flex flex-column md-3 p-0 mr-2 w-100' />
            }

            if (obj.isCheckBox) {
                return <FilterCheckBox key={index} obj={obj} />
            }
            return <Selection obj={obj} key={index} />
        })
    }

    const subjectRowList = useMemo(() => {
        return [
            {
                key: 'duration',
                icon: <ChangeTimeIcon />,
                text: t('common.minute')
            },
            {
                key: 'syllabusCount',
                icon: <BookIcon />,
                text: t('subject.title')
            },
            {
                key: 'syllabusDtlCount',
                icon: <ListIcon />,
                text: t('onlineLesson.question')
            },
            {
                key: 'examCount',
                icon: <CheckIcon />,
                text: t('teacher.exam')
            },
            {
                key: 'isPublish',
                icon: <CalendarIcon />,
                active: t('menu.active'),
                inActive: t('menu.inActive')
            },
            {
                key: 'createdUser',
                icon: <UserProfileIcon />,
                text: null
            }
        ]
    }, [])

    const SubjectList = ({ list = [] }) => {
        if (list?.length < 1) {
            return null
        }
        return <BottomScrollListener
            onBottom={onEndReached}
            offset={100}
        >
            {
                list?.map((obj, index) => {
                    return <Card className='mt-3' key={index}>
                        <Card.Body>
                            <div className='d-flex flex-row'>
                                <Image src={obj.coverFile} style={{ resize: 'block', height: '120px', marginRight: '24px' }} />
                                <Grid container spacing={2} className='m-0'>
                                    <Grid item xs={12}>
                                        <p className="modal-select-title">{obj.name}</p>
                                    </Grid>
                                    {
                                        subjectRowList.map((col, index) => {
                                            let text = col.text

                                            if (col.key == 'isPublish') {
                                                text = obj.isPublish ? col.active : col.inActive
                                            }

                                            if (col.key == 'duration' && (obj.duration == 0 || obj.duration  == null || !obj.duration)) {
                                                return null
                                            }

                                            return <Grid key={index} item lg={2} md={3} xs={4}>
                                                {col.icon} <span className='m-2'>{obj[col.key]} {col.key == 'duration' && obj.isSec ? t('common.second') : text}</span>
                                            </Grid>
                                        })
                                    }
                                </Grid>
                                <ContextMenu contextMenus={obj.isPublish ? activeContextMenu : inActiveContextMenu}
                                    row={obj} onContextMenuItemClick={onContextMenuItemClick} />
                            </div>
                        </Card.Body>
                    </Card>
                })
            }
        </BottomScrollListener>
    }

    return (
        <>
            <div className="page-title-container">
                <Row>
                    <Col md="7">
                        <h1 className="mb-0 pb-0 display-4">{t('menu.onlineLesson')}</h1>
                        <BreadcrumbList items={breadcrumbs} />
                    </Col>
                </Row>
            </div>
            <h2 className="small-title">Шүүлтүүр</h2>

            <Body className='mb-3'>
                <div className='d-flex flex-row align-items-end justify-content-between'>
                    <RenderFilterList list={filterList} />
                </div>
                <div className='d-flex flex-row align-items-center justify-content-between mt-3'>
                    <RenderFilterList list={additionalFilterList} />
                </div>
            </Body>

            <Link to="/onlineLesson/lesson-submit">
                <Button
                    variant="primary"
                    className="mb-3 add-button text-uppercase"
                >
                    <ControlPoint style={{ color: "white", marginRight: "4px" }} />
                    {t('onlineLesson.addLesson')}
                </Button>
            </Link>

            <Row className='d-flex w-100 align-items-center justify-content-between'>
                <Col lg={3}>
                    <div className='d-flex flex-row align-items-center'>
                        <Search
                            onSearch={onFilter}
                            value={filterParams.search || ''}
                            setter={filterByText}
                        />
                    </div>
                </Col>
                <Col lg={3} className='d-flex align-items-center justify-content-end'>
                    <p className="modal-select-title">{t('total.title')}: {totalCount || 0}</p>
                </Col>
            </Row>

            <SubjectList list={filteredList} />
            {
                showDeleteModal &&
                <DeleteModal
                    show={showDeleteModal}
                    onClose={onModalClose}
                    onDelete={onDelete}
                    title={t('warning.delete')}>
                    {t('warning.delete_confirmation')}
                    <br />
                    <br />
                    {t('warning.delete_confirmation_description')}
                </DeleteModal>
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
        </>
    )
}

export default Lesson
