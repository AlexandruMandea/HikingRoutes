import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { UserRole } from "src/environments/app-constants";
import { AuthenticationService } from "../authentication.service";

@Injectable({
    providedIn: 'root'
})
export class AdminGuard implements CanActivate {
    constructor(
        private readonly authService: AuthenticationService,
        private readonly router: Router
    ) { }

    canActivate() {
        if (this.authService.isLoggedIn() && this.authService.getLoggedInUser().role === UserRole.ADMIN) return true;

        this.router.navigate(['login']);
        return false;
    }
}