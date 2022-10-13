import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PropBoolComponent } from './prop-bool.component';

describe('PropBoolComponent', () => {
  let component: PropBoolComponent;
  let fixture: ComponentFixture<PropBoolComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PropBoolComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PropBoolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
