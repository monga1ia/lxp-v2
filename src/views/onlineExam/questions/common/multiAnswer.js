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
import { tableCellClasses } from "@mui/material";
import { Calculate } from "@mui/icons-material";

const closeButtonStyle = {
    marginLeft: 8,
    position: 'relative',
    top: 2,
    margin: 1,
    left: 6,
}

export default function MultiAnswer({
    action = '',
    answerObj = null,
    clearData = false,
    selectedAnswerIndexes = null,
    rowIndex = 0,
    onSelectRow = () => { },
    removeRow = () => { },
    onAnswerChanged = () => { },
    onInputScoreChange = () => { },
    questionObject = {},
    onFileRemoved = () => { },
    hasDescription = false,
    onInputKeyDown,
    inputRef
}) {
    const { t } = useTranslation();
    const fileInputRef = useRef();
    const textRef = useRef(null)

    const [answerType, setAnswerType] = useState('text')
    const [inputValue, setInputValue] = useState('')
    const [inputDescriptionValue, setInputDescriptionValue] = useState('')
    const [answerFile, setAnswerFile] = useState(answerObj?.filePath || null)
    const [imageValue, setImageValue] = useState(null)
    const [equationValue, setEquationValue] = useState('')
    const [mbScriptValue, setMbScriptValue] = useState('')
    const [updateView, setUpdateView] = useState(false)

    const [size, setSize] = useState({})

    useEffect(() => {
        setAnswerType(answerObj?.answerType || 'text')
        setInputDescriptionValue(answerObj?.description || '')

        if (answerObj?.answerType === 'text') {
            setInputValue(answerObj?.answer || '')
        } else if (answerObj?.answerType === 'equation') {
            setEquationValue(answerObj?.answer || '')
        } else if (answerObj?.answerType === 'mbscript') {
            setMbScriptValue(answerObj?.answer)
        } else if (answerObj?.answerType === 'image') {
            setEquationValue(answerObj?.answer || '')
        }
        setAnswerFile(answerObj?.filePath || null)
    }, [answerObj])

    useEffect(() => {
        if (clearData) {
            setAnswerType('text')
            setInputValue('')
            setImageValue(null)
            setEquationValue('')
            setMbScriptValue('')
            setInputDescriptionValue('')

            setUpdateView(!updateView)
        }
    }, [clearData])

    useEffect(() => {
        CKEditor.editorUrl =
            "https://cdn.ckeditor.com/ckeditor5/39.0.2/classic/ckeditor.js";
    }, [])

    useEffect(() => {
        onAnswerChanged(rowIndex, answerType, inputValue, imageValue, equationValue, mbScriptValue, questionObject, inputDescriptionValue)
    }, [answerType, inputValue, imageValue, equationValue, mbScriptValue, inputDescriptionValue])

    useEffect(() => {
        if(action == 'add'){
            setInputValue(questionObject?.value || '')
            setAnswerType(questionObject?.type || 'text')
            setEquationValue(questionObject?.equation || '')
            setMbScriptValue(questionObject?.equation || '')
        }
    }, [questionObject])

    const onAnswerTypeClick = (type = '') => {
        setAnswerType(type)
    }

    const onInputChange = (e) => {
        setInputValue(e?.target?.value)
    }

    const onInputDescriptionChange = (e) => {
        setInputDescriptionValue(e?.target?.value)
    }

    const onImageClick = () => {
        fileInputRef?.current?.click();
    }

    const onLoadImage = (e) => {
        if (e?.target?.files && e?.target?.files.length > 0) {
            setImageValue(e?.target?.files[0])
            e.currentTarget.value = null
        } else {
            setImageValue(null)
        }
    }

    const getFile = () => {
        return answerFile
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

    const onKeyDown = (e) => {
        let lastValue = textRef?.current.lastHtml
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

            setMbScriptValue(updatedValue)
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

            setMbScriptValue(updatedValue)
            e.preventDefault();
            e.stopPropagation();
        }

        if(e.shiftKey && (e.which == 48 || e.which == 49 || e.which == 50 || e.which == 51 || e.which == 52 || e.which == 53 || e.which == 54 || e.which == 55 || e.which == 56 || e.which == 57)) {
            let updatedValue = ''
            if(valueArray && valueArray.length > 1){
                let lastArrayValue = valueArray[valueArray.length - 1]
                var textValueArray = lastArrayValue.split('</div>');

                for(let i = 0; i < valueArray.length - 1; i++){
                    updatedValue += '<div>' + valueArray[i]
                }

                if(e.which == 48){
                    updatedValue += '<div>' + textValueArray[0] + '\u1810' + textValueArray[1];
                } else if(e.which == 49){
                    updatedValue += '<div>' + textValueArray[0] + '\u1811' + textValueArray[1];
                } else if(e.which == 50){
                    updatedValue += '<div>' + textValueArray[0] + '\u1812' + textValueArray[1];
                } else if(e.which == 51){
                    updatedValue += '<div>' + textValueArray[0] + '\u1813' + textValueArray[1];
                } else if(e.which == 52){
                    updatedValue += '<div>' + textValueArray[0] + '\u1814' + textValueArray[1];
                } else if(e.which == 53){
                    updatedValue += '<div>' + textValueArray[0] + '\u1815' + textValueArray[1];
                } else if(e.which == 54){
                    updatedValue += '<div>' + textValueArray[0] + '\u1816' + textValueArray[1];
                } else if(e.which == 55){
                    updatedValue += '<div>' + textValueArray[0] + '\u1817' + textValueArray[1];
                } else if(e.which == 56){
                    updatedValue += '<div>' + textValueArray[0] + '\u1818' + textValueArray[1];
                } else if(e.which == 57){
                    updatedValue += '<div>' + textValueArray[0] + '\u1819' + textValueArray[1];
                }
            } else {
                // 0
                if(e.which == 48){
                    updatedValue = lastValue + '\u1810'
                } 
                // 1
                else if(e.which == 49){
                    updatedValue = lastValue + '\u1811'
                } 
                // 2
                else if(e.which == 50){
                    updatedValue = lastValue + '\u1812'
                } 
                // 3
                else if(e.which == 51){
                    updatedValue = lastValue + '\u1813'
                }
                // 4
                else if(e.which == 52){
                    updatedValue = lastValue + '\u1814'
                } 
                // 5
                else if(e.which == 53){
                    updatedValue = lastValue + '\u1815'
                } 
                // 6
                else if(e.which == 54){
                    updatedValue = lastValue + '\u1816'
                } 
                // 7
                else if(e.which == 55){
                    updatedValue = lastValue + '\u1817'
                }
                // 8 
                else if(e.which == 56){
                    updatedValue = lastValue + '\u1818'
                }
                // 9
                else if(e.which == 57){
                    updatedValue = lastValue + '\u1819'
                }
            }

            setMbScriptValue(updatedValue)
            e.preventDefault();
            e.stopPropagation();
        }

        // if(e.shiftKey && e.which == 65) {
        //     setQuestionValue((textRef?.current.lastHtml).trim() + '\u202F')
        //     e.preventDefault();
        //     e.stopPropagation();
        // }

        // if(e.shiftKey && e.which == 71) {
        //     setQuestionValue((textRef?.current.lastHtml).trim() + '\u180E')
        //     e.preventDefault();
        // }
    }

    return (
        <div>
            <div className={`${rowIndex > 0 ? "d-flex flex-row align-items-center mt-2" : "d-flex flex-row align-items-center"}`}>
                <div className="d-flex flex-row flex-grow-1 flex-wrap">
                    <div className="d-flex flex-row align-items-center h-40 mr-3">
                        <CheckBoxButton
                            className='mr-6'
                            checked={questionObject.isChecked}
                            onCheck={() => onSelectRow(rowIndex, !questionObject.isChecked)}
                        />

                        <AnswerType className="ml-4" icon="text"
                            active={answerType === 'text'}
                            onClick={() => onAnswerTypeClick('text')} />
                        <AnswerType className="ml-1" icon="image"
                            active={answerType === 'image'}
                            onClick={() => onAnswerTypeClick('image')} />
                        <AnswerType className="ml-1" icon="equation"
                            active={answerType === 'equation'}
                            onClick={() => onAnswerTypeClick('equation')} />
                        <AnswerType
                            className="ml-1"
                            icon="mongolianScript"
                            active={answerType === 'mbscript'}
                            onClick={() => onAnswerTypeClick('mbscript')}
                        />
                    </div>
                    {
                        answerType === 'text' && <input
                            ref={inputRef}
                            className="modal-input grow"
                            style={rowIndex > 0 ? {maxWidth: 'calc(100% - 210px)'} : {maxWidth: 'calc(100% - 214px)'}}
                            placeholder={t("quiz.placeholderAnswerText")}
                            value={inputValue}
                            onChange={onInputChange}
                            onKeyDown={(e) => {
                                onInputKeyDown(e, rowIndex)
                            }}
                        />
                    }
                    {
                        answerType === 'image' && 
                        <>
                            <input 
                                type='file'
                                accept="image/png, image/jpeg"
                                onChange={onLoadImage} ref={fileInputRef}
                                style={{
                                    display: 'none'
                                }}
                            />
                            {
                                getFile() !== null
                                    ?
                                    <div 
                                        className="modal-input grow" 
                                        style={{
                                            height: 'auto',
                                            border: 'none',
                                            display: 'flex',
                                            alignItems: 'center',
                                            maxWidth: 'calc(100% - 200px)',
                                            margin: 0,
                                            paddingLeft: 0
                                        }}
                                    >
                                        <div className="position-relative mt-2" style={{ display: 'inline-block' }}>
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
                                            imageValue
                                                ?
                                                <div className="modal-input grow" style={{
                                                    height: 'auto',
                                                    border: 'none',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    maxWidth: 'calc(100% - 200px)',
                                                    margin: 0,
                                                    paddingLeft: 0
                                                }}>
                                                    <div className="position-relative mt-2" style={{ display: 'inline-block' }}>
                                                        <img alt="answer" src={URL.createObjectURL(imageValue)} style={{
                                                            width: 150,
                                                            objectFit: 'contain'
                                                        }} />
                                                        <CloseButton className="absolute" onClick={() => {
                                                            setImageValue(null)
                                                        }} />
                                                    </div>
                                                </div>
                                                :
                                                <div className="modal-input grow" style={{
                                                    height: 'auto',
                                                    border: 'none',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    maxWidth: 'calc(100% - 200px)',
                                                    margin: 0,
                                                    paddingLeft: 0
                                                }}>
                                                    <ButtonOutline text={t("quiz.chooseImage")} onClick={onImageClick} />
                                                </div>
                                        }
                                    </>
                            }
                        </>
                    }
                    {
                        answerType === 'equation' &&
                        <div style={questionObject.isChecked ? {width: 'calc(100% - 322px)'} : {width: 'calc(100% - 214px)'}}>
                            <CKEditor
                                editor={ClassicEditor}
                                data={equationValue}
                                config={{
                                    placeholder: `Хариулт оруулна уу`,
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
                                    setEquationValue(data)
                                }}
                            />
                        </div>
                    }
                    {
                        answerType === 'mbscript' &&
                        <ResizeProvider>
                            <ResizeConsumer
                                className="resize-container"
                                onSizeChanged={handleSizeChanged}
                                updateDatasetBySize={getDatasetBySize}
                                style={questionObject.isChecked ? {width: 'calc(100% - 322px)'} : {width: 'calc(100% - 214px)'}}
                            >
                                <ContentEditable
                                    ref={textRef}
                                    className={'tradition-text'}
                                    html={mbScriptValue}
                                    disabled={false}
                                    onChange={(e) => {
                                        setMbScriptValue(e?.target?.value)
                                    }}
                                    onKeyDown={(e) => {
                                        onKeyDown(e)
                                    }}
                                    tagName='article'
                                    onPaste={(e) => {
                                        e.preventDefault();
                                        const text = e.clipboardData.getData('text/plain');
                                        const value = mbScriptValue ? `${mbScriptValue}${text}` : text;
                                        setMbScriptValue(value)
                                    }}
                                />
                            </ResizeConsumer>
                        </ResizeProvider>
                    }
                    {/* <div className="d-flex flex"> */}
                        {
                            questionObject.isChecked &&
                                <div>
                                    {rowIndex == 0 ? (
                                        <input
                                            type='text'
                                            style={{ width: 100, height: 38, marginRight: 32 }}
                                            className="modal-input ml-2 point"
                                            placeholder={t("questionnaire.score")}
                                            value={questionObject.score || ''}
                                            onChange={(e) => onInputScoreChange(rowIndex, e.target.value)}
                                        />
                                    ) : (
                                        <input
                                            type='text'
                                            style={{ width: 100, height: 38 }}
                                            className="modal-input ml-2 point"
                                            placeholder={t("questionnaire.score")}
                                            value={questionObject.score || ''}
                                            onChange={(e) => onInputScoreChange(rowIndex, e.target.value)}
                                        />
                                    )}
                                </div>
                        }
                        {
                            rowIndex > 0 && <CloseButton style={closeButtonStyle} onClick={() => removeRow(rowIndex)} />
                        }
                    {/* </div> */}
                </div>
            </div>
            {
                hasDescription &&
                <div className="d-flex mt-1 justify-content-end">
                    <div style={{width: 'calc(100% - 212px)', position: 'relative', right: 32}}>
                        <CKEditor
                            editor={ClassicEditor}
                            data={inputDescriptionValue}
                            config={{
                                placeholder: t("quiz.placeholderAnswerDescription"),
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
                                setInputDescriptionValue(data)
                            }}
                        />
                    </div>
                    {/* <textarea
                        className="form-control resize-vertical"
                        placeholder={t("quiz.placeholderAnswerDescription")}
                        value={inputDescriptionValue}
                        onChange={onInputDescriptionChange}
                        rows={2}
                        style={{position: 'relative', left: 180, maxWidth: 'calc(100% - 212px)'}}
                    /> */}
                </div>
            }
        </div>
    );
}
