import { Route } from "./route-interface";

export interface MapPoint {
    id?: string;
    lat?: string;
    lng?: string;
    route?: Route;
    index?: number;
}