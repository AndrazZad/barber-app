import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormMobileComponent } from './form-mobile.component';

describe('FormMobileComponent', () => {
  let component: FormMobileComponent;
  let fixture: ComponentFixture<FormMobileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FormMobileComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FormMobileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
