import message from 'modules/message'
import GeneralTab from './tab/general'
import StudentsTab from './tab/students'
import { Tab } from 'semantic-ui-react'
import React, { useEffect, useState } from 'react'
import secureLocalStorage from 'react-secure-storage'
import { translations } from 'utils/translations'
// import { useLocation, useNavigate } from 'react-router-dom'

const index = () => {
    // const navigate = useNavigate()
    // const location = useLocation()
    const location = {state: {id: 1231}}

    const locale = secureLocalStorage?.getItem('selectedLang') || 'mn'

    const [tab, setTab] = useState(0)
    const [render, setRender] = useState(false)

    useEffect(() => {
        if (!location?.state?.id) {
            message(translations(locale)?.no_info)
            navigate(-1, { replace: true })
        } else {
            setTab(location?.state?.tab)
            setRender(true)
        }
    }, [location])

    return (
        <div className='m-grid__item m-grid__item--fluid m-wrapper'>
            {/* <SubHeader
                locale={locale}
                title={translations(locale)?.club?.title}
            /> */}
            <div className='m-content'>
                <div className='m-portlet tab'>
                    <Tab
                        activeIndex={tab}
                        onTabChange={(e, data) => setTab(data?.activeIndex)}
                        menu={{ secondary: true, pointing: true, className: 'primaryColor m-0 h-4' }}
                        panes={[
                            {
                                menuItem: translations(locale)?.general_info,
                                render: () => render && <GeneralTab group={location?.state?.id} />,
                            },
                            {
                                menuItem: translations(locale)?.students,
                                render: () => render && <StudentsTab group={location?.state?.id} />,
                            },
                        ]}
                    />
                </div>
            </div>
        </div>
    )
}

export default index