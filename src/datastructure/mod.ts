import { Prp } from "./prp";
import { MapType } from "@angular/compiler";

interface Menu {
    devcat: string;
    groups: string[];    
};

export class Mod {
    public label: string='';
    prps: {[key: string]: Prp} ={};

    devcats: string[]=[];
    currentDevcat="Info";
    currentGroup="";    
    menu: Map<string,string[]> = new Map([]);
    private wmenu: Map<string,string[]> = new Map([]);


    setAll(modname:string,json:any) {
        this.label=json['moduleLabel'];
        var properties=json["properties"];
        
        Object.entries(properties).forEach(([key, value], indexp) => {
          if (this.prps[key]==undefined) {this.prps[key] = new Prp;}
          this.prps[key].setAll(value);
          
          if (this.menu.has(this.prps[key].devcat)) {
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
          }
          
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
            
            if (this.wmenu.has(this.prps[key].devcat)) {
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
            }
            
            
          });
          this.menu=this.wmenu;

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
            
            if (this.wmenu.has(this.prps[key].devcat)) {
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
            }
            
            
          });
          this.menu=this.wmenu;
  
        });
    }

}
