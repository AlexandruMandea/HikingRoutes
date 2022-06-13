import { UserEntity } from "src/modules/users/models/user-entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn, Unique } from "typeorm";

@Unique(["following", "follower"])
@Entity({ name: 'follower' })
export class FollowerEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => UserEntity, user => user.followers)
    @JoinColumn({ name: 'following_id' })
    following: UserEntity;

    @Column({ name: 'following_id' })
    followingId: string;

    @ManyToOne(() => UserEntity, user => user.followings)
    @JoinColumn({ name: 'follower_id' })
    follower: UserEntity;

    @Column({ name: 'follower_id' })
    followerId: string;
}