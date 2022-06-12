import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { UserRole } from 'src/environments/app-constants';
import { User } from '../login/model/user-interface';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor(
    private authService: AuthenticationService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  navigateToProfile() {
    const loggedInUser = this.authService.getLoggedInUser().id;
    this.router.navigate([`profile/user-id/${loggedInUser}`]);
  }

  navigateToSettings() {
    this.router.navigate(['settings']);
  }

  navigateToAdmin() {
    this.router.navigate(['admin']);
  }

  isLoggedIn() {
    return this.authService.isLoggedIn();
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  getLoggedInUserName() {
    return JSON.parse(localStorage.getItem('loggedInUser') as string)['name'];
  }

  getLoggedInUserProfilePicture() {
    const requestUrl = '/hiking-routes/users/get/profile-picture/'
    const imageName = JSON.parse(localStorage.getItem('loggedInUser') as string)['profilePicture'];
    return `${requestUrl}${imageName}`;
  }

  isUserAdmin() {
    if (localStorage.getItem('loggedInUser')) {
      return (JSON.parse(localStorage.getItem('loggedInUser') as string) as User).role === UserRole.ADMIN;
    }

    return false;
  }
}
