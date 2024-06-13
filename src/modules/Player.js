import React, { useState, useEffect, useRef } from 'react';
import { fetchRequest } from '../utils/fetchRequest';
import { useSelector } from "react-redux";
import secureLocalStorage from 'react-secure-storage'

import useKeypress from 'react-use-keypress';
import ReactPlayer from 'react-player'

import { useParams } from "react-router-dom";
import { queryUrl } from '../utils/utils'
import { videoActionLog } from 'utils/fetchRequest/Urls';

const getWindowDimensions = () => {
    const { innerWidth: width, innerHeight: height } = window;
    return {
        width,
        height
    };
};
const useWindowDimensions = () => {
    const [windowDimensions, setWindowDimensions] = useState(
        getWindowDimensions()
    );
    useEffect(() => {
        function handleResize() {
            setWindowDimensions(getWindowDimensions());
        }
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);
    return windowDimensions;
};

const VOLUME_KEY = 'LMS_VOLUME';

function useInterval(callback, delay) {
    const intervalRef = React.useRef();
    const callbackRef = React.useRef(callback);

    // Remember the latest callback:
    //
    // Without this, if you change the callback, when setInterval ticks again, it
    // will still call your old callback.
    //
    // If you add `callback` to useEffect's deps, it will work fine but the
    // interval will be reset.

    React.useEffect(() => {
        callbackRef.current = callback;
    }, [callback]);

    // Set up the interval:

    React.useEffect(() => {
        if (typeof delay === 'number') {
            intervalRef.current = window.setInterval(() => callbackRef.current(), delay);

            // Clear interval if the components is unmounted or the delay changes:
            return () => window.clearInterval(intervalRef.current);
        }
    }, [delay]);

    // Returns a ref to the interval ID in case you want to clear it manually:
    return intervalRef;
}


const VideoPlayer = () => {

    const videoReadyRef = useRef(false)
    const seekbarRef = useRef(null);
    const playerRef = useRef(null)

    const counterRef = useRef(0);

    const { authToken } = useSelector((state) => state.auth);

    const [loading, setLoading] = useState(false);

    const [videoUrl, setVideoUrl] = useState(null)
    const { height, width } = useWindowDimensions()
    const [isPlaying, setIsPlaying] = useState(false)
    const [isFullScreen, setIsFullScreen] = useState(false)
    const [totalDuration, setTotalDuration] = useState(0)
    const [progressWidth, setProgressWidth] = useState(0)
    const [progressPercentage, setProgressPercentage] = useState(0)
    const [bufferPercentage, setBufferPercentage] = useState(0)
    const [currentTime, setCurrentTime] = useState(0)

    const [time, setTime] = React.useState(0);
    const [volume, setVolume] = useState(secureLocalStorage?.getItem(VOLUME_KEY) || 100)

    const params = useParams();

    const loadData = (id = null, token = null) => {
        if (authToken) {
            setVideoUrl('https://vimeo.com/' + id)
            // setLoading(true)
            // fetchRequest(podcastIndex, 'POST', {
            //     id
            // })
            //     .then((res) => {
            //         if (res.success) {
            //             message(res.message, true)
            //         } else {
            //             message(res.message)
            //         }
            //         setLoading(false)
            //     })
            //     .catch(() => {
            //         message(t('errorMessage.title'));
            //         setLoading(false)
            //     })
        } else {
            setVideoUrl('https://vimeo.com/' + id)
        }
    }

    const loadSync = () => {
        submitActionLog('SYNC', currentTime)
    }

    const intervalRef = useInterval(() => {
        setTime(time + 1);
        loadSync()
    }, isPlaying ? 3000 : null);

    useEffect(() => {
        const urlParams = queryUrl(window.location.search)
        loadData(params?.id, urlParams?.t)
    }, [])

    useEffect(() => {
        setProgressWidth(seekbarRef?.current?.offsetWidth)
    }, [height, width])

    useEffect(() => {

    }, [volume])

    useEffect(() => {
        document.addEventListener('fullscreenchange', (event) => {
            if (document.fullscreenElement) {
                setIsFullScreen(true)
            } else {
                setIsFullScreen(false)
            }
        });
    }, [])

    useEffect(() => {
        document.body.classList.add("h-100");
        const root = document.getElementById("root");
        if (root) {
            root.style = 'opacity:1; overflow: hidden; background-color: #000;';
            root.classList.add("h-100");
        }
        return () => {
            document.body.classList.remove("h-100");
            if (root) {
                root.classList.remove("h-100");
            }
        };
    }, []);

    useKeypress([' ', 'Spacebar'], (event) => {
        if (videoReadyRef?.current) {
            setIsPlaying(!isPlaying)
        }
    });
    useKeypress(['ArrowLeft', 'ArrowRight'], (event) => {
        if (videoReadyRef?.current && isPlaying) {
            let currentSec = totalDuration * progressPercentage / 100;
            if (event?.key === 'ArrowLeft') {
                if (currentSec > 10) {
                    setProgressPercentage(totalDuration > 0 ? (100 * (currentSec - 10)) / totalDuration : 0)
                    playerRef?.current?.seekTo(totalDuration > 0 ? ((currentSec - 10) / totalDuration) : 0);
                } else {
                    setProgressPercentage(0)
                    playerRef?.current?.seekTo(0);
                }
            } else if (event?.key === 'ArrowRight') {
                if (currentSec < totalDuration - 10) {
                    setProgressPercentage(totalDuration > 0 ? (100 * (currentSec + 10)) / totalDuration : 0)
                    playerRef?.current?.seekTo(totalDuration > 0 ? ((currentSec + 10) / totalDuration) : 0);
                } else {
                    setProgressPercentage(100)
                    playerRef?.current?.seekTo(totalDuration);
                }
            }
        }
    });

    const onProgress = (e) => {
        let percentage = 0
        let bufferPerc = 0
        if (totalDuration > 0) {
            percentage = 100 * (e?.playedSeconds || 0) / totalDuration;
            bufferPerc = 100 * (e?.loadedSeconds || 0) / totalDuration;
        }

        setCurrentTime(e?.playedSeconds)
        setProgressPercentage(percentage)
        setBufferPercentage(bufferPerc)
    }

    const getVolumeIcon = (vol) => {
        return vol == 0 ? <i className="la la-volume-mute" /> : <i className="la la-volume-up" />
    }

    const submitActionLog = (actionType = null, from = null, to = null) => {
        if (videoUrl) {
            fetchRequest(videoActionLog, 'POST', {
                type: actionType,
                videoUrl,
                from,
                to
            })
                .then((res) => {
                })
                .catch(() => {
                })
        }
    }

    const secondsToHms = (d) => {
        var h = Math.floor(d / 3600);
        var m = Math.floor(d % 3600 / 60);
        var s = Math.floor(d % 3600 % 60);

        var hDisplay = h > 0 ? h + (h == 1 ? ":" : ":") : "00:";
        var mDisplay = m > 0 ? m + (m == 1 ? ":" : ":") : "00:";
        var sDisplay = s > 0 ? s + (s == 1 ? ":" : "") : "00";

        return hDisplay + (parseInt(mDisplay) > 0 && parseInt(mDisplay) < 10 ? ('0' + mDisplay) : mDisplay) + (parseInt(sDisplay) > 0 && parseInt(sDisplay) < 10 ? ('0' + sDisplay) : sDisplay);
    }

    return (
        <>
            <div className="eschool-player"
                style={{
                    width: '100%', height: '100vh',
                    backgroundColor: '#000', position: 'relative'
                }} >
                <div onClick={() => {
                    if (videoReadyRef?.current) {
                        setIsPlaying(!isPlaying)
                    }
                }} style={{
                    width: '100%',
                    height: '100vh',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 70
                }}></div>

                {
                    videoUrl && <ReactPlayer
                        ref={playerRef}
                        url={videoUrl}
                        volume={volume / 100}
                        width={width}
                        playing={isPlaying}
                        height={height}
                        onReady={() => {
                            videoReadyRef.current = true
                        }}
                        onStart={() => {
                            if (progressPercentage > 0) {
                                const fromSec = totalDuration > 0 ? (progressPercentage * totalDuration / 100) : 0
                                submitActionLog('START', fromSec)
                            } else {
                                submitActionLog('START')
                            }
                        }}
                        onPlay={(e) => {
                            if (progressPercentage > 0) {
                                const fromSec = totalDuration > 0 ? (progressPercentage * totalDuration / 100) : 0
                                submitActionLog('RESUME', fromSec)
                            }
                        }}
                        onDuration={(e) => {
                            setTotalDuration(e)
                        }}
                        onPause={() => {
                            const fromSec = totalDuration > 0 ? (progressPercentage * totalDuration / 100) : 0
                            submitActionLog('PAUSE', fromSec)
                        }}
                        onProgress={onProgress}
                        onSeek={(e) => {
                            const fromSec = totalDuration > 0 ? (progressPercentage * totalDuration / 100) : 0
                            submitActionLog('SEEK', fromSec, e)
                        }}
                        onEnded={() => {
                            setIsPlaying(false)
                            submitActionLog('END', totalDuration)
                        }}
                        controls={false} />
                }
                <div className='controls' style={{
                    visibility: videoReadyRef?.current ? 'visible' : 'hidden'
                }}>
                    <button
                        onClick={() => {
                            setIsPlaying(!isPlaying)
                        }}
                    >
                        {
                            isPlaying ? <i className="la la-pause" /> : <i className="la la-play" />
                        }
                    </button>
                    <div ref={seekbarRef} className="progress-bar" onClick={(e) => {
                        const pos = e.pageX - seekbarRef?.current?.offsetLeft;
                        if (progressWidth > 0) {
                            const perc = 100 * pos / progressWidth
                            setProgressPercentage(perc)
                            playerRef?.current?.seekTo(parseFloat(pos / progressWidth));
                        }
                    }}>
                        <div className="progress-buffer" style={{
                            width: progressWidth > 0 ? (bufferPercentage * progressWidth / 100) : 0
                        }}></div>
                        <div className="progress-thumb" style={{
                            width: progressWidth > 0 ? (progressPercentage * progressWidth / 100) : 0
                        }}></div>
                    </div>

                    <div className='' style={{ color: 'white', margin: 'auto 20px', whiteSpace: 'nowrap' }}>{secondsToHms(currentTime) + ' / ' + secondsToHms(totalDuration)}</div>

                    <div className='volume-container'>
                        <input className="volume-slider" type="range"
                            style={{
                                accentColor: '#3c358f'
                            }}
                            value={volume} max={100} step={1} onChange={(e) => {
                                setVolume(e?.target?.value)
                                secureLocalStorage?.setItem(VOLUME_KEY, e?.target?.value)
                            }} />
                        <button type="button"
                            title={'Volume'}
                            className='volume-control'
                            onClick={() => {
                                if (volume === 0) {
                                    setVolume(secureLocalStorage?.getItem(VOLUME_KEY) ? (secureLocalStorage?.getItem(VOLUME_KEY) === 0 ? 100 : secureLocalStorage?.getItem(VOLUME_KEY)) : 100)
                                } else {
                                    setVolume(0)
                                }
                            }}>
                            {
                                getVolumeIcon(volume)
                            }</button>
                    </div>



                    {/* <div className="volume-chooser">
                        <div className="volume-control">
                            
                        </div>
                        <div class="volume-button">
                            <span class="volume-value">{volume}</span>
                        </div>
                    </div> */}

                    <button type="button"
                        title={isFullScreen ? 'Exit full screen' : 'Full screen'}
                        onClick={() => {
                            if (isFullScreen) {
                                document.exitFullscreen();
                            } else {
                                document.body.requestFullscreen()
                            }
                        }}>
                        {
                            isFullScreen ? <i className="la la-compress" /> : <i className="la la-expand" />
                        }

                    </button>
                </div>
            </div>

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
};

export default VideoPlayer;
