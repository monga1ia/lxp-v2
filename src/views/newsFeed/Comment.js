import React, { useEffect, useState } from 'react'
import { translations } from "utils/translations";
import { TextareaAutosize } from '@mui/material'
import Dropdown from 'react-bootstrap/Dropdown';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone'
import BorderColorTwoToneIcon from '@mui/icons-material/BorderColorTwoTone'

const Comment = ({ locale, comment, deleteAction, replyComment, onEditCommentSubmit, editCommentSuccess }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editComment, setEditComment] = useState(comment.comment);

    useEffect(() => {
        if (editCommentSuccess) {
            clearInput()
        }
    }, [editCommentSuccess]);

    const clearInput = () => {
        setIsEditing(false);
    }

    const onEditClick = () => {
        setIsEditing(true);
    }

    const deleteComment = () => {
        deleteAction(comment.id)
    }

    const saveEdit = (newsfeedId, commentId, comment) => {
        onEditCommentSubmit(newsfeedId, commentId, comment)
    }

    const discard = () => {
        setEditComment(comment.comment)
        setIsEditing(false);
    }

    const editCommentChange = e => {
        setEditComment(e.target.value);
    }

    const editCommentOnKeyPress = e => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            onEditCommentSubmit(comment.newsfeedId, comment.id, editComment)
        }
    }

    return (
        <div className={replyComment ? 'nf-item-comment-component reply-comments' : 'nf-item-comment-component'}>
            <div className='nf-item-comment-poster'>
                <img
                    src={comment.avatar ? comment.avatar : '/images/avatar.jpg'}
                    alt='user'
                    onError={(e) => {
                        e.target.onError = null,
                            e.target.src = '/images/avatar.png'
                    }}
                />
                <span className='nf-item-comment-user-name'>{comment.createdUser ? comment.createdUser : '-'}</span>
                <span>• {comment.role ? comment.role : '-'} •</span>
                <span>{comment.createdDate ? comment.createdDate : '-'}</span>
                <div className='nf-item-comment-actions'>
                    {
                        comment.update
                            ?
                                <Dropdown>
                                    <Dropdown.Toggle 
                                        variant=''
                                        title=""
                                        className='newsfeed-toggle'
                                    >
                                        <i className="la la-ellipsis-v font-weight-bold" style={{position: 'relative', top: 2}}/>
                                    </Dropdown.Toggle>

                                    <Dropdown.Menu>
                                        <Dropdown.Item
                                            className='m-nav__link'
                                            onClick={onEditClick}
                                        >
                                            <span><BorderColorTwoToneIcon sx={{ fontSize: '1.8rem !important', color: '#ff5b1d' }} /></span>
                                            <span className="m-nav__link-text ml-2" style={{position: 'relative', bottom: 6}}>
                                                {translations(locale).edit}
                                            </span>
                                        </Dropdown.Item>
                                        <Dropdown.Item
                                            className="m-nav__link"
                                            onClick={deleteComment}
                                        >
                                            <DeleteTwoToneIcon sx={{ fontSize: '2rem !important', color: '#ff5b1d' }} />
                                            <span className="m-nav__link-text ml-1" style={{position: 'relative', bottom: 6}}>
                                                {translations(locale).delete}
                                            </span>
                                        </Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            :
                            null
                    }
                </div>
            </div>
            {
                isEditing
                    ? <div className='nf-item-comment-edit-container'>
                        <div className='nf-item-new-comment-content' style={{ marginLeft: 50 }}>
                            <div className='nf-item-new-comment-textarea-container'>
                                <TextareaAutosize
                                    className='nf-item-new-comment-textarea'
                                    // rowsMin={1}
                                    minRows={1}
                                    onChange={editCommentChange}
                                    value={editComment}
                                    spellCheck={false}
                                    onKeyPress={editCommentOnKeyPress}
                                />
                            </div>
                            <button
                                className='nf-item-new-comment-cancel-btn'
                                onClick={discard}
                            >
                                {translations(locale).cancel}
                            </button>
                            <button
                                className='nf-item-new-comment-send-btn'
                                onClick={() => saveEdit(comment.newsfeedId, comment.id, editComment)}
                            >
                                {translations(locale).send}
                            </button>
                        </div>
                        {/*<div*/}
                        {/*    className='nf-item-comment-editor'*/}
                        {/*    contentEditable={true}*/}
                        {/*    suppressContentEditableWarning={true}*/}
                        {/*    spellCheck={false}*/}
                        {/*    ref={el => { editEl = el; }}*/}
                        {/*>*/}
                        {/*    {comment.comment}*/}
                        {/*</div>*/}
                        {/*<div className='nf-item-comment-edit-actions'>*/}
                        {/*    <button*/}
                        {/*        className='btn m-btn--pill btn-danger margin-right-5'*/}
                        {/*        onClick={discard}*/}
                        {/*    >*/}
                        {/*        {translations(locale).cancel.toUpperCase()}*/}
                        {/*    </button>*/}
                        {/*    <button*/}
                        {/*        className='btn m-btn--pill btn-warning'*/}
                        {/*        onClick={saveEdit}*/}
                        {/*    >*/}
                        {/*        {translations(locale).save.toUpperCase()}*/}
                        {/*    </button>*/}
                        {/*</div>*/}
                    </div>
                    : <div className='nf-item-comment'>
                        {comment.comment ? comment.comment : ''}
                    </div>
            }
        </div>
    )
}

export default Comment;