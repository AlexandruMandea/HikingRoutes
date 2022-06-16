import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { UsersComponent } from './components/users/users.component';
import { RoutesComponent } from './components/routes/routes.component';
import { AdminUserPreviewComponent } from './components/user-preview/admin-user-preview.component';
import { OverviewComponent } from './components/overview/overview.component';
import { RoutePreviewComponent } from './components/route-preview/route-preview.component';
import { DeleteDialogComponent } from './components/delete-dialog/delete-dialog.component';


@NgModule({
  declarations: [
    OverviewComponent,
    UsersComponent,
    RoutesComponent,
    AdminUserPreviewComponent,
    RoutePreviewComponent,
    RoutePreviewComponent,
    DeleteDialogComponent,
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
  ]
})
export class AdminModule { }
