import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit, OnDestroy {

  public searchTerm: string = '';
  private paramsSubscription$ = new Subscription;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.paramsSubscription$ = this.activatedRoute.params.subscribe(params => {
      if (params['searchTerm']) {
        this.searchTerm = params['searchTerm'];
      }
    });
  }

  ngOnDestroy(): void {
    this.paramsSubscription$.unsubscribe();
  }

  search() {
    if (this.searchTerm) {
      this.router.navigateByUrl(`/browse-routes/${this.searchTerm}`);
    } else {
      this.router.navigate([`/browse-routes`]);
    }
  }

  getSearchTerm() { return this.searchTerm; }
}
