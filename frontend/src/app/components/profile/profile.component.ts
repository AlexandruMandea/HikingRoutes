import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { SharedService } from 'src/app/services/shared.service';
import { UsersService } from 'src/app/services/users/users.service';
import { baseServerUsersUrl, blankProfilePicture, profileFollowersComponent, profileFollowingsComponent, profileRoutesComponent, profileStatsComponent } from 'src/environments/app-constants';
import { Follower } from '../login/model/follower-interface';
import { User } from '../login/model/user-interface';
import { ProfileFollowersComponent } from '../profile-followers/profile-followers.component';
import { ProfileFollowingsComponent } from '../profile-followings/profile-followings.component';
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
  private page = '';

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

      this.page = profileRoutesComponent;

      this.sharedService.setUserId(params['userId']);

      this.getUserById().subscribe({
        next: (user: User) => {
          this.user = user;
          this.sharedService.setUser(this.user);
        }
      });
    });
  }



  getPage() {
    switch (this.page) {
      case profileStatsComponent:
        return ProfileStatsComponent;

      case profileFollowersComponent:
        return ProfileFollowersComponent;

      case profileFollowingsComponent:
        return ProfileFollowingsComponent

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



  follow() {
    let updatedLoggedInUser = this.authService.getLoggedInUser();

    this.usersService.follow(this.userId).subscribe({
      next: (follows) => {
        (updatedLoggedInUser.followings as Follower[]).push(follows);

        ((this.user as User).followers as Follower[]).push(follows);

        this.sharedService.setUser(this.user);
        this.authService.updateLoggedInUserFromLocalStorage(updatedLoggedInUser);
      }
    });
  }

  unfollow() {
    let updatedLoggedInUser = this.authService.getLoggedInUser();

    const followsFromLoggedInUser = (updatedLoggedInUser.followings as Follower[]).find(f => {
      return (f.followerId === updatedLoggedInUser.id && f.followingId === this.userId);
    });
    const followsFromThisDotUser = ((this.user as User).followers as Follower[]).find(f => {
      return (f.followerId === updatedLoggedInUser.id && f.followingId === this.userId);
    });

    const positionForLoggedInUser = (updatedLoggedInUser.followings as Follower[]).indexOf(followsFromLoggedInUser as Follower);
    const positionForThisDotUser = ((this.user as User).followers as Follower[]).indexOf(followsFromThisDotUser as Follower);

    (updatedLoggedInUser.followings as Follower[]).splice(positionForLoggedInUser, 1);

    ((this.user as User).followers as Follower[]).splice(positionForThisDotUser, 1);

    this.sharedService.setUser(this.user);
    this.authService.updateLoggedInUserFromLocalStorage(updatedLoggedInUser);

    this.usersService.unfollow(this.userId).subscribe({
      next: () => {
      }
    });

    // location.reload();
  }



  isThisMyProfile() {
    return (this.user && this.authService.isLoggedIn() && this.authService.getLoggedInUser().id === (this.user as User).id);
  }

  doIFollow() {
    if (!this.authService.isLoggedIn()) return false;

    const foundfollower = (this.authService.getLoggedInUser().followings as Follower[]).find(follows => {
      return follows.followingId === this.userId;
    });

    if (foundfollower) return true;

    return false;
  }

  isAuthenticated() {
    return this.authService.isLoggedIn();
  }



  goToRoutes() {
    this.page = profileRoutesComponent;
  }

  goToFollowers() {
    this.page = profileFollowersComponent;
  }

  goToFollowings() {
    this.page = profileFollowingsComponent;
  }

  goToStats() {
    this.page = profileStatsComponent;
  }
}
