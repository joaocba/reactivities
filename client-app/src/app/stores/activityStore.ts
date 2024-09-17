import { makeObservable, observable } from "mobx";

// This is a MobX store that will be used to manage the state of the Activity component.
export default class ActivityStore {
    title = "Hello from MobX!";

    constructor() {
        makeObservable(this, {
            title: observable,
        });
    }
}
