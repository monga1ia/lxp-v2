import React, { useState, useRef, useEffect } from "react";
import ClassicEditor from "ckeditor5-build-classic-mathtype";
import { useTranslation } from "react-i18next";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ButtonOutline from "components/buttons/ButtonOutline";
import CloseButton from "components/buttons/CloseButton";
import CheckBoxButton from "components/buttons/CheckBoxButton";
import ContentEditable from 'react-contenteditable';
import { ResizeProvider, ResizeConsumer } from "react-resize-context";

const QuestionInfo = ({ 
    questionObj = null, 
    clearData = false, 
    selectedQTypeCode = null,
    onQuestionChanged = () => { }, 
    onFileRemoved = () => {},
    onHandlerHasDescription = () => {},
    onHandlerHasShuffle = () => {}
}) => {
    const { t } = useTranslation()
    const textRef = useRef(null)

    const [questionValue, setQuestionValue] = useState(questionObj?.question || "")
    const [questionFiles, setQuestionFiles] = useState(questionObj?.files || [])
    const [imageValue, setImageValue] = useState(null)
    const [audioFileValue, setAudioFileValue] = useState(null)
    const [hasDescription, setHasDescription] = useState(false)
    const [hasShuffle, setHasShuffle] = useState(false)
    const [selectedTabIndex, setSelectedTabIndex] = useState(0)

    const [updateView, setUpdateView] = useState(false)

    const handleFileSelect = (e) => {
        // Do something with the selected file
        const file = e.target.files[0]
        setAudioFileValue(file)
    }

    useEffect(() => {
        CKEditor.editorUrl =
            "https://cdn.ckeditor.com/ckeditor5/39.0.2/classic/ckeditor.js";
    }, [])

    useEffect(() => {
        if (clearData) {
            setQuestionValue('')
            setImageValue(null)
            setAudioFileValue(null)
            setHasDescription(false)

            setUpdateView(!updateView)
        }
    }, [clearData])

    useEffect(() => {
        setQuestionValue(questionObj?.question || '')
        setQuestionFiles(questionObj?.files || [])
        setHasDescription(questionObj?.hasDescription || false)
        setHasShuffle(questionObj?.hasShuffle || false)
        setSelectedTabIndex(questionObj?.hasTradition ? 1 : 0)

        if(questionObj?.files && questionObj?.files.length > 0){
            for(let i = 0; i < questionObj?.files.length; i++){
                if(questionObj?.files[i].type == "QUESTION_AUDIO"){
                    setAudioFileValue(questionObj?.files[i])
                }
            }
        }

    }, [questionObj])


    useEffect(() => {
        onQuestionChanged(questionValue, imageValue, audioFileValue, selectedTabIndex)
    }, [questionValue, imageValue, audioFileValue])

    const handleButtonClick = () => {
        const fileInput = document.createElement('input')
        fileInput.type = 'file'
        fileInput.accept = 'audio/mp3,audio/*;capture=microphone'
        fileInput.onchange = handleFileSelect
        fileInput.click()
    }

    const onImageClick = () => {
        const fileInput = document.createElement('input')
        fileInput.type = 'file'
        fileInput.accept = 'image/png, image/jpeg'
        fileInput.onchange = onLoadImage
        fileInput.click()
    }

    const onLoadImage = (e) => {
        e.preventDefault()
        if (e?.target?.files && e?.target?.files.length > 0) {
            setImageValue(e.target.files[0])
            e.currentTarget.value = null
        } else {
            setImageValue(null)
        }
    }

    const getFile = (typeCode = null) => {
        let filePath = null;
        if (questionFiles && questionFiles.length > 0) {
            for (let qf = 0; qf < questionFiles.length; qf++) {
                if (questionFiles[qf].type === typeCode) {
                    filePath = questionFiles[qf].path;
                    break;
                }
            }
        }
        return filePath
    }

    const clearFile = (typeCode = null) => {
        let cloneFiles = []
        let removeFileId = null;
        if (questionFiles && questionFiles.length > 0) {
            for (let qf = 0; qf < questionFiles.length; qf++) {
                if (questionFiles[qf].type === typeCode) {
                    removeFileId = questionFiles[qf].id
                } else {
                    cloneFiles.push(questionFiles[qf])
                }
            }
        }
        if (removeFileId) {
            onFileRemoved(removeFileId)
        }
        setQuestionFiles(cloneFiles)
    }

    const handlerHasDescription = () => {
        setHasDescription(!hasDescription)
        onHandlerHasDescription(!hasDescription)
    }

    const handlerHasShuffle = () => {
        setHasShuffle(!hasShuffle)
        onHandlerHasShuffle(!hasShuffle)
    }

    const onTableChange = (index) => {
        setSelectedTabIndex(index)
        setQuestionValue('')
    }

    const splitTextByTag = (text, tag) => {
        let closingTag = '';
        // clean text from line breaks
        let cleanText = text.replace(/\r?\n|\r/g, '');
        let resultArray = [];
      
        // Add openning bracket if not specified
        if (tag.indexOf('<') === -1) {
          closingTag = '<';
        }
        // Add closing slash if not specified
        if (tag.indexOf('/') === -1) {
          // case when specifying tag without slash i.e. <p>
          if (tag.indexOf('<') !== -1) {
            closingTag =  ['</', tag.slice(1)].join('');
          } else {
            closingTag += '/';
          }
        }
        // Add closing bracket if not specified
        if (tag.indexOf('>') === -1) {
          closingTag += tag + '>';
        }
      
        // Split by closing tag
        let splittedArray = cleanText && cleanText.split(closingTag);
        // Remove empty elements
        splittedArray = splittedArray.filter((text) => text.length)
        // add back tag removed by split
        splittedArray = splittedArray.map((text) => text + closingTag);
        // get first block of text
        resultArray[0] = splittedArray[0]
        // join the rest if any
        if (splittedArray.length > 1) {
          splittedArray.shift()
          resultArray[1] = splittedArray.join('')
        }
      
        return resultArray;
    }

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

            setQuestionValue(updatedValue)
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

            setQuestionValue(updatedValue)
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

            setQuestionValue(updatedValue)
            e.preventDefault();
            e.stopPropagation();
        }

        // if(e.shiftKey && e.which == 71) {
        //     setQuestionValue((textRef?.current.lastHtml).trim() + '\u180E')
        //     e.preventDefault();
        // }
    }

    return (
        <>
            <h2 className="small-title">{t("quiz.quizInfo")}</h2>

            <div className="card-alternate">
                <div className="px-4">
                    <p className="my-2 modal-select-title">{t("quiz.task")}</p>
                    <div className="register-tab-container d-flex mb-3" style={{width: 'fit-content'}}>
                        <span
                            onClick={() => {
                                onTableChange(0)
                            }}
                            className={`tab cursor-pointer ${selectedTabIndex === 0 && "active"}`}
                        >
                            {t('common.cyrillic')}
                        </span>
                        <span
                            onClick={() => {
                                onTableChange(1)
                            }}
                            className={`tab cursor-pointer ${selectedTabIndex === 1 && "active"}`}
                        >
                            {t('common.mongolBichig')}
                        </span>
                    </div>
                    {
                        selectedTabIndex 
                        ?
                            <div>
                                <ResizeProvider>
                                    <ResizeConsumer
                                        className="resize-container mb-1"
                                        // onSizeChanged={handleSizeChanged}
                                        // updateDatasetBySize={getDatasetBySize}
                                    >
                                        <ContentEditable
                                            ref={textRef}
                                            className={'tradition-text'}
                                            html={questionValue}
                                            onChange={(e) => {
                                                setQuestionValue(e?.target?.value)
                                            }}
                                            onKeyDown={(e) => {
                                                onKeyDown(e)
                                            }}
                                            tagName='article'
                                            onPaste={(e) => {
                                                e.preventDefault();
                                                const text = e.clipboardData.getData('text/plain');
                                                const value = questionValue ? `${questionValue}${text}` : text;
                                                setQuestionValue(value)
                                            }}
                                        />
                                    </ResizeConsumer>
                                </ResizeProvider>
                                <div style={{fontSize: 12}}>
                                    <div>Үгийн орхиц "а" үсэг оруулахдаа "shift + a" дараад дахин "a" үсэг дарна</div>
                                    <div>Үгийн адагт ордог "г", "н"  үсэг оруулахдаа "shift + g" дараад орхиц "а" үсэг оруулах бол "а" үсэг дахин дарна</div>
                                    <div>Тоо оруулах бол "shift" + "тоогоо" оруулна уу</div>
                                </div>
                            </div>
                        :
                            <CKEditor
                                // key={Math.random()}
                                editor={ClassicEditor}
                                data={questionValue}
                                config={{
                                    width: '100px',
                                    fontFamily: {
                                        options: [
                                            "default",
                                            "Ubuntu, Arial, sans-serif",
                                            "Ubuntu Mono, Courier New, Courier, monospace",
                                        ],
                                    },
                                    toolbar: {
                                        items: [
                                            'heading',
                                            'MathType',
                                            'ChemType',
                                            'fontSize',
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
                    }
                    {
                        selectedQTypeCode != 'MATCH' &&
                        <div className="d-flex flex-row mt-4">
                            <p className="my-2 mr-2 modal-select-title">{t("quiz.taskImage")}</p>
                            
                            {
                                getFile('QUESTION_IMAGE') !== null
                                    ?
                                    <div className="position-relative ml-4 mt-2">
                                        <img alt="answer" src={getFile('QUESTION_IMAGE')} style={{
                                            width: 150,
                                            objectFit: 'contain'
                                        }} />
                                        <CloseButton className="absolute" onClick={() => {
                                            clearFile('QUESTION_IMAGE')
                                        }} />
                                    </div>
                                    :
                                    <>
                                        {
                                            imageValue
                                                ?
                                                <div className="position-relative ml-4 mt-2">
                                                    <img alt="answer" src={URL.createObjectURL(imageValue)} style={{
                                                        width: 150,
                                                        objectFit: 'contain'
                                                    }} />
                                                    <CloseButton className="absolute" onClick={()=>setImageValue(null)} />
                                                </div>
                                                :
                                                <ButtonOutline text={t("quiz.chooseImage")} onClick={onImageClick} />
                                        }
                                    </>
                            }
                        </div>
                    }
                    <div className="d-flex flex-row mt-4 align-items-center flex-wrap audio-section">
                        <p className="my-2 modal-select-title mr-4">{t("quiz.addAudioFile")}</p>
                        <div style={{ display: 'inline-flex', alignItems: 'center' }}>
                            <input disabled className="modal-input" placeholder={audioFileValue?.name || t("quiz.placeholderFileText")} style={{ marginRight: 5 }} />
                            {
                                audioFileValue && <CloseButton onClick={() => {
                                    clearFile('QUESTION_AUDIO')
                                    setAudioFileValue(null)
                                }} />
                            }
                        </div>

                        {
                            !audioFileValue &&
                            <ButtonOutline className="ml-4" onClick={handleButtonClick} text={t("quiz.chooseFile")} />
                        }
                    </div>
                    {
                        (selectedQTypeCode == 'TEST' || selectedQTypeCode == 'MULTI') &&
                        <div className="d-flex flex-row mt-4 align-items-center flex-wrap audio-section">
                            <div style={{ display: 'inline-flex', alignItems: 'center' }}>
                                <CheckBoxButton
                                    label={t("question.feedback")}
                                    checked={hasDescription || false}
                                    onCheck={() => handlerHasDescription()}
                                />
                            </div>
                        </div>
                    }
                    {
                        selectedQTypeCode == 'MATCH' &&
                        <div className="d-flex flex-row mt-4 align-items-center flex-wrap audio-section">
                            <div style={{ display: 'inline-flex', alignItems: 'center' }}>
                                <CheckBoxButton
                                    label={t("question.hasShuffle")}
                                    checked={hasShuffle || false}
                                    onCheck={() => handlerHasShuffle()}
                                />
                            </div>
                        </div>
                    }
                </div>
            </div>
        </>
    );
};

export default QuestionInfo;
