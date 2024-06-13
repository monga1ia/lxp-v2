import React, { useEffect, useState, useContext, useRef } from "react";
import { useHistory, useLocation } from "react-router-dom";
import HtmlHead from "components/html-head/HtmlHead";
import { useSelector } from "react-redux";
import { Button, Card, Col, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import FilterIcon from "cs-line-icons/custom/FilterIcon";
import { fetchRequest } from "utils/fetchRequest";
import { dashboardExamIndex } from 'utils/fetchRequest/Urls';
import showMessage from "modules/message";
import BreadcrumbList from "components/breadcrumb-list/BreadcrumbList";
import Select from "modules/Form/Select";
import 'react-horizontal-scrolling-menu/dist/styles.css';

const index = () => {
    const { t } = useTranslation();
    const mostUsedRef = useRef();
    const mostUsedTempRef = useRef();
    const highestQuestionRef = useRef();
    const lowestQuestionRef = useRef();
    const highestExamRef = useRef();
    const lowestExamRef = useRef();
    const { selectedSchool } = useSelector(state => state.schoolData);

    const [loading, setLoading] = useState(false)

    const [title, setTitle] = useState(t('dashboard.exam'));
    const [grades, setGrades] = useState([])
    const [subjects, setSubjects] = useState([])
    const [mostUsedQuestions, setMostUsedQuestions] = useState([])
    const [mostUsedTemplate, setMostUsedTemplate] = useState([])
    const [highestPerformanceQuestions, setHighestPerformanceQuestions] = useState([])
    const [lowestPerformanceQuestions, setLowestPerformanceQuestions] = useState([])
    const [highestPerformanceExams, setHighestPerformanceExams] = useState([])
    const [lowestPerformanceExams, setLowestPerformanceExams] = useState([])

    const [mostUsedQPagination, setMostUsedQPagination] = useState({
        page: 1,
        pageSize: 10,
    })
    const [mostUsedTempPagination, setMostUsedTempPagination] = useState({
        page: 1,
        pageSize: 10,
    })
    const [highestQuestionPagination, setHighestQuestionPagination] = useState({
        page: 1,
        pageSize: 10,
    })
    const [lowestQuestionPagination, setLowestQuestionPagination] = useState({
        page: 1,
        pageSize: 10,
    })
    const [highestExamPagination, setHighestExamPagination] = useState({
        page: 1,
        pageSize: 10,
    })
    const [lowestExamPagination, setLowestExamPagination] = useState({
        page: 1,
        pageSize: 10,
    })

    const [selectedGrade, setSelectedGrade] = useState(null)
    const [selectedSubject, setSelectedSubject] = useState(null)

    const [totalCountMostUsedQuestion, setTotalCountMostUsedQuestion] = useState(0)
    const [totalCountMostUsedTemplate, setTotalCountMostUsedTemplate] = useState(0)
    const [totalCountQuestion, setTotalCountQuestion] = useState(0)
    const [totalCountExam, setTotalCountExam] = useState(0)

    const useHorizontalScrollEvent = (callback) => {
        const positionRef = React.useRef(0);
        return (e) => {
              const x = e.currentTarget.scrollLeft;
              if (x !== positionRef.current) {
                positionRef.current = x;
                e.preventDefault();
                e.stopPropagation();
                
                if (e.target.classList.contains("on-scrollbar") === false) {
                    e.target.classList.add("on-scrollbar");
                }

                callback(
                    e,
                    x, 
                    mostUsedRef?.current?.scrollLeft + mostUsedRef?.current?.offsetWidth > (mostUsedRef?.current?.scrollWidth - 2),
                    mostUsedTempRef?.current?.scrollLeft + mostUsedTempRef?.current?.offsetWidth > (mostUsedTempRef?.current?.scrollWidth - 2),
                    highestQuestionRef?.current?.scrollLeft + highestQuestionRef?.current?.offsetWidth > (highestQuestionRef?.current?.scrollWidth - 2),
                    lowestQuestionRef?.current?.scrollLeft + lowestQuestionRef?.current?.offsetWidth > (lowestQuestionRef?.current?.scrollWidth - 2),
                    highestExamRef?.current?.scrollLeft + highestExamRef?.current?.offsetWidth > (highestExamRef?.current?.scrollWidth - 2),
                    lowestExamRef?.current?.scrollLeft + lowestExamRef?.current?.offsetWidth > (lowestExamRef?.current?.scrollWidth - 2),
                );
            }
        };
    };

    const breadcrumbs = [
        { to: "", text: "Home" },
        { to: "dashboard/exam", text: title },
    ];

    const description = "";

    const init = (params) => {
        setLoading(true)
        fetchRequest(dashboardExamIndex, 'POST', params)
            .then((res) => {
                if (res.success) {
                    setGrades(res?.grades || [])
                    setSubjects(res?.subjects?.map(subjectObj => {
                        return {
                            value: subjectObj?.id,
                            text: subjectObj?.name
                        }
                    }))

                    setTotalCountMostUsedQuestion(res?.mostUsedQuestionCount || 0)
                    setTotalCountMostUsedTemplate(res?.mostUsedTemplateCount || 0)
                    setTotalCountQuestion(res?.questionCount || 0)
                    setTotalCountExam(res?.examCount || 0)

                    setMostUsedQuestions(res?.mostUsedQuestions || [])
                    setMostUsedTemplate(res?.mostUsedTemplate || [])
                    setHighestPerformanceQuestions(res?.highestPerformanceQuestions || [])
                    setLowestPerformanceQuestions(res?.lowestPerformanceQuestions || [])
                    setHighestPerformanceExams(res?.highestPerformanceExams || [])
                    setLowestPerformanceExams(res?.lowestPerformanceExams || [])
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

    const loader = (params) => {
        setLoading(true)
        fetchRequest(dashboardExamIndex, 'POST', params)
            .then((res) => {
                if (res.success) {
                    if(params.type == 'mostUsedQuestion'){
                        if(res?.mostUsedQuestions && res?.mostUsedQuestions.length > 0){
                            let cloneData = [...mostUsedQuestions]

                            for(let i = 0; i < res?.mostUsedQuestions.length; i++){
                                cloneData.push(res?.mostUsedQuestions[i])
                            }

                            setMostUsedQPagination({
                                page: params.page
                            })
                            setMostUsedQuestions(cloneData)
                        }
                    }

                    if(params.type == 'mostUsedTemplate'){
                        if(res?.mostUsedTemplate && res?.mostUsedTemplate.length > 0){
                            let cloneData = [...mostUsedTemplate]

                            for(let i = 0; i < res?.mostUsedTemplate.length; i++){
                                cloneData.push(res?.mostUsedTemplate[i])
                            }

                            setMostUsedTempPagination({
                                page: params.page
                            })
                            setMostUsedTemplate(cloneData)
                        }
                    }

                    if(params.type == 'highestQuestions'){
                        if(res?.highestPerformanceQuestions && res?.highestPerformanceQuestions.length > 0){
                            let cloneData = [...highestPerformanceQuestions]

                            for(let i = 0; i < res?.highestPerformanceQuestions.length; i++){
                                cloneData.push(res?.highestPerformanceQuestions[i])
                            }

                            setHighestQuestionPagination({
                                page: params.page
                            })
                            setHighestPerformanceQuestions(cloneData)
                        }
                    }

                    if(params.type == 'lowestQuestions'){
                        if(res?.lowestPerformanceQuestions && res?.lowestPerformanceQuestions.length > 0){
                            let cloneData = [...lowestPerformanceQuestions]

                            for(let i = 0; i < res?.lowestPerformanceQuestions.length; i++){
                                cloneData.push(res?.lowestPerformanceQuestions[i])
                            }

                            setLowestQuestionPagination({
                                page: params.page
                            })
                            setLowestPerformanceQuestions(cloneData)
                        }
                    }

                    if(params.type == 'highestExam'){
                        if(res?.highestPerformanceExams && res?.highestPerformanceExams.length > 0){
                            let cloneData = [...highestPerformanceExams]

                            for(let i = 0; i < res?.highestPerformanceExams.length; i++){
                                cloneData.push(res?.highestPerformanceExams[i])
                            }

                            setHighestExamPagination({
                                page: params.page
                            })
                            setHighestPerformanceExams(cloneData)
                        }
                    }

                    if(params.type == 'lowestExam'){
                        if(res?.lowestPerformanceExams && res?.lowestPerformanceExams.length > 0){
                            let cloneData = [...lowestPerformanceExams]

                            for(let i = 0; i < res?.lowestPerformanceExams.length; i++){
                                cloneData.push(res?.lowestPerformanceExams[i])
                            }

                            setLowestExamPagination({
                                page: params.page
                            })
                            setLowestPerformanceExams(cloneData)
                        }
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
        init({
            school: selectedSchool?.id,
        })
    }, [])

    const clearSearch = () => {
        setSelectedGrade(null)
        setSelectedSubject(null)

        init({
            school: selectedSchool?.id
        })
    }

    const searchButtonHandler = () => {
        if(!selectedGrade){
            showMessage(t('errorMessage.selectGrade'));
            return
        }

        if(!selectedSubject){
            showMessage(t('errorMessage.selectSubject'));
            return
        }

        const params = {
            school: selectedSchool?.id,
            grade: selectedGrade,
            subject: selectedSubject,
        }
        init(params)
    }

    const onGradeChange = (value) => {
        setSelectedGrade(value)
        init({
            school: selectedSchool?.id,
            grade: value,
        })
    }

    const onSubjectChange = (value) => {
        setSelectedSubject(value)
        init({
            school: selectedSchool?.id,
            grade: selectedGrade,
            subject: value,
        })
    }

    const handleScrollMostQuestion = useHorizontalScrollEvent((e, xAxis, isMostUsed, isMostUsedTemp, highestQuestion, lowestQuestion, highestExam, lowestExam) => {
        e.preventDefault();
        e.stopPropagation();

        if(isMostUsed){
            if(totalCountMostUsedQuestion && totalCountMostUsedQuestion > mostUsedQuestions.length){
                loader({
                    school: selectedSchool?.id,
                    page: mostUsedQPagination.page + 1,
                    pageSize: mostUsedQPagination.pageSize,
                    grade: selectedGrade,
                    subject: selectedSubject,
                    type: 'mostUsedQuestion'
                })
            }
        } 
    });

    const handleScrollMostTemplate = useHorizontalScrollEvent((e, xAxis, isMostUsed, isMostUsedTemp, highestQuestion, lowestQuestion, highestExam, lowestExam) => {
        e.preventDefault();
        e.stopPropagation();

        if(isMostUsedTemp){
            if(totalCountMostUsedTemplate && totalCountMostUsedTemplate > mostUsedTemplate.length){
                loader({
                    school: selectedSchool?.id,
                    page: mostUsedTempPagination.page + 1,
                    pageSize: mostUsedTempPagination.pageSize,
                    grade: selectedGrade,
                    subject: selectedSubject,
                    type: 'mostUsedTemplate'
                })
            }
        }
    });

    const handleScrollHighestQuestion = useHorizontalScrollEvent((e, xAxis, isMostUsed, isMostUsedTemp, highestQuestion, lowestQuestion, highestExam, lowestExam) => {
        e.preventDefault();
        e.stopPropagation();

        if(highestQuestion){
            if(totalCountQuestion && totalCountQuestion > highestPerformanceQuestions.length){
                loader({
                    school: selectedSchool?.id,
                    page: highestQuestionPagination.page + 1,
                    pageSize: highestQuestionPagination.pageSize,
                    grade: selectedGrade,
                    subject: selectedSubject,
                    type: 'highestQuestions'
                })
            }
        }
    });

    const handleScrollLowestQuestion = useHorizontalScrollEvent((e, xAxis, isMostUsed, isMostUsedTemp, highestQuestion, lowestQuestion, highestExam, lowestExam) => {
        e.preventDefault();
        e.stopPropagation();

        if(lowestQuestion){
            if(totalCountQuestion && totalCountQuestion > lowestPerformanceQuestions.length){
                loader({
                    school: selectedSchool?.id,
                    page: lowestQuestionPagination.page + 1,
                    pageSize: lowestQuestionPagination.pageSize,
                    grade: selectedGrade,
                    subject: selectedSubject,
                    type: 'lowestQuestions'
                })
            }
        }
    });

    const handleScrollHighestExam = useHorizontalScrollEvent((e, xAxis, isMostUsed, isMostUsedTemp, highestQuestion, lowestQuestion, highestExam, lowestExam) => {
        e.preventDefault();
        e.stopPropagation();

        if(highestExam){
            if(totalCountExam && totalCountExam > highestPerformanceExams.length){
                loader({
                    school: selectedSchool?.id,
                    page: highestExamPagination.page + 1,
                    pageSize: lowestQuestionPagination.pageSize,
                    grade: selectedGrade,
                    subject: selectedSubject,
                    type: 'highestExam'
                })
            }
        }
    });

    const handleScrollLowestExam = useHorizontalScrollEvent((e, xAxis, isMostUsed, isMostUsedTemp, highestQuestion, lowestQuestion, highestExam, lowestExam) => {
        e.preventDefault();
        e.stopPropagation();

        if(lowestExam){
            if(totalCountExam && totalCountExam > lowestPerformanceExams.length){
                loader({
                    school: selectedSchool?.id,
                    page: lowestExamPagination.page + 1,
                    pageSize: lowestQuestionPagination.pageSize,
                    grade: selectedGrade,
                    subject: selectedSubject,
                    type: 'lowestExam'
                })
            }
        }
    });

    return (
        <>
            <HtmlHead title={title} description={description} />
            <div className="page-title-container">
                <Row>
                    <Col md="7">
                        <h1 className="mb-0 pb-0 display-4 relative">{title}</h1>
                        <BreadcrumbList items={breadcrumbs} />
                    </Col>
                </Row>
            </div>
            <Row className="">
                <Col xl="4" xxl="3">
                    <h2 className="small-title">{t("exam.filter")}</h2>
                    <Card className="mb-2">
                        <Card.Body className="p-3">
                            <p className="mb-2 modal-select-title">{t("curriculum.grade")}</p>
                            {console.log(grades)}
                            <Select
                                clearable
                                searchable
                                options={grades}
                                value={selectedGrade}
                                onChange={(value) => onGradeChange(value)}
                            />

                            <p className="my-2 modal-select-title">{t("exam.subject")}</p>
                            <Select
                                clearable
                                options={subjects}
                                searchable
                                value={selectedSubject}
                                onChange={(value) => onSubjectChange(value)}
                            />

                            <Row className="m-0">
                                <Button className='btn btn-link clear-button cursor-pointer' variant='link' onClick={clearSearch}>
                                    {t("common.clear").toUpperCase()}
                                </Button>
                            </Row>
                            <Row className="m-0">
                                <Button className="d-flex flex-row justify-content-between filter-button mt-2 cursor-pointer" variant='empty' onClick={() => searchButtonHandler()}>
                                    <FilterIcon />
                                    {t("common.search").toUpperCase()}
                                    <div style={{ paddingLeft: 15 }} />
                                </Button>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>

                <Col xl="8" xxl="9" className="pl-0">
                    <h2 className="small-title mt-2" style={{position: 'relative', top: 3}}>{t("dashboard.label.mostUsedExamQuestion")}</h2>
                    <div id='container1'>
                        <Col 
                            id='container2'
                            ref={mostUsedRef}
                            className="d-flex hide-scroll-bar"
                            // style={{overflowX: 'auto'}}
                            onScroll={handleScrollMostQuestion}
                        >
                            {
                                mostUsedQuestions && mostUsedQuestions.length > 0 && 
                                mostUsedQuestions.map((data, index) => {
                                    return (
                                        <Card 
                                            style={{width: 300}}
                                            key={'most_used_' + index}
                                            className="col-md-4 mb-3 d-flex align-items-stretch mr-3"
                                        >
                                            <Card.Body className="d-flex flex-row flex-wrap p-3" >
                                                <Col md={12} className='label-gray'>
                                                    {(data?.gradeName || '') + ' | ' + (data?.subjectName || '')}
                                                </Col>
                                                <Col md={12} className='black-color pinnacle-demi-bold mt-2 mb-2'>
                                                    {
                                                        data.hasTradition 
                                                        ?
                                                            <div className='text-semi-large text-dark ml-2 tradition-text' dangerouslySetInnerHTML={{ __html: data.content.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&') }} style={{height: 'auto'}}/>
                                                        : 
                                                            <div dangerouslySetInnerHTML={{ __html: data.content.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&') }}/>
                                                    }
                                                </Col>
                                                <Col md={12} className='d-flex align-items-end'>
                                                    <div className='col-12 d-flex justify-content-between'>
                                                        <div/>
                                                        <div className="label-gray d-flex">{t('dashboard.label.usedCount') + ':'}<div className='label-orange pinnacle-demi-bold ml-4' style={{fontSize: 15}}>{data?.usedCount || 0}</div></div>
                                                    </div>
                                                </Col>
                                            </Card.Body>
                                        </Card>
                                    )
                                })
                            }
                        </Col>
                    </div>
                    
                    
                    <h2 className="small-title mt-2" style={{position: 'relative', top: 3}}>{t("dashboard.label.mostUsedExam")}</h2>
                    <Col 
                        ref={mostUsedTempRef}
                        className="d-flex hide-scroll-bar"
                        // style={{overflowX: 'auto'}}
                        onScroll={handleScrollMostTemplate}
                    >
                        {
                            mostUsedTemplate && mostUsedTemplate.length > 0 && 
                            mostUsedTemplate.map((data, index) => {
                                return (
                                    <Card 
                                        key={'template_' + index}
                                        className="col-md-4 mb-3 d-flex align-items-stretch mr-3"
                                    >
                                        <Card.Body className="d-flex flex-row flex-wrap p-3">
                                            <Col md={12} className='label-gray'>
                                                {(data?.gradeName || '') + ' | ' + (data?.subjectName || '')}
                                            </Col>
                                            <Col md={12} className='black-color pinnacle-demi-bold mt-2 mb-2'>
                                                <div>{data.templateName}</div>
                                            </Col>
                                            <Col md={12} className='d-flex align-items-end'>
                                                <div className='col-12 d-flex justify-content-between'>
                                                    <div/>
                                                    <div className="label-gray d-flex">{t('dashboard.label.usedCount') + ':'}<div className='label-orange pinnacle-demi-bold ml-4' style={{fontSize: 15}}>{data?.usedCount || 0}</div></div>
                                                </div>
                                            </Col>
                                        </Card.Body>
                                    </Card>
                                )
                            })
                        }
                    </Col>
                    
                    <h2 className="small-title mt-2" style={{position: 'relative', top: 3}}>{t("dashboard.label.highestPerformanceExamQuestion")}</h2>
                    <Col 
                        ref={highestQuestionRef}
                        className="d-flex hide-scroll-bar"
                        // style={{overflowX: 'auto'}}
                        onScroll={handleScrollHighestQuestion}
                    >
                        {
                            highestPerformanceQuestions && highestPerformanceQuestions.length > 0 && 
                            highestPerformanceQuestions.map((data, index) => {
                                return (
                                    <Col key={'highest_' + index} md={4} className='mr-3 d-flex align-items-stretch'>
                                        <Card className="mb-3 w-100">
                                            <Card.Body className="d-flex flex-row flex-wrap p-3">
                                                <Col md={12} className='label-gray'>
                                                    {(data?.gradeName || '') + ' | ' + (data?.subjectName || '')}
                                                </Col>
                                                <Col md={12} className='black-color pinnacle-demi-bold mt-2 mb-2'>
                                                    {
                                                        data.hasTradition 
                                                        ?
                                                            <div className='text-semi-large text-dark ml-2 tradition-text' dangerouslySetInnerHTML={{ __html: data.content.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&') }} style={{height: 'auto'}}/>
                                                        : 
                                                            <div dangerouslySetInnerHTML={{ __html: data.content.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&') }}/>
                                                    }
                                                </Col>
                                                <Col md={12} className='d-flex align-items-end'>
                                                    <div className='col-12 d-flex justify-content-between'>
                                                        <div className='label-orange pinnacle-demi-bold' style={{fontSize: 16}}>{data.score > 0 ? ((data.userScore * 100) / data.score)?.toFixed(2) : 0}%</div>
                                                        <div className="label-gray d-flex">{t('dashboard.label.usedCount') + ':'}<div className='label-orange pinnacle-demi-bold ml-4' style={{fontSize: 15}}>{data?.usedCount || 0}</div></div>
                                                    </div>
                                                </Col>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                )
                            })
                        }
                    </Col>
                    
                    <h2 className="small-title mt-2" style={{position: 'relative', top: 3}}>{t("dashboard.label.lowestPerformanceExamQuestion")}</h2>
                    <Col 
                        ref={lowestQuestionRef}
                        className="d-flex hide-scroll-bar"
                        // style={{overflowX: 'auto'}}
                        onScroll={handleScrollLowestQuestion}
                    >
                        {
                            lowestPerformanceQuestions && lowestPerformanceQuestions.length > 0 && 
                            lowestPerformanceQuestions.map((data, index) => {
                                return (
                                    <Col key={'highest_' + index} md={4} className='mr-3 d-flex align-items-stretch'>
                                        <Card className="mb-3 w-100">
                                            <Card.Body className="d-flex flex-row flex-wrap p-3">
                                                <Col md={12} className='label-gray'>
                                                    {(data?.gradeName || '') + ' | ' + (data?.subjectName || '')}
                                                </Col>
                                                <Col md={12} className='black-color pinnacle-demi-bold mt-2 mb-2'>
                                                    {
                                                        data.hasTradition 
                                                        ?
                                                            <div className='text-semi-large text-dark ml-2 tradition-text' dangerouslySetInnerHTML={{ __html: data.content.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&') }} style={{height: 'auto'}}/>
                                                        : 
                                                            <div dangerouslySetInnerHTML={{ __html: data.content.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&') }}/>
                                                    }
                                                </Col>
                                                <Col md={12} className='d-flex align-items-end'>
                                                    <div className='col-12 d-flex justify-content-between'>
                                                        <div className='label-orange pinnacle-demi-bold' style={{fontSize: 16}}>{data.score > 0 ? ((data.userScore * 100) / data.score)?.toFixed(2) : 0}%</div>
                                                        <div className="label-gray d-flex">{t('dashboard.label.usedCount') + ':'}<div className='label-orange pinnacle-demi-bold ml-4' style={{fontSize: 15}}>{data?.usedCount || 0}</div></div>
                                                    </div>
                                                </Col>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                )
                            })
                        }
                    </Col>
                    
                    <h2 className="small-title mt-2" style={{position: 'relative', top: 3}}>{t("dashboard.label.highestPerformanceExam")}</h2>
                    <Col 
                        ref={highestExamRef}
                        className="d-flex hide-scroll-bar"
                        // style={{overflowX: 'auto'}}
                        onScroll={handleScrollHighestExam}
                    >
                        {   
                            highestPerformanceExams && highestPerformanceExams.length > 0 && 
                            highestPerformanceExams.map((data, index) => {
                                return (
                                    <Col key={'highest_' + index} md={4} className='mr-3 d-flex align-items-stretch'>
                                        <Card className="mb-3 w-100">
                                            <Card.Body className="d-flex flex-row flex-wrap p-3">
                                                <Col md={12} className='label-gray'>
                                                    {(data?.gradeName || '') + ' | ' + (data?.subjectName || '')}
                                                </Col>
                                                <Col md={12} className='black-color pinnacle-demi-bold mt-2 mb-2'>
                                                    <div>{data?.name || ''}</div>
                                                </Col>
                                                <Col md={12} className='d-flex align-items-end'>
                                                    <div className='col-12 d-flex justify-content-between'>
                                                        <div className='label-orange pinnacle-demi-bold' style={{fontSize: 16}}>{data?.avgPercentage && data?.avgPercentage > 0 ? Number(data.avgPercentage)?.toFixed(2) : 0}%</div>
                                                        <div/>
                                                    </div>
                                                </Col>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                )
                            })
                        }
                    </Col>
                    
                    <h2 className="small-title mt-2" style={{position: 'relative', top: 3}}>{t("dashboard.label.lowestPerformanceExam")}</h2>
                    <Col 
                        ref={lowestExamRef}
                        className="d-flex hide-scroll-bar"
                        // style={{overflowX: 'auto'}}
                        onScroll={handleScrollLowestExam}
                    >
                        {
                            lowestPerformanceExams && lowestPerformanceExams.length > 0 && 
                            lowestPerformanceExams.map((data, index) => {
                                return (
                                    <Col key={'highest_' + index} md={4} className='mr-3 d-flex align-items-stretch'>
                                        <Card className="mb-3 w-100">
                                            <Card.Body className="d-flex flex-row flex-wrap p-3">
                                                <Col md={12} className='label-gray'>
                                                    {(data?.gradeName || '') + ' | ' + (data?.subjectName || '')}
                                                </Col>
                                                <Col md={12} className='black-color pinnacle-demi-bold mt-2 mb-2'>
                                                    <div>{data?.name || ''}</div>
                                                </Col>
                                                <Col md={12} className='d-flex align-items-end'>
                                                    <div className='col-12 d-flex justify-content-between'>
                                                        <div className='label-orange pinnacle-demi-bold' style={{fontSize: 16}}>{data?.avgPercentage && data?.avgPercentage > 0 ? Number(data.avgPercentage)?.toFixed(2) : 0}</div>
                                                        <div/>
                                                    </div>
                                                </Col>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                )
                            })
                        }
                    </Col>
                </Col>
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

export default index;
