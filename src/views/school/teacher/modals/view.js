import message from 'modules/message'
import { Modal } from 'react-bootstrap'
import React, { useEffect, useState } from 'react'
import CloseIcon from '@mui/icons-material/Close'
import secureLocalStorage from 'react-secure-storage'
import { translations } from 'utils/translations'

const view = ({ onClose, id }) => {

    const locale = secureLocalStorage?.getItem('selectedLang') || 'mn'
    const [loading, setLoading] = useState(false)
    const [teacher, setTeacher] = useState({})

    return (
        <Modal
            size='lg'
            dimmer='blurring'
            show={true}
            onHide={onClose}
            aria-labelledby="contained-modal-title-vcenter"
            centered
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
                            <img
                                src={teacher?.avatar || '/img/profile/placeholder.jpg'}
                                alt={`photo of ${teacher?.firstName}`}
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
                                        <td>{translations(locale)?.status}:</td>
                                        <th>{teacher?.status || '-'}</th>
                                    </tr>
                                    <tr>
                                        <td>{translations(locale)?.role}:</td>
                                        <th>{teacher?.role || '-'}</th>
                                    </tr>
                                    <tr>
                                        <td>{translations(locale)?.school}:</td>
                                        <th>{teacher?.grade || '-'}</th>
                                    </tr>
                                    <tr>
                                        <td>{translations(locale)?.teacher?.code}:</td>
                                        <th>{teacher?.code || '-'}</th>
                                    </tr>
                                    <tr>
                                        <td>{translations(locale)?.teacher?.new_lastname}:</td>
                                        <th>{teacher?.lastName || '-'}</th>
                                    </tr>
                                    <tr>
                                        <td>{translations(locale)?.teacher?.new_name}:</td>
                                        <th>{teacher?.firstName || '-'}</th>
                                    </tr>
                                    <tr>
                                        <td className="vertical">{translations(locale)?.teacher?.teacher_class}:</td>
                                        <th>
                                            {
                                                teacher.classes?.split(',')?.map((el, key) =>
                                                    <li key={key} className="subjectName">{el || '-'}</li>
                                                )
                                            }
                                        </th>
                                    </tr>
                                    <tr>
                                        <td>{translations(locale)?.teacher?.phone_number}:</td>
                                        <th>{teacher?.contacts || '-'}</th>
                                    </tr>
                                    <tr>
                                        <td className="vertical">{translations(locale)?.teacher?.subjects}:</td>
                                        <th>
                                            {
                                                teacher?.subjects?.split(',')?.map((el, key) =>
                                                    <li key={key} className="subjectName">{el || '-'}</li>
                                                )
                                            }
                                        </th>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer className="col-12 text-center">
                <button
                    className="btn m-btn--pill btn-outline-metal"
                    onClick={onClose}
                >
                    {translations(locale)?.close?.toUpperCase()}
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
        </Modal >
    )
}

export default view