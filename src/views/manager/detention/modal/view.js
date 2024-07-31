import message from 'modules/message'
import {Col, Row} from 'react-bootstrap'
import { Modal } from 'react-bootstrap'
import React, {useState, useEffect} from 'react'
import SearchIcon from '@mui/icons-material/Search'
import secureLocalStorage from 'react-secure-storage'
import {fetchRequest} from 'utils/fetchRequest'
import {translations} from 'utils/translations'
import {NDropdown as Dropdown} from 'widgets/Dropdown'
// import {managerDetentionDetail, managerDetentionStudentSearch, managerDetentionStudentSubmit} from 'utils/fetchRequest/Urls'
import {IconButton} from "@mui/material";
import { useTranslation } from 'react-i18next'

const view = ({detentionId, onClose}) => {

    const { t } = useTranslation()
    const locale = secureLocalStorage?.getItem('selectedLang') || 'mn'
    const [loading, setLoading] = useState(false)
    const [updateView, setUpdateView] = useState(false)

    const [detention, setDetention] = useState(null)

    const loadData = (id) => {
        console.log('loadData')
        // setLoading(true)
        // fetchRequest(managerDetentionDetail, 'POST', {
        //     id
        // })
        //     .then((res) => {
        //         if (res?.success) {
        //             setDetention(res?.data?.detention)
        //         } else {
        //             message(res?.data?.message || translations(locale)?.err?.error_occurred)
        //         }
        //         setLoading(false)
        //     })
        //     .catch(() => {
        //         message(translations(locale)?.err?.error_occurred)
        //         setLoading(false)
        //     })
    }

    useEffect(() => {
        loadData(detentionId)
    }, [detentionId])

    return (
        <Modal
            dimmer='blurring'
            show={true}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            onHide={() => onClose()}
            centered
        >
            <Modal.Header closeButton style={{ padding: '1rem' }}>
                <Modal.Title className="modal-title d-flex flex-row justify-content-between w-100">
                    {t('manager.detention')}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Row>
                    <Col md={4}
                         className='d-flex align-items-center justify-content-center'>
                        <img src={detention?.avatar || '/img/profile/avatar.png'}
                             width={100} height={100}
                             className='img-circle'
                             onError={(e) => {
                                 e.target.onError = null
                                 e.target.src = '/img/profle/avatar.png'
                             }}
                        />
                    </Col>
                    <Col
                        className='d-flex bolder flex-column justify-content-center'>
                        <Row>
                            <Col md={3} className='px-2 py-1 text-md-right'
                                 style={{color: '#868aa8'}}>{translations(locale)?.className}:</Col>
                            <Col
                                className='px-2 py-1'>{detention?.className || '-'}</Col>
                        </Row>
                        <Row>
                            <Col md={3} className='px-2 py-1 text-md-right'
                                 style={{color: '#868aa8'}}>{translations(locale)?.studentCode}:</Col>
                            <Col
                                className='px-2 py-1'>{detention?.studentCode || '-'}</Col>
                        </Row>
                        <Row>
                            <Col md={3} className='px-2 py-1 text-md-right'
                                 style={{color: '#868aa8'}}>{translations(locale)?.studentLastName}:</Col>
                            <Col
                                className='px-2 py-1'>{detention?.lastName || '-'}</Col>
                        </Row>
                        <Row>
                            <Col md={3} className='px-2 py-1 text-md-right'
                                 style={{color: '#868aa8'}}>{translations(locale)?.studentFirstName}:</Col>
                            <Col
                                className='px-2 py-1'>{detention?.firstName || '-'}</Col>
                        </Row>
                        <Row>
                            <Col md={3} className='px-2 py-1 text-md-right'
                                 style={{color: '#868aa8'}}>{translations(locale)?.created_date}:</Col>
                            <Col
                                className='px-2 py-1'>{detention?.createdDate || '-'}</Col>
                        </Row>
                        <Row>
                            <Col md={3} className='px-2 py-1 text-md-right'
                                 style={{color: '#868aa8'}}>{translations(locale)?.created_user}:</Col>
                            <Col
                                className='px-2 py-1'>{detention?.createdUser || '-'}</Col>
                        </Row>
                        <Row>
                            <Col md={3} className='px-2 py-1 text-md-right'
                                 style={{color: '#868aa8'}}>{translations(locale)?.school_settings?.detention_type}:</Col>
                            <Col
                                className='px-2 py-1'>{detention?.typeName || '-'}</Col>
                        </Row>
                        <Row>
                            <Col md={3} className='px-2 py-1 text-md-right'
                                 style={{color: '#868aa8'}}>{translations(locale)?.school_settings?.detention_description}:</Col>
                            <Col
                                className='px-2 py-1'>{detention?.description || '-'}</Col>
                        </Row>
                    </Col>
                </Row>
            </Modal.Body>
            <Modal.Footer className="text-center">
                <button
                    className="btn m-btn--pill btn-outline-metal m-btn m-btn--custom"
                    onClick={onClose}
                >
                    {translations(locale)?.close}
                </button>
            </Modal.Footer>
            {
                loading &&
                <>
                    <div className="blockUI blockOverlay"/>
                    <div className="blockUI blockMsg blockPage">
                        <div className="m-loader m-loader--brand m-loader--lg"/>
                    </div>
                </>
            }
        </Modal>
    )
}

export default view