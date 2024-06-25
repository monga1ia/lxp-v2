import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames';
import { Col, Dropdown, Row } from 'react-bootstrap';
import { useTranslation } from "react-i18next";
import { MENU_PLACEMENT } from 'constants.js';
import CsLineIcons from 'cs-line-icons/CsLineIcons';
import { layoutShowingNavMenu } from 'layout/layoutSlice';

const NavUserMenuContent = () => {
    const { t } = useTranslation();
    const onLogout = () => {

    }

    return (
        <div>
            {/* <Row className="mb-3 ms-0 me-0">
                <Col xs="12" className="ps-1 mb-2">
                    <div className="text-extra-small text-primary">ACCOUNT</div>
                </Col>
                <Col xs="6" className="ps-1 pe-1">
                    <ul className="list-unstyled">
                    <li>
                        <a href="#/!">User Info</a>
                    </li>
                    <li>
                        <a href="#/!">Preferences</a>
                    </li>
                    <li>
                        <a href="#/!">Calendar</a>
                    </li>
                    </ul>
                </Col>
                <Col xs="6" className="ps-1 pe-1">
                    <ul className="list-unstyled">
                    <li>
                        <a href="#/!">Security</a>
                    </li>
                    <li>
                        <a href="#/!">Billing</a>
                    </li>
                    </ul>
                </Col>
            </Row> */}
            {/* <Row className="mb-1 ms-0 me-0">
            <Col xs="12" className="p-1 mb-2 pt-2">
                <div className="text-extra-small text-primary">APPLICATION</div>
            </Col>
            <Col xs="6" className="ps-1 pe-1">
                <ul className="list-unstyled">
                <li>
                    <a href="#/!">Themes</a>
                </li>
                <li>
                    <a href="#/!">Language</a>
                </li>
                </ul>
            </Col>
            <Col xs="6" className="pe-1 ps-1">
                <ul className="list-unstyled">
                <li>
                    <a href="#/!">Devices</a>
                </li>
                <li>
                    <a href="#/!">Storage</a>
                </li>
                </ul>
            </Col>
            </Row> */}
            <Row className="mb-1 ms-0 me-0">
                {/* <Col xs="12" className="p-1 mb-3 pt-3">
                    <div className="separator-light" />
                </Col> */}
                {/* <Col xs="6" className="ps-1 pe-1">
                    <ul className="list-unstyled">
                    <li>
                        <a href="#/!">
                        <CsLineIcons icon="help" className="me-2" size="17" /> <span className="align-middle">Help</span>
                        </a>
                    </li>
                    <li>
                        <a href="#/!">
                        <CsLineIcons icon="file-text" className="me-2" size="17" /> <span className="align-middle">Docs</span>
                        </a>
                    </li>
                    </ul>
                </Col> */}
                <Col xs="6" className="pe-1 ps-1" style={{ width: '100%' }}>
                    <ul className="list-unstyled">
                        <li>
                            <a href="/user/profile" className='d-inline-flex'>
                                <span className="cs-user me-2"></span> <span className="align-middle">{t('menu.profile')}</span>
                            </a>
                        </li>
                        <li>
                            <a href="/logout" className='d-inline-flex'>
                                <CsLineIcons icon="logout" className="me-2" size="17" /> <span className="align-middle" onClick={onLogout}>{t('system.quit')}</span>
                            </a>
                        </li>
                    </ul>
                </Col>
            </Row>
        </div >
    )
};

const NavUserMenuDropdownToggle = React.memo(
    React.forwardRef(({ onClick, expanded = false, user = {} }, ref) => (
        <a
            href="#/!"
            ref={ref}
            className="d-flex user position-relative"
            data-toggle="dropdown"
            aria-expanded={expanded}
            onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onClick(e);
            }}
        >
            <img
                className="profile"
                alt={user.name}
                src={user.avatar ? user.avatar : '/img/profile/avatar.png'}
                onError={(e) => {
                    e.target.onError = null,
                        e.target.src = '/img/profile/avatar.png'
                }}
            />
            <div className="name">{user.lastName + ' ' + user.firstName}</div>
        </a>
    ))
);

const NavUserMenuLanguageToggle = React.memo(
    React.forwardRef(({ onClick, expanded = false, user = {} }, ref) => (
        <a
            href="#/!"
            ref={ref}
            className="d-flex user position-relative"
            data-toggle="dropdown"
            aria-expanded={expanded}
            onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onClick(e);
            }}
        >
            <div>
                <span style={{fontFamily: "MulishBold"}}>{'Мон >'}</span>
            </div>
        </a>
    ))
);

// Dropdown needs access to the DOM of the Menu to measure it
const NavUserMenuDropdownMenu = React.memo(
    React.forwardRef(({ style, className }, ref) => {
        return (
            <div ref={ref} style={style} className={classNames('dropdown-menu dropdown-menu-end user-menu user-menu-wide', className)}>
                <NavUserMenuContent />
            </div>
        );
    })
);

NavUserMenuDropdownMenu.displayName = 'NavUserMenuDropdownMenu';

const MENU_NAME = 'NavUserMenu';

const NavUserMenu = () => {
    const dispatch = useDispatch();
    const {
        placementStatus: { view: placement },
        behaviourStatus: { behaviourHtmlData },
        attrMobile,
        attrMenuAnimate,
    } = useSelector((state) => state.menu);

    const { person } = useSelector(state => state)
    // const { auth } = useSelector((state) => state.auth);
    const { isLogin } = useSelector((state) => state.auth);
    const { color } = useSelector((state) => state.settings);
    const { showingNavMenu } = useSelector((state) => state.layout);

    const onToggle = (status, event) => {
        if (event && event.stopPropagation) event.stopPropagation();
        else if (event && event.originalEvent && event.originalEvent.stopPropagation) event.originalEvent.stopPropagation();
        dispatch(layoutShowingNavMenu(status ? MENU_NAME : ''));
    };

    useEffect(() => {
        dispatch(layoutShowingNavMenu(''));
        // eslint-disable-next-line
    }, [attrMenuAnimate, behaviourHtmlData, attrMobile, color]);

    if (!isLogin) {
        return <></>;
    }

    if (person && !person.isOrganizationUser && person.isStudent) {
        return <></>;
    }

    return (
        <>
            <Dropdown as="div" bsPrefix="user-container d-flex" onToggle={onToggle} show={showingNavMenu === MENU_NAME} drop="down">
                <Dropdown.Toggle as={NavUserMenuDropdownToggle} user={person} />
                <Dropdown.Menu
                    as={NavUserMenuDropdownMenu}
                    className="dropdown-menu dropdown-menu-end user-menu user-menu-wide"
                    popperConfig={{
                        modifiers: [
                            {
                                name: 'offset',
                                options: {
                                    offset: () => {
                                        if (placement === MENU_PLACEMENT.Horizontal) {
                                            return [0, 7];
                                        }
                                        if (window.innerWidth < 768) {
                                            return [-84, 7];
                                        }

                                        return [-78, 7];
                                    },
                                },
                            },
                        ],
                    }}
                />
            </Dropdown>

            <Dropdown as="div" bsPrefix="user-container d-flex" style={{height: '3rem', minHeight: '0'}} onToggle={console.log('language request')} drop="down">
                <Dropdown.Toggle as={NavUserMenuLanguageToggle} user={person} />
            </Dropdown>
        </>
    );
};
export default React.memo(NavUserMenu);
