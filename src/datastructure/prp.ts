import { MatTabLink} from "@angular/material/tabs";
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
    preicon1: string='';
    preicon2: string='';
    posticon1: string='';
    posticon2: string='';
    value: string | number | boolean = false;
    min: number=0;
    max: number=0;
    step: number=0;      
    elts: {[key: string]: Elt} ={};
    gridheaders :Array<string>=[];
    grid :Array<Array<any>>=[[]];
    displayedColumns: string[] = [];
    gridsize: number=-1;
    showGrid=false;
    showElts=false;
    hasGrid=false;
    enabled=true;

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
            this.preicon1=json.preicon1;
            this.preicon2=json.preicon2;
            this.posticon1=json.posticon1;
            this.posticon2=json.posticon2;
            this.enabled=json.enabled;

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
                    this.gridsize=this.grid.length;
                }

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
                    this.elts[key].setAll(value,json,);
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

                if (this.graphtype=="PHD") {

    
                }                
    
            }

            this.pushVal.emit('toto');

        }


    }

    setValues(json:any) {
        if (this.devcat=='messages') this.value=this.value+'<br>'+json.value;
        else this.value=json.value;            
        this.enabled=json.enabled;
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


            //if (this.GDY.D!='') {
            //    this.GDY.data.data.labels.push(line[this.GDY.D]);
            //    this.GDY.data.data.labels.sort((a:string, b:string) => { return a < b ? -1 : 1} );
            //    //console.log('xxxpushGDY data.data.datasets[0].data before',this.GDY.data.data.datasets[0].data);
            //    this.GDY.data.data.datasets[0].data.push(line2);
            //    this.GDY.data.data.datasets[0].data.sort((a:{[key: string]: any}, b:{[key: string]: any}) => { return a[this.GDY.D] < b[this.GDY.D] ? -1 : 1} )
            //    //console.log('xxxpushGDY data.data.datasets[0].data after ',this.GDY.data.data.datasets[0].data);
            //    //this.GDY.data.data.datasets = this.GDY.data.data.datasets.slice();
            //}
            //if (this.GPHD.D!='') {
            //    this.GPHD.data.data.labels.push(line[this.GPHD.D]);
            //    this.GPHD.data.data.labels.sort((a:string, b:string) => { return a < b ? -1 : 1} );
            //    //console.log('xxxpushGDY data.data.datasets[0].data before',this.GDY.data.data.datasets[0].data);
            //    this.GPHD.data.data.datasets[0].data.push(line2);
            //    this.GPHD.data.data.datasets[0].data.sort((a:{[key: string]: any}, b:{[key: string]: any}) => { return a[this.GPHD.D] < b[this.GPHD.D] ? -1 : 1} )
            //    this.GPHD.data.data.datasets[1].data.push(line2);
            //    this.GPHD.data.data.datasets[1].data.sort((a:{[key: string]: any}, b:{[key: string]: any}) => { return a[this.GPHD.D] < b[this.GPHD.D] ? -1 : 1} )
            //    this.GPHD.data.data.datasets[2].data.push(line2);
            //    this.GPHD.data.data.datasets[2].data.sort((a:{[key: string]: any}, b:{[key: string]: any}) => { return a[this.GPHD.D] < b[this.GPHD.D] ? -1 : 1} )
            //    this.GPHD.data.data.datasets[3].data.push(line2);
            //    this.GPHD.data.data.datasets[3].data.sort((a:{[key: string]: any}, b:{[key: string]: any}) => { return a[this.GPHD.D] < b[this.GPHD.D] ? -1 : 1} )
            //    //console.log('xxxpushGDY data.data.datasets[0].data after ',this.GDY.data.data.datasets[0].data);
            //    //this.GDY.data.data.datasets = this.GDY.data.data.datasets.slice();
            //}
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
        //if (this.GPHD.D!='') {
        //    //console.log('xxxresetbefore',this.GDY.data);
        //    this.GPHD.data.data.datasets[0].data=[];
        //    this.GPHD.data.data.datasets[1].data=[];
        //    this.GPHD.data.data.datasets[2].data=[];
        //    this.GPHD.data.data.datasets[3].data=[];
        //    this.GPHD.data.data.labels=[];
        //    //console.log('xxxresetafter',this.GDY.data);
    //
        //}    
        //if (this.GXY.X!='') {
        //    //console.log('xxxresetbefore',this.GXY.data);
        //    this.GXY.data.data.datasets[0].data=[];
        //    this.GXY.data.data.labels=[];
        //    //console.log('xxxresetafter',this.GXY.data);
    //
        //}    
        Object.entries(this.elts).forEach(([key, value], index) => {
            this.elts[key].resetValues();
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
