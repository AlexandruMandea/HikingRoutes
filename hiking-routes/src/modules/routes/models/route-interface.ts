import { RouteUnit, TravelMode } from "src/app-constants.env";
import { User } from "src/modules/users/models/user-interface"; import { MapPoint } from "./map-point-interface";
import { Waypoint } from "./waypoint-interface";

export interface Route {
    id?: string;
    title?: string;
    region?: string;
    searchString?: string;
    originID?: string;
    origin?: MapPoint;
    destinationID?: string;
    destination?: MapPoint;
    waypoints?: Waypoint[];
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

    // init(route: any) {
    //     this.id = route.id;
    //     this.origin = route.origin;
    //     this.destination = route.destination;
    //     this.overviewPolyline = route.overviewPolyline;
    //     this.distance = route.distance;
    //     this.duration = route.duration;
    //     this.unit = route.unit;
    //     this.totalAscending = route.totalAscending;
    //     this.totalDescending = route.totalDescending;
    //     this.warnings = route.warnings;
    //     this.travelMode = route.travelMode;
    //     this.createdBy = route.createdBy;
    //     this.isPrivate = route.isPrivate;
    //     this.noOfLikes = route.noOfLikes;
    //     this.createdAt = route.createdAt;
    //     this.updatedAt = route.updatedAt;
    // }
}