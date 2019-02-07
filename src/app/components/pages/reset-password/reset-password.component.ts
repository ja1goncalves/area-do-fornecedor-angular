import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Router } from '@angular/router';
import {FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';
import { PasswordService } from 'src/app/services/password/password.service';
import { NotifyService } from 'src/app/services/notify/notify.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

  public emailForm: any;
  public submitted: boolean;
  public loading: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private passwordService: PasswordService,
    private notify: NotifyService) { }

  ngOnInit() {
    this.emailForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  get f(){ return this.emailForm.controls; }

  public reset() {

    const email = this.f.email.value;

    this.submitted = true;
    
    if(this.emailForm.valid) {
      this.loading = true;

      this.passwordService.resetPassword(email).subscribe(
        (response) => {
          if(response.status === 404) {
            this.notify.show('warning', 'Verifique o e-mail e tente novamente');
            this.loading = false;
          } else {
            this.notify.show('success', 'Um link para redifinir a senha foi enviando para o seu e-mail');
            this.router.navigate(['/login']);
          }
        }, (error) => {
          this.notify.show('warning', 'Verifique o e-mail e tente novamente');
          this.loading = false;
        }
      );
    }
    
  }

}
