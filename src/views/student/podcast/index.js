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
import { podcastStudentIndex } from 'utils/fetchRequest/Urls';
import showMessage from "modules/message";
import HtmlHead from "components/html-head/HtmlHead";
import { secondsToHms } from 'utils/utils'
import CsLineIcons from "cs-line-icons/CsLineIcons";
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';

const StudentPodcastIndex = () => {
    const { t } = useTranslation();
    const history = useHistory();

    const title = t('podcast.title');
    const description = "";

    const { selectedSchool } = useSelector(state => state.schoolData);
    const [loading, setLoading] = useState(false)
    const [totalCount, setTotalCount] = useState(0)
    const [list, setList] = useState([])
    const [recommended, setRecommended] = useState([])
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(1)

    const init = (params) => {
        setLoading(true)
        fetchRequest(podcastStudentIndex, 'POST', params)
            .then((res) => {
                if (res.success) {
                    if(res?.list && res?.list.length > 0){
                        if(list && list.length > 0){
                            let cloneList = [...list]

                            for(let i = 0; i < res?.list.length; i++){
                                cloneList.push(res?.list[i])
                            }

                            setList(cloneList)
                        } else {
                            setList(res?.list || [])
                        }
                    }
                    
                    setTotalCount(res?.totalCount || 0)
                    setRecommended(res?.recommended || [])

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

    useEffect(() => {
        let params = {
        }
        init(params);
    }, []);

    const onPodcastHandler = (data) => {
        history.push({
            pathname: "/podcast/view",
            state: {
                castData: data,
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

        if(totalCount > list.length && isLastItemVisible && !loading){
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

    // const recommendLeftArrow = () => {
    //     const { isFirstItemVisible, scrollPrev } =
    //       React.useContext(VisibilityContext);
      
    //     return (
    //       <div disabled={isFirstItemVisible} onClick={() => scrollPrev()} style={{display: 'flex', alignItems: 'center'}}>
    //         <ArrowBackIosNewIcon />
    //       </div>
    //     );
    // }
      
    // const recommendRightArrow = () => {
    //     const { isLastItemVisible, scrollNext } = React.useContext(VisibilityContext);

    //     if(totalCount > list.length && isLastItemVisible && !loading){
    //         let params = {
    //             school: selectedSchool.id,
    //         }
    //         init(params);
    //     }
        
    //     return (
    //         <div disabled={isLastItemVisible} onClick={() => scrollNext()} style={{display: 'flex', alignItems: 'center'}}>
    //             <ArrowForwardIosIcon />
    //         </div>
    //     );
    // }

    return (
        <>
            <HtmlHead title={title} description={description} />
            <div className="student-page-title-container">
                <h1 className="mb-0 pb-0 display-4 relative">{title}</h1>
            </div>

            <div className='pr-3'>
                <div className="d-flex justify-content-between student-podcast-title">
                    <div className="py-3" style={{ fontSize: '16px', fontWeight: '600' }}>{t('onlineLesson.offer')}</div>
                </div>
                <ScrollMenu LeftArrow={leftArrow} RightArrow={rightArrow} scrollContainerClassName="d-flex hide-scroll-bar">
                    {
                        list && list.length > 0 &&
                        list.map((data, index) => {
                            return (
                                <Card
                                    key={data.id}
                                    title={data.id}
                                    className="cursor mr-3" onClick={() => onPodcastHandler(data)} 
                                    style={{width: 260, height: '100%'}}
                                >
                                    <Card.Img
                                        style={{height: 125, objectFit: 'contain'}}
                                        src={data?.coverPath ? data.coverPath : '/img/placeholder-img.png'}
                                        className="sh-26 w-auto m-2"
                                        alt="card image"
                                    />
                                    <Card.Body className="m-2 mx-3 p-0">
                                        <ul className="list-group h-100">
                                            {
                                                data.videoDuration &&
                                                <li className="d-flex justify-content-end">
                                                    <div className='fs-14' style={{padding: '2px 5px', backgroundColor: 'rgba(0, 0, 0)', opacity: 0.6, position: 'absolute', top: 100, borderRadius: 8, color: '#fff'}}>
                                                        {secondsToHms(data.videoDuration) || ''}
                                                    </div>
                                                </li>
                                            }
                                            <li className="d-flex justify-content-between align-items-center h-100">
                                                <div className="d-flex" style={{height: '100%'}}>
                                                    <img className="sh-5 sw-5 mr-2" alt={'council_' + index} src={data.schoolLogo ? data.schoolLogo : 'https://lxp-test.eschool.mn/images/placeholder.jpg'} width={32} height={32} style={{borderRadius: 8}}/>
                                                    <div className="d-flex align-items-start flex-column" style={{height: 'auto'}}>
                                                        <div className="mb-auto">
                                                            <span className='black-color fs-16' style={{fontWeight: 600, lineHeight: 1.2}}>
                                                                <div className="pb-3">{data?.title || ''}</div>
                                                            </span>
                                                        </div>
                                                        <div className="">
                                                        <span className='fs-14' style={{fontWeight: 400, color: '#758195'}}>{(data?.schoolName || '')}</span>
                                                        </div>
                                                        <div className="">
                                                            <span className='fs-14' style={{fontWeight: 400, color: '#758195'}}>{data?.timeAgo || ''}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </li>
                                        </ul>
                                    </Card.Body>
                                </Card>
                            )
                        })
                    }
                </ScrollMenu>
                {/* {
                    recommended && recommended.length > 0 &&
                    <>
                        <div className="d-flex justify-content-between mt-4">
                            <div className="pb-3" style={{ fontSize: '16px', fontWeight: '600' }}>{t('onlineLesson.offer')}</div>
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
                                                src={data?.cover ? data.cover : '/img/placeholder-img.png'}
                                                className="sh-26 w-auto m-2 "
                                                alt="card image"
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
                } */}
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

export default StudentPodcastIndex;