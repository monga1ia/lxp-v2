import message from 'modules/message'
import { Modal } from 'react-bootstrap'
import DeleteModal from 'utils/deleteModal'
import React, { useEffect, useState } from 'react'
import CloseIcon from '@mui/icons-material/Close'
import DTable from 'modules/DataTable/DTable'
import secureLocalStorage from 'react-secure-storage'
import { translations } from 'utils/translations'
import { fetchRequest } from 'utils/fetchRequest'
import { classParentApprove } from 'utils/fetchRequest/Urls'

const approveParents = ({ onClose, onSubmit, parents = [] }) => {
    const locale = secureLocalStorage?.getItem('selectedLang') || 'mn'
    const [loading, setLoading] = useState(false)
    const [tableData, setTableData] = useState(parents)

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
            sort: true
        },
        {
            dataField: "contact",
            text: translations(locale)?.phoneNumber,
            sort: true
        },
        {
            dataField: "name",
            text: translations(locale)?.student.relation_type,
            sort: true
        },
        {
            dataField: "relationLastName",
            text: translations(locale)?.last_name,
            sort: true,
        },
        {
            dataField: "relationFirstName",
            text: translations(locale)?.first_name,
            sort: true,
        }
    ]

    const submit = () => {
        // const list = (tableData || []).filter(obj => {
        //     return obj?.checkable
        // })
        // if (list && list?.length > 0) {
        //     const relations = []
        //     for (let r = 0; r < list?.length; r++) {
        //         relations.push({
        //             user: list[r]?.userId,
        //             student: list[r]?.studentId
        //         })
        //     }
        //     setLoading(true)
        //     fetchRequest(classParentApprove, 'POST', { students: JSON.stringify(relations) })
        //         .then(res => {
        //             if (res.success) {
        //                 onSubmit(res?.data?.nonApprovedParents || [])
        //             } else {
        //                 message(res.data.message)
        //             }
        //             setLoading(false)
        //         })
        //         .catch(() => {
        //             message(translations(locale)?.err?.error_occurred)
        //             setLoading(false)
        //         })
        // } else {
        //     message(translations(locale)?.err?.relation_confirm_empty)
        // }
    }

    const onCheckedChange = (key, rowIndex, checked, id) => {
        const data = [...tableData]
        if (key === 'allCheck') {
            for (let d = 0; d < data?.length; d++) {
                data[d].checkable = checked
            }
        } else if (key === 'row') {
            for (let d = 0; d < data?.length; d++) {
                if (data[d].id === id) {
                    data[d].checkable = checked
                    break;
                }
            }
        }
        setTableData(data)
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
                    {t('parents.pendingConfirmation')}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                    <DTable
                        checkable={true}
                        onCheckable={onCheckedChange}
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
                    <button
                        className='btn m-btn--pill btn-success text-uppercase ml-3'
                        onClick={submit}
                    >
                        {translations(locale)?.approve}
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
        </Modal>
        // <Modal
        //     dimmer='blurring'
        //     open={true}
        //     onClose={onClose}
        //     className="react-modal overflow-modal"
        //     centered
        // >
        //     <div className="header">
        //         {translations(locale)?.parents?.pendingConfirmation}
        //         <button type="button" className="close" aria-label="Close" onClick={onClose} >
        //             <CloseIcon />
        //         </button>
        //     </div>
        //     <div className="content">
        //         <DTable
        //             checkable={true}
        //             onCheckable={onCheckedChange}
        //             locale={locale}
        //             config={config}
        //             columns={columns}
        //             data={tableData}
        //         />
        //     </div>
        //     <div className="actions modal-footer ">
        //         <div className="col-12 text-center">
        //             <button
        //                 onClick={onClose}
        //                 className="btn btn-outline-metal m-btn--pill"
        //             >
        //                 {translations(locale)?.close}
        //             </button>
        //             <button
        //                 className='btn m-btn--pill btn-success text-uppercase ml-3'
        //                 onClick={submit}
        //             >
        //                 {translations(locale)?.approve}
        //             </button>
        //         </div>
        //     </div>
        //     {
        //         loading &&
        //         <>
        //             <div className="blockUI blockOverlay" />
        //             <div className="blockUI blockMsg blockPage">
        //                 <div className="m-loader m-loader--brand m-loader--lg" />
        //             </div>
        //         </>
        //     }
        // </Modal>
    )
}

export default approveParents