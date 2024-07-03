import message from 'modules/message'
import { Modal } from 'react-bootstrap'
import React, { useEffect, useState } from 'react'
import CloseIcon from '@mui/icons-material/Close'
import secureLocalStorage from 'react-secure-storage'
import { useTranslation } from "react-i18next";

const SubjectViewModal = ({ onClose, id }) => {

    const { t } = useTranslation();
    const [loading, setLoading] = useState(false)
    const [subjectInfo, setSubjectInfo] = useState({})

    return (
        <Modal
            size='md'
            dimmer='blurring'
            show={true}
            onHide={onClose}
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton style={{padding: '1rem'}}>
                <Modal.Title className="modal-title d-flex flex-row justify-content-between w-100">
                    {subjectInfo?.title || t('action.view')}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="viewTeacherModal">
                    <div className="row form-group justify-content-center">
                        <div className="col-8">
                            <table>
                                <tbody>
                                    <tr>
                                        <td className="text-right pr-3 col">{t('subject.index') || null}:</td>
                                        <th className='col'>{subjectInfo.index || '-'}</th>
                                    </tr>
                                    <tr>
                                        <td className="text-right pr-3 col">{t('subject.name') || null}:</td>
                                        <th className='col'>{subjectInfo.subjectName || '-'}</th>
                                    </tr>
                                    <tr>
                                        <td className="text-right pr-3 col">{t('subject.credit') || null}:</td>
                                        <th className='col'>{subjectInfo.credit || '-'}</th>
                                    </tr>
                                    <tr>
                                        <td className="text-right pr-3 col">{t('subject.subject_type') || null}:</td>
                                        <th className='col'>{subjectInfo.type || '-'}</th>
                                    </tr>
                                    <tr>
                                        <td className="text-right pr-3 col">{t('subject.grade') || null}:</td>
                                        <th className='col'>{subjectInfo.grade || '-'}</th>
                                    </tr>
                                    <tr>
                                        <td className="text-right pr-3 col" style={{ verticalAlign: 'top' }}> {t('subject.teacher') || null}:</td>
                                        <th className='col'>{
                                            subjectInfo.teachers && subjectInfo.teachers.length > 0
                                                ? subjectInfo.teachers.map((teacher, key) => {
                                                    return (
                                                        <div
                                                            key={key}
                                                        // onClick={() => this._teacherNameClick(teacher.teacherId)}
                                                        >
                                                            {`${teacher.firstName} (${teacher.lastName})`}
                                                        </div>
                                                    )
                                                })
                                                : '-'
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