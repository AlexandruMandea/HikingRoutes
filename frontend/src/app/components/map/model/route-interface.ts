import { RouteUnit, TravelMode } from "src/environments/app-constants";
import { MapPoint } from "./map-point-interface";
import { User } from "../../login/model/user-interface";

export interface Route {
    id?: string;
    title?: string;
    region?: string;
    searchString?: string;
    originID?: string;
    origin?: MapPoint;
    destinationID?: string;
    destination?: MapPoint;
    overviewPolyline?: string;
    distance?: number;
    duration?: string;
    unit?: RouteUnit;
    totalAscending?: number;
    totalDescending?: number;
    travelMode?: TravelMode;
    warnings?: string;
    createdByID?: string;
    createdBy?: User;
    isPrivate?: boolean;
    noOfLikes?: number;
    createdAt?: string;
    updatedAt?: string;
    waypoints?: MapPoint[];
}