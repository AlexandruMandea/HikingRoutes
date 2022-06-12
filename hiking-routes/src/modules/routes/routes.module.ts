import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users/users.module';
import { MapPointEntity } from './models/map-point-entity';
import { RouteEntity } from './models/route-entity';
import { WaypointEntity } from './models/waypoint-entity';
import { RoutesController } from './routes.controller';
import { RoutesService } from './routes.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([RouteEntity]),
    TypeOrmModule.forFeature([MapPointEntity]),
    TypeOrmModule.forFeature([WaypointEntity]),
    forwardRef(() => UsersModule),
  ],
  controllers: [RoutesController],
  providers: [RoutesService],
  exports: [RoutesService]
})
export class RoutesModule { }
