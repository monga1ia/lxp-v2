import UploadBio from "./UploadBioModal";
import React from "react";
import { useTranslation } from "react-i18next";
import CloseButton from "components/buttons/CloseButton";

export default function uploadBio({ 
  show = false, 
  onClose = () => { }, 
  onUploadBio  = () => { },
  bio

}) {
  const { t } = useTranslation()

  return (
    <UploadBio
      title={t("profile.upload_image")}
      show={show}
      onClose={onClose}
      onUpload={onUploadBio(bio)}
      showFooter
      submitButtonClass="btn-danger"
      size='md'
    >
      <div>
        <div className="d-flex flex-row mt-4">
            <p className="my-2 mr-2 modal-select-title">{t("profile.upload_image")}</p>
                                                         
        </div>
        <br/>
      </div>
    </UploadBio>
  );
}
