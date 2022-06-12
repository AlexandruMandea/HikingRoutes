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

export const blankProfilePicture = 'blank-profile-picture.jpg';