import React, { useEffect } from "react";
import { Grid } from "semantic-ui-react";
import ActivityList from "./ActivityList";
import { useStore } from "../../../app/stores/store";
import { observer } from "mobx-react-lite";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import ActivityFilters from "./ActivityFilters";

// eslint-disable-next-line react-refresh/only-export-components
export default observer(function ActivityDashboard() {
    // Hook that allows you to access the store
    const { activityStore } = useStore();
    const { loadActivities, activityRegistry } = activityStore;

    // UseEffect is a hook that runs after the first render and after every update
    useEffect(() => {
        if (activityRegistry.size <= 1) loadActivities();
    }, [activityRegistry.size, loadActivities]);

    if (activityStore.loadingInitial) return <LoadingComponent content="Loading app..." />;

    return (
        <Grid>
            <Grid.Column width="10">
                <ActivityList />
            </Grid.Column>
            <Grid.Column width="6">
                <ActivityFilters />
            </Grid.Column>
        </Grid>
    );
});
