import { UserRole } from "src/app-constants.env";
import { Follower } from "src/modules/followers/model/follower-interface";
import { Route } from "src/modules/routes/models/route-interface";

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

    // init(user: any) {
    //     this.id = user.id;
    //     this.name = user.name;
    //     this.email = user.email;
    //     this.role = user.role;
    //     this.profilePicture = user.profilePicture;
    //     this.verified = user.verified;
    //     //this.createdRoutes = user.createdRoutes;
    //     this.createdAt = user.createdAt;
    //     this.updatedAt = user.updatedAt;

    //     return this;
    // }
}