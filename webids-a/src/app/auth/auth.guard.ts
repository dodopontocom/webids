import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import { AuthServive } from "./auth.service";

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private AuthServive: AuthServive, private router: Router){

  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    const isAuth = this.AuthServive.getIsAuth();
    if(!isAuth) {
      this.router.navigate(["/login"]);
    }
    return isAuth;
  }
}
