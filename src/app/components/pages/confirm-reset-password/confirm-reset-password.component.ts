import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { PasswordService } from 'src/app/services/password/password.service';
import { NotifyService } from 'src/app/services/notify/notify.service';
import { PasswordValidation } from 'src/app/helpers/validators';
import { defaultReqErrMessage } from 'src/app/app.utils';

@Component({
  selector: 'app-confirm-reset-password',
  templateUrl: './confirm-reset-password.component.html',
  styleUrls: ['./confirm-reset-password.component.css']
})
export class ConfirmResetPasswordComponent implements OnInit {

  private tokenInfo: any;
  public passwordForm: any;
  public submitted: boolean;
  public loading: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private passwordService: PasswordService,
    private notify: NotifyService) { }

  ngOnInit() {
    this.passwordForm = this.formBuilder.group({
      password:         ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword:  ['', [Validators.required]],
    }, {validator: PasswordValidation.MatchPassword});

    this.activatedRoute.params.subscribe(
      (params) => {
        const token = params.token;
        this.checkToken(token);
      }, (error) => { }
    );
  }

  get f(){ return this.passwordForm.controls; }

  private checkToken(token: string): void {
    this.passwordService.checkResetToken(token).subscribe(
      (response) => {

        if (response.status === 404) {
          this.notify.show('error', "Seu link de recuperação expirou, tente 'Esqueci minha senha' novamente");
          this.router.navigate(['/login']);
        }

        this.tokenInfo = response;

      }, (error) => {
        this.notify.show('error', "Seu link de recuperação expirou, tente 'Esqueci minha senha' novamente");
        this.router.navigate(['/login']);
      }
    );

  }

  public reset(): void {
    const requestData = {
      email: this.tokenInfo.email,
      password: this.f.password.value,
      password_confirmation: this.f.confirmPassword.value,
      token: this.tokenInfo.token
    };

    this.submitted = true;

    if (this.passwordForm.valid) {
      this.loading = true;

      this.passwordService.confirmPassword(requestData).subscribe(
        (response) => {
          if (response.error || response.errors) {
            const { message } = response;
            this.notify.show('error', message ? message : defaultReqErrMessage);
            this.loading = false;
          } else {
            this.notify.show('success', 'Sua senha foi alterada');
            this.router.navigate(['/login']);
          }
        }, ({ message }) => {
          this.notify.show('error', message ? message : defaultReqErrMessage);
          this.loading = false;
        }
      );
    }

  }

}
