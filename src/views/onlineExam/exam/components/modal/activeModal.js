import MainModal from "modules/MainModal";
import React from "react";
import { useTranslation } from "react-i18next";

export default function ActiveModal({ show, onClose, onSave, content }) {
  const { t } = useTranslation()
  return (
    <MainModal
      title={t("action.setInactive")}
      show={show}
      onClose={onClose}
      onSave={onSave}
      showFooter
      footerText={t("common.yes")}
    >
      {
        content || <div>
          Та сорилыг идэвхгүй төлөв рүү шилжүүлснээр сурагчдад харагдахгүй болно.
          Та идэвхгүй болгохдоо итгэлтэй байна уу?
        </div>
      }
    </MainModal>
  );
}
