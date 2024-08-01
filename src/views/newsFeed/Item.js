import React, { useEffect, useState } from 'react';
import ReactPlayer from "react-player";
import { translations } from "utils/translations";
import Comment from "./Comment";
import Reply from './Reply';
import ReplyComment from './ReplyComment';
import { Checkbox, Modal } from 'semantic-ui-react';
import Slider from "./Slider";
import { capitalize, linkify } from "utils/Util";
import PostEdit from "./PostEdit";
import DeleteModal from './modals/deleteModal';
import EditModal from './modals/editModal';
import Dropdown from 'react-bootstrap/Dropdown';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone'
import BorderColorTwoToneIcon from '@mui/icons-material/BorderColorTwoTone'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'

import VisibilitySensor from 'react-visibility-sensor';
import { update } from 'lodash';

const Item = ({
    locale,
    loginPhone,
    data,
    user,
    onLike,
    onView,
    onAction,
    onComment,
    onEdit,
    onDelete,
    errorDeletePhoneNumber,
    errorDeleteDescription,
    deleteModal,
    onSubmitSuccessEdit,
    errorDescriptionEdit,
    onCommentSave,
    onCommentDelete,
    onShowMoreComments,
    commentSaveSuccess,
    onShowReplies,
    onShowMoreReply,
    onEditCommentSubmit,
    editCommentSuccess,
    _closeModalAction = null,
    selectedTreeData,
    userRoles,
    hdrs
}) => {
    const [viewComment, setViewComment] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState(loginPhone);
    const [description, setDescription] = useState('');
    const [seeMore, setSeeMore] = useState(false);
    const [modalEdit, setModalEdit] = useState(false);
    const [modalDelete, setModalDelete] = useState(deleteModal);
    const [selectedHeader, setSelectedHeader] = useState(null);
    const [submitClick, setSubmitClick] = useState(false);
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        if (onSubmitSuccessEdit > 0) {
            clearInput()
        }
    }, [onSubmitSuccessEdit]);

    const clearInput = () => {
        setModalEdit(false);
    }

    const likeClick = (isLike) => {
        onLike(data.id, isLike)
    }

    const viewClick = () => {
        onAction(data.id, 'view')
    }

    const viewLikes = () => {
        onAction(data.id, 'like')
    }

    const toggleComment = () => {
        if (!viewComment) {
            setViewComment(!viewComment);
            onComment(data.id)
        } else {
            setViewComment(!viewComment);
            data.isCommentView = false;
            data.comments = [];
        }
    }

    const showMoreComments = () => {
        onShowMoreComments(data.id, data.page)
    }

    const showMoreReply = (newsfeedId, commentId, page) => {
        onShowMoreReply(newsfeedId, commentId, page)
    }

    const showReplies = (newsfeedId, commentId) => {
        onShowReplies(newsfeedId, commentId)
    }

    const onSeeMore = () => {
        setSeeMore(!seeMore);
    }

    const renderTitle = title => {
        if (title && title.length > 100) {
            if (!seeMore) {
                return (
                    <div>
                        <div dangerouslySetInnerHTML={{ __html: linkify(title.substring(0, 250), '#5867dd') }} />
                        <button
                            className='nf-item-see-more'
                            onClick={onSeeMore}
                        >
                            {translations(locale).newsfeed.see_more}
                        </button>
                    </div>
                )
            } else {
                return (
                    <div dangerouslySetInnerHTML={{ __html: linkify(title, '#5867dd') }} />
                )
            }
        } else {
            return (
                <div dangerouslySetInnerHTML={{ __html: linkify(title, '#5867dd') }} />
            )
        }
    }

    const mapImages = imgArr => imgArr.map(img => {
        return (
            <div key={img.fileId}>
                <img
                    className='nf-item-image'
                    onClick={() => aaaa(img.nfAttachId)}
                    src={img.largePhoto}
                    alt='image'
                />
            </div>
        )
    });

    const calculatorOfCommentButton = (newsfeed) => {
        let buttonOrNone = [];

        if (newsfeed && newsfeed['comments'] && newsfeed['comments'].length >= (newsfeed['page'] * newsfeed['commentPageSize'])) {
            buttonOrNone.push(
                <div className={'col-12'} key={'buttonOrNone_newsfeed_' + newsfeed.id}>
                    <div className='col-12'>
                        <button onClick={showMoreComments}>
                            {translations(locale).newsfeed.show_more_comment + ' (' + (newsfeed['commentCount'] - newsfeed['comments'].length - (newsfeed['newReplyCount'] ? newsfeed['newReplyCount'] : 0) + (newsfeed['deleteReplyCount'] ? newsfeed['deleteReplyCount'] : 0)) + ')'}
                        </button>
                    </div>
                </div>
            )
        }

        return buttonOrNone;
    }

    const calculatorOfReplyButton = (comment) => {
        let buttonOrNone = [];
        // ############ 1 ##############
        if (comment && comment.replies && comment.replies.length > 0 && comment['replyCount'] >= comment['page'] * comment.replyPageSize && (comment['replyCount'] - comment.replies.length) != 0) {
            buttonOrNone.push(
                <div className='col-12' key={'buttonOrNone_reply_' + comment.id}>
                    <button onClick={() => showMoreReply(comment.newsfeedId, comment.id, comment.page)}>
                        {translations(locale).newsfeed.show_more_reply + ' (' + (comment['replyCount'] - comment.replies.length) + ')'}
                    </button>
                </div>
            )
        }
        // ############ 2 ##############
        else if (comment.replyCount > 0 && (comment.replies == undefined || comment.replies.length == 0)) {
            buttonOrNone.push(
                <div className={'col-12'} key={'buttonOrNone_reply_' + comment.id}>
                    <button
                        onClick={() => showReplies(comment.newsfeedId, comment.id)}
                    >
                        {translations(locale).newsfeed.reply_view + ' (' + comment['replyCount'] + ')'}
                    </button>
                </div>
            )
        }
        // ############ 3 ##############
        else if (commentSaveSuccess && comment.replies && comment.replyCount && comment.replyCount > 0 && comment.replies.length !== comment.replyCount) {
            buttonOrNone.push(
                <div className={'col-12'} key={'buttonOrNone_reply_' + comment.id}>
                    <button
                        onClick={() => showReplies(comment.newsfeedId, comment.id)}
                    >
                        {translations(locale).newsfeed.reply_view + ' (' + (comment['replyCount'] - comment.replies.length) + ')'}
                    </button>
                </div>
            );
        } else {

        }

        return buttonOrNone
    };

    const renderImages = (imgArr, count) => {
        const images = mapImages(imgArr);
        if (images && images.length > 0 && count && count > 0) {
            switch (count) {
                case 1:
                case 2:
                case 3:
                case 4: {
                    return (
                        <div className={`nf-image-grid-${count}`}>{images}</div>
                    )
                }
                default: { // means more than 4
                    return (
                        <div className='nf-image-grid-4'>
                            {images[0]}
                            {images[1]}
                            {images[2]}
                            <div className='nf-image-counter-container'>
                                {images[3]}
                                <span>{`+${count - 4}`}</span>
                            </div>
                            {/*just like case 4 except has remaining images counter on the middle of the last image.*/}
                        </div>
                    )
                }
            }
        }
    }

    const onReplySave = (newsfeedId, comment, parentCommentId) => {
        onCommentSave(newsfeedId, comment, parentCommentId)
    }

    const editButtonAction = () => {
        setModalEdit(true);
    }

    const deleteButtonAction = () => {
        setModalDelete(true);
    }

    const _submitEdit = (id) => {
        setSubmitClick(true);
    }

    const onSubmitHandler = (id, descriptionEdit, imagesEdit, filesEdit, videoEdit, isCommentEdit, removedArray, roleId) => {
        onEdit(id, descriptionEdit, imagesEdit, filesEdit, videoEdit, isCommentEdit, removedArray, roleId)
        setSubmitClick(false);
    }

    const _submitDelete = (id, update, phone, description) => {
        onDelete(id, update, phone, description);
    }

    const _closeModalEdit = () => {
        setModalEdit(false);
    }

    const _closeModalDelete = () => {
        setModalDelete(false);
    }

    const _inputChangedPhoneNumber = (event) => {
        setPhoneNumber(event.target.value)
    }

    const _textAreaChangeDescription = (event) => {
        setDescription(event.target.value)
    }

    const _postHeaderIdChange = selectedHeader => {
        setSelectedHeader(selectedHeader)
    }

    const commentDeleteHandler = (commentId) => {
        onCommentDelete(data.id, commentId)
    }

    const filterAttachments = (attachments, isImage) => {
        if (attachments && attachments.length > 0) {

            let filtered = attachments.filter(attachment => {
                if (isImage) {
                    // slider -т гарах учир youtube attachment-г оруулав
                    if (attachment.fileType === 'youtube') {
                        return true;
                    }
                    if (attachment.fileType === 'vimeo') {
                        return true;
                    }
                    // return images
                    if (attachment.isFile === true) {
                        return false;
                    }
                    if (typeof attachment.isImage === 'boolean') {
                        if (attachment.isImage === true) {
                            return true;
                        } else {
                            return false;
                        }
                    } else {
                        return attachment.isImage === true;
                    }
                } else {
                    if (attachment.isImage === true) {
                        return false;
                    }
                    if (typeof attachment.isFile === 'boolean') {
                        if (attachment.isFile === true) {
                            return true;
                        } else {
                            return false;
                        }
                    } else {
                        return attachment.isFile === true;
                    }
                }
            })
            return filtered;
        } else {
            return []
        }
    }

    return (
        <VisibilitySensor
            onChange={(isVisible) => {
                if (data && isVisible && !data.viewed) {
                    // if (data.typeCode.toLowerCase() == 'newsfeed') {
                        // submit view action
                        onView(data.id)
                    // }
                }
            }}
        >
            <div className='m-portlet m-portlet--rounded newsfeed-item-style' key={'item_' + data.id}>
                <div className="m-portlet__head">
                    <div className="m-portlet__head-caption">
                        <div className="m-portlet__head-title">
                            <div className='nf-item-header'>
                                <div>
                                    <img
                                        src={data && data.avatar ? data.avatar : '/images/avatar.jpg'}
                                        alt='user'
                                        onError={(e) => {
                                            e.target.onError = null,
                                                e.target.src = '/images/avatar.png'
                                        }}
                                    />
                                </div>
                                <div>
                                    <span>{data && data.firstName ? capitalize(data.firstName) : ''}<span/> <i className='las la-caret-right ml-2 mr-2' style={{position: 'relative', top: 1, color: '#7b7e8a'}}/> {data && data.hdrName ? data.hdrName : ''}</span>
                                    <span><span style={{backgroundColor: '#c9cbd1', padding: '2px 6px', borderRadius: 4}}>{data && data.roleName ? data.roleName : '-'}</span>  •  {data && data.createdDate ? data.createdDate : '-'}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    {
                        data.update
                            ?
                            <div className="m-portlet__head-tools">
                                <Dropdown>
                                    <Dropdown.Toggle 
                                        variant=''
                                        title=""
                                        className='newsfeed-toggle p-0'
                                    >
                                        <i className="la la-ellipsis-v font-weight-bold" style={{ top: 2}}/>
                                    </Dropdown.Toggle>

                                    <Dropdown.Menu>
                                        <Dropdown.Item
                                            className='m-nav__link'
                                            onClick={editButtonAction}
                                        >
                                            <span><BorderColorTwoToneIcon sx={{ fontSize: '1.8rem !important', color: '#ff5b1d' }} /></span>
                                            <span className="m-nav__link-text ml-2" style={{position: 'relative', bottom: 6}}>
                                                {translations(locale).edit}
                                            </span>
                                        </Dropdown.Item>
                                        <Dropdown.Item
                                            className="m-nav__link"
                                            onClick={deleteButtonAction}
                                        >
                                            <DeleteTwoToneIcon sx={{ fontSize: '2rem !important', color: '#ff5b1d' }} />
                                            <span className="m-nav__link-text ml-1" style={{position: 'relative', bottom: 6}}>
                                                {translations(locale).delete}
                                            </span>
                                        </Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            </div>
                        :
                        data.canDelete && <div className="m-portlet__head-tools">
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
                                        className="m-nav__link"
                                        onClick={deleteButtonAction}
                                    >
                                        <DeleteTwoToneIcon sx={{ fontSize: '2rem !important', color: '#ff5b1d' }} />
                                        <span className="m-nav__link-text ml-1" style={{position: 'relative', bottom: 6}}>
                                            {translations(locale).delete}
                                        </span>
                                    </Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </div>
                    }
                </div>

                <div className='nf-item-container'>
                    <div className='nf-item-content'>
                        <div className='nf-item-content-newsfeed'>
                            {data && data.content ? renderTitle(data.content) : null}
                        </div>
                        {
                            data && data.files && filterAttachments(data.files, false).length > 0
                            && <div className='nf-post-file-preview' style={{ marginTop: 20 }}>
                                {
                                    filterAttachments(data.files, false).map(function (attachment, a) {
                                        return (
                                            <div key={'nf_' + data.id + '_attachment_' + a}
                                                className='m-portlet m-portlet--rounded nf-post-file-info'
                                            >
                                                <a href={attachment.path} target={'_blank'} download={attachment.name} alt={attachment.name}><span>{attachment.name || '-'}</span></a>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        }
                        <Slider
                            data={filterAttachments(data.files, true)}
                        />
                        {
                            data && data.images && data.images.length > 0
                                ? renderImages(data.images, data.images.length)
                                : null
                        }
                        {
                            data.videoUrls && data.videoUrls.length > 0 && 
                            data.videoUrls.map((url, uIndex) => (
                                <ReactPlayer
                                    key={'uIndex' + uIndex}
                                    className='mt-2'
                                    width={'100%'}
                                    url={url}
                                    config={{
                                        youtube: { playerVars: { disablekb: 1 } },
                                        file: {
                                            attributes: {
                                                onContextMenu: e => e.preventDefault()
                                            },
                                            hlsOptions: {
                                                forceHLS: true,
                                                debug: false,
                                                xhrSetup: function (xhr, url) {
                                                    xhr.setRequestHeader('Authorization', "ya29.c.KpIB1gfmWj8OaZZflPiomP8fAznW-LJANJI5DdSFuuivuWO7CkO1xOFObxUP89jCZ9yDx_7lmsNjYCqHlCiDrkjSItezNNY5C2N7DGyXTzriMHmqReWArAEysuqxayUriurO8jyd_MsacoVAxrDPX7KNEAUcmr5BkwFyEv4zCno1t4NCwNyd1RxszWk0oB6l4cjawbc")
                                                    // if (needsAuth(url)) {
                                                    //
                                                    // }
                                                },
                                            },
                                        }
                                    }}
                                />
                            ))
                        }
                    </div>
                </div>
                <div className='nf-item-footer'>
                    {/* like */}
                    <button
                        className='btn'
                        onClick={() => likeClick(data.liked)}
                        style={{position: 'relative', bottom: 2}}
                    >
                        <i className={data && data.liked ? 'la la-heart' : 'la la-heart-o'} />
                    </button>
                    <button
                        className='btn font-weight-bold'
                        onClick={viewLikes}
                    >
                        {translations(locale).newsfeed.likes}<span> {data ? data.likeCount : 0}</span>
                    </button>

                    {/* view */}
                    <button
                        className='btn ml-3'
                        onClick={viewClick}
                        style={{position: 'relative', bottom: 2}}
                    >
                        <i className='la la-eye' />
                    </button>
                    <button
                        className='btn font-weight-bold'
                        onClick={viewClick}
                    >
                        {translations(locale).newsfeed.views}<span> {data ? data.viewCount : 0}</span>
                    </button>

                    {/* comment */}
                    {
                        data.typeCode && data.typeCode.toLowerCase() === 'newsfeed' &&
                        <button
                            style={{float: 'right'}}
                            className={`btn font-weight-bold ${viewComment ? 'nf-footer-button-active' : ''}`}
                            onClick={toggleComment}
                        >
                            {translations(locale).newsfeed.comments}<span> {data['commentCount'] ? data['commentCount'] : 0}</span>
                        </button>
                    }
                    {
                        data.typeCode && data.typeCode.toLowerCase() === 'newsfeed' &&
                        <button
                            style={{float: 'right', position: 'relative', bottom: 2}}
                            className={'btn'}
                        >
                            <i className='la la-comment' />
                        </button>
                    }
                </div>
                {
                    data && data.typeCode.toLowerCase() === 'newsfeed' && data && data['comments'] && data['comments'].length > 0 &&
                    <div className='nf-item-comments-container'>
                        {
                            calculatorOfCommentButton(data)
                        }
                        {
                            data && data['comments'] && data['comments'].length > 0
                                ? data['comments'].map(comment => {
                                    return (
                                        <div key={'comment_id_' + comment.id}>
                                            <Comment
                                                locale={locale}
                                                user={user}
                                                comment={comment}
                                                commentSaveSuccess={commentSaveSuccess}
                                                deleteAction={commentDeleteHandler}
                                                onEditCommentSubmit={onEditCommentSubmit}
                                                editCommentSuccess={editCommentSuccess}
                                            />
                                            {
                                                calculatorOfReplyButton(comment)
                                            }
                                            {
                                                comment.replies && comment.replies.length > 0
                                                    ?
                                                    comment.replies.map(reply => {
                                                        return (
                                                            <div key={'reply_id_' + reply.id} className='ml-30'>
                                                                <Comment
                                                                    locale={locale}
                                                                    user={user}
                                                                    comment={reply}
                                                                    replyComment={true}
                                                                    deleteAction={commentDeleteHandler}
                                                                    onEditCommentSubmit={onEditCommentSubmit}
                                                                    editCommentSuccess={editCommentSuccess}
                                                                />
                                                            </div>
                                                        )
                                                    })
                                                    :
                                                    null
                                            }
                                            <div className='ml-30'>
                                                <ReplyComment
                                                    placeholder={translations(locale).newsfeed.reply_comment}
                                                    user={user}
                                                    locale={locale}
                                                    newsfeedId={data.id}
                                                    parent={comment.id}
                                                    onSave={onReplySave}
                                                    mainReply={false}
                                                    commentSaveSuccess={commentSaveSuccess}
                                                />
                                            </div>
                                        </div>
                                    )
                                })
                                : null
                        }
                    </div>
                }
                {
                    viewComment && <div className='nf-item-new-reply'>
                        <Reply
                            placeholder={translations(locale).newsfeed.post_reply}
                            user={user}
                            locale={locale}
                            newsfeedId={data.id}
                            parent={null}
                            onSave={onReplySave}
                            mainReply={true}
                            commentSaveSuccess={commentSaveSuccess}
                        />
                    </div>
                }
                {
                    modalEdit &&
                    <EditModal
                        onClose={_closeModalEdit}
                        onEdit={_submitEdit(data.id)}
                    >
                        <PostEdit
                            locale={locale}
                            data={data}
                            selectedHdrName={data['newsfeedHdrName']}
                            errorDescriptionEdit={errorDescriptionEdit}
                            onSubmit={onSubmitHandler}
                            onSubmitClick={submitClick}
                            selectedTreeData={selectedTreeData}
                            userRoles={userRoles}
                            hdrs={hdrs}
                        />
                    </EditModal>
                }
                {
                    modalDelete &&
                    <DeleteModal
                        size= {data.update === true ? 'md' : 'xl'}
                        onClose={_closeModalDelete}
                        data = {data}
                        onSubmit={_submitDelete(data.id, data.update, phoneNumber, description)}
                        loginPhone = {loginPhone}
                        errorDeletePhoneNumber = {errorDeletePhoneNumber}
                        errorDeleteDescription = {errorDeleteDescription}
                    />
                }
                {/* <Modal
                    size={'fullscreen'}
                    dimmer={'blurring'}
                    open={modalEdit}
                    onClose={_closeModalEdit}
                    className="react-modal"
                >
                    <div className="header">{translations(locale).newsfeed.post_edit || null}
                        <button type="button" className="close" aria-label="Close" onClick={_closeModalEdit} >
                            <CloseRoundedIcon />
                        </button>
                    </div>
                    <div className="content">
                        {
                            <PostEdit
                                locale={locale}
                                data={data}
                                selectedHdrName={data['newsfeedHdrName']}
                                errorDescriptionEdit={errorDescriptionEdit}
                                onSubmit={onSubmitHandler}
                                onSubmitClick={submitClick}
                                selectedTreeData={selectedTreeData}
                                userRoles={userRoles}
                                hdrs={hdrs}
                            />
                        }
                    </div>
                    <div className="actions modal-footer">
                        <div className="col-12 text-center">
                            <button className="btn btn-link ml-2"
                                onClick={_closeModalEdit}>{translations(locale).back || null}
                            </button>
                            <button className="btn m-btn--pill m-btn--air btn-warning m-btn--wide"
                                onClick={() => _submitEdit(data.id)}>{translations(locale).edit || null}
                            </button>
                        </div>
                    </div>
                </Modal> */}
                {/* <Modal
                    size={data.update === true ? 'small' : 'large'}
                    dimmer={'blurring'}
                    open={modalDelete}
                    onClose={_closeModalDelete}
                    className="react-modal"
                >
                    <div className="header">{translations(locale).newsfeed.post_delete || null}
                        <button type="button" className="close" aria-label="Close" onClick={_closeModalDelete} >
                            <CloseRoundedIcon />
                        </button>
                    </div>
                    <div className="content">
                        {
                            data.update === true
                            ?
                                <div>
                                    <p>{translations(locale).delete_confirmation || null}</p>
                                    <p>{translations(locale).delete_confirmation_description || null}</p>
                                </div>
                            :
                                <div>
                                    <div className="form-group m-form__group">
                                        <div className="m-portlet newsfeed-item-style">
                                            <div className="m-portlet__head">
                                                <div className="m-portlet__head-caption">
                                                    <div className="m-portlet__head-title">
                                                        <div className='nf-item-header'>
                                                            <div>
                                                                <img
                                                                    src={data && data.avatar ? data.avatar : '/images/image_placeholder.jpg'}
                                                                    alt='user'
                                                                    onError={(e) => {
                                                                        e.target.onError = null,
                                                                            e.target.src = '/images/avatar.png'
                                                                    }}
                                                                />
                                                            </div>
                                                            <div>
                                                                <span>{data && data.firstName ? capitalize(data.firstName) : ''}<span/> <i className='fa fa-caret-right ml-2 mr-2' style={{position: 'relative', top: 1, color: '#7b7e8a'}}/> {data && data.hdrName ? data.hdrName : ''}</span>
                                                                <span><span style={{backgroundColor: '#c9cbd1', padding: '2px 6px', borderRadius: 4}}>{data && data.roleName ? data.roleName : '-'}</span>  •  {data && data.createdDate ? data.createdDate : '-'}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='nf-item-container'>
                                                <div className='nf-item-content'>
                                                    <div className='nf-item-content-newsfeed'>
                                                        {data && data.content ? renderTitle(data.content) : null}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="form-group m-form__group row">
                                        <label htmlFor="example-text-input" className="col-3 col-form-label text-right">
                                            {translations(locale).finance.contact || null}
                                        </label>
                                        <div className="col-5">
                                            <input
                                                className={errorDeletePhoneNumber ? "form-control m-input m-input--air error-border" : "form-control m-input m-input--air"}
                                                placeholder={translations(locale).teacher.phone_number || null}
                                                type="number"
                                                value={phoneNumber || ''}
                                                onChange={(e) => _inputChangedPhoneNumber(e)}
                                            />
                                            {
                                                errorDeletePhoneNumber
                                                    ?
                                                    <span className="error-message-10">
                                                        {translations(locale).teacher.insert_phone_number}
                                                    </span>
                                                    : null
                                            }
                                        </div>
                                        <div className="col-4">
                                        </div>
                                    </div>
                                    <div className="form-group m-form__group row">
                                        <label htmlFor="example-text-input" className="col-3 col-form-label text-right">
                                            {translations(locale).description || null}
                                        </label>
                                        <div className="col-6">
                                            <textarea
                                                className={errorDeleteDescription ? 'error-border-solid form-control m-input m-input--air' : 'form-control m-input m-input--air'}
                                                placeholder={translations(locale).description || null}
                                                rows="3"
                                                value={description || ''}
                                                onChange={(e) => _textAreaChangeDescription(e)}
                                            >
                                            </textarea>
                                            {
                                                errorDeleteDescription
                                                    ?
                                                    <span className="error-message-10">
                                                        {translations(locale).insert_description}
                                                    </span>
                                                    : null
                                            }
                                        </div>
                                        <div className="col-3">
                                        </div>
                                    </div>
                                </div>
                        }
                    </div>
                    <div className="actions modal-footer">
                        <div className="col-12 text-center">
                            <button className="btn btn-link ml-2"
                                onClick={_closeModalDelete}>{translations(locale).back || null}
                            </button>
                            <button className="btn m-btn--pill m-btn--air btn-danger m-btn--wide"
                                onClick={() => _submitDelete(data.id, data.update, phoneNumber, description)}>{translations(locale).delete || null}
                            </button>
                        </div>
                    </div>
                </Modal> */}
            </div>
        </VisibilitySensor>
    )
}
export default Item;