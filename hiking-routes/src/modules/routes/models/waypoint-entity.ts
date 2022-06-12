import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { RouteEntity } from "./route-entity";

@Entity({ name: 'waypoint' })
export class WaypointEntity {
    @PrimaryColumn()
    id: string;

    @Column()
    lat: string;

    @Column()
    lng: string;

    @JoinColumn({ name: 'route_id' })
    @ManyToOne(() => RouteEntity, (route) => route.waypoints, { onDelete: 'CASCADE' })
    route: RouteEntity;

    @Column({ name: 'route_id', default: '-' })
    routeId: string;

    @Column()
    index: number;
}