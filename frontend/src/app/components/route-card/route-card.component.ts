import { AfterViewInit, Component, OnInit, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { MapService } from 'src/app/services/map/map.service';
import { UsersService } from 'src/app/services/users/users.service';
import { baseServerUsersUrl, blankProfilePicture, UserRole } from 'src/environments/app-constants';
import { GOOGLE_API_KEY } from 'src/environments/app-secrets';
import { DeleteDialogComponent } from '../delete-dialog/delete-dialog.component';
import { User } from '../login/model/user-interface';
import { Route } from '../map/model/route-interface';

@Component({
  selector: 'app-route-card',
  templateUrl: './route-card.component.html',
  styleUrls: ['./route-card.component.scss']
})
export class RouteCardComponent implements OnInit, AfterViewInit {

  @Input() route: Route = {}; //origin: { lat: '51.50717', lng: '-0.12756' }, destination: { lat: '51.75202', lng: '-1.25771' }

  private creator: User | undefined = undefined;

  private liked = false;
  private travelled = false;
  private mine = false;
  private amIAnAdmin = false;

  private readonly staticMapSettings = 'https://maps.googleapis.com/maps/api/staticmap?size=500x300&path=enc:'
  private readonly apiKey = `&key=${GOOGLE_API_KEY}`;
  private readonly originMarkerStyle = '&markers=color:green%7Clabel:O%7C';
  private readonly destinationMarkerStyle = '&markers=color:red%7Clabel:D%7C';

  constructor(
    private mapService: MapService,
    private authService: AuthenticationService,
    private matDialog: MatDialog,
    private usersService: UsersService,
  ) { }

  ngOnInit(): void {
    this.liked = this.mapService.isRouteLikedByLoggedInUser(this.route.id as string);
    this.travelled = this.mapService.isRouteTravelledByLoggedInUser(this.route.id as string);
    this.mine = this.mapService.isRouteCreatedByLoggedInUser(this.route.id as string);
    this.amIAnAdmin = (this.authService.isLoggedIn() &&
      this.authService.getLoggedInUser().role == UserRole.ADMIN) ?
      true : false;

    this.usersService.getUserById(this.route.createdByID as string).subscribe({
      next: (user: User) => {
        this.creator = user;
      },
      error: (error) => { console.log(error); }
    });
  }

  ngAfterViewInit(): void {

  }

  getStaticMapImageSrc() {
    const polyline = (this.route.overviewPolyline as string).replace('/\\/', '\\\\');

    const bounds = this.getOriginAndDestinationFromPolyline(polyline);
    const origin = bounds.origin;
    const destination = bounds.destination;

    const originMarkerString = `${this.originMarkerStyle}${origin.lat},${origin.lng}`;
    const destinationMarkerString = `${this.destinationMarkerStyle}${destination.lat},${destination.lng}`;

    return `${this.staticMapSettings}${polyline}${originMarkerString}${destinationMarkerString}${this.apiKey}`;
  }

  getOriginAndDestinationFromPolyline(polyline: string) {
    const points = this.mapService.decodePolyline(polyline);

    const origin = { lat: points[0].latitude, lng: points[0].longitude };
    const destination = { lat: points[points.length - 1].latitude, lng: points[points.length - 1].longitude };

    return { origin, destination };
  }

  addToFavorites() {
    ((this.route as Route).noOfLikes as number) += 1;

    this.mapService.addRouteToFavorite(this.route as Route).subscribe({
      next: () => { },
      error: (error) => {
        console.log(error);
      }
    });

    this.liked = true;
  }

  removeFromFavorites() {
    if (((this.route as Route).noOfLikes as number) > 0) {
      ((this.route as Route).noOfLikes as number) -= 1;

      this.mapService.removeRouteFromFavorite(this.route as Route).subscribe({
        next: () => { },
        error: (error) => {
          console.log(error);
        }
      });
    }

    this.liked = false;
  }

  addToTravelled() {
    this.mapService.addToTravelled(this.route as Route).subscribe({
      next: () => { },
      error: (error) => {
        console.log(error);
      }
    });

    this.travelled = true;
  }

  removeFromTravelled() {
    this.mapService.removeFromTravelled(this.route as Route).subscribe({
      next: () => { },
      error: (error) => {
        console.log(error);
      }
    });

    this.travelled = false;
  }

  makePublic() {
    this.mapService.makePublic(this.route as Route).subscribe({
      next: () => { },
      error: (error) => {
        console.log(error);
      }
    });

    //location.reload();
    this.route.isPrivate = false;
  }

  makePrivate() {
    this.mapService.makePrivate(this.route as Route).subscribe({
      next: () => { },
      error: (error) => {
        console.log(error);
      }
    });

    //location.reload();
    this.route.isPrivate = true;
  }

  deleteRoute() {
    const dialogRef = this.matDialog.open(DeleteDialogComponent, {
      data: { answer: 'no' }
    });

    return dialogRef.afterClosed().subscribe(answer => {
      if (answer) {
        this.mapService.deleteRoute(this.route).subscribe({
          next: () => { },
          error: (error) => { console.log(error); }
        });
      }
    });
  }

  useRouteAsTemplate() { this.mapService.setRouteForTemplate(this.route); }

  getCreatorSProfilePic() {
    if (this.creator) {
      return `${baseServerUsersUrl}/get/profile-picture/${this.creator.profilePicture}`;
    }

    return `${baseServerUsersUrl}/get/profile-picture/${blankProfilePicture}`;
  }

  getCreatorSId() {
    if (this.creator) return this.creator.id;

    return '';
  }

  isLiked() { return this.liked; }

  isTravelled() { return this.travelled; }

  isMine() { return this.mine; }

  amIAdmin() { return this.amIAnAdmin; }

  isPrivate() { return this.route.isPrivate; }

  isAuthenticated() { return this.authService.isLoggedIn(); }

  getRouteTitle() { return this.route.title; }

  getRouteDistance() { return this.route.distance; }

  getRouteDuration() { return this.route.duration }

  getRouteTravelMode() { return (this.route.travelMode as string).toLowerCase() }

  getRouteRegion() { return this.route.region; }

  getNoOfLikes() { return this.route.noOfLikes; }
}
