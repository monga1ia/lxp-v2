import React, { useEffect, useState } from 'react'
import { Modal } from 'react-bootstrap'
import { useTranslation } from "react-i18next";
import { translations } from 'utils/translations';
import DTable from 'modules/DataTable/DTable';
import secureLocalStorage from 'react-secure-storage';
import { Tab } from 'semantic-ui-react';
import { NDropdown as Dropdown } from 'widgets/Dropdown';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';

const locale = secureLocalStorage?.getItem('selectedLang') || 'mn'

const AddNewSubject = ({ onClose, onSubmit }) => {
    
    const { t } = useTranslation();

    const [newSubjectTabName, setNewSubjectTabName]  = useState('class')
    const [classes, setClasses] = useState([])
    const [selectedIsClassSubjectIds, setSelectedIsClassSubjectIds]  = useState([])
    const [isNonClassSubjects, setIsNonClassSubjects]  = useState([])
    const [selectedGroupName, setSelectedGroupName]  = useState('')
    const [isClassSubjects, setIsClassSubjects] = useState(false)
    const [selectedGroupSubjectId, setSelectedGroupSubjectId]  = useState(null)
    const [groupTotalStudents, setGroupTotalStudents] = useState(0)

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

    const [newSubjectRow, setNewSubjectRow] = useState([
        {
            class: '123',
            group_student: '1232',
            subject: [
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
            subject: [
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
            subject: [
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
            subject: [
                {value: '5124', text: '1231'},
                {value: '123', text: '423'},
                {value: '242', text: '211'},
                {value: '512324', text: 'sadgrf'},
                {value: '511124', text: '4356'},
            ],
        },
    ])
    const newSubjectTabChange = (e, data) => {
        setNewSubjectTabName(data.panes[data.activeIndex].menuName)
    }
   
    const newSubjectAddRow = () => {
        setNewSubjectRow([...newSubjectRow, {
            class: null,
            allStudents: [],
            group_student: []
        }])
    }

    const newSubjectRemoveRow = (index) => {
        let clone = [...newSubjectRow];
        let subjectId = clone[index].subject;

        let selectedIsClassClone = selectedIsClassSubjectIds;
        selectedIsClassClone.splice(selectedIsClassClone.indexOf(subjectId), 1);

        let isClassClone = isClassSubjects;
        for (let i = 0; i < isClassClone.length; i++) {
            let subject = isClassClone[i];
            if (subject.value === subjectId) {
                subject['disabled'] = false;
                break;
            }
        }

        clone.splice(index, 1);

        setNewSubjectRow(clone)
        setIsClassSubjects(isClassClone)
        setSelectedIsClassSubjectIds(selectedIsClassClone)
    }

    const newSubjectGroupSubjectChange = (e, data) => {
        setSelectedGroupSubjectId(data.value)
    }

    const newSubjectGroupNameChange = (e) => {
        setSelectedGroupName(e.target.value)
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

    const _onSubjectChange = (e, data, i) => {
        const isClassClone = [...isClassSubjects];
        let newSubjClone = [...newSubjectRow];
        newSubjClone[i]['subject'] = data.value;

        const selectedIsClassClone = [];

        for (const row of newSubjClone) {
            if (row.subject) {
                selectedIsClassClone.push(row.subject)
            }
        }

        for (const subject of isClassClone) {
            subject.disabled = selectedIsClassClone.indexOf(subject.value) > -1;
        }

        const selected = data.options.find(subject => subject.value === data.value);

        const allClasses = [...classes];
        let rowClassOptions = [];
        if (selected && selected.gradeIds) {
            rowClassOptions = allClasses.filter(classObj => selected.gradeIds.indexOf(classObj.gradeId) > -1);
        }
        const filteredClasses = rowClassOptions.filter(item => {
            return selected?.classes?.indexOf(item.id) === -1
        });
        newSubjClone[i]['optionClasses'] = filteredClasses;

        setIsClassSubjects(isClassClone)
        setNewSubjectRow(newSubjClone)
        setSelectedIsClassSubjectIds(selectedIsClassClone)
    }

    const newSubjectSubmit = () => {
        console.log('newSubjectSubmitAddNew')
        // if (newSubjectTabName === 'class') {
        //     let errorSubject = false;
        //     let errorGroup = false;

        //     for (var i = 0; i < newSubjectRow.length; i++) {
        //         let subjectRow = newSubjectRow[i];
        //         if (subjectRow.subject == null) {
        //             errorSubject = true
        //         } else if (subjectRow.groups.length < 1) {
        //             errorGroup = true
        //         }
        //     }

        //     if (errorSubject) {
        //         _addMsg(translations(locale).timetable.select_subject)
        //     } else if (errorGroup) {
        //         _addMsg(translations(locale).timetable.select_class)
        //     } else {
        //         // setState({
        //         //     fetchNewSubjectSubmit: true,
        //         //     showLoader: true
        //         // });

        //         let details = newSubjectRow?.map(el => ({
        //             subject: el.subject,
        //             classes: el.groups,
        //         }))

        //         const params = {
        //             submit: 1,
        //             type: 'all',
        //             details: JSON.stringify(details),

        //         }

        //         // props.fetchMyTimetableNewSubjectSubmit(params)
        //     }
        // } else if (newSubjectTabName === 'group') {
        //     let error = false;

        //     if (!selectedGroupSubjectId) {
        //         // setState({
        //         //     modalMessageSuccess: false,
        //         //     modalMessage: translations(locale).timetable.select_subject || null
        //         // })
        //         _addMsg(translations(locale).timetable.select_subject)

        //     } else if (!selectedGroupName) {
        //         // setState({
        //         //     modalMessageSuccess: false,
        //         //     modalMessage: translations(locale).teacher.new_name_placeholder || null
        //         // })
        //         _addMsg(translations(locale).teacher.new_name_placeholder)
        //     } else {


        //         if (newSubjectGroupRow.length > 0) {
        //             for (let i = 0; i < newSubjectGroupRow.length; i++) {
        //                 let groupRow = newSubjectGroupRow[i];

        //                 if (groupRow['class'] == null || groupRow['group_student'].length < 1) {
        //                     error = true;
        //                 }
        //             }
        //         }

        //         if (error === false) {
        //             const details = state?.newSubjectGroupRow?.map(el => ({
        //                 class: el.class,
        //                 students: el.group_student,
        //             }))

        //             const params = {
        //                 subject: selectedGroupSubjectId,
        //                 name: selectedGroupName,
        //                 type: 'group',
        //                 submit: 1,
        //                 details: JSON.stringify(details),
        //             }
        //             // setState({
        //             //     fetchNewSubjectSubmit: true,
        //             //     showLoader: true
        //             // });
        //             // props.fetchMyTimetableNewSubjectSubmit(params)
        //         } else {
        //             // setState({
        //             //     modalMessageSuccess: false,
        //             //     modalMessage: translations(locale).timetable.check_group_info || null
        //             // })
        //             _addMsg(translations(locale).timetable.check_group_info)
        //         }
        //     }
        // }
    }

    const _renderClassSubject = () => {
        return (
            <div>
                <div className="row">
                    <div className="col-md-2"/>
                    <div className="col-md-8">
                        <table className="table table-bordered"
                                key={'newSubject_1'}
                        >
                            <thead>
                            <tr>
                                <th className="bolder" width={300} style={{
                                    color: '#575962',
                                    fontSize: '11px',
                                    paddingLeft: '20px'
                                }}>{translations(locale).timetable.subject || null}</th>
                                <th className="bolder" width={300} style={{
                                    color: '#575962',
                                    fontSize: '11px',
                                    paddingLeft: '20px'
                                }}>{translations(locale).group.title || null}</th>
                                <th align="center" width={50}/>
                            </tr>
                            </thead>
                            <tbody>
                            {
                                newSubjectRow?.map((obj, i) => {
                                    return (
                                        <tr key={'tr_' + i}>
                                            <td className="p-1">
                                                {
                                                    isClassSubjects
                                                        ?
                                                        <Dropdown
                                                            search
                                                            additionPosition='bottom'
                                                            upward={false}
                                                            closeOnChange
                                                            selectOnBlur={false}
                                                            fluid
                                                            selection
                                                            multiple={false}
                                                            placeholder={translations(locale).survey.choose || null}
                                                            options={isClassSubjects}
                                                            value={newSubjectRow[i]['subject']}
                                                            onChange={(e, data) => _onSubjectChange(e, data, i)}
                                                        />
                                                        : null
                                                }
                                            </td>
                                            <td className="p-1">
                                                {
                                                    classes
                                                        ?
                                                        <Dropdown
                                                            search
                                                            additionPosition='bottom'
                                                            upward={false}
                                                            selectOnBlur={false}
                                                            fluid
                                                            selection
                                                            multiple={true}
                                                            placeholder={translations(locale).survey.choose || null}
                                                            options={newSubjectRow[i]['optionClasses']}
                                                            value={newSubjectRow[i]['groups']}
                                                            onChange={(e, data) => {
                                                                setSelectedGroupId(data.value)
                                                                newSubjectRow[i]['groups'] = data.value;
                                                            }}
                                                        />
                                                        : null
                                                }
                                            </td>
                                            <td width={50} className='p-1 vertical-inherit text-center'>
                                                {
                                                    i > 0
                                                        ?
                                                        <button
                                                            onClick={() => newSubjectRemoveRow(i)}
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
                                <td className="border-white"/>
                                <td style={{borderBottomColor: 'white'}}/>
                                <td width={50} className='p-1 vertical-inherit text-center'>
                                    {
                                        newSubjectRow.length < isClassSubjects.length
                                            ?
                                            <button
                                                onClick={newSubjectAddRow}
                                                className="btn btn-outline-info m-btn m-btn--icon btn-sm m-btn--icon-only m-btn--pill d-inline-flex align-items-center justify-content-center"
                                            >
                                                <AddIcon/>
                                            </button>
                                            :
                                            null
                                    }

                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="col-md-2">
                    </div>
                </div>
            </div>
        )
    };

    const _renderGroupSubject = () => {
        let that = this;
        return (
            <div>
                <div className="form-group m-form__group row">
                    <label className="col-form-label col-md-4 col-sm-12 text-right label-pinnacle-bold">
                        {translations(locale).subject.title || null}
                    </label>
                    <div className="col-md-5 col-sm-12">
                        <Dropdown
                            placeholder={'-' + translations(locale).survey.choose + '-' || null}
                            fluid
                            selection
                            search
                            additionPosition='bottom'
                            upward={false}
                            closeOnChange
                            selectOnBlur={false}
                            value={selectedGroupSubjectId}
                            options={isNonClassSubjects}
                            onChange={newSubjectGroupSubjectChange}
                        />
                    </div>
                    <div className="col-md-4">
                    </div>
                </div>
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
                                                        // setFetchClassId(data.value)
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
                    {t('add')}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body style={{color: '#212529'}}>
                <div className="myTimetable-addNewSubjectStyle">
                    <div className="myTimetable-addNewSubjectStyle">
                        <Tab
                            menu={{attached: false}}
                            onTabChange={newSubjectTabChange}
                            panes={[
                                {
                                    menuItem: translations(locale).timetable.class_student?.toUpperCase(),
                                    menuName: 'class',
                                    render: () => <Tab.Pane>
                                        {
                                            _renderClassSubject()
                                        }
                                    </Tab.Pane>
                                },
                                {
                                    menuItem: translations(locale).timetable.group_student?.toUpperCase(),
                                    menuName: 'group',
                                    render: () => <Tab.Pane>
                                        {
                                            _renderGroupSubject()
                                        }
                                    </Tab.Pane>
                                },
                            ]}
                        />
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

export default AddNewSubject