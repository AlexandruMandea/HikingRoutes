import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { CustomValidators } from './validators/custom-validators';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  private registerForm: FormGroup;
  private emailAlreadyUsed: boolean;

  constructor(
    private readonly authenticationService: AuthenticationService,
    private readonly formBuilder: FormBuilder,
    private readonly router: Router,
  ) {
    this.emailAlreadyUsed = false;

    this.registerForm = this.formBuilder.group({
      name: new FormControl('', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(25),
        CustomValidators.hasAtLeastTwoWordCharacters
      ]),
      email: new FormControl('', [
        Validators.required,
        CustomValidators.isEmail
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        CustomValidators.containsNumberOrSpecialCharacter
      ]),
      confirmPassword: new FormControl('', [
        Validators.required
      ]),
    },
      {
        validators: CustomValidators.passwordsMatch
      })
  }

  ngOnInit(): void {
  }

  onRegister() {
    if (this.registerForm.invalid) {
      this.emailAlreadyUsed = false;
      return;
    }

    this.authenticationService.register(this.registerForm.value).subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.log(error);
        this.emailAlreadyUsed = true;
      }
    });
  }

  getRegisterForm() {
    return this.registerForm;
  }

  isEmailAlreadyUsed() {
    return this.emailAlreadyUsed;
  }
}
