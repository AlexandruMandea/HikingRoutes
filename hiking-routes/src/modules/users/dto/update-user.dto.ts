import { IsEmail, IsString, Matches, MaxLength, MinLength, ValidateIf } from "class-validator";

export class UpdateUserDTO {
    @IsString()
    @MinLength(2, { message: 'Name is too short!' })
    @MaxLength(25, { message: 'Name is too long!' })
    @ValidateIf((object, value) => (value !== null && value !== undefined))
    name?: string;

    @IsEmail({ message: 'This is not a valid email!' })
    @ValidateIf((object, value) => (value !== null && value !== undefined))
    email?: string;

    @IsString()
    @MinLength(8, { message: 'Password must have at least 8 characters!' })
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, { message: 'Password must have at least an uppercase and a number!' })
    @ValidateIf((object, value) => (value !== null && value !== undefined))
    password?: string;
}
