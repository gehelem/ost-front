import { _MatTabLinkBase } from "@angular/material/tabs";
import { EventEmitter} from '@angular/core';

import { Elt } from "./elt";
import { first } from "rxjs";

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
            this.label=json.propertyLabel;
            this.devcat=json.devcat;
            this.group=json.group;
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
            if (this.devcat=='messages') this.value=this.value+'<br>'+json.value;
            else this.value=json.value; 
            this.min=json.min;
            this.max=json.max;
            this.step=json.step;
            this.displayedColumns.splice(0);
            if (json &&json["elements"]) {
                var elements=json["elements"];
                Object.entries(elements).forEach(([key, value], index) => {
                if(this.elts[key]==undefined) {this.elts[key] = new Elt;}           
                this.elts[key].setAll(value);
                this.displayedColumns.push(key);
                });
                if (this.permission>0) this.displayedColumns.unshift('edit');
    
            }
            if (json &&(json["grid"]||json["grid"]==0)) {  
                console.log('xxxsetall before splice',this.grid2);
                var grid=json["grid"];
                var elements=json["elements"];
                this.grid.splice(0);
                //this.grid=[];
                //this.grid.length=0;
                this.grid2.splice(0);
                //this.grid2=[];
                //this.grid2.length=0;

                Object.entries(this.elts).forEach(([ie,e])=>{
                    this.gridsize=e.gridvalues.length; /* i know this is ugly */
                })
                console.log('xxxsetall after  splice',this.gridsize,"=",this.grid2);

                /*grid.forEach((ll: any[]) => {
                    this.grid.push(ll);
                    var ic=0;
                    var line: {[key: string]: any}=[];
                    Object.entries(this.elts).forEach(([ie,e])=>{
                        line[ie]=ll[ic];
                        ic++;
                    })
                });*/
                //this.grid2=[];
                console.log('xxxsetall after elts  = ',this.elts);               

                for (let i = 0; i < this.gridsize; i++) {
                    var line: {[key: string]: any}=[];
                    Object.entries(this.elts).forEach(([ie,e])=>{
                        line[ie]=e.gridvalues[i];
                    })
                    this.grid2.push(line);
                }                

                console.log('xxxsetall after grid  = ',this.grid );
                console.log('xxxsetall after grid2 = ',this.grid2);
                console.log('xxxsetall after elts  = ',this.elts);
            }
            if (json["GDY"]) {
                this.GDY.D=json.GDY.D;       
                this.GDY.Y=json.GDY.Y;
                this.GDY.data= {
                    type: 'time',
                    data: {
                      datasets: [{
                        label: this.elts[this.GDY.Y].label,
                        data: [],
                        parsing: {
                          xAxisKey: this.GDY.D,
                          yAxisKey: this.GDY.Y
                        }
                      }
                      ],
                      labels:[]
                    },
                    options: {
                        beginAtZero: false
                    }
                  };
                this.GDY.options= {
                    scales: {
                        x: {
                            suggestedMin: 50,
                            suggestedMax: 100
                        }
                    }                    
                };

            }
            if (json["GXY"]) {
                this.GXY.X=json.GXY.X;       
                this.GXY.Y=json.GXY.Y;
                this.GXY.data= {
                    type: 'line',
                    data: {
                      datasets: [{
                        label: this.elts[this.GXY.Y].label,
                        data: [],
                        parsing: {
                          xAxisKey: this.GXY.X,
                          yAxisKey: this.GXY.Y
                        }
                      }
                      ],
                      labels:[]
                    },
                    options: {
                        beginAtZero: false
                    }
                  };
                this.GXY.options= {
                    scales: {
                        x: {
                            sort: true
                        }
                    }                    

                };

            }
            //console.log('xxxGDY============',json["GDY"]);
            //console.log('xxxGXY============',json["GXY"]);
            if (json["GDY"]) {
                var grid=json["grid"];
                //this.GDY.data.data=[];
                var arr:any=[];
                var labs:any=[];
                grid.forEach((ll: any[]) => {
                    var ic=0;
                    var line: {[key: string]: any}={};
                    Object.entries(this.elts).forEach(([ie,e])=>{
                        line[ie]=ll[ic];
                        ic++;
                    })
                    //this.grid2.push(line);
                    arr.push(line);
                    labs.push(line[this.GDY.D]);
                });
                arr.sort((a:{[key: string]: any}, b:{[key: string]: any}) => { return a[this.GXY.X] < b[this.GXY.X] ? -1 : 1} );
                labs.sort();

                this.GDY.data= {
                    type: 'line',
                    data: {
                      datasets: [{
                        label: this.elts[this.GDY.Y].label,
                        //data: [{'snr': 0.28362045632632193, 'time': '27/11/2022 17:33:34 055'},{'snr': 0.28244980458804536, 'time': '27/11/2022 17:33:35 057'},{'snr': 0.28190020114344705, 'time': '27/11/2022 17:33:36 079'}],
                        data: arr,
                        parsing: {
                          xAxisKey: this.GDY.D,
                          yAxisKey: this.GDY.Y
                        }
                      }
                      ],
                      labels:labs
                    },
                    options: {
                        beginAtZero: false
                    }
                  };
                this.GDY.options= {
                };
                console.log('xxxGDY',this.GDY.data);
            };
            if (json["GXY"]) {
                var grid=json["grid"];
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
                    type: 'line',
                    data: {
                      datasets: [{
                        label: this.elts[this.GXY.Y].label,
                        data: arr,
                        parsing: {
                          xAxisKey: this.GXY.X,
                          yAxisKey: this.GXY.Y
                        }
                      }
                      ],
                      labels:labs
                    },
                    options: {
                        beginAtZero: false
                    }
                  };
                this.GXY.options= {
                };
                console.log('xxxGXY',this.GXY.data);
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
            console.log('xxxpushed the line : ',line);            

            if (this.GDY.D!='') {
                this.GDY.data.data.labels.push(line[this.GDY.D]);
                this.GDY.data.data.labels.sort((a:string, b:string) => { return a < b ? -1 : 1} );
                console.log('xxxpushGDY data.data.datasets[0].data before',this.GDY.data.data.datasets[0].data);
                this.GDY.data.data.datasets[0].data.push(line2);
                this.GDY.data.data.datasets[0].data.sort((a:{[key: string]: any}, b:{[key: string]: any}) => { return a[this.GDY.D] < b[this.GDY.D] ? -1 : 1} )
                console.log('xxxpushGDY data.data.datasets[0].data after ',this.GDY.data.data.datasets[0].data);
                //this.GDY.data.data.datasets = this.GDY.data.data.datasets.slice();
            }
            if (this.GXY.X!='') {
                this.GXY.data.data.labels.push(line[this.GXY.X]);
                this.GXY.data.data.labels.sort((a:string, b:string) => { return a < b ? -1 : 1} );
                console.log('xxxpushGXY data.data.datasets[0].data before',this.GXY.data.data.datasets[0].data);
                this.GXY.data.data.datasets[0].data.push(line2);
                this.GXY.data.data.datasets[0].data.sort((a:{[key: string]: any}, b:{[key: string]: any}) => { return a[this.GXY.X] < b[this.GXY.X] ? -1 : 1} )
                console.log('xxxpushGXY data.data.datasets[0].data after ',this.GXY.data.data.datasets[0].data);
                //this.GXY.data.data.datasets = this.GXY.data.data.datasets.slice();
            }
            this.pushVal.emit('toto');
            console.log('xxxpush GDY -------------',this.GDY.data);
            console.log('xxxpush GXY -------------',this.GXY.data);

    }
    resetValues(json:any) {
        console.log("resetvalues (prp)",json);
        this.gridsize=0;
        if (this.GDY.D!='') {
            console.log('xxxresetbefore',this.GDY.data);
            this.GDY.data.data.datasets[0].data.splice(0);
            this.GDY.data.data.labels.splice(0);
            console.log('xxxresetafter',this.GDY.data);
    
        }    
        if (this.GXY.X!='') {
            console.log('xxxresetbefore',this.GXY.data);
            this.GXY.data.data.datasets[0].data.splice(0);
            this.GXY.data.data.labels.splice(0);
            console.log('xxxresetafter',this.GXY.data);
    
        }    
        this.grid.splice(0);
        this.grid2.splice(0);
        Object.entries(this.elts).forEach(([key, value], index) => {
            this.elts[key].resetValues();
            //this.elts[key].gridvalues.splice(0);
            console.log("resetvalues AFTER (elts=======)",this.elts[key].gridvalues);
        });

        this.pushVal.emit('toto');

    }
    

}
