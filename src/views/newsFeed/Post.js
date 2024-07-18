import React, { useEffect, useState } from 'react';
import { NDropdown as Dropdown } from "widgets/Dropdown";
import { translations } from "utils/translations";
import { capitalize } from "utils/Util";
import { Checkbox } from "semantic-ui-react";
import CollectionsOutlinedIcon from '@mui/icons-material/CollectionsOutlined';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import TheatersIcon from '@mui/icons-material/Theaters';
import message from 'modules/message';

const Post = ({ 
    locale, 
    user, 
    checkBoxValue, 
    availableHeaders, 
    postRoles, 
    userRoles, 
    selected, 
    headerIdChange,
    checkBoxChange, 
    onSubmit, 
    onSubmitSuccess, 
    errorHeaderIds,
    errorDescription 
}) => {
    const [description, setDescription] = useState('');
    const [images, setImages] = useState([]);
    const [files, setFiles] = useState([]);
    const [video, setVideo] = useState([]);
    const [vimeoAvailable, setVimeoAvailable] = useState(false)
    const [selectedRoleId, setSelectedRoleId] = useState(null)
    const [selectedRoleText, setSelectedRoleText] = useState('')
    const [headers, setHeaders] = useState([]);
    const [selectedHeaderId, setSelectedHeaderId] = useState(null);
    const [selectedSubHeaderIds, setSelectedSubHeaderIds] = useState([]);
    const [subHeaders, setSubHeaders] = useState([]);
    const [filterRoles, setFilterRoles] = useState([]);

    const filterHdrs = (headers) => {
        let headerArray = [];
        if(headers && headers.length){
            for (let i = 0; i < headers.length; i++) {
                headerArray.push({
                    value: headers[i].value,
                    text: headers[i].text,
                })
            }
        }

        setHeaders(headerArray)
    }

    useEffect(() => {
        if (onSubmitSuccess > 0) {
            clearInput()
        }
        // filterVimeoHandler(selected)
        // filterRole(selected)
        filterHdrs(availableHeaders)

        // if(selected && selected.length){
        //     setSelectedHeaderId(selected[0])
        // }

        checkUserRole(userRoles)
        checkHdrId(selected)
    }, [user, onSubmitSuccess, selected, postRoles, userRoles]);

    const clearInput = () => {
        setDescription('');
        setImages([]);
        setFiles([]);
        setVideo([]);
    }

    const checkUserRole = () => {
        let filterRoleList = [];

        if (userRoles && userRoles.length > 0) {
            for (let i = 0; i < userRoles.length; i++) {
                let userRoleCode = userRoles[i].code;

                if (postRoles.includes(userRoleCode)) {
                    filterRoleList.push(userRoles[i])
                }
            }
        }

        if(filterRoleList.length){
            setSelectedRoleId(filterRoleList[0].value)
            setSelectedRoleText(filterRoleList[0].text)
        }

        setFilterRoles(filterRoleList)
    }

    const checkHdrId = () => {
        // console.log(availableHeaders)
        if(availableHeaders && availableHeaders.length > 0){
            for(let i = 0; i < availableHeaders.length; i++){
                if(selected == availableHeaders[i].id){
                    setSelectedSubHeaderIds([availableHeaders[i].id])
                }
            }
        }
    }

    const filterVimeoHandler = (hdrValue) => {
        // if (availableHeaders && availableHeaders.length > 0) {
        //     let allCanUploadVimeo = false;
        //     for (let i = 0; i < availableHeaders.length; i++) {
        //         let availableHdr = availableHeaders[i];
        //         // if (hdrValue.indexOf(availableHdr.id) > -1) {
        //         //     if (availableHdr['school'] === 1 || availableHdr['school'] === true) {
        //         //         allCanUploadVimeo = true;
        //         //     } else {
        //         //         // can not upload vimeo
        //         //         allCanUploadVimeo = false;
        //         //         break;
        //         //     }
        //         // } else {
        //         // }
        //     }
        //     setVimeoAvailable(allCanUploadVimeo)
        // } else {
        //     setVimeoAvailable(false)
        // }
    }

    const onSubHeadersChange = (e, data) => {
        setSelectedSubHeaderIds(data.value)
        headerIdChange(data.value);
    }

    const filterRole = (id, type) => {
        let filterRoles = filterPostRoles(id);

        if (filterRoles && filterRoles.length > 0) {
            setSelectedRoleId(filterRoles[0].value)
            setSelectedRoleText(filterRoles[0].text)
        }
    }

    const checkBoxHandler = (e, data) => {
        checkBoxChange(data.checked);
    }

    const descriptionChange = e => {
        setDescription(e.target.value);
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

    const uploadImage = async (e) => {
        e.persist();
        if (e.target.files && e.target.files.length > 0) {
            if (e.target.files.length > 10) {
                message(translations(locale).newsfeed.image_count_error);
            } else {
                let imagesArray = [];
                for (let i = 0; i < e.target.files.length; i++) {
                    const image = e.target.files[i];
                    const verified = verifyImage(image);

                    if (verified) {
                        imagesArray.push(image)
                    }
                }
                const newImages = await Promise.all(imagesArray);
                setImages([...images, ...newImages]);
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
        let imagesCopy = [...images];
        imagesCopy.splice(index, 1);

        setImages(imagesCopy)
    }

    const verifyFileSize = file => {
        const acceptedType = [
            'image/x-png',
            'image/png',
            'image/jpg',
            'image/jpeg',
            'image/gif',
        ];

        if (file.size > 52428800) { // 50MB
            message(translations(locale).newsfeed.file_size_warning);
            return false;
        }

        const imageType = file.type;
        if (acceptedType.includes(imageType)) {
            message(translations(locale).err.image_type_error_1);
            return false;
        }

        return true;
    }

    const uploadFile = async e => {
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
            setFiles([...files, ...newFiles]);
        }

        // Had to use this one before. Because uploading same file again was not working.
        e.target.value = null;
    }

    const removeFile = index => {
        let filesCopy = [...files];
        filesCopy.splice(index, 1);
        setFiles(filesCopy);
    }

    const uploadVideo = async e => {
        e.persist();
        if (e.target.files && e.target.files.length > 0 && e.target.files.length === 1) {
            let videoArray = e.target.files;
            if (video.length > 0) {
                setVideo([...[], ...videoArray]);
            } else {
                setVideo([...video, ...videoArray]);
            }
        } else {
            message('Нэгээс ихгүй видео хуулах боломжтой', false)
        }

        // Had to use this one before. Because uploading same file again was not working.
        e.target.value = null;
    }

    const removeVideo = index => {
        setVideo([]);
    }

    const handlePostClick = () => {
        if (vimeoAvailable) {
            onSubmit(selected, description, images, files, video, checkBoxValue, selectedRoleId)
        } else {
            onSubmit(selected, description, images, files, [], checkBoxValue, selectedRoleId)
        }
    }

    const filterPostRoles = () => {
        // let filterRoles = [];

        // if (userRoles && userRoles.length > 0) {
        //     for (let i = 0; i < userRoles.length; i++) {
        //         let userRoleCode = userRoles[i].code;

        //         if (postRoles.includes(userRoleCode)) {
        //             filterRoles.push(userRoles[i])
        //         }
        //     }
        // }

        // if(filterRoles.length){
        //     setSelectedRole(filterRoles[0].value)
        //     setSelectedRoleText(filterRoles[0].text)
        // }

        // return filterRoles;
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
                                    src={user?.avatar || '/images/avatar.png'}
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
                                    {user.firstName ? capitalize(user.firstName) : '-'}
                                </span>
                                <br></br>
                                <span className="m-widget4__sub">
                                    {
                                        selected && selected.length > 0 && filterRoles && filterRoles.length > 1 
                                        ?
                                            <div className='nf-post-footer-buttons' 
                                                style={{
                                                    display: 'inline-flex'
                                                }}
                                            >
                                                <Dropdown
                                                    className=''
                                                    style={{ minWidth: 160, maxWidth: 200 }}
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
                                        :
                                            <div className='col-form-label'>
                                                {filterRoles.length > 0 && filterRoles[0].text}
                                            </div>
                                    }
                                    {/* <Dropdown
                                        className={errorHeaderIds ? 'error-border' : 'w-50'}
                                        placeholder={'-' + translations(locale).select + '-' || ""}
                                        fluid
                                        selection
                                        search
                                        additionPosition='bottom'
                                        upward={false}
                                        selectOnBlur={false}
                                        value={selectedHeaderId}
                                        options={headers}
                                        onChange={onHeadersChange}
                                    /> */}
                                    <i className='fa fa-caret-right ml-3 mr-2' style={{position: 'relative', top: 3}}/>
                                    <Dropdown
                                        className={errorHeaderIds ? 'error-border' : 'w-50'}
                                        placeholder={'-' + translations(locale).select + '-' || ""}
                                        fluid
                                        selection
                                        search
                                        multiple
                                        additionPosition='bottom'
                                        upward={false}
                                        selectOnBlur={false}
                                        value={selectedSubHeaderIds}
                                        options={headers}
                                        onChange={onSubHeadersChange}
                                    />
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='nf-post-area'>
                    <textarea
                        className={errorDescription ? 'error-border-solid nf-post-description' : 'nf-post-description'}
                        placeholder={translations(locale).action.typeHere}
                        rows={4}
                        onChange={descriptionChange}
                        value={description}
                        spellCheck={false}
                    />
                </div>
                <div className='nf-post-image-preview'>
                    {
                        images.length > 0
                            ? images.map((imageObj, i) => {
                                return (
                                    <div key={i}>
                                        <img
                                            src={URL.createObjectURL(imageObj)}
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
                </div>
            </div>
            <div className='nf-post-footer'>
                <div className='d-flex flex-column'>
                    <div className='d-flex align-items-center justify-content-start mb-2' style={{ gap: 5 }}>
                        <label
                            htmlFor="imageInput"
                            className="btn m-btn--pill btn-outline-warning d-flex align-items-center justify-content-center btn-sm text-uppercase"
                        >
                            <CollectionsOutlinedIcon />
                            <span className='ml-2'>
                                {translations(locale).insert_photo}
                            </span>
                        </label>
                        <input
                            style={{ display: 'none' }}
                            id='imageInput'
                            onChange={uploadImage}
                            type='file'
                            multiple
                            accept="image/*"
                        />
                        <label
                            htmlFor='fileInput'
                            className='btn m-btn--pill btn-outline-publish d-flex align-items-center justify-content-center btn-sm text-uppercase'
                        >
                            <AttachFileIcon />
                            <span className='ml-2'>
                                {translations(locale).insert_file}
                            </span>
                        </label>
                        <input
                            style={{ display: 'none' }}
                            id="fileInput"
                            onChange={uploadFile}
                            type="file"
                            multiple
                        />
                        {/* {
                            vimeoAvailable &&
                            <label
                                htmlFor='videoInput'
                                className='btn m-btn--pill btn-outline-primary d-flex align-items-center justify-content-center btn-sm text-uppercase'
                            >
                                <TheatersIcon />
                                <span className='ml-2'>
                                    {translations(locale).insert_video}
                                </span>
                            </label>
                        }
                        {
                            vimeoAvailable &&
                            <input
                                style={{ display: 'none' }}
                                id="videoInput"
                                onChange={uploadVideo}
                                type="file"
                                accept={'video/*'}
                                multiple
                            />
                        } */}
                    </div>
                    <div className='d-flex align-items-center justify-content-between'>
                        <Checkbox
                            label={translations(locale).comment_receive}
                            onChange={checkBoxHandler}
                            checked={checkBoxValue}
                        />
                        <button
                            className='btn m-btn--pill btn-success m-btn--wide text-uppercase'
                            onClick={handlePostClick}
                        >
                            {translations(locale).action.post}
                        </button>
                    </div>
                </div>
                <div className='nf-post-file-preview'>
                    {
                        files.length > 0 && (
                            <span className='nf-post-size-warning'>
                                {translations(locale).newsfeed.file_size_warning}
                            </span>
                        )
                    }
                    {
                        files.length > 0
                            ? files.map((file, i) => {
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
                    {/* {
                        video.length > 0
                            ? video.map((video, i) => {
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
        </div>
    )
}

export default Post;