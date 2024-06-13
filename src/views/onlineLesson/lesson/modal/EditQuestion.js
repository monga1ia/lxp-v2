import React from 'react'
import { Modal } from 'react-bootstrap'
import QuestionEdit from '../../../onlineExam/questions/edit/index'

const EditQuestion = ({
    open,
    id,
    qTypes,
    qDifficulties,
    onClose = () => {},
    linkAnswers,
    linkValues
}) => {
    
    return (
        <Modal
            show={open}
            onHide={onClose}
            size="xl"
            fullscreen
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <QuestionEdit
                qId= {id}
                questionTypes= {qTypes}
                questionDifficulties= {qDifficulties}
                onModalClose={onClose}
                qlinkAnswers = {linkAnswers}
                qlinkValues={linkValues}
            />
        </Modal>
    )
}

export default EditQuestion
