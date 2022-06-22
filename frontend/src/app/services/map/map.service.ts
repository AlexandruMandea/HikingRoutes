import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Pagination } from 'nestjs-typeorm-paginate';
import { catchError, map, Observable, throwError } from 'rxjs';
import { User } from 'src/app/components/login/model/user-interface';
import { Route } from 'src/app/components/map/model/route-interface';
import { baseServerRoutesUrl, baseServerUsersUrl } from 'src/environments/app-constants';
import { AuthenticationService } from '../authentication/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class MapService {
  private routeForTemplate: Route | undefined;

  constructor(
    private http: HttpClient,
    private authService: AuthenticationService
  ) { }

  handleError(error: HttpErrorResponse): Observable<never> {
    console.log(error);
    return throwError(() => {
      return error;
    });
  }

  postRoute(route: Route) {
    return this.http.post<any>(`${baseServerRoutesUrl}/create-route`, route).pipe(
      map(r => r),
      catchError(this.handleError)
    );
  }

  getRouteById(routeId: string) {
    return this.http.get<Route>(`${baseServerRoutesUrl}/get/id=${routeId}`).pipe(
      map(r => r),
      catchError(this.handleError)
    );
  }

  getAllRoutes() {
    return this.http.get<Route[]>(`${baseServerRoutesUrl}/get-all-routes`).pipe(
      map(r => r),
      catchError(this.handleError)
    );
  }

  getAllRoutesPaginated(options: { page?: number, limit?: number }) {//de paginat?
    options.page = options.page ? options.page : 1;
    options.limit = options.limit ? options.limit : 10;

    return this.http.get<Pagination<Route>>(`${baseServerRoutesUrl}/get-all-routes-paginated?page=${options.page}&limit=${options.limit}`).pipe(
      map(r => r),
      catchError(this.handleError)
    );
  }

  getRoutesByTitleOrLocation(searchString: string, options: { page?: number, limit?: number }) {
    options.page = options.page ? options.page : 1;
    options.limit = options.limit ? options.limit : 10;

    return this.http.get<Pagination<Route>>(`${baseServerRoutesUrl}/get-routes-by-title-or-location-paginated/search_string=${searchString}?&page=${options.page}&limit=${options.limit}`).pipe(
      map(r => r),
      catchError(this.handleError)
    );
  }

  getLikesOfRoute(routeId: string) {
    return this.http.get<number>(`${baseServerRoutesUrl}/likes/${routeId}`).pipe(
      map(r => r),
      catchError(this.handleError)
    );
  }

  addRouteToFavorite(route: Route) {
    // let loggedInUser = this.authService.getLoggedInUser() as User;

    // (loggedInUser.favouriteRoutes as Route[]).push(route);

    //this.authService.updateLoggedInUserFromLocalStorage(loggedInUser);

    return this.http.post<any>(`${baseServerUsersUrl}/add-route-to-favourites/routeId=${route.id}`, {}).pipe(
      map(r => r),
      catchError(this.handleError)
    );
  }

  removeRouteFromFavorite(route: Route) {
    // let loggedInUser = this.authService.getLoggedInUser() as User;

    // this.arrayRemove(loggedInUser.favouriteRoutes as Route[], route);

    //this.authService.updateLoggedInUserFromLocalStorage(loggedInUser);

    return this.http.post<any>(`${baseServerUsersUrl}/remove-from-favourites/routeId=${route.id}`, {}).pipe(
      map(r => r),
      catchError(this.handleError)
    );
  }

  addToTravelled(route: Route) {
    // let loggedInUser = this.authService.getLoggedInUser() as User;

    // (loggedInUser.travelledRoutes as Route[]).push(route);

    //this.authService.updateLoggedInUserFromLocalStorage(loggedInUser);

    return this.http.post<any>(`${baseServerUsersUrl}/add-to-travelled/routeId=${route.id}`, {}).pipe(
      map(r => r),
      catchError(this.handleError)
    );
  }

  removeFromTravelled(route: Route) {
    // let loggedInUser = this.authService.getLoggedInUser() as User;

    // this.arrayRemove(loggedInUser.travelledRoutes as Route[], route);

    //this.authService.updateLoggedInUserFromLocalStorage(loggedInUser);

    return this.http.post<any>(`${baseServerUsersUrl}/remove-from-travelled/routeId=${route.id}`, {}).pipe(
      map(r => r),
      catchError(this.handleError)
    );
  }

  makePublic(route: Route) {
    // let loggedInUser = this.authService.getLoggedInUser() as User;

    // let index: number = (loggedInUser.createdRoutes as Route[]).map(r => r.id).indexOf(route.id) as number;
    // (loggedInUser.createdRoutes as Route[])[index].isPrivate = false;

    // index = (loggedInUser.favouriteRoutes as Route[]).map(r => r.id).indexOf(route.id) as number;
    // if (index >= 0) {
    //   (loggedInUser.favouriteRoutes as Route[])[index].isPrivate = false;
    // }

    // index = (loggedInUser.travelledRoutes as Route[]).map(r => r.id).indexOf(route.id) as number;
    // if (index >= 0) {
    //   (loggedInUser.travelledRoutes as Route[])[index].isPrivate = false;
    // }

    // this.authService.updateLoggedInUserFromLocalStorage(loggedInUser);

    return this.http.put<any>(`${baseServerRoutesUrl}/make-public/id=${route.id}`, {}).pipe(
      map(result => result),
      catchError(this.handleError)
    );
  }

  makePrivate(route: Route) {
    let loggedInUser = this.authService.getLoggedInUser() as User;

    let index: number = (loggedInUser.createdRoutes as Route[]).map(r => r.id).indexOf(route.id) as number;
    (loggedInUser.createdRoutes as Route[])[index].isPrivate = true;

    index = (loggedInUser.favouriteRoutes as Route[]).map(r => r.id).indexOf(route.id) as number;
    if (index >= 0) {
      (loggedInUser.favouriteRoutes as Route[])[index].isPrivate = true;
    }

    index = (loggedInUser.travelledRoutes as Route[]).map(r => r.id).indexOf(route.id) as number;
    if (index >= 0) {
      (loggedInUser.travelledRoutes as Route[])[index].isPrivate = true;
    }

    this.authService.updateLoggedInUserFromLocalStorage(loggedInUser);

    return this.http.put<any>(`${baseServerRoutesUrl}/make-private/id=${route.id}`, {}).pipe(
      map(result => result),
      catchError(this.handleError)
    );
  }

  getTenMostAppreciatedRoutes() {
    return this.http.get<Route[]>(`${baseServerRoutesUrl}/get/ten-most-appreciated`).pipe(
      map((routes: Route[]) => routes),
      catchError(this.handleError)
    );
  }

  getRoutesCount() {
    return this.http.get<number>(`${baseServerRoutesUrl}/get/routes-count`).pipe(
      map((count: number) => count),
      catchError(this.handleError)
    );
  }

  getTotalDistance() {
    return this.http.get<{ totalDistance: number }>(`${baseServerRoutesUrl}/get/total-distance`).pipe(
      map((count: { totalDistance: number }) => count),
      catchError(this.handleError)
    );
  }

  deleteRoute(route: Route) {
    let user = this.authService.getLoggedInUser() as User;

    this.arrayRemove(user.createdRoutes as Route[], route);
    this.arrayRemove(user.favouriteRoutes as Route[], route);
    this.arrayRemove(user.travelledRoutes as Route[], route);

    this.authService.updateLoggedInUserFromLocalStorage(user);

    return this.http.delete<any>(`${baseServerRoutesUrl}/delete/routeId=${route.id}`, {}).pipe(
      map(result => result),
      catchError(this.handleError)
    );
  }

  isRouteLikedByLoggedInUser(routeId: string) {
    //let foundRoute: Route | undefined = undefined;

    // this.authService.getLoggedInUser().subscribe({
    //   next: (user: User) => {
    //     foundRoute = ((user as User).favouriteRoutes as Route[]).find(route => {
    //       return route.id === routeId;
    //     });
    //   },
    //   error: (error) => {
    //     console.log(error);
    //   }
    // });

    let foundRoute = undefined;

    if (this.authService.isLoggedIn()) {
      foundRoute = (this.authService.getLoggedInUser().favouriteRoutes as Route[]).find(route => {
        return route.id === routeId;
      });
    }

    return foundRoute !== undefined;
  }

  isRouteTravelledByLoggedInUser(routeId: string) {
    let foundRoute = undefined;

    if (this.authService.isLoggedIn()) {
      foundRoute = (this.authService.getLoggedInUser().travelledRoutes as Route[]).find(route => {
        return route.id === routeId;
      });
    }

    return foundRoute !== undefined;
  }

  isRouteCreatedByLoggedInUser(routeId: string) {
    let foundRoute = undefined;

    if (this.authService.isLoggedIn()) {
      foundRoute = (this.authService.getLoggedInUser().createdRoutes as Route[]).find(route => {
        return route.id === routeId;
      });
    }

    return foundRoute !== undefined;
  }

  getRouteForTemplate() { return this.routeForTemplate; }

  setRouteForTemplate(route: Route | undefined) { this.routeForTemplate = route; }

  calculateTotalDistanceOfAscending(elevationResults: google.maps.ElevationResult[]) {
    let metersClimbed = 0;

    for (let index = 1; index < elevationResults.length; index++) {
      if (elevationResults[index].elevation > elevationResults[index - 1].elevation) {
        metersClimbed += elevationResults[index].elevation - elevationResults[index - 1].elevation;
      }
    }

    return metersClimbed;
  }

  calculateTotalDistanceOfDescending(elevationResults: google.maps.ElevationResult[]) {
    let metersDescended = 0;

    for (let index = 1; index < elevationResults.length; index++) {
      if (elevationResults[index].elevation < elevationResults[index - 1].elevation) {
        metersDescended += elevationResults[index - 1].elevation - elevationResults[index].elevation;
      }
    }

    return metersDescended;
  }

  arrayRemove(array: Route[], value: Route) {
    const index = array.map(r => r.id).indexOf(value.id);

    if (index > -1) {
      array.splice(index, 1);
    }
  }

  decodePolyline(polyline: string) {
    var points = []
    var index = 0, len = polyline.length;
    var lat = 0, lng = 0;

    while (index < len) {
      var b, shift = 0, result = 0;

      do {
        b = polyline.charAt(index++).charCodeAt(0) - 63;//finds ascii                                                                                    //and substract it by 63
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);

      var dlat = ((result & 1) != 0 ? ~(result >> 1) : (result >> 1));
      lat += dlat;
      shift = 0;
      result = 0;

      do {
        b = polyline.charAt(index++).charCodeAt(0) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);

      var dlng = ((result & 1) != 0 ? ~(result >> 1) : (result >> 1));
      lng += dlng;

      points.push({ latitude: (lat / 1E5), longitude: (lng / 1E5) });
    }

    return points;
  }
}
