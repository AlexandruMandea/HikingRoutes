import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MapService } from 'src/app/services/map/map.service';
import { Route } from '../map/model/route-interface';

@Component({
  selector: 'app-all-routes',
  templateUrl: './all-routes.component.html',
  styleUrls: ['./all-routes.component.scss']
})
export class AllRoutesComponent implements OnInit {

  private routes: Route[] = [];
  private routesIds: string[] = [];
  private readonly limit = 8;
  private page = 0;
  private hasFinished = false;
  private searchTerm = '';

  constructor(
    private readonly mapService: MapService,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.page = 0;
      this.searchTerm = params['searchTerm'] === undefined ? '' : params['searchTerm'];
      this.hasFinished = false;
      this.routes = [];

      if (params['searchTerm']) {
        this.renderRoutesFromSearch(); // this.mapService.getRoutesByTitleOrLocation(params['searchTerm'], { page: this.page, limit: this.limit });
      } else {
        this.renderAllRoutes();
      }
    });

    //this.renderMoreRoutes();
  }

  renderRoutesFromSearch() {
    if (this.hasFinished) {
      this.routesIds.splice(0, this.routesIds.length);
      return;
    }

    this.mapService.getRoutesByTitleOrLocation(this.searchTerm, { page: ++this.page, limit: this.limit }).subscribe({
      next: routes => {
        if (routes.items.length === 0) {
          this.hasFinished = true;
          return;
        } else {
          routes.items.forEach(route => {
            if (this.routesIds.find(id => {
              return id === route.id;
            }) !== undefined) {
              this.hasFinished = true;
              return;
            }
            this.routes.push(route);
            this.routesIds.push(route.id as string);
          });
        }
      },
      error: error => {
        console.log(error);
      }
    });
  }

  renderAllRoutes() {
    if (this.hasFinished) {
      this.routesIds.splice(0, this.routesIds.length);
      return;
    }

    this.mapService.getAllRoutesPaginated({ page: ++this.page, limit: this.limit }).subscribe({
      next: routes => {
        if (routes.items.length === 0) {
          this.hasFinished = true;
          return;
        } else {
          routes.items.forEach(route => {
            if (this.routesIds.find(id => {
              return id === route.id;
            }) !== undefined) {
              this.hasFinished = true;
              return;
            }
            this.routes.push(route);
            this.routesIds.push(route.id as string);
          });
        }
      },
      error: error => {
        console.log(error);
      }
    });
  }

  getRoutes() {
    return this.routes;
  }

  onScroll() {
    if (this.searchTerm !== '') {
      this.renderRoutesFromSearch();
    } else {
      this.renderAllRoutes();
    }
  }

  finished() {
    return this.hasFinished;
  }

}
