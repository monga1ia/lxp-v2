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
    const [examTemplateOptions, setExamTemplateOptions] = useState([]);
    const [parentTopicOptions, setParentTopicOptions] = useState([]);
    const [schoolOptions] = useState(toDropdownData(schools, 'id', 'schoolName') || [])
    const [classOptions, setClassOptions] = useState([])
    const [groupOptions, setGroupOptions] = useState([])
    const [selectedGroupIds, setSelectedGroupIds] = useState([])
    const [minDate, setMinDate] = useState(null)
    const [dateRange, setDateRange] = useState([
        {
          startDate: new Date(),
          endDate: new Date(),
          key: 'selection',
        },
    ]);
    const [methodOptions] = useState([
        {
            value: 'variant',
            text: 'Тогтмол'
        },
        {
            value: 'blueprint',
            text: 'Блюпринт'
        },
    ])
    const [pageSizeOptions] = useState([
        {
            value: 1,
            text: 1
        },
        {
            value: 5,
            text: 5
        },
        {
            value: 10,
            text: 10
        },
        {
            value: 15,
            text: 15
        },
        {
            value: 20,
            text: 20
        },
        {
            value: 25,
            text: 25
        },
        {
            value: 30,
            text: 30
        },
    ])
    const [selectedTabIndex, setSelectedTabIndex] = useState(0);
    const [loading, setLoading] = useState(false)
    const [isRepeat, setIsRepeat] = useState(false)
    const [isInfinite, setIsInfinite] = useState(false)
    const [isMix, setIsMix] = useState(false)
    const [isVariant, setIsVariant] = useState(false)
    const [isMixDisable, setIsMixDisable] = useState(false)
    const [isVariantDisable, setIsVariantDisable] = useState(false)
    const [variantCountDisable, setVariantCountDisable] = useState(false)

    const [variantCount, setVariantCount] = useState('')
    const [duration, setDuration] = useState('')
    const [descriptionValue, setDescriptionValue] = useState('')
    const [repeatCount, setRepeatCount] = useState('')
    const [selectedName, setSelectedName] = useState('')
    const [viewType, setViewType] = useState('INTEGRATED')

    const [selectedGradeId, setSelectedGradeId] = useState(null)
    const [selectedSubjectId, setSelectedSubjectId] = useState(null)
    const [selectedExamTemplateId, setSelectedExamTemplateId] = useState(null)
    const [selectedParentTopicIds, setSelectedParentTopicIds] = useState([])
    const [selectedSchoolId, setSelectedSchoolId] = useState(null)
    const [selectedClassIds, setSelectedClassIds] = useState(null)
    const [selectedStartDate, setSelectedStartDate] = useState(null)
    const [selectedEndDate, setSelectedEndDate] = useState(null)
    const [selectedMethod, setSelectedMethod] = useState(null)
    const [selectedPageSize, setSelectedPageSize] = useState(null)

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

                    setExamTemplateOptions(toDropdownData(templates, 'id', 'name'))
                    setParentTopicOptions(toDropdownData(parentTopics, 'id', 'name'))
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

    const templateDropdownChange = (value) => {
        setSelectedExamTemplateId(value)
        setSelectedMethod(null)
        setSelectedPageSize(null)
        setIsMix(false)
        setIsVariant(false)
        setVariantCount('')

        if (value) {
            setIsMixDisable(true)
            setIsVariantDisable(true)
            setVariantCountDisable(true)
        } else {
            setIsMixDisable(false)
            setIsVariantDisable(false)
            setVariantCountDisable(false)
        }
    }

    const parentTopicDropdownChange = (value) => {
        setSelectedParentTopicIds(value)
    }

    const onHandlerNameChange = (e) => {
        setSelectedName(e.target.value)
    }

    const integratedDropdownChange = (value) => {
        setSelectedGroupIds(value)
    }

    const schoolDropdownChange = (value) => {
        setSelectedSchoolId(value)

        setParentTopicOptions([])
        setExamTemplateOptions([])
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
        function calculateMinutesDifference(startDate, endDate) {
            const differenceInMillis = endDate.getTime() - startDate.getTime();
            const differenceInMinutes = differenceInMillis / (1000 * 60);
            return differenceInMinutes;
        }
        
        const startDate = new Date(selectedStartDate);
        const endDate = new Date(selectedEndDate);
        
        const minutesDifference = calculateMinutesDifference(startDate, endDate);

        if(minutesDifference >= e.target.value){
            setDuration(e.target.value)
        }
    }

    const onHandlerMethod = (value) => {
        setSelectedMethod(value)
        setIsMix(false)
        setIsVariant(false)

        if (value == 'blueprint') {
            setIsMix(true)
            setIsMixDisable(true)
            setIsVariantDisable(true)
            setVariantCountDisable(true)
        } else {
            setIsMixDisable(false)
            setIsVariantDisable(false)
            setVariantCountDisable(false)
        }
    }

    const pageSizeDropdownChange = (value) => {
        setSelectedPageSize(value)
    }

    const onVariantCountHandler = (e) => {
        setVariantCount(e.target.value)
        setIsVariant(true)
    }

    const descriptionHandler = (event) => {
        setDescriptionValue(event.target.value);
    }

    const repeatExamInputChange = (event) => {
        setRepeatCount(event.target.value);
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

        if (!selectedStartDate) {
            showMessage(t('errorMessage.selectExamStartDuration'), false)
            return
        }

        if (!selectedEndDate) {
            showMessage(t('errorMessage.selectExamEndDuration'), false)
            return
        }

        if (!selectedExamTemplateId && !duration) {
            showMessage(t('errorMessage.enterExamMinutes'), false)
            return
        }

        if (viewType == 'INTEGRATED' && selectedGroupIds && selectedGroupIds.length == 0) {
            showMessage(t('errorMessage.selectGroups'), false)
            return
        }

        if (!selectedExamTemplateId && !selectedMethod) {
            showMessage(t('errorMessage.selectExamMethod'), false)
            return
        }

        if (!selectedExamTemplateId && !selectedPageSize) {
            showMessage(t('errorMessage.selectExamPageSize'), false)
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

        if(isRepeat){
            if(!isInfinite){
                if(!repeatCount){
                    showMessage(t('errorMessage.enterRepeatCount'), false)
                    return
                }
            }
        }

        let params = {
            school: selectedSchoolId ? selectedSchoolId : selectedSchool.id,
            schoolName: schoolName,
            grade: selectedGradeId,
            gradeName,
            subject: selectedSubjectId,
            subjectCode,
            subjectName,
            template: selectedExamTemplateId ? selectedExamTemplateId : '',
            parentTopics: JSON.stringify(selectedParentTopicIds),
            name: selectedName,
            viewType,
            groups: JSON.stringify(selectedGroupIds),
            start: selectedStartDate,
            end: selectedEndDate,
            duration: duration,
            method: selectedMethod,
            shuffle: isMix ? 1 : 0,
            variant: isVariant ? 1 : 0,
            variantCount: variantCount,
            size: selectedPageSize,
            description: descriptionValue,
            repeat: isRepeat ? 1 : 0,
            repeatCount: repeatCount,
            limitless: isInfinite ? 1 : 0,
            selectedSchool: selectedSchoolId,
            selectedClasses: JSON.stringify(classes)
        }

        setLoading(true)
        fetchRequest(examAddSubmit, 'POST', params)
            .then((res) => {
                if (res.success) {
                    const { id = null } = res

                    history.push({
                        pathname: '/online-exam/exam-edit',
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
                                <div className="d-flex flex-row justify-content-end align-items-center mb-3">
                                    <span className="modal-select-title mr-4">{t("menu.examTemplate")}</span>
                                    <Select
                                        className='modal-select-lg'
                                        clearable
                                        searchable
                                        options={examTemplateOptions}
                                        value={selectedExamTemplateId}
                                        onChange={(value) => templateDropdownChange(value)}
                                    />
                                </div>
                                <div className="d-flex flex-row justify-content-end align-items-center mb-3">
                                    <span className="modal-select-title mr-4">{t("question.topic")}</span>
                                    <Select
                                        disabled={selectedExamTemplateId ? true : false}
                                        className='modal-select-lg'
                                        clearable
                                        searchable
                                        multiple
                                        options={parentTopicOptions}
                                        value={selectedParentTopicIds || []}
                                        onChange={(value) => parentTopicDropdownChange(value)}
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
                                }
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
                                <div className="d-flex flex-row justify-content-end align-items-center mb-3">
                                    <span className="modal-select-title mr-4">
                                        {t("menu.examLength") + '*'}
                                    </span>
                                    <input
                                        type='number'
                                        disabled={selectedExamTemplateId ? true : false}
                                        value={duration}
                                        className="modal-input-lg"
                                        onChange={onDurationHandler}
                                    />
                                </div>

                                <div className="d-flex flex-row justify-content-end align-items-center mb-3">
                                    <span className="modal-select-title mr-4">{t("examTemplate.method")}</span>
                                    <Select
                                        disabled={selectedExamTemplateId ? true : false}
                                        className='modal-select-lg'
                                        clearable
                                        searchable
                                        options={methodOptions}
                                        value={selectedMethod}
                                        onChange={(value) => onHandlerMethod(value)}
                                    />
                                </div>

                                <div className="d-flex flex-row justify-content-end mb-3">
                                    <div className="d-flex flex-column modal-select-lg">
                                        <CheckBoxButton
                                            disabled={isMixDisable ? true : false}
                                            label={t("examTemplate.isMix")}
                                            checked={isMix}
                                            onCheck={() => setIsMix(!isMix)}
                                        />
                                    </div>
                                </div>

                                <div className="d-flex flex-row justify-content-end mb-3">
                                    <div className="d-flex flex-column modal-select-lg">
                                        <CheckBoxButton
                                            disabled={isVariantDisable ? true : false}
                                            label={t("examTemplate.isVariant")}
                                            checked={isVariant}
                                            onCheck={() => setIsVariant(!isVariant)}
                                        />
                                    </div>
                                </div>

                                {
                                    isVariant
                                    ?
                                        <div className="d-flex flex-row justify-content-end align-items-center mb-3">
                                            <span className="modal-select-title mr-4">
                                                {t("examTemplate.variantCount")}
                                            </span>
                                            <input
                                                disabled={variantCountDisable ? true : false}
                                                value={variantCount}
                                                className="modal-input-lg"
                                                inputMode='numeric'
                                                type='number'
                                                onChange={(e) => {
                                                    const re = /^[0-9\b]+$/;
                                                    if (e.target.value === '' || re.test(e.target.value)) {
                                                        onVariantCountHandler(e);
                                                    }
                                                }}
                                            />
                                        </div>
                                    : null
                                }
                                
                                <div className="d-flex flex-row justify-content-end align-items-center mb-3">
                                    <span className="modal-select-title mr-4">
                                        {t("examTemplate.pageSize")}
                                    </span>
                                    <Select
                                        disabled={selectedExamTemplateId ? true : false}
                                        className='modal-select-lg'
                                        clearable
                                        searchable
                                        options={pageSizeOptions}
                                        value={selectedPageSize}
                                        onChange={(value) => pageSizeDropdownChange(value)}
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
                                        <CheckBoxButton
                                            className='mt-2'
                                            label={t("exam.repeatAllowed")}
                                            checked={isRepeat}
                                            onCheck={() => setIsRepeat(!isRepeat)}
                                        />
                                    </div>
                                </div>
                                {
                                    isRepeat &&
                                    <div className="d-flex flex-row justify-content-end mb-3">
                                        <span
                                            className="modal-select-title mr-4"
                                            style={{ marginTop: 10 }}
                                        >
                                            {t("exam.repeatNumber")}*
                                        </span>
                                        <div className="d-flex flex-column">
                                            <input
                                                type='number'
                                                value={repeatCount}
                                                className="modal-input-lg"
                                                onChange={repeatExamInputChange}
                                            />
                                            <CheckBoxButton
                                                className='mt-2'
                                                label={t("common.unlimited")}
                                                checked={isInfinite}
                                                onCheck={() => setIsInfinite(!isInfinite)}
                                            />
                                        </div>
                                    </div>
                                }
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
