import React, { useEffect, useState } from 'react'
import message from 'modules/message'
import DTable from 'modules/DataTable/DTable'
import { Col, Row } from 'react-bootstrap'
import secureLocalStorage from 'react-secure-storage'
import { fetchRequest } from 'utils/fetchRequest'
import { translations } from 'utils/translations'
// import { teacherJournalSeasonResultView, testRequest } from 'Utilities/url'
import { Modal } from 'semantic-ui-react'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
// import { Link } from 'react-router-dom'
import PublishModal from '../modal/publish'

const locale = secureLocalStorage?.getItem('selectedLang') || 'mn'

const seasonScore = ({studentList = [], examObj = null, seasonDetails = [], scoreTypes = [], onSubmit}) => {

    const [loading, setLoading] = useState(false)
    const [viewModal, setViewModal] = useState(false)
    const [showPublishModal, setShowPublishModal] = useState(false)

    const [modalTitle, setModalTitle] = useState('')

    const [exam, setExam] = useState({})
    const [items, setItems] = useState([])
    const [modalStudent, setModalStudent] = useState([])
    const [scoreTypesData, setScoreTypesData] = useState([])
    const [isPrimaryScoreType, setIsPrimaryScoreType] = useState(false)

    const [headers, setHeaders] = useState([])
    const [studentsData, setStudentsData] = useState([])
    const [filteredStudentsData, setFilteredStudentsData] = useState([])

    const config = {
        showAllData: true,
        showPagination: false,
    }

    const studentColumns = [
        {
            dataField: 'avatar',
            text: translations(locale)?.teacher?.photo,
            sort: true,
            align: 'center',
            formatter: (cell, row) => {
                return <img width={40} height={40}
                    className='img-responsive img-circle'
                    src={cell || '/images/avatar.png'}
                    alt={`Photo of ${row?.firstName}`}
                    onError={(e) => {
                        e.target.onError = null
                        e.target.src = '/images/avatar.png'
                    }}
                />;
            }
        },
        {
            dataField: 'studentCode',
            text: translations(locale)?.studentCode,
            sort: true
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
            dataField: 'score',
            text: translations(locale)?.season_score?.performance,
            sort: true,
            align: 'right',
        },
        {
            dataField: 'scoreTypeCode',
            text: translations(locale)?.assessment,
            sort: true,
        },
        {
            dataField: 'rank',
            text: translations(locale)?.exam?.ranking,
            align: 'right',
            sort: true
        }
    ]

    useEffect(() => {
        setExam(examObj || {})
        setIsPrimaryScoreType(examObj.scoreTypeCode === 'PRIMARY') // primary bval student score haruulahgvi zuvhun vneelgeeg haruulna
        setItems(seasonDetails || [])
        setStudentsData(studentList || [])
        setScoreTypesData(scoreTypes || [])
        setFilteredStudentsData(studentList || [])
        const localHeaders = []

        localHeaders.push(
            {
                text: translations(locale)?.class_name,
                field: 'className',
                sort: true,
            },
            {
                text: translations(locale)?.studentCode,
                field: 'studentCode',
                sort: true,
            },
            {
                text: translations(locale)?.studentLastName,
                field: 'lastName',
                sort: true,
            },
            {
                text: translations(locale)?.studentFirstName,
                field: 'firstName',
                sort: true,
            },
            ...seasonDetails?.map(el => ({
                text: el?.name,
            }))
        )

        if (examObj.scoreTypeCode !== 'PRIMARY') // primary bval student score haruulahgvi zuvhun vneelgeeg haruulna
        {
            localHeaders?.push({
                text: translations(locale)?.season_score.performance,
                field: 'performance',
                sort: true,
            })
        }

        localHeaders?.push({
            text: translations(locale)?.assessment,
            field: 'assessment',
            sort: true,
        })

        if (examObj.isRank){
            localHeaders?.push({
                text: translations(locale)?.exam?.ranking,
                field: 'rank',
                sort: true,
            })
        }

        setHeaders(localHeaders)
    }, [])
    
    const handleSearch = keyword => {
        if (keyword)
            setFilteredStudentsData(studentsData?.filter(student =>
                student?.className?.toLowerCase()?.includes(keyword) ||
                student?.code?.toLowerCase()?.includes(keyword) ||
                student?.lastName?.toLowerCase()?.includes(keyword) ||
                student?.firstName?.toLowerCase()?.includes(keyword) ||
                student?.rank?.toLowerCase()?.includes(keyword) ||
                student?.scoreTypeName?.toLowerCase()?.includes(keyword) ||
                student?.studentScore?.toLowerCase()?.includes(keyword) ||
                student?.testimonial?.toLowerCase()?.includes(keyword)
            ) || [])
        else
            setFilteredStudentsData(studentsData || [])
    }

    const sortColumn = (field) => {
        const cloneHeaders = [...headers]
        const header = cloneHeaders?.find(el => el?.field == field)
        if (!header?.order || header?.order == 'desc')
            header.order = 'asc'
        else
            header.order = 'desc'
        const otherHeaders = cloneHeaders?.filter(el => el?.field != field)
        otherHeaders?.forEach(el => {
            delete el?.order
        })
        const cloneData = [...filteredStudentsData]
        cloneData?.sort((a, b) => {
            const fieldA = a?.[header?.field]
            const fieldB = b?.[header?.field]
            if (header?.order === 'asc')
                return fieldA?.toString()?.localeCompare(fieldB, undefined, { numeric: true, sensitivity: 'base' })
            else if (header?.order === 'desc')
                return fieldB?.toString()?.localeCompare(fieldA, undefined, { numeric: true, sensitivity: 'base' })
        })
        setFilteredStudentsData(cloneData)
        setHeaders(cloneHeaders)
    }

    const getSortIcon = (sort, order) => {
        if (!sort)
            return
        else if (!order)
            return <i className='order-4' />
        else if (order == 'asc')
            return <i className='caret-4-asc' />
        else if (order == 'desc')
            return <i className='caret-4-desc' />
    }

    const onScoreTypeClick = (type, colType, scoreTypeId, studentId, examId) => {

        console.log('onScoreTypeClick')
        // let params = {
        //     id: location?.state?.id,
        //     type: type, 
        //     colType: colType,
        //     scoreTypeId: scoreTypeId,
        //     student: studentId,
        // }

        // setLoading(true)
        // fetchRequest(testRequest, 'POST', params)
        //     .then((res) => {
        //         if (res.success) {
        //             const {studentList, title} = res.data;
        //             setModalStudent(studentList)
        //             setModalTitle(title);
        //             setViewModal(true);
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

    const onCloseModal = () => {
        setViewModal(false);
        setModalStudent([]);
    }

    const handleSubmit = publish => {
        onSubmit({
            publish,
        })
    }

    return (
        <>
            <div className='border-orange br-08 p-4 mb-2'>
                <Row>
                    <Col md={2} />
                    <Col>
                        <table className='table table-bordered react-bootstrap-table'>
                            <thead>
                                <tr>
                                    <th></th>
                                    <th>{translations(locale)?.class?.title}</th>
                                    <th>{translations(locale)?.class?.girls}</th>
                                    <th>{translations(locale)?.class?.boys}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    !isPrimaryScoreType &&
                                    <>
                                        <tr>
                                            <td>{translations(locale)?.season_score?.performance}</td>
                                            <td className='text-right'>{exam?.classAvg}</td>
                                            <td className='text-right'>{exam?.femaleAvg}</td>
                                            <td className='text-right'>{exam?.maleAvg}</td>
                                        </tr>
                                        <tr>
                                            <td>{translations(locale)?.season_score?.quality}</td>
                                            <td className='text-right'>{exam?.classQuality}</td>
                                            <td className='text-right'>{exam?.femaleQuality}</td>
                                            <td className='text-right'>{exam?.maleQuality}</td>
                                        </tr>
                                        <tr>
                                            <td>{translations(locale)?.season_score?.success}</td>
                                            <td className='text-right'>{exam?.classSuccess || '-'}</td>
                                            <td className='text-right'>{exam?.femaleSuccess || '-'}</td>
                                            <td className='text-right'>{exam?.maleSuccess || '-'}</td>
                                        </tr>
                                        {
                                            examObj.scoreTypeCode != 'PRIMARY' && 
                                            <tr>
                                                <td>{translations(locale)?.studentBook?.max_point}</td>
                                                <td className='text-right'><button onClick={() => onScoreTypeClick('max', 'class')} className='blue-button'>{exam?.classMax}</button></td>
                                                <td className='text-right'><button onClick={() => onScoreTypeClick('max', 'female')} className='blue-button'>{exam?.femaleMax}</button></td>
                                                <td className='text-right'><button onClick={() => onScoreTypeClick('max', 'male')} className='blue-button'>{exam?.maleMax}</button></td>
                                            </tr>
                                        }
                                        {
                                            examObj.scoreTypeCode != 'PRIMARY' && 
                                            <tr>
                                                <td>{translations(locale)?.studentBook?.min_point}</td>
                                                <td className='text-right'><button onClick={() => onScoreTypeClick('min', 'class')} className='blue-button'>{exam?.classMin || 0}</button></td>
                                                <td className='text-right'><button onClick={() => onScoreTypeClick('min', 'female')} className='blue-button'>{exam?.femaleMin || 0}</button></td>
                                                <td className='text-right'><button onClick={() => onScoreTypeClick('min', 'male')} className='blue-button'>{exam?.maleMin || 0}</button></td>
                                            </tr>
                                        }
                                    </>
                                }
                                {
                                    scoreTypesData?.map((el, key) =>
                                        <tr key={key}>
                                            <td>{el?.name}</td>
                                            <td className='text-right'>{el?.classCount ? <button onClick={() => onScoreTypeClick('scoreType', 'class', el?.id)} className='blue-button'>{el?.classCount}</button> : '-'}</td>
                                            <td className='text-right'>{el?.femaleCount ? <button onClick={() => onScoreTypeClick('scoreType', 'female', el?.id)} className='blue-button'>{el?.femaleCount}</button> : '-'}</td>
                                            <td className='text-right'>{el?.maleCount ? <button onClick={() => onScoreTypeClick('scoreType', 'male', el?.id)} className='blue-button'>{el?.maleCount}</button> : '-'}</td>
                                        </tr>
                                    )
                                }
                            </tbody>
                        </table>
                    </Col>
                    <Col md={2} />
                </Row>
            </div>
            <div className='border-orange br-08 p-4 mb-2'>
                <div className='d-flex gap-05 justify-content-end align-items-center mb-2'>
                    <button
                        style={{ height: 33, width: 33 }}
                        className='btn m-btn--icon m-btn--icon-only btn-info br-03 mx-1'
                        onClick={() => window.open(`/api/exam/result-export?exam=${exam?.id}`, '_blank')}
                    >
                        <i className='la la-file-excel-o' style={{ fontSize: 22, color: 'white' }} />
                    </button>
                    <input
                        type='text'
                        style={{ width: '15rem' }}
                        className='form-control br-08'
                        placeholder={translations(locale)?.search}
                        onChange={(e) => handleSearch(e?.target?.value?.toLowerCase())}
                    />
                </div>
                <table className='table table-bordered react-bootstrap-table'>
                    <thead>
                        <tr>
                            <th rowSpan={2}>№</th>
                            {
                                headers?.map((el, key) =>
                                    <th key={key} rowSpan={el?.rowSpan}>
                                        <span
                                            className={el?.className + ` ${el?.sort && 'pointer'}`}
                                            onClick={() => el?.sort && sortColumn(el?.field)}
                                        >
                                            {el?.text}
                                            {getSortIcon(el?.sort, el?.order)}
                                        </span>
                                    </th>
                                )
                            }
                        </tr>
                    </thead>
                    <tbody>
                        {
                            filteredStudentsData?.length > 0
                                ? filteredStudentsData?.map((el, key) => (
                                    <tr key={key}>
                                        <td className='text-right'>{key + 1}</td>
                                        <td>{el?.className}</td>
                                        <td>{el?.studentCode}</td>
                                        <td>{el?.lastName}</td>
                                        <td>{el?.firstName}</td>
                                        {
                                            items?.map((item, key) => {
                                                const studentItem = el?.seasonDetails?.find(detail => detail?.id == item?.id)
                                                return <td className='text-right' key={key}>{studentItem?.score}</td>
                                            })
                                        }
                                        {
                                            !isPrimaryScoreType &&
                                            <td className='text-right'>{el?.performance}</td>
                                        }
                                        <td className='text-right'>{el?.assessment}</td>
                                        {
                                            examObj && examObj.isRank &&
                                            <td className='text-right'>{el?.rank}</td>
                                        }
                                    </tr>
                                ))
                                : <tr>
                                    <td
                                        className='text-center'
                                        colSpan={(exam?.exTemplateQuestions?.length || 0) + 10}
                                    >
                                        {translations(locale)?.action?.emptyTable}
                                    </td>
                                </tr>
                        }
                    </tbody>
                </table>
            </div>
            <div className='m-portlet__foot d-flex justify-content-center gap-05' style={{marginTop: 30}}>
                {/* <Link
                    className='btn btn-link'
                    to={'/teacher/year'}
                >
                    {translations(locale)?.back_to_list}
                </Link> */}
                <button
                    className='btn m-btn--pill btn-success text-uppercase'
                    onClick={() => handleSubmit(0)}
                >
                    {translations(locale)?.save}
                </button>
                <button
                    className='btn m-btn--pill btn-publish text-uppercase'
                    onClick={() => setShowPublishModal(true)}
                >
                    {translations(locale)?.action?.publish}
                </button>
            </div>
            {
                viewModal && 
                <Modal
                    centered
                    open={viewModal}
                    onClose={onCloseModal}
                    className='react-modal overflow-modal'
                >
                    <div className='header'>
                        {modalTitle}
                        <button type="button" className="close" aria-label="Close" onClick={onCloseModal} >
                            <CloseRoundedIcon />
                        </button>
                    </div>
                    <div className='content'>
                        <DTable
                            locale={locale}
                            config={config}
                            data={modalStudent}
                            columns={studentColumns}
                        />
                    </div>
                    <div className='actions modal-footer'>
                        <div className='col-12 text-center'>
                            <button
                                onClick={onCloseModal}
                                className='btn btn-outline-metal m-btn--pill'
                            >
                                {translations(locale)?.close}
                            </button>
                        </div>
                    </div>
                </Modal>
            }
            {
                showPublishModal &&
                <PublishModal
                    onSubmit={() => handleSubmit(1)}
                    onClose={() => setShowPublishModal(false)}
                />
            }
            {
                loading &&
                <>
                    <div className='blockUI blockOverlay' />
                    <div className='blockUI blockMsg blockPage'>
                        <div className='m-loader m-loader--brand m-loader--lg' />
                    </div>
                </>
            }
        </>
    )
}

export default seasonScore