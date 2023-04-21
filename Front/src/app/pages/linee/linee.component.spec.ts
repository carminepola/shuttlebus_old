import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LineeComponent } from './linee.component';

describe('LineeComponent', () => {
  let component: LineeComponent;
  let fixture: ComponentFixture<LineeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LineeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LineeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
