import { Injectable, Inject, EventEmitter} from '@angular/core';
import {webSocket, WebSocketSubject, WebSocketSubjectConfig } from 'rxjs/webSocket';
import { retry, RetryConfig } from "rxjs/operators";
import { DOCUMENT } from '@angular/common';

import { Datastore } from "../datastructure/datastore";

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  myWebSocket: WebSocketSubject<any>;
  pushVal: EventEmitter<any> = new EventEmitter();

  datastore: Datastore;
  loglog:string='empty';
  serverurl:string=this.mydocument.location.hostname; 
  constructor(@Inject(DOCUMENT) public mydocument: Document) {
    
    this.datastore=new Datastore;
    this.myWebSocket = new WebSocketSubject({
      url : 'ws://'+this.mydocument.location.hostname+':9624',
      deserializer: (e: MessageEvent) => JSON.parse(e.data),
      serializer: (value: any) => JSON.stringify(value),
      openObserver: {
        next: value => {
          this.sendMessageToServer("{\"evt\":\"Freadall\"}");
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
    if(msg["evt"]=="mm") {
      this.datastore.message(msg);
      //console.log("RCV MESSAGE");
    };


  }
  getSubsPush() {
    return this.pushVal;
  }
  
  handleError(err: any) {
    this.loglog=this.loglog+"****"+err.type+"--"+err.target.url+"*****";
    console.log(err);
  }
  sendMessageToServer(msg: any)   {
    console.log(msg);
    this.loglog=this.loglog+JSON.stringify(msg);
    this.myWebSocket.next(msg) ;
  }  
  setBool(mod:string,prop:string,elt:string,val:boolean) {
    this.sendMessageToServer("{\"evt\":\"Fsetproperty\",\"mod\":\""+mod+"\",\"dta\":{\""+prop+"\":{\"indi\":1,\"elements\":{\""+elt+"\":{\"value\":"+val+"}}}}}");
  }
  isNumber(val: any): boolean { return typeof val === 'number'; }

  setValues(mod:string,prop:string,elts:{[key: string]: any} ) {
    var json: string="{\"evt\":\"Fsetproperty\",\"mod\":\""+mod+"\",\"dta\":{\""+prop+"\":{\"elements\":{";
    var isfirst: boolean=true;
    Object.entries(elts).forEach(([k, v]) => {
      if (!isfirst) json=json+",";
      if (this.isNumber(v)) {
        console.log('isnumber ',k,v);
        json=json+"\""+k+"\":{\"value\":"+v+"}";
      } else {
        console.log('isnotnumber ',k,v);
        json=json+"\""+k+"\":{\"value\":\""+v+"\"}";
      }
      isfirst=false;
    });
    json=json+"}}}}";
    console.log(json);
    this.sendMessageToServer(json);
  }

}
