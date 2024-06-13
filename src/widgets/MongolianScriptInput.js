import React, { useEffect, useReducer, useRef } from 'react';
import { ResizeConsumer, ResizeProvider } from "react-resize-context";
import ContentEditable from "react-contenteditable";

const MongolianScriptInput = ({
                                  onChange,
                                  value = '',
                                  onBlur
                              }) => {

    const text = useRef('');
    const [, forceUpdate ] = useReducer(x => x + 1, 0);

    useEffect(() => {
        text.current = value;
        forceUpdate();
    }, [ value ]);


    const handleCEChange = evt => {
        text.current = evt.target.value;
        onChange?.(text.current, evt);
    }

    const handleBlur = e => {
        onBlur?.(text.current, e);
    }

    const onCEPaste = e => {
        e.preventDefault();
        const clipboardText = e.clipboardData.getData('text/plain');
        let fullText = clipboardText;
        if (text?.current) {
            fullText = `${text.current}${clipboardText}`;
        }
        text.current = fullText;
        onChange?.(text.current, e);
        forceUpdate();
    }

    const onBoldClick = () => {
        document.execCommand('bold');
    }

    return (
        <div style={{ display: 'flex' }}>
            <ResizeProvider>
                <ResizeConsumer className="resize-container">
                    <ContentEditable
                        className='mongolian-script-input'
                        html={text.current}
                        onChange={handleCEChange}
                        onBlur={handleBlur}
                        onPaste={onCEPaste}
                    />
                </ResizeConsumer>
            </ResizeProvider>
            <input
                type='button'
                className='btn button-bold-mscript ml-1'
                onClick={onBoldClick}
                value='B'
            />
        </div>
    )
}

export default MongolianScriptInput;