import React from "react";
import { Modal, Button } from "react-bootstrap";
import { useTranslation } from "react-i18next";

const MainModal = ({
    onClose = () => { },
    children,
    onSave = () => { },
    title = "",
    size = "xl",
    show = false,
    showBackButton = false,
    showFooter = true,
    submitButtonClass = null,
    footerText = "Хадгалах",
}) => {
    const { t } = useTranslation();

    return (
        <Modal
            show={show}
            onHide={onClose}
            size={size}
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header className="p-3">
                <Modal.Title className="modal-title d-flex flex-row justify-content-between w-100">
                    {title}
                    {showBackButton && (
                        <div onClick={onClose} className="cursor-pointer back-button mr-2">
                            {t('common.back')}
                        </div>
                    )}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>{children}</Modal.Body>
            {showFooter && (
                <Modal.Footer>
                    <div className="d-flex flex-row justify-content-center align-items-center w-100">
                        <Button className="cursor-pointer cancel-button pr-4" variant='link' onClick={onClose}>
                            <span style={{ color: '#ff2f1a' }}>{t("common.cancel")}</span>
                        </Button>
                        <Button className={`cursor-pointer ${submitButtonClass ? submitButtonClass : 'save-button'}`} variant='empty' onClick={onSave}>
                            <span style={{ color: submitButtonClass ? '#fff' : '#555555' }}>{footerText.toUpperCase()}</span>
                        </Button>
                    </div>
                </Modal.Footer>
            )}
        </Modal>
    );
};

export default MainModal;
