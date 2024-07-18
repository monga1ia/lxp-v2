import React, { useEffect, useState } from 'react'
import { Modal } from 'semantic-ui-react'
import CloseIcon from '@mui/icons-material/Close'
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
        setLoading(true)
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
            open={true}
            onClose={onClose}
            className="react-modal overflow-modal"
            centered
        >
            <div className="header">
                {title}
                <button type="button" className="close" aria-label="Close" onClick={onClose} >
                    <CloseIcon />
                </button>
            </div>
            <div className="br-08 position-relative px-5 mt-3">
                <DTable
                    locale={locale}
                    config={config}
                    columns={columns}
                    data={tableData}
                />
            </div>
            <div className="actions modal-footer ">
                <div className="col-12 text-center">
                    <button
                        onClick={onClose}
                        className="btn btn-outline-metal m-btn--pill"
                    >
                        {t('close')}
                    </button>
                </div>
            </div>
        </Modal >
    )
}

export default club