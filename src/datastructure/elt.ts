import { EventEmitter} from '@angular/core';
import { fr } from "date-fns/locale";


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
    hint:string='';
    min: number=0;
    max: number=0;
    step: number=0;
    order: string='';   
    gridvalues :Array<any>=[];
    listOfValues:{[key: string|number]: string} ={};
    urljpeg: string='';   
    hasLOV=false;
    hasGlobalLOV=false;
    globallov:string='';
    directedit:boolean=false;    
    preicon:string='';
    posticon:string='';
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
            if (this.type=="img") {
                this.urljpeg=json['value']['urljpeg']+ '?' + (new Date()).getTime();
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
            if (json['hint']) this.hint=json['hint'];
            if (this.type=='img') this.urljpeg=json['value']['urljpeg'];
            if (json['gridvalues']) this.gridvalues=json['gridvalues'];
            if (json['directedit']) this.directedit=json['directedit'];
            if (json['preicon']) this.preicon=json['preicon'];
            if (json['posticon']) this.posticon=json['posticon'];
            if (json['listOfValues']&&json['listOfValues']!='') {
                var vals=json['listOfValues'];
                this.hasLOV=true;
                Object.entries(vals).forEach(([key, value], index) => {
                    //console.log("vals ",key,"=",value);
                    this.listOfValues[key]=value as string;
                });
                //console.log("listOfValues ",this.listOfValues);
            }
            if (json['globallov']&&json['globallov']!='') {
                var vals=json['globallov'];
                this.hasLOV=false;
                this.hasGlobalLOV=true;
                this.globallov=json['globallov'];
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
                    this.GDY.D=json['params']['D'];
                    this.GDY.Y=json['params']['Y'];
                    var arr:any=[];
                    var labs:any=[];
                    Object.entries(this.grid2).forEach(([il,l])=>{
                        var line: {[key: string]: any}={};
                        line[this.GDY.D]=l[this.GDY.D];
                        line[this.GDY.Y]=l[this.GDY.Y];
                        arr.push(line);
                        labs.push(l[this.GDY.D]);
                    })
                    arr.sort((a:{[key: string]: any}, b:{[key: string]: any}) => { return a[this.GDY.D] < b[this.GDY.D] ? -1 : 1} );
                    labs.sort();
    
                    this.GDY.data= {
                        type: 'line',
                        data: {
                          datasets: [{
                            label: propjson["elements"][this.GDY.Y].label,
                            data: arr,
                            parsing: {
                              xAxisKey: this.GDY.D,
                              yAxisKey: this.GDY.Y
                            },
                            borderColor: 'rgba(255, 0, 0, 1)',
                            backgroundColor: 'rgba(255, 0, 0, 1)',
                            pointBackgroundColor: 'rgba(255, 0, 0, 1)'
                          }
                          ],
                          labels:labs
                        },
                        options: {
                            animation: false,
                            beginAtZero: false,
                            scales: {
                                x: {
                                    type:'time',
                                    time: {
                                        displayFormats: {
                                            second: 'hh:mm',
                                            minute: 'hh:mm',
                                            hour: 'hh:mm'
                                        }
                                    },                                
                                    //unit: 'second',
                                    adapters: { 
                                        date: {
                                          locale: fr 
                                        }
                                    }
                                }
                                
                            }
                        }    
                    };
                    this.GDY.options= {
                    };    
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
                //console.log("grph : ",this.X,this.Y,this.D);
            }
            this.pushVal.emit('from elts '+this.label);
        } 
    }
    resetValues() {
        this.gridvalues.splice(0);
        this.GXY.data.data.datasets[0].data=[];
        this.GXY.data.data.labels=[];        

        this.GDY.data.data.datasets[0].data=[];
        this.GDY.data.data.labels=[];

        this.GPHD.data.data.datasets[0].data=[];
        this.GPHD.data.data.datasets[1].data=[];
        this.GPHD.data.data.datasets[2].data=[];
        this.GPHD.data.data.datasets[3].data=[];
        this.GPHD.data.data.labels=[];


    }
    pushValues(json:any) {
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
        if (this.graphtype=='PHD') {
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
        if (this.graphtype=='DY') {
            this.GDY.data.data.labels.push(line[this.GDY.D]);
            this.GDY.data.data.labels.sort((a:string, b:string) => { return a < b ? -1 : 1} );
            //console.log('xxxpushGDY data.data.datasets[0].data before',this.GDY.data.data.datasets[0].data);
            this.GDY.data.data.datasets[0].data.push(line2);
            this.GDY.data.data.datasets[0].data.sort((a:{[key: string]: any}, b:{[key: string]: any}) => { return a[this.GDY.D] < b[this.GDY.D] ? -1 : 1} )
            //console.log('xxxpushGDY data.data.datasets[0].data after ',this.GDY.data.data.datasets[0].data);
            //this.GDY.data.data.datasets = this.GDY.data.data.datasets.slice();
        }


        this.pushVal.emit('toto');





    }
}
