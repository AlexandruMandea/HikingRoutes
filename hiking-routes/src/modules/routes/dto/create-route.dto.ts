import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsString, ValidateNested } from "class-validator";
import { RouteUnit, TravelMode } from "src/app-constants.env";
import { Waypoint } from "../models/waypoint-interface";
import { MapPointDTO } from "./map-point.dto";

export class CreateRouteDTO {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    title: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    region: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    searchString: string;

    @ApiProperty()
    @Type(() => MapPointDTO)
    @ValidateNested()
    origin: MapPointDTO;

    @ApiProperty()
    @Type(() => MapPointDTO)
    @ValidateNested()
    destination: MapPointDTO;

    @ApiProperty()
    waypoints: Waypoint[];

    @ApiProperty()
    @IsString()
    overviewPolyline: string;

    @ApiProperty()
    @IsNumber()
    distance: number;

    @ApiProperty()
    @IsString()
    duration: string;

    @ApiProperty()
    @IsEnum(RouteUnit)
    unit: RouteUnit;

    @ApiProperty()
    @IsNumber()
    totalAscending: number;

    @ApiProperty()
    @IsNumber()
    totalDescending: number;

    @ApiProperty()
    @IsString()
    warnings: string;

    @ApiProperty()
    @IsEnum(TravelMode)
    travelMode: TravelMode;

    @ApiProperty()
    @IsBoolean()
    isPrivate: boolean;
}