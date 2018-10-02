import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  private user = 'eudessilva@mangue3.com';
  private password = '12345678';

  constructor(private authService: AuthService, private router: Router) { }

  public login() {
    this.authService.loginUser(this.user, this.password).subscribe(
      (res) => {
        console.log(res);
        this.router.navigate(['editar']);
      },
      (err) => {
        console.log(err);
      });
  }

  ngOnInit() {
  }

}
