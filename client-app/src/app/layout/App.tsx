import React, { useEffect, useState } from "react";
import { Container } from "semantic-ui-react";
import { Activity } from "../models/activity";
import NavBar from "./NavBar";
import ActivityDashboard from "../../features/activities/dashboard/ActivityDashboard";
import { v4 as uuid } from "uuid"; // This is a package that generates unique ids
import agent from "../api/agent";
import LoadingComponent from "./LoadingComponent";

function App() {
    // useState is a hook that allows you to have state variables in functional components
    const [activities, setActivities] = useState<Activity[]>([]); // The empty array is the initial state
    const [selectedActivity, setSelectedActivity] = useState<Activity | undefined>(undefined); // The undefined is the initial state
    const [editMode, setEditMode] = useState(false);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    // UseEffect is a hook that runs after the first render and after every update
    useEffect(() => {
        agent.Activities.list().then((response) => {
            // Set the date to only show the date part
            let activities: Activity[] = [];
            response.forEach((activity) => {
                activity.date = activity.date.split("T")[0]; // Split the date and take the first part (the date)
                activities.push(activity);
            });

            setActivities(response);
            setLoading(false);
        });
    }, []); // The empty array ensures that this effect runs only once, else it will run multiple times

    // Function to handle the selected activity and set it to the selectedActivity state variable
    function handleSelectActivity(id: string) {
        setSelectedActivity(activities.find((x) => x.id === id));
    }

    // Function to handle the cancel selected activity and set the selectedActivity state variable to undefined
    function handleCancelSelectActivity() {
        setSelectedActivity(undefined);
    }

    // Function to handle the form open
    function handleFormOpen(id?: string) {
        id ? handleSelectActivity(id) : handleCancelSelectActivity(); // If id is passed, call handleSelectActivity, else call handleCancelSelectActivity
        setEditMode(true);
    }

    // Function to handle the form close
    function handleFormClose() {
        setEditMode(false);
    }

    // Function to handle the create or edit activity
    function handleCreateOrEditActivity(activity: Activity) {
        setSubmitting(true);
        if (activity.id) {
            agent.Activities.update(activity).then(() => {
                setActivities([...activities.filter((x) => x.id !== activity.id), activity]); // Filter out the activity with the specified id and add the updated activity
                setSelectedActivity(activity);
                setEditMode(false);
                setSubmitting(false);
            });
        } else {
            activity.id = uuid(); // Generate a unique id for the activity
            agent.Activities.create(activity).then(() => {
                setActivities([...activities, activity]); // Add the new activity to the activities array
                setSelectedActivity(activity);
                setEditMode(false);
                setSubmitting(false);
            });
        }
    }

    // Function to handle the deleted activity
    function handleDeletedActivity(id: string) {
        setSubmitting(true);
        agent.Activities.delete(id).then(() => {
            setActivities([...activities.filter((x) => x.id !== id)]); // Filter out the activity with the specified id (fake delete)
            setSubmitting(false);
        });
    }

    if (loading) return <LoadingComponent content="Loading activities..." />;

    return (
        <>
            <NavBar openForm={handleFormOpen} />
            <Container style={{ marginTop: "7em" }}>
                <ActivityDashboard
                    activities={activities}
                    selectedActivity={selectedActivity}
                    selectActivity={handleSelectActivity}
                    cancelSelectActivity={handleCancelSelectActivity}
                    editMode={editMode}
                    openForm={handleFormOpen}
                    closeForm={handleFormClose}
                    createOrEdit={handleCreateOrEditActivity}
                    deleteActivity={handleDeletedActivity}
                    submitting={submitting}
                />
            </Container>
        </>
    );
}

export default App;
