import { Modal } from 'react-bootstrap'
import React, { useEffect, useState } from 'react'
import CloseIcon from '@mui/icons-material/Close'
import secureLocalStorage from 'react-secure-storage'
import message from "modules/message";
import { useSelector } from 'react-redux'
import DTable from 'modules/DataTable/DTable'
import { useTranslation } from "react-i18next";

import { fetchRequest } from 'utils/fetchRequest'
import { managerGroupView } from 'utils/fetchRequest/Urls'

const locale = secureLocalStorage?.getItem('selectedLang') || 'mn'

const ViewStudent = ({ onClose, groupId, title = null }) => {

    const { t } = useTranslation();
    const { selectedSchool } = useSelector(state => state.schoolData);
    const [loading, setLoading] = useState(false)
    const [studentList, setStudentLists] = useState([])

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

    const loadData = (groupId = null) => {
        const params = {
            school: selectedSchool?.id,
            group: groupId
        }
        setLoading(true)
        fetchRequest(managerGroupView, 'POST', params)
            .then((res) => {
                if (res.success) {
                    setStudentLists(res?.students)
                } else {
                    message(res.message)
                }
                setLoading(false)
            })
            .catch((e) => {
                message(t('err.error_occurred'))
                setLoading(false)
            })
    };


    useEffect(() => {
        loadData(groupId)
    }, [groupId])

    return (
        <Modal
            size='lg'
            dimmer='blurring'
            show={true}
            onHide={onClose}
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton style={{ padding: '1rem' }}>
                <Modal.Title className="modal-title d-flex flex-row justify-content-between w-100">
                    {title || t('action.view')}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className='pt-0'>
                <div className="myToday-group-student-modal-style">
                    <div>
                        <span style={{ position: 'relative', top: 45, left: 2, color: '#575962', fontSize: 14 }} >
                            {t('total') + ': ' + studentList?.length}
                        </span>
                        <DTable
                            config={studentModalConfig}
                            data={studentList}
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
                    <div className="blockUI blockOverlay">
                        <div className="blockUI blockMsg blockPage">
                            <div className="m-loader m-loader--brand m-loader--lg" />
                        </div>
                    </div>
                </>
            }
        </Modal >
    )
}

export default ViewStudent