import React, { useState, useEffect } from 'react'
import { Modal } from 'semantic-ui-react'
import DTable from 'modules/DataTable/DTable'
import secureLocalStorage from 'react-secure-storage'
import { useTranslation } from "react-i18next";
import { studentBookHomeworkDetail } from 'utils/fetchRequest/Urls'
import { fetchRequest } from 'utils/fetchRequest'
import message from "modules/message";;

const attendance = ({ onClose, season, type, studentId }) => {
    const [loading, setLoading] = useState(false)
    const locale="mn"
    const { t } = useTranslation();

    const [typeName, setTypeName] = useState('')
    const [lessons, setLessons] = useState([])
    const [homeWorks, setHomeworks] = useState([])
    const [title, setTitle] = useState([])

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
            text: t('exam_template?.number'),
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
            dataField: "groupName",
            text: t('subject.title'),
            sort: true
        },
        {
            dataField: "groupTeacher",
            text: 'Заадаг багш',
            sort: true
        },
        {
            dataField: "createdUser",
            text: t('skill.createdTeacher'),
            sort: true
        },
    ]

    useEffect(() => {
        setLoading(true)
        // fetchRequest(studentBookHomeworkDetail, 'POST', { id: studentId, type, season })
        //     .then(res => {
        //         if (res.success) {
        //             const { groups, details, title } = res.data
        //             setTypeName(res?.data?.typeName)
        //             setLessons(groups || [])
        //             setHomeworks(details || [])
        //             setTitle(title || [])
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
            id='printablediv'
            dimmer='blurring'
            open={true}
            onClose={onClose}
            className="react-modal overflow-modal"
            centered
        >
            <div className="header">
                {title}
            </div>
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
                    data={homeWorks}
                />
            </div>
            <div className="actions modal-footer ">
                <div className="col-12 text-center">
                    <button
                        onClick={onClose}
                        className="btn btn-outline-metal m-btn--pill"
                        style={{ width: 90 }}
                    >
                        {t('close')}
                    </button>
                    <button
                        type="button" onClick={Print}
                        className="btn btn-outline-metal m-btn--pill"
                        style={{ backgroundColor: '#5867DD', color: '#fff', marginLeft: 10, width: 90 }}
                    >
                        {t('print')}
                    </button>
                </div>
            </div>
            {loading &&
                <>
                    <div className='blockUI blockOverlay' />
                    <div className='blockUI blockMsg blockPage'>
                        <div className='m-loader m-loader--brand m-loader--lg' />
                    </div>
                </>
            }
        </Modal >
    )
}

export default attendance