import message from 'modules/message'
import { Modal } from 'react-bootstrap'
import React, { useEffect, useState } from 'react'
import CloseIcon from '@mui/icons-material/Close'
import secureLocalStorage from 'react-secure-storage'
import { translations } from 'utils/translations'

const view = ({ onClose, id }) => {

    const locale = secureLocalStorage?.getItem('selectedLang') || 'mn'
    const [loading, setLoading] = useState(false)
    const [staff, setStaff] = useState({})

    return (
        <Modal
            centered
            show={true}
            onHide={onClose}
            size='sm'
            dimmer='blurring'
            aria-labelledby="contained-modal-title-vcenter"
        >
            <Modal.Header closeButton style={{padding: '1rem'}}>
                <Modal.Title className="modal-title d-flex flex-row justify-content-between w-100">
                    {translations(locale)?.teacher?.view}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="viewTeacherModal">
                    <div className="row form-group">
                        <div className="col-4">
                            <img src={staff?.avatar || '/images/avatar.png'} alt={`photo of ${staff?.firstName}`}
                                onError={(e) => {
                                    e.target.onError = null,
                                        e.target.src = '/images/avatar.png'
                                }}
                            />
                        </div>
                        <div className="col-8">
                            <table>
                                <tbody>
                                    <tr>
                                        <td>{translations(locale)?.status}:</td>
                                        <th>{staff?.status || '-'}</th>
                                    </tr>
                                    <tr>
                                        <td>{translations(locale)?.role}:</td>
                                        <th>{staff?.role || '-'}</th>
                                    </tr>
                                    <tr>
                                        <td>{translations(locale)?.staff?.code}:</td>
                                        <th>{staff?.code || '-'}</th>
                                    </tr>
                                    <tr>
                                        <td>{translations(locale)?.teacher?.new_lastname}:</td>
                                        <th>{staff?.lastName || '-'}</th>
                                    </tr>
                                    <tr>
                                        <td>{translations(locale)?.teacher?.new_name}:</td>
                                        <th>{staff?.firstName}</th>
                                    </tr>
                                    <tr>
                                        <td>{translations(locale)?.teacher?.phone_number}:</td>
                                        <th>{staff?.contacts}</th>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer className="text-center">
                <div className="col-12 text-center">
                    <button
                        className="btn m-btn--pill btn-outline-metal"
                        onClick={onClose}
                    >
                        {translations(locale)?.close?.toUpperCase()}
                    </button>
                </div>
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