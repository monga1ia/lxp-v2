import { Link } from 'react-router-dom'
import AddIcon from '@mui/icons-material/Add';
import React, { useEffect, useRef, useState } from 'react'
import message from 'modules/message'
import { Modal } from 'react-bootstrap'
import _ from 'lodash';
import { toast } from "react-toastify";
import { NDropdown as Dropdown } from 'widgets/Dropdown'
import secureLocalStorage from 'react-secure-storage';
import { useTranslation } from "react-i18next";
import styled from 'styled-components';
import Forms from 'modules/Form/Forms'
import { useSelector } from 'react-redux';
import { fetchRequest } from 'utils/fetchRequest';
import { schoolClassCreate } from 'utils/fetchRequest/Urls';

const locale = secureLocalStorage?.getItem('selectedLang') || 'mn'

const AddClassModal = ({ onClose, onSubmit, data }) => {
    const { t } = useTranslation();
    const { selectedSchool } = useSelector(state => state.schoolData);
    const formRef = useRef();

    const [loading, setLoading] = useState(false)

    const [teacherList, setTeacherList] = useState([])
    const [curriculums, setCurriculums] = useState([])
    const [schoolShifts, setSchoolShifts] = useState([])
    const [scoreTypeList, setScoreTypeList] = useState([])
    const [gradeList, setGradeList] = useState([])
    const [roomList, setRoomList] = useState([])
    const [addClassData, setAddClassData] = useState(['Add class information'])
    const [addAgain, setAddAgain] = useState(false)

    const classFields = (grades = [], teachers = [], schoolShifts = [], scoreTypes = [], rooms = [], curriculums = []) => {
        if (selectedSchool?.isOnlineSchool) {
            return [
                {
                    key: 'grade',
                    labelBold: true,
                    value: '',
                    type: 'nDropdown',
                    search: true,
                    label: t('className') + '*',
                    required: true,
                    errorMessage: t('error.selectClass'),
                    className: "form-control",
                    upperCase: true,
                    formContainerClassName: 'form-group m-form__group row grid-item',
                    fieldContainerClassName: 'col-6',
                    labelClassName: "col-4 text-right label-pinnacle-bold mr-0",
                    options: grades,
                },
                {
                    key: 'className',
                    labelBold: true,
                    value: '',
                    type: 'text',
                    label: t('group.title') + '*',
                    required: true,
                    errorMessage: t('error.selectGrade'),
                    className: "form-control",
                    upperCase: true,
                    formContainerClassName: 'form-group m-form__group row grid-item',
                    fieldContainerClassName: 'col-6',
                    labelClassName: "col-4 text-right label-pinnacle-bold mr-0",
                    options: grades,
                },
                {
                    key: 'curriculum',
                    labelBold: true,
                    value: '',
                    type: 'nDropdown',
                    label: t('group.curriculum') + '*',
                    className: "form-control",
                    required: true,
                    upperCase: true,
                    formContainerClassName: 'form-group m-form__group row grid-item',
                    fieldContainerClassName: 'col-6',
                    labelClassName: "col-4 text-right label-pinnacle-bold mr-0",
                    options: curriculums,
                    clearable: true,
                },
                {
                    key: 'shift',
                    labelBold: true,
                    value: '',
                    type: 'nDropdown',
                    search: true,
                    label: t('group.school_shift') + '*',
                    required: true,
                    errorMessage: t('error.selectShift'),
                    className: "form-control",
                    upperCase: true,
                    formContainerClassName: 'form-group m-form__group row grid-item',
                    fieldContainerClassName: 'col-6',
                    labelClassName: "col-4 text-right label-pinnacle-bold mr-0",
                    options: schoolShifts,
                }
            ]
        } else {
            return [
                {
                    key: 'grade',
                    labelBold: true,
                    value: '',
                    type: 'nDropdown',
                    search: true,
                    label: t('className') + '*',
                    required: true,
                    errorMessage: t('error.selectClass'),
                    className: "form-control",
                    upperCase: true,
                    formContainerClassName: 'form-group m-form__group row grid-item',
                    fieldContainerClassName: 'col-6',
                    labelClassName: "col-4 text-right label-pinnacle-bold mr-0",
                    options: grades,
                },
                {
                    key: 'className',
                    labelBold: true,
                    value: '',
                    type: 'text',
                    label: t('group.title') + '*',
                    required: true,
                    errorMessage: t('error.selectGrade'),
                    className: "form-control",
                    upperCase: true,
                    formContainerClassName: 'form-group m-form__group row grid-item',
                    fieldContainerClassName: 'col-6',
                    labelClassName: "col-4 text-right label-pinnacle-bold mr-0",
                    options: grades,
                },
                {
                    key: 'teacher',
                    labelBold: true,
                    value: '',
                    type: 'nDropdown',
                    label: t('group.class_teacher') + '*',
                    className: "form-control",
                    required: true,
                    upperCase: true,
                    formContainerClassName: 'form-group m-form__group row grid-item',
                    fieldContainerClassName: 'col-6',
                    labelClassName: "col-4 text-right label-pinnacle-bold mr-0",
                    options: teachers,
                    clearable: true,
                },
                {
                    key: 'shift',
                    labelBold: true,
                    value: '',
                    type: 'nDropdown',
                    search: true,
                    label: t('group.school_shift') + '*',
                    required: true,
                    errorMessage: t('error.selectShift'),
                    className: "form-control",
                    upperCase: true,
                    formContainerClassName: 'form-group m-form__group row grid-item',
                    fieldContainerClassName: 'col-6',
                    labelClassName: "col-4 text-right label-pinnacle-bold mr-0",
                    options: schoolShifts,
                },
                {
                    key: 'scoreType',
                    labelBold: true,
                    value: '',
                    type: 'nDropdown',
                    label: t('group.score_type') + '*',
                    required: true,
                    errorMessage: t('error.selectEvaluationType'),
                    className: "form-control",
                    upperCase: true,
                    formContainerClassName: 'form-group m-form__group row grid-item',
                    fieldContainerClassName: 'col-6',
                    labelClassName: "col-4 text-right label-pinnacle-bold mr-0",
                    options: scoreTypes,
                },
                {
                    key: 'room',
                    labelBold: true,
                    value: '',
                    type: 'nDropdown',
                    label: t('group.classroom'),
                    className: "form-control",
                    upperCase: true,
                    formContainerClassName: 'form-group m-form__group row grid-item',
                    fieldContainerClassName: 'col-6',
                    labelClassName: "col-4 text-right label-pinnacle-bold mr-0",
                    options: rooms,
                    clearable: true,
                },
            ]
        }
    }

    const loadData = (params = {}) => {
        setLoading(true)
        fetchRequest(schoolClassCreate, 'POST', params)
            .then((res) => {
                if (res.success) {
                    setScoreTypeList(res?.scoreTypes || [])
                    setCurriculums(res?.curriculums || [])
                    setGradeList(res?.gradeList || [])
                    setTeacherList(res?.teachers || [])
                    setSchoolShifts(res?.schoolShifts || [])
                    setRoomList(res?.rooms || [])
                    formRef?.current?.updateFields && formRef.current?.updateFields(classFields(res?.gradeList, res?.teachers, res?.schoolShifts, res?.scoreTypes, res?.rooms, res?.curriculums));
                } else {
                    message(res.data.message)
                }
                setLoading(false)
            })
            .catch((e) => {
                console.log('e', e)
                message(t('err.error_occurred'))
                setLoading(false)
            })
    }

    useEffect(() => {
        loadData({
            school: selectedSchool?.id
        })
    }, [])

    const handleCheckbox = () => {
        setAddAgain(true)
    }

    const handleSubmit = () => {
        const [formsValid, formValues] = formRef.current.validate();

        if (formsValid) {
            setLoading(true)
            let params = {
                addAgain: addAgain,
                submit: 1,
                school: selectedSchool?.id
            }
            formValues?.map(obj => {
                params[obj?.key] = obj?.value;
            })

            setLoading(true)
            fetchRequest(schoolClassCreate, 'POST', params)
                .then((res) => {
                    if (res.success) {
                        message(res.message, true)
                        if (addAgain) {
                            formRef?.current?.updateFields && formRef.current?.updateFields(classFields(gradeList, teacherList, schoolShifts, scoreTypeList, roomList, curriculums));
                        } else {
                            onClose(true)
                        }
                    } else {
                        message(res.message)
                    }
                    setLoading(false)
                })
                .catch(() => {
                    message(t('err.error_occurred'))
                    setLoading(false)
                })
        } else {
            message(t('err.fill_all_fields'))
        }
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
                    {t('class.add')}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="row">
                    <div className="col">
                        <div className="form-group m-form__group row mb-0">
                            <Forms
                                ref={formRef}
                                fields={classFields(gradeList, teacherList, schoolShifts, scoreTypeList, roomList, curriculums)}
                            />
                        </div>
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer className="text-center">
                <div className='align-center align-items-center' style={{ marginLeft: '17px', position: 'absolute', left: '1.5rem', bottom: '1.5rem' }}>
                    <label className="form-check-label font-mulish" htmlFor="reAdd" style={{ color: '#575962', fontSize: '14px', fontWeight: '400' }}>
                        <input
                            className="form-check-input modal-position form-modal-check mt-0"
                            id='reAdd'
                            type="checkbox"
                            style={{ borderRadius: '4px', fontSize: '18px' }}
                            value={addAgain}
                            onChange={handleCheckbox}
                        />&nbsp;&nbsp;{t('action.recreate')}
                    </label>
                </div>
                <button
                    onClick={() => onClose()}
                    className="btn m-btn--pill btn-link m-btn m-btn--custom"
                >
                    {t('back')}
                </button>
                <button
                    onClick={handleSubmit}
                    className="btn m-btn--pill btn-success text-uppercase"
                >
                    {t('save')}
                </button>
            </Modal.Footer>
            {
                loading
                &&
                <div className="blockUI blockOverlay" >
                    <div className="blockUI blockMsg blockPage">
                        <div className="m-loader m-loader--brand m-loader--lg" />
                    </div>
                </div>
            }
        </Modal>
    )
}

export default AddClassModal