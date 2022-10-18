import { Mod } from "./mod";

export class Datastore {
    mods: {[key: string]: Mod} ={};

    //currentMod: string='focus1';
    //currentDev: string='Control';
    //currentGrp: string='root';
    currentMod: string='mainctl';
    currentDev: string='Info';
    currentGrp: string='';

    setAll(json:any) {
        if (json &&json["modules"]) {
            var modules=json["modules"];
            Object.entries(modules).forEach(([key, value], index) => {
              this.mods[key] = new Mod();
              this.mods[key].setAll(key,value);

              Object.entries(this.mods[key].prps).forEach(([keyp, valuep], indexp) => {

              });

            });
            
          }
    }
    addProps(json:any) {
        var modules=json["modules"];
        Object.entries(modules).forEach(([key, value], index) => {
          this.mods[key].addProps(key,value)
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

}
 