import message from 'modules/message'
import React, { useState } from 'react'
import { Button, Modal } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router-dom/cjs/react-router-dom'
import { fetchRequest } from 'utils/fetchRequest'

const SubmitModal = ({
    open = false,
    onClose = () => {},
    id = null,
    noAnswerList = []
}) => {
    const history = useHistory()
    const {t} = useTranslation()

    const [loading,setLoading] = useState(false)

    const onSubmitData = () => {
        setLoading(true)
        fetchRequest('api/student/exam/finish','POST', { exam: id })
            .then(res=>{
                if (res.success) {
                    history.replace({
                        pathname: "/lesson/exam-view",
                        state: { id }
                    })
                } else {
                    message(res.message)
                }
            })
            .catch(e=>{
                message(t('errorMessage.title'));
            })
            .finally(()=>{
                setLoading(false)
            })
    }

    const NotAnsweredList = () => {
        return <span style={{color: '#FF2F1A'}}>
            {noAnswerList.map((str,index)=>{
                if(index + 1 < noAnswerList.length) {
                    str += ', '
                }
                return str
            })}
        </span>
    }

    return (
        <Modal
            show={open}
            onHide={onClose}
            size="xl"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Body>
                <div className='d-flex flex-row justify-content-center align-items-center mb-3'>
                    <h1 className='color-primary'> {t('onlineExam.areYouSure')} </h1>
                </div>
                <div className='d-flex flex-row justify-content-start align-items-center mb-3'>
                    <p>{t('onlineExam.endWarning')}</p>
                </div>
                <div className='d-flex flex-row justify-content-start align-items-center'>
                    <p style={{marginBottom: 0}}>{t('common.you')} <span className='color-primary'>{noAnswerList.length}</span> {t('onlineExam.didNotAnswered')}. {t('onlineExam.notAnsweredList')} <NotAnsweredList/></p>
                </div>
            </Modal.Body>
            <Modal.Footer style={{ padding: '1rem 2rem' }}>
                <div className='d-flex flex-row justify-content-center align-items-center'>
                    <Button className="cursor-pointer mr-4" variant='secondary' onClick={onClose} style={{color: '#4F43BF'}}>
                        {t("onlineExam.backToQuiz")}
                    </Button>
                    <Button className="cursor-pointer" variant='primary' onClick={onSubmitData}>
                        {t("onlineExam.endQuiz")}
                    </Button>
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
    )
}

export default SubmitModal
