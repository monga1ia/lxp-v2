import React, { useState, useEffect } from "react";
import { Row, Col, Card, ProgressBar, Modal, Button } from "react-bootstrap";
import { NavLink, useHistory, useLocation } from "react-router-dom";
import HtmlHead from "components/html-head/HtmlHead";
import { useTranslation } from "react-i18next";
import CsLineIcons from "cs-line-icons/CsLineIcons";
import { fetchRequest } from "utils/fetchRequest";
import { onlineLessonSubjectDetail } from 'utils/fetchRequest/Urls';
import showMessage from "modules/message";
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';

const StudentCourse = () => {
    const { t } = useTranslation();
    const history = useHistory();
    const location = useLocation();

    const courseId = location?.state?.id;
    const subjectId = location?.state?.subjectId;
    const title = location?.state?.title;
    const description = "Elearning Portal Course List Page";

    const [loading, setLoading] = useState(false)
    const [courses, setCourses] = useState([])

    const init = (params) => {
        setLoading(true)
        fetchRequest(onlineLessonSubjectDetail, 'POST', params)
            .then((res) => {
                console.log(res)
                if (res.success) {
                    setCourses(res?.courses || [])
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
            id: courseId,
            subject: subjectId
        }

        init(params);
    }, []);

    const onHandlerCourse = (data) => {
        history.push({
            pathname: "/lesson/info",
            state: {
                courseId: data.id,
                subjectId: subjectId,
                title: data.subjectName
            }
        })
    }

    const onHandlerBack = () => {
        history.push("/lesson/index");
    }

    return (
        <>
            <HtmlHead title={title} description={description} />
            <div className="student-page-title-container mb-3">
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
            <Row className="g-3 row-cols-1 row-cols-md-2 row-cols-xl-3 row-cols-xxl-4">
                {
                    courses && courses.length > 0 &&
                    courses.map((data, index) => {
                        return (
                            <Col
                                key={'data_' + index}
                                className='student-course-list'
                                style={{width: 260, height: 380}}
                            >
                                <Card 
                                    className="cursor" 
                                    onClick={() => onHandlerCourse(data)}
                                    style={{height: '100%'}}
                                >
                                    <Card.Img
                                        style={{height: 150}}
                                        src={data && data.cover ? data.cover : '/img/placeholder-img.png'}
                                        className="sh-26 w-auto m-2 object-fit-contain"
                                        alt="card image"
                                    />
                                    <Card.Body style={{maxHeight: 40}} className="d-flex align-items-center p-0 mx-3">
                                        <Card.Img
                                            src={data && data.schoolLogo ? data.schoolLogo : '/img/placeholder-img.png'}
                                            className="sh-5 sw-5 mr-2"
                                            alt="card image"
                                        />
                                        <div className="body-link " style={{lineHeight: '1em'}}>
                                            {data?.schoolName || ''}
                                        </div>
                                    </Card.Body>
                                    <Card.Footer className="border-0 p-0 m-2 mx-3">
                                        <Row className="g-0 align-items-center mb-2">
                                            {
                                                data?.duration &&
                                                <>
                                                    <Col xs="auto">
                                                        <div className="sw-3 sh-4 d-flex justify-content-center align-items-center" style={{ color: '#8993A5' }} >
                                                            <CsLineIcons icon="clock" />
                                                        </div>
                                                    </Col>
                                                    <Col xs="auto">
                                                        <div className="text-alternate sh-4 d-flex align-items-center lh-1-25">
                                                            {data?.duration || 0}
                                                        </div>
                                                    </Col>
                                                    <Col xs="auto">
                                                        <div className="sw-1 sh-1 d-flex justify-content-center align-items-center mx-2 ">
                                                            <CsLineIcons icon="circle" fill="#8993A5" />
                                                        </div>
                                                    </Col>
                                                </>
                                            }
                                            <Col xs="auto">
                                                <div className="sw-3 sh-4 d-flex justify-content-center align-items-center">
                                                    <svg width="20" height="20" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path fillRule="evenodd" clipRule="evenodd"
                                                            d="M5.95833 16.5C5.59366 16.5 5.24392 16.6448 4.98606 16.9027C4.7282 17.1605 4.58333 17.5103 4.58333 17.875C4.58333 18.3812 4.17293 18.7916 3.66667 18.7916C3.16041 18.7916 2.75 18.3812 2.75 17.875C2.75 17.0241 3.08802 16.208 3.6897 15.6063C4.29138 15.0046 5.10743 14.6666 5.95833 14.6666H18.3333C18.8396 14.6666 19.25 15.077 19.25 15.5833C19.25 16.0896 18.8396 16.5 18.3333 16.5H5.95833Z" fill="#8993A5"
                                                        />
                                                        <path fillRule="evenodd" clipRule="evenodd"
                                                            d="M5.95833 2.74996C5.59366 2.74996 5.24392 2.89483 4.98606 3.15269C4.7282 3.41055 4.58333 3.76029 4.58333 4.12496V17.875C4.58333 18.2396 4.7282 18.5894 4.98606 18.8472C5.24392 19.1051 5.59366 19.25 5.95833 19.25H17.4167V2.74996H5.95833ZM5.95833 0.916626H18.3333C18.8396 0.916626 19.25 1.32703 19.25 1.83329V20.1666C19.25 20.6729 18.8396 21.0833 18.3333 21.0833H5.95833C5.10743 21.0833 4.29138 20.7453 3.6897 20.1436C3.08802 19.5419 2.75 18.7259 2.75 17.875V4.12496C2.75 3.27406 3.08802 2.458 3.6897 1.85633C4.29138 1.25465 5.10743 0.916626 5.95833 0.916626Z" fill="#8993A5"
                                                        />
                                                    </svg>
                                                </div>
                                            </Col>
                                            <Col xs="auto">
                                                <div className="text-alternate sh-4 d-flex align-items-center lh-1-25">
                                                    {data?.subjectCount || 0}{' ' + t('onlineLesson.lesson')}
                                                </div>
                                            </Col>
                                        </Row>
                                        <div className="heading mb-2" style={{height: 45}}>
                                            <div className="body-link ">
                                                {data?.name || ''}
                                            </div>
                                        </div>
                                        {
                                            data.examPercentage && parseInt(data.examPercentage) > 0 
                                            ?
                                            <div className="heading mb-2 text-right">
                                                <div className="body-link " style={{color: '#3C358F'}}>
                                                    {data?.examPercentage.toFixed(2) + '%' || ''}
                                                </div>
                                            </div>
                                            :
                                            <div className="heading mb-2 text-right" style={{height: 23.09}}/>
                                        }
                                        <Row className="align-items-center p-0">
                                            <Col className="rounded-md p-2 ml-1 d-flex justify-content-between" style={{ backgroundColor: '#f9f9f9' }}>
                                                <ProgressBar className="w-100" variant={data.percentage == 100 ? 'success' : 'primary'} now={data.percentage} style={{position: 'relative', top: 5}}/>
                                                <span className="d-flex text-small  pl-2">{(data.percentage ? data.percentage : 0) + '%'}</span>
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
                            </Col>
                        )
                    })
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
        </>
    );
};

export default StudentCourse;
