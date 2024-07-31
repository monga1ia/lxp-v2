import message from 'modules/message'
import React, { useEffect, useState } from 'react'
import DTable from 'modules/DataTable/DTable'
import secureLocalStorage from 'react-secure-storage'
import { translations } from 'utils/translations'
import { fetchRequest } from 'utils/fetchRequest'
import { useLocation, useNavigate } from 'react-router'
import { teacherJournalBehaviorInit } from 'Utilities/url'

const locale = secureLocalStorage?.getItem('selectedLang') || 'mn'

const config = {
    showAllData: true,
    showPagination: false,
    showFilter: false
}

const columns = [
    {
        dataField: 'className',
        text: translations(locale)?.class_name,
        sort: true
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
        dataField: 'percent',
        text: '%',
        align: 'right',
        sort: true,
    },
    {
        dataField: 'positiveScore',
        text: translations(locale)?.behavior?.positiveScore,
        align: 'right',
        sort: true
    },
    {
        dataField: 'negativeScore',
        text: translations(locale)?.behavior?.negativeScore,
        align: 'right',
        sort: true
    }
]

const result = () => {
    const location = useLocation()
    const navigate = useNavigate()

    const [loading, setLoading] = useState(false)

    const [title, setTitle] = useState('')
    const [tableData, setTableData] = useState([
        {
            id: 1,
            percent: 10,
            positiveScore: 2,
            negativeScore: 5,
        }
    ])

    useEffect(() => {
        if (!location?.state?.group) {
            message(translations(locale)?.group?.group_not_found)
            navigate(-1, { replace: true })
        }
        setLoading(true)
        fetchRequest(teacherJournalBehaviorInit, 'POST', { group: location?.state?.group, season: location?.state?.season })
            .then((res) => {
                if (res.success) {
                    const { students, title } = res.data
                    setTableData(students || [])
                    setTitle(title || '')
                } else {
                    message(res.data.message)
                }
                setLoading(false)
            })
            .catch(() => {
                message(translations(locale)?.err?.error_occurred)
                setLoading(false)
            })
    }, [location])

    return (
        <div className='m-grid__item m-grid__item--fluid m-wrapper'>
            <div className='m-portlet'>
                <div className='m-portlet__head justify-content-between align-items-center pr-0 pl-4'>
                    <span className='fs-11 pinnacle-bold color-brand'>{title}</span>
                    <button
                        className='btn m-btn--pill btn-link m-btn m-btn--custom'
                        onClick={() => navigate('/teacher/journals', { replace: true })}
                    >
                        {translations(locale)?.back}
                    </button>
                </div>
                <div className='m-portlet__body'>
                    <DTable
                        locale={locale}
                        config={config}
                        data={tableData}
                        columns={columns}
                    />
                </div>
                <div className="m-portlet__foot d-flex justify-content-center gap-05">
                    <button
                        className='btn btn-link'
                        onClick={() => navigate(-1, { replace: true })}
                    >
                        {translations(locale)?.back}
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
        </div>
    )
}

export default result