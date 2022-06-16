import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from 'src/app/components/login/model/user-interface';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { UsersService } from 'src/app/services/users/users.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit, OnChanges {

  private users: User[] = []
  private usersIds: string[] = [];
  private readonly limit = 2;
  private page = 0;
  private hasFinished = false;
  private name = '';

  constructor(
    private usersservice: UsersService,
    private activatedRoute: ActivatedRoute,
    private authService: AuthenticationService
  ) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.page = 0;
      this.name = params['name'] === undefined ? '' : params['name'];
      this.hasFinished = false;
      this.users = [];

      if (params['name']) {
        this.renderUsersFromSearch();
      } else {
        this.renderAllUsers();
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    location.reload();
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

  renderUsersFromSearch() {
    if (this.hasFinished) {
      this.usersIds.splice(0, this.usersIds.length);
      return;
    }

    this.usersservice.getUsersByName(this.name, { page: ++this.page, limit: this.limit }).subscribe({
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
            this.users.push(user);
            this.usersIds.push(user.id as string);
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
    if (this.name !== '') {
      this.renderUsersFromSearch();
    } else {
      this.renderAllUsers();
    }
  }

  finished() {
    return this.hasFinished;
  }

}
