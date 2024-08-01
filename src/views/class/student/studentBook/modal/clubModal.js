import React, { useEffect, useState } from 'react'
import { Modal } from 'react-bootstrap'
import DTable from 'modules/DataTable/DTable'
import secureLocalStorage from 'react-secure-storage'
import { useTranslation } from "react-i18next";
import { studentBookClubDetail } from 'utils/fetchRequest/Urls'
import { fetchRequest } from 'utils/fetchRequest'
import message from "modules/message";

const club = ({ onClose, group, type, season, studentId, studentCode }) => {
    const locale="mn"
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false)

    const [title, setTitle] = useState([])
    const [tableData, setTableData] = useState([])

    const config = {
        showAllData: true,
        showPagination: false,
        showFilter: false,
        excelFileName: `${studentCode}-${t('student.book_title')}-${t('club.title')}`,
        defaultSort: [{
            dataField: 'firstName',
            order: 'asc',
        }]
    }

    const columns = [
        {
            dataField: "date",
            text: t('date'),
            sort: true
        },
        {
            dataField: "time",
            text: t('period'),
            sort: true
        },
        {
            dataField: "createdTeacher",
            text: t('skill.createdTeacher'),
            sort: true
        },
    ]

    useEffect(() => {
        // setLoading(true)
        // fetchRequest(studentBookClubDetail, 'POST', { id: studentId, group, type, season })
        //     .then(res => {
        //         if (res.success) {
        //             const { title, attendances } = res.data
        //             setTitle(title || [])
        //             setTableData(attendances || [])
        //         } else {
        //             message(res.data.message)
        //         }
        //         setLoading(false)
        //     })
        //     .catch(() => {
        //         message(t('err.error_occurred'))
        //         setLoading(false)
        //     })
    }, [])

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
                    {title}
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
                    {t('close')}
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
    )
}

export default club