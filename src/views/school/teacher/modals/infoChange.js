import message from 'Src/message'
import draftToHtml from 'draftjs-to-html'
import { Modal } from 'semantic-ui-react'
import { Editor } from 'react-draft-wysiwyg'
import React, { useState, useEffect } from 'react'
import CloseIcon from '@mui/icons-material/Close'
import secureLocalStorage from 'react-secure-storage'
import { fetchRequest } from 'Utilities/fetchRequest'
import { translations } from 'Utilities/translations'
import { schoolTeacherInfoChange } from 'Utilities/url'
import { EditorState, convertToRaw, convertFromHTML, ContentState } from 'draft-js'
const infoChange = ({ onClose, onSubmit, teacher }) => {
    const locale = secureLocalStorage?.getItem('selectedLang') || 'mn'
    const [loading, setLoading] = useState(false)

    const [teacherData, setTeacherData] = useState([])
    const [info, setInfo] = useState(EditorState.createEmpty())

    useEffect(() => {
        setLoading(true)
        fetchRequest(schoolTeacherInfoChange, 'POST', { teacher })
            .then((res) => {
                if (res.success) {
                    const { info, teacherInfo } = res?.data
                    const blocksFromHTML = convertFromHTML(info);
                    const content = ContentState.createFromBlockArray(
                        blocksFromHTML.contentBlocks,
                        blocksFromHTML.entityMap
                    );
                    setInfo(EditorState.createWithContent((content)))
                    setTeacherData(teacherInfo || {})
                } else {
                    message(res.data.message)
                }
                setLoading(false)
            })
            .catch(() => {
                message(translations(locale)?.err?.error_occurred)
                setLoading(false)
            })
    }, [])

    const handleSave = () => {
        onSubmit({ info: draftToHtml(convertToRaw(info?.getCurrentContent())) })
    }

    return (
        <Modal
            centered
            open={true}
            size='small'
            onClose={onClose}
            dimmer='blurring'
            className="react-modal overflow-modal"
        >
            <div className="header">
                {translations(locale)?.teacher?.info_add}
                <button type="button" className="close" aria-label="Close" onClick={onClose} >
                    <CloseIcon />
                </button>
            </div>
            <div className="content">
                <div className="viewTeacherModal">
                    <div className="row form-group">
                        <div className="col-4">
                            <img
                                src={teacherData?.avatar || '/images/avatar.png'}
                                alt={`photo of ${teacher?.firstName}`}
                                onError={(e) => {
                                    e.target.onError = null
                                    e.target.src = '/images/avatar.png'
                                }}
                            />
                        </div>
                        <div className="col-8 d-flex align-items-center">
                            <table>
                                <tbody>
                                    <tr>
                                        <td>{translations(locale)?.teacher?.code}:</td>
                                        <th>{teacherData?.code || '-'}</th>
                                    </tr>
                                    <tr>
                                        <td>{translations(locale)?.teacher?.new_lastname}:</td>
                                        <th>{teacherData?.lastName || '-'}</th>
                                    </tr>
                                    <tr>
                                        <td>{translations(locale)?.teacher?.new_name}:</td>
                                        <th>{teacherData?.firstName || '-'}</th>
                                    </tr>
                                    <tr>
                                        <td>{translations(locale)?.teacher?.phone_number}:</td>
                                        <th>{teacherData?.contact || '-'}</th>
                                    </tr>
                                    <tr>
                                        <td className="vertical">{translations(locale)?.teacher?.subjects}:</td>
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
                        inline: { className: 'editor-link-div' },
                        list: { className: 'editor-link-div' },
                        textAlign: { className: 'editor-link-div' },
                        history: { className: 'editor-link-div' },
                        blockType: { className: 'editor-hide-icon' },
                        fontSize: { className: 'editor-hide-icon', defaultTargetOption: '13' },
                        fontFamily: { className: 'editor-hide-icon' },
                        colorPicker: { className: 'editor-link-div' },
                        emoji: { className: 'editor-hide-icon' },
                        embedded: { className: 'editor-hide-icon' },
                        image: { className: 'editor-hide-icon' },
                        remove: { className: 'editor-hide-icon' },
                        link: { className: 'editor-link-div', defaultTargetOption: '_blank' },
                    }}
                    stripPastedStyles={true}
                    localization={{
                        locale: locale,
                    }}
                />
            </div>
            <div className="actions modal-footer">
                <div className='text-center w-100'>
                    <button
                        className="btn m-btn--pill btn-link m-btn m-btn--custom"
                        onClick={onClose}
                    >
                        {translations(locale)?.back}
                    </button>
                    <button
                        className="btn m-btn--pill btn-success m-btn--wide"
                        onClick={handleSave}
                    >
                        {translations(locale)?.save}
                    </button>
                </div>
            </div>
            {
                loading &&
                <>
                    <div className="blockUI blockOverlay" />
                    <div className="blockUI blockMsg blockPage">
                        <div className="m-loader m-loader--brand m-loader--lg" />
                    </div>
                </>
            }
        </Modal>
    )
}

export default infoChange