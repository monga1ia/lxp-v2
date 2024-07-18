import React, { useState, useEffect } from 'react'
import { Col, Row } from 'react-bootstrap'
import DTable from 'modules/DataTable/DTable'
import secureLocalStorage from 'react-secure-storage'
import { useTranslation } from "react-i18next";
import { NDropdown as Dropdown } from 'widgets/Dropdown'
import { Chart as ChartJS, ArcElement, LinearScale, CategoryScale, BarElement, PointElement, LineElement, Tooltip, LineController, BarController, Title } from 'chart.js'
import SkillModal from '../../modal/skillModal'
import { studentBookSkills } from 'utils/fetchRequest/Urls'
import { fetchRequest } from 'utils/fetchRequest'
import TreeView from 'modules/TreeView2'
import message from 'modules/message';

const skill = ({id, studentCode}) => {
    const locale="mn"
    const { t } = useTranslation();
    ChartJS.register(LinearScale, ArcElement, CategoryScale, BarElement, PointElement, LineElement, Tooltip, Title, LineController, BarController)
    ChartJS.defaults.font.family = 'MulishRegular'

    const [loading, setLoading] = useState(false)

    const [skillId, setSkillId] = useState([])
    const [showSkillModal, setShowSkillModal] = useState(false)
    const [tableData, setTableData] = useState([])

    const [treeData, setTreeData] = useState([])
    const [selectedTreeData, setSelectedTreeData] = useState(null)

    const [selectedGroup, setSelectedGroup] = useState(null)
    const [groups, setGroups] = useState([])

    const config = {
        excelExport: true,
        excelFileName: `${studentCode}-${t('student.book_title')}-${t('skill.name')}`,
        defaultSort: [{
            dataField: 'firstName',
            order: 'asc'
        }]
    }

    const columns = [
        {
            dataField: "createdDate",
            text: t('date'),
            sort: true,
        },
        {
            dataField: "subjectName",
            text: t('course_lesson'),
            sort: true,
        },
        {
            dataField: 'templateName',
            text: t('skill.assessmentTemplate'),
            sort: true,
            formatter: (cell, row) => <span onClick={() => handleCellClick(row?.id)} className='underline' >{cell || ''}</span>
        },
        {
            dataField: 'teacherName',
            text: t('teacher_title'),
            sort: true,
        },
    ]

    const loadData = (season = null, group = null) => {
        setLoading(true)
        // fetchRequest(studentBookSkills, 'POST', { id, season, group })
        //     .then(res => {
        //         if (res.success) {
        //             const { seasons, selectedTreeId, skills, groups } = res.data
        //             setTableData(skills || [])
        //             setGroups(groups || [])
        //             setTreeData(seasons || [])
        //             setSelectedTreeData(selectedTreeId || null)
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
        setSkillId(id)
        setShowSkillModal(true)
    }

    const closeModal = () => {
        setSkillId(null)
        setShowSkillModal(false)
    }

    const handleTreeChange = key => {
        setSelectedTreeData(key)
        // loadData(key, selectedGroup)
    }

    const onSubjectChange = (value) => {
        setSelectedGroup(value)
        // loadData(selectedTreeData, value)
    }

    return (
        <>
            <Row>
                <Col md={3} className='col-form-label text-right' style={{ marginTop: -60 }}>
                    <div className='m-portlet__body border-orange br-08 ' style={{ borderWidth: 4, textAlign: 'left' }}>
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
                    <div style={{ width: 300, marginLeft: 40, marginBottom: 20, display: 'flex', alignItems: "center" }}>
                        <div className={'pinnacle-bold'} style={{ marginRight: 20 }} >{t('subject.title')}</div>
                        <Dropdown
                            fluid
                            selection
                            clearable
                            value={selectedGroup}
                            options={groups.map(subjectObj => {
                                return {
                                    value: subjectObj?.id,
                                    text: subjectObj?.name
                                }
                            })}
                            placeholder={'-' + t('select') + '-'}
                            onChange={(e, data) => onSubjectChange(data?.value)}
                        />
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
            {
                loading &&
                <>
                    <div className='blockUI blockOverlay' />
                    <div className='blockUI blockMsg blockPage'>
                        <div className='m-loader m-loader--brand m-loader--lg' />
                    </div>
                </>
            }
            {showSkillModal &&
                <SkillModal
                    onClose={closeModal}
                    studentId={id}
                    skill={skillId}
                />
            }
        </>
    )
}

export default skill