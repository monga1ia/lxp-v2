import message from 'modules/message'
import { Link } from 'react-router-dom'
import { Modal } from 'react-bootstrap'
import DeleteModal from 'utils/deleteModal'
import React, { useEffect, useState } from 'react'
import CloseIcon from '@mui/icons-material/Close'
import DTable from 'modules/DataTable/DTable'
import secureLocalStorage from 'react-secure-storage'
import { translations } from 'utils/translations'
// import { fetchRequest } from 'utils/fetchRequest'
// import { teacherJournalSkillDelete, teacherJournalSkillList } from 'utils/fetchRequest/Urls'
import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded'
import { useTranslation } from 'react-i18next'
import AddSkill from '../pages/skill/add'
import EditSkillModal from '../pages/skill/edit'
import ResultSkillModal from '../pages/skill/result'

const locale = secureLocalStorage?.getItem('selectedLang') || 'mn'

const skill = ({ onClose, group, season, rerender }) => {

    const { t } = useTranslation()

    const [loading, setLoading] = useState(false)

    const [title, setTitle] = useState('')
    const [tableData, setTableData] = useState([
        {
            id: 'tem1',
            isPublish: true,
            templateName: '123',
            publishedDate: '2024/2/42',
        },
        {
            id: 'tem2',
            isPublish: true,
            templateName: 'test 2',
            publishedDate: '2022/4/2',
        },
        {
            id: 'tem112',
            isPublish: false,
            templateName: '123434',
            publishedDate: '2021 on',
        },
    ])
    const [selectedTableDataId, setSelectedTableDataId] = useState(null)

    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [showCreateSkillModal, setShowCreateSkillModal] = useState(false)
    const [showEditSkillModal, setShowEditSkillModal] = useState(false)
    const [showResultSkillModal, setShowResultSkillModal] = useState(false)

    const config = {
        showFilter: false,
        showAllData: true,
        showPagination: false,
        defaultSort: [{ dataField: 'createdDate', order: 'asc' }],
    };

    const columns = [
        {
            dataField: 'isPublish',
            text: translations(locale)?.status,
            align: 'center',
            style: { verticalAlign: 'middle' },
            formatter: cell =>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <div className={`table-circle ${cell === true && "active"}`} />
                </div>
        },
        {
            dataField: 'templateName',
            text: translations(locale)?.exam?.template_name,
        },
        {
            dataField: 'createdDate',
            text: translations(locale)?.exam_template?.created_date,
        },
        {
            dataField: 'publishedDate',
            text: translations(locale)?.season_score?.published_date,
        },
        {
            dataField: 'action',
            text: '',
            align: 'center',
            style: { verticalAlign: 'middle' },
            headerStyle: { width: 100 },
            formatter: (cell, row) => {
                {console.log(row?.id)}
                if (!row?.isPublish)
                    return (
                        <div>
                            <button
                                className='btn btn-primary m-btn--icon btn-sm m-btn--icon-only m-btn--pill mr-2'
                                onClick={() => editSkillHandler(row?.id, group, title)}
                                // onClick={() => navigate('/teacher/journals/skill/edit', { state: { skill: row?.id, group, title } })}
                            >
                                <i className='fa flaticon-edit' />
                            </button>
                            <button
                                className='btn btn-danger m-btn--icon btn-sm m-btn--icon-only m-btn--pill'
                                onClick={() => handleDeleteButtonClick(row?.id)}
                            >
                                <i className='fa flaticon-delete-1' />
                            </button>
                        </div>
                    )
                else
                    return (
                        <button
                            className='btn btn-secondary m-btn--icon btn-sm m-btn--icon-only m-btn--pill'
                            onClick={() => resultSkillHandler(row?.id, title)}
                            // onClick={() => navigate('/teacher/journals/skill/result', { state: { skill: row?.id, title } })}
                        >
                            <i className='fa flaticon-eye text-white' />
                        </button>
                    )
            }
        },
    ]

    // useEffect(() => {
    //     setLoading(true)
    //     fetchRequest(teacherJournalSkillList, 'POST', { group, season })
    //         .then((res) => {
    //             if (res.success) {
    //                 const { title, skills } = res.data
    //                 setTitle(title || '')
    //                 setTableData(skills || [])
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

    const handleDelete = () => {

        // console.log('handleDelete')

        // setLoading(true)
        // fetchRequest(teacherJournalSkillDelete, 'POST', { skill: selectedTableDataId })
        //     .then((res) => {
        //         if (res.success) {
        //             message(res.data.message, res.success)
        //             closeModal()
        //             rerender()
        //             onClose()
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

    const handleDeleteButtonClick = id => {
        setSelectedTableDataId(id)
        setShowDeleteModal(true)
    }

    const closeModal = () => {
        setSelectedTableDataId(null)
        setShowDeleteModal(false)
    }

    const [editSkillState, setEditSkillState] = useState({
        skill: null, 
        group: null,
        title: null,
    })

    const [resultSkillState, setResultSkillState] = useState({
        skill: null,
        title: null,
    })

    const editSkillHandler = ({skill, group, title}) => {
        setEditSkillState({
            skill: skill, 
            group: group,
            title: title,
        })
        setShowEditSkillModal(true)
    }
    
    const resultSkillHandler = ({skill, title}) => {
        setResultSkillState({
            skill: skill,
            title: title,
        })
        setShowResultSkillModal(true)
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
            <Modal.Header closeButton style={{padding: '1rem'}}>
                <Modal.Title className="modal-title d-flex flex-row justify-content-between w-100">
                    {title}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body style={{color: '#212529'}}>
                <button
                    className='btn btn-sm m-btn--pill btn-info m-btn--uppercase d-inline-flex'
                    onClick={() => {
                        setShowCreateSkillModal(true)
                    }}
                >
                    <AddCircleOutlineRoundedIcon className='MuiSvg-customSize'/>
                    <span className='ml-2'>{t('esis.createStudent')}</span>
                </button>
                <DTable
                    locale={locale}
                    config={config}
                    data={tableData}
                    columns={columns}
                />
            </Modal.Body>
            <Modal.Footer className='text-center'>
                <button className='btn m-btn--pill btn-outline-metal text-uppercase' onClick={onClose}>
                    {translations(locale)?.close}
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
            {
                showDeleteModal && selectedTableDataId &&
                <DeleteModal
                    onClose={closeModal}
                    onDelete={handleDelete}
                    locale={locale}
                    className={'doubleModal'}
                    title={translations(locale)?.delete}
                >
                    {translations(locale)?.delete_confirmation}
                    <br />
                    <br />
                    {translations(locale)?.delete_confirmation_description}
                </DeleteModal>
            }
            {
                group && season &&
                <AddSkill
                    onClose={() => setShowCreateSkillModal(false)}
                    show={showCreateSkillModal}
                    data={{ group, season }}
                />
            }
            {
                // editSkillState.skill &&
                <EditSkillModal
                    onClose={() => setShowEditSkillModal(false)}
                    show={showEditSkillModal}
                    data={editSkillState}
                />
            }
            {
                // resultSkillState.skill &&
                <ResultSkillModal
                    onClose={() => setShowResultSkillModal(false)}
                    show={showResultSkillModal}
                    data={resultSkillState}
                />
            }
        </Modal>
    )
}

export default skill