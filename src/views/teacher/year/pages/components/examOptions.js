import message from 'modules/message'
// import { Link } from 'react-router-dom'
import { Checkbox } from 'semantic-ui-react'
import React, { useState, useEffect } from 'react'
import secureLocalStorage from 'react-secure-storage'
import { translations } from 'utils/translations'

const locale = secureLocalStorage?.getItem('selectedLang') || 'mn'

const examOptions = ({ onSubmit, exams }) => {
    const [examTypes, setExamTypes] = useState([])

    useEffect(() => {
        const examTypesWithExams = []
        exams?.forEach(el => {
            if (el?.exams?.length)
                examTypesWithExams.push(el)
        })
        setExamTypes(examTypesWithExams || [])
    }, [exams])

    const handleSubmit = () => {
        if (!validateFields()) return
        const exams = []
        examTypes?.forEach(el =>
            el?.exams?.forEach(e => {
                if (e?.checked)
                    exams.push(e?.id)
            }))
        onSubmit(exams)
    }

    const validateFields = () => {
        // if (!examTypes?.some(el => el?.exams?.some(e => e?.checked)))
        //     return message(translations(locale)?.season_score?.chooseOne)
        return true
    }

    const handleTypeChange = (index, checked) => {
        const clone = [...examTypes]
        clone[index].checked = checked
        clone[index]?.exams?.forEach(el => { el.checked = checked })
        setExamTypes(clone)
    }

    const handleExamChange = (parentIndex, index, checked) => {
        const clone = [...examTypes]
        clone[parentIndex].exams[index].checked = checked
        let counter = 0
        clone[parentIndex].exams?.forEach(el => {
            if (el?.checked == checked)
                counter++
        })
        if (counter == clone[parentIndex].exams?.length)
            clone[parentIndex].checked = checked
        else
            clone[parentIndex].checked = false
        setExamTypes(clone)
    }

    return (
        <>
            <div className='m-portlet__body d-flex flex-column px-5'>
                <div className='d-flex flex-column fs-11'>
                    <span className='bolder mb-3'>{translations(locale)?.season_score?.examChoice?.title}</span>
                    <span>{translations(locale)?.season_score?.examChoice?.description}</span>
                </div>
                <div className='d-flex flex-column my-3 mx-5'>
                    {
                        examTypes?.map((el, key) =>
                            <div key={key} className='m-2 p-2'>
                                <Checkbox
                                    label={el?.name}
                                    checked={el?.checked}
                                    onChange={(e, data) => handleTypeChange(key, data?.checked)}
                                />
                                {
                                    el?.exams?.map((exam, index) =>
                                        <div key={index} className='ml-4 p-2'>
                                            <Checkbox
                                                checked={exam?.checked}
                                                label={`${exam?.takenDate}, ${exam?.name}`}
                                                onChange={(e, data) => handleExamChange(key, index, data?.checked)}
                                            />
                                        </div>
                                    )
                                }
                            </div>
                        )
                    }
                </div>
            </div>
            <div className="m-portlet__foot d-flex justify-content-center gap-05">
                {/* <Link
                    to={-1}
                    className='btn btn-link'
                >
                    {translations(locale)?.back}
                </Link> */}
                <button
                    className="btn m-btn--pill btn-publish text-uppercase"
                    onClick={handleSubmit}
                >
                    {translations(locale)?.action?.calculate}
                </button>
            </div>
        </>
    )
}

export default examOptions