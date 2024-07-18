
import PersonalInformation from './personalInformation'
import Grade from './grade'
import Activity from './activity'
import ClubCount from './club'
import Payment from './payment'
import Others from './others'
import Sale from './sale'
import message from 'modules/message'
import SubHeader from 'modules/SubHeader'
import {cloneDeep} from 'lodash'
import { Tab } from 'semantic-ui-react'
import React, { useEffect, useState } from 'react'
import secureLocalStorage from 'react-secure-storage'
import { Col, Container, Row } from 'react-bootstrap'
import { fetchRequest } from 'utils/fetchRequest'
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from 'react-router'
import { NDropdown as Dropdown } from 'widgets/Dropdown'
import { studentBookIndex, classStudentStudentBookEdit } from 'utils/fetchRequest/Urls'

const index = () => {
    const locale="mn"
    const { t } = useTranslation();
    const location = useLocation();
    const navigate = useNavigate();
    

    // const locale = secureLocalStorage?.getItem('selectedLang') || 'mn'
    const [loading, setLoading] = useState(false)
    const [studentId, setStudentId] = useState(location?.state?.id)
    const [student, setStudent] = useState(null)
    const [studentTypeOptions, setStudentTypeOptions] = useState([])

    const [updateView, setUpdateView] = useState(false)
    const [urlData] = useState(location?.state?.urlData || null)

    useEffect(() => {
        if (!studentId) {
            message(t('timetable.select_students'))
            navigate(urlData ? urlData.backUrl : '/class/student', { replace: true })
        }
        loadData()
    }, [studentId])

    const loadData = () => {
        setLoading(true)
        // fetchRequest(studentBookIndex, 'POST', { id: studentId })
        //     .then(res => {
        //         if (res.success) {
        //             const { status, type } = res.data
        //             setStudent(status || {})
        //             setStudentTypeOptions(type || [])
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

    useEffect(() => {
        // loadData()
    }, [])

    const handleChange = value => {
        setLoading(true)
        // fetchRequest(classStudentStudentBookEdit, 'POST', { column: 'type', value, id: studentId, type: 'information' })
        //     .then(res => {
        //         message(res.data.message, res.success)

        //         const clone = cloneDeep(student)
        //         clone.studentTypeId = value
        //         setStudent(clone)

        //         setUpdateView(prev => !prev)
        //         setLoading(false)
        //     })
        //     .catch(() => {
        //         message(t('err.error_occurred'))
        //         setLoading(false)
        //     })
    }

    return (
        <div className="m-grid__item m-grid__item--fluid mt-3 mx-4">
            <SubHeader
                locale={locale}
                title={t('student.book')}
                secondaryTitle={student?.studentCode + '-' + student?.firstName}
                additional={<button className='btn btn-link' onClick={() => navigate(urlData ? urlData.backUrl : '/class/student', { replace: true })}>
                    {t('back_to_list')}
                </button>}
            />
            <div className='m-portlet mt-3 mb-4'>
                <div className='m-portlet__body'>
                    <Container fluid>
                        <Row className='bolder'>
                            <Col lg={3} className='d-flex justify-content-center align-items-center'>
                                <img width={129} height={129}
                                    className='img-responsive img-circle'
                                    src={student?.avatar || '/images/avatar.png'}
                                    alt={`Photo of ${student?.firstName}`}
                                    onError={(e) => {
                                        e.target.onError = null
                                        e.target.src = '/images/avatar.png'
                                    }}
                                />
                            </Col>
                            <Col lg={3}>
                                <table style={{ color: '#4a4a4a' }}>
                                    <tbody>
                                        <tr>
                                            <td className='py-1 pr-5 bolder'>{t('student.family_name')}</td>
                                            <td style={{ color: '#ff5b1d' }}>{student?.familyName || '-'}</td>
                                        </tr>
                                        <tr>
                                            <td className='py-1 pr-5 bolder'>{t('movement.last_name')}</td>
                                            <td style={{ color: '#ff5b1d' }}>{student?.lastName || '-'}</td>
                                        </tr>
                                        <tr>
                                            <td className='py-1 pr-5 bolder'>{t('studentBook.name')}</td>
                                            <td style={{ color: '#ff5b1d' }}>{student?.firstName || '-'}</td>
                                        </tr>
                                        <tr>
                                            <td className='py-1 pr-5 bolder'>{t('student.birth_date')}</td>
                                            <td style={{ color: '#ff5b1d' }}>{student?.birthDate || '-'}</td>
                                        </tr>
                                        <tr>
                                            <td className='py-1 pr-5 bolder'>{t('gender')}</td>
                                            <td style={{ color: '#ff5b1d' }}>{student?.gender?.toLowerCase() == 'm' ? t(locale)?.male : (student?.gender?.toLowerCase() == 'f' ? t('female') : '-')}</td>
                                        </tr>
                                        <tr>
                                            <td className='py-1 pr-5 bolder'>{t('register_number')}</td>
                                            <td style={{ color: '#ff5b1d' }}>{student?.register || '-'}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </Col>
                            <Col lg={3}>
                                <table style={{ color: '#4a4a4a' }}>
                                    <tbody>
                                        <tr>
                                            <td className='py-1 pr-5 bolder'>{t('student.entry_date')}</td>
                                            <td style={{ color: '#ff5b1d' }}>{student?.startDate || '-'}</td>
                                        </tr>
                                        <tr>
                                            <td className='py-1 pr-5 bolder'>{t('student.current_class')}</td>
                                            <td style={{ color: '#ff5b1d' }}>{student?.className || '-'}</td>
                                        </tr>
                                        <tr>
                                            <td className='py-1 pr-5 bolder'>{t('student.status')}</td>
                                            <td style={{ color: '#ff5b1d' }}>{student?.statusName || '-'}</td>
                                        </tr>
                                        <tr>
                                            <td className='py-1 pr-5 bolder'>{t('movement.from_school_name')}</td>
                                            <td style={{ color: '#ff5b1d' }}>{student?.fromSchoolName || '-'}</td>
                                        </tr>
                                        <tr>
                                            <td className='py-1 pr-5 bolder'>{t('status')}</td>
                                            <td style={{ color: '#ff5b1d' }}>
                                                <Dropdown
                                                    simple
                                                    fluid
                                                    className='d-flex no-wrap'
                                                    value={student?.studentTypeId}
                                                    options={studentTypeOptions}
                                                    onChange={(e, data) => handleChange(data?.value)}
                                                />
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </Col>
                        </Row>
                    </Container>
                </div>
            </div>
            <div className='m-portlet tab'>
                {
                    student &&
                    <Tab
                        renderActiveOnly
                        menu={{ secondary: true, pointing: true, className: 'primaryColor m-0 h-4' }}
                        panes={[
                            {
                                menuItem: t('studentBookNavs.personal_info'),
                                render: () => <PersonalInformation student={student} refresh={() => setUpdateView(prev => !prev)} />,
                            },
                            {
                                menuItem: t('studentBookNavs.grade'),
                                render: () => <Grade student={student} />,
                            },
                            {
                                menuItem: t('studentBook.activity'),
                                render: () => <Activity student={student} />
                            },
                            {
                                menuItem: t('club.title'),
                                render: () => <ClubCount student={student} />,
                            },
                            {
                                menuItem: t('finance.invoice'),
                                render: () => <Payment student={student} />,
                            },
                            {
                                menuItem: t('studentBookNavs.food'),
                                render: () => <Sale student={student} saleTypeCode={'FOOD'}/>,
                            },
                            {
                                menuItem: t('studentBookNavs.bus'),
                                render: () => <Sale student={student} saleTypeCode={'BUS'} />,
                            },
                            // {
                            //     menuItem: translations(locale)?.studentBookNavs?.others,
                            //     render: () => <Others id={student?.id} />,
                            // }
                        ]}
                    />
                }
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
        </div>
    )
}

export default index