import message from 'modules/message'
import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router'
import CustomInlineEdit from 'modules/CustomInlineEdit'
import { Col, Container, Row } from 'react-bootstrap'
import { useTranslation } from "react-i18next";
import { fetchRequest } from 'utils/fetchRequest'
import { NDropdown as Dropdown } from 'widgets/Dropdown'
import { classStudentStudentBookEdit } from 'utils/fetchRequest/Urls'

const selfInformation = ({ student, refresh }) => {
    const location = useLocation()

    const locale = "mn"
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false)

    const handleSubmit = (name, value) => {
        // setLoading(true)
        // fetchRequest(classStudentStudentBookEdit, 'POST', { column: name, value, id: student?.id, type: 'information' })
        //     .then(res => {
        //         if (res.success) {
        //             message(res.data.message, res.success)
        //             refresh()
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
            <div className='d-flex'>
                <span className='text-primary pinnacle-regular bolder fs-10'>
                    {t('studentBookNavs.student_info')}
                </span>
            </div>
            <div className='br-08 position-relative p-5 mt-2' style={{ border: '1px solid rgba(255, 91, 29, 0.1)' }}>
                <Container fluid className='pt-5'>
                    <Row>
                        <Col md={'auto'} className='d-flex'>
                            <img width={120} height={120}
                                className='img-responsive img-circle'
                                src={student?.avatar || '/img/profile/avatar.png'}
                                alt={`Photo of ${student?.firstName}`}
                                onError={(e) => {
                                    e.target.onError = null
                                    e.target.src = '/img/profile/avatar.png'
                                }}
                            />
                            <table style={{ color: '#3c3f42', marginLeft: 70 }}>
                                <tbody>
                                    <tr>
                                        <td className='py-1 pr-5 text-right bolder'>{t('student.family_name')}</td>
                                        <td>
                                            <CustomInlineEdit
                                                value={student?.familyName}
                                                onSaveClick={text => handleSubmit('familyName', text)}
                                                buttons={true}
                                                saveButtonClassName="schoolLogoInlineEditButton"
                                                discardButtonClassName="schoolLogoInlineEditButton"
                                                labelClassName="underline"
                                                wrapperClassName="d-flex"
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className='py-1 pr-5 text-right bolder'>{t('movement.last_name')}</td>
                                        <td>
                                            <CustomInlineEdit
                                                value={student?.lastName}
                                                onSaveClick={text => handleSubmit('lastName', text)}
                                                buttons={true}
                                                saveButtonClassName="schoolLogoInlineEditButton"
                                                discardButtonClassName="schoolLogoInlineEditButton"
                                                labelClassName="underline"
                                                wrapperClassName="d-flex"
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className='py-1 pr-5 text-right bolder'>{t('studentBook.name')}</td>
                                        <td>
                                            <CustomInlineEdit
                                                value={student?.firstName}
                                                onSaveClick={text => handleSubmit('firstName', text)}
                                                buttons={true}
                                                saveButtonClassName="schoolLogoInlineEditButton"
                                                discardButtonClassName="schoolLogoInlineEditButton"
                                                labelClassName="underline"
                                                wrapperClassName="d-flex"
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className='py-1 pr-5 text-right bolder'>{t('student.birth_date')}</td>
                                        <td>
                                            <CustomInlineEdit
                                                value={student?.birthDate}
                                                onSaveClick={text => handleSubmit('birthDate', text)}
                                                buttons={true}
                                                saveButtonClassName="schoolLogoInlineEditButton"
                                                discardButtonClassName="schoolLogoInlineEditButton"
                                                labelClassName="underline"
                                                wrapperClassName="d-flex"
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className='py-1 pr-5 text-right bolder'>{t('gender')}</td>
                                        <td>
                                            <Dropdown
                                                simple
                                                value={student?.gender}
                                                onChange={(e, data) => handleSubmit('gender', data?.value)}
                                                options={[
                                                    {
                                                        value: 'M',
                                                        text: t('male'),
                                                    },
                                                    {
                                                        value: 'F',
                                                        text: t('female'),
                                                    }
                                                ]}
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className='py-1 pr-5 text-right bolder'>{t('register_number')}</td>
                                        <td>
                                            <CustomInlineEdit
                                                value={student?.register}
                                                onSaveClick={text => {
                                                    handleSubmit('register', text)
                                                }}
                                                buttons={true}
                                                saveButtonClassName="schoolLogoInlineEditButton"
                                                discardButtonClassName="schoolLogoInlineEditButton"
                                                labelClassName="underline"
                                                wrapperClassName="d-flex"
                                            />
                                        </td>
                                    </tr>
                                    {/* <tr>
                                        <td className='py-1 pr-5 bolder'>{t('studentBook.ethnicity')}</td>
                                        <td>
                                            <CustomInlineEdit
                                                value={student?.ethnicity}
                                                onSaveClick={text => handleSubmit('ethnicity', text)}
                                                buttons={true}
                                                saveButtonClassName="schoolLogoInlineEditButton"
                                                discardButtonClassName="schoolLogoInlineEditButton"
                                                labelClassName="underline"
                                                wrapperClassName="d-flex"
                                            />
                                        </td>
                                    </tr> */}
                                    <tr>
                                        <td className='py-1 pr-5 text-right bolder'>{t('studentBook.birthCertNumber')}</td>
                                        <td>
                                            <CustomInlineEdit
                                                value={student?.birthCert}
                                                onSaveClick={text => handleSubmit('birthCert', text)}
                                                buttons={true}
                                                saveButtonClassName="schoolLogoInlineEditButton"
                                                discardButtonClassName="schoolLogoInlineEditButton"
                                                labelClassName="underline"
                                                wrapperClassName="d-flex"
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className='py-1 pr-5 text-right bolder'>{t('studentBook.healthInsuranceNumber')}</td>
                                        <td>
                                            <CustomInlineEdit
                                                value={student?.health}
                                                onSaveClick={text => handleSubmit('health', text)}
                                                buttons={true}
                                                saveButtonClassName="schoolLogoInlineEditButton"
                                                discardButtonClassName="schoolLogoInlineEditButton"
                                                labelClassName="underline"
                                                wrapperClassName="d-flex"
                                            />
                                        </td>
                                    </tr>
                                    {/* <tr>
                                        <td className='py-1 pr-5 bolder'>{t('studentBook.birth_place')}</td>
                                        <td>
                                            <CustomInlineEdit
                                                value={student?.birthPlace}
                                                onSaveClick={text => handleSubmit('birthPlace', text)}
                                                buttons={true}
                                                saveButtonClassName="schoolLogoInlineEditButton"
                                                discardButtonClassName="schoolLogoInlineEditButton"
                                                labelClassName="underline"
                                                wrapperClassName="d-flex"
                                            />
                                        </td>
                                    </tr> */}
                                </tbody>
                            </table>
                        </Col>
                    </Row>
                </Container>
            </div>
            {
                loading &&
                <>
                    <div className="blockUI blockOverlay" />
                    <div className="blockUI blockMsg blockPage">
                        <div className="m-loader m-loader--brand m-loader--lg" />
                    </div>
                </>
            }
        </>
    )
}

export default selfInformation