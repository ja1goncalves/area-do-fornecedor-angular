import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PasswordLockComponent } from './password-lock.component';

describe('PasswordLockComponent', () => {
  let component: PasswordLockComponent;
  let fixture: ComponentFixture<PasswordLockComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PasswordLockComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PasswordLockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
