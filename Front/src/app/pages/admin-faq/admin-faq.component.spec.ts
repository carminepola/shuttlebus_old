import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminFaqComponent } from './admin-faq.component';

describe('AdminFaqComponent', () => {
  let component: AdminFaqComponent;
  let fixture: ComponentFixture<AdminFaqComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminFaqComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminFaqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
