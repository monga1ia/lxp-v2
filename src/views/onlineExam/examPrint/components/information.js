import React, { useEffect, useState, useRef } from "react";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button, Card } from "react-bootstrap";
import Forms from "modules/Form/Forms";
import showMessage from "modules/message";
import { fetchRequest } from "utils/fetchRequest";
import { examEditInit } from 'utils/fetchRequest/Urls';
import { toDropdownData } from "utils/utils";
import { useSelector } from "react-redux";
import HtmlHead from "components/html-head/HtmlHead";

export default function examEdit({
    id = null,
    tabCode = '',
    onChangeTabAction
}) {
    const history = useHistory()
    const { t } = useTranslation()
    const formRef = useRef();
    const { selectedSchool } = useSelector(state => state.schoolData);
    const [loading, setLoading] = useState()
    const [templateOptions, setTemplateOptions] = useState([])
    const [groupOptions, setGroupOptions] = useState([])
    const [classOptions, setClassOptions] = useState([])
    const [selectedParentTopicIds, setSelectedParentTopicIds] = useState([])
    const [parentTopicOptions, setParentTopicOptions] = useState([])
    const [repeatCount, setRepeatCount] = useState('')
    const [variantCount, setVariantCount] = useState('')
    const [selectedTemplateId, setSelectedTemplateId] = useState(null)
    const [selectedMethod, setSelectedMethod] = useState(null)
    const [selectedPageSize, setSelectedPageSize] = useState(null)
    const [isMix, setIsMix] = useState(false)
    const [isVariant, setIsVariant] = useState(false)
    const [isRepeat, setIsRepeat] = useState(false)
    const [isInfinite, setIsInfinite] = useState(false)
    const [examData, setExamData] = useState(null)
    const [startDate, setStartDate] = useState(null)
    const [endDate, setEndDate] = useState(null)
    const [viewType, setViewType] = useState(null)
    const [selectedClassIds, setSelectedClassIds] = useState(null)

    const title = t('examTemplate.create');
    const description = "";

    const init = (params) => {
        setLoading(true)
        fetchRequest(examEditInit, 'POST', params)
            .then((res) => {
                if (res.success) {
                    const { exam = null, groups, classes, topics } = res

                    if(exam?.method){
                        setSelectedMethod(exam.method.toLowerCase())
                    }

                    setViewType(exam?.viewType)
                    setGroupOptions(toDropdownData(groups, 'id', 'name'))
                    setClassOptions(toDropdownData(classes, 'id', 'name'))
                    setParentTopicOptions(toDropdownData(topics, 'id', 'name'))
                    setStartDate(exam?.startDate)
                    setEndDate(exam?.endDate)
                    setExamData(exam)
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
            exam: id,
            submit: 0
        }

        if(tabCode == 'INFORMATION'){
            init(params);
        }
    }, []);

    const classDropdownChange = (value) => {
        setSelectedClassIds(value)
    }

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

    const onDateRangeChange = (dates) => {
        if(dates && dates.length > 0){
            if(dates[0].startDate){
                setStartDate(dates[0].startDate)
            }
            if(dates[0].endDate){
                setEndDate(dates[0].endDate)
            }
        }
    };

    const fields = [
        {
            key: 'schoolName',
            label: t('school.title'),
            value: examData?.schoolName || '',
            type: 'text',
            disabled: true,
            labelStyle: {
                fontFamily: 'PinnacleDemiBold',
                fontSize: 12,
                fontWeight: 800,
                color: '#575962',
            },
        },
        {
            key: 'grade',
            label: t('exam.level'),
            value: examData?.gradeName || '',
            type: 'text',
            disabled: true,
            labelStyle: {
                fontFamily: 'PinnacleDemiBold',
                fontSize: 12,
                fontWeight: 800,
                color: '#575962',
            },
        },
        {
            key: 'subject',
            label: t('exam.subject'),
            value: examData?.subjectName + ' (' + examData?.subjectCode + ')' || '',
            type: 'text',
            disabled: true,
            labelStyle: {
                fontFamily: 'PinnacleDemiBold',
                fontSize: 12,
                fontWeight: 800,
                color: '#575962',
            },
        },
        {
            key: 'name',
            label: t('menu.examName') + '*',
            value: examData?.name || '',
            type: 'text',
            required: true,
            errorMessage: t('errorMessage.enterName'),
            labelStyle: {
                fontFamily: 'PinnacleDemiBold',
                fontSize: 12,
                fontWeight: 800,
                color: '#575962',
            },
        },
        {
            key: 'ids',
            label: viewType == 'INTEGRATED' ? t('menu.mainGroup') + '*' : t('menu.group') + '*',
            value: viewType == 'INTEGRATED' ? examData?.groupIds : examData?.classIds, 
            type: 'dropdown',
            options: viewType == 'INTEGRATED' ? groupOptions : classOptions,
            required: true,
            multiple: true,
            clearable: true,
            errorMessage: viewType == 'INTEGRATED' ? t('errorMessage.selectGroups') : t('errorMessage.selectGroup'),
            labelStyle: {
                fontFamily: 'PinnacleDemiBold',
                fontSize: 12,
                fontWeight: 800,
                color: '#575962',
            },
            onChange: classDropdownChange
        },
        {
            key: 'date',
            label: t('menu.examDate') + '*',
            value: examData?.duration || '',  
            type: 'daterange',
            required: true,
            selectedStartDate: startDate ? startDate : null,
            selectedEndDate: endDate ? endDate : null,
            firstPlaceHolder: t('common.startDate'),
            lastPlaceHolder: t('common.endDate'),
            onChange: onDateRangeChange,
            errorMessage: t('errorMessage.enterMinute'),
            showTimeSelect: true,
            labelStyle: {
                fontFamily: 'PinnacleDemiBold',
                fontSize: 12,
                fontWeight: 800,
                color: '#575962',
            },
        },
        {
            key: 'duration',
            label: t('menu.examLength') + '*',
            value: examData?.duration || '',  
            type: 'numberOnly',
            required: true,
            errorMessage: t('errorMessage.enterMinute'),
            labelStyle: {
                fontFamily: 'PinnacleDemiBold',
                fontSize: 12,
                fontWeight: 800,
                color: '#575962',
            },
        },
        {
            key: 'description',
            label: t('common.description') + '*',
            value: examData?.description || '',
            alignItems: 'top',
            type: 'textArea',
            rows: 4,
            required: false,
            labelStyle: {
                fontFamily: 'PinnacleDemiBold',
                fontSize: 12,
                fontWeight: 800,
                color: '#575962',
            },
        }
    ];

    useEffect(() => {
        formRef?.current?.updateFields && formRef.current?.updateFields(fields);
    }, [examData, viewType]);

    const onSubmit = () => {
        const [formsValid, formValues] = formRef.current.validate();
        if(formsValid){
            let name = '';
            let duration = null;
            let description = null;

            for(let i = 0; i < formValues.length; i++){
                if(formValues[i].key == 'name'){
                    name = formValues[i].value;
                }

                if(formValues[i].key == 'duration'){
                    duration = formValues[i].value;
                }

                if(formValues[i].key == 'description'){
                    description = formValues[i].value;
                }
            }

            const params = {
                school: selectedSchool.id,
                exam: id,
                grade: examData.grade,
                gradeName: examData.Name,
                subject: examData.subject,
                subjectCode: examData.subjectCode,
                subjectName: examData.subjectName,
                start: startDate,
                end: endDate,
                name,
                duration,
                description,
                submit: 1,
                selectedClasses: JSON.stringify(classes)
            };

            setLoading(true)
            fetchRequest(examEditInit, 'POST', params)
                .then((res) => {
                    if (res.success) {
                        showMessage(res.message, true)
                        onChangeTabAction()
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
    }

    const handlerBackAction = () => {
        history.push('/online-exam/print-exam')
    }

    return (
        <>
            <HtmlHead title={title} description={description} />

            <div className="screen-padding">
                <Card>
                    <Card.Body>
                        <Forms 
                            ref={formRef} 
                            fields={fields} 
                        />
                    </Card.Body>
                    <Card.Footer>
                        <div className="text-center">   
                            <Button className='cancel-button' variant='link' onClick={() => handlerBackAction()}>
                                <span style ={{color: '#ff2f1a'}}>{t('common.back_to_list')}</span> 
                            </Button>
                            <Button className='proceed-button' variant = 'empty' onClick={onSubmit}>
                                <span style ={{color: '#000000'}}>{t('common.save').toUpperCase()}</span>
                            </Button>
                        </div>
                    </Card.Footer>
                </Card>
            </div>
            {
                loading &&
                <>
                    <div className='loader-container'>
                        <svg className="splash-spinner" viewBox="0 0 50 50">
                            <circle className="path" cx="25" cy="25" r="20" fill="none" strokeWidth="5"/>
                        </svg>
                    </div>
                </>
            }
        </>
    );
}
