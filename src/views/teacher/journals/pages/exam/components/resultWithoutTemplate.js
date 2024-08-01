import React, { useState } from 'react'
import { Col, Row } from 'react-bootstrap'
import ViewModal from '../modal/exam/examView'
import DTable from 'modules/DataTable/DTable'
import secureLocalStorage from 'react-secure-storage'
import { translations } from 'utils/translations'
import {Checkbox} from "semantic-ui-react";

const resultWithoutTemplate = ({ studentsData, classData, exam, urlData = null, onClose}) => {

    const locale = secureLocalStorage?.getItem('selectedLang') || 'mn'

    const [showViewModal, setShowViewModal] = useState(false)

    const config = {
        showFilter: true,
        showAllData: true,
        showPagination: false,
        excelExport: true,
        excelFileRemote: true,
        excelFileRemoteUrl: `/api/exam/result-export?exam=${exam?.id}`,
        defaultSort: [{ dataField: 'firstName', order: 'asc' }],
    }

    const columns = [
        {
            dataField: 'className',
            text: translations(locale)?.class_name,
            sort: true
        },
        {
            dataField: 'studentCode',
            text: translations(locale)?.studentCode,
            sort: true
        },
        {
            dataField: 'lastName',
            text: translations(locale)?.studentLastName,
            sort: true
        },
        {
            dataField: 'firstName',
            text: translations(locale)?.studentFirstName,
            sort: true
        },
        {
            dataField: 'takenScore',
            text: translations(locale)?.exam?.taken_score,
            sort: true,
            align: 'right',
            style: {
                padding: 0
            },
            formatter: (cell, row) => {
                const dtlHistory = row['examDtlHistory'];
                if (dtlHistory && dtlHistory.length > 0) {
                    return <HtmlTooltip
                        placement="top"
                        slotProps={{
                            popper: {
                                modifiers: [
                                    {
                                        name: 'offset',
                                        options: {
                                            offset: [0, -14],
                                        },
                                    },
                                ],
                            },
                        }}
                        title={
                            <React.Fragment>
                                {
                                    dtlHistory?.map((obj, r) => {
                                        return <p
                                            key={'row_' + r}
                                            style={{
                                                fontFamily: 'MulishRegular',
                                                fontSize: '1rem',
                                                marginBottom: 5
                                            }}>{obj.date} | <span style={{
                                            color: '#ff2f1a',
                                            fontFamily: 'MulishBold'
                                        }}>{obj.user}</span> | <span>{obj?.from}</span> &rarr; {obj?.to}</p>
                                    })
                                }
                            </React.Fragment>
                        }
                    >
                        <div style={{
                            padding: '.75rem',
                            backgroundColor: '#FDF5F1'
                        }}>
                            {exam?.scoreTypeCode === 'PRIMARY' ? row?.scoreTypeName : cell}
                        </div>
                    </HtmlTooltip>
                } else {
                    return <div style={{
                        padding: '.75rem'
                    }}>
                        {exam?.scoreTypeCode === 'PRIMARY' ? row?.scoreTypeName : cell}
                    </div>
                }
            }
        },
        {
            dataField: 'studentScore',
            text: translations(locale)?.season_score?.performance,
            sort: true,
            align: 'right',
            style: {
                padding: 0
            },
            formatter: (cell, row) => {
                const dtlHistory = row['examDtlHistory'];
                if (dtlHistory && dtlHistory.length > 0) {
                    return <HtmlTooltip
                        placement="top"
                        slotProps={{
                            popper: {
                                modifiers: [
                                    {
                                        name: 'offset',
                                        options: {
                                            offset: [0, -14],
                                        },
                                    },
                                ],
                            },
                        }}
                        title={
                            <React.Fragment>
                                {
                                    dtlHistory?.map((obj, r) => {
                                        return <p
                                            key={'row_' + r}
                                            style={{
                                                fontFamily: 'MulishRegular',
                                                fontSize: '1rem',
                                                marginBottom: 5
                                            }}>{obj.date} | <span style={{
                                            color: '#ff2f1a',
                                            fontFamily: 'MulishBold'
                                        }}>{obj.user}</span> | <span>{obj?.from}</span> &rarr; {obj?.to}</p>
                                    })
                                }
                            </React.Fragment>
                        }
                    >
                        <div style={{
                            padding: '.75rem',
                            backgroundColor: '#FDF5F1'
                        }}>
                            {exam?.scoreTypeCode === 'PRIMARY' ? row?.scoreTypeName : cell}
                        </div>
                    </HtmlTooltip>
                } else {
                    return <div style={{
                        padding: '.75rem'
                    }}>
                        {exam?.scoreTypeCode === 'PRIMARY' ? row?.scoreTypeName : cell}
                    </div>
                }
            }
        },
        {
            dataField: 'ranking',
            text: translations(locale)?.exam?.ranking,
            sort: true,
            align: 'right',
        }
    ]

    const styles = {
        btn: {
            padding: 10,
            minWidth: 35,
            minHeight: 35,
            border: 'none',
            color: 'white',
            borderRadius: 6,
            cursor: 'pointer',
            fontFamily: 'MulishBold',
            backgroundColor: '#0275d8',
        }
    }

    const handleScoreClick = () => setShowViewModal(true)

    return (
        <>
            <div className='m-portlet__body'>
                {
                    exam && <div className='border-orange br-08 p-4 mb-2 mx-4'>
                        <Row>
                            <Col md={2} />
                            <Col>
                                <Row className='form-group'>
                                    <Col md={4} className='col-form-label text-right label-pinnacle-bold'>
                                        {translations(locale)?.score_type}*
                                    </Col>
                                    <Col md={8}>
                                        <input
                                            disabled
                                            value={exam?.scoreType}
                                            className='form-control'
                                        />
                                    </Col>
                                </Row>
                                <Row className='form-group'>
                                    <Col md={4} className='col-form-label text-right label-pinnacle-bold'>
                                        {translations(locale)?.season_score?.method}
                                    </Col>
                                    <Col md={8}>
                                        <input
                                            disabled
                                            value={exam?.calc}
                                            className='form-control'
                                        />
                                    </Col>
                                </Row>
                                {
                                    exam?.weights && exam?.weights.length > 0 &&
                                    <Row className='form-group'>
                                        <Col md={4} className='col-form-label text-right label-pinnacle-bold'>
                                        </Col>
                                        <Col md={8}>
                                            {
                                                exam.weights.map((weightObj, i) => {
                                                    return <Row key={'season_' + i} className='form-group'>
                                                        <Col className={'col-form-label text-right'}>{weightObj?.seasonName}</Col>
                                                        <Col>
                                                            <input
                                                                type='number'
                                                                disabled={true}
                                                                className='form-control'
                                                                value={weightObj?.weight}
                                                                placeholder={translations(locale)?.school_settings?.weight}
                                                                onChange={() => {}}
                                                            />
                                                        </Col>
                                                        <Col></Col>
                                                    </Row>
                                                })
                                            }
                                        </Col>
                                    </Row>
                                }
                                <Row className='form-group'>
                                    <Col md={4} className='col-form-label text-right label-pinnacle-bold'/>
                                    <Col md={8}>
                                        <Checkbox
                                            disabled={true}
                                            checked={exam?.rank}
                                            label={translations(locale)?.school_settings?.is_ranked}
                                            onChange={() => {}}
                                        />
                                    </Col>
                                </Row>
                            </Col>
                            <Col md={4} />
                        </Row>
                    </div>
                }
                <div className='border-orange br-08 p-4 mb-2 mx-4'>
                    <Row>
                        <Col md={2} />
                        <Col>
                            <table className='table table-bordered react-bootstrap-table'>
                                <thead>
                                    <tr>
                                        <th></th>
                                        <th>{translations(locale)?.class?.title}</th>
                                        <th>{translations(locale)?.class?.girls}</th>
                                        <th>{translations(locale)?.class?.boys}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        classData?.length
                                            ? classData?.map((el, key) => (
                                                <tr key={key}>
                                                    <td>{el?.text}</td>
                                                    <td className='align-right'>
                                                        {/* <button style={styles.btn} onClick={handleScoreClick}> */}
                                                        {el?.class}
                                                        {/* </button> */}
                                                    </td>
                                                    <td className='align-right'>
                                                        {el?.female}
                                                    </td>
                                                    <td className='align-right'>
                                                        {el?.male}
                                                    </td>
                                                </tr>
                                            ))
                                            : <tr><td colSpan={4} className='text-center'>{translations(locale)?.action?.emptyTable}</td></tr>
                                    }
                                </tbody>
                            </table>
                        </Col>
                        <Col md={2} />
                    </Row>
                </div>
                <div className='border-orange br-08 px-4 mb-4 mx-4'>
                    <DTable
                        locale={locale}
                        config={config}
                        columns={columns}
                        className={'table-striped'}
                        data={studentsData}
                    />
                </div>
            </div>
            <div className='modal-footer'>
                <button
                    className='btn m-btn--pill btn-outline-metal text-uppercase'
                    onClick={onClose}
                >
                    {translations(locale)?.close}
                </button>
                <button 
                    className='btn m-btn--pill btn-link m-btn m-btn--custom' 
                    onClick={onClose}
                    // onClick={() => navigate(urlData ? urlData.backUrl :'/teacher/journals', { replace: true,  state: {parameters: urlData?.parameters, group: urlData?.group} })}
                >
                    {translations(locale)?.back_to_list}
                </button>
            </div>
            {
                showViewModal &&
                <ViewModal
                    onClose={() => setShowViewModal(false)}
                />
            }
        </>
    )
}

export default resultWithoutTemplate