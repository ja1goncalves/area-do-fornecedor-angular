import { CanActivate, Router, ActivatedRoute } from '@angular/router';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuardService implements CanActivate {

  constructor(private authService: AuthService, private route: ActivatedRoute, private router: Router) {
  }

  canActivate() {

    if (this.authService.isLoggedIn()) {
      return true;
    } else {
      if(!this.router.url.includes('confirmar')){
        this.router.navigate(['login']);
      }
      return false;
    }
  }
}
