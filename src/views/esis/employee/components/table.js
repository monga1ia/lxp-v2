import { paginate } from 'utils/Util'
import DTable from 'modules/DataTable/DTable'
import React, { useEffect, useState } from 'react'
import secureLocalStorage from 'react-secure-storage'
import { translations } from 'utils/translations'

const locale = secureLocalStorage?.getItem('selectedLang') || 'mn'
const localTableState = 'esis_employee_table_state'

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


const table = ({ data, openModal, updateTable, onTableRender }) => {

    const [tableState, setTableState] = useState(secureLocalStorage.getItem(localTableState) ||
    {
        page: 1,
        pageSize: 10,
        search: ''
    })


    useEffect(() => {
        if (updateTable) {
            onTableRender()
        }
    }, [updateTable])

    useEffect(() => {
    }, [data, tableState])

    const columns = [
        {
            dataField: 'esisId',
            text: 'ESIS ID',
            sort: true
        },
        {
            dataField: 'esisShortName',
            text: translations(locale)?.esis?.shortName,
            sort: true
        },
        {
            dataField: 'esisLastName',
            text: translations(locale)?.studentBook?.parent_name,
            sort: true,
        },
        {
            dataField: 'esisFirstName',
            text: translations(locale)?.studentBook?.name,
            sort: true
        },
        {
            dataField: 'esisBirthDay',
            text: translations(locale)?.studentBook?.birth_day,
            sort: true
        },
        {
            dataField: 'eschoolCode',
            text: translations(locale)?.esis?.eschoolCode,
            sort: true
        },
        {
            dataField: 'eschoolLastName',
            text: translations(locale)?.esis?.eschoolLastName,
            sort: true
        },
        {
            dataField: 'eschoolFirstName',
            text: translations(locale)?.esis?.eschoolFirstName,
            sort: true
        },
        {
            dataField: 'eschoolTitle',
            text: translations(locale)?.esis?.eschoolTitle,
            sort: true
        },
        {
            dataField: 'eschoolLoginName',
            text: translations(locale)?.teacher?.login_name,
            sort: true,
        },
        {
            dataField: 'action',
            text: '',
            formatter: (cell, row) => {
                if (!row?.eschoolUserId) return (
                    <button
                        className='btn btn-primary m-btn--icon btn-sm m-btn--icon-only m-btn--pill mr-2'
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
            dataField: 'esisFirstName',
            order: 'asc'
        }],
        defaultPageOptions: {
            page: tableState?.page || 1,
            sizePerPage: tableState?.pageSize || 10,
            search: tableState?.search || '',
        }
    }


    const handleRowStyle = row => {
        if (row?.eschoolUserId)
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


    const getTableList = (list) => {
        const paginatedData = paginate(list, tableState)
        return paginatedData?.data
    }

    const getTableTotalSize = (list) => {
        const paginatedData = paginate(list, tableState)
        return paginatedData?.length
    }

    return (
        <DTable
            remote
            config={config}
            locale={locale}
            data={getTableList(data)}
            columns={columns}
            rowStyle={handleRowStyle}
            onInteraction={handleInteraction}
            totalDataSize={getTableTotalSize(data)}
        />
    )
}

export default table