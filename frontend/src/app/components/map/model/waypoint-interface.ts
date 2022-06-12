import { MyLocation } from "./my-location-interface";

export interface Waypoint {
    location: MyLocation;
    stopover?: boolean;
}