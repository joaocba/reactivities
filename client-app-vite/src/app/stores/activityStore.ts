import { Activity } from "./../models/activity";
import { makeAutoObservable, runInAction } from "mobx";
import agent from "../api/agent";
import { v4 as uuid } from "uuid";

// This is a MobX store that will be used to manage the state of the Activity component.
export default class ActivityStore {
    activityRegistry = new Map<string, Activity>(); // This is an observable map of activities
    selectedActivity: Activity | undefined = undefined; // This is an observable activity
    editMode = false;
    loading = false;
    loadingInitial = true;

    // Constructor to initialize the store and make it observable
    constructor() {
        makeAutoObservable(this);
    }

    // Get the activities by date
    get activitiesByDate() {
        return Array.from(this.activityRegistry.values()).sort((a, b) => Date.parse(b.date) - Date.parse(a.date));
    }

    // Method to load activities
    loadActivities = async () => {
        try {
            // Call the list method from the agent
            const activities = await agent.Activities.list();

            // runInAction will fix the error: [MobX] Since strict-mode is enabled, changing (observed) observable values without using an action is not allowed.
            runInAction(() => {
                // For each activity, split the date and take the first part (the date)
                activities.forEach((activity) => {
                    activity.date = activity.date.split("T")[0];
                    this.activityRegistry.set(activity.id, activity);
                });
                this.loadingInitial = false;
            });
        } catch (error) {
            console.log(error);
            runInAction(() => {
                this.loadingInitial = false;
            });
        }
    };

    // Method to view an activity
    selectActivity = (id: string) => {
        this.selectedActivity = this.activityRegistry.get(id);
    };

    // Method to cancel the selected activity
    cancelSelectActivity = () => {
        this.selectedActivity = undefined;
    };

    // Method to open the form
    openForm = (id?: string) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        id ? this.selectActivity(id) : this.cancelSelectActivity();
        this.editMode = true;
    };

    // Method to close the form
    closeForm = () => {
        this.editMode = false;
    };

    // Method to create an activity
    createActivity = async (activity: Activity) => {
        this.loading = true;
        activity.id = uuid();

        try {
            await agent.Activities.create(activity);

            runInAction(() => {
                // Add the new activity to the activities array
                this.activityRegistry.set(activity.id, activity);
                // Set the selected activity to the new activity
                this.selectedActivity = activity;
                this.editMode = false;
                this.loading = false;
            });
        } catch (error) {
            console.log(error);
            runInAction(() => {
                this.loading = false;
            });
        }
    };

    // Method to update an activity
    updateActivity = async (activity: Activity) => {
        this.loading = true;

        try {
            await agent.Activities.update(activity);

            runInAction(() => {
                // Filter out the activity with the specified id and add the updated activity
                this.activityRegistry.set(activity.id, activity);
                // Set the selected activity to the updated activity
                this.selectedActivity = activity;
                this.editMode = false;
                this.loading = false;
            });
        } catch (error) {
            console.log(error);
            runInAction(() => {
                this.loading = false;
            });
        }
    };

    // Method to delete an activity
    deleteActivity = async (id: string) => {
        this.loading = true;

        try {
            await agent.Activities.delete(id);

            runInAction(() => {
                // Filter out the activity with the specified id
                this.activityRegistry.delete(id);
                // Check if the selected activity has the specified id, and cancel the selected activity
                if (this.selectedActivity?.id === id) this.cancelSelectActivity();
                this.loading = false;
            });
        } catch (error) {
            console.log(error);
            runInAction(() => {
                this.loading = false;
            });
        }
    };
}
