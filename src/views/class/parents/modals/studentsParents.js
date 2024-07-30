import React, {useEffect, useState} from 'react'
import message from 'modules/message'
import {Modal} from 'semantic-ui-react'
import {classParentInfo} from 'utils/fetchRequest/Urls'
import CloseIcon from '@mui/icons-material/Close'
import secureLocalStorage from 'react-secure-storage'
import {Col, Container, Row} from 'react-bootstrap'
import {translations} from 'utils/translations'
import {fetchRequest} from 'utils/fetchRequest'
import {secondFormat} from "utils/Util";

const studentsParents = ({onClose, studentId, parentId, lastUsed, usageTime}) => {
    const locale = secureLocalStorage?.getItem('selectedLang') || 'mn'
    const [loading, setLoading] = useState(false)

    const [personId, setPersonId] = useState(parentId)

    const [student, setStudent] = useState({})
    const [person, setPerson] = useState({})
    const [members, setMembers] = useState([])

    useEffect(() => {
        // setLoading(true)
        // fetchRequest(classParentInfo, 'POST', {personId, studentId})
        //     .then(res => {
        //         if (res.success) {
        //             const {person, student, members} = res.data
        //             setStudent(student || {})
        //             setPerson(person || {})
        //             setMembers(members || [])
        //         } else {
        //             message(res.data.message)
        //         }
        //         setLoading(false)
        //     })
        //     .catch(() => {
        //         message(translations(locale)?.err?.error_occurred)
        //         setLoading(false)
        //     })
    }, [personId, studentId])

    return (
        <Modal
            dimmer='blurring'
            show={true}
            size="xl"
            aria-labelledby="contained-modal-title-vcenter"
            onHide={() => onClose()}
            centered
        >
            <Modal.Header closeButton style={{ padding: '1rem' }}>
                <Modal.Title className="modal-title d-flex flex-row justify-content-between w-100">
                    {translations(locale)?.student?.relation}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                     <Container fluid>
                     <Row>
                         <Col className='text-center'>
                             <img width={150} height={150} className='img-responsive img-circle'
                                 src={person?.avatar || '/images/avatar.png'} alt={`Photo of ${person?.firstName}`}
                                 onError={(e) => {
                                     e.target.onError = null
                                     e.target.src = '/images/avatar.png'
                                 }}
                            />
                        </Col>
                        <Col className='d-flex'>
                            <table>
                                <tbody>
                                <tr>
                                    <td className='text-right pr-3'
                                        style={{color: '#868aa8'}}>{translations(locale)?.last_name}</td>
                                    <td className='bolder' style={{color: '#575962'}}>{person?.lastName || '-'}</td>
                                </tr>
                                <tr>
                                    <td className='text-right pr-3'
                                        style={{color: '#868aa8'}}>{translations(locale)?.first_name}</td>
                                    <td className='bolder' style={{color: '#575962'}}>{person?.firstName || '-'}</td>
                                </tr>
                                <tr>
                                    <td className='text-right pr-3'
                                        style={{color: '#868aa8'}}>{translations(locale)?.student?.relation_type}</td>
                                    <td className='bolder'
                                        style={{color: '#575962'}}>{person?.relationTypeName || '-'}</td>
                                </tr>
                                <tr>
                                    <td className='text-right pr-3'
                                        style={{color: '#868aa8'}}>{translations(locale)?.student?.gender}</td>
                                    <td className='bolder'
                                        style={{color: '#575962'}}>{person?.gender?.toLowerCase() == 'm' ? translations(locale)?.male : (person?.gender?.toLowerCase() == 'f' ? translations(locale)?.female : '-')}</td>
                                </tr>
                                <tr>
                                    <td className='text-right pr-3'
                                        style={{color: '#868aa8'}}>{translations(locale)?.phoneNumber}</td>
                                    <td className='bolder' style={{color: '#575962'}}>{person?.contact || '-'}</td>
                                </tr>
                                <tr>
                                    <td className='text-right pr-3'
                                        style={{color: '#868aa8'}}>{translations(locale)?.studentBook?.birth_day}</td>
                                    <td className='bolder' style={{color: '#575962'}}>{person?.birthdate || '-'}</td>
                                </tr>
                                </tbody>
                            </table>
                        </Col>
                        <Col className='d-flex'>
                            <table>
                                <tbody>
                                <tr>
                                    <td className='text-right pr-3'
                                        style={{color: '#868aa8'}}>{translations(locale)?.email}</td>
                                    <td className='bolder' style={{color: '#575962'}}>{person?.email || '-'}</td>
                                </tr>
                                <tr>
                                    <td className='text-right pr-3'
                                        style={{color: '#868aa8'}}>{translations(locale)?.student?.usage_time}</td>
                                    <td className='bolder'
                                        style={{color: '#575962'}}>{secondFormat(usageTime) || '-'}</td>
                                </tr>
                                <tr>
                                    <td className='text-right pr-3'
                                        style={{color: '#868aa8'}}>{translations(locale)?.student?.last_login}</td>
                                    <td className='bolder' style={{color: '#575962'}}>{lastUsed || '-'}</td>
                                </tr>
                                <tr>
                                    <td className='text-right pr-3'
                                        style={{color: '#868aa8'}}>&nbsp;</td>
                                    <td className='bolder' style={{color: '#575962'}}/>
                                </tr>
                                <tr>
                                    <td className='text-right pr-3'
                                        style={{color: '#868aa8'}}>&nbsp;</td>
                                    <td className='bolder' style={{color: '#575962'}}/>
                                </tr>
                                <tr>
                                    <td className='text-right pr-3'
                                        style={{color: '#868aa8'}}>&nbsp;</td>
                                    <td className='bolder' style={{color: '#575962'}}/>
                                </tr>
                                </tbody>
                            </table>
                        </Col>
                    </Row>
                </Container>
                <h6 className='pinnacle-bold mb-3 mt-5 ml-4'
                    style={{color: '#ff5b1d'}}>{translations(locale)?.student?.student_information}</h6>
                <Row>
                    <Col md={6}>
                        <div className='m-portlet'>
                            <div className='m-portlet__body'>
                                <Row>
                                    <Col md={4} className='d-flex align-items-center justify-content-center'>
                                        <img width={100} height={100} className='img-responsive img-circle'
                                             src={student?.avatar || '/images/avatar.png'}
                                             alt={`Photo of ${student?.firstName}`}
                                             onError={(e) => {
                                                 e.target.onError = null
                                                 e.target.src = '/images/avatar.png'
                                             }}
                                        />
                                    </Col>
                                    <Col className='d-flex'>
                                        <table>
                                            <tbody>
                                            <tr>
                                                <td className='text-right pr-3'
                                                    style={{color: '#868aa8'}}>{translations(locale)?.studentBook?.class_name}</td>
                                                <td className='bolder'
                                                    style={{color: '#575962'}}>{student?.className || '-'}</td>
                                            </tr>
                                            <tr>
                                                <td className='text-right pr-3'
                                                    style={{color: '#868aa8'}}>{translations(locale)?.student?.student_code}</td>
                                                <td className='bolder'
                                                    style={{color: '#575962'}}>{student?.studentCode || '-'}</td>
                                            </tr>
                                            <tr>
                                                <td className='text-right pr-3'
                                                    style={{color: '#868aa8'}}>{translations(locale)?.student?.last_name}</td>
                                                <td className='bolder'
                                                    style={{color: '#575962'}}>{student?.lastName || '-'}</td>
                                            </tr>
                                            <tr>
                                                <td className='text-right pr-3'
                                                    style={{color: '#868aa8'}}>{translations(locale)?.student?.first_name}</td>
                                                <td className='bolder'
                                                    style={{color: '#575962'}}>{student?.firstName || '-'}</td>
                                            </tr>
                                            </tbody>
                                        </table>
                                    </Col>
                                </Row>
                            </div>
                        </div>
                    </Col>
                </Row>
                {
                    members?.length > 0 &&
                    <h6 className='pinnacle-bold mb-3 mt-4 ml-4'
                        style={{color: '#ff5b1d'}}>{translations(locale)?.student?.relation_other}</h6>
                }
                <Row>
                    {
                        members?.map((member, index) => (
                            <Col md={6} key={index}>
                                <div className='m-portlet'>
                                    <div className='m-portlet__body'>
                                        <Row>
                                            <Col md={4} className='d-flex align-items-center justify-content-center'>
                                                <img width={100} height={100} className='img-responsive img-circle'
                                                     src={member?.avatar || '/images/avatar.png'}
                                                     alt={`Photo of ${member?.firstName}`}
                                                     onError={(e) => {
                                                         e.target.onError = null
                                                         e.target.src = '/images/avatar.png'
                                                     }}
                                                />
                                            </Col>
                                            <Col className='d-flex'>
                                                <table>
                                                    <tbody>
                                                    <tr>
                                                        <td className='text-right pr-3'
                                                            style={{color: '#868aa8'}}>{translations(locale)?.student?.relation_type}</td>
                                                        <td className='bolder'
                                                            style={{color: '#575962'}}>{member?.relationTypeName || '-'}</td>
                                                    </tr>
                                                    <tr>
                                                        <td className='text-right pr-3'
                                                            style={{color: '#868aa8'}}>{translations(locale)?.phoneNumber}</td>
                                                        <td className='bolder'
                                                            style={{color: '#575962'}}>{member?.contact || '-'}</td>
                                                    </tr>
                                                    <tr>
                                                        <td className='text-right pr-3'
                                                            style={{color: '#868aa8'}}>{translations(locale)?.last_name}</td>
                                                        <td className='bolder'
                                                            style={{color: '#575962'}}>{member?.lastName || '-'}</td>
                                                    </tr>
                                                    <tr>
                                                        <td className='text-right pr-3'
                                                            style={{color: '#868aa8'}}>{translations(locale)?.first_name}</td>
                                                        <td className='bolder' style={{color: '#575962'}}>
                                                                <span className='underline'
                                                                      onClick={() => setPersonId(member?.personId)}>
                                                                    {member?.firstName || '-'}
                                                                </span>
                                                        </td>
                                                    </tr>
                                                    </tbody>
                                                </table>
                                            </Col>
                                        </Row>
                                    </div>
                                </div>
                            </Col>
                        ))
                    }
                </Row>
            {/* </div> */}
            </Modal.Body>
            <Modal.Footer className="text-center">
                    <button
                        onClick={onClose}
                        className="btn btn-outline-metal m-btn--pill"
                    >
                        {translations(locale)?.close}
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
        </Modal>
        // <Modal
        //     centered
        //     open={true}
        //     size='large'
        //     onClose={onClose}
        //     dimmer='blurring'
        //     className="react-modal overflow-modal"
        // >
        //     <div className="header">
        //         {translations(locale)?.student?.relation}
        //         <button type="button" className="close" aria-label="Close" onClick={onClose}>
        //             <CloseIcon/>
        //         </button>
        //     </div>
        //     <div className="content">
        //         <Container fluid>
        //             <Row>
        //                 <Col className='text-center'>
        //                     <img width={150} height={150} className='img-responsive img-circle'
        //                          src={person?.avatar || '/images/avatar.png'} alt={`Photo of ${person?.firstName}`}
        //                          onError={(e) => {
        //                              e.target.onError = null
        //                              e.target.src = '/images/avatar.png'
        //                          }}
        //                     />
        //                 </Col>
        //                 <Col className='d-flex'>
        //                     <table>
        //                         <tbody>
        //                         <tr>
        //                             <td className='text-right pr-3'
        //                                 style={{color: '#868aa8'}}>{translations(locale)?.last_name}</td>
        //                             <td className='bolder' style={{color: '#575962'}}>{person?.lastName || '-'}</td>
        //                         </tr>
        //                         <tr>
        //                             <td className='text-right pr-3'
        //                                 style={{color: '#868aa8'}}>{translations(locale)?.first_name}</td>
        //                             <td className='bolder' style={{color: '#575962'}}>{person?.firstName || '-'}</td>
        //                         </tr>
        //                         <tr>
        //                             <td className='text-right pr-3'
        //                                 style={{color: '#868aa8'}}>{translations(locale)?.student?.relation_type}</td>
        //                             <td className='bolder'
        //                                 style={{color: '#575962'}}>{person?.relationTypeName || '-'}</td>
        //                         </tr>
        //                         <tr>
        //                             <td className='text-right pr-3'
        //                                 style={{color: '#868aa8'}}>{translations(locale)?.student?.gender}</td>
        //                             <td className='bolder'
        //                                 style={{color: '#575962'}}>{person?.gender?.toLowerCase() == 'm' ? translations(locale)?.male : (person?.gender?.toLowerCase() == 'f' ? translations(locale)?.female : '-')}</td>
        //                         </tr>
        //                         <tr>
        //                             <td className='text-right pr-3'
        //                                 style={{color: '#868aa8'}}>{translations(locale)?.phoneNumber}</td>
        //                             <td className='bolder' style={{color: '#575962'}}>{person?.contact || '-'}</td>
        //                         </tr>
        //                         <tr>
        //                             <td className='text-right pr-3'
        //                                 style={{color: '#868aa8'}}>{translations(locale)?.studentBook?.birth_day}</td>
        //                             <td className='bolder' style={{color: '#575962'}}>{person?.birthdate || '-'}</td>
        //                         </tr>
        //                         </tbody>
        //                     </table>
        //                 </Col>
        //                 <Col className='d-flex'>
        //                     <table>
        //                         <tbody>
        //                         <tr>
        //                             <td className='text-right pr-3'
        //                                 style={{color: '#868aa8'}}>{translations(locale)?.email}</td>
        //                             <td className='bolder' style={{color: '#575962'}}>{person?.email || '-'}</td>
        //                         </tr>
        //                         <tr>
        //                             <td className='text-right pr-3'
        //                                 style={{color: '#868aa8'}}>{translations(locale)?.student?.usage_time}</td>
        //                             <td className='bolder'
        //                                 style={{color: '#575962'}}>{secondFormat(usageTime) || '-'}</td>
        //                         </tr>
        //                         <tr>
        //                             <td className='text-right pr-3'
        //                                 style={{color: '#868aa8'}}>{translations(locale)?.student?.last_login}</td>
        //                             <td className='bolder' style={{color: '#575962'}}>{lastUsed || '-'}</td>
        //                         </tr>
        //                         <tr>
        //                             <td className='text-right pr-3'
        //                                 style={{color: '#868aa8'}}>&nbsp;</td>
        //                             <td className='bolder' style={{color: '#575962'}}/>
        //                         </tr>
        //                         <tr>
        //                             <td className='text-right pr-3'
        //                                 style={{color: '#868aa8'}}>&nbsp;</td>
        //                             <td className='bolder' style={{color: '#575962'}}/>
        //                         </tr>
        //                         <tr>
        //                             <td className='text-right pr-3'
        //                                 style={{color: '#868aa8'}}>&nbsp;</td>
        //                             <td className='bolder' style={{color: '#575962'}}/>
        //                         </tr>
        //                         </tbody>
        //                     </table>
        //                 </Col>
        //             </Row>
        //         </Container>
        //         <h6 className='pinnacle-bold mb-3 mt-5 ml-4'
        //             style={{color: '#ff5b1d'}}>{translations(locale)?.student?.student_information}</h6>
        //         <Row>
        //             <Col md={6}>
        //                 <div className='m-portlet'>
        //                     <div className='m-portlet__body'>
        //                         <Row>
        //                             <Col md={4} className='d-flex align-items-center justify-content-center'>
        //                                 <img width={100} height={100} className='img-responsive img-circle'
        //                                      src={student?.avatar || '/images/avatar.png'}
        //                                      alt={`Photo of ${student?.firstName}`}
        //                                      onError={(e) => {
        //                                          e.target.onError = null
        //                                          e.target.src = '/images/avatar.png'
        //                                      }}
        //                                 />
        //                             </Col>
        //                             <Col className='d-flex'>
        //                                 <table>
        //                                     <tbody>
        //                                     <tr>
        //                                         <td className='text-right pr-3'
        //                                             style={{color: '#868aa8'}}>{translations(locale)?.studentBook?.class_name}</td>
        //                                         <td className='bolder'
        //                                             style={{color: '#575962'}}>{student?.className || '-'}</td>
        //                                     </tr>
        //                                     <tr>
        //                                         <td className='text-right pr-3'
        //                                             style={{color: '#868aa8'}}>{translations(locale)?.student?.student_code}</td>
        //                                         <td className='bolder'
        //                                             style={{color: '#575962'}}>{student?.studentCode || '-'}</td>
        //                                     </tr>
        //                                     <tr>
        //                                         <td className='text-right pr-3'
        //                                             style={{color: '#868aa8'}}>{translations(locale)?.student?.last_name}</td>
        //                                         <td className='bolder'
        //                                             style={{color: '#575962'}}>{student?.lastName || '-'}</td>
        //                                     </tr>
        //                                     <tr>
        //                                         <td className='text-right pr-3'
        //                                             style={{color: '#868aa8'}}>{translations(locale)?.student?.first_name}</td>
        //                                         <td className='bolder'
        //                                             style={{color: '#575962'}}>{student?.firstName || '-'}</td>
        //                                     </tr>
        //                                     </tbody>
        //                                 </table>
        //                             </Col>
        //                         </Row>
        //                     </div>
        //                 </div>
        //             </Col>
        //         </Row>
        //         {
        //             members?.length > 0 &&
        //             <h6 className='pinnacle-bold mb-3 mt-4 ml-4'
        //                 style={{color: '#ff5b1d'}}>{translations(locale)?.student?.relation_other}</h6>
        //         }
        //         <Row>
        //             {
        //                 members?.map((member, index) => (
        //                     <Col md={6} key={index}>
        //                         <div className='m-portlet'>
        //                             <div className='m-portlet__body'>
        //                                 <Row>
        //                                     <Col md={4} className='d-flex align-items-center justify-content-center'>
        //                                         <img width={100} height={100} className='img-responsive img-circle'
        //                                              src={member?.avatar || '/images/avatar.png'}
        //                                              alt={`Photo of ${member?.firstName}`}
        //                                              onError={(e) => {
        //                                                  e.target.onError = null
        //                                                  e.target.src = '/images/avatar.png'
        //                                              }}
        //                                         />
        //                                     </Col>
        //                                     <Col className='d-flex'>
        //                                         <table>
        //                                             <tbody>
        //                                             <tr>
        //                                                 <td className='text-right pr-3'
        //                                                     style={{color: '#868aa8'}}>{translations(locale)?.student?.relation_type}</td>
        //                                                 <td className='bolder'
        //                                                     style={{color: '#575962'}}>{member?.relationTypeName || '-'}</td>
        //                                             </tr>
        //                                             <tr>
        //                                                 <td className='text-right pr-3'
        //                                                     style={{color: '#868aa8'}}>{translations(locale)?.phoneNumber}</td>
        //                                                 <td className='bolder'
        //                                                     style={{color: '#575962'}}>{member?.contact || '-'}</td>
        //                                             </tr>
        //                                             <tr>
        //                                                 <td className='text-right pr-3'
        //                                                     style={{color: '#868aa8'}}>{translations(locale)?.last_name}</td>
        //                                                 <td className='bolder'
        //                                                     style={{color: '#575962'}}>{member?.lastName || '-'}</td>
        //                                             </tr>
        //                                             <tr>
        //                                                 <td className='text-right pr-3'
        //                                                     style={{color: '#868aa8'}}>{translations(locale)?.first_name}</td>
        //                                                 <td className='bolder' style={{color: '#575962'}}>
        //                                                         <span className='underline'
        //                                                               onClick={() => setPersonId(member?.personId)}>
        //                                                             {member?.firstName || '-'}
        //                                                         </span>
        //                                                 </td>
        //                                             </tr>
        //                                             </tbody>
        //                                         </table>
        //                                     </Col>
        //                                 </Row>
        //                             </div>
        //                         </div>
        //                     </Col>
        //                 ))
        //             }
        //         </Row>
        //     </div>
        //     <div className="actions modal-footer">
        //         <div className="col-12 text-center">
        //             <button
        //                 onClick={onClose}
        //                 className="btn btn-outline-metal m-btn--pill"
        //             >
        //                 {translations(locale)?.close}
        //             </button>
        //         </div>
        //     </div>
        //     {
        //         loading &&
        //         <>
        //             <div className="blockUI blockOverlay"/>
        //             <div className="blockUI blockMsg blockPage">
        //                 <div className="m-loader m-loader--brand m-loader--lg"/>
        //             </div>
        //         </>
        //     }
        // </Modal>
    )
}

export default studentsParents