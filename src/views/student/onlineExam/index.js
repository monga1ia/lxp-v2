import { Grid } from '@material-ui/core'
import TimerIcon from 'cs-line-icons/custom/TimerIcon'
import message from 'modules/message'
import React, { useEffect, useState } from 'react'
import { Button, Card, Col, Image, Row } from 'react-bootstrap'
import { BottomScrollListener } from 'react-bottom-scroll-listener'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min'
import { fetchRequest } from 'utils/fetchRequest'
import { dateObjectFormat } from 'utils/utils'
import ExamEmpty from '../img/ExamEmpty'

const OnlineExam = () => {
    const { t } = useTranslation()

    const history = useHistory()

    const [list, setList] = useState([])
    const [tabList, setTabList] = useState([])
    const [selectedTab, setSelectedTab] = useState(null)
    const [loading, setLoading] = useState(false)

    const [page, setPage] = useState(false)
    const [pageLoading, setPageLoading] = useState(false)
    const [morePage, setMorePage] = useState(false)

    const onStartExam = (id) => {
        history.push({
            pathname: "/exam/information",
            state: { id }
        })
    }

    const onViewExam = (id) => {
        history.push({
            pathname: "/exam/view",
            state: { id }
        })
    }

    const onBottomReached = () => {
        if (morePage) {
            setPage(prev => prev + 1)
            setPageLoading(true)
            fetchInit(page + 1, selectedTab)
        }
    }

    const onTabChange = (key) => {
        setSelectedTab(key)
        setLoading(true)
        setPage(1)
        fetchInit(1, key)
    }

    const fetchInit = (page = 1, status = null) => {
        const params = {
            page,
            pageSize: 10,
            status
        }
        fetchRequest("api/student/exam/index", "POST", params)
            .then(res => {
                if (res.success) {
                    if (page > 1) {
                        setList(prev => {
                            const tempList = [...prev]
                            if (res.exams && res.exams.length > 0) {
                                res.exams.forEach(obj => {
                                    tempList.push(obj)
                                })
                            }
                            return tempList
                        })
                    } else {
                        setList(res.exams)
                    }
                    setTabList(res.statuses)
                    if (res.selectedStatus !== status) {
                        setSelectedTab(res.selectedStatus)
                    }
                    setMorePage(res.exams.length + list.length < res.totalCount)
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
        return <div className='d-flex flex-row align-items-center mb-3'>
            {
                tabList.map((obj, index) => {
                    return <Button
                        key={index}
                        variant={selectedTab == obj.code ? 'outline-primary' : 'empty'}
                        onClick={() => onTabChange(obj.code)}
                    >
                        <h5 className={selectedTab !== obj.code ? 'text-black m-0' : 'm-0'}>
                            {obj.name || ''}
                        </h5>
                    </Button>
                })
            }
        </div>
    }

    const ListItems = ({ list = [] }) => {
        if(!list.length) {
            return <Grid item xs={12} className='d-flex justify-content-center align-items-center' style={{marginTop: '5rem'}}>
                <div className='d-flex flex-column'>
                    <ExamEmpty/>
                    <span className='text-semi-large m-0 p-0 mt-3'>{t('onlineExam.empty')}</span>
                </div>
            </Grid>
        }
        return list.map((obj, index) => {
            return <Grid key={index} item md={4} xs={3}>
                <Card className='mb-3'>
                    <Card.Body className='pt-3 pb-3'>
                        <div className='d-flex flex-row align-items-center mb-3'>
                            <Image src={obj.subjectImage} style={{ resize: 'block', height: '30px', borderRadius: '6px' }} />
                            <h6 className="ml-3" style={{ color: '#8993A5' }}>{obj.subjectName || ''}</h6>
                        </div>
                        <h4 className="mb-3 text-primary">{obj.name}</h4>
                        <span className="text-medium" style={{ color: '#8993A5' }}>
                            {obj?.startDate ? dateObjectFormat(obj.startDate) : ''} - {obj?.endDate ? dateObjectFormat(obj.endDate) : ''}
                        </span>
                        <div className='d-flex flex-row align-items-center mt-3 mb-3'>
                            <TimerIcon />
                            <span className="text-medium ml-2" style={{ color: '#8993A5' }}>
                                {obj.duration} {t('common.minute')}
                            </span>
                        </div>
                        {
                            selectedTab == "ACTIVE"
                                ?
                                <h6 className="text-medium mb-3" style={{ color: '#FF003D' }}>
                                    {obj.remaining}
                                </h6>
                                : null
                        }

                        {
                            !obj.isRepeat && selectedTab == "SENT"
                                ?
                                <div className='mb-3 btn'>
                                    <span className='text-white' style={{ fontSize: '1rem' }} >1</span>
                                </div>
                                : null
                        }

                        {
                            selectedTab == "SENT"
                                ?
                                <Row className='m-0'>
                                    <Button className={obj.isRepeat ? 'mb-3' : ''} variant='secondary' onClick={() => onViewExam(obj.id)}>
                                        <span className='text-primary'>{t('onlineExam.viewScore')}</span>
                                    </Button>
                                </Row>
                                : null
                        }

                        {
                            selectedTab == "ACTIVE"
                                ?
                                <Row className='m-0'>
                                    <Button variant='primary' onClick={() => onStartExam(obj.id)}>
                                        {t('onlineExam.start')}
                                    </Button>
                                </Row>
                                : null
                        }

                        {
                            selectedTab == "SENT" && obj.isRepeat
                                ?
                                <Row className='m-0'>
                                    <Button variant='primary' onClick={() => onStartExam(obj.id)}>
                                        {t('onlineExam.restart')}
                                    </Button>
                                </Row>
                                : null
                        }
                    </Card.Body>
                </Card>
            </Grid>
        })
    }

    return (
        <>
            <div className="student-page-title-container mb-3">
                <h1 className="mb-0 pb-0 display-4">{t('onlineExam.title')}</h1>
            </div>

            <div className='pr-6'>
                <Tabs />

                <BottomScrollListener
                    onBottom={onBottomReached}
                    offset={500}
                >
                    <Grid container className='mb-3 row'>
                        <ListItems list={list} />
                    </Grid>

                    {
                        pageLoading
                            ?
                            <svg className="splash-spinner" viewBox="0 0 50 50">
                                <circle className="path" cx="25" cy="25" r="20" fill="none" strokeWidth="5" />
                            </svg>
                            : null
                    }
                    
                </BottomScrollListener>
            </div>

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
        </>
    )
}

export default OnlineExam
