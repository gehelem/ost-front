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
    var datasets:any=[]
    var labs:any=[];
    var series:any=[];
    Object.entries(this.pp.grid).forEach(([il,l],index)=>{
        var s=l[this.pp.gridheaders.indexOf(this.GSXY.S)];
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
                        xAxisKey: this.GSXY.X,
                        yAxisKey: this.GSXY.Y
                    },
                    borderColor: color,
                    backgroundColor: color,
                    pointBackgroundColor: color
                }                
            );
        };
    })
    Object.entries(this.pp.grid).forEach(([il,l],index)=>{
        var s=l[this.pp.gridheaders.indexOf(this.GSXY.S)];
        var line: {[key: string]: any}={};
        line[this.GSXY.X]=l[this.pp.gridheaders.indexOf(this.GSXY.X)];
        line[this.GSXY.Y]=l[this.pp.gridheaders.indexOf(this.GSXY.Y)];
        var iii = series.indexOf(s);
        datasets[iii].data.push(line);
        labs.push(this.pp.grid[index][this.pp.gridheaders.indexOf(this.GSXY.X)]);
    })

    Object.entries(datasets).forEach(([il,l],index)=>{
        datasets[il].data.sort((a:{[key: string]: any}, b:{[key: string]: any}) => { return a[this.GSXY.X] < b[this.GSXY.X] ? -1 : 1} );
    })
    this.GSXY.data= {
        type: 'scatter',
        data: {
            datasets:datasets,
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
    this.GSXY.S=this.pp.graphParams['S'];       
    this.GSXY.X=this.pp.graphParams['X'];       
    this.GSXY.Y=this.pp.graphParams['Y'];
    var datasets:any=[]
    var labs:any=[];
    var series:any=[];
    Object.entries(this.pp.grid).forEach(([il,l],index)=>{
        var s=l[this.pp.gridheaders.indexOf(this.GSXY.S)];
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
                        xAxisKey: this.GSXY.X,
                        yAxisKey: this.GSXY.Y
                    },
                    borderColor: color,
                    backgroundColor: color,
                    pointBackgroundColor: color
                }                
            );
        };
    })
    Object.entries(this.pp.grid).forEach(([il,l],index)=>{
        var s=l[this.pp.gridheaders.indexOf(this.GSXY.S)];
        var line: {[key: string]: any}={};
        line[this.GSXY.X]=l[this.pp.gridheaders.indexOf(this.GSXY.X)];
        line[this.GSXY.Y]=l[this.pp.gridheaders.indexOf(this.GSXY.Y)];
        var iii = series.indexOf(s);
        datasets[iii].data.push(line);
        labs.push(this.pp.grid[index][this.pp.gridheaders.indexOf(this.GSXY.X)]);
    })

    Object.entries(datasets).forEach(([il,l],index)=>{
        datasets[il].data.sort((a:{[key: string]: any}, b:{[key: string]: any}) => { return a[this.GSXY.X] < b[this.GSXY.X] ? -1 : 1} );
    })
    this.GSXY.data= {
        type: 'scatter',
        data: {
            datasets:datasets,
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
    this.chartGXY?.update();
  


  }






}
