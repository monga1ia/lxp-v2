import { useState } from 'react'
import message from 'modules/message'
import React, { useEffect } from 'react'
import { Col, Row } from 'react-bootstrap'
import secureLocalStorage from 'react-secure-storage'
import { fetchRequest } from 'utils/fetchRequest'
import { translations } from 'utils/translations'
import { Modal } from 'react-bootstrap'
// import { teacherJournalSeasonResultView } from 'Utilities/url'

const locale = secureLocalStorage?.getItem('selectedLang') || 'mn'

const ResultSeasonResult = ({onClose, data, show}) => {

    const [loading, setLoading] = useState(false)

    const [exam, setExam] = useState({})
    const [items, setItems] = useState([])
    const [isRank, setIsRank] = useState(false)
    const [scoreTypesData, setScoreTypesData] = useState([])
    const [isPrimaryScoreType, setIsPrimaryScoreType] = useState(false)

    const [headers, setHeaders] = useState([])
    const [studentsData, setStudentsData] = useState([])
    const [filteredStudentsData, setFilteredStudentsData] = useState([])

    const [title, setTitle] = useState(data?.title || '')
    const [urlData] = useState(data?.urlData || null)

    // useEffect(() => {
    //     var searchString = window.location.search.substring(1),
    //         params = searchString.split("&"),
    //         examId = null;

    //     for (let i = 0; i < params.length; i++) {
    //         let val = params[i].split("=");
    //         if (val[0] == 'exam') {
    //             examId = val[1];
    //         } else if(val[0] == 'title'){
    //             setTitle(decodeURI(val[1]))
    //         }
    //     }

    //     if(examId){
    //         init(examId)
    //     } else {
    //         if (!location?.state?.exam) {
    //             message(translations(locale)?.exam?.notFound);
    //             navigate(-1);
    //         } else {
    //             init(location?.state?.exam)
    //         }
    //     }
    // }, [])
    
    const init = (examId) => {
        console.log('init')
        // setLoading(true)
        // fetchRequest(teacherJournalSeasonResultView, 'POST', { exam: examId })
        //     .then((res) => {
        //         if (res.success) {
        //             const { examObj, isRank, templateDetails, scoreTypeList, studentList, scoreTypeCode } = res.data
        //             setExam(examObj || {})
        //             setIsPrimaryScoreType(scoreTypeCode === 'PRIMARY')
        //             setIsRank(isRank || false)
        //             setItems(templateDetails || [])
        //             setStudentsData(studentList || [])
        //             setScoreTypesData(scoreTypeList || [])
        //             setFilteredStudentsData(studentList || [])
        //             const localHeaders = []
        //             localHeaders.push(
        //                 {
        //                     text: translations(locale)?.class_name,
        //                     field: 'className',
        //                     rowSpan: 2,
        //                     sort: true,
        //                 },
        //                 {
        //                     text: translations(locale)?.studentCode,
        //                     field: 'code',
        //                     rowSpan: 2,
        //                     sort: true,
        //                 },
        //                 {
        //                     text: translations(locale)?.studentLastName,
        //                     field: 'lastName',
        //                     rowSpan: 2,
        //                     sort: true,
        //                 },
        //                 {
        //                     text: translations(locale)?.studentFirstName,
        //                     field: 'firstName',
        //                     rowSpan: 2,
        //                     sort: true,
        //                 },
        //                 ...templateDetails?.map(el => ({
        //                     text: el?.itemName,
        //                     rowSpan: 1,
        //                     className: 'text-vertical'
        //                 }))
        //             )
        //             if (scoreTypeCode !== 'PRIMARY')
        //                 localHeaders?.push({
        //                     text: translations(locale)?.total,
        //                     field: 'studentScore',
        //                     rowSpan: 2,
        //                     sort: true,
        //                 })
        //             localHeaders?.push({
        //                 text: translations(locale)?.exam?.score,
        //                 field: 'scoreTypeName',
        //                 rowSpan: 2,
        //                 sort: true,
        //             })
        //             if (isRank)
        //                 localHeaders?.push({
        //                     text: translations(locale)?.exam?.ranking,
        //                     field: 'rank',
        //                     rowSpan: 2,
        //                     sort: true,
        //                 })
        //             if (examObj?.hasTestimonial)
        //                 localHeaders?.push({
        //                     text: translations(locale)?.studentTranscript?.title,
        //                     rowSpan: 2,
        //                 })
        //             setHeaders(localHeaders)
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

    return (
        <Modal
            size='xl'
            dimmer='blurring'
            show={show}
            onHide={onClose}
            className='doubleModal'
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton style={{padding: '1rem'}}>
                <Modal.Title className="modal-title d-flex flex-row justify-content-between w-100">
                    {title}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className='m-portlet__body'>
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
                                <tr>
                                    {
                                        items?.map((el, key) => <td className='text-right' key={key}>{el?.maxScore}</td>)
                                    }
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    filteredStudentsData?.length > 0
                                        ? filteredStudentsData?.map((el, key) => (
                                            <tr key={key} style={key % 2 === 1 ? {
                                                backgroundColor: '#f4f5f8'
                                            } : {}}>
                                                <td className='text-right'>{key + 1}</td>
                                                <td>{el?.className}</td>
                                                <td>{el?.code}</td>
                                                <td>{el?.lastName}</td>
                                                <td>{el?.firstName}</td>
                                                {
                                                    items?.map((item, key) => {
                                                        const studentItem = el?.templateDetails?.find(detail => detail?.id == item?.id)
                                                        return <td className='text-right' key={key}>{studentItem?.score}</td>
                                                    })
                                                }
                                                {
                                                    !isPrimaryScoreType &&
                                                    <td className='text-right'>{el?.studentScore}</td>
                                                }
                                                <td className='text-right'>{el?.scoreTypeName}</td>
                                                {
                                                    isRank &&
                                                    <td className='text-right'>{el?.rank}</td>
                                                }
                                                {
                                                    exam?.hasTestimonial &&
                                                    <td className='p-1' style={{ width: 300 }}>
                                                        {el?.testimonial}
                                                    </td>
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
                                                <tr>
                                                    <td>{translations(locale)?.studentBook?.max_point}</td>
                                                    <td className='text-right'>{exam?.classMax || '-'}</td>
                                                    <td className='text-right'>{exam?.femaleMax || '-'}</td>
                                                    <td className='text-right'>{exam?.maleMax || '-'}</td>
                                                </tr>
                                                <tr>
                                                    <td>{translations(locale)?.studentBook?.min_point}</td>
                                                    <td className='text-right'>{exam?.classMin || '-'}</td>
                                                    <td className='text-right'>{exam?.femaleMin || '-'}</td>
                                                    <td className='text-right'>{exam?.maleMin || '-'}</td>
                                                </tr>
                                            </>
                                        }
                                        {
                                            scoreTypesData?.map((el, key) =>
                                                <tr key={key}>
                                                    <td>{el?.name}</td>
                                                    <td className='text-right'>{el?.classCount}</td>
                                                    <td className='text-right'>{el?.femaleCount}</td>
                                                    <td className='text-right'>{el?.maleCount}</td>
                                                </tr>
                                            )
                                        }
                                    </tbody>
                                </table>
                            </Col>
                            <Col md={2} />
                        </Row>
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <button
                    className='btn m-btn--pill btn-link m-btn m-btn--custom'
                    onClick={onClose}
                    // onClick={() => navigate(urlData ? urlData.backUrl : '/assessments/season-result')}
                >
                    {translations(locale)?.back_to_list}
                </button>
            </Modal.Footer>
            {
                loading &&
                <>
                    <div className='blockUI blockOverlay' />
                    <div className='blockUI blockMsg blockPage'>
                        <div className='m-loader m-loader--brand m-loader--lg' />
                    </div>
                </>
            }
        </Modal>
    )
}

export default ResultSeasonResult