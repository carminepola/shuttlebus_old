import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TraduzioniComponent } from './traduzioni.component';

describe('TraduzioniComponent', () => {
  let component: TraduzioniComponent;
  let fixture: ComponentFixture<TraduzioniComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TraduzioniComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TraduzioniComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
