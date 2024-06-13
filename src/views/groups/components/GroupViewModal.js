import React from 'react'
import { Modal } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'

const GroupViewModal = ({ onClose, event }) => {
    const { t } = useTranslation();
    
    return (
        <Modal
            centered
            show
            onHide={onClose}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
        >
            <Modal.Header closeButton className='p-3'>
                <Modal.Title>
                    {t('common.view')}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="content d-flex justify-content-center align-items-center">
                    <table>
                        <tbody>
                            <tr>
                                <td className='text-right pr-3' style={{ color: '#868aa8' }}>{t('common.name')}:</td>
                                <td style={{ color: '#575962' }}>{event?.name || '-'}</td>
                            </tr>
                            <tr>
                                <td className='text-right pr-3' style={{ color: '#868aa8' }}>{t('curriculum.name')}:</td>
                                <td style={{ color: '#575962' }}>{event?.curriculumName || '-'}</td>
                            </tr>
                            <tr>
                                <td className='text-right pr-3' style={{ color: '#868aa8' }}>{t('curriculum.grade')}:</td>
                                <td style={{ color: '#575962' }}>{event?.gradeName}</td>
                            </tr>
                            <tr>
                                <td className='text-right pr-3' style={{ color: '#868aa8' }}>{t('menu.curriculumSubject')}:</td>
                                <td style={{ color: '#575962' }}>{event?.subjectName}</td>
                            </tr>
                            <tr>
                                <td className='text-right pr-3' style={{ color: '#868aa8' }}>{t('common.createdUser')}:</td>
                                <td style={{ color: '#575962' }}>{event?.createdUserName || '-'}</td>
                            </tr>
                            <tr>
                                <td className='text-right pr-3' style={{ color: '#868aa8' }}>{t('common.createdDate')}:</td>
                                <td style={{ color: '#575962' }}>{event?.createdDate || '-'}</td>
                            </tr>
                            <tr>
                                <td className='text-right pr-3' style={{ color: '#868aa8' }}>{t('menu.school')}:</td>
                                <td style={{ color: '#575962' }}>{event?.schoolNames || '-'}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </Modal.Body>
            <Modal.Footer className='p-3'>
                <div className="row">
                    <div className="col-12 text-center">
                        <button
                            type="button"
                            onClick={onClose}
                            className="btn btn-link bolder p-0"
                        >
                            {t("common.close")}
                        </button>
                    </div>
                </div>
            </Modal.Footer>
        </Modal>
    )
}

export default GroupViewModal