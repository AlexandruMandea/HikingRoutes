import { Injectable } from '@angular/core';
import { User } from '../components/login/model/user-interface';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  private user: User | undefined;
  private userId: string = '';

  constructor() { }

  getUserId() { return this.userId; }

  setUserId(id: string) { this.userId = id; }

  getUser() { return this.user; }

  setUser(user: User | undefined) { this.user = user; }
}
