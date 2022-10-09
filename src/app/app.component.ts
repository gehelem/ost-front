import { Component } from '@angular/core';
import { KeyValue } from '@angular/common';
import {FlatTreeControl} from '@angular/cdk/tree';
import {MatTreeFlatDataSource, MatTreeFlattener} from '@angular/material/tree';

import { Elt } from 'src/datastructure/elt';
import { Prp } from 'src/datastructure/prp';
import { Mod } from 'src/datastructure/mod';
import { WebsocketService } from './websocket.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ost-front';
  log(m:any) {
     console.log(m); 
  }
  constructor (public ws:WebsocketService) { 
  }

  originalOrderMod = (a: KeyValue<string,Mod>, b: KeyValue<string,Mod>): number => {
    return 0;
  }
  originalOrderPrp = (a: KeyValue<string,Prp>, b: KeyValue<string,Prp>): number => {
    return 0;
  }
  originalOrderElt = (a: KeyValue<string,Elt>, b: KeyValue<string,Elt>): number => {
    return 0;
  }
}
