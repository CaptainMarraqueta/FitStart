import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CheckSessionPage } from './check-session.page';

describe('CheckSessionPage', () => {
  let component: CheckSessionPage;
  let fixture: ComponentFixture<CheckSessionPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckSessionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
