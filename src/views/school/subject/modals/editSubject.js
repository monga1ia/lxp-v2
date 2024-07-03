import { useState } from 'react'
import message from 'modules/message'
import { Modal } from 'react-bootstrap'
import React, { useEffect, useRef } from 'react'
import secureLocalStorage from 'react-secure-storage'
import { NDropdown as Dropdown } from 'widgets/Dropdown'
import { Checkbox } from "semantic-ui-react";
import { useTranslation } from "react-i18next";
import Forms from 'modules/Form/Forms'

const EditSubjectModal = ({onClose, onSubmit, data}) => {

    const { t } = useTranslation();
    const formRef = useRef();
    const [isAll, setIsAll] = useState(false)
    const [isResult, setIsResult] = useState(false)

    const [loading, setLoading] = useState(false)

    const [subjectOptions, setSubjectOptions] = useState([{value: "ID22", refId: "refId", gid: "2323", text: "text 1"},{value: "ID2", refId: "refId2", gid: "232", text: "text 2"},{value: "ID345", refId: "refId3", gid: "23", text: "text 3"},])
    const [subjectTypeOptions, setSubjectTypeOptions] = useState([{value: "ID22", refId: "refId", gid: "2323", text: "text 1"},{value: "ID2", refId: "refId2", gid: "232", text: "text 2"},{value: "ID345", refId: "refId3", gid: "23", text: "text 3"},])
    const [subjectLevelOptions, setSubjectLevelOption] = useState([{value: "ID22", refId: "refId", gid: "2323", text: "text 1"},{value: "ID2", refId: "refId2", gid: "232", text: "text 2"},{value: "ID345", refId: "refId3", gid: "23", text: "text 3"},])
    const [subjectTeacherOptions, setSubjectTeacherOptions] = useState([{value: "ID22", refId: "refId", gid: "2323", text: "text 1"},{value: "ID2", refId: "refId2", gid: "232", text: "text 2"},{value: "ID345", refId: "refId3", gid: "23", text: "text 3"},])

    const [gradeRows, setGradeRows] = useState([{
        grade: null,
        subjects: [],
        subjectOptions: []
    }])

    const editSubjectFields = [
        {
            key: 'subjectTitle',
            type: 'nDropdown',
            label: `${t('subject.title')}*`,
            labelBold: true,
            value: '',
            required: true,
            errorMessage: t('error.selectSubjectTitle'),
            className: "form-control",
            upperCase: true,
            formContainerClassName: 'form-group m-form__group row',
            labelClassName: "col-4 text-right label-pinnacle-bold mr-0",
            fieldContainerClassName: 'col-6',
            options: subjectOptions,
        },
        {
            key: 'subjectType',
            type: 'nDropdown',
            label: `${t('subject.type')}*`,
            className: "form-control",
            labelBold: true,
            required: true,
            value: '',
            required: true,
            errorMessage: t('error.selectSubjectType'),
            formContainerClassName: 'form-group m-form__group row',
            labelClassName: "col-4 text-right label-pinnacle-bold mr-0",
            fieldContainerClassName: 'col-6',
            options: subjectTypeOptions,
        },
        {
            key: 'subjectIndex',
            type: 'text',
            label: `${t('subject.index')}*`,
            className: "form-control",
            labelBold: true,
            required: true,
            value: '',
            required: true,
            errorMessage: t('subject.insert_index'),
            placeholder: t('subject.insert_index'),
            formContainerClassName: 'form-group m-form__group row',
            labelClassName: "col-4 text-right label-pinnacle-bold mr-0",
            fieldContainerClassName: 'col-6',
        },
        {
            key: 'subjectName',
            type: 'text',
            label: `${t('subject.name')}*`,
            className: "form-control",
            labelBold: true,
            required: true,
            value: '',
            errorMessage: t('subject.insert_name'),
            placeholder: t('subject.insert_name'),
            formContainerClassName: 'form-group m-form__group row',
            labelClassName: "col-4 text-right label-pinnacle-bold mr-0",
            fieldContainerClassName: 'col-6',
        },
        {
            key: 'subjectGrade',
            type: 'nDropdown',
            label: `${t('group.grade')}*`,
            className: "form-control",
            labelBold: true,
            required: true,
            value: '',
            errorMessage: t('group.select_grade'),
            placeholder: t('group.select_grade'),
            formContainerClassName: 'form-group m-form__group row',
            labelClassName: "col-4 text-right label-pinnacle-bold mr-0",
            fieldContainerClassName: 'col-6',
            options: subjectLevelOptions,
        },
        {
            key: 'subjectTeacher',
            type: 'nDropdown',
            label: `${t('subject.teacher')}*`,
            className: "form-control",
            labelBold: true,
            required: true,
            value: '',
            errorMessage: t('error.selectSubjectTeacher'),
            formContainerClassName: 'form-group m-form__group row',
            labelClassName: "col-4 text-right label-pinnacle-bold mr-0",
            fieldContainerClassName: 'col-6',
            options: subjectTeacherOptions,
        },
        {
            key: 'subjectCredit',
            type: 'text',
            label: `${t('subject.credit')}*`,
            className: "form-control",
            labelBold: true,
            required: true,
            value: '',
            errorMessage: t('subject.insert_credit'),
            placeholder: t('subject.insert_credit'),
            formContainerClassName: 'form-group m-form__group row',
            labelClassName: "col-4 text-right label-pinnacle-bold mr-0",
            fieldContainerClassName: 'col-6',
        },
    ]

    const handleSubmit = () => {
        const [formsValid, formValues] = formRef.current.validate();

        if (formsValid) {

            if (gradeRows.length == 1 && gradeRows?.[0]?.grade && !gradeRows?.[0]?.subjects.length) {
                return message(t('err.fill_all_fields'))
            } else if (gradeRows.length > 1 && !gradeRows.every(el => { return el.grade && el.subjects.length })){
                return message(t('err.fill_all_fields'))
            } else {
                const dataCollectorArray = []
                for (let x=0;x<formValues.length;x++) {
                    dataCollectorArray.push({key: formValues[x].key, value: formValues[x].value, options: formValues[x].options})
                }
                message('success')
    
                // after success \/
                // onClose()
                // setLoading(true)
                // console.log(dataCollectorArray)
            }
        } 
        else{
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
            <Modal.Header closeButton style={{padding: '1rem'}}>
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
                                fields={editSubjectFields}
                            />
                        </div>
                        <div className="form-group m-form__group row">
                            <label className="col-4 col-form-label text-right label-pinnacle-bold">
                            </label>
                            <div className="col-6">
                                <Checkbox
                                    checked={isAll}
                                    onChange={() => setIsAll( !isAll )}
                                    label={t('subject.isAll') || ""}
                                />
                            </div>
                        </div>
                        <div className="form-group m-form__group row">
                            <label className="col-4 col-form-label text-right label-pinnacle-bold">
                            </label>
                            <div className="col-6">
                                <Checkbox
                                    checked={isResult}
                                    onChange={() => setIsResult( !isResult )}
                                    label={t('subject.isResult') || ""}
                                />
                            </div>
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
                loading &&
                <>
                    <div className="blockUI blockOverlay" />
                    <div className="blockUI blockMsg blockPage">
                        <div className="m-loader m-loader--brand m-loader--lg" />
                    </div>
                </>
            }
        </Modal>
    )
}

export default EditSubjectModal