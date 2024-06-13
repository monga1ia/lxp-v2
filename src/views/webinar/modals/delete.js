import MainModal from "modules/MainModal";
import React from "react";
import { useTranslation } from "react-i18next";

export default function DeleteModal({ show, onClose, onSave }) {
  
  const { t } = useTranslation()
  return (
    <MainModal
      title={t("warning.delete")}
      show={show}
      onClose={onClose}
      onSave={onSave}
      showFooter
      submitButtonClass="btn-danger"
      size='md'
      footerText={t("warning.delete")}
    >
      <div>
        Та нэгж хичээлийг устгах уу?<br/>
        Устгасан мэдээллийг сэргээх боломжгүйг анхаарна уу.
      </div>
    </MainModal>
  );
}
