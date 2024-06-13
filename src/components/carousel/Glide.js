import React, { useEffect, useState } from "react";
import GlideJs from "@glidejs/glide";
import "@glidejs/glide/dist/css/glide.core.min.css";
import { useWindowSize } from "hooks/useWindowSize";
import { useSelector } from "react-redux";
import CsLineIcons from "cs-line-icons/CsLineIcons";

const Glide = ({
    index = 0,
    className = "",
    options = {
        gap: 0,
        rewind: false,
        bound: true,
        perView: 6,
        breakpoints: {
            400: { perView: 1 },
            1000: { perView: 2 },
            1400: { perView: 3 },
            1900: { perView: 5 },
            3840: { perView: 6 },
        },
    },
    noDots = false,
    noControls = false,
    children,
    selectedChildIndex,
    extraButton = false,
    extraButtonPrevName = '',
    extraButtonNextName = ''
}) => {
    const carouselRef = React.useRef();
    const glideRef = React.useRef();
    const { width } = useWindowSize();

    const { placementStatus, behaviourStatus, attrMobile } = useSelector(
        (state) => state.menu
    );

    const [selectedIndex, setSelectedIndex] = useState(0)
    const [loading, setLoading] = useState(false)

    const init = () => {
        glideRef.current = new GlideJs(carouselRef.current, options);

        if (!noDots) {
            glideRef.current.on(["mount.before"], () => {
                const bulletCount =
                    glideRef.current.selector.querySelectorAll(".glide__slide").length;
                const bulletWrapper =
                    glideRef.current.selector.querySelectorAll(".glide__bullets")[0];

                if (!bulletWrapper) {
                    return;
                }

                while (bulletWrapper.firstChild) {
                    bulletWrapper.removeChild(bulletWrapper.firstChild);
                }

                for (let i = 0; i < bulletCount; i += 1) {
                    const button = document.createElement("button");
                    button.className = "glide__bullet";
                    button.setAttribute("data-glide-dir", `=${i}`);
                    bulletWrapper.appendChild(button);
                }
            });
        }

        // Hiding them with d-none if it is needed
        glideRef.current.on(["resize", "build.after"], () => {
            const { perView } = glideRef.current.settings;
            const total =
                glideRef.current.selector.querySelectorAll(".glide__slide").length;
            const sub = total - perView;

            // Adds or removes d-none class
            glideRef.current.selector
                .querySelectorAll(".glide__bullet")
                .forEach((el, i) => {
                    if (i > sub) {
                        el.classList.add("d-none");
                    } else {
                        el.classList.remove("d-none");
                    }
                });
            // Prevents the empty last stop when resized for a larger breakpoint with more items
            if (glideRef.current.index > sub && sub >= 0) {
                glideRef.current.go(`=${sub}`);
            }
        });

        glideRef.current.on(['mount.after', 'run'], () => {
            const currentIndex = glideRef.current.index;

            const prevBtn = glideRef?.current?.selector.querySelector("[data-glide-dir='<']");
            const nextBtn = glideRef?.current?.selector.querySelector("[data-glide-dir='>']");
            const totalBullet = glideRef.current.selector.querySelectorAll(".glide__slide").length

            if(prevBtn && currentIndex <= 0){
                prevBtn.disabled = true;
                prevBtn.className = 'btn btn-empty';
            } else {
                if(prevBtn){
                    prevBtn.disabled = false;
                    prevBtn.className = 'btn btn-icon btn-outline-primary text-uppercase pinnacle-bold';    
                }
            }

            if((nextBtn && totalBullet - 1) == currentIndex){
                nextBtn.disabled = true;
                nextBtn.className = 'btn btn-empty';
            } else {
                if(nextBtn){
                    nextBtn.disabled = false;
                    nextBtn.className = 'btn btn-icon btn-outline-primary text-uppercase pinnacle-bold';
                }
            }
        });

        glideRef?.current?.mount();
    };

    const update = () => {
        glideRef?.current?.update();
    };
    const destroy = () => {
        glideRef?.current?.destroy();
    };

    useEffect(() => {
        init();
        return () => {
            // destroy();
        };
    }, []);

    useEffect(() => {
        if (width && carouselRef?.current && glideRef?.current) {
            setTimeout(() => {
                update();
            }, 100);
        }
    }, [width, placementStatus, behaviourStatus, attrMobile]);

    return (
        <div key={'glide_' + index} ref={carouselRef} className={`glide ${className}`}>
            <div className="glide__track" data-glide-el="track">
                <div className="glide__slides">{children}</div>
                {
                    extraButton &&
                    <div className="d-flex justify-content-between mt-2">
                        <span className="glide__arrows slider-nav" data-glide-el="controls">
                            <button
                                type="button"
                                className={"btn btn-icon btn-outline-primary text-uppercase pinnacle-bold"}
                                data-glide-dir="<"
                                // onClick={(e) => onHandlerBackClick(e, selectedIndex)}
                            >
                                {
                                    extraButtonPrevName 
                                    ?
                                        extraButtonPrevName
                                    :
                                    <CsLineIcons icon="chevron-left" />
                                }
                            </button>
                        </span>
                        {!noDots && (
                            <span className="glide__bullets" data-glide-el="controls[nav]" />
                        )}{" "}
                        <span className="glide__arrows slider-nav mr-2" data-glide-el="controls">
                            <button
                                type="button"
                                className={"btn btn-icon btn-outline-primary text-uppercase pinnacle-bold"}
                                data-glide-dir=">"
                                // onClick={(e) => onHandlerNextClick(selectedIndex)}
                            >
                                {
                                    extraButtonNextName 
                                    ?
                                        extraButtonNextName
                                    :
                                    <CsLineIcons icon="chevron-right" />
                                }
                            </button>
                        </span>
                    </div>
                }
                {!noControls && (
                    <div className="text-center">
                        <span className="glide__arrows slider-nav mr-1" data-glide-el="controls">
                            <button
                                type="button"
                                className="btn btn-icon btn-icon-only btn-outline-primary" F
                                data-glide-dir="<"
                            >
                                <CsLineIcons icon="chevron-left" />
                            </button>
                        </span>{" "}
                        {!noDots && (
                            <span className="glide__bullets" data-glide-el="controls[nav]" />
                        )}{" "}
                        <span className="glide__arrows slider-nav mr-1" data-glide-el="controls">
                            <button
                                type="button"
                                className="btn btn-icon btn-icon-only btn-outline-primary"
                                data-glide-dir=">"
                            >
                                <CsLineIcons icon="chevron-right" />
                            </button>
                        </span>
                    </div>
                )}
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
        </div>
    );
};

const Item = ({ className = "", children }) => {
    return (
        <div className={`glide__slide ${className}`}>{children}</div>
    )
}

Glide.Item = Item;
Glide.Item.displayName = "Item";

export default Glide;
