import { React, useRef, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import UploadBioModal from "./UploadBioModal";
import ClassicEditor from "ckeditor5-build-classic-mathtype";
import { CKEditor } from "@ckeditor/ckeditor5-react";

const BioRegisterModal = ({ 
    show, 
    onClose = () => { }, 
    onUploadBio = () => { },
    bio,
}) => {
    const { t } = useTranslation();

    useEffect(() => {
        CKEditor.editorUrl =
            "https://cdn.ckeditor.com/ckeditor5/39.0.2/classic/ckeditor.js";
    }, []);

    return (
        <UploadBioModal
            title="Хувийн мэдээлэл бүртгэх"
            show={show}
            onClose={onClose}
            onUploadBio={onUploadBio}
            bio={bio}
        >
        </UploadBioModal>
    );
};

export default BioRegisterModal;
