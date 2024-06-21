import React, { useState, useEffect, useRef } from "react";
import { Row, Col, Card, Accordion, ListGroup, Image, Button, Modal } from "react-bootstrap";
import HtmlHead from "components/html-head/HtmlHead";
import CsLineIcons from "cs-line-icons/CsLineIcons";
import PlayCircleRoundedIcon from '@mui/icons-material/PlayCircleRounded';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useHistory, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import Box from '@mui/material/Box';
import Fade from '@mui/material/Fade';
import DialogCards from 'modules/DialogCards';
import { fetchRequest } from "utils/fetchRequest";
import { onlineLessonCourseInfo, onlineLessonCoursePage, onlineLessonCourseExamStart, studentCrosswordStart } from 'utils/fetchRequest/Urls';
import showMessage from "modules/message";
import { getWindowDimensions, capitalize, secondsToMs } from "utils/utils";
import WaitingApproveIcon from "cs-line-icons/custom/WaitingApproveIcon";
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import ViewModal from "../exam/modal/ViewModal";
import { priceFormat } from "utils/utils";

export default function StudentCourseInfo() {
    const { t } = useTranslation();
    const location = useLocation();
    const history = useHistory();
    const iframeRef = useRef();

    const title = location?.state?.title;
    const headDescription = "Elearning Portal Course List Page";

    const [loading, setLoading] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const [selectedPath, setSelectedPath] = useState(null)
    const [checked, setChecked] = useState(true)
    const [course, setCourse] = useState(null)
    const [user, setUser] = useState(null)
    const [content, setContent] = useState(null)
    const [activeIndex, setActiveIndex] = useState(null)
    const [activeDetail, setActiveDetail] = useState(null)
    const [activeParentIndex, setActiveParentIndex] = useState(null)
    const [nextDetail, setNextDetail] = useState(null)
    const [prevDetail, setPrevDetail] = useState(null)
    const [topics, setTopics] = useState([])
    const [isDescription, setIsDescription] = useState(false)
    const [isPrev, setIsPrev] = useState(false)
    const [isNext, setIsNext] = useState(false)
    const [isDialog, setIsDialog] = useState(false)
    const { height, width } = getWindowDimensions();

    const [componentType, setComponentType] = useState('')
    const [currentComponent, setCurrent] = useState(null)

    const [isComponentLocked, setIsComponentLocked] = useState(false)
    const [show, setShow] = useState(false)
    const [qrData,setQrData] = useState('')

    const courseId = location?.state?.courseId;
    const subjectId = location?.state?.subjectId;

    const init = (params) => {
        setLoading(true)
        fetchRequest(onlineLessonCourseInfo, 'POST', params)
            .then((res) => {
                if (res.success) {
                    setCourse(res?.course || null)
                    setUser(res?.user || null)
                    setIsDialog(true)

                    if(res.course) {
                        if(res.course.isSell && res.course.isActive) {
                            setShow(false)
                        }
                        if(res.course.isSell && !res.course.isActive) {
                            setTopics([])
                        } else {
                            setTopics(res?.topics || [])
                        }
                    }

                    if(!location?.state?.activeDetail){
                        setIsDescription(true)
                    }
                } else {
                    showMessage(res.message)
                }
                setLoading(false)
            })
            .catch(() => {
                showMessage(t('errorMessage.title'));
                setLoading(false)
            })
    }

    useEffect(() => {
        let params = {
            course: location?.state?.courseId
        }

        init(params);
    }, []);

    useEffect(() => {
        if (location?.state?.activeDetail) {
            onHandlerItem(location?.state?.activeDetail, parseInt(location?.state?.activeParentIndex?.split('_')[0]), parseInt(location?.state?.activeParentIndex?.split('_')[1]), (parseInt(location?.state?.activeIndex.split('_')[2])), location?.state?.componentType)
        }
    }, []);

    const onHandlerBack = () => {
        history.push({
            pathname: "/lesson/course",
            state: {
                id: courseId,
                subjectId: subjectId,
                title
            }
        });
    }

    const handleChange = () => {
        setChecked((prev) => !prev);
    };

    const onHandlerDescription = () => {
        setIsDescription(true)
        setActiveIndex(null)
        setActiveParentIndex(null)
    }

    const checkDone = (detail) => {
        let cloneTopics = [...topics]
        if(cloneTopics && cloneTopics.length > 0){
            for (let i = 0; i < topics.length; i++) {
                if (topics[i].syllabuses && topics[i].syllabuses.length > 0) {
                    let syllabuses = topics[i].syllabuses;
    
                    for (let s = 0; s < syllabuses.length; s++) {
                        if (syllabuses[s].details && syllabuses[s].details.length > 0) {
                            let details = syllabuses[s].details
                            for (let d = 0; d < details.length; d++) {
                                if (detail['id'] == details[d]['id']) {
                                    details[d].done = detail['done']
                                }
                            }
                        }
                    }
                }
            }
    
            setTopics(cloneTopics)
        }
    }

    const onHandlerItem = (detail, index, sIndex, dIndex, type) => {
        if (type == 'parent') {
            // setCurrent([]);
            setIsDescription(false)
            setActiveParentIndex(index + '_' + sIndex)
            setActiveIndex(null)
            setActiveDetail(detail)
            setIsComponentLocked(false)

            let params = {
                course: courseId,
                syllabus: detail[sIndex]?.syllabusId || null
            }

            if ((sIndex + 1) < detail.length) {
                setIsNext(true)
                setNextDetail(detail)
            } else {
                setIsNext(false)
                setNextDetail(null)
            }

            if (sIndex > 0) {
                setIsPrev(true)
                setPrevDetail(detail)
            } else {
                setIsPrev(false)
                setPrevDetail(null)
            }

            setLoading(true)
            fetchRequest(onlineLessonCoursePage, 'POST', params)
                .then((res) => {
                    if (res.success) {
                        setComponentType('parent')
                        setCurrent(res.components || [])
                        setIsDescription(false)
                    } else {
                        if (res?.locked) {
                            setCurrent([])
                            setIsComponentLocked(true)
                        } else {
                            showMessage(res.message)
                        }
                    }
                    setLoading(false)
                })
                .catch((e) => {
                    showMessage(t('errorMessage.title'));
                    setLoading(false)
                })
        } else {
            if (currentComponent && currentComponent.typeCode == 'VIDEO') {
                let currentParams = {
                    course: courseId,
                    syllabusDtl: currentComponent.id
                }
                fetchRequest(onlineLessonCoursePage, 'POST', currentParams)
                    .then((res) => {
                        if (res.success) {
                            // check done   
                            checkDone(res)
                            setIsDescription(false)
                        }
                    })
                    .catch((e) => {
                        showMessage(t('errorMessage.title'));
                        setLoading(false)
                    })
            }
            // setCurrent([]);
            setIsDescription(false)
            setActiveIndex(index + '_' + sIndex + '_' + dIndex)
            setActiveParentIndex(index + '_' + sIndex)
            setActiveDetail(detail)

            if ((dIndex + 1) < detail.length) {
                setIsNext(true)
                setNextDetail(detail)
            } else {
                setIsNext(false)
                setNextDetail(null)
            }

            if (dIndex > 0) {
                setIsPrev(true)
                setPrevDetail(detail)
            } else {
                setIsPrev(false)
                setPrevDetail(null)
            }
            
            setIsComponentLocked(false)

            let params = {
                course: courseId,
                syllabusDtl: detail[dIndex]?.id
            }

            setLoading(true)
            fetchRequest(onlineLessonCoursePage, 'POST', params)
                .then((res) => {
                    if (res.success) {
                        // check done
                        checkDone(res)
                        setComponentType('child')
                        setCurrent(res)
                        setIsDescription(false)
                    } else {
                        if (res?.locked) {
                            setCurrent([])
                            setIsComponentLocked(true)
                        } else {
                            showMessage(res.message)
                        }
                    }
                    setLoading(false)
                })
                .catch((e) => {
                    showMessage(t('errorMessage.title'));
                    setLoading(false)
                })
        }
    }

    const onAccordionClick = (data, index, sIndex) => {
        if (currentComponent && currentComponent.typeCode == 'VIDEO') {
            let currentParams = {
                course: courseId,
                syllabusDtl: currentComponent.id
            }
            fetchRequest(onlineLessonCoursePage, 'POST', currentParams)
                .then((res) => {
                    if (res.success) {
                        // check done   
                        checkDone(res)
                    } else {

                    }
                })
                .catch((e) => {
                    showMessage(t('errorMessage.title'));
                    setLoading(false)
                })
        }
        // setCurrent([])
        setIsDescription(false)
        setActiveParentIndex(index + '_' + sIndex)
        setActiveIndex(null)
        setActiveDetail(data.syllabuses)

        let params = {
            course: courseId,
            syllabus: data.syllabuses[sIndex].syllabusId
        }

        if ((sIndex + 1) < data.syllabuses.length) {
            setIsNext(true)
            setNextDetail(data.syllabuses)
        } else {
            setIsNext(false)
            setNextDetail(null)
        }

        if (sIndex > 0) {
            setIsPrev(true)
            setPrevDetail(data.syllabuses)
        } else {
            setIsPrev(false)
            setPrevDetail(null)
        }

        setIsComponentLocked(false)
        setLoading(true)
        fetchRequest(onlineLessonCoursePage, 'POST', params)
            .then((res) => {
                if (res.success) {
                    setComponentType('parent')
                    setCurrent(res.components || [])
                    setIsDescription(false)
                } else {
                    if (res?.locked) {
                        setCurrent([])
                        setIsComponentLocked(true)
                    } else {
                        showMessage(res.message)
                    }
                }
                setLoading(false)
            })
            .catch((e) => {
                showMessage(t('errorMessage.title'));
                setLoading(false)
            })
    }

    const renderTopics = (topicList) => {
        let topicParentDiv = []

        for (let i = 0; i < topicList.length; i++) {
            let syllabusDiv = []
            if (topicList[i].syllabuses && topicList[i].syllabuses.length) {
                let syllabuses = topicList[i].syllabuses;

                for (let s = 0; s < syllabuses.length; s++) {
                    let detailDiv = []
                    if (syllabuses[s].details && syllabuses[s].details.length > 0) {
                        let details = syllabuses[s].details

                        for (let d = 0; d < details.length; d++) {
                            detailDiv.push(
                                <ListGroup as="ol" numbered key={'topic_' + i + '_syllabus' + s + '_detail' + d}>
                                    <ListGroup.Item
                                        action
                                        className={activeIndex == (i + '_' + s + '_' + d) ? "d-flex justify-content-between align-items-start cursor active" : "d-flex justify-content-between align-items-start cursor"}
                                        onClick={() => onHandlerItem(details, i, s, d)}
                                    >
                                        {
                                            details[d].iconFile &&
                                            <img src={details[d].iconFile ? details[d].iconFile : ''} alt='icon' width={16} height={16} />
                                        }
                                        <div className="ms-2 me-auto">
                                            <div className="fw-bold font-weight-500" style={{ color: '#191919' }}>{details.title}</div>
                                            {details[d].name}
                                            {
                                                (details[d].typeCode == 'VIDEO' && details[d].videoDuration) && details[d].videoDuration > 0 
                                                ?
                                                    <div className="fs-13" style={{ color: '#888A99' }}>{secondsToMs(details[d].videoDuration)}</div>
                                                : null
                                            }
                                        </div>
                                        <div style={{ position: 'relative', left: 12 }}>
                                            {
                                                details[d]?.done &&
                                                <CircleCheck style={{ backgroundColor: 'white' }} />
                                            }
                                        </div>
                                    </ListGroup.Item>
                                </ListGroup>
                            )
                        }
                    }

                    syllabusDiv.push(
                        <Accordion
                            key={'syllabus_' + i + '_' + s}
                            defaultActiveKey={activeParentIndex}
                            className='accordion-custom-style'
                        >
                            <Accordion.Item
                                eventKey={i + '_' + s}
                            >
                                {
                                    course?.isManualOpen
                                    ?
                                        <Accordion.Header className={activeParentIndex == (i + '_' + s) ? 'active font-weight-500' : ''} onClick={() => onAccordionClick(topicList[i], i, s)} style={{ color: '#000' }}>
                                            {
                                                syllabuses[s].locked 
                                                ?
                                                    <>
                                                        <span className="mr-1"><CancelRoundedIcon style={{color: '#CBD4FA'}} width={20} height={20}/></span> {syllabuses[s].name}
                                                    </>
                                                :
                                                    syllabuses[s].name
                                            }
                                        </Accordion.Header>
                                    :
                                        <Accordion.Header className={activeParentIndex == (i + '_' + s) ? 'active font-weight-500' : ''} onClick={() => onAccordionClick(topicList[i], i, s)} style={{ color: '#000' }}>
                                            {syllabuses[s].name}
                                        </Accordion.Header>
                                }
                                <Accordion.Body>
                                    {detailDiv}
                                </Accordion.Body>
                            </Accordion.Item>
                        </Accordion>
                    )
                }
            }

            topicParentDiv.push(
                <div key={'topic_' + i}>
                    <div className="font-weight-700 fs-14 mb-2" style={{ color: '#3C358F' }}>{topicList[i].name}</div>
                    <div>
                        {syllabusDiv}
                    </div>
                </div>
            )
        }

        return topicParentDiv
    }

    const renderDetail = (
        <div style={{ width: '100%' }}>
            <div className="text-center">
                <div className="text-right" onClick={handleChange} style={{ position: 'relative', bottom: 8, left: 6 }}>
                    <img className="cursor expand-icon" src='/img/icon/layout-sidebar-right-expand.svg' alt="icon" />
                </div>
                <img
                    style={{ height: 150, borderRadius: 12 }}
                    src={course && course.cover ? course.cover : '/img/placeholder-img.png'}
                    className="w-100 object-fit-contain"
                    alt=""
                />
                <div
                    className="py-3"
                    style={{
                        fontWeight: 600,
                        fontSize: '14px',
                        borderBottom: '1px solid rgba(0, 0, 0, 0.125)'
                    }}
                >
                    {course?.name || null}
                </div>
            </div>

            <div className="" style={{ fontSize: 14 }}>
                <div className="d-flex align-items-center justify-content-between cursor mt-3" onClick={onHandlerDescription}>
                    <div className={isDescription ? "my-2 text-primary" : "my-2"}>{t('onlineLesson.description')}</div>
                    <PlayCircleRoundedIcon style={{ color: '#3c358f', position: 'relative', right: 5 }} />
                </div>
                {renderTopics(topics)}
            </div>
        </div>
    );

    const onViewHandler = (image) => {
        setSelectedPath(image)
        setShowModal(true)
    }

    const onBuy = () => {
        setLoading(true)
        const params = {
            course: location?.state?.courseId
        }
        fetchRequest('api/course/subscription/send/invoice', 'POST', params)
            .then((res) => {
                if (res.success) {
                    setShow(true)
                    setQrData(res.qrImage)
                } else {
                    showMessage(res.message)
                }
            })
            .catch(() => {
                showMessage(t('errorMessage.title'));
            })
            .finally(()=>{
                setLoading(false)
            })
    }

    const onClose = () => {
        setShow(false)
    }

    const onHandlerExamStart = (examId, hasResult = false) => {
        if (hasResult) {
            history.push({
                pathname: "/lesson/exam-view",
                state: {
                    courseId: courseId,
                    subjectId: subjectId,
                    title: title,
                    id: examId,
                    activeDetail,
                    activeParentIndex,
                    activeIndex,
                    componentType
                }
            });
        } else {
            let params = {
                exam: examId
            }

            setLoading(true)
            fetchRequest(onlineLessonCourseExamStart, 'POST', params)
                .then((res) => {
                    if (res?.hasResult) {
                        history.push({
                            pathname: "/lesson/exam-view",
                            state: {
                                courseId: courseId,
                                subjectId: subjectId,
                                title: title,
                                id: examId,
                                activeDetail,
                                activeParentIndex,
                                activeIndex,
                                componentType
                            }
                        });
                    }

                    if (res.success) {
                        history.push({
                            pathname: "/lesson/exam",
                            state: {
                                courseId: courseId,
                                subjectId: subjectId,
                                title: title,
                                examId: examId,
                                activeDetail,
                                activeParentIndex,
                                activeIndex,
                                componentType
                            }
                        });
                    } else {
                        showMessage(res.message)
                    }
                    setLoading(false)
                })
                .catch((e) => {
                    showMessage(t('errorMessage.title'));
                    setLoading(false)
                })
        }
    }

    const onHandlerCrosswordStart = (crossword, hasResult = false) => {
        console.log('crossword', crossword)
        let params = {
            dtl: crossword.syllabusDtlId,
            crossword: crossword.id
        }

        setLoading(true)
        fetchRequest(studentCrosswordStart, 'POST', params)
            .then((res) => {
                if (res.success) {
                    history.push({
                        pathname: "/lesson/crossword",
                        state: {
                            courseId: courseId,
                            crosswordId: crossword.id,
                            syllabusDtlId: crossword.syllabusDtlId,
                            subjectId: subjectId,
                            title: title,
                            activeDetail,
                            activeParentIndex,
                            activeIndex,
                            componentType
                        }
                    });
                } else {
                    showMessage(res.message)
                }
                setLoading(false)
            })
            .catch((e) => {
                showMessage(t('errorMessage.title'));
                setLoading(false)
            })
    }

    const OnlyContent = ({ obj = {} }) => {
        const { component, description } = obj
        return <div
            className='d-flex flex-column w-100 mb-3'
            style={{ border: `1px solid ${component?.color}`, borderRadius: '12px', overflow: 'hidden' }}
        >
            <div className='d-flex flex-row p-2 w-100 align-item-center' style={{ backgroundColor: component?.color }}>
                <span className="small-title text-white" >{component?.name}</span>
            </div>
            <div className='d-flex flex-row p-2 w-100' >
                {
                    obj?.isTraditionDescription
                        ?
                        <div className='text-semi-large text-dark ml-2 tradition-text' dangerouslySetInnerHTML={{ __html: description.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&') }} style={{ height: 'auto' }} />
                        :
                        <div dangerouslySetInnerHTML={{ __html: description }} />
                }
                {/* <div dangerouslySetInnerHTML={{ __html: description }} /> */}
            </div>
        </div>
    }

    const KeyWords = ({ obj = {} }) => {
        const { component, keyword, description } = obj
        return <div
            className='d-flex flex-column w-100 mb-3'
            style={{ border: `1px solid ${component?.color}`, borderRadius: '12px', overflow: 'hidden' }}
        >
            <div className='d-flex flex-row p-2 w-100 align-item-center' style={{ backgroundColor: component?.color }}>
                <span className="small-title text-white" >{component?.name}</span>
            </div>
            <div className='d-flex flex-row p-2 w-100' >
                <div className='d-flex flex-column'>
                    {
                        obj?.isTraditionKeyword
                            ?
                            <div className='text-semi-large text-dark ml-2 tradition-text' dangerouslySetInnerHTML={{ __html: keyword.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&') }} style={{ height: 'auto' }} />
                            :
                            <div dangerouslySetInnerHTML={{ __html: keyword.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&') }} />
                    }
                    {/* <div dangerouslySetInnerHTML={{ __html: keyword }} /> */}
                </div>
                <div className='d-flex flex-column ml-2'>
                    {
                        obj?.isTraditionDescription
                            ?
                            <div className='text-semi-large text-dark ml-2 tradition-text' dangerouslySetInnerHTML={{ __html: description.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&') }} style={{ height: 'auto' }} />
                            :
                            <div dangerouslySetInnerHTML={{ __html: description }} />
                    }
                    {/* <div dangerouslySetInnerHTML={{ __html: description }} /> */}
                </div>
            </div>
        </div>
    }

    const ImageContent = ({ obj = {} }) => {
        return <div className='d-flex flex-column w-100 mb-3'>
            <div className='d-flex flex-row p-2 w-100 align-item-center'>
                <span className="small-title text-dark" >{obj.title}</span>
            </div>
            <div className='d-flex flex-row p-2 w-100' >
                {
                    obj?.isTraditionDescription
                        ?
                        <div className='text-semi-large text-dark ml-2 tradition-text' dangerouslySetInnerHTML={{ __html: obj?.description.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&') }} style={{ height: 'auto' }} />
                        :
                        <div dangerouslySetInnerHTML={{ __html: obj.description }} />
                }
                {/* <div dangerouslySetInnerHTML={{ __html: obj.description }} /> */}
            </div>
            <div className='d-flex flex-row p-2 w-100' >
                {
                    obj.photoPath
                        ?
                        <div>
                            <Image src={obj.photoPath} style={{ resize: 'block', height: '120px' }} />
                            <VisibilityIcon fontSize='small cursor' style={{ position: 'relative', bottom: 60, right: 5 }} onClick={() => onViewHandler(obj.photoPath)} />
                        </div>
                        :
                        null
                }
            </div>
        </div>
    }

    const Audio = ({ obj = {} }) => {
        return <div className='d-flex flex-column w-100 mb-3'>
            <div className='d-flex flex-row p-2 w-100 align-item-center'>
                <span className="small-title text-dark" style={{ height: 'auto' }}>
                    {
                        obj?.isTraditionDescription
                            ?
                            <div className='text-semi-large text-dark ml-2 tradition-text' dangerouslySetInnerHTML={{ __html: obj?.title }} style={{ height: 'auto' }} />
                            :
                            <div className="small-title text-dark pinnacle-demi-bold" dangerouslySetInnerHTML={{ __html: obj?.title }} style={{ height: 'auto' }} />
                    }
                    {/* {obj.title} */}
                </span>
            </div>
            <div className='d-flex flex-row p-2 w-100 justify-content-center'>
                {
                    obj.photoFile
                        ?
                        <>
                            <Image src={obj.photoFile} style={{ resize: 'block', height: '120px' }} />
                            <VisibilityIcon fontSize='small cursor' style={{ position: 'relative', bottom: 5, right: 5 }} onClick={() => onViewHandler(obj.photoPath)} />
                        </>
                        : null
                }
            </div>
            {
                obj.audioFile &&
                <div className='d-flex flex-row p-2 w-100 justify-content-center'>
                    <AudioPlayer src={obj.audioFile} />
                </div>
            }
        </div>
    }

    const Video = ({ obj = {} }) => {
        if (obj && obj.videoFile) {
            if (obj.videoStatus) {
                if (obj.videoStatus?.isPlayable) {
                    return (
                        <div className="d-flex justify-content-center w-100 mb-4">
                            <iframe
                                // src={`https://player.vimeo.com/video/${obj?.videoFile.split('/').at(-1)}`}
                                src={`/player/${obj?.videoPath.split('/').at(-1)}`}
                                allow="autoplay; fullscreen; picture-in-picture"
                                title="Untitled"
                                width="100%"
                                height="500px"
                            />
                        </div>
                    )
                } else {
                    return <div className="w-100 py-4 text-center">
                        <VideoTranscodeImage />
                        <h5 className="mt-4">{t('onlineLesson.videoInTranscode')}</h5>
                    </div>
                }
            } else {
                return (
                    <div className="d-flex justify-content-center w-100 mb-4">
                        <iframe
                            // src={`https://player.vimeo.com/video/${obj?.videoFile.split('/').at(-1)}`}
                            src={`/player/${obj?.videoPath.split('/').at(-1)}`}
                            allow="autoplay; fullscreen; picture-in-picture"
                            title="Untitled"
                            width="100%"
                            height="500px"
                        />
                    </div>
                )
            }
        } else {
            return <div />
        }
    }

    const renderActiveQuestionButton = (component) => {
        if (component?.exam?.hasResult) {
            return (
                <button type='button' className='btn btn-primary' onClick={() => onHandlerExamStart(component?.exam?.id, component?.exam?.hasResult)}>{t('common.view')}</button>
            )
        } else if (component?.exam?.statusCode && (component?.exam?.statusCode == 'START' || component?.exam?.statusCode == 'IN_PROGRESS')) {
            return (
                <button type='button' className='btn btn-primary' onClick={() => onHandlerExamStart(component?.exam?.id, component?.exam?.hasResult)}>{t('onlineLesson.continueQuestion')}</button>
            )
        } else {
            return (
                <button type='button' className='btn btn-primary' onClick={() => onHandlerExamStart(component?.exam?.id, component?.exam?.hasResult)}>{t('onlineLesson.startQuestion')}</button>
            )
        }
    }

    const renderCrosswordButton = (crossword) => {
        if (crossword?.statusCode && crossword?.statusCode == 'START') {
            return (
                <button type='button' className='btn btn-primary' onClick={() => onHandlerCrosswordStart(crossword)}>{t('crossWord.continue')}</button>
            )
        } else if (crossword?.statusCode && crossword?.statusCode && crossword?.statusCode == 'FINISH') {
            return (
                <button type='button' className='btn btn-primary' onClick={() => onHandlerCrosswordStart(crossword)}>{t('crossWord.finish')}</button>
            )
        } else {
            return (
                <button type='button' className="btn btn-primary" onClick={() => onHandlerCrosswordStart(crossword)}>{t('crossWord.start')}</button>
            )
        }
    }

    const renderComponents = (components, type) => {
        if (components && type == 'child') {
            if (components && components.typeCode == "KEYWORD") {
                return (
                    <KeyWords obj={components} />
                )
            } else if (components && components.typeCode == "INFORMATION_ONLY") {
                return (
                    <OnlyContent obj={components} />
                )
            } else if (components && components.typeCode == "DESC_INFO_IMAGE") {
                return (
                    <ImageContent obj={components} />
                )
            } else if (components && components.typeCode == "AUDIO_IMAGE") {
                return (
                    <Audio obj={components} />
                )
            } else if (components && components.typeCode == "ACTIVE_QUESTION") {
                return (
                    <div className="text-center mb-3">
                        <div className="mb-3">
                            <img src='/img/exam-img.png' alt='photo' />
                        </div>
                        <div style={{ fontSize: 16 }}>
                            <b>{t('onlineLesson.knowledgeReinforcementQuestions')}</b>
                        </div>
                        <div className="mt-3">
                            {renderActiveQuestionButton(components)}
                        </div>
                    </div>
                )
            } else if (components && components.typeCode == "VIDEO") {
                return (
                    <div className="video-component mt-3">
                        <Video obj={components} />
                    </div>
                )
            } else if (components && components.typeCode == "DIALOG_CARD") {
                return (
                    <DialogCards children={components?.dialogCards || []} isStudent={true} />
                )
            } else if(components && components.typeCode == "CROSSWORD"){
                if(components && components.crosswords.length > 0){
                    return components.crosswords.map((crossword, index) => {
                        return (
                            <div key={'crossword_' + index}>
                                <Card style={{ border: '1px solid rgba(0,0,0,0.125)', width: '100%' }}>
                                    <Card.Body style={{ textAlign: 'center' }}>
                                        {renderCrosswordButton(crossword)}
                                    </Card.Body>
                                </Card>
                            </div>
                        )
                    })
                }
            } else {
                <div dangerouslySetInnerHTML={{ __html: content && content.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&') }} />
            }
        } else if (components && components.length > 0 && type == 'parent') {
            return components.map((component, index) => {
                if (component.typeCode == "KEYWORD") {
                    return (
                        <div key={'component_' + index}>
                            <KeyWords obj={component} />
                        </div>
                    )
                } else if (component.typeCode == "INFORMATION_ONLY") {
                    return (
                        <div key={'component_' + index}>
                            <OnlyContent obj={component} />
                        </div>
                    )
                } else if (component.typeCode == "DESC_INFO_IMAGE") {
                    return (
                        <div key={'component_' + index}>
                            <ImageContent obj={component} />
                        </div>
                    )
                } else if (component && component.typeCode == "AUDIO_IMAGE") {
                    return (
                        <div key={'component_' + index}>
                            <Audio obj={component} />
                        </div>
                    )
                } else if (component && component.typeCode == "ACTIVE_QUESTION") {
                    return (
                        <div key={'component_' + index} className="text-center mb-5 mt-5">
                            <div className="mb-3">
                                <img src='/img/exam-img.png' alt='photo' />
                            </div>
                            <div style={{ fontSize: 16 }}>
                                <b>{t('onlineLesson.knowledgeReinforcementQuestions')}</b>
                            </div>
                            <div className="mt-3">
                                {renderActiveQuestionButton(component)}
                            </div>
                        </div>
                    )
                } else if (component && component.typeCode == "VIDEO") {
                    return (
                        <div className="d-flex component-list" key={'component_' + index}>
                            <Video obj={component} />
                        </div>
                    )
                } else if (component && component.typeCode == "DIALOG_CARD") {
                    return (
                        <div key={'component_' + index} className='mt-4'>
                            <DialogCards children={component?.dialogCards || []} isStudent={true} index={index} />
                        </div>
                    )
                } else if(component && component.typeCode == "CROSSWORD"){
                    if(component && component.crosswords.length > 0){
                        return component.crosswords.map((crossword, cIndex) => {
                            return (
                                <div key={'component_' + index} className={index == 0 ? 'mb-5' : 'mb-5 mt-5'}>
                                    <Card style={{ border: '1px solid rgba(0,0,0,0.125)', width: '100%' }}>
                                        <Card.Body style={{ textAlign: 'center' }}>
                                            {renderCrosswordButton(crossword)}
                                        </Card.Body>
                                    </Card>
                                </div>
                            )
                        })
                    }
                } else {
                    <div key={'component_' + index} dangerouslySetInnerHTML={{ __html: content && content.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&') }} />
                }
            })
        }

        return null
    }

    return (
        <>
            <HtmlHead title={title} description={headDescription} />
            <div className="student-page-title-container">
                <div className="cursor" onClick={() => onHandlerBack()}>
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
            <div className="position-relative row">
                {
                    !checked
                        ?
                        <div
                            onClick={handleChange}
                            style={{ position: 'absolute', left: '-30px', top: '50%', zIndex: 10 }}
                        >
                            <div
                                className="d-flex justify-content-center align-items-center align-self-start"
                                style={{
                                    border: '1px solid',
                                    borderRadius: '0px 22px 22px 0px',
                                    borderColor: '#F1F2F4',
                                    width: '44px',
                                    height: '48px'
                                }}
                            >
                                <ChevronRight />
                            </div>
                        </div>
                        : null
                }
                <Col xs={!checked ? 0 : 3} className="mt-3 p-0 student-detail-list" style={{ maxWidth: 320 }}>
                    <Card>
                        <Card.Body className="padding-15 hide-scroll-bar" style={{ height: height - 90 }}>
                            <Box sx={{ display: 'flex' }}>
                                <Fade in={checked}>{renderDetail}</Fade>
                            </Box>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xs={!checked ? 12 : 9} className={!checked ? 'p-0 cal-width student-course-view-area mt-3' : 'cal-width student-course-view-area mt-3'}>
                    <Card className='border-less'>
                        <Card.Body
                            style={topics && topics.length == 1 && componentType == 'parent' ? { height: height - 75, overflow: 'auto' } : { height: isDescription ? height - 75 : height - 140, overflow: 'auto' }}
                        >
                            {
                                isComponentLocked && 
                                <div className="text-center">
                                    <WaitingApproveIcon />
                                    <h5 className="font-weight-700 fs-24 mt-6" style={{color: '#191919'}}>{t('onlineLesson.errorMessage.teacherApprove')}</h5>
                                </div>
                            }
                            {
                                !checked &&
                                <div onClick={handleChange} style={{ position: 'relative', right: 15, bottom: 15 }}>
                                    <img className="cursor expand-icon" src='/img/icon/layout-sidebar-right-collapse.svg' alt="icon" />
                                </div>
                            }
                            {
                                isDescription
                                    ?
                                    <div>
                                        <div dangerouslySetInnerHTML={{ __html: course?.description.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&') }} />

                                        {
                                            user &&
                                            <div className="border-0 pt-0">
                                                <Row className="align-items-center">
                                                    <h4 className="text-center" style={{ fontFamily: 'Mulish', fontSize: '16px', fontWeight: '700', color: '#2C333A' }}>{t('onlineLesson.teacherIntroduction')}</h4>
                                                </Row>
                                                <Row className="align-items-center">
                                                    <div className=" g-0 h-100 align-items-start align-content-center row">
                                                        <div className="col-auto">
                                                            <img
                                                                src={user?.avatar ? user?.avatar : "https://lxp-test.eschool.mn/images/avatar.png"}
                                                                className="sh-12 sw-12 rounded-md"
                                                                alt="thumb"
                                                            />
                                                        </div>
                                                        <div className="col">
                                                            <div className="d-flex flex-column flex-sm-row ps-4 h-100 align-items-sm-center justify-content-sm-between">
                                                                <div className="d-flex flex-column mb-2 mb-sm-0">
                                                                    <div className="text-dark font-weight-bold">{(user && user.lastName && user.lastName) + ' ' + (user && user.firstName && capitalize(user.firstName))}</div>
                                                                    <div className="text-small">{user?.title}</div>
                                                                    {
                                                                        user?.information &&
                                                                        <div className="d-flex flex-column mb-md-0 pt-1 col-12">
                                                                            <div className="g-0 row">
                                                                                <div dangerouslySetInnerHTML={{ __html: user?.information.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&') }} />
                                                                            </div>
                                                                        </div>
                                                                    }
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Row>
                                            </div>
                                        }

                                        {
                                            course?.isSell && !course?.isActive
                                            ?
                                                <div className="mt-4 d-flex flex-row align-items-center">
                                                    <button type='button' className="btn btn-primary mr-3" onClick={onBuy}>
                                                        {t('onlineLesson.buyNow')}
                                                    </button>
                                                    <h4
                                                        style={{ 
                                                            fontFamily: 'Mulish', 
                                                            fontSize: '16px', 
                                                            fontWeight: '700', 
                                                            margin: 0
                                                        }}
                                                    >
                                                        {priceFormat(course?.price)} MNT
                                                    </h4>
                                                </div>
                                            : null
                                        }
                                    </div>
                                    :
                                    renderComponents(currentComponent, componentType)
                            }
                        </Card.Body>
                        {
                            !isDescription && componentType == 'child' &&
                            <Card.Footer style={{ padding: '1rem 2rem' }} >
                                <div className="d-flex justify-content-between">
                                    {
                                        isPrev && !isComponentLocked
                                            ?
                                            <div>
                                                <button type='button' className="btn btn-primary" onClick={() => onHandlerItem(prevDetail, parseInt(activeIndex.split('_')[0]), parseInt(activeIndex.split('_')[1]), (parseInt(activeIndex.split('_')[2]) - 1))}>{t('onlineLesson.prev')}</button>
                                            </div>
                                            :
                                            <div />
                                    }
                                    {
                                        isNext && !isComponentLocked
                                            ?
                                            <div>
                                                <button type='button' className="btn btn-primary" onClick={() => onHandlerItem(nextDetail, parseInt(activeIndex.split('_')[0]), parseInt(activeIndex.split('_')[1]), (parseInt(activeIndex.split('_')[2]) + 1))}>{t('onlineLesson.continue')}</button>
                                            </div>
                                            :
                                            <div />
                                    }
                                </div>
                            </Card.Footer>
                        }
                        {
                            !isDescription && componentType == 'parent' && topics && topics.length > 1 &&
                            <Card.Footer style={{ padding: '1rem 2rem' }} >
                                <div className="d-flex justify-content-between">
                                    {
                                        isPrev && !isComponentLocked
                                            ?
                                            <div>
                                                <button type='button' className="btn btn-primary" onClick={() => onHandlerItem(prevDetail, parseInt(activeParentIndex.split('_')[0]), (parseInt(activeParentIndex.split('_')[1]) - 1), null, 'parent')}>{t('onlineLesson.prev')}</button>
                                            </div>
                                            :
                                            <div />
                                    }
                                    {
                                        isNext && !isComponentLocked
                                            ?
                                            <div>
                                                <button type='button' className="btn btn-primary" onClick={() => onHandlerItem(nextDetail, parseInt(activeParentIndex.split('_')[0]), (parseInt(activeParentIndex.split('_')[1]) + 1), null, 'parent')}>{t('onlineLesson.nextChapter')}</button>
                                            </div>
                                            :
                                            <div />
                                    }
                                </div>
                            </Card.Footer>
                        }
                    </Card>
                </Col>
            </div>
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
            <Modal
                show={show}
                onHide={onClose}
                size="sm"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header className="p-3">
                    <Modal.Title className="modal-title d-flex flex-row justify-content-end w-100" style={{ textTransform: 'none' }}>
                        <div onClick={onClose} className="cursor-pointer back-button">
                            {t('common.back')}
                        </div>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="d-flex justify-content-center">
                        <img src={`data:image/jpg;base64,${qrData}`} style={{width: '300px', width: '300px'}}/>
                    </div>
                </Modal.Body>
                <Modal.Footer className="p-3 text-center">
                    <div style={{ display: 'flex', flexDirection: 'row', display: 'inline-block' }}>
                        <Button className="cursor-pointer cancel-button pr-4" variant='link' onClick={onClose}>
                            <span style={{ color: '#ff2f1a' }}>{t("common.cancel")}</span>
                        </Button>

                        <button type='button' className="btn btn-primary" 
                            onClick={() => init({
                                course: location?.state?.courseId
                            })}>
                            {t('onlineLesson.checkPayment')}
                        </button>
                    </div>
                </Modal.Footer>
            </Modal>
        </>
    );
};

// export default StudentCourseInfo;

const ChevronRight = () => {
    return <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 8L20 16L12 24" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>

}

const CircleCheck = () => {
    return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" clipRule="evenodd" d="M22 12C22 17.523 17.523 22 12 22C6.477 22 2 17.523 2 12C2 6.477 6.477 2 12 2C17.523 2 22 6.477 22 12ZM15.7071 10.7071C16.0976 10.3166 16.0976 9.68342 15.7071 9.29289C15.3166 8.90237 14.6834 8.90237 14.2929 9.29289L11 12.5858L9.70711 11.2929C9.31658 10.9024 8.68342 10.9024 8.29289 11.2929C7.90237 11.6834 7.90237 12.3166 8.29289 12.7071L10.2929 14.7071C10.6834 15.0976 11.3166 15.0976 11.7071 14.7071L15.7071 10.7071Z" fill="#63C132" />
    </svg>
}

const VideoTranscodeImage = () => {
    return <svg width="76" height="103" viewBox="0 0 76 103" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M48.2227 82.5577L46.8866 88.0452L46.724 88.7246C46.3069 90.452 45.3031 92.0585 43.8397 93.3541L38.87 97.759L38.0357 98.5018C37.9226 98.5997 37.8873 98.7436 37.9438 98.8703C38.2125 99.4461 39.1315 101.041 41.4149 101.646C41.9805 101.795 41.9663 102.446 41.3937 102.573C38.672 103.154 33.773 102.849 30.4009 99.0546L33.2498 95.8473L35.5615 93.2447C37.1733 91.4597 38.3539 89.4444 39.0538 87.3139C39.2376 86.7727 39.379 86.2199 39.4991 85.6671L40.2626 81.9531L48.2227 82.552V82.5577Z" fill="#F54E65" />
        <path d="M35.9007 83.9512L33.6032 86.8188L25.1624 97.3675L24.4908 98.2081L24.816 101.669C24.8726 102.268 24.0313 102.625 23.4587 102.25L15.5269 97.0393C16.3681 95.8531 17.2942 94.5345 18.2485 93.1871C20.0936 90.5845 22.0095 87.884 23.4375 85.8744C24.7948 83.9628 25.7138 82.6729 25.7138 82.6729L35.9007 83.9512Z" fill="#F54E65" />
        <path d="M25.7136 82.6729L35.9004 83.9512L33.6029 86.8188L23.4302 85.8744C24.7875 83.9628 25.7065 82.6729 25.7065 82.6729" fill="#3A2842" />
        <path d="M48.2224 82.5578L46.8863 88.0452L39.0464 87.3197C39.2302 86.7784 39.3716 86.2257 39.4918 85.6729L40.2552 81.9589L48.2153 82.5578H48.2224Z" fill="#3A2842" />
        <path d="M22.2779 12.6377L23.3383 0.482433C18.2766 -0.818887 13.0029 0.787599 9.97012 2.05437C8.50676 2.66473 7.94118 4.1273 8.6976 5.31921L13.837 13.3805L22.2779 12.6434V12.6377Z" fill="#4E7BDE" />
        <path d="M22.469 11.1521C22.2923 11.1521 22.1085 11.106 21.9529 11.0139C21.5641 10.7836 21.4864 10.3402 21.7691 10.0236L23.6921 7.90456L19.5282 4.17335L17.4639 6.0159L19.7191 7.93338C20.0514 8.21552 20.0372 8.66464 19.6908 8.93527C19.3444 9.2059 18.793 9.19436 18.4607 8.91222L15.6471 6.51685C15.329 6.24622 15.329 5.82592 15.633 5.54953L18.8849 2.64745C19.0475 2.49774 19.2808 2.41711 19.5282 2.41711C19.7756 2.41711 20.0089 2.5035 20.1715 2.64745L25.4594 7.38055C25.7351 7.62815 25.7634 8.00245 25.5159 8.27308L23.1759 10.8584C23.0063 11.0485 22.7447 11.1463 22.4761 11.1463" fill="#3A2842" />
        <path d="M72.0674 73.1548L70.8798 80.1797H65.7686V73.5521L72.0674 73.1548Z" fill="#3455BA" />
        <path d="M65.2104 44.1688C72.9231 52.9671 75.1995 68.2029 75.7367 72.9015C75.8216 73.6846 75.1146 74.3813 74.1532 74.4504L67.0768 74.9859L65.2104 44.1688Z" fill="#3455BA" />
        <path d="M74.4146 69.6424H67.225C66.7443 69.6424 66.3555 69.3257 66.3555 68.9342C66.3555 68.5426 66.7443 68.226 67.225 68.226H74.4146C74.8953 68.226 75.2841 68.5426 75.2841 68.9342C75.2841 69.3257 74.8953 69.6424 74.4146 69.6424Z" fill="#3A2842" />
        <path d="M68.4621 72.579C67.6774 77.7325 65.8252 81.8035 62.5168 83.4215C60.3465 84.481 56.4937 84.9934 51.7289 85.0971C34.1333 85.4829 4.13801 80.3179 0.935586 76.6442C-1.60938 73.7249 1.49412 64.4487 4.78844 55.1839C6.76079 49.6332 8.80375 44.0882 9.74398 39.902C12.2465 28.7372 7.9343 16.0349 9.46835 14.4457C10.9953 12.8622 21.1611 11.7279 31.037 12.7471C31.037 12.7471 31.0369 18.4188 31.454 25.6681C45.9321 23.1749 57.0663 27.3668 63.0753 38.8195C65.804 44.0191 68.0309 52.6562 68.7024 61.0111C69.0347 65.082 68.9923 69.0781 68.4621 72.579Z" fill="#4E7BDE" />
        <path d="M68.4622 72.579C67.6775 77.7325 65.8253 81.8034 62.5169 83.4215C60.3466 84.4809 56.4938 84.9934 51.729 85.0971C41.4502 83.4503 34.2465 80.4964 36.8198 75.2796C43.1681 62.4103 60.9051 75.101 68.7026 61.0168C69.0348 65.0878 68.9924 69.0839 68.4622 72.5848" fill="#3455BA" />
        <path d="M68.4622 72.579C67.6775 77.7325 65.8253 81.8035 62.5169 83.4215C60.389 84.4579 56.6422 84.9704 51.9977 85.0913C43.5781 85.3044 32.2389 84.2161 22.363 82.6269C11.6246 80.8937 2.61823 78.5617 0.942788 76.6442C-1.07905 74.3237 0.46211 67.9841 2.83741 60.8269C3.43124 59.0361 4.0745 57.1935 4.73195 55.351C4.75316 55.2934 4.77435 55.2415 4.79555 55.184C5.63681 55.7022 6.4922 56.2031 7.36173 56.6868C9.32701 57.7924 11.356 58.8173 13.4273 59.7731C38.0499 71.1568 68.4622 72.5733 68.4622 72.5733" fill="#F54E65" />
        <path d="M68.4622 73.2873C68.4622 73.2873 68.4269 73.2873 68.4127 73.2873C68.3138 73.2873 58.2611 72.7921 45.2323 70.2873C33.1932 67.9726 16.05 63.4064 2.802 54.8269C2.42732 54.5851 2.36373 54.1417 2.66064 53.8308C2.95756 53.5256 3.50188 53.4738 3.87655 53.7157C28.7819 69.844 68.1158 71.8535 68.5046 71.8708C68.9854 71.8938 69.3458 72.2278 69.3246 72.6193C69.2964 72.9936 68.9146 73.2873 68.4622 73.2873Z" fill="#3A2842" />
        <path d="M31.7865 36.3609C31.32 36.3609 30.9312 36.0557 30.917 35.6699L30.1747 11.9698C30.1606 11.5783 30.5424 11.2558 31.0231 11.2443C31.5109 11.2385 31.8997 11.5437 31.9138 11.9352L32.656 35.6354C32.6702 36.0269 32.2885 36.3494 31.8078 36.3609H31.7865Z" fill="#3A2842" />
        <path d="M59.0101 42.2975C58.8263 42.2975 58.6355 42.2399 58.4941 42.1248C58.4234 42.0672 51.2763 36.3034 42.6022 38.169C42.2134 38.2496 41.8175 38.0653 41.7185 37.7486C41.6195 37.4319 41.8457 37.1094 42.2346 37.0288C51.7287 34.9905 59.2081 41.0364 59.5262 41.2956C59.809 41.5259 59.8019 41.9001 59.5262 42.1304C59.3848 42.2456 59.201 42.3032 59.0172 42.3032" fill="#2B253D" />
        <path d="M36.7138 25.0578C32.3662 20.152 35.5756 19.5473 38.9972 23.8025C54.9457 15.7701 58.3531 25.2824 61.3717 29.0251C64.3904 32.7679 71.9334 31.1096 71.9334 31.1096C70.0317 41.5316 54.9811 37.8407 49.5447 30.6835C44.1084 23.5204 36.7138 25.0578 36.7138 25.0578Z" fill="#3A2842" />
        <path d="M9.4682 15.1597C9.16421 15.1597 8.86725 15.0273 8.71173 14.7969C8.47844 14.4572 8.62688 14.0254 9.05104 13.8354C12.3242 12.3556 17.0253 11.6013 23.0201 11.6013H23.1191C27.5728 11.6013 31.0368 12.0331 31.1782 12.0503C31.6518 12.1079 31.977 12.4707 31.9063 12.8565C31.8356 13.2423 31.3902 13.5072 30.9166 13.4496C30.7823 13.4323 17.1596 11.7797 9.89942 15.0675C9.7651 15.1309 9.62373 15.1597 9.47527 15.1597" fill="#3A2842" />
        <path d="M65.4647 79.4369C64.885 79.4369 63.0187 79.3448 61.7179 78.1874C60.6151 77.2143 60.2263 75.792 60.5515 73.9552C60.6222 73.5694 61.0604 73.2988 61.5341 73.3564C62.0077 73.414 62.34 73.771 62.2693 74.1568C62.0219 75.5445 62.2623 76.5751 62.9833 77.2143C63.9448 78.0722 65.5212 78.0147 65.5354 78.0147C66.009 77.9974 66.4261 78.2911 66.4473 78.6769C66.4756 79.0626 66.1151 79.3966 65.6343 79.4254C65.6202 79.4254 65.5566 79.4254 65.4576 79.4254" fill="#3A2842" />
        <path d="M14.4454 70.4716C10.7623 70.4716 7.53863 68.7327 7.37603 68.6463C6.98015 68.4275 6.87414 67.9899 7.14277 67.6675C7.41141 67.345 7.94865 67.2586 8.34453 67.4717C8.38695 67.4947 12.4872 69.6885 16.2198 68.8709C18.1073 68.4563 19.6202 67.3278 20.7159 65.5082C20.928 65.157 21.4511 65.013 21.8753 65.1857C22.3065 65.3585 22.4833 65.7788 22.2712 66.1301C20.9422 68.3354 19.0546 69.7173 16.6581 70.2413C15.9158 70.4025 15.1665 70.4716 14.4383 70.4716" fill="#3A2842" />
        <path d="M13.4273 59.7789L2.8374 60.8269C3.43123 59.0361 4.07449 57.1935 4.73194 55.351L7.35473 56.6868L13.4202 59.7731L13.4273 59.7789Z" fill="#3A2842" />
        <path d="M24.4908 98.2081L24.816 101.669C24.8726 102.268 24.0313 102.625 23.4587 102.25L15.5269 97.0393C16.3681 95.8532 17.2942 94.5345 18.2485 93.1871L25.1624 97.3617L24.4908 98.2024V98.2081Z" fill="#3A2842" />
        <path d="M41.4005 102.584C38.6788 103.166 33.7798 102.861 30.4077 99.0661L33.2566 95.8589L38.8839 97.7705L38.0496 98.5133C37.9365 98.6112 37.9012 98.7552 37.9577 98.8819C38.2264 99.4577 39.1454 101.053 41.4288 101.657C41.9944 101.807 41.9873 102.458 41.4076 102.584" fill="#3A2842" />
        <path d="M38.5729 40.6161C37.4701 41.8368 35.1654 41.6295 34.4161 40.2419C33.6667 38.8542 35.0453 37.3283 36.8904 37.4952C38.7355 37.6622 39.6757 39.3954 38.5729 40.6104" fill="#F54E65" />
        <path d="M41.2242 20.578C41.2242 21.626 40.1921 22.2824 39.365 21.7584C38.5379 21.2345 38.5379 19.9216 39.365 19.3976C40.1921 18.8736 41.2242 19.53 41.2242 20.578Z" fill="#3A2842" />
        <path d="M45.2461 37.1785C49.2827 32.3705 50.7107 37.4895 50.7107 37.4895L45.2461 37.1785Z" fill="#3A2842" />
        <path d="M54.3589 39.1709C59.4418 36.0846 58.4096 40.7889 58.4096 40.7889L54.3589 39.1709Z" fill="#3A2842" />
        <path d="M47.636 44.0017C47.5723 44.0017 47.5087 43.996 47.4451 43.9845L40.8705 42.545C40.4817 42.4586 40.2555 42.1362 40.3616 41.8252C40.4676 41.5086 40.8635 41.3242 41.2452 41.4106L47.8198 42.8444C48.2086 42.9308 48.4348 43.2533 48.3287 43.5642C48.2439 43.8291 47.947 44.0017 47.6289 44.0017" fill="#2B253D" />
    </svg>
}
