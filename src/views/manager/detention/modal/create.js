import message from 'modules/message'
import {Col, Row} from 'react-bootstrap'
import { Modal } from 'react-bootstrap'
import React, {useState, useEffect} from 'react'
import SearchIcon from '@mui/icons-material/Search'
import secureLocalStorage from 'react-secure-storage'
import {fetchRequest} from 'utils/fetchRequest'
import {translations} from 'utils/translations'
import {NDropdown as Dropdown} from 'widgets/Dropdown'
// import {managerDetentionStudentSearch, managerDetentionStudentSubmit} from 'utils/url'
import {IconButton} from "@mui/material";
import { useTranslation } from 'react-i18next'

const create = ({classes = [], types = [], onClose, onSubmit}) => {

    const locale = secureLocalStorage?.getItem('selectedLang') || 'mn'
    const { t } = useTranslation()
    const [loading, setLoading] = useState(false)

    const [studentCodeQuery, setStudentCodeQuery] = useState('')

    const [selectedType, setSelectedType] = useState(null)
    const [description, setDescription] = useState('')

    const [classRows, setClassRows] = useState([
        {
            selectedClass: null,
            selectedStudents: [],
            students: []
        }
    ])

    const [classOptions] = useState(classes)

    const [updateView, setUpdateView] = useState(false)


    // backend, original


    // const search = (query = null, classId = null, rowIndex = null) => {
    //     console.log('search')
    //     setLoading(true)
    //     fetchRequest(managerDetentionStudentSearch, 'POST', {
    //         code: query,
    //         class: classId
    //     })
    //         .then((res) => {
    //             if (res?.success) {
    //                 const clone = [...classRows]
    //                 if (classId) {
    //                     clone[rowIndex].students = res?.data?.students
    //                     clone[rowIndex].selectedClass = res?.data?.selectedClassId
    //                 } else if (query && query?.length > 0) {
    //                     let classRowObj = null;

    //                     let noClassRowIndex = null;
    //                     for (let c = 0; c < clone?.length; c++) {
    //                         if (clone[c]?.selectedClass) {
    //                             if (clone[c].selectedClass === res?.data?.selectedClassId) {
    //                                 classRowObj = clone[c];
    //                                 break;
    //                             }
    //                         } else {
    //                             noClassRowIndex = c;
    //                         }
    //                     }

    //                     if (noClassRowIndex !== null) {
    //                         if (classRowObj) {
    //                             const studentSelected = classRowObj?.selectedStudents.find(obj => obj === res?.data?.selectedStudent?.id);
    //                             if (studentSelected) {
    //                                 // nothing to do..
    //                                 // because student is already selected
    //                             } else {
    //                                 classRowObj.selectedStudents.push(res?.data?.selectedStudent?.id)
    //                             }
    //                         } else {
    //                             clone[noClassRowIndex].selectedClass = res?.data?.selectedClassId;
    //                             clone[noClassRowIndex].selectedStudents = [res?.data?.selectedStudent?.id];
    //                             clone[noClassRowIndex].students = res?.data?.students;
    //                         }
    //                     } else {
    //                         if (classRowObj) {
    //                             // check if student is already selected
    //                             const studentSelected = classRowObj?.selectedStudents.find(obj => obj === res?.data?.selectedStudent?.id);
    //                             if (studentSelected) {
    //                                 // nothing to do..
    //                                 // because student is already selected
    //                             } else {
    //                                 classRowObj.selectedStudents.push(res?.data?.selectedStudent?.id)
    //                             }
    //                         } else {
    //                             clone.push({
    //                                 selectedClass: res?.data?.selectedClassId,
    //                                 selectedStudents: [res?.data?.selectedStudent?.id],
    //                                 students: res?.data?.students
    //                             })
    //                         }
    //                     }
    //                 }
    //                 setClassRows(clone)
    //             } else {
    //                 message(res?.data?.message || translations(locale)?.err?.error_occurred)
    //             }
    //             setLoading(false)
    //         })
    //         .catch(() => {
    //             message(translations(locale)?.err?.error_occurred)
    //             setLoading(false)
    //         })
    // } 


    //frontend testing data
    const search = (query = null, classId = null, rowIndex = null) => {
        console.log('search frontend testing data')

        const res = {
            "data": {
                "students": [
                    {
                        "value": "230504",
                        "text": "001 tser (Test)",
                        "code": "001",
                        "studentId": "242039",
                        "firstName": "tser",
                        "lastName": "Test"
                    }
                ],
                "selectedClassId": "11593",
                "selectedStudent": null,
                "message": "Амжилттай"
            },
            "success": true
        }
        const clone = [...classRows]
        if (classId) {
            clone[rowIndex].students = res?.data?.students
            clone[rowIndex].selectedClass = res?.data?.selectedClassId
        } else if (query && query?.length > 0) {
            let classRowObj = null;

            let noClassRowIndex = null;
            for (let c = 0; c < clone?.length; c++) {
                if (clone[c]?.selectedClass) {
                    if (clone[c].selectedClass === res?.data?.selectedClassId) {
                        classRowObj = clone[c];
                        break;
                    }
                } else {
                    noClassRowIndex = c;
                }
            }

            if (noClassRowIndex !== null) {
                if (classRowObj) {
                    const studentSelected = classRowObj?.selectedStudents.find(obj => obj === res?.data?.selectedStudent?.id);
                    if (studentSelected) {
                        // nothing to do..
                        // because student is already selected
                    } else {
                        classRowObj.selectedStudents.push(res?.data?.selectedStudent?.id)
                    }
                } else {
                    clone[noClassRowIndex].selectedClass = res?.data?.selectedClassId;
                    clone[noClassRowIndex].selectedStudents = [res?.data?.selectedStudent?.id];
                    clone[noClassRowIndex].students = res?.data?.students;
                }
            } else {
                if (classRowObj) {
                    // check if student is already selected
                    const studentSelected = classRowObj?.selectedStudents.find(obj => obj === res?.data?.selectedStudent?.id);
                    if (studentSelected) {
                        // nothing to do..
                        // because student is already selected
                    } else {
                        classRowObj.selectedStudents.push(res?.data?.selectedStudent?.id)
                    }
                } else {
                    clone.push({
                        selectedClass: res?.data?.selectedClassId,
                        selectedStudents: [res?.data?.selectedStudent?.id],
                        students: res?.data?.students
                    })
                }
            }
        }
        setClassRows(clone)
    }

    useEffect(() => {

    }, [])

    const submitSearch = () => {
        search(studentCodeQuery)
    }

    const onStudentCodeChange = (value) => {
        setStudentCodeQuery(value)
    }

    const onClassChange = (rowIndex, classId) => {
        const clone = [...classRows]
        clone[rowIndex].selectedClass = classId;
        clone[rowIndex].selectedStudents = [];
        clone[rowIndex].students = [];

        if (classId) {
            search(null, classId, rowIndex)
        }

        setClassRows(clone)
        setUpdateView(!updateView)
    }

    const onTypeChange = (typeId) => {
        const type = types.find(obj => obj?.id === typeId)
        setSelectedType(type)
    }

    const onStudentChange = (rowIndex, studentIds) => {
        const clone = [...classRows]
        clone[rowIndex].selectedStudents = studentIds;
        setClassRows(clone)
        setUpdateView(!updateView)
    }

    const filterClasses = (classList = [], nonCheckId = null) => {
        const filtered = []
        for (let c = 0; c < classList?.length; c++) {
            let classSelected = false;
            if (classRows && classRows?.length > 0) {
                for (let cr = 0; cr < classRows?.length; cr++) {
                    if (classRows[cr].selectedClass
                        && classList[c]?.id !== nonCheckId
                        && classRows[cr].selectedClass === classList[c]?.id) {
                        classSelected = true;
                        break;
                    }
                }
            }
            if (!classSelected) {
                filtered.push(classList[c])
            }
        }
        return filtered;
    }

    const addRow = () => {
        const clone = [...classRows]
        clone.push({
            selectedClass: null,
            selectedStudents: [],
            students: []
        })
        setClassRows(clone)

        setUpdateView(!updateView)
    }

    const removeRow = (index) => {
        const clone = [...classRows]
        clone.splice(index, 1)
        setClassRows(clone)
        setUpdateView(!updateView)
    }

    const isStudentSelected = () => {
        const clone = [...classRows]
        let selected = false;
        for (let c = 0; c < clone?.length; c++) {
            if (clone[c].selectedStudents?.length > 0) {
                selected = true;
                break;
            }
        }
        return selected;
    }

    const hasEmptyClass = () => {
        let emptyClass = false;
        for (let c = 0; c < classRows?.length; c++) {
            if (!classRows[c].selectedClass) {
                emptyClass =true;
                break;
            }
        }
        return emptyClass;
    }

    return (
        <Modal
            dimmer='blurring'
            show={true}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            onHide={() => onClose()}
            centered
        >
            <Modal.Header closeButton style={{ padding: '1rem' }}>
                <Modal.Title className="modal-title d-flex flex-row justify-content-between w-100">
                    {t('manager.detention')}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Row className='form-group'>
                    <Col md={6}>
                        <Row>
                            <Col md={6} className='col-form-label text-md-right label-pinnacle-bold'>
                                {translations(locale)?.studentCode}
                            </Col>
                            <Col md={6} className={'d-flex'} style={{padding: 0}}>
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
                                <IconButton className='icon-set-custom-size' color={'primary'} onClick={submitSearch}>
                                    <SearchIcon/>
                                </IconButton>
                            </Col>
                        </Row>
                    </Col>
                    <Col md={6}>
                    </Col>
                </Row>
                {
                    classRows?.map((classRowObj, cIndex) => {
                        return <Row className='form-group' key={'row_' + cIndex}>
                            <Col xxl="6" xl="6">
                                <Row>
                                    <Col  xxl="6" xl="6" className='col-form-label text-md-right label-pinnacle-bold'>
                                        {
                                            cIndex === 0 && (translations(locale)?.class?.title + '*')
                                        }
                                    </Col>
                                    <Col  xxl="5" xl="5" style={{padding: 0}}>
                                        <Dropdown
                                            fluid
                                            search
                                            selection
                                            closeOnChange
                                            options={filterClasses(classOptions, classRowObj?.selectedClass)?.map(classObj => {
                                                return {
                                                    value: classObj?.value,
                                                    text: classObj?.text
                                                }
                                            })}
                                            value={classRowObj?.selectedClass}
                                            placeholder={'-' + translations(locale)?.select + '-'}
                                            onChange={(e, data) => onClassChange(cIndex, data?.value)}
                                        />
                                    </Col>
                                </Row>
                            </Col>
                            <Col xxl="5" xl="5">
                                <Row>
                                    <Col md={8}>
                                        <Dropdown
                                            fluid
                                            search
                                            selection
                                            closeOnChange
                                            multiple={true}
                                            options={classRowObj?.students?.map(obj => {
                                                return {
                                                    value: obj.value,
                                                    text: obj?.text
                                                }
                                            })}
                                            value={classRowObj?.selectedStudents}
                                            placeholder={'-' + translations(locale)?.select + '-'}
                                            onChange={(e, data) => onStudentChange(cIndex, data?.value)}
                                        />
                                    </Col>
                                    <Col md={4}>
                                        {
                                            cIndex === 0
                                                ?
                                                <button
                                                    className='btn btn-sm btn-outline-info m-btn m-btn--icon m-btn--icon-only m-btn--pill d-inline-flex align-items-center justify-content-center'
                                                    onClick={() => {
                                                        if (!hasEmptyClass()) {
                                                            addRow()
                                                        } else {
                                                            message(translations(locale)?.err?.select_class)
                                                        }
                                                    }}
                                                >
                                                    <i className="flaticon2-plus"/>
                                                </button>
                                                :
                                                <button
                                                    className='btn btn-sm btn-danger m-btn m-btn--icon m-btn--icon-only m-btn--pill'
                                                    onClick={() => removeRow(cIndex)}
                                                >
                                                    <i className="flaticon2-delete"/>
                                                </button>
                                        }
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    })
                }

                {
                    isStudentSelected() && <>
                        <Row className='form-group mt-4'>
                            <Col md={5} className='col-form-label text-md-right label-pinnacle-bold'>
                                {translations(locale)?.school_settings?.detention_type}*
                            </Col>
                            <Col md={4} style={{padding: 0}}>
                                <Row>
                                    <Col md={12}>
                                        <Dropdown
                                            fluid
                                            search
                                            selection
                                            closeOnChange
                                            options={types.map(typeObj => {
                                                return {
                                                    value: typeObj?.id,
                                                    text: typeObj?.title
                                                }
                                            })}
                                            value={selectedType?.id}
                                            placeholder={'-' + translations(locale)?.select + '-'}
                                            onChange={(e, data) => onTypeChange(data?.value)}
                                        />
                                    </Col>
                                </Row>
                                {
                                    selectedType && selectedType?.description &&
                                    <p className={'mt-2 mb-0'}>{selectedType?.description}</p>
                                }
                            </Col>
                        </Row>
                        <Row className='form-group'>
                            <Col md={5} className='col-form-label text-md-right label-pinnacle-bold'>
                                {translations(locale)?.school_settings?.detention_description}
                            </Col>
                            <Col md={4} style={{padding: 0}}>
                        <textarea
                            placeholder={translations(locale).insert_description || ''}
                            className="form-control"
                            value={description}
                            onChange={(e) => setDescription(e?.target?.value)}
                            style={{
                                minHeight: 100
                            }}
                        />
                            </Col>
                        </Row>
                    </>
                }
            </Modal.Body>
            <Modal.Footer className="text-center">
                <div className='text-center w-100'>
                    <button
                        className="btn m-btn--pill btn-link m-btn m-btn--custom"
                        onClick={onClose}
                    >
                        {translations(locale)?.back}
                    </button>
                    <button
                        className="btn m-btn--pill btn-success m-btn--wide"
                        onClick={() => {
                            if (isStudentSelected()) {
                                if (selectedType) {
                                    onSubmit(classRows, selectedType, description)
                                } else {
                                    message(translations(locale)?.err?.select_detention)
                                }
                            } else {
                                message(translations(locale)?.err?.select_student)
                            }
                        }}
                    >
                        {translations(locale)?.save}
                    </button>
                </div>
            </Modal.Footer>
            {
                loading &&
                <>
                    <div className="blockUI blockOverlay"/>
                    <div className="blockUI blockMsg blockPage">
                        <div className="m-loader m-loader--brand m-loader--lg"/>
                    </div>
                </>
            }
        </Modal>
    )
}

export default create