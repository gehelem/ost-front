import { Component,ViewChild, OnInit, ElementRef,AfterViewInit,inject } from '@angular/core';
import { KeyValue } from '@angular/common';
import { Elt } from 'src/datastructure/elt';
import { Prp } from 'src/datastructure/prp';
import { Mod,ostmessages } from 'src/datastructure/mod';
import { WebsocketService } from './websocket.service';
import {MatInputModule as MatInputModule} from '@angular/material/input';
import { ScreenOrientation } from '@capacitor/screen-orientation';
import { Capacitor } from '@capacitor/core';
import { Zeroconf, ZeroconfOriginal } from "@ionic-native/zeroconf";
import { Device } from '@ionic-native/device/ngx';
import { MatSlider as MatSlider } from '@angular/material/slider';
import { MatSnackBar } from '@angular/material/snack-bar';

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
  private _snackBar = inject(MatSnackBar);
  newMessage:any;

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

    this.newMessage = this.ws.getNewMessage()
    .subscribe( msg => this.openSnackBar(msg));    


  }
  
  ngAfterViewInit(): void {
  }
  log(m:any) {
     console.log(m); 
  }
  constructor (public ws:WebsocketService) { 
  }

  

  openSnackBar(message: any) {
    //console.log(message);
    Object.entries(message['modules']).forEach(([m, v]) => {
      Object.entries(message['modules'][m]).forEach(([mm, v]) => {
        if (mm=='warning') this._snackBar.open(m + " - " + message['modules'][m][mm][mm], "Close",{duration: 2000,panelClass: ["warning-snackbar"]});
        if (mm=='message') this._snackBar.open(m + " - " + message['modules'][m][mm][mm], "Close",{duration: 2000,panelClass: ["message-snackbar"]});
        if (mm=='error') this._snackBar.open(  m + " - " + message['modules'][m][mm][mm], "Close",{duration: 2000,panelClass: ["error-snackbar"]});
      });    
    });    
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

