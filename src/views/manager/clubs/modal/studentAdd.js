import message from 'Src/message'
import { cloneDeep } from 'lodash'
import { Col, Row } from 'react-bootstrap'
import AddIcon from '@mui/icons-material/Add'
import React, { useEffect, useState } from 'react'
import CloseIcon from '@mui/icons-material/Close'
import { Checkbox, Modal } from 'semantic-ui-react'
import { managerClubStudentAdd } from 'Utilities/url'
import secureLocalStorage from 'react-secure-storage'
import { translations } from 'Utilities/translations'
import { fetchRequest } from 'Utilities/fetchRequest'
import { NDropdown as Dropdown } from 'Widgets/Dropdown'

const studentAdd = ({ onClose, group, onSubmit }) => {
    const locale = secureLocalStorage?.getItem('selectedLang') || 'mn'
    const [loading, setLoading] = useState(false)

    const [gradeOptions, setGradeOptions] = useState([])
    const [rows, setRows] = useState([{
        grade: null,
        class: null,
        isAll: false,
        students: [],
    }])

    useEffect(() => {
        setLoading(true)
        fetchRequest(managerClubStudentAdd, 'POST', { group })
            .then((res) => {
                if (res.success) {
                    const { gradesWithClassStudents } = res.data
                    setGradeOptions(gradesWithClassStudents || [])
                } else {
                    message(res.data.message)
                }
                setLoading(false)
            })
            .catch(() => {
                message(translations(locale)?.err?.error_occurred)
                setLoading(false)
            })
    }, [])

    const handleSubmit = () => {
        if (validateFields()) {
            const clone = cloneDeep(rows)
            clone?.forEach(el => { delete el?.classOptions, delete el?.studentOptions })
            onSubmit(clone)
        }
    }

    const validateFields = () => {
        if (!rows?.every(el => { return el?.grade && el?.class && el?.students?.length }))
            return message(translations(locale)?.err?.fill_all_fields)
        else if (rows?.length != new Set(rows?.map(el => el?.class))?.size)
            return message(translations(locale)?.club?.duplicateClasses)
        else
            return true
    }

    const handleGradeChange = ({ value: grade, options } = data, index) => {
        const classOptions = options?.find(el => el?.value == grade)?.classOptions
        const clone = [...rows]
        clone[index].grade = grade
        clone[index].class = null
        clone[index].details = null
        clone[index].classOptions = classOptions
        clone[index].students = []
        clone[index].studentOptions = []
        setRows(clone)
    }

    const handleClassChange = ({ value, options } = data, index) => {
        const selectedClass = options?.find(el => el?.value == value)
        const clone = [...rows]
        clone[index].class = value
        clone[index].details = selectedClass?.details
        clone[index].students = []
        clone[index].studentOptions = selectedClass?.studentOptions
        setRows(clone)
    }

    const handleStudentChange = (student, index) => {
        const clone = [...rows]
        clone[index].students = student
        clone[index].isAll = clone[index]?.studentOptions?.length == student?.length ? true : false
        setRows(clone)
    }

    const handleCheckBoxChange = (checked, index) => {
        const clone = [...rows]
        if (checked) rows[index].students = rows[index]?.studentOptions?.map(el => el?.value)
        else rows[index].students = []
        rows[index].isAll = checked
        setRows(clone)
    }

    const handleRowAdd = () => {
        setRows([...rows, { grade: null, class: null, isAll: false, students: [] }])
    }

    const handleRowRemove = index => {
        if (rows?.length > 1) {
            const clone = [...rows]
            clone?.splice(index, 1)
            setRows(clone)
        }
    }

    return (
        <Modal
            centered
            open={true}
            size='large'
            onClose={onClose}
            dimmer='blurring'
            className='react-modal overflow-modal'
        >
            <div className='header'>
                {translations(locale)?.movement?.add}
                <button type='button' className='close' aria-label='Close' onClick={onClose}>
                    <CloseIcon />
                </button>
            </div>
            <div className='content'>
                {
                    rows?.map((row, index) => (
                        <Row key={index} className='my-2'>
                            <Col>
                                <Row>
                                    <Col md={4} className='col-form-label text-right label-pinnacle-bold'>
                                        {translations(locale)?.grade}*
                                    </Col>
                                    <Col>
                                        <Dropdown
                                            fluid
                                            selection
                                            closeOnChange
                                            value={row?.grade}
                                            options={gradeOptions || []}
                                            placeholder={`- ${translations(locale)?.select} -`}
                                            onChange={(e, data) => handleGradeChange(data, index)}
                                        />
                                    </Col>
                                </Row>
                            </Col>
                            <Col>
                                <Row>
                                    <Col md={4} className='col-form-label text-right label-pinnacle-bold'>
                                        {translations(locale)?.class?.title}*
                                    </Col>
                                    <Col>
                                        <Dropdown
                                            fluid
                                            search
                                            selection
                                            closeOnChange
                                            value={row?.class}
                                            options={row?.classOptions || []}
                                            placeholder={`- ${translations(locale)?.select} -`}
                                            onChange={(e, data) => handleClassChange(data, index)}
                                        />
                                        <Checkbox
                                            className='mt-2'
                                            checked={row?.isAll}
                                            label={translations(locale)?.finance?.select_all_students}
                                            onChange={(e, data) => handleCheckBoxChange(data?.checked, index)}
                                        />
                                    </Col>
                                </Row>
                            </Col>
                            <Col>
                                <Row>
                                    <Col md={4} className='col-form-label text-right label-pinnacle-bold'>
                                        {translations(locale)?.student?.title}*
                                    </Col>
                                    <Col>
                                        <Dropdown
                                            fluid
                                            search
                                            multiple
                                            selection
                                            value={row?.students}
                                            options={row?.studentOptions || []}
                                            placeholder={`- ${translations(locale)?.select} -`}
                                            onChange={(e, data) => handleStudentChange(data?.value, index)}
                                        />
                                    </Col>
                                </Row>
                            </Col>
                            <div className='d-flex gap-05' style={{ width: 90 }}>
                                <button
                                    onClick={() => handleRowRemove(index)}
                                    className={`${rows?.length > 1 ? 'visible' : 'invisible'}  btn btn-danger m-btn--icon btn-sm m-btn--icon-only m-btn--pill d-inline-flex justify-content-center align-items-center`}>
                                    <CloseIcon />
                                </button>
                                {
                                    rows?.length == index + 1 &&
                                    <button onClick={handleRowAdd}
                                        className="btn btn-outline-info m-btn--icon btn-sm m-btn--icon-only m-btn--pill d-inline-flex justify-content-center align-items-center"
                                    >
                                        <AddIcon />
                                    </button>
                                }
                            </div>
                        </Row>
                    ))
                }
            </div>
            <div className='actions modal-footer'>
                <div className='col-12 text-center'>
                    <button
                        className='btn m-btn--pill btn-outline-metal text-uppercase mr-3'
                        onClick={onClose}
                    >
                        {translations(locale)?.close}
                    </button>
                    <button
                        className='btn m-btn--pill btn-success text-uppercase'
                        onClick={handleSubmit}
                    >
                        {translations(locale)?.movement?.add}
                    </button>
                </div>
            </div>
            {
                loading &&
                <>
                    <div className='blockUI blockOverlay' />
                    <div className='blockUI blockMsg blockPage'>
                        <div className='m-loader m-loader--brand m-loader--lg' />
                    </div>
                </>
            }
        </Modal >
    )
}

export default studentAdd