import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaTraduzioniComponent } from './lista-traduzioni.component';

describe('ListaTraduzioniComponent', () => {
  let component: ListaTraduzioniComponent;
  let fixture: ComponentFixture<ListaTraduzioniComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListaTraduzioniComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListaTraduzioniComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
