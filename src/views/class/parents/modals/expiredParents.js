import React, { useState} from 'react'
import { Modal } from 'react-bootstrap'
import DTable from 'modules/DataTable/DTable'
import secureLocalStorage from 'react-secure-storage'
import { translations } from 'utils/translations'

const group = ({ onClose, data }) => {
    const locale = secureLocalStorage?.getItem('selectedLang') || 'mn'

    const [tableData, setTableData] = useState([
        {id: 19, studentCode: 2323, firstName: "AAA", lastName: "SS", userName: 'tytruy', contact:2222}, 
        {id: 20, studentCode: 1232, firstName: "Julia", lastName: "Julie", userName: 'dfsdg', contact:1}
    ]);

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
            dataField: "studentCode",
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
        {
            dataField: "userName",
            text: translations(locale)?.parents?.user_name,
            sort: true,
        },
        {
            dataField: "contact",
            text: translations(locale)?.phoneNumber,
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
                    {translations(locale)?.parents?.parent_user_expired}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <DTable
                    locale={locale}
                    config={config}
                    columns={columns}
                    data={tableData}
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