import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RoutesService } from './routes.service';
import { Request } from 'express';
import { CreateRouteDTO } from './dto/create-route.dto';
import { AuthGuard } from '@nestjs/passport';
import { catchError, from, map, Observable, of, tap } from 'rxjs';
import { Route } from './models/route-interface';
import { RouteEntity } from './models/route-entity';
import { Pagination } from 'nestjs-typeorm-paginate';
import { AllowAny } from '../authentication/decorators/allow-any-decorator';
import { DeleteResult } from 'typeorm';

@Controller('routes')
@ApiTags('routes')
@ApiBearerAuth()
export class RoutesController {
    constructor(
        private readonly routesService: RoutesService
    ) { }

    @Post('/create-route')
    @UseGuards(AuthGuard('jwt'))
    createRoute(@Body() body: CreateRouteDTO, @Req() request: Request) {
        return this.routesService.createRoute(body, request).pipe(
            tap((createdRoute: Route) => createdRoute),
            catchError(error => of({ error: error.message }))
        );
    }

    @Get('/get-all-routes')
    @AllowAny()
    getAllRoutes() {
        return this.routesService.getAllRoutes().pipe(
            tap((routes: Route[]) => routes),
            catchError(error => of({ error: error.message }))
        );
    }

    @Get('/get-all-routes-paginated')
    @AllowAny()
    getAllRoutesPaginated(@Query('page') page: number = 1, @Query('limit') limit: number = 10): Observable<Pagination<Route>> {
        limit = limit > 100 ? 100 : limit;
        limit = limit < 0 ? 10 : limit;
        page = page < 1 ? 1 : page;

        return this.routesService.getAllRoutesPaginated({ page, limit, route: 'http://localhost:3000/hiking-routes/routes/get-all-routes-paginated' });
    }

    @Get('/get-routes-by-title-or-location-paginated/search_string=:searchString')
    @AllowAny()
    getRoutesByTitleOrLocationPaginated(@Query('page') page: number = 1, @Query('limit') limit: number = 10, @Param('searchString') searchString: string): Observable<Pagination<Route>> {
        limit = limit > 100 ? 100 : limit;
        limit = limit < 0 ? 10 : limit;
        page = page < 1 ? 1 : page;

        return this.routesService.getRoutesByTitleOrLocationPaginated({ page, limit, route: 'http://localhost:3000/hiking-routes/routes/get-all-routes-paginated' }, searchString);
    }

    @Get('/get/id=:id')
    @AllowAny()
    getRouteById(@Param('id') routeID: string) {
        return this.routesService.getRouteById(routeID).pipe(
            tap((route: Route) => route),
            catchError(error => of({ error: error.message }))
        );
    }

    @Get('/get/userId=:userId')
    @AllowAny()
    getRoutesOfAUser(@Param('userId') userID: string) {
        return this.routesService.getRoutesOfAUser(userID).pipe(
            tap((routes: Route[]) => routes),
            catchError(error => of({ error: error.message }))
        );
    }

    @Put('/make-public/id=:routeId')
    @UseGuards(AuthGuard('jwt'))
    makeRoutePublic(@Param('routeId') routeID: string, @Req() request: Request) {
        return this.routesService.makeRoutePublic(routeID, request).pipe(
            tap((route: Route) => route),
            catchError(error => of({ error: error.message }))
        );
    }

    @Put('/make-private/id=:routeId')
    @UseGuards(AuthGuard('jwt'))
    makeRoutePrivate(@Param('routeId') routeID: string, @Req() request: Request) {
        return this.routesService.makeRoutePrivate(routeID, request).pipe(
            tap((route: Route) => route),
            catchError(error => of({ error: error.message }))
        );
    }

    @Delete('/delete/routeId=:routeId')
    @UseGuards(AuthGuard('jwt'))
    deleteRoute(@Param('routeId') routeID: string, @Req() request: Request) {
        return this.routesService.deleteRoute(routeID, request).pipe(
            tap((result: any) => result),
            catchError(error => of({ error: error.message }))
        );
    }

    @Get('/likes:routeId')
    @AllowAny()
    getNoOfLikes(@Param('routeId') routeId: string) {
        // return this.routesService.getNoOfLikes(routeId).pipe(
        //     tap((noOfLikes: number) => noOfLikes),
        //     catchError(error => of({ error: error.message }))
        // );
    }
}
