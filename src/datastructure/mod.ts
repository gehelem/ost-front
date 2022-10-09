import { Prp } from "./prp";

type Menuitem = Array<[string,string]>;
type Menu = Menuitem[];

export class Mod {
    public label?: string;
    prps: {[key: string]: Prp} ={};
    menu:Menu=[];
    devcats: string[]=[];
    currentDevcat="Info";
    

    setAll(modname:string,json:any) {
        this.label=json['moduleLabel'];
        var properties=json["properties"];
        
        Object.entries(properties).forEach(([key, value], indexp) => {
          if (this.prps[key]==undefined) {this.prps[key] = new Prp;}
          this.prps[key].setAll(value);
          var propmenuitem: Menuitem = [];
          propmenuitem.push([this.prps[key].devcat,'tbd']);

          if (this.devcats.indexOf(this.prps[key].devcat)==-1) {
            this.devcats.push(this.prps[key].devcat);
          }
          
        });
        console.log("---------");
        console.log(this.menu);
        console.log("*********");
        //var map = this.menu.reduce();
    }
    addProps(modname:string,json:any) {
      var properties=json["properties"];
      Object.entries(properties).forEach(([key, value], indexp) => {
        if (this.prps[key]==undefined) {this.prps[key] = new Prp;}
        this.prps[key].setAll(value);
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
        });
    }

}
