import message from 'modules/message'
import {Col, Row} from 'react-bootstrap'
import {Tab} from 'semantic-ui-react'
import { Modal } from 'react-bootstrap'
import React, {useState, useEffect} from 'react'
import CloseIcon from '@mui/icons-material/Close'
import SearchIcon from '@mui/icons-material/Search'
import secureLocalStorage from 'react-secure-storage'
import {fetchRequest} from 'utils/fetchRequest'
import {translations} from 'utils/translations'
import {NDropdown as Dropdown} from 'widgets/Dropdown'
import { useTranslation } from 'react-i18next'

const edit = ({detention = {}, types = [], onClose, onSubmit}) => {

    const locale = secureLocalStorage?.getItem('selectedLang') || 'mn'
    const { t } = useTranslation()
    const [loading, setLoading] = useState(false)

    const [selectedType, setSelectedType] = useState(null)
    const [description, setDescription] = useState('')

    const [updateView, setUpdateView] = useState(false)

    useEffect(() => {
        setSelectedType({id: detention?.typeId, description: detention?.typeDescription})
        setDescription(detention?.description)
    }, [detention])

    const onTypeChange = (typeId) => {
        const type = types.find(obj => obj?.id === typeId)
        setSelectedType(type)
    }

    return (
        <Modal
            dimmer='blurring'
            show={true}
            size="xl"
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
                         className='d-flex align-items-center' style={{justifyContent: 'end'}}>
                        <img src={detention?.avatar || '/img/profile/avatar.png'}
                             width={100} height={100}
                             className='img-circle'
                             onError={(e) => {
                                 e.target.onError = null
                                 e.target.src = '/img/profile/avatar.png'
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
                                className='px-2 py-1'>{detention?.code || '-'}</Col>
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
                    </Col>
                </Row>

                <Row className='form-group mt-4'>
                    <Col md={5} className='col-form-label text-md-right label-pinnacle-bold'>
                        {translations(locale)?.school_settings?.detention_type}*
                    </Col>
                    <Col md={4} style={{padding: 0}}>
                        <Row>
                            <Col md={12}>
                                <Dropdown
                                    fluid
                                    search
                                    selection
                                    closeOnChange
                                    options={types.map(typeObj => {
                                        return {
                                            value: typeObj?.id,
                                            text: typeObj?.title
                                        }
                                    })}
                                    value={selectedType?.id}
                                    placeholder={'-' + translations(locale)?.select + '-'}
                                    onChange={(e, data) => onTypeChange(data?.value)}
                                />
                            </Col>
                        </Row>
                        {
                            selectedType && selectedType?.description &&
                            <p className={'mt-2 mb-0'}>{selectedType?.description}</p>
                        }
                    </Col>
                </Row>
                <Row className='form-group'>
                    <Col md={5} className='col-form-label text-md-right label-pinnacle-bold'>
                        {translations(locale)?.school_settings?.detention_description}
                    </Col>
                    <Col md={4} style={{padding: 0}}>
                        <textarea
                            placeholder={translations(locale).insert_description || ''}
                            className="form-control"
                            value={description}
                            onChange={(e) => setDescription(e?.target?.value)}
                            style={{
                                minHeight: 100
                            }}
                        />
                    </Col>
                </Row>
            </Modal.Body>
            <Modal.Footer className="text-center">
                <button
                    className="btn m-btn--pill btn-link m-btn m-btn--custom"
                    onClick={onClose}
                >
                    {translations(locale)?.back}
                </button>
                <button
                    className="btn m-btn--pill btn-success m-btn--wide"
                    onClick={() => {
                        onSubmit({
                            id: detention?.id,
                            type: selectedType?.id,
                            description: description
                        })
                    }}
                >
                    {translations(locale)?.save}
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

export default edit