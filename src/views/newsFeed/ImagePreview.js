import React, {useEffect, useState, useRef} from 'react';
import {Backdrop} from "@mui/material";
import {queryUrl} from 'utils/Util'
// import {getUrl} from "Actions/promiseUtil";
// TODO would be cool if I add keyboard event listener and slide through photos using arrow keys.

const ImagePreview = ({open, onClose, data, activeIndex}) => {
    const [index, setIndex] = useState(activeIndex);
    const [idle, setIdle] = useState(false);
    let idleTimer;
    const count = data && data.length > 1 ? data.length : 0;

    const wrapper = useRef();

    const footerClick = (event, index) => {
        event.stopPropagation();
        setIndex(index);
    }

    const onMouseMove = () => {
        if (idleTimer) {
            clearTimeout(idleTimer);
        }
        setIdle(false);
        idleTimer = setTimeout(() => {
            setIdle(true);
        }, 3000)
    }

    useEffect(() => {
        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('keydown', onKeyDown, false);
        idleTimer = setTimeout(() => {
            setIdle(true);
        }, 3000);
        // Focusing on ImagePreview component.
        // Otherwise Image slider is listening to keyboard event at the background.
        wrapper.current && wrapper.current.focus();
        return () => {
            if (idleTimer) {
                clearTimeout(idleTimer);
            }
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('keydown', onKeyDown, false);
        }
    }, [])

    const onKeyDown = e => {
        switch (e.key) {
            case 'Escape': {
                onClose();
                break;
            }
            // case 'ArrowRight': {
            //     // onNextClick();
            //     if (index + 1 < count) {
            //         console.log('index>>>', index);
            //         console.log('count>>>', count);
            //         setIndex(index + 1);
            //     }
            //     e.preventDefault();
            //     break;
            // }
            // case 'ArrowLeft': {
            //     if (index && index > 0) {
            //         setIndex(index - 1);
            //     }
            //     e.preventDefault();
            //     break;
            // }
            default: {
                return;
            }
        }
    }

    const onPrevClick = e => {
        e && e.stopPropagation();
        if (index && index > 0) {
            setIndex(index - 1);
        }
    }

    const onNextClick = e => {
        e && e.stopPropagation();
        if (index + 1 < count) {
            setIndex(index + 1);
        }
    }

    return (
        <Backdrop
            className={'nf-backdrop'}
            open={open}
            onClick={onClose}
        >
            <div className='nf-image-backdrop-container' ref={wrapper} tabIndex={0}>
                <div style={{visibility: `${idle ? 'hidden' : 'visible'}`}} className='nf-image-backdrop-head'>
                    <span>
                        {count ? `${index + 1} / ${count}` : null}
                    </span>
                    <button
                        className='nf-image-backdrop-close-btn'
                    >
                        <i className='la la-times'/>
                    </button>
                </div>
                <div className='nf-image-backdrop-img'>
                    {
                        !idle && count > 0 &&
                        [
                            <button
                                onClick={onPrevClick}
                                className='nf-image-backdrop-prev-btn'
                                key={'img-prev'}
                            >
                                <i className='la la-arrow-left'/>
                            </button>,
                            <button
                                onClick={onNextClick}
                                className='nf-image-backdrop-next-btn'
                                key={'img-next'}
                            >
                                <i className='la la-arrow-right'/>
                            </button>
                        ]
                    }

                    {
                        data[index].fileType === 'youtube'
                            ?
                            <iframe
                                src={`https://www.youtube.com/embed/${queryUrl(data[index].path, false)['v']}`}
                                width={'100%'}
                                height={'100%'}
                                frameBorder={0}
                            />
                            :
                            data[index].fileType === 'vimeo'
                                ?
                                <iframe
                                    // src={getUrl + '/common/vimeo?id=' + data[index].vimeoId}
                                    width={'100%'}
                                    height={'100%'}
                                    frameBorder={0}
                                />
                                :
                                data[index]?.id
                                    ?
                                    <img
                                        onClick={(e) => e.stopPropagation()}
                                        src={data[index]?.path}
                                        alt='Image'
                                    />
                                    :
                                    <img
                                        onClick={(e) => e.stopPropagation()}
                                        src={'https://drive.google.com/uc?export=view&id=' + queryUrl(data[index]?.path, false)['id']}
                                        alt='Image'
                                    />
                    }
                </div>
                {
                    count > 0 &&
                    <div className='nf-image-backdrop-footer'>
                        {
                            data.map((img, i) => {
                                const className = index === i ? 'nf-image-backdrop-footer-active' : null;

                                if (img.id) {
                                    return (
                                        <img
                                            key={i}
                                            onClick={(e) => footerClick(e, i)}
                                            className={className}
                                            src={img.path}
                                            alt=''
                                        />
                                    )
                                } else {
                                    return (
                                        <img
                                            key={i}
                                            onClick={(e) => footerClick(e, i)}
                                            className={className}
                                            src={'https://drive.google.com/uc?export=view&id=' + queryUrl(img.path, false)['id']}
                                            alt=''
                                        />
                                    )
                                }

                            })
                        }
                    </div>
                }
            </div>
        </Backdrop>
    )
}

export default ImagePreview;