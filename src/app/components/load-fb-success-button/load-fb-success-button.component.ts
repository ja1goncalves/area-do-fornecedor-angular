import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'load-fb-success-button',
  templateUrl: './load-fb-success-button.component.html',
  styleUrls: ['./load-fb-success-button.component.css']
})
export class LoadFbSuccessButtonComponent implements OnInit {

  @Input() loading: boolean;
  @Input() type: 'submit' | 'button' = 'submit';
  @Input() text: string;

  constructor() { }

  ngOnInit() {
  }

}
