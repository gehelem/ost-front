import { _MatTabLinkBase } from "@angular/material/tabs";
import { EventEmitter} from '@angular/core';

import { Elt } from "./elt";

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
    setAll(json:any) {
        if (json!=undefined) {
            this.label=json.propertyLabel;
            this.devcat=json.devcat;
            this.group=json.group;
            this.order=json.order;
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
    
            }
            if (json &&json["grid"]) {
                var grid=json["grid"];
                this.grid.splice(0);
                this.grid2.splice(0);
                grid.forEach((ll: any[]) => {
                    this.grid.push(ll);
                    var ic=0;
                    var line: {[key: string]: any}=[];
                    Object.entries(this.elts).forEach(([ie,e])=>{
                        line[ie]=ll[ic];
                        ic++;
                    })
                    this.grid2.push(line);
                });
                console.log('xxxsetall',this.grid2);
            }

            if (json["GDY"]&&json["grid"]) {
                var grid=json["grid"];
                //this.GDY.data.data=[];
                var arr:any=[];
                var labs:any=[];
                this.GDY.D=json.GDY.D;       
                this.GDY.Y=json.GDY.Y;
                grid.forEach((ll: any[]) => {
                    var ic=0;
                    var line: {[key: string]: any}={};
                    Object.entries(this.elts).forEach(([ie,e])=>{
                        line[ie]=ll[ic];
                        ic++;
                    })
                    this.grid2.push(line);
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
        if (json &&json["values"]) {
            var line:any[]=json["values"];
            this.grid.push(line);

            var ic=0;
            var line2: {[key: string]: any}={};
            Object.entries(this.elts).forEach(([ie,e])=>{
                line2[ie]=line[ic];
                ic++;
            })
            this.grid2.push(line2);

            if (this.GDY.D!='') {
                this.GDY.data.data.labels.push(line2[this.GDY.D]);
                this.GDY.data.data.datasets[0].data.push(line2);
                this.GDY.data.data.datasets = this.GDY.data.data.datasets.slice();


            }
            this.pushVal.emit('toto');
            console.log('xxxpushGDY',this.GDY.data);
        }
    }
    resetValues(json:any) {
        console.log("resetvalues (prp)",json);
        if (this.GDY.D!='') {
            console.log('xxxresetbefore',this.GDY.data);
            this.GDY.data.data.datasets[0].data.splice(0);
            this.GDY.data.data.labels.splice(0);
            console.log('xxxresetafter',this.GDY.data);
    
        }    
        this.grid.splice(0);
        this.grid2.splice(0);
        this.grid2=[];

    }
    

}
