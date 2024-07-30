import message from 'modules/message'
import { Modal } from 'react-bootstrap'
import { movementOutView } from 'utils/fetchRequest/Urls'
import React, { useEffect, useState } from 'react'
import CloseIcon from '@mui/icons-material/Close'
import secureLocalStorage from 'react-secure-storage'
import { fetchRequest } from 'utils/fetchRequest'
import { useTranslation } from "react-i18next"

const styles = {
    label_style: {
        fontSize : 14,
        color: '#575962',
        fontWeight: 400
    },
    field_style: {
        fontSize : 14,
        color: '#575962',
        fontWeight: 700
    }    
}

const view = ({ onClose, id }) => {
    const { t } = useTranslation();
    const locale = 'mn'
    const [loading, setLoading] = useState(false)

    const [movement, setMovement] = useState({id: 11, className: '5a', code: 2323, firstName: "Harry", lastName: "Meggi"})

    useEffect(() => {
        // setLoading(true)
        // fetchRequest(movementOutView, 'POST', { movement: id })
        //     .then((res) => {
        //         if (res.success) {
        //             const { movement } = res.data
        //             setMovement(movement)
        //         } else {
        //             message(res.data.message)
        //         }
        //         setLoading(false)
        //     })
        //     .catch(() => {
        //         message(t('err.error_occurred'))
        //         setLoading(false)
        //     })
    }, [])

    return (
        <Modal
            centered
            show={true}
            onHide={onClose}
            size='lg'
            dimmer='blurring'
            aria-labelledby="contained-modal-title-vcenter"
        >
            <Modal.Header closeButton style={{padding: '1rem'}}>
                <Modal.Title className="modal-title d-flex flex-row justify-content-between w-100">
                    {t('action.view')}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="content">
                    <div className='row'>
                        <div className="col-4 d-flex justify-content-center align-items-center">
                            <img src={movement?.avatar || '/img/profile/avatar.png'}
                                    alt='profile picture'
                                    className='img-circle'
                                    width={100} height={100}
                                    onError={(e) => {
                                        e.target.onError = null
                                        e.target.src = '/img/profile/avatar.png'
                                    }}
                                />
                            </div>
                        <div className="col-8">
                            <table>
                                <tbody>
                                    <tr>
                                        <td className='text-right pr-3' style={styles.label_style}>{t('className')}:</td>
                                        <td style={styles.field_style}>{movement?.className || '-'}</td>
                                    </tr>
                                    <tr>
                                        <td className='text-right pr-3' style={styles.label_style}>{t('studentCode')}:</td>
                                        <td style={styles.field_style}>{movement?.studentCode || '-'}</td>
                                    </tr>
                                    <tr>
                                        <td className='text-right pr-3' style={styles.label_style}>{t('studentLastName')}:</td>
                                        <td style={styles.field_style}>{movement?.lastName || '-'}</td>
                                    </tr>
                                    <tr>
                                        <td className='text-right pr-3' style={styles.label_style}>{t('studentFirstName')}:</td>
                                        <td style={styles.field_style}>{movement?.firstName || '-'}</td>
                                    </tr>
                                    <tr>
                                        <td className='text-right pr-3' style={styles.label_style}>{t('created_date')}:</td>
                                        <td style={styles.field_style}>{movement?.createdDate || '-'}</td>
                                    </tr>
                                    <tr>
                                        <td className='text-right pr-3' style={styles.label_style}>{t('created_user')}:</td>
                                        <td style={styles.field_style}>{movement?.createdUserName || '-'}</td>
                                    </tr>
                                    <tr>
                                        <td className='text-right pr-3 vertical' style={styles.label_style}>{t('description')}:</td>
                                        <td style={styles.field_style}>{movement?.description || '-'}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer className="text-center">
                <button
                            className="btn m-btn--pill btn-outline-metal text-uppercase"
                            onClick={onClose}
                        >
                            {t('close')}
                </button>
            </Modal.Footer>
            {
                loading &&
                <>
                    <div className="blockUI blockOverlay" />
                    <div className="blockUI blockMsg blockPage">
                        <div className="m-loader m-loader--brand m-loader--lg" />
                    </div>
                </>
            }
            </Modal>
    )
}

export default view