import { Mod } from "./mod";


export class Datastore {
    mods: {[key: string]: Mod} ={};
    setAll(json:any) {
        if (json &&json["modules"]) {
            var modules=json["modules"];
            Object.entries(modules).forEach(([key, value], index) => {
              this.mods[key] = new Mod();
              this.mods[key].setAll(key,value);
            });
          }
    
    }

}
 