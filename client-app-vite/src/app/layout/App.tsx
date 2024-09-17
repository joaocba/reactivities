import React, { useEffect } from "react";
import { Container } from "semantic-ui-react";
import NavBar from "./NavBar";
import ActivityDashboard from "../../features/activities/dashboard/ActivityDashboard";
import LoadingComponent from "./LoadingComponent";
import { useStore } from "../stores/store";
import { observer } from "mobx-react-lite";

function App() {
    // Hook that allows you to access the store
    const { activityStore } = useStore();

    // UseEffect is a hook that runs after the first render and after every update
    useEffect(() => {
        // Call the loadActivities method from the activityStore
        activityStore.loadActivities();
    }, [activityStore]); // The empty array ensures that this effect runs only once, else it will run multiple times

    if (activityStore.loadingInitial) return <LoadingComponent content="Loading activities..." />;

    return (
        <>
            <NavBar />
            <Container style={{ marginTop: "7em" }}>
                <ActivityDashboard />
            </Container>
        </>
    );
}

export default observer(App);
