import { React, useState, useEffect, useRef } from "react";
import { Modal, Button } from "react-bootstrap";
import Checkbox from '@mui/material/Checkbox';
import Select from "modules/Form/Select";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { common } from "@material-ui/core/colors";

const ViewModal = ({
    onClose = () => { },
    show = false,
    path = null,
    type = null
}) => {
    const { t } = useTranslation();

    const render = (type = '') => {
        if(type && type == 'text'){
            return (
                <p>{path}</p>
            )
        } else if(type && type == 'equation'){
            return (
                <div className='d-flex' dangerouslySetInnerHTML={{ __html: path }} />
            )
        } else if(type && type == 'mbscript'){
            return (
                <div className='text-semi-large text-dark tradition-text tradition-text-student' dangerouslySetInnerHTML={{ __html: path }}/>
            )
        } else {
            return (
                <img src={path} height='100%' style={{maxWidth: '100%'}}/>
            )
        }
    } 

    return (
        <Modal
            show={show}
            onHide={onClose}
            size="xl"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header className="p-3">
                <Modal.Title className="modal-title d-flex flex-row justify-content-between w-100" style={{ textTransform: 'none' }}>
                    {t('common.view')}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className="text-center student-view-modal">
                {
                    render(type)
                }
            </Modal.Body>
            <Modal.Footer className="p-3 text-center">
                <div style={{ display: 'flex', flexDirection: 'row', display: 'inline-block' }}>
                    <Button className="cursor-pointer cancel-button pr-4" variant='link' onClick={onClose}>
                        <span style={{ color: '#ff2f1a' }}>{t("common.back")}</span>
                    </Button>
                </div>
            </Modal.Footer>
        </Modal>
    );
};

export default ViewModal;
