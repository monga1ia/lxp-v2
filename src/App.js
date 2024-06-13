import React, { useEffect, useMemo, useState } from "react";

// import redux for auth guard
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

// import routing modules
import RouteIdentifier from "routing/components/RouteIdentifier";
import { getRoutes } from "routing/helper";
import routesAndMenuItems from "routes.js";
import Loading from "components/loading/Loading";
import Layout from "layout/Layout";


const App = () => {
    const { currentUser, isLogin } = useSelector((state) => state.auth);
    const { selectedSchool } = useSelector(state => state.schoolData);
    const { isStudent, isEstudentUser, isOrganizationUser } = useSelector(state => state.person)
    const [isMenuVisible, showSideMenu] = useState(true);
    const [selectedMenus, setSelectedMenus] = useState([]);

    const routes = useMemo(() => getRoutes({
        data: routesAndMenuItems,
        isLogin,
        isOrganizationUser,
        userRole: currentUser?.role,
        selectedSchool,
        isStudent,
        isEstudentUser
    }), [isLogin, currentUser, isStudent]);

    const location = useLocation();

    useEffect(() => {
        let menus = routesAndMenuItems.mainMenuItems
        if (isOrganizationUser) {
            menus = routesAndMenuItems.organizationUserMenuItems
        } else {
            if (isStudent) {
                if(isEstudentUser){
                    menus = routesAndMenuItems.publicStudentMenuItems
                } else {
                    menus = routesAndMenuItems.studentMenuItems
                }
            }            
        }
        if(selectedSchool && selectedSchool.inOrganization){
            if(menus && menus.length > 0){
                for(let i = 0; i < menus.length; i++){
                    if(menus[i].path == '/online-exam'){
                        if(menus[i].subs && menus[i].subs.length > 0){
                            let subs = menus[i].subs;

                            let removeIndex = undefined;
                            for(let s = 0; s < subs.length; s++){
                                if(subs[s].path == '/questions'){
                                    removeIndex = s;
                                    break;
                                }
                            }
                            if (removeIndex !== undefined) {
                                subs.splice(removeIndex, 1);
                            }

                            menus[i].subs = subs;
                        }
                    }
                }
            }
        } else if(selectedSchool && !selectedSchool.inOrganization && !isOrganizationUser){
            if(menus && menus.length > 0){
                for(let i = 0; i < menus.length; i++){
                    if(menus[i].path == '/admin-question'){
                        menus.splice(i, 1);
                    }
                }
            }
        }

        let currentScreen = menus.find(
            (obj) => obj.path === location.pathname
        );

        if (!currentScreen || currentScreen == undefined) {
            for (let i = 0; i < menus.length; i++) {
                if (menus[i].subs && menus[i].subs.length > 0) {
                    for (let s = 0; s < menus[i].subs.length; s++) {
                        if (menus[i].path + menus[i].subs[s].path == location.pathname) {
                            currentScreen = menus[i].subs[s]
                        }
                    }
                }
            }
        }
        setSelectedMenus(menus)
        if (currentScreen && currentScreen.menuHidden){
            showSideMenu(false)
        } else {
            showSideMenu(true);
        }
    }, [location]);

    if (routes) {
        let filteredRoutes = []

        // routes user menu-geer filter hiine
        if(routes && routes.length > 0 && isOrganizationUser){
            if(selectedMenus && selectedMenus.length > 0){
                for(let i = 0; i < routes.length; i++){
                    for(let c = 0; c < selectedMenus.length; c++){
                        if(selectedMenus[c].path == routes[i].path && routes[i].path == '/'){
                            filteredRoutes.push(selectedMenus[c]);
                        } else if(selectedMenus[c].path == routes[i].path){
                            filteredRoutes.push(routes[i]);
                        }

                        // if(routes[i].path == '/groups/index' || routes[i].path == '/groups'){
                        //     routes[i].to = '/dashboard/exam'
                        //     filteredRoutes.push(routes[i]);
                        // }

                        if(selectedMenus[c].subs && selectedMenus[c].subs.length > 0){
                            for(let s = 0; s < selectedMenus[c].subs.length; s++){
                                if(selectedMenus[c].path + selectedMenus[c].subs[s].path == routes[i].path){
                                    filteredRoutes.push(routes[i]);
                                }
                            }
                        }
                    }
                }
            } else {
                filteredRoutes = routes    
            }
        } else {
            filteredRoutes = routes
        }

        return (
            <Layout isMenuVisible={isMenuVisible}>
                <RouteIdentifier routes={filteredRoutes} fallback={<Loading />} />
            </Layout>
        )
    }
    return <></>;
};

export default App;
