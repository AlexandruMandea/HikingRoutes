import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { AuthenticationService } from "../authentication.service";

@Injectable({
    providedIn: 'root'
})
export class NotLoggedInGuard implements CanActivate {
    constructor(
        private readonly authService: AuthenticationService,
        private readonly router: Router,
    ) { }

    canActivate() {
        if (!this.authService.isLoggedIn()) return true;

        this.router.navigate(['..']);
        return false;
    }
}