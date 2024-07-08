import { cloneDeep } from 'lodash'
import DTable from 'modules/DataTable/DTable'
import secureLocalStorage from 'react-secure-storage'
import { useTranslation } from 'react-i18next'
import React, { useState, useEffect, useImperativeHandle, forwardRef } from 'react'

const locale = secureLocalStorage?.getItem('selectedLang') || 'mn'

const config = {
    showPagination: false,
    showAllData: true,
    defaultSort: [{
        dataField: 'esisFirstName',
        order: 'asc'
    }]
}

const inputTable = forwardRef((props, ref) => {

    const { t } = useTranslation()
    const { data, onSubmit } = props

    const [loading, setLoading] = useState(false)
    const [tableData, setTableData] = useState([])

    useEffect(() => {
        setLoading(true)

        setTableData((cloneDeep(data) || []).map(obj => {
            return {
                ...obj,
                ...{ eschoolFirstName: obj?.eschoolFirstName || obj?.eschoolTmpFirstName },
                ...{ eschoolLastName: obj?.eschoolLastName || obj?.eschoolTmpLastName },
                ...{ eschoolTitle: obj?.eschoolTitle || obj?.esisTitle },
            }
        }))
        setTimeout(() => {
            setLoading(false)
        }, 100)
    }, [data])

    useImperativeHandle(ref, () => ({
        submit() {
            onSubmit(JSON.stringify(tableData.filter(obj => {
                return obj.eschoolLoginName && obj.eschoolLoginName.length > 0
            })))
        }
    }))

    const columns = [
        {
            dataField: 'esisId',
            text: 'ESIS ID',
            sort: true
        },
        {
            dataField: 'esisShortName',
            text: t('esis.shortName'),
            sort: true
        },
        {
            dataField: 'esisLastName',
            text: t('studentBook.parent_name'),
            sort: true,
        },
        {
            dataField: 'esisFirstName',
            text: t('studentBook.name'),
            sort: true
        },
        {
            dataField: 'esisBirthDay',
            text: t('studentBook.birth_day'),
            sort: true
        },
        {
            dataField: 'eschoolCode',
            text: t('esis.eschoolCode'),
            style: { padding: 2 },
            formatter: (cell, row) =>
                <input
                    autoFocus
                    type='text'
                    value={cell}
                    className='form-control'
                    onChange={(e) => handleChange(row?.id, 'eschoolCode', e?.target?.value)}
                />
        },
        {
            dataField: 'eschoolLastName',
            text: t('esis.eschoolLastName'),
            style: { padding: 2 },
            formatter: (cell, row) =>
                <input
                    autoFocus
                    type='text'
                    value={cell}
                    className='form-control'
                    onChange={(e) => handleChange(row?.id, 'eschoolLastName', e?.target?.value)}
                />
        },
        {
            dataField: 'eschoolFirstName',
            text: t('esis.eschoolFirstName'),
            style: { padding: 2 },
            formatter: (cell, row) =>
                <input
                    autoFocus
                    type='text'
                    value={cell}
                    className='form-control'
                    onChange={(e) => handleChange(row?.id, 'eschoolFirstName', e?.target?.value)}
                />
        },
        {
            dataField: 'eschoolTitle',
            text: t('esis.eschoolTitle'),
            style: { padding: 2 },
            formatter: (cell, row) =>
                <input
                    autoFocus
                    type='text'
                    value={cell}
                    className='form-control'
                    onChange={(e) => handleChange(row?.id, 'eschoolTitle', e?.target?.value)}
                />
        },
        {
            dataField: 'eschoolLoginName',
            text: t('teacher.login_name'),
            style: { padding: 2 },
            formatter: (cell, row) =>
                <input
                    autoFocus
                    type='text'
                    value={cell}
                    className='form-control'
                    onChange={(e) => handleChange(row?.id, 'eschoolLoginName', e?.target?.value)}
                />
        }
    ]

    const handleChange = (id, name, value) => {
        const clone = [...tableData]
        const employee = clone?.find(el => el?.id == id)
        employee[name] = value
        setTableData(clone)
    }

    return (
        <>
            <DTable
                config={config}
                locale={locale}
                data={tableData}
                columns={columns}
                wrapperClassName='overflowXVisible'
            />
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
})

export default inputTable