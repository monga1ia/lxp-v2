import React, { useState } from 'react'
import { Modal } from 'react-bootstrap'
import { useTranslation } from "react-i18next";
import { Tab, Checkbox } from 'semantic-ui-react';
import AddIcon from '@mui/icons-material/Add';
import { NDropdown as Dropdown } from 'widgets/Dropdown';
import CloseIcon from '@mui/icons-material/Close';
import { translations } from 'utils/translations';
import secureLocalStorage from "react-secure-storage";

const locale = secureLocalStorage?.getItem('selectedLang') || 'mn'

const EditModal = ({ onClose, onSubmit, modalEditGroup, data, selectedTableId }) => {
    
    console.log('selected data to edit>>>>>>>>> ' + selectedTableId)

    const { t } = useTranslation();

    const [modalTabIndex, setModalTabIndex] = useState(0)
    const [isClassSubjects, setIsClassSubjects] = useState(false)
    const [showModalError, setShowModalError] = useState(false)
    const [addAgain, setAddAgain] = useState(false)
    const [selectedGroupSubjectId, setSelectedGroupSubjectId] = useState(null)
    const [isNonClassSubjects, setIsNonClassSubjects] = useState([])
    const [selectedGroupTeacherId, setSelectedGroupTeacherId] = useState(null)
    const [selectedGroupName, setSelectedGroupName] = useState('')
    const [groupTotalStudents, setGroupTotalStudents] = useState(0)

    const [editSubjectGroup, setEditSubjectGroup] = useState(true) 



    
    //  /\
    // /  \
    //  ||
    //  ||
    //  ||
    //  хуучин код нь data request хийхдээ fetchrequest 
    // ашиглаагүй болохоор .then .catch гэх condition - уудын оронд - 
    // check out line 94, 106
    // (анхнаасаа fetchrequest import хийгээгүй байсн)





    

    const [editGroupTeacherId, setEditGroupTeacherId] = useState(null)
    const [editGroupTeachers, setEditGroupTeachers] = useState([])

    const [editGroupIsClass, setEditGroupIsClass] = useState(data?.editGroupIsClass)


    const [newSubjectGroupRow, setNewSubjectGroupRow] = useState(data?.newSubjectGroupRow || [{
        class: null,
        allStudents: [],
        group_student: []
    }])
        
    const newSubjectGroupAddRow = () => {
        setNewSubjectGroupRow([...newSubjectGroupRow, {
            class: null,
            allStudents: [],
            group_student: []
        }])
    };
    
    const newSubjectGroupRemoveRow = (index) => {
        if (index != 0) {
            const rows = [...newSubjectGroupRow]
            rows.splice(index, 1)
            let totalStudents = 0;

            for (let i = 0; i < newSubjectGroupRow.length; i++) {
                totalStudents = totalStudents + newSubjectGroupRow[i].group_student.length;
            }
            setGroupTotalStudents(totalStudents)

            setNewSubjectGroupRow(rows)
        }
    }

    const newSubjectGroupNameChange = (e) => {
        setSelectedGroupName(e.target.value)
        setShowModalError(false)
    }
    
    const _getGroupRowClasses = () => {
        let classes = [];
        const subjects = [...isNonClassSubjects];
        const selectedSubject = subjects.find(subject => subject.value == selectedGroupSubjectId);

        if (selectedSubject && selectedSubject.gradeIds) {
            const allClasses = [...classes];
            allClasses.forEach(el => {
                selectedSubject.gradeIds.indexOf(el.gradeId) > -1 && classes.push(el)
            })
        }
        return classes;
    }

    const _getGradeIsClassSubjects = () => {
        if (editSubjectGroup) {
            const isClassSubjectsClone = [...isClassSubjects];
            const { gradeId = null } = editSubjectGroup;
            if (gradeId) {
                return isClassSubjectsClone.filter(subject => subject.gradeIds.indexOf(gradeId) > -1);
            }
            return [];
        }
        return [];
    }

    const _getGradeIsNonClassSubjects = () => {
        if (editSubjectGroup) {
            const isNonClassSubjectsClone = [...isNonClassSubjects];
            const { gradeId = null } = editSubjectGroup;
            if (gradeId) {
                return isNonClassSubjectsClone.filter(subject => subject.gradeIds.indexOf(gradeId) > -1)
            }
            return [];
        }
        return [];
    }

    // const _editGroupSubjectChange = (e, data) => {
    //     this.setState({
    //         selectedGroupSubjectId: data.value,
    //         editGroupTeacherId: null,
    //         newSubjectGroupRow: [{
    //             class: null,
    //             allStudents: [],
    //             group_student: []
    //         }],
    //     })
    // }

    const _editGroupTeacherChange = (e, data) => {
        setEditGroupTeacherId(data.value)
    }

    const _getGroupTeachers = () => {
        if (selectedGroupSubjectId) {
            const teachers = [...editGroupTeachers];
            return teachers.filter(teacher => teacher.subject === selectedGroupSubjectId?.toString());
        }
        return [];
    }

    const _getTotalStudentsNumber = () => {
        let count = 0;
        for (const row of newSubjectGroupRow) {
            if (row && row.group_student && row.group_student.length) {
                count += row.group_student.length;
            }
        }
        return count;
    }

    return (
        <Modal
            size='xl'
            dimmer='blurring'
            show={true}
            onHide={onClose}
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton style={{padding: '1rem'}}>
                <Modal.Title className="modal-title d-flex flex-row justify-content-between w-100">
                    {t('edit')}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <div className="my-4">
                {
                    editGroupIsClass
                        ?
                        <>
                            <div className="form-group m-form__group row">
                                <label className="col-4 text-right label-pinnacle-bold">
                                    {translations(locale).type}
                                </label>
                                <label className="col-5" style={{ color: '#575962' }}>
                                    {translations(locale).timetable.class_student}
                                </label>
                            </div>
                            <div className="form-group m-form__group row">
                                <label className="col-4 text-right label-pinnacle-bold">
                                    {translations(locale).grade}
                                </label>
                                <label className="col-5" style={{ color: '#575962' }}>
                                    {editSubjectGroup?.gradeName}
                                </label>
                            </div>
                            <div className="form-group m-form__group row align-items-baseline">
                                <label className="col-4 text-right label-pinnacle-bold">
                                    {translations(locale).name || null}
                                </label>
                                <div className="col-md-5 col-sm-12">
                                    <input type="text"
                                        className={showModalError && selectedGroupName?.length === 0 ? "form-control m-input has-error" : "form-control m-input"}
                                        placeholder={translations(locale).insert_first_name || null}
                                        value={selectedGroupName ? selectedGroupName : ''}
                                        onChange={newSubjectGroupNameChange} />
                                </div>
                            </div>
                            <div className="form-group m-form__group row align-items-baseline">
                                <label className="col-4 text-right label-pinnacle-bold">
                                    {translations(locale).subject.title || null}
                                </label>
                                <div className="col-5">
                                    <Dropdown
                                        selectOnNavigation={false}
                                        placeholder={'-' + translations(locale).survey.choose + '-' || null}
                                        fluid
                                        selection
                                        className={showModalError && !selectedGroupTeacherId ? "has-error" : ""}
                                        search
                                        disabled
                                        additionPosition='bottom'
                                        upward={false}
                                        closeOnChange
                                        selectOnBlur={false}
                                        value={parseInt(selectedGroupSubjectId)}
                                        options={_getGradeIsClassSubjects()}
                                    // onChange={_editGroupSubjectChange}
                                    />
                                </div>
                            </div>
                            <div className="form-group m-form__group row align-items-baseline">
                                <label className="col-4 text-right label-pinnacle-bold">
                                    {translations(locale).teacher_title || null}
                                </label>
                                <div className="col-5">
                                    <Dropdown
                                        selectOnNavigation={false}
                                        placeholder={'-' + translations(locale).survey.choose + '-' || null}
                                        fluid
                                        selection
                                        className={showModalError && !selectedGroupTeacherId ? "has-error" : ""}
                                        search
                                        additionPosition='bottom'
                                        upward={false}
                                        closeOnChange
                                        selectOnBlur={false}
                                        value={editGroupTeacherId}
                                        options={_getGroupTeachers()}
                                        onChange={_editGroupTeacherChange}
                                    />
                                </div>
                            </div>
                        </>
                        :
                        <>
                            <div className="form-group m-form__group row">
                                <label className="col-4 text-right label-pinnacle-bold">
                                    {translations(locale).type}
                                </label>
                                <label className="col-5" style={{ color: '#575962' }}>
                                    {translations(locale).timetable.group_student}
                                </label>
                            </div>
                            <div className="form-group m-form__group row">
                                <label className="col-4 text-right label-pinnacle-bold">
                                    {translations(locale).grade}
                                </label>
                                <label className="col-5" style={{ color: '#575962' }}>
                                    {editSubjectGroup?.gradeName}
                                </label>
                            </div>
                            <div className="form-group m-form__group row">
                                <label className="col-form-label col-md-4 col-sm-12 text-right label-pinnacle-bold">
                                    {translations(locale).first_name || null}
                                </label>
                                <div className="col-md-5 col-sm-12">
                                    <input type="text"
                                        className={showModalError && selectedGroupName?.length === 0 ? "form-control m-input has-error" : "form-control m-input"}
                                        placeholder={translations(locale).insert_first_name || null}
                                        value={selectedGroupName ? selectedGroupName : ''}
                                        onChange={newSubjectGroupNameChange} />
                                </div>
                            </div>

                            <div className="form-group m-form__group row">
                                <label className="col-form-label col-md-4 col-sm-12 text-right label-pinnacle-bold">
                                    {translations(locale).subject.title || null}
                                </label>
                                <div className="col-5">
                                    <Dropdown
                                        selectOnNavigation={false}
                                        placeholder={'-' + translations(locale).survey.choose + '-' || null}
                                        fluid
                                        selection
                                        className={showModalError && !selectedGroupSubjectId ? "has-error" : ""}
                                        search
                                        disabled
                                        additionPosition='bottom'
                                        upward={false}
                                        closeOnChange
                                        selectOnBlur={false}
                                        value={parseInt(selectedGroupSubjectId)}
                                        options={_getGradeIsNonClassSubjects()}
                                    // onChange={_editGroupSubjectChange}
                                    />
                                </div>
                            </div>
                            <div className="form-group m-form__group row">
                                <label className="col-form-label col-md-4 col-sm-12 text-right label-pinnacle-bold">
                                    {translations(locale).teacher_title || null}
                                </label>
                                <div className="col-5">
                                    <Dropdown
                                        selectOnNavigation={false}
                                        placeholder={'-' + translations(locale).survey.choose + '-' || null}
                                        fluid
                                        selection
                                        className={showModalError && !editGroupTeacherId ? "has-error" : ""}
                                        search
                                        additionPosition='bottom'
                                        upward={false}
                                        closeOnChange
                                        selectOnBlur={false}
                                        value={editGroupTeacherId}
                                        options={_getGroupTeachers()}
                                        onChange={_editGroupTeacherChange}
                                    />
                                </div>
                            </div>

                            <div className="form-group m-form__group row">
                                <div className="col-md-1" />
                                <div className="col-md-10">
                                    <table className="table table-borderless">
                                        <thead>
                                            <tr>
                                                <th className="text-right bolder pb-4" style={{ fontSize: '14px', color: '#575962' }}>{translations(locale).total + ':' || null}&nbsp;{_getTotalStudentsNumber()}</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                newSubjectGroupRow.map(function (obj, i) {
                                                    return (
                                                        <tr key={'tr_group_' + i}>
                                                            <td width={120} className="text-right label-pinnacle-bold">
                                                                {translations(locale).group.title || null}
                                                            </td>
                                                            <td width={300} className="p-2">
                                                                <Dropdown
                                                                    selectOnNavigation={false}
                                                                    placeholder={'-' + translations(locale).survey.choose + '-' || null}
                                                                    fluid
                                                                    selection
                                                                    search
                                                                    additionPosition='bottom'
                                                                    upward={false}
                                                                    closeOnChange
                                                                    selectOnBlur={false}
                                                                    className={showModalError && !newSubjectGroupRow[i]['class'] ? "has-error" : ""}
                                                                    value={newSubjectGroupRow[i]['class']}
                                                                    options={_getGroupRowClasses()}
                                                                    onChange={(e, data) => {
                                                                        newSubjectGroupRow[i]['class'] = data.value;
                                                                        newSubjectGroupRow[i]['group_student'] = [];

                                                                        setState({
                                                                            fetchClassId: data.value,
                                                                            showLoader: true,
                                                                            fetchClassStudent: true,
                                                                            showModalError: false
                                                                        });

                                                                        let params = {
                                                                            class: data.value
                                                                        };
                                                                        props.fetchClassStudents(params);
                                                                    }}
                                                                />
                                                            </td>
                                                            <td className="p-2">
                                                                <Dropdown
                                                                    selectOnNavigation={false}
                                                                    placeholder={'-' + translations(locale).survey.choose + '-' || null}
                                                                    fluid
                                                                    className={showModalError && !newSubjectGroupRow[i]['group_student'].length ? "has-error" : ""}
                                                                    selection
                                                                    search
                                                                    additionPosition='bottom'
                                                                    upward={false}
                                                                    selectOnBlur={false}
                                                                    multiple={true}
                                                                    value={newSubjectGroupRow[i]['group_student']}
                                                                    options={newSubjectGroupRow[i]['allStudents']}
                                                                    onChange={(e, data) => {

                                                                        let count = 0;
                                                                        let clone = newSubjectGroupRow;
                                                                        for (let k = 0; k < clone.length; k++) {
                                                                            let rowObj = clone[k];

                                                                            if (k === i) {
                                                                                rowObj['group_student'] = data.value;
                                                                                count = count + data.value.length;
                                                                            } else {
                                                                                count = count + rowObj['group_student'].length;
                                                                            }
                                                                        }
                                                                        setNewSubjectGroupRow(clone)
                                                                        setShowModalError(false)
                                                                        setGroupTotalStudents(count)
                                                                    }}
                                                                />
                                                            </td>
                                                            <td width={100} className="p-2 vertical-inherit">
                                                                {
                                                                    i > 0
                                                                        ?
                                                                        <button
                                                                            onClick={() => newSubjectGroupRemoveRow(i)}
                                                                            className="btn btn-danger m-btn m-btn--icon btn-sm m-btn--icon-only m-btn--pill d-inline-flex align-items-center justify-content-center">
                                                                            <CloseIcon />
                                                                        </button>
                                                                        : null
                                                                }
                                                            </td>
                                                        </tr>
                                                    )
                                                })
                                            }
                                            <tr>
                                                <td />
                                                <td />
                                                <td />
                                                <td width={100} className="p-2">
                                                    <button onClick={newSubjectGroupAddRow}
                                                        className="btn btn-outline-info m-btn m-btn--icon btn-sm m-btn--icon-only m-btn--pill d-inline-flex align-items-center justify-content-center"
                                                    >
                                                        <AddIcon />
                                                    </button>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <div className="col-md-1" />
                            </div>
                        </>
                    }
                </div>
            </Modal.Body>
            <Modal.Footer className='text-center'>
                {
                    modalTabIndex == 1 &&
                    <div className="position-absolute" style={{ bottom: '16px', left: '16px' }}>
                        <Checkbox
                            checked={addAgain}
                            label={t('group.addAgain')}
                            onClick={(e, data) => setAddAgain(data.checked)}
                        />
                    </div>
                }
                <button
                    className="btn m-btn--pill btn-link m-btn m-btn--custom margin-right-5"
                    onClick={onClose}
                >
                    {t('back') || null}
                </button>
                <button
                    onClick={onSubmit}
                    className="btn m-btn--pill btn-success m-btn--wide m-btn--uppercase"
                >
                    {t('save') || null}
                </button>
            </Modal.Footer>
        </Modal >
    )
}

export default EditModal