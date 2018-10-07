import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { PasswordService } from '../../../services/password/password.service';
import { NotifyService } from '../../../services/notify/notify.service';

@Component({
  selector: 'app-confirm-reset-password',
  templateUrl: './confirm-reset-password.component.html',
  styleUrls: ['./confirm-reset-password.component.css']
})
export class ConfirmResetPasswordComponent implements OnInit {

  resetForm: FormGroup;
  password: string;
  password_confirmation: string;
  code: string;
  username: string;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private passwordService: PasswordService,
    private notify: NotifyService) { }

  public reset() {

    const requestData = {
      password: this.password,
      password_confirmation: this.password_confirmation,
      code: this.code,
      username: this.username
    }

    this.validateData() && this.passwordService.confirm(requestData)
    .subscribe((res) => {
      console.log(res);
    },(err) => {
      console.log(err);
    });
  }

  validateData(): boolean {
    return (this.validatePassword() && !!this.code);
  }

  validatePassword(): boolean {
    if(this.password === undefined || this.password === '') {
      this.handlerNotify('warning', 'nenhum campo pode ficar vazio');
      return false;
    } else if(this.password !== this.password_confirmation) {
      this.handlerNotify('warning','as senhas devem ser iguais');
      return false;
    } else if(this.password.length < 8) {
      this.handlerNotify('warning','a senha não pode ter menos de 6 caracteres');
      return false;
    } else {
      return true;
    }
  }

  handlerNotify(type: string, message: string) {
    this.notify.show(type, message);
  }

  ngOnInit() {
    this.resetForm = this.fb.group({
      password: ['', Validators.required],
      password_confirmation: ['', Validators.required],
    });
    this.route.params.subscribe(res => {
     this.code = res.code;
     this.username = res.username;
    })
    
  }

}
