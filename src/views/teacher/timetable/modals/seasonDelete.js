import React, { useState } from 'react'
import { Modal } from 'react-bootstrap'
import { useTranslation } from "react-i18next";
import { translations } from 'utils/translations';
import { NDropdown as Dropdown } from 'widgets/Dropdown';
import TimeField from 'react-simple-timefield';
import { Checkbox } from 'semantic-ui-react';
import CloseIcon from '@mui/icons-material/Close';
import secureLocalStorage from 'react-secure-storage';

const locale = secureLocalStorage?.getItem('selectedLang') || 'mn'

const SeasonDelete = ({ onClose, onSubmit }) => {
    
    const { t } = useTranslation();

    const [seasonTimetableSubjectList, setSeasonTimetableSubjectList]  = useState([])

    return (
        <Modal
            size='sm'
            dimmer='blurring'
            show={true}
            onHide={onClose}
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton style={{padding: '1rem'}}>
                <Modal.Title className="modal-title d-flex flex-row justify-content-between w-100">
                    {t('timetable.delete')}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body style={{color: '#212529'}}>
                <div>
                    <p>{translations(locale).delete_confirmation || null}</p>
                    <p>{translations(locale).delete_confirmation_description || null}</p>
                </div>
            </Modal.Body>
            <Modal.Footer className='text-center'>
                <div className={"col-12 text-center"}>
                    <button className="btn m-btn--pill btn-link m-btn--custom"
                            onClick={closeModal}>{translations(locale).back || null}
                    </button>
                    <button
                        className="btn btn-danger m-btn m-btn--icon m-btn--pill m-btn--uppercase"
                        onClick={deleteSeasonTimetableSubmit}>{translations(locale).delete || null}
                    </button>
                </div>
            </Modal.Footer>
        </Modal >
    )
}

export default SeasonDelete