import React, { useState, useEffect } from 'react'
import { Modal } from 'react-bootstrap'
import DTable from 'modules/DataTable/DTable'
import { useTranslation } from "react-i18next";
import { studentBookAttendanceDetail } from 'utils/fetchRequest/Urls'
import { fetchRequest } from 'utils/fetchRequest'
import message from "modules/message";;

const attendance = ({ onClose, season, type, typeName = '', studentId }) => {
    
    const locale="mn"
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false)

    const [lessons, setLessons] = useState([])
    const [attendaces, setAttendaces] = useState([])
    const [title, setTitle] = useState(['title1', 'title2'])

    const Print = () => {
        let printContents = document.getElementById('printablediv').innerHTML;
        let originalContents = document.body.innerHTML;
        document.body.innerHTML = printContents;
        window.print();
        document.body.innerHTML = originalContents;
    }

    const config = {
        // showAllData: true,
        // showPagination: false,
        showFilter: false,
        defaultSort: [{
            dataField: 'firstName',
            order: 'asc',
        }]
    }

    const columns1 = [
        {
            dataField: "name",
            text: t('subject.title'),
            sort: true
        },
        {
            dataField: "count",
            text: t('period'),
            sort: true
        },
    ]

    const columns2 = [
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
            dataField: "subject",
            text: t('subject.title'),
            sort: true
        },
        {
            dataField: "teacher",
            text: t('teacher.title'),
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
        // fetchRequest(studentBookAttendanceDetail, 'POST', { id: studentId, season, type })
        //     .then(res => {
        //         if (res.success) {
        //             const { lessons, attendaces, title } = res.data
        //             setLessons(lessons || [])
        //             setAttendaces(attendaces || [])
        //             setTitle(title || [])

        //         } else {
        //             console.log(res)
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
            size="xl"
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
                <div className="br-08 position-relative px-5 mt-3" style={{ border: '1px solid rgba(255, 91, 29, 0.1)', margin: 20, marginTop: 0 }}>
                    <div style={{ marginTop: 15, color: '#ff5b1d', fontWeight: 'bold' }}>
                        {typeName} {t('lessons')}
                    </div>
                    <div style={{ width: 400 }}>
                        <DTable
                            locale={locale}
                            config={config}
                            columns={columns1}
                            data={lessons}
                        />
                    </div>
                </div>
                <div className="br-08 position-relative px-5" style={{ border: '1px solid rgba(255, 91, 29, 0.1)', margin: 20, marginTop: 0 }}>
                    <div style={{ marginTop: 15, color: '#ff5b1d', fontWeight: 'bold' }}>
                        {typeName} {t('day')}
                    </div>
                    <DTable
                        locale={locale}
                        config={config}
                        columns={columns2}
                        data={attendaces}
                    />
                </div>
            </Modal.Body>
            <Modal.Footer className="text-center">
                <button
                    onClick={onClose}
                    className="btn btn-outline-metal m-btn--pill"
                    style={{ width: 90 }}
                >
                    {t('close')}
                </button>
                <button type="button" onClick={Print}
                    className="btn btn-outline-metal m-btn--pill"
                    style={{ backgroundColor: '#5867DD', color: '#fff', marginLeft: 10, width: 90 }}
                >
                    {t('print')}
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

export default attendance