import message from 'modules/message'
import draftToHtml from 'draftjs-to-html'
import { Editor } from 'react-draft-wysiwyg'
import { Modal } from 'react-bootstrap'
import { useSelector } from 'react-redux';
import React, { useState, useEffect } from 'react'
import secureLocalStorage from 'react-secure-storage'
import { EditorState, convertToRaw, convertFromHTML, ContentState } from 'draft-js'
import { useTranslation } from "react-i18next";
import { fetchRequest } from 'utils/fetchRequest';
import { schoolTeacherInfo } from 'utils/fetchRequest/Urls';

const infoChange = ({ onClose, onSubmit, teacherId }) => {

    const { t } = useTranslation();
    const { selectedSchool } = useSelector(state => state.schoolData);
    const locale = secureLocalStorage?.getItem('selectedLang') || 'mn'
    const [loading, setLoading] = useState(false)

    const [teacherData, setTeacherData] = useState([])
    const [info, setInfo] = useState(EditorState.createEmpty())

    const loadData = (params = {}) => {
        setLoading(true)
        fetchRequest(schoolTeacherInfo, 'POST', params)
            .then((res) => {
                if (res.success) {
                    const blocksFromHTML = convertFromHTML(res?.info);
                    const content = ContentState.createFromBlockArray(
                        blocksFromHTML.contentBlocks,
                        blocksFromHTML.entityMap
                    );
                    setInfo(EditorState.createWithContent((content)))
                    setTeacherData(res?.teacherInfo)
                } else {
                    message(res.data.message)
                }
                setLoading(false)
            })
            .catch(() => {
                message(t('err.error_occurred'))
                setLoading(false)
            })
    }

    useEffect(() => {
        if (teacherId) {
            loadData({
                school: selectedSchool?.id,
                teacher: teacherId
            })
        } else {
            message(t('course_select_teacher'))
            onClose()
        }
    }, [])

    const handleSave = () => {
        onSubmit({ info: draftToHtml(convertToRaw(info?.getCurrentContent())) })
    }

    return (
        <Modal
            centered
            show={true}
            onHide={() => onClose()}
            size='lg'
            dimmer='blurring'
            aria-labelledby="contained-modal-title-vcenter"
        >
            <Modal.Header closeButton style={{ padding: '1rem' }}>
                <Modal.Title className="modal-title d-flex flex-row justify-content-between w-100">
                    {t('teacher.info_add')}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="viewTeacherModal">
                    <div className="row form-group">
                        <div className="col-4">
                            <img
                                src={teacherData?.avatar || '/img/profile/placeholder.jpg'}
                                alt={`photo of ${teacherData?.firstName}`}
                                onError={(e) => {
                                    e.target.onError = null
                                    e.target.src = '/img/profile/avatar.png'
                                }}
                            />
                        </div>
                        <div className="col-8 d-flex align-items-center">
                            <table>
                                <tbody>
                                    <tr>
                                        <td>{t('teacher.code')}:</td>
                                        <th>{teacherData?.code || '-'}</th>
                                    </tr>
                                    <tr>
                                        <td>{t('teacher.new_lastname')}:</td>
                                        <th>{teacherData?.lastName || '-'}</th>
                                    </tr>
                                    <tr>
                                        <td>{t('teacher.new_name')}:</td>
                                        <th>{teacherData?.firstName || '-'}</th>
                                    </tr>
                                    <tr>
                                        <td>{t('teacher.phone_number')}:</td>
                                        <th>{teacherData?.contact || '-'}</th>
                                    </tr>
                                    <tr>
                                        <td className="vertical">{t('teacher.subjects')}:</td>
                                        <th>
                                            {
                                                teacherData?.subjectNames?.split(',')?.map((el, key) =>
                                                    <li key={key} className="subjectName">{el || '-'}</li>
                                                )
                                            }
                                        </th>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <Editor
                    editorState={info}
                    wrapperClassName="content-box-shadow"
                    editorClassName="profile-info-edit-input"
                    onEditorStateChange={setInfo}
                    toolbar={{
                        options: ['list', 'textAlign', 'link', 'history']
                    }}
                    stripPastedStyles={true}
                    localization={{
                        locale: locale,
                    }}
                />
            </Modal.Body>
            <Modal.Footer className="text-center">
                <button
                    className="btn m-btn--pill btn-link m-btn m-btn--custom"
                    onClick={() => onClose()}
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

export default infoChange