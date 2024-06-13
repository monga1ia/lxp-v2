import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button, Card, Row } from "react-bootstrap";
import { makeStyles } from "@material-ui/core";
import CheckBoxButton from "components/buttons/CheckBoxButton";
import HtmlHead from "components/html-head/HtmlHead";
import DatePicker from "modules/Form/DatePicker";
import Select from "modules/Form/Select";
import { fetchRequest } from "utils/fetchRequest";
import { toDropdownData } from "utils/utils";
import showMessage from "modules/message";
import { useSelector } from "react-redux";
import { Plus, Minus } from 'lucide-react';
import { examAddSubmit, examAddInit, examTemplateGradeSubject, webinarCreate } from 'utils/fetchRequest/Urls';


const useStyles = makeStyles({
    rowLabel: {
        display: 'flex',
        // flex: '1 1 0%',
        // width: 'auto',
        width: '37%',
        justifyContent: 'flex-end',
        alignItems: 'center',
        marginBottom: 0,
        
        fontWeight: 'bold'
    },
    rowComponent: {
        display: 'flex',
        flex: 1,
        flexDirection: 'column',
        marginLeft: 10,
        width: 'auto',
    },
    rowBlank: {
        display: 'flex',
        flex: 0.8,
        flexDirection: 'column',
        marginLeft: 10,
        width: 'auto',
    },
    rowBlankSmall: {
        display: 'flex',
        flex: 0.3,
        flexDirection: 'column',
        marginLeft: 10,
        width: 'auto',
    }
});

export default function CreateWebinar() {
    const { t } = useTranslation();
    const history = useHistory();
    const style = useStyles();

    const { selectedSchool } = useSelector(state => state.schoolData);

    const [gradeOptions, setGradeOptions] = useState([])
    const [courseOptions, setCourseOptions] = useState([])
    const [classOptions, setClassOptions] = useState([])
    const [gradeList, setGradeList] = useState([
        {
            index: 0,
            gradeOptions: [],
            classOptions: [],
            selectedGradeId: null,
            selectedClassIds: []
        }
    ])
    const [selectedGroupIds, setSelectedGroupIds] = useState([])
    const [loading, setLoading] = useState(false)
    const [isOpen, setIsOpen] = useState(false)
    const [studentCount, setStudentCount] = useState(0)
    const [userCount, setUserCount] = useState(0)
    const [descriptionValue, setDescriptionValue] = useState('')
    const [name, setName] = useState('')
    const [selectedGradeId, setSelectedGradeId] = useState(null)
    const [selectedCourseIds, setSelectedCourseIds] = useState([])
    const [selectedClassIds, setSelectedClassIds] = useState(null)
    const [selectedStartDate, setSelectedStartDate] = useState(null)

    const title = t('webinar.create');
    const description = "";

    const init = (params, hasOpen, index) => {
        setLoading(true)
        fetchRequest(webinarCreate, 'POST', params)
            .then((res) => {
                if (res.success) {
                    const { grades = [], courses = [], classes = [] } = res;

                    if(hasOpen){
                        let cloneGradeList = [...gradeList]

                        if(cloneGradeList && cloneGradeList.length > 0){
                            let classList = []
                            if(classes && classes.length > 0){
                                for(let i = 0; i < classes.length; i++){
                                    classList.push({
                                        value: classes[i].id,
                                        text: classes[i].name,
                                        studentCount: classes[i].studentCount,
                                    })
                                }
                            }
                            cloneGradeList[index].classOptions = classList
                        }

                        setGradeList(cloneGradeList)
                    } else {
                        if (params.grade) {
                            setCourseOptions(toDropdownData(courses, 'id', 'name', 'userCount'))
                        } else {
                            setGradeOptions(grades);
                        }
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

    const gradeDropdownChange = (value, hasOpen, index) => {
        if(hasOpen){
            let cloneGradeList = [...gradeList]

            if(cloneGradeList && cloneGradeList.length > 0){
                cloneGradeList[index].selectedGradeId = value
            }

            setGradeList(cloneGradeList)
        } else {
            setSelectedGradeId(value)
        }
        
        let params = {
            school: selectedSchool.id,
            grade: value,
            submit: 0,
            isOpen: hasOpen ? 1 : 0,
        }

        init(params, hasOpen, index);
    }

    const courseDropdownChange = (valueIds) => {
        if(valueIds == valueIds){
            let counter = 0;

            if(valueIds && valueIds.length > 0){
                for(let i = 0; i < valueIds.length; i++){
                    let valueObj = courseOptions.find(data => data.value = valueIds[i])

                    if(valueObj){
                        counter = counter + valueObj.userCount
                    }
                }
            }

            setUserCount(counter)
        } else {
            setUserCount(0)
        }
        setSelectedCourseIds(valueIds)
    }

    const classDropdownChange = (valueIds, index) => {
        let cloneGradeList = [...gradeList]
        cloneGradeList[index].selectedClassIds = valueIds

        if(gradeList && gradeList.length > 0){
            let classList = []
            let selectedIds = []
            for(let i = 0; i < gradeList.length; i++){
                if(gradeList[i].classOptions && gradeList[i].classOptions.length > 0){
                    let options = gradeList[i].classOptions;

                    for(let p = 0; p < options.length; p++){
                        classList.push(options[p])
                    }
                }
                
                if(gradeList[i].selectedClassIds && gradeList[i].selectedClassIds.length > 0){
                    let ids = gradeList[i].selectedClassIds;

                    for(let p = 0; p < ids.length; p++){
                        selectedIds.push(ids[p])
                    }
                }
            }

            if(valueIds && valueIds.length > 0){
                for(let p = 0; p < valueIds.length; p++){
                    let existing = selectedIds.find(data => data == valueIds[p])

                    if(!existing){
                        selectedIds.push(valueIds[p])
                    }
                }
            }

            if(selectedIds && selectedIds.length > 0){
                let counter = 0;

                for(let i = 0; i < selectedIds.length; i++){
                    let valueObj = classList.find(data => data.value == selectedIds[i])

                    if(valueObj){
                        counter = counter + valueObj.studentCount
                    }
                }

                setStudentCount(counter)    
            } else {
                setStudentCount(0)    
            }
            
        }
        
        setGradeList(cloneGradeList)
    }

    const descriptionHandler = (event) => {
        setDescriptionValue(event.target.value);
    }

    const onHandlerIsOpen = () => {
        if(isOpen){
            setSelectedGradeId(null)
        } else {
            setGradeList([{
                index: 0,
                gradeOptions: gradeOptions,
                classOptions: [],
                selectedGradeId: null,
                selectedClassIds: []
            }])
        }
        setIsOpen(!isOpen)
    } 

    const handleSave = () => {
        if(!isOpen){
            if (!name) {
                showMessage(t('webinar.errorMessage.insertName'), false)
                return
            }

            if (!selectedGradeId) {
                showMessage(t('errorMessage.selectGrade'), false)
                return
            }

            if (selectedCourseIds.length == 0) {
                showMessage(t('webinar.errorMessage.selectCourse'), false)
                return
            }

            if (!selectedStartDate) {
                showMessage(t('webinar.errorMessage.selectStartDate'), false)
                return
            }
        } else {
            if (!name) {
                showMessage(t('webinar.errorMessage.insertName'), false)
                return
            }

            if (!selectedStartDate) {
                showMessage(t('webinar.errorMessage.selectStartDate'), false)
                return
            }

            if(gradeList && gradeList.length > 0){
                for(let i = 0; i < gradeList.length; i++){
                    if(gradeList[i].selectedGradeId){
                        if(gradeList[i].selectedClassIds.length == 0){
                            showMessage(t('webinar.errorMessage.selectClasses'))
                            return
                        }
                    } else {
                        showMessage(t('errorMessage.selectGrade'))
                        return
                    }

                    let existing = gradeList.find(data => data.selectedGradeId == gradeList[i].selectedGradeId && data.index != gradeList[i].index)

                    if(existing){
                        showMessage(t('webinar.errorMessage.existingClass'))
                        return
                    }
                }
            } else {
                showMessage(t('errorMessage.bug'))
                return
            }
        }

        let gradeName = gradeOptions.find(parentTopicObj => {
            return parentTopicObj?.value === selectedGradeId
        })?.text;

        let classes = []
        
        for (let i = 0; i < gradeList.length; i++) {
            if(gradeList[i].selectedClassIds && gradeList[i].selectedClassIds.length > 0){
                let classIds = gradeList[i].selectedClassIds;

                for(let c = 0; c < classIds.length; c++){
                    let className = gradeList[i].classOptions.find(data => {
                        return data?.value === classIds[c]
                    })?.text;        

                    classes.push({
                        gradeId: gradeList[i].selectedGradeId,
                        id: classIds[c],
                        name: className
                    })
                }
            }
        }
        
        let params = {
            school: selectedSchool.id,
            submit: 1,
            isOpen: isOpen ? 1 : 0,
            grade: selectedGradeId,
            gradeName: gradeName,
            name: name,
            description: descriptionValue,
            startTime: selectedStartDate,
            classes: JSON.stringify(classes),
            courses: selectedCourseIds,
        }

        setLoading(true)
        fetchRequest(webinarCreate, 'POST', params)
            .then((res) => {
                if (res.success) {
                    history.push({
                        pathname: '/webinar/index',
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

    const onHandlerBack = () => {
        history.push({
            pathname: '/webinar/index',
        })
    }

    const addRow = () => {
        let cloneList = [...gradeList]

        if(cloneList && cloneList.length > 0){
            cloneList.push({
                index: gradeList.length + 1,
                gradeOptions: cloneList[0].gradeOptions,
                classOptions: [],
                selectedGradeId: null,
                selectedClassIds: []
            })
        }
        
        setGradeList(cloneList)
    }

    const removeRow = (index) => {
        const cloneList = [...gradeList];
        cloneList.splice(index, 1);
        setGradeList(cloneList)
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
                            <div className="w-100 flex-column d-flex">
                                <Row style={{ display: 'flex', marginTop: '0.8rem' }}>
                                    <label className={style.rowLabel}>
                                        {t('webinar.name') + "*"}
                                    </label>
                                    <div className={style.rowComponent}>
                                        <input
                                            value={name}
                                            className="modal-input-lg"
                                            onChange={onHandlerNameChange}
                                        />
                                    </div>
                                    <div className={style.rowBlank} />
                                </Row>
                                <Row style={{ display: 'flex', marginTop: '0.8rem' }}>
                                    <label className={style.rowLabel}/>
                                    <div className={style.rowComponent}>
                                        <CheckBoxButton
                                            label={t("webinar.isOpen")}
                                            checked={isOpen}
                                            onCheck={() => onHandlerIsOpen()}
                                        />
                                    </div>
                                    <div className={style.rowBlank} />
                                </Row>
                                {
                                    !isOpen &&
                                    <>
                                        <Row style={{ display: 'flex', marginTop: '0.8rem' }}>
                                            <label className={style.rowLabel}>
                                                {t("webinar.grade")}*
                                            </label>
                                            <div className={style.rowComponent}>
                                                <Select
                                                    className='modal-select-lg'
                                                    clearable
                                                    searchable
                                                    options={gradeOptions}
                                                    value={selectedGradeId}
                                                    onChange={(value) => gradeDropdownChange(value)}
                                                />
                                            </div>
                                            <div className={style.rowBlank} />
                                        </Row>
                                        <Row style={{ display: 'flex', marginTop: '0.8rem' }}>
                                            <label className={style.rowLabel}>
                                                {t("webinar.onlineLesson")}*
                                            </label>
                                            <div className={style.rowComponent}>
                                                <Select
                                                    className='modal-select-lg'
                                                    clearable
                                                    searchable
                                                    multiple
                                                    options={courseOptions}
                                                    value={selectedCourseIds}
                                                    onChange={(value) => courseDropdownChange(value)}
                                                />
                                            </div>
                                            <div className={style.rowBlank} />
                                        </Row>
                                        <Row style={{ display: 'flex', marginTop: '0.2rem' }}>
                                            <label className={style.rowLabel}/>
                                            <div className={style.rowComponent}>
                                                {t('webinar.label.users') + ': ' + userCount}
                                            </div>
                                            <div className={style.rowBlank} />
                                        </Row>
                                    </>
                                }
                                {
                                    isOpen &&
                                    <>
                                        {
                                            gradeList && gradeList.length &&
                                            gradeList.map((data, i) => {
                                                return (
                                                    <Row key={'grade_list_' + i} style={{ display: 'flex', marginTop: '0.8rem' }}>
                                                        {
                                                            i == 0 
                                                            ?
                                                                <label className={style.rowLabel}>
                                                                    {t("webinar.grade")}*
                                                                </label>
                                                            :
                                                                <label className={style.rowLabel}/>
                                                        }
                                                        <div className={style.rowComponent} style={{flexDirection: 'row'}}>
                                                            <Select
                                                                className='modal-select-auto'
                                                                clearable
                                                                searchable
                                                                options={gradeOptions}
                                                                value={data.selectedGradeId || null}
                                                                onChange={(value) => gradeDropdownChange(value, isOpen, i)}
                                                            />
                                                            <Select
                                                                className='modal-select-auto ml-2'
                                                                clearable
                                                                searchable
                                                                multiple
                                                                options={data.classOptions || []}
                                                                value={data.selectedClassIds || []}
                                                                onChange={(value) => classDropdownChange(value, i)}
                                                            />
                                                            <div>
                                                                {
                                                                    i == 0
                                                                    ?
                                                                        <Button
                                                                            onClick={(e) => addRow(e, data)}
                                                                            variant="success"
                                                                            className="btn-icon-only position-relative ml-2"
                                                                            size="sm"
                                                                            style={{height: 36, width: 36, background: '#3EBFA3', top: 1}}
                                                                        >
                                                                            <Plus size={25} style={{position: 'relative', right: 2}}/>
                                                                        </Button>
                                                                    : 
                                                                        <Button
                                                                            onClick={(e) => removeRow(i)}
                                                                            variant="success"
                                                                            className="btn-icon-only position-relative ml-2"
                                                                            size="sm"
                                                                            style={{height: 36, width: 36, background: '#E13847', top: 1}}
                                                                        >
                                                                            <Minus size={25} style={{position: 'relative', right: 2}}/>
                                                                        </Button>    
                                                                }
                                                            </div>
                                                        </div>
                                                        <div className={style.rowBlankSmall} />
                                                    </Row>
                                                )
                                            })
                                        }
                                        <Row style={{ display: 'flex', marginTop: '0.2rem' }}>
                                            <label className={style.rowLabel}/>
                                            <div className={style.rowComponent}>
                                                {t('webinar.label.students') + ': ' + studentCount}
                                            </div>
                                            <div className={style.rowBlank} />
                                        </Row>
                                    </>
                                }
                                <Row style={{ display: 'flex', marginTop: '0.8rem' }}>
                                    <label className={style.rowLabel} style={{alignItems: 'start'}}>
                                        {t("webinar.introduction")}
                                    </label>
                                    <div className={style.rowComponent}>
                                        <textarea
                                            rows={3}
                                            className="modal-input-lg text-area"
                                            onChange={descriptionHandler}
                                        />
                                    </div>
                                    <div className={style.rowBlank} />
                                </Row>
                                <Row style={{ display: 'flex', marginTop: '0.8rem' }}>
                                    <label className={style.rowLabel}>
                                        {t("webinar.startDate")}*
                                    </label>
                                    <div className={style.rowComponent}>
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
                                    <div className={style.rowBlank} />
                                </Row>
                            </div>
                        </Card.Body>
                        <Card.Footer>
                            <div className="text-center">
                                <Button className='cancel-button' variant='link' onClick={() => onHandlerBack()}>
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
