import React, { useEffect, useState } from 'react'
import { Row, Col, Card, Button } from 'react-bootstrap'
import BreadcrumbList from 'components/breadcrumb-list/BreadcrumbList'
import HtmlHead from 'components/html-head/HtmlHead'
import message from 'modules/message'
import ParentsModal from './modals/parents'
import ApproveParentsModal from './modals/approveParents'
import NoParentsModal from './modals/noParents'
import { classParentInit } from 'utils/fetchRequest/Urls'
import DTable from 'modules/DataTable/DTable'
import secureLocalStorage from 'react-secure-storage'
import { fetchRequest } from 'utils/fetchRequest'
import { translations } from 'utils/translations'
import { useTranslation } from 'react-i18next'
import ExpiredParentsModal from './modals/expiredParents'
import StudentsParentsModal from './modals/studentsParents'

const index = () => {
    const locale = secureLocalStorage?.getItem('selectedLang') || 'mn'
    const { t } = useTranslation()
    const [loading, setLoading] = useState(false)

    const title = t('parents.title');
    const description = "E-learning";
    const breadcrumbs = [
        { to: "", text: "Home" },
        { to: "class/parents", text: title }
    ];

    // const [tableData, setTableData] = useState([])

    const [totalParents, setTotalParents] = useState(0)
    const [unExpiredParents, setUnExpiredParents] = useState(0)
    const [parentsTotalActiveTime, setParentsTotalActiveTime] = useState(0)

    const [showExpiredParentsModal, setShowExpiredParentsModal] = useState(false)
    const [expiredParents, setExpiredParents] = useState([])

    const [showNoParentsModal, setShowNoParentsModal] = useState(false)
    const [noParents, setNoParents] = useState([])

    const [showStudentsParentsModal, setShowStudentsParentsModal] = useState(false)
    const [showParentsModal, setShowParentsModal] = useState(false)
    const [selectedStudentId, setSelectedStudentId] = useState(null)
    const [selectedParentObj, setSelectedParentObj] = useState(null)

    const [hasApprovalConfig, setHasApprovalConfig] = useState(false)
    const [nonApprovedParents, setNonApprovedParents] = useState([])
    const [showNonApprovedParentsModal, setShowNonApprovedParentsModal] = useState(false)

    const [rerender, setRerender] = useState(false)

    const localSchool = secureLocalStorage.getItem('selectedSchool')
    const [tableData, setTableData] = useState([
        {id: 19, code: 2323, firstName: "AAA", lastName: "SS", relationCount:2}, 
        {id: 20, code: 1232, firstName: "Julia", lastName: "Julie", relationCount:1}
    ]);

    const config = {
        excelExport: true,
        printButton: true,
        columnButton: true,
        showAllData: true,
        showPagination: false,
        excelFileName: `${localSchool?.text}-${localSchool?.classes?.find(el => el?.value == secureLocalStorage.getItem('selectedClassId'))?.text}-${t('roles.parent')}`,
        defaultSort: [{
            dataField: 'firstName',
            order: 'asc'
        }]
    }

    const columns = [
        {
            dataField: "avatar",
            text: t('teacher.photo'),
            sort: true,
            align: 'center',
            formatter: (cell) =>
                <img className='img-responsive img-circle'
                     src={cell || '/img/profile/avatar.png'}
                     width={40} height={40} alt='profile picture'
                     onError={(e) => {
                         e.target.onError = null
                         e.target.src = '/img/profile/avatar.png'
                     }}
                />
            
        },
        {
            dataField: "code",
            text: t('studentCode'),
            sort: true
        },
        {
            dataField: "lastName",
            text: t('studentLastName'),
            sort: true
        },
        {
            dataField: "firstName",
            text: t('studentFirstName'),
            sort: true,
        },
        {
            dataField: "relationCount",
            text: t('student.relation'),
            sort: true,
            formatter: (cell, row) => <span onClick={() => handleCellClick(row?.id)} className='underline' > {cell || 0}</span>
        },
    ];

    useEffect(() => {
        // setLoading(true)
        // fetchRequest(classParentInit, 'POST')
        //     .then(res => {
        //         if (res.success) {
        //             const { studentList, parents, approvalConfig } = res.data
        //             setHasApprovalConfig(approvalConfig)
        //             setNonApprovedParents(res?.data?.nonApprovedParents)
        //             let totalParents = 0
        //             let noParents = []
        //             studentList?.forEach(student => {
        //                 if (student?.relationCount) {
        //                     totalParents += parseInt(student?.relationCount, 10)
        //                 } else {
        //                     noParents.push(student)
        //                 }
        //             })
        //             setNoParents(noParents)
        //             setTotalParents(totalParents)

        //             let expired = []
        //             let unExpired = 0
        //             parents?.forEach(parent => parent?.expired ? expired.push({ ...parent, id: parent?.userId }) : unExpired++)
        //             setExpiredParents(expired)
        //             setUnExpiredParents(unExpired)
        //             setTableData(studentList || [])
        //         } else {
        //             message(res.message)
        //         }
        //         setLoading(false)
        //     })
        //     .catch(() => {
        //         message(t('err.error_occurred'))
        //         setLoading(false)
        //     })
    }, [rerender]);

    const handleCellClick = id => {
        setSelectedStudentId(id)
        setShowParentsModal(true)
    }

    const closeModal = () => {
        setSelectedStudentId(null)
        setShowParentsModal(false)
        setShowNoParentsModal(false)
        setShowExpiredParentsModal(false)
        setShowStudentsParentsModal(false)
    }

    const closeApproveParentModal = () => {
        setShowNonApprovedParentsModal(false)
    }

    const onSubmitApprove = (newList = []) => {
        setNonApprovedParents(newList)
        setShowNonApprovedParentsModal(false)
    }

    const handleClick = (rowObj) => {  
        setSelectedParentObj(rowObj)
        setShowParentsModal(false)
        setShowStudentsParentsModal(true)
    };

    return (
        <>
            <HtmlHead title={title} description={description} />

            <div className="page-title-container mb-2">
                <Col md="7" className='p-0'>
                    <h1 className="mb-0 pb-0 display-4 relative">{title}</h1>
                    <BreadcrumbList items={breadcrumbs} />
                </Col>
            </div>  
            <div className="row gap-10">
                { 
                    // (hasApprovalConfig || nonApprovedParents?.length > 0 ) &&  тестлэхийн тулд түр коммент болгосон
                    <div
                        onClick={() => setShowNonApprovedParentsModal(true)} 
                        // onClick={() => nonApprovedParents?.length > 0 ? setShowNonApprovedParentsModal(true) : null } тестлэхийн тулд түр коммент болгосон
                        className='br-06 col px-4 pt-4 pb-3' style={{ backgroundColor: '#ffa988' }}>
                        <div className="text-white d-flex flex-column justify-content-between h-100">
                            <p className='m-0 fs-14' style={{ fontFamily: 'MulishMedium', color: 'rgb(122, 122, 134)' }}>{t('parents.pendingConfirmation')}</p>
                            <p className='text-right m-0 fs-23' style={{ fontFamily: 'MulishBlack', color: 'rgb(122, 122, 134)' }} >{nonApprovedParents?.length}</p>
                        </div>
                    </div>
                }
                <div className='br-06 col px-4 pt-4 pb-3' style={{ backgroundColor: 'rgba(62, 191, 163, 0.8)' }}>
                    <div className="text-white d-flex flex-column justify-content-between h-100">
                        <p className='m-0 fs-14' style={{ fontFamily: 'MulishMedium' }}>{t('parents.total_parents')}</p>
                        <p className='text-right m-0 fs-23' style={{ fontFamily: 'MulishBlack' }} >{totalParents}</p>
                    </div>
                </div>
                <div onClick={() => setShowNoParentsModal(true)} className='br-06 col px-4 pt-4 pb-3 pointer' style={{ backgroundColor: '#dfe2ea' }}>
                    <div className="d-flex flex-column justify-content-between h-100">
                        <p className='m-0 fs-14' style={{ fontFamily: 'MulishMedium', color: '#7a7a86' }}>{t('parents.no_parent')}</p>
                        <p className='text-right m-0 fs-23' style={{ fontFamily: 'MulishBlack', color: '#62646e' }} >{noParents?.length}</p>
                    </div>
                </div>
                <div onClick={() => setShowExpiredParentsModal(true)} className='br-06 col px-4 pt-4 pb-3 pointer' style={{ backgroundColor: 'rgba(249, 184, 34, 0.8)' }}>
                    <div className="text-white d-flex flex-column justify-content-between h-100">
                        <p className='m-0 fs-14' style={{ fontFamily: 'MulishMedium' }}>{t('parents.parent_user_expired')}</p>
                        <p className='text-right m-0 fs-23' style={{ fontFamily: 'MulishBlack' }} >{expiredParents?.length} | {unExpiredParents}</p>
                    </div>
                </div>
                <div className='m-portlet br-12'>
                    <div className='m-portlet__body'>
                        <DTable
                            config={config}
                            columns={columns}
                            data={tableData}
                            locale={locale}
                        />
                </div>
                </div>
            </div>          
            {
                showNoParentsModal &&
                <NoParentsModal
                    onClose={closeModal}
                    data={noParents}
                />
            }
            {
                showNonApprovedParentsModal &&
                <ApproveParentsModal
                    onClose={closeApproveParentModal}
                    parents={nonApprovedParents}
                    onSubmit={onSubmitApprove}
                />
            }
            {
                showExpiredParentsModal &&
                <ExpiredParentsModal
                    onClose={closeModal}
                    data={expiredParents}
                />
            }
            {
                showParentsModal && //selectedStudentId && // тестлэхийн тулд түр коммент болгосон
                <ParentsModal
                    onClose={closeModal}
                    id={selectedStudentId}
                    onClick={handleClick}
                    rerender={() => setRerender(prev => !prev)}
                />
            }
            {
                showStudentsParentsModal && //selectedStudentId && selectedParentObj &&  // тестлэхийн тулд түр коммент болгосон
                <StudentsParentsModal
                    onClose={closeModal}
                    parentId={selectedParentObj?.personId}
                    studentId={selectedStudentId}
                    lastUsed={selectedParentObj?.lastUsed}
                    usageTime={selectedParentObj?.usageTime}
                />
            }
            {
                loading &&
                <>
                    <div className='blockUI blockOverlay' />
                    <div className='blockUI blockMsg blockPage'>
                        <div className='m-loader m-loader--brand m-loader--lg' />
                    </div>
                </>
            }
        </>
    );
}

export default index