import React from 'react'
import {Tab} from 'semantic-ui-react'
import secureLocalStorage from 'react-secure-storage'
import { useTranslation } from "react-i18next";
import Attendance from './components/attendance'
import Homework from './components/homework'

const index = ({student, refresh}) => {
    const locale="mn"
    const { t } = useTranslation();


    const onTabChange = (data) => {
    }

    return (
        <div className='m-portlet__body'>
            <Tab
                renderActiveOnly
                menu={{
                    fluid: true,
                    vertical: true,
                    attached: true,
                    borderless: true,
                    className: 'vertical-tab',
                }}
                onTabChange={(e, data) => onTabChange(data?.panes[data?.activeIndex])}
                panes={[
                    {
                        menuItem: t('attendance.title'),
                        render: () => <Attendance id={student?.id} refresh={refresh}/>,
                    },
                    {
                        menuItem: t('homework.title'),
                        render: () => <Homework id={student?.id} refresh={refresh}/>,
                    },
                ]}
            />
        </div>
    )
}

export default index