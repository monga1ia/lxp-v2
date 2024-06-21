import message from 'modules/message'
import { Modal } from 'react-bootstrap'
import React, { useEffect, useState } from 'react'
import CloseIcon from '@mui/icons-material/Close'
import secureLocalStorage from 'react-secure-storage'
import { useTranslation } from "react-i18next";

const view = ({ onClose, id }) => {

    const { t } = useTranslation();
    
    const locale = secureLocalStorage?.getItem('selectedLang') || 'mn'
    const [loading, setLoading] = useState(false)
    const [staff, setStaff] = useState({})

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
                    {t('teacher.view')}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="viewTeacherModal">
                    <div className="row form-group">
                        <div className="col-4">
                            <img src={staff?.avatar || '/img/profile/avatar.png'} alt={`photo of ${staff?.firstName}`}
                                onError={(e) => {
                                    e.target.onError = null,
                                        e.target.src = '/img/profile/avatar.png'
                                }}
                            />
                        </div>
                        <div className="col-8">
                            <table>
                                <tbody>
                                    <tr>
                                        <td>{t('status')}:</td>
                                        <th>{staff?.status || '-'}</th>
                                    </tr>
                                    <tr>
                                        <td>{t('role')}:</td>
                                        <th>{staff?.role || '-'}</th>
                                    </tr>
                                    <tr>
                                        <td>{t('staff.code')}:</td>
                                        <th>{staff?.code || '-'}</th>
                                    </tr>
                                    <tr>
                                        <td>{t('teacher.new_lastname')}:</td>
                                        <th>{staff?.lastName || '-'}</th>
                                    </tr>
                                    <tr>
                                        <td>{t('teacher.new_name')}:</td>
                                        <th>{staff?.firstName}</th>
                                    </tr>
                                    <tr>
                                        <td>{t('teacher.phone_number')}:</td>
                                        <th>{staff?.contacts}</th>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer className=" col-12 text-center">
                <button
                    className="btn m-btn--pill btn-outline-metal"
                    onClick={onClose}
                >
                    {t('close').toUpperCase()}
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