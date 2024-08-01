import message from 'modules/message'
import { Modal } from 'react-bootstrap'
import DeleteModal from 'utils/deleteModal'
import React, { useEffect, useState } from 'react'
import DTable from 'modules/DataTable/DTable'
import secureLocalStorage from 'react-secure-storage'
import { translations } from 'utils/translations'
import { fetchRequest } from 'utils/fetchRequest'
import { classParentRemove, classParentView } from 'utils/fetchRequest/Urls'
import {priceFormat, secondFormat} from "utils/Util";

const group = ({ onClose, id, onClick, rerender}) => {
    const locale = secureLocalStorage?.getItem('selectedLang') || 'mn'
    const [loading, setLoading] = useState(false)

    const [student, setStudent] = useState({id: 19, code: 2323, firstName: "Sunder", lastName: "Ochir", contact: '99000337', relationCount:2})
    const [tableData, setTableData] = useState([{id: 19, code: 2323, firstName: "Sunder", lastName: "Ochir", contact: '99000337', relationCount:2}])

    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [selectedParentId, setSelectedParentId] = useState(null)

    const config = {
        showAllData: true,
        showPagination: false,
        showFilter: true,
        defaultSort: [{
            dataField: 'firstName',
            order: 'asc',
        }]
    }

    const columns = [
        {
            dataField: "avatar",
            text: translations(locale)?.teacher?.photo,
            sort: true,
            align: 'center',
            formatter: (cell, row) => {
                return <img width={40} height={40}
                    className='img-circle'
                    src={cell || '/img/profile/avatar.png'}
                    alt='profile picture'
                    onError={(e) => {
                        e.target.onError = null
                        e.target.src = '/img/profile/avatar.png'
                    }}
                />
            }
        },
        {
            dataField: "name",
            text: translations(locale)?.student.relation_type,
            sort: true
        },
        {
            dataField: "lastName",
            text: translations(locale)?.last_name,
            sort: true,
        },
        {
            dataField: "firstName",
            text: translations(locale)?.first_name,
            sort: true,
        },
        {
            dataField: "contact",
            text: translations(locale)?.phoneNumber,
            sort: true,
            formatter: (cell, row) => { return <span onClick={() => onClick(row)} className='underline'>{cell}</span> }
        },
        {
            dataField: "isConfirmed",
            text: translations(locale)?.parents?.confirmed,
            sort: true,
            formatter: (cell) => {
                return cell ? translations(locale)?.parents?.confirmed : translations(locale)?.parents?.pendingConfirmation
            }
        },
        {
            dataField: "usageTime",
            text: translations(locale)?.student?.usage_time,
            sort: true,
            formatter: (cell) => secondFormat(cell)
        },
        {
            dataField: "lastUsed",
            text: translations(locale)?.student?.last_login,
            sort: true,
        },
        {
            dataField: "action",
            text: "",
            headerStyle: { width: 60 },
            align: 'center',
            formatter: (cell, row) => {
                return (
                    <button className='btn btn-danger m-btn m-btn--icon btn-sm m-btn--icon-only m-btn--pill'
                        onClick={() => showModal(1)} // showModal(row?.userId)
                    >
                        <i className="la la-close" />
                    </button>
                )
            }
        },
    ]

    useEffect(() => {
    //     setLoading(true)
    //     fetchRequest(classParentView, 'POST', { id })
    //         .then(res => {
    //             if (res.success) {
    //                 const { parents, student } = res.data
    //                 setTableData(parents || [])
    //                 setStudent(student || {})
    //             } else {
    //                 message(res.data.message)
    //             }
    //             setLoading(false)
    //         })
    //         .catch(() => {
    //             message(translations(locale)?.err?.error_occurred)
    //             setLoading(false)
    //         })
    }, [])

    const showModal = id => {
        setSelectedParentId(id)
        setShowDeleteModal(true)
    }

    const closeModal = () => {
        setSelectedParentId(null)
        setShowDeleteModal(false)
    }

    const handleRemove = () => {
        // setLoading(true)
        // fetchRequest(classParentRemove, 'POST', { user: selectedParentId, student: student?.id })
        //     .then(res => {
        //         if (res.success) {
        //             message(res.data.message, res.success)
        //             const { parents } = res.data
        //             setTableData(parents || [])
        //             closeModal()
        //             rerender()
        //         } else {
        //             message(res.data.message)
        //         }
        //         setLoading(false)
        //     })
        //     .catch(() => {
        //         message(translations(locale)?.err?.error_occurred)
        //         setLoading(false)
        //     })
    }

    return (
        <Modal
            dimmer='blurring'
            show={true}
            size="xl"
            aria-labelledby="contained-modal-title-vcenter"
            onHide={() => onClose()}
            centered
        >
            <Modal.Header closeButton style={{ padding: '1rem' }}>
                <Modal.Title className="modal-title d-flex flex-row justify-content-between w-100">
                    {student?.studentCode} {student?.firstName}
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
            {
                loading &&
                <>
                    <div className="blockUI blockOverlay">
                        <div className="blockUI blockMsg blockPage">
                            <div className="m-loader m-loader--brand m-loader--lg" />
                        </div>
                    </div>
                </>
            }
            {
                showDeleteModal && selectedParentId &&
                <DeleteModal
                    onClose={closeModal}
                    onDelete={handleRemove}
                    locale={locale}
                    title={translations(locale)?.delete}
                    className={'imageDoubleModal'}
                >
                    {translations(locale)?.delete_confirmation}
                    <br />
                    <br />
                    {translations(locale)?.delete_confirmation_description}
                </DeleteModal>
            }
        </Modal>
    )
}

export default group