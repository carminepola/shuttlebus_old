import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FermateComponent } from './fermate.component';

describe('FermateComponent', () => {
  let component: FermateComponent;
  let fixture: ComponentFixture<FermateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FermateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FermateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
