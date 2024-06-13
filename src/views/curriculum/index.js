import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Row, Col, Button, Card } from "react-bootstrap";

import Select from "modules/Form/Select";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, PointElement, LinearScale, LineElement, BarElement, Title } from 'chart.js';
import { Bar } from 'react-chartjs-2';

import BreadcrumbList from "components/breadcrumb-list/BreadcrumbList";
import { fetchRequest } from '../../utils/fetchRequest';
import message from '../../modules/message'

import {
    curriculumDashboard
} from '../../utils/fetchRequest/Urls';

const CurriculumDashboard = () => {
    ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Tooltip, Legend, Title);
    const { t } = useTranslation();
    const { selectedSchool } = useSelector(state => state?.schoolData);


    const [loading, setLoading] = useState(false);
    const [selectedViewType, setSelectedViewType] = useState('GRADE')

    const [grades, setGrades] = useState([])
    const [selectedGradeId, setSelectedGradeId] = useState(null);
    const [selectedSubjectId, setSelectedSubjectId] = useState(null);

    const [barData, setBarData] = useState({
        datasets: []
    })

    const [subjects, setSubjects] = useState([])
    const [subjectOptions, setSubjectOptions] = useState([])

    const breadcrumbs = [
        { to: "", text: "Home" },
        { to: "curriculum/dashboard", text: t('curriculum.dashboard') },
    ];

    const options = {
        indexAxis: 'x',
        elements: {
            bar: {
                borderWidth: 2,
            },
        },
        responsive: true,
        plugins: {
            legend: {
                display: false,
                position: 'right',
            },
            title: {
                display: false
            },
        },
        scales: {
            x: {
                stacked: true
            }
        }
    };

    const loadData = (params) => {
        setGrades([])
        setSubjects([])
        setLoading(true)
        fetchRequest(curriculumDashboard, 'POST', params)
            .then((res) => {
                if (res.success) {
                    setGrades(res?.grades)

                    let subjectList = []
                    if(res?.subjects && res?.subjects.length > 0){
                        for(let i = 0; i < res?.subjects.length; i++){
                            if(res?.subjects[i].subjectId){
                                subjectList.push({
                                    value: res.subjects[i].id,
                                    text: res.subjects[i].name + ' (' + res?.subjects[i].code + ')'
                                })
                            }
                        }
                    }

                    subjectList.push({
                        value: 'other',
                        text: 'Бусад',
                    })

                    setSubjectOptions(subjectList)
                    setSubjects(res?.subjects)

                    if (params?.viewType === 'GRADE') {
                        const labels = res?.grades?.map(obj => {
                            return obj?.text
                        })

                        const barParentTopics = []
                        const barChildTopics = []
                        if (res?.grades) {
                            for (let g = 0; g < res?.grades.length; g++) {
                                barParentTopics.push(res?.grades[g]?.parentCount)
                                barChildTopics.push(res?.grades[g]?.childCount)
                            }
                        }
                        setBarData({
                            labels,
                            datasets: [
                                {
                                    label: 'Нэгж хичээл',
                                    data: barParentTopics,
                                    backgroundColor: '#36A3F7',
                                },
                                {
                                    label: 'Ээлжит хичээл',
                                    data: barChildTopics,
                                    backgroundColor: '#90CCEA',
                                }
                            ],
                        })
                    } else if (params?.viewType === 'SUBJECT') {
                        const labels = res?.subjects?.map(obj => {
                            return obj?.name
                        })

                        const barParentTopics = []
                        const barChildTopics = []
                        if (res?.subjects) {
                            for (let g = 0; g < res?.subjects.length; g++) {
                                barParentTopics.push(res?.subjects[g]?.parentCount)
                                barChildTopics.push(res?.subjects[g]?.childCount)
                            }
                        }
                        setBarData({
                            labels,
                            datasets: [
                                {
                                    label: 'Нэгж хичээл',
                                    data: barParentTopics,
                                    backgroundColor: '#36A3F7',
                                },
                                {
                                    label: 'Ээлжит хичээл',
                                    data: barChildTopics,
                                    backgroundColor: '#90CCEA',
                                }
                            ],
                        })
                    }
                } else {
                    message(res.message)
                }
                setLoading(false)
            })
            .catch(() => {
                message(t('errorMessage.title'));
                setLoading(false)
            })
    }

    useEffect(() => {
        loadData({
            school: selectedSchool?.id,
            viewType: selectedViewType
        })
    }, []);

    const gradeDropdownChange = (value) => {
        setSelectedGradeId(value)

        loadData({
            viewType: selectedViewType,
            school: selectedSchool?.id,
            grade: value
        })
    }

    const subjectDropdownChange = (value) => {
        setSelectedSubjectId(value)

        loadData({
            viewType: selectedViewType,
            school: selectedSchool?.id,
            subject: value
        })
    }

    const getGradeTopics = (grade) => {
        const selected = grades.find(obj => {
            return obj?.value === grade
        })
        return <span style={{ fontFamily: 'PinnacleDemiBold' }}>Нэгж: {selected?.parentCount} | Ээлжит: {selected?.childCount}</span>
    }

    const getSubjectTopics = (subjectId) => {
        if(subjectId == 'other'){
            const filteredSubjects = subjects.filter(obj => {
                return obj?.subjectId == null
            })

            if(filteredSubjects && filteredSubjects.length > 0){
                return filteredSubjects.map((subjectObj, index) => {
                    return (
                        <Col md={3} key={'subjectObj' + index}>
                            <Card className="mb-2">
                                <Card.Body className="align-items-center">
                                    <span style={{ color: '#868AA8', fontSize: 12 }}>{subjectObj?.code}</span>
                                    <p style={{
                                        color: '#000',
                                        fontSize: 14,
                                        fontFamily: 'PinnacleDemiBold'
                                    }}>{subjectObj?.name}</p>

                                    <Row>
                                        <Col><span><span style={{ color: '#868AA8', fontSize: 12 }}>Нэгж</span> <b style={{ color: '#FF5B1D', fontSize: 16, marginLeft: 10, fontFamily: 'PinnacleDemiBold' }}>{subjectObj?.parentCount}</b></span></Col>
                                        <Col><span><span style={{ color: '#868AA8', fontSize: 12 }}>Ээлжит</span> <b style={{ color: '#FF5B1D', fontSize: 16, marginLeft: 10, fontFamily: 'PinnacleDemiBold' }}>{subjectObj?.childCount}</b></span></Col>
                                    </Row>
                                </Card.Body>
                            </Card>
                        </Col>
                    )
                })
            }
        } else {
            const selected = subjects.find(obj => {
                return obj?.id === subjectId
            })
            return <span style={{ fontFamily: 'PinnacleDemiBold' }}>Нэгж: {selected?.parentCount} | Ээлжит: {selected?.childCount}</span>
        }
    }

    const filterSubjects = (subjectId) => {
        if (subjectId) {
            return subjects.filter(subjectObj => {
                return subjectObj.id === subjectId
            })
        } else {
            return subjects
        }
    }

    return (
        <>
            <div>
                <div className="page-title-container">
                    <Row>
                        <Col md="7">
                            <h1 className="mb-0 pb-0 display-4">{t('curriculum.dashboard')}</h1>
                            <BreadcrumbList items={breadcrumbs} />
                        </Col>
                    </Row>
                </div>
                <Row style={{ width: '100%' }}>
                    <Col md={12}>
                        <Button
                            variant="primary"
                            style={{ display: 'inline-block' }}
                            className={selectedViewType === 'GRADE' ? "mr-2 text-uppercase" : "mr-2 btn-text-color text-uppercase"}
                            onClick={() => {
                                setSelectedViewType('GRADE')

                                loadData({
                                    viewType: "GRADE",
                                    school: selectedSchool?.id
                                })
                            }}
                        >
                            Түвшингээр
                        </Button>
                        <Button
                            variant="primary"
                            style={{ display: 'inline-block' }}
                            className={selectedViewType === 'SUBJECT' ? "mr-2 text-uppercase" : "mr-2 btn-text-color text-uppercase"}
                            onClick={() => {
                                setSelectedViewType('SUBJECT')
                                loadData({
                                    viewType: "SUBJECT",
                                    school: selectedSchool?.id
                                })
                            }}
                        >
                            Судлагдахуунаар
                        </Button>
                        {/* <Button
                            variant="primary"
                            className={selectedViewType === 'GOAL' ? "mr-2 add-button text-uppercase" : "mr-2 add-button btn-text-color text-uppercase"}
                            onClick={() => {
                                setSelectedViewType('GOAL')
                            }}
                        >
                            Суралцахуйн зорилт
                        </Button> */}
                    </Col>
                </Row>

                <Row className='mt-3'>
                    <Col className='ml-4'>
                        <Bar options={options} data={barData} height={50} />
                    </Col>
                </Row>
                {
                    selectedViewType === 'GRADE' && <Row className='mt-3'>
                        <Col className='ml-4'>
                            <Select
                                className='no-wrap pinnacle-bold'
                                fillArrow
                                clearable={false}
                                options={grades.map(gradeObj => {
                                    return {
                                        value: gradeObj?.value,
                                        text: gradeObj?.text
                                    }
                                })}
                                value={selectedGradeId}
                                onChange={(value) => gradeDropdownChange(value)}
                            />
                        </Col>
                        <Col className='mr-4 text-right' style={{ paddingTop: 10 }}>
                            {
                                selectedGradeId && getGradeTopics(selectedGradeId)
                            }
                        </Col>
                    </Row>
                }

                {
                    selectedViewType === 'SUBJECT' && <Row className='mt-3'>
                        <div className='ml-4'>
                            <Select
                                className='no-wrap width-350 pinnacle-bold'
                                fillArrow
                                clearable={false}
                                searchable
                                options={subjectOptions}
                                value={selectedSubjectId}
                                onChange={(value) => subjectDropdownChange(value)}
                            />
                        </div>
                        <Col className='mr-4' style={{ paddingTop: 10 }}>
                            {
                                selectedSubjectId &&
                                <Row className="mt-4">
                                    { getSubjectTopics(selectedSubjectId) }
                                </Row>
                            }
                        </Col>
                    </Row>
                }

                {selectedViewType === 'GRADE' && subjects && subjects.length > 0 && <>
                    <Row className="mt-4">
                        {
                            subjects.map(subjectObj => {
                                return <Col md={3} key={subjectObj?.id}>
                                    <Card className="mb-2">
                                        <Card.Body className="align-items-center">
                                            <span style={{ color: '#868AA8', fontSize: 12 }}>{subjectObj?.code}</span>
                                            <p style={{
                                                color: '#000',
                                                fontSize: 14,
                                                fontFamily: 'PinnacleDemiBold'
                                            }}>{subjectObj?.name}</p>

                                            <Row>
                                                <Col><span><span style={{ color: '#868AA8', fontSize: 12 }}>Нэгж</span> <b style={{ color: '#FF5B1D', fontSize: 16, marginLeft: 10, fontFamily: 'PinnacleDemiBold' }}>{subjectObj?.parentCount}</b></span></Col>
                                                <Col className="text-right"><span><span style={{ color: '#868AA8', fontSize: 12 }}>Ээлжит</span> <b style={{ color: '#FF5B1D', fontSize: 16, marginLeft: 10, fontFamily: 'PinnacleDemiBold' }}>{subjectObj?.childCount}</b></span></Col>
                                            </Row>
                                        </Card.Body>
                                    </Card>

                                </Col>
                            })
                        }
                    </Row>
                </>}

                {selectedViewType === 'SUBJECT' && subjects && subjects.length > 0 && <>
                    <Row className="mt-4">
                        {
                            filterSubjects(selectedSubjectId)?.map(subjectObj => {
                                return <Col md={3} key={subjectObj?.id}>
                                    <Card className="mb-2">
                                        <Card.Body className="align-items-center">
                                            <span style={{ color: '#868AA8', fontSize: 12 }}>{subjectObj?.code}</span>
                                            <p style={{
                                                color: '#000',
                                                fontSize: 14,
                                                fontFamily: 'PinnacleDemiBold'
                                            }}>{subjectObj?.name}</p>

                                            <Row>
                                                <Col><span><span style={{ color: '#868AA8', fontSize: 12 }}>Нэгж</span> <b style={{ color: '#FF5B1D', fontSize: 16, marginLeft: 10, fontFamily: 'PinnacleDemiBold' }}>{subjectObj?.parentCount}</b></span></Col>
                                                <Col className="text-right"><span><span style={{ color: '#868AA8', fontSize: 12 }}>Ээлжит</span> <b style={{ color: '#FF5B1D', fontSize: 16, marginLeft: 10, fontFamily: 'PinnacleDemiBold' }}>{subjectObj?.childCount}</b></span></Col>
                                            </Row>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            })
                        }
                    </Row>
                </>}

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
            </div>
        </>
    );
};

export default CurriculumDashboard;
