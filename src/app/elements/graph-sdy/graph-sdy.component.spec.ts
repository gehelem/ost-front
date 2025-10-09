import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphSdyComponent } from './graph-sdy.component';

describe('GraphDyComponent', () => {
  let component: GraphSdyComponent;
  let fixture: ComponentFixture<GraphSdyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GraphSdyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GraphSdyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
