import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Button, Col, Modal, Row } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { Checkbox, FormControlLabel } from "@mui/material";
import Forms from 'modules/Form/Forms';
import { fetchRequest } from 'utils/fetchRequest';
import message from "modules/message";

const RegularAdd = ({
    open = false,
    onClose = () => { },
    course = null,
    tmpTopic = null,
    parentTopics = [],
    parentTopic = null,
    school
}) => {
    const { t, i18n } = useTranslation()
    const formRef = useRef()

    const [createAgain, setCreateAgain] = useState(false)
    const [loading, setLoading] = useState(false)

    const [unitOptions, setUnitOptions] = useState(parentTopics)
    const [item, setItem] = useState({
        parentTopic,
        description: tmpTopic?.name || '',
        purpose: tmpTopic?.purpose || ''
    })

    const onSubmitData = () => {
        const [formsValid, formValues] = formRef.current.validate();

        if (formsValid) {
            let url = 'api/course/topic-create';
            if (tmpTopic) {
                url = 'api/course/topic-update';
            }
            const params = {
                school,
                course,
                id: tmpTopic?.id,
                parent: parentTopic,
                name: formValues.find(obj => obj.key == 'topic')?.value,
                purpose: formValues.find(obj => obj.key == 'purpose')?.value,
            }
            setLoading(true)
            fetchRequest(url, 'POST', params)
                .then(res => {
                    if (!res.success) {
                        message(res.message)
                    } else {
                        if (createAgain) {
                            setItem({
                                parentTopic: res?.selectedParent,
                                description: '',
                                purpose: ''
                            })
                        } else {
                            onClose('unit')
                        }
                    }
                })
                .catch(() => {
                    message(t('errorMessage.title'));
                })
                .finally(() => {
                    setLoading(false)
                })
        }
    }

    const fields = useMemo(() => {
        return [
            {
                key: "parentTopic",
                label: t('curriculum.unitSubject') + "*",
                value: item?.parentTopic || '',
                type: "dropdown",
                disabled: true,
                searchable: true,
                options: unitOptions?.map(unitObj => {
                    return {
                        value: unitObj?.id,
                        text: unitObj?.name
                    }
                }),
                labelStyle: {
                    fontWeight: 'Bold'
                }
            },
            {
                key: "topic",
                label: t('school.regularSubject') + "*",
                value: item?.description || '',
                type: "textArea",
                labelStyle: {
                    fontWeight: 'Bold'
                },
                style: {
                    minHeight: 100
                }
            },
            {
                key: "purpose",
                label: t('common.description') + "*",
                value: item?.purpose || '',
                type: "textArea",
                labelStyle: {
                    fontWeight: 'Bold'
                }
            }
        ]
    }, [i18n.language, item, unitOptions])

    useEffect(() => {
        if (formRef?.current?.updateFields) {
            formRef.current?.updateFields(fields)
        }
    }, [item, unitOptions]);

    return (
        <Modal
            show={open}
            onHide={onClose}
            size="xl"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header className="p-3">
                <Modal.Title className="modal-title d-flex flex-row justify-content-between w-100" style={{ textTransform: 'none' }}>
                    {tmpTopic ? t('onlineLesson.topicEdit') : t('onlineLesson.topicAdd')}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Forms ref={formRef} fields={fields} />
            </Modal.Body>
            <Modal.Footer style={{ padding: '0.75rem' }}>
                <Row className='d-flex'>
                    <Col lg={3}>
                        {
                            !tmpTopic && <FormControlLabel
                                control={
                                    <Checkbox
                                        sx={{ '&.Mui-checked': { color: '#ff5b1d' } }}
                                        checked={createAgain}
                                        style={{ pading: 0 }}
                                        onChange={(e, value) => setCreateAgain(value)}
                                    />
                                }
                                label="Дахин утга оруулах"
                            />
                        }
                    </Col>
                    <Col className='d-flex justify-content-center'>
                        <Button className="cursor-pointer cancel-button pr-4" variant='link' onClick={onClose}
                            style={{ height: 34 }}>
                            <span style={{ color: '#ff2f1a' }}>{t("common.cancel")}</span>
                        </Button>
                        <Button className="cursor-pointer save-button" variant='empty' onClick={onSubmitData}>
                            <span style={{ color: '#555555' }}>{t("common.save")}</span>
                        </Button>
                    </Col>
                    <Col lg={3} />
                </Row>
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
    )
}

export default RegularAdd
