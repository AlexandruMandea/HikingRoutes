import { Component, OnInit } from '@angular/core';
import { SharedService } from 'src/app/services/shared.service';
import { UsersService } from 'src/app/services/users/users.service';
import { Follower } from '../login/model/follower-interface';
import { User } from '../login/model/user-interface';

@Component({
  selector: 'app-profile-followings',
  templateUrl: './profile-followings.component.html',
  styleUrls: ['./profile-followings.component.scss']
})
export class ProfileFollowingsComponent implements OnInit {

  private userId: string = '';
  private followingsAsUsers: User[] = [];

  constructor(
    private sharedService: SharedService,
    private usersService: UsersService
  ) { }

  ngOnInit(): void {
    this.userId = this.sharedService.getUserId();

    this.getUserById().subscribe({
      next: (user: User) => {
        const followings = user.followings as Follower[];

        followings.forEach(follows => {
          this.usersService.getFollowing(follows.id as number).subscribe({
            next: (user) => {
              this.followingsAsUsers.push(user);
            }
          });
        });
      }
    });
  }

  getUserById() {
    return this.usersService.getUserById(this.userId as string);
  }

  getFollowings() {
    return this.followingsAsUsers;
  }


}
