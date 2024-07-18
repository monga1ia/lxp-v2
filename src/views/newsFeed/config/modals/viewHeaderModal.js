import React from 'react'
import { Modal } from 'react-bootstrap'
import { useTranslation } from "react-i18next";
import { translations } from 'utils/translations';

const locale = 'mn'

const ViewHeader = ({ onClose, onSubmit, viewHdrData }) => {
    
    const { t } = useTranslation();

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
                    {t('newsfeed.title')}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body style={{color: '#212529'}}>
                <div className="row form-group">
                    <div className="col-sm-12 col-md-4 d-flex align-items-center justify-content-end">
                        {translations(locale).newsfeedConfig.hdrName}*
                    </div>
                    <div className="col-sm-12 col-md-6">
                        <input type={"text"} className={"form-control"}
                            value={viewHdrData?.name}
                            disabled={true}
                            placeholder={translations(locale).newsfeedConfig.hdrName} />
                    </div>
                </div>
                <div className="row form-group">
                    <div className="col-sm-12 col-md-4 d-flex align-items-center justify-content-end">
                        {translations(locale).newsfeedConfig.parent_hdr}*
                    </div>
                    <div className="col-sm-12 col-md-6">
                        <input type={"text"} className={"form-control"}
                            value={viewHdrData?.parentHdrName || '-'}
                            disabled={true}
                            placeholder={translations(locale).newsfeedConfig.parent_hdr} />
                    </div>
                </div>
                <div className="row form-group">
                    <div className="col-sm-12 col-md-4 d-flex align-items-center justify-content-end">
                        {translations(locale).newsfeedConfig.hdr_roles}*
                    </div>
                    <div className="col-sm-12 col-md-6">
                        <input type={"text"} className={"form-control"}
                            value={viewHdrData?.roleNames?.toString()}
                            disabled={true}
                            placeholder={translations(locale).newsfeedConfig.hdr_roles} />
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer className='text-center'>
                <button
                    className="btn m-btn--pill m-btn--air btn-outline-metal m-btn m-btn--custom"
                    onClick={onClose}
                >
                    {translations(locale).close.toUpperCase()}
                </button>
                <button
                    className="btn m-btn--pill m-btn--air btn-warning m-btn m-btn--custom"
                    style={{ marginLeft: 10 }}
                    onClick={onSubmit}
                >
                    {translations(locale).action.edit.toUpperCase()}
                </button>
            </Modal.Footer>
        </Modal >
    )
}

export default ViewHeader