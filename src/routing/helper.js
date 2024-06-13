import { IS_AUTH_GUARD_ACTIVE, DEFAULT_PATHS } from "config.js";

const userHasRole = (routeRoles, userRole) => {
    if (!userRole) return false;
    return routeRoles.includes(userRole);
};

const clearRoute = (route) => {
    const item = {};
    ["path", "to", "exact", "component", "redirect"].forEach((key) => {
        if (route[key]) item[key] = route[key];
    });
    return item;
};
const clearMenuItem = (menuItem) => {
    const item = {};
    ["path", "label", "icon", "isExternal", "subs", "mega", "megaParent"].forEach(
        (key) => {
            if (menuItem[key]) item[key] = menuItem[key];
        }
    );
    return item;
};
const clearFlattedMenuItem = (menuItem) => {
    const item = {};
    ["path", "label", "isExternal"].forEach((key) => {
        if (menuItem[key]) item[key] = menuItem[key];
    });
    return item;
};

export const convertToRoutes = ({
    data = [],
    isOrganizationUser = false,
    isLogin = false,
    userRole = null,
    authGuardActive = IS_AUTH_GUARD_ACTIVE,
    unauthorizedPath = DEFAULT_PATHS.UNAUTHORIZED,
    loginPath = DEFAULT_PATHS.LOGIN,
    invalidAccessPath = DEFAULT_PATHS.INVALID_ACCESS,
    noLayout = false,
    isStudent = false,
    isEstudentUser = false
}) => {
    let items = [];
    if (isOrganizationUser) {
        items = [...data.sidebarItems, ...data.organizationUserMenuItems]
    } else {
        if(isStudent) {
            if(isEstudentUser){
                items = [...(data.sidebarItems || []), ...data.publicStudentMenuItems];
            } else {
                items = [...(data.sidebarItems || []), ...data.studentMenuItems];
            }
        } else {
            items = [...(data.sidebarItems || []), ...data.mainMenuItems];
        }
    }
    const routes = [];
    return () => {
        const itemMapper = (item) => {
            const tempItem = { ...item };
            if (item.hideInRoute) return itemMapper({});

            if (item.subs) tempItem.exact = true;

            /* Authentication Guard */
            if (authGuardActive) {
                if (tempItem.roles) tempItem.protected = true;
                if (tempItem.publicOnly) {
                    delete tempItem.roles;
                    delete tempItem.protected;
                }
                if (tempItem.protected) {
                    if (!isLogin) {
                        tempItem.redirect = true;
                        tempItem.to = {
                            pathname: loginPath,
                            state: { from: tempItem.path },
                        };
                    } else if (tempItem.roles) {
                        if (!userHasRole(tempItem.roles, userRole)) {
                            tempItem.redirect = true;
                            tempItem.to = {
                                pathname: unauthorizedPath,
                                state: { from: tempItem.path },
                            };
                        }
                    }
                } else if (tempItem.publicOnly && isLogin) {
                    tempItem.redirect = true;
                    tempItem.to = {
                        pathname: invalidAccessPath,
                        state: { from: tempItem.path },
                    };
                }
            }

            if (Object.keys(tempItem).length > 0 && !item.isExternal) {
                if (item.noLayout && noLayout) {
                    routes.push(clearRoute({ ...tempItem, exact: true }));
                }
                if (!noLayout && item.noLayout !== true) {
                    routes.push(clearRoute(tempItem));
                }
            }

            if (item.subs) {
                return item.subs.map((sub) => {
                    const controlledSub = { ...sub, path: tempItem.path + sub.path };
                    if (authGuardActive) {
                        if (tempItem.protected) controlledSub.protected = true;
                        if (tempItem.roles) {
                            if (!sub.roles) controlledSub.roles = tempItem.roles;
                            else {
                                // common roles..
                                controlledSub.roles = tempItem.roles.filter((x) =>
                                    sub.roles.includes(x)
                                );

                                if (controlledSub.roles && controlledSub.roles.length === 0) {
                                    controlledSub.inaccessible = true;
                                }
                            }
                        } else if (tempItem.publicOnly) {
                            controlledSub.publicOnly = true;
                        }
                        if (controlledSub.roles && controlledSub.roles.length === 0)
                            delete controlledSub.roles;

                        if (!controlledSub.inaccessible) return itemMapper(controlledSub);
                        return itemMapper({});
                    }
                    return itemMapper(controlledSub);
                });
            }
            return tempItem;
        };
        items.map(itemMapper);
        return routes;
    };
};

export const convertToMenuItems = ({
    data = [],
    authGuardActive = IS_AUTH_GUARD_ACTIVE,
    isOrganizationUser = false,
    isLogin = false,
    userRole = null,
    isStudent = false,
    isEstudentUser = false
}) => {
    let items = [];
    if (isOrganizationUser) {
        items = [...data.sidebarItems, ...data.organizationUserMenuItems]
    } else {
        if(isStudent) {
            if(isEstudentUser){
                items = [...(data.sidebarItems || []), ...data.publicStudentMenuItems];
            } else {
                items = [...(data.sidebarItems || []), ...data.studentMenuItems];
            }
        } else {
            items = [...(data.sidebarItems || []), ...data.mainMenuItems];
        }
    }
    const itemMapper = (item) => {
        const tempItem = { ...item };

        if (authGuardActive) {
            /* Authentication Guard */
            if (tempItem.roles) tempItem.protected = true;

            if (tempItem.publicOnly) {
                delete tempItem.roles;
                delete tempItem.protected;
            }

            if (tempItem.protected) {
                if (!isLogin) {
                    return {};
                }
                if (tempItem.roles) {
                    if (!userHasRole(tempItem.roles, userRole)) {
                        return {};
                    }
                }
            } else if (tempItem.publicOnly && isLogin) {
                return {};
            }
        }

        if (tempItem.subs) {
            tempItem.subs = item.subs
                .map((sub) => {
                    const controlledSub = { ...sub, path: tempItem.path + sub.path };
                    if (tempItem.mega || tempItem.megaParent)
                        controlledSub.megaParent = true;

                    if (authGuardActive) {
                        if (tempItem.protected) controlledSub.protected = true;

                        if (tempItem.roles) {
                            if (!sub.roles) controlledSub.roles = tempItem.roles;
                            else {
                                // common roles..
                                controlledSub.roles = tempItem.roles.filter((x) =>
                                    sub.roles.includes(x)
                                );

                                if (controlledSub.roles && controlledSub.roles.length === 0) {
                                    controlledSub.inaccessible = true;
                                }
                            }
                        } else if (tempItem.publicOnly) {
                            controlledSub.publicOnly = true;
                        }
                        if (controlledSub.roles && controlledSub.roles.length === 0)
                            delete controlledSub.roles;

                        if (!controlledSub.inaccessible) return itemMapper(controlledSub);
                        return itemMapper({});
                    }
                    return itemMapper(controlledSub);
                })
                .filter((x) => Object.keys(x).length > 0);

            if (tempItem.subs.length === 0) delete tempItem.subs;
        }
        if (tempItem.label && !item.hideInMenu) return clearMenuItem(tempItem);
        return {};
    };
    return items.map(itemMapper).filter((x) => Object.keys(x).length > 0);
};

export const convertToSearchItems = ({
    data = [],
    authGuardActive = IS_AUTH_GUARD_ACTIVE,
    isOrganizationUser = false,
    isLogin = false,
    userRole = null,
    isStudent = false,
    isEstudentUser = false
}) => {
    let items = [];
    if (isOrganizationUser) {
        items = [...data.sidebarItems, ...data.organizationUserMenuItems]
    } else {
        if(isStudent) {
            if(isEstudentUser){
                items = [...(data.sidebarItems || []), ...data.publicStudentMenuItems];
            } else {
                items = [...(data.sidebarItems || []), ...data.studentMenuItems];
            }
        } else {
            items = [...(data.sidebarItems || []), ...data.mainMenuItems];
        }
    }

    const menuItems = [];

    return () => {
        const itemMapper = (item) => {
            let tempItem = { ...item };
            if (tempItem.hideInMenu || tempItem.isExternal || tempItem.hideInRoute) {
                return {};
            }
            if (authGuardActive) {
                /* Authentication Guard */
                if (tempItem.roles) tempItem.protected = true;

                if (tempItem.publicOnly) {
                    delete tempItem.roles;
                    delete tempItem.protected;
                }

                if (tempItem.protected) {
                    if (!isLogin) {
                        tempItem = {};
                    } else if (tempItem.roles) {
                        if (!userHasRole(tempItem.roles, userRole)) {
                            tempItem = {};
                        }
                    }
                } else if (tempItem.publicOnly && isLogin) {
                    tempItem = {};
                }
            }

            if (Object.keys(tempItem).length > 0 && tempItem.label)
                menuItems.push(clearFlattedMenuItem(tempItem));

            if (item.subs) {
                return item.subs.map((sub) => {
                    const controlledSub = { ...sub, path: tempItem.path + sub.path };

                    if (authGuardActive) {
                        if (tempItem.protected) controlledSub.protected = true;

                        if (tempItem.roles) {
                            if (!sub.roles) controlledSub.roles = tempItem.roles;
                            else {
                                // common roles..
                                controlledSub.roles = tempItem.roles.filter((x) =>
                                    sub.roles.includes(x)
                                );

                                if (controlledSub.roles && controlledSub.roles.length === 0) {
                                    controlledSub.inaccessible = true;
                                }
                            }
                        } else if (tempItem.publicOnly) {
                            controlledSub.publicOnly = true;
                        }
                        if (controlledSub.roles && controlledSub.roles.length === 0)
                            delete controlledSub.roles;

                        if (!controlledSub.inaccessible) return itemMapper(controlledSub);
                        return itemMapper({});
                    }
                    return itemMapper(controlledSub);
                });
            }
            return tempItem;
        };
        items.map(itemMapper);
        return menuItems;
    };
};

export const getRoutes = ({ data, isLogin, isOrganizationUser, userRole, selectedSchool, isStudent, isEstudentUser }) =>
    convertToRoutes({
        data,
        isOrganizationUser,
        isLogin,
        userRole,
        authGuardActive: IS_AUTH_GUARD_ACTIVE,
        unauthorizedPath: DEFAULT_PATHS.UNAUTHORIZED,
        loginPath: DEFAULT_PATHS.LOGIN,
        invalidAccessPath: DEFAULT_PATHS.INVALID_ACCESS,
        noLayout: false,
        selectedSchool,
        isStudent,
        isEstudentUser
    })();

export const getLayoutlessRoutes = ({ data, isLogin, isOrganizationUser, userRole, selectedSchool, isStudent, isEstudentUser }) =>
    convertToRoutes({
        data,
        noLayout: true,
        isOrganizationUser,
        isLogin,
        userRole,
        authGuardActive: IS_AUTH_GUARD_ACTIVE,
        unauthorizedPath: DEFAULT_PATHS.UNAUTHORIZED,
        loginPath: DEFAULT_PATHS.LOGIN,
        invalidAccessPath: DEFAULT_PATHS.INVALID_ACCESS,
        selectedSchool,
        isStudent,
        isEstudentUser
    })();

export const getMenuItems = ({ data, isLogin, isOrganizationUser, userRole, isStudent, isEstudentUser }) =>
    convertToMenuItems({
        data,
        isOrganizationUser,
        isLogin,
        userRole,
        authGuardActive: IS_AUTH_GUARD_ACTIVE,
        isStudent,
        isEstudentUser
    });

export const getSearchItems = ({ data, isLogin, isOrganizationUser, userRole, isStudent, isEstudentUser }) =>
    convertToSearchItems({
        data,
        isOrganizationUser,
        isLogin,
        userRole,
        authGuardActive: IS_AUTH_GUARD_ACTIVE,
        isStudent,
        isEstudentUser
    });
