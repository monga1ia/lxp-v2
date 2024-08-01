import React, {useState, useEffect} from 'react'
import {Col, Row} from 'react-bootstrap'
import {Chart as Chart2, Doughnut} from 'react-chartjs-2'
import DTable from 'modules/DataTable/DTable'
import TreeView from 'modules/TreeView2'
import { useTranslation } from "react-i18next";
import {
    Chart as ChartJS,
    ArcElement,
    LinearScale,
    CategoryScale,
    BarElement,
    PointElement,
    LineElement,
    Tooltip,
    LineController,
    BarController,
    Title
} from 'chart.js'

import Chart from 'react-apexcharts'
import SeasonResultModal from '../../modal/seasonResultModal'
import {studentBookExamResults} from 'utils/fetchRequest/Urls'
import {fetchRequest} from 'utils/fetchRequest'

const seasonResult = ({id, studentCode}) => {
    const locale="mn"
    const { t } = useTranslation();
    ChartJS.register(LinearScale, ArcElement, CategoryScale, BarElement, PointElement, LineElement, Tooltip, Title, LineController, BarController)
    ChartJS.defaults.font.family = 'MulishRegular'

    const [loading, setLoading] = useState(false)

    const [examDtlId, setExamDtlId] = useState(null)
    const [showSeasonResultModal, setShowSeasonResultModal] = useState(false)
    const [tableData, setTableData] = useState([])

    const [treeData, setTreeData] = useState([])
    const [selectedTreeData, setSelectedTreeData] = useState(null)
    const [sResult, setSResult] = useState(null)

    const config = {
        excelExport: true,
        excelFileName: `${studentCode}-${t('student.book_title')}-${t('studentBookNavs.season_grade')}`,
        defaultSort: [{
            dataField: 'subjectName',
            order: 'asc'
        }]
    }

    const columns = [
        {
            dataField: "takenDate",
            text: t('date'),
            sort: true,
            formatter: (cell, row) => {
                if (cell && cell?.date) {
                    return cell?.date?.substring(0, 10) || '-'
                } else {
                    return row?.createdDate?.date?.substring(0, 10) || '-'
                }
            }
        },
        {
            dataField: "subjectName",
            text: t('course_lesson'),
            sort: true,
        },
        {
            dataField: 'name',
            text: t('exam.name'),
            sort: true,
        },
        {
            dataField: 'studentScore',
            text: t('season_score.performance'),
            sort: true,
            align: 'right',
            formatter: (cell, row) => <span onClick={() => handleCellClick(row?.dtlId)}
                                            className={'underline'}> {cell || 0}</span>
        },
        {
            dataField: 'studentPlace',
            text: t('exam.ranking'),
            align: 'right',
            sort: true,
        },
        {
            dataField: 'teacherName',
            text: t('teacher_title'),
            sort: true,
        },
        {
            dataField: 'maxScore',
            align: 'right',
            text: t('exam.max_score'),
            sort: true,
        },
        {
            dataField: 'minScore',
            align: 'right',
            text: t('exam.min_score'),
            sort: true,
        },
        {
            dataField: 'avgScore',
            align: 'right',
            text: t('average'),
            sort: true,
        }
    ]

    const [chartData, setChartData] = useState(null)

    const loadData = (season = null, subject = null) => {
        setLoading(true)
        // fetchRequest(studentBookExamResults, 'POST', {id, season, subject})
        //     .then(res => {
        //         if (res.success) {
        //             const {exams, seasons, selectedSeason, studentResult} = res.data
        //             setTableData(exams || [])
        //             setTreeData(seasons || [])
        //             setSelectedTreeData(selectedSeason || null)
        //             setSResult(studentResult || null)

        //             const labels = [];
        //             const avgScores = [];
        //             const studentScores = [];
        //             if (exams && exams.length > 0) {
        //                 for (let ge = 0; ge < exams.length; ge++) {
        //                     labels.push(exams[ge].subjectName)
        //                     avgScores.push(exams[ge].avgScore)
        //                     studentScores.push(exams[ge].studentScore)
        //                 }
        //             }

        //             setChartData({
        //                 labels,
        //                 datasets: [
        //                     {
        //                         type: 'line',
        //                         label: t('studentBook.class_average'),
        //                         data: avgScores,
        //                         borderColor: '#e02020',
        //                         backgroundColor: '#e02020',
        //                         borderWidth: 2,
        //                     },
        //                     {
        //                         type: 'bar',
        //                         label: t('studentBook.student_point'),
        //                         data: studentScores,
        //                         backgroundColor: 'rgba(255, 91, 29, 0.5)',
        //                         borderColor: '#ff5b1d',
        //                         borderWidth: 1,
        //                         barPercentage: 0.4,
        //                     }
        //                 ]
        //             })

        //         } else {
        //             message(res.data.message)
        //         }
        //         setLoading(false)
        //     })
        //     .catch(() => {
        //         message(t('err.error_occurred'))
        //         setLoading(false)
        //     })
    }

    useEffect(() => {
        // loadData()
    }, [])

    const handleCellClick = id => {
        setExamDtlId(id)
        setShowSeasonResultModal(true)
    }

    const closeModal = () => {
        setExamDtlId(null)
        setShowSeasonResultModal(false)
    }

    const handleTreeChange = key => {
        setSelectedTreeData(key)
        loadData(key, selectedTreeData)
    }

    return (
        <>
            <Row>
                <Col md={3} className='col-form-label text-right' style={{marginTop: -60}}>
                    <div className='m-portlet__body border-orange br-08 ' style={{borderWidth: 4, textAlign: 'left'}}>
                        <TreeView
                            defaultExpandAll
                            treeData={treeData}
                            selectedNodes={[selectedTreeData]}
                            onSelect={(key) => {
                                handleTreeChange(key?.[0])
                            }}
                        />
                    </div>
                </Col>
                <Col md={9}>
                    {
                        sResult && <div className='border-orange px-4 br-08 mt-4 bolder'>
                            <Row>
                                <Col className='py-3'>
                                    <Chart
                                        options={{
                                            plugins: {
                                                title: {
                                                    display: true,
                                                    text: t('studentBook.seasonScore')
                                                }
                                            },
                                            chart: {
                                                height: 150,
                                                type: 'radialBar',
                                            },
                                            colors: ["#0231b8"],
                                            plotOptions: {
                                                radialBar: {
                                                    track: {
                                                        background: '#009aff'
                                                    },
                                                    hollow: {
                                                        size: '70%',
                                                        background: 'transparent'
                                                    },
                                                    dataLabels: {
                                                        name: {
                                                            fontFamily: 'MulishRegular'
                                                        }
                                                    }
                                                },
                                            },
                                            labels: [sResult?.scoreTypeName],
                                            title: {
                                                text: t('studentBook.seasonScore'),
                                                align: 'center',
                                                style: {
                                                    fontSize:  '12px',
                                                    fontFamily:  'MulishRegular'
                                                },
                                            }
                                        }}
                                        series={[sResult?.score]}
                                        type="radialBar"
                                        height={150}/>
                                </Col>
                                <Col className='d-flex flex-column justify-content-center'>
                                    <Row>
                                        <Col className='text-right'>{t('studentBook.rank')}</Col>
                                        <Col className='color-brand'>{sResult?.studentPlace}</Col>
                                    </Row>
                                    <Row>
                                        <Col className='text-right'>{t('season_score.quality')}</Col>
                                        <Col className='color-brand'>{sResult?.quality}</Col>
                                    </Row>
                                    <Row>
                                        <Col className='text-right'>{t('season_score.success')}</Col>
                                        <Col className='color-brand'>{sResult?.success}</Col>
                                    </Row>
                                    <Row>
                                        <Col
                                            className='text-right'>{t('season_score.performance')}</Col>
                                        <Col className='color-brand'>{sResult?.score}</Col>
                                    </Row>
                                </Col>
                                <Col className='d-flex flex-column justify-content-center'>
                                    {sResult?.details?.map((item, key) => (
                                        <Row>
                                            <Col
                                                className='text-right'>{item?.scoreTypeCode}- {item?.scoreTypeName}</Col>
                                            <Col className='color-brand'>{item?.quantity}</Col>
                                        </Row>))}
                                </Col>
                            </Row>
                        </div>
                    }
                    <div className='border-orange p-4 br-08 mt-2'>
                        {
                            chartData &&
                            <Chart2
                                type='bar'
                                data={chartData}
                                height={400}
                                options={{maintainAspectRatio: false}}
                            />
                        }
                    </div>
                    <div className='border-orange px-4 br-08 mt-2'>
                        <DTable
                            locale={locale}
                            config={config}
                            data={tableData}
                            columns={columns}
                        />
                    </div>
                </Col>

            </Row>
            {loading &&
            <>
                <div className='blockUI blockOverlay'/>
                <div className='blockUI blockMsg blockPage'>
                    <div className='m-loader m-loader--brand m-loader--lg'/>
                </div>
            </>
            }
            {showSeasonResultModal &&
                <SeasonResultModal
                    onClose={closeModal}
                    studentId={id}
                    id={examDtlId}
                />
            }
        </>
    )
}

export default seasonResult