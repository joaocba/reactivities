import React, { useEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import axios from "axios";
import { Button, Header, List } from "semantic-ui-react";

function App() {
    // useState is a hook that allows you to have state variables in functional components
    const [activities, setActivities] = useState([]); // The empty array is the initial state

    // UseEffect is a hook that runs after the first render and after every update
    useEffect(() => {
        axios.get("http://localhost:5000/api/Activities").then((response) => {
            //console.log(response);
            setActivities(response.data);
        });
    }, []); // The empty array ensures that this effect runs only once, else it will run multiple times

    return (
        <div>
            <Header as="h2" icon="users" content="Reactivities" />
            <List>
                {activities.map((activity: any) => (
                    <List.Item key={activity.id}>{activity.title}</List.Item>
                ))}
            </List>
        </div>
    );
}

export default App;
