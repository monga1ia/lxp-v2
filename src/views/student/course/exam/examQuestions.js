import { ChevronLeft, ChevronRight } from '@material-ui/icons'
import HtmlHead from "components/html-head/HtmlHead";
import React, { useCallback, useEffect, useState } from 'react'
import { Button, Card, Col, Image, Row } from 'react-bootstrap'
import { BottomScrollListener } from 'react-bottom-scroll-listener'
import { useTranslation } from 'react-i18next'
import ReactAudioPlayer from 'react-audio-player';
import CsLineIcons from "cs-line-icons/CsLineIcons";
import { useHistory, useLocation } from 'react-router-dom/cjs/react-router-dom.min'
import { toTime } from 'utils/utils'
import message from 'modules/message'
import { fetchRequest } from 'utils/fetchRequest'
import { onlineLessonExamQuestion } from 'utils/fetchRequest/Urls'
import SubmitModal from './modal/SubmitModal'
import VisibilityIcon from '@mui/icons-material/Visibility'
import { DragList } from '../../onlineExam/components/dragAndDrop/dragList'
import { Dropzone } from '../../onlineExam/components/dragAndDrop/dropZone'
import ViewModal from "./modal/ViewModal";

const Questions = () => {
    const { t } = useTranslation()
    const history = useHistory()
    const location = useLocation()
    const headDescription = "Elearning Portal Course List Page";

    const [counter, setCounter] = useState(0)
    const [questionList, setQuestionList] = useState([])
    const [pageList, setPageList] = useState([])
    const [selected, setSelected] = useState(null)
    const [openModal, setOpenModal] = useState(false)
    const [loading, setLoading] = useState(false)
    const [first, setFirst] = useState(false)
    const [hasDuration, setHasDuration] = useState(false)
    const [counterStarted, setCounterStarted] = useState(false)
    const [examData, setExamData] = useState(null)

    const [selectedPath, setSelectedPath] = useState(null)
    const [showModal, setShowModal] = useState(false)

    const examId = location?.state?.examId;
    const courseId = location?.state?.courseId;
    const subjectId = location?.state?.subjectId;
    const title = location?.state?.title;
    const activeDetail = location?.state?.activeDetail;
    const activeParentIndex = location?.state?.activeParentIndex;
    const activeIndex = location?.state?.activeIndex;
    const componentType = location?.state?.componentType;

    const onSelect = item => {
        fetchInit(item.page)
    }

    const onPagePrev = () => {
        fetchInit(selected - 1)
    }

    const onPageNext = () => {
        fetchInit(selected + 1)
    }

    const onAnswer = (id, question) => {
        const tempAnswers = [...questionList]
        const index = questionList.findIndex(obj => obj.qId == question)

        if (index != -1) {
            tempAnswers[index].userAnswers = id
        }
        onSubmitAnswer(question, id)
        setQuestionList(tempAnswers)
    }

    const onMultiAnswer = (id, question) => {
        const tempAnswers = [...questionList]
        const index = questionList.findIndex(obj => obj.qId == question)
        let clear = 0
        if (index != -1) {
            const obj = tempAnswers[index]
            if (obj) {
                if (obj.userAnswers && obj.userAnswers.length > 0) {
                    const exist = obj.userAnswers.find(str => str == id)

                    if (exist) {
                        obj.userAnswers = obj.userAnswers.filter(str => str !== id)
                        clear = 1
                    } else {
                        obj.userAnswers.push(id)
                    }
                } else {
                    obj.userAnswers = [id]
                }
            }
        }
        onSubmitAnswer(question, id, null, clear)
        setQuestionList(tempAnswers)
    }

    const onLink = (id, row, question) => {
        const tempAnswers = [...questionList]
        const index = questionList.findIndex(obj => obj.qId == question)

        if (index != -1) {
            const obj = tempAnswers[index]
            if (obj) {
                if (obj.userAnswers && obj.userAnswers.length > 0) {
                    const rowExist = obj.userAnswers.find(obj => obj.answer == row)

                    if (rowExist) {
                        rowExist.value = id
                    } else {
                        obj.userAnswers.push({
                            answer: row,
                            value: id
                        })
                    }
                } else {
                    obj.userAnswers = [{
                        answer: row,
                        value: id
                    }]
                }
                onSubmitAnswer(question, row, id)
            }
        }
        setQuestionList(tempAnswers)
    }

    const onAnswerClear = (question) => {
        const tempAnswers = [...questionList]
        const index = questionList.findIndex(obj => obj.qId == question)

        if (index != -1) {
            tempAnswers[index].userAnswers = null
        }
        setQuestionList(tempAnswers)

        fetchRequest('api/student/exam/clear-answer', 'POST', { exam: location?.state?.examId, question })
            .then(res => {
                if (!res.success) {
                    message(res.message)
                }
            })
            .catch(e => {
                message(t('errorMessage.title'));
            })
    }

    const onSubmitAnswer = (question, answer, value, clear = 0) => {
        fetchRequest('api/student/exam/question-answer', 'POST', { exam: location?.state?.examId, question, answer, value, clear })
            .then(res => {
                if (!res.success) {
                    message(res.message)
                }
            })
            .catch(e => {
                message(t('errorMessage.title'));
            })
    }

    const fetchInit = (page = 1) => {
        let params = {
            exam: location?.state?.examId,
            page
        }

        setLoading(true)
        fetchRequest(onlineLessonExamQuestion, 'POST', params)
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

                                                if(values && values.length > 0){
                                                    for(let q = 0; q < values.length; q++){
                                                        if(existingValue.id == values[q].id){
                                                            values.splice(q, 1);
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }

                    setQuestionList(questions)
                    setPageList(res.pages)
                    setSelected(page)
                    setCounter(res.remaining)
                    setFirst(true)
                    setHasDuration(res?.hasDuration || false)
                    setExamData(res?.exam || null)
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
        fetchInit(1)
    }, [])

    useEffect(() => {
        if(counter == 0){
            setCounterStarted(true)
            if(counterStarted && hasDuration){
                onSubmitData()
            }
        }

        if (counter > 0) {
            const interval = setInterval(() => {
                setCounter(prev => prev - 1);
            }, 1000);
            return () => clearInterval(interval);
        } else if (first) {
            // history.replace({
            //     pathname: "/exam/view",
            //     state: location?.state?.examId
            // })
        } 
    }, [counter])

    const returnNoAnswerList = () => {
        const tempList = []

        if (pageList && pageList.length) {
            pageList.forEach(obj => {
                obj.notCompleted?.map((str) => {
                    if(selected == str){
                        if (questionList && questionList.length > 0) {
                            for(let i = 0; i < questionList.length; i++){
                                if(questionList[i].qTypeCode == 'MULTI' || questionList[i].qTypeCode == 'LINK'){
                                    if(questionList[i]?.userAnswers && questionList[i]?.userAnswers.length == 0){
                                        tempList.push(str)
                                        break
                                    } else if (!questionList[i]?.userAnswers){
                                        tempList.push(str)
                                        break
                                    }
                                } else if(questionList[i].qTypeCode == 'TEST') {
                                    if (!questionList[i]?.userAnswers){
                                        tempList.push(str)
                                        break
                                    }
                                } else if(questionList[i].qTypeCode == 'MATCH') {
                                    if (questionList[i]?.values.length > 0 ){
                                        tempList.push(str)
                                        break
                                    }
                                }
                            }
                        }
                    } else {
                        tempList.push(str)
                    }
                })
            })
        }

        let existingSelectedId = tempList.find(temp => temp == selected)

        if(!existingSelectedId){
            if(selected){
                if (questionList && questionList.length > 0) {
                    for(let i = 0; i < questionList.length; i++){
                        if(questionList[i].qTypeCode == 'MATCH') {
                            if (questionList[i]?.values.length > 0 ){
                                tempList.push(selected)
                                break
                            }
                        }
                    }
                }
            }
    
            tempList.sort();
        }

        return tempList
    }

    const Pagination = () => {
        if (pageList && pageList.length) {
            return pageList.map((obj, index) => {
                return (
                    <Button
                        key={index}
                        variant={selected == obj.page ? 'primary' : 'outline-primary'}
                        onClick={() => onSelect(obj)}
                        className={'d-flex flex-row w-100 align-items-center justify-content-between' + (index + 1 < pageList.length ? ' mb-3' : '')}
                    >
                        <div style={{ width: 20 }} />
                        <h5 className='m-0'>{obj.page}</h5>
                        {obj.completed && selected != obj.page ? <CheckIcon /> : <div style={{ width: 20 }} />}
                    </Button>
                )
            })
        }

        return null
    }

    const onDropSubmit = (questionId, answerId, item) => {
        let cloneQuestionList = [...questionList]

        if(cloneQuestionList && cloneQuestionList.length > 0){
            for(let i = 0; i < cloneQuestionList.length; i++){
                if(questionId == cloneQuestionList[i].qId){
                    if(cloneQuestionList[i].answers && cloneQuestionList[i].answers.length > 0){
                        let answers = cloneQuestionList[i].answers
                        for(let a = 0; a < answers.length; a++){
                            if(answerId == answers[a].id){
                                if(!answers[a].qId){
                                    setLoading(true)
                                    fetchRequest('api/student/exam/question-answer', 'POST', { exam: location?.state?.examId, question: questionId, answer: answerId, value: item.id })
                                        .then(res => {
                                            if (res.success) {
                                                answers[a].qId = item.id;
                                                answers[a].qValue = item.name;
                                                answers[a].qPath = item.path;
                                                answers[a].qEquation = item.equation;
                                                answers[a].qType = item.type;
                                                answers[a].item = item;
    
                                                if(cloneQuestionList[i].values && cloneQuestionList[i].values.length > 0){
                                                    let values = cloneQuestionList[i].values;
                
                                                    for(let q = 0; q < values.length; q++){
                                                        if(item.id == values[q].id){
                                                            answers[a].value = values[q];
                                                            values.splice(q, 1);
                                                        }
                                                    }
                                                }
                                                setLoading(false)
                                            } else {
                                                message(res.message)
                                                setLoading(false)
                                            }
                                        })
                                        .catch(e => {
                                            message(t('errorMessage.title'));
                                        })
                                }
                                // answers[a].qId = item.id;
                                // answers[a].qValue = item.name;
                                // answers[a].qPath = item.path;
                                // answers[a].qEquation = item.equation;
                                // answers[a].qType = item.type;
                                // answers[a].item = item;

                                // if(cloneQuestionList[i].values && cloneQuestionList[i].values.length > 0){
                                //     let values = cloneQuestionList[i].values;

                                //     for(let q = 0; q < values.length; q++){
                                //         if(item.id == values[q].id){
                                //             answers[a].value = values[q];
                                //             values.splice(q, 1);
                                //         }
                                //     }
                                // }
                            }
                        }
                    }
                }
            }
        }

        setQuestionList(cloneQuestionList)
    }

    const removeDrop = (questionId, answerId) => {
        let cloneQuestionList = [...questionList]

        if(cloneQuestionList && cloneQuestionList.length > 0){
            for(let i = 0; i < cloneQuestionList.length; i++){
                if(questionId == cloneQuestionList[i].qId){
                    if(cloneQuestionList[i].answers && cloneQuestionList[i].answers.length > 0){
                        let answers = cloneQuestionList[i].answers
                        for(let a = 0; a < answers.length; a++){
                            if(answerId == answers[a].id){
                                setLoading(true)
                                fetchRequest('api/student/exam/clear-answer', 'POST', { exam: location?.state?.examId, question: questionId, answer: answerId, value: answers[a].qId})
                                    .then(res => {
                                        if (res.success) {
                                            cloneQuestionList[i].values.push(answers[a].value);

                                            answers[a].qId = null;
                                            answers[a].qValue = null;
                                            answers[a].item = null;
                                            answers[a].qPath = null;
                                            answers[a].qEquation = null;
                                            setLoading(false)
                                        } else {
                                            message(res.message)
                                            setLoading(false)
                                        }
                                    })
                                    .catch(e => {
                                        message(t('errorMessage.title'));
                                    })
                                // cloneQuestionList[i].values.push(answers[a].value);

                                // answers[a].qId = null;
                                // answers[a].qValue = null;
                                // answers[a].qItem = null;
                                // answers[a].qPath = null;
                                // answers[a].qEquation = null;
                            }
                        }
                    }
                }
            }
        }

        setQuestionList(cloneQuestionList)
    }

    const onViewHandler = (image) => {
        setSelectedPath(image)
        setShowModal(true)
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
                        <VisibilityIcon fontSize='small cursor' style={{position: 'relative', bottom: 10, right: 10}} onClick={() => onViewHandler(answer.filePath)}/>
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

    const AnswerOptions = ({ list = [], answer = null, typeCode = '', question = null, values = [] }) => {
        if (typeCode == 'TEST') {
            return list.map((obj, index) => {
                return <Button key={index} className='d-flex flex-row align-items-center' variant='empty' onClick={() => onAnswer(obj.id, question)}>
                    <CheckCircleIcon isChecked={answer == obj.id} />
                    {
                        renderAnswer(obj)
                    }
                    {
                        obj.filePath
                            ?
                            <Image src={obj.filePath} style={{ resize: 'block', height: '120px', marginLeft: '1.2rem' }} />
                            : null
                    }
                </Button>
            })
        } else if (typeCode == 'MULTI') {
            return list.map((obj, index) => {
                const isAnswer = answer && answer.length > 0 ? !!answer.find(str => str == obj.id) : false
                return <Button key={index} className='d-flex flex-row align-items-center' variant='empty' onClick={() => onMultiAnswer(obj.id, question)}>
                    <CheckCircleIcon isChecked={isAnswer} />
                    {
                        renderAnswer(obj)
                    }
                    {
                        obj.filePath
                            ?
                            <Image src={obj.filePath} style={{ resize: 'block', height: '120px', marginLeft: '1.2rem' }} />
                            : null
                    }
                </Button>
            })
        } else if (typeCode == 'LINK') {
            return <div className='w-60 mt-3'>
                <Row className='mt-0'>
                    <Col />
                    {
                        list[0]?.values?.map((obj, index) => {
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
                        return <Row key={rowIndex} className='mt-0'>
                            <Col className='d-flex justify-content-end align-items-center'>
                                <span className='text-dark text-semi-large m-0'>
                                    {match.name}
                                </span>
                            </Col>
                            {
                                match.values?.map((obj, index) => {
                                    const isAnswer = rowAnswer ? rowAnswer.value == obj.id : false
                                    return <Col key={index} className='d-flex flex-column justify-content-center align-items-center mt-2'>
                                        <Button
                                            key={index}
                                            className='d-flex flex-row align-items-center p-0' variant='empty'
                                            onClick={() => onLink(obj.id, match.id, question)}
                                        >
                                            <CheckCircleIcon isChecked={isAnswer} />
                                        </Button>
                                    </Col>
                                })
                            }
                        </Row>
                    })
                }
            </div>
        }else if (typeCode == 'MATCH'){
            return (
                <>
                    <div className='card-alternate-student mb-2'>
                        <div className='col-12 d-flex dnd-style'>
                            <div className='col-12'>
                                {
                                    list.map((mAnswer, index) => {
                                        return (
                                            <div key={'mAnswer_' + index} className={mAnswer.qType == 'image' ? 'd-flex justify-content-between' : 'd-flex justify-content-between'} style={{padding: '0 100px'}}>
                                                <div className='d-flex align-items-center' style={{width: 300}}>
                                                    {renderAnswer(mAnswer, index)}
                                                </div>
                                                <div >
                                                    <Dropzone
                                                        key={'answer_' + index}
                                                        questionType={mAnswer.qType}
                                                        questionId={question}
                                                        id={mAnswer.id}
                                                        listData={mAnswer}
                                                        onDropSubmit={onDropSubmit}
                                                        removeDrop={removeDrop}
                                                    />
                                                </div>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </div>
                    </div>
                    {
                        values && values.length > 0 &&
                        <div className='col-12 d-flex' style={{overflow: 'auto', height: 100}}>
                            {
                                values.map((mQuestion, index) =>
                                    <DragList
                                        key={'mQuestion' + index}
                                        id={mQuestion.id}
                                        type={mQuestion.valueType}
                                        name={mQuestion.value}
                                        path={mQuestion.filePath}
                                        equation={mQuestion.equation}
                                    />
                                )
                            }
                        </div>
                    }
                </>
            )
        } else {
            return null
        }
    }

    const renderClearArea = (object = null) => {
        if(object.qTypeCode == 'MULTI'){
            if(object.userAnswers && object.userAnswers.length > 0){
                return (
                    <Button variant='outline-primary' className='mt-3' onClick={() => onAnswerClear(object.qId)}>
                        <XCircle />
                        <span className='ml-2 text-medium text-black'>{t('onlineExam.deleteAnswer')}</span>
                    </Button>
                )
            }
        } else {
            if(object.userAnswers){
                return (
                    <Button variant='outline-primary' className='mt-3' onClick={() => onAnswerClear(object.qId)}>
                        <XCircle />
                        <span className='ml-2 text-medium text-black'>{t('onlineExam.deleteAnswer')}</span>
                    </Button>
                )
            }
        }

        return null;
    }

    const Question = ({ list = [] }) => {
        return <BottomScrollListener
            onBottom={() => { }}
            offset={500}
        >
            {
                list.map((obj, index) => {
                    return <div key={index} className='card-alternate mb-2 question-table-style'>
                        {
                            examData?.hasScore && 
                            <div className='d-flex flex-row justify-content-end mb-3'>
                                <span className='mb-3'>{t('onlineExam.score')}: {obj.score}</span>
                            </div>
                        }
                        {
                            obj?.hasTradition
                            ?
                                <div className='text-semi-large text-dark ml-2 tradition-text' dangerouslySetInnerHTML={{ __html: obj?.content.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&') }} style={{height: 'auto'}}/>
                            :
                                <div dangerouslySetInnerHTML={{ __html: obj?.content }}/>
                        }
                        {/* <div dangerouslySetInnerHTML={{ __html: obj.content }} /> */}
                        {
                            obj.files && obj.files.length > 0
                                ?
                                <div className='col-12 text-center'>
                                    {
                                        obj.files.map((file, index) => {
                                            if(file.type == "QUESTION_IMAGE"){
                                                return (
                                                    <div key={'image_' + index} className="col-12">
                                                        <img src={file.path} height={100} width={100}/>
                                                        <VisibilityIcon fontSize='small cursor' style={{position: 'relative', bottom: 50, right: 7}} onClick={() => onViewHandler(file.path)}/>
                                                    </div>
                                                )
                                            } else if(file.type == "QUESTION_AUDIO"){
                                                return (
                                                    <div key={'audio_' + index} className="col-12 mt-3">
                                                        <ReactAudioPlayer
                                                            controls
                                                            src={file.path}
                                                        />
                                                    </div>
                                                )
                                            }
                                            
                                            return null
                                        })
                                    }
                                </div>
                                : null
                        }
                        {
                            obj.answers?.length > 0
                                ?
                                <AnswerOptions
                                    question={obj.qId}
                                    list={obj.answers}
                                    match={obj.matchOptions}
                                    answer={obj.userAnswers}
                                    typeCode={obj.qTypeCode}
                                    values={obj.values}
                                />
                                : null
                        }

                        {renderClearArea(obj)}
                    </div>
                })
            }
        </BottomScrollListener>
    }

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

    const onSubmitData = () => {
        setLoading(true)
        fetchRequest('api/student/exam/finish','POST', { exam: examData.id })
            .then(res=>{
                if (res.success) {
                    history.replace({
                        pathname: "/lesson/exam-view",
                        state: { 
                            id: examData.id,
                            courseId: courseId,
                            subjectId: subjectId,
                            title: title,
                            activeDetail,
                            activeParentIndex,
                            activeIndex
                        }
                    })
                } else {
                    message(res.message)
                }
            })
            .catch(e=>{
                message(t('errorMessage.title'));
            })
            .finally(()=>{
                setLoading(false)
            })
    }

    return (
        <>
            <HtmlHead title={title} description={headDescription} />
            <div className="student-page-title-container">
                <div className="cursor ml-4 student-course-exam-back-icon-container" onClick={() => onHandlerBack()}>
                    <CsLineIcons
                        icon="arrow-left"
                        className="mr-2"
                        size="20"
                    />
                </div>
                <h1 className="mb-0 pb-0 display-4">
                    {title}
                </h1>
            </div>

            <Row className='m-0'>
                <Col md={3} className='pl-0 mt-3'>
                    {
                        hasDuration &&
                        <Card className='mb-3 ml-3'>
                            <Card.Body className='p-3'>
                                <div className='d-flex flex-row align-items-center'>
                                    <TimerIcon stroke='#191919' />
                                    <div className='d-flex flex-column ml-2'>
                                        <span className='text-medium' style={{ color: '#8993A5' }}>
                                            {t('onlineExam.duration')}
                                        </span>
                                        <h6 className='mb-0'>{toTime(counter)}</h6>
                                    </div>
                                </div>
                            </Card.Body>
                        </Card>
                    }
                    <Card className='mb-3 ml-3'>
                        <Card.Body className='p-3'>
                            <div className='d-flex flex-column align-items-center'>
                                <Pagination />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                {
                    selected
                        ?
                        <Col md={9} className='p-0'>
                            <Card className='border-less'>
                                <Card.Body>
                                    <div>
                                        <b style={{fontSize: 14}}>{t('onlineLesson.knowledgeReinforcementQuestions')}</b>
                                    </div>
                                    <div className='mb-3' />
                                    <Question list={questionList} />
                                </Card.Body>
                                <Card.Footer style={{padding: '1.5rem 2rem'}}>
                                    <div className='d-flex flex-row justify-content-between'>
                                        <div className='btn btn-empty' />

                                        <div className='d-flex flex-row w-60 student-course-exam-buttons' >
                                            {
                                                selected > 1
                                                    ?
                                                    <Button variant='primary' onClick={onPagePrev} className='mr-2'>
                                                        <ChevronLeft className='mr-2' />
                                                        {t('onlineExam.prevQuestion')}
                                                    </Button>
                                                    : null
                                            }
                                            {
                                                selected < pageList.length && pageList.length > 1
                                                    ?
                                                    <Button variant='primary' onClick={onPageNext}>
                                                        {t('onlineExam.nextQuestion')}
                                                        <ChevronRight className='ml-2' />
                                                    </Button>
                                                    : null
                                            }
                                            {/* {
                                                pageList && pageList.length > 1 && 
                                                <>
                                                    <Button variant='primary' onClick={onPagePrev} className='mr-2'>
                                                        <ChevronLeft className='mr-2' />
                                                        <span>
                                                            {t('onlineExam.prevQuestion')}
                                                        </span>
                                                    </Button>
                                                    <Button variant='primary' onClick={onPageNext}>
                                                        <span>
                                                            {t('onlineExam.nextQuestion')}
                                                        </span>
                                                        <ChevronRight className='ml-2' />
                                                    </Button>
                                                </>
                                            } */}
                                        </div>

                                        <Button variant='primary' onClick={() => onSubmitData()}>
                                            {t('onlineLesson.check')}
                                        </Button>
                                    </div>
                                </Card.Footer>
                            </Card>
                        </Col>
                        : null
                }
            </Row>
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
            {
                openModal &&
                <SubmitModal 
                    id={location?.state?.examId} 
                    open={openModal} 
                    onClose={() => setOpenModal(false)} 
                    noAnswerList={returnNoAnswerList()} 
                />
            }
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
        </>
    )
}

export default Questions

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

const CheckIcon = () => {
    return <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" clipRule="evenodd"
            d="M20 10C20 15.523 15.523 20 10 20C4.477 
            20 0 15.523 0 10C0 4.477 4.477 0 10 0C15.523 
            0 20 4.477 20 10ZM13.7071 8.70711C14.0976 
            8.31658 14.0976 7.68342 13.7071 7.29289C13.3166 
            6.90237 12.6834 6.90237 12.2929 7.29289L9 
            10.5858L7.70711 9.29289C7.31658 8.90237 6.68342 
            8.90237 6.29289 9.29289C5.90237 9.68342 5.90237 
            10.3166 6.29289 10.7071L8.29289 12.7071C8.68342 
            13.0976 9.31658 13.0976 9.70711 12.7071L13.7071 
            8.70711Z" fill="#3C358F"
        />
    </svg>

}

const XCircle = () => {
    return <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12.5001 7.50002L7.50008 12.5M7.50008 7.50002L12.5001 
            12.5M18.3334 10C18.3334 14.6024 14.6025 18.3334 10.0001 
            18.3334C5.39771 18.3334 1.66675 14.6024 1.66675 10C1.66675 
            5.39765 5.39771 1.66669 10.0001 1.66669C14.6025 1.66669 
            18.3334 5.39765 18.3334 10Z" stroke="#18181B" strokeWidth="1.67"
            strokeLinecap="round" strokeLinejoin="round"
        />
    </svg>

}

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
