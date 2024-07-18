import React, { useEffect, useState } from 'react';
import { NDropdown as Dropdown } from "widgets/Dropdown";
import { translations } from "utils/translations";
import { toast } from "react-toastify";
import { Checkbox } from "semantic-ui-react";
import { queryUrl, capitalize, linkify } from "utils/Util";
// import { getUrl } from "Actions/promiseUtil";
import message from 'modules/message';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import CollectionsOutlinedIcon from '@mui/icons-material/CollectionsOutlined';
import { find } from 'lodash';

const PostEdit = ({
    locale,
    data,
    errorDescriptionEdit,
    onSubmit,
    onSubmitClick,
    selectedTreeData,
    userRoles,
    hdrs
}) => {
    const [descriptionEdit, setDescriptionEdit] = useState(data.content ? data.content : '');
    const [imagesEdit, setImagesEdit] = useState([]);
    const [imagesPreviewEdit, setPreviewImagesEdit] = useState([]);
    const [filesEdit, setFilesEdit] = useState([]);
    const [videoEdit, setVideoEdit] = useState([]);
    const [attachments, setAttachments] = useState(data.files);
    const [removedArray, setRemovedArray] = useState([]);
    const [selectedRoleId, setSelectedRoleId] = useState(null);
    const [selectedRoleText, setSelectedRoleText] = useState(null);
    const [filterRoles, setFilterRoles] = useState([]);
    const [checkBoxValue, setCheckBoxValue] = useState(data.typeCode && data.typeCode.toLowerCase() == 'newsfeed' ? true : false);

    useEffect(() => {
        checkUserRole()
        if (onSubmitClick) {
            collectData()
        }
    }, [onSubmitClick]);

    const findHdr = (array, id) => {
        if(array && array.length > 0){
            for(let i = 0; i < array.length; i++){
                if(array[i].key == id){
                    let filterRoleList = [];

                    if (userRoles && userRoles.length > 0) {
                        for (let u = 0; u < userRoles.length; u++) {
                            let userRoleCode = userRoles[u].code;
                            
                            if (array[i].postRoleCodes.includes(userRoleCode)) {
                                filterRoleList.push(userRoles[u])
                            }
                        }
                    }

                    if(filterRoleList.length){
                        if(filterRoleList.length == 1){
                            setSelectedRoleId(filterRoleList[0].value)
                            setSelectedRoleText(filterRoleList[0].text)
                        } else if(filterRoleList.length > 1) {
                            setSelectedRoleId(data.roleId)
                            setSelectedRoleText(data.roleName)
                        }
                    }

                    console.log('filterRoleList', filterRoleList)

                    setFilterRoles(filterRoleList)
                    break
                } else {
                    if(array[i].children && array[i].children.length > 0){
                        findHdr(array[i].children, id)
                    }
                }
            }
        }
    }

    const checkUserRole = () => {
        let filterRoleList = [];

        if(selectedTreeData && selectedTreeData.key == 'all'){  
            findHdr(hdrs, data.hdrId)
        } else {
            if (userRoles && userRoles.length > 0) {
                for (let i = 0; i < userRoles.length; i++) {
                    let userRoleCode = userRoles[i].code;
    
                    if (selectedTreeData.postRoles.includes(userRoleCode)) {
                        filterRoleList.push(userRoles[i])
                    }
                }
            }
    
            if(filterRoleList.length){
                if(filterRoleList.length == 1){
                    setSelectedRoleId(filterRoleList[0].value)
                    setSelectedRoleText(filterRoleList[0].text)
                } else if(filterRoleList.length > 1) {
                    setSelectedRoleId(data.roleId)
                    setSelectedRoleText(data.roleName)
                }
            }

            setFilterRoles(filterRoleList)
        }
    }

    const collectData = () => {
        onSubmit(data['id'], descriptionEdit, imagesEdit, filesEdit, videoEdit, checkBoxValue, removedArray, selectedRoleId)
    }

    const checkBoxEditHandler = (e, data) => {
        setCheckBoxValue(data.checked);
    }

    const descriptionChange = e => {
        setDescriptionEdit(e.target.value);
    }

    const verifyImage = file => {
        const acceptedType = [
            'image/x-png',
            'image/png',
            'image/jpg',
            'image/jpeg',
            'image/gif',
        ];
        const acceptedSize = 52428800; // 50MB
        if (file) {
            const imageSize = file.size;
            const imageType = file.type;
            if (imageSize > acceptedSize) {
                message(translations(locale).err.image_size_error);
                return false;
            }
            if (!acceptedType.includes(imageType)) {
                message(translations(locale).err.image_type_error);
                return false;
            }
            return true;
        }
    };

    const fileToDataUri = file => {
        return new Promise((res) => {
            const reader = new FileReader();
            const { type, name, size } = file;
            reader.addEventListener('load', () => {
                res({
                    base64: reader.result,
                    name,
                    type,
                    size,
                })
            });
            reader.readAsDataURL(file);
        })
    }

    const uploadImageEdit = async (e) => {
        e.persist();
        if (e.target.files && e.target.files.length > 0) {
            if (e.target.files.length > 10) {
                message(translations(locale).newsfeed.image_count_error);
            } else {
                let imagesArray = [];
                let imagesPreviewArray = [];
                for (let i = 0; i < e.target.files.length; i++) {
                    const image = e.target.files[i];
                    const verified = verifyImage(image);

                    if (verified) {
                        imagesArray.push(image)
                        imagesPreviewArray.push(fileToDataUri(image))
                    }
                }
                const newImagesPreview = await Promise.all(imagesPreviewArray);
                const newImages = await Promise.all(imagesArray);
                setPreviewImagesEdit([...imagesPreviewEdit, ...newImagesPreview]);
                setImagesEdit([...imagesEdit, ...newImages]);
            }
        }

        // Had to use this one before. Because uploading same file again was not working.
        e.target.value = null;
    }

    const getSize = size => {
        if (size === 0)
            return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];

        const i = Math.floor(Math.log(size) / Math.log(k));
        return `${parseFloat((size / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
    }

    const removeImage = index => {
        let imagesCopy = [...imagesEdit];
        imagesCopy.splice(index, 1);
        setPreviewImagesEdit(imagesCopy);
    }

    const removeAttachmentImage = index => {
        let imagesCopy = [...attachments];

        removedArray.push(imagesCopy[index].id)
        setRemovedArray(removedArray)

        imagesCopy.splice(index, 1);
        setAttachments(imagesCopy);
    }

    const verifyFileSize = file => {
        if (file.size > 52428800) { // 50MB
            message(translations(locale).newsfeed.file_size_warning);
            return false;
        }
        return true;
    }

    const uploadFileEdit = async e => {
        e.persist();
        if (e.target.files && e.target.files.length > 0) {
            let filesArray = [];
            for (let i = 0; i < e.target.files.length; i++) {
                const file = e.target.files[i];

                if (verifyFileSize(file)) {
                    filesArray.push(file)
                }
            }
            const newFiles = await Promise.all(filesArray);
            setFilesEdit([...filesEdit, ...newFiles]);
        }

        // Had to use this one before. Because uploading same file again was not working.
        e.target.value = null;
    }

    const removeFile = index => {
        let filesCopy = [...filesEdit];
        filesCopy.splice(index, 1);
        setFilesEdit(filesCopy);
    }

    let removeFileEdit = (index, type) => {
        const cloneAttachment = [...attachments];

        removedArray.push(cloneAttachment[index].id);

        cloneAttachment.splice(index, 1)
        setAttachments(cloneAttachment)
    }

    const uploadVideoEdit = async e => {
        e.persist();
        if (e.target.files && e.target.files.length > 0 && e.target.files.length === 1) {
            let videoArray = e.target.files;
            setVideoEdit([...videoEdit, ...videoArray]);
        } else {
            message('Нэгээс ихгүй видео хуулах боломжтой', false)
        }

        // Had to use this one before. Because uploading same file again was not working.
        e.target.value = null;
    }

    const removeVideo = index => {
        setVideoEdit([]);
    }

    const onRoleChange = (e, data) => {
        setSelectedRoleId(data.value)
        if (data.value) {
            let selectedOption = data.options.find(opt => opt.value === data.value);
            setSelectedRoleText(selectedOption ? selectedOption.text : null)
        } else {
            setSelectedRoleText(null)
        }
    }

    return (
        <div className="m-portlet m-portlet--rounded">
            <div className="m-portlet__body">
                <div className='nf-post-header'>
                    <div className="m-widget4 m-widget4--progress">
                        <div className="m-widget4__item">
                            <div className="m-widget4__img m-widget4__img--pic">
                                <img
                                    alt={'image'}
                                    className='m--img-rounded m--marginless m--img-centered'
                                    src={data && data.avatar ? data.avatar : '/images/avatar.jpg'}
                                    height={45}
                                    width={45}
                                    onError={(e) => {
                                        e.target.onError = null,
                                            e.target.src = '/images/avatar.png'
                                    }}
                                />
                            </div>
                            <div className="m-widget4__info">
                                <span className="m-widget4__title">
                                    {data && data.firstName ? capitalize(data.firstName) : ''}<span/> <i className='fa fa-caret-right ml-2 mr-2' style={{position: 'relative', top: 1, color: '#7b7e8a'}}/> {data && data.hdrName ? data.hdrName : ''}
                                </span>
                                <br></br>
                                <span className="m-widget4__sub">
                                    <span><span style={{backgroundColor: '#c9cbd1', padding: '2px 6px', borderRadius: 4}}>{data && data.roleName ? data.roleName : '-'}</span>  • {data && data.createdDate ? data.createdDate : '-'}</span>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='nf-post-area'>
                    <textarea
                        className={errorDescriptionEdit ? 'error-border-solid nf-post-description' : 'nf-post-description'}
                        placeholder={translations(locale).action.typeHere}
                        rows={5}
                        onChange={descriptionChange}
                        value={descriptionEdit}
                        spellCheck={false}
                    />
                </div>
                <div className='nf-post-image-preview'>
                    {
                        imagesPreviewEdit.length > 0
                            ? imagesPreviewEdit.map((imageObj, i) => {
                                return (
                                    <div key={i}>
                                        <img
                                            src={imageObj.base64}
                                            alt=''
                                        />
                                        <span>{imageObj.size ? getSize(imageObj.size) : '-'}</span>
                                        <span>{imageObj.name ? imageObj.name : '-'}</span>
                                        <span onClick={() => removeImage(i)}>
                                            {translations(locale).remove}
                                        </span>
                                    </div>
                                )
                            })
                            : null
                    }
                    {
                        attachments.length > 0
                            ? attachments.map((imageObj, i) => {
                                if(imageObj.isImage){
                                    return (
                                        <div key={i}>
                                            <img
                                                src={imageObj.path}
                                                alt=''
                                            />
                                            <span>{imageObj.size ? getSize(imageObj.size) : '-'}</span>
                                            <span>{imageObj.name ? imageObj.name : '-'}</span>
                                            <span onClick={() => removeAttachmentImage(i)}>
                                                {translations(locale).remove}
                                            </span>
                                        </div>
                                    )
                                }
                            })
                            : null
                    }
                </div>

                <div className='nf-post-file-preview' style={{ marginTop: 20 }}>
                    {
                        filesEdit.length > 0
                            ? filesEdit.map((file, i) => {
                                return (
                                    <div key={i} className='m-portlet m-portlet--rounded nf-post-file-info'>
                                        <span>{file.name ? file.name : '-'}</span>
                                        <button
                                            className='btn btn-danger m-btn m-btn--icon btn-sm m-btn--icon-only m-btn--pill m-btn--air'
                                            onClick={() => removeFile(i)}
                                        >
                                            <i className='la la-close' />
                                        </button>
                                    </div>
                                )
                            })
                            : null
                    }
                    {
                        attachments && attachments.length > 0
                            ? attachments.map((file, i) => {
                                if (file.isFile) {
                                    return (
                                        <div key={i} className='m-portlet m-portlet--rounded nf-post-file-info'>
                                            <span>{file.name ? file.name : '-'}</span>
                                            <button
                                                className='btn btn-danger m-btn m-btn--icon btn-sm m-btn--icon-only m-btn--pill m-btn--air'
                                                onClick={() => removeFileEdit(i, 'file')}
                                            >
                                                <i className='la la-close' />
                                            </button>
                                        </div>
                                    )
                                } else if (file.fileType === 'vimeo' && file.vimeoId) {
                                    return (
                                        <div key={i} className='m-portlet m-portlet--rounded nf-post-file-info'>
                                            <span>{file.name ? file.name : '-'}</span>
                                            <button
                                                className='btn btn-danger m-btn m-btn--icon btn-sm m-btn--icon-only m-btn--pill m-btn--air'
                                                onClick={() => removeFileEdit(i, 'vimeo')}
                                            >
                                                <i className='la la-close' />
                                            </button>
                                        </div>
                                    )
                                }
                            })
                            : null
                    }
                    {/* {
                        videoEdit.length > 0
                            ? videoEdit.map((video, i) => {
                                return (
                                    <div key={i} className='m-portlet m-portlet--rounded nf-post-file-info'>
                                        <span>{video.name ? video.name : '-'}</span>
                                        <button
                                            className='btn btn-danger m-btn m-btn--icon btn-sm m-btn--icon-only m-btn--pill m-btn--air'
                                            onClick={() => removeVideo(i)}
                                        >
                                            <i className='la la-close' />
                                        </button>
                                    </div>
                                )
                            })
                            : null
                    } */}
                </div>
            </div>
            <div className='nf-post-footer'>
                <div className='nf-post-footer-buttons'>
                    <div className='d-flex align-items-center justify-content-start mb-2' style={{ gap: 5 }}>
                        <label
                            htmlFor="imageInputEdit"
                            className="btn m-btn--pill btn-outline-warning d-flex align-items-center justify-content-center btn-sm text-uppercase"
                        >
                            <CollectionsOutlinedIcon />
                            <span className='ml-2'>
                                {translations(locale).insert_photo}
                            </span>
                        </label>
                        <input
                            style={{ display: 'none' }}
                            id='imageInputEdit'
                            onChange={uploadImageEdit}
                            type='file'
                            multiple
                            accept="image/*"
                        />
                        <label
                            htmlFor='fileInputEdit'
                            className='btn m-btn--pill btn-outline-publish d-flex align-items-center justify-content-center btn-sm text-uppercase'
                        >
                            <AttachFileIcon />
                            <span className='ml-2'>
                                {translations(locale).insert_file}
                            </span>
                        </label>
                        <input
                            style={{ display: 'none' }}
                            id="fileInputEdit"
                            onChange={uploadFileEdit}
                            type="file"
                            multiple
                        />
                        {/* {
                            (data?.isSchool === 1 || data?.isSchool === true) && <label
                                htmlFor='videoInputEdit'
                                className='btn m-btn--pill btn-outline-primary nf-post-upload-video'
                            >
                                {translations(locale).insert_video}
                            </label>
                        } */}
                        {/* {
                            (data?.isSchool === 1 || data?.isSchool === true) &&
                            <input
                                style={{ display: 'none' }}
                                id="videoInputEdit"
                                onChange={uploadVideoEdit}
                                type="file"
                                accept={'video/*'}
                                multiple
                            />
                        } */}
                        <Checkbox
                            label={translations(locale).comment_receive}
                            onChange={checkBoxEditHandler}
                            checked={checkBoxValue}
                        />
                    </div>
                    {
                            filterRoles && filterRoles.length > 1 && <div className='nf-post-footer-buttons' style={{
                                display: 'block',
                                float: 'right',
                                width: 200,
                                height: 35,
                            }}>
                                <Dropdown
                                    className=''
                                    style={{ maxWidth: 200 }}
                                    placeholder={'-' + translations(locale).select + '-' || ""}
                                    fluid
                                    selection
                                    search
                                    additionPosition='bottom'
                                    upward={false}
                                    selectOnBlur={false}
                                    value={selectedRoleId}
                                    options={filterRoles}
                                    onChange={onRoleChange}
                                />
                            </div>
                        }
                </div>
            </div>
        </div>
    )
}

export default PostEdit;