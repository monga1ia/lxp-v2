import React from "react";
import { Modal } from "react-bootstrap";
import { translations } from "utils/translations";
import { useTranslation } from "react-i18next";

const EditModal = ({ onClose, onEdit, title, children}) => {

    const { t } = useTranslation()

    return (
        <Modal
            dimmer='blurring'
            show={true}
            size="xxl"
            aria-labelledby="contained-modal-title-vcenter"
            onHide={onClose}
            centered
        >
            <Modal.Header closeButton style={{padding: '1rem'}}>
                <Modal.Title className="modal-title d-flex flex-row justify-content-between w-100">
                    {t('newsfeed.post_edit')}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {children}
            </Modal.Body>
            <Modal.Footer className="col-12 text-center">
                <button 
                    className="btn btn-link ml-2"
                    onClick={onClose}
                >
                        {translations(locale).back || null}
                </button>
                <button 
                    className="btn m-btn--pill m-btn--air btn-warning m-btn--wide"
                    onClick={onEdit}
                >
                    {translations(locale).edit || null}
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

export default EditModal