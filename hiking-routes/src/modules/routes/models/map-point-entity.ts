import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity({ name: 'map_point' })
export class MapPointEntity {
    @PrimaryColumn()
    id: string;

    @Column()
    lat: string;

    @Column()
    lng: string;
}