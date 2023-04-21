import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CentroNotificheComponent } from './centro-notifiche.component';

describe('CentroNotificheComponent', () => {
  let component: CentroNotificheComponent;
  let fixture: ComponentFixture<CentroNotificheComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CentroNotificheComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CentroNotificheComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
