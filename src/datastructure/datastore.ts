import { Mod } from "./mod";
import { Prp } from "./prp";


export class Datastore {
    mods: {[key: string]: Mod} ={};
    folders: string[] = [];
    files: string[] = [];

    //currentMod: string='focus1';
    //currentDev: string='Control';
    //currentGrp: string='';
    currentMod: string='mainctl';
    currentDev: string='Available modules';
    currentGrp: string='';

    setAll(json:any) {
        if (json &&json["modules"]) {
            var modules=json["modules"];
            Object.entries(modules).forEach(([key, value], index) => {
              this.mods[key] = new Mod();
              this.mods[key].setAll(key,value);
              this.mods[key].setMenu();
              Object.entries(this.mods[key].prps).forEach(([keyp, valuep], indexp) => {

              });

            });
            
          }
    }
    addProps(json:any) {
        var modules=json["modules"];
        Object.entries(modules).forEach(([key, value], index) => {
          this.mods[key].addProps(key,value);
          this.mods[key].setMenu();
        });
    }
    delProps(json:any) {
        var modules=json["modules"];
        Object.entries(modules).forEach(([key, value], index) => {
          this.mods[key].delProps(key,value)
          if (Object.keys(this.mods[key].prps).length==0) {
            delete  this.mods[key];
            this.currentMod='mainctl';
            this.currentDev='Info';
            this.currentGrp='';
          }
        });
    }
    setValues(json:any) {
        var modules=json["modules"];
        Object.entries(modules).forEach(([key, value], index) => {
          this.mods[key].setValues(key,value)
        });
    }
    pushValues(json:any) {
      var modules=json["modules"];
      Object.entries(modules).forEach(([key, value], index) => {
        this.mods[key].pushValues(key,value)
      });
    }
    resetValues(json:any) {
      //console.log("resetvalues (dts)",json);
      var modules=json["modules"];
      Object.entries(modules).forEach(([key, value], index) => {
        this.mods[key].resetValues(key,value)
      });
    }
    setGlobalLovs(json:any) {
      var modules=json["modules"];
      Object.entries(modules).forEach(([key, value], index) => {
        this.mods[key].setGlobalLovs(key,value)
      });
    }
    message(json:any) {
      var modules=json["modules"];
      Object.entries(modules).forEach(([key, value], index) => {
        this.mods[key].message(key,value)
      });
    }
    error(json:any) {
      var modules=json["modules"];
      Object.entries(modules).forEach(([key, value], index) => {
        this.mods[key].error(key,value)
      });
    }
    warning(json:any) {
      var modules=json["modules"];
      Object.entries(modules).forEach(([key, value], index) => {
        this.mods[key].warning(key,value)
      });
    }


}
 