import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import { translations } from "utils/translations";
import { capitalize, linkify } from "utils/Util";
import { useTranslation } from "react-i18next";

const locale = 'mn'

const DeleteModal = ({ size, onClose, onSubmit, children, data, loginPhone, errorDeleteDescription, errorDeletePhoneNumber }) => {

    const { t } = useTranslation()
    const [seeMore, setSeeMore] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState(loginPhone);
    const [description, setDescription] = useState('');

    const onSeeMore = () => {
        setSeeMore(!seeMore);
    }
    
    const _inputChangedPhoneNumber = (event) => {
        setPhoneNumber(event.target.value)
    }

    const _textAreaChangeDescription = (event) => {
        setDescription(event.target.value)
    }

    const renderTitle = title => {
        if (title && title.length > 100) {
            if (!seeMore) {
                return (
                    <div>
                        <div dangerouslySetInnerHTML={{ __html: linkify(title.substring(0, 250), '#5867dd') }} />
                        <button
                            className='nf-item-see-more'
                            onClick={onSeeMore}
                        >
                            {translations(locale).newsfeed.see_more}
                        </button>
                    </div>
                )
            } else {
                return (
                    <div dangerouslySetInnerHTML={{ __html: linkify(title, '#5867dd') }} />
                )
            }
        } else {
            return (
                <div dangerouslySetInnerHTML={{ __html: linkify(title, '#5867dd') }} />
            )
        }
    }

    return (
        <Modal
            dimmer='blurring'
            show={true}
            size={size}
            aria-labelledby="contained-modal-title-vcenter"
            onHide={onClose}
            centered
        >
            <Modal.Header closeButton style={{padding: '1rem'}}>
                <Modal.Title className="modal-title d-flex flex-row justify-content-between w-100">
                    {t('newsfeed.post_delete')}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div>
                    <div className="form-group m-form__group">
                        <div className="m-portlet newsfeed-item-style">
                            <div className="m-portlet__head">
                                <div className="m-portlet__head-caption">
                                    <div className="m-portlet__head-title">
                                        <div className='nf-item-header'>
                                            <div>
                                                <img
                                                    src={data && data.avatar ? data.avatar : '/images/image_placeholder.jpg'}
                                                    alt='user'
                                                    onError={(e) => {
                                                        e.target.onError = null,
                                                            e.target.src = '/images/avatar.png'
                                                    }}
                                                />
                                            </div>
                                            <div>
                                                <span>{data && data.firstName ? capitalize(data.firstName) : ''}<span/> <i className='fa fa-caret-right ml-2 mr-2' style={{position: 'relative', top: 1, color: '#7b7e8a'}}/> {data && data.hdrName ? data.hdrName : ''}</span>
                                                <span><span style={{backgroundColor: '#c9cbd1', padding: '2px 6px', borderRadius: 4}}>{data && data.roleName ? data.roleName : '-'}</span>  •  {data && data.createdDate ? data.createdDate : '-'}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='nf-item-container'>
                                <div className='nf-item-content'>
                                    <div className='nf-item-content-newsfeed'>
                                        {data && data.content ? renderTitle(data.content) : null}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="form-group m-form__group row">
                        <label htmlFor="example-text-input" className="col-3 col-form-label text-right">
                            {translations(locale).finance.contact || null}
                        </label>
                        <div className="col-5">
                            <input
                                className={errorDeletePhoneNumber ? "form-control m-input m-input--air error-border" : "form-control m-input m-input--air"}
                                placeholder={translations(locale).teacher.phone_number || null}
                                type="number"
                                value={phoneNumber || ''}
                                onChange={(e) => _inputChangedPhoneNumber(e)}
                            />
                            {
                                errorDeletePhoneNumber
                                    ?
                                    <span className="error-message-10">
                                        {translations(locale).teacher.insert_phone_number}
                                    </span>
                                    : null
                            }
                        </div>
                        <div className="col-4">
                        </div>
                    </div>
                    <div className="form-group m-form__group row">
                        <label htmlFor="example-text-input" className="col-3 col-form-label text-right">
                            {translations(locale).description || null}
                        </label>
                        <div className="col-6">
                            <textarea
                                className={errorDeleteDescription ? 'error-border-solid form-control m-input m-input--air' : 'form-control m-input m-input--air'}
                                placeholder={translations(locale).description || null}
                                rows="3"
                                value={description || ''}
                                onChange={(e) => _textAreaChangeDescription(e)}
                            >
                            </textarea>
                            {
                                errorDeleteDescription
                                    ?
                                    <span className="error-message-10">
                                        {translations(locale).insert_description}
                                    </span>
                                    : null
                            }
                        </div>
                        <div className="col-3">
                        </div>
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer className="text-center">
                <button 
                    onClick={onClose}
                    className="btn m-btn--pill btn-link m-btn m-btn--custom"
                >
                    {t('back')}        
                </button>
                <button 
                    onClick={onSubmit}
                    className="btn m-btn--pill m-btn--air btn-danger m-btn--wide"
                >
                {/* <button
                    onClick={onSubmit}
                    className="btn m-btn--pill btn-success text-uppercase"
                > */}
                    {t('delete')}
                </button>
            </Modal.Footer>
            {/* <div className="actions modal-footer">
                <div className="col-12 text-center">
                    <button className="btn m-btn--pill m-btn--air btn-outline-metal m-btn m-btn--custom"
                        onClick={onClose}>{translations(locale).close.toUpperCase() || null}
                    </button>
                </div>
            </div> */}
        </Modal>
    )
}

export default DeleteModal