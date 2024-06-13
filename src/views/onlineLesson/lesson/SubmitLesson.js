// import Forms from 'modules/Form/Forms';
import message from 'modules/message';
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Button, Card, Col, Row } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux';
import { Link, useHistory } from "react-router-dom";
import { fetchRequest } from 'utils/fetchRequest';
import { courseInit, examTemplateGradeSubject } from 'utils/fetchRequest/Urls';
import { toDropdownArray } from 'utils/utils';
import SchoolTab from 'views/onlineExam/exam/components/tabComponent';
import Checkbox from 'modules/Form/Checkbox'
import Select from 'modules/Form/Select'
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from "ckeditor5-build-classic-mathtype";

const SubmitLesson = () => {
    const fileUploaderRef = useRef()
    const { schools, selectedSchool } = useSelector((state) => state.schoolData);

    const { t, i18n } = useTranslation()
    const history = useHistory()

    const [tabKey, setTabKey] = useState('INTEGRATED')

    const [description, setDescription] = useState('')
    const [coverFile, setCoverFile] = useState(null)
    const [gradeOptions, setGradeOptions] = useState([])
    const [groupOptions, setGroupOptions] = useState([])
    const [selectedGroups, setSelectedGroups] = useState([])
    const [subjectOptions, setSubjectOptions] = useState([])
    const [classOptions, setClassOptions] = useState([])
    const [selectedClasses, setSelectedClasses] = useState([])

    const [gradeRows, setGradeRows] = useState([])

    const [school, setSchool] = useState(null)
    const [isOpen, setIsOpen] = useState(false)
    const [isSell, setIsSell] = useState(false)
    const [courseName, setCourseName] = useState('')
    const [coursePrice, setCoursePrice] = useState('')

    const [isManualOpen, setIsManualOpen] = useState(false)

    const [updateView, setUpdateView] = useState(false)

    const [loading, setLoading] = useState(false)

    const gradeSubjectInit = (params) => {
        setLoading(true)
        fetchRequest(examTemplateGradeSubject, 'POST', params)
            .then((res) => {
                if (res.success) {
                    const { grades = [], subjects = [] } = res;

                    if (params.grade) {
                        const clone = [...gradeRows]
                        if (clone && clone.length > 0) {
                            for (let c = 0; c < clone.length; c++) {
                                if (clone[c].selectedGrade === params.grade) {
                                    clone[c].subjects = subjects;
                                    break;
                                }
                            }
                        }
                        setGradeRows(clone)
                    } else {
                        let childGrades = [];
                        if (params?.isMdGrade === 1) {
                            childGrades = grades.map(gradeObj => {
                                return {
                                    value: gradeObj?.id,
                                    text: gradeObj?.name
                                }
                            })
                        } else {
                            if (grades && grades.length > 0) {
                                for (let g = 0; g < grades.length; g++) {
                                    const gradeObj = grades[g]
                                    if (gradeObj.children && gradeObj.children.length > 0) {
                                        for (let c = 0; c < gradeObj.children.length; c++) {
                                            childGrades.push({
                                                value: gradeObj.children[c]?.key,
                                                text: gradeObj.children[c]?.title
                                            })
                                        }
                                    }
                                }
                            }
                        }
                        setGradeOptions(childGrades);
                    }
                } else {
                    message(res.message)
                }
                setLoading(false)
            })
            .catch((e) => {
                message(t('errorMessage.title'));
                setLoading(false)
            })
    }

    const init = (params) => {
        if (params?.viewType !== 'INTEGRATED') {
            setClassOptions([])
        }

        setLoading(true)
        fetchRequest(courseInit, 'POST', params)
            .then((res) => {
                if (res.success) {
                    if (params?.viewType === 'INTEGRATED') {
                        setGroupOptions(res?.groups)
                    } else {
                        setClassOptions(res?.classes)
                    }
                } else {
                    message(res.message)
                }
                setLoading(false)
            })
            .catch((e) => {
                message(t('errorMessage.title'));
                setLoading(false)
            })
    }

    const onSubmit = () => {
        if (!courseName) {
            message(t('errorMessage.enterSubjectName'));
            return
        }

        const formParams = new FormData()
        formParams.append('name', courseName);

        const gradeList = []
        if (gradeRows && gradeRows.length > 0) {
            let gradeError = false;
            let subjectError = false;
            for (let g = 0; g < gradeRows.length; g++) {
                if (!gradeRows[g].selectedGrade) {
                    gradeError = true
                    break;
                }
                if (!gradeRows[g].selectedSubjects || gradeRows[g].selectedSubjects.length === 0) {
                    subjectError = true
                    break;
                }

                gradeList.push({
                    grade: gradeRows[g].selectedGrade,
                    gradeName: gradeRows[g].selectedGradeName,
                    subjects: gradeRows[g].selectedSubjects
                })
            }
            if (gradeError) {
                message(t('errorMessage.selectGrade'));
                return
            }
            if (subjectError) {
                message(t('errorMessage.selectSubject'));
                return
            }
        } else {
            message(t('errorMessage.selectGrade'));
            return
        }

        if (isOpen) {
            formParams.append('school', school)
            formParams.append('schoolName', selectedSchool?.name)
        } else {
            if (tabKey === 'INTEGRATED') {
                if (!selectedGroups || selectedGroups.length === 0) {
                    message(t('errorMessage.selectGroups'));
                    return
                }
                formParams.append('groups', JSON.stringify(selectedGroups))
                formParams.append('school', school)
                formParams.append('schoolName', selectedSchool?.name)
            } else {
                if (!school) {
                    message(t('errorMessage.selectSchool'));
                    return
                }
                if (!selectedClasses || selectedClasses.length === 0) {
                    message(t('errorMessage.selectClass'));
                    return
                }
                const classesArray = []
                if (classOptions && classOptions.length > 0) {
                    for (let c = 0; c < classOptions.length; c++) {
                        const classObj = classOptions[c]

                        if (selectedClasses && selectedClasses?.length > 0) {
                            for (let cv = 0; cv < selectedClasses.length; cv++) {
                                if (selectedClasses[cv] === classObj.id) {
                                    classesArray.push({
                                        id: selectedClasses[cv],
                                        name: classObj.name
                                    })
                                }
                            }
                        }
                    }
                }
                formParams.append('classes', JSON.stringify(classesArray))
                formParams.append('school', school)
                formParams.append('schoolName', schools?.find(obj => obj.id === school)?.name)
            }
        }

        formParams.append('manualOpen', isManualOpen ? 1 : 0)
        formParams.append('grades', JSON.stringify(gradeList))
        formParams.append('description', description)
        formParams.append('isOpen', isOpen ? 1 : 0)
        formParams.append('isSell', isSell ? 1 : 0)
        formParams.append('price', coursePrice)
        formParams.append('coverFile', coverFile && coverFile?.files?.length > 0 ? coverFile?.files[0] : null)
        formParams.append('viewType', tabKey)

        setLoading(true)
        fetchRequest('api/course/create', 'POST', formParams, true, true)
            .then(res => {
                if (res.success) {
                    history.push({
                        pathname: "/onlineLesson/lesson-detail-submit",
                        state: {
                            id: res?.id,
                        }
                    })
                } else {
                    message(res.message)
                }
            })
            .catch(e => {
                message(t('errorMessage.title'));
            })
            .finally(() => {
                setLoading(false)
            })
    }

    useEffect(() => {
        setGradeRows([{
            selectedGrade: null,
            selectedGradeName: null,
            grades: gradeOptions,
            subjects: [],
            selectedSubjects: []
        }])
    }, [gradeOptions])

    useEffect(() => {
        gradeSubjectInit({
            school: selectedSchool?.id,
            isMdGrade: 0
        });
        if (selectedSchool) {
            setSchool(selectedSchool?.id)
        }
    }, [])

    const TabButtons = ({ tabKey = "INTEGRATED" }) => {
        return <div className="d-flex justify-content-center mb-3 mt-2">
            <SchoolTab
                selectedTabIndex={tabKey == 'INTEGRATED' ? 0 : 1}
                onSelectTab={(value) => {

                    if (value == 0) {
                        setTabKey('INTEGRATED')
                    } else {
                        setTabKey('SCHOOL')
                    }
                }}
            />
        </div>
    }

    useEffect(() => {
        setGroupOptions([])
        setClassOptions([])
        setSubjectOptions([])
        setGradeOptions([])
        if (isOpen) {
            gradeSubjectInit({
                school: selectedSchool?.id,
                isMdGrade: 1
            });
        } else {
            gradeSubjectInit({
                school: selectedSchool?.id,
                isMdGrade: 0
            });
        }
    }, [isOpen])

    const verifyFile = (files) => {
        const acceptedType = [
            'image/x-png',
            'image/png',
            'image/jpg',
            'image/jpeg',
            'image/gif',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/vnd.openxmlformats-officedocument.presentationml.presentation',
            'application/vnd.openxmlformats-officedocument.presentationml.slideshow',
            'video/x-ms-wmv',
            'application/pdf',
            'audio/mpeg',
            'video/mpeg',
            'video/mp4',
            'video/quicktime',
            'video/x-ms-wmv',
        ];
        const acceptedSize = 20 * 52428800;

        if (files && files.length > 0) {
            let isFalse = true;
            for (let i = 0; i < files.length; i++) {
                let imageSize = files[i].size;
                let imageType = files[i].type;
                if (imageSize > acceptedSize) {
                    coverFile.showErrorMessage = true;
                    coverFile.errorMessage = t('newsfeed.fileSizeWarning');
                    isFalse = false;
                }

                if (!acceptedType.includes(imageType)) {
                    coverFile.showErrorMessage = true;
                    coverFile.errorMessage = t('newsfeed.imageTypeError');
                    isFalse = false;
                }
            }
            return isFalse;
        }
    };

    const addGradeRow = () => {
        const clone = [...gradeRows]
        clone.push({
            selectedGrade: null,
            selectedGradeName: null,
            grades: gradeOptions,
            subjects: [],
            selectedSubjects: []
        })
        setGradeRows(clone)
    }

    const removeGradeRow = (rowIndex) => {
        const clone = [...gradeRows]
        clone.splice(rowIndex, 1)
        setGradeRows(clone)
    }

    const onGradeChange = (value, rowIndex) => {
        const clone = [...gradeRows]

        const allGrades = [];
        let allSubjects = [];

        for (let r = 0; r < clone?.length; r++) {
            if (r === rowIndex) {
                clone[r].selectedGrade = value;
                clone[r].selectedGradeName = gradeOptions.find(obj => obj?.value === value)?.text;
                if (!value) {
                    clone[r].selectedSubjects = []
                    clone[r].subjects = []
                }
            }
            if (clone[r].selectedGrade) {
                allGrades.push(clone[r].selectedGrade)
            }
            if (clone[r].selectedSubjects) {
                allSubjects = allSubjects.concat(clone[r].selectedSubjects)
            }
        }

        if (value) {
            gradeSubjectInit({
                school: selectedSchool?.id,
                isMdGrade: isOpen ? 1 : 0,
                grade: value
            })
        }

        if (!isOpen) {
            init({
                school: selectedSchool?.id,
                grades: allGrades,
                subjects: allSubjects,
                viewType: tabKey
            })
        }

        setGradeRows(clone)
        setUpdateView(!updateView)
    }

    const onSubjectChange = (value, subjectList = [], rowIndex) => {
        const clone = [...gradeRows]

        const allGrades = [];
        let allSubjects = [];
        for (let r = 0; r < clone?.length; r++) {
            if (r === rowIndex) {
                clone[r].selectedSubjects = subjectList.filter(obj => {
                    return value.indexOf(obj.id) > -1
                }) || []
            }

            if (clone[r].selectedGrade) {
                allGrades.push(clone[r].selectedGrade)
            }
            if (clone[r].selectedSubjects) {
                allSubjects = allSubjects.concat(clone[r].selectedSubjects)
            }

        }
        setGradeRows(clone)

        if (!isOpen) {
            init({
                school: selectedSchool?.id,
                grades: allGrades,
                subjects: allSubjects,
                viewType: tabKey
            })
        }
    }

    const getAvailableGrades = (allOptions = [], currentGradeId = null) => {
        const rows = [...gradeRows]
        const newRows = []
        for (let o = 0; o < allOptions.length; o++) {
            const op = allOptions[o]
            if (rows && rows.length > 0) {
                let selectedRowGrade = op;
                for (let r = 0; r < rows.length; r++) {
                    if (rows[r].selectedGrade !== currentGradeId
                        && rows[r].selectedGrade === op.value) {
                        selectedRowGrade = null;
                        break;
                    }
                }
                if (selectedRowGrade) {
                    newRows.push(selectedRowGrade)
                }
            } else {
                newRows.push(op)
            }
        }
        return newRows
    }

    return (
        <Card className='m-2'>
            <Card.Header className="modal-title d-flex flex-row justify-content-between w-100" >
                <Card.Title >{t('onlineLesson.addOnlineLesson')}</Card.Title>
            </Card.Header>
            <Card.Body>
                <Row style={{ display: 'flex', marginTop: '0.8rem' }}>
                    <label
                        style={{
                            display: 'flex',
                            flex: '1 1 0%',
                            justifyContent: 'flex-end',
                            alignItems: 'center',
                            marginRight: 10,
                            marginBottom: 0,
                            width: 'auto',
                            fontWeight: 'bold'
                        }}
                    >
                        {t('common.name') + "*"}
                    </label>
                    <div
                        style={{
                            display: 'flex',
                            flex: 1,
                            flexDirection: 'column',
                            marginLeft: 10,
                            width: 'auto',
                        }}
                    >
                        <input
                            className={'form-control'}
                            type='text'
                            onChange={(e) => {
                                setCourseName(e?.target?.value)
                            }}
                            value={courseName}
                        />
                    </div>
                    <div
                        style={{
                            display: 'flex',
                            flex: 0.8,
                            flexDirection: 'column',
                            marginLeft: 10,
                            width: 'auto',
                        }}
                    />
                </Row>
                <Row style={{ marginTop: '0.8rem' }}>
                    <label
                        style={{
                            display: 'flex',
                            flex: '1 1 0%',
                            justifyContent: 'flex-end',
                            alignItems: 'center',
                            marginRight: 10,
                            marginBottom: 0,
                            width: 'auto',
                            fontWeight: 'bold'
                        }}
                    >
                    </label>
                    <div
                        style={{
                            display: 'flex',
                            flex: 1,
                            flexDirection: 'column',
                            marginLeft: 10,
                            width: 'auto',
                        }}
                    >
                        <Checkbox
                            className='custom-cbox eschool-checkbox'
                            checked={!!isOpen}
                            onChange={() => {
                                setIsOpen(!isOpen)
                            }}
                            label={t('onlineLesson.isOpen')}
                        />
                    </div>
                    <div
                        style={{
                            display: 'flex',
                            flex: 0.8,
                            flexDirection: 'column',
                            marginLeft: 10,
                            width: 'auto',
                        }}
                    />
                </Row>
                {
                    !isOpen &&
                    <Row style={{ marginTop: '0.8rem' }}>
                        <TabButtons key="tabs" tabKey={tabKey} />
                    </Row>
                }
                {
                    tabKey === 'SCHOOL' && !isOpen && <Row style={{ marginTop: '0.8rem' }}>
                        <label
                            style={{
                                display: 'flex',
                                flex: '1 1 0%',
                                justifyContent: 'flex-end',
                                alignItems: 'center',
                                marginRight: 10,
                                marginBottom: 0,
                                width: 'auto',
                                fontWeight: 'bold'
                            }}
                        >
                            {t('school.title') + "*"}
                        </label>
                        <div
                            style={{
                                display: 'flex',
                                flex: 1,
                                flexDirection: 'column',
                                marginLeft: 10,
                                width: 'auto',
                            }}
                        >
                            <Select
                                onChange={(value) => {
                                    setSchool(value)
                                    init({
                                        school: value,
                                        viewType: 'SCHOOL'
                                    })
                                }}
                                value={school}
                                searchable={true}
                                disabled={false}
                                clearable={true}
                                options={toDropdownArray(schools, 'id', 'name')}
                            />
                        </div>
                        <div
                            style={{
                                display: 'flex',
                                flex: 0.8,
                                flexDirection: 'column',
                                marginLeft: 10,
                                width: 'auto',
                            }}
                        />
                    </Row>
                }
                {
                    gradeRows && gradeRows?.length > 0 && gradeRows.map((gradeRowObj, gI) => {
                        return <Row key={'grade_row_' + gI}
                            style={{ marginTop: '0.8rem' }}>
                            <label
                                style={{
                                    display: 'flex',
                                    flex: '1 1 0%',
                                    justifyContent: 'flex-end',
                                    alignItems: 'center',
                                    marginRight: 10,
                                    marginBottom: 0,
                                    width: 'auto',
                                    fontWeight: 'bold'
                                }}
                            >
                                {
                                    gI === 0 && t('curriculum.grade') + "*"
                                }
                            </label>
                            <div
                                style={{
                                    display: 'flex',
                                    flex: 0.7,
                                    flexDirection: 'column',
                                    width: 'auto',
                                    marginLeft: 10
                                }}
                            >
                                <Select
                                    className={''}
                                    onChange={(value) => {
                                        onGradeChange(value, gI)
                                    }}
                                    value={gradeRowObj.selectedGrade}
                                    searchable={true}
                                    clearable={true}
                                    options={getAvailableGrades(gradeRowObj?.grades, gradeRowObj?.selectedGrade)}
                                />
                            </div>
                            <div
                                style={{
                                    display: 'flex',
                                    flex: 1.1,
                                    flexDirection: 'column',
                                    width: 'auto',
                                    marginLeft: 10
                                }}
                            >
                                <Row>
                                    <div
                                        style={{
                                            display: 'flex',
                                            flex: 0.9,
                                            flexDirection: 'column',
                                            width: 'auto'
                                        }}
                                    >
                                        <Select
                                            className={''}
                                            onChange={(value, evt) => {
                                                onSubjectChange(value, gradeRowObj?.subjects, gI)
                                            }}
                                            value={gradeRowObj?.selectedSubjects.map(obj => obj.id)}
                                            multiple={true}
                                            searchable={true}
                                            disabled={false}
                                            clearable={true}
                                            options={gradeRowObj?.subjects.map(subjectObj => {
                                                return {
                                                    value: subjectObj?.id,
                                                    text: subjectObj?.name + ' (' + subjectObj?.code + ')'
                                                }
                                            })}
                                        />
                                    </div>
                                    <div
                                        style={{
                                            display: 'flex',
                                            flex: 0.5,
                                            flexDirection: 'column',
                                            width: 'auto'
                                        }}
                                    >

                                        <div>
                                            {
                                                gradeRows.length > 0 && gI === (gradeRows.length - 1)
                                                    ?
                                                    <Button onClick={addGradeRow}
                                                        className="btn btn-info m-btn m-btn--icon m-btn--icon-only"
                                                        style={{
                                                            padding: '10px 12px',
                                                            backgroundColor: '#3EBFA3'
                                                        }}>
                                                        <i className="flaticon2-add-1" />
                                                    </Button>
                                                    :
                                                    <Button onClick={() => removeGradeRow(gI)} className="btn btn-danger m-btn m-btn--icon m-btn--icon-only"
                                                        style={{
                                                            padding: '10px 12px'
                                                        }}>
                                                        <i className="flaticon2-cross" />
                                                    </Button>
                                            }
                                        </div>
                                    </div>
                                </Row>
                            </div>
                        </Row>
                    })
                }
                {
                    tabKey === 'SCHOOL' && !isOpen && <Row style={{ marginTop: '0.8rem' }}>
                        <label
                            style={{
                                display: 'flex',
                                flex: '1 1 0%',
                                justifyContent: 'flex-end',
                                alignItems: 'center',
                                marginRight: 10,
                                marginBottom: 0,
                                width: 'auto',
                                fontWeight: 'bold'
                            }}
                        >
                            {t('menu.group') + "*"}
                        </label>
                        <div
                            style={{
                                display: 'flex',
                                flex: 1,
                                flexDirection: 'column',
                                marginLeft: 10,
                                width: 'auto',
                            }}
                        >
                            <Select
                                className={''}
                                onChange={(value, evt) => {
                                    setSelectedClasses(value)
                                }}
                                value={selectedClasses}
                                multiple={true}
                                searchable={true}
                                disabled={false}
                                clearable={true}
                                options={classOptions.map(classObj => {
                                    return {
                                        value: classObj?.id,
                                        text: classObj?.name
                                    }
                                })}
                            />
                        </div>
                        <div
                            style={{
                                display: 'flex',
                                flex: 0.8,
                                flexDirection: 'column',
                                marginLeft: 10,
                                width: 'auto',
                            }}
                        />
                    </Row>
                }
                {
                    tabKey !== 'SCHOOL' && !isOpen &&
                    <Row style={{ marginTop: '0.8rem' }}>
                        <label
                            style={{
                                display: 'flex',
                                flex: '1 1 0%',
                                justifyContent: 'flex-end',
                                alignItems: 'center',
                                marginRight: 10,
                                marginBottom: 0,
                                width: 'auto',
                                fontWeight: 'bold'
                            }}
                        >
                            {t('menu.mainGroup') + "*"}
                        </label>
                        <div
                            style={{
                                display: 'flex',
                                flex: 1,
                                flexDirection: 'column',
                                marginLeft: 10,
                                width: 'auto',
                            }}
                        >
                            <Select
                                className={''}
                                onChange={(value, evt) => {
                                    setSelectedGroups(value)
                                }}
                                value={selectedGroups}
                                multiple={true}
                                searchable={true}
                                disabled={false}
                                clearable={true}
                                options={groupOptions}
                            />
                        </div>
                        <div
                            style={{
                                display: 'flex',
                                flex: 0.8,
                                flexDirection: 'column',
                                marginLeft: 10,
                                width: 'auto',
                            }}
                        />
                    </Row>
                }
                <Row style={{ marginTop: '0.8rem' }}>
                    <label
                        style={{
                            display: 'flex',
                            flex: '1 1 0%',
                            justifyContent: 'flex-end',
                            alignItems: 'center',
                            marginRight: 10,
                            marginBottom: 0,
                            width: 'auto',
                            fontWeight: 'bold'
                        }}
                    >
                    </label>
                    <div
                        style={{
                            display: 'flex',
                            flex: 1,
                            flexDirection: 'column',
                            marginLeft: 10,
                            width: 'auto',
                        }}
                    >
                        <Checkbox
                            className='custom-cbox eschool-checkbox'
                            checked={!!isSell}
                            onChange={() => setIsSell(prev=>!prev)}
                            label={t('onlineLesson.isSell')}
                        />
                    </div>
                    <div
                        style={{
                            display: 'flex',
                            flex: 0.8,
                            flexDirection: 'column',
                            marginLeft: 10,
                            width: 'auto',
                        }}
                    />
                </Row>
                {
                    isSell && 
                    <Row style={{ display: 'flex', marginTop: '0.8rem' }}>
                        <label
                            style={{
                                display: 'flex',
                                flex: '1 1 0%',
                                justifyContent: 'flex-end',
                                alignItems: 'center',
                                marginRight: 10,
                                marginBottom: 0,
                                width: 'auto',
                                fontWeight: 'bold'
                            }}
                        >
                            {t('onlineLesson.price') + "*"}
                        </label>
                        <div
                            style={{
                                display: 'flex',
                                flex: 1,
                                flexDirection: 'column',
                                marginLeft: 10,
                                width: 'auto',
                            }}
                        >
                            <input
                                className='form-control'
                                type='text'
                                value={coursePrice}
                                onChange={(e) => {
                                    let text = e.target.value.replace(/[^\d.-]/g, '')

                                    setCoursePrice(text)
                                }}
                            />
                        </div>
                        <div
                            style={{
                                display: 'flex',
                                flex: 0.8,
                                flexDirection: 'column',
                                marginLeft: 10,
                                width: 'auto',
                            }}
                        />
                    </Row>
                }
                <Row style={{ marginTop: '0.8rem' }}>
                    <label
                        style={{
                            display: 'flex',
                            flex: '1 1 0%',
                            justifyContent: 'flex-end',
                            alignItems: 'center',
                            marginRight: 10,
                            marginBottom: 0,
                            width: 'auto',
                            fontWeight: 'bold'
                        }}
                    >
                        {t('onlineLesson.description') + "*"}
                    </label>
                    <div
                        style={{
                            display: 'flex',
                            flex: 1,
                            flexDirection: 'column',
                            marginLeft: 10,
                            width: 'auto',
                            zIndex: 0,
                            overflow: 'auto'
                        }}
                    >
                        <CKEditor
                            editor={ClassicEditor}
                            data={description}
                            config={{
                                placeholder: '',
                                width: '100%',
                                toolbar: {
                                    items: [
                                        'heading',
                                        'MathType',
                                        'ChemType',
                                        '|',
                                        'bold',
                                        'italic',
                                        'link',
                                        'bulletedList',
                                        'numberedList',
                                        'insertTable',
                                        'blockQuote',
                                        'undo',
                                        'redo',
                                    ],
                                },
                            }}
                            style={{
                                width: '100%',
                                maxWidth: '100%'
                            }}
                            onChange={(e, editor) => {
                                const data = editor.getData();
                                setDescription(data)
                            }}
                        />
                    </div>
                    <div
                        style={{
                            display: 'flex',
                            flex: 0.8,
                            flexDirection: 'column',
                            marginLeft: 10,
                            width: 'auto',
                        }}
                    />
                </Row>
                <Row style={{ marginTop: '0.8rem' }}>
                    <label
                        style={{
                            display: 'flex',
                            flex: '1 1 0%',
                            justifyContent: 'flex-end',
                            alignItems: 'center',
                            marginRight: 10,
                            marginBottom: 0,
                            width: 'auto',
                            fontWeight: 'bold'
                        }}
                    >
                        {t('onlineLesson.frontPicture')}
                    </label>
                    <div
                        style={{
                            display: 'flex',
                            flex: 1,
                            flexDirection: 'column',
                            marginLeft: 10,
                            width: 'auto',
                        }}
                    >
                        <input
                            ref={fileUploaderRef}
                            style={{ display: 'none' }}
                            type='file'
                            accept={'image/png, image/jpeg'}
                            multiple={false}
                            placeholder={'Файл оруулна уу'}
                            onChange={(e) => {
                                if (e.target.files && e.target.files) {
                                    let files = e.target.files;
                                    const verified = verifyFile(files);
                                    if (verified) {
                                        let fileNames = '';
                                        for (let i = 0; i < files.length; i++) {
                                            if (files.length == 1) {
                                                fileNames = files[i].name;
                                            } else if (files.length == i + 1) {
                                                fileNames = fileNames + files[i].name;
                                            } else if (files.length > 1) {
                                                fileNames = fileNames + files[i].name + ', ';
                                            }
                                        }
                                        setCoverFile({
                                            fileNames: fileNames,
                                            showErrorMessage: false,
                                            files: files
                                        })
                                    }
                                }
                                // onFileInputChange(e, index, field.upperCase);
                            }}
                        // value={coverFile?.files || null}
                        />
                        <input
                            disabled={true}
                            className={'form-control'}
                            value={coverFile?.fileNames || ''}
                        />
                    </div>
                    <div
                        style={{
                            display: 'flex',
                            flex: 0.8,
                            flexDirection: 'column',
                            marginLeft: 10,
                            width: 'auto',
                        }}
                    >
                        {
                            coverFile
                                ?
                                <div>
                                    <Button onClick={() => {
                                        setCoverFile(null)
                                    }} className="btn btn-danger m-btn m-btn--icon m-btn--icon-only m-btn--circle-28 ms-2">
                                        <i className="flaticon2-cross"> </i>
                                    </Button>
                                </div>
                                :
                                <button className={'btn btn-outline-info ml-2 w-50'}
                                    onClick={() => {
                                        if (fileUploaderRef && fileUploaderRef?.current) {
                                            fileUploaderRef.current.click();
                                        }
                                    }}>{'Файл сонгох'}</button>
                        }

                    </div>
                </Row>

                {
                    !isOpen && <Row style={{ marginTop: '1rem' }}>
                        <label
                            style={{
                                display: 'flex',
                                flex: '1 1 0%',
                                justifyContent: 'flex-end',
                                alignItems: 'center',
                                marginRight: 10,
                                marginBottom: 0,
                                width: 'auto',
                                fontWeight: 'bold'
                            }}
                        >
                        </label>
                        <div
                            style={{
                                display: 'flex',
                                flex: 1,
                                flexDirection: 'column',
                                marginLeft: 10,
                                width: 'auto',
                            }}
                        >
                            <Checkbox
                                className='custom-cbox eschool-checkbox'
                                checked={!!isManualOpen}
                                onChange={() => {
                                    setIsManualOpen(!isManualOpen)
                                }}
                                label={t('onlineLesson.isManualOpen')}
                            />
                        </div>
                        <div
                            style={{
                                display: 'flex',
                                flex: 0.8,
                                flexDirection: 'column',
                                marginLeft: 10,
                                width: 'auto',
                            }}
                        />
                    </Row>
                }

            </Card.Body>
            <Card.Footer>
                <Row className='d-flex justify-content-between'>
                    <Col lg={3} />
                    <Col className='d-flex justify-content-center'>
                        <Link to="/onlineLesson/lesson">
                            <Button className="cursor-pointer cancel-button pr-4" variant='link'>
                                <span style={{ color: '#ff2f1a' }}>{t("common.cancel")}</span>
                            </Button>
                        </Link>
                        <Button className='proceed-button' variant='empty' onClick={onSubmit}>
                            <span style={{ color: '#000000' }}>{t('action.next').toUpperCase()}</span>
                        </Button>
                    </Col>
                    <Col lg={3} />
                </Row>
            </Card.Footer>

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
        </Card >
    )
}

export default SubmitLesson
