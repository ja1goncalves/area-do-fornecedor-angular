import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth/auth.service';
import { Router } from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { NotifyService } from '../../../services/notify/notify.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  username: string;
  password: string;
  loginForm: FormGroup;

  constructor(private authService: AuthService,  private fb: FormBuilder, private router: Router, private notify: NotifyService) { }

  ngOnInit() {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  login() {
    this.authService.loginUser(this.username, this.password).subscribe(
      (res) => {
        this.notify.show('success', 'Bem vindo');
        this.router.navigate(['']);
      },
      (err) => {
        this.notify.show('warning', 'Verifique o login e senha');
      }
    );
  }


}
