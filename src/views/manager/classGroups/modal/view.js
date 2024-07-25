import message from 'modules/message'
import { Modal } from 'react-bootstrap'
import React, { useEffect, useState } from 'react'
import CloseIcon from '@mui/icons-material/Close'
import secureLocalStorage from 'react-secure-storage'
import DTable from 'modules/DataTable/DTable'
import { useTranslation } from "react-i18next";
import { translations } from 'utils/translations'

const locale = secureLocalStorage?.getItem('selectedLang') || 'mn'

const ViewStudents = ({ onClose, selectedId, data }) => {

    const { t } = useTranslation();
    const [loading, setLoading] = useState(false)

    const modalConfig = {
        showFilter: true,
        showAllData: true,
        showPagination: false,
        defaultSort: [{dataField: 'firstName', order: 'asc'}],
    };

    const modalColumns = [
        {
            dataField: 'avatar',
            text: translations(locale)?.photo,
            align: 'center',
            formatter: (cell) => {
                return <img className='img-responsive img-circle'
                            src={cell || '/img/profile/avatar.png'} width={40} height={40}
                            alt='img'
                            onError={(e) => {
                                e.target.onError = null
                                e.target.src = '/img/profile/avatar.png'
                            }}
                />;
            }
        },
        {
            dataField: 'code',
            text: translations(locale)?.studentCode,
            sort: true,
        },
        {
            dataField: 'lastName',
            text: translations(locale)?.studentLastName,
            sort: true,
        },
        {
            dataField: 'firstName',
            text: translations(locale)?.studentFirstName,
            sort: true,
        },
    ]


    return (
        <Modal
            size='xl'
            dimmer='blurring'
            show={true}
            onHide={onClose}
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton style={{padding: '1rem'}}>
                <Modal.Title className="modal-title d-flex flex-row justify-content-between w-100">
                    {t('view')}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <DTable
                    locale={locale}
                    config={modalConfig}
                    data={data}
                    columns={modalColumns}
                />
            </Modal.Body>
            <Modal.Footer className="col-12 text-center">
                <button
                    className="btn m-btn--pill btn-outline-metal m-btn m-btn--custom"
                    onClick={onClose}
                >
                    {t('close')}
                </button>
            </Modal.Footer>
            {
                loading &&
                <>
                    <div className="blockUI blockOverlay" />
                    <div className="blockUI blockMsg blockPage">
                        <div className="m-loader m-loader--brand m-loader--lg" />
                    </div>
                </>
            }
        </Modal >
    )
}

export default ViewStudents