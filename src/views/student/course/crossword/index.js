import React, { useEffect, useState, useRef } from 'react'
import { Grid } from '@material-ui/core'
import CsLineIcons from "cs-line-icons/CsLineIcons";
import { Button, Card, Col, Row } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { useHistory, useLocation } from 'react-router-dom/cjs/react-router-dom.min'
import { CircularProgressbarWithChildren } from "react-circular-progressbar";
import secureLocalStorage from 'react-secure-storage'
import { studentCrosswordData, studentUpdateCrosswordData, studentFinishCrossword } from 'utils/fetchRequest/Urls';
import { fetchRequest } from 'utils/fetchRequest'
import message from 'modules/message'
import CrossWordComponent from 'modules/CrossWord';
import { takenPercent, listToCrosswordObj, toTime } from 'utils/utils'
import { isFloat } from 'utils/utils';

const crosswordDurationIndex = ['crossword_local_duration_index'];

const CrosswordView = () => {
    const { id, courseId, crosswordId, syllabusDtlId, subjectId, title, activeDetail, activeParentIndex, activeIndex, componentType } = useLocation()?.state || {}

    const { t } = useTranslation()
    const history = useHistory()
    const location = useLocation()

    const [counter, setCounter] = useState(0)
    const [item, setItem] = useState(null)
    const [crossword, setCrossword] = useState(null)
    const [showModal, setShowModal] = useState(false)
    const [loading, setLoading] = useState(false)
    const localDuration = secureLocalStorage?.getItem(crosswordDurationIndex + '_' + crosswordId) || 0

    const [crosswordList, setCrosswordList] = useState([])
    const [crosswordData, setCrosswordData] = useState({
        across: {},
        down: {}
    })
    const [studentJsonData, setStudentJsonData] = useState([]);
    const [oldStudentJsonData, setOldStudentJsonData] = useState([]);

    const fetchInit = () => {
        let params = {
            crossword: crosswordId,
            dtl: syllabusDtlId
        }

        setLoading(true)
        fetchRequest(studentCrosswordData, "POST", params)
            .then(res => {
                if (res.success) {
                    console.log('res', res)
                    if(res.crossword && res.crossword.jsonData && res.crossword.jsonData.length > 0){
                        setCrosswordList(res.crossword.jsonData)
                        setCrosswordData(listToCrosswordObj(res.crossword.jsonData, res.crossword.statusCode == 'FINISH' ? true : false))
                    }

                    if(localDuration && localDuration > res.crossword.duration){
                        setCounter(localDuration || 0)
                    } else {
                        setCounter(res.crossword.duration || 0)
                    }

                    setOldStudentJsonData(res?.crossword?.studentJsonData)
                    setStudentJsonData(res?.crossword?.studentJsonData)
                    
                    setCrossword(res.crossword || null)
                } else {
                    message(res.message)
                }
            })
            .catch(e => {
                message(t('errorMessage.title'));
            })
            .finally(() => {
                setLoading(false)
            })
    }

    const fetchUpdate = (params) => {
        fetchRequest(studentUpdateCrosswordData, "POST", params)
            .then(res => {
                if (res.success) {
                    // 
                } else {
                    message(res.message)
                }
            })
            .catch(e => {
                message(t('errorMessage.title'));
            })
            .finally(() => {
                setLoading(false)
            })
    }

    useEffect(() => {
        if(crossword?.statusCode != 'FINISH'){
            const interval = setInterval(() => {
                setCounter(counter + 1);
    
                if(counter > 0){
                    if(!isFloat((counter / 10))){
                        let params = {
                            crossword: crosswordId,
                            dtl: syllabusDtlId,
                            duration: counter
                        }
        
                        fetchUpdate(params)
                    }
                }
        
                secureLocalStorage.setItem(crosswordDurationIndex + '_' + crosswordId, counter)
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [counter])

    useEffect(() => {
        if (crosswordId) {
            fetchInit()
        }
    }, [crosswordId])

    const onHandlerBack = () => {
        history.push({
            pathname: "/lesson/info",
            state: {
                courseId: courseId,
                subjectId: subjectId,
                title: title,
                activeDetail,
                activeParentIndex,
                activeIndex,
                componentType
            }
        });
    }

    const onCheck = () => {
        let params = {
            crossword: crosswordId,
            dtl: syllabusDtlId,
            duration: counter,
        }

        setLoading(true)
        fetchRequest(studentFinishCrossword, "POST", params)
            .then(res => {
                if (res.success) {
                    if(res.crossword && res.crossword.jsonData && res.crossword.jsonData.length > 0){
                        // setCrosswordList(res.crossword.jsonData)
                        // setCrosswordData(listToCrosswordObj(res.studentCrosswordData, true))
                    }

                    // if(localDuration && localDuration > res.crossword.duration){
                    //     setCounter(localDuration || 0)
                    // } else {
                    //     setCounter(res.crossword.duration || 0)
                    // }

                    // setStudentJsonData(res?.crossword?.studentJsonData)
                    setCrossword(res.crossword || null)
                } else {
                    message(res.message)
                }
            })
            .catch(e => {
                message(t('errorMessage.title'));
            })
            .finally(() => {
                setLoading(false)
            })
    }

    const onCellChange = (row, col, char, initLoader) => {
        if(initLoader){
            if(crossword?.statusCode == 'FINISH'){
                let cloneData = []

                if(oldStudentJsonData && oldStudentJsonData.length > 0){
                    let isMatch = false;
                    for(let i = 0; i < oldStudentJsonData.length; i++){
                        if(oldStudentJsonData[i].row == row && oldStudentJsonData[i].col == col){
                            isMatch = true
                            cloneData.push({
                                row: row,
                                col: col,
                                char: oldStudentJsonData[i].char
                            })
                        }
                    }

                    if(!isMatch){
                        cloneData.push({
                            row: row,
                            col: col,
                            char: ''
                        })
                    }
                }

                setStudentJsonData(cloneData)
            } else {
                if(!loading){
                    let params = {
                        crossword: crosswordId,
                        dtl: syllabusDtlId,
                        duration: counter,
                        row: row,
                        col: col,
                        char: char,
                    }
                
                    fetchUpdate(params)
                }
            }
        }
    }


    return (
        <>
            <Row className='mr-0'>
                {
                    crossword?.statusCode == 'FINISH' && crossword.totalScore > 0 &&
                    <Col md={3} className='pl-0 mt-3' style={{ position: 'relative' }}>
                        <Card className='ml-3 student-exam-report-top-card'>
                            <Card.Body className='p-2'>
                                <div className='d-flex flex-row align-items-center'>
                                    <div
                                        style={{
                                            width: 75,
                                            height: 75,
                                            position: "relative",
                                            marginRight: '1rem'
                                        }}
                                    >
                                        <CircularProgressbarWithChildren
                                            value={takenPercent(crossword?.takenScore, crossword?.totalScore)}
                                            counterClockwise
                                            maxValue={100}
                                            minValue={0}
                                            styles={{
                                                root: {
                                                    width: 75,
                                                    height: 75
                                                },
                                                path: {
                                                    stroke: `#36A3F7`,
                                                    strokeLinecap: "round",
                                                    strokeWidth: 8,
                                                    transition: "stroke-dashoffset 0.5s ease 0s",
                                                },
                                                trail: {
                                                    stroke: "#d6d6d6",
                                                    strokeWidth: 8,
                                                }
                                            }}
                                        >
                                            <span className='text-medium' style={{ color: '#36A3F7' }}>
                                                {`${takenPercent(crossword?.takenScore, crossword?.totalScore)}%`}
                                            </span>
                                        </CircularProgressbarWithChildren>
                                    </div>
                                    <div className='d-flex flex-column'>
                                        <span className='text-semi-large' style={{ color: '#8993A5' }}>{t('onlineExam.takenScore')}</span>
                                        <h5 className='font-bold'>{crossword?.takenScore || 0} | {takenPercent(crossword?.takenScore, crossword?.totalScore)}%</h5>
                                    </div>
                                </div>
                            </Card.Body>
                            <Card.Footer className='p-2'>
                                <div className='d-flex flex-row justify-content-between align-items-center'>
                                    <span className='text-semi-large' style={{ color: '#8993A5' }}>{t('onlineExam.score')}:</span>
                                    <h5>{crossword?.totalScore}</h5>
                                </div>
                            </Card.Footer>
                        </Card>
                    </Col>
                }
                <Col md={crossword?.statusCode == 'FINISH' && crossword.totalScore > 0 ? 9 : 12} className='background-white' style={{ overflow: 'hidden', maxHeight: '100%' }}>
                    <div className='d-flex justify-content-between student-page-title-container mb-3'>
                        <div className="student-exam-report-back-button d-flex align-items-center">
                            <Button variant='empty' onClick={() => onHandlerBack()} style={{padding: '7px 5px'}}>
                                <CsLineIcons
                                    stroke='#212529'
                                    icon="arrow-left"
                                    className="mr-2"
                                    size="20"
                                />
                            </Button>
                            <h1 className="mb-0 pb-0 display-4">{t('common.back')}</h1>
                        </div>
                        {
                            crossword?.statusCode && crossword?.statusCode != 'FINISH' 
                            ?
                                <div className='d-flex flex-row align-items-center mr-4'>
                                    <TimerIcon stroke='#191919' />
                                    <div className='d-flex flex-column ml-2'>
                                        <span className='text-medium' style={{ color: '#8993A5' }}>
                                            {t('common.duration')}
                                        </span>
                                        <h6 className='mb-0'>{toTime(counter)}</h6>
                                    </div>
                                </div>
                            :
                                null
                        }
                    </div>
                    <div>
                        <h5 className="mb-2 text-primary font-bold student-exam-report-header">{crossword?.title || ''}</h5>
                    </div>
                    {
                        crossword?.description &&
                        <div>
                            <div className="mb-3 font-bold student-exam-report-header">{t('common.description') + ': ' + crossword?.description || ''}</div>
                        </div>
                    }
                    <CrossWordComponent 
                        containerClassName={crossword?.statusCode && crossword?.statusCode != 'FINISH' ? 'student-crossword-finished-style' : 'student-crossword-style'}
                        acrossLabel={t('crossWord.acrossLabel')}
                        downLabel={t('crossWord.downLabel')}
                        data={crosswordData}
                        onCellChange={onCellChange}
                        guestData={studentJsonData}
                        isResult={true}
                    />
                    {
                        crossword?.statusCode && crossword?.statusCode != 'FINISH'
                        ?
                            <div className='col-12 text-center mb-4 mt-1'>
                                <Button variant='primary' onClick={onCheck}>
                                    {t('onlineLesson.check')}
                                </Button>
                            </div>
                        : null
                    }
                </Col>
            </Row>
            {
                showModal &&
                <ViewModal
                    show={showModal}
                    onClose={() => {
                        setShowModal(false)
                    }}
                    path={selectedPath}
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
        </>
    )
}

export default CrosswordView

const TimerIcon = () => {
    return <svg width="24" height="30" viewBox="0 0 24 30" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" clipRule="evenodd"
            d="M8 1.66665C8 0.930267 8.59695 0.333313 
            9.33333 0.333313H14.6667C15.403 0.333313 
            16 0.930267 16 1.66665C16 2.40303 15.403 
            2.99998 14.6667 2.99998H9.33333C8.59695 
            2.99998 8 2.40303 8 1.66665ZM12 8.33331C6.84534 
            8.33331 2.66667 12.512 2.66667 17.6666C2.66667 
            22.8213 6.84534 27 12 27C17.1547 27 21.3333 
            22.8213 21.3333 17.6666C21.3333 12.512 17.1547 
            8.33331 12 8.33331ZM0 17.6666C0 11.0392 5.37258 
            5.66665 12 5.66665C18.6274 5.66665 24 11.0392 24 
            17.6666C24 24.2941 18.6274 29.6666 12 29.6666C5.37258 
            29.6666 0 24.2941 0 17.6666ZM16.9428 12.7238C17.4635 
            13.2445 17.4635 14.0888 16.9428 14.6095L12.9428 
            18.6095C12.4221 19.1302 11.5779 19.1302 11.0572 
            18.6095C10.5365 18.0888 10.5365 17.2445 11.0572 
            16.7238L15.0572 12.7238C15.5779 12.2031 16.4221 
            12.2031 16.9428 12.7238Z" fill="#191919"
        />
    </svg>
}