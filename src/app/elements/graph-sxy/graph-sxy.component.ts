import { Component, OnInit,Input,ViewChild } from '@angular/core';
import { WebsocketService } from '../../websocket.service';
import { BaseChartDirective } from 'ng2-charts';

import { Elt } from 'src/datastructure/elt';
import { mytabledatasource, Prp } from 'src/datastructure/prp';
import { Mod } from 'src/datastructure/mod';
import { MatTable as MatTable } from '@angular/material/table';

@Component({
  selector: 'app-graph-sxy',
  templateUrl: './graph-sxy.component.html',
  styleUrls: ['./graph-sxy.component.css']
})
export class GraphSXYComponent implements OnInit {
  @Input() mod!: string;
  @Input() prop!: string;
  subsPush: any;
  @ViewChild(BaseChartDirective) public chartGXY?: BaseChartDirective;
  
  GSXY: {S:string;X:string;Y:string;data:any;options:any}={
    S: "",
    X: "",
    Y: "",
    data: {},
    options: {}
  };
  pp!: Prp; 


  constructor(public ws:WebsocketService) { 

  }

  ngOnInit(): void {
    this.subsPush = this.ws.datastore.mods[this.mod].prps[this.prop].getSubsPush()
    .subscribe( msg => this.OnPushVal(msg));    
    this.pp=this.ws.datastore.mods[this.mod].prps[this.prop]

    this.GSXY.S=this.pp.graphParams['S'];       
    this.GSXY.X=this.pp.graphParams['X'];       
    this.GSXY.Y=this.pp.graphParams['Y'];
    //var grid=json["grid"];
    //this.GSXY.data.data=[];
    var arr:any=[];
    var labs:any=[];
    Object.entries(this.pp.grid).forEach(([il,l],index)=>{
        var line: {[key: string]: any}={};
        line[this.GSXY.S]=l[this.pp.gridheaders.indexOf(this.GSXY.S)];
        line[this.GSXY.X]=l[this.pp.gridheaders.indexOf(this.GSXY.X)];
        line[this.GSXY.Y]=l[this.pp.gridheaders.indexOf(this.GSXY.Y)];
        arr.push(line);
        labs.push(this.pp.grid[index][this.pp.gridheaders.indexOf(this.GSXY.X)]);
    })

    arr.sort((a:{[key: string]: any}, b:{[key: string]: any}) => { return a[this.GSXY.X] < b[this.GSXY.X] ? -1 : 1} );
    labs.sort((a:string, b:string) => { return a < b ? -1 : 1} );

    this.GSXY.data= {
        type: 'scatter',
        data: {
            datasets: [{
            label: this.pp.elts[this.GSXY.Y].label,
            data: arr,
            parsing: {
                xAxisKey: this.GSXY.X,
                yAxisKey: this.GSXY.Y
            },
            pointBackgroundColor: 'rgb(255, 0, 0)'
            }
            ],
            //labels:labs
        },
        options: {
            animation: false,
            beginAtZero: false,
            scales: {
                y: {
                    title: {
                    display: true,
                    text: this.pp.elts[this.GSXY.Y].label
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: this.pp.elts[this.GSXY.X].label
                    }
                }
                }                    
        }                    
        };
    if (this.pp.graphParams['Xmin']!='') this.GSXY.data.options.scales.x.min=this.pp.graphParams['Xmin'];
    if (this.pp.graphParams['Xmax']!='') this.GSXY.data.options.scales.x.max=this.pp.graphParams['Xmax'];
    if (this.pp.graphParams['Ymin']!='') this.GSXY.data.options.scales.y.min=this.pp.graphParams['Ymin'];
    if (this.pp.graphParams['Ymax']!='') this.GSXY.data.options.scales.y.max=this.pp.graphParams['Ymax'];
    this.GSXY.options= {
    };


  }

  OnPushVal(msg: any) {
    var arr:any=[];
    var labs:any=[];
    Object.entries(this.pp.grid).forEach(([il,l],index)=>{
        var line: {[key: string]: any}={};
        line[this.GSXY.S]=l[this.pp.gridheaders.indexOf(this.GSXY.S)];
        line[this.GSXY.X]=l[this.pp.gridheaders.indexOf(this.GSXY.X)];
        line[this.GSXY.Y]=l[this.pp.gridheaders.indexOf(this.GSXY.Y)];
        arr.push(line);
        labs.push(this.pp.grid[index][this.pp.gridheaders.indexOf(this.GSXY.X)]);
    })

    arr.sort((a:{[key: string]: any}, b:{[key: string]: any}) => { return a[this.GSXY.X] < b[this.GSXY.X] ? -1 : 1} );
    labs.sort((a:string, b:string) => { return a < b ? -1 : 1} );
    this.GSXY.data.data.datasets[0].data =arr;
    this.chartGXY?.update();
  


  }






}
