import message from 'modules/message'
import React, { useState, useRef, useImperativeHandle, useEffect } from 'react'
import { Modal } from 'react-bootstrap'
import { Col, Row } from 'react-bootstrap'
import secureLocalStorage from 'react-secure-storage'
import { useTranslation } from "react-i18next";
import { cloneDeep } from 'lodash'
import DTable from 'modules/DataTable/DTable'

const locale = secureLocalStorage?.getItem('selectedLang') || 'mn'

const config = {
    showPagination: false,
    showAllData: true,
    defaultSort: [{
        dataField: 'esisFirstName',
        order: 'asc'
    }]
}

const loginNameChange = ({ onClose, onSubmit, data }) => {
    
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false)
    const [tableData, setTableData] = useState([])

    useEffect(() => {
        setLoading(true)

        setTableData((cloneDeep(data) || []).map(obj => {
            return {
                ...obj,
                ...{ eschoolFirstName: obj?.eschoolFirstName || obj?.eschoolTmpFirstName },
                ...{ eschoolLastName: obj?.eschoolLastName || obj?.eschoolTmpLastName },
                ...{ eschoolTitle: obj?.eschoolTitle || obj?.esisTitle },
            }
        }))
        setTimeout(() => {
            setLoading(false)
        }, 100)
    }, [data])

    // useImperativeHandle(ref, () => ({
    //     submit() {
    //         onSubmit(JSON.stringify(tableData.filter(obj => {
    //             return obj.eschoolLoginName && obj.eschoolLoginName.length > 0
    //         })))
    //     }
    // }))

    const columns = [
        {
            dataField: 'esisId',
            text: 'ESIS ID',
            sort: true
        },
        {
            dataField: 'esisShortName',
            text: t('esis.shortName'),
            sort: true
        },
        {
            dataField: 'esisLastName',
            text: t('studentBook.parent_name'),
            sort: true,
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
            dataField: 'eschoolCode',
            text: t('esis.eschoolCode'),
            style: { padding: 2 },
            formatter: (cell, row) =>
                <input
                    autoFocus
                    type='text'
                    value={cell}
                    className='form-control'
                    onChange={(e) => handleChange(row?.id, 'eschoolCode', e?.target?.value)}
                />
        },
        {
            dataField: 'eschoolLastName',
            text: t('esis.eschoolLastName'),
            style: { padding: 2 },
            formatter: (cell, row) =>
                <input
                    autoFocus
                    type='text'
                    value={cell}
                    className='form-control'
                    onChange={(e) => handleChange(row?.id, 'eschoolLastName', e?.target?.value)}
                />
        },
        {
            dataField: 'eschoolFirstName',
            text: t('esis.eschoolFirstName'),
            style: { padding: 2 },
            formatter: (cell, row) =>
                <input
                    autoFocus
                    type='text'
                    value={cell}
                    className='form-control'
                    onChange={(e) => handleChange(row?.id, 'eschoolFirstName', e?.target?.value)}
                />
        },
        {
            dataField: 'eschoolTitle',
            text: t('esis.eschoolTitle'),
            style: { padding: 2 },
            formatter: (cell, row) =>
                <input
                    autoFocus
                    type='text'
                    value={cell}
                    className='form-control'
                    onChange={(e) => handleChange(row?.id, 'eschoolTitle', e?.target?.value)}
                />
        },
        {
            dataField: 'eschoolLoginName',
            text: t('teacher.login_name'),
            style: { padding: 2 },
            formatter: (cell, row) =>
                <input
                    autoFocus
                    type='text'
                    value={cell}
                    className='form-control'
                    onChange={(e) => handleChange(row?.id, 'eschoolLoginName', e?.target?.value)}
                />
        }
    ]

    const handleChange = (id, name, value) => {
        const clone = [...tableData]
        const employee = clone?.find(el => el?.id == id)
        employee[name] = value
        setTableData(clone)
    }

    const handleSave = () => {
        console.log('handlesave')
        onSubmit()
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
                    {t('action.create_user')}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <DTable
                    config={config}
                    locale={locale}
                    data={tableData}
                    columns={columns}
                    wrapperClassName='overflowXVisible'
                />
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
                    onClick={handleSave}
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

export default loginNameChange