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
    public messages: string='';
    public nbmess: number=0;  
    currentDevcat?: string='Control';
    currentGroup?: string='';    
    //menu: Map<string,string[]> = new Map([]);
    //private wmenu: Map<string,string[]> = new Map([]);
    public rootmenuDefined:boolean=false;
    public rootmenu: MenuItem[] = [];
    public arr_mess_content: string[] = [];
    public arr_mess_type: string[] = [];
    public current_RA:number=45;
    public current_DEC:number=45;

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
      this.rootmenuDefined=true;
      //console.log(this.rootmenu);
    }
    setAll(modname:string,json:any) {
        //this.label=json['label'];
        this.label=json['infos']['label'];
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
      console.log("resetvalues (mod)",json);
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
    message(modname:string,json:any) {
      var mm=json["message"]["message"];
      var tt=json["message"]["type"];
      this.arr_mess_content.push(mm);
      this.arr_mess_type.push(tt);
      this.messages=this.messages + '<br>'+mm;
      this.prps["message"].value=this.messages;
      this.nbmess=this.nbmess+1;
    }

}
