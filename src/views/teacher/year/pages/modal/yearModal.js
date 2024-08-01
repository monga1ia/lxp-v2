import React, { useState } from 'react'
import { Modal } from 'react-bootstrap'
import CloseIcon from '@mui/icons-material/Close'
import DTable from 'modules/DataTable/DTable'
import secureLocalStorage from 'react-secure-storage'
import { translations } from 'utils/translations'

const locale = secureLocalStorage?.getItem('selectedLang') || 'mn'

const YearModal = ({ onClose, onSubmit, columns, show, data, journalHasDownloaded }) => {

    const [selectedTableId, setSelectedTableId] = useState(null)

    const yearModalConfig = {
        showAllData: true,
        showPagination: false,
        showFilter: false,
        defaultSort: [{
            dataField: 'publishedDate',
            order: 'desc'
        }]
    };

    return (
        <Modal
            show={show}
            size='lg'
            onHide={onClose}
            dimmer='blurring'
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton style={{padding: '1rem'}}>
                <Modal.Title className="modal-title d-flex flex-row justify-content-between w-100">
                    {translations(locale)?.evaluation_final?.name}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body style={{color: '#212529'}}>
                <div style={{color: '#575962', padding: '0rem 1rem'}}>
                    <DTable
                        config={yearModalConfig}
                        data={data}
                        columns={columns}
                        locale={locale}
                    />
                </div>
            </Modal.Body>
        </Modal>
    )
}

export default YearModal