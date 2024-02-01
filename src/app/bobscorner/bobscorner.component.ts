import { Component, OnInit } from '@angular/core';
import { KeyValue } from '@angular/common';
import {DragDropModule} from '@angular/cdk/drag-drop';



import { WebsocketService } from '../websocket.service';
import { Prp } from 'src/datastructure/prp';
import { Mod } from 'src/datastructure/mod';

@Component({
  selector: 'app-bobscorner',
  templateUrl: './bobscorner.component.html',
  styleUrls: ['./bobscorner.component.css'],
})
export class BobscornerComponent implements OnInit {
  
  
  constructor(public ws:WebsocketService) {
    
   }
  ngOnInit(): void {
    
  }
  originalOrderMod = (a: KeyValue<string,Mod>, b: KeyValue<string,Mod>): number => {
    return a.value.label > b.value.label ? -1 : (b.value.label > a.value.label ? 1 : 0);
  }
  originalOrderPrp = (a: KeyValue<string,Prp>, b: KeyValue<string,Prp>): number => {
    return a.value.order > b.value.order ? -1 : (b.value.order > a.value.order ? 1 : 0);
  }
  switchBob(m:string) {
    this.ws.datastore.currentMod=m;
    this.ws.bob=!this.ws.bob;
  }  
}
