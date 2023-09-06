import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphXYComponent } from './graph-xy.component';

describe('GraphXYComponent', () => {
  let component: GraphXYComponent;
  let fixture: ComponentFixture<GraphXYComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GraphXYComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GraphXYComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
