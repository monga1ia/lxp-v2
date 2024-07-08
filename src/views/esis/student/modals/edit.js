import message from 'modules/message'
import { getGender } from 'utils/Util'
import { Col, Row, Modal } from 'react-bootstrap'
import Checkbox from '@mui/material/Checkbox'
// import { ESISStudentLink } from 'utils/url'
import React, { useEffect, useState } from 'react'
import DTable from 'modules/DataTable/DTable'
import secureLocalStorage from 'react-secure-storage'
import { fetchRequest } from 'utils/fetchRequest'
import { useTranslation } from 'react-i18next'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'

const locale = secureLocalStorage?.getItem('selectedLang') || 'mn'

const config = {
    showAllData: true,
    showPagination: false,
    showFilter: true,
    defaultSort: [{
        dataField: 'firstName',
        order: 'asc',
    }]
}

const edit = ({ onClose, onSubmit, esisStudent, eschoolClasses }) => {

    const { t } = useTranslation()
    const [loading, setLoading] = useState(false)

    const [tableData, setTableData] = useState([])

    const columns = [
        {
            dataField: 'checked',
            text: '',
            align: 'center',
            formatter: (cell, row) =>
                <Checkbox
                    checked={cell}
                    onChange={(e) => handleCheckboxChange(row?.id, e?.target?.checked)}
                />
        },
        {
            dataField: 'className',
            text: t('class_name'),
        },
        {
            dataField: 'code',
            text: t('code'),
        },
        {
            dataField: 'lastName',
            text: t('last_name'),
        },
        {
            dataField: 'firstName',
            text: t('first_name'),
        },
        {
            dataField: 'birthDay',
            text: t('studentBook.birth_day'),
        },
    ]

    // useEffect(() => {
    //     setLoading(true)

    //     const selectedClass = eschoolClasses.find(classObj => {
    //         return (classObj?.esisGroupId || '').toString() === (esisStudent?.esisGroupId || '').toString()
    //     })

    //     const params = {
    //         class: selectedClass?.id
    //     }
    //     fetchRequest(ESISStudentLink, 'POST', params)
    //         .then(res => {
    //             if (res.success) {
    //                 const { students } = res.data
    //                 setTableData(students || [])
    //             } else {
    //                 message(res.data.message)
    //             }
    //             setLoading(false)
    //         })
    //         .catch(() => {
    //             message(t('err.error_occurred'))
    //             setLoading(false)
    //         })
    // }, [])

    const handleCheckboxChange = (id, checked) => {
        const clone = [...tableData]
        clone?.forEach(el => {
            if (el?.id == id)
                el.checked = checked
            else
                el.checked = false
        })
        setTableData(clone)
    }

    const handleSubmit = () => {
        const students = tableData?.filter(el => el?.checked == true)
        if (!students?.length)
            return message(t('esis.selectStudent'))
        if (students?.length > 1)
            return message(t('esis.selectOnlyOneStudent'))

        onSubmit({ esisPersonId: esisStudent?.id,
            esisFirstName: esisStudent?.firstName,
            esisLastName: esisStudent?.lastName,
            esisBirthday: esisStudent?.esisBirthDay,
            esisGender: esisStudent?.esisGender,
            esisAcademicLevel: esisStudent?.esisAcademicLevel,
            esisAcademicLevelName: esisStudent?.esisAcademicLevelName,
            esisGroupId: esisStudent?.esisGroupId,
            esisGroupName: esisStudent?.esisGroupName,
            esisProgramOfStudyId: esisStudent?.esisProgramOfStudyId,
            esisProgramPlanId: esisStudent?.esisProgramPlanId,
            student: students?.[0]?.id })
    }

    return (
        <Modal
            centered
            show={true}
            onHide={onClose}
            size='lg'
            dimmer='blurring'
            aria-labelledby="contained-modal-title-vcenter"
        >
            <Modal.Header closeButton style={{padding: '1rem'}}>
                <Modal.Title className="modal-title d-flex flex-row justify-content-between w-100">
                    {t('student_card.connect_student')}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className='br-20 border-orange p-3 text-grey'>
                    <Row>
                        <Col className='text-right pr-2'>{t('className')}</Col>
                        <Col className='pl-2'>{esisStudent?.esisGradeName}</Col>
                    </Row>
                    <Row>
                        <Col className='text-right pr-2'>{t('class_name')}</Col>
                        <Col className='pl-2'>{esisStudent?.esisClassName}</Col>
                    </Row>
                    <Row>
                        <Col className='text-right pr-2'>{t('foodDashboardFinanceModalStudents.last_name')}</Col>
                        <Col className='pl-2'>{esisStudent?.esisLastName}</Col>
                    </Row>
                    <Row>
                        <Col className='text-right pr-2'>{t('studentBook.name')}</Col>
                        <Col className='pl-2'>{esisStudent?.esisFirstName}</Col>
                    </Row>
                    <Row>
                        <Col className='text-right pr-2'>{t('studentBook.birth_day')}</Col>
                        <Col className='pl-2'>{esisStudent?.esisBirthDay}</Col>
                    </Row>
                    <Row>
                        <Col className='text-right pr-2'>{t('gender')}</Col>
                        <Col className='pl-2'>{getGender(esisStudent?.esisGender)}</Col>
                    </Row>
                </div>
                <div className='br-20 border-orange p-3 mt-2'>
                    <DTable
                        locale={locale}
                        config={config}
                        data={tableData}
                        columns={columns}
                    />
                </div>
            </Modal.Body>
            <Modal.Footer className='text-center'>
                <button
                    className="btn m-btn--pill btn-link m-btn m-btn--custom"
                    onClick={onClose}
                >
                    {t('back')}
                </button>
                <button
                    className="btn m-btn--pill btn-success m-btn--wide"
                    onClick={handleSubmit}
                >
                    {t('save')}
                </button>
            </Modal.Footer>
            {
                loading &&
                <>
                    <div className='blockUI blockOverlay' />
                    <div className='blockUI blockMsg blockPage'>
                        <div className='m-loader m-loader--brand m-loader--lg' />
                    </div>
                </>
            }
        </Modal>
    )
}

export default edit