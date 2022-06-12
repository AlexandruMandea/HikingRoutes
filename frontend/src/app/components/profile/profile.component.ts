import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { of, switchMap } from 'rxjs';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { SharedService } from 'src/app/services/shared.service';
import { UsersService } from 'src/app/services/users/users.service';
import { baseServerUsersUrl, blankProfilePicture } from 'src/environments/app-constants';
import { User } from '../login/model/user-interface';
import { Route } from '../map/model/route-interface';
import { ProfilePictureDialogComponent } from '../profile-picture-dialog/profile-picture-dialog.component';
import { ProfileRoutesComponent } from '../profile-routes/profile-routes.component';
import { ProfileStatsComponent } from '../profile-stats/profile-stats.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  private userId: string = '';
  private user: User | undefined;
  private profilePic = '';
  private isMyProfile = false;
  private page = 'routes';

  constructor(
    private activatedRoute: ActivatedRoute,
    private usersService: UsersService,
    private matDialog: MatDialog,
    private authService: AuthenticationService,
    private sharedService: SharedService
  ) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.userId = params['userId'];

      this.sharedService.setUserId(params['userId']);

      this.getUserById().subscribe({
        next: (user: User) => {
          this.user = user;
        }
      });
    });
  }

  getPage() {
    switch (this.page) {
      case 'stats':
        return ProfileStatsComponent;
      default:
        return ProfileRoutesComponent;
    }
  }

  getUserById() {
    return this.usersService.getUserById(this.userId);
  }

  getUserProfilePicture() {
    const requestUrl = `${baseServerUsersUrl}/get/profile-picture/`;

    if (this.user?.profilePicture) {
      return `${requestUrl}${this.user?.profilePicture}`;
    }

    return `${requestUrl}${blankProfilePicture}`;
  }

  getUserName() {
    return this.user?.name === undefined ? '' : this.user.name;
  }

  openProfilePicDialog() {
    if (this.isThisMyProfile()) {
      const dialogRef = this.matDialog.open(ProfilePictureDialogComponent, {
        data: { image: null }
      });

      return dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.usersService.uploadProfilePicture(result.image).subscribe({
            next: () => {
              this.authService.fetchUpdatedUser().subscribe({
                next: () => this.getUserById().subscribe({
                  next: (user) => this.user = user
                })
              })
            }
          });
        }
      });
    }

    return;
  }

  isThisMyProfile() {
    return (this.user && this.authService.isLoggedIn() && this.authService.getLoggedInUser().id === (this.user as User).id);
  }

  goToRoutes() {
    this.page = 'routes';
  }

  goToStats() {
    this.page = 'stats';
  }

  // getCreatedRoutes() {

  //   if (this.isThisMyProfile()) {
  //     let modified = (this.authService.getLoggedInUser().createdRoutes as Route[]).length !== ((this.user as User).createdRoutes as Route[]).length;

  //     if (modified) {
  //       (this.user as User).createdRoutes = this.authService.getLoggedInUser().createdRoutes;
  //     }
  //   }

  //   if (this.user?.createdRoutes) {
  //     return (this.user as User).createdRoutes;
  //   }

  //   return [];
  // }

  // getLikedRoutes() {
  //   // this.getUserById().subscribe({
  //   //   next: (user: User) => {
  //   //     this.user = user;
  //   //   }
  //   // });

  //   if (this.isThisMyProfile()) {
  //     let modified = (this.authService.getLoggedInUser().favouriteRoutes as Route[]).length !== ((this.user as User).favouriteRoutes as Route[]).length;

  //     if (modified) {
  //       (this.user as User).favouriteRoutes = this.authService.getLoggedInUser().favouriteRoutes;
  //     }
  //   }

  //   if (this.user?.favouriteRoutes) {
  //     return (this.user as User).favouriteRoutes;
  //   }

  //   return [];
  // }

  // getTravelledRoutes() {

  //   if (this.isThisMyProfile()) {
  //     let modified = (this.authService.getLoggedInUser().travelledRoutes as Route[]).length !== ((this.user as User).travelledRoutes as Route[]).length;

  //     if (modified) {
  //       (this.user as User).travelledRoutes = this.authService.getLoggedInUser().travelledRoutes;
  //     }
  //   }

  //   if (this.user?.travelledRoutes) {
  //     return (this.user as User).travelledRoutes;
  //   }

  //   return [];
  // }

  // doIFollow() {
  //   if (!this.authService.isLoggedIn()) return false;

  //   this.authService.getLoggedInUser();

  //   return;
  // }
}
