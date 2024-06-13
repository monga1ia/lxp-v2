import UploadAvatarModal from "./UploadAvatarModal";
import React from "react";
import { useTranslation } from "react-i18next";
import CloseButton from "components/buttons/CloseButton";

export default function UploadProfileImage({ 
  show = false, 
  onClose = () => { }, 
  onUploadProfileImage  = () => { },
  handleButtonClick  = () => { },
  onFileNull = () => { },
  avatarFileValue

}) {
  const { t } = useTranslation()

  return (
    <UploadAvatarModal
      title={t("profile.upload_image")}
      show={show}
      onClose={onClose}
      onUpload={onUploadProfileImage}
      showFooter
      submitButtonClass="btn-danger"
      size='md'
    >
      <div>
        <div className="d-flex flex-row mt-4">
            <p className="my-2 mr-2 modal-select-title">{t("profile.upload_image")}</p>
            {
              avatarFileValue
                ?
                <div className="position-relative ml-4 mt-2">
                    <img alt="answer" src={URL.createObjectURL(avatarFileValue)} style={{
                        width: 150,
                        objectFit: 'contain'
                    }} />
                    <CloseButton className="absolute" onClick={onFileNull} />
                </div>
                :
                <button className="upload-image-button modal-add-button" onClick={(handleButtonClick)}>{t("profile.upload_image")}</button>         
            }
        </div>
        <br/>
        Өмнөх зургийг сэргээх боломжгүйг анхаарна уу.
      </div>
    </UploadAvatarModal>
  );
}
