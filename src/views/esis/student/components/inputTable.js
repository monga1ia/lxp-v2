import { cloneDeep } from 'lodash'
import DTable from 'modules/DataTable/DTable'
import secureLocalStorage from 'react-secure-storage'
import { useTranslation } from 'react-i18next'
import { NDropdown as Dropdown } from 'widgets/Dropdown'
import { getGenderOptions, getGender } from 'utils/Util'
import React, { useState, useEffect, useImperativeHandle, forwardRef } from 'react'

const locale = secureLocalStorage?.getItem('selectedLang') || 'mn'

let config = {
    defaultSort: [{
        dataField: 'esisFirstName',
        order: 'asc'
    }],
    showPagination: true,
    defaultPageOptions: {
        custom: true,
        paginationSize: 5,
        sizePerPageList: [10, 25, 50, 100],
        page: 1,
        sizePerPage: 10,
    }
}
const inputTable = forwardRef((props, ref) => {

    const { t } = useTranslation()
    const { data, onSubmit, classOptions, eschoolClasses } = props

    const [loading, setLoading] = useState(false)
    const [tableData, setTableData] = useState([])

    const [updateView, setUpdateView] = useState(false)
    useEffect(() => {
        setLoading(true)
        setTableData((cloneDeep(data) || []).map(obj => {
            return {
                ...obj,
                ...{eschoolClass: filterClasses(obj?.esisGroupId)?.length === 1 ? filterClasses(obj?.esisGroupId)[0]?.value : null},
                ...{eschoolFirstName: obj?.eschoolFirstName || obj?.esisFirstName },
                ...{eschoolLastName: obj?.eschoolLastName || obj?.esisLastName },
                ...{eschoolGender: obj?.eschoolGender || obj?.esisGender }
            }
        }))

        setTimeout(() => {
            setLoading(false)
        }, 100)
    }, [data])

    useEffect(() => {
        console.log('Conf', config)
    }, [config])

    const filterClasses = (esisGroupId = null) => {
        let classes = []
        for (let c = 0; c < eschoolClasses.length; c++) {
            if (eschoolClasses[c]?.esisGroupId === esisGroupId?.toString()) {
                classes.push({
                    value: eschoolClasses[c].value,
                    text: eschoolClasses[c].text,
                })
            }
        }
        return classes
    }

    useImperativeHandle(ref, () => ({
        submit() {
            onSubmit(JSON.stringify(tableData.filter(obj => {
                return obj.eschoolClass &&
                    obj.eschoolLastName && obj.eschoolLastName.length > 0 &&
                    obj.eschoolFirstName && obj.eschoolFirstName.length > 0
            }).map(studentObj => {
                const selectedClassObj = classOptions.find(classObj => {
                    return classObj?.value?.toString() === studentObj?.eschoolClass?.toString()
                })


                return {
                    ...studentObj,
                    ...{eschoolClassName: selectedClassObj?.name || null},
                    ...{eschoolGrade: selectedClassObj?.gradeId || null}
                }
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
            dataField: 'esisGradeName',
            text: t('esis.gradeName'),
            sort: true
        },
        {
            dataField: 'esisClassName',
            text: t('esis.className'),
            sort: true,
        },
        {
            dataField: 'esisLastName',
            text: t('foodDashboardFinanceModalStudents.last_name'),
            sort: true
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
            dataField: 'esisGender',
            text: t('gender'),
            sort: true,
            formatter: cell => getGender(cell)
        },
        {
            dataField: 'eschoolClass',
            text: t('class_name'),
            style: { padding: 2 },
            formatter: (cell, row) => {
                return <Dropdown
                    key={'row_' + row?.id}
                    fluid
                    clearable
                    selection
                    closeOnChange
                    value={cell}
                    options={filterClasses(row?.esisGroupId)}
                    placeholder={'-' + t('select') + '-'}
                    onChange={(e, data) => handleChange(row?.id, 'eschoolClass', data?.value)}
                />
            }
        },
        {
            dataField: 'eschoolStudentCode',
            text: t('esis.eschoolCode'),
            style: { padding: 2 },
            formatter: (cell, row) =>
                <input
                    autoFocus
                    type='text'
                    value={cell || ''}
                    className='form-control'
                    onChange={(e) => handleChange(row?.id, 'eschoolStudentCode', e?.target?.value)}
                />
        },
        {
            dataField: 'eschoolLastName',
            text: t('last_name'),
            style: { padding: 2 },
            formatter: (cell, row) =>
                <input
                    autoFocus
                    type='text'
                    value={cell || ''}
                    className='form-control'
                    onChange={(e) => handleChange(row?.id, 'eschoolLastName', e?.target?.value)}
                />
        },
        {
            dataField: 'eschoolFirstName',
            text: t('first_name'),
            style: { padding: 2 },
            formatter: (cell, row) =>
                <input
                    autoFocus
                    type='text'
                    value={cell || ''}
                    className='form-control'
                    onChange={(e) => handleChange(row?.id, 'eschoolFirstName', e?.target?.value)}
                />
        },
        {
            dataField: 'eschoolGender',
            text: t('gender'),
            style: { padding: 2 },
            formatter: (cell, row) =>
                <Dropdown
                    fluid
                    clearable
                    selection
                    value={cell}
                    closeOnChange
                    options={getGenderOptions || []}
                    placeholder={'-' + t('select') + '-'}
                    onChange={(e, data) => handleChange(row?.id, 'eschoolGender', data?.value)}
                />
        },
        {
            dataField: 'eschoolRegistrationNumber',
            text: t('register_number'),
            style: { padding: 2 },
            formatter: (cell, row) =>
                <input
                    autoFocus
                    type='text'
                    value={cell || ''}
                    className='form-control'
                    onChange={(e) => handleChange(row?.id, 'eschoolRegistrationNumber', e?.target?.value)}
                />
        },
    ]

    const handleChange = (id, name, value) => {
        const clone = [...tableData]
        const employee = clone?.find(el => el?.id == id)
        employee[name] = value
        setTableData(clone)

        setUpdateView(!updateView)
    }

    const onInteraction = (params) => {
        console.log('params', params)
    }

    return (
        <>
            <DTable
                config={config}
                locale={locale}
                data={tableData}
                columns={columns}
                wrapperClassName='overflowXVisible'
                onInteraction={onInteraction}
                onForceInteraction={(data) => {
                    config.defaultPageOptions.sizePerPage = data?.sizePerPage;
                    config.defaultPageOptions.page = data?.page;
                }}
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