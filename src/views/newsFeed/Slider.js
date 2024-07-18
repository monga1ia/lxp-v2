import React, { useState } from 'react';
import Slick from 'react-slick';
import ImagePreview from "./ImagePreview";
import {queryUrl, youtubeUrl} from 'utils/Util'
// import {getUrl} from "Actions/promiseUtil";

const PrevArrow = (props) => {
    const { onClick } = props;
    return (
        <div className='nf-slider-prev' onClick={onClick}>
            <i className='la la-angle-left'/>
        </div>
    );
}

const NextArrow = (props) => {
    const { onClick } = props;
    return (
        <div className='nf-slider-next' onClick={onClick}>
            <i className='la la-angle-right'/>
        </div>
    )
}

const Slider = ({ data }) => {
    const [ view, setView ] = useState(false);
    const [ viewIndex, setViewIndex ] = useState(null);
    
    const settings = {
        infinite: false,
        dots: true,
        // lazyLoad: true,
        nextArrow: <NextArrow />,
        prevArrow: <PrevArrow />,
        appendDots: dots => (
            <div>
                <ul className='nf-slick-dots' style={{ margin: "0px" }}> {dots} </ul>
            </div>
        ),
        centerPadding: '500px',
    }

    // const onViewFooterImgClick = index => {
    //     setViewIndex(index);
    // }

    return (
        <div>
            <Slick {...settings} >
                {
                    data && data.length > 0 && data.map((img, i) => {
                        if (img.fileType === 'youtube') {
                            return (
                                <div
                                    key={i}
                                    className='nf-slick-container'
                                >
                                    <iframe
                                        src={`https://www.youtube.com/embed/${youtubeUrl(img.path)}`}
                                        className={"nf-slick-image"}
                                        frameBorder={0}
                                    />
                                </div>
                            )
                        } else if (img.fileType === 'vimeo') {
                            return (
                                <div
                                    key={i}
                                    className='nf-slick-container'
                                >
                                    <iframe
                                        // src={getUrl + '/common/vimeo?id=' + img['vimeoId']}
                                        className={"nf-slick-image"}
                                        frameBorder={0}
                                    />
                                </div>
                            )
                        } else {
                            if(img.id && img.path && img.path !== null) {
                                if (img.id) {
                                    return (
                                        <div
                                            key={i}
                                            className='nf-slick-container'
                                        >
                                            <div
                                                className='nf-slick-image'
                                                onClick={() => {
                                                    setView(true);
                                                    setViewIndex(i);
                                                }}
                                            >
                                                <img src={img.path} />
                                            </div>
                                        </div>
                                    )
                                } else {
                                    return (
                                        <div
                                            key={i}
                                            className='nf-slick-container'
                                        >
                                            <div
                                                className='nf-slick-image'
                                                // style={{ backgroundImage: `url(${img.path})` }}
                                                onClick={() => {
                                                    setView(true);
                                                    setViewIndex(i);
                                                }}
                                            >
                                                <img src={`https://drive.google.com/uc?export=view&id=${queryUrl(img.path, false)['id']}`} />
                                            </div>
                                        </div>
                                    )
                                }
                            }
                        }
                    })
                }
            </Slick>
            {
                view &&
                <ImagePreview
                    open={view}
                    onClose={() => setView(false)}
                    data={data}
                    activeIndex={viewIndex}
                />
            }
        </div>
    )
}

export default Slider;