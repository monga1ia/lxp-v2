import React, { useEffect, useState } from 'react'
import * as tus from 'tus-js-client';
import axios from 'axios';
import message from 'modules/message';
import { useTranslation } from 'react-i18next';

// 4f5d56b4363860ab4e7fea58ce7cf266
const accessToken = '4dabd9fd822c729751ea18fedadbee5c';
const headerPost = {
    Accept: 'application/vnd.vimeo.*+json;version=3.4',
    'Content-Type': 'application/json'
};

const useUploadVideo = () => {
    const {t} = useTranslation()
    const [response,setResponse] = useState({})
    const [progress, setProgress] = useState(0);
    const [loading,setLoading] = useState(false)

    const onUpload = async (files = [], onResponse = () => {}) => {
        const file = files[0];
        const fileSize = file?.size.toString();
        setLoading(true)
        headerPost.Authorization = `bearer ${accessToken}`

        const response = await axios({
            method: 'post',
            url: `https://api.vimeo.com/me/videos`,
            headers: headerPost,
            data: {
                upload: {
                    approach: 'tus',
                    size: fileSize
                },
                name: file?.name
            }
        });

        if (response) {
            setResponse(response?.data)
            onResponse(response?.data)
            setLoading(false)
        }

        const upload = new tus.Upload(file, {
            endPoint: 'https://api.vimeo.com/me/videos',
            uploadUrl: response.data.upload.upload_link,
            retryDelays: [0, 3000, 5000, 10000, 20000],
            metadata: {
                filename: file.name,
                filetype: file.type
            },
            headers: {},
            onError: function (error) {
                console.log('Failed because: ' + error);
                message(t('errorMessage.title'));
            },
            onProgress: function (bytesUploaded, bytesTotal) {
                let percentage = ((bytesUploaded / bytesTotal) * 100).toFixed(2);
                setProgress(percentage)
            },
            onSuccess: function () {
                console.log('Download %s from %s', upload.file.name, upload.url);
            }
        });

        upload.start();
    }

    return {
        data: response,
        progress,
        loading,
        onUpload
    }
}

export default useUploadVideo
