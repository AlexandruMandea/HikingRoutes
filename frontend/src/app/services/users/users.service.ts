import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { User } from 'src/app/components/login/model/user-interface';
import { baseServerUsersUrl } from 'src/environments/app-constants';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private http: HttpClient) { }

  handleError(error: HttpErrorResponse): Observable<never> {
    console.log(error);
    return throwError(() => {
      return error;
    });
  }

  getUserById(id: string) {
    return this.http.get<User>(`${baseServerUsersUrl}/get/id=${id}`).pipe(
      map(user => {
        return user;
      }),
      catchError(this.handleError)
    );
  }

  uploadProfilePicture(image: File) {
    const formData: FormData = new FormData();
    formData.append('file', image);

    return this.http.post<any>(`${baseServerUsersUrl}/upload-profile-picture`, formData);
  }
}
