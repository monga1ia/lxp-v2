import message from 'modules/message'
import { Link } from 'react-router-dom'
import PublishModal from '../modal/publish'
import Textarea from 'react-textarea-autosize'
import React, { useEffect, useState, useRef } from 'react'
import secureLocalStorage from 'react-secure-storage'
import { translations } from 'utils/translations'
import { Dropdown } from "semantic-ui-react";

const locale = secureLocalStorage?.getItem('selectedLang') || 'mn'
const decimalRegex = /^\d+(\.\d{1,2})?$/

const scores = ({ studentList, exam, items, template, onSubmit, hasTestimonial }) => {
    const [students, setStudents] = useState([])
    const [studentsRef, setStudentsRef] = useState([])

    const [scoreSelectable, setScoreSelectable] = useState(exam?.scoreTypeCode === 'PRIMARY')
    const [studentsAverage, setStudentsAverage] = useState(0)
    const [itemsTotalScore, setItemsTotalScore] = useState(0)

    const [showPublishModal, setShowPublishModal] = useState(false)

    useEffect(() => {
        setStudents((studentList || []).sort((a, b) => a?.firstName?.localeCompare(b?.firstName, undefined, { numeric: true, sensitivity: 'base' })))
    }, [studentList])

    const updateStudentRefs = (list = []) => {
        const refs = []
        list?.forEach((el, index) => {
            if (el.templateDetails && el.templateDetails.length > 0) {
                const cols = []
                el.templateDetails.forEach(tObj => {
                    cols.push({
                        id: tObj.id,
                        ref: React.createRef()
                    })
                })
                refs.push({
                    index: index,
                    ref: React.createRef,
                    columns: cols
                });
            } else {
                refs.push({
                    index: index,
                    ref: React.createRef()
                })
            }
        })
        setStudentsRef(refs)
    }

    useEffect(() => {
        let total = 0
        items?.forEach(el => {
            total += parseFloat(el?.maxScore) || 0
        })
        setItemsTotalScore(total?.toFixed(2) || 0)

        items?.forEach(el => {
            let total = 0
            students?.forEach(student =>
                student?.templateDetails?.find(item => {
                    if (item?.id == el?.id)
                        total += parseFloat(item?.finalScore) || 0
                })
            )
            el.average = (total / students?.length)?.toFixed(2)
        })

        let studentTotal = 0
        students?.forEach((el, index) => {
            studentTotal += parseFloat(el?.studentScore) || 0
        })

        updateStudentRefs(students);
        setStudentsAverage((studentTotal / students?.length)?.toFixed(2) || 0)
    }, [students, items])

    const handleSubmit = publish => {
        if (!!publish && !validateFields())
            return

        onSubmit({
            publish,
            students: JSON.stringify(students)
        })
    }

    const validateFields = () => {
        let error = false
        const clone = [...students]
        const errorStudents = []
        clone?.forEach(student =>
            student?.templateDetails?.forEach(detail => {
                const item = items?.find(item => item?.id == detail?.id)
                if (!item?.isEdit) return
                const score = parseFloat(detail?.finalScore) || 0
                const min = parseFloat(item?.minScore) || 0
                const max = parseFloat(item?.maxScore) || 0
                if (score < min || score > max) {
                    detail.error = true
                    error = true
                    errorStudents.push({
                        student: student,
                        dtl: detail
                    })
                }
                else {
                    delete detail.error
                }
            })
        )
        setStudents(clone)
        if (error) {
            setShowPublishModal(false)
            return message(translations(locale)?.err?.fill_all_fields)
        }
        return true
    }

    const handleFinalScoreChange = (studentIndex, value, max) => {
        const check = value ? true : false
        if (!decimalRegex.test(value) && check) {
            if (value?.length > 1 && value?.split('')?.filter(x => x == '.')?.length == 1 && value?.endsWith('.')) { }
            else
                return
        }

        if (value > max)
            return
        const clone = [...students]
        clone[studentIndex].studentScore = value
        setStudents(clone)
    }

    const handleScoreTypeChange = (studentIndex, value) => {
        const clone = [...students]
        let takenScore = null;
        if (exam.childScoreTypes && exam.childScoreTypes.length > 0) {
            for (let st = 0; st < exam.childScoreTypes.length; st++) {

                if (value === exam.childScoreTypes[st]?.value) {
                    takenScore = exam.childScoreTypes[st].max;
                    break;
                }
            }
        }

        clone[studentIndex].studentScoreType = value
        clone[studentIndex].studentScore = takenScore
        clone[studentIndex].takenScore = takenScore
        setStudents(clone)
    }

    const handleScoreChange = (studentIndex, templateIndex, value, max) => {
        const check = value ? true : false
        if (!decimalRegex.test(value) && check) {
            if (value?.length > 1 && value?.split('')?.filter(x => x == '.')?.length == 1 && value?.endsWith('.')) { }
            else
                return
        }

        if (value > max)
            return

        let studentTotal = 0
        const clone = [...students]
        if (exam?.isPercentage) {
            clone[studentIndex].templateDetails[templateIndex].finalPerc = value
            const templateMaxScore = parseFloat(clone[studentIndex].templateDetails[templateIndex]?.maxScore || 0);
            clone[studentIndex].templateDetails[templateIndex].finalScore = value > 0 ? (templateMaxScore * (value / 100)) : 0

        } else {
            clone[studentIndex].templateDetails[templateIndex].finalScore = value
        }

        clone?.[studentIndex]?.templateDetails?.forEach(el => {
            studentTotal += parseFloat(el?.finalScore) || 0
        })
        clone[studentIndex].studentScore = studentTotal?.toFixed(2)
        setStudents(clone)
    }

    // const handleDetailScoreTypeChange = (studentIndex, templateIndex, value) => {
    //     let studentTotal = 0
    //     const clone = [...students]
    //
    //     let takenScore = null;
    //     if (exam.childScoreTypes && exam.childScoreTypes.length > 0) {
    //         for (let st = 0; st < exam.childScoreTypes.length; st++) {
    //             if (value === exam.childScoreTypes[st]?.value) {
    //                 takenScore = exam.childScoreTypes[st].min;
    //                 break;
    //             }
    //         }
    //     }
    //
    //     clone[studentIndex].templateDetails[templateIndex].studentScoreType = value
    //     clone[studentIndex].templateDetails[templateIndex].finalScore = takenScore
    //     clone?.[studentIndex]?.templateDetails?.forEach(el => {
    //         studentTotal += parseFloat(el?.finalScore) || 0
    //     })
    //     clone[studentIndex].studentScore = studentTotal?.toFixed(2)
    //     setStudents(clone)
    // }

    const handleTestimonialChange = (index, testimonial) => {
        const clone = [...students]
        clone[index].testimonial = testimonial
        setStudents(clone)
    }

    const onKeyDown = (e, index, colId) => {
        // 40 - down
        // 38 - up
        if (e.keyCode === 40 || e.keyCode === 38) {
            e.preventDefault();

            if (e.keyCode === 40) {
                if (index < (students?.length - 1)) {
                    if (colId) {
                        studentsRef[index+1]?.columns?.find(colObj => colObj?.id === colId)?.ref?.current?.focus();
                    } else {
                        studentsRef[index+1]?.ref?.current?.focus();
                    }
                }
            } else {
                if (index > 0) {
                    if (colId) {
                        studentsRef[index-1]?.columns?.find(colObj => colObj?.id === colId)?.ref?.current?.focus();
                    } else {
                        studentsRef[index-1]?.ref?.current?.focus();
                    }
                }
            }
        }
    }

    return (
        <>
            <div className='m-portlet__body'>
                <table className='table table-bordered react-bootstrap-table'>
                    <thead>
                        <tr>
                            <th rowSpan={2}>№</th>
                            <th rowSpan={2}>{translations(locale)?.class_name}</th>
                            <th rowSpan={2}>{translations(locale)?.studentCode}</th>
                            <th rowSpan={2}>{translations(locale)?.studentLastName}</th>
                            <th rowSpan={2}>{translations(locale)?.studentFirstName}</th>
                            <th>{translations(locale)?.total}</th>
                            {
                                items?.map((el, key) =>
                                    <th key={key}>{el?.itemName}</th>
                                )
                            }
                            {
                                hasTestimonial &&
                                <th rowSpan={2}>{translations(locale)?.studentTranscript?.title}</th>
                            }
                        </tr>
                        <tr>
                            <th className='text-right'>{itemsTotalScore}</th>
                            {
                                items?.map((el, key) =>
                                    <th key={key} className='text-right'>{exam?.isPercentage ? '100%' : `${el.minScore}-${el?.maxScore}`}</th>
                                )
                            }
                        </tr>
                    </thead>
                    <tbody>
                        {
                            students?.map((el, key) => {
                                return <tr key={key} style={key % 2 === 1 ? {
                                     backgroundColor: '#f4f5f8'
                                } : {}}>
                                    <td>{key + 1}</td>
                                    <td>{el?.className}</td>
                                    <td>{el?.code}</td>
                                    <td>{el?.lastName}</td>
                                    <td>{el?.firstName}</td>
                                    <td className='text-right' style={{ width: 100 }}>
                                        {
                                            template
                                                ? el?.studentScore
                                                :
                                                scoreSelectable
                                                    ?
                                                    <Dropdown
                                                        fluid
                                                        search
                                                        selection
                                                        closeOnChange
                                                        selectOnBlur={false}
                                                        options={exam?.childScoreTypes}
                                                        className='header-select'
                                                        value={el?.studentScoreType}
                                                        onChange={(e, data) => handleScoreTypeChange(key, data?.value)}
                                                    />
                                                    :
                                                    <input
                                                        ref={studentsRef[key]?.ref}
                                                        type='number'
                                                        value={el.studentScore || ''}
                                                        onWheel={(e) => e?.target?.blur()}
                                                        className={`form-control text-right`}
                                                        onKeyDown={(e) => {
                                                            onKeyDown(e, key)
                                                        }}
                                                        onChange={(e) => handleFinalScoreChange(key, e?.target?.value, 100)}
                                                    />
                                        }
                                    </td>
                                    {
                                        el?.templateDetails?.map((detail, index) => {
                                            const template = items?.find(t => t?.id == detail?.id)
                                            return <td key={index} className='p-1 text-right' style={{ width: 100 }}>
                                                {
                                                    template?.isEdit
                                                        ?
                                                        <input
                                                            ref={studentsRef[key]?.columns.find(obj => obj?.id === detail.id)?.ref}
                                                            key={index}
                                                            type='number'
                                                            onWheel={(e) => e?.target?.blur()}
                                                            value={exam?.isPercentage ? (detail?.finalPerc || '') : (detail?.finalScore || '')}
                                                            className={`${detail?.error && 'error-border'} form-control text-right`}
                                                            onChange={(e) => handleScoreChange(key, index, e?.target?.value, parseFloat(exam?.isPercentage ? 100 : template?.maxScore) || 0)}
                                                            onKeyDown={(e) => {
                                                                onKeyDown(e, key, detail?.id)
                                                            }}
                                                        />
                                                        : (exam?.isPercentage ? detail?.finalPerc : detail?.finalScore)
                                                }
                                            </td>
                                        })
                                    }
                                    {
                                        hasTestimonial &&
                                        <td className='p-1' style={{ width: 300 }}>
                                            <Textarea
                                                minRows={1}
                                                maxRows={7}
                                                value={el?.testimonial || ''}
                                                className='form-control'
                                                onChange={(e) => handleTestimonialChange(key, e?.target?.value)}
                                                onKeyDown={(e) => {
                                                    onKeyDown(e, key)
                                                }}
                                            />
                                        </td>
                                    }
                                </tr>
                            })
                        }
                    </tbody>
                    {
                        !scoreSelectable && <tfoot>
                            <tr style={{ backgroundColor: '#dfe2ea' }}>
                                <td colSpan={5} className='text-right'>{translations(locale)?.average}</td>
                                <td className='text-right'>{studentsAverage}</td>
                                {
                                    items?.map((el, key) =>
                                        <td key={key} className='text-right'>{el?.average}</td>
                                    )
                                }
                            </tr>
                        </tfoot>
                    }
                </table>
            </div>
            <div className='m-portlet__foot d-flex justify-content-center gap-05'>
                <Link
                    className='btn btn-link'
                    to={-1}
                >
                    {translations(locale)?.back}
                </Link>
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
                showPublishModal &&
                <PublishModal
                    onSubmit={() => handleSubmit(1)}
                    onClose={() => setShowPublishModal(false)}
                />
            }
        </>
    )
}

export default scores