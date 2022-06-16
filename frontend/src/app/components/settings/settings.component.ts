import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { UsersService } from 'src/app/services/users/users.service';
import { User } from '../login/model/user-interface';
import { CustomValidators } from '../register/validators/custom-validators';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  private updateForm: FormGroup;
  private emailAlreadyUsed: boolean;
  private user: User = {};
  private errorMessage: string | undefined = undefined;

  private nameValidators = [
    CustomValidators.atLeast2WordCharsMax25OrEmpty
  ];
  private emailValidators = [
    CustomValidators.isEmailOrEmpty
  ];
  private passwordValidators = [
    CustomValidators.containsNumberOrSpecialCharacterAndMin8OrEmpty
  ];

  constructor(
    private readonly authenticationService: AuthenticationService,
    private readonly formBuilder: FormBuilder,
    private readonly usersService: UsersService
  ) {
    this.emailAlreadyUsed = false;

    this.updateForm = this.formBuilder.group({
      name: new FormControl('', this.nameValidators),
      email: new FormControl('', this.emailValidators),
      password: new FormControl('', this.passwordValidators),
      confirmPassword: new FormControl('', []),
    },
      {
        validators: CustomValidators.passwordsMatch
      });
  }

  ngOnInit(): void {
    this.user = this.authenticationService.getLoggedInUser();

    // this.updateForm.get('name')?.setValue(this.user.name);
    // this.updateForm.get('email')?.setValue(this.user.email);
  }

  onUpdate() {
    if (this.updateForm.invalid) {
      this.emailAlreadyUsed = false;
      return;
    }

    const name = this.updateForm.value.name === '' ? undefined : this.updateForm.value.name;
    const email = this.updateForm.value.email === '' ? undefined : this.updateForm.value.email;
    const password = this.updateForm.value.password === '' ? undefined : this.updateForm.value.password;

    this.usersService.updateUser(this.user.id as string, { name, email, password }).subscribe({
      next: (response) => {
        if (response.affected === 0 || response.error) {
          this.errorMessage = 'This email is already used.';
          return;
        }
        this.errorMessage = undefined;
      },
      error: (error) => {
        this.errorMessage = error;
      }
    });
  }

  isEmailAlreadyUsed() { return this.emailAlreadyUsed; }

  getUpdateForm() { return this.updateForm; }

  getUserName() { return this.user.name; }

  getUserEmail() { return this.user.email; }

  getErrorMessage() { return this.errorMessage; }
}
