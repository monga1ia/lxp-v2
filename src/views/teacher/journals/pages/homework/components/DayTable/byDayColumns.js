import React from 'react'
import { translations } from 'utils/translations'
import secureLocalStorage from 'react-secure-storage'

const locale = secureLocalStorage?.getItem('selectedLang') || 'mn'

const byDayColumns = [
    {
        dataField: 'assignDate',
        text: translations(locale)?.homework?.assign_date,
        sort: true,
        formatter: (cell, row) => {
            return (
                <>
                    <span className="underline" onClick={() => dateClickHandler(cell)}>{cell}</span>
                </>
            )
        }
    },
    {
        dataField: 'dueDate',
        text: translations(locale)?.homework?.homework_due_date,
        sort: true
    },
    {
        dataField: 'createdDate',
        text: translations(locale)?.created_date,
        sort: true
    },
    {
        dataField: 'totalStudent',
        text: translations(locale)?.totalStudent,
        sort: true
    },
    {
        dataField: 'complete',
        text: translations(locale)?.homeworkReport?.complete,
        sort: true
    },
    {
        dataField: 'incomplete',
        text: translations(locale)?.homeworkReport?.incomplete,
        sort: true
    },
    {
        dataField: 'missing',
        text: translations(locale)?.homeworkReport?.missing,
        sort: true
    },
    {
        dataField: 'notChecked',
        text: translations(locale)?.homeworkReport?.notChecked,
        sort: true
    }
]