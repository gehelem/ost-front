import { Elt } from "./elt";

export class Prp {
    label: string='';
    devcat: string='';
    group: string='';
    order: string='';
    permission: number=0;
    status: number=0;
    rule: number=0; 
    hasprofile: boolean=false;
    URL:string='';

    value: string | number | boolean = false;
    min: number=0;
    max: number=0;
    step: number=0;      
    elts: {[key: string]: Elt} ={};
    grid :Array<Array<any>>=[[]];
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
                });
    
            }
            if (json &&json["grid"]) {
                var grid=json["grid"];
                this.grid.splice(0);
                grid.forEach((ll: any[]) => {
                    this.grid.push(ll);
                });
            }

        }


    }

    setValues(json:any) {
    //if (this.devcat=='messages') this.value=this.value+'\n'+json.value;
    if (this.devcat=='messages') this.value=this.value+'<br>'+json.value;
    else this.value=json.value;            

    if (json &&json["URL"]&&(json["URL"]!='')) {
            this.URL=json.URL+"?"+ new Date().getTime();
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
        }
    }
    resetValues(json:any) {
        this.grid.splice(0);
    }
    

}
