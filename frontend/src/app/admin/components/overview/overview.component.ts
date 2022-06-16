import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/components/login/model/user-interface';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { UsersService } from 'src/app/services/users/users.service';
import { baseServerUsersUrl, blankProfilePicture } from 'src/environments/app-constants';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {

  private userId: string = '';
  private user: User | undefined;

  private users: User[] = []
  private usersIds: string[] = [];
  private readonly limit = 2;
  private page = 0;
  private hasFinished = false;

  constructor(
    private authService: AuthenticationService,
    private router: Router,
    private usersservice: UsersService,
  ) { }

  ngOnInit(): void {
    this.user = this.authService.getLoggedInUser();
    this.renderAllUsers();
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

  renderAllUsers() {
    if (this.hasFinished) {
      this.usersIds.splice(0, this.usersIds.length);
      return;
    }

    this.usersservice.getAllUsersPaginated({ page: ++this.page, limit: this.limit }).subscribe({
      next: users => {
        if (users.items.length === 0) {
          this.hasFinished = true;
          return;
        } else {
          users.items.forEach(user => {
            if (this.usersIds.find(id => {
              return id === user.id;
            }) !== undefined) {
              this.hasFinished = true;
              return;
            }
            if (this.authService.getLoggedInUser().id !== user.id) {
              this.users.push(user);
              this.usersIds.push(user.id as string);
            }
          });
        }
      },
      error: error => {
        console.log(error);
      }
    });
  }

  getUsers() {
    return this.users
  }

  onLoadMore() {
    this.renderAllUsers();
  }

  finished() {
    return this.hasFinished;
  }

}
