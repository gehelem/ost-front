import { Component,ViewChild, OnInit, ElementRef } from '@angular/core';
import { KeyValue } from '@angular/common';
import { Elt } from 'src/datastructure/elt';
import { Prp } from 'src/datastructure/prp';
import { Mod,ostmessages } from 'src/datastructure/mod';
import { WebsocketService } from './websocket.service';
import {MatInputModule} from '@angular/material/input';

export interface DialogData {
  host: string;
}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})

export class AppComponent implements OnInit {
  @ViewChild('mainMenu')
  mainMenu!: ElementRef; 
  title = 'ost-front';
  bob = false;
  status0='\u25ef'; // idle = white
  status1='\ud83d\udfe2'; // OK = green
  status2='\ud83d\udfe1'; // busy = yellow
  status3='\ud83d\udd34'; // error = red
  ngOnInit() {
  }
  log(m:any) {
     console.log(m); 
  }
  constructor (public ws:WebsocketService) { 
  }

  originalOrderMod = (a: KeyValue<string,Mod>, b: KeyValue<string,Mod>): number => {
    return a.value.label > b.value.label ? -1 : (b.value.label > a.value.label ? 1 : 0);
  }
  originalOrderPrp = (a: KeyValue<string,Prp>, b: KeyValue<string,Prp>): number => {
    return a.value.order > b.value.order ? -1 : (b.value.order > a.value.order ? 1 : 0);
  }
  originalOrderElt = (a: KeyValue<string,Elt>, b: KeyValue<string,Elt>): number => {
    return a.value.order > b.value.order ? -1 : (b.value.order > a.value.order ? 1 : 0);
  }
  originalOrderString = (a: KeyValue<string,string>, b: KeyValue<string,string>): number => {
    return a.value > b.value ? -1 : (b.value > a.value ? 1 : 0);
  }  
  selectModule(m:string) {
    this.ws.datastore.currentMod=m;
  }
  switchBob() {
    this.bob=!this.bob;
  }
  containsModule(m:string):boolean {
    if (this.ws.datastore.mods[m] != undefined)  {
      return true;
    } else {
      return false;
    }
  }

  onUrlChange(url: string): void {  
    this.ws.serverurl=url;
    this.ws.reconnectWS(); 
  }

}

