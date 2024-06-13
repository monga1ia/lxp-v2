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
import { DateRange } from "@mui/icons-material";

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
    const [dateRange, setDateRange] = useState(null)
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
    // const [selectedName, setSelectedName] = useState('')
    // const [selectedDuration, setSelectedDuration] = useState('')
    const [repeatCount, setRepeatCount] = useState('')
    // const [selectedDescription, setSelectedDescription] = useState('')
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
    const [getDuration, setDuration] = useState(null)

    const title = t('examTemplate.create');
    const description = "";

    const init = (params) => {
        setLoading(true)
        fetchRequest(examEditInit, 'POST', params)
            .then((res) => {
                if (res.success) {
                    const { exam = null, templates = [], groups, classes, topics } = res

                    if(exam?.method){
                        setSelectedMethod(exam.method.toLowerCase())
                    }

                    setIsVariant(exam?.variant || false)
                    setIsMix(exam?.shuffle || false)
                    setSelectedPageSize(exam?.size || false)
                    setVariantCount(exam?.variantCount)
                    setViewType(exam?.viewType)
                    setTemplateOptions(toDropdownData(templates, 'id', 'name'))
                    setSelectedTemplateId(exam?.templateId)
                    setGroupOptions(toDropdownData(groups, 'id', 'name'))
                    setClassOptions(toDropdownData(classes, 'id', 'name'))
                    setParentTopicOptions(toDropdownData(topics, 'id', 'name'))
                    setStartDate(exam?.startDate)
                    setEndDate(exam?.endDate)
                    setIsRepeat(exam?.repeat)
                    setRepeatCount(exam?.repeatCount)
                    setIsInfinite(exam?.limitless)
                    setSelectedParentTopicIds(exam?.topicIds || [])
                    setExamData(exam)
                    setDuration(exam?.duration)
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

    const onHandlerTemplate = (value) => {
        setSelectedTemplateId(value)
    }

    const onHandlerParentTopic = (value) => {
        setSelectedParentTopicIds(value)
    }

    // const onHandlerName = (e) => {
    //     setSelectedName(e.target.value)
    // }

    // const onHandlerDuration = (e) => {
    //     setSelectedDuration(e.target.value)
    // }

    const onHandlerMethod = (value) => {
        setSelectedMethod(value)
    }

    const handlerIsMix = (value) => {
        setIsMix(value)
    }

    const handlerIsRepeat = (value) => {
        setIsRepeat(value)
    }

    const handlerRepeatCount = (e) => {
        setRepeatCount(e.target.value)
    }

    const handlerIsLimitless = (value) => {
        setIsInfinite(value)
    }

    const handlerIsVariant = (value) => {
        setIsVariant(value)
    }

    const onHandlerPageSize = (value) => {
        setSelectedPageSize(value)
    }

    const classDropdownChange = (value) => {
        setSelectedClassIds(value)
    }

    // const onHandlerDescription = (e) => {
    //     setSelectedDescription(e.target.value)
    // }

    // const onDateRangeChange = (dates) => {
    //     if(dates && dates.length > 0){
    //         if(dates[0].startDate){
    //             setStartDate(dates[0].startDate)
    //         }
    //         if(dates[0].endDate){
    //             setEndDate(dates[0].endDate)
    //         }
    //     }
    // };

    const onDateRangeChange = (value) => {
        const selectedRange = value[0];
        const selectedStartDate = selectedRange.startDate ? selectedRange.startDate : startDate;
        if(selectedRange.endDate) {
            if(selectedRange.endDate >= selectedStartDate)
            {
                setEndDate(value[0].endDate)
            }
            else{
                showMessage(t('exam.changeEndDate'));
            }
        }

        if (selectedRange.startDate) {
            selectedRange.endDate = selectedRange.startDate;
            setDateRange(selectedRange);
            setStartDate(selectedRange.startDate);
        }
    }

    const onDurationHandler = (e) => {
        function calculateMinutesDifference(selectedStartDate, selectedEndDate) {
            const differenceInMillis = selectedEndDate.getTime() - selectedStartDate.getTime();
            const differenceInMinutes = differenceInMillis / (1000 * 60);
            return differenceInMinutes;
        }
        const selectedStartDate = new Date(startDate);
        const selectedEndDate = new Date(endDate);

        const minutesDifference = calculateMinutesDifference(selectedStartDate, selectedEndDate);

        if(minutesDifference >= parseInt(e.target.value)){
            setDuration(parseInt(e.target.value))
        }
        else if(parseInt(e.target.value) != null && minutesDifference < parseInt(e.target.value)){
            e.target.value = null;
            showMessage(t('exam.changeExamDuration'));
        }
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
            key: 'template',
            label: t('menu.examTemplate'),
            value: selectedTemplateId || null,
            options: templateOptions || [],
            onChange: onHandlerTemplate,
            disabled: true,
            hidden: selectedTemplateId ? false : true,
            type: 'dropdown',
            clearable: true,
            labelStyle: {
                fontFamily: 'PinnacleDemiBold',
                fontSize: 12,
                fontWeight: 800,
                color: '#575962',
            },
        },
        {
            key: 'parentTopics',
            label: t('question.topic') + '*',
            value: selectedParentTopicIds || [],
            type: 'dropdown',
            options: parentTopicOptions || [],
            onChange: onHandlerParentTopic,
            multiple: true,
            disabled: selectedTemplateId ? true : false,
            clearable: true,
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
            minDate: new Date(startDate),
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
            ranges: dateRange,
        },
        {
            key: 'duration',
            label: t('menu.examLength') + '*',
            value: getDuration || '',  
            type: 'number',
            required: true,
            errorMessage: t('errorMessage.enterMinute'),
            labelStyle: {
                fontFamily: 'PinnacleDemiBold',
                fontSize: 12,
                fontWeight: 800,
                color: '#575962',
            },
            onChange: onDurationHandler
        },
        {
            key: 'method',
            label: t('examTemplate.method') + '*',
            value: selectedMethod || '',  
            type: 'dropdown',
            options: methodOptions || [],
            onChange: onHandlerMethod,
            disabled: true,
            required: true,
            searchable: true,
            clearable: true,
            multiple: false,
            errorMessage: t('examTemplate.errorMessage.enterMethod'),
            labelStyle: {
                fontFamily: 'PinnacleDemiBold',
                fontSize: 12,
                fontWeight: 800,
                color: '#575962',
            },
        },
        {
            key: 'isMix',
            label: t('examTemplate.isMix'),
            value: isMix || false,
            type: 'checkbox',
            hidden: selectedMethod == 'blueprint' ? true : false,
            disabled: examData?.questionCount > 0 ? true : false,
            onChange: handlerIsMix,
            errorMessage: t('errorMessage.enterMinute'),
            labelStyle: {
                fontFamily: 'PinnacleDemiBold',
                fontSize: 12,
                fontWeight: 800,
                color: '#575962',
            },
        },
        {
            key: 'isVariant',
            label: t('examTemplate.isVariant'),
            value: isVariant || false,
            hidden: selectedMethod == 'blueprint' ? true : false,
            onChange: handlerIsVariant,
            disabled: examData?.questionCount > 0 ? true : false,
            type: 'checkbox',
            errorMessage: t('errorMessage.enterMinute'),
            labelStyle: {
                fontFamily: 'PinnacleDemiBold',
                fontSize: 12,
                fontWeight: 800,
                color: '#575962',
            },
        },
        {
            key: 'variantCount',
            label: t('examTemplate.variantCount'),
            value: variantCount || '', 
            type: 'text',
            hidden: selectedMethod == 'blueprint' ? true : false,
            disabled: isVariant ? false : true,
            disabled: examData?.questionCount > 0 ? true : false,
            errorMessage: t('errorMessage.enterMinute'),
            labelStyle: {
                fontFamily: 'PinnacleDemiBold',
                fontSize: 12,
                fontWeight: 800,
                color: '#575962',
            },
        },
        {
            key: 'pageSize',
            label: t('examTemplate.pageSize') + '*',
            value: selectedPageSize || null,  
            type: 'dropdown',
            options: pageSizeOptions || [],
            onChange: onHandlerPageSize,
            required: true,
            searchable: true,
            clearable: true,
            multiple: false,
            disabled: examData?.questionCount > 0 ? true : false,
            errorMessage: t('examTemplate.errorMessage.enterPageSize'),
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
        },
        {
            key: 'repeat',
            label: t('exam.repeatAllowed'),
            value: isRepeat || false,
            type: 'checkbox',
            onChange: handlerIsRepeat,
            errorMessage: t('errorMessage.enterMinute'),
            labelStyle: {
                fontFamily: 'PinnacleDemiBold',
                fontSize: 12,
                fontWeight: 800,
                color: '#575962',
            },
        },
        {
            key: 'repeatCount',
            label: t('exam.repeatNumber'),
            value: repeatCount || '', 
            type: 'text',
            onChange: handlerRepeatCount,
            errorMessage: t('errorMessage.enterMinute'),
            labelStyle: {
                fontFamily: 'PinnacleDemiBold',
                fontSize: 12,
                fontWeight: 800,
                color: '#575962',
            },
        },
        {
            key: 'limitless',
            label: t('common.unlimited'),
            value: isInfinite || false,
            type: 'checkbox',
            onChange: handlerIsLimitless,
            errorMessage: t('errorMessage.enterMinute'),
            labelStyle: {
                fontFamily: 'PinnacleDemiBold',
                fontSize: 12,
                fontWeight: 800,
                color: '#575962',
            },
        },
    ];

    useEffect(() => {
        formRef?.current?.updateFields && formRef.current?.updateFields(fields);
    }, [examData, selectedMethod, isMix, isVariant, selectedPageSize, variantCount, viewType, selectedTemplateId, parentTopicOptions, selectedParentTopicIds, startDate, endDate, getDuration, dateRange]);

    const onSubmit = () => {
        const [formsValid, formValues] = formRef.current.validate();
        const start = new Date(startDate);
        const end = new Date(endDate);
        if(start > end)
        {
            showMessage(t('exam.changeEndDate'));
        }
        else{
            if(formsValid){
                let subjectId = null;
                let name = '';
                let duration = null;
                let parentTopic = null;
                let isMix = false;
                let isVariant = false;
                let variantCount = null;
                let pageSize = null;
                let description = null;
    
                for(let i = 0; i < formValues.length; i++){
                    if(formValues[i].key == 'subject'){
                        subjectId = formValues[i].value;
                    }
    
                    if(formValues[i].key == 'name'){
                        name = formValues[i].value;
                    }
    
                    if(formValues[i].key == 'duration'){
                        duration = formValues[i].value;
                    }
    
                    if(formValues[i].key == 'parentTopic'){
                        parentTopic = formValues[i].value;
                    }
    
                    if(formValues[i].key == 'isMix'){
                        isMix = formValues[i].value;
                    }
    
                    if(formValues[i].key == 'isVariant'){
                        isVariant = formValues[i].value;
                    }
    
                    if(formValues[i].key == 'variantCount'){
                        variantCount = formValues[i].value;
                    }
    
                    if(formValues[i].key == 'pageSize'){
                        pageSize = formValues[i].value;
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
                    name,
                    duration,
                    parentTopics: JSON.stringify(selectedParentTopicIds),
                    shuffle: isMix ? 1 : 0,
                    variant: isVariant ? 1 : 0,
                    variantCount: variantCount,
                    size: pageSize,
                    description,
                    start: startDate,
                    end: endDate,
                    repeat: isRepeat ? 1 : 0,
                    repeatCount: repeatCount,
                    limitless: isInfinite ? 1 : 0,
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
    }

    const handlerBackAction = () => {
        history.push('/online-exam/exam')
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
