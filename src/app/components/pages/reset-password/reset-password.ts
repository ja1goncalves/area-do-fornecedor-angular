import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth/auth.service';
import { Router } from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { PasswordService } from '../../../services/password/password.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

  username: string;
  resetForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private passwordService: PasswordService
  ) { }

  ngOnInit() {
    this.resetForm = this.fb.group({
      username: ['', Validators.required],
    });
  }

  reset() {
    // console.log(this.username);
    this.passwordService.reset(this.username);
    // .subscribe(
    //   (res) => {
    //     console.log(res);
    //     this.router.navigate(['']);
    //   },
    //   (err) => {
    //     console.log(err);
    //   });
    // console.log(this.username);
    // this.authService.loginUser(this.username, this.password)
    //   .subscribe(
    //     (res) => {
    //       console.log(res);
    //       this.router.navigate(['']);
    //     },
    //     (err) => {
    //       console.log(err);
    //     });
  }


}
