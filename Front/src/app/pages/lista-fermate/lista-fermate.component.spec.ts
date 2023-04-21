import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaFermateComponent } from './lista-fermate.component';

describe('ListaFermateComponent', () => {
  let component: ListaFermateComponent;
  let fixture: ComponentFixture<ListaFermateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListaFermateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListaFermateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
