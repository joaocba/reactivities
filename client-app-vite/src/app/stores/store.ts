import { createContext, useContext } from "react";
import ActivityStore from "./activityStore";

// This is the root store that will hold all the stores in the application.
interface Store {
    activityStore: ActivityStore;
}

// Initialize the root store with the activity store.
export const store: Store = {
    activityStore: new ActivityStore(),
};

export const StoreContext = createContext(store);

export function useStore() {
    return useContext(StoreContext);
}
