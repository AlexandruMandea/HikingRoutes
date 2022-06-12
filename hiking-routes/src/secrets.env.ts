export const DATABASE_URL = 'mongodb+srv://alexandru:abc123.@hikingroutescluster.ft0dv.mongodb.net/HikingRoutesDB?retryWrites=true&w=majority';
export const MY_SQL_USERNAME = 'root';
export const MY_SQL_PASSWORD = 'abc123.';
export const SALT = '_my_secret_salt_';

export enum Secret {
    ACCESS_TOKEN_SECRET = 'accessTokenSecret',
    REFRESH_TOKEN_SECRET = 'refreshTokenSecret',
    VERIFY_EMAIL_TOKEN = 'verifyEmailToken',
}