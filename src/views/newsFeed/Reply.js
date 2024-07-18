import React, { useEffect, useState } from 'react'
import { TextareaAutosize } from '@mui/material'
import { translations } from 'utils/translations'

const Reply = ({ user, locale, newsfeedId, placeholder, parent, onSave, commentSaveSuccess}) => {
    const [ reply, setReply ] = useState('');
    const [ isEditing, setIsEditing ] = useState(false);
    const [ newComment, setNewComment ] = useState('');

    useEffect(() => {
        if (commentSaveSuccess) {
            clearInput()
        }
    }, [commentSaveSuccess]);

    const clearInput = () => {
        setNewComment('');
    }

    const onSubmit = () => {
        onSave(newsfeedId, newComment, parent);
    }

    const newCommentChange = e => {
        setNewComment(e.target.value);
    }

    const newCommentOnKeyPress = e => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            onSave(newsfeedId, newComment, parent);
        }
    }
    
    return (
        <div className='nf-item-reply-container'>
            <img
                src={user && user.avatar ? user.avatar : '/img/profile/image_placeholder.jpg'}
                alt='img'
                onError={(e) => {
                    e.target.onError = null,
                    e.target.src = '/img/profile/avatar.png'
                }}
            />
            <div className='nf-item-new-comment'>
                <div className='nf-item-new-comment-content'>
                    <TextareaAutosize
                        placeholder={placeholder}
                        className='nf-item-new-comment-textarea'
                        // rowsMin={1}
                        minRows={1}
                        onChange={newCommentChange}
                        value={newComment}
                        spellCheck={false}
                        onKeyPress={newCommentOnKeyPress}
                    />
                    <button
                        className='nf-item-new-comment-send-btn'
                        onClick={onSubmit}
                    >
                        {translations(locale).send}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Reply;