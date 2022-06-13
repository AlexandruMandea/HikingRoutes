import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { from, map } from 'rxjs';
import { Repository } from 'typeorm';
import { FollowerEntity } from './model/follower-entity';

@Injectable()
export class FollowersService {
    constructor(
        @InjectRepository(FollowerEntity)
        private followersRepository: Repository<FollowerEntity>,
    ) { }

    follow(userId: string, request: Request) {
        return from(this.followersRepository.save({ following: { id: userId }, follower: { id: request.user['id'] } }));
    }

    getFollowerAsUser(follows: number) {
        return from(this.followersRepository.findOne({ id: follows }, { relations: ['follower'] })).pipe(
            map(follows => {
                delete (follows.follower.password);
                return follows.follower;
            })
        );
    }

    getFollowingAsUser(follows: number) {
        return from(this.followersRepository.findOne({ id: follows }, { relations: ['following'] })).pipe(
            map(follows => {
                delete (follows.following.password);
                return follows.following;
            })
        );
    }

    unfollow(userId: string, request: Request) {
        return from(this.followersRepository.delete({ following: { id: userId }, follower: { id: request.user['id'] } }));
    }
}
