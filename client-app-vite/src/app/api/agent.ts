import axios, { AxiosError, AxiosResponse } from "axios";
import { Activity } from "../models/activity";
import { toast } from "react-toastify";
import { router } from "../router/Routes";
import { store } from "../stores/store";

// Function to sleep while waiting for the response
const sleep = (delay: number) => {
    return new Promise((resolve) => {
        setTimeout(resolve, delay);
    });
};

// Set the base URL for the axios requests
axios.defaults.baseURL = "http://localhost:5000/api";

// Set the request interceptor for the axios requests, an interceptor is a middleware that can intercept the request and response
axios.interceptors.response.use(
    async (response) => {
        await sleep(1000);
        return response;
    },
    (error: AxiosError) => {
        const { data, status, config } = error.response as AxiosResponse;
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

// Set the token for the axios requests
const responseBody = <T>(response: AxiosResponse<T>) => response.data; // This is the type safety for the response body <T>

// Set the requests for the axios requests
const requests = {
    get: <T>(url: string) => axios.get<T>(url).then(responseBody), // The <T> is a generic type that allows you to specify the type of the response
    post: <T>(url: string, body: {}) => axios.post<T>(url, body).then(responseBody),
    put: <T>(url: string, body: {}) => axios.put<T>(url, body).then(responseBody),
    del: <T>(url: string) => axios.delete<T>(url).then(responseBody),
};

// Set the Activities object for the axios requests
const Activities = {
    list: () => requests.get<Activity[]>("/activities"),
    details: (id: string) => requests.get<Activity>(`/activities/${id}`),
    create: (activity: Activity) => requests.post<void>("/activities", activity),
    update: (activity: Activity) => requests.put<void>(`/activities/${activity.id}`, activity),
    delete: (id: string) => requests.del<void>(`/activities/${id}`),
};

// Set the agent object for the axios requests
const agent = {
    Activities,
};

export default agent;
