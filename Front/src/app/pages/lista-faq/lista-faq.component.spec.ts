import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaFaqComponent } from './lista-faq.component';

describe('ListaFaqComponent', () => {
  let component: ListaFaqComponent;
  let fixture: ComponentFixture<ListaFaqComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListaFaqComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListaFaqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
