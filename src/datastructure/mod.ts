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

    devcats: string[]=[];
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
        console.log("****scan",prop.devcat,"/",prop.group,"/",keyprop);
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
          
          /*if (this.menu.has(this.prps[key].devcat)) {
            const oldgroups=this.menu.get(this.prps[key].devcat);
            if (oldgroups !== undefined) {
              if(oldgroups.indexOf(this.prps[key].group)==-1) {
                  oldgroups.push(this.prps[key].group);
                  this.menu.set(this.prps[key].devcat,oldgroups);
              }
            }
          } else {
            const oldgroups = [this.prps[key].group];
            this.menu.set(this.prps[key].devcat,oldgroups);
          }*/

          /*var insertdevcat:Boolean=true;
          this.rootmenu.forEach((val) => {
            if(this.prps[key].devcat==val.label) insertdevcat=false;
          });  
          if (insertdevcat) {
            this.rootmenu.push({label:this.prps[key].devcat,children:[]});
          };

          var insertgroup:Boolean=true;
          this.rootmenu.forEach((devcat) => {
            if(this.prps[key].devcat==devcat.label) {
                devcat.children.forEach(group => {
                    if(this.prps[key].group==group.label) insertgroup=false;
                });
            }
          });  
          if (insertgroup) {
            this.rootmenu.forEach((devcat) => {
                //console.log(devcat.label);
                if(this.prps[key].devcat==devcat.label) {
                    devcat.children.push({label:this.prps[key].group,children:[]})
                }
              });  
          };*/



          if (this.devcats.indexOf(this.prps[key].devcat)==-1) {
            this.devcats.push(this.prps[key].devcat);
          }
            
        });
    }

    addProps(modname:string,json:any) {
      var properties=json["properties"];
      Object.entries(properties).forEach(([key, value], indexp) => {
        if (this.prps[key]==undefined) {this.prps[key] = new Prp;}
        this.prps[key].setAll(value);
        Object.entries(this.prps).forEach(([key, value], indexp) => {
            
            /*if (this.wmenu.has(this.prps[key].devcat)) {
              const oldgroups=this.wmenu.get(this.prps[key].devcat);
              if (oldgroups !== undefined) {
                if(oldgroups.indexOf(this.prps[key].group)==-1) {
                    oldgroups.push(this.prps[key].group);
                    this.wmenu.set(this.prps[key].devcat,oldgroups);
                }
              }
            } else {
              const oldgroups = [this.prps[key].group];
              this.wmenu.set(this.prps[key].devcat,oldgroups);
            }*/
            
          });
          //this.menu=this.wmenu;

      });
    }
    setValues(modname:string,json:any) {
        var properties=json["properties"];
        Object.entries(properties).forEach(([key, value], indexp) => {
          this.prps[key].setValues(value);
        });
    }
    delProps(modname:string,json:any) {
        var properties=json["properties"];
        Object.entries(properties).forEach(([key, value], indexp) => {
          delete  this.prps[key];

          Object.entries(this.prps).forEach(([key, value], indexp) => {
            
            /*if (this.wmenu.has(this.prps[key].devcat)) {
              const oldgroups=this.wmenu.get(this.prps[key].devcat);
              if (oldgroups !== undefined) {
                if(oldgroups.indexOf(this.prps[key].group)==-1) {
                    oldgroups.push(this.prps[key].group);
                    this.wmenu.set(this.prps[key].devcat,oldgroups);
                }
              }
            } else {
              const oldgroups = [this.prps[key].group];
              this.wmenu.set(this.prps[key].devcat,oldgroups);
            }*/
            
            
          });
          //this.menu=this.wmenu;
  
        });
    }

}
