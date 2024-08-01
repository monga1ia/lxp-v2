import message from 'modules/message'
// import {Link} from 'react-router-dom'
import PublishModal from '../modal/publish'
import Textarea from 'react-textarea-autosize'
import React, {useEffect, useState} from 'react'
import secureLocalStorage from 'react-secure-storage'
import {translations} from 'utils/translations'
import {Checkbox, Dropdown} from "semantic-ui-react";
import {fetchRequest} from "utils/fetchRequest";
// import {teacherYearResultEdit} from "Utilities/url";
// import ResultInformation from "Src/Components/teacher/year/pages/components/resultInformation";
// import ExamOptions from "Src/Components/teacher/year/pages/components/examOptions";
// import Skills from "Src/Components/teacher/year/pages/components/skill";

const locale = secureLocalStorage?.getItem('selectedLang') || 'mn'
const decimalRegex = /^\d+(\.\d{1,2})?$/

const scores = ({exam, group, season, items, onSubmit, scoreTypes, hasTestimonial}) => {
    const [students, setStudents] = useState([])
    const [studentsRef, setStudentsRef] = useState([])
    const [showPublishModal, setShowPublishModal] = useState(false)

    const [scoreSelectable, setScoreSelectable] = useState(exam?.scoreTypeCode === 'PRIMARY')

    const [loading, setLoading] = useState(false)
    const [itemsTotalScore, setItemsTotalScore] = useState(0)

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

    const loadInit = (itemList = []) => {
        console.log('loadInit')
        // setLoading(true)
        // fetchRequest(teacherYearResultEdit, 'POST', {
        //     exam: exam?.id,
        //     group,
        //     season
        // })
        //     .then((res) => {
        //         if (res.success) {
        //             const stList = (res?.data?.students || []).sort((a, b) => a?.firstName?.localeCompare(b?.firstName, undefined, {
        //                 numeric: true,
        //                 sensitivity: 'base'
        //             }))
        //             setStudents(stList)

        //             let total = 0
        //             itemList?.forEach(el => {
        //                 total += parseFloat(el?.maxScore) || 0
        //             })
        //             setItemsTotalScore(total?.toFixed(2) || 0)

        //             itemList?.forEach(el => {
        //                 let total = 0
        //                 stList?.forEach(student =>
        //                     student?.templateDetails?.find(item => {
        //                         if (item?.id == el?.id)
        //                             total += parseFloat(item?.finalScore) || 0
        //                     })
        //                 )
        //                 el.average = (total / students?.length)?.toFixed(2)
        //             })

        //             updateStudentRefs(stList);
        //         } else {
        //             message(res.data.message)
        //         }
        //         setLoading(false)
        //     })
        //     .catch((e) => {
        //         message(translations(locale)?.err?.error_occurred)
        //         setLoading(false)
        //     })
    }

    useEffect(() => {
        loadInit(items)
    }, [items])

    const handleSubmit = publish => {
        if (!!publish && !validateFields()) {
            return
        }

        onSubmit({
            exam: exam?.id,
            publish,
            students: JSON.stringify(students)
        })
    }

    const handlePublishSubmit = () => {
        if (!validateFields()) {
            return
        }

        setShowPublishModal(true)
    }

    const validateFields = () => {
        let error = false
        const clone = [...students]
        clone?.forEach(student => {
            if (!student?.checked) {
                return
            } else {
                let score = '';
                if (student.studentScore !== '' && student.studentScore !== undefined) {
                    score = parseFloat(student.studentScore);
                }
                if (score === '' || score === undefined) {
                    student.error = true
                    error = true
                } else {
                    delete student.error
                }
            }
        })

        setStudents(clone)
        if (error) {
            setShowPublishModal(false)
            return message(translations(locale)?.err?.fill_all_fields)
        }
        return true
    }

    const handleFinalScoreChange = (studentIndex, value, max) => {
        if (!decimalRegex.test(value) && value) {
            if (value?.length > 1 && value?.split('')?.filter(x => x == '.')?.length == 1) {
            } else
                return
        }

        if (value > max)
            return
        const clone = [...students]
        let scoreTypeId = null;
        let scoreTypeName = null;
        if (scoreTypes && scoreTypes.length > 0) {
            for (let i = 0; i < scoreTypes.length; i++) {
                if (scoreTypes[i].minScore <= value <= scoreTypes[i].maxScore) {
                    scoreTypeId = scoreTypes[i].id
                    scoreTypeName = scoreTypes[i].name
                }
            }
        }
        clone[studentIndex].studentScore = value
        clone[studentIndex].takenScore = value
        clone[studentIndex].scoreTypeId = scoreTypeId
        clone[studentIndex].scoreTypeName = scoreTypeName
        setStudents(clone)
    }

    const handleCheckboxChange = (id, value) => {
        const clone = [...students]
        const index = clone?.findIndex(el => el?.id == id)
        clone[index].checked = value
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
                        studentsRef[index + 1]?.columns?.find(colObj => colObj?.id === colId)?.ref?.current?.focus();
                    } else {
                        studentsRef[index + 1]?.ref?.current?.focus();
                    }
                }
            } else {
                if (index > 0) {
                    if (colId) {
                        studentsRef[index - 1]?.columns?.find(colObj => colObj?.id === colId)?.ref?.current?.focus();
                    } else {
                        studentsRef[index - 1]?.ref?.current?.focus();
                    }
                }
            }
        }
    }

    const handleScoreChange = (studentIndex, templateIndex, value, max) => {
        const check = value ? true : false
        if (!decimalRegex.test(value) && check) {
            if (value?.length > 1 && value?.split('')?.filter(x => x == '.')?.length == 1 && value?.endsWith('.')) {
            } else
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
        clone[studentIndex].takenScore = studentTotal?.toFixed(2)
        setStudents(clone)
    }

    const handleTestimonialChange = (index, testimonial) => {
        const clone = [...students]
        clone[index].testimonial = testimonial
        setStudents(clone)
    }

    const handleScoreTypeChange = (studentIndex, value) => {
        const clone = [...students]
        let takenScore = null;
        if (exam.childScoreTypes && exam.childScoreTypes.length > 0) {
            for (let st = 0; st < exam.childScoreTypes.length; st++) {

                if (value === exam.childScoreTypes[st]?.value) {
                    takenScore = exam.childScoreTypes[st].min;
                    break;
                }
            }
        }

        clone[studentIndex].studentScoreType = value
        clone[studentIndex].studentScore = takenScore
        clone[studentIndex].takenScore = takenScore
        setStudents(clone)
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
                        {
                            items?.map((el, key) =>
                                <th key={key}>{el?.itemName}</th>
                            )
                        }
                        <th width={150}>{translations(locale)?.season_score.performance}</th>
                        <th width={200}>{translations(locale)?.exam?.score_type}</th>
                        {
                            hasTestimonial &&
                            <th rowSpan={2}>{translations(locale)?.studentTranscript?.title}</th>
                        }
                    </tr>
                    <tr>
                        {
                            items?.map((el, key) =>
                                <th key={key}
                                    className='text-right'>{exam?.isPercentage ? '100%' : `${el.minScore}-${el?.maxScore}`}</th>
                            )
                        }
                    </tr>
                    </thead>
                    <tbody>
                    {
                        students?.map((el, key) =>
                            <tr key={key}>
                                <td>{key + 1}</td>
                                {/*<td>*/}
                                {/*    <Checkbox*/}
                                {/*        checked={el.checked}*/}
                                {/*        onChange={(e, data) => handleCheckboxChange(el?.id, data?.checked)}*/}
                                {/*    />*/}
                                {/*</td>*/}
                                <td>{el?.className}</td>
                                <td>{el?.code}</td>
                                <td>{el?.lastName}</td>
                                <td>{el?.firstName}</td>
                                {
                                    el?.templateDetails?.map((detail, index) => {
                                        const template = items?.find(t => t?.id == detail?.id)
                                        return <td key={index} className='p-1 text-right' style={{width: 100}}>
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
                                <td className='text-right' style={{padding: 3}}>
                                    {
                                        exam?.calcCode === 'MANUAL'
                                            ?
                                            (scoreSelectable
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
                                                    disabled={el.checked ? false : true}
                                                    type='number'
                                                    value={el.studentScore || ''}
                                                    onWheel={(e) => e?.target?.blur()}
                                                    className={`form-control text-right`}
                                                    onChange={(e) => handleFinalScoreChange(key, e?.target?.value, 100)}
                                                />)
                                            :
                                            <span>{el?.studentScore}</span>
                                    }
                                </td>
                                <td className='p-1'>
                                    {el?.scoreTypeName}
                                </td>
                                {
                                    hasTestimonial &&
                                    <td className='p-1' style={{width: 300}}>
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
                        )
                    }
                    </tbody>
                </table>
            </div>
            <div className='m-portlet__foot d-flex justify-content-center gap-05'>
                {/* <Link
                    className='btn btn-link'
                    to={'/teacher/year'}
                >
                    {translations(locale)?.back}
                </Link> */}
                <button
                    className='btn m-btn--pill btn-success text-uppercase'
                    onClick={() => handleSubmit(0)}
                >
                    {translations(locale)?.save}
                </button>
                <button
                    className='btn m-btn--pill btn-publish text-uppercase'
                    onClick={() => handlePublishSubmit()}
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

            {
                loading &&
                <>
                    <div className='blockUI blockOverlay'/>
                    <div className='blockUI blockMsg blockPage'>
                        <div className='m-loader m-loader--brand m-loader--lg'/>
                    </div>
                </>
            }
        </>
    )
}

export default scores