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
    const { isStudent = false, isOrganizationUser = false} = useSelector(state => state.person)
    const { schools, selectedSchool } = useSelector((state) => state.schoolData);
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

    useEffect(() => {
        if (isOrganizationUser) {
            if (!selectedSchool || Object.keys(selectedSchool).length === 0) {
                showMessage(t('errorMessage.selectSchool'))
            }
        } else {
            if(typeof isStudent == "boolean" && !isStudent){
                if (!selectedSchool || Object.keys(selectedSchool).length === 0) {
                    showMessage(t('errorMessage.selectSchool'))
                }
            }
        }        
    }, [])

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
                    secureLocalStorage.removeItem('exam_template_table_index')
                    secureLocalStorage.removeItem('exam_table_index')
                    secureLocalStorage.removeItem('exam_grade_index')
                    secureLocalStorage.removeItem('exam_subject_index')
                    secureLocalStorage.removeItem('group_teacher_table_index')
                    secureLocalStorage.removeItem('group_student_table_index')
                    secureLocalStorage.removeItem('podcast_index_table_index')
                    secureLocalStorage.removeItem('podcast_index_grade_index')
                    secureLocalStorage.removeItem('groups_index_table_index')
                    secureLocalStorage.removeItem('groups_index_grade_index')

                    setTimeout(() => {
                        window.location.reload()
                    }, 100)
                    // 
                }}>
                <span className="label">{obj?.name}</span>
            </li>
        )
    }

    const SchoolsDropdownToggle = React.memo(
        React.forwardRef(({ onClick, expanded = false }, ref) => (
            <a
                ref={ref}
                href="#/"
                className="notification-button"
                data-toggle="dropdown"
                aria-expanded={expanded}
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onClick(e);
                }}
            >
                <div className="position-relative d-inline-flex" style={{ color: 'white' }}>
                    <div className='d-flex align-items-center mb-3'>
                        <div className='pt-1' style={{
                            maxHeight: 50,
                            color: "#868aa8",
                            overflow: 'hidden'
                        }}>
                            {`${selectedSchool && selectedSchool?.id ? selectedSchool.name : t('common.selectSchool')} \u003E`}
                        </div>
                    </div>
                </div>
            </a>
        ))
    );

    const SchoolsDropdownMenu = React.memo(
        React.forwardRef(({ style, className, labeledBy }, ref) => {
            return (
                <div ref={ref} style={{transform: ''}} className={classNames('dropdown-menu wide user-menu', className)} aria-labelledby={labeledBy}>
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

    if (isOrganizationUser) {
        return (
            <Dropdown
                style={{ transform: 'translate(0px, 0px)', textAlign: 'center', zIndex: 1000 }}
            >
                <Dropdown.Toggle as={SchoolsDropdownToggle} />
                <Dropdown.Menu
                    className={window.innerWidth < 768 ? 'school-nav-phone mt-2' : 'mt-2'}
                    style={{ maxHeight: 300, transform: 'translate(209px, 54px) !important' }}
                    as={SchoolsDropdownMenu}
                // popperConfig={{
                //     modifiers: [
                //         {
                //             name: 'offset',
                //             options: {
                //                 offset: () => {
                //                     if (placement === MENU_PLACEMENT.Horizontal) {
                //                         return [0, 7];
                //                     }
                //                     if (window.innerWidth < 768) {
                //                         return [-168, 7];
                //                     }
                //                     return [-162, 7];
                //                 },
                //             },
                //         },
                //     ],
                // }}
                />
            </Dropdown>
        );
    } else {
        if (schools && schools.length > 0 && !isStudent) {
            return (
                <Dropdown
                    style={{ transform: 'translate(0px, 0px)', textAlign: 'center', zIndex: 1000 }}
                >
                    <Dropdown.Toggle as={SchoolsDropdownToggle} />
                    <Dropdown.Menu
                        className={window.innerWidth < 768 ? 'school-nav-phone mt-2' : 'mt-2'}
                        style={{ maxHeight: 300, transform: 'translate(209px, 54px) !important' }}
                        as={SchoolsDropdownMenu}
                    // popperConfig={{
                    //     modifiers: [
                    //         {
                    //             name: 'offset',
                    //             options: {
                    //                 offset: () => {
                    //                     if (placement === MENU_PLACEMENT.Horizontal) {
                    //                         return [0, 7];
                    //                     }
                    //                     if (window.innerWidth < 768) {
                    //                         return [-168, 7];
                    //                     }
                    //                     return [-162, 7];
                    //                 },
                    //             },
                    //         },
                    //     ],
                    // }}
                    />
                </Dropdown>
            );
        } else {
            return <></>;
        }
    }
};
export default React.memo(Schools);
