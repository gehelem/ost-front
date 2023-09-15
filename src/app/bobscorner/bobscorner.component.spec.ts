import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BobscornerComponent } from './bobscorner.component';

describe('BobscornerComponent', () => {
  let component: BobscornerComponent;
  let fixture: ComponentFixture<BobscornerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BobscornerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BobscornerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
