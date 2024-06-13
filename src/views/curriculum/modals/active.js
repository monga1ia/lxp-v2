import MainModal from "modules/MainModal";
import React from "react";
import { useTranslation } from "react-i18next";

export default function ActiveModal({ show, onClose, onSave }) {
  
  const { t } = useTranslation()
  return (
    <MainModal
      title={t("action.setActive")}
      show={show}
      onClose={onClose}
      onSave={onSave}
      showFooter
      size='md'
      footerText={t("common.yes")}
    >
      <div>
        Та нэгж хичээлийг идэвхтэй болгох уу?
      </div>
    </MainModal>
  );
}
