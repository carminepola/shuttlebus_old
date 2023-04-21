import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CambioLinguaComponent } from './cambio-lingua.component';

describe('CambioLinguaComponent', () => {
  let component: CambioLinguaComponent;
  let fixture: ComponentFixture<CambioLinguaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CambioLinguaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CambioLinguaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
