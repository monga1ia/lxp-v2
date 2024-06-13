import React from "react";
import { Button, Modal } from "react-bootstrap";
import { useTranslation } from "react-i18next";

const DeleteModal = ({
    onClose = () => { },
    children,
    onDelete = () => { },
    title = "",
    show = false,
}) => {
    const { t } = useTranslation();

    return (
        <Modal
            show={show}
            onHide={onClose}
            size="sm"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton style={{padding: '1rem'}}>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>{children}</Modal.Body>
            <Modal.Footer style={{padding: '1rem'}}>
                <div className="row">
                    <div className="col-12 text-center">
                        <button
                            type="button"
                            onClick={onClose}
                            className="cancel-button btn btn-link bolder"
                        >
                            {t("common.back")}
                        </button>
                        <Button
                            type="button"
                            variant="success btn-danger"
                            onClick={onDelete}
                        >
                            {t("common.delete").toUpperCase()}
                        </Button>
                    </div>
                </div>
            </Modal.Footer>
        </Modal>
    );
};

export default DeleteModal;
