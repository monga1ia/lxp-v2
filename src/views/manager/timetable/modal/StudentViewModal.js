import React, { useState, useEffect } from 'react'
import { translations } from 'utils/translations'
import { Modal } from 'semantic-ui-react'
import { Row, Col, Image } from 'react-bootstrap'
import CloseIcon from '@mui/icons-material/Close';

const ViewModal = ({
    onClose,
    students = [],
    title,
    lang = 'mn'
}) => {

    const [studentList, setStudentList] = useState([])
    const [searchKey, setSearchKey] = useState('')

    const onSearch = key => {
        setSearchKey(key)
        if (students) {
            if (key) {
                const search = key.toLocaleLowerCase()
                const tempList = students.filter((data) => {
                    return data.studentCode.toLocaleLowerCase().includes(search) ||
                        data.lastName.toLocaleLowerCase().includes(search) ||
                        data.firstName.toLocaleLowerCase().includes(search)
                })
                setStudentList(tempList)
            } else {
                setStudentList(students)
            }
        }
    }

    const renderCards = () => {
        if (studentList) {
            return studentList.map(student => {
                return (
                    <Col key={student.id} md={3} className='p-2' >
                        <div className='m-portlet br-10 m-0'>
                            <div className='m-portlet__body'>
                                <div className='text-center pb-3'>
                                    <Image
                                        width='100px'
                                        height='100px'
                                        src={
                                            student?.photo
                                                ?
                                                student.photo
                                                : student?.gender === 'F'
                                                    ? '/images/avatar_female.png'
                                                    : student?.gender === 'M'
                                                        ? '/images/avatar_male.png'
                                                        : '/images/image_placeholder.jpg'
                                        }
                                        roundedCircle
                                    />
                                </div>
                                <div className='text-center'>
                                    <span>{student.studentCode}</span>
                                </div>
                                <div className='text-center'>
                                    <span>{student.lastName}</span>
                                </div>
                                <div className='text-center'>
                                    <span className='font-weight-bold text-uppercase' style={{ color: '#0275d8' }}>{student.firstName}</span>
                                </div>
                                <div className='text-center'>
                                    <span className='font-weight-bold' style={{ fontSize: '12px' }}>{student.className}</span>
                                </div>
                            </div>
                        </div>
                    </Col>
                )
            })
        } else {
            return null
        }
    }

    useEffect(() => {
        if (students) {
            setStudentList(students)
        }
    }, [students])

    return (
        <Modal
            size='large'
            dimmer='blurring'
            open={true}
            onClose={onClose}
            centered={true}
            className='react-modal overflow-modal'
        >
            <div className="header">
                {title}
                <button type="button" className="close" aria-label="Close" onClick={onClose} >
                    <CloseIcon />
                </button>
            </div>
            <div className="content">
                <div className='d-flex justify-content-between align-items-center mx-3 mb-4'>
                    <span className='bolder' style={{ fontSize: '16px', color: '#575962' }}>{translations(lang).total + ': ' + studentList.length}</span>
                    <input
                        type='text'
                        className='form-control br-08'
                        placeholder={translations(lang).search}
                        value={searchKey}
                        onChange={e => onSearch(e.target.value)}
                        style={{ width: '200px' }}
                    />
                </div>
                <Row className='px-4'>
                    {renderCards()}
                </Row>
            </div>
            <div className="actions modal-footer">
                <div className="col-12 text-center">
                    <button className="btn m-btn--pill btn-outline-metal text-uppercase" onClick={onClose}>
                        {translations(lang).close}
                    </button>
                </div>
            </div>
        </Modal>
    )
}

export default ViewModal
