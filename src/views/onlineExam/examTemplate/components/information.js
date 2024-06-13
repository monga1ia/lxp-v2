import React, { useEffect, useState, useRef } from "react";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button, Card } from "react-bootstrap";
import Forms from "modules/Form/Forms";
import showMessage from "modules/message";
import { fetchRequest } from "utils/fetchRequest";
import { examTemplateEdit } from 'utils/fetchRequest/Urls';
import { useSelector } from "react-redux";
import HtmlHead from "components/html-head/HtmlHead";

export default function ExamTemplateEdit({
    id = null,
    tabCode = '',
    onChangeTabAction
}) {
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
    // const [selectedSubjectId, setSelectedSubjectId] = useState(null)
    // const [selectedName, setSelectedName] = useState('')
    // const [selectedDuration, setSelectedDuration] = useState('')
    const [selectedMethod, setSelectedMethod] = useState(null)
    const [selectedPageSize, setSelectedPageSize] = useState(null)
    // const [selectedDescription, setSelectedDescription] = useState('')
    const [variantCount, setVariantCount] = useState('')
    const [isMix, setIsMix] = useState(false)
    const [isVariant, setIsVariant] = useState(false)
    const [templateData, setTemplateData] = useState(null)

    const title = t('examTemplate.create');
    const description = "";

    const init = (params) => {
        setLoading(true)
        fetchRequest(examTemplateEdit, 'POST', params)
            .then((res) => {
                if (res.success) {
                    const { template = null } = res

                    if(template?.method){
                        setSelectedMethod(template.method.toLowerCase())
                    }
                    
                    setIsVariant(template?.variant || false)
                    setIsMix(template?.shuffle || false)
                    setSelectedPageSize(template?.size || false)
                    setVariantCount(template?.variantCount)
                    setTemplateData(template)
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
            template: id,
            submit: 0
        }

        if(tabCode == 'INFORMATION'){
            init(params);
        }
    }, []);

    // const onHandlerSubject = (value) => {
    //     setSelectedSubjectId(value)
    // }

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

    const handlerIsVariant = (value) => {
        setIsVariant(value)
    }

    const onHandlerPageSize = (value) => {
        setSelectedPageSize(value)
    }

    // const onHandlerDescription = (e) => {
    //     setSelectedDescription(e.target.value)
    // }

    const fields = [
        {
            key: 'grade',
            label: t('exam.level'),
            value: templateData?.gradeName || '',
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
            value: templateData?.subjectName || '',
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
            label: t('menu.examTemplate') + '*',
            value: templateData?.name || '',
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
            value: templateData?.duration || '',  
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
            disabled: templateData?.questionCount > 0 ? true : false,
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
            disabled: templateData?.questionCount > 0 ? true : false,
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
            disabled: templateData?.questionCount > 0 ? true : false,
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
            disabled: isVariant ? false : true,
            disabled: templateData?.questionCount > 0 ? true : false,
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
            disabled: templateData?.questionCount > 0 ? true : false,
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
            value: templateData?.description || '',
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

    useEffect(() => {
        formRef?.current?.updateFields && formRef.current?.updateFields(fields);
    }, [gradeOptions, subjectOptions, templateData, selectedMethod, isMix, isVariant, selectedPageSize, variantCount]);

    const onSubmit = () => {
        const [formsValid, formValues] = formRef.current.validate();
        if(formsValid){
            // let subjectId = null;
            // let subjectCode = null;
            // let subjectName = null;
            // let selectedGradeName = null;
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
                    // subjectId = formValues[i].value;
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

            const params = {
                school: selectedSchool.id,
                template: id,
                grade: templateData.grade,
                gradeName: templateData.Name,
                subject: templateData.subject,
                subjectCode: templateData.subjectCode,
                subjectName: templateData.subjectName,
                name,
                duration,
                method,
                shuffle: isMix ? 1 : 0,
                variant: isVariant ? 1 : 0,
                variantCount: variantCount,
                size: pageSize,
                description,
                submit: 1
            };

            setLoading(true)
            fetchRequest(examTemplateEdit, 'POST', params)
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
        history.push('/online-exam/template')
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
