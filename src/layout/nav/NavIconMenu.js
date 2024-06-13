import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
import { MENU_BEHAVIOUR } from 'constants.js';
import CsLineIcons from 'cs-line-icons/CsLineIcons';
import IconMenuNotifications from './notifications/Notifications';
import SearchModal from './search/SearchModal';
import { menuChangeBehaviour, menuResetBreakpoints } from './main-menu/menuSlice';

const NavIconMenu = () => {
    const { eToken } = useSelector((state) => state.auth);
    const { pinButtonEnable, behaviour } = useSelector((state) => state.menu);
    const { isStudent, isOrganizationUser } = useSelector(state => state.person)
    const dispatch = useDispatch();

    useEffect(() => {
        if (isOrganizationUser) {
            dispatch(menuResetBreakpoints())
        } else {
            if (isStudent) {
                dispatch(menuChangeBehaviour(MENU_BEHAVIOUR.Pinned));
            } else {
                dispatch(menuResetBreakpoints())
            }
        }        
    }, []);

    const onPinButtonClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (pinButtonEnable) {
            dispatch(menuChangeBehaviour(behaviour === MENU_BEHAVIOUR.Pinned ? MENU_BEHAVIOUR.Unpinned : MENU_BEHAVIOUR.Pinned));
        }
        return false;
    };
    const onDisabledPinButtonClick = (e) => {
        dispatch(menuChangeBehaviour(behaviour === MENU_BEHAVIOUR.Pinned ? MENU_BEHAVIOUR.Unpinned : MENU_BEHAVIOUR.Pinned));
        e.preventDefault();
        e.stopPropagation();
    };

    const [showSearchModal, setShowSearchModal] = useState(false);

    return (
        <>
            {
                (isOrganizationUser || !isStudent) &&
                <ul className="list-unstyled list-inline text-center menu-icons">
                    <li className="list-inline-item">
                            <a href={"https://helpcenter.eschool.mn/sys-auth?p=LMS&t=" + eToken} target='_blank' title='Help center'>
                                <img src='/img/icon/ic_helpcenterGray.png' style={{
                                    width: 18
                                }}/>
                            </a>
                        </li>
                    <li className="list-inline-item">
                        <a
                            href="#/"
                            id="pinButton"
                            onClick={pinButtonEnable ? onPinButtonClick : onDisabledPinButtonClick}
                            className={classNames('pin-button', { disabled: !pinButtonEnable })}
                        >
                            <CsLineIcons icon="lock-on" size="18" className="unpin" />
                            <CsLineIcons icon="lock-off" size="18" className="pin" />
                        </a>
                    </li>
                    {/* <li className="list-inline-item">
                            <a href="#/" id="colorButton" onClick={onLightDarkModeClick}>
                                <CsLineIcons icon="light-on" size="18" className="light" />
                                <CsLineIcons icon="light-off" size="18" className="dark" />
                            </a>
                    </li> */}
                    <IconMenuNotifications />
                </ul>
            }

            <SearchModal show={showSearchModal} setShow={setShowSearchModal} />
        </>
    );
};

export default React.memo(NavIconMenu);
