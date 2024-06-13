import HtmlHead from "components/html-head/HtmlHead";
import React, { useEffect, useState, useRef } from "react";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Modal, Button, Row, Col } from "react-bootstrap";
import Forms from "modules/Form/Forms";
import showMessage from "modules/message";
import { fetchRequest } from "utils/fetchRequest";
import { podcastCreate, podcastInit } from 'utils/fetchRequest/Urls';
import { useSelector } from "react-redux";
import message from "modules/message";
import { toDropdownData } from "utils/utils";
import useUploadVideo from '../UploadVideo';

export default function PodcastAdd({
    onClose = () => { },
    open = false,
    types = [],
}) {
    const history = useHistory()
    const { t } = useTranslation()
    const formRef = useRef();
    const { selectedSchool } = useSelector(state => state.schoolData);
    const [loading, setLoading] = useState()
    const [gradeOptions, setGradeOptions] = useState()
    const [typeOptions, setTypeOptions] = useState(types || [])
    const [selectedGradeIds, setSelectedGradeIds] = useState([])
    const [selectedRoleIds, setSelectedRoleIds] = useState([])
    const [selectedTypeId, setSelectedTypeId] = useState(null)
    const [selectedTypeCode, setSelectedTypeCode] = useState(null)
    const [selectedVideo, setSelectedVideo] = useState(null)
    const [selectedImage, setSelectedImage] = useState(null)
    const [selectedName, setSelectedName] = useState('')
    const [selectedDescription, setSelectedDescription] = useState('')
    const [isActive, setIsActive] = useState(true)

    const { onUpload, loading: videoLoading } = useUploadVideo()

    const onHandlerType = (value) => {
        setSelectedTypeId(value)
        setSelectedTypeCode(value)
        setSelectedGradeIds([])
        setSelectedRoleIds([])

        let params = {
            school: selectedSchool.id,
            type: value
        }

        setLoading(true)
        fetchRequest(podcastInit, 'POST', params)
            .then((res) => {
                if (res.success) {
                    setGradeOptions(toDropdownData(res?.grades, 'id', 'name') || [])
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

    const onHandlerGrade = (value) => {
        setSelectedGradeIds(value)
    }

    const onHandlerRole = (value) => {
        setSelectedRoleIds(value)
    }

    const onHandlerName = (e) => {
        setSelectedName(e.target.value)
    }

    const handlerIsActive = (value) => {
        setIsActive(value)
    }

    const onHandlerDescription = (e) => {
        setSelectedDescription(e.target.value)
    }

    const onHandlerVideo = (files) => {
        if(files && files.length > 0){
            setSelectedVideo(files)    
        }
    }

    const onHandlerImage = (files) => {
        if(files && files.length > 0){
            setSelectedImage(files[0])    
        }
    }

    const fields = [
        {
            key: 'type',
            label: t('podcast.lessonType') + '*',
            value: selectedTypeId || null,
            type: 'dropdown',
            options: typeOptions || [],
            onChange: onHandlerType,
            required: true,
            searchable: true,
            clearable: true,
            multiple: false,
            errorMessage: t('podcast.errorMessage.selectLessonType'),
            labelStyle: {
                fontFamily: 'PinnacleDemiBold',
                fontSize: 12,
                fontWeight: 800,
                color: '#575962',
            },
        },
        {
            key: 'grade',
            label: t('exam.level') + '*',
            value: selectedGradeIds || null,
            type: 'dropdown',
            options: gradeOptions || [],
            onChange: onHandlerGrade,
            multiple: true,
            required: selectedTypeCode == 'STUDENT' || selectedTypeCode == 'PARENT' ? true : false,
            searchable: true,
            clearable: true,
            hidden: selectedTypeCode == 'TEACHER' ? true : false,
            errorMessage: t('errorMessage.selectGrade'),
            labelStyle: {
                fontFamily: 'PinnacleDemiBold',
                fontSize: 12,
                fontWeight: 800,
                color: '#575962',
            },
        },
        // {
        //     key: 'role',
        //     label: t('common.role') + '*',
        //     value: selectedRoleIds || null,    
        //     type: 'dropdown',
        //     options: gradeOptions || [],
        //     onChange: onHandlerRole,
        //     multiple: true,
        //     hidden: selectedTypeCode == 'TEACHER' ? true : false,
        //     searchable: true,
        //     clearable: true,
        //     hidden: selectedTypeCode == 'STUDENT' || selectedTypeCode == 'PARENT' ? true : (!selectedTypeCode ? true : false),
        //     errorMessage: t('errorMessage.selectGrade'),
        //     labelStyle: {
        //         fontFamily: 'PinnacleDemiBold',
        //         fontSize: 12,
        //         fontWeight: 800,
        //         color: '#575962',
        //     },
        // },
        {
            key: 'name',
            label: t('podcast.name') + '*',
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
            key: 'description',
            label: t('podcast.description') + '*',
            value: selectedDescription || '',
            onChange: onHandlerDescription,
            alignItems: 'top',
            type: 'richEditor',
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
            key: "video",
            label: t('podcast.file') + '*',
            type: 'fileUpload',
            accept: '.mp4,video/*',
            isExtendedButton: true,
            isExtendedButtonClass: 'btn btn-outline-secondary-blue ml-2',
            isExtendedButtonText: t('newsfeed.chooseFile').toUpperCase(),
            isExtendedButtonStyle: {padding: '10px 20px', width: 140, borderRadius: 8, position: 'relative', top: 1},
            onChange: onHandlerVideo,
            labelStyle: {
                fontFamily: 'PinnacleDemiBold',
                fontSize: 12,
                fontWeight: 800,
                color: '#575962',
            },
        },
        {
            key: "photo",
            label: t('podcast.thumbnail') + '*',
            type: 'fileUpload',
            accept: "image/*",
            isExtendedButton: true,
            isExtendedButtonClass: 'btn btn-outline-secondary-blue ml-2',
            isExtendedButtonText: t('newsfeed.chooseFile').toUpperCase(),
            isExtendedButtonStyle: {padding: '10px 20px', width: 140, borderRadius: 8, position: 'relative', top: 1},
            onChange: onHandlerImage,
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
            value: isActive || false,  
            type: 'checkbox',
            onChange: handlerIsActive,
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
    }, [typeOptions, gradeOptions, typeOptions, selectedTypeCode]);

    const handleProceed = async () => {
        const [formsValid, formValues] = formRef.current.validate();

        if(formsValid){
            const formParams = new FormData()

            // const videoFile = formValues.find(obj => obj.key == 'video')?.files
            // const imageFile = formValues.find(obj => obj.key == 'photo')?.files
            const descriptionValue = formValues.find(obj => obj.key == 'description')?.value

            if(!selectedVideo){
                message(t('podcast.errorMessage.selectVideoFile'))
                return
            }

            if(!selectedImage){
                message(t('podcast.errorMessage.selectPhotoFile'))   
                return
            }

            let videoResponse = ''
            await onUpload(selectedVideo, res => {
                videoResponse = res?.link
            })

            let gradeList = []
            if(selectedGradeIds && selectedGradeIds.length > 0){
                for(let i = 0; i < selectedGradeIds.length; i++){
                    let existing = gradeOptions.find(obj => obj.value == selectedGradeIds[i])

                    if(existing){
                        gradeList.push({
                            id: existing.value,
                            name: existing.text
                        })
                    }
                }
            }
            
            formParams.append('school', selectedSchool.id)
            formParams.append('type', selectedTypeId)
            formParams.append('grades', JSON.stringify(gradeList))
            formParams.append('roleIds', selectedRoleIds)
            formParams.append('title', selectedName)
            formParams.append('description', descriptionValue)
            formParams.append('isActive', isActive ? 1 : 0)
            formParams.append('videoFile', videoResponse)
            formParams.append('image', selectedImage)

            setLoading(true)
            fetchRequest(podcastCreate, 'POST', formParams, true, true)
                .then((res) => {
                    if (res.success) {
                        //
                        onClose(1)
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
        <Modal
            show={open}
            onHide={onClose}
            size="xl"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header className="p-3">
                <Modal.Title className="modal-title d-flex flex-row justify-content-between w-100" style={{ textTransform: 'none' }}>
                    {t('podcast.title')}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className="podcast-forms-style">
                <Forms 
                    ref={formRef} 
                    fields={fields} 
                />
            </Modal.Body>
            <Modal.Footer style={{padding: '1rem 2rem'}}>
                <div className="text-center">
                    <Button className='cancel-button' variant='link' onClick={onClose}>
                        <span style ={{color: '#ff2f1a'}}>{t('common.cancel')}</span> 
                    </Button>
                    <Button className="cursor-pointer save-button" variant='empty' onClick={handleProceed}>
                        <span style={{ color: '#555555' }}>{t("common.save")}</span>
                    </Button>
                </div>
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
            {
                videoLoading &&
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
