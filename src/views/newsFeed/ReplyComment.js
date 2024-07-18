import React, { useEffect, useState } from 'react'
import { TextareaAutosize } from "@mui/material";
import { translations } from "utils/translations";

const Reply = ({ user, newsfeedId, placeholder, parent, onSave, locale, commentSaveSuccess}) => {
    const [ reply, setReply ] = useState('');
    const [ isEditing, setIsEditing ] = useState(false);
    const [ comments, setComments ] = useState([]);
    const [ loadable, setLoadable ] = useState(false);
    const [ page, setPage ] = useState(0);
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
        <div className='nf-item-new-comment'>
            <div className='nf-item-new-comment-content'>
                <div className='nf-item-new-comment-textarea-container'>
                    <TextareaAutosize
                        placeholder={placeholder}
                        className='nf-item-new-comment-textarea'
                        rowsMin={1}
                        onChange={newCommentChange}
                        value={newComment}
                        spellCheck={false}
                        onKeyPress={newCommentOnKeyPress}
                    />
                </div>
                <button
                    className='nf-item-new-comment-send-btn'
                    onClick={onSubmit}
                >
                    {translations(locale).send}
                </button>
            </div>
        </div>
    )
}

export default Reply;