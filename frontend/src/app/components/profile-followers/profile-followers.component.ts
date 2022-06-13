import { Component, OnInit } from '@angular/core';
import { trace } from 'console';
import { SharedService } from 'src/app/services/shared.service';
import { UsersService } from 'src/app/services/users/users.service';
import { Follower } from '../login/model/follower-interface';
import { User } from '../login/model/user-interface';

@Component({
  selector: 'app-profile-followers',
  templateUrl: './profile-followers.component.html',
  styleUrls: ['./profile-followers.component.scss']
})
export class ProfileFollowersComponent implements OnInit {

  private user: User | undefined;
  private userId: string = '';
  private followersAsUsers: User[] = [];

  constructor(
    private sharedService: SharedService,
    private usersService: UsersService
  ) { }

  ngOnInit(): void {
    this.userId = this.sharedService.getUserId();

    this.getUserById();

    this.getFollowersAsUsers();
  }

  getUserById() {
    return this.usersService.getUserById(this.userId as string).subscribe({
      next: (user: User) => {
        const followers = user.followers as Follower[];
        this.user = user;

        // followers.forEach(follows => {
        //   this.usersService.getFollower(follows.id as number).subscribe({
        //     next: (user) => {
        //       this.followersAsUsers.push(user);
        //     }
        //   });
        // });
      }
    });
  }

  getFollowersAsUsers() {
    this.user = this.sharedService.getUser();

    // if (this.user?.followers?.length === 0) {
    //   this.followersAsUsers = [];
    // }
    //this.followersAsUsers = [];

    this.user?.followers?.forEach(follows => {
      this.usersService.getFollower(follows.id as number).subscribe({
        next: (user) => {
          const found = this.followersAsUsers.find(u => {
            return u.id === user.id;
          })
          if (!found) {
            this.followersAsUsers.push(user);
          }
        }
      });
    });
  }

  getFollowers() {
    if (this.user?.followers?.length !== this.sharedService.getUser()?.followers?.length) this.getFollowersAsUsers();

    return this.followersAsUsers;
  }

}
