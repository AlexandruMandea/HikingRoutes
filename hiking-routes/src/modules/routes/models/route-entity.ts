import { RouteUnit, TravelMode } from "src/app-constants.env";
import { UserEntity } from "src/modules/users/models/user-entity";
import { Column, CreateDateColumn, Double, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { MapPointEntity } from "./map-point-entity";
import { Route } from "./route-interface";
import { WaypointEntity } from "./waypoint-entity";

@Entity({ name: 'route' })
export class RouteEntity {
    @PrimaryColumn()
    id: string;

    // @Column({ name: 'origin_id' })
    // originID: string;

    @Column({ default: 'Route' })
    title: string;

    @Column({ default: '' })
    region: string;

    @Column({ default: '', length: 1000, name: 'search_string' })
    searchString: string;

    @OneToOne(() => MapPointEntity, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'origin_id' })
    origin: MapPointEntity;

    // @Column({ name: 'destination_id' })
    // destinationID: string;

    @OneToOne(() => MapPointEntity, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'destination_id' })
    destination: MapPointEntity;

    @OneToMany(() => WaypointEntity, (waypoint) => waypoint.route)
    waypoints: WaypointEntity[];

    @Column({ name: 'overiew_polyline', length: 2000, default: '-' })
    overviewPolyline: string;

    @Column({ type: "decimal", default: 0 })
    distance: number;

    @Column({ default: '-' })
    duration: string;

    @Column({ default: RouteUnit.METRIC })
    unit: RouteUnit;

    @Column({ name: 'total_ascending', type: "decimal", default: 0 })
    totalAscending: number;

    @Column({ name: 'total_descending', type: "decimal", default: 0 })
    totalDescending: number;

    @Column({ name: 'travel_mode', default: TravelMode.BICYCLING })
    travelMode: TravelMode;

    @Column({ default: '-' })
    warnings: string;

    @Column({ name: 'created_by', default: null })
    createdByID: string;

    @JoinColumn({ name: 'created_by' })
    @ManyToOne(() => UserEntity, (user) => user.createdRoutes, { onDelete: 'CASCADE' })
    createdBy: UserEntity;

    @Column({ name: 'is_private', default: true })
    isPrivate: boolean;

    @Column({ name: 'no_of_likes', default: 0 })
    noOfLikes: number;

    @ManyToMany((type) => UserEntity, (user) => user.favouriteRoutes, { onDelete: 'CASCADE' })
    likedRoutes: Route[];

    @ManyToMany((type) => UserEntity, (user) => user.travelledRoutes, { onDelete: 'CASCADE' })
    travelledRoutes: Route[];

    @CreateDateColumn({ name: 'created_at' })
    createdAt: string;

    @UpdateDateColumn({ name: 'updated_at', nullable: true })
    updatedAt: string;
}