import { Grid } from '@material-ui/core'
import TimerIcon from 'cs-line-icons/custom/TimerIcon'
import message from 'modules/message'
import React, { useEffect, useState } from 'react'
import { Button, Card, Col, Image, Row } from 'react-bootstrap'
import { Target, Smile, Star, Frown } from 'lucide-react';
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min'
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Typography from "@mui/material/Typography";
import { fetchRequest } from 'utils/fetchRequest'
import { studentCouncilIndex, studentCouncilInfo, studentCouncilCancelRequest, studentStudyPlanSubmit } from 'utils/fetchRequest/Urls';
import InviteModal from './modals/invite';
import UserListModal from './modals/userList';
import Tabs from './components/tabs'
import ListItems from './components/items'

const CouncilIndex = () => {
    const { t } = useTranslation()
    const history = useHistory()

    const [list, setList] = useState([])
    const [monthList, setMonthList] = useState([
        {
            id: 1,
            name: '10-р сар',
            children: [
                {
                    id: 1,
                    day: 15,
                    title: 'Сурагчдын зөвлөл',
                    name: 'Ээлжит уулзалт',
                    startTime: '09:00',
                    endTime: '15:00'
                },
                {
                    id: 2,
                    day: 16,
                    title: 'Сурагчдын зөвлөл',
                    name: 'Ээлжит уулзалт',
                    startTime: '09:00',
                    endTime: '15:00'
                },
                {
                    id: 2,
                    day: 17,
                    title: 'Сурагчдын зөвлөл',
                    name: 'Ээлжит уулзалт',
                    startTime: '09:00',
                    endTime: '15:00'
                },
            ]
        }
    ])
    const [tabList, setTabList] = useState([
        {
            id: 1,
            code: 'OPEN',
            name: t('council.openCouncil'),
        },
        {
            id: 2,
            code: 'MEMBER',
            name: t('council.myCouncil'),
        }
    ])
    const [selectedTab, setSelectedTab] = useState('OPEN')
    const [searchValue, setSearchValue] = useState('')
    const [selectedObj, setSelectedObj] = useState(null)
    const [loading, setLoading] = useState(false)
    const [page, setPage] = useState(false)
    const [showUserListModal, setShowUserListModal] = useState(false)
    const [showInviteModal, setShowInviteModal] = useState(false)
    const [initLoader, setInitLoader] = useState(true)
    const [studentList, setStudentList] = useState([])

    const onTabChange = (key) => {
        setList([])
        setSelectedTab(key)
        const params = {
            type: key
        }

        fetchInit(params)
    }

    const fetchInit = (params = null) => {
        setLoading(true)
        fetchRequest(studentCouncilIndex, "POST", params)
            .then(res => {
                if (res.success) {
                    setList(res?.councils || [])
                    setInitLoader(false)
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
    }

    useEffect(() => {
        const params = {
            type: selectedTab
        }

        fetchInit(params)
    }, [])

    useEffect(() => {
        if(!initLoader){
            let timeout = setTimeout(() => {
                const params = {
                    type: selectedTab,
                    search: searchValue
                }
                fetchInit(params)
            }, 1000);
            return () => {
                clearTimeout(timeout);
            };
        }
    }, [searchValue]);

    const onHandlerInputChange = (e) => {
        if (e.key === 'Enter') {
            const params = {
                type: selectedTab,
                search: e.target.value
            }
            fetchInit(params)
        }

        setSearchValue(e.target.value);
    }

    const handlerItemAccordion = (e, id) => {
        let cloneList = [...monthList]

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

        setMonthList(cloneList)
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

    const onHandlerInvite = (e, object) => {
        e.preventDefault();
        e.stopPropagation();
        setSelectedObj(object)
        setShowInviteModal(true)
    }

    const onHandlerCancel = (e, object) => {
        e.preventDefault();
        e.stopPropagation();

        const params = {
            council: object.id,
        }

        setLoading(true)
        fetchRequest(studentCouncilCancelRequest, "POST", params)
            .then(res => {
                if (res.success) {
                    let cloneList = [...list]

                    if(cloneList && cloneList.length > 0){
                        for(let i = 0; i < cloneList.length; i++){
                            if(cloneList[i].id == object.id){
                                cloneList.splice(i, 1);
                            }
                        }
                    }

                    setList(cloneList)
                    message(res.message, true)
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
    
    const onHandlerNameClick = (e, object) => {
        e.preventDefault();
        e.stopPropagation();
        setSelectedObj(object)

        const params = {
            council: object.id,
        }

        setLoading(true)
        fetchRequest(studentCouncilInfo, "POST", params)
            .then(res => {
                if (res.success) {
                    setLoading(false)
                    setStudentList(res?.members || [])
                    setShowUserListModal(true)
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

    const MonthItems = ({ list = [] }) => {
        return list.map((obj, index) => {
            return (
                <Grid key={index} item md={12} xs={12}>
                    <Accordion
                        expanded={obj?.isExpand || false}
                        onChange={(e) => handlerItemAccordion(e, obj.id)}
                        className="accordion-container-regular"
                    >
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                            className="accordion-header d-flex justify-content-between"
                        >
                            <Typography className='fs-16 black-color font-weight-500'>
                                {obj.name}
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails style={{padding: '0 1.5rem 1.5rem 1.5rem'}}>
                            <ul className="list-group">
                                {
                                    obj.children && obj.children.length > 0 &&
                                    obj.children.map((child, cIndex) => {
                                        return (
                                            <li key={'month_' + cIndex} className="w-100 d-flex justify-content-between align-items-center mt-3">
                                                <div className="d-flex align-items-center w-100">
                                                    <div className="d-flex align-items-center justify-content-center fs-20 font-weight-700" style={{backgroundColor: '#F1F2F4', width: 60, height: 72, borderTopLeftRadius: 4, borderBottomLeftRadius: 4}}>
                                                        {child?.day || '-'}
                                                    </div>
                                                    <div className="fs-13 w-100" style={{backgroundColor: '#F7F8F9', height: 72, borderTopRightRadius: 4, borderBottomRightRadius: 4}}>
                                                        <span className='d-block black-color fs-16 ms-3' style={{fontWeight: 300}}>{child?.title || '-'}</span>
                                                        <span className='d-block black-color fs-16 ms-3 font-weight-700' style={{fontWeight: 300}}>{child?.name || '-'}</span>
                                                        <span className='d-block black-color fs-16 ms-3' style={{fontWeight: 300}}>{(child?.startTime || '-') + ' - ' + (child?.endTime || '-')}</span>
                                                    </div>
                                                </div>
                                            </li>
                                        )
                                    })
                                }
                            </ul>
                        </AccordionDetails>
                    </Accordion>
                </Grid>
            )
        })
    }

    const onHandlerCloseModal = (isSubmit) => {
        setShowUserListModal(false)
        setShowInviteModal(false)
        setSelectedObj(null)

        if(isSubmit){
            const params = {
                type: selectedTab
            }
    
            fetchInit(params)
        }
    }

    return (
        <>
            <div className="student-page-title-container mb-3">
                <h1 className="mb-0 pb-0 display-4">{t('council.title')}</h1>
            </div>

            <div className='row pr-6'>
                <Tabs 
                    tabList={tabList} 
                    selectedTab={selectedTab}
                    searchValue={searchValue}
                    onTabChange={onTabChange}
                    onHandlerInputChange={onHandlerInputChange}
                />

                <Grid container className='mb-3'>
                    {/* {
                        selectedTab == 'MEMBER' &&
                        <MonthItems
                            list={monthList} 
                            type={selectedTab} 
                        />
                    } */}
                    {
                        list && list.length > 0
                        ?
                            <ListItems 
                                councils={list}
                                selectedTab={selectedTab}
                                accordionAction={handlerAccordion}
                                accordionInvite={onHandlerInvite}
                                accordionCancel={onHandlerCancel}
                                accordionNameClick={onHandlerNameClick}
                            />
                        :
                            <div className='col-12 text-center mt-5'>
                                <p className='fs-16'><b>{selectedTab == 'OPEN' ? t('council.errorMessage.emptyOpen') : t('council.errorMessage.emptyMember')}</b></p>
                            </div>
                    }
                </Grid>
                {
                    showUserListModal &&
                    <UserListModal
                        show={showUserListModal}
                        onClose={onHandlerCloseModal}
                        object={selectedObj}
                        list={studentList}
                    />
                }
                {
                    showInviteModal &&
                    <InviteModal
                        show={showInviteModal}
                        onClose={onHandlerCloseModal}
                        object={selectedObj}
                    />
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

export default CouncilIndex
