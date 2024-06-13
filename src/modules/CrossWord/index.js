/* eslint-disable no-nested-ternary */
import React, { forwardRef, useState, useRef, useEffect } from "react";
import Crossword, { useIpuz, CrosswordProvider, DirectionClues, CrosswordGrid } from '@jaredreisinger/react-crossword';
import { useTranslation } from "react-i18next";

const CrossWordComponent = ({
    containerClassName = '',
    acrossLabel = null,
    downLabel = null,
    isReset = false,
    isAnswer = false,
    isCorrect = false,
    isDisabled = false,
    isResult = false,
    data = {
        across: {},
        down: {}
    },
    onCellChange = () => {},
    guestData = [],
}) => {
    const { t } = useTranslation()
    const crossRef = useRef();
    const [initLoader, setInitLoader] = useState(false);

    useEffect(() => {
        if(isDisabled){
            crossRef?.current?.fillAllAnswers()
        }
    }, [isDisabled, data]);

    useEffect(() => {
        if(guestData && guestData.length > 0){
            for(let i = 0; i < guestData.length; i++){
                crossRef?.current?.setGuess(guestData[i].row, guestData[i].col, guestData[i].char)
            }
        }
        
        setInitLoader(true)
    }, [guestData]);

    const onHandlerCellChange = (row, col, data) => {
        if(isDisabled){
            crossRef?.current?.fillAllAnswers()
        } else {
            onCellChange(row, col, data, initLoader)
        }
    }

    const onHandlerClueSelected = (row, col, data) => {
        //
    }

    const onAnswerComplete = (crossOrDown, correctValue) => {
        //
    }

    const onAnswerCorrect = (crossOrDown, correctValue) => {
        //
    }

    return (
        <div className="row justify-content-center">
            <div className={'d-flex mb-4 crossword-style ' + containerClassName}>
                <Crossword 
                    ref={crossRef}
                    acrossLabel={acrossLabel ? acrossLabel : ""}
                    downLabel={downLabel ? downLabel : ""}
                    data={data}
                    onCellChange={onHandlerCellChange}
                    onClueSelected={onHandlerClueSelected}
                    onAnswerComplete={onAnswerComplete}
                    onAnswerCorrect={onAnswerCorrect}
                    useStorage={false}
                    theme={{
                        allowNonSquare: true,
                        gridBackground: '#f9f9f9',
                        cellBackground: '#fff',
                        cellBorder: '#000',
                        textColor: '#000',
                        numberColor: '#9f9',
                        focusBackground: '#ff5b1d',
                        highlightBackground: '#ff490033',
                    }}
                />
            </div>
            <div>
                {
                    isReset &&
                    <button className="btn btn-warning mr-3" onClick={() => {
                        crossRef?.current?.reset()
                    }}>{t('crossWord.clear')}</button>
                }
                {
                    isAnswer &&
                    <button className="btn btn-warning mr-3" onClick={() => {
                        crossRef?.current?.fillAllAnswers()
                    }}>{t('crossWord.showCorrectAnswer')}</button>
                }
                {
                    isCorrect &&
                    <button className="btn btn-warning" onClick={() => {
                        crossRef?.current?.isCrosswordCorrect()
                    }}>{t('crossWord.isCorrect')}</button>
                }
            </div>
        </div>
    );
};

export default CrossWordComponent;
