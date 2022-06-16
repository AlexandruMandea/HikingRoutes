import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { MapService } from 'src/app/services/map/map.service';
import { SharedService } from 'src/app/services/shared.service';
import { UsersService } from 'src/app/services/users/users.service';
import { TravelMode } from 'src/environments/app-constants';
import { User } from '../login/model/user-interface';
import { Route } from '../map/model/route-interface';

@Component({
  selector: 'app-profile-stats',
  templateUrl: './profile-stats.component.html',
  styleUrls: ['./profile-stats.component.scss']
})
export class ProfileStatsComponent implements OnInit, OnDestroy {
  private user: User | undefined;
  private userId: string = '';

  private totalDistanceRidden: number = 0;
  private totalDistanceWalked: number = 0;
  private totalDistanceClimbedByBike: number = 0;
  private totalDistanceClimbedByFeet: number = 0;
  private routesCreated: number = 0;
  private memberSince: string = '';

  private getUserSubscription1$ = new Subscription;
  private getUserSubscription2$ = new Subscription;

  constructor(
    private authService: AuthenticationService,
    private sharedService: SharedService,
    private usersService: UsersService,
    private mapService: MapService
  ) { }



  ngOnInit(): void {
    this.userId = this.sharedService.getUserId();

    this.getUserSubscription1$ = this.getUserById().subscribe({
      next: (user: User) => {
        this.user = user;

        this.routesCreated = (user.createdRoutes as Route[]).length;
        this.memberSince = user.createdAt as string;

        this.calculateStats();
      }
    });
  }

  ngOnDestroy(): void {
    this.getUserSubscription1$.unsubscribe();
    this.getUserSubscription2$.unsubscribe();
  }



  getUserById() {
    return this.usersService.getUserById(this.userId as string);
  }

  getTotalDistanceRidden() {
    this.checkForNewUserProfile();

    return this.totalDistanceRidden;
  }

  getTotalDistanceWalked() {
    return this.totalDistanceWalked;
  }

  getTotalDistanceClimbedByBike() {
    return (this.totalDistanceClimbedByBike / 1000).toFixed(1);
  }

  getTotalDistanceClimbedByFeet() {
    return (this.totalDistanceClimbedByFeet / 1000).toFixed(1);
  }

  getNoOfRoutesCreated() {
    return this.routesCreated;
  }

  getMemberSince() {
    return this.memberSince.split('T', 1)[0];
  }



  calculateStats() {
    if (this.user) {
      (this.user.travelledRoutes as Route[]).forEach(route => {
        const points = this.mapService.decodePolyline(route.overviewPolyline as string);

        switch (route.travelMode) {
          case TravelMode.BICYCLING:
            this.totalDistanceRidden += parseInt((route.distance as number).toString());

            this.totalDistanceClimbedByBike += parseInt((route.totalAscending as number).toString());

            //this.getRouteElevation(points, TravelMode.BICYCLING);

            break;
          case TravelMode.WALKING:
            this.totalDistanceWalked += parseInt((route.distance as number).toString());

            this.totalDistanceClimbedByFeet += parseInt((route.totalAscending as number).toString());

            //this.getRouteElevation(points, TravelMode.WALKING);

            break
        }
      });
    }
  }



  checkForNewUserProfile() {
    if (this.userId !== this.sharedService.getUserId()) {
      this.userId = this.sharedService.getUserId();

      this.getUserSubscription2$.unsubscribe();
      this.getUserSubscription2$ = this.getUserById().subscribe({
        next: (user: User) => {
          this.user = user;
        }
      });
    }
  }



  // getRouteElevation(overview_path: any[], travelMode: TravelMode) {
  //   let latlngObjects = []

  //   for (let index = 0; index < overview_path.length; index++) {
  //     latlngObjects.push({ lat: overview_path[index].latitude, lng: overview_path[index].longitude });
  //   }

  //   this.elevator.getElevationForLocations({
  //     locations: latlngObjects,
  //   }, (results) => {
  //     if (results) {
  //       switch (travelMode) {
  //         case TravelMode.BICYCLING:
  //           this.totalDistanceClimbedByBike += parseFloat(this.mapService.calculateTotalDistanceOfAscending(results).toString()) / 1000;
  //           break;
  //         case TravelMode.WALKING:
  //           this.totalDistanceClimbedByFeet += parseFloat(this.mapService.calculateTotalDistanceOfAscending(results).toString()) / 1000;
  //           break
  //       }
  //     }
  //   });
  // }
}
