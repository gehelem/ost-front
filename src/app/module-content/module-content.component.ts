import { Component, OnInit,Input } from '@angular/core';
import { KeyValue } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';

import { Elt } from 'src/datastructure/elt';
import { Prp } from 'src/datastructure/prp';
import { Mod } from 'src/datastructure/mod';
import { PropBoolComponent } from '../prop-bool/prop-bool.component';
import { WebsocketService } from '../websocket.service';

@Component({
  selector: 'app-module-content',
  templateUrl: './module-content.component.html',
  styleUrls: ['./module-content.component.css']
})
export class ModuleContentComponent implements OnInit,MatMenuModule {
  @Input() mod!: string;
  @Input() data: any;  
  constructor() { }

  status0='\u25ef'; // idle = white
  status1='\ud83d\udfe2'; // OK = green
  status2='\ud83d\udfe1'; // busy = yellow
  status3='\ud83d\udd34'; // error = red
  
  ngOnInit(): void {
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
  originalOrderString = (a: KeyValue<string,string>, b: KeyValue<string,string>): number => {
    return 0;
  }  
}
