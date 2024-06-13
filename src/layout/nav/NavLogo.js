import React from "react";
import { Link } from "react-router-dom";
import { DEFAULT_PATHS } from "config.js";
import { useSelector } from "react-redux";

const NavLogo = () => {
    const { isStudent, isOrganizationUser } = useSelector(state => state.person)


    return (
        <div className="mobile-buttons-container logo position-relative">
            {
                !isOrganizationUser && isStudent
                    ?
                    <Link to={DEFAULT_PATHS.APP}>
                        <img className="ml-6" src='/img/logo/eschool-logo-blue-student.png' alt="student-logo" width='150px' height='36px' />
                    </Link>
                    :
                    <Link to={DEFAULT_PATHS.APP}>
                        <img src='/img/logo/eschool-logo-black-wordless.png' alt="student-logo" width='150px' height='36px' />
                    </Link>
            }
        </div>
    );
};
export default React.memo(NavLogo);