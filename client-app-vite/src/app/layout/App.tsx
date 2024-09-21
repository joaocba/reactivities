import { Container } from "semantic-ui-react";
import NavBar from "./NavBar";
import { observer } from "mobx-react-lite";
import { Outlet, useLocation } from "react-router-dom";
import HomePage from "../../features/home/Home";
import { ToastContainer } from "react-toastify";
import { useStore } from "../stores/store";
import { useEffect } from "react";
import LoadingComponent from "./LoadingComponent";
import ModalContainer from "../common/modals/ModalContainer";

// eslint-disable-next-line react-refresh/only-export-components
function App() {
    const location = useLocation();
    const { commonStore, userStore } = useStore();

    // Check if the token is in the local storage and if it is then get the user
    useEffect(() => {
        if (commonStore.token) {
            userStore.getUser().finally(() => commonStore.setAppLoaded());
        } else {
            commonStore.setAppLoaded();
        }
    }, [commonStore, userStore]);

    if (!commonStore.appLoaded) return <LoadingComponent content="Loading app..." />;

    return (
        <>
            <ModalContainer />
            <ToastContainer
                position="bottom-right"
                hideProgressBar
                theme="colored"
            />
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
