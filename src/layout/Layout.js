import React, { useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import useLayout from "hooks/useLayout";
import Nav from "layout/nav/Nav";
import SidebarMenu from "layout/nav/sidebar-menu/SidebarMenu";
import { useSelector } from "react-redux";

const Layout = ({ children, isMenuVisible }) => {
    useLayout();
    const { pathname } = useLocation();
    const { isStudent, isOrganizationUser } = useSelector(state => state.person)
    useEffect(() => {
        document.documentElement.click();
        window.scrollTo(0, 0);
        // eslint-disable-next-line
    }, [pathname]);

    return (
        <>
            {
                isMenuVisible
                    ?
                    <>
                        <Nav />
                        <main id='main-student-id' className={isOrganizationUser ? "" : (isStudent ? (pathname == '/podcast/view' ? "main-student-padding-2-5rem" : "main-student")  : "")}>
                            {
                                !isOrganizationUser && isStudent &&
                                <div className="student-dummy-white"></div>
                            }
                            <Container className={isOrganizationUser ? "" : (isStudent ? "pr-0 pl-0 student-container" : "")}>
                                <div className="h-100">
                                    <SidebarMenu />
                                    <Col className="h-100" id="contentArea">
                                        {children}
                                    </Col>
                                </div>
                            </Container>
                        </main>
                    </>
                    :
                    <>
                        <div className="h-100 w-100">
                            <SidebarMenu />
                            <Col className="h-100" id="contentArea">
                                {children}
                            </Col>
                        </div>
                    </>
            }
        </>
    );
};

export default React.memo(Layout);
