import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";
import { UserRole } from "src/app-constants.env";
import { Routes } from "./routes-schema";

export type UserDocument = Users & Document;

@Schema({ timestamps: true, collection: 'users' })
export class Users {
    @Prop()
    name: string;

    // @Prop({ unique: true })
    // username: String;

    @Prop({ unique: true })
    email: string;

    @Prop()
    password: string;

    @Prop()
    salt: string;

    @Prop()
    role: UserRole;

    @Prop()
    profilePicture: string;

    @Prop()
    verified: Boolean;

    @Prop()
    traveledRoutes: Routes[];

    @Prop()
    favouriteRoutes: Routes[];

    @Prop()
    friends: Users[];

    // @Prop({ name: 'Following', type: mongoose.Schema.Types.ObjectId, ref: Users.name })
    // following: Users[];

    // @Prop({ name: 'Followers', type: mongoose.Schema.Types.ObjectId, ref: Users.name })
    // followers: Users[];
}

export const UsersSchema = SchemaFactory.createForClass(Users);