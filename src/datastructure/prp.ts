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
    video:string='';
    GDY: {D:string;Y:string;data:any}={
        D: "",
        Y: "",
        data: {}
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

            if (json["GDY"]) {
                this.GDY.D=json.GDY.D;       
                this.GDY.Y=json.GDY.Y;
                this.GDY.data={
                    type: 'bar', //this denotes tha type of chart
                    data: {// values on X-Axis
                        labels: [], 
                        datasets: [
                        {
                          label: this.elts[this.GDY.Y].label,
                          data: [],
                          backgroundColor: 'blue'
                        }  
                        ]
                    },
                    options: {
                      aspectRatio:2.5
                    }                       
                }; 

                this.GDY.data.data.labels.splice(0);
                this.GDY.data.data.datasets[0].data.splice(0);
                var grid=json["grid"];
                grid.forEach((ll: any[]) => {
                    this.GDY.data.data.labels.push(ll[1]);
                    this.GDY.data.data.datasets[0].data.push(ll[0]);
                });
                console.log('xxxGDY',this.GDY);

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
            var line2: {[key: string]: any}=[];
            Object.entries(this.elts).forEach(([ie,e])=>{
                line2[ie]=line[ic];
                ic++;
            })
            this.grid2.push(line2);

            if (this.GDY.D!='') {
                this.GDY.data.data.labels.push(line[1]);
                this.GDY.data.data.datasets[0].data.push(line[0]);


            }


            console.log('xxxpush',this.grid2);
        }
    }
    resetValues(json:any) {
        this.GDY.data.data.labels.splice(0);
        this.GDY.data.data.datasets[0].data.splice(0);
        this.grid.splice(0);
        this.grid2.splice(0);
        this.grid2=[];
        console.log('xxxreset',this.grid2);

    }
    

}
