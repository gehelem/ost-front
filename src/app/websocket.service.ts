import { Injectable, Inject, EventEmitter} from '@angular/core';
import {webSocket, WebSocketSubject, WebSocketSubjectConfig } from 'rxjs/webSocket';
import { retry, RetryConfig } from "rxjs/operators";
import { DOCUMENT } from '@angular/common';

import { Datastore } from "../datastructure/datastore";
import { disconnect } from 'echarts';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  myWebSocket: WebSocketSubject<any>;
  pushVal: EventEmitter<any> = new EventEmitter();
  isconnected:boolean=false;
  datastore: Datastore;
  loglog:string='empty';
  serverurl:string=this.mydocument.location.hostname; 
  serverport:string=this.mydocument.location.port; 

  url : string='ws://'+this.serverurl+':9624';

  constructor(@Inject(DOCUMENT) public mydocument: Document) {
    this.url='ws://'+this.serverurl+':9624';
    if (this.serverport=='4200') {
      this.serverport='80';
    };
  
    this.datastore=new Datastore;
    this.myWebSocket = new WebSocketSubject({
      //url : 'ws://'+this.mydocument.location.hostname+':9624',
      url:this.url,
      deserializer: (e: MessageEvent) => JSON.parse(e.data),
      serializer: (value: any) => JSON.stringify(value),
      openObserver: {
        next: value => {
          this.isconnected=true;
          this.sendMessageToServer("{\"evt\":\"Freadall\"}");
        }
      },
      closeObserver:{
        next: value => {
          this.datastore.mods={};
          this.isconnected=false;
        }
      }
    });
    
    const retryConfig: RetryConfig = {
      delay: 5000,
    };
    this.myWebSocket.pipe(retry(retryConfig)).subscribe({
          next: this.rcv.bind(this),
          error: this.handleError.bind(this)
    });
  }

  rcv(msg: any) { 
    console.log(msg);
    if(msg["evt"]=="moduledump") {
      this.datastore.setAll(msg);
    };
    if(msg["evt"]=="ce" || msg["evt"]=="cp"  || msg["evt"]=="ap" || msg["evt"]=="ae") {
      this.datastore.addProps(msg);
    };
    if(msg["evt"]=="delprop") {
      this.datastore.delProps(msg);
    };
    if(msg["evt"]=="se" || msg["evt"]=="sp" || msg["evt"]=="ap" || msg["evt"]=="ae") {
      this.datastore.setValues(msg);
    };
    if(msg["evt"]=="setattributes") {
      this.datastore.setValues(msg);
    };
    if(msg["evt"]=="pushvalues") {
      this.datastore.pushValues(msg);
      this.pushVal.emit(msg);
    };
    if(msg["evt"]=="resetvalues") {
      this.datastore.resetValues(msg);
    };
    if(msg["evt"]=="lc") {
      this.datastore.setGlobalLovs(msg);
    };

    if(msg["evt"]=="mm") {
      this.datastore.message(msg);
      //console.log("RCV MESSAGE");
    };
    if(msg["evt"]=="me") {
      this.datastore.error(msg);
      //console.log("RCV MESSAGE");
    };
    if(msg["evt"]=="mw") {
      this.datastore.warning(msg);
      //console.log("RCV MESSAGE");
    };


  }
  getSubsPush() {
    return this.pushVal;
  }
  
  handleError(err: any) {
    this.loglog=this.loglog+"****"+err.type+"--"+err.target.url+"*****";
    console.log("-----",err);
  }
  sendMessageToServer(msg: any)   {
    console.log(msg);
    this.loglog=this.loglog+JSON.stringify(msg);
    this.myWebSocket.next(msg) ;
  }  
  setBool(mod:string,prop:string,elt:string,val:boolean) {
    this.sendMessageToServer("{\"evt\":\"Fsetproperty\",\"mod\":\""+mod+"\",\"dta\":{\""+prop+"\":{\"indi\":1,\"elements\":{\""+elt+"\":{\"value\":"+val+"}}}}}");
  }
  isNumber(val: any): boolean { 
    return typeof val === 'number'; 
  }

  setValues(mod:string,prop:string,elts:{[key: string]: any} ) {
    var json: string="{\"evt\":\"Fsetproperty\",\"mod\":\""+mod+"\",\"dta\":{\""+prop+"\":{\"elements\":{";
    var isfirst: boolean=true;
    Object.entries(elts).forEach(([k, v]) => {
      if (!isfirst) json=json+",";
      if (['int','float'].includes(this.datastore.mods[mod].prps[prop].elts[k].type)) {
        let valN:number=+v;
        json=json+"\""+k+"\":{\"value\":"+valN+"}";
      } else {
        json=json+"\""+k+"\":{\"value\":\""+v+"\"}";
      }
      isfirst=false;
    });
    json=json+"}}}}";
    this.sendMessageToServer(json);
  }
  setValue(mod:string,prop:string,val: any ) {
    var json: string="{\"evt\":\"Fsetproperty\",\"mod\":\""+mod+"\",\"dta\":{\""+prop+"\":{\"value\":";
      if (this.isNumber(val)) {
        json=json+val
      } else {
        json=json+"\""+val+"\"";
      }
    json=json+"}}}";
    this.sendMessageToServer(json);
  }
  setElt(mod:string,prop:string,elt:string,val: any ) {
    var json: string="{\"evt\":\"Fsetproperty\",\"mod\":\""+mod+"\",\"dta\":{\""+prop+"\":{\"elements\":{\""+elt+"\":{\"value\":";
      if (['int','float'].includes(this.datastore.mods[mod].prps[prop].elts[elt].type) ){
        let valN:number=+val;
        json=json+valN;
      } else {
        json=json+"\""+val+"\"";
      }
    json=json+"}}}}}";
    this.sendMessageToServer(json);
  }
  clicPreIcon(mod:string,prop:string,elt:string) {
    var json: string="{\"evt\":\"Fpreicon\",\"mod\":\""+mod+"\",\"dta\":{\""+prop+"\":{\"elements\":{\""+elt+"\":{}}}}}";
    this.sendMessageToServer(json);
  }
  clicPostIcon(mod:string,prop:string,elt:string) {
    var json: string="{\"evt\":\"Fposticon\",\"mod\":\""+mod+"\",\"dta\":{\""+prop+"\":{\"elements\":{\""+elt+"\":{}}}}}";
    this.sendMessageToServer(json);
  }
  lineCreate(mod:string,prop:string,elts:{[key: string]: any} ) {
    var json: string="{\"evt\":\"Flcreate\",\"mod\":\""+mod+"\",\"dta\":{\""+prop+"\":{\"elements\":{";
    var isfirst: boolean=true;
    Object.entries(elts).forEach(([k, v]) => {
      if (!isfirst) json=json+",";
      if (this.isNumber(v)) {
        //console.log('isnumber ',k,v);
        json=json+"\""+k+"\":"+v;
      } else {
        //console.log('isnotnumber ',k,v);
        json=json+"\""+k+"\":\""+v+"\"";
      }
      isfirst=false;
    });
    json=json+"}}}}";
    this.sendMessageToServer(json);
  }
  lineUpdate(mod:string,prop:string,line:number ,elts:{[key: string]: any} ) {
    var json: string="{\"evt\":\"Flupdate\",\"mod\":\""+mod+"\",\"dta\":{\""+prop+"\":{\"elements\":{";
    var isfirst: boolean=true;
    Object.entries(elts).forEach(([k, v]) => {
      if (!isfirst) json=json+",";
      if (this.isNumber(v)) {
        //console.log('isnumber ',k,v);
        json=json+"\""+k+"\":"+v;
      } else {
        //console.log('isnotnumber ',k,v);
        json=json+"\""+k+"\":\""+v+"\"";
      }
      isfirst=false;
    });
    json=json+"},\"line\":"+line+"}}}";
    this.sendMessageToServer(json);
  }
  lineSelect(mod:string,prop:string,line:number ) {
    var json: string="{\"evt\":\"Flselect\",\"mod\":\""+mod+"\",\"dta\":{\""+prop+"\":{\"line\":"+line+"}}}";
    this.sendMessageToServer(json);
  }
  lineDelete(mod:string,prop:string,line:number ) {
    var json: string="{\"evt\":\"Fldelete\",\"mod\":\""+mod+"\",\"dta\":{\""+prop+"\":{\"line\":"+line+"}}}";
    this.sendMessageToServer(json);
  }
  lineUp(mod:string,prop:string,line:number ) {
    var json: string="{\"evt\":\"Flup\",\"mod\":\""+mod+"\",\"dta\":{\""+prop+"\":{\"line\":"+line+"}}}";
    this.sendMessageToServer(json);
  }
  lineDown(mod:string,prop:string,line:number  ) {
    var json: string="{\"evt\":\"Fldown\",\"mod\":\""+mod+"\",\"dta\":{\""+prop+"\":{\"line\":"+line+"}}}";
    this.sendMessageToServer(json);
  }
  clearMessages(mod:string) {
    var json: string="{\"evt\":\"Fclearmessages\",\"mod\":\""+mod+"\"}";
    this.sendMessageToServer(json);
  }

}
