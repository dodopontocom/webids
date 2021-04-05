import { Component, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { AuthServive } from "../auth.service";

@Component({
  templateUrl:'./signup.component.html',
  styleUrls: ['./signup.component.css']
})

export class SignupComponent implements OnInit {

  isLoading = false;

  constructor(public authService: AuthServive){

  }

  ngOnInit() {}

  onSignup(form: NgForm) {
    if(form.invalid){
      return;
    }
    this.authService.createUser(form.value.email, form.value.password);

  }

}
