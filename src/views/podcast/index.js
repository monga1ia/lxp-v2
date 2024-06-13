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
import ViewIcon from "cs-line-icons/custom/ViewIcon";
import EditIcon from "cs-line-icons/custom/EditIcon";
import TrashIcon from "cs-line-icons/custom/Trash";
import InactiveIcon from "cs-line-icons/custom/InactiveIcon";
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import DTable from "modules/DataTable/DTable";
import PodcastAdd from './components/modals/add';
import PodcastEdit from './components/modals/edit';
import { fetchRequest } from '../../utils/fetchRequest';
import message from '../../modules/message'
import { podcastIndex, podcastToggleStatus, podcastDelete } from '../../utils/fetchRequest/Urls';

const tableIndex = ['podcast_index_table_index'];
const gradeIndex = ['podcast_index_grade_index'];

const PodcastIndex = () => {
    const { t } = useTranslation();
    const history = useHistory();
    const { selectedSchool } = useSelector(state => state.schoolData);

    const [loading, setLoading] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedPodcastId, setSelectedPodcastId] = useState(null);
    const [podcastData, setPodcastData] = useState(null);
    const [grades, setGrades] = useState([]);
    const [types, setTypes] = useState([]);
    const [tableData, setTableData] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [gradeId, setGradeId] = useState(secureLocalStorage?.getItem(gradeIndex) || null);
    const [statusId, setStatusId] = useState(null);
    const [filterGrades, setFilterGrades] = useState([]);
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

    const title = t('podcast.title');
    const description = "E-learning";

    const breadcrumbs = [
        { to: "", text: "Home" },
        { to: "podcast/index", text: title }
    ];

    const config = {
        showPagination: true,
        showFilter: true,
        showAllData: false,
        tableMarginLess: true,
        defaultSort: [{
            dataField: sort,
            order: order
        }],
        defaultPageOptions: {
            page: page,
            sizePerPage: pageSize,
            search: search,
        }
    }

    const contextMenus = [
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
        {
            key: "inactive",
            icon: <InactiveIcon />,
            title: t('action.setInactive'),
        }
    ];

    const columns = [
        {
            dataField: "isActive",
            text: "",
            headerStyle: () => ({
                width: 30,
            }),
            style: {
                textAlign: "center",
            },
            formatter: (cell) => {
                return <div className={`table-circle ${cell === true && "active"}`} />;
            },
        },
        {
            dataField: "coverFile",
            text: "",
            headerStyle: () => ({
                width: 30,
            }),
            style: {
                textAlign: "center",
            },
            formatter: (cell) => {
                return <img src={cell} height={40} />;
            },
        },
        {
            dataField: "userTypeName",
            text: t("podcast.lessonType"),
            sort: true,
        },
        {
            dataField: "grades",
            text: t("curriculum.grade"),
            sort: false,
            headerStyle: () => ({
                minWidth: 250,
            }),
        },
        {
            dataField: "title",
            text: t("podcast.name"),
            sort: true,
        },
        {
            dataField: "createdUser",
            text: t("common.createdUser"),
            sort: true,
        },
        {
            dataField: "createdDate",
            text: t("common.createdDate"),
            sort: true,
            align: 'left'
        },
    ];

    const onContextMenuItemClick = (id, key, row) => {
        if (key === "inactive") {
            let params = {
                school: selectedSchool.id,
                podcast: id
            }

            setLoading(true)
            fetchRequest(podcastToggleStatus, 'POST', params)
                .then((res) => {
                    if (res.success) {
                        let cloneTableData = [...tableData]

                        if (cloneTableData && cloneTableData.length > 0) {
                            for (let i = 0; i < cloneTableData.length; i++) {
                                if (res?.id == cloneTableData[i].id) {
                                    cloneTableData[i].isActive = res?.isActive
                                    cloneTableData[i].contextMenuKeys = res?.contextMenuKeys
                                }
                            }
                        }

                        setTableData(cloneTableData)
                        message(res.message, true)
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
        if (key === "edit") {
            setPodcastData(row)
            setShowEditModal(true)
        }
        if (key === "delete") {
            onDelete(id)
        }
    };

    const init = (params) => {
        setLoading(true)
        fetchRequest(podcastIndex, 'POST', params)
            .then((res) => {
                if (res.success) {
                    if (res?.grades && res?.grades.length > 0) {
                        setFilterGrades(res.grades.map(grade => ({ value: grade.id, text: grade.name })))
                    }

                    setTypes(res?.userTypes || [])
                    setTotalCount(res?.totalCount || 0)
                    setTableData(res?.list || 0)
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

    const callInit = () => {
        let params = {
            school: selectedSchool.id,
            grade: gradeId,
            status: statusId == 'active' ? 1 : (statusId == 'inactive') ? 0 : null,
            page,
            pageSize,
            search,
            sort,
            order
        }

        init(params)
    }

    useEffect(() => {
        callInit()
    }, [])

    const onCreateButton = () => {
        setShowAddModal(true)
    }

    const onSubmit = (params) => {
        setLoading(true)
        fetchRequest(podcastIndex, 'POST', params)
            .then((res) => {
                if (res.success) {

                    setShowAddModal(false)
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
        let params = {
            school: selectedSchool.id,
            podcast: selectedPodcastId
        }

        setLoading(true)
        fetchRequest(podcastDelete, 'POST', params)
            .then((res) => {
                if (res.success) {
                    callInit()
                    message(res.message, true)
                    setShowDeleteModal(false)
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
        setSelectedPodcastId(id)
        setShowDeleteModal(true)
    }

    const closeModal = () => {
        setShowDeleteModal(false)
        setSelectedPodcastId(null)
    }

    const handleDropdownChange = (value, type) => {
        if (type == 'grade') {
            setGradeId(value)
            secureLocalStorage?.setItem(gradeIndex, value);
        } else if (type == 'status') {
            setStatusId(value)
        }

        setPage(1);

        let statusValue = 1
        if (type == 'status') {
            if (value && value == 'active') {
                statusValue = 1
            } else if (value && value == 'inactive') {
                statusValue = 0
            } else {
                statusValue = null
            }
        } else {
            if (statusId == 'active') {
                statusValue = 1
            } else if (value && value == 'inactive') {
                statusValue = 0
            } else {
                statusValue = null
            }
        }

        let params = {
            school: selectedSchool.id,
            grade: type == 'grade' ? value : gradeId,
            status: statusValue,
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
        setStatusId(null)

        let params = {
            school: selectedSchool.id,
            grade: null,
            status: null,
            page,
            pageSize,
            search,
            sort,
            order
        }

        init(params)
    }

    const onSearchButton = () => {
        let params = {
            school: selectedSchool.id,
            grade: gradeId,
            status: statusId == 'active' ? 1 : (statusId == 'inactive') ? 0 : null,
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
                status: statusId == 'active' ? 1 : (statusId == 'inactive') ? 0 : null,
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
                status: statusId == 'active' ? 1 : (statusId == 'inactive') ? 0 : null,
                page: object.page,
                pageSize: object.pageSize,
                search: object.search,
                sort: object.sort,
                order: object.order
            }

            init(params)
        }
    }

    const onHandlerModalClose = (isSave) => {
        if (isSave == 1) {
            callInit()
        }
        setShowAddModal(false)
        setShowEditModal(false)
    }

    return (
        <>
            <HtmlHead title={title} description={description} />

            <div className="page-title-container">
                <Row>
                    <Col md="7">
                        <h1 className="mb-0 pb-0 display-4 relative">{title}</h1>
                        <BreadcrumbList items={breadcrumbs} />
                    </Col>
                </Row>
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
                                    <span style={{ position: 'relative', top: 1, right: 13 }}>
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
                        <ControlPointIcon style={{ color: "white", marginRight: "4px" }} />
                        {t('podcast.add')}
                    </Button>
                    <Card className="mb-5">
                        <Card.Body>
                            <DTable
                                remote
                                config={config}
                                columns={columns}
                                data={tableData}
                                totalDataSize={totalCount}
                                clickContextMenu
                                contextMenus={contextMenus}
                                onContextMenuItemClick={onContextMenuItemClick}
                                onInteraction={onInteraction}
                                individualContextMenus
                                currentPage={page}
                            />
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            {
                showAddModal &&
                <PodcastAdd
                    open={showAddModal}
                    onClose={(isSave) => onHandlerModalClose(isSave)}
                    onSubmit={onSubmit}
                    types={types}
                />
            }
            {
                showEditModal &&
                <PodcastEdit
                    open={showEditModal}
                    onClose={(isSave) => onHandlerModalClose(isSave)}
                    onSubmit={onSubmit}
                    types={types}
                    grades={filterGrades}
                    podcastData={podcastData}
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
            {
                showDeleteModal && selectedPodcastId &&
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

export default PodcastIndex;
