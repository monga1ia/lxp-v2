import message from 'modules/message'
import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router'
import CustomInlineEdit from 'modules/CustomInlineEdit'
import { Col, Container, Row } from 'react-bootstrap'
import { useTranslation } from "react-i18next";
import { fetchRequest } from 'utils/fetchRequest'
import { NDropdown as Dropdown } from 'widgets/Dropdown'
import { studentBookParent, classParentRemove } from 'utils/fetchRequest/Urls'
import DeleteModal from 'utils/deleteModal'

const ParentsInformation = ({ student }) => {
    const location = useLocation()
    const locale="mn"
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false)
    const studentIndex = useState('class_student_student_id_index')
    const [parents, setParents] = useState([]);

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedParentId, setSelectedParentId] = useState(null);

    const handleSubmit = (name, value) => {
        setLoading(true)
        // fetchRequest(studentBookParent, 'POST', { id: student?.id, column: name, value, type: 'information' })
        //     .then(res => {
        //         if (res.success) {
        //             message(res.data.message, res.success)
        //         } else {
        //             message(res.data.message)
        //         }
        //         setLoading(false)
        //     }
        //     )
        //     .catch(() => {
        //         message(t('err.error_occurred'))
        //         setLoading(false)
        //     })
    }

    useEffect(() => {
        setLoading(true)
        // fetchRequest(studentBookParent, 'POST', { id: student?.id })
        //     .then(res => {
        //         if (res.success) {
        //             const { parents } = res.data
        //             setParents(parents || [])
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

    const showModal = id => {
        setSelectedParentId(id);
        setShowDeleteModal(true);
    };

    const closeModal = () => {
        setSelectedParentId(null);
        setShowDeleteModal(false);
    };

    const handleRemove = () => {
        setLoading(true)
        // fetchRequest(classParentRemove, 'POST', { user: selectedParentId, student: student?.id })
        //     .then(res => {
        //         if (res.success) {
        //             message(res.data.message, res.success)
        //             const { parents } = res.data
        //             setParents(parents || [])
        //             closeModal()
        //         } else {
        //             message(res.data.message)
        //         }
        //         setLoading(false)
        //     })
        //     .catch(() => {
        //         message(t('err.error_occurred'))
        //         setLoading(false)
        //     })
    }

    return (
        <>
            {parents.map((parent, index) => (
                <div key={index}>
                    <div className='d-flex align-items-center justify-content-center ml-4' style={{ width: 245, height: 70, backgroundColor: '#f9b822', zIndex: 1 }}>
                        <span className='text-black fs-12'>
                            {parent?.name}
                        </span>
                    </div>
                    <div className='position-relative p-5' style={{ boxShadow: '0 1px 15px 0 rgba(69, 65, 78, 0.08)', top: '-35px' }}>
                        <div className='d-flex align-items-center justify-content-end'>
                            <button className='btn btn-sm btn-danger m-btn--pill m-btn--uppercase'
                                onClick={() => showModal(parent?.userId)}>
                                {t('remove')}
                            </button>
                        </div>
                        <Container fluid>
                            <Row>
                                <Col md={5} className='d-flex justify-content-center'>
                                    <img width={129} height={129}
                                        className='img-responsive img-circle'
                                        src={parent?.avatar || '/images/avatar.png'}
                                        alt={`Photo of ${parent?.firstName}`}
                                        onError={(e) => {
                                            e.target.onError = null
                                            e.target.src = '/images/avatar.png'
                                        }}
                                    />
                                </Col>
                                <Col md={6}>
                                    <table style={{ color: '#3c3f42' }}>
                                        <tbody>
                                            <tr>
                                                <td className='py-1 pr-5 bolder text-right'>{t('student.relation_type')}</td>
                                                <td className={'py-1 pr-5 bolder'} style={{
                                                    color: 'rgb(255, 91, 29)'
                                                }}>
                                                    {parent?.name}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className='py-1 pr-5 bolder text-right'>{t('studentBook.name')}</td>
                                                <td className={'py-1 pr-5 bolder'} style={{
                                                    color: 'rgb(255, 91, 29)'
                                                }}>
                                                    {parent?.firstName}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className='py-1 pr-5 bolder text-right'>{t('studentBook.parent_name')}</td>
                                                <td className={'py-1 pr-5 bolder'} style={{
                                                    color: 'rgb(255, 91, 29)'
                                                }}>
                                                    {parent?.lastName}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className='py-1 pr-5 bolder text-right'>{t('student.birth_date')}</td>
                                                <td className={'py-1 pr-5 bolder'} style={{
                                                    color: 'rgb(255, 91, 29)'
                                                }}>
                                                    {parent?.birthdate}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className='py-1 pr-5 bolder text-right'>{t('gender')}</td>
                                                <td className={'py-1 pr-5 bolder'} style={{
                                                    color: 'rgb(255, 91, 29)'
                                                }}>
                                                    {parent?.gender === 'M'
                                                        ? t('male')
                                                        : parent?.gender === 'F'
                                                            ? t('female')
                                                        : '-'}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className='py-1 pr-5 bolder text-right'>{t('teacher.phone_number')}</td>
                                                <td className={'py-1 pr-5 bolder'} style={{
                                                    color: 'rgb(255, 91, 29)'
                                                }}>
                                                    {parent?.contact}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className='py-1 pr-5 bolder text-right'>{t('email')}</td>
                                                <td className={'py-1 pr-5 bolder'} style={{
                                                    color: 'rgb(255, 91, 29)'
                                                }}>
                                                    {parent?.email || '-'}
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </Col>
                            </Row>
                        </Container>
                    </div>
                </div>
            ))}

            {
                loading &&
                <>
                    <div className="blockUI blockOverlay" />
                    <div className="blockUI blockMsg blockPage">
                        <div className="m-loader m-loader--brand m-loader--lg" />
                    </div>
                </>
            }

            {showDeleteModal && selectedParentId &&
                <DeleteModal
                    onClose={closeModal}
                    onDelete={handleRemove}
                    locale={locale}
                    title={t('delete')}
                >
                    {t('delete_confirmation')}
                    <br />
                    <br />
                    {t('delete_confirmation_description')}
                </DeleteModal>
            }
        </>
    )
}

export default ParentsInformation