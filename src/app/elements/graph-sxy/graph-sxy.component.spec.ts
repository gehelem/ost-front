import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BaseChartDirective } from 'ng2-charts';

import { GraphSXYComponent } from './graph-sxy.component';

describe('GraphXYComponent', () => {
  let component: GraphSXYComponent;
  let fixture: ComponentFixture<GraphSXYComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GraphSXYComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GraphSXYComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
