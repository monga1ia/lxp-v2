import message from 'modules/message'
import { Modal } from 'react-bootstrap'
// import { subjectGroupView } from 'utils/fetchRequest/Urls'
import React, { useEffect, useState } from 'react'
import CloseIcon from '@mui/icons-material/Close'
import DTable from 'modules/DataTable/DTable'
import secureLocalStorage from 'react-secure-storage'
// import { fetchRequest } from 'utils/fetchRequest'
import { translations } from 'utils/translations'

const group = ({ onClose, group }) => {
    const locale = secureLocalStorage?.getItem('selectedLang') || 'mn'
    const [loading, setLoading] = useState(false)

    const [tableData, setTableData] = useState([])

    const config = {
        showAllData: true,
        showPagination: false,
        showFilter: false,
        defaultSort: [{ dataField: 'firstName', order: 'asc' }]
    }

    const columns = [
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
            dataField: 'className',
            text: translations(locale)?.group?.title,
            sort: true
        },
        {
            dataField: 'studentCode',
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

    // useEffect(() => {
    //     setLoading(true)
    //     fetchRequest(subjectGroupView, 'POST', { group })
    //         .then(res => {
    //             if (res.success) {
    //                 const { students } = res.data
    //                 setTableData(students || [])
    //             } else {
    //                 message(res.data.message)
    //             }
    //             setLoading(false)
    //         })
    //         .catch(() => {
    //             message(translations(locale)?.err?.error_occurred)
    //             setLoading(false)
    //         })
    // }, [])

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
                    {translations(locale)?.students}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body style={{color: '#212529'}}>
                <DTable
                    locale={locale}
                    config={config}
                    data={tableData}
                    columns={columns}
                />
            </Modal.Body>
            <Modal.Footer className='text-center'>
                <button
                    onClick={onClose}
                    className='btn btn-outline-metal m-btn--pill'
                >
                    {translations(locale)?.close}
                </button>
            </Modal.Footer>
            {
                loading &&
                <>
                    <div className='blockUI blockOverlay' />
                    <div className='blockUI blockMsg blockPage'>
                        <div className='m-loader m-loader--brand m-loader--lg' />
                    </div>
                </>
            }
        </Modal>
    )
}

export default group