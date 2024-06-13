import React, { useEffect, useState } from 'react'
import { Button } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min'
import { fetchRequest } from 'utils/fetchRequest'
import { studentStudyPlanIndex, studentStudyPlanSubmit } from 'utils/fetchRequest/Urls';
import message from 'modules/message'
import ListItems from './components/items'

const StudyPlan = () => {
    const { t } = useTranslation()
    const history = useHistory()

    const [list, setList] = useState([])
    const [tabList, setTabList] = useState([])
    const [selectedTab, setSelectedTab] = useState(null)
    const [loading, setLoading] = useState(false)
    const [page, setPage] = useState(false)
    const [pageLoading, setPageLoading] = useState(false)
    const [morePage, setMorePage] = useState(false)

    const onTabChange = (key) => {
        setSelectedTab(key)
        setLoading(true)
        setPage(1)
        fetchInit(1, key)
    }

    const fetchInit = (page = 1, season = null) => {
        const params = {
            page,
            season
        }

        fetchRequest(studentStudyPlanIndex, "POST", params)
            .then(res => {
                if (res.success) {
                    if(!selectedTab){
                        setSelectedTab(res?.selectedSeason || null)
                    }
                    setTabList(res?.seasons || [])
                    setList(res?.groups || [])
                } else {
                    message(res.message)
                }
            })
            .catch(() => {
                message(t('errorMessage.title'));
            })
            .finally(() => {
                clearLoader()
            })
    }

    const clearLoader = () => {
        setLoading(false)
        setPageLoading(false)
    }

    useEffect(() => {
        setLoading(true)
        fetchInit()
    }, [])

    const Tabs = () => {
        return <div className='d-flex flex-row align-items-center study-plan-tab-style mb-3'>
            {
                tabList.map((obj, index) => {
                    return <Button
                        key={index}
                        variant={selectedTab == obj.id ? 'outline-primary' : 'empty'}
                        onClick={() => onTabChange(obj.id)}
                        className='mr-2'
                    >
                        <h5 className={selectedTab !== obj.id ? 'text-black m-0' : 'm-0'}>
                            {obj.name || ''}
                        </h5>
                    </Button>
                })
            }
        </div>
    }

    const onSave = (object) => {
        let details = []

        if(object.details && object.details.length > 0){
            for(let i = 0; i < object.details.length; i++){
                if(object.viewType == 'PERCENTAGE'){
                    if((0 <= parseFloat(object.details[i].estimatedScore) && parseFloat(object.details[i].estimatedScore) <= 100) || !parseFloat(object.details[i].estimatedScore)){
                        
                    } else {
                        message(t('errorMessage.studyPlanPercentageNumberText'), false)
                        return
                    }
                } else if(object.viewType == 'SCORE'){
                    if((0 <= parseFloat(object.details[i].estimatedScore) && parseFloat(object.details[i].estimatedScore) <= parseFloat(object.details[i].maxScore)) || !object.details[i].estimatedScore){

                    } else {
                        message(t('errorMessage.studyPlanScoreNumberText'), false)
                        return
                    }
                }

                details.push({
                    id: object.details[i].id,
                    code: object.details[i].itemCode,
                    name: object.details[i].itemName,
                    estimatedScore: object.details[i].estimatedScore,
                    maxScore: object.details[i].maxScore,
                })
            }
        }

        const params = {
            season: selectedTab,
            group: object.id,
            viewType: object.type,
            details: JSON.stringify(details),
        }

        setLoading(true)
        fetchRequest(studentStudyPlanSubmit, "POST", params)
            .then(res => {
                if (res.success) {
                    let cloneList = [...list]

                    if(cloneList && cloneList.length > 0){
                        for(let i = 0; i < cloneList.length; i++){
                            if(cloneList[i].id == object.id){
                                cloneList[i].hasPlan = true;
                                cloneList[i].isEdit = false;
                            }
                        }
                    }

                    setList(cloneList)
                    setLoading(false)
                } else {
                    message(res.message)
                    setLoading(false)
                }
            })
            .catch(() => {
                message(t('errorMessage.title'));
                setLoading(false)
            })
    }

    const handlerAccordion = (e, id) => {
        let cloneList = [...list]

        if(cloneList && cloneList.length > 0){
            for(let i = 0; i < cloneList.length; i++){
                if(cloneList[i].id == id){
                    if(cloneList[i]?.isExpand){
                        cloneList[i].isExpand = false
                    } else {
                        cloneList[i].isExpand = true
                    }
                }
            }
        }

        setList(cloneList)
    }

    const handlerEdit = (object) => {
        let cloneList = [...list]

        if(list && list.length > 0){
            for(let i = 0; i < cloneList.length; i++){
                if(cloneList[i].id == object.id){
                    cloneList[i].isEdit = true;
                } else {
                    cloneList[i].isEdit = false;
                }
            }
        }

        setList(cloneList)
    }

    const handlerInput = (e, index, object) => {
        e.target.blur()
        e.preventDefault()
        e.stopPropagation();
        
        let cloneList = [...list]

        if(list && list.length > 0){
            for(let i = 0; i < cloneList.length; i++){
                for(let d = 0; d < cloneList[i].details.length; d++){
                    cloneList[i].details[d].isFocus = false
                }

                if(cloneList[i].id == object.id){
                    if(object.viewType == 'PERCENTAGE'){
                        if(0 <= e.target.value && e.target.value <= 100){
                            cloneList[i].details[index].estimatedScore = e.target.value
                        } else {
                            message(t('errorMessage.studyPlanPercentageNumberText'), false)
                            return
                        }
                    } else if(object.viewType == 'SCORE'){
                        if(0 <= e.target.value && e.target.value <= parseFloat(cloneList[i].details[index].maxScore)){
                            cloneList[i].details[index].estimatedScore = e.target.value
                        } else {
                            message(t('errorMessage.studyPlanScoreNumberText'), false)
                            return
                        }
                    }
                    
                    cloneList[i].details[index].isFocus = true
                }
            }
        }

        setList(cloneList)
    }

    const handlerBack = (object) => {
        let cloneList = [...list]

        if(list && list.length > 0){
            for(let i = 0; i < cloneList.length; i++){
                cloneList[i].isEdit = false;
            }
        }

        setList(cloneList)
    }

    return (
        <>
            <div className="student-page-title-container mb-3">
                <h1 className="mb-0 pb-0 display-4">{t('menu.studyPlan')}</h1>
            </div>

            <div className='pr-6'>
                <Tabs />

                <ListItems 
                    plans={list} 
                    accordionAction={handlerAccordion}
                    editAction={handlerEdit}
                    inputAction={handlerInput}
                    backAction={handlerBack}
                    onSave={onSave}
                />
                {
                    pageLoading
                        ?
                        <svg className="splash-spinner" viewBox="0 0 50 50">
                            <circle className="path" cx="25" cy="25" r="20" fill="none" strokeWidth="5" />
                        </svg>
                        : null
                }
                {
                    loading &&
                    <>
                        <div className='loader-container'>
                            <svg className="splash-spinner" viewBox="0 0 50 50">
                                <circle className="path" cx="25" cy="25" r="20" fill="none" strokeWidth="5" />
                            </svg>
                        </div>
                    </>
                }
            </div>
        </>
    )
}

export default StudyPlan
