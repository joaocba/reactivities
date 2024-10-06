import axios, { AxiosError, AxiosResponse } from "axios";
import { toast } from "react-toastify";
import { Activity, ActivityFormValues } from "../models/activity";
import { User, UserFormValues } from "../models/user";
import { router } from "../router/Routes";
import { store } from "../stores/store";
import { Photo, Profile, UserActivity } from "../models/profile";
import { PaginatedResult } from "../models/pagination";

// Function to sleep while waiting for the response
const sleep = (delay: number) => {
    return new Promise((resolve) => {
        setTimeout(resolve, delay);
    });
};

// Set the base URL for the axios requests (dev)
/* axios.defaults.baseURL = "http://localhost:5000/api"; */

// Set the URL for production
axios.defaults.baseURL = import.meta.env.VITE_API_URL;

// Set the token for the axios requests
const responseBody = <T>(response: AxiosResponse<T>) => response.data; // This is the type safety for the response body <T>

// Set the token for the axios requests so that the token is sent with the request
axios.interceptors.request.use((config) => {
    const token = store.commonStore.token;
    if (token && config.headers) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

// Set the request interceptor for the axios requests, an interceptor is a middleware that can intercept the request and response
axios.interceptors.response.use(
    async (response) => {
        if (import.meta.env.DEV) await sleep(1000);

        // Get the pagination header from the response and set the pagination data
        const pagination = response.headers["pagination"];
        if (pagination) {
            response.data = new PaginatedResult(response.data, JSON.parse(pagination));
            return response as AxiosResponse<PaginatedResult<unknown>>;
        }

        return response;
    },
    (error: AxiosError) => {
        const { data, status, config, headers } = error.response as AxiosResponse;
        switch (status) {
            case 400:
                if (config.method === "get" && Object.prototype.hasOwnProperty.call(data, "errors")) {
                    router.navigate("/not-found");
                }

                // Process the validation errors
                if (data.errors) {
                    const modalStateErrors = [];
                    for (const key in data.errors) {
                        if (data.errors[key]) {
                            modalStateErrors.push(data.errors[key]);
                        }
                    }
                    throw modalStateErrors.flat();
                } else {
                    toast.error(data);
                }
                break;
            case 401:
                if (status === 401 && headers["www-authenticate"]?.startsWith('Bearer error="invalid_token"')) {
                    store.userStore.logout();
                    toast.error("Session expired - please login again");
                } else {
                    toast.error("unauthorised");
                }

                toast.error("unauthorised");
                break;
            case 403:
                toast.error("forbidden");
                break;
            case 404:
                router.navigate("/not-found");
                break;
            case 500:
                store.commonStore.setServerError(data);
                router.navigate("/server-error");
                break;
        }
        return Promise.reject(error);
    }
);

// Set the requests for the axios requests
const requests = {
    get: <T>(url: string) => axios.get<T>(url).then(responseBody),
    post: <T>(url: string, body: {}) => axios.post<T>(url, body).then(responseBody),
    put: <T>(url: string, body: {}) => axios.put<T>(url, body).then(responseBody),
    del: <T>(url: string) => axios.delete<T>(url).then(responseBody),
};

// Set the Activities object for the axios requests
const Activities = {
    list: (params: URLSearchParams) => axios.get<PaginatedResult<Activity[]>>(`/activities`, { params }).then(responseBody),
    details: (id: string) => requests.get<Activity>(`/activities/${id}`),
    create: (activity: ActivityFormValues) => requests.post<void>(`/activities`, activity),
    update: (activity: ActivityFormValues) => requests.put<void>(`/activities/${activity.id}`, activity),
    delete: (id: string) => requests.del<void>(`/activities/${id}`),
    attend: (id: string) => requests.post<void>(`/activities/${id}/attend`, {}),
};

// Set the Account object for the axios requests
const Account = {
    current: () => requests.get<User>("account"),
    login: (user: UserFormValues) => requests.post<User>("/account/login", user),
    register: (user: UserFormValues) => requests.post<User>("/account/register", user),
    refreshToken: () => requests.post<User>("/account/refresh-token", {}),
};

// Set the Profiles object for the axios requests
const Profiles = {
    get: (username: string) => requests.get<User>(`/profiles/${username}`),
    // Method to upload photo
    uploadPhoto: (file: Blob) => {
        const formData = new FormData();
        formData.append("File", file);
        return axios.post<Photo>("photos", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
    },
    setMainPhoto: (id: string) => requests.post(`/photos/${id}/setMain`, {}),
    deletePhot: (id: string) => requests.del(`/photos/${id}`),

    updateProfile: (profile: Partial<Profile>) => requests.put("/profiles", profile),

    updateFollowing: (username: string) => requests.post(`/follow/${username}`, {}),
    listFollowings: (username: string, predicate: string) => requests.get<Profile[]>(`/follow/${username}?predicate=${predicate}`),

    listActivities: (username: string, predicate: string) => requests.get<UserActivity[]>(`/profiles/${username}/activities?predicate=${predicate}`),
};

// Set the agent object for the axios requests
const agent = {
    Activities,
    Account,
    Profiles,
};

export default agent;
