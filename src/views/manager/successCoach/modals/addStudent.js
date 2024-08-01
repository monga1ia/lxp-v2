import React, { useEffect, useState } from 'react'
import { Modal } from 'react-bootstrap'
import { useTranslation } from "react-i18next";
import { useSelector } from 'react-redux'
import message from "modules/message";
import DTable from "modules/DataTable/DTable";
import { NDropdown as Dropdown } from 'widgets/Dropdown';
import secureLocalStorage from "react-secure-storage";

import { fetchRequest } from 'utils/fetchRequest'
import { managerSuccessCoachInit } from 'utils/fetchRequest/Urls'

const locale = secureLocalStorage?.getItem('selectedLang') || 'mn'
const addStudent = ({ onClose, onSubmit, teacherUserId = null }) => {

    const { t } = useTranslation();

    const { selectedSchool } = useSelector(state => state.schoolData);
    const [selectedClassId, setSelectedClassId] = useState(null)
    const [classes, setClasses] = useState([])
    const [students, setStudents] = useState([])

    const [loading, setLoading] = useState(false)
    const [updateView, setUpdateView] = useState(false)

    const config = {
        showAllData: true,
        showPagination: false,
        excelExport: false,
        printButton: false
    }

    const columns = [
        {
            dataField: 'avatar',
            text: t('teacher.photo'),
            sort: true,
            width: 40,
            align: 'center',
            formatter: (cell) =>
                <img className='img-responsive img-circle'
                    src={cell || '/img/profile/placeholder.jpg'}
                    width={40} height={40} alt='profile picture'
                    onError={(e) => {
                        e.target.onError = null
                        e.target.src = '/img/profile/avatar.png'
                    }}
                />
        },
        {
            dataField: 'className',
            text: t('group.title'),
            sort: true
        },
        {
            dataField: 'code',
            text: t('studentCode'),
            sort: true,
            formatter: (cell, row) => { return <span className='underline' onClick={() => onClickName(row)}>{cell}</span> }
        },
        {
            dataField: 'lastname',
            text: t('studentLastName'),
            sort: true
        },
        {
            dataField: 'firstname',
            text: t('studentFirstName'),
            sort: true,
        }
    ]

    const loadData = (params) => {
        setLoading(true)
        fetchRequest(managerSuccessCoachInit, 'POST', params)
            .then((res) => {
                if (res.success) {
                    setClasses(res?.classes || [])
                    setStudents(res?.students || [])
                } else {
                    message(res.message)
                }
                setLoading(false)
            })
            .catch(() => {
                message(t('err.error_occurred'))
                setLoading(false)
            })
    };

    useEffect(() => {
        loadData({
            school: selectedSchool?.id
        })
    }, [])

    const onClassChange = (e, data) => {
        setSelectedClassId(data?.value)

        loadData({
            school: selectedSchool?.id,
            class: data?.value
        })
    }

    const onCheckChange = (key, rowIndex, checked, id) => {
        const list = [...students]
        if (key === 'allCheck') {
            for (let s = 0; s < list?.length; s++) {
                list[s].checkable = checked;
            }
        } else {
            for (let s = 0; s < list?.length; s++) {
                if (list[s]?.id === id) {
                    list[s].checkable = checked;
                    break;
                }
            }
        }
        setStudents(list)
        setUpdateView(!updateView)
    }

    const onClickSubmit = () => {
        const checkedList = students?.filter(obj => obj.checkable)
        if (checkedList?.length > 0) {
            onSubmit({
                students: checkedList?.map(obj => obj?.id)
            })
        } else {
            message(t('err.select_student'))
        }        
    }

    return (
        <Modal
            size='xl'
            dimmer='blurring'
            show={true}
            onHide={onClose}
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton style={{ padding: '1rem' }}>
                <Modal.Title className="modal-title d-flex flex-row justify-content-between w-100">
                    {t('group.addStudent')}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="form-group m-form__group row">
                    <label className="col-form-label col-md-5 col-sm-12 text-right label-pinnacle-bold">
                        {t('class_name') || ''}*
                    </label>
                    <div className="col-md-3 col-sm-12">
                        <Dropdown
                            selectOnNavigation={false}
                            placeholder={'-' + t('survey.choose') + '-' || null}
                            fluid
                            selection
                            search
                            additionPosition='bottom'
                            upward={false}
                            closeOnChange
                            selectOnBlur={false}
                            value={selectedClassId}
                            options={classes?.map(obj => {
                                return {
                                    value: obj?.id,
                                    text: obj?.name
                                }
                            })}
                            onChange={onClassChange}
                        />
                    </div>
                </div>

                <DTable
                    checkable
                    onCheckable={onCheckChange}
                    config={config}
                    data={students}
                    columns={columns}
                    locale={locale}
                    totalDataSize={students?.length}
                />
            </Modal.Body>
            <Modal.Footer className='text-center'>
                <button
                    className="btn m-btn--pill btn-link m-btn m-btn--custom margin-right-5"
                    onClick={onClose}
                >
                    {t('back') || null}
                </button>
                <button
                    onClick={onClickSubmit}
                    className="btn m-btn--pill btn-success m-btn--wide m-btn--uppercase"
                >
                    {t('save') || null}
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
    )
}

export default addStudent