import { makeAutoObservable, reaction } from "mobx";
import { ServerError } from "../models/serverError";

export default class CommonStore {
    error: ServerError | null = null;
    token: string | null = localStorage.getItem("jwt"); // Get the token from the local storage
    appLoaded = false;

    constructor() {
        makeAutoObservable(this);

        // React to the token change in the local storage
        reaction(
            () => this.token,
            (token) => {
                if (token) {
                    localStorage.setItem("jwt", token);
                } else {
                    localStorage.removeItem("jwt");
                }
            }
        );
    }

    setServerError(error: ServerError) {
        this.error = error;
    }

    // Set the token in the local storage
    setToken = (token: string | null) => {
        this.token = token;
    };

    setAppLoaded = () => {
        this.appLoaded = true;
    };
}
