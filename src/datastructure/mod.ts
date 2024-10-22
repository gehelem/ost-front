import { Prp } from "./prp";
import { MapType } from "@angular/compiler";
import {MatSort,Sort} from '@angular/material/sort';
import {MatTableDataSource as MatTableDataSource} from '@angular/material/table';
import { EventEmitter} from '@angular/core';
import { KeyValue } from '@angular/common';


interface Menu {
    devcat: string;
    groups: string[];    
};

export interface MenuItem {
    label: string;
    order: string;
    children: MenuItem[];
}
export interface ostmessages {
  id: number;
  type: string;
  datetime: string;
  message: string;
}
export interface globlov {
  type: string;
  label:string;
  values:{[key: string|number]: string};
}

export class Mod {
    refreshMessages: EventEmitter<any> = new EventEmitter();
    getRefreshMessages() {
      return this.refreshMessages;
    }

    public label: string='';
    public name: string='';
    prps: {[key: string]: Prp} ={};
    public messages: string='';
    public nbmess: number=0;  
    currentDevcat?: string='Control';
    currentGroup?: string='';    
    //menu: Map<string,string[]> = new Map([]);
    //private wmenu: Map<string,string[]> = new Map([]);
    public rootmenuDefined:boolean=false;
    public rootmenu: MenuItem[] = [];
    public arr_allmessages: Array<ostmessages> = [];
    public arr_messages_content: Array<ostmessages> = [];
    public arr_errors_content: Array<ostmessages> = [];
    public arr_warnings_content: Array<ostmessages> = [];
    messagesSource!: MatTableDataSource<ostmessages>;
    public current_RA:number=45;
    public current_DEC:number=45;
    public lovs: {[key: string]: globlov} ={};
    showinfos=false;
    showwarnings=true;  
    showerrors=true;
    public help='' ;
  

    constructor() {
      this.messagesSource = new MatTableDataSource(this.arr_allmessages);
    }
  
    setMenu() {
      var insertdevcat:Boolean=true;
      var insertgroup:Boolean=true;
      var insertprop:Boolean=true;
      this.rootmenu.splice(0);

      Object.entries(this.prps).forEach(([keyprop, prop], indexp) => {
        insertgroup=true;
        insertdevcat=true;
        insertprop=true; 
        this.rootmenu.forEach((dc) => {
          if(prop.devcat==dc.label) insertdevcat=false;
        });  
        if (insertdevcat) {
          this.rootmenu.push({label:prop.devcat,order:prop.order,children:[]});
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
                  dc.children.push({label:prop.group,order:prop.order,children:[]})
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
                        gr.children.push({label:keyprop,order:prop.order,children:[]});
                    }
                });
            }
          });
        };



      });
      this.rootmenu.forEach((dc) => {
            dc.children.sort((a,b) => a.order < b.order ? -1 : (b.order < a.order ? 1 : 0) );
            dc.children.forEach(gr => {
              gr.children.sort((a,b) => a.order < b.order ? -1 : (b.order < a.order ? 1 : 0) );
            });
      });
      this.rootmenu.push({label:'help',order:'999-02',children:[]});
      this.rootmenu.push({label:'messages',order:'999-03',children:[]});
      if (this.name=="mainctl")       this.rootmenu.push({label:'files',order:'999-04',children:[]});
      this.rootmenu.sort((a,b) => a.order < b.order ? -1 : (b.order < a.order ? 1 : 0) );
      this.rootmenuDefined=true;
      console.log("setmenu");
      console.log(this.rootmenu);
    }
    setAll(modname:string,json:any) {
        this.name=modname;
        this.label=json['infos']['label'];
        var properties=json["properties"];
        var messages=json["messages"];
        this.help= json["help"];        
        var errors=json["errors"];
        var warnings=json["warnings"];
        var globallovs=json["globallovs"];
        Object.entries(properties).forEach(([key, value], indexp) => {
          if (this.prps[key]==undefined) {this.prps[key] = new Prp;}
          this.prps[key].setAll(value);
          if (this.prps[key].devcat=="Contrôle") this.currentDevcat="Contrôle"; // quick workaround, waiting to fix this properly (don't know how ...)
        });
        Object.entries(globallovs).forEach(([key, value], indexp) => {
          let lov= {} as globlov;
          lov.label=globallovs[key]["label"];
          lov.type=globallovs[key]["type"];
          lov.label=globallovs[key]["label"];
          lov.values=globallovs[key]["values"];
          this.lovs[key]=lov;
        });
        Object.entries(messages).forEach((val,indexp) => {
          let mess={} as ostmessages;
          mess.id=indexp;
          mess.datetime=messages[indexp]["datetime"];
          mess.message=messages[indexp]["message"];
          mess.type="m";
          this.arr_allmessages.push(mess);
          this.arr_messages_content.push(mess);
        });
        Object.entries(warnings).forEach((val,indexp) => {
          let mess={} as ostmessages;
          mess.id=indexp;
          mess.datetime=warnings[indexp]["datetime"];
          mess.message=warnings[indexp]["warning"];
          mess.type="w";
          this.arr_allmessages.push(mess);
          this.arr_warnings_content.push(mess);
        });
        Object.entries(errors).forEach((val,indexp) => {
          let mess={} as ostmessages;
          mess.id=indexp;
          mess.datetime=errors[indexp]["datetime"];
          mess.message=errors[indexp]["error"];
          mess.type="e";
          this.arr_allmessages.push(mess);
          this.arr_errors_content.push(mess);
        });
        //console.log(this.arr_mess_content);
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
    setGlobalLovs(modname:string,json:any) {
      var globallovs=json["globallovs"];
      Object.entries(globallovs).forEach(([key, value], indexp) => {
        let lov= {} as globlov;
        lov.label=globallovs[key]["label"];
        lov.type=globallovs[key]["type"];
        lov.label=globallovs[key]["label"];
        lov.values=globallovs[key]["values"];
        this.lovs[key]=lov;
      });
    }
    pushValues(modname:string,json:any) {
      var properties=json["properties"];
      Object.entries(properties).forEach(([key, value], indexp) => {
        this.prps[key].pushValues(value);
      });
    }
    resetValues(modname:string,json:any) {
      //console.log("resetvalues (mod)",json);
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
      var tt=json["message"]["datetime"];
      let mess={} as ostmessages;
      mess.id=this.arr_messages_content.length+1;
      mess.datetime=tt;
      mess.message=mm;
      mess.type="m";
      this.arr_allmessages.push(mess);
      this.arr_messages_content.push(mess);
      this.messagesSource = new MatTableDataSource(this.arr_allmessages);
    }
    error(modname:string,json:any) {
      var mm=json["error"]["error"];
      var tt=json["error"]["datetime"];
      let mess={} as ostmessages;
      mess.id=this.arr_errors_content.length+1;
      mess.datetime=tt;
      mess.message=mm;
      mess.type="e";
      this.arr_allmessages.push(mess);
      this.arr_errors_content.push(mess);
      this.messagesSource = new MatTableDataSource(this.arr_allmessages);
    }
    warning(modname:string,json:any) {
      var mm=json["warning"]["warning"];
      var tt=json["warning"]["datetime"];
      let mess={} as ostmessages;
      mess.id=this.arr_messages_content.length+1;
      mess.datetime=tt;
      mess.message=mm;
      mess.type="w";
      this.arr_allmessages.push(mess);
      this.arr_warnings_content.push(mess);
      this.messagesSource = new MatTableDataSource(this.arr_allmessages);

    }
    clearMessages() {
      console.log('clearmessages');
      this.arr_messages_content.splice(0);
      this.arr_warnings_content.splice(0);
      this.arr_errors_content.splice(0);
      this.arr_allmessages.splice(0);
      this.messagesSource = new MatTableDataSource(this.arr_allmessages);
      this.refreshMessages.emit('clear');
    }

}
