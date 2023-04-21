import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaBigliettiComponent } from './lista-biglietti.component';

describe('ListaBigliettiComponent', () => {
  let component: ListaBigliettiComponent;
  let fixture: ComponentFixture<ListaBigliettiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListaBigliettiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListaBigliettiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
