import message from 'modules/message'
import { Col, Row } from 'react-bootstrap'
import CloseIcon from '@mui/icons-material/Close'
import { Modal } from 'semantic-ui-react'
import secureLocalStorage from 'react-secure-storage'
import { translations } from 'utils/translations'
import React, { useState, useEffect, useRef } from 'react'
import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded'

const locale = secureLocalStorage?.getItem('selectedLang') || 'mn'

const add = ({ onClose, onSubmit, students }) => {
    const [behaviors, setBehaviors] = useState([])
    const [selectedStudent, setSelectedStudent] = useState({})

    const [hasOverflow, setHasOverflow] = useState(false)

    const stickerContainerRef = useRef();

    const handleSubmit = () => {
        console.log('submit where ?? ')
    }

    return (
        <Modal
            centered
            open={true}
            size='large'
            onClose={onClose}
            className='react-modal overflow-modal'
        >
            <div className='header'>
                {translations(locale)?.exam?.insert_score}
                <button type='button' className='close' aria-label='Close' onClick={onClose} >
                    <CloseIcon />
                </button>
            </div>
            <div className='content'>
                <Row className='mt-4'>
                    <Col md={2} />
                    <Col>
                        <Row>
                            <Col md={5} className='d-flex justify-content-end align-items-center'>
                                <img src={selectedStudent?.avatar || '/images/avatar.png'}
                                    alt={`photo of ${selectedStudent?.firstName}`}
                                    className='img-circle'
                                    width={100} height={100}
                                    onError={(e) => {
                                        e.target.onError = null
                                        e.target.src = '/images/avatar.png'
                                    }}
                                />
                            </Col>
                            <Col>
                                <table>
                                    <tbody>
                                        <tr>
                                            <td className='text-right pr-3' style={{ color: '#868aa8' }}>{translations(locale)?.className}:</td>
                                            <td className='bolder' style={{ color: '#3c3f42' }}>{selectedStudent?.className || '-'}</td>
                                        </tr>
                                        <tr>
                                            <td className='text-right pr-3' style={{ color: '#868aa8' }}>{translations(locale)?.studentCode}:</td>
                                            <td className='bolder' style={{ color: '#3c3f42' }}>{selectedStudent?.studentCode || '-'}</td>
                                        </tr>
                                        <tr>
                                            <td className='text-right pr-3' style={{ color: '#868aa8' }}>{translations(locale)?.studentLastName}:</td>
                                            <td className='bolder' style={{ color: '#3c3f42' }}>{selectedStudent?.lastName || '-'}</td>
                                        </tr>
                                        <tr>
                                            <td className='text-right pr-3' style={{ color: '#868aa8' }}>{translations(locale)?.studentFirstName}:</td>
                                            <td className='bolder' style={{ color: '#3c3f42' }}>{selectedStudent?.firstName || '-'}</td>
                                        </tr>
                                        <tr>
                                            <td className='text-right pr-3' style={{ color: '#868aa8' }}>{translations(locale)?.behavior?.positiveScore}:</td>
                                            <td className='bolder' style={{ color: '#3c3f42' }}>{selectedStudent?.positiveScore || '-'}</td>
                                        </tr>
                                        <tr>
                                            <td className='text-right pr-3' style={{ color: '#868aa8' }}>{translations(locale)?.behavior?.negativeScore}:</td>
                                            <td className='bolder' style={{ color: '#3c3f42' }}>{selectedStudent?.negativeScore || '-'}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </Col>
                        </Row>
                    </Col>
                    <Col md={3} />
                </Row>
                <div className='m-portlet mt-5'>
                    <div className='m-portlet__body'>
                        <button
                            className='btn btn-sm m-btn--pill btn-info m-btn--uppercase d-inline-flex mb-3'
                            onClick={() => console.log('do something ??')}
                        >
                            <AddCircleOutlineRoundedIcon />
                            <span className='ml-2'>{translations(locale)?.action?.register}</span>
                        </button>
                        <table className='table table-bordered react-bootstrap-table'>
                            <thead>
                                <tr>
                                    <th>{translations(locale)?.date}</th>
                                    <th className='no-wrap'>{translations(locale)?.assessment}</th>
                                    <th>{translations(locale)?.studentBook?.point_took}</th>
                                    <th>{translations(locale)?.description}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    behaviors?.map((el, key) => (
                                        <tr key={key}>
                                            <td>{el?.date}</td>
                                            <td>{el?.assessment}</td>
                                            <td
                                                className='text-right'
                                                style={{
                                                    backgroundColor: el?.score > 0
                                                        ? 'rgba(62, 191, 163, 0.5)'
                                                        : 'rgba(244, 81, 107, 0.5)'
                                                }}
                                            >
                                                {el?.score}
                                            </td>
                                            <td>{el?.description}</td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <div className='actions modal-footer'>
                <div className='text-center w-100'>
                    <button
                        className='btn m-btn--pill btn-outline-metal m-btn--wide mr-3'
                        onClick={onClose}
                    >
                        {translations(locale)?.close}
                    </button>
                    <button
                        className='btn m-btn--pill btn-success m-btn--wide'
                        onClick={handleSubmit}
                    >
                        {translations(locale)?.save}
                    </button>
                </div>
            </div>
        </Modal>
    )
}

export default add