import {Checkbox} from 'semantic-ui-react'
import React, {useEffect, useState} from 'react'
import secureLocalStorage from 'react-secure-storage'
import { Modal } from 'react-bootstrap'
// import {fetchRequest} from 'Utilities/fetchRequest'
// import {transcriptInit, transcriptStudentSearch, transcriptSubmit} from 'Utilities/url'
import {translations} from 'utils/translations'
import {NDropdown as Dropdown} from 'widgets/Dropdown'
import {Col, Row} from 'react-bootstrap'
import SearchIcon from '@mui/icons-material/Search';
import {IconButton} from "@mui/material";
import message from 'modules/message'

const Create = ({onClose, onSubmit, active = 1, season, group, type}) => {

    const [studentCodeQuery, setStudentCodeQuery] = useState('')
    const [loading, setLoading] = useState(false)
    const [classes, setClasses] = useState([])
    const [students, setStudents] = useState([])
    const [studentList, setStudentList] = useState([])
    const [selectedClass, setSelectedClass] = useState(null)
    const [selectedStudent, setSelectedStudent] = useState(null)
    const [selectedStudentObj, setSelectedStudentObj] = useState({})
    const [studentSeasons, setStudentSeasons] = useState([])
    const [isPublished, setIsPublished] = useState(true)

    const [updateView, setUpdateView] = useState(false)

    const loadInit = (classId = null, studentId = null) => {
        console.log('loadInit')
        // setLoading(true)
        // fetchRequest(transcriptInit, 'POST', {
        //     class: classId,
        //     active,
        //     student: studentId
        // })
        //     .then((res) => {
        //         if (res?.success) {
        //             if (studentId) {
        //                 setStudentSeasons(res?.data?.seasons)
        //             } else {
        //                 if (classId) {
        //                     setStudentList(res?.data?.students)
        //                     setStudents((res?.data?.students || []).map(studentObj => {
        //                         return {
        //                             value: studentObj?.value,
        //                             text: studentObj?.text
        //                         }
        //                     }))
        //                 } else {
        //                     setClasses(res?.data?.classes || [])
        //                 }
        //             }
        //         } else {
        //             message(res?.data?.message || translations(locale)?.err?.error_occurred)
        //         }
        //         setLoading(false)
        //     })
        //     .catch(() => {
        //         message(translations(locale)?.err?.error_occurred)
        //         setLoading(false)
        //     })
    }

    const search = (query) => {
        console.log('search')
        // setLoading(true)
        // setStudentSeasons([])
        // setStudentList([])
        // setStudents([])
        // setSelectedClass(null)
        // setSelectedStudent(null)
        // fetchRequest(transcriptStudentSearch, 'POST', {
        //     code: query,
        //     active
        // })
        //     .then((res) => {
        //         if (res?.success) {
        //             setStudentSeasons(res?.data?.seasons)
        //             setSelectedClass(res?.data?.selectedClassId)
        //             setSelectedStudent(res?.data?.selectedStudent?.id)
        //             setSelectedStudentObj(res?.data?.selectedStudent)
        //             setStudentList(res?.data?.students)
        //             setStudents((res?.data?.students || []).map(studentObj => {
        //                 return {
        //                     value: studentObj?.value,
        //                     text: studentObj?.text
        //                 }
        //             }))
        //         } else {
        //             message(res?.data?.message || translations(locale)?.err?.error_occurred)
        //         }
        //         setLoading(false)
        //     })
        //     .catch(() => {
        //         message(translations(locale)?.err?.error_occurred)
        //         setLoading(false)
        //     })
    }


    useEffect(() => {
        loadInit()
    }, [])

    const onClassSelect = (value, data) => {
        setSelectedClass(data.value)
        loadInit(data?.value)
    }
    const onStudentSelect = (value, data) => {
        setSelectedStudent(data?.value)
        const selected = studentList.find(obj => {
            return obj?.value === data?.value
        })
        setSelectedStudentObj(selected)
        loadInit(null, data?.value)
    }

    const locale = secureLocalStorage?.getItem('selectedLang') || 'mn'

    const [title, setTitle] = useState(translations(locale)?.studentTranscript?.title)

    const onStudentCodeChange = (value) => {
        setStudentCodeQuery(value)
    }

    const submitSearch = () => {
        search(studentCodeQuery)
    }

    const classBuilder = (classList = []) => {
        let classNames = ''
        if (classList && classList.length > 0) {
            for (let c = 0; c < classList.length; c++) {
                classNames += classList[c]?.name + (c < (classList.length - 1) ? ', ' : '');
            }
        }
        return classNames;
    }

    const onSeasonChange = (seasonId = null, isChecked = false) => {
        const seasons = studentSeasons;
        for (let s = 0; s < seasons.length; s++) {
            if (seasons[s]?.id === seasonId) {
                seasons[s].checked = isChecked;
                break;
            }
        }
        setStudentSeasons(seasons)

        setUpdateView(!updateView)
    }

    const print = () => {
        if (studentSeasons && studentSeasons.length > 0) {
            const seasonIds = []
            for (let s = 0; s < studentSeasons.length; s++) {
                if (studentSeasons[s].checked) {
                    seasonIds.push(studentSeasons[s].id);
                }
            }
            onSubmit({
                student: selectedStudent,
                seasons: seasonIds,
                published: isPublished ? 1 : 0
            })
        } else {
            message(translations(locale)?.season_score?.select_season)
        }
    }

    return (
        <Modal
            dimmer='blurring'
            show={true}
            size="xl"
            aria-labelledby="contained-modal-title-vcenter"
            onHide={() => onClose()}
            centered
        >
            <Modal.Header closeButton style={{ padding: '1rem' }}>
                <Modal.Title className="modal-title d-flex flex-row justify-content-between w-100">
                    {title}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className='mb-4'>
                    <Row className='form-group'>
                        <Col md={4} className='col-form-label text-right label-pinnacle-bold'>
                            {translations(locale)?.studentCode}
                        </Col>
                        <Col md={4}>
                            <Row style={{margin: 0}}>
                                <Col className={'d-flex'} style={{padding: 0}}>
                                    <div className='col-form-field-container'>
                                        <input type='text'
                                            className='form-control'
                                            value={studentCodeQuery}
                                            placeholder={translations(locale)?.studentCode}
                                            onChange={(e) => onStudentCodeChange(e?.target?.value)}
                                            onKeyDown={(event) => {
                                                var code = event.keyCode || event.which;
                                                if (code === 13) {
                                                    submitSearch()
                                                }

                                            }}
                                        />
                                    </div>
                                    <IconButton className='icon-set-custom-size' style={{width: '43.5px'}} color={'#5562C9'} onClick={submitSearch}>
                                        <SearchIcon/>
                                    </IconButton>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    {
                        active === 1 && <Row className='form-group'>
                            <Col md={4} className='col-form-label text-right label-pinnacle-bold'>
                                {translations(locale)?.class?.title}
                            </Col>
                            <Col md={3}>
                                <Dropdown
                                    placeholder={'-' + translations(locale).select + '-' || ""}
                                    fluid
                                    selection
                                    search={true}
                                    additionPosition='bottom'
                                    upward={false}
                                    selectOnBlur={false}
                                    value={selectedClass}
                                    options={classes}
                                    onChange={onClassSelect}
                                />
                            </Col>
                            <Col md={3}>
                                <Dropdown
                                    placeholder={'-' + translations(locale).select + '-' || ""}
                                    fluid
                                    selection
                                    search={true}
                                    additionPosition='bottom'
                                    upward={false}
                                    selectOnBlur={false}
                                    value={selectedStudent}
                                    options={students}
                                    onChange={onStudentSelect}
                                />
                            </Col>
                        </Row>
                    }
                    <Row className='form-group'>
                        <Col md={4} className='col-form-label text-right label-pinnacle-bold'>
                        </Col>
                        <Col md={8}>
                            <Checkbox
                                className='mt-2'
                                label={translations(locale)?.studentTranscript?.publishedLabel}
                                checked={isPublished}
                                onChange={(e, data) => {
                                    setIsPublished(data?.checked)
                                }}
                            />
                        </Col>
                    </Row>
                    <Row className='form-group'>
                        <Col md={4}>
                        </Col>
                        <Col md={5}>
                            <Row>
                                <Col md={5} className='col-form-label text-right label-pinnacle-bold'>
                                    {translations(locale)?.studentCode}
                                </Col>
                                <Col md={7} className='col-form-label label-pinnacle-bold'>
                                    <span style={{color: '#ff5b1d'}}>{selectedStudentObj?.code || '-'}</span>
                                </Col>
                            </Row>
                            <Row>
                                <Col md={5} className='col-form-label text-right label-pinnacle-bold'>
                                    {translations(locale)?.studentLastName}
                                </Col>
                                <Col md={7} className='col-form-label label-pinnacle-bold'>
                                    {
                                        selectedStudentObj?.lastName || '-'
                                    }
                                </Col>
                            </Row>
                            <Row>
                                <Col md={5} className='col-form-label text-right label-pinnacle-bold'>
                                    {translations(locale)?.studentFirstName}
                                </Col>
                                <Col md={7} className='col-form-label label-pinnacle-bold' style={{color: '#ff5b1d'}}>
                                    {
                                        selectedStudentObj?.firstName || '-'
                                    }
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    <Row className='form-group'>
                        <Col md={5} className={'text-right label-pinnacle-bold'}>
                            {translations(locale)?.studentTranscript?.seasons}
                        </Col>
                    </Row>

                    {
                        studentSeasons && studentSeasons?.length > 0 && <Row className={'form-group'}>
                            <Col md={4}>

                            </Col>
                            <Col md={4}>
                                {
                                    studentSeasons.map(seasonObj => {
                                        return <Row className='form-group' key={'season_' + seasonObj?.id}>
                                            <Col>
                                                <Checkbox
                                                    className='mt-2'
                                                    label={seasonObj?.name + ' ' + classBuilder(seasonObj?.classes)}
                                                    checked={seasonObj?.checked || false}
                                                    onChange={(e, data) => {
                                                        onSeasonChange(seasonObj?.id, data?.checked)
                                                    }}
                                                />
                                            </Col>
                                        </Row>
                                    })
                                }
                            </Col>
                        </Row>
                    }
                </div>
            </Modal.Body>
            <Modal.Footer className="text-center">
                <button
                    onClick={onClose}
                    className='btn m-btn--pill btn-link m-btn m-btn--custom'
                    style={{backgroundColor: 'transparent'}}
                >
                    {translations(locale)?.back}
                </button>
                <button
                    onClick={() => print()}
                    className='btn m-btn--pill btn-success'
                >
                    {translations(locale)?.print}
                </button>
            </Modal.Footer>
            {
                loading &&
                <>
                    <div className='blockUI blockOverlay'/>
                    <div className='blockUI blockMsg blockPage'>
                        <div className='m-loader m-loader--brand m-loader--lg'/>
                    </div>
                </>
            }
        </Modal>
    )
}

export default Create