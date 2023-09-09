import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphDyComponent } from './graph-dy.component';

describe('GraphDyComponent', () => {
  let component: GraphDyComponent;
  let fixture: ComponentFixture<GraphDyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GraphDyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GraphDyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
