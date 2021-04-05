import { Component, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { AuthServive } from "../auth.service";

@Component({
  templateUrl:'./login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {

  isLoading = false;

  constructor(public authServive: AuthServive) {

  }

  ngOnInit() {}

  onLogin(form: NgForm) {

    console.log(form.value);
    if(form.invalid) {
      return;
    }
    this.isLoading = true;
    this.authServive.login(form.value.email, form.value.password);

  }

}
