import React, { useState, useEffect } from "react";
import HtmlHead from "components/html-head/HtmlHead";
import { useTranslation } from "react-i18next";
import RadioButton from "components/buttons/RadioButton";
import CloseButton from "components/buttons/CloseButton";
import RefreshButton from "components/buttons/RefreshButton";
import QuestionConnectModal from "./openAnswerModal";

const resetButtonStyle = {
    position: 'relative',
    top: 35,
    right: 30
}

const QuestionAddOpen = ({
    propIsCourse = false,
    isEdit = false,
    questionAnswers = [],
    connectedIds = [],
    openAnswers = [],
    linkAnswers = [],
    linkValues = [],
    onChangeValues,
    onChangeAnswerValue,
    onResetConnection,
    onRemoveButton,
    onResetButtonAction
}) => {
    const { t } = useTranslation();
    const title = t("quiz.quizRegister");
    const description = "";

    const [showConnectModal, setShowConnectModal] = useState(false);
    const [answers, setAnswers] = useState([])
    const [connectedAnswers, setConnectedAnswers] = useState([])
    const [selectedAnswer, setSelectedAnswer] = useState(null)

    useEffect(() => {
        if(isEdit && questionAnswers){
            const list = [];
            if(questionAnswers && questionAnswers.length > 0 && questionAnswers[0].answerType){
                for (let a = 0; a < questionAnswers.length; a++) {
                    const answerValues = []
                    if (linkValues && linkValues?.length > 0) {
                        for (let v = 0; v < linkValues?.length; v++) {
                            answerValues.push({
                                name: linkValues[v]?.name,
                                checked: false,
                                value: linkValues[v]?.id
                            })
                        }
                    }
                    list.push({
                        id: linkAnswers[a]?.id,
                        name: linkAnswers[a]?.name,
                        ordering: linkAnswers[a]?.ordering,
                        score: 0,
                        isConnect: false,
                        data: answerValues
                    })
                }
                setAnswers(list)
            }
            else{
                setAnswers(questionAnswers)
            }
        }
        else{
            setAnswers(openAnswers)
        }
        // connected answers check
        if (isEdit && questionAnswers) {
            setConnectedAnswers(connectedIds)
        }
    }, [questionAnswers, openAnswers, linkAnswers, linkValues])

    const onPressConnect = (answer) => {
        setSelectedAnswer(answer)
        setShowConnectModal(true)
    }

    const onPressUnlink = (answer) => {
        const connectedList = [...connectedAnswers]
        if (connectedList && connectedList.length > 0) {
            let removeIndex = -1;
            for (let ca = 0; ca < connectedList.length; ca++) {
                const connectedArray = connectedList[ca];
                if (connectedArray && connectedArray.length > 0) {
                    if (connectedArray[0] === answer?.id) {
                        removeIndex = ca;
                        break;
                    }
                }
            }
            if (removeIndex > -1) {
                connectedList.splice(removeIndex, 1)
            }

            setConnectedAnswers(connectedList)
            onResetConnection(answer, connectedList)
        }
    }

    const onRemoveButtonAction = (index) => {
        onRemoveButton(answers, index)
    }

    const modalSubmit = (selectedAnswerId, ids, score) => {
        const connectedArrayList = [...connectedAnswers]

        const toUpdateArray = []
        let oldSelection = false;
        for (let ca = 0; ca < connectedArrayList.length; ca++) {
            let connectedArray = connectedArrayList[ca]
            if (connectedArray && connectedArray.length > 0) {
                if (connectedArray[0] === selectedAnswerId) {
                    oldSelection = true;
                    connectedArray = connectedArray.concat(ids)
                    connectedArray = [...new Set(connectedArray)]

                    toUpdateArray.push(connectedArray)
                }
            }
        }

        let allConnectedArray = []
        if (!oldSelection) {
            let newArray = [selectedAnswerId]
            newArray = newArray.concat(ids)
            connectedArrayList.push([...new Set(newArray)])

            allConnectedArray = connectedArrayList
            setConnectedAnswers(connectedArrayList)
        } else {
            allConnectedArray = toUpdateArray
            setConnectedAnswers(toUpdateArray)
        }

        onChangeValues(selectedAnswerId, allConnectedArray, score)
    }

    const onCheckedChange = (answerList, rowIndex, answerIndex) => {
        const cloneAnswers = [...answerList]
        for (let a = 0; a < cloneAnswers.length; a++) {
            if (a === rowIndex) {
                const rowValues = cloneAnswers[a]?.data;
                for (let v = 0; v < rowValues.length; v++) {
                    rowValues[v].checked = (v === answerIndex)
                }
                break;
            }
        }

        setAnswers(cloneAnswers)
        onChangeAnswerValue(answerList, connectedAnswers)
    }

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

    const onScoreChange = (index, value) => {
        const cloneAnswers = [...answers]
        if (value && value.length > 0) {
            let input = value
            if (input.match(/^([0-9]{1,})?(\.)?([0-9]{1,})?$/)) {
                for (let a = 0; a < cloneAnswers.length; a++) {
                    if (a === index) {
                        cloneAnswers[a].score = value
                        break;
                    }
                }
            }
        } else {
            for (let a = 0; a < cloneAnswers.length; a++) {
                if (a === index) {
                    cloneAnswers[a].score = ''
                    break;
                }
            }
        }

        setAnswers(cloneAnswers)
        onChangeAnswerValue(cloneAnswers, connectedAnswers)
    }

    const onHandlerResetButton = (index) => {
        let cloneAnswers = [...answers]

        if(cloneAnswers && cloneAnswers.length > 0){
            for(let i = 0; i < cloneAnswers.length; i++){
                cloneAnswers[i].score = 0
                if(cloneAnswers[i].data && cloneAnswers[i].data.length > 0){
                    let listData = cloneAnswers[i].data;
                    for(let d = 0; d < listData.length; d++){
                        listData[d].checked = false
                    }
                }
            }
        }

        setAnswers(cloneAnswers)

        onResetButtonAction(index)
    }

    const render = (answerList) => {
        let answerRow = [];

        answerList && answerList.length > 0 &&
            answerList.map((answer, i) => {
                let answerRowRadio = []

                if (answer.data && answer.data.length > 0) {
                    answer.data.map((row, ri) => {
                        return answerRowRadio.push(
                            <div
                                key={'td_' + i + '_' + ri}
                                className="d-flex flex-row align-items-center"
                            >
                                {
                                    i == 0
                                        ?
                                        <div className="d-block" style={{ position: 'relative', left: 29, bottom: 25 }}>{row.name}</div>
                                        :
                                        <div className="d-block" style={{ position: 'relative', left: 29, bottom: 25, color: '#FFF', zIndex: -1 }}>{row.name}</div>
                                }
                                {
                                    ri == 0
                                        ?
                                        <div>
                                            <RadioButton
                                                checked={row.checked}
                                                onCheck={() => {
                                                    onCheckedChange(answerList, i, ri)
                                                }}
                                                className="ml-3"
                                            />
                                        </div>
                                        :
                                        <div>
                                            <RadioButton
                                                checked={row.checked}
                                                onCheck={() => {
                                                    onCheckedChange(answerList, i, ri)
                                                }}
                                                className="ml-4"
                                            />
                                        </div>
                                }
                            </div>
                        )
                    })
                }

                const answerStatusCode = getAnswerConnectStat(answer?.id)
                return answerRow.push(
                    <div
                        key={'td_main' + i}
                        className="d-flex flex-row align-items-center mb-2"
                    >
                        {
                            answerStatusCode === 'UNLINK'
                                ? <>
                                    <input
                                        disabled
                                        className="modal-input point"
                                        placeholder="Оноо"
                                        value={answer.score || ''}
                                    />
                                    <div
                                        onClick={() => onPressUnlink(answer)}
                                        className="open-tag ml-4 cursor-pointer"
                                    >
                                        {getIcon('')}
                                    </div>
                                </>
                                :
                                <>
                                    {
                                        answerStatusCode === 'HIDE_LINK'
                                            ? <div className="d-flex flex-row align-items-center" style={{ visibility: 'hidden' }}>
                                                <input
                                                    disabled
                                                    className="modal-input point"
                                                    placeholder="Оноо"
                                                    value=''
                                                />
                                                <div
                                                    className="open-tag ml-4 success"
                                                >
                                                    {getIcon('')}
                                                </div>
                                            </div>
                                            : <>
                                                <input
                                                    className="modal-input point"
                                                    placeholder="Оноо"
                                                    type='text'
                                                    onChange={(e) => onScoreChange(i, e.target.value)}
                                                    value={answer.score || ''}
                                                />
                                                <div
                                                    onClick={() => onPressConnect(answer)}
                                                    className="open-tag ml-4 success cursor-pointer"
                                                >
                                                    {getIcon('success')}
                                                </div>
                                            </>
                                    }
                                </>
                        }
                        <div className="ml-3" style={{ width: 20 }}>{answer.name}</div>
                        {answerRowRadio}
                        {
                            i === (answers?.length - 1) &&
                            <div className="ml-2">
                                <CloseButton className="margin-0" onClick={() => onRemoveButtonAction(i)} />
                                <RefreshButton styleObj={resetButtonStyle} className="margin-0" onClick={() => onHandlerResetButton(i)} />
                            </div>
                        }
                    </div>
                )
            })

        return answerRow
    }

    return (
        <>
            <HtmlHead title={title} description={description} />

            <div className="screen-padding">
                {
                    render(answers)
                }
                {
                    selectedAnswer && showConnectModal && <QuestionConnectModal
                        propIsCourse={propIsCourse}
                        show={showConnectModal}
                        onClose={() => setShowConnectModal(false)}
                        onSave={modalSubmit}
                        connectedAnswers={connectedAnswers}
                        selectedAnswer={selectedAnswer}
                        answers={answers}
                    />
                }
            </div>
        </>
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

export default QuestionAddOpen;