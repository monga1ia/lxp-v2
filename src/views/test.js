import React, { useState } from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import * as tus from 'tus-js-client';
import axios from 'axios';
import { JitsiMeeting } from '@jitsi/react-sdk'
import { fetchRequest } from '../utils/fetchRequest';

const accessToken = '4f5d56b4363860ab4e7fea58ce7cf266';

const headerDelete = {
    Accept: 'application/vnd.vimeo.*+json;version=3.4',
    Authorization: `bearer ${accessToken}`,
    'Content-Type': 'application/x-www-form-urlencode'
};

const headerPatch = {
    'Tus-Resumable': '1.0.0',
    'Upload-Offset': 0,
    'Content-Type': 'application/offset+octet-stream',
    Accept: 'application/vnd.vimeo.*+json;version=3.4'
};

const headerPost = {
    Accept: 'application/vnd.vimeo.*+json;version=3.4',
    Authorization: `bearer ${accessToken}`,
    'Content-Type': 'application/json'
};

const test = () => {

    const [showMeeting, setShowMeeting] = useState(true)

    return (
        <>
            <Row className="g-3 row-cols-1 row-cols-lg-2 row-cols-xxl-3 mb-5">
                <Col>
                    <Card className="h-100">

                    </Card>
                </Col>
                <Col>
                    <Card className="h-100">
                        <Card.Body>
                            {
                                showMeeting
                                    ?
                                    <JitsiMeeting
                                        domain={'live.eschool.mn'}
                                        roomName="3DL3B92M"
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
                                        jwt={"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb250ZXh0Ijp7InVzZXIiOnsiYXZhdGFyIjpudWxsLCJuYW1lIjoiVHVnc2JheWFyMTciLCJjb250YWN0IjoiZV9hZG1pbiJ9fSwibW9kZXJhdG9yIjpmYWxzZSwiYXVkIjoiaml0c2kiLCJpc3MiOiJlU2Nob29sIiwic3ViIjoibGl2ZS5lc2Nob29sLm1uIiwicm9vbSI6IjNETDNCOTJNIn0.qu5COHFjkT-6-2-nSivlijeZrnpxGu82-A7oWw5A_-Y"}
                                        interfaceConfigOverwrite={{
                                            MOBILE_APP_PROMO: false,
                                            TOOLBAR_BUTTONS: [
                                                'microphone', 'camera', 'closedcaptions', 'desktop', 'fullscreen',
                                                'hangup', 'chat', 'raisehand', 'videoquality', 'shortcuts',
                                                'tileview', 'videobackgroundblur', 'stats'
                                            ],
                                        }}
                                        lang={'mn'}
                                        userInfo={{
                                            displayName: 'LMS'
                                        }}
                                        onApiReady={(externalApi) => {
                                            console.log('API', externalApi)
                                            externalApi.addListener('mouseLeave', (e) => {
                                                console.log('MOUSE LEAVE', e)
                                            })
                                            externalApi.addListener('videoConferenceLeft', (e) => {
                                                console.log('CONF LEFT', e)
                                            })
                                            externalApi.addListener('participantLeft', (participant) => {
                                                console.log('participantLeft', participant?.id)
                                            })
                                            // here you can attach custom event listeners to the Jitsi Meet External API
                                            // you can also store it locally to execute commands
                                        }}
                                        onReadyToClose={(e) => {
                                            console.log('>>>>>> READY TO CLOSE >>>>', e)
                                        }}
                                        getIFrameRef={(iframeRef) => { iframeRef.style.height = '400px'; }}
                                    />
                                    :
                                    <button className='btn btn-primary' onClick={() => {
                                        setShowMeeting(true)
                                    }}>SHOW MEETING</button>
                            }

                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </>
    );
};

export default test;
