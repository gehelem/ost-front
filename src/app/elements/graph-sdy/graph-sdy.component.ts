import { Component, OnInit,Input,ViewChild } from '@angular/core';
import { WebsocketService } from '../../websocket.service';
import { BaseChartDirective } from 'ng2-charts';

import { Elt } from 'src/datastructure/elt';
import { mytabledatasource, Prp } from 'src/datastructure/prp';
import { Mod } from 'src/datastructure/mod';
import { MatTable as MatTable } from '@angular/material/table';
import { fr } from "date-fns/locale";

@Component({
  selector: 'app-graph-sdy',
  templateUrl: './graph-sdy.component.html',
  styleUrls: ['./graph-sdy.component.css']
})
export class GraphSdyComponent implements OnInit {
  @Input() mod!: string;
  @Input() prop!: string;
  subsPush: any;
  @ViewChild(BaseChartDirective) public chartGSDY?: BaseChartDirective;

  GSDY: {S:string;D:string;Y:string;data:any;options:any}={
    S: "",
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
    console.log(this.pp.graphParams);
    this.GSDY.S=this.pp.graphParams['S'];       
    this.GSDY.D=this.pp.graphParams['D'];       
    this.GSDY.Y=this.pp.graphParams['Y'];    
    var datasets:any=[]
    var labs:any=[];
    var series:any=[];
    Object.entries(this.pp.grid).forEach(([il,l],index)=>{
        var s=l[this.pp.gridheaders.indexOf(this.GSDY.S)];
        if (!(series.indexOf(s)>-1)) 
        {
            series.push(s);
            var color ='rgb(255,0,0)';
            if ((typeof this.pp.graphParams['graphColors'][s])!="undefined")
            color='rgb('+this.pp.graphParams['graphColors'][s].R+','+this.pp.graphParams['graphColors'][s].G+','+this.pp.graphParams['graphColors'][s].B+')';
            datasets.push(
                {
                    label: s,
                    data: [],
                    parsing: {
                        xAxisKey: this.GSDY.D,
                        yAxisKey: this.GSDY.Y
                    },
                    borderColor: color,
                    backgroundColor: color,
                    pointBackgroundColor: color
                }                

            );

        };
    })
    Object.entries(this.pp.grid).forEach(([il,l],index)=>{
        var s=l[this.pp.gridheaders.indexOf(this.GSDY.S)];
        var line: {[key: string]: any}={};
        line[this.GSDY.D]=l[this.pp.gridheaders.indexOf(this.GSDY.D)];
        line[this.GSDY.Y]=l[this.pp.gridheaders.indexOf(this.GSDY.Y)];
        var iii = series.indexOf(s);
        datasets[iii].data.push(line);
        labs.push(this.pp.grid[index][this.pp.gridheaders.indexOf(this.GSDY.D)]);
    })

    //arr.sort((a:{[key: string]: any}, b:{[key: string]: any}) => { return a[this.GSDY.D] < b[this.GSDY.D] ? -1 : 1} );
    labs.sort();

    this.GSDY.data= {
        type: 'line',
        data: {
            datasets: datasets,
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
    this.GSDY.options= {
    };    



  }

  OnPushVal(msg: any) {
    var datasets:any=[]
    var labs:any=[];
    var series:any=[];
    Object.entries(this.pp.grid).forEach(([il,l],index)=>{
        var s=l[this.pp.gridheaders.indexOf(this.GSDY.S)];
        if (!(series.indexOf(s)>-1)) 
        {
            series.push(s);
            var color ='rgb(255,0,0)';
            if ((typeof this.pp.graphParams['graphColors'][s])!="undefined")
            color='rgb('+this.pp.graphParams['graphColors'][s].R+','+this.pp.graphParams['graphColors'][s].G+','+this.pp.graphParams['graphColors'][s].B+')';
            datasets.push(
                {
                    label: s,
                    data: [],
                    parsing: {
                        xAxisKey: this.GSDY.D,
                        yAxisKey: this.GSDY.Y
                    },
                    borderColor: color,
                    backgroundColor: color,
                    pointBackgroundColor: color
                }                

            );

        };
    })
    Object.entries(this.pp.grid).forEach(([il,l],index)=>{
        var s=l[this.pp.gridheaders.indexOf(this.GSDY.S)];
        var line: {[key: string]: any}={};
        line[this.GSDY.D]=l[this.pp.gridheaders.indexOf(this.GSDY.D)];
        line[this.GSDY.Y]=l[this.pp.gridheaders.indexOf(this.GSDY.Y)];
        var iii = series.indexOf(s);
        datasets[iii].data.push(line);
        labs.push(this.pp.grid[index][this.pp.gridheaders.indexOf(this.GSDY.D)]);
    })

    //arr.sort((a:{[key: string]: any}, b:{[key: string]: any}) => { return a[this.GSDY.D] < b[this.GSDY.D] ? -1 : 1} );
    labs.sort();

    this.GSDY.data= {
        type: 'line',
        data: {
            datasets: datasets,
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
    this.GSDY.data.data.labels =labs;
    this.chartGSDY?.update();

  }



}
