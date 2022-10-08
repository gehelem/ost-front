import { Injectable, Inject } from '@angular/core';
import {webSocket, WebSocketSubject, WebSocketSubjectConfig} from 'rxjs/webSocket';
import { DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  myWebSocket: WebSocketSubject<any>;


  constructor(@Inject(DOCUMENT) public mydocument: Document) {
    
    this.myWebSocket = webSocket('ws://'+this.mydocument.location.hostname+':9624');
    this.myWebSocket.subscribe ({
      next: this.rcv.bind(this),
      error: this.handleError.bind(this)
    })
    this.sendMessageToServer("{\"evt\":\"readall\"}");
  }

  rcv(msg: any) {
    console.log(msg);
  }
  handleError(err: any) {
    console.log('handleError' + err);
  }
  sendMessageToServer(msg: any)   {
    this.myWebSocket.next(msg) ;
  }  


}
