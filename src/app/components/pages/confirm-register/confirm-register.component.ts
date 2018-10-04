import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RegisterService } from '../../../services/register/register.service';

@Component({
  selector: 'app-confirm-register',
  templateUrl: './confirm-register.component.html',
  styleUrls: ['./confirm-register.component.css']
})
export class ConfirmRegisterComponent implements OnInit {

  code: string;
  username: string;
  error: boolean;
  loading: boolean;

  constructor(private route: ActivatedRoute, private registerService: RegisterService) { }

  ngOnInit() {
    
    this.route.params.subscribe((res) => {
      this.code = res.code;
      this.username = res.username;
    });

    this.registerService.confirmRegister(this.code, this.username)
    .subscribe((res) => {
      console.log(res);
    },
    (err) => {
      console.log();
    });

  }

}
