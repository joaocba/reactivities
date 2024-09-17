import React, { ChangeEvent, useEffect, useState } from "react";
import { Button, Form, Segment } from "semantic-ui-react";
import { useStore } from "../../../app/stores/store";
import { observer } from "mobx-react-lite";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Activity } from "../../../app/models/activity";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import { v4 as uuid } from "uuid";

// eslint-disable-next-line react-refresh/only-export-components
export default observer(function ActivityForm() {
    const { activityStore } = useStore();
    const { selectedActivity, createActivity, updateActivity, loading, loadActivity, loadingInitial } = activityStore;
    const { id } = useParams();
    const navigate = useNavigate();

    // Set the activity state
    const [activity, setActivity] = useState<Activity>({
        id: "",
        title: "",
        category: "",
        description: "",
        date: "",
        city: "",
        venue: "",
    });

    // UseEffect hook to load the activity if the id is present
    useEffect(() => {
        if (id) loadActivity(id).then((activity) => setActivity(activity!));
    }, [id, loadActivity]);

    // Handle the form submit event
    function handleSubmit() {
        // If the activity id is empty, create a new activity, else update the existing activity
        if (!activity.id) {
            activity.id = uuid();
            createActivity(activity).then(() => navigate(`/activities/${activity.id}`)); // Navigate to the activity details page
        } else {
            updateActivity(activity).then(() => navigate(`/activities/${activity.id}`)); // Navigate to the activity details page
        }
    }

    // Handle the input change event, and update the activity state with the new value
    function handleInputChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        const { name, value } = event.target;
        setActivity({ ...activity, [name]: value }); // The spread operator is used to copy the existing activity object and update the value of the changed property
    }

    // If the loadingInitial is true, display a loading message
    if (loadingInitial) return <LoadingComponent content="Loading..." />;

    return (
        <Segment clearing>
            <Form
                onSubmit={handleSubmit}
                autocomplete="off"
            >
                <Form.Input
                    placeholder="Title"
                    value={activity.title}
                    name="title"
                    onChange={handleInputChange}
                />
                <Form.TextArea
                    placeholder="Description"
                    value={activity.description}
                    name="description"
                    onChange={handleInputChange}
                />
                <Form.Input
                    placeholder="Category"
                    value={activity.category}
                    name="category"
                    onChange={handleInputChange}
                />
                <Form.Input
                    type="date"
                    placeholder="Date"
                    value={activity.date}
                    name="date"
                    onChange={handleInputChange}
                />
                <Form.Input
                    placeholder="City"
                    value={activity.city}
                    name="city"
                    onChange={handleInputChange}
                />
                <Form.Input
                    placeholder="Venue"
                    value={activity.venue}
                    name="venue"
                    onChange={handleInputChange}
                />
                <Button
                    loading={loading}
                    floated="right"
                    positive
                    type="submit"
                    content="Submit"
                />
                <Button
                    as={Link}
                    to="/activities"
                    floated="right"
                    type="button"
                    content="Cancel"
                />
            </Form>
        </Segment>
    );
});
