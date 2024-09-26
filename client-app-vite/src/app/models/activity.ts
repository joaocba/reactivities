import { Profile } from "./profile";

export interface IActivity {
    id: string;
    title: string;
    date: Date | null;
    description: string;
    category: string;
    city: string;
    venue: string;
    hostUsername: string;
    IsCancelled: boolean;
    isGoing: boolean;
    isHost: boolean;
    host?: Profile;
    attendees?: Profile[];
}

export class Activity implements IActivity {
    id: string;
    title: string;
    date: Date | null;
    description: string;
    category: string;
    city: string;
    venue: string;
    hostUsername: string = "";
    IsCancelled: boolean = false;
    isGoing: boolean = false;
    isHost: boolean = false;
    host?: Profile;
    attendees: Profile[] = []; // Initialize attendees

    // Constructor with explicit typing
    constructor(init?: Partial<IActivity>) {
        this.id = init?.id ?? "";
        this.title = init?.title ?? "";
        this.date = init?.date ?? null;
        this.description = init?.description ?? "";
        this.category = init?.category ?? "";
        this.city = init?.city ?? "";
        this.venue = init?.venue ?? "";
    }
}

export class ActivityFormValues {
    id?: string = undefined;
    title: string = "";
    category: string = "";
    description: string = "";
    date: Date | null = null;
    city: string = "";
    venue: string = "";

    constructor(activity?: IActivity) {
        if (activity) {
            this.id = activity.id;
            this.title = activity.title;
            this.category = activity.category;
            this.description = activity.description;
            this.date = activity.date;
            this.city = activity.city;
            this.venue = activity.venue;
        }
    }
}
