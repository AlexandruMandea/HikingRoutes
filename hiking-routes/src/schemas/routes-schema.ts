import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Decimal128 } from "mongoose";
import { RouteUnit, TravelMode } from "src/app-constants.env";
import { MapPoint } from "src/modules/routes/models/map-point-interface";
import { Users } from "./users-schema";

export type RouteDocument = Routes & Document;

@Schema({ timestamps: true, collection: 'routes' })
export class Routes {
    @Prop()
    title: string;

    @Prop({ name: 'Created_by', type: mongoose.Schema.Types.ObjectId, ref: 'Users' })
    createdBy: string;

    @Prop()
    origin: MapPoint;

    @Prop()
    destination: MapPoint;

    @Prop()
    overviewPolyline: string;

    @Prop({ type: "Decimal128" })
    distance: Decimal128;

    @Prop()
    duration: string;

    @Prop({ type: "Decimal128" })
    totalElevating: Decimal128;

    @Prop({ type: "Decimal128" })
    totalDescending: Decimal128;

    @Prop()
    unit: RouteUnit;

    @Prop()
    isPrivate: boolean;

    @Prop()
    warnings: Array<string>;

    @Prop()
    travelMode: TravelMode;
}

export const RoutesSchema = SchemaFactory.createForClass(Routes);