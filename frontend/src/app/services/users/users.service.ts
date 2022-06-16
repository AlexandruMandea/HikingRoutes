import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Pagination } from 'nestjs-typeorm-paginate';
import { catchError, map, Observable, throwError } from 'rxjs';
import { Follower } from 'src/app/components/login/model/follower-interface';
import { User } from 'src/app/components/login/model/user-interface';
import { baseServerFollowersUrl, baseServerUsersUrl } from 'src/environments/app-constants';

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

  getAllUsersPaginated(options: { page?: number, limit?: number }) {
    options.page = options.page ? options.page : 1;
    options.limit = options.limit ? options.limit : 5;

    return this.http.get<Pagination<User>>(`${baseServerUsersUrl}/get-all-users-paginated?&page=${options.page}&limit=${options.limit}`).pipe(
      map(u => u),
      catchError(this.handleError)
    );
  }

  getUsersByName(name: string, options: { page?: number, limit?: number }) {
    options.page = options.page ? options.page : 1;
    options.limit = options.limit ? options.limit : 5;

    return this.http.get<Pagination<User>>(`${baseServerUsersUrl}/get/name=${name}?&page=${options.page}&limit=${options.limit}`).pipe(
      map(u => u),
      catchError(this.handleError)
    );
  }

  uploadProfilePicture(image: File) {
    const formData: FormData = new FormData();
    formData.append('file', image);

    return this.http.post<any>(`${baseServerUsersUrl}/upload-profile-picture`, formData);
  }

  follow(userId: string) {
    return this.http.post<Follower>(`${baseServerFollowersUrl}/follow/${userId}`, {});
  }

  unfollow(userId: string) {
    return this.http.delete<any>(`${baseServerFollowersUrl}/unfollow/${userId}`, {});
  }

  getFollower(followsId: number) {
    return this.http.get<User>(`${baseServerFollowersUrl}/get-follower-as-user/${followsId}`);
  }

  getFollowing(followsId: number) {
    return this.http.get<User>(`${baseServerFollowersUrl}/get-following-as-user/${followsId}`);
  }

  getUsersCount() {
    return this.http.get<number>(`${baseServerUsersUrl}/get/users-count`);
  }

  updateUser(id: string, user: User) {
    return this.http.put<any>(`${baseServerUsersUrl}/update/id=${id}`, user);
  }

  deleteUser(id: string) {
    return this.http.delete<any>(`${baseServerUsersUrl}/delete/id=${id}`);
  }
}
