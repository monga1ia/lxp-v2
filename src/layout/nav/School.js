import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
// import { Dropdown } from 'react-bootstrap';
import secureLocalStorage from 'react-secure-storage'
import classNames from 'classnames';
import { OverlayScrollbarsComponent } from 'overlayscrollbars-react';
import { layoutShowingNavMenu } from 'layout/layoutSlice';
import showMessage from "../../modules/message";
import { setLoading, setSelectedSchool } from '../../utils/redux/action';
import { Dropdown } from 'semantic-ui-react';

// const MENU_NAME = 'Schools';
const Schools = () => {
    const dispatch = useDispatch();
    const { t } = useTranslation();

    const {
        behaviourStatus: { behaviourHtmlData },
        attrMobile,
        attrMenuAnimate,
    } = useSelector((state) => state.menu);

    const { color } = useSelector((state) => state.settings);
    const { isStudent = false, isOrganizationUser = false} = useSelector(state => state.person)
    const { schools, selectedSchool } = useSelector((state) => state.schoolData);
    const [searchValue, setSearchValue] = useState('');

    useEffect(() => {
        dispatch(layoutShowingNavMenu(''));
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
                <div ref={ref} style={style} className={classNames('dropdown-menu wide user-menu', className)} aria-labelledby={labeledBy}>
                    {/* search */}
                    {
                        schools && schools.length > 5 &&
                        <input type='text' value={searchValue} autoFocus className='school-search-input mb-1' placeholder={t('action.search')} onInput={(e) => onSearch(e.target.value)} />
                    }
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

    return (
        <div style={{ transform: 'translate(0px, 0px)', textAlign: 'center', zIndex: 1000 }}>
            {/* <div
                className='m-dropdown m-dropdown--inline m-dropdown--arrow m-dropdown--align-left m-dropdown--align-push'
                aria-expanded='true' style={{ marginLeft: '20px', width: '180px' }}>
                    <Dropdown
                        fluid
                        search
                        selection
                        closeOnChange
                        selectOnBlur={false}
                        options={schoolOptions}
                        className='header-select'
                        value={selectedSchool?.value}
                        onChange={(e, data) => onSchoolChange(data?.value)}
                        placeholder={t(lang)?.err?.select_school}
                    />
            </div> */}
            <div
                className={window.innerWidth < 768 ? 'school-nav-phone mt-5' : 'mt-5'}
                style={{ maxHeight: 300, transform: 'translate(209px, 54px) !important' }}
            >
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
                    {/* <ul className="list-unstyled border-last-none">
                        {schools && schools.map((schoolObj) => (
                            searchValue && searchValue.length > 0
                                ?
                                schoolObj.name.toLowerCase().includes(searchValue.toLowerCase()) &&
                                renderData(schoolObj)
                                :
                                renderData(schoolObj)
                        ))}
                    </ul> */}
                </OverlayScrollbarsComponent>
            </div>
        </div>
    )
};
export default React.memo(Schools);
