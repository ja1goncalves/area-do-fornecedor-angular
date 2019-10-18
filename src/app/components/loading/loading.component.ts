import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'loading-icon',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.css']
})
export class LoadingComponent implements OnInit {
  @Input('loading') loading: boolean;

  constructor() { }

  ngOnInit() {
  }

}
