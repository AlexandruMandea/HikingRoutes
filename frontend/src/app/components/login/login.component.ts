import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  private loginForm: FormGroup;
  private wrongCredentials: boolean;

  constructor(
    private readonly authenticationService: AuthenticationService,
    private readonly router: Router,
  ) {
    this.wrongCredentials = false;

    this.loginForm = new FormGroup({
      email: new FormControl('', [
        Validators.required
      ]),
      password: new FormControl('', [
        Validators.required
      ])
    });
  }

  ngOnInit(): void {

  }

  onLogin() {
    if (this.loginForm.invalid) return;

    this.authenticationService.login(this.loginForm.value.email, this.loginForm.value.password).subscribe({
      next: accessToken => {
        this.router.navigate(['/']);
      },
      error: error => {
        this.wrongCredentials = true;
      }
    });
  }

  getLoginForm() {
    return this.loginForm;
  }

  areCredentialsWrong() {
    return this.wrongCredentials;
  }
}
