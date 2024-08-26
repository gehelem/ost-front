import { Component, OnInit,Input,ViewChild } from '@angular/core';
import { WebsocketService } from '../../websocket.service';
import { BaseChartDirective } from 'ng2-charts';

import { Elt } from 'src/datastructure/elt';
import { mytabledatasource, Prp } from 'src/datastructure/prp';
import { Mod } from 'src/datastructure/mod';
import { MatTable as MatTable } from '@angular/material/table';

@Component({
  selector: 'app-graph-xy',
  templateUrl: './graph-xy.component.html',
  styleUrls: ['./graph-xy.component.css']
})
export class GraphXYComponent implements OnInit {
  @Input() mod!: string;
  @Input() prop!: string;
  subsPush: any;
  @ViewChild(BaseChartDirective) public chartGXY?: BaseChartDirective;
  
  GXY: {X:string;Y:string;data:any;options:any}={
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

    this.GXY.X=this.pp.graphParams['X'];       
    this.GXY.Y=this.pp.graphParams['Y'];
    //var grid=json["grid"];
    //this.GXY.data.data=[];
    var arr:any=[];
    var labs:any=[];
    Object.entries(this.pp.grid).forEach(([il,l],index)=>{
        var line: {[key: string]: any}={};
        line[this.GXY.X]=l[this.pp.gridheaders.indexOf(this.GXY.X)];
        line[this.GXY.Y]=l[this.pp.gridheaders.indexOf(this.GXY.Y)];
        arr.push(line);
        labs.push(this.pp.grid[index][this.pp.gridheaders.indexOf(this.GXY.X)]);
    })

    arr.sort((a:{[key: string]: any}, b:{[key: string]: any}) => { return a[this.GXY.X] < b[this.GXY.X] ? -1 : 1} );
    labs.sort((a:string, b:string) => { return a < b ? -1 : 1} );

    this.GXY.data= {
        type: 'scatter',
        data: {
            datasets: [{
            label: this.pp.elts[this.GXY.Y].label,
            data: arr,
            parsing: {
                xAxisKey: this.GXY.X,
                yAxisKey: this.GXY.Y
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
                    text: this.pp.elts[this.GXY.Y].label
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: this.pp.elts[this.GXY.X].label
                    }
                }
                }                    
        }                    
        };
    if (this.pp.graphParams['Xmin']!='') this.GXY.data.options.scales.x.min=this.pp.graphParams['Xmin'];
    if (this.pp.graphParams['Xmax']!='') this.GXY.data.options.scales.x.max=this.pp.graphParams['Xmax'];
    if (this.pp.graphParams['Ymin']!='') this.GXY.data.options.scales.y.min=this.pp.graphParams['Ymin'];
    if (this.pp.graphParams['Ymax']!='') this.GXY.data.options.scales.y.max=this.pp.graphParams['Ymax'];
    this.GXY.options= {
    };


  }

  OnPushVal(msg: any) {
    var arr:any=[];
    var labs:any=[];
    Object.entries(this.pp.grid).forEach(([il,l],index)=>{
        var line: {[key: string]: any}={};
        line[this.GXY.X]=l[this.pp.gridheaders.indexOf(this.GXY.X)];
        line[this.GXY.Y]=l[this.pp.gridheaders.indexOf(this.GXY.Y)];
        arr.push(line);
        labs.push(this.pp.grid[index][this.pp.gridheaders.indexOf(this.GXY.X)]);
    })

    arr.sort((a:{[key: string]: any}, b:{[key: string]: any}) => { return a[this.GXY.X] < b[this.GXY.X] ? -1 : 1} );
    labs.sort((a:string, b:string) => { return a < b ? -1 : 1} );
    this.GXY.data.data.datasets[0].data =arr;
    //this.chartGXY?.update();
  


  }






}
