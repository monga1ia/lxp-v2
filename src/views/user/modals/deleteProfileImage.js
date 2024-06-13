import DeleteModal from "modules/DeleteModal";
import React from "react";
import { useTranslation } from "react-i18next";

export default function DeleteProfileImage({ 
  show = false, 
  onClose = () => { }, 
  onDeleteProfileImage  = () => { }
}) {
  
  const { t } = useTranslation()
  return (
    <DeleteModal
      title={t("warning.delete")}
      show={show}
      onClose={onClose}
      onDelete={onDeleteProfileImage}
      showFooter
      submitButtonClass="btn-danger"
      size='md'
      footerText={t("warning.delete")}
    >
      <div>
        Та профайл зургаа устгах уу?<br/>
        Устгасан зургийг сэргээх боломжгүйг анхаарна уу.
      </div>
    </DeleteModal>
  );
}
