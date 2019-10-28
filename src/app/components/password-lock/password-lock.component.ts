import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-password-lock',
  templateUrl: './password-lock.component.html',
  styleUrls: ['./password-lock.component.css']
})
export class PasswordLockComponent implements OnInit {
  @Output() lockUnlock: EventEmitter<boolean> = new EventEmitter<boolean>();

  lock: boolean;
  
  constructor() { }

  ngOnInit() {
  }

  manageLock(lock: boolean): void {
    this.lock = lock;
    this.lockUnlock.emit(lock);
  }

}
