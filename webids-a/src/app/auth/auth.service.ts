import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Subject } from "rxjs";
import { environment } from "../../environments/environment"
import { AuthData } from "./auth-data.model";

const API_HOST = environment.API_TESTING_HOST;

@Injectable({
  providedIn: "root"
})
export class AuthService {

  private isAuthenticated = false;
  private token: string;
  private tokenTimer: any;
  private userId: string;
  private authStatusListener = new Subject<boolean>();

  constructor(private http: HttpClient, private router: Router) {

  }

  getToken() {
    return this.token;
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  getUserId() {
    return this.userId;

  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  createUser(email: string, password: string, name: string, lastname: string, createdAt: Date) {
    const authData: AuthData = {email: email, password: password, name: name, lastname: lastname, createdAt: createdAt};
    this.http.post( API_HOST + "/user/signup", authData)
      .subscribe(response =>{
        this.router.navigate(["/auth/login"]);
      }, error => {
        this.authStatusListener.next(false);
      });
  }

  updateUserLastLogin(lastLoginAt: Date) {
    let userData: AuthData;

    userData = {
      lastLoginAt: lastLoginAt,
    };
  }

  login(email: string, password: string, lastLoginAt: Date) {

    const authData: AuthData = {email: email, password: password, lastLoginAt: lastLoginAt};
    this.http.post<{token: string, expiresIn: number, userId: string, lastLoginAt: Date}>(API_HOST + "/user/login", authData)
      .subscribe(response => {
        console.log(lastLoginAt);
        const token = response.token;
        this.token = token;

        if (token) {
          const expiresInDuration = response.expiresIn;
          this.setAuthTimer(expiresInDuration);
          this.isAuthenticated = true;
          this.userId = response.userId;
          this.authStatusListener.next(true);
          const now = new Date();
          const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
          this.saveAuthData(token, expirationDate, this.userId, lastLoginAt);

          const updateLastLoginAt = new Date();
          this.updateUserLastLogin(updateLastLoginAt);

          console.log(expirationDate);

          this.router.navigate(["/"]);
        }

      }, error => {
        this.authStatusListener.next(false);
      });
  }

  autoAuthUser() {
    const authInformation = this.getAuthData();
    if(!authInformation) {
      return;
    }
    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
    if(expiresIn > 0) {
      this.token = authInformation.token;
      this.isAuthenticated = true;
      this.userId = authInformation.userId;
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListener.next(true);
    }
  }

  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    this.userId = null;
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.router.navigate(["/"]);
  }

  private setAuthTimer(duration: number) {
    console.log("Setting timer: " + duration);
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  private saveAuthData(token: string, expirationDate: Date, userId: string, lastLoginAt: Date) {
    localStorage.setItem("token", token);
    localStorage.setItem("expiration", expirationDate.toISOString());
    localStorage.setItem("userId", userId);
    localStorage.setItem("lastLoginAt", lastLoginAt.toISOString());
  }

  private clearAuthData() {
    localStorage.removeItem("token");
    localStorage.removeItem("expiration");
    localStorage.removeItem("userId");
    localStorage.removeItem("lastLoginAt");
  }

  private getAuthData() {
    const token = localStorage.getItem("token");
    const expirationDate = localStorage.getItem("expiration");
    const userId = localStorage.getItem("userId");
    if (!token || !expirationDate) {
      return;
    }
    return {
      token: token,
      expirationDate: new Date(expirationDate),
      userId: userId
    }
  }

}

