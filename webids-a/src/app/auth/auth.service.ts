import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment"
import { AuthData } from "./auth-data.model";
import { LoginComponent } from "./login/login.component";

const GCP_IP = environment.GCP_EXTERNAL_IP;

@Injectable({
  providedIn: "root"
})
export class AuthServive {

  constructor(private http: HttpClient) {

  }

  createUser(email: string, password: string) {
    const authData: AuthData = {email: email, password: password};
    this.http.post("http://" + GCP_IP + ":3000/api/v1/user/signup", authData)
      .subscribe(response =>{
        console.log(response);
      });
  }


  login(email: string, password: string) {
    const authData: AuthData = {email: email, password: password};
    this.http.post("http://" + GCP_IP + ":3000/api/v1/user/login", authData)
      .subscribe(response => {
        console.log(response);
      });
  }

}

