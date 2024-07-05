import React, { useRef, useState, useEffect } from 'react'
import message from 'modules/message'
import { Modal } from 'react-bootstrap'
import _ from 'lodash';
import secureLocalStorage from 'react-secure-storage';
import { useTranslation } from "react-i18next";
import { NDropdown as Dropdown } from 'widgets/Dropdown';
import Forms from 'modules/Form/Forms'

const locale = secureLocalStorage?.getItem('selectedLang') || 'mn'

const InsertGroupModal = ({onClose, onSubmit, data}) => {

    const { t } = useTranslation();
    const formRef = useRef();

    const [loading, setLoading] = useState(false)

    const [classList, setClassList] = useState([{value: '11', text: '111'}, {value: '22', text: 'asdf'}])
    const [studentList, setStudentList] = useState([{value: '11', text: '111'}, {value: '22', text: 'asdf'}, {value: '223', text: 'asdef'}, {value: '224', text: 'asadf'}, {value: '252', text: 'asbdf'}])
    const [shallowCopy, setShallowCopy] = useState([])
    const [selectedStudentIds, setSelectedStudentIds] = useState([])
    const [selectAll, setSelectAll] = useState(false)
    const [allStudents, setAllStudents] = useState([])

    useEffect (() => {
        let holder = []
        for (let x=0;x<studentList.length;x++){
            holder.push(studentList[x].value)
        }
        setAllStudents(holder)
    }, [])

    const handleCheckbox = () => {
        setSelectAll(!selectAll)
        if (selectAll) {
            setSelectedStudentIds(shallowCopy)
        } else {
            setSelectedStudentIds(allStudents)
        }
    }

    const handleSubmit = () => {
        const [formsValid, formValues] = formRef.current.validate();

        if (formsValid) {
            const dataCollectorArray = []
            for (let x=0;x<formValues.length;x++) {
                dataCollectorArray.push({key: formValues[x].key, value: formValues[x].value, options: formValues[x].options})
            }
            dataCollectorArray.push({key: 'students', value: selectedStudentIds, options: studentList})
            console.log(dataCollectorArray)
            message('success', true)
            // after success \/
            // onClose()
            // setLoading(true)
            // console.log(dataCollectorArray)
        } else{
            message(t('err.fill_all_fields'))
        } 
    }

    const handleStudentChange = (e, data) => {
        setSelectedStudentIds(data)
        // use Shallow copy as a cache
        // setShallowCopy('securelocalstorage')
    }

    const [insertGroupFields, setInsertGroupFields] = useState([
        {
            key: 'classLevel',
            labelBold: true,
            value: '',
            type: 'text',
            disabled: true,
            search: true,
            label: t('grade'),
            placeholder: '-',
            className: "form-control",
            upperCase: true,
            formContainerClassName: 'form-group m-form__group row grid-item',
            fieldContainerClassName: 'col-6',
            labelClassName: "col-4 text-right label-pinnacle-bold mr-0",
        },
        {
            key: 'classClass',
            labelBold: true,
            value: '',
            type: 'nDropdown',
            label: t('class.title') + '*',
            required: true,
            errorMessage: t('error.selectGrade'),
            className: "form-control",
            upperCase: true,
            formContainerClassName: 'form-group m-form__group row grid-item',
            fieldContainerClassName: 'col-6',
            labelClassName: "col-4 text-right label-pinnacle-bold mr-0",
            options: classList,
        },
    ])

    return (
        <Modal
            dimmer='blurring'
            show={true}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            onHide={onClose}
            centered
        >
            <Modal.Header closeButton style={{padding: '1rem'}}>
                <Modal.Title className="modal-title d-flex flex-row justify-content-between w-100">
                    {t('class.add')}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="row">
                    <div className="col">
                        <div className="form-group m-form__group row mb-0">
                            <Forms
                                ref={formRef}
                                fields={insertGroupFields}
                            />
                        </div>
                        <div className="form-group m-form__group row mb-0">
                            <div>
                                <div className='form-group m-form__group row grid-item '>
                                    <label class="col-form-label col-4 text-right label-pinnacle-bold mr-0">
                                        {t('students') + '*'}
                                    </label>
                                    <div className="col-form-field-container col-6">
                                        <Dropdown
                                            placeholder={'-' + t('err.select_class') + ' - '}
                                            fluid
                                            selection
                                            className='form-control'
                                            search
                                            additionPosition='bottom'
                                            upward={false}
                                            closeOnChange
                                            clearable
                                            selectOnBlur={false}
                                            multiple
                                            value={selectedStudentIds}
                                            options={studentList}
                                            onChange={(e, data) => handleStudentChange(data?.value)}
                                        />
                                    </div>
                                    <div class="whiteSpaceClassName"></div>
                                </div>
                                <div className="form-group m-form__group row grid-item ml-3">
                                    <div className='col-form-label col-4 mr-0'/>
                                    <div className='align-items-center col-6'>
                                        <input className="form-check-input" id='selectAll' type="checkbox" value={selectAll} onChange={() => handleCheckbox()} style={{ borderRadius: '4px', fontSize: '16px !important'}} />
                                        <label className="form-check-label font-mulish" htmlFor="selectAll" style={{ color: '#575962', fontSize: '14px'}}>
                                            {t('select_all')}
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer className="text-center">
                <button 
                    onClick={onClose}
                    className="btn m-btn--pill btn-link m-btn m-btn--custom"
                >
                    {t('back')}        
                </button>
                <button
                    onClick={handleSubmit}
                    className="btn m-btn--pill btn-success text-uppercase"
                >
                    {t('save')}
                </button>
            </Modal.Footer>
            {
                loading
                    ?
                    <div>
                        <div className="blockUI blockOverlay" />
                        <div className="blockUI blockMsg blockPage">
                            <div className="m-loader m-loader--brand m-loader--lg" />
                        </div>
                    </div>
                    :
                    null
            }
        </Modal>
    )
}

export default InsertGroupModal