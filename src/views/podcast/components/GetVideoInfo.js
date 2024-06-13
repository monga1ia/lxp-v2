import React, { useEffect, useState } from 'react'
import * as tus from 'tus-js-client';
import axios from 'axios';
import message from 'modules/message';
import { useTranslation } from 'react-i18next';

const accessToken = '4f5d56b4363860ab4e7fea58ce7cf266';
const headerPost = {
    Accept: 'application/vnd.vimeo.*+json;version=3.4',
    'Content-Type': 'application/json'
};

const GetVideoInfo = () => {
    const {t} = useTranslation()
    const [response,setResponse] = useState({})
    const [progress, setProgress] = useState(0);
    const [loading,setLoading] = useState(false)

    const getVideo = async (fileId = [], onResponse = () => {}) => {
        setLoading(true)
        headerPost.Authorization = `bearer ${accessToken}`

        const response = await axios({
            method: 'get',
            url: `https://api.vimeo.com/me/videos/` + fileId,
            headers: headerPost,
        });

        if (response) {
            setResponse(response?.data)
            onResponse(response?.data)
            setLoading(false)
        }
    }

    return {
        data: response,
        progress,
        loading,
        getVideo
    }
}

export default GetVideoInfo
