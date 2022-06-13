import { UserRole } from "src/environments/app-constants";
import { Route } from "../../map/model/route-interface";
import { Follower } from "./follower-interface";

export interface User {
    id?: string;
    name?: string;
    email?: string;
    password?: string
    salt?: string;
    role?: UserRole;
    profilePicture?: string;
    verified?: boolean;
    createdRoutes?: Route[];
    favouriteRoutes?: Route[];
    travelledRoutes?: Route[];
    followings?: Follower[];
    followers?: Follower[];
    createdAt?: string;
    updatedAt?: string;
}