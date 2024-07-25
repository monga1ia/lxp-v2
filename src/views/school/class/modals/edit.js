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
import { schoolClassEdit } from 'utils/fetchRequest/Urls';

const locale = secureLocalStorage?.getItem('selectedLang') || 'mn'

const EditClassModal = ({ onClose, onSubmit, classId }) => {
    const { t } = useTranslation();
    const { selectedSchool } = useSelector(state => state.schoolData);
    const formRef = useRef();

    const [loading, setLoading] = useState(false)

    const [classObj, setClassObj] = useState({})
    const [teacherList, setTeacherList] = useState([])
    const [curriculumList, setCurriculumList] = useState([])
    const [schoolShifts, setSchoolShifts] = useState([])
    const [scoreTypeList, setScoreTypeList] = useState([])
    const [gradeList, setGradeList] = useState([])
    const [roomList, setRoomList] = useState([])

    const classFields = (grades = [], teachers = [], schoolShifts = [], scoreTypes = [], rooms = [], curriculums = [], classObj = {}) => {
        if (selectedSchool?.isOnlineSchool) {
            console.log('>>>', curriculums)
            return [
                {
                    key: 'grade',
                    labelBold: true,
                    value: classObj?.grade,
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
                    value: classObj?.name || '',
                    type: 'text',
                    label: t('group.title') + '*',
                    required: true,
                    errorMessage: t('error.selectGrade'),
                    className: "form-control",
                    upperCase: true,
                    formContainerClassName: 'form-group m-form__group row grid-item',
                    fieldContainerClassName: 'col-6',
                    labelClassName: "col-4 text-right label-pinnacle-bold mr-0",
                    options: []
                },
                {
                    key: 'curriculum',
                    labelBold: true,
                    value: classObj?.curriculum,
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
                    value: classObj?.shift,
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
                    value: classObj?.grade,
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
                    value: classObj?.name || '',
                    type: 'text',
                    label: t('group.title') + '*',
                    required: true,
                    errorMessage: t('error.selectGrade'),
                    className: "form-control",
                    upperCase: true,
                    formContainerClassName: 'form-group m-form__group row grid-item',
                    fieldContainerClassName: 'col-6',
                    labelClassName: "col-4 text-right label-pinnacle-bold mr-0",
                    options: []
                },
                {
                    key: 'teacher',
                    labelBold: true,
                    value: classObj?.teacher,
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
                    value: classObj?.shift,
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
                    value: classObj?.scoreType,
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
                    value: classObj?.room,
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
        fetchRequest(schoolClassEdit, 'POST', params)
            .then((res) => {
                if (res.success) {
                    setScoreTypeList(res?.scoreTypes || [])
                    setCurriculumList(res?.curriculums || [])
                    setGradeList(res?.gradeList || [])
                    setTeacherList(res?.teachers || [])
                    setSchoolShifts(res?.schoolShifts || [])
                    setRoomList(res?.rooms || [])
                    setClassObj(res?.classData || {})
                    formRef?.current?.updateFields && formRef.current?.updateFields(classFields(res?.gradeList, res?.teachers, res?.schoolShifts, res?.scoreTypes, res?.rooms, res?.curriculums, res?.classData));
                } else {
                    message(res.data.message)
                }
                setLoading(false)
            })
            .catch((e) => {
                message(t('err.error_occurred'))
                setLoading(false)
            })
    }

    useEffect(() => {
        loadData({
            school: selectedSchool?.id,
            class: classId
        })
    }, [])


    const handleSubmit = () => {
        const [formsValid, formValues] = formRef.current.validate();

        if (formsValid) {
            setLoading(true)
            let params = {
                class: classId,
                submit: 1,
                school: selectedSchool?.id
            }
            formValues?.map(obj => {
                params[obj?.key] = obj?.value;
            })

            setLoading(true)
            fetchRequest(schoolClassEdit, 'POST', params)
                .then((res) => {
                    if (res.success) {
                        message(res.message, true)
                        onClose(true)
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
            onHide={onClose}
            // className='react-modal overflow-modal'
            centered
        >
            <Modal.Header closeButton style={{ padding: '1rem' }}>
                <Modal.Title className="modal-title d-flex flex-row justify-content-between w-100">
                    {t('action.edit')}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="row">
                    <div className="col">
                        <div className="form-group m-form__group row mb-0">
                            <Forms
                                ref={formRef}
                                fields={classFields(gradeList, teacherList, schoolShifts, scoreTypeList, roomList, curriculumList, classObj)}
                            />
                        </div>
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer className="text-center">
                <button
                    onClick={onClose}
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
                    ?
                    <div className="blockUI blockOverlay" >
                        <div className="blockUI blockMsg blockPage">
                            <div className="m-loader m-loader--brand m-loader--lg" />
                        </div>
                    </div>
                    :
                    null
            }
        </Modal>
    )
}

export default EditClassModal