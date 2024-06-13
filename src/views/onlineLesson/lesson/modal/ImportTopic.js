import React, { useState, useRef, useEffect } from "react";
import { Card, Col, Row, Button, Modal } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useBottomScrollListener } from 'react-bottom-scroll-listener';
import Forms from 'modules/Form/Forms';
import Checkbox from "modules/Form/Checkbox";
import { fetchRequest } from "utils/fetchRequest";
import { curriculumPlan } from 'utils/fetchRequest/Urls';
import showMessage from "modules/message";

export default function ImportTopic({
    show = true,
    existingTopics = [],
    onClose = () => { },
    onSubmit = () => { },
    isParent = false,
    isMdGrade = 0,
    selectedSchool,
    course,
    gradeSubjects = [],
    grade,
    gradeName,
    subject,
    subjectName,
    parentTopic,
    parentTopicName
}) {
    const { t } = useTranslation();
    const formRef = useRef()
    const [loading, setLoading] = useState(false)
    const [topics, setTopics] = useState([])

    const generalInfoFields = gradeSubjects && gradeSubjects?.length > 0
        ? [
            {
                key: "grade",
                label: t('curriculum.grade') + "*",
                value: JSON.stringify(gradeSubjects?.map(obj => obj.gradeId)) || null,
                type: "dropdown",
                searchable: true,
                options: [{
                    value: JSON.stringify(gradeSubjects?.map(obj => obj.gradeId)),
                    text: gradeSubjects?.map(obj => obj.gradeName)?.toString()
                }],
                labelStyle: {
                    fontWeight: 'Bold'
                },
                disabled: true
            },
            {
                key: "subject",
                label: t('exam.subject') + "*",
                value: JSON.stringify(gradeSubjects?.map(obj => obj.subjectId)) || null || null,
                type: "dropdown",
                searchable: true,
                options: [
                    {
                        value: JSON.stringify(gradeSubjects?.map(obj => obj.subjectId)),
                        text: gradeSubjects?.map(obj => obj.subjectName)?.toString()
                    }
                ],
                labelStyle: {
                    fontWeight: 'Bold'
                },
                disabled: true
            }
        ]
        : [
            {
                key: "grade",
                label: t('curriculum.grade') + "*",
                value: grade || null,
                type: "dropdown",
                searchable: true,
                options: [
                    {
                        value: grade,
                        text: gradeName
                    }
                ],
                labelStyle: {
                    fontWeight: 'Bold'
                },
                disabled: true
            },
            {
                key: "subject",
                label: t('exam.subject') + "*",
                value: subject || null,
                type: "dropdown",
                searchable: true,
                options: [
                    {
                        value: subject,
                        text: subjectName
                    }
                ],
                labelStyle: {
                    fontWeight: 'Bold'
                },
                disabled: true
            }
        ]

    const generalInfoChildFields = gradeSubjects && gradeSubjects?.length > 0
        ? [
            {
                key: "grade",
                label: t('curriculum.grade') + "*",
                value: JSON.stringify(gradeSubjects?.map(obj => obj.gradeId)) || null,
                type: "dropdown",
                searchable: true,
                options: [
                    {
                        value: JSON.stringify(gradeSubjects?.map(obj => obj.gradeId)),
                        text: gradeSubjects?.map(obj => obj.gradeName)?.toString()
                    }
                ],
                labelStyle: {
                    fontWeight: 'Bold'
                },
                disabled: true
            },
            {
                key: "subject",
                label: t('exam.subject') + "*",
                value: JSON.stringify(gradeSubjects?.map(obj => obj.subjectId)) || null,
                type: "dropdown",
                searchable: true,
                options: [
                    {
                        value: JSON.stringify(gradeSubjects?.map(obj => obj.subjectId)),
                        text: gradeSubjects?.map(obj => obj.subjectName)?.toString()
                    }
                ],
                labelStyle: {
                    fontWeight: 'Bold'
                },
                disabled: true
            },
            {
                key: "parentTopic",
                label: t('curriculum.unitSubject') + "*",
                value: parentTopic || null,
                type: "dropdown",
                searchable: true,
                options: [
                    {
                        value: parentTopic,
                        text: parentTopicName
                    }
                ],
                labelStyle: {
                    fontWeight: 'Bold'
                },
                disabled: true
            }
        ] :
        [
            {
                key: "grade",
                label: t('curriculum.grade') + "*",
                value: grade || null,
                type: "dropdown",
                searchable: true,
                options: [
                    {
                        value: grade,
                        text: gradeName
                    }
                ],
                labelStyle: {
                    fontWeight: 'Bold'
                },
                disabled: true
            },
            {
                key: "subject",
                label: t('exam.subject') + "*",
                value: subject || null,
                type: "dropdown",
                searchable: true,
                options: [
                    {
                        value: subject,
                        text: subjectName
                    }
                ],
                labelStyle: {
                    fontWeight: 'Bold'
                },
                disabled: true
            },
            {
                key: "parentTopic",
                label: t('curriculum.unitSubject') + "*",
                value: parentTopic || null,
                type: "dropdown",
                searchable: true,
                options: [
                    {
                        value: parentTopic,
                        text: parentTopicName
                    }
                ],
                labelStyle: {
                    fontWeight: 'Bold'
                },
                disabled: true
            }
        ]

    const init = (params) => {
        setLoading(true)
        fetchRequest(curriculumPlan, 'POST', params)
            .then((res) => {
                setLoading(false)
                if (res.success) {
                    let list = [];
                    if (!isParent) {
                        list = res?.childTopics
                    } else {
                        list = res?.parentTopics
                    }
                    const cloneList = [];
                    if (existingTopics && existingTopics?.length > 0) {
                        for (let i = 0; i < list?.length; i++) {
                            if (existingTopics.indexOf(list[i]?.id) > -1) {
                                // already used
                            } else {
                                cloneList.push(list[i])
                            }
                        }
                        setTopics(cloneList)
                    } else {
                        setTopics(list)
                    }
                } else {
                    showMessage(res.message)
                }
            })
            .catch(() => {
                showMessage(t('errorMessage.title'));
                setLoading(false)
            })
    }

    const callback = () => {
        // if (!loading && totalCount > list.length) {
            // let params = {
            //     school: selectedSchool.id,
            //     course: courseId,
            //     grade: selectedGradeId,
            //     subject: selectedSubjectId,
            //     showQuestion: 1,
            //     page: (parseInt(currentPage) + 1)
            // }

            // init(params, currentPage);
        // }
    }

    const scrollRef = useBottomScrollListener(callback, 0, 200, undefined, true);

    useEffect(() => {
        if (formRef?.current?.updateFields) {
            if (!isParent && parentTopic) {
                formRef.current?.updateFields(generalInfoChildFields)
            } else {
                formRef.current?.updateFields(generalInfoFields)
            }
        }

        let params = {}
        if (gradeSubjects && gradeSubjects.length > 0) {
            const gradeIds = [];
            const subjectIds = [];
            for (let gs = 0; gs < gradeSubjects.length; gs++) {
                subjectIds.push(gradeSubjects[gs].subjectId)
                gradeIds.push(gradeSubjects[gs].gradeId)
            }
            params = {
                school: selectedSchool?.id,
                parentTopic: isParent ? null : parentTopic,
                grades: gradeIds,
                subjects: subjectIds,
                active: 1,
                topicResult: 1,
                isMdGrade
            }
        } else {
            params = {
                school: selectedSchool?.id,
                parentTopic,
                grade: grade,
                subject: subject,
                active: 1,
                topicResult: 1,
                isMdGrade
            }
        }

        init(params)
    }, [parentTopic]);

    const checkboxHandler = (topicId = null, isChecked = true) => {
        const topicList = [...topics]
        for (let t = 0; t < topicList?.length; t++) {
            if (topicList[t]?.id === topicId) {
                topicList[t].checked = isChecked;
                break;
            }
        }
        setTopics(topicList)
    }

    return (
        <Modal
            show={show}
            onHide={onClose}
            size='xl'
            aria-labelledby="contained-modal-title-vcenter"
            centered
            fullscreen
            scrollable
        >
            <Modal.Header className="p-3">
                <Modal.Title className="modal-title d-flex flex-row justify-content-between w-100">
                    {isParent ? t("curriculum.unitSubject") : t("school.regularSubject")}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body ref={scrollRef} style={{ minHeight: 500 }}>
                <Forms ref={formRef} fields={(!isParent && parentTopic ? generalInfoChildFields : generalInfoFields)} />
                <Row className="mt-4">
                    {
                        topics?.map(topicObj => {
                            return <Row key={'topic_' + topicObj?.id}>
                                <Col md={1}>
                                    <Checkbox
                                        className="mt-4"
                                        style={{
                                            float: 'right'
                                        }}
                                        checked={topicObj?.checked}
                                        onChange={() => checkboxHandler(topicObj?.id, !topicObj?.checked)}
                                    />
                                </Col>
                                <Col md={10}>
                                    <Card className="mb-3" style={topicObj?.checked ? {
                                        border: '1px solid #FF5B1D',
                                        backgroundColor: '#FAE9E3'
                                    } : {
                                        border: '1px solid rgb(230, 230, 230)',
                                    }}>
                                        <Card.Body style={{ paddingTop: '1rem', paddingBottom: '1rem', cursor: 'pointer' }}
                                            onClick={() => {
                                                checkboxHandler(topicObj?.id, !topicObj?.checked)
                                            }}
                                        >
                                            <div>
                                                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                                                    <div style={{ maxWidth: '70%' }}>
                                                        <p>
                                                            {topicObj.name}
                                                        </p>
                                                    </div>
                                                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>

                                                    </div>
                                                </div>
                                                {
                                                    !isParent && <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
                                                        <div style={{
                                                            display: 'block',
                                                            textOverflow: 'ellipsis',
                                                            wordWrap: 'break-word',
                                                            overflow: 'hidden',
                                                            maxHeight: '3em',
                                                            lineHeight: '1.5em'
                                                        }}>{topicObj.purpose}</div>
                                                    </div>
                                                }
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            </Row>
                        })
                    }
                </Row>
            </Modal.Body>
            <Modal.Footer className="p-3 text-center">
                <Button className='cancel-button' variant='link' onClick={onClose}>
                    <span style={{ color: '#ff2f1a' }}>{t("common.cancel")}</span>
                </Button>
                <Button className='save-button ml-2 text-uppercase' variant='empty' onClick={() => onSubmit(topics)}>
                    <span style={{ color: '#000000' }}>{t("common.select")} </span>
                </Button>
            </Modal.Footer>
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
        </Modal>
    );
}
