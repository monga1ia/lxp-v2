import React from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { MENU_BEHAVIOUR } from 'constants.js';
import NotificationsIcon from '@mui/icons-material/Notifications';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
// import { settingsChangeColor } from 'settings/settingsSlice';
import NavLanguageSwitcher from "./NavLanguageSwitcher";
// import { menuChangeBehaviour } from './main-menu/menuSlice';

const languageStyle = {
    fontSize: 14,
    position: 'relative',
    top: 3,
    border: '1px solid rgba(255, 255, 255, 0.2)',
    background: '#4f499a'
}

const StudentIconMenu = () => {
    // const { pinButtonEnable, behaviour } = useSelector((state) => state.menu);
    // const { color } = useSelector((state) => state.settings)
    // const dispatch = useDispatch();

    // const onPinButtonClick = (e) => {
    //     e.preventDefault();
    //     e.stopPropagation();
    //     if (pinButtonEnable) {
    //         dispatch(menuChangeBehaviour(behaviour === MENU_BEHAVIOUR.Pinned ? MENU_BEHAVIOUR.Unpinned : MENU_BEHAVIOUR.Pinned));
    //     }
    //     return false;
    // };
    // const onDisabledPinButtonClick = (e) => {
    //     e.preventDefault();
    //     e.stopPropagation();
    // };

    // const onLightDarkModeClick = (e) => {
    //     e.preventDefault();
    //     e.stopPropagation();
    //     dispatch(settingsChangeColor(color.includes('light') ? color.replace('light', 'dark') : color.replace('dark', 'light')));
    // };
    // const [showSearchModal, setShowSearchModal] = useState(false);

    const onSearchIconClick = (e) => {
        e.preventDefault();
        // setShowSearchModal(true);
    };

    return (
        <div className='mobile-buttons-container menu-student-icon'>
            <div className='d-flex justify-content-between' style={{ paddingLeft: 10, paddingRight: 10 }}>
                {/* <div className="">
                    <button type='button' className='btn' onClick={onSearchIconClick}>
                        <NotificationsIcon style={{ fontSize: 24 }} />
                    </button>
                </div>
                <div className="">
                    <button type='button' className='btn' onClick={onSearchIconClick}>
                        <SettingsOutlinedIcon style={{ fontSize: 24 }} />
                    </button>
                </div>
                <div className="">
                    <button type='button' className='btn' onClick={onSearchIconClick}>
                        <HelpOutlineOutlinedIcon style={{ fontSize: 24 }} />
                    </button>
                </div> */}
                <div className="">
                    <NavLanguageSwitcher
                        toggleStyleObj={languageStyle}
                    />
                </div>
            </div>
        </div>
    );
};

export default React.memo(StudentIconMenu);
