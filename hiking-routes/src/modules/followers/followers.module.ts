import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FollowersController } from './followers.controller';
import { FollowersService } from './followers.service';
import { FollowerEntity } from './model/follower-entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([FollowerEntity]),
  ],
  controllers: [FollowersController],
  providers: [FollowersService]
})
export class FollowersModule { }
