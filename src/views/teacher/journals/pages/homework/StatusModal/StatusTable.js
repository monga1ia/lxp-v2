import message from 'modules/message'
import React, { useEffect, useState } from 'react'
import DTable from 'modules/DataTable/DTable'
import secureLocalStorage from 'react-secure-storage'
import { fetchRequest } from 'utils/fetchRequest'
import { translations } from 'utils/translations'
import IconComplete from '../components/icons/Complete'
import IconIncomplete from '../components/icons/Incomplete'
import IconMissing from '../components/icons/Missing'

const locale = secureLocalStorage?.getItem('selectedLang') || 'mn'

const StatusTable = ({ statusIndication }) => {

    const config = {
        showFilter: false,
        showPagination: false,
        defaultPageOptions: false,
    }

    const columns = [
        {
            dataField: 'status',
            text: translations(locale)?.status,
            sort: false,
            formatter: (cell) => {
                let icon
                if (cell === 'complete') {
                    icon = <IconComplete size={'30px'}/>
                } else if (cell === 'incomplete') {
                    icon = <IconIncomplete size={'30px'}/>
                } else {
                    icon = <IconMissing size={'30px'}/>
                }
                return <div>{icon}</div>;
            },
        },
        {
            dataField: 'assignDate',
            text: translations(locale)?.homework?.assign_date,
            sort: true
        },
        {
            dataField: 'createdUser',
            text: translations(locale)?.created_user,
            sort: true
        },
        {
            dataField: 'score',
            text: translations(locale)?.homeworkReport?.takenScore,
            sort: true
        },
        {
            dataField: 'description',
            text: translations(locale)?.description,
            sort: true
        },
    ]
    const tableData = [
        {
            id: 1,
            status: 'complete',
            assignDate: '2020-05-02',
            createdUser: 'Bbbaa',
            score: 100,
            description: 'Lorem ipsum'
        },
        {
            id: 2,
            status: 'complete',
            createdUser: 'Bbbaa',
            score: 100,
            description: 'Lorem ipsum',
            assignDate: '2020-02-29',
        }
    ]
    return(
        <div className='m-portlet__body mr-3 ml-3'>
            <DTable
                locale={locale}
                data={tableData}
                columns={columns}
                config={config}
            />
        </div>
    )
}

export default StatusTable