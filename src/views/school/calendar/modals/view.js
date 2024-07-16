import React from 'react'
import { Modal } from 'react-bootstrap'
import secureLocalStorage from 'react-secure-storage'
import { useTranslation } from 'react-i18next'

const view = ({ onClose, onEdit, onDelete, event }) => {

    const { t } = useTranslation()
    const locale = secureLocalStorage?.getItem('selectedLang') || 'mn'

    let endDate = new Date(event?.end)
    endDate.setDate(endDate.getDate() - 1)

    return (
        <Modal
            dimmer='blurring'
            show={true}
            size="md"
            aria-labelledby="contained-modal-title-vcenter"
            onHide={onClose}
            // className='react-modal overflow-modal'
            centered
        >
            <Modal.Header closeButton style={{padding: '1rem'}}>
                <Modal.Title className="modal-title d-flex flex-row justify-content-between w-100">
                    {t('calendar.activity')}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="row form-group justify-content-center">
                    <div className="col-8">
                        <table>
                            <tbody>
                                <tr>
                                    <td className='text-right pr-3 fs-11' style={{ color: '#7a7a86' }}>{t('calendar.activity_name')}:</td>
                                    <td className='fs-11 font-bold' style={{ color: '#7a7a86' }}>{event?.title || '-'}</td>
                                </tr>
                                <tr>
                                    <td className='text-right pr-3 fs-11' style={{ color: '#7a7a86' }}>{t('calendar.start_date')}:</td>
                                    <td className='fs-11 font-bold' style={{ color: '#7a7a86' }}>{new Date(event?.start)?.toLocaleDateString('en-CA') || '-'}</td>
                                </tr>
                                <tr>
                                    <td className='text-right pr-3 fs-11' style={{ color: '#7a7a86' }}>{t('calendar.end_date')}:</td>
                                    <td className='fs-11 font-bold' style={{ color: '#7a7a86' }}>
                                        {
                                            event?.allDay ? endDate?.toLocaleDateString('en-CA') : new Date(event?.end)?.toLocaleDateString('en-CA')
                                        }
                                    </td>
                                </tr>
                                <tr>
                                    <td className='text-right pr-3 fs-11' style={{ color: '#7a7a86' }}>{t('calendar.length')}:</td>
                                    <td className='fs-11 font-bold' style={{ color: '#7a7a86' }}>
                                        {
                                            event?.allDay ?
                                                t('calendar.all_day')
                                                :
                                                `${new Date(event?.start)?.toLocaleTimeString('it-IT')?.slice(0, 5)} - ${new Date(event?.end)?.toLocaleTimeString('it-IT')?.slice(0, 5)}`
                                        }
                                    </td>
                                </tr>
                                <tr>
                                    <td className='text-right pr-3 fs-11' style={{ color: '#7a7a86' }}>{t('description')}:</td>
                                    <td className='fs-11 font-bold' style={{ color: '#7a7a86' }}>{event?.description || '-'}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer className="col-12 text-center">
                <button
                    className="btn m-btn--pill btn-danger mr-3 fs-10"
                    onClick={onDelete}
                >
                    {t('delete')}
                </button>
                <button
                    className="btn m-btn--pill btn-blue fs-10"
                    onClick={onEdit}
                >
                    {t('edit')}
                    </button>
            </Modal.Footer>
        </Modal>
    )
}

export default view