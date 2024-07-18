import message from 'modules/message'
import Exam from './components/exam'
import Skill from './components/skill'
import SeasonResult from './components/seasonResult'
import {Tab} from 'semantic-ui-react'
import React, {useEffect, useState} from 'react'
import { useTranslation } from "react-i18next";
import {fetchRequest} from 'utils/fetchRequest'
import {studentBookIndex} from 'utils/fetchRequest/Urls'
import {Col, Row} from "react-bootstrap";
import TreeView from "modules/TreeView2";


const index = ({student}) => {
    
    const locale="mn"
    const { t } = useTranslation();

    const [loading, setLoading] = useState(false)

    useEffect(() => {
    }, [])

    return (
        <div className='m-portlet__body'>
            <Tab
                renderActiveOnly
                menu={{attached: false, borderless: true, className: 'grade-tab d-flex h-3 r'}}
                panes={[
                    {
                        menuItem: t('exam.title'),
                        render: () => <Exam id={student?.id} studentCode={student?.studentCode}/>
                    },
                    {
                        menuItem: t('skill.name'),
                        render: () => <Skill id={student?.id} studentCode={student?.studentCode}/>
                    },
                    {
                        menuItem: t('studentBookNavs.season_grade'),
                        render: () => <SeasonResult id={student?.id} studentCode={student?.studentCode}/>
                    },
                ]}
            />

            {
                loading &&
                <>
                    <div className="blockUI blockOverlay"/>
                    <div className="blockUI blockMsg blockPage">
                        <div className="m-loader m-loader--brand m-loader--lg"/>
                    </div>
                </>
            }
        </div>
    )
}

export default index