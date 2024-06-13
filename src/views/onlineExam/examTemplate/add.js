import HtmlHead from "components/html-head/HtmlHead";
import React, { useEffect, useState, useRef } from "react";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button, Card } from "react-bootstrap";
import Forms from "modules/Form/Forms";
import showMessage from "modules/message";
import { fetchRequest } from "utils/fetchRequest";
import { examTemplateGradeSubject, examTemplateCreate } from 'utils/fetchRequest/Urls';
import { useSelector } from "react-redux";
import message from "modules/message";

export default function ExamTemplateAdd() {
    const history = useHistory()
    const { t } = useTranslation()
    const formRef = useRef();
    const { selectedSchool } = useSelector(state => state.schoolData);
    const [loading, setLoading] = useState()
    const [gradeOptions, setGradeOptions] = useState([])
    const [subjectOptions, setSubjectOptions] = useState([])
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
    const [selectedGradeId, setSelectedGradeId] = useState(null)
    const [selectedSubjectId, setSelectedSubjectId] = useState(null)
    const [selectedName, setSelectedName] = useState('')
    const [selectedDuration, setSelectedDuration] = useState('')
    const [selectedMethod, setSelectedMethod] = useState(null)
    const [selectedPageSize, setSelectedPageSize] = useState(null)
    const [selectedDescription, setSelectedDescription] = useState('')
    const [isMix, setIsMix] = useState(false)
    const [isVariant, setIsVariant] = useState(false)

    const title = t('examTemplate.create');
    const description = "";

    const init = (params) => {
        setLoading(true)
        fetchRequest(examTemplateGradeSubject, 'POST', params)
            .then((res) => {
                if (res.success) {
                    const { grades = [], subjects = [] } = res
                    if(params.grade){
                        setSubjectOptions(subjects)
                    } else {
                        setGradeOptions(grades)
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
            isGradeFlat: 1
        }

        init(params);
    }, []);

    useEffect(() => {
        formRef?.current?.updateFields && formRef.current?.updateFields(fields);
    }, [gradeOptions, subjectOptions, selectedMethod, isMix, isVariant]);

    const onHandlerGrade = (value) => {
        setSelectedGradeId(value)

        let params = {
            school: selectedSchool.id,
            grade: value,
            isGradeFlat: 1
        }

        init(params);
    }

    const onHandlerSubject = (value) => {
        setSelectedSubjectId(value)
    }

    const onHandlerName = (e) => {
        setSelectedName(e.target.value)
    }

    const onHandlerDuration = (e) => {
        setSelectedDuration(e.target.value)
    }

    const onHandlerMethod = (value) => {
        setSelectedMethod(value)
        if(value == 'blueprint'){
            setIsMix(true)
        } else {
            setIsMix(false)
        }
        
        setIsVariant(false)
    }

    const handlerIsMix = (value) => {
        setIsMix(value)
    }

    const handlerIsVariant = (value) => {
        setIsVariant(value)
    }

    const onHandlerPageSize = (value) => {
        setSelectedPageSize(value)
    }

    const onHandlerDescription = (e) => {
        setSelectedDescription(e.target.value)
    }
    
    const fields = [
        {
            key: 'grade',
            label: t('exam.level') + '*',
            value: selectedGradeId || null,
            type: 'dropdown',
            options: gradeOptions || [],
            onChange: onHandlerGrade,
            multiple: false,
            required: true,
            searchable: true,
            clearable: true,
            errorMessage: t('errorMessage.selectGrade'),
            labelStyle: {
                fontFamily: 'PinnacleDemiBold',
                fontSize: 12,
                fontWeight: 800,
                color: '#575962',
            },
        },
        {
            key: 'subject',
            label: t('exam.subject') + '*',
            value: selectedSubjectId || null,
            type: 'dropdown',
            options: subjectOptions || [],
            onChange: onHandlerSubject,
            required: true,
            searchable: true,
            clearable: true,
            multiple: false,
            errorMessage: t('errorMessage.enterSubject'),
            labelStyle: {
                fontFamily: 'PinnacleDemiBold',
                fontSize: 12,
                fontWeight: 800,
                color: '#575962',
            },
        },
        {
            key: 'name',
            label: t('menu.examTemplate') + '*',
            value: selectedName || '',
            onChange: onHandlerName,
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
            key: 'duration',
            label: t('menu.examLength') + '*',
            value: selectedDuration || '',  
            type: 'numberOnly',
            onChange: onHandlerDuration,
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
            key: 'method',
            label: t('examTemplate.method') + '*',
            value: selectedMethod || '',  
            type: 'dropdown',
            options: methodOptions || [],
            onChange: onHandlerMethod,
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
            disabled: selectedMethod == 'blueprint' ? true : false,
            type: 'checkbox',
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
            onChange: handlerIsVariant,
            disabled: selectedMethod == 'blueprint' ? true : false,
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
            value: '',  
            type: 'text',
            disabled: isVariant ? false : true,
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
            value: selectedDescription || '',
            onChange: onHandlerDescription,
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
    ];

    const handleProceed = () => {
        const [formsValid, formValues] = formRef.current.validate();
        if(formsValid){
            let subjectId = null;
            let subjectCode = null;
            let subjectName = null;
            let selectedGradeName = null;
            let name = '';
            let duration = null;
            let method = null;
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

                if(formValues[i].key == 'method'){
                    method = formValues[i].value;
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

            if(subjectOptions && subjectOptions.length > 0){
                for(let i = 0; i < subjectOptions.length; i++){
                    if(subjectId == subjectOptions[i].value){
                        subjectCode = subjectOptions[i].code
                        subjectName = subjectOptions[i].name
                    }
                }
            }

            if(gradeOptions && gradeOptions.length > 0){
                for(let i = 0; i < gradeOptions.length; i++){
                    if(selectedGradeId == gradeOptions[i].value){
                        selectedGradeName = gradeOptions[i].text
                    }
                }
            }

            if(isVariant){
                if(!variantCount){
                    message(t('examTemplate.errorMessage.enterVariantCount'), false)
                    return
                }
            }

            const params = {
                school: selectedSchool.id,
                grade: selectedGradeId,
                gradeName: selectedGradeName,
                subject: subjectId,
                subjectCode,
                subjectName,
                name,
                duration,
                method,
                shuffle: isMix ? 1 : 0,
                variant: isVariant ? 1 : 0,
                variantCount: variantCount,
                size: pageSize,
                description
            };

            setLoading(true)
            fetchRequest(examTemplateCreate, 'POST', params)
                .then((res) => {
                    if (res.success) {
                        const { template } = res
                        history.push({
                            pathname: '/online-exam/template-edit',
                            state: {
                                id: template,
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
        }
    }

    return (
        <>
            <HtmlHead title={title} description={description} />

            <div className="screen-padding">
                <Card>
                    <Card.Header>
                        <Card.Title className="main-orange">{title}</Card.Title>
                    </Card.Header>
                    <Card.Body>
                        <Forms 
                            ref={formRef} 
                            fields={fields} 
                        />
                    </Card.Body>
                    <Card.Footer>
                        <div className="text-center">
                            <Button className='cancel-button' variant='link' onClick={() => history.goBack()}>
                                <span style ={{color: '#ff2f1a'}}>{t('common.cancel')}</span> 
                            </Button>
                            <Button className='proceed-button' variant = 'empty' onClick={handleProceed}>
                                <span style ={{color: '#000000'}}>{t('action.next').toUpperCase()}</span>
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
