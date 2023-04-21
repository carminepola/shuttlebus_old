import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MetodiPagamentoComponent } from './metodi-pagamento.component';

describe('MetodiPagamentoComponent', () => {
  let component: MetodiPagamentoComponent;
  let fixture: ComponentFixture<MetodiPagamentoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MetodiPagamentoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MetodiPagamentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
