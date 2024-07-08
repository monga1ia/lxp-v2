import { cloneDeep } from 'lodash'
import DTable from 'modules/DataTable/DTable'
import secureLocalStorage from 'react-secure-storage'
import { translations } from 'utils/translations'
import { NDropdown as Dropdown } from 'widgets/Dropdown'
import { useTranslation } from 'react-i18next'
import React, { useState, useEffect, useImperativeHandle, forwardRef } from 'react'
import {fetchRequest} from "utils/fetchRequest";
// import {ESISClassOptions} from "utils/url";
import message from 'modules/message'

const locale = secureLocalStorage?.getItem('selectedLang') || 'mn'

const config = {
    showPagination: false,
    showAllData: true,
    defaultSort: [{
        dataField: 'esisClassName',
        order: 'asc'
    }]
}

const inputTable = forwardRef((props, ref) => {

    const { t } = useTranslation()
    const { data, onSubmit } = props

    const [loading, setLoading] = useState(false)
    const [tableData, setTableData] = useState([])

    const [rooms, setRooms] = useState([])
    const [teachers, setTeachers] = useState([])
    const [scoreTypes, setScoreTypes] = useState([])
    const [shifts, setShifts] = useState([])

    const [updated, setUpdated] = useState(false)

    const loadInit = () => {
        console.log('inputTable init')
        // setLoading(true)
        // fetchRequest(ESISClassOptions, 'POST')
        //     .then((res) => {
        //         if (res.success) {
        //             setRooms(res?.data?.rooms || [])
        //             setShifts(res?.data?.shifts || [])
        //             setTeachers(res?.data?.teachers || [])
        //             setScoreTypes(res?.data?.scoreTypes || [])

        //             setUpdated(true)

        //         } else {
        //             message(res.data.message)
        //         }
        //         setLoading(false)
        //     })
        //     .catch(() => {
        //         message(translations(locale)?.err?.error_occurred)
        //         setLoading(false)
        //     })
    }

    useEffect(() => {
        setUpdated(false)
        loadInit()
    }, [])

    useEffect(() => {
        setTableData((cloneDeep(data) || []).map(obj => {
            return {
                ...obj,
                ...{eschoolClassName: obj?.eschoolClassName || obj?.esisClassName }
            }
        }))
    }, [data])

    useImperativeHandle(ref, () => ({
        submit() {
            onSubmit(JSON.stringify(tableData.filter(obj => {
                console.log('Obj', obj)
                return obj.eschoolClassName && obj.eschoolClassName.length > 0 && obj.eschoolTeacher && obj.eschoolShift
            })))
        }
    }))

    const setColumns = () => {
        // console.log('>>>>>>>', teachers)
        return [
            {
                dataField: 'esisGradeName',
                text: translations(locale)?.esis?.gradeName,
                sort: true
            },
            {
                dataField: 'esisClassCode',
                text: translations(locale)?.esis?.classCode,
                sort: true
            },
            {
                dataField: 'esisClassName',
                text: translations(locale)?.esis?.className,
                sort: true,
            },
            {
                dataField: 'esisClassTeacher',
                text: translations(locale)?.esis?.classTeacher,
                sort: true
            },
            {
                dataField: 'eschoolClassName',
                text: translations(locale)?.esis?.eschoolClassName,
                style: { padding: 2 },
                formatter: (cell, row) =>
                    <input
                        autoFocus
                        type='text'
                        value={cell || ''}
                        className='form-control'
                        onChange={(e) => handleChange(row?.id, 'eschoolClassName', e?.target?.value)}
                    />
            },
            {
                dataField: 'eschoolTeacher',
                text: translations(locale)?.esis?.classTeacher,
                style: { padding: 2 },
                formatter: (cell, row) =>
                    <Dropdown
                        fluid
                        clearable
                        selection
                        value={cell}
                        closeOnChange
                        options={teachers || []}
                        placeholder={'-' + translations(locale)?.select + '-'}
                        onChange={(e, data) => handleChange(row?.id, 'eschoolTeacher', data?.value)}
                    />
            },
            {
                dataField: 'eschoolShift',
                text: translations(locale)?.school_shift,
                style: { padding: 2 },
                formatter: (cell, row) =>
                    <Dropdown
                        fluid
                        clearable
                        selection
                        value={cell}
                        closeOnChange
                        options={shifts || []}
                        placeholder={'-' + translations(locale)?.select + '-'}
                        onChange={(e, data) => handleChange(row?.id, 'eschoolShift', data?.value)}
                    />
            },
            {
                dataField: 'eschoolScoreType',
                text: translations(locale)?.group?.score_type,
                style: { padding: 2 },
                formatter: (cell, row) =>
                    <Dropdown
                        fluid
                        clearable
                        selection
                        value={cell}
                        closeOnChange
                        options={scoreTypes || []}
                        placeholder={'-' + translations(locale)?.select + '-'}
                        onChange={(e, data) => handleChange(row?.id, 'eschoolScoreType', data?.value)}
                    />
            },
            {
                dataField: 'eschoolRoom',
                text: translations(locale)?.group?.classroom,
                style: { padding: 2 },
                formatter: (cell, row) =>
                    <Dropdown
                        fluid
                        clearable
                        selection
                        value={cell}
                        closeOnChange
                        options={rooms || []}
                        placeholder={'-' + translations(locale)?.select + '-'}
                        onChange={(e, data) => handleChange(row?.id, 'eschoolRoom', data?.value)}
                    />
            },
        ]
    }

    const handleChange = (id, name, value) => {
        const clone = [...tableData]
        const employee = clone?.find(el => el?.id == id)
        employee[name] = value
        setTableData(clone)
    }

    return (
        <>
            {
                updated && <DTable
                    config={config}
                    locale={locale}
                    data={tableData}
                    columns={setColumns()}
                    wrapperClassName='overflowXVisible'
                />
            }
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