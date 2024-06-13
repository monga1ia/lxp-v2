import {React, useEffect} from "react";
import { Modal, Button } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import ClassicEditor from "ckeditor5-build-classic-mathtype";
import { CKEditor } from "@ckeditor/ckeditor5-react";

const UploadBioModal = ({
    title,
    onClose = () => { },
    onUploadBio = () => { },
    size = "xl",
    show = false,
    showBackButton = false,
    showFooter = true,
    submitButtonClass = null,
    footerText = "Хадгалах",
    bio,
}) => {
    const { t } = useTranslation();
    useEffect(() => {
        CKEditor.editorUrl =
            "https://cdn.ckeditor.com/ckeditor5/39.0.2/classic/ckeditor.js";
    }, []);
    const upload = () => {
        onUploadBio({bio:bio})
    }
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
                        <div onClick={onClose} className="cursor-pointer back-button">
                            {t('common.back')}
                        </div>
                    )}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <CKEditor
                    // key={Math.random()}
                    editor={ClassicEditor}
                    data={bio}
                    config={{
                        width: '100px',
                        toolbar: {
                            items: [
                                'heading',
                                'MathType',
                                'ChemType',
                                '|',
                                'bold',
                                'italic',
                                'link',
                                'bulletedList',
                                'numberedList',
                                'insertTable',
                                'blockQuote',
                                'undo',
                                'redo',
                            ],
                        },
                    }}
                    onChange={(event, editor) => {
                        const data = editor.getData();
                        bio = data;
                    }}
                />
            </Modal.Body>
            {showFooter && (
                <Modal.Footer className="p-3">
                    <div className="d-flex flex-row justify-content-center align-items-center w-100">
                        <Button className="cursor-pointer cancel-button pr-4" variant='link' onClick={onClose}>
                            <span style={{ color: '#ff2f1a' }}>{t("common.cancel")}</span>
                        </Button>
                        <Button className={`cursor-pointer ${submitButtonClass ? submitButtonClass : 'save-button'}`} variant='empty' onClick={upload}>
                            <span style={{ color: submitButtonClass ? '#fff' : '#555555' }}>{footerText.toUpperCase()}</span>
                        </Button>
                    </div>
                </Modal.Footer>
            )}
        </Modal>
    );
};

export default UploadBioModal;
