import { Component, OnInit,Input,ViewChild } from '@angular/core';
import { WebsocketService } from '../../websocket.service';
import { BaseChartDirective } from 'ng2-charts';

import { Elt } from 'src/datastructure/elt';
import { mytabledatasource, Prp } from 'src/datastructure/prp';
import { Mod } from 'src/datastructure/mod';
import { MatTable as MatTable } from '@angular/material/table';
import { fr } from "date-fns/locale";

@Component({
  selector: 'app-graph-phd',
  templateUrl: './graph-phd.component.html',
  styleUrls: ['./graph-phd.component.css']
})
export class GraphPhdComponent implements OnInit {
    @Input() mod!: string;
    @Input() prop!: string;
    subsPush: any;
    @ViewChild(BaseChartDirective) public chartGPHD?: BaseChartDirective;

    GPHD: {D:string;RA:string;DE:string;pRA:string;pDE:string;RSB:string;RMS:string;data:any;options:any}={
      D: "",
      RA: "",
      DE: "",
      pRA: "",
      pDE: "",
      RSB: "",
      RMS: "",
      data: {},
      options: {}
    };
    pp!:Prp;
  
    constructor(public ws:WebsocketService) { }
  
    ngOnInit(): void {
      this.subsPush = this.ws.datastore.mods[this.mod].prps[this.prop].getSubsPush()
      .subscribe( msg => this.OnPushVal(msg)); 
      
      this.pp=this.ws.datastore.mods[this.mod].prps[this.prop];
      this.GPHD.D=this.pp.graphParams['D'];       
      this.GPHD.RA=this.pp.graphParams['RA'];       
      this.GPHD.DE=this.pp.graphParams['DE'];       
      this.GPHD.pRA=this.pp.graphParams['pRA'];       
      this.GPHD.pDE=this.pp.graphParams['pDE'];       
      this.GPHD.RSB=this.pp.graphParams['RSB'];       
      this.GPHD.RMS=this.pp.graphParams['RMS'];       
      var arr:any=[];
      var labs:any=[];

      Object.entries(this.pp.grid).forEach(([il,l],index)=>{
        var line: {[key: string]: any}={};
        line[this.GPHD.D]=l[this.pp.gridheaders.indexOf(this.GPHD.D)];
        line[this.GPHD.RA]=l[this.pp.gridheaders.indexOf(this.GPHD.RA)];
        line[this.GPHD.DE]=l[this.pp.gridheaders.indexOf(this.GPHD.DE)];
        line[this.GPHD.pRA]=l[this.pp.gridheaders.indexOf(this.GPHD.pRA)];
        line[this.GPHD.pDE]=l[this.pp.gridheaders.indexOf(this.GPHD.pDE)];
        line[this.GPHD.RSB]=l[this.pp.gridheaders.indexOf(this.GPHD.RSB)];
        line[this.GPHD.RMS]=l[this.pp.gridheaders.indexOf(this.GPHD.RMS)];
        
        arr.push(line);
        labs.push(this.pp.grid[index][this.pp.gridheaders.indexOf(this.GPHD.D)]);
      })
      arr.sort((a:{[key: string]: any}, b:{[key: string]: any}) => { return a[this.GPHD.D] < b[this.GPHD.D] ? -1 : 1} );
      labs.sort();


      this.GPHD.data= {
          type: 'line',
          data: {
              datasets: [
              {
              type: 'line',
              label: 'RA drift',
              borderColor: 'rgba(0, 255, 0, 1)',
              backgroundColor: 'rgba(0, 255, 0, 1)',
              pointBackgroundColor: 'rgba(0, 255, 0, 1)',
              data: arr,
              yAxisID: 'y',
              parsing: {
                  xAxisKey: this.GPHD.D,
                  yAxisKey: this.GPHD.RA
              }
              },
              {
              type: 'line',
              label: 'DE drift',
              backgroundColor: 'rgba(0, 0, 255, 1)',
              borderColor: 'rgba(0, 0, 255, 1)',
              pointBackgroundColor: 'rgba(0, 0, 255, 1)',
              data: arr,
              yAxisID: 'y',
              parsing: {
                  xAxisKey: this.GPHD.D,
                  yAxisKey: this.GPHD.DE
              }
              },
              {
              type: 'bar',
              label: 'RA pulse',
              backgroundColor: 'rgba(0, 255, 0, 0.2)',
              data: arr,
              yAxisID: 'y1',
              //stacked: true,
              parsing: {
                  xAxisKey: this.GPHD.D,
                  yAxisKey: this.GPHD.pRA
              }
              },
              {
              type: 'bar',
              label: 'DE pulse',
              backgroundColor: 'rgba(0, 0, 255, 0.2)',
              data: arr,
              yAxisID: 'y1',
              //stacked: true,
              parsing: {
                  xAxisKey: this.GPHD.D,
                  yAxisKey: this.GPHD.pDE
              }
              },
              {
                type: 'line',
                label: 'RSB',
                backgroundColor: 'rgba(255, 0, 0, 1)',
                borderColor: 'rgba(255, 0, 0, 1)',
                pointBackgroundColor: 'rgba(255, 0, 0, 1)',
                data: arr,
                yAxisID: 's',
                parsing: {
                    xAxisKey: this.GPHD.D,
                    yAxisKey: this.GPHD.RSB
                }
              },
              {
                type: 'line',
                label: 'RMS',
                backgroundColor: 'rgba(255, 255, 0, 1)',
                borderColor: 'rgba(255, 255, 0, 1)',
                pointBackgroundColor: 'rgba(255, 255, 0, 1)',
                data: arr,
                yAxisID: 'y',
                parsing: {
                    xAxisKey: this.GPHD.D,
                    yAxisKey: this.GPHD.RMS
                }
              }

  
              
              ],
              labels:labs
          },
          options: {
              animation: false,
              beginAtZero: false,
              scales: {
                  x: {
                      stacked: false,
                      type:'time',
                      time: {
                          displayFormats: {
                              second: 'hh:mm'
                          }
                      },                                
                      //unit: 'second',
                      adapters: { 
                          date: {
                              locale: fr 
                          }
                      }
                  },
                  y: {
                      stacked: false,
                      position: 'left',
                      title: {
                      display: true,
                      text: 'RA/DE Drift - Total RMS'
                      }

                  },
                  y1: {
                      stacked: false,
                      position: 'right',
                      title: {
                          display: true,
                          text: 'Pulse'
                          }

                  },
                  s: {
                    stacked: false,
                    position: 'right',
                    min:0,
                    title: {
                        display: true,
                        text: 'SNR'
                        }

                  }
            }
              
          }
          };
      this.GPHD.options= {
      };      


    }
  
    OnPushVal(msg: any) {
      var arr:any=[];
      var labs:any=[];
      Object.entries(this.pp.grid).forEach(([il,l],index)=>{
          var line: {[key: string]: any}={};
          line[this.GPHD.D]=l[this.pp.gridheaders.indexOf(this.GPHD.D)];
          line[this.GPHD.RA]=l[this.pp.gridheaders.indexOf(this.GPHD.RA)];
          line[this.GPHD.DE]=l[this.pp.gridheaders.indexOf(this.GPHD.DE)];
          line[this.GPHD.pRA]=l[this.pp.gridheaders.indexOf(this.GPHD.pRA)];
          line[this.GPHD.pDE]=l[this.pp.gridheaders.indexOf(this.GPHD.pDE)];
          line[this.GPHD.RSB]=l[this.pp.gridheaders.indexOf(this.GPHD.RSB)];
          line[this.GPHD.RMS]=l[this.pp.gridheaders.indexOf(this.GPHD.RMS)];
          arr.push(line);
          labs.push(this.pp.grid[index][this.pp.gridheaders.indexOf(this.GPHD.D)]);

      })
      this.GPHD.data.data.datasets[0].data =arr;
      this.GPHD.data.data.datasets[1].data =arr;
      this.GPHD.data.data.datasets[2].data =arr;
      this.GPHD.data.data.datasets[3].data =arr;
      this.GPHD.data.data.datasets[4].data =arr;
      this.GPHD.data.data.datasets[5].data =arr;
      this.GPHD.data.data.labels =labs;
      arr.sort((a:{[key: string]: any}, b:{[key: string]: any}) => { return a[this.GPHD.D] < b[this.GPHD.D] ? -1 : 1} );
      labs.sort();
      this.chartGPHD?.update();
    }
  
  
  
  }
  