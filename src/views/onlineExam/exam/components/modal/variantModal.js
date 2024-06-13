import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button, Modal } from "react-bootstrap";
import { useBottomScrollListener } from 'react-bottom-scroll-listener';
import Select from "modules/Form/Select";
import showMessage from "modules/message";
import { fetchRequest } from "utils/fetchRequest";
import { examQuestions, examCreateFromOtherVariant } from 'utils/fetchRequest/Urls';
import Question from "../../../questions/question"

export default function QuizAddFromVariant({ 
    show, 
    onClose, 
    selectedSchool,
    examId,
    variantId,
    variants,
    onDoneAction
}) {
    const { t } = useTranslation();
    const [loading, setLoading] = useState()
    
    const [currentPage, setCurrentPage] = useState(1)
    const [variantOptions, setVariantOptions] = useState([])
    const [selectedVariantId, setSelectedVariantId] = useState(null)
    const [questions, setQuestions] = useState([])
    const [totalCount, setTotalCount] = useState(0)

    const uniqueList = (qList = []) => {
        const existingIds = [];
        const newList = [];
        for (let q = 0; q < qList.length; q++) {
            const qObj = qList[q];
            if (existingIds.indexOf(qObj?.id) > -1) {
                // exists in array
            } else {
                existingIds.push(qObj?.id)
                newList.push(qObj)
            }
        }
        return newList
    }

    const init = (params, currentPage) => {
        setLoading(true)
        fetchRequest(examQuestions, 'POST', params)
            .then((res) => {
                if (res.success) {
                    if(params.variant == selectedVariantId){
                        if(questions && questions.length > 0){
                            if(res.questions && res.questions.length > 0){
                                const newList = [...questions, ...res?.questions];
                                setQuestions(uniqueList(newList))
                            }
                        } else {
                            setQuestions(res.questions)
                        }
                    } else {
                        setQuestions(res.questions)
                    }

                    setTotalCount(res?.totalCount || 0)
                    setCurrentPage(currentPage)
                } else {
                    showMessage(res.message)
                }
                setLoading(false)
            })
            .catch(() => {
                showMessage(t('errorMessage.title'));
                setLoading(false)
            })
    }

    const callback = () => {
        if(selectedVariantId && !loading && totalCount > questions.length){
            let params = {
                school: selectedSchool.id,
                exam: examId,
                variant: selectedVariantId,
                page: (parseInt(currentPage) + 1)
            }
    
            init(params, currentPage);
        }
    }

    const scrollRef = useBottomScrollListener(callback, 0, 200, undefined, true);

    useEffect(() => {
        if(variants && variants.length > 0){
            let parentOptions = [];
            variants.map(variant => {
                if(variantId != variant.id){
                    parentOptions.push({
                        value: variant?.id,
                        text: 'Хувилбар ' + variant?.name
                    })
                }
            })

            setVariantOptions(parentOptions)
        }
    }, [variants]);

    const variantDropdownChange = (value) => {
        setQuestions([])
        let params = {
            school: selectedSchool.id,
            exam: examId,
            variant: value,
            page: currentPage
        }

        init(params, currentPage);
        setSelectedVariantId(value)
    }

    const handlerSelectedPasser = (id, value) => {
        let cloneList = [...questions];

        if(cloneList && cloneList.length > 0){
            for(let i = 0; i < cloneList.length; i++){
                if(id == cloneList[i].id){
                    cloneList[i].isChecked = value
                }
            }
        }

        setQuestions(cloneList)
    }

    const saveButtonHandler = () => {
        let ids = [];

        if(questions && questions.length > 0){
            for(let i = 0; i < questions.length; i++){
                if(questions[i].isChecked){
                    ids.push(questions[i].qId)
                }
            }
        }

        let params = {
            school: selectedSchool.id,
            exam: examId,
            variant: variantId,
            fromVariant: selectedVariantId,
            questions: JSON.stringify(ids)
        }

        setLoading(true)
        fetchRequest(examCreateFromOtherVariant, 'POST', params)
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
            scrollable
        >
            <Modal.Header className="p-3">
                <Modal.Title className="modal-title d-flex flex-row justify-content-between w-100">
                    {t("common.import")}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body ref={scrollRef} style={{minHeight: 500}}>
                <div className='row mb-4'>
                    <div className='col-3'/>
                    <div className='col-6'>
                        <div className='d-inline-block'>
                            <span className="mr-2 modal-select-title">{t("common.variant")}*</span>
                        </div>
                        <div className='d-inline-block' style={{width: '70%'}}>
                        <Select
                            className='w-100'
                            isClearable
                            multiple={false}
                            options={variantOptions}
                            value={selectedVariantId}
                            searchable
                            onChange={(value) => variantDropdownChange(value)}
                        />
                        </div>
                    </div>
                    <div className='col-3'/>
                </div>
                <div className="row" >
                    {
                        questions && questions.length > 0 && questions.map((question, index) => {
                            return <Question
                                key={index}
                                question={question}
                                allowSelect
                                alternateBorder
                                showCategory
                                selectedPasser={handlerSelectedPasser}
                                showContextMenu={false}
                                showExtras={false}
                                showState={false}
                            />
                        })
                    }
                </div>
            </Modal.Body>
            <Modal.Footer className="p-3">
                <div className="d-flex flex-row justify-content-center align-items-center w-100">
                    <div className="d-flex align-items-center">
                        <Button className='cancel-button' variant='link' onClick={onClose}>
                            <span style={{ color: '#ff2f1a' }}>{t("common.cancel")}</span>
                        </Button>
                        <Button className='save-button ml-2 text-uppercase' variant='empty' onClick={saveButtonHandler}>
                            <span style={{ color: '#000000' }}>{t("common.select")} </span>
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
