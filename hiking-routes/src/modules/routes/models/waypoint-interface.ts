import { Route } from "./route-interface";

export interface Waypoint {
    id?: string;
    lat?: string;
    lng?: string;
    route?: Route;
    routeId?: string;
    index?: number;
}