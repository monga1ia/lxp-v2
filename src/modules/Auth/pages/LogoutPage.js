import React from "react";
import { useDispatch } from "react-redux";
import { Redirect } from "react-router-dom";
import { setAuth, setInitData, setPersonInfo, setSchools, setSelectedSchool, setUserMenus } from "../../../utils/redux/action";
// import {} from '@azure/msal-browser';

export function LogoutPage() {
    const dispatch = useDispatch();
    dispatch(setAuth(null));
    dispatch(setUserMenus([]));
    dispatch(setPersonInfo([]));
    dispatch(setInitData([]));
    dispatch(setSchools([]));
    dispatch(setSelectedSchool(null));
    localStorage.removeItem('menu_list_index');

    return (
        <>
            <Redirect to="/auth/login" />
        </>
    );
}
