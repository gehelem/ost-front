import {Component, ElementRef, OnInit, OnChanges, ViewChild, Input, SimpleChanges} from '@angular/core';
import { Chart, ChartConfiguration, ChartEvent, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

import {default as Annotation} from 'chartjs-plugin-annotation';
import { repeat } from 'rxjs';

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.css']
})
export class LineChartComponent implements  OnInit, OnChanges{

  //public chart: BaseChartDirective;
  //@Input() data!:any;  
  _data:any;
  @Input() type!:any;  
  @Input() options!:any;
  @Input() set data(dta: any) {
    this._data=dta;
    this.chart?.update();
    console.log('xxxxxxxxxx');
  }  
  get data() :any {
    return this._data;
  }  

  constructor() {
    Chart.register(Annotation)
  }
  @ViewChild(BaseChartDirective, { static: false }) public chart?: BaseChartDirective;

  ngOnInit(): void {
    console.log("********************");
    console.log(this._data);
    console.log("********************");
    setTimeout(() => {
      this.updt();
      repeat();
    }, 400);
  
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log("change");
    console.log(changes);
  }  

  updt(){
    this.chart?.update();
    console.log('graph updated');
  }





}
