import React from 'react'
import { Modal } from 'react-bootstrap'
import { useTranslation } from "react-i18next";
import { translations } from 'utils/translations';

const locale = 'mn'

const CreateHeader = ({ onClose, onSubmit, viewHdrData, isAdminOrSuper }) => {
    
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
                    <div className="col-sm-12 col-md-4 text-right">
                        {translations(locale).newsfeedConfig.hdrName}*
                    </div>
                    <div className="col-sm-12 col-md-6">
                        <input type={"text"} className={"form-control"}
                            value={newHdrName}
                            placeholder={translations(locale).newsfeedConfig.hdrName}
                            onChange={_onNewNfNameChange} />
                    </div>
                </div>
                {
                    isAdminOrSuper
                        ?
                        <div className="row form-group">
                            <div className="col-sm-12 col-md-4 text-right">
                                {translations(locale).newsfeedConfig.parent_hdr_type}*
                            </div>
                            <div className="col-sm-12 col-md-6">
                                <Dropdown
                                    placeholder={translations(locale).newsfeedConfig.parent_hdr_type}
                                    fluid
                                    search
                                    selection
                                    value={newSelectedHeaderType}
                                    options={headerTypes}
                                    onChange={_onHdrTypeChange}
                                    closeOnChange
                                />
                            </div>
                        </div>
                        : null
                }
                <div className="row form-group">
                    <div className="col-sm-12 col-md-4 text-right">
                        {translations(locale).newsfeedConfig.parent_hdr}*
                    </div>
                    <div className="col-sm-12 col-md-6">
                        <Dropdown
                            placeholder={translations(locale).newsfeedConfig.parent_hdr}
                            fluid
                            search
                            selection
                            value={newHdrSelectedParent}
                            options={allHeaders}
                            onChange={_onParentHdrChange}
                            closeOnChange
                        />
                    </div>
                </div>
                <div className="row form-group">
                    <div className="col-sm-12 col-md-4 text-right">
                        {translations(locale).newsfeedConfig.hdr_roles}*
                    </div>
                    <div className="col-sm-12 col-md-6">
                        <Dropdown
                            placeholder={translations(locale).newsfeedConfig.hdr_roles}
                            fluid
                            search
                            selection
                            multiple
                            value={selectedSchoolRoles}
                            onChange={_onNewHdrRoleChange}
                            options={schoolRoles}
                        />
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
                    {translations(locale).save.toUpperCase()}
                </button>
            </Modal.Footer>
        </Modal >
    )
}

export default CreateHeader