import { UserRole } from "src/environments/app-constants";
import { Route } from "../../map/model/route-interface";

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
    createdAt?: string;
    updatedAt?: string;
}