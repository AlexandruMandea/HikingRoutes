import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllRoutesComponent } from './components/all-routes/all-routes.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { MapComponent } from './components/map/map.component';
import { ProfileComponent } from './components/profile/profile.component';
import { RegisterComponent } from './components/register/register.component';
import { SettingsComponent } from './components/settings/settings.component';
import { AdminGuard } from './services/authentication/guards/admin-guard';
import { AuthGuard } from './services/authentication/guards/auth-guard';
import { NotLoggedInGuard } from './services/authentication/guards/not-logged-in-guard';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.module').then(module => module.AdminModule),
    canActivate: [AdminGuard]
  },
  {
    path: 'register',
    component: RegisterComponent,
    canActivate: [NotLoggedInGuard]
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [NotLoggedInGuard]
  },
  {
    path: 'map',
    component: MapComponent
  },
  {
    path: 'browse-routes/:searchTerm',
    component: AllRoutesComponent,
  },
  {
    path: 'browse-routes',
    component: AllRoutesComponent,
  },
  {
    path: 'profile/user-id/:userId',
    component: ProfileComponent,
  },
  {
    path: 'settings',
    component: SettingsComponent,
    canActivate: [AuthGuard]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
