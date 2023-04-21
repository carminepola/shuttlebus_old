import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LelineeComponent } from './lelinee.component';

describe('LelineeComponent', () => {
  let component: LelineeComponent;
  let fixture: ComponentFixture<LelineeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LelineeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LelineeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
