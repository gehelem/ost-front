import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphPhdComponent } from './graph-phd.component';

describe('GraphPhdComponent', () => {
  let component: GraphPhdComponent;
  let fixture: ComponentFixture<GraphPhdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GraphPhdComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GraphPhdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
