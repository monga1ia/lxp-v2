import { React, useState, useRef } from "react";
import { Modal, Button } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import ReactToPrint from "react-to-print";
import { useSelector } from "react-redux";
import message from 'modules/message';
import Question from "../question";

const Print = ({
    onClose = () => { },
    show = false,
    questions = [],
    examData = [],
    charArray = [],
    isCorrect = false,
}) => {
    const { t } = useTranslation();
    const { selectedSchool } = useSelector(state => state?.schoolData);
    const printRef = useRef(null);

    const [loading, setLoading] = useState(false);

    const Header = () => {
        return (
            <div className="print-page-break">
                <div className=" text-center" style={{width: '100%', paddingTop: '90px'}}>
                    { 
                        examData?.schoolLogo && examData?.schoolLogo != null &&
                        <img
                            src={ examData.schoolLogo }
                            style={{width: '50px', height: '50px'}}
                        />
                    }
                </div>
                <div className="text-center" style={{width: '100%', paddingTop: '20px'}}>
                    { examData?.schoolLongName && examData?.schoolLongName != null && examData.schoolLongName }
                </div>
                <div className="text-center" style={{width: '100%'}}>
                    { examData?.schoolAddress && examData?.schoolAddress != null && examData.schoolAddress }
                </div>
                <div className="text-center" style={{width: '100%', paddingTop: '100px'}}>
                    { examData?.gradeName && examData?.gradeName != null && examData.gradeName }
                </div>
                <div className="text-center" style={{width: '100%'}}>
                    { examData?.subjectName && examData?.subjectName != null && examData.subjectName }
                </div>
                <div className="text-center fs-16 font-weight-600" style={{width: '100%', paddingTop: '40px'}}>
                    <b>{ examData?.examName && examData?.examName != null && examData.examName }</b>
                </div>
                <div className="text-right" style={{width: '100%', paddingTop: '30px', paddingRight: '60px'}}>
                    {t('exam.date') + ':'} { examData?.startDate ? examData?.startDate : (examData?.date && examData?.date != null && examData.date) }
                </div>
                <div className="text-right" style={{width: '100%', paddingRight: '60px'}}>
                    {t('exam.examDuration') + ':'} { examData?.duration && examData?.duration != null && examData.duration }
                </div>
                {
                    !isCorrect &&
                    <>
                        <div className="text-left" style={{width: '100%', paddingTop: '80px', paddingLeft: '70px'}}>
                            {t('menu.group') + ':'} ____________________________
                        </div>
                        <div className="text-left" style={{width: '100%', paddingTop: '20px', paddingLeft: '70px'}}>
                            {t('student.code') + ':'} ____________________________
                        </div>
                        <div className="text-left" style={{width: '100%', paddingTop: '20px', paddingLeft: '70px'}}>
                            {t('menu.studentName') + ':'} ____________________________
                        </div>
                    </>
                }
            </div>
        )
    }

    const Footer = () => {
        return (
            <div className="print-page-break" style={{padding: '2.5rem'}}>
                {
                    !isCorrect &&
                    <div className="row">
                        <div className="text-left d-inline" style={{width: '100%'}}>
                            {t('menu.group') + ':'} ________
                        </div>
                        <div className="text-left d-inline" style={{width: '100%', paddingTop: '20pt'}}>
                            {t('student.code') + ':'} ________________
                        </div>
                        <div className="text-left d-inline" style={{width: '100%', paddingTop: '20pt'}}>
                            {t('menu.studentName') + ':'} ________________________
                        </div>
                    </div>
                }
                <div className="d-inline-block">
                    {t('exam.title') + ':'} <b>{ examData?.examName && examData?.examName != null && examData.examName }</b>
                </div>
                <div className="row text-center uppercase pt-8">
                    <b>{t('exam.correctAnswers')}</b>
                </div>
                <div className="pt-5">
                    <div className="">
                        <table>
                            <tbody>
                                { 
                                    questions.length > 0 &&
                                    questions.map((question, index) => {
                                        let answerList = []
                                        if(question.answers && question.answers.length > 0){
                                            question.answers.map((answer, cIndex) => {
                                                answerList.push(
                                                    <div
                                                        key={index + '_' + cIndex}
                                                        className="d-inline-block"
                                                    >
                                                        {
                                                            isCorrect && answer.isCorrect && (question.qTypeCode == 'TEST' || question.qTypeCode == 'MULTI')
                                                            ?
                                                                <div className='d-inline-block mr-1' style={{padding: '1pt 4pt', border: '2px solid #000', borderRadius: '8px', color: 'white', background: 'black'}}>{charArray[cIndex]}</div>
                                                            : 
                                                                <div className='d-inline-block mr-1' style={{padding: '1pt 4pt', border: '2px solid #000', borderRadius: '8px'}}>{charArray[cIndex]}</div>
                                                        }
                                                    </div>
                                                )
                                            })
                                        }

                                        return (
                                            <tr key={'question_' + index}>
                                                <td width={20} className='d-inline-block text-right'>{index + 1 + '.'}</td>
                                                <td className='d-inline-block ml-3'>{answerList}</td>{isCorrect ? <div className="d-inline-block" style={{width: 100}}>{'(' + question.score + ') оноо'}</div> : ''}
                                            </tr>
                                        )
                                    })
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        )
    }

    const pageFooter = `
        body {
            -webkit-print-color-adjust: exact;
        }
    `

    return (
        <Modal
            show={show}
            onHide={onClose}
            size="xl"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header className="p-3">
                <Modal.Title className="modal-title d-flex flex-row justify-content-between w-100" style={{ textTransform: 'none' }}>
                    {t('common.print')}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className="p-6">
                <div ref={printRef}>
                    {/* <title style={{width: 2000}}>12312312312313213131231</title> */}
                    <Header />
                    <div className="print-page-break">
                        {
                            questions && questions.length > 0 &&
                            questions.map((question, index) => {
                                return (
                                    <Question
                                        qIndex={index}
                                        key={index}
                                        question={question}
                                        charArray={charArray}
                                        hasCorrect={isCorrect}
                                    />
                                )
                            })
                        }
                    </div>
                    <Footer />
                </div>
            </Modal.Body>
            <Modal.Footer className="p-3 text-center">
                <div style={{ display: 'flex', flexDirection: 'row', display: 'inline-block' }}>
                    <Button className="cursor-pointer cancel-button pr-4" variant='link' onClick={onClose}>
                        <span style={{ color: '#ff2f1a' }}>{t("common.cancel")}</span>
                    </Button>
                    <ReactToPrint
                        trigger={() => (
                            <Button className="cursor-pointer save-button" variant='empty'>
                                <span style={{ color: '#555555' }}>{t('common.print')}</span>
                            </Button>
                        )}
                        pageStyle= {pageFooter}
                        content={() => printRef.current}
                        documentTitle={examData.schoolLongName + ': ' + examData.examName}
                    />
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
};

export default Print;
