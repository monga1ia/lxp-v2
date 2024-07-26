import { useState } from 'react'
import message from 'modules/message'
import { Modal } from 'react-bootstrap'
import React, { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux';
import { Checkbox } from "semantic-ui-react";
import { useTranslation } from "react-i18next";
import Forms from 'modules/Form/Forms'
import { fetchRequest } from 'utils/fetchRequest';
import { schoolSubjectEdit } from 'utils/fetchRequest/Urls';

const EditSubjectModal = ({ onClose, onSubmit, subjectId, curriculumId, curriculumName }) => {

    const { t } = useTranslation();
    const { selectedSchool } = useSelector(state => state.schoolData);
    const formRef = useRef();
    const [isAll, setIsAll] = useState(false)
    const [isResult, setIsResult] = useState(false)

    const [loading, setLoading] = useState(false)

    const [subjectObj, setSubjectObj] = useState({})
    const [subjectTypeList, setSubjectTypeList] = useState([])
    const [gradeList, setGradeList] = useState([])
    const [teacherList, setTeacherList] = useState([])

    const [gradeRows, setGradeRows] = useState([{
        grade: null,
        subjects: [],
        subjectOptions: []
    }])

    const subjectFields = (subjectObj = {}, subjectTypes = [], grades = [], teachers = []) => {
        return [
            {
                key: 'curriculum',
                type: 'text',
                label: `${t('courseName')}`,
                labelBold: true,
                value: curriculumName,
                disabled: true,
                className: "form-control",
                placeholder: '-' + t('select') + '-',
                upperCase: true,
                formContainerClassName: 'form-group m-form__group row',
                labelClassName: "col-4 text-right label-pinnacle-bold mr-0",
                fieldContainerClassName: 'col-6'
            },
            {
                key: 'index',
                type: 'text',
                label: `${t('subject.subject_index')}*`,
                className: "form-control",
                labelBold: true,
                required: true,
                value: subjectObj?.index,
                required: true,
                errorMessage: t('subject.insert_index'),
                placeholder: t('subject.insert_index'),
                formContainerClassName: 'form-group m-form__group row',
                labelClassName: "col-4 text-right label-pinnacle-bold mr-0",
                fieldContainerClassName: 'col-6',
            },
            {
                key: 'name',
                type: 'text',
                label: `${t('subject.name')}*`,
                className: "form-control",
                labelBold: true,
                required: true,
                value: subjectObj?.name,
                errorMessage: t('subject.insert_name'),
                placeholder: t('subject.insert_name'),
                formContainerClassName: 'form-group m-form__group row',
                labelClassName: "col-4 text-right label-pinnacle-bold mr-0",
                fieldContainerClassName: 'col-6',
            },
            {
                key: 'credit',
                type: 'number',
                label: `${t('subject.credit')}*`,
                className: "form-control",
                labelBold: true,
                required: true,
                value: subjectObj?.credit,
                errorMessage: t('subject.insert_credit'),
                placeholder: t('subject.insert_credit'),
                formContainerClassName: 'form-group m-form__group row',
                labelClassName: "col-4 text-right label-pinnacle-bold mr-0",
                fieldContainerClassName: 'col-6',
            },
            {
                key: 'subjectType',
                type: 'nDropdown',
                label: `${t('subject.type')}*`,
                className: "form-control",
                labelBold: true,
                required: true,
                search: true,
                value: subjectObj?.subjectTypeId,
                formContainerClassName: 'form-group m-form__group row',
                labelClassName: "col-4 text-right label-pinnacle-bold mr-0",
                fieldContainerClassName: 'col-6',
                options: subjectTypes?.map(obj => {
                    return {
                        value: obj?.id,
                        text: obj?.name
                    }
                }),
            },
            {
                key: 'grade',
                type: 'nDropdown',
                label: `${t('group.grade')}*`,
                className: "form-control",
                labelBold: true,
                search: true,
                value: subjectObj.gradeIds,
                required: true,
                multiple: true,
                placeholder: t('group.select_grade'),
                formContainerClassName: 'form-group m-form__group row',
                labelClassName: "col-4 text-right label-pinnacle-bold mr-0",
                fieldContainerClassName: 'col-6',
                options: grades
            },
            {
                key: 'teacher',
                type: 'nDropdown',
                label: `${t('subject.teacher')}`,
                className: "form-control",
                labelBold: true,
                search: true,
                multiple: true,
                value: subjectObj.teacherIds,
                formContainerClassName: 'form-group m-form__group row',
                labelClassName: "col-4 text-right label-pinnacle-bold mr-0",
                fieldContainerClassName: 'col-6',
                options: teachers,
            },
        ]
    }

    const loadData = (params = {}) => {
        setLoading(true)
        fetchRequest(schoolSubjectEdit, 'POST', params)
            .then((res) => {
                if (res.success) {
                    setSubjectObj(res?.subject)
                    setGradeList(res?.grades)
                    setSubjectTypeList(res?.subjectTypes)
                    setTeacherList(res?.teachers)

                    setIsAll(res?.subject?.isAll || false)
                    setIsResult(res?.subject?.isResult || false)

                    formRef?.current?.updateFields && formRef.current?.updateFields(subjectFields(res?.subject, res?.subjectTypes, res?.grades, res?.teachers));
                } else {
                    message(res.data.message)
                }
                setLoading(false)
            })
            .catch(() => {
                message(t('err.error_occurred'))
                setLoading(false)
            })
    }

    useEffect(() => {
        let params = {
            school: selectedSchool?.id,
            curriculum: curriculumId,
            subject: subjectId
        }
        loadData(params)
    }, [])

    const handleSubmit = () => {
        const [formsValid, formValues] = formRef.current.validate();

        if (formsValid) {
            let params = {
                school: selectedSchool?.id,
                subject: subjectId,
                submit: 1,
                isAll: isAll ? 1 : 0,
                isResult: isResult ? 1 : 0,
            }
            formValues?.map(obj => {
                params[obj?.key] = obj?.value
            })

            params.curriculum = curriculumId;

            setLoading(true)
            fetchRequest(schoolSubjectEdit, 'POST', params)
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
        }
        else {
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
            // className='react-modal overflow-modal'
            centered
        >
            <Modal.Header closeButton style={{ padding: '1rem' }}>
                <Modal.Title className="modal-title d-flex flex-row justify-content-between w-100">
                    {t('action.edit')}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="row mt-4">
                    <div className="col">
                        <div className="form-group m-form__group row mb-0">
                            <Forms
                                ref={formRef}
                                fields={subjectFields(subjectObj, subjectTypeList, gradeList, teacherList)}
                            />
                        </div>
                        <div className="form-group m-form__group row">
                            <label className="col-4 col-form-label text-right label-pinnacle-bold">
                            </label>
                            <div className="col-6">

                                <div className='align-center align-items-center d-flex' style={{ marginLeft: '17px' }}>
                                    <input
                                        className="form-check-input form-modal-check mt-0"
                                        id='subjectIsAll'
                                        type="checkbox"
                                        style={{ borderRadius: '4px', fontSize: '18px' }}
                                        value={isAll}
                                        onChange={() => setIsAll(!isAll)}
                                    />
                                    <label className="form-check-label font-mulish" htmlFor="subjectIsAll" style={{ color: '#575962', fontSize: '14px', marginLeft: '16px' }}>
                                        {t('subject.isAll')}
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div className="form-group m-form__group row">
                            <label className="col-4 col-form-label text-right label-pinnacle-bold">
                            </label>
                            <div className="col-6">
                                <div className='align-center align-items-center d-flex' style={{ marginLeft: '17px' }}>
                                    <input
                                        className="form-check-input form-modal-check mt-0"
                                        id='subjectIsResult'
                                        type="checkbox"
                                        style={{ borderRadius: '4px', fontSize: '18px' }}
                                        value={isResult}
                                        onChange={() => setIsResult(!isResult)}
                                    />
                                    <label className="form-check-label font-mulish" htmlFor="subjectIsResult" style={{ color: '#575962', fontSize: '14px', marginLeft: '16px' }}>
                                        {t('subject.isResult')}
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer className="text-center">
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
                loading &&
                <>
                    <div className="blockUI blockOverlay">
                        <div className="blockUI blockMsg blockPage">
                            <div className="m-loader m-loader--brand m-loader--lg" />
                        </div>
                    </div>
                </>
            }
        </Modal>
    )
}

export default EditSubjectModal