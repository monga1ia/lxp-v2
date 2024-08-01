import React from 'react'
import { Modal } from 'react-bootstrap'
import CloseIcon from '@mui/icons-material/Close'
import DTable from 'modules/DataTable/DTable'
import secureLocalStorage from 'react-secure-storage'
import { translations } from 'utils/translations'

const locale = secureLocalStorage?.getItem('selectedLang') || 'mn'

const StudentModal = ({ onClose, onSubmit, show, group }) => {

    const studentModalConfig = {
        showAllData: true,
        showPagination: false,
        showFilter: true,
        excelExport: true,
        defaultSort: [{
            dataField: 'firstName',
            order: 'asc'
        }]
    };

    
    const studentColumns = [
        {
            dataField: "avatar",
            text: translations(locale).photo || "",
            align: 'center',
            headerStyle: () => ({
                width: 80,
            }),
            formatter: (cell, row) => {
                return <img className='img-responsive img-circle' src={cell || '/img/profile/avatar.png'} width={40}
                            height={40} alt={row.firstName}
                            onError={(e) => {
                                e.target.onError = null
                                e.target.src = '/img/profile/avatar.png'
                            }}
                />
            }
        },
        {
            dataField: "className",
            text: translations(locale).group.title || "",
            sort: true
        },
        {
            dataField: "studentCode",
            text: translations(locale).studentCode || "",
            sort: true,
        },
        {
            dataField: "lastName",
            text: translations(locale).studentLastName || "",
            sort: true,
        },
        {
            dataField: "firstName",
            text: translations(locale).studentFirstName || "",
            sort: true,
        },
    ];

    return (
        <Modal
            show={show}
            size='xxl'
            onHide={onClose}
            dimmer='blurring'
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton style={{padding: '1rem'}}>
                <Modal.Title className="modal-title d-flex flex-row justify-content-between w-100">
                    {translations(locale)?.students}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body style={{color: '#212529'}}>
                <div style={{color: '#575962', padding: '0rem 1rem'}}>
                    <span>{group.subjectName}</span>
                    <span className='d-block bolder'>{group.groupName}</span>
                    <span className='d-block' style={{textDecoration: 'underline'}}>
                        {
                            group.classes && group.classes.length > 0 && group.classes.map((x, i) =>
                                group.classes.length - 1 != i ? x + ', ' : x
                            )
                        }
                    </span>
                    <span>{translations(locale).total}: {group.students.length}</span>
                    <DTable
                        config={{
                            ...studentModalConfig,
                            excelFileName: `${secureLocalStorage.getItem('selectedSchool')?.text}-${group.groupName}-${translations(locale)?.students}`
                        }}
                        data={group.students}
                        columns={studentColumns}
                        locale={locale}
                    />
                </div>
            </Modal.Body>
        </Modal>
    )
}

export default StudentModal