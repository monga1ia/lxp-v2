import { useState } from 'react'
import React from 'react'
import secureLocalStorage from 'react-secure-storage'
import { translations } from 'utils/translations'
import IconComplete from '../icons/Complete'
import IconIncomplete from '../icons/Incomplete'
import IconMissing from '../icons/Missing'

const locale = secureLocalStorage?.getItem('selectedLang') || 'mn'

const dates = {
    startDate: new Date(new Date().setDate(new Date().getDate() - 7)).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
}
const startDate = new Date(dates.startDate)
const endDate = new Date(dates.endDate)
const diffInMs = Math.abs(endDate - startDate)
const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24))
const attendanceWeek = []
for ( let i=0; i<=diffInDays; i++ )
{
    const temp = new Date(new Date().setDate(new Date(dates.endDate).getDate() - i)).toLocaleDateString('mn', { year: 'numeric', month: 'numeric', day: 'numeric' }).replace(/\//g, ',');
    const [month, day, year] = temp.split(',');
    const formattedDate = `${year}/${month}/${day}`
    //const temp = new Date(new Date().setDate(new Date(dates.endDate).getDate() - i)).toLocaleDateString('mn', { day: 'numeric', month: 'numeric', weekday: 'long' }).replace(/\//g, '-')
    attendanceWeek.push(formattedDate)
}

const attendance = attendanceWeek.map((date, index) => {
    return {
        dataField: new Date(new Date().setDate(new Date().getDate() - index)).toLocaleDateString('mn', { weekday: 'long' }),
        text: date,
        sort: false,
        headerStyle: () => ({
            height: '140px',
            whiteSpace: 'nowrap',
            transform: 'rotate(-90deg) translate(-30%, 0px)',
            alignItems: 'center',
            fontSize: '12px',
        }),
        headerClasses: 'rotate90-container',
        style: {
            textAlign: 'center',
            flexWrap: 'wrap',
        },
        formatter: (cell) => {
        let icon
        if (cell === 'complete') {
            icon = <IconComplete size={'30px'}/>
        } else if (cell === 'incomplete') {
            icon = <IconIncomplete size={'30px'}/>
        } else {
            icon = <IconMissing size={'30px'} />
        }
        return <div>{icon}</div>;
        },
    }
    })

export const byStudentColumns = [
    {
        dataField: 'class',
        text: translations(locale)?.className,
        sort: false,
        headerStyle: () => ({
            height: '140px',
            whiteSpace: 'nowrap',
            alignItems: 'center',
            verticalAlign: 'top',
        }),
    },
    {
        dataField: 'studentCode',
        text: translations(locale)?.studentCode,
        sort: false
    },
    {
        dataField: 'studentLastName',
        text: translations(locale)?.studentLastName,
        sort: false
    },
    {
        dataField: 'studentFirstName',
        text: translations(locale)?.studentFirstName,
        sort: false
    },
    {
        dataField: 'total',
        text: translations(locale)?.total,
        sort: false,
        headerStyle: () => ({
            width: 20,
            height: 120,
            transform: 'rotate(-90deg) translate(-40%, 0px)',
            alignItems: 'center',
        }),
        style: {
            textAlign: 'center',
            flexWrap: 'wrap'
        },
    },
    {
        dataField: 'checkedHomework',
        text: translations(locale)?.homework?.checkedHomework,
        sort: false,
        headerStyle: () => ({
            height: '140px',
            whiteSpace: 'nowrap',
            transform: 'rotate(-90deg) translate(-20%, 0px)',
            alignItems: 'center',
        }),
        headerClasses: 'rotate90-container',
        style: {
            textAlign: 'center',
            flexWrap: 'wrap',
        },
    },
    {
        dataField: 'complete',
        text: translations(locale)?.homeworkReport?.complete[0],
        sort: false
    },
    {
        dataField: 'incomplete',
        text: translations(locale)?.homeworkReport?.incomplete[0],
        sort: false
    },
    {
        dataField: 'missing',
        text: translations(locale)?.homeworkReport?.missing[0],
        sort: false
    },
    ...attendance
]