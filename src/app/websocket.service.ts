import { Injectable, Inject } from '@angular/core';
import {webSocket, WebSocketSubject, WebSocketSubjectConfig } from 'rxjs/webSocket';
import { retry, RetryConfig } from "rxjs/operators";
import { DOCUMENT } from '@angular/common';

import { Datastore } from "../datastructure/datastore";

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  myWebSocket: WebSocketSubject<any>;
  datastore: Datastore;


  constructor(@Inject(DOCUMENT) public mydocument: Document) {
    this.datastore=new Datastore;
    this.myWebSocket = new WebSocketSubject({
      url : 'ws://'+this.mydocument.location.hostname+':9624',
      openObserver: {
        next: value => {
          this.sendMessageToServer("{\"evt\":\"readall\"}");
        }
      }
    });
    const retryConfig: RetryConfig = {
      delay: 1000,
    };
    this.myWebSocket.subscribe ({
      next: this.rcv.bind(this),
      error: this.handleError.bind(this)
    });
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
    if(msg["evt"]=="addprop") {
      this.datastore.addProps(msg);
    };
    if(msg["evt"]=="delprop") {
      this.datastore.delProps(msg);
    };
    if(msg["evt"]=="setpropvalue") {
      this.datastore.setValues(msg);
    };
    if(msg["evt"]=="setattributes") {
      this.datastore.setValues(msg);
    };
    console.log(this.datastore);
  }
  
  handleError(err: any) {
    console.log(err);
  }
  sendMessageToServer(msg: any)   {
    console.log(msg);
    this.myWebSocket.next(msg) ;
  }  


}
