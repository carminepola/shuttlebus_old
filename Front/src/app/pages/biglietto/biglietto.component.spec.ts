import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BigliettoComponent } from './biglietto.component';

describe('BigliettoComponent', () => {
  let component: BigliettoComponent;
  let fixture: ComponentFixture<BigliettoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BigliettoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BigliettoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
