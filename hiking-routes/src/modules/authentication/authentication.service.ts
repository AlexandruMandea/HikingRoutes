import { BadRequestException, ConflictException, forwardRef, Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { LoginDTO } from '../users/dto/login.dto';
import { RegisterDTO } from '../users/dto/register.dto';
import { Request } from 'express';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { UserRole } from 'src/app-constants.env';
import { Routes } from 'src/schemas/routes-schema';
import { Users } from 'src/schemas/users-schema';
import * as jwt from 'jsonwebtoken';
import { Secret } from 'src/secrets.env';
import { User } from '../users/models/user-interface';
import { from, Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthenticationService {
    constructor(
        private readonly jwtService: JwtService,
        @Inject(forwardRef(() => UsersService))
        private usersService: UsersService,
    ) { }

    generateJWT(user: User) {
        return from(this.jwtService.signAsync({ user }));
    }

    generateSalt(user: User) {
        const salt = from(bcrypt.genSalt());
    }

    hashPassword(password: string) {
        return from(bcrypt.hash(password, 12));
    }

    comparePasswords(newPassword: string, passwortHash: string): Observable<any> {
        return from(bcrypt.compare(newPassword, passwortHash));
    }

    async refreshToken(request: Request) {
        const partialUser = {
            _id: request.user['id'],
            name: request.user['name'],
            email: request.user['email'],
            profilePicutre: request.user['profilePicture'],
        };

        const newAccessToken = jwt.sign(
            { ...partialUser },
            Secret.ACCESS_TOKEN_SECRET,
            {
                expiresIn: '1800s',
            }
        );

        const newRefreshToken = jwt.sign(
            { ...partialUser },
            Secret.REFRESH_TOKEN_SECRET,
            {
                expiresIn: '7d',
            }
        );

        return {
            ...partialUser,
            newAccessToken,
            newRefreshToken,
        };
    }
}
