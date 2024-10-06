import { makeAutoObservable, runInAction } from "mobx";
import { User, UserFormValues } from "../models/user";
import agent from "../api/agent";
import { store } from "./store";
import { router } from "../router/Routes";
import { isAxiosError } from "axios";

// UserStore is a class that stores the user information about the current user if logged in or null if not logged in

export default class UserStore {
    user: User | null = null;
    refreshTokenTimeout?: null;

    constructor() {
        makeAutoObservable(this);
    }

    get isLoggedIn() {
        return !!this.user;
    }

    // Login the user and set the token in the local storage
    login = async (creds: UserFormValues) => {
        const user = await agent.Account.login(creds);
        store.commonStore.setToken(user.token);
        this.startRefreshTokenTimer(user);
        runInAction(() => (this.user = user));
        router.navigate("/activities");
        store.modalStore.closeModal();
    };

    // Register the user and set the token in the local storage
    register = async (creds: UserFormValues) => {
        try {
            await agent.Account.register(creds);
            router.navigate(`/account/registerSuccess?email=${creds.email}`);
            store.modalStore.closeModal();
        } catch (error) {
            if (isAxiosError(error) && error?.response?.status === 400) throw error;
            store.modalStore.closeModal();
            console.log(500);
        }
    };

    // Logout the user and remove the token from the local storage
    logout = () => {
        store.commonStore.setToken(null);
        this.user = null;
        router.navigate("/");
    };

    getUser = async () => {
        try {
            const user = await agent.Account.current();
            store.commonStore.setToken(user.token);
            this.startRefreshTokenTimer(user);
            runInAction(() => (this.user = user));
        } catch (error) {
            console.log(error);
        }
    };

    setImage = (image: string) => {
        if (this.user) this.user.image = image;
    };

    setDisplayName = (name: string) => {
        if (this.user) this.user.displayName = name;
    };

    refreshToken = async () => {
        this.stopRefreshTokenTimer();
        try {
            const user = await agent.Account.refreshToken();
            runInAction(() => (this.user = user));
            store.commonStore.setToken(user.token);
            this.startRefreshTokenTimer(user);
        } catch (error) {
            console.log(error);
        }
    };

    private startRefreshTokenTimer(user: User) {
        const jwtToken = JSON.parse(atob(user.token.split(".")[1]));
        const expires = new Date(jwtToken.exp * 1000);
        const timeout = expires.getTime() - Date.now() - 30 * 1000;

        this.refreshTokenTimeout = setTimeout(this.refreshToken, timeout);
        console.log({ refreshTimeout: this.refreshTokenTimeout });
    }

    private stopRefreshTokenTimer() {
        clearTimeout(this.refreshTokenTimeout);
    }
}
