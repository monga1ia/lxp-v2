import { Checkbox, FormControlLabel } from "@mui/material";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Modal, Button, Row, Col } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import Forms from "modules/Form/Forms";
import { fetchRequest } from "utils/fetchRequest";
import message from "modules/message";
import { useSelector } from "react-redux";
import { toDropdownArray } from "utils/utils";
import { isNull } from "lodash";

const SubmitModal = ({
    onClose = () => { },
    open = false,
    types = [],
    component = null
}) => {
    const { t, i18n } = useTranslation()
    const formRef = useRef()

    const { selectedSchool } = useSelector(state=>state.schoolData) || {}
    
    const [createAgain, setCreateAgain] = useState(false)
    const [item,setItem] = useState(null)

    const [loading,setLoading] = useState(false)

    const onSubmitData = () => {
        const [formsValid, formValues] = formRef.current.validate();

        if(formsValid) {
            const formData = new FormData()
            const file = formValues.find(obj=>obj.key == 'icon')

            if(component) formData.append('component', component.id)

            formData.append('school', selectedSchool?.id)
            formData.append('name', formValues.find(obj=>obj.key == 'name')?.value)
            formData.append('componentType', formValues.find(obj=>obj.key == 'type')?.value)
            formData.append('color', formValues.find(obj=>obj.key == 'color')?.value)
            if(file && file.files?.length > 0) {
                formData.append('icon', file.files[0])
            }

            setLoading(true)

            let url = 'api/course/component/create'
            if(component) {
                url = 'api/course/component/edit'
            }
            
            fetchRequest(url, "POST", formData, true, true)
                .then(res=>{
                    if (res.success) {
                        if(!createAgain) {
                            onClose()
                        } else {
                            setItem({
                                name: '',
                                type: null,
                                color: '',
                                icon: ''
                            })
                        }
                        message(res.message, true)
                    } else {
                        message(res.message)
                    }
                })
                .catch(e=>{
                    message(t('errorMessage.title'));
                })
                .finally(()=>{
                    setLoading(false)
                })
        } else {
            message(t('errorMessage.invalidParams'))
        }
    }

    const fields = useMemo(()=>{
        return [
            {
                key: "name",
                label: "Бүрдэлийн нэр*",
                value: item?.name || '',
                type: "text",
                labelStyle: {
                    fontWeight: 'Bold'
                },
                required: true
            },
            {
                key: "type",
                label: "Бүрдэлийн төрөл*",
                value: item?.type || '',
                type: "dropdown",
                options: toDropdownArray(types,'id','name'),
                labelStyle: {
                    fontWeight: 'Bold'
                },
                required: true
            },
            {
                key: "color",
                label: "Өнгө",
                value: item?.color || '',
                type: "colorPicker",
                labelStyle: {
                    fontWeight: 'Bold'
                }
            },
            {
                label: "Icon",
                type: "fileUpload",
                key: "icon",
                isExtendedButton: true,
                isExtendedButtonClass: 'btn btn-outline-info ml-2 w-50',
                isExtendedButtonText: "Файл сонгох",
                fileNames: item?.iconFile || '',
                inputFlex: 0,
                labelStyle: {
                    fontWeight: 'Bold'
                }
            }
        ]
    },[types, i18n.language, item])

    useEffect(() => {
        if(formRef?.current?.updateFields && item){
            formRef.current?.updateFields(fields)
        }
    }, [item, types]);

    useEffect(()=>{
        if(component && open) {
            setItem({
                ...component,
                type: component.typeId
            })
        } else {
            setItem(null)
        }
    },[component, open])

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
                    Бүрдэл
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Forms ref={formRef} fields={fields} />
            </Modal.Body>
            <Modal.Footer>
                <Row className='d-flex justify-content-between'>
                    <Col lg={3}>
                        {
                            isNull(component)
                            ?
                                <FormControlLabel
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
                            : null
                        }
                    </Col>
                    <Col className='d-flex justify-content-center'>
                        <Button className="cursor-pointer cancel-button pr-4" variant='link' onClick={onClose}>
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

export default SubmitModal
