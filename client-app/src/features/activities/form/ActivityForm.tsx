import React, { ChangeEvent } from "react";
import { Button, Form, Segment } from "semantic-ui-react";
import { Activity } from "../../../app/models/activity";
import { create } from "domain";

interface Props {
    activity: Activity | undefined;
    closeForm: () => void;
    createOrEdit: (activity: Activity) => void;
}

export default function ActivityForm({ activity: selectedActivity, closeForm, createOrEdit }: Props) {
    // If the activity object is null, set the initial state to an empty object
    const initialState = selectedActivity ?? {
        id: "",
        title: "",
        category: "",
        description: "",
        date: "",
        city: "",
        venue: "",
    };

    // Set the activity state to the initial state
    const [activity, setActivity] = React.useState(initialState);

    // Handle the form submit event
    function handleSubmit() {
        createOrEdit(activity); // Call the createOrEdit function with the activity object as an argument
    }

    // Handle the input change event, and update the activity state with the new value
    function handleInputChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        const { name, value } = event.target;
        setActivity({ ...activity, [name]: value }); // The spread operator is used to copy the existing activity object and update the value of the changed property
    }

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
                    floated="right"
                    positive
                    type="submit"
                    content="Submit"
                />
                <Button
                    onClick={closeForm}
                    floated="right"
                    type="button"
                    content="Cancel"
                />
            </Form>
        </Segment>
    );
}
