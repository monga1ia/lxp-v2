import message from 'modules/message'
import {Col, Row} from 'react-bootstrap'
import CloseIcon from '@mui/icons-material/Close'
import secureLocalStorage from 'react-secure-storage'
import {translations} from 'utils/translations'
import {NDropdown as Dropdown} from 'widgets/Dropdown'
import React, {useState, useEffect, useRef} from 'react'
import {Checkbox, Modal, Radio} from 'semantic-ui-react'
import Form from 'react-bootstrap/Form'
import {hexToRgb} from "utils/Util";

const addAssessment = ({onClose, onSubmit, students, onStudentChange, templateDetails, studentId}) => {
    const locale = secureLocalStorage?.getItem('selectedLang') || 'mn'
    const [studentList, setStudentList] = useState([]);
    const [inputRefs, setInputRefs] = useState([])

    const [questions, setQuestions] = useState([])
    const [selectedStudent, setSelectedStudent] = useState(null)
    const [selectedStudentObj, setSelectedStudentObj] = useState({})

    const updateInputRefs = (list = []) => {
        const refs = []
        list?.forEach((el, index) => {
            refs.push({
                index: index,
                ref: React.createRef()
            })
        })
        setInputRefs(refs)
    }

    useEffect(() => {
        setSelectedStudent(studentId)
        handleDropDownChange(studentId)
    }, [studentId])

    useEffect(() => {
        setStudentList(students.map(studentObj => {
            return {
                value: studentObj?.id,
                text: studentObj?.firstName + ' (' + studentObj?.code + ' ' + studentObj?.lastName + ")"
            }
        }));
    }, [students])

    useEffect(() => {
        setQuestions(templateDetails)
        updateInputRefs(templateDetails);
    }, [templateDetails])

    const validateFields = () => {
        if (!selectedStudent)
            return message(translations(locale)?.err?.fill_all_fields)

        let hasError = false;
        for (let q = 0; q < questions.length; q++) {
            const question = questions[q];
            if (question?.optionTypeCode === 'RADIO'
                || question?.optionTypeCode === 'CHECKBOX') {
                const hasCheckedOption = question?.options.find(el => {
                    return el?.checked === true
                })
                if (!hasCheckedOption) {
                    hasError = true;
                    break;
                }
            } else {
                if (!question?.value) {
                    hasError = true;
                    break;
                }
            }
        }

        if (hasError) {
            return message(translations(locale)?.err?.fill_all_fields)
        } else {
            return true;
        }
    }

    const handleSubmit = () => {
        if (validateFields()) {
            onSubmit({
                student: selectedStudent,
                details: JSON.stringify(questions),
                submit: 1
            })
            setSelectedStudent(null);

        }
    }

    const handleDropDownChange = studentId => {
        const selectedObj = students.find(st => {
            return st?.id === studentId
        });

        const clone = [...questions];

        for (let q = 0; q < clone.length; q++) {
            if (selectedObj?.templateDetails && selectedObj?.templateDetails.length > 0) {
                const cloneDtl = selectedObj?.templateDetails.find(obj => {
                    return obj?.id === clone[q]?.id
                })
                if (cloneDtl) {
                    if (cloneDtl.options && cloneDtl.options.length > 0) {
                        let cloneOptions = clone[q].options;
                        for (let co = 0; co < cloneOptions.length; co++) {
                            let selectedOp = cloneDtl.options.find(obj => {
                                return obj?.optionId === cloneOptions[co]?.id
                            })
                            if (selectedOp) {
                                cloneOptions[co].checked = true;
                            }
                        }
                        clone[q].options = cloneOptions;
                    } else {
                        clone[q].value = cloneDtl?.description;
                    }
                }
            } else {
                let cloneOptions = clone[q].options;
                for (let co = 0; co < cloneOptions.length; co++) {
                    cloneOptions[co].checked = false;
                }
                clone[q].options = cloneOptions;
                clone[q].value = '';
            }
        }

        setQuestions(clone);
        setSelectedStudentObj(selectedObj)
        setSelectedStudent(studentId)
    }

    const onRadioChange = (index, id) => {
        const clone = [...questions]
        const cloneOptions = clone[index]?.options

        for (let o = 0; o < cloneOptions.length; o++) {
            let option = cloneOptions[o];
            option.checked = option?.id === id
        }
        setQuestions(clone);
    }

    const onCheckBoxChange = (index, id) => {
        const clone = [...questions]
        const cloneOptions = clone[index]?.options

        for (let o = 0; o < cloneOptions.length; o++) {
            let option = cloneOptions[o];
            if (option?.id === id) {
                option.checked = !option?.checked;
            }
        }
        setQuestions(clone);
    }

    const onInputChange = (index, value) => {
        const clone = [...questions]
        clone[index].value = value;
        setQuestions(clone);
    }

    const existingOption = (detail, option) => {
        if (selectedStudentObj && selectedStudentObj?.templateDetails && selectedStudentObj?.templateDetails.length > 0) {
            let checked = false;
            const selectedDetail = selectedStudentObj?.templateDetails.find(dtlObj => {
                return dtlObj?.id === detail?.id;
            });
            if (selectedDetail && selectedDetail?.options && selectedDetail?.options.length > 0) {
                for (let o = 0; o < selectedDetail.options.length; o++) {
                    if (selectedDetail.options[o]?.optionId === option?.id) {
                        checked = true;
                        break;
                    }
                }
            }
            return checked;
        } else {
            return option?.checked || false;
        }
    }

    const onKeyDown = (e, index) => {
        // 40 - down
        // 38 - up
        if (e.keyCode === 40 || e.keyCode === 38) {
            e.preventDefault();

            if (e.keyCode === 40) {
                if (index < (questions?.length - 1)) {
                    inputRefs[index+1]?.ref?.current?.focus();
                }
            } else {
                if (index > 0) {
                    inputRefs[index-1]?.ref?.current?.focus();
                }
            }
        }
    }

    const renderOptionValues = (templateDetail, index) => {
        switch (templateDetail?.optionTypeCode) {
            case 'RADIO':
                let elements = [];
                if (templateDetail?.options && templateDetail?.options.length > 0) {
                    for (let o = 0; o < templateDetail?.options?.length; o++) {
                        elements.push(
                            <Form.Check
                                key={'template_dtl_' + templateDetail?.id + '_radio_' + templateDetail?.options[o]?.id}
                                ref={inputRefs[index]?.ref}
                                // checked={existingOption(templateDetail, templateDetail?.options[o])}
                                checked={templateDetail?.options[o]?.checked || false}
                                type={'radio'}
                                onChange={() => onRadioChange(index, templateDetail?.options[o]?.id)}
                                name={'radio_' + templateDetail?.id}
                                label={templateDetail?.options[o]?.name}
                                style={{marginBottom: 10}}
                                id={`template_detail_${templateDetail?.options[o]?.id}`}
                            />
                        )
                    }
                }
                return elements;
            case 'CHECKBOX':
                let cbElements = [];
                if (templateDetail?.options && templateDetail?.options.length > 0) {
                    for (let o = 0; o < templateDetail?.options?.length > 0; o++) {
                        cbElements.push(
                            <Form.Check
                                key={'template_dtl_' + templateDetail?.id + '_checkbox_' + templateDetail?.options[o]?.id}
                                ref={inputRefs[index]?.ref}
                                // checked={existingOption(templateDetail, templateDetail?.options[o])}
                                checked={templateDetail?.options[o]?.checked || false}
                                type={'checkbox'}
                                onChange={() => onCheckBoxChange(index, templateDetail?.options[o]?.id)}
                                label={templateDetail?.options[o]?.name}
                                style={{marginBottom: 10}}
                                id={`template_detail_${templateDetail?.options[o]?.id}`}
                            />
                        )
                    }
                }
                return cbElements;
            case 'NUMBER':
                return <input
                    ref={inputRefs[index]?.ref}
                    type='number'
                    className='form-control'
                    value={templateDetail?.value}
                    onChange={(e) => onInputChange(index, e?.target?.value)}
                    onKeyDown={(e) => {
                        onKeyDown(e, index)
                    }}
                />
            default:
                return <input
                    ref={inputRefs[index]?.ref}
                    type='text'
                    className='form-control'
                    value={templateDetail?.value}
                    onChange={(e) => onInputChange(index, e?.target?.value)}
                    onKeyDown={(e) => {
                        onKeyDown(e, index)
                    }}
                />
        }
    }

    return (
        <Modal
            centered
            open={true}
            size='large'
            onClose={onClose}
            className='react-modal overflow-modal'
        >
            <div className='header'>
                {translations(locale)?.skill?.addAssessment}
                <button type='button' className='close' aria-label='Close' onClick={onClose}>
                    <CloseIcon/>
                </button>
            </div>
            <div className='content'>
                <Row className='mt-4'>
                    <Col md={2}/>
                    <Col>
                        <Row className='form-group'>
                            <Col md={4} className='col-form-label text-right label-pinnacle-bold'>
                                {translations(locale)?.student?.title}*
                            </Col>
                            <Col md={8}>
                                <Dropdown
                                    fluid
                                    search
                                    selection
                                    closeOnChange
                                    options={studentList}
                                    selectOnBlur={false}
                                    value={selectedStudent}
                                    placeholder={'-' + translations(locale)?.select + '-'}
                                    onChange={(e, data) => handleDropDownChange(data?.value)}
                                />
                            </Col>
                        </Row>
                        {
                            selectedStudent &&
                            <Row>
                                <Col md={5} className='d-flex justify-content-end align-items-center'>
                                    <img src={selectedStudentObj?.avatar || '/images/avatar.png'}
                                         alt={`photo of ${selectedStudentObj?.firstName}`}
                                         className='img-circle'
                                         width={100} height={100}
                                         onError={(e) => {
                                             e.target.onError = null
                                             e.target.src = '/images/avatar.png'
                                         }}
                                    />
                                </Col>
                                <Col>
                                    <table>
                                        <tbody>
                                        <tr>
                                            <td className='text-right pr-3'
                                                style={{color: '#868aa8'}}>{translations(locale)?.className}:
                                            </td>
                                            <td className='bolder'
                                                style={{color: '#3c3f42'}}>{selectedStudentObj?.className || '-'}</td>
                                        </tr>
                                        <tr>
                                            <td className='text-right pr-3'
                                                style={{color: '#868aa8'}}>{translations(locale)?.studentCode}:
                                            </td>
                                            <td className='bolder'
                                                style={{color: '#3c3f42'}}>{selectedStudentObj?.code || '-'}</td>
                                        </tr>
                                        <tr>
                                            <td className='text-right pr-3'
                                                style={{color: '#868aa8'}}>{translations(locale)?.studentLastName}:
                                            </td>
                                            <td className='bolder'
                                                style={{color: '#3c3f42'}}>{selectedStudentObj?.lastName || '-'}</td>
                                        </tr>
                                        <tr>
                                            <td className='text-right pr-3'
                                                style={{color: '#868aa8'}}>{translations(locale)?.studentFirstName}:
                                            </td>
                                            <td className='bolder'
                                                style={{color: '#3c3f42'}}>{selectedStudentObj?.firstName || '-'}</td>
                                        </tr>
                                        </tbody>
                                    </table>
                                </Col>
                            </Row>
                        }
                    </Col>
                    <Col md={3}/>
                </Row>
                {
                    selectedStudent &&
                    <div className='m-portlet mt-5'>
                        <div className='m-portlet__body'>
                            {
                                questions && questions.map((templateDtlObj, i) => {
                                    return <Row className='form-group' key={'template_dtl_' + templateDtlObj?.id}>
                                        <Col sm={4}
                                             className='label-pinnacle-bold col-form-label'>{templateDtlObj?.title}
                                            {/*{*/}
                                            {/*    templateDtlObj?.hasScore && <>*/}
                                            {/*        <br/>*/}
                                            {/*        <span>{templateDtlObj?.score}</span>*/}
                                            {/*    </>*/}
                                            {/*}*/}
                                        </Col>
                                        <Col>
                                            {
                                                renderOptionValues(templateDtlObj, i)
                                            }
                                        </Col>
                                    </Row>
                                })
                            }
                        </div>
                    </div>
                }
            </div>
            <div className='actions modal-footer'>
                <div className='text-center w-100'>
                    <button
                        className='btn m-btn--pill btn-outline-metal m-btn--wide mr-3'
                        onClick={onClose}
                    >
                        {translations(locale)?.close}
                    </button>
                    {
                        selectedStudent &&
                        <button
                            className='btn m-btn--pill btn-success m-btn--wide'
                            onClick={handleSubmit}
                        >
                            {translations(locale)?.save}
                        </button>
                    }
                </div>
            </div>
        </Modal>
    )
}

export default addAssessment