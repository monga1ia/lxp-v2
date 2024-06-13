import Forms from 'modules/Form/Forms'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Button, Card, Col, Image, Modal, Row } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { ControlPoint } from '@material-ui/icons';
import FileUpIcon from 'cs-line-icons/custom/FileUpIcon';
import { ArrowDownward, ArrowUpward } from '@mui/icons-material';
import ClassicEditor from "ckeditor5-build-classic-mathtype";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import generator from "crossword-layout-generator";
import { fetchRequest } from 'utils/fetchRequest';
import message from 'modules/message';
import CrossWordComponent from 'modules/CrossWord';
import { toDropdownData, listToCrosswordObj } from 'utils/utils';
import "../../../../modules/DataTable/datatable.scss"
import TrashIcon from 'cs-line-icons/custom/Trash';
import EditIcon from 'cs-line-icons/custom/EditIcon';
import ContextMenu from 'views/onlineLesson/component/ContextMenu';
import { getIcon } from 'views/onlineExam/questions/question';
import RadioButton from 'components/buttons/RadioButton';
import ContentEditable from 'react-contenteditable';
import { ResizeProvider, ResizeConsumer } from "react-resize-context";
import useUploadVideo from '../UploadVideo';
import ReactAudioPlayer from 'react-audio-player';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ButtonOutline from "components/buttons/ButtonOutline";
import CloseButton from "components/buttons/CloseButton";
import ViewModal from "./ViewModal";
import CrosswordModal from "./CrosswordModal";

const ContentSubmit = ({
    open = false,
    onClose = () => { },
    onQuestionBank = () => { },
    onQuestionAdd = () => { },
    onQuestionEdit = () => { },
    onQuestionTypeSelected = () => { },
    questions = [],
    from = '',
    id = null,
    course = null,
    courseExam = null,
    topic = null,
    topicName = null,
    school = null,
    types = [],
    questionChanged = false,
    closed = false,
    selectedRow = null,
}) => {
    const formRef = useRef()
    const { t, i18n } = useTranslation()
    const frontRef = useRef([])
    const backRef = useRef([])

    const [item, setItem] = useState(null)
    const [exam, setExam] = useState(null)

    const [selectedType, setSelectedType] = useState(from || null)
    const [typeCode, setTypeCode] = useState(null)
    const [selectedPath, setSelectedPath] = useState(null)
    const [showModal, setShowModal] = useState(false)
    const [loading, setLoading] = useState(false)
    const [crosswordModal, setCrosswordModal] = useState(false)
    const [selectedTabIndex, setSelectedTabIndex] = useState(0)

    const [questionList, setQuestionsList] = useState(questions)
    const [dialogCards, setDialogCards] = useState([{
        front: {
            text: '',
            image: null,
            audio: null,
            tabIndex: 0
        },
        back: {
            text: '',
            image: null,
            audio: null,
            tabIndex: 0
        }
    }])

    const { onUpload, loading: videoLoading } = useUploadVideo()

    const [rowCount, setRowCount] = useState(3);
    const [colCount, setColCount] = useState(3);
    const [crosswordData, setCrosswordData] = useState({
        across: {},
        down: {}
    });
    const [crosswordList, setCrosswordList] = useState([])

    useEffect(() => {
        CKEditor.editorUrl =
            "https://cdn.ckeditor.com/ckeditor5/39.0.2/classic/ckeditor.js";
    }, [])

    useEffect(() => {
        if(selectedRow && selectedRow.typeCode == 'CROSSWORD'){
            let crossWords = selectedRow.crosswords
            let crossData = {
                across: {},
                down: {}
            }

            if(crossWords && crossWords.length > 0){
                crossData = listToCrosswordObj(crossWords[0].list)

                setCrosswordList(crossWords[0].list)
                setCrosswordData(crossData)
            }
        }
    }, [selectedRow])

    const fetchInit = (id) => {
        setLoading(true)
        const params = {
            id: course,
            detail: id,
            school
        }

        fetchRequest('api/course/syllabus-detail', "POST", params)
            .then(res => {
                if (res.success) {
                    const { exam } = res

                    if(res.componentTypeCode == 'DIALOG_CARD'){
                        let cloneDialogCards = [];

                        if(res.dialogCards && res.dialogCards.length > 0){
                            for(let i = 0; i < res.dialogCards.length; i++){
                                cloneDialogCards.push({
                                    id: res.dialogCards[i].id,
                                    front: {
                                        audio: res.dialogCards[i].frontAudio,
                                        image: res.dialogCards[i].frontImage,
                                        text: res.dialogCards[i].frontText,
                                        tabIndex: res.dialogCards[i]?.frontIsTradition ? 1 : 0
                                    },
                                    back: {
                                        audio: res.dialogCards[i].backAudio,
                                        image: res.dialogCards[i].backImage,
                                        text: res.dialogCards[i].backText,
                                        tabIndex: res.dialogCards[i]?.backIsTradition ? 1 : 0
                                    }
                                })
                            }
                        }

                        setDialogCards(cloneDialogCards)
                    }

                    setItem(res)
                    if (exam) {
                        setExam(exam)
                        setQuestionsList(exam.questions)
                    }
                    onTypeChange(res.component)
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

    const onSubmit = async () => {
        const [formsValid, formValues] = formRef.current.validate();

        if (formsValid) {
            const formParams = new FormData()
            const files = formValues.find(obj => obj.key == 'photo')?.files
            const audioFiles = formValues.find(obj => obj.key == 'audioFile')?.files

            let videoResponse = ''
            if (typeCode == 'VIDEO') {
                const videoFile = formValues.find(obj => obj.key == 'videoFile')?.files
                if(!videoFile){
                    message(t('errorMessage.selectVideoFile'), false)
                    return
                }
                await onUpload(videoFile, res => {
                    videoResponse = res?.link
                })
            }

            if (typeCode == 'AUDIO_IMAGE') {
                if(!audioFiles){
                    message(t('errorMessage.selectAudioFile'), false)
                    return
                }
            }

            let hasTimer = formValues.find(obj => obj.key == 'hasTimer')?.value;
            let duration = formValues.find(obj => obj.key == 'duration')?.value;

            let isRepeat = formValues.find(obj => obj.key == 'isRepeat')?.value;
            let repeatCount = formValues.find(obj => obj.key == 'repeatCount')?.value;
            let isLimitless = formValues.find(obj => obj.key == 'isLimitless')?.value;

            let hasScore = formValues.find(obj => obj.key == 'hasScore')?.value;
            let score = formValues.find(obj => obj.key == 'score')?.value;

            if(hasTimer){
                if(duration == 0 || duration == null || !duration){
                    message(t('errorMessage.enterDuration'), false)
                    return
                }
            }

            if(isRepeat){
                if(!isLimitless){
                    if(!formValues.find(obj => obj.key == 'isLimitless')?.value){
                        if(repeatCount == 0 || repeatCount == null || !repeatCount){
                            message(t('errorMessage.enterRepeatCount'), false)
                            return
                        }
                    }
                }
            }

            if(hasScore){
                if(score == 0 || score == null || !score){
                    message(t('errorMessage.enterScore'), false)
                    return
                }
            }

            if (typeCode === 'CROSSWORD') {
                if(!formValues.find(obj => obj.key == 'title')?.value){
                    message(t('errorMessage.enterName'), false)
                    return
                }

                // if(!formValues.find(obj => obj.key == 'description')?.value){
                //     message(t('errorMessage.enterDescription'), false)
                //     return
                // }

                if(crosswordList.length == 0){
                    message(t('crossWord.errorMessage.errorNotCreated'), false)
                    return
                }
            }

            formParams.append('detail', id)
            formParams.append('id', course)
            formParams.append('school', school)
            formParams.append('topic', topic)
            formParams.append('topicName', topicName)
            formParams.append('keyword', formValues.find(obj => obj.key == 'keyword')?.value)
            formParams.append('hasTraditionTextKeyword', formValues.find(obj => obj.key == 'keyword')?.selectedType == 'traditionalMb' ? 1 : 0)
            formParams.append('hasTraditionTextDescription', formValues.find(obj => obj.key == 'description')?.selectedType == 'traditionalMb' ? 1 : 0)
            formParams.append('title', formValues.find(obj => obj.key == 'title')?.value)
            if(typeCode == 'AUDIO_IMAGE'){
                formParams.append('title', formValues.find(obj => obj.key == 'title_audio')?.value)
                formParams.append('hasTraditionTextDescription', formValues.find(obj => obj.key == 'title_audio')?.selectedType == 'traditionalMb' ? 1 : 0)
            }
            formParams.append('isLimitless', formValues.find(obj => obj.key == 'isLimitless')?.value ? 1 : 0)
            formParams.append('repeatCount', formValues.find(obj => obj.key == 'repeatCount')?.value)
            formParams.append('description', formValues.find(obj => obj.key == 'description')?.value)
            formParams.append('component', formValues.find(obj => obj.key == 'component')?.value)
            formParams.append('hasDuration', formValues.find(obj => obj.key == 'hasTimer')?.value ? 1 : 0)
            formParams.append('hasScore', formValues.find(obj => obj.key == 'hasScore')?.value ? 1 : 0)
            formParams.append('isRepeat', formValues.find(obj => obj.key == 'isRepeat')?.value ? 1 : 0)
            formParams.append('singlePage', formValues.find(obj => obj.key == 'isOnePage')?.value ? 1 : 0)
            formParams.append('duration', formValues.find(obj => obj.key == 'duration')?.value)
            if (formValues.find(obj => obj.key == 'score')?.value) {
                formParams.append('score', formValues.find(obj => obj.key == 'score')?.value)
            }

            questionList.forEach(obj => {
                formParams.append('questions[]', obj?.id)
            })
            if(files?.length > 0) {
                formParams.append('photoFile', files[0])
            }
            if(audioFiles?.length > 0) {
                formParams.append('audioFile', audioFiles[0])
            }
            formParams.append('videoFile', videoResponse)

            if (typeCode === 'DIALOG_CARD') {
                for(let i = 0; i < dialogCards.length; i++){
                    if(!dialogCards[i].front.text || dialogCards[i].front.text == '' || dialogCards[i].front.text == null || !dialogCards[i].back.text || dialogCards[i].back.text == '' || dialogCards[i].back.text == null){
                        message(t('errorMessage.dialogInsertText'))
                        return
                    }
                }

                dialogCards.forEach((obj, index) => {
                    formParams.append('dialogIds[' + index + ']', obj?.id || null)
                    formParams.append('dialogFrontText[]', obj?.front?.text)
                    formParams.append('dialogFrontIsTradition[]', obj?.front?.tabIndex)
                    formParams.append('dialogFrontImage[' + index + ']', obj?.front?.image)
                    formParams.append('dialogFrontAudio[' + index + ']', obj?.front?.audio)
                    formParams.append('dialogBackText[]', obj?.back?.text)
                    formParams.append('dialogBackIsTradition[]', obj?.back?.tabIndex)
                    formParams.append('dialogBackImage[' + index + ']', obj?.back?.image)
                    formParams.append('dialogBackAudio[' + index + ']', obj?.back?.audio)
                })
            }

            if (typeCode === 'CROSSWORD') {
                crosswordList.forEach((obj, index) => {
                    formParams.append('answer[' + index + ']', obj?.answer || null)
                    formParams.append('clue[' + index + ']', obj?.clue)
                    formParams.append('col[' + index + ']', obj?.col)
                    formParams.append('row[' + index + ']', obj?.row)
                    formParams.append('orientation[' + index + ']', obj?.orientation)
                    formParams.append('position[' + index + ']', obj?.position)
                    formParams.append('score[' + index + ']', obj?.score)
                })
            }

            formParams.append('crossword[]', crosswordList)

            let url = 'api/course/syllabus-create'

            if (id) {
                url = 'api/course/syllabus-edit'
            }
            setLoading(true)
            fetchRequest(url, 'POST', formParams, true, true)
                .then(res => {
                    if (!res.success) {
                        message(res.message)
                    } else {
                        onClose()
                    }
                })
                .catch(e => {
                    message(t('errorMessage.title'));
                })
                .finally(() => {
                    setLoading(false)
                })
        }
    }

    const onRemove = async (id = null) => {
        if (id) {
            if (exam && exam.id) {
                const filteredList = questionList.filter(obj => obj.id != id)
                setQuestionsList(filteredList)
            } else {
                const params = {
                    question: id,
                    course,
                    school
                }
                fetchRequest('api/course/exam/question-remove', "POST", params)
                    .then(res => {
                        if (res.success) {
                            const filteredList = questionList.filter(obj => obj.id != id)
                            setQuestionsList(filteredList)
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
        }
    }

    const moveItemUp = (index) => {
        if (index > 0) {
            const updatedItems = [...questionList];
            [updatedItems[index - 1], updatedItems[index]] = [updatedItems[index], updatedItems[index - 1]];
            setQuestionsList(updatedItems);
        }
    };

    const moveItemDown = (index) => {
        if (index < questionList.length - 1) {
            const updatedItems = [...questionList];
            [updatedItems[index], updatedItems[index + 1]] = [updatedItems[index + 1], updatedItems[index]];
            setQuestionsList(updatedItems);
        }
    };

    const orderContent = (id, isDown = false) => {
        if (id) {
            const index = questionList.findIndex(obj => obj.id == id)

            if (isDown) {
                moveItemDown(index)
            } else {
                moveItemUp(index)
            }
        }
    }

    const toQuestion = (key = 'bank', row) => {
        if (key == 'bank') {
            onQuestionBank(selectedType, exam?.id)
        } else if((key == 'add')){
            onQuestionAdd(selectedType, exam?.id)
        } else {
            onQuestionEdit(selectedType, exam?.id, row)
        }
    }

    const onExamChange = (key, value) => {
        const tempObj = exam ? { ...exam } : {}

        tempObj[key] = value

        if(key == 'isRepeatable'){
            if(!value){
                tempObj['repeatCount'] = 0
            }
        }

        setExam(tempObj)
    }

    useEffect(() => {
        if (questions.length > 0 && !id) {
            setQuestionsList(prev => {
                const tempArray = [...prev]

                questions.map(q => {
                    const exist = tempArray.find(obj => obj.id == q.id)

                    if (!exist) {
                        tempArray.push(q)
                    }
                    setQuestionsList(questions)
                })

                return tempArray
            })
        }
    }, [questions])

    useEffect(() => {
        if (id) {
            fetchInit(id)
        }
    }, [id, questionChanged])

    useEffect(() => {
        if(closed){
            fetchInit(id)
        }
    }, [closed])

    useEffect(() => {
        if (formRef?.current?.updateFields) {
            formRef.current?.updateFields(fields)
        } else if (from) {
            formRef.current?.updateFields(fields)
        }
    }, [item, selectedType, typeCode, videoLoading, from, exam]);

    const VideoLoader = () => {
        if (!videoLoading) {
            return <div key='videoLoaderEmpty' />
        }

        return <div key='videoFileLoader' className='d-flex flex-row w-100 justify-content-center mt-2'>
            <label className='color-primary' >Uploading video</label>
        </div>
    }

    const onTypeChange = (value) => {
        const obj = types.find(obj => obj.id == value)

        if (obj) {
            setSelectedType(value)
            setTypeCode(obj.typeCode)

            if (obj?.typeCode === 'ACTIVE_QUESTION') {
                onQuestionTypeSelected(courseExam)
            }
        }
    }

    const noDesctiptionList = useMemo(() => [
        'INFORMATION_ONLY',
        'DESC_INFO_IMAGE',
        'KEYWORD'
    ], [])

    const fields = [
        {
            key: "component",
            label: t('onlineLesson.componentType'),
            value: selectedType || '',
            type: "dropdown",
            options: toDropdownData(types, 'id', 'name', true),
            onChange: onTypeChange,
            disabled: !!item?.id,
            labelStyle: {
                fontWeight: 'Bold'
            }
        },
        {
            key: "keyword",
            label: t('onlineLesson.newWord'),
            value: item?.keyword || '',
            type: "tab",
            hidden: typeCode != "KEYWORD",
            isTab: true,
            defaultType: item?.isTraditionKeyword ? 'traditionalMb' : 'editor',
            tabs: [
                {
                    id: 1,
                    label: t('common.cyrillic'),
                    type: 'editor',
                },
                {
                    id: 2,
                    label: t('common.mongolBichig'),
                    type: 'traditionalMb',
                },
            ],
            labelStyle: {
                fontWeight: 'Bold',
                alignSelf: 'flex-start'
            }
        },
        {
            label: t('common.name') + '*',
            key: "title",
            value: item?.title || '',
            type: "text",
            hidden: typeCode !== 'CROSSWORD',
            labelStyle: {
                fontWeight: 'Bold',
            }
        },
        {
            label: t('common.description'),
            key: "description",
            value: item?.title || '',
            type: "textArea",
            hidden: typeCode !== 'CROSSWORD',
            labelStyle: {
                fontWeight: 'Bold',
                alignSelf: 'flex-start'
            }
        },
        {
            label: t('common.description'),
            key: "title",
            value: item?.title || '',
            type: "textArea",
            hidden: typeCode != "DESC_INFO_IMAGE" && typeCode !== 'DIALOG_CARD',
            labelStyle: {
                fontWeight: 'Bold',
                alignSelf: 'flex-start'
            }
        },
        {
            label: t('common.description'),
            key: "title_audio",
            value: item?.title || '',
            type: "tab",
            hidden: typeCode == "AUDIO_IMAGE" ? false : true,
            isTab: true,
            defaultType: item?.isTraditionDescription ? 'traditionalMb' : 'editor',
            tabs: [
                {
                    id: 1,
                    label: t('common.cyrillic'),
                    type: 'editor',
                },
                {
                    id: 2,
                    label: t('common.mongolBichig'),
                    type: 'traditionalMb',
                },
            ],
            labelStyle: {
                fontWeight: 'Bold',
                alignSelf: 'flex-start'
            }
        },
        {
            key: "description",
            label: typeCode != "KEYWORD" ? '' : t('common.description'),
            value: item?.description || '',
            type: "tab",
            hidden: !noDesctiptionList.includes(typeCode),
            isTab: true,
            defaultType: item?.isTraditionDescription ? 'traditionalMb' : 'editor',
            tabs: [
                {
                    id: 1,
                    label: t('common.cyrillic'),
                    type: 'editor',
                },
                {
                    id: 2,
                    label: t('common.mongolBichig'),
                    type: 'traditionalMb',
                },
            ],
            labelStyle: {
                fontWeight: 'Bold',
                alignSelf: 'flex-start'
            }
        },
        {
            label: t('onlineLesson.uploadImage'),
            type: "fileUpload",
            key: "photo",
            accept: "image/*",
            isExtendedButton: true,
            isExtendedButtonClass: 'btn btn-outline-info ml-2',
            isExtendedButtonText: t('newsfeed.chooseFile'),
            fileNames: item?.photoFile || '',
            inputFlex: 0,
            hidden: typeCode != "DESC_INFO_IMAGE" && typeCode !== "AUDIO_IMAGE",
            labelStyle: {
                fontWeight: 'Bold'
            }
        },
        {
            label: t('onlineLesson.uploadAudio'),
            type: "fileUpload",
            key: "audioFile",
            accept: '.mp3,audio/*',
            isExtendedButton: true,
            isExtendedButtonClass: 'btn btn-outline-info ml-2',
            isExtendedButtonText: t('newsfeed.chooseFile'),
            fileNames: item?.audioFile || '',
            inputFlex: 0,
            hidden: typeCode != "AUDIO_IMAGE",
            // required: typeCode == "AUDIO_IMAGE" ? true : false,
            // errorMessage: t('errorMessage.selectAudioFile'),
            labelStyle: {
                fontWeight: 'Bold'
            }
        },
        {
            label: t('onlineLesson.uploadVideo'),
            type: "fileUpload",
            key: "videoFile",
            accept: '.mp4,video/*',
            isExtendedButton: true,
            isExtendedButtonClass: 'btn btn-outline-info ml-2',
            isExtendedButtonText: t('newsfeed.chooseFile'),
            fileNames: item?.videoFile || '',
            inputFlex: 0,
            hidden: typeCode != "VIDEO",
            labelStyle: {
                fontWeight: 'Bold'
            }
        },
        {
            key: "videoFileLoader",
            type: "jsx",
            hidden: typeCode != "VIDEO",
            value: <VideoLoader key='VideoLoaderComponent' />
        },
        {
            key: "hasTimer",
            label: t('onlineLesson.hasTimer'),
            value: exam?.hasDuration || false,
            type: "checkbox",
            onChange: (value) => onExamChange('hasDuration', value),
            hidden: typeCode != "ACTIVE_QUESTION",
            labelStyle: {
                fontWeight: 'Bold'
            }
        },
        {
            key: "duration",
            label: t('onlineLesson.duration'),
            value: exam?.duration || '',
            type: "numberOnly",
            onChange: (e, value) => onExamChange('duration', e.target?.value),
            hidden: typeCode != "ACTIVE_QUESTION" || !exam?.hasDuration,
            labelStyle: {
                fontWeight: 'Bold'
            }
        },
        {
            key: "isRepeat",
            label: t('onlineLesson.isRepeatAble'),
            value: exam?.isRepeatable || !!exam?.repeatCount,
            type: "checkbox",
            onChange: (value) => onExamChange('isRepeatable', value),
            hidden: typeCode != "ACTIVE_QUESTION",
            labelStyle: {
                fontWeight: 'Bold'
            }
        },
        {
            key: "repeatCount",
            label: t('onlineLesson.repeatCount'),
            value: exam?.repeatCount || '',
            onChange: (e, value) => onExamChange('repeatCount', e.target?.value),
            type: "numberOnly",
            hidden: !exam?.isRepeatable || typeCode != "ACTIVE_QUESTION",
            labelStyle: {
                fontWeight: 'Bold'
            }
        },
        {
            key: "isLimitless",
            label: t('onlineLesson.limitless'),
            value: exam?.isLimitless || false,
            buttonType: 'radio',
            type: "checkbox",
            onChange: (value) => onExamChange('isLimitless', value),
            hidden: !exam?.isRepeatable || typeCode != "ACTIVE_QUESTION",
            labelStyle: {
                fontWeight: 'Bold'
            }
        },
        {
            key: "hasScore",
            label: t('onlineLesson.hasScore'),
            value: exam?.hasScore || false,
            type: "checkbox",
            onChange: (value) => onExamChange('hasScore', value),
            hidden: typeCode != "ACTIVE_QUESTION",
            labelStyle: {
                fontWeight: 'Bold'
            }
        },
        {
            key: "score",
            label: t('common.score'),
            value: exam?.score || '',
            type: "numberOnly",
            onChange: (e, value) => onExamChange('score', e.target?.value),
            hidden: typeCode != "ACTIVE_QUESTION" || !exam?.hasScore,
            labelStyle: {
                fontWeight: 'Bold'
            }
        },
        {
            key: "isOnePage",
            label: t('onlineLesson.isOnePage'),
            value: exam?.singlePage || false,
            onChange: (value) => onExamChange('singlePage', value),
            type: "checkbox",
            hidden: typeCode != "ACTIVE_QUESTION",
            labelStyle: {
                fontWeight: 'Bold'
            }
        }
    ]

    const Status = ({ text = t('menu.active'), color = "#3EBFA3CC", isDarkText = false, isBold = true }) => {
        return <div
            style={{
                backgroundColor: color,
                borderRadius: '6px',
                padding: '4px 8px',
                marginRight: '4px'
            }}
        >
            <span style={{ color: isDarkText ? 'black' : 'white' }} className={isBold ? 'font-bold' : ''} >{text}</span>
        </div>
    }

    const onViewHandler = (image) => {
        setSelectedPath(image)
        setShowModal(true)
    }

    const renderMatchQuestion = (answer, values) => {
        if(answer.answerType == 'text' || answer.answerType == 'mbscript'){
            return (
                <div className="d-flex flex-row justify-content-between">
                    {
                        answer.answerType == 'text' &&
                        <div>
                            {answer.answer}
                        </div>
                    }
                    {
                        answer.answerType == 'mbscript' &&
                        <div>
                            <div className='text-semi-large text-dark ml-2 tradition-text tradition-text-student' dangerouslySetInnerHTML={{ __html: answer.answer }}/>
                        </div>
                    }
                    <div>
                        {
                            values.map((value, vIndex) => {
                                if(answer.valueId == value.id){
                                    if(value.valueType == 'text'){
                                        return (
                                            <div key={'answer_' + vIndex} className='d-flex'>
                                                {value.value}
                                            </div>
                                        )    
                                    } else if(value.valueType == 'equation') {
                                        return (
                                            <div key={'answer_' + vIndex} className='d-flex'>
                                                <div className='d-flex' dangerouslySetInnerHTML={{ __html: value.value }}/>
                                            </div>
                                        )
                                    } else if (value.valueType == 'mbscript'){
                                        return (
                                            <div key={'answer_' + vIndex} className='d-flex'>
                                                <div className='text-semi-large text-dark ml-2 tradition-text tradition-text-student' dangerouslySetInnerHTML={{ __html: value.value }}/>
                                            </div>
                                        )
                                    } else if (value.valueType == 'image') {
                                        return (
                                            <div key={'answer_' + vIndex}>
                                                <img className='drag-list-path-style' src={value.filePath} height={80} width={80}/>
                                                <VisibilityIcon fontSize='small cursor' style={{position: 'relative', bottom: 40, right: 10}} onClick={() => onViewHandler(value.filePath)}/>
                                            </div>
                                        )
                                    }
                                }
                            })
                        }   
                    </div>
                </div>
            )
        } else if (answer.answerType == 'equation'){
            return (
                <div className="d-flex flex-row justify-content-between">
                    <div>
                        <div className='d-flex' dangerouslySetInnerHTML={{ __html: answer.answer }}/>
                    </div>
                    <div>
                        {
                            values.map((value, vIndex) => {
                                if(answer.valueId == value.id){
                                    if(value.valueType == 'text'){
                                        return (
                                            <div key={'answer_' + vIndex} className='d-flex'>
                                                {value.value}
                                            </div>
                                        )    
                                    } else if(value.valueType == 'equation') {
                                        return (
                                            <div key={'answer_' + vIndex} className='d-flex'>
                                                <div className='d-flex' dangerouslySetInnerHTML={{ __html: value.value }}/>
                                            </div>
                                        )
                                    } else if (value.valueType == 'mbscript'){
                                        return (
                                            <div key={'answer_' + vIndex} className='d-flex'>
                                                <div className='text-semi-large text-dark ml-2 tradition-text tradition-text-student' dangerouslySetInnerHTML={{ __html: value.value }}/>
                                            </div>
                                        )    
                                    } else if (value.valueType == 'image') {
                                        return (
                                            <div key={'answer_' + vIndex}>
                                                <img className='drag-list-path-style' src={value.filePath} height={80} width={80}/>
                                                <VisibilityIcon fontSize='small cursor' style={{position: 'relative', bottom: 40, right: 10}} onClick={() => onViewHandler(value.filePath)}/>
                                            </div>
                                        )
                                    }
                                }
                            })
                        }
                    </div>
                </div>
            )
        } else if (answer.answerType == 'image'){
            return (
                <div className="d-flex flex-row justify-content-between">
                    <div>
                        <img className='drag-list-path-style' src={answer.filePath} height={80} width={80}/>
                        <VisibilityIcon fontSize='small cursor' style={{position: 'relative', bottom: 40, right: 10}} onClick={() => onViewHandler(answer.filePath)}/>
                    </div>
                    <div>
                        {
                            values.map((value, vIndex) => {
                                if(answer.valueId == value.id){
                                    if(value.valueType == 'text'){
                                        return (
                                            <div key={'answer_' + vIndex} className='d-flex'>
                                                {value.value}
                                            </div>
                                        )    
                                    } else if(value.valueType == 'equation') {
                                        return (
                                            <div key={'answer_' + vIndex} className='d-flex'>
                                                <div className='d-flex' dangerouslySetInnerHTML={{ __html: value.value }}/>
                                            </div>
                                        )
                                    } else if (value.valueType == 'mbscript'){
                                        return (
                                            <div key={'answer_' + vIndex} className='d-flex'>
                                                <div className='text-semi-large text-dark ml-2 tradition-text tradition-text-student' dangerouslySetInnerHTML={{ __html: value.value }}/>
                                            </div>
                                        )    
                                    } else if (value.valueType == 'image') {
                                        return (
                                            <div key={'answer_' + vIndex}>
                                                <img className='drag-list-path-style' src={value.filePath} height={80} width={80}/>
                                                <VisibilityIcon fontSize='small cursor' style={{position: 'relative', bottom: 40, right: 10}} onClick={() => onViewHandler(value.filePath)}/>
                                            </div>
                                        )
                                    }
                                }
                            })
                        }
                    </div>
                </div>
            )
        }
    }

    const renderAnswer = (answer) => {
        if(answer){
            if(answer.answerType == 'text'){
                return (
                    <div>
                        {/* {(index + 1) + '.' + answer.answer} */}
                        { answer.answer }
                    </div>
                )
            } else if(answer.answerType == 'image'){
                return (
                    <div className='d-flex mt-1 mb-1'>
                        {/* <div>
                            {(index + 1) + '.'}
                        </div> */}
                        <img src={answer.filePath} height={80} width={80} style={{borderRadius: 6}}/>
                        <VisibilityIcon fontSize='small cursor' style={{position: 'relative', bottom: 10, right: 10}} onClick={() => onViewHandler(answer.filePath)}/>
                    </div>
                )
            } else if(answer.answerType == 'equation'){
                return (
                    // <div className='d-flex' dangerouslySetInnerHTML={{ __html: (index + 1) + '.' + answer.answer }}/>
                    <div className='d-flex' dangerouslySetInnerHTML={{ __html: answer.answer }}/>
                )
            } else if(answer.answerType == 'mbscript'){
                return (
                    // <div className='text-semi-large text-dark ml-2 tradition-text tradition-text-student' dangerouslySetInnerHTML={{ __html: (index + 1) + '.' + answer.answer }}/>
                    <div className='text-semi-large text-dark ml-2 tradition-text tradition-text-student' dangerouslySetInnerHTML={{ __html: answer.answer }}/>
                )
            }
        }
    }

    const Answers = ({ typeCode = null, obj = {} }) => {
        if ((typeCode == 'TEST' || typeCode == 'MULTI') && obj.answers?.length > 0) {
            return obj.answers.map((item, index) => {
                return (
                    <div key={index} className='d-flex flex-row p-2 w-100'>
                        <div className="ml-4 mr-3" style={obj.hasDescription ? {marginBottom: 'auto', position: 'relative', top: 2} : {}}>
                            <RadioButton checked={item.isCorrect} />
                        </div>
                        {/* <RadioButton className='mr-3' checked={item.isCorrect} /> */}
                        <div className='d-flex flex-column align-items-center justify-content-center'>
                            <span>
                                {renderAnswer(item)}
                                {/* {
                                    item.answerType == 'mbscript'
                                    ?
                                        <div className='text-semi-large text-dark ml-2 tradition-text' dangerouslySetInnerHTML={{ __html: item?.answer.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&') }} style={{height: 'auto'}}/>
                                    :
                                        <div dangerouslySetInnerHTML={{ __html: item.answer }} />
                                } */}
                                {
                                    obj.hasDescription &&
                                    <div style={{color: '#868AA8', borderRadius:6, width: '100%', padding: '5px 12px', marginTop: 4}}>
                                        {/* {item?.description || ''} */}
                                        <div dangerouslySetInnerHTML={{ __html: item?.description || ''}}/>
                                    </div>
                                    // <Tooltip title={item.description}>
                                        // <LiveHelpIcon className='ml-3' fontSize='small' sx={{ color: '#ff5b1d' }}/>
                                    // </Tooltip>
                                }
                            </span>
                            {
                                item.image
                                    ? <Image src={item.image} style={{ resize: 'block', height: '120px' }} />
                                    : null
                            }
                            {
                                item.content
                                    ? <div dangerouslySetInnerHTML={{ __html: item.content }} />
                                    : null
                            }
                        </div>
                    </div>
                )
                
            })
        } else if (typeCode == 'LINK' && obj.answers?.length > 0) {
            return obj.answers.map((answerObj, index) => {
                return <div
                    key={index}
                    className="d-flex flex-row align-content-center align-items-center position-relative mt-2"
                >
                    <div style={{ minWidth: 40 }}>{answerObj.score > 0 ? answerObj.score : ''}</div>
                    {
                        answerObj.score > 0
                            ?

                            <div style={{ minWidth: 30 }} className={obj.answers[index + 1] && obj.answers[index + 1].score == 0 ? "open-tag ml-4" : "open-tag ml-4 success"}>{obj.answers[index + 1] && obj.answers[index + 1].score == 0 ? getIcon('') : getIcon('success')}</div>
                            :
                            <div style={{ minWidth: 30 }} className="ml-4" />
                    }
                    <div className="ml-3" style={{ width: 20 }}>{answerObj.name}</div>
                    {
                        answerObj.values.map((value, vIndex) => {
                            return (
                                <div key={'answer_' + index + '_value_' + vIndex} className='d-flex flex-row align-content-center align-items-center'>
                                    {
                                        index == 0
                                            ?
                                            <div className="d-block" style={{ position: 'relative', left: 29, bottom: 25 }}>{value.name}</div>
                                            :
                                            <div className="d-block" style={{ position: 'relative', left: 29, bottom: 25, color: '#FFF', zIndex: -1 }}>{value.name}</div>
                                    }
                                    {
                                        vIndex
                                            ?
                                            <RadioButton className='ml-3' checked={value.id == answerObj.correctValue} />
                                            :
                                            <RadioButton className='ml-4' checked={value.id == answerObj.correctValue} />
                                    }
                                </div>
                            )
                        })
                    }
                </div>
            })
        } else if (typeCode == 'FILL') {
            return <div className='d-flex flex-row p-2 w-100 align-item-center'>
                <span>{obj.answerText}</span>
            </div>
        } else if (typeCode == 'MATCH' && obj.answers?.length > 0) {
            return obj.answers.map((answerObj, index) => {
                return (
                    <div key={'match_' + index} className='card-alternate mb-2 render-match-question' style={{padding: '12px 24px'}}>
                        {renderMatchQuestion(answerObj, obj.values)}
                    </div>
                )
            })
            // return <div className='d-flex flex-row p-2 w-100 align-item-center'>
            //     {
            //         obj.answers.map((item, index) => {
            //             return <Status key={index} color='#FF5B1D33' text={item.text} isDarkText isBold={false} />
            //         })
            //     }
            // </div>
        } else if (typeCode == 'ORDER' && obj.answers?.length > 0) {
            return obj.answers.map((item, index) => {
                return <div key={index} className='d-flex flex-row p-2 w-100 align-item-center'>
                    <div className='d-flex flex-column align-items-end col-md-4'>
                        <span>
                            {item.text}
                        </span>
                        {
                            item.image
                                ? <Image src={item.image} style={{ resize: 'block', height: '120px' }} />
                                : null
                        }
                        {
                            item.content
                                ? <div dangerouslySetInnerHTML={{ __html: item.content }} />
                                : null
                        }
                    </div>
                    <div className='d-flex flex-row align-items-center justify-content-end col-md-2'>
                        {
                            index + 1 !== obj.answers?.length
                                ?
                                <Button disabled variant='outline-dark' className="btn-icon btn-icon-only ml-2 p-0" >
                                    <ArrowDownward />
                                </Button>
                                : null
                        }
                        {
                            index !== 0
                                ?
                                <Button disabled variant='outline-dark' className="btn-icon btn-icon-only ml-2 p-0" >
                                    <ArrowUpward />
                                </Button>
                                : null
                        }
                    </div>
                </div>
            })
        } else if (typeCode == ''){

        }

        return null
    }

    const getContextMenus = (questionObj) => {
        if (questionObj.qCatCode == 'QUESTION_BANK') {
            return [
                {
                    key: "remove",
                    icon: <TrashIcon />,
                    title: t('action.remove')
                }
            ]
        } else {
            return [
                {
                    key: "edit",
                    icon: <EditIcon />,
                    title: t('action.edit'),
                },
                {
                    key: "remove",
                    icon: <TrashIcon />,
                    title: t('action.remove')
                }
            ]
        }
    }
    const onContextMenuClick = (key, row, event) => {
        if (key == 'remove') {
            onRemove(row.id)
        } else if (key == 'edit') {
            toQuestion('edit', row);   
        }
    }

    const Question = ({ obj = {}, index = 0 }) => {
        return <div className='d-flex flex-column card-alternate w-100 mt-2 question-table-style'>
            <div className='d-flex flex-row justify-content-between'>
                <div className='d-flex flex-row p-2 w-100 align-item-center'>
                    <div className='font-bold align-items-center mr-3'>№{obj.ordering || obj.id}</div>
                    <Status text={t('common.score') + ': ' + (obj.score || 0)} color="#575962" />
                    <Status text={obj.difficultyName} color={obj.difficultyColor || "#3EBFA3CC"} />
                </div>
                <ContextMenu row={obj} contextMenus={getContextMenus(obj)} onContextMenuItemClick={onContextMenuClick} />
            </div>
            {
                obj.files && obj.files.length > 0
                    ?
                    <div className='col-12 text-center'>
                        {
                            obj.files.map((file, index) => {
                                if(file.type == "QUESTION_IMAGE"){
                                    return (
                                        <div key={'image_' + index} className="col-12">
                                            <img src={file.path} height={100} width={100}/>
                                            <VisibilityIcon fontSize='small cursor' style={{position: 'relative', bottom: 50, right: 7}} onClick={() => onViewHandler(file.path)}/>
                                        </div>
                                    )
                                } else if(file.type == "QUESTION_AUDIO"){
                                    return (
                                        <div key={'audio_' + index} className="col-12 mt-3">
                                            <ReactAudioPlayer
                                                controls
                                                src={file.path}
                                            />
                                        </div>
                                    )
                                }
                                
                                return null
                            })
                        }
                    </div>
                    : null
            }
            <div className='d-flex flex-row p-2 w-100' >
                {
                    obj?.hasTradition
                    ?
                        <div className='text-semi-large text-dark ml-2 tradition-text' dangerouslySetInnerHTML={{ __html: obj?.content.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&') }} style={{height: 'auto'}}/>
                    :
                        <div className='w-100' dangerouslySetInnerHTML={{ __html: obj.content.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&') }} />
                }
            </div>
            <div className='d-flex flex-column p-2 w-100' >
                <Answers typeCode={obj.qTypeCode} obj={obj} />
            </div>
            <div className='d-flex flex-row align-items-center justify-content-end mt-3'>
                {
                    index + 1 !== questionList.length
                        ?
                        <Button onClick={() => orderContent(obj.id, 1)} variant='outline-dark' className="btn-icon btn-icon-only ml-2" >
                            <ArrowDownward />
                        </Button>
                        : null
                }
                {
                    index !== 0
                        ?
                        <Button onClick={() => orderContent(obj.id, 0)} variant='outline-dark' className="btn-icon btn-icon-only ml-2" >
                            <ArrowUpward />
                        </Button>
                        : null
                }
            </div>
        </div>
    }

    const Questions = () => {
        return <div className='d-flex flex-column mt-4 question-table-style'>
            <div className='d-flex flex-row'>
                <Button
                    variant="primary"
                    className="mb-5 add-button text-uppercase mr-2"
                    onClick={() => toQuestion('add')}
                >
                    <ControlPoint style={{ color: "white", marginRight: "4px" }} />
                    {t('onlineLesson.newQuestionAdd')}
                </Button>
                <Button
                    variant="primary"
                    className="mb-5 add-button text-uppercase"
                    onClick={() => toQuestion('bank')}
                >
                    <FileUpIcon />
                    <div style={{ marginRight: '4px' }} />
                    {t('onlineLesson.selectFromArchive')}
                </Button>
            </div>
            {
                questionList.length
                    ?
                    questionList.map((obj, index) => {
                        return <Question key={index} obj={obj} index={index} />
                    })
                    : null
            }
        </div>
    }

    const onLoadImage = (e, index, side) => {
        e.preventDefault()
        const clone = [...dialogCards]
        if (e?.target?.files && e?.target?.files.length > 0) {
            if (side === 'FRONT') {
                clone[index].front.image = e.target.files[0]
            } else if (side === 'BACK') {
                clone[index].back.image = e.target.files[0]
            }
        } else {
            if (side === 'FRONT') {
                clone[index].front.image = null
            } else if (side === 'BACK') {
                clone[index].back.image = null
            }
        }
        setDialogCards(clone)
    }

    const onLoadAudio = (e, index, side) => {
        e.preventDefault()
        const clone = [...dialogCards]
        if (e?.target?.files && e?.target?.files.length > 0) {
            if (side === 'FRONT') {
                clone[index].front.audio = e.target.files[0]
            } else if (side === 'BACK') {
                clone[index].back.audio = e.target.files[0]
            }
        } else {
            if (side === 'FRONT') {
                clone[index].front.audio = null
            } else if (side === 'BACK') {
                clone[index].back.audio = null
            }
        }
        setDialogCards(clone)
    }

    const onDialogImageClick = (index, side) => {
        const fileInput = document.createElement('input')
        fileInput.type = 'file'
        fileInput.accept = 'image/png, image/jpeg'
        fileInput.onchange = (e) => onLoadImage(e, index, side)
        fileInput.click()
    }

    const onDialogImageRemove = (index, side, id) => {
        const clone = [...dialogCards]

        if(id){
            let params = {
                id,
                school,
                side,
                type: 'IMAGE'
            }

            setLoading(true)
            fetchRequest('api/course/syllabus-data-remove', "POST", params)
                .then(res => {
                    if (res.success) {
                        if (side === 'FRONT') {
                            clone[index].front.image = null
                        } else if (side === 'BACK') {
                            clone[index].back.image = null
                        }

                        setDialogCards(clone)
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
        } else {
            if (side === 'FRONT') {
                clone[index].front.image = null
            } else if (side === 'BACK') {
                clone[index].back.image = null
            }
            setDialogCards(clone)
        }
    }

    const onDialogAudioClick = (index, side) => {
        const fileInput = document.createElement('input')
        fileInput.type = 'file'
        fileInput.accept = 'audio/mp3,audio/*;capture=microphone'
        fileInput.onchange = (e) => onLoadAudio(e, index, side)
        fileInput.click()
    }
    
    const onDialogAudioRemove = (index, side, id) => {
        const clone = [...dialogCards]
        
        if(id){
            let params = {
                id,
                school,
                side,
                type: 'AUDIO'
            }

            setLoading(true)
            fetchRequest('api/course/syllabus-data-remove', "POST", params)
                .then(res => {
                    if (res.success) {
                        if (side === 'FRONT') {
                            clone[index].front.audio = null
                        } else if (side === 'BACK') {
                            clone[index].back.audio = null
                        }

                        setDialogCards(clone)
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
        } else {
            if (side === 'FRONT') {
                clone[index].front.audio = null
            } else if (side === 'BACK') {
                clone[index].back.audio = null
            }

            setDialogCards(clone)
        }
    }

    const onDialogCardTextChange = (value, index, side) => {
        const clone = [...dialogCards]
        for (let dc = 0; dc < clone?.length; dc++) {
            if (index === dc) {
                if (side === 'FRONT') {
                    clone[dc].front.text = value
                } else if (side === 'BACK') {
                    clone[dc].back.text = value
                }
                break;
            }
        }
        setDialogCards(clone)
    }

    const onRemoveDialogCardRow = (index) => {
        const clone = [...dialogCards]
        clone.splice(index, 1);
        setDialogCards(clone)
    }

    const onAddDialogCardRow = () => {
        const clone = [...dialogCards]
        clone.push({
            front: {
                text: '',
                image: null,
                audio: null,
                tabIndex: 0
            },
            back: {
                text: '',
                image: null,
                audio: null,
                tabIndex: 0
            }
        })
        setDialogCards(clone)
    }

    const onChangeOrderDialogCard = (index, changeIndex) => {
        const clone = [...dialogCards]

        const tmp = clone[index]
        clone[index] = clone[changeIndex]
        clone[changeIndex] = tmp

        setDialogCards(clone)
    }

    const onTableChange = (tabIndex, index, side) => {
        const clone = [...dialogCards]
        for (let dc = 0; dc < clone?.length; dc++) {
            if (index === dc) {
                if (side === 'FRONT') {
                    clone[dc].front.text = ''
                    clone[dc].front.tabIndex = tabIndex
                } else if (side === 'BACK') {
                    clone[dc].back.text = ''
                    clone[dc].back.tabIndex = tabIndex
                }
                break;
            }
        }
        setDialogCards(clone)
    }

    const onKeyDown = (e, index, side) => {
        const clone = [...dialogCards]
        for (let dc = 0; dc < clone?.length; dc++) {
            if (index === dc) {
                if (side === 'FRONT') {
                    let frontLastValue = frontRef?.current[index]?.lastHtml
                    let valueArray = frontLastValue.split(/<div ?\/?>/)
            
                    if(e.shiftKey && e.which == 65) {
                        let updatedValue = ''
                        if(valueArray && valueArray.length > 1){
                            let lastArrayValue = valueArray[valueArray.length - 1]
                            var textValueArray = lastArrayValue.split('</div>');
            
                            for(let i = 0; i < valueArray.length - 1; i++){
                                updatedValue += '<div>' + valueArray[i]
                            }
                            updatedValue += '<div>' + textValueArray[0] + '\u202F' + textValueArray[1];
                        } else {
                            updatedValue = frontLastValue + '\u202F'
                        }
            
                        clone[dc].front.text = updatedValue
                        e.preventDefault();
                        e.stopPropagation();
                    }
            
                    if(e.shiftKey && e.which == 71) {
                        let updatedValue = ''
                        if(valueArray && valueArray.length > 1){
                            let lastArrayValue = valueArray[valueArray.length - 1]
                            var textValueArray = lastArrayValue.split('</div>');
            
                            for(let i = 0; i < valueArray.length - 1; i++){
                                updatedValue += '<div>' + valueArray[i]
                            }
                            updatedValue += '<div>' + textValueArray[0] + '\u180E' + textValueArray[1];
                        } else {
                            updatedValue = frontLastValue + '\u180E'
                        }
            
                        clone[dc].front.text = updatedValue
                        e.preventDefault();
                        e.stopPropagation();
                    }

                    
                } else if (side === 'BACK') {
                    let backLastValue = backRef?.current[index]?.lastHtml
                    let valueArray = backLastValue.split(/<div ?\/?>/)
            
                    if(e.shiftKey && e.which == 65) {
                        let updatedValue = ''
                        if(valueArray && valueArray.length > 1){
                            let lastArrayValue = valueArray[valueArray.length - 1]
                            var textValueArray = lastArrayValue.split('</div>');
            
                            for(let i = 0; i < valueArray.length - 1; i++){
                                updatedValue += '<div>' + valueArray[i]
                            }
                            updatedValue += '<div>' + textValueArray[0] + '\u202F' + textValueArray[1];
                        } else {
                            updatedValue = backLastValue + '\u202F'
                        }
            
                        clone[dc].back.text = updatedValue
                        e.preventDefault();
                        e.stopPropagation();
                    }
            
                    if(e.shiftKey && e.which == 71) {
                        let updatedValue = ''
                        if(valueArray && valueArray.length > 1){
                            let lastArrayValue = valueArray[valueArray.length - 1]
                            var textValueArray = lastArrayValue.split('</div>');
            
                            for(let i = 0; i < valueArray.length - 1; i++){
                                updatedValue += '<div>' + valueArray[i]
                            }
                            updatedValue += '<div>' + textValueArray[0] + '\u180E' + textValueArray[1];
                        } else {
                            updatedValue = backLastValue + '\u180E'
                        }
            
                        clone[dc].back.text = updatedValue
                        e.preventDefault();
                        e.stopPropagation();
                    }
                }
                break;
            }
        }

        setDialogCards(clone)
    }

    const onHandlerCrosswordWordAdd = () => {
        setCrosswordModal(true)
    }

    const onHandlerCrosswordWordEdit = () => {
        setCrosswordModal(true)
    }

    const crosswordGenerate = (data) => {
        const layout = generator.generateLayout(data);

        let across = {}
        let down = {}
        if(layout.result && layout.result.length > 0){
            for(let i = 0; i < layout.result.length; i++){
                if(layout.result[i].orientation == 'across'){
                    let acrossObj = {
                        [layout.result[i].position]: {
                            clue: layout.result[i].clue,
                            answer: layout.result[i].answer,
                            row: layout.result[i].starty,
                            col: layout.result[i].startx,
                        }
                    }

                    across = Object.assign(across, acrossObj);
                } else if(layout.result[i].orientation == 'down') {
                    let downObj = {
                        [layout.result[i].position]: {
                            clue: layout.result[i].clue,
                            answer: layout.result[i].answer,
                            row: layout.result[i].starty,
                            col: layout.result[i].startx,
                        }
                    }

                    down = Object.assign(down, downObj);
                }
            }

            for(let i = 0; i < layout.result.length; i++){
                layout.result[i].row = layout.result[i].starty
                layout.result[i].col = layout.result[i].startx
            }
        }
    
        let crossData = {
            across: across,
            down: down
        }

        setCrosswordList(layout.result)
        setCrosswordData(crossData)
        setCrosswordModal(false)
    }

    return (
        <Modal
            className={crosswordModal ? "is-open-crossword-modal" : ""}
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
                {
                    typeCode == 'ACTIVE_QUESTION'
                        ?
                        <Questions />
                        : null
                }
                {
                    typeCode == 'VIDEO' && item?.videoFile
                        ?
                        <Row className='mt-3 justify-content-center'>
                            <iframe
                                src={`https://player.vimeo.com/video/${item?.videoFile.split('/').at(-1)}`}
                                width="400"
                                height="300"
                                allow="autoplay; fullscreen; picture-in-picture"
                                title="Untitled"
                            />
                        </Row>
                        : null
                }
                {
                    typeCode === 'DIALOG_CARD' && <>
                        {
                            dialogCards?.map((dialogCardObj, dIndex) => {
                                return <Row className='mt-3' key={'dialog_card_' + dIndex}>
                                    <Col>
                                        <Card className='mb-3' style={{
                                            border: 'solid 1px rgba(255, 91, 29, 0.3)'
                                        }}>
                                            <Card.Body className='p-2'>
                                                <p className="my-2 mr-2 modal-select-title mb-2">Нүүр тал</p>

                                                <div className='col-12 d-flex justify-content-center'>
                                                    <div className="register-tab-container d-flex mb-3" style={{width: 'fit-content'}}>
                                                        <span
                                                            onClick={() => {
                                                                onTableChange(0, dIndex, 'FRONT')
                                                            }}
                                                            className={`tab cursor-pointer ${dialogCardObj.front.tabIndex === 0 && "active"}`}
                                                        >
                                                            {t('common.cyrillic')}
                                                        </span>
                                                        <span
                                                            onClick={() => {
                                                                onTableChange(1, dIndex, 'FRONT')
                                                            }}
                                                            className={`tab cursor-pointer ${dialogCardObj.front.tabIndex === 1 && "active"}`}
                                                        >
                                                            {t('common.mongolBichig')}
                                                        </span>
                                                    </div>
                                                </div>
                                                
                                                <div className="mx-3 d-flex flex-row mini-ck-editor">
                                                    {
                                                        dialogCardObj.front.tabIndex 
                                                        ?
                                                            <div>
                                                                <ResizeProvider>
                                                                    <ResizeConsumer
                                                                        className="resize-container mb-1"
                                                                        // onSizeChanged={handleSizeChanged}
                                                                        // updateDatasetBySize={getDatasetBySize}
                                                                    >
                                                                        <ContentEditable
                                                                            ref={el => frontRef.current[dIndex] = el}
                                                                            className={'tradition-text'}
                                                                            html={dialogCardObj?.front?.text}
                                                                            onChange={(e) => {
                                                                                onDialogCardTextChange(e?.target?.value, dIndex, 'FRONT')
                                                                            }}
                                                                            onKeyDown={(e) => {
                                                                                onKeyDown(e, dIndex, 'FRONT')
                                                                            }}
                                                                            tagName='article'
                                                                            onPaste={(e) => {
                                                                                e.preventDefault();
                                                                                const text = e.clipboardData.getData('text/plain');
                                                                                const value = dialogCardObj?.front?.text ? `${dialogCardObj?.front?.text}${text}` : text;
                                                                                onDialogCardTextChange(value, dIndex, 'FRONT')
                                                                            }}
                                                                        />
                                                                    </ResizeConsumer>
                                                                </ResizeProvider>
                                                                <div style={{fontSize: 11}}>
                                                                    <div>Үгийн орхиц "а" үсэг оруулахдаа "shift + a" дараад дахин "a" үсэг дарна</div>
                                                                    <div>Үгийн адагт ордог "г", "н"  үсэг оруулахдаа "shift + g" дараад орхиц "а" үсэг оруулах бол "а" үсэг дахин дарна</div>
                                                                    <div>Тоо оруулах бол "shift" + "тоогоо" оруулна уу</div>
                                                                </div>
                                                            </div>
                                                        :
                                                            <CKEditor
                                                                // key={Math.random()}
                                                                editor={ClassicEditor}
                                                                data={dialogCardObj?.front?.text}
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
                                                                    onDialogCardTextChange(data, dIndex, 'FRONT')
                                                                }}
                                                            />
                                                    }
                                                    {/* <input
                                                        className='form-control ml-2'
                                                        type='text'
                                                        onChange={(e) => {
                                                            onDialogCardTextChange(e, dIndex, 'FRONT')
                                                        }}
                                                        value={dialogCardObj?.front?.text}
                                                    /> */}
                                                </div>
                                                <div className="mx-3 d-flex flex-row mt-3">
                                                    <p className="my-2 mr-2 modal-select-title">Зураг</p>
                                                    {
                                                        dialogCardObj?.front?.image
                                                            ?
                                                            <div className="position-relative ml-2 mt-2">
                                                                <img alt="answer" src={dialogCardObj?.front?.image && typeof dialogCardObj?.front?.image === "object" ? URL.createObjectURL(dialogCardObj?.front?.image) : dialogCardObj?.front?.image} style={{
                                                                    width: 100,
                                                                    objectFit: 'contain',
                                                                    border: 'solid 1px #ccc',
                                                                    borderRadius: 10
                                                                }} />
                                                                <CloseButton className="absolute" onClick={() => {
                                                                    onDialogImageRemove(dIndex, 'FRONT', dialogCardObj?.id)
                                                                }} />
                                                            </div>
                                                            :
                                                            <ButtonOutline className='ml-2' text={t("quiz.chooseImage")} onClick={(e) => onDialogImageClick(dIndex, 'FRONT')}/>
                                                    }
                                                </div>
                                                <div className="mx-3 d-flex flex-row mt-3">
                                                    <p className="my-2 mr-2 modal-select-title">Аудио</p>
                                                    {
                                                        dialogCardObj?.front?.audio
                                                            ?
                                                            <div className="position-relative mt-2 d-flex flex-row">
                                                                {
                                                                    dialogCardObj?.front?.audio && typeof dialogCardObj?.front?.audio === "object" 
                                                                    ? 
                                                                        <span 
                                                                            style={{
                                                                                padding: 5,
                                                                                marginRight: 5,
                                                                                border: 'solid 1px #ccc',
                                                                                borderRadius: 10,
                                                                                maxWidth: 150,
                                                                                overflow: 'hidden',
                                                                                textOverflow: 'ellipsis',
                                                                                whiteSpace: 'nowrap',
                                                                                display: 'inherit'
                                                                            }}
                                                                        >
                                                                            {dialogCardObj?.front?.audio?.name}
                                                                        </span>
                                                                    :
                                                                        <ReactAudioPlayer
                                                                            controls
                                                                            src={dialogCardObj.front.audio}
                                                                        />
                                                                }
                                                                <CloseButton onClick={() => {
                                                                    onDialogAudioRemove(dIndex, 'FRONT', dialogCardObj?.id)
                                                                }} />
                                                            </div>
                                                            :
                                                            <ButtonOutline className='ml-1' text={t("quiz.addAudioFile")} onClick={(e) => onDialogAudioClick(dIndex, 'FRONT')} />
                                                    }
                                                </div>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                    <Col>
                                        <Card className='mb-3' style={{
                                            border: 'solid 1px rgba(255, 91, 29, 0.3)'
                                        }}>
                                            <Card.Body className='p-2'>
                                                <p className="my-2 mr-2 modal-select-title">Ар тал</p>

                                                <div className='col-12 d-flex justify-content-center'>
                                                    <div className="register-tab-container d-flex mb-3" style={{width: 'fit-content'}}>
                                                        <span
                                                            onClick={() => {
                                                                onTableChange(0, dIndex, 'BACK')
                                                            }}
                                                            className={`tab cursor-pointer ${dialogCardObj.back.tabIndex === 0 && "active"}`}
                                                        >
                                                            {t('common.cyrillic')}
                                                        </span>
                                                        <span
                                                            onClick={() => {
                                                                onTableChange(1, dIndex, 'BACK')
                                                            }}
                                                            className={`tab cursor-pointer ${dialogCardObj.back.tabIndex === 1 && "active"}`}
                                                        >
                                                            {t('common.mongolBichig')}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="mx-3 d-flex flex-row mini-ck-editor">
                                                    {
                                                        dialogCardObj.back.tabIndex 
                                                        ?
                                                            <div>
                                                                <ResizeProvider>
                                                                    <ResizeConsumer
                                                                        className="resize-container mb-1"
                                                                        // onSizeChanged={handleSizeChanged}
                                                                        // updateDatasetBySize={getDatasetBySize}
                                                                    >
                                                                        <ContentEditable
                                                                            ref={el => backRef.current[dIndex] = el}
                                                                            className={'tradition-text'}
                                                                            html={dialogCardObj?.back?.text}
                                                                            onChange={(e) => {
                                                                                onDialogCardTextChange(e?.target?.value, dIndex, 'BACK')
                                                                            }}
                                                                            onKeyDown={(e) => {
                                                                                onKeyDown(e, dIndex, 'BACK')
                                                                            }}
                                                                            tagName='article'
                                                                            onPaste={(e) => {
                                                                                e.preventDefault();
                                                                                const text = e.clipboardData.getData('text/plain');
                                                                                const value = dialogCardObj?.back?.text ? `${dialogCardObj?.back?.text}${text}` : text;
                                                                                onDialogCardTextChange(value, dIndex, 'BACK')
                                                                            }}
                                                                        />
                                                                    </ResizeConsumer>
                                                                </ResizeProvider>
                                                                <div style={{fontSize: 11}}>
                                                                    <div>Үгийн орхиц "а" үсэг оруулахдаа "shift + a" дараад дахин "a" үсэг дарна</div>
                                                                    <div>Үгийн адагт ордог "г", "н"  үсэг оруулахдаа "shift + g" дараад орхиц "а" үсэг оруулах бол "а" үсэг дахин дарна</div>
                                                                    <div>Тоо оруулах бол "shift" + "тоогоо" оруулна уу</div>
                                                                </div>
                                                            </div>
                                                        :
                                                            <CKEditor
                                                                // key={Math.random()}
                                                                editor={ClassicEditor}
                                                                data={dialogCardObj?.back?.text}
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
                                                                    onDialogCardTextChange(data, dIndex, 'BACK')
                                                                }}
                                                            />
                                                    }
                                                    {/* <input
                                                        className='form-control ml-2'
                                                        type='text'
                                                        onChange={(e) => {
                                                            onDialogCardTextChange(e, dIndex, 'BACK')
                                                        }}
                                                        value={dialogCardObj?.back?.text}
                                                    /> */}
                                                </div>
                                                <div className="mx-3 d-flex flex-row mt-3">
                                                    <p className="my-2 mr-2 modal-select-title">Зураг</p>
                                                    {
                                                        dialogCardObj?.back?.image
                                                            ?
                                                            <div className="position-relative ml-2 mt-2">
                                                                <img alt="answer" src={dialogCardObj?.back?.image && typeof dialogCardObj?.back?.image === "object" ? URL.createObjectURL(dialogCardObj?.back?.image) : dialogCardObj?.back?.image} style={{
                                                                    width: 100,
                                                                    objectFit: 'contain',
                                                                    border: 'solid 1px #ccc',
                                                                    borderRadius: 10
                                                                }} />
                                                                <CloseButton className="absolute" onClick={() => {
                                                                    onDialogImageRemove(dIndex, 'BACK', dialogCardObj?.id)
                                                                }} />
                                                            </div>
                                                            :
                                                            <ButtonOutline className='ml-2' text={t("quiz.chooseImage")} onClick={(e) => onDialogImageClick(dIndex, 'BACK')} />
                                                    }
                                                </div>
                                                <div className="mx-3 d-flex flex-row mt-3">
                                                    <p className="my-2 mr-2 modal-select-title">Аудио</p>
                                                    {
                                                        dialogCardObj?.back?.audio
                                                            ?
                                                            <div className="position-relative mt-2 d-flex flex-row">
                                                                {
                                                                    dialogCardObj?.back?.audio && typeof dialogCardObj?.back?.audio === "object" 
                                                                    ?
                                                                        <span 
                                                                            style={{
                                                                                padding: 5,
                                                                                marginRight: 5,
                                                                                border: 'solid 1px #ccc',
                                                                                borderRadius: 10,
                                                                                maxWidth: 150,
                                                                                overflow: 'hidden',
                                                                                textOverflow: 'ellipsis',
                                                                                whiteSpace: 'nowrap',
                                                                                display: 'inherit'
                                                                            }}
                                                                        >
                                                                            {dialogCardObj?.back?.audio?.name}
                                                                        </span>
                                                                    :
                                                                        <ReactAudioPlayer
                                                                            controls
                                                                            src={dialogCardObj.back.audio}
                                                                        />
                                                                }
                                                                <CloseButton onClick={() => {
                                                                    onDialogAudioRemove(dIndex, 'BACK', dialogCardObj?.id)
                                                                }} />
                                                            </div>
                                                            :
                                                            <ButtonOutline className='ml-1' text={t("quiz.addAudioFile")} onClick={(e) => onDialogAudioClick(dIndex, 'BACK')} />
                                                    }
                                                </div>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                    <Col xs="auto">
                                        <div style={{
                                            width: 100,
                                            height: '100%',
                                            position: 'relative'
                                        }}>
                                            <CloseButton onClick={() => {
                                                onRemoveDialogCardRow(dIndex)
                                            }} />
                                            <div style={{ display: 'flex', position: 'absolute', bottom: 20 }}>
                                                {
                                                    dIndex > 0 &&
                                                    <Button
                                                        variant="outline-alternate"
                                                        className="btn-icon btn-icon-only position-relative"
                                                        style={{ marginRight: '0.5rem' }}
                                                        size="sm"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            onChangeOrderDialogCard(dIndex, dIndex - 1)
                                                            // changeOrdering(topicObj?.id, topics[t - 1]?.id)
                                                        }}
                                                    >
                                                        <ArrowUpwardIcon />
                                                    </Button>
                                                }
                                                {
                                                    dIndex < (dialogCards.length - 1) && <Button
                                                        variant="outline-alternate"
                                                        className="btn-icon btn-icon-only position-relative"
                                                        size="sm"
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            onChangeOrderDialogCard(dIndex, dIndex + 1)
                                                        }}
                                                    >
                                                        <ArrowDownwardIcon />
                                                    </Button>
                                                }
                                            </div>
                                        </div>
                                    </Col>
                                </Row>
                            })
                        }
                        <button className={"btn btn-outline-primary"} onClick={onAddDialogCardRow}>{'Карт нэмэх'}</button>
                    </>
                }
                {
                    typeCode === 'CROSSWORD' && 
                    <>
                        {
                            crosswordList && crosswordList.length > 0
                            ?
                                <div className='mb-2 mt-4'>
                                    <button className={"btn add-button text-uppercase btn-info mb-2"} onClick={onHandlerCrosswordWordEdit} style={{backgroundColor: 'rgb(54, 163, 247)', height: 32}}>{t('crossWord.editCrossword')}</button>
                                </div>
                            :
                                <div className='mb-2 mt-4'>
                                    <button className={"btn btn-outline-primary text-uppercase mb-2"} onClick={onHandlerCrosswordWordAdd}>{t('crossWord.addCrossword')}</button>
                                </div>
                        }
                        
                        <CrossWordComponent 
                            rowCount={rowCount}
                            colCount={colCount}
                            acrossLabel={t('crossWord.acrossLabel')}
                            downLabel={t('crossWord.downLabel')}
                            data={crosswordData}
                            isDisabled={true}
                        />
                    </>
                }
            </Modal.Body>
            <Modal.Footer className="p-3">
                <Row className='d-flex'>
                    <Col className='d-flex justify-content-center'>
                        <Button className="cursor-pointer cancel-button pr-4" variant='link' onClick={onClose}>
                            <span style={{ color: '#ff2f1a' }}>{t("common.cancel")}</span>
                        </Button>
                        <Button className="cursor-pointer save-button" variant='empty' onClick={onSubmit}>
                            <span style={{ color: '#555555' }}>{t("common.save")}</span>
                        </Button>
                    </Col>
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
            {
                showModal &&
                <ViewModal
                    show={showModal}
                    onClose={() => {
                        setShowModal(false)
                    }}
                    path={selectedPath}
                />
            }
            {
                crosswordModal &&
                <CrosswordModal
                    show={crosswordModal}
                    onClose={() => {
                        setCrosswordModal(false)
                    }}
                    onSave={crosswordGenerate}
                    data={crosswordList}
                />
            }
        </Modal>
    )
}

export default ContentSubmit
