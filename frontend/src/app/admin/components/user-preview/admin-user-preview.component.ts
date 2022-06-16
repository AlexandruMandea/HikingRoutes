import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { User } from 'src/app/components/login/model/user-interface';
import { UsersService } from 'src/app/services/users/users.service';
import { baseServerUsersUrl, UserRole } from 'src/environments/app-constants';
import { DeleteDialogComponent } from '../delete-dialog/delete-dialog.component';

@Component({
  selector: 'app-admin-user-preview',
  templateUrl: './admin-user-preview.component.html',
  styleUrls: ['./admin-user-preview.component.scss']
})
export class AdminUserPreviewComponent implements OnInit {

  @Input() user: User = {};

  constructor(
    private usersService: UsersService,
    private matDialog: MatDialog,
  ) { }

  ngOnInit(): void {
  }

  getProfilePicUrl() {
    return `${baseServerUsersUrl}/get/profile-picture/${this.user.profilePicture}`;
  }

  getUserId() {
    return this.user.id;
  }

  getName() {
    return this.user.name;
  }

  makeAdmin() {
    this.user.role = UserRole.ADMIN;
    this.usersService.updateUser(this.user.id as string, { role: UserRole.ADMIN }).subscribe();
  }

  makeUser() {
    this.user.role = UserRole.USER;
    this.usersService.updateUser(this.user.id as string, { role: UserRole.USER }).subscribe();
  }

  delete() {
    const dialogRef = this.matDialog.open(DeleteDialogComponent, {
      data: { answer: 'no' }
    });

    return dialogRef.afterClosed().subscribe(answer => {
      if (answer) {
        this.usersService.deleteUser(this.user.id as string).subscribe();
        location.reload();
      }
    });
  }

  isAdmin() {
    return this.user.role === UserRole.ADMIN;
  }

  isUser() {
    return this.user.role === UserRole.USER;
  }
}
