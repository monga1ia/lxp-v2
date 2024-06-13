import React, { useState, useRef, useEffect } from "react";
import ClassicEditor from "ckeditor5-build-classic-mathtype";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import { useTranslation } from "react-i18next";
import ButtonOutline from "components/buttons/ButtonOutline";
import CloseButton from "components/buttons/CloseButton";
import Select from "modules/Form/Select";
import { Button, Modal } from "react-bootstrap";
import showMessage from "modules/message";
import { fetchRequest } from "utils/fetchRequest";
import { examTemplateQuestionCreate, examTemplateQuestionEdit } from 'utils/fetchRequest/Urls';

export default function GroupQuestionsModal({ 
    show, 
    onClose, 
    selectedSchool,
    templateId, 
    variantId,
    onDoneAction,
    question
}) {
    const { t } = useTranslation();
    const imageInputRef = useRef(null)

    const [loading, setLoading] = useState(false)
    const [questionValue, setQuestionValue] = useState('')
    const [imageValue, setImageValue] = useState(null)
    const [audioFileValue, setAudioFileValue] = useState(null)
    const [image, setImage] = useState(null)
    const [isDeleteImage, setIsDeleteImage] = useState(false)
    const [isDeleteAudio, setIsDeleteAudio] = useState(false)
    const [selectedQuestionIds, setSelectedQuestionIds] = useState([])
    const [questionOptions, setQuestionOptions] = useState([])
    const regex = /(<([^>]+)>)/gi;

    const handleFileSelect = (e) => {
        // Do something with the selected file
        const file = e.target.files[0]
        setAudioFileValue(file)
    }

    const init = (params) => {
        setLoading(true)
        fetchRequest(examTemplateQuestionCreate, 'POST', params, true, true)
            .then((res) => {
                setLoading(false)
                if (res.success) {
                    const { questions = [] } = res

                    let filterQuestions = []
                    if(questions && questions.length > 0){
                        for(let i = 0; i < questions.length; i++){
                            if(!questions[i].parentQuestionId){
                                filterQuestions.push({
                                    value: questions[i].questionId, 
                                    text: (questions[i].content).replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g,'&').replace(/&nbsp;/g,'').replace(regex, "")
                                })
                            }
                        }
                    }
                    setQuestionOptions(filterQuestions)
                } else {
                    showMessage(res.message)
                }
            })
            .catch(() => {
                showMessage(t('errorMessage.title'));
                setLoading(false)
            })
    }

    useEffect(() => {
        if(question){
            if(question.parentQuestion && question.parentQuestion.files && question.parentQuestion.files.length > 0){
                let files = question.parentQuestion.files
                for(let i = 0; i < files.length; i++){
                    if(files[i].type == 'image/png' || files[i].type ==  'image/jpeg'){
                        setImage(files[i].path)
                    } else if(files[i].type == 'audio/mpeg'){
                        setAudioFileValue(files[i])
                    }
                }
            }

            setQuestionValue((question?.parentQuestion?.content).replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g,'&').replace(regex, "") || '')
        } else {
            const bodyParams = new FormData();

            bodyParams.append('school', selectedSchool?.id)
            bodyParams.append('template', templateId)
            bodyParams.append('variant', variantId)
            bodyParams.append('submit', 0)
    
            init(bodyParams);
        }
    }, []);
    
    useEffect(() => {
        CKEditor.editorUrl =
            "https://cdn.ckeditor.com/ckeditor5/39.0.2/classic/ckeditor.js";
    }, [])

    const handleButtonClick = () => {
        const fileInput = document.createElement('input')
        fileInput.type = 'file'
        fileInput.accept = 'audio/mp3,audio/*;capture=microphone'
        fileInput.onchange = handleFileSelect
        fileInput.click()
    }

    const onImageClick = () => {
        imageInputRef?.current?.click();
    }

    const onLoadImage = (e) => {
        if (e?.target?.files && e?.target?.files.length > 0) {
            setImageValue(e?.target?.files[0])
            e.currentTarget.value = null
        } else {
            setImageValue(null)
        }
    }

    const onChangeQuestion = (value) => {
        setSelectedQuestionIds(value)
    }

    const saveButtonClick = () => {
        if(!question && selectedQuestionIds && selectedQuestionIds.length == 0){
            showMessage(t('errorMessage.selectQuestion'), false)
            return null
        }

        const bodyParams = new FormData();

        bodyParams.append('school', selectedSchool?.id)
        bodyParams.append('template', templateId)
        bodyParams.append('variant', variantId)
        bodyParams.append('submit', 1)

        bodyParams.append('content', questionValue)
        bodyParams.append('file', imageValue)
        bodyParams.append('audio', audioFileValue)
        bodyParams.append('questions', JSON.stringify(selectedQuestionIds))

        let url = examTemplateQuestionCreate

        if(question){
            bodyParams.append('question', question?.parentQuestion?.id || null)
            bodyParams.append('isDeleteImage', isDeleteImage ? 1 : 0)
            bodyParams.append('isDeleteAudio', isDeleteAudio ? 1 : 0)
            url = examTemplateQuestionEdit
        }

        setLoading(true)
        fetchRequest(url, 'POST', bodyParams, true, true)
            .then((res) => {
                setLoading(false)
                if (res.success) {
                    onDoneAction()
                } else {
                    showMessage(res.message)
                }
            })
            .catch(() => {
                showMessage(t('errorMessage.title'));
                setLoading(false)
            })
    }

    return (
        <Modal
            show={show}
            onHide={onClose}
            size='xl'
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header className="p-3">
                <Modal.Title className="modal-title d-flex flex-row justify-content-between w-100">
                    {t("quiz.groupQuestions")}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div>
                    <p className="my-2 modal-select-title">{t("quiz.task")}</p>
                    <CKEditor
                        // key={Math.random()}
                        editor={ClassicEditor}
                        data={questionValue}
                        config={{
                            width: '100px',
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
                        onChange={(event, editor) => {
                            const data = editor.getData();
                            setQuestionValue(data)
                        }}
                    />
                    {
                        image
                        ?
                            <div className="d-flex flex-row mt-4">
                                <div className="position-relative ml-4 mt-2">
                                    <img alt="answer" src={image} style={{
                                        width: 150,
                                        objectFit: 'contain'
                                    }} />
                                    <CloseButton className="absolute" onClick={() => {
                                        setIsDeleteImage(true)
                                        setImage(null)
                                        setImageValue(null)
                                    }} />
                                </div>
                            </div>
                        :
                            <div className="d-flex flex-row mt-4">
                                <p className="my-2 mr-2 modal-select-title">{t("quiz.taskImage")}</p>

                                <input type='file'
                                    accept="image/png, image/jpeg"
                                    onChange={onLoadImage} ref={imageInputRef}
                                    style={{
                                        display: 'none'
                                    }}
                                />

                                {
                                    imageValue
                                        ?
                                        <div className="position-relative ml-4 mt-2">
                                            <img alt="answer" src={URL.createObjectURL(imageValue)} style={{
                                                width: 150,
                                                objectFit: 'contain'
                                            }} />
                                            <CloseButton className="absolute" onClick={() => {
                                                setImageValue(null)
                                            }} />
                                        </div>
                                        :
                                        <ButtonOutline text={t("quiz.chooseImage")} onClick={onImageClick} />
                                }
                            </div>
                    }
                    <div className="d-flex flex-row mt-4 align-items-center flex-wrap audio-section">
                        <p className="my-2 modal-select-title mr-4">{t("quiz.addAudioFile")}</p>
                        <div style={{ display: 'inline-flex', alignItems: 'center' }}>
                            <input disabled className="modal-input" placeholder={audioFileValue?.name || t("quiz.placeholderFileText")} style={{ marginRight: 5 }} />
                            {
                                audioFileValue && <CloseButton onClick={() => {
                                    setIsDeleteAudio(true)
                                    setAudioFileValue(null)
                                }} />
                            }
                        </div>

                        <ButtonOutline className="ml-4" onClick={handleButtonClick} text={t("quiz.chooseFile")} />
                    </div>
                </div>
                {
                    !question &&
                    <div className="mt-4">
                        <p className="my-2 modal-select-title mr-4">
                            {t("quiz.relatedQuestions")}*
                        </p>
                        <Select
                            multiple
                            clearable
                            options={questionOptions}
                            value={selectedQuestionIds}
                            onChange={(value) => onChangeQuestion(value)}
                        />
                    </div>
                }
            </Modal.Body>
            <Modal.Footer className="p-3">
                <div className="d-flex flex-row justify-content-center align-items-center w-100">
                    <div className="d-flex align-items-center">
                        <Button className='cancel-button' variant='link' onClick={onClose}>
                            <span style={{ color: '#ff2f1a' }}>{t("common.cancel")}</span>
                        </Button>
                        <Button className='save-button ml-2 text-uppercase' variant='empty' onClick={saveButtonClick}>
                            <span style={{ color: '#000000' }}>{t("common.save")} </span>
                        </Button>
                    </div>
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
        </Modal>
    );
}
