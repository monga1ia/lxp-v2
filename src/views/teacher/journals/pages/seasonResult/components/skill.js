import message from 'modules/message'
import { Link } from 'react-router-dom'
import { Checkbox } from 'semantic-ui-react'
import React, { useState, useEffect } from 'react'
import secureLocalStorage from 'react-secure-storage'
import { translations } from 'utils/translations'

const locale = secureLocalStorage?.getItem('selectedLang') || 'mn'

const skill = ({ onSubmit, skillList }) => {
    const [skills, setSkills] = useState(skillList)

    useEffect(() => {

    }, [])

    const handleSubmit = () => {
        if (!validateFields()) return
        // const exams = []
        // examTypes?.forEach(el =>
        //     el?.exams?.forEach(e => {
        //         if (e?.checked)
        //             exams.push(e?.id)
        //     }))
        onSubmit(skills)
    }

    const validateFields = () => {
        // if (!examTypes?.some(el => el?.exams?.some(e => e?.checked)))
        //     return message(translations(locale)?.season_score?.chooseOne)
        return true
    }

    const handleChange = (index, checked) => {
        const clone = [...skills]
        clone[index].checked = checked
        setSkills(clone)
    }

    return (
        <>
            <div className='m-portlet__body d-flex flex-column px-5'>
                <div className='d-flex flex-column fs-11'>
                    <span className='bolder mb-3'>{translations(locale)?.season_score?.skillChoice?.title}</span>
                    <span>{translations(locale)?.season_score?.skillChoice?.description}</span>
                </div>
                <div className='d-flex flex-column my-3 mx-5'>
                    {
                        skills?.map((el, key) =>
                            <div key={key} className='m-2 p-2'>
                                <Checkbox
                                    label={el?.templateName}
                                    checked={el?.checked}
                                    onChange={(e, data) => handleChange(key, data?.checked)}
                                />
                            </div>
                        )
                    }
                </div>
            </div>
            <div className="m-portlet__foot d-flex justify-content-center gap-05">
                <Link
                    to={-1}
                    className='btn btn-link'
                >
                    {translations(locale)?.back}
                </Link>
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

export default skill