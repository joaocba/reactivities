import React, { Fragment, useEffect, useState } from "react";
import axios from "axios";
import { Container } from "semantic-ui-react";
import { Activity } from "../models/activity";
import NavBar from "./NavBar";
import ActivityDashboard from "../../features/activities/dashboard/ActivityDashboard";
import { v4 as uuid } from "uuid"; // This is a package that generates unique ids

function App() {
    // useState is a hook that allows you to have state variables in functional components
    const [activities, setActivities] = useState<Activity[]>([]); // The empty array is the initial state
    const [selectedActivity, setSelectedActivity] = useState<Activity | undefined>(undefined); // The undefined is the initial state
    const [editMode, setEditMode] = useState(false);

    // UseEffect is a hook that runs after the first render and after every update
    useEffect(() => {
        axios.get<Activity[]>("http://localhost:5000/api/Activities").then((response) => {
            //console.log(response);
            setActivities(response.data);
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
        activity.id ? setActivities([...activities.filter((x) => x.id !== activity.id), activity]) : setActivities([...activities, { ...activity, id: uuid() }]); // If the activity has an id, update the existing activity, else add a new activity
        setEditMode(false);
        setSelectedActivity(activity);
    }

    // Function to handle the deleted activity
    function handleDeletedActivity(id: string) {
        setActivities([...activities.filter((x) => x.id !== id)]); // Filter out the activity with the specified id (fake delete)
    }

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
                />
            </Container>
        </>
    );
}

export default App;
