import message from 'modules/message'
import { Modal } from 'semantic-ui-react'
import { Col, Row } from 'react-bootstrap'
// import { managerClubView } from 'Utilities/url'
import React, { useEffect, useState } from 'react'
import CloseIcon from '@mui/icons-material/Close'
import secureLocalStorage from 'react-secure-storage'
import { translations } from 'utils/translations'
// import { fetchRequest } from 'Utilities/fetchRequest'
import * as XLSX from "xlsx";

const view = ({ onClose, group }) => {
    const locale = secureLocalStorage?.getItem('selectedLang') || 'mn'
    const [loading, setLoading] = useState(false)

    const [title, setTitle] = useState('')
    const [students, setStudents] = useState([])
    const [searchKey, setSearchKey] = useState('')
    const [filteredStudents, setFilteredStudents] = useState([])

    // useEffect(() => {
    //     setLoading(true)
    //     fetchRequest(managerClubView, 'POST', { group })
    //         .then((res) => {
    //             if (res.success) {
    //                 const { studentList, title } = res.data
    //                 setStudents(studentList || [])
    //                 setFilteredStudents(studentList || [])
    //                 setTitle(title)
    //             } else {
    //                 message(res.data.message)
    //             }
    //             setLoading(false)
    //         })
    //         .catch(() => {
    //             message(translations(locale)?.err?.error_occurred)
    //             setLoading(false)
    //         })
    // }, [])

    const handleSearch = value => {
        setSearchKey(value)
        const key = value?.toLowerCase()
        if (value) {
            const result = students?.filter(el => {
                return el?.className?.toLowerCase()?.includes(key) ||
                    el?.firstName?.toLowerCase()?.includes(key) ||
                    el?.lastName?.toLowerCase()?.includes(key) ||
                    el?.studentCode?.toLowerCase()?.includes(key)
            })
            setFilteredStudents(result || [])
        } else {
            setFilteredStudents(students || [])
        }
    }

    const exportExcel = (studentList = []) => {
        let records = [];
        let rowIndex = 1;
        for (let record of studentList) {
            const obj = {};
            obj['№'] = rowIndex;
            obj[translations(locale).studentCode] = record?.studentCode;
            obj[translations(locale).gender] = record?.gender;
            obj[translations(locale).studentLastName] = record?.lastName;
            obj[translations(locale).studentFirstName] = record?.firstName;
            obj[translations(locale).group.name] = record?.className;
            records.push(obj)
            rowIndex++;
        }

        let ws = XLSX.utils.json_to_sheet(records);
        let wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "sheet");
        let buf = XLSX.write(wb, { bookType: 'xlsx', type: 'buffer' }); // generate a nodejs buffer
        let str = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' }); // generate a binary string in web browser
        XLSX.writeFile(wb, `${title}.xlsx`);
    }

    return (
        <Modal
            centered
            open={true}
            size='large'
            onClose={onClose}
            dimmer='blurring'
            className='react-modal overflow-modal'
        >
            <div className='header'>
                {title}
                <button type='button' className='close' aria-label='Close' onClick={onClose}>
                    <CloseIcon />
                </button>
            </div>
            <div className='content'>
                <Row className='align-items-center mb-4 ml-1 mr-1'>
                    <Col>
                        <span className='bolder fs-11' style={{ color: '#575962' }}>{`${translations(locale)?.total}: ${students?.length}`}</span>
                    </Col>
                    <Col md={3} style={{
                        display: 'inline-flex'
                    }}>
                        <button
                            style={{
                                height: '33px',
                                width: '33px',
                            }}
                            onClick={() => exportExcel(students)}
                            className='btn m-btn--icon m-btn--icon-only btn-info br-03 mx-1'
                        >
                            <i
                                className="la la-file-excel-o"
                                style={{
                                    fontSize: '22px',
                                    color: '#ffffff',
                                }}
                            />
                        </button>
                        <input
                            value={searchKey}
                            className='form-control br-08'
                            placeholder={translations(locale)?.search}
                            onChange={e => handleSearch(e.target.value)}
                        />
                    </Col>
                </Row>
                <Row className='mx-4'>
                    {
                        filteredStudents?.length > 0
                            ? filteredStudents?.map((student, key) => (
                                <Col key={key} md={3} className='p-2'>
                                    <div className='m-portlet mb-0 m-portlet-rounded br-10'>
                                        <div className='m-portlet__body'>
                                            <div className='text-center my-3'>
                                                <img
                                                    src={student?.avatar || '/images/avatar.png'}
                                                    alt={`photo of ${student?.firstName}`}
                                                    width='100' height='100'
                                                    className='img-circle'
                                                    onError={(e) => {
                                                        e.target.onError = null
                                                        e.target.src = '/images/avatar.png'
                                                    }}
                                                />
                                            </div>
                                            <div className='text-center'>
                                                <span>{student?.studentCode}</span>
                                            </div>
                                            <div className='text-center'>
                                                <span>{student?.lastName}</span>
                                            </div>
                                            <div className='text-center'>
                                                <span className='bolder' style={{ color: '#0275d8' }}>{student?.firstName?.toUpperCase()}</span>
                                            </div>
                                            <div className='text-center'>
                                                <span className='bolder'>{student?.className}</span>
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                            ))
                            : <div className='text-center w-100 p-4' style={{ color: '#575962' }}>{translations(locale)?.emptyStudent}</div>
                    }
                </Row>
            </div>
            <div className='actions modal-footer'>
                <div className='col-12 text-center'>
                    <button
                        className='btn m-btn--pill btn-outline-metal text-uppercase'
                        onClick={onClose}
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
        </Modal >
    )
}

export default view