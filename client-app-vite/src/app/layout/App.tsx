import React from "react";
import { Container } from "semantic-ui-react";
import NavBar from "./NavBar";
import { observer } from "mobx-react-lite";
import { Outlet, useLocation } from "react-router-dom";
import HomePage from "../../features/home/Home";

// eslint-disable-next-line react-refresh/only-export-components
function App() {
    const location = useLocation();

    return (
        <>
            {/* Check location and it is "/" then render Home page component */}
            {location.pathname === "/" ? (
                <HomePage />
            ) : (
                <>
                    <NavBar />
                    <Container style={{ marginTop: "7em" }}>
                        {/* Outlet will automatically be swapped with the according URL and matching component has defined on the Routes.tsx */}
                        <Outlet />
                    </Container>
                </>
            )}
        </>
    );
}

// eslint-disable-next-line react-refresh/only-export-components
export default observer(App);
