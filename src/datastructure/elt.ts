
export class Elt {
    label: string='';
    value: string | number | boolean = false;
    valueN:number=0;
    min: number=0;
    max: number=0;
    step: number=0;
    order: string='';   
    gridvalues :Array<any>=[];
 
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
            this.gridvalues=json['gridvalues'];
        } 
    }
}
