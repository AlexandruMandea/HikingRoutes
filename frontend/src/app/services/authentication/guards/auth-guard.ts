import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { AuthenticationService } from "../authentication.service";

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {
    constructor(
        private readonly authService: AuthenticationService,
        private readonly router: Router
    ) { }

    canActivate() {
        if (this.authService.isLoggedIn()) return true;

        this.router.navigate(['login']);
        return false;
    }
}