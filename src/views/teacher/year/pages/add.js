import {useState, useRef} from 'react'
import message from 'modules/message'
import React, {useEffect} from 'react'
import {Col, Row} from 'react-bootstrap'
import {Checkbox} from 'semantic-ui-react'
import secureLocalStorage from 'react-secure-storage'
import {fetchRequest} from 'utils/fetchRequest'
import {translations} from 'utils/translations'
import {NDropdown as Dropdown} from 'widgets/Dropdown'
import { Modal } from 'react-bootstrap'
// import {teacherJournalSeasonResultSubmit, teacherYearResultInit, teacherYearResultStTemplateDetail} from 'Utilities/url'

const locale = secureLocalStorage?.getItem('selectedLang') || 'mn'

const YearAdd = ({onClose, data, show}) => {
    const fileInputRef = useRef(null)

    const [loading, setLoading] = useState(false)

    const [title, setTitle] = useState('')
    const [group, setGroup] = useState({})
    const [result, setResult] = useState({})

    const [methods, setMethods] = useState([])
    const [methodOptions, setMethodOptions] = useState([])
    const [scoreTypeOptions, setScoreTypeOptions] = useState([])
    const [seasonOptions, setSeasonOptions] = useState([])
    const [seasonWeights, setSeasonWeights] = useState([])
    const [stTemplates, setStTemplates] = useState([])
    const [stTemplateDetails, setStTemplateDetails] = useState([])
    const [selectedStTemplateDetail, setSelectedStTemplateDetail] = useState([])

    const [file, setFile] = useState(null)

    const [updateView, setUpdateView] = useState(false)

    useEffect(() => {
        init()
    }, [])

    const init = () => {
        console.log('init')
        // setLoading(true)
        // fetchRequest(teacherYearResultInit, 'POST', {
        //     group: data?.id,
        //     season: data?.season,
        //     yearType: data?.yearType
        // })
        //     .then((res) => {
        //         if (res.success) {
        //             const {calcMethods, scoreTypes, group, seasons, templates} = res.data
        //             setGroup(group || {})
        //             setScoreTypeOptions(scoreTypes.map(obj => {
        //                 return {
        //                     value: obj?.id,
        //                     text: obj?.name,
        //                     code: obj?.code
        //                 }
        //             }))
        //             setMethods(calcMethods)
        //             setMethodOptions(calcMethods.map(obj => {
        //                 return {
        //                     value: obj?.id,
        //                     text: obj?.name,
        //                 }
        //             }))
        //             setTitle(`${group?.subjectName}, ${group?.groupName}, ${group?.classList?.map(el => el?.className)?.join(', ')}` || '')
        //             setSeasonOptions(seasons)
        //             setStTemplates(templates?.map(el => ({value: el?.id, text: el?.name})) || [])
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

    const handleSubmit = () => {

        console.log('handleSubmit')
        // if (validateFields()) {
        //     setLoading(true)
        //     fetchRequest(teacherJournalSeasonResultSubmit, 'POST', {
        //         submit: 1,
        //         yearType: data?.yearType || null,
        //         scoreType: result?.scoreType,
        //         group: data?.id,
        //         season: data?.season, // hicheeliin jil id
        //         selectedSeason: JSON.stringify(result?.seasonIds), // tatah uliral id
        //         rank: result?.isCalculateRank ? 1 : 0,
        //         calc: result?.method,
        //         weights: JSON.stringify(seasonWeights),
        //         stTemplate: result?.stTemplate,
        //         stTemplateDetail: JSON.stringify(selectedStTemplateDetail)
        //     })
        //         .then((res) => {
        //             if (res.success) {
        //                 message(res.data.message, res.success)
        //                 if (res?.data?.calcType) {
        //                     if (res?.data?.calcType !== 'MANUAL') {
        //                         if (res?.data?.calcType === 'SEASON_MIX') {
        //                             navigate('/teacher/year/edit', {
        //                                 state: {
        //                                     season: data?.season,
        //                                     group: data?.id,
        //                                     exam: res.data.exam,
        //                                     id: data?.id,
        //                                     title
        //                                 }
        //                             })
        //                         } else {
        //                             navigate('/teacher/year/result', {
        //                                 state: {
        //                                     season: data?.season,
        //                                     id: res.data.exam,
        //                                     urlData: {backUrl: '/teacher/year'}
        //                                 }
        //                             })
        //                         }
        //                     } else {
        //                         navigate('/teacher/year/edit', {
        //                             state: {
        //                                 season: data?.season,
        //                                 group: data?.id,
        //                                 exam: res.data.exam,
        //                                 id: data?.id,
        //                                 title
        //                             }
        //                         })
        //                     }
        //                 } else {
        //                     navigate('/teacher/year/edit', {
        //                         state: {
        //                             season: data?.season,
        //                             group: data?.id,
        //                             exam: res.data.exam,
        //                             id: data?.id,
        //                             title
        //                         }
        //                     })
        //                 }
        //             } else {
        //                 message(res.data.message)
        //             }
        //             setLoading(false)
        //         })
        //         .catch(() => {
        //             message(translations(locale)?.err?.error_occurred)
        //             setLoading(false)
        //         })
        // }
    }

    const submitExcel = () => {
        console.log('submitExcel')
        // if (validateFields()) {
        //     setLoading(true)
        //     const formData = new FormData();
        //     formData.append('submit', 1);
        //     formData.append('scoreType', result?.scoreType);
        //     formData.append('group', data?.id);
        //     formData.append('yearType', data?.yearType);
        //     formData.append('season', data?.season);
        //     formData.append('rank', result?.isCalculateRank ? 1 : 0);
        //     formData.append('calc', result?.method);
        //     formData.append('file', file);
        //     fetchRequest(teacherJournalSeasonResultSubmit, 'POST', formData, true, true)
        //         .then((res) => {
        //             if (res.success) {
        //                 message(res.data.message, res.success)
        //                 if (res?.data?.calcType && res?.data?.calcType !== 'MANUAL') {
        //                     if (res?.data?.calcType !== 'EXCEL') {
        //                         navigate('/teacher/year/result', {
        //                             state: {
        //                                 season: data?.season,
        //                                 id: res.data.exam,
        //                                 urlData: {backUrl: '/teacher/year'}
        //                             }
        //                         })
        //                     } else {
        //                         navigate('/teacher/year/edit', {
        //                             state: {
        //                                 season: data?.season,
        //                                 group: data?.id,
        //                                 exam: res.data.exam,
        //                                 id: data?.id,
        //                                 title
        //                             }
        //                         })
        //                     }
        //                 } else {
        //                     navigate('/teacher/year/edit', {
        //                         state: {
        //                             season: data?.season,
        //                             group: data?.id,
        //                             exam: res.data.exam,
        //                             id: data?.id,
        //                             title
        //                         }
        //                     })
        //                 }
        //             } else {
        //                 message(res.data.message)
        //             }
        //             setLoading(false)
        //         })
        //         .catch(() => {
        //             message(translations(locale)?.err?.error_occurred)
        //             setLoading(false)
        //         })
        // }
    }

    const validateFields = () => {
        // if (!result?.scoreType)
        //     return message(translations(locale)?.err?.fill_all_fields)

        if (scoreTypeOptions.find(obj => {
            return obj?.value === result?.scoreType
        })?.code !== 'PRIMARY') {
            if (!result?.method)
                return message(translations(locale)?.err?.fill_all_fields)

            const methodCode = getMethodCode(result?.method);
            if (methodCode === 'MANUAL'
                || methodCode === 'EXCEL'
                || methodCode === 'SEASON_MIX') {
                if (methodCode === 'EXCEL') {
                    if (!file) {
                        return message(translations(locale)?.err?.file_empty)
                    } else {
                        return true;
                    }
                } else {
                    if (methodCode === 'SEASON_MIX') {
                        if (!result?.stTemplate) {
                            return message(translations(locale)?.err?.fill_all_fields)
                        }
                        if (selectedStTemplateDetail?.length > 0) {
                            let hasExamError = false;
                            for (let d = 0; d < selectedStTemplateDetail?.length; d++) {
                                const obj = selectedStTemplateDetail[d]
                                if (obj.isExam && (!obj.examTypes || obj?.examTypes?.length === 0)) {
                                    hasExamError = true;
                                    break;
                                }
                            }
                            if (hasExamError) {
                                return message(translations(locale)?.exam_template?.select_exam_type)
                            } else {
                                return true;
                            }
                        } else {
                            return message(translations(locale)?.season_score?.select_score_template_dtl)
                        }
                    } else {
                        return true
                    }
                }
            } else {
                if (result?.seasonIds && result?.seasonIds.length > 0) {
                    if (methodCode === 'WEIGHT') {
                        if (seasonWeights && seasonWeights.length > 0) {
                            let totalWeight = 0;
                            for (let sw = 0; sw < seasonWeights.length; sw++) {
                                const seasonWeightObj = seasonWeights[sw];
                                if (seasonWeightObj.weight) {
                                    totalWeight += parseFloat(seasonWeightObj.weight)
                                }
                            }
                            if (totalWeight !== 100) {
                                return message(translations(locale)?.exam?.weightError)
                            } else {
                                return true
                            }
                        } else {
                            return message(translations(locale)?.exam?.weightEmpty)
                        }
                    } else {
                        return true
                    }
                } else {
                    return message(translations(locale)?.season_score?.select_season)
                }
            }
        } else {
            return true;
        }
    }

    const handleChange = (name, value) => setResult({...result, [name]: value})

    const handleSeasonRow = (seasonIds) => {
        const newRows = seasonWeights;

        if (newRows && newRows?.length > 0) {
            for (let nr = 0; nr < newRows?.length; nr++) {
                if (seasonIds.indexOf(newRows[nr]?.season) < 0) {
                    newRows.splice(nr, 1);
                }
            }
        }

        for (let sId = 0; sId < seasonIds.length; sId++) {
            const seasonWeightObj = newRows.find(s => {
                return s?.season === seasonIds[sId]
            });
            if (!seasonWeightObj) {
                newRows.push({
                    season: seasonIds[sId],
                    weight: ''
                })
            }
        }
        setSeasonWeights(newRows)
    }

    const handleChangeWeight = (seasonId, value) => {
        const updateWeights = seasonWeights;
        for (let w = 0; w < updateWeights.length; w++) {
            let updateObj = updateWeights[w];
            if (updateObj?.season === seasonId) {
                if (value) {
                    if (parseFloat(value) <= 100
                        && parseFloat(value) >= 0) {
                        updateObj.weight = value;
                    }
                } else {
                    updateObj.weight = value;
                }

                break;
            }
        }
        setSeasonWeights(updateWeights);

        setUpdateView(!updateView)
    }

    const getMethodCode = (methodId) => {
        return methods.find(methodObj => {
            return methodObj?.id === methodId
        })?.code
    }

    const loadTemplateDetails = (template) => {
        console.log('loadTemplateDetails')
        // setLoading(true)
        // fetchRequest(teacherYearResultStTemplateDetail, 'POST', {template})
        //     .then((res) => {
        //         if (res.success) {
        //             setStTemplateDetails(res?.data?.details)
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

    const uploadFile = async e => {
        e.persist();
        if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0]);
        }
        // Had to use this one before. Because uploading same file again was not working.
        e.target.value = null;
    }

    const onTemplateDtlChange = (seasonId = null, templateDtl = null, checked = false, isExam = false) => {
        const clone = [...selectedStTemplateDetail];
        let existingIndex = -1;
        for (let d = 0; d < clone?.length; d++) {
            if (clone[d]?.season === seasonId && clone[d]?.templateDtl === templateDtl) {
                existingIndex = d;
                break;
            }
        }
        if (checked) {
            if (existingIndex === -1) {
                clone.push({
                    season: seasonId,
                    isExam,
                    templateDtl
                })
            }
        } else {
            if (existingIndex > -1) {
                clone.splice(existingIndex, 1);
            }
        }
        setSelectedStTemplateDetail(clone)
    }

    const checkTemplateDtlSelected = (seasonId = null, templateDtl = null) => {
        let selected = false;
        for (let d = 0; d < selectedStTemplateDetail?.length; d++) {
            const obj = selectedStTemplateDetail[d]
            if (obj?.season === seasonId && obj?.templateDtl === templateDtl) {
                selected = true;
                break;
            }
        }
        return selected;
    }

    const onExamTypeChange = (seasonId = null, templateDtl = null, examTypeIds = []) => {
        const clone = [...selectedStTemplateDetail]
        for (let d = 0; d < clone?.length; d++) {
            const obj = clone[d]
            if (obj?.season === seasonId && obj?.templateDtl === templateDtl) {
                obj.examTypes = examTypeIds;
                break;
            }
        }
        setSelectedStTemplateDetail(clone)
    }

    const getSelectedDtlExams = (seasonId = null, templateDtl = null) => {
        let examTypes = []
        for (let d = 0; d < selectedStTemplateDetail?.length; d++) {
            const obj = selectedStTemplateDetail[d]
            if (obj?.season === seasonId && obj?.templateDtl === templateDtl) {
                examTypes = obj?.examTypes;
                break;
            }
        }
        return examTypes;
    }

    const filterYearTypes = (list = []) => {
        const sList = [];
        if (list && list.length > 0) {
            for (let l = 0; l < list.length; l++) {
                if (!list[l]?.value.startsWith('year_type')) {
                    sList.push(list[l])
                }
            }
        }
        return sList;
    }

    return (
        <Modal
            size='xl'
            dimmer='blurring'
            show={show}
            onHide={onClose}
            // className='doubleModal'
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton style={{padding: '1rem'}}>
                <Modal.Title className="modal-title d-flex flex-row justify-content-between w-100">
                    {title}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className='m-portlet__body'>
                    <Row className='mt-4'>
                        <Col md={2}/>
                        <Col>
                            <Row className='form-group'>
                                <Col md={4} className='text-right label-pinnacle-bold'>
                                    {translations(locale)?.class_name}
                                </Col>
                                <Col md={8} className='d-flex flex-column'>
                                    <span>{group?.subjectName}</span>
                                    <span className='bolder'>{group?.groupName}</span>
                                    <span
                                        style={{textDecoration: 'underline'}}>{group?.classList?.map(el => el?.className)?.join(', ')}</span>
                                </Col>
                            </Row>

                            <Row className='form-group'>
                                <Col md={4} className='col-form-label text-right label-pinnacle-bold'>
                                    {translations(locale)?.score_type}*
                                </Col>
                                <Col md={8}>
                                    <Dropdown
                                        fluid
                                        selection
                                        closeOnChange
                                        options={scoreTypeOptions}
                                        value={result?.scoreType}
                                        placeholder={'-' + translations(locale)?.select + '-'}
                                        onChange={(e, data) => handleChange('scoreType', data?.value)}
                                    />
                                </Col>
                            </Row>
                            {
                                scoreTypeOptions.find(obj => {
                                    return obj?.value === result?.scoreType
                                })?.code !== 'PRIMARY' && <Row className='form-group'>
                                    <Col md={4} className='col-form-label text-right label-pinnacle-bold'>
                                        {translations(locale)?.season_score?.method}
                                    </Col>
                                    <Col md={8}>
                                        <Dropdown
                                            fluid
                                            selection
                                            clearable
                                            closeOnChange
                                            options={methodOptions}
                                            value={result?.method}
                                            placeholder={'-' + translations(locale)?.select + '-'}
                                            onChange={(e, data) => handleChange('method', data?.value)}
                                        />
                                    </Col>
                                </Row>
                            }
                            {
                                result?.method && (getMethodCode(result?.method) !== 'MANUAL'
                                    && getMethodCode(result?.method) !== 'EXCEL'
                                    && getMethodCode(result?.method) !== 'SEASON_MIX') &&
                                <>
                                    <Row className='form-group'>
                                        <Col md={4} className='col-form-label text-right label-pinnacle-bold'>
                                            {translations(locale)?.exam?.seasonToPull}
                                        </Col>
                                        <Col md={8}>
                                            <Dropdown
                                                fluid
                                                selection
                                                clearable
                                                closeOnChange
                                                multiple={true}
                                                options={seasonOptions}
                                                value={result?.seasonIds || []}
                                                placeholder={'-' + translations(locale)?.select + '-'}
                                                onChange={(e, data) => {
                                                    handleChange('seasonIds', data?.value)
                                                    handleSeasonRow(data?.value)
                                                }}
                                            />
                                        </Col>
                                    </Row>
                                    {
                                        getMethodCode(result?.method) === 'WEIGHT' && result?.seasonIds && result?.seasonIds.length > 0 &&
                                        <Row className='form-group'>
                                            <Col md={4} className='col-form-label text-right label-pinnacle-bold'>
                                            </Col>
                                            <Col md={8}>
                                                {
                                                    result?.seasonIds.map(seasonObj => {
                                                        const seasonWeightValue = seasonWeights.find(s => {
                                                            return s?.season === seasonObj
                                                        })?.weight;
                                                        return <Row key={'season_' + seasonObj} className='form-group'>
                                                            <Col
                                                                className={'col-form-label text-right'}>{seasonOptions.find(s => {
                                                                return s?.value === seasonObj
                                                            })?.text}</Col>
                                                            <Col>
                                                                <input
                                                                    type='number'
                                                                    className='form-control'
                                                                    value={seasonWeightValue}
                                                                    placeholder={translations(locale)?.school_settings?.weight}
                                                                    onChange={(e) => {
                                                                        handleChangeWeight(seasonObj, e.target.value)
                                                                    }}
                                                                />
                                                            </Col>
                                                            <Col></Col>
                                                        </Row>
                                                    })
                                                }
                                            </Col>
                                        </Row>
                                    }
                                </>
                            }
                            {
                                result?.method && getMethodCode(result?.method) === 'EXCEL' && file &&
                                <>
                                    <Row className='form-group'>
                                        <Col md={4} className='col-form-label text-right label-pinnacle-bold'>
                                        </Col>
                                        <Col md={8}>
                                            <div style={{
                                                display: 'inline-block',
                                                border: '1px solid #ebedf2',
                                                borderRadius: 10,
                                                paddingLeft: 15
                                            }}>
                                                <span style={{marginRight: 10}}>{file?.name}</span>
                                                <button
                                                    className='btn btn-danger m-btn--icon btn-sm m-btn--icon-only m-btn--pill'
                                                    onClick={() => {
                                                        setFile(null)
                                                    }}
                                                >
                                                    <i className='fa flaticon-delete-1'/>
                                                </button>
                                            </div>
                                        </Col>
                                    </Row>
                                </>
                            }
                            <Row className='form-group'>
                                <Col md={4} className='col-form-label text-right label-pinnacle-bold'/>
                                <Col md={8}>
                                    <Checkbox
                                        checked={result?.isCalculateRank}
                                        label={translations(locale)?.school_settings?.is_ranked}
                                        onChange={(e, data) => handleChange('isCalculateRank', data?.checked)}
                                    />
                                </Col>
                            </Row>
                            {
                                result?.method && getMethodCode(result?.method) === 'SEASON_MIX' &&
                                <>
                                    <Row className='form-group'>
                                        <Col md={4} className='col-form-label text-right label-pinnacle-bold'>
                                            {translations(locale)?.scoreSchema}*
                                        </Col>
                                        <Col md={8}>
                                            <Dropdown
                                                fluid
                                                selection
                                                clearable
                                                closeOnChange
                                                options={stTemplates}
                                                value={result?.stTemplate}
                                                placeholder={'-' + translations(locale)?.select + '-'}
                                                onChange={(e, data) => {
                                                    handleChange('stTemplate', data?.value)
                                                    if (data?.value) {
                                                        loadTemplateDetails(data?.value)
                                                    }
                                                }}
                                            />
                                        </Col>
                                    </Row>
                                    {
                                        result?.stTemplate && filterYearTypes(seasonOptions)?.map(seasonObj => {
                                            return <Row className='form-group' key={'season_mix_' + seasonObj?.value}>
                                                <Col md={4} className='col-form-label text-right label-pinnacle-bold'>
                                                    {seasonObj?.text}
                                                </Col>
                                                <Col md={8}>
                                                    {
                                                        stTemplateDetails?.map(templateDtl => {
                                                            return <Row
                                                                key={'s_' + seasonObj?.value + '_dtl_' + templateDtl?.id}
                                                                className={"mt-3"}>
                                                                <Col>
                                                                    <Checkbox
                                                                        checked={checkTemplateDtlSelected(seasonObj?.value, templateDtl?.id)}
                                                                        label={templateDtl?.itemName}
                                                                        onChange={(e, data) => {
                                                                            onTemplateDtlChange(seasonObj?.value, templateDtl?.id, data?.checked, templateDtl?.itemCode?.toLowerCase().includes('exam'));
                                                                        }}
                                                                    />
                                                                </Col>
                                                                {
                                                                    templateDtl?.itemCode?.toLowerCase().includes('exam') &&
                                                                    checkTemplateDtlSelected(seasonObj?.value, templateDtl?.id) &&
                                                                    <Col>
                                                                        <Dropdown
                                                                            fluid
                                                                            selection
                                                                            clearable
                                                                            closeOnChange
                                                                            multiple={true}
                                                                            options={templateDtl?.examTypes}
                                                                            value={getSelectedDtlExams(seasonObj?.value, templateDtl?.id) || []}
                                                                            placeholder={'-' + translations(locale)?.select + '-'}
                                                                            onChange={(e, data) => {
                                                                                onExamTypeChange(seasonObj?.value, templateDtl?.id, data?.value)
                                                                            }}
                                                                        />
                                                                    </Col>
                                                                }
                                                            </Row>
                                                        })
                                                    }
                                                </Col>
                                            </Row>
                                        })
                                    }

                                </>
                            }
                            {
                                result?.method && getMethodCode(result?.method) === 'EXCEL' &&
                                <>
                                    <Row className='form-group mt-5'>
                                        <Col md={4} className='col-form-label text-right label-pinnacle-bold'>
                                        </Col>
                                        <Col md={8}>
                                            <div>
                                                <table className={'table table-bordered table-striped'}>
                                                    <thead>
                                                    <tr>
                                                        <th>№</th>
                                                        <th>{translations(locale)?.studentCode}</th>
                                                        <th>{translations(locale)?.last_name}</th>
                                                        <th>{translations(locale)?.first_name}</th>
                                                        <th>{translations(locale)?.exam_template?.score}</th>
                                                    </tr>
                                                    </thead>
                                                    <tbody>
                                                    <tr>
                                                        <td>1</td>
                                                        <td>ABC001</td>
                                                        <td>-</td>
                                                        <td>-</td>
                                                        <td>100</td>
                                                    </tr>
                                                    <tr>
                                                        <td>2</td>
                                                        <td>ABC002</td>
                                                        <td>-</td>
                                                        <td>-</td>
                                                        <td>90</td>
                                                    </tr>
                                                    </tbody>
                                                    <tfoot>
                                                    <tr>
                                                        <th colSpan={5} className={'text-center'}>
                                                            <button
                                                                className={'btn btn-sm m-btn--pill btn-outline-secondary'}
                                                                onClick={() => {
                                                                    // window.open('/api/exam/result-excel-template?group=' + data?.id)
                                                                }}>{translations(locale)?.teacher?.journalExcelTemplate}</button>
                                                        </th>
                                                    </tr>
                                                    </tfoot>
                                                </table>
                                            </div>
                                        </Col>
                                    </Row>
                                </>
                            }

                        </Col>
                        <Col md={4}/>
                    </Row>
                </div>
            </Modal.Body>

            <Modal.Footer>
                <button 
                    className='btn btn-link'
                    onClick={onClose}
                >
                    {translations(locale)?.back}
                </button>
                {
                    getMethodCode(result?.method) !== 'EXCEL'
                        ?
                        <button onClick={handleSubmit} className="btn m-btn--pill btn-publish text-uppercase">
                            {translations(locale)?.exam?.insert_score}
                        </button>
                        :
                        <>
                            <input
                                ref={fileInputRef}
                                style={{display: 'none'}}
                                accept=".xls, .xlsx, application/excel, application/vnd.msexcel, text/anytext, application/vnd. ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                                id="fileInput"
                                onChange={uploadFile}
                                type="file"
                            />
                            {
                                file
                                    ?
                                    <button onClick={submitExcel}
                                            className="btn m-btn--pill btn-publish text-uppercase">
                                        {translations(locale)?.exam?.insert_score}
                                    </button>
                                    :
                                    <button onClick={() => {
                                        fileInputRef?.current?.click();
                                    }}
                                            className="btn m-btn--pill btn-publish text-uppercase">
                                        {translations(locale)?.excel_import}
                                    </button>
                            }
                        </>
                }
            </Modal.Footer>
            {
                loading &&
                <>
                    <div className='blockUI blockOverlay'/>
                    <div className='blockUI blockMsg blockPage'>
                        <div className='m-loader m-loader--brand m-loader--lg'/>
                    </div>
                </>
            }
        </Modal>
    )
}

export default YearAdd