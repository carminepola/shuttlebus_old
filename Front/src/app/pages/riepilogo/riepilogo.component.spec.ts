import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RiepilogoComponent } from './riepilogo.component';

describe('RiepilogoComponent', () => {
  let component: RiepilogoComponent;
  let fixture: ComponentFixture<RiepilogoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RiepilogoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RiepilogoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
