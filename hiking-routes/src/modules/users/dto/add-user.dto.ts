import { IsBoolean, IsEmail, IsEnum, IsString, Matches, MinLength } from "class-validator";
import { UserRole } from "src/app-constants.env";

export class AddUserDTO {
    @IsString()
    @MinLength(2, { message: 'Name is too short!' })
    name: string;

    @IsEmail({ message: 'This is not a valid email!' })
    email: string;

    @IsString()
    @MinLength(8, { message: 'Password must have at least 8 characters!' })
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, { message: 'Password must have at least an uppercase and a number!' })
    password: string;

    @IsString()
    salt: string;

    @IsEnum(UserRole)
    role: UserRole;

    @IsString()
    profilePicture: string;

    @IsBoolean()
    verified: boolean;
}