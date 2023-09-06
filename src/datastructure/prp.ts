import { _MatTabLinkBase } from "@angular/material/tabs";
import { EventEmitter} from '@angular/core';

import { Elt } from "./elt";
import { first } from "rxjs";
import { fr } from "date-fns/locale";

export interface mytabledatasource {
    grid2 :Array<{[key: string]: any}>;
}
  
export class Prp {
    pushVal: EventEmitter<any> = new EventEmitter();
    getSubsPush() {
        return this.pushVal;
    }
    
    label: string='';
    devcat: string='';
    group: string='';
    order: string='';
    permission: number=0;
    status: number=0;
    rule: number=0; 
    hasprofile: boolean=false;
    URL:string='';
    video:string='';
    listOfValues:{[key: string]: string} ={};
    hasLOV=false;
    GDY: {D:string;Y:string;data:any;options:any}={
        D: "",
        Y: "",
        data: {},
        options: {}
    };
    GXY: {X:string;Y:string;data:any;options:any}={
        X: "",
        Y: "",
        data: {},
        options: {}
    };
    GPHD: {D:string;RA:string;DE:string;pRA:string;pDE:string;data:any;options:any}={
        D: "",
        RA: "",
        DE: "",
        pRA: "",
        pDE: "",
        data: {},
        options: {}
    };

    value: string | number | boolean = false;
    min: number=0;
    max: number=0;
    step: number=0;      
    elts: {[key: string]: Elt} ={};
    grid :Array<Array<any>>=[[]];
    grid2 :Array<{[key: string]: any}>=[];
    displayedColumns: string[] = [];
    gridsize: number=-1;
    setAll(json:any) {
        if (json!=undefined) {
            this.label=json.label;
            this.devcat=json.level1;
            this.group=json.level2;
            if (json.order) this.order=json.order;
            this.permission=json.permission;
            this.status=json.status;
            this.rule=json.rule;
            this.hasprofile=json.hasprofile;
            if (json &&json["URL"]&&(json["URL"]!='')) {
                this.URL=json.URL+"?"+ new Date().getTime();
            }  
            if (json &&json["video"]&&(json["video"]!='')) {
                this.video=json.video+"?"+ new Date().getTime();
            }
            if (json['listOfValues']&&json['listOfValues']!='') {
                var vals=json['listOfValues'];
                Object.entries(vals).forEach(([key, value], index) => {
                    //console.log("vals ",key,"=",value);
                    this.listOfValues[key]=value as string;
                    this.hasLOV=true;
                });
                //console.log("listOfValues ",this.listOfValues);
            }

            if (this.devcat=='messages') this.value=this.value+'<br>'+json.value;
            else this.value=json.value; 
            this.min=json.min;
            this.max=json.max;
            this.step=json.step;
            this.displayedColumns.splice(0);
            if (json &&json["elements"]) {
                var elements=json["elements"];
                if (json &&(json["grid"]||json["grid"]==0)) {  
                    this.grid2.splice(0);
                    /* the purpose of this crap is to count how many items are present in "gridvalues" */
                    /* we assume each element contains the same number of gridvalues ... we'll have to handle this someday ... */
                    for (let key in json["elements"]) {
                        let v= json["elements"][key]["gridvalues"];
                        if (json["elements"][key].type!='graph'&&v) this.gridsize=json.elements[key].gridvalues.length;
                    }
                    for (let i = 0; i < this.gridsize; i++) {
                        var line: {[key: string]: any}=[];
                        Object.entries(elements).forEach(([key, value], index) => {
                            //line[index]=json["elements"][key].gridvalues[i];
                            if (json["elements"][key].type!='graph') line[key]=json["elements"][key].gridvalues[i];
                        });
        
                        this.grid2.push(line);
                    }                
                }
                var elementswithgrid :typeof elements= {};
                //console.log("before remove ",elements);
                Object.entries(elements).forEach(([key, value], index) => {
                    if (elements[key]["type"]!='graph') {
                        //console.log("remove ",key);
                        elementswithgrid[key]=elements[key];
                    }
                });
                //console.log("after remove ",elements);
                //console.log("after remove ",elementswithgrid);

                elementswithgrid=Object.keys(json["elements"]).sort(function(a:any, b:any){
                    var aa = json["elements"][a]["order"];
                    var bb = json["elements"][b]["order"];
                    return aa < bb ? -1 : (aa> bb ? 1 : 0);
                });

                Object.entries(elementswithgrid).forEach(([key, value], index) => {
                    this.displayedColumns.push(value as string);
                });
                if (this.permission>0) this.displayedColumns.unshift('edit');

                Object.entries(elements).forEach(([key, value], index) => {
                    if(this.elts[key]==undefined) {this.elts[key] = new Elt;}           
                    this.elts[key].setAll(value,json,this.grid2);
                });
            }
            if (json &&(json["grid"]||json["grid"]==0)) {  
                //console.log('xxxsetall before splice',this.grid2);
                elements=json["elements"];

            }
            //console.log('xxxGDY============',json["GDY"]);
            //console.log('xxxGXY============',json["GXY"]);
            if (json["GDY"]) {
                this.GDY.D=json.GDY.D;       
                this.GDY.Y=json.GDY.Y;
                //var grid=json["grid"];
                //this.GDY.data.data=[];
                var arr:any=[];
                var labs:any=[];
                Object.entries(this.grid2).forEach(([il,l])=>{
                    var line: {[key: string]: any}={};
                    line[this.GDY.D]=l[this.GDY.D];
                    line[this.GDY.Y]=l[this.GDY.Y];
                    arr.push(line);
                    labs.push(l[this.GDY.D]);
                })
                arr.sort((a:{[key: string]: any}, b:{[key: string]: any}) => { return a[this.GDY.D] < b[this.GDY.D] ? -1 : 1} );
                labs.sort();

                this.GDY.data= {
                    type: 'line',
                    data: {
                      datasets: [{
                        label: this.elts[this.GDY.Y].label,
                        data: arr,
                        parsing: {
                          xAxisKey: this.GDY.D,
                          yAxisKey: this.GDY.Y
                        },
                        borderColor: 'rgba(255, 0, 0, 1)',
                        backgroundColor: 'rgba(255, 0, 0, 1)',
                        pointBackgroundColor: 'rgba(255, 0, 0, 1)'
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
                //console.log('xxxGDY',this.GDY.data);
            };
            if (json["GXY"]) {
                this.GXY.X=json.GXY.X;       
                this.GXY.Y=json.GXY.Y;
                //var grid=json["grid"];
                //this.GXY.data.data=[];
                var arr:any=[];
                var labs:any=[];
                Object.entries(this.grid2).forEach(([il,l])=>{
                    var line: {[key: string]: any}={};
                    line[this.GXY.X]=l[this.GXY.X];
                    line[this.GXY.Y]=l[this.GXY.Y];
                    arr.push(line);
                    labs.push(l[this.GXY.X]);
                })
                arr.sort((a:{[key: string]: any}, b:{[key: string]: any}) => { return a[this.GXY.X] < b[this.GXY.X] ? -1 : 1} );
                labs.sort((a:string, b:string) => { return a < b ? -1 : 1} );
                this.GXY.data= {
                    type: 'scatter',
                    data: {
                      datasets: [{
                        //label: this.elts[this.GXY.Y].label,
                        label: this.label,
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
                                text: this.elts[this.GXY.Y].label
                              }
                            },
                            x: {
                                title: {
                                  display: true,
                                  text: this.elts[this.GXY.X].label
                                }
                            }
                          }                    
                    }                    
                  };
                this.GXY.options= {
                };
                //console.log('xxxGXY',this.GXY.data);
            };
            if (json["GPHD"]) {
                this.GPHD.D=json.GPHD.D;       
                this.GPHD.RA=json.GPHD.RA;
                this.GPHD.DE=json.GPHD.DE;
                this.GPHD.pRA=json.GPHD.pRA;
                this.GPHD.pDE=json.GPHD.pDE;
                //var grid=json["grid"];
                //this.GDY.data.data=[];
                var arr:any=[];
                var labs:any=[];
                Object.entries(this.grid2).forEach(([il,l])=>{
                    var line: {[key: string]: any}={};
                    line[this.GPHD.D]=l[this.GPHD.D];
                    line[this.GPHD.RA]=l[this.GPHD.RA];
                    line[this.GPHD.DE]=l[this.GPHD.DE];
                    line[this.GPHD.pRA]=l[this.GPHD.pRA];
                    line[this.GPHD.pDE]=l[this.GPHD.pDE];
                    arr.push(line);
                    labs.push(l[this.GPHD.D]);
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
                                text: 'Drift'
                              }

                            },
                            y1: {
                                stacked: false,
                                position: 'right',
                                title: {
                                    display: true,
                                    text: 'Pulse'
                                  }
  
                            }
                        }
                      
                    }
                  };
                this.GPHD.options= {
                };
                //console.log('xxxGPHD',this.GPHD.data);
            };

            this.pushVal.emit('toto');

        }


    }

    setValues(json:any) {
        //if (this.devcat=='messages') this.value=this.value+'\n'+json.value;
        if (this.devcat=='messages') this.value=this.value+'<br>'+json.value;
        else this.value=json.value;            
        this.status=json.status;

        if (json &&json["URL"]&&(json["URL"]!='')) {
            this.URL=json.URL+"?"+ new Date().getTime();
        }     
        
        if (json &&json["video"]&&(json["video"]!='')) {
            this.video=json.video+"?"+ new Date().getTime();
        }     
        if (json &&json["elements"]) {
            var elements=json["elements"];
            Object.entries(elements).forEach(([key, value], index) => {
              if(this.elts[key]==undefined) {this.elts[key] = new Elt;}           
              this.elts[key].setValue(value);
            });
   
        }

    }
    pushValues(json:any) {
        //console.log('pushValues',json);

            //var line:any[]=json["values"];
            //this.grid.push(line);

            var ic=0;
            Object.entries(this.elts).forEach(([ie,e])=>{
                this.elts[ie].gridvalues.push(json[ie].gridvalues[0]);
            })
            //console.log('pushValues elts after',this.elts);
            this.gridsize++;
            var line: {[key: string]: any}=[];
            var line2: {[key: string]: any}={};
            Object.entries(this.elts).forEach(([ie,e])=>{
                line[ie]=json[ie].gridvalues[0];
                line2[ie]=json[ie].gridvalues[0];
            })
            this.grid2.push(line);
            //console.log('xxxpushed the line : ',line);            

            if (this.GDY.D!='') {
                this.GDY.data.data.labels.push(line[this.GDY.D]);
                this.GDY.data.data.labels.sort((a:string, b:string) => { return a < b ? -1 : 1} );
                //console.log('xxxpushGDY data.data.datasets[0].data before',this.GDY.data.data.datasets[0].data);
                this.GDY.data.data.datasets[0].data.push(line2);
                this.GDY.data.data.datasets[0].data.sort((a:{[key: string]: any}, b:{[key: string]: any}) => { return a[this.GDY.D] < b[this.GDY.D] ? -1 : 1} )
                //console.log('xxxpushGDY data.data.datasets[0].data after ',this.GDY.data.data.datasets[0].data);
                //this.GDY.data.data.datasets = this.GDY.data.data.datasets.slice();
            }
            if (this.GPHD.D!='') {
                this.GPHD.data.data.labels.push(line[this.GPHD.D]);
                this.GPHD.data.data.labels.sort((a:string, b:string) => { return a < b ? -1 : 1} );
                //console.log('xxxpushGDY data.data.datasets[0].data before',this.GDY.data.data.datasets[0].data);
                this.GPHD.data.data.datasets[0].data.push(line2);
                this.GPHD.data.data.datasets[0].data.sort((a:{[key: string]: any}, b:{[key: string]: any}) => { return a[this.GPHD.D] < b[this.GPHD.D] ? -1 : 1} )
                this.GPHD.data.data.datasets[1].data.push(line2);
                this.GPHD.data.data.datasets[1].data.sort((a:{[key: string]: any}, b:{[key: string]: any}) => { return a[this.GPHD.D] < b[this.GPHD.D] ? -1 : 1} )
                this.GPHD.data.data.datasets[2].data.push(line2);
                this.GPHD.data.data.datasets[2].data.sort((a:{[key: string]: any}, b:{[key: string]: any}) => { return a[this.GPHD.D] < b[this.GPHD.D] ? -1 : 1} )
                this.GPHD.data.data.datasets[3].data.push(line2);
                this.GPHD.data.data.datasets[3].data.sort((a:{[key: string]: any}, b:{[key: string]: any}) => { return a[this.GPHD.D] < b[this.GPHD.D] ? -1 : 1} )
                //console.log('xxxpushGDY data.data.datasets[0].data after ',this.GDY.data.data.datasets[0].data);
                //this.GDY.data.data.datasets = this.GDY.data.data.datasets.slice();
            }
            if (this.GXY.X!='') {
                //this.GXY.data.data.labels.push(line[this.GXY.X]);
                //this.GXY.data.data.labels.sort((a:string, b:string) => { return a < b ? -1 : 1} );
                //console.log('xxxpushGXY data.data.datasets[0].data before',this.GXY.data.data.datasets[0].data);
                this.GXY.data.data.datasets[0].data.push(line2);
                this.GXY.data.data.datasets[0].data.sort((a:{[key: string]: any}, b:{[key: string]: any}) => { return a[this.GXY.X] < b[this.GXY.X] ? -1 : 1} )
                //console.log('xxxpushGXY data.data.datasets[0].data after ',this.GXY.data.data.datasets[0].data);
                //this.GXY.data.data.datasets = this.GXY.data.data.datasets.slice();
            }
            if (json &&json["elements"]) {
                var elements=json["elements"];
                Object.entries(elements).forEach(([key, value], index) => {
                  this.elts[key].pushValues(json);
                });
       
            }
            this.pushVal.emit('toto');
    
            //console.log('xxxpush GDY -------------',this.GDY.data);
            //console.log('xxxpush GXY -------------',this.GXY.data);

    }
    resetValues(json:any) {
        //console.log("resetvalues (prp)",json);
        this.gridsize=0;
        if (this.GDY.D!='') {
            //console.log('xxxresetbefore',this.GDY.data);
            this.GDY.data.data.datasets[0].data=[];
            this.GDY.data.data.labels=[];
            //console.log('xxxresetafter',this.GDY.data);
    
        }    
        if (this.GPHD.D!='') {
            //console.log('xxxresetbefore',this.GDY.data);
            this.GPHD.data.data.datasets[0].data=[];
            this.GPHD.data.data.datasets[1].data=[];
            this.GPHD.data.data.datasets[2].data=[];
            this.GPHD.data.data.datasets[3].data=[];
            this.GPHD.data.data.labels=[];
            //console.log('xxxresetafter',this.GDY.data);
    
        }    
        if (this.GXY.X!='') {
            //console.log('xxxresetbefore',this.GXY.data);
            this.GXY.data.data.datasets[0].data=[];
            this.GXY.data.data.labels=[];
            //console.log('xxxresetafter',this.GXY.data);
    
        }    
        this.grid=[];
        this.grid2=[];
        Object.entries(this.elts).forEach(([key, value], index) => {
            this.elts[key].resetValues();
            //this.elts[key].gridvalues.splice(0);
            //console.log("resetvalues AFTER (elts=======)",this.elts[key].gridvalues);
        });

        this.pushVal.emit('toto');

    }
    getLov(s:string):string {
        return this.listOfValues[s];
    }
    getValueString(s:any):string {
        return s as string;
    }  
        

}
