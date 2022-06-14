import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { OverviewComponent } from './components/overview/overview.component';
import { UsersComponent } from './components/users/users.component';
import { RoutesComponent } from './components/routes/routes.component';


@NgModule({
  declarations: [
    OverviewComponent,
    UsersComponent,
    RoutesComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule
  ]
})
export class AdminModule { }
