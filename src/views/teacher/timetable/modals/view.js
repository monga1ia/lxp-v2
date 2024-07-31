import React, { useEffect, useState } from 'react'
import { Modal } from 'react-bootstrap'
import { useTranslation } from "react-i18next";
import { translations } from 'utils/translations';
import DTable from 'modules/DataTable/DTable';
import secureLocalStorage from 'react-secure-storage';

const locale = secureLocalStorage?.getItem('selectedLang') || 'mn'

const ViewModal = ({ onClose, selectedTableId }) => {
    
    const { t } = useTranslation();

    const [viewStudentLists, setViewStudentLists]  = useState([])

    // useEffect(() => {
    //     use selectedTableId to pull data
    // })

    const studentModalConfig = {
        showLeftButton: true,
        leftButtonClassName: 'border-0 bg-white',
        leftButtonStyle: {color: '#62646e'},
        excelExport: true,
        showAllData: true,
        showPagination: false,
        showFilter: true,
        defaultSort: [{
            dataField: 'firstName',
            order: 'asc'
        }]
    };

    const studentModalColumn = [
        {
            dataField: "avatar",
            text: translations(locale).photo || "",
            headerStyle: () => ({
                width: 80,
            }),
            formatter: (cell, row) => {
                return <img className='img-responsive img-circle' src={cell || '/images/avatar.png'} width={50}
                            height={50} alt={row.firstName}/>
            },
        },
        {
            dataField: "className",
            text: translations(locale).group.title || "",
            sort: true
        },
        {
            dataField: "studentCode",
            text: translations(locale).student?.student_code || "",
            sort: true,
        },
        {
            dataField: "lastName",
            text: translations(locale).student?.last_name || "",
            sort: true,
        },
        {
            dataField: "firstName",
            text: translations(locale).student?.first_name || "",
            sort: true,
        },
    ];

    return (
        <Modal
            size='xxl'
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
            <Modal.Body style={{color: '#212529'}}>
                <DTable
                    config={studentModalConfig}
                    data={viewStudentLists}
                    columns={studentModalColumn}
                    locale={locale}
                />
            </Modal.Body>
            <Modal.Footer className='text-center'>
                <button
                    className="btn m-btn--pill btn-outline-metal m-btn--uppercase"
                    onClick={onClose}
                >
                    {translations(locale).close || null}
                </button>
            </Modal.Footer>
        </Modal >
    )
}

export default ViewModal