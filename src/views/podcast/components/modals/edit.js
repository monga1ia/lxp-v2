import HtmlHead from "components/html-head/HtmlHead";
import React, { useEffect, useState, useRef } from "react";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Modal, Button, Row, Col } from "react-bootstrap";
import Forms from "modules/Form/Forms";
import showMessage from "modules/message";
import { fetchRequest } from "utils/fetchRequest";
import { podcastEdit, podcastInit } from 'utils/fetchRequest/Urls';
import { useSelector } from "react-redux";
import message from "modules/message";
import { cloneDeep } from "lodash";
import useUploadVideo from '../UploadVideo';

export default function PodcastEdit({
    onClose = () => { },
    open = false,
    grades = [],
    types = [],
    podcastData
}) {
    const history = useHistory()
    const { t } = useTranslation()
    const formRef = useRef();
    const { selectedSchool } = useSelector(state => state.schoolData);
    const [loading, setLoading] = useState()
    const [gradeOptions, setGradeOptions] = useState(grades || [])
    const [typeOptions, setTypeOptions] = useState(types || [])
    const [selectedGradeIds, setSelectedGradeIds] = useState([])
    const [selectedRoleIds, setSelectedRoleIds] = useState([])
    const [selectedTypeId, setSelectedTypeId] = useState(null)
    const [selectedTypeCode, setSelectedTypeCode] = useState(null)
    const [selectedName, setSelectedName] = useState('')
    const [selectedDescription, setSelectedDescription] = useState('')
    const [isActive, setIsActive] = useState(true)
    const [removeCover, setRemoveCover] = useState(false)
    const [removeVideo, setRemoveVideo] = useState(false)
    const [selectedData, setSelectedData] = useState(podcastData || null)
    const [selectedVideo, setSelectedVideo] = useState(null)
    const [selectedImage, setSelectedImage] = useState(null)

    const { onUpload, loading: videoLoading } = useUploadVideo()

    useEffect(() => {
        if(selectedData){
            setSelectedTypeId(selectedData?.userType || null)
            setSelectedTypeCode(selectedData?.userType || '')
            let selectedIds = []
            if(selectedData?.gradeIds && selectedData?.gradeIds.length > 0){
                for(let i = 0; i < selectedData?.gradeIds.length; i++){
                    selectedIds.push(parseInt(selectedData?.gradeIds[i]))
                }
            }
            setSelectedGradeIds(selectedIds)
            setSelectedName(selectedData?.title || '')
            setSelectedDescription(selectedData?.description || '')
            setIsActive(selectedData?.isActive || false)
        }
    }, [selectedData]);
    
    useEffect(() => {
        formRef?.current?.updateFields && formRef.current?.updateFields(fields);
    }, [gradeOptions, typeOptions, selectedData, selectedTypeId, selectedName, selectedDescription, selectedGradeIds]);

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

    const onChangeImageHandler = (files, data, type) => {
        if(type == 'clear'){
            let cloneData = cloneDeep(selectedData)
            cloneData.coverFile = null
            setRemoveCover(true)
            setSelectedData(cloneData)
        } else {
            setSelectedImage(files[0])
        }
    }

    const onChangeVideoHandler = (files, data, type) => {
        if(type == 'clear'){
            let cloneData = cloneDeep(selectedData)
            cloneData.videoPath = null
            setSelectedData(cloneData)
        } else {
            if(files && files.length > 0){
                setSelectedVideo(files)    
            }
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
            className: '540',
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
        //     required: selectedTypeCode == 'TEACHER' ? true : false,
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
            isExtendedButton: selectedData?.videoPath ? false : true,
            isExtendedButtonClass: 'btn btn-outline-secondary-blue ml-2',
            isExtendedButtonText: t('newsfeed.chooseFile').toUpperCase(),
            isExtendedButtonStyle: {padding: '10px 20px', width: 140, borderRadius: 8, position: 'relative', top: 1},
            clearButton: selectedData?.videoPath ? true : false,
            onChange: onChangeVideoHandler,
            clearButtonStyle: {width: 35, height: 35, padding: 0, position: 'relative', bottom: 140, right: 35},
            fileNames: selectedData?.videoPath || null,
            isPlayable: selectedData?.videoStatus?.isPlayable,
            labelStyle: {
                fontFamily: 'PinnacleDemiBold',
                fontSize: 12,
                fontWeight: 800,
                color: '#575962',
                fontWeight: 'Bold',
                alignSelf: selectedData?.videoPath ? 'flex-start' : 'center'
            },
            path: selectedData?.videoPath || null,
            pathWidth: 540,
            pathType: 'video'
        },
        {
            key: "photo",
            label: t('podcast.thumbnail') + '*',
            type: 'fileUpload',
            accept: "image/*",
            isExtendedButton: selectedData?.coverFile ? false : true,
            isExtendedButtonClass: 'btn btn-outline-secondary-blue ml-2',
            isExtendedButtonText: t('newsfeed.chooseFile').toUpperCase(),
            isExtendedButtonStyle: {padding: '10px 20px', width: 140, borderRadius: 8, position: 'relative', top: 1},
            clearButton: selectedData?.coverFile ? true : false,
            clearButtonStyle: {width: 35, height: 35, padding: 0, position: 'relative', bottom: 166, right: 35},
            fileNames: selectedData?.coverFile || null,
            onChange: onChangeImageHandler,
            labelStyle: {
                fontFamily: 'PinnacleDemiBold',
                fontSize: 12,
                fontWeight: 800,
                color: '#575962',
                fontWeight: 'Bold',
                alignSelf: selectedData?.coverFile ? 'flex-start' : 'center'
            },
            path: selectedData?.coverFile || null,
            pathType: 'image',
            pathStyle: {width: 540, height: 350}
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

    const handleProceed = async () => {
        const [formsValid, formValues] = formRef.current.validate();
        
        if(formsValid){
            const formParams = new FormData()

            // const videoFile = formValues.find(obj => obj.key == 'video')?.files
            // const imageFile = formValues.find(obj => obj.key == 'photo')?.files
            const descriptionValue = formValues.find(obj => obj.key == 'description')?.value

            if(!selectedVideo){
                if(!selectedData.videoPath){
                    message(t('podcast.errorMessage.selectVideoFile'))
                    return
                }
            }

            if(!selectedImage){
                if(!selectedData.coverFile){
                    message(t('podcast.errorMessage.selectPhotoFile'))   
                    return
                }
            }

            if(!removeVideo){
                formParams.append('videoFile', selectedData.videoPath)
            }

            let videoResponse = ''
            if(removeVideo){
                await onUpload(selectedVideo, res => {
                    videoResponse = res?.link
                })

                formParams.append('videoFile', videoResponse)
            } else {
                if(selectedVideo){
                    await onUpload(selectedVideo, res => {
                        videoResponse = res?.link
                    })
    
                    formParams.append('videoFile', videoResponse)
                }
            }

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
            formParams.append('podcast', selectedData.id)
            formParams.append('type', selectedTypeId)
            formParams.append('grades', JSON.stringify(gradeList))
            formParams.append('roleIds', selectedRoleIds)
            formParams.append('title', selectedName)
            formParams.append('description', descriptionValue)
            formParams.append('isActive', isActive ? 1 : 0)

            if(removeCover){
                formParams.append('image', selectedImage)
                formParams.append('removeCover', 1)
            } else {
                if(selectedImage){
                    formParams.append('image', selectedImage)
                    formParams.append('removeCover', 1)
                } else {
                    formParams.append('removeCover', 0)
                }
            }

            setLoading(true)
            fetchRequest(podcastEdit, 'POST', formParams, true, true)
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
