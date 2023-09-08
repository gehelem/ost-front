import { EventEmitter} from '@angular/core';


export class Elt {
    pushVal: EventEmitter<any> = new EventEmitter();
    getSubsPush() {
        return this.pushVal;
    }
    label: string='';
    type: string='';
    graphtype: string='';
    X: string='';
    Y: string='';
    D: string='';
    value: string | number | boolean = false;
    valueN:number=0;
    min: number=0;
    max: number=0;
    step: number=0;
    order: string='';   
    gridvalues :Array<any>=[];
    listOfValues:{[key: string|number]: string} ={};
    urljpeg: string='';   
    hasLOV=false;
    grid2 :Array<{[key: string]: any}>=[];
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

    
    getLov(s:string|number):string {
        return this.listOfValues[s];
    }
    getLovAny(s:any):string {
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
    setAll (json:any,propjson:any,grid2 :Array<{[key: string]: any}>) {
        if (json) {
            this.grid2=grid2;
            this.type=json['type'];
            this.label=json['label'];
            this.value=json['value'];
            if (this.isNumber(json['value'])) {
                this.valueN=json['value'];
            }
            this.min=json['min'];
            this.max=json['max'];
            this.step=json['step'];
            this.order=json['order'];
            if (this.type=='img') this.urljpeg=json['value']['urljpeg'];
            if (json['gridvalues']) this.gridvalues=json['gridvalues'];
            if (json['listOfValues']&&json['listOfValues']!='') {
                var vals=json['listOfValues'];
                this.hasLOV=true;
                Object.entries(vals).forEach(([key, value], index) => {
                    //console.log("vals ",key,"=",value);
                    this.listOfValues[key]=value as string;
                });
                //console.log("listOfValues ",this.listOfValues);
            }
            if (this.type=='graph') {
                this.graphtype=json['graphtype'];
                if (this.graphtype=="XY") {
                    this.GXY.X=json.params.X;       
                    this.GXY.Y=json.params.Y;
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
                            label: propjson["elements"][this.GXY.Y].label,
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
                                    text: propjson["elements"][this.GXY.Y].label
                                  }
                                },
                                x: {
                                    title: {
                                      display: true,
                                      text: propjson["elements"][this.GXY.X].label
                                    }
                                }
                              }                    
                        }                    
                      };
                    this.GXY.options= {
                    };

                }
                if (this.graphtype=="DY") {
                    this.D=json['params']['D'];
                    this.Y=json['params']['Y'];
                }
                //console.log("grph : ",this.X,this.Y,this.D);
            }
            this.pushVal.emit('from elts '+this.label);
        } 
    }
    resetValues() {
        this.gridvalues.splice(0);
        this.GXY.data.data.datasets[0].data=[];
        this.GXY.data.data.labels=[];        

    }
    pushValues(json:any) {
        console.log('pushValues ELT',json);    
        var ic=0;
        var line: {[key: string]: any}=[];
        var line2: {[key: string]: any}={};
        Object.entries(json["elements"]).forEach(([ie,e])=>{
            line[ie]=json[ie].gridvalues[0];
            line2[ie]=json[ie].gridvalues[0];
        })

        if (this.graphtype=='XY') {
            this.GXY.data.data.datasets[0].data.push(line2);
            this.GXY.data.data.datasets[0].data.sort((a:{[key: string]: any}, b:{[key: string]: any}) => { return a[this.GXY.X] < b[this.GXY.X] ? -1 : 1} )
        }
        this.pushVal.emit('toto');





    }
}
