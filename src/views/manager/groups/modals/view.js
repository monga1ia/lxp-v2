import { Modal } from 'react-bootstrap'
import React, { useEffect, useState } from 'react'
import CloseIcon from '@mui/icons-material/Close'
import secureLocalStorage from 'react-secure-storage'
import message from "modules/message";
import { useSelector } from 'react-redux'
import DTable from 'modules/DataTable/DTable'
import { useTranslation } from "react-i18next";
import { Row, Col } from 'react-bootstrap'

import { fetchRequest } from 'utils/fetchRequest'
import { managerGroupView } from 'utils/fetchRequest/Urls'

const locale = secureLocalStorage?.getItem('selectedLang') || 'mn'

const ViewStudent = ({ onClose, groupId, title = null }) => {

    const { t } = useTranslation();
    const { selectedSchool } = useSelector(state => state.schoolData);
    const [loading, setLoading] = useState(false)
    const [groupObj, setGroupObj] = useState(null)
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
                    setGroupObj(res?.group)
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
                {
                    groupObj && <Row className='mt-4'>
                        <Col md={4} className='text-right'>
                            <img className='mt-4 img-responsive img-circle'
                                src={groupObj?.teacherAvatar || '/img/profile/avatar.png'}
                                width={100} height={100}
                                alt='img'
                                onError={(e) => {
                                    e.target.onError = null
                                    e.target.src = '/img/profile/avatar.png'
                                }}
                            />
                        </Col>
                        <Col md={8}>
                            <div className="m-form__group row">
                                <label className="col-form-label col-md-4 col-sm-12 text-right pinnacle-regular bolder">
                                    {t('group.type') || null}
                                </label>
                                <div className="col-md-8 col-sm-12 col-form-label " style={{
                                    color: '#ff5b1d'
                                }}>
                                    {
                                        groupObj?.isAll ? t('timetable.class_student') : t('timetable.group_student')
                                    }
                                </div>
                            </div>
                            <div className="m-form__group row">
                                <label className="col-form-label col-md-4 col-sm-12 text-right pinnacle-regular bolder">
                                    {t('grade') || null}
                                </label>
                                <div className="col-md-8 col-sm-12 col-form-label " style={{
                                    color: '#ff5b1d'
                                }}>
                                    {groupObj?.gradeNames?.toString()}
                                </div>
                            </div>
                            <div className="m-form__group row">
                                <label className="col-form-label col-md-4 col-sm-12 text-right pinnacle-regular bolder">
                                    {t('menu.subject') || null}
                                </label>
                                <div className="col-md-8 col-sm-12 col-form-label " style={{
                                    color: '#ff5b1d'
                                }}>
                                    {groupObj?.subjectName}
                                </div>
                            </div>
                            <div className="m-form__group row">
                                <label className="col-form-label col-md-4 col-sm-12 text-right pinnacle-regular bolder">
                                    {t('group.title') || null}
                                </label>
                                <div className="col-md-8 col-sm-12 col-form-label " style={{
                                    color: '#ff5b1d'
                                }}>
                                    {groupObj?.classNames?.toString()}
                                </div>
                            </div>
                            <div className="m-form__group row">
                                <label className="col-form-label col-md-4 col-sm-12 text-right pinnacle-regular bolder">
                                    {t('teacher_title') || null}
                                </label>
                                <div className="col-md-8 col-sm-12 col-form-label " style={{
                                    color: '#ff5b1d'
                                }}>
                                    {groupObj?.teacherFirstName} ({groupObj?.teacherCode} {groupObj?.teacherLastName})
                                </div>
                            </div>
                            <div className="m-form__group row">
                                <label className="col-form-label col-md-4 col-sm-12 text-right pinnacle-regular bolder">
                                    GoogleClassroom
                                </label>
                                <div className="col-md-8 col-sm-12 col-form-label " style={{
                                    color: '#ff5b1d'
                                }}>
                                    {
                                        groupObj?.classRoomLink
                                            ?
                                            <a href={groupObj?.classRoomLink} target='_blank'>{groupObj?.classRoomLink}</a>
                                            :
                                            '-'
                                    }
                                </div>
                            </div>
                        </Col>
                    </Row>
                }
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