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
    badge=false;
    hasgraph: boolean=false;
    graphtype: string='';
    graphParams :{[key: string]: any}={};

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
    grid2 :Array<{[key: string]: any}>=[];
    gridheaders :Array<string>=[];
    grid :Array<Array<any>>=[[]];
    displayedColumns: string[] = [];
    gridsize: number=-1;
    showGrid=false;
    showElts=false;
    hasGrid=false;
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
            this.badge=json.badge;
            this.hasGrid=json.hasGrid;
            this.showGrid=json.showGrid;
            this.showElts=json.showElts;

            if (json &&json["grid"]) {
                this.grid=json.grid;
            }  

            if (json &&json["gridheaders"]) {
                this.gridheaders=json.gridheaders;
            }  
            if (this.label=="Grid example") {
                //console.log(this.gridheaders);
                //console.log(this.grid);
            }

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
                if (json &&(json["hasGrid"])) {  
                    this.grid2.splice(0);
                    this.gridsize=0;                    
                    /* the purpose of this crap is to count how many items are present in "gridvalues" */
                    /* we assume each element contains the same number of gridvalues ... we'll have to handle this someday ... */
                    this.gridsize=this.grid.length;
                    //for (let i = 0; i < this.gridsize; i++) {
                    //    var line: {[key: string]: any}=[];
                    //    Object.entries(elements).forEach(([key, value], index) => {
                    //        //line[index]=json["elements"][key].gridvalues[i];
                    //        if ((json["elements"][key].type!='graph')&& 
                    //        (json["elements"][key].type!='img')&& 
                    //        (json["elements"][key].type!='message')&& 
                    //        (json["elements"][key].type!='bool')&& 
                    //        (json["elements"][key].type!='video'))
                    //        console.log(this.label,key,line);
                    //        line[key]=json["elements"][key].gridvalues[i];
                    //    });
                    //    this.grid2.push(line);
                    //}                
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

                Object.entries(this.gridheaders).forEach(([key, value], index) => {
                    this.displayedColumns.push(value as string);
                });
                if (this.permission>0) {
                    this.displayedColumns.unshift('editedit');
                    //console.log(this.displayedColumns);
                    //console.log(this.gridheaders);
                }    
                Object.entries(elements).forEach(([key, value], index) => {
                    if(this.elts[key]==undefined) {this.elts[key] = new Elt;}           
                    this.elts[key].setAll(value,json,this.grid2);
                });
            }
            if (json &&(json["grid"]||json["grid"]==0)) {  
                //console.log('xxxsetall before splice',this.grid2);
                elements=json["elements"];

            }
            this.hasgraph=json['hasGraph'];
            if (this.hasgraph) {
                this.graphtype=json['graphType'];
                this.graphParams=json.graphParams;

                if (this.graphtype=="DY") {
                }
                if (this.graphtype=="PHD") {
                    this.GPHD.D=json['params']['D'];       
                    this.GPHD.RA=json['params']['RA'];
                    this.GPHD.DE=json['params']['DD'];                    
                    this.GPHD.pRA=json['params']['pRA'];
                    this.GPHD.pDE=json['params']['pDE'];
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
    
                }                
    
            }

            this.pushVal.emit('toto');

        }


    }

    setValues(json:any) {
        if (this.devcat=='messages') this.value=this.value+'<br>'+json.value;
        else this.value=json.value;            
        this.status=json.status;
        if (json.badge) {
            this.badge=json.badge;
        }
        if (json &&json["URL"]&&(json["URL"]!='')) {
            this.URL=json.URL+"?"+ new Date().getTime();
        }     
        
        if (json &&json["video"]&&(json["video"]!='')) {
            this.video=json.video+"?"+ new Date().getTime();
        }     

        if (json &&json["grid"]) {
            this.grid=json.grid;
            this.gridsize=this.grid.length;

        }  

        if (json &&json["elements"]) {
            var elements=json["elements"];
            Object.entries(elements).forEach(([key, value], index) => {
              if(this.elts[key]==undefined) {this.elts[key] = new Elt;}           
              this.elts[key].setValue(value);
            });
        }
        this.pushVal.emit('toto');

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

            //if (this.GDY.D!='') {
            //    this.GDY.data.data.labels.push(line[this.GDY.D]);
            //    this.GDY.data.data.labels.sort((a:string, b:string) => { return a < b ? -1 : 1} );
            //    //console.log('xxxpushGDY data.data.datasets[0].data before',this.GDY.data.data.datasets[0].data);
            //    this.GDY.data.data.datasets[0].data.push(line2);
            //    this.GDY.data.data.datasets[0].data.sort((a:{[key: string]: any}, b:{[key: string]: any}) => { return a[this.GDY.D] < b[this.GDY.D] ? -1 : 1} )
            //    //console.log('xxxpushGDY data.data.datasets[0].data after ',this.GDY.data.data.datasets[0].data);
            //    //this.GDY.data.data.datasets = this.GDY.data.data.datasets.slice();
            //}
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
        //if (this.GDY.D!='') {
        //    //console.log('xxxresetbefore',this.GDY.data);
        //    this.GDY.data.data.datasets[0].data=[];
        //    this.GDY.data.data.labels=[];
        //    //console.log('xxxresetafter',this.GDY.data);
    //
        //}    
        if (this.GPHD.D!='') {
            //console.log('xxxresetbefore',this.GDY.data);
            this.GPHD.data.data.datasets[0].data=[];
            this.GPHD.data.data.datasets[1].data=[];
            this.GPHD.data.data.datasets[2].data=[];
            this.GPHD.data.data.datasets[3].data=[];
            this.GPHD.data.data.labels=[];
            //console.log('xxxresetafter',this.GDY.data);
    
        }    
        //if (this.GXY.X!='') {
        //    //console.log('xxxresetbefore',this.GXY.data);
        //    this.GXY.data.data.datasets[0].data=[];
        //    this.GXY.data.data.labels=[];
        //    //console.log('xxxresetafter',this.GXY.data);
    //
        //}    
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
