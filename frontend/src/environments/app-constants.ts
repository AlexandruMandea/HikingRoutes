import { ProfileFollowersComponent } from "src/app/components/profile-followers/profile-followers.component";
import { ProfileFollowingsComponent } from "src/app/components/profile-followings/profile-followings.component";
import { ProfileRoutesComponent } from "src/app/components/profile-routes/profile-routes.component";
import { ProfileStatsComponent } from "src/app/components/profile-stats/profile-stats.component";

export enum UserRole {
    ADMIN = 'admin',
    USER = 'user',
}

export enum RouteUnit {
    METRIC = 'metric',
    IMPERIAL = 'imperial',
}

export enum TravelMode {
    BICYCLING = 'BICYCLING',
    WALKING = 'WALKING',
}

export const baseServerUsersUrl = '/hiking-routes/users';
export const baseServerRoutesUrl = '/hiking-routes/routes';
export const baseServerFollowersUrl = '/hiking-routes/followers';
export const baseServerStylesUrl = '/hiking-routes/style-renderer';

export const blankProfilePicture = 'blank-profile-picture.jpg';

export const profileRoutesComponent = 'routes';
export const profileFollowersComponent = 'followers';
export const profileFollowingsComponent = 'followings';
export const profileStatsComponent = 'stats';