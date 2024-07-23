import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
// import { NavLink } from 'react-router-dom';
import { Dropdown } from 'react-bootstrap';
import secureLocalStorage from 'react-secure-storage'
// import { SearchRounded } from '@mui/icons-material';
import classNames from 'classnames';
import { OverlayScrollbarsComponent } from 'overlayscrollbars-react';
// import { MENU_PLACEMENT } from 'constants.js';
// import CsLineIcons from 'cs-line-icons/CsLineIcons';
import { layoutShowingNavMenu } from 'layout/layoutSlice';
import showMessage from "../../modules/message";
import { setLoading, setSelectedSchool } from '../../utils/redux/action';
import { NDropdown as Drop } from 'widgets/Dropdown';
import { NDropdown as Drop2 } from 'widgets/NavDropdown'
import Select from 'modules/Form/Select';

// const MENU_NAME = 'Schools';
const Schools = () => {
    const dispatch = useDispatch();
    const { t } = useTranslation();

    const {
        // placementStatus: { view: placement },
        behaviourStatus: { behaviourHtmlData },
        attrMobile,
        attrMenuAnimate,
    } = useSelector((state) => state.menu);
    const { color } = useSelector((state) => state.settings);

    const [classOptions, setClassOptions] = useState([
        { value: "1", refId: "refId", gid: "2323", text: "1A" },
        { value: "2", refId: "refId2", gid: "232", text: "2B" },
    ])

    const { isStudent = false } = useSelector(state => state.person)
    const { schools, selectedSchool } = useSelector((state) => state.schoolData);

    const [selectedSchoolID, setSelectedSchoolID] = useState(selectedSchool?.id || null)
    const [selectedClassID, setSelectedClassID] = useState(0)

    // const { showingNavMenu } = useSelector((state) => state.layout);
    const [searchValue, setSearchValue] = useState('');

    // const onToggle = (status, event) => {
    //     if (event && event.stopPropagation) event.stopPropagation();
    //     else if (event && event.originalEvent && event.originalEvent.stopPropagation) event.originalEvent.stopPropagation();
    //     dispatch(layoutShowingNavMenu(status ? MENU_NAME : ''));
    // };
    useEffect(() => {
        dispatch(layoutShowingNavMenu(''));
        // eslint-disable-next-line
    }, [attrMenuAnimate, behaviourHtmlData, attrMobile, color]);

    // useEffect(() => {
    //     if (isOrganizationUser) {
    //         if (!selectedSchool || Object.keys(selectedSchool).length === 0) {
    //             showMessage(t('errorMessage.selectSchool'))
    //         }
    //     } else {
    //         if(typeof isStudent == "boolean" && !isStudent){
    //             if (!selectedSchool || Object.keys(selectedSchool).length === 0) {
    //                 showMessage(t('errorMessage.selectSchool'))
    //             }
    //         }
    //     }        
    // }, [])

    const onSearch = (nameKey) => {
        setSearchValue(nameKey)
    }

    const renderData = (obj) => {
        return (
            <li key={`schoolItem.${obj.id}`}
                style={{ cursor: 'pointer' }}
                className="py-2 border-bottom border-separator-light d-flex school-option" onClick={() => {
                    dispatch(setSelectedSchool(obj))
                    dispatch(setLoading(true));
                    setTimeout(() => {
                        window.location.reload()
                    }, 100)
                    // 
                }}>
                <span className="label">{obj?.name}</span>
            </li>
        )
    }

    const myEl = document.getElementById('htmlHEAD')
    // console.log(myEl)

    const SchoolsDropdownToggle = React.memo(
        React.forwardRef(({ onClick, expanded = false }, ref) => (
            <div style={{
                display: 'flex',
                flexDirection: 'column',
            }}>
                <button
                    ref={ref}
                    href="#/"
                    className="notification-button nav_long_button br-12"
                    data-toggle="dropdown"
                    aria-expanded={expanded}
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onClick(e);
                    }}
                >
                    <div className='d-flex align-items-center'>
                        <div style={{
                            maxHeight: 50,
                            color: "#868aa8",
                            overflow: 'hidden',
                            paddingLeft: '16px',
                            // padding-right: 16px;
                        }}>
                            {`${selectedSchool && selectedSchool?.id ? selectedSchool.name : t('common.selectSchool')} \u003E`}
                        </div>
                    </div>
                </button>

                <button
                    ref={ref}
                    href="#/"
                    className="notification-button nav_long_button br-12"
                    data-toggle="dropdown"
                    aria-expanded={expanded}
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onClick(e);
                    }}
                >
                    <div className='d-flex align-items-center'>
                        <div style={{
                            maxHeight: 50,
                            color: "#868aa8",
                            overflow: 'hidden'
                        }}>
                            {`${selectedSchool && selectedSchool?.id ? selectedSchool.name : t('common.selectSchool')} \u003E`}
                        </div>
                    </div>
                </button>
            </div>
        ))
    );

    const SchoolsDropdownMenu = React.memo(
        React.forwardRef(({ style, className, labeledBy }, ref) => {
            return (
                <div ref={ref} style={{ transform: '' }} className={classNames('dropdown-menu wide user-menu', className)} aria-labelledby={labeledBy}>
                    {/* search */}
                    <input type='text' value={searchValue} autoFocus placeholder={t('action.search')} onInput={(e) => onSearch(e.target.value)} />
                    <OverlayScrollbarsComponent
                        style={{ maxHeight: 250 }}
                        options={{
                            overflowBehavior: {
                                x: "hidden",
                                y: "scroll"
                            },
                            scrollbars: {
                                visibility: "auto",
                                autoHide: "never",
                                dragScrolling: false,
                                clickScrolling: false,
                                touchSupport: true,
                                snapHandle: false
                            },
                        }}
                    >
                        <ul className="list-unstyled border-last-none">
                            {schools && schools.map((schoolObj) => (
                                searchValue && searchValue.length > 0
                                    ?
                                    schoolObj.name.toLowerCase().includes(searchValue.toLowerCase()) &&
                                    renderData(schoolObj)
                                    :
                                    renderData(schoolObj)
                            ))}
                        </ul>
                    </OverlayScrollbarsComponent>
                </div>
            );
        })
    );
    const customStyle = {
        option: (base, state) => {
            let backgroundColor = 'white'
            let fontWeight = '700'

            if (state.isSelected) {
                fontWeight = '700'
            }

            if (state.isFocused) {
                backgroundColor = "blue";
            }

            return {
                ...base,
                backgroundColor
            };
        }
    }
    if (schools && schools.length > 0 && !isStudent) {
        return (
            <div style={{
                display: 'flex',
                flexDirection: 'column',
            }}>
                <div
                    className='m-0'
                    aria-expanded='true' style={{}}>
                    <Select
                        clearable={false}
                        searchable={true}
                        fillArrow={true}
                        className="hideSelectArrow school"
                        style={customStyle}
                        placeholder={t("teacher.select_school")}
                        options={schools?.map(obj => {
                            return {
                                value: obj?.id,
                                text: obj?.shortName
                            }
                        })}
                        classNamePrefix='my-className-prefix'
                        value={selectedSchoolID}
                        onChange={(e) => {
                            setSelectedSchoolID(e);
                            dispatch(setSelectedSchool(schools.find(obj => obj?.id == e)))
                            window.location.reload()
                        }}
                    />
                </div>
                <div
                    className='mt-2'
                    aria-expanded='true' style={{}}>
                    <Select
                        clearable={false}
                        fillArrow={true}
                        searchable={true}
                        className="hideSelectArrow class"
                        classNamePrefix='my-className-prefix'
                        placeholder={t("food.choose_class")}
                        options={classOptions}
                        value={selectedClassID}
                        onChange={(e, data) => setSelectedClassID(e)}
                    />
                </div>
            </div>
        );
    } else {
        return <></>;
    }
};
export default React.memo(Schools);
