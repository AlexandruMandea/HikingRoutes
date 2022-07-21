import { AbstractControl, ValidationErrors } from "@angular/forms";

export class CustomValidators {
    static isEmail(control: AbstractControl): ValidationErrors | null {
        const regexEamil = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

        if (regexEamil.test(control.value) && control.value !== null) {
            return null;
        } else {
            return { emailInvalid: true };
        }
    }

    static hasAtLeastTwoWordCharacters(control: AbstractControl): ValidationErrors | null {
        const regex = /^(\w).*(\w)$/; // /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/g
        const moreThanOneSpace = /\s{2,}/g;

        if (regex.test(control.value) && !moreThanOneSpace.test(control.value) && control.value !== null) {
            return null;
        } else {
            return { nameInvalid: true };
        }
    }

    static containsNumberOrSpecialCharacter(control: AbstractControl): ValidationErrors | null {
        const regex = /\d|\W/;

        if (regex.test(control.value) && control.value !== null) {
            return null;
        } else {
            return { passwordInvalid: true };
        }
    }

    static passwordsMatch(control: AbstractControl): ValidationErrors | null {
        const password = control.get('password')?.value;
        const confirmPassword = control.get('confirmPassword')?.value;

        if ((password === confirmPassword) && (password !== null && confirmPassword !== null)) {
            return null;
        } else {
            return { passwordsDontMatch: true };
        }
    }

    static atLeast2WordCharsMax25OrEmpty(control: AbstractControl): ValidationErrors | null {
        const regex = /^(\w).*(\w)$/; // /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/g
        const moreThanOneSpace = /\s{2,}/g;

        if ((regex.test(control.value) && !moreThanOneSpace.test(control.value) && control.value !== null && control.value.length <= 25) || (control.value === '')) {
            return null;
        }

        return { nameInvalid: true };
    }

    static isEmailOrEmpty(control: AbstractControl): ValidationErrors | null {
        const regexEamil = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

        if ((regexEamil.test(control.value) && control.value !== null && control.value.length <= 25) || (control.value === '')) {
            return null;
        } else {
            return { emailInvalid: true };
        }
    }

    static containsNumberOrSpecialCharacterAndMin8OrEmpty(control: AbstractControl): ValidationErrors | null {
        const regex = /\d|\W/;

        if ((regex.test(control.value) && control.value !== null && control.value.length >= 8 && control.value.length <= 25) || (control.value === '')) {
            return null;
        } else {
            return { passwordInvalid: true };
        }
    }
}