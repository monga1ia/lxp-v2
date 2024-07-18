import React, {useState, useEffect} from 'react'
import {Col, Row} from 'react-bootstrap'
import {Chart} from 'react-chartjs-2'
import DTable from 'modules/DataTable/DTable'
import secureLocalStorage from 'react-secure-storage'
import { useTranslation } from "react-i18next";
import {NDropdown as Dropdown} from 'widgets/Dropdown'
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
import ExamModal from '../../modal/examModal'
import {studentBookExams} from 'utils/fetchRequest/Urls'
import {fetchRequest} from 'utils/fetchRequest'
import message from 'modules/message'
import TreeView from 'modules/TreeView2'

const exam = ({id, studentCode}) => {
    const locale="mn"
    const { t } = useTranslation();
    ChartJS.register(LinearScale, ArcElement, CategoryScale, BarElement, PointElement, LineElement, Tooltip, Title, LineController, BarController)
    ChartJS.defaults.font.family = 'MulishRegular'

    const [loading, setLoading] = useState(false)

    const [examDetailId, setExamDetailId] = useState([])
    const [showExamModal, setShowExamModal] = useState(false)
    const [tableData, setTableData] = useState([])

    const [treeData, setTreeData] = useState([])
    const [selectedTreeData, setSelectedTreeData] = useState(null)

    const [selectedSubject, setSelectedSubject] = useState(null)
    const [subjectList, setSubjectList] = useState([])
    const [graphicData, setGraphicData] = useState([])

    const config = {
        showFilter: true,
        excelExport: true,
        excelFileName: `${studentCode}-${t('student.book_title')}-${t('exam.title')}`,
        defaultSort: [{
            dataField: 'firstName',
            order: 'asc'
        }]
    }

    const [chartData, setChartData] = useState(null)

    const columns = [
        {
            dataField: "takenDate",
            text: t('date'),
            sort: true,
            formatter: (cell) => cell?.date?.substring(0, 10) || '-'
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

    const loadData = (season = null, group = null) => {
        setLoading(true)
        // fetchRequest(studentBookExams, 'POST', {id, season, group})
        //     .then(res => {
        //         if (res.success) {
        //             const {exams = [], season, selectedTreeId, groups, groupExams = []} = res.data
        //             setTableData(exams || [])
        //             setSubjectList(groups || [])
        //             setTreeData(season || [])
        //             setSelectedTreeData(selectedTreeId || null)
        //             setGraphicData(groupExams || [])

        //             const labels = [];
        //             const avgScores = [];
        //             const studentScores = [];
        //             if (groupExams && groupExams.length > 0) {
        //                 for (let ge = 0; ge < groupExams.length; ge++) {
        //                     labels.push(groupExams[ge].name)
        //                     avgScores.push(groupExams[ge].avgScore)
        //                     studentScores.push(groupExams[ge].studentScore)
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
        // loadData(null, null)
    }, [])

    const handleCellClick = id => {
        setExamDetailId(id)
        setShowExamModal(true)
    }

    const closeModal = () => {
        setExamDetailId(null)
        setShowExamModal(false)
    }

    const handleTreeChange = key => {
        setSelectedTreeData(key)
        loadData(key, selectedSubject)
    }

    const onSubjectChange = (subjectId) => {
        setSelectedSubject(subjectId)
        loadData(selectedTreeData, subjectId)
    }

    const onUserInteraction = (params) => {
    console.log('params', params)
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
                    <div style={{width: 300, marginLeft: 40, marginBottom: 20, display: 'flex', alignItems: "center"}}>
                        <div className={'pinnacle-bold'} style={{ marginRight: 20}}>{t('subject.title')}</div>
                        <Dropdown
                            fluid
                            selection
                            clearable
                            value={selectedSubject}
                            options={subjectList.map(subjectObj => {
                                return {
                                    value: subjectObj?.id,
                                    text: subjectObj?.name
                                }
                            })}
                            placeholder={'-' + t('select') + '-'}
                            onChange={(e, data) => onSubjectChange(data?.value)}
                        />
                    </div>
                    {
                        selectedSubject && <div className='border-orange p-4 br-08 mt-2'>
                            <Chart
                                type='bar'
                                data={chartData}
                                height={400}
                                options={{maintainAspectRatio: false}}
                            />
                        </div>
                    }
                    <div className='border-orange px-4 br-08 mt-2'>
                        <DTable
                            locale={locale}
                            config={config}
                            data={tableData}
                            columns={columns}
                            onInteraction={onUserInteraction}
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
            {showExamModal &&
            <ExamModal
                onClose={closeModal}
                studentId={id}
                detailId={examDetailId}
            />
            }
        </>
    )
}

export default exam