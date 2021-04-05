import { Component, OnInit } from '@angular/core';
import { AuthServive } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  constructor(private authServive: AuthServive) {

  }

  ngOnInit() {
    this.authServive.autoAuthUser();
  }

}
