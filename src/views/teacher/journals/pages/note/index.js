import {useState} from 'react'
import message from 'modules/message'
import React, {useEffect} from 'react'
import secureLocalStorage from 'react-secure-storage'
// import {fetchRequest} from 'utils/fetchRequest'
import {translations} from 'utils/translations'
import {useLocation, useNavigate} from 'react-router'
// import {testRequest} from 'utils/url'
import {cloneDeep} from 'lodash'
import * as XLSX from 'xlsx-js-style'
import {Checkbox} from 'semantic-ui-react'
import {NDropdown as Dropdown} from 'widgets/Dropdown'
import DayPickerInput from 'react-day-picker/DayPickerInput'

const locale = secureLocalStorage?.getItem('selectedLang') || 'mn'

const add = () => {
    const location = useLocation()
    const navigate = useNavigate()

    const [loading, setLoading] = useState(false)

    const [title, setTitle] = useState('')
    const [lists, setLists] = useState([])
    const [filteredLists, setFilteredLists] = useState([])
    const [isEdit, setIsEdit] = useState(false)
    const [allChecked, setAllChecked] = useState(false)
    const [objectiveOptions, setObjectiveOptions] = useState([])
    const [methodOptions, setMethodOptions] = useState([])

    useEffect(() => {
        if (!location?.state?.group || !location?.state?.season) {
            message(translations(locale)?.group?.group_not_found)
            navigate('/teacher/journals', {replace: true})
        }
        init()
    }, [])

    const init = () => {
        console.log('init')
        // setLoading(true)
        // fetchRequest(testRequest, 'POST', {
        //     group: location?.state?.group,
        //     season: location?.state?.season
        // })
        //     .then((res) => {
        //         if (res.success) {
        //             const {group, notes, seasons} = res.data
        //             setLists(notes)
        //             setFilteredLists(notes)
        //             setMethodOptions(notes)
        //             setObjectiveOptions(seasons)
        //             setTitle(`${group?.seasonName}, ${group?.subjectName}, ${group?.classNames}` || '')
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

    const noteTableBodyRender = () => {
        let rows = [];

        if (filteredLists && filteredLists.length > 0) {
            for (let i = 0; i < filteredLists.length; i++) {
                let listData = filteredLists[i];

                rows.push(
                    <tr key={'report_show_' + i} style={{background: '#fceee9'}}>
                        <td className='text-left' colSpan={isEdit ? 8 : 7}>{listData['name']}</td>
                    </tr>
                );

                for (let d = 0; d < listData.data.length; d++) {
                    let data = listData.data[d];

                    rows.push(
                        <tr key={'report_show_' + i + '_' + d}>
                            <td>{d + 1}</td>
                            {
                                isEdit &&
                                <td>
                                    <Checkbox
                                        checked={data.isChecked}
                                        onChange={(e, check) => onToggleHandler(check.checked, data.id)}
                                    />
                                </td>
                            }
                            <td>{data.subject}</td>
                            <td>{data.purpose}</td>
                            <td style={isEdit && data.isChecked ? {padding: 3} : {}}>
                                {
                                    isEdit && data.isChecked
                                        ?
                                        <Dropdown
                                            fluid
                                            selection
                                            clearable
                                            multiple
                                            options={objectiveOptions}
                                            value={data.objectiveIds || []}
                                            placeholder={'-' + translations(locale)?.select + '-'}
                                            onChange={(e, dropdown) => onObjectiveChange(dropdown?.value, data.id)}
                                        />
                                        :
                                        data.objectives
                                }
                            </td>
                            <td style={isEdit && data.isChecked ? {padding: 3} : {}}>
                                {
                                    isEdit && data.isChecked
                                        ?
                                        <Dropdown
                                            fluid
                                            selection
                                            clearable
                                            multiple
                                            options={objectiveOptions}
                                            value={data.methodIds || []}
                                            placeholder={'-' + translations(locale)?.select + '-'}
                                            onChange={(e, dropdown) => onMethodChange(dropdown?.value, data.id)}
                                        />
                                        :
                                        data.method
                                }
                            </td>
                            <td>
                                {
                                    isEdit && data.isChecked
                                        ?
                                        <DayPickerInput
                                            value={data.date}
                                            inputProps={{className: 'form-control'}}
                                            onDayChange={(day) => handleDayChange(day?.toISOString()?.split('T')?.[0], data.id)}
                                            dayPickerProps={{firstDayOfWeek: 1}}
                                            classNames={{
                                                overlay: 'DayPickerInputOverlay',
                                                container: 'position-relative'
                                            }}
                                        />
                                        :
                                        data.date
                                }
                            </td>
                            <td style={isEdit && data.isChecked ? {padding: 3} : {}}>
                                {
                                    isEdit && data.isChecked
                                        ?
                                        <input
                                            className="form-control"
                                            value={data.activities || ''}
                                            onChange={(e) => onInputChange(e, data.id)}
                                        />
                                        :
                                        data.activities
                                }
                            </td>
                        </tr>
                    );
                }
            }
        }

        return rows;
    };

    const onObjectiveChange = (value, id) => {
        let cloneData = [...filteredLists]

        if (cloneData && cloneData.length > 0) {
            for (let i = 0; i < cloneData.length; i++) {
                for (let d = 0; d < cloneData[i].data.length; d++) {
                    if (parseInt(id) == parseInt(cloneData[i].data[d].id)) {
                        cloneData[i].data[d].objectiveIds = value;
                    }
                }
            }
        }

        setFilteredLists(cloneData)
    }

    const onMethodChange = (value, id) => {
        let cloneData = [...filteredLists]

        if (cloneData && cloneData.length > 0) {
            for (let i = 0; i < cloneData.length; i++) {
                for (let d = 0; d < cloneData[i].data.length; d++) {
                    if (parseInt(id) == parseInt(cloneData[i].data[d].id)) {
                        cloneData[i].data[d].methodIds = value;
                    }
                }
            }
        }

        setFilteredLists(cloneData)
    }

    const handleDayChange = (date, id) => {
        let cloneData = [...filteredLists]

        if (cloneData && cloneData.length > 0) {
            for (let i = 0; i < cloneData.length; i++) {
                for (let d = 0; d < cloneData[i].data.length; d++) {
                    if (parseInt(id) == parseInt(cloneData[i].data[d].id)) {
                        cloneData[i].data[d].date = date;
                    }
                }
            }
        }

        setFilteredLists(cloneData)
    }

    const onInputChange = (e, id) => {
        let cloneData = [...filteredLists]

        if (cloneData && cloneData.length > 0) {
            for (let i = 0; i < cloneData.length; i++) {
                for (let d = 0; d < cloneData[i].data.length; d++) {
                    if (parseInt(id) == parseInt(cloneData[i].data[d].id)) {
                        cloneData[i].data[d].activities = e.target.value;
                    }
                }
            }
        }

        setFilteredLists(cloneData)
    }

    const handleSearch = keyword => {
        if (keyword) {
            let filter = [];
            let cloneData = cloneDeep(lists)
            for (let i = 0; i < cloneData.length; i++) {
                let listData = cloneData[i].data;
                let filterData = listData.filter(data =>
                    data.subject?.toLowerCase()?.includes(keyword)
                )

                cloneData[i].data = filterData
            }

            filter = cloneData

            setFilteredLists(filter)
        } else {
            setFilteredLists(lists || [])
        }
    }

    const excelDownload = () => {
        const excelData = []

        let index = 0;
        filteredLists?.forEach((el, i) => {
            if (index == 0) {
                excelData[index] = {
                    '№': '',
                    [translations(locale).teacher.onlineLesson.lesson]: el?.subject,
                    [translations(locale).teacher.onlineLesson.purpose]: el?.purpose,
                    [translations(locale).teacher.onlineLesson.learningObjectives]: el?.objectives,
                    [translations(locale).season_score.method]: el?.method,
                    [translations(locale).class_date]: el?.date,
                    [translations(locale).subject.courseActivities]: el?.activities,
                }
            }

            excelData[i + (index > 1 ? index - 2 : 0)] = {
                '№': el.name,
                [translations(locale).teacher.onlineLesson.lesson]: '',
                [translations(locale).teacher.onlineLesson.purpose]: '',
                [translations(locale).teacher.onlineLesson.learningObjectives]: '',
                [translations(locale).season_score.method]: '',
                [translations(locale).class_date]: '',
                [translations(locale).subject.courseActivities]: '',
            }

            el.data.forEach((childEl, cIndex) => {
                excelData[cIndex + (index == 0 ? 1 : index)] = {
                    '№': cIndex + 1,
                    [translations(locale).teacher.onlineLesson.lesson]: childEl?.subject,
                    [translations(locale).teacher.onlineLesson.purpose]: childEl?.purpose,
                    [translations(locale).teacher.onlineLesson.learningObjectives]: childEl?.objectives,
                    [translations(locale).season_score.method]: childEl?.method,
                    [translations(locale).class_date]: childEl?.date,
                    [translations(locale).subject.courseActivities]: childEl?.activities,
                }
            })
            index = index + el.data.length + 2
        })

        const workbook = XLSX.utils.book_new()
        const worksheet = XLSX.utils.json_to_sheet(excelData)
        XLSX.utils.book_append_sheet(workbook, worksheet)
        XLSX.writeFile(workbook, `Багшийн тэмдэглэл` + '.xlsx')
    }

    const onEditHandler = () => {
        setIsEdit(true)
    }

    const onSaveHandler = () => {
        setIsEdit(false)
    }

    const onCancelHandler = () => {
        setFilteredLists(lists)
        setIsEdit(false)
    }

    const onToggleHandler = (value, type) => {
        let cloneData = [...filteredLists]
        if (type == 'all') {
            if (cloneData && cloneData.length > 0) {
                for (let i = 0; i < cloneData.length; i++) {
                    for (let d = 0; d < cloneData[i].data.length; d++) {
                        cloneData[i].data[d].isChecked = value;
                    }
                }
            }

            setAllChecked(value);
        } else {
            if (cloneData && cloneData.length > 0) {
                for (let i = 0; i < cloneData.length; i++) {
                    for (let d = 0; d < cloneData[i].data.length; d++) {
                        if (parseInt(type) == parseInt(cloneData[i].data[d].id)) {
                            cloneData[i].data[d].isChecked = value;
                        }
                    }
                }
            }
        }

        setFilteredLists(cloneData)
    }

    return (
        <div className='m-grid__item m-grid__item--fluid m-wrapper'>
            <div className='m-content'>
                <div className='m-portlet'>
                    <div className='m-portlet__head justify-content-between align-items-center pr-0 pl-4'>
                        <span className='fs-13 pinnacle-bold' style={{color: '#ff5b1d'}}>{title}</span>
                        <button className='btn m-btn--pill btn-link m-btn m-btn--custom' onClick={() => navigate(-1)}>
                            {translations(locale)?.back}
                        </button>
                    </div>
                    <div className='m-portlet__body'>
                        <div className="row myReport-reportShowArea">
                            <div className='col-md-12'>
                                <div className='d-flex gap-05 justify-content-between align-items-center mb-2'>
                                    {
                                        isEdit
                                            ?
                                            <>
                                                <div className='d-flex'>
                                                    <button type='button' onClick={() => onSaveHandler()}
                                                            className='btn m-btn--pill btn-success text-uppercase'>
                                                        {translations(locale)?.save}
                                                    </button>
                                                    <button type='button' onClick={() => onCancelHandler()}
                                                            className='btn m-btn--pill btn-link text-uppercase'>
                                                        {translations(locale)?.back}
                                                    </button>
                                                </div>
                                            </>
                                            :
                                            <div className='d-flex'>
                                                <button type='button' onClick={() => onEditHandler()}
                                                        className='btn m-btn--pill btn-primary text-uppercase'>
                                                    {translations(locale)?.edit}
                                                </button>
                                            </div>
                                    }
                                    <div className='d-flex'>
                                        <button
                                            style={{height: 33, width: 33}}
                                            className='btn m-btn--icon m-btn--icon-only btn-info br-03 mx-1'
                                            onClick={excelDownload}
                                        >
                                            <i className='la la-file-excel-o' style={{fontSize: 22, color: 'white'}}/>
                                        </button>
                                        <input
                                            type='text'
                                            style={{width: '15rem'}}
                                            className='form-control br-08'
                                            placeholder={translations(locale)?.search}
                                            onChange={(e) => handleSearch(e?.target?.value?.toLowerCase())}
                                        />
                                    </div>
                                </div>
                                <div className="table-responsive">
                                    <table className="table table-bordered attendance">
                                        <thead>
                                        <tr>
                                            <th width={'5%'}>№</th>
                                            {
                                                isEdit &&
                                                <th width={'5%'}>
                                                    <Checkbox
                                                        checked={allChecked}
                                                        onChange={(e, data) => onToggleHandler(data.checked, 'all')}
                                                    />
                                                </th>
                                            }
                                            <th width={'15%'}>{translations(locale).teacher.onlineLesson.lesson || null}</th>
                                            <th width={'10%'}>{translations(locale).teacher.onlineLesson.purpose + ' / ' + translations(locale).teacher.onlineLesson.conclusion || null}</th>
                                            <th width={'15%'}>{translations(locale).teacher.onlineLesson.learningObjectives || null}</th>
                                            <th width={'15%'}>{translations(locale).season_score.method || null}</th>
                                            <th width={'5%'}>{translations(locale).class_date || null}</th>
                                            <th width={'10%'}>{translations(locale).subject.courseActivities || null}</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {noteTableBodyRender()}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
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
        </div>
    )
}

export default add