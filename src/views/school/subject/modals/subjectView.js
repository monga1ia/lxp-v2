import message from 'modules/message'
import { Modal } from 'react-bootstrap'
import React, { useEffect, useState } from 'react'
import CloseIcon from '@mui/icons-material/Close'
import secureLocalStorage from 'react-secure-storage'
import { useTranslation } from "react-i18next";

const SubjectViewModal = ({ onClose, subject = {} }) => {

    const { t } = useTranslation();
    const [loading, setLoading] = useState(false)

    return (
        <Modal
            size='md-img'
            dimmer='blurring'
            show={true}
            onHide={() => onClose()}
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton style={{ padding: '1rem' }}>
                <Modal.Title className="modal-title d-flex flex-row justify-content-between w-100">
                    {subject?.code} - {subject?.name}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="viewTeacherModal">
                    <div className="row form-group justify-content-center">
                        <div className="col-12">
                            <table>
                                <tbody>
                                    <tr>
                                        <td className="text-right pr-3" width={'50%'}>{t('subject.index') || null}:</td>
                                        <th>{subject.code || '-'}</th>
                                    </tr>
                                    <tr>
                                        <td className="text-right pr-3" width={'50%'}>{t('subject.name') || null}:</td>
                                        <th>{subject.name || '-'}</th>
                                    </tr>
                                    <tr>
                                        <td className="text-right pr-3" width={'50%'}>{t('subject.credit') || null}:</td>
                                        <th>{subject.credit || '-'}</th>
                                    </tr>
                                    <tr>
                                        <td className="text-right pr-3" width={'50%'}>{t('subject.subject_type') || null}:</td>
                                        <th>{subject.type || '-'}</th>
                                    </tr>
                                    <tr>
                                        <td className="text-right pr-3" width={'50%'}>{t('subject.grade') || null}:</td>
                                        <th>{subject.grades || '-'}</th>
                                    </tr>
                                    <tr>
                                        <td className="text-right pr-3" width={'50%'} style={{ verticalAlign: 'top' }}> {t('subject.teacher') || null}:</td>
                                        <th>{subject.teachers || '-'}</th>
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
                    onClick={() => onClose()}
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
        </Modal >
    )
}

export default SubjectViewModal