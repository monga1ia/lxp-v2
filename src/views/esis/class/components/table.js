import { paginate } from 'utils/Util'
import DTable from 'modules/DataTable/DTable'
import React, { useEffect, useState } from 'react'
import secureLocalStorage from 'react-secure-storage'
import { useTranslation } from 'react-i18next'

const locale = secureLocalStorage?.getItem('selectedLang') || 'mn'
const localTableState = 'esis_class_table_state'

const styles = {
    green: {
        backgroundColor: 'rgba(62, 191, 163, 0.3)',
    },
    grey: {
        backgroundColor: '#dfe2ea',
    },
    red: {
        backgroundColor: 'rgba(244, 81, 107, 0.5)',
    },
}

const table = ({ data, openModal }) => {

    const { t } = useTranslation()
    const [tableData, setTableData] = useState([])
    const [tableDataTotalSize, setTableDataTotalSize] = useState(0)
    const [tableState, setTableState] = useState(secureLocalStorage.getItem(localTableState) ||
    {
        page: 1,
        pageSize: 10,
        search: ''
    })

    const columns = [
        {
            dataField: 'esisGradeName',
            text: t('esis.gradeName'),
            sort: true
        },
        {
            dataField: 'esisClassCode',
            text: t('esis.classCode'),
            sort: true
        },
        {
            dataField: 'esisClassName',
            text: t('esis.className'),
            sort: true,
        },
        {
            dataField: 'esisClassTeacher',
            text: t('esis.classTeacher'),
            sort: true
        },
        {
            dataField: 'eschoolClassName',
            text: t('esis.eschoolClassName'),
            sort: true
        },
        {
            dataField: 'eschoolTeacher',
            text: t('esis.classTeacher'),
            sort: true
        },
        {
            dataField: 'eschoolShift',
            text: t('school_shift'),
            sort: true
        },
        {
            dataField: 'eschoolScoreType',
            text: t('group.score_type'),
            sort: true
        },
        {
            dataField: 'eschoolRoom',
            text: t('group.classroom'),
            sort: true
        },
        {
            dataField: 'action',
            text: '',
            align: 'center',
            formatter: (cell, row) => {
                if (!row?.eschoolClassId) return (
                    <button
                        className='btn btn-primary m-btn--icon btn-sm m-btn--icon-only m-btn--pill'
                        onClick={() => openModal('edit', row)}
                    >
                        <i className='fa flaticon-edit-1' />
                    </button>
                )
                else return (
                    <button
                        className='btn btn-danger m-btn--icon btn-sm m-btn--icon-only m-btn--pill'
                        onClick={() => openModal('delete', row)}
                    >
                        <i className='fa flaticon2-cross' />
                    </button>
                )
            }
        }
    ]

    const config = {
        defaultSort: [{
            dataField: 'esisClassName',
            order: 'asc'
        }],
        defaultPageOptions: {
            page: tableState?.page || 1,
            sizePerPage: tableState?.pageSize || 10,
            search: tableState?.search || '',
        }
    }

    useEffect(() => {
        const paginatedData = paginate(data, tableState)
        setTableData(paginatedData?.data)
        setTableDataTotalSize(paginatedData?.length)
    }, [data, tableState])

    const handleRowStyle = row => {
        if (row?.eschoolClassId)
            return styles.green
        else if (row?.something)
            return styles.grey
        else if (row?.something)
            return styles.red
        return {}
    }

    const handleInteraction = state => {
        setTableState({ ...tableState, ...state })
        secureLocalStorage.setItem(localTableState, state)
    }

    return (
        <DTable
            remote
            config={config}
            locale={locale}
            data={tableData}
            columns={columns}
            rowStyle={handleRowStyle}
            onInteraction={handleInteraction}
            totalDataSize={tableDataTotalSize}
        />
    )
}

export default table