import message from 'modules/message'
import { Col, Row, Modal } from 'react-bootstrap'
// import { ESISClassLink } from 'utils/url'
import Checkbox from '@mui/material/Checkbox'
import { useTranslation } from 'react-i18next'
import React, { useEffect, useState } from 'react'
import DTable from 'modules/DataTable/DTable'
import secureLocalStorage from 'react-secure-storage'
import { fetchRequest } from 'utils/fetchRequest'
import { translations } from 'utils/translations'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'

const locale = secureLocalStorage?.getItem('selectedLang') || 'mn'

const config = {
    showAllData: true,
    showPagination: false,
    showFilter: true,
}

const edit = ({ onClose, onSubmit, esisClass }) => {
    
    const { t } = useTranslation()
    const [loading, setLoading] = useState(false)
    const [checkedCell, setCheckedCell] = useState(null)

    const [tableData, setTableData] = useState([
        {id: "8295", firstName: "Тулга", lastName: "Чулуунсүх", birthday: "2023-01-09", code: "1938", checked: false},
        {id: "17", firstName: "Мэргэнсанаа", lastName: "Энхтөр", birthday: null, code: "1829", checked: false},
    ])

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
            dataField: 'class',
            text: translations(locale)?.esis?.className,
        },
        {
            dataField: 'teacherFirstName',
            text: translations(locale)?.esis?.classTeacher,
        },
        {
            dataField: 'shift',
            text: translations(locale)?.school_shift,
        },
        {
            dataField: 'scoreType',
            text: translations(locale)?.score_type,
        },
        {
            dataField: 'room',
            text: translations(locale)?.group?.classroom,
        }
    ]

    // useEffect(() => {
    //     setLoading(true)
    //     fetchRequest(ESISClassLink, 'POST')
    //         .then(res => {
    //             if (res.success) {
    //                 const { classes } = res.data
    //                 setTableData(classes?.sort((a, b) => a?.class?.toString()?.localeCompare(b?.class?.toString(), undefined, { numeric: true, sensitivity: 'base' })) || [])
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

    const handleCheckboxChange = (id, checked) => {
        setCheckedCell(id)
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
        const classes = tableData?.filter(el => el?.checked == true)
        if (!classes?.length)
            return message(translations(locale)?.esis?.selectGrade)
        if (classes?.length > 1)
            return message(translations(locale)?.esis?.selectOnlyOneGrade)

        console.log('Esis ', esisClass)


        onSubmit({ esisClassId: esisClass?.id,
            eschoolClassId: classes?.[0]?.id,
            esisAcademicLevel: esisClass?.esisAcademicLevel,
            esisAcademicLevelName: esisClass?.esisGradeName,
            esisProgramStageId: esisClass?.esisProgramStageId,
            esisProgramOfStudyId: esisClass?.esisProgramOfStudyId,
            esisStudentGroupName: esisClass?.esisStudentGroupName,
            esisTeacherId: esisClass?.esisTeacherId,
            esisTeacherName: esisClass?.esisTeacherName,
        })
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
                    {t('esis.linkClass')}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className='br-20 border-orange p-3 text-grey'>
                    <Row>
                        <Col className='text-right pr-2'>{translations(locale)?.esis?.gradeName}</Col>
                        <Col className='pl-2'>{esisClass?.esisGradeName}</Col>
                    </Row>
                    <Row>
                        <Col className='text-right pr-2'>{translations(locale)?.esis?.classCode}</Col>
                        <Col className='pl-2'>{esisClass?.esisClassCode}</Col>
                    </Row>
                    <Row>
                        <Col className='text-right pr-2'>{translations(locale)?.esis?.className}</Col>
                        <Col className='pl-2'>{esisClass?.esisClassName}</Col>
                    </Row>
                    <Row>
                        <Col className='text-right pr-2'>{translations(locale)?.esis?.classTeacher}</Col>
                        <Col className='pl-2'>{esisClass?.esisClassTeacher}</Col>
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
            <Modal.Footer className="text-center">
                <button
                    className='btn m-btn--pill btn-link m-btn m-btn--custom'
                    onClick={onClose}
                >
                    {translations(locale)?.close}
                </button>
                <button
                    className='btn m-btn--pill btn-success m-btn--wide'
                    onClick={handleSubmit}
                >
                    {translations(locale)?.connect}
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