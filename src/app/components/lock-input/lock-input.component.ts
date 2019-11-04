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
  @ViewChild('label') labelRef: ElementRef;
  @ViewChild('input') inputRef: ElementRef;
  @Input() label: string;
  @Input() id = 0;
  @Input() addMarqueeOnLabel: boolean;

  lock = true;
  value: string;
  onChange: () => void;
  onTouch: () => void;
  disabled: boolean;

  constructor() { }

  ngOnInit() {
    const labelNative = this.labelRef.nativeElement;
    labelNative.innerHTML = this.label;
    labelNative.setAttribute('title', this.label);

    if (this.addMarqueeOnLabel) {
      // Creates the marquee element, so the label will be sliding
      const marquee = document.createElement('marquee');
      marquee.setAttribute('behavior', 'alternate');
      marquee.setAttribute('scrollamount', '1');

      // Wraps the label with the marquee tag
      labelNative.parentNode.insertBefore(marquee, labelNative);
      marquee.appendChild(labelNative);
    }
  }

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
