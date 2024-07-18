import React from 'react'
import { Tab } from 'semantic-ui-react'
import secureLocalStorage from 'react-secure-storage'
import { useTranslation } from "react-i18next";
import SelfInformation from './components/selfInformation'
import ParentsInformation from './components/parentsInformation'

const index = ({ student, refresh }) => {
    const locale="mn"
    const { t } = useTranslation();

    const onTabChange = (data) => {
        console.log('data', data)
    }

    return (
        <div className='m-portlet__body'>
            {
                student &&
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
                            menuCode: 'self',
                            menuItem: t('studentBookNavs.self_info'),
                            render: () => <SelfInformation student={student} refresh={refresh} />,
                        },
                        {
                            menuCode: 'parents',
                            menuItem: t('studentBookNavs.relation'),
                            render: () => <ParentsInformation student={student} refresh={refresh} />,
                        },
                    ]}
                />
            }
        </div>
    )
}

export default index