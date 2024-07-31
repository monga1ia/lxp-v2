import message from 'modules/message'
import { Modal } from 'semantic-ui-react'
import React, { useEffect, useState } from 'react'
import DTable from 'modules/DataTable/DTable'
import secureLocalStorage from 'react-secure-storage'
import { translations } from 'utils/translations'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import { Col, Row } from 'react-bootstrap'

const locale = secureLocalStorage?.getItem('selectedLang') || 'mn'

const config = {
    excelExport: true,
    showAllData: true,
    showPagination: false,
}

const columns = [
    {
        dataField: 'className',
        text: translations(locale)?.class_name,
        sort: true
    },
    {
        dataField: 'code',
        text: translations(locale)?.studentCode,
        sort: true
    },
    {
        dataField: 'lastName',
        text: translations(locale)?.studentLastName,
        sort: true
    },
    {
        dataField: 'firstName',
        text: translations(locale)?.studentFirstName,
        sort: true
    }
]

const studentView = ({ onClose, students, templateDetail }) => {
    const [loading, setLoading] = useState(false)

    const [tableData, setTableData] = useState(students)

    useEffect(() => {
        setTableData(students)
    }, [students])

    return (
        <Modal
            centered
            open={true}
            size='large'
            onClose={onClose}
            className='react-modal overflow-modal'
        >
            <div className='header'>
                {translations(locale)?.students}
                <button type="button" className="close" aria-label="Close" onClick={onClose}>
                    <CloseRoundedIcon />
                </button>
            </div>
            <div className='content'>
                {/*<Row className='form-group'>*/}
                {/*    <Col className='text-right label-pinnacle-bold'>*/}
                {/*        Шалгуурын нэр*/}
                {/*    </Col>*/}
                {/*    <Col>*/}
                {/*        {templateDetail?.name}*/}
                {/*    </Col>*/}
                {/*</Row>*/}
                {/*<Row className='form-group'>*/}
                {/*    <Col className='text-right label-pinnacle-bold'>*/}
                {/*        Шалгуурын нэр*/}
                {/*    </Col>*/}
                {/*    <Col>*/}
                {/*        {templateDetail?.value}*/}
                {/*    </Col>*/}
                {/*</Row>*/}
                <DTable
                    locale={locale}
                    config={config}
                    data={tableData}
                    columns={columns}
                />
            </div>
            <div className='actions modal-footer'>
                <div className='col-12 text-center'>
                    <button
                        onClick={onClose}
                        className='btn btn-outline-metal m-btn--pill'
                    >
                        {translations(locale)?.close}
                    </button>
                </div>
            </div>
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

export default studentView