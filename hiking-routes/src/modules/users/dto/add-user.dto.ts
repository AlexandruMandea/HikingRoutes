import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsEmail, IsEnum, IsString, Matches, MinLength } from "class-validator";
import { UserRole } from "src/app-constants.env";
import { Routes } from "src/schemas/routes-schema";
import { Users } from "src/schemas/users-schema";

export class AddUserDTO {
    @ApiProperty()
    @IsString()
    @MinLength(2, { message: 'Name is too short!' })
    name: string;

    @ApiProperty()
    @IsEmail({ message: 'This is not a valid email!' })
    email: string;

    @ApiProperty()
    @IsString()
    @MinLength(8, { message: 'Password must have at least 8 characters!' })
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, { message: 'Password must have at least an uppercase and a number!' })
    password: string;

    @ApiProperty()
    @IsString()
    salt: string;

    @ApiProperty()
    @IsEnum(UserRole)
    role: UserRole;

    @ApiProperty()
    @IsString()
    profilePicture: string;

    @ApiProperty()
    @IsBoolean()
    verified: boolean;
}