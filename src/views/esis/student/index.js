import message from 'modules/message'
import EditModal from './modals/edit'
import CreateModal from './modals/create'
import Table from './components/table'
import {Col, Row} from 'react-bootstrap'
import DeleteModal from 'utils/deleteModal'
import InputTable from './components/inputTable'
import secureLocalStorage from 'react-secure-storage'
import {fetchRequest} from 'utils/fetchRequest'
import {NDropdown as Dropdown} from 'widgets/Dropdown'
import React, {useEffect, useRef, useState} from 'react'
import SyncRoundedIcon from '@mui/icons-material/SyncRounded'
import { useTranslation } from 'react-i18next'
import HtmlHead from 'components/html-head/HtmlHead';
import BreadcrumbList from 'components/breadcrumb-list/BreadcrumbList';
import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded'
// import {ESISStudentInit, ESISStudentSubmit, ESISStudentDelete, ESISStudentSync, ESISStudentLink} from 'utils/fetchRequest/Urls'

const locale = secureLocalStorage?.getItem('selectedLang') || 'mn'

const index = () => {

    const { t } = useTranslation()
    const inputTableRef = useRef()
    const [loading, setLoading] = useState(false)

    const [insertMode, setInsertMode] = useState(false)
    const [filter, setFilter] = useState({})

    const title = t('menu.esis.student');
    const description = "E-learning";
    const breadcrumbs = [
        { to: "", text: "Home" },
        { to: "esis/student", text: title }
    ];

    const [tableData, setTableData] = useState([])
    const [dummyData, setDummyData] = useState([
        {id: 123, esisId: '123', esisGradeName: 'Baa', esisClassName: 'asdf', esisLastName: 'asdf', esisFirstName: 'asdfe', esisBirthDay: 'asdfe', esisGender: 'asdf',
            eschoolClassName: 'asdf', eschoolStudentCode: '213', eschoolLastName: 'Mas', eschoolFirstName: '123', eschoolGender: 'M'},
        {id: 123, eschoolId: 123, esisId: '123', esisGradeName: 'Baa', esisClassName: 'asdf', esisLastName: 'asdf', esisFirstName: 'asdfe', esisBirthDay: 'asdfe', esisGender: 'asdf',
            eschoolClassName: 'asdf', eschoolStudentCode: '213', eschoolLastName: 'Mas', eschoolFirstName: '123', eschoolGender: 'M'},
        {id: 123, eschoolId: '', esisId: '123', esisGradeName: 'Baa', esisClassName: 'asdf', esisLastName: 'asdf', esisFirstName: 'asdfe', esisBirthDay: 'asdfe', esisGender: 'asdf',
            eschoolClassName: 'asdf', eschoolStudentCode: '213', eschoolLastName: 'Mas', eschoolFirstName: '123', eschoolGender: 'M'},
    ])
    const [totalCount, setTotalCount] = useState([])
    const [selectedTableData, setSelectedTableData] = useState(null)

    const [showEditModal, setShowEditModal] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)

    const [eschoolClasses, setEschoolClasses] = useState([])
    const [updateTable, setUpdateTable] = useState(false)

    const [gradeOptions, setGradeOptions] = useState([])
    const [classOptions, setClassOptions] = useState([])
    const [statusOptions, setStatusOptions] = useState([])

    const [showCreateStudent, setShowCreateStudent] = useState(false)

    const loadInit = () => {
        console.log('load initialization')
        // setLoading(true)
        // fetchRequest(ESISStudentInit, 'POST')
        //     .then((res) => {
        //         if (res.success) {
        //             const {statuses, students, grades, classes} = res.data

        //             setEschoolClasses(res?.data?.eschoolClasses)
        //             setTotalCount(students.length)
        //             setStatusOptions(statuses)
        //             setGradeOptions(grades)
        //             setClassOptions(classes)
        //             setTableData(students || [])
        //         } else {
        //             message(res.data.message)
        //         }
        //         setLoading(false)
        //     })
        //     .catch(() => {
        //         message(t('err.error_occurred'))
        //         setLoading(false)
        //     })
    }

    useEffect(() => {
        loadInit()
    }, [])

    const handleFilter = () => {

        const studentList = [...tableData]

        let rows = []
        for (let st = 0; st < studentList.length; st++) {
            const studentObj = studentList[st]

            let addInRow = true
            if (filter?.status) {
                if (filter.status === 'CONNECTED') {
                    if (!studentObj.eschoolId || studentObj.eschoolId.length === 0) {
                        addInRow = false
                    }
                } else if (filter.status === 'NOT_CONNECTED') {
                    if (studentObj.eschoolId && studentObj.eschoolId.length > 0) {
                        addInRow = false
                    }
                }
            }
            if (filter.grade) {
                if (filter.grade !== studentObj.esisAcademicLevel) {
                    addInRow = false
                }
            }
            if (filter.class) {
                if (filter.class !== studentObj.esisGroupId) {
                    addInRow = false
                }
            }

            if (addInRow) {
                rows.push(studentObj)
            }
        }

        return rows
    }

    const handleSubmit = students => {
        console.log('handle submit')
        // setLoading(true)
        // fetchRequest(ESISStudentSubmit, 'POST', {students})
        //     .then((res) => {
        //         if (res.success) {
        //             setInsertMode(false)

        //             const newList = [];
        //             if (res?.data?.newStudentList && res?.data?.newStudentList?.length > 0) {
        //                 for (let d = 0; d < tableData?.length; d++) {
        //                     let rowObj = tableData[d];
        //                     let studentObj = null;
        //                     for (let st = 0; st < res?.data?.newStudentList?.length; st++) {
        //                         const studentRowObj = res?.data?.newStudentList[st];
        //                         if (studentRowObj?.id === rowObj?.id) {
        //                             studentObj = studentRowObj;
        //                             break;
        //                         }
        //                     }
        //                     if (studentObj) {
        //                         rowObj = studentObj;
        //                     }
        //                     newList.push(rowObj)
        //                 }

        //                 setTableData(newList)
        //                 setUpdateTable(true)
        //             }
        //         } else {
        //             message(res.data.message)
        //         }
        //         setLoading(false)
        //     })
        //     .catch(() => {
        //         message(t('err.error_occurred'))
        //         setLoading(false)
        //     })
    }

    const handleDelete = () => {
        console.log('handle delete')
        // setLoading(true)
        // fetchRequest(ESISStudentDelete, 'POST', {
        //     esisPersonId: selectedTableData?.id,
        //     student: selectedTableData?.eschoolId
        // })
        //     .then((res) => {
        //         if (res.success) {
        //             const {esisPersonId} = res.data
        //             message(res.data.message, res.success)

        //             let studentList = [...tableData];
        //             for (let st = 0; st < studentList.length; st++) {
        //                 if (studentList[st].id.toString() === esisPersonId.toString()) {
        //                     studentList[st].eschoolId = null;
        //                     studentList[st].eschoolClassName = null;
        //                     studentList[st].eschoolStudentCode = null;
        //                     studentList[st].eschoolLastName = null;
        //                     studentList[st].eschoolFirstName = null;
        //                     studentList[st].eschoolGender = null;
        //                     studentList[st].eschoolRegistrationNumber = null;
        //                     break;
        //                 }
        //             }
        //             setTableData(studentList)
        //             setUpdateTable(true)
        //             closeModal()
        //         } else {
        //             message(res.data.message)
        //         }
        //         setLoading(false)
        //     })
        //     .catch(() => {
        //         message(t('err.error_occurred'))
        //         setLoading(false)
        //     })
    }

    const submitCreate = (students = []) => {
        console.log('submit create')
        // fetchRequest(ESISStudentSubmit, 'POST', {students})
        //     .then((res) => {
        //         if (res.success) {
        //             closeCreateModal()
        //             const newList = [];
        //             if (res?.data?.newStudentList && res?.data?.newStudentList?.length > 0) {
        //                 for (let d = 0; d < tableData?.length; d++) {
        //                     let rowObj = tableData[d];
        //                     let studentObj = null;
        //                     for (let st = 0; st < res?.data?.newStudentList?.length; st++) {
        //                         const studentRowObj = res?.data?.newStudentList[st];
        //                         if (studentRowObj?.id === rowObj?.id) {
        //                             studentObj = studentRowObj;
        //                             break;
        //                         }
        //                     }
        //                     if (studentObj) {
        //                         rowObj = studentObj;
        //                     }
        //                     newList.push(rowObj)
        //                 }

        //                 setTableData(newList)
        //                 setUpdateTable(true)
        //             }
        //         } else {
        //             message(res.data.message)
        //         }
        //         setLoading(false)
        //     })
        //     .catch(() => {
        //         message(t('err.error_occurred'))
        //         setLoading(false)
        //     })
    }

    const handleSync = () => {
        console.log('handle sync')
        // setLoading(true)
        // fetchRequest(ESISStudentSync, 'POST')
        //     .then((res) => {
        //         if (res.success) {
        //             const {students} = res.data
        //             message(res.data.message, res.success)
        //             setTableData(students || [])
        //         } else {
        //             message(res.data.message)
        //         }
        //         setLoading(false)
        //     })
        //     .catch(() => {
        //         message(t('err.error_occurred'))
        //         setLoading(false)
        //     })
    }

    const handleEdit = param => {
        console.log('handle edit')
        // setLoading(true)
        // fetchRequest(ESISStudentLink, 'POST', {...param, submit: 1})
        //     .then((res) => {
        //         if (res.success) {
        //             const {
        //                 esisId, eschoolId, eschoolLastName, eschoolFirstName,
        //                 eschoolClassName, eschoolGender, eschoolRegistrationNumber, eschoolStudentCode
        //             } = res.data
        //             message(res.data.message, res.success)

        //             const students = [...tableData];
        //             for (let st = 0; st < students.length; st++) {
        //                 if (students[st].id.toString() === (esisId || '').toString()) {
        //                     students[st].eschoolId = eschoolId;
        //                     students[st].eschoolStudentCode = eschoolStudentCode;
        //                     students[st].eschoolClassName = eschoolClassName;
        //                     students[st].eschoolGender = eschoolGender;
        //                     students[st].eschoolFirstName = eschoolFirstName;
        //                     students[st].eschoolLastName = eschoolLastName;
        //                     students[st].eschoolRegistrationNumber = eschoolRegistrationNumber;
        //                 }
        //             }
        //             setTableData(students || []);
        //             setUpdateTable(true)
        //             closeModal()
        //         } else {
        //             message(res.data.message)
        //         }
        //         setLoading(false)
        //     })
        //     .catch(() => {
        //         message(t('err.error_occurred'))
        //         setLoading(false)
        //     })
    }

    const openModal = (modal, row) => {
        if (!modal || !row)
            return
        setSelectedTableData(row)
        if (modal === 'delete')
            setShowDeleteModal(true)
        else if (modal === 'edit')
            setShowEditModal(true)
    }

    const closeModal = () => {
        setShowEditModal(false)
        setShowDeleteModal(false)
        setSelectedTableData(null)
    }

    const closeCreateModal = () => {
        setShowCreateStudent(false)
    }

    const gradeFilterClasses = () => {
        let filtered = [];
        for (let c = 0; c < classOptions.length; c++) {
            if (classOptions[c].grade === filter?.grade) {
                filtered.push(classOptions[c]);
            }
        }

        return filtered
    }

    const handleFilterChange = (name, value) => {
        if (name === 'grade') {
            if (value === null || value === '') {
                setFilter({...filter, ['grade']: '', ['class']: ''})
            } else {
                setFilter({...filter, ['grade']: value})
            }
        } else {
            setFilter({...filter, [name]: value})
        }

    }

    const filterNonStudent = (list) => {
        return list.filter(obj => {
            return !obj.eschoolId || obj.eschoolId.length === 0
        })
    }

    const onTableRendered = () => {
        const clone = [...tableData];
        setTableData([])
        setTimeout(() => {
            setTableData(clone)
        }, 100)
        setUpdateTable(false)
    }

    const loadFilterStudents = (esisGradeId = null, esisGroupId = null) => {
        const studentList = [...tableData]

        let rows = []
        for (let st = 0; st < studentList.length; st++) {
            const studentObj = studentList[st]

            let add = false;
            if (!studentObj?.eschoolId || studentObj.eschoolId?.length === 0) {
                if (esisGradeId) {
                    if (esisGroupId) {
                        if (studentObj?.esisGroupId?.toString() === esisGroupId?.toString()) {
                            add = true;
                        }
                    } else {
                        if (studentObj?.esisAcademicLevel?.toString() === esisGradeId?.toString()) {
                            add = true;
                        }
                    }
                } else {
                    if (esisGroupId) {
                        if (studentObj?.esisGroupId?.toString() === esisGroupId?.toString()) {
                            add = true;
                        }
                    }
                }
            }
            if (add) {
                rows.push(studentObj)
            }
        }
        return rows
    }

    return (
        <div className='m-grid__item m-grid__item--fluid m-wrapper'>
            <HtmlHead title={title} description={description} />

            <div className="page-title-container mb-2">
                <Col md="7" className='p-0'>
                    <h1 className="mb-0 pb-0 display-4 relative">{title}</h1>
                    <BreadcrumbList items={breadcrumbs} />
                </Col>
            </div>
            <div className='m-content'>
                {/* {*/}
                {/*    insertMode*/}
                {/*        ? <div className='mb-3 d-flex gap-04'>*/}
                {/*            <button*/}
                {/*                className='btn btn-success m-btn--pill text-uppercase'*/}
                {/*                onClick={() => inputTableRef?.current?.submit()}*/}
                {/*            >*/}
                {/*                {t('save')}*/}
                {/*            </button>*/}
                {/*            <button*/}
                {/*                className='btn btn-link'*/}
                {/*                onClick={() => setInsertMode(false)}*/}
                {/*            >*/}
                {/*                {t('back')}*/}
                {/*            </button>*/}
                {/*        </div>*/}
                {/*        : */}
                {/*} */}

                <>
                    <div className='d-flex justify-content-between align-items-center mb-3'>
                        {/*<div className={'d-inline-flex'}>*/}
                        {/*    {*/}
                        {/*        filterNonStudent(tableData).length > 0 && <button*/}
                        {/*            className='btn btn-sm m-btn--pill btn-info m-btn--uppercase d-inline-flex'*/}
                        {/*            onClick={() => setInsertMode(true)}*/}
                        {/*        >*/}
                        {/*            <AddCircleOutlineRoundedIcon className='MuiSvg-customSize'/>*/}
                        {/*            <span className='ml-2'>{t('esis.createStudent')}</span>*/}
                        {/*        </button>*/}
                        {/*    }*/}
                        {/*</div>*/}
                        {
                            filterNonStudent(dummyData).length > 0 && <button
                            // filterNonStudent(tableData).length > 0 && <button
                                className='btn btn-sm m-btn--pill btn-info m-btn--uppercase d-inline-flex'
                                onClick={() => {
                                    setShowCreateStudent(true)
                                }}
                            >
                                <AddCircleOutlineRoundedIcon className='MuiSvg-customSize'/>
                                <span className='ml-2'>{t('esis.createStudent')}</span>
                            </button>
                        }

                        <button
                            style={{backgroundColor: '#009cff'}}
                            className='btn btn-sm m-btn--pill m-btn--uppercase d-inline-flex text-white'
                            onClick={loadInit}
                        >
                            <SyncRoundedIcon/>
                            <span className='ml-2'>SYNC</span>
                        </button>
                    </div>
                    <div className='m-portlet br-12'>
                        <div className='m-portlet__body'>
                            <Row>
                                <Col md={1}>
                                </Col>
                                <Col>
                                    <Row>
                                        <Col md={3} className='col-form-label text-right label-pinnacle-bold'>
                                            {t('status')}
                                        </Col>
                                        <Col>
                                            <Dropdown
                                                fluid
                                                clearable
                                                search
                                                selection
                                                closeOnChange
                                                options={statusOptions}
                                                value={filter?.status}
                                                placeholder={'-' + t('select') + '-'}
                                                onChange={(e, data) => handleFilterChange('status', data?.value)}
                                            />
                                        </Col>
                                    </Row>
                                </Col>
                                <Col>
                                    <Row>
                                        <Col md={3} className='col-form-label text-right label-pinnacle-bold'>
                                            {t('className')}
                                        </Col>
                                        <Col>
                                            <Dropdown
                                                fluid
                                                clearable
                                                search
                                                selection
                                                closeOnChange
                                                options={gradeOptions}
                                                value={filter?.grade}
                                                placeholder={'-' + t('select') + '-'}
                                                onChange={(e, data) => handleFilterChange('grade', data?.value)}
                                            />
                                        </Col>
                                    </Row>
                                </Col>
                                <Col>
                                    <Row>
                                        <Col md={3} className='col-form-label text-right label-pinnacle-bold'>
                                            {t('class_name')}
                                        </Col>
                                        <Col>
                                            <Dropdown
                                                fluid
                                                clearable
                                                search
                                                selection
                                                closeOnChange
                                                options={gradeFilterClasses()}
                                                value={filter?.class}
                                                placeholder={'-' + t('select') + '-'}
                                                onChange={(e, data) => handleFilterChange('class', data?.value)}
                                            />
                                        </Col>
                                    </Row>
                                </Col>
                                <Col md={1}>
                                    {/*<button*/}
                                    {/*    className='btn m-btn--pill text-uppercase d-inline-flex align-content-center justify-content-center'*/}
                                    {/*    style={{backgroundColor: '#41c5dc', color: 'white'}}*/}
                                    {/*    onClick={handleFilter}*/}
                                    {/*>*/}
                                    {/*    <QueryStatsRoundedIcon/>*/}
                                    {/*    <span className='ml-2'>{t('view')}</span>*/}
                                    {/*</button>*/}
                                </Col>
                            </Row>
                        </div>
                    </div>
                </>
                <div className='m-portlet br-12'>
                    <div className='m-portlet__body'>
                        {
                            insertMode
                                ? <InputTable
                                    data={filterNonStudent(tableData)}
                                    ref={inputTableRef}
                                    onSubmit={handleSubmit}
                                    classOptions={classOptions}
                                    eschoolClasses={eschoolClasses}
                                />
                                : <Table
                                    // data={handleFilter()}
                                    data={dummyData}
                                    openModal={openModal}
                                    updateTable={updateTable}
                                    onTableRender={onTableRendered}
                                />
                        }
                    </div>
                </div>
            </div>
            {
                showEditModal && selectedTableData?.id &&
                <EditModal
                    onClose={closeModal}
                    onSubmit={handleEdit}
                    esisStudent={selectedTableData}
                    eschoolClasses={eschoolClasses}
                />
            }
            {
                showDeleteModal && selectedTableData?.id &&
                <DeleteModal
                    onClose={closeModal}
                    onDelete={handleDelete}
                    locale={locale}
                    title={t('delete')}
                >
                    {t('delete_confirmation')}
                    <br/>
                    <br/>
                    {t('delete_confirmation_description')}
                </DeleteModal>
            }
            {
                showCreateStudent &&
                <CreateModal
                    onClose={closeCreateModal}
                    onSubmit={submitCreate}
                    grades={gradeOptions}
                    classes={eschoolClasses}
                    onFilter={loadFilterStudents}
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
        </div>
    )
}

export default index