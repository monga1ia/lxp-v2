import { useState } from 'react'
import message from 'modules/message'
import { Col, Row } from 'react-bootstrap'
import React, { useEffect, useRef } from 'react'
import StudentViewModal from './modal/studentView'
import DTable from 'modules/DataTable/DTable'
import secureLocalStorage from 'react-secure-storage'
import { fetchRequest } from 'utils/fetchRequest'
import { translations } from 'utils/translations'
import { teacherJournalSkillView } from 'Utilities/url'
import { useLocation, useNavigate } from 'react-router'

const locale = secureLocalStorage?.getItem('selectedLang') || 'mn'

const result = () => {
    const viewLoaded = useRef(false)
    const location = useLocation()
    const navigate = useNavigate()

    const [loading, setLoading] = useState(false)

    const [title, setTitle] = useState('')
    const [items, setItems] = useState([])
    const [studentColumns, setStudentColumns] = useState([])
    const [studentsData, setStudentsData] = useState([])

    const [modalStudents, setModalStudents] = useState([])
    const [showStudentViewModal, setShowStudentViewModal] = useState(false)

    const config = {
        showFilter: true,
        showAllData: true,
        showPagination: false,
        excelExport: true,
        defaultSort: [{ dataField: 'firstName', order: 'asc' }],
    }

    const columns = [
        {
            dataField: 'className',
            text: translations(locale)?.class_name,
            sort: true
        },
        {
            dataField: 'code',
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
        }
    ]

    useEffect(() => {
        let cloneItems = [...items];
        let itemColumns = columns;
        if (cloneItems.length > 0) {
            for (let c = 0; c < cloneItems.length; c++) {
                itemColumns.push({
                    dataField: 'detail_' + cloneItems[c]?.id,
                    text: cloneItems[c]?.title,
                    sort: true,
                    sortFunc: (a, b, order) => {
                        if (order === 'asc')
                            return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' })
                        else if (order === 'desc')
                            return b.localeCompare(a, undefined, { numeric: true, sensitivity: 'base' })
                    }
                })
            }
        }
        setStudentColumns(itemColumns);
    }, [items])

    const loadView = () => {
        setLoading(true)
        fetchRequest(teacherJournalSkillView, 'POST', { skill: location?.state?.skill, edit: 0 })
            .then((res) => {
                if (res.success) {
                    const { templateDetails, students, skill } = res.data
                    setTitle(`${skill?.subjectName}, ${skill?.groupName}, ${skill?.className}, ${translations(locale)?.skill?.title}`)
                    setItems(templateDetails || [])
                    setStudentsData(students || [])
                } else {
                    message(res.data.message)
                }
                setLoading(false)
            })
            .catch(() => {
                message(translations(locale)?.err?.error_occurred)
                setLoading(false)
            })
    }

    useEffect(() => {
        if (!viewLoaded?.current) {
            viewLoaded.current = true
            loadView()
        }
    }, [])

    const renderDetailValues = (detailObj = null) => {
        let objValues = [];
        if (detailObj?.optionTypeCode === 'NUMBER') {
            let numberValues = []
            for (let st = 0; st < studentsData.length; st++) {
                const studentObj = studentsData[st];
                if (studentObj.templateDetails && studentObj.templateDetails.length > 0) {
                    for (let td = 0; td < studentObj.templateDetails.length; td++) {
                        const dtlObj = studentObj.templateDetails[td];
                        if (detailObj.id === dtlObj.id) {
                            if (dtlObj?.rawValue) {
                                numberValues.push(parseFloat(dtlObj?.rawValue))
                            }
                        }
                    }
                }
            }

            const average = numbers => numbers.reduce((p, c) => p + c, 0) / numbers.length;
            objValues.push({
                code: detailObj?.optionTypeCode,
                title: "MAX",
                value: Math.max(...numberValues)
            })
            objValues.push({
                code: detailObj?.optionTypeCode,
                title: "MIN",
                value: Math.min(...numberValues)
            })
            objValues.push({
                code: detailObj?.optionTypeCode,
                title: "AVG",
                value: average(numberValues)
            })
        } else if (detailObj?.optionTypeCode === 'INPUT') {
            let hasValueCount = 0;
            let hasNotValueCount = 0;
            let hasValueOptionStudents = []
            let hasNotValueOptionStudents = []
            for (let st = 0; st < studentsData.length; st++) {
                const studentObj = studentsData[st];
                if (studentObj.templateDetails && studentObj.templateDetails.length > 0) {
                    for (let td = 0; td < studentObj.templateDetails.length; td++) {
                        const dtlObj = studentObj.templateDetails[td];
                        if (detailObj.id === dtlObj.id) {
                            if (dtlObj?.rawValue && dtlObj?.rawValue.trim().length > 0) {
                                hasValueCount++;
                                hasValueOptionStudents.push(studentObj)
                            } else {
                                hasNotValueCount++;
                                hasNotValueOptionStudents.push(studentObj)
                            }
                        }
                    }
                }
            }
            objValues.push({
                code: detailObj?.optionTypeCode,
                title: translations(locale).skill.hasValue,
                value: hasValueCount,
                students: hasValueOptionStudents
            })
            objValues.push({
                code: detailObj?.optionTypeCode,
                title: translations(locale).skill.hasNotValue,
                value: hasNotValueCount,
                students: hasNotValueOptionStudents
            })
        } else if (detailObj?.optionTypeCode === 'RADIO' || detailObj?.optionTypeCode === 'CHECKBOX') {
            objValues = [];
            if (detailObj?.options && detailObj?.options.length > 0) {
                for (let o = 0; o < detailObj.options.length; o++) {
                    let optionStudents = []
                    for (let st = 0; st < studentsData.length; st++) {
                        const studentObj = studentsData[st];
                        if (studentObj.templateDetails && studentObj.templateDetails.length > 0) {
                            for (let td = 0; td < studentObj.templateDetails.length; td++) {
                                const dtlObj = studentObj.templateDetails[td];
                                if (detailObj.id === dtlObj.id) {
                                    if (dtlObj?.rawValue) {
                                        for (let rv = 0; rv < dtlObj.rawValue.length; rv++) {
                                            if (dtlObj.rawValue[rv].optionId === detailObj.options[o].id) {
                                                optionStudents.push(studentObj);
                                                break;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                    objValues.push({
                        code: detailObj?.optionTypeCode,
                        title: detailObj.options[o].name,
                        value: optionStudents.length,
                        students: optionStudents
                    })
                }
            }
        }
        return objValues;
    }

    const showStudents = (studentList = [], optionCode = '') => {
        if(optionCode.toLowerCase() == 'number'){
            if(studentsData.length){

            }
        } else {
            setModalStudents(studentList)
            setShowStudentViewModal(true)
        }
    }

    return (
        <div className='m-grid__item m-grid__item--fluid m-wrapper'>
            <div className='m-portlet'>
                <div className='m-portlet__head justify-content-between align-items-center pr-0 pl-4'>
                    <span className='fs-11 pinnacle-bold' style={{ color: '#ff5b1d' }}>
                        {title}
                    </span>
                    <button
                        className='btn m-btn--pill btn-link m-btn m-btn--custom'
                        onClick={() => navigate(-1)}
                    >
                        {translations(locale)?.back}
                    </button>
                </div>
                <div className='m-portlet__body'>
                    <div className='border-orange br-08 p-4 mb-2'>
                        <DTable
                            locale={locale}
                            config={config}
                            data={studentsData}
                            columns={studentColumns}
                        />
                    </div>
                    <div className='border-orange br-08 p-4 mb-2'>
                        {
                            items && items.length > 0 && items.map(itemObj => {
                                return <div className='ml-5 mb-4' key={'template_detail_' + itemObj?.id}>
                                    <span className='fs-09'><span
                                        className='label-pinnacle-bold'>{itemObj.title}</span> ({itemObj?.optionTypeName} хариулттай)</span>
                                    {
                                        renderDetailValues(itemObj).map((resultObj, r) => {
                                            return <Row className='ml-4 mt-3' key={'template_detail_options_' + r}>
                                                <Col sm={2}>{resultObj.title}</Col>
                                                <Col>
                                                    <span
                                                        className={resultObj?.value > 0 ? 'underline' : ''}
                                                        onClick={() => {
                                                            resultObj?.value > 0 && showStudents(resultObj?.students, resultObj?.code)
                                                        }}
                                                    >
                                                        {resultObj?.value}
                                                    </span>
                                                </Col>
                                            </Row>
                                        })
                                    }

                                </div>
                            })
                        }
                    </div>
                </div>
                <div className='m-portlet__foot d-flex justify-content-center gap-05'>
                    <button
                        className='btn m-btn--pill btn-outline-metal text-uppercase'
                        onClick={() => navigate(-1)}
                    >
                        {translations(locale)?.close}
                    </button>
                </div>
            </div>
            {
                loading &&
                <>
                    <div className='blockUI blockOverlay' />
                    <div className='blockUI blockMsg blockPage'>
                        <div className='m-loader m-loader--brand m-loader--lg' />
                    </div>
                </>
            }
            {
                showStudentViewModal &&
                <StudentViewModal
                    students={modalStudents}
                    onClose={() => setShowStudentViewModal(false)}
                />
            }
        </div>
    )
}

export default result