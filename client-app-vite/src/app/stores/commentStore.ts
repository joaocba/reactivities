import { HubConnection, HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import { makeAutoObservable, runInAction } from "mobx";
import { ChatComment } from "../models/comment";
import { store } from "./store";

export default class CommentStore {
    comments: ChatComment[] = [];
    hubConnection: HubConnection | null = null;

    constructor() {
        makeAutoObservable(this);
    }

    // Create a connection to the SignalR hub
    createHubConnection(activityId: string) {
        if (store.activityStore.selectedActivity) {
            this.hubConnection = new HubConnectionBuilder()
                .withUrl(import.meta.env.VITE_CHAT_URL + "/?activityId=" + activityId, {
                    accessTokenFactory: () => store.userStore.user?.token as string,
                })
                .withAutomaticReconnect()
                .configureLogging(LogLevel.Information)
                .build();

            this.hubConnection.start().catch((error) => console.log("Error establishing connection: ", error));

            this.hubConnection.on("LoadComments", (comments: ChatComment[]) => {
                runInAction(() => {
                    comments.forEach((comment) => {
                        comment.createdAt = new Date(comment.createdAt + "Z");
                    });
                    this.comments = comments;
                });
                this.comments = comments;
            });

            this.hubConnection.on("ReceiveComment", (comment) => {
                runInAction(() => {
                    comment.createdAt = new Date(comment.createdAt);
                    this.comments.unshift(comment);
                });
            });
        }
    }

    // Stop the connection to the SignalR hub
    stopHubConnection = () => {
        this.hubConnection?.stop().catch((error) => console.log("Error stopping connection: ", error));
    };

    // Helper method to clear the comments
    clearComments = () => {
        this.comments = [];
        this.stopHubConnection();
    };

    addComment = async (values: { body: string; activityId?: string }) => {
        values.activityId = store.activityStore.selectedActivity?.id;
        try {
            await this.hubConnection?.invoke("SendComment", values);
        } catch (error) {
            console.log(error);
        }
    };
}
