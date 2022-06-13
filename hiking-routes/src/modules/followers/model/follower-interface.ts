import { User } from "src/modules/users/models/user-interface";

export interface Follower {
    id?: number;
    followingId?: string;
    followerId?: string;
}