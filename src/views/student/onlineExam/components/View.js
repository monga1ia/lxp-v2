import { Grid } from '@material-ui/core'
import ArrowLeftIcon from 'cs-line-icons/custom/ArrowLeftIcon'
import React, { useEffect, useState } from 'react'
import { Button, Card, Col, Row } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { useHistory, useLocation } from 'react-router-dom/cjs/react-router-dom.min'
import { CircularProgressbarWithChildren } from "react-circular-progressbar";
import { fetchRequest } from 'utils/fetchRequest'
import VisibilityIcon from '@mui/icons-material/Visibility';
import message from 'modules/message'
import { takenPercent } from 'utils/utils'
import ViewModal from "../modal/ViewModal";
import { DragList } from './dragAndDrop/dragList'
import { Dropzone } from './dragAndDrop/dropZone'

const View = () => {
    const { id } = useLocation()?.state || {}
    const { t } = useTranslation()
    const history = useHistory()

    const [item, setItem] = useState(null)
    const [selectedPath, setSelectedPath] = useState(null)
    const [showModal, setShowModal] = useState(false)
    const [questionList, setQuestionList] = useState([])
    const [loading, setLoading] = useState(false)

    const onSelectTab = (id) => {
        const container = document.getElementById(id);
        container.scrollIntoView({ behavior: 'smooth' });
    }

    const fetchInit = () => {
        setLoading(true)
        fetchRequest('api/student/exam/result', "POST", { exam: id })
            .then(res => {
                if (res.success) {
                    let questions = res?.questions || [];

                    if(questions && questions.length > 0){
                        for(let i = 0; i < questions.length; i++){
                            if(questions[i].qTypeCode == 'MATCH'){
                                let answers = questions[i].answers
                                let values = questions[i].values
                                if(answers && answers.length > 0){
                                    for(let a = 0; a < answers.length > 0; a++){
                                        if(answers[a].userValue){
                                            let existingValue = values.find(value => value.id == answers[a].userValue)
                                            if(existingValue){
                                                answers[a].qId = existingValue.id;
                                                answers[a].qValue = existingValue.value;
                                                answers[a].qPath = existingValue.filePath;
                                                answers[a].qEquation = existingValue.equation;
                                                answers[a].qType = existingValue.valueType;
                                                answers[a].item = existingValue;
                                                answers[a].value = existingValue;
                                            }
                                        }
                                        
                                        if(values && values.length > 0){
                                            for(let q = 0; q < values.length; q++){
                                                if(answers[a].userValue != values[q].id && answers[a].valueId == values[q].id){
                                                    answers[a].correctValue = values[q]
                                                    // values.splice(q, 1);
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }

                    setQuestionList(questions || [])
                    setItem(res.exam)
                } else {
                    message(res.message)
                }
            })
            .catch(() => {
                message(t('errorMessage.title'));
            })
            .finally(() => {
                setLoading(false)
            })
    }

    useEffect(() => {
        if (id) {
            fetchInit()
        }
    }, [id])

    const QuestionTabs = ({ list = [] }) => {
        return list.map((obj, index) => {
            let variant = 'outline-danger'
            if (obj.takenScore) {
                if (obj.takenScore < obj.score) {
                    variant = 'outline-warning'
                } else {
                    variant = 'outline-success'
                }
            }
            return <Row key={index} className={index == 0 ? 'm-0' : 'm-0 mt-2'}>
                <Button variant={variant} onClick={() => onSelectTab(obj.id)}>
                    <div className='d-flex flex-row justify-content-between'>
                        <div style={{ width: 30 }} />
                        {
                            obj.takenScore ?
                                <>{obj.score} | {obj.takenScore} {t('onlineExam.score')}</>
                                : obj.score
                        }
                        <ColoredCheck isChecked={obj.takenScore} isYellow={obj.score > obj.takenScore} />
                    </div>
                </Button>
            </Row>
        })
    }

    const renderAnswer = (answer, index) => {
        if(answer){
            if(answer.answerType == 'text'){
                return (
                    <div className='text-medium text-dark ml-2'>
                        {/* {(index + 1) + '.' + answer.answer} */}
                        { answer.answer }
                    </div>
                )
            } else if(answer.answerType == 'image'){
                return (
                    <div className='d-flex mt-1 mb-1'>
                        {/* <div>
                            {(index + 1) + '.'}
                        </div> */}
                        <img src={answer.filePath} height={80} width={80} style={{borderRadius: 6}}/>
                        <VisibilityIcon fontSize='small cursor' style={{position: 'relative', bottom: 6, right: 10}} onClick={() => onViewHandler(answer.filePath)}/>
                    </div>
                )
            } else if(answer.answerType == 'equation'){
                return (
                    // <div className='d-flex' dangerouslySetInnerHTML={{ __html: (index + 1) + '.' + answer.answer }}/>
                    <div className='d-flex text-medium text-dark ml-2' dangerouslySetInnerHTML={{ __html: answer.answer }}/>
                )
            } else if(answer.answerType == 'mbscript'){
                return (
                    // <div className='text-semi-large text-dark ml-2 tradition-text tradition-text-student' dangerouslySetInnerHTML={{ __html: (index + 1) + '.' + answer.answer }}/>
                    <div className='text-semi-large text-dark ml-2 tradition-text tradition-text-student' dangerouslySetInnerHTML={{ __html: answer.answer }}/>
                )
            }
        }
    }

    const onViewHandler = (image) => {
        setSelectedPath(image)
        setShowModal(true)
    }

    const AnswerOptions = ({ list = [], match = [], answer = null, typeCode = '', question = null, values = [] }) => {
        if (typeCode == 'TEST') {
            return list.map((obj, index) => {
                let backgroundColor = 'transparent'
                if (obj.isCorrect) {
                    backgroundColor = '#63C1324c'
                } else if (answer == obj.id && !obj.isCorrect) {
                    backgroundColor = '#FF003D4c'
                }
                return <Row key={index} className='w-50 m-0 mt-2' >
                    <Button
                        className='d-flex flex-row align-items-center'
                        variant='empty'
                        style={{ backgroundColor }}
                    >
                        <CheckCircleIcon isChecked={answer == obj.id} />
                        {
                            renderAnswer(obj)
                        }
                    </Button>
                    {
                        question.hasDescription && (obj.isCorrect || answer == obj.id) &&
                        <div style={{color: '#868AA8', borderRadius:6, width: '100%', padding: '5px 12px', marginTop: 4, fontStyle: 'italic'}}>
                            {/* {obj?.description} */}
                            <div dangerouslySetInnerHTML={{ __html: obj?.description || ''}}/>
                        </div>
                    }
                </Row>
            })
        } else if (typeCode == 'MULTI') {
            return list.map((obj, index) => {
                const isAnswer = answer && answer.length > 0 ? !!answer.find(str => str == obj.id) : false
                let backgroundColor = 'transparent'
                if (obj.isCorrect) {
                    backgroundColor = '#63C1324c'
                } else if (isAnswer && !obj.isCorrect) {
                    backgroundColor = '#FF003D4c'
                }

                return <Row key={index} className='w-50 m-0 mt-2' >
                    <Button key={index} className='d-flex flex-row align-items-center' style={{ backgroundColor }} variant='empty'>
                        <CheckCircleIcon isChecked={isAnswer} />
                        {
                            renderAnswer(obj)
                        }
                    </Button>
                    {
                        question.hasDescription && (obj.isCorrect || isAnswer) &&
                        <div style={{color: '#868AA8', borderRadius:6, width: '100%', padding: '5px 12px', marginTop: 4, fontStyle: 'italic'}}>
                            {/* {obj?.description} */}
                            <div dangerouslySetInnerHTML={{ __html: obj?.description || ''}}/>
                        </div>
                    }
                </Row>
            })
        } else if (typeCode == 'LINK') {
            return <div className='w-60'>
                <Row>
                    <Col />
                    {
                        list[0]?.values.map((obj, index) => {
                            return <Col key={index} className='d-flex flex-column justify-content-center align-items-center'>
                                <span className='text-dark text-semi-large m-0'>
                                    {obj.name}
                                </span>
                            </Col>
                        })
                    }
                </Row>
                {
                    list.map((match, rowIndex) => {
                        const rowAnswer = answer && answer.length > 0 ? answer.find(obj => obj.answer == match.id) : null
                        return <Row key={rowIndex} className='mt-2'>
                            <Col className='d-flex justify-content-end align-items-center'>
                                <span className='text-dark text-semi-large m-0'>
                                    {match.name}
                                </span>
                            </Col>
                            {
                                match.values?.map((obj, index) => {
                                    const isAnswer = rowAnswer ? rowAnswer.value == obj.id : false

                                    let backgroundColor = 'transparent'
                                    if (match.correctValue == obj.id) {
                                        backgroundColor = '#63C1324c'
                                    } else if (isAnswer && match.correctValue != obj.id) {
                                        backgroundColor = '#FF003D4c'
                                    }
                                    return (
                                        <Col
                                            key={index}
                                            className='d-flex flex-column justify-content-center align-items-center'
                                            style={{ backgroundColor, borderRadius: '4px' }}
                                        >
                                            <Button
                                                key={index}
                                                className='d-flex flex-row align-items-center' variant='empty'
                                            >
                                                <CheckCircleIcon isChecked={isAnswer} />
                                            </Button>
                                        </Col>
                                    )
                                })
                            }
                        </Row>
                    })
                }
            </div>
        }  else if (typeCode == 'MATCH'){
            return (
                <>
                    <div className='card-alternate-student mb-2'>
                        <div className='col-12 d-flex dnd-style'>
                            <div className='col-12'>
                                {
                                    list.map((mAnswer, index) => {
                                        let backgroundColor = 'transparent'
                                        if (mAnswer['userValue'] == mAnswer['valueId']) {
                                            backgroundColor = '#63C1324c'
                                        } else {
                                            backgroundColor = '#FF003D4c'
                                        }

                                        return (
                                            <div 
                                                key={'mAnswer_' + index} 
                                                className={'d-flex justify-content-between mb-1'} 
                                                style={{
                                                    padding: '0 100px', 
                                                    background: backgroundColor, 
                                                    borderRadius: 10,
                                                    paddingTop: '0.5rem'
                                                }}
                                            >
                                                <div className='d-flex align-items-center' style={{width: 300}}>
                                                    {renderAnswer(mAnswer, index)}
                                                </div>
                                                <div style={mAnswer['userValue'] != mAnswer['valueId'] ? {position: 'relative', left: 94} : {}}>
                                                    <Dropzone
                                                        key={'answer_' + index}
                                                        questionType={mAnswer.qType}
                                                        questionId={question}
                                                        id={mAnswer.id}
                                                        listData={mAnswer}
                                                        hideRemoveIcon={true}
                                                        correctValue={mAnswer?.correctValue ? mAnswer.correctValue : null}
                                                        correctType={mAnswer?.correctValue ? mAnswer.correctValue.valueType : null}
                                                    />
                                                </div>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </div>
                    </div>
                </>
            )
        } else {
            return null
        }
    }

    const Question = ({ list = [] }) => {
        return list.map((obj, index) => {
            return <section id={obj.id} key={index} className='card-alternate mb-2 question-table-style'>
                <div className='d-flex flex-row justify-content-end mb-3'>
                    <span className='mb-3'>{t('onlineExam.score')}: {obj.score}</span>
                </div>
                {
                    obj?.hasTradition
                    ?
                        <div className='text-semi-large text-dark ml-2 tradition-text' dangerouslySetInnerHTML={{ __html: obj?.content.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&') }} style={{height: 'auto'}}/>
                    :
                        <div dangerouslySetInnerHTML={{ __html: obj?.content }} />
                }
                {/* <div dangerouslySetInnerHTML={{ __html: obj.content }} /> */}

                {
                    obj.answers?.length > 0
                        ?
                        <AnswerOptions
                            question={obj}
                            list={obj.answers}
                            answer={obj.userAnswers}
                            typeCode={obj.qTypeCode}
                            values={obj.values}
                        />
                        : null
                }
            </section>
        })
    }

    return (
        <>
            <Row className='ml-2'>
                <Col md={3} style={{ position: 'relative' }}>
                    <Card className='mt-4'>
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
                                        value={takenPercent(item?.takenScore, item?.totalScore)}
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
                                            {`${takenPercent(item?.takenScore, item?.totalScore)}%`}
                                        </span>
                                    </CircularProgressbarWithChildren>
                                </div>
                                <div className='d-flex flex-column'>
                                    <span className='text-semi-large' style={{ color: '#8993A5' }}>{t('onlineExam.takenScore')}</span>
                                    <h5>{item?.takenScore || 0} | {takenPercent(item?.takenScore, item?.totalScore)}%</h5>
                                </div>
                            </div>
                        </Card.Body>
                        <Card.Footer className='p-2'>
                            <div className='d-flex flex-row justify-content-between align-items-center'>
                                <span className='text-semi-large' style={{ color: '#8993A5' }}>{t('onlineExam.score')}:</span>
                                <h5>{item?.totalScore}</h5>
                            </div>
                        </Card.Footer>
                    </Card>
                    <Card className='mt-2' style={{ overflow: 'hidden' }}>
                        <Card.Body className='p-2'>
                            <QuestionTabs list={questionList} />
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={9} className='background-white' style={{ overflow: 'hidden', maxHeight: '100%' }}>
                    <div className="student-page-title-container mb-3">
                        <Button variant='empty' onClick={() => history.goBack()}>
                            <ArrowLeftIcon />
                        </Button>
                        <h1 className="mb-0 pb-0 display-4">{t('common.back')}</h1>
                    </div>
                    <h4 className="mb-3 text-primary ml-5">{item?.name}</h4>
                    <Grid container spacing={2} className='mb-3'>
                        <Grid item md={3}>
                            <div className='card-alternate mb-2'>
                                <span className='text-medium text-black'>{t('onlineExam.correctAnswers')}</span>
                                <div className='d-flex flex-row justify-content-end w-100 mt-3'>
                                    <h6 className=' m-0' style={{ color: '#63C132' }}>{item?.correctCount}</h6>
                                </div>
                            </div>
                        </Grid>
                        <Grid item md={3}>
                            <div className='card-alternate mb-2'>
                                <span className='text-medium text-black'>{t('onlineExam.inComplete')}</span>
                                <div className='d-flex flex-row justify-content-end w-100 mt-3'>
                                    <h6 className='m-0' style={{ color: '#FB8500' }} >{item?.incompleteCount}</h6>
                                </div>
                            </div>
                        </Grid>
                        <Grid item md={3}>
                            <div className='card-alternate mb-2'>
                                <span className='text-medium text-black'>{t('onlineExam.wrongAnswers')}</span>
                                <div className='d-flex flex-row justify-content-end w-100 mt-3'>
                                    <h6 className='m-0' style={{ color: '#FF003D' }}>{item?.wrongCount}</h6>
                                </div>
                            </div>
                        </Grid>
                        <Grid item md={3}>
                            <div className='card-alternate mb-2'>
                                <span className='text-medium text-black'>{t('onlineExam.noAnswer')}</span>
                                <div className='d-flex flex-row justify-content-end w-100 mt-3'>
                                    <h6 className='m-0' style={{ color: '#091E42' }}>{item?.noAnswerCount}</h6>
                                </div>
                            </div>
                        </Grid>
                    </Grid>
                    <Question list={questionList} />

                    <div className='d-flex flex-row border-top p-3' style={{ marginRight: '-1rem', marginLeft: '-1rem' }}>
                        <Button variant='secondary' onClick={() => history.goBack()}>
                            <span className='text-primary'>{t('onlineExam.backToHome')}</span>
                        </Button>
                    </div>
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

export default View

const CheckCircleIcon = ({ isChecked }) => {
    if (isChecked) {
        return <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="0.5" y="0.5" width="29" height="29" rx="14.5" stroke="#3C358F" />
            <rect x="6.5" y="6.5" width="17" height="17" rx="8.5" fill="#3C358F" stroke="#3C358F" />
        </svg>

    }
    return <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="0.5" y="0.5" width="29" height="29" rx="14.5" fill="white" stroke="#D8D8D8" />
    </svg>
}

const ColoredCheck = ({ isChecked, isYellow }) => {
    if (isChecked) {
        if (isYellow) {
            return <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd"
                    d="M20 10C20 15.523 15.523 20 10 20C4.477 
                    20 0 15.523 0 10C0 4.477 4.477 0 10 0C15.523 
                    0 20 4.477 20 10ZM13.7071 8.70711C14.0976 
                    8.31658 14.0976 7.68342 13.7071 7.29289C13.3166 
                    6.90237 12.6834 6.90237 12.2929 7.29289L9 10.5858L7.70711 
                    9.29289C7.31658 8.90237 6.68342 8.90237 6.29289 
                    9.29289C5.90237 9.68342 5.90237 10.3166 6.29289 
                    10.7071L8.29289 12.7071C8.68342 13.0976 9.31658 
                    13.0976 9.70711 12.7071L13.7071 8.70711Z" fill="#FB8500"
                />
            </svg>

        }
        return <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd"
                d="M20 10C20 15.523 15.523 20 10 20C4.477 20 0 15.523 
                0 10C0 4.477 4.477 0 10 0C15.523 0 20 4.477 20 10ZM13.7071 
                8.70711C14.0976 8.31658 14.0976 7.68342 13.7071 7.29289C13.3166 
                6.90237 12.6834 6.90237 12.2929 7.29289L9 10.5858L7.70711 
                9.29289C7.31658 8.90237 6.68342 8.90237 6.29289 9.29289C5.90237 
                9.68342 5.90237 10.3166 6.29289 10.7071L8.29289 12.7071C8.68342 
                13.0976 9.31658 13.0976 9.70711 12.7071L13.7071 8.70711Z" fill="#63C132"
            />
        </svg>
    }

    return <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M11 21C16.5228 21 21 16.5228 21 11C21 5.47715 16.5228 1 
            11 1C5.47715 1 1 5.47715 1 11C1 16.5228 5.47715 21 11 21Z" fill="#FF003D"
            stroke="#FF003D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        />
        <path d="M14 8L8 14M8 8L14 14" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
}