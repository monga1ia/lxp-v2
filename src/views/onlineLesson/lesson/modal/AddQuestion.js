import React from 'react'
import { Modal } from 'react-bootstrap'
import QuestionAdd from '../../../onlineExam/questions/add/index'

const AddQuestion = ({
    open = false,
    onClose = () => {},
    course = null,
    courseExam = null, 
    gradeSubjects = [],
    selectedGradeId = null,
    selectedSubjectId = null,
    selectedSyllabusId = null
}) => {
    return (
        <Modal
            show={open}
            onHide={onClose}
            size="xl"
            fullscreen
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <QuestionAdd
                propSelectedCourseId={course}
                propCourseExam={courseExam}
                propIsCourse={true}
                propBackUrl='/online-exam/exam-edit'
                propSelectedGrade={selectedGradeId}
                propSelectedSubject={selectedSubjectId}
                propSelectedSyllabus={selectedSyllabusId}
                propGradeSubjects={gradeSubjects}
                onModalClose={onClose}
            />
        </Modal>
    )
}

export default AddQuestion
