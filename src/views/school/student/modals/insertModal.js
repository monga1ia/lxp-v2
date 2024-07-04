import message from 'modules/message'
import React, {useEffect, useState} from 'react'
import {Col, Row, Modal} from 'react-bootstrap'
import { NDropdown as Dropdown } from 'widgets/NavDropdown';
import CloseIcon from '@mui/icons-material/Close'
import secureLocalStorage from 'react-secure-storage'
import {translations} from 'utils/translations'
import { useTranslation } from 'react-i18next';

import {fetchRequest} from 'utils/fetchRequest'

// import {
//     schoolStudentCreate,
// } from 'utils/url'
import {isValidEmail} from 'utils/Util'

const locale = secureLocalStorage?.getItem('selectedLang') || 'mn'

const insertModal = ({onClose, onSubmit, gradeKey = null}) => {

    const { t } = useTranslation()
    const [loading, setLoading] = useState(false)
    const [selectedClass, setSelectedClass] = useState(false)
    const [classes, setClasses] = useState([{id: "5368", name: "12A", code: "934785", roomNumber: null, isActive: true,}])
    const [students, setStudents] = useState([{id: "1656", studentId: "1656", avatar: null, code: "26582", lastName: "Ганбаатар"}])

    const loadData = (params = {}) => {
        console.log('loadData')
        // setLoading(true)
        // fetchRequest(schoolStudentCreate, 'POST', params)
        //     .then((res) => {
        //         if (res.success) {
        //             if (params?.submit) {
        //                 const clone = [...students]
        //                 if ((res?.data?.successUsers || [])?.length > 0) {
        //                     for (let st = 0; st < clone?.length; st++) {
        //                         if (res?.data?.successUsers?.map(obj => obj?.studentId)?.indexOf(clone[st]?.studentId) > -1) {
        //                             clone[st].disable = true;
        //                         }
        //                     }
        //                 }
        //                 if ((res?.data?.errorUsers || [])?.length > 0) {
        //                     for (let st = 0; st < clone?.length; st++) {
        //                         let errorUserObj = null;
        //                         for (let eU = 0; eU < res?.data?.errorUsers?.length; eU++) {
        //                             if (res?.data?.errorUsers[eU]?.studentId === clone[st]?.studentId) {
        //                                 errorUserObj = res?.data?.errorUsers[eU];
        //                                 break;
        //                             }
        //                         }
        //                         if (errorUserObj) {
        //                             clone[st].error = true;
        //                             clone[st].message = errorUserObj?.message;
        //                         }
        //                     }
        //                     setStudents(clone)
        //                 } else {
        //                     onSubmit()
        //                 }
        //             } else {
        //                 setClasses(res?.data?.classes)
        //                 setStudents(res?.data?.students)
        //             }
        //         } else {
        //             message(res.data.message)
        //         }
        //         setLoading(false)
        //     })
        //     .catch(() => {
        //         message(translations(locale)?.err?.error_occurred)
        //         setLoading(false)
        //     })
    }

    useEffect(() => {
        if (gradeKey && gradeKey?.startsWith('class_')) {
            const classId = gradeKey?.split('class_')[1]
            setSelectedClass(classId);
            loadData({class: classId})
        } else {
            setSelectedClass(null)
            loadData({grade: gradeKey})
        }
    }, [gradeKey])

    const onClassChange = (e, data) => {
        setSelectedClass(data?.value)
        loadData({class: data?.value})
    }

    const onChangeInput = (id = null, value = '', key = '') => {
        const clone = [...students]
        for (let c = 0; c < clone?.length; c++) {
            if (clone[c].id === id) {
                clone[c][key] = value;
                break;
            }
        }
        setStudents(clone)
    }

    return (
        <Modal
            dimmer='blurring'
            show={true}
            size="xl"
            aria-labelledby="contained-modal-title-vcenter"
            onHide={onClose}
            // className='react-modal overflow-modal'
            centered
        >
            <Modal.Header closeButton style={{padding: '1rem'}}>
                <Modal.Title className="modal-title d-flex flex-row justify-content-between w-100">
                    {t('student.create_user')}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="form-group row">
                    <label className="col-5 col-form-label text-right label-pinnacle-bold">
                        {translations(locale).class.title + '*' || ""}
                    </label>
                    <div className="col-4">
                        <Dropdown
                            placeholder={'-' + translations(locale).select + '-' || ""}
                            fluid
                            selection
                            additionPosition='bottom'
                            upward={false}
                            closeOnChange
                            selectOnBlur={false}
                            value={selectedClass}
                            clearable={true}
                            options={classes?.map(classObj => {
                                return {
                                    value: classObj?.id,
                                    text: classObj?.name
                                }
                            })}
                            onChange={onClassChange}
                        />
                    </div>
                </div>

                {
                    students && students?.length > 0 && <div className="form-group row">
                        <Col md={12}>
                            <table className={'table table-striped table-bordered'}>
                                <thead>
                                <tr>
                                    <th>№</th>
                                    <th>{translations(locale).photo}</th>
                                    <th>{translations(locale).studentCode}</th>
                                    <th>{translations(locale).student?.last_name}</th>
                                    <th>{translations(locale).student?.first_name}</th>
                                    <th>{translations(locale).student_email?.title}</th>
                                    <th>{translations(locale).password}</th>
                                </tr>
                                </thead>
                                <tbody>
                                {students?.map((studentObj, i) => {
                                    return <tr key={'student_' + studentObj?.id}>
                                        <td>{i + 1}</td>
                                        <td>
                                            <img
                                                src={studentObj?.avatar || '/img/profile/avatar.png'}
                                                className='m--img-rounded m--marginless m--img-centered menu-profile-img'
                                                onError={(e) => {
                                                    e.target.onError = null
                                                    e.target.src = '/img/profile/avatar.png'
                                                }}
                                                style={{
                                                    width: 70
                                                }}
                                            />
                                        </td>
                                        <td>{studentObj?.code}</td>
                                        <td>{studentObj?.lastName}</td>
                                        <td>{studentObj?.firstName}</td>
                                        <td>
                                            <input
                                                className={studentObj?.error ? 'form-control has-error' : 'form-control'}
                                                disabled={studentObj?.disable || false}
                                                value={studentObj?.username || ''}
                                                onChange={e => {
                                                    onChangeInput(studentObj?.id, e?.target?.value, 'username')
                                                }}
                                            />
                                            {
                                                studentObj?.error && <span>{studentObj?.message}</span>
                                            }
                                        </td>
                                        <td>
                                            <input
                                                className={'form-control'}
                                                value={studentObj?.password || ''}
                                                disabled={studentObj?.disable || false}
                                                onChange={e => {
                                                    onChangeInput(studentObj?.id, e?.target?.value, 'password')
                                                }}
                                            />
                                        </td>
                                    </tr>
                                })}
                                </tbody>
                            </table>
                        </Col>
                    </div>
                }
            </Modal.Body>
            <Modal.Footer>
                <div className='col-12 text-center'>
                    <button
                        className='btn m-btn--pill btn-link m-btn m-btn--custom'
                        onClick={onClose}
                    >
                        {translations(locale)?.back}
                    </button>
                    <button
                        className='btn m-btn--pill btn-success m-btn--wide'
                        onClick={() => {
                            let hasError = false;
                            let hasPasswordError = false;
                            students?.map(studentObj => {
                                if (studentObj?.disable) {
                                    // student already got user & disabled
                                } else {
                                    if (studentObj?.username && studentObj?.username?.length > 0) {
                                        if (!isValidEmail(studentObj?.username)) {
                                            hasError = true;
                                        }
                                        if (!studentObj?.password || studentObj?.password?.trim()?.length < 4) {
                                            hasPasswordError = true;
                                        }
                                    }
                                }
                            })

                            if (hasError) {
                                message(translations(locale)?.err?.invalid_email)
                            } else {
                                const emailStudents = students?.filter(obj => {
                                    return !obj?.disable && obj?.username && obj?.username?.length > 0 && isValidEmail(obj?.username)
                                })

                                if (emailStudents && emailStudents?.length > 0) {
                                    if (hasPasswordError) {
                                        message(translations(locale)?.password_length_error)
                                    } else
                                    {
                                        loadData({
                                            class: selectedClass,
                                            submit: 1,
                                            students: JSON.stringify(emailStudents)
                                        })
                                    }

                                } else {
                                    message(translations(locale)?.insert_email)
                                }
                            }
                        }}
                    >
                        {translations(locale)?.save}
                    </button>
                </div>
            </Modal.Footer>

            {
                loading &&
                <>
                    <div className='blockUI blockOverlay'/>
                    <div className='blockUI blockMsg blockPage'>
                        <div className='m-loader m-loader--brand m-loader--lg'/>
                    </div>
                </>
            }
        </Modal>
    )
}

export default insertModal