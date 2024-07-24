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
import {NDropdown as Dropdown} from "widgets/Dropdown";

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

const create = ({ onClose, onSubmit, grades = [], classes = [], onFilter= () => {} }) => {

    const { t } = useTranslation()
    const [loading, setLoading] = useState(false)

    const [selectedGrade, setSelectedGrade] = useState(null)
    const [selectedClassObj, setSelectedClassObj] = useState(null)
    const [tableData, setTableData] = useState([
        {id: 123, esisId: '123', esisGradeName: 'Baa', esisClassName: 'asdf', esisLastName: 'asdf', esisFirstName: 'asdfe', esisBirthDay: 'asdfe', esisGender: 'asdf',
            eschoolClassName: 'asdf', eschoolStudentCode: '213', eschoolLastName: 'Mas', eschoolFirstName: '123', eschoolGender: 'M'},
        {id: 1234, eschoolId: 123, esisId: '123', esisGradeName: 'Baa', esisClassName: 'asdf', esisLastName: 'asdf', esisFirstName: 'asdfe', esisBirthDay: 'asdfe', esisGender: 'asdf',
            eschoolClassName: 'asdf', eschoolStudentCode: '213', eschoolLastName: 'Mas', eschoolFirstName: '123', eschoolGender: 'M'},
        {id: 1235, eschoolId: '', esisId: '123', esisGradeName: 'Baa', esisClassName: 'asdf', esisLastName: 'asdf', esisFirstName: 'asdfe', esisBirthDay: 'asdfe', esisGender: 'asdf',
            eschoolClassName: 'asdf', eschoolStudentCode: '213', eschoolLastName: 'Mas', eschoolFirstName: '123', eschoolGender: 'M'},
    ])

    const onRowClassChange = (rowId, classId) => {
        const clone = [...tableData]
        const rowObj = clone?.find(el => el?.id == rowId)
        rowObj['eschoolClass'] = classId
        setTableData(clone)
    }

    const onRowStudentCodeChange = (rowId, studentCode) => {
        const clone = [...tableData]
        const rowObj = clone?.find(el => el?.id == rowId)
        rowObj['eschoolStudentCode'] = studentCode
        setTableData(clone)
    }

    const columns = [
        {
            dataField: 'eschoolClass',
            text: t('class_name'),
            style: { padding: 2 },
            formatter: (cell, row) => {
                return <Dropdown
                    key={'row_' + row?.id}
                    fluid
                    clearable
                    selection
                    closeOnChange
                    value={cell}
                    options={getClassFilter()}
                    placeholder={'-' + t('select') + '-'}
                    onChange={(e, data) => onRowClassChange(row?.id, data?.value)}
                />
            }
        },
        {
            dataField: 'esisId',
            text: 'ESIS ID',
            sort: true
        },
        {
            dataField: 'eschoolStudentCode',
            text: t('esis.eschoolCode'),
            style: { padding: 2 },
            formatter: (cell, row) =>
                <input
                    autoFocus
                    type='text'
                    value={cell || ''}
                    className='form-control'
                    onChange={(e) => onRowStudentCodeChange(row?.id, e?.target?.value)}
                />
        },
        {
            dataField: 'esisClassName',
            text: t('esis.className'),
            sort: true,
        },
        {
            dataField: 'esisLastName',
            text: t('foodDashboardFinanceModalStudents.last_name'),
            sort: true
        },
        {
            dataField: 'esisFirstName',
            text: t('studentBook.name'),
            sort: true
        },
        {
            dataField: 'esisBirthDay',
            text: t('studentBook.birth_day'),
            sort: true
        },
        {
            dataField: 'esisGender',
            text: t('gender'),
            sort: true,
            formatter: cell => getGender(cell)
        }
    ]

    useEffect(() => {
    }, [])

    const handleSubmit = () => {
        const list = JSON.stringify(tableData.filter(obj => {
            return obj.checkable && obj.eschoolClass
        }).map(studentObj => {
            const selectedClassObj = classes.find(classObj => {
                return classObj?.value?.toString() === studentObj?.eschoolClass?.toString()
            })

            return {
                ...studentObj,
                ...{eschoolClassName: selectedClassObj?.name || null},
                ...{eschoolGrade: selectedClassObj?.gradeId || null}
            }
        }))
        if (list && list?.length > 0) {
            setLoading(true)
            onSubmit(list)
        } else {
            message(t('err.select_student'))
        }
    }

    const onGradeChange = (value) => {
        setSelectedGrade(value)
    }

    const onClassChange = (value) => {
        if (value) {
            setSelectedClassObj(classes.find(classObj => {
                return classObj.id === value
            }))
        } else {
            setSelectedClassObj(null)
        }
    }

    const getClassFilter = () => {
        const classList = [];
        for (let c = 0; c < classes?.length; c++) {
            if (classes[c]?.esisAcademicLevel === selectedGrade) {
                classList.push(classes[c])
            }
        }
        return classList
    }

    const loadStudents = () => {
        const studentList = onFilter(selectedGrade, selectedClassObj?.esisGroupId)
        console.log('Stu', studentList)
        setTableData(studentList)
    }

    const onCheckChange = (key, rowIndex, checked, id) => {
        const data = [...tableData]
        if (key === 'allCheck') {
            for (let d = 0; d < data?.length; d++) {
                data[d].checkable = checked
            }
        } else if (key === 'row') {
            for (let d = 0; d < data?.length; d++) {
                if (data[d].id === id) {
                    data[d].checkable = checked
                    break;
                }
            }
        }
        setTableData(data)
    }

    return (
        <Modal
            centered
            show={true}
            onHide={onClose}
            size='xxl'
            dimmer='blurring'
            aria-labelledby="contained-modal-title-vcenter"
        >
            <Modal.Header closeButton style={{padding: '1rem'}}>
                <Modal.Title className="modal-title d-flex flex-row justify-content-between w-100">
                    {t('esis.createStudent')}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className='br-20 border-orange p-3 text-grey'>
                    <Row>
                        <Col md={2} xs={12}/>
                        <Col md={4} xs={6}>
                            <Dropdown
                                fluid
                                clearable
                                search
                                selection
                                closeOnChange
                                options={grades}
                                value={selectedGrade}
                                placeholder={'-' + t('select') + '-'}
                                onChange={(e, data) => onGradeChange(data?.value)}
                            />
                        </Col>
                        <Col md={4} xs={6}>
                            <Dropdown
                                fluid
                                clearable
                                search
                                selection
                                closeOnChange
                                options={getClassFilter()}
                                value={selectedClassObj?.value}
                                placeholder={'-' + t('select') + '-'}
                                onChange={(e, data) => onClassChange(data?.value)}
                            />
                        </Col>
                        <Col md={2} xs={12}>
                            <button
                                style={{backgroundColor: '#41c5dc'}}
                                className='btn btn-sm m-btn--pill m-btn--uppercase d-inline-flex text-white'
                                onClick={loadStudents}
                            >
                                <span className='ml-2'>{t('view')}</span>
                            </button>
                        </Col>
                    </Row>
                </div>
                <div className='br-20 border-orange p-3 mt-2'>
                    <DTable
                        checkable
                        locale={locale}
                        config={config}
                        data={tableData}
                        columns={columns}
                        onCheckable={onCheckChange}
                    />
                </div>
            </Modal.Body>
            <Modal.Footer className="text-center">
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
                    {t('esis.createStudent').toUpperCase()}
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

export default create