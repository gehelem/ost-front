import { Component,ViewChild, OnInit, ElementRef,AfterViewInit } from '@angular/core';
import { KeyValue } from '@angular/common';
import { Elt } from 'src/datastructure/elt';
import { Prp } from 'src/datastructure/prp';
import { Mod,ostmessages } from 'src/datastructure/mod';
import { WebsocketService } from './websocket.service';
import {MatLegacyInputModule as MatInputModule} from '@angular/material/legacy-input';
import { ScreenOrientation } from '@capacitor/screen-orientation';
import { Capacitor } from '@capacitor/core';
import { Zeroconf, ZeroconfOriginal } from "@ionic-native/zeroconf";
import { Device } from '@ionic-native/device/ngx';
import { MatLegacySlider as MatSlider } from '@angular/material/legacy-slider';

export interface DialogData {
  host: string; 
}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})

export class AppComponent implements OnInit,AfterViewInit {
  @ViewChild('mainMenu')
  mainMenu!: ElementRef; 
  title = 'ost-front';
  status0='\u25ef'; // idle = white
  status1='\ud83d\udfe2'; // OK = green
  status2='\ud83d\udfe1'; // busy = yellow
  status3='\ud83d\udd34'; // error = red
  lasturl:string|null='localhost';
  serviceslookup: string[] = [];

  ngOnInit() {
    this.lasturl = localStorage.getItem("lasturl");
    this.ws.serverurl==this.lasturl;    

    document.addEventListener("deviceready", () =>{
      Zeroconf.watchAddressFamily = 'ipv4';    
      Zeroconf.watch("_ostserver_ws._tcp.", "local.").subscribe(result => {
        console.log("Zeroconf Service Changed:" + result.action + "-"+  result.service.hostname + "<");
        if (result.action==='resolved') {
          result.service.ipv4Addresses.forEach( (ip) => {
            console.log(ip);
            this.serviceslookup.push(ip);
          });
          //result.service.ipv6Addresses.forEach( (ip) => {
          //  console.log(ip);
          //  this.serviceslookup.push(ip);
          //});
        }
      });    
    }, false);

    if (Capacitor.getPlatform()==='android') {
      ScreenOrientation.lock({ orientation: 'landscape' });
    }

  }
  
  ngAfterViewInit(): void {
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
    this.ws.bob=!this.ws.bob;
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
    localStorage.setItem("lasturl", url);
    this.ws.reconnectWS(); 
  }
  

}

