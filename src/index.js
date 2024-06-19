// cra imports
import React, { useMemo } from "react";
import ReactDOM from "react-dom";

// import redux requirements
import { Provider } from "react-redux";
import { PersistGate } from "reduxjs-toolkit-persist/integration/react";
import { store, persistedStore } from "store.js";

// import html head tags requirements
import { Helmet } from "react-helmet";
import { REACT_HELMET_PROPS } from "config.js";
import { DndProvider } from "react-dnd";
import { isMobile, isAndroid, isIOS, isSafari } from 'react-device-detect';
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from 'react-dnd-touch-backend'

// import multi language
import LangProvider from "lang/LangProvider";
import "./i18n";

// import routing modules
import { BrowserRouter as Router } from "react-router-dom";
import RouteIdentifier from "routing/components/RouteIdentifier";
import Loading from "components/loading/Loading";

// import routes
import { getLayoutlessRoutes } from "routing/helper";
import defaultRoutes from "routing/default-routes";

// import toastify for notification
import { Slide, ToastContainer } from "react-toastify";

// Datepicker
import "react-datepicker/dist/react-datepicker.css";
import "./utils/flaticon/flaticon.css"
import "./utils/flaticon2/flaticon.css"
import "./utils/ki/font/ki.css"
import "./utils/tree/_rc-tree.css";
import "./utils/pinnacle/_pinnacle.css";
import "./utils/mulish/_mulish.css";
import "./utils/splash-screen.css";
import "./utils/media.css";
import 'line-awesome/dist/line-awesome/css/line-awesome.min.css';
import 'react-toastify/dist/ReactToastify.css';

import { useSelector } from "react-redux";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAuFwxbUfSFsdb_fugA2AQbqWwjZOhM7Us",
    authDomain: "lmseschool.firebaseapp.com",
    projectId: "lmseschool",
    storageBucket: "lmseschool.appspot.com",
    messagingSenderId: "45794209574",
    appId: "1:45794209574:web:3c6bf6605c712397561be7",
    measurementId: "G-MG03ZMS40M"
};

// mock server register for demo
// import "@mock-api";
import routesAndMenuItems from "routes";

const Main = () => {
    
    const layoutlessRoutes = useMemo(
        () => getLayoutlessRoutes({
            data: routesAndMenuItems
        }),
        []
    );

    const app = initializeApp(firebaseConfig);
    const analytics = getAnalytics(app);
    let dndBackEnd = HTML5Backend;

    if (isMobile) {
        if (isIOS) {
            dndBackEnd = HTML5Backend;
        } else {
            if (isSafari) {
                dndBackEnd = HTML5Backend;
            } else if (isAndroid) {
                dndBackEnd = TouchBackend;
            }
        }
    }

    return (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistedStore}>
                <DndProvider backend={dndBackEnd}>
                    <Helmet {...REACT_HELMET_PROPS} />
                    <ToastContainer transition={Slide} newestOnTop />
                    <Router basename={process.env.REACT_APP_BASENAME}>

                        <LangProvider>
                            <RouteIdentifier
                                routes={[...layoutlessRoutes, ...defaultRoutes]}
                                fallback={<Loading />}
                            />
                        </LangProvider>
                    </Router>
                </DndProvider>
            </PersistGate>
        </Provider>
    );
};

ReactDOM.render(<Main />, document.getElementById("root"));
