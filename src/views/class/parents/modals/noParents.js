import React from 'react'
import { Modal } from 'react-bootstrap'
import DTable from 'modules/DataTable/DTable'
import secureLocalStorage from 'react-secure-storage'
import { translations } from 'utils/translations'

const group = ({ onClose, data }) => {
    const locale = secureLocalStorage?.getItem('selectedLang') || 'mn'

    const config = {
        showAllData: true,
        showPagination: false,
        showFilter: false,
        defaultSort: [{
            dataField: 'firstName',
            order: 'asc',
        }]
    }

    const columns = [
        {
            dataField: "code",
            text: translations(locale)?.studentCode,
            sort: true
        },
        {
            dataField: "lastName",
            text: translations(locale)?.studentLastName,
            sort: true
        },
        {
            dataField: "firstName",
            text: translations(locale)?.studentFirstName,
            sort: true,
        },
    ]

    return (
        <Modal
            dimmer='blurring'
            show={true}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            onHide={() => onClose()}
            centered
        >
            <Modal.Header closeButton style={{ padding: '1rem' }}>
                <Modal.Title className="modal-title d-flex flex-row justify-content-between w-100">
                    {translations(locale)?.parents?.no_parent}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
               <DTable
                    locale={locale}
                    config={config}
                    columns={columns}
                    data={data}
                />
            </Modal.Body>
            <Modal.Footer className="text-center">
                    <button
                        onClick={onClose}
                        className="btn btn-outline-metal m-btn--pill"
                    >
                        {translations(locale)?.close}
                    </button>
   
            </Modal.Footer>
        </Modal>
    )
}

export default group