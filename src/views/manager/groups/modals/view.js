import message from 'modules/message'
import { Modal } from 'react-bootstrap'
import React, { useEffect, useState } from 'react'
import CloseIcon from '@mui/icons-material/Close'
import secureLocalStorage from 'react-secure-storage'
import DTable from 'modules/DataTable/DTable'
import { useTranslation } from "react-i18next";

const locale = secureLocalStorage?.getItem('selectedLang') || 'mn'

const ViewStudent = ({ onClose, selectedId }) => {

    console.log('SelectedDataID>>>>>>>>>>>>>>>>>    ' + selectedId)

    const { t } = useTranslation();
    const [loading, setLoading] = useState(false)
    const [viewStudentLists, setViewStudentLists] = useState([{
        "id": "4",
        "avatar": null,
        "className": "2A",
        "studentCode": "152201001",
        "lastName": "Баяр",
        "firstName": "Жаргал"
    }])
    const [viewStudentListCount, setViewStudentListCount] = useState(0)

    const studentModalConfig = {
        showPagination: false,
        showAllData: true,
        excelExport: true,
        defaultSort: [
            {
                dataField: 'firstName',
                order: 'asc',
            },
        ],
    };

    const studentModalColumn = [
        {
            dataField: "avatar",
            text: t('photo') || "",
            align: "center",
            formatter: (cell) => {
                return <img className='img-responsive img-circle' src={cell || '/img/profile/avatar.png'} width={40} height={40} alt='img' />;
            }
        },
        {
            dataField: "className",
            text: t('group.title') || "",
            sort: true
        },
        {
            dataField: "studentCode",
            text: t('studentCode') || "",
            sort: true,
        },
        {
            dataField: "lastName",
            text: t('studentLastName') || "",
            sort: true,
        },
        {
            dataField: "firstName",
            text: t('studentFirstName') || "",
            sort: true,
        },
    ];

    // useEffect(() => {
    //     setViewStudentListCount([])
    // })

    return (
        <Modal
            size='lg'
            dimmer='blurring'
            show={true}
            onHide={onClose}
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton style={{padding: '1rem'}}>
                <Modal.Title className="modal-title d-flex flex-row justify-content-between w-100">
                    {t('action.view')}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className='pt-0'>
                <div className="myToday-group-student-modal-style">
                    <div>
                        <span style={{ position: 'relative', top: 45, left: 2, color: '#575962', fontSize: 14 }} >
                            {t('total') + ': ' + viewStudentListCount}
                        </span>
                        <DTable
                            config={studentModalConfig}
                            data={viewStudentLists}
                            columns={studentModalColumn}
                            locale={locale}
                        />
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer className="col-12 text-center">
                <button
                    className="btn m-btn--pill btn-outline-metal"
                    onClick={onClose}
                >
                    {t('close').toUpperCase()}
                </button>
            </Modal.Footer>
            {
                loading &&
                <>
                    <div className="blockUI blockOverlay" />
                    <div className="blockUI blockMsg blockPage">
                        <div className="m-loader m-loader--brand m-loader--lg" />
                    </div>
                </>
            }
        </Modal >
    )
}

export default ViewStudent