import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadFbSuccessButtonComponent } from './load-fb-success-button.component';

describe('LoadFbSuccessButtonComponent', () => {
  let component: LoadFbSuccessButtonComponent;
  let fixture: ComponentFixture<LoadFbSuccessButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoadFbSuccessButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadFbSuccessButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
