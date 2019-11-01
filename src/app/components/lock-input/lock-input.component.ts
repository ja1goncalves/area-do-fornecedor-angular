import { Component, OnInit, Input, ViewChild, ElementRef, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-lock-input',
  templateUrl: './lock-input.component.html',
  styleUrls: ['./lock-input.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => LockInputComponent),
      multi: true,
    }
  ]
})
export class LockInputComponent implements OnInit, ControlValueAccessor {
  @ViewChild('input') inputRef: ElementRef;
  @Input() label: string;
  @Input() id = 0;

  lock = true;
  value: string;
  onChange: () => void;
  onTouch: () => void;
  disabled: boolean;

  constructor() { }

  ngOnInit() {}

  writeValue(value = ''): void {
    this.value = value;
  }
  
  registerOnChange(fn) {
    this.onChange = fn;
  }
  
  registerOnTouched(fn) {
    this.onTouch = fn;
  }

  setDisabledState(disable: boolean): void {
    this.disabled = disable;
  }

  public lockInputText(lock: boolean): void {
    if (lock)
      this.inputRef.nativeElement.setAttribute('type', 'password');
    else
      this.inputRef.nativeElement.setAttribute('type', 'text');
    this.lock = lock;
  }

}
