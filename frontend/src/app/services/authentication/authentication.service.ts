import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http'
import { catchError, map, Observable, of, throwError } from 'rxjs';
import { User } from 'src/app/components/login/model/user-interface';
import { baseServerUsersUrl } from 'src/environments/app-constants';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private loggedInUser: User | undefined = undefined;
  private accessToken: string | undefined = undefined;

  constructor(private http: HttpClient) { }

  handleError(error: HttpErrorResponse): Observable<never> {
    console.log(error);
    return throwError(() => {
      return error;
    });
  }

  register(user: User): Observable<any> {
    return this.http.post<any>('/hiking-routes/users/register', user).pipe(
      map(user => user),
      catchError(this.handleError)
    );
  }

  login(email: string, password: string): Observable<any> {// loginForm: LoginForm 
    this.http.get<User>(`${baseServerUsersUrl}/get/email=${email}`).pipe(
      map(user => {
        localStorage.setItem('loggedInUser', JSON.stringify(user));
        this.loggedInUser = user;
        return user;
      }),
      catchError(this.handleError)
    ).subscribe({
      next: () => { },
      error: (error) => { console.log(error); }
    });

    return this.http.post<any>(`${baseServerUsersUrl}/login`, { email: email, password: password }).pipe(
      map(token => {
        localStorage.setItem('accessToken', token.accessToken);
        this.accessToken = token.accessToken;
        return token;
      }),
      catchError(this.handleError)
    );
  }

  logout(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('loggedInUser');
    this.accessToken = undefined;
    this.loggedInUser = undefined;
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('accessToken');
    //return this.accessToken != undefined;
  }

  getLoggedInUser() {
    return JSON.parse(localStorage.getItem('loggedInUser') as string) as User;

    // return this.http.get<User>(`/hiking-routes/users/get/id=${(JSON.parse(localStorage.getItem('loggedInUser') as string) as User).id}`).pipe(
    //   map(user => {
    //     console.log(user);
    //     localStorage.setItem('loggedInUser', JSON.stringify(user));
    //     this.loggedInUser = user;
    //     return user;
    //   }),
    //   catchError(this.handleError)
    // );

    // .subscribe({
    //   next: () => { },
    //   error: (error) => { console.log(error); }
    // });
  }

  updateLoggedInUserFromLocalStorage(user: User) {
    localStorage.removeItem('loggedInUser');
    localStorage.setItem('loggedInUser', JSON.stringify(user));
  }

  fetchUpdatedUser() {
    return this.http.get<User>(`${baseServerUsersUrl}/get/email=${(JSON.parse(localStorage.getItem('loggedInUser') as string) as User).email}`).pipe(
      map(user => {
        localStorage.removeItem('loggedInUser');
        localStorage.setItem('loggedInUser', JSON.stringify(user));
        this.loggedInUser = user;
        return user;
      }),
      catchError(this.handleError)
    );
  }
}
