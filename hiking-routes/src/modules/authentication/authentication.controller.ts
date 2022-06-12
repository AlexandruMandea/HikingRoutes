import { Controller, Get, Post, Query, Req, UseGuards } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { LoginDTO } from '../users/dto/login.dto';
import { RegisterDTO } from '../users/dto/register.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@Controller('authentication')
@ApiTags('authentication')
export class AuthenticationController {
    constructor(private readonly authenticationSetvice: AuthenticationService) { }



    @Get('refresh-token')
    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt-refresh-token'))
    async refreshToken(@Req() request: Request) {
        try {
            return this.authenticationSetvice.refreshToken(request);
        } catch (error) {
            return error;
        }
    }
}
