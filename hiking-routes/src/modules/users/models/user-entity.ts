import { UserRole } from "src/app-constants.env";
import { FollowerEntity } from "src/modules/followers/model/follower-entity";
import { RouteEntity } from "src/modules/routes/models/route-entity";
import { SALT } from "src/secrets.env";
import { BeforeInsert, Column, CreateDateColumn, Entity, JoinTable, ManyToMany, OneToMany, PrimaryColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: 'user' })
export class UserEntity {
    @PrimaryColumn()
    id: string;

    @Column()
    name: string;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column({ default: SALT })
    salt: string;

    @Column({ default: UserRole.USER })
    role: UserRole;

    @Column({ name: 'profile_picture', default: 'blank-profile-picture.jpg' })
    profilePicture: string;

    @Column({ default: false })
    verified: boolean;

    @OneToMany(() => RouteEntity, (route) => route.createdBy)
    createdRoutes: RouteEntity[];

    @ManyToMany(() => RouteEntity, (route) => route.likedRoutes, {
        cascade: true,
    })
    @JoinTable({
        name: 'likes',
        joinColumn: {
            name: 'user_id',
            referencedColumnName: 'id'
        },
        inverseJoinColumn: {
            name: 'route_id',
            referencedColumnName: 'id'
        }
    })
    favouriteRoutes: RouteEntity[];

    @ManyToMany((type) => RouteEntity, (route) => route.travelledRoutes, {
        cascade: true,
    })
    @JoinTable({
        name: 'travelled_routes',
        joinColumn: {
            name: 'user_id',
            referencedColumnName: 'id'
        },
        inverseJoinColumn: {
            name: 'route_id',
            referencedColumnName: 'id'
        }
    })
    travelledRoutes: RouteEntity[];

    @OneToMany(() => FollowerEntity, follows => follows.follower)
    followings: FollowerEntity[];

    @OneToMany(() => FollowerEntity, follows => follows.following)
    followers: FollowerEntity[];

    @CreateDateColumn({ name: 'created_at' })
    createdAt: string;

    @UpdateDateColumn({ name: 'updated_at', nullable: true })
    updatedAt: string;

    @BeforeInsert()
    emailToLowerCase() {
        this.email = this.email.toLowerCase();
    }
}