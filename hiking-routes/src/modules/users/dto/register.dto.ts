import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, Matches, MaxLength, MinLength } from "class-validator";

export class RegisterDTO {
    @ApiProperty()
    @IsString()
    @MinLength(2, { message: 'Name is too short!' })
    @MaxLength(25, { message: 'Name is too long!' })
    name: string;

    @ApiProperty()
    @IsEmail({ message: 'This is not a valid email!' })
    email: string;

    @ApiProperty()
    @IsString()
    @MinLength(8, { message: 'Password must have at least 8 characters!' })
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[a-z]).*$/, { message: 'Password must have at least a special character!' })//(?=.*[A-Z])
    password: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    confirmPassword: string;
}