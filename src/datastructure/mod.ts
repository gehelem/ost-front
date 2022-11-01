import { Prp } from "./prp";
import { MapType } from "@angular/compiler";

interface Menu {
    devcat: string;
    groups: string[];    
};

export interface MenuItem {
    label: string;
    children: MenuItem[];
}

export class Mod {
    public label: string='';
    prps: {[key: string]: Prp} ={};

    currentDevcat?: string='Control';
    currentGroup?: string='';    
    //menu: Map<string,string[]> = new Map([]);
    //private wmenu: Map<string,string[]> = new Map([]);

    public rootmenu: MenuItem[] = [];
    /*[
        {
            label: 'Parent 1',
            children: [
                {
                    label: 'Child 1'
                },
                {
                    label: 'Child 2'
                }
            ]
        },
        {
            label: 'Parent 2',
        },
    ];*/
    setMenu() {
      var insertdevcat:Boolean=true;
      var insertgroup:Boolean=true;
      var insertprop:Boolean=true;

      Object.entries(this.prps).forEach(([keyprop, prop], indexp) => {
        insertgroup=true;
        insertdevcat=true;
        insertprop=true; 

        this.rootmenu.forEach((dc) => {
          if(prop.devcat==dc.label) insertdevcat=false;
        });  
        if (insertdevcat) {
          this.rootmenu.push({label:prop.devcat,children:[]});
        };
        

        this.rootmenu.forEach((dc) => {
          if(prop.devcat==dc.label) {
              dc.children.forEach(group => {
                  if(prop.group==group.label) insertgroup=false;
              });
          }
        });  
        if (insertgroup) {
          this.rootmenu.forEach((dc) => {
              if(prop.devcat==dc.label) {
                  dc.children.push({label:prop.group,children:[]})
              }
            });  
        };
        
        
        this.rootmenu.forEach((dc) => {
          if(prop.devcat==dc.label) {
              dc.children.forEach(gr => {
                  if(prop.group==gr.label) {
                    gr.children.forEach(pr => {
                      if(keyprop==pr.label) insertprop=false;
                    });    
                  }
              });
          }
        });
        if (insertprop) {
          this.rootmenu.forEach((dc) => {
            if(prop.devcat==dc.label) {
                dc.children.forEach(gr => {
                    if(prop.group==gr.label) {
                        gr.children.push({label:keyprop,children:[]});
                    }
                });
            }
          });
        };
                 


      });
      //console.log(this.rootmenu);
    }
    setAll(modname:string,json:any) {
        this.label=json['moduleLabel'];
        var properties=json["properties"];
        
        Object.entries(properties).forEach(([key, value], indexp) => {
          if (this.prps[key]==undefined) {this.prps[key] = new Prp;}
          this.prps[key].setAll(value);
        });
    }

    addProps(modname:string,json:any) {
      var properties=json["properties"];
      Object.entries(properties).forEach(([key, value], indexp) => {
        if (this.prps[key]==undefined) {this.prps[key] = new Prp;}
        this.prps[key].setAll(value);

      });
      this.setMenu();      
    }
    setValues(modname:string,json:any) {
        var properties=json["properties"];
        Object.entries(properties).forEach(([key, value], indexp) => {
          this.prps[key].setValues(value);
        });
    }
    pushValues(modname:string,json:any) {
      var properties=json["properties"];
      Object.entries(properties).forEach(([key, value], indexp) => {
        this.prps[key].pushValues(value);
      });
    }
    resetValues(modname:string,json:any) {
      var properties=json["properties"];
      Object.entries(properties).forEach(([key, value], indexp) => {
        this.prps[key].resetValues(value);
      });
    }
  delProps(modname:string,json:any) {
        var properties=json["properties"];
        Object.entries(properties).forEach(([key, value], indexp) => {
          delete  this.prps[key];
  
        });
        this.rootmenu=[];
        this.setMenu();

    }

}
