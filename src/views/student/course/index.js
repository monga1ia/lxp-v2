import React, { useState, useEffect } from "react";
import { Row, Col, Card, ProgressBar } from "react-bootstrap";
import { NavLink, useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { ScrollMenu, VisibilityContext } from 'react-horizontal-scrolling-menu';
import 'react-horizontal-scrolling-menu/dist/styles.css';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { fetchRequest } from "utils/fetchRequest";
import { onlineLessonIndex, onlineLessonIndexRecommended } from 'utils/fetchRequest/Urls';
import showMessage from "modules/message";
import HtmlHead from "components/html-head/HtmlHead";
import CsLineIcons from "cs-line-icons/CsLineIcons";
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import { priceFormat } from "utils/utils";

const StudentGroupCourse = () => {
    const { t } = useTranslation();
    const history = useHistory();

    const title = t('menu.subject');
    const description = "Elearning Portal Course Explore Page";

    const { selectedSchool } = useSelector(state => state.schoolData);
    const [loading, setLoading] = useState(false)
    const [totalCount, setTotalCount] = useState(0)
    const [subjects, setSubjects] = useState([])
    const [recommended, setRecommended] = useState([])
    const [recommendedTotalCount, setRecommendedTotalCount] = useState([])
    const [page, setPage] = useState(1)
    const [rPage, setRPage] = useState(1)

    const init = (params) => {
        setLoading(true)
        fetchRequest(onlineLessonIndex, 'POST', params)
            .then((res) => {
                if (res.success) {
                    if(res?.subjects && res?.subjects.length > 0){
                        if(subjects && subjects.length > 0){
                            let cloneSubject = [...subjects]

                            for(let i = 0; i < res?.subjects.length; i++){
                                cloneSubject.push(res?.subjects[i])
                            }

                            setSubjects(cloneSubject)
                        } else {
                            setSubjects(res?.subjects || [])
                        }
                    }
                    
                    setTotalCount(res?.totalCount || 0)

                    if(params && params.page){
                        setPage(params.page)
                    }
                    setLoading(false)
                } else {
                    showMessage(res.message)
                    setLoading(false)
                }
            })
            .catch((e) => {
                showMessage(t('errorMessage.title'));
                setLoading(false)
            })
    }

    const initRecommended = (params) => {
        setLoading(true)
        fetchRequest(onlineLessonIndexRecommended, 'POST', params)
            .then((res) => {
                if (res.success) {
                    setRecommendedTotalCount(res?.recommendedTotalCount || 0)

                    if(res?.recommended && res?.recommended.length > 0){
                        if(recommended && recommended.length > 0){
                            let cloneRecommend = [...recommended]

                            for(let i = 0; i < res?.recommended.length; i++){
                                // let existing = cloneRecommend.find(data => data.id == res?.recommended[i].id)

                                // if(!existing){
                                    cloneRecommend.push(res?.recommended[i])
                                // }
                            }

                            setRecommended(cloneRecommend)
                        } else {
                            setRecommended(res?.recommended || [])
                        }
                    }

                    if(params && params.r_page){
                        setRPage(params.r_page)
                    }
                    setLoading(false)
                } else {
                    showMessage(res.message)
                    setLoading(false)
                }
            })
            .catch((e) => {
                showMessage(t('errorMessage.title'));
                setLoading(false)
            })
    }

    useEffect(() => {
        let params = {
        }
        init(params);
        initRecommended(params);
    }, []);

    const StudentCourse = (id) => {
        // history.push({
        //     pathname: "/onlineLesson/course",
        //     state: { id }
        // })
    }

    const onSubjectHandler = (data) => {
        history.push({
            pathname: "/lesson/course",
            state: {
                id: data.id,
                subjectId: data.subjectId,
                title: data?.subjectName || ''
            }
        })
    }

    const leftArrow = () => {
        const { isFirstItemVisible, scrollPrev } =
          React.useContext(VisibilityContext);
      
        return (
          <div disabled={isFirstItemVisible} onClick={() => scrollPrev()} style={{display: 'flex', alignItems: 'center'}}>
            <ArrowBackIosNewIcon />
          </div>
        );
    }
      
    const rightArrow = () => {
        const { isLastItemVisible, scrollNext } = React.useContext(VisibilityContext);

        if(totalCount > subjects.length && isLastItemVisible && !loading){
            let params = {
                page: page + 1
            }
            init(params);
        }
        
        return (
            <div disabled={isLastItemVisible} onClick={() => scrollNext()} style={{display: 'flex', alignItems: 'center'}}>
                <ArrowForwardIosIcon />
            </div>
        );
    }

    const recommendLeftArrow = () => {
        const { isFirstItemVisible, scrollPrev } =
          React.useContext(VisibilityContext);
      
        return (
          <div disabled={isFirstItemVisible} onClick={() => scrollPrev()} style={{display: 'flex', alignItems: 'center'}}>
            <ArrowBackIosNewIcon />
          </div>
        );
    }
      
    const recommendRightArrow = () => {
        const { isLastItemVisible, scrollNext } = React.useContext(VisibilityContext);

        if(recommendedTotalCount > recommended.length && isLastItemVisible && !loading){
            let params = {
                school: selectedSchool.id,
                page: rPage + 1
            }
            initRecommended(params);
        }
        
        return (
            <div disabled={isLastItemVisible} onClick={() => scrollNext()} style={{display: 'flex', alignItems: 'center'}}>
                <ArrowForwardIosIcon />
            </div>
        );
    }

    return (
        <>
            <HtmlHead title={title} description={description} />
            <div className="student-page-title-container">
                <h1 className="mb-0 pb-0 display-4 relative">{title}</h1>
            </div>

            <div className='pr-3'>
                {
                    subjects && subjects.length > 0 &&
                    <>
                        <div className="d-flex justify-content-between">
                            <div className="py-3 student-online-lesson-text" style={{ fontSize: '16px', fontWeight: '600' }}>{t('onlineLesson.lessonsBeingWatched')}</div>
                        </div>
                        <ScrollMenu LeftArrow={leftArrow} RightArrow={rightArrow}>
                            {
                                subjects.map((data, index) => {
                                    return (
                                        <Card
                                            key={data.id}
                                            title={data.id}
                                            className="cursor mr-3" onClick={() => onSubjectHandler(data)} 
                                            style={{width: 260, height: 360}}
                                        >
                                            <Card.Img
                                                style={{height: 165}}
                                                src={data?.cover ? data.cover : '/img/placeholder-img.png'}
                                                className="sh-26 w-auto m-2"
                                                alt="card image object-fit-contain"
                                            />
                                            <Card.Body className="d-flex align-items-center m-2 mx-3 p-0">
                                                <Card.Img
                                                    style={{height: 32}}
                                                    src={data?.schoolLogo ? data.schoolLogo : '/img/placeholder-img.png'}
                                                    className="sh-5 sw-5 mr-2"
                                                    alt="card image"
                                                />
                                                <div className="body-link  ">
                                                    {data?.schoolName || ''}
                                                </div>
                                            </Card.Body>
                                            <Card.Footer className="border-0 pt-0 m-2 mx-3 p-0">
                                                <div className="heading mb-2">
                                                    <div className="black-color body-link ">
                                                        {data?.subjectName || ''}
                                                    </div>
                                                </div>
                                                <Row className="align-items-center p-0">
                                                    <Col className="rounded-md p-2 ml-1 d-flex justify-content-between" style={{ backgroundColor: '#f9f9f9' }}>
                                                        <ProgressBar className="w-100" variant={data.percentage == 100 ? 'success' : 'primary'} now={data.percentage} style={{position: 'relative', top: 5}}/>
                                                        <span className="d-flex text-small pl-2">{(data.percentage ? data.percentage : 0) + '%'}</span>
                                                    </Col>
                                                    <Col xs="auto" className="text-end rounded-md p-1 m-1" style={{ backgroundColor: '#f9f9f9' }}>
                                                        {
                                                            data.percentage == 100
                                                            ?
                                                                <CheckCircleRoundedIcon style={{color: '#63C132', fontSize: '1.5rem'}}/>
                                                            :
                                                                <CsLineIcons icon="play" style={{background: '#F7F8F9'}}/>
                                                        }
                                                    </Col>
                                                </Row>
                                            </Card.Footer>
                                        </Card>
                                    )
                                })
                            }
                        </ScrollMenu>
                    </>
                }
                {
                    recommended && recommended.length > 0 &&
                    <>
                        <div className="d-flex justify-content-between mt-4">
                            <div className="pb-3 student-online-lesson-text" style={{ fontSize: '16px', fontWeight: '600' }}>{t('onlineLesson.offer')}</div>
                        </div>
                        <ScrollMenu LeftArrow={recommendLeftArrow} RightArrow={recommendRightArrow}>
                            {
                                recommended.map((data, index) => {
                                    return (
                                        <Card 
                                            key={data.id}
                                            title={data.id}
                                            className="h-100 cursor mr-3" onClick={() => onSubjectHandler(data)} 
                                            style={{width: 260, height: 360}} 
                                        >
                                            <Card.Img
                                                style={{height: 165}}
                                                src={data?.cover ? data.cover : '/img/placeholder-img.png'}
                                                className="sh-26 w-auto m-2 "
                                                alt="card image object-fit-contain"
                                            />
                                            <Card.Body className="d-flex align-items-center p-0 m-2 mx-3">
                                                <Card.Img
                                                    src={data?.schoolLogo ? data.schoolLogo : '/img/placeholder-img.png'}
                                                    className="sh-5 sw-5 mr-2"
                                                    alt="card image"
                                                />
                                                <div className="body-link ">
                                                    {data?.schoolName || ''}
                                                </div>
                                            </Card.Body>
                                            <Card.Footer className="border-0 m-2 mx-3 p-0 ">
                                                <div className="heading mb-0">
                                                    <NavLink
                                                        to="/onlineLesson/course"
                                                        className="black-color body-link "
                                                        style={{ fontSize: '18px' }}
                                                        onClick={() => StudentCourse(data.id)}
                                                    >
                                                        {data?.subjectName || ''}
                                                    </NavLink>
                                                </div>
                                            </Card.Footer>
                                        </Card>
                                    )
                                })
                            }
                        </ScrollMenu>   
                    </>
                }
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
    );
};

export default StudentGroupCourse;
