import React, { useState, useEffect } from "react";
import { useHistory, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button, Card, Row } from "react-bootstrap";
import { decode } from 'string-encode-decode';
import { getWindowDimensions } from "utils/utils";
import { PhoneMissed, Mic, MicOff } from 'lucide-react';
import { makeStyles } from "@material-ui/core";
import { JitsiMeeting } from '@jitsi/react-sdk'
import { fetchRequest } from "utils/fetchRequest";
import showMessage from "modules/message";
import { useSelector } from "react-redux";
import { webinarP2P } from 'utils/fetchRequest/Urls';
import TabComponent from "components/tab/Tab";
import EndModal from "./modals/end";

const useStyles = makeStyles({
    root: {
        fontSize: '0.9rem',
        padding: '0px 15px',
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        border: '1px solid #EBEDF2',
        boxShadow: 'none',
        borderRadius: 8,
        height: 38,
        fontFamily: 'Mulish'
    },
});

export default function EditWebinar() {
    const { t } = useTranslation();
    const history = useHistory();
    const classes = useStyles();
    const { height } = getWindowDimensions();
    const [loading, setLoading] = useState(false);
    const [showEndModal, setShowEndModal] = useState(false);
    const [jwtToken, setJwtToken] = useState(null)
    const [isEnd, setIsEnd] = useState(false);
    const { selectedSchool } = useSelector(state => state.schoolData);
    const [webinar, setWebinar] = useState(null)
    const [searchValue, setSearchValue] = useState('')
    const [webinarMessage, setWebinarMessage] = useState('')
    const [userCount, setUserCount] = useState(0)
    const [invitedCount, setInvitedCount] = useState(0)
    const [userList, setUserList] = useState([
        {
            id: 1,
            firstName: 'galaa',
            studentCode: 'CO12123123',
            className: '1A'
        }
    ])

    const init = (params) => {
        console.log('init params', params)
        setLoading(true)
        fetchRequest(webinarP2P, 'POST', params)
            .then((res) => {
                console.log('init res', res)
                if (res.success) {
                    setWebinar({
                        name: res?.name || '',
                        displayName: res?.displayName || '',
                        roomCode: res?.roomCode || '',
                    })
                    setJwtToken(res?.jwt || null)
                    setIsEnd(res?.isFinished || false)
                    setWebinarMessage(res?.message || '')
                } else {
                    showMessage(res.message)
                    setWebinarMessage(res?.message || '')
                }
                setLoading(false)
            })
            .catch(() => {
                showMessage(t('errorMessage.title'));
                setLoading(false)
            })
    }

    useEffect(() => {
        let params = {
            school: selectedSchool.id,
            code: location?.href.split('?id=')[1]
        }

        init(params);
    }, []);

    const renderTabs = (list) => {
        let tabs = []

        tabs.push(
            {
                id: 1,
                title: t('webinar.label.users') + ' | ' + userCount,
                children: []
            },
            {
                id: 2,
                title: t('webinar.label.invited') + ' | ' + invitedCount,
                children: []
            }
        )

        return tabs
    }

    const onHandlerEnd = () => {
        setShowEndModal(true)
    }

    const endSubmit = () => {
        let params = {
            school: selectedSchool.id,
            id: location?.href.split('?id=')[1]
        }

        setLoading(true)
        fetchRequest(webinarP2P, 'POST', params)
            .then((res) => {
                console.log('init res', res)
                if (res.success) {
                    //
                } else {
                    showMessage(res.message)
                }
                setLoading(false)
            })
            .catch(() => {
                showMessage(t('errorMessage.title'));
                setLoading(false)
            })
    }

    const onHandlerInputChange = (e) => {
        setSearchValue(e.target.value);

        // if (value) {
        //     const searchValue = value?.toLowerCase()
        //     setUserList(userList.filter(list => list?.some(user =>
        //         user?.userId != currentUserId && (user?.firstName?.toLowerCase()?.includes(searchValue) || user?.studentCode?.toLowerCase()?.includes(searchValue) || user?.className?.toLowerCase()?.includes(searchValue))
        //     )) || [])
        // } else {
        //     setUserList(userList || [])
        // }
    }

    const onHandlerMicOff = (e, index) => {
        if(userList && userList.length > 0){
            let cloneUserList = [...userList]

            if(!cloneUserList[index].isMic){
                cloneUserList[index].isMic = true
            } else {
                cloneUserList[index].isMic = false
            }
    
            setUserList(cloneUserList)
        }
    }

    return (
        <>
            <div style={{ backgroundColor: '#000', padding: 20 }}>
                <div className='row'>
                    <div className="col" style={{ width: '100%' }}>
                        <div className="col-12">
                            <div className='mb-3 fs-20' style={{ color: '#fff' }}>
                                {(webinar?.name || '')}
                            </div>
                        </div>
                        <div className="col-12">
                            <Card className="">
                                <Card.Body className style={{ height: height - 86, padding: 0 }}>
                                    {
                                        !isEnd && jwtToken && webinar
                                        ?
                                            <JitsiMeeting
                                                domain={'live.eschool.mn'}
                                                roomName={webinar?.roomCode || ''}
                                                jwt={jwtToken}
                                                configOverwrite={{
                                                    startWithAudioMuted: true,
                                                    disableModeratorIndicator: true,
                                                    startScreenSharing: false,
                                                    enableWelcomePage: false,
                                                    enableEmailInStats: false,
                                                    requireDisplayName: true,
                                                    prejoinPageEnabled: false,
                                                    p2p: {
                                                        enabled: true
                                                    }
                                                }}
                                                interfaceConfigOverwrite={{
                                                    MOBILE_APP_PROMO: false,
                                                    // TOOLBAR_BUTTONS: [
                                                    //     'microphone', 'camera', 'closedcaptions', 'desktop', 'fullscreen',
                                                    //     'hangup', 'chat', 'raisehand', 'videoquality', 'shortcuts',
                                                    //     'tileview', 'videobackgroundblur', 'stats'
                                                    // ],
                                                }}
                                                userInfo={{
                                                    displayName: webinar?.displayName || '',
                                                }}
                                                onApiReady={(externalApi) => {
                                                    console.log('>>>', externalApi)
                                                    // here you can attach custom event listeners to the Jitsi Meet External API
                                                    // you can also store it locally to execute commands
                                                }}
                                                onReadyToClose={(e) => {
                                                    setJwtToken(null)
                                                    setWebinar(null)
                                                    setIsEnd(true)

                                                    // to do call end api
                                                    endSubmit()
                                                    console.log('>>>>>> READY TO CLOSE >>>>')
                                                }}
                                                getIFrameRef={(iframeRef) => { iframeRef.style.height = ((height  - 86) + 'px')}}
                                            />
                                        :
                                            <p className="d-flex text-center align-items-center justify-content-center w-100 h-100 pinnacle-demi-bold fs-20">{webinarMessage || t('webinar.errorMessage.end')}</p>
                                    }
                                </Card.Body>
                            </Card>
                        </div>
                    </div>
                    {/* {
                        !isEnd &&
                        <div className="col" style={{ maxWidth: 420 }}>
                            <Card className="">
                                <TabComponent
                                    tabs={renderTabs()}
                                />
                                <Card.Body style={{ height: height - 90, padding: 15 }}>
                                    <div className='col-12'>
                                        <input
                                            value={searchValue}
                                            className={classes.root}
                                            placeholder={t('action.search')}
                                            onChange={e => onHandlerInputChange(e)}
                                        />
                                    </div>
                                    <div className="col-12">
                                        <ul className="list-group">
                                            {
                                                userList && userList.length > 0 &&
                                                userList.map((data, index) => {
                                                    return (
                                                        <li key={'user_' + index} className="d-flex justify-content-between align-items-center mt-3">
                                                            <div className="d-flex align-items-center">
                                                                <img className="profile rounded-circle" alt={data.firstName} src={data.avatar ? data.avatar : 'https://lxp-test.eschool.mn/images/avatar.png'} width={40} height={40} />
                                                                <div className="fs-13 ms-3">
                                                                    <span className='d-block black-color' style={{fontWeight: 300}}>{data?.firstName || '-'}</span>
                                                                    <span className='d-block black-color' style={{fontWeight: 300}}>{(data?.studentCode || '-') + ' | ' + (data?.className || '-')}</span>
                                                                </div>
                                                            </div>
                                                            <div className="d-flex align-items-center">
                                                                {
                                                                    data.isMic 
                                                                    ?
                                                                        <button className="btn" onClick={(e) => onHandlerMicOff(e, index)}>
                                                                            <Mic size={24} color='#868AA8'/>
                                                                        </button>
                                                                    :
                                                                        <button className="btn" onClick={(e) => onHandlerMicOff(e, index)}>
                                                                            <MicOff size={24} color='#868AA8'/>
                                                                        </button>
                                                                }
                                                            </div>
                                                        </li>
                                                    )
                                                })
                                            }
                                        </ul>
                                    </div>
                                </Card.Body>
                            </Card>
                        </div>
                    } */}
                </div>
            </div>
            {
                showEndModal && 
                <EndModal
                    show={showEndModal}
                    onClose={() => setShowEndModal(false)}
                    onSave={() => endSubmit()}
                />
            }
            {
                loading &&
                <>
                    <div className='loader-container'>
                        <svg className="splash-spinner" viewBox="0 0 50 50">
                            <circle className="path" cx="25" cy="25" r="20" fill="none" strokeWidth="5" />
                        </svg>
                    </div>
                </>
            }
        </>
    );
}
