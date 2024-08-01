import React from 'react'
import { Modal } from 'react-bootstrap'
import CloseIcon from '@mui/icons-material/Close'
import DTable from 'modules/DataTable/DTable'
import secureLocalStorage from 'react-secure-storage'
import { translations } from 'utils/translations'

const locale = secureLocalStorage?.getItem('selectedLang') || 'mn'

const YearModal = ({ onClose, onSubmit, show, data }) => {

    const yearModalConfig = {
        showAllData: true,
        showPagination: false,
        showFilter: false,
        defaultSort: [{
            dataField: 'publishedDate',
            order: 'desc'
        }]
    };

    const yearColumns = [
        {
            dataField: 'isPublish',
            text: translations(locale)?.status,
            align: 'center',
            style: {verticalAlign: 'middle'},
            formatter: cell => <i className='fas fa-circle' style={{color: cell ? '#6dd400' : '#d8d8d8'}}/>
        },
        {
            dataField: 'name',
            text: translations(locale)?.exam?.name,
        },
        {
            dataField: 'createdDate',
            text: translations(locale)?.exam?.date,
        },
        {
            dataField: 'action',
            text: '',
            align: 'center',
            style: {verticalAlign: 'middle'},
            headerStyle: {width: 100},
            formatter: (cell, row) => {
                if (!row?.isPublish) return (
                    <div>
                        <button
                            className='btn btn-primary m-btn--icon btn-sm m-btn--icon-only m-btn--pill mr-2'
                            disabled={journalHasDownloaded}
                            onClick={() => {
                                if (row?.calcCode && row?.calcCode !== 'MANUAL') {
                                    if (row?.calcCode !== 'EXCEL') {
                                        if (row?.calcCode !== 'SEASON_MIX') {
                                            // navigate('/teacher/year/result', {
                                            //     state: {
                                            //         group: row?.groupId,
                                            //         id: row?.id,
                                            //         urlData: {backUrl: '/teacher/year'},
                                            //         season: selectedYearId,
                                            //         title: row.subjectName + ', ' + row.groupName
                                            //     }
                                            // })
                                        } else {
                                            // navigate('/teacher/year/edit', {
                                            //     state: {
                                            //         group: row?.groupId,
                                            //         exam: row?.id,
                                            //         season: selectedYearId,
                                            //         title: row.subjectName + ', ' + row.groupName
                                            //     }
                                            // })
                                        }
                                    } else {
                                        // navigate('/teacher/year/edit', {
                                        //     state: {
                                        //         group: row?.groupId,
                                        //         exam: row?.id,
                                        //         season: selectedYearId,
                                        //         title: row.subjectName + ', ' + row.groupName
                                        //     }
                                        // })
                                    }
                                } else {
                                    // navigate('/teacher/year/edit', {
                                    //     state: {
                                    //         group: row?.groupId,
                                    //         exam: row?.id,
                                    //         season: selectedYearId,
                                    //         title: row.subjectName + ', ' + row.groupName
                                    //     }
                                    // })
                                }
                            }}
                        >
                            <i className='fa flaticon-edit-1'/>
                        </button>
                        <button
                            className='btn btn-danger m-btn--icon btn-sm m-btn--icon-only m-btn--pill'
                            disabled={journalHasDownloaded}
                            onClick={() => handleDeleteButtonClick(row?.id)}
                        >
                            <i className='fa flaticon-delete-1'/>
                        </button>
                    </div>
                )
                else return (
                    <button
                        className='btn btn-secondary m-btn--icon btn-sm m-btn--icon-only m-btn--pill'
                        // onClick={() => 
                        //     navigate('/teacher/year/result', {
                        //     state: {
                        //         id: row?.id,
                        //         urlData: {backUrl: '/teacher/year'}
                        //     }
                        // })}
                    >
                        <i className='fa flaticon-eye text-white'/>
                    </button>
                )
            }
        },
    ];

    return (
        <Modal
            show={show}
            size='md'
            onHide={onClose}
            dimmer='blurring'
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton style={{padding: '1rem'}}>
                <Modal.Title className="modal-title d-flex flex-row justify-content-between w-100">
                    {translations(locale)?.evaluation_final?.name}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body style={{color: '#212529'}}>
                <div style={{color: '#575962', padding: '0rem 1rem'}}>
                    <DTable
                        config={yearModalConfig}
                        data={data}
                        columns={yearColumns}
                        locale={locale}
                    />
                </div>
            </Modal.Body>
        </Modal>
    )
}

export default YearModal