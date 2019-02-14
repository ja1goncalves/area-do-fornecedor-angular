import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RegisterService } from '../../../services/register/register.service';

@Component({
  selector: 'app-confirm-register',
  templateUrl: './confirm-register.component.html',
  styleUrls: ['./confirm-register.component.css']
})
export class ConfirmRegisterComponent implements OnInit {

  public token: string;
  public confirmed: boolean;
  public loading = true;
  error: boolean;

  constructor(private activatedRoute: ActivatedRoute, private registerService: RegisterService) { }

  ngOnInit() {
    
    this.activatedRoute.params.subscribe(
      (params) => { 
        this.token = params.token;
      },
      (error) => { }
    );

    this.registerService.confirmRegister(this.token).subscribe(
      (response) => {
        this.loading = false;
        this.confirmed = true;
      },
      (error) => { 
        this.error = true;
        this.loading = false;
      }
    );

  }

}
