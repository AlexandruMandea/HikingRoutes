import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OverviewComponent } from './components/overview/overview.component';
import { RoutesComponent } from './components/routes/routes.component';
import { UsersComponent } from './components/users/users.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: OverviewComponent
  },
  {
    path: 'users',
    pathMatch: 'full',
    component: UsersComponent
  },
  {
    path: 'users/:name',
    pathMatch: 'full',
    component: UsersComponent
  },
  {
    path: 'routes',
    pathMatch: 'full',
    component: RoutesComponent
  },
  {
    path: 'routes/:searchString',
    pathMatch: 'full',
    component: RoutesComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
