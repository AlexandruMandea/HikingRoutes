import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material/toolbar';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AgmCoreModule } from '@agm/core';
import { GOOGLE_MAPS_API_KEY } from 'src/secrets.env';
import { MapComponent } from './components/map/map.component';
import { AgmDirectionModule } from 'agm-direction';
import { NgChartsModule } from 'ng2-charts';
import { ClickOutsideDirective } from 'src/directives/click-outside-directive';
import { MatMenuModule } from '@angular/material/menu';
import { ProfileComponent } from './components/profile/profile.component';
import { TokenInterceptorService } from './services/interceptors/token-interceptor.service';
import { MatDialogModule } from '@angular/material/dialog';
import { RouteDialogComponent } from './components/route-dialog/route-dialog.component'
import { MatCheckboxModule } from '@angular/material/checkbox';
import { RouteCardComponent } from './components/route-card/route-card.component';
import { HomeComponent } from './components/home/home.component';
import { AllRoutesComponent } from './components/all-routes/all-routes.component'
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MatIconModule } from '@angular/material/icon';
import { SearchComponent } from './components/search/search.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { ProfilePictureDialogComponent } from './components/profile-picture-dialog/profile-picture-dialog.component';
import { DeleteDialogComponent } from './components/delete-dialog/delete-dialog.component';
import { ProfileRoutesComponent } from './components/profile-routes/profile-routes.component';
import { ProfileStatsComponent } from './components/profile-stats/profile-stats.component';
import { ProfileFollowingsComponent } from './components/profile-followings/profile-followings.component';
import { ProfileFollowersComponent } from './components/profile-followers/profile-followers.component';
import { UserPreviewComponent } from './components/user-preview/user-preview.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    MapComponent,
    ClickOutsideDirective,
    ProfileComponent,
    RouteDialogComponent,
    RouteCardComponent,
    HomeComponent,
    AllRoutesComponent,
    SearchComponent,
    HeaderComponent,
    FooterComponent,
    ProfilePictureDialogComponent,
    DeleteDialogComponent,
    ProfileRoutesComponent,
    ProfileStatsComponent,
    ProfileFollowingsComponent,
    ProfileFollowersComponent,
    UserPreviewComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,

    HttpClientModule,

    FormsModule,
    ReactiveFormsModule,

    MatToolbarModule,
    MatMenuModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule,
    MatCheckboxModule,
    MatOptionModule,
    MatSelectModule,
    MatIconModule,

    InfiniteScrollModule,
    ScrollingModule,

    AgmCoreModule.forRoot({
      apiKey: GOOGLE_MAPS_API_KEY,
      libraries: ['places']
    }),
    AgmDirectionModule,

    NgChartsModule,
  ],
  entryComponents: [
    ProfileRoutesComponent,
    ProfileStatsComponent,
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: TokenInterceptorService,
    multi: true,
  },],
  bootstrap: [AppComponent]
})
export class AppModule { }
