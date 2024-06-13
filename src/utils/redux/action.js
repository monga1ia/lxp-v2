export const setAuth = (params) => {
    return {
        type: 'SET_AUTHENTICATION',
        payload: params,
    }
};
export const setPersonInfo = (params) => {
    return {
        type: 'SET_PERSON_INFO',
        payload: params,
    }
};
export const setLocale = (params) => {
    return {
        type: 'SET_LOCALE',
        payload: params,
    }
};
export const setInitData = (params) => {
    return {
        type: 'SET_SCHOOL_LIST',
        payload: params,
    }
};
export const setSchools = (params) => {
    return {
        type: 'SET_SCHOOLS',
        payload: params
    }
};
export const setSelectedSchool = (params) => {
    return {
        type: 'SET_SELECTED_SCHOOL',
        payload: params,
    }
};

export const setLoading = (loading = false) => {
    return {
        type: 'LOADING',
        payload: loading
    }
};

export const setLanguages = payload => ({
    type: 'SET_LANGUAGES',
    payload,
});

export const setUserMenus = payload => ({
    type: 'SET_USER_MENUS',
    payload,
});

export const setMenuPositions = payload => ({
    type: 'SET_MENUS_POSITIONS',
    payload,
});


