import { React, useRef, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import MainModal from "modules/MainModal";
import Forms from 'modules/Form/Forms';

const GroupEditModal = ({ show, onClose, onSubmit, curriculums = [], grades = [], subjects = [], schools = [], groupData = null}) => {
    const formRef = useRef();
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false);

    const fields = [
        {
            key: 'curriculum',
            label: t('curriculum.title') + '*',
            value: groupData?.curriculumId ? String(groupData?.curriculumId) : null,
            type: 'dropdown',
            options: curriculums || [],
            multiple: false,
            disabled: true,
            errorMessage: t('errorMessage.selectCurriculum'),
            labelStyle: {
                fontFamily: 'PinnacleDemiBold',
                fontSize: 12,
                fontWeight: 800,
                color: '#575962',
            },
        },
        {
            key: 'grade',
            label: t('curriculum.grade') + '*',
            value: groupData?.gradeId || null,
            type: 'dropdown',
            options: grades || [],
            required: true,
            multiple: false,
            disabled: true,
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
            label: `${t('menu.curriculumSubject')}*`,
            value: groupData?.subjectId ? String(groupData?.subjectId) : null,
            type: 'dropdown',
            clearable: true,
            searchable: true,
            options: subjects || [],
            required: true,
            multiple: false,
            errorMessage: t('errorMessage.selectSubject'),
            labelStyle: {
                fontFamily: 'PinnacleDemiBold',
                fontSize: 12,
                fontWeight: 800,
                color: '#575962',
            },
        },
        {
            key: 'schools',
            label: `${t('menu.school')}*`,
            value: groupData?.schoolIds || [],
            type: 'dropdown',
            clearable: true,
            searchable: true,
            options: schools || [],
            required: true,
            multiple: true,
            errorMessage: t('errorMessage.selectSchool'),
            labelStyle: {
                fontFamily: 'PinnacleDemiBold',
                fontSize: 12,
                fontWeight: 800,
                color: '#575962',
            },
        },
        {
            key: 'name',
            label: t('menu.groupName') + '*',
            value: groupData?.name || '',
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
            key: 'isActive',
            label: t('menu.isActive'),
            value: groupData?.isActive,
            type: 'checkbox',
        },
    ];

    useEffect(() => {
        formRef?.current?.updateFields && formRef.current?.updateFields(fields);
    }, [curriculums, grades, schools, subjects, groupData]);

    const onSave = () => {
        const [formsValid, formValues] = formRef.current.validate();
        if(formsValid){
            let subjectId = null;
            let schoolIds = null;
            let name = '';
            let isActive = '';

            for(let i = 0; i < formValues.length; i++){
                if(formValues[i].key == 'subject'){
                    subjectId = formValues[i].value;
                }

                if(formValues[i].key == 'schools'){
                    schoolIds = formValues[i].value;
                }

                if(formValues[i].key == 'name'){
                    name = formValues[i].value;
                }

                if(formValues[i].key == 'isActive'){
                    if(formValues[i].value){
                        isActive = 1
                    } else {
                        isActive = 0
                    }
                }
            }

            const selectedSubject = subjects.find(subject => subject.value == subjectId)
            
            let schoolData = [];
            if(schoolIds && schoolIds.length > 0){
                for(let i = 0; i < schoolIds.length; i++){
                    let schoolGradeId = null;
                    let schoolGradeName = null;

                    const selectedSchool = schools.find(school => school.value == schoolIds[i])

                    if(selectedSchool.grades && selectedSchool.grades.length > 0){
                        let grades = selectedSchool.grades;

                        for(let g = 0; g < grades.length; g++){
                            if(grades[g].gradeId == groupData?.gradeId){
                                schoolGradeId = grades[g].id
                                schoolGradeName = grades[g].name
                            }
                        }
                    }

                    if(selectedSchool){
                        schoolData.push({
                            id: selectedSchool.value,
                            name: selectedSchool.text,
                            gradeId: schoolGradeId,
                            gradeName: schoolGradeName,
                        })
                    }
                }
            }

            const params = {
                submit: 1,
                group: groupData.id,
                subject: subjectId,
                subjectName: selectedSubject ? selectedSubject.text : '',
                subjectCode: selectedSubject ? selectedSubject.code : '',
                schools: JSON.stringify(schoolData),
                name: name,
                active: isActive
            };

            onSubmit(params)
        }
    }

    return (
        <MainModal
            title="Нэгдсэн групп засах"
            show={show}
            onClose={onClose}
            onSave={onSave}
            showBackButton
        >
            <Forms 
                ref={formRef} 
                fields={fields} 
            />
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
        </MainModal>
    );
};

export default GroupEditModal;
