import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button, Card } from "react-bootstrap";
import CheckBoxButton from "components/buttons/CheckBoxButton";
import HtmlHead from "components/html-head/HtmlHead";
import DatePicker from "modules/Form/DatePicker";
import Select from "modules/Form/Select";
import { fetchRequest } from "utils/fetchRequest";
import showMessage from "modules/message";
import { useSelector } from "react-redux";
import { examAddSubmit, examAddInit, examTemplateGradeSubject, webinarCreate } from 'utils/fetchRequest/Urls';
import { toDropdownData } from "utils/utils";

export default function EditWebinar() {
    const { t } = useTranslation();
    const history = useHistory();

    const { selectedSchool } = useSelector(state => state.schoolData);

    const [gradeOptions, setGradeOptions] = useState([])
    const [subjectOptions, setSubjectOptions] = useState([])
    const [classOptions, setClassOptions] = useState([])
    const [selectedGroupIds, setSelectedGroupIds] = useState([])
    const [loading, setLoading] = useState(false)
    const [isRepeat, setIsRepeat] = useState(false)
    const [isInfinite, setIsInfinite] = useState(false)
    const [isOpen, setIsOpen] = useState(false)
    const [studentCount, setStudentCount] = useState(0)
    const [userCount, setUserCount] = useState(0)

    const [descriptionValue, setDescriptionValue] = useState('')
    const [selectedName, setSelectedName] = useState('')
    const [viewType, setViewType] = useState('INTEGRATED')

    const [name, setName] = useState('')
    const [selectedGradeId, setSelectedGradeId] = useState(null)
    const [selectedSubjectId, setSelectedSubjectId] = useState(null)
    const [selectedClassIds, setSelectedClassIds] = useState(null)
    const [selectedStartDate, setSelectedStartDate] = useState(null)

    const title = t('webinar.create');
    const description = "";

    const init = (params) => {
        setLoading(true)
        fetchRequest(webinarCreate, 'POST', params)
            .then((res) => {
                if (res.success) {
                    const { grades = [], subjects = [] } = res;

                    if (params.grade) {
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
                    
                    // setClassOptions(toDropdownData(classes, 'id', 'name'))
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
            school: selectedSchool.id,
            submit: 0,
            isOpen: isOpen ? 1 : 0
        }

        init(params);
    }, []);

    const onHandlerNameChange = (e) => {
        setName(e.target.value)
    }

    const gradeDropdownChange = (value) => {
        setSelectedGradeId(value)
        let params = {
            school: selectedSchool.id,
            grade: value,
            isGradeFlat: 1
        }

        init(params);
    }

    const subjectDropdownChange = (value) => {
        setSelectedSubjectId(value)

        let params = {
            school: selectedSchool.id,
            grade: selectedGradeId,
            submit: 0,
            isOpen: isOpen ? 1 : 0
        }

        getData(params);
    }

    const descriptionHandler = (event) => {
        setDescriptionValue(event.target.value);
    }

    const handleSave = () => {
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
            showMessage(t('errorMessage.selectExamDuration'), false)
            return
        }

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

        let params = {
            school: selectedSchool.id,
            grade: selectedGradeId,
            subject: selectedSubjectId,
            name: selectedName,
            start: selectedStartDate,
            groups: JSON.stringify(selectedGroupIds),
        }

        setLoading(true)
        fetchRequest(webinarCreate, 'POST', params)
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
                            <div className="w-100 flex-column d-flex justify-content-end modal-padding-right-36">
                                <div className="d-flex flex-row justify-content-end align-items-center mb-3">
                                    <span className="modal-select-title mr-4">{t("webinar.name") + '*'}</span>
                                    <input
                                        value={name}
                                        className="modal-input-lg"
                                        onChange={onHandlerNameChange}
                                    />
                                </div>
                                <div className="d-flex flex-row justify-content-end mb-3">
                                    <div className="d-flex flex-column modal-select-lg">
                                        <CheckBoxButton
                                            label={t("webinar.isOpen")}
                                            checked={isOpen}
                                            onCheck={() => setIsOpen(!isOpen)}
                                        />
                                    </div>
                                </div>
                                <div className="d-flex flex-row justify-content-end align-items-center mb-3">
                                    <span className="modal-select-title mr-4">{t("webinar.grade")}*</span>
                                    <Select
                                        className='modal-select-lg'
                                        clearable
                                        searchable
                                        options={gradeOptions}
                                        value={selectedGradeId}
                                        onChange={(value) => gradeDropdownChange(value)}
                                    />
                                </div>
                                {
                                    !isOpen &&
                                    <>
                                        <div className="d-flex flex-row justify-content-end align-items-center mb-1">
                                            <span className="modal-select-title mr-4">{t("webinar.onlineLesson")}*</span>
                                            <Select
                                                className='modal-select-lg'
                                                clearable
                                                searchable
                                                multiple
                                                options={subjectOptions}
                                                value={selectedSubjectId}
                                                onChange={(value) => subjectDropdownChange(value)}
                                            />
                                        </div>
                                        <div className="d-flex flex-row justify-content-end align-items-center mb-3">
                                            <div style={{width: 350}}>{t('webinar.label.users') + ': ' + userCount}</div>
                                        </div>
                                    </>
                                }
                                {
                                    isOpen &&
                                    <>
                                        <div className="d-flex flex-row justify-content-end align-items-center mb-1" style={{position: 'relative', left: 358}}>
                                            <span className="modal-select-title mr-4">{t("webinar.onlineLesson")}*</span>
                                            <Select
                                                className='modal-select-lg'
                                                clearable
                                                searchable
                                                multiple
                                                options={subjectOptions}
                                                value={selectedSubjectId}
                                                onChange={(value) => subjectDropdownChange(value)}
                                            />
                                            <Select
                                                className='modal-select-lg ml-2'
                                                clearable
                                                searchable
                                                multiple
                                                options={subjectOptions}
                                                value={selectedSubjectId}
                                                onChange={(value) => subjectDropdownChange(value)}
                                            />
                                        </div>
                                        <div className="d-flex flex-row justify-content-end align-items-center mb-3">
                                            <div style={{width: 350}}>{t('webinar.label.users') + ': ' + studentCount}</div>
                                        </div>
                                    </>
                                }
                                <div className="d-flex flex-row justify-content-end mb-3">
                                    <span className="modal-select-title mr-4">{t("webinar.introduction")}</span>
                                    <div className="d-flex flex-column">
                                        <textarea
                                            rows={3}
                                            className="modal-input-lg text-area"
                                            onChange={descriptionHandler}
                                        />
                                    </div>
                                </div>
                                <div className="d-flex flex-row justify-content-end align-items-center mb-3">
                                    <span className="modal-select-title mr-4">
                                        {t("webinar.startDate") + '*'}
                                    </span>
                                    <DatePicker
                                        showTimeInput={true}
                                        className='datepicker-style'
                                        selectedDate={selectedStartDate}
                                        wrapperClassName='w-100 w-350 datepicker-default-border'
                                        onChange={(date) => {
                                            setSelectedStartDate(date)
                                        }}
                                    />
                                </div>
                            </div>
                        </Card.Body>
                        <Card.Footer>
                            <div className="text-center">
                                <Button className='cancel-button' variant='link' onClick={() => history.goBack()}>
                                    <span style={{ color: '#ff2f1a' }}>{t('common.cancel')}</span>
                                </Button>
                                <Button className='save-button' variant='empty' onClick={handleSave} style={{background: '#3EBFA3'}}>
                                    <span style={{ color: '#000000' }}>{t('webinar.label.create').toUpperCase()}</span>
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
