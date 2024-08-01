import React, {useEffect, useState, useRef} from 'react'
import {NDropdown as Dropdown} from "widgets/Dropdown";
import DTable from 'modules/DataTable/DTable';
import {translations} from 'utils/translations'
import HtmlHead from 'components/html-head/HtmlHead';
import BreadcrumbList from 'components/breadcrumb-list/BreadcrumbList';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/AddRounded';
import CheckIcon from '@mui/icons-material/Check';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import secureLocalStorage from 'react-secure-storage';
import {fetchRequest} from 'utils/fetchRequest'
// import {teacherYearResultIndex, teacherYearResultList, teacherYearResultSeasonNoteSubmit, teacherYearResultSeasonNoteDownload, teacherYearResultDelete} from 'Utilities/url';
import DeleteModal from 'utils/deleteModal'
import message from 'modules/message'
import {Col, Row} from "react-bootstrap";
import {cloneDeep} from "lodash";
import { useTranslation } from 'react-i18next';
import StudentModal from './pages/modal/studentModal';
import YearModal from './pages/modal/yearModal';
import JournalModal from './pages/modal/journalModal';

const TeacherYear = () => {

    const { t } = useTranslation()

    const title = t('busDashboard.today');
    // busDashboard.today
    const description = "E-learning";
    const breadcrumbs = [
        { to: "", text: "Home" },
        { to: "teacher/year", text: title }
    ];

    const locale = secureLocalStorage?.getItem('selectedLang') || 'mn'
    const [loading, setLoading] = useState(false)
    const [studentModal, setStudentModal] = useState(false);
    const [yearModal, setYearModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const [yearTypes, setYearTypes] = useState([])
    const [group, setGroup] = useState(null);
    const [exams, setExams] = useState(null);
    const [lists, setLists] = useState([]);
    const [yearOptions, setYearOptions] = useState([]);
    const [selectedYearId, setSelectedYearId] = useState(null);
    const [selectedTableId, setSelectedTableId] = useState(null);

    // const [showJournalPDF, setShowJournalPDF] = useState(false)
    const [showJournalPDF, setShowJournalPDF] = useState(true)
    const [journalPdfNote, setJournalPdfNote] = useState(null)
    const [ableToDownloadJournalPDF, setAbleToDownloadJournalPDF] = useState(false)
    const [journalHasDownloaded, setJournalHasDownloaded] = useState(false)
    const [showJournalNoteModal, setShowJournalNoteModal] = useState(false)

    const init = () => {
        console.log('init')
        // setLoading(true)
        // fetchRequest(teacherYearResultIndex, 'POST', {})
        //     .then((res) => {
        //         if (res.success) {
        //             const {seasons = [], selectedSeason = null, groups = []} = res.data
        //             setYearTypes(res?.data?.yearTypes)
        //             setShowJournalPDF(res?.data?.showJournalPdf)
        //             setJournalPdfNote(res?.data?.journalPDFNote || null)
        //             setAbleToDownloadJournalPDF(res?.data?.ableToDownloadJournalPdf || false)
        //             setJournalHasDownloaded(res?.data?.journalPdfDownloadCount > 0)
        //             setYearOptions(seasons.map(seasonObj => {
        //                 return {
        //                     value: seasonObj?.id,
        //                     text: seasonObj?.name
        //                 }
        //             }));
        //             setSelectedYearId(selectedSeason)

        //             setLists(groups)

        //         } else {
        //             message(res.data.message)
        //         }
        //         setLoading(false)
        //     })
        //     .catch(() => {
        //         message(translations(locale)?.err?.error_occurred)
        //         setLoading(false)
        //     })
    }

    useEffect(() => {
        init()
    }, [])

    const onYearChange = (yearId) => {
        setSelectedYearId(yearId)
    }

    const _handlerClassClick = () => {
        // setLoading(true)
        // fetchRequest(schoolClassInit, 'POST', {})
        //     .then((res) => {
        //         if (res.success) {
        //             const { group } = res.data
        //
        //             setGroup(
        //                 {
        //                     subjectName: 'Монгол хэл',
        //                     groupName: 'Бүлгийн нэр',
        //                     classes: ['1A', '2B'],
        //                     students: [
        //                         {
        //                             id: 12,
        //                             avatar: null,
        //                             className: '1A',
        //                             studentCode: '1A',
        //                             firstName: '1A',
        //                             lastName: '1A',
        //                         },
        //                         {
        //                             id: 12,
        //                             avatar: null,
        //                             className: '1A',
        //                             studentCode: '1A',
        //                             firstName: '1A',
        //                             lastName: '1A',
        //                         }
        //                     ]
        //                 }
        //             )
        //
        //             setStudentModal(true)
        //         } else {
        //             message(res.data.message)
        //         }
        //         setLoading(false)
        //     })
        //     .catch(() => {
        //         message(translations(locale)?.err?.error_occurred)
        //         setLoading(false)
        //     })
    }

    const _handlerIsCreateClick = (groupId, yearTypeId = null) => {
        console.log('_handlerIsCreateClick')
        // setLoading(true)
        // fetchRequest(teacherYearResultList, 'POST', {group: groupId, season: selectedYearId, yearType: yearTypeId})
        //     .then((res) => {
        //         if (res.success) {
        //             const {exams} = res.data
        //             setExams(exams)
        //             setYearModal(true)
        //         } else {
        //             message(res.data.message)
        //         }
        //         setLoading(false)
        //     })
        //     .catch(() => {
        //         message(translations(locale)?.err?.error_occurred)
        //         setLoading(false)
        //     })
    }

    const handleDelete = () => {
        console.log('handleDelete')
        // setLoading(true)
        // fetchRequest(teacherYearResultDelete, 'POST', {exam: selectedTableId, season: selectedYearId})
        //     .then((res) => {
        //         if (res.success) {
        //             const {groups} = res.data
        //             setLists(groups)

        //             setYearModal(false)
        //             setSelectedTableId(null)
        //             setShowDeleteModal(false)

        //             message(res.data.message, res.success)
        //         } else {
        //             message(res.data.message)
        //         }
        //         setLoading(false)
        //     })
        //     .catch(() => {
        //         message(translations(locale)?.err?.error_occurred)
        //         setLoading(false)
        //     })
    }

    const handleDeleteButtonClick = id => {
        setSelectedTableId(id)
        setShowDeleteModal(true)
    }

    const closeStudentModal = () => {
        setStudentModal(false);
        setGroup(null);
    }

    const closeJournalNoteModal = () => {
        setShowJournalNoteModal(false)
    }

    const closeYearModal = () => {
        setYearModal(false);
        setExams([]);
    }

    const closeModal = () => {
        setSelectedTableId(null)
        setShowDeleteModal(false)
    }

    const onJournalPdfNoteChange = (e, data) => {
        setJournalPdfNote(data?.value)
    }

    const seasonNoteSubmit = () => {
        console.log('seasonNoteSubmit')
        // setLoading(true)
        // fetchRequest(teacherYearResultSeasonNoteSubmit, 'POST', {
        //     content: journalPdfNote
        // })
        //     .then((res) => {
        //         if (res.success) {
        //             setJournalPdfNote(res?.data?.journalPDFNote || null)
        //             setAbleToDownloadJournalPDF(res?.data?.ableToDownloadJournalPdf || false)
        //             setShowJournalNoteModal(false)
        //         } else {
        //             message(res.data.message)
        //         }
        //         setLoading(false)
        //     })
        //     .catch(() => {
        //         message(translations(locale)?.err?.error_occurred)
        //         setLoading(false)
        //     })
    }

    const downloadJournalPDF = (code) => {
        console.log('downloadJournalPDF')
        // setLoading(true)
        // fetchRequest(teacherYearResultSeasonNoteDownload, 'POST', {
        //     typeCode: code
        // })
        //     .then((res) => {
        //         if (res.success) {
        //             if (res?.data?.hasNextType) {
        //                 const types = res?.data?.types;
        //                 let nextTypeObj = null;
        //                 for (let t = 0; t < types.length; t++) {
        //                     if (types[t]?.code === res?.data?.selectedTypeCode) {
        //                         nextTypeObj = typeof types[t+1] !== 'undefined' ? types[t+1] : null;
        //                         break;
        //                     }
        //                 }
        //                 if (nextTypeObj) {
        //                     downloadJournalPDF(nextTypeObj?.code)
        //                 } else {
        //                     setLoading(false)
        //                     window.open('/api/year-result/season-note-download', '_blank')
        //                 }
        //             } else {
        //                 setLoading(false)
        //                 window.open('/api/year-result/season-note-download', '_blank')
        //             }
        //         } else {
        //             setLoading(false)
        //             message(res.data.message)
        //         }
        //     })
        //     .catch(() => {
        //         message(translations(locale)?.err?.error_occurred)
        //         setLoading(false)
        //     })
    }

    return (
        <div className="m-grid__item m-grid__item--fluid m-wrapper">
            <HtmlHead title={title} description={description} />

            <div className="page-title-container mb-2">
                <Col md="7" className='p-0'>
                    <h1 className="mb-0 pb-0 display-4 relative">{title}</h1>
                    <BreadcrumbList items={breadcrumbs} />
                </Col>
            </div>
            <div className="d-flex align-items-center justify-content-start ml-2">
                <div className="col-auto p-0 text-center pl-1">
                    <Dropdown
                        simple
                        options={yearOptions}
                        value={selectedYearId}
                        onChange={(e, data) => init(data?.value)}
                        className='no-wrap pinnacle-bold fs-12 color-brand mb-3'
                    />
                </div>
            </div>
            <div className="m-content">

                {
                    showJournalPDF && <div className='m-portlet' style={{marginBottom: '1.5rem'}}>
                        <div className='m-portlet__body'>
                            <div className='row'>
                                <div className='col-md-3'>
                                    <div className='row'>
                                        <div className="col text-uppercase bolder pl-4"
                                             style={{color: '#696e92', fontSize: 12}}></div>
                                    </div>
                                    <div className='row py-4'>
                                        <div className="col">
                                            <span>&nbsp;</span>
                                            <span className='d-block bolder'>{translations(locale)?.teacherToday?.downloadJournal}</span>
                                            <span>&nbsp;</span>
                                        </div>
                                    </div>
                                </div>
                                <div className='col-md-1'/>
                                <div className='col-md-8'>
                                    <Row className='d-flex gap-05 h-100'>
                                        <Col
                                            className='border-grey br-08 d-flex flex-column justify-content-center align-items-center'>
                                            <p className="text-uppercase bolder" style={{
                                                color: '#696e92',
                                                fontSize: 12
                                            }}>{translations(locale)?.teacherToday?.journalNote}</p>
                                            <div style={{
                                                display: 'grid',
                                                gap: 5,
                                                gridTemplateColumns: 'max-content max-content',
                                                justifyContent: 'center'
                                            }}>
                                                {
                                                    journalPdfNote && journalPdfNote?.length > 0
                                                    ?
                                                        <button
                                                            type='button'
                                                            onClick={() => {
                                                                setShowJournalNoteModal(true)
                                                            }}
                                                            className={`btn teacher-today-btn-success m-btn m-btn--icon btn-sm m-btn--icon-only m-btn--pill d-inline-flex align-items-center justify-content-center`}>
                                                            <CheckIcon/>
                                                        </button>
                                                        :
                                                        <button
                                                            type='button'
                                                            onClick={() => {
                                                                setShowJournalNoteModal(true)
                                                            }}
                                                            className={`btn btn-info m-btn m-btn--icon btn-sm m-btn--icon-only m-btn--pill d-inline-flex align-items-center justify-content-center`}>
                                                            <AddIcon/>
                                                        </button>
                                                }
                                            </div>
                                        </Col>
                                        <Col
                                            className='border-grey br-08 d-flex flex-column justify-content-center align-items-center'>
                                            <p className="text-uppercase bolder" style={{
                                                color: '#696e92',
                                                fontSize: 12
                                            }}>{translations(locale)?.teacherToday?.downloadJournal}</p>
                                            <div style={{
                                                display: 'grid',
                                                gap: 5,
                                                gridTemplateColumns: 'max-content max-content',
                                                justifyContent: 'center'
                                            }}>
                                                <button
                                                    type='button'
                                                    onClick={() => {
                                                        if (ableToDownloadJournalPDF) {
                                                            if (journalHasDownloaded) {
                                                                window.open('/api/year-result/season-note-download', '_blank')
                                                            } else {
                                                                downloadJournalPDF()
                                                            }
                                                        } else {
                                                            message(translations(locale)?.teacherToday?.unableToDownloadJournalPDF)
                                                        }
                                                    }}
                                                    className={`btn ${ableToDownloadJournalPDF ? 'btn-primary' : 'teacher-today-btn-grey'} m-btn m-btn--icon btn-sm m-btn--icon-only m-btn--pill d-inline-flex align-items-center justify-content-center`}>
                                                    <FileDownloadOutlinedIcon/>
                                                </button>
                                            </div>
                                        </Col>
                                    </Row>
                                </div>
                            </div>
                        </div>
                    </div>
                }
                {
                    lists.length > 0
                        ?
                        lists.map((list, key) =>
                            <div key={key}>
                                <div key={key} className='m-portlet' style={{marginBottom: '0.5rem'}}>
                                    <div className='m-portlet__body'>
                                        <div className='row'>
                                            <div className='col-md-3'>
                                                <div className='row'>
                                                    <div className="col text-uppercase bolder pl-4"
                                                         style={{color: '#696e92', fontSize: 12}}></div>
                                                </div>
                                                <div className='row py-4'>
                                                    <div className="col">
                                                        <span>{list.subjectName}</span>
                                                        <span className='d-block bolder'>{list.groupName}</span>
                                                        <span onClick={() => _handlerClassClick(list.groupId)}
                                                              className='underline'>
                                                        {
                                                            list.classList && list.classList.length > 0 && list.classList.map((x, i) =>
                                                                list.classList.length - 1 != i ? x?.className + ', ' : x?.className
                                                            )
                                                        }
                                                    </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='col-md-1'/>
                                            <div className='col-md-8'>
                                                <Row className='d-flex gap-05 h-100'>
                                                    {
                                                        yearTypes && yearTypes?.length > 0 && yearTypes?.map(yearTypeObj => {
                                                            let groupYearTypeObj = null;
                                                            if (list.yearTypeExams && list.yearTypeExams?.length > 0) {
                                                                for (let y = 0; y < list?.yearTypeExams?.length; y++) {
                                                                    const obj = list?.yearTypeExams[y];
                                                                    if (obj?.yearType === yearTypeObj?.id) {
                                                                        groupYearTypeObj = obj;
                                                                        break;
                                                                    }
                                                                }
                                                            }
                                                            return <Col key={'year_type_' + yearTypeObj?.id}
                                                                        className='border-grey br-08 d-flex flex-column justify-content-center align-items-center'>
                                                                <p className="text-uppercase bolder" style={{
                                                                    color: '#696e92',
                                                                    fontSize: 12
                                                                }}>{yearTypeObj?.name}</p>
                                                                <div style={{
                                                                    display: 'grid',
                                                                    gap: 5,
                                                                    gridTemplateColumns: 'max-content max-content',
                                                                    justifyContent: 'center'
                                                                }}>
                                                                    {
                                                                        groupYearTypeObj && groupYearTypeObj?.isCreated === 1
                                                                            ?
                                                                            <button
                                                                                key={key}
                                                                                type='button'
                                                                                onClick={() => _handlerIsCreateClick(list.id, yearTypeObj?.id)}
                                                                                className={`btn teacher-today-btn-success m-btn m-btn--icon btn-sm m-btn--icon-only m-btn--pill d-inline-flex align-items-center justify-content-center`}>
                                                                                <CheckIcon/>
                                                                            </button>
                                                                            :
                                                                            groupYearTypeObj && groupYearTypeObj?.isCreated === 0
                                                                                ?
                                                                                <button
                                                                                    key={key}
                                                                                    type='button'
                                                                                    onClick={() => _handlerIsCreateClick(list.id, yearTypeObj?.id)}
                                                                                    className={`btn teacher-today-btn-grey m-btn m-btn--icon btn-sm m-btn--icon-only m-btn--pill d-inline-flex align-items-center justify-content-center`}>
                                                                                    <EditIcon/>
                                                                                </button>
                                                                                :
                                                                                <button
                                                                                    key={key}
                                                                                    type='button'
                                                                                    disabled={journalHasDownloaded}
                                                                                    // onClick={() => navigate('/teacher/year/create', {
                                                                                    //     state: {
                                                                                    //         id: list?.id,
                                                                                    //         season: selectedYearId,
                                                                                    //         yearType: yearTypeObj?.id,
                                                                                    //         urlData: {backUrl: '/teacher/year'},
                                                                                    //     }
                                                                                    // })}
                                                                                    className={`btn btn-info m-btn m-btn--icon btn-sm m-btn--icon-only m-btn--pill d-inline-flex align-items-center justify-content-center`}>
                                                                                    <AddIcon/>
                                                                                </button>
                                                                    }

                                                                </div>
                                                            </Col>
                                                        })
                                                    }
                                                    <Col
                                                        className='border-grey br-08 d-flex flex-column justify-content-center align-items-center'>
                                                        <p className="text-uppercase bolder" style={{
                                                            color: '#696e92',
                                                            fontSize: 12
                                                        }}>{translations(locale)?.evaluation_final?.name}</p>
                                                        <div style={{
                                                            display: 'grid',
                                                            gap: 5,
                                                            gridTemplateColumns: 'max-content max-content',
                                                            justifyContent: 'center'
                                                        }}>
                                                            {
                                                                list.isCreated === 1
                                                                    ?
                                                                    <button
                                                                        key={key}
                                                                        type='button'
                                                                        onClick={() => _handlerIsCreateClick(list.id)}
                                                                        className={`btn teacher-today-btn-success m-btn m-btn--icon btn-sm m-btn--icon-only m-btn--pill d-inline-flex align-items-center justify-content-center`}>
                                                                        <CheckIcon/>
                                                                    </button>
                                                                    :
                                                                    list.isCreated === 0
                                                                        ?
                                                                        <button
                                                                            key={key}
                                                                            type='button'
                                                                            onClick={() => _handlerIsCreateClick(list.id)}
                                                                            className={`btn teacher-today-btn-grey m-btn m-btn--icon btn-sm m-btn--icon-only m-btn--pill d-inline-flex align-items-center justify-content-center`}>
                                                                            <EditIcon/>
                                                                        </button>
                                                                        :
                                                                        <button
                                                                            key={key}
                                                                            type='button'
                                                                            disabled={journalHasDownloaded}
                                                                            // onClick={() => navigate('/teacher/year/create', {
                                                                            //     state: {
                                                                            //         id: list?.id,
                                                                            //         season: selectedYearId,
                                                                            //         urlData: {backUrl: '/teacher/year'},
                                                                            //     }
                                                                            // })}
                                                                            className={`btn btn-info m-btn m-btn--icon btn-sm m-btn--icon-only m-btn--pill d-inline-flex align-items-center justify-content-center`}>
                                                                            <AddIcon/>
                                                                        </button>
                                                            }

                                                        </div>
                                                    </Col>
                                                </Row>

                                                {/*<div className='row h-100' style={{gap: 4}}>*/}
                                                {/*    <div className='col border br-08 text-center p-4'*/}
                                                {/*         style={{borderColor: '#dfe2ea', width: 100}}>*/}
                                                {/*        */}
                                                {/*    </div>*/}
                                                {/*</div>*/}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) :
                        <div className='m-portlet'>
                            <div className='m-portlet__body text-center'>
                                <span>Танд бүртгэлтэй ангийн мэдээлэл байхгүй байна</span>
                                {/* <span>{translations(locale).timetable?.empty_timetable}</span> */}
                            </div>
                        </div>
                }
            </div>
            {
                group &&
                <StudentModal
                    show={studentModal}
                    onClose={closeStudentModal}
                    group={group}
                />
            }
            {
                exams &&
                <YearModal
                    show={yearModal}
                    onClose={closeYearModal}
                    data={exams}
                />
            }
            {
                <JournalModal
                    show={showJournalNoteModal}
                    onClose={closeJournalNoteModal}
                    onChange={onJournalPdfNoteChange}
                    onSubmit={seasonNoteSubmit}
                    value={journalPdfNote}
                />
            }
            {
                showDeleteModal && selectedTableId &&
                <DeleteModal
                    onClose={closeModal}
                    onDelete={handleDelete}
                    locale={locale}
                    title={translations(locale)?.delete}
                >
                    {translations(locale)?.delete_confirmation}
                    <br/>
                    <br/>
                    {translations(locale)?.delete_confirmation_description}
                </DeleteModal>
            }
            {
                loading &&
                <>
                    <div className='blockUI blockOverlay'/>
                    <div className='blockUI blockMsg blockPage'>
                        <div className='m-loader m-loader--brand m-loader--lg'/>
                    </div>
                </>
            }
        </div>
    )
}

export default TeacherYear