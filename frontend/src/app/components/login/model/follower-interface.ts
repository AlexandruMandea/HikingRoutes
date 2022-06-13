import { User } from "./user-interface";

export interface Follower {
    id?: number;
    followingId?: string;
    followerId?: string;
}