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
                    type: 'line',
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
                };

            }
            if (json["GDY"]&&json["grid"]) {
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

    


                /*this.GDY.data.data.labels.splice(0);
                this.GDY.data.data.datasets[0].data.splice(0);
                var grid=json["grid"];
                grid.forEach((ll: any[]) => {
                    this.GDY.data.data.labels.push(ll[1]);
                    this.GDY.data.data.datasets[0].data.push(ll[0]);
                });*/
                console.log('xxxGDY',this.GDY.data);

            };



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
            var line2: {[key: string]: any}={};
            Object.entries(this.elts).forEach(([ie,e])=>{
                this.elts[ie].gridvalues.push(json[ie].gridvalues[0]);
            })
            //console.log('pushValues elts after',this.elts);
            this.gridsize++;
            var line: {[key: string]: any}=[];
            Object.entries(this.elts).forEach(([ie,e])=>{
                line[ie]=json[ie].gridvalues[0];
            })
            this.grid2.push(line);
            //console.log('xxxpushed the line : ',line);            

            if (this.GDY.D!='') {
                this.GDY.data.data.labels.push(line[this.GDY.D]);
                //console.log('xxxpushGDY data.data.datasets[0].data before',this.GDY.data.data.datasets[0].data);
                this.GDY.data.data.datasets[0].data.push(line);
                //console.log('xxxpushGDY data.data.datasets[0].data after ',this.GDY.data.data.datasets[0].data);
                this.GDY.data.data.datasets = this.GDY.data.data.datasets.slice();


            }
            this.pushVal.emit('toto');
            console.log('xxxpush -------------',this.GDY.data);

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
