import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CarrelloIconComponent } from './carrello-icon.component';

describe('CarrelloIconComponent', () => {
  let component: CarrelloIconComponent;
  let fixture: ComponentFixture<CarrelloIconComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CarrelloIconComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CarrelloIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
