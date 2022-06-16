import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { MapService } from 'src/app/services/map/map.service';
import { UsersService } from 'src/app/services/users/users.service';
import { Route } from '../map/model/route-interface';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  private tenMostAppreciatedRoutes: Route[] = [];
  private totalDistance = 0;
  private routesCount = 0;
  private usersCount = 0;

  private topTenRoutesSubscription$ = new Subscription
  private routesCountSubscription$ = new Subscription
  private totalDistanceSubscription$ = new Subscription
  private usersCountSubscription$ = new Subscription

  constructor(
    private mapsService: MapService,
    private usersService: UsersService
  ) { }

  ngOnInit(): void {
    this.topTenRoutesSubscription$ = this.mapsService.getTenMostAppreciatedRoutes().subscribe({
      next: (routes: Route[]) => {
        this.tenMostAppreciatedRoutes = routes;
      }
    });

    this.routesCountSubscription$ = this.mapsService.getRoutesCount().subscribe({
      next: (count: number) => {
        this.routesCount = count;
      }
    });

    this.totalDistanceSubscription$ = this.mapsService.getTotalDistance().subscribe({
      next: (count: { totalDistance: number }) => {
        this.totalDistance = count.totalDistance;
      }
    });

    this.usersCountSubscription$ = this.usersService.getUsersCount().subscribe({
      next: (count: number) => {
        this.usersCount = count;
      }
    });
  }

  ngOnDestroy(): void {
    this.topTenRoutesSubscription$.unsubscribe();
    this.routesCountSubscription$.unsubscribe();
    this.totalDistanceSubscription$.unsubscribe();
    this.usersCountSubscription$.unsubscribe();
  }

  getTenMostAppreciatedRoutes() {
    return this.tenMostAppreciatedRoutes;
  }

  getRoutesCount() { return this.routesCount; }

  getTotalDistance() { return this.totalDistance; }

  getUsersCount() { return this.usersCount; }

}
