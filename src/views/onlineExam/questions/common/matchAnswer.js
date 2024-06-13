import React, { useState, useEffect, useRef } from "react";
import CloseButton from "components/buttons/CloseButton";
import CheckBoxButton from "components/buttons/CheckBoxButton";
import ButtonOutline from "components/buttons/ButtonOutline";
import { useTranslation } from "react-i18next";
import ClassicEditor from "ckeditor5-build-classic-mathtype";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import AnswerType from "./answerType";
import ContentEditable from 'react-contenteditable';
import { ResizeProvider, ResizeConsumer } from "react-resize-context";
import { indexOf } from "lodash";

const closeButtonStyle = {
    position: 'relative',
    float: 'right',
    margin: 0,
    bottom: 15,
    left: 15
}

export default function MatchAnswer({
    answerObj = null,
    clearData = false,
    initData = [],
    rowIndex = 0,
    onSelectRow = () => { },
    // removeRow = () => { },
    onAnswerChanged = () => { },
    onInputScoreChange = () => { },
    questionObject = {},
    onFileRemoved = () => { },
    passData = () => { },
    defaultAnswers = [],
}) {
    const { t } = useTranslation();
    const fileInputAnswerRefs = useRef([]);
    const fileInputQuestionRefs = useRef([]);
    const textRef = useRef([]);

    const [answerType, setAnswerType] = useState('text')
    const [inputValue, setInputValue] = useState('')
    const [answerFile, setAnswerFile] = useState(answerObj?.filePath || null)
    const [imageValue, setImageValue] = useState(null)
    const [equationValue, setEquationValue] = useState('')
    const [mbScriptValue, setMbScriptValue] = useState('')
    const [updateView, setUpdateView] = useState(false)
    const [initLoader, setInitLoader] = useState(false);

    const [size, setSize] = useState({})

    const [questionMatchAnswers, setQuestionMatchAnswers] = useState([
        {
            data: [
                {
                    answer: {
                        equation: null,
                        file: null,
                        score: null,
                        type: "text",
                        value: ""
                    },
                },
                {
                    value: {
                        equation: null,
                        file: null,
                        score: null,
                        type: "text",
                        value: ""
                    }
                },
            ]
        }
    ])

    useEffect(() => {
        if(initData && initData.length > 0 && !initLoader){
            setQuestionMatchAnswers(initData)
            setInitLoader(true)
        }
    }, [initData])

    useEffect(() => {
        if(defaultAnswers && defaultAnswers.length > 0){
            setQuestionMatchAnswers(defaultAnswers)
        }
    }, [defaultAnswers])

    useEffect(() => {
        if (clearData) {
            setAnswerType('text')
            setInputValue('')
            setImageValue(null)
            setEquationValue('')
            setMbScriptValue('')

            setUpdateView(!updateView)
        }
    }, [clearData])

    useEffect(() => {
        CKEditor.editorUrl =
            "https://cdn.ckeditor.com/ckeditor5/39.0.2/classic/ckeditor.js";
    }, [])

    useEffect(() => {
        onAnswerChanged(rowIndex, answerType, inputValue, imageValue, equationValue, mbScriptValue, questionObject)
    }, [answerType, inputValue, imageValue, equationValue, mbScriptValue])

    const onAnswerTypeClick = (type = '', qType = '', index = 0, dIndex = 0) => {
        const cloneAnswerMatchList = [...questionMatchAnswers];

        if (cloneAnswerMatchList && cloneAnswerMatchList.length > 0) {
            if (qType == 'answer') {
                cloneAnswerMatchList[index].data[dIndex].answer.type = type;
                cloneAnswerMatchList[index].data[dIndex].answer.file = null;
                cloneAnswerMatchList[index].data[dIndex].answer.value = null;
                cloneAnswerMatchList[index].data[dIndex].answer.equation = null;
            } else if (qType == 'value') {
                cloneAnswerMatchList[index].data[dIndex].value.type = type;
                cloneAnswerMatchList[index].data[dIndex].value.file = null;
                cloneAnswerMatchList[index].data[dIndex].value.value = null;
                cloneAnswerMatchList[index].data[dIndex].value.equation = null;
            }
        }

        passData(cloneAnswerMatchList)
        setQuestionMatchAnswers(cloneAnswerMatchList)
    }

    const resetAction = () => {
        setQuestionMatchAnswers(
            {
                data: [
                    {
                        answer: {
                            equation: null,
                            file: null,
                            score: null,
                            type: "text",
                            value: ""
                        },
                    },
                    {
                        value: {
                            equation: null,
                            file: null,
                            score: null,
                            type: "text",
                            value: ""
                        }
                    },
                ]
            }
        )
    }

    const onInputChange = (e, qType = '', index = 0, dIndex = 0) => {
        const cloneAnswerMatchList = [...questionMatchAnswers];

        if (cloneAnswerMatchList && cloneAnswerMatchList.length > 0) {
            if (qType == 'answer') {
                cloneAnswerMatchList[index].data[dIndex].answer.value = e?.target?.value;
            } else if (qType == 'value') {
                cloneAnswerMatchList[index].data[dIndex].value.value = e?.target?.value;
            } else if (qType == 'score') {
                if (e?.target?.value && e?.target?.value.length > 0) {
                        let input = e?.target?.value
                        if (input.match(/^([0-9]{1,})?(\.)?([0-9]{1,})?$/)) {
                            for (let a = 0; a < cloneAnswerMatchList.length; a++) {
                                if (a === index) {
                                    cloneAnswerMatchList[index].data[dIndex].value.score = e?.target?.value;
                                    break;
                                }
                            }
                        }
                    
                } else {
                    for (let a = 0; a < cloneAnswerMatchList.length; a++) {
                        if (a === index) {
                            cloneAnswerMatchList[index].data[dIndex].value.score = '';
                            break;
                        }
                    }
                }
            }
        }

        passData(cloneAnswerMatchList)
        setQuestionMatchAnswers(cloneAnswerMatchList)
    }

    const onImageClick = (qType, index) => {
        if (qType == 'answer') {
            fileInputAnswerRefs?.current[index]?.click();
        } else if (qType == 'value') {
            fileInputQuestionRefs?.current[index]?.click();
        }
    }

    const onLoadImage = (e, qType = '', index = 0, dIndex = 0) => {

        const cloneAnswerMatchList = [...questionMatchAnswers];
        if (e?.target?.files && e?.target?.files.length > 0) {
            if (cloneAnswerMatchList && cloneAnswerMatchList.length > 0) {
                if (qType == 'answer') {
                    cloneAnswerMatchList[index].data[dIndex].answer.file = e?.target?.files[0];
                    e.currentTarget.value = null
                } else if (qType == 'value') {
                    cloneAnswerMatchList[index].data[dIndex].value.file = e?.target?.files[0];
                    e.currentTarget.value = null
                }
            }
        }

        passData(cloneAnswerMatchList)
        setQuestionMatchAnswers(cloneAnswerMatchList)
    }

    const onRemoveImage = (qType = '', index = 0, dIndex = 0) => {
        const cloneAnswerMatchList = [...questionMatchAnswers];
        if (cloneAnswerMatchList && cloneAnswerMatchList.length > 0) {
            if (qType == 'answer') {
                cloneAnswerMatchList[index].data[dIndex].answer.file = null;
            } else if (qType == 'value') {
                cloneAnswerMatchList[index].data[dIndex].value.file = null;
            }
        }

        passData(cloneAnswerMatchList)
        setQuestionMatchAnswers(cloneAnswerMatchList)
    }

    const getFile = () => {
        return null
        // return answerFile
    }

    const clearFile = () => {
        setAnswerFile(null)
        onFileRemoved(answerObj?.id)
    }

    const getDatasetBySize = size => ({
        widthRange: size.width > 200 ? "large" : "small",
        heightRange: size.height > 200 ? "large" : "small"
    });

    const handleSizeChanged = sizeObj => {
        setSize(sizeObj)
    };

    const onEquationHandler = (editor, qType, index, dIndex) => {
        const cloneAnswerMatchList = [...questionMatchAnswers];
        const data = editor.getData();

        if (data) {
            if (cloneAnswerMatchList && cloneAnswerMatchList.length > 0) {
                if (qType == 'answer') {
                    cloneAnswerMatchList[index].data[dIndex].answer.equation = data;
                } else if (qType == 'value') {
                    cloneAnswerMatchList[index].data[dIndex].value.equation = data;
                }
            }
        }

        passData(cloneAnswerMatchList)
        setQuestionMatchAnswers(cloneAnswerMatchList)
    }

    const onMbScriptHandler = (value, qType, index, dIndex) => {
        const cloneAnswerMatchList = [...questionMatchAnswers];
        if (cloneAnswerMatchList && cloneAnswerMatchList.length > 0) {
            if (qType == 'answer') {
                cloneAnswerMatchList[index].data[dIndex].answer.value = value;
            } else if (qType == 'value') {
                cloneAnswerMatchList[index].data[dIndex].value.value = value;
            }
        }

        passData(cloneAnswerMatchList)
        setQuestionMatchAnswers(cloneAnswerMatchList)
    }

    const onAnswerAdd = () => {
        const answerMatchList = [...questionMatchAnswers];
        answerMatchList.push({
            data: [
                {
                    answer: {
                        equation: null,
                        file: null,
                        score: null,
                        type: "text",
                        value: ""
                    },
                },
                {
                    value: {
                        equation: null,
                        file: null,
                        score: null,
                        type: "text",
                        value: ""
                    }
                },
            ]
        })

        passData(answerMatchList)
        setQuestionMatchAnswers(answerMatchList)
    }

    const removeRow = (index) => {
        const cloneAnswerMatchList = [...questionMatchAnswers];
        cloneAnswerMatchList.splice(index, 1);

        passData(cloneAnswerMatchList)
        setQuestionMatchAnswers(cloneAnswerMatchList)
    }

    const onKeyDown = (e, qType, index, dIndex) => {
        let lastValue = textRef?.current[index + '_' + dIndex]?.lastHtml
        if(lastValue){
            let valueArray = lastValue.split(/<div ?\/?>/)

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
                    updatedValue = lastValue + '\u202F'
                }

                const cloneAnswerMatchList = [...questionMatchAnswers];
                if (cloneAnswerMatchList && cloneAnswerMatchList.length > 0) {
                    if (qType == 'answer') {
                        cloneAnswerMatchList[index].data[dIndex].answer.value = updatedValue;
                    } else if (qType == 'value') {
                        cloneAnswerMatchList[index].data[dIndex].value.value = updatedValue;
                    }
                }

                passData(cloneAnswerMatchList)
                setQuestionMatchAnswers(cloneAnswerMatchList)
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
                    updatedValue = lastValue + '\u180E'
                }

                const cloneAnswerMatchList = [...questionMatchAnswers];
                if (cloneAnswerMatchList && cloneAnswerMatchList.length > 0) {
                    if (qType == 'answer') {
                        cloneAnswerMatchList[index].data[dIndex].answer.value = updatedValue;
                    } else if (qType == 'value') {
                        cloneAnswerMatchList[index].data[dIndex].value.value = updatedValue;
                    }
                }

                passData(cloneAnswerMatchList)
                setQuestionMatchAnswers(cloneAnswerMatchList)
                e.preventDefault();
                e.stopPropagation();
            }
        }
    }

    const renderAnswer = (matchAnswers, index) => {
        if (matchAnswers.data && matchAnswers.data.length > 0) {
            return matchAnswers.data.map((data, dIndex) => {
                if (data?.answer) {
                    let answer = data.answer
                    return (
                        <div key={'data_' + rowIndex + '_' + index + '_answer_' + dIndex}>
                            {
                                index > 0 && <CloseButton style={closeButtonStyle} onClick={() => removeRow(index)} />
                            }
                            <div className="d-flex flex-grow-1 flex-wrap">
                                <div className="d-flex flex-row align-items-center h-40 mr-4">
                                    <AnswerType className="ml-4" icon="text"
                                        active={answer.type === 'text'}
                                        onClick={() => onAnswerTypeClick('text', 'answer', index, dIndex)} />
                                    <AnswerType className="ml-1" icon="image"
                                        active={answer.type === 'image'}
                                        onClick={() => onAnswerTypeClick('image', 'answer', index, dIndex)} />
                                    <AnswerType className="ml-1" icon="equation"
                                        active={answer.type === 'equation'}
                                        onClick={() => onAnswerTypeClick('equation', 'answer', index, dIndex)} />
                                    <AnswerType
                                        className="ml-1"
                                        icon="mongolianScript"
                                        active={answer.type === 'mbscript'}
                                        onClick={() => onAnswerTypeClick('mbscript', 'answer', index, dIndex)}
                                    />
                                </div>
                                {
                                    answer.type === 'text' && <input
                                        className="modal-input grow"
                                        style={index > 0 ? {maxWidth: 'calc(100% - 242px)'} : {maxWidth: 'calc(100% - 272px)'}}
                                        placeholder={t("onlineExam.question")}
                                        value={answer.value}
                                        onChange={(e) => onInputChange(e, 'answer', index, dIndex)}
                                    />
                                }
                                {
                                    answer.type === 'image'
                                    && <>
                                        <input type='file'
                                            accept="image/png, image/jpeg"
                                            onChange={(e) => onLoadImage(e, 'answer', index, dIndex)} ref={(input) => (fileInputAnswerRefs.current[index] = input)}
                                            style={{
                                                display: 'none'
                                            }}
                                        />
                                        {
                                            getFile() !== null
                                                ?
                                                <div className="modal-input grow" style={{
                                                    height: 'auto',
                                                    border: 'none',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    maxWidth: 'calc(100% - 272px)',
                                                    margin: 0,
                                                    paddingLeft: 0
                                                }}>
                                                    <div className="position-relative ml-4 mt-2" style={{ display: 'inline-block' }}>
                                                        <img alt="answer" src={getFile()} style={{
                                                            width: 150,
                                                            objectFit: 'contain'
                                                        }} />
                                                        <CloseButton className="absolute" onClick={() => {
                                                            clearFile()
                                                        }} />
                                                    </div>
                                                </div>
                                                :
                                                <>
                                                    {
                                                        answer.file
                                                            ?
                                                            <div className="modal-input grow" style={{
                                                                height: 'auto',
                                                                border: 'none',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                maxWidth: 'calc(100% - 272px)',
                                                                margin: 0,
                                                                paddingLeft: 0
                                                            }}>
                                                                <div className="position-relative ml-4 mt-2" style={{ display: 'inline-block' }}>
                                                                    <img alt="answer" src={answer.file && typeof answer.file === "object" ? URL.createObjectURL(answer.file) : answer.file} style={{
                                                                        width: 150,
                                                                        objectFit: 'contain'
                                                                    }} />
                                                                    <CloseButton className="absolute" onClick={() => { onRemoveImage('answer', index, dIndex) }} />
                                                                </div>
                                                            </div>
                                                            :
                                                            <div className="modal-input grow" style={{
                                                                height: 'auto',
                                                                border: 'none',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                maxWidth: 'calc(100% - 272px)',
                                                                margin: 0,
                                                                paddingLeft: 0
                                                            }}>
                                                                <div style={{ display: 'inline-block' }} >
                                                                    <ButtonOutline text={t("quiz.chooseImage")} onClick={() => onImageClick('answer', index, dIndex)} />
                                                                </div>
                                                            </div>
                                                    }
                                                </>
                                        }
                                    </>
                                }
                                {
                                    answer.type === 'equation' &&
                                    <div className='match-sk-editor-container-first'>
                                        <CKEditor
                                            editor={ClassicEditor}
                                            data={answer.equation}
                                            config={{
                                                placeholder: t('onlineExam.question'),
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
                                            onChange={(event, editor) => { onEquationHandler(editor, 'answer', index, dIndex) }}
                                        />
                                    </div>
                                }
                                {
                                    answer.type === 'mbscript' &&
                                    <ResizeProvider>
                                        <ResizeConsumer
                                            className="resize-container mb-1"
                                            onSizeChanged={handleSizeChanged}
                                            updateDatasetBySize={getDatasetBySize}
                                            style={{width: 'calc(100% - 242px)'}}
                                        >
                                            <ContentEditable
                                                ref={el => textRef.current[index + '_' + dIndex] = el}
                                                className={'tradition-text'}
                                                html={answer.value}
                                                disabled={false}
                                                onChange={(e) => { onMbScriptHandler(e.target.value, 'answer', index, dIndex) }}
                                                onKeyDown={(e) => {
                                                    onKeyDown(e, 'answer', index, dIndex)
                                                }}
                                                tagName='article'
                                                onPaste={(e) => {
                                                    const text = e.clipboardData.getData('text/plain');
                                                    const value = answer.value ? `${answer.value}${text}` : text;
                                                    onMbScriptHandler(value, 'answer', index, dIndex)
                                                }}
                                            />
                                        </ResizeConsumer>
                                    </ResizeProvider>
                                }
                            </div>
                        </div>
                    )
                    
                } else if (data?.value) {
                    let question = data.value
                    return (
                        <div key={'data_' + rowIndex + '_' + index + '_value_' + dIndex} className="d-flex flex-grow-1 flex-wrap">
                            <div className="d-flex flex-row align-items-center h-40 mr-4">
                                <AnswerType className="ml-4" icon="text"
                                    active={question.type === 'text'}
                                    onClick={() => onAnswerTypeClick('text', 'value', index, dIndex)} />
                                <AnswerType className="ml-1" icon="image"
                                    active={question.type === 'image'}
                                    onClick={() => onAnswerTypeClick('image', 'value', index, dIndex)} />
                                <AnswerType className="ml-1" icon="equation"
                                    active={question.type === 'equation'}
                                    onClick={() => onAnswerTypeClick('equation', 'value', index, dIndex)} />
                                <AnswerType
                                    className="ml-1"
                                    icon="mongolianScript"
                                    active={question.type === 'mbscript'}
                                    onClick={() => onAnswerTypeClick('mbscript', 'value', index, dIndex)}
                                />
                            </div>
                            {
                                question.type === 'text' && <input
                                    className="modal-input grow non-max-width"
                                    placeholder={t("onlineLesson.answer")}
                                    value={question.value}
                                    onChange={(e) => onInputChange(e, 'value', index, dIndex)}
                                />
                            }
                            {
                                question.type === 'image'
                                && <>
                                    <input type='file'
                                        accept="image/png, image/jpeg"
                                        onChange={(e) => onLoadImage(e, 'value', index, dIndex)} ref={(input) => (fileInputQuestionRefs.current[index] = input)}
                                        style={{
                                            display: 'none'
                                        }}
                                    />
                                    {
                                        getFile() !== null
                                            ?
                                            <div className="modal-input grow" style={{
                                                height: 'auto',
                                                border: 'none',
                                                display: 'flex',
                                                alignItems: 'center',
                                                maxWidth: 'calc(100% - 272px)',
                                                margin: 0,
                                                paddingLeft: 0
                                            }}>
                                                <div className="position-relative ml-4 mt-2" style={{ display: 'inline-block' }}>
                                                    <img alt="question" src={getFile()} style={{
                                                        width: 150,
                                                        objectFit: 'contain'
                                                    }} />
                                                    <CloseButton className="absolute" onClick={() => {
                                                        clearFile()
                                                    }} />
                                                </div>
                                            </div>
                                            :
                                            <>
                                                {
                                                    question.file
                                                        ?
                                                        <div className="modal-input grow" style={{
                                                            height: 'auto',
                                                            border: 'none',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            maxWidth: 'calc(100% - 272px)',
                                                            margin: 0,
                                                            paddingLeft: 0
                                                        }}>
                                                            <div className="position-relative ml-4 mt-2" style={{ display: 'inline-block' }}>
                                                                <img alt="answer" src={question.file && typeof question.file === "object" ? URL.createObjectURL(question.file) : question.file} style={{
                                                                    width: 150,
                                                                    objectFit: 'contain'
                                                                }} />
                                                                <CloseButton className="absolute" onClick={() => (onRemoveImage('value', index, dIndex))} />
                                                            </div>
                                                        </div>
                                                        :
                                                        <div className="modal-input grow" style={{
                                                            height: 'auto',
                                                            border: 'none',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            maxWidth: 'calc(100% - 272px)',
                                                            margin: 0,
                                                            paddingLeft: 0
                                                        }}>
                                                            <div style={{ display: 'inline-block' }} >
                                                                <ButtonOutline text={t("quiz.chooseImage")} onClick={() => onImageClick('value', index, dIndex)} />
                                                            </div>
                                                        </div>
                                                }
                                            </>
                                    }
                                </>
                            }
                            {
                                question.type === 'equation' &&
                                <div className='match-sk-editor-container'>
                                    <CKEditor
                                        editor={ClassicEditor}
                                        data={question.equation}
                                        config={{
                                            placeholder: t("onlineLesson.answer"),
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
                                        onChange={(event, editor) => { onEquationHandler(editor, 'value', index, dIndex) }}
                                    />
                                </div>
                            }
                            {
                                question.type === 'mbscript' &&
                                <ResizeProvider>
                                    <ResizeConsumer
                                        className="resize-container"
                                        onSizeChanged={handleSizeChanged}
                                        updateDatasetBySize={getDatasetBySize}
                                        style={{width: 'calc(100% - 272px)'}}
                                    >
                                        <ContentEditable
                                            ref={el => textRef.current[index + '_' + dIndex] = el}
                                            className={'tradition-text'}
                                            html={question.value || ''}
                                            disabled={false}
                                            onChange={(e) => { onMbScriptHandler(e.target.value, 'value', index, dIndex) }}
                                            onKeyDown={(e) => {
                                                onKeyDown(e, 'value', index, dIndex)
                                            }}
                                            tagName='article'
                                            onPaste={(e) => {
                                                const text = e.clipboardData.getData('text/plain');
                                                const value = question.value ? `${question.value}${text}` : text;
                                                onMbScriptHandler(value, 'value', index, dIndex)
                                            }}
                                        />
                                    </ResizeConsumer>
                                </ResizeProvider>
                            }
                            <input
                                type='text'
                                style={{ width: 100, height: 38 }}
                                className="form-control ml-2"
                                placeholder={t("questionnaire.score")}
                                value={question.score || ''}
                                onChange={(e) => onInputChange(e, 'score', index, dIndex)}
                            />
                        </div>
                    )
                }
            })
        }
    }

    return (
        <div key={'row_index_' + rowIndex} className={"d-inline align-items-center"} style={rowIndex > 0 ? { marginTop: '0.1rem' } : {}}>
            {
                questionMatchAnswers && questionMatchAnswers.length > 0 &&
                questionMatchAnswers.map((matchAnswers, index) => {
                    return <div key={'match_answer_index_' + rowIndex + '_' + index} className={index != 0 ? "card-alternate mt-2" : "card-alternate"}>
                        {renderAnswer(matchAnswers, index)}
                    </div>
                })
            }
            <div style={{ width: 150, position: 'relative' }} className="mt-2">
                <ButtonOutline text={t("common.add")} primary onClick={onAnswerAdd} />
            </div>
        </div>
    );
}
