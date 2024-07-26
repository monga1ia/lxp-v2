import { React, useState, useEffect } from 'react'
import { Row, Col, Card, Button } from 'react-bootstrap';
import secureLocalStorage from 'react-secure-storage'
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import HtmlHead from 'components/html-head/HtmlHead';
import BreadcrumbList from 'components/breadcrumb-list/BreadcrumbList';
import Select from 'modules/Form/Select';
import DeleteModal from 'modules/DeleteModal';
import { useTranslation } from 'react-i18next';
import FilterIcon from 'cs-line-icons/custom/FilterIcon';
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import GroupRegisterModal from './components/GroupRegisterModal';
import ViewModal from './components/GroupViewModal';
import GroupTable from './components/GroupTable';
import { fetchRequest } from '../../utils/fetchRequest';
import message from '../../modules/message'
import { groupCreate, groupDelete, groupIndex, groupView } from '../../utils/fetchRequest/Urls';

const tableIndex = ['groups_index_table_index'];
const gradeIndex = ['groups_index_grade_index'];

const MainGroup = () => {
    const { t } = useTranslation();
    const history = useHistory();
    const { selectedSchool } = useSelector(state => state.schoolData);

    const [showAddModal, setShowAddModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedGroupId, setSelectedGroupId] = useState(null);
    const [groupData, setGroupData] = useState(null);
    const [loading, setLoading] = useState(false);

    const [curriculums, setCurriculums] = useState([]);
    const [grades, setGrades] = useState([]);
    const [schools, setSchools] = useState([]);

    const [tableData, setTableData] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [gradeId, setGradeId] = useState(secureLocalStorage?.getItem(gradeIndex) || null);
    const [subjectId, setSubjectId] = useState(null);
    const [statusId, setStatusId] = useState(null);
    const [filterGrades, setFilterGrades] = useState([]);
    const [filterSubjects, setFilterSubjects] = useState([]);
    const [filterStatuses] = useState([
        {
            value: 'active',
            text: t('menu.active'),
            code: 'active'
        },
        {
            value: 'inactive',
            text: t('menu.inActive'),
            code: 'inactive'
        }
    ]);

    const [page, setPage] = useState(secureLocalStorage?.getItem(tableIndex) ? secureLocalStorage?.getItem(tableIndex).page : 1);
    const [pageSize, setPageSize] = useState(secureLocalStorage?.getItem(tableIndex) ? secureLocalStorage?.getItem(tableIndex).pageSize : 10);
    const [search, setSearch] = useState(secureLocalStorage?.getItem(tableIndex) ? secureLocalStorage?.getItem(tableIndex).search : '');
    const [order, setOrder] = useState(secureLocalStorage?.getItem(tableIndex) ? secureLocalStorage?.getItem(tableIndex).order : 'desc');
    const [sort, setSort] = useState(secureLocalStorage?.getItem(tableIndex) ? secureLocalStorage?.getItem(tableIndex).sort : 'createdDate');

    const title = t('menu.mainGroup');
    const description = "E-learning";

    const breadcrumbs = [
        { to: "", text: "Home" },
        { to: "groups/index", text: title }
    ];

    const init = (params) => {
        setLoading(true)
        fetchRequest(groupIndex, 'POST', params)
            .then((res) => {
                if (res.success) {
                    const { groups, grades, subjects, totalCount } = res
                    if (grades && grades.length > 0) {
                        setFilterGrades(grades.map(grade => ({ value: grade.id, text: grade.name })))
                    }

                    if (subjects && subjects.length > 0) {
                        setFilterSubjects(subjects.map(subject => ({ value: subject.id, text: subject.name })))
                    }

                    setTableData(groups)
                    setTotalCount(totalCount)
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

    useEffect(() => {
        let params = {
            school: selectedSchool.id,
            grade: gradeId,
            subject: subjectId,
            status: statusId,
            page,
            pageSize,
            search,
            sort,
            order
        }

        init(params)
    }, [])

    const onCreateButton = () => {
        let params = {
            school: selectedSchool.id,
        }

        setLoading(true)
        fetchRequest(groupCreate, 'POST', params)
            .then((res) => {
                if (res.success) {
                    const curriculumList = res.curriculums;
                    const gradeList = res.grades;
                    const schoolList = res.schools;

                    if (curriculumList && curriculumList.length) {
                        setCurriculums(curriculumList.map(curriculum => ({ value: curriculum.id, text: curriculum.name, code: curriculum.code })))
                    }

                    if (gradeList && gradeList.length) {
                        setGrades(gradeList.map(grade => ({ value: grade.id, text: grade.name, code: grade.code })))
                    }

                    if (schoolList && schoolList.length) {
                        setSchools(schoolList.map(school => ({ value: school.id, text: school.name, grades: school.schoolGrades })))
                    }

                    setShowAddModal(true)
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

    const onSubmit = (params) => {
        setLoading(true)
        fetchRequest(groupCreate, 'POST', params)
            .then((res) => {
                if (res.success) {
                    setShowAddModal(false)
                    history.push({
                        pathname: '/groups/edit',
                        state: {
                            id: res.id,
                        }
                    })
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

    const onView = (id) => {
        setLoading(true)
        fetchRequest(groupView, 'POST', { group: id })
            .then((res) => {
                if (res.success) {
                    setShowViewModal(true)
                    setGroupData(res?.groupData)
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

    const handleDelete = () => {
        setLoading(true)
        fetchRequest(groupDelete, 'POST', { group: selectedGroupId })
            .then((res) => {
                if (res.success) {
                    let params = {
                        school: selectedSchool.id,
                        grade: gradeId,
                        subject: subjectId,
                        status: statusId,
                        page,
                        pageSize,
                        search,
                        sort,
                        order
                    }
            
                    init(params)
                    setShowDeleteModal(false)
                    message(res.message, true)
                    setLoading(false)
                } else {
                    message(res.message)
                    setLoading(false)
                }
            })
            .catch(() => {
                message(t('errorMessage.title'));
                setLoading(false)
            })
    }

    const onDelete = (id) => {
        setSelectedGroupId(id)
        setShowDeleteModal(true)
    }

    const closeModal = () => {
        setShowDeleteModal(false)
        setSelectedGroupId(null)
    }

    const handleDropdownChange = (value, type) => {
        if (type == 'grade') {
            setGradeId(value)
            secureLocalStorage?.setItem(gradeIndex, value);
            setFilterSubjects([])
        } else if (type == 'subject') {
            setSubjectId(value)
        } else if (type == 'status') {
            setStatusId(value)
        }

        setPage(1);

        let params = {
            school: selectedSchool.id,
            grade: type == 'grade' ? value : gradeId,
            subject: type == 'subject' ? value : subjectId,
            status: type == 'status' ? value : statusId,
            page: 1,
            pageSize,
            search,
            sort,
            order
        }

        init(params)
    }

    const handleClearAll = () => {
        setGradeId(null)
        setSubjectId(null)
        setStatusId(null)
    }

    const onSearchButton = () => {
        let params = {
            school: selectedSchool.id,
            grade: gradeId,
            subject: subjectId,
            status: statusId,
            page,
            pageSize,
            search,
            sort,
            order
        }

        init(params)
    }

    const onInteraction = (object) => {
        if (object.search) {
            setPage(object.page);
            setPageSize(object.pageSize);
            setSearch(object.search);
            setOrder(object.order)
            setSort(object.sort)

            secureLocalStorage?.setItem(tableIndex, object);

            let params = {
                school: selectedSchool.id,
                grade: gradeId,
                subject: subjectId,
                status: statusId,
                page: search == object.search ? object.page : 1,
                pageSize: object.pageSize,
                search: object.search,
                sort: object.sort,
                order: object.order
            }

            init(params)
        } else {
            setPage(object.page);
            setPageSize(object.pageSize);
            setSearch(object.search);
            setOrder(object.order)
            setSort(object.sort)

            secureLocalStorage?.setItem(tableIndex, object);

            let params = {
                school: selectedSchool.id,
                grade: gradeId,
                subject: subjectId,
                status: statusId,
                page: object.page,
                pageSize: object.pageSize,
                search: object.search,
                sort: object.sort,
                order: object.order
            }

            init(params)
        }
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
            
            <Row className="">
                <Col className="pr-0" xl="4" xxl="3">
                    <h2 className="small-title">{t('exam.filter')}</h2>
                    <Card className="mb-5">
                        <Card.Body>
                            <p className="mb-2 modal-select-title label-style">{t('exam.level')}*</p>
                            <Select
                                onChange={(e) => handleDropdownChange(e, 'grade')}
                                value={gradeId}
                                searchable
                                clearable
                                options={filterGrades}
                            />
                            <p className="my-2 modal-select-title label-style">Судлагдахуун*</p>
                            <Select
                                onChange={(e) => handleDropdownChange(e, 'subject')}
                                value={subjectId}
                                searchable
                                clearable
                                options={filterSubjects}
                            />
                            <p className="my-2 modal-select-title label-style">Төлөв</p>
                            <Select
                                onChange={(e) => handleDropdownChange(e, 'status')}
                                value={statusId}
                                searchable
                                clearable
                                options={filterStatuses}
                            />
                            <div className="col-12 text-center mb-2">
                                <button type='button' onClick={handleClearAll} className="btn btn-link clear-button cursor-pointer">{t('action.clear').toUpperCase()}</button>
                            </div>
                            <div className="col-12 text-center">
                                <button type='button' onClick={onSearchButton} className='filter-button btn w-100 d-flex flex-row justify-content-between cursor-pointer'>
                                    <FilterIcon />
                                    <span style={{ position: 'relative', top: 1 , right: 13 }}>
                                        {t('common.search').toUpperCase()}
                                    </span>
                                    <div />
                                </button>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>

                <Col xl="8" xxl="9">
                    <Button
                        onClick={onCreateButton}
                        variant="primary"
                        className="mb-2 add-button text-uppercase"
                    >
                        <ControlPointIcon style={{ color: "white", marginRight: "4px" }} className='MuiSvg-customSize'/>
                        {t('menu.createGroup')}
                    </Button>
                    <Card className="mb-5">
                        <Card.Body>
                            <GroupTable
                                tableData={tableData}
                                totalCount={totalCount}
                                onInteraction={onInteraction}
                                page={page}
                                pageSize={pageSize}
                                search={search}
                                onView={onView}
                                onDelete={onDelete}
                            />
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <GroupRegisterModal
                show={showAddModal}
                onClose={() => setShowAddModal(false)}
                onSubmit={onSubmit}
                curriculums={curriculums}
                schoolId={selectedSchool.id}
                grades={grades}
                schools={schools}
            />
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
                showViewModal && groupData &&
                <ViewModal
                    onClose={() => setShowViewModal(false)}
                    event={groupData}
                />
            }
            {
                showDeleteModal && selectedGroupId &&
                <DeleteModal
                    show={showDeleteModal}
                    onClose={closeModal}
                    onDelete={handleDelete}
                    title={t('warning.delete')}
                >
                    {t('warning.delete_confirmation')}
                    <br />
                    <br />
                    {t('warning.delete_confirmation_description')}
                </DeleteModal>
            }
        </>
    );
};

export default MainGroup;
