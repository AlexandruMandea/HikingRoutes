import { Component, OnInit } from '@angular/core';
import { MapService } from 'src/app/services/map/map.service';
import { UsersService } from 'src/app/services/users/users.service';
import { Route } from '../map/model/route-interface';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  private tenMostAppreciatedRoutes: Route[] = [];
  private totalDistance = 0;
  private routesCount = 0;
  private usersCount = 0;

  constructor(
    private mapsService: MapService,
    private usersService: UsersService
  ) { }

  ngOnInit(): void {
    this.mapsService.getTenMostAppreciatedRoutes().subscribe({
      next: (routes: Route[]) => {
        this.tenMostAppreciatedRoutes = routes;
      }
    });

    this.mapsService.getRoutesCount().subscribe({
      next: (count: number) => {
        this.routesCount = count;
      }
    });

    this.mapsService.getTotalDistance().subscribe({
      next: (count: { totalDistance: number }) => {
        this.totalDistance = count.totalDistance;
      }
    });

    this.usersService.getUsersCount().subscribe({
      next: (count: number) => {
        this.usersCount = count;
      }
    });
  }

  getTenMostAppreciatedRoutes() {
    return this.tenMostAppreciatedRoutes;
  }

  getRoutesCount() { return this.routesCount; }

  getTotalDistance() { return this.totalDistance; }

  getUsersCount() { return this.usersCount; }

}
