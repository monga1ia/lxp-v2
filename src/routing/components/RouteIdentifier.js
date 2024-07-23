import React, { Suspense, memo } from "react";
import { Redirect, Switch, Route } from "react-router-dom";
import { DEFAULT_PATHS } from "config.js";
import { useSelector } from "react-redux";
import RouteItem from "./RouteItem";
import Login from "../../views/default/Login";
import { LogoutPage } from '../../modules/Auth';
import Player from '../../modules/Player';
import AdminPlayer from '../../modules/AdminPlayer';
import Loader from "../../modules/loader";

const RouteIdentifier = ({
    routes,
    fallback = <div className="loading" />,
    notFoundPath = DEFAULT_PATHS.NOTFOUND
}) => {
    const { authToken } = useSelector((state) => state.auth);
    const { selectedSchool } = useSelector(state => state.schoolData);
    const { isOrganizationUser } = useSelector(state => state.person)
    const loading = useSelector(state => {
        return state.loading
    });

    return (
        <Suspense fallback={fallback}>
            {
                loading && (<Loader />)
            }
            <Switch>
                <Route path="/player/:id" component={Player} />
                <Route path="/adminPlayer/:id" component={AdminPlayer} />
                {
                    !authToken && (
                        <Route>
                            <Login />
                        </Route>
                    )
                }

                {
                    <Route path="/logout" component={LogoutPage} />
                }
                    {routes.map((route, rIndex) => {
                        if(selectedSchool && selectedSchool.inOrganization && route.path == '/online-exam/questions'){

                        } else {
                            if(isOrganizationUser && route.path == '/'){
                                route.to = '/dashboard/exam'
                                return (
                                    <RouteItem key={`r.${rIndex}`} {...route} />
                                )
                            } else if(selectedSchool && !selectedSchool.inOrganization && !isOrganizationUser && (route.path == '/admin-question' || route.path == '/admin-question/index')) {

                            } else {
                                return (
                                    <RouteItem key={`r.${rIndex}`} {...route} />
                                )
                            }
                            
                        }
                    })}
                <Redirect to={notFoundPath} />
            </Switch>
        </Suspense>
    );
};

export default memo(RouteIdentifier);
