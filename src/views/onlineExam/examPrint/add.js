import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button, Card } from "react-bootstrap";
import CheckBoxButton from "components/buttons/CheckBoxButton";
import HtmlHead from "components/html-head/HtmlHead";
import DatePickerRange from "modules/Form/DatePickerRange";
import Select from "modules/Form/Select";
import { fetchRequest } from "utils/fetchRequest";
import showMessage from "modules/message";
import { useSelector } from "react-redux";
import { examAddSubmit, examAddInit, examTemplateGradeSubject } from 'utils/fetchRequest/Urls';
import { toDropdownData } from "utils/utils";
import SchoolTab from "./components/tabComponent";

export default function CreateExam() {
    const { t } = useTranslation();
    const history = useHistory();

    const { schools, selectedSchool } = useSelector(state => state.schoolData);

    const [gradeOptions, setGradeOptions] = useState([])
    const [subjectOptions, setSubjectOptions] = useState([])
    const [schoolOptions] = useState(toDropdownData(schools, 'id', 'schoolName') || [])
    const [classOptions, setClassOptions] = useState([])
    const [groupOptions, setGroupOptions] = useState([])
    const [selectedGroupIds, setSelectedGroupIds] = useState([])
    const [selectedTabIndex, setSelectedTabIndex] = useState(0);
    const [loading, setLoading] = useState(false)

    const [duration, setDuration] = useState('')
    const [descriptionValue, setDescriptionValue] = useState('')
    const [selectedName, setSelectedName] = useState('')
    const [viewType, setViewType] = useState('INTEGRATED')

    const [selectedGradeId, setSelectedGradeId] = useState(null)
    const [selectedSubjectId, setSelectedSubjectId] = useState(null)
    const [selectedSchoolId, setSelectedSchoolId] = useState(null)
    const [selectedClassIds, setSelectedClassIds] = useState(null)
    const [selectedStartDate, setSelectedStartDate] = useState(null)
    const [selectedEndDate, setSelectedEndDate] = useState(null)
    const [minDate, setMinDate] = useState(null)
    const [dateRange, setDateRange] = useState([
        {
          startDate: new Date(),
          endDate: new Date(),
          key: 'selection',
        },
    ]);

    const title = t('exam.create');
    const description = "";

    const init = (params) => {
        setLoading(true)
        fetchRequest(examTemplateGradeSubject, 'POST', params)
            .then((res) => {
                if (res.success) {
                    const { grades = [], subjects = [] } = res;

                    if (params.grade) {
                        if(subjects && subjects.length > 0){
                            for(let i = 0; i < subjects.length; i++){
                                subjects[i]['text'] = subjects[i]['text'] + ' (' + subjects[i]['code'] + ')'
                            }
                        }
                        
                        setSubjectOptions(subjects);
                    } else {
                        setGradeOptions(grades);
                    }
                } else {
                    showMessage(res.message)
                }
                setLoading(false)
            })
            .catch(() => {
                showMessage(t('errorMessage.title'));
                setLoading(false)
            })
    }

    const getData = (params) => {
        setLoading(true)
        fetchRequest(examAddInit, 'POST', params)
            .then((res) => {
                if (res.success) {
                    const { templates = [], groups = [], parentTopics = [], classes = [] } = res

                    if (!selectedSchoolId) {
                        setSelectedSchoolId(selectedSchool.id)
                    }

                    setGroupOptions(toDropdownData(groups, 'id', 'name'))
                    setClassOptions(toDropdownData(classes, 'id', 'name'))
                } else {
                    showMessage(res.message)
                }
                setLoading(false)
            })
            .catch(() => {
                showMessage(t('errorMessage.title'));
                setLoading(false)
            })
    }

    useEffect(() => {
        let params = {
            school: selectedSchoolId ? selectedSchoolId : selectedSchool.id,
            isGradeFlat: 1,
            viewType
        }

        if (selectedSchoolId) {
            let params = {
                school: selectedSchoolId,
                grade: selectedGradeId,
                viewType,
            }

            getData(params);
        }

        init(params);
    }, []);

    const gradeDropdownChange = (value) => {
        setSelectedGradeId(value)
        let params = {
            school: selectedSchoolId ? selectedSchoolId : selectedSchool.id,
            grade: value,
            isGradeFlat: 1
        }

        init(params);
    }

    const subjectDropdownChange = (value) => {
        setSelectedSubjectId(value)

        let params = {
            school: selectedSchoolId ? selectedSchoolId : selectedSchool.id,
            grade: selectedGradeId,
            subject: value,
            viewType,
        }

        getData(params);
    }

    const onHandlerNameChange = (e) => {
        setSelectedName(e.target.value)
    }

    const integratedDropdownChange = (value) => {
        setSelectedGroupIds(value)
    }

    const schoolDropdownChange = (value) => {
        setSelectedSchoolId(value)

        setGroupOptions([])
        setClassOptions([])
        setSelectedGradeId(null)
        setSelectedSubjectId(null)

        let params = {
            school: value,
            viewType: 'SCHOOL'
        }

        getData(params);
    }

    const classDropdownChange = (value) => {
        setSelectedClassIds(value)
    }

    const onDurationHandler = (e) => {
        if(e.target.value > 0 || e.target.value == 0){
            setDuration(e.target.value)
        }
    }

    const descriptionHandler = (event) => {
        setDescriptionValue(event.target.value);
    }

    const arrayHandler = (value) => {
        const selectedRange = value[0];

        if(selectedRange.endDate) {
            if(selectedRange.endDate >= selectedRange.startDate)
            {
                setSelectedEndDate(value[0].endDate)
            }
            else{
                showMessage(t('exam.changeEndDate'));
            }
        }

        if (selectedRange.startDate) {
            selectedRange.endDate = selectedRange.startDate;
            setMinDate(selectedRange.startDate);
            setDateRange(selectedRange);
            setSelectedStartDate(selectedRange.startDate);
        }
    }

    const handleProceed = () => {
        if (!selectedGradeId) {
            showMessage(t('errorMessage.selectGrade'), false)
            return
        }

        if (!selectedSubjectId) {
            showMessage(t('errorMessage.selectSyllabus'), false)
            return
        }

        if (!selectedName) {
            showMessage(t('errorMessage.enterExamName'), false)
            return
        }

        if (!duration) {
            showMessage(t('errorMessage.enterExamMinutes'), false)
            return
        }

        if (viewType == 'INTEGRATED' && selectedGroupIds && selectedGroupIds.length == 0) {
            showMessage(t('errorMessage.selectGroups'), false)
            return
        }

        let schoolName = schoolOptions.find(schoolObj => {
            return schoolObj?.value == (selectedSchoolId ? selectedSchoolId : selectedSchool.id)
        })?.text;

        let gradeName = gradeOptions.find(parentTopicObj => {
            return parentTopicObj?.value === selectedGradeId
        })?.text;

        let subjectCode = subjectOptions.find(parentTopicObj => {
            return parentTopicObj?.value === selectedSubjectId
        })?.code;

        let subjectName = subjectOptions.find(parentTopicObj => {
            return parentTopicObj?.value === selectedSubjectId
        })?.name;

        let classes = []

        if (selectedClassIds && selectedClassIds.length > 0) {
            for (let i = 0; i < selectedClassIds.length; i++) {
                let existing = classOptions.find(classData => classData.value == selectedClassIds[i])

                if (existing) {
                    classes.push({
                        id: existing.value,
                        name: existing.text
                    })
                }
            }
        }

        if (viewType == 'SCHOOL' && classes && classes.length == 0) {
            showMessage(t('errorMessage.selectGroup'), false)
            return
        }

        if (viewType == 'SCHOOL' && (selectedStartDate  == null || selectedEndDate == null)) {
            showMessage(t('errorMessage.enterExamDate'), false)
            return
        }

        let params = {
            school: selectedSchoolId ? selectedSchoolId : selectedSchool.id,
            schoolName: schoolName,
            grade: selectedGradeId,
            gradeName,
            subject: selectedSubjectId,
            subjectCode,
            subjectName,
            name: selectedName,
            viewType,
            groups: JSON.stringify(selectedGroupIds),
            duration: duration,
            method: 'BLUEPRINT',
            isPrint: 1,
            description: descriptionValue,
            selectedSchool: selectedSchoolId,
            start: selectedStartDate,
            end: selectedEndDate,
            selectedClasses: JSON.stringify(classes)
        }

        setLoading(true)
        fetchRequest(examAddSubmit, 'POST', params)
            .then((res) => {
                if (res.success) {
                    const { id = null } = res

                    history.push({
                        pathname: '/online-exam/exam-print-edit',
                        state: {
                            id
                        }
                    })
                } else {
                    showMessage(res.message)
                }
                setLoading(false)
            })
            .catch(() => {
                showMessage(t('errorMessage.title'));
                setLoading(false)
            })
    };

    const onTableChange = (index) => {
        if (index) {
            setViewType('SCHOOL')

            let params = {
                school: selectedSchoolId ? selectedSchoolId : selectedSchool.id,
                grade: selectedGradeId,
                subject: selectedSubjectId,
                viewType: 'SCHOOL'
            }

            getData(params);
        } else {
            setViewType('INTEGRATED')

            let params = {
                school: selectedSchool.id,
                grade: selectedGradeId,
                subject: selectedSubjectId,
                viewType: 'INTEGRATED'
            }

            getData(params);
        }
        setSelectedTabIndex(index)
    }

    return (
        <>
            <HtmlHead title={title} description={description} />

            <div className="screen-padding">
                <div className="layoutless-page">
                    <Card className="">
                        <Card.Header>
                            <Card.Title className="main-orange">{title}</Card.Title>
                        </Card.Header>
                        <Card.Body className="body">
                            <div className="d-flex justify-content-center mb-3">
                                <SchoolTab
                                    selectedTabIndex={selectedTabIndex}
                                    onSelectTab={onTableChange}
                                />
                            </div>
                            <div className="w-100 flex-column d-flex justify-content-end modal-padding-right-36">
                                {
                                    selectedTabIndex == 1 &&
                                    <div className="d-flex flex-row justify-content-end align-items-center mb-3">
                                        <span className="modal-select-title mr-4">{t("menu.school")}*</span>
                                        <Select
                                            className='modal-select-lg'
                                            clearable
                                            searchable
                                            options={schoolOptions}
                                            value={selectedSchoolId}
                                            onChange={(value) => schoolDropdownChange(value)}
                                        />
                                    </div>
                                }
                                <div className="d-flex flex-row justify-content-end align-items-center mb-3">
                                    <span className="modal-select-title mr-4">{t("exam.level")}*</span>
                                    <Select
                                        className='modal-select-lg'
                                        clearable
                                        searchable
                                        options={gradeOptions}
                                        value={selectedGradeId}
                                        onChange={(value) => gradeDropdownChange(value)}
                                    />
                                </div>
                                <div className="d-flex flex-row justify-content-end align-items-center mb-3">
                                    <span className="modal-select-title mr-4">{t("exam.subject")}*</span>
                                    <Select
                                        className='modal-select-lg'
                                        clearable
                                        searchable
                                        options={subjectOptions}
                                        value={selectedSubjectId}
                                        onChange={(value) => subjectDropdownChange(value)}
                                    />
                                </div>
                                <div className="d-flex flex-row justify-content-end align-items-center">
                                    <span className="modal-select-title mr-4">{t("menu.examName") + '*'}</span>
                                    <input
                                        value={selectedName}
                                        className="modal-input-lg"
                                        onChange={onHandlerNameChange}
                                    />
                                </div>
                            </div>
                            <div className="w-100 flex-column d-flex justify-content-end modal-padding-right-36 mt-3">
                                {
                                    selectedTabIndex === 0 &&
                                    <div className="d-flex flex-row justify-content-end align-items-center mb-3">
                                        <span className="modal-select-title mr-4">
                                            {t("menu.mainGroup")}*
                                        </span>
                                        <Select
                                            className='modal-select-lg'
                                            clearable
                                            searchable
                                            multiple
                                            options={groupOptions}
                                            value={selectedGroupIds}
                                            onChange={(value) => integratedDropdownChange(value)}
                                        />
                                    </div>
                                }
                                {
                                    selectedTabIndex == 1 &&
                                    <>
                                        <div className="d-flex flex-row justify-content-end align-items-center mb-3">
                                            <span className="modal-select-title mr-4">{t("menu.group")}*</span>
                                            <Select
                                                className='modal-select-lg'
                                                clearable
                                                searchable
                                                multiple
                                                options={classOptions}
                                                value={selectedClassIds}
                                                onChange={(value) => classDropdownChange(value)}
                                            />
                                        </div>
                                        <div className="d-flex flex-row justify-content-end align-items-center mb-3 datepicker-input-style">
                                            <span className="modal-select-title mr-4">
                                                {t("menu.examDate") + '*'}
                                            </span>
                                            <DatePickerRange
                                                selectedStartDate={selectedStartDate}
                                                selectedEndDate={selectedEndDate}
                                                onChange={(array) => { arrayHandler(array) }}
                                                showTimeInput={false}
                                                showTimeSelect
                                                ranges={dateRange}
                                                moveRangeOnFirstSelection={false}
                                                editableDateInputs={true}
                                                minDate={new Date(selectedStartDate)}
                                                minDateForEndDate={selectedStartDate}
                                            />
                                        </div>
                                    </>
                                }
                                <div className="d-flex flex-row justify-content-end align-items-center mb-3">
                                    <span className="modal-select-title mr-4">
                                        {t("menu.examLength") + '*'}
                                    </span>
                                    <input
                                        type='number'
                                        value={duration}
                                        className="modal-input-lg"
                                        onChange={onDurationHandler}
                                    />
                                </div>

                                <div className="d-flex flex-row justify-content-end mb-3">
                                    <span className="modal-select-title mr-4">{t("common.description")}</span>
                                    <div className="d-flex flex-column">
                                        <textarea
                                            rows={3}
                                            className="modal-input-lg text-area"
                                            onChange={descriptionHandler}
                                        />
                                    </div>
                                </div>
                            </div>
                        </Card.Body>
                        <Card.Footer>
                            <div className="text-center">
                                <Button className='cancel-button' variant='link' onClick={() => history.goBack()}>
                                    <span style={{ color: '#ff2f1a' }}>{t('common.cancel')}</span>
                                </Button>
                                <Button className='proceed-button' variant='empty' onClick={handleProceed}>
                                    <span style={{ color: '#000000' }}>{t('action.next').toUpperCase()}</span>
                                </Button>
                            </div>
                        </Card.Footer>
                    </Card>
                </div>
            </div>
            {
                loading &&
                <>
                    <div className='loader-container'>
                        <svg className="splash-spinner" viewBox="0 0 50 50">
                            <circle className="path" cx="25" cy="25" r="20" fill="none" strokeWidth="5" />
                        </svg>
                    </div>
                </>
            }
        </>
    );
}
