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
    loadingInitial = false;

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
        this.loadingInitial = true;
        try {
            // Call the list method from the agent
            const activities = await agent.Activities.list();

            // runInAction will fix the error: [MobX] Since strict-mode is enabled, changing (observed) observable values without using an action is not allowed.
            runInAction(() => {
                // For each activity, split the date and take the first part (the date)
                activities.forEach((activity) => {
                    this.setActivity(activity);
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

    // Load a single activity
    loadActivity = async (id: string) => {
        let activity = this.getActivity(id);

        if (activity) {
            this.selectedActivity = activity;
            return activity;
        } else {
            this.loadingInitial = true;
            try {
                activity = await agent.Activities.details(id);
                this.setActivity(activity);

                runInAction(() => {
                    this.selectedActivity = activity;
                    this.loadingInitial = false;
                });

                return activity;
            } catch (error) {
                console.log(error);
                this.loadingInitial = false;
            }
        }
    };

    // Helper method to set an activity
    private setActivity = (activity: Activity) => {
        activity.date = activity.date.split("T")[0];
        this.activityRegistry.set(activity.id, activity);
    };

    // Helper method to get a single activity
    private getActivity = (id: string) => {
        return this.activityRegistry.get(id);
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
