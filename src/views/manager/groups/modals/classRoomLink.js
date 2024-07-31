import { Modal } from 'react-bootstrap'
import React, { useEffect, useState } from 'react'
import secureLocalStorage from 'react-secure-storage'
import message from "modules/message";
import { useSelector } from 'react-redux'
import { isValidURL } from 'utils/utils'

import { CopyToClipboard } from 'react-copy-to-clipboard';
import { useTranslation } from "react-i18next";

const locale = secureLocalStorage?.getItem('selectedLang') || 'mn'

const ClassRoomLink = ({ onClose, onSubmit, groupId, oldLink = null }) => {

    const { t } = useTranslation();
    const { selectedSchool } = useSelector(state => state.schoolData);

    const [link, setLink] = useState('')

    const onHandlerCopyLink = () => {
        message(t('common.success'), true)
    }

    return (
        <Modal
            size='lg'
            dimmer='blurring'
            show={true}
            onHide={onClose}
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton style={{ padding: '1rem' }}>
                <Modal.Title className="modal-title d-flex flex-row justify-content-between w-100">
                    {t('group.classRoomLink')}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className='pt-0'>
                <div className="my-4">
                    <div className="form-group m-form__group row align-items-baseline">
                        <label className="col-4 text-right label-pinnacle-bold">
                            {t('group.classRoomLink')}
                        </label>
                        <div className="col-md-5 col-sm-9">
                            <input type="text"
                                className={"form-control m-input"}
                                value={oldLink || '-'}
                                disabled
                                onChange={() => {

                                }} />
                        </div>
                        <div className='col-md-3 col-sm-3'>
                            {
                                oldLink && oldLink?.length > 0 &&
                                <CopyToClipboard
                                    text={oldLink}
                                >
                                    <button
                                        className="btn btn-outline-info"
                                        onClick={onHandlerCopyLink}
                                    >
                                        {t('copy').toUpperCase()}
                                    </button>
                                </CopyToClipboard>
                            }
                        </div>
                    </div>
                    <div className="form-group m-form__group row align-items-baseline">
                        <label className="col-4 text-right label-pinnacle-bold">
                            {t('common.newLink')}*
                        </label>
                        <div className="col-md-5 col-sm-12">
                            <input type="text"
                                className={"form-control m-input"}
                                value={link}
                                onChange={e => setLink(e?.target?.value)} />
                        </div>
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer className="col-12 text-center">
                <button
                    className="btn btn-link"
                    onClick={onClose}
                >
                    {t('back')}
                </button>
                <button
                    onClick={() => {
                        if (link?.length > 0) {
                            if (isValidURL(link)) {
                                onSubmit({
                                    school: selectedSchool?.id,
                                    group: groupId,
                                    link: link
                                })
                            } else {
                                message(t('err.invalid_url'))
                            }
                        } else {
                            message(t('err.fill_all_fields'))
                        }
                    }}
                    className="btn m-btn--pill btn-success m-btn--wide m-btn--uppercase"
                >
                    {t('save') || null}
                </button>
            </Modal.Footer>
        </Modal >
    )
}

export default ClassRoomLink