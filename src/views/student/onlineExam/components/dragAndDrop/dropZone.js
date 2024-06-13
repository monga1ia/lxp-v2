import React, { useState } from "react";
import { Row, Col } from "react-bootstrap";
import { useDrop } from "react-dnd";
import ViewModal from "../../modal/ViewModal";
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { lineHeight } from "@mui/system";

export const Dropzone = ({ questionId, id, listData, onDropSubmit, removeDrop, questionType = 'text', hideRemoveIcon = false, correctValue = null, correctType = '' }) => {
    const [selectedPath, setSelectedPath] = useState(null)
    const [selectedType, setSelectedType] = useState(null)
    const [showModal, setShowModal] = useState(false)

    const [{ canDrop, isOver }, dropRef] = useDrop({
        accept: 'dnd',
        drop: (item) => {
            if(item){
                onDropSubmit(questionId, id, item, listData)
            }
        },
        collect: (monitor) => ({
            isOver: monitor.isOver(),
            canDrop: monitor.canDrop(),
        }),
    });

    const onViewHandler = (image, type) => {
        setSelectedPath(image)
        setSelectedType(type)
        setShowModal(true)
    }

    const render = (type) => {
        if (type == 'text') {
            let text = '';
            if (listData.qValue && listData.qValue.length > 35) {
                text = listData.qValue.substring(0, 35) + ' ...'
            } else if (listData.qValue) {
                text = listData.qValue
            }

            return (
                <>
                    {
                        text &&
                        <div style={{height: 0}}>
                            <VisibilityIcon fontSize='small cursor' style={hideRemoveIcon ? { position: 'relative', bottom: 10, left: 8 } : { position: 'relative', bottom: 10, right: 8 }} onClick={() => onViewHandler(listData.qValue, 'text')} />
                        </div>
                    }
                    <Col
                        ref={dropRef}
                        style={{
                            backgroundColor: text ? "#fff" : "#e3e7ee",
                            padding: "5px 10px",
                            height: 80,
                            width: 80,
                            borderRadius: 5,
                            border: isOver ? "dashed 1px black" : "  ",
                            border: '1px dashed',
                            fontSize: 10
                        }}
                    >
                        <div
                            style={{
                                // width: "100%",
                                // padding: "4px",
                            }}
                        >
                            <div className=''>
                                <div>
                                    <b>{text ? text : ''}</b>
                                </div>
                            </div>
                        </div>
                    </Col>
                    <div style={{ height: 0 }}>
                        {
                            listData.qValue && !hideRemoveIcon &&
                            <HighlightOffIcon className="text-danger cursor" onClick={() => removeDrop(questionId, id)} style={{ position: 'relative', bottom: 90, left: 65 }} />
                        }
                    </div>
                </>
            )
        } else if (type == 'image') {
            return (
                <>
                    {
                        listData.qPath &&
                        <div style={{height: 0}}>
                            <VisibilityIcon fontSize='small cursor' style={hideRemoveIcon ? { position: 'relative', bottom: 10, left: 8 } : { position: 'relative', bottom: 10, right: 8 }} onClick={() => onViewHandler(listData.qPath)} />
                        </div>
                    }
                    <div ref={dropRef} className='mb-2' style={{ backgroundColor: "#e3e7ee", height: 80, width: 80, border: '1px dashed gray', borderRadius: 6 }}>
                        {
                            listData.qPath &&
                            <>
                                <img src={listData.qPath} height={78} width={78} style={{ borderRadius: 6 }} />
                                {/* <RemoveCircleIcon className="text-danger cursor" onClick={() => removeDrop(questionId, id)} style={{position: 'relative', bottom: 80, left: 55}}/> */}
                            </>
                        }
                    </div>
                    <div style={{ height: 0 }}>
                        {
                            listData.qPath && !hideRemoveIcon &&
                            <HighlightOffIcon className="text-danger cursor" onClick={() => removeDrop(questionId, id)} style={{ position: 'relative', bottom: 97, left: 65 }} />
                        }
                    </div>
                </>
            )
        } else if (type == 'equation') {
            let text = '';
            if (listData.qValue && listData.qValue.length > 35) {
                text = listData.qValue.substring(0, 35) + ' ...'
            } else if (listData.qValue) {
                text = listData.qValue
            }

            return (
                <>
                    {
                        text &&
                        <div style={{height: 0}}>
                            <VisibilityIcon fontSize='small cursor' style={hideRemoveIcon ? { position: 'relative', bottom: 10, left: 8 } : { position: 'relative', bottom: 10, right: 8 }} onClick={() => onViewHandler(listData.qValue, 'equation')} />
                        </div>
                    }
                    <Col
                        className='dropzone-text-style'
                        ref={dropRef}
                        style={{
                            backgroundColor: text ? "#fff" : "#e3e7ee",
                            padding: "5px 10px",
                            height: 80,
                            width: 80,
                            borderRadius: 5,
                            border: isOver ? "dashed 1px black" : "  ",
                            border: '1px dashed',
                            fontSize: 10
                        }}
                    >
                        <div
                            style={{
                                width: "100%",
                                padding: "4px",
                            }}
                        >
                            <div className='d-flex justify-content-between'>
                                <div>
                                    {
                                        text
                                            ?
                                            <div className='d-flex' dangerouslySetInnerHTML={{ __html: text }} />
                                            :
                                            ''
                                    }
                                </div>
                            </div>
                        </div>
                    </Col>
                    <div style={{ height: 0 }}>
                        {
                            text && !hideRemoveIcon &&
                            <HighlightOffIcon className="text-danger cursor" onClick={() => removeDrop(questionId, id)} style={{ position: 'relative', bottom: 90, left: 65 }} />
                        }
                    </div>
                </>

            )
        } else if (type == 'mbscript') {
            let text = '';
            if (listData.qValue && listData.qValue.length > 70) {
                text = listData.qValue.substring(0, 70) + ' ...'
            } else if (listData.qValue) {
                text = listData.qValue
            }

            return (
                <>
                    {
                        text &&
                        <div style={{height: 0}}>
                            <VisibilityIcon fontSize='small cursor' style={hideRemoveIcon ? { position: 'relative', bottom: 10, left: 8 } : { position: 'relative', bottom: 10, right: 8 }} onClick={() => onViewHandler(listData.qValue, 'mbscript')} />
                        </div>
                    }
                    <Col
                        className='dropzone-text-style'
                        ref={dropRef}
                        style={{
                            backgroundColor: text ? "#fff" : "#e3e7ee",
                            padding: "5px 10px",
                            height: 75,
                            width: 80,
                            borderRadius: 5,
                            border: isOver ? "dashed 1px black" : "  ",
                            border: '1px dashed',
                        }}
                    >
                        <div
                            style={{
                                width: "100%",
                                padding: "4px",
                            }}
                        >
                            <div className='d-flex justify-content-between'>
                                <div>
                                    {
                                        listData.qValue
                                            ?
                                            <div className='text-semi-large text-dark tradition-text tradition-text-student-dropzone' dangerouslySetInnerHTML={{ __html: text }} style={{ position: 'relative', bottom: 5, right: 10 }} />
                                            :
                                            ''
                                    }
                                </div>
                            </div>
                        </div>
                    </Col>
                    <div style={{ height: 0 }}>
                        {
                            listData.qValue && !hideRemoveIcon &&
                            <HighlightOffIcon className="text-danger cursor" onClick={() => removeDrop(questionId, id)} style={{ position: 'relative', bottom: 85, left: 65 }} />
                        }
                    </div>
                </>
            )
        }
    }

    const renderCorrectValue = (type) => {
        if (type == 'text') {
            let text = '';
            if (correctValue.value && correctValue.value.length > 35) {
                text = correctValue.value.substring(0, 35) + ' ...'
            } else if (correctValue.value) {
                text = correctValue.value
            }

            return (
                <>
                    {
                        text &&
                        <div style={{height: 0}}>
                            <VisibilityIcon fontSize='small cursor' style={{ position: 'relative', bottom: 10, left: 8 }} onClick={() => onViewHandler(correctValue.value, 'text')} />
                        </div>
                    }
                    <Col
                        ref={dropRef}
                        style={{
                            backgroundColor: text ? "#fff" : "#e3e7ee",
                            padding: "5px 10px",
                            height: 80,
                            width: 80,
                            borderRadius: 5,
                            border: isOver ? "dashed 1px black" : "  ",
                            border: '1px dashed',
                            fontSize: 10
                        }}
                    >
                        <div
                            style={{
                                // width: "100%",
                                // padding: "4px",
                            }}
                        >
                            <div className=''>
                                <div>
                                    <b>{text ? text : ''}</b>
                                </div>
                            </div>
                        </div>
                    </Col>
                    <div style={{ height: 0 }}>
                        {
                            correctValue.value && !hideRemoveIcon &&
                            <HighlightOffIcon className="text-danger cursor" onClick={() => removeDrop(questionId, id)} style={{ position: 'relative', bottom: 90, left: 65 }} />
                        }
                    </div>
                </>
            )
        } else if (type == 'image') {
            return (
                <>
                    {
                        correctValue.filePath &&
                        <div style={{height: 0}}>
                            <VisibilityIcon fontSize='small cursor' style={{ position: 'relative', bottom: 10, left: 8 }} onClick={() => onViewHandler(correctValue.filePath)} />
                        </div>
                    }
                    <div ref={dropRef} className='mb-2' style={{ backgroundColor: "#e3e7ee", height: 80, width: 80, border: '1px dashed gray', borderRadius: 6 }}>
                        {
                            correctValue.filePath &&
                            <>
                                <img src={correctValue.filePath} height={78} width={78} style={{ borderRadius: 6 }} />
                                {/* <RemoveCircleIcon className="text-danger cursor" onClick={() => removeDrop(questionId, id)} style={{position: 'relative', bottom: 80, left: 55}}/> */}
                            </>
                        }
                    </div>
                    <div style={{ height: 0 }}>
                        {
                            correctValue.filePath && !hideRemoveIcon &&
                            <HighlightOffIcon className="text-danger cursor" onClick={() => removeDrop(questionId, id)} style={{ position: 'relative', bottom: 97, left: 65 }} />
                        }
                    </div>
                </>
            )
        } else if (type == 'equation') {
            let text = '';
            if (correctValue.value && correctValue.value.length > 35) {
                text = correctValue.value.substring(0, 35) + ' ...'
            } else if (correctValue.value) {
                text = correctValue.value
            }

            return (
                <>
                    {
                        text &&
                        <div style={{height: 0}}>
                            <VisibilityIcon fontSize='small cursor' style={{ position: 'relative', bottom: 10, left: 8 }} onClick={() => onViewHandler(correctValue.value, 'equation')} />
                        </div>
                    }
                    <Col
                        className='dropzone-text-style'
                        ref={dropRef}
                        style={{
                            backgroundColor: text ? "#fff" : "#e3e7ee",
                            padding: "5px 10px",
                            height: 80,
                            width: 80,
                            borderRadius: 5,
                            border: isOver ? "dashed 1px black" : "  ",
                            border: '1px dashed',
                            fontSize: 10
                        }}
                    >
                        <div
                            style={{
                                width: "100%",
                                padding: "4px",
                            }}
                        >
                            <div className='d-flex justify-content-between'>
                                <div>
                                    {
                                        text
                                            ?
                                            <div className='d-flex' dangerouslySetInnerHTML={{ __html: text }} />
                                            :
                                            ''
                                    }
                                </div>
                            </div>
                        </div>
                    </Col>
                    <div style={{ height: 0 }}>
                        {
                            text && !hideRemoveIcon &&
                            <HighlightOffIcon className="text-danger cursor" onClick={() => removeDrop(questionId, id)} style={{ position: 'relative', bottom: 90, left: 65 }} />
                        }
                    </div>
                </>

            )
        } else if (type == 'mbscript') {
            let text = '';
            if (correctValue.value && correctValue.value.length > 70) {
                text = correctValue.value.substring(0, 70) + ' ...'
            } else if (correctValue.value) {
                text = correctValue.value
            }

            return (
                <>
                    {
                        text &&
                        <div style={{height: 0}}>
                            <VisibilityIcon fontSize='small cursor' style={{ position: 'relative', bottom: 10, left: 8 }} onClick={() => onViewHandler(correctValue.value, 'mbscript')} />
                        </div>
                    }
                    <Col
                        className='dropzone-text-style'
                        ref={dropRef}
                        style={{
                            backgroundColor: text ? "#fff" : "#e3e7ee",
                            padding: "5px 10px",
                            height: 75,
                            width: 80,
                            borderRadius: 5,
                            border: isOver ? "dashed 1px black" : "  ",
                            border: '1px dashed',
                            fontSize: 10
                        }}
                    >
                        <div
                            style={{
                                width: "100%",
                                padding: "4px",
                            }}
                        >
                            <div className='d-flex justify-content-between'>
                                <div>
                                    {
                                        correctValue.value
                                            ?
                                            <div className='text-semi-large text-dark tradition-text tradition-text-student-dropzone' dangerouslySetInnerHTML={{ __html: text }} style={{ position: 'relative', bottom: 5, right: 10 }} />
                                            :
                                            ''
                                    }
                                </div>
                            </div>
                        </div>
                    </Col>
                    <div style={{ height: 0 }}>
                        {
                            correctValue.value && !hideRemoveIcon &&
                            <HighlightOffIcon className="text-danger cursor" onClick={() => removeDrop(questionId, id)} style={{ position: 'relative', bottom: 85, left: 65 }} />
                        }
                    </div>
                </>
            )
        }
    }

    return (
        <div className={hideRemoveIcon ? "d-flex mb-2" : "mb-2"}>
            {render(questionType)}
            {
                correctValue &&
                renderCorrectValue(correctType)
            }
            {
                showModal &&
                <ViewModal
                    show={showModal}
                    onClose={() => {
                        setShowModal(false)
                    }}
                    path={selectedPath}
                    type={selectedType}
                />
            }
        </div>
    );
}