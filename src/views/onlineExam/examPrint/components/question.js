import React, { useEffect, useState } from "react";
import RadioButton from "components/buttons/RadioButton";
import { Button, Card } from "react-bootstrap";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import "modules/DataTable/datatable.scss"
import { t } from "i18next";

const Question = ({
    question: { id, content, answers = [], parentQuestion = null, files = [], qTypeCode = '', connectedAnswers = [], values = [], hasDescription = false, hasTradition = false, isCorrect = false, score = null },
    isCheckParentQuestion = false,
    showWasDescription = false,
    qIndex = null,
    charArray = [],
    hasCorrect = false
}) => {
    useEffect(() => {
        CKEditor.editorUrl = "https://cdn.ckeditor.com/ckeditor5/39.0.2/classic/ckeditor.js";
    }, [])

    const getAnswerConnectStat = (answerId) => {
        let statusCode = null;
        for (let a = 0; a < answers.length; a++) {
            const answerObj = answers[a]
            if (answerObj.id === answerId) {
                if (connectedAnswers && connectedAnswers.length > 0) {
                    for (let c = 0; c < connectedAnswers.length; c++) {
                        const connectedArray = connectedAnswers[c];
                        if (connectedArray && connectedArray.length > 0) {
                            if (connectedArray[0] === answerId) {
                                statusCode = 'UNLINK';
                                break;
                            }
                            if (connectedArray.indexOf(answerId) > -1) {
                                statusCode = 'HIDE_LINK';
                                break;
                            }
                        }
                    }
                }
                break;
            }
        }

        return statusCode
    }

    const renderMatchQuestion = (answer, index) => {
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
                                if(index == vIndex){
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
                                if(index == vIndex){
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
                    </div>
                    <div>
                        {
                            values.map((value, vIndex) => {
                                if(index == vIndex){
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

    const renderLinkAnswer = (index, id, correctId) => {
        if(hasCorrect){
            if(index){
                if(id == correctId){
                    return (
                        <div style={{border: '1px solid #66BCA4', padding: '5px 10px', background: '#66BCA4', borderRadius: '50%', height: 25, width: 25}} className='ml-3'/>
                    )
                } else {
                    return (
                        <div style={{border: '1px solid #f4516b', padding: '5px 10px', background: '#f4516b', borderRadius: '50%', height: 25, width: 25}} className='ml-3'/>
                    )
                }
            } else {
                if(id == correctId){
                    return (
                        <div style={{border: '1px solid #66BCA4', padding: '5px 10px', background: '#66BCA4', borderRadius: '50%', height: 25, width: 25}} className='ml-4'/>
                    )
                } else {
                    return (
                        <div style={{border: '1px solid #f4516b', padding: '5px 10px', background: '#f4516b', borderRadius: '50%', height: 25, width: 25}} className='ml-4'/>
                    )
                }
            }
        } else {
            if(index){
                return (
                    <div style={{border: '2px solid #000', padding: '5px 10px', borderRadius: '50%', height: 25, width: 25}} className='ml-3'/>
                )
            } else {
                return (
                    <div style={{border: '2px solid #000', padding: '5px 10px', borderRadius: '50%', height: 25, width: 25}} className='ml-3'/>
                )
            }
        }
    }

    const CardContent = () => {
        return (
            <div className="d-flex flex-row question-table-style">
                <div className="w-100 row">
                    <div className="question-table-style">
                        {
                            isCheckParentQuestion && parentQuestion && parentQuestion.content &&
                            <div className="card-alternate mb-3">
                                <div className="d-flex flex-row align-content-center align-items-center justify-content-between">
                                    <div style={{ fontFamily: 'PinnacleDemiBold', fontSize: 12 }}>Бүлэг даалгавар:</div>
                                </div>
                                <div
                                    style={{ marginBottom: 0 }}
                                    dangerouslySetInnerHTML={{ __html: parentQuestion.content.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&') }}
                                />
                                {
                                    parentQuestion.files && parentQuestion.files.length > 0 &&
                                    parentQuestion.files.map((file, index) => {
                                        if(file.type == 'image/png' || file.type ==  'image/jpeg'){
                                            return (
                                                <div key={'image_' + index} className="col-12 mt-3">
                                                    <img src={file.path} height={100} width={100}/>
                                                </div>
                                            )
                                        }
                                        
                                        return null
                                    })
                                }
                            </div>
                        }
                        {
                            hasTradition
                            ?
                                <div className="d-flex w-100">
                                    <div className="d-inline-block margin-less-05" style={{marginRight: 5}}>{qIndex + 1 + '.'}</div><div className='text-semi-large text-dark ml-2 tradition-text' dangerouslySetInnerHTML={{ __html: content.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&') }} style={{height: 'auto', width: '85%'}}/> 
                                    {hasCorrect ? <div>{'(' + score + ') оноо' }</div> : ''}
                                </div>
                            :
                                <div className="d-flex w-100">
                                    <div className="d-inline-block" style={{marginRight: 5}}>{qIndex + 1 + '.'}</div>
                                    <div
                                        className="d-inline-block w-100 margin-less-05"
                                        style={{marginBottom: 0}}
                                        dangerouslySetInnerHTML={{ __html: content.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&') }}
                                    />
                                    {hasCorrect ? <div className="d-inline-block" style={{width: 100}}>{'(' + score + ') оноо'}</div> : ''}
                                </div>
                        }
                        {
                            files && files.length > 0 && <>
                                <div className="col-12 text-center">
                                {
                                    files.map((fileObj, fIndex) => {
                                        if (fileObj?.type === 'QUESTION_IMAGE') {
                                            return (
                                                <div key={'file' + fIndex}>
                                                    <img src={fileObj.path} alt="img" style={{maxWidth: '100%', height: 'auto'}}/>
                                                </div>
                                            )
                                        }
                                    })
                                }
                                </div>
                            </>
                        }
                    </div>
                    {answers && answers.length > 0 &&
                        answers.map((answerObj, index) => {
                            if (qTypeCode == 'LINK') {
                                return <div
                                    key={'answer__' + index}
                                    className="d-flex flex-row align-content-center align-items-center position-relative mb-2 mt-4"
                                >
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
                                                        renderLinkAnswer(vIndex, value.id, answerObj.correctValue)
                                                    }
                                                    {/* {
                                                        vIndex
                                                            ?
                                                            <RadioButton className='ml-3' checked={value.id == answerObj.correctValue} />
                                                            :
                                                            <RadioButton className='ml-4' checked={value.id == answerObj.correctValue} />
                                                    } */}
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            } else if (qTypeCode == 'MATCH'){
                                return (
                                    <div key={'match_' + index} className='card-alternate mb-2 render-match-question' style={{padding: '12px 24px', width: '95%', position: 'relative', left: 30}}>
                                        {renderMatchQuestion(answerObj, index)}
                                    </div>
                                )
                            }

                            return (
                                <div
                                    key={'list_' + index}
                                    className="d-flex flex-row align-content-center align-items-center position-relative mb-2"
                                >
                                    <div className="ml-4 mr-3" style={hasDescription ? {marginBottom: 'auto', position: 'relative', top: 2} : {}}>
                                        {
                                            hasCorrect
                                            ?
                                                answerObj.isCorrect
                                                ?
                                                    <div style={{border: '1px solid #66BCA4', padding: '5px 8px', background: '#66BCA4', borderRadius: '50%'}}>{charArray[index] + '.'}</div>
                                                :
                                                    <div style={{border: '1px solid #f4516b', padding: '5px 8px', background: '#f4516b', borderRadius: '50%'}}>{charArray[index] + '.'}</div>
                                            :
                                                <div>{charArray[index] + '.'}</div>
                                        }
                                    </div>
                                    <div className="col-12">
                                        {
                                            (answerObj?.answerType === 'text' || answerObj?.answerType === 'equation')
                                            ?
                                            <div
                                                className="margin-less"
                                                dangerouslySetInnerHTML={{ __html: answerObj.answer }}
                                            />
                                            : answerObj?.answerType === 'mbscript' &&
                                            <div
                                                className="text-semi-large text-dark ml-2 tradition-text tradition-text-student"
                                                dangerouslySetInnerHTML={{ __html: answerObj.answer }}
                                            />
                                        }
                                        {
                                            answerObj?.answerType === 'image' && answerObj?.filePath && <div className="ml-4 text-alternate">
                                                <img
                                                    alt="answer"
                                                    src={answerObj?.filePath}
                                                    style={{
                                                        width: 100,
                                                        objectFit: 'contain'
                                                    }} />
                                            </div>
                                        }
                                        {
                                            hasDescription && hasCorrect &&
                                            <div style={{color: '#868AA8', borderRadius:6, width: '100%', padding: '5px 12px', marginTop: 4}}>
                                                <div dangerouslySetInnerHTML={{ __html: answerObj?.description || ''}}/>
                                            </div>
                                        }
                                    </div>
                                </div>
                            )
                        })}
                </div>
            </div>
        );
    };

    return (
        <Card>
            <Card.Body className="pt-0 pb-2 pl-3 pr-3">
                <CardContent />
            </Card.Body>
        </Card>
    );
};

export const getIcon = (icon) => {
    if (icon === "success") {
        return (
            <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="M7.37851 10.1907L5.14505 12.4242C4.31092 13.2583 3.83124 14.3933 3.84001 15.5861C3.84877 16.7789 4.31796 17.9208 5.19167 18.7675C6.03836 19.6413 7.18048 20.1104 8.3731 20.1192C9.59293 20.1282 10.701 19.6755 11.5352 18.8414L13.7687 16.6079M16.6215 13.8097L18.8549 11.5762C19.6891 10.7421 20.1688 9.60711 20.16 8.4143C20.1512 7.22149 19.682 6.0796 18.8083 5.23287C17.9618 4.38638 16.8199 3.91717 15.6271 3.90841C14.4343 3.89964 13.2992 4.35209 12.465 5.18625L10.2315 7.4197M8.6131 15.3274L15.3135 8.62701"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
        );
    }

    return (
        <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M7.47117 10.283L5.23771 12.5165C4.40358 13.3506 3.9239 14.4856 3.93266 15.6784C3.94143 16.8712 4.41061 18.0131 5.28433 18.8598C6.13101 19.7336 7.27314 20.2027 8.46576 20.2115C9.68559 20.2205 10.7937 19.7678 11.6279 18.9337L13.8613 16.7002M16.7141 13.902L18.9476 11.6685C19.7817 10.8344 20.2614 9.69941 20.2526 8.50659C20.2439 7.31378 19.7747 6.17189 18.901 5.32516C18.0545 4.47868 16.9126 4.00946 15.7197 4.0007C14.5269 3.99193 13.3918 4.44438 12.5576 5.27854L10.3242 7.512M8.70576 15.4197L15.4061 8.7193M5.33632 5.21699L4.23001 4.11069M9.17782 3.26824L9.35881 1.44472M1.72189 9.0813L3.61255 8.89365M18.941 18.5056L20.0473 19.6119M15.0995 20.4544L14.9185 22.2779M22.5554 14.6413L20.6647 14.8289"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
};

export default Question;
