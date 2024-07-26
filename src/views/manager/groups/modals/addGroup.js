import React, { useState } from 'react'
import { Modal } from 'react-bootstrap'
import { useTranslation } from "react-i18next";
import { Tab, Checkbox } from 'semantic-ui-react';
import AddIcon from '@mui/icons-material/Add';
import { NDropdown as Dropdown } from 'widgets/Dropdown';
import CloseIcon from '@mui/icons-material/Close';
import secureLocalStorage from 'react-secure-storage';

const locale = secureLocalStorage?.getItem('selectedLang') || 'mn'

const AddGroup = ({ onClose, onSubmit, data, modalTabI }) => {
    
    const { t } = useTranslation();

    const [modalTabIndex, setModalTabIndex] = useState(0)
    const [newSubjectRow, setNewSubjectRow] = useState([{
        subject: null,
        classes: [],
        teachers: [],
        teacher: null
    }])
    const [isClassSubjects, setIsClassSubjects] = useState(true)
    const [showModalError, setShowModalError] = useState(false)
    const [addAgain, setAddAgain] = useState(false)
    const [modalAction, setModalAction] = useState(data?.modalAction)
    const [selectedTreeId, setSelectedTreeId] = useState(data?.selectedTreeId || 0)
    const [selectedGroupSubjectId, setSelectedGroupSubjectId] = useState(null)
    const [isNonClassSubjects, setIsNonClassSubjects] = useState([])
    const [selectedGroupTeacherId, setSelectedGroupTeacherId] = useState(null)
    const [groupSubjectTeachers, setgroupSubjectTeachers] = useState([])
    const [selectedGroupName, setSelectedGroupName] = useState('')
    const [groupTotalStudents, setGroupTotalStudents] = useState(0)

    const [classes, setClasses] = useState(data?.classes)

    console.log(classes)

    const [newSubjectGroupRow, setNewSubjectGroupRow] = useState(data?.newSubjectGroupRow || [{
        class: null,
        allStudents: [],
        group_student: []
    }])


    
    // const _loadTeacher = (subjectId, rowIndex) => {
    //     let newSubjectRow = newSubjectRow;
    //     newSubjectRow[rowIndex]['subject'] = subjectId;
    //     newSubjectRow[rowIndex]['classes'] = [];
    //     newSubjectRow[rowIndex]['teacher'] = [];

    //     this.setState({
    //         fetchTeacher: true,
    //         showLoader: true,
    //         showModalError: false,
    //         newSubjectRow
    //     });
    //     let params = {
    //         subject: subjectId
    //     };
    //     this.props.fetchTeachersBySubject(params)
    // };
    

    const _onTabChange = (e, data) => {
        setModalTabIndex(data.activeIndex)
        modalTabI(data.activeIndex)
        setShowModalError(false)
    };
    
    const _getRowClasses = (index) => {
        const clone = [...newSubjectRow];
        let classHolder = [];
        const { subject: subjectId } = clone[index];
        if (subjectId) {
            const subjects = [...isClassSubjects];
            const gradeIds = subjects.find(el => el.value == subjectId)?.gradeIds;
            classes.forEach(el => {
                gradeIds.indexOf(el.gradeId) > -1 && classHolder.push(el)
            });
        }
        return classHolder;
    }

    const _filterGradeSubjects = (subjects = []) => {
        if (selectedTreeId && selectedTreeId?.length > 0) {
            const subjectList = [];
            for (let s = 0; s < subjects?.length; s++) {
                if (subjects[s]?.gradeIds.indexOf(selectedTreeId[0]) > -1) {
                    subjectList.push(subjects[s])
                }
            }
            return subjectList?.map(subjectObj => {
                return {
                    value: subjectObj?.value,
                    text: subjectObj?.text
                }
            });
        } else {
            return subjects
        }
    }

    const newSubjectAddRow = () => {
        setNewSubjectRow([...newSubjectRow, {
            subject: null,
            classes: [],
            teachers: [],
            teacher: null
        }])
    };

        
    const newSubjectGroupAddRow = () => {
        setNewSubjectGroupRow([...newSubjectGroupRow, {
            class: null,
            allStudents: [],
            group_student: []
        }])
    };

    const newSubjectRemoveRow = (index) => {
        if (index != 0) {
            const rows = [...newSubjectRow]
            // const option = gradeSubjectOptions?.find(option => option?.value == rows[index].grade)
            // delete option?.disabled
            rows.splice(index, 1)
            setNewSubjectRow(rows)
        }
    }
    
    const newSubjectGroupRemoveRow = (index) => {

        const rows = [...newSubjectGroupRow]
        rows.splice(index, 1)

        let totalStudents = 0;
        for (let i = 0; i < rows.length; i++) {
            totalStudents = totalStudents + rows[i].group_student.length;
        }

        setNewSubjectGroupRow(rows)
        setGroupTotalStudents(totalStudents)
    }


    const newSubjectGroupSubjectChange = (e, data) => {
        const rows = [...newSubjectGroupRow]
        rows.forEach(el => {
            el.class = []
            el.group_student = []
        })
        setNewSubjectRow(rows)
        setSelectedGroupTeacherId([])
        setShowModalError(false)
        setSelectedGroupSubjectId(data.value)
        setSelectedGroupName('')
        let params = {
            subject: data.value
        };
        // this.props.fetchTeachersBySubject(params)
    };

    const newSubjectGroupTeacherChange = (e, data) => {
        const subjectName = isNonClassSubjects?.find(el => el?.value == selectedGroupSubjectId)?.text?.split(' - ')[1]
        const teacherName = data?.options?.find(el => el?.value == data?.value)?.text?.split(' ( ')[0]
        setSelectedGroupTeacherId(data.value)
        setShowModalError(false)
        setSelectedGroupName(subjectName + ' | ' + teacherName)
    };

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

    const _renderAll = () => {
        return (
            <>
                <div className="row">
                    <div className="col-lg-1 col-md-2">
                    </div>
                    <div className="col-lg-10 col-md-8">
                        <table className="table table-bordered newSubjectClassDatatable"
                            key={'newSubject_1'}>
                            <thead>
                                <tr>
                                    <th style={{ color: '#575962', fontSize: '12px', paddingLeft: '20px' }} className='bolder' width="30%">{t('timetable.subject') || null}</th>
                                    <th style={{ color: '#575962', fontSize: '12px', paddingLeft: '20px' }} className='bolder' width="20%">{t('group.title') || null}</th>
                                    <th style={{ color: '#575962', fontSize: '12px', paddingLeft: '20px' }} className='bolder' width="40%">{t('teacher.title') || null}</th>
                                    <th align='center' width="7%" />
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    newSubjectRow.map((obj, i) => {
                                        return (
                                            <tr key={'tr_' + i}>
                                                <td className="p-1">
                                                    {
                                                        isClassSubjects
                                                            ?
                                                            <Dropdown
                                                                selectOnNavigation={false}
                                                                search
                                                                additionPosition='bottom'
                                                                className={showModalError && !newSubjectRow[i]['subject'] ? "has-error" : ""}
                                                                upward={false}
                                                                closeOnChange
                                                                selectOnBlur={false}
                                                                fluid
                                                                selection
                                                                multiple={false}
                                                                disabled={modalAction === 'EDIT'}
                                                                placeholder={t('survey.choose') || null}
                                                                options={_filterGradeSubjects(isClassSubjects)}
                                                                value={newSubjectRow[i]['subject']}
                                                                onChange={(e, data) => _loadTeacher(data.value, i)}
                                                            />
                                                            : null
                                                    }
                                                </td>
                                                <td className="p-1">
                                                    <Dropdown
                                                        selectOnNavigation={false}
                                                        search
                                                        additionPosition='bottom'
                                                        className={showModalError && newSubjectRow[i]['classes'].length === 0 ? "has-error" : ""}
                                                        upward={false}
                                                        selectOnBlur={false}
                                                        fluid
                                                        selection
                                                        multiple={true}
                                                        disabled={modalAction === 'EDIT'}
                                                        placeholder={t('survey.choose') || null}
                                                        options={_getRowClasses(i)}
                                                        value={newSubjectRow[i]['classes']}
                                                        onChange={(e, data) => {
                                                            let clone = newSubjectRow;
                                                            clone[i]['classes'] = data.value;
                                                            setNewSubjectRow(clone)
                                                            setShowModalError(false)
                                                        }}
                                                    />
                                                </td>
                                                <td className="p-1">
                                                    <Dropdown
                                                        selectOnNavigation={false}
                                                        search
                                                        additionPosition='bottom'
                                                        upward={false}
                                                        closeOnChange
                                                        selectOnBlur={false}
                                                        className={showModalError && !newSubjectRow[i]['teacher'] ? "has-error" : ""}
                                                        fluid
                                                        selection
                                                        multiple={false}
                                                        placeholder={t('survey.choose') || null}
                                                        options={newSubjectRow[i]['teachers']}
                                                        value={newSubjectRow[i]['teacher']}
                                                        onChange={(e, data) => {
                                                            let clone = newSubjectRow;
                                                            clone[i]['teacher'] = data.value;
                                                            setNewSubjectRow(clone)
                                                            setShowModalError(false)
                                                        }}
                                                    />
                                                </td>
                                                <td className="text-center p-1 vertical-inherit">
                                                    {
                                                        i > 0
                                                            ?
                                                            <button
                                                                onClick={() => newSubjectRemoveRow(i)}
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
                                    <td className="border-white" />
                                    <td className="border-white" />
                                    <td style={{ borderBottomColor: 'white' }} />
                                    <td className="text-center p-1 vertical-inherit">
                                        <button onClick={newSubjectAddRow}
                                            className="btn btn-outline-info m-btn m-btn--icon btn-sm m-btn--icon-only m-btn--pill d-inline-flex align-items-center justify-content-center"
                                        >
                                            <AddIcon />
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="col-lg-1 col-md-2">
                    </div>
                </div>
            </>
        )
    }

    const _renderGroup = () => {
        return (
            <>
                <div className="form-group m-form__group row">
                    <label className="col-form-label col-md-4 col-sm-12 text-right label-pinnacle-bold">
                        {t('subject.title') || null}
                    </label>
                    <div className="col-md-5 col-sm-12">
                        <Dropdown
                            selectOnNavigation={false}
                            placeholder={'-' + t('survey.choose') + '-' || null}
                            fluid
                            selection
                            className={showModalError && !selectedGroupSubjectId ? "has-error" : ""}
                            search
                            additionPosition='bottom'
                            upward={false}
                            closeOnChange
                            selectOnBlur={false}
                            value={selectedGroupSubjectId}
                            options={_filterGradeSubjects(isNonClassSubjects)}
                            onChange={newSubjectGroupSubjectChange}
                        />
                    </div>
                </div>
                <div className="form-group m-form__group row">
                    <label className="col-form-label col-md-4 col-sm-12 text-right label-pinnacle-bold">
                        {t('teacher.title') || null}
                    </label>
                    <div className="col-md-5 col-sm-12">
                        <Dropdown
                            selectOnNavigation={false}
                            placeholder={'-' + t('survey.choose') + '-' || null}
                            fluid
                            selection
                            className={showModalError && !selectedGroupTeacherId ? "has-error" : ""}
                            search
                            additionPosition='bottom'
                            upward={false}
                            closeOnChange
                            selectOnBlur={false}
                            value={selectedGroupTeacherId}
                            options={groupSubjectTeachers}
                            onChange={newSubjectGroupTeacherChange}
                        />
                    </div>
                </div>
                <div className="form-group m-form__group row">
                    <label className="col-form-label col-md-4 col-sm-12 text-right label-pinnacle-bold">
                        {t('first_name') || null}
                    </label>
                    <div className="col-md-5 col-sm-12">
                        <input type="text"
                            className={showModalError && selectedGroupName?.length === 0 ? "form-control m-input has-error" : "form-control m-input"}
                            placeholder={t('insert_first_name') || null}
                            value={selectedGroupName ? selectedGroupName : ''}
                            onChange={newSubjectGroupNameChange} />
                    </div>
                </div>

                <div className="form-group m-form__group row">
                    <div className="col-md-1">
                    </div>
                    <div className="col-md-10">
                        <table className="table newSubjectGroupDatatable">
                            <thead>
                                <tr>
                                    <th className="text-right pb-4" style={{ fontSize: '14px', color: '#575962' }}>{t('total') + ':' || null}
                                        &nbsp;
                                        {groupTotalStudents}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    newSubjectGroupRow.map((obj, i) => {
                                        return (
                                            <tr key={'tr_group_' + i}>
                                                <td style={{ verticalAlign: 'top' }} className="label-pinnacle-bold vertical-align-middle">
                                                    {t('group.title') || null}
                                                </td>
                                                <td className="p-2">
                                                    <Dropdown
                                                        selectOnNavigation={false}
                                                        placeholder={'-' + t('survey.choose') + '-' || null}
                                                        fluid
                                                        selection
                                                        search
                                                        additionPosition='bottom'
                                                        upward={false}
                                                        closeOnChange
                                                        selectOnBlur={false}
                                                        className={showModalError && !newSubjectGroupRow[i]['class'] ? "has-error" : ""}
                                                        value={newSubjectGroupRow[i]['class']}
                                                        options={_getGroupRowClasses(i)}
                                                        onChange={(e, data) => {
                                                            setState({
                                                                fetchClassId: data.value,
                                                                showLoader: true,
                                                                fetchClassStudent: true,
                                                                showModalError: false
                                                            });

                                                            newSubjectGroupRow[i]['class'] = data.value;
                                                            newSubjectGroupRow[i]['group_student'] = [];
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
                                                        placeholder={'-' + t('survey.choose') + '-' || null}
                                                        fluid
                                                        selection
                                                        search
                                                        additionPosition='bottom'
                                                        upward={false}
                                                        selectOnBlur={false}
                                                        multiple={true}
                                                        className={showModalError && !newSubjectGroupRow[i]['group_student']?.length ? "has-error" : ""}
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
                                                            setGroupTotalStudents(count)
                                                            setShowModalError(false)
                                                        }}
                                                    />
                                                </td>
                                                <td className="py-2">
                                                    {
                                                        i > 0
                                                            ?
                                                            <button
                                                                onClick={() => newSubjectGroupRemoveRow(i)}
                                                                className="btn btn-danger m-btn m-btn--icon btn-sm m-btn--icon-only m-btn--pill d-inline-flex justify-content-center align-items-center">
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
                                    <td width={100}>
                                        <button onClick={newSubjectGroupAddRow}
                                            className="btn btn-outline-info m-btn m-btn--icon btn-sm m-btn--icon-only m-btn--pill d-inline-flex justify-content-center align-items-center"
                                        >
                                            <AddIcon />
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="col-md-1">
                    </div>
                </div>
            </>
        )
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
                    {t('add')}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="myTimetable-addNewSubjectStyle">
                    <Tab
                        onTabChange={_onTabChange}
                        activeIndex={modalTabIndex}
                        menu={{ attached: false }}
                        panes={[
                            {
                                menuItem: t('timetable.class_student').toUpperCase(),
                                render: () => <Tab.Pane>
                                    {
                                        <div>
                                            {
                                                _renderAll()
                                            }
                                        </div>
                                    }
                                </Tab.Pane>
                            },
                            {
                                menuItem: t('timetable.group_student').toUpperCase(),
                                render: () => <Tab.Pane>
                                    {
                                        <div>
                                            {
                                                _renderGroup()
                                            }
                                        </div>
                                    }
                                </Tab.Pane>
                            },
                        ]}
                    />
                </div>
            </Modal.Body>
            <Modal.Footer className='text-center'>
                {
                    modalTabIndex == 1 &&
                    <div className='align-center align-items-center' style={{ marginLeft: '17px', position: 'absolute', left: '1.5rem', bottom: '1.6rem' }}>
                        <label className="form-check-label font-mulish" htmlFor="reAdd" style={{ color: '#575962', fontSize: '14px', fontWeight: '400' }}>
                            <input
                                className="form-check-input modal-position form-modal-check mt-0"
                                id='reAdd'
                                type="checkbox"
                                style={{ borderRadius: '4px', fontSize: '18px' }}
                                value={addAgain}
                                onChange={(e, data) => setAddAgain(e?.target?.checked)}
                            />&nbsp;&nbsp;{t('group.addAgain')}
                        </label>
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

export default AddGroup