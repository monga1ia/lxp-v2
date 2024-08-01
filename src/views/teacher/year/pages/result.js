import {useState} from 'react'
import message from 'modules/message'
import React, {useEffect} from 'react'
import secureLocalStorage from 'react-secure-storage'
import {fetchRequest} from 'utils/fetchRequest'
import {translations} from 'utils/translations'
import {useLocation, useNavigate} from 'react-router'
// import {teacherJournalExamPublish, teacherJournalExamResult} from 'utils/url'
import {Col, Row} from "react-bootstrap";
import DTable from 'modules/DataTable/DTable'
import {NDropdown as Dropdown} from 'widgets/Dropdown'
import PublishModal from './modal/publish'
import {Checkbox} from "semantic-ui-react";

import Tooltip, {tooltipClasses} from '@mui/material/Tooltip';
import {styled} from '@mui/material/styles';
import CustomInlineEdit from "Src/CustomInlineEdit";

const HtmlTooltip = styled(({className, ...props}) => (
    <Tooltip {...props} classes={{popper: className}} arrow/>
))(({theme}) => ({
    [`& .${tooltipClasses.arrow}`]: {
        color: 'white',
    },
    [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: 'white',
        color: '#000',
        padding: '10px 15px',
        fontSize: theme.typography.pxToRem(12),
        boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)'
    },
}));

const result = () => {
    const location = useLocation()
    const navigate = useNavigate()

    const locale = secureLocalStorage?.getItem('selectedLang') || 'mn'
    const [loading, setLoading] = useState(false)

    const [title, setTitle] = useState('')
    const [classData, setClassData] = useState([])
    const [studentsData, setStudentsData] = useState([])

    const [examTypes, setExamTypes] = useState([])
    const [itemList, setItemList] = useState([])
    const [exam, setExam] = useState(null)
    const [isPublish, setIsPublish] = useState(null)
    const [isRank, setIsRank] = useState(true)
    const [urlData] = useState(location?.state?.urlData || null)
    const [showPublishModal, setShowPublishModal] = useState(false)
    const [seasons, setSeasons] = useState([])
    const [canEdit, setCanEdit] = useState(false)

    const config = {
        showFilter: true,
        showAllData: true,
        showPagination: false,
        excelExport: true,
        excelFileRemote: true,
        excelFileRemoteUrl: `/api/exam/result-export?exam=${location?.state?.id}`,
        defaultSort: [{dataField: 'firstName', order: 'asc'}],
    }

    const getColumns = () => {
        const cols = [
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
            }
        ]

        if (itemList && itemList.length > 0) {
            for (let i = 0; i < itemList.length; i++) {
                cols.push(
                    {
                        dataField: 'item_' + itemList[i].key,
                        text: itemList[i].text,
                        align: 'right',
                        sort: true,
                        style: {
                            padding: 0
                        },
                        headerStyle: {
                            padding: 0
                        },
                        headerFormatter: (cell) => {
                            if (itemList && itemList.length > 0) {
                                return <div>
                                    <p style={{
                                        paddingTop: '0.75rem',
                                        paddingLeft: '0.75rem',
                                        paddingRight: '0.75rem'
                                    }}>{itemList[i].text}</p>
                                    <p style={{
                                        borderTop: 'solid 1px #eee',
                                        paddingTop: '0.75rem',
                                        paddingLeft: '0.75rem',
                                        paddingRight: '0.75rem'
                                    }}>{itemList[i].min}-{itemList[i].score}</p>
                                </div>
                            } else {
                                return <div>
                                    <p>{itemList[i].text}</p>
                                </div>
                            }
                        },
                        formatter: (cell, row) => {
                            const itemHistory = row['item_history_' + itemList[i].key];
                            if (itemHistory && itemHistory.length > 0) {
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
                                                itemHistory?.map((obj, r) => {
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
                                        {cell}
                                    </div>
                                </HtmlTooltip>
                            } else {
                                return <div style={{
                                    padding: '.75rem'
                                }}>
                                    {cell}
                                </div>
                            }
                        }
                    })
            }
        }

        if (seasons && seasons.length > 0) {
            for (let s = 0; s < seasons.length; s++) {
                cols.push(
                    {
                        dataField: seasons[s].id_with_type,
                        text: seasons[s].name,
                        align: 'right',
                        sort: true
                    })
            }
        }
        cols.push({
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
        })
        cols.push({
            dataField: 'scoreTypeCode',
            text: translations(locale)?.score_type,
            sort: true,
        })
        if (isRank) {
            cols.push({
                dataField: 'ranking',
                text: translations(locale)?.exam?.ranking,
                sort: true
            })
        }
        return cols;
    }

    useEffect(() => {
        if (!location?.state?.id) {
            message(translations(locale)?.exam?.notFound)
            navigate(urlData ? urlData.backUrl : -1, {replace: true})
        }
    }, [])

    // useEffect(() => {
    //     setLoading(true)
    //     fetchRequest(teacherJournalExamResult, 'POST', {exam: location?.state?.id})
    //         .then((res) => {
    //             if (res.success) {
    //                 const {title, studentList, examList} = res.data
    //                 setExam(res?.data?.exam || null)
    //                 setItemList(res?.data?.itemList || [])
    //                 setExamTypes(res?.data?.examTypes || [])
    //                 setTitle(title || '')
    //                 setClassData(examList || [])
    //                 setStudentsData(studentList || [])
    //                 setIsPublish(res?.data?.isPublish)
    //                 setIsRank(res?.data?.isRank)
    //                 setSeasons(res?.data?.seasons)
    //                 setCanEdit(res?.data?.canEdit || false)
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

    const handlePublishSubmit = () => {
        setShowPublishModal(true)
    }

    const handlePublish = () => {
        console.log('handlePublish')
        // setLoading(true)
        // fetchRequest(teacherJournalExamPublish, 'POST', {exam: location?.state?.id})
        //     .then((res) => {
        //         if (res.success) {
        //             navigate('/teacher/year', {
        //                 state: {}, replace: true
        //             })
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

    const isItemChecked = (seasonId = null, dtlId = null) => {
        const seasonMixes = exam?.seasonMix || [];

        let isChecked = false;
        for (let sm = 0; sm < seasonMixes.length; sm++) {
            if (seasonMixes[sm].id?.toString() === seasonId?.toString()) {
                const details = seasonMixes[sm].details;
                for (let d = 0; d < details.length; d++) {
                    if (details[d].templateDtl?.toString() === dtlId?.toString()) {
                        isChecked = true;
                        break;
                    }
                }
                break;
            }
        }
        return isChecked;
    }

    const itemExamTypes = (seasonId = null, dtlId = null) => {
        const seasonMixes = exam?.seasonMix || [];

        let examTypeList = [];
        for (let sm = 0; sm < seasonMixes.length; sm++) {
            if (seasonMixes[sm].id?.toString() === seasonId?.toString()) {
                const details = seasonMixes[sm].details;
                for (let d = 0; d < details.length; d++) {
                    if (details[d].templateDtl?.toString() === dtlId?.toString()
                        && details[d].isExam) {
                        examTypeList = details[d].examTypes;
                        break;
                    }
                }
                break;
            }
        }
        return examTypeList;
    }

    return (
        <div className='m-grid__item m-grid__item--fluid m-wrapper'>
            <div className='m-portlet'>
                <div className='m-portlet__head justify-content-between align-items-center pr-0 pl-4'>
                    <span className='fs-11 pinnacle-bold' style={{color: '#ff5b1d'}}>{title}</span>
                    <button className='btn m-btn--pill btn-link m-btn m-btn--custom'
                            onClick={() => navigate(urlData ? urlData.backUrl : '/teacher/journals', {
                                replace: true,
                                state: {parameters: urlData?.parameters, group: urlData?.group}
                            })}>
                        {translations(locale)?.back_to_list}
                    </button>
                </div>
                <div className='m-portlet__body'>
                    {
                        exam && <div className='border-orange br-08 p-4 mb-2'>
                            <Row className='form-group'>
                                <Col md={2}/>
                                <Col>
                                    <Row className='form-group'>
                                        <Col md={4} className='text-right label-pinnacle-bold'>
                                            {translations(locale)?.className}
                                        </Col>
                                        <Col md={8} className='d-flex flex-column'>
                                            <span>{exam?.group?.subjectName}</span>
                                            <span className='bolder'>{exam?.group?.groupName}</span>
                                            <span style={{textDecoration: 'underline'}}>{exam?.group?.classes}</span>
                                        </Col>
                                    </Row>
                                </Col>
                                <Col md={2}/>
                            </Row>
                            <Row>
                                <Col md={2}/>
                                <Col>
                                    <Row className='form-group'>
                                        <Col md={4} className='col-form-label text-right label-pinnacle-bold'>
                                            {translations(locale)?.score_type}*
                                        </Col>
                                        <Col md={8}>
                                            <Row>
                                                <Col md={6}>
                                                    <input
                                                        disabled
                                                        value={exam?.scoreType}
                                                        className='form-control'
                                                    />
                                                </Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                    <Row className='form-group'>
                                        <Col md={4} className='col-form-label text-right label-pinnacle-bold'>
                                            {translations(locale)?.season_score?.method}
                                        </Col>
                                        <Col md={8}>
                                            <Row>
                                                <Col md={6}>
                                                    <input
                                                        disabled
                                                        value={exam?.calc}
                                                        className='form-control'
                                                    />
                                                </Col>
                                            </Row>
                                        </Col>
                                    </Row>

                                    <Row className='form-group'>
                                        <Col md={4} className='col-form-label text-right label-pinnacle-bold'/>
                                        <Col md={8}>
                                            <Checkbox
                                                disabled={true}
                                                checked={exam?.rank}
                                                label={translations(locale)?.school_settings?.is_ranked}
                                                onChange={() => {
                                                }}
                                            />
                                        </Col>
                                    </Row>

                                    {
                                        exam?.weights && exam?.weights.length > 0 &&
                                        <Row className='form-group'>
                                            <Col md={4} className='col-form-label text-right label-pinnacle-bold'>
                                                {translations(locale)?.season}
                                            </Col>
                                            <Col md={8}>
                                                {
                                                    exam.weights.map((weightObj, i) => {
                                                        return <Row key={'season_' + i} className='form-group'>
                                                            <Col>
                                                                <input
                                                                    type='text'
                                                                    disabled={true}
                                                                    className='form-control'
                                                                    value={weightObj?.seasonName}
                                                                    placeholder={translations(locale)?.school_settings?.weight}
                                                                    onChange={() => {
                                                                    }}
                                                                />
                                                            </Col>
                                                            <Col>
                                                                {
                                                                    exam?.calcCode === 'WEIGHT' && <input
                                                                        type='number'
                                                                        disabled={true}
                                                                        className='form-control'
                                                                        value={weightObj?.weight}
                                                                        placeholder={translations(locale)?.school_settings?.weight}
                                                                        onChange={() => {
                                                                        }}
                                                                    />
                                                                }
                                                            </Col>
                                                        </Row>
                                                    })
                                                }
                                            </Col>
                                        </Row>
                                    }

                                    {
                                        exam?.stTemplate && <Row className='form-group'>
                                            <Col md={4} className='col-form-label text-right label-pinnacle-bold'>
                                                {translations(locale)?.scoreSchema}
                                            </Col>
                                            <Col md={8}>
                                                <Row>
                                                    <Col md={6}>
                                                        <input
                                                            disabled
                                                            value={exam?.stTemplateName}
                                                            className='form-control'
                                                        />
                                                    </Col>
                                                </Row>
                                            </Col>
                                        </Row>
                                    }

                                    {
                                        exam?.stTemplate && itemList && itemList.length > 0 && exam?.seasonMix && exam?.seasonMix?.length > 0 && <>
                                            {
                                                exam?.seasonMix?.map(seasonObj => {
                                                    return <Row key={'season_' + seasonObj.id} className={'form-group'}>
                                                        <Col md={4}
                                                             className='col-form-label text-right label-pinnacle-bold'>
                                                            {seasonObj?.seasonName}
                                                        </Col>
                                                        <Col md={8}>
                                                            {
                                                                itemList?.map(itemObj => {
                                                                    return <Row
                                                                        key={'season_' + seasonObj?.id + '_' + itemObj?.key}>
                                                                        <Col md={'auto'} style={{
                                                                            minWidth: 250
                                                                        }}>
                                                                            <Checkbox
                                                                                disabled={true}
                                                                                checked={isItemChecked(seasonObj.id, itemObj.dtl)}
                                                                                className={'col-form-label'}
                                                                                label={itemObj?.text}
                                                                                onChange={() => {
                                                                                }}
                                                                            />
                                                                        </Col>
                                                                        <Col>
                                                                            {
                                                                                itemExamTypes(seasonObj.id, itemObj.dtl)?.length > 0 && <>
                                                                                    <Dropdown
                                                                                        fluid
                                                                                        selection
                                                                                        disabled={true}
                                                                                        closeOnChange
                                                                                        multiple={true}
                                                                                        options={examTypes?.map(obj => {
                                                                                            return {
                                                                                                value: obj?.id,
                                                                                                text: obj?.name
                                                                                            }
                                                                                        })}
                                                                                        value={itemExamTypes(seasonObj.id, itemObj.dtl)}
                                                                                        placeholder={'-' + translations(locale)?.select + '-'}
                                                                                        onChange={() => {
                                                                                        }}
                                                                                    />
                                                                                </>
                                                                            }
                                                                        </Col>
                                                                    </Row>
                                                                })
                                                            }
                                                        </Col>
                                                    </Row>
                                                })
                                            }
                                        </>
                                    }
                                </Col>
                                <Col md={2}/>
                            </Row>
                        </div>
                    }


                    <div className='border-orange br-08 p-4 mb-2'>
                        <Row>
                            <Col md={2}/>
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
                                                        {el?.class || '-'}
                                                        {/* </button> */}
                                                    </td>
                                                    <td className='align-right'>
                                                        {el?.female || '-'}
                                                    </td>
                                                    <td className='align-right'>
                                                        {el?.male || '-'}
                                                    </td>
                                                </tr>
                                            ))
                                            : <tr>
                                                <td colSpan={4}
                                                    className='text-center'>{translations(locale)?.action?.emptyTable}</td>
                                            </tr>
                                    }
                                    </tbody>
                                </table>
                            </Col>
                            <Col md={2}/>
                        </Row>
                    </div>

                    <div className='border-orange br-08 px-4'>
                        <DTable
                            locale={locale}
                            config={config}
                            columns={getColumns()}
                            data={studentsData}
                        />
                    </div>
                </div>
                <div className='m-portlet__foot text-center'>
                    <button className='btn m-btn--pill btn-link m-btn m-btn--custom'
                            onClick={() => navigate(urlData ? urlData.backUrl : '/teacher/journals', {
                                replace: true,
                                state: {parameters: urlData?.parameters, group: urlData?.group}
                            })}>
                        {translations(locale)?.back_to_list}
                    </button>
                    {
                        canEdit === true && isPublish === false &&
                        <button
                            className='btn m-btn--pill btn-publish text-uppercase'
                            onClick={() => handlePublishSubmit()}
                        >
                            {translations(locale)?.action?.publish}
                        </button>
                    }
                </div>
            </div>
            {
                loading &&
                <>
                    <div className='blockUI blockOverlay'/>
                    <div className='blockUI blockMsg blockPage'>
                        <div className='m-loader m-loader--brand m-loader--lg'/>
                    </div>
                </>
            }
            {
                showPublishModal &&
                <PublishModal
                    onSubmit={handlePublish}
                    onClose={() => setShowPublishModal(false)}
                />
            }
        </div>
    )
}

export default result