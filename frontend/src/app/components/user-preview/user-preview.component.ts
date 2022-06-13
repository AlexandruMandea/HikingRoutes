import { Component, Input, OnInit } from '@angular/core';
import { baseServerUsersUrl } from 'src/environments/app-constants';
import { User } from '../login/model/user-interface';

@Component({
  selector: 'app-user-preview',
  templateUrl: './user-preview.component.html',
  styleUrls: ['./user-preview.component.scss']
})
export class UserPreviewComponent implements OnInit {

  @Input() user: User = {};

  constructor() { }

  ngOnInit(): void {
  }

  getName() {
    return this.user.name;
  }

  getProfilePicUrl() {
    return `${baseServerUsersUrl}/get/profile-picture/${this.user.profilePicture}`;
  }

  getUserId() {
    return this.user.id;
  }

}
