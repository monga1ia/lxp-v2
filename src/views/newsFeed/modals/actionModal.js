import React from "react";
import { Modal } from "react-bootstrap";
import { translations } from "utils/translations";
import { useTranslation } from "react-i18next";

const ActionModal = ({ onClose, onSearch, title, searchValue, filteredStats}) => {

    const { t } = useTranslation()

    return (
        <Modal
            dimmer='blurring'
            show={true}
            size="md"
            aria-labelledby="contained-modal-title-vcenter"
            onHide={onClose}
            centered
        >
            <Modal.Header closeButton style={{padding: '1rem'}}>
                <Modal.Title className="modal-title d-flex flex-row justify-content-between w-100">
                    {title}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div>
                    <input
                        type='text'
                        className='nf-action-modal-search-input form-control'
                        placeholder={t('search')}
                        value={searchValue}
                        onChange={onSearch}
                    />
                </div>
                <div className="m-widget3">
                    {
                        filteredStats && filteredStats.length > 0
                            ?
                            filteredStats.map((data, index) => {
                                return (
                                    <div className="m-widget3__item" key={'action_key_' + index}>
                                        <div className="m-widget3__header">
                                            <div className="m-widget3__user-img">
                                                <img className="m-widget3__img"
                                                    src={data.avatar || '/images/avatar.png'}
                                                    onError={(e) => {
                                                        e.target.onError = null,
                                                            e.target.src = '/images/avatar.png'
                                                    }}
                                                />
                                            </div>
                                            <div className="m-widget3__info">
                                                <span className="m-widget3__username">
                                                    {data.firstName}
                                                </span>
                                                <br></br>
                                                <span className="m-widget3__time">
                                                    {`${data && data.role ? data.role : '-'}  •  ${data && data.createdDate ? data.createdDate : '-'}`}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                            : null
                    }
                </div>
            </Modal.Body>
            <Modal.Footer className="col-12 text-center">
                <button
                    className="btn m-btn--pill btn-outline-metal"
                    onClick={onClose}
                >
                    {t('close').toUpperCase() || null}
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

export default ActionModal