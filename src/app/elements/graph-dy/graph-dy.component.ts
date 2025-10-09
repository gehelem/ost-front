import { Component, OnInit,Input,ViewChild } from '@angular/core';
import { WebsocketService } from '../../websocket.service';
import { BaseChartDirective } from 'ng2-charts';

import { Elt } from 'src/datastructure/elt';
import { mytabledatasource, Prp } from 'src/datastructure/prp';
import { Mod } from 'src/datastructure/mod';
import { MatTable as MatTable } from '@angular/material/table';
import { fr } from "date-fns/locale";

@Component({
  selector: 'app-graph-dy',
  templateUrl: './graph-dy.component.html',
  styleUrls: ['./graph-dy.component.css']
})
export class GraphDyComponent implements OnInit {
  @Input() mod!: string;
  @Input() prop!: string;
  subsPush: any;
  @ViewChild(BaseChartDirective) public chartGDY?: BaseChartDirective;

  GDY: {D:string;Y:string;data:any;options:any}={
    D: "",
    Y: "",
    data: {},
    options: {}
  };
  pp!:Prp;

  constructor(public ws:WebsocketService) { }

  ngOnInit(): void {
    this.subsPush = this.ws.datastore.mods[this.mod].prps[this.prop].getSubsPush()
    .subscribe( msg => this.OnPushVal(msg));
    
    this.pp=this.ws.datastore.mods[this.mod].prps[this.prop];
    this.GDY.D=this.pp.graphParams['D'];       
    this.GDY.Y=this.pp.graphParams['Y'];    
    var arr:any=[];
    var labs:any=[];
    Object.entries(this.pp.grid).forEach(([il,l],index)=>{
        var line: {[key: string]: any}={};
        line[this.GDY.D]=l[this.pp.gridheaders.indexOf(this.GDY.D)];
        line[this.GDY.Y]=l[this.pp.gridheaders.indexOf(this.GDY.Y)];
        
        arr.push(line);
        labs.push(this.pp.grid[index][this.pp.gridheaders.indexOf(this.GDY.D)]);
    })
    arr.sort((a:{[key: string]: any}, b:{[key: string]: any}) => { return a[this.GDY.D] < b[this.GDY.D] ? -1 : 1} );
    labs.sort();
    var color ='rgb(255,0,0)';
    if ((typeof this.pp.graphParams['graphColor'])!="undefined")
    color='rgb('+this.pp.graphParams['graphColor'].R+','+this.pp.graphParams['graphColor'].G+','+this.pp.graphParams['graphColor'].B+')';


    this.GDY.data= {
        type: 'line',
        data: {
            datasets: [{
            label: this.pp.elts[this.GDY.Y].label,
            data: arr,
            parsing: {
                xAxisKey: this.GDY.D,
                yAxisKey: this.GDY.Y
            },
            borderColor: color,
            backgroundColor: color,
            pointBackgroundColor: color
            }
            ],
            labels:labs
        },
        options: {
            animation: false,
            beginAtZero: false,
            scales: {
                x: {
                    type:'time',
                    time: {
                        displayFormats: {
                            second: 'hh:mm',
                            minute: 'hh:mm',
                            hour: 'hh:mm'
                        }
                    },                                
                    //unit: 'second',
                    adapters: { 
                        date: {
                            locale: fr 
                        }
                    }
                }
                
            }
        }    
    };
    this.GDY.options= {
    };    



  }

  OnPushVal(msg: any) {
    var arr:any=[];
    var labs:any=[];
    Object.entries(this.pp.grid).forEach(([il,l],index)=>{
        var line: {[key: string]: any}={};
        line[this.GDY.D]=l[this.pp.gridheaders.indexOf(this.GDY.D)];
        line[this.GDY.Y]=l[this.pp.gridheaders.indexOf(this.GDY.Y)];
        arr.push(line);
        labs.push(this.pp.grid[index][this.pp.gridheaders.indexOf(this.GDY.D)]);
    })

    arr.sort((a:{[key: string]: any}, b:{[key: string]: any}) => { return a[this.GDY.D] < b[this.GDY.D] ? -1 : 1} );
    labs.sort((a:string, b:string) => { return a < b ? -1 : 1} );
    this.GDY.data.data.datasets[0].data =arr;
    this.GDY.data.data.labels =labs;
    this.chartGDY?.update();

  }



}
