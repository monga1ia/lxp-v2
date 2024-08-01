import message from 'modules/message'
import { Tab } from 'semantic-ui-react'
import React, { useEffect, useState } from 'react'
import secureLocalStorage from 'react-secure-storage'
import { fetchRequest } from 'utils/fetchRequest'
import { translations } from 'utils/translations'
import { Modal } from 'react-bootstrap'
import AssessmentList from './components/assessmentList'
import GeneralInformation from './components/generalInformation'
// import { teacherJournalSkillView, teacherJournalSkillSubmit } from 'Utilities/url'

const EditSkillModal = ({onClose, data, show}) => {


    const locale = secureLocalStorage?.getItem('selectedLang') || 'mn'
    const [loading, setLoading] = useState(false)

    const [skill, setSkill] = useState({})
    const [students, setStudents] = useState([])
    const [templateDetails, setTemplateDetails] = useState([])

    // useEffect(() => {
    //     if (!location?.state?.skill) {
    //         message(translations(locale)?.skill?.notFound)
    //         navigate(-1, { replace: true })
    //     }
    // }, [location])

    useEffect(() => { init() }, [])

    const init = () => {
        console.log('init')
        // setLoading(true)
        // fetchRequest(teacherJournalSkillView, 'POST', { skill: location?.state?.skill })
        //     .then((res) => {
        //         if (res.success) {
        //             const { skill, students, templateDetails, } = res?.data
        //             setSkill(skill || {})
        //             setStudents(students || [])
        //             setTemplateDetails(templateDetails || [])
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

    return (
        <Modal
            size='xl'
            dimmer='blurring'
            show={show}
            onHide={onClose}
            className='doubleModal'
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton style={{padding: '1rem'}}>
                <Modal.Title className="modal-title d-flex flex-row justify-content-between w-100">
                {`${skill?.groupName}, ${skill?.className}, ${skill?.subjectName}`}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body style={{color: '#212529'}}>
                <Tab
                    defaultActiveIndex={1}
                    menu={{ secondary: true, pointing: true, className: 'primaryColor mt-3 h-4' }}
                    panes={[
                        {
                            menuItem: translations(locale)?.general_info,
                            render: () => <GeneralInformation group={skill} />
                        },
                        {
                            menuItem: translations(locale)?.skill?.assessmentList,
                            render: () => <AssessmentList skill={skill} students={students} templateDetails={templateDetails} />
                        }
                    ]}
                />
            </Modal.Body>
            <Modal.Footer>
                <button 
                    className='btn m-btn--pill btn-link m-btn m-btn--custom' 
                    onClick={onClose}
                >
                    {translations(locale)?.back_to_list}
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

export default EditSkillModal