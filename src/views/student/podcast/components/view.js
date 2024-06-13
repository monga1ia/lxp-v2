import React, { useState, useEffect } from "react";
import { Row, Col, Card, ProgressBar } from "react-bootstrap";
import { NavLink, useHistory, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { ScrollMenu, VisibilityContext } from 'react-horizontal-scrolling-menu';
import 'react-horizontal-scrolling-menu/dist/styles.css';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { fetchRequest } from "utils/fetchRequest";
import { podcastStudentOtherPodcast } from 'utils/fetchRequest/Urls';
import showMessage from "modules/message";
import HtmlHead from "components/html-head/HtmlHead";
import CsLineIcons from "cs-line-icons/CsLineIcons";
import { secondsToHms } from 'utils/utils'
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import TabComponent from "components/tab/Tab";
import { getWindowDimensions } from "utils/utils";
import { cloneDeep } from "lodash";

const StudentPodcastView = () => {
    const { t } = useTranslation();
    const history = useHistory();
    const location = useLocation();

    const title = t('podcast.title');
    const description = "";
    const { height } = getWindowDimensions()
    const { selectedSchool } = useSelector(state => state.schoolData);
    const [loading, setLoading] = useState(false)
    const [podcastData, setPodcastData] = useState(null)
    const [subjects, setSubjects] = useState([])
    const [recommended, setRecommended] = useState([])
    const [page, setPage] = useState(1)
    const [otherList, setOtherList] = useState([])
    
    const init = (params) => {
        setLoading(true)
        fetchRequest(podcastStudentOtherPodcast, 'POST', params)
            .then((res) => {
                if (res.success) {
                    setOtherList(res?.list || [])
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

    const onHandlerSeeMore = () => {
        let cloneCast = cloneDeep(podcastData)
        cloneCast.lessDescription = cloneCast.description
        cloneCast.isSeeMore = true
        setPodcastData(cloneCast)
    }

    useEffect(() => {
        if (otherList && otherList.length > 0) {
            for (let i = 0; i < otherList.length; i++) {
                if (otherList[i].title && otherList[i].title.length > 40) {
                    let string = otherList[i].title.substring(0, 40);
                    otherList[i].title = string + '...'
                }
            }
        }

        let castObj = location?.state?.castData
        if(castObj.description.length > 200){
            castObj.lessDescription = castObj.description.substring(0, 200) + ' ...'
            castObj.isSeeMore = false
        } else {
            castObj.lessDescription = castObj.description
            castObj.isSeeMore = true
        }

        setPodcastData(castObj)

        let params = {
            school: selectedSchool?.id || null,
            id: location?.state?.castData.id
        }

        init(params);
    }, []);

    const onHandlerBack = () => {
        history.push("/podcast/index");
    }

    const renderTabs = (list) => {
        let tabs = []

        tabs.push({
            id: 1,
            title: t('webinar.introduction'),
            children: []
        })

        return tabs
    }

    const onHandlerNameClick = (data) => {
        let params = {
            school: selectedSchool?.id || null,
            id: data.id
        }

        init(params);

        
        if(data.description.length > 200){
            data.lessDescription = data.description.substring(0, 200) + ' ...'
            data.isSeeMore = false
        } else {
            data.lessDescription = data.description
            data.isSeeMore = true
        }

        setPodcastData(data)
    }

    return (
        <>
            <HtmlHead title={title} description={description} />
            <div className="student-page-title-container">
                <div className="cursor" onClick={() => onHandlerBack()}>
                    <CsLineIcons
                        icon="arrow-left"
                        className="ml-10"
                        size="20"
                    />
                </div>
            </div>

            <div id='podcast-view-style-id' className='d-flex justify-content-between podcast-view-style'>
                <div className="pl-0 pr-4" style={{width: '100%'}}>
                    <Card className="" style={{ borderRadius: 0 }}>
                        <Card.Body className="">
                            <div className="col-12">
                                <div style={{ height: '500px'}}>
                                    <div className="d-flex justify-content-center">
                                        <iframe
                                            // style={{padding: '1.8rem 1.8rem 4rem 1.8rem'}}
                                            // src={`https://player.vimeo.com/video/${obj?.videoPath.split('/').at(-1)}`}
                                            src={`/player/${podcastData?.videoPath.split('/').at(-1)}`}
                                            width="100%"
                                            height="500px"
                                            allow="autoplay; fullscreen; picture-in-picture"
                                            title="Untitled"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="col-12 fs-24 font-weight-600 mt-2 mb-3" style={{ color: '#101214', lineHeight: 1.2 }}>
                                {podcastData?.title || '-'}
                            </div>
                            <div className="col-12">
                                <ul className="list-group">
                                    <li className="d-flex align-items-center">
                                        <div className="d-flex">
                                            <img className="mr-2" src={podcastData?.schoolLogo ? podcastData.schoolLogo : 'https://lxp-test.eschool.mn/images/placeholder.jpg'} width={48} height={48} style={{ borderRadius: 8 }} />
                                            <div className="d-flex align-self-center" style={{ height: 'auto' }}>
                                                <span className='fs-16' style={{ fontWeight: 400, color: '#172B4D' }}>{(podcastData?.schoolName || '')}</span>
                                            </div>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                            <div className='col-12 fs-14'>
                                <TabComponent
                                    borderColor='#F1F2F4'
                                    indicatorColor='#3C358F'
                                    tabs={renderTabs()}
                                />
                            </div>
                            <div className="col-12 mt-3 w-100" style={{ backgroundColor: '#F7F8F9', padding: '8px 10px', borderRadius: 4 }}>
                                <div className='fs-14 d-inline-block' style={{ color: '#758195' }}>
                                    <div className="mb-2">{podcastData?.viewCount + ' ' + t('podcast.view').toLowerCase()}<h5 className="d-inline-block mr-2 ml-2">&#x2022;</h5>{podcastData?.timeAgo}</div>
                                </div>
                                <div className=''>
                                    <div className='fs-16 d-inline' dangerouslySetInnerHTML={{ __html: podcastData?.lessDescription || '' }} />
                                    {
                                        !podcastData?.isSeeMore &&
                                        <button 
                                            className="font-weight-600 black-color cursor d-inline" 
                                            onClick={() => onHandlerSeeMore()}
                                            style={{position: 'absolute', right: 40, bottom: 35, border: 'none', background: 'transparent'}}
                                        >
                                            {t('podcast.seeMore')}
                                        </button>
                                    }
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </div>
                <div className="mt-3">
                    <Card style={{ borderRadius: 8, marginRight: 20 }}>
                        <Card.Body style={{ padding: '10px 15px', width: 415, maxHeight: height - 90, overflowY: 'auto'}}>
                            <ul className="list-group">
                                <li className="d-flex fs-16 font-weight-600 black-color">
                                    <p>{t('common.other')}</p>
                                </li>
                                {
                                    otherList && otherList.length > 0 &&
                                    otherList.map((otherData, dIndex) => {
                                        return (
                                            <li key={'other_' + dIndex} className="d-flex justify-content-between align-items-center mt-1 mb-1 other-podcast cursor" onClick={() => onHandlerNameClick(otherData)}>
                                                <div className="d-flex align-items-center">
                                                    <div style={{position: 'relative'}}>
                                                        <img 
                                                            className="profile cursor" 
                                                            alt={otherData.title} 
                                                            src={otherData.coverPath ? otherData.coverPath : '/img/placeholder-img.png'} width={160} height={80} 
                                                            style={{ borderRadius: 6, objectFit: 'contain' }} 
                                                        />
                                                        {
                                                            otherData.videoDuration &&
                                                            <div className='fs-14' style={{padding: '2px 6px', backgroundColor: 'rgba(0, 0, 0)', opacity: 0.6, position: 'absolute', bottom: 5, right: 5, borderRadius: 8, color: '#fff'}}>
                                                                    {secondsToHms(otherData.videoDuration) + '' || ''}
                                                                </div>
                                                        }
                                                    </div>
                                                    <div className="fs-13 ms-3" style={{maxWidth: 210}}>
                                                        <span className='d-block font-weight-600 fs-16 mb-3 cursor' style={{ color: '#101214' }}>{otherData?.title || '-'}</span>
                                                        <span className='d-block font-weight-400 fs-14' style={{ color: '#758195' }}>{otherData?.schoolName || '-'}</span>
                                                        <span className='d-block font-weight-400 fs-14' style={{ color: '#758195' }}>{otherData?.timeAgo || '-'}</span>
                                                    </div>
                                                </div>
                                            </li>
                                        )
                                    })
                                }
                            </ul>
                        </Card.Body>
                    </Card>
                </div>
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

export default StudentPodcastView;
