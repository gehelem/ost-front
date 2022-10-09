export class Elt {
    label: string='';
    value: string | number | boolean = false;
    min: number=0;
    max: number=0;
    step: number=0;
    order: string='';   
    setValue (json:any) {
        if (json) {
            this.value=json['value'];
        } 
    }
    setAll (json:any) {
        if (json) {
            this.label=json['elementLabel'];
            this.value=json['value'];
            this.min=json['min'];
            this.max=json['max'];
            this.step=json['step'];
            this.order=json['order'];
        } 
    }
}
