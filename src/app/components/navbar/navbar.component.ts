import { Component, HostListener, OnInit } from '@angular/core';
import { getObjectCookie } from 'src/app/app.utils';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ShareDataService } from 'src/app/services/share/share-data.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  public width: number;
  public status = { open: false };
  public username: string;

  constructor(private auth: AuthService, private share: ShareDataService) { }

  ngOnInit() {
    this.width = window.innerWidth;

  }


  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    this.width = window.innerWidth;
    if (this.width > 991) {
      this.status.open = false;
    }
  }

  public toggleMenu($event: any): void {
    this.status.open = !this.status.open;
  }

  public logout() {
    this.auth.logout();
  }

}
