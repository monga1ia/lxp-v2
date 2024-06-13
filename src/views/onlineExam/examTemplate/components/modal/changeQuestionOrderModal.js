import React, {useState, formRef, useEffect} from "react";
import MainModal from "modules/MainModal";
import { Button, Modal } from 'react-bootstrap'
import { useTranslation } from "react-i18next";
import { ArrowDownward, ArrowUpward } from '@mui/icons-material';

export default function changeQuestionOrderModal({
    show, 
    onClose = () => {},
    selectedSchool,
    variantId,
    templateId,
    questions = [],
    onSubmit = () => {},
}) {

    const { t } = useTranslation();
    const [loading, setLoading] = useState(false);
    const [questionList, setQuestionsList] = useState([]);

    useEffect(() => {
        setQuestionsList(questions);
    }, [questions]);

    const moveItemUp = (index) => {
        if (index > 0) {
            const updatedItems = [...questionList];
            [updatedItems[index - 1], updatedItems[index]] = [updatedItems[index], updatedItems[index - 1]];
            setQuestionsList(updatedItems);
        }
    };

    const moveItemDown = (index) => {
        if (index < questionList.length - 1) {
            const updatedItems = [...questionList];
            [updatedItems[index], updatedItems[index + 1]] = [updatedItems[index + 1], updatedItems[index]];
            setQuestionsList(updatedItems);
        }
    };

    const orderContent = (id, isDown = false) => {
        if (id) {
            const index = questionList.findIndex(obj => obj.id == id)

            if (isDown) {
                moveItemDown(index);
            } else {
                moveItemUp(index);
            }
        }
    }

    const onSave = () => {
        const params = {
            school: selectedSchool?.id,
            template: templateId,
            variant: variantId,
            questions: questionList?.map(obj => obj.id)
        }
        onSubmit(params);
    }

    const Question = ({ obj = {}, index = 0 }) => {
        return <div className="d-flex flex-row">
            {
              index == questionList.length - 1
                ?  <div className='d-flex flex-row align-items-center mt-2 mr-1 w-10 ml-2'>
                        {
                            index !== 0
                                ?
                                <Button onClick={() => orderContent(obj.id, 0)} variant='outline-primary' className="btn-icon btn-icon-only ml-2" >
                                    <ArrowUpward />
                                </Button>
                                : null
                        }
                        {
                            index + 1 !== questionList.length
                                ?
                                <Button onClick={() => orderContent(obj.id, 1)} variant='outline-primary' className="btn-icon btn-icon-only ml-2" >
                                    <ArrowDownward />
                                </Button>
                                : null
                        }
                    </div>
                :
                    <div className='d-flex flex-row align-items-center justify-content-end mt-2 mr-3 w-10 ml-0'>
                        {
                            index !== 0
                                ?
                                <Button onClick={() => orderContent(obj.id, 0)} variant='outline-primary' className="btn-icon btn-icon-only ml-2" >
                                    <ArrowUpward />
                                </Button>
                                : null
                        }
                        {
                            index + 1 !== questionList.length
                                ?
                                <Button onClick={() => orderContent(obj.id, 1)} variant='outline-primary' className="btn-icon btn-icon-only ml-2" >
                                    <ArrowDownward />
                                </Button>
                                : null
                        }
                    </div>
            }
                    <div className='d-flex flex-column card-alternate w-100 p-2 mt-2 mr-0'>
                        <div className='d-flex flex-row p-2 w-100' >
                            {
                                obj?.hasTradition
                                ?
                                    <div className='text-semi-large text-dark ml-2 tradition-text' dangerouslySetInnerHTML={{ __html: obj?.content.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&') }} style={{height: 'auto'}}/>
                                :
                                    <div dangerouslySetInnerHTML={{ __html: obj.content.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&') }} />
                            }
                        </div>
                    </div>
                </div>
    }                                                                                                                                                                                                                                                                                            

    return (
        <MainModal title={t("action.order")} show={show} onClose={onClose} onSave={onSave}>
            <Modal.Body className="p-0">
            {
                questionList.length
                    ?
                    questionList.map((obj, index) => {
                        return <Question key={index} obj={obj} index={index} />
                    })
                    : null
            }
            </Modal.Body>
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
        </MainModal>
        
    );
}
