
export class Elt {
    label: string='';
    value: string | number | boolean = false;
    valueN:number=0;
    min: number=0;
    max: number=0;
    step: number=0;
    order: string='';   
    gridvalues :Array<any>=[];
    listOfValues:{[key: string]: string} ={};
    hasLOV=false;
    
    getLov(s:string):string {
        return this.listOfValues[s];
    }
    getValueString(s:any):string {
        return s as string;
    }
 
    isNumber(val: any): boolean { 
        return typeof val === 'number'; 
    }

    setValue (json:any) {
        if (json) {
            this.value=json['value'];
            if (this.isNumber(json['value'])) {
                this.valueN=json['value'];
            }
        } 
    }
    setAll (json:any) {
        if (json) {
            this.label=json['elementLabel'];
            this.value=json['value'];
            if (this.isNumber(json['value'])) {
                this.valueN=json['value'];
            }
            this.min=json['min'];
            this.max=json['max'];
            this.step=json['step'];
            this.order=json['order'];
            if (json['gridvalues']) this.gridvalues=json['gridvalues'];
            if (json['listOfValues']&&json['listOfValues']!='') {
                var vals=json['listOfValues'];
                Object.entries(vals).forEach(([key, value], index) => {
                    console.log("vals ",key,"=",value);
                    this.listOfValues[key]=value as string;
                    this.hasLOV=true;
                });
                console.log("listOfValues ",this.listOfValues);
            }
        } 
    }
    resetValues() {
        //console.log("resetvalues (gggggg before)",this.gridvalues);
        this.gridvalues.splice(0);
        //this.gridvalues=[];
        //console.log("resetvalues (gggggg after )",this.gridvalues);

    }
}
