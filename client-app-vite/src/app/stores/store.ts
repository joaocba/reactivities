import { createContext, useContext } from "react";
import ActivityStore from "./activityStore";
import CommonStore from "./commonStore";

// This is the root store that will hold all the stores in the application.
interface Store {
    activityStore: ActivityStore;
    commonStore: CommonStore;
}

// Initialize the root store with the activity store.
export const store: Store = {
    activityStore: new ActivityStore(),
    commonStore: new CommonStore(),
};

export const StoreContext = createContext(store);

export function useStore() {
    return useContext(StoreContext);
}
