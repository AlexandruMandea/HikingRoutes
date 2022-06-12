import { ApiProperty } from "@nestjs/swagger";
import { IsLatitude, IsLongitude, IsNumberString } from "class-validator";

export class MapPointDTO {
    @ApiProperty()
    @IsLatitude()
    lat: string;

    @ApiProperty()
    @IsLongitude()
    lng: string;
}