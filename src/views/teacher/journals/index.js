import { useState } from 'react'
import message from 'modules/message'
import ExamModal from './modal/exam'
// import SubHeader from 'Src/SubHeader'
import SkillModal from './modal/skill'
import GroupModal from './modal/group'
import React, { useEffect } from 'react'
// import { useNavigate } from 'react-router'
// import { teacherJournalInit } from 'utils/fetchRequest/Urls'
import SeasonResultModal from './modal/seasonResult'
import secureLocalStorage from 'react-secure-storage'
import { Col, Container, Row } from 'react-bootstrap'
// import { fetchRequest } from 'utils/fetchRequest'
import { translations } from 'utils/translations'
import { NDropdown as Dropdown } from 'widgets/Dropdown'
import AddRoundedIcon from '@mui/icons-material/AddRounded'
import HtmlHead from 'components/html-head/HtmlHead'
import BreadcrumbList from 'components/breadcrumb-list/BreadcrumbList'
import { useTranslation } from 'react-i18next'
import NoteModal from './pages/note/noteTemp'
import AttendanceModal from './pages/attendance'
import HomeworkModal from './pages/homework'
import AddExam from './pages/exam/add'

const locale = secureLocalStorage?.getItem('selectedLang') || 'mn'

const styles = {
    textGrey: {
        color: '#696e92'
    },
    bgBlue: {
        backgroundColor: '#0275d8'
    },
    btn: {
        padding: 10,
        minWidth: 35,
        minHeight: 35,
        border: 'none',
        color: 'white',
        borderRadius: 6,
        cursor: 'pointer',
        whiteSpace: 'nowrap',
        margin: '1.5rem 0rem',
        fontFamily: 'MulishBold',
    }
}

const index = () => {
    // const navigate = useNavigate()

    const { t } = useTranslation()

    const title = t('teacher.journal');
    const description = "E-learning";
    const breadcrumbs = [
        { to: "", text: "Home" },
        { to: "teacher/journal", text: title }
    ];

    const [loading, setLoading] = useState(false)

    const [hideSkill, setHideSkill] = useState(false)

    const [groups, setGroups] = useState([])
    const [examTypes, setExamTypes] = useState([])
    const [seasonOptions, setSeasonOptions] = useState([])
    const [selectedSeason, setSelectedSeason] = useState(null)

    const [selectedGroup, setSelectedGroup] = useState({})
    const [showExamModal, setShowExamModal] = useState(false)
    const [showSkillModal, setShowSkillModal] = useState(false)
    const [showGroupModal, setShowGroupModal] = useState(false)
    const [showSeasonResultModal, setShowSeasonResultModal] = useState(false)

    const [rerender, setRerender] = useState(false)

    useEffect(() => init(), [rerender])

    // const init = season => {
    //     console.log('innit')
    //     setLoading(true)
    //     fetchRequest(teacherJournalInit, 'POST', { season })
    //         .then((res) => {
    //             if (res.success) {
    //                 const { seasons, groups, examTypes, selectedSeason: season, hideSkill = false } = res.data
    //                 setHideSkill(hideSkill)
    //                 setGroups(groups || [])
    //                 setExamTypes(examTypes || [])
    //                 setSeasonOptions(seasons || [])
    //                 setSelectedSeason(season || null)
    //             } else {
    //                 message(res.data.message)
    //             }
    //             setLoading(false)
    //         })
    //         .catch(() => {
    //             message(translations(locale)?.err?.error_occurred)
    //             setLoading(false)
    //         })
    // }

    const init = () => {
        const res = {
            data: {
                hideSkill: false,
                pdfExported: false,
                groups: [
                    {
                        id: "129579",
                        name: "Physics | 1А",
                        subjectId: "38086",
                        subjectName: "Physics",
                        subjectCode: "PHY0101",
                        className: "1А",
                        gradeName: "1-р анги",
                        teacherId: "14205",
                        teacherCode: "0000",
                        teacherFirstname: "Erdenejargal",
                        teacherLastname: "Narantuya",
                        totalSkillPublishedCount: '92',
                        totalSkillCount: '923',
                        seasons: [
                            {
                                id: "520",
                                curriculumHour: 8,
                                timetableCount: 0,
                                attendanceCount: 0,
                                journalCount: 0
                            }
                        ],
                        '961': {
                                id: '520',
                                publish: 32,
                                total: 32,
                            },
                        final: {
                            id: '123',
                            publish: 324,
                            total: 3232,
                        }
                    }
                ],
                seasons: [
                    {
                        value: "608",
                        text: "1-р улирал",
                        start: "2023-09-01",
                        end: "2023-11-03"
                    },
                    {
                        value: "1154",
                        text: "3-р улирал",
                        start: "2024-02-01",
                        end: "2024-04-01"
                    },
                    {
                        value: "1162",
                        text: "2-р улирал",
                        start: "2023-11-13",
                        end: "2023-12-29"
                    },
                    {
                        value: "1358",
                        text: "4-р улирал",
                        start: "2024-04-08",
                        end: "2024-08-03"
                    }
                ],
                examTypes: [
                    {
                        id: "961",
                        name: "Явцын шалгалт",
                        publish: '4123',
                        total: '4123',
                        type: 
                            {
                                id: 123,
                                publish: '41',
                                total: '41'
                            },
                    },
                ],
                selectedSeason: "1358",
                message: "Амжилттай"
            },
            success: true
        }
        const { seasons, groups, examTypes, selectedSeason: season, hideSkill = false } = res.data
        setHideSkill(hideSkill)
        setGroups(groups || [])
        setExamTypes(examTypes || [])
        setSeasonOptions(seasons || [])
        setSelectedSeason(season || null)
    }

    const openModal = (name, info) => {
        if (!name && !info?.id)
            return
        setSelectedGroup(info)
        if (name == 'exam')
            setShowExamModal(true)
        else if (name == 'group')
            setShowGroupModal(true)
        else if (name == 'seasonResult')
            setShowSeasonResultModal(true)
        else if (name == 'skill')
            setShowSkillModal(true)
    }

    const closeModal = () => {
        setSelectedGroup({})
        setShowNoteModal(false)
        setShowExamModal(false)
        setShowSkillModal(false)
        setShowGroupModal(false)
        setShowAttendanceModal(false)
        setShowSeasonResultModal(false)
        setShowHomeworkModal(false)
    }

    const [showNoteModal, setShowNoteModal] = useState(false)
    const [showAttendanceModal, setShowAttendanceModal] = useState(false)
    const [showHomeworkModal, setShowHomeworkModal] = useState(false)
    const [showCreateSkillModal, setShowCreateSkillModal] = useState(false)
    const [showCreateExamModal, setShowCreateExamModal] = useState(false)

    const [noteModalState, setNoteModalState] = useState({
        group: null,
        season: null
    })

    const [attendanceModalState, setAttendanceModalState] = useState({
        group: null,
        season: null,
    })

    const [homeworkModalState, setHomeworkModalState] = useState({
        group: null,
        season: null,
    })

    const [createSkillState, setCreateSkillState] = useState({
        group: null,
        season: null,
    })

    const [createExamState, setCreateExamState] = useState({
        group: null,
        season: null,
    })

    const noteModalHandler = (state) => {
        setNoteModalState({
            group: state?.group,
            season: selectedSeason
        })
        setShowNoteModal(true)
    }

    const attendanceModalHandler = (state) => {
        setAttendanceModalState({
            group: state?.group,
            season: selectedSeason
        })
        setShowAttendanceModal(true)
    }

    const homeworkModalHandler = (state) => {
        setHomeworkModalState({
            group: state?.group,
            season: selectedSeason
        })
        setShowHomeworkModal(true)
    }

    const createSkillHandler = (state) => {
        setCreateSkillState({
            group: state?.group,
            season: selectedSeason
        })
        setShowCreateSkillModal(true)
    }

    const createExamHandler = (state) => {
        setCreateExamState({
            group: state?.group,
            season: selectedSeason
        })
        setShowCreateExamModal(true)
    }

    return (
        <div className='m-grid__item m-grid__item--fluid m-wrapper'>
            <HtmlHead title={title} description={description} />

            <div className="page-title-container mb-2">
                <Col md="7" className='p-0'>
                    <h1 className="mb-0 pb-0 display-4 relative">{title}</h1>
                    <BreadcrumbList items={breadcrumbs} />
                </Col>
            </div>
            <div className='m-content'>
                <Dropdown
                    simple
                    value={selectedSeason}
                    options={seasonOptions}
                    onChange={(e, data) => init(data?.value)}
                    className='no-wrap pinnacle-bold fs-12 color-brand mb-3'
                />
                {
                    groups?.map((el, index) => (
                        <div className='m-portlet' key={index}>
                            <div className='m-portlet__body d-flex align-items-center justify-content-between'>
                                <div className='d-flex flex-column mr-5 fs-11' style={{ width: 300, wordBreak: 'break-word' }}>
                                    <span>{el?.subjectName || '-'}</span>
                                    <span className='bolder'>{el?.groupName || '-'}</span>
                                    <span
                                        className='underline'
                                        onClick={() => openModal('group', { id: el?.id })}
                                    >
                                        {el?.classes || '-'}
                                    </span>
                                </div>
                                <Container fluid>
                                    <Row className='d-flex'>
                                        <div className='col-12 pr-0 pl-0 mb-2'>
                                            <div>
                                                <Col className='border-grey br-08 d-flex justify-content-left align-items-center'>
                                                    <span className='bolder text-uppercase fs-09 no-wrap mr-3' style={styles.textGrey}>{translations(locale)?.teacher?.note}</span>
                                                    <button
                                                        style={{ ...styles.btn, ...styles.bgBlue }}
                                                        onClick={() => noteModalHandler({ group: el?.id, season: selectedSeason })}
                                                    >
                                                        {el?.noteCount || 0}
                                                    </button>
                                                </Col>
                                            </div>
                                        </div>
                                    </Row>
                                    <Row className='d-flex gap-05'>
                                        <Col className='border-grey br-08 d-flex flex-column justify-content-center align-items-center'>
                                            <span className='bolder text-uppercase mt-4 fs-09 no-wrap' style={styles.textGrey}>{translations(locale)?.attendance?.title}</span>
                                            <button
                                                style={{ ...styles.btn, ...styles.bgBlue }}
                                                onClick={() => attendanceModalHandler({ group: el?.id, season: selectedSeason })}
                                            >
                                                {el?.attendanceCount}
                                            </button>
                                        </Col>
                                        <Col className='border-grey br-08 d-flex flex-column justify-content-center align-items-center'>
                                            <span className='bolder text-uppercase mt-4 fs-09 no-wrap' style={styles.textGrey}>{translations(locale)?.teacher?.hw}</span>
                                            <button
                                                style={{ ...styles.btn, ...styles.bgBlue }}
                                                onClick={() => homeworkModalHandler({ group: el?.id, season: selectedSeason })}
                                            >
                                                {el?.homeworkCount}
                                            </button>
                                        </Col>
                                        {/* <Col className='border-grey br-08 d-flex flex-column justify-content-center align-items-center'>
                                            <span className='bolder text-uppercase mt-4 fs-09 no-wrap' style={styles.textGrey}>{translations(locale)?.behavior?.title}</span>
                                            <button
                                                style={{ ...styles.btn, ...styles.bgBlue }}
                                                onClick={() => navigate('/teacher/journals/behavior/edit', { state: { group: el?.id, season: selectedSeason } })}
                                            >
                                                {el?.behavior || 0}
                                            </button>
                                        </Col> */}
                                        {
                                            !hideSkill && <Col className='border-grey br-08 d-flex flex-column justify-content-center align-items-center'>
                                                <span className='bolder text-uppercase mt-4 fs-09 no-wrap' style={styles.textGrey}>{translations(locale)?.skill?.name}</span>
                                                {
                                                    el?.totalSkillPublishedCount == 0 && el?.totalSkillCount == 0
                                                        ? <button
                                                            className='btn btn-info m-btn--icon m-btn--icon-only m-btn--pill d-inline-flex align-items-center justify-content-center my-4'
                                                            // onClick={() => navigate('/teacher/journals/skill/create', { state: { group: el?.id, season: selectedSeason } })}
                                                            onClick={() => {createSkillHandler({group: el?.id, season: selectedSeason})}}
                                                        >
                                                            <AddRoundedIcon />
                                                        </button>
                                                        : <button
                                                            style={{ ...styles.btn, backgroundColor: el?.totalSkillPublishedCount == el?.totalSkillCount ? '#6dd400' : '#868aa8' }}
                                                            onClick={() => openModal('skill', { id: el?.id, season: selectedSeason })}
                                                        >
                                                            {`${el?.totalSkillPublishedCount} | ${el?.totalSkillCount}`}
                                                        </button>
                                                }
                                            </Col>
                                        }
                                        {
                                            examTypes?.map((type, key) => {
                                                const exam = el?.[type?.id]
                                                return (
                                                    <Col key={key} className='border-grey br-08 d-flex flex-column justify-content-center align-items-center'>
                                                        <span className='bolder text-uppercase mt-4 fs-09 no-wrap' style={styles.textGrey}>{type?.name}</span>
                                                        {
                                                            exam?.publish == 0 && exam?.total == 0
                                                                ? <button
                                                                    className='btn btn-info m-btn--icon m-btn--icon-only m-btn--pill d-inline-flex align-items-center justify-content-center my-4'
                                                                    onClick={() => {createExamHandler({group: el?.id, season: selectedSeason})}}
                                                                    // onClick={() => navigate('/teacher/journals/exams/create', { state: { id: el?.id, season: selectedSeason, type: type?.id } })}
                                                                >
                                                                    <AddRoundedIcon />
                                                                </button>
                                                                : <button
                                                                    style={{ ...styles.btn, backgroundColor: exam.publish == exam.total ? '#6dd400' : '#868aa8' }}
                                                                    onClick={() => openModal('exam', { id: el?.id, season: selectedSeason, type: type?.id })}
                                                                >
                                                                    {`${exam?.publish} | ${exam?.total}`}
                                                                </button>
                                                        }
                                                    </Col>
                                                )
                                            })
                                        }
                                        <Col className='border-grey br-08 d-flex flex-column justify-content-center align-items-center'>
                                            <span className='bolder text-uppercase mt-4 fs-09 no-wrap' style={styles.textGrey}>{translations(locale)?.season_score?.flow_season_score}</span>
                                            {
                                                el?.final?.publish == 0 && el?.final?.total == 0
                                                    ? <button
                                                        className='btn btn-info m-btn--icon m-btn--icon-only m-btn--pill d-inline-flex align-items-center justify-content-center my-4'
                                                        // onClick={() => navigate('/teacher/journals/season-result/create', { state: { group: el?.id, season: selectedSeason } })}
                                                    >
                                                        <AddRoundedIcon />
                                                    </button>
                                                    : <button
                                                        style={{ ...styles.btn, backgroundColor: el?.final?.publish == el?.final?.total ? '#6dd400' : '#868aa8' }}
                                                        onClick={() => openModal('seasonResult', { id: el?.id, season: selectedSeason })}
                                                    >
                                                        {`${el?.final?.publish} | ${el?.final?.total}`}
                                                    </button>
                                            }
                                        </Col>
                                    </Row>
                                </Container>
                            </div>
                        </div>
                    ))
                }
            </div>
            {
                loading &&
                <>
                    <div className='blockUI blockOverlay' />
                    <div className='blockUI blockMsg blockPage'>
                        <div className='m-loader m-loader--brand m-loader--lg' />
                    </div>
                </>
            }
            {
                showNoteModal && noteModalState?.group && noteModalState?.season &&
                <NoteModal
                    onClose={closeModal}
                    data={noteModalState}
                />
            }
            {
                showAttendanceModal && attendanceModalState?.group && attendanceModalState?.season &&
                <AttendanceModal
                    onClose={closeModal}
                    data={attendanceModalState}
                />
            }
            {
                showHomeworkModal && homeworkModalState?.group && homeworkModalState?.season &&
                <HomeworkModal
                    onClose={closeModal}
                    data={homeworkModalState}
                />
            }
            {
                showExamModal && selectedGroup?.id &&
                <ExamModal
                    onClose={closeModal}
                    group={selectedGroup}
                    rerender={() => setRerender(prev => !prev)}
                />
            }
            {
                showGroupModal && selectedGroup?.id &&
                <GroupModal
                    onClose={closeModal}
                    group={selectedGroup?.id}
                />
            }
            {
                showSeasonResultModal && selectedGroup?.id &&
                <SeasonResultModal
                    onClose={closeModal}
                    season={selectedSeason}
                    group={selectedGroup?.id}
                    rerender={() => setRerender(prev => !prev)}
                />
            }
            {
                showSkillModal && selectedGroup?.id &&
                <SkillModal
                    onClose={closeModal}
                    season={selectedSeason}
                    group={selectedGroup?.id}
                    rerender={() => setRerender(prev => !prev)}
                />
            }
            {
                createSkillState?.group && createSkillState?.season &&
                <AddSkill
                    onClose={() => setShowCreateSkillModal(false)}
                    show={showCreateSkillModal}
                    data={createSkillState}
                />
            }
            {
                createExamState?.group && createExamState?.season &&
                <AddExam
                    onClose={() => setShowCreateExamModal(false)}
                    show={showCreateExamModal}
                    data={createExamState}
                />
            }
        </div>
    )
}

export default index