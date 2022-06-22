import { Component, OnInit } from '@angular/core';
import { Route } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { SharedService } from 'src/app/services/shared.service';
import { UsersService } from 'src/app/services/users/users.service';
import { User } from '../login/model/user-interface';

@Component({
  selector: 'app-profile-routes',
  templateUrl: './profile-routes.component.html',
  styleUrls: ['./profile-routes.component.scss']
})
export class ProfileRoutesComponent implements OnInit {

  private user: User | undefined;
  private userId: string | undefined;

  constructor(
    private authService: AuthenticationService,
    private sharedService: SharedService,
    private usersService: UsersService
  ) { }

  ngOnInit(): void {
    this.userId = this.sharedService.getUserId();

    this.getUserById().subscribe({
      next: (user: User) => {
        this.user = user;
      }
    });
  }

  getUserById() {
    return this.usersService.getUserById(this.userId as string);
  }

  getCreatedRoutes() {
    if (this.isThisMyProfile()) {
      let modified = ((this.authService.getLoggedInUser().createdRoutes as Route[]).length !== ((this.user as User).createdRoutes as Route[]).length);

      if (modified) {
        //((this.user as User).createdRoutes as Route[]) = this.authService.getLoggedInUser().createdRoutes as Route[];
        this.user = this.authService.getLoggedInUser();
      }
    }

    if (this.user?.createdRoutes) {
      return (this.user as User).createdRoutes;
    }

    return [];
  }

  getLikedRoutes() {
    if (this.isThisMyProfile()) {
      let modified = (this.authService.getLoggedInUser().favouriteRoutes as Route[]).length !== ((this.user as User).favouriteRoutes as Route[]).length;

      if (modified) {
        //((this.user as User).favouriteRoutes as Route[]) = this.authService.getLoggedInUser().favouriteRoutes as Route[];
        this.user = this.authService.getLoggedInUser();
      }
    }

    if (this.user?.favouriteRoutes) {
      return (this.user as User).favouriteRoutes;
    }

    return [];
  }

  getTravelledRoutes() {
    if (this.isThisMyProfile()) {
      let modified = (this.authService.getLoggedInUser().travelledRoutes as Route[]).length !== ((this.user as User).travelledRoutes as Route[]).length;

      if (modified) {
        //((this.user as User).travelledRoutes as Route[]) = this.authService.getLoggedInUser().travelledRoutes as Route[];
        this.user = this.authService.getLoggedInUser();
      }
    }

    if (this.user?.travelledRoutes) {
      return (this.user as User).travelledRoutes;
    }

    return [];
  }

  isThisMyProfile() {
    this.checkForNewUserProfile();

    return (this.user && this.authService.isLoggedIn() && this.authService.getLoggedInUser().id === (this.user as User).id);
  }

  checkForNewUserProfile() {
    if (this.userId !== this.sharedService.getUserId()) {
      this.userId = this.sharedService.getUserId();

      this.getUserById().subscribe({
        next: (user: User) => {
          this.user = user;
        }
      });
    }
  }

}
