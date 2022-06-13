import { Controller, Delete, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FollowersService } from './followers.service';
import { Request } from 'express';
import { catchError, map, of, tap } from 'rxjs';
import { Follower } from './model/follower-interface';
import { AllowAny } from '../authentication/decorators/allow-any-decorator';
import { User } from '../users/models/user-interface';
import { DeleteResult } from 'typeorm';

@Controller('followers')
export class FollowersController {
    constructor(
        private followersService: FollowersService
    ) { }

    @Post('follow/:userId')
    @UseGuards(AuthGuard('jwt'))
    follow(@Param('userId') userId: string, @Req() request: Request) {
        return this.followersService.follow(userId, request).pipe(
            tap((follower) => follower),
            catchError(err => of({ error: err.message }))
        );
    }

    @Get('get-follower-as-user/:followsId')
    @AllowAny()
    getFollowerAsUser(@Param('followsId') followsId: string) {
        return this.followersService.getFollowerAsUser(parseInt(followsId)).pipe(
            map((follower: User) => follower),
            catchError(err => of({ error: err.message }))
        );
    }

    @Get('get-following-as-user/:followsId')
    @AllowAny()
    getFollowingAsUser(@Param('followsId') followsId: number) {
        return this.followersService.getFollowingAsUser(followsId).pipe(
            tap((following: User) => following),
            catchError(err => of({ error: err.message }))
        );
    }

    @Delete('unfollow/:userId')
    @UseGuards(AuthGuard('jwt'))
    unfollow(@Param('userId') userId: string, @Req() request: Request) {
        return this.followersService.unfollow(userId, request).pipe(
            tap((deleteResult: DeleteResult) => deleteResult),
            catchError(err => of({ error: err.message }))
        );
    }
}

