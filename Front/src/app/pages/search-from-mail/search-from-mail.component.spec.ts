import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchFromMailComponent } from './search-from-mail.component';

describe('SearchFromMailComponent', () => {
  let component: SearchFromMailComponent;
  let fixture: ComponentFixture<SearchFromMailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchFromMailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchFromMailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
