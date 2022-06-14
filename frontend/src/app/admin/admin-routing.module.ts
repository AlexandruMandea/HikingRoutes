import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OverviewComponent } from './components/overview/overview.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: OverviewComponent
  },
  {
    path: 'users',//search? delete, change role
    pathMatch: 'full',
    component: OverviewComponent
  },
  {
    path: 'routes',//search?
    pathMatch: 'full',
    component: OverviewComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
