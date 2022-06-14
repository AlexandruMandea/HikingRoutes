import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { Repository } from 'typeorm';
import { CreateRouteDTO } from './dto/create-route.dto';
import { RouteEntity } from './models/route-entity';
import * as uuid from 'uuid';
import { from, map, mergeMap, Observable, switchMap } from 'rxjs';
import { Route } from './models/route-interface';
import { MapPointEntity } from './models/map-point-entity';
import { MapPoint } from './models/map-point-interface';
import { WaypointEntity } from './models/waypoint-entity';
import { Waypoint } from './models/waypoint-interface';
import { IPaginationOptions, paginate, Pagination } from 'nestjs-typeorm-paginate';

@Injectable()
export class RoutesService {
    constructor(
        @InjectRepository(RouteEntity)
        private routeRepository: Repository<RouteEntity>,
        @InjectRepository(MapPointEntity)
        private mapPointRepository: Repository<MapPointEntity>,
        @InjectRepository(WaypointEntity)
        private waypointRepository: Repository<WaypointEntity>,
    ) { }

    createRoute(body: CreateRouteDTO, request: Request) {
        const routeId = uuid.v4();
        const originId = uuid.v4();
        const destinationId = uuid.v4();

        const origin: MapPoint = { ...body.origin, id: originId };
        const destination: MapPoint = { ...body.destination, id: destinationId };

        const createdRoute: Route = {
            id: routeId,
            ...body,
            title: body.title.trim(),
            origin,
            destination,
            createdByID: request.user['id']
        };

        createdRoute.waypoints.forEach(waypoint => {
            waypoint.id = uuid.v4();
            waypoint.routeId = createdRoute.id;
        });

        return from(this.mapPointRepository.save(origin)).pipe(
            mergeMap((origin) => {
                return from(this.mapPointRepository.save(destination)).pipe(
                    mergeMap((destination) => {
                        return from(this.routeRepository.save(createdRoute)).pipe(
                            map((route: Route) => {
                                this.saveWaypoints(createdRoute.waypoints, createdRoute).subscribe();
                                return route;
                            })
                        );
                    })
                )
            })
        );
    }

    saveWaypoints(waypoints: Waypoint[], route: Route) {
        waypoints.forEach(waypoint => {
            waypoint.id = uuid.v4();
            waypoint.routeId = route.id;
        });
        return from(this.waypointRepository.save(waypoints));
    }

    getAllRoutes() {
        return from(this.routeRepository.find({ relations: ['origin', 'destination', 'waypoints'] })).pipe(
            map((routes: Route[]) => routes.filter(route => !route.isPrivate))
        );
    }

    getAllRoutesPaginated(options: IPaginationOptions): Observable<Pagination<Route>> {
        const routes = this.routeRepository
            .createQueryBuilder('route')
            .select('r')
            .from(RouteEntity, 'r')
            .where(`r.is_private=0`);

        return from(paginate<RouteEntity>(routes, options)).pipe(
            map((routesPageable: Pagination<Route>) => routesPageable)
        );
    }

    getRoutesByTitleOrLocationPaginated(options: IPaginationOptions, searchString: string): Observable<Pagination<Route>> {
        if (searchString === '' || searchString === undefined) {
            searchString = '?';
        }

        const routesByTitle = this.routeRepository
            .createQueryBuilder('route')
            .select('r')
            .from(RouteEntity, 'r')
            .where(`(r.title LIKE \'%${searchString}%\' OR r.search_string LIKE \'%${searchString}%\') AND r.is_private=0`);

        return from(paginate<RouteEntity>(routesByTitle, options)).pipe(
            map((routesPageable: Pagination<Route>) => routesPageable)
        );
    }

    getRouteById(routeID: string) {
        return from(this.routeRepository.findOne({ id: routeID }, { relations: ['origin', 'destination', 'waypoints'] })).pipe(
            map((route: Route) => route)
        );
    }

    getRoutesOfAUser(userID: string) {
        return from(this.routeRepository.find({ relations: ['origin', 'destination', 'waypoints'] })).pipe(
            map((routes: Route[]) => {
                return routes.filter(route => route.createdByID === userID);
            })
        );
    }

    addLikeToRoute(routeId: string) {
        return from(this.routeRepository.findOne({ id: routeId })).pipe(
            switchMap((route: Route) => {
                ++route.noOfLikes;
                return from(this.routeRepository.save(route))
            })
        );
    }

    removeLikeFromRoute(routeId: string) {
        return from(this.routeRepository.findOne({ id: routeId })).pipe(
            switchMap((route: Route) => {
                if (route.noOfLikes > 0) --route.noOfLikes;
                return from(this.routeRepository.save(route))
            })
        );
    }

    makeRoutePublic(routeId: string, request: Request) {
        return from(this.routeRepository.findOne({ id: routeId })).pipe(
            switchMap((route: Route) => {
                if (request.user['id'] === route.createdByID) {
                    route.isPrivate = false;
                    return from(this.routeRepository.save(route))
                } else throw new UnauthorizedException('You can make public only your routes!')
            })
        );
    }

    makeRoutePrivate(routeId: string, request: Request) {
        return from(this.routeRepository.findOne({ id: routeId })).pipe(
            switchMap((route: Route) => {
                if (request.user['id'] === route.createdByID) {
                    route.isPrivate = true;
                    return from(this.routeRepository.save(route))
                } else throw new UnauthorizedException('You can make private only your routes!')
            })
        );
    }

    getTenMostAppreciatedRoutes() {
        return from(this.routeRepository.find({ where: { isPrivate: false }, order: { noOfLikes: "DESC" }, take: 10 }));
    }

    getRoutesCount() {
        return from(this.routeRepository.count());
    }

    getTotalDistance() {
        return from(this.routeRepository.find()).pipe(
            map((routes: Route[]) => {
                const totalDistance = routes.reduce((accumulator, route) => {
                    return accumulator + parseInt(route.distance.toString());
                }, 0);

                return { totalDistance: totalDistance };
            })
        );
    }

    deleteRoute(id: string, request: Request) {
        return from(this.routeRepository.delete(id));
    }
}
