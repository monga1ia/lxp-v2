import { React, useRef, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import MainModal from "modules/MainModal";
import Forms from 'modules/Form/Forms';
import { fetchRequest } from 'utils/fetchRequest';
import message from 'modules/message' 
import { groupCreate } from "utils/fetchRequest/Urls";

const GroupRegisterModal = ({ show, onClose, onSubmit, curriculums, grades, schools, schoolId }) => {
    const formRef = useRef();
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false);
    const [subjects, setSubjects] = useState([]);
    const [curriculumId, setCurriculumId] = useState(null);
    const [gradeId, setGradeId] = useState(null);

    useEffect(() => {
        if(curriculumId && gradeId){
            const params = {
                school: schoolId,
                curriculum: curriculumId,
                grade: gradeId
            }

            setLoading(true)
            fetchRequest(groupCreate, 'POST', params)
                .then((res) => {
                    if (res.success) {
                        const subjectList = res.subjects;

                        if(subjectList && subjectList.length){
                            setSubjects(subjectList)
                        }
                    } else {
                        message(res.message)
                    }
                    setLoading(false)
                })
                .catch(() => {
                    message(t('errorMessage.title'));
                    setLoading(false)
                })
        }
    }, [curriculumId, gradeId]);

    const onCurriculumChange = (value) => {
        setCurriculumId(value)
        setSubjects([])
    }

    const onGradeChange = (value) => {
        setGradeId(value)
        setSubjects([])
    }
    
    const fields = [
        {
            key: 'curriculum',
            label: t('curriculum.title') + '*',
            value: curriculumId || null,
            type: 'dropdown',
            clearable: true,
            searchable: true,
            options: curriculums || [],
            onChange: onCurriculumChange,
            required: true,
            multiple: false,
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
            value: gradeId || null,
            type: 'dropdown',
            clearable: true,
            searchable: true,
            options: grades || [],
            onChange: onGradeChange,
            required: true,
            multiple: false,
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
            value: null,
            type: 'dropdown',
            clearable: true,
            searchable: true,
            options: subjects.map(subjectObj => {
                return {
                    value: subjectObj?.id,
                    text: subjectObj?.name + ' (' + subjectObj?.code + ')'
                }}) || [],
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
            value: null,
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
            value: '',
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
            value: true,
            type: 'checkbox',
        },
    ];

    useEffect(() => {
        formRef?.current?.updateFields && formRef.current?.updateFields(fields);
    }, [curriculums, grades, schools, subjects]);

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

            const selectedCurriculum = curriculums.find(curriculum => curriculum.value == curriculumId)
            const selectedGrade = grades.find(grade => grade.value == gradeId)
            const selectedSubject = subjects.find(subject => subject.id == subjectId)
            let schoolData = [];
            if(schoolIds && schoolIds.length > 0){
                for(let i = 0; i < schoolIds.length; i++){
                    let schoolGradeId = null;
                    let schoolGradeName = null;

                    const selectedSchool = schools.find(school => school.value == schoolIds[i])

                    if(selectedSchool.grades && selectedSchool.grades.length > 0){
                        let grades = selectedSchool.grades;

                        for(let g = 0; g < grades.length; g++){
                            if(grades[g].gradeId == selectedGrade.value){
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
                curriculum: curriculumId,
                curriculumName: selectedCurriculum ? selectedCurriculum.text : '',
                curriculumCode: selectedCurriculum ? selectedCurriculum.code : '',
                grade: gradeId,
                gradeName: selectedGrade ? selectedGrade.text : '',
                gradeCode: selectedGrade ? selectedGrade.code : '',
                subject: subjectId,
                subjectName: selectedSubject ? selectedSubject.name : '',
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
            title="Нэгдсэн групп бүртгэх"
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

export default GroupRegisterModal;
