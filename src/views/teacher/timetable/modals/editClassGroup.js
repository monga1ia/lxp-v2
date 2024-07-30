import React, { useEffect, useState } from 'react'
import { Modal } from 'react-bootstrap'
import { useTranslation } from "react-i18next";
import { translations } from 'utils/translations';
import DTable from 'modules/DataTable/DTable';
import secureLocalStorage from 'react-secure-storage';
import { NDropdown as Dropdown } from 'widgets/Dropdown';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';

const locale = secureLocalStorage?.getItem('selectedLang') || 'mn'

const EditClassGroup = ({ onClose, onSubmit }) => {
    
    const { t } = useTranslation();

    const [classOrGroup, setClassOrGroup] = useState('GROUP')
    const [selectedGroupName, setSelectedGroupName] = useState('')
    const [editSubjectGroup, setEditSubjectGroup] = useState({className: 'Group'})
    const [groupTotalStudents, setGroupTotalStudents] = useState(0)
    const [classes, setClasses] = useState([])
    const [isNonClassSubjects, setIsNonClassSubjects]  = useState([])
    const [selectedGroupSubjectId, setSelectedGroupSubjectId] = useState(null)
    const [fetchClassId, setFetchClassId]  = useState(null)

    const [newSubjectGroupRow, setNewSubjectGroupRow] = useState([
        {
            class: '123',
            group_student: '1232',
            allStudents: [
                {value: '5124', text: '1231'},
                {value: '123', text: '423'},
                {value: '242', text: '211'},
                {value: '512324', text: 'sadgrf'},
                {value: '511124', text: '4356'},
            ],
        },
        {
            class: '123',
            group_student: '1232',
            allStudents: [
                {value: '5124', text: '1231'},
                {value: '123', text: '423'},
                {value: '242', text: '211'},
                {value: '512324', text: 'sadgrf'},
                {value: '511124', text: '4356'},
            ],
        },
        {
            class: '123',
            group_student: '1232',
            allStudents: [
                {value: '5124', text: '1231'},
                {value: '123', text: '423'},
                {value: '242', text: '211'},
                {value: '512324', text: 'sadgrf'},
                {value: '511124', text: '4356'},
            ],
        },
        {
            class: '123',
            group_student: '1232',
            allStudents: [
                {value: '5124', text: '1231'},
                {value: '123', text: '423'},
                {value: '242', text: '211'},
                {value: '512324', text: 'sadgrf'},
                {value: '511124', text: '4356'},
            ],
        },
    ])

    const newSubjectGroupAddRow = () => {
        setNewSubjectGroupRow([...newSubjectGroupRow, {
            class: null,
            allStudents: [],
            group_student: []
        }])
    }

    const newSubjectGroupRemoveRow = (index) => {
        let newSubjClone = [...newSubjectGroupRow];
        newSubjClone.splice(index, 1);

        let groupTotal = 0;
        for (let i = 0; i < newSubjClone.length; i++) {
            groupTotal = groupTotal + newSubjClone[i].group_student.length;
        }

        setNewSubjectGroupRow(newSubjClone)
        setGroupTotalStudents(groupTotal)
    }

    // useEffect(() => {
    //     this.setState({
    //         classOrGroup: nextProps.editSubjectGroup && nextProps.editSubjectGroup?.isClass ? 'CLASS' : 'GROUP',
    //         selectedGroupName,
    //         newSubjectGroupRow,
    //         isNonClassSubjects,
    //         groupTotalStudents,
    //         selectedGroupSubjectId: nextProps.editSubjectGroup ? nextProps.editSubjectGroup?.subjectId : null,
    //         classes: nextProps?.editSubjectAllClasses,
    //     });
    // })

    const newSubjectSubmit = () => {
        console.log('newSubjectSUbmitEditTimetable')
        // let params = {}
        // if (editSubjectGroup?.isClass) {
        //     params = {
        //         name: selectedGroupName,
        //         submit: 1,
        //         type: 'all',
        //         group: editSubjectGroup?.id,

        //     }
        // } else {
        //     const details = state?.newSubjectGroupRow?.map(el => ({
        //         class: el.class,
        //         students: el.group_student,
        //     }))
        //     params = {
        //         group: editSubjectGroup?.id,
        //         subject: selectedGroupSubjectId,
        //         name: selectedGroupName,
        //         type: 'group',
        //         submit: 1,
        //         details: JSON.stringify(details),
        //     }
        // }
        // setState({
        //     fetchEditSubject: true,
        //     fetchEditSubjectSubmit: true,
        //     showLoader: true,
        // });
        // props.fetchTeacherTimetableEditSubjectSubmit(params)
    }

    
    const _getGroupSubjectClasses = () => {
        let subjectClasses = [];
        const classClone = [...classes];
        const subjects = [...isNonClassSubjects];
        if (selectedGroupSubjectId && classClone.length) {
            const selectedSubject = subjects.find(subject => subject.value === selectedGroupSubjectId);
            if (selectedSubject && selectedSubject.gradeIds) {
                subjectClasses = classClone.filter(classObj => selectedSubject.gradeIds.indexOf(classObj.gradeId) > -1);
            }
        }
        return subjectClasses;
    }
    
    const newSubjectGroupNameChange = (e) => {
        setSelectedGroupName(e.target.value)
    }
    
    const _renderClassSubject = () => {
        return (
            <div>
                <div className="form-group m-form__group row">
                    <label className="col-form-label col-md-4 col-sm-12 text-right label-pinnacle-bold">
                        {translations(locale).first_name || null}
                    </label>
                    <div className="col-md-5 col-sm-12">
                        <input type="text" className="form-control m-input"
                                placeholder={translations(locale).insert_first_name || null}
                                value={selectedGroupName ? selectedGroupName : ''}
                                onChange={newSubjectGroupNameChange}/>
                    </div>
                </div>
                <div className="form-group m-form__group row">
                    <div className="col-md-12 col-xs-12 text-center">
                        <label className="col-form-label" style={{color: '#62646e'}}>
                            {
                                locale === 'mn'
                                    ?
                                    (editSubjectGroup.className || '') + ' ' + translations(locale).timetable.class_all_students
                                    :
                                    translations(locale).timetable.class_all_students + ' ' + (editSubjectGroup.className || '')
                            }
                        </label>
                    </div>
                </div>
            </div>
        )
    };

    const _renderGroupSubject = () => {
        return (
            <div>
                <div className="form-group m-form__group row">
                    <label className="col-form-label col-md-4 col-sm-12 text-right label-pinnacle-bold">
                        {translations(locale).first_name || null}
                    </label>
                    <div className="col-md-5 col-sm-12">
                        <input type="text" className="form-control m-input"
                               placeholder={translations(locale).insert_first_name || null}
                               value={selectedGroupName ? selectedGroupName : ''}
                               onChange={newSubjectGroupNameChange}/>
                    </div>
                    <div className="col-md-4">
                    </div>
                </div>

                <div className="form-group m-form__group row">
                    <div className="col-md-1">
                    </div>
                    <div className="col-md-10">
                        <table className="table newSubjectGroupDatatable">
                            <thead>
                            <tr>
                                <th className="text-right text-capitalize pb-4" style={{
                                    fontSize: 14,
                                    color: '#575962',
                                    fontWeight: 500
                                }}>{translations(locale).total + ':' || null} {groupTotalStudents}</th>
                            </tr>
                            </thead>
                            <tbody>
                            {
                                newSubjectGroupRow?.map(function (obj, i) {
                                    return (
                                        <tr key={'tr_group_' + i}>
                                            <td style={{verticalAlign: 'top'}} className="label-pinnacle-bold">
                                                {translations(locale).group.title || null}
                                            </td>
                                            <td className="p-1">
                                                <Dropdown
                                                    placeholder={'-' + translations(locale).survey.choose + '-' || null}
                                                    fluid
                                                    selection
                                                    search
                                                    additionPosition='bottom'
                                                    upward={false}
                                                    closeOnChange
                                                    selectOnBlur={false}
                                                    value={newSubjectGroupRow[i]['class']}
                                                    options={_getGroupSubjectClasses()}
                                                    onChange={(e, data) => {
                                                        setFetchClassId(data.value)
                                                        // setState({
                                                        //     showLoader: true,
                                                        //     fetchClassStudent: true
                                                        // });

                                                        newSubjectGroupRow[i]['class'] = data.value;
                                                        newSubjectGroupRow[i]['group_student'] = [];
                                                        newSubjectGroupRow[i]['allStudents'] = [];
                                                        let params = {
                                                            class: data.value
                                                        };
                                                        // props.fetchClassStudents(params);
                                                    }}
                                                />
                                            </td>
                                            <td className="p-1">
                                                <Dropdown
                                                    placeholder={'-' + translations(locale).survey.choose + '-' || null}
                                                    fluid
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
                                                        let newSubjClone = newSubjectGroupRow;
                                                        for (let k = 0; k < newSubjClone.length; k++) {
                                                            let rowObj = newSubjClone[k];

                                                            if (k === i) {
                                                                rowObj['group_student'] = data.value;
                                                                count = count + data.value.length;
                                                            } else {
                                                                count = count + rowObj['group_student'].length;
                                                            }
                                                        }

                                                        setNewSubjectGroupRow(newSubjClone)
                                                        setGroupTotalStudents(count)

                                                        // newSubjectGroupRow[i]['group_student'] = data.value;
                                                    }}
                                                />
                                            </td>
                                            <td className="py-1" width={100}>
                                                {
                                                    i > 0
                                                        ?
                                                        <button
                                                            onClick={() => newSubjectGroupRemoveRow(i)}
                                                            className="btn btn-danger m-btn m-btn--icon btn-sm m-btn--icon-only m-btn--pill d-inline-flex align-items-center justify-content-center">
                                                            <CloseIcon sx={{fontSize: '1.2rem'}}/>
                                                        </button>
                                                        : null
                                                }
                                            </td>
                                        </tr>
                                    )
                                })
                            }
                            <tr>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td className="py-1" width={100}>
                                    <button onClick={newSubjectGroupAddRow}
                                            className="btn btn-outline-info m-btn m-btn--icon btn-sm m-btn--icon-only m-btn--pill d-inline-flex align-items-center justify-content-center"
                                    >
                                        <AddIcon/>
                                    </button>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="col-md-1">
                    </div>
                </div>
            </div>
        )
    };
    
    return (
        <Modal
            size='xxl'
            dimmer='blurring'
            show={true}
            onHide={onClose}
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton style={{padding: '1rem'}}>
                <Modal.Title className="modal-title d-flex flex-row justify-content-between w-100">
                    {t('timetable.edit')}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body style={{color: '#212529'}}>
                <div className="myTimetable-addNewSubjectStyle">
                    <div className="myTimetable-addNewSubjectStyle">
                        {
                            classOrGroup === 'CLASS'
                                ?
                                _renderClassSubject()
                                :
                                classOrGroup === 'GROUP'
                                    ?
                                    _renderGroupSubject()
                                    : null
                        }
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer className='text-center'>
                <button className="btn m-btn--pill btn-link m-btn--custom"
                        onClick={onClose}>{translations(locale).back || null}
                </button>
                <button
                    className="btn btn-success m-btn m-btn--icon m-btn--pill m-btn--uppercase"
                    onClick={newSubjectSubmit}>{translations(locale).save || null}
                </button>
            </Modal.Footer>
        </Modal >
    )
}

export default EditClassGroup