import React from "react";
import { Button, Modal } from "react-bootstrap";
import { useTranslation } from "react-i18next";

const PageModal = ({
  onClose = () => {},
  children,
  onSave = () => {},
  title = "",
  show = false,
  showFooter = false,
}) => {
  const { t } = useTranslation();
  return (
    <Modal
      className="page-modal"
      show={show}
      onHide={onClose}
      size="xl"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton className="p-4">
        <Modal.Title className="modal-title">{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body className="p-0">{children}</Modal.Body>
      {showFooter && (
        <Modal.Footer className="p-4">
          <div className="d-flex flex-row justify-content-center w-100">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-link bolder"
            >
              {t("common.cancel")}
            </button>
            <Button
              type="button"
              variant="success btn-success"
              onClick={onSave}
            >
              {t("common.save")}
            </Button>
          </div>
        </Modal.Footer>
      )}
    </Modal>
  );
};

export default PageModal;
