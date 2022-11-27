import {Component, ElementRef, OnInit, ViewChild, Input} from '@angular/core';
import {Chart} from 'chart.js';

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.css']
})
export class LineChartComponent implements  OnInit {
  public chart: any;

  @Input() data!:any;  
  constructor() {
  }

  ngOnInit(): void {
    console.log("********************");
    console.log(this.data);
    console.log("********************");

    this.createChart();
  }


  createChart(){
  
    this.chart = new Chart("MyChart", this.data);
  }





}
