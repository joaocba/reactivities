import { User } from "./../models/user";
import { Activity, ActivityFormValues } from "./../models/activity";
import { makeAutoObservable, runInAction } from "mobx";
import agent from "../api/agent";
import { v4 as uuid } from "uuid";
import { format } from "date-fns";
import { store } from "./store";
import { Profile } from "../models/profile";

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

    // Computed Get the activities by date
    get activitiesByDate() {
        // Sort the activities by date DESC
        return Array.from(this.activityRegistry.values()).sort((a, b) => b.date!.getTime() - a.date!.getTime());
    }

    // Computed Get the grouped activities
    get groupedActivities() {
        // Return the grouped activities by date as an array of key-value pairs
        return Object.entries(
            this.activitiesByDate.reduce((activities, activity) => {
                const date = format(activity.date!, "dd MMM yyyy");
                // If the date exists, add the activity to the date, otherwise create a new date with the activity
                activities[date] = activities[date] ? [...activities[date], activity] : [activity];
                return activities;
            }, {} as { [key: string]: Activity[] }) // Initialize the object as an empty object
        );
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
        const user = store.userStore.user;

        // Set the isGoing and isHost properties based on the user's attendance
        if (user) {
            activity.isGoing = activity.attendees!.some((a) => a.username === user.username);
            activity.isHost = activity.hostUsername === user.username;
            activity.host = activity.attendees!.find((x) => x.username === activity.hostUsername);
        }

        activity.date = new Date(activity.date!);
        this.activityRegistry.set(activity.id, activity);
    };

    // Helper method to get a single activity
    private getActivity = (id: string) => {
        return this.activityRegistry.get(id);
    };

    // Method to create an activity
    createActivity = async (activity: ActivityFormValues) => {
        const user = store.userStore.user;
        const attendee = new Profile(user!);

        try {
            await agent.Activities.create(activity);
            const newActivity = new Activity(activity);
            newActivity.attendees = user!.username;
            newActivity.attendees = [attendee];
            this.setActivity(newActivity);
            runInAction(() => {
                // Set the selected activity to the new activity
                this.selectedActivity = newActivity;
            });
        } catch (error) {
            console.log(error);
        }
    };

    // Method to update an activity
    updateActivity = async (activity: ActivityFormValues) => {
        try {
            await agent.Activities.update(activity);

            runInAction(() => {
                if (activity.id) {
                    const updatedActivity = { ...this.getActivity(activity.id), ...activity };

                    // Filter out the activity with the specified id and add the updated activity
                    this.activityRegistry.set(activity.id, updatedActivity as Activity);

                    // Set the selected activity to the updated activity
                    this.selectedActivity = updatedActivity as Activity;
                }
            });
        } catch (error) {
            console.log(error);
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

    // Update the attendance
    updateAttendance = async () => {
        const user = store.userStore.user;
        this.loading = true;

        // if the activity is going, remove the user from the attendees array and set the isGoing property to false
        // if the activity is not going, add the user to the attendees array and set the isGoing property to true
        try {
            await agent.Activities.attend(this.selectedActivity!.id);
            runInAction(() => {
                if (this.selectedActivity?.isGoing) {
                    this.selectedActivity.attendees = this.selectedActivity.attendees?.filter((a) => a.username !== user?.username);
                    this.selectedActivity.isGoing = false;
                } else {
                    const attendee = new Profile(user!);
                    this.selectedActivity?.attendees?.push(attendee);
                    this.selectedActivity!.isGoing = true;
                }
                this.activityRegistry.set(this.selectedActivity!.id, this.selectedActivity!);
            });
        } catch (error) {
            console.log(error);
        } finally {
            runInAction(() => (this.loading = false));
        }
    };

    // Method to cancel an activity toggle
    cancelActivityToggle = async () => {
        this.loading = true;
        try {
            await agent.Activities.attend(this.selectedActivity!.id);
            runInAction(() => {
                this.selectedActivity!.IsCancelled = !this.selectedActivity!.IsCancelled;
                this.activityRegistry.set(this.selectedActivity!.id, this.selectedActivity!);
            });
        } catch (error) {
            console.log(error);
        } finally {
            runInAction(() => (this.loading = false));
        }
    };
}
